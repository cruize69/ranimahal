"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { getIncomingAdParams } from "@/lib/orderUrl";

const CLERK_ENABLED = typeof process !== "undefined" && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

function fmt(n: number) {
  return "$" + n.toFixed(2);
}

// Tomorrow's date in NY time, same "en-CA" + America/New_York trick the
// backend's getNYDateString uses — this is only the UI's <input min="">
// nicety (blocks same-day dates in the native picker before the user even
// submits); api/create-catering-checkout.js re-derives and enforces this
// same floor server-side, since a client-side min attribute is trivially
// bypassable and was never the real gate.
function tomorrowNYDateString(): string {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(tomorrow);
}

type ZoneStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "served"; zoneLabel: string; eta: string }
  | { state: "out_of_zone"; message: string }
  | { state: "error" };

export type CateringCheckoutPackage = {
  itemId: string;
  name: string;
  price: number;
  label: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  pkg: CateringCheckoutPackage;
  guests: number;
};

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#1c1814] px-3.5 py-3 text-sm text-bone outline-none placeholder:text-muted/60 focus:border-saffron/50";
const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted";

// Same options, defaults, and reasoning as the ordering app's own
// TipSelector (ranimahal-backend/src/components/CartDrawer.jsx) — kept in
// lockstep on purpose rather than inventing catering-specific numbers.
// Delivery pre-selects 18% (a fair, common default, one tap away from
// changing to anything including "No tip"); pickup starts at "No tip"
// since there's no driver to tip on a counter pickup.
type TipKey = number | "custom";
const DELIVERY_TIP_OPTIONS: { key: TipKey; label: string }[] = [
  { key: 0, label: "No tip" },
  { key: 0.15, label: "15%" },
  { key: 0.18, label: "18%" },
  { key: 0.2, label: "20%" },
  { key: "custom", label: "Custom" },
];
const PICKUP_TIP_OPTIONS: { key: TipKey; label: string }[] = [
  { key: 0, label: "No tip" },
  { key: 0.1, label: "10%" },
  { key: 0.15, label: "15%" },
  { key: 0.2, label: "20%" },
  { key: "custom", label: "Custom" },
];

