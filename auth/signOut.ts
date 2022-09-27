import { supabase } from "../database/supabase";
import express, { Express, Request, Response } from "express";
import cors from "cors";

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

const signOut: Express = express();

signOut.use(express.json());

signOut.options("/api/sign-out", cors(options));

signOut.get(
  "/api/sign-out",
  cors(options),
  async (req: Request, res: Response) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      res.json(false);
    } else {
      res.json(true);
    }
  }
);

export default signOut;
