import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import RoughBorder from "./RoughBorder";

const ITEM_HEIGHT = 56; // px — matches h-14

export interface SlotHandle {
  /** Spin and land on `target` after `durationMs`. Returns a promise that resolves on land. */
  spin: (target: string, durationMs: number) => Promise<void>;
}

interface SlotProps {
  label: string;
  words: string[];
  /** Approx width in tailwind classes; the parent controls layout */
  className?: string;
}

// Shuffle helper
function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const Slot = forwardRef<SlotHandle, SlotProps>(({ label, words, className = "" }, ref) => {
  const stripRef = useRef<HTMLDivElement>(null);
  // Build a long reel: many shuffled copies + the target appended at the end.
  const [reel, setReel] = useState<string[]>(() => shuffled(words));
  const [landed, setLanded] = useState(false);
  const [thunk, setThunk] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    spin(target: string, durationMs: number) {
      return new Promise<void>((resolve) => {
        // Build a fresh long reel and place target at a known final index.
        const copies = 6;
        const built: string[] = [];
        for (let i = 0; i < copies; i++) built.push(...shuffled(words));
        const finalIndex = built.length; // we'll append target here
        built.push(target);
        // Pad after so deceleration overshoot has room visually (not strictly needed)
        built.push(...shuffled(words).slice(0, 4));

        setReel(built);
        setLanded(false);
        setThunk(false);

        // Wait a frame so the DOM updates with the new reel before animating.
        requestAnimationFrame(() => {
          if (!stripRef.current) return;
          const totalDistance = finalIndex * ITEM_HEIGHT;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / durationMs, 1);
            const eased = easeOutCubic(t);
            const y = eased * totalDistance;
            if (stripRef.current) {
              stripRef.current.style.transform = `translateY(${-y}px)`;
            }
            if (t < 1) {
              rafRef.current = requestAnimationFrame(tick);
            } else {
              if (stripRef.current) {
                stripRef.current.style.transform = `translateY(${-totalDistance}px)`;
              }
              setLanded(true);
              setThunk(true);
              window.setTimeout(() => setThunk(false), 350);
              resolve();
            }
          };

          // Reset starting position
          stripRef.current.style.transform = `translateY(0px)`;
          rafRef.current = requestAnimationFrame(tick);
        });
      });
    },
  }));

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className="font-patrick text-sm text-ink/60 mb-1 lowercase tracking-wide">
        {label}
      </span>
      <RoughBorder
        className={`w-full bg-paper ${thunk ? "animate-thunk" : ""}`}
        radius={10}
        strokeWidth={2}
      >
        <div
          className="overflow-hidden px-3"
          style={{ height: ITEM_HEIGHT }}
          aria-label={landed ? reel[reel.length - 5] : `${label} slot`}
        >
          {!landed && reel.length === words.length ? (
            // Initial empty state — dotted "?"
            <div
              className="flex items-center justify-center font-caveat text-ink/30 text-3xl"
              style={{ height: ITEM_HEIGHT }}
            >
              ?
            </div>
          ) : (
            <div
              ref={stripRef}
              className="will-change-transform"
              style={{ transform: "translateY(0px)" }}
            >
              {reel.map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center font-caveat text-ink text-2xl md:text-3xl text-center leading-none"
                  style={{ height: ITEM_HEIGHT }}
                >
                  {w}
                </div>
              ))}
            </div>
          )}
        </div>
      </RoughBorder>
    </div>
  );
});

Slot.displayName = "Slot";

export default Slot;
