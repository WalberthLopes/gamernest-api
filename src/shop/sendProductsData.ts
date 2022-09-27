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

const itemsData: Express = express();

itemsData.use(express.json());

itemsData.options("/api/get-items-data", cors(options));

itemsData.get(
  "/api/get-items-data",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const response = await supabase
        .from("products")
        .select()
        .order("position", { ascending: true });

      res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
);

export default itemsData;
