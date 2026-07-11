/* ============ DEFAULT THEME — flip this one line ============
   First-time visitors (and anyone who never touches the sun/moon toggle) see
   this theme. Set it to 'dark' or 'light'. Once a visitor uses the toggle,
   their choice is remembered and overrides this default from then on.

   This file is loaded synchronously in every page's <head>, before the page
   paints, so the theme is correct on the very first frame (no white flash). */
var THEME_DEFAULT = 'dark';

(function () {
	var saved = localStorage.getItem('theme');   // 'dark', 'light', or null (never toggled)
	var theme = saved || THEME_DEFAULT;
	if (theme === 'dark') document.documentElement.classList.add('dark');
})();
