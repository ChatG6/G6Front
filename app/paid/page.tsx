"use client";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import URLS from "../config/urls";
import PurpleLoader from "@/components/Emergency/loader";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PaidRedirectPage() {
  // 'month' or 'year', extracted from URL
  const [subtype, setSubtype] = useState<"month" | "year">("month");
  const [price, setPrice] = useState("20");

  // Determine price text when subtype changes
  useEffect(() => {
    setPrice(subtype === "year" ? "144" : "20");
  }, [subtype]);

  // On mount: parse URL, set subtype, then checkout
  useEffect(() => {
    // 1. Extract ?billing=monthly or ?billing=annual
    const params = new URLSearchParams(window.location.search);
    const billingParam = params.get("billing");
    const mode = billingParam === "annual" ? "year" : "month";
    setSubtype(mode);

    // 2. Generate priceId based on subtype
    const priceId =
      mode === "year"
        ? process.env.NEXT_PUBLIC_ANNUAL_SUB
        : process.env.NEXT_PUBLIC_MONTHLY_SUB;

    // 3. Create Stripe session and redirect
    const handleCheckout = async () => {
      const subscription = true;
      try {
        const resp = await axios.post(URLS.endpoints.stripe_session, {
          priceId,
          subscription,
        });
        const sessionId = resp.data.sessionId;
        if (sessionId === "Login First") {
          window.location.replace(
            `/api/auth/signin?callbackUrl=${encodeURIComponent(
              "/paid?billing=" + billingParam
            )}`
          );
          return;
        }
        if (sessionId) {
          const stripe = await stripePromise;
          await stripe?.redirectToCheckout({ sessionId });
        }
      } catch (error) {
        console.error("Error during checkout:", error);
      }
    };

    handleCheckout();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
        <PurpleLoader />
    </div>
  );
}
