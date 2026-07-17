/* ============ DEFAULTS — flip these two lines ============
   First-time visitors (and anyone who never uses the toggles) get these.
   Once a visitor picks, their choice is saved and overrides the default.

   This file is loaded synchronously in every page's <head>, before the page
   paints, so theme AND language are correct on the very first frame (no flash
   and no wrong-language flicker). */
var THEME_DEFAULT = 'dark';    // 'dark' or 'light' (sun/moon toggle)
var LANG_DEFAULT = 'en';       // 'en' or 'es'      (EN / ES toggle by the date)

/* ---- EN / ES control switches ----
   These only hide the CONTROL; both languages stay in the pages either way, and
   the site simply shows LANG_DEFAULT (above) when a visitor can't switch.
     LANG_TOGGLE            false = no EN/ES anywhere. The whole feature is off:
                            the site is just LANG_DEFAULT, everywhere.
     LANG_TOGGLE_ON_LANDING false = no EN/ES on the skull landing only; it still
                            appears once the site opens and on every inner page. */
var LANG_TOGGLE = true;
var LANG_TOGGLE_ON_LANDING = true;

/* ---- LANDING THEME SWITCH ----
   false = the skull landing IGNORES light/dark and always wears its original
   look: black scene, red particles, red chrome. The overlay and every inner
   page still follow the theme normally, and the sun/moon toggle keeps working —
   the landing just stops listening to it. (There's no user-facing control for
   this; it's a code switch.) */
var THEME_ON_LANDING = true;

(function () {
	var theme = localStorage.getItem('theme') || THEME_DEFAULT;   // null = never toggled
	if (theme === 'dark') document.documentElement.classList.add('dark');

	// pins the landing to black/red — css/site.css and index.html both key off it
	if (!THEME_ON_LANDING) document.documentElement.classList.add('landing-dark');

	var lang = localStorage.getItem('lang') || LANG_DEFAULT;
	document.documentElement.lang = lang;   // CSS hides the other language's blocks
})();
