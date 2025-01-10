// ./app/utils/create-checkout-link.ts

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

export async function createCheckoutLink(price: string) {
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    success_url: `http://localhost:3000/thank-you`,
    cancel_url: `http://localhost:3000/`,
  };

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);

  if (!checkoutSession.url) {
    throw new Error("Checkout session URL was undefined");
  }

  return checkoutSession.url;
}
