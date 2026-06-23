"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_parsons_js_parsons-i18n_en_js-runestone_parsons_js_parsons-i18n_pt-br_js-runestone_-40cb1f"],{

/***/ 29119:
/*!******************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.sr-Cyrl.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_parson_check_me: "Провери",
        msg_parson_reset: "Поништи",
        msg_parson_help: "Помоћ",
        msg_parson_too_short: "Искористи све блокове у решењу",
        msg_parson_drag_from_here: "Превуци одавде",
        msg_parson_drag_to_here: "Превуци овде",
        msg_parson_correct_first_try: "Одлично! Успео си из првог покушаја!",
        msg_parson_correct:
            "Одлично! Решио си у само $1 покушаја. Одабери Поништи ако желиш да решиш из првог покушаја.",
        msg_parson_wrong_indent:
            "Овај блок није тачно увучен. Превуци га лево или десно да пронађеш прави ниво.",
        msg_parson_wrong_indents:
            "Ови блокви нису тачно увучени. Превуци их лево или десно да им пронађеш прави ниво.",
        msg_parson_wrong_order:
            "Означени блокови у твом програму су нетачни или у погрешном редоследу. Промени редослед или избаци блок из решења.",
        msg_parson_arrow_navigate:
            "Користи стрелице за кретње а Спејс да означииш блок који помераш.",
        msg_parson_help_info: "Одабери Помоћ ако желиш да олакшаш задатак",
        msg_parson_not_solution: "Одстранили смо блок који није део решења.",
        msg_parson_provided_indent: "Увукли смо блок.",
        msg_parson_combined_blocks: "Спојили смо два блока.",
        msg_parson_remove_incorrect: "Уклонићемо нетачне блокове из одговора.",
        msg_parson_will_combine: "Спојићемо два блока.",
        msg_parson_atleast_three_attempts:
            "Мораш пробати бар 3 могућа решења пре него што погледаш помоћ.",
        msg_parson_three_blocks_left:
            "Остало је још 3 тачна блока.  Пронађи им редослед.",
        msg_parson_will_provide_indent: "Увућићемо блок.",
    },
});


/***/ }),

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


/***/ }),

/***/ 56906:
/*!****************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.pt-br.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_parson_check_me: "Verificar",
        msg_parson_reset: "Resetar",
        msg_parson_help:"Ajuda",
        msg_parson_too_short: "Seu programa é muito curto. Adicione mais blocos.",
        msg_parson_drag_from_here: "Arraste daqui",
        msg_parson_drag_to_here: "Largue os blocos aqui",
        msg_parson_correct_first_try:
            "Perfeito! Você levou apenas uma tentativa para resolver. Bom trabalho!",
        msg_parson_correct:
            "Perfeito! Você levou $1 tentativas para resolver. Clique em Resetar para tentar resolver em uma tentativa." ,
        msg_parson_wrong_indent:
            "Este bloco não está indentado corretamente. Indente mais arrastando-o para a direita ou reduza a indentação arrastando para a esquerda.",
        msg_parson_wrong_indents:
            "Estes blocos não estão indentados corretamente. Para indentar mais, arraste o bloco para a direita. Para reduzir a indentação, arraste para a esquerda.",
        msg_parson_wrong_order:
            "Blocos destacados no seu programa estão errados ou estão na ordem errada. Isso pode ser resolvido movendo, excluindo ou substituindo os blocos destacados.",
        msg_parson_arrow_navigate:
            "Use as teclas de setas para navegar. Espaço para selecionar/ desmarcar blocos para mover.",
        msg_parson_help_info:
            "Clique no botão Ajuda se você quiser facilitar o problema",
        msg_parson_not_solution:
            "Foi desabilitado um bloco de código desnecessário (que não faz parte da solução).",
        msg_parson_provided_indent:"Foi fornecida a indentação.",
        msg_parson_combined_blocks:"Dois blocos de códigos foram combinados em um.",
        msg_parson_remove_incorrect:
            "Será removido um bloco de código incorreto da área de resposta",
        msg_parson_will_combine:"Serão combinados dois blocos",
        msg_parson_atleast_three_attempts:
            "Você deve tentar pelo menos três vezes antes de pedir ajuda",
        msg_parson_three_blocks_left:
            "Restam apenas 3 blocos corretos. Você deve colocá-los em ordem",
        msg_parson_will_provide_indent: "Será fornecida a indentação"
    },
});


/***/ }),

