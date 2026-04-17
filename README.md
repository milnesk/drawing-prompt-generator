# What should I draw? ✎

A single-page drawing prompt generator with a sketchbook aesthetic. Spin the slot-machine reels and get a weird, oddly specific drawing idea — perfect for sketchbook warmups, art challenges, or beating creative block.

> *"A philosophical moth interviewing a rubber duck army, deeply confused, inside a pinball machine, as a Lisa Frank sticker."*

## ✨ Features

- **6 slot-machine reels** — subject, action, second subject, mood, setting, and style hint
- **Smooth deceleration animation** — reels spin and land organically with staggered timing using `requestAnimationFrame` and an ease-out cubic curve
- **2+ billion possible combinations** across the curated word lists
- **Hand-drawn sketchbook UI** — rough SVG borders with turbulence filters, paper-textured cream background, and Caveat / Patrick Hand fonts
- **Highlighter swipe** behind the assembled prompt for a marker-on-paper feel
- **Copy to clipboard** button so you can paste the prompt anywhere
- **Google Analytics** event tracking on every generation (configurable Measurement ID)
- **No backend** — fully client-side, deploy anywhere

## 🛠️ Tech Stack

- **React 18** + **Vite 5** + **TypeScript 5**
- **Tailwind CSS** with semantic design tokens (HSL)
- **shadcn/ui** components
- **sonner** for toast notifications
- **lucide-react** icons

## 🚀 Getting Started

```bash
# install dependencies
npm install

# start the dev server
npm run dev

# build for production
npm run build

# preview the production build
npm run preview
```

The app runs at `http://localhost:8080` by default.

## 📊 Configuring Google Analytics

The GA4 snippet lives in `index.html` with a placeholder Measurement ID. To enable tracking:

1. Open `index.html`
2. Replace both occurrences of `G-XXXXXXXXXX` with your real GA4 Measurement ID
3. Deploy — events fire automatically on every prompt generation (`generate_prompt`, category `engagement`)

The tracking helper lives in `src/lib/analytics.ts` and safely no-ops if `gtag` isn't loaded.

## 🎨 Customizing the Word Lists

All prompt vocabulary lives in `src/lib/prompts.ts`. Add, remove, or swap words in any of the five categories:

- `subjects` — people, creatures, objects
- `actions` — verbs and verb phrases
- `moods` — emotional tone
- `settings` — locations
- `styleHints` — visual style references

The sentence template is also in this file (`assembleSentence`) if you want to change the prompt structure.

## 🎭 Customizing the Look

- **Colors & design tokens** — `src/index.css` (HSL variables) and `tailwind.config.ts`
- **Fonts** — loaded from Google Fonts in `index.html`; swap to any handwritten font
- **Rough borders** — `src/components/RoughBorder.tsx` (tweak the SVG turbulence filter for more/less wobble)
- **Slot animation timing** — tweak `baseDuration` and `stagger` in `src/pages/Index.tsx`

## 📁 Project Structure

```
src/
├── components/
│   ├── RoughBorder.tsx    # SVG hand-drawn border wrapper
│   ├── Slot.tsx           # Single animated slot reel
│   └── ui/                # shadcn/ui primitives
├── lib/
│   ├── analytics.ts       # GA event helper
│   └── prompts.ts         # Word lists + sentence assembler
├── pages/
│   └── Index.tsx          # Main page composition
├── index.css              # Design tokens + paper texture
└── main.tsx
```

## 📦 Deployment

This is a static site — deploy the contents of `dist/` to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.) after running `npm run build`.

## 📝 License

MIT — use it, fork it, draw weird things.
