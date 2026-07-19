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
   [label, destination]. A label is either a plain string (same in both
   languages) or a { en, es } pair — see the t() helper below. Destinations
   without "http" are pages of this site; full URLs open in a new tab. */
const MENU_LINKS = [
	[{ en: 'home', es: 'inicio' }, '/'],
	[{ en: 'about', es: 'acerca' }, 'about'],
	[{ en: 'work', es: 'obra' }, 'work'],
	[{ en: 'writing', es: 'escritos' }, 'https://jehernandez.substack.com'],
	[{ en: 'scores', es: 'tienda' }, 'https://alkabilmusic.square.site/'],
	[{ en: 'contact', es: 'contacto' }, 'contact'],
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
	['yslas', 'https://www.yslas.music'],
	[{ en: 'Bio', es: 'Biografía' }, 'about'],
	[{ en: 'My Work', es: 'Mi obra' }, 'work'],
	[{ en: 'Contact Me', es: 'Contáctame' }, 'contact'],
	[{ en: 'Buy My Scores', es: 'Partituras' }, 'https://alkabilmusic.square.site/'],
];

/* Render a label that may be a plain string OR a { en, es } pair. For a pair we
   emit both languages as lang-tagged spans; CSS shows only the active one. */
function t(label) {
	if (typeof label === 'string') return label;
	return '<span lang="en">' + label.en + '</span><span lang="es">' + label.es + '</span>';
}

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
		? '<a href="' + dest + '" target="_blank" rel="noopener">' + t(label) + '</a>'
		: '<a href="' + cleanHref(dest) + '">' + t(label) + '</a>';
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
		' &nbsp;·&nbsp; ' + t({ en: 'Website info', es: 'Info del sitio' }) +
		' <button class="why-btn" id="designBtn" aria-label="About the website design">?</button>' +
		'</p>';
});

/* ============ WORK-PAGE NAV — EDIT ONCE, CHANGES ON EVERY WORK PAGE ============
   Fills the <p class="worknav"></p> shell at the bottom of each work page, so
   the "featured work / full list of works" links live in one place instead of
   being copied into all 16 pages. Same [label, dest] rules as the menu. */
const WORK_NAV = [
	[{ en: '← featured work', es: '← obra destacada' }, 'work'],
	[{ en: 'full list of works', es: 'lista completa de obras' }, 'flow'],
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

/* ============ EN / ES LANGUAGE TOGGLE ============
   The pre-paint default is in js/theme-init.js (LANG_DEFAULT); here we inject
   the "EN / ES" control into .lc-wrap (next to the "?") on every page and wire
   it. Switching just sets <html lang> — CSS then shows the matching lang blocks
   everywhere at once (see the show/hide rule in css/site.css). Anything that has
   to react in JS (e.g. the teponaztli caption on the landing) listens for the
   'langchange' event. The selected/faded styling is pure CSS.

   Both switches live in js/theme-init.js — LANG_TOGGLE (off = no control at all,
   site stays LANG_DEFAULT) and LANG_TOGGLE_ON_LANDING (off = no control on the
   skull landing only). The `typeof` guards keep this working if theme-init.js is
   ever missing or the vars are removed. */
const LANG_UI = (typeof LANG_TOGGLE === 'undefined') || LANG_TOGGLE;
const LANG_UI_LANDING = (typeof LANG_TOGGLE_ON_LANDING === 'undefined') || LANG_TOGGLE_ON_LANDING;

if (LANG_UI) document.querySelectorAll('.lc-wrap').forEach(wrap => {
	const box = document.createElement('span');
	box.className = 'lang-toggle';
	box.setAttribute('role', 'group');
	box.setAttribute('aria-label', 'Language / Idioma');
	box.innerHTML =
		'<button type="button" class="lang-opt" data-lang="en" aria-label="English">EN</button>' +
		'<span class="lang-sep" aria-hidden="true">/</span>' +
		'<button type="button" class="lang-opt" data-lang="es" aria-label="Español">ES</button>';
	// inner pages have no landing state, so the toggle starts docked beside the
	// "?"; on index.html it starts under the date and docks when the site opens
	if (document.body.classList.contains('page')) box.classList.add('docked');
	if (!LANG_UI_LANDING) box.classList.add('hide-landing');   // CSS hides it while undocked
	wrap.appendChild(box);
});
function setLang(l) {
	document.documentElement.lang = l;
	localStorage.setItem('lang', l);
	document.querySelectorAll('.lang-opt').forEach(b =>
		b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
	dispatchEvent(new CustomEvent('langchange'));
}
document.querySelectorAll('.lang-opt').forEach(b =>
	b.addEventListener('click', () => setLang(b.dataset.lang)));

/* Placeholders can't hold lang spans, so any field with data-ph-en / data-ph-es
   gets its placeholder swapped here (e.g. the contact form). */
function applyPlaceholders() {
	const l = document.documentElement.lang === 'es' ? 'es' : 'en';
	document.querySelectorAll('[data-ph-en]').forEach(el => {
		el.placeholder = el.getAttribute('data-ph-' + l) || el.getAttribute('data-ph-en');
	});
}
addEventListener('langchange', applyPlaceholders);

setLang(document.documentElement.lang || 'en');   // sync aria + placeholders to the pre-paint choice

/* ============ "WHY THIS DATE?" — EDIT THE TEXT HERE, ONCE ============
   This fills the ? modal on every page (the #why blocks in the HTML files
   are empty shells that this script populates). Plain HTML is allowed. */
const WHY_TEXT = `
	<div lang="en">
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
	</div>
	<div lang="es">
	<p><strong>¿Qué es esto?</strong></p>
	<p>Estos dígitos son la representación del calendario maya de Cuenta Larga. Sus
	cinco posiciones — <em>b’ak’tun</em>, <em>k’atun</em>, <em>tun</em>, <em>winal</em> y
	<em>k’in</em> — corresponden cada una a un conteo de días. Un <em>k’in</em> es un día; un <em>winal</em>, 20 días;
	un <em>tun</em>, 360 días; un <em>k’atun</em>, 7,200 días; y un <em>b’ak’tun</em>, 144,000 días. Leída de izquierda
	a derecha, la fecha cuenta unidades temporales cada vez menores, descendiendo desde cientos de
	miles hasta el día único.</p>
	<p>Esto sitúa a este sitio dentro de otra manera de entender nuestro lugar en el tiempo. Este
	sistema, junto con otras prácticas Originarias de registro del tiempo, surgió de las tierras en
	las que nací. Colocarlo aquí reafirma estos sistemas como formas legítimas de registro
	calendárico en estas tierras hoy conocidas como las Américas. Registrar el tiempo no es neutral:
	nos convoca a genealogías más largas que preceden al nombramiento colonial, persisten más allá de
	él y siguen dando forma a cómo se entienden estas tierras.</p>
	<p>Para más información, <a href="https://www.penn.museum/sites/expedition/maya-calendars" target="_blank" rel="noopener">haz clic aquí</a>.</p>
	</div>
`;

/* ============ "CUICATL" EXPLAINER — EDIT THIS TEXT HERE, ONCE ============
   Fills the "?" modal beside "Cuicatl" on the full-works page. It's its own
   independent HTML string (a copy of the date text for now) — edit it freely
   without touching WHY_TEXT above; the two are separate. Styling is inherited
   from the shared .why-modal / .why-card classes, so you only edit words. */
const CUICATL_TEXT = `
	<div lang="en">
	<p><strong>What is Cuicatl?</strong></p>
	<p><em>Cuicatl</em> is a Nahuatl word commonly translated as song, singing, or music.
	In historical Nahua sources, it names a broad field where voice, poetry, rhythm, dance,
	and memory meet. The phrase <em>in xochitl in cuicatl</em> — “flower and song” — is often
	used to describe poetry or art. Contemporary works such as Gabriel Pareyón’s <em>Xochicuicatl
	cuecuechtli</em> and <em>Chicueyi Cuicatl</em> continue to study and dialogue with this longer
	expressive history.</p>
	<p>J.E. engages with this practice in a dialogic framework to foster access and exposure
	for audiences in conversation with his other practice as a form of reinforcing Originary
	forms of expression via his own discipleship with the legacy of <em>cuicatl</em>.
	</div>
	<div lang="es">
	<p><strong>¿Qué es el Cuicatl?</strong></p>
	<p><em>Cuicatl</em> es una palabra náhuatl que suele traducirse como canto, cantar o música.
	En las fuentes nahuas históricas, nombra un campo amplio donde se encuentran la voz, la poesía,
	el ritmo, la danza y la memoria. La expresión <em>in xochitl in cuicatl</em> — «flor y canto» —
	se usa a menudo para referirse a la poesía o al arte. Obras contemporáneas como <em>Xochicuicatl
	cuecuechtli</em> y <em>Chicueyi Cuicatl</em>, de Gabriel Pareyón, siguen estudiando y dialogando
	con esta historia expresiva más larga.</p>
	<p>J.E. aborda esta práctica desde un marco dialógico con el fin de facilitar el acceso y el 
	acercamiento de los públicos. En diálogo con sus demás prácticas, este trabajo busca reafirmar 
	formas originarias de expresión mediante su propio proceso de aprendizaje dentro del legado 
	del <em>cuicatl</em>.

	</div>
`;

/* ============ "WEBSITE DESIGN" (footer) — EDIT THE TEXT HERE, ONCE ============
   Opens from the "?" beside "Website design" in the footer on every page. */
const DESIGN_TEXT = `
	<div lang="en">
	<p><strong>Webdesign Credits:</strong></p>
	<p>Website designed by J.E. Hernández based on work done as
	<a href="https://www.yslas.music/" target="_blank" rel="noopener">Yslas</a>, produced by
	<a href="https://silbaca.tv/" target="_blank" rel="noopener">Sílbaca</a>. Inspired
	by <a href="https://www.404zero.com/" target="_blank" rel="noopener">404.zero</a>.</p>
	<p>If you're interested in website design like this for your own project, please
	don't hesitate to <a href="/contact" target="_blank" rel="noopener">contact me</a>.</p>
	</div>
	<div lang="es">
	<p><strong>Créditos de diseño web:</strong></p>
	<p>Sitio diseñado por J.E. Hernández a partir del trabajo realizado como
	<a href="https://www.yslas.music/" target="_blank" rel="noopener">Yslas</a>, producido por
	<a href="https://silbaca.tv/" target="_blank" rel="noopener">Sílbaca</a>. Inspirado
	en <a href="https://www.404zero.com/" target="_blank" rel="noopener">404.zero</a>.</p>
	<p>Si te interesa un diseño web como este para tu propio proyecto, no dudes en
	<a href="/contact" target="_blank" rel="noopener">contactarme</a>.</p>
	</div>
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
/* This feedback is set from JS, so it can't use the lang="en"/lang="es" trick —
   it reads <html lang> at click time instead. Add a line per language here. */
const COPY_MSG = { en: 'copied to clipboard', es: 'copiado al portapapeles' };
document.querySelectorAll('[data-copy]').forEach(el => {
	el.addEventListener('click', () => {
		copyText(el.dataset.copy).catch(() => {});
		// innerHTML (not textContent) so markup inside — e.g. the <u> around the
		// email — survives the swap and is restored intact
		const prev = el.innerHTML;
		el.textContent = COPY_MSG[document.documentElement.lang] || COPY_MSG.en;
		setTimeout(() => { el.innerHTML = prev; }, 1600);
	});
});

/* ============ CONTACT FORM (Web3Forms, no redirect) ============
   Posting the <form> normally would send the visitor to Web3Forms' own thank-you
   page. Instead we POST it with fetch and stay put: the form briefly becomes a
   "Message sent!" note, then comes back empty and ready. The endpoint/access key
   still live in contact.html — this only changes HOW it's sent.
   (CSP note: api.web3forms.com is already allowed in `connect-src`, see _headers.) */
const cform = document.querySelector('form.cform');
if (cform) {
	const note = document.createElement('p');
	note.className = 'cform-note';
	note.hidden = true;
	cform.parentNode.insertBefore(note, cform.nextSibling);

	const say = html => { note.innerHTML = html; };
	cform.addEventListener('submit', e => {
		e.preventDefault();
		const btn = cform.querySelector('button[type="submit"]');
		if (btn) btn.disabled = true;
		fetch(cform.action, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(Object.fromEntries(new FormData(cform)))
		})
			.then(r => r.json())
			.then(j => {
				if (!j.success) throw new Error(j.message || 'failed');
				say('<span lang="en">Message sent!</span><span lang="es">¡Mensaje enviado!</span>');
				cform.reset();
				cform.hidden = true; note.hidden = false;
				setTimeout(() => { note.hidden = true; cform.hidden = false; }, 4000);   // back to the form
			})
			.catch(() => {
				say('<span lang="en">Couldn&#8217;t send — please email me instead.</span>' +
				    '<span lang="es">No se pudo enviar — mejor escríbeme por correo.</span>');
				note.hidden = false;
				setTimeout(() => { note.hidden = true; }, 6000);   // form stays, so nothing is retyped
			})
			.finally(() => { if (btn) btn.disabled = false; });
	});
}

const topBtn = document.getElementById('topBtn');
if (topBtn) topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ============ FROZEN-BACKGROUND BACKDROP ============
   index.html screenshots its frozen scene each time the overlay opens, storing
   BOTH themes ('bgShotDark' / 'bgShotLight'). Here, on the inner pages, we paint
   the one matching the current theme behind the content, with the same overlay
   tint on top — so every page looks like the canvas-index overlay.

   Why two images: an inner page has no scene to re-photograph, so if the visitor
   flips the theme here we can only swap to an image that already exists. Doing so
   is instant — just re-pointing the CSS custom property, no re-render.
   No shot yet (visitor never entered the landing) = plain solid colour. */
if (document.body.classList.contains('page')) {
	const applyShot = () => {
		const dark = document.documentElement.classList.contains('dark');
		// the legacy single-key shot is a fallback for a tab that captured before
		// this became theme-aware; it just means one stale-coloured backdrop
		const shot = sessionStorage.getItem(dark ? 'bgShotDark' : 'bgShotLight')
			|| sessionStorage.getItem('bgShot');
		if (shot) {
			// hand the shot to CSS as a custom property; css/site.css paints it as the
			// BODY's own background (behind all content, no z-index games) with the
			// themed overlay tint layered on top — see `body.page.has-bgshot` there.
			document.body.style.setProperty('--bgshot-url', 'url("' + shot + '")');
			document.body.classList.add('has-bgshot');
		} else {
			document.body.classList.remove('has-bgshot');
		}
	};
	applyShot();
	addEventListener('themechange', applyShot);   // swap to the other theme's shot
}
