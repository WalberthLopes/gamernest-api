import Stripe from "stripe";
import express, { Express, Request, Response } from "express";

import { supabase } from "../database/supabase";
import { sendMail } from "../mail/sendMail";

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as any;

const checkoutFullfillment: Express = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-08-01",
});

checkoutFullfillment.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    let event: Stripe.Event;

    const payload = req.body;
    const sig = req.headers["stripe-signature"];

    if (sig == null) {
      throw new Error("No stripe signature found!");
    }

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
      console.log(`❌ Failed: ${err.message}`);
      res.status(400).send(`Webhook failed: ${err.message}`);
      return;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session: any = event.data.object;

        // A compra foi realizada, porém o pagamento ainda está sendo processado
        // Ela será armazenada no banco com status "awaiting"
        const { error } = await supabase
          .from("user_payments")
          .update({ status: "awaiting" })
          .match({ id: session.id });

        sendMail(session);

        if (error) {
          console.log(error);
        }

        // A compra foi realizada e o pagamento foi processado
        if (session.payment_status === "paid") {
          const { error } = await supabase
            .from("user_payments")
            .update({ status: session.payment_status })
            .match({ id: session.id });

          if (error) {
            console.log(error);
          }
        }

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session: any = event.data.object;

        const { error } = await supabase
          .from("user_payments")
          .update({ status: session.payment_status })
          .match({ id: session.id });

        sendMail(session);

        if (error) {
          console.log(error);
        }

        break;
      }

      case "checkout.session.async_payment_failed": {
        const session: any = event.data.object;

        // Registrar a compra no banco e informar que ela não foi paga
        // A compra não será descartada para fins de marketing
        const { error } = await supabase
          .from("user_payments")
          .update({ status: session.payment_status })
          .match({ id: session.id });

        sendMail(session);

        if (error) {
          console.log(error);
        }

        break;
      }
    }

    res.status(200);
  }
);

export default checkoutFullfillment;
