# jehernandez — coyote skull site

A light, hand-coded static site, structured like jehernandez.music.
**Full manual: [DOCUMENTATION.md](DOCUMENTATION.md)** — including how to
change the music, add work pages, change colors/fonts/themes, and re-orient
the skull.

## What it does

- **Landing**: black page (always black, in both themes), the strangeTrig
  attractor — ported from your `strangeTrig.tox`, all seven types selectable —
  drifting blurrily behind, today's Maya Long Count date, and the coyote
  skull — your real scan, 160,000 points — fading in at center. Hints fade in
  (an arrow bobbing over the teponaztli at 3s, "(click the skull)" at 6s;
  on touch screens: arrow 3s, drag hint 6s, click hint 9s). The first skull
  click opens the overlay and reveals the **mini 3D corner skull** + menu;
  the corner skull then toggles the overlay (inner pages' corner skulls lead
  back to the landing).
- **The skull** looks at the mouse (touch on mobile), breathes with constant
  TD-style noise (mouse-driven push is off; see DOCUMENTATION §3.3), and pulses outward with
  the music (low/mid/high FFT with per-band auto-gain). Clicking it opens the
  overlay — bio, portfolio embeds, links — and **freezes the scene and the
  music**, resuming where they left off when closed.
- **Heart surprise**: for visitors who linger, a small particle heart fades in
  bottom-right a few seconds after the hints clear (or 3s after returning to
  the landing). Clicking it morphs the skull's 160,000 particles into a heart
  (your `Heart Centered 2.obj` scan, same point count) — which rotates with
  time and beats as the cursor nears the center — and the button then offers a
  skull to morph back. The heart is still clickable to enter the site. The
  whole feature is one switch: `CFG.heart.enabled` in `index.html`.
- **Attractor morph button**: a small square (bottom center) appears a few
  seconds after the heart, previewing the *current* strangeTrig attractor
  unblurred. Clicking it cycles forward through the pool — the background
  **"blinks"**: fades to black, swaps the type (with fresh random A/B values, so
  the same type looks different each time), and fades back in. Cycling fast
  keeps it black; it never snaps. Switch: `CFG.bg.morphButton`.
  (Both morph buttons get their own bobbing ↓ arrow, which retires on first
  click — same look and timing as the teponaztli's.)
- **Frozen backdrop**: the scene you left on the landing is screenshotted
  (lightweight JPG, `sessionStorage`) and painted behind **every inner page**
  under the same overlay tint, in both themes — so the site reads as one
  continuous surface. Never entered the landing = plain solid background.
- **Explainer modals**: a "?" beside the long-count date, another beside
  "Cuicatl" on the full-works page, and "Website info" in the footer. All share
  one style; their text lives in `js/site.js` (one constant each).
- **Light/dark**: pages and overlay come in a light (`#f0f0f0` / near-black)
  and an inverted dark theme; **dark is the default for new visitors** (one
  line — `THEME_DEFAULT` in `js/theme-init.js`). A sun/moon toggle (bottom-
  left, next to the teponaztli on the landing overlay) cross-fades between
  them; each visitor's choice is saved, applies on every page, and overrides
  the default. The OS preference is deliberately ignored. The landing scene
  stays black either way.
- **Audio** starts from the teponaztli (bottom-left): faded + "(turn audio
  on)" until pressed, then full red + "(turn audio off)". There are **three
  soundtracks**, chosen by **Mayan numerals 𝋡 𝋢 𝋣** that slide out from behind
  the teponaztli when the sound is on (1 lit by default; the others dim); a
  click **crossfades** to that track, and they retract when audio is off. Each
  track loops through a 0.5s self-crossfade (no harsh cut), and turning it off
  eases the skull's and background's reactivity out. (See
  [DOCUMENTATION.md §8.8](DOCUMENTATION.md).)
- **Every page** carries the long-count date, the menu and footer (both
  injected from single sources in `js/site.js`), the theme toggle, and the
  theme-aware mini corner skull.
- **Serve it, don't double-click it.** Internal links are clean and
  root-absolute (`/about`), which a browser can only resolve over http — so use
  Netlify, GitHub Pages, or `python -m http.server` (DOCUMENTATION.md §1.8).
  Opened straight from disk the landing still renders (base64 fallbacks cover
  the skull/heart/audio), but navigation between pages won't work.

## Quick facts

- Swap the music: replace `assets/loop.mp3` (same name) for track 1; the three
  tracks are the `TRACKS` array in `index.html` (`loop`/`cicadas`/`blue14` =
  numerals 1/2/3). See [DOCUMENTATION.md §1.1 / §8.8](DOCUMENTATION.md) for the
  fallback + conversion one-liners and how to add a fourth.
- Background attractor: `CFG.bg` in `index.html` — picks a random type from
  `typePool` (`[0,1,3,6]`) each load by default; set `typeRandom: false` to pin
  a fixed `type` (0–6). Test any live with `?trig=N`; `enabled: false` turns
  the whole background off. The bottom-center square cycles the pool live
  (`morphButton`, `fadeOutDur`/`fadeInDur`, `morphSeedRange`).
- Heart surprise: `CFG.heart` in `index.html` — `enabled: false` reverts the
  site to skull-only; `spinSpeed`, `beatAmp`/`beatRate`, `appearAfter`, and the
  morph speed are all knobs there (see [DOCUMENTATION.md §8.7](DOCUMENTATION.md)).
- Default theme for new visitors: `THEME_DEFAULT` (`'dark'`/`'light'`) in
  `js/theme-init.js`.
- Skull orientation: one line in `js/skull-rot.js`; test live with
  `?rot=x:-90,z:-90,x:90` in the URL.
- All tunables: the `CFG` object in `index.html`.
- Colors: CSS variables at the top of `css/site.css` (light + `html.dark`);
  menu/footer/why-text: constants at the top of `js/site.js`.
- Font: Academico (or Mallory) — one line in `css/site.css`.
- Favicon: rendered from the actual point cloud — regenerate with
  `python tools/make-favicon.py`.
- Clean URLs match the old jehernandez.music exactly — `/about`, `/work`,
  `/contact`, `/flow`, `/work/<slug>` — on both Netlify and GitHub Pages
  (both serve `x.html` at `/x`, so links carry **no `.html`**; use `/` for the
  homepage). `/store` forwards to the Square store on Netlify via `_redirects`.
  Link/home conventions: DOCUMENTATION.md §1.11.
- Contact form: **Web3Forms** (emails you each submission; access key in
  `contact.html`), works on any host — DOCUMENTATION.md §1.12.
- Deploy: drag the folder onto https://app.netlify.com, or push to GitHub →
  Settings → Pages. Security headers for Netlify live in `_headers`.
- Weight: **≈ 3.9 MB first paint** — skull + heart point clouds (~1.22 MB each)
  + the default track (~1.2 MB) + fonts/CSS/JS. The other two soundtracks
  (~1.0 + 1.4 MB) preload only after the teponaztli is first pressed. No
  frameworks, no external scripts, no trackers. Set `CFG.heart.enabled: false`
  to drop the heart (~1.22 MB) if you want it lighter.
- Repo size: **≈ 17 MB** on disk. About 8 MB of that is the base64 `file://`
  fallbacks (`assets/*.js`) — a **served** site never downloads them; they only
  matter for double-clicking the page from disk. Safe to delete if you only
  ever use the deployed/served site (see DOCUMENTATION.md §1.8).
