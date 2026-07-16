/* shared: long count date, menu, footer, theme toggle, why-modal, copy email, top button */

/* pages live at the site root or one level down in /work/ — internal links
   and assets get this prefix so the same script works from both depths */
const BASE = /[/\\]work[/\\][^/\\]*$/.test(location.pathname) ? '../' : '';

function longCount(d) {
	d = d || new Date();
	const y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
	// Gregorian -> Julian Day Number
	const a = Math.floor((14 - m) / 12);
	const yy = y + 4800 - a;
	const mm = m + 12 * a - 3;
	const jdn = day + Math.floor((153 * mm + 2) / 5) + 365 * yy
		+ Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
	// GMT correlation (584283): JDN of 0.0.0.0.0 (4 Ajaw 8 Kumk'u)
	let n = jdn - 584283;
	const baktun = Math.floor(n / 144000); n %= 144000;
	const katun = Math.floor(n / 7200); n %= 7200;
	const tun = Math.floor(n / 360); n %= 360;
	const uinal = Math.floor(n / 20);
	const kin = n % 20;
	return baktun + '.' + katun + '.' + tun + '.' + uinal + '.' + kin;
}

document.querySelectorAll('.lc-date').forEach(el => { el.textContent = longCount(); });

/* auto-updating copyright year: any <span class="year"></span> is filled with
   the current 4-digit year (e.g. 2026), so the © never needs manual editing.
   (The footer builds its own year the same way, below.) */
document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });

/* ============ MENU — EDIT ONCE, CHANGES ON EVERY PAGE ============
   [label, destination]. Destinations without "http" are pages of this site
   (BASE handles the work/ subfolder); full URLs open in a new tab. */
const MENU_LINKS = [
	['home', '/'],
	['about', 'about'],
	['work', 'work'],
	['writing', 'https://jehernandez.substack.com'],
	['store', 'https://alkabilmusic.square.site/'],
	['contact', 'contact'],
];
/* icon links rendered after the text links (inline SVG, add more if needed) */
const MENU_ICONS = [
	['Instagram', 'https://www.instagram.com/jehernandezhtx',
	 '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none"/></svg>'],
];

/* ============ FOOTER — EDIT ONCE, CHANGES ON EVERY PAGE ============
   Same link rules as the menu. The year updates itself. */
const FOOTER_LINKS = [
	['alkabil.audio', 'https://www.alkabil.audio'],
	['Bio', 'about'],
	['My Work', 'work'],
	['Contact Me', 'contact'],
	['Buy My Music', 'https://alkabilmusic.square.site/'],
];

/* Turn a [label, dest] pair into an <a>. Rules for `dest`:
     - starts with "http"  -> external link, opens in a new tab.
     - a page slug          -> served CLEAN and root-absolute, e.g. "about"
                               becomes href="/about", "work" -> "/work".
     - the HOMEPAGE          -> use "/" (an empty string "" or "index.html" also
                               work). All three produce href="/" — the clean home.
   Because the paths are root-absolute (/about, /work/...), the same link works
   from any folder depth, so there is no per-page or "../" bookkeeping. */
