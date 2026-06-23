"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_common_js_rsi18n_js"],{

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvbW1vbl9qc19yc2kxOG5fanMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsVUFBVTtBQUN4QixZQUFZLE1BQU0sd0JBQXdCO0FBQzFDLGtDQUFrQztBQUNsQyxrQ0FBa0M7QUFDbEM7QUFDYTs7QUFFYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLFFBQVEsZUFBZSxhQUFhO0FBQzNDO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsaUVBQWUsRUFBRSwrQkFBK0IsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JzaTE4bi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogcnNpMThuLmpzIOKAlCBsaWdodHdlaWdodCwgZGVwZW5kZW5jeS1mcmVlIGkxOG4gZm9yIFJ1bmVzdG9uZSBpbnRlcmFjdGl2ZXMuXG4gKlxuICogUmVwbGFjZXMgdGhlIHZlbmRvcmVkIFdpa2ltZWRpYSBqcXVlcnkuaTE4biBwbHVnaW4gZm9yIGNvbXBvbmVudHMgdGhhdCBoYXZlXG4gKiBiZWVuIG1pZ3JhdGVkIG9mZiBqUXVlcnkuIFRoZSBjYXRhbG9nIGZvcm1hdCBpcyB1bmNoYW5nZWQ6IG1lc3NhZ2VzIGFyZVxuICoga2V5ZWQgYnkgbmFtZSB3aXRoaW4gYSBsb2NhbGUgb2JqZWN0IGFuZCB1c2UgcG9zaXRpb25hbCAkMSwgJDIsIC4uLlxuICogcGxhY2Vob2xkZXJzLCBzbyBleGlzdGluZyAqLWkxOG4uPGxvY2FsZT4uanMgY2F0YWxvZyBmaWxlcyBvbmx5IG5lZWQgdGhlaXJcbiAqIGAkLmkxOG4oKS5sb2FkKC4uLilgIGNhbGwgc3dhcHBlZCBmb3IgYGxvYWQoLi4uKWAuXG4gKlxuICogVXNhZ2U6XG4gKiAgIGltcG9ydCB7IGxvYWQsIHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuICogICBsb2FkKHsgZW46IHsgZ3JlZXRpbmc6IFwiSGVsbG8gJDFcIiB9IH0pO1xuICogICB0KFwiZ3JlZXRpbmdcIiwgXCJXb3JsZFwiKTsgICAgICAvLyAtPiBcIkhlbGxvIFdvcmxkXCJcbiAqICAgdChcInVua25vd25fa2V5XCIpOyAgICAgICAgICAgIC8vIC0+IFwidW5rbm93bl9rZXlcIiAobWF0Y2hlcyBqcXVlcnkuaTE4bilcbiAqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNvbnN0IEZBTExCQUNLID0gXCJlblwiO1xuY29uc3QgY2F0YWxvZ3MgPSB7fTtcblxuZnVuY3Rpb24gbm9ybWFsaXplKGxvY2FsZSkge1xuICAgIHJldHVybiBTdHJpbmcobG9jYWxlIHx8IFwiXCIpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIERlZmF1bHQgbG9jYWxlIGZyb20gdGhlIGRvY3VtZW50LCBmYWxsaW5nIGJhY2sgdG8gdGhlIGJyb3dzZXIsIHRoZW4gRW5nbGlzaC5cbi8vIGpxdWVyeS5pMThuIGRlcml2ZWQgdGhlIGxvY2FsZSB0aGUgc2FtZSB3YXksIHNvIGJlaGF2aW9yIGlzIHByZXNlcnZlZC5cbmxldCBjdXJyZW50TG9jYWxlID0gbm9ybWFsaXplKFxuICAgICh0eXBlb2YgZG9jdW1lbnQgIT09IFwidW5kZWZpbmVkXCIgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcpIHx8XG4gICAgICAgICh0eXBlb2YgbmF2aWdhdG9yICE9PSBcInVuZGVmaW5lZFwiICYmIG5hdmlnYXRvci5sYW5ndWFnZSkgfHxcbiAgICAgICAgRkFMTEJBQ0tcbik7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRMb2NhbGUobG9jYWxlKSB7XG4gICAgY3VycmVudExvY2FsZSA9IG5vcm1hbGl6ZShsb2NhbGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYWxlKCkge1xuICAgIHJldHVybiBjdXJyZW50TG9jYWxlO1xufVxuXG4vKipcbiAqIFJlZ2lzdGVyIG1lc3NhZ2VzLiBBY2NlcHRzIHRoZSBzYW1lIHNoYXBlIGFzICQuaTE4bigpLmxvYWQoKTpcbiAqICAgeyBcImVuXCI6IHsga2V5OiBcIm1zZyAkMVwiIH0sIFwicHQtYnJcIjogeyBrZXk6IFwiLi4uXCIgfSB9XG4gKiBMb2NhbGUga2V5cyBhcmUgbm9ybWFsaXplZCB0byBsb3dlci1jYXNlIHNvIGxvb2t1cHMgYXJlIGNhc2UtaW5zZW5zaXRpdmVcbiAqIChlLmcuIGEgXCJzci1DeXJsXCIgY2F0YWxvZyBtYXRjaGVzIGEgZG9jdW1lbnQgbGFuZyBvZiBcInNyLWN5cmxcIikuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2FkKG1lc3NhZ2VzKSB7XG4gICAgZm9yIChjb25zdCBbbG9jYWxlLCBtc2dzXSBvZiBPYmplY3QuZW50cmllcyhtZXNzYWdlcykpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gbm9ybWFsaXplKGxvY2FsZSk7XG4gICAgICAgIGNhdGFsb2dzW2tleV0gPSBPYmplY3QuYXNzaWduKGNhdGFsb2dzW2tleV0gfHwge30sIG1zZ3MpO1xuICAgIH1cbn1cblxuLy8gTG9va3VwIG9yZGVyOiBleGFjdCBsb2NhbGUsIHRoZW4gaXRzIHByaW1hcnkgc3VidGFnLCB0aGVuIHRoZSBmYWxsYmFjay5cbi8vIGUuZy4gXCJwdC1iclwiIC0+IFwicHRcIiAtPiBcImVuXCIuXG5mdW5jdGlvbiBsb2NhbGVDaGFpbihsb2NhbGUpIHtcbiAgICBjb25zdCBjaGFpbiA9IFtdO1xuICAgIGlmIChsb2NhbGUpIHtcbiAgICAgICAgY2hhaW4ucHVzaChsb2NhbGUpO1xuICAgICAgICBjb25zdCBwcmltYXJ5ID0gbG9jYWxlLnNwbGl0KFwiLVwiKVswXTtcbiAgICAgICAgaWYgKHByaW1hcnkgJiYgcHJpbWFyeSAhPT0gbG9jYWxlKSB7XG4gICAgICAgICAgICBjaGFpbi5wdXNoKHByaW1hcnkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFpbi5pbmRleE9mKEZBTExCQUNLKSA9PT0gLTEpIHtcbiAgICAgICAgY2hhaW4ucHVzaChGQUxMQkFDSyk7XG4gICAgfVxuICAgIHJldHVybiBjaGFpbjtcbn1cblxuZnVuY3Rpb24gbG9va3VwKGtleSkge1xuICAgIGZvciAoY29uc3QgbG9jYWxlIG9mIGxvY2FsZUNoYWluKGN1cnJlbnRMb2NhbGUpKSB7XG4gICAgICAgIGNvbnN0IGNhdGFsb2cgPSBjYXRhbG9nc1tsb2NhbGVdO1xuICAgICAgICBpZiAoY2F0YWxvZyAmJiBjYXRhbG9nW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhdGFsb2dba2V5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFRyYW5zbGF0ZSBhIG1lc3NhZ2Uga2V5LCBzdWJzdGl0dXRpbmcgcG9zaXRpb25hbCAkMSwgJDIsIC4uLiBhcmd1bWVudHMuXG4gKiBVbmtub3duIGtleXMgYXJlIHJldHVybmVkIHZlcmJhdGltLCBtYXRjaGluZyBqcXVlcnkuaTE4bidzIGJlaGF2aW9yLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdChrZXksIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBtc2cgPSBsb29rdXAoa2V5KTtcbiAgICBpZiAobXNnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG4gICAgcmV0dXJuIG1zZy5yZXBsYWNlKC9cXCQoXFxkKykvZywgKG1hdGNoLCBuKSA9PiB7XG4gICAgICAgIGNvbnN0IGFyZyA9IGFyZ3NbTnVtYmVyKG4pIC0gMV07XG4gICAgICAgIHJldHVybiBhcmcgPT09IHVuZGVmaW5lZCA/IG1hdGNoIDogU3RyaW5nKGFyZyk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHsgbG9hZCwgdCwgc2V0TG9jYWxlLCBnZXRMb2NhbGUgfTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==