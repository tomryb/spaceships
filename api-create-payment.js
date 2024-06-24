import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Payment processing failed. Please try again." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
