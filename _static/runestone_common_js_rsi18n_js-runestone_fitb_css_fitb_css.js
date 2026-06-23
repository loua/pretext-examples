"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_rsi18n_js-runestone_fitb_css_fitb_css"],{

/***/ 54250:
/*!***************************************!*\
  !*** ./runestone/common/js/rsi18n.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getLocale: () => (/* binding */ getLocale),
/* harmony export */   load: () => (/* binding */ load),
/* harmony export */   setLocale: () => (/* binding */ setLocale),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
/*
 * rsi18n.js — lightweight, dependency-free i18n for Runestone interactives.
 *
 * Replaces the vendored Wikimedia jquery.i18n plugin for components that have
 * been migrated off jQuery. The catalog format is unchanged: messages are
 * keyed by name within a locale object and use positional $1, $2, ...
 * placeholders, so existing *-i18n.<locale>.js catalog files only need their
 * `$.i18n().load(...)` call swapped for `load(...)`.
 *
 * Usage:
 *   import { load, t } from "../../common/js/rsi18n.js";
 *   load({ en: { greeting: "Hello $1" } });
 *   t("greeting", "World");      // -> "Hello World"
 *   t("unknown_key");            // -> "unknown_key" (matches jquery.i18n)
 */


const FALLBACK = "en";
const catalogs = {};

function normalize(locale) {
    return String(locale || "").toLowerCase();
}

// Default locale from the document, falling back to the browser, then English.
// jquery.i18n derived the locale the same way, so behavior is preserved.
let currentLocale = normalize(
    (typeof document !== "undefined" && document.documentElement.lang) ||
        (typeof navigator !== "undefined" && navigator.language) ||
        FALLBACK
);

function setLocale(locale) {
    currentLocale = normalize(locale);
}

function getLocale() {
    return currentLocale;
}

/**
 * Register messages. Accepts the same shape as $.i18n().load():
 *   { "en": { key: "msg $1" }, "pt-br": { key: "..." } }
 * Locale keys are normalized to lower-case so lookups are case-insensitive
 * (e.g. a "sr-Cyrl" catalog matches a document lang of "sr-cyrl").
 */
function load(messages) {
    for (const [locale, msgs] of Object.entries(messages)) {
        const key = normalize(locale);
        catalogs[key] = Object.assign(catalogs[key] || {}, msgs);
    }
}

// Lookup order: exact locale, then its primary subtag, then the fallback.
// e.g. "pt-br" -> "pt" -> "en".
function localeChain(locale) {
    const chain = [];
    if (locale) {
        chain.push(locale);
        const primary = locale.split("-")[0];
        if (primary && primary !== locale) {
            chain.push(primary);
        }
    }
    if (chain.indexOf(FALLBACK) === -1) {
        chain.push(FALLBACK);
    }
    return chain;
}

function lookup(key) {
    for (const locale of localeChain(currentLocale)) {
        const catalog = catalogs[locale];
        if (catalog && catalog[key] !== undefined) {
            return catalog[key];
        }
    }
    return undefined;
}

/**
 * Translate a message key, substituting positional $1, $2, ... arguments.
 * Unknown keys are returned verbatim, matching jquery.i18n's behavior.
 */
