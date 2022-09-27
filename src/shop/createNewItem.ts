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

const createNewItem: Express = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-08-01",
});

createNewItem.options("/api/create-new-item", cors(options));

createNewItem.post(
  "/api/create-new-item",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const { elements, productUrl } = req.body;

      if (
        !elements.name ||
        !elements.commands ||
        !elements.desc ||
        !elements.position ||
        !elements.finalValue ||
        !productUrl
      ) {
        res.json("NÃO ENVIE CAMPOS VÁZIOS!");
      } else {
        const productValue = (elements.finalValue + 0.39).toFixed(2) * 100;

        const newProduct = await stripe.products.create({
          name: elements.name,
          default_price_data: {
            unit_amount: productValue,
            currency: "brl",
          },
        });

        if (!newProduct.default_price) {
          res.json("STRIPE ERROR: DEFAULT PRICE NÃO ENCONTRADO!");
        } else {
          const { error } = await supabase.from("products").insert([
            {
              uuid: newProduct.default_price,
              name: elements.name,
              description: elements.desc,
              price: (elements.finalValue + 0.39).toFixed(2),
              icon: productUrl,
              commands: elements.commands,
              position: elements.position,
            },
          ]);

          if (error) {
            res.json(error.message.toUpperCase());
          } else {
            res.json("PRODUTO CADASTRADO COM SUCESSO!");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default createNewItem;
