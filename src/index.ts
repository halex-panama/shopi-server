import express, { Express, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import Stripe from "stripe";

const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

type CartItem = {
  title: string;
  id: string | number;
  discountedPrice: number;
  quantity: number;
};

const app: Express = express();
app.use(express.json());
app.use(cors());

const stripe = new Stripe(STRIPE_SECRET_KEY);

app.listen(PORT, () => console.log("Server is running"));

app.post("/create-checkout-session", async (req, res) => {
  const lineItems: CartItem[] = req.body.items.map((item: CartItem) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: Math.floor(item.discountedPrice * 100),
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${CLIENT_URL}/checkout-succes`,
    cancel_url: `${CLIENT_URL}/checkout-failed`,
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});
