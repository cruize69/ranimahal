"use client";

import { useEffect, useState } from "react";
import { getOpenStatus } from "@/lib/hours";

export function OpenStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<{ isOpen: boolean; label: string } | null>(null);

  useEffect(() => {
    // Depends on the visitor's clock, so it can only be computed after mount —
    // server-rendered markup omits it to avoid a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(getOpenStatus());
  }, []);

  if (!status) return null;

  return (
    <p className={`flex items-center gap-2 text-sm text-muted ${className}`}>
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          status.isOpen ? "bg-saffron" : "bg-muted"
        }`}
        aria-hidden="true"
      />
      {status.label}
    </p>
  );
}
