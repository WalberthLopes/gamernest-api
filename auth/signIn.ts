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

const signIn: Express = express();

signIn.use(express.json());

signIn.options("/api/sign-in", cors(options));

signIn.post(
  "/api/sign-in",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const { error, user } = await supabase.auth.signIn({
        email,
        password,
      });

      const response = await supabase
        .from("users")
        .select("username")
        .eq("uuid", `${user?.id}`);

      const username = response.data?.[0].username;

      if (error) {
        switch (error.message) {
          case "Invalid login credentials":
            res.json({
              message: "Email/senha inválido.",
              success: false,
            });
          case "Email not confirmed":
            res.json({
              message: "Email não confirmado.",
              success: false,
            });
        }
      } else {
        res.json({
          message: username,
          success: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default signIn;