function cleanHref(dest) {
	if (dest.startsWith('http')) return dest;
	let slug = dest.replace(/\.html$/, '').replace(/^\/+/, '');   // drop .html + leading /
	return (slug === '' || slug === 'index') ? '/' : '/' + slug;  // "", "/", "index.html" -> "/"
}
function linkHTML(label, dest) {
	return dest.startsWith('http')
		? '<a href="' + dest + '" target="_blank" rel="noopener">' + label + '</a>'
		: '<a href="' + cleanHref(dest) + '">' + label + '</a>';
}
document.querySelectorAll('nav.menu').forEach(nav => {
	nav.innerHTML =
		MENU_LINKS.map(([label, dest]) => linkHTML(label, dest)).join('\n') +
		MENU_ICONS.map(([name, url, svg]) =>
			'<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + name + '">' + svg + '</a>').join('\n');
});
document.querySelectorAll('footer.foot').forEach(f => {
	f.innerHTML = '<p class="muted">© J.E. Hernández ' + new Date().getFullYear() + ' &nbsp;·&nbsp; ' +
		FOOTER_LINKS.map(([label, dest]) => linkHTML(label, dest)).join(' &nbsp;·&nbsp; ') +
		' &nbsp;·&nbsp; Website info <button class="why-btn" id="designBtn" aria-label="About the website design">?</button>' +
		'</p>';
});

/* ============ WORK-PAGE NAV — EDIT ONCE, CHANGES ON EVERY WORK PAGE ============
   Fills the <p class="worknav"></p> shell at the bottom of each work page, so
   the "featured work / full list of works" links live in one place instead of
   being copied into all 16 pages. Same [label, dest] rules as the menu. */
const WORK_NAV = [
	['← featured work', 'work'],
	['full list of works', 'flow'],
];
document.querySelectorAll('.worknav').forEach(el => {
	el.innerHTML = WORK_NAV.map(([label, dest]) => linkHTML(label, dest)).join(' &nbsp;·&nbsp; ');
});

/* ============ LIGHT / DARK THEME ============
   The default for first-time visitors is set in js/theme-init.js (the
   THEME_DEFAULT line), which each page loads in its <head> so the theme is
   right before the first paint (no flash). Here we only handle the toggle:
   the choice is saved in localStorage ("theme") and overrides the default
   from then on. The OS/browser dark-mode preference is deliberately ignored. */
const themeT = document.createElement('button');
themeT.id = 'themeT';
themeT.setAttribute('aria-label', 'Toggle dark mode');
themeT.innerHTML =
	'<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.6"/><path d="M12 2.2v2.6M12 19.2v2.6M2.2 12h2.6M19.2 12h2.6M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/></svg>' +
	'<svg class="moon" viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 14.2A8.8 8.8 0 0 1 9.8 3.6 8.9 8.9 0 1 0 20.4 14.2z"/></svg>';
document.body.appendChild(themeT);
themeT.setAttribute('aria-pressed', String(document.documentElement.classList.contains('dark')));
themeT.addEventListener('click', () => {
	const html = document.documentElement;
	html.classList.add('theming');                 // everything cross-fades for a moment
	const dark = html.classList.toggle('dark');
	localStorage.setItem('theme', dark ? 'dark' : 'light');
	themeT.setAttribute('aria-pressed', String(dark));
	dispatchEvent(new CustomEvent('themechange')); // the mini skulls re-read --ink
	setTimeout(() => html.classList.remove('theming'), 750);
});

/* ============ "WHY THIS DATE?" — EDIT THE TEXT HERE, ONCE ============
   This fills the ? modal on every page (the #why blocks in the HTML files
   are empty shells that this script populates). Plain HTML is allowed. */
const WHY_TEXT = `
	<p><strong>What is this?</strong></p>
	<p>These digits are the represntation of the Maya Long Count calendar. Its 
	five positions — <em>b’ak’tun</em>, <em>k’atun</em>, <em>tun</em>, <em>winal</em>, and 
	<em>k’in</em>, each correspond to a count of days. A <em>k’in</em> is one day; a <em>winal</em> is 20 days; 
	a <em>tun</em> is 360 days; a <em>k’atun</em> is 7,200 days; and a <em>b’ak’tun</em> is 144,000 days. Read from left 
	to right, the date counts larger and smaller temporal units, moving from hundreds of 
	thousands down to the single day.</p>
	<p>This locates this site within another way of understanding our place in time. This 
	system, along with other Originary timekeeping practices, emerged from the lands in 
	which I was born. Placing it here reiterates these systems as legitimate forms of 
	calendrical tracking on these lands now known as the Americas. Timekeeping is not neutral: 
	it invites us into longer genealogies that precede colonial naming, persist beyond it, and 
	continue to shape how these lands are understood.</p>
	<p>For more info, <a href="https://www.penn.museum/sites/expedition/maya-calendars" target="_blank" rel="noopener">click here</a>.</p>
`;

/* ============ "CUICATL" EXPLAINER — EDIT THIS TEXT HERE, ONCE ============
   Fills the "?" modal beside "Cuicatl" on the full-works page. It's its own
   independent HTML string (a copy of the date text for now) — edit it freely
   without touching WHY_TEXT above; the two are separate. Styling is inherited
   from the shared .why-modal / .why-card classes, so you only edit words. */
const CUICATL_TEXT = `
	<p><strong>What is Cuicatl?</strong></p>
	<p><em>Cuicatl</em> is a Nahuatl word commonly translated as song, singing, or music. 
	In historical Nahua sources, it names a broad field where voice, poetry, rhythm, dance, 
	and memory meet. The phrase <em>in xōchitl in cuīcatl</em> — “flower and song” — is often 
	used to describe poetry or art. Contemporary works such as Gabriel Pareyón’s <em>Xochicuicatl 
	cuecuechtli</em> and <em>Chicueyi Cuicatl</em> continue to study and dialogue with this longer 
	expressive history.</p>
`;

/* ============ "WEBSITE DESIGN" (footer) — EDIT THE TEXT HERE, ONCE ============
   Opens from the "?" beside "Website design" in the footer on every page. */
const DESIGN_TEXT = `
	<p><strong>Webdesign Credits:</strong></p>
	<p>Website designed by J.E. Hernández based on work done as 
	<a href="https://www.yslas.music/" target="_blank" rel="noopener">Yslas</a>, produced by 
	<a href="https://silbaca.tv/" target="_blank" rel="noopener">Sílbaca</a>. Inspired 
	by <a href="https://www.404zero.com/" target="_blank" rel="noopener">404.zero</a>.</p>
	<p>If you're interested in website design like this for your own project, please
	don't hesitate to <a href="/contact" target="_blank" rel="noopener">contact me</a>.
`;

/* Wire a "?" button to its modal. The button (<button class="why-btn" id="...">)
   lives in the page/footer; the modal shell is created here if the page doesn't
   already contain a <div class="why-modal" id="..."> — so a footer/injected
   button needs no per-page HTML. To add another explainer: (1) put a
   `<button class="why-btn" id="myBtn">?</button>` where you want the mark,
   (2) write a MY_TEXT constant, (3) add `wireModal('myBtn','myModal', MY_TEXT);`.
   Styling is inherited from .why-modal / .why-card, so you only write words. */
function wireModal(btnId, modalId, html) {
	const btn = document.getElementById(btnId);
	if (!btn) return;
	let modal = document.getElementById(modalId);
	if (!modal) {                                   // auto-create the shell if absent
		modal = document.createElement('div');
		modal.id = modalId;
		modal.className = 'why-modal';
		modal.innerHTML = '<div class="why-card"></div>';
		document.body.appendChild(modal);
	}
	const card = modal.querySelector('.why-card');
	card.innerHTML = '<button class="why-close" aria-label="Close">×</button>' + html;
	btn.addEventListener('click', () => modal.classList.add('open'));
	card.querySelector('.why-close').addEventListener('click', () => modal.classList.remove('open'));
	modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}
wireModal('whyBtn', 'why', WHY_TEXT);
wireModal('cuicatlBtn', 'cuicatlModal', CUICATL_TEXT);
wireModal('designBtn', 'designModal', DESIGN_TEXT);   // shell auto-created (footer button)

/* copy-to-clipboard: navigator.clipboard only exists in a "secure context"
   (https, localhost, or file://). Served to a plain http:// LAN address it's
   undefined, so we fall back to the old execCommand path there. Either way
   the "copied" feedback runs, independent of which method fired. */
function copyText(text) {
	if (navigator.clipboard && window.isSecureContext) {
		return navigator.clipboard.writeText(text);
	}
	return new Promise((resolve, reject) => {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'fixed';
		ta.style.top = '-1000px';
		document.body.appendChild(ta);
		ta.select();
		let ok = false;
		try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
		document.body.removeChild(ta);
		ok ? resolve() : reject();
	});
}
document.querySelectorAll('[data-copy]').forEach(el => {
	el.addEventListener('click', () => {
		copyText(el.dataset.copy).catch(() => {});
		const prev = el.textContent;
		el.textContent = 'copied to clipboard';
		setTimeout(() => { el.textContent = prev; }, 1600);
	});
});

const topBtn = document.getElementById('topBtn');
if (topBtn) topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ============ FROZEN-BACKGROUND BACKDROP ============
   index.html screenshots its frozen scene into sessionStorage ('bgShot') each
   time the overlay opens. Here, on the inner pages, we paint that shot behind
   the content with the same overlay tint on top — so every page looks like the
   canvas-index overlay. No shot yet (visitor hasn't entered) = solid color. */
if (document.body.classList.contains('page')) {
	const shot = sessionStorage.getItem('bgShot');
	if (shot) {
		// hand the shot to CSS as a custom property; css/site.css paints it as the
		// BODY's own background (behind all content, no z-index games) with the
		// themed overlay tint layered on top — see `body.page.has-bgshot` there.
		document.body.style.setProperty('--bgshot-url', 'url("' + shot + '")');
		document.body.classList.add('has-bgshot');
	}
}
