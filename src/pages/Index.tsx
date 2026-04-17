import { useRef, useState } from "react";
import Slot, { SlotHandle } from "@/components/Slot";
import RoughBorder from "@/components/RoughBorder";
import {
  assembleSentence,
  categoryWords,
  rollPrompt,
  type CategoryKey,
  type PromptParts,
} from "@/lib/prompts";
import { trackEvent } from "@/lib/analytics";

const SLOT_ORDER: { key: CategoryKey; label: string }[] = [
  { key: "subject", label: "subject" },
  { key: "action", label: "action" },
  { key: "subject2", label: "& this" },
  { key: "mood", label: "mood" },
  { key: "setting", label: "setting" },
  { key: "styleHint", label: "style" },
];

const Index = () => {
  const slotRefs = useRef<Record<CategoryKey, SlotHandle | null>>({
    subject: null,
    action: null,
    subject2: null,
    mood: null,
    setting: null,
    styleHint: null,
  });
  const [sentence, setSentence] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [revealKey, setRevealKey] = useState(0);

  const handleGenerate = async () => {
    if (spinning) return;
    trackEvent("generate_prompt", { event_category: "engagement" });
    setSpinning(true);
    setSentence(null);

    const parts: PromptParts = rollPrompt();
    const baseDuration = 2600;
    const stagger = 150;

    const promises = SLOT_ORDER.map(({ key }, i) => {
      const ref = slotRefs.current[key];
      if (!ref) return Promise.resolve();
      const duration = baseDuration + i * stagger + Math.random() * 200;
      return ref.spin(parts[key], duration);
    });

    await Promise.all(promises);
    setSentence(assembleSentence(parts));
    setRevealKey((k) => k + 1);
    setSpinning(false);
  };

  return (
    <main className="min-h-screen bg-paper paper-texture">
      <div className="mx-auto max-w-3xl px-5 py-10 md:py-14 flex flex-col items-center">
        {/* Title */}
        <header className="text-center mb-8 md:mb-10">
          <h1 className="font-caveat text-5xl md:text-7xl text-ink leading-none">
            What should I draw?
          </h1>
          <svg
            className="mx-auto mt-1"
            width="260"
            height="14"
            viewBox="0 0 260 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8 C 50 2, 110 12, 160 5 S 245 10, 257 6"
              stroke="hsl(var(--accent-ink))"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </header>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={spinning}
          className="group relative disabled:opacity-80 mb-8"
          aria-label="Generate prompt"
        >
          <RoughBorder
            radius={999}
            strokeWidth={2.5}
            doubled
            fill="hsl(var(--ink) / 0.08)"
            className="px-10 py-3 md:px-14 md:py-4 transition-transform duration-200 group-hover:-rotate-1 group-active:scale-95"
          >
            <span className="font-caveat text-3xl md:text-4xl text-ink">
              {spinning ? "spinning…" : "Generate prompt"}
            </span>
          </RoughBorder>
        </button>

        {/* Slots */}
        <section className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-8">
          {SLOT_ORDER.map(({ key, label }) => (
            <Slot
              key={key}
              ref={(el) => {
                slotRefs.current[key] = el;
              }}
              label={label}
              words={categoryWords[key] as unknown as string[]}
            />
          ))}
        </section>

        {/* Assembled sentence */}
        <section className="w-full min-h-[5rem] mb-8 flex items-center justify-center">
          {sentence && (
            <div key={revealKey} className="animate-fade-in text-center px-2">
              <p className="font-caveat text-2xl md:text-3xl text-ink leading-snug">
                {sentence}
              </p>
              <svg
                className="mx-auto mt-2"
                width="220"
                height="10"
                viewBox="0 0 220 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 6 C 60 1, 130 9, 217 4"
                  stroke="hsl(var(--ink))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                />
              </svg>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Index;
