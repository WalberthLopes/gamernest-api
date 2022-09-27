import { supabase } from "../database/supabase";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { userVerify } from "./userVerify";
import { createUser } from "./createUser";

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

const signUp: Express = express();

signUp.use(express.json());

signUp.options("/api/sign-up", cors(options));

signUp.post(
  "/api/sign-up",
  cors(options),
  async (req: Request, res: Response) => {
    try {
      const { username, email, discord, password } = req.body;

      const response = await userVerify(username, email, discord);

      if (response?.success === false) {
        res.json(response.message);
      } else {
        const { error, user } = await supabase.auth.signUp({
          email,
          password,
        });

        if (user) {
          const uuid = user.id;

          const result = await createUser(
            uuid,
            username,
            email,
            discord,
            password
          );

          if (result === false) {
            res.json({
              message: "Error! Contate o administrador.",
              success: false,
            });
          } else {
            res.json({
              message: "Falta pouco! Verifique seu email.",
              success: true,
            });
          }
        } else {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default signUp;
