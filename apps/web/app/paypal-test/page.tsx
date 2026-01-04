"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";

export default function PayPalTestPage() {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "USD",
        intent: "capture",
        components: "buttons",
      }}
    >
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              PayPal Sandbox Payment
            </h1>
            NEXT_PUBLIC_PAYPAL_CLIENT_ID
            <p className="text-gray-500">This is a sandbox-only transaction.</p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-blue-600">Test Amount</span>
                <span className="font-bold text-blue-700">$10.00</span>
              </div>
              <p className="text-xs text-blue-500">No real money involved.</p>
            </div>

            <PayPalButtons
              style={{
                layout: "vertical",
                color: "blue",
                shape: "rect",
                label: "pay",
              }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: "10.00",
                      },
                      description: "Sandbox test payment",
                    },
                  ],
                  intent: "CAPTURE",
                });
              }}
              onApprove={async (data) => {
                try {
                  // ⛔ NO client-side capture
                  // ✅ Hand off to backend
                  const res = await fetch("/api/payment/capture", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      orderID: data.orderID,
                    }),
                  });

                  const result = await res.json();

                  if (result.status === "COMPLETED") {
                    toast.success("Payment captured successfully");
                  } else {
                    console.error("Unexpected PayPal response:", result);
                    toast.error("Payment not completed");
                  }
                } catch (err) {
                  console.error("Capture error:", err);
                  toast.error("Payment capture failed");
                }
              }}
              onCancel={() => {
                toast.error("Payment cancelled");
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                toast.error("PayPal encountered an error");
              }}
            />
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            Check the browser console for logs.
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
