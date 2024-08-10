const express = require("express");
const cors = require("cors");
require("dotenv").config();

const CLIENT_URL = process.env.CLIENT_URL;
const PORT = process.env.PORT;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const app = express();
app.use(express.json());
app.use(cors());

const stripe = require("stripe")(STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const lineItems = req.body.items.map((item) => {
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
    success_url: `${CLIENT_URL}/`,
    cancel_url: `${CLIENT_URL}/`,
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(PORT, () => console.log(`Server listen to port ${PORT}`));
