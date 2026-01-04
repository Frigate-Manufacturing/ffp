// app/api/paypal/capture/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();

    if (!orderID) {
      return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
    }

    console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
    console.log(process.env.NEXT_PUBLIC_PAYPAL_APP_SECRET);

    // 🔐 NEVER use NEXT_PUBLIC_* for secrets
    const auth = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.NEXT_PUBLIC_PAYPAL_APP_SECRET}`,
    ).toString("base64");

    // 1️⃣ Get access token
    const tokenRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: "grant_type=client_credentials",
      },
    );

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return NextResponse.json(
        { error: "PayPal auth failed", details: err },
        { status: 500 },
      );
    }

    const { access_token } = await tokenRes.json();

    // 2️⃣ Capture order
    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const captureData = await captureRes.json();

    if (!captureRes.ok) {
      return NextResponse.json(
        {
          error: "Capture failed",
          details: captureData,
        },
        { status: 422 },
      );
    }

    return NextResponse.json(captureData);
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
