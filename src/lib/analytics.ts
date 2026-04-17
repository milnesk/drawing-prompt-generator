// Modular Google Analytics helper.
// The Measurement ID is set in index.html — replace G-XXXXXXXXXX there.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  } else {
    // Fallback so dev still sees something in the console
    // eslint-disable-next-line no-console
    console.debug("[analytics] (no gtag)", name, params);
  }
}
