// /app/api/create-payment-intent/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { amount, currency = "pkr" } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents/paisa
      currency: currency,
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Payment Intent Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}