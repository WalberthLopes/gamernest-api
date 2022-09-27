import express, { Express, Request, Response } from "express";
import "dotenv/config";

// Auth
import getCurrentUser from "./auth/getCurrentUser";
import signIn from "./auth/signIn";
import signUp from "./auth/signUp";
import signOut from "./auth/signOut";

// Stripe api
import payments from "./shop/paymentCheckout";
import itemsData from "./shop/sendProductsData";
import checkoutFullfillment from "./shop/checkoutFullfillment";

// User profile informations
import userKeys from "./account/getUserKeys";
import createNewItem from "./shop/createNewItem";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(checkoutFullfillment);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Gamernest Entertainment");
});

// Auth
app.use(getCurrentUser);
app.use(signIn);
app.use(signUp);
app.use(signOut);

// Stripe api
app.use(payments);
app.use(itemsData);
app.use(createNewItem);

// User profile informations
app.use(userKeys);

app.listen(port, () => {
  console.log("*" + "\n" + "Server is running on port:", port + "\n" + "*");
});
