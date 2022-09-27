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

const userKeys: Express = express();

userKeys.options("/api/get-user-keys", cors(options));

userKeys.post(
  "/api/get-user-keys",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const { uuid } = req.body;

      const { data, error } = await supabase
        .from("user_payments")
        .select()
        .eq("uuid", uuid)
        .order("created_at", { ascending: true });

      if (error) {
        console.log(error.message);
        return;
      } else {
        res.json(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default userKeys;
