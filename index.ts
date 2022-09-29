import express, { Express, Request, Response } from "express";
import "dotenv/config";

// Auth
import signUp from "./auth/signUp";

// Stripe api
import payments from "./shop/paymentCheckout";
import itemsData from "./shop/sendProductsData";
import checkoutFullfillment from "./shop/checkoutFullfillment";

// User profile informations
import userKeys from "./account/getUserKeys";
import createNewItem from "./shop/createNewItem";
import auth from "./auth/authentication";

const app: Express = express();
const port = process.env.PORT || 1234;

app.use(checkoutFullfillment);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("CubeCave MC");
});

// Auth
app.use(signUp);
app.use(auth);

// Stripe api
app.use(payments);
app.use(itemsData);
app.use(createNewItem);

// User profile informations
app.use(userKeys);

app.listen(port, () => {
  console.log("*" + "\n" + "Server is running on port:", port + "\n" + "*");
});