function t(key, ...args) {
    const msg = lookup(key);
    if (msg === undefined) {
        return key;
    }
    return msg.replace(/\$(\d+)/g, (match, n) => {
        const arg = args[Number(n) - 1];
        return arg === undefined ? match : String(arg);
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ load, t, setLocale, getLocale });


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19yc2kxOG5fanMtcnVuZXN0b25lX2ZpdGJfY3NzX2ZpdGJfY3NzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVU7QUFDeEIsWUFBWSxNQUFNLHdCQUF3QjtBQUMxQyxrQ0FBa0M7QUFDbEMsa0NBQWtDO0FBQ2xDO0FBQ2E7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxRQUFRLGVBQWUsYUFBYTtBQUMzQztBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLGlFQUFlLEVBQUUsK0JBQStCLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9yc2kxOG4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIHJzaTE4bi5qcyDigJQgbGlnaHR3ZWlnaHQsIGRlcGVuZGVuY3ktZnJlZSBpMThuIGZvciBSdW5lc3RvbmUgaW50ZXJhY3RpdmVzLlxuICpcbiAqIFJlcGxhY2VzIHRoZSB2ZW5kb3JlZCBXaWtpbWVkaWEganF1ZXJ5LmkxOG4gcGx1Z2luIGZvciBjb21wb25lbnRzIHRoYXQgaGF2ZVxuICogYmVlbiBtaWdyYXRlZCBvZmYgalF1ZXJ5LiBUaGUgY2F0YWxvZyBmb3JtYXQgaXMgdW5jaGFuZ2VkOiBtZXNzYWdlcyBhcmVcbiAqIGtleWVkIGJ5IG5hbWUgd2l0aGluIGEgbG9jYWxlIG9iamVjdCBhbmQgdXNlIHBvc2l0aW9uYWwgJDEsICQyLCAuLi5cbiAqIHBsYWNlaG9sZGVycywgc28gZXhpc3RpbmcgKi1pMThuLjxsb2NhbGU+LmpzIGNhdGFsb2cgZmlsZXMgb25seSBuZWVkIHRoZWlyXG4gKiBgJC5pMThuKCkubG9hZCguLi4pYCBjYWxsIHN3YXBwZWQgZm9yIGBsb2FkKC4uLilgLlxuICpcbiAqIFVzYWdlOlxuICogICBpbXBvcnQgeyBsb2FkLCB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbiAqICAgbG9hZCh7IGVuOiB7IGdyZWV0aW5nOiBcIkhlbGxvICQxXCIgfSB9KTtcbiAqICAgdChcImdyZWV0aW5nXCIsIFwiV29ybGRcIik7ICAgICAgLy8gLT4gXCJIZWxsbyBXb3JsZFwiXG4gKiAgIHQoXCJ1bmtub3duX2tleVwiKTsgICAgICAgICAgICAvLyAtPiBcInVua25vd25fa2V5XCIgKG1hdGNoZXMganF1ZXJ5LmkxOG4pXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBGQUxMQkFDSyA9IFwiZW5cIjtcbmNvbnN0IGNhdGFsb2dzID0ge307XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShsb2NhbGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKGxvY2FsZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBEZWZhdWx0IGxvY2FsZSBmcm9tIHRoZSBkb2N1bWVudCwgZmFsbGluZyBiYWNrIHRvIHRoZSBicm93c2VyLCB0aGVuIEVuZ2xpc2guXG4vLyBqcXVlcnkuaTE4biBkZXJpdmVkIHRoZSBsb2NhbGUgdGhlIHNhbWUgd2F5LCBzbyBiZWhhdmlvciBpcyBwcmVzZXJ2ZWQuXG5sZXQgY3VycmVudExvY2FsZSA9IG5vcm1hbGl6ZShcbiAgICAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nKSB8fFxuICAgICAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBuYXZpZ2F0b3IubGFuZ3VhZ2UpIHx8XG4gICAgICAgIEZBTExCQUNLXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9jYWxlKGxvY2FsZSkge1xuICAgIGN1cnJlbnRMb2NhbGUgPSBub3JtYWxpemUobG9jYWxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsZTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBtZXNzYWdlcy4gQWNjZXB0cyB0aGUgc2FtZSBzaGFwZSBhcyAkLmkxOG4oKS5sb2FkKCk6XG4gKiAgIHsgXCJlblwiOiB7IGtleTogXCJtc2cgJDFcIiB9LCBcInB0LWJyXCI6IHsga2V5OiBcIi4uLlwiIH0gfVxuICogTG9jYWxlIGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gbG93ZXItY2FzZSBzbyBsb29rdXBzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG4gKiAoZS5nLiBhIFwic3ItQ3lybFwiIGNhdGFsb2cgbWF0Y2hlcyBhIGRvY3VtZW50IGxhbmcgb2YgXCJzci1jeXJsXCIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZChtZXNzYWdlcykge1xuICAgIGZvciAoY29uc3QgW2xvY2FsZSwgbXNnc10gb2YgT2JqZWN0LmVudHJpZXMobWVzc2FnZXMpKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG5vcm1hbGl6ZShsb2NhbGUpO1xuICAgICAgICBjYXRhbG9nc1trZXldID0gT2JqZWN0LmFzc2lnbihjYXRhbG9nc1trZXldIHx8IHt9LCBtc2dzKTtcbiAgICB9XG59XG5cbi8vIExvb2t1cCBvcmRlcjogZXhhY3QgbG9jYWxlLCB0aGVuIGl0cyBwcmltYXJ5IHN1YnRhZywgdGhlbiB0aGUgZmFsbGJhY2suXG4vLyBlLmcuIFwicHQtYnJcIiAtPiBcInB0XCIgLT4gXCJlblwiLlxuZnVuY3Rpb24gbG9jYWxlQ2hhaW4obG9jYWxlKSB7XG4gICAgY29uc3QgY2hhaW4gPSBbXTtcbiAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgIGNoYWluLnB1c2gobG9jYWxlKTtcbiAgICAgICAgY29uc3QgcHJpbWFyeSA9IGxvY2FsZS5zcGxpdChcIi1cIilbMF07XG4gICAgICAgIGlmIChwcmltYXJ5ICYmIHByaW1hcnkgIT09IGxvY2FsZSkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChwcmltYXJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhaW4uaW5kZXhPZihGQUxMQkFDSykgPT09IC0xKSB7XG4gICAgICAgIGNoYWluLnB1c2goRkFMTEJBQ0spO1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW47XG59XG5cbmZ1bmN0aW9uIGxvb2t1cChrZXkpIHtcbiAgICBmb3IgKGNvbnN0IGxvY2FsZSBvZiBsb2NhbGVDaGFpbihjdXJyZW50TG9jYWxlKSkge1xuICAgICAgICBjb25zdCBjYXRhbG9nID0gY2F0YWxvZ3NbbG9jYWxlXTtcbiAgICAgICAgaWYgKGNhdGFsb2cgJiYgY2F0YWxvZ1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBtZXNzYWdlIGtleSwgc3Vic3RpdHV0aW5nIHBvc2l0aW9uYWwgJDEsICQyLCAuLi4gYXJndW1lbnRzLlxuICogVW5rbm93biBrZXlzIGFyZSByZXR1cm5lZCB2ZXJiYXRpbSwgbWF0Y2hpbmcganF1ZXJ5LmkxOG4ncyBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHQoa2V5LCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbXNnID0gbG9va3VwKGtleSk7XG4gICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHJldHVybiBtc2cucmVwbGFjZSgvXFwkKFxcZCspL2csIChtYXRjaCwgbikgPT4ge1xuICAgICAgICBjb25zdCBhcmcgPSBhcmdzW051bWJlcihuKSAtIDFdO1xuICAgICAgICByZXR1cm4gYXJnID09PSB1bmRlZmluZWQgPyBtYXRjaCA6IFN0cmluZyhhcmcpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGxvYWQsIHQsIHNldExvY2FsZSwgZ2V0TG9jYWxlIH07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=