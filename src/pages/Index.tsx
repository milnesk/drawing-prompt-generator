import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!sentence) return;
    try {
      await navigator.clipboard.writeText(sentence);
      setCopied(true);
      toast.success("Prompt copied!");
      trackEvent("copy_prompt", { event_category: "engagement" });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — try again");
    }
  };

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
        <section className="w-full min-h-[5rem] mb-8 flex flex-col items-center justify-center">
          {sentence && (
            <div key={revealKey} className="animate-fade-in text-center px-2 w-full">
              {/* Wobbly divider with ✎ marker */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <svg width="120" height="8" viewBox="0 0 120 8" fill="none" aria-hidden="true">
                  <path
                    d="M2 4 C 25 1, 50 7, 75 3 S 110 6, 118 4"
                    stroke="hsl(var(--ink))"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
                <span className="font-caveat text-xl leading-none -mt-1 text-ink/60" aria-hidden="true">✎</span>
                <svg width="120" height="8" viewBox="0 0 120 8" fill="none" aria-hidden="true">
                  <path
                    d="M2 4 C 25 7, 50 1, 75 5 S 110 2, 118 4"
                    stroke="hsl(var(--ink))"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
              </div>

              {/* Sentence with highlighter swipe behind */}
              <p className="relative inline-block font-caveat text-2xl md:text-3xl text-ink leading-snug px-2">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-[35%] bottom-[10%] -rotate-[0.6deg]"
                  style={{
                    background:
                      "linear-gradient(100deg, hsl(var(--accent-ink) / 0) 0%, hsl(var(--accent-ink) / 0.22) 8%, hsl(var(--accent-ink) / 0.28) 92%, hsl(var(--accent-ink) / 0) 100%)",
                    filter: "url(#highlighter-rough)",
                    zIndex: 0,
                  }}
                />
                <span className="relative z-10">{sentence}</span>
                <svg width="0" height="0" className="absolute" aria-hidden="true">
                  <defs>
                    <filter id="highlighter-rough">
                      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="5" />
                      <feDisplacementMap in="SourceGraphic" scale="3" />
                    </filter>
                  </defs>
                </svg>
              </p>

              <button
                onClick={handleCopy}
                className="mt-4 inline-flex items-center gap-1.5 font-patrick text-ink/70 hover:text-ink text-base md:text-lg transition-colors group"
                aria-label="Copy prompt to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4 group-hover:-rotate-6 transition-transform" />
                )}
                <span className="underline decoration-dotted underline-offset-4">
                  {copied ? "copied!" : "copy prompt"}
                </span>
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Index;
