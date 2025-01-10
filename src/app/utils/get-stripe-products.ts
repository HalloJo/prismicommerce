import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function getStripeProducts() {
  const { data } = await stripe.prices.list({
    expand: ["data.product"],
  });

  const products = data as (Stripe.Price & { product: Stripe.Product })[];

  return products;
}
