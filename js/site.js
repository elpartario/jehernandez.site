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

/* ============ MENU — EDIT ONCE, CHANGES ON EVERY PAGE ============
   [label, destination]. Destinations without "http" are pages of this site
   (BASE handles the work/ subfolder); full URLs open in a new tab. */
const MENU_LINKS = [
	['home', 'index.html'],
	['about', 'about.html'],
	['work', 'work.html'],
	['writing', 'https://jehernandez.substack.com'],
	['store', 'https://alkabilmusic.square.site/'],
	['contact', 'contact.html'],
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
	['Bio', 'about.html'],
	['My Work', 'work.html'],
	['Contact Me', 'contact.html'],
	['Buy My Music', 'https://alkabilmusic.square.site/'],
];

function linkHTML(label, dest) {
	return dest.startsWith('http')
		? '<a href="' + dest + '" target="_blank" rel="noopener">' + label + '</a>'
		: '<a href="' + BASE + dest + '">' + label + '</a>';
}
document.querySelectorAll('nav.menu').forEach(nav => {
	nav.innerHTML =
		MENU_LINKS.map(([label, dest]) => linkHTML(label, dest)).join('\n') +
		MENU_ICONS.map(([name, url, svg]) =>
			'<a href="' + url + '" target="_blank" rel="noopener" aria-label="' + name + '">' + svg + '</a>').join('\n');
});
document.querySelectorAll('footer.foot').forEach(f => {
	f.innerHTML = '<p class="muted">© J.E. Hernández ' + new Date().getFullYear() + ' &nbsp;·&nbsp; ' +
		FOOTER_LINKS.map(([label, dest]) => linkHTML(label, dest)).join(' &nbsp;·&nbsp; ') + '</p>';
});

/* ============ LIGHT / DARK THEME ============
   Default is light. The choice is saved in localStorage ("theme") and applied
   on load by the one-line script in each page's <head> (so there's no flash).
   The OS/browser dark-mode preference is deliberately ignored. */
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
	<p><strong>Why this date?</strong></p>
	<p>I keep the Maya Long Count visible on every page because timekeeping is never neutral.
	This is a system of counting time that emerged from the lands I come from, and placing it
	here is one small way of resisting the assumption that the Gregorian calendar is the only
	natural measure of history.</p>
	<p>Its five positions—b’ak’tun, k’atun, tun, winal, and k’in—move from vast spans of time
	down to a single day. That scale matters to my work, which asks how histories persist through
	bodies, places, technologies, and generations. The date is not decoration; it locates this
	site within another way of understanding our place in time.</p>
	<p>For more info, click here.</p>
`;

const whyBtn = document.getElementById('whyBtn');
const why = document.getElementById('why');
if (whyBtn && why) {
	const card = why.querySelector('.why-card');
	card.innerHTML = '<button class="why-close" aria-label="Close">×</button>' + WHY_TEXT;
	whyBtn.addEventListener('click', () => why.classList.add('open'));
	card.querySelector('.why-close').addEventListener('click', () => why.classList.remove('open'));
	why.addEventListener('click', e => { if (e.target === why) why.classList.remove('open'); });
}

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
