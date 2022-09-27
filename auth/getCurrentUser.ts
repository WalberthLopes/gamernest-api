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

const getCurrentUser: Express = express();

getCurrentUser.use(express.json());

getCurrentUser.options("/api/get-current-user", cors(options));

getCurrentUser.get(
  "/api/get-current-user",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const session = supabase.auth.session();

      if (session) {
        const response = await supabase
          .from("users")
          .select()
          .match({ email: session.user?.email });

        const data = response.data;

        res.json(data);
      } else {
        res.json(false);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default getCurrentUser;
