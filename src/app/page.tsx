import { Metadata } from "next";

import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getStripeProducts } from "./utils/get-stripe-products";
import { createCheckoutLink } from "./utils/create-checkout-link";
import { PrismicNextImage } from "@prismicio/next";

// This component renders your homepage.
//
// Use Next's generateMetadata function to render page metadata.
//
// Use the SliceZone to render the content of the page.

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const home = await client.getByUID("page", "home");

  return {
    title: prismic.asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}

export default async function Index() {
  // The client queries content from the Prismic API
  const client = createClient();
  const home = await client.getByUID("page", "home");

  const products = await getStripeProducts();

  const productsWithCheckoutLinks = await Promise.all(
    products.map(async (prod) => {
      const checkoutLink = await createCheckoutLink(prod.id);

      return {
        ...prod,
        checkoutLink,
      };
    })
  );

  return (
    <>
      <SliceZone slices={home.data.slices} components={components} />;
      <section className="grid grid-cols-3 items-center w-full gap-20">
        {/* Loop through our products and display a product card for each of them */}
        {productsWithCheckoutLinks.map(
          ({ product: prod, unit_amount, checkoutLink }) => {
            if (!unit_amount) return;

            return (
              <div key={prod.id} className="flex flex-col items-center">
                <div className="flex flex-col gap-4">
                  <div className="w-64 h-64 relative rounded-lg overflow-hidden">
                    <img src={prod.images[0]} alt="" />
                  </div>
                  <div className="self-start">
                    <h2 className="text-xl font-bold">
                      {prod.name} : €{unit_amount / 100}
                    </h2>
                    <p className="text-base max-w-[256px]">
                      {prod.description}
                    </p>
                  </div>
                  <a
                    className="w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-lg"
                    href={checkoutLink}
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            );
          }
        )}
      </section>
    </>
  );
}
