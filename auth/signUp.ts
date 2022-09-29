import { supabase } from "../database/supabase";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { userVerify } from "./userVerify";

import * as bcrypt from "bcrypt";

const saltRounds = 10;

import { v4 as uuidv4 } from "uuid";

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
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          const { error } = await supabase.from("users").insert([
            {
              uuid: uuidv4(),
              username,
              email,
              discord,
              password: hash,
            },
          ]);

          if (error) {
            console.log(error);

            res.json({
              message: error.message,
              success: false,
            });
          } else {
            res.json({
              message: "Sua conta foi criada com sucesso!",
              success: true,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export default signUp;
