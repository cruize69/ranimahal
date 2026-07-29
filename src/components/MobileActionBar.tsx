import { restaurant } from "@/content/restaurant";

// Persistent order/call bar on phones — most visitors arrive from Google or
// Instagram on mobile, so the primary conversion path stays on screen.
export function MobileActionBar() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-ink/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch gap-2 p-3">
        <a
          href={`tel:${restaurant.phone}`}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-line text-bone text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5c0-.6.4-1 1-1h2.3c.5 0 .9.3 1 .8l.8 3c.1.4 0 .8-.4 1L7.2 10a12 12 0 0 0 5.8 5.8l1.2-1.5c.2-.3.6-.5 1-.4l3 .8c.5.1.8.5.8 1V18c0 .6-.4 1-1 1h-1C9.7 19 4 13.3 4 6V5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Call
        </a>
        <a
          href={restaurant.links.orderOnline}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center px-5 py-3 rounded-full bg-saffron text-ink font-medium text-sm"
        >
          Order Online
        </a>
      </div>
    </div>
  );
}
