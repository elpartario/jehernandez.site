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
- **The skull** looks at the mouse (touch on mobile), breathes with TD-style
  noise (mouse x = exponent, mouse y = amplitude), and pulses outward with
  the music (low/mid/high FFT with per-band auto-gain). Clicking it opens the
  overlay — bio, portfolio embeds, links — and **freezes the scene and the
  music**, resuming where they left off when closed.
- **Light/dark**: pages and overlay are light (`#f0f0f0` with near-black
  text) by default; a sun/moon toggle (bottom-left, next to the teponaztli on
  the landing overlay) cross-fades to the inverted dark theme. The choice is
  saved and applies on every page; the OS preference is deliberately ignored.
- **Audio** starts from the teponaztli (bottom-left): faded + "(turn audio
  on)" until pressed, then full red + "(turn audio off)". The MP3 loops
  through a 0.5s self-crossfade (no harsh cut), and turning it off eases the
  skull's and background's reactivity out.
- **Every page** carries the long-count date, the menu and footer (both
  injected from single sources in `js/site.js`), the theme toggle, and the
  theme-aware mini corner skull.
- Works both served (Netlify, GitHub Pages, `python -m http.server`) **and**
  double-clicked from disk (base64 fallbacks for skull + audio).

## Quick facts

- Swap the music: replace `assets/loop.mp3` (same name); see
  [DOCUMENTATION.md §1.1](DOCUMENTATION.md) for the fallback + conversion
  one-liners.
- Background attractor type: `CFG.bg.type` (0–6) in `index.html`, test live
  with `?trig=N`; `CFG.bg.enabled: false` turns it off.
- Skull orientation: one line in `js/skull-rot.js`; test live with
  `?rot=x:-90,z:-90,x:90` in the URL.
- All tunables: the `CFG` object in `index.html`.
- Colors: CSS variables at the top of `css/site.css` (light + `html.dark`);
  menu/footer/why-text: constants at the top of `js/site.js`.
- Font: Academico (or Mallory) — one line in `css/site.css`.
- Favicon: rendered from the actual point cloud — regenerate with
  `python tools/make-favicon.py`.
- URLs match the old jehernandez.music exactly — `/about`, `/work`,
  `/contact`, `/flow`, `/work/<slug>` — on both Netlify and GitHub Pages
  (both serve `x.html` at `/x`); `/store` forwards to the Square store on
  Netlify via `_redirects`.
- Deploy: drag the folder onto https://app.netlify.com, or push to GitHub →
  Settings → Pages. Security headers for Netlify live in `_headers`.
- Weight: ≈ 2.9 MB first load, no frameworks, no external scripts, no
  trackers.
