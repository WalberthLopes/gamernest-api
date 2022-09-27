import Stripe from "stripe";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { supabase } from "../database/supabase";

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: process.env.API_URL,
  preflightContinue: false,
};

const payments: Express = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-08-01",
});

const YOUR_DOMAIN = "https://www.cubecave.net";

payments.options("/api/create-payment-checkout", cors(options));

payments.post(
  "/api/create-payment-checkout",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const { props, userData } = req.body;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: props.uuid,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/shop`,
        cancel_url: `${YOUR_DOMAIN}/shop`,
      });

      const { error } = await supabase.from("user_payments").insert([
        {
          id: session.id,
          uuid: userData.uuid,
          method: session.payment_method_types?.[0],
          key: session.id,
          name: props.name,
          status: session.payment_status,
        },
      ]);

      if (error) {
        console.log(error);
      }

      res.json(session.url);
    } catch (error) {
      console.log(error);
    }
  }
);

export default payments;
