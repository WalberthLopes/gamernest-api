import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import { supabase } from "../database/supabase";

const options: cors.CorsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "X-Access-Token",
    "authorization",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: process.env.API_URL,
  preflightContinue: false,
};

const auth: Express = express();

auth.options("/api/login", cors(options));
auth.post("/api/login", cors(options), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const response = await supabase.from("users").select("*").eq("email", email);

  const user = response.data?.[0];

  if (user) {
    bcrypt.compare(password, user.password, (err, response) => {
      if (response) {
        const accessToken = jwt.sign(
          {
            uuid: user.uuid,
            username: user.username,
            perms: user.perms,
            email: user.email,
            coins: user.coins,
          },
          process.env.SECRET_JWT as any,
          {
            expiresIn: "1d",
          }
        );
        res.json({
          auth: true,
          token: accessToken,
        });
      } else
        return res.json({
          auth: false,
          message: "Combinação inválida!",
        });
    });
  } else
    return res.json({
      auth: false,
      message: "Combinação inválida!",
    });
});

auth.options("/api/authentication", cors(options));
auth.get(
  "/api/authentication",
  cors(options),
  (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1];

    if (token) {
      jwt.verify(
        token,
        process.env.SECRET_JWT as any,
        (error: any, decoded: any) => {
          if (error) {
            res.json({
              auth: false,
              message: error.message,
            });
          } else {
            res.json({
              auth: true,
              message: "Token authenticated",
            });
          }
        }
      );
    } else {
      res.json({
        auth: false,
        message: "No token has been found.",
      });
    }
  }
);

export default auth;