/***/ 75794:
/*!*************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.en.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_parson_check_me: "Check",
        msg_parson_reset: "Reset",
        msg_parson_help: "Help me",
        msg_parson_too_short: "Your answer is too short. Add more blocks.",
        msg_parson_drag_from_here: "Drag from here",
        msg_parson_drag_to_here: "Drop blocks here",
        msg_parson_correct_first_try:
            "Perfect!  It took you only one try to solve this.  Great job!",
        msg_parson_correct:
            "Perfect!  It took you $1 tries to solve this.  Click Reset to try to solve it in one attempt.",
        msg_parson_correct_runnable:
            "Click Run below to test out your solution.",
        msg_parson_wrong_indent:
            "This block is not indented correctly. Either indent it more by dragging it right or reduce the indention by dragging it left.",
        msg_parson_wrong_indents:
            "These blocks are not indented correctly. To indent a block more, drag it to the right. To reduce the indention, drag it to the left.",
        msg_parson_wrong_order:
            "Highlighted blocks in your answer are wrong or are in the wrong order. This can be fixed by moving, removing, or replacing highlighted blocks.",
        msg_parson_arrow_navigate:
            "Arrow keys to navigate. Space to select / deselect block to move.",
        msg_parson_help_info:
            "Click on the Help Me button if you want to make the problem easier",
        msg_parson_not_solution:
            "Disabled an unneeded code block (one that is not part of the solution).",
        msg_parson_provided_indent: "Provided the indentation.",
        msg_parson_combined_blocks: "Combined two code blocks into one.",
        msg_parson_remove_incorrect:
            "Will remove an incorrect code block from answer area",
        msg_parson_will_combine: "Will combine two blocks",
        msg_parson_atleast_three_attempts:
            "You must make at least three distinct full attempts at a solution before you can get help",
        msg_parson_three_blocks_left:
            "There are only 3 correct blocks left.  You should be able to put them in order",
        msg_parson_will_provide_indent: "Will provide indentation",
    },
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BhcnNvbnNfanNfcGFyc29ucy1pMThuX2VuX2pzLXJ1bmVzdG9uZV9wYXJzb25zX2pzX3BhcnNvbnMtaTE4bl9wdC1icl9qcy1ydW5lc3RvbmVfLTQwY2IxZi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFpRDs7QUFFakQsMERBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVU7QUFDeEIsWUFBWSxNQUFNLHdCQUF3QjtBQUMxQyxrQ0FBa0M7QUFDbEMsa0NBQWtDO0FBQ2xDO0FBQ2E7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyxRQUFRLGVBQWUsYUFBYTtBQUMzQztBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSx5REFBeUQ7QUFDekQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBLGlFQUFlLEVBQUUsK0JBQStCLEVBQUM7Ozs7Ozs7Ozs7Ozs7QUMvRkE7O0FBRWpELDBEQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNyQ2dEOztBQUVqRCwwREFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zLWkxOG4uc3ItQ3lybC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9yc2kxOG4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnMtaTE4bi5wdC1ici5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29ucy1pMThuLmVuLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBcInNyLUN5cmxcIjoge1xuICAgICAgICBtc2dfcGFyc29uX2NoZWNrX21lOiBcItCf0YDQvtCy0LXRgNC4XCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwi0J/QvtC90LjRiNGC0LhcIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwOiBcItCf0L7QvNC+0ZtcIixcbiAgICAgICAgbXNnX3BhcnNvbl90b29fc2hvcnQ6IFwi0JjRgdC60L7RgNC40YHRgtC4INGB0LLQtSDQsdC70L7QutC+0LLQtSDRgyDRgNC10YjQtdGa0YNcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX2Zyb21faGVyZTogXCLQn9GA0LXQstGD0YbQuCDQvtC00LDQstC00LVcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwi0J/RgNC10LLRg9GG0Lgg0L7QstC00LVcIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb3JyZWN0X2ZpcnN0X3RyeTogXCLQntC00LvQuNGH0L3QviEg0KPRgdC/0LXQviDRgdC4INC40Lcg0L/RgNCy0L7QsyDQv9C+0LrRg9GI0LDRmNCwIVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3Q6XG4gICAgICAgICAgICBcItCe0LTQu9C40YfQvdC+ISDQoNC10YjQuNC+INGB0Lgg0YMg0YHQsNC80L4gJDEg0L/QvtC60YPRiNCw0ZjQsC4g0J7QtNCw0LHQtdGA0Lgg0J/QvtC90LjRiNGC0Lgg0LDQutC+INC20LXQu9C40Ygg0LTQsCDRgNC10YjQuNGIINC40Lcg0L/RgNCy0L7QsyDQv9C+0LrRg9GI0LDRmNCwLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudDpcbiAgICAgICAgICAgIFwi0J7QstCw0Zgg0LHQu9C+0Log0L3QuNGY0LUg0YLQsNGH0L3QviDRg9Cy0YPRh9C10L0uINCf0YDQtdCy0YPRhtC4INCz0LAg0LvQtdCy0L4g0LjQu9C4INC00LXRgdC90L4g0LTQsCDQv9GA0L7QvdCw0ZLQtdGIINC/0YDQsNCy0Lgg0L3QuNCy0L4uXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwi0J7QstC4INCx0LvQvtC60LLQuCDQvdC40YHRgyDRgtCw0YfQvdC+INGD0LLRg9GH0LXQvdC4LiDQn9GA0LXQstGD0YbQuCDQuNGFINC70LXQstC+INC40LvQuCDQtNC10YHQvdC+INC00LAg0LjQvCDQv9GA0L7QvdCw0ZLQtdGIINC/0YDQsNCy0Lgg0L3QuNCy0L4uXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3Jvbmdfb3JkZXI6XG4gICAgICAgICAgICBcItCe0LfQvdCw0YfQtdC90Lgg0LHQu9C+0LrQvtCy0Lgg0YMg0YLQstC+0Lwg0L/RgNC+0LPRgNCw0LzRgyDRgdGDINC90LXRgtCw0YfQvdC4INC40LvQuCDRgyDQv9C+0LPRgNC10YjQvdC+0Lwg0YDQtdC00L7RgdC70LXQtNGDLiDQn9GA0L7QvNC10L3QuCDRgNC10LTQvtGB0LvQtdC0INC40LvQuCDQuNC30LHQsNGG0Lgg0LHQu9C+0Log0LjQtyDRgNC10YjQtdGa0LAuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGU6XG4gICAgICAgICAgICBcItCa0L7RgNC40YHRgtC4INGB0YLRgNC10LvQuNGG0LUg0LfQsCDQutGA0LXRgtGa0LUg0LAg0KHQv9C10ZjRgSDQtNCwINC+0LfQvdCw0YfQuNC40Ygg0LHQu9C+0Log0LrQvtGY0Lgg0L/QvtC80LXRgNCw0YguXCIsXG4gICAgICAgIG1zZ19wYXJzb25faGVscF9pbmZvOiBcItCe0LTQsNCx0LXRgNC4INCf0L7QvNC+0Zsg0LDQutC+INC20LXQu9C40Ygg0LTQsCDQvtC70LDQutGI0LDRiCDQt9Cw0LTQsNGC0LDQulwiLFxuICAgICAgICBtc2dfcGFyc29uX25vdF9zb2x1dGlvbjogXCLQntC00YHRgtGA0LDQvdC40LvQuCDRgdC80L4g0LHQu9C+0Log0LrQvtGY0Lgg0L3QuNGY0LUg0LTQtdC+INGA0LXRiNC10ZrQsC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9wcm92aWRlZF9pbmRlbnQ6IFwi0KPQstGD0LrQu9C4INGB0LzQviDQsdC70L7Qui5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3M6IFwi0KHQv9C+0ZjQuNC70Lgg0YHQvNC+INC00LLQsCDQsdC70L7QutCwLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3Q6IFwi0KPQutC70L7QvdC40ZvQtdC80L4g0L3QtdGC0LDRh9C90LUg0LHQu9C+0LrQvtCy0LUg0LjQtyDQvtC00LPQvtCy0L7RgNCwLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfY29tYmluZTogXCLQodC/0L7RmNC40ZvQtdC80L4g0LTQstCwINCx0LvQvtC60LAuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXRsZWFzdF90aHJlZV9hdHRlbXB0czpcbiAgICAgICAgICAgIFwi0JzQvtGA0LDRiCDQv9GA0L7QsdCw0YLQuCDQsdCw0YAgMyDQvNC+0LPRg9Gb0LAg0YDQtdGI0LXRmtCwINC/0YDQtSDQvdC10LPQviDRiNGC0L4g0L/QvtCz0LvQtdC00LDRiCDQv9C+0LzQvtGbLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0OlxuICAgICAgICAgICAgXCLQntGB0YLQsNC70L4g0ZjQtSDRmNC+0YggMyDRgtCw0YfQvdCwINCx0LvQvtC60LAuICDQn9GA0L7QvdCw0ZLQuCDQuNC8INGA0LXQtNC+0YHQu9C10LQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9wcm92aWRlX2luZGVudDogXCLQo9Cy0YPRm9C40ZvQtdC80L4g0LHQu9C+0LouXCIsXG4gICAgfSxcbn0pO1xuIiwiLypcbiAqIHJzaTE4bi5qcyDigJQgbGlnaHR3ZWlnaHQsIGRlcGVuZGVuY3ktZnJlZSBpMThuIGZvciBSdW5lc3RvbmUgaW50ZXJhY3RpdmVzLlxuICpcbiAqIFJlcGxhY2VzIHRoZSB2ZW5kb3JlZCBXaWtpbWVkaWEganF1ZXJ5LmkxOG4gcGx1Z2luIGZvciBjb21wb25lbnRzIHRoYXQgaGF2ZVxuICogYmVlbiBtaWdyYXRlZCBvZmYgalF1ZXJ5LiBUaGUgY2F0YWxvZyBmb3JtYXQgaXMgdW5jaGFuZ2VkOiBtZXNzYWdlcyBhcmVcbiAqIGtleWVkIGJ5IG5hbWUgd2l0aGluIGEgbG9jYWxlIG9iamVjdCBhbmQgdXNlIHBvc2l0aW9uYWwgJDEsICQyLCAuLi5cbiAqIHBsYWNlaG9sZGVycywgc28gZXhpc3RpbmcgKi1pMThuLjxsb2NhbGU+LmpzIGNhdGFsb2cgZmlsZXMgb25seSBuZWVkIHRoZWlyXG4gKiBgJC5pMThuKCkubG9hZCguLi4pYCBjYWxsIHN3YXBwZWQgZm9yIGBsb2FkKC4uLilgLlxuICpcbiAqIFVzYWdlOlxuICogICBpbXBvcnQgeyBsb2FkLCB0IH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcbiAqICAgbG9hZCh7IGVuOiB7IGdyZWV0aW5nOiBcIkhlbGxvICQxXCIgfSB9KTtcbiAqICAgdChcImdyZWV0aW5nXCIsIFwiV29ybGRcIik7ICAgICAgLy8gLT4gXCJIZWxsbyBXb3JsZFwiXG4gKiAgIHQoXCJ1bmtub3duX2tleVwiKTsgICAgICAgICAgICAvLyAtPiBcInVua25vd25fa2V5XCIgKG1hdGNoZXMganF1ZXJ5LmkxOG4pXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5jb25zdCBGQUxMQkFDSyA9IFwiZW5cIjtcbmNvbnN0IGNhdGFsb2dzID0ge307XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShsb2NhbGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKGxvY2FsZSB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBEZWZhdWx0IGxvY2FsZSBmcm9tIHRoZSBkb2N1bWVudCwgZmFsbGluZyBiYWNrIHRvIHRoZSBicm93c2VyLCB0aGVuIEVuZ2xpc2guXG4vLyBqcXVlcnkuaTE4biBkZXJpdmVkIHRoZSBsb2NhbGUgdGhlIHNhbWUgd2F5LCBzbyBiZWhhdmlvciBpcyBwcmVzZXJ2ZWQuXG5sZXQgY3VycmVudExvY2FsZSA9IG5vcm1hbGl6ZShcbiAgICAodHlwZW9mIGRvY3VtZW50ICE9PSBcInVuZGVmaW5lZFwiICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nKSB8fFxuICAgICAgICAodHlwZW9mIG5hdmlnYXRvciAhPT0gXCJ1bmRlZmluZWRcIiAmJiBuYXZpZ2F0b3IubGFuZ3VhZ2UpIHx8XG4gICAgICAgIEZBTExCQUNLXG4pO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0TG9jYWxlKGxvY2FsZSkge1xuICAgIGN1cnJlbnRMb2NhbGUgPSBub3JtYWxpemUobG9jYWxlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2FsZSgpIHtcbiAgICByZXR1cm4gY3VycmVudExvY2FsZTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBtZXNzYWdlcy4gQWNjZXB0cyB0aGUgc2FtZSBzaGFwZSBhcyAkLmkxOG4oKS5sb2FkKCk6XG4gKiAgIHsgXCJlblwiOiB7IGtleTogXCJtc2cgJDFcIiB9LCBcInB0LWJyXCI6IHsga2V5OiBcIi4uLlwiIH0gfVxuICogTG9jYWxlIGtleXMgYXJlIG5vcm1hbGl6ZWQgdG8gbG93ZXItY2FzZSBzbyBsb29rdXBzIGFyZSBjYXNlLWluc2Vuc2l0aXZlXG4gKiAoZS5nLiBhIFwic3ItQ3lybFwiIGNhdGFsb2cgbWF0Y2hlcyBhIGRvY3VtZW50IGxhbmcgb2YgXCJzci1jeXJsXCIpLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9hZChtZXNzYWdlcykge1xuICAgIGZvciAoY29uc3QgW2xvY2FsZSwgbXNnc10gb2YgT2JqZWN0LmVudHJpZXMobWVzc2FnZXMpKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IG5vcm1hbGl6ZShsb2NhbGUpO1xuICAgICAgICBjYXRhbG9nc1trZXldID0gT2JqZWN0LmFzc2lnbihjYXRhbG9nc1trZXldIHx8IHt9LCBtc2dzKTtcbiAgICB9XG59XG5cbi8vIExvb2t1cCBvcmRlcjogZXhhY3QgbG9jYWxlLCB0aGVuIGl0cyBwcmltYXJ5IHN1YnRhZywgdGhlbiB0aGUgZmFsbGJhY2suXG4vLyBlLmcuIFwicHQtYnJcIiAtPiBcInB0XCIgLT4gXCJlblwiLlxuZnVuY3Rpb24gbG9jYWxlQ2hhaW4obG9jYWxlKSB7XG4gICAgY29uc3QgY2hhaW4gPSBbXTtcbiAgICBpZiAobG9jYWxlKSB7XG4gICAgICAgIGNoYWluLnB1c2gobG9jYWxlKTtcbiAgICAgICAgY29uc3QgcHJpbWFyeSA9IGxvY2FsZS5zcGxpdChcIi1cIilbMF07XG4gICAgICAgIGlmIChwcmltYXJ5ICYmIHByaW1hcnkgIT09IGxvY2FsZSkge1xuICAgICAgICAgICAgY2hhaW4ucHVzaChwcmltYXJ5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhaW4uaW5kZXhPZihGQUxMQkFDSykgPT09IC0xKSB7XG4gICAgICAgIGNoYWluLnB1c2goRkFMTEJBQ0spO1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW47XG59XG5cbmZ1bmN0aW9uIGxvb2t1cChrZXkpIHtcbiAgICBmb3IgKGNvbnN0IGxvY2FsZSBvZiBsb2NhbGVDaGFpbihjdXJyZW50TG9jYWxlKSkge1xuICAgICAgICBjb25zdCBjYXRhbG9nID0gY2F0YWxvZ3NbbG9jYWxlXTtcbiAgICAgICAgaWYgKGNhdGFsb2cgJiYgY2F0YWxvZ1trZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBjYXRhbG9nW2tleV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBUcmFuc2xhdGUgYSBtZXNzYWdlIGtleSwgc3Vic3RpdHV0aW5nIHBvc2l0aW9uYWwgJDEsICQyLCAuLi4gYXJndW1lbnRzLlxuICogVW5rbm93biBrZXlzIGFyZSByZXR1cm5lZCB2ZXJiYXRpbSwgbWF0Y2hpbmcganF1ZXJ5LmkxOG4ncyBiZWhhdmlvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHQoa2V5LCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbXNnID0gbG9va3VwKGtleSk7XG4gICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICAgIHJldHVybiBtc2cucmVwbGFjZSgvXFwkKFxcZCspL2csIChtYXRjaCwgbikgPT4ge1xuICAgICAgICBjb25zdCBhcmcgPSBhcmdzW051bWJlcihuKSAtIDFdO1xuICAgICAgICByZXR1cm4gYXJnID09PSB1bmRlZmluZWQgPyBtYXRjaCA6IFN0cmluZyhhcmcpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7IGxvYWQsIHQsIHNldExvY2FsZSwgZ2V0TG9jYWxlIH07XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19wYXJzb25fY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRhclwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHA6XCJBanVkYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3Rvb19zaG9ydDogXCJTZXUgcHJvZ3JhbWEgw6kgbXVpdG8gY3VydG8uIEFkaWNpb25lIG1haXMgYmxvY29zLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2RyYWdfZnJvbV9oZXJlOiBcIkFycmFzdGUgZGFxdWlcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiTGFyZ3VlIG9zIGJsb2NvcyBhcXVpXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnk6XG4gICAgICAgICAgICBcIlBlcmZlaXRvISBWb2PDqiBsZXZvdSBhcGVuYXMgdW1hIHRlbnRhdGl2YSBwYXJhIHJlc29sdmVyLiBCb20gdHJhYmFsaG8hXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdDpcbiAgICAgICAgICAgIFwiUGVyZmVpdG8hIFZvY8OqIGxldm91ICQxIHRlbnRhdGl2YXMgcGFyYSByZXNvbHZlci4gQ2xpcXVlIGVtIFJlc2V0YXIgcGFyYSB0ZW50YXIgcmVzb2x2ZXIgZW0gdW1hIHRlbnRhdGl2YS5cIiAsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50OlxuICAgICAgICAgICAgXCJFc3RlIGJsb2NvIG7Do28gZXN0w6EgaW5kZW50YWRvIGNvcnJldGFtZW50ZS4gSW5kZW50ZSBtYWlzIGFycmFzdGFuZG8tbyBwYXJhIGEgZGlyZWl0YSBvdSByZWR1emEgYSBpbmRlbnRhw6fDo28gYXJyYXN0YW5kbyBwYXJhIGEgZXNxdWVyZGEuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwiRXN0ZXMgYmxvY29zIG7Do28gZXN0w6NvIGluZGVudGFkb3MgY29ycmV0YW1lbnRlLiBQYXJhIGluZGVudGFyIG1haXMsIGFycmFzdGUgbyBibG9jbyBwYXJhIGEgZGlyZWl0YS4gUGFyYSByZWR1emlyIGEgaW5kZW50YcOnw6NvLCBhcnJhc3RlIHBhcmEgYSBlc3F1ZXJkYS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19vcmRlcjpcbiAgICAgICAgICAgIFwiQmxvY29zIGRlc3RhY2Fkb3Mgbm8gc2V1IHByb2dyYW1hIGVzdMOjbyBlcnJhZG9zIG91IGVzdMOjbyBuYSBvcmRlbSBlcnJhZGEuIElzc28gcG9kZSBzZXIgcmVzb2x2aWRvIG1vdmVuZG8sIGV4Y2x1aW5kbyBvdSBzdWJzdGl0dWluZG8gb3MgYmxvY29zIGRlc3RhY2Fkb3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGU6XG4gICAgICAgICAgICBcIlVzZSBhcyB0ZWNsYXMgZGUgc2V0YXMgcGFyYSBuYXZlZ2FyLiBFc3Bhw6dvIHBhcmEgc2VsZWNpb25hci8gZGVzbWFyY2FyIGJsb2NvcyBwYXJhIG1vdmVyLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHBfaW5mbzpcbiAgICAgICAgICAgIFwiQ2xpcXVlIG5vIGJvdMOjbyBBanVkYSBzZSB2b2PDqiBxdWlzZXIgZmFjaWxpdGFyIG8gcHJvYmxlbWFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9ub3Rfc29sdXRpb246XG4gICAgICAgICAgICBcIkZvaSBkZXNhYmlsaXRhZG8gdW0gYmxvY28gZGUgY8OzZGlnbyBkZXNuZWNlc3PDoXJpbyAocXVlIG7Do28gZmF6IHBhcnRlIGRhIHNvbHXDp8OjbykuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50OlwiRm9pIGZvcm5lY2lkYSBhIGluZGVudGHDp8Ojby5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3M6XCJEb2lzIGJsb2NvcyBkZSBjw7NkaWdvcyBmb3JhbSBjb21iaW5hZG9zIGVtIHVtLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3Q6XG4gICAgICAgICAgICBcIlNlcsOhIHJlbW92aWRvIHVtIGJsb2NvIGRlIGPDs2RpZ28gaW5jb3JyZXRvIGRhIMOhcmVhIGRlIHJlc3Bvc3RhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9jb21iaW5lOlwiU2Vyw6NvIGNvbWJpbmFkb3MgZG9pcyBibG9jb3NcIixcbiAgICAgICAgbXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzOlxuICAgICAgICAgICAgXCJWb2PDqiBkZXZlIHRlbnRhciBwZWxvIG1lbm9zIHRyw6pzIHZlemVzIGFudGVzIGRlIHBlZGlyIGFqdWRhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcIlJlc3RhbSBhcGVuYXMgMyBibG9jb3MgY29ycmV0b3MuIFZvY8OqIGRldmUgY29sb2PDoS1sb3MgZW0gb3JkZW1cIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX3Byb3ZpZGVfaW5kZW50OiBcIlNlcsOhIGZvcm5lY2lkYSBhIGluZGVudGHDp8Ojb1wiXG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IHsgbG9hZCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5cbmxvYWQoe1xuICAgIGVuOiB7XG4gICAgICAgIG1zZ19wYXJzb25fY2hlY2tfbWU6IFwiQ2hlY2tcIixcbiAgICAgICAgbXNnX3BhcnNvbl9yZXNldDogXCJSZXNldFwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHA6IFwiSGVscCBtZVwiLFxuICAgICAgICBtc2dfcGFyc29uX3Rvb19zaG9ydDogXCJZb3VyIGFuc3dlciBpcyB0b28gc2hvcnQuIEFkZCBtb3JlIGJsb2Nrcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX2Zyb21faGVyZTogXCJEcmFnIGZyb20gaGVyZVwiLFxuICAgICAgICBtc2dfcGFyc29uX2RyYWdfdG9faGVyZTogXCJEcm9wIGJsb2NrcyBoZXJlXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnk6XG4gICAgICAgICAgICBcIlBlcmZlY3QhICBJdCB0b29rIHlvdSBvbmx5IG9uZSB0cnkgdG8gc29sdmUgdGhpcy4gIEdyZWF0IGpvYiFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb3JyZWN0OlxuICAgICAgICAgICAgXCJQZXJmZWN0ISAgSXQgdG9vayB5b3UgJDEgdHJpZXMgdG8gc29sdmUgdGhpcy4gIENsaWNrIFJlc2V0IHRvIHRyeSB0byBzb2x2ZSBpdCBpbiBvbmUgYXR0ZW1wdC5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb3JyZWN0X3J1bm5hYmxlOlxuICAgICAgICAgICAgXCJDbGljayBSdW4gYmVsb3cgdG8gdGVzdCBvdXQgeW91ciBzb2x1dGlvbi5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19pbmRlbnQ6XG4gICAgICAgICAgICBcIlRoaXMgYmxvY2sgaXMgbm90IGluZGVudGVkIGNvcnJlY3RseS4gRWl0aGVyIGluZGVudCBpdCBtb3JlIGJ5IGRyYWdnaW5nIGl0IHJpZ2h0IG9yIHJlZHVjZSB0aGUgaW5kZW50aW9uIGJ5IGRyYWdnaW5nIGl0IGxlZnQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwiVGhlc2UgYmxvY2tzIGFyZSBub3QgaW5kZW50ZWQgY29ycmVjdGx5LiBUbyBpbmRlbnQgYSBibG9jayBtb3JlLCBkcmFnIGl0IHRvIHRoZSByaWdodC4gVG8gcmVkdWNlIHRoZSBpbmRlbnRpb24sIGRyYWcgaXQgdG8gdGhlIGxlZnQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3Jvbmdfb3JkZXI6XG4gICAgICAgICAgICBcIkhpZ2hsaWdodGVkIGJsb2NrcyBpbiB5b3VyIGFuc3dlciBhcmUgd3Jvbmcgb3IgYXJlIGluIHRoZSB3cm9uZyBvcmRlci4gVGhpcyBjYW4gYmUgZml4ZWQgYnkgbW92aW5nLCByZW1vdmluZywgb3IgcmVwbGFjaW5nIGhpZ2hsaWdodGVkIGJsb2Nrcy5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9hcnJvd19uYXZpZ2F0ZTpcbiAgICAgICAgICAgIFwiQXJyb3cga2V5cyB0byBuYXZpZ2F0ZS4gU3BhY2UgdG8gc2VsZWN0IC8gZGVzZWxlY3QgYmxvY2sgdG8gbW92ZS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwX2luZm86XG4gICAgICAgICAgICBcIkNsaWNrIG9uIHRoZSBIZWxwIE1lIGJ1dHRvbiBpZiB5b3Ugd2FudCB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclwiLFxuICAgICAgICBtc2dfcGFyc29uX25vdF9zb2x1dGlvbjpcbiAgICAgICAgICAgIFwiRGlzYWJsZWQgYW4gdW5uZWVkZWQgY29kZSBibG9jayAob25lIHRoYXQgaXMgbm90IHBhcnQgb2YgdGhlIHNvbHV0aW9uKS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9wcm92aWRlZF9pbmRlbnQ6IFwiUHJvdmlkZWQgdGhlIGluZGVudGF0aW9uLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvbWJpbmVkX2Jsb2NrczogXCJDb21iaW5lZCB0d28gY29kZSBibG9ja3MgaW50byBvbmUuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVtb3ZlX2luY29ycmVjdDpcbiAgICAgICAgICAgIFwiV2lsbCByZW1vdmUgYW4gaW5jb3JyZWN0IGNvZGUgYmxvY2sgZnJvbSBhbnN3ZXIgYXJlYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfY29tYmluZTogXCJXaWxsIGNvbWJpbmUgdHdvIGJsb2Nrc1wiLFxuICAgICAgICBtc2dfcGFyc29uX2F0bGVhc3RfdGhyZWVfYXR0ZW1wdHM6XG4gICAgICAgICAgICBcIllvdSBtdXN0IG1ha2UgYXQgbGVhc3QgdGhyZWUgZGlzdGluY3QgZnVsbCBhdHRlbXB0cyBhdCBhIHNvbHV0aW9uIGJlZm9yZSB5b3UgY2FuIGdldCBoZWxwXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcIlRoZXJlIGFyZSBvbmx5IDMgY29ycmVjdCBibG9ja3MgbGVmdC4gIFlvdSBzaG91bGQgYmUgYWJsZSB0byBwdXQgdGhlbSBpbiBvcmRlclwiLFxuICAgICAgICBtc2dfcGFyc29uX3dpbGxfcHJvdmlkZV9pbmRlbnQ6IFwiV2lsbCBwcm92aWRlIGluZGVudGF0aW9uXCIsXG4gICAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9