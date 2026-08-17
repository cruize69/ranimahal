"use client";

import { useSearchParams } from "next/navigation";
import { restaurant } from "@/content/restaurant";

/** Stripe's hosted checkout redirects back to /catering (success_url/
 * cancel_url in api/create-catering-checkout.js), not to the ordering app's
 * own /order-success page — staying on this page through the whole flow,
 * payment included, is the entire point of the direct-checkout feature.
 * The real order is already created server-side by the Stripe webhook by
 * the time this renders; this is purely the on-page confirmation, no fetch
 * needed. */
export function CateringOrderStatusBanner() {
  const params = useSearchParams();
  const status = params.get("catering_order");
  if (status !== "success" && status !== "cancelled") return null;

  if (status === "success") {
    return (
      <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-[#7FBE6B]/35 bg-[#7FBE6B]/10 p-6 text-center sm:p-7">
        <p className="mb-2 text-lg font-bold text-[#9CD684]">Order confirmed — thank you!</p>
        <p className="text-sm leading-relaxed text-bone/85">
          A confirmation is on its way to your email. We&apos;ll reach out if we need anything else before your
          event. Questions in the meantime? Call{" "}
          <a href={`tel:${restaurant.phone}`} className="font-semibold text-saffron">
            {restaurant.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-white/10 bg-[#17120E] p-6 text-center sm:p-7">
      <p className="mb-2 text-lg font-bold text-bone">Checkout cancelled</p>
      <p className="text-sm leading-relaxed text-muted">
        No charge was made. Your package selections are still below whenever you&apos;re ready.
      </p>
    </div>
  );
}