function TipSelector({
  tipPct,
  setTipPct,
  tipCustom,
  setTipCustom,
  subtotal,
  isDelivery,
}: {
  tipPct: TipKey;
  setTipPct: (v: TipKey) => void;
  tipCustom: string;
  setTipCustom: (v: string) => void;
  subtotal: number;
  isDelivery: boolean;
}) {
  const options = isDelivery ? DELIVERY_TIP_OPTIONS : PICKUP_TIP_OPTIONS;
  const isUntouchedDefault = isDelivery && tipPct === 0.18;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className={labelClass + " mb-0"}>{isDelivery ? "Driver tip" : "Staff tip (optional)"}</span>
        <span className="text-[11px] text-muted">{isDelivery ? "100% to your driver" : "100% shared with staff"}</span>
      </div>
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const active = tipPct === opt.key;
          const amount = typeof opt.key === "number" && opt.key > 0 ? fmt(subtotal * opt.key) : null;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setTipPct(opt.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg border px-1 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-saffron/50 ${
                active ? "border-saffron bg-saffron/15 text-saffron" : "border-white/10 text-bone hover:border-white/20"
              }`}
            >
              <span className="text-xs font-semibold">{opt.label}</span>
              <span className={`text-[10px] ${active ? "opacity-85" : "opacity-60"}`}>{amount ?? " "}</span>
            </button>
          );
        })}
      </div>
      {isUntouchedDefault && (
        <p className="mt-1.5 text-[10.5px] text-muted">
          18% suggested — tap any option above to change it, including <strong className="text-bone">No tip</strong>.
        </p>
      )}
      {tipPct === "custom" && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-sm text-muted">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={tipCustom}
            onChange={(e) => setTipCustom(e.target.value)}
            autoFocus
            className={inputClass}
          />
        </div>
      )}
      {typeof tipPct === "number" && tipPct > 0 && !isUntouchedDefault && (
        <p className="mt-1.5 text-[11px] text-muted">
          {fmt(subtotal * tipPct)} ({Math.round(tipPct * 100)}%) tip on this order
        </p>
      )}
    </div>
  );
}

/** The whole point of this modal: clicking "Add to Order" on /catering never
 * leaves the page — no redirect into the full retail ordering app (menu,
 * upsells, buffet promos, none of which apply to a catering order that's
 * already picked its package and headcount), no reload. The one and only
 * hop is the final "Pay Now" tap, which goes to Stripe's own hosted payment
 * page — a real domain change, but a single, expected, trusted one, not a
 * detour through an unrelated storefront first.
 *
 * Split into a plain wrapper + *Inner (same pattern as AccountChip.tsx)
 * rather than conditionally calling useUser()/useAuth() — CLERK_ENABLED is
 * a build-time constant, but conditionally calling hooks based on it still
 * breaks the rules-of-hooks contract a component is supposed to hold. Only
 * the branch that's actually going to render calls them, unconditionally. */
export function CateringCheckoutModal(props: Props) {
  if (!props.open) return null;
  return CLERK_ENABLED ? <CateringCheckoutModalInner {...props} /> : <CateringCheckoutModalGuest {...props} />;
}

function CateringCheckoutModalGuest(props: Props) {
  return <CateringCheckoutModalBody {...props} isLoaded={true} isSignedIn={false} signedInEmail="" getToken={async () => null} />;
}

function CateringCheckoutModalInner(props: Props) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const signedInEmail = user?.primaryEmailAddress?.emailAddress ?? "";
  return (
    <CateringCheckoutModalBody {...props} isLoaded={isLoaded} isSignedIn={!!isSignedIn} signedInEmail={signedInEmail} getToken={getToken} />
  );
}

type BodyProps = Props & {
  isLoaded: boolean;
  isSignedIn: boolean;
  signedInEmail: string;
  getToken: () => Promise<string | null>;
};

function CateringCheckoutModalBody({ open, onClose, pkg, guests, isLoaded, isSignedIn, signedInEmail, getToken }: BodyProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [orderMode, setOrderMode] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState({ street: "", apt: "", city: "", zip: "" });
  const [notes, setNotes] = useState("");
  const [tipPct, setTipPct] = useState<TipKey>(0);
  const [tipCustom, setTipCustom] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reorderToken, setReorderToken] = useState<string | undefined>(undefined);
  const [zoneStatus, setZoneStatus] = useState<ZoneStatus>({ state: "idle" });
  const minEventDate = tomorrowNYDateString();

  useEffect(() => {
    if (signedInEmail) setEmail(signedInEmail);
  }, [signedInEmail]);

  // `?reorder=<token>` (win-back/reorder-voucher links) IS itself a real,
  // directly-redeemable token — used as-is. `?invite=<code>` is different:
  // it's a public shareCode, not a token, and has to be exchanged for one
  // via /api/referral-claim first (same-origin proxied to the ordering
  // app) — mirrors exactly what RaniMahal.jsx's own ?invite= handler does.
  // Neither ever discounts the catering price itself (catering is always
  // flat-rate); this only exists so a referral conversion via catering
  // still credits the referrer instead of silently going nowhere.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const reorder = params.get("reorder");
    if (reorder) {
      setReorderToken(reorder);
      return;
    }
    const invite = params.get("invite");
    if (invite) {
      fetch(`/api/referral-claim?code=${encodeURIComponent(invite)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.token) setReorderToken(data.token);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Same behavior as RaniMahal.jsx's own orderMode -> tipPct effect: switching
  // to delivery re-defaults to the suggested 18%, switching to pickup drops
  // back to no tip — always adjustable, never locked in.
  const isDelivery = orderMode === "delivery";
  useEffect(() => {
    setTipPct(isDelivery ? 0.18 : 0);
  }, [isDelivery]);

  // Live zip verification — same "are we actually sure yet" semantics the
  // ordering app's own CartDrawer.jsx uses (isCompleteZip vs a confirmed-
  // out-of-zone zip), just fetched from api/delivery-zone-check.js since
  // that config isn't reachable from this repo directly. Debounced so it
  // doesn't fire on every keystroke; the real enforcement is still
  // server-side in api/create-catering-checkout.js regardless of what this
  // shows — this is purely so a customer finds out BEFORE paying instead
  // of after, and doesn't wait until an error mid-checkout.
  useEffect(() => {
    if (!isDelivery) {
      setZoneStatus({ state: "idle" });
      return;
    }
    const zip = address.zip.trim();
    if (zip.length < 5) {
      setZoneStatus({ state: "idle" });
      return;
    }
    setZoneStatus({ state: "checking" });
    const timer = setTimeout(() => {
      fetch(`/api/delivery-zone-check?zip=${encodeURIComponent(zip)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.status === "served") setZoneStatus({ state: "served", zoneLabel: data.zoneLabel, eta: data.eta });
          else if (data.status === "out_of_zone") setZoneStatus({ state: "out_of_zone", message: data.message });
          else setZoneStatus({ state: "idle" });
        })
        .catch(() => setZoneStatus({ state: "error" }));
    }, 500);
    return () => clearTimeout(timer);
  }, [isDelivery, address.zip]);

  if (!open) return null;

  const subtotal = pkg.price * guests;
  const tipAmount = tipPct === "custom" ? Math.max(0, parseFloat(tipCustom) || 0) : subtotal * tipPct;
  const total = subtotal + tipAmount;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email — we'll send your confirmation there.");
      return;
    }
    if (!eventDate) {
      setError("Please tell us your event date.");
      return;
    }
    if (eventDate < minEventDate) {
      setError("Same-day catering isn't available — please choose a date starting tomorrow.");
      return;
    }
    if (!eventTime) {
      setError("Please tell us your event time.");
      return;
    }
    if (isDelivery && (!address.street.trim() || !address.city.trim() || !address.zip.trim())) {
      setError("Please fill in the full delivery address.");
      return;
    }
    if (isDelivery && zoneStatus.state === "out_of_zone") {
      setError(zoneStatus.message);
      return;
    }
    setSubmitting(true);
    try {
      const token = isSignedIn ? await getToken().catch(() => null) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/create-catering-checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          itemId: pkg.itemId,
          guests,
          guestEmail: email.trim(),
          guestPhone: phone.trim(),
          eventDate,
          eventTime,
          orderMode,
          deliveryAddress: isDelivery ? address : null,
          notes,
          tip: tipAmount,
          utm: getIncomingAdParams(),
          returnPath: window.location.pathname,
          reorderToken,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Something went wrong. Please try again or call us.");
      // The one accepted hop — Stripe's own hosted payment page.
      window.location.href = data.url;
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 py-10 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#110D0A] p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted hover:text-bone"
        >
          ✕
        </button>

        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-saffron">
          {pkg.name}
          {pkg.label ? ` · ${pkg.label}` : ""}
        </p>
        <p className="mb-5 font-display text-2xl font-bold text-bone">
          {guests} guests · {fmt(subtotal)}
        </p>

        {!isLoaded ? (
          <div className="py-8 text-center text-sm text-muted">Loading…</div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className={labelClass} htmlFor="cc-email">
                Email *
              </label>
              <input
                id="cc-email"
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                readOnly={!!signedInEmail}
                required
              />
              {signedInEmail && (
                <p className="mt-1 text-xs text-muted">Signed in — this order will be added to your account.</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="cc-phone">
                Phone (optional)
              </label>
              <input
                id="cc-phone"
                type="tel"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(914) 555-0123"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass} htmlFor="cc-date">
                  Event date *
                </label>
                <input
                  id="cc-date"
                  type="date"
                  className={inputClass}
                  value={eventDate}
                  min={minEventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <label className={labelClass} htmlFor="cc-time">
                  Event time *
                </label>
                <input
                  id="cc-time"
                  type="time"
                  className={inputClass}
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <p className="-mt-2.5 text-[11px] text-muted">
              Same-day catering isn&apos;t available — earliest date is tomorrow.
            </p>

            <div>
              <span className={labelClass}>Pickup or delivery</span>
              <div className="flex gap-2">
                {(["pickup", "delivery"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOrderMode(mode)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-saffron/50 ${
                      orderMode === mode
                        ? "border-saffron bg-saffron/15 text-saffron"
                        : "border-white/10 text-muted hover:border-white/20"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {isDelivery && (
              <div className="flex flex-col gap-3 rounded-xl border border-white/5 bg-[#17120E]/60 p-3.5">
                <input
                  className={inputClass}
                  placeholder="Street address"
                  value={address.street}
                  onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                  required={isDelivery}
                />
                <div className="flex gap-3">
                  <input
                    className={inputClass}
                    placeholder="Apt / suite"
                    value={address.apt}
                    onChange={(e) => setAddress((a) => ({ ...a, apt: e.target.value }))}
                  />
                  <input
                    className={inputClass}
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                    required={isDelivery}
                  />
                  <input
                    className={inputClass}
                    placeholder="ZIP"
                    value={address.zip}
                    onChange={(e) => setAddress((a) => ({ ...a, zip: e.target.value }))}
                    required={isDelivery}
                  />
                </div>
                {zoneStatus.state === "checking" && (
                  <p className="text-xs text-muted">Checking delivery area…</p>
                )}
                {zoneStatus.state === "served" && (
                  <p className="text-xs text-[#9CD684]">
                    ✓ We deliver here — {zoneStatus.zoneLabel.replace(/^Zone \d+:\s*/, "")} ({zoneStatus.eta})
                  </p>
                )}
                {zoneStatus.state === "out_of_zone" && (
                  <p className="text-xs text-rose-300">{zoneStatus.message}</p>
                )}
              </div>
            )}

            <TipSelector
              tipPct={tipPct}
              setTipPct={setTipPct}
              tipCustom={tipCustom}
              setTipCustom={setTipCustom}
              subtotal={subtotal}
              isDelivery={isDelivery}
            />

            <div>
              <label className={labelClass} htmlFor="cc-notes">
                Notes (optional)
              </label>
              <textarea
                id="cc-notes"
                className={`${inputClass} min-h-[60px] resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary needs, drop-off instructions…"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 w-full rounded-full bg-gradient-to-r from-saffron via-[#f5b84c] to-[#d69528] py-3.5 text-sm font-bold text-[#080706] shadow-lg shadow-saffron/20 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70"
            >
              {submitting ? "Redirecting to payment…" : `Pay ${fmt(total)} →`}
            </button>
            <p className="text-center text-[11px] text-muted/70">
              Payment is handled securely by Stripe — you&apos;ll complete your card details on their page.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
