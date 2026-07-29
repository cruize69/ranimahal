import { orderedHours, formatWindow } from "@/lib/hours";

/**
 * Days down the left, each service window on its own line to the right.
 * Kept in one place so lunch/dinner never renders inconsistently.
 */
export function HoursList({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {orderedHours().map((h) => (
        <li key={h.day} className="flex justify-between gap-6 py-1">
          <span>{h.day}</span>
          <span className="text-right">
            {h.services.map((s) => (
              <span key={s.name} className="block whitespace-nowrap">
                {formatWindow(s)}
              </span>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
