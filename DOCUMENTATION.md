# Site Documentation

Everything the site does, where it lives, and how to change it yourself.
The [README](README.md) is the short version; this is the complete one.

**Contents** — every sub-heading is a link; click to jump.

1. [Quick recipes](#1-quick-recipes)
   - [1.1 Change the music](#11-change-the-music)
   - [1.2 Add a new work page](#12-add-a-new-work-page)
   - [1.3 Change colors](#13-change-colors)
   - [1.4 Change fonts (the font switch)](#14-change-fonts-the-font-switch)
   - [1.5 Re-orient / resize the skull](#15-re-orient--resize-the-skull)
   - [1.6 The strangeTrig background: on/off and picking an attractor](#16-the-strangetrig-background-onoff-and-picking-an-attractor)
   - [1.7 Edit the texts (and the menu / footer)](#17-edit-the-texts-and-the-menu--footer--one-place-each)
   - [1.8 Deploy and local preview](#18-deploy-and-local-preview)
   - [1.9 URL parity with the old site](#19-url-parity-with-the-old-site)
   - [1.10 Writing HTML here: a mini style guide](#110-writing-html-here-a-mini-style-guide)
2. [How the site is organized](#2-how-the-site-is-organized)
3. [The front page, piece by piece](#3-the-front-page-piece-by-piece)
   - [3.1 The entry flow](#31-the-entry-flow)
   - [3.2 CFG reference](#32-cfg-reference)
   - [3.3 The skull](#33-the-skull)
   - [3.4 The strangeTrig background](#34-the-strangetrig-background)
   - [3.5 Audio pipeline](#35-audio-pipeline)
   - [3.6 The mini corner skull](#36-the-mini-corner-skull)
4. [Shared elements on every page](#4-shared-elements-on-every-page)
   - [4.1 The long-count date](#41-the-long-count-date)
   - [4.2 Chrome](#42-chrome)
5. [Inner-page anatomy](#5-inner-page-anatomy)
6. [Assets and tools](#6-assets-and-tools)
7. [Troubleshooting](#7-troubleshooting)
8. [Theme system, hints, and 2026-07 additions](#8-the-theme-system-hints-and-other-2026-07-additions)
   - [8.1 Light / dark](#81-light--dark)
   - [8.2 The landing hints](#82-the-landing-hints)
   - [8.3 The audio loop crossfade](#83-the-audio-loop-crossfade)
   - [8.4 The favicon](#84-the-favicon)
   - [8.5 Why phones used to show the skull off-center](#85-why-phones-used-to-show-the-skull-off-center)
   - [8.6 Crediting the inspiration](#86-crediting-the-inspiration)
   - [8.7 The heart surprise (skull ↔ heart morph)](#87-the-heart-surprise-skull--heart-morph)
   - [8.8 The audio: three tracks + the Mayan-numeral selector](#88-the-audio-three-tracks--the-mayan-numeral-selector)
9. [Security notes](#9-security-notes)
10. [Changelog](#10-changelog)

---

## 1. Quick recipes

### 1.1 Change the music

The site now has **three** soundtracks, chosen by the Mayan numerals beside the
teponaztli — `assets/loop.mp3` (numeral 1), `assets/cicadas.mp3` (2), and
`assets/blue14.mp3` (3). The steps below swap the default (track 1); to swap
track 2 or 3, or add a fourth, see [8.8](#88-the-audio-three-tracks--the-mayan-numeral-selector)
(same commands, different filename). To swap track 1:

1. Replace `assets/loop.mp3` with any MP3, **keeping the same filename**. Done —
   no code changes. It loops automatically, and the loop **crossfades** (~0.5s)
   so the track doesn't need to be seam-perfect — an ordinary clip loops without
   a hard click (see [8.3](#83-the-audio-loop-crossfade) to tune the fade).
2. If your source is an AIF/WAV, convert with TouchDesigner's bundled ffmpeg
   (no installs needed):

   ```
   "C:\Program Files\Derivative\TouchDesigner\bin\ffmpeg.exe" -i "your-track.aif" -codec:a libmp3lame -b:a 192k assets\loop.mp3
   ```

3. **Also regenerate the disk-fallback copy** (used only when the site is opened
   as a file:// page, e.g. double-clicking index.html):

   ```
   python -c "import base64; open(r'assets/audio.js','w').write('window.AUDIO_B64 = ' + repr(base64.b64encode(open(r'assets/loop.mp3','rb').read()).decode()) + ';')"
   ```

   Run that from the `jehernandez` folder. If you only ever view the site
   over http/Netlify you can skip this, but it keeps the two copies in sync.

4. If the new track reacts too much / too little, tune `audioSens` (overall
   sensitivity, default `1.35`) and `audioPush` (how far points fly, default
   `0.36`) in the `CFG` block near the top of the main `<script>` in
   `index.html`. Quiet tracks self-normalize (see [3.5](#35-audio-pipeline)),
   so most tracks need no tuning.

### 1.2 Add a new work page

Work pages live in the **`work/` folder** as `work/<slug>.html` — the filename
is the URL, so `work/parallax.html` is served at `/work/parallax`, exactly
like the old Squarespace site. Fastest path: **copy an existing page in
`work/` that matches your embed type** — `helah.html` (Vimeo),
`parallax.html` (SoundCloud), `our-sons.html` (YouTube),
`eastendechoes.html` (Apple Music) — then edit these five spots:

1. `<title>Piece Name — J.E. Hernández</title>`
2. The `<h1>` inside `<main>` — the piece name.
3. The `.embed` block — swap the iframe (recipes below).
4. The description `<h2>` + `<p>` paragraphs.
5. Save as `work/your-slug.html`.

Because these pages sit one folder deep, their shared links start with `../`
(`../css/site.css`, `../index.html`, `../assets/...`) — keep that pattern when
copying, and link sibling pieces by bare filename (`helah.html`).

**Embed recipes** (all go inside `<div class="embed"> ... </div>`):

- **Vimeo** — from the video's Share → Embed, keep only the src:
  ```html
  <iframe class="video" loading="lazy" src="https://player.vimeo.com/video/VIDEO_ID" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
  ```
- **YouTube** — the plain, standard embed (don't add `referrerpolicy` and
  don't use the youtube-nocookie domain: both can trigger "Error 153", which
  is YouTube refusing to configure the player when it doesn't receive the
  embedding site's referrer). A visible fallback link is good practice:
  ```html
  <iframe class="video" loading="lazy" src="https://www.youtube.com/embed/VIDEO_ID" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
  <p class="muted"><a href="https://www.youtube.com/watch?v=VIDEO_ID" target="_blank" rel="noopener">watch on YouTube ↗</a></p>
  ```
- **SoundCloud** — from the track's Share → Embed, or by track id:
  ```html
  <iframe loading="lazy" style="height:300px" src="https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2FTRACK_ID&show_artwork=true"></iframe>
  ```
- **Apple Music**:
  ```html
  <iframe loading="lazy" style="height:450px" src="https://embed.music.apple.com/us/album/ALBUM_SLUG/ALBUM_ID" allow="autoplay *; encrypted-media *;"></iframe>
  ```

The `class="video"` makes an embed 16:9; omit it for fixed-height audio players.
A page can have several `.embed` blocks, or none (see `work/helah.html`'s
"contact me to hear this" pattern).

**Then link the new page** in up to three places:

- `work.html` — the featured list is a flush stack of image **banners**
  (`.wgallery`). Add one line (its position in the file = display order):
  ```html
  <a class="wbanner" href="work/your-slug.html" style="background-image:url('assets/work/your-slug.jpg')"><span>Piece Name</span></a>
  ```
  Make the banner image from any photo — they're all pre-cropped to the same
  1200×280 shape (a real crop, not a squeeze) with TouchDesigner's ffmpeg:
  ```
  "C:\Program Files\Derivative\TouchDesigner\bin\ffmpeg.exe" -i "photo.jpg" -vf "scale=1200:280:force_original_aspect_ratio=increase,crop=1200:280" -q:v 5 assets\work\your-slug.jpg
  ```
  **Replace** a banner's image: overwrite `assets/work/<slug>.jpg` with a new
  1200×280 crop (same ffmpeg command) — no HTML change needed.
  **Remove** a piece from the featured page: delete its one
  `<a class="wbanner" ...>` line in `work.html` (and optionally the jpg).
  **Reorder**: cut-and-paste the lines — top-to-bottom in the file is
  top-to-bottom on the page.
  The banner look — rest fade (opacity 0.82), hover (1.0), the dark scrim
  behind the titles, uniform height (long titles wrap and grow their banner),
  title size — all lives under the `.wgallery` comment block in `css/site.css`.
- `flow.html` (the full list, served at `/flow`) — add a line under the right
  category:
  ```html
  <p>2026 — <a href="work/your-slug.html"><em>Piece Name</em></a> 12′<br><span class="muted">For whatever it's for.</span></p>
  ```
- Optionally the front page overlay: in `index.html`, inside
  `<div class="portfolio">`, add a grid cell — a `<div class="pitem">`
  wrapping a `.ptitle` line and an iframe:
  ```html
  <div class="pitem">
  <p class="ptitle"><a href="work/your-slug.html">Piece Name</a></p>
  <iframe ...></iframe>
  </div>
  ```
  The portfolio is a **two-column grid on desktop, one column under 900px**;
  the `.portfolio` rules in index.html's `<style>` block control the
  breakpoint and gaps, and anything with class `pwide` spans both columns.
  How the order works — and how the two columns collapse to one — is explained
  next.

**How the overlay portfolio is laid out and ordered.** The `.portfolio` block
is a **CSS grid**, and this is the whole logic to understand before you
rearrange it:

- **There is no JavaScript here and no per-item order value.** The pieces
  appear in the exact order their `<div class="pitem">` blocks are written in
  `index.html`. That source order is the single source of truth — reordering
  the blocks in the file is the only way to reorder the works.
- **Desktop (2 columns).** `grid-template-columns: 1fr 1fr` makes two equal
  columns, and the grid fills them **in source order, left-to-right then top
  to bottom** ("row-major"). So the 1st `.pitem` is top-left, the 2nd is
  top-right, the 3rd starts the next row on the left, the 4th is its right, and
  so on. In other words the **odd-numbered** items (1, 3, 5, …) form the left
  column and the **even-numbered** ones (2, 4, 6, …) form the right column,
  paired up row by row.
- **Mobile / narrow (1 column, ≤900px).** `grid-template-columns: 1fr` leaves
  a single column, so the same list simply **stacks straight down in source
  order**: 1, 2, 3, 4, … There is no reshuffle — the phone order is literally
  the order you'd get by reading the desktop grid **left-to-right across each
  row, top to bottom**. (Desktop row `[A | B]` becomes mobile `A` then `B`.)
- **Practical upshot for editing.** To change what shows first on mobile, move
  that `.pitem` earlier in the HTML. Remember that doing so also moves it on
  desktop: moving an item to position 1 puts it top-left; position 2 puts it
  top-right; etc. If you want a specific piece to lead on phones, make it the
  first `.pitem`. To keep desktop pairings tidy while changing mobile order,
  you have to move items in pairs (positions 1&2 share a row, 3&4 share a row…).
- **Full-width rows (`pwide`).** Any child with class `pwide` gets
  `grid-column: 1 / -1`, meaning it spans **both** columns — that's how the
  "featured work · full list of works" line sits full-width at the bottom on
  desktop while still stacking normally on mobile. Add `class="pwide"` to any
  item you want to run the whole width (e.g. a lead video).
- **Where the knobs are.** All of the above is the `.portfolio` /
  `.portfolio .pwide` / `@media (max-width: 900px)` rules in `index.html`'s
  `<style>` block: change `1fr 1fr` to `1fr 1fr 1fr` for three desktop columns,
  change the `900px` breakpoint to collapse sooner/later, or change `gap` for
  spacing. The column count never affects the order rule — grid always fills in
  source order.

### 1.3 Change colors

Every color is a CSS variable at the top of `css/site.css`. There are **two
palettes**: `:root` holds the light theme (the default) and the `html.dark`
block right under it holds the dark overrides. The sun/moon toggle switches
between them (see section 8); the **landing page ignores both** — it is
always black with red accents.

| Variable | Light | Dark | Used for |
|---|---|---|---|
| `--color-main` | `#f00` | (same) | hover states, the long-count date on black — the accent |
| `--color-icon` | `#d40000` | (same) | the teponaztli and the landing hints at rest |
| `--color-deep` | `#8a0008` | (same) | menu links on the black landing page |
| `--color-page` | `#f0f0f0` | `#0f0f0f` | background of all inner pages |
| `--ink` | `#020202` | `#fdfdfd` | text on the pages |
| `--color-overlay` | `240, 240, 240` | `15, 15, 15` | the landing overlay's color — **bare R,G,B numbers**, because index.html composes them with its own opacity: `rgba(var(--color-overlay), 0.86)` |
| `--color-modal` | `#fdfdfd` | `#161616` | "Why this date?" card background |

Keep `--color-page` and `--color-overlay` in step (they're the same surface —
one is just written as R,G,B so the overlay can keep its own transparency).
The names are hue-neutral on purpose: change the values to any palette and
nothing needs renaming. The accent trio (`main`/`icon`/`deep`) is shared by
both themes — if you retint it, check it reads on both backgrounds.

Colors that do **not** come from the variables:

- **Main skull + red corner skull** (WebGL can't read CSS): in `index.html`,
  search `uCol` — `1.0, 0.055, 0.075` is RGB on a 0–1 scale (≈ #ff0e13).
  Over the overlay the corner skull switches to the current `--ink`
  automatically (it re-reads it whenever the theme flips).
- **Inner-page mini skull**: follows `--ink` automatically (js/mini-skull.js).
- **strangeTrig background**: `index.html`, shader `fs-bg`, the line
  `gl_FragColor = vec4(m * 0.55, m * 0.02, m * 0.03, 1.0);` — R, G, B.
- **Banner titles/scrim** (`.wgallery`): white on a dark photo scrim,
  deliberately theme-independent.
- **"Why this date?" box**: background is `--color-modal`, text is `--ink`,
  border and × button are `--color-main` — all variables now, nothing
  hardcoded. The dim backdrop is `.why-modal { background: rgba(0,0,0,0.55); }`
  (raise/lower the 0.55 for more/less dimming).

**How the variables propagate.** Each `--name: value;` line is a single
definition; the rest of the CSS *references* it with `var(--name)`. Change
the definition, save, refresh — every rule that references it updates at
once, in both themes if you edit both blocks. Quick map: `--color-page` is
every inner-page background plus its echoes (Send-button text, top-button
hover fill); `--ink` is everything that reads as page text (body, menu on
pages, docked date, form borders, footer, inner mini skull); `--color-main`
is every hover plus the landing date and the modal accents; `--color-icon`
is the teponaztli + hints at rest; `--color-deep` is only the landing menu
at rest. The phone menu's links are a fixed `#f0f0f0` on its dark scrim so
they stay readable in either theme.

Tip for experimenting: F12 → Elements → select `<html>` → edit any `--name`
value under `:root` (or toggle the `dark` class on `<html>`) in the Styles
panel. Live preview, nothing saved.

### 1.4 Change fonts (the font switch)

Two families are installed and registered; the whole site follows **one line**
near the top of `css/site.css` (look for the `FONT SWITCH` banner comment):

```css
/*  0 = 'Academico'  ·  1 = 'Mallory'  */
:root { --site-font: 'Academico'; }
```

Change the name to `'Mallory'` and every page — body text, menu, date,
banners — switches. That's the entire "font value". Academico always stays
loaded as the fallback, so a typo degrades gracefully instead of breaking.

The site only ever uses four styles per family — regular (400), bold (700),
and their italics — and both families ship exactly those:

- **Academico** (serif, New Century Schoolbook flavor; free license):
  `assets/fonts/Academico-*.woff2`
- **Mallory** (sans, Frere-Jones; **Book** plays the regular role, **Bold**
  the bold, with Book Italic / Bold Italic): `assets/fonts/Mallory-*.woff2`.
  Mallory is a commercial typeface — your desktop license may not cover
  self-hosted webfonts, worth checking with Frere-Jones before going live
  (Academico has no such concern).

**To add a font "2"**: convert its regular/bold/italic/bold-italic files to
woff2 (one-liner below), drop them in `assets/fonts/`, copy the four Mallory
`@font-face` blocks in `css/site.css` and swap in the new family name and
filenames (weights 400 and 700, `font-style: italic` on the two italics),
then set `--site-font` to the new name.

```
python -c "from fontTools.ttLib import TTFont; f=TTFont('YourFont.otf'); f.flavor='woff2'; f.save('YourFont.woff2')"
```

(needs `pip install fonttools brotli` once). Font *sizes* all use `clamp(min,
preferred-vmin, max)` so they scale with the window — the main knobs are
`.sheet` (body text), `.sheet h1/h2`, and `.lc-wrap` (the date) in `css/site.css`.

### 1.5 Re-orient / resize the skull

Orientation lives in **one line** in `js/skull-rot.js`:

```js
window.SKULL_ROT = [['x', -90], ['z', -90], ['x', 90]];
```

It's a list of rotations applied in order, each in *screen space*: `x` = nod
up/down, `y` = turn left/right, `z` = roll (positive = counter-clockwise,
negative = clockwise), degrees. Both the big skull and every mini corner skull
read this line, so one edit fixes all of them.

Test candidates live without editing anything by adding `?rot=` to the URL:

```
index.html?rot=x:-90,z:-90,x:90     (the current default)
index.html?rot=x:-90,z:-90,x:-90    (if it's tipped backward)
index.html?rot=x:-90,z:90,x:90      (if it rolled the wrong way)
index.html?rot=x:-90,z:-90,x:90,y:180   (if it faces away from you)
```

When one looks right, copy the sequence into `SKULL_ROT`. Size: `CFG.scale`
(default 0.78); mini skull size: the `width/height: 52px` rules for
`canvas#mini` (`css/site.css` for inner pages, `index.html` style block for
the front page) plus `CFG.mini.scale`.

### 1.6 The strangeTrig background: on/off and picking an attractor

In `index.html`, find the `CFG` object — the `bg` block starts with these
switches:

```js
bg: { enabled: true,         // set false to turn the background off entirely
      type: 0,               // attractor type 0..6, used when typeRandom is false
      typeRandom: true,      // true = pick a random type from typePool on each load
      typePool: [0, 1, 3, 6],// which types the randomizer draws from
```

`enabled: false` = pure black behind the skull, zero background GPU cost,
nothing else changes (the skull is drawn in a separate pass and doesn't
care). For a dimmer background instead of none, lower `bg.gain` (e.g. `0.4`).

**Which attractor.** `type` selects which of the **seven attractor formulas
from your strangeTrig.tox** the background runs — the same 0–6 as the
"Attractor Type" menu in TouchDesigner. All the other behavior (mouse
steering A/B, audio wobble, drift, blur, fill-the-screen stretch) is
identical across types. Types 4–6 also use the `D0` parameter (default
`0.5`, the TD default); 0–3 ignore it.

**Random vs fixed (the randomizer toggle).**

- `typeRandom: true` (the default) — every time the page loads, the
  background randomly becomes one of the types listed in `typePool`
  (currently `[0, 1, 3, 6]`, evenly chosen). Refreshing gives you a
  different one. Edit `typePool` to change the menu it draws from — e.g.
  `[2, 5, 6]`, or a single-item list like `[3]` to effectively pin it.
- `typeRandom: false` — the randomizer is off and the background always
  uses the fixed `type` value above (this is the old, static behavior).
  Set `type` to whichever you want locked in.

**Testing/overriding.** Opening `index.html?trig=3` (any 0–6) forces that
one type for that visit and **beats the randomizer** — handy for previewing
each formula. Remove the `?trig=` from the URL to hand control back to
`typeRandom`. On every load the browser console prints the chosen type and
whether it was random or fixed, e.g. `[site] strangeTrig type: 4 (random
from [0,1,3, 6])`.

### 1.7 Edit the texts (and the menu / footer — one place each)

- **One-paragraph bio** (overlay home): `index.html`, first `<p>` in `#overlay`.
- **Full bio**: `about.html`.
- **"Why this date?"**: **one place** — the `WHY_TEXT` constant near the top
  of `js/site.js` (clearly bannered). It's a plain HTML string; edit it there
  and the ? modal updates on every page at once. (The `#why` blocks in the
  HTML files are empty shells that site.js fills — don't put text in them,
  it would be overwritten.)
- **"Cuicatl" explainer** (the "?" beside *Cuicatl* on the full-works page):
  its text is the `CUICATL_TEXT` constant right under `WHY_TEXT` in
  `js/site.js` (currently set to the same text as the date modal — replace the
  string when you have real copy). It reuses the same modal styling.
  **To add another "?" explainer anywhere**: in the HTML, put a
  `<button class="why-btn" id="myBtn">?</button>` where you want the mark and a
  `<div class="why-modal" id="myModal"><div class="why-card"></div></div>` shell
  near the end of the page; then add one line in js/site.js:
  `wireModal('myBtn', 'myModal', 'your HTML text');`. (The `.why-btn` only shows
  on inner/overlay pages by design.)
- **Menu**: **one place** — the `MENU_LINKS` list at the top of `js/site.js`
  (`['label', 'destination']` pairs; destinations without `http` are pages of
  this site, full URLs open in a new tab). Icons after the links live in
  `MENU_ICONS` (inline SVG). The `<nav class="menu">` tags in the HTML files
  are empty shells that site.js fills on every page, at both folder depths —
  never put links in them directly.
- **Footer**: **one place** — the `FOOTER_LINKS` list right below the menu in
  `js/site.js`, same rules. The © year updates itself. The
  `<footer class="foot">` tags in the pages are empty shells too.
- **Contact texts**: `contact.html`.

### 1.8 Deploy and local preview

**Local preview** (recommended) — the lean path (small binary skull + direct
mp3), and the only way the embeds and the contact form behave like the real
site. It runs a tiny web server on your own computer; nothing is published.

*Start it.*

1. Open a terminal **in the site folder**. Easiest way: in File Explorer, go
   to the `jehernandez` folder, click the address bar, type `powershell`, and
   press Enter — a PowerShell window opens already pointed at that folder.
   (Or open PowerShell anywhere and run `cd "Z:\TouchDesigner\Claude\jehernandez"`.)
2. Run:

   ```
   python -m http.server 8123
   ```

   It prints `Serving HTTP on :: port 8123 ...` and then sits there running —
   that's correct. **Leave this window open** the whole time you're previewing.
3. In your browser go to **http://localhost:8123** (or `http://127.0.0.1:8123`,
   same thing). Edit files, save, refresh the browser to see changes — you do
   **not** need to restart the server for edits, only refresh the page.

*Open it on your phone* (same command, no extra setup — just find your PC's
address on the network):

1. Phone and computer must be on the **same Wi-Fi**.
2. Find your computer's local IP: open a second PowerShell window and run
   `ipconfig`, then read the **IPv4 Address** under your active adapter —
   it looks like `192.168.1.37` (192.168.x.x or 10.0.x.x). Ignore `127.0.0.1`.
3. On the phone's browser go to `http://THAT-IP:8123` — e.g.
   `http://192.168.1.37:8123`. The full site works, including the touch
   "drag your finger" hint and the mobile menu.
4. **First time only**, Windows may pop up a *Windows Defender Firewall* dialog
   asking to allow Python — tick **Private networks** and Allow. If the phone
   can't connect and you saw no prompt, it was likely dismissed earlier; allow
   Python under Settings → *Windows Security → Firewall & network protection →
   Allow an app through firewall*, or just re-run the command and watch for the
   prompt. (This only opens the port to your local network, not the internet.)

*Stop it / end the session.* The server keeps running until you stop it —
closing the browser tab does **not** stop it. To shut it down:

- Click the PowerShell window running the server and press **Ctrl + C** (once;
  it returns you to the prompt). Then close the window. That frees port 8123.
- Or just **close that PowerShell window** — killing the window kills the
  server too.
- If you ever get *"address already in use"* on the next start, an old server
  is still running in the background. Free the port with:
  ```
  Get-Process python | Stop-Process
  ```
  (stops all Python processes) — or use a different port, e.g.
  `python -m http.server 8124`, and browse to `:8124` instead.

- **Double-clicking index.html also works**: the site detects file:// and
  loads the skull and audio from base64 fallbacks (`assets/skull.js`,
  `assets/audio.js`) so everything — including audio reactivity — still runs.
  SoundCloud/Vimeo/YouTube embeds may refuse to load from file://, though —
  judge embeds over http, not from disk.
- **Deploy on Netlify** (recommended): drag the `jehernandez` folder onto
  https://app.netlify.com. Netlify serves `about.html` at `/about` and
  `work/parallax.html` at `/work/parallax` automatically, applies the
  `_redirects` file, and activates the contact form (submissions appear under
  Site → Forms). Custom domain under Domain settings.
- **Deploy on GitHub Pages** (works, with three caveats — see below):

  1. Create a repository on github.com (any name, e.g. `jehernandez-site`;
     name it `<username>.github.io` if you want it at that root URL).
  2. Put the **contents** of the `jehernandez` folder at the repo root —
     either drag them into github.com → *Add file → Upload files*, or
     `git init` / commit / push from the folder. Make sure the hidden
     `.nojekyll` file comes along (it's already in the folder): it stops
     GitHub from running the site through its Jekyll processor, which would
     otherwise interfere with underscore-prefixed files like `_redirects`.
  3. Repo → **Settings → Pages** → Source: *Deploy from a branch*, branch
     `main`, folder `/ (root)`, Save. The site appears at
     `https://<username>.github.io/<repo>/` within a minute or two; every
     push re-deploys.
  4. Custom domain: Settings → Pages → Custom domain (GitHub commits a
     `CNAME` file to the repo), point your DNS where GitHub says, tick
     *Enforce HTTPS*.

  Differences vs Netlify:

  | | Netlify | GitHub Pages |
  |---|---|---|
  | `/about` serves about.html (clean URLs) | automatic | **automatic too** |
  | `_redirects` (`/store` → Square store) | applied | **ignored** — `/store` 404s there |
  | Contact form | live (Netlify Forms) | **inert** (the click-to-copy email still works) |
  | `_headers` (security headers, section 9) | applied | **ignored** |

  **Clean URLs work natively on GitHub Pages** — an earlier version of this
  file claimed otherwise, which was wrong. GitHub Pages resolves `/about` to
  `about.html` and `/work/parallax` to `work/parallax.html` on its own, no
  Jekyll, no front matter, no folder restructure (see the public test at
  https://rsp.github.io/gh-pages-no-extension/). So the URL parity of recipe
  1.9 holds on both hosts as-is. Keep the `.nojekyll` file: it skips the
  Jekyll build entirely, which is faster and leaves underscore files alone.
  Two quirks: GitHub Pages is case-sensitive (keep filenames exactly as they
  are), and only Netlify runs the redirects/headers files — which is why
  Netlify is still the slightly better home for this site.

### 1.9 URL parity with the old site

Every page keeps the exact slug it had on jehernandez.music, so **external
links keep working the moment the domain moves**: `/about`, `/work`,
`/contact`, `/flow`, and `/work/<slug>` for all sixteen pieces. The one old
path with no static equivalent, `/store`, is forwarded to the Square store by
the `_redirects` file in the site root — add more lines there (one per line:
`/old-path https://destination 302`) if you discover other inbound paths.

### 1.10 Writing HTML here: a mini style guide

Only what this site's pages actually use — not an HTML course. (If you know
the old tags: `<i>` and `<b>` still work in every browser, but the modern
semantic pair is `<em>` / `<strong>`, and that's what this site uses —
`<em>` renders as italics, `<strong>` as bold.)

**Text**

| You want | Write | Notes |
|---|---|---|
| a paragraph | `<p>Text here.</p>` | one pair per paragraph; spacing comes from CSS, so no empty paragraphs needed |
| italics | `<em>Helah</em>` | how piece titles appear in running text |
| bold | `<strong>J.E. Hernández</strong>` | |
| bold italics | `<strong><em>text</em></strong>` | nesting works |
| a line break *inside* a paragraph | `first line<br>second line` | `<br>` has no closing tag |
| dimmer side-note text | `<p class="muted">…</p>` | also works inline: `<span class="muted">…</span>` |
| the big page title | `<h1>…</h1>` | one per page, at the top of `main.sheet` |
| a section heading | `<h2>…</h2>` | sizes and spacing come from `.sheet h1/h2` in site.css |

**Special characters.** Typing `'` and `"` directly is fine. The text ported
from Squarespace uses typographic entities, which you'll see in the files and
can copy: `&#8217;` = ’ (curly apostrophe), `&#8220;` `&#8221;` = “ ”,
`&amp;` = &, and `&nbsp;` = a space that refuses to line-break (used around
the `·` separators in the footer).

**Links**

| You want | Write |
|---|---|
| another page of this site | `<a href="about.html">my bio</a>` |
| the same, but from a page inside `work/` | `<a href="../about.html">my bio</a>` — one folder up, see 1.2 |
| a piece page | `<a href="work/helah.html">Helah</a>` from root pages; `<a href="helah.html">Helah</a>` from a sibling work page |
| an external site in a new tab | `<a href="https://example.com" target="_blank" rel="noopener">label</a>` |
| a spot on the full-works page | `<a href="flow.html#vocal">vocal works</a>` — jumps to the element with that `id` |
| a file, like a PDF | `<a href="assets/Voces-Fantasmas-Program-Notes.pdf" target="_blank">program notes</a>` |
| an email that copies on click | `<span class="copy-email" data-copy="you@example.com"><u>you@example.com</u></span>` — site.js wires the copying |

The same tags work inside `WHY_TEXT` in `js/site.js` — for example, to turn a
"click here" sentence into a real link:

```html
<p>For more info, <a href="https://example.com" target="_blank" rel="noopener">click here</a>.</p>
```

Link colors are automatic (`.sheet a`: ink with underline, white on hover) —
never set colors on individual links.

**Embeds** — covered by the recipes in 1.2: an iframe inside
`<div class="embed">…</div>`, with `class="video"` on the iframe when it
should be 16:9 (video) rather than fixed-height (audio players).

---

## 2. How the site is organized

```
jehernandez/
├── index.html            the landing experience (skull/heart → overlay home)
├── about.html            full bio + press             → /about
├── work.html             featured works (banners)     → /work
├── flow.html             full categorized list        → /flow
├── contact.html          email + Netlify form         → /contact
├── work/<slug>.html ×16  one page per piece           → /work/<slug>
├── _redirects            Netlify redirects (/store → Square store; Netlify-only)
├── _headers              Netlify security headers (CSP etc.; Netlify-only, §9)
├── .nojekyll             tells GitHub Pages not to run Jekyll (harmless elsewhere)
├── css/site.css          ALL shared styling (colors, fonts, layout, chrome)
├── js/
│   ├── site.js           date, menu, footer, theme toggle, modals, copy-email
│   ├── theme-init.js     the pre-paint light/dark default (loaded in every <head>)
│   ├── skull-rot.js      THE skull orientation (single source for all pages)
│   └── mini-skull.js     corner-skull renderer for inner pages
├── assets/
│   ├── skull.bin         160,000-point coyote skull (int16, 1.28 MB)
│   ├── skull.js          same data, base64 (file:// fallback only)
│   ├── heart.bin         160,000-point heart, the morph target (int16, 1.28 MB)
│   ├── heart.js          same data, base64 (file:// fallback only)
│   ├── loop.mp3          the music (see recipe 1.1)
│   ├── audio.js          same audio, base64 (file:// fallback only)
│   ├── favicon.png       browser-tab icon, rendered from the skull (§8.4)
│   ├── teponaztli.svg    sound icon source (the live copy is inlined in index.html)
│   ├── winal.svg         winal glyph (currently unused, kept for later)
│   ├── headshot.jpg      bio photo
│   ├── work/             16 banner images for work.html (1200×280 jpg, recipe 1.2)
│   ├── fonts/            Academico ×4 + Mallory ×4 woff2 (the font switch, recipe 1.4)
│   └── Voces-Fantasmas-Program-Notes.pdf
├── tools/
│   ├── obj2points.py     OBJ → point-cloud .bin converter (skull + heart, §6)
│   └── make-favicon.py   renders assets/favicon.png from the point cloud (§8.4)
├── README.md             short overview
└── DOCUMENTATION.md      this file
```

The landing WebGL (skull, heart, strangeTrig background, audio) all lives
inline in `index.html`; `css/site.css` and the four `js/` files are shared by
every page.

---

## 3. The front page, piece by piece

### 3.1 The entry flow

The page has three states, driven mainly by two CSS classes on `<body>`
(`entered` and `overlay-open`, with a few helper classes for hints and the
heart). The overlay page is **not red** — it takes the current theme
(light `#f0f0f0` by default, or dark), see [8.1](#81-light--dark).

1. **Fresh load** — the strangeTrig attractor drifting behind, the long-count
   date top-center, the teponaztli bottom-left (faded, captioned "(turn audio
   on)"), and the **skull fading in at center immediately** (~2.4s). After ~3
   seconds a ↓ arrow fades in over the teponaztli (blinking and bobbing until
   the teponaztli is pressed); a "(click the skull)" hint fades in below the
   skull at 6s and gently blinks (it sits lower on narrow windows so it clears
   the skull); on touch screens a "(drag your finger across the screen)" hint
   also appears at 6s with the click hint following at 9s. All hints disappear
   forever after the first click, and the text hints also fade out 10s after
   they appear if nothing is clicked (see [8.2](#82-the-landing-hints)); styles
   are under `#hint` / `#hintDrag` in index.html. No menu, no corner skull yet.
   **Music starts only when the teponaztli is pressed** — browsers forbid
   autoplay with sound anyway, so the switch is explicit. On that first press,
   three **Mayan numerals (𝋡 𝋢 𝋣)** slide out from behind the teponaztli:
   they pick between three soundtracks (1 lit by default, the others dim), a
   click crossfades to that track, and they retract when the sound is turned
   off. Full detail in [8.8](#88-the-audio-three-tracks--the-mayan-numeral-selector).

   **The heart surprise fits into this state.** A few seconds after the hints
   clear (`CFG.heart.appearAfter`, default 5s), a small particle **heart button
   fades in bottom-right** (`body.swap-ready`). Clicking it morphs the skull's
   particles into the heart and back; the heart rotates and beats on its own
   and is itself clickable to enter the site. It's a landing-only flourish —
   full detail and all its knobs are in [8.7](#87-the-heart-surprise-skull--heart-morph).
   Set `CFG.heart.enabled: false` to remove it entirely.
2. **First skull (or heart) click** (`body.entered`) — the overlay opens *and*
   the site chrome is revealed: the **mini corner skull** fades in top-right
   (it persists from now on, the way back), and the **menu**, **theme toggle**,
   and the date's **"?" button** appear. On the landing these last three ride
   *with* the overlay — visible while it's open, hidden again on the black scene
   — so they toggle on and off as you move between the two (the corner skull is
   the only chrome that stays put on the black landing).
3. **Overlay open/closed** (`body.overlay-open`, toggled by the main
   skull/heart, the corner skull, or Escape) — the overlay page carries the
   bio, portfolio embeds, and links, in the current theme. **The scene freezes**
   while it's open: the render loop stops advancing and the music suspends
   mid-note; both resume exactly where they left off on close (including the
   morph — the heart doesn't reset). The long-count date docks to the top-left.

States are managed by `toggleSite()` / `setOverlay()` in the main script.
The inner pages' corner skulls link back to the fresh landing (`index.html`),
so visitors restart the flow from the skull. If a visitor enters the site and
then returns to the landing via the corner skull *before* the heart has
appeared, the heart is offered `CFG.heart.appearAfterReturn` seconds (default
3) after they get back. A deep link also exists — `index.html#home` skips
straight to state 3 (entered, overlay open, skull already faded in behind) —
if you ever want a link that lands directly on the overlay home.

### 3.2 CFG reference

Everything tunable sits in one object near the top of the main `<script>` in
`index.html`:

| Key | Default | What it does |
|---|---|---|
| `scale` | 0.78 | overall skull size (auto-shrinks further on narrow screens) |
| `focal` | 1.55 | perspective focal length (bigger = flatter) |
| `cam` | 2.6 | camera distance |
| `lookAmt` | [1.15, 0.75] | radians of yaw/pitch at the screen edges (mouse-follow strength) |
| `pointSize` | 1.9 | skull point size in px (× devicePixelRatio) |
| `noiseExp` | [3.2, 0.55] | `[0]` = constant breathing exponent (used); `[1]` = old mouse-X target, now disabled |
| `noiseAmp` | [0.008, 0.16] | `[0]` = constant breathing amplitude (used); `[1]` = old mouse-Y target, now disabled |
| `audioPush` | 0.36 | how far points shoot outward at a full spectral hit |
| `audioSens` | 1.35 | multiplier on the auto-gained band levels |
| `fadeSec` | 2.4 | skull fade-in duration after entering |
| `mini.count` | 22000 | points used by the corner skull |
| `mini.pt / scale / amp / exp` | — | corner-skull point size / size / noise |
| `mini.audio` | 0.5 | corner skull reacts at half strength |
| `bg.count` | 55000 | attractor particle count |
| `bg.scale` | 1.03 | attractor spread (>1 = bleeds past the edges; it fills the window and is deliberately stretched, not letterboxed) |
| `bg.ptSize` | 2.4 | attractor point size (in the low-res buffer) |
| `bg.gain` | 1.0 | background brightness |
| `bg.A0, B0, C0` | 0.1, 3.2, 1.0 | the attractor's home parameters (same names as the strangeTrig TD component) |
| `bg.ARange, BRange` | 1.7 | how far the mouse bends A (x-axis) and B (y-axis) |
| `bg.drift` | 0.013 | speed of the slow autonomous phase drift |
| `bg.audioWobble` | 0.3 | how much the music bends B (extra motion on hits) |
| `bg.blurDiv` | 2 | background renders at 1/blurDiv resolution (2 = half res; higher = blurrier/cheaper) |
| `bg.blurPx` | 1.1 | blur tap spread in buffer pixels (higher = softer) |
| `bg.type` | 0 | which attractor formula (0–6) — only used when `typeRandom` is false (§1.6) |
| `bg.typeRandom` | true | pick a random type from `typePool` each page load; false = always use `bg.type` |
| `bg.typePool` | [0,1,3,4,6] | the types the randomizer draws from |
| `heart.enabled` | true | master switch for the whole heart surprise; false = skull-only, no heart download (§8.7) |
| `heart.appearAfter` | 5 | seconds after the hints clear before the heart button appears (first load) |
| `heart.appearAfterReturn` | 3 | seconds after returning to the landing before it appears |
| `heart.morphSpeed` | 0.035 | how fast the skull↔heart morph eases (bigger = snappier) |
| `heart.beatAmp` | 0.14 | strongest particle push at a beat's peak (grows toward screen center) |
| `heart.beatRate` | 1.15 | base beats per second (up to ~2.4× faster toward screen center) |
| `heart.beatReach` | 0.6 | center-pull radius in screen-halves: beat is full at center, fades to 0 this far out |
| `heart.spinSpeed` | 0.25 | heart rotation, radians/sec (negative reverses; 0 = still) |

Full detail on the heart's motion (spin axis, tilt, beat mapping) is in §8.7.

URL overrides for experimenting (don't persist):
`?rot=x:-90,z:-90,x:90` (orientation, see 1.5), `?scale=0.6`, and
`?trig=N` (force attractor type N, 0–6, overriding the randomizer — §1.6).

### 3.3 The skull

`assets/skull.bin` is 160,000 points × 8 bytes: four little-endian int16s
(x, y, z, random) per point, positions normalized to −1…1 (the GPU reads them
as `SHORT normalized` — zero decode cost). The random channel gives each point
its own noise phase and brightness. The cloud is pre-shuffled, so "the first
N points" is always a uniform subsample — that's how the mini skull uses the
same file at 22k points, and why the data arriving progressively looks fine.

Per frame, the vertex shader (`vs-skull` in index.html) does, per point:

```
n     = 0.5 + 0.5·sin(time·(0.4+1.3r) + 151r)        smooth per-point oscillator
disp  = n^exponent · amplitude  +  audio·(0.35+0.65·hash(r))
p    += normalize(p) · disp                           push straight out from center
p     = SKULL_ROT · p                                 orient the scan
p     = Ry(yaw) · Rx(pitch) · p                       look at the mouse
```

then projects with a hand-rolled perspective (`w = cam − z`), sizes the point
by 1/w, and the fragment shader draws a soft round sprite in `uCol`, additively
blended (`ONE, ONE`) so dense regions glow. `audio` is the band mix from 3.5.

**The mouse no longer pushes the skull's particles outward.** `exponent` and
`amplitude` are now held at constant values (`CFG.noiseExp[0]` /
`CFG.noiseAmp[0]`), so the skull just "breathes" gently and stays put under the
cursor — while still **turning to look at the mouse** (the `Ry(yaw)·Rx(pitch)`
step, unchanged) and still **pulsing with the audio** (unchanged). Originally
these were mouse-mapped like a TouchDesigner Noise TOP's Exponent/Amplitude
(mouse X → exponent, mouse Y → amplitude). To bring that back, restore the two
commented `uAmp`/`uExp` lines in the skull-draw block of the render loop in
`index.html` (they sit directly under the constant versions); the second value
in each `noiseExp`/`noiseAmp` array is the old mouse target those lines use.

The "click the skull" target is `#skullHit`, an invisible 50vmin circle fixed
at screen center (the skull rotates in place, so a fixed hitbox works).

### 3.4 The strangeTrig background

A faithful port of the `strangeTrig.tox` compute shader — **all seven
attractor types (0–6)** from the TD component, chosen per load by the
randomizer or pinned with `CFG.bg.type` (see [1.6](#16-the-strangetrig-background-onoff-and-picking-an-attractor)).
The type is baked into the shader at compile time by a `#define ATTR_TYPE N`
prefix, so only the selected formula is active. Each of the 55,000 particles:

1. seeds itself in a scattered disc from its id (`hash(id)`),
2. iterates its attractor formula up to 9 times — but each particle group stops
   at a different depth (`grp = id mod 9`), which is what layers the structure
   exactly like the TD original. (Type 0, for example, is
   `x' = sin(x² − y² + A + φ)`, `y' = cos(C·x·y + B + φ)`; types 4–6 also use a
   `D` parameter. The full set lives in the `#if ATTR_TYPE` block of the `vs-bg`
   shader in index.html.)
3. is drawn as a dim red additive point **into a half-resolution buffer**,
   which is then upscaled to the screen through a 5-tap blur (`fs-blit`) —
   that's the soft look. `bg.blurDiv`/`bg.blurPx` control it (see table).

Mouse x bends parameter **A**, mouse y bends **B** around the TD component's
defaults; the music adds a wobble on **B** and speeds up the slow phase drift
(`bg.audioWobble`). The output is intentionally **stretched to the viewport**
(no aspect correction) so it always fills the page. The dim-red point color is
in the `fs-bg` fragment shader (§1.3).

### 3.5 Audio pipeline

There is no `<audio>` element. The MP3 is fetched and decoded once into memory,
then looped by a small scheduler: each pass of the file is its own short-lived
`AudioBufferSourceNode` that fades in as the previous one fades out, so the
loop has no hard seam (detail in [8.3](#83-the-audio-loop-crossfade)). Every
pass mixes into one shared bus:

```
BufferSource(pass N)  ┐
BufferSource(pass N+1)─┼─► loopBus ──► AnalyserNode (fftSize 256)  ← reactivity reads here
   … (crossfaded)      ┘        └─────► GainNode ──► speakers        ← mute happens here
```

Analysis taps `loopBus` (before the mute gain), so the skull keeps reacting to
the waveform even when muted-then-unmuted mid-beat.

Playback starts **only from the teponaztli**: the first press starts the
music (captions swap between "(turn audio on)" and "(turn audio off)", and
the icon fades when off). The sound itself fades in and out over 0.8s — a
`linearRampToValueAtTime` on the gain node in the teponaztli's click handler
and in `startSource()`; change the two `0.8` values in index.html for a
faster/slower fade. Turning it off zeroes the gain and glides the
reactivity to zero — a `reactEnv` envelope in the render loop eases the
skull's and background's response in/out over roughly a second (the `0.045`
lerp factor next to `reactEnv` in index.html controls the ramp speed), so
toggling never snaps, while beat-to-beat response stays crisp. Because
there's no media element, the classic "browser says playing but you hear
nothing" autoplay trap can't happen.

Reactivity: the 256-bin FFT is split into low (bins 1–6), mid (7–40), high
(41–110). Each band tracks its own running maximum (decaying at 0.9965/frame)
and reports `value / max` — this **auto-gain** is why a quiet track like
Crunchy still hits hard. Bands are smoothed (fast attack 0.5, slow release
0.075), weighted 50/30/20, scaled by `audioSens`, and drive `audioPush`
(skull), `bg.audioWobble` (background), and the mini skull at `mini.audio`
strength.

Opening the overlay calls `AudioContext.suspend()` (music freezes mid-sample);
closing calls `resume()`. The teponaztli button: first press starts audio
un-muted if it hasn't started; afterwards it toggles the gain between 0 and 1
(`.muted` class dims the icon).

### 3.6 The mini corner skull

Two implementations, one orientation source (`js/skull-rot.js`):

- **Front page**: drawn in the main render loop onto `canvas#mini` (its own
  WebGL context so it can sit *above* the overlay). Red over the black scene;
  switches to the page's `--ink` automatically while the overlay is open (and
  re-reads it on every theme flip, so it stays visible in light and dark).
  Audio reactive. Clicking it (the `#corner` button) toggles the overlay — the
  404-dot mechanic.
- **Inner pages**: `js/mini-skull.js` renders it in the current `--ink` color
  (it reads that CSS variable and updates on the `themechange` event — so it's
  near-black in light mode, near-white in dark, automatically; the old
  `data-color` attribute on the canvas is vestigial and unused now),
  mouse-following, 22k points. `#corner` is a link back to the fresh landing
  (`index.html`), so visitors restart from the skull. The skull.bin request
  hits the browser cache, so inner pages stay light.

---

## 4. Shared elements on every page

### 4.1 The long-count date

`js/site.js` computes today's Maya Long Count and writes it into every element
with class `lc-date`. Algorithm: Gregorian date → Julian Day Number →
`JDN − 584283` (the standard GMT correlation) → decomposed base-20/18 into
b'ak'tun.k'atun.tun.winal.k'in. Verified against 2012-12-21 = 13.0.0.0.0.
It uses the *viewer's* local date. To display a different correlation, change
`584283` in `longCount()`.

Positioning: top-center on the fresh landing page; docks to the top-left
(`body.overlay-open` or `body.page`) with the "?" button beside it.

**Vertical alignment (how it lines up with the menu / mini skull).** The date,
the menu, and the top-right mini skull are all meant to share one horizontal
band across the top. The trick is in the `.lc-wrap` rule in `css/site.css`: it
is given `top: 1.3vmax` **and** `height: 52px` — the *same* top and height as
the `.menu` and the mini-skull canvas — plus `display:flex; align-items:center`.
That means the date text is vertically centered inside a 52px-tall box that
starts at the same place as the others, so all three centers line up (the menu
on desktop, the mini skull on mobile where the menu drops to the bottom). **To
move the whole date+menu+skull band up or down**, change `top: 1.3vmax` on
`.lc-wrap` (and, if you want them to keep matching, the matching `top` on
`.menu` and on `canvas#mini` / `a#corner`). Raising the number lowers the band.
The mobile size override is a second `.lc-wrap` rule inside
`@media (max-width: 700px)` (font-size only — it keeps the same `top`).

The "?" opens the `#why` modal — its text is the `WHY_TEXT` constant in
`js/site.js` (recipe 1.7): edit once, changes everywhere. Links you put inside
`WHY_TEXT` are styled by the `.why-card a` rule in site.css to match the rest
of the site (body-ink, underlined, accent-red on hover) instead of the
browser's default blue.

### 4.2 Chrome

- **Menu** (`.menu`): same items as the old .music site + home + an Instagram
  icon (an inline SVG sized by `.menu svg`; the YouTube icon was removed — to
  add an icon back, copy the Instagram `<a>` block in any page's `nav.menu`
  into all pages). On the landing it rides with the overlay — shown while the
  popover is open, hidden on the black scene, so it toggles on/off as the
  corner skull switches between them (rule in index.html's `<style>`:
  `.menu { display:none } body.overlay-open .menu { display:flex }`). Colors:
  `--color-deep` at rest on the black landing, `--ink` on the overlay/inner
  pages, `--color-main` on hover; on phones it moves to a bottom-right dark
  scrim with fixed light (`#f0f0f0`) links. **Position** is the `.menu` rule in
  `css/site.css` (`top` / `right`; the `right` offset leaves room for the
  corner skull). It sits pixel-identical on every page because the window
  scrollbar is hidden on `<html>` (the `html, body` rule at the top of
  site.css) — if you ever re-enable scrollbars, scrolling pages will nudge
  all fixed chrome left by the scrollbar's width relative to the landing.
- **Teponaztli sound toggle** (`#soundT`, front page only): the SVG is
  inlined in `index.html` (search `svg.tepo`) and colored via CSS
  `currentColor` — `--color-icon` at rest, `--color-main` on hover, dimmed 35% while
  the sound is off. It is the audio's only switch: faded + "(turn audio on)"
  → press → full red + "(turn audio off)". (It's inline rather than a CSS
  mask because browsers block external mask images on file:// pages.)
- **Footer** (`.foot`): © line + alkabil.audio / Bio / My Work / Contact Me /
  Buy My Music, on every page including the overlay (there it's the "links"
  list).
- **Why modal** (`#why`): card colored by the theme (`--color-modal` background,
  `--ink` text, `--color-main` border and × button — so it flips with light/dark);
  links inside follow the site via `.why-card a` (§4.1). Closes on ×, backdrop
  click, or Escape.

---

## 5. Inner-page anatomy

Every inner page is the same skeleton — copy any of them:

```html
<body class="page">                    ← themed background (--color-page) + ink text
  lc-wrap (date + ?)                   ← date injected by js/site.js
  nav.menu                             ← identical on all pages
  canvas#mini + a#corner               ← corner skull, links home
  main.sheet                           ← left-aligned 404-style column
    h1, embeds, paragraphs
    footer.foot
  #why modal
  scripts: site.js, skull-rot.js, mini-skull.js
</body>
```

Piece pages live in `work/`, so all their shared links start with `../`
(css, js, assets, and the root pages); `js/mini-skull.js` detects the /work/
location automatically and resolves the skull data either way.

Layout rules that matter (all in `css/site.css`): `.sheet` is left-aligned
with a wide 70rem max, `clamp()`ed type that scales with the window; the
about page adds `about-sheet` (a wider 100rem canvas) and wraps its bio in
`.bio-flex` — text left, full uncropped photo right at `min(58%, 980px)` in
full color, photo dropping below the text on phones; `flow.html` additionally
has the `.jump` anchor menu, smooth scrolling (`html { scroll-behavior:
smooth; }` in its head), and the fixed `#topBtn`.

The space under the footer is the third value of `.sheet`'s `padding`
(`5vmax`, commented in site.css) — one number for every page including the
overlay; a phone-only rule right below it adds extra room so the last line
clears the fixed bottom-right menu.

---

## 6. Assets and tools

**The point-cloud models (`assets/skull.bin`, `assets/heart.bin`)**

- **`tools/obj2points.py`** — turns any OBJ into a point-cloud `.bin`. Usage is
  `python tools/obj2points.py <model.obj> <point-count> <output-name>`:
  - **arg 1** = the OBJ file to read (vertices only).
  - **arg 2** = how many points to output (default `160000`). **The skull and
    the heart must have the SAME count** or the morph can't pair them 1:1 —
    both are `160000`. If a model has fewer vertices than this, the script
    repeats random ones to pad up to the exact count.
  - **arg 3** = the output filename in `assets/` (default `skull.bin`).

  So the skull is `python tools/obj2points.py "Z:\TouchDesigner\Models\Coyote.obj" 160000 skull.bin`
  and the heart is `python tools/obj2points.py "Z:\TouchDesigner\Claude\Heart Centered 2.obj" 160000 heart.bin`.
  Under the hood it reads vertices only, centers on the bounding box,
  normalizes the longest axis to ±1 (so **both models end up the same overall
  size** — that's why the heart matches the skull's dimensions), shuffles with
  a fixed seed (so "the first N points" is always a uniform subsample — how the
  mini/preview skulls reuse the same file at fewer points), quantizes x/y/z to
  int16, and appends one random int16 per point (its noise phase + brightness).

- **The file:// fallbacks (`assets/skull.js`, `assets/heart.js`,
  `assets/audio.js`)** — base64 twins of `skull.bin`, `heart.bin`, and
  `loop.mp3`. The site fetches the `.bin`/`.mp3` normally; only if that fetch
  fails (which happens when the page is opened straight from disk as a
  `file://` URL, where fetch is blocked) does it fall back to loading the
  matching `.js`. **Whenever you regenerate a `.bin` or swap the mp3, refresh
  its twin** or the disk-opened version goes stale:

  ```
  python -c "import base64; open(r'assets/skull.js','w').write('window.SKULL_B64 = ' + repr(base64.b64encode(open(r'assets/skull.bin','rb').read()).decode()) + ';')"
  python -c "import base64; open(r'assets/heart.js','w').write('window.HEART_B64 = ' + repr(base64.b64encode(open(r'assets/heart.bin','rb').read()).decode()) + ';')"
  python -c "import base64; open(r'assets/audio.js','w').write('window.AUDIO_B64 = ' + repr(base64.b64encode(open(r'assets/loop.mp3','rb').read()).decode()) + ';')"
  ```

  They're only needed for the double-click-from-disk case; if you only ever
  view the site over a server/Netlify you can ignore (or delete) them.

**Other assets**

- **`assets/favicon.png`** + **`tools/make-favicon.py`** — the browser-tab icon
  is a rendering of the actual skull point cloud. Re-render it with
  `python tools/make-favicon.py` (see §8.4).
- **Fonts (`assets/fonts/`)** — Academico (free for commercial use — the Dorico
  family, a New Century Schoolbook revival) and Mallory (commercial,
  Frere-Jones — check your webfont rights before going live), four weights each
  (regular, bold, and their italics), converted from your installed OTFs to
  woff2. Which family the site uses is the `--site-font` switch (§1.4).
- **`assets/teponaztli.svg`, `assets/winal.svg`** — glyph art (the teponaztli
  is the audio button; the winal is spare, not currently wired in).
- **`assets/headshot.jpg`** — shown in full color at `min(58%, 980px)` of the
  bio row (`.bio-photo` in site.css controls the size; add
  `filter: grayscale(1);` there if you ever want it black &amp; white again).
- **`assets/Voces-Fantasmas-Program-Notes.pdf`** — localized so it no longer
  depends on Squarespace.

**Scripts (`js/`)** — `site.js` (shared chrome: date, menu, footer, theme
toggle, why-modal, copy-email — see §1.7), `theme-init.js` (the pre-paint theme
default — §8.1), `skull-rot.js` (skull orientation — §1.5), `mini-skull.js`
(the top-right corner skull on inner pages — §3.6). `index.html` has all the
WebGL for the landing inline.

Total first-load weight over http: ≈ **4.2 MB** — skull.bin 1.28 + heart.bin
1.28 + loop.mp3 1.26 + fonts ~0.24 + headshot 0.21 + page/code. Drop
`CFG.heart.enabled: false` to skip the heart download (~1.28 MB). Inner pages
after the front page: a few KB (everything's cached).

---

## 7. Troubleshooting

- **No sound** — by design the music only starts from the teponaztli
  (bottom-left); browsers forbid autoplay with sound anyway. Sound off also
  means the skull and background stop reacting — that's intentional.
- **Skull faces the wrong way** — recipe 1.5 (`?rot=` then bake into
  `js/skull-rot.js`).
- **Skull/audio missing when double-clicking index.html** — make sure
  `assets/skull.js` and `assets/audio.js` exist (they're the file:// path).
  Embeds (SoundCloud/Vimeo/YouTube) may still refuse on file:// — that's the
  embed providers, not the site; use `python -m http.server`.
- **A YouTube embed shows "Error 153 — Video player configuration error"** —
  error 153 means YouTube received **no referrer** from the embedding page.
  Two ways that happens: (a) the page was opened from disk (`file://` has no
  referrer — nothing can fix that; test over `python -m http.server` or
  Netlify, where it works), or (b) someone added a `referrerpolicy` attribute
  or `no-referrer` meta tag — don't. The site uses the plain
  `www.youtube.com/embed/` markup, which works everywhere a referrer exists,
  and every video has a "watch on YouTube" fallback link underneath.
- **A YouTube embed shows "Video unavailable"** — that's the video owner
  disallowing embedding (open `https://www.youtube.com/embed/VIDEO_ID`
  directly to confirm — if it's blocked there, no site can embed it).
- **Contact form does nothing locally** — Netlify forms only work deployed on
  Netlify.
- **Everything frozen on the front page** — that's the overlay-open state
  (by design: the scene and music pause behind the main site). Close with the
  corner skull or Escape.
- **Console says a shader failed** — you probably edited a shader block; the
  error message names the block (`vs-skull`, `fs-bg`, …) and the bad line.
- **Performance on weak machines** — lower `bg.count` (55000 → 20000) and
  `CFG.mini.count`, raise `bg.blurDiv` back to 4, and/or drop skull points by
  regenerating skull.bin at a lower count. **If you change the skull's point
  count, regenerate heart.bin at the exact same count** — the morph pairs them
  1:1 and needs matching totals (§8.7). The cheapest single win is
  `CFG.heart.enabled: false`, which skips the heart's points and download
  entirely.

---

## 8. The theme system, hints, and other 2026-07 additions

### 8.1 Light / dark

- **Palettes**: `:root` (light) and `html.dark` (overrides) at the top of
  `css/site.css` — full table in recipe 1.3. The **landing page is exempt on
  purpose**: it's always black with the red skull, trig, teponaztli and date,
  in both themes. Only the overlay and the inner pages flip.
- **Which theme new visitors get (the default)**: **one line** — the
  `var THEME_DEFAULT = 'dark';` at the top of `js/theme-init.js`. Set it to
  `'dark'` or `'light'`. That's the whole switch; it applies site-wide to
  anyone who hasn't used the toggle yet. (Currently `'dark'`.)
- **The toggle**: sun/moon button, injected by `js/site.js` on every page, in
  the **bottom-left corner** (same spot on every page). On inner pages it's
  always there; on the landing it exists **only while the overlay is open** and
  disappears when you return to the black scene (the teponaztli occupies that
  same corner underneath, but it's hidden behind the overlay then, so they
  don't clash). The icon shows the theme you'd switch *to* (moon = go dark,
  sun = go light).
- **Persistence & how the default is applied**: `js/theme-init.js` runs in
  every page's `<head>`, **before first paint** (so there's no flash), and
  decides the theme: it uses the visitor's saved choice from `localStorage`
  (`theme` = `dark`/`light`) if they've ever toggled, otherwise falls back to
  `THEME_DEFAULT`. Once someone uses the toggle, their choice is saved and
  wins over the default from then on. The OS dark-mode preference is
  deliberately ignored. (This is loaded as `<script src="…/js/theme-init.js">`
  in each head — the one script that must be in the head rather than
  single-sourced through `site.js`, because it has to run before the CSS; if
  you hand-make a new page, copy that head line, using `../js/…` from inside
  `work/`.)
- **The smooth swap**: during a toggle, site.js puts a `theming` class on
  `<html>` for ~0.7s; a rule in site.css transitions every background/text/
  border color while it's present, then removes it so hovers stay instant.
- **The skulls**: the big skull and the corner skull stay red over black.
  Over the overlay and on inner pages, the minis draw in the current `--ink`
  and re-read it on every toggle (a `themechange` event) — so they're
  near-black on light, near-white on dark, automatically.

### 8.2 The landing hints

Three nudges, all vanishing permanently after the first skull click:

- **↓ arrow** over the teponaztli — fades in at **3s**, blinks, bobs up and
  down, and *fades out* the moment the teponaztli is pressed.
- **"(click the skull)"** under the skull — **6s** on desktop.
- On **touch screens**: arrow 3s, "(drag your finger across the screen)" 6s,
  "(click the skull)" 9s.

**Auto-disappear (text hints only).** Even if the visitor never clicks, the
two *text* hints fade themselves out **10 seconds after they appear** — the
arrow is excluded and stays until the teponaztli is pressed. Because the
hints appear at staggered times, the linger is measured from the **last** one:

- **Desktop** — "(click the skull)" appears at 6s and clears at **16s**.
- **Touch** — "(drag your finger…)" (6s) and "(click the skull)" (9s) clear
  **together at 19s**, i.e. 10s after the later one loads.

Two knobs in `index.html` control this, right after the entry-flow wiring:
`HINT_LINGER = 10` (seconds a hint stays after it shows) and `lastHintDelay`
(`matchMedia('(hover: none)') ? 9 : 6` — the fade-in delay of the last hint on
touch vs desktop). If you change the fade-in delays in the CSS, update
`lastHintDelay` to match. Under the hood the timer adds a `hints-done` class
to `<body>` that fades `#hint` and `#hintDrag` (not the arrow).

All the fade-in timings are the `3s/4.1s`, `6s/7.1s`, `9s/10.1s` pairs in the
hint CSS block near the top of `index.html` (first number = fade-in delay,
second = when the blinking starts). The arrow's text is the `↓` character in
the `#hintTepo` div — swap it for anything.

**Vertical position of the text hints (if they overlap the skull).** The hints
sit a fixed distance *below* the center of the screen, measured in `vmin`
(1% of the screen's shorter side), so they scale with the skull:

- **Touch / mobile** — one knob controls both hints: the
  `:root { --hint-drop: 46vmin; }` line inside the `@media (hover: none)`
  block. **Raise the number to push them lower** (they clear the skull),
  lower it to move them up. The "(click the skull)" hint always stacks
  `2.1em` under "(drag your finger…)", so moving the knob moves the pair
  together. (Was `37vmin`; bumped to `46vmin` to clear the skull.)
- **Desktop** — the single hint's height is `#hint { top: calc(50% + 34vmin); }`
  in the base block, overridden to `41vmin` for narrow non-touch windows in
  the `@media (max-width: 700px)` block. Same idea: bigger vmin = lower.

In every case it's the `vmin` number you edit; leave the `50% +` and the
`+ 2.1em` alone.

### 8.3 The audio loop crossfade

The MP3 no longer hard-loops: each pass of the file is its own source that
fades in over **`CFG.audioFade` seconds (0.5)** while the previous pass fades
out — so a bounce that doesn't loop perfectly still wraps around without a
click or a gap. Swapping the music (recipe 1.1) is unchanged; if your new
track has a long reverb tail, try `audioFade: 1.2` for a lusher overlap, or
`0.15` for tight rhythmic loops. The freeze-behind-the-overlay behavior is
untouched (the whole audio clock suspends and resumes).

### 8.4 The favicon

`assets/favicon.png` is a real render of the point cloud (front view, site
red, transparent background). To regenerate — after swapping the model, or
re-orienting the skull, or changing the favicon color — run from the site root:

```
python tools/make-favicon.py
```

and keep `ROT_SEQ`/`RED` at the top of that script in sync with
`js/skull-rot.js` and the shader color. Needs `pip install numpy pillow`.

### 8.5 Why phones used to show the skull off-center

The canvas draws at `devicePixelRatio` resolution; without explicit CSS
dimensions a canvas *displays* at its buffer size, so on phones (dpr ≥ 2)
everything landed beyond the bottom-right corner. The fix is the
`width: 100%; height: 100%` on `canvas#gl` — don't remove those.

### 8.6 Crediting the inspiration

All references to the site that inspired this one were removed from the code
except one HTML comment in `index.html`'s head. If you'd like a visible
credit, add this line inside the `f.innerHTML` template in the footer block
of `js/site.js` (right after the links `join`, before the closing `</p>`):

```js
+ ' &nbsp;·&nbsp; <span class="muted">Site inspired by <a href="https://www.404zero.com" target="_blank" rel="noopener">404.zero</a></span>'
```

### 8.7 The heart surprise (skull ↔ heart morph)

For visitors who stick around the landing page: a small red **heart made of
particles** fades in at the bottom-right (mirroring the teponaztli's spot).
Clicking it makes the skull's 160,000 particles **slide in real time into the
shape of the heart** — and the button then shows a small skull, which morphs
everything back — and the corner button morphs right along with it, always
showing the shape the next click will produce. The big heart keeps all the
skull's jobs: it's audio-reactive, it fades/freezes with the overlay, and
**clicking the center still opens the site**. Two behaviors differ: the heart
does **not** follow the mouse — it rotates steadily with time (TouchDesigner
`absTime.seconds` style) — and it **beats** by pushing its particles outward,
faster and bigger as the mouse nears the **center of the screen**, easing off
toward the edges (details and knobs below).

**When it appears.** First load: `appearAfter` seconds (default 5) after the
text hints finish clearing. If the visitor entered the site before that and
later returns to the landing by clicking the corner skull, it appears
`appearAfterReturn` seconds (default 3) after the overlay closes. Once shown
it stays for the session.

**The master switch and all knobs** live in the `CFG.heart` block in
`index.html`:

```js
heart: { enabled: true,          // false = no heart surprise at all (site behaves as before)
         appearAfter: 5,         // seconds after the hints clear (first load)
         appearAfterReturn: 3,   // seconds after coming back from the popover
         morphSpeed: 0.035,      // easing toward the other shape (higher = faster morph)
         beatAmp: 0.14,          // max particle push at a beat peak (mouse Y higher = stronger)
         beatRate: 1.15,         // base beats/s (mouse X right = up to ~2.4x faster)
         spinSpeed: 0.25 },      // heart rotation in radians/s (absTime-style)
```

`enabled: false` is the whole-feature kill switch: the heart data is never
even downloaded, the button never exists, and the site behaves exactly as it
did before the feature — nothing else to revert.

**How it works / the data.** The heart is `assets/heart.bin` — the scan
`Heart Centered 2.obj` (990k vertices) reduced to **exactly the same 160,000
points as the skull**, same format, so every skull particle has one heart
partner. The vertex shader holds both positions (`aP` = skull, `aH` = heart)
and blends them with a `uMorph` uniform that JS eases between 0 and 1 —
that's the whole morph. Both models are normalized to the same bounding size
by the converter, so the heart occupies the same dimensions as the skull.
To use a **different second model**:

```
python tools/obj2points.py "path\to\model.obj" 160000 heart.bin
python -c "import base64; open('assets/heart.js','w').write('window.HEART_B64 = ' + repr(base64.b64encode(open('assets/heart.bin','rb').read()).decode()) + ';')"
```

(the second line refreshes the file:// fallback copy, same idea as the audio
one; models with fewer than 160k vertices are padded automatically so the
count always matches). The corner preview button (`#swapBtn` in the CSS, its
size/position right next to the teponaztli rules) always shows the shape a
click would morph **into** — heart preview spins with time, skull preview
follows the mouse, both react to the music.

**Adjusting the heart's rotation, tilt, and beat.** Three of these are simple
number tweaks in the `CFG.heart` block; two need a one-line code change in the
render loop. Here's each, from easiest to most involved:

- **Spin speed & direction** — `CFG.heart.spinSpeed` (default `0.25`), in
  radians per second. Bigger = faster; **negative reverses** the direction;
  `0` = the heart hangs still. It also drives the corner preview so they
  always match. (Under the hood the spin is an *accumulated angle* — `spinA`,
  advanced by `dt * spinSpeed` each frame and wrapped to within half a turn
  when you click — not `time × speed`. That's deliberate: the old version
  multiplied by elapsed time, so the longer the page sat the faster the
  morph whipped around. Leave the accumulator alone unless you know why.)
- **The beat** — the heart pulses by pushing its **particles outward** (not
  by scaling the whole model). Two knobs: `CFG.heart.beatAmp` (default `0.14`)
  is the strongest push at a beat's peak, and `CFG.heart.beatRate` (default
  `1.15`) is the base beats per second. Set `beatAmp: 0` for no beat.

  **Center-proximity mapping (heart-only).** The beat responds to how close
  the mouse is to the **center of the screen**: near the middle the heart
  beats **faster and pulses bigger**, and it eases off toward the edges and
  corners. This is intentionally *separate* from the skull — the skull no
  longer has a mouse-driven particle push at all (§3.3), so nothing here
  affects it. The mechanism is one line in the render loop of `index.html`
  (search `centerProx`):
  ```js
  const centerProx = Math.max(0, 1 - Math.hypot(sm.x - 0.5, sm.y - 0.5) / CFG.heart.beatReach);
  ```
  `sm.x`/`sm.y` are the smoothed pointer in `0..1` screen coordinates, so
  `(sm.x-0.5, sm.y-0.5)` is the offset from center and `Math.hypot(...)` is the
  distance to it. **`CFG.heart.beatReach`** (default `0.6`) sets the reach in
  screen-halves: at the exact center `centerProx` is `1`, and it falls linearly
  to `0` at `beatReach` of the way to a corner — raise it for a gentler, wider
  falloff, lower it to make only the dead-center count. `centerProx` then
  scales both the rate (`0.6 + 1.8 * centerProx` on the `beatPhase +=` line,
  so up to ~2.4× at center) and the push (`0.3 + 1.0 * centerProx` on the
  `beatPush =` line). (This replaced an earlier mouse-Y "noise push" on the
  heart; that Y-noise is faded out for the heart via `* (1 - morphT)` on the
  `uAmp` line, so the beat is the heart's whole mouse response.)
- **Spin axis** — by default the heart turns like a carousel, around the
  **vertical axis** (yaw). That's set by *which* look-component gets the spin
  angle in the render loop. Find this line in `index.html` (the skull draw):
  ```js
  gl.uniform2f(U(skullP, 'uLook'),
      (sm.x - 0.5) * CFG.lookAmt[0] * (1 - morphT) + spinA * morphT,   // yaw
      (sm.y - 0.5) * CFG.lookAmt[1] * (1 - morphT));                    // pitch
  ```
  The `+ spinA * morphT` on the **first** argument spins it around vertical.
  Move that term to the **second** argument to make it tumble forward/backward
  (pitch) instead. (Roll — flat in the screen plane — isn't reachable this
  way; ask and it can be added through the rotation matrix.)
- **Resting tilt / which way the heart faces** — the heart appears in its raw
  model orientation because the morph fades the skull's orientation matrix out
  to identity: `rotMix(ROT, IDENT, morphT)` in the render loop. To lean the
  heart at a fixed angle, replace that `IDENT` with your own matrix, e.g.
  `rotMix(ROT, skullRotMatrix([['x', 20], ['y', -15]]), morphT)` (degrees, same
  axis/notation as `SKULL_ROT` in `js/skull-rot.js`). Leave `spinSpeed` doing
  the continuous turn; this only sets the tilt it spins around.
- **Corner-button size** — the bottom-right heart/skull button is a **square**,
  and both its `width` and `height` read from one variable, `--swap-size` on
  `#swapBtn` in the `index.html` `<style>` block. So **that single value is the
  size** — change it and the whole button (and the model drawn in it) scales.
  It's currently `clamp(96px, 11.25vmax, 165px)`, which is `clamp(MIN,
  PREFERRED, MAX)`: never smaller than **96px** (tiny screens), normally
  **11.25vmax** (11.25% of the larger screen side), never larger than **165px**
  (big screens). To make it bigger/smaller, scale all three numbers together
  (e.g. ×1.33 → `clamp(128px, 15vmax, 220px)`); to pin one fixed size instead,
  just write a single value like `110px`.
- **Corner-button position** — two values on the `#swapBtn` rule.
  `bottom` (currently `calc(2.5vmax - 1.5em)`) is the gap from the bottom of
  the screen up to the button, so **a smaller number sits lower**. `right`
  (currently `1.4vmax`) is the gap from the right edge, so **a smaller number
  sits further right**. Both apply on desktop and mobile (there is no separate
  mobile override — the bottom menu it used to dodge is hidden on the black
  landing, appearing only with the overlay, which covers the button anyway).

The bottom-right preview **also morphs** when clicked, mirroring the big shape
(it always shows what the *next* click produces), and it shares `spinSpeed`,
`beatAmp/Rate` and the beat's mouse mapping automatically — so those edits
carry over with no extra work.

---

### 8.8 The audio: three tracks + the Mayan-numeral selector

The teponaztli (bottom-left) is the on/off switch; three Mayan numerals to its
right pick **which** of three soundtracks plays. All three loop seamlessly and
crossfade into one another.

**The flow.** On first click of the teponaztli the audio starts on track 1 and
the numerals **𝋡 𝋢 𝋣** slide out from behind the teponaztli toward the center
(staggered). They're dim except the playing one, which is lit; 𝋡 (track 1) is
lit by default. Clicking a numeral crossfades from the current track to that
one over `CFG.audioFade` seconds. Clicking the teponaztli again turns the sound
off (master fade) and the numerals **retract back behind the teponaztli**;
clicking it once more brings them and the sound back on the last-selected
track. While audio is off the numerals are inert.

**Changing which sounds play.** The three tracks are the `TRACKS` array near
the top of the audio section in `index.html`:

```js
const TRACKS = [
  { url: 'assets/loop.mp3',    fb: 'assets/audio.js',   b64: 'AUDIO_B64' },   // numeral 1
  { url: 'assets/cicadas.mp3', fb: 'assets/cicadas.js', b64: 'CICADAS_B64' }, // numeral 2
  { url: 'assets/blue14.mp3',  fb: 'assets/blue14.js',  b64: 'BLUE14_B64' },  // numeral 3
];
```

Array order = numeral order (1, 2, 3). To swap a sound, replace its `.mp3`
(keep the filename) and regenerate its base64 file:// fallback — the same
two commands as [§1.1](#11-change-the-music), pointed at that file, e.g. for
track 2:

```
"C:\Program Files\Derivative\TouchDesigner\bin\ffmpeg.exe" -i "new.wav" -codec:a libmp3lame -b:a 192k assets\cicadas.mp3
python -c "import base64; open('assets/cicadas.js','w').write('window.CICADAS_B64 = ' + repr(base64.b64encode(open('assets/cicadas.mp3','rb').read()).decode()) + ';')"
```

To add a **fourth** track: add a row to `TRACKS` (its own `.mp3`, `.js`
fallback name, and a unique `b64` variable that matches the `window.NAME_B64`
your fallback writes), then add a `<button class="tnum" data-track="3">𝋤</button>`
to the `#tracks` block in the HTML (𝋤 is `&#x1D2E4;`, Mayan numeral 4). The
selector logic is fully generic — no other code changes.

**How it works.** No `<audio>` element: each track's MP3 is fetched and decoded
into a buffer, then looped by re-spawning short crossfading passes (the same
seamless-loop trick as before, now one scheduler per track). Every track has
its **own gain node** feeding a shared analyser (for the reactivity) and the
master mute; switching tracks simply ramps the old track's gain to 0 and the
new one's to 1 over `CFG.audioFade`, which is the crossfade.

**First selection vs. later ones (the "resume" behavior).** A track's loop
starts the **first time that track is selected**, playing **from the top of the
file**, and then runs **continuously** — it is never stopped or restarted for
the rest of the page's life. Consequences:

- The **first** time you pick a numeral, that track begins at the beginning.
- **Every later** switch back to it fades in **wherever it is now**, as if it
  had been playing the whole time (because it has — silently, at gain 0). That
  mid-track resume is the point of running each track's loop non-stop.
- Because a loop is started exactly once and never torn down, two copies of a
  track can't overlap (an earlier bug, when switching hard-stopped and later
  restarted a loop while its long tail was still audible).

Track 1 is auto-selected on the first teponaztli press, so it's the first to
start from the top. Tracks 2 and 3 have their **buffers** preloaded at that same
moment (so there's no fetch delay), but their **loops** don't begin until you
first select them. Playback only ever starts on a click/tap — browsers forbid
autoplay with sound. In code: `startTrackLoop()` has a one-per-track guard (so
re-selecting never restarts it), and `selectTrack()` only crossfades gains;
`tryStart()` starts track 1 and preloads the other two buffers.

**Knobs.**
- **Crossfade length** (both the loop seams *and* track-switch fades):
  `CFG.audioFade` (seconds) in the `CFG` block. Sensitivity of the reactivity
  is still `CFG.audioSens` / `CFG.audioPush` (see [3.5](#35-audio-pipeline)).
- **Numeral position** — the `#tracks` rule in `index.html`'s `<style>`.
  `left` sets where the row starts (it clears the teponaztli's width); `gap` is
  the spacing between numerals; `.tnum` `font-size` is their size; the slide
  distance is the `translateX(-2.4em)` on `.tnum` (how far left they start, i.e.
  how far they travel out), and the per-numeral `transition-delay`s are the
  stagger.
  - **Vertical position (the important one)** — the numeral row is **centered
    on the teponaztli's SVG glyph**, and it stays centered at every screen size
    because it's anchored to the same measurements the teponaztli is built from.
    The single knob is the `--tnum-center` custom property on `#tracks`: it is
    the distance from the **bottom of the screen up to the center of the glyph**,
    and **raising it moves the numerals up**, lowering it moves them down. Its
    default is `calc(2.5vmax + 1.4rem + 0.334 * clamp(64px, 7.5vmax, 110px))`,
    which is, piece by piece: `2.5vmax` (the teponaztli's own gap from the
    bottom) `+ 1.4rem` (the height of the "(audio on/off)" caption that sits
    under the glyph) `+ 0.334 × the teponaztli's width` (half the glyph's
    height — the teponaztli SVG is 382×255, so its height is ≈ 0.667 × its
    width, and half of that is 0.334×). The `transform: translateY(50%)` right
    below it is what actually parks the row's own center on that line, so you
    never have to account for the numerals' own height — just move
    `--tnum-center`. If you resize the teponaztli (its `width` clamp) or change
    its caption, nudge the `1.4rem`/`0.334` terms to match.
- **Numeral font** — `MayanNumerals` (Noto Sans Mayan Numerals, subset to the
  digits), `@font-face` at the top of the `#tracks` CSS. The glyphs are the
  real Unicode Mayan numerals `&#x1D2E1;`–`&#x1D2E3;` (bars-and-dots).
- **Colors** — dim/lit use `--color-icon` (rest) and `--color-main` (hover),
  the same accent variables as everything else; opacity `0.35` (dim) vs `1`
  (active/lit) is in the `.tnum` rules.

---

## 9. Security notes

The honest summary: **a static site like this has almost no attack surface of
its own.** There is no database, no server code, no login, no user input that
gets stored or rendered, no third-party JavaScript (fonts are self-hosted,
players are isolated iframes). The realistic way a site like this "gets taken
over" is through the **accounts around it** — so the highest-value habits
are:

1. **Turn on two-factor authentication** on GitHub/Netlify and on your domain
   registrar. Domain/DNS hijacking and repo access are the actual risks.
2. Don't paste third-party `<script src="...">` snippets (analytics, widgets)
   without thinking — that's the one act that can hand your visitors to
   someone else. Everything this site runs is its own code.
3. Keep the contact form as it is: Netlify Forms handles submissions
   server-side, nothing on the site stores or re-displays visitor text.

What's already in place:

- **`_headers`** (site root, Netlify-only) sends a Content-Security-Policy —
  only same-origin scripts/styles/images/fonts run, embeds may only come from
  the four whitelisted players (YouTube, Vimeo, SoundCloud, Apple Music) —
  plus `nosniff`, a referrer policy, a permissions policy (no camera/mic/
  geolocation), and `frame-ancestors 'none'` / `X-Frame-Options: DENY` so
  no other site can iframe yours (clickjacking).
- All external links carry `rel="noopener"` (a new tab can't reach back into
  your page). Embeds are sandboxed by the browser's same-origin policy.
- GitHub Pages ignores `_headers`; the site is still fine there (the headers
  are hardening, not a requirement), just know the CSP only applies on
  Netlify.
- If you ever add a `<meta http-equiv="Content-Security-Policy">` copy of the
  CSP for GitHub Pages, note `frame-ancestors` doesn't work in meta tags —
  it's header-only.

---

## 10. Changelog

Newest first. This starts partway through the project, so the earliest entries
are grouped summaries; dates before the first tracked day are approximate.

### 2026-07-12 — multi-track audio, numerals, polish
- **Audio: three soundtracks + Mayan-numeral selector (§8.8).**
  - Converted `Cicadas and Quetzal.wav` → `assets/cicadas.mp3` and
    `Blue 14.wav` → `assets/blue14.mp3` (192 kbps, via TouchDesigner's ffmpeg),
    each with a base64 `file://` fallback (`cicadas.js`, `blue14.js`).
  - Imported **Noto Sans Mayan Numerals**, subset to the digit glyphs →
    `assets/fonts/MayanNumerals.woff2` (6.6 KB); the numerals are the real
    Unicode bars-and-dots `𝋡 𝋢 𝋣` (U+1D2E1–3).
  - **Rewrote the audio engine**: a `TRACKS` array, one gain node per track, a
    per-track self-crossfading loop scheduler, and `selectTrack()` that
    crossfades old→new over `CFG.audioFade`. Track 1 loads immediately; 2 and 3
    preload when the teponaztli is first pressed.
  - **Fixed a track-overlap bug** (reselecting a track stacked a second copy):
    a track's loop is now started exactly once and never stopped/restarted.
  - **First selection plays from the top; later ones resume mid-track.** Each
    track's loop begins the first time it's picked (from 0) and then runs
    continuously, so switching back fades in wherever it "would" be (§8.8).
  - **UI**: the numerals slide out from behind the teponaztli on audio-on
    (`body.audio-on`, staggered), dim except the lit active track (1 by
    default), and retract on audio-off. Wired `#tracks` markup + `.tnum` CSS.
- **Numeral vertical position** anchored to the teponaztli SVG's center via a
  single `--tnum-center` knob (built from the same vmax/width pieces so it
  tracks all screen sizes) + `translateY(50%)`; documented the logic in §8.8.
- **Heart/skull corner button** nudged right + lower (`#swapBtn` `right: 1.4vmax`,
  `bottom: calc(2.5vmax - 1.5em)`) to line up with the teponaztli.
- **Cuicatl "?" modal** text made a standalone, independently editable string
  (`CUICATL_TEXT`) instead of an alias of `WHY_TEXT`.
- Both **"?" buttons** now turn `--color-main` on hover, matching links (one
  shared `.why-btn:hover` rule).
- **Docs**: added §8.8 and this changelog; added §8.8 + §10 to the Contents;
  added the overlay-portfolio ordering explainer (§1.2, CSS-grid source order);
  documented the heart's rotation/tilt/beat knobs (§8.7); mirrored the audio
  feature into §1.1, §3.1, and the README; and swept stale info out of
  §2 (file tree), §3.1 (still-"red" language, missing heart), §4.2 (menu
  colors), and §6 (assets). Added the "list changed files each message" habit.

### 2026-07-11 — modals, licensing, dark default
- **Cuicatl explainer modal** — a second "?" modal beside "Cuicatl" on the
  full-works page, wired through a new reusable `wireModal(btnId, modalId, html)`
  in `js/site.js` (refactored the date modal onto it too).
- **LICENSE** added — proprietary, source-available, **study-only**: viewing
  and running locally is allowed, all copying/deploying/reuse needs written
  permission; third-party fonts carved out.
- **Default theme flipped to dark**, centralized in a new `js/theme-init.js`
  (`THEME_DEFAULT` — one line), loaded synchronously in every page's `<head>`
  so there's no light-flash before paint; the toggle still overrides + persists.
- **Copyright year auto-fills** from the current date in `js/site.js` (footer),
  and the hardcoded "2026" in the overlay was replaced with the injected year.
- **Heart beat reworked** to a center-proximity **particle pulse**: beats
  faster/stronger as the cursor nears screen center (`CFG.heart.beatReach`),
  independent of the skull.
- **Skull's mouse-driven particle push turned off** (it still follows the mouse
  and reacts to audio; only the mouse-position noise push was removed).
- Long-count date lowered to align with the menu/mini-skull; why-modal links
  restyled to follow the site; morph button enlarged ×1.5.

### 2026-07-08 — the heart surprise
- Added the **skull ↔ heart morph**: converted `Heart Centered 2.obj` →
  `assets/heart.bin` (padded to the **same 160k points** as the skull so
  particles pair 1:1), added `aH` + a `uMorph` blend to the vertex shader, and
  a bottom-right **preview button** (`#swapBtn`) that shows the shape a click
  morphs into.
- The heart **rotates** with time (`spinSpeed`, TD `absTime` style) and
  **beats** with the audio; it's clickable to enter the site; the mini corner
  skull/heart morphs too. Appear timers: `appearAfter` (first load, after the
  hints clear) and `appearAfterReturn` (after coming back from the overlay).
- Whole feature gated by `CFG.heart.enabled` (false = original skull-only site).
- **Fixed a spin-speed bug** where the morph rotation accelerated the longer
  the page was open (accumulated `simT`); switched to a wrapped spin angle.

### 2026-07-07 — theme, chrome, deploy
- **Light/dark theming** with a sun/moon toggle; all colors moved to CSS
  variables (`:root` light + `html.dark`); the overlay and why-modal colors
  pulled into those variables so they flip too. Landing stays black in both.
- **strangeTrig background**: exposed all **seven** attractor types from the
  `.tox`, with a per-load randomizer (`typeRandom` / `typePool`) and a
  `?trig=N` URL override for previewing; background stretches to fill the
  viewport and reacts to audio.
- **Menu & footer single-sourced** in `js/site.js` (`MENU_LINKS` /
  `FOOTER_LINKS`), injected on every page; the menu rides with the overlay on
  the landing; the mobile menu was kept to one line (no icon wrap).
- **Audio** switched from an `<audio>` element to a decoded AudioBuffer with a
  self-crossfading loop (seamless looping, analysis survives muting).
- **URL parity** with jehernandez.music: pages restructured to `/about`,
  `/work`, `/flow`, `/work/<slug>`; added `_redirects` (`/store` → Square),
  `_headers` (CSP + hardening), `.nojekyll`, and a skull-rendered favicon.
- **Landing hints** (bobbing arrow + text) with staggered fade-in timing and a
  10s auto-retire; mobile positioning fixes.
- Renamed the project folder `website-starter` → `jehernandez`.

### 2026-07-06 — initial build
- **Coyote-skull point cloud** (`assets/skull.bin`, 160k points via
  `tools/obj2points.py`) rendered in raw WebGL: mouse-look ("looks at" the
  cursor), constant TD-style noise "breathing," and an audio-reactive outward
  pulse (low/mid/high FFT with per-band auto-gain).
- **strangeTrig attractor background** ported from `strangeTrig.tox`, rendered
  blurry and low-res behind the skull.
- **Teponaztli** audio toggle; **Maya Long Count date** (GMT correlation,
  computed in `js/site.js`); the 404-style **overlay home** (bio, portfolio
  embeds, links) that freezes the scene while open.
- **All pages ported** from jehernandez.music — about (full bio + press), work
  (banner gallery), flow (full categorized list), contact (Netlify form +
  copy-email), and 16 individual work pages with their embeds and notes.
- Self-hosted **Academico** + **Mallory** fonts (one-line font switch);
  base64 `file://` fallbacks for skull + audio; the README and this document.
