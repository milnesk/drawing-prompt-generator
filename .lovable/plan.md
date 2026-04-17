
## What should I draw? — Sketchbook Prompt Generator

A single-page React app that feels like a torn notebook page, with 5 slot-machine style reels that spin and land on random words to assemble a fun drawing prompt.

### Word lists (client-side, in a `prompts.ts` file)
- **Subjects** (~20): astronaut, octopus, grandma, robot, wizard, pigeon, ghost, mailman, dragon, toaster, mermaid, detective, sloth, snowman, librarian, alien, knight, frog prince, scarecrow, garden gnome
- **Actions** (~15): floating with, arguing with, hiding behind, chasing, balancing on, pointing at, emerging from, dancing with, whispering to, wrestling, befriending, painting, juggling, riding, ignoring
- **Second subjects** (reuses subject list, ensures different from first)
- **Moods** (~12): eerie, whimsical, melancholy, chaotic, dreamy, absurd, tense, cozy, mischievous, serene, ominous, joyful
- **Settings** (~15): in outer space, at a bus stop, underwater, in a dream, at a funeral, inside a vending machine, on a rooftop, in a haunted library, at the DMV, in a cereal bowl, on the moon, in a cathedral, at a laundromat, inside a snow globe, at the bottom of a well
- **Style hints** (~12): in the style of a 90s cartoon, like a tarot card, as a Renaissance painting, like a newspaper comic strip, as a children's book illustration, like a woodblock print, in the style of a Saturday morning cartoon, as a stained glass window, like a noir film still, as a Studio Ghibli scene, like a botanical sketch, as graffiti

### Visual design (sketchbook aesthetic)
- **Background**: cream `#fdfbf3` with a subtle SVG paper-grain texture and faint horizontal ruled lines
- **Font**: Caveat (primary) + Patrick Hand (fallback) loaded from Google Fonts via `index.html`
- **Borders**: hand-drawn wobbly look using SVG `<rect>` with `stroke-dasharray` + a slight `filter: url(#roughen)` turbulence filter for the ink-pencil feel
- **Colors**: ink-black `#1a1a1a` for text/strokes, accent red `#c0392b` for the underline on the title
- **Slots**: rectangular "cards" with rough borders, a small label written above (e.g. "subject", "action") in smaller handwritten text
- **Generate button**: large pill with a hand-drawn double-stroke border, ink-black text, slight rotation on hover, "scribble" underline animation

### Slot machine animation
- Each of the 5 slots is a fixed-height window (`overflow: hidden`) containing a vertical strip of ~30 randomly-shuffled words from that category
- On generate:
  1. All 5 strips start translating upward fast (`transform: translateY`) using a JS `requestAnimationFrame` loop — fast flicker phase
  2. Each slot independently decelerates over **2.6–3.4s** with a custom ease-out cubic curve, landing on a pre-chosen target word
  3. Stagger end times so slots settle one after another (~150ms apart) — feels organic, like a real slot machine
  4. A tiny "thunk" wobble animation when each slot lands
- Before first generation: slots show a faint dotted placeholder ("?")
- After landing: the assembled sentence fades in below with a 400ms ease-in

### Sentence template
> "A {subject} {action} a {subject2}, {mood}, {setting}, {styleHint}."

Displayed in larger Caveat font (~28px), centered, with a hand-drawn underline beneath.

### Layout (single centered column, max-width ~720px)
1. Title: **"What should I draw?"** (large Caveat, ~64px) with a wobbly underline
2. 5 labeled slots in a responsive flex row (wrapping to 2 rows on mobile)
3. Assembled prompt sentence (hidden until first spin)
4. **Generate prompt** button (always active, can re-roll)
5. Tiny footer note: "tap generate as many times as you like ✦"

### Google Analytics integration
- Add the GA4 gtag snippet to `index.html` with placeholder `G-XXXXXXXXXX` clearly commented: `<!-- Replace G-XXXXXXXXXX with your Measurement ID -->`
- Create `src/lib/analytics.ts` exporting `trackEvent(name, params)` that safely calls `window.gtag` if present
- Fire `trackEvent('generate_prompt', { event_category: 'engagement' })` on every button click
- Modular: swapping the ID only requires editing the two `G-XXXXXXXXXX` strings in `index.html`

### Files to create/modify
- `index.html` — add Google Fonts links (Caveat, Patrick Hand) + GA gtag snippet with placeholder ID
- `src/lib/prompts.ts` — word lists + sentence assembler
- `src/lib/analytics.ts` — `trackEvent` helper
- `src/components/Slot.tsx` — single animated slot reel (handles its own spin animation)
- `src/components/RoughBorder.tsx` — reusable SVG hand-drawn border wrapper
- `src/pages/Index.tsx` — full page composition + spin orchestration
- `src/index.css` — paper texture background, font-family defaults, custom keyframes for wobble/scribble
- `tailwind.config.ts` — add `caveat` & `patrick` font families, cream background color, ink color, custom keyframes (`wobble`, `scribble-in`)

No backend, no dependencies beyond what's already installed.
