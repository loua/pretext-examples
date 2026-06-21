(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone"],{

/***/ 3403:
/*!*****************************************************************************************************************!*\
  !*** ./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js ***!
  \*****************************************************************************************************************/
/***/ (() => {

(function ($) {
  /**
   * Patch TOC list.
   *
   * Will mutate the underlying span to have a correct ul for nav.
   *
   * @param $span: Span containing nested UL's to mutate.
   * @param minLevel: Starting level for nested lists. (1: global, 2: local).
   */
  var patchToc = function ($ul, minLevel) {
    var findA,
      patchTables,
      $localLi;

    // Find all a "internal" tags, traversing recursively.
    findA = function ($elem, level) {
      level = level || 0;
      var $items = $elem.find("> li > a.internal, > ul, > li > ul");

      // Iterate everything in order.
      $items.each(function (index, item) {
        var $item = $(item),
          tag = item.tagName.toLowerCase(),
          $childrenLi = $item.children('li'),
          $parentLi = $($item.parent('li'), $item.parent().parent('li'));

        // Add dropdowns if more children and above minimum level.
        if (tag === 'ul' && level >= minLevel && $childrenLi.length > 0) {
          $parentLi
            .addClass('dropdown-submenu')
            .children('a').first().attr('tabindex', -1);

          $item.addClass('dropdown-menu');
        }

        findA($item, level + 1);
      });
    };

    findA($ul);
  };

  /**
   * Patch all tables to remove ``docutils`` class and add Bootstrap base
   * ``table`` class.
   */
  patchTables = function () {
    $("table.docutils")
      .removeClass("docutils")
      .addClass("table")
      .attr("border", 0);
  };

$(function () {

    /*
     * Scroll the window to avoid the topnav bar
     * https://github.com/twitter/bootstrap/issues/1768
     */
    if ($("#navbar.navbar-fixed-top").length > 0) {
      var navHeight = $("#navbar").height(),
        shiftWindow = function() { scrollBy(0, -navHeight - 10); };

      if (location.hash) {
        shiftWindow();
      }

      window.addEventListener("hashchange", shiftWindow);
    }

    // Add styling, structure to TOC's.
    $(".dropdown-menu").each(function () {
      $(this).find("ul").each(function (index, item){
        var $item = $(item);
        $item.addClass('unstyled');
      });
    });

    // Global TOC.
    if ($("ul.globaltoc li").length) {
      patchToc($("ul.globaltoc"), 1);
    } else {
      // Remove Global TOC.
      $(".globaltoc-container").remove();
    }

    // Local TOC.
    patchToc($("ul.localtoc"), 2);

    // Mutate sub-lists (for bs-2.3.0).
    $(".dropdown-menu ul").not(".dropdown-menu").each(function () {
      var $ul = $(this),
        $parent = $ul.parent(),
        tag = $parent[0].tagName.toLowerCase(),
        $kids = $ul.children().detach();

      // Replace list with items if submenu header.
      if (tag === "ul") {
        $ul.replaceWith($kids);
      } else if (tag === "li") {
        // Insert into previous list.
        $parent.after($kids);
        $ul.remove();
      }
    });

    // Add divider in page TOC.
    $localLi = $("ul.localtoc li");
    if ($localLi.length > 2) {
      $localLi.first().after('<li class="divider"></li>');
    }

    // Enable dropdown.
    $('.dropdown-toggle').dropdown();

    // Patch tables.
    patchTables();

    // Add Note, Warning styles.
    $('div.note').addClass('alert').addClass('alert-info');
    $('div.warning').addClass('alert').addClass('alert-warning');

    // Inline code styles to Bootstrap style.
    $('tt.docutils.literal').not(".xref").each(function (i, e) {
      // ignore references
      if (!$(e).parent().hasClass("reference")) {
        $(e).replaceWith(function () {
          return $("<code />").text($(this).text());
        });
      }});
  });
}(window.jQuery));


/***/ }),

/***/ 19359:
/*!****************************************!*\
  !*** ./runestone/common/js/pretext.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runestonebase.js */ 78673);
/*
    Support functions for PreTeXt books running on Runestone

*/



function setupPTXEvents() {
    let rb = new _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    // log an event when a knowl is opened.
    document.querySelectorAll("[data-knowl]").forEach((el) => {
        el.addEventListener("click", function () {
            let div_id = el.getAttribute("data-knowl");
            rb.logBookEvent({ event: "knowl", act: "click", div_id: div_id });
        });
    });
    let born_hidden = document.querySelectorAll("details.born-hidden-knowl");
    born_hidden.forEach((el) => {
        // log an event when a knowl is opened that was born hidden
        el.addEventListener("toggle", function () {
            if (el.open) {
                let div_id = el.id;
                rb.logBookEvent({ event: "knowl", act: "open", div_id: div_id });
            }
        });
    });
    // log an event when a sage cell is evaluated
    document.querySelectorAll(".sagecell_evalButton").forEach((btn) => {
        btn.addEventListener("click", function () {
            let container = btn.closest(".ptx-sagecell");
            let codeInput = container ? container.querySelector(".sagecell_input") : null;
            let code = codeInput ? codeInput.textContent : "";
            let div_id = container ? container.id : null;
            if (! div_id) {
                console.warn("Could not find container or div_id for sagecell button");
                return;
                }

            rb.logBookEvent({ event: "sage", act: "run", div_id: div_id });
        });
    });
    if (typeof eBookConfig !== "undefined" && !eBookConfig.isInstructor) {
        document.querySelectorAll(".commentary").forEach((el) => {
            el.style.display = "none";
        });
    }
}

window.addEventListener("load", function () {
    console.log("setting up pretext");
    setupPTXEvents();
    let wrap = document.getElementById("primary-navbar-sticky-wrapper");
    if (wrap) {
        wrap.style.overflow = "visible";
    }
});


/***/ }),

/***/ 19695:
/*!***********************************************!*\
  !*** ./runestone/common/js/presenter_mode.js ***!
  \***********************************************/
/***/ (() => {

var codeExercises;
var presenterCssLink;
var presentModeInitialized = false;

function presentToggle() {
    if (!presentModeInitialized) {
        presentModeSetup();
        presentModeInitialized = true;
    }
    let bod = $("body");
    let presentClass = "present";
    let fullHeightClass = "full-height";
    let bottomClass = "bottom";
    if (bod.hasClass(presentClass)) {
        $("section *")
            .not(
                "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, section, .pre, code"
            )
            .removeClass("hidden"); //show everything
        $("#completionButton").removeClass("hidden");
        bod.removeClass(presentClass);
        $("." + fullHeightClass).removeClass(fullHeightClass);
        $("." + bottomClass).removeClass(bottomClass);
        localStorage.setItem("presentMode", "text");
        codeExercises.removeClass("hidden");
        presenterCssLink.disabled = true; // disable present_mode.css
    } else {
        $("section *")
            .not(
                "h1, .presentation-title, .btn-presenter, .runestone, .runestone *, section, .pre, code"
            )
            .addClass("hidden"); // hide extraneous stuff
        $("#completionButton").addClass("hidden");
        bod.addClass(presentClass);
        bod.addClass(fullHeightClass);
        $("html").addClass(fullHeightClass);
        $("section .runestone").addClass(fullHeightClass);
        $(".ac-caption").addClass(bottomClass);
        localStorage.setItem("presentMode", presentClass);
        // presenter_mode.css is loaded by webpack
        //loadPresenterCss(); // present_mode.css should only apply when in presenter mode.
        activateExercise();
    }
}

function loadPresenterCss() {
    presenterCssLink = document.createElement("link");
    presenterCssLink.type = "text/css";
    presenterCssLink.href = "../_static/presenter_mode.less";
    presenterCssLink.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(presenterCssLink);
}

function presentModeSetup() {
    // moved this out of configure
    let dataComponent = $("[data-childcomponent]");

    // this still leaves some things semi-messed up when you exit presenter mode.
    // but instructors will probably just learn to refresh the page.
    dataComponent.addClass("runestone");
    dataComponent.parent().closest("div").not("section").addClass("runestone");
    dataComponent.parent().closest("div").css("max-width", "none");

    dataComponent.each(function (index) {
        let me = $(this);
        $(this)
            .find(".ac_code_div, .ac_output")
            .wrapAll("<div class='ac-block' style='width: 100%;'></div>");
    });

    codelensListener(500);
    $("section img").wrap('<div class="runestone">');
    codeExercises = $(".runestone").not(".runestone .runestone");
    // codeExercises.each(function(){
    $("h1").before(
        "<div class='presentation-title'> \
        <button class='prev-exercise btn-presenter btn-grey-outline' onclick='prevExercise()'>Back</button> \
        <button class='next-exercise btn-presenter btn-grey-solid' onclick='nextExercise()'>Next</button> \
      </div>"
    );
}
function getActiveExercise() {
    return (active = codeExercises.filter(".active"));
}

function activateExercise(index) {
    if (typeof index == "undefined") {
        index = 0;
    }

    let active = getActiveExercise();

    if (codeExercises.length) {
        active.removeClass("active");
        active = $(codeExercises[index]).addClass("active");
        active.removeClass("hidden");
        codeExercises.not(codeExercises.filter(".active")).addClass("hidden");
    }
}

window.nextExercise = function() {
    let active = getActiveExercise();
    let nextIndex = codeExercises.index(active) + 1;
    if (nextIndex < codeExercises.length) {
        activateExercise(nextIndex);
    }
}

window.prevExercise = function() {
    let active = getActiveExercise();
    let prevIndex = codeExercises.index(active) - 1;
    if (prevIndex >= 0) {
        activateExercise(prevIndex);
    }
}

function configure() {
    let rightNav = $(".navbar-right");
    rightNav.prepend(
        "<li class='dropdown view-toggle'> \
      <label>View: \
        <select class='mode-select'> \
          <option value='text'>Textbook</option> \
          <option value='present'>Code Presenter</option> \
        </select> \
      </label> \
    </li>"
    );

    let modeSelect = $(".mode-select").change(presentToggle);
}

function codelensListener(duration) {
    // $(".ExecutionVisualizer").length ? configureCodelens() : setTimeout(codelensListener, duration);
    // configureCodelens();
}

function configureCodelens() {
    let acCodeTitle = document.createElement("h4");
    acCodeTitle.textContent = "Active Code Window";
    let acCode = $(".ac_code_div");
    $(".ac_code_div").addClass("col-md-6");
    acCode.prepend(acCodeTitle);

    acOutTitle = document.createElement("h4");
    acOutTitle.textContent = "Output Window";
    let acOut = $(".ac_output").addClass("col-md-6");
    $(".ac_output").prepend(acOutTitle);

    let sketchpadTitle = document.createElement("h4");
    sketchpadTitle.textContent = "Sketchpad";
    let sketchpad = document.createElement("span");
    $(sketchpad).addClass("sketchpad");
    let sketchpadContainer = document.createElement("div");
    $(sketchpadContainer).addClass("sketchpad-container");
    sketchpadContainer.appendChild(sketchpadTitle);
    sketchpadContainer.appendChild(sketchpad);
    //$('.ac_output').append(sketchpadContainer);

    let visualizers = $(".ExecutionVisualizer");

    console.log("Econtainer: ", this.eContainer);

    $("[data-childcomponent]").on("click", "button.row-mode", function () {
        $(this).closest("[data-childcomponent]").removeClass("card-mode");
        $(this).closest("[data-childcomponent]").addClass("row-mode");
        $(this).next(".card-mode").removeClass("active-layout");
        $(this).addClass("active-layout");
    });

    $("[data-childcomponent]").on("click", "button.card-mode", function () {
        $(this).closest("[data-childcomponent]").removeClass("row-mode");
        $(this).closest("[data-childcomponent]").addClass("card-mode");
        $(this).prev(".row-mode").removeClass("active-layout");
        $(this).addClass("active-layout");
    });

    $("[data-childcomponent] .ac_section").each(function () {
        $(this).prepend(
            '<div class="presentation-options"><button class="row-mode layout-btn"><img src="../_images/row-btn-content.png" alt="Rows"></button><button class="card-mode layout-btn"><img src="../_images/card-btn-content.png" alt="Card"></button></div>'
        );
    });

    visualizers.each(function (index) {
        let me = $(this);
        let col1 = me.find("#vizLayoutTdFirst");
        let col2 = me.find("#vizLayoutTdSecond");
        let dataVis = me.find("#dataViz");
        let stackHeapTable = me.find("#stackHeapTable");
        let output = me.find("#progOutputs");
        output.css("display", "block");
        me.parent().prepend(
            "<div class='presentation-title'><div class='title-text'> Example " +
                (Number(index) + 1) +
                "</div></div>"
        );
    });

    acCode.each(function () {
        let section = $(this).closest(".ac-block").parent();
        console.log(section, section.length);
        section.append(sketchpadContainer);
    });

    $("button.card-mode").click();

    let modeSelect = $(".mode-select");
    let mode = localStorage.getItem("presentMode");
    if (mode == "present") {
        modeSelect.val("present");
        modeSelect.change();
    }
}

$(document).on("runestone:login-complete", function () {
    // if user is instructor, enable presenter mode
    if (eBookConfig.isInstructor) {
        configure();
    }
});


/***/ }),

/***/ 23836:
/*!******************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.fallbacks.js ***!
  \******************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */
( function ( $ ) {
	'use strict';

	$.i18n = $.i18n || {};
	$.extend( $.i18n.fallbacks, {
		ab: [ 'ru' ],
		ace: [ 'id' ],
		aln: [ 'sq' ],
		// Not so standard - als is supposed to be Tosk Albanian,
		// but in Wikipedia it's used for a Germanic language.
		als: [ 'gsw', 'de' ],
		an: [ 'es' ],
		anp: [ 'hi' ],
		arn: [ 'es' ],
		arz: [ 'ar' ],
		av: [ 'ru' ],
		ay: [ 'es' ],
		ba: [ 'ru' ],
		bar: [ 'de' ],
		'bat-smg': [ 'sgs', 'lt' ],
		bcc: [ 'fa' ],
		'be-x-old': [ 'be-tarask' ],
		bh: [ 'bho' ],
		bjn: [ 'id' ],
		bm: [ 'fr' ],
		bpy: [ 'bn' ],
		bqi: [ 'fa' ],
		bug: [ 'id' ],
		'cbk-zam': [ 'es' ],
		ce: [ 'ru' ],
		crh: [ 'crh-latn' ],
		'crh-cyrl': [ 'ru' ],
		csb: [ 'pl' ],
		cv: [ 'ru' ],
		'de-at': [ 'de' ],
		'de-ch': [ 'de' ],
		'de-formal': [ 'de' ],
		dsb: [ 'de' ],
		dtp: [ 'ms' ],
		egl: [ 'it' ],
		eml: [ 'it' ],
		ff: [ 'fr' ],
		fit: [ 'fi' ],
		'fiu-vro': [ 'vro', 'et' ],
		frc: [ 'fr' ],
		frp: [ 'fr' ],
		frr: [ 'de' ],
		fur: [ 'it' ],
		gag: [ 'tr' ],
		gan: [ 'gan-hant', 'zh-hant', 'zh-hans' ],
		'gan-hans': [ 'zh-hans' ],
		'gan-hant': [ 'zh-hant', 'zh-hans' ],
		gl: [ 'pt' ],
		glk: [ 'fa' ],
		gn: [ 'es' ],
		gsw: [ 'de' ],
		hif: [ 'hif-latn' ],
		hsb: [ 'de' ],
		ht: [ 'fr' ],
		ii: [ 'zh-cn', 'zh-hans' ],
		inh: [ 'ru' ],
		iu: [ 'ike-cans' ],
		jut: [ 'da' ],
		jv: [ 'id' ],
		kaa: [ 'kk-latn', 'kk-cyrl' ],
		kbd: [ 'kbd-cyrl' ],
		khw: [ 'ur' ],
		kiu: [ 'tr' ],
		kk: [ 'kk-cyrl' ],
		'kk-arab': [ 'kk-cyrl' ],
		'kk-latn': [ 'kk-cyrl' ],
		'kk-cn': [ 'kk-arab', 'kk-cyrl' ],
		'kk-kz': [ 'kk-cyrl' ],
		'kk-tr': [ 'kk-latn', 'kk-cyrl' ],
		kl: [ 'da' ],
		'ko-kp': [ 'ko' ],
		koi: [ 'ru' ],
		krc: [ 'ru' ],
		ks: [ 'ks-arab' ],
		ksh: [ 'de' ],
		ku: [ 'ku-latn' ],
		'ku-arab': [ 'ckb' ],
		kv: [ 'ru' ],
		lad: [ 'es' ],
		lb: [ 'de' ],
		lbe: [ 'ru' ],
		lez: [ 'ru' ],
		li: [ 'nl' ],
		lij: [ 'it' ],
		liv: [ 'et' ],
		lmo: [ 'it' ],
		ln: [ 'fr' ],
		ltg: [ 'lv' ],
		lzz: [ 'tr' ],
		mai: [ 'hi' ],
		'map-bms': [ 'jv', 'id' ],
		mg: [ 'fr' ],
		mhr: [ 'ru' ],
		min: [ 'id' ],
		mo: [ 'ro' ],
		mrj: [ 'ru' ],
		mwl: [ 'pt' ],
		myv: [ 'ru' ],
		mzn: [ 'fa' ],
		nah: [ 'es' ],
		nap: [ 'it' ],
		nds: [ 'de' ],
		'nds-nl': [ 'nl' ],
		'nl-informal': [ 'nl' ],
		no: [ 'nb' ],
		os: [ 'ru' ],
		pcd: [ 'fr' ],
		pdc: [ 'de' ],
		pdt: [ 'de' ],
		pfl: [ 'de' ],
		pms: [ 'it' ],
		pt: [ 'pt-br' ],
		'pt-br': [ 'pt' ],
		qu: [ 'es' ],
		qug: [ 'qu', 'es' ],
		rgn: [ 'it' ],
		rmy: [ 'ro' ],
		'roa-rup': [ 'rup' ],
		rue: [ 'uk', 'ru' ],
		ruq: [ 'ruq-latn', 'ro' ],
		'ruq-cyrl': [ 'mk' ],
		'ruq-latn': [ 'ro' ],
		sa: [ 'hi' ],
		sah: [ 'ru' ],
		scn: [ 'it' ],
		sg: [ 'fr' ],
		sgs: [ 'lt' ],
		sli: [ 'de' ],
		sr: [ 'sr-ec' ],
		srn: [ 'nl' ],
		stq: [ 'de' ],
		su: [ 'id' ],
		szl: [ 'pl' ],
		tcy: [ 'kn' ],
		tg: [ 'tg-cyrl' ],
		tt: [ 'tt-cyrl', 'ru' ],
		'tt-cyrl': [ 'ru' ],
		ty: [ 'fr' ],
		udm: [ 'ru' ],
		ug: [ 'ug-arab' ],
		uk: [ 'ru' ],
		vec: [ 'it' ],
		vep: [ 'et' ],
		vls: [ 'nl' ],
		vmf: [ 'de' ],
		vot: [ 'fi' ],
		vro: [ 'et' ],
		wa: [ 'fr' ],
		wo: [ 'fr' ],
		wuu: [ 'zh-hans' ],
		xal: [ 'ru' ],
		xmf: [ 'ka' ],
		yi: [ 'he' ],
		za: [ 'zh-hans' ],
		zea: [ 'nl' ],
		zh: [ 'zh-hans' ],
		'zh-classical': [ 'lzh' ],
		'zh-cn': [ 'zh-hans' ],
		'zh-hant': [ 'zh-hans' ],
		'zh-hk': [ 'zh-hant', 'zh-hans' ],
		'zh-min-nan': [ 'nan' ],
		'zh-mo': [ 'zh-hk', 'zh-hant', 'zh-hans' ],
		'zh-my': [ 'zh-sg', 'zh-hans' ],
		'zh-sg': [ 'zh-hans' ],
		'zh-tw': [ 'zh-hant', 'zh-hans' ],
		'zh-yue': [ 'yue' ]
	} );
}( jQuery ) );


/***/ }),

/***/ 35773:
/*!*****************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.language.js ***!
  \*****************************************************************/
/***/ (() => {

/* global pluralRuleParser */
( function ( $ ) {
	'use strict';

	// jscs:disable
	var language = {
		// CLDR plural rules generated using
		// libs/CLDRPluralRuleParser/tools/PluralXML2JSON.html
		pluralRules: {
			ak: {
				one: 'n = 0..1'
			},
			am: {
				one: 'i = 0 or n = 1'
			},
			ar: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n % 100 = 3..10',
				many: 'n % 100 = 11..99'
			},
			ars: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n % 100 = 3..10',
				many: 'n % 100 = 11..99'
			},
			as: {
				one: 'i = 0 or n = 1'
			},
			be: {
				one: 'n % 10 = 1 and n % 100 != 11',
				few: 'n % 10 = 2..4 and n % 100 != 12..14',
				many: 'n % 10 = 0 or n % 10 = 5..9 or n % 100 = 11..14'
			},
			bh: {
				one: 'n = 0..1'
			},
			bn: {
				one: 'i = 0 or n = 1'
			},
			br: {
				one: 'n % 10 = 1 and n % 100 != 11,71,91',
				two: 'n % 10 = 2 and n % 100 != 12,72,92',
				few: 'n % 10 = 3..4,9 and n % 100 != 10..19,70..79,90..99',
				many: 'n != 0 and n % 1000000 = 0'
			},
			bs: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			cs: {
				one: 'i = 1 and v = 0',
				few: 'i = 2..4 and v = 0',
				many: 'v != 0'
			},
			cy: {
				zero: 'n = 0',
				one: 'n = 1',
				two: 'n = 2',
				few: 'n = 3',
				many: 'n = 6'
			},
			da: {
				one: 'n = 1 or t != 0 and i = 0,1'
			},
			dsb: {
				one: 'v = 0 and i % 100 = 1 or f % 100 = 1',
				two: 'v = 0 and i % 100 = 2 or f % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or f % 100 = 3..4'
			},
			fa: {
				one: 'i = 0 or n = 1'
			},
			ff: {
				one: 'i = 0,1'
			},
			fil: {
				one: 'v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9'
			},
			fr: {
				one: 'i = 0,1'
			},
			ga: {
				one: 'n = 1',
				two: 'n = 2',
				few: 'n = 3..6',
				many: 'n = 7..10'
			},
			gd: {
				one: 'n = 1,11',
				two: 'n = 2,12',
				few: 'n = 3..10,13..19'
			},
			gu: {
				one: 'i = 0 or n = 1'
			},
			guw: {
				one: 'n = 0..1'
			},
			gv: {
				one: 'v = 0 and i % 10 = 1',
				two: 'v = 0 and i % 10 = 2',
				few: 'v = 0 and i % 100 = 0,20,40,60,80',
				many: 'v != 0'
			},
			he: {
				one: 'i = 1 and v = 0',
				two: 'i = 2 and v = 0',
				many: 'v = 0 and n != 0..10 and n % 10 = 0'
			},
			hi: {
				one: 'i = 0 or n = 1'
			},
			hr: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			hsb: {
				one: 'v = 0 and i % 100 = 1 or f % 100 = 1',
				two: 'v = 0 and i % 100 = 2 or f % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or f % 100 = 3..4'
			},
			hy: {
				one: 'i = 0,1'
			},
			is: {
				one: 't = 0 and i % 10 = 1 and i % 100 != 11 or t != 0'
			},
			iu: {
				one: 'n = 1',
				two: 'n = 2'
			},
			iw: {
				one: 'i = 1 and v = 0',
				two: 'i = 2 and v = 0',
				many: 'v = 0 and n != 0..10 and n % 10 = 0'
			},
			kab: {
				one: 'i = 0,1'
			},
			kn: {
				one: 'i = 0 or n = 1'
			},
			kw: {
				one: 'n = 1',
				two: 'n = 2'
			},
			lag: {
				zero: 'n = 0',
				one: 'i = 0,1 and n != 0'
			},
			ln: {
				one: 'n = 0..1'
			},
			lt: {
				one: 'n % 10 = 1 and n % 100 != 11..19',
				few: 'n % 10 = 2..9 and n % 100 != 11..19',
				many: 'f != 0'
			},
			lv: {
				zero: 'n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19',
				one: 'n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1'
			},
			mg: {
				one: 'n = 0..1'
			},
			mk: {
				one: 'v = 0 and i % 10 = 1 or f % 10 = 1'
			},
			mo: {
				one: 'i = 1 and v = 0',
				few: 'v != 0 or n = 0 or n != 1 and n % 100 = 1..19'
			},
			mr: {
				one: 'i = 0 or n = 1'
			},
			mt: {
				one: 'n = 1',
				few: 'n = 0 or n % 100 = 2..10',
				many: 'n % 100 = 11..19'
			},
			naq: {
				one: 'n = 1',
				two: 'n = 2'
			},
			nso: {
				one: 'n = 0..1'
			},
			pa: {
				one: 'n = 0..1'
			},
			pl: {
				one: 'i = 1 and v = 0',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i != 1 and i % 10 = 0..1 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 12..14'
			},
			prg: {
				zero: 'n % 10 = 0 or n % 100 = 11..19 or v = 2 and f % 100 = 11..19',
				one: 'n % 10 = 1 and n % 100 != 11 or v = 2 and f % 10 = 1 and f % 100 != 11 or v != 2 and f % 10 = 1'
			},
			pt: {
				one: 'i = 0..1'
			},
			ro: {
				one: 'i = 1 and v = 0',
				few: 'v != 0 or n = 0 or n != 1 and n % 100 = 1..19'
			},
			ru: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14'
			},
			se: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sh: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			shi: {
				one: 'i = 0 or n = 1',
				few: 'n = 2..10'
			},
			si: {
				one: 'n = 0,1 or i = 0 and f = 1'
			},
			sk: {
				one: 'i = 1 and v = 0',
				few: 'i = 2..4 and v = 0',
				many: 'v != 0'
			},
			sl: {
				one: 'v = 0 and i % 100 = 1',
				two: 'v = 0 and i % 100 = 2',
				few: 'v = 0 and i % 100 = 3..4 or v != 0'
			},
			sma: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smi: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smj: {
				one: 'n = 1',
				two: 'n = 2'
			},
			smn: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sms: {
				one: 'n = 1',
				two: 'n = 2'
			},
			sr: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11 or f % 10 = 1 and f % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14 or f % 10 = 2..4 and f % 100 != 12..14'
			},
			ti: {
				one: 'n = 0..1'
			},
			tl: {
				one: 'v = 0 and i = 1,2,3 or v = 0 and i % 10 != 4,6,9 or v != 0 and f % 10 != 4,6,9'
			},
			tzm: {
				one: 'n = 0..1 or n = 11..99'
			},
			uk: {
				one: 'v = 0 and i % 10 = 1 and i % 100 != 11',
				few: 'v = 0 and i % 10 = 2..4 and i % 100 != 12..14',
				many: 'v = 0 and i % 10 = 0 or v = 0 and i % 10 = 5..9 or v = 0 and i % 100 = 11..14'
			},
			wa: {
				one: 'n = 0..1'
			},
			zu: {
				one: 'i = 0 or n = 1'
			}
		},
		// jscs:enable

		/**
		 * Plural form transformations, needed for some languages.
		 *
		 * @param {integer} count
		 *            Non-localized quantifier
		 * @param {Array} forms
		 *            List of plural forms
		 * @return {string} Correct form for quantifier in this language
		 */
		convertPlural: function ( count, forms ) {
			var pluralRules,
				pluralFormIndex,
				index,
				explicitPluralPattern = new RegExp( '\\d+=', 'i' ),
				formCount,
				form;

			if ( !forms || forms.length === 0 ) {
				return '';
			}

			// Handle for Explicit 0= & 1= values
			for ( index = 0; index < forms.length; index++ ) {
				form = forms[ index ];
				if ( explicitPluralPattern.test( form ) ) {
					formCount = parseInt( form.slice( 0, form.indexOf( '=' ) ), 10 );
					if ( formCount === count ) {
						return ( form.slice( form.indexOf( '=' ) + 1 ) );
					}
					forms[ index ] = undefined;
				}
			}

			forms = $.map( forms, function ( form ) {
				if ( form !== undefined ) {
					return form;
				}
			} );

			pluralRules = this.pluralRules[ $.i18n().locale ];

			if ( !pluralRules ) {
				// default fallback.
				return ( count === 1 ) ? forms[ 0 ] : forms[ 1 ];
			}

			pluralFormIndex = this.getPluralForm( count, pluralRules );
			pluralFormIndex = Math.min( pluralFormIndex, forms.length - 1 );

			return forms[ pluralFormIndex ];
		},

		/**
		 * For the number, get the plural for index
		 *
		 * @param {integer} number
		 * @param {Object} pluralRules
		 * @return {integer} plural form index
		 */
		getPluralForm: function ( number, pluralRules ) {
			var i,
				pluralForms = [ 'zero', 'one', 'two', 'few', 'many', 'other' ],
				pluralFormIndex = 0;

			for ( i = 0; i < pluralForms.length; i++ ) {
				if ( pluralRules[ pluralForms[ i ] ] ) {
					if ( pluralRuleParser( pluralRules[ pluralForms[ i ] ], number ) ) {
						return pluralFormIndex;
					}

					pluralFormIndex++;
				}
			}

			return pluralFormIndex;
		},

		/**
		 * Converts a number using digitTransformTable.
		 *
		 * @param {number} num Value to be converted
		 * @param {boolean} integer Convert the return value to an integer
		 * @return {string} The number converted into a String.
		 */
		convertNumber: function ( num, integer ) {
			var tmp, item, i,
				transformTable, numberString, convertedNumber;

			// Set the target Transform table:
			transformTable = this.digitTransformTable( $.i18n().locale );
			numberString = String( num );
			convertedNumber = '';

			if ( !transformTable ) {
				return num;
			}

			// Check if the restore to Latin number flag is set:
			if ( integer ) {
				if ( parseFloat( num, 10 ) === num ) {
					return num;
				}

				tmp = [];

				for ( item in transformTable ) {
					tmp[ transformTable[ item ] ] = item;
				}

				transformTable = tmp;
			}

			for ( i = 0; i < numberString.length; i++ ) {
				if ( transformTable[ numberString[ i ] ] ) {
					convertedNumber += transformTable[ numberString[ i ] ];
				} else {
					convertedNumber += numberString[ i ];
				}
			}

			return integer ? parseFloat( convertedNumber, 10 ) : convertedNumber;
		},

		/**
		 * Grammatical transformations, needed for inflected languages.
		 * Invoked by putting {{grammar:form|word}} in a message.
		 * Override this method for languages that need special grammar rules
		 * applied dynamically.
		 *
		 * @param {string} word
		 * @param {string} form
		 * @return {string}
		 */
		// eslint-disable-next-line no-unused-vars
		convertGrammar: function ( word, form ) {
			return word;
		},

		/**
		 * Provides an alternative text depending on specified gender. Usage
		 * {{gender:[gender|user object]|masculine|feminine|neutral}}. If second
		 * or third parameter are not specified, masculine is used.
		 *
		 * These details may be overriden per language.
		 *
		 * @param {string} gender
		 *      male, female, or anything else for neutral.
		 * @param {Array} forms
		 *      List of gender forms
		 *
		 * @return {string}
		 */
		gender: function ( gender, forms ) {
			if ( !forms || forms.length === 0 ) {
				return '';
			}

			while ( forms.length < 2 ) {
				forms.push( forms[ forms.length - 1 ] );
			}

			if ( gender === 'male' ) {
				return forms[ 0 ];
			}

			if ( gender === 'female' ) {
				return forms[ 1 ];
			}

			return ( forms.length === 3 ) ? forms[ 2 ] : forms[ 0 ];
		},

		/**
		 * Get the digit transform table for the given language
		 * See http://cldr.unicode.org/translation/numbering-systems
		 *
		 * @param {string} language
		 * @return {Array|boolean} List of digits in the passed language or false
		 * representation, or boolean false if there is no information.
		 */
		digitTransformTable: function ( language ) {
			var tables = {
				ar: '٠١٢٣٤٥٦٧٨٩',
				fa: '۰۱۲۳۴۵۶۷۸۹',
				ml: '൦൧൨൩൪൫൬൭൮൯',
				kn: '೦೧೨೩೪೫೬೭೮೯',
				lo: '໐໑໒໓໔໕໖໗໘໙',
				or: '୦୧୨୩୪୫୬୭୮୯',
				kh: '០១២៣៤៥៦៧៨៩',
				pa: '੦੧੨੩੪੫੬੭੮੯',
				gu: '૦૧૨૩૪૫૬૭૮૯',
				hi: '०१२३४५६७८९',
				my: '၀၁၂၃၄၅၆၇၈၉',
				ta: '௦௧௨௩௪௫௬௭௮௯',
				te: '౦౧౨౩౪౫౬౭౮౯',
				th: '๐๑๒๓๔๕๖๗๘๙', // FIXME use iso 639 codes
				bo: '༠༡༢༣༤༥༦༧༨༩' // FIXME use iso 639 codes
			};

			if ( !tables[ language ] ) {
				return false;
			}

			return tables[ language ].split( '' );
		}
	};

	$.extend( $.i18n.languages, {
		'default': language
	} );
}( jQuery ) );


/***/ }),

/***/ 39161:
/*!*********************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.bidi.js ***!
  \*********************************************************************/
/***/ (() => {

/*!
 * BIDI embedding support for jQuery.i18n
 *
 * Copyright (C) 2015, David Chan
 *
 * This code is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use this code
 * in commercial projects as long as the copyright header is left intact.
 * See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';
	var strongDirRegExp;

	/**
	 * Matches the first strong directionality codepoint:
	 * - in group 1 if it is LTR
	 * - in group 2 if it is RTL
	 * Does not match if there is no strong directionality codepoint.
	 *
	 * Generated by UnicodeJS (see tools/strongDir) from the UCD; see
	 * https://phabricator.wikimedia.org/diffusion/GUJS/ .
	 */
	strongDirRegExp = new RegExp(
		'(?:' +
			'(' +
				'[\u0041-\u005a\u0061-\u007a\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u02bb-\u02c1\u02d0\u02d1\u02e0-\u02e4\u02ee\u0370-\u0373\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0482\u048a-\u052f\u0531-\u0556\u0559-\u055f\u0561-\u0587\u0589\u0903-\u0939\u093b\u093d-\u0940\u0949-\u094c\u094e-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd-\u09c0\u09c7\u09c8\u09cb\u09cc\u09ce\u09d7\u09dc\u09dd\u09df-\u09e1\u09e6-\u09f1\u09f4-\u09fa\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3e-\u0a40\u0a59-\u0a5c\u0a5e\u0a66-\u0a6f\u0a72-\u0a74\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd-\u0ac0\u0ac9\u0acb\u0acc\u0ad0\u0ae0\u0ae1\u0ae6-\u0af0\u0af9\u0b02\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b3e\u0b40\u0b47\u0b48\u0b4b\u0b4c\u0b57\u0b5c\u0b5d\u0b5f-\u0b61\u0b66-\u0b77\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe\u0bbf\u0bc1\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcc\u0bd0\u0bd7\u0be6-\u0bf2\u0c01-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c41-\u0c44\u0c58-\u0c5a\u0c60\u0c61\u0c66-\u0c6f\u0c7f\u0c82\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd-\u0cc4\u0cc6-\u0cc8\u0cca\u0ccb\u0cd5\u0cd6\u0cde\u0ce0\u0ce1\u0ce6-\u0cef\u0cf1\u0cf2\u0d02\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d40\u0d46-\u0d48\u0d4a-\u0d4c\u0d4e\u0d57\u0d5f-\u0d61\u0d66-\u0d75\u0d79-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dcf-\u0dd1\u0dd8-\u0ddf\u0de6-\u0def\u0df2-\u0df4\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e4f-\u0e5b\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0ed0-\u0ed9\u0edc-\u0edf\u0f00-\u0f17\u0f1a-\u0f34\u0f36\u0f38\u0f3e-\u0f47\u0f49-\u0f6c\u0f7f\u0f85\u0f88-\u0f8c\u0fbe-\u0fc5\u0fc7-\u0fcc\u0fce-\u0fda\u1000-\u102c\u1031\u1038\u103b\u103c\u103f-\u1057\u105a-\u105d\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108c\u108e-\u109c\u109e-\u10c5\u10c7\u10cd\u10d0-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1360-\u137c\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u167f\u1681-\u169a\u16a0-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1735\u1736\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17b6\u17be-\u17c5\u17c7\u17c8\u17d4-\u17da\u17dc\u17e0-\u17e9\u1810-\u1819\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1923-\u1926\u1929-\u192b\u1930\u1931\u1933-\u1938\u1946-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u19d0-\u19da\u1a00-\u1a16\u1a19\u1a1a\u1a1e-\u1a55\u1a57\u1a61\u1a63\u1a64\u1a6d-\u1a72\u1a80-\u1a89\u1a90-\u1a99\u1aa0-\u1aad\u1b04-\u1b33\u1b35\u1b3b\u1b3d-\u1b41\u1b43-\u1b4b\u1b50-\u1b6a\u1b74-\u1b7c\u1b82-\u1ba1\u1ba6\u1ba7\u1baa\u1bae-\u1be5\u1be7\u1bea-\u1bec\u1bee\u1bf2\u1bf3\u1bfc-\u1c2b\u1c34\u1c35\u1c3b-\u1c49\u1c4d-\u1c7f\u1cc0-\u1cc7\u1cd3\u1ce1\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u200e\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u214f\u2160-\u2188\u2336-\u237a\u2395\u249c-\u24e9\u26ac\u2800-\u28ff\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d70\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u302e\u302f\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u3190-\u31ba\u31f0-\u321c\u3220-\u324f\u3260-\u327b\u327f-\u32b0\u32c0-\u32cb\u32d0-\u32fe\u3300-\u3376\u337b-\u33dd\u33e0-\u33fe\u3400-\u4db5\u4e00-\u9fd5\ua000-\ua48c\ua4d0-\ua60c\ua610-\ua62b\ua640-\ua66e\ua680-\ua69d\ua6a0-\ua6ef\ua6f2-\ua6f7\ua722-\ua787\ua789-\ua7ad\ua7b0-\ua7b7\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua824\ua827\ua830-\ua837\ua840-\ua873\ua880-\ua8c3\ua8ce-\ua8d9\ua8f2-\ua8fd\ua900-\ua925\ua92e-\ua946\ua952\ua953\ua95f-\ua97c\ua983-\ua9b2\ua9b4\ua9b5\ua9ba\ua9bb\ua9bd-\ua9cd\ua9cf-\ua9d9\ua9de-\ua9e4\ua9e6-\ua9fe\uaa00-\uaa28\uaa2f\uaa30\uaa33\uaa34\uaa40-\uaa42\uaa44-\uaa4b\uaa4d\uaa50-\uaa59\uaa5c-\uaa7b\uaa7d-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaaeb\uaaee-\uaaf5\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab65\uab70-\uabe4\uabe6\uabe7\uabe9-\uabec\uabf0-\uabf9\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\ue000-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]|\ud800[\udc00-\udc0b]|\ud800[\udc0d-\udc26]|\ud800[\udc28-\udc3a]|\ud800\udc3c|\ud800\udc3d|\ud800[\udc3f-\udc4d]|\ud800[\udc50-\udc5d]|\ud800[\udc80-\udcfa]|\ud800\udd00|\ud800\udd02|\ud800[\udd07-\udd33]|\ud800[\udd37-\udd3f]|\ud800[\uddd0-\uddfc]|\ud800[\ude80-\ude9c]|\ud800[\udea0-\uded0]|\ud800[\udf00-\udf23]|\ud800[\udf30-\udf4a]|\ud800[\udf50-\udf75]|\ud800[\udf80-\udf9d]|\ud800[\udf9f-\udfc3]|\ud800[\udfc8-\udfd5]|\ud801[\udc00-\udc9d]|\ud801[\udca0-\udca9]|\ud801[\udd00-\udd27]|\ud801[\udd30-\udd63]|\ud801\udd6f|\ud801[\ude00-\udf36]|\ud801[\udf40-\udf55]|\ud801[\udf60-\udf67]|\ud804\udc00|\ud804[\udc02-\udc37]|\ud804[\udc47-\udc4d]|\ud804[\udc66-\udc6f]|\ud804[\udc82-\udcb2]|\ud804\udcb7|\ud804\udcb8|\ud804[\udcbb-\udcc1]|\ud804[\udcd0-\udce8]|\ud804[\udcf0-\udcf9]|\ud804[\udd03-\udd26]|\ud804\udd2c|\ud804[\udd36-\udd43]|\ud804[\udd50-\udd72]|\ud804[\udd74-\udd76]|\ud804[\udd82-\uddb5]|\ud804[\uddbf-\uddc9]|\ud804\uddcd|\ud804[\uddd0-\udddf]|\ud804[\udde1-\uddf4]|\ud804[\ude00-\ude11]|\ud804[\ude13-\ude2e]|\ud804\ude32|\ud804\ude33|\ud804\ude35|\ud804[\ude38-\ude3d]|\ud804[\ude80-\ude86]|\ud804\ude88|\ud804[\ude8a-\ude8d]|\ud804[\ude8f-\ude9d]|\ud804[\ude9f-\udea9]|\ud804[\udeb0-\udede]|\ud804[\udee0-\udee2]|\ud804[\udef0-\udef9]|\ud804\udf02|\ud804\udf03|\ud804[\udf05-\udf0c]|\ud804\udf0f|\ud804\udf10|\ud804[\udf13-\udf28]|\ud804[\udf2a-\udf30]|\ud804\udf32|\ud804\udf33|\ud804[\udf35-\udf39]|\ud804[\udf3d-\udf3f]|\ud804[\udf41-\udf44]|\ud804\udf47|\ud804\udf48|\ud804[\udf4b-\udf4d]|\ud804\udf50|\ud804\udf57|\ud804[\udf5d-\udf63]|\ud805[\udc80-\udcb2]|\ud805\udcb9|\ud805[\udcbb-\udcbe]|\ud805\udcc1|\ud805[\udcc4-\udcc7]|\ud805[\udcd0-\udcd9]|\ud805[\udd80-\uddb1]|\ud805[\uddb8-\uddbb]|\ud805\uddbe|\ud805[\uddc1-\udddb]|\ud805[\ude00-\ude32]|\ud805\ude3b|\ud805\ude3c|\ud805\ude3e|\ud805[\ude41-\ude44]|\ud805[\ude50-\ude59]|\ud805[\ude80-\udeaa]|\ud805\udeac|\ud805\udeae|\ud805\udeaf|\ud805\udeb6|\ud805[\udec0-\udec9]|\ud805[\udf00-\udf19]|\ud805\udf20|\ud805\udf21|\ud805\udf26|\ud805[\udf30-\udf3f]|\ud806[\udca0-\udcf2]|\ud806\udcff|\ud806[\udec0-\udef8]|\ud808[\udc00-\udf99]|\ud809[\udc00-\udc6e]|\ud809[\udc70-\udc74]|\ud809[\udc80-\udd43]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud811[\udc00-\ude46]|\ud81a[\udc00-\ude38]|\ud81a[\ude40-\ude5e]|\ud81a[\ude60-\ude69]|\ud81a\ude6e|\ud81a\ude6f|\ud81a[\uded0-\udeed]|\ud81a\udef5|\ud81a[\udf00-\udf2f]|\ud81a[\udf37-\udf45]|\ud81a[\udf50-\udf59]|\ud81a[\udf5b-\udf61]|\ud81a[\udf63-\udf77]|\ud81a[\udf7d-\udf8f]|\ud81b[\udf00-\udf44]|\ud81b[\udf50-\udf7e]|\ud81b[\udf93-\udf9f]|\ud82c\udc00|\ud82c\udc01|\ud82f[\udc00-\udc6a]|\ud82f[\udc70-\udc7c]|\ud82f[\udc80-\udc88]|\ud82f[\udc90-\udc99]|\ud82f\udc9c|\ud82f\udc9f|\ud834[\udc00-\udcf5]|\ud834[\udd00-\udd26]|\ud834[\udd29-\udd66]|\ud834[\udd6a-\udd72]|\ud834\udd83|\ud834\udd84|\ud834[\udd8c-\udda9]|\ud834[\uddae-\udde8]|\ud834[\udf60-\udf71]|\ud835[\udc00-\udc54]|\ud835[\udc56-\udc9c]|\ud835\udc9e|\ud835\udc9f|\ud835\udca2|\ud835\udca5|\ud835\udca6|\ud835[\udca9-\udcac]|\ud835[\udcae-\udcb9]|\ud835\udcbb|\ud835[\udcbd-\udcc3]|\ud835[\udcc5-\udd05]|\ud835[\udd07-\udd0a]|\ud835[\udd0d-\udd14]|\ud835[\udd16-\udd1c]|\ud835[\udd1e-\udd39]|\ud835[\udd3b-\udd3e]|\ud835[\udd40-\udd44]|\ud835\udd46|\ud835[\udd4a-\udd50]|\ud835[\udd52-\udea5]|\ud835[\udea8-\udeda]|\ud835[\udedc-\udf14]|\ud835[\udf16-\udf4e]|\ud835[\udf50-\udf88]|\ud835[\udf8a-\udfc2]|\ud835[\udfc4-\udfcb]|\ud836[\udc00-\uddff]|\ud836[\ude37-\ude3a]|\ud836[\ude6d-\ude74]|\ud836[\ude76-\ude83]|\ud836[\ude85-\ude8b]|\ud83c[\udd10-\udd2e]|\ud83c[\udd30-\udd69]|\ud83c[\udd70-\udd9a]|\ud83c[\udde6-\ude02]|\ud83c[\ude10-\ude3a]|\ud83c[\ude40-\ude48]|\ud83c\ude50|\ud83c\ude51|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6]|\ud869[\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34]|\ud86d[\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud86e[\udc20-\udfff]|[\ud86f-\ud872][\udc00-\udfff]|\ud873[\udc00-\udea1]|\ud87e[\udc00-\ude1d]|[\udb80-\udbbe][\udc00-\udfff]|\udbbf[\udc00-\udffd]|[\udbc0-\udbfe][\udc00-\udfff]|\udbff[\udc00-\udffd]' +
			')|(' +
				'[\u0590\u05be\u05c0\u05c3\u05c6\u05c8-\u05ff\u07c0-\u07ea\u07f4\u07f5\u07fa-\u0815\u081a\u0824\u0828\u082e-\u0858\u085c-\u089f\u200f\ufb1d\ufb1f-\ufb28\ufb2a-\ufb4f\u0608\u060b\u060d\u061b-\u064a\u066d-\u066f\u0671-\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u0710\u0712-\u072f\u074b-\u07a5\u07b1-\u07bf\u08a0-\u08e2\ufb50-\ufd3d\ufd40-\ufdcf\ufdf0-\ufdfc\ufdfe\ufdff\ufe70-\ufefe]|\ud802[\udc00-\udd1e]|\ud802[\udd20-\ude00]|\ud802\ude04|\ud802[\ude07-\ude0b]|\ud802[\ude10-\ude37]|\ud802[\ude3b-\ude3e]|\ud802[\ude40-\udee4]|\ud802[\udee7-\udf38]|\ud802[\udf40-\udfff]|\ud803[\udc00-\ude5f]|\ud803[\ude7f-\udfff]|\ud83a[\udc00-\udccf]|\ud83a[\udcd7-\udfff]|\ud83b[\udc00-\uddff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\udf00-\udfff]|\ud83b[\ude00-\udeef]|\ud83b[\udef2-\udeff]' +
			')' +
		')'
	);

	/**
	 * Gets directionality of the first strongly directional codepoint
	 *
	 * This is the rule the BIDI algorithm uses to determine the directionality of
	 * paragraphs ( http://unicode.org/reports/tr9/#The_Paragraph_Level ) and
	 * FSI isolates ( http://unicode.org/reports/tr9/#Explicit_Directional_Isolates ).
	 *
	 * TODO: Does not handle BIDI control characters inside the text.
	 * TODO: Does not handle unallocated characters.
	 *
	 * @param {string} text The text from which to extract initial directionality.
	 * @return {string} Directionality (either 'ltr' or 'rtl')
	 */
	function strongDirFromContent( text ) {
		var m = text.match( strongDirRegExp );
		if ( !m ) {
			return null;
		}
		if ( m[ 2 ] === undefined ) {
			return 'ltr';
		}
		return 'rtl';
	}

	$.extend( $.i18n.parser.emitter, {
		/**
		 * Wraps argument with unicode control characters for directionality safety
		 *
		 * This solves the problem where directionality-neutral characters at the edge of
		 * the argument string get interpreted with the wrong directionality from the
		 * enclosing context, giving renderings that look corrupted like "(Ben_(WMF".
		 *
		 * The wrapping is LRE...PDF or RLE...PDF, depending on the detected
		 * directionality of the argument string, using the BIDI algorithm's own "First
		 * strong directional codepoint" rule. Essentially, this works round the fact that
		 * there is no embedding equivalent of U+2068 FSI (isolation with heuristic
		 * direction inference). The latter is cleaner but still not widely supported.
		 *
		 * @param {string[]} nodes The text nodes from which to take the first item.
		 * @return {string} Wrapped String of content as needed.
		 */
		bidi: function ( nodes ) {
			var dir = strongDirFromContent( nodes[ 0 ] );
			if ( dir === 'ltr' ) {
				// Wrap in LEFT-TO-RIGHT EMBEDDING ... POP DIRECTIONAL FORMATTING
				return '\u202A' + nodes[ 0 ] + '\u202C';
			}
			if ( dir === 'rtl' ) {
				// Wrap in RIGHT-TO-LEFT EMBEDDING ... POP DIRECTIONAL FORMATTING
				return '\u202B' + nodes[ 0 ] + '\u202C';
			}
			// No strong directionality: do not wrap
			return nodes[ 0 ];
		}
	} );
}( jQuery ) );


/***/ }),

/***/ 41669:
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = jQuery;

/***/ }),

/***/ 45631:
/*!**************************************************!*\
  !*** ./runestone/common/css/presenter_mode.less ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 46905:
/*!****************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.js ***!
  \****************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2011-2013 Santhosh Thottingal, Neil Kandalgaonkar
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageParserEmitter = function () {
		this.language = $.i18n.languages[ String.locale ] || $.i18n.languages[ 'default' ];
	};

	MessageParserEmitter.prototype = {
		constructor: MessageParserEmitter,

		/**
		 * (We put this method definition here, and not in prototype, to make
		 * sure it's not overwritten by any magic.) Walk entire node structure,
		 * applying replacements and template functions when appropriate
		 *
		 * @param {Mixed} node abstract syntax tree (top node or subnode)
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {Mixed} single-string node or array of nodes suitable for
		 *  jQuery appending.
		 */
		emit: function ( node, replacements ) {
			var ret, subnodes, operation,
				messageParserEmitter = this;

			switch ( typeof node ) {
				case 'string':
				case 'number':
					ret = node;
					break;
				case 'object':
				// node is an array of nodes
					subnodes = $.map( node.slice( 1 ), function ( n ) {
						return messageParserEmitter.emit( n, replacements );
					} );

					operation = node[ 0 ].toLowerCase();

					if ( typeof messageParserEmitter[ operation ] === 'function' ) {
						ret = messageParserEmitter[ operation ]( subnodes, replacements );
					} else {
						throw new Error( 'unknown operation "' + operation + '"' );
					}

					break;
				case 'undefined':
				// Parsing the empty string (as an entire expression, or as a
				// paramExpression in a template) results in undefined
				// Perhaps a more clever parser can detect this, and return the
				// empty string? Or is that useful information?
				// The logical thing is probably to return the empty string here
				// when we encounter undefined.
					ret = '';
					break;
				default:
					throw new Error( 'unexpected type in AST: ' + typeof node );
			}

			return ret;
		},

		/**
		 * Parsing has been applied depth-first we can assume that all nodes
		 * here are single nodes Must return a single node to parents -- a
		 * jQuery with synthetic span However, unwrap any other synthetic spans
		 * in our children and pass them upwards
		 *
		 * @param {Array} nodes Mixed, some single nodes, some arrays of nodes.
		 * @return {string}
		 */
		concat: function ( nodes ) {
			var result = '';

			$.each( nodes, function ( i, node ) {
				// strings, integers, anything else
				result += node;
			} );

			return result;
		},

		/**
		 * Return escaped replacement of correct index, or string if
		 * unavailable. Note that we expect the parsed parameter to be
		 * zero-based. i.e. $1 should have become [ 0 ]. if the specified
		 * parameter is not found return the same string (e.g. "$99" ->
		 * parameter 98 -> not found -> return "$99" ) TODO throw error if
		 * nodes.length > 1 ?
		 *
		 * @param {Array} nodes One element, integer, n >= 0
		 * @param {Array} replacements for $1, $2, ... $n
		 * @return {string} replacement
		 */
		replace: function ( nodes, replacements ) {
			var index = parseInt( nodes[ 0 ], 10 );

			if ( index < replacements.length ) {
				// replacement is not a string, don't touch!
				return replacements[ index ];
			} else {
				// index not found, fallback to displaying variable
				return '$' + ( index + 1 );
			}
		},

		/**
		 * Transform parsed structure into pluralization n.b. The first node may
		 * be a non-integer (for instance, a string representing an Arabic
		 * number). So convert it back with the current language's
		 * convertNumber.
		 *
		 * @param {Array} nodes List [ {String|Number}, {String}, {String} ... ]
		 * @return {string} selected pluralized form according to current
		 *  language.
		 */
		plural: function ( nodes ) {
			var count = parseFloat( this.language.convertNumber( nodes[ 0 ], 10 ) ),
				forms = nodes.slice( 1 );

			return forms.length ? this.language.convertPlural( count, forms ) : '';
		},

		/**
		 * Transform parsed structure into gender Usage
		 * {{gender:gender|masculine|feminine|neutral}}.
		 *
		 * @param {Array} nodes List [ {String}, {String}, {String} , {String} ]
		 * @return {string} selected gender form according to current language
		 */
		gender: function ( nodes ) {
			var gender = nodes[ 0 ],
				forms = nodes.slice( 1 );

			return this.language.gender( gender, forms );
		},

		/**
		 * Transform parsed structure into grammar conversion. Invoked by
		 * putting {{grammar:form|word}} in a message
		 *
		 * @param {Array} nodes List [{Grammar case eg: genitive}, {String word}]
		 * @return {string} selected grammatical form according to current
		 *  language.
		 */
		grammar: function ( nodes ) {
			var form = nodes[ 0 ],
				word = nodes[ 1 ];

			return word && form && this.language.convertGrammar( word, form );
		}
	};

	$.extend( $.i18n.parser.emitter, new MessageParserEmitter() );
}( jQuery ) );


/***/ }),

/***/ 49276:
/*!***************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.parser.js ***!
  \***************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2011-2013 Santhosh Thottingal, Neil Kandalgaonkar
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageParser = function ( options ) {
		this.options = $.extend( {}, $.i18n.parser.defaults, options );
		this.language = $.i18n.languages[ String.locale ] || $.i18n.languages[ 'default' ];
		this.emitter = $.i18n.parser.emitter;
	};

	MessageParser.prototype = {

		constructor: MessageParser,

		simpleParse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;

				return parameters[ index ] !== undefined ? parameters[ index ] : '$' + match;
			} );
		},

		parse: function ( message, replacements ) {
			if ( message.indexOf( '{{' ) < 0 ) {
				return this.simpleParse( message, replacements );
			}

			this.emitter.language = $.i18n.languages[ $.i18n().locale ] ||
				$.i18n.languages[ 'default' ];

			return this.emitter.emit( this.ast( message ), replacements );
		},

		ast: function ( message ) {
			var pipe, colon, backslash, anyCharacter, dollar, digits, regularLiteral,
				regularLiteralWithoutBar, regularLiteralWithoutSpace, escapedOrLiteralWithoutBar,
				escapedOrRegularLiteral, templateContents, templateName, openTemplate,
				closeTemplate, expression, paramExpression, result,
				pos = 0;

			// Try parsers until one works, if none work return null
			function choice( parserSyntax ) {
				return function () {
					var i, result;

					for ( i = 0; i < parserSyntax.length; i++ ) {
						result = parserSyntax[ i ]();

						if ( result !== null ) {
							return result;
						}
					}

					return null;
				};
			}

			// Try several parserSyntax-es in a row.
			// All must succeed; otherwise, return null.
			// This is the only eager one.
			function sequence( parserSyntax ) {
				var i, res,
					originalPos = pos,
					result = [];

				for ( i = 0; i < parserSyntax.length; i++ ) {
					res = parserSyntax[ i ]();

					if ( res === null ) {
						pos = originalPos;

						return null;
					}

					result.push( res );
				}

				return result;
			}

			// Run the same parser over and over until it fails.
			// Must succeed a minimum of n times; otherwise, return null.
			function nOrMore( n, p ) {
				return function () {
					var originalPos = pos,
						result = [],
						parsed = p();

					while ( parsed !== null ) {
						result.push( parsed );
						parsed = p();
					}

					if ( result.length < n ) {
						pos = originalPos;

						return null;
					}

					return result;
				};
			}

			// Helpers -- just make parserSyntax out of simpler JS builtin types

			function makeStringParser( s ) {
				var len = s.length;

				return function () {
					var result = null;

					if ( message.slice( pos, pos + len ) === s ) {
						result = s;
						pos += len;
					}

					return result;
				};
			}

			function makeRegexParser( regex ) {
				return function () {
					var matches = message.slice( pos ).match( regex );

					if ( matches === null ) {
						return null;
					}

					pos += matches[ 0 ].length;

					return matches[ 0 ];
				};
			}

			pipe = makeStringParser( '|' );
			colon = makeStringParser( ':' );
			backslash = makeStringParser( '\\' );
			anyCharacter = makeRegexParser( /^./ );
			dollar = makeStringParser( '$' );
			digits = makeRegexParser( /^\d+/ );
			regularLiteral = makeRegexParser( /^[^{}[\]$\\]/ );
			regularLiteralWithoutBar = makeRegexParser( /^[^{}[\]$\\|]/ );
			regularLiteralWithoutSpace = makeRegexParser( /^[^{}[\]$\s]/ );

			// There is a general pattern:
			// parse a thing;
			// if it worked, apply transform,
			// otherwise return null.
			// But using this as a combinator seems to cause problems
			// when combined with nOrMore().
			// May be some scoping issue.
			function transform( p, fn ) {
				return function () {
					var result = p();

					return result === null ? null : fn( result );
				};
			}

			// Used to define "literals" within template parameters. The pipe
			// character is the parameter delimeter, so by default
			// it is not a literal in the parameter
			function literalWithoutBar() {
				var result = nOrMore( 1, escapedOrLiteralWithoutBar )();

				return result === null ? null : result.join( '' );
			}

			function literal() {
				var result = nOrMore( 1, escapedOrRegularLiteral )();

				return result === null ? null : result.join( '' );
			}

			function escapedLiteral() {
				var result = sequence( [ backslash, anyCharacter ] );

				return result === null ? null : result[ 1 ];
			}

			choice( [ escapedLiteral, regularLiteralWithoutSpace ] );
			escapedOrLiteralWithoutBar = choice( [ escapedLiteral, regularLiteralWithoutBar ] );
			escapedOrRegularLiteral = choice( [ escapedLiteral, regularLiteral ] );

			function replacement() {
				var result = sequence( [ dollar, digits ] );

				if ( result === null ) {
					return null;
				}

				return [ 'REPLACE', parseInt( result[ 1 ], 10 ) - 1 ];
			}

			templateName = transform(
				// see $wgLegalTitleChars
				// not allowing : due to the need to catch "PLURAL:$1"
				makeRegexParser( /^[ !"$&'()*,./0-9;=?@A-Z^_`a-z~\x80-\xFF+-]+/ ),

				function ( result ) {
					return result.toString();
				}
			);

			function templateParam() {
				var expr,
					result = sequence( [ pipe, nOrMore( 0, paramExpression ) ] );

				if ( result === null ) {
					return null;
				}

				expr = result[ 1 ];

				// use a "CONCAT" operator if there are multiple nodes,
				// otherwise return the first node, raw.
				return expr.length > 1 ? [ 'CONCAT' ].concat( expr ) : expr[ 0 ];
			}

			function templateWithReplacement() {
				var result = sequence( [ templateName, colon, replacement ] );

				return result === null ? null : [ result[ 0 ], result[ 2 ] ];
			}

			function templateWithOutReplacement() {
				var result = sequence( [ templateName, colon, paramExpression ] );

				return result === null ? null : [ result[ 0 ], result[ 2 ] ];
			}

			templateContents = choice( [
				function () {
					var res = sequence( [
						// templates can have placeholders for dynamic
						// replacement eg: {{PLURAL:$1|one car|$1 cars}}
						// or no placeholders eg:
						// {{GRAMMAR:genitive|{{SITENAME}}}
						choice( [ templateWithReplacement, templateWithOutReplacement ] ),
						nOrMore( 0, templateParam )
					] );

					return res === null ? null : res[ 0 ].concat( res[ 1 ] );
				},
				function () {
					var res = sequence( [ templateName, nOrMore( 0, templateParam ) ] );

					if ( res === null ) {
						return null;
					}

					return [ res[ 0 ] ].concat( res[ 1 ] );
				}
			] );

			openTemplate = makeStringParser( '{{' );
			closeTemplate = makeStringParser( '}}' );

			function template() {
				var result = sequence( [ openTemplate, templateContents, closeTemplate ] );

				return result === null ? null : result[ 1 ];
			}

			expression = choice( [ template, replacement, literal ] );
			paramExpression = choice( [ template, replacement, literalWithoutBar ] );

			function start() {
				var result = nOrMore( 0, expression )();

				if ( result === null ) {
					return null;
				}

				return [ 'CONCAT' ].concat( result );
			}

			result = start();

			/*
			 * For success, the pos must have gotten to the end of the input
			 * and returned a non-null.
			 * n.b. This is part of language infrastructure, so we do not throw an
			 * internationalizable message.
			 */
			if ( result === null || pos !== message.length ) {
				throw new Error( 'Parse error at position ' + pos.toString() + ' in input: ' + message );
			}

			return result;
		}

	};

	$.extend( $.i18n.parser, new MessageParser() );
}( jQuery ) );

/***/ }),

/***/ 51399:
/*!*********************************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.messagestore.js ***!
  \*********************************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library - Message Store
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do anything special to
 * choose one license or the other and you don't have to notify anyone which license you are using.
 * You are free to use UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var MessageStore = function () {
		this.messages = {};
		this.sources = {};
	};

	function jsonMessageLoader( url ) {
		var deferred = $.Deferred();

		$.getJSON( url )
			.done( deferred.resolve )
			.fail( function ( jqxhr, settings, exception ) {
				$.i18n.log( 'Error in loading messages from ' + url + ' Exception: ' + exception );
				// Ignore 404 exception, because we are handling fallabacks explicitly
				deferred.resolve();
			} );

		return deferred.promise();
	}

	/**
	 * See https://github.com/wikimedia/jquery.i18n/wiki/Specification#wiki-Message_File_Loading
	 */
	MessageStore.prototype = {

		/**
		 * General message loading API This can take a URL string for
		 * the json formatted messages.
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * This can also load a localization file for a locale <code>
		 * load( 'path/to/de-messages.json', 'de' );
		 * </code>
		 * A data object containing message key- message translation mappings
		 * can also be passed Eg:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code> If the data argument is
		 * null/undefined/false,
		 * all cached messages for the i18n instance will get reset.
		 *
		 * @param {string|Object} source
		 * @param {string} locale Language tag
		 * @return {jQuery.Promise}
		 */
		load: function ( source, locale ) {
			var key = null,
				deferred = null,
				deferreds = [],
				messageStore = this;

			if ( typeof source === 'string' ) {
				// This is a URL to the messages file.
				$.i18n.log( 'Loading messages from: ' + source );
				deferred = jsonMessageLoader( source )
					.done( function ( localization ) {
						messageStore.set( locale, localization );
					} );

				return deferred.promise();
			}

			if ( locale ) {
				// source is an key-value pair of messages for given locale
				messageStore.set( locale, source );

				return $.Deferred().resolve();
			} else {
				// source is a key-value pair of locales and their source
				for ( key in source ) {
					if ( Object.prototype.hasOwnProperty.call( source, key ) ) {
						locale = key;
						// No {locale} given, assume data is a group of languages,
						// call this function again for each language.
						deferreds.push( messageStore.load( source[ key ], locale ) );
					}
				}
				return $.when.apply( $, deferreds );
			}

		},

		/**
		 * Set messages to the given locale.
		 * If locale exists, add messages to the locale.
		 *
		 * @param {string} locale
		 * @param {Object} messages
		 */
		set: function ( locale, messages ) {
			if ( !this.messages[ locale ] ) {
				this.messages[ locale ] = messages;
			} else {
				this.messages[ locale ] = $.extend( this.messages[ locale ], messages );
			}
		},

		/**
		 *
		 * @param {string} locale
		 * @param {string} messageKey
		 * @return {boolean}
		 */
		get: function ( locale, messageKey ) {
			return this.messages[ locale ] && this.messages[ locale ][ messageKey ];
		}
	};

	$.extend( $.i18n.messageStore, new MessageStore() );
}( jQuery ) );


/***/ }),

/***/ 52329:
/*!********************************************************!*\
  !*** ./runestone/common/js/jquery_i18n/jquery.i18n.js ***!
  \********************************************************/
/***/ (() => {

/*!
 * jQuery Internationalization library
 *
 * Copyright (C) 2012 Santhosh Thottingal
 *
 * jquery.i18n is dual licensed GPLv2 or later and MIT. You don't have to do
 * anything special to choose one license or the other and you don't have to
 * notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 * @licence GNU General Public Licence 2.0 or later
 * @licence MIT License
 */

( function ( $ ) {
	'use strict';

	var I18N,
		slice = Array.prototype.slice;
	/**
	 * @constructor
	 * @param {Object} options
	 */
	I18N = function ( options ) {
		// Load defaults
		this.options = $.extend( {}, I18N.defaults, options );

		this.parser = this.options.parser;
		this.locale = this.options.locale;
		this.messageStore = this.options.messageStore;
		this.languages = {};
	};

	I18N.prototype = {
		/**
		 * Localize a given messageKey to a locale.
		 * @param {String} messageKey
		 * @return {String} Localized message
		 */
		localize: function ( messageKey ) {
			var localeParts, localePartIndex, locale, fallbackIndex,
				tryingLocale, message;

			locale = this.locale;
			fallbackIndex = 0;

			while ( locale ) {
				// Iterate through locales starting at most-specific until
				// localization is found. As in fi-Latn-FI, fi-Latn and fi.
				localeParts = locale.split( '-' );
				localePartIndex = localeParts.length;

				do {
					tryingLocale = localeParts.slice( 0, localePartIndex ).join( '-' );
					message = this.messageStore.get( tryingLocale, messageKey );

					if ( message ) {
						return message;
					}

					localePartIndex--;
				} while ( localePartIndex );

				if ( locale === 'en' ) {
					break;
				}

				locale = ( $.i18n.fallbacks[ this.locale ] &&
						$.i18n.fallbacks[ this.locale ][ fallbackIndex ] ) ||
						this.options.fallbackLocale;
				$.i18n.log( 'Trying fallback locale for ' + this.locale + ': ' + locale + ' (' + messageKey + ')' );

				fallbackIndex++;
			}

			// key not found
			return '';
		},

		/*
		 * Destroy the i18n instance.
		 */
		destroy: function () {
			$.removeData( document, 'i18n' );
		},

		/**
		 * General message loading API This can take a URL string for
		 * the json formatted messages. Example:
		 * <code>load('path/to/all_localizations.json');</code>
		 *
		 * To load a localization file for a locale:
		 * <code>
		 * load('path/to/de-messages.json', 'de' );
		 * </code>
		 *
		 * To load a localization file from a directory:
		 * <code>
		 * load('path/to/i18n/directory', 'de' );
		 * </code>
		 * The above method has the advantage of fallback resolution.
		 * ie, it will automatically load the fallback locales for de.
		 * For most usecases, this is the recommended method.
		 * It is optional to have trailing slash at end.
		 *
		 * A data object containing message key- message translation mappings
		 * can also be passed. Example:
		 * <code>
		 * load( { 'hello' : 'Hello' }, optionalLocale );
		 * </code>
		 *
		 * A source map containing key-value pair of languagename and locations
		 * can also be passed. Example:
		 * <code>
		 * load( {
		 * bn: 'i18n/bn.json',
		 * he: 'i18n/he.json',
		 * en: 'i18n/en.json'
		 * } )
		 * </code>
		 *
		 * If the data argument is null/undefined/false,
		 * all cached messages for the i18n instance will get reset.
		 *
		 * @param {string|Object} source
		 * @param {string} locale Language tag
		 * @return {jQuery.Promise}
		 */
		load: function ( source, locale ) {
			var fallbackLocales, locIndex, fallbackLocale, sourceMap = {};
			if ( !source && !locale ) {
				source = 'i18n/' + $.i18n().locale + '.json';
				locale = $.i18n().locale;
			}
			if ( typeof source === 'string' &&
				// source extension should be json, but can have query params after that.
				source.split( '?' )[ 0 ].split( '.' ).pop() !== 'json'
			) {
				// Load specified locale then check for fallbacks when directory is
				// specified in load()
				sourceMap[ locale ] = source + '/' + locale + '.json';
				fallbackLocales = ( $.i18n.fallbacks[ locale ] || [] )
					.concat( this.options.fallbackLocale );
				for ( locIndex = 0; locIndex < fallbackLocales.length; locIndex++ ) {
					fallbackLocale = fallbackLocales[ locIndex ];
					sourceMap[ fallbackLocale ] = source + '/' + fallbackLocale + '.json';
				}
				return this.load( sourceMap );
			} else {
				return this.messageStore.load( source, locale );
			}

		},

		/**
		 * Does parameter and magic word substitution.
		 *
		 * @param {string} key Message key
		 * @param {Array} parameters Message parameters
		 * @return {string}
		 */
		parse: function ( key, parameters ) {
			var message = this.localize( key );
			// FIXME: This changes the state of the I18N object,
			// should probably not change the 'this.parser' but just
			// pass it to the parser.
			this.parser.language = $.i18n.languages[ $.i18n().locale ] || $.i18n.languages[ 'default' ];
			if ( message === '' ) {
				message = key;
			}
			return this.parser.parse( message, parameters );
		}
	};

	/**
	 * Process a message from the $.I18N instance
	 * for the current document, stored in jQuery.data(document).
	 *
	 * @param {string} key Key of the message.
	 * @param {string} param1 [param...] Variadic list of parameters for {key}.
	 * @return {string|$.I18N} Parsed message, or if no key was given
	 * the instance of $.I18N is returned.
	 */
	$.i18n = function ( key, param1 ) {
		var parameters,
			i18n = $.data( document, 'i18n' ),
			options = typeof key === 'object' && key;

		// If the locale option for this call is different then the setup so far,
		// update it automatically. This doesn't just change the context for this
		// call but for all future call as well.
		// If there is no i18n setup yet, don't do this. It will be taken care of
		// by the `new I18N` construction below.
		// NOTE: It should only change language for this one call.
		// Then cache instances of I18N somewhere.
		if ( options && options.locale && i18n && i18n.locale !== options.locale ) {
			i18n.locale = options.locale;
		}

		if ( !i18n ) {
			i18n = new I18N( options );
			$.data( document, 'i18n', i18n );
		}

		if ( typeof key === 'string' ) {
			if ( param1 !== undefined ) {
				parameters = slice.call( arguments, 1 );
			} else {
				parameters = [];
			}

			return i18n.parse( key, parameters );
		} else {
			// FIXME: remove this feature/bug.
			return i18n;
		}
	};

	$.fn.i18n = function () {
		var i18n = $.data( document, 'i18n' );

		if ( !i18n ) {
			i18n = new I18N();
			$.data( document, 'i18n', i18n );
		}

		return this.each( function () {
			var $this = $( this ),
				messageKey = $this.data( 'i18n' ),
				lBracket, rBracket, type, key;

			if ( messageKey ) {
				lBracket = messageKey.indexOf( '[' );
				rBracket = messageKey.indexOf( ']' );
				if ( lBracket !== -1 && rBracket !== -1 && lBracket < rBracket ) {
					type = messageKey.slice( lBracket + 1, rBracket );
					key = messageKey.slice( rBracket + 1 );
					if ( type === 'html' ) {
						$this.html( i18n.parse( key ) );
					} else {
						$this.attr( type, i18n.parse( key ) );
					}
				} else {
					$this.text( i18n.parse( messageKey ) );
				}
			} else {
				$this.find( '[data-i18n]' ).i18n();
			}
		} );
	};

	function getDefaultLocale() {
		var nav, locale = $( 'html' ).attr( 'lang' );

		if ( !locale ) {
			if ( typeof window.navigator !== undefined ) {
				nav = window.navigator;
				locale = nav.language || nav.userLanguage || '';
			} else {
				locale = '';
			}
		}
		return locale;
	}

	$.i18n.languages = {};
	$.i18n.messageStore = $.i18n.messageStore || {};
	$.i18n.parser = {
		// The default parser only handles variable substitution
		parse: function ( message, parameters ) {
			return message.replace( /\$(\d+)/g, function ( str, match ) {
				var index = parseInt( match, 10 ) - 1;
				return parameters[ index ] !== undefined ? parameters[ index ] : '$' + match;
			} );
		},
		emitter: {}
	};
	$.i18n.fallbacks = {};
	$.i18n.debug = false;
	$.i18n.log = function ( /* arguments */ ) {
		if ( window.console && $.i18n.debug ) {
			window.console.log.apply( window.console, arguments );
		}
	};
	/* Static members */
	I18N.defaults = {
		locale: getDefaultLocale(),
		fallbackLocale: 'en',
		parser: $.i18n.parser,
		messageStore: $.i18n.messageStore
	};

	// Expose constructor
	$.i18n.constructor = I18N;
}( jQuery ) );

/***/ }),

/***/ 59782:
/*!************************************************!*\
  !*** ./runestone/common/js/user-highlights.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _css_user_highlights_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css/user-highlights.css */ 77427);
/*global variable declarations*/





function getCompletions() {
    // Get the completion status
    if (
        window.location.href.match(
            /(\/index.html|toctree.html|genindex.html|navhelp.html|toc.html|assignments.html|Exercises.html)/
        )
    ) {
        return;
    }

    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?")
        );
    }
    var data = {
        lastPageUrl: currentPathname,
        isPtxBook: isPreTeXt(),
    };
    jQuery
        .ajax({
            url: `${eBookConfig.new_server_prefix}/logger/getCompletionStatus`,
            data: data,
            async: false,
        })
        .done(function (data) {
            if (data != "None") {
                var completionData = data.detail;
                var completionClass, completionMsg;
                if (completionData[0].completionStatus == 1) {
                    completionClass = "buttonConfirmCompletion";
                    completionMsg =
                        "<i class='glyphicon glyphicon-ok'></i> Completed. Well Done!";
                } else {
                    completionClass = "buttonAskCompletion";
                    completionMsg = "Mark as Completed";
                }
                let scp = document.querySelector("#scprogresscontainer");
                if (scp) {
                    scp.classList.add("ptx-runestone-container");
                }
                $("#scprogresscontainer").append(
                    '<div style="text-align:center"><button class="btn btn-lg ' +
                    completionClass +
                    '" id="completionButton">' +
                    completionMsg +
                    "</button></div>"
                );
            }
        });
}

function showLastPositionBanner() {
    var lastPositionVal = $.getUrlVar("lastPosition");
    if (typeof lastPositionVal !== "undefined") {
        $("body").append(
            '<img src="../_static/last-point.png" style="position:absolute; padding-top:55px; left: 10px; top: ' +
            parseInt(lastPositionVal) +
            'px;"/>'
        );
        $("html, body").animate({ scrollTop: parseInt(lastPositionVal) }, 1000);
    }
}

function addNavigationAndCompletionButtons() {
    if (
        window.location.href.match(
            /(index.html|genindex.html|navhelp.html|toc.html|assignments.html|Exercises.html|toctree.html)/
        )
    ) {
        return;
    }
    var navLinkBgRightHiddenPosition = -$("#navLinkBgRight").outerWidth() - 5;
    var navLinkBgRightHalfOpen;
    var navLinkBgRightFullOpen = 0;

    if ($("#completionButton").hasClass("buttonAskCompletion")) {
        navLinkBgRightHalfOpen = navLinkBgRightHiddenPosition + 70;
    } else if ($("#completionButton").hasClass("buttonConfirmCompletion")) {
        navLinkBgRightHalfOpen = 0;
    }
    var relationsNextIconInitialPosition = $("#relations-next").css("right");
    var relationsNextIconNewPosition = -(navLinkBgRightHiddenPosition + 35);

    $("#navLinkBgRight").css("right", navLinkBgRightHiddenPosition).show();
    var navBgShown = false;
    $(window).scroll(function () {
        if (
            $(window).scrollTop() + $(window).height() ==
            $(document).height()
        ) {
            $("#navLinkBgRight").animate(
                { right: navLinkBgRightHalfOpen },
                200
            );
            $("#navLinkBgLeft").animate({ left: "0px" }, 200);
            if ($("#completionButton").hasClass("buttonConfirmCompletion")) {
                $("#relations-next").animate(
                    { right: relationsNextIconNewPosition },
                    200
                );
            }
            navBgShown = true;
        } else if (navBgShown) {
            $("#navLinkBgRight").animate(
                { right: navLinkBgRightHiddenPosition },
                200
            );
            $("#navLinkBgLeft").animate({ left: "-65px" }, 200);
            $("#relations-next").animate({
                right: relationsNextIconInitialPosition,
            });
            navBgShown = false;
        }
    });

    var completionFlag = 0;
    if ($("#completionButton").hasClass("buttonAskCompletion")) {
        completionFlag = 0;
    } else {
        completionFlag = 1;
    }
    // Make sure we mark this page as visited regardless of how flakey
    // the onunload handlers become.
    processPageState(completionFlag, true, false, false);
    $("#completionButton").on("click", function () {
        var markingComplete = false;
        var markingIncomplete = false;
        if ($(this).hasClass("buttonAskCompletion")) {
            $(this)
                .removeClass("buttonAskCompletion")
                .addClass("buttonConfirmCompletion")
                .html(
                    "<i class='glyphicon glyphicon-ok'></i> Completed. Well Done!"
                );
            $("#navLinkBgRight").animate({ right: navLinkBgRightFullOpen });
            $("#relations-next").animate({
                right: relationsNextIconNewPosition,
            });
            navLinkBgRightHalfOpen = 0;
            completionFlag = 1;
            markingComplete = true;
        } else if ($(this).hasClass("buttonConfirmCompletion")) {
            $(this)
                .removeClass("buttonConfirmCompletion")
                .addClass("buttonAskCompletion")
                .html("Mark as Completed");
            navLinkBgRightHalfOpen = navLinkBgRightHiddenPosition + 70;
            $("#navLinkBgRight").animate({ right: navLinkBgRightHalfOpen });
            $("#relations-next").animate({
                right: relationsNextIconInitialPosition,
            });
            completionFlag = 0;
            markingIncomplete = true;
        }
        processPageState(
            completionFlag,
            false,
            markingComplete,
            markingIncomplete
        );
    });

    // we cannot afford to do this at both load and unload especially as users
    // go from page to page. This just doubles the load.  So, try without this one.
    // $(window).on("beforeunload", function (e) {
    //     if (completionFlag == 0) {
    //         processPageState(completionFlag, false, false, false);
    //     }
    // });
}

// _ decorateTableOfContents
// -------------------------
function decorateTableOfContents() {
    if (
        window.location.href.toLowerCase().indexOf("toc.html") != -1 ||
        window.location.href.toLowerCase().indexOf("index.html") != -1 ||
        window.location.href.toLowerCase().indexOf("frontmatter") != -1
    ) {
        if (!isPreTeXt()) {
            jQuery.get(
                `${eBookConfig.new_server_prefix}/logger/getAllCompletionStatus`,
                function (data) {
                    var subChapterList;
                    if (data != "None") {
                        subChapterList = data.detail;

                        var allSubChapterURLs = $("#main-content div li a");
                        $.each(subChapterList, function (index, item) {
                            for (var s = 0; s < allSubChapterURLs.length; s++) {
                                if (
                                    allSubChapterURLs[s].href.indexOf(
                                        item.chapterName +
                                        "/" +
                                        item.subChapterName
                                    ) != -1
                                ) {
                                    if (item.completionStatus == 1) {
                                        $(allSubChapterURLs[s].parentElement)
                                            .addClass("completed")
                                            .append(
                                                '<span class="infoTextCompleted">- Completed this topic on ' +
                                                item.endDate +
                                                "</span>"
                                            )
                                            .children()
                                            .first()
                                            .hover(
                                                function () {
                                                    $(this)
                                                        .next(
                                                            ".infoTextCompleted"
                                                        )
                                                        .show();
                                                },
                                                function () {
                                                    $(this)
                                                        .next(
                                                            ".infoTextCompleted"
                                                        )
                                                        .hide();
                                                }
                                            );
                                    } else if (item.completionStatus == 0) {
                                        $(allSubChapterURLs[s].parentElement)
                                            .addClass("active")
                                            .append(
                                                '<span class="infoTextActive">Last read this topic on ' +
                                                item.endDate +
                                                "</span>"
                                            )
                                            .children()
                                            .first()
                                            .hover(
                                                function () {
                                                    $(this)
                                                        .next(".infoTextActive")
                                                        .show();
                                                },
                                                function () {
                                                    $(this)
                                                        .next(".infoTextActive")
                                                        .hide();
                                                }
                                            );
                                    }
                                }
                            }
                        });
                    }
                }
            );
        }
        var data = { course: eBookConfig.course };
        jQuery.get(
            `${eBookConfig.new_server_prefix}/logger/getlastpage`,
            data,
            function (data) {
                var lastPageData;
                if (data != "None") {
                    lastPageData = data.detail;
                    if (lastPageData.lastPageChapter != null) {
                        $("#continue-reading")
                            .show()
                            .html(
                                '<div id="jump-to-chapter" class="alert alert-info" ><strong>You were Last Reading:</strong> ' +
                                lastPageData.lastPageChapter +
                                (lastPageData.lastPageSubchapter
                                    ? " &gt; " +
                                    lastPageData.lastPageSubchapter
                                    : "") +
                                ' <a href="' +
                                lastPageData.lastPageUrl +
                                "?lastPosition=" +
                                lastPageData.lastPageScrollLocation +
                                '">Continue Reading</a></div>'
                            );
                    }
                }
            }
        );
    }
}

function enableCompletions() {
    getCompletions();
    showLastPositionBanner();
    addNavigationAndCompletionButtons();
    decorateTableOfContents();
}

// call enable user highlights after login
$(document).on("runestone:login", enableCompletions);

function isPreTeXt() {
    let ptxMarker = document.querySelector("body.pretext");
    if (ptxMarker) {
        return true;
    } else {
        return false;
    }
}
// _ processPageState
// -------------------------
function processPageState(
    completionFlag,
    pageLoad,
    markingComplete,
    markingIncomplete
) {
    /*Log last page visited*/
    var currentPathname = window.location.pathname;
    if (currentPathname.indexOf("?") !== -1) {
        currentPathname = currentPathname.substring(
            0,
            currentPathname.lastIndexOf("?")
        );
    }
    // Is this a ptx book?
    let isPtxBook = isPreTeXt();
    var data = {
        lastPageUrl: currentPathname,
        lastPageScrollLocation: Math.round($(window).scrollTop()),
        completionFlag: completionFlag,
        pageLoad: pageLoad,
        markingComplete: markingComplete,
        markingIncomplete: markingIncomplete,
        course: eBookConfig.course,
        isPtxBook: isPtxBook,
    };
    $(document).ajaxError(function (e, jqhxr, settings, exception) {
        console.log("Request Failed for " + settings.url);
        console.log(e);
    });
    jQuery.ajax({
        url: `${eBookConfig.new_server_prefix}/logger/updatelastpage`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        method: "POST",
        async: true,
    });
}

$.extend({
    getUrlVars: function () {
        var vars = [],
            hash;
        var hashes = window.location.search
            .slice(window.location.search.indexOf("?") + 1)
            .split("&");
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split("=");
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    },
});


/***/ }),

/***/ 66495:
/*!**************************************************!*\
  !*** ./runestone/common/js/jquery.idle-timer.js ***!
  \**************************************************/
/***/ (() => {

/*!
 * jQuery idleTimer plugin
 * version 0.9.100511
 * by Paul Irish.
 *   http://github.com/paulirish/yui-misc/tree/
 * MIT license

 * adapted from YUI idle timer by nzakas:
 *   http://github.com/nzakas/yui-misc/
*/
/*
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* updated to fix Chrome setTimeout issue by Zaid Zawaideh */

 // API available in <= v0.8
 /*******************************

 // idleTimer() takes an optional argument that defines the idle timeout
 // timeout is in milliseconds; defaults to 30000
 $.idleTimer(10000);


 $(document).bind("idle.idleTimer", function(){
    // function you want to fire when the user goes idle
 });


 $(document).bind("active.idleTimer", function(){
  // function you want to fire when the user becomes active again
 });

 // pass the string 'destroy' to stop the timer
 $.idleTimer('destroy');

 // you can query if the user is idle or not with data()
 $.data(document,'idleTimer');  // 'idle'  or 'active'

 // you can get time elapsed since user when idle/active
 $.idleTimer('getElapsedTime'); // time since state change in ms

 ********/



 // API available in >= v0.9
 /*************************

 // bind to specific elements, allows for multiple timer instances
 $(elem).idleTimer(timeout|'destroy'|'getElapsedTime');
 $.data(elem,'idleTimer');  // 'idle'  or 'active'

 // if you're using the old $.idleTimer api, you should not do $(document).idleTimer(...)

 // element bound timers will only watch for events inside of them.
 // you may just want page-level activity, in which case you may set up
 //   your timers on document, document.documentElement, and document.body

 // You can optionally provide a second argument to override certain options.
 // Here are the defaults, so you can omit any or all of them.
 $(elem).idleTimer(timeout, {
   startImmediately: true, //starts a timeout as soon as the timer is set up; otherwise it waits for the first event.
   idle:    false,         //indicates if the user is idle
   enabled: true,          //indicates if the idle timer is enabled
   events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
 });

 ********/

(function($){

$.idleTimer = function(newTimeout, elem, opts){

    // defaults that are to be stored as instance props on the elem

	opts = $.extend({
		startImmediately: true, //starts a timeout as soon as the timer is set up
		idle:    false,         //indicates if the user is idle
		enabled: true,          //indicates if the idle timer is enabled
		timeout: 30000,         //the amount of time (ms) before the user is considered idle
		events:  'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove' // activity is one of these events
	}, opts);


    elem = elem || document;

    /* (intentionally not documented)
     * Toggles the idle state and fires an appropriate event.
     * @return {void}
     */
    var toggleIdleState = function(myelem){

        // curse you, mozilla setTimeout lateness bug!
        if (typeof myelem === 'number'){
            myelem = undefined;
        }

        var obj = $.data(myelem || elem,'idleTimerObj');

        //toggle the state
        obj.idle = !obj.idle;

        // reset timeout 
        var elapsed = (+new Date()) - obj.olddate;
        obj.olddate = +new Date();

        // handle Chrome always triggering idle after js alert or comfirm popup
        if (obj.idle && (elapsed < opts.timeout)) {
                obj.idle = false;
                clearTimeout($.idleTimer.tId);
                if (opts.enabled)
                  $.idleTimer.tId = setTimeout(toggleIdleState, opts.timeout);
                return;
        }
        
        //fire appropriate event

        // create a custom event, but first, store the new state on the element
        // and then append that string to a namespace
        var event = jQuery.Event( $.data(elem,'idleTimer', obj.idle ? "idle" : "active" )  + '.idleTimer'   );

        // we do want this to bubble, at least as a temporary fix for jQuery 1.7
        // event.stopPropagation();
        $(elem).trigger(event);
    },

    /**
     * Stops the idle timer. This removes appropriate event handlers
     * and cancels any pending timeouts.
     * @return {void}
     * @method stop
     * @static
     */
    stop = function(elem){

        var obj = $.data(elem,'idleTimerObj') || {};

        //set to disabled
        obj.enabled = false;

        //clear any pending timeouts
        clearTimeout(obj.tId);

        //detach the event handlers
        $(elem).off('.idleTimer');
    },


    /* (intentionally not documented)
     * Handles a user event indicating that the user isn't idle.
     * @param {Event} event A DOM2-normalized event object.
     * @return {void}
     */
    handleUserEvent = function(){

        var obj = $.data(this,'idleTimerObj');

        //clear any existing timeout
        clearTimeout(obj.tId);



        //if the idle timer is enabled
        if (obj.enabled){


            //if it's idle, that means the user is no longer idle
            if (obj.idle){
                toggleIdleState(this);
            }

            //set a new timeout
            obj.tId = setTimeout(toggleIdleState, obj.timeout);

        }
     };


    /**
     * Starts the idle timer. This adds appropriate event handlers
     * and starts the first timeout.
     * @param {int} newTimeout (Optional) A new value for the timeout period in ms.
     * @return {void}
     * @method $.idleTimer
     * @static
     */


    var obj = $.data(elem,'idleTimerObj') || {};

    obj.olddate = obj.olddate || +new Date();

    //assign a new timeout if necessary
    if (typeof newTimeout === "number"){
        opts.timeout = newTimeout;
    } else if (newTimeout === 'destroy') {
        stop(elem);
        return this;
    } else if (newTimeout === 'getElapsedTime'){
        return (+new Date()) - obj.olddate;
    }

    //assign appropriate event handlers
    $(elem).on($.trim((opts.events+' ').split(' ').join('.idleTimer ')),handleUserEvent);


    obj.idle    = opts.idle;
    obj.enabled = opts.enabled;
    obj.timeout = opts.timeout;


    //set a timeout to toggle state. May wish to omit this in some situations
	if (opts.startImmediately) {
	    obj.tId = setTimeout(toggleIdleState, obj.timeout);
	}

    // assume the user is active for the first x seconds.
    $.data(elem,'idleTimer',"active");

    // store our instance on the object
    $.data(elem,'idleTimerObj',obj);



}; // end of $.idleTimer()


// v0.9 API for defining multiple timers.
$.fn.idleTimer = function(newTimeout,opts){
	// Allow omission of opts for backward compatibility
	if (!opts) {
		opts = {};
	}

    if(this[0]){
        $.idleTimer(newTimeout,this[0],opts);
    }

    return this;
};


})(jQuery);


/***/ }),

/***/ 67799:
/*!**********************************************!*\
  !*** ./runestone/splice/js/spliceWrapper.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SpliceWrapper: () => (/* binding */ SpliceWrapper)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);

class SpliceWrapper extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super();
        this.initSplice();
    }
    initSplice() {
        // SPLICE Events
        window.addEventListener("message", async (event) => {
            var sourceIframe = this.sendingIframe(event);
            console.log(`SpliceWrapper: received message subject: ${event.data.subject} from iframe: ${sourceIframe ? sourceIframe.id : "unknown"}`);
            if (event.data.subject == "SPLICE.reportScoreAndState") {
                this.handleScoreAndState(event, sourceIframe);
            }
            else if (event.data.subject == "SPLICE.sendEvent") {
                this.handleSpliceEvent(event, sourceIframe);
            }
            else if (event.data.subject == "SPLICE.getState") {
                await this.handleGetState(event, sourceIframe);
            }
            else if (event.origin === "https://www.myopenmath.com" &&
                typeof event.data === "string" &&
                event.data.indexOf("lti.ext.imathas.result") != -1) {
                // proof of concept for My Open Math
                let msgdata = JSON.parse(event.data);
                let jwt = basicParseJwt(msgdata.jwt);
                console.log("Result received from frame " +
                    msgdata.frame_id +
                    " with score " +
                    jwt.score);
                // todo send score to server
                // does MOM have a way to get the state?
                // todo send state to server
            }
        });
    }
    getUniqueID(event, frame) {
        // Determine the unique identifier for this activity
        // The SPLICE protocol allows for two possibilities
        // 1. activity_id is the unique id as assigned by the provider
        // 2. activity_id is the iframe src url
        // if the activity_id is set there may also be another attribute called domain
        // On Runestone we will try to map the activity to the div_id of the enclosing RS component
        // if possible, otherwise we will use the activity_id or iframe src
        // If an interactive is included in an exercises this allows us to map the score
        // to the id the instructor used to assign the problem.
        if (frame) {
            let rsDiv = frame.closest("[data-component]");
            if (rsDiv) {
                return rsDiv.id;
            }
        }
        let location = event.data.activity_id;
        if (!location) {
            if (frame) {
                location = frame.src;
            }
            else {
                location = "unknown";
                console.error("Could not find iframe that sent the SPLICE event");
            }
        }
        return location;
    }
    handleScoreAndState(event, frame) {
        console.log("Got SPLICE.reportScoreAndState");
        console.log(event.data.activity_id);
        console.log(event.data.score);
        console.log(event.data.state);
        let location = this.getUniqueID(event, frame);
        this.logBookEvent({
            event: event.data.subject,
            div_id: location,
            act: `score: ${event.data.score}`,
            score: event.data.score,
            percent: event.data.score,
            correct: event.data.score == 1.0 ? true : false,
            answer: JSON.stringify(event.data.state),
        });
    }
    sendingIframe(event) {
        // determine the iframe that sent the event
        // you would think that event.source would be the iframe
        // but it is not and getting the location out of event.source
        // creates CORS issues.
        for (const f of document.getElementsByTagName("iframe")) {
            if (f.contentWindow === event.source)
                return f;
        }
        return undefined;
    }
    async getSavedState(location) {
        // fetch the state from the server
        try {
            const response = await fetch("/ns/assessment/results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    div_id: location,
                    course: eBookConfig.course,
                    event: "SPLICE.getState",
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching SPLICE state:", error);
            return null;
        }
    }
    async handleGetState(event, frame) {
        console.log("Got SPLICE.getState");
        console.log(event.data.activity_id);
        console.log(event.data.state);
        // subject is SPLICE.getState.response
        let location = this.getUniqueID(event, frame);
        let res = await this.getSavedState(location);
        let state = res === null || res === void 0 ? void 0 : res.detail.answer;
        event.source.postMessage({
            message_id: event.data.message_id,
            subject: "SPLICE.getState.response",
            state: state,
        }, "*");
    }
    handleSpliceEvent(event, frame) {
        // handle generic SPLICE events, such as logged clicks
        // or other events.  SPLICE does not require that we do
        // anything with them, but in keeping with our tradition
        // we will save them to the useinfo table in the database
        // in case they prove to be useful for research later
        console.log("Got SPLICE.sendEvent");
        console.log(event.data.activity_id);
        console.log(event.data.name);
        let location = this.getUniqueID(event, frame);
        this.logBookEvent({
            event: event.data.subject,
            div_id: location,
            act: event.data.name || "unknown",
        });
    }
    // these stubs are not implemented, but are required by the RunestoneBase class
    checkLocalStorage() { }
    setLocalStorage() { }
    restoreAnswers() { }
    disableInteraction() { }
}
function basicParseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(window
        .atob(base64)
        .split("")
        .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    })
        .join(""));
    return JSON.parse(jsonPayload);
}


/***/ }),

/***/ 69041:
/*!******************************!*\
  !*** ./ptxrs-bootstrap.less ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 77427:
/*!**************************************************!*\
  !*** ./runestone/common/css/user-highlights.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 78673:
/*!**********************************************!*\
  !*** ./runestone/common/js/runestonebase.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RunestoneBase)
/* harmony export */ });
/* harmony import */ var _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bookfuncs.js */ 83057);
/* ********************************
 * |docname| - Runestone Base Class
 * ********************************
 * All runestone components should inherit from RunestoneBase. In addition all runestone components should do the following things:
 *
 * 1.   Ensure that they are wrapped in a div with the class runestone
 * 2.   Write their source AND their generated html to the database if the database is configured
 * 3.   Properly save and restore their answers using the checkServer mechanism in this base class. Each component must provide an implementation of:
 *
 *      -    checkLocalStorage
 *      -    setLocalStorage
 *      -    restoreAnswers
 *      -    disableInteraction
 *
 * 4.   provide a Selenium based unit test
 */


//import "./../styles/runestone-custom-sphinx-bootstrap.css";

var NO_DECORATE = ["parsonsMove", "showeval", "video", "poll", "view_toggle",
    "dashboard", "selectquestion", "codelens", "peer"]
class RunestoneBase {
    constructor(opts) {
        this.component_ready_promise = new Promise(
            (resolve) => (this._component_ready_resolve_fn = resolve)
        );
        this.optional = false;
        if (typeof window.allComponents === "undefined") {
            window.allComponents = [];
        }
        window.allComponents.push(this);
        if (opts) {
            this.sid = opts.sid;
            this.graderactive = opts.graderactive;
            this.showfeedback = true;
            if (opts.timed) {
                this.isTimed = true;
            }
            if (opts.enforceDeadline) {
                this.deadline = opts.deadline;
            }
            this.optional = this.parseBooleanAttribute(opts.orig, "data-optional");
            if (opts.selector_id) {
                this.selector_id = opts.selector_id;
            }
            if (typeof opts.assessmentTaken !== "undefined") {
                this.assessmentTaken = opts.assessmentTaken;
            } else {
                // default to true as this opt is only provided from a timedAssessment
                this.assessmentTaken = true;
            }
            // This is for the selectquestion points
            // If a selectquestion is part of a timed exam it will get
            // the timedWrapper options.
            if (typeof opts.timedWrapper !== "undefined") {
                this.timedWrapper = opts.timedWrapper;
            } else {
                // However sometimes selectquestions
                // are used in regular assignments.  The hacky way to detect this
                // is to look for doAssignment in the URL and then grab
                // the assignment name from the heading.
                if (location.href.indexOf("doAssignment") >= 0) {
                    this.timedWrapper = $("h1#assignment_name").text();
                } else {
                    this.timedWrapper = null;
                }
            }
            if ($(opts.orig).data("question_label")) {
                this.question_label = $(opts.orig).data("question_label");
            }
            this.is_toggle =  true ? opts.is_toggle : 0;
            this.is_select =  true ? opts.is_select : 0;
        }
        this.mjelements = [];
        let self = this;
        this.mjReady = new Promise(function (resolve, reject) {
            self.mjresolver = resolve;
        });
        this.aQueue = new AutoQueue();
        if (opts && typeof opts.preamble !== "undefined") {
            this.preamble = opts.preamble;
            let y = document.createElement("div");
            y.classList.add("hidden-content");
            y.classList.add("process-math");
            y.innerHTML = "\\(" + this.preamble + "\\)";
            // This is a hack to get the preamble into the DOM so that MathJax can process it.
            opts.orig.appendChild(y);
            y.id = "ltx_preamble";
            y.style.display = "none";
            // Add the preamble to the queue object so it can prepend it to
            // future MathJax processing
            this.aQueue.preamble = y
        }

        this.jsonHeaders = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
    }

    // Helper for parsing boolean data-* attributes
    // Unset/"false"/"no" means false, anything else, including empty string means true
    parseBooleanAttribute(element, attributeName) {
        const attrValue = element.getAttribute(attributeName);
        if (attrValue === null) {
            return false;
        }
        const lowerValue = attrValue.toLowerCase();
        if (lowerValue === "false" || lowerValue === "no") {
            return false;
        }
        return true;
    }

    // _`logBookEvent`
    //----------------
    // This function sends the provided ``eventInfo`` to the `hsblog endpoint` of the server. Awaiting this function returns either ``undefined`` (if Runestone services are not available) or the data returned by the server as a JavaScript object (already JSON-decoded).
    async logBookEvent(eventInfo) {
        if (this.graderactive) {
            return;
        }
        let post_return;
        eventInfo.course_name = eBookConfig.course;
        eventInfo.clientLoginStatus = eBookConfig.isLoggedIn;
        eventInfo.timezoneoffset = new Date().getTimezoneOffset() / 60;
        // For selectquestions we need to log using the selector_id for real time scoring
        if (this.selector_id) {
            eventInfo.selector_id = this.selector_id;
        }
        if (typeof this.percent === "number") {
            eventInfo.percent = this.percent;
        }
        if (window.assignmentId) {
            eventInfo.assignment_id = window.assignmentId;
        }
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
            post_return = this.postLogMessage(eventInfo);
        }
        if (!this.isTimed || eBookConfig.debug) {
            let prefix = eBookConfig.isLoggedIn ? "Save" : "Not";
            console.log(`${prefix} logging event ` + JSON.stringify(eventInfo));
        }
        // When selectquestions are part of an assignment especially toggle questions
        // we need to count using the selector_id of the select question.
        // We  also need to log an event for that selector so that we will know
        // that interaction has taken place.  This is **independent** of how the
        // autograder will ultimately grade the question!
        if (this.selector_id) {
            eventInfo.div_id = this.selector_id.replace(
                "-toggleSelectedQuestion",
                ""
            );
            eventInfo.event = "selectquestion";
            eventInfo.act = "interaction";
            this.postLogMessage(eventInfo);
        }
        if (
            typeof _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress === "function" &&
            eventInfo.act != "edit" &&
            this.optional == false
        ) {
            _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress(eventInfo.div_id);
        }
        // if the event is in the NO_DECORATE list then don't decorate the status
        if (NO_DECORATE.indexOf(eventInfo.event) === -1) {
            this.decorateStatus();
        }
        return post_return;
    }

    async postLogMessage(eventInfo) {
        var post_return;
        let request = new Request(
            `${eBookConfig.new_server_prefix}/logger/bookevent`,
            {
                method: "POST",
                headers: this.jsonHeaders,
                body: JSON.stringify(eventInfo),
            }
        );
        try {
            var response = await fetch(request);
            if (!response.ok) {
                if (response.status === 422) {
                    // Get details about why this is unprocesable.
                    post_return = await response.json();
                    console.log(JSON.stringify(post_return.detail, null, 4));
                    throw new Error("Unprocessable Request");
                } else if (response.status == 401) {
                    post_return = await response.json();
                    console.log(
                        `Missing authentication token ${post_return.detail}`
                    );
                    throw new Error("Missing authentication token");
                }
                throw new Error(`Failed to save the log entry
                    Status: ${response.status}`);
            }
            post_return = await response.json();
            let scoreSpec = post_return.detail;
            let gradeBox = null;
            if (this.selector_id) {
                let selector_id = this.selector_id.replace(
                    "-toggleSelectedQuestion",
                    ""
                );
                gradeBox = document.getElementById(`${selector_id}_score`);
            } else {
                gradeBox = document.getElementById(`${this.divid}_score`);
            }
            if (gradeBox && !this.isTimed && scoreSpec.score) {
                this.updateScores(gradeBox, scoreSpec);
            }
        } catch (e) {
            let detail = "none";
            if (post_return && post_return.detail) {
                detail = post_return.detail;
            }
            if (eBookConfig.useRunestoneServices) {
                alert(`Error: Your action was not saved!
                    The error was ${e}
                    Status Code: ${response.status}
                    Detail: ${JSON.stringify(detail, null, 4)}.
                    Please report this error!`);
            }
            // send a request to save this error
            console.log(
                `Error: ${e} Detail: ${detail} Status Code: ${response.status}`
            );
        }
        return post_return;
    }
    // update the score for the question and the total score
    // the presence of the gradeBox is used to determine if we are on an assignment page.
    updateScores(gradeBox, scoreSpec) {
        if (!scoreSpec.assigned || scoreSpec.score === null) {
            document.getElementById(`${this.divid}_message`).innerHTML = "Score not updated.  Submissions are closed.";
            return;
        }
        let scoreSpan = gradeBox.getElementsByClassName("qscore")[0];
        if (scoreSpan) {
            scoreSpan.innerHTML = scoreSpec.score.toFixed(1);
        }
        let allScores = document.getElementsByClassName("qscore");
        let allmax = document.getElementsByClassName("qmaxscore");
        let total = 0;
        let max = 0;
        for (let i = 0; i < allScores.length; i++) {
            total += parseFloat(allScores[i].innerHTML);
            max += parseFloat(allmax[i].innerHTML);
        }
        let totalSpan = document.getElementById("total_score");
        if (totalSpan) {
            totalSpan.innerHTML = total.toFixed(1);
        }
        let maxSpan = document.getElementById("total_max");
        if (maxSpan) {
            maxSpan.innerHTML = max;
        }
        let percentSpan = document.getElementById("total_percent");
        if (percentSpan) {
            percentSpan.innerHTML = ((total / max) * 100).toFixed(2);
        }
    }

    // .. _logRunEvent:
    //
    // logRunEvent
    // -----------
    // This function sends the provided ``eventInfo`` to the `runlog endpoint`. When awaited, this function returns the data (decoded from JSON) the server sent back.
    async logRunEvent(eventInfo) {
        let post_promise = "done";
        if (this.graderactive) {
            return;
        }
        eventInfo.course = eBookConfig.course;
        eventInfo.clientLoginStatus = eBookConfig.isLoggedIn;
        eventInfo.timezoneoffset = new Date().getTimezoneOffset() / 60;
        if (this.forceSave || "to_save" in eventInfo === false) {
            eventInfo.save_code = "True";
        }
        if (typeof eventInfo.errinfo !== "undefined") {
            eventInfo.errinfo = eventInfo.errinfo.toString();
        }
        if (
            eBookConfig.isLoggedIn &&
            eBookConfig.useRunestoneServices &&
            eBookConfig.logLevel > 0
        ) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/logger/runlog`,
                {
                    method: "POST",
                    headers: this.jsonHeaders,
                    body: JSON.stringify(eventInfo),
                }
            );
            let response = await fetch(request);
            if (!response.ok) {
                post_promise = await response.json();
                if (eBookConfig.useRunestoneServices) {
                    alert(`Failed to save your code
                        Status is ${response.status}
                        Detail: ${JSON.stringify(
                        post_promise.detail,
                        null,
                        4
                    )}`);
                } else {
                    console.log(
                        `Did not save the code.
                         Status: ${response.status}
                         Detail: ${JSON.stringify(
                            post_promise.detail,
                            null,
                            4
                        )}`
                    );
                }
            } else {
                post_promise = await response.json();
            }
        }
        if (!this.isTimed || eBookConfig.debug) {
            console.log("running " + JSON.stringify(eventInfo));
        }
        if (
            typeof _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress === "function" &&
            this.optional == false
        ) {
            _bookfuncs_js__WEBPACK_IMPORTED_MODULE_0__.pageProgressTracker.updateProgress(eventInfo.div_id);
        }
        return post_promise;
    }
    /* Checking/loading from storage
    **WARNING:**  DO NOT `await` this function!
    This function, although async, does not explicitly resolve its promise by returning a value.  The reason for this is because it is called by the constructor for nearly every component.  In Javascript constructors cannot be async!

    One of the recommended ways to handle the async requirements from within a constructor is to use an attribute as a promise and resolve that attribute at the appropriate time.
    */
    async checkServer(
        // A string specifying the event name to use for querying the :ref:`getAssessResults` endpoint.
        eventInfo,
        // If true, this function will invoke ``indicate_component_ready()`` just before it returns. This is provided since most components are ready after this function completes its work.
        //
        // TODO: This defaults to false, to avoid causing problems with any components that haven't been updated and tested. After all Runestone components have been updated, default this to true and remove the extra parameter from most calls to this function.
        will_be_ready = false
    ) {
        // Check if the server has stored answer
        let self = this;
        this.checkServerComplete = new Promise(function (resolve, reject) {
            self.csresolver = resolve;
        });
        if (
            eBookConfig.isLoggedIn &&
            (this.useRunestoneServices || this.graderactive)
        ) {
            let data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            data.event = eventInfo;
            if (this.graderactive && this.deadline) {
                data.deadline = this.deadline;
                data.rawdeadline = this.rawdeadline;
                data.tzoff = this.tzoff;
            }
            if (this.sid) {
                data.sid = this.sid;
            }
            if (!(data.div_id && data.course && data.event)) {
                console.log(
                    `A required field is missing data ${data.div_id}:${data.course}:${data.event}`
                );
            }
            // If we are NOT in practice mode and we are not in a peer exercise
            // and assessmentTaken is true
            if (
                !eBookConfig.practice_mode &&
                !eBookConfig.peer &&
                this.assessmentTaken
            ) {
                let request = new Request(
                    `${eBookConfig.new_server_prefix}/assessment/results`,
                    {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: this.jsonHeaders,
                    }
                );
                try {
                    let response = await fetch(request);
                    console.log(`Response from server: ${response.status}`);
                    if (response.ok) {
                        data = await response.json();
                        data = data.detail;
                        console.log(`Data from server: ${JSON.stringify(data)} calling repopulateFromStorage`);
                        this.repopulateFromStorage(data);
                        this.attempted = true;
                        if (typeof data.correct !== "undefined") {
                            this.correct = data.correct;
                        } else {
                            this.correct = null;
                        }
                        console.log(`resolving checkServer with server data`);
                        this.csresolver("server");
                    } else {
                        console.log(
                            `HTTP Error getting results: ${response.statusText}`
                        );
                        this.checkLocalStorage(); // just go right to local storage
                        console.log(`resolving checkServer with local data`);
                        this.csresolver("local");
                    }
                } catch (err) {
                    console.log(`Error getting results: ${err}`);
                    try {
                        this.checkLocalStorage();
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                this.loadData({});
                console.log(`resolving checkServer no answer given`);
                this.csresolver("not taken");
            }
        } else {
            this.checkLocalStorage(); // just go right to local storage
            console.log(`resolving checkServer with local data`);
            this.csresolver("local");
        }

        if (will_be_ready) {
            this.indicate_component_ready();
        }
    }

    // This method assumes that ``this.componentDiv`` refers to the ``div`` containing the component, and that this component's ID is set.
    indicate_component_ready() {
        // Add a class to indicate the component is now ready.
        this.containerDiv.classList.add("runestone-component-ready");
        // Resolve the ``this.component_ready_promise``.
        this._component_ready_resolve_fn();
    }

    loadData(data) {
        // for most classes, loadData doesn't do anything. But for Parsons, and perhaps others in the future,
        // initialization can happen even when there's no history to be loaded
        return null;
    }

    /**
     * repopulateFromStorage is called after a successful API call is made to ``getAssessResults`` in
     * the checkServer method in this class
     *
     * ``restoreAnswers,`` ``setLocalStorage`` and ``checkLocalStorage`` are defined in the child classes.
     *
     * @param {*} data - a JSON object representing the data needed to restore a previous answer for a component
     * @param {*} status - the http status
     * @param {*} whatever - ignored
     */
    repopulateFromStorage(data) {
        // decide whether to use the server's answer (if there is one) or to load from storage
        if (data !== null && data !== "no data" && this.shouldUseServer(data)) {
            this.restoreAnswers(data);
            this.setLocalStorage(data);
        } else {
            this.checkLocalStorage();
        }
        this.decorateStatus();
    }
    shouldUseServer(data) {
        // returns true if server data is more recent than local storage or if server storage is correct
        if (
            data.correct === "T" ||
            data.correct === true ||
            localStorage.length === 0 ||
            this.graderactive === true ||
            this.isTimed
        ) {
            return true;
        }
        let ex = localStorage.getItem(this.localStorageKey());
        if (ex === null) {
            return true;
        }
        let storedData;
        try {
            storedData = JSON.parse(ex);
        } catch (err) {
            // error while parsing; likely due to bad value stored in storage
            console.log(err.message);
            localStorage.removeItem(this.localStorageKey());
            // definitely don't want to use local storage here
            return true;
        }
        if (data.answer == storedData.answer) return true;
        let storageDate = new Date(storedData.timestamp);
        let serverDate = new Date(data.timestamp);
        return serverDate >= storageDate;
    }
    // Return the key which to be used when accessing local storage.
    localStorageKey() {
        return (
            eBookConfig.email +
            ":" +
            eBookConfig.course +
            ":" +
            this.divid +
            "-given"
        );
    }
    addCaption(elType) {
        //someElement.parentNode.insertBefore(newElement, someElement.nextSibling);
        if (!this.isTimed) {
            var capDiv = document.createElement("p");
            if (this.question_label) {
                // Display caption based on whether Runestone services have been detected
                this.caption = eBookConfig.useRunestoneServices
                    ? `Activity: ${this.question_label} ${this.caption}  <span class="runestone_caption_divid">(${this.divid})</span>`
                    : `Activity: ${this.question_label} ${this.caption}`; // Without runestone
                $(capDiv).html(this.caption);
                $(capDiv).addClass(`${elType}_caption`);
            } else {
                // Display caption based on whether Runestone services have been detected
                $(capDiv).html(
                    eBookConfig.useRunestoneServices
                        ? this.caption + " (" + this.divid + ")"
                        : this.caption
                ); // Without runestone
                $(capDiv).addClass(`${elType}_caption`);
                $(capDiv).addClass(`${elType}_caption_text`);
            }
            this.capDiv = capDiv;
            //this.outerDiv.parentNode.insertBefore(capDiv, this.outerDiv.nextSibling);
            this.containerDiv.appendChild(capDiv);
        }
    }

    hasUserActivity() {
        return this.isAnswered;
    }

    checkCurrentAnswer() {
        console.log(
            "Each component should provide an implementation of checkCurrentAnswer"
        );
    }

    async logCurrentAnswer() {
        console.log(
            "Each component should provide an implementation of logCurrentAnswer"
        );
    }
    renderFeedback() {
        console.log(
            "Each component should provide an implementation of renderFeedback"
        );
    }
    disableInteraction() {
        console.log(
            "Each component should provide an implementation of disableInteraction"
        );
    }

    toString() {
        return `${this.constructor.name}: ${this.divid}`;
    }

    queueMathJax(component) {
        if (typeof MathJax === "undefined") {
            console.log("Error -- MathJax is not loaded");
            return Promise.resolve(null);
        } else {
            // See - https://docs.mathjax.org/en/latest/advanced/typeset.html
            // Per the above we should keep track of the promises and only call this
            // a second time if all previous promises have resolved.
            // Create a queue of components
            // should wait until defaultPageReady is defined
            // If defaultPageReady is not defined then just enqueue the components.
            // Once defaultPageReady is defined
            // the window.runestoneMathReady promise will be fulfilled when the
            // initial typesetting is complete.
            if (MathJax.typesetPromise) {
                if (typeof window.runestoneMathReady !== "undefined") {
                    return window.runestoneMathReady.then(() =>
                        this.mjresolver(this.aQueue.enqueue(component))
                    );
                } else {
                    return this.mjresolver(this.aQueue.enqueue(component));
                }
            } else {
                console.log(`Waiting on MathJax!! ${MathJax.typesetPromise}`);
                setTimeout(() => this.queueMathJax(component), 200);
                console.log(`Returning mjready promise: ${this.mjReady}`);
                return this.mjReady;
            }
        }
    }

    decorateStatus() {
        if (this.isTimed || eBookConfig.peer) return;
        let rsDiv = $(this.containerDiv).closest("div.runestone")[0];
        if (!rsDiv) return;
        rsDiv.classList.remove("notAnswered");
        rsDiv.classList.remove("isInCorrect");
        rsDiv.classList.remove("isCorrect");
        let assignmentInfo = localStorage.getItem(`currentAssignmentInfo_${eBookConfig.course}`);
        let questions = [];
        if (assignmentInfo) {
            questions = JSON.parse(assignmentInfo).questions
        }
        if (questions.indexOf(this.divid) >= 0) {
            rsDiv.classList.add("isAssigned");
        }
        if (this.correct) {
            rsDiv.classList.add("isCorrect");
        } else {
            if (this.correct === null || typeof this.correct === "undefined") {
                rsDiv.classList.add("notAnswered");
            } else {
                rsDiv.classList.add("isInCorrect");
            }
        }
    }
}

// Inspiration and lots of code for this solution come from
// https://stackoverflow.com/questions/53540348/js-async-await-tasks-queue
// The idea here is that until MathJax is ready we can just enqueue things
// once mathjax becomes ready then we can drain the queue and continue as usual.

class Queue {
    constructor() {
        this._items = [];
    }
    enqueue(item) {
        this._items.push(item);
    }
    dequeue() {
        return this._items.shift();
    }
    get size() {
        return this._items.length;
    }
}

class AutoQueue extends Queue {
    constructor() {
        super();
        this._pendingPromise = false;
    }

    enqueue(component) {
        return new Promise((resolve, reject) => {
            super.enqueue({ component, resolve, reject });
            this.dequeue();
        });
    }

    async dequeue() {
        if (this._pendingPromise) return false;

        let item = super.dequeue();

        if (!item) return false;
        let qq = this;
        try {
            this._pendingPromise = true;

            let payload = await window.runestoneMathReady
                .then(async function () {
                    console.log(
                        `MathJax Ready -- dequeing a typesetting run for ${item.component.id} ${qq.preamble?.innerHTML}`
                    );
                    if (qq.preamble) {
                        await MathJax.typesetPromise([qq.preamble])
                        // Use insertAdjacentElement to preserve existing DOM elements and event listeners
                        // instead of overwriting innerHTML which destroys event handlers
                        let preambleDiv = document.createElement("div");
                        preambleDiv.innerHTML = qq.preamble.innerHTML;
                        item.component.insertAdjacentElement("afterbegin", preambleDiv);
                        console.log(
                            `MathJax typeset the preamble for ${item.component.id}`
                        );
                        return await MathJax.typesetPromise([item.component]);
                    } else {
                        return await MathJax.typesetPromise([item.component]);
                    }
                });

            this._pendingPromise = false;
            item.resolve(payload);
        } catch (e) {
            this._pendingPromise = false;
            item.reject(e);
        } finally {
            // If there are more items in the queue, continue processing them
            this.dequeue();
        }

        return true;
    }
}

window.RunestoneBase = RunestoneBase;


/***/ }),

/***/ 80184:
/*!**************************!*\
  !*** ./webpack.index.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   runestone_auto_import: () => (/* binding */ runestone_auto_import),
/* harmony export */   runestone_import: () => (/* binding */ runestone_import)
/* harmony export */ });
/* harmony import */ var jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jquery-ui/jquery-ui.js */ 67375);
/* harmony import */ var jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jquery_ui_jquery_ui_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jquery_ui_themes_base_jquery_ui_all_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery-ui/themes/base/jquery.ui.all.css */ 62423);
/* harmony import */ var _runestone_common_js_jquery_idle_timer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./runestone/common/js/jquery.idle-timer.js */ 66495);
/* harmony import */ var _runestone_common_js_jquery_idle_timer_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_idle_timer_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.js */ 52329);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_bidi_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.bidi.js */ 39161);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_bidi_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_emitter_bidi_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.emitter.js */ 46905);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_emitter_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_emitter_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_fallbacks_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.fallbacks.js */ 23836);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_fallbacks_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_fallbacks_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_messagestore_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.messagestore.js */ 51399);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_messagestore_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_messagestore_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_parser_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.parser.js */ 49276);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_parser_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_parser_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_language_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./runestone/common/js/jquery_i18n/jquery.i18n.language.js */ 35773);
/* harmony import */ var _runestone_common_js_jquery_i18n_jquery_i18n_language_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_jquery_i18n_jquery_i18n_language_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap.js */ 52754);
/* harmony import */ var bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _ptxrs_bootstrap_less__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ptxrs-bootstrap.less */ 69041);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js */ 3403);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _runestone_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./runestone/common/js/bookfuncs.js */ 83057);
/* harmony import */ var _runestone_common_js_user_highlights_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./runestone/common/js/user-highlights.js */ 59782);
/* harmony import */ var _runestone_common_js_pretext_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./runestone/common/js/pretext.js */ 19359);
/* harmony import */ var _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./runestone/common/js/theme.js */ 94564);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./runestone/common/js/presenter_mode.js */ 19695);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _runestone_common_css_presenter_mode_less__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./runestone/common/css/presenter_mode.less */ 45631);
/* harmony import */ var _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./runestone/common/js/renderComponent.js */ 98098);
/* harmony import */ var _runestone_common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./runestone/common/js/runestonebase.js */ 78673);
/* harmony import */ var _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./runestone/splice/js/spliceWrapper.ts */ 67799);
// ***********************************************************************************
// |docname| - A framework allowing a Runestone component to load only the JS it needs
// ***********************************************************************************
// The JavaScript required by all Runestone components is quite large and results in slow page loads. This approach enables a Runestone component to load only the JavaScript it needs, rather than loading JavaScript for all the components regardless of which are actually used.
//
// To accomplish this, webpack's split-chunks ability analyzes all JS, starting from this file. The dynamic imports below are transformed by webpack into the dynamic fetches of just the JS required by each file and all its dependencies. (If using static imports, webpack will assume that all files are already statically loaded via script tags, defeating the purpose of this framework.)
//
// However, this approach leads to complexity:
//
// -    The ``data-component`` attribute of each component must be kept in sync with the keys of the ``module_map`` below.
// -    The values in the ``module_map`` must be kept in sync with the JavaScript files which implement each of the components.

// Static imports
// ==============
// These imports are (we assume) needed by all pages. However, it would be much better to load these in the modules that actually use them.
//
// These are static imports; code in `dynamically loaded components`_ deals with dynamic imports.
//
// jQuery-related imports.











// Bootstrap - not needed for pxx development


// common styles come from here



// Misc





// These are only needed for the Runestone book, but not in a library mode (such as pretext). I would prefer to dynamically load them. However, these scripts are so small I haven't bothered to do so.







// Dynamically loaded components
// =============================
// This provides a list of modules that components can dynamically import. Webpack will create a list of imports for each based on its analysis.
const module_map = {
    // Wrap each import in a function, so that it won't occur until the function is called. While something cleaner would be nice, webpack can't analyze things like ``import(expression)``.
    //
    // The keys must match the value of each component's ``data-component`` attribute -- the ``runestone_import`` and ``runestone_auto_import`` functions assume this.
    activecode: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/activecode/js/acfactory.js */ 49917)),
    // Always import the timed version of a component if available, since the timed components also define the component's factory and include the component as well. Note that ``acfactory`` imports the timed components of ActiveCode, so it follows this pattern.
    clickablearea: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_clickableArea_css_clickable_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/clickableArea/js/timedclickable.js */ 44892)),
    codelens: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_codelens_js_codelens_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/codelens/js/codelens.js */ 76412)),
    datafile: () => __webpack_require__.e(/*! import() */ "runestone_datafile_js_datafile_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/datafile/js/datafile.js */ 33580)),
    dragndrop: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_dragndrop_css_dragndrop_less")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/dragndrop/js/timeddnd.js */ 17558)),
    fillintheblank: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_fitb_css_fitb_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/fitb/js/timedfitb.js */ 1103)),
    groupsub: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_select2_dist_css_select2_css-node_modules_select2_dist_js_select2_min_js"), __webpack_require__.e("runestone_groupsub_js_groupsub_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/groupsub/js/groupsub.js */ 24616)),
    matching: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_matching_css_matching_less")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/matching/js/matching.js */ 17352)),
    multiplechoice: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_mchoice_css_mchoice_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/mchoice/js/timedmc.js */ 86001)),
    hparsons: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_micro-parsons_micro-parsons_micro-parsons_js-node_modules_micro-parsons_-974bff"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_hparsons_js_hparsons_js-node_modules_mic-5ea6d2")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/hparsons/js/hparsons.js */ 47272)),
    parsons: () => __webpack_require__.e(/*! import() */ "runestone_parsons_js_timedparsons_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/parsons/js/timedparsons.js */ 23405)),
    poll: () => __webpack_require__.e(/*! import() */ "runestone_poll_js_poll_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/poll/js/poll.js */ 11168)),
    selectquestion: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_selectquestion_css_selectquestion_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/selectquestion/js/selectone.js */ 10662)),
    shortanswer: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_shortanswer_css_shortanswer_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/shortanswer/js/timed_shortanswer.js */ 68950)),
    showeval: () => __webpack_require__.e(/*! import() */ "runestone_showeval_js_showEval_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/showeval/js/showEval.js */ 8824)),
    tabbedStuff: () => __webpack_require__.e(/*! import() */ "runestone_tabbedStuff_js_tabbedstuff_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/tabbedStuff/js/tabbedstuff.js */ 76442)),
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_dragndrop_css_dragndrop_less-runestone_matching_css_mat-2709ac")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 4968)),
    // TODO: since this isn't in a ``data-component``, need to trigger an import of this code manually.
    webwork: () => __webpack_require__.e(/*! import() */ "runestone_webwork_js_webwork_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/webwork/js/webwork.js */ 84680)),
    youtube: () => __webpack_require__.e(/*! import() */ "runestone_video_js_runestonevideo_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/video/js/runestonevideo.js */ 86915)),
    doenet: () => Promise.resolve(), // Doenet is loaded separately
};

const module_map_cache = {};
const QUEUE_FLUSH_TIME_MS = 10;
const queue = [];
let queueLastFlush = 0;
/**
 * Queue imports that are requested within `QUEUE_FLUSH_TIME_MS` of each other.
 * All such imports are imported at once, and then a promise is fired after all
 * the imports in the queue window have completed.
 */
function queueImport(component_name) {
    let resolve = null;
    let reject = null;
    const retPromise = new Promise((r, rej) => {
        resolve = r;
        reject = rej;
    });
    const item = { component_name, resolve, reject };
    queue.push(item);
    window.setTimeout(flushQueue, QUEUE_FLUSH_TIME_MS + 1);

    return retPromise;
}
async function flushQueue() {
    if (queue.length === 0) {
        return;
    }
    if (Date.now() - queueLastFlush < QUEUE_FLUSH_TIME_MS) {
        window.setTimeout(flushQueue, QUEUE_FLUSH_TIME_MS + 1);
        return;
    }
    // If we made it here, it has been at least QUEUE_FLUSH_TIME_MS since
    // the last time we flushed the queue. Therefore, we should start flushing.
    // We copy everything we flush and empty the array first.
    queueLastFlush = Date.now();
    const toFlush = [...queue];
    queue.length = 0;
    console.log(
        "Webpack is starting the loading process for the following Runestone modules",
        toFlush.map((item) => item.component_name)
    );
    const flushedPromise = toFlush.map(async (item) => {
        try {
            await module_map[item.component_name]();
            console.log(
                `Runestone component ${item.component_name} has been loaded`
            );
            return item;
        } catch (e) {
            item.reject(e);
        }
    });
    const flushed = await Promise.all(flushedPromise);
    try {
        flushed.forEach(function (item) {
            if (item) {
                item.resolve();
            }
        });
    } catch (e) {
        console.error(e);
    }
}

// .. _dynamic import machinery:
//
// Dynamic import machinery
// ========================
// Fulfill a promise when the Runestone pre-login complete event occurs.
let pre_login_complete_promise = new Promise((resolve) =>
    $(document).on("runestone:pre-login-complete", resolve)
);
let loadedComponents;
// Provide a simple function to import the JS for all components on the page.
function runestone_auto_import() {
    // Create a set of ``data-component`` values, to avoid duplication.
    const s = new Set(
        // All Runestone components have a ``data-component`` attribute.
        $("[data-component]")
            .map(
                // Extract the value of the data-component attribute.
                (index, element) => $(element).attr("data-component")
                // Switch from a jQuery object back to an array, passing that to the Set constructor.
            )
            .get()
    );
    // webwork questions are not wrapped in div with a data-component so we have to check a different way
    if (document.querySelector(".webwork-button")) {
        s.add("webwork");
    }

    // Load JS for each of the components found.
    const a = [...s].map((value) => {
        let z;
        console.log(`Loading Runestone component: ${value}`);
        try {
            z = (module_map[value] || (() => Promise.resolve()))();
        } catch (e) {
            console.error(`Error loading ${value}:`, e);
        }
        z.error = (msg) => console.error(`Error in ${value}:`, msg);
        return z;
    });

    // Send the Runestone login complete event when all JS is loaded and the pre-login is also complete.
    Promise.all([pre_login_complete_promise, ...a]).then(function () {
        if (!document.body.dataset.reactInUse) {
            document.dispatchEvent(new CustomEvent("runestone:login-complete"));
        }
    });
}

pre_login_complete_promise.then(() => {
    console.log("Runestone pre-login complete");
});

// Load component JS when the document is ready.
$(document).ready(runestone_auto_import);

// Provide a function to import one specific `Runestone` component.
// the import function inside module_map is async -- runestone_import
// should be awaited when necessary to ensure the import completes
async function runestone_import(component_name) {
    if (module_map_cache[component_name]) {
        return module_map_cache[component_name];
    }
    console.log(
        `Runestone component ${component_name} is being queued for import`
    );
    const promise = queueImport(component_name);
    module_map_cache[component_name] = promise;
    return promise;
}

async function popupScratchAC() {
    // load the activecode bundle
    await runestone_import("activecode");
    // scratchDiv will be defined if we have already created a scratch
    // activecode.  If its not defined then we need to get it ready to toggle
    if (!eBookConfig.scratchDiv) {
        window.ACFactory.createScratchActivecode();
        let divid = eBookConfig.scratchDiv;
        window.componentMap[divid] = ACFactory.createActiveCode(
            $(`#${divid}`)[0],
            eBookConfig.acDefaultLanguage
        );
        if (eBookConfig.isLoggedIn) {
            window.componentMap[divid].enableSaveLoad();
        }
    }
    setTimeout(() => {
        window.ACFactory.toggleScratchActivecode();
    }, 100);
}

// Set the directory containing this script as the `path <https://webpack.js.org/guides/public-path/#on-the-fly>`_ for all webpacked scripts.
const script_src = document.currentScript.src;
__webpack_require__.p = script_src.substring(
    0,
    script_src.lastIndexOf("/") + 1
);

var splice = new _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_21__.SpliceWrapper();

// Manual exports
// ==============
// Webpack's ``output.library`` setting doesn't seem to work with the split chunks plugin; do all exports manually through the ``window`` object instead.

const rc = {};
rc.runestone_import = runestone_import;
rc.runestone_auto_import = runestone_auto_import;
rc.getSwitch = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_16__.getSwitch;
rc.switchTheme = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_16__.switchTheme;
rc.popupScratchAC = popupScratchAC;
rc.renderOneComponent = _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_19__.renderOneComponent;
window.componentMap = {};
window.runestoneComponents = rc;


/***/ }),

/***/ 83057:
/*!******************************************!*\
  !*** ./runestone/common/js/bookfuncs.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   looksLikeLatexMath: () => (/* binding */ looksLikeLatexMath),
/* harmony export */   pageProgressTracker: () => (/* binding */ pageProgressTracker)
/* harmony export */ });
/* harmony import */ var _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./runestonebase.js */ 78673);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! marked */ 60023);
/**
 *
 * User: bmiller
 * Original: 2011-04-20
 * Date: 2019-06-14
 * Time: 2:01 PM
 * This change marks the beginning of version 4.0 of the runestone components
 * Login/logout is no longer handled through javascript but rather server side.
 * Many of the components depend on the runestone:login event so we will keep that
 * for now to keep the churn fairly minimal.
 */

/*

 Copyright (C) 2011  Brad Miller  bonelake@gmail.com

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */




var rb = new _runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();

//
// Page decoration functions
//
/*
Maybe something like this at the top:

Active assignment: [Ch 15 reading]      [Exit assignment link]
On page (3 of 7) [Select input showing current page, can select others]
Becoming this if not on a page in assignment

Active assignment: [Ch 15 reading]      [Exit assignment link]
This page is not part of that assignment. Select a page to return to it:
[Select input]
*/
function addReadingList() {
    let assignment_info_string = localStorage.getItem(`currentAssignmentInfo_${eBookConfig.course}`)

    if (assignment_info_string && eBookConfig.readings) {
        var top, bottom, active, page_name, exit_link, fst, snd, new_pos, path_parts, new_pos_link;
        var assignment_info = JSON.parse(assignment_info_string);
        let assignment_id = assignment_info.id;
        let assignment_name = assignment_info.name;
        let reading_names = assignment_info.readingNames;

        active = document.createElement("div");
        active.textContent = "Active assignment: "

        page_name = document.createElement("a");
        page_name.textContent = assignment_name;
        page_name.href = `/assignment/student/doAssignment?assignment_id=${assignment_id}`;

        active.append(page_name);

        exit_link = document.createElement("a");
        exit_link.textContent = " Exit Assignment";
        exit_link.href = window.location.pathname;

        exit_link.addEventListener('click', function(event) {
            localStorage.removeItem(`currentAssignmentInfo_${eBookConfig.course}`);
        });

        //active.append(exit_link)

        let cur_path_parts = window.location.pathname.split("/");
        let name =
            cur_path_parts[cur_path_parts.length - 2] +
            "/" +
            cur_path_parts[cur_path_parts.length - 1];
        // if body has pretext class, then strip the leading path parts from each of the strings in eBookConfig.readings
        let body = document.getElementsByTagName("body")[0];
        let ptxbook = false;
        let endLop = 2;
        if (body.classList.contains("pretext")) {
            ptxbook = true;
            eBookConfig.readings = eBookConfig.readings.map(r => r.split("/").pop());
            name = name.split("/").pop();
            endLop = 1;
        }

        let position = eBookConfig.readings.indexOf(name);
        let num_readings = eBookConfig.readings.length;
        // get prev name
        if (position > 0) {
            new_pos = eBookConfig.readings[position - 1];
            path_parts = cur_path_parts.slice(0, cur_path_parts.length - endLop);
            path_parts.push(new_pos);
            new_pos_link = path_parts.join("/");
            fst = active.cloneNode(true);
            let txt = document.createElement("p");
            txt.textContent = `Page ${position + 1} of ${num_readings}, `;
            var fst_lnk = document.createElement("a");
            //fst_lnk.className = "btn btn-lg reading-navigation prev-reading";
            fst_lnk.href = new_pos_link;
            fst_lnk.textContent = `Back to page ${position
                } of ${num_readings}: ${reading_names[position - 1]}.`;
            txt.append(fst_lnk);
            fst.append(txt);

        } else if (position == 0) {
            fst = active.cloneNode(true);
            let txt = document.createElement("p");
            txt.textContent = `Page 1 of ${num_readings}.`;
            fst.append(txt);
        } else {
            // this isn't a reading page in the assignment, check to see if any
            // activities on this page are assigned to the current assignment
            let exerciseOnPage = false;
            let pageExercises = Object.keys(componentMap);
            if (pageExercises.length == 0) {
                pageExercises = document.querySelectorAll("[data-component]");
                pageExercises = Array.from(pageExercises).map(function(el) {
                    return el.id;
                })
            }
            for (let ex of pageExercises) {
                if (assignment_info.questions.includes(ex)) {
                    exerciseOnPage = true;
                    break;
                }
            }
            new_pos = eBookConfig.readings[0];
            path_parts = cur_path_parts.slice(0, cur_path_parts.length - endLop);
            path_parts.push(new_pos);
            new_pos_link = path_parts.join("/");
            fst = active.cloneNode(true);
            let txt = document.createElement("p");
            if (exerciseOnPage) {
                txt.textContent = "This page has activities assigned to the current assignment.";
            } else {
                txt.textContent = "Notice: this page is not part of the assignment.";
            }
            txt.append(exit_link);
            fst.append(txt);
        }
        if (position == eBookConfig.readings.length - 1) {
            // no more readings
            snd = active;
            let txt = document.createElement("p");
            txt.textContent = `Page ${num_readings} of ${num_readings}: ${reading_names[position]}`;
            snd.append(txt);
        } else if (position >= 0) {
            // get next name
            new_pos = eBookConfig.readings[position + 1];
            path_parts = cur_path_parts.slice(0, cur_path_parts.length - endLop);
            path_parts.push(new_pos);
            new_pos_link = path_parts.join("/");
            snd = active;
            var snd_lnk = document.createElement("a");
            //snd_lnk.className = "btn btn-lg reading-navigation next-reading";
            snd_lnk.href = new_pos_link;
            snd_lnk.textContent = `Continue to page ${position + 2
                } of ${num_readings}: ${reading_names[position + 1]}`;
            let txt = document.createElement("p");
            txt.append(snd_lnk);
            snd.append(txt);

        } else {
            snd = active.cloneNode(true);
            let txt = document.createElement("p");
            txt.textContent = "Notice: this page is not part of the assignment. To remove this warning click ";
            let exit_clone = exit_link.cloneNode(true);

            exit_clone.addEventListener('click', function(event) {
                localStorage.removeItem(`currentAssignmentInfo_${eBookConfig.course}`);
            });
            txt.append(exit_clone);
            snd.append(txt);


        }

        top = document.createElement("div");
        top.className = "ptx-runestone-container"
        fst.className = "runestone assignment-nav top-assignment-nav"
        //top.style.backgroundColor = "var(--componentBgColor)"
        //top.style.borderColor = "var(--componentBorderColor)"
        //top.style.borderWidth = "1px"
        top.append(fst);
        //top.append(snd);

        bottom = document.createElement("div");
        bottom.className = "ptx-runestone-container"
        snd.className = "runestone assignment-nav bottom-assignment-nav"
        //bottom.style.backgroundColor = "var(--componentBgColor)"
        //bottom.style.borderColor = "var(--componentBorderColor)"
        //bottom.style.borderWidth = "1px"

        //bottom.append(active.cloneNode(true));
        //bottom.append(fst.cloneNode(true));
        bottom.append(snd);


        // check the body tag to see if it has a pretext class (no jquery)
        if (ptxbook) {
            //append parts to the header and progress container
            let content = document.getElementById("ptx-content");
            if (content) {
                content.insertBefore(top, content.firstChild);
            }
            let pc = document.getElementById("scprogresscontainer");
            if (pc) {
                pc.style.marginBottom = "20px";
                pc.appendChild(bottom);
            }
            return;
        }
        const mainContent = document.getElementById("main-content");
        if (mainContent && snd) {
            mainContent.insertBefore(top, mainContent.firstChild)
            mainContent.appendChild(bottom);

        }
    }
}

function timedRefresh() {
    var timeoutPeriod = 900000; // 75 minutes
    let idleTimeoutId;

    function onIdle() {
        // After timeout period send the user back to the index.  This will force a login
        // if needed when they want to go to a particular page.  This may not be perfect
        // but its an easy way to make sure laptop users are properly logged in when they
        // take quizzes and save stuff.
        if (location.href.indexOf("index.html") < 0) {
            console.log("Idle timer - " + location.pathname);
            location.href =
                eBookConfig.app +
                "/default/user/login?_next=" +
                location.pathname +
                location.search;
        }
    }

    function resetIdleTimer() {
        if (idleTimeoutId) {
            clearTimeout(idleTimeoutId);
        }
        idleTimeoutId = setTimeout(onIdle, timeoutPeriod);
    }

    ["mousemove", "keydown", "scroll", "click", "touchstart", "wheel"].forEach(
        (eventName) => {
            window.addEventListener(eventName, resetIdleTimer, { passive: true });
        },
    );

    resetIdleTimer();
}

class PageProgressBar {
    constructor(actDict) {
        this.possible = 0;
        this.total = 1;
        if (actDict && "assignment_spec" in actDict) {
            this.assignment_spec = actDict.assignment_spec;
            delete actDict.assignment_spec;
        }
        if (actDict && Object.keys(actDict).length > 0) {
            this.activities = actDict;
        } else {
            let activities = { page: 0 };
            document.querySelectorAll(".runestone").forEach(function(e) {
                activities[e.firstElementChild.id] = 0;
            });
            this.activities = activities;
        }
        this.calculateProgress();
        // Hide the progress bar on the index page.
        if (
            window.location.pathname.match(
                /.*\/(index.html|toctree.html|Exercises.html|search.html)$/i,
            )
        ) {
            const scprogresscontainer = document.getElementById(
                "scprogresscontainer",
            );
            if (scprogresscontainer) scprogresscontainer.style.display = "none";
        }
        this.renderProgress();
    }

    calculateProgress() {
        for (let k in this.activities) {
            if (k !== undefined) {
                this.possible++;
                if (this.activities[k] > 0) {
                    this.total++;
                }
            }
        }
    }

    renderProgress() {
        let value = 0;
        const scprogresstotal = document.getElementById("scprogresstotal");
        if (scprogresstotal) scprogresstotal.textContent = this.total;
        const scprogressposs = document.getElementById("scprogressposs");
        if (scprogressposs) scprogressposs.textContent = this.possible;
        try {
            value = (100 * this.total) / this.possible;
        } catch (e) {
            value = 0;
        }
        // Replace #subchapterprogress div with a native <progress> element if not already done
        let subchapterprogress = document.getElementById("subchapterprogress");
        if (subchapterprogress && subchapterprogress.tagName !== "PROGRESS") {
            // Replace the div with a <progress> element
            const progressElem = document.createElement("progress");
            progressElem.id = "subchapterprogress";
            progressElem.max = 100;
            progressElem.value = value;
            // Copy over any classes from the old div
            progressElem.className = subchapterprogress.className;
            subchapterprogress.replaceWith(progressElem);
            subchapterprogress = progressElem;
        } else if (subchapterprogress) {
            subchapterprogress.max = 100;
            subchapterprogress.value = value;
        }
        if (this.assignment_spec) {
            // If the user has completed all activities, send the reading score.
            // This handles the case where there are no activities on the page or
            //  where the user completed activities on the assignment page and now
            //  is viewing the reading page.
            let completeActivities = this.total; // subtract 1 for the page reading which is in total but not an activity
            let requiredActivities =
                this.assignment_spec.activities_required || 1;
            if (this.assignment_spec.activities_required === null) {
                this.assignment_spec.activities_required = this.possible; // if activities_required is null, then there are none on the page
            }
            if (completeActivities >= requiredActivities) {
                this.sendCompletedReadingScore().then(() => {
                    console.log("Reading score sent for page");
                    // wait a tick then mark the page complete
                    // this is needed to let the progress bar update before marking complete
                    setTimeout(() => {
                        let cb = document.getElementById("completionButton");
                        if (
                            cb &&
                            cb.textContent.toLowerCase() === "mark as completed"
                        ) {
                            cb.click();
                        }
                    }, 500);
                });
            }
        }
        if (!eBookConfig.isLoggedIn) {
            const subchapterDiv = document.getElementById("subchapterprogress");
            if (subchapterDiv) subchapterDiv.classList.add("loggedout");
        }
    }

    updateProgress(div_id) {
        this.activities[div_id]++;
        // Only update the progress bar on the first interaction with an object.
        if (this.activities[div_id] === 1) {
            this.total++;
            let val = (100 * this.total) / this.possible;
            const scprogresstotal2 = document.getElementById("scprogresstotal");
            if (scprogresstotal2) scprogresstotal2.textContent = this.total;
            const scprogressposs2 = document.getElementById("scprogressposs");
            if (scprogressposs2) scprogressposs2.textContent = this.possible;
            let subchapterprogress2 =
                document.getElementById("subchapterprogress");
            if (
                subchapterprogress2 &&
                subchapterprogress2.tagName === "PROGRESS"
            ) {
                subchapterprogress2.value = val;
            }
            if (
                this.assignment_spec &&
                this.assignment_spec.activities_required !== null &&
                this.total >= this.assignment_spec.activities_required
            ) {
                console.log("Required activities completed");
                this.sendCompletedReadingScore().then(() => {
                    console.log("Reading score sent");
                });
            }
            if (
                val == 100.0 &&
                (function() {
                    const cb = document.getElementById("completionButton");
                    return (
                        cb &&
                        cb.textContent &&
                        cb.textContent.toLowerCase() === "mark as completed"
                    );
                })()
            ) {
                const cb = document.getElementById("completionButton");
                if (cb && typeof cb.click === "function") {
                    cb.click();
                }
            }
        }
    }

    async sendCompletedReadingScore() {
        let headers = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
        let data = { ...this.assignment_spec };
        let request = new Request(
            `${eBookConfig.new_server_prefix}/logger/update_reading_score`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: headers,
            },
        );
        try {
            let response = await fetch(request);
            if (!response.ok) {
                console.error(
                    `Failed to send reading score! ${response.statusText}`,
                );
            }
            data = await response.json();
        } catch (e) {
            console.error(`Error sending reading score ${e}`);
        }
    }
}

var pageProgressTracker = {};

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

let studyCluesConversationId = -1;

function appendStudyCluesMessage(messagesEl, role, text, isHtml = false) {
    const bubble = document.createElement("div");
    bubble.className = `studyclues-message ${role}`;
    if (isHtml) {
        bubble.innerHTML = text;
    } else {
        bubble.textContent = text;
    }
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function createStudyCluesWidget() {
    if (document.getElementById("studyclues-fab")) {
        return;
    }

    const style = document.createElement("style");
    style.textContent = `
        #studyclues-fab {
            position: fixed;
            right: 24px;
            bottom: 24px;
            z-index: 9999;
            border: none;
            border-radius: 9999px;
            padding: 12px 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            color: #fff;
            background: #2563eb;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        #studyclues-chat {
            position: fixed;
            right: 24px;
            bottom: 78px;
            z-index: 9999;
            width: min(420px, calc(100vw - 32px));
            height: min(520px, calc(100vh - 120px));
            background: #fff;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            box-shadow: 0 14px 36px rgba(0, 0, 0, 0.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
        }

        #studyclues-chat.open {
            display: flex;
        }

        .studyclues-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 600;
            background: #f9fafb;
        }

        .studyclues-close {
            border: none;
            background: transparent;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        }

        .studyclues-coach-toggle {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            font-weight: 500;
            color: #4b5563;
        }

        .studyclues-coach-toggle input[type="checkbox"] {
            appearance: none;
            -webkit-appearance: none;
            width: 32px;
            height: 18px;
            border-radius: 9999px;
            background: #d1d5db;
            cursor: pointer;
            position: relative;
            transition: background 0.2s;
            flex-shrink: 0;
        }

        .studyclues-coach-toggle input[type="checkbox"]::after {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #fff;
            transition: transform 0.2s;
        }

        .studyclues-coach-toggle input[type="checkbox"]:checked {
            background: #2563eb;
        }

        .studyclues-coach-toggle input[type="checkbox"]:checked::after {
            transform: translateX(14px);
        }

        .studyclues-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #f8fafc;
        }

        .studyclues-message {
            max-width: 85%;
            padding: 10px 12px;
            border-radius: 10px;
            white-space: pre-wrap;
            word-break: break-word;
            font-size: 14px;
            line-height: 1.4;
        }

        .studyclues-message.user {
            margin-left: auto;
            background: #dbeafe;
            border: 1px solid #bfdbfe;
        }

        .studyclues-message.assistant {
            margin-right: auto;
            background: #fff;
            border: 1px solid #e5e7eb;
        }

        .studyclues-message.studyclues-loading {
            color: #6b7280;
            font-style: italic;
        }

        .studyclues-spinner {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .studyclues-spinner-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #6b7280;
            opacity: 0.35;
            animation: studyclues-dot-pulse 1s infinite ease-in-out;
        }

        .studyclues-spinner-dot:nth-child(2) {
            animation-delay: 0.15s;
        }

        .studyclues-spinner-dot:nth-child(3) {
            animation-delay: 0.3s;
        }

        @keyframes studyclues-dot-pulse {
            0%,
            80%,
            100% {
                opacity: 0.35;
                transform: scale(1);
            }
            40% {
                opacity: 1;
                transform: scale(1.2);
            }
        }

        .studyclues-inputbar {
            display: flex;
            gap: 8px;
            padding: 10px;
            border-top: 1px solid #e5e7eb;
            background: #fff;
        }

        .studyclues-inputbar input {
            flex: 1;
            min-width: 0;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 14px;
        }

        .studyclues-inputbar button {
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            cursor: pointer;
            color: #fff;
            background: #2563eb;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);

    const button = document.createElement("button");
    button.id = "studyclues-fab";
    button.textContent = "StudyClues Chat";

    const chat = document.createElement("div");
    chat.id = "studyclues-chat";
    chat.innerHTML = `
        <div class="studyclues-header">
            <span>StudyClues</span>
            <label class="studyclues-coach-toggle">
                <input type="checkbox" id="studyclues-coach-mode" checked />
                Coach Mode
            </label>
            <button class="studyclues-close" aria-label="Close chat">✕</button>
        </div>
        <div class="studyclues-messages"></div>
        <div class="studyclues-inputbar">
            <input type="text" placeholder="Ask a question about this course..." />
            <button type="button">Send</button>
        </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(chat);

    const closeBtn = chat.querySelector(".studyclues-close");
    const messagesEl = chat.querySelector(".studyclues-messages");
    const inputEl = chat.querySelector(".studyclues-inputbar input");
    const sendBtn = chat.querySelector(".studyclues-inputbar button");
    const coachToggle = chat.querySelector("#studyclues-coach-mode");

    let coachMode = coachToggle.checked;
    coachToggle.addEventListener("change", () => {
        coachMode = coachToggle.checked;
    });

    const toggleChat = () => {
        chat.classList.toggle("open");
        if (chat.classList.contains("open")) {
            inputEl.focus();
        }
    };

    const sendMessage = async () => {
        let query = inputEl.value.trim();
        if (!query) {
            return;
        }
        var sectionInfo = "";
        // find the section title on the page to include in the initial query
        if (document.querySelector("body.pretext")) {
            let section = document.querySelector('section.section');
            let sectionTitle = section.querySelector('span.title').innerText;
            let sectionNumber = section.querySelector('span.codenumber').innerText;
            sectionInfo = `${sectionNumber} ${sectionTitle}`;
        } else {
            let sectionSpan = document.querySelector("span.section-number");
            if (sectionSpan) {
                sectionInfo = sectionSpan.parentElement.innerText.trim();
            }
        }
        if (studyCluesConversationId === -1) {
            if (sectionInfo) {
                query = `Regarding section "${sectionInfo}": ${query}`;
            }
        }
        rb.logBookEvent({ event: "studyclues_query", act: `query: ${query}`, div_id: `${sectionInfo}` });
        appendStudyCluesMessage(messagesEl, "user", query); // todo: make this conditional on being a book page and on the book being one of the supported books
        inputEl.value = "";
        sendBtn.disabled = true;

        const loadingBubble = document.createElement("div");
        loadingBubble.className =
            "studyclues-message assistant studyclues-loading";
        loadingBubble.innerHTML =
            'Thinking <span class="studyclues-spinner"><span class="studyclues-spinner-dot"></span><span class="studyclues-spinner-dot"></span><span class="studyclues-spinner-dot"></span></span>';
        messagesEl.appendChild(loadingBubble);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        try {
            const response = await fetch(
                `/assignment/student/studyclues_query`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        query,
                        conversation_id: studyCluesConversationId,
                        coachMode,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const payload = await response.json();
            const detail = payload?.detail || {};
            const studycluesResponse = detail?.response || {};
            const llmResponse = studycluesResponse?.llm_response;
            const references = studycluesResponse?.references || {};

            if (typeof detail.conversation_id === "number") {
                studyCluesConversationId = detail.conversation_id;
            }

            const markdownResponse = (llmResponse || "No response available from StudyClues.").replace(
                /\[([^\]]+)\]\(([^)]+)\)/g,
                (match, text, key) => {
                    const url = references[key]?.content_url;
                    return url ? `[${text}](${url})` : match;
                },
            );
            const formattedResponse = marked__WEBPACK_IMPORTED_MODULE_1__.marked.parse(markdownResponse);

            appendStudyCluesMessage(
                messagesEl,
                "assistant",
                formattedResponse,
                true,
            );
        } catch (err) {
            appendStudyCluesMessage(
                messagesEl,
                "assistant",
                "Sorry, StudyClues is unavailable right now. Please try again.",
            );
            console.error("StudyClues chat error:", err);
        } finally {
            loadingBubble.remove();
            sendBtn.disabled = false;
            inputEl.focus();
        }
    };

    button.addEventListener("click", toggleChat);
    closeBtn.addEventListener("click", toggleChat);
    sendBtn.addEventListener("click", sendMessage);
    inputEl.addEventListener("keydown", (evt) => {
        if (evt.key === "Enter") {
            evt.preventDefault();
            sendMessage();
        }
    });
}

function shouldShowStudyCluesWidget() {
    if (!(location.pathname.includes("/ns/books/") || location.pathname.includes("doAssignment"))) {
        return false;
    }


    const enabledBasecourses = ["csawesome2", "py4e-int", "thinkcspy", "httlacs", "PTXSB", "cppds2"];
    const enabledCourses = ["SI201-W26-MW", "SI201-W26-TTh", "DukeCS101SP26",
        "mcd-csa-schoology", "mcd-csa-canvas", "csawesome2-MOOC",
        "test_py4e-int_api", "bc_cppds_s26", "Test-py4e-int",
        "virginiatech_py4e-int_spring26", "umsi101_fall26"
    ];
    const host = window.location.hostname;

    if (host === "localhost") {
        return enabledBasecourses.includes(eBookConfig.basecourse);
    }

    if (host === "runestone.academy") {
        return enabledCourses.includes(eBookConfig.course);
    }

    return false;
}

async function handlePageSetup() {
    var mess;
    if (eBookConfig.useRunestoneServices) {
        let headers = new Headers({
            "Content-type": "application/json; charset=utf-8",
            Accept: "application/json",
        });
        let data = {
            timezoneoffset: new Date().getTimezoneOffset() / 60,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        let RS_info = getCookie("RS_info");
        var tz_match = false;
        if (RS_info) {
            try {
                let cleaned = RS_info.replace(/\\054/g, ","); // handle octal comma encoding
                let info = JSON.parse(decodeURIComponent(cleaned));
                info = JSON.parse(decodeURIComponent(info));
                if (
                    info.timezone === data.timezone &&
                    info.tz_offset === data.timezoneoffset
                ) {
                    console.log(
                        "Timezone cookie matches, not sending timezone to server",
                    );
                    tz_match = true;
                }
            } catch (e) {
                console.error(
                    "Error parsing RS_info cookie, sending timezone to server",
                );
            }
        }
        if (tz_match === false) {
            // Set a cookie so we don't have to do this again for a while.
            let request = new Request(
                `${eBookConfig.new_server_prefix}/logger/set_tz_offset`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: headers,
                },
            );
            try {
                let response = await fetch(request);
                if (!response.ok) {
                    console.error(
                        `Failed to set timezone! ${response.statusText}`,
                    );
                }
                data = await response.json();
            } catch (e) {
                console.error(`Error setting timezone ${e}`);
            }
        }
    }
    console.log(`This page served by ${eBookConfig.served_by}`);
    if (eBookConfig.isLoggedIn) {
        mess = `username: ${eBookConfig.username}`;
        if (!eBookConfig.isInstructor) {
            const ipDropdown = document.getElementById("ip_dropdown_link");
            if (ipDropdown && typeof ipDropdown.remove === "function") {
                ipDropdown.remove();
            }
            const instPeer = document.getElementById("inst_peer_link");
            if (instPeer && typeof instPeer.remove === "function") {
                instPeer.remove();
            }
        }
        document.dispatchEvent(new Event("runestone:login"));
        addReadingList();
        // Only show the StudyClues widget for certain base courses and when the path includes "/ns/books/".
        // This is a temporary measure to limit the widget to courses that are known to work well with it and to avoid showing it on non-book pages where it may not be as useful.
        if (shouldShowStudyCluesWidget()) {
            createStudyCluesWidget();
        }
        // Avoid the timedRefresh on the grading page.
        if (
            window.location.pathname.indexOf("/admin/grading") == -1 &&
            window.location.pathname.indexOf("/peer/") == -1
        ) {
            timedRefresh();
        }
    } else {
        mess = "Not logged in";
        document.dispatchEvent(new Event("runestone:logout"));
        let bw = document.getElementById("browsing_warning");
        if (bw) {
            bw.innerHTML =
                "<p class='navbar_message'>Saving and Logging are Disabled</p>";
        }
        let aw = document.getElementById("ad_warning");
        if (aw) {
            aw.innerHTML =
                "<p class='navbar_message'>🚫 Log-in to Remove <a href='/runestone/default/ads'>Ads!</a> 🚫 &nbsp;</p>";
        }
    }
    document.querySelectorAll(".loggedinuser").forEach((el) => {
        el.innerHTML = mess;
    });

    pageProgressTracker = new PageProgressBar(eBookConfig.activities);
    notifyRunestoneComponents();
}

function setupNavbarLoggedIn() {
    const profileLink = document.getElementById("profilelink");
    if (profileLink) profileLink.style.removeProperty("display");
    const passwordLink = document.getElementById("passwordlink");
    if (passwordLink) passwordLink.style.removeProperty("display");
    const registerLink = document.getElementById("registerlink");
    if (registerLink) registerLink.style.display = "none";
    document.querySelectorAll("li.loginout").forEach((el) => {
        el.innerHTML =
            '<a href="/admin/auth/logout">Log Out</a>';
    });
}
document.addEventListener("runestone:login", setupNavbarLoggedIn);

function setupNavbarLoggedOut() {
    if (eBookConfig.useRunestoneServices) {
        console.log("setup navbar for logged out");
        const registerLink = document.getElementById("registerlink");
        if (registerLink) registerLink.style.removeProperty("display");
        const profileLink = document.getElementById("profilelink");
        if (profileLink) profileLink.style.display = "none";
        const passwordLink = document.getElementById("passwordlink");
        if (passwordLink) passwordLink.style.display = "none";
        const ipDropdown = document.getElementById("ip_dropdown_link");
        if (ipDropdown) ipDropdown.style.display = "none";
        const instPeer = document.getElementById("inst_peer_link");
        if (instPeer) instPeer.style.display = "none";
        document.querySelectorAll("li.loginout").forEach((el) => {
            el.innerHTML =
                '<a href="' +
                eBookConfig.app +
                '/default/user/login">Login</a>';
        });
        document.querySelectorAll(".footer").forEach((el) => {
            el.innerHTML = "user not logged in";
        });
    }
}
document.addEventListener("runestone:logout", setupNavbarLoggedOut);

function notifyRunestoneComponents() {
    // Runestone components wait until login process is over to load components because of storage issues. This triggers the `dynamic import machinery`, which then sends the login complete signal when this and all dynamic imports are finished.
    console.log("triggering runestone:pre-login-complete");
    document.dispatchEvent(new Event("runestone:pre-login-complete"));
}

function placeAdCopy() {
    if (typeof showAd !== "undefined" && showAd) {
        let adNum = Math.floor(Math.random() * 2) + 1;
        let adBlock = document.getElementById(`adcopy_${adNum}`);
        let rsElements = document.querySelectorAll(".runestone");
        if (rsElements.length > 0) {
            let randomIndex = Math.floor(Math.random() * rsElements.length);
            rsElements[randomIndex].after(adBlock);
            adBlock.style.display = "block";
        }
    }
}

// initialize stuff
document.addEventListener("DOMContentLoaded", function() {
    if (eBookConfig) {
        handlePageSetup();
        placeAdCopy();
    } else {
        if (typeof eBookConfig === "undefined") {
            console.log(
                "eBookConfig is not defined.  This page must not be set up for Runestone",
            );
        }
    }
});

// misc stuff
// todo:  This could be further distributed but making a video.js file just for one function seems dumb.
window.addEventListener("load", function() {
    // add the video play button overlay image
    document.querySelectorAll(".video-play-overlay").forEach(function(el) {
        el.style.backgroundImage =
            "url('{{pathto('_static/play_overlay_icon.png', 1)}}')";
    });

    // This function is needed to allow the dropdown search bar to work;
    // The default behaviour is that the dropdown menu closes when something in
    // it (like the search bar) is clicked
    document
        .querySelectorAll(".dropdown input, .dropdown label")
        .forEach(function(el) {
            el.addEventListener("click", function(e) {
                e.stopPropagation();
            });
        });

    // re-write some urls
    // This is tricker than it looks and you have to obey the rules for # anchors
    // The #anchors must come after the query string as the server basically ignores any part
    // of a url that comes after # - like a comment...
    if (location.href.includes("mode=browsing")) {
        let queryString = "?mode=browsing";
        document.querySelectorAll("a").forEach((link) => {
            let anchorText = "";
            if (
                link.href.includes("books/published") &&
                !link.href.includes("?mode=browsing")
            ) {
                if (link.href.includes("#")) {
                    let aPoint = link.href.indexOf("#");
                    anchorText = link.href.substring(aPoint);
                    link.href = link.href.substring(0, aPoint);
                }
                link.href = link.href.includes("?") ?
                    link.href + queryString.replace("?", "&") + anchorText :
                    link.href + queryString + anchorText;
            }
        });
    }
});

// The Bust Menu
/*
Course Home
Assignments
Progress
Peer Instruction (Student)
------
Instructor Dashboard
Peer Instruction (Instructor)
Author Interface (optional)
Editor Interface (optional)
Request Invoice
------
Change Course
Profile
Log Out
*/
window.addEventListener("DOMContentLoaded", function(event) {

    const oldDropDown = this.document.querySelector(".dropdown-content[data-deprecated]");
    if (oldDropDown)
        oldDropDown.remove();

    const itemTemplate = this.document.getElementById("ptx-user-dropdown-content_item-template");
    const sepTemplate = this.document.getElementById("ptx-user-dropdown-content_separator-template");
    const menuContentArea = this.document.getElementById("ptx-user-dropdown_rs-content");

    if (!itemTemplate || !sepTemplate || !menuContentArea) {
        console.error("Missing required template or content area for user dropdown");
        return;
    }

    function makeLink(url, title, ariaLabel = null) {
        // All we should assume about the item template is that it has an anchor element
        const link = itemTemplate.content.cloneNode(true);
        const linkAnchor = link.querySelector("a");
        linkAnchor.href = url;
        linkAnchor.innerText = title;
        if (ariaLabel) {
            linkAnchor.ariaLabel = ariaLabel;
        }
        // return entire item template, not just link
        return link;
    }

    menuContentArea.appendChild(makeLink("/ns/course/index", "Course Home"));
    menuContentArea.appendChild(makeLink("/runestone/assignments/chooseAssignment", "Assignments"));
    menuContentArea.appendChild(makeLink("/assignment/peer/student", "Peer Instruction (Student)"));
    menuContentArea.appendChild(makeLink("/assignment/student/studentreport", "Progress"));
    if (eBookConfig.isInstructor) {
        menuContentArea.appendChild(sepTemplate.content.cloneNode(true));
        menuContentArea.appendChild(makeLink("/admin/instructor/menu", "Instructor Dashboard"));
        menuContentArea.appendChild(makeLink("/assignment/peer/instructor",
            "Peer Instruction (Instructor)"));
        if (eBookConfig.isAuthor) {
            menuContentArea.appendChild(makeLink("https://author.runestone.academy/author/",
                "Author Dashboard"));
        }
        if (eBookConfig.isEditor) {
            menuContentArea.appendChild(makeLink("https://author.runestone.academy/author/",
                "Editor Dashboard"));
        }
        menuContentArea.appendChild(makeLink("/assignment/instructor/invoice_request",
            "Request Invoice"));
    }
    menuContentArea.appendChild(sepTemplate.content.cloneNode(true));
    menuContentArea.appendChild(makeLink("/admin/auth/my_courses", "Change Course"));
    menuContentArea.appendChild(makeLink("/admin/auth/profile", "Profile"));
    menuContentArea.appendChild(makeLink("/admin/auth/logout", "Log Out"));
});

/**
 * Returns true if the string appears to contain LaTeX math.
 */
function looksLikeLatexMath(text) {
    if (typeof text !== "string") return false;

    // Common LaTeX math delimiters
    const mathDelimiters = [
        /\$\$[\s\S]+?\$\$/, // $$ ... $$
        /\$[^$\n]+?\$/, // $ ... $
        /\\\[[\s\S]+?\\\]/, // \[ ... \]
        /\\\([\s\S]+?\\\)/, // \( ... \)
    ];

    // Common math commands (avoid generic \text or \ref-only cases)
    const mathCommands =
        /\\(frac|sqrt|sum|prod|int|lim|sin|cos|tan|log|ln|alpha|beta|gamma|pi|theta|sigma|Delta|cdot|times|leq|geq|neq)\b/;

    // Superscripts/subscripts like x^2 or a_i
    const superSubScript = /[a-zA-Z0-9]\s*[\^_]\s*\{?.+?\}?/;

    return (
        mathDelimiters.some((re) => re.test(text)) ||
        mathCommands.test(text) ||
        superSubScript.test(text)
    );
}


/***/ }),

/***/ 94564:
/*!**************************************!*\
  !*** ./runestone/common/js/theme.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSwitch: () => (/* binding */ getSwitch),
/* harmony export */   switchTheme: () => (/* binding */ switchTheme)
/* harmony export */ });
function getSwitch() {
    const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }
}

function switchTheme() {

	var checkBox = document.getElementById("checkbox");
    if (checkBox.checked == true) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark'); //add this
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light'); //add this
    }
}


/***/ }),

/***/ 98098:
/*!************************************************!*\
  !*** ./runestone/common/js/renderComponent.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTimedComponent: () => (/* binding */ createTimedComponent),
/* harmony export */   renderOneComponent: () => (/* binding */ renderOneComponent),
/* harmony export */   renderRunestoneComponent: () => (/* binding */ renderRunestoneComponent)
/* harmony export */ });
/* harmony import */ var _webpack_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../webpack.index.js */ 80184);


async function renderRunestoneComponent(
    componentSrc,
    whereDiv,
    moreOpts
) {
    /**
     *  The easy part is adding the componentSrc to the existing div.
     *  The tedious part is calling the right functions to turn the
     *  source into the actual component.
     */
    if (!componentSrc) {
        jQuery(`#${whereDiv}`).html(
            `<p>Sorry, no source is available for preview.</p>`
        );
        return;
    }
    let patt = /..\/_images/g;
    componentSrc = componentSrc.replace(
        patt,
        `${eBookConfig.app}/books/published/${eBookConfig.basecourse}/_images`
    );
    jQuery(`#${whereDiv}`).html(componentSrc);

    if (typeof window.componentMap === "undefined") {
        window.componentMap = {};
    }

    let componentKind = $($(`#${whereDiv} [data-component]`)[0]).data(
        "component"
    );
    // Import the JavaScript for this component before proceeding.
    await (0,_webpack_index_js__WEBPACK_IMPORTED_MODULE_0__.runestone_import)(componentKind);
    let opt = {};
    opt.orig = jQuery(`#${whereDiv} [data-component]`)[0];
    if (opt.orig) {
        opt.lang = $(opt.orig).data("lang");
        opt.useRunestoneServices = true;
        opt.graderactive = false;
        opt.python3 = true;
        if (typeof moreOpts !== "undefined") {
            for (let key in moreOpts) {
                opt[key] = moreOpts[key];
            }
        }
    }

    if (typeof component_factory === "undefined") {
        alert("Error:  Missing the component factory!");
    } else {
        if (
            !window.component_factory[componentKind] &&
            !jQuery(`#${whereDiv}`).html()
        ) {
            jQuery(`#${whereDiv}`).html(
                `<p>Preview not available for ${componentKind}</p>`
            );
        } else {
            let res = window.component_factory[componentKind](opt);
            if (componentKind === "activecode") {
                if (moreOpts.multiGrader) {
                    window.componentMap[
                        `${moreOpts.gradingContainer} ${res.divid}`
                    ] = res;
                } else {
                    window.componentMap[res.divid] = res;
                }
            }
        }
    }
}

function createTimedComponent(componentSrc, moreOpts) {
    /* The important distinction is that the component does not really need to be rendered
    into the page, in fact, due to the async nature of getting the source the list of questions
    is made and the original html is replaced by the look of the exam.
    */

    let patt = /..\/_images/g;
    componentSrc = componentSrc.replace(
        patt,
        `${eBookConfig.app}/books/published/${eBookConfig.basecourse}/_images`
    );

    let componentKind = $($(componentSrc).find("[data-component]")[0]).data(
        "component"
    );

    let origId = $(componentSrc).find("[data-component]").first().attr("id");

    // Double check -- if the component source is not in the DOM, then briefly add it
    // and call the constructor.
    let hdiv;
    if (!document.getElementById(origId)) {
        hdiv = $("<div/>", {
            css: { display: "none" },
        }).appendTo("body");
        hdiv.html(componentSrc);
    }
    // at this point hdiv is a jquery object

    let ret;
    let opts = {
        orig: document.getElementById(origId),
        timed: true,
    };
    if (typeof moreOpts !== "undefined") {
        for (let key in moreOpts) {
            opts[key] = moreOpts[key];
        }
    }

    if (componentKind in window.component_factory) {
        ret = window.component_factory[componentKind](opts);
    }

    let rdict = {};
    rdict.question = ret;
    return rdict;
}

// For integration with the React overhault of Pretext
// 1. Disable the automatic instantiation at the end of each component.js
// 2. react will search for all ".runestone" and will call this function for each of them.
async function renderOneComponent(rsDiv) {
    // Find the actual component inside the runestone component.
    let component = rsDiv.querySelector("[data-component]");
    if (component == null) {
        console.log("Render was called for a component, but now [data-component] attribute is present. This may mean the component has already been rendered.")
        return;
    }
    let componentKind = component.dataset.component;
    await (0,_webpack_index_js__WEBPACK_IMPORTED_MODULE_0__.runestone_import)(componentKind);
    if ($(this).closest("[data-component=timedAssessment]").length == 0) {
        // If this element exists within a timed component, don't render it here
        try {
            let divid = component.id;
            window.componentMap[divid] = window.component_factory[
                componentKind
            ]({
                orig: component,
                useRunestoneServices: eBookConfig.useRunestoneServices,
            });
        } catch (err) {
            console.log(`Error rendering ${componentKind} Problem ${this.id}
                         Details: ${err}`);
        }
    }
}


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendors-node_modules_bootstrap_dist_js_bootstrap_js-node_modules_jquery-ui_jquery-ui_js-node_-9caadc"], () => (__webpack_exec__(80184)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ25JRDtBQUNBOztBQUVBOztBQUUrQzs7QUFFL0M7QUFDQSxpQkFBaUIseURBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsOENBQThDO0FBQzVFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDZDQUE2QztBQUMvRTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsMkNBQTJDO0FBQ3pFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3ZERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQzNORDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDekxEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7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QUFFO0FBQzNEO0FBQ0E7QUFDQTs7QUFFTzs7QUFFUDtBQUNBLHFCQUFxQixFQUFFLGdCQUFnQjtBQUN2QyxpQ0FBaUMsRUFBRSxLQUFLO0FBQ3hDLHVEQUF1RDtBQUN2RDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNkNBQTZDLEtBQUs7QUFDbEQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FB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QTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3REFBd0QsTUFBTTtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNENBQTRDO0FBQ2hFLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ087QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvREFBb0QsTUFBTTs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVvQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QjZEOztBQUV0RDtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQixtQkFBbUIsdUJBQXVCO0FBQ3JFO0FBQ0EsZUFBZSxTQUFTOztBQUV4QjtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDLFVBQVU7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsVUFBVSxtRUFBZ0I7QUFDMUI7QUFDQSwwQkFBMEIsVUFBVTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEMsZ0RBQWdELGNBQWM7QUFDOUQ7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCLEVBQUUsVUFBVTtBQUNsRTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQixtQkFBbUIsdUJBQXVCO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxtRUFBZ0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDViwyQ0FBMkMsZUFBZSxVQUFVO0FBQ3BFLG9DQUFvQyxJQUFJO0FBQ3hDO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL3Byb2plY3RfdGVtcGxhdGUvX3RlbXBsYXRlcy9wbHVnaW5fbGF5b3V0cy9zcGhpbnhfYm9vdHN0cmFwL3N0YXRpYy9ib290c3RyYXAtc3BoaW54LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXRleHQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZmFsbGJhY2tzLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmxhbmd1YWdlLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmVtaXR0ZXIuYmlkaS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzL2V4dGVybmFsIHZhciBcImpRdWVyeVwiIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5sZXNzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmVtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4ucGFyc2VyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLm1lc3NhZ2VzdG9yZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnlfaTE4bi9qcXVlcnkuaTE4bi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5LmlkbGUtdGltZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zcGxpY2UvanMvc3BsaWNlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcHR4cnMtYm9vdHN0cmFwLmxlc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL3VzZXItaGlnaGxpZ2h0cy5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vd2VicGFjay5pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9ib29rZnVuY3MuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvdGhlbWUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcmVuZGVyQ29tcG9uZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoJCkge1xuICAvKipcbiAgICogUGF0Y2ggVE9DIGxpc3QuXG4gICAqXG4gICAqIFdpbGwgbXV0YXRlIHRoZSB1bmRlcmx5aW5nIHNwYW4gdG8gaGF2ZSBhIGNvcnJlY3QgdWwgZm9yIG5hdi5cbiAgICpcbiAgICogQHBhcmFtICRzcGFuOiBTcGFuIGNvbnRhaW5pbmcgbmVzdGVkIFVMJ3MgdG8gbXV0YXRlLlxuICAgKiBAcGFyYW0gbWluTGV2ZWw6IFN0YXJ0aW5nIGxldmVsIGZvciBuZXN0ZWQgbGlzdHMuICgxOiBnbG9iYWwsIDI6IGxvY2FsKS5cbiAgICovXG4gIHZhciBwYXRjaFRvYyA9IGZ1bmN0aW9uICgkdWwsIG1pbkxldmVsKSB7XG4gICAgdmFyIGZpbmRBLFxuICAgICAgcGF0Y2hUYWJsZXMsXG4gICAgICAkbG9jYWxMaTtcblxuICAgIC8vIEZpbmQgYWxsIGEgXCJpbnRlcm5hbFwiIHRhZ3MsIHRyYXZlcnNpbmcgcmVjdXJzaXZlbHkuXG4gICAgZmluZEEgPSBmdW5jdGlvbiAoJGVsZW0sIGxldmVsKSB7XG4gICAgICBsZXZlbCA9IGxldmVsIHx8IDA7XG4gICAgICB2YXIgJGl0ZW1zID0gJGVsZW0uZmluZChcIj4gbGkgPiBhLmludGVybmFsLCA+IHVsLCA+IGxpID4gdWxcIik7XG5cbiAgICAgIC8vIEl0ZXJhdGUgZXZlcnl0aGluZyBpbiBvcmRlci5cbiAgICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICB2YXIgJGl0ZW0gPSAkKGl0ZW0pLFxuICAgICAgICAgIHRhZyA9IGl0ZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICRjaGlsZHJlbkxpID0gJGl0ZW0uY2hpbGRyZW4oJ2xpJyksXG4gICAgICAgICAgJHBhcmVudExpID0gJCgkaXRlbS5wYXJlbnQoJ2xpJyksICRpdGVtLnBhcmVudCgpLnBhcmVudCgnbGknKSk7XG5cbiAgICAgICAgLy8gQWRkIGRyb3Bkb3ducyBpZiBtb3JlIGNoaWxkcmVuIGFuZCBhYm92ZSBtaW5pbXVtIGxldmVsLlxuICAgICAgICBpZiAodGFnID09PSAndWwnICYmIGxldmVsID49IG1pbkxldmVsICYmICRjaGlsZHJlbkxpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAkcGFyZW50TGlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tc3VibWVudScpXG4gICAgICAgICAgICAuY2hpbGRyZW4oJ2EnKS5maXJzdCgpLmF0dHIoJ3RhYmluZGV4JywgLTEpO1xuXG4gICAgICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBKCRpdGVtLCBsZXZlbCArIDEpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZpbmRBKCR1bCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhdGNoIGFsbCB0YWJsZXMgdG8gcmVtb3ZlIGBgZG9jdXRpbHNgYCBjbGFzcyBhbmQgYWRkIEJvb3RzdHJhcCBiYXNlXG4gICAqIGBgdGFibGVgYCBjbGFzcy5cbiAgICovXG4gIHBhdGNoVGFibGVzID0gZnVuY3Rpb24gKCkge1xuICAgICQoXCJ0YWJsZS5kb2N1dGlsc1wiKVxuICAgICAgLnJlbW92ZUNsYXNzKFwiZG9jdXRpbHNcIilcbiAgICAgIC5hZGRDbGFzcyhcInRhYmxlXCIpXG4gICAgICAuYXR0cihcImJvcmRlclwiLCAwKTtcbiAgfTtcblxuJChmdW5jdGlvbiAoKSB7XG5cbiAgICAvKlxuICAgICAqIFNjcm9sbCB0aGUgd2luZG93IHRvIGF2b2lkIHRoZSB0b3BuYXYgYmFyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3aXR0ZXIvYm9vdHN0cmFwL2lzc3Vlcy8xNzY4XG4gICAgICovXG4gICAgaWYgKCQoXCIjbmF2YmFyLm5hdmJhci1maXhlZC10b3BcIikubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIG5hdkhlaWdodCA9ICQoXCIjbmF2YmFyXCIpLmhlaWdodCgpLFxuICAgICAgICBzaGlmdFdpbmRvdyA9IGZ1bmN0aW9uKCkgeyBzY3JvbGxCeSgwLCAtbmF2SGVpZ2h0IC0gMTApOyB9O1xuXG4gICAgICBpZiAobG9jYXRpb24uaGFzaCkge1xuICAgICAgICBzaGlmdFdpbmRvdygpO1xuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgc2hpZnRXaW5kb3cpO1xuICAgIH1cblxuICAgIC8vIEFkZCBzdHlsaW5nLCBzdHJ1Y3R1cmUgdG8gVE9DJ3MuXG4gICAgJChcIi5kcm9wZG93bi1tZW51XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJCh0aGlzKS5maW5kKFwidWxcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pe1xuICAgICAgICB2YXIgJGl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAkaXRlbS5hZGRDbGFzcygndW5zdHlsZWQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gR2xvYmFsIFRPQy5cbiAgICBpZiAoJChcInVsLmdsb2JhbHRvYyBsaVwiKS5sZW5ndGgpIHtcbiAgICAgIHBhdGNoVG9jKCQoXCJ1bC5nbG9iYWx0b2NcIiksIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZW1vdmUgR2xvYmFsIFRPQy5cbiAgICAgICQoXCIuZ2xvYmFsdG9jLWNvbnRhaW5lclwiKS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvLyBMb2NhbCBUT0MuXG4gICAgcGF0Y2hUb2MoJChcInVsLmxvY2FsdG9jXCIpLCAyKTtcblxuICAgIC8vIE11dGF0ZSBzdWItbGlzdHMgKGZvciBicy0yLjMuMCkuXG4gICAgJChcIi5kcm9wZG93bi1tZW51IHVsXCIpLm5vdChcIi5kcm9wZG93bi1tZW51XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR1bCA9ICQodGhpcyksXG4gICAgICAgICRwYXJlbnQgPSAkdWwucGFyZW50KCksXG4gICAgICAgIHRhZyA9ICRwYXJlbnRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAka2lkcyA9ICR1bC5jaGlsZHJlbigpLmRldGFjaCgpO1xuXG4gICAgICAvLyBSZXBsYWNlIGxpc3Qgd2l0aCBpdGVtcyBpZiBzdWJtZW51IGhlYWRlci5cbiAgICAgIGlmICh0YWcgPT09IFwidWxcIikge1xuICAgICAgICAkdWwucmVwbGFjZVdpdGgoJGtpZHMpO1xuICAgICAgfSBlbHNlIGlmICh0YWcgPT09IFwibGlcIikge1xuICAgICAgICAvLyBJbnNlcnQgaW50byBwcmV2aW91cyBsaXN0LlxuICAgICAgICAkcGFyZW50LmFmdGVyKCRraWRzKTtcbiAgICAgICAgJHVsLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGRpdmlkZXIgaW4gcGFnZSBUT0MuXG4gICAgJGxvY2FsTGkgPSAkKFwidWwubG9jYWx0b2MgbGlcIik7XG4gICAgaWYgKCRsb2NhbExpLmxlbmd0aCA+IDIpIHtcbiAgICAgICRsb2NhbExpLmZpcnN0KCkuYWZ0ZXIoJzxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPicpO1xuICAgIH1cblxuICAgIC8vIEVuYWJsZSBkcm9wZG93bi5cbiAgICAkKCcuZHJvcGRvd24tdG9nZ2xlJykuZHJvcGRvd24oKTtcblxuICAgIC8vIFBhdGNoIHRhYmxlcy5cbiAgICBwYXRjaFRhYmxlcygpO1xuXG4gICAgLy8gQWRkIE5vdGUsIFdhcm5pbmcgc3R5bGVzLlxuICAgICQoJ2Rpdi5ub3RlJykuYWRkQ2xhc3MoJ2FsZXJ0JykuYWRkQ2xhc3MoJ2FsZXJ0LWluZm8nKTtcbiAgICAkKCdkaXYud2FybmluZycpLmFkZENsYXNzKCdhbGVydCcpLmFkZENsYXNzKCdhbGVydC13YXJuaW5nJyk7XG5cbiAgICAvLyBJbmxpbmUgY29kZSBzdHlsZXMgdG8gQm9vdHN0cmFwIHN0eWxlLlxuICAgICQoJ3R0LmRvY3V0aWxzLmxpdGVyYWwnKS5ub3QoXCIueHJlZlwiKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgICAvLyBpZ25vcmUgcmVmZXJlbmNlc1xuICAgICAgaWYgKCEkKGUpLnBhcmVudCgpLmhhc0NsYXNzKFwicmVmZXJlbmNlXCIpKSB7XG4gICAgICAgICQoZSkucmVwbGFjZVdpdGgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkKFwiPGNvZGUgLz5cIikudGV4dCgkKHRoaXMpLnRleHQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfX0pO1xuICB9KTtcbn0od2luZG93LmpRdWVyeSkpO1xuIiwiLypcbiAgICBTdXBwb3J0IGZ1bmN0aW9ucyBmb3IgUHJlVGVYdCBib29rcyBydW5uaW5nIG9uIFJ1bmVzdG9uZVxuXG4qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi9ydW5lc3RvbmViYXNlLmpzXCI7XG5cbmZ1bmN0aW9uIHNldHVwUFRYRXZlbnRzKCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBrbm93bCBpcyBvcGVuZWQuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWtub3dsXVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGRpdl9pZCA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEta25vd2xcIik7XG4gICAgICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJrbm93bFwiLCBhY3Q6IFwiY2xpY2tcIiwgZGl2X2lkOiBkaXZfaWQgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGxldCBib3JuX2hpZGRlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkZXRhaWxzLmJvcm4taGlkZGVuLWtub3dsXCIpO1xuICAgIGJvcm5faGlkZGVuLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIC8vIGxvZyBhbiBldmVudCB3aGVuIGEga25vd2wgaXMgb3BlbmVkIHRoYXQgd2FzIGJvcm4gaGlkZGVuXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b2dnbGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGVsLm9wZW4pIHtcbiAgICAgICAgICAgICAgICBsZXQgZGl2X2lkID0gZWwuaWQ7XG4gICAgICAgICAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwia25vd2xcIiwgYWN0OiBcIm9wZW5cIiwgZGl2X2lkOiBkaXZfaWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8vIGxvZyBhbiBldmVudCB3aGVuIGEgc2FnZSBjZWxsIGlzIGV2YWx1YXRlZFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2FnZWNlbGxfZXZhbEJ1dHRvblwiKS5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyID0gYnRuLmNsb3Nlc3QoXCIucHR4LXNhZ2VjZWxsXCIpO1xuICAgICAgICAgICAgbGV0IGNvZGVJbnB1dCA9IGNvbnRhaW5lciA/IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnNhZ2VjZWxsX2lucHV0XCIpIDogbnVsbDtcbiAgICAgICAgICAgIGxldCBjb2RlID0gY29kZUlucHV0ID8gY29kZUlucHV0LnRleHRDb250ZW50IDogXCJcIjtcbiAgICAgICAgICAgIGxldCBkaXZfaWQgPSBjb250YWluZXIgPyBjb250YWluZXIuaWQgOiBudWxsO1xuICAgICAgICAgICAgaWYgKCEgZGl2X2lkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGZpbmQgY29udGFpbmVyIG9yIGRpdl9pZCBmb3Igc2FnZWNlbGwgYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcInNhZ2VcIiwgYWN0OiBcInJ1blwiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBlQm9va0NvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWVudGFyeVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHByZXRleHRcIik7XG4gICAgc2V0dXBQVFhFdmVudHMoKTtcbiAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeS1uYXZiYXItc3RpY2t5LXdyYXBwZXJcIik7XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgd3JhcC5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgIH1cbn0pO1xuIiwidmFyIGNvZGVFeGVyY2lzZXM7XG52YXIgcHJlc2VudGVyQ3NzTGluaztcbnZhciBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXNlbnRUb2dnbGUoKSB7XG4gICAgaWYgKCFwcmVzZW50TW9kZUluaXRpYWxpemVkKSB7XG4gICAgICAgIHByZXNlbnRNb2RlU2V0dXAoKTtcbiAgICAgICAgcHJlc2VudE1vZGVJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICAgIGxldCBib2QgPSAkKFwiYm9keVwiKTtcbiAgICBsZXQgcHJlc2VudENsYXNzID0gXCJwcmVzZW50XCI7XG4gICAgbGV0IGZ1bGxIZWlnaHRDbGFzcyA9IFwiZnVsbC1oZWlnaHRcIjtcbiAgICBsZXQgYm90dG9tQ2xhc3MgPSBcImJvdHRvbVwiO1xuICAgIGlmIChib2QuaGFzQ2xhc3MocHJlc2VudENsYXNzKSkge1xuICAgICAgICAkKFwic2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIHNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpOyAvL3Nob3cgZXZlcnl0aGluZ1xuICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5yZW1vdmVDbGFzcyhwcmVzZW50Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgZnVsbEhlaWdodENsYXNzKS5yZW1vdmVDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgYm90dG9tQ2xhc3MpLnJlbW92ZUNsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBcInRleHRcIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIHByZXNlbnRlckNzc0xpbmsuZGlzYWJsZWQgPSB0cnVlOyAvLyBkaXNhYmxlIHByZXNlbnRfbW9kZS5jc3NcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKFwic2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIHNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiaGlkZGVuXCIpOyAvLyBoaWRlIGV4dHJhbmVvdXMgc3R1ZmZcbiAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QuYWRkQ2xhc3MocHJlc2VudENsYXNzKTtcbiAgICAgICAgYm9kLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJzZWN0aW9uIC5ydW5lc3RvbmVcIikuYWRkQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcIi5hYy1jYXB0aW9uXCIpLmFkZENsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBwcmVzZW50Q2xhc3MpO1xuICAgICAgICAvLyBwcmVzZW50ZXJfbW9kZS5jc3MgaXMgbG9hZGVkIGJ5IHdlYnBhY2tcbiAgICAgICAgLy9sb2FkUHJlc2VudGVyQ3NzKCk7IC8vIHByZXNlbnRfbW9kZS5jc3Mgc2hvdWxkIG9ubHkgYXBwbHkgd2hlbiBpbiBwcmVzZW50ZXIgbW9kZS5cbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZFByZXNlbnRlckNzcygpIHtcbiAgICBwcmVzZW50ZXJDc3NMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgcHJlc2VudGVyQ3NzTGluay50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgIHByZXNlbnRlckNzc0xpbmsuaHJlZiA9IFwiLi4vX3N0YXRpYy9wcmVzZW50ZXJfbW9kZS5sZXNzXCI7XG4gICAgcHJlc2VudGVyQ3NzTGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQocHJlc2VudGVyQ3NzTGluayk7XG59XG5cbmZ1bmN0aW9uIHByZXNlbnRNb2RlU2V0dXAoKSB7XG4gICAgLy8gbW92ZWQgdGhpcyBvdXQgb2YgY29uZmlndXJlXG4gICAgbGV0IGRhdGFDb21wb25lbnQgPSAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpO1xuXG4gICAgLy8gdGhpcyBzdGlsbCBsZWF2ZXMgc29tZSB0aGluZ3Mgc2VtaS1tZXNzZWQgdXAgd2hlbiB5b3UgZXhpdCBwcmVzZW50ZXIgbW9kZS5cbiAgICAvLyBidXQgaW5zdHJ1Y3RvcnMgd2lsbCBwcm9iYWJseSBqdXN0IGxlYXJuIHRvIHJlZnJlc2ggdGhlIHBhZ2UuXG4gICAgZGF0YUNvbXBvbmVudC5hZGRDbGFzcyhcInJ1bmVzdG9uZVwiKTtcbiAgICBkYXRhQ29tcG9uZW50LnBhcmVudCgpLmNsb3Nlc3QoXCJkaXZcIikubm90KFwic2VjdGlvblwiKS5hZGRDbGFzcyhcInJ1bmVzdG9uZVwiKTtcbiAgICBkYXRhQ29tcG9uZW50LnBhcmVudCgpLmNsb3Nlc3QoXCJkaXZcIikuY3NzKFwibWF4LXdpZHRoXCIsIFwibm9uZVwiKTtcblxuICAgIGRhdGFDb21wb25lbnQuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgbGV0IG1lID0gJCh0aGlzKTtcbiAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgLmZpbmQoXCIuYWNfY29kZV9kaXYsIC5hY19vdXRwdXRcIilcbiAgICAgICAgICAgIC53cmFwQWxsKFwiPGRpdiBjbGFzcz0nYWMtYmxvY2snIHN0eWxlPSd3aWR0aDogMTAwJTsnPjwvZGl2PlwiKTtcbiAgICB9KTtcblxuICAgIGNvZGVsZW5zTGlzdGVuZXIoNTAwKTtcbiAgICAkKFwic2VjdGlvbiBpbWdcIikud3JhcCgnPGRpdiBjbGFzcz1cInJ1bmVzdG9uZVwiPicpO1xuICAgIGNvZGVFeGVyY2lzZXMgPSAkKFwiLnJ1bmVzdG9uZVwiKS5ub3QoXCIucnVuZXN0b25lIC5ydW5lc3RvbmVcIik7XG4gICAgLy8gY29kZUV4ZXJjaXNlcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgJChcImgxXCIpLmJlZm9yZShcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcmVzZW50YXRpb24tdGl0bGUnPiBcXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPSdwcmV2LWV4ZXJjaXNlIGJ0bi1wcmVzZW50ZXIgYnRuLWdyZXktb3V0bGluZScgb25jbGljaz0ncHJldkV4ZXJjaXNlKCknPkJhY2s8L2J1dHRvbj4gXFxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dC1leGVyY2lzZSBidG4tcHJlc2VudGVyIGJ0bi1ncmV5LXNvbGlkJyBvbmNsaWNrPSduZXh0RXhlcmNpc2UoKSc+TmV4dDwvYnV0dG9uPiBcXFxuICAgICAgPC9kaXY+XCJcbiAgICApO1xufVxuZnVuY3Rpb24gZ2V0QWN0aXZlRXhlcmNpc2UoKSB7XG4gICAgcmV0dXJuIChhY3RpdmUgPSBjb2RlRXhlcmNpc2VzLmZpbHRlcihcIi5hY3RpdmVcIikpO1xufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZUV4ZXJjaXNlKGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGluZGV4ID0gMDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcblxuICAgIGlmIChjb2RlRXhlcmNpc2VzLmxlbmd0aCkge1xuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZSA9ICQoY29kZUV4ZXJjaXNlc1tpbmRleF0pLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMubm90KGNvZGVFeGVyY2lzZXMuZmlsdGVyKFwiLmFjdGl2ZVwiKSkuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgfVxufVxuXG53aW5kb3cubmV4dEV4ZXJjaXNlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZSA9IGdldEFjdGl2ZUV4ZXJjaXNlKCk7XG4gICAgbGV0IG5leHRJbmRleCA9IGNvZGVFeGVyY2lzZXMuaW5kZXgoYWN0aXZlKSArIDE7XG4gICAgaWYgKG5leHRJbmRleCA8IGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UobmV4dEluZGV4KTtcbiAgICB9XG59XG5cbndpbmRvdy5wcmV2RXhlcmNpc2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcbiAgICBsZXQgcHJldkluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleChhY3RpdmUpIC0gMTtcbiAgICBpZiAocHJldkluZGV4ID49IDApIHtcbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZShwcmV2SW5kZXgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29uZmlndXJlKCkge1xuICAgIGxldCByaWdodE5hdiA9ICQoXCIubmF2YmFyLXJpZ2h0XCIpO1xuICAgIHJpZ2h0TmF2LnByZXBlbmQoXG4gICAgICAgIFwiPGxpIGNsYXNzPSdkcm9wZG93biB2aWV3LXRvZ2dsZSc+IFxcXG4gICAgICA8bGFiZWw+VmlldzogXFxcbiAgICAgICAgPHNlbGVjdCBjbGFzcz0nbW9kZS1zZWxlY3QnPiBcXFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3RleHQnPlRleHRib29rPC9vcHRpb24+IFxcXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0ncHJlc2VudCc+Q29kZSBQcmVzZW50ZXI8L29wdGlvbj4gXFxcbiAgICAgICAgPC9zZWxlY3Q+IFxcXG4gICAgICA8L2xhYmVsPiBcXFxuICAgIDwvbGk+XCJcbiAgICApO1xuXG4gICAgbGV0IG1vZGVTZWxlY3QgPSAkKFwiLm1vZGUtc2VsZWN0XCIpLmNoYW5nZShwcmVzZW50VG9nZ2xlKTtcbn1cblxuZnVuY3Rpb24gY29kZWxlbnNMaXN0ZW5lcihkdXJhdGlvbikge1xuICAgIC8vICQoXCIuRXhlY3V0aW9uVmlzdWFsaXplclwiKS5sZW5ndGggPyBjb25maWd1cmVDb2RlbGVucygpIDogc2V0VGltZW91dChjb2RlbGVuc0xpc3RlbmVyLCBkdXJhdGlvbik7XG4gICAgLy8gY29uZmlndXJlQ29kZWxlbnMoKTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlQ29kZWxlbnMoKSB7XG4gICAgbGV0IGFjQ29kZVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGFjQ29kZVRpdGxlLnRleHRDb250ZW50ID0gXCJBY3RpdmUgQ29kZSBXaW5kb3dcIjtcbiAgICBsZXQgYWNDb2RlID0gJChcIi5hY19jb2RlX2RpdlwiKTtcbiAgICAkKFwiLmFjX2NvZGVfZGl2XCIpLmFkZENsYXNzKFwiY29sLW1kLTZcIik7XG4gICAgYWNDb2RlLnByZXBlbmQoYWNDb2RlVGl0bGUpO1xuXG4gICAgYWNPdXRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBhY091dFRpdGxlLnRleHRDb250ZW50ID0gXCJPdXRwdXQgV2luZG93XCI7XG4gICAgbGV0IGFjT3V0ID0gJChcIi5hY19vdXRwdXRcIikuYWRkQ2xhc3MoXCJjb2wtbWQtNlwiKTtcbiAgICAkKFwiLmFjX291dHB1dFwiKS5wcmVwZW5kKGFjT3V0VGl0bGUpO1xuXG4gICAgbGV0IHNrZXRjaHBhZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIHNrZXRjaHBhZFRpdGxlLnRleHRDb250ZW50ID0gXCJTa2V0Y2hwYWRcIjtcbiAgICBsZXQgc2tldGNocGFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgJChza2V0Y2hwYWQpLmFkZENsYXNzKFwic2tldGNocGFkXCIpO1xuICAgIGxldCBza2V0Y2hwYWRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICQoc2tldGNocGFkQ29udGFpbmVyKS5hZGRDbGFzcyhcInNrZXRjaHBhZC1jb250YWluZXJcIik7XG4gICAgc2tldGNocGFkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNrZXRjaHBhZFRpdGxlKTtcbiAgICBza2V0Y2hwYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc2tldGNocGFkKTtcbiAgICAvLyQoJy5hY19vdXRwdXQnKS5hcHBlbmQoc2tldGNocGFkQ29udGFpbmVyKTtcblxuICAgIGxldCB2aXN1YWxpemVycyA9ICQoXCIuRXhlY3V0aW9uVmlzdWFsaXplclwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiRWNvbnRhaW5lcjogXCIsIHRoaXMuZUNvbnRhaW5lcik7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLm9uKFwiY2xpY2tcIiwgXCJidXR0b24ucm93LW1vZGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikucmVtb3ZlQ2xhc3MoXCJjYXJkLW1vZGVcIik7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5hZGRDbGFzcyhcInJvdy1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLm5leHQoXCIuY2FyZC1tb2RlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLm9uKFwiY2xpY2tcIiwgXCJidXR0b24uY2FyZC1tb2RlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLnJlbW92ZUNsYXNzKFwicm93LW1vZGVcIik7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5hZGRDbGFzcyhcImNhcmQtbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5wcmV2KFwiLnJvdy1tb2RlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdIC5hY19zZWN0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnByZXBlbmQoXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZXNlbnRhdGlvbi1vcHRpb25zXCI+PGJ1dHRvbiBjbGFzcz1cInJvdy1tb2RlIGxheW91dC1idG5cIj48aW1nIHNyYz1cIi4uL19pbWFnZXMvcm93LWJ0bi1jb250ZW50LnBuZ1wiIGFsdD1cIlJvd3NcIj48L2J1dHRvbj48YnV0dG9uIGNsYXNzPVwiY2FyZC1tb2RlIGxheW91dC1idG5cIj48aW1nIHNyYz1cIi4uL19pbWFnZXMvY2FyZC1idG4tY29udGVudC5wbmdcIiBhbHQ9XCJDYXJkXCI+PC9idXR0b24+PC9kaXY+J1xuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgdmlzdWFsaXplcnMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgbGV0IG1lID0gJCh0aGlzKTtcbiAgICAgICAgbGV0IGNvbDEgPSBtZS5maW5kKFwiI3ZpekxheW91dFRkRmlyc3RcIik7XG4gICAgICAgIGxldCBjb2wyID0gbWUuZmluZChcIiN2aXpMYXlvdXRUZFNlY29uZFwiKTtcbiAgICAgICAgbGV0IGRhdGFWaXMgPSBtZS5maW5kKFwiI2RhdGFWaXpcIik7XG4gICAgICAgIGxldCBzdGFja0hlYXBUYWJsZSA9IG1lLmZpbmQoXCIjc3RhY2tIZWFwVGFibGVcIik7XG4gICAgICAgIGxldCBvdXRwdXQgPSBtZS5maW5kKFwiI3Byb2dPdXRwdXRzXCIpO1xuICAgICAgICBvdXRwdXQuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgICAgICBtZS5wYXJlbnQoKS5wcmVwZW5kKFxuICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcmVzZW50YXRpb24tdGl0bGUnPjxkaXYgY2xhc3M9J3RpdGxlLXRleHQnPiBFeGFtcGxlIFwiICtcbiAgICAgICAgICAgICAgICAoTnVtYmVyKGluZGV4KSArIDEpICtcbiAgICAgICAgICAgICAgICBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICBhY0NvZGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gJCh0aGlzKS5jbG9zZXN0KFwiLmFjLWJsb2NrXCIpLnBhcmVudCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhzZWN0aW9uLCBzZWN0aW9uLmxlbmd0aCk7XG4gICAgICAgIHNlY3Rpb24uYXBwZW5kKHNrZXRjaHBhZENvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICAkKFwiYnV0dG9uLmNhcmQtbW9kZVwiKS5jbGljaygpO1xuXG4gICAgbGV0IG1vZGVTZWxlY3QgPSAkKFwiLm1vZGUtc2VsZWN0XCIpO1xuICAgIGxldCBtb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwcmVzZW50TW9kZVwiKTtcbiAgICBpZiAobW9kZSA9PSBcInByZXNlbnRcIikge1xuICAgICAgICBtb2RlU2VsZWN0LnZhbChcInByZXNlbnRcIik7XG4gICAgICAgIG1vZGVTZWxlY3QuY2hhbmdlKCk7XG4gICAgfVxufVxuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgdXNlciBpcyBpbnN0cnVjdG9yLCBlbmFibGUgcHJlc2VudGVyIG1vZGVcbiAgICBpZiAoZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGNvbmZpZ3VyZSgpO1xuICAgIH1cbn0pO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBTYW50aG9zaCBUaG90dGluZ2FsXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZyBzcGVjaWFsIHRvXG4gKiBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0byBub3RpZnkgYW55b25lIHdoaWNoIGxpY2Vuc2UgeW91IGFyZSB1c2luZy5cbiAqIFlvdSBhcmUgZnJlZSB0byB1c2UgVW5pdmVyc2FsTGFuZ3VhZ2VTZWxlY3RvciBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodFxuICogaGVhZGVyIGlzIGxlZnQgaW50YWN0LiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHQkLmkxOG4gPSAkLmkxOG4gfHwge307XG5cdCQuZXh0ZW5kKCAkLmkxOG4uZmFsbGJhY2tzLCB7XG5cdFx0YWI6IFsgJ3J1JyBdLFxuXHRcdGFjZTogWyAnaWQnIF0sXG5cdFx0YWxuOiBbICdzcScgXSxcblx0XHQvLyBOb3Qgc28gc3RhbmRhcmQgLSBhbHMgaXMgc3VwcG9zZWQgdG8gYmUgVG9zayBBbGJhbmlhbixcblx0XHQvLyBidXQgaW4gV2lraXBlZGlhIGl0J3MgdXNlZCBmb3IgYSBHZXJtYW5pYyBsYW5ndWFnZS5cblx0XHRhbHM6IFsgJ2dzdycsICdkZScgXSxcblx0XHRhbjogWyAnZXMnIF0sXG5cdFx0YW5wOiBbICdoaScgXSxcblx0XHRhcm46IFsgJ2VzJyBdLFxuXHRcdGFyejogWyAnYXInIF0sXG5cdFx0YXY6IFsgJ3J1JyBdLFxuXHRcdGF5OiBbICdlcycgXSxcblx0XHRiYTogWyAncnUnIF0sXG5cdFx0YmFyOiBbICdkZScgXSxcblx0XHQnYmF0LXNtZyc6IFsgJ3NncycsICdsdCcgXSxcblx0XHRiY2M6IFsgJ2ZhJyBdLFxuXHRcdCdiZS14LW9sZCc6IFsgJ2JlLXRhcmFzaycgXSxcblx0XHRiaDogWyAnYmhvJyBdLFxuXHRcdGJqbjogWyAnaWQnIF0sXG5cdFx0Ym06IFsgJ2ZyJyBdLFxuXHRcdGJweTogWyAnYm4nIF0sXG5cdFx0YnFpOiBbICdmYScgXSxcblx0XHRidWc6IFsgJ2lkJyBdLFxuXHRcdCdjYmstemFtJzogWyAnZXMnIF0sXG5cdFx0Y2U6IFsgJ3J1JyBdLFxuXHRcdGNyaDogWyAnY3JoLWxhdG4nIF0sXG5cdFx0J2NyaC1jeXJsJzogWyAncnUnIF0sXG5cdFx0Y3NiOiBbICdwbCcgXSxcblx0XHRjdjogWyAncnUnIF0sXG5cdFx0J2RlLWF0JzogWyAnZGUnIF0sXG5cdFx0J2RlLWNoJzogWyAnZGUnIF0sXG5cdFx0J2RlLWZvcm1hbCc6IFsgJ2RlJyBdLFxuXHRcdGRzYjogWyAnZGUnIF0sXG5cdFx0ZHRwOiBbICdtcycgXSxcblx0XHRlZ2w6IFsgJ2l0JyBdLFxuXHRcdGVtbDogWyAnaXQnIF0sXG5cdFx0ZmY6IFsgJ2ZyJyBdLFxuXHRcdGZpdDogWyAnZmknIF0sXG5cdFx0J2ZpdS12cm8nOiBbICd2cm8nLCAnZXQnIF0sXG5cdFx0ZnJjOiBbICdmcicgXSxcblx0XHRmcnA6IFsgJ2ZyJyBdLFxuXHRcdGZycjogWyAnZGUnIF0sXG5cdFx0ZnVyOiBbICdpdCcgXSxcblx0XHRnYWc6IFsgJ3RyJyBdLFxuXHRcdGdhbjogWyAnZ2FuLWhhbnQnLCAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCdnYW4taGFucyc6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J2dhbi1oYW50JzogWyAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdGdsOiBbICdwdCcgXSxcblx0XHRnbGs6IFsgJ2ZhJyBdLFxuXHRcdGduOiBbICdlcycgXSxcblx0XHRnc3c6IFsgJ2RlJyBdLFxuXHRcdGhpZjogWyAnaGlmLWxhdG4nIF0sXG5cdFx0aHNiOiBbICdkZScgXSxcblx0XHRodDogWyAnZnInIF0sXG5cdFx0aWk6IFsgJ3poLWNuJywgJ3poLWhhbnMnIF0sXG5cdFx0aW5oOiBbICdydScgXSxcblx0XHRpdTogWyAnaWtlLWNhbnMnIF0sXG5cdFx0anV0OiBbICdkYScgXSxcblx0XHRqdjogWyAnaWQnIF0sXG5cdFx0a2FhOiBbICdray1sYXRuJywgJ2trLWN5cmwnIF0sXG5cdFx0a2JkOiBbICdrYmQtY3lybCcgXSxcblx0XHRraHc6IFsgJ3VyJyBdLFxuXHRcdGtpdTogWyAndHInIF0sXG5cdFx0a2s6IFsgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWFyYWInOiBbICdray1jeXJsJyBdLFxuXHRcdCdray1sYXRuJzogWyAna2stY3lybCcgXSxcblx0XHQna2stY24nOiBbICdray1hcmFiJywgJ2trLWN5cmwnIF0sXG5cdFx0J2trLWt6JzogWyAna2stY3lybCcgXSxcblx0XHQna2stdHInOiBbICdray1sYXRuJywgJ2trLWN5cmwnIF0sXG5cdFx0a2w6IFsgJ2RhJyBdLFxuXHRcdCdrby1rcCc6IFsgJ2tvJyBdLFxuXHRcdGtvaTogWyAncnUnIF0sXG5cdFx0a3JjOiBbICdydScgXSxcblx0XHRrczogWyAna3MtYXJhYicgXSxcblx0XHRrc2g6IFsgJ2RlJyBdLFxuXHRcdGt1OiBbICdrdS1sYXRuJyBdLFxuXHRcdCdrdS1hcmFiJzogWyAnY2tiJyBdLFxuXHRcdGt2OiBbICdydScgXSxcblx0XHRsYWQ6IFsgJ2VzJyBdLFxuXHRcdGxiOiBbICdkZScgXSxcblx0XHRsYmU6IFsgJ3J1JyBdLFxuXHRcdGxlejogWyAncnUnIF0sXG5cdFx0bGk6IFsgJ25sJyBdLFxuXHRcdGxpajogWyAnaXQnIF0sXG5cdFx0bGl2OiBbICdldCcgXSxcblx0XHRsbW86IFsgJ2l0JyBdLFxuXHRcdGxuOiBbICdmcicgXSxcblx0XHRsdGc6IFsgJ2x2JyBdLFxuXHRcdGx6ejogWyAndHInIF0sXG5cdFx0bWFpOiBbICdoaScgXSxcblx0XHQnbWFwLWJtcyc6IFsgJ2p2JywgJ2lkJyBdLFxuXHRcdG1nOiBbICdmcicgXSxcblx0XHRtaHI6IFsgJ3J1JyBdLFxuXHRcdG1pbjogWyAnaWQnIF0sXG5cdFx0bW86IFsgJ3JvJyBdLFxuXHRcdG1yajogWyAncnUnIF0sXG5cdFx0bXdsOiBbICdwdCcgXSxcblx0XHRteXY6IFsgJ3J1JyBdLFxuXHRcdG16bjogWyAnZmEnIF0sXG5cdFx0bmFoOiBbICdlcycgXSxcblx0XHRuYXA6IFsgJ2l0JyBdLFxuXHRcdG5kczogWyAnZGUnIF0sXG5cdFx0J25kcy1ubCc6IFsgJ25sJyBdLFxuXHRcdCdubC1pbmZvcm1hbCc6IFsgJ25sJyBdLFxuXHRcdG5vOiBbICduYicgXSxcblx0XHRvczogWyAncnUnIF0sXG5cdFx0cGNkOiBbICdmcicgXSxcblx0XHRwZGM6IFsgJ2RlJyBdLFxuXHRcdHBkdDogWyAnZGUnIF0sXG5cdFx0cGZsOiBbICdkZScgXSxcblx0XHRwbXM6IFsgJ2l0JyBdLFxuXHRcdHB0OiBbICdwdC1icicgXSxcblx0XHQncHQtYnInOiBbICdwdCcgXSxcblx0XHRxdTogWyAnZXMnIF0sXG5cdFx0cXVnOiBbICdxdScsICdlcycgXSxcblx0XHRyZ246IFsgJ2l0JyBdLFxuXHRcdHJteTogWyAncm8nIF0sXG5cdFx0J3JvYS1ydXAnOiBbICdydXAnIF0sXG5cdFx0cnVlOiBbICd1aycsICdydScgXSxcblx0XHRydXE6IFsgJ3J1cS1sYXRuJywgJ3JvJyBdLFxuXHRcdCdydXEtY3lybCc6IFsgJ21rJyBdLFxuXHRcdCdydXEtbGF0bic6IFsgJ3JvJyBdLFxuXHRcdHNhOiBbICdoaScgXSxcblx0XHRzYWg6IFsgJ3J1JyBdLFxuXHRcdHNjbjogWyAnaXQnIF0sXG5cdFx0c2c6IFsgJ2ZyJyBdLFxuXHRcdHNnczogWyAnbHQnIF0sXG5cdFx0c2xpOiBbICdkZScgXSxcblx0XHRzcjogWyAnc3ItZWMnIF0sXG5cdFx0c3JuOiBbICdubCcgXSxcblx0XHRzdHE6IFsgJ2RlJyBdLFxuXHRcdHN1OiBbICdpZCcgXSxcblx0XHRzemw6IFsgJ3BsJyBdLFxuXHRcdHRjeTogWyAna24nIF0sXG5cdFx0dGc6IFsgJ3RnLWN5cmwnIF0sXG5cdFx0dHQ6IFsgJ3R0LWN5cmwnLCAncnUnIF0sXG5cdFx0J3R0LWN5cmwnOiBbICdydScgXSxcblx0XHR0eTogWyAnZnInIF0sXG5cdFx0dWRtOiBbICdydScgXSxcblx0XHR1ZzogWyAndWctYXJhYicgXSxcblx0XHR1azogWyAncnUnIF0sXG5cdFx0dmVjOiBbICdpdCcgXSxcblx0XHR2ZXA6IFsgJ2V0JyBdLFxuXHRcdHZsczogWyAnbmwnIF0sXG5cdFx0dm1mOiBbICdkZScgXSxcblx0XHR2b3Q6IFsgJ2ZpJyBdLFxuXHRcdHZybzogWyAnZXQnIF0sXG5cdFx0d2E6IFsgJ2ZyJyBdLFxuXHRcdHdvOiBbICdmcicgXSxcblx0XHR3dXU6IFsgJ3poLWhhbnMnIF0sXG5cdFx0eGFsOiBbICdydScgXSxcblx0XHR4bWY6IFsgJ2thJyBdLFxuXHRcdHlpOiBbICdoZScgXSxcblx0XHR6YTogWyAnemgtaGFucycgXSxcblx0XHR6ZWE6IFsgJ25sJyBdLFxuXHRcdHpoOiBbICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1jbGFzc2ljYWwnOiBbICdsemgnIF0sXG5cdFx0J3poLWNuJzogWyAnemgtaGFucycgXSxcblx0XHQnemgtaGFudCc6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLWhrJzogWyAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1taW4tbmFuJzogWyAnbmFuJyBdLFxuXHRcdCd6aC1tbyc6IFsgJ3poLWhrJywgJ3poLWhhbnQnLCAnemgtaGFucycgXSxcblx0XHQnemgtbXknOiBbICd6aC1zZycsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC1zZyc6IFsgJ3poLWhhbnMnIF0sXG5cdFx0J3poLXR3JzogWyAnemgtaGFudCcsICd6aC1oYW5zJyBdLFxuXHRcdCd6aC15dWUnOiBbICd5dWUnIF1cblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIGdsb2JhbCBwbHVyYWxSdWxlUGFyc2VyICovXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIGpzY3M6ZGlzYWJsZVxuXHR2YXIgbGFuZ3VhZ2UgPSB7XG5cdFx0Ly8gQ0xEUiBwbHVyYWwgcnVsZXMgZ2VuZXJhdGVkIHVzaW5nXG5cdFx0Ly8gbGlicy9DTERSUGx1cmFsUnVsZVBhcnNlci90b29scy9QbHVyYWxYTUwySlNPTi5odG1sXG5cdFx0cGx1cmFsUnVsZXM6IHtcblx0XHRcdGFrOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGFtOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGFyOiB7XG5cdFx0XHRcdHplcm86ICduID0gMCcsXG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduICUgMTAwID0gMy4uMTAnLFxuXHRcdFx0XHRtYW55OiAnbiAlIDEwMCA9IDExLi45OSdcblx0XHRcdH0sXG5cdFx0XHRhcnM6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMicsXG5cdFx0XHRcdGZldzogJ24gJSAxMDAgPSAzLi4xMCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAwID0gMTEuLjk5J1xuXHRcdFx0fSxcblx0XHRcdGFzOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGJlOiB7XG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICduICUgMTAgPSAyLi40IGFuZCBuICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAgPSAwIG9yIG4gJSAxMCA9IDUuLjkgb3IgbiAlIDEwMCA9IDExLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRiaDoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRibjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRicjoge1xuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExLDcxLDkxJyxcblx0XHRcdFx0dHdvOiAnbiAlIDEwID0gMiBhbmQgbiAlIDEwMCAhPSAxMiw3Miw5MicsXG5cdFx0XHRcdGZldzogJ24gJSAxMCA9IDMuLjQsOSBhbmQgbiAlIDEwMCAhPSAxMC4uMTksNzAuLjc5LDkwLi45OScsXG5cdFx0XHRcdG1hbnk6ICduICE9IDAgYW5kIG4gJSAxMDAwMDAwID0gMCdcblx0XHRcdH0sXG5cdFx0XHRiczoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdGNzOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ2kgPSAyLi40IGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0Y3k6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMicsXG5cdFx0XHRcdGZldzogJ24gPSAzJyxcblx0XHRcdFx0bWFueTogJ24gPSA2J1xuXHRcdFx0fSxcblx0XHRcdGRhOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxIG9yIHQgIT0gMCBhbmQgaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRkc2I6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAxIG9yIGYgJSAxMDAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAyIG9yIGYgJSAxMDAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAzLi40IG9yIGYgJSAxMDAgPSAzLi40J1xuXHRcdFx0fSxcblx0XHRcdGZhOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJ1xuXHRcdFx0fSxcblx0XHRcdGZmOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0ZmlsOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpID0gMSwyLDMgb3IgdiA9IDAgYW5kIGkgJSAxMCAhPSA0LDYsOSBvciB2ICE9IDAgYW5kIGYgJSAxMCAhPSA0LDYsOSdcblx0XHRcdH0sXG5cdFx0XHRmcjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCwxJ1xuXHRcdFx0fSxcblx0XHRcdGdhOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAxJyxcblx0XHRcdFx0dHdvOiAnbiA9IDInLFxuXHRcdFx0XHRmZXc6ICduID0gMy4uNicsXG5cdFx0XHRcdG1hbnk6ICduID0gNy4uMTAnXG5cdFx0XHR9LFxuXHRcdFx0Z2Q6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEsMTEnLFxuXHRcdFx0XHR0d286ICduID0gMiwxMicsXG5cdFx0XHRcdGZldzogJ24gPSAzLi4xMCwxMy4uMTknXG5cdFx0XHR9LFxuXHRcdFx0Z3U6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0Z3V3OiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGd2OiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMCA9IDInLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDAsMjAsNDAsNjAsODAnLFxuXHRcdFx0XHRtYW55OiAndiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGhlOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdHR3bzogJ2kgPSAyIGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgbiAhPSAwLi4xMCBhbmQgbiAlIDEwID0gMCdcblx0XHRcdH0sXG5cdFx0XHRoaToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRocjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdGhzYjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDEgb3IgZiAlIDEwMCA9IDEnLFxuXHRcdFx0XHR0d286ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDIgb3IgZiAlIDEwMCA9IDInLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwMCA9IDMuLjQgb3IgZiAlIDEwMCA9IDMuLjQnXG5cdFx0XHR9LFxuXHRcdFx0aHk6IHtcblx0XHRcdFx0b25lOiAnaSA9IDAsMSdcblx0XHRcdH0sXG5cdFx0XHRpczoge1xuXHRcdFx0XHRvbmU6ICd0ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciB0ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0aXU6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRpdzoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHR0d286ICdpID0gMiBhbmQgdiA9IDAnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIG4gIT0gMC4uMTAgYW5kIG4gJSAxMCA9IDAnXG5cdFx0XHR9LFxuXHRcdFx0a2FiOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLDEnXG5cdFx0XHR9LFxuXHRcdFx0a246IHtcblx0XHRcdFx0b25lOiAnaSA9IDAgb3IgbiA9IDEnXG5cdFx0XHR9LFxuXHRcdFx0a3c6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRsYWc6IHtcblx0XHRcdFx0emVybzogJ24gPSAwJyxcblx0XHRcdFx0b25lOiAnaSA9IDAsMSBhbmQgbiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGxuOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdGx0OiB7XG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEuLjE5Jyxcblx0XHRcdFx0ZmV3OiAnbiAlIDEwID0gMi4uOSBhbmQgbiAlIDEwMCAhPSAxMS4uMTknLFxuXHRcdFx0XHRtYW55OiAnZiAhPSAwJ1xuXHRcdFx0fSxcblx0XHRcdGx2OiB7XG5cdFx0XHRcdHplcm86ICduICUgMTAgPSAwIG9yIG4gJSAxMDAgPSAxMS4uMTkgb3IgdiA9IDIgYW5kIGYgJSAxMDAgPSAxMS4uMTknLFxuXHRcdFx0XHRvbmU6ICduICUgMTAgPSAxIGFuZCBuICUgMTAwICE9IDExIG9yIHYgPSAyIGFuZCBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExIG9yIHYgIT0gMiBhbmQgZiAlIDEwID0gMSdcblx0XHRcdH0sXG5cdFx0XHRtZzoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRtazoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBvciBmICUgMTAgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdG1vOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ3YgIT0gMCBvciBuID0gMCBvciBuICE9IDEgYW5kIG4gJSAxMDAgPSAxLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRtcjoge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH0sXG5cdFx0XHRtdDoge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdGZldzogJ24gPSAwIG9yIG4gJSAxMDAgPSAyLi4xMCcsXG5cdFx0XHRcdG1hbnk6ICduICUgMTAwID0gMTEuLjE5J1xuXHRcdFx0fSxcblx0XHRcdG5hcToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdG5zbzoge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRwYToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHRwbDoge1xuXHRcdFx0XHRvbmU6ICdpID0gMSBhbmQgdiA9IDAnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQnLFxuXHRcdFx0XHRtYW55OiAndiA9IDAgYW5kIGkgIT0gMSBhbmQgaSAlIDEwID0gMC4uMSBvciB2ID0gMCBhbmQgaSAlIDEwID0gNS4uOSBvciB2ID0gMCBhbmQgaSAlIDEwMCA9IDEyLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRwcmc6IHtcblx0XHRcdFx0emVybzogJ24gJSAxMCA9IDAgb3IgbiAlIDEwMCA9IDExLi4xOSBvciB2ID0gMiBhbmQgZiAlIDEwMCA9IDExLi4xOScsXG5cdFx0XHRcdG9uZTogJ24gJSAxMCA9IDEgYW5kIG4gJSAxMDAgIT0gMTEgb3IgdiA9IDIgYW5kIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEgb3IgdiAhPSAyIGFuZCBmICUgMTAgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdHB0OiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHJvOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ3YgIT0gMCBvciBuID0gMCBvciBuICE9IDEgYW5kIG4gJSAxMDAgPSAxLi4xOSdcblx0XHRcdH0sXG5cdFx0XHRydToge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgaSAlIDEwID0gMCBvciB2ID0gMCBhbmQgaSAlIDEwID0gNS4uOSBvciB2ID0gMCBhbmQgaSAlIDEwMCA9IDExLi4xNCdcblx0XHRcdH0sXG5cdFx0XHRzZToge1xuXHRcdFx0XHRvbmU6ICduID0gMScsXG5cdFx0XHRcdHR3bzogJ24gPSAyJ1xuXHRcdFx0fSxcblx0XHRcdHNoOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpICUgMTAgPSAxIGFuZCBpICUgMTAwICE9IDExIG9yIGYgJSAxMCA9IDEgYW5kIGYgJSAxMDAgIT0gMTEnLFxuXHRcdFx0XHRmZXc6ICd2ID0gMCBhbmQgaSAlIDEwID0gMi4uNCBhbmQgaSAlIDEwMCAhPSAxMi4uMTQgb3IgZiAlIDEwID0gMi4uNCBhbmQgZiAlIDEwMCAhPSAxMi4uMTQnXG5cdFx0XHR9LFxuXHRcdFx0c2hpOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAwIG9yIG4gPSAxJyxcblx0XHRcdFx0ZmV3OiAnbiA9IDIuLjEwJ1xuXHRcdFx0fSxcblx0XHRcdHNpOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLDEgb3IgaSA9IDAgYW5kIGYgPSAxJ1xuXHRcdFx0fSxcblx0XHRcdHNrOiB7XG5cdFx0XHRcdG9uZTogJ2kgPSAxIGFuZCB2ID0gMCcsXG5cdFx0XHRcdGZldzogJ2kgPSAyLi40IGFuZCB2ID0gMCcsXG5cdFx0XHRcdG1hbnk6ICd2ICE9IDAnXG5cdFx0XHR9LFxuXHRcdFx0c2w6IHtcblx0XHRcdFx0b25lOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAxJyxcblx0XHRcdFx0dHdvOiAndiA9IDAgYW5kIGkgJSAxMDAgPSAyJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMDAgPSAzLi40IG9yIHYgIT0gMCdcblx0XHRcdH0sXG5cdFx0XHRzbWE6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbWk6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbWo6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbW46IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzbXM6IHtcblx0XHRcdFx0b25lOiAnbiA9IDEnLFxuXHRcdFx0XHR0d286ICduID0gMidcblx0XHRcdH0sXG5cdFx0XHRzcjoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMSBvciBmICUgMTAgPSAxIGFuZCBmICUgMTAwICE9IDExJyxcblx0XHRcdFx0ZmV3OiAndiA9IDAgYW5kIGkgJSAxMCA9IDIuLjQgYW5kIGkgJSAxMDAgIT0gMTIuLjE0IG9yIGYgJSAxMCA9IDIuLjQgYW5kIGYgJSAxMDAgIT0gMTIuLjE0J1xuXHRcdFx0fSxcblx0XHRcdHRpOiB7XG5cdFx0XHRcdG9uZTogJ24gPSAwLi4xJ1xuXHRcdFx0fSxcblx0XHRcdHRsOiB7XG5cdFx0XHRcdG9uZTogJ3YgPSAwIGFuZCBpID0gMSwyLDMgb3IgdiA9IDAgYW5kIGkgJSAxMCAhPSA0LDYsOSBvciB2ICE9IDAgYW5kIGYgJSAxMCAhPSA0LDYsOSdcblx0XHRcdH0sXG5cdFx0XHR0em06IHtcblx0XHRcdFx0b25lOiAnbiA9IDAuLjEgb3IgbiA9IDExLi45OSdcblx0XHRcdH0sXG5cdFx0XHR1azoge1xuXHRcdFx0XHRvbmU6ICd2ID0gMCBhbmQgaSAlIDEwID0gMSBhbmQgaSAlIDEwMCAhPSAxMScsXG5cdFx0XHRcdGZldzogJ3YgPSAwIGFuZCBpICUgMTAgPSAyLi40IGFuZCBpICUgMTAwICE9IDEyLi4xNCcsXG5cdFx0XHRcdG1hbnk6ICd2ID0gMCBhbmQgaSAlIDEwID0gMCBvciB2ID0gMCBhbmQgaSAlIDEwID0gNS4uOSBvciB2ID0gMCBhbmQgaSAlIDEwMCA9IDExLi4xNCdcblx0XHRcdH0sXG5cdFx0XHR3YToge1xuXHRcdFx0XHRvbmU6ICduID0gMC4uMSdcblx0XHRcdH0sXG5cdFx0XHR6dToge1xuXHRcdFx0XHRvbmU6ICdpID0gMCBvciBuID0gMSdcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8vIGpzY3M6ZW5hYmxlXG5cblx0XHQvKipcblx0XHQgKiBQbHVyYWwgZm9ybSB0cmFuc2Zvcm1hdGlvbnMsIG5lZWRlZCBmb3Igc29tZSBsYW5ndWFnZXMuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2ludGVnZXJ9IGNvdW50XG5cdFx0ICogICAgICAgICAgICBOb24tbG9jYWxpemVkIHF1YW50aWZpZXJcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBmb3Jtc1xuXHRcdCAqICAgICAgICAgICAgTGlzdCBvZiBwbHVyYWwgZm9ybXNcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IENvcnJlY3QgZm9ybSBmb3IgcXVhbnRpZmllciBpbiB0aGlzIGxhbmd1YWdlXG5cdFx0ICovXG5cdFx0Y29udmVydFBsdXJhbDogZnVuY3Rpb24gKCBjb3VudCwgZm9ybXMgKSB7XG5cdFx0XHR2YXIgcGx1cmFsUnVsZXMsXG5cdFx0XHRcdHBsdXJhbEZvcm1JbmRleCxcblx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdGV4cGxpY2l0UGx1cmFsUGF0dGVybiA9IG5ldyBSZWdFeHAoICdcXFxcZCs9JywgJ2knICksXG5cdFx0XHRcdGZvcm1Db3VudCxcblx0XHRcdFx0Zm9ybTtcblxuXHRcdFx0aWYgKCAhZm9ybXMgfHwgZm9ybXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRyZXR1cm4gJyc7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEhhbmRsZSBmb3IgRXhwbGljaXQgMD0gJiAxPSB2YWx1ZXNcblx0XHRcdGZvciAoIGluZGV4ID0gMDsgaW5kZXggPCBmb3Jtcy5sZW5ndGg7IGluZGV4KysgKSB7XG5cdFx0XHRcdGZvcm0gPSBmb3Jtc1sgaW5kZXggXTtcblx0XHRcdFx0aWYgKCBleHBsaWNpdFBsdXJhbFBhdHRlcm4udGVzdCggZm9ybSApICkge1xuXHRcdFx0XHRcdGZvcm1Db3VudCA9IHBhcnNlSW50KCBmb3JtLnNsaWNlKCAwLCBmb3JtLmluZGV4T2YoICc9JyApICksIDEwICk7XG5cdFx0XHRcdFx0aWYgKCBmb3JtQ291bnQgPT09IGNvdW50ICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuICggZm9ybS5zbGljZSggZm9ybS5pbmRleE9mKCAnPScgKSArIDEgKSApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRmb3Jtc1sgaW5kZXggXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRmb3JtcyA9ICQubWFwKCBmb3JtcywgZnVuY3Rpb24gKCBmb3JtICkge1xuXHRcdFx0XHRpZiAoIGZvcm0gIT09IHVuZGVmaW5lZCApIHtcblx0XHRcdFx0XHRyZXR1cm4gZm9ybTtcblx0XHRcdFx0fVxuXHRcdFx0fSApO1xuXG5cdFx0XHRwbHVyYWxSdWxlcyA9IHRoaXMucGx1cmFsUnVsZXNbICQuaTE4bigpLmxvY2FsZSBdO1xuXG5cdFx0XHRpZiAoICFwbHVyYWxSdWxlcyApIHtcblx0XHRcdFx0Ly8gZGVmYXVsdCBmYWxsYmFjay5cblx0XHRcdFx0cmV0dXJuICggY291bnQgPT09IDEgKSA/IGZvcm1zWyAwIF0gOiBmb3Jtc1sgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRwbHVyYWxGb3JtSW5kZXggPSB0aGlzLmdldFBsdXJhbEZvcm0oIGNvdW50LCBwbHVyYWxSdWxlcyApO1xuXHRcdFx0cGx1cmFsRm9ybUluZGV4ID0gTWF0aC5taW4oIHBsdXJhbEZvcm1JbmRleCwgZm9ybXMubGVuZ3RoIC0gMSApO1xuXG5cdFx0XHRyZXR1cm4gZm9ybXNbIHBsdXJhbEZvcm1JbmRleCBdO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBGb3IgdGhlIG51bWJlciwgZ2V0IHRoZSBwbHVyYWwgZm9yIGluZGV4XG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge2ludGVnZXJ9IG51bWJlclxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBwbHVyYWxSdWxlc1xuXHRcdCAqIEByZXR1cm4ge2ludGVnZXJ9IHBsdXJhbCBmb3JtIGluZGV4XG5cdFx0ICovXG5cdFx0Z2V0UGx1cmFsRm9ybTogZnVuY3Rpb24gKCBudW1iZXIsIHBsdXJhbFJ1bGVzICkge1xuXHRcdFx0dmFyIGksXG5cdFx0XHRcdHBsdXJhbEZvcm1zID0gWyAnemVybycsICdvbmUnLCAndHdvJywgJ2ZldycsICdtYW55JywgJ290aGVyJyBdLFxuXHRcdFx0XHRwbHVyYWxGb3JtSW5kZXggPSAwO1xuXG5cdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBsdXJhbEZvcm1zLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHBsdXJhbFJ1bGVzWyBwbHVyYWxGb3Jtc1sgaSBdIF0gKSB7XG5cdFx0XHRcdFx0aWYgKCBwbHVyYWxSdWxlUGFyc2VyKCBwbHVyYWxSdWxlc1sgcGx1cmFsRm9ybXNbIGkgXSBdLCBudW1iZXIgKSApIHtcblx0XHRcdFx0XHRcdHJldHVybiBwbHVyYWxGb3JtSW5kZXg7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cGx1cmFsRm9ybUluZGV4Kys7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBsdXJhbEZvcm1JbmRleDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogQ29udmVydHMgYSBudW1iZXIgdXNpbmcgZGlnaXRUcmFuc2Zvcm1UYWJsZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBudW0gVmFsdWUgdG8gYmUgY29udmVydGVkXG5cdFx0ICogQHBhcmFtIHtib29sZWFufSBpbnRlZ2VyIENvbnZlcnQgdGhlIHJldHVybiB2YWx1ZSB0byBhbiBpbnRlZ2VyXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBUaGUgbnVtYmVyIGNvbnZlcnRlZCBpbnRvIGEgU3RyaW5nLlxuXHRcdCAqL1xuXHRcdGNvbnZlcnROdW1iZXI6IGZ1bmN0aW9uICggbnVtLCBpbnRlZ2VyICkge1xuXHRcdFx0dmFyIHRtcCwgaXRlbSwgaSxcblx0XHRcdFx0dHJhbnNmb3JtVGFibGUsIG51bWJlclN0cmluZywgY29udmVydGVkTnVtYmVyO1xuXG5cdFx0XHQvLyBTZXQgdGhlIHRhcmdldCBUcmFuc2Zvcm0gdGFibGU6XG5cdFx0XHR0cmFuc2Zvcm1UYWJsZSA9IHRoaXMuZGlnaXRUcmFuc2Zvcm1UYWJsZSggJC5pMThuKCkubG9jYWxlICk7XG5cdFx0XHRudW1iZXJTdHJpbmcgPSBTdHJpbmcoIG51bSApO1xuXHRcdFx0Y29udmVydGVkTnVtYmVyID0gJyc7XG5cblx0XHRcdGlmICggIXRyYW5zZm9ybVRhYmxlICkge1xuXHRcdFx0XHRyZXR1cm4gbnVtO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGVjayBpZiB0aGUgcmVzdG9yZSB0byBMYXRpbiBudW1iZXIgZmxhZyBpcyBzZXQ6XG5cdFx0XHRpZiAoIGludGVnZXIgKSB7XG5cdFx0XHRcdGlmICggcGFyc2VGbG9hdCggbnVtLCAxMCApID09PSBudW0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRtcCA9IFtdO1xuXG5cdFx0XHRcdGZvciAoIGl0ZW0gaW4gdHJhbnNmb3JtVGFibGUgKSB7XG5cdFx0XHRcdFx0dG1wWyB0cmFuc2Zvcm1UYWJsZVsgaXRlbSBdIF0gPSBpdGVtO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJhbnNmb3JtVGFibGUgPSB0bXA7XG5cdFx0XHR9XG5cblx0XHRcdGZvciAoIGkgPSAwOyBpIDwgbnVtYmVyU3RyaW5nLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0XHRpZiAoIHRyYW5zZm9ybVRhYmxlWyBudW1iZXJTdHJpbmdbIGkgXSBdICkge1xuXHRcdFx0XHRcdGNvbnZlcnRlZE51bWJlciArPSB0cmFuc2Zvcm1UYWJsZVsgbnVtYmVyU3RyaW5nWyBpIF0gXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjb252ZXJ0ZWROdW1iZXIgKz0gbnVtYmVyU3RyaW5nWyBpIF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGludGVnZXIgPyBwYXJzZUZsb2F0KCBjb252ZXJ0ZWROdW1iZXIsIDEwICkgOiBjb252ZXJ0ZWROdW1iZXI7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdyYW1tYXRpY2FsIHRyYW5zZm9ybWF0aW9ucywgbmVlZGVkIGZvciBpbmZsZWN0ZWQgbGFuZ3VhZ2VzLlxuXHRcdCAqIEludm9rZWQgYnkgcHV0dGluZyB7e2dyYW1tYXI6Zm9ybXx3b3JkfX0gaW4gYSBtZXNzYWdlLlxuXHRcdCAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIGZvciBsYW5ndWFnZXMgdGhhdCBuZWVkIHNwZWNpYWwgZ3JhbW1hciBydWxlc1xuXHRcdCAqIGFwcGxpZWQgZHluYW1pY2FsbHkuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gd29yZFxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBmb3JtXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuXHRcdGNvbnZlcnRHcmFtbWFyOiBmdW5jdGlvbiAoIHdvcmQsIGZvcm0gKSB7XG5cdFx0XHRyZXR1cm4gd29yZDtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogUHJvdmlkZXMgYW4gYWx0ZXJuYXRpdmUgdGV4dCBkZXBlbmRpbmcgb24gc3BlY2lmaWVkIGdlbmRlci4gVXNhZ2Vcblx0XHQgKiB7e2dlbmRlcjpbZ2VuZGVyfHVzZXIgb2JqZWN0XXxtYXNjdWxpbmV8ZmVtaW5pbmV8bmV1dHJhbH19LiBJZiBzZWNvbmRcblx0XHQgKiBvciB0aGlyZCBwYXJhbWV0ZXIgYXJlIG5vdCBzcGVjaWZpZWQsIG1hc2N1bGluZSBpcyB1c2VkLlxuXHRcdCAqXG5cdFx0ICogVGhlc2UgZGV0YWlscyBtYXkgYmUgb3ZlcnJpZGVuIHBlciBsYW5ndWFnZS5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBnZW5kZXJcblx0XHQgKiAgICAgIG1hbGUsIGZlbWFsZSwgb3IgYW55dGhpbmcgZWxzZSBmb3IgbmV1dHJhbC5cblx0XHQgKiBAcGFyYW0ge0FycmF5fSBmb3Jtc1xuXHRcdCAqICAgICAgTGlzdCBvZiBnZW5kZXIgZm9ybXNcblx0XHQgKlxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ31cblx0XHQgKi9cblx0XHRnZW5kZXI6IGZ1bmN0aW9uICggZ2VuZGVyLCBmb3JtcyApIHtcblx0XHRcdGlmICggIWZvcm1zIHx8IGZvcm1zLmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0fVxuXG5cdFx0XHR3aGlsZSAoIGZvcm1zLmxlbmd0aCA8IDIgKSB7XG5cdFx0XHRcdGZvcm1zLnB1c2goIGZvcm1zWyBmb3Jtcy5sZW5ndGggLSAxIF0gKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBnZW5kZXIgPT09ICdtYWxlJyApIHtcblx0XHRcdFx0cmV0dXJuIGZvcm1zWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdGlmICggZ2VuZGVyID09PSAnZmVtYWxlJyApIHtcblx0XHRcdFx0cmV0dXJuIGZvcm1zWyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiAoIGZvcm1zLmxlbmd0aCA9PT0gMyApID8gZm9ybXNbIDIgXSA6IGZvcm1zWyAwIF07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdldCB0aGUgZGlnaXQgdHJhbnNmb3JtIHRhYmxlIGZvciB0aGUgZ2l2ZW4gbGFuZ3VhZ2Vcblx0XHQgKiBTZWUgaHR0cDovL2NsZHIudW5pY29kZS5vcmcvdHJhbnNsYXRpb24vbnVtYmVyaW5nLXN5c3RlbXNcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuXHRcdCAqIEByZXR1cm4ge0FycmF5fGJvb2xlYW59IExpc3Qgb2YgZGlnaXRzIGluIHRoZSBwYXNzZWQgbGFuZ3VhZ2Ugb3IgZmFsc2Vcblx0XHQgKiByZXByZXNlbnRhdGlvbiwgb3IgYm9vbGVhbiBmYWxzZSBpZiB0aGVyZSBpcyBubyBpbmZvcm1hdGlvbi5cblx0XHQgKi9cblx0XHRkaWdpdFRyYW5zZm9ybVRhYmxlOiBmdW5jdGlvbiAoIGxhbmd1YWdlICkge1xuXHRcdFx0dmFyIHRhYmxlcyA9IHtcblx0XHRcdFx0YXI6ICfZoNmh2aLZo9mk2aXZptmn2ajZqScsXG5cdFx0XHRcdGZhOiAn27Dbsduy27PbtNu127bbt9u427knLFxuXHRcdFx0XHRtbDogJ+C1puC1p+C1qOC1qeC1quC1q+C1rOC1reC1ruC1rycsXG5cdFx0XHRcdGtuOiAn4LOm4LOn4LOo4LOp4LOq4LOr4LOs4LOt4LOu4LOvJyxcblx0XHRcdFx0bG86ICfgu5Dgu5Hgu5Lgu5Pgu5Tgu5Xgu5bgu5fgu5jgu5knLFxuXHRcdFx0XHRvcjogJ+CtpuCtp+CtqOCtqeCtquCtq+CtrOCtreCtruCtrycsXG5cdFx0XHRcdGtoOiAn4Z+g4Z+h4Z+i4Z+j4Z+k4Z+l4Z+m4Z+n4Z+o4Z+pJyxcblx0XHRcdFx0cGE6ICfgqabgqafgqajgqangqargqavgqazgqa3gqa7gqa8nLFxuXHRcdFx0XHRndTogJ+CrpuCrp+CrqOCrqeCrquCrq+CrrOCrreCrruCrrycsXG5cdFx0XHRcdGhpOiAn4KWm4KWn4KWo4KWp4KWq4KWr4KWs4KWt4KWu4KWvJyxcblx0XHRcdFx0bXk6ICfhgYDhgYHhgYLhgYPhgYThgYXhgYbhgYfhgYjhgYknLFxuXHRcdFx0XHR0YTogJ+CvpuCvp+CvqOCvqeCvquCvq+CvrOCvreCvruCvrycsXG5cdFx0XHRcdHRlOiAn4LGm4LGn4LGo4LGp4LGq4LGr4LGs4LGt4LGu4LGvJyxcblx0XHRcdFx0dGg6ICfguZDguZHguZLguZPguZTguZXguZbguZfguZjguZknLCAvLyBGSVhNRSB1c2UgaXNvIDYzOSBjb2Rlc1xuXHRcdFx0XHRibzogJ+C8oOC8oeC8ouC8o+C8pOC8peC8puC8p+C8qOC8qScgLy8gRklYTUUgdXNlIGlzbyA2MzkgY29kZXNcblx0XHRcdH07XG5cblx0XHRcdGlmICggIXRhYmxlc1sgbGFuZ3VhZ2UgXSApIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGFibGVzWyBsYW5ndWFnZSBdLnNwbGl0KCAnJyApO1xuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLmxhbmd1YWdlcywge1xuXHRcdCdkZWZhdWx0JzogbGFuZ3VhZ2Vcblx0fSApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qIVxuICogQklESSBlbWJlZGRpbmcgc3VwcG9ydCBmb3IgalF1ZXJ5LmkxOG5cbiAqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTUsIERhdmlkIENoYW5cbiAqXG4gKiBUaGlzIGNvZGUgaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2UgdGhpcyBjb2RlXG4gKiBpbiBjb21tZXJjaWFsIHByb2plY3RzIGFzIGxvbmcgYXMgdGhlIGNvcHlyaWdodCBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuXG4gKiBTZWUgZmlsZXMgR1BMLUxJQ0VOU0UgYW5kIE1JVC1MSUNFTlNFIGZvciBkZXRhaWxzLlxuICpcbiAqIEBsaWNlbmNlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbmNlIDIuMCBvciBsYXRlclxuICogQGxpY2VuY2UgTUlUIExpY2Vuc2VcbiAqL1xuXG4oIGZ1bmN0aW9uICggJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgc3Ryb25nRGlyUmVnRXhwO1xuXG5cdC8qKlxuXHQgKiBNYXRjaGVzIHRoZSBmaXJzdCBzdHJvbmcgZGlyZWN0aW9uYWxpdHkgY29kZXBvaW50OlxuXHQgKiAtIGluIGdyb3VwIDEgaWYgaXQgaXMgTFRSXG5cdCAqIC0gaW4gZ3JvdXAgMiBpZiBpdCBpcyBSVExcblx0ICogRG9lcyBub3QgbWF0Y2ggaWYgdGhlcmUgaXMgbm8gc3Ryb25nIGRpcmVjdGlvbmFsaXR5IGNvZGVwb2ludC5cblx0ICpcblx0ICogR2VuZXJhdGVkIGJ5IFVuaWNvZGVKUyAoc2VlIHRvb2xzL3N0cm9uZ0RpcikgZnJvbSB0aGUgVUNEOyBzZWVcblx0ICogaHR0cHM6Ly9waGFicmljYXRvci53aWtpbWVkaWEub3JnL2RpZmZ1c2lvbi9HVUpTLyAuXG5cdCAqL1xuXHRzdHJvbmdEaXJSZWdFeHAgPSBuZXcgUmVnRXhwKFxuXHRcdCcoPzonICtcblx0XHRcdCcoJyArXG5cdFx0XHRcdCdbXFx1MDA0MS1cXHUwMDVhXFx1MDA2MS1cXHUwMDdhXFx1MDBhYVxcdTAwYjVcXHUwMGJhXFx1MDBjMC1cXHUwMGQ2XFx1MDBkOC1cXHUwMGY2XFx1MDBmOC1cXHUwMmI4XFx1MDJiYi1cXHUwMmMxXFx1MDJkMFxcdTAyZDFcXHUwMmUwLVxcdTAyZTRcXHUwMmVlXFx1MDM3MC1cXHUwMzczXFx1MDM3NlxcdTAzNzdcXHUwMzdhLVxcdTAzN2RcXHUwMzdmXFx1MDM4NlxcdTAzODgtXFx1MDM4YVxcdTAzOGNcXHUwMzhlLVxcdTAzYTFcXHUwM2EzLVxcdTAzZjVcXHUwM2Y3LVxcdTA0ODJcXHUwNDhhLVxcdTA1MmZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5LVxcdTA1NWZcXHUwNTYxLVxcdTA1ODdcXHUwNTg5XFx1MDkwMy1cXHUwOTM5XFx1MDkzYlxcdTA5M2QtXFx1MDk0MFxcdTA5NDktXFx1MDk0Y1xcdTA5NGUtXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NjQtXFx1MDk4MFxcdTA5ODJcXHUwOTgzXFx1MDk4NS1cXHUwOThjXFx1MDk4ZlxcdTA5OTBcXHUwOTkzLVxcdTA5YThcXHUwOWFhLVxcdTA5YjBcXHUwOWIyXFx1MDliNi1cXHUwOWI5XFx1MDliZC1cXHUwOWMwXFx1MDljN1xcdTA5YzhcXHUwOWNiXFx1MDljY1xcdTA5Y2VcXHUwOWQ3XFx1MDlkY1xcdTA5ZGRcXHUwOWRmLVxcdTA5ZTFcXHUwOWU2LVxcdTA5ZjFcXHUwOWY0LVxcdTA5ZmFcXHUwYTAzXFx1MGEwNS1cXHUwYTBhXFx1MGEwZlxcdTBhMTBcXHUwYTEzLVxcdTBhMjhcXHUwYTJhLVxcdTBhMzBcXHUwYTMyXFx1MGEzM1xcdTBhMzVcXHUwYTM2XFx1MGEzOFxcdTBhMzlcXHUwYTNlLVxcdTBhNDBcXHUwYTU5LVxcdTBhNWNcXHUwYTVlXFx1MGE2Ni1cXHUwYTZmXFx1MGE3Mi1cXHUwYTc0XFx1MGE4M1xcdTBhODUtXFx1MGE4ZFxcdTBhOGYtXFx1MGE5MVxcdTBhOTMtXFx1MGFhOFxcdTBhYWEtXFx1MGFiMFxcdTBhYjJcXHUwYWIzXFx1MGFiNS1cXHUwYWI5XFx1MGFiZC1cXHUwYWMwXFx1MGFjOVxcdTBhY2JcXHUwYWNjXFx1MGFkMFxcdTBhZTBcXHUwYWUxXFx1MGFlNi1cXHUwYWYwXFx1MGFmOVxcdTBiMDJcXHUwYjAzXFx1MGIwNS1cXHUwYjBjXFx1MGIwZlxcdTBiMTBcXHUwYjEzLVxcdTBiMjhcXHUwYjJhLVxcdTBiMzBcXHUwYjMyXFx1MGIzM1xcdTBiMzUtXFx1MGIzOVxcdTBiM2RcXHUwYjNlXFx1MGI0MFxcdTBiNDdcXHUwYjQ4XFx1MGI0YlxcdTBiNGNcXHUwYjU3XFx1MGI1Y1xcdTBiNWRcXHUwYjVmLVxcdTBiNjFcXHUwYjY2LVxcdTBiNzdcXHUwYjgzXFx1MGI4NS1cXHUwYjhhXFx1MGI4ZS1cXHUwYjkwXFx1MGI5Mi1cXHUwYjk1XFx1MGI5OVxcdTBiOWFcXHUwYjljXFx1MGI5ZVxcdTBiOWZcXHUwYmEzXFx1MGJhNFxcdTBiYTgtXFx1MGJhYVxcdTBiYWUtXFx1MGJiOVxcdTBiYmVcXHUwYmJmXFx1MGJjMVxcdTBiYzJcXHUwYmM2LVxcdTBiYzhcXHUwYmNhLVxcdTBiY2NcXHUwYmQwXFx1MGJkN1xcdTBiZTYtXFx1MGJmMlxcdTBjMDEtXFx1MGMwM1xcdTBjMDUtXFx1MGMwY1xcdTBjMGUtXFx1MGMxMFxcdTBjMTItXFx1MGMyOFxcdTBjMmEtXFx1MGMzOVxcdTBjM2RcXHUwYzQxLVxcdTBjNDRcXHUwYzU4LVxcdTBjNWFcXHUwYzYwXFx1MGM2MVxcdTBjNjYtXFx1MGM2ZlxcdTBjN2ZcXHUwYzgyXFx1MGM4M1xcdTBjODUtXFx1MGM4Y1xcdTBjOGUtXFx1MGM5MFxcdTBjOTItXFx1MGNhOFxcdTBjYWEtXFx1MGNiM1xcdTBjYjUtXFx1MGNiOVxcdTBjYmQtXFx1MGNjNFxcdTBjYzYtXFx1MGNjOFxcdTBjY2FcXHUwY2NiXFx1MGNkNVxcdTBjZDZcXHUwY2RlXFx1MGNlMFxcdTBjZTFcXHUwY2U2LVxcdTBjZWZcXHUwY2YxXFx1MGNmMlxcdTBkMDJcXHUwZDAzXFx1MGQwNS1cXHUwZDBjXFx1MGQwZS1cXHUwZDEwXFx1MGQxMi1cXHUwZDNhXFx1MGQzZC1cXHUwZDQwXFx1MGQ0Ni1cXHUwZDQ4XFx1MGQ0YS1cXHUwZDRjXFx1MGQ0ZVxcdTBkNTdcXHUwZDVmLVxcdTBkNjFcXHUwZDY2LVxcdTBkNzVcXHUwZDc5LVxcdTBkN2ZcXHUwZDgyXFx1MGQ4M1xcdTBkODUtXFx1MGQ5NlxcdTBkOWEtXFx1MGRiMVxcdTBkYjMtXFx1MGRiYlxcdTBkYmRcXHUwZGMwLVxcdTBkYzZcXHUwZGNmLVxcdTBkZDFcXHUwZGQ4LVxcdTBkZGZcXHUwZGU2LVxcdTBkZWZcXHUwZGYyLVxcdTBkZjRcXHUwZTAxLVxcdTBlMzBcXHUwZTMyXFx1MGUzM1xcdTBlNDAtXFx1MGU0NlxcdTBlNGYtXFx1MGU1YlxcdTBlODFcXHUwZTgyXFx1MGU4NFxcdTBlODdcXHUwZTg4XFx1MGU4YVxcdTBlOGRcXHUwZTk0LVxcdTBlOTdcXHUwZTk5LVxcdTBlOWZcXHUwZWExLVxcdTBlYTNcXHUwZWE1XFx1MGVhN1xcdTBlYWFcXHUwZWFiXFx1MGVhZC1cXHUwZWIwXFx1MGViMlxcdTBlYjNcXHUwZWJkXFx1MGVjMC1cXHUwZWM0XFx1MGVjNlxcdTBlZDAtXFx1MGVkOVxcdTBlZGMtXFx1MGVkZlxcdTBmMDAtXFx1MGYxN1xcdTBmMWEtXFx1MGYzNFxcdTBmMzZcXHUwZjM4XFx1MGYzZS1cXHUwZjQ3XFx1MGY0OS1cXHUwZjZjXFx1MGY3ZlxcdTBmODVcXHUwZjg4LVxcdTBmOGNcXHUwZmJlLVxcdTBmYzVcXHUwZmM3LVxcdTBmY2NcXHUwZmNlLVxcdTBmZGFcXHUxMDAwLVxcdTEwMmNcXHUxMDMxXFx1MTAzOFxcdTEwM2JcXHUxMDNjXFx1MTAzZi1cXHUxMDU3XFx1MTA1YS1cXHUxMDVkXFx1MTA2MS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4M1xcdTEwODRcXHUxMDg3LVxcdTEwOGNcXHUxMDhlLVxcdTEwOWNcXHUxMDllLVxcdTEwYzVcXHUxMGM3XFx1MTBjZFxcdTEwZDAtXFx1MTI0OFxcdTEyNGEtXFx1MTI0ZFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVhLVxcdTEyNWRcXHUxMjYwLVxcdTEyODhcXHUxMjhhLVxcdTEyOGRcXHUxMjkwLVxcdTEyYjBcXHUxMmIyLVxcdTEyYjVcXHUxMmI4LVxcdTEyYmVcXHUxMmMwXFx1MTJjMi1cXHUxMmM1XFx1MTJjOC1cXHUxMmQ2XFx1MTJkOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVhXFx1MTM2MC1cXHUxMzdjXFx1MTM4MC1cXHUxMzhmXFx1MTNhMC1cXHUxM2Y1XFx1MTNmOC1cXHUxM2ZkXFx1MTQwMS1cXHUxNjdmXFx1MTY4MS1cXHUxNjlhXFx1MTZhMC1cXHUxNmY4XFx1MTcwMC1cXHUxNzBjXFx1MTcwZS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTczNVxcdTE3MzZcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NmNcXHUxNzZlLVxcdTE3NzBcXHUxNzgwLVxcdTE3YjNcXHUxN2I2XFx1MTdiZS1cXHUxN2M1XFx1MTdjN1xcdTE3YzhcXHUxN2Q0LVxcdTE3ZGFcXHUxN2RjXFx1MTdlMC1cXHUxN2U5XFx1MTgxMC1cXHUxODE5XFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxOGE4XFx1MThhYVxcdTE4YjAtXFx1MThmNVxcdTE5MDAtXFx1MTkxZVxcdTE5MjMtXFx1MTkyNlxcdTE5MjktXFx1MTkyYlxcdTE5MzBcXHUxOTMxXFx1MTkzMy1cXHUxOTM4XFx1MTk0Ni1cXHUxOTZkXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOWFiXFx1MTliMC1cXHUxOWM5XFx1MTlkMC1cXHUxOWRhXFx1MWEwMC1cXHUxYTE2XFx1MWExOVxcdTFhMWFcXHUxYTFlLVxcdTFhNTVcXHUxYTU3XFx1MWE2MVxcdTFhNjNcXHUxYTY0XFx1MWE2ZC1cXHUxYTcyXFx1MWE4MC1cXHUxYTg5XFx1MWE5MC1cXHUxYTk5XFx1MWFhMC1cXHUxYWFkXFx1MWIwNC1cXHUxYjMzXFx1MWIzNVxcdTFiM2JcXHUxYjNkLVxcdTFiNDFcXHUxYjQzLVxcdTFiNGJcXHUxYjUwLVxcdTFiNmFcXHUxYjc0LVxcdTFiN2NcXHUxYjgyLVxcdTFiYTFcXHUxYmE2XFx1MWJhN1xcdTFiYWFcXHUxYmFlLVxcdTFiZTVcXHUxYmU3XFx1MWJlYS1cXHUxYmVjXFx1MWJlZVxcdTFiZjJcXHUxYmYzXFx1MWJmYy1cXHUxYzJiXFx1MWMzNFxcdTFjMzVcXHUxYzNiLVxcdTFjNDlcXHUxYzRkLVxcdTFjN2ZcXHUxY2MwLVxcdTFjYzdcXHUxY2QzXFx1MWNlMVxcdTFjZTktXFx1MWNlY1xcdTFjZWUtXFx1MWNmM1xcdTFjZjVcXHUxY2Y2XFx1MWQwMC1cXHUxZGJmXFx1MWUwMC1cXHUxZjE1XFx1MWYxOC1cXHUxZjFkXFx1MWYyMC1cXHUxZjQ1XFx1MWY0OC1cXHUxZjRkXFx1MWY1MC1cXHUxZjU3XFx1MWY1OVxcdTFmNWJcXHUxZjVkXFx1MWY1Zi1cXHUxZjdkXFx1MWY4MC1cXHUxZmI0XFx1MWZiNi1cXHUxZmJjXFx1MWZiZVxcdTFmYzItXFx1MWZjNFxcdTFmYzYtXFx1MWZjY1xcdTFmZDAtXFx1MWZkM1xcdTFmZDYtXFx1MWZkYlxcdTFmZTAtXFx1MWZlY1xcdTFmZjItXFx1MWZmNFxcdTFmZjYtXFx1MWZmY1xcdTIwMGVcXHUyMDcxXFx1MjA3ZlxcdTIwOTAtXFx1MjA5Y1xcdTIxMDJcXHUyMTA3XFx1MjEwYS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExZFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMmEtXFx1MjEyZFxcdTIxMmYtXFx1MjEzOVxcdTIxM2MtXFx1MjEzZlxcdTIxNDUtXFx1MjE0OVxcdTIxNGVcXHUyMTRmXFx1MjE2MC1cXHUyMTg4XFx1MjMzNi1cXHUyMzdhXFx1MjM5NVxcdTI0OWMtXFx1MjRlOVxcdTI2YWNcXHUyODAwLVxcdTI4ZmZcXHUyYzAwLVxcdTJjMmVcXHUyYzMwLVxcdTJjNWVcXHUyYzYwLVxcdTJjZTRcXHUyY2ViLVxcdTJjZWVcXHUyY2YyXFx1MmNmM1xcdTJkMDAtXFx1MmQyNVxcdTJkMjdcXHUyZDJkXFx1MmQzMC1cXHUyZDY3XFx1MmQ2ZlxcdTJkNzBcXHUyZDgwLVxcdTJkOTZcXHUyZGEwLVxcdTJkYTZcXHUyZGE4LVxcdTJkYWVcXHUyZGIwLVxcdTJkYjZcXHUyZGI4LVxcdTJkYmVcXHUyZGMwLVxcdTJkYzZcXHUyZGM4LVxcdTJkY2VcXHUyZGQwLVxcdTJkZDZcXHUyZGQ4LVxcdTJkZGVcXHUzMDA1LVxcdTMwMDdcXHUzMDIxLVxcdTMwMjlcXHUzMDJlXFx1MzAyZlxcdTMwMzEtXFx1MzAzNVxcdTMwMzgtXFx1MzAzY1xcdTMwNDEtXFx1MzA5NlxcdTMwOWQtXFx1MzA5ZlxcdTMwYTEtXFx1MzBmYVxcdTMwZmMtXFx1MzBmZlxcdTMxMDUtXFx1MzEyZFxcdTMxMzEtXFx1MzE4ZVxcdTMxOTAtXFx1MzFiYVxcdTMxZjAtXFx1MzIxY1xcdTMyMjAtXFx1MzI0ZlxcdTMyNjAtXFx1MzI3YlxcdTMyN2YtXFx1MzJiMFxcdTMyYzAtXFx1MzJjYlxcdTMyZDAtXFx1MzJmZVxcdTMzMDAtXFx1MzM3NlxcdTMzN2ItXFx1MzNkZFxcdTMzZTAtXFx1MzNmZVxcdTM0MDAtXFx1NGRiNVxcdTRlMDAtXFx1OWZkNVxcdWEwMDAtXFx1YTQ4Y1xcdWE0ZDAtXFx1YTYwY1xcdWE2MTAtXFx1YTYyYlxcdWE2NDAtXFx1YTY2ZVxcdWE2ODAtXFx1YTY5ZFxcdWE2YTAtXFx1YTZlZlxcdWE2ZjItXFx1YTZmN1xcdWE3MjItXFx1YTc4N1xcdWE3ODktXFx1YTdhZFxcdWE3YjAtXFx1YTdiN1xcdWE3ZjctXFx1YTgwMVxcdWE4MDMtXFx1YTgwNVxcdWE4MDctXFx1YTgwYVxcdWE4MGMtXFx1YTgyNFxcdWE4MjdcXHVhODMwLVxcdWE4MzdcXHVhODQwLVxcdWE4NzNcXHVhODgwLVxcdWE4YzNcXHVhOGNlLVxcdWE4ZDlcXHVhOGYyLVxcdWE4ZmRcXHVhOTAwLVxcdWE5MjVcXHVhOTJlLVxcdWE5NDZcXHVhOTUyXFx1YTk1M1xcdWE5NWYtXFx1YTk3Y1xcdWE5ODMtXFx1YTliMlxcdWE5YjRcXHVhOWI1XFx1YTliYVxcdWE5YmJcXHVhOWJkLVxcdWE5Y2RcXHVhOWNmLVxcdWE5ZDlcXHVhOWRlLVxcdWE5ZTRcXHVhOWU2LVxcdWE5ZmVcXHVhYTAwLVxcdWFhMjhcXHVhYTJmXFx1YWEzMFxcdWFhMzNcXHVhYTM0XFx1YWE0MC1cXHVhYTQyXFx1YWE0NC1cXHVhYTRiXFx1YWE0ZFxcdWFhNTAtXFx1YWE1OVxcdWFhNWMtXFx1YWE3YlxcdWFhN2QtXFx1YWFhZlxcdWFhYjFcXHVhYWI1XFx1YWFiNlxcdWFhYjktXFx1YWFiZFxcdWFhYzBcXHVhYWMyXFx1YWFkYi1cXHVhYWViXFx1YWFlZS1cXHVhYWY1XFx1YWIwMS1cXHVhYjA2XFx1YWIwOS1cXHVhYjBlXFx1YWIxMS1cXHVhYjE2XFx1YWIyMC1cXHVhYjI2XFx1YWIyOC1cXHVhYjJlXFx1YWIzMC1cXHVhYjY1XFx1YWI3MC1cXHVhYmU0XFx1YWJlNlxcdWFiZTdcXHVhYmU5LVxcdWFiZWNcXHVhYmYwLVxcdWFiZjlcXHVhYzAwLVxcdWQ3YTNcXHVkN2IwLVxcdWQ3YzZcXHVkN2NiLVxcdWQ3ZmJcXHVlMDAwLVxcdWZhNmRcXHVmYTcwLVxcdWZhZDlcXHVmYjAwLVxcdWZiMDZcXHVmYjEzLVxcdWZiMTdcXHVmZjIxLVxcdWZmM2FcXHVmZjQxLVxcdWZmNWFcXHVmZjY2LVxcdWZmYmVcXHVmZmMyLVxcdWZmYzdcXHVmZmNhLVxcdWZmY2ZcXHVmZmQyLVxcdWZmZDdcXHVmZmRhLVxcdWZmZGNdfFxcdWQ4MDBbXFx1ZGMwMC1cXHVkYzBiXXxcXHVkODAwW1xcdWRjMGQtXFx1ZGMyNl18XFx1ZDgwMFtcXHVkYzI4LVxcdWRjM2FdfFxcdWQ4MDBcXHVkYzNjfFxcdWQ4MDBcXHVkYzNkfFxcdWQ4MDBbXFx1ZGMzZi1cXHVkYzRkXXxcXHVkODAwW1xcdWRjNTAtXFx1ZGM1ZF18XFx1ZDgwMFtcXHVkYzgwLVxcdWRjZmFdfFxcdWQ4MDBcXHVkZDAwfFxcdWQ4MDBcXHVkZDAyfFxcdWQ4MDBbXFx1ZGQwNy1cXHVkZDMzXXxcXHVkODAwW1xcdWRkMzctXFx1ZGQzZl18XFx1ZDgwMFtcXHVkZGQwLVxcdWRkZmNdfFxcdWQ4MDBbXFx1ZGU4MC1cXHVkZTljXXxcXHVkODAwW1xcdWRlYTAtXFx1ZGVkMF18XFx1ZDgwMFtcXHVkZjAwLVxcdWRmMjNdfFxcdWQ4MDBbXFx1ZGYzMC1cXHVkZjRhXXxcXHVkODAwW1xcdWRmNTAtXFx1ZGY3NV18XFx1ZDgwMFtcXHVkZjgwLVxcdWRmOWRdfFxcdWQ4MDBbXFx1ZGY5Zi1cXHVkZmMzXXxcXHVkODAwW1xcdWRmYzgtXFx1ZGZkNV18XFx1ZDgwMVtcXHVkYzAwLVxcdWRjOWRdfFxcdWQ4MDFbXFx1ZGNhMC1cXHVkY2E5XXxcXHVkODAxW1xcdWRkMDAtXFx1ZGQyN118XFx1ZDgwMVtcXHVkZDMwLVxcdWRkNjNdfFxcdWQ4MDFcXHVkZDZmfFxcdWQ4MDFbXFx1ZGUwMC1cXHVkZjM2XXxcXHVkODAxW1xcdWRmNDAtXFx1ZGY1NV18XFx1ZDgwMVtcXHVkZjYwLVxcdWRmNjddfFxcdWQ4MDRcXHVkYzAwfFxcdWQ4MDRbXFx1ZGMwMi1cXHVkYzM3XXxcXHVkODA0W1xcdWRjNDctXFx1ZGM0ZF18XFx1ZDgwNFtcXHVkYzY2LVxcdWRjNmZdfFxcdWQ4MDRbXFx1ZGM4Mi1cXHVkY2IyXXxcXHVkODA0XFx1ZGNiN3xcXHVkODA0XFx1ZGNiOHxcXHVkODA0W1xcdWRjYmItXFx1ZGNjMV18XFx1ZDgwNFtcXHVkY2QwLVxcdWRjZThdfFxcdWQ4MDRbXFx1ZGNmMC1cXHVkY2Y5XXxcXHVkODA0W1xcdWRkMDMtXFx1ZGQyNl18XFx1ZDgwNFxcdWRkMmN8XFx1ZDgwNFtcXHVkZDM2LVxcdWRkNDNdfFxcdWQ4MDRbXFx1ZGQ1MC1cXHVkZDcyXXxcXHVkODA0W1xcdWRkNzQtXFx1ZGQ3Nl18XFx1ZDgwNFtcXHVkZDgyLVxcdWRkYjVdfFxcdWQ4MDRbXFx1ZGRiZi1cXHVkZGM5XXxcXHVkODA0XFx1ZGRjZHxcXHVkODA0W1xcdWRkZDAtXFx1ZGRkZl18XFx1ZDgwNFtcXHVkZGUxLVxcdWRkZjRdfFxcdWQ4MDRbXFx1ZGUwMC1cXHVkZTExXXxcXHVkODA0W1xcdWRlMTMtXFx1ZGUyZV18XFx1ZDgwNFxcdWRlMzJ8XFx1ZDgwNFxcdWRlMzN8XFx1ZDgwNFxcdWRlMzV8XFx1ZDgwNFtcXHVkZTM4LVxcdWRlM2RdfFxcdWQ4MDRbXFx1ZGU4MC1cXHVkZTg2XXxcXHVkODA0XFx1ZGU4OHxcXHVkODA0W1xcdWRlOGEtXFx1ZGU4ZF18XFx1ZDgwNFtcXHVkZThmLVxcdWRlOWRdfFxcdWQ4MDRbXFx1ZGU5Zi1cXHVkZWE5XXxcXHVkODA0W1xcdWRlYjAtXFx1ZGVkZV18XFx1ZDgwNFtcXHVkZWUwLVxcdWRlZTJdfFxcdWQ4MDRbXFx1ZGVmMC1cXHVkZWY5XXxcXHVkODA0XFx1ZGYwMnxcXHVkODA0XFx1ZGYwM3xcXHVkODA0W1xcdWRmMDUtXFx1ZGYwY118XFx1ZDgwNFxcdWRmMGZ8XFx1ZDgwNFxcdWRmMTB8XFx1ZDgwNFtcXHVkZjEzLVxcdWRmMjhdfFxcdWQ4MDRbXFx1ZGYyYS1cXHVkZjMwXXxcXHVkODA0XFx1ZGYzMnxcXHVkODA0XFx1ZGYzM3xcXHVkODA0W1xcdWRmMzUtXFx1ZGYzOV18XFx1ZDgwNFtcXHVkZjNkLVxcdWRmM2ZdfFxcdWQ4MDRbXFx1ZGY0MS1cXHVkZjQ0XXxcXHVkODA0XFx1ZGY0N3xcXHVkODA0XFx1ZGY0OHxcXHVkODA0W1xcdWRmNGItXFx1ZGY0ZF18XFx1ZDgwNFxcdWRmNTB8XFx1ZDgwNFxcdWRmNTd8XFx1ZDgwNFtcXHVkZjVkLVxcdWRmNjNdfFxcdWQ4MDVbXFx1ZGM4MC1cXHVkY2IyXXxcXHVkODA1XFx1ZGNiOXxcXHVkODA1W1xcdWRjYmItXFx1ZGNiZV18XFx1ZDgwNVxcdWRjYzF8XFx1ZDgwNVtcXHVkY2M0LVxcdWRjYzddfFxcdWQ4MDVbXFx1ZGNkMC1cXHVkY2Q5XXxcXHVkODA1W1xcdWRkODAtXFx1ZGRiMV18XFx1ZDgwNVtcXHVkZGI4LVxcdWRkYmJdfFxcdWQ4MDVcXHVkZGJlfFxcdWQ4MDVbXFx1ZGRjMS1cXHVkZGRiXXxcXHVkODA1W1xcdWRlMDAtXFx1ZGUzMl18XFx1ZDgwNVxcdWRlM2J8XFx1ZDgwNVxcdWRlM2N8XFx1ZDgwNVxcdWRlM2V8XFx1ZDgwNVtcXHVkZTQxLVxcdWRlNDRdfFxcdWQ4MDVbXFx1ZGU1MC1cXHVkZTU5XXxcXHVkODA1W1xcdWRlODAtXFx1ZGVhYV18XFx1ZDgwNVxcdWRlYWN8XFx1ZDgwNVxcdWRlYWV8XFx1ZDgwNVxcdWRlYWZ8XFx1ZDgwNVxcdWRlYjZ8XFx1ZDgwNVtcXHVkZWMwLVxcdWRlYzldfFxcdWQ4MDVbXFx1ZGYwMC1cXHVkZjE5XXxcXHVkODA1XFx1ZGYyMHxcXHVkODA1XFx1ZGYyMXxcXHVkODA1XFx1ZGYyNnxcXHVkODA1W1xcdWRmMzAtXFx1ZGYzZl18XFx1ZDgwNltcXHVkY2EwLVxcdWRjZjJdfFxcdWQ4MDZcXHVkY2ZmfFxcdWQ4MDZbXFx1ZGVjMC1cXHVkZWY4XXxcXHVkODA4W1xcdWRjMDAtXFx1ZGY5OV18XFx1ZDgwOVtcXHVkYzAwLVxcdWRjNmVdfFxcdWQ4MDlbXFx1ZGM3MC1cXHVkYzc0XXxcXHVkODA5W1xcdWRjODAtXFx1ZGQ0M118XFx1ZDgwY1tcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4MGRbXFx1ZGMwMC1cXHVkYzJlXXxcXHVkODExW1xcdWRjMDAtXFx1ZGU0Nl18XFx1ZDgxYVtcXHVkYzAwLVxcdWRlMzhdfFxcdWQ4MWFbXFx1ZGU0MC1cXHVkZTVlXXxcXHVkODFhW1xcdWRlNjAtXFx1ZGU2OV18XFx1ZDgxYVxcdWRlNmV8XFx1ZDgxYVxcdWRlNmZ8XFx1ZDgxYVtcXHVkZWQwLVxcdWRlZWRdfFxcdWQ4MWFcXHVkZWY1fFxcdWQ4MWFbXFx1ZGYwMC1cXHVkZjJmXXxcXHVkODFhW1xcdWRmMzctXFx1ZGY0NV18XFx1ZDgxYVtcXHVkZjUwLVxcdWRmNTldfFxcdWQ4MWFbXFx1ZGY1Yi1cXHVkZjYxXXxcXHVkODFhW1xcdWRmNjMtXFx1ZGY3N118XFx1ZDgxYVtcXHVkZjdkLVxcdWRmOGZdfFxcdWQ4MWJbXFx1ZGYwMC1cXHVkZjQ0XXxcXHVkODFiW1xcdWRmNTAtXFx1ZGY3ZV18XFx1ZDgxYltcXHVkZjkzLVxcdWRmOWZdfFxcdWQ4MmNcXHVkYzAwfFxcdWQ4MmNcXHVkYzAxfFxcdWQ4MmZbXFx1ZGMwMC1cXHVkYzZhXXxcXHVkODJmW1xcdWRjNzAtXFx1ZGM3Y118XFx1ZDgyZltcXHVkYzgwLVxcdWRjODhdfFxcdWQ4MmZbXFx1ZGM5MC1cXHVkYzk5XXxcXHVkODJmXFx1ZGM5Y3xcXHVkODJmXFx1ZGM5ZnxcXHVkODM0W1xcdWRjMDAtXFx1ZGNmNV18XFx1ZDgzNFtcXHVkZDAwLVxcdWRkMjZdfFxcdWQ4MzRbXFx1ZGQyOS1cXHVkZDY2XXxcXHVkODM0W1xcdWRkNmEtXFx1ZGQ3Ml18XFx1ZDgzNFxcdWRkODN8XFx1ZDgzNFxcdWRkODR8XFx1ZDgzNFtcXHVkZDhjLVxcdWRkYTldfFxcdWQ4MzRbXFx1ZGRhZS1cXHVkZGU4XXxcXHVkODM0W1xcdWRmNjAtXFx1ZGY3MV18XFx1ZDgzNVtcXHVkYzAwLVxcdWRjNTRdfFxcdWQ4MzVbXFx1ZGM1Ni1cXHVkYzljXXxcXHVkODM1XFx1ZGM5ZXxcXHVkODM1XFx1ZGM5ZnxcXHVkODM1XFx1ZGNhMnxcXHVkODM1XFx1ZGNhNXxcXHVkODM1XFx1ZGNhNnxcXHVkODM1W1xcdWRjYTktXFx1ZGNhY118XFx1ZDgzNVtcXHVkY2FlLVxcdWRjYjldfFxcdWQ4MzVcXHVkY2JifFxcdWQ4MzVbXFx1ZGNiZC1cXHVkY2MzXXxcXHVkODM1W1xcdWRjYzUtXFx1ZGQwNV18XFx1ZDgzNVtcXHVkZDA3LVxcdWRkMGFdfFxcdWQ4MzVbXFx1ZGQwZC1cXHVkZDE0XXxcXHVkODM1W1xcdWRkMTYtXFx1ZGQxY118XFx1ZDgzNVtcXHVkZDFlLVxcdWRkMzldfFxcdWQ4MzVbXFx1ZGQzYi1cXHVkZDNlXXxcXHVkODM1W1xcdWRkNDAtXFx1ZGQ0NF18XFx1ZDgzNVxcdWRkNDZ8XFx1ZDgzNVtcXHVkZDRhLVxcdWRkNTBdfFxcdWQ4MzVbXFx1ZGQ1Mi1cXHVkZWE1XXxcXHVkODM1W1xcdWRlYTgtXFx1ZGVkYV18XFx1ZDgzNVtcXHVkZWRjLVxcdWRmMTRdfFxcdWQ4MzVbXFx1ZGYxNi1cXHVkZjRlXXxcXHVkODM1W1xcdWRmNTAtXFx1ZGY4OF18XFx1ZDgzNVtcXHVkZjhhLVxcdWRmYzJdfFxcdWQ4MzVbXFx1ZGZjNC1cXHVkZmNiXXxcXHVkODM2W1xcdWRjMDAtXFx1ZGRmZl18XFx1ZDgzNltcXHVkZTM3LVxcdWRlM2FdfFxcdWQ4MzZbXFx1ZGU2ZC1cXHVkZTc0XXxcXHVkODM2W1xcdWRlNzYtXFx1ZGU4M118XFx1ZDgzNltcXHVkZTg1LVxcdWRlOGJdfFxcdWQ4M2NbXFx1ZGQxMC1cXHVkZDJlXXxcXHVkODNjW1xcdWRkMzAtXFx1ZGQ2OV18XFx1ZDgzY1tcXHVkZDcwLVxcdWRkOWFdfFxcdWQ4M2NbXFx1ZGRlNi1cXHVkZTAyXXxcXHVkODNjW1xcdWRlMTAtXFx1ZGUzYV18XFx1ZDgzY1tcXHVkZTQwLVxcdWRlNDhdfFxcdWQ4M2NcXHVkZTUwfFxcdWQ4M2NcXHVkZTUxfFtcXHVkODQwLVxcdWQ4NjhdW1xcdWRjMDAtXFx1ZGZmZl18XFx1ZDg2OVtcXHVkYzAwLVxcdWRlZDZdfFxcdWQ4NjlbXFx1ZGYwMC1cXHVkZmZmXXxbXFx1ZDg2YS1cXHVkODZjXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4NmRbXFx1ZGMwMC1cXHVkZjM0XXxcXHVkODZkW1xcdWRmNDAtXFx1ZGZmZl18XFx1ZDg2ZVtcXHVkYzAwLVxcdWRjMWRdfFxcdWQ4NmVbXFx1ZGMyMC1cXHVkZmZmXXxbXFx1ZDg2Zi1cXHVkODcyXVtcXHVkYzAwLVxcdWRmZmZdfFxcdWQ4NzNbXFx1ZGMwMC1cXHVkZWExXXxcXHVkODdlW1xcdWRjMDAtXFx1ZGUxZF18W1xcdWRiODAtXFx1ZGJiZV1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkYmJmW1xcdWRjMDAtXFx1ZGZmZF18W1xcdWRiYzAtXFx1ZGJmZV1bXFx1ZGMwMC1cXHVkZmZmXXxcXHVkYmZmW1xcdWRjMDAtXFx1ZGZmZF0nICtcblx0XHRcdCcpfCgnICtcblx0XHRcdFx0J1tcXHUwNTkwXFx1MDViZVxcdTA1YzBcXHUwNWMzXFx1MDVjNlxcdTA1YzgtXFx1MDVmZlxcdTA3YzAtXFx1MDdlYVxcdTA3ZjRcXHUwN2Y1XFx1MDdmYS1cXHUwODE1XFx1MDgxYVxcdTA4MjRcXHUwODI4XFx1MDgyZS1cXHUwODU4XFx1MDg1Yy1cXHUwODlmXFx1MjAwZlxcdWZiMWRcXHVmYjFmLVxcdWZiMjhcXHVmYjJhLVxcdWZiNGZcXHUwNjA4XFx1MDYwYlxcdTA2MGRcXHUwNjFiLVxcdTA2NGFcXHUwNjZkLVxcdTA2NmZcXHUwNjcxLVxcdTA2ZDVcXHUwNmU1XFx1MDZlNlxcdTA2ZWVcXHUwNmVmXFx1MDZmYS1cXHUwNzEwXFx1MDcxMi1cXHUwNzJmXFx1MDc0Yi1cXHUwN2E1XFx1MDdiMS1cXHUwN2JmXFx1MDhhMC1cXHUwOGUyXFx1ZmI1MC1cXHVmZDNkXFx1ZmQ0MC1cXHVmZGNmXFx1ZmRmMC1cXHVmZGZjXFx1ZmRmZVxcdWZkZmZcXHVmZTcwLVxcdWZlZmVdfFxcdWQ4MDJbXFx1ZGMwMC1cXHVkZDFlXXxcXHVkODAyW1xcdWRkMjAtXFx1ZGUwMF18XFx1ZDgwMlxcdWRlMDR8XFx1ZDgwMltcXHVkZTA3LVxcdWRlMGJdfFxcdWQ4MDJbXFx1ZGUxMC1cXHVkZTM3XXxcXHVkODAyW1xcdWRlM2ItXFx1ZGUzZV18XFx1ZDgwMltcXHVkZTQwLVxcdWRlZTRdfFxcdWQ4MDJbXFx1ZGVlNy1cXHVkZjM4XXxcXHVkODAyW1xcdWRmNDAtXFx1ZGZmZl18XFx1ZDgwM1tcXHVkYzAwLVxcdWRlNWZdfFxcdWQ4MDNbXFx1ZGU3Zi1cXHVkZmZmXXxcXHVkODNhW1xcdWRjMDAtXFx1ZGNjZl18XFx1ZDgzYVtcXHVkY2Q3LVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGMwMC1cXHVkZGZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZjAwLVxcdWRmZmZdfFxcdWQ4M2JbXFx1ZGYwMC1cXHVkZmZmXXxcXHVkODNiW1xcdWRmMDAtXFx1ZGZmZl18XFx1ZDgzYltcXHVkZTAwLVxcdWRlZWZdfFxcdWQ4M2JbXFx1ZGVmMi1cXHVkZWZmXScgK1xuXHRcdFx0JyknICtcblx0XHQnKSdcblx0KTtcblxuXHQvKipcblx0ICogR2V0cyBkaXJlY3Rpb25hbGl0eSBvZiB0aGUgZmlyc3Qgc3Ryb25nbHkgZGlyZWN0aW9uYWwgY29kZXBvaW50XG5cdCAqXG5cdCAqIFRoaXMgaXMgdGhlIHJ1bGUgdGhlIEJJREkgYWxnb3JpdGhtIHVzZXMgdG8gZGV0ZXJtaW5lIHRoZSBkaXJlY3Rpb25hbGl0eSBvZlxuXHQgKiBwYXJhZ3JhcGhzICggaHR0cDovL3VuaWNvZGUub3JnL3JlcG9ydHMvdHI5LyNUaGVfUGFyYWdyYXBoX0xldmVsICkgYW5kXG5cdCAqIEZTSSBpc29sYXRlcyAoIGh0dHA6Ly91bmljb2RlLm9yZy9yZXBvcnRzL3RyOS8jRXhwbGljaXRfRGlyZWN0aW9uYWxfSXNvbGF0ZXMgKS5cblx0ICpcblx0ICogVE9ETzogRG9lcyBub3QgaGFuZGxlIEJJREkgY29udHJvbCBjaGFyYWN0ZXJzIGluc2lkZSB0aGUgdGV4dC5cblx0ICogVE9ETzogRG9lcyBub3QgaGFuZGxlIHVuYWxsb2NhdGVkIGNoYXJhY3RlcnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IGZyb20gd2hpY2ggdG8gZXh0cmFjdCBpbml0aWFsIGRpcmVjdGlvbmFsaXR5LlxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9IERpcmVjdGlvbmFsaXR5IChlaXRoZXIgJ2x0cicgb3IgJ3J0bCcpXG5cdCAqL1xuXHRmdW5jdGlvbiBzdHJvbmdEaXJGcm9tQ29udGVudCggdGV4dCApIHtcblx0XHR2YXIgbSA9IHRleHQubWF0Y2goIHN0cm9uZ0RpclJlZ0V4cCApO1xuXHRcdGlmICggIW0gKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdFx0aWYgKCBtWyAyIF0gPT09IHVuZGVmaW5lZCApIHtcblx0XHRcdHJldHVybiAnbHRyJztcblx0XHR9XG5cdFx0cmV0dXJuICdydGwnO1xuXHR9XG5cblx0JC5leHRlbmQoICQuaTE4bi5wYXJzZXIuZW1pdHRlciwge1xuXHRcdC8qKlxuXHRcdCAqIFdyYXBzIGFyZ3VtZW50IHdpdGggdW5pY29kZSBjb250cm9sIGNoYXJhY3RlcnMgZm9yIGRpcmVjdGlvbmFsaXR5IHNhZmV0eVxuXHRcdCAqXG5cdFx0ICogVGhpcyBzb2x2ZXMgdGhlIHByb2JsZW0gd2hlcmUgZGlyZWN0aW9uYWxpdHktbmV1dHJhbCBjaGFyYWN0ZXJzIGF0IHRoZSBlZGdlIG9mXG5cdFx0ICogdGhlIGFyZ3VtZW50IHN0cmluZyBnZXQgaW50ZXJwcmV0ZWQgd2l0aCB0aGUgd3JvbmcgZGlyZWN0aW9uYWxpdHkgZnJvbSB0aGVcblx0XHQgKiBlbmNsb3NpbmcgY29udGV4dCwgZ2l2aW5nIHJlbmRlcmluZ3MgdGhhdCBsb29rIGNvcnJ1cHRlZCBsaWtlIFwiKEJlbl8oV01GXCIuXG5cdFx0ICpcblx0XHQgKiBUaGUgd3JhcHBpbmcgaXMgTFJFLi4uUERGIG9yIFJMRS4uLlBERiwgZGVwZW5kaW5nIG9uIHRoZSBkZXRlY3RlZFxuXHRcdCAqIGRpcmVjdGlvbmFsaXR5IG9mIHRoZSBhcmd1bWVudCBzdHJpbmcsIHVzaW5nIHRoZSBCSURJIGFsZ29yaXRobSdzIG93biBcIkZpcnN0XG5cdFx0ICogc3Ryb25nIGRpcmVjdGlvbmFsIGNvZGVwb2ludFwiIHJ1bGUuIEVzc2VudGlhbGx5LCB0aGlzIHdvcmtzIHJvdW5kIHRoZSBmYWN0IHRoYXRcblx0XHQgKiB0aGVyZSBpcyBubyBlbWJlZGRpbmcgZXF1aXZhbGVudCBvZiBVKzIwNjggRlNJIChpc29sYXRpb24gd2l0aCBoZXVyaXN0aWNcblx0XHQgKiBkaXJlY3Rpb24gaW5mZXJlbmNlKS4gVGhlIGxhdHRlciBpcyBjbGVhbmVyIGJ1dCBzdGlsbCBub3Qgd2lkZWx5IHN1cHBvcnRlZC5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nW119IG5vZGVzIFRoZSB0ZXh0IG5vZGVzIGZyb20gd2hpY2ggdG8gdGFrZSB0aGUgZmlyc3QgaXRlbS5cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IFdyYXBwZWQgU3RyaW5nIG9mIGNvbnRlbnQgYXMgbmVlZGVkLlxuXHRcdCAqL1xuXHRcdGJpZGk6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgZGlyID0gc3Ryb25nRGlyRnJvbUNvbnRlbnQoIG5vZGVzWyAwIF0gKTtcblx0XHRcdGlmICggZGlyID09PSAnbHRyJyApIHtcblx0XHRcdFx0Ly8gV3JhcCBpbiBMRUZULVRPLVJJR0hUIEVNQkVERElORyAuLi4gUE9QIERJUkVDVElPTkFMIEZPUk1BVFRJTkdcblx0XHRcdFx0cmV0dXJuICdcXHUyMDJBJyArIG5vZGVzWyAwIF0gKyAnXFx1MjAyQyc7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIGRpciA9PT0gJ3J0bCcgKSB7XG5cdFx0XHRcdC8vIFdyYXAgaW4gUklHSFQtVE8tTEVGVCBFTUJFRERJTkcgLi4uIFBPUCBESVJFQ1RJT05BTCBGT1JNQVRUSU5HXG5cdFx0XHRcdHJldHVybiAnXFx1MjAyQicgKyBub2Rlc1sgMCBdICsgJ1xcdTIwMkMnO1xuXHRcdFx0fVxuXHRcdFx0Ly8gTm8gc3Ryb25nIGRpcmVjdGlvbmFsaXR5OiBkbyBub3Qgd3JhcFxuXHRcdFx0cmV0dXJuIG5vZGVzWyAwIF07XG5cdFx0fVxuXHR9ICk7XG59KCBqUXVlcnkgKSApO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMS0yMDEzIFNhbnRob3NoIFRob3R0aW5nYWwsIE5laWwgS2FuZGFsZ2FvbmthclxuICpcbiAqIGpxdWVyeS5pMThuIGlzIGR1YWwgbGljZW5zZWQgR1BMdjIgb3IgbGF0ZXIgYW5kIE1JVC4gWW91IGRvbid0IGhhdmUgdG8gZG9cbiAqIGFueXRoaW5nIHNwZWNpYWwgdG8gY2hvb3NlIG9uZSBsaWNlbnNlIG9yIHRoZSBvdGhlciBhbmQgeW91IGRvbid0IGhhdmUgdG9cbiAqIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLiBZb3UgYXJlIGZyZWUgdG8gdXNlXG4gKiBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIE1lc3NhZ2VQYXJzZXJFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMubGFuZ3VhZ2UgPSAkLmkxOG4ubGFuZ3VhZ2VzWyBTdHJpbmcubG9jYWxlIF0gfHwgJC5pMThuLmxhbmd1YWdlc1sgJ2RlZmF1bHQnIF07XG5cdH07XG5cblx0TWVzc2FnZVBhcnNlckVtaXR0ZXIucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBNZXNzYWdlUGFyc2VyRW1pdHRlcixcblxuXHRcdC8qKlxuXHRcdCAqIChXZSBwdXQgdGhpcyBtZXRob2QgZGVmaW5pdGlvbiBoZXJlLCBhbmQgbm90IGluIHByb3RvdHlwZSwgdG8gbWFrZVxuXHRcdCAqIHN1cmUgaXQncyBub3Qgb3ZlcndyaXR0ZW4gYnkgYW55IG1hZ2ljLikgV2FsayBlbnRpcmUgbm9kZSBzdHJ1Y3R1cmUsXG5cdFx0ICogYXBwbHlpbmcgcmVwbGFjZW1lbnRzIGFuZCB0ZW1wbGF0ZSBmdW5jdGlvbnMgd2hlbiBhcHByb3ByaWF0ZVxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtNaXhlZH0gbm9kZSBhYnN0cmFjdCBzeW50YXggdHJlZSAodG9wIG5vZGUgb3Igc3Vibm9kZSlcblx0XHQgKiBAcGFyYW0ge0FycmF5fSByZXBsYWNlbWVudHMgZm9yICQxLCAkMiwgLi4uICRuXG5cdFx0ICogQHJldHVybiB7TWl4ZWR9IHNpbmdsZS1zdHJpbmcgbm9kZSBvciBhcnJheSBvZiBub2RlcyBzdWl0YWJsZSBmb3Jcblx0XHQgKiAgalF1ZXJ5IGFwcGVuZGluZy5cblx0XHQgKi9cblx0XHRlbWl0OiBmdW5jdGlvbiAoIG5vZGUsIHJlcGxhY2VtZW50cyApIHtcblx0XHRcdHZhciByZXQsIHN1Ym5vZGVzLCBvcGVyYXRpb24sXG5cdFx0XHRcdG1lc3NhZ2VQYXJzZXJFbWl0dGVyID0gdGhpcztcblxuXHRcdFx0c3dpdGNoICggdHlwZW9mIG5vZGUgKSB7XG5cdFx0XHRcdGNhc2UgJ3N0cmluZyc6XG5cdFx0XHRcdGNhc2UgJ251bWJlcic6XG5cdFx0XHRcdFx0cmV0ID0gbm9kZTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAnb2JqZWN0Jzpcblx0XHRcdFx0Ly8gbm9kZSBpcyBhbiBhcnJheSBvZiBub2Rlc1xuXHRcdFx0XHRcdHN1Ym5vZGVzID0gJC5tYXAoIG5vZGUuc2xpY2UoIDEgKSwgZnVuY3Rpb24gKCBuICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG1lc3NhZ2VQYXJzZXJFbWl0dGVyLmVtaXQoIG4sIHJlcGxhY2VtZW50cyApO1xuXHRcdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRcdG9wZXJhdGlvbiA9IG5vZGVbIDAgXS50b0xvd2VyQ2FzZSgpO1xuXG5cdFx0XHRcdFx0aWYgKCB0eXBlb2YgbWVzc2FnZVBhcnNlckVtaXR0ZXJbIG9wZXJhdGlvbiBdID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0cmV0ID0gbWVzc2FnZVBhcnNlckVtaXR0ZXJbIG9wZXJhdGlvbiBdKCBzdWJub2RlcywgcmVwbGFjZW1lbnRzICk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ3Vua25vd24gb3BlcmF0aW9uIFwiJyArIG9wZXJhdGlvbiArICdcIicgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAndW5kZWZpbmVkJzpcblx0XHRcdFx0Ly8gUGFyc2luZyB0aGUgZW1wdHkgc3RyaW5nIChhcyBhbiBlbnRpcmUgZXhwcmVzc2lvbiwgb3IgYXMgYVxuXHRcdFx0XHQvLyBwYXJhbUV4cHJlc3Npb24gaW4gYSB0ZW1wbGF0ZSkgcmVzdWx0cyBpbiB1bmRlZmluZWRcblx0XHRcdFx0Ly8gUGVyaGFwcyBhIG1vcmUgY2xldmVyIHBhcnNlciBjYW4gZGV0ZWN0IHRoaXMsIGFuZCByZXR1cm4gdGhlXG5cdFx0XHRcdC8vIGVtcHR5IHN0cmluZz8gT3IgaXMgdGhhdCB1c2VmdWwgaW5mb3JtYXRpb24/XG5cdFx0XHRcdC8vIFRoZSBsb2dpY2FsIHRoaW5nIGlzIHByb2JhYmx5IHRvIHJldHVybiB0aGUgZW1wdHkgc3RyaW5nIGhlcmVcblx0XHRcdFx0Ly8gd2hlbiB3ZSBlbmNvdW50ZXIgdW5kZWZpbmVkLlxuXHRcdFx0XHRcdHJldCA9ICcnO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvciggJ3VuZXhwZWN0ZWQgdHlwZSBpbiBBU1Q6ICcgKyB0eXBlb2Ygbm9kZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBQYXJzaW5nIGhhcyBiZWVuIGFwcGxpZWQgZGVwdGgtZmlyc3Qgd2UgY2FuIGFzc3VtZSB0aGF0IGFsbCBub2Rlc1xuXHRcdCAqIGhlcmUgYXJlIHNpbmdsZSBub2RlcyBNdXN0IHJldHVybiBhIHNpbmdsZSBub2RlIHRvIHBhcmVudHMgLS0gYVxuXHRcdCAqIGpRdWVyeSB3aXRoIHN5bnRoZXRpYyBzcGFuIEhvd2V2ZXIsIHVud3JhcCBhbnkgb3RoZXIgc3ludGhldGljIHNwYW5zXG5cdFx0ICogaW4gb3VyIGNoaWxkcmVuIGFuZCBwYXNzIHRoZW0gdXB3YXJkc1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgTWl4ZWQsIHNvbWUgc2luZ2xlIG5vZGVzLCBzb21lIGFycmF5cyBvZiBub2Rlcy5cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Y29uY2F0OiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xuXG5cdFx0XHQkLmVhY2goIG5vZGVzLCBmdW5jdGlvbiAoIGksIG5vZGUgKSB7XG5cdFx0XHRcdC8vIHN0cmluZ3MsIGludGVnZXJzLCBhbnl0aGluZyBlbHNlXG5cdFx0XHRcdHJlc3VsdCArPSBub2RlO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBSZXR1cm4gZXNjYXBlZCByZXBsYWNlbWVudCBvZiBjb3JyZWN0IGluZGV4LCBvciBzdHJpbmcgaWZcblx0XHQgKiB1bmF2YWlsYWJsZS4gTm90ZSB0aGF0IHdlIGV4cGVjdCB0aGUgcGFyc2VkIHBhcmFtZXRlciB0byBiZVxuXHRcdCAqIHplcm8tYmFzZWQuIGkuZS4gJDEgc2hvdWxkIGhhdmUgYmVjb21lIFsgMCBdLiBpZiB0aGUgc3BlY2lmaWVkXG5cdFx0ICogcGFyYW1ldGVyIGlzIG5vdCBmb3VuZCByZXR1cm4gdGhlIHNhbWUgc3RyaW5nIChlLmcuIFwiJDk5XCIgLT5cblx0XHQgKiBwYXJhbWV0ZXIgOTggLT4gbm90IGZvdW5kIC0+IHJldHVybiBcIiQ5OVwiICkgVE9ETyB0aHJvdyBlcnJvciBpZlxuXHRcdCAqIG5vZGVzLmxlbmd0aCA+IDEgP1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gbm9kZXMgT25lIGVsZW1lbnQsIGludGVnZXIsIG4gPj0gMFxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IHJlcGxhY2VtZW50cyBmb3IgJDEsICQyLCAuLi4gJG5cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHJlcGxhY2VtZW50XG5cdFx0ICovXG5cdFx0cmVwbGFjZTogZnVuY3Rpb24gKCBub2RlcywgcmVwbGFjZW1lbnRzICkge1xuXHRcdFx0dmFyIGluZGV4ID0gcGFyc2VJbnQoIG5vZGVzWyAwIF0sIDEwICk7XG5cblx0XHRcdGlmICggaW5kZXggPCByZXBsYWNlbWVudHMubGVuZ3RoICkge1xuXHRcdFx0XHQvLyByZXBsYWNlbWVudCBpcyBub3QgYSBzdHJpbmcsIGRvbid0IHRvdWNoIVxuXHRcdFx0XHRyZXR1cm4gcmVwbGFjZW1lbnRzWyBpbmRleCBdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaW5kZXggbm90IGZvdW5kLCBmYWxsYmFjayB0byBkaXNwbGF5aW5nIHZhcmlhYmxlXG5cdFx0XHRcdHJldHVybiAnJCcgKyAoIGluZGV4ICsgMSApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBUcmFuc2Zvcm0gcGFyc2VkIHN0cnVjdHVyZSBpbnRvIHBsdXJhbGl6YXRpb24gbi5iLiBUaGUgZmlyc3Qgbm9kZSBtYXlcblx0XHQgKiBiZSBhIG5vbi1pbnRlZ2VyIChmb3IgaW5zdGFuY2UsIGEgc3RyaW5nIHJlcHJlc2VudGluZyBhbiBBcmFiaWNcblx0XHQgKiBudW1iZXIpLiBTbyBjb252ZXJ0IGl0IGJhY2sgd2l0aCB0aGUgY3VycmVudCBsYW5ndWFnZSdzXG5cdFx0ICogY29udmVydE51bWJlci5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzIExpc3QgWyB7U3RyaW5nfE51bWJlcn0sIHtTdHJpbmd9LCB7U3RyaW5nfSAuLi4gXVxuXHRcdCAqIEByZXR1cm4ge3N0cmluZ30gc2VsZWN0ZWQgcGx1cmFsaXplZCBmb3JtIGFjY29yZGluZyB0byBjdXJyZW50XG5cdFx0ICogIGxhbmd1YWdlLlxuXHRcdCAqL1xuXHRcdHBsdXJhbDogZnVuY3Rpb24gKCBub2RlcyApIHtcblx0XHRcdHZhciBjb3VudCA9IHBhcnNlRmxvYXQoIHRoaXMubGFuZ3VhZ2UuY29udmVydE51bWJlciggbm9kZXNbIDAgXSwgMTAgKSApLFxuXHRcdFx0XHRmb3JtcyA9IG5vZGVzLnNsaWNlKCAxICk7XG5cblx0XHRcdHJldHVybiBmb3Jtcy5sZW5ndGggPyB0aGlzLmxhbmd1YWdlLmNvbnZlcnRQbHVyYWwoIGNvdW50LCBmb3JtcyApIDogJyc7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zZm9ybSBwYXJzZWQgc3RydWN0dXJlIGludG8gZ2VuZGVyIFVzYWdlXG5cdFx0ICoge3tnZW5kZXI6Z2VuZGVyfG1hc2N1bGluZXxmZW1pbmluZXxuZXV0cmFsfX0uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBMaXN0IFsge1N0cmluZ30sIHtTdHJpbmd9LCB7U3RyaW5nfSAsIHtTdHJpbmd9IF1cblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9IHNlbGVjdGVkIGdlbmRlciBmb3JtIGFjY29yZGluZyB0byBjdXJyZW50IGxhbmd1YWdlXG5cdFx0ICovXG5cdFx0Z2VuZGVyOiBmdW5jdGlvbiAoIG5vZGVzICkge1xuXHRcdFx0dmFyIGdlbmRlciA9IG5vZGVzWyAwIF0sXG5cdFx0XHRcdGZvcm1zID0gbm9kZXMuc2xpY2UoIDEgKTtcblxuXHRcdFx0cmV0dXJuIHRoaXMubGFuZ3VhZ2UuZ2VuZGVyKCBnZW5kZXIsIGZvcm1zICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIFRyYW5zZm9ybSBwYXJzZWQgc3RydWN0dXJlIGludG8gZ3JhbW1hciBjb252ZXJzaW9uLiBJbnZva2VkIGJ5XG5cdFx0ICogcHV0dGluZyB7e2dyYW1tYXI6Zm9ybXx3b3JkfX0gaW4gYSBtZXNzYWdlXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge0FycmF5fSBub2RlcyBMaXN0IFt7R3JhbW1hciBjYXNlIGVnOiBnZW5pdGl2ZX0sIHtTdHJpbmcgd29yZH1dXG5cdFx0ICogQHJldHVybiB7c3RyaW5nfSBzZWxlY3RlZCBncmFtbWF0aWNhbCBmb3JtIGFjY29yZGluZyB0byBjdXJyZW50XG5cdFx0ICogIGxhbmd1YWdlLlxuXHRcdCAqL1xuXHRcdGdyYW1tYXI6IGZ1bmN0aW9uICggbm9kZXMgKSB7XG5cdFx0XHR2YXIgZm9ybSA9IG5vZGVzWyAwIF0sXG5cdFx0XHRcdHdvcmQgPSBub2Rlc1sgMSBdO1xuXG5cdFx0XHRyZXR1cm4gd29yZCAmJiBmb3JtICYmIHRoaXMubGFuZ3VhZ2UuY29udmVydEdyYW1tYXIoIHdvcmQsIGZvcm0gKTtcblx0XHR9XG5cdH07XG5cblx0JC5leHRlbmQoICQuaTE4bi5wYXJzZXIuZW1pdHRlciwgbmV3IE1lc3NhZ2VQYXJzZXJFbWl0dGVyKCkgKTtcbn0oIGpRdWVyeSApICk7XG4iLCIvKiFcbiAqIGpRdWVyeSBJbnRlcm5hdGlvbmFsaXphdGlvbiBsaWJyYXJ5XG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDExLTIwMTMgU2FudGhvc2ggVGhvdHRpbmdhbCwgTmVpbCBLYW5kYWxnYW9ua2FyXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2VcbiAqIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgTWVzc2FnZVBhcnNlciA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcblx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCgge30sICQuaTE4bi5wYXJzZXIuZGVmYXVsdHMsIG9wdGlvbnMgKTtcblx0XHR0aGlzLmxhbmd1YWdlID0gJC5pMThuLmxhbmd1YWdlc1sgU3RyaW5nLmxvY2FsZSBdIHx8ICQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXHRcdHRoaXMuZW1pdHRlciA9ICQuaTE4bi5wYXJzZXIuZW1pdHRlcjtcblx0fTtcblxuXHRNZXNzYWdlUGFyc2VyLnByb3RvdHlwZSA9IHtcblxuXHRcdGNvbnN0cnVjdG9yOiBNZXNzYWdlUGFyc2VyLFxuXG5cdFx0c2ltcGxlUGFyc2U6IGZ1bmN0aW9uICggbWVzc2FnZSwgcGFyYW1ldGVycyApIHtcblx0XHRcdHJldHVybiBtZXNzYWdlLnJlcGxhY2UoIC9cXCQoXFxkKykvZywgZnVuY3Rpb24gKCBzdHIsIG1hdGNoICkge1xuXHRcdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggbWF0Y2gsIDEwICkgLSAxO1xuXG5cdFx0XHRcdHJldHVybiBwYXJhbWV0ZXJzWyBpbmRleCBdICE9PSB1bmRlZmluZWQgPyBwYXJhbWV0ZXJzWyBpbmRleCBdIDogJyQnICsgbWF0Y2g7XG5cdFx0XHR9ICk7XG5cdFx0fSxcblxuXHRcdHBhcnNlOiBmdW5jdGlvbiAoIG1lc3NhZ2UsIHJlcGxhY2VtZW50cyApIHtcblx0XHRcdGlmICggbWVzc2FnZS5pbmRleE9mKCAne3snICkgPCAwICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zaW1wbGVQYXJzZSggbWVzc2FnZSwgcmVwbGFjZW1lbnRzICk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuZW1pdHRlci5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbICQuaTE4bigpLmxvY2FsZSBdIHx8XG5cdFx0XHRcdCQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5lbWl0dGVyLmVtaXQoIHRoaXMuYXN0KCBtZXNzYWdlICksIHJlcGxhY2VtZW50cyApO1xuXHRcdH0sXG5cblx0XHRhc3Q6IGZ1bmN0aW9uICggbWVzc2FnZSApIHtcblx0XHRcdHZhciBwaXBlLCBjb2xvbiwgYmFja3NsYXNoLCBhbnlDaGFyYWN0ZXIsIGRvbGxhciwgZGlnaXRzLCByZWd1bGFyTGl0ZXJhbCxcblx0XHRcdFx0cmVndWxhckxpdGVyYWxXaXRob3V0QmFyLCByZWd1bGFyTGl0ZXJhbFdpdGhvdXRTcGFjZSwgZXNjYXBlZE9yTGl0ZXJhbFdpdGhvdXRCYXIsXG5cdFx0XHRcdGVzY2FwZWRPclJlZ3VsYXJMaXRlcmFsLCB0ZW1wbGF0ZUNvbnRlbnRzLCB0ZW1wbGF0ZU5hbWUsIG9wZW5UZW1wbGF0ZSxcblx0XHRcdFx0Y2xvc2VUZW1wbGF0ZSwgZXhwcmVzc2lvbiwgcGFyYW1FeHByZXNzaW9uLCByZXN1bHQsXG5cdFx0XHRcdHBvcyA9IDA7XG5cblx0XHRcdC8vIFRyeSBwYXJzZXJzIHVudGlsIG9uZSB3b3JrcywgaWYgbm9uZSB3b3JrIHJldHVybiBudWxsXG5cdFx0XHRmdW5jdGlvbiBjaG9pY2UoIHBhcnNlclN5bnRheCApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgaSwgcmVzdWx0O1xuXG5cdFx0XHRcdFx0Zm9yICggaSA9IDA7IGkgPCBwYXJzZXJTeW50YXgubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBwYXJzZXJTeW50YXhbIGkgXSgpO1xuXG5cdFx0XHRcdFx0XHRpZiAoIHJlc3VsdCAhPT0gbnVsbCApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVHJ5IHNldmVyYWwgcGFyc2VyU3ludGF4LWVzIGluIGEgcm93LlxuXHRcdFx0Ly8gQWxsIG11c3Qgc3VjY2VlZDsgb3RoZXJ3aXNlLCByZXR1cm4gbnVsbC5cblx0XHRcdC8vIFRoaXMgaXMgdGhlIG9ubHkgZWFnZXIgb25lLlxuXHRcdFx0ZnVuY3Rpb24gc2VxdWVuY2UoIHBhcnNlclN5bnRheCApIHtcblx0XHRcdFx0dmFyIGksIHJlcyxcblx0XHRcdFx0XHRvcmlnaW5hbFBvcyA9IHBvcyxcblx0XHRcdFx0XHRyZXN1bHQgPSBbXTtcblxuXHRcdFx0XHRmb3IgKCBpID0gMDsgaSA8IHBhcnNlclN5bnRheC5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0XHRyZXMgPSBwYXJzZXJTeW50YXhbIGkgXSgpO1xuXG5cdFx0XHRcdFx0aWYgKCByZXMgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRwb3MgPSBvcmlnaW5hbFBvcztcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVzdWx0LnB1c2goIHJlcyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gUnVuIHRoZSBzYW1lIHBhcnNlciBvdmVyIGFuZCBvdmVyIHVudGlsIGl0IGZhaWxzLlxuXHRcdFx0Ly8gTXVzdCBzdWNjZWVkIGEgbWluaW11bSBvZiBuIHRpbWVzOyBvdGhlcndpc2UsIHJldHVybiBudWxsLlxuXHRcdFx0ZnVuY3Rpb24gbk9yTW9yZSggbiwgcCApIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgb3JpZ2luYWxQb3MgPSBwb3MsXG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBbXSxcblx0XHRcdFx0XHRcdHBhcnNlZCA9IHAoKTtcblxuXHRcdFx0XHRcdHdoaWxlICggcGFyc2VkICE9PSBudWxsICkge1xuXHRcdFx0XHRcdFx0cmVzdWx0LnB1c2goIHBhcnNlZCApO1xuXHRcdFx0XHRcdFx0cGFyc2VkID0gcCgpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICggcmVzdWx0Lmxlbmd0aCA8IG4gKSB7XG5cdFx0XHRcdFx0XHRwb3MgPSBvcmlnaW5hbFBvcztcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHRcdFx0fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSGVscGVycyAtLSBqdXN0IG1ha2UgcGFyc2VyU3ludGF4IG91dCBvZiBzaW1wbGVyIEpTIGJ1aWx0aW4gdHlwZXNcblxuXHRcdFx0ZnVuY3Rpb24gbWFrZVN0cmluZ1BhcnNlciggcyApIHtcblx0XHRcdFx0dmFyIGxlbiA9IHMubGVuZ3RoO1xuXG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdCA9IG51bGw7XG5cblx0XHRcdFx0XHRpZiAoIG1lc3NhZ2Uuc2xpY2UoIHBvcywgcG9zICsgbGVuICkgPT09IHMgKSB7XG5cdFx0XHRcdFx0XHRyZXN1bHQgPSBzO1xuXHRcdFx0XHRcdFx0cG9zICs9IGxlbjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBtYWtlUmVnZXhQYXJzZXIoIHJlZ2V4ICkge1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBtYXRjaGVzID0gbWVzc2FnZS5zbGljZSggcG9zICkubWF0Y2goIHJlZ2V4ICk7XG5cblx0XHRcdFx0XHRpZiAoIG1hdGNoZXMgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRwb3MgKz0gbWF0Y2hlc1sgMCBdLmxlbmd0aDtcblxuXHRcdFx0XHRcdHJldHVybiBtYXRjaGVzWyAwIF07XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdHBpcGUgPSBtYWtlU3RyaW5nUGFyc2VyKCAnfCcgKTtcblx0XHRcdGNvbG9uID0gbWFrZVN0cmluZ1BhcnNlciggJzonICk7XG5cdFx0XHRiYWNrc2xhc2ggPSBtYWtlU3RyaW5nUGFyc2VyKCAnXFxcXCcgKTtcblx0XHRcdGFueUNoYXJhY3RlciA9IG1ha2VSZWdleFBhcnNlciggL14uLyApO1xuXHRcdFx0ZG9sbGFyID0gbWFrZVN0cmluZ1BhcnNlciggJyQnICk7XG5cdFx0XHRkaWdpdHMgPSBtYWtlUmVnZXhQYXJzZXIoIC9eXFxkKy8gKTtcblx0XHRcdHJlZ3VsYXJMaXRlcmFsID0gbWFrZVJlZ2V4UGFyc2VyKCAvXltee31bXFxdJFxcXFxdLyApO1xuXHRcdFx0cmVndWxhckxpdGVyYWxXaXRob3V0QmFyID0gbWFrZVJlZ2V4UGFyc2VyKCAvXltee31bXFxdJFxcXFx8XS8gKTtcblx0XHRcdHJlZ3VsYXJMaXRlcmFsV2l0aG91dFNwYWNlID0gbWFrZVJlZ2V4UGFyc2VyKCAvXltee31bXFxdJFxcc10vICk7XG5cblx0XHRcdC8vIFRoZXJlIGlzIGEgZ2VuZXJhbCBwYXR0ZXJuOlxuXHRcdFx0Ly8gcGFyc2UgYSB0aGluZztcblx0XHRcdC8vIGlmIGl0IHdvcmtlZCwgYXBwbHkgdHJhbnNmb3JtLFxuXHRcdFx0Ly8gb3RoZXJ3aXNlIHJldHVybiBudWxsLlxuXHRcdFx0Ly8gQnV0IHVzaW5nIHRoaXMgYXMgYSBjb21iaW5hdG9yIHNlZW1zIHRvIGNhdXNlIHByb2JsZW1zXG5cdFx0XHQvLyB3aGVuIGNvbWJpbmVkIHdpdGggbk9yTW9yZSgpLlxuXHRcdFx0Ly8gTWF5IGJlIHNvbWUgc2NvcGluZyBpc3N1ZS5cblx0XHRcdGZ1bmN0aW9uIHRyYW5zZm9ybSggcCwgZm4gKSB7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdCA9IHAoKTtcblxuXHRcdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogZm4oIHJlc3VsdCApO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVc2VkIHRvIGRlZmluZSBcImxpdGVyYWxzXCIgd2l0aGluIHRlbXBsYXRlIHBhcmFtZXRlcnMuIFRoZSBwaXBlXG5cdFx0XHQvLyBjaGFyYWN0ZXIgaXMgdGhlIHBhcmFtZXRlciBkZWxpbWV0ZXIsIHNvIGJ5IGRlZmF1bHRcblx0XHRcdC8vIGl0IGlzIG5vdCBhIGxpdGVyYWwgaW4gdGhlIHBhcmFtZXRlclxuXHRcdFx0ZnVuY3Rpb24gbGl0ZXJhbFdpdGhvdXRCYXIoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBuT3JNb3JlKCAxLCBlc2NhcGVkT3JMaXRlcmFsV2l0aG91dEJhciApKCk7XG5cblx0XHRcdFx0cmV0dXJuIHJlc3VsdCA9PT0gbnVsbCA/IG51bGwgOiByZXN1bHQuam9pbiggJycgKTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gbGl0ZXJhbCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IG5Pck1vcmUoIDEsIGVzY2FwZWRPclJlZ3VsYXJMaXRlcmFsICkoKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdC5qb2luKCAnJyApO1xuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBlc2NhcGVkTGl0ZXJhbCgpIHtcblx0XHRcdFx0dmFyIHJlc3VsdCA9IHNlcXVlbmNlKCBbIGJhY2tzbGFzaCwgYW55Q2hhcmFjdGVyIF0gKTtcblxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0ID09PSBudWxsID8gbnVsbCA6IHJlc3VsdFsgMSBdO1xuXHRcdFx0fVxuXG5cdFx0XHRjaG9pY2UoIFsgZXNjYXBlZExpdGVyYWwsIHJlZ3VsYXJMaXRlcmFsV2l0aG91dFNwYWNlIF0gKTtcblx0XHRcdGVzY2FwZWRPckxpdGVyYWxXaXRob3V0QmFyID0gY2hvaWNlKCBbIGVzY2FwZWRMaXRlcmFsLCByZWd1bGFyTGl0ZXJhbFdpdGhvdXRCYXIgXSApO1xuXHRcdFx0ZXNjYXBlZE9yUmVndWxhckxpdGVyYWwgPSBjaG9pY2UoIFsgZXNjYXBlZExpdGVyYWwsIHJlZ3VsYXJMaXRlcmFsIF0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gcmVwbGFjZW1lbnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyBkb2xsYXIsIGRpZ2l0cyBdICk7XG5cblx0XHRcdFx0aWYgKCByZXN1bHQgPT09IG51bGwgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gWyAnUkVQTEFDRScsIHBhcnNlSW50KCByZXN1bHRbIDEgXSwgMTAgKSAtIDEgXTtcblx0XHRcdH1cblxuXHRcdFx0dGVtcGxhdGVOYW1lID0gdHJhbnNmb3JtKFxuXHRcdFx0XHQvLyBzZWUgJHdnTGVnYWxUaXRsZUNoYXJzXG5cdFx0XHRcdC8vIG5vdCBhbGxvd2luZyA6IGR1ZSB0byB0aGUgbmVlZCB0byBjYXRjaCBcIlBMVVJBTDokMVwiXG5cdFx0XHRcdG1ha2VSZWdleFBhcnNlciggL15bICFcIiQmJygpKiwuLzAtOTs9P0BBLVpeX2BhLXp+XFx4ODAtXFx4RkYrLV0rLyApLFxuXG5cdFx0XHRcdGZ1bmN0aW9uICggcmVzdWx0ICkge1xuXHRcdFx0XHRcdHJldHVybiByZXN1bHQudG9TdHJpbmcoKTtcblx0XHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGVQYXJhbSgpIHtcblx0XHRcdFx0dmFyIGV4cHIsXG5cdFx0XHRcdFx0cmVzdWx0ID0gc2VxdWVuY2UoIFsgcGlwZSwgbk9yTW9yZSggMCwgcGFyYW1FeHByZXNzaW9uICkgXSApO1xuXG5cdFx0XHRcdGlmICggcmVzdWx0ID09PSBudWxsICkge1xuXHRcdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZXhwciA9IHJlc3VsdFsgMSBdO1xuXG5cdFx0XHRcdC8vIHVzZSBhIFwiQ09OQ0FUXCIgb3BlcmF0b3IgaWYgdGhlcmUgYXJlIG11bHRpcGxlIG5vZGVzLFxuXHRcdFx0XHQvLyBvdGhlcndpc2UgcmV0dXJuIHRoZSBmaXJzdCBub2RlLCByYXcuXG5cdFx0XHRcdHJldHVybiBleHByLmxlbmd0aCA+IDEgPyBbICdDT05DQVQnIF0uY29uY2F0KCBleHByICkgOiBleHByWyAwIF07XG5cdFx0XHR9XG5cblx0XHRcdGZ1bmN0aW9uIHRlbXBsYXRlV2l0aFJlcGxhY2VtZW50KCkge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0gc2VxdWVuY2UoIFsgdGVtcGxhdGVOYW1lLCBjb2xvbiwgcmVwbGFjZW1lbnQgXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogWyByZXN1bHRbIDAgXSwgcmVzdWx0WyAyIF0gXTtcblx0XHRcdH1cblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGVXaXRoT3V0UmVwbGFjZW1lbnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyB0ZW1wbGF0ZU5hbWUsIGNvbG9uLCBwYXJhbUV4cHJlc3Npb24gXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogWyByZXN1bHRbIDAgXSwgcmVzdWx0WyAyIF0gXTtcblx0XHRcdH1cblxuXHRcdFx0dGVtcGxhdGVDb250ZW50cyA9IGNob2ljZSggW1xuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlcyA9IHNlcXVlbmNlKCBbXG5cdFx0XHRcdFx0XHQvLyB0ZW1wbGF0ZXMgY2FuIGhhdmUgcGxhY2Vob2xkZXJzIGZvciBkeW5hbWljXG5cdFx0XHRcdFx0XHQvLyByZXBsYWNlbWVudCBlZzoge3tQTFVSQUw6JDF8b25lIGNhcnwkMSBjYXJzfX1cblx0XHRcdFx0XHRcdC8vIG9yIG5vIHBsYWNlaG9sZGVycyBlZzpcblx0XHRcdFx0XHRcdC8vIHt7R1JBTU1BUjpnZW5pdGl2ZXx7e1NJVEVOQU1FfX19XG5cdFx0XHRcdFx0XHRjaG9pY2UoIFsgdGVtcGxhdGVXaXRoUmVwbGFjZW1lbnQsIHRlbXBsYXRlV2l0aE91dFJlcGxhY2VtZW50IF0gKSxcblx0XHRcdFx0XHRcdG5Pck1vcmUoIDAsIHRlbXBsYXRlUGFyYW0gKVxuXHRcdFx0XHRcdF0gKTtcblxuXHRcdFx0XHRcdHJldHVybiByZXMgPT09IG51bGwgPyBudWxsIDogcmVzWyAwIF0uY29uY2F0KCByZXNbIDEgXSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0dmFyIHJlcyA9IHNlcXVlbmNlKCBbIHRlbXBsYXRlTmFtZSwgbk9yTW9yZSggMCwgdGVtcGxhdGVQYXJhbSApIF0gKTtcblxuXHRcdFx0XHRcdGlmICggcmVzID09PSBudWxsICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIFsgcmVzWyAwIF0gXS5jb25jYXQoIHJlc1sgMSBdICk7XG5cdFx0XHRcdH1cblx0XHRcdF0gKTtcblxuXHRcdFx0b3BlblRlbXBsYXRlID0gbWFrZVN0cmluZ1BhcnNlciggJ3t7JyApO1xuXHRcdFx0Y2xvc2VUZW1wbGF0ZSA9IG1ha2VTdHJpbmdQYXJzZXIoICd9fScgKTtcblxuXHRcdFx0ZnVuY3Rpb24gdGVtcGxhdGUoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBzZXF1ZW5jZSggWyBvcGVuVGVtcGxhdGUsIHRlbXBsYXRlQ29udGVudHMsIGNsb3NlVGVtcGxhdGUgXSApO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQgPT09IG51bGwgPyBudWxsIDogcmVzdWx0WyAxIF07XG5cdFx0XHR9XG5cblx0XHRcdGV4cHJlc3Npb24gPSBjaG9pY2UoIFsgdGVtcGxhdGUsIHJlcGxhY2VtZW50LCBsaXRlcmFsIF0gKTtcblx0XHRcdHBhcmFtRXhwcmVzc2lvbiA9IGNob2ljZSggWyB0ZW1wbGF0ZSwgcmVwbGFjZW1lbnQsIGxpdGVyYWxXaXRob3V0QmFyIF0gKTtcblxuXHRcdFx0ZnVuY3Rpb24gc3RhcnQoKSB7XG5cdFx0XHRcdHZhciByZXN1bHQgPSBuT3JNb3JlKCAwLCBleHByZXNzaW9uICkoKTtcblxuXHRcdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCApIHtcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBbICdDT05DQVQnIF0uY29uY2F0KCByZXN1bHQgKTtcblx0XHRcdH1cblxuXHRcdFx0cmVzdWx0ID0gc3RhcnQoKTtcblxuXHRcdFx0Lypcblx0XHRcdCAqIEZvciBzdWNjZXNzLCB0aGUgcG9zIG11c3QgaGF2ZSBnb3R0ZW4gdG8gdGhlIGVuZCBvZiB0aGUgaW5wdXRcblx0XHRcdCAqIGFuZCByZXR1cm5lZCBhIG5vbi1udWxsLlxuXHRcdFx0ICogbi5iLiBUaGlzIGlzIHBhcnQgb2YgbGFuZ3VhZ2UgaW5mcmFzdHJ1Y3R1cmUsIHNvIHdlIGRvIG5vdCB0aHJvdyBhblxuXHRcdFx0ICogaW50ZXJuYXRpb25hbGl6YWJsZSBtZXNzYWdlLlxuXHRcdFx0ICovXG5cdFx0XHRpZiAoIHJlc3VsdCA9PT0gbnVsbCB8fCBwb3MgIT09IG1lc3NhZ2UubGVuZ3RoICkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoICdQYXJzZSBlcnJvciBhdCBwb3NpdGlvbiAnICsgcG9zLnRvU3RyaW5nKCkgKyAnIGluIGlucHV0OiAnICsgbWVzc2FnZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHR9O1xuXG5cdCQuZXh0ZW5kKCAkLmkxOG4ucGFyc2VyLCBuZXcgTWVzc2FnZVBhcnNlcigpICk7XG59KCBqUXVlcnkgKSApOyIsIi8qIVxuICogalF1ZXJ5IEludGVybmF0aW9uYWxpemF0aW9uIGxpYnJhcnkgLSBNZXNzYWdlIFN0b3JlXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDEyIFNhbnRob3NoIFRob3R0aW5nYWxcbiAqXG4gKiBqcXVlcnkuaTE4biBpcyBkdWFsIGxpY2Vuc2VkIEdQTHYyIG9yIGxhdGVyIGFuZCBNSVQuIFlvdSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nIHNwZWNpYWwgdG9cbiAqIGNob29zZSBvbmUgbGljZW5zZSBvciB0aGUgb3RoZXIgYW5kIHlvdSBkb24ndCBoYXZlIHRvIG5vdGlmeSBhbnlvbmUgd2hpY2ggbGljZW5zZSB5b3UgYXJlIHVzaW5nLlxuICogWW91IGFyZSBmcmVlIHRvIHVzZSBVbml2ZXJzYWxMYW5ndWFnZVNlbGVjdG9yIGluIGNvbW1lcmNpYWwgcHJvamVjdHMgYXMgbG9uZyBhcyB0aGUgY29weXJpZ2h0XG4gKiBoZWFkZXIgaXMgbGVmdCBpbnRhY3QuIFNlZSBmaWxlcyBHUEwtTElDRU5TRSBhbmQgTUlULUxJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKlxuICogQGxpY2VuY2UgR05VIEdlbmVyYWwgUHVibGljIExpY2VuY2UgMi4wIG9yIGxhdGVyXG4gKiBAbGljZW5jZSBNSVQgTGljZW5zZVxuICovXG5cbiggZnVuY3Rpb24gKCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIE1lc3NhZ2VTdG9yZSA9IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLm1lc3NhZ2VzID0ge307XG5cdFx0dGhpcy5zb3VyY2VzID0ge307XG5cdH07XG5cblx0ZnVuY3Rpb24ganNvbk1lc3NhZ2VMb2FkZXIoIHVybCApIHtcblx0XHR2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cblx0XHQkLmdldEpTT04oIHVybCApXG5cdFx0XHQuZG9uZSggZGVmZXJyZWQucmVzb2x2ZSApXG5cdFx0XHQuZmFpbCggZnVuY3Rpb24gKCBqcXhociwgc2V0dGluZ3MsIGV4Y2VwdGlvbiApIHtcblx0XHRcdFx0JC5pMThuLmxvZyggJ0Vycm9yIGluIGxvYWRpbmcgbWVzc2FnZXMgZnJvbSAnICsgdXJsICsgJyBFeGNlcHRpb246ICcgKyBleGNlcHRpb24gKTtcblx0XHRcdFx0Ly8gSWdub3JlIDQwNCBleGNlcHRpb24sIGJlY2F1c2Ugd2UgYXJlIGhhbmRsaW5nIGZhbGxhYmFja3MgZXhwbGljaXRseVxuXHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRyZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlZSBodHRwczovL2dpdGh1Yi5jb20vd2lraW1lZGlhL2pxdWVyeS5pMThuL3dpa2kvU3BlY2lmaWNhdGlvbiN3aWtpLU1lc3NhZ2VfRmlsZV9Mb2FkaW5nXG5cdCAqL1xuXHRNZXNzYWdlU3RvcmUucHJvdG90eXBlID0ge1xuXG5cdFx0LyoqXG5cdFx0ICogR2VuZXJhbCBtZXNzYWdlIGxvYWRpbmcgQVBJIFRoaXMgY2FuIHRha2UgYSBVUkwgc3RyaW5nIGZvclxuXHRcdCAqIHRoZSBqc29uIGZvcm1hdHRlZCBtZXNzYWdlcy5cblx0XHQgKiA8Y29kZT5sb2FkKCdwYXRoL3RvL2FsbF9sb2NhbGl6YXRpb25zLmpzb24nKTs8L2NvZGU+XG5cdFx0ICpcblx0XHQgKiBUaGlzIGNhbiBhbHNvIGxvYWQgYSBsb2NhbGl6YXRpb24gZmlsZSBmb3IgYSBsb2NhbGUgPGNvZGU+XG5cdFx0ICogbG9hZCggJ3BhdGgvdG8vZGUtbWVzc2FnZXMuanNvbicsICdkZScgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICogQSBkYXRhIG9iamVjdCBjb250YWluaW5nIG1lc3NhZ2Uga2V5LSBtZXNzYWdlIHRyYW5zbGF0aW9uIG1hcHBpbmdzXG5cdFx0ICogY2FuIGFsc28gYmUgcGFzc2VkIEVnOlxuXHRcdCAqIDxjb2RlPlxuXHRcdCAqIGxvYWQoIHsgJ2hlbGxvJyA6ICdIZWxsbycgfSwgb3B0aW9uYWxMb2NhbGUgKTtcblx0XHQgKiA8L2NvZGU+IElmIHRoZSBkYXRhIGFyZ3VtZW50IGlzXG5cdFx0ICogbnVsbC91bmRlZmluZWQvZmFsc2UsXG5cdFx0ICogYWxsIGNhY2hlZCBtZXNzYWdlcyBmb3IgdGhlIGkxOG4gaW5zdGFuY2Ugd2lsbCBnZXQgcmVzZXQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHNvdXJjZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgTGFuZ3VhZ2UgdGFnXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5LlByb21pc2V9XG5cdFx0ICovXG5cdFx0bG9hZDogZnVuY3Rpb24gKCBzb3VyY2UsIGxvY2FsZSApIHtcblx0XHRcdHZhciBrZXkgPSBudWxsLFxuXHRcdFx0XHRkZWZlcnJlZCA9IG51bGwsXG5cdFx0XHRcdGRlZmVycmVkcyA9IFtdLFxuXHRcdFx0XHRtZXNzYWdlU3RvcmUgPSB0aGlzO1xuXG5cdFx0XHRpZiAoIHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0XHQvLyBUaGlzIGlzIGEgVVJMIHRvIHRoZSBtZXNzYWdlcyBmaWxlLlxuXHRcdFx0XHQkLmkxOG4ubG9nKCAnTG9hZGluZyBtZXNzYWdlcyBmcm9tOiAnICsgc291cmNlICk7XG5cdFx0XHRcdGRlZmVycmVkID0ganNvbk1lc3NhZ2VMb2FkZXIoIHNvdXJjZSApXG5cdFx0XHRcdFx0LmRvbmUoIGZ1bmN0aW9uICggbG9jYWxpemF0aW9uICkge1xuXHRcdFx0XHRcdFx0bWVzc2FnZVN0b3JlLnNldCggbG9jYWxlLCBsb2NhbGl6YXRpb24gKTtcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0cmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCBsb2NhbGUgKSB7XG5cdFx0XHRcdC8vIHNvdXJjZSBpcyBhbiBrZXktdmFsdWUgcGFpciBvZiBtZXNzYWdlcyBmb3IgZ2l2ZW4gbG9jYWxlXG5cdFx0XHRcdG1lc3NhZ2VTdG9yZS5zZXQoIGxvY2FsZSwgc291cmNlICk7XG5cblx0XHRcdFx0cmV0dXJuICQuRGVmZXJyZWQoKS5yZXNvbHZlKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBzb3VyY2UgaXMgYSBrZXktdmFsdWUgcGFpciBvZiBsb2NhbGVzIGFuZCB0aGVpciBzb3VyY2Vcblx0XHRcdFx0Zm9yICgga2V5IGluIHNvdXJjZSApIHtcblx0XHRcdFx0XHRpZiAoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCggc291cmNlLCBrZXkgKSApIHtcblx0XHRcdFx0XHRcdGxvY2FsZSA9IGtleTtcblx0XHRcdFx0XHRcdC8vIE5vIHtsb2NhbGV9IGdpdmVuLCBhc3N1bWUgZGF0YSBpcyBhIGdyb3VwIG9mIGxhbmd1YWdlcyxcblx0XHRcdFx0XHRcdC8vIGNhbGwgdGhpcyBmdW5jdGlvbiBhZ2FpbiBmb3IgZWFjaCBsYW5ndWFnZS5cblx0XHRcdFx0XHRcdGRlZmVycmVkcy5wdXNoKCBtZXNzYWdlU3RvcmUubG9hZCggc291cmNlWyBrZXkgXSwgbG9jYWxlICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuICQud2hlbi5hcHBseSggJCwgZGVmZXJyZWRzICk7XG5cdFx0XHR9XG5cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IG1lc3NhZ2VzIHRvIHRoZSBnaXZlbiBsb2NhbGUuXG5cdFx0ICogSWYgbG9jYWxlIGV4aXN0cywgYWRkIG1lc3NhZ2VzIHRvIHRoZSBsb2NhbGUuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlXG5cdFx0ICogQHBhcmFtIHtPYmplY3R9IG1lc3NhZ2VzXG5cdFx0ICovXG5cdFx0c2V0OiBmdW5jdGlvbiAoIGxvY2FsZSwgbWVzc2FnZXMgKSB7XG5cdFx0XHRpZiAoICF0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSApIHtcblx0XHRcdFx0dGhpcy5tZXNzYWdlc1sgbG9jYWxlIF0gPSBtZXNzYWdlcztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdID0gJC5leHRlbmQoIHRoaXMubWVzc2FnZXNbIGxvY2FsZSBdLCBtZXNzYWdlcyApO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGVcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZUtleVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Z2V0OiBmdW5jdGlvbiAoIGxvY2FsZSwgbWVzc2FnZUtleSApIHtcblx0XHRcdHJldHVybiB0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXSAmJiB0aGlzLm1lc3NhZ2VzWyBsb2NhbGUgXVsgbWVzc2FnZUtleSBdO1xuXHRcdH1cblx0fTtcblxuXHQkLmV4dGVuZCggJC5pMThuLm1lc3NhZ2VTdG9yZSwgbmV3IE1lc3NhZ2VTdG9yZSgpICk7XG59KCBqUXVlcnkgKSApO1xuIiwiLyohXG4gKiBqUXVlcnkgSW50ZXJuYXRpb25hbGl6YXRpb24gbGlicmFyeVxuICpcbiAqIENvcHlyaWdodCAoQykgMjAxMiBTYW50aG9zaCBUaG90dGluZ2FsXG4gKlxuICoganF1ZXJ5LmkxOG4gaXMgZHVhbCBsaWNlbnNlZCBHUEx2MiBvciBsYXRlciBhbmQgTUlULiBZb3UgZG9uJ3QgaGF2ZSB0byBkb1xuICogYW55dGhpbmcgc3BlY2lhbCB0byBjaG9vc2Ugb25lIGxpY2Vuc2Ugb3IgdGhlIG90aGVyIGFuZCB5b3UgZG9uJ3QgaGF2ZSB0b1xuICogbm90aWZ5IGFueW9uZSB3aGljaCBsaWNlbnNlIHlvdSBhcmUgdXNpbmcuIFlvdSBhcmUgZnJlZSB0byB1c2VcbiAqIFVuaXZlcnNhbExhbmd1YWdlU2VsZWN0b3IgaW4gY29tbWVyY2lhbCBwcm9qZWN0cyBhcyBsb25nIGFzIHRoZSBjb3B5cmlnaHRcbiAqIGhlYWRlciBpcyBsZWZ0IGludGFjdC4gU2VlIGZpbGVzIEdQTC1MSUNFTlNFIGFuZCBNSVQtTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqXG4gKiBAbGljZW5jZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5jZSAyLjAgb3IgbGF0ZXJcbiAqIEBsaWNlbmNlIE1JVCBMaWNlbnNlXG4gKi9cblxuKCBmdW5jdGlvbiAoICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgSTE4Tixcblx0XHRzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblx0LyoqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuXHQgKi9cblx0STE4TiA9IGZ1bmN0aW9uICggb3B0aW9ucyApIHtcblx0XHQvLyBMb2FkIGRlZmF1bHRzXG5cdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHt9LCBJMThOLmRlZmF1bHRzLCBvcHRpb25zICk7XG5cblx0XHR0aGlzLnBhcnNlciA9IHRoaXMub3B0aW9ucy5wYXJzZXI7XG5cdFx0dGhpcy5sb2NhbGUgPSB0aGlzLm9wdGlvbnMubG9jYWxlO1xuXHRcdHRoaXMubWVzc2FnZVN0b3JlID0gdGhpcy5vcHRpb25zLm1lc3NhZ2VTdG9yZTtcblx0XHR0aGlzLmxhbmd1YWdlcyA9IHt9O1xuXHR9O1xuXG5cdEkxOE4ucHJvdG90eXBlID0ge1xuXHRcdC8qKlxuXHRcdCAqIExvY2FsaXplIGEgZ2l2ZW4gbWVzc2FnZUtleSB0byBhIGxvY2FsZS5cblx0XHQgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZUtleVxuXHRcdCAqIEByZXR1cm4ge1N0cmluZ30gTG9jYWxpemVkIG1lc3NhZ2Vcblx0XHQgKi9cblx0XHRsb2NhbGl6ZTogZnVuY3Rpb24gKCBtZXNzYWdlS2V5ICkge1xuXHRcdFx0dmFyIGxvY2FsZVBhcnRzLCBsb2NhbGVQYXJ0SW5kZXgsIGxvY2FsZSwgZmFsbGJhY2tJbmRleCxcblx0XHRcdFx0dHJ5aW5nTG9jYWxlLCBtZXNzYWdlO1xuXG5cdFx0XHRsb2NhbGUgPSB0aGlzLmxvY2FsZTtcblx0XHRcdGZhbGxiYWNrSW5kZXggPSAwO1xuXG5cdFx0XHR3aGlsZSAoIGxvY2FsZSApIHtcblx0XHRcdFx0Ly8gSXRlcmF0ZSB0aHJvdWdoIGxvY2FsZXMgc3RhcnRpbmcgYXQgbW9zdC1zcGVjaWZpYyB1bnRpbFxuXHRcdFx0XHQvLyBsb2NhbGl6YXRpb24gaXMgZm91bmQuIEFzIGluIGZpLUxhdG4tRkksIGZpLUxhdG4gYW5kIGZpLlxuXHRcdFx0XHRsb2NhbGVQYXJ0cyA9IGxvY2FsZS5zcGxpdCggJy0nICk7XG5cdFx0XHRcdGxvY2FsZVBhcnRJbmRleCA9IGxvY2FsZVBhcnRzLmxlbmd0aDtcblxuXHRcdFx0XHRkbyB7XG5cdFx0XHRcdFx0dHJ5aW5nTG9jYWxlID0gbG9jYWxlUGFydHMuc2xpY2UoIDAsIGxvY2FsZVBhcnRJbmRleCApLmpvaW4oICctJyApO1xuXHRcdFx0XHRcdG1lc3NhZ2UgPSB0aGlzLm1lc3NhZ2VTdG9yZS5nZXQoIHRyeWluZ0xvY2FsZSwgbWVzc2FnZUtleSApO1xuXG5cdFx0XHRcdFx0aWYgKCBtZXNzYWdlICkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0bG9jYWxlUGFydEluZGV4LS07XG5cdFx0XHRcdH0gd2hpbGUgKCBsb2NhbGVQYXJ0SW5kZXggKTtcblxuXHRcdFx0XHRpZiAoIGxvY2FsZSA9PT0gJ2VuJyApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxvY2FsZSA9ICggJC5pMThuLmZhbGxiYWNrc1sgdGhpcy5sb2NhbGUgXSAmJlxuXHRcdFx0XHRcdFx0JC5pMThuLmZhbGxiYWNrc1sgdGhpcy5sb2NhbGUgXVsgZmFsbGJhY2tJbmRleCBdICkgfHxcblx0XHRcdFx0XHRcdHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZTtcblx0XHRcdFx0JC5pMThuLmxvZyggJ1RyeWluZyBmYWxsYmFjayBsb2NhbGUgZm9yICcgKyB0aGlzLmxvY2FsZSArICc6ICcgKyBsb2NhbGUgKyAnICgnICsgbWVzc2FnZUtleSArICcpJyApO1xuXG5cdFx0XHRcdGZhbGxiYWNrSW5kZXgrKztcblx0XHRcdH1cblxuXHRcdFx0Ly8ga2V5IG5vdCBmb3VuZFxuXHRcdFx0cmV0dXJuICcnO1xuXHRcdH0sXG5cblx0XHQvKlxuXHRcdCAqIERlc3Ryb3kgdGhlIGkxOG4gaW5zdGFuY2UuXG5cdFx0ICovXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdFx0JC5yZW1vdmVEYXRhKCBkb2N1bWVudCwgJ2kxOG4nICk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqIEdlbmVyYWwgbWVzc2FnZSBsb2FkaW5nIEFQSSBUaGlzIGNhbiB0YWtlIGEgVVJMIHN0cmluZyBmb3Jcblx0XHQgKiB0aGUganNvbiBmb3JtYXR0ZWQgbWVzc2FnZXMuIEV4YW1wbGU6XG5cdFx0ICogPGNvZGU+bG9hZCgncGF0aC90by9hbGxfbG9jYWxpemF0aW9ucy5qc29uJyk7PC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogVG8gbG9hZCBhIGxvY2FsaXphdGlvbiBmaWxlIGZvciBhIGxvY2FsZTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCdwYXRoL3RvL2RlLW1lc3NhZ2VzLmpzb24nLCAnZGUnICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogVG8gbG9hZCBhIGxvY2FsaXphdGlvbiBmaWxlIGZyb20gYSBkaXJlY3Rvcnk6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCgncGF0aC90by9pMThuL2RpcmVjdG9yeScsICdkZScgKTtcblx0XHQgKiA8L2NvZGU+XG5cdFx0ICogVGhlIGFib3ZlIG1ldGhvZCBoYXMgdGhlIGFkdmFudGFnZSBvZiBmYWxsYmFjayByZXNvbHV0aW9uLlxuXHRcdCAqIGllLCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgbG9hZCB0aGUgZmFsbGJhY2sgbG9jYWxlcyBmb3IgZGUuXG5cdFx0ICogRm9yIG1vc3QgdXNlY2FzZXMsIHRoaXMgaXMgdGhlIHJlY29tbWVuZGVkIG1ldGhvZC5cblx0XHQgKiBJdCBpcyBvcHRpb25hbCB0byBoYXZlIHRyYWlsaW5nIHNsYXNoIGF0IGVuZC5cblx0XHQgKlxuXHRcdCAqIEEgZGF0YSBvYmplY3QgY29udGFpbmluZyBtZXNzYWdlIGtleS0gbWVzc2FnZSB0cmFuc2xhdGlvbiBtYXBwaW5nc1xuXHRcdCAqIGNhbiBhbHNvIGJlIHBhc3NlZC4gRXhhbXBsZTpcblx0XHQgKiA8Y29kZT5cblx0XHQgKiBsb2FkKCB7ICdoZWxsbycgOiAnSGVsbG8nIH0sIG9wdGlvbmFsTG9jYWxlICk7XG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogQSBzb3VyY2UgbWFwIGNvbnRhaW5pbmcga2V5LXZhbHVlIHBhaXIgb2YgbGFuZ3VhZ2VuYW1lIGFuZCBsb2NhdGlvbnNcblx0XHQgKiBjYW4gYWxzbyBiZSBwYXNzZWQuIEV4YW1wbGU6XG5cdFx0ICogPGNvZGU+XG5cdFx0ICogbG9hZCgge1xuXHRcdCAqIGJuOiAnaTE4bi9ibi5qc29uJyxcblx0XHQgKiBoZTogJ2kxOG4vaGUuanNvbicsXG5cdFx0ICogZW46ICdpMThuL2VuLmpzb24nXG5cdFx0ICogfSApXG5cdFx0ICogPC9jb2RlPlxuXHRcdCAqXG5cdFx0ICogSWYgdGhlIGRhdGEgYXJndW1lbnQgaXMgbnVsbC91bmRlZmluZWQvZmFsc2UsXG5cdFx0ICogYWxsIGNhY2hlZCBtZXNzYWdlcyBmb3IgdGhlIGkxOG4gaW5zdGFuY2Ugd2lsbCBnZXQgcmVzZXQuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ3xPYmplY3R9IHNvdXJjZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgTGFuZ3VhZ2UgdGFnXG5cdFx0ICogQHJldHVybiB7alF1ZXJ5LlByb21pc2V9XG5cdFx0ICovXG5cdFx0bG9hZDogZnVuY3Rpb24gKCBzb3VyY2UsIGxvY2FsZSApIHtcblx0XHRcdHZhciBmYWxsYmFja0xvY2FsZXMsIGxvY0luZGV4LCBmYWxsYmFja0xvY2FsZSwgc291cmNlTWFwID0ge307XG5cdFx0XHRpZiAoICFzb3VyY2UgJiYgIWxvY2FsZSApIHtcblx0XHRcdFx0c291cmNlID0gJ2kxOG4vJyArICQuaTE4bigpLmxvY2FsZSArICcuanNvbic7XG5cdFx0XHRcdGxvY2FsZSA9ICQuaTE4bigpLmxvY2FsZTtcblx0XHRcdH1cblx0XHRcdGlmICggdHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycgJiZcblx0XHRcdFx0Ly8gc291cmNlIGV4dGVuc2lvbiBzaG91bGQgYmUganNvbiwgYnV0IGNhbiBoYXZlIHF1ZXJ5IHBhcmFtcyBhZnRlciB0aGF0LlxuXHRcdFx0XHRzb3VyY2Uuc3BsaXQoICc/JyApWyAwIF0uc3BsaXQoICcuJyApLnBvcCgpICE9PSAnanNvbidcblx0XHRcdCkge1xuXHRcdFx0XHQvLyBMb2FkIHNwZWNpZmllZCBsb2NhbGUgdGhlbiBjaGVjayBmb3IgZmFsbGJhY2tzIHdoZW4gZGlyZWN0b3J5IGlzXG5cdFx0XHRcdC8vIHNwZWNpZmllZCBpbiBsb2FkKClcblx0XHRcdFx0c291cmNlTWFwWyBsb2NhbGUgXSA9IHNvdXJjZSArICcvJyArIGxvY2FsZSArICcuanNvbic7XG5cdFx0XHRcdGZhbGxiYWNrTG9jYWxlcyA9ICggJC5pMThuLmZhbGxiYWNrc1sgbG9jYWxlIF0gfHwgW10gKVxuXHRcdFx0XHRcdC5jb25jYXQoIHRoaXMub3B0aW9ucy5mYWxsYmFja0xvY2FsZSApO1xuXHRcdFx0XHRmb3IgKCBsb2NJbmRleCA9IDA7IGxvY0luZGV4IDwgZmFsbGJhY2tMb2NhbGVzLmxlbmd0aDsgbG9jSW5kZXgrKyApIHtcblx0XHRcdFx0XHRmYWxsYmFja0xvY2FsZSA9IGZhbGxiYWNrTG9jYWxlc1sgbG9jSW5kZXggXTtcblx0XHRcdFx0XHRzb3VyY2VNYXBbIGZhbGxiYWNrTG9jYWxlIF0gPSBzb3VyY2UgKyAnLycgKyBmYWxsYmFja0xvY2FsZSArICcuanNvbic7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRoaXMubG9hZCggc291cmNlTWFwICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5tZXNzYWdlU3RvcmUubG9hZCggc291cmNlLCBsb2NhbGUgKTtcblx0XHRcdH1cblxuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiBEb2VzIHBhcmFtZXRlciBhbmQgbWFnaWMgd29yZCBzdWJzdGl0dXRpb24uXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30ga2V5IE1lc3NhZ2Uga2V5XG5cdFx0ICogQHBhcmFtIHtBcnJheX0gcGFyYW1ldGVycyBNZXNzYWdlIHBhcmFtZXRlcnNcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICgga2V5LCBwYXJhbWV0ZXJzICkge1xuXHRcdFx0dmFyIG1lc3NhZ2UgPSB0aGlzLmxvY2FsaXplKCBrZXkgKTtcblx0XHRcdC8vIEZJWE1FOiBUaGlzIGNoYW5nZXMgdGhlIHN0YXRlIG9mIHRoZSBJMThOIG9iamVjdCxcblx0XHRcdC8vIHNob3VsZCBwcm9iYWJseSBub3QgY2hhbmdlIHRoZSAndGhpcy5wYXJzZXInIGJ1dCBqdXN0XG5cdFx0XHQvLyBwYXNzIGl0IHRvIHRoZSBwYXJzZXIuXG5cdFx0XHR0aGlzLnBhcnNlci5sYW5ndWFnZSA9ICQuaTE4bi5sYW5ndWFnZXNbICQuaTE4bigpLmxvY2FsZSBdIHx8ICQuaTE4bi5sYW5ndWFnZXNbICdkZWZhdWx0JyBdO1xuXHRcdFx0aWYgKCBtZXNzYWdlID09PSAnJyApIHtcblx0XHRcdFx0bWVzc2FnZSA9IGtleTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzLnBhcnNlci5wYXJzZSggbWVzc2FnZSwgcGFyYW1ldGVycyApO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogUHJvY2VzcyBhIG1lc3NhZ2UgZnJvbSB0aGUgJC5JMThOIGluc3RhbmNlXG5cdCAqIGZvciB0aGUgY3VycmVudCBkb2N1bWVudCwgc3RvcmVkIGluIGpRdWVyeS5kYXRhKGRvY3VtZW50KS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGtleSBLZXkgb2YgdGhlIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXJhbTEgW3BhcmFtLi4uXSBWYXJpYWRpYyBsaXN0IG9mIHBhcmFtZXRlcnMgZm9yIHtrZXl9LlxuXHQgKiBAcmV0dXJuIHtzdHJpbmd8JC5JMThOfSBQYXJzZWQgbWVzc2FnZSwgb3IgaWYgbm8ga2V5IHdhcyBnaXZlblxuXHQgKiB0aGUgaW5zdGFuY2Ugb2YgJC5JMThOIGlzIHJldHVybmVkLlxuXHQgKi9cblx0JC5pMThuID0gZnVuY3Rpb24gKCBrZXksIHBhcmFtMSApIHtcblx0XHR2YXIgcGFyYW1ldGVycyxcblx0XHRcdGkxOG4gPSAkLmRhdGEoIGRvY3VtZW50LCAnaTE4bicgKSxcblx0XHRcdG9wdGlvbnMgPSB0eXBlb2Yga2V5ID09PSAnb2JqZWN0JyAmJiBrZXk7XG5cblx0XHQvLyBJZiB0aGUgbG9jYWxlIG9wdGlvbiBmb3IgdGhpcyBjYWxsIGlzIGRpZmZlcmVudCB0aGVuIHRoZSBzZXR1cCBzbyBmYXIsXG5cdFx0Ly8gdXBkYXRlIGl0IGF1dG9tYXRpY2FsbHkuIFRoaXMgZG9lc24ndCBqdXN0IGNoYW5nZSB0aGUgY29udGV4dCBmb3IgdGhpc1xuXHRcdC8vIGNhbGwgYnV0IGZvciBhbGwgZnV0dXJlIGNhbGwgYXMgd2VsbC5cblx0XHQvLyBJZiB0aGVyZSBpcyBubyBpMThuIHNldHVwIHlldCwgZG9uJ3QgZG8gdGhpcy4gSXQgd2lsbCBiZSB0YWtlbiBjYXJlIG9mXG5cdFx0Ly8gYnkgdGhlIGBuZXcgSTE4TmAgY29uc3RydWN0aW9uIGJlbG93LlxuXHRcdC8vIE5PVEU6IEl0IHNob3VsZCBvbmx5IGNoYW5nZSBsYW5ndWFnZSBmb3IgdGhpcyBvbmUgY2FsbC5cblx0XHQvLyBUaGVuIGNhY2hlIGluc3RhbmNlcyBvZiBJMThOIHNvbWV3aGVyZS5cblx0XHRpZiAoIG9wdGlvbnMgJiYgb3B0aW9ucy5sb2NhbGUgJiYgaTE4biAmJiBpMThuLmxvY2FsZSAhPT0gb3B0aW9ucy5sb2NhbGUgKSB7XG5cdFx0XHRpMThuLmxvY2FsZSA9IG9wdGlvbnMubG9jYWxlO1xuXHRcdH1cblxuXHRcdGlmICggIWkxOG4gKSB7XG5cdFx0XHRpMThuID0gbmV3IEkxOE4oIG9wdGlvbnMgKTtcblx0XHRcdCQuZGF0YSggZG9jdW1lbnQsICdpMThuJywgaTE4biApO1xuXHRcdH1cblxuXHRcdGlmICggdHlwZW9mIGtleSA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRpZiAoIHBhcmFtMSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0XHRwYXJhbWV0ZXJzID0gc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwYXJhbWV0ZXJzID0gW107XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBpMThuLnBhcnNlKCBrZXksIHBhcmFtZXRlcnMgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gRklYTUU6IHJlbW92ZSB0aGlzIGZlYXR1cmUvYnVnLlxuXHRcdFx0cmV0dXJuIGkxOG47XG5cdFx0fVxuXHR9O1xuXG5cdCQuZm4uaTE4biA9IGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgaTE4biA9ICQuZGF0YSggZG9jdW1lbnQsICdpMThuJyApO1xuXG5cdFx0aWYgKCAhaTE4biApIHtcblx0XHRcdGkxOG4gPSBuZXcgSTE4TigpO1xuXHRcdFx0JC5kYXRhKCBkb2N1bWVudCwgJ2kxOG4nLCBpMThuICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuZWFjaCggZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxuXHRcdFx0XHRtZXNzYWdlS2V5ID0gJHRoaXMuZGF0YSggJ2kxOG4nICksXG5cdFx0XHRcdGxCcmFja2V0LCByQnJhY2tldCwgdHlwZSwga2V5O1xuXG5cdFx0XHRpZiAoIG1lc3NhZ2VLZXkgKSB7XG5cdFx0XHRcdGxCcmFja2V0ID0gbWVzc2FnZUtleS5pbmRleE9mKCAnWycgKTtcblx0XHRcdFx0ckJyYWNrZXQgPSBtZXNzYWdlS2V5LmluZGV4T2YoICddJyApO1xuXHRcdFx0XHRpZiAoIGxCcmFja2V0ICE9PSAtMSAmJiByQnJhY2tldCAhPT0gLTEgJiYgbEJyYWNrZXQgPCByQnJhY2tldCApIHtcblx0XHRcdFx0XHR0eXBlID0gbWVzc2FnZUtleS5zbGljZSggbEJyYWNrZXQgKyAxLCByQnJhY2tldCApO1xuXHRcdFx0XHRcdGtleSA9IG1lc3NhZ2VLZXkuc2xpY2UoIHJCcmFja2V0ICsgMSApO1xuXHRcdFx0XHRcdGlmICggdHlwZSA9PT0gJ2h0bWwnICkge1xuXHRcdFx0XHRcdFx0JHRoaXMuaHRtbCggaTE4bi5wYXJzZSgga2V5ICkgKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0JHRoaXMuYXR0ciggdHlwZSwgaTE4bi5wYXJzZSgga2V5ICkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0JHRoaXMudGV4dCggaTE4bi5wYXJzZSggbWVzc2FnZUtleSApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCR0aGlzLmZpbmQoICdbZGF0YS1pMThuXScgKS5pMThuKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXHR9O1xuXG5cdGZ1bmN0aW9uIGdldERlZmF1bHRMb2NhbGUoKSB7XG5cdFx0dmFyIG5hdiwgbG9jYWxlID0gJCggJ2h0bWwnICkuYXR0ciggJ2xhbmcnICk7XG5cblx0XHRpZiAoICFsb2NhbGUgKSB7XG5cdFx0XHRpZiAoIHR5cGVvZiB3aW5kb3cubmF2aWdhdG9yICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRcdG5hdiA9IHdpbmRvdy5uYXZpZ2F0b3I7XG5cdFx0XHRcdGxvY2FsZSA9IG5hdi5sYW5ndWFnZSB8fCBuYXYudXNlckxhbmd1YWdlIHx8ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9jYWxlID0gJyc7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBsb2NhbGU7XG5cdH1cblxuXHQkLmkxOG4ubGFuZ3VhZ2VzID0ge307XG5cdCQuaTE4bi5tZXNzYWdlU3RvcmUgPSAkLmkxOG4ubWVzc2FnZVN0b3JlIHx8IHt9O1xuXHQkLmkxOG4ucGFyc2VyID0ge1xuXHRcdC8vIFRoZSBkZWZhdWx0IHBhcnNlciBvbmx5IGhhbmRsZXMgdmFyaWFibGUgc3Vic3RpdHV0aW9uXG5cdFx0cGFyc2U6IGZ1bmN0aW9uICggbWVzc2FnZSwgcGFyYW1ldGVycyApIHtcblx0XHRcdHJldHVybiBtZXNzYWdlLnJlcGxhY2UoIC9cXCQoXFxkKykvZywgZnVuY3Rpb24gKCBzdHIsIG1hdGNoICkge1xuXHRcdFx0XHR2YXIgaW5kZXggPSBwYXJzZUludCggbWF0Y2gsIDEwICkgLSAxO1xuXHRcdFx0XHRyZXR1cm4gcGFyYW1ldGVyc1sgaW5kZXggXSAhPT0gdW5kZWZpbmVkID8gcGFyYW1ldGVyc1sgaW5kZXggXSA6ICckJyArIG1hdGNoO1xuXHRcdFx0fSApO1xuXHRcdH0sXG5cdFx0ZW1pdHRlcjoge31cblx0fTtcblx0JC5pMThuLmZhbGxiYWNrcyA9IHt9O1xuXHQkLmkxOG4uZGVidWcgPSBmYWxzZTtcblx0JC5pMThuLmxvZyA9IGZ1bmN0aW9uICggLyogYXJndW1lbnRzICovICkge1xuXHRcdGlmICggd2luZG93LmNvbnNvbGUgJiYgJC5pMThuLmRlYnVnICkge1xuXHRcdFx0d2luZG93LmNvbnNvbGUubG9nLmFwcGx5KCB3aW5kb3cuY29uc29sZSwgYXJndW1lbnRzICk7XG5cdFx0fVxuXHR9O1xuXHQvKiBTdGF0aWMgbWVtYmVycyAqL1xuXHRJMThOLmRlZmF1bHRzID0ge1xuXHRcdGxvY2FsZTogZ2V0RGVmYXVsdExvY2FsZSgpLFxuXHRcdGZhbGxiYWNrTG9jYWxlOiAnZW4nLFxuXHRcdHBhcnNlcjogJC5pMThuLnBhcnNlcixcblx0XHRtZXNzYWdlU3RvcmU6ICQuaTE4bi5tZXNzYWdlU3RvcmVcblx0fTtcblxuXHQvLyBFeHBvc2UgY29uc3RydWN0b3Jcblx0JC5pMThuLmNvbnN0cnVjdG9yID0gSTE4Tjtcbn0oIGpRdWVyeSApICk7IiwiLypnbG9iYWwgdmFyaWFibGUgZGVjbGFyYXRpb25zKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4uL2Nzcy91c2VyLWhpZ2hsaWdodHMuY3NzXCI7XG5cbmZ1bmN0aW9uIGdldENvbXBsZXRpb25zKCkge1xuICAgIC8vIEdldCB0aGUgY29tcGxldGlvbiBzdGF0dXNcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKFxuICAgICAgICAgICAgLyhcXC9pbmRleC5odG1sfHRvY3RyZWUuaHRtbHxnZW5pbmRleC5odG1sfG5hdmhlbHAuaHRtbHx0b2MuaHRtbHxhc3NpZ25tZW50cy5odG1sfEV4ZXJjaXNlcy5odG1sKS9cbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRQYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAoY3VycmVudFBhdGhuYW1lLmluZGV4T2YoXCI/XCIpICE9PSAtMSkge1xuICAgICAgICBjdXJyZW50UGF0aG5hbWUgPSBjdXJyZW50UGF0aG5hbWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGN1cnJlbnRQYXRobmFtZS5sYXN0SW5kZXhPZihcIj9cIilcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxhc3RQYWdlVXJsOiBjdXJyZW50UGF0aG5hbWUsXG4gICAgICAgIGlzUHR4Qm9vazogaXNQcmVUZVh0KCksXG4gICAgfTtcbiAgICBqUXVlcnlcbiAgICAgICAgLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldENvbXBsZXRpb25TdGF0dXNgLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25EYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25DbGFzcywgY29tcGxldGlvbk1zZztcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGlvbkRhdGFbMF0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyA9IFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbk1zZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyA9IFwiYnV0dG9uQXNrQ29tcGxldGlvblwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgc2NwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY3Byb2dyZXNzY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChzY3ApIHtcbiAgICAgICAgICAgICAgICAgICAgc2NwLmNsYXNzTGlzdC5hZGQoXCJwdHgtcnVuZXN0b25lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcIiNzY3Byb2dyZXNzY29udGFpbmVyXCIpLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlclwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxnICcgK1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvYnV0dG9uPjwvZGl2PlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dMYXN0UG9zaXRpb25CYW5uZXIoKSB7XG4gICAgdmFyIGxhc3RQb3NpdGlvblZhbCA9ICQuZ2V0VXJsVmFyKFwibGFzdFBvc2l0aW9uXCIpO1xuICAgIGlmICh0eXBlb2YgbGFzdFBvc2l0aW9uVmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChcbiAgICAgICAgICAgICc8aW1nIHNyYz1cIi4uL19zdGF0aWMvbGFzdC1wb2ludC5wbmdcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyBwYWRkaW5nLXRvcDo1NXB4OyBsZWZ0OiAxMHB4OyB0b3A6ICcgK1xuICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAncHg7XCIvPidcbiAgICAgICAgKTtcbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSB9LCAxMDAwKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpIHtcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKFxuICAgICAgICAgICAgLyhpbmRleC5odG1sfGdlbmluZGV4Lmh0bWx8bmF2aGVscC5odG1sfHRvYy5odG1sfGFzc2lnbm1lbnRzLmh0bWx8RXhlcmNpc2VzLmh0bWx8dG9jdHJlZS5odG1sKS9cbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uID0gLSQoXCIjbmF2TGlua0JnUmlnaHRcIikub3V0ZXJXaWR0aCgpIC0gNTtcbiAgICB2YXIgbmF2TGlua0JnUmlnaHRIYWxmT3BlbjtcbiAgICB2YXIgbmF2TGlua0JnUmlnaHRGdWxsT3BlbiA9IDA7XG5cbiAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiArIDcwO1xuICAgIH0gZWxzZSBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgfVxuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbkluaXRpYWxQb3NpdGlvbiA9ICQoXCIjcmVsYXRpb25zLW5leHRcIikuY3NzKFwicmlnaHRcIik7XG4gICAgdmFyIHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24gPSAtKG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyAzNSk7XG5cbiAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmNzcyhcInJpZ2h0XCIsIG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24pLnNob3coKTtcbiAgICB2YXIgbmF2QmdTaG93biA9IGZhbHNlO1xuICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPT1cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmhlaWdodCgpXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gfSxcbiAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ0xlZnRcIikuYW5pbWF0ZSh7IGxlZnQ6IFwiMHB4XCIgfSwgMjAwKTtcbiAgICAgICAgICAgIGlmICgkKFwiI2NvbXBsZXRpb25CdXR0b25cIikuaGFzQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKSkge1xuICAgICAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgeyByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2QmdTaG93biA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobmF2QmdTaG93bikge1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ0xlZnRcIikuYW5pbWF0ZSh7IGxlZnQ6IFwiLTY1cHhcIiB9LCAyMDApO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5hdkJnU2hvd24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGNvbXBsZXRpb25GbGFnID0gMDtcbiAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAxO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgd2UgbWFyayB0aGlzIHBhZ2UgYXMgdmlzaXRlZCByZWdhcmRsZXNzIG9mIGhvdyBmbGFrZXlcbiAgICAvLyB0aGUgb251bmxvYWQgaGFuZGxlcnMgYmVjb21lLlxuICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcsIHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWFya2luZ0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIHZhciBtYXJraW5nSW5jb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgXCI8aSBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi1vayc+PC9pPiBDb21wbGV0ZWQuIFdlbGwgRG9uZSFcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmFuaW1hdGUoeyByaWdodDogbmF2TGlua0JnUmlnaHRGdWxsT3BlbiB9KTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSAwO1xuICAgICAgICAgICAgY29tcGxldGlvbkZsYWcgPSAxO1xuICAgICAgICAgICAgbWFya2luZ0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuaHRtbChcIk1hcmsgYXMgQ29tcGxldGVkXCIpO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZSh7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0pO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnID0gMDtcbiAgICAgICAgICAgIG1hcmtpbmdJbmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzUGFnZVN0YXRlKFxuICAgICAgICAgICAgY29tcGxldGlvbkZsYWcsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIG1hcmtpbmdDb21wbGV0ZSxcbiAgICAgICAgICAgIG1hcmtpbmdJbmNvbXBsZXRlXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyB3ZSBjYW5ub3QgYWZmb3JkIHRvIGRvIHRoaXMgYXQgYm90aCBsb2FkIGFuZCB1bmxvYWQgZXNwZWNpYWxseSBhcyB1c2Vyc1xuICAgIC8vIGdvIGZyb20gcGFnZSB0byBwYWdlLiBUaGlzIGp1c3QgZG91YmxlcyB0aGUgbG9hZC4gIFNvLCB0cnkgd2l0aG91dCB0aGlzIG9uZS5cbiAgICAvLyAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgaWYgKGNvbXBsZXRpb25GbGFnID09IDApIHtcbiAgICAvLyAgICAgICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSk7XG59XG5cbi8vIF8gZGVjb3JhdGVUYWJsZU9mQ29udGVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCkge1xuICAgIGlmIChcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidG9jLmh0bWxcIikgIT0gLTEgfHxcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiaW5kZXguaHRtbFwiKSAhPSAtMSB8fFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJmcm9udG1hdHRlclwiKSAhPSAtMVxuICAgICkge1xuICAgICAgICBpZiAoIWlzUHJlVGVYdCgpKSB7XG4gICAgICAgICAgICBqUXVlcnkuZ2V0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0QWxsQ29tcGxldGlvblN0YXR1c2AsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1YkNoYXB0ZXJMaXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViQ2hhcHRlckxpc3QgPSBkYXRhLmRldGFpbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFN1YkNoYXB0ZXJVUkxzID0gJChcIiNtYWluLWNvbnRlbnQgZGl2IGxpIGFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goc3ViQ2hhcHRlckxpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgYWxsU3ViQ2hhcHRlclVSTHMubGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsU3ViQ2hhcHRlclVSTHNbc10uaHJlZi5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2hhcHRlck5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiL1wiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1YkNoYXB0ZXJOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChhbGxTdWJDaGFwdGVyVVJMc1tzXS5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJjb21wbGV0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImluZm9UZXh0Q29tcGxldGVkXCI+LSBDb21wbGV0ZWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuaW5mb1RleHRDb21wbGV0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5pbmZvVGV4dENvbXBsZXRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW5mb1RleHRBY3RpdmVcIj5MYXN0IHJlYWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0KFwiLmluZm9UZXh0QWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHsgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UgfTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0bGFzdHBhZ2VgLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQYWdlRGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNjb250aW51ZS1yZWFkaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNob3coKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImp1bXAtdG8tY2hhcHRlclwiIGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiID48c3Ryb25nPllvdSB3ZXJlIExhc3QgUmVhZGluZzo8L3N0cm9uZz4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGFzdFBhZ2VEYXRhLmxhc3RQYWdlU3ViY2hhcHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIiAmZ3Q7IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVN1YmNoYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIDxhIGhyZWY9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlVXJsICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/bGFzdFBvc2l0aW9uPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlU2Nyb2xsTG9jYXRpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCI+Q29udGludWUgUmVhZGluZzwvYT48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUNvbXBsZXRpb25zKCkge1xuICAgIGdldENvbXBsZXRpb25zKCk7XG4gICAgc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpO1xuICAgIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpO1xuICAgIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCk7XG59XG5cbi8vIGNhbGwgZW5hYmxlIHVzZXIgaGlnaGxpZ2h0cyBhZnRlciBsb2dpblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW5cIiwgZW5hYmxlQ29tcGxldGlvbnMpO1xuXG5mdW5jdGlvbiBpc1ByZVRlWHQoKSB7XG4gICAgbGV0IHB0eE1hcmtlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LnByZXRleHRcIik7XG4gICAgaWYgKHB0eE1hcmtlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLy8gXyBwcm9jZXNzUGFnZVN0YXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBwcm9jZXNzUGFnZVN0YXRlKFxuICAgIGNvbXBsZXRpb25GbGFnLFxuICAgIHBhZ2VMb2FkLFxuICAgIG1hcmtpbmdDb21wbGV0ZSxcbiAgICBtYXJraW5nSW5jb21wbGV0ZVxuKSB7XG4gICAgLypMb2cgbGFzdCBwYWdlIHZpc2l0ZWQqL1xuICAgIHZhciBjdXJyZW50UGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKGN1cnJlbnRQYXRobmFtZS5pbmRleE9mKFwiP1wiKSAhPT0gLTEpIHtcbiAgICAgICAgY3VycmVudFBhdGhuYW1lID0gY3VycmVudFBhdGhuYW1lLnN1YnN0cmluZyhcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBjdXJyZW50UGF0aG5hbWUubGFzdEluZGV4T2YoXCI/XCIpXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8vIElzIHRoaXMgYSBwdHggYm9vaz9cbiAgICBsZXQgaXNQdHhCb29rID0gaXNQcmVUZVh0KCk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxhc3RQYWdlVXJsOiBjdXJyZW50UGF0aG5hbWUsXG4gICAgICAgIGxhc3RQYWdlU2Nyb2xsTG9jYXRpb246IE1hdGgucm91bmQoJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSxcbiAgICAgICAgY29tcGxldGlvbkZsYWc6IGNvbXBsZXRpb25GbGFnLFxuICAgICAgICBwYWdlTG9hZDogcGFnZUxvYWQsXG4gICAgICAgIG1hcmtpbmdDb21wbGV0ZTogbWFya2luZ0NvbXBsZXRlLFxuICAgICAgICBtYXJraW5nSW5jb21wbGV0ZTogbWFya2luZ0luY29tcGxldGUsXG4gICAgICAgIGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICBpc1B0eEJvb2s6IGlzUHR4Qm9vayxcbiAgICB9O1xuICAgICQoZG9jdW1lbnQpLmFqYXhFcnJvcihmdW5jdGlvbiAoZSwganFoeHIsIHNldHRpbmdzLCBleGNlcHRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBzZXR0aW5ncy51cmwpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9KTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVsYXN0cGFnZWAsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgfSk7XG59XG5cbiQuZXh0ZW5kKHtcbiAgICBnZXRVcmxWYXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2YXJzID0gW10sXG4gICAgICAgICAgICBoYXNoO1xuICAgICAgICB2YXIgaGFzaGVzID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaFxuICAgICAgICAgICAgLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5kZXhPZihcIj9cIikgKyAxKVxuICAgICAgICAgICAgLnNwbGl0KFwiJlwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoZXNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgdmFycy5wdXNoKGhhc2hbMF0pO1xuICAgICAgICAgICAgdmFyc1toYXNoWzBdXSA9IGhhc2hbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhcnM7XG4gICAgfSxcbiAgICBnZXRVcmxWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiAkLmdldFVybFZhcnMoKVtuYW1lXTtcbiAgICB9LFxufSk7XG4iLCIvKiFcbiAqIGpRdWVyeSBpZGxlVGltZXIgcGx1Z2luXG4gKiB2ZXJzaW9uIDAuOS4xMDA1MTFcbiAqIGJ5IFBhdWwgSXJpc2guXG4gKiAgIGh0dHA6Ly9naXRodWIuY29tL3BhdWxpcmlzaC95dWktbWlzYy90cmVlL1xuICogTUlUIGxpY2Vuc2VcblxuICogYWRhcHRlZCBmcm9tIFlVSSBpZGxlIHRpbWVyIGJ5IG56YWthczpcbiAqICAgaHR0cDovL2dpdGh1Yi5jb20vbnpha2FzL3l1aS1taXNjL1xuKi9cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDkgTmljaG9sYXMgQy4gWmFrYXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qIHVwZGF0ZWQgdG8gZml4IENocm9tZSBzZXRUaW1lb3V0IGlzc3VlIGJ5IFphaWQgWmF3YWlkZWggKi9cblxuIC8vIEFQSSBhdmFpbGFibGUgaW4gPD0gdjAuOFxuIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAvLyBpZGxlVGltZXIoKSB0YWtlcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGRlZmluZXMgdGhlIGlkbGUgdGltZW91dFxuIC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzOyBkZWZhdWx0cyB0byAzMDAwMFxuICQuaWRsZVRpbWVyKDEwMDAwKTtcblxuXG4gJChkb2N1bWVudCkuYmluZChcImlkbGUuaWRsZVRpbWVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgLy8gZnVuY3Rpb24geW91IHdhbnQgdG8gZmlyZSB3aGVuIHRoZSB1c2VyIGdvZXMgaWRsZVxuIH0pO1xuXG5cbiAkKGRvY3VtZW50KS5iaW5kKFwiYWN0aXZlLmlkbGVUaW1lclwiLCBmdW5jdGlvbigpe1xuICAvLyBmdW5jdGlvbiB5b3Ugd2FudCB0byBmaXJlIHdoZW4gdGhlIHVzZXIgYmVjb21lcyBhY3RpdmUgYWdhaW5cbiB9KTtcblxuIC8vIHBhc3MgdGhlIHN0cmluZyAnZGVzdHJveScgdG8gc3RvcCB0aGUgdGltZXJcbiAkLmlkbGVUaW1lcignZGVzdHJveScpO1xuXG4gLy8geW91IGNhbiBxdWVyeSBpZiB0aGUgdXNlciBpcyBpZGxlIG9yIG5vdCB3aXRoIGRhdGEoKVxuICQuZGF0YShkb2N1bWVudCwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyB5b3UgY2FuIGdldCB0aW1lIGVsYXBzZWQgc2luY2UgdXNlciB3aGVuIGlkbGUvYWN0aXZlXG4gJC5pZGxlVGltZXIoJ2dldEVsYXBzZWRUaW1lJyk7IC8vIHRpbWUgc2luY2Ugc3RhdGUgY2hhbmdlIGluIG1zXG5cbiAqKioqKioqKi9cblxuXG5cbiAvLyBBUEkgYXZhaWxhYmxlIGluID49IHYwLjlcbiAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gLy8gYmluZCB0byBzcGVjaWZpYyBlbGVtZW50cywgYWxsb3dzIGZvciBtdWx0aXBsZSB0aW1lciBpbnN0YW5jZXNcbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0fCdkZXN0cm95J3wnZ2V0RWxhcHNlZFRpbWUnKTtcbiAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyBpZiB5b3UncmUgdXNpbmcgdGhlIG9sZCAkLmlkbGVUaW1lciBhcGksIHlvdSBzaG91bGQgbm90IGRvICQoZG9jdW1lbnQpLmlkbGVUaW1lciguLi4pXG5cbiAvLyBlbGVtZW50IGJvdW5kIHRpbWVycyB3aWxsIG9ubHkgd2F0Y2ggZm9yIGV2ZW50cyBpbnNpZGUgb2YgdGhlbS5cbiAvLyB5b3UgbWF5IGp1c3Qgd2FudCBwYWdlLWxldmVsIGFjdGl2aXR5LCBpbiB3aGljaCBjYXNlIHlvdSBtYXkgc2V0IHVwXG4gLy8gICB5b3VyIHRpbWVycyBvbiBkb2N1bWVudCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBhbmQgZG9jdW1lbnQuYm9keVxuXG4gLy8gWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYSBzZWNvbmQgYXJndW1lbnQgdG8gb3ZlcnJpZGUgY2VydGFpbiBvcHRpb25zLlxuIC8vIEhlcmUgYXJlIHRoZSBkZWZhdWx0cywgc28geW91IGNhbiBvbWl0IGFueSBvciBhbGwgb2YgdGhlbS5cbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0LCB7XG4gICBzdGFydEltbWVkaWF0ZWx5OiB0cnVlLCAvL3N0YXJ0cyBhIHRpbWVvdXQgYXMgc29vbiBhcyB0aGUgdGltZXIgaXMgc2V0IHVwOyBvdGhlcndpc2UgaXQgd2FpdHMgZm9yIHRoZSBmaXJzdCBldmVudC5cbiAgIGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcbiAgIGVuYWJsZWQ6IHRydWUsICAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSBpZGxlIHRpbWVyIGlzIGVuYWJsZWRcbiAgIGV2ZW50czogICdtb3VzZW1vdmUga2V5ZG93biBET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsIG1vdXNlZG93biB0b3VjaHN0YXJ0IHRvdWNobW92ZScgLy8gYWN0aXZpdHkgaXMgb25lIG9mIHRoZXNlIGV2ZW50c1xuIH0pO1xuXG4gKioqKioqKiovXG5cbihmdW5jdGlvbigkKXtcblxuJC5pZGxlVGltZXIgPSBmdW5jdGlvbihuZXdUaW1lb3V0LCBlbGVtLCBvcHRzKXtcblxuICAgIC8vIGRlZmF1bHRzIHRoYXQgYXJlIHRvIGJlIHN0b3JlZCBhcyBpbnN0YW5jZSBwcm9wcyBvbiB0aGUgZWxlbVxuXG5cdG9wdHMgPSAkLmV4dGVuZCh7XG5cdFx0c3RhcnRJbW1lZGlhdGVseTogdHJ1ZSwgLy9zdGFydHMgYSB0aW1lb3V0IGFzIHNvb24gYXMgdGhlIHRpbWVyIGlzIHNldCB1cFxuXHRcdGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcblx0XHRlbmFibGVkOiB0cnVlLCAgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgaWRsZSB0aW1lciBpcyBlbmFibGVkXG5cdFx0dGltZW91dDogMzAwMDAsICAgICAgICAgLy90aGUgYW1vdW50IG9mIHRpbWUgKG1zKSBiZWZvcmUgdGhlIHVzZXIgaXMgY29uc2lkZXJlZCBpZGxlXG5cdFx0ZXZlbnRzOiAgJ21vdXNlbW92ZSBrZXlkb3duIERPTU1vdXNlU2Nyb2xsIG1vdXNld2hlZWwgbW91c2Vkb3duIHRvdWNoc3RhcnQgdG91Y2htb3ZlJyAvLyBhY3Rpdml0eSBpcyBvbmUgb2YgdGhlc2UgZXZlbnRzXG5cdH0sIG9wdHMpO1xuXG5cbiAgICBlbGVtID0gZWxlbSB8fCBkb2N1bWVudDtcblxuICAgIC8qIChpbnRlbnRpb25hbGx5IG5vdCBkb2N1bWVudGVkKVxuICAgICAqIFRvZ2dsZXMgdGhlIGlkbGUgc3RhdGUgYW5kIGZpcmVzIGFuIGFwcHJvcHJpYXRlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdmFyIHRvZ2dsZUlkbGVTdGF0ZSA9IGZ1bmN0aW9uKG15ZWxlbSl7XG5cbiAgICAgICAgLy8gY3Vyc2UgeW91LCBtb3ppbGxhIHNldFRpbWVvdXQgbGF0ZW5lc3MgYnVnIVxuICAgICAgICBpZiAodHlwZW9mIG15ZWxlbSA9PT0gJ251bWJlcicpe1xuICAgICAgICAgICAgbXllbGVtID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iaiA9ICQuZGF0YShteWVsZW0gfHwgZWxlbSwnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy90b2dnbGUgdGhlIHN0YXRlXG4gICAgICAgIG9iai5pZGxlID0gIW9iai5pZGxlO1xuXG4gICAgICAgIC8vIHJlc2V0IHRpbWVvdXQgXG4gICAgICAgIHZhciBlbGFwc2VkID0gKCtuZXcgRGF0ZSgpKSAtIG9iai5vbGRkYXRlO1xuICAgICAgICBvYmoub2xkZGF0ZSA9ICtuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vIGhhbmRsZSBDaHJvbWUgYWx3YXlzIHRyaWdnZXJpbmcgaWRsZSBhZnRlciBqcyBhbGVydCBvciBjb21maXJtIHBvcHVwXG4gICAgICAgIGlmIChvYmouaWRsZSAmJiAoZWxhcHNlZCA8IG9wdHMudGltZW91dCkpIHtcbiAgICAgICAgICAgICAgICBvYmouaWRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkLmlkbGVUaW1lci50SWQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmVuYWJsZWQpXG4gICAgICAgICAgICAgICAgICAkLmlkbGVUaW1lci50SWQgPSBzZXRUaW1lb3V0KHRvZ2dsZUlkbGVTdGF0ZSwgb3B0cy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vZmlyZSBhcHByb3ByaWF0ZSBldmVudFxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGN1c3RvbSBldmVudCwgYnV0IGZpcnN0LCBzdG9yZSB0aGUgbmV3IHN0YXRlIG9uIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIGFuZCB0aGVuIGFwcGVuZCB0aGF0IHN0cmluZyB0byBhIG5hbWVzcGFjZVxuICAgICAgICB2YXIgZXZlbnQgPSBqUXVlcnkuRXZlbnQoICQuZGF0YShlbGVtLCdpZGxlVGltZXInLCBvYmouaWRsZSA/IFwiaWRsZVwiIDogXCJhY3RpdmVcIiApICArICcuaWRsZVRpbWVyJyAgICk7XG5cbiAgICAgICAgLy8gd2UgZG8gd2FudCB0aGlzIHRvIGJ1YmJsZSwgYXQgbGVhc3QgYXMgYSB0ZW1wb3JhcnkgZml4IGZvciBqUXVlcnkgMS43XG4gICAgICAgIC8vIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAkKGVsZW0pLnRyaWdnZXIoZXZlbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgaWRsZSB0aW1lci4gVGhpcyByZW1vdmVzIGFwcHJvcHJpYXRlIGV2ZW50IGhhbmRsZXJzXG4gICAgICogYW5kIGNhbmNlbHMgYW55IHBlbmRpbmcgdGltZW91dHMuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RvcCA9IGZ1bmN0aW9uKGVsZW0pe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyT2JqJykgfHwge307XG5cbiAgICAgICAgLy9zZXQgdG8gZGlzYWJsZWRcbiAgICAgICAgb2JqLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICAvL2NsZWFyIGFueSBwZW5kaW5nIHRpbWVvdXRzXG4gICAgICAgIGNsZWFyVGltZW91dChvYmoudElkKTtcblxuICAgICAgICAvL2RldGFjaCB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgJChlbGVtKS5vZmYoJy5pZGxlVGltZXInKTtcbiAgICB9LFxuXG5cbiAgICAvKiAoaW50ZW50aW9uYWxseSBub3QgZG9jdW1lbnRlZClcbiAgICAgKiBIYW5kbGVzIGEgdXNlciBldmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXIgaXNuJ3QgaWRsZS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBBIERPTTItbm9ybWFsaXplZCBldmVudCBvYmplY3QuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBoYW5kbGVVc2VyRXZlbnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEodGhpcywnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy9jbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dFxuICAgICAgICBjbGVhclRpbWVvdXQob2JqLnRJZCk7XG5cblxuXG4gICAgICAgIC8vaWYgdGhlIGlkbGUgdGltZXIgaXMgZW5hYmxlZFxuICAgICAgICBpZiAob2JqLmVuYWJsZWQpe1xuXG5cbiAgICAgICAgICAgIC8vaWYgaXQncyBpZGxlLCB0aGF0IG1lYW5zIHRoZSB1c2VyIGlzIG5vIGxvbmdlciBpZGxlXG4gICAgICAgICAgICBpZiAob2JqLmlkbGUpe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUlkbGVTdGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZXQgYSBuZXcgdGltZW91dFxuICAgICAgICAgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cbiAgICAgICAgfVxuICAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydHMgdGhlIGlkbGUgdGltZXIuIFRoaXMgYWRkcyBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICAqIGFuZCBzdGFydHMgdGhlIGZpcnN0IHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtpbnR9IG5ld1RpbWVvdXQgKE9wdGlvbmFsKSBBIG5ldyB2YWx1ZSBmb3IgdGhlIHRpbWVvdXQgcGVyaW9kIGluIG1zLlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICogQG1ldGhvZCAkLmlkbGVUaW1lclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cblxuXG4gICAgdmFyIG9iaiA9ICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonKSB8fCB7fTtcblxuICAgIG9iai5vbGRkYXRlID0gb2JqLm9sZGRhdGUgfHwgK25ldyBEYXRlKCk7XG5cbiAgICAvL2Fzc2lnbiBhIG5ldyB0aW1lb3V0IGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0eXBlb2YgbmV3VGltZW91dCA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgIG9wdHMudGltZW91dCA9IG5ld1RpbWVvdXQ7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgc3RvcChlbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZ2V0RWxhcHNlZFRpbWUnKXtcbiAgICAgICAgcmV0dXJuICgrbmV3IERhdGUoKSkgLSBvYmoub2xkZGF0ZTtcbiAgICB9XG5cbiAgICAvL2Fzc2lnbiBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICQoZWxlbSkub24oJC50cmltKChvcHRzLmV2ZW50cysnICcpLnNwbGl0KCcgJykuam9pbignLmlkbGVUaW1lciAnKSksaGFuZGxlVXNlckV2ZW50KTtcblxuXG4gICAgb2JqLmlkbGUgICAgPSBvcHRzLmlkbGU7XG4gICAgb2JqLmVuYWJsZWQgPSBvcHRzLmVuYWJsZWQ7XG4gICAgb2JqLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQ7XG5cblxuICAgIC8vc2V0IGEgdGltZW91dCB0byB0b2dnbGUgc3RhdGUuIE1heSB3aXNoIHRvIG9taXQgdGhpcyBpbiBzb21lIHNpdHVhdGlvbnNcblx0aWYgKG9wdHMuc3RhcnRJbW1lZGlhdGVseSkge1xuXHQgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cdH1cblxuICAgIC8vIGFzc3VtZSB0aGUgdXNlciBpcyBhY3RpdmUgZm9yIHRoZSBmaXJzdCB4IHNlY29uZHMuXG4gICAgJC5kYXRhKGVsZW0sJ2lkbGVUaW1lcicsXCJhY3RpdmVcIik7XG5cbiAgICAvLyBzdG9yZSBvdXIgaW5zdGFuY2Ugb24gdGhlIG9iamVjdFxuICAgICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonLG9iaik7XG5cblxuXG59OyAvLyBlbmQgb2YgJC5pZGxlVGltZXIoKVxuXG5cbi8vIHYwLjkgQVBJIGZvciBkZWZpbmluZyBtdWx0aXBsZSB0aW1lcnMuXG4kLmZuLmlkbGVUaW1lciA9IGZ1bmN0aW9uKG5ld1RpbWVvdXQsb3B0cyl7XG5cdC8vIEFsbG93IG9taXNzaW9uIG9mIG9wdHMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0aWYgKCFvcHRzKSB7XG5cdFx0b3B0cyA9IHt9O1xuXHR9XG5cbiAgICBpZih0aGlzWzBdKXtcbiAgICAgICAgJC5pZGxlVGltZXIobmV3VGltZW91dCx0aGlzWzBdLG9wdHMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG59KShqUXVlcnkpO1xuIiwiaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5cbmludGVyZmFjZSBTcGxpY2VNZXNzYWdlRGF0YSB7XG4gICAgc3ViamVjdDogc3RyaW5nO1xuICAgIGFjdGl2aXR5X2lkPzogc3RyaW5nO1xuICAgIHNjb3JlPzogbnVtYmVyO1xuICAgIHN0YXRlPzogdW5rbm93bjtcbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIG1lc3NhZ2VfaWQ/OiBzdHJpbmc7XG4gICAgZnJhbWVfaWQ/OiBzdHJpbmc7XG4gICAgand0Pzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgU2F2ZWRTdGF0ZVJlc3BvbnNlIHtcbiAgICBkZXRhaWw6IHtcbiAgICAgICAgYW5zd2VyOiB1bmtub3duO1xuICAgIH07XG59XG5cbmludGVyZmFjZSBKd3RQYXlsb2FkIHtcbiAgICBzY29yZTogbnVtYmVyO1xuICAgIFtrZXk6IHN0cmluZ106IHVua25vd247XG59XG5cbmRlY2xhcmUgY29uc3QgZUJvb2tDb25maWc6IHtcbiAgICBjb3Vyc2U6IHN0cmluZztcbiAgICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufTtcblxuZXhwb3J0IGNsYXNzIFNwbGljZVdyYXBwZXIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pbml0U3BsaWNlKCk7XG4gICAgfVxuXG4gICAgaW5pdFNwbGljZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gU1BMSUNFIEV2ZW50c1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgYXN5bmMgKGV2ZW50OiBNZXNzYWdlRXZlbnQ8U3BsaWNlTWVzc2FnZURhdGE+KSA9PiB7XG4gICAgICAgICAgICB2YXIgc291cmNlSWZyYW1lID0gdGhpcy5zZW5kaW5nSWZyYW1lKGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTcGxpY2VXcmFwcGVyOiByZWNlaXZlZCBtZXNzYWdlIHN1YmplY3Q6ICR7ZXZlbnQuZGF0YS5zdWJqZWN0fSBmcm9tIGlmcmFtZTogJHtzb3VyY2VJZnJhbWUgPyBzb3VyY2VJZnJhbWUuaWQgOiBcInVua25vd25cIn1gKTtcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0UucmVwb3J0U2NvcmVBbmRTdGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTY29yZUFuZFN0YXRlKGV2ZW50LCBzb3VyY2VJZnJhbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0Uuc2VuZEV2ZW50XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNwbGljZUV2ZW50KGV2ZW50LCBzb3VyY2VJZnJhbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0UuZ2V0U3RhdGVcIikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaGFuZGxlR2V0U3RhdGUoZXZlbnQsIHNvdXJjZUlmcmFtZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGV2ZW50Lm9yaWdpbiA9PT0gXCJodHRwczovL3d3dy5teW9wZW5tYXRoLmNvbVwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICAoZXZlbnQuZGF0YSBhcyB1bmtub3duIGFzIHN0cmluZykuaW5kZXhPZihcImx0aS5leHQuaW1hdGhhcy5yZXN1bHRcIikgIT0gLTFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIHByb29mIG9mIGNvbmNlcHQgZm9yIE15IE9wZW4gTWF0aFxuICAgICAgICAgICAgICAgIGxldCBtc2dkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhIGFzIHVua25vd24gYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICBsZXQgand0ID0gYmFzaWNQYXJzZUp3dChtc2dkYXRhLmp3dCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIFwiUmVzdWx0IHJlY2VpdmVkIGZyb20gZnJhbWUgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnZGF0YS5mcmFtZV9pZCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiB3aXRoIHNjb3JlIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGp3dC5zY29yZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gdG9kbyBzZW5kIHNjb3JlIHRvIHNlcnZlclxuICAgICAgICAgICAgICAgIC8vIGRvZXMgTU9NIGhhdmUgYSB3YXkgdG8gZ2V0IHRoZSBzdGF0ZT9cbiAgICAgICAgICAgICAgICAvLyB0b2RvIHNlbmQgc3RhdGUgdG8gc2VydmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFVuaXF1ZUlEKGV2ZW50OiBNZXNzYWdlRXZlbnQ8U3BsaWNlTWVzc2FnZURhdGE+LCBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIGFjdGl2aXR5XG4gICAgICAgIC8vIFRoZSBTUExJQ0UgcHJvdG9jb2wgYWxsb3dzIGZvciB0d28gcG9zc2liaWxpdGllc1xuICAgICAgICAvLyAxLiBhY3Rpdml0eV9pZCBpcyB0aGUgdW5pcXVlIGlkIGFzIGFzc2lnbmVkIGJ5IHRoZSBwcm92aWRlclxuICAgICAgICAvLyAyLiBhY3Rpdml0eV9pZCBpcyB0aGUgaWZyYW1lIHNyYyB1cmxcbiAgICAgICAgLy8gaWYgdGhlIGFjdGl2aXR5X2lkIGlzIHNldCB0aGVyZSBtYXkgYWxzbyBiZSBhbm90aGVyIGF0dHJpYnV0ZSBjYWxsZWQgZG9tYWluXG4gICAgICAgIC8vIE9uIFJ1bmVzdG9uZSB3ZSB3aWxsIHRyeSB0byBtYXAgdGhlIGFjdGl2aXR5IHRvIHRoZSBkaXZfaWQgb2YgdGhlIGVuY2xvc2luZyBSUyBjb21wb25lbnRcbiAgICAgICAgLy8gaWYgcG9zc2libGUsIG90aGVyd2lzZSB3ZSB3aWxsIHVzZSB0aGUgYWN0aXZpdHlfaWQgb3IgaWZyYW1lIHNyY1xuICAgICAgICAvLyBJZiBhbiBpbnRlcmFjdGl2ZSBpcyBpbmNsdWRlZCBpbiBhbiBleGVyY2lzZXMgdGhpcyBhbGxvd3MgdXMgdG8gbWFwIHRoZSBzY29yZVxuICAgICAgICAvLyB0byB0aGUgaWQgdGhlIGluc3RydWN0b3IgdXNlZCB0byBhc3NpZ24gdGhlIHByb2JsZW0uXG4gICAgICAgIGlmIChmcmFtZSkge1xuICAgICAgICAgICAgbGV0IHJzRGl2ID0gZnJhbWUuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgICAgICAgICBpZiAocnNEaXYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcnNEaXYuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gZXZlbnQuZGF0YS5hY3Rpdml0eV9pZDtcbiAgICAgICAgaWYgKCFsb2NhdGlvbikge1xuICAgICAgICAgICAgaWYgKGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24gPSBmcmFtZS5zcmM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gXCJ1bmtub3duXCI7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJDb3VsZCBub3QgZmluZCBpZnJhbWUgdGhhdCBzZW50IHRoZSBTUExJQ0UgZXZlbnRcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uO1xuICAgIH1cblxuICAgIGhhbmRsZVNjb3JlQW5kU3RhdGUoZXZlbnQ6IE1lc3NhZ2VFdmVudDxTcGxpY2VNZXNzYWdlRGF0YT4sIGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBTUExJQ0UucmVwb3J0U2NvcmVBbmRTdGF0ZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5hY3Rpdml0eV9pZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuc2NvcmUpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnN0YXRlKTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5nZXRVbmlxdWVJRChldmVudCwgZnJhbWUpO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogZXZlbnQuZGF0YS5zdWJqZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiBsb2NhdGlvbixcbiAgICAgICAgICAgIGFjdDogYHNjb3JlOiAke2V2ZW50LmRhdGEuc2NvcmV9YCxcbiAgICAgICAgICAgIHNjb3JlOiBldmVudC5kYXRhLnNjb3JlLFxuICAgICAgICAgICAgcGVyY2VudDogZXZlbnQuZGF0YS5zY29yZSxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGV2ZW50LmRhdGEuc2NvcmUgPT0gMS4wID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeShldmVudC5kYXRhLnN0YXRlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VuZGluZ0lmcmFtZShldmVudDogTWVzc2FnZUV2ZW50KTogSFRNTElGcmFtZUVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIGlmcmFtZSB0aGF0IHNlbnQgdGhlIGV2ZW50XG4gICAgICAgIC8vIHlvdSB3b3VsZCB0aGluayB0aGF0IGV2ZW50LnNvdXJjZSB3b3VsZCBiZSB0aGUgaWZyYW1lXG4gICAgICAgIC8vIGJ1dCBpdCBpcyBub3QgYW5kIGdldHRpbmcgdGhlIGxvY2F0aW9uIG91dCBvZiBldmVudC5zb3VyY2VcbiAgICAgICAgLy8gY3JlYXRlcyBDT1JTIGlzc3Vlcy5cbiAgICAgICAgZm9yIChjb25zdCBmIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWZyYW1lXCIpKSB7XG4gICAgICAgICAgICBpZiAoZi5jb250ZW50V2luZG93ID09PSBldmVudC5zb3VyY2UpIHJldHVybiBmO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U2F2ZWRTdGF0ZShsb2NhdGlvbjogc3RyaW5nKTogUHJvbWlzZTxTYXZlZFN0YXRlUmVzcG9uc2UgfCBudWxsPiB7XG4gICAgICAgIC8vIGZldGNoIHRoZSBzdGF0ZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvbnMvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJTUExJQ0UuZ2V0U3RhdGVcIixcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCBlcnJvciEgc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IFNhdmVkU3RhdGVSZXNwb25zZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIFNQTElDRSBzdGF0ZTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBoYW5kbGVHZXRTdGF0ZShldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IFNQTElDRS5nZXRTdGF0ZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5hY3Rpdml0eV9pZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuc3RhdGUpO1xuICAgICAgICAvLyBzdWJqZWN0IGlzIFNQTElDRS5nZXRTdGF0ZS5yZXNwb25zZVxuICAgICAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmdldFVuaXF1ZUlEKGV2ZW50LCBmcmFtZSk7XG4gICAgICAgIGxldCByZXMgPSBhd2FpdCB0aGlzLmdldFNhdmVkU3RhdGUobG9jYXRpb24pO1xuICAgICAgICBsZXQgc3RhdGUgPSByZXM/LmRldGFpbC5hbnN3ZXI7XG4gICAgICAgIChldmVudC5zb3VyY2UgYXMgV2luZG93KS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlX2lkOiBldmVudC5kYXRhLm1lc3NhZ2VfaWQsXG4gICAgICAgICAgICAgICAgc3ViamVjdDogXCJTUExJQ0UuZ2V0U3RhdGUucmVzcG9uc2VcIixcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIqXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTcGxpY2VFdmVudChldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgICAgIC8vIGhhbmRsZSBnZW5lcmljIFNQTElDRSBldmVudHMsIHN1Y2ggYXMgbG9nZ2VkIGNsaWNrc1xuICAgICAgICAvLyBvciBvdGhlciBldmVudHMuICBTUExJQ0UgZG9lcyBub3QgcmVxdWlyZSB0aGF0IHdlIGRvXG4gICAgICAgIC8vIGFueXRoaW5nIHdpdGggdGhlbSwgYnV0IGluIGtlZXBpbmcgd2l0aCBvdXIgdHJhZGl0aW9uXG4gICAgICAgIC8vIHdlIHdpbGwgc2F2ZSB0aGVtIHRvIHRoZSB1c2VpbmZvIHRhYmxlIGluIHRoZSBkYXRhYmFzZVxuICAgICAgICAvLyBpbiBjYXNlIHRoZXkgcHJvdmUgdG8gYmUgdXNlZnVsIGZvciByZXNlYXJjaCBsYXRlclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBTUExJQ0Uuc2VuZEV2ZW50XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLmFjdGl2aXR5X2lkKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5uYW1lKTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5nZXRVbmlxdWVJRChldmVudCwgZnJhbWUpO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogZXZlbnQuZGF0YS5zdWJqZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiBsb2NhdGlvbixcbiAgICAgICAgICAgIGFjdDogZXZlbnQuZGF0YS5uYW1lIHx8IFwidW5rbm93blwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0aGVzZSBzdHVicyBhcmUgbm90IGltcGxlbWVudGVkLCBidXQgYXJlIHJlcXVpcmVkIGJ5IHRoZSBSdW5lc3RvbmVCYXNlIGNsYXNzXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKTogdm9pZCB7fVxuICAgIHNldExvY2FsU3RvcmFnZSgpOiB2b2lkIHt9XG4gICAgcmVzdG9yZUFuc3dlcnMoKTogdm9pZCB7fVxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpOiB2b2lkIHt9XG59XG5cbmZ1bmN0aW9uIGJhc2ljUGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEp3dFBheWxvYWQge1xuICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdChcIi5cIilbMV07XG4gICAgdmFyIGJhc2U2NCA9IGJhc2U2NFVybC5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcbiAgICB2YXIganNvblBheWxvYWQgPSBkZWNvZGVVUklDb21wb25lbnQoXG4gICAgICAgIHdpbmRvd1xuICAgICAgICAgICAgLmF0b2IoYmFzZTY0KVxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIiVcIiArIChcIjAwXCIgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oXCJcIilcbiAgICApO1xuICAgIHJldHVybiBKU09OLnBhcnNlKGpzb25QYXlsb2FkKSBhcyBKd3RQYXlsb2FkO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIFJ1bmVzdG9uZSBCYXNlIENsYXNzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gSW4gYWRkaXRpb24gYWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBkbyB0aGUgZm9sbG93aW5nIHRoaW5nczpcbiAqXG4gKiAxLiAgIEVuc3VyZSB0aGF0IHRoZXkgYXJlIHdyYXBwZWQgaW4gYSBkaXYgd2l0aCB0aGUgY2xhc3MgcnVuZXN0b25lXG4gKiAyLiAgIFdyaXRlIHRoZWlyIHNvdXJjZSBBTkQgdGhlaXIgZ2VuZXJhdGVkIGh0bWwgdG8gdGhlIGRhdGFiYXNlIGlmIHRoZSBkYXRhYmFzZSBpcyBjb25maWd1cmVkXG4gKiAzLiAgIFByb3Blcmx5IHNhdmUgYW5kIHJlc3RvcmUgdGhlaXIgYW5zd2VycyB1c2luZyB0aGUgY2hlY2tTZXJ2ZXIgbWVjaGFuaXNtIGluIHRoaXMgYmFzZSBjbGFzcy4gRWFjaCBjb21wb25lbnQgbXVzdCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mOlxuICpcbiAqICAgICAgLSAgICBjaGVja0xvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHNldExvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHJlc3RvcmVBbnN3ZXJzXG4gKiAgICAgIC0gICAgZGlzYWJsZUludGVyYWN0aW9uXG4gKlxuICogNC4gICBwcm92aWRlIGEgU2VsZW5pdW0gYmFzZWQgdW5pdCB0ZXN0XG4gKi9cblxuaW1wb3J0IHsgcGFnZVByb2dyZXNzVHJhY2tlciB9IGZyb20gXCIuL2Jvb2tmdW5jcy5qc1wiO1xuLy9pbXBvcnQgXCIuLy4uL3N0eWxlcy9ydW5lc3RvbmUtY3VzdG9tLXNwaGlueC1ib290c3RyYXAuY3NzXCI7XG5cbnZhciBOT19ERUNPUkFURSA9IFtcInBhcnNvbnNNb3ZlXCIsIFwic2hvd2V2YWxcIiwgXCJ2aWRlb1wiLCBcInBvbGxcIiwgXCJ2aWV3X3RvZ2dsZVwiLFxuICAgIFwiZGFzaGJvYXJkXCIsIFwic2VsZWN0cXVlc3Rpb25cIiwgXCJjb2RlbGVuc1wiLCBcInBlZXJcIl1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgKHJlc29sdmUpID0+ICh0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbiA9IHJlc29sdmUpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuYWxsQ29tcG9uZW50cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgd2luZG93LmFsbENvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgdGhpcy5zaWQgPSBvcHRzLnNpZDtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyYWN0aXZlID0gb3B0cy5ncmFkZXJhY3RpdmU7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUaW1lZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5lbmZvcmNlRGVhZGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWRsaW5lID0gb3B0cy5kZWFkbGluZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSB0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZShvcHRzLm9yaWcsIFwiZGF0YS1vcHRpb25hbFwiKTtcbiAgICAgICAgICAgIGlmIChvcHRzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9IG9wdHMuc2VsZWN0b3JfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMuYXNzZXNzbWVudFRha2VuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBvcHRzLmFzc2Vzc21lbnRUYWtlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byB0cnVlIGFzIHRoaXMgb3B0IGlzIG9ubHkgcHJvdmlkZWQgZnJvbSBhIHRpbWVkQXNzZXNzbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZm9yIHRoZSBzZWxlY3RxdWVzdGlvbiBwb2ludHNcbiAgICAgICAgICAgIC8vIElmIGEgc2VsZWN0cXVlc3Rpb24gaXMgcGFydCBvZiBhIHRpbWVkIGV4YW0gaXQgd2lsbCBnZXRcbiAgICAgICAgICAgIC8vIHRoZSB0aW1lZFdyYXBwZXIgb3B0aW9ucy5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50aW1lZFdyYXBwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9IG9wdHMudGltZWRXcmFwcGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBIb3dldmVyIHNvbWV0aW1lcyBzZWxlY3RxdWVzdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBhcmUgdXNlZCBpbiByZWd1bGFyIGFzc2lnbm1lbnRzLiAgVGhlIGhhY2t5IHdheSB0byBkZXRlY3QgdGhpc1xuICAgICAgICAgICAgICAgIC8vIGlzIHRvIGxvb2sgZm9yIGRvQXNzaWdubWVudCBpbiB0aGUgVVJMIGFuZCB0aGVuIGdyYWJcbiAgICAgICAgICAgICAgICAvLyB0aGUgYXNzaWdubWVudCBuYW1lIGZyb20gdGhlIGhlYWRpbmcuXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImRvQXNzaWdubWVudFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gJChcImgxI2Fzc2lnbm1lbnRfbmFtZVwiKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcInF1ZXN0aW9uX2xhYmVsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbl9sYWJlbCA9ICQob3B0cy5vcmlnKS5kYXRhKFwicXVlc3Rpb25fbGFiZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzX3RvZ2dsZSA9IHRydWUgPyBvcHRzLmlzX3RvZ2dsZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc19zZWxlY3QgPSB0cnVlID8gb3B0cy5pc19zZWxlY3QgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1qZWxlbWVudHMgPSBbXTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm1qUmVhZHkgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBzZWxmLm1qcmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hUXVldWUgPSBuZXcgQXV0b1F1ZXVlKCk7XG4gICAgICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzLnByZWFtYmxlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnByZWFtYmxlID0gb3B0cy5wcmVhbWJsZTtcbiAgICAgICAgICAgIGxldCB5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHkuY2xhc3NMaXN0LmFkZChcImhpZGRlbi1jb250ZW50XCIpO1xuICAgICAgICAgICAgeS5jbGFzc0xpc3QuYWRkKFwicHJvY2Vzcy1tYXRoXCIpO1xuICAgICAgICAgICAgeS5pbm5lckhUTUwgPSBcIlxcXFwoXCIgKyB0aGlzLnByZWFtYmxlICsgXCJcXFxcKVwiO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGhhY2sgdG8gZ2V0IHRoZSBwcmVhbWJsZSBpbnRvIHRoZSBET00gc28gdGhhdCBNYXRoSmF4IGNhbiBwcm9jZXNzIGl0LlxuICAgICAgICAgICAgb3B0cy5vcmlnLmFwcGVuZENoaWxkKHkpO1xuICAgICAgICAgICAgeS5pZCA9IFwibHR4X3ByZWFtYmxlXCI7XG4gICAgICAgICAgICB5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcHJlYW1ibGUgdG8gdGhlIHF1ZXVlIG9iamVjdCBzbyBpdCBjYW4gcHJlcGVuZCBpdCB0b1xuICAgICAgICAgICAgLy8gZnV0dXJlIE1hdGhKYXggcHJvY2Vzc2luZ1xuICAgICAgICAgICAgdGhpcy5hUXVldWUucHJlYW1ibGUgPSB5XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmpzb25IZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHBhcnNpbmcgYm9vbGVhbiBkYXRhLSogYXR0cmlidXRlc1xuICAgIC8vIFVuc2V0L1wiZmFsc2VcIi9cIm5vXCIgbWVhbnMgZmFsc2UsIGFueXRoaW5nIGVsc2UsIGluY2x1ZGluZyBlbXB0eSBzdHJpbmcgbWVhbnMgdHJ1ZVxuICAgIHBhcnNlQm9vbGVhbkF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAoYXR0clZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG93ZXJWYWx1ZSA9IGF0dHJWYWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobG93ZXJWYWx1ZSA9PT0gXCJmYWxzZVwiIHx8IGxvd2VyVmFsdWUgPT09IFwibm9cIikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIF9gbG9nQm9va0V2ZW50YFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2VuZHMgdGhlIHByb3ZpZGVkIGBgZXZlbnRJbmZvYGAgdG8gdGhlIGBoc2Jsb2cgZW5kcG9pbnRgIG9mIHRoZSBzZXJ2ZXIuIEF3YWl0aW5nIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBlaXRoZXIgYGB1bmRlZmluZWRgYCAoaWYgUnVuZXN0b25lIHNlcnZpY2VzIGFyZSBub3QgYXZhaWxhYmxlKSBvciB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgc2VydmVyIGFzIGEgSmF2YVNjcmlwdCBvYmplY3QgKGFscmVhZHkgSlNPTi1kZWNvZGVkKS5cbiAgICBhc3luYyBsb2dCb29rRXZlbnQoZXZlbnRJbmZvKSB7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3N0X3JldHVybjtcbiAgICAgICAgZXZlbnRJbmZvLmNvdXJzZV9uYW1lID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgLy8gRm9yIHNlbGVjdHF1ZXN0aW9ucyB3ZSBuZWVkIHRvIGxvZyB1c2luZyB0aGUgc2VsZWN0b3JfaWQgZm9yIHJlYWwgdGltZSBzY29yaW5nXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uc2VsZWN0b3JfaWQgPSB0aGlzLnNlbGVjdG9yX2lkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wZXJjZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBldmVudEluZm8ucGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93LmFzc2lnbm1lbnRJZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFzc2lnbm1lbnRfaWQgPSB3aW5kb3cuYXNzaWdubWVudElkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwb3N0X3JldHVybiA9IHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCB8fCBlQm9va0NvbmZpZy5kZWJ1Zykge1xuICAgICAgICAgICAgbGV0IHByZWZpeCA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gPyBcIlNhdmVcIiA6IFwiTm90XCI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtwcmVmaXh9IGxvZ2dpbmcgZXZlbnQgYCArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gc2VsZWN0cXVlc3Rpb25zIGFyZSBwYXJ0IG9mIGFuIGFzc2lnbm1lbnQgZXNwZWNpYWxseSB0b2dnbGUgcXVlc3Rpb25zXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gY291bnQgdXNpbmcgdGhlIHNlbGVjdG9yX2lkIG9mIHRoZSBzZWxlY3QgcXVlc3Rpb24uXG4gICAgICAgIC8vIFdlICBhbHNvIG5lZWQgdG8gbG9nIGFuIGV2ZW50IGZvciB0aGF0IHNlbGVjdG9yIHNvIHRoYXQgd2Ugd2lsbCBrbm93XG4gICAgICAgIC8vIHRoYXQgaW50ZXJhY3Rpb24gaGFzIHRha2VuIHBsYWNlLiAgVGhpcyBpcyAqKmluZGVwZW5kZW50Kiogb2YgaG93IHRoZVxuICAgICAgICAvLyBhdXRvZ3JhZGVyIHdpbGwgdWx0aW1hdGVseSBncmFkZSB0aGUgcXVlc3Rpb24hXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZGl2X2lkID0gdGhpcy5zZWxlY3Rvcl9pZC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIFwiLXRvZ2dsZVNlbGVjdGVkUXVlc3Rpb25cIixcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmV2ZW50ID0gXCJzZWxlY3RxdWVzdGlvblwiO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCA9IFwiaW50ZXJhY3Rpb25cIjtcbiAgICAgICAgICAgIHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICBldmVudEluZm8uYWN0ICE9IFwiZWRpdFwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgaXMgaW4gdGhlIE5PX0RFQ09SQVRFIGxpc3QgdGhlbiBkb24ndCBkZWNvcmF0ZSB0aGUgc3RhdHVzXG4gICAgICAgIGlmIChOT19ERUNPUkFURS5pbmRleE9mKGV2ZW50SW5mby5ldmVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29yYXRlU3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIHBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbykge1xuICAgICAgICB2YXIgcG9zdF9yZXR1cm47XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2Jvb2tldmVudGAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MjIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRldGFpbHMgYWJvdXQgd2h5IHRoaXMgaXMgdW5wcm9jZXNhYmxlLlxuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocG9zdF9yZXR1cm4uZGV0YWlsLCBudWxsLCA0KSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVucHJvY2Vzc2FibGUgUmVxdWVzdFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zdF9yZXR1cm4gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYE1pc3NpbmcgYXV0aGVudGljYXRpb24gdG9rZW4gJHtwb3N0X3JldHVybi5kZXRhaWx9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGF1dGhlbnRpY2F0aW9uIHRva2VuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzYXZlIHRoZSBsb2cgZW50cnlcbiAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgbGV0IHNjb3JlU3BlYyA9IHBvc3RfcmV0dXJuLmRldGFpbDtcbiAgICAgICAgICAgIGxldCBncmFkZUJveCA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rvcl9pZCA9IHRoaXMuc2VsZWN0b3JfaWQucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBncmFkZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3NlbGVjdG9yX2lkfV9zY29yZWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncmFkZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMuZGl2aWR9X3Njb3JlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JhZGVCb3ggJiYgIXRoaXMuaXNUaW1lZCAmJiBzY29yZVNwZWMuc2NvcmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbGV0IGRldGFpbCA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKHBvc3RfcmV0dXJuICYmIHBvc3RfcmV0dXJuLmRldGFpbCkge1xuICAgICAgICAgICAgICAgIGRldGFpbCA9IHBvc3RfcmV0dXJuLmRldGFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGBFcnJvcjogWW91ciBhY3Rpb24gd2FzIG5vdCBzYXZlZCFcbiAgICAgICAgICAgICAgICAgICAgVGhlIGVycm9yIHdhcyAke2V9XG4gICAgICAgICAgICAgICAgICAgIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbCwgbnVsbCwgNCl9LlxuICAgICAgICAgICAgICAgICAgICBQbGVhc2UgcmVwb3J0IHRoaXMgZXJyb3IhYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZW5kIGEgcmVxdWVzdCB0byBzYXZlIHRoaXMgZXJyb3JcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBFcnJvcjogJHtlfSBEZXRhaWw6ICR7ZGV0YWlsfSBTdGF0dXMgQ29kZTogJHtyZXNwb25zZS5zdGF0dXN9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgfVxuICAgIC8vIHVwZGF0ZSB0aGUgc2NvcmUgZm9yIHRoZSBxdWVzdGlvbiBhbmQgdGhlIHRvdGFsIHNjb3JlXG4gICAgLy8gdGhlIHByZXNlbmNlIG9mIHRoZSBncmFkZUJveCBpcyB1c2VkIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgb24gYW4gYXNzaWdubWVudCBwYWdlLlxuICAgIHVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKSB7XG4gICAgICAgIGlmICghc2NvcmVTcGVjLmFzc2lnbmVkIHx8IHNjb3JlU3BlYy5zY29yZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5kaXZpZH1fbWVzc2FnZWApLmlubmVySFRNTCA9IFwiU2NvcmUgbm90IHVwZGF0ZWQuICBTdWJtaXNzaW9ucyBhcmUgY2xvc2VkLlwiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzY29yZVNwYW4gPSBncmFkZUJveC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXNjb3JlXCIpWzBdO1xuICAgICAgICBpZiAoc2NvcmVTcGFuKSB7XG4gICAgICAgICAgICBzY29yZVNwYW4uaW5uZXJIVE1MID0gc2NvcmVTcGVjLnNjb3JlLnRvRml4ZWQoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFsbFNjb3JlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxc2NvcmVcIik7XG4gICAgICAgIGxldCBhbGxtYXggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicW1heHNjb3JlXCIpO1xuICAgICAgICBsZXQgdG90YWwgPSAwO1xuICAgICAgICBsZXQgbWF4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxTY29yZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRvdGFsICs9IHBhcnNlRmxvYXQoYWxsU2NvcmVzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICBtYXggKz0gcGFyc2VGbG9hdChhbGxtYXhbaV0uaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG90YWxTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3RhbF9zY29yZVwiKTtcbiAgICAgICAgaWYgKHRvdGFsU3Bhbikge1xuICAgICAgICAgICAgdG90YWxTcGFuLmlubmVySFRNTCA9IHRvdGFsLnRvRml4ZWQoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1heFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvdGFsX21heFwiKTtcbiAgICAgICAgaWYgKG1heFNwYW4pIHtcbiAgICAgICAgICAgIG1heFNwYW4uaW5uZXJIVE1MID0gbWF4O1xuICAgICAgICB9XG4gICAgICAgIGxldCBwZXJjZW50U3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG90YWxfcGVyY2VudFwiKTtcbiAgICAgICAgaWYgKHBlcmNlbnRTcGFuKSB7XG4gICAgICAgICAgICBwZXJjZW50U3Bhbi5pbm5lckhUTUwgPSAoKHRvdGFsIC8gbWF4KSAqIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC4uIF9sb2dSdW5FdmVudDpcbiAgICAvL1xuICAgIC8vIGxvZ1J1bkV2ZW50XG4gICAgLy8gLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgcnVubG9nIGVuZHBvaW50YC4gV2hlbiBhd2FpdGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGRhdGEgKGRlY29kZWQgZnJvbSBKU09OKSB0aGUgc2VydmVyIHNlbnQgYmFjay5cbiAgICBhc3luYyBsb2dSdW5FdmVudChldmVudEluZm8pIHtcbiAgICAgICAgbGV0IHBvc3RfcHJvbWlzZSA9IFwiZG9uZVwiO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudEluZm8uY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTYXZlIHx8IFwidG9fc2F2ZVwiIGluIGV2ZW50SW5mbyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zYXZlX2NvZGUgPSBcIlRydWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGV2ZW50SW5mby5lcnJpbmZvICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZXJyaW5mbyA9IGV2ZW50SW5mby5lcnJpbmZvLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmxvZ0xldmVsID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9ydW5sb2dgLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChgRmFpbGVkIHRvIHNhdmUgeW91ciBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXMgaXMgJHtyZXNwb25zZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UuZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDRcbiAgICAgICAgICAgICAgICAgICAgKX1gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEaWQgbm90IHNhdmUgdGhlIGNvZGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlLmRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDRcbiAgICAgICAgICAgICAgICAgICAgICAgICl9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgXCIgKyBKU09OLnN0cmluZ2lmeShldmVudEluZm8pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9wcm9taXNlO1xuICAgIH1cbiAgICAvKiBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZVxuICAgICoqV0FSTklORzoqKiAgRE8gTk9UIGBhd2FpdGAgdGhpcyBmdW5jdGlvbiFcbiAgICBUaGlzIGZ1bmN0aW9uLCBhbHRob3VnaCBhc3luYywgZG9lcyBub3QgZXhwbGljaXRseSByZXNvbHZlIGl0cyBwcm9taXNlIGJ5IHJldHVybmluZyBhIHZhbHVlLiAgVGhlIHJlYXNvbiBmb3IgdGhpcyBpcyBiZWNhdXNlIGl0IGlzIGNhbGxlZCBieSB0aGUgY29uc3RydWN0b3IgZm9yIG5lYXJseSBldmVyeSBjb21wb25lbnQuICBJbiBKYXZhc2NyaXB0IGNvbnN0cnVjdG9ycyBjYW5ub3QgYmUgYXN5bmMhXG5cbiAgICBPbmUgb2YgdGhlIHJlY29tbWVuZGVkIHdheXMgdG8gaGFuZGxlIHRoZSBhc3luYyByZXF1aXJlbWVudHMgZnJvbSB3aXRoaW4gYSBjb25zdHJ1Y3RvciBpcyB0byB1c2UgYW4gYXR0cmlidXRlIGFzIGEgcHJvbWlzZSBhbmQgcmVzb2x2ZSB0aGF0IGF0dHJpYnV0ZSBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZS5cbiAgICAqL1xuICAgIGFzeW5jIGNoZWNrU2VydmVyKFxuICAgICAgICAvLyBBIHN0cmluZyBzcGVjaWZ5aW5nIHRoZSBldmVudCBuYW1lIHRvIHVzZSBmb3IgcXVlcnlpbmcgdGhlIDpyZWY6YGdldEFzc2Vzc1Jlc3VsdHNgIGVuZHBvaW50LlxuICAgICAgICBldmVudEluZm8sXG4gICAgICAgIC8vIElmIHRydWUsIHRoaXMgZnVuY3Rpb24gd2lsbCBpbnZva2UgYGBpbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKWBgIGp1c3QgYmVmb3JlIGl0IHJldHVybnMuIFRoaXMgaXMgcHJvdmlkZWQgc2luY2UgbW9zdCBjb21wb25lbnRzIGFyZSByZWFkeSBhZnRlciB0aGlzIGZ1bmN0aW9uIGNvbXBsZXRlcyBpdHMgd29yay5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVE9ETzogVGhpcyBkZWZhdWx0cyB0byBmYWxzZSwgdG8gYXZvaWQgY2F1c2luZyBwcm9ibGVtcyB3aXRoIGFueSBjb21wb25lbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIHVwZGF0ZWQgYW5kIHRlc3RlZC4gQWZ0ZXIgYWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYmVlbiB1cGRhdGVkLCBkZWZhdWx0IHRoaXMgdG8gdHJ1ZSBhbmQgcmVtb3ZlIHRoZSBleHRyYSBwYXJhbWV0ZXIgZnJvbSBtb3N0IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgIHdpbGxfYmVfcmVhZHkgPSBmYWxzZVxuICAgICkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VydmVyIGhhcyBzdG9yZWQgYW5zd2VyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgc2VsZi5jc3Jlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzIHx8IHRoaXMuZ3JhZGVyYWN0aXZlKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgICAgIGRhdGEuZXZlbnQgPSBldmVudEluZm87XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUgJiYgdGhpcy5kZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVhZGxpbmUgPSB0aGlzLmRlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEucmF3ZGVhZGxpbmUgPSB0aGlzLnJhd2RlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEudHpvZmYgPSB0aGlzLnR6b2ZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zaWQgPSB0aGlzLnNpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGRhdGEuZGl2X2lkICYmIGRhdGEuY291cnNlICYmIGRhdGEuZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBBIHJlcXVpcmVkIGZpZWxkIGlzIG1pc3NpbmcgZGF0YSAke2RhdGEuZGl2X2lkfToke2RhdGEuY291cnNlfToke2RhdGEuZXZlbnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgTk9UIGluIHByYWN0aWNlIG1vZGUgYW5kIHdlIGFyZSBub3QgaW4gYSBwZWVyIGV4ZXJjaXNlXG4gICAgICAgICAgICAvLyBhbmQgYXNzZXNzbWVudFRha2VuIGlzIHRydWVcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhZUJvb2tDb25maWcucHJhY3RpY2VfbW9kZSAmJlxuICAgICAgICAgICAgICAgICFlQm9va0NvbmZpZy5wZWVyICYmXG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW5cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L3Jlc3VsdHNgLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlc3BvbnNlIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYERhdGEgZnJvbSBzZXJ2ZXI6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9IGNhbGxpbmcgcmVwb3B1bGF0ZUZyb21TdG9yYWdlYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcG9wdWxhdGVGcm9tU3RvcmFnZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5jb3JyZWN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYHJlc29sdmluZyBjaGVja1NlcnZlciB3aXRoIHNlcnZlciBkYXRhYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJzZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgSFRUUCBFcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpOyAvLyBqdXN0IGdvIHJpZ2h0IHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGByZXNvbHZpbmcgY2hlY2tTZXJ2ZXIgd2l0aCBsb2NhbCBkYXRhYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJsb2NhbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKHt9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIG5vIGFuc3dlciBnaXZlbmApO1xuICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcIm5vdCB0YWtlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTsgLy8ganVzdCBnbyByaWdodCB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIHdpdGggbG9jYWwgZGF0YWApO1xuICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lsbF9iZV9yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBgYHRoaXMuY29tcG9uZW50RGl2YGAgcmVmZXJzIHRvIHRoZSBgYGRpdmBgIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudCwgYW5kIHRoYXQgdGhpcyBjb21wb25lbnQncyBJRCBpcyBzZXQuXG4gICAgaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCkge1xuICAgICAgICAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSB0aGUgY29tcG9uZW50IGlzIG5vdyByZWFkeS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1jb21wb25lbnQtcmVhZHlcIik7XG4gICAgICAgIC8vIFJlc29sdmUgdGhlIGBgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZWBgLlxuICAgICAgICB0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbigpO1xuICAgIH1cblxuICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZm9yIG1vc3QgY2xhc3NlcywgbG9hZERhdGEgZG9lc24ndCBkbyBhbnl0aGluZy4gQnV0IGZvciBQYXJzb25zLCBhbmQgcGVyaGFwcyBvdGhlcnMgaW4gdGhlIGZ1dHVyZSxcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gY2FuIGhhcHBlbiBldmVuIHdoZW4gdGhlcmUncyBubyBoaXN0b3J5IHRvIGJlIGxvYWRlZFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXBvcHVsYXRlRnJvbVN0b3JhZ2UgaXMgY2FsbGVkIGFmdGVyIGEgc3VjY2Vzc2Z1bCBBUEkgY2FsbCBpcyBtYWRlIHRvIGBgZ2V0QXNzZXNzUmVzdWx0c2BgIGluXG4gICAgICogdGhlIGNoZWNrU2VydmVyIG1ldGhvZCBpbiB0aGlzIGNsYXNzXG4gICAgICpcbiAgICAgKiBgYHJlc3RvcmVBbnN3ZXJzLGBgIGBgc2V0TG9jYWxTdG9yYWdlYGAgYW5kIGBgY2hlY2tMb2NhbFN0b3JhZ2VgYCBhcmUgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIG5lZWRlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgYW5zd2VyIGZvciBhIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7Kn0gc3RhdHVzIC0gdGhlIGh0dHAgc3RhdHVzXG4gICAgICogQHBhcmFtIHsqfSB3aGF0ZXZlciAtIGlnbm9yZWRcbiAgICAgKi9cbiAgICByZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSkge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciB0byB1c2UgdGhlIHNlcnZlcidzIGFuc3dlciAoaWYgdGhlcmUgaXMgb25lKSBvciB0byBsb2FkIGZyb20gc3RvcmFnZVxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSBcIm5vIGRhdGFcIiAmJiB0aGlzLnNob3VsZFVzZVNlcnZlcihkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG4gICAgc2hvdWxkVXNlU2VydmVyKGRhdGEpIHtcbiAgICAgICAgLy8gcmV0dXJucyB0cnVlIGlmIHNlcnZlciBkYXRhIGlzIG1vcmUgcmVjZW50IHRoYW4gbG9jYWwgc3RvcmFnZSBvciBpZiBzZXJ2ZXIgc3RvcmFnZSBpcyBjb3JyZWN0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gXCJUXCIgfHxcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHRoaXMuaXNUaW1lZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICBpZiAoZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdG9yZWREYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIC8vIGRlZmluaXRlbHkgZG9uJ3Qgd2FudCB0byB1c2UgbG9jYWwgc3RvcmFnZSBoZXJlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5hbnN3ZXIgPT0gc3RvcmVkRGF0YS5hbnN3ZXIpIHJldHVybiB0cnVlO1xuICAgICAgICBsZXQgc3RvcmFnZURhdGUgPSBuZXcgRGF0ZShzdG9yZWREYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIGxldCBzZXJ2ZXJEYXRlID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0ZSA+PSBzdG9yYWdlRGF0ZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBrZXkgd2hpY2ggdG8gYmUgdXNlZCB3aGVuIGFjY2Vzc2luZyBsb2NhbCBzdG9yYWdlLlxuICAgIGxvY2FsU3RvcmFnZUtleSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmVtYWlsICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmNvdXJzZSArXG4gICAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgICB0aGlzLmRpdmlkICtcbiAgICAgICAgICAgIFwiLWdpdmVuXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgYWRkQ2FwdGlvbihlbFR5cGUpIHtcbiAgICAgICAgLy9zb21lRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdFbGVtZW50LCBzb21lRWxlbWVudC5uZXh0U2libGluZyk7XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICB2YXIgY2FwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbl9sYWJlbCkge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlc1xuICAgICAgICAgICAgICAgICAgICA/IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn0gIDxzcGFuIGNsYXNzPVwicnVuZXN0b25lX2NhcHRpb25fZGl2aWRcIj4oJHt0aGlzLmRpdmlkfSk8L3NwYW4+YFxuICAgICAgICAgICAgICAgICAgICA6IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn1gOyAvLyBXaXRob3V0IHJ1bmVzdG9uZVxuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5odG1sKHRoaXMuY2FwdGlvbik7XG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmFkZENsYXNzKGAke2VsVHlwZX1fY2FwdGlvbmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGNhcHRpb24gYmFzZWQgb24gd2hldGhlciBSdW5lc3RvbmUgc2VydmljZXMgaGF2ZSBiZWVuIGRldGVjdGVkXG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuY2FwdGlvbiArIFwiIChcIiArIHRoaXMuZGl2aWQgKyBcIilcIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmNhcHRpb25cbiAgICAgICAgICAgICAgICApOyAvLyBXaXRob3V0IHJ1bmVzdG9uZVxuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5hZGRDbGFzcyhgJHtlbFR5cGV9X2NhcHRpb25gKTtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuYWRkQ2xhc3MoYCR7ZWxUeXBlfV9jYXB0aW9uX3RleHRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FwRGl2ID0gY2FwRGl2O1xuICAgICAgICAgICAgLy90aGlzLm91dGVyRGl2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhcERpdiwgdGhpcy5vdXRlckRpdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjYXBEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzVXNlckFjdGl2aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Fuc3dlcmVkO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGNoZWNrQ3VycmVudEFuc3dlclwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGxvZ0N1cnJlbnRBbnN3ZXJcIlxuICAgICAgICApO1xuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIHJlbmRlckZlZWRiYWNrXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgZGlzYWJsZUludGVyYWN0aW9uXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06ICR7dGhpcy5kaXZpZH1gO1xuICAgIH1cblxuICAgIHF1ZXVlTWF0aEpheChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBNYXRoSmF4ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0tIE1hdGhKYXggaXMgbm90IGxvYWRlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZWUgLSBodHRwczovL2RvY3MubWF0aGpheC5vcmcvZW4vbGF0ZXN0L2FkdmFuY2VkL3R5cGVzZXQuaHRtbFxuICAgICAgICAgICAgLy8gUGVyIHRoZSBhYm92ZSB3ZSBzaG91bGQga2VlcCB0cmFjayBvZiB0aGUgcHJvbWlzZXMgYW5kIG9ubHkgY2FsbCB0aGlzXG4gICAgICAgICAgICAvLyBhIHNlY29uZCB0aW1lIGlmIGFsbCBwcmV2aW91cyBwcm9taXNlcyBoYXZlIHJlc29sdmVkLlxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgcXVldWUgb2YgY29tcG9uZW50c1xuICAgICAgICAgICAgLy8gc2hvdWxkIHdhaXQgdW50aWwgZGVmYXVsdFBhZ2VSZWFkeSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAvLyBJZiBkZWZhdWx0UGFnZVJlYWR5IGlzIG5vdCBkZWZpbmVkIHRoZW4ganVzdCBlbnF1ZXVlIHRoZSBjb21wb25lbnRzLlxuICAgICAgICAgICAgLy8gT25jZSBkZWZhdWx0UGFnZVJlYWR5IGlzIGRlZmluZWRcbiAgICAgICAgICAgIC8vIHRoZSB3aW5kb3cucnVuZXN0b25lTWF0aFJlYWR5IHByb21pc2Ugd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGVcbiAgICAgICAgICAgIC8vIGluaXRpYWwgdHlwZXNldHRpbmcgaXMgY29tcGxldGUuXG4gICAgICAgICAgICBpZiAoTWF0aEpheC50eXBlc2V0UHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LnJ1bmVzdG9uZU1hdGhSZWFkeSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJ1bmVzdG9uZU1hdGhSZWFkeS50aGVuKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1qcmVzb2x2ZXIodGhpcy5hUXVldWUuZW5xdWV1ZShjb21wb25lbnQpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1qcmVzb2x2ZXIodGhpcy5hUXVldWUuZW5xdWV1ZShjb21wb25lbnQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBXYWl0aW5nIG9uIE1hdGhKYXghISAke01hdGhKYXgudHlwZXNldFByb21pc2V9YCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnF1ZXVlTWF0aEpheChjb21wb25lbnQpLCAyMDApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZXR1cm5pbmcgbWpyZWFkeSBwcm9taXNlOiAke3RoaXMubWpSZWFkeX1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5talJlYWR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjb3JhdGVTdGF0dXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcucGVlcikgcmV0dXJuO1xuICAgICAgICBsZXQgcnNEaXYgPSAkKHRoaXMuY29udGFpbmVyRGl2KS5jbG9zZXN0KFwiZGl2LnJ1bmVzdG9uZVwiKVswXTtcbiAgICAgICAgaWYgKCFyc0RpdikgcmV0dXJuO1xuICAgICAgICByc0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwibm90QW5zd2VyZWRcIik7XG4gICAgICAgIHJzRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJpc0luQ29ycmVjdFwiKTtcbiAgICAgICAgcnNEaXYuY2xhc3NMaXN0LnJlbW92ZShcImlzQ29ycmVjdFwiKTtcbiAgICAgICAgbGV0IGFzc2lnbm1lbnRJbmZvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oYGN1cnJlbnRBc3NpZ25tZW50SW5mb18ke2VCb29rQ29uZmlnLmNvdXJzZX1gKTtcbiAgICAgICAgbGV0IHF1ZXN0aW9ucyA9IFtdO1xuICAgICAgICBpZiAoYXNzaWdubWVudEluZm8pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9ucyA9IEpTT04ucGFyc2UoYXNzaWdubWVudEluZm8pLnF1ZXN0aW9uc1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWVzdGlvbnMuaW5kZXhPZih0aGlzLmRpdmlkKSA+PSAwKSB7XG4gICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNBc3NpZ25lZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNDb3JyZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29ycmVjdCA9PT0gbnVsbCB8fCB0eXBlb2YgdGhpcy5jb3JyZWN0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcIm5vdEFuc3dlcmVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNJbkNvcnJlY3RcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEluc3BpcmF0aW9uIGFuZCBsb3RzIG9mIGNvZGUgZm9yIHRoaXMgc29sdXRpb24gY29tZSBmcm9tXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MzU0MDM0OC9qcy1hc3luYy1hd2FpdC10YXNrcy1xdWV1ZVxuLy8gVGhlIGlkZWEgaGVyZSBpcyB0aGF0IHVudGlsIE1hdGhKYXggaXMgcmVhZHkgd2UgY2FuIGp1c3QgZW5xdWV1ZSB0aGluZ3Ncbi8vIG9uY2UgbWF0aGpheCBiZWNvbWVzIHJlYWR5IHRoZW4gd2UgY2FuIGRyYWluIHRoZSBxdWV1ZSBhbmQgY29udGludWUgYXMgdXN1YWwuXG5cbmNsYXNzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSBbXTtcbiAgICB9XG4gICAgZW5xdWV1ZShpdGVtKSB7XG4gICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goaXRlbSk7XG4gICAgfVxuICAgIGRlcXVldWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5zaGlmdCgpO1xuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICB9XG59XG5cbmNsYXNzIEF1dG9RdWV1ZSBleHRlbmRzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBlbnF1ZXVlKGNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc3VwZXIuZW5xdWV1ZSh7IGNvbXBvbmVudCwgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgICAgICAgICAgdGhpcy5kZXF1ZXVlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcXVldWUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wZW5kaW5nUHJvbWlzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGxldCBpdGVtID0gc3VwZXIuZGVxdWV1ZSgpO1xuXG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgcXEgPSB0aGlzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgcGF5bG9hZCA9IGF3YWl0IHdpbmRvdy5ydW5lc3RvbmVNYXRoUmVhZHlcbiAgICAgICAgICAgICAgICAudGhlbihhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYE1hdGhKYXggUmVhZHkgLS0gZGVxdWVpbmcgYSB0eXBlc2V0dGluZyBydW4gZm9yICR7aXRlbS5jb21wb25lbnQuaWR9ICR7cXEucHJlYW1ibGU/LmlubmVySFRNTH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChxcS5wcmVhbWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgTWF0aEpheC50eXBlc2V0UHJvbWlzZShbcXEucHJlYW1ibGVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIGluc2VydEFkamFjZW50RWxlbWVudCB0byBwcmVzZXJ2ZSBleGlzdGluZyBET00gZWxlbWVudHMgYW5kIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBvdmVyd3JpdGluZyBpbm5lckhUTUwgd2hpY2ggZGVzdHJveXMgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmVhbWJsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVhbWJsZURpdi5pbm5lckhUTUwgPSBxcS5wcmVhbWJsZS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbXBvbmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIHByZWFtYmxlRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBNYXRoSmF4IHR5cGVzZXQgdGhlIHByZWFtYmxlIGZvciAke2l0ZW0uY29tcG9uZW50LmlkfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgTWF0aEpheC50eXBlc2V0UHJvbWlzZShbaXRlbS5jb21wb25lbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBNYXRoSmF4LnR5cGVzZXRQcm9taXNlKFtpdGVtLmNvbXBvbmVudF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICBpdGVtLnJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICBpdGVtLnJlamVjdChlKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIGl0ZW1zIGluIHRoZSBxdWV1ZSwgY29udGludWUgcHJvY2Vzc2luZyB0aGVtXG4gICAgICAgICAgICB0aGlzLmRlcXVldWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxud2luZG93LlJ1bmVzdG9uZUJhc2UgPSBSdW5lc3RvbmVCYXNlO1xuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIEEgZnJhbWV3b3JrIGFsbG93aW5nIGEgUnVuZXN0b25lIGNvbXBvbmVudCB0byBsb2FkIG9ubHkgdGhlIEpTIGl0IG5lZWRzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhlIEphdmFTY3JpcHQgcmVxdWlyZWQgYnkgYWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGlzIHF1aXRlIGxhcmdlIGFuZCByZXN1bHRzIGluIHNsb3cgcGFnZSBsb2Fkcy4gVGhpcyBhcHByb2FjaCBlbmFibGVzIGEgUnVuZXN0b25lIGNvbXBvbmVudCB0byBsb2FkIG9ubHkgdGhlIEphdmFTY3JpcHQgaXQgbmVlZHMsIHJhdGhlciB0aGFuIGxvYWRpbmcgSmF2YVNjcmlwdCBmb3IgYWxsIHRoZSBjb21wb25lbnRzIHJlZ2FyZGxlc3Mgb2Ygd2hpY2ggYXJlIGFjdHVhbGx5IHVzZWQuXG4vL1xuLy8gVG8gYWNjb21wbGlzaCB0aGlzLCB3ZWJwYWNrJ3Mgc3BsaXQtY2h1bmtzIGFiaWxpdHkgYW5hbHl6ZXMgYWxsIEpTLCBzdGFydGluZyBmcm9tIHRoaXMgZmlsZS4gVGhlIGR5bmFtaWMgaW1wb3J0cyBiZWxvdyBhcmUgdHJhbnNmb3JtZWQgYnkgd2VicGFjayBpbnRvIHRoZSBkeW5hbWljIGZldGNoZXMgb2YganVzdCB0aGUgSlMgcmVxdWlyZWQgYnkgZWFjaCBmaWxlIGFuZCBhbGwgaXRzIGRlcGVuZGVuY2llcy4gKElmIHVzaW5nIHN0YXRpYyBpbXBvcnRzLCB3ZWJwYWNrIHdpbGwgYXNzdW1lIHRoYXQgYWxsIGZpbGVzIGFyZSBhbHJlYWR5IHN0YXRpY2FsbHkgbG9hZGVkIHZpYSBzY3JpcHQgdGFncywgZGVmZWF0aW5nIHRoZSBwdXJwb3NlIG9mIHRoaXMgZnJhbWV3b3JrLilcbi8vXG4vLyBIb3dldmVyLCB0aGlzIGFwcHJvYWNoIGxlYWRzIHRvIGNvbXBsZXhpdHk6XG4vL1xuLy8gLSAgICBUaGUgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSBvZiBlYWNoIGNvbXBvbmVudCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBrZXlzIG9mIHRoZSBgYG1vZHVsZV9tYXBgYCBiZWxvdy5cbi8vIC0gICAgVGhlIHZhbHVlcyBpbiB0aGUgYGBtb2R1bGVfbWFwYGAgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgSmF2YVNjcmlwdCBmaWxlcyB3aGljaCBpbXBsZW1lbnQgZWFjaCBvZiB0aGUgY29tcG9uZW50cy5cblxuLy8gU3RhdGljIGltcG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBUaGVzZSBpbXBvcnRzIGFyZSAod2UgYXNzdW1lKSBuZWVkZWQgYnkgYWxsIHBhZ2VzLiBIb3dldmVyLCBpdCB3b3VsZCBiZSBtdWNoIGJldHRlciB0byBsb2FkIHRoZXNlIGluIHRoZSBtb2R1bGVzIHRoYXQgYWN0dWFsbHkgdXNlIHRoZW0uXG4vL1xuLy8gVGhlc2UgYXJlIHN0YXRpYyBpbXBvcnRzOyBjb2RlIGluIGBkeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50c2BfIGRlYWxzIHdpdGggZHluYW1pYyBpbXBvcnRzLlxuLy9cbi8vIGpRdWVyeS1yZWxhdGVkIGltcG9ydHMuXG5pbXBvcnQgXCJqcXVlcnktdWkvanF1ZXJ5LXVpLmpzXCI7XG5pbXBvcnQgXCJqcXVlcnktdWkvdGhlbWVzL2Jhc2UvanF1ZXJ5LnVpLmFsbC5jc3NcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnkuaWRsZS10aW1lci5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5iaWRpLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5X2kxOG4vanF1ZXJ5LmkxOG4uZW1pdHRlci5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmZhbGxiYWNrcy5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLm1lc3NhZ2VzdG9yZS5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLnBhcnNlci5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL2pxdWVyeV9pMThuL2pxdWVyeS5pMThuLmxhbmd1YWdlLmpzXCI7XG5cbi8vIEJvb3RzdHJhcCAtIG5vdCBuZWVkZWQgZm9yIHB4eCBkZXZlbG9wbWVudFxuaW1wb3J0IFwiYm9vdHN0cmFwL2Rpc3QvanMvYm9vdHN0cmFwLmpzXCI7XG5cbi8vIGNvbW1vbiBzdHlsZXMgY29tZSBmcm9tIGhlcmVcbmltcG9ydCBcIi4vcHR4cnMtYm9vdHN0cmFwLmxlc3NcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9wcm9qZWN0X3RlbXBsYXRlL190ZW1wbGF0ZXMvcGx1Z2luX2xheW91dHMvc3BoaW54X2Jvb3RzdHJhcC9zdGF0aWMvYm9vdHN0cmFwLXNwaGlueC5qc1wiO1xuXG4vLyBNaXNjXG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvYm9va2Z1bmNzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvdXNlci1oaWdobGlnaHRzLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJldGV4dC5qc1wiO1xuXG5cbi8vIFRoZXNlIGFyZSBvbmx5IG5lZWRlZCBmb3IgdGhlIFJ1bmVzdG9uZSBib29rLCBidXQgbm90IGluIGEgbGlicmFyeSBtb2RlIChzdWNoIGFzIHByZXRleHQpLiBJIHdvdWxkIHByZWZlciB0byBkeW5hbWljYWxseSBsb2FkIHRoZW0uIEhvd2V2ZXIsIHRoZXNlIHNjcmlwdHMgYXJlIHNvIHNtYWxsIEkgaGF2ZW4ndCBib3RoZXJlZCB0byBkbyBzby5cbmltcG9ydCB7IGdldFN3aXRjaCwgc3dpdGNoVGhlbWUgfSBmcm9tIFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3RoZW1lLmpzXCI7XG5pbXBvcnQgXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcHJlc2VudGVyX21vZGUubGVzc1wiO1xuaW1wb3J0IHsgcmVuZGVyT25lQ29tcG9uZW50IH0gZnJvbSBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9yZW5kZXJDb21wb25lbnQuanNcIjtcbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZS9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgU3BsaWNlV3JhcHBlciB9IGZyb20gXCIuL3J1bmVzdG9uZS9zcGxpY2UvanMvc3BsaWNlV3JhcHBlci50c1wiO1xuXG4vLyBEeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRoaXMgcHJvdmlkZXMgYSBsaXN0IG9mIG1vZHVsZXMgdGhhdCBjb21wb25lbnRzIGNhbiBkeW5hbWljYWxseSBpbXBvcnQuIFdlYnBhY2sgd2lsbCBjcmVhdGUgYSBsaXN0IG9mIGltcG9ydHMgZm9yIGVhY2ggYmFzZWQgb24gaXRzIGFuYWx5c2lzLlxuY29uc3QgbW9kdWxlX21hcCA9IHtcbiAgICAvLyBXcmFwIGVhY2ggaW1wb3J0IGluIGEgZnVuY3Rpb24sIHNvIHRoYXQgaXQgd29uJ3Qgb2NjdXIgdW50aWwgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZC4gV2hpbGUgc29tZXRoaW5nIGNsZWFuZXIgd291bGQgYmUgbmljZSwgd2VicGFjayBjYW4ndCBhbmFseXplIHRoaW5ncyBsaWtlIGBgaW1wb3J0KGV4cHJlc3Npb24pYGAuXG4gICAgLy9cbiAgICAvLyBUaGUga2V5cyBtdXN0IG1hdGNoIHRoZSB2YWx1ZSBvZiBlYWNoIGNvbXBvbmVudCdzIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUgLS0gdGhlIGBgcnVuZXN0b25lX2ltcG9ydGBgIGFuZCBgYHJ1bmVzdG9uZV9hdXRvX2ltcG9ydGBgIGZ1bmN0aW9ucyBhc3N1bWUgdGhpcy5cbiAgICBhY3RpdmVjb2RlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9hY3RpdmVjb2RlL2pzL2FjZmFjdG9yeS5qc1wiKSxcbiAgICAvLyBBbHdheXMgaW1wb3J0IHRoZSB0aW1lZCB2ZXJzaW9uIG9mIGEgY29tcG9uZW50IGlmIGF2YWlsYWJsZSwgc2luY2UgdGhlIHRpbWVkIGNvbXBvbmVudHMgYWxzbyBkZWZpbmUgdGhlIGNvbXBvbmVudCdzIGZhY3RvcnkgYW5kIGluY2x1ZGUgdGhlIGNvbXBvbmVudCBhcyB3ZWxsLiBOb3RlIHRoYXQgYGBhY2ZhY3RvcnlgYCBpbXBvcnRzIHRoZSB0aW1lZCBjb21wb25lbnRzIG9mIEFjdGl2ZUNvZGUsIHNvIGl0IGZvbGxvd3MgdGhpcyBwYXR0ZXJuLlxuICAgIGNsaWNrYWJsZWFyZWE6ICgpID0+XG4gICAgICAgIGltcG9ydChcIi4vcnVuZXN0b25lL2NsaWNrYWJsZUFyZWEvanMvdGltZWRjbGlja2FibGUuanNcIiksXG4gICAgY29kZWxlbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2NvZGVsZW5zL2pzL2NvZGVsZW5zLmpzXCIpLFxuICAgIGRhdGFmaWxlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9kYXRhZmlsZS9qcy9kYXRhZmlsZS5qc1wiKSxcbiAgICBkcmFnbmRyb3A6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy90aW1lZGRuZC5qc1wiKSxcbiAgICBmaWxsaW50aGVibGFuazogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZml0Yi9qcy90aW1lZGZpdGIuanNcIiksXG4gICAgZ3JvdXBzdWI6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2dyb3Vwc3ViL2pzL2dyb3Vwc3ViLmpzXCIpLFxuICAgIG1hdGNoaW5nOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tYXRjaGluZy9qcy9tYXRjaGluZy5qc1wiKSxcbiAgICBtdWx0aXBsZWNob2ljZTogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvbWNob2ljZS9qcy90aW1lZG1jLmpzXCIpLFxuICAgIGhwYXJzb25zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9ocGFyc29ucy9qcy9ocGFyc29ucy5qc1wiKSxcbiAgICBwYXJzb25zOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qc1wiKSxcbiAgICBwb2xsOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9wb2xsL2pzL3BvbGwuanNcIiksXG4gICAgc2VsZWN0cXVlc3Rpb246ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3NlbGVjdHF1ZXN0aW9uL2pzL3NlbGVjdG9uZS5qc1wiKSxcbiAgICBzaG9ydGFuc3dlcjogKCkgPT5cbiAgICAgICAgaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvanMvdGltZWRfc2hvcnRhbnN3ZXIuanNcIiksXG4gICAgc2hvd2V2YWw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3Nob3dldmFsL2pzL3Nob3dFdmFsLmpzXCIpLFxuICAgIHRhYmJlZFN0dWZmOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS90YWJiZWRTdHVmZi9qcy90YWJiZWRzdHVmZi5qc1wiKSxcbiAgICB0aW1lZEFzc2Vzc21lbnQ6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RpbWVkL2pzL3RpbWVkLmpzXCIpLFxuICAgIC8vIFRPRE86IHNpbmNlIHRoaXMgaXNuJ3QgaW4gYSBgYGRhdGEtY29tcG9uZW50YGAsIG5lZWQgdG8gdHJpZ2dlciBhbiBpbXBvcnQgb2YgdGhpcyBjb2RlIG1hbnVhbGx5LlxuICAgIHdlYndvcms6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3dlYndvcmsvanMvd2Vid29yay5qc1wiKSxcbiAgICB5b3V0dWJlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS92aWRlby9qcy9ydW5lc3RvbmV2aWRlby5qc1wiKSxcbiAgICBkb2VuZXQ6ICgpID0+IFByb21pc2UucmVzb2x2ZSgpLCAvLyBEb2VuZXQgaXMgbG9hZGVkIHNlcGFyYXRlbHlcbn07XG5cbmNvbnN0IG1vZHVsZV9tYXBfY2FjaGUgPSB7fTtcbmNvbnN0IFFVRVVFX0ZMVVNIX1RJTUVfTVMgPSAxMDtcbmNvbnN0IHF1ZXVlID0gW107XG5sZXQgcXVldWVMYXN0Rmx1c2ggPSAwO1xuLyoqXG4gKiBRdWV1ZSBpbXBvcnRzIHRoYXQgYXJlIHJlcXVlc3RlZCB3aXRoaW4gYFFVRVVFX0ZMVVNIX1RJTUVfTVNgIG9mIGVhY2ggb3RoZXIuXG4gKiBBbGwgc3VjaCBpbXBvcnRzIGFyZSBpbXBvcnRlZCBhdCBvbmNlLCBhbmQgdGhlbiBhIHByb21pc2UgaXMgZmlyZWQgYWZ0ZXIgYWxsXG4gKiB0aGUgaW1wb3J0cyBpbiB0aGUgcXVldWUgd2luZG93IGhhdmUgY29tcGxldGVkLlxuICovXG5mdW5jdGlvbiBxdWV1ZUltcG9ydChjb21wb25lbnRfbmFtZSkge1xuICAgIGxldCByZXNvbHZlID0gbnVsbDtcbiAgICBsZXQgcmVqZWN0ID0gbnVsbDtcbiAgICBjb25zdCByZXRQcm9taXNlID0gbmV3IFByb21pc2UoKHIsIHJlaikgPT4ge1xuICAgICAgICByZXNvbHZlID0gcjtcbiAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgIH0pO1xuICAgIGNvbnN0IGl0ZW0gPSB7IGNvbXBvbmVudF9uYW1lLCByZXNvbHZlLCByZWplY3QgfTtcbiAgICBxdWV1ZS5wdXNoKGl0ZW0pO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZsdXNoUXVldWUsIFFVRVVFX0ZMVVNIX1RJTUVfTVMgKyAxKTtcblxuICAgIHJldHVybiByZXRQcm9taXNlO1xufVxuYXN5bmMgZnVuY3Rpb24gZmx1c2hRdWV1ZSgpIHtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKERhdGUubm93KCkgLSBxdWV1ZUxhc3RGbHVzaCA8IFFVRVVFX0ZMVVNIX1RJTUVfTVMpIHtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZmx1c2hRdWV1ZSwgUVVFVUVfRkxVU0hfVElNRV9NUyArIDEpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIElmIHdlIG1hZGUgaXQgaGVyZSwgaXQgaGFzIGJlZW4gYXQgbGVhc3QgUVVFVUVfRkxVU0hfVElNRV9NUyBzaW5jZVxuICAgIC8vIHRoZSBsYXN0IHRpbWUgd2UgZmx1c2hlZCB0aGUgcXVldWUuIFRoZXJlZm9yZSwgd2Ugc2hvdWxkIHN0YXJ0IGZsdXNoaW5nLlxuICAgIC8vIFdlIGNvcHkgZXZlcnl0aGluZyB3ZSBmbHVzaCBhbmQgZW1wdHkgdGhlIGFycmF5IGZpcnN0LlxuICAgIHF1ZXVlTGFzdEZsdXNoID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB0b0ZsdXNoID0gWy4uLnF1ZXVlXTtcbiAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIldlYnBhY2sgaXMgc3RhcnRpbmcgdGhlIGxvYWRpbmcgcHJvY2VzcyBmb3IgdGhlIGZvbGxvd2luZyBSdW5lc3RvbmUgbW9kdWxlc1wiLFxuICAgICAgICB0b0ZsdXNoLm1hcCgoaXRlbSkgPT4gaXRlbS5jb21wb25lbnRfbmFtZSlcbiAgICApO1xuICAgIGNvbnN0IGZsdXNoZWRQcm9taXNlID0gdG9GbHVzaC5tYXAoYXN5bmMgKGl0ZW0pID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IG1vZHVsZV9tYXBbaXRlbS5jb21wb25lbnRfbmFtZV0oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBSdW5lc3RvbmUgY29tcG9uZW50ICR7aXRlbS5jb21wb25lbnRfbmFtZX0gaGFzIGJlZW4gbG9hZGVkYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpdGVtLnJlamVjdChlKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGZsdXNoZWQgPSBhd2FpdCBQcm9taXNlLmFsbChmbHVzaGVkUHJvbWlzZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgZmx1c2hlZC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIGl0ZW0ucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxufVxuXG4vLyAuLiBfZHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5OlxuLy9cbi8vIER5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBGdWxmaWxsIGEgcHJvbWlzZSB3aGVuIHRoZSBSdW5lc3RvbmUgcHJlLWxvZ2luIGNvbXBsZXRlIGV2ZW50IG9jY3Vycy5cbmxldCBwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgICQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiLCByZXNvbHZlKVxuKTtcbmxldCBsb2FkZWRDb21wb25lbnRzO1xuLy8gUHJvdmlkZSBhIHNpbXBsZSBmdW5jdGlvbiB0byBpbXBvcnQgdGhlIEpTIGZvciBhbGwgY29tcG9uZW50cyBvbiB0aGUgcGFnZS5cbmV4cG9ydCBmdW5jdGlvbiBydW5lc3RvbmVfYXV0b19pbXBvcnQoKSB7XG4gICAgLy8gQ3JlYXRlIGEgc2V0IG9mIGBgZGF0YS1jb21wb25lbnRgYCB2YWx1ZXMsIHRvIGF2b2lkIGR1cGxpY2F0aW9uLlxuICAgIGNvbnN0IHMgPSBuZXcgU2V0KFxuICAgICAgICAvLyBBbGwgUnVuZXN0b25lIGNvbXBvbmVudHMgaGF2ZSBhIGBgZGF0YS1jb21wb25lbnRgYCBhdHRyaWJ1dGUuXG4gICAgICAgICQoXCJbZGF0YS1jb21wb25lbnRdXCIpXG4gICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgIC8vIEV4dHJhY3QgdGhlIHZhbHVlIG9mIHRoZSBkYXRhLWNvbXBvbmVudCBhdHRyaWJ1dGUuXG4gICAgICAgICAgICAgICAgKGluZGV4LCBlbGVtZW50KSA9PiAkKGVsZW1lbnQpLmF0dHIoXCJkYXRhLWNvbXBvbmVudFwiKVxuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBmcm9tIGEgalF1ZXJ5IG9iamVjdCBiYWNrIHRvIGFuIGFycmF5LCBwYXNzaW5nIHRoYXQgdG8gdGhlIFNldCBjb25zdHJ1Y3Rvci5cbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5nZXQoKVxuICAgICk7XG4gICAgLy8gd2Vid29yayBxdWVzdGlvbnMgYXJlIG5vdCB3cmFwcGVkIGluIGRpdiB3aXRoIGEgZGF0YS1jb21wb25lbnQgc28gd2UgaGF2ZSB0byBjaGVjayBhIGRpZmZlcmVudCB3YXlcbiAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53ZWJ3b3JrLWJ1dHRvblwiKSkge1xuICAgICAgICBzLmFkZChcIndlYndvcmtcIik7XG4gICAgfVxuXG4gICAgLy8gTG9hZCBKUyBmb3IgZWFjaCBvZiB0aGUgY29tcG9uZW50cyBmb3VuZC5cbiAgICBjb25zdCBhID0gWy4uLnNdLm1hcCgodmFsdWUpID0+IHtcbiAgICAgICAgbGV0IHo7XG4gICAgICAgIGNvbnNvbGUubG9nKGBMb2FkaW5nIFJ1bmVzdG9uZSBjb21wb25lbnQ6ICR7dmFsdWV9YCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB6ID0gKG1vZHVsZV9tYXBbdmFsdWVdIHx8ICgoKSA9PiBQcm9taXNlLnJlc29sdmUoKSkpKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGxvYWRpbmcgJHt2YWx1ZX06YCwgZSk7XG4gICAgICAgIH1cbiAgICAgICAgei5lcnJvciA9IChtc2cpID0+IGNvbnNvbGUuZXJyb3IoYEVycm9yIGluICR7dmFsdWV9OmAsIG1zZyk7XG4gICAgICAgIHJldHVybiB6O1xuICAgIH0pO1xuXG4gICAgLy8gU2VuZCB0aGUgUnVuZXN0b25lIGxvZ2luIGNvbXBsZXRlIGV2ZW50IHdoZW4gYWxsIEpTIGlzIGxvYWRlZCBhbmQgdGhlIHByZS1sb2dpbiBpcyBhbHNvIGNvbXBsZXRlLlxuICAgIFByb21pc2UuYWxsKFtwcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZSwgLi4uYV0pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIWRvY3VtZW50LmJvZHkuZGF0YXNldC5yZWFjdEluVXNlKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxucHJlX2xvZ2luX2NvbXBsZXRlX3Byb21pc2UudGhlbigoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJSdW5lc3RvbmUgcHJlLWxvZ2luIGNvbXBsZXRlXCIpO1xufSk7XG5cbi8vIExvYWQgY29tcG9uZW50IEpTIHdoZW4gdGhlIGRvY3VtZW50IGlzIHJlYWR5LlxuJChkb2N1bWVudCkucmVhZHkocnVuZXN0b25lX2F1dG9faW1wb3J0KTtcblxuLy8gUHJvdmlkZSBhIGZ1bmN0aW9uIHRvIGltcG9ydCBvbmUgc3BlY2lmaWMgYFJ1bmVzdG9uZWAgY29tcG9uZW50LlxuLy8gdGhlIGltcG9ydCBmdW5jdGlvbiBpbnNpZGUgbW9kdWxlX21hcCBpcyBhc3luYyAtLSBydW5lc3RvbmVfaW1wb3J0XG4vLyBzaG91bGQgYmUgYXdhaXRlZCB3aGVuIG5lY2Vzc2FyeSB0byBlbnN1cmUgdGhlIGltcG9ydCBjb21wbGV0ZXNcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5lc3RvbmVfaW1wb3J0KGNvbXBvbmVudF9uYW1lKSB7XG4gICAgaWYgKG1vZHVsZV9tYXBfY2FjaGVbY29tcG9uZW50X25hbWVdKSB7XG4gICAgICAgIHJldHVybiBtb2R1bGVfbWFwX2NhY2hlW2NvbXBvbmVudF9uYW1lXTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIGBSdW5lc3RvbmUgY29tcG9uZW50ICR7Y29tcG9uZW50X25hbWV9IGlzIGJlaW5nIHF1ZXVlZCBmb3IgaW1wb3J0YFxuICAgICk7XG4gICAgY29uc3QgcHJvbWlzZSA9IHF1ZXVlSW1wb3J0KGNvbXBvbmVudF9uYW1lKTtcbiAgICBtb2R1bGVfbWFwX2NhY2hlW2NvbXBvbmVudF9uYW1lXSA9IHByb21pc2U7XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHBvcHVwU2NyYXRjaEFDKCkge1xuICAgIC8vIGxvYWQgdGhlIGFjdGl2ZWNvZGUgYnVuZGxlXG4gICAgYXdhaXQgcnVuZXN0b25lX2ltcG9ydChcImFjdGl2ZWNvZGVcIik7XG4gICAgLy8gc2NyYXRjaERpdiB3aWxsIGJlIGRlZmluZWQgaWYgd2UgaGF2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBzY3JhdGNoXG4gICAgLy8gYWN0aXZlY29kZS4gIElmIGl0cyBub3QgZGVmaW5lZCB0aGVuIHdlIG5lZWQgdG8gZ2V0IGl0IHJlYWR5IHRvIHRvZ2dsZVxuICAgIGlmICghZUJvb2tDb25maWcuc2NyYXRjaERpdikge1xuICAgICAgICB3aW5kb3cuQUNGYWN0b3J5LmNyZWF0ZVNjcmF0Y2hBY3RpdmVjb2RlKCk7XG4gICAgICAgIGxldCBkaXZpZCA9IGVCb29rQ29uZmlnLnNjcmF0Y2hEaXY7XG4gICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZGl2aWRdID0gQUNGYWN0b3J5LmNyZWF0ZUFjdGl2ZUNvZGUoXG4gICAgICAgICAgICAkKGAjJHtkaXZpZH1gKVswXSxcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmFjRGVmYXVsdExhbmd1YWdlXG4gICAgICAgICk7XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXS5lbmFibGVTYXZlTG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuQUNGYWN0b3J5LnRvZ2dsZVNjcmF0Y2hBY3RpdmVjb2RlKCk7XG4gICAgfSwgMTAwKTtcbn1cblxuLy8gU2V0IHRoZSBkaXJlY3RvcnkgY29udGFpbmluZyB0aGlzIHNjcmlwdCBhcyB0aGUgYHBhdGggPGh0dHBzOi8vd2VicGFjay5qcy5vcmcvZ3VpZGVzL3B1YmxpYy1wYXRoLyNvbi10aGUtZmx5PmBfIGZvciBhbGwgd2VicGFja2VkIHNjcmlwdHMuXG5jb25zdCBzY3JpcHRfc3JjID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmM7XG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHNjcmlwdF9zcmMuc3Vic3RyaW5nKFxuICAgIDAsXG4gICAgc2NyaXB0X3NyYy5sYXN0SW5kZXhPZihcIi9cIikgKyAxXG4pO1xuXG52YXIgc3BsaWNlID0gbmV3IFNwbGljZVdyYXBwZXIoKTtcblxuLy8gTWFudWFsIGV4cG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBXZWJwYWNrJ3MgYGBvdXRwdXQubGlicmFyeWBgIHNldHRpbmcgZG9lc24ndCBzZWVtIHRvIHdvcmsgd2l0aCB0aGUgc3BsaXQgY2h1bmtzIHBsdWdpbjsgZG8gYWxsIGV4cG9ydHMgbWFudWFsbHkgdGhyb3VnaCB0aGUgYGB3aW5kb3dgYCBvYmplY3QgaW5zdGVhZC5cblxuY29uc3QgcmMgPSB7fTtcbnJjLnJ1bmVzdG9uZV9pbXBvcnQgPSBydW5lc3RvbmVfaW1wb3J0O1xucmMucnVuZXN0b25lX2F1dG9faW1wb3J0ID0gcnVuZXN0b25lX2F1dG9faW1wb3J0O1xucmMuZ2V0U3dpdGNoID0gZ2V0U3dpdGNoO1xucmMuc3dpdGNoVGhlbWUgPSBzd2l0Y2hUaGVtZTtcbnJjLnBvcHVwU2NyYXRjaEFDID0gcG9wdXBTY3JhdGNoQUM7XG5yYy5yZW5kZXJPbmVDb21wb25lbnQgPSByZW5kZXJPbmVDb21wb25lbnQ7XG53aW5kb3cuY29tcG9uZW50TWFwID0ge307XG53aW5kb3cucnVuZXN0b25lQ29tcG9uZW50cyA9IHJjO1xuIiwiLyoqXG4gKlxuICogVXNlcjogYm1pbGxlclxuICogT3JpZ2luYWw6IDIwMTEtMDQtMjBcbiAqIERhdGU6IDIwMTktMDYtMTRcbiAqIFRpbWU6IDI6MDEgUE1cbiAqIFRoaXMgY2hhbmdlIG1hcmtzIHRoZSBiZWdpbm5pbmcgb2YgdmVyc2lvbiA0LjAgb2YgdGhlIHJ1bmVzdG9uZSBjb21wb25lbnRzXG4gKiBMb2dpbi9sb2dvdXQgaXMgbm8gbG9uZ2VyIGhhbmRsZWQgdGhyb3VnaCBqYXZhc2NyaXB0IGJ1dCByYXRoZXIgc2VydmVyIHNpZGUuXG4gKiBNYW55IG9mIHRoZSBjb21wb25lbnRzIGRlcGVuZCBvbiB0aGUgcnVuZXN0b25lOmxvZ2luIGV2ZW50IHNvIHdlIHdpbGwga2VlcCB0aGF0XG4gKiBmb3Igbm93IHRvIGtlZXAgdGhlIGNodXJuIGZhaXJseSBtaW5pbWFsLlxuICovXG5cbi8qXG5cbiBDb3B5cmlnaHQgKEMpIDIwMTEgIEJyYWQgTWlsbGVyICBib25lbGFrZUBnbWFpbC5jb21cblxuIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG5cbiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuXG4gWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cblxuICovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IG1hcmtlZCB9IGZyb20gXCJtYXJrZWRcIjtcblxudmFyIHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcblxuLy9cbi8vIFBhZ2UgZGVjb3JhdGlvbiBmdW5jdGlvbnNcbi8vXG4vKlxuTWF5YmUgc29tZXRoaW5nIGxpa2UgdGhpcyBhdCB0aGUgdG9wOlxuXG5BY3RpdmUgYXNzaWdubWVudDogW0NoIDE1IHJlYWRpbmddICAgICAgW0V4aXQgYXNzaWdubWVudCBsaW5rXVxuT24gcGFnZSAoMyBvZiA3KSBbU2VsZWN0IGlucHV0IHNob3dpbmcgY3VycmVudCBwYWdlLCBjYW4gc2VsZWN0IG90aGVyc11cbkJlY29taW5nIHRoaXMgaWYgbm90IG9uIGEgcGFnZSBpbiBhc3NpZ25tZW50XG5cbkFjdGl2ZSBhc3NpZ25tZW50OiBbQ2ggMTUgcmVhZGluZ10gICAgICBbRXhpdCBhc3NpZ25tZW50IGxpbmtdXG5UaGlzIHBhZ2UgaXMgbm90IHBhcnQgb2YgdGhhdCBhc3NpZ25tZW50LiBTZWxlY3QgYSBwYWdlIHRvIHJldHVybiB0byBpdDpcbltTZWxlY3QgaW5wdXRdXG4qL1xuZnVuY3Rpb24gYWRkUmVhZGluZ0xpc3QoKSB7XG4gICAgbGV0IGFzc2lnbm1lbnRfaW5mb19zdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShgY3VycmVudEFzc2lnbm1lbnRJbmZvXyR7ZUJvb2tDb25maWcuY291cnNlfWApXG5cbiAgICBpZiAoYXNzaWdubWVudF9pbmZvX3N0cmluZyAmJiBlQm9va0NvbmZpZy5yZWFkaW5ncykge1xuICAgICAgICB2YXIgdG9wLCBib3R0b20sIGFjdGl2ZSwgcGFnZV9uYW1lLCBleGl0X2xpbmssIGZzdCwgc25kLCBuZXdfcG9zLCBwYXRoX3BhcnRzLCBuZXdfcG9zX2xpbms7XG4gICAgICAgIHZhciBhc3NpZ25tZW50X2luZm8gPSBKU09OLnBhcnNlKGFzc2lnbm1lbnRfaW5mb19zdHJpbmcpO1xuICAgICAgICBsZXQgYXNzaWdubWVudF9pZCA9IGFzc2lnbm1lbnRfaW5mby5pZDtcbiAgICAgICAgbGV0IGFzc2lnbm1lbnRfbmFtZSA9IGFzc2lnbm1lbnRfaW5mby5uYW1lO1xuICAgICAgICBsZXQgcmVhZGluZ19uYW1lcyA9IGFzc2lnbm1lbnRfaW5mby5yZWFkaW5nTmFtZXM7XG5cbiAgICAgICAgYWN0aXZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYWN0aXZlLnRleHRDb250ZW50ID0gXCJBY3RpdmUgYXNzaWdubWVudDogXCJcblxuICAgICAgICBwYWdlX25hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgcGFnZV9uYW1lLnRleHRDb250ZW50ID0gYXNzaWdubWVudF9uYW1lO1xuICAgICAgICBwYWdlX25hbWUuaHJlZiA9IGAvYXNzaWdubWVudC9zdHVkZW50L2RvQXNzaWdubWVudD9hc3NpZ25tZW50X2lkPSR7YXNzaWdubWVudF9pZH1gO1xuXG4gICAgICAgIGFjdGl2ZS5hcHBlbmQocGFnZV9uYW1lKTtcblxuICAgICAgICBleGl0X2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgZXhpdF9saW5rLnRleHRDb250ZW50ID0gXCIgRXhpdCBBc3NpZ25tZW50XCI7XG4gICAgICAgIGV4aXRfbGluay5ocmVmID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG4gICAgICAgIGV4aXRfbGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgY3VycmVudEFzc2lnbm1lbnRJbmZvXyR7ZUJvb2tDb25maWcuY291cnNlfWApO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL2FjdGl2ZS5hcHBlbmQoZXhpdF9saW5rKVxuXG4gICAgICAgIGxldCBjdXJfcGF0aF9wYXJ0cyA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdChcIi9cIik7XG4gICAgICAgIGxldCBuYW1lID1cbiAgICAgICAgICAgIGN1cl9wYXRoX3BhcnRzW2N1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIDJdICtcbiAgICAgICAgICAgIFwiL1wiICtcbiAgICAgICAgICAgIGN1cl9wYXRoX3BhcnRzW2N1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAvLyBpZiBib2R5IGhhcyBwcmV0ZXh0IGNsYXNzLCB0aGVuIHN0cmlwIHRoZSBsZWFkaW5nIHBhdGggcGFydHMgZnJvbSBlYWNoIG9mIHRoZSBzdHJpbmdzIGluIGVCb29rQ29uZmlnLnJlYWRpbmdzXG4gICAgICAgIGxldCBib2R5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdO1xuICAgICAgICBsZXQgcHR4Ym9vayA9IGZhbHNlO1xuICAgICAgICBsZXQgZW5kTG9wID0gMjtcbiAgICAgICAgaWYgKGJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwicHJldGV4dFwiKSkge1xuICAgICAgICAgICAgcHR4Ym9vayA9IHRydWU7XG4gICAgICAgICAgICBlQm9va0NvbmZpZy5yZWFkaW5ncyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzLm1hcChyID0+IHIuc3BsaXQoXCIvXCIpLnBvcCgpKTtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICAgICAgICAgIGVuZExvcCA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcG9zaXRpb24gPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5pbmRleE9mKG5hbWUpO1xuICAgICAgICBsZXQgbnVtX3JlYWRpbmdzID0gZUJvb2tDb25maWcucmVhZGluZ3MubGVuZ3RoO1xuICAgICAgICAvLyBnZXQgcHJldiBuYW1lXG4gICAgICAgIGlmIChwb3NpdGlvbiA+IDApIHtcbiAgICAgICAgICAgIG5ld19wb3MgPSBlQm9va0NvbmZpZy5yZWFkaW5nc1twb3NpdGlvbiAtIDFdO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cyA9IGN1cl9wYXRoX3BhcnRzLnNsaWNlKDAsIGN1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIGVuZExvcCk7XG4gICAgICAgICAgICBwYXRoX3BhcnRzLnB1c2gobmV3X3Bvcyk7XG4gICAgICAgICAgICBuZXdfcG9zX2xpbmsgPSBwYXRoX3BhcnRzLmpvaW4oXCIvXCIpO1xuICAgICAgICAgICAgZnN0ID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IGBQYWdlICR7cG9zaXRpb24gKyAxfSBvZiAke251bV9yZWFkaW5nc30sIGA7XG4gICAgICAgICAgICB2YXIgZnN0X2xuayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgLy9mc3RfbG5rLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1sZyByZWFkaW5nLW5hdmlnYXRpb24gcHJldi1yZWFkaW5nXCI7XG4gICAgICAgICAgICBmc3RfbG5rLmhyZWYgPSBuZXdfcG9zX2xpbms7XG4gICAgICAgICAgICBmc3RfbG5rLnRleHRDb250ZW50ID0gYEJhY2sgdG8gcGFnZSAke3Bvc2l0aW9uXG4gICAgICAgICAgICAgICAgfSBvZiAke251bV9yZWFkaW5nc306ICR7cmVhZGluZ19uYW1lc1twb3NpdGlvbiAtIDFdfS5gO1xuICAgICAgICAgICAgdHh0LmFwcGVuZChmc3RfbG5rKTtcbiAgICAgICAgICAgIGZzdC5hcHBlbmQodHh0KTtcblxuICAgICAgICB9IGVsc2UgaWYgKHBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgIGZzdCA9IGFjdGl2ZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBgUGFnZSAxIG9mICR7bnVtX3JlYWRpbmdzfS5gO1xuICAgICAgICAgICAgZnN0LmFwcGVuZCh0eHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdGhpcyBpc24ndCBhIHJlYWRpbmcgcGFnZSBpbiB0aGUgYXNzaWdubWVudCwgY2hlY2sgdG8gc2VlIGlmIGFueVxuICAgICAgICAgICAgLy8gYWN0aXZpdGllcyBvbiB0aGlzIHBhZ2UgYXJlIGFzc2lnbmVkIHRvIHRoZSBjdXJyZW50IGFzc2lnbm1lbnRcbiAgICAgICAgICAgIGxldCBleGVyY2lzZU9uUGFnZSA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IHBhZ2VFeGVyY2lzZXMgPSBPYmplY3Qua2V5cyhjb21wb25lbnRNYXApO1xuICAgICAgICAgICAgaWYgKHBhZ2VFeGVyY2lzZXMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBwYWdlRXhlcmNpc2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgICAgICAgICAgICAgcGFnZUV4ZXJjaXNlcyA9IEFycmF5LmZyb20ocGFnZUV4ZXJjaXNlcykubWFwKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC5pZDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgZXggb2YgcGFnZUV4ZXJjaXNlcykge1xuICAgICAgICAgICAgICAgIGlmIChhc3NpZ25tZW50X2luZm8ucXVlc3Rpb25zLmluY2x1ZGVzKGV4KSkge1xuICAgICAgICAgICAgICAgICAgICBleGVyY2lzZU9uUGFnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld19wb3MgPSBlQm9va0NvbmZpZy5yZWFkaW5nc1swXTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMgPSBjdXJfcGF0aF9wYXJ0cy5zbGljZSgwLCBjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSBlbmRMb3ApO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG5ld19wb3MpO1xuICAgICAgICAgICAgbmV3X3Bvc19saW5rID0gcGF0aF9wYXJ0cy5qb2luKFwiL1wiKTtcbiAgICAgICAgICAgIGZzdCA9IGFjdGl2ZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAoZXhlcmNpc2VPblBhZ2UpIHtcbiAgICAgICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBcIlRoaXMgcGFnZSBoYXMgYWN0aXZpdGllcyBhc3NpZ25lZCB0byB0aGUgY3VycmVudCBhc3NpZ25tZW50LlwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBcIk5vdGljZTogdGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBhc3NpZ25tZW50LlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHh0LmFwcGVuZChleGl0X2xpbmspO1xuICAgICAgICAgICAgZnN0LmFwcGVuZCh0eHQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PSBlQm9va0NvbmZpZy5yZWFkaW5ncy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAvLyBubyBtb3JlIHJlYWRpbmdzXG4gICAgICAgICAgICBzbmQgPSBhY3RpdmU7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBgUGFnZSAke251bV9yZWFkaW5nc30gb2YgJHtudW1fcmVhZGluZ3N9OiAke3JlYWRpbmdfbmFtZXNbcG9zaXRpb25dfWA7XG4gICAgICAgICAgICBzbmQuYXBwZW5kKHR4dCk7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPj0gMCkge1xuICAgICAgICAgICAgLy8gZ2V0IG5leHQgbmFtZVxuICAgICAgICAgICAgbmV3X3BvcyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzW3Bvc2l0aW9uICsgMV07XG4gICAgICAgICAgICBwYXRoX3BhcnRzID0gY3VyX3BhdGhfcGFydHMuc2xpY2UoMCwgY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gZW5kTG9wKTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMucHVzaChuZXdfcG9zKTtcbiAgICAgICAgICAgIG5ld19wb3NfbGluayA9IHBhdGhfcGFydHMuam9pbihcIi9cIik7XG4gICAgICAgICAgICBzbmQgPSBhY3RpdmU7XG4gICAgICAgICAgICB2YXIgc25kX2xuayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgLy9zbmRfbG5rLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1sZyByZWFkaW5nLW5hdmlnYXRpb24gbmV4dC1yZWFkaW5nXCI7XG4gICAgICAgICAgICBzbmRfbG5rLmhyZWYgPSBuZXdfcG9zX2xpbms7XG4gICAgICAgICAgICBzbmRfbG5rLnRleHRDb250ZW50ID0gYENvbnRpbnVlIHRvIHBhZ2UgJHtwb3NpdGlvbiArIDJcbiAgICAgICAgICAgICAgICB9IG9mICR7bnVtX3JlYWRpbmdzfTogJHtyZWFkaW5nX25hbWVzW3Bvc2l0aW9uICsgMV19YDtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC5hcHBlbmQoc25kX2xuayk7XG4gICAgICAgICAgICBzbmQuYXBwZW5kKHR4dCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNuZCA9IGFjdGl2ZS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB0eHQudGV4dENvbnRlbnQgPSBcIk5vdGljZTogdGhpcyBwYWdlIGlzIG5vdCBwYXJ0IG9mIHRoZSBhc3NpZ25tZW50LiBUbyByZW1vdmUgdGhpcyB3YXJuaW5nIGNsaWNrIFwiO1xuICAgICAgICAgICAgbGV0IGV4aXRfY2xvbmUgPSBleGl0X2xpbmsuY2xvbmVOb2RlKHRydWUpO1xuXG4gICAgICAgICAgICBleGl0X2Nsb25lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShgY3VycmVudEFzc2lnbm1lbnRJbmZvXyR7ZUJvb2tDb25maWcuY291cnNlfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0eHQuYXBwZW5kKGV4aXRfY2xvbmUpO1xuICAgICAgICAgICAgc25kLmFwcGVuZCh0eHQpO1xuXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRvcC5jbGFzc05hbWUgPSBcInB0eC1ydW5lc3RvbmUtY29udGFpbmVyXCJcbiAgICAgICAgZnN0LmNsYXNzTmFtZSA9IFwicnVuZXN0b25lIGFzc2lnbm1lbnQtbmF2IHRvcC1hc3NpZ25tZW50LW5hdlwiXG4gICAgICAgIC8vdG9wLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwidmFyKC0tY29tcG9uZW50QmdDb2xvcilcIlxuICAgICAgICAvL3RvcC5zdHlsZS5ib3JkZXJDb2xvciA9IFwidmFyKC0tY29tcG9uZW50Qm9yZGVyQ29sb3IpXCJcbiAgICAgICAgLy90b3Auc3R5bGUuYm9yZGVyV2lkdGggPSBcIjFweFwiXG4gICAgICAgIHRvcC5hcHBlbmQoZnN0KTtcbiAgICAgICAgLy90b3AuYXBwZW5kKHNuZCk7XG5cbiAgICAgICAgYm90dG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYm90dG9tLmNsYXNzTmFtZSA9IFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIlxuICAgICAgICBzbmQuY2xhc3NOYW1lID0gXCJydW5lc3RvbmUgYXNzaWdubWVudC1uYXYgYm90dG9tLWFzc2lnbm1lbnQtbmF2XCJcbiAgICAgICAgLy9ib3R0b20uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1jb21wb25lbnRCZ0NvbG9yKVwiXG4gICAgICAgIC8vYm90dG9tLnN0eWxlLmJvcmRlckNvbG9yID0gXCJ2YXIoLS1jb21wb25lbnRCb3JkZXJDb2xvcilcIlxuICAgICAgICAvL2JvdHRvbS5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMXB4XCJcblxuICAgICAgICAvL2JvdHRvbS5hcHBlbmQoYWN0aXZlLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIC8vYm90dG9tLmFwcGVuZChmc3QuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgYm90dG9tLmFwcGVuZChzbmQpO1xuXG5cbiAgICAgICAgLy8gY2hlY2sgdGhlIGJvZHkgdGFnIHRvIHNlZSBpZiBpdCBoYXMgYSBwcmV0ZXh0IGNsYXNzIChubyBqcXVlcnkpXG4gICAgICAgIGlmIChwdHhib29rKSB7XG4gICAgICAgICAgICAvL2FwcGVuZCBwYXJ0cyB0byB0aGUgaGVhZGVyIGFuZCBwcm9ncmVzcyBjb250YWluZXJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdHgtY29udGVudFwiKTtcbiAgICAgICAgICAgIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICAgICAgY29udGVudC5pbnNlcnRCZWZvcmUodG9wLCBjb250ZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgaWYgKHBjKSB7XG4gICAgICAgICAgICAgICAgcGMuc3R5bGUubWFyZ2luQm90dG9tID0gXCIyMHB4XCI7XG4gICAgICAgICAgICAgICAgcGMuYXBwZW5kQ2hpbGQoYm90dG9tKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYWluQ29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1jb250ZW50XCIpO1xuICAgICAgICBpZiAobWFpbkNvbnRlbnQgJiYgc25kKSB7XG4gICAgICAgICAgICBtYWluQ29udGVudC5pbnNlcnRCZWZvcmUodG9wLCBtYWluQ29udGVudC5maXJzdENoaWxkKVxuICAgICAgICAgICAgbWFpbkNvbnRlbnQuYXBwZW5kQ2hpbGQoYm90dG9tKTtcblxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0aW1lZFJlZnJlc2goKSB7XG4gICAgdmFyIHRpbWVvdXRQZXJpb2QgPSA5MDAwMDA7IC8vIDc1IG1pbnV0ZXNcbiAgICBsZXQgaWRsZVRpbWVvdXRJZDtcblxuICAgIGZ1bmN0aW9uIG9uSWRsZSgpIHtcbiAgICAgICAgLy8gQWZ0ZXIgdGltZW91dCBwZXJpb2Qgc2VuZCB0aGUgdXNlciBiYWNrIHRvIHRoZSBpbmRleC4gIFRoaXMgd2lsbCBmb3JjZSBhIGxvZ2luXG4gICAgICAgIC8vIGlmIG5lZWRlZCB3aGVuIHRoZXkgd2FudCB0byBnbyB0byBhIHBhcnRpY3VsYXIgcGFnZS4gIFRoaXMgbWF5IG5vdCBiZSBwZXJmZWN0XG4gICAgICAgIC8vIGJ1dCBpdHMgYW4gZWFzeSB3YXkgdG8gbWFrZSBzdXJlIGxhcHRvcCB1c2VycyBhcmUgcHJvcGVybHkgbG9nZ2VkIGluIHdoZW4gdGhleVxuICAgICAgICAvLyB0YWtlIHF1aXp6ZXMgYW5kIHNhdmUgc3R1ZmYuXG4gICAgICAgIGlmIChsb2NhdGlvbi5ocmVmLmluZGV4T2YoXCJpbmRleC5odG1sXCIpIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJJZGxlIHRpbWVyIC0gXCIgKyBsb2NhdGlvbi5wYXRobmFtZSk7XG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID1cbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5hcHAgK1xuICAgICAgICAgICAgICAgIFwiL2RlZmF1bHQvdXNlci9sb2dpbj9fbmV4dD1cIiArXG4gICAgICAgICAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUgK1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uLnNlYXJjaDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlc2V0SWRsZVRpbWVyKCkge1xuICAgICAgICBpZiAoaWRsZVRpbWVvdXRJZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkbGVUaW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIGlkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KG9uSWRsZSwgdGltZW91dFBlcmlvZCk7XG4gICAgfVxuXG4gICAgW1wibW91c2Vtb3ZlXCIsIFwia2V5ZG93blwiLCBcInNjcm9sbFwiLCBcImNsaWNrXCIsIFwidG91Y2hzdGFydFwiLCBcIndoZWVsXCJdLmZvckVhY2goXG4gICAgICAgIChldmVudE5hbWUpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcmVzZXRJZGxlVGltZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgfSxcbiAgICApO1xuXG4gICAgcmVzZXRJZGxlVGltZXIoKTtcbn1cblxuY2xhc3MgUGFnZVByb2dyZXNzQmFyIHtcbiAgICBjb25zdHJ1Y3RvcihhY3REaWN0KSB7XG4gICAgICAgIHRoaXMucG9zc2libGUgPSAwO1xuICAgICAgICB0aGlzLnRvdGFsID0gMTtcbiAgICAgICAgaWYgKGFjdERpY3QgJiYgXCJhc3NpZ25tZW50X3NwZWNcIiBpbiBhY3REaWN0KSB7XG4gICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYyA9IGFjdERpY3QuYXNzaWdubWVudF9zcGVjO1xuICAgICAgICAgICAgZGVsZXRlIGFjdERpY3QuYXNzaWdubWVudF9zcGVjO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhY3REaWN0ICYmIE9iamVjdC5rZXlzKGFjdERpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdERpY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYWN0aXZpdGllcyA9IHsgcGFnZTogMCB9O1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ydW5lc3RvbmVcIikuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgYWN0aXZpdGllc1tlLmZpcnN0RWxlbWVudENoaWxkLmlkXSA9IDA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZpdGllcyA9IGFjdGl2aXRpZXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQcm9ncmVzcygpO1xuICAgICAgICAvLyBIaWRlIHRoZSBwcm9ncmVzcyBiYXIgb24gdGhlIGluZGV4IHBhZ2UuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5tYXRjaChcbiAgICAgICAgICAgICAgICAvLipcXC8oaW5kZXguaHRtbHx0b2N0cmVlLmh0bWx8RXhlcmNpc2VzLmh0bWx8c2VhcmNoLmh0bWwpJC9pLFxuICAgICAgICAgICAgKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnN0IHNjcHJvZ3Jlc3Njb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICAgICBcInNjcHJvZ3Jlc3Njb250YWluZXJcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoc2Nwcm9ncmVzc2NvbnRhaW5lcikgc2Nwcm9ncmVzc2NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJQcm9ncmVzcygpO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVByb2dyZXNzKCkge1xuICAgICAgICBmb3IgKGxldCBrIGluIHRoaXMuYWN0aXZpdGllcykge1xuICAgICAgICAgICAgaWYgKGsgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucG9zc2libGUrKztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2tdID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvdGFsKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IDA7XG4gICAgICAgIGNvbnN0IHNjcHJvZ3Jlc3N0b3RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3RvdGFsXCIpO1xuICAgICAgICBpZiAoc2Nwcm9ncmVzc3RvdGFsKSBzY3Byb2dyZXNzdG90YWwudGV4dENvbnRlbnQgPSB0aGlzLnRvdGFsO1xuICAgICAgICBjb25zdCBzY3Byb2dyZXNzcG9zcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3Bvc3NcIik7XG4gICAgICAgIGlmIChzY3Byb2dyZXNzcG9zcykgc2Nwcm9ncmVzc3Bvc3MudGV4dENvbnRlbnQgPSB0aGlzLnBvc3NpYmxlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFsdWUgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVwbGFjZSAjc3ViY2hhcHRlcnByb2dyZXNzIGRpdiB3aXRoIGEgbmF0aXZlIDxwcm9ncmVzcz4gZWxlbWVudCBpZiBub3QgYWxyZWFkeSBkb25lXG4gICAgICAgIGxldCBzdWJjaGFwdGVycHJvZ3Jlc3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1YmNoYXB0ZXJwcm9ncmVzc1wiKTtcbiAgICAgICAgaWYgKHN1YmNoYXB0ZXJwcm9ncmVzcyAmJiBzdWJjaGFwdGVycHJvZ3Jlc3MudGFnTmFtZSAhPT0gXCJQUk9HUkVTU1wiKSB7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBkaXYgd2l0aCBhIDxwcm9ncmVzcz4gZWxlbWVudFxuICAgICAgICAgICAgY29uc3QgcHJvZ3Jlc3NFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByb2dyZXNzXCIpO1xuICAgICAgICAgICAgcHJvZ3Jlc3NFbGVtLmlkID0gXCJzdWJjaGFwdGVycHJvZ3Jlc3NcIjtcbiAgICAgICAgICAgIHByb2dyZXNzRWxlbS5tYXggPSAxMDA7XG4gICAgICAgICAgICBwcm9ncmVzc0VsZW0udmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIC8vIENvcHkgb3ZlciBhbnkgY2xhc3NlcyBmcm9tIHRoZSBvbGQgZGl2XG4gICAgICAgICAgICBwcm9ncmVzc0VsZW0uY2xhc3NOYW1lID0gc3ViY2hhcHRlcnByb2dyZXNzLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzcy5yZXBsYWNlV2l0aChwcm9ncmVzc0VsZW0pO1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzID0gcHJvZ3Jlc3NFbGVtO1xuICAgICAgICB9IGVsc2UgaWYgKHN1YmNoYXB0ZXJwcm9ncmVzcykge1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzLm1heCA9IDEwMDtcbiAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmFzc2lnbm1lbnRfc3BlYykge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXIgaGFzIGNvbXBsZXRlZCBhbGwgYWN0aXZpdGllcywgc2VuZCB0aGUgcmVhZGluZyBzY29yZS5cbiAgICAgICAgICAgIC8vIFRoaXMgaGFuZGxlcyB0aGUgY2FzZSB3aGVyZSB0aGVyZSBhcmUgbm8gYWN0aXZpdGllcyBvbiB0aGUgcGFnZSBvclxuICAgICAgICAgICAgLy8gIHdoZXJlIHRoZSB1c2VyIGNvbXBsZXRlZCBhY3Rpdml0aWVzIG9uIHRoZSBhc3NpZ25tZW50IHBhZ2UgYW5kIG5vd1xuICAgICAgICAgICAgLy8gIGlzIHZpZXdpbmcgdGhlIHJlYWRpbmcgcGFnZS5cbiAgICAgICAgICAgIGxldCBjb21wbGV0ZUFjdGl2aXRpZXMgPSB0aGlzLnRvdGFsOyAvLyBzdWJ0cmFjdCAxIGZvciB0aGUgcGFnZSByZWFkaW5nIHdoaWNoIGlzIGluIHRvdGFsIGJ1dCBub3QgYW4gYWN0aXZpdHlcbiAgICAgICAgICAgIGxldCByZXF1aXJlZEFjdGl2aXRpZXMgPVxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWdubWVudF9zcGVjLmFjdGl2aXRpZXNfcmVxdWlyZWQgfHwgMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZCA9IHRoaXMucG9zc2libGU7IC8vIGlmIGFjdGl2aXRpZXNfcmVxdWlyZWQgaXMgbnVsbCwgdGhlbiB0aGVyZSBhcmUgbm9uZSBvbiB0aGUgcGFnZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlQWN0aXZpdGllcyA+PSByZXF1aXJlZEFjdGl2aXRpZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRDb21wbGV0ZWRSZWFkaW5nU2NvcmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWFkaW5nIHNjb3JlIHNlbnQgZm9yIHBhZ2VcIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIHdhaXQgYSB0aWNrIHRoZW4gbWFyayB0aGUgcGFnZSBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIGlzIG5lZWRlZCB0byBsZXQgdGhlIHByb2dyZXNzIGJhciB1cGRhdGUgYmVmb3JlIG1hcmtpbmcgY29tcGxldGVcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpID09PSBcIm1hcmsgYXMgY29tcGxldGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgICAgICBjb25zdCBzdWJjaGFwdGVyRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJjaGFwdGVycHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICBpZiAoc3ViY2hhcHRlckRpdikgc3ViY2hhcHRlckRpdi5jbGFzc0xpc3QuYWRkKFwibG9nZ2Vkb3V0XCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlUHJvZ3Jlc3MoZGl2X2lkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZpdGllc1tkaXZfaWRdKys7XG4gICAgICAgIC8vIE9ubHkgdXBkYXRlIHRoZSBwcm9ncmVzcyBiYXIgb24gdGhlIGZpcnN0IGludGVyYWN0aW9uIHdpdGggYW4gb2JqZWN0LlxuICAgICAgICBpZiAodGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0gPT09IDEpIHtcbiAgICAgICAgICAgIHRoaXMudG90YWwrKztcbiAgICAgICAgICAgIGxldCB2YWwgPSAoMTAwICogdGhpcy50b3RhbCkgLyB0aGlzLnBvc3NpYmxlO1xuICAgICAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc3RvdGFsMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2Nwcm9ncmVzc3RvdGFsXCIpO1xuICAgICAgICAgICAgaWYgKHNjcHJvZ3Jlc3N0b3RhbDIpIHNjcHJvZ3Jlc3N0b3RhbDIudGV4dENvbnRlbnQgPSB0aGlzLnRvdGFsO1xuICAgICAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc3Bvc3MyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzcG9zc1wiKTtcbiAgICAgICAgICAgIGlmIChzY3Byb2dyZXNzcG9zczIpIHNjcHJvZ3Jlc3Nwb3NzMi50ZXh0Q29udGVudCA9IHRoaXMucG9zc2libGU7XG4gICAgICAgICAgICBsZXQgc3ViY2hhcHRlcnByb2dyZXNzMiA9XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdWJjaGFwdGVycHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzMiAmJlxuICAgICAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzczIudGFnTmFtZSA9PT0gXCJQUk9HUkVTU1wiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MyLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzaWdubWVudF9zcGVjICYmXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZCAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMudG90YWwgPj0gdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1aXJlZCBhY3Rpdml0aWVzIGNvbXBsZXRlZFwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRDb21wbGV0ZWRSZWFkaW5nU2NvcmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWFkaW5nIHNjb3JlIHNlbnRcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdmFsID09IDEwMC4wICYmXG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi50ZXh0Q29udGVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgY2IudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSA9PT0gXCJtYXJrIGFzIGNvbXBsZXRlZFwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSkoKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2IgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbXBsZXRpb25CdXR0b25cIik7XG4gICAgICAgICAgICAgICAgaWYgKGNiICYmIHR5cGVvZiBjYi5jbGljayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgc2VuZENvbXBsZXRlZFJlYWRpbmdTY29yZSgpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHsgLi4udGhpcy5hc3NpZ25tZW50X3NwZWMgfTtcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvdXBkYXRlX3JlYWRpbmdfc2NvcmVgLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBGYWlsZWQgdG8gc2VuZCByZWFkaW5nIHNjb3JlISAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3Igc2VuZGluZyByZWFkaW5nIHNjb3JlICR7ZX1gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHZhciBwYWdlUHJvZ3Jlc3NUcmFja2VyID0ge307XG5cbmZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gICAgY29uc3QgdmFsdWUgPSBgOyAke2RvY3VtZW50LmNvb2tpZX1gO1xuICAgIGNvbnN0IHBhcnRzID0gdmFsdWUuc3BsaXQoYDsgJHtuYW1lfT1gKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSByZXR1cm4gcGFydHMucG9wKCkuc3BsaXQoXCI7XCIpLnNoaWZ0KCk7XG59XG5cbmxldCBzdHVkeUNsdWVzQ29udmVyc2F0aW9uSWQgPSAtMTtcblxuZnVuY3Rpb24gYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UobWVzc2FnZXNFbCwgcm9sZSwgdGV4dCwgaXNIdG1sID0gZmFsc2UpIHtcbiAgICBjb25zdCBidWJibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJ1YmJsZS5jbGFzc05hbWUgPSBgc3R1ZHljbHVlcy1tZXNzYWdlICR7cm9sZX1gO1xuICAgIGlmIChpc0h0bWwpIHtcbiAgICAgICAgYnViYmxlLmlubmVySFRNTCA9IHRleHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnViYmxlLnRleHRDb250ZW50ID0gdGV4dDtcbiAgICB9XG4gICAgbWVzc2FnZXNFbC5hcHBlbmRDaGlsZChidWJibGUpO1xuICAgIG1lc3NhZ2VzRWwuc2Nyb2xsVG9wID0gbWVzc2FnZXNFbC5zY3JvbGxIZWlnaHQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0dWR5Q2x1ZXNXaWRnZXQoKSB7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZHljbHVlcy1mYWJcIikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICAgIHN0eWxlLnRleHRDb250ZW50ID0gYFxuICAgICAgICAjc3R1ZHljbHVlcy1mYWIge1xuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICAgICAgcmlnaHQ6IDI0cHg7XG4gICAgICAgICAgICBib3R0b206IDI0cHg7XG4gICAgICAgICAgICB6LWluZGV4OiA5OTk5O1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICAgICAgcGFkZGluZzogMTJweCAxOHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogIzI1NjNlYjtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xuICAgICAgICB9XG5cbiAgICAgICAgI3N0dWR5Y2x1ZXMtY2hhdCB7XG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgICAgICByaWdodDogMjRweDtcbiAgICAgICAgICAgIGJvdHRvbTogNzhweDtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTk7XG4gICAgICAgICAgICB3aWR0aDogbWluKDQyMHB4LCBjYWxjKDEwMHZ3IC0gMzJweCkpO1xuICAgICAgICAgICAgaGVpZ2h0OiBtaW4oNTIwcHgsIGNhbGMoMTAwdmggLSAxMjBweCkpO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNkMWQ1ZGI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxNHB4IDM2cHggcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgfVxuXG4gICAgICAgICNzdHVkeWNsdWVzLWNoYXQub3BlbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtaGVhZGVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgcGFkZGluZzogMTBweCAxMnB4O1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2Y5ZmFmYjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNsb3NlIHtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jb2FjaC10b2dnbGUge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBnYXA6IDZweDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICBjb2xvcjogIzRiNTU2MztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0ge1xuICAgICAgICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgICAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgICAgICAgIHdpZHRoOiAzMnB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAxOHB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2QxZDVkYjtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4ycztcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXTo6YWZ0ZXIge1xuICAgICAgICAgICAgY29udGVudDogXCJcIjtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogMnB4O1xuICAgICAgICAgICAgbGVmdDogMnB4O1xuICAgICAgICAgICAgd2lkdGg6IDE0cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDE0cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnM7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jb2FjaC10b2dnbGUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOmNoZWNrZWQge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogIzI1NjNlYjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZDo6YWZ0ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDE0cHgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZXMge1xuICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4O1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBnYXA6IDEwcHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjhmYWZjO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZSB7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDg1JTtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gICAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLW1lc3NhZ2UudXNlciB7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNkYmVhZmU7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjYmZkYmZlO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZS5hc3Npc3RhbnQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlLnN0dWR5Y2x1ZXMtbG9hZGluZyB7XG4gICAgICAgICAgICBjb2xvcjogIzZiNzI4MDtcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXIge1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1zcGlubmVyLWRvdCB7XG4gICAgICAgICAgICB3aWR0aDogNnB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA2cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjNmI3MjgwO1xuICAgICAgICAgICAgb3BhY2l0eTogMC4zNTtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc3R1ZHljbHVlcy1kb3QtcHVsc2UgMXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1zcGlubmVyLWRvdDpudGgtY2hpbGQoMikge1xuICAgICAgICAgICAgYW5pbWF0aW9uLWRlbGF5OiAwLjE1cztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXItZG90Om50aC1jaGlsZCgzKSB7XG4gICAgICAgICAgICBhbmltYXRpb24tZGVsYXk6IDAuM3M7XG4gICAgICAgIH1cblxuICAgICAgICBAa2V5ZnJhbWVzIHN0dWR5Y2x1ZXMtZG90LXB1bHNlIHtcbiAgICAgICAgICAgIDAlLFxuICAgICAgICAgICAgODAlLFxuICAgICAgICAgICAgMTAwJSB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zNTtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgNDAlIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWlucHV0YmFyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1pbnB1dGJhciBpbnB1dCB7XG4gICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2QxZDVkYjtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAxMHB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtaW5wdXRiYXIgYnV0dG9uIHtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAxMnB4O1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuICAgIGA7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG5cbiAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgIGJ1dHRvbi5pZCA9IFwic3R1ZHljbHVlcy1mYWJcIjtcbiAgICBidXR0b24udGV4dENvbnRlbnQgPSBcIlN0dWR5Q2x1ZXMgQ2hhdFwiO1xuXG4gICAgY29uc3QgY2hhdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2hhdC5pZCA9IFwic3R1ZHljbHVlcy1jaGF0XCI7XG4gICAgY2hhdC5pbm5lckhUTUwgPSBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdHVkeWNsdWVzLWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4+U3R1ZHlDbHVlczwvc3Bhbj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwic3R1ZHljbHVlcy1jb2FjaC1tb2RlXCIgY2hlY2tlZCAvPlxuICAgICAgICAgICAgICAgIENvYWNoIE1vZGVcbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwic3R1ZHljbHVlcy1jbG9zZVwiIGFyaWEtbGFiZWw9XCJDbG9zZSBjaGF0XCI+4pyVPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3R1ZHljbHVlcy1tZXNzYWdlc1wiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3R1ZHljbHVlcy1pbnB1dGJhclwiPlxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJBc2sgYSBxdWVzdGlvbiBhYm91dCB0aGlzIGNvdXJzZS4uLlwiIC8+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIj5TZW5kPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgIGA7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjaGF0KTtcblxuICAgIGNvbnN0IGNsb3NlQnRuID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiLnN0dWR5Y2x1ZXMtY2xvc2VcIik7XG4gICAgY29uc3QgbWVzc2FnZXNFbCA9IGNoYXQucXVlcnlTZWxlY3RvcihcIi5zdHVkeWNsdWVzLW1lc3NhZ2VzXCIpO1xuICAgIGNvbnN0IGlucHV0RWwgPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIuc3R1ZHljbHVlcy1pbnB1dGJhciBpbnB1dFwiKTtcbiAgICBjb25zdCBzZW5kQnRuID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiLnN0dWR5Y2x1ZXMtaW5wdXRiYXIgYnV0dG9uXCIpO1xuICAgIGNvbnN0IGNvYWNoVG9nZ2xlID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiI3N0dWR5Y2x1ZXMtY29hY2gtbW9kZVwiKTtcblxuICAgIGxldCBjb2FjaE1vZGUgPSBjb2FjaFRvZ2dsZS5jaGVja2VkO1xuICAgIGNvYWNoVG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgICAgICBjb2FjaE1vZGUgPSBjb2FjaFRvZ2dsZS5jaGVja2VkO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdG9nZ2xlQ2hhdCA9ICgpID0+IHtcbiAgICAgICAgY2hhdC5jbGFzc0xpc3QudG9nZ2xlKFwib3BlblwiKTtcbiAgICAgICAgaWYgKGNoYXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwib3BlblwiKSkge1xuICAgICAgICAgICAgaW5wdXRFbC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHNlbmRNZXNzYWdlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBsZXQgcXVlcnkgPSBpbnB1dEVsLnZhbHVlLnRyaW0oKTtcbiAgICAgICAgaWYgKCFxdWVyeSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZWN0aW9uSW5mbyA9IFwiXCI7XG4gICAgICAgIC8vIGZpbmQgdGhlIHNlY3Rpb24gdGl0bGUgb24gdGhlIHBhZ2UgdG8gaW5jbHVkZSBpbiB0aGUgaW5pdGlhbCBxdWVyeVxuICAgICAgICBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHkucHJldGV4dFwiKSkge1xuICAgICAgICAgICAgbGV0IHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzZWN0aW9uLnNlY3Rpb24nKTtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uVGl0bGUgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ3NwYW4udGl0bGUnKS5pbm5lclRleHQ7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbk51bWJlciA9IHNlY3Rpb24ucXVlcnlTZWxlY3Rvcignc3Bhbi5jb2RlbnVtYmVyJykuaW5uZXJUZXh0O1xuICAgICAgICAgICAgc2VjdGlvbkluZm8gPSBgJHtzZWN0aW9uTnVtYmVyfSAke3NlY3Rpb25UaXRsZX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNlY3Rpb25TcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInNwYW4uc2VjdGlvbi1udW1iZXJcIik7XG4gICAgICAgICAgICBpZiAoc2VjdGlvblNwYW4pIHtcbiAgICAgICAgICAgICAgICBzZWN0aW9uSW5mbyA9IHNlY3Rpb25TcGFuLnBhcmVudEVsZW1lbnQuaW5uZXJUZXh0LnRyaW0oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoc3R1ZHlDbHVlc0NvbnZlcnNhdGlvbklkID09PSAtMSkge1xuICAgICAgICAgICAgaWYgKHNlY3Rpb25JbmZvKSB7XG4gICAgICAgICAgICAgICAgcXVlcnkgPSBgUmVnYXJkaW5nIHNlY3Rpb24gXCIke3NlY3Rpb25JbmZvfVwiOiAke3F1ZXJ5fWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwic3R1ZHljbHVlc19xdWVyeVwiLCBhY3Q6IGBxdWVyeTogJHtxdWVyeX1gLCBkaXZfaWQ6IGAke3NlY3Rpb25JbmZvfWAgfSk7XG4gICAgICAgIGFwcGVuZFN0dWR5Q2x1ZXNNZXNzYWdlKG1lc3NhZ2VzRWwsIFwidXNlclwiLCBxdWVyeSk7IC8vIHRvZG86IG1ha2UgdGhpcyBjb25kaXRpb25hbCBvbiBiZWluZyBhIGJvb2sgcGFnZSBhbmQgb24gdGhlIGJvb2sgYmVpbmcgb25lIG9mIHRoZSBzdXBwb3J0ZWQgYm9va3NcbiAgICAgICAgaW5wdXRFbC52YWx1ZSA9IFwiXCI7XG4gICAgICAgIHNlbmRCdG4uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IGxvYWRpbmdCdWJibGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBsb2FkaW5nQnViYmxlLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICBcInN0dWR5Y2x1ZXMtbWVzc2FnZSBhc3Npc3RhbnQgc3R1ZHljbHVlcy1sb2FkaW5nXCI7XG4gICAgICAgIGxvYWRpbmdCdWJibGUuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICdUaGlua2luZyA8c3BhbiBjbGFzcz1cInN0dWR5Y2x1ZXMtc3Bpbm5lclwiPjxzcGFuIGNsYXNzPVwic3R1ZHljbHVlcy1zcGlubmVyLWRvdFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cInN0dWR5Y2x1ZXMtc3Bpbm5lci1kb3RcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJzdHVkeWNsdWVzLXNwaW5uZXItZG90XCI+PC9zcGFuPjwvc3Bhbj4nO1xuICAgICAgICBtZXNzYWdlc0VsLmFwcGVuZENoaWxkKGxvYWRpbmdCdWJibGUpO1xuICAgICAgICBtZXNzYWdlc0VsLnNjcm9sbFRvcCA9IG1lc3NhZ2VzRWwuc2Nyb2xsSGVpZ2h0O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFxuICAgICAgICAgICAgICAgIGAvYXNzaWdubWVudC9zdHVkZW50L3N0dWR5Y2x1ZXNfcXVlcnlgLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJzYXRpb25faWQ6IHN0dWR5Q2x1ZXNDb252ZXJzYXRpb25JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvYWNoTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gcGF5bG9hZD8uZGV0YWlsIHx8IHt9O1xuICAgICAgICAgICAgY29uc3Qgc3R1ZHljbHVlc1Jlc3BvbnNlID0gZGV0YWlsPy5yZXNwb25zZSB8fCB7fTtcbiAgICAgICAgICAgIGNvbnN0IGxsbVJlc3BvbnNlID0gc3R1ZHljbHVlc1Jlc3BvbnNlPy5sbG1fcmVzcG9uc2U7XG4gICAgICAgICAgICBjb25zdCByZWZlcmVuY2VzID0gc3R1ZHljbHVlc1Jlc3BvbnNlPy5yZWZlcmVuY2VzIHx8IHt9O1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRldGFpbC5jb252ZXJzYXRpb25faWQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBzdHVkeUNsdWVzQ29udmVyc2F0aW9uSWQgPSBkZXRhaWwuY29udmVyc2F0aW9uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBtYXJrZG93blJlc3BvbnNlID0gKGxsbVJlc3BvbnNlIHx8IFwiTm8gcmVzcG9uc2UgYXZhaWxhYmxlIGZyb20gU3R1ZHlDbHVlcy5cIikucmVwbGFjZShcbiAgICAgICAgICAgICAgICAvXFxbKFteXFxdXSspXFxdXFwoKFteKV0rKVxcKS9nLFxuICAgICAgICAgICAgICAgIChtYXRjaCwgdGV4dCwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHJlZmVyZW5jZXNba2V5XT8uY29udGVudF91cmw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cmwgPyBgWyR7dGV4dH1dKCR7dXJsfSlgIDogbWF0Y2g7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRSZXNwb25zZSA9IG1hcmtlZC5wYXJzZShtYXJrZG93blJlc3BvbnNlKTtcblxuICAgICAgICAgICAgYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgbWVzc2FnZXNFbCxcbiAgICAgICAgICAgICAgICBcImFzc2lzdGFudFwiLFxuICAgICAgICAgICAgICAgIGZvcm1hdHRlZFJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIHRydWUsXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGFwcGVuZFN0dWR5Q2x1ZXNNZXNzYWdlKFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzRWwsXG4gICAgICAgICAgICAgICAgXCJhc3Npc3RhbnRcIixcbiAgICAgICAgICAgICAgICBcIlNvcnJ5LCBTdHVkeUNsdWVzIGlzIHVuYXZhaWxhYmxlIHJpZ2h0IG5vdy4gUGxlYXNlIHRyeSBhZ2Fpbi5cIixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiU3R1ZHlDbHVlcyBjaGF0IGVycm9yOlwiLCBlcnIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgbG9hZGluZ0J1YmJsZS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHNlbmRCdG4uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlucHV0RWwuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZUNoYXQpO1xuICAgIGNsb3NlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0b2dnbGVDaGF0KTtcbiAgICBzZW5kQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZW5kTWVzc2FnZSk7XG4gICAgaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZXZ0KSA9PiB7XG4gICAgICAgIGlmIChldnQua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VuZE1lc3NhZ2UoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzaG91bGRTaG93U3R1ZHlDbHVlc1dpZGdldCgpIHtcbiAgICBpZiAoIShsb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcIi9ucy9ib29rcy9cIikgfHwgbG9jYXRpb24ucGF0aG5hbWUuaW5jbHVkZXMoXCJkb0Fzc2lnbm1lbnRcIikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIGNvbnN0IGVuYWJsZWRCYXNlY291cnNlcyA9IFtcImNzYXdlc29tZTJcIiwgXCJweTRlLWludFwiLCBcInRoaW5rY3NweVwiLCBcImh0dGxhY3NcIiwgXCJQVFhTQlwiLCBcImNwcGRzMlwiXTtcbiAgICBjb25zdCBlbmFibGVkQ291cnNlcyA9IFtcIlNJMjAxLVcyNi1NV1wiLCBcIlNJMjAxLVcyNi1UVGhcIiwgXCJEdWtlQ1MxMDFTUDI2XCIsXG4gICAgICAgIFwibWNkLWNzYS1zY2hvb2xvZ3lcIiwgXCJtY2QtY3NhLWNhbnZhc1wiLCBcImNzYXdlc29tZTItTU9PQ1wiLFxuICAgICAgICBcInRlc3RfcHk0ZS1pbnRfYXBpXCIsIFwiYmNfY3BwZHNfczI2XCIsIFwiVGVzdC1weTRlLWludFwiLFxuICAgICAgICBcInZpcmdpbmlhdGVjaF9weTRlLWludF9zcHJpbmcyNlwiLCBcInVtc2kxMDFfZmFsbDI2XCJcbiAgICBdO1xuICAgIGNvbnN0IGhvc3QgPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XG5cbiAgICBpZiAoaG9zdCA9PT0gXCJsb2NhbGhvc3RcIikge1xuICAgICAgICByZXR1cm4gZW5hYmxlZEJhc2Vjb3Vyc2VzLmluY2x1ZGVzKGVCb29rQ29uZmlnLmJhc2Vjb3Vyc2UpO1xuICAgIH1cblxuICAgIGlmIChob3N0ID09PSBcInJ1bmVzdG9uZS5hY2FkZW15XCIpIHtcbiAgICAgICAgcmV0dXJuIGVuYWJsZWRDb3Vyc2VzLmluY2x1ZGVzKGVCb29rQ29uZmlnLmNvdXJzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVQYWdlU2V0dXAoKSB7XG4gICAgdmFyIG1lc3M7XG4gICAgaWYgKGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgIGxldCBoZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICB0aW1lem9uZW9mZnNldDogbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpIC8gNjAsXG4gICAgICAgICAgICB0aW1lem9uZTogSW50bC5EYXRlVGltZUZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLnRpbWVab25lLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgUlNfaW5mbyA9IGdldENvb2tpZShcIlJTX2luZm9cIik7XG4gICAgICAgIHZhciB0el9tYXRjaCA9IGZhbHNlO1xuICAgICAgICBpZiAoUlNfaW5mbykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgY2xlYW5lZCA9IFJTX2luZm8ucmVwbGFjZSgvXFxcXDA1NC9nLCBcIixcIik7IC8vIGhhbmRsZSBvY3RhbCBjb21tYSBlbmNvZGluZ1xuICAgICAgICAgICAgICAgIGxldCBpbmZvID0gSlNPTi5wYXJzZShkZWNvZGVVUklDb21wb25lbnQoY2xlYW5lZCkpO1xuICAgICAgICAgICAgICAgIGluZm8gPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChpbmZvKSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBpbmZvLnRpbWV6b25lID09PSBkYXRhLnRpbWV6b25lICYmXG4gICAgICAgICAgICAgICAgICAgIGluZm8udHpfb2Zmc2V0ID09PSBkYXRhLnRpbWV6b25lb2Zmc2V0XG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJUaW1lem9uZSBjb29raWUgbWF0Y2hlcywgbm90IHNlbmRpbmcgdGltZXpvbmUgdG8gc2VydmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHR6X21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJFcnJvciBwYXJzaW5nIFJTX2luZm8gY29va2llLCBzZW5kaW5nIHRpbWV6b25lIHRvIHNlcnZlclwiLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR6X21hdGNoID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gU2V0IGEgY29va2llIHNvIHdlIGRvbid0IGhhdmUgdG8gZG8gdGhpcyBhZ2FpbiBmb3IgYSB3aGlsZS5cbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9zZXRfdHpfb2Zmc2V0YCwge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgYEZhaWxlZCB0byBzZXQgdGltZXpvbmUhICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gLFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHNldHRpbmcgdGltZXpvbmUgJHtlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGBUaGlzIHBhZ2Ugc2VydmVkIGJ5ICR7ZUJvb2tDb25maWcuc2VydmVkX2J5fWApO1xuICAgIGlmIChlQm9va0NvbmZpZy5pc0xvZ2dlZEluKSB7XG4gICAgICAgIG1lc3MgPSBgdXNlcm5hbWU6ICR7ZUJvb2tDb25maWcudXNlcm5hbWV9YDtcbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGNvbnN0IGlwRHJvcGRvd24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlwX2Ryb3Bkb3duX2xpbmtcIik7XG4gICAgICAgICAgICBpZiAoaXBEcm9wZG93biAmJiB0eXBlb2YgaXBEcm9wZG93bi5yZW1vdmUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGlwRHJvcGRvd24ucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBpbnN0UGVlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zdF9wZWVyX2xpbmtcIik7XG4gICAgICAgICAgICBpZiAoaW5zdFBlZXIgJiYgdHlwZW9mIGluc3RQZWVyLnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaW5zdFBlZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJydW5lc3RvbmU6bG9naW5cIikpO1xuICAgICAgICBhZGRSZWFkaW5nTGlzdCgpO1xuICAgICAgICAvLyBPbmx5IHNob3cgdGhlIFN0dWR5Q2x1ZXMgd2lkZ2V0IGZvciBjZXJ0YWluIGJhc2UgY291cnNlcyBhbmQgd2hlbiB0aGUgcGF0aCBpbmNsdWRlcyBcIi9ucy9ib29rcy9cIi5cbiAgICAgICAgLy8gVGhpcyBpcyBhIHRlbXBvcmFyeSBtZWFzdXJlIHRvIGxpbWl0IHRoZSB3aWRnZXQgdG8gY291cnNlcyB0aGF0IGFyZSBrbm93biB0byB3b3JrIHdlbGwgd2l0aCBpdCBhbmQgdG8gYXZvaWQgc2hvd2luZyBpdCBvbiBub24tYm9vayBwYWdlcyB3aGVyZSBpdCBtYXkgbm90IGJlIGFzIHVzZWZ1bC5cbiAgICAgICAgaWYgKHNob3VsZFNob3dTdHVkeUNsdWVzV2lkZ2V0KCkpIHtcbiAgICAgICAgICAgIGNyZWF0ZVN0dWR5Q2x1ZXNXaWRnZXQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBdm9pZCB0aGUgdGltZWRSZWZyZXNoIG9uIHRoZSBncmFkaW5nIHBhZ2UuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKFwiL2FkbWluL2dyYWRpbmdcIikgPT0gLTEgJiZcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5pbmRleE9mKFwiL3BlZXIvXCIpID09IC0xXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGltZWRSZWZyZXNoKCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBtZXNzID0gXCJOb3QgbG9nZ2VkIGluXCI7XG4gICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicnVuZXN0b25lOmxvZ291dFwiKSk7XG4gICAgICAgIGxldCBidyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnJvd3Npbmdfd2FybmluZ1wiKTtcbiAgICAgICAgaWYgKGJ3KSB7XG4gICAgICAgICAgICBidy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPHAgY2xhc3M9J25hdmJhcl9tZXNzYWdlJz5TYXZpbmcgYW5kIExvZ2dpbmcgYXJlIERpc2FibGVkPC9wPlwiO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRfd2FybmluZ1wiKTtcbiAgICAgICAgaWYgKGF3KSB7XG4gICAgICAgICAgICBhdy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgIFwiPHAgY2xhc3M9J25hdmJhcl9tZXNzYWdlJz7wn5qrIExvZy1pbiB0byBSZW1vdmUgPGEgaHJlZj0nL3J1bmVzdG9uZS9kZWZhdWx0L2Fkcyc+QWRzITwvYT4g8J+aqyAmbmJzcDs8L3A+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5sb2dnZWRpbnVzZXJcIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgZWwuaW5uZXJIVE1MID0gbWVzcztcbiAgICB9KTtcblxuICAgIHBhZ2VQcm9ncmVzc1RyYWNrZXIgPSBuZXcgUGFnZVByb2dyZXNzQmFyKGVCb29rQ29uZmlnLmFjdGl2aXRpZXMpO1xuICAgIG5vdGlmeVJ1bmVzdG9uZUNvbXBvbmVudHMoKTtcbn1cblxuZnVuY3Rpb24gc2V0dXBOYXZiYXJMb2dnZWRJbigpIHtcbiAgICBjb25zdCBwcm9maWxlTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZmlsZWxpbmtcIik7XG4gICAgaWYgKHByb2ZpbGVMaW5rKSBwcm9maWxlTGluay5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgY29uc3QgcGFzc3dvcmRMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZGxpbmtcIik7XG4gICAgaWYgKHBhc3N3b3JkTGluaykgcGFzc3dvcmRMaW5rLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiZGlzcGxheVwiKTtcbiAgICBjb25zdCByZWdpc3RlckxpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJlZ2lzdGVybGlua1wiKTtcbiAgICBpZiAocmVnaXN0ZXJMaW5rKSByZWdpc3Rlckxpbmsuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaS5sb2dpbm91dFwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBlbC5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJzxhIGhyZWY9XCIvYWRtaW4vYXV0aC9sb2dvdXRcIj5Mb2cgT3V0PC9hPic7XG4gICAgfSk7XG59XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luXCIsIHNldHVwTmF2YmFyTG9nZ2VkSW4pO1xuXG5mdW5jdGlvbiBzZXR1cE5hdmJhckxvZ2dlZE91dCgpIHtcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZXR1cCBuYXZiYXIgZm9yIGxvZ2dlZCBvdXRcIik7XG4gICAgICAgIGNvbnN0IHJlZ2lzdGVyTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVnaXN0ZXJsaW5rXCIpO1xuICAgICAgICBpZiAocmVnaXN0ZXJMaW5rKSByZWdpc3Rlckxpbmsuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgICAgICBjb25zdCBwcm9maWxlTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZmlsZWxpbmtcIik7XG4gICAgICAgIGlmIChwcm9maWxlTGluaykgcHJvZmlsZUxpbmsuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjb25zdCBwYXNzd29yZExpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkbGlua1wiKTtcbiAgICAgICAgaWYgKHBhc3N3b3JkTGluaykgcGFzc3dvcmRMaW5rLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgY29uc3QgaXBEcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXBfZHJvcGRvd25fbGlua1wiKTtcbiAgICAgICAgaWYgKGlwRHJvcGRvd24pIGlwRHJvcGRvd24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjb25zdCBpbnN0UGVlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5zdF9wZWVyX2xpbmtcIik7XG4gICAgICAgIGlmIChpbnN0UGVlcikgaW5zdFBlZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwibGkubG9naW5vdXRcIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgJzxhIGhyZWY9XCInICtcbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5hcHAgK1xuICAgICAgICAgICAgICAgICcvZGVmYXVsdC91c2VyL2xvZ2luXCI+TG9naW48L2E+JztcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZm9vdGVyXCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBcInVzZXIgbm90IGxvZ2dlZCBpblwiO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ291dFwiLCBzZXR1cE5hdmJhckxvZ2dlZE91dCk7XG5cbmZ1bmN0aW9uIG5vdGlmeVJ1bmVzdG9uZUNvbXBvbmVudHMoKSB7XG4gICAgLy8gUnVuZXN0b25lIGNvbXBvbmVudHMgd2FpdCB1bnRpbCBsb2dpbiBwcm9jZXNzIGlzIG92ZXIgdG8gbG9hZCBjb21wb25lbnRzIGJlY2F1c2Ugb2Ygc3RvcmFnZSBpc3N1ZXMuIFRoaXMgdHJpZ2dlcnMgdGhlIGBkeW5hbWljIGltcG9ydCBtYWNoaW5lcnlgLCB3aGljaCB0aGVuIHNlbmRzIHRoZSBsb2dpbiBjb21wbGV0ZSBzaWduYWwgd2hlbiB0aGlzIGFuZCBhbGwgZHluYW1pYyBpbXBvcnRzIGFyZSBmaW5pc2hlZC5cbiAgICBjb25zb2xlLmxvZyhcInRyaWdnZXJpbmcgcnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiKTtcbiAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJ1bmVzdG9uZTpwcmUtbG9naW4tY29tcGxldGVcIikpO1xufVxuXG5mdW5jdGlvbiBwbGFjZUFkQ29weSgpIHtcbiAgICBpZiAodHlwZW9mIHNob3dBZCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBzaG93QWQpIHtcbiAgICAgICAgbGV0IGFkTnVtID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMikgKyAxO1xuICAgICAgICBsZXQgYWRCbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBhZGNvcHlfJHthZE51bX1gKTtcbiAgICAgICAgbGV0IHJzRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHJzRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcnNFbGVtZW50cy5sZW5ndGgpO1xuICAgICAgICAgICAgcnNFbGVtZW50c1tyYW5kb21JbmRleF0uYWZ0ZXIoYWRCbG9jayk7XG4gICAgICAgICAgICBhZEJsb2NrLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIGluaXRpYWxpemUgc3R1ZmZcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgIGlmIChlQm9va0NvbmZpZykge1xuICAgICAgICBoYW5kbGVQYWdlU2V0dXAoKTtcbiAgICAgICAgcGxhY2VBZENvcHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIGVCb29rQ29uZmlnID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcImVCb29rQ29uZmlnIGlzIG5vdCBkZWZpbmVkLiAgVGhpcyBwYWdlIG11c3Qgbm90IGJlIHNldCB1cCBmb3IgUnVuZXN0b25lXCIsXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8vIG1pc2Mgc3R1ZmZcbi8vIHRvZG86ICBUaGlzIGNvdWxkIGJlIGZ1cnRoZXIgZGlzdHJpYnV0ZWQgYnV0IG1ha2luZyBhIHZpZGVvLmpzIGZpbGUganVzdCBmb3Igb25lIGZ1bmN0aW9uIHNlZW1zIGR1bWIuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgLy8gYWRkIHRoZSB2aWRlbyBwbGF5IGJ1dHRvbiBvdmVybGF5IGltYWdlXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi52aWRlby1wbGF5LW92ZXJsYXlcIikuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICBlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPVxuICAgICAgICAgICAgXCJ1cmwoJ3t7cGF0aHRvKCdfc3RhdGljL3BsYXlfb3ZlcmxheV9pY29uLnBuZycsIDEpfX0nKVwiO1xuICAgIH0pO1xuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBuZWVkZWQgdG8gYWxsb3cgdGhlIGRyb3Bkb3duIHNlYXJjaCBiYXIgdG8gd29yaztcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvdXIgaXMgdGhhdCB0aGUgZHJvcGRvd24gbWVudSBjbG9zZXMgd2hlbiBzb21ldGhpbmcgaW5cbiAgICAvLyBpdCAobGlrZSB0aGUgc2VhcmNoIGJhcikgaXMgY2xpY2tlZFxuICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRyb3Bkb3duIGlucHV0LCAuZHJvcGRvd24gbGFiZWxcIilcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgIC8vIHJlLXdyaXRlIHNvbWUgdXJsc1xuICAgIC8vIFRoaXMgaXMgdHJpY2tlciB0aGFuIGl0IGxvb2tzIGFuZCB5b3UgaGF2ZSB0byBvYmV5IHRoZSBydWxlcyBmb3IgIyBhbmNob3JzXG4gICAgLy8gVGhlICNhbmNob3JzIG11c3QgY29tZSBhZnRlciB0aGUgcXVlcnkgc3RyaW5nIGFzIHRoZSBzZXJ2ZXIgYmFzaWNhbGx5IGlnbm9yZXMgYW55IHBhcnRcbiAgICAvLyBvZiBhIHVybCB0aGF0IGNvbWVzIGFmdGVyICMgLSBsaWtlIGEgY29tbWVudC4uLlxuICAgIGlmIChsb2NhdGlvbi5ocmVmLmluY2x1ZGVzKFwibW9kZT1icm93c2luZ1wiKSkge1xuICAgICAgICBsZXQgcXVlcnlTdHJpbmcgPSBcIj9tb2RlPWJyb3dzaW5nXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJhXCIpLmZvckVhY2goKGxpbmspID0+IHtcbiAgICAgICAgICAgIGxldCBhbmNob3JUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYuaW5jbHVkZXMoXCJib29rcy9wdWJsaXNoZWRcIikgJiZcbiAgICAgICAgICAgICAgICAhbGluay5ocmVmLmluY2x1ZGVzKFwiP21vZGU9YnJvd3NpbmdcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rLmhyZWYuaW5jbHVkZXMoXCIjXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBhUG9pbnQgPSBsaW5rLmhyZWYuaW5kZXhPZihcIiNcIik7XG4gICAgICAgICAgICAgICAgICAgIGFuY2hvclRleHQgPSBsaW5rLmhyZWYuc3Vic3RyaW5nKGFQb2ludCk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiA9IGxpbmsuaHJlZi5zdWJzdHJpbmcoMCwgYVBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGluay5ocmVmID0gbGluay5ocmVmLmluY2x1ZGVzKFwiP1wiKSA/XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nLnJlcGxhY2UoXCI/XCIsIFwiJlwiKSArIGFuY2hvclRleHQgOlxuICAgICAgICAgICAgICAgICAgICBsaW5rLmhyZWYgKyBxdWVyeVN0cmluZyArIGFuY2hvclRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG4vLyBUaGUgQnVzdCBNZW51XG4vKlxuQ291cnNlIEhvbWVcbkFzc2lnbm1lbnRzXG5Qcm9ncmVzc1xuUGVlciBJbnN0cnVjdGlvbiAoU3R1ZGVudClcbi0tLS0tLVxuSW5zdHJ1Y3RvciBEYXNoYm9hcmRcblBlZXIgSW5zdHJ1Y3Rpb24gKEluc3RydWN0b3IpXG5BdXRob3IgSW50ZXJmYWNlIChvcHRpb25hbClcbkVkaXRvciBJbnRlcmZhY2UgKG9wdGlvbmFsKVxuUmVxdWVzdCBJbnZvaWNlXG4tLS0tLS1cbkNoYW5nZSBDb3Vyc2VcblByb2ZpbGVcbkxvZyBPdXRcbiovXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIGNvbnN0IG9sZERyb3BEb3duID0gdGhpcy5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRyb3Bkb3duLWNvbnRlbnRbZGF0YS1kZXByZWNhdGVkXVwiKTtcbiAgICBpZiAob2xkRHJvcERvd24pXG4gICAgICAgIG9sZERyb3BEb3duLnJlbW92ZSgpO1xuXG4gICAgY29uc3QgaXRlbVRlbXBsYXRlID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB0eC11c2VyLWRyb3Bkb3duLWNvbnRlbnRfaXRlbS10ZW1wbGF0ZVwiKTtcbiAgICBjb25zdCBzZXBUZW1wbGF0ZSA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdHgtdXNlci1kcm9wZG93bi1jb250ZW50X3NlcGFyYXRvci10ZW1wbGF0ZVwiKTtcbiAgICBjb25zdCBtZW51Q29udGVudEFyZWEgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHR4LXVzZXItZHJvcGRvd25fcnMtY29udGVudFwiKTtcblxuICAgIGlmICghaXRlbVRlbXBsYXRlIHx8ICFzZXBUZW1wbGF0ZSB8fCAhbWVudUNvbnRlbnRBcmVhKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJNaXNzaW5nIHJlcXVpcmVkIHRlbXBsYXRlIG9yIGNvbnRlbnQgYXJlYSBmb3IgdXNlciBkcm9wZG93blwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaW5rKHVybCwgdGl0bGUsIGFyaWFMYWJlbCA9IG51bGwpIHtcbiAgICAgICAgLy8gQWxsIHdlIHNob3VsZCBhc3N1bWUgYWJvdXQgdGhlIGl0ZW0gdGVtcGxhdGUgaXMgdGhhdCBpdCBoYXMgYW4gYW5jaG9yIGVsZW1lbnRcbiAgICAgICAgY29uc3QgbGluayA9IGl0ZW1UZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgY29uc3QgbGlua0FuY2hvciA9IGxpbmsucXVlcnlTZWxlY3RvcihcImFcIik7XG4gICAgICAgIGxpbmtBbmNob3IuaHJlZiA9IHVybDtcbiAgICAgICAgbGlua0FuY2hvci5pbm5lclRleHQgPSB0aXRsZTtcbiAgICAgICAgaWYgKGFyaWFMYWJlbCkge1xuICAgICAgICAgICAgbGlua0FuY2hvci5hcmlhTGFiZWwgPSBhcmlhTGFiZWw7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmV0dXJuIGVudGlyZSBpdGVtIHRlbXBsYXRlLCBub3QganVzdCBsaW5rXG4gICAgICAgIHJldHVybiBsaW5rO1xuICAgIH1cblxuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9ucy9jb3Vyc2UvaW5kZXhcIiwgXCJDb3Vyc2UgSG9tZVwiKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL3J1bmVzdG9uZS9hc3NpZ25tZW50cy9jaG9vc2VBc3NpZ25tZW50XCIsIFwiQXNzaWdubWVudHNcIikpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hc3NpZ25tZW50L3BlZXIvc3R1ZGVudFwiLCBcIlBlZXIgSW5zdHJ1Y3Rpb24gKFN0dWRlbnQpXCIpKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYXNzaWdubWVudC9zdHVkZW50L3N0dWRlbnRyZXBvcnRcIiwgXCJQcm9ncmVzc1wiKSk7XG4gICAgaWYgKGVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoc2VwVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYWRtaW4vaW5zdHJ1Y3Rvci9tZW51XCIsIFwiSW5zdHJ1Y3RvciBEYXNoYm9hcmRcIikpO1xuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYXNzaWdubWVudC9wZWVyL2luc3RydWN0b3JcIixcbiAgICAgICAgICAgIFwiUGVlciBJbnN0cnVjdGlvbiAoSW5zdHJ1Y3RvcilcIikpO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcuaXNBdXRob3IpIHtcbiAgICAgICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcImh0dHBzOi8vYXV0aG9yLnJ1bmVzdG9uZS5hY2FkZW15L2F1dGhvci9cIixcbiAgICAgICAgICAgICAgICBcIkF1dGhvciBEYXNoYm9hcmRcIikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5pc0VkaXRvcikge1xuICAgICAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiaHR0cHM6Ly9hdXRob3IucnVuZXN0b25lLmFjYWRlbXkvYXV0aG9yL1wiLFxuICAgICAgICAgICAgICAgIFwiRWRpdG9yIERhc2hib2FyZFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL2Fzc2lnbm1lbnQvaW5zdHJ1Y3Rvci9pbnZvaWNlX3JlcXVlc3RcIixcbiAgICAgICAgICAgIFwiUmVxdWVzdCBJbnZvaWNlXCIpKTtcbiAgICB9XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKHNlcFRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYWRtaW4vYXV0aC9teV9jb3Vyc2VzXCIsIFwiQ2hhbmdlIENvdXJzZVwiKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL2FkbWluL2F1dGgvcHJvZmlsZVwiLCBcIlByb2ZpbGVcIikpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hZG1pbi9hdXRoL2xvZ291dFwiLCBcIkxvZyBPdXRcIikpO1xufSk7XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSBzdHJpbmcgYXBwZWFycyB0byBjb250YWluIExhVGVYIG1hdGguXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb29rc0xpa2VMYXRleE1hdGgodGV4dCkge1xuICAgIGlmICh0eXBlb2YgdGV4dCAhPT0gXCJzdHJpbmdcIikgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gQ29tbW9uIExhVGVYIG1hdGggZGVsaW1pdGVyc1xuICAgIGNvbnN0IG1hdGhEZWxpbWl0ZXJzID0gW1xuICAgICAgICAvXFwkXFwkW1xcc1xcU10rP1xcJFxcJC8sIC8vICQkIC4uLiAkJFxuICAgICAgICAvXFwkW14kXFxuXSs/XFwkLywgLy8gJCAuLi4gJFxuICAgICAgICAvXFxcXFxcW1tcXHNcXFNdKz9cXFxcXFxdLywgLy8gXFxbIC4uLiBcXF1cbiAgICAgICAgL1xcXFxcXChbXFxzXFxTXSs/XFxcXFxcKS8sIC8vIFxcKCAuLi4gXFwpXG4gICAgXTtcblxuICAgIC8vIENvbW1vbiBtYXRoIGNvbW1hbmRzIChhdm9pZCBnZW5lcmljIFxcdGV4dCBvciBcXHJlZi1vbmx5IGNhc2VzKVxuICAgIGNvbnN0IG1hdGhDb21tYW5kcyA9XG4gICAgICAgIC9cXFxcKGZyYWN8c3FydHxzdW18cHJvZHxpbnR8bGltfHNpbnxjb3N8dGFufGxvZ3xsbnxhbHBoYXxiZXRhfGdhbW1hfHBpfHRoZXRhfHNpZ21hfERlbHRhfGNkb3R8dGltZXN8bGVxfGdlcXxuZXEpXFxiLztcblxuICAgIC8vIFN1cGVyc2NyaXB0cy9zdWJzY3JpcHRzIGxpa2UgeF4yIG9yIGFfaVxuICAgIGNvbnN0IHN1cGVyU3ViU2NyaXB0ID0gL1thLXpBLVowLTldXFxzKltcXF5fXVxccypcXHs/Lis/XFx9Py87XG5cbiAgICByZXR1cm4gKFxuICAgICAgICBtYXRoRGVsaW1pdGVycy5zb21lKChyZSkgPT4gcmUudGVzdCh0ZXh0KSkgfHxcbiAgICAgICAgbWF0aENvbW1hbmRzLnRlc3QodGV4dCkgfHxcbiAgICAgICAgc3VwZXJTdWJTY3JpcHQudGVzdCh0ZXh0KVxuICAgICk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3dpdGNoKCkge1xuICAgIGNvbnN0IHRvZ2dsZVN3aXRjaCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVtZS1zd2l0Y2ggaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG4gICAgY29uc3QgY3VycmVudFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3RoZW1lJykgPyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA6IG51bGw7XG5cbiAgICBpZiAoY3VycmVudFRoZW1lKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCBjdXJyZW50VGhlbWUpO1xuXG4gICAgICAgIGlmIChjdXJyZW50VGhlbWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgdG9nZ2xlU3dpdGNoLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoVGhlbWUoKSB7XG5cblx0dmFyIGNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjaGVja2JveFwiKTtcbiAgICBpZiAoY2hlY2tCb3guY2hlY2tlZCA9PSB0cnVlKSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCAnZGFyaycpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGhlbWUnLCAnZGFyaycpOyAvL2FkZCB0aGlzXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2V0QXR0cmlidXRlKCdkYXRhLXRoZW1lJywgJ2xpZ2h0Jyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsICdsaWdodCcpOyAvL2FkZCB0aGlzXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgcnVuZXN0b25lX2ltcG9ydCB9IGZyb20gXCIuLi8uLi8uLi93ZWJwYWNrLmluZGV4LmpzXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5kZXJSdW5lc3RvbmVDb21wb25lbnQoXG4gICAgY29tcG9uZW50U3JjLFxuICAgIHdoZXJlRGl2LFxuICAgIG1vcmVPcHRzXG4pIHtcbiAgICAvKipcbiAgICAgKiAgVGhlIGVhc3kgcGFydCBpcyBhZGRpbmcgdGhlIGNvbXBvbmVudFNyYyB0byB0aGUgZXhpc3RpbmcgZGl2LlxuICAgICAqICBUaGUgdGVkaW91cyBwYXJ0IGlzIGNhbGxpbmcgdGhlIHJpZ2h0IGZ1bmN0aW9ucyB0byB0dXJuIHRoZVxuICAgICAqICBzb3VyY2UgaW50byB0aGUgYWN0dWFsIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBpZiAoIWNvbXBvbmVudFNyYykge1xuICAgICAgICBqUXVlcnkoYCMke3doZXJlRGl2fWApLmh0bWwoXG4gICAgICAgICAgICBgPHA+U29ycnksIG5vIHNvdXJjZSBpcyBhdmFpbGFibGUgZm9yIHByZXZpZXcuPC9wPmBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgcGF0dCA9IC8uLlxcL19pbWFnZXMvZztcbiAgICBjb21wb25lbnRTcmMgPSBjb21wb25lbnRTcmMucmVwbGFjZShcbiAgICAgICAgcGF0dCxcbiAgICAgICAgYCR7ZUJvb2tDb25maWcuYXBwfS9ib29rcy9wdWJsaXNoZWQvJHtlQm9va0NvbmZpZy5iYXNlY291cnNlfS9faW1hZ2VzYFxuICAgICk7XG4gICAgalF1ZXJ5KGAjJHt3aGVyZURpdn1gKS5odG1sKGNvbXBvbmVudFNyYyk7XG5cbiAgICBpZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcCA9IHt9O1xuICAgIH1cblxuICAgIGxldCBjb21wb25lbnRLaW5kID0gJCgkKGAjJHt3aGVyZURpdn0gW2RhdGEtY29tcG9uZW50XWApWzBdKS5kYXRhKFxuICAgICAgICBcImNvbXBvbmVudFwiXG4gICAgKTtcbiAgICAvLyBJbXBvcnQgdGhlIEphdmFTY3JpcHQgZm9yIHRoaXMgY29tcG9uZW50IGJlZm9yZSBwcm9jZWVkaW5nLlxuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoY29tcG9uZW50S2luZCk7XG4gICAgbGV0IG9wdCA9IHt9O1xuICAgIG9wdC5vcmlnID0galF1ZXJ5KGAjJHt3aGVyZURpdn0gW2RhdGEtY29tcG9uZW50XWApWzBdO1xuICAgIGlmIChvcHQub3JpZykge1xuICAgICAgICBvcHQubGFuZyA9ICQob3B0Lm9yaWcpLmRhdGEoXCJsYW5nXCIpO1xuICAgICAgICBvcHQudXNlUnVuZXN0b25lU2VydmljZXMgPSB0cnVlO1xuICAgICAgICBvcHQuZ3JhZGVyYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIG9wdC5weXRob24zID0gdHJ1ZTtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3JlT3B0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZm9yIChsZXQga2V5IGluIG1vcmVPcHRzKSB7XG4gICAgICAgICAgICAgICAgb3B0W2tleV0gPSBtb3JlT3B0c1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBhbGVydChcIkVycm9yOiAgTWlzc2luZyB0aGUgY29tcG9uZW50IGZhY3RvcnkhXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICF3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0gJiZcbiAgICAgICAgICAgICFqUXVlcnkoYCMke3doZXJlRGl2fWApLmh0bWwoKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGpRdWVyeShgIyR7d2hlcmVEaXZ9YCkuaHRtbChcbiAgICAgICAgICAgICAgICBgPHA+UHJldmlldyBub3QgYXZhaWxhYmxlIGZvciAke2NvbXBvbmVudEtpbmR9PC9wPmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgcmVzID0gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2NvbXBvbmVudEtpbmRdKG9wdCk7XG4gICAgICAgICAgICBpZiAoY29tcG9uZW50S2luZCA9PT0gXCJhY3RpdmVjb2RlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAobW9yZU9wdHMubXVsdGlHcmFkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke21vcmVPcHRzLmdyYWRpbmdDb250YWluZXJ9ICR7cmVzLmRpdmlkfWBcbiAgICAgICAgICAgICAgICAgICAgXSA9IHJlcztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW3Jlcy5kaXZpZF0gPSByZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGltZWRDb21wb25lbnQoY29tcG9uZW50U3JjLCBtb3JlT3B0cykge1xuICAgIC8qIFRoZSBpbXBvcnRhbnQgZGlzdGluY3Rpb24gaXMgdGhhdCB0aGUgY29tcG9uZW50IGRvZXMgbm90IHJlYWxseSBuZWVkIHRvIGJlIHJlbmRlcmVkXG4gICAgaW50byB0aGUgcGFnZSwgaW4gZmFjdCwgZHVlIHRvIHRoZSBhc3luYyBuYXR1cmUgb2YgZ2V0dGluZyB0aGUgc291cmNlIHRoZSBsaXN0IG9mIHF1ZXN0aW9uc1xuICAgIGlzIG1hZGUgYW5kIHRoZSBvcmlnaW5hbCBodG1sIGlzIHJlcGxhY2VkIGJ5IHRoZSBsb29rIG9mIHRoZSBleGFtLlxuICAgICovXG5cbiAgICBsZXQgcGF0dCA9IC8uLlxcL19pbWFnZXMvZztcbiAgICBjb21wb25lbnRTcmMgPSBjb21wb25lbnRTcmMucmVwbGFjZShcbiAgICAgICAgcGF0dCxcbiAgICAgICAgYCR7ZUJvb2tDb25maWcuYXBwfS9ib29rcy9wdWJsaXNoZWQvJHtlQm9va0NvbmZpZy5iYXNlY291cnNlfS9faW1hZ2VzYFxuICAgICk7XG5cbiAgICBsZXQgY29tcG9uZW50S2luZCA9ICQoJChjb21wb25lbnRTcmMpLmZpbmQoXCJbZGF0YS1jb21wb25lbnRdXCIpWzBdKS5kYXRhKFxuICAgICAgICBcImNvbXBvbmVudFwiXG4gICAgKTtcblxuICAgIGxldCBvcmlnSWQgPSAkKGNvbXBvbmVudFNyYykuZmluZChcIltkYXRhLWNvbXBvbmVudF1cIikuZmlyc3QoKS5hdHRyKFwiaWRcIik7XG5cbiAgICAvLyBEb3VibGUgY2hlY2sgLS0gaWYgdGhlIGNvbXBvbmVudCBzb3VyY2UgaXMgbm90IGluIHRoZSBET00sIHRoZW4gYnJpZWZseSBhZGQgaXRcbiAgICAvLyBhbmQgY2FsbCB0aGUgY29uc3RydWN0b3IuXG4gICAgbGV0IGhkaXY7XG4gICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcmlnSWQpKSB7XG4gICAgICAgIGhkaXYgPSAkKFwiPGRpdi8+XCIsIHtcbiAgICAgICAgICAgIGNzczogeyBkaXNwbGF5OiBcIm5vbmVcIiB9LFxuICAgICAgICB9KS5hcHBlbmRUbyhcImJvZHlcIik7XG4gICAgICAgIGhkaXYuaHRtbChjb21wb25lbnRTcmMpO1xuICAgIH1cbiAgICAvLyBhdCB0aGlzIHBvaW50IGhkaXYgaXMgYSBqcXVlcnkgb2JqZWN0XG5cbiAgICBsZXQgcmV0O1xuICAgIGxldCBvcHRzID0ge1xuICAgICAgICBvcmlnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvcmlnSWQpLFxuICAgICAgICB0aW1lZDogdHJ1ZSxcbiAgICB9O1xuICAgIGlmICh0eXBlb2YgbW9yZU9wdHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIG1vcmVPcHRzKSB7XG4gICAgICAgICAgICBvcHRzW2tleV0gPSBtb3JlT3B0c1trZXldO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvbXBvbmVudEtpbmQgaW4gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5KSB7XG4gICAgICAgIHJldCA9IHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtjb21wb25lbnRLaW5kXShvcHRzKTtcbiAgICB9XG5cbiAgICBsZXQgcmRpY3QgPSB7fTtcbiAgICByZGljdC5xdWVzdGlvbiA9IHJldDtcbiAgICByZXR1cm4gcmRpY3Q7XG59XG5cbi8vIEZvciBpbnRlZ3JhdGlvbiB3aXRoIHRoZSBSZWFjdCBvdmVyaGF1bHQgb2YgUHJldGV4dFxuLy8gMS4gRGlzYWJsZSB0aGUgYXV0b21hdGljIGluc3RhbnRpYXRpb24gYXQgdGhlIGVuZCBvZiBlYWNoIGNvbXBvbmVudC5qc1xuLy8gMi4gcmVhY3Qgd2lsbCBzZWFyY2ggZm9yIGFsbCBcIi5ydW5lc3RvbmVcIiBhbmQgd2lsbCBjYWxsIHRoaXMgZnVuY3Rpb24gZm9yIGVhY2ggb2YgdGhlbS5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZW5kZXJPbmVDb21wb25lbnQocnNEaXYpIHtcbiAgICAvLyBGaW5kIHRoZSBhY3R1YWwgY29tcG9uZW50IGluc2lkZSB0aGUgcnVuZXN0b25lIGNvbXBvbmVudC5cbiAgICBsZXQgY29tcG9uZW50ID0gcnNEaXYucXVlcnlTZWxlY3RvcihcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgaWYgKGNvbXBvbmVudCA9PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVuZGVyIHdhcyBjYWxsZWQgZm9yIGEgY29tcG9uZW50LCBidXQgbm93IFtkYXRhLWNvbXBvbmVudF0gYXR0cmlidXRlIGlzIHByZXNlbnQuIFRoaXMgbWF5IG1lYW4gdGhlIGNvbXBvbmVudCBoYXMgYWxyZWFkeSBiZWVuIHJlbmRlcmVkLlwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjb21wb25lbnRLaW5kID0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50O1xuICAgIGF3YWl0IHJ1bmVzdG9uZV9pbXBvcnQoY29tcG9uZW50S2luZCk7XG4gICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGRpdmlkID0gY29tcG9uZW50LmlkO1xuICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtkaXZpZF0gPSB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbXG4gICAgICAgICAgICAgICAgY29tcG9uZW50S2luZFxuICAgICAgICAgICAgXSh7XG4gICAgICAgICAgICAgICAgb3JpZzogY29tcG9uZW50LFxuICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgJHtjb21wb25lbnRLaW5kfSBQcm9ibGVtICR7dGhpcy5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==