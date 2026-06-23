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
/* harmony import */ var bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bootstrap/dist/js/bootstrap.js */ 52754);
/* harmony import */ var bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bootstrap_dist_js_bootstrap_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _ptxrs_bootstrap_less__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ptxrs-bootstrap.less */ 69041);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./runestone/common/project_template/_templates/plugin_layouts/sphinx_bootstrap/static/bootstrap-sphinx.js */ 3403);
/* harmony import */ var _runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_project_template_templates_plugin_layouts_sphinx_bootstrap_static_bootstrap_sphinx_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _runestone_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./runestone/common/js/bookfuncs.js */ 83057);
/* harmony import */ var _runestone_common_js_user_highlights_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./runestone/common/js/user-highlights.js */ 59782);
/* harmony import */ var _runestone_common_js_pretext_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./runestone/common/js/pretext.js */ 19359);
/* harmony import */ var _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./runestone/common/js/theme.js */ 94564);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./runestone/common/js/presenter_mode.js */ 19695);
/* harmony import */ var _runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_runestone_common_js_presenter_mode_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _runestone_common_css_presenter_mode_less__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./runestone/common/css/presenter_mode.less */ 45631);
/* harmony import */ var _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./runestone/common/js/renderComponent.js */ 98098);
/* harmony import */ var _runestone_common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./runestone/common/js/runestonebase.js */ 78673);
/* harmony import */ var _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./runestone/splice/js/spliceWrapper.ts */ 67799);
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



// i18n is now handled by the dependency-free runestone/common/js/rsi18n.js;
// the vendored Wikimedia jquery.i18n plugin has been removed.

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
    activecode: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_common_js_rsi18n_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/activecode/js/acfactory.js */ 49917)),
    // Always import the timed version of a component if available, since the timed components also define the component's factory and include the component as well. Note that ``acfactory`` imports the timed components of ActiveCode, so it follows this pattern.
    clickablearea: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_clickableArea_css_clickable_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/clickableArea/js/timedclickable.js */ 44892)),
    codelens: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_codelens_js_codelens_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/codelens/js/codelens.js */ 76412)),
    datafile: () => __webpack_require__.e(/*! import() */ "runestone_datafile_js_datafile_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/datafile/js/datafile.js */ 33580)),
    dragndrop: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_common_js_rsi18n_js-runestone_dragndrop_css_dragndrop_less")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/dragndrop/js/timeddnd.js */ 17558)),
    fillintheblank: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_common_js_rsi18n_js-runestone_fitb_css_fitb_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/fitb/js/timedfitb.js */ 1103)),
    groupsub: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_select2_dist_css_select2_css-node_modules_select2_dist_js_select2_min_js"), __webpack_require__.e("runestone_groupsub_js_groupsub_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/groupsub/js/groupsub.js */ 24616)),
    matching: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_matching_css_matching_less")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/matching/js/matching.js */ 17352)),
    multiplechoice: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_mchoice_css_mchoice_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/mchoice/js/timedmc.js */ 86001)),
    hparsons: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_micro-parsons_micro-parsons_micro-parsons_js-node_modules_micro-parsons_-974bff"), __webpack_require__.e("runestone_parsons_js_parsons-i18n_en_js-runestone_parsons_js_parsons-i18n_pt-br_js-runestone_-40cb1f"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_hparsons_js_hparsons_js-node_modules_mic-5ea6d2")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/hparsons/js/hparsons.js */ 47272)),
    parsons: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_parsons_js_parsons-i18n_en_js-runestone_parsons_js_parsons-i18n_pt-br_js-runestone_-40cb1f"), __webpack_require__.e("runestone_parsons_js_timedparsons_js")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/parsons/js/timedparsons.js */ 23405)),
    poll: () => __webpack_require__.e(/*! import() */ "runestone_poll_js_poll_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/poll/js/poll.js */ 11168)),
    selectquestion: () => Promise.all(/*! import() */[__webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_selectquestion_css_selectquestion_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/selectquestion/js/selectone.js */ 10662)),
    shortanswer: () =>
        Promise.all(/*! import() */[__webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_shortanswer_css_shortanswer_css")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/shortanswer/js/timed_shortanswer.js */ 68950)),
    showeval: () => __webpack_require__.e(/*! import() */ "runestone_showeval_js_showEval_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/showeval/js/showEval.js */ 8824)),
    tabbedStuff: () => __webpack_require__.e(/*! import() */ "runestone_tabbedStuff_js_tabbedstuff_js").then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/tabbedStuff/js/tabbedstuff.js */ 76442)),
    timedAssessment: () => Promise.all(/*! import() */[__webpack_require__.e("vendors-node_modules_handsontable_es_index_js-node_modules_handsontable_dist_handsontable_ful-dcc440"), __webpack_require__.e("vendors-node_modules_byte-base64_lib_js-node_modules_codemirror_addon_comment_comment_js-node-8b2590"), __webpack_require__.e("runestone_codelens_js_pytutor-embed_bundle_js"), __webpack_require__.e("runestone_parsons_js_parsons-i18n_en_js-runestone_parsons_js_parsons-i18n_pt-br_js-runestone_-40cb1f"), __webpack_require__.e("node_modules_moment_locale_sync_recursive_-runestone_activecode_js_acfactory_js-node_modules_-ef73b3"), __webpack_require__.e("runestone_parsons_js_timedparsons_js"), __webpack_require__.e("runestone_fitb_js_timedfitb_js"), __webpack_require__.e("runestone_dragndrop_js_timeddnd_js"), __webpack_require__.e("runestone_mchoice_js_timedmc_js"), __webpack_require__.e("runestone_matching_js_matching_js"), __webpack_require__.e("runestone_selectquestion_js_selectone_js"), __webpack_require__.e("runestone_clickableArea_js_timedclickable_js"), __webpack_require__.e("runestone_shortanswer_js_timed_shortanswer_js"), __webpack_require__.e("runestone_timed_js_timed_js-runestone_dragndrop_css_dragndrop_less-runestone_matching_css_mat-2709ac")]).then(__webpack_require__.bind(__webpack_require__, /*! ./runestone/timed/js/timed.js */ 4968)),
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

var splice = new _runestone_splice_js_spliceWrapper_ts__WEBPACK_IMPORTED_MODULE_14__.SpliceWrapper();

// Manual exports
// ==============
// Webpack's ``output.library`` setting doesn't seem to work with the split chunks plugin; do all exports manually through the ``window`` object instead.

const rc = {};
rc.runestone_import = runestone_import;
rc.runestone_auto_import = runestone_auto_import;
rc.getSwitch = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_9__.getSwitch;
rc.switchTheme = _runestone_common_js_theme_js__WEBPACK_IMPORTED_MODULE_9__.switchTheme;
rc.popupScratchAC = popupScratchAC;
rc.renderOneComponent = _runestone_common_js_renderComponent_js__WEBPACK_IMPORTED_MODULE_12__.renderOneComponent;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LXJ1bmVzdG9uZS5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DOztBQUVuQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ25JRDtBQUNBOztBQUVBOztBQUUrQzs7QUFFL0M7QUFDQSxpQkFBaUIseURBQWE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsOENBQThDO0FBQzVFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDZDQUE2QztBQUMvRTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsMkNBQTJDO0FBQ3pFLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7OztBQ3ZERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUMsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUQ7QUFDckQ7O0FBRUE7QUFDQTtBQUNlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLEtBQUksb0JBQW9CLENBQUs7QUFDMUQsNkJBQTZCLEtBQUksb0JBQW9CLENBQUs7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLFFBQVE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsOERBQW1CO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNENBQTRDO0FBQ2hFLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ087QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvREFBb0QsTUFBTTs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVvQ087QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QjZEOztBQUV0RDtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQixtQkFBbUIsdUJBQXVCO0FBQ3JFO0FBQ0EsZUFBZSxTQUFTOztBQUV4QjtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDLFVBQVU7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsVUFBVSxtRUFBZ0I7QUFDMUI7QUFDQSwwQkFBMEIsVUFBVTtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0EsdUJBQXVCLFNBQVM7QUFDaEMsZ0RBQWdELGNBQWM7QUFDOUQ7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsMkJBQTJCLEVBQUUsVUFBVTtBQUNsRTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGdCQUFnQixtQkFBbUIsdUJBQXVCO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQyxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxtRUFBZ0I7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDViwyQ0FBMkMsZUFBZSxVQUFVO0FBQ3BFLG9DQUFvQyxJQUFJO0FBQ3hDO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL3Byb2plY3RfdGVtcGxhdGUvX3RlbXBsYXRlcy9wbHVnaW5fbGF5b3V0cy9zcGhpbnhfYm9vdHN0cmFwL3N0YXRpYy9ib290c3RyYXAtc3BoaW54LmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvY29tbW9uL2pzL3ByZXRleHQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcHJlc2VudGVyX21vZGUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy9leHRlcm5hbCB2YXIgXCJqUXVlcnlcIiIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9jc3MvcHJlc2VudGVyX21vZGUubGVzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvanF1ZXJ5LmlkbGUtdGltZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zcGxpY2UvanMvc3BsaWNlV3JhcHBlci50cyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcHR4cnMtYm9vdHN0cmFwLmxlc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vY3NzL3VzZXItaGlnaGxpZ2h0cy5jc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vd2VicGFjay5pbmRleC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvbW1vbi9qcy9ib29rZnVuY3MuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvdGhlbWUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb21tb24vanMvcmVuZGVyQ29tcG9uZW50LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoJCkge1xuICAvKipcbiAgICogUGF0Y2ggVE9DIGxpc3QuXG4gICAqXG4gICAqIFdpbGwgbXV0YXRlIHRoZSB1bmRlcmx5aW5nIHNwYW4gdG8gaGF2ZSBhIGNvcnJlY3QgdWwgZm9yIG5hdi5cbiAgICpcbiAgICogQHBhcmFtICRzcGFuOiBTcGFuIGNvbnRhaW5pbmcgbmVzdGVkIFVMJ3MgdG8gbXV0YXRlLlxuICAgKiBAcGFyYW0gbWluTGV2ZWw6IFN0YXJ0aW5nIGxldmVsIGZvciBuZXN0ZWQgbGlzdHMuICgxOiBnbG9iYWwsIDI6IGxvY2FsKS5cbiAgICovXG4gIHZhciBwYXRjaFRvYyA9IGZ1bmN0aW9uICgkdWwsIG1pbkxldmVsKSB7XG4gICAgdmFyIGZpbmRBLFxuICAgICAgcGF0Y2hUYWJsZXMsXG4gICAgICAkbG9jYWxMaTtcblxuICAgIC8vIEZpbmQgYWxsIGEgXCJpbnRlcm5hbFwiIHRhZ3MsIHRyYXZlcnNpbmcgcmVjdXJzaXZlbHkuXG4gICAgZmluZEEgPSBmdW5jdGlvbiAoJGVsZW0sIGxldmVsKSB7XG4gICAgICBsZXZlbCA9IGxldmVsIHx8IDA7XG4gICAgICB2YXIgJGl0ZW1zID0gJGVsZW0uZmluZChcIj4gbGkgPiBhLmludGVybmFsLCA+IHVsLCA+IGxpID4gdWxcIik7XG5cbiAgICAgIC8vIEl0ZXJhdGUgZXZlcnl0aGluZyBpbiBvcmRlci5cbiAgICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICB2YXIgJGl0ZW0gPSAkKGl0ZW0pLFxuICAgICAgICAgIHRhZyA9IGl0ZW0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICRjaGlsZHJlbkxpID0gJGl0ZW0uY2hpbGRyZW4oJ2xpJyksXG4gICAgICAgICAgJHBhcmVudExpID0gJCgkaXRlbS5wYXJlbnQoJ2xpJyksICRpdGVtLnBhcmVudCgpLnBhcmVudCgnbGknKSk7XG5cbiAgICAgICAgLy8gQWRkIGRyb3Bkb3ducyBpZiBtb3JlIGNoaWxkcmVuIGFuZCBhYm92ZSBtaW5pbXVtIGxldmVsLlxuICAgICAgICBpZiAodGFnID09PSAndWwnICYmIGxldmVsID49IG1pbkxldmVsICYmICRjaGlsZHJlbkxpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAkcGFyZW50TGlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnZHJvcGRvd24tc3VibWVudScpXG4gICAgICAgICAgICAuY2hpbGRyZW4oJ2EnKS5maXJzdCgpLmF0dHIoJ3RhYmluZGV4JywgLTEpO1xuXG4gICAgICAgICAgJGl0ZW0uYWRkQ2xhc3MoJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRBKCRpdGVtLCBsZXZlbCArIDEpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGZpbmRBKCR1bCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhdGNoIGFsbCB0YWJsZXMgdG8gcmVtb3ZlIGBgZG9jdXRpbHNgYCBjbGFzcyBhbmQgYWRkIEJvb3RzdHJhcCBiYXNlXG4gICAqIGBgdGFibGVgYCBjbGFzcy5cbiAgICovXG4gIHBhdGNoVGFibGVzID0gZnVuY3Rpb24gKCkge1xuICAgICQoXCJ0YWJsZS5kb2N1dGlsc1wiKVxuICAgICAgLnJlbW92ZUNsYXNzKFwiZG9jdXRpbHNcIilcbiAgICAgIC5hZGRDbGFzcyhcInRhYmxlXCIpXG4gICAgICAuYXR0cihcImJvcmRlclwiLCAwKTtcbiAgfTtcblxuJChmdW5jdGlvbiAoKSB7XG5cbiAgICAvKlxuICAgICAqIFNjcm9sbCB0aGUgd2luZG93IHRvIGF2b2lkIHRoZSB0b3BuYXYgYmFyXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3aXR0ZXIvYm9vdHN0cmFwL2lzc3Vlcy8xNzY4XG4gICAgICovXG4gICAgaWYgKCQoXCIjbmF2YmFyLm5hdmJhci1maXhlZC10b3BcIikubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIG5hdkhlaWdodCA9ICQoXCIjbmF2YmFyXCIpLmhlaWdodCgpLFxuICAgICAgICBzaGlmdFdpbmRvdyA9IGZ1bmN0aW9uKCkgeyBzY3JvbGxCeSgwLCAtbmF2SGVpZ2h0IC0gMTApOyB9O1xuXG4gICAgICBpZiAobG9jYXRpb24uaGFzaCkge1xuICAgICAgICBzaGlmdFdpbmRvdygpO1xuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgc2hpZnRXaW5kb3cpO1xuICAgIH1cblxuICAgIC8vIEFkZCBzdHlsaW5nLCBzdHJ1Y3R1cmUgdG8gVE9DJ3MuXG4gICAgJChcIi5kcm9wZG93bi1tZW51XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgJCh0aGlzKS5maW5kKFwidWxcIikuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pe1xuICAgICAgICB2YXIgJGl0ZW0gPSAkKGl0ZW0pO1xuICAgICAgICAkaXRlbS5hZGRDbGFzcygndW5zdHlsZWQnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gR2xvYmFsIFRPQy5cbiAgICBpZiAoJChcInVsLmdsb2JhbHRvYyBsaVwiKS5sZW5ndGgpIHtcbiAgICAgIHBhdGNoVG9jKCQoXCJ1bC5nbG9iYWx0b2NcIiksIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZW1vdmUgR2xvYmFsIFRPQy5cbiAgICAgICQoXCIuZ2xvYmFsdG9jLWNvbnRhaW5lclwiKS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICAvLyBMb2NhbCBUT0MuXG4gICAgcGF0Y2hUb2MoJChcInVsLmxvY2FsdG9jXCIpLCAyKTtcblxuICAgIC8vIE11dGF0ZSBzdWItbGlzdHMgKGZvciBicy0yLjMuMCkuXG4gICAgJChcIi5kcm9wZG93bi1tZW51IHVsXCIpLm5vdChcIi5kcm9wZG93bi1tZW51XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR1bCA9ICQodGhpcyksXG4gICAgICAgICRwYXJlbnQgPSAkdWwucGFyZW50KCksXG4gICAgICAgIHRhZyA9ICRwYXJlbnRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAka2lkcyA9ICR1bC5jaGlsZHJlbigpLmRldGFjaCgpO1xuXG4gICAgICAvLyBSZXBsYWNlIGxpc3Qgd2l0aCBpdGVtcyBpZiBzdWJtZW51IGhlYWRlci5cbiAgICAgIGlmICh0YWcgPT09IFwidWxcIikge1xuICAgICAgICAkdWwucmVwbGFjZVdpdGgoJGtpZHMpO1xuICAgICAgfSBlbHNlIGlmICh0YWcgPT09IFwibGlcIikge1xuICAgICAgICAvLyBJbnNlcnQgaW50byBwcmV2aW91cyBsaXN0LlxuICAgICAgICAkcGFyZW50LmFmdGVyKCRraWRzKTtcbiAgICAgICAgJHVsLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGRpdmlkZXIgaW4gcGFnZSBUT0MuXG4gICAgJGxvY2FsTGkgPSAkKFwidWwubG9jYWx0b2MgbGlcIik7XG4gICAgaWYgKCRsb2NhbExpLmxlbmd0aCA+IDIpIHtcbiAgICAgICRsb2NhbExpLmZpcnN0KCkuYWZ0ZXIoJzxsaSBjbGFzcz1cImRpdmlkZXJcIj48L2xpPicpO1xuICAgIH1cblxuICAgIC8vIEVuYWJsZSBkcm9wZG93bi5cbiAgICAkKCcuZHJvcGRvd24tdG9nZ2xlJykuZHJvcGRvd24oKTtcblxuICAgIC8vIFBhdGNoIHRhYmxlcy5cbiAgICBwYXRjaFRhYmxlcygpO1xuXG4gICAgLy8gQWRkIE5vdGUsIFdhcm5pbmcgc3R5bGVzLlxuICAgICQoJ2Rpdi5ub3RlJykuYWRkQ2xhc3MoJ2FsZXJ0JykuYWRkQ2xhc3MoJ2FsZXJ0LWluZm8nKTtcbiAgICAkKCdkaXYud2FybmluZycpLmFkZENsYXNzKCdhbGVydCcpLmFkZENsYXNzKCdhbGVydC13YXJuaW5nJyk7XG5cbiAgICAvLyBJbmxpbmUgY29kZSBzdHlsZXMgdG8gQm9vdHN0cmFwIHN0eWxlLlxuICAgICQoJ3R0LmRvY3V0aWxzLmxpdGVyYWwnKS5ub3QoXCIueHJlZlwiKS5lYWNoKGZ1bmN0aW9uIChpLCBlKSB7XG4gICAgICAvLyBpZ25vcmUgcmVmZXJlbmNlc1xuICAgICAgaWYgKCEkKGUpLnBhcmVudCgpLmhhc0NsYXNzKFwicmVmZXJlbmNlXCIpKSB7XG4gICAgICAgICQoZSkucmVwbGFjZVdpdGgoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkKFwiPGNvZGUgLz5cIikudGV4dCgkKHRoaXMpLnRleHQoKSk7XG4gICAgICAgIH0pO1xuICAgICAgfX0pO1xuICB9KTtcbn0od2luZG93LmpRdWVyeSkpO1xuIiwiLypcbiAgICBTdXBwb3J0IGZ1bmN0aW9ucyBmb3IgUHJlVGVYdCBib29rcyBydW5uaW5nIG9uIFJ1bmVzdG9uZVxuXG4qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi9ydW5lc3RvbmViYXNlLmpzXCI7XG5cbmZ1bmN0aW9uIHNldHVwUFRYRXZlbnRzKCkge1xuICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgLy8gbG9nIGFuIGV2ZW50IHdoZW4gYSBrbm93bCBpcyBvcGVuZWQuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWtub3dsXVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbGV0IGRpdl9pZCA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEta25vd2xcIik7XG4gICAgICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJrbm93bFwiLCBhY3Q6IFwiY2xpY2tcIiwgZGl2X2lkOiBkaXZfaWQgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGxldCBib3JuX2hpZGRlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJkZXRhaWxzLmJvcm4taGlkZGVuLWtub3dsXCIpO1xuICAgIGJvcm5faGlkZGVuLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIC8vIGxvZyBhbiBldmVudCB3aGVuIGEga25vd2wgaXMgb3BlbmVkIHRoYXQgd2FzIGJvcm4gaGlkZGVuXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b2dnbGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGVsLm9wZW4pIHtcbiAgICAgICAgICAgICAgICBsZXQgZGl2X2lkID0gZWwuaWQ7XG4gICAgICAgICAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwia25vd2xcIiwgYWN0OiBcIm9wZW5cIiwgZGl2X2lkOiBkaXZfaWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8vIGxvZyBhbiBldmVudCB3aGVuIGEgc2FnZSBjZWxsIGlzIGV2YWx1YXRlZFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2FnZWNlbGxfZXZhbEJ1dHRvblwiKS5mb3JFYWNoKChidG4pID0+IHtcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyID0gYnRuLmNsb3Nlc3QoXCIucHR4LXNhZ2VjZWxsXCIpO1xuICAgICAgICAgICAgbGV0IGNvZGVJbnB1dCA9IGNvbnRhaW5lciA/IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiLnNhZ2VjZWxsX2lucHV0XCIpIDogbnVsbDtcbiAgICAgICAgICAgIGxldCBjb2RlID0gY29kZUlucHV0ID8gY29kZUlucHV0LnRleHRDb250ZW50IDogXCJcIjtcbiAgICAgICAgICAgIGxldCBkaXZfaWQgPSBjb250YWluZXIgPyBjb250YWluZXIuaWQgOiBudWxsO1xuICAgICAgICAgICAgaWYgKCEgZGl2X2lkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQ291bGQgbm90IGZpbmQgY29udGFpbmVyIG9yIGRpdl9pZCBmb3Igc2FnZWNlbGwgYnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcInNhZ2VcIiwgYWN0OiBcInJ1blwiLCBkaXZfaWQ6IGRpdl9pZCB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHR5cGVvZiBlQm9va0NvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiAhZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29tbWVudGFyeVwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coXCJzZXR0aW5nIHVwIHByZXRleHRcIik7XG4gICAgc2V0dXBQVFhFdmVudHMoKTtcbiAgICBsZXQgd3JhcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJpbWFyeS1uYXZiYXItc3RpY2t5LXdyYXBwZXJcIik7XG4gICAgaWYgKHdyYXApIHtcbiAgICAgICAgd3JhcC5zdHlsZS5vdmVyZmxvdyA9IFwidmlzaWJsZVwiO1xuICAgIH1cbn0pO1xuIiwidmFyIGNvZGVFeGVyY2lzZXM7XG52YXIgcHJlc2VudGVyQ3NzTGluaztcbnZhciBwcmVzZW50TW9kZUluaXRpYWxpemVkID0gZmFsc2U7XG5cbmZ1bmN0aW9uIHByZXNlbnRUb2dnbGUoKSB7XG4gICAgaWYgKCFwcmVzZW50TW9kZUluaXRpYWxpemVkKSB7XG4gICAgICAgIHByZXNlbnRNb2RlU2V0dXAoKTtcbiAgICAgICAgcHJlc2VudE1vZGVJbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICAgIGxldCBib2QgPSAkKFwiYm9keVwiKTtcbiAgICBsZXQgcHJlc2VudENsYXNzID0gXCJwcmVzZW50XCI7XG4gICAgbGV0IGZ1bGxIZWlnaHRDbGFzcyA9IFwiZnVsbC1oZWlnaHRcIjtcbiAgICBsZXQgYm90dG9tQ2xhc3MgPSBcImJvdHRvbVwiO1xuICAgIGlmIChib2QuaGFzQ2xhc3MocHJlc2VudENsYXNzKSkge1xuICAgICAgICAkKFwic2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIHNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpOyAvL3Nob3cgZXZlcnl0aGluZ1xuICAgICAgICAkKFwiI2NvbXBsZXRpb25CdXR0b25cIikucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGJvZC5yZW1vdmVDbGFzcyhwcmVzZW50Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgZnVsbEhlaWdodENsYXNzKS5yZW1vdmVDbGFzcyhmdWxsSGVpZ2h0Q2xhc3MpO1xuICAgICAgICAkKFwiLlwiICsgYm90dG9tQ2xhc3MpLnJlbW92ZUNsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBcInRleHRcIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIHByZXNlbnRlckNzc0xpbmsuZGlzYWJsZWQgPSB0cnVlOyAvLyBkaXNhYmxlIHByZXNlbnRfbW9kZS5jc3NcbiAgICB9IGVsc2Uge1xuICAgICAgICAkKFwic2VjdGlvbiAqXCIpXG4gICAgICAgICAgICAubm90KFxuICAgICAgICAgICAgICAgIFwiaDEsIC5wcmVzZW50YXRpb24tdGl0bGUsIC5idG4tcHJlc2VudGVyLCAucnVuZXN0b25lLCAucnVuZXN0b25lICosIHNlY3Rpb24sIC5wcmUsIGNvZGVcIlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmFkZENsYXNzKFwiaGlkZGVuXCIpOyAvLyBoaWRlIGV4dHJhbmVvdXMgc3R1ZmZcbiAgICAgICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmFkZENsYXNzKFwiaGlkZGVuXCIpO1xuICAgICAgICBib2QuYWRkQ2xhc3MocHJlc2VudENsYXNzKTtcbiAgICAgICAgYm9kLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKGZ1bGxIZWlnaHRDbGFzcyk7XG4gICAgICAgICQoXCJzZWN0aW9uIC5ydW5lc3RvbmVcIikuYWRkQ2xhc3MoZnVsbEhlaWdodENsYXNzKTtcbiAgICAgICAgJChcIi5hYy1jYXB0aW9uXCIpLmFkZENsYXNzKGJvdHRvbUNsYXNzKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcmVzZW50TW9kZVwiLCBwcmVzZW50Q2xhc3MpO1xuICAgICAgICAvLyBwcmVzZW50ZXJfbW9kZS5jc3MgaXMgbG9hZGVkIGJ5IHdlYnBhY2tcbiAgICAgICAgLy9sb2FkUHJlc2VudGVyQ3NzKCk7IC8vIHByZXNlbnRfbW9kZS5jc3Mgc2hvdWxkIG9ubHkgYXBwbHkgd2hlbiBpbiBwcmVzZW50ZXIgbW9kZS5cbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbG9hZFByZXNlbnRlckNzcygpIHtcbiAgICBwcmVzZW50ZXJDc3NMaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgcHJlc2VudGVyQ3NzTGluay50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgIHByZXNlbnRlckNzc0xpbmsuaHJlZiA9IFwiLi4vX3N0YXRpYy9wcmVzZW50ZXJfbW9kZS5sZXNzXCI7XG4gICAgcHJlc2VudGVyQ3NzTGluay5yZWwgPSBcInN0eWxlc2hlZXRcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQocHJlc2VudGVyQ3NzTGluayk7XG59XG5cbmZ1bmN0aW9uIHByZXNlbnRNb2RlU2V0dXAoKSB7XG4gICAgLy8gbW92ZWQgdGhpcyBvdXQgb2YgY29uZmlndXJlXG4gICAgbGV0IGRhdGFDb21wb25lbnQgPSAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpO1xuXG4gICAgLy8gdGhpcyBzdGlsbCBsZWF2ZXMgc29tZSB0aGluZ3Mgc2VtaS1tZXNzZWQgdXAgd2hlbiB5b3UgZXhpdCBwcmVzZW50ZXIgbW9kZS5cbiAgICAvLyBidXQgaW5zdHJ1Y3RvcnMgd2lsbCBwcm9iYWJseSBqdXN0IGxlYXJuIHRvIHJlZnJlc2ggdGhlIHBhZ2UuXG4gICAgZGF0YUNvbXBvbmVudC5hZGRDbGFzcyhcInJ1bmVzdG9uZVwiKTtcbiAgICBkYXRhQ29tcG9uZW50LnBhcmVudCgpLmNsb3Nlc3QoXCJkaXZcIikubm90KFwic2VjdGlvblwiKS5hZGRDbGFzcyhcInJ1bmVzdG9uZVwiKTtcbiAgICBkYXRhQ29tcG9uZW50LnBhcmVudCgpLmNsb3Nlc3QoXCJkaXZcIikuY3NzKFwibWF4LXdpZHRoXCIsIFwibm9uZVwiKTtcblxuICAgIGRhdGFDb21wb25lbnQuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgbGV0IG1lID0gJCh0aGlzKTtcbiAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgLmZpbmQoXCIuYWNfY29kZV9kaXYsIC5hY19vdXRwdXRcIilcbiAgICAgICAgICAgIC53cmFwQWxsKFwiPGRpdiBjbGFzcz0nYWMtYmxvY2snIHN0eWxlPSd3aWR0aDogMTAwJTsnPjwvZGl2PlwiKTtcbiAgICB9KTtcblxuICAgIGNvZGVsZW5zTGlzdGVuZXIoNTAwKTtcbiAgICAkKFwic2VjdGlvbiBpbWdcIikud3JhcCgnPGRpdiBjbGFzcz1cInJ1bmVzdG9uZVwiPicpO1xuICAgIGNvZGVFeGVyY2lzZXMgPSAkKFwiLnJ1bmVzdG9uZVwiKS5ub3QoXCIucnVuZXN0b25lIC5ydW5lc3RvbmVcIik7XG4gICAgLy8gY29kZUV4ZXJjaXNlcy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgJChcImgxXCIpLmJlZm9yZShcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcmVzZW50YXRpb24tdGl0bGUnPiBcXFxuICAgICAgICA8YnV0dG9uIGNsYXNzPSdwcmV2LWV4ZXJjaXNlIGJ0bi1wcmVzZW50ZXIgYnRuLWdyZXktb3V0bGluZScgb25jbGljaz0ncHJldkV4ZXJjaXNlKCknPkJhY2s8L2J1dHRvbj4gXFxcbiAgICAgICAgPGJ1dHRvbiBjbGFzcz0nbmV4dC1leGVyY2lzZSBidG4tcHJlc2VudGVyIGJ0bi1ncmV5LXNvbGlkJyBvbmNsaWNrPSduZXh0RXhlcmNpc2UoKSc+TmV4dDwvYnV0dG9uPiBcXFxuICAgICAgPC9kaXY+XCJcbiAgICApO1xufVxuZnVuY3Rpb24gZ2V0QWN0aXZlRXhlcmNpc2UoKSB7XG4gICAgcmV0dXJuIChhY3RpdmUgPSBjb2RlRXhlcmNpc2VzLmZpbHRlcihcIi5hY3RpdmVcIikpO1xufVxuXG5mdW5jdGlvbiBhY3RpdmF0ZUV4ZXJjaXNlKGluZGV4KSB7XG4gICAgaWYgKHR5cGVvZiBpbmRleCA9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGluZGV4ID0gMDtcbiAgICB9XG5cbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcblxuICAgIGlmIChjb2RlRXhlcmNpc2VzLmxlbmd0aCkge1xuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGFjdGl2ZSA9ICQoY29kZUV4ZXJjaXNlc1tpbmRleF0pLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICBhY3RpdmUucmVtb3ZlQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgICAgIGNvZGVFeGVyY2lzZXMubm90KGNvZGVFeGVyY2lzZXMuZmlsdGVyKFwiLmFjdGl2ZVwiKSkuYWRkQ2xhc3MoXCJoaWRkZW5cIik7XG4gICAgfVxufVxuXG53aW5kb3cubmV4dEV4ZXJjaXNlID0gZnVuY3Rpb24oKSB7XG4gICAgbGV0IGFjdGl2ZSA9IGdldEFjdGl2ZUV4ZXJjaXNlKCk7XG4gICAgbGV0IG5leHRJbmRleCA9IGNvZGVFeGVyY2lzZXMuaW5kZXgoYWN0aXZlKSArIDE7XG4gICAgaWYgKG5leHRJbmRleCA8IGNvZGVFeGVyY2lzZXMubGVuZ3RoKSB7XG4gICAgICAgIGFjdGl2YXRlRXhlcmNpc2UobmV4dEluZGV4KTtcbiAgICB9XG59XG5cbndpbmRvdy5wcmV2RXhlcmNpc2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgYWN0aXZlID0gZ2V0QWN0aXZlRXhlcmNpc2UoKTtcbiAgICBsZXQgcHJldkluZGV4ID0gY29kZUV4ZXJjaXNlcy5pbmRleChhY3RpdmUpIC0gMTtcbiAgICBpZiAocHJldkluZGV4ID49IDApIHtcbiAgICAgICAgYWN0aXZhdGVFeGVyY2lzZShwcmV2SW5kZXgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gY29uZmlndXJlKCkge1xuICAgIGxldCByaWdodE5hdiA9ICQoXCIubmF2YmFyLXJpZ2h0XCIpO1xuICAgIHJpZ2h0TmF2LnByZXBlbmQoXG4gICAgICAgIFwiPGxpIGNsYXNzPSdkcm9wZG93biB2aWV3LXRvZ2dsZSc+IFxcXG4gICAgICA8bGFiZWw+VmlldzogXFxcbiAgICAgICAgPHNlbGVjdCBjbGFzcz0nbW9kZS1zZWxlY3QnPiBcXFxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3RleHQnPlRleHRib29rPC9vcHRpb24+IFxcXG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT0ncHJlc2VudCc+Q29kZSBQcmVzZW50ZXI8L29wdGlvbj4gXFxcbiAgICAgICAgPC9zZWxlY3Q+IFxcXG4gICAgICA8L2xhYmVsPiBcXFxuICAgIDwvbGk+XCJcbiAgICApO1xuXG4gICAgbGV0IG1vZGVTZWxlY3QgPSAkKFwiLm1vZGUtc2VsZWN0XCIpLmNoYW5nZShwcmVzZW50VG9nZ2xlKTtcbn1cblxuZnVuY3Rpb24gY29kZWxlbnNMaXN0ZW5lcihkdXJhdGlvbikge1xuICAgIC8vICQoXCIuRXhlY3V0aW9uVmlzdWFsaXplclwiKS5sZW5ndGggPyBjb25maWd1cmVDb2RlbGVucygpIDogc2V0VGltZW91dChjb2RlbGVuc0xpc3RlbmVyLCBkdXJhdGlvbik7XG4gICAgLy8gY29uZmlndXJlQ29kZWxlbnMoKTtcbn1cblxuZnVuY3Rpb24gY29uZmlndXJlQ29kZWxlbnMoKSB7XG4gICAgbGV0IGFjQ29kZVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGFjQ29kZVRpdGxlLnRleHRDb250ZW50ID0gXCJBY3RpdmUgQ29kZSBXaW5kb3dcIjtcbiAgICBsZXQgYWNDb2RlID0gJChcIi5hY19jb2RlX2RpdlwiKTtcbiAgICAkKFwiLmFjX2NvZGVfZGl2XCIpLmFkZENsYXNzKFwiY29sLW1kLTZcIik7XG4gICAgYWNDb2RlLnByZXBlbmQoYWNDb2RlVGl0bGUpO1xuXG4gICAgYWNPdXRUaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICBhY091dFRpdGxlLnRleHRDb250ZW50ID0gXCJPdXRwdXQgV2luZG93XCI7XG4gICAgbGV0IGFjT3V0ID0gJChcIi5hY19vdXRwdXRcIikuYWRkQ2xhc3MoXCJjb2wtbWQtNlwiKTtcbiAgICAkKFwiLmFjX291dHB1dFwiKS5wcmVwZW5kKGFjT3V0VGl0bGUpO1xuXG4gICAgbGV0IHNrZXRjaHBhZFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIHNrZXRjaHBhZFRpdGxlLnRleHRDb250ZW50ID0gXCJTa2V0Y2hwYWRcIjtcbiAgICBsZXQgc2tldGNocGFkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgJChza2V0Y2hwYWQpLmFkZENsYXNzKFwic2tldGNocGFkXCIpO1xuICAgIGxldCBza2V0Y2hwYWRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICQoc2tldGNocGFkQ29udGFpbmVyKS5hZGRDbGFzcyhcInNrZXRjaHBhZC1jb250YWluZXJcIik7XG4gICAgc2tldGNocGFkQ29udGFpbmVyLmFwcGVuZENoaWxkKHNrZXRjaHBhZFRpdGxlKTtcbiAgICBza2V0Y2hwYWRDb250YWluZXIuYXBwZW5kQ2hpbGQoc2tldGNocGFkKTtcbiAgICAvLyQoJy5hY19vdXRwdXQnKS5hcHBlbmQoc2tldGNocGFkQ29udGFpbmVyKTtcblxuICAgIGxldCB2aXN1YWxpemVycyA9ICQoXCIuRXhlY3V0aW9uVmlzdWFsaXplclwiKTtcblxuICAgIGNvbnNvbGUubG9nKFwiRWNvbnRhaW5lcjogXCIsIHRoaXMuZUNvbnRhaW5lcik7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLm9uKFwiY2xpY2tcIiwgXCJidXR0b24ucm93LW1vZGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoXCJbZGF0YS1jaGlsZGNvbXBvbmVudF1cIikucmVtb3ZlQ2xhc3MoXCJjYXJkLW1vZGVcIik7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5hZGRDbGFzcyhcInJvdy1tb2RlXCIpO1xuICAgICAgICAkKHRoaXMpLm5leHQoXCIuY2FyZC1tb2RlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLm9uKFwiY2xpY2tcIiwgXCJidXR0b24uY2FyZC1tb2RlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY2hpbGRjb21wb25lbnRdXCIpLnJlbW92ZUNsYXNzKFwicm93LW1vZGVcIik7XG4gICAgICAgICQodGhpcykuY2xvc2VzdChcIltkYXRhLWNoaWxkY29tcG9uZW50XVwiKS5hZGRDbGFzcyhcImNhcmQtbW9kZVwiKTtcbiAgICAgICAgJCh0aGlzKS5wcmV2KFwiLnJvdy1tb2RlXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlLWxheW91dFwiKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImFjdGl2ZS1sYXlvdXRcIik7XG4gICAgfSk7XG5cbiAgICAkKFwiW2RhdGEtY2hpbGRjb21wb25lbnRdIC5hY19zZWN0aW9uXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnByZXBlbmQoXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByZXNlbnRhdGlvbi1vcHRpb25zXCI+PGJ1dHRvbiBjbGFzcz1cInJvdy1tb2RlIGxheW91dC1idG5cIj48aW1nIHNyYz1cIi4uL19pbWFnZXMvcm93LWJ0bi1jb250ZW50LnBuZ1wiIGFsdD1cIlJvd3NcIj48L2J1dHRvbj48YnV0dG9uIGNsYXNzPVwiY2FyZC1tb2RlIGxheW91dC1idG5cIj48aW1nIHNyYz1cIi4uL19pbWFnZXMvY2FyZC1idG4tY29udGVudC5wbmdcIiBhbHQ9XCJDYXJkXCI+PC9idXR0b24+PC9kaXY+J1xuICAgICAgICApO1xuICAgIH0pO1xuXG4gICAgdmlzdWFsaXplcnMuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgbGV0IG1lID0gJCh0aGlzKTtcbiAgICAgICAgbGV0IGNvbDEgPSBtZS5maW5kKFwiI3ZpekxheW91dFRkRmlyc3RcIik7XG4gICAgICAgIGxldCBjb2wyID0gbWUuZmluZChcIiN2aXpMYXlvdXRUZFNlY29uZFwiKTtcbiAgICAgICAgbGV0IGRhdGFWaXMgPSBtZS5maW5kKFwiI2RhdGFWaXpcIik7XG4gICAgICAgIGxldCBzdGFja0hlYXBUYWJsZSA9IG1lLmZpbmQoXCIjc3RhY2tIZWFwVGFibGVcIik7XG4gICAgICAgIGxldCBvdXRwdXQgPSBtZS5maW5kKFwiI3Byb2dPdXRwdXRzXCIpO1xuICAgICAgICBvdXRwdXQuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xuICAgICAgICBtZS5wYXJlbnQoKS5wcmVwZW5kKFxuICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcmVzZW50YXRpb24tdGl0bGUnPjxkaXYgY2xhc3M9J3RpdGxlLXRleHQnPiBFeGFtcGxlIFwiICtcbiAgICAgICAgICAgICAgICAoTnVtYmVyKGluZGV4KSArIDEpICtcbiAgICAgICAgICAgICAgICBcIjwvZGl2PjwvZGl2PlwiXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICBhY0NvZGUuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCBzZWN0aW9uID0gJCh0aGlzKS5jbG9zZXN0KFwiLmFjLWJsb2NrXCIpLnBhcmVudCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhzZWN0aW9uLCBzZWN0aW9uLmxlbmd0aCk7XG4gICAgICAgIHNlY3Rpb24uYXBwZW5kKHNrZXRjaHBhZENvbnRhaW5lcik7XG4gICAgfSk7XG5cbiAgICAkKFwiYnV0dG9uLmNhcmQtbW9kZVwiKS5jbGljaygpO1xuXG4gICAgbGV0IG1vZGVTZWxlY3QgPSAkKFwiLm1vZGUtc2VsZWN0XCIpO1xuICAgIGxldCBtb2RlID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJwcmVzZW50TW9kZVwiKTtcbiAgICBpZiAobW9kZSA9PSBcInByZXNlbnRcIikge1xuICAgICAgICBtb2RlU2VsZWN0LnZhbChcInByZXNlbnRcIik7XG4gICAgICAgIG1vZGVTZWxlY3QuY2hhbmdlKCk7XG4gICAgfVxufVxuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgLy8gaWYgdXNlciBpcyBpbnN0cnVjdG9yLCBlbmFibGUgcHJlc2VudGVyIG1vZGVcbiAgICBpZiAoZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIGNvbmZpZ3VyZSgpO1xuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBqUXVlcnk7IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLypnbG9iYWwgdmFyaWFibGUgZGVjbGFyYXRpb25zKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBcIi4uL2Nzcy91c2VyLWhpZ2hsaWdodHMuY3NzXCI7XG5cbmZ1bmN0aW9uIGdldENvbXBsZXRpb25zKCkge1xuICAgIC8vIEdldCB0aGUgY29tcGxldGlvbiBzdGF0dXNcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKFxuICAgICAgICAgICAgLyhcXC9pbmRleC5odG1sfHRvY3RyZWUuaHRtbHxnZW5pbmRleC5odG1sfG5hdmhlbHAuaHRtbHx0b2MuaHRtbHxhc3NpZ25tZW50cy5odG1sfEV4ZXJjaXNlcy5odG1sKS9cbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRQYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICBpZiAoY3VycmVudFBhdGhuYW1lLmluZGV4T2YoXCI/XCIpICE9PSAtMSkge1xuICAgICAgICBjdXJyZW50UGF0aG5hbWUgPSBjdXJyZW50UGF0aG5hbWUuc3Vic3RyaW5nKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIGN1cnJlbnRQYXRobmFtZS5sYXN0SW5kZXhPZihcIj9cIilcbiAgICAgICAgKTtcbiAgICB9XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxhc3RQYWdlVXJsOiBjdXJyZW50UGF0aG5hbWUsXG4gICAgICAgIGlzUHR4Qm9vazogaXNQcmVUZVh0KCksXG4gICAgfTtcbiAgICBqUXVlcnlcbiAgICAgICAgLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2dldENvbXBsZXRpb25TdGF0dXNgLFxuICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcbiAgICAgICAgfSlcbiAgICAgICAgLmRvbmUoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhICE9IFwiTm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25EYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICAgICAgdmFyIGNvbXBsZXRpb25DbGFzcywgY29tcGxldGlvbk1zZztcbiAgICAgICAgICAgICAgICBpZiAoY29tcGxldGlvbkRhdGFbMF0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyA9IFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIjtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGlvbk1zZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxpIGNsYXNzPSdnbHlwaGljb24gZ2x5cGhpY29uLW9rJz48L2k+IENvbXBsZXRlZC4gV2VsbCBEb25lIVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25DbGFzcyA9IFwiYnV0dG9uQXNrQ29tcGxldGlvblwiO1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uTXNnID0gXCJNYXJrIGFzIENvbXBsZXRlZFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgc2NwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY3Byb2dyZXNzY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIGlmIChzY3ApIHtcbiAgICAgICAgICAgICAgICAgICAgc2NwLmNsYXNzTGlzdC5hZGQoXCJwdHgtcnVuZXN0b25lLWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcIiNzY3Byb2dyZXNzY29udGFpbmVyXCIpLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOmNlbnRlclwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWxnICcgK1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uQ2xhc3MgK1xuICAgICAgICAgICAgICAgICAgICAnXCIgaWQ9XCJjb21wbGV0aW9uQnV0dG9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRpb25Nc2cgK1xuICAgICAgICAgICAgICAgICAgICBcIjwvYnV0dG9uPjwvZGl2PlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dMYXN0UG9zaXRpb25CYW5uZXIoKSB7XG4gICAgdmFyIGxhc3RQb3NpdGlvblZhbCA9ICQuZ2V0VXJsVmFyKFwibGFzdFBvc2l0aW9uXCIpO1xuICAgIGlmICh0eXBlb2YgbGFzdFBvc2l0aW9uVmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChcbiAgICAgICAgICAgICc8aW1nIHNyYz1cIi4uL19zdGF0aWMvbGFzdC1wb2ludC5wbmdcIiBzdHlsZT1cInBvc2l0aW9uOmFic29sdXRlOyBwYWRkaW5nLXRvcDo1NXB4OyBsZWZ0OiAxMHB4OyB0b3A6ICcgK1xuICAgICAgICAgICAgcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSArXG4gICAgICAgICAgICAncHg7XCIvPidcbiAgICAgICAgKTtcbiAgICAgICAgJChcImh0bWwsIGJvZHlcIikuYW5pbWF0ZSh7IHNjcm9sbFRvcDogcGFyc2VJbnQobGFzdFBvc2l0aW9uVmFsKSB9LCAxMDAwKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpIHtcbiAgICBpZiAoXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmLm1hdGNoKFxuICAgICAgICAgICAgLyhpbmRleC5odG1sfGdlbmluZGV4Lmh0bWx8bmF2aGVscC5odG1sfHRvYy5odG1sfGFzc2lnbm1lbnRzLmh0bWx8RXhlcmNpc2VzLmh0bWx8dG9jdHJlZS5odG1sKS9cbiAgICAgICAgKVxuICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBuYXZMaW5rQmdSaWdodEhpZGRlblBvc2l0aW9uID0gLSQoXCIjbmF2TGlua0JnUmlnaHRcIikub3V0ZXJXaWR0aCgpIC0gNTtcbiAgICB2YXIgbmF2TGlua0JnUmlnaHRIYWxmT3BlbjtcbiAgICB2YXIgbmF2TGlua0JnUmlnaHRGdWxsT3BlbiA9IDA7XG5cbiAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICBuYXZMaW5rQmdSaWdodEhhbGZPcGVuID0gbmF2TGlua0JnUmlnaHRIaWRkZW5Qb3NpdGlvbiArIDcwO1xuICAgIH0gZWxzZSBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IDA7XG4gICAgfVxuICAgIHZhciByZWxhdGlvbnNOZXh0SWNvbkluaXRpYWxQb3NpdGlvbiA9ICQoXCIjcmVsYXRpb25zLW5leHRcIikuY3NzKFwicmlnaHRcIik7XG4gICAgdmFyIHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24gPSAtKG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyAzNSk7XG5cbiAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmNzcyhcInJpZ2h0XCIsIG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24pLnNob3coKTtcbiAgICB2YXIgbmF2QmdTaG93biA9IGZhbHNlO1xuICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyAkKHdpbmRvdykuaGVpZ2h0KCkgPT1cbiAgICAgICAgICAgICQoZG9jdW1lbnQpLmhlaWdodCgpXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gfSxcbiAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ0xlZnRcIikuYW5pbWF0ZSh7IGxlZnQ6IFwiMHB4XCIgfSwgMjAwKTtcbiAgICAgICAgICAgIGlmICgkKFwiI2NvbXBsZXRpb25CdXR0b25cIikuaGFzQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKSkge1xuICAgICAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgeyByaWdodDogcmVsYXRpb25zTmV4dEljb25OZXdQb3NpdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmF2QmdTaG93biA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobmF2QmdTaG93bikge1xuICAgICAgICAgICAgJChcIiNuYXZMaW5rQmdSaWdodFwiKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHsgcmlnaHQ6IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gfSxcbiAgICAgICAgICAgICAgICAyMDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ0xlZnRcIikuYW5pbWF0ZSh7IGxlZnQ6IFwiLTY1cHhcIiB9LCAyMDApO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5hdkJnU2hvd24gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGNvbXBsZXRpb25GbGFnID0gMDtcbiAgICBpZiAoJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLmhhc0NsYXNzKFwiYnV0dG9uQXNrQ29tcGxldGlvblwiKSkge1xuICAgICAgICBjb21wbGV0aW9uRmxhZyA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29tcGxldGlvbkZsYWcgPSAxO1xuICAgIH1cbiAgICAvLyBNYWtlIHN1cmUgd2UgbWFyayB0aGlzIHBhZ2UgYXMgdmlzaXRlZCByZWdhcmRsZXNzIG9mIGhvdyBmbGFrZXlcbiAgICAvLyB0aGUgb251bmxvYWQgaGFuZGxlcnMgYmVjb21lLlxuICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcsIHRydWUsIGZhbHNlLCBmYWxzZSk7XG4gICAgJChcIiNjb21wbGV0aW9uQnV0dG9uXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbWFya2luZ0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIHZhciBtYXJraW5nSW5jb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJidXR0b25Bc2tDb21wbGV0aW9uXCIpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgXCI8aSBjbGFzcz0nZ2x5cGhpY29uIGdseXBoaWNvbi1vayc+PC9pPiBDb21wbGV0ZWQuIFdlbGwgRG9uZSFcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAkKFwiI25hdkxpbmtCZ1JpZ2h0XCIpLmFuaW1hdGUoeyByaWdodDogbmF2TGlua0JnUmlnaHRGdWxsT3BlbiB9KTtcbiAgICAgICAgICAgICQoXCIjcmVsYXRpb25zLW5leHRcIikuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgcmlnaHQ6IHJlbGF0aW9uc05leHRJY29uTmV3UG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5hdkxpbmtCZ1JpZ2h0SGFsZk9wZW4gPSAwO1xuICAgICAgICAgICAgY29tcGxldGlvbkZsYWcgPSAxO1xuICAgICAgICAgICAgbWFya2luZ0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiYnV0dG9uQ29uZmlybUNvbXBsZXRpb25cIikpIHtcbiAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoXCJidXR0b25Db25maXJtQ29tcGxldGlvblwiKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImJ1dHRvbkFza0NvbXBsZXRpb25cIilcbiAgICAgICAgICAgICAgICAuaHRtbChcIk1hcmsgYXMgQ29tcGxldGVkXCIpO1xuICAgICAgICAgICAgbmF2TGlua0JnUmlnaHRIYWxmT3BlbiA9IG5hdkxpbmtCZ1JpZ2h0SGlkZGVuUG9zaXRpb24gKyA3MDtcbiAgICAgICAgICAgICQoXCIjbmF2TGlua0JnUmlnaHRcIikuYW5pbWF0ZSh7IHJpZ2h0OiBuYXZMaW5rQmdSaWdodEhhbGZPcGVuIH0pO1xuICAgICAgICAgICAgJChcIiNyZWxhdGlvbnMtbmV4dFwiKS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICByaWdodDogcmVsYXRpb25zTmV4dEljb25Jbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbXBsZXRpb25GbGFnID0gMDtcbiAgICAgICAgICAgIG1hcmtpbmdJbmNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBwcm9jZXNzUGFnZVN0YXRlKFxuICAgICAgICAgICAgY29tcGxldGlvbkZsYWcsXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgIG1hcmtpbmdDb21wbGV0ZSxcbiAgICAgICAgICAgIG1hcmtpbmdJbmNvbXBsZXRlXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyB3ZSBjYW5ub3QgYWZmb3JkIHRvIGRvIHRoaXMgYXQgYm90aCBsb2FkIGFuZCB1bmxvYWQgZXNwZWNpYWxseSBhcyB1c2Vyc1xuICAgIC8vIGdvIGZyb20gcGFnZSB0byBwYWdlLiBUaGlzIGp1c3QgZG91YmxlcyB0aGUgbG9hZC4gIFNvLCB0cnkgd2l0aG91dCB0aGlzIG9uZS5cbiAgICAvLyAkKHdpbmRvdykub24oXCJiZWZvcmV1bmxvYWRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAvLyAgICAgaWYgKGNvbXBsZXRpb25GbGFnID09IDApIHtcbiAgICAvLyAgICAgICAgIHByb2Nlc3NQYWdlU3RhdGUoY29tcGxldGlvbkZsYWcsIGZhbHNlLCBmYWxzZSwgZmFsc2UpO1xuICAgIC8vICAgICB9XG4gICAgLy8gfSk7XG59XG5cbi8vIF8gZGVjb3JhdGVUYWJsZU9mQ29udGVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCkge1xuICAgIGlmIChcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwidG9jLmh0bWxcIikgIT0gLTEgfHxcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiaW5kZXguaHRtbFwiKSAhPSAtMSB8fFxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZi50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJmcm9udG1hdHRlclwiKSAhPSAtMVxuICAgICkge1xuICAgICAgICBpZiAoIWlzUHJlVGVYdCgpKSB7XG4gICAgICAgICAgICBqUXVlcnkuZ2V0KFxuICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0QWxsQ29tcGxldGlvblN0YXR1c2AsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1YkNoYXB0ZXJMaXN0O1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3ViQ2hhcHRlckxpc3QgPSBkYXRhLmRldGFpbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsbFN1YkNoYXB0ZXJVUkxzID0gJChcIiNtYWluLWNvbnRlbnQgZGl2IGxpIGFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goc3ViQ2hhcHRlckxpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgYWxsU3ViQ2hhcHRlclVSTHMubGVuZ3RoOyBzKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsU3ViQ2hhcHRlclVSTHNbc10uaHJlZi5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2hhcHRlck5hbWUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiL1wiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnN1YkNoYXB0ZXJOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApICE9IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGxldGlvblN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChhbGxTdWJDaGFwdGVyVVJMc1tzXS5wYXJlbnRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJjb21wbGV0ZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImluZm9UZXh0Q29tcGxldGVkXCI+LSBDb21wbGV0ZWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIuaW5mb1RleHRDb21wbGV0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIi5pbmZvVGV4dENvbXBsZXRlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5jb21wbGV0aW9uU3RhdHVzID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGFsbFN1YkNoYXB0ZXJVUkxzW3NdLnBhcmVudEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImFjdGl2ZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiaW5mb1RleHRBY3RpdmVcIj5MYXN0IHJlYWQgdGhpcyB0b3BpYyBvbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uZW5kRGF0ZSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5ob3ZlcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5uZXh0KFwiLmluZm9UZXh0QWN0aXZlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLm5leHQoXCIuaW5mb1RleHRBY3RpdmVcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHsgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UgfTtcbiAgICAgICAgalF1ZXJ5LmdldChcbiAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9sb2dnZXIvZ2V0bGFzdHBhZ2VgLFxuICAgICAgICAgICAgZGF0YSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQYWdlRGF0YTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPSBcIk5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZURhdGEgPSBkYXRhLmRldGFpbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIiNjb250aW51ZS1yZWFkaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNob3coKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5odG1sKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBpZD1cImp1bXAtdG8tY2hhcHRlclwiIGNsYXNzPVwiYWxlcnQgYWxlcnQtaW5mb1wiID48c3Ryb25nPllvdSB3ZXJlIExhc3QgUmVhZGluZzo8L3N0cm9uZz4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZUNoYXB0ZXIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobGFzdFBhZ2VEYXRhLmxhc3RQYWdlU3ViY2hhcHRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIiAmZ3Q7IFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlRGF0YS5sYXN0UGFnZVN1YmNoYXB0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJcIikgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnIDxhIGhyZWY9XCInICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlVXJsICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI/bGFzdFBvc2l0aW9uPVwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2VEYXRhLmxhc3RQYWdlU2Nyb2xsTG9jYXRpb24gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnXCI+Q29udGludWUgUmVhZGluZzwvYT48L2Rpdj4nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVuYWJsZUNvbXBsZXRpb25zKCkge1xuICAgIGdldENvbXBsZXRpb25zKCk7XG4gICAgc2hvd0xhc3RQb3NpdGlvbkJhbm5lcigpO1xuICAgIGFkZE5hdmlnYXRpb25BbmRDb21wbGV0aW9uQnV0dG9ucygpO1xuICAgIGRlY29yYXRlVGFibGVPZkNvbnRlbnRzKCk7XG59XG5cbi8vIGNhbGwgZW5hYmxlIHVzZXIgaGlnaGxpZ2h0cyBhZnRlciBsb2dpblxuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW5cIiwgZW5hYmxlQ29tcGxldGlvbnMpO1xuXG5mdW5jdGlvbiBpc1ByZVRlWHQoKSB7XG4gICAgbGV0IHB0eE1hcmtlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LnByZXRleHRcIik7XG4gICAgaWYgKHB0eE1hcmtlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuLy8gXyBwcm9jZXNzUGFnZVN0YXRlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBwcm9jZXNzUGFnZVN0YXRlKFxuICAgIGNvbXBsZXRpb25GbGFnLFxuICAgIHBhZ2VMb2FkLFxuICAgIG1hcmtpbmdDb21wbGV0ZSxcbiAgICBtYXJraW5nSW5jb21wbGV0ZVxuKSB7XG4gICAgLypMb2cgbGFzdCBwYWdlIHZpc2l0ZWQqL1xuICAgIHZhciBjdXJyZW50UGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgaWYgKGN1cnJlbnRQYXRobmFtZS5pbmRleE9mKFwiP1wiKSAhPT0gLTEpIHtcbiAgICAgICAgY3VycmVudFBhdGhuYW1lID0gY3VycmVudFBhdGhuYW1lLnN1YnN0cmluZyhcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICBjdXJyZW50UGF0aG5hbWUubGFzdEluZGV4T2YoXCI/XCIpXG4gICAgICAgICk7XG4gICAgfVxuICAgIC8vIElzIHRoaXMgYSBwdHggYm9vaz9cbiAgICBsZXQgaXNQdHhCb29rID0gaXNQcmVUZVh0KCk7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIGxhc3RQYWdlVXJsOiBjdXJyZW50UGF0aG5hbWUsXG4gICAgICAgIGxhc3RQYWdlU2Nyb2xsTG9jYXRpb246IE1hdGgucm91bmQoJCh3aW5kb3cpLnNjcm9sbFRvcCgpKSxcbiAgICAgICAgY29tcGxldGlvbkZsYWc6IGNvbXBsZXRpb25GbGFnLFxuICAgICAgICBwYWdlTG9hZDogcGFnZUxvYWQsXG4gICAgICAgIG1hcmtpbmdDb21wbGV0ZTogbWFya2luZ0NvbXBsZXRlLFxuICAgICAgICBtYXJraW5nSW5jb21wbGV0ZTogbWFya2luZ0luY29tcGxldGUsXG4gICAgICAgIGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICBpc1B0eEJvb2s6IGlzUHR4Qm9vayxcbiAgICB9O1xuICAgICQoZG9jdW1lbnQpLmFqYXhFcnJvcihmdW5jdGlvbiAoZSwganFoeHIsIHNldHRpbmdzLCBleGNlcHRpb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0IEZhaWxlZCBmb3IgXCIgKyBzZXR0aW5ncy51cmwpO1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9KTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHVybDogYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVsYXN0cGFnZWAsXG4gICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShkYXRhKSxcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYXN5bmM6IHRydWUsXG4gICAgfSk7XG59XG5cbiQuZXh0ZW5kKHtcbiAgICBnZXRVcmxWYXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB2YXJzID0gW10sXG4gICAgICAgICAgICBoYXNoO1xuICAgICAgICB2YXIgaGFzaGVzID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaFxuICAgICAgICAgICAgLnNsaWNlKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guaW5kZXhPZihcIj9cIikgKyAxKVxuICAgICAgICAgICAgLnNwbGl0KFwiJlwiKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBoYXNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGhhc2ggPSBoYXNoZXNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgdmFycy5wdXNoKGhhc2hbMF0pO1xuICAgICAgICAgICAgdmFyc1toYXNoWzBdXSA9IGhhc2hbMV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhcnM7XG4gICAgfSxcbiAgICBnZXRVcmxWYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiAkLmdldFVybFZhcnMoKVtuYW1lXTtcbiAgICB9LFxufSk7XG4iLCIvKiFcbiAqIGpRdWVyeSBpZGxlVGltZXIgcGx1Z2luXG4gKiB2ZXJzaW9uIDAuOS4xMDA1MTFcbiAqIGJ5IFBhdWwgSXJpc2guXG4gKiAgIGh0dHA6Ly9naXRodWIuY29tL3BhdWxpcmlzaC95dWktbWlzYy90cmVlL1xuICogTUlUIGxpY2Vuc2VcblxuICogYWRhcHRlZCBmcm9tIFlVSSBpZGxlIHRpbWVyIGJ5IG56YWthczpcbiAqICAgaHR0cDovL2dpdGh1Yi5jb20vbnpha2FzL3l1aS1taXNjL1xuKi9cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDkgTmljaG9sYXMgQy4gWmFrYXNcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qIHVwZGF0ZWQgdG8gZml4IENocm9tZSBzZXRUaW1lb3V0IGlzc3VlIGJ5IFphaWQgWmF3YWlkZWggKi9cblxuIC8vIEFQSSBhdmFpbGFibGUgaW4gPD0gdjAuOFxuIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAvLyBpZGxlVGltZXIoKSB0YWtlcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGRlZmluZXMgdGhlIGlkbGUgdGltZW91dFxuIC8vIHRpbWVvdXQgaXMgaW4gbWlsbGlzZWNvbmRzOyBkZWZhdWx0cyB0byAzMDAwMFxuICQuaWRsZVRpbWVyKDEwMDAwKTtcblxuXG4gJChkb2N1bWVudCkuYmluZChcImlkbGUuaWRsZVRpbWVyXCIsIGZ1bmN0aW9uKCl7XG4gICAgLy8gZnVuY3Rpb24geW91IHdhbnQgdG8gZmlyZSB3aGVuIHRoZSB1c2VyIGdvZXMgaWRsZVxuIH0pO1xuXG5cbiAkKGRvY3VtZW50KS5iaW5kKFwiYWN0aXZlLmlkbGVUaW1lclwiLCBmdW5jdGlvbigpe1xuICAvLyBmdW5jdGlvbiB5b3Ugd2FudCB0byBmaXJlIHdoZW4gdGhlIHVzZXIgYmVjb21lcyBhY3RpdmUgYWdhaW5cbiB9KTtcblxuIC8vIHBhc3MgdGhlIHN0cmluZyAnZGVzdHJveScgdG8gc3RvcCB0aGUgdGltZXJcbiAkLmlkbGVUaW1lcignZGVzdHJveScpO1xuXG4gLy8geW91IGNhbiBxdWVyeSBpZiB0aGUgdXNlciBpcyBpZGxlIG9yIG5vdCB3aXRoIGRhdGEoKVxuICQuZGF0YShkb2N1bWVudCwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyB5b3UgY2FuIGdldCB0aW1lIGVsYXBzZWQgc2luY2UgdXNlciB3aGVuIGlkbGUvYWN0aXZlXG4gJC5pZGxlVGltZXIoJ2dldEVsYXBzZWRUaW1lJyk7IC8vIHRpbWUgc2luY2Ugc3RhdGUgY2hhbmdlIGluIG1zXG5cbiAqKioqKioqKi9cblxuXG5cbiAvLyBBUEkgYXZhaWxhYmxlIGluID49IHYwLjlcbiAvKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gLy8gYmluZCB0byBzcGVjaWZpYyBlbGVtZW50cywgYWxsb3dzIGZvciBtdWx0aXBsZSB0aW1lciBpbnN0YW5jZXNcbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0fCdkZXN0cm95J3wnZ2V0RWxhcHNlZFRpbWUnKTtcbiAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyJyk7ICAvLyAnaWRsZScgIG9yICdhY3RpdmUnXG5cbiAvLyBpZiB5b3UncmUgdXNpbmcgdGhlIG9sZCAkLmlkbGVUaW1lciBhcGksIHlvdSBzaG91bGQgbm90IGRvICQoZG9jdW1lbnQpLmlkbGVUaW1lciguLi4pXG5cbiAvLyBlbGVtZW50IGJvdW5kIHRpbWVycyB3aWxsIG9ubHkgd2F0Y2ggZm9yIGV2ZW50cyBpbnNpZGUgb2YgdGhlbS5cbiAvLyB5b3UgbWF5IGp1c3Qgd2FudCBwYWdlLWxldmVsIGFjdGl2aXR5LCBpbiB3aGljaCBjYXNlIHlvdSBtYXkgc2V0IHVwXG4gLy8gICB5b3VyIHRpbWVycyBvbiBkb2N1bWVudCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCBhbmQgZG9jdW1lbnQuYm9keVxuXG4gLy8gWW91IGNhbiBvcHRpb25hbGx5IHByb3ZpZGUgYSBzZWNvbmQgYXJndW1lbnQgdG8gb3ZlcnJpZGUgY2VydGFpbiBvcHRpb25zLlxuIC8vIEhlcmUgYXJlIHRoZSBkZWZhdWx0cywgc28geW91IGNhbiBvbWl0IGFueSBvciBhbGwgb2YgdGhlbS5cbiAkKGVsZW0pLmlkbGVUaW1lcih0aW1lb3V0LCB7XG4gICBzdGFydEltbWVkaWF0ZWx5OiB0cnVlLCAvL3N0YXJ0cyBhIHRpbWVvdXQgYXMgc29vbiBhcyB0aGUgdGltZXIgaXMgc2V0IHVwOyBvdGhlcndpc2UgaXQgd2FpdHMgZm9yIHRoZSBmaXJzdCBldmVudC5cbiAgIGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcbiAgIGVuYWJsZWQ6IHRydWUsICAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSBpZGxlIHRpbWVyIGlzIGVuYWJsZWRcbiAgIGV2ZW50czogICdtb3VzZW1vdmUga2V5ZG93biBET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsIG1vdXNlZG93biB0b3VjaHN0YXJ0IHRvdWNobW92ZScgLy8gYWN0aXZpdHkgaXMgb25lIG9mIHRoZXNlIGV2ZW50c1xuIH0pO1xuXG4gKioqKioqKiovXG5cbihmdW5jdGlvbigkKXtcblxuJC5pZGxlVGltZXIgPSBmdW5jdGlvbihuZXdUaW1lb3V0LCBlbGVtLCBvcHRzKXtcblxuICAgIC8vIGRlZmF1bHRzIHRoYXQgYXJlIHRvIGJlIHN0b3JlZCBhcyBpbnN0YW5jZSBwcm9wcyBvbiB0aGUgZWxlbVxuXG5cdG9wdHMgPSAkLmV4dGVuZCh7XG5cdFx0c3RhcnRJbW1lZGlhdGVseTogdHJ1ZSwgLy9zdGFydHMgYSB0aW1lb3V0IGFzIHNvb24gYXMgdGhlIHRpbWVyIGlzIHNldCB1cFxuXHRcdGlkbGU6ICAgIGZhbHNlLCAgICAgICAgIC8vaW5kaWNhdGVzIGlmIHRoZSB1c2VyIGlzIGlkbGVcblx0XHRlbmFibGVkOiB0cnVlLCAgICAgICAgICAvL2luZGljYXRlcyBpZiB0aGUgaWRsZSB0aW1lciBpcyBlbmFibGVkXG5cdFx0dGltZW91dDogMzAwMDAsICAgICAgICAgLy90aGUgYW1vdW50IG9mIHRpbWUgKG1zKSBiZWZvcmUgdGhlIHVzZXIgaXMgY29uc2lkZXJlZCBpZGxlXG5cdFx0ZXZlbnRzOiAgJ21vdXNlbW92ZSBrZXlkb3duIERPTU1vdXNlU2Nyb2xsIG1vdXNld2hlZWwgbW91c2Vkb3duIHRvdWNoc3RhcnQgdG91Y2htb3ZlJyAvLyBhY3Rpdml0eSBpcyBvbmUgb2YgdGhlc2UgZXZlbnRzXG5cdH0sIG9wdHMpO1xuXG5cbiAgICBlbGVtID0gZWxlbSB8fCBkb2N1bWVudDtcblxuICAgIC8qIChpbnRlbnRpb25hbGx5IG5vdCBkb2N1bWVudGVkKVxuICAgICAqIFRvZ2dsZXMgdGhlIGlkbGUgc3RhdGUgYW5kIGZpcmVzIGFuIGFwcHJvcHJpYXRlIGV2ZW50LlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdmFyIHRvZ2dsZUlkbGVTdGF0ZSA9IGZ1bmN0aW9uKG15ZWxlbSl7XG5cbiAgICAgICAgLy8gY3Vyc2UgeW91LCBtb3ppbGxhIHNldFRpbWVvdXQgbGF0ZW5lc3MgYnVnIVxuICAgICAgICBpZiAodHlwZW9mIG15ZWxlbSA9PT0gJ251bWJlcicpe1xuICAgICAgICAgICAgbXllbGVtID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9iaiA9ICQuZGF0YShteWVsZW0gfHwgZWxlbSwnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy90b2dnbGUgdGhlIHN0YXRlXG4gICAgICAgIG9iai5pZGxlID0gIW9iai5pZGxlO1xuXG4gICAgICAgIC8vIHJlc2V0IHRpbWVvdXQgXG4gICAgICAgIHZhciBlbGFwc2VkID0gKCtuZXcgRGF0ZSgpKSAtIG9iai5vbGRkYXRlO1xuICAgICAgICBvYmoub2xkZGF0ZSA9ICtuZXcgRGF0ZSgpO1xuXG4gICAgICAgIC8vIGhhbmRsZSBDaHJvbWUgYWx3YXlzIHRyaWdnZXJpbmcgaWRsZSBhZnRlciBqcyBhbGVydCBvciBjb21maXJtIHBvcHVwXG4gICAgICAgIGlmIChvYmouaWRsZSAmJiAoZWxhcHNlZCA8IG9wdHMudGltZW91dCkpIHtcbiAgICAgICAgICAgICAgICBvYmouaWRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkLmlkbGVUaW1lci50SWQpO1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmVuYWJsZWQpXG4gICAgICAgICAgICAgICAgICAkLmlkbGVUaW1lci50SWQgPSBzZXRUaW1lb3V0KHRvZ2dsZUlkbGVTdGF0ZSwgb3B0cy50aW1lb3V0KTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vZmlyZSBhcHByb3ByaWF0ZSBldmVudFxuXG4gICAgICAgIC8vIGNyZWF0ZSBhIGN1c3RvbSBldmVudCwgYnV0IGZpcnN0LCBzdG9yZSB0aGUgbmV3IHN0YXRlIG9uIHRoZSBlbGVtZW50XG4gICAgICAgIC8vIGFuZCB0aGVuIGFwcGVuZCB0aGF0IHN0cmluZyB0byBhIG5hbWVzcGFjZVxuICAgICAgICB2YXIgZXZlbnQgPSBqUXVlcnkuRXZlbnQoICQuZGF0YShlbGVtLCdpZGxlVGltZXInLCBvYmouaWRsZSA/IFwiaWRsZVwiIDogXCJhY3RpdmVcIiApICArICcuaWRsZVRpbWVyJyAgICk7XG5cbiAgICAgICAgLy8gd2UgZG8gd2FudCB0aGlzIHRvIGJ1YmJsZSwgYXQgbGVhc3QgYXMgYSB0ZW1wb3JhcnkgZml4IGZvciBqUXVlcnkgMS43XG4gICAgICAgIC8vIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAkKGVsZW0pLnRyaWdnZXIoZXZlbnQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgaWRsZSB0aW1lci4gVGhpcyByZW1vdmVzIGFwcHJvcHJpYXRlIGV2ZW50IGhhbmRsZXJzXG4gICAgICogYW5kIGNhbmNlbHMgYW55IHBlbmRpbmcgdGltZW91dHMuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKiBAbWV0aG9kIHN0b3BcbiAgICAgKiBAc3RhdGljXG4gICAgICovXG4gICAgc3RvcCA9IGZ1bmN0aW9uKGVsZW0pe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEoZWxlbSwnaWRsZVRpbWVyT2JqJykgfHwge307XG5cbiAgICAgICAgLy9zZXQgdG8gZGlzYWJsZWRcbiAgICAgICAgb2JqLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgICAgICAvL2NsZWFyIGFueSBwZW5kaW5nIHRpbWVvdXRzXG4gICAgICAgIGNsZWFyVGltZW91dChvYmoudElkKTtcblxuICAgICAgICAvL2RldGFjaCB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgJChlbGVtKS5vZmYoJy5pZGxlVGltZXInKTtcbiAgICB9LFxuXG5cbiAgICAvKiAoaW50ZW50aW9uYWxseSBub3QgZG9jdW1lbnRlZClcbiAgICAgKiBIYW5kbGVzIGEgdXNlciBldmVudCBpbmRpY2F0aW5nIHRoYXQgdGhlIHVzZXIgaXNuJ3QgaWRsZS5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudCBBIERPTTItbm9ybWFsaXplZCBldmVudCBvYmplY3QuXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBoYW5kbGVVc2VyRXZlbnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBvYmogPSAkLmRhdGEodGhpcywnaWRsZVRpbWVyT2JqJyk7XG5cbiAgICAgICAgLy9jbGVhciBhbnkgZXhpc3RpbmcgdGltZW91dFxuICAgICAgICBjbGVhclRpbWVvdXQob2JqLnRJZCk7XG5cblxuXG4gICAgICAgIC8vaWYgdGhlIGlkbGUgdGltZXIgaXMgZW5hYmxlZFxuICAgICAgICBpZiAob2JqLmVuYWJsZWQpe1xuXG5cbiAgICAgICAgICAgIC8vaWYgaXQncyBpZGxlLCB0aGF0IG1lYW5zIHRoZSB1c2VyIGlzIG5vIGxvbmdlciBpZGxlXG4gICAgICAgICAgICBpZiAob2JqLmlkbGUpe1xuICAgICAgICAgICAgICAgIHRvZ2dsZUlkbGVTdGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZXQgYSBuZXcgdGltZW91dFxuICAgICAgICAgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cbiAgICAgICAgfVxuICAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydHMgdGhlIGlkbGUgdGltZXIuIFRoaXMgYWRkcyBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICAqIGFuZCBzdGFydHMgdGhlIGZpcnN0IHRpbWVvdXQuXG4gICAgICogQHBhcmFtIHtpbnR9IG5ld1RpbWVvdXQgKE9wdGlvbmFsKSBBIG5ldyB2YWx1ZSBmb3IgdGhlIHRpbWVvdXQgcGVyaW9kIGluIG1zLlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICogQG1ldGhvZCAkLmlkbGVUaW1lclxuICAgICAqIEBzdGF0aWNcbiAgICAgKi9cblxuXG4gICAgdmFyIG9iaiA9ICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonKSB8fCB7fTtcblxuICAgIG9iai5vbGRkYXRlID0gb2JqLm9sZGRhdGUgfHwgK25ldyBEYXRlKCk7XG5cbiAgICAvL2Fzc2lnbiBhIG5ldyB0aW1lb3V0IGlmIG5lY2Vzc2FyeVxuICAgIGlmICh0eXBlb2YgbmV3VGltZW91dCA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgIG9wdHMudGltZW91dCA9IG5ld1RpbWVvdXQ7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZGVzdHJveScpIHtcbiAgICAgICAgc3RvcChlbGVtKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIGlmIChuZXdUaW1lb3V0ID09PSAnZ2V0RWxhcHNlZFRpbWUnKXtcbiAgICAgICAgcmV0dXJuICgrbmV3IERhdGUoKSkgLSBvYmoub2xkZGF0ZTtcbiAgICB9XG5cbiAgICAvL2Fzc2lnbiBhcHByb3ByaWF0ZSBldmVudCBoYW5kbGVyc1xuICAgICQoZWxlbSkub24oJC50cmltKChvcHRzLmV2ZW50cysnICcpLnNwbGl0KCcgJykuam9pbignLmlkbGVUaW1lciAnKSksaGFuZGxlVXNlckV2ZW50KTtcblxuXG4gICAgb2JqLmlkbGUgICAgPSBvcHRzLmlkbGU7XG4gICAgb2JqLmVuYWJsZWQgPSBvcHRzLmVuYWJsZWQ7XG4gICAgb2JqLnRpbWVvdXQgPSBvcHRzLnRpbWVvdXQ7XG5cblxuICAgIC8vc2V0IGEgdGltZW91dCB0byB0b2dnbGUgc3RhdGUuIE1heSB3aXNoIHRvIG9taXQgdGhpcyBpbiBzb21lIHNpdHVhdGlvbnNcblx0aWYgKG9wdHMuc3RhcnRJbW1lZGlhdGVseSkge1xuXHQgICAgb2JqLnRJZCA9IHNldFRpbWVvdXQodG9nZ2xlSWRsZVN0YXRlLCBvYmoudGltZW91dCk7XG5cdH1cblxuICAgIC8vIGFzc3VtZSB0aGUgdXNlciBpcyBhY3RpdmUgZm9yIHRoZSBmaXJzdCB4IHNlY29uZHMuXG4gICAgJC5kYXRhKGVsZW0sJ2lkbGVUaW1lcicsXCJhY3RpdmVcIik7XG5cbiAgICAvLyBzdG9yZSBvdXIgaW5zdGFuY2Ugb24gdGhlIG9iamVjdFxuICAgICQuZGF0YShlbGVtLCdpZGxlVGltZXJPYmonLG9iaik7XG5cblxuXG59OyAvLyBlbmQgb2YgJC5pZGxlVGltZXIoKVxuXG5cbi8vIHYwLjkgQVBJIGZvciBkZWZpbmluZyBtdWx0aXBsZSB0aW1lcnMuXG4kLmZuLmlkbGVUaW1lciA9IGZ1bmN0aW9uKG5ld1RpbWVvdXQsb3B0cyl7XG5cdC8vIEFsbG93IG9taXNzaW9uIG9mIG9wdHMgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0aWYgKCFvcHRzKSB7XG5cdFx0b3B0cyA9IHt9O1xuXHR9XG5cbiAgICBpZih0aGlzWzBdKXtcbiAgICAgICAgJC5pZGxlVGltZXIobmV3VGltZW91dCx0aGlzWzBdLG9wdHMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xufTtcblxuXG59KShqUXVlcnkpO1xuIiwiaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5cbmludGVyZmFjZSBTcGxpY2VNZXNzYWdlRGF0YSB7XG4gICAgc3ViamVjdDogc3RyaW5nO1xuICAgIGFjdGl2aXR5X2lkPzogc3RyaW5nO1xuICAgIHNjb3JlPzogbnVtYmVyO1xuICAgIHN0YXRlPzogdW5rbm93bjtcbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIG1lc3NhZ2VfaWQ/OiBzdHJpbmc7XG4gICAgZnJhbWVfaWQ/OiBzdHJpbmc7XG4gICAgand0Pzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgU2F2ZWRTdGF0ZVJlc3BvbnNlIHtcbiAgICBkZXRhaWw6IHtcbiAgICAgICAgYW5zd2VyOiB1bmtub3duO1xuICAgIH07XG59XG5cbmludGVyZmFjZSBKd3RQYXlsb2FkIHtcbiAgICBzY29yZTogbnVtYmVyO1xuICAgIFtrZXk6IHN0cmluZ106IHVua25vd247XG59XG5cbmRlY2xhcmUgY29uc3QgZUJvb2tDb25maWc6IHtcbiAgICBjb3Vyc2U6IHN0cmluZztcbiAgICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufTtcblxuZXhwb3J0IGNsYXNzIFNwbGljZVdyYXBwZXIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pbml0U3BsaWNlKCk7XG4gICAgfVxuXG4gICAgaW5pdFNwbGljZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gU1BMSUNFIEV2ZW50c1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgYXN5bmMgKGV2ZW50OiBNZXNzYWdlRXZlbnQ8U3BsaWNlTWVzc2FnZURhdGE+KSA9PiB7XG4gICAgICAgICAgICB2YXIgc291cmNlSWZyYW1lID0gdGhpcy5zZW5kaW5nSWZyYW1lKGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBTcGxpY2VXcmFwcGVyOiByZWNlaXZlZCBtZXNzYWdlIHN1YmplY3Q6ICR7ZXZlbnQuZGF0YS5zdWJqZWN0fSBmcm9tIGlmcmFtZTogJHtzb3VyY2VJZnJhbWUgPyBzb3VyY2VJZnJhbWUuaWQgOiBcInVua25vd25cIn1gKTtcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0UucmVwb3J0U2NvcmVBbmRTdGF0ZVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTY29yZUFuZFN0YXRlKGV2ZW50LCBzb3VyY2VJZnJhbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0Uuc2VuZEV2ZW50XCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNwbGljZUV2ZW50KGV2ZW50LCBzb3VyY2VJZnJhbWUpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC5kYXRhLnN1YmplY3QgPT0gXCJTUExJQ0UuZ2V0U3RhdGVcIikge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaGFuZGxlR2V0U3RhdGUoZXZlbnQsIHNvdXJjZUlmcmFtZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIGV2ZW50Lm9yaWdpbiA9PT0gXCJodHRwczovL3d3dy5teW9wZW5tYXRoLmNvbVwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICAoZXZlbnQuZGF0YSBhcyB1bmtub3duIGFzIHN0cmluZykuaW5kZXhPZihcImx0aS5leHQuaW1hdGhhcy5yZXN1bHRcIikgIT0gLTFcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIHByb29mIG9mIGNvbmNlcHQgZm9yIE15IE9wZW4gTWF0aFxuICAgICAgICAgICAgICAgIGxldCBtc2dkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhIGFzIHVua25vd24gYXMgc3RyaW5nKTtcbiAgICAgICAgICAgICAgICBsZXQgand0ID0gYmFzaWNQYXJzZUp3dChtc2dkYXRhLmp3dCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIFwiUmVzdWx0IHJlY2VpdmVkIGZyb20gZnJhbWUgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgbXNnZGF0YS5mcmFtZV9pZCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiB3aXRoIHNjb3JlIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGp3dC5zY29yZVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gdG9kbyBzZW5kIHNjb3JlIHRvIHNlcnZlclxuICAgICAgICAgICAgICAgIC8vIGRvZXMgTU9NIGhhdmUgYSB3YXkgdG8gZ2V0IHRoZSBzdGF0ZT9cbiAgICAgICAgICAgICAgICAvLyB0b2RvIHNlbmQgc3RhdGUgdG8gc2VydmVyXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGdldFVuaXF1ZUlEKGV2ZW50OiBNZXNzYWdlRXZlbnQ8U3BsaWNlTWVzc2FnZURhdGE+LCBmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIGFjdGl2aXR5XG4gICAgICAgIC8vIFRoZSBTUExJQ0UgcHJvdG9jb2wgYWxsb3dzIGZvciB0d28gcG9zc2liaWxpdGllc1xuICAgICAgICAvLyAxLiBhY3Rpdml0eV9pZCBpcyB0aGUgdW5pcXVlIGlkIGFzIGFzc2lnbmVkIGJ5IHRoZSBwcm92aWRlclxuICAgICAgICAvLyAyLiBhY3Rpdml0eV9pZCBpcyB0aGUgaWZyYW1lIHNyYyB1cmxcbiAgICAgICAgLy8gaWYgdGhlIGFjdGl2aXR5X2lkIGlzIHNldCB0aGVyZSBtYXkgYWxzbyBiZSBhbm90aGVyIGF0dHJpYnV0ZSBjYWxsZWQgZG9tYWluXG4gICAgICAgIC8vIE9uIFJ1bmVzdG9uZSB3ZSB3aWxsIHRyeSB0byBtYXAgdGhlIGFjdGl2aXR5IHRvIHRoZSBkaXZfaWQgb2YgdGhlIGVuY2xvc2luZyBSUyBjb21wb25lbnRcbiAgICAgICAgLy8gaWYgcG9zc2libGUsIG90aGVyd2lzZSB3ZSB3aWxsIHVzZSB0aGUgYWN0aXZpdHlfaWQgb3IgaWZyYW1lIHNyY1xuICAgICAgICAvLyBJZiBhbiBpbnRlcmFjdGl2ZSBpcyBpbmNsdWRlZCBpbiBhbiBleGVyY2lzZXMgdGhpcyBhbGxvd3MgdXMgdG8gbWFwIHRoZSBzY29yZVxuICAgICAgICAvLyB0byB0aGUgaWQgdGhlIGluc3RydWN0b3IgdXNlZCB0byBhc3NpZ24gdGhlIHByb2JsZW0uXG4gICAgICAgIGlmIChmcmFtZSkge1xuICAgICAgICAgICAgbGV0IHJzRGl2ID0gZnJhbWUuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudF1cIik7XG4gICAgICAgICAgICBpZiAocnNEaXYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcnNEaXYuaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGxvY2F0aW9uID0gZXZlbnQuZGF0YS5hY3Rpdml0eV9pZDtcbiAgICAgICAgaWYgKCFsb2NhdGlvbikge1xuICAgICAgICAgICAgaWYgKGZyYW1lKSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24gPSBmcmFtZS5zcmM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvY2F0aW9uID0gXCJ1bmtub3duXCI7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgXCJDb3VsZCBub3QgZmluZCBpZnJhbWUgdGhhdCBzZW50IHRoZSBTUExJQ0UgZXZlbnRcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvY2F0aW9uO1xuICAgIH1cblxuICAgIGhhbmRsZVNjb3JlQW5kU3RhdGUoZXZlbnQ6IE1lc3NhZ2VFdmVudDxTcGxpY2VNZXNzYWdlRGF0YT4sIGZyYW1lOiBIVE1MSUZyYW1lRWxlbWVudCB8IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBTUExJQ0UucmVwb3J0U2NvcmVBbmRTdGF0ZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5hY3Rpdml0eV9pZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuc2NvcmUpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLnN0YXRlKTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5nZXRVbmlxdWVJRChldmVudCwgZnJhbWUpO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogZXZlbnQuZGF0YS5zdWJqZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiBsb2NhdGlvbixcbiAgICAgICAgICAgIGFjdDogYHNjb3JlOiAke2V2ZW50LmRhdGEuc2NvcmV9YCxcbiAgICAgICAgICAgIHNjb3JlOiBldmVudC5kYXRhLnNjb3JlLFxuICAgICAgICAgICAgcGVyY2VudDogZXZlbnQuZGF0YS5zY29yZSxcbiAgICAgICAgICAgIGNvcnJlY3Q6IGV2ZW50LmRhdGEuc2NvcmUgPT0gMS4wID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeShldmVudC5kYXRhLnN0YXRlKSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2VuZGluZ0lmcmFtZShldmVudDogTWVzc2FnZUV2ZW50KTogSFRNTElGcmFtZUVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgICAgICAvLyBkZXRlcm1pbmUgdGhlIGlmcmFtZSB0aGF0IHNlbnQgdGhlIGV2ZW50XG4gICAgICAgIC8vIHlvdSB3b3VsZCB0aGluayB0aGF0IGV2ZW50LnNvdXJjZSB3b3VsZCBiZSB0aGUgaWZyYW1lXG4gICAgICAgIC8vIGJ1dCBpdCBpcyBub3QgYW5kIGdldHRpbmcgdGhlIGxvY2F0aW9uIG91dCBvZiBldmVudC5zb3VyY2VcbiAgICAgICAgLy8gY3JlYXRlcyBDT1JTIGlzc3Vlcy5cbiAgICAgICAgZm9yIChjb25zdCBmIG9mIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaWZyYW1lXCIpKSB7XG4gICAgICAgICAgICBpZiAoZi5jb250ZW50V2luZG93ID09PSBldmVudC5zb3VyY2UpIHJldHVybiBmO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0U2F2ZWRTdGF0ZShsb2NhdGlvbjogc3RyaW5nKTogUHJvbWlzZTxTYXZlZFN0YXRlUmVzcG9uc2UgfCBudWxsPiB7XG4gICAgICAgIC8vIGZldGNoIHRoZSBzdGF0ZSBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvbnMvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogbG9jYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGNvdXJzZTogZUJvb2tDb25maWcuY291cnNlLFxuICAgICAgICAgICAgICAgICAgICBldmVudDogXCJTUExJQ0UuZ2V0U3RhdGVcIixcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSFRUUCBlcnJvciEgc3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IFNhdmVkU3RhdGVSZXNwb25zZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIFNQTElDRSBzdGF0ZTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBoYW5kbGVHZXRTdGF0ZShldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiR290IFNQTElDRS5nZXRTdGF0ZVwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5hY3Rpdml0eV9pZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuc3RhdGUpO1xuICAgICAgICAvLyBzdWJqZWN0IGlzIFNQTElDRS5nZXRTdGF0ZS5yZXNwb25zZVxuICAgICAgICBsZXQgbG9jYXRpb24gPSB0aGlzLmdldFVuaXF1ZUlEKGV2ZW50LCBmcmFtZSk7XG4gICAgICAgIGxldCByZXMgPSBhd2FpdCB0aGlzLmdldFNhdmVkU3RhdGUobG9jYXRpb24pO1xuICAgICAgICBsZXQgc3RhdGUgPSByZXM/LmRldGFpbC5hbnN3ZXI7XG4gICAgICAgIChldmVudC5zb3VyY2UgYXMgV2luZG93KS5wb3N0TWVzc2FnZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlX2lkOiBldmVudC5kYXRhLm1lc3NhZ2VfaWQsXG4gICAgICAgICAgICAgICAgc3ViamVjdDogXCJTUExJQ0UuZ2V0U3RhdGUucmVzcG9uc2VcIixcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCIqXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBoYW5kbGVTcGxpY2VFdmVudChldmVudDogTWVzc2FnZUV2ZW50PFNwbGljZU1lc3NhZ2VEYXRhPiwgZnJhbWU6IEhUTUxJRnJhbWVFbGVtZW50IHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgICAgIC8vIGhhbmRsZSBnZW5lcmljIFNQTElDRSBldmVudHMsIHN1Y2ggYXMgbG9nZ2VkIGNsaWNrc1xuICAgICAgICAvLyBvciBvdGhlciBldmVudHMuICBTUExJQ0UgZG9lcyBub3QgcmVxdWlyZSB0aGF0IHdlIGRvXG4gICAgICAgIC8vIGFueXRoaW5nIHdpdGggdGhlbSwgYnV0IGluIGtlZXBpbmcgd2l0aCBvdXIgdHJhZGl0aW9uXG4gICAgICAgIC8vIHdlIHdpbGwgc2F2ZSB0aGVtIHRvIHRoZSB1c2VpbmZvIHRhYmxlIGluIHRoZSBkYXRhYmFzZVxuICAgICAgICAvLyBpbiBjYXNlIHRoZXkgcHJvdmUgdG8gYmUgdXNlZnVsIGZvciByZXNlYXJjaCBsYXRlclxuICAgICAgICBjb25zb2xlLmxvZyhcIkdvdCBTUExJQ0Uuc2VuZEV2ZW50XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudC5kYXRhLmFjdGl2aXR5X2lkKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQuZGF0YS5uYW1lKTtcbiAgICAgICAgbGV0IGxvY2F0aW9uID0gdGhpcy5nZXRVbmlxdWVJRChldmVudCwgZnJhbWUpO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogZXZlbnQuZGF0YS5zdWJqZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiBsb2NhdGlvbixcbiAgICAgICAgICAgIGFjdDogZXZlbnQuZGF0YS5uYW1lIHx8IFwidW5rbm93blwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyB0aGVzZSBzdHVicyBhcmUgbm90IGltcGxlbWVudGVkLCBidXQgYXJlIHJlcXVpcmVkIGJ5IHRoZSBSdW5lc3RvbmVCYXNlIGNsYXNzXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKTogdm9pZCB7fVxuICAgIHNldExvY2FsU3RvcmFnZSgpOiB2b2lkIHt9XG4gICAgcmVzdG9yZUFuc3dlcnMoKTogdm9pZCB7fVxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpOiB2b2lkIHt9XG59XG5cbmZ1bmN0aW9uIGJhc2ljUGFyc2VKd3QodG9rZW46IHN0cmluZyk6IEp3dFBheWxvYWQge1xuICAgIHZhciBiYXNlNjRVcmwgPSB0b2tlbi5zcGxpdChcIi5cIilbMV07XG4gICAgdmFyIGJhc2U2NCA9IGJhc2U2NFVybC5yZXBsYWNlKC8tL2csIFwiK1wiKS5yZXBsYWNlKC9fL2csIFwiL1wiKTtcbiAgICB2YXIganNvblBheWxvYWQgPSBkZWNvZGVVUklDb21wb25lbnQoXG4gICAgICAgIHdpbmRvd1xuICAgICAgICAgICAgLmF0b2IoYmFzZTY0KVxuICAgICAgICAgICAgLnNwbGl0KFwiXCIpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChjOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIiVcIiArIChcIjAwXCIgKyBjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtMik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmpvaW4oXCJcIilcbiAgICApO1xuICAgIHJldHVybiBKU09OLnBhcnNlKGpzb25QYXlsb2FkKSBhcyBKd3RQYXlsb2FkO1xufVxuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAqIHxkb2NuYW1lfCAtIFJ1bmVzdG9uZSBCYXNlIENsYXNzXG4gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gSW4gYWRkaXRpb24gYWxsIHJ1bmVzdG9uZSBjb21wb25lbnRzIHNob3VsZCBkbyB0aGUgZm9sbG93aW5nIHRoaW5nczpcbiAqXG4gKiAxLiAgIEVuc3VyZSB0aGF0IHRoZXkgYXJlIHdyYXBwZWQgaW4gYSBkaXYgd2l0aCB0aGUgY2xhc3MgcnVuZXN0b25lXG4gKiAyLiAgIFdyaXRlIHRoZWlyIHNvdXJjZSBBTkQgdGhlaXIgZ2VuZXJhdGVkIGh0bWwgdG8gdGhlIGRhdGFiYXNlIGlmIHRoZSBkYXRhYmFzZSBpcyBjb25maWd1cmVkXG4gKiAzLiAgIFByb3Blcmx5IHNhdmUgYW5kIHJlc3RvcmUgdGhlaXIgYW5zd2VycyB1c2luZyB0aGUgY2hlY2tTZXJ2ZXIgbWVjaGFuaXNtIGluIHRoaXMgYmFzZSBjbGFzcy4gRWFjaCBjb21wb25lbnQgbXVzdCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mOlxuICpcbiAqICAgICAgLSAgICBjaGVja0xvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHNldExvY2FsU3RvcmFnZVxuICogICAgICAtICAgIHJlc3RvcmVBbnN3ZXJzXG4gKiAgICAgIC0gICAgZGlzYWJsZUludGVyYWN0aW9uXG4gKlxuICogNC4gICBwcm92aWRlIGEgU2VsZW5pdW0gYmFzZWQgdW5pdCB0ZXN0XG4gKi9cblxuaW1wb3J0IHsgcGFnZVByb2dyZXNzVHJhY2tlciB9IGZyb20gXCIuL2Jvb2tmdW5jcy5qc1wiO1xuLy9pbXBvcnQgXCIuLy4uL3N0eWxlcy9ydW5lc3RvbmUtY3VzdG9tLXNwaGlueC1ib290c3RyYXAuY3NzXCI7XG5cbnZhciBOT19ERUNPUkFURSA9IFtcInBhcnNvbnNNb3ZlXCIsIFwic2hvd2V2YWxcIiwgXCJ2aWRlb1wiLCBcInBvbGxcIiwgXCJ2aWV3X3RvZ2dsZVwiLFxuICAgIFwiZGFzaGJvYXJkXCIsIFwic2VsZWN0cXVlc3Rpb25cIiwgXCJjb2RlbGVuc1wiLCBcInBlZXJcIl1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZSA9IG5ldyBQcm9taXNlKFxuICAgICAgICAgICAgKHJlc29sdmUpID0+ICh0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbiA9IHJlc29sdmUpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMub3B0aW9uYWwgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuYWxsQ29tcG9uZW50cyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgd2luZG93LmFsbENvbXBvbmVudHMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuYWxsQ29tcG9uZW50cy5wdXNoKHRoaXMpO1xuICAgICAgICBpZiAob3B0cykge1xuICAgICAgICAgICAgdGhpcy5zaWQgPSBvcHRzLnNpZDtcbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyYWN0aXZlID0gb3B0cy5ncmFkZXJhY3RpdmU7XG4gICAgICAgICAgICB0aGlzLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNUaW1lZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0cy5lbmZvcmNlRGVhZGxpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWRsaW5lID0gb3B0cy5kZWFkbGluZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSB0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZShvcHRzLm9yaWcsIFwiZGF0YS1vcHRpb25hbFwiKTtcbiAgICAgICAgICAgIGlmIChvcHRzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rvcl9pZCA9IG9wdHMuc2VsZWN0b3JfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdHMuYXNzZXNzbWVudFRha2VuICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBvcHRzLmFzc2Vzc21lbnRUYWtlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB0byB0cnVlIGFzIHRoaXMgb3B0IGlzIG9ubHkgcHJvdmlkZWQgZnJvbSBhIHRpbWVkQXNzZXNzbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgZm9yIHRoZSBzZWxlY3RxdWVzdGlvbiBwb2ludHNcbiAgICAgICAgICAgIC8vIElmIGEgc2VsZWN0cXVlc3Rpb24gaXMgcGFydCBvZiBhIHRpbWVkIGV4YW0gaXQgd2lsbCBnZXRcbiAgICAgICAgICAgIC8vIHRoZSB0aW1lZFdyYXBwZXIgb3B0aW9ucy5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0cy50aW1lZFdyYXBwZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVkV3JhcHBlciA9IG9wdHMudGltZWRXcmFwcGVyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBIb3dldmVyIHNvbWV0aW1lcyBzZWxlY3RxdWVzdGlvbnNcbiAgICAgICAgICAgICAgICAvLyBhcmUgdXNlZCBpbiByZWd1bGFyIGFzc2lnbm1lbnRzLiAgVGhlIGhhY2t5IHdheSB0byBkZXRlY3QgdGhpc1xuICAgICAgICAgICAgICAgIC8vIGlzIHRvIGxvb2sgZm9yIGRvQXNzaWdubWVudCBpbiB0aGUgVVJMIGFuZCB0aGVuIGdyYWJcbiAgICAgICAgICAgICAgICAvLyB0aGUgYXNzaWdubWVudCBuYW1lIGZyb20gdGhlIGhlYWRpbmcuXG4gICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImRvQXNzaWdubWVudFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZWRXcmFwcGVyID0gJChcImgxI2Fzc2lnbm1lbnRfbmFtZVwiKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lZFdyYXBwZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKG9wdHMub3JpZykuZGF0YShcInF1ZXN0aW9uX2xhYmVsXCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbl9sYWJlbCA9ICQob3B0cy5vcmlnKS5kYXRhKFwicXVlc3Rpb25fbGFiZWxcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmlzX3RvZ2dsZSA9IHRydWUgPyBvcHRzLmlzX3RvZ2dsZSA6IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5pc19zZWxlY3QgPSB0cnVlID8gb3B0cy5pc19zZWxlY3QgOiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1qZWxlbWVudHMgPSBbXTtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLm1qUmVhZHkgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBzZWxmLm1qcmVzb2x2ZXIgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hUXVldWUgPSBuZXcgQXV0b1F1ZXVlKCk7XG4gICAgICAgIGlmIChvcHRzICYmIHR5cGVvZiBvcHRzLnByZWFtYmxlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnByZWFtYmxlID0gb3B0cy5wcmVhbWJsZTtcbiAgICAgICAgICAgIGxldCB5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHkuY2xhc3NMaXN0LmFkZChcImhpZGRlbi1jb250ZW50XCIpO1xuICAgICAgICAgICAgeS5jbGFzc0xpc3QuYWRkKFwicHJvY2Vzcy1tYXRoXCIpO1xuICAgICAgICAgICAgeS5pbm5lckhUTUwgPSBcIlxcXFwoXCIgKyB0aGlzLnByZWFtYmxlICsgXCJcXFxcKVwiO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGhhY2sgdG8gZ2V0IHRoZSBwcmVhbWJsZSBpbnRvIHRoZSBET00gc28gdGhhdCBNYXRoSmF4IGNhbiBwcm9jZXNzIGl0LlxuICAgICAgICAgICAgb3B0cy5vcmlnLmFwcGVuZENoaWxkKHkpO1xuICAgICAgICAgICAgeS5pZCA9IFwibHR4X3ByZWFtYmxlXCI7XG4gICAgICAgICAgICB5LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIC8vIEFkZCB0aGUgcHJlYW1ibGUgdG8gdGhlIHF1ZXVlIG9iamVjdCBzbyBpdCBjYW4gcHJlcGVuZCBpdCB0b1xuICAgICAgICAgICAgLy8gZnV0dXJlIE1hdGhKYXggcHJvY2Vzc2luZ1xuICAgICAgICAgICAgdGhpcy5hUXVldWUucHJlYW1ibGUgPSB5XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmpzb25IZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBIZWxwZXIgZm9yIHBhcnNpbmcgYm9vbGVhbiBkYXRhLSogYXR0cmlidXRlc1xuICAgIC8vIFVuc2V0L1wiZmFsc2VcIi9cIm5vXCIgbWVhbnMgZmFsc2UsIGFueXRoaW5nIGVsc2UsIGluY2x1ZGluZyBlbXB0eSBzdHJpbmcgbWVhbnMgdHJ1ZVxuICAgIHBhcnNlQm9vbGVhbkF0dHJpYnV0ZShlbGVtZW50LCBhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICBpZiAoYXR0clZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbG93ZXJWYWx1ZSA9IGF0dHJWYWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAobG93ZXJWYWx1ZSA9PT0gXCJmYWxzZVwiIHx8IGxvd2VyVmFsdWUgPT09IFwibm9cIikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIF9gbG9nQm9va0V2ZW50YFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFRoaXMgZnVuY3Rpb24gc2VuZHMgdGhlIHByb3ZpZGVkIGBgZXZlbnRJbmZvYGAgdG8gdGhlIGBoc2Jsb2cgZW5kcG9pbnRgIG9mIHRoZSBzZXJ2ZXIuIEF3YWl0aW5nIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBlaXRoZXIgYGB1bmRlZmluZWRgYCAoaWYgUnVuZXN0b25lIHNlcnZpY2VzIGFyZSBub3QgYXZhaWxhYmxlKSBvciB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgc2VydmVyIGFzIGEgSmF2YVNjcmlwdCBvYmplY3QgKGFscmVhZHkgSlNPTi1kZWNvZGVkKS5cbiAgICBhc3luYyBsb2dCb29rRXZlbnQoZXZlbnRJbmZvKSB7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwb3N0X3JldHVybjtcbiAgICAgICAgZXZlbnRJbmZvLmNvdXJzZV9uYW1lID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgLy8gRm9yIHNlbGVjdHF1ZXN0aW9ucyB3ZSBuZWVkIHRvIGxvZyB1c2luZyB0aGUgc2VsZWN0b3JfaWQgZm9yIHJlYWwgdGltZSBzY29yaW5nXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uc2VsZWN0b3JfaWQgPSB0aGlzLnNlbGVjdG9yX2lkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wZXJjZW50ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICBldmVudEluZm8ucGVyY2VudCA9IHRoaXMucGVyY2VudDtcbiAgICAgICAgfVxuICAgICAgICBpZiAod2luZG93LmFzc2lnbm1lbnRJZCkge1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFzc2lnbm1lbnRfaWQgPSB3aW5kb3cuYXNzaWdubWVudElkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzICYmXG4gICAgICAgICAgICBlQm9va0NvbmZpZy5sb2dMZXZlbCA+IDBcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBwb3N0X3JldHVybiA9IHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCB8fCBlQm9va0NvbmZpZy5kZWJ1Zykge1xuICAgICAgICAgICAgbGV0IHByZWZpeCA9IGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gPyBcIlNhdmVcIiA6IFwiTm90XCI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtwcmVmaXh9IGxvZ2dpbmcgZXZlbnQgYCArIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbykpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gc2VsZWN0cXVlc3Rpb25zIGFyZSBwYXJ0IG9mIGFuIGFzc2lnbm1lbnQgZXNwZWNpYWxseSB0b2dnbGUgcXVlc3Rpb25zXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gY291bnQgdXNpbmcgdGhlIHNlbGVjdG9yX2lkIG9mIHRoZSBzZWxlY3QgcXVlc3Rpb24uXG4gICAgICAgIC8vIFdlICBhbHNvIG5lZWQgdG8gbG9nIGFuIGV2ZW50IGZvciB0aGF0IHNlbGVjdG9yIHNvIHRoYXQgd2Ugd2lsbCBrbm93XG4gICAgICAgIC8vIHRoYXQgaW50ZXJhY3Rpb24gaGFzIHRha2VuIHBsYWNlLiAgVGhpcyBpcyAqKmluZGVwZW5kZW50Kiogb2YgaG93IHRoZVxuICAgICAgICAvLyBhdXRvZ3JhZGVyIHdpbGwgdWx0aW1hdGVseSBncmFkZSB0aGUgcXVlc3Rpb24hXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdG9yX2lkKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZGl2X2lkID0gdGhpcy5zZWxlY3Rvcl9pZC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIFwiLXRvZ2dsZVNlbGVjdGVkUXVlc3Rpb25cIixcbiAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmV2ZW50ID0gXCJzZWxlY3RxdWVzdGlvblwiO1xuICAgICAgICAgICAgZXZlbnRJbmZvLmFjdCA9IFwiaW50ZXJhY3Rpb25cIjtcbiAgICAgICAgICAgIHRoaXMucG9zdExvZ01lc3NhZ2UoZXZlbnRJbmZvKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICBldmVudEluZm8uYWN0ICE9IFwiZWRpdFwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiB0aGUgZXZlbnQgaXMgaW4gdGhlIE5PX0RFQ09SQVRFIGxpc3QgdGhlbiBkb24ndCBkZWNvcmF0ZSB0aGUgc3RhdHVzXG4gICAgICAgIGlmIChOT19ERUNPUkFURS5pbmRleE9mKGV2ZW50SW5mby5ldmVudCkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29yYXRlU3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc3RfcmV0dXJuO1xuICAgIH1cblxuICAgIGFzeW5jIHBvc3RMb2dNZXNzYWdlKGV2ZW50SW5mbykge1xuICAgICAgICB2YXIgcG9zdF9yZXR1cm47XG4gICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL2Jvb2tldmVudGAsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbyksXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09PSA0MjIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0IGRldGFpbHMgYWJvdXQgd2h5IHRoaXMgaXMgdW5wcm9jZXNhYmxlLlxuICAgICAgICAgICAgICAgICAgICBwb3N0X3JldHVybiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkocG9zdF9yZXR1cm4uZGV0YWlsLCBudWxsLCA0KSk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVucHJvY2Vzc2FibGUgUmVxdWVzdFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zdF9yZXR1cm4gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYE1pc3NpbmcgYXV0aGVudGljYXRpb24gdG9rZW4gJHtwb3N0X3JldHVybi5kZXRhaWx9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIGF1dGhlbnRpY2F0aW9uIHRva2VuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBzYXZlIHRoZSBsb2cgZW50cnlcbiAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc3RfcmV0dXJuID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgbGV0IHNjb3JlU3BlYyA9IHBvc3RfcmV0dXJuLmRldGFpbDtcbiAgICAgICAgICAgIGxldCBncmFkZUJveCA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3Rvcl9pZCkge1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rvcl9pZCA9IHRoaXMuc2VsZWN0b3JfaWQucmVwbGFjZShcbiAgICAgICAgICAgICAgICAgICAgXCItdG9nZ2xlU2VsZWN0ZWRRdWVzdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICBcIlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBncmFkZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3NlbGVjdG9yX2lkfV9zY29yZWApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBncmFkZUJveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGAke3RoaXMuZGl2aWR9X3Njb3JlYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZ3JhZGVCb3ggJiYgIXRoaXMuaXNUaW1lZCAmJiBzY29yZVNwZWMuc2NvcmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbGV0IGRldGFpbCA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKHBvc3RfcmV0dXJuICYmIHBvc3RfcmV0dXJuLmRldGFpbCkge1xuICAgICAgICAgICAgICAgIGRldGFpbCA9IHBvc3RfcmV0dXJuLmRldGFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIGFsZXJ0KGBFcnJvcjogWW91ciBhY3Rpb24gd2FzIG5vdCBzYXZlZCFcbiAgICAgICAgICAgICAgICAgICAgVGhlIGVycm9yIHdhcyAke2V9XG4gICAgICAgICAgICAgICAgICAgIFN0YXR1cyBDb2RlOiAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgRGV0YWlsOiAke0pTT04uc3RyaW5naWZ5KGRldGFpbCwgbnVsbCwgNCl9LlxuICAgICAgICAgICAgICAgICAgICBQbGVhc2UgcmVwb3J0IHRoaXMgZXJyb3IhYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzZW5kIGEgcmVxdWVzdCB0byBzYXZlIHRoaXMgZXJyb3JcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIGBFcnJvcjogJHtlfSBEZXRhaWw6ICR7ZGV0YWlsfSBTdGF0dXMgQ29kZTogJHtyZXNwb25zZS5zdGF0dXN9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9yZXR1cm47XG4gICAgfVxuICAgIC8vIHVwZGF0ZSB0aGUgc2NvcmUgZm9yIHRoZSBxdWVzdGlvbiBhbmQgdGhlIHRvdGFsIHNjb3JlXG4gICAgLy8gdGhlIHByZXNlbmNlIG9mIHRoZSBncmFkZUJveCBpcyB1c2VkIHRvIGRldGVybWluZSBpZiB3ZSBhcmUgb24gYW4gYXNzaWdubWVudCBwYWdlLlxuICAgIHVwZGF0ZVNjb3JlcyhncmFkZUJveCwgc2NvcmVTcGVjKSB7XG4gICAgICAgIGlmICghc2NvcmVTcGVjLmFzc2lnbmVkIHx8IHNjb3JlU3BlYy5zY29yZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5kaXZpZH1fbWVzc2FnZWApLmlubmVySFRNTCA9IFwiU2NvcmUgbm90IHVwZGF0ZWQuICBTdWJtaXNzaW9ucyBhcmUgY2xvc2VkLlwiO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzY29yZVNwYW4gPSBncmFkZUJveC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicXNjb3JlXCIpWzBdO1xuICAgICAgICBpZiAoc2NvcmVTcGFuKSB7XG4gICAgICAgICAgICBzY29yZVNwYW4uaW5uZXJIVE1MID0gc2NvcmVTcGVjLnNjb3JlLnRvRml4ZWQoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGFsbFNjb3JlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJxc2NvcmVcIik7XG4gICAgICAgIGxldCBhbGxtYXggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicW1heHNjb3JlXCIpO1xuICAgICAgICBsZXQgdG90YWwgPSAwO1xuICAgICAgICBsZXQgbWF4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGxTY29yZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRvdGFsICs9IHBhcnNlRmxvYXQoYWxsU2NvcmVzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICBtYXggKz0gcGFyc2VGbG9hdChhbGxtYXhbaV0uaW5uZXJIVE1MKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG90YWxTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3RhbF9zY29yZVwiKTtcbiAgICAgICAgaWYgKHRvdGFsU3Bhbikge1xuICAgICAgICAgICAgdG90YWxTcGFuLmlubmVySFRNTCA9IHRvdGFsLnRvRml4ZWQoMSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG1heFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvdGFsX21heFwiKTtcbiAgICAgICAgaWYgKG1heFNwYW4pIHtcbiAgICAgICAgICAgIG1heFNwYW4uaW5uZXJIVE1MID0gbWF4O1xuICAgICAgICB9XG4gICAgICAgIGxldCBwZXJjZW50U3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG90YWxfcGVyY2VudFwiKTtcbiAgICAgICAgaWYgKHBlcmNlbnRTcGFuKSB7XG4gICAgICAgICAgICBwZXJjZW50U3Bhbi5pbm5lckhUTUwgPSAoKHRvdGFsIC8gbWF4KSAqIDEwMCkudG9GaXhlZCgyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC4uIF9sb2dSdW5FdmVudDpcbiAgICAvL1xuICAgIC8vIGxvZ1J1bkV2ZW50XG4gICAgLy8gLS0tLS0tLS0tLS1cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIHNlbmRzIHRoZSBwcm92aWRlZCBgYGV2ZW50SW5mb2BgIHRvIHRoZSBgcnVubG9nIGVuZHBvaW50YC4gV2hlbiBhd2FpdGVkLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIGRhdGEgKGRlY29kZWQgZnJvbSBKU09OKSB0aGUgc2VydmVyIHNlbnQgYmFjay5cbiAgICBhc3luYyBsb2dSdW5FdmVudChldmVudEluZm8pIHtcbiAgICAgICAgbGV0IHBvc3RfcHJvbWlzZSA9IFwiZG9uZVwiO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBldmVudEluZm8uY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICBldmVudEluZm8uY2xpZW50TG9naW5TdGF0dXMgPSBlQm9va0NvbmZpZy5pc0xvZ2dlZEluO1xuICAgICAgICBldmVudEluZm8udGltZXpvbmVvZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MDtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTYXZlIHx8IFwidG9fc2F2ZVwiIGluIGV2ZW50SW5mbyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGV2ZW50SW5mby5zYXZlX2NvZGUgPSBcIlRydWVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGV2ZW50SW5mby5lcnJpbmZvICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBldmVudEluZm8uZXJyaW5mbyA9IGV2ZW50SW5mby5lcnJpbmZvLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNMb2dnZWRJbiAmJlxuICAgICAgICAgICAgZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgJiZcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmxvZ0xldmVsID4gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci9ydW5sb2dgLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZXZlbnRJbmZvKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChgRmFpbGVkIHRvIHNhdmUgeW91ciBjb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBTdGF0dXMgaXMgJHtyZXNwb25zZS5zdGF0dXN9XG4gICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0X3Byb21pc2UuZGV0YWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIDRcbiAgICAgICAgICAgICAgICAgICAgKX1gKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGBEaWQgbm90IHNhdmUgdGhlIGNvZGUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgU3RhdHVzOiAke3Jlc3BvbnNlLnN0YXR1c31cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWw6ICR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlLmRldGFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDRcbiAgICAgICAgICAgICAgICAgICAgICAgICl9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9zdF9wcm9taXNlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkIHx8IGVCb29rQ29uZmlnLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInJ1bm5pbmcgXCIgKyBKU09OLnN0cmluZ2lmeShldmVudEluZm8pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID09IGZhbHNlXG4gICAgICAgICkge1xuICAgICAgICAgICAgcGFnZVByb2dyZXNzVHJhY2tlci51cGRhdGVQcm9ncmVzcyhldmVudEluZm8uZGl2X2lkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zdF9wcm9taXNlO1xuICAgIH1cbiAgICAvKiBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZVxuICAgICoqV0FSTklORzoqKiAgRE8gTk9UIGBhd2FpdGAgdGhpcyBmdW5jdGlvbiFcbiAgICBUaGlzIGZ1bmN0aW9uLCBhbHRob3VnaCBhc3luYywgZG9lcyBub3QgZXhwbGljaXRseSByZXNvbHZlIGl0cyBwcm9taXNlIGJ5IHJldHVybmluZyBhIHZhbHVlLiAgVGhlIHJlYXNvbiBmb3IgdGhpcyBpcyBiZWNhdXNlIGl0IGlzIGNhbGxlZCBieSB0aGUgY29uc3RydWN0b3IgZm9yIG5lYXJseSBldmVyeSBjb21wb25lbnQuICBJbiBKYXZhc2NyaXB0IGNvbnN0cnVjdG9ycyBjYW5ub3QgYmUgYXN5bmMhXG5cbiAgICBPbmUgb2YgdGhlIHJlY29tbWVuZGVkIHdheXMgdG8gaGFuZGxlIHRoZSBhc3luYyByZXF1aXJlbWVudHMgZnJvbSB3aXRoaW4gYSBjb25zdHJ1Y3RvciBpcyB0byB1c2UgYW4gYXR0cmlidXRlIGFzIGEgcHJvbWlzZSBhbmQgcmVzb2x2ZSB0aGF0IGF0dHJpYnV0ZSBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZS5cbiAgICAqL1xuICAgIGFzeW5jIGNoZWNrU2VydmVyKFxuICAgICAgICAvLyBBIHN0cmluZyBzcGVjaWZ5aW5nIHRoZSBldmVudCBuYW1lIHRvIHVzZSBmb3IgcXVlcnlpbmcgdGhlIDpyZWY6YGdldEFzc2Vzc1Jlc3VsdHNgIGVuZHBvaW50LlxuICAgICAgICBldmVudEluZm8sXG4gICAgICAgIC8vIElmIHRydWUsIHRoaXMgZnVuY3Rpb24gd2lsbCBpbnZva2UgYGBpbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKWBgIGp1c3QgYmVmb3JlIGl0IHJldHVybnMuIFRoaXMgaXMgcHJvdmlkZWQgc2luY2UgbW9zdCBjb21wb25lbnRzIGFyZSByZWFkeSBhZnRlciB0aGlzIGZ1bmN0aW9uIGNvbXBsZXRlcyBpdHMgd29yay5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVE9ETzogVGhpcyBkZWZhdWx0cyB0byBmYWxzZSwgdG8gYXZvaWQgY2F1c2luZyBwcm9ibGVtcyB3aXRoIGFueSBjb21wb25lbnRzIHRoYXQgaGF2ZW4ndCBiZWVuIHVwZGF0ZWQgYW5kIHRlc3RlZC4gQWZ0ZXIgYWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGhhdmUgYmVlbiB1cGRhdGVkLCBkZWZhdWx0IHRoaXMgdG8gdHJ1ZSBhbmQgcmVtb3ZlIHRoZSBleHRyYSBwYXJhbWV0ZXIgZnJvbSBtb3N0IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24uXG4gICAgICAgIHdpbGxfYmVfcmVhZHkgPSBmYWxzZVxuICAgICkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgc2VydmVyIGhhcyBzdG9yZWQgYW5zd2VyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlckNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgc2VsZi5jc3Jlc29sdmVyID0gcmVzb2x2ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4gJiZcbiAgICAgICAgICAgICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzIHx8IHRoaXMuZ3JhZGVyYWN0aXZlKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgICAgIGRhdGEuZXZlbnQgPSBldmVudEluZm87XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUgJiYgdGhpcy5kZWFkbGluZSkge1xuICAgICAgICAgICAgICAgIGRhdGEuZGVhZGxpbmUgPSB0aGlzLmRlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEucmF3ZGVhZGxpbmUgPSB0aGlzLnJhd2RlYWRsaW5lO1xuICAgICAgICAgICAgICAgIGRhdGEudHpvZmYgPSB0aGlzLnR6b2ZmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2lkKSB7XG4gICAgICAgICAgICAgICAgZGF0YS5zaWQgPSB0aGlzLnNpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKGRhdGEuZGl2X2lkICYmIGRhdGEuY291cnNlICYmIGRhdGEuZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBBIHJlcXVpcmVkIGZpZWxkIGlzIG1pc3NpbmcgZGF0YSAke2RhdGEuZGl2X2lkfToke2RhdGEuY291cnNlfToke2RhdGEuZXZlbnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgTk9UIGluIHByYWN0aWNlIG1vZGUgYW5kIHdlIGFyZSBub3QgaW4gYSBwZWVyIGV4ZXJjaXNlXG4gICAgICAgICAgICAvLyBhbmQgYXNzZXNzbWVudFRha2VuIGlzIHRydWVcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAhZUJvb2tDb25maWcucHJhY3RpY2VfbW9kZSAmJlxuICAgICAgICAgICAgICAgICFlQm9va0NvbmZpZy5wZWVyICYmXG4gICAgICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW5cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgICAgIGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L3Jlc3VsdHNgLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlc3BvbnNlIGZyb20gc2VydmVyOiAke3Jlc3BvbnNlLnN0YXR1c31gKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYERhdGEgZnJvbSBzZXJ2ZXI6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9IGNhbGxpbmcgcmVwb3B1bGF0ZUZyb21TdG9yYWdlYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlcG9wdWxhdGVGcm9tU3RvcmFnZShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5jb3JyZWN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYHJlc29sdmluZyBjaGVja1NlcnZlciB3aXRoIHNlcnZlciBkYXRhYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJzZXJ2ZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgSFRUUCBFcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpOyAvLyBqdXN0IGdvIHJpZ2h0IHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGByZXNvbHZpbmcgY2hlY2tTZXJ2ZXIgd2l0aCBsb2NhbCBkYXRhYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNzcmVzb2x2ZXIoXCJsb2NhbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREYXRhKHt9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIG5vIGFuc3dlciBnaXZlbmApO1xuICAgICAgICAgICAgICAgIHRoaXMuY3NyZXNvbHZlcihcIm5vdCB0YWtlblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tMb2NhbFN0b3JhZ2UoKTsgLy8ganVzdCBnbyByaWdodCB0byBsb2NhbCBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgcmVzb2x2aW5nIGNoZWNrU2VydmVyIHdpdGggbG9jYWwgZGF0YWApO1xuICAgICAgICAgICAgdGhpcy5jc3Jlc29sdmVyKFwibG9jYWxcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2lsbF9iZV9yZWFkeSkge1xuICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhhdCBgYHRoaXMuY29tcG9uZW50RGl2YGAgcmVmZXJzIHRvIHRoZSBgYGRpdmBgIGNvbnRhaW5pbmcgdGhlIGNvbXBvbmVudCwgYW5kIHRoYXQgdGhpcyBjb21wb25lbnQncyBJRCBpcyBzZXQuXG4gICAgaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCkge1xuICAgICAgICAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSB0aGUgY29tcG9uZW50IGlzIG5vdyByZWFkeS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1jb21wb25lbnQtcmVhZHlcIik7XG4gICAgICAgIC8vIFJlc29sdmUgdGhlIGBgdGhpcy5jb21wb25lbnRfcmVhZHlfcHJvbWlzZWBgLlxuICAgICAgICB0aGlzLl9jb21wb25lbnRfcmVhZHlfcmVzb2x2ZV9mbigpO1xuICAgIH1cblxuICAgIGxvYWREYXRhKGRhdGEpIHtcbiAgICAgICAgLy8gZm9yIG1vc3QgY2xhc3NlcywgbG9hZERhdGEgZG9lc24ndCBkbyBhbnl0aGluZy4gQnV0IGZvciBQYXJzb25zLCBhbmQgcGVyaGFwcyBvdGhlcnMgaW4gdGhlIGZ1dHVyZSxcbiAgICAgICAgLy8gaW5pdGlhbGl6YXRpb24gY2FuIGhhcHBlbiBldmVuIHdoZW4gdGhlcmUncyBubyBoaXN0b3J5IHRvIGJlIGxvYWRlZFxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXBvcHVsYXRlRnJvbVN0b3JhZ2UgaXMgY2FsbGVkIGFmdGVyIGEgc3VjY2Vzc2Z1bCBBUEkgY2FsbCBpcyBtYWRlIHRvIGBgZ2V0QXNzZXNzUmVzdWx0c2BgIGluXG4gICAgICogdGhlIGNoZWNrU2VydmVyIG1ldGhvZCBpbiB0aGlzIGNsYXNzXG4gICAgICpcbiAgICAgKiBgYHJlc3RvcmVBbnN3ZXJzLGBgIGBgc2V0TG9jYWxTdG9yYWdlYGAgYW5kIGBgY2hlY2tMb2NhbFN0b3JhZ2VgYCBhcmUgZGVmaW5lZCBpbiB0aGUgY2hpbGQgY2xhc3Nlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gZGF0YSAtIGEgSlNPTiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBkYXRhIG5lZWRlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgYW5zd2VyIGZvciBhIGNvbXBvbmVudFxuICAgICAqIEBwYXJhbSB7Kn0gc3RhdHVzIC0gdGhlIGh0dHAgc3RhdHVzXG4gICAgICogQHBhcmFtIHsqfSB3aGF0ZXZlciAtIGlnbm9yZWRcbiAgICAgKi9cbiAgICByZXBvcHVsYXRlRnJvbVN0b3JhZ2UoZGF0YSkge1xuICAgICAgICAvLyBkZWNpZGUgd2hldGhlciB0byB1c2UgdGhlIHNlcnZlcidzIGFuc3dlciAoaWYgdGhlcmUgaXMgb25lKSBvciB0byBsb2FkIGZyb20gc3RvcmFnZVxuICAgICAgICBpZiAoZGF0YSAhPT0gbnVsbCAmJiBkYXRhICE9PSBcIm5vIGRhdGFcIiAmJiB0aGlzLnNob3VsZFVzZVNlcnZlcihkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGRhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jaGVja0xvY2FsU3RvcmFnZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG4gICAgc2hvdWxkVXNlU2VydmVyKGRhdGEpIHtcbiAgICAgICAgLy8gcmV0dXJucyB0cnVlIGlmIHNlcnZlciBkYXRhIGlzIG1vcmUgcmVjZW50IHRoYW4gbG9jYWwgc3RvcmFnZSBvciBpZiBzZXJ2ZXIgc3RvcmFnZSBpcyBjb3JyZWN0XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gXCJUXCIgfHxcbiAgICAgICAgICAgIGRhdGEuY29ycmVjdCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHRoaXMuaXNUaW1lZFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICBpZiAoZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzdG9yZWREYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIC8vIGRlZmluaXRlbHkgZG9uJ3Qgd2FudCB0byB1c2UgbG9jYWwgc3RvcmFnZSBoZXJlXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5hbnN3ZXIgPT0gc3RvcmVkRGF0YS5hbnN3ZXIpIHJldHVybiB0cnVlO1xuICAgICAgICBsZXQgc3RvcmFnZURhdGUgPSBuZXcgRGF0ZShzdG9yZWREYXRhLnRpbWVzdGFtcCk7XG4gICAgICAgIGxldCBzZXJ2ZXJEYXRlID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gc2VydmVyRGF0ZSA+PSBzdG9yYWdlRGF0ZTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBrZXkgd2hpY2ggdG8gYmUgdXNlZCB3aGVuIGFjY2Vzc2luZyBsb2NhbCBzdG9yYWdlLlxuICAgIGxvY2FsU3RvcmFnZUtleSgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmVtYWlsICtcbiAgICAgICAgICAgIFwiOlwiICtcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLmNvdXJzZSArXG4gICAgICAgICAgICBcIjpcIiArXG4gICAgICAgICAgICB0aGlzLmRpdmlkICtcbiAgICAgICAgICAgIFwiLWdpdmVuXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgYWRkQ2FwdGlvbihlbFR5cGUpIHtcbiAgICAgICAgLy9zb21lRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdFbGVtZW50LCBzb21lRWxlbWVudC5uZXh0U2libGluZyk7XG4gICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICB2YXIgY2FwRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbl9sYWJlbCkge1xuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgY2FwdGlvbiBiYXNlZCBvbiB3aGV0aGVyIFJ1bmVzdG9uZSBzZXJ2aWNlcyBoYXZlIGJlZW4gZGV0ZWN0ZWRcbiAgICAgICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlc1xuICAgICAgICAgICAgICAgICAgICA/IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn0gIDxzcGFuIGNsYXNzPVwicnVuZXN0b25lX2NhcHRpb25fZGl2aWRcIj4oJHt0aGlzLmRpdmlkfSk8L3NwYW4+YFxuICAgICAgICAgICAgICAgICAgICA6IGBBY3Rpdml0eTogJHt0aGlzLnF1ZXN0aW9uX2xhYmVsfSAke3RoaXMuY2FwdGlvbn1gOyAvLyBXaXRob3V0IHJ1bmVzdG9uZVxuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5odG1sKHRoaXMuY2FwdGlvbik7XG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmFkZENsYXNzKGAke2VsVHlwZX1fY2FwdGlvbmApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEaXNwbGF5IGNhcHRpb24gYmFzZWQgb24gd2hldGhlciBSdW5lc3RvbmUgc2VydmljZXMgaGF2ZSBiZWVuIGRldGVjdGVkXG4gICAgICAgICAgICAgICAgJChjYXBEaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuY2FwdGlvbiArIFwiIChcIiArIHRoaXMuZGl2aWQgKyBcIilcIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmNhcHRpb25cbiAgICAgICAgICAgICAgICApOyAvLyBXaXRob3V0IHJ1bmVzdG9uZVxuICAgICAgICAgICAgICAgICQoY2FwRGl2KS5hZGRDbGFzcyhgJHtlbFR5cGV9X2NhcHRpb25gKTtcbiAgICAgICAgICAgICAgICAkKGNhcERpdikuYWRkQ2xhc3MoYCR7ZWxUeXBlfV9jYXB0aW9uX3RleHRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FwRGl2ID0gY2FwRGl2O1xuICAgICAgICAgICAgLy90aGlzLm91dGVyRGl2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGNhcERpdiwgdGhpcy5vdXRlckRpdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChjYXBEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaGFzVXNlckFjdGl2aXR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc0Fuc3dlcmVkO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGNoZWNrQ3VycmVudEFuc3dlclwiXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIGxvZ0N1cnJlbnRBbnN3ZXJcIlxuICAgICAgICApO1xuICAgIH1cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICBcIkVhY2ggY29tcG9uZW50IHNob3VsZCBwcm92aWRlIGFuIGltcGxlbWVudGF0aW9uIG9mIHJlbmRlckZlZWRiYWNrXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIFwiRWFjaCBjb21wb25lbnQgc2hvdWxkIHByb3ZpZGUgYW4gaW1wbGVtZW50YXRpb24gb2YgZGlzYWJsZUludGVyYWN0aW9uXCJcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX06ICR7dGhpcy5kaXZpZH1gO1xuICAgIH1cblxuICAgIHF1ZXVlTWF0aEpheChjb21wb25lbnQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBNYXRoSmF4ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIC0tIE1hdGhKYXggaXMgbm90IGxvYWRlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZWUgLSBodHRwczovL2RvY3MubWF0aGpheC5vcmcvZW4vbGF0ZXN0L2FkdmFuY2VkL3R5cGVzZXQuaHRtbFxuICAgICAgICAgICAgLy8gUGVyIHRoZSBhYm92ZSB3ZSBzaG91bGQga2VlcCB0cmFjayBvZiB0aGUgcHJvbWlzZXMgYW5kIG9ubHkgY2FsbCB0aGlzXG4gICAgICAgICAgICAvLyBhIHNlY29uZCB0aW1lIGlmIGFsbCBwcmV2aW91cyBwcm9taXNlcyBoYXZlIHJlc29sdmVkLlxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgcXVldWUgb2YgY29tcG9uZW50c1xuICAgICAgICAgICAgLy8gc2hvdWxkIHdhaXQgdW50aWwgZGVmYXVsdFBhZ2VSZWFkeSBpcyBkZWZpbmVkXG4gICAgICAgICAgICAvLyBJZiBkZWZhdWx0UGFnZVJlYWR5IGlzIG5vdCBkZWZpbmVkIHRoZW4ganVzdCBlbnF1ZXVlIHRoZSBjb21wb25lbnRzLlxuICAgICAgICAgICAgLy8gT25jZSBkZWZhdWx0UGFnZVJlYWR5IGlzIGRlZmluZWRcbiAgICAgICAgICAgIC8vIHRoZSB3aW5kb3cucnVuZXN0b25lTWF0aFJlYWR5IHByb21pc2Ugd2lsbCBiZSBmdWxmaWxsZWQgd2hlbiB0aGVcbiAgICAgICAgICAgIC8vIGluaXRpYWwgdHlwZXNldHRpbmcgaXMgY29tcGxldGUuXG4gICAgICAgICAgICBpZiAoTWF0aEpheC50eXBlc2V0UHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93LnJ1bmVzdG9uZU1hdGhSZWFkeSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnJ1bmVzdG9uZU1hdGhSZWFkeS50aGVuKCgpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1qcmVzb2x2ZXIodGhpcy5hUXVldWUuZW5xdWV1ZShjb21wb25lbnQpKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1qcmVzb2x2ZXIodGhpcy5hUXVldWUuZW5xdWV1ZShjb21wb25lbnQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBXYWl0aW5nIG9uIE1hdGhKYXghISAke01hdGhKYXgudHlwZXNldFByb21pc2V9YCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnF1ZXVlTWF0aEpheChjb21wb25lbnQpLCAyMDApO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZXR1cm5pbmcgbWpyZWFkeSBwcm9taXNlOiAke3RoaXMubWpSZWFkeX1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5talJlYWR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjb3JhdGVTdGF0dXMoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVGltZWQgfHwgZUJvb2tDb25maWcucGVlcikgcmV0dXJuO1xuICAgICAgICBsZXQgcnNEaXYgPSAkKHRoaXMuY29udGFpbmVyRGl2KS5jbG9zZXN0KFwiZGl2LnJ1bmVzdG9uZVwiKVswXTtcbiAgICAgICAgaWYgKCFyc0RpdikgcmV0dXJuO1xuICAgICAgICByc0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwibm90QW5zd2VyZWRcIik7XG4gICAgICAgIHJzRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJpc0luQ29ycmVjdFwiKTtcbiAgICAgICAgcnNEaXYuY2xhc3NMaXN0LnJlbW92ZShcImlzQ29ycmVjdFwiKTtcbiAgICAgICAgbGV0IGFzc2lnbm1lbnRJbmZvID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oYGN1cnJlbnRBc3NpZ25tZW50SW5mb18ke2VCb29rQ29uZmlnLmNvdXJzZX1gKTtcbiAgICAgICAgbGV0IHF1ZXN0aW9ucyA9IFtdO1xuICAgICAgICBpZiAoYXNzaWdubWVudEluZm8pIHtcbiAgICAgICAgICAgIHF1ZXN0aW9ucyA9IEpTT04ucGFyc2UoYXNzaWdubWVudEluZm8pLnF1ZXN0aW9uc1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWVzdGlvbnMuaW5kZXhPZih0aGlzLmRpdmlkKSA+PSAwKSB7XG4gICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNBc3NpZ25lZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNDb3JyZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuY29ycmVjdCA9PT0gbnVsbCB8fCB0eXBlb2YgdGhpcy5jb3JyZWN0ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgcnNEaXYuY2xhc3NMaXN0LmFkZChcIm5vdEFuc3dlcmVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByc0Rpdi5jbGFzc0xpc3QuYWRkKFwiaXNJbkNvcnJlY3RcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEluc3BpcmF0aW9uIGFuZCBsb3RzIG9mIGNvZGUgZm9yIHRoaXMgc29sdXRpb24gY29tZSBmcm9tXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MzU0MDM0OC9qcy1hc3luYy1hd2FpdC10YXNrcy1xdWV1ZVxuLy8gVGhlIGlkZWEgaGVyZSBpcyB0aGF0IHVudGlsIE1hdGhKYXggaXMgcmVhZHkgd2UgY2FuIGp1c3QgZW5xdWV1ZSB0aGluZ3Ncbi8vIG9uY2UgbWF0aGpheCBiZWNvbWVzIHJlYWR5IHRoZW4gd2UgY2FuIGRyYWluIHRoZSBxdWV1ZSBhbmQgY29udGludWUgYXMgdXN1YWwuXG5cbmNsYXNzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSBbXTtcbiAgICB9XG4gICAgZW5xdWV1ZShpdGVtKSB7XG4gICAgICAgIHRoaXMuX2l0ZW1zLnB1c2goaXRlbSk7XG4gICAgfVxuICAgIGRlcXVldWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcy5zaGlmdCgpO1xuICAgIH1cbiAgICBnZXQgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICB9XG59XG5cbmNsYXNzIEF1dG9RdWV1ZSBleHRlbmRzIFF1ZXVlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBlbnF1ZXVlKGNvbXBvbmVudCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgc3VwZXIuZW5xdWV1ZSh7IGNvbXBvbmVudCwgcmVzb2x2ZSwgcmVqZWN0IH0pO1xuICAgICAgICAgICAgdGhpcy5kZXF1ZXVlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGRlcXVldWUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wZW5kaW5nUHJvbWlzZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGxldCBpdGVtID0gc3VwZXIuZGVxdWV1ZSgpO1xuXG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBsZXQgcXEgPSB0aGlzO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fcGVuZGluZ1Byb21pc2UgPSB0cnVlO1xuXG4gICAgICAgICAgICBsZXQgcGF5bG9hZCA9IGF3YWl0IHdpbmRvdy5ydW5lc3RvbmVNYXRoUmVhZHlcbiAgICAgICAgICAgICAgICAudGhlbihhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgYE1hdGhKYXggUmVhZHkgLS0gZGVxdWVpbmcgYSB0eXBlc2V0dGluZyBydW4gZm9yICR7aXRlbS5jb21wb25lbnQuaWR9ICR7cXEucHJlYW1ibGU/LmlubmVySFRNTH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChxcS5wcmVhbWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgTWF0aEpheC50eXBlc2V0UHJvbWlzZShbcXEucHJlYW1ibGVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVXNlIGluc2VydEFkamFjZW50RWxlbWVudCB0byBwcmVzZXJ2ZSBleGlzdGluZyBET00gZWxlbWVudHMgYW5kIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5zdGVhZCBvZiBvdmVyd3JpdGluZyBpbm5lckhUTUwgd2hpY2ggZGVzdHJveXMgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmVhbWJsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVhbWJsZURpdi5pbm5lckhUTUwgPSBxcS5wcmVhbWJsZS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbXBvbmVudC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIHByZWFtYmxlRGl2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBNYXRoSmF4IHR5cGVzZXQgdGhlIHByZWFtYmxlIGZvciAke2l0ZW0uY29tcG9uZW50LmlkfWBcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgTWF0aEpheC50eXBlc2V0UHJvbWlzZShbaXRlbS5jb21wb25lbnRdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCBNYXRoSmF4LnR5cGVzZXRQcm9taXNlKFtpdGVtLmNvbXBvbmVudF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICBpdGVtLnJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRoaXMuX3BlbmRpbmdQcm9taXNlID0gZmFsc2U7XG4gICAgICAgICAgICBpdGVtLnJlamVjdChlKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGFyZSBtb3JlIGl0ZW1zIGluIHRoZSBxdWV1ZSwgY29udGludWUgcHJvY2Vzc2luZyB0aGVtXG4gICAgICAgICAgICB0aGlzLmRlcXVldWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cblxud2luZG93LlJ1bmVzdG9uZUJhc2UgPSBSdW5lc3RvbmVCYXNlO1xuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIEEgZnJhbWV3b3JrIGFsbG93aW5nIGEgUnVuZXN0b25lIGNvbXBvbmVudCB0byBsb2FkIG9ubHkgdGhlIEpTIGl0IG5lZWRzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhlIEphdmFTY3JpcHQgcmVxdWlyZWQgYnkgYWxsIFJ1bmVzdG9uZSBjb21wb25lbnRzIGlzIHF1aXRlIGxhcmdlIGFuZCByZXN1bHRzIGluIHNsb3cgcGFnZSBsb2Fkcy4gVGhpcyBhcHByb2FjaCBlbmFibGVzIGEgUnVuZXN0b25lIGNvbXBvbmVudCB0byBsb2FkIG9ubHkgdGhlIEphdmFTY3JpcHQgaXQgbmVlZHMsIHJhdGhlciB0aGFuIGxvYWRpbmcgSmF2YVNjcmlwdCBmb3IgYWxsIHRoZSBjb21wb25lbnRzIHJlZ2FyZGxlc3Mgb2Ygd2hpY2ggYXJlIGFjdHVhbGx5IHVzZWQuXG4vL1xuLy8gVG8gYWNjb21wbGlzaCB0aGlzLCB3ZWJwYWNrJ3Mgc3BsaXQtY2h1bmtzIGFiaWxpdHkgYW5hbHl6ZXMgYWxsIEpTLCBzdGFydGluZyBmcm9tIHRoaXMgZmlsZS4gVGhlIGR5bmFtaWMgaW1wb3J0cyBiZWxvdyBhcmUgdHJhbnNmb3JtZWQgYnkgd2VicGFjayBpbnRvIHRoZSBkeW5hbWljIGZldGNoZXMgb2YganVzdCB0aGUgSlMgcmVxdWlyZWQgYnkgZWFjaCBmaWxlIGFuZCBhbGwgaXRzIGRlcGVuZGVuY2llcy4gKElmIHVzaW5nIHN0YXRpYyBpbXBvcnRzLCB3ZWJwYWNrIHdpbGwgYXNzdW1lIHRoYXQgYWxsIGZpbGVzIGFyZSBhbHJlYWR5IHN0YXRpY2FsbHkgbG9hZGVkIHZpYSBzY3JpcHQgdGFncywgZGVmZWF0aW5nIHRoZSBwdXJwb3NlIG9mIHRoaXMgZnJhbWV3b3JrLilcbi8vXG4vLyBIb3dldmVyLCB0aGlzIGFwcHJvYWNoIGxlYWRzIHRvIGNvbXBsZXhpdHk6XG4vL1xuLy8gLSAgICBUaGUgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSBvZiBlYWNoIGNvbXBvbmVudCBtdXN0IGJlIGtlcHQgaW4gc3luYyB3aXRoIHRoZSBrZXlzIG9mIHRoZSBgYG1vZHVsZV9tYXBgYCBiZWxvdy5cbi8vIC0gICAgVGhlIHZhbHVlcyBpbiB0aGUgYGBtb2R1bGVfbWFwYGAgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCB0aGUgSmF2YVNjcmlwdCBmaWxlcyB3aGljaCBpbXBsZW1lbnQgZWFjaCBvZiB0aGUgY29tcG9uZW50cy5cblxuLy8gU3RhdGljIGltcG9ydHNcbi8vID09PT09PT09PT09PT09XG4vLyBUaGVzZSBpbXBvcnRzIGFyZSAod2UgYXNzdW1lKSBuZWVkZWQgYnkgYWxsIHBhZ2VzLiBIb3dldmVyLCBpdCB3b3VsZCBiZSBtdWNoIGJldHRlciB0byBsb2FkIHRoZXNlIGluIHRoZSBtb2R1bGVzIHRoYXQgYWN0dWFsbHkgdXNlIHRoZW0uXG4vL1xuLy8gVGhlc2UgYXJlIHN0YXRpYyBpbXBvcnRzOyBjb2RlIGluIGBkeW5hbWljYWxseSBsb2FkZWQgY29tcG9uZW50c2BfIGRlYWxzIHdpdGggZHluYW1pYyBpbXBvcnRzLlxuLy9cbi8vIGpRdWVyeS1yZWxhdGVkIGltcG9ydHMuXG5pbXBvcnQgXCJqcXVlcnktdWkvanF1ZXJ5LXVpLmpzXCI7XG5pbXBvcnQgXCJqcXVlcnktdWkvdGhlbWVzL2Jhc2UvanF1ZXJ5LnVpLmFsbC5jc3NcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9qcXVlcnkuaWRsZS10aW1lci5qc1wiO1xuLy8gaTE4biBpcyBub3cgaGFuZGxlZCBieSB0aGUgZGVwZW5kZW5jeS1mcmVlIHJ1bmVzdG9uZS9jb21tb24vanMvcnNpMThuLmpzO1xuLy8gdGhlIHZlbmRvcmVkIFdpa2ltZWRpYSBqcXVlcnkuaTE4biBwbHVnaW4gaGFzIGJlZW4gcmVtb3ZlZC5cblxuLy8gQm9vdHN0cmFwIC0gbm90IG5lZWRlZCBmb3IgcHh4IGRldmVsb3BtZW50XG5pbXBvcnQgXCJib290c3RyYXAvZGlzdC9qcy9ib290c3RyYXAuanNcIjtcblxuLy8gY29tbW9uIHN0eWxlcyBjb21lIGZyb20gaGVyZVxuaW1wb3J0IFwiLi9wdHhycy1ib290c3RyYXAubGVzc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL3Byb2plY3RfdGVtcGxhdGUvX3RlbXBsYXRlcy9wbHVnaW5fbGF5b3V0cy9zcGhpbnhfYm9vdHN0cmFwL3N0YXRpYy9ib290c3RyYXAtc3BoaW54LmpzXCI7XG5cbi8vIE1pc2NcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9ib29rZnVuY3MuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy91c2VyLWhpZ2hsaWdodHMuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmV0ZXh0LmpzXCI7XG5cblxuLy8gVGhlc2UgYXJlIG9ubHkgbmVlZGVkIGZvciB0aGUgUnVuZXN0b25lIGJvb2ssIGJ1dCBub3QgaW4gYSBsaWJyYXJ5IG1vZGUgKHN1Y2ggYXMgcHJldGV4dCkuIEkgd291bGQgcHJlZmVyIHRvIGR5bmFtaWNhbGx5IGxvYWQgdGhlbS4gSG93ZXZlciwgdGhlc2Ugc2NyaXB0cyBhcmUgc28gc21hbGwgSSBoYXZlbid0IGJvdGhlcmVkIHRvIGRvIHNvLlxuaW1wb3J0IHsgZ2V0U3dpdGNoLCBzd2l0Y2hUaGVtZSB9IGZyb20gXCIuL3J1bmVzdG9uZS9jb21tb24vanMvdGhlbWUuanNcIjtcbmltcG9ydCBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9wcmVzZW50ZXJfbW9kZS5qc1wiO1xuaW1wb3J0IFwiLi9ydW5lc3RvbmUvY29tbW9uL2Nzcy9wcmVzZW50ZXJfbW9kZS5sZXNzXCI7XG5pbXBvcnQgeyByZW5kZXJPbmVDb21wb25lbnQgfSBmcm9tIFwiLi9ydW5lc3RvbmUvY29tbW9uL2pzL3JlbmRlckNvbXBvbmVudC5qc1wiO1xuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4vcnVuZXN0b25lL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgeyBTcGxpY2VXcmFwcGVyIH0gZnJvbSBcIi4vcnVuZXN0b25lL3NwbGljZS9qcy9zcGxpY2VXcmFwcGVyLnRzXCI7XG5cbi8vIER5bmFtaWNhbGx5IGxvYWRlZCBjb21wb25lbnRzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGhpcyBwcm92aWRlcyBhIGxpc3Qgb2YgbW9kdWxlcyB0aGF0IGNvbXBvbmVudHMgY2FuIGR5bmFtaWNhbGx5IGltcG9ydC4gV2VicGFjayB3aWxsIGNyZWF0ZSBhIGxpc3Qgb2YgaW1wb3J0cyBmb3IgZWFjaCBiYXNlZCBvbiBpdHMgYW5hbHlzaXMuXG5jb25zdCBtb2R1bGVfbWFwID0ge1xuICAgIC8vIFdyYXAgZWFjaCBpbXBvcnQgaW4gYSBmdW5jdGlvbiwgc28gdGhhdCBpdCB3b24ndCBvY2N1ciB1bnRpbCB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLiBXaGlsZSBzb21ldGhpbmcgY2xlYW5lciB3b3VsZCBiZSBuaWNlLCB3ZWJwYWNrIGNhbid0IGFuYWx5emUgdGhpbmdzIGxpa2UgYGBpbXBvcnQoZXhwcmVzc2lvbilgYC5cbiAgICAvL1xuICAgIC8vIFRoZSBrZXlzIG11c3QgbWF0Y2ggdGhlIHZhbHVlIG9mIGVhY2ggY29tcG9uZW50J3MgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZSAtLSB0aGUgYGBydW5lc3RvbmVfaW1wb3J0YGAgYW5kIGBgcnVuZXN0b25lX2F1dG9faW1wb3J0YGAgZnVuY3Rpb25zIGFzc3VtZSB0aGlzLlxuICAgIGFjdGl2ZWNvZGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2FjdGl2ZWNvZGUvanMvYWNmYWN0b3J5LmpzXCIpLFxuICAgIC8vIEFsd2F5cyBpbXBvcnQgdGhlIHRpbWVkIHZlcnNpb24gb2YgYSBjb21wb25lbnQgaWYgYXZhaWxhYmxlLCBzaW5jZSB0aGUgdGltZWQgY29tcG9uZW50cyBhbHNvIGRlZmluZSB0aGUgY29tcG9uZW50J3MgZmFjdG9yeSBhbmQgaW5jbHVkZSB0aGUgY29tcG9uZW50IGFzIHdlbGwuIE5vdGUgdGhhdCBgYGFjZmFjdG9yeWBgIGltcG9ydHMgdGhlIHRpbWVkIGNvbXBvbmVudHMgb2YgQWN0aXZlQ29kZSwgc28gaXQgZm9sbG93cyB0aGlzIHBhdHRlcm4uXG4gICAgY2xpY2thYmxlYXJlYTogKCkgPT5cbiAgICAgICAgaW1wb3J0KFwiLi9ydW5lc3RvbmUvY2xpY2thYmxlQXJlYS9qcy90aW1lZGNsaWNrYWJsZS5qc1wiKSxcbiAgICBjb2RlbGVuczogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvY29kZWxlbnMvanMvY29kZWxlbnMuanNcIiksXG4gICAgZGF0YWZpbGU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2RhdGFmaWxlL2pzL2RhdGFmaWxlLmpzXCIpLFxuICAgIGRyYWduZHJvcDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzXCIpLFxuICAgIGZpbGxpbnRoZWJsYW5rOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qc1wiKSxcbiAgICBncm91cHN1YjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvZ3JvdXBzdWIvanMvZ3JvdXBzdWIuanNcIiksXG4gICAgbWF0Y2hpbmc6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL21hdGNoaW5nL2pzL21hdGNoaW5nLmpzXCIpLFxuICAgIG11bHRpcGxlY2hvaWNlOiAoKSA9PiBpbXBvcnQoXCIuL3J1bmVzdG9uZS9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIiksXG4gICAgaHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL2hwYXJzb25zL2pzL2hwYXJzb25zLmpzXCIpLFxuICAgIHBhcnNvbnM6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzXCIpLFxuICAgIHBvbGw6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3BvbGwvanMvcG9sbC5qc1wiKSxcbiAgICBzZWxlY3RxdWVzdGlvbjogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2VsZWN0cXVlc3Rpb24vanMvc2VsZWN0b25lLmpzXCIpLFxuICAgIHNob3J0YW5zd2VyOiAoKSA9PlxuICAgICAgICBpbXBvcnQoXCIuL3J1bmVzdG9uZS9zaG9ydGFuc3dlci9qcy90aW1lZF9zaG9ydGFuc3dlci5qc1wiKSxcbiAgICBzaG93ZXZhbDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvc2hvd2V2YWwvanMvc2hvd0V2YWwuanNcIiksXG4gICAgdGFiYmVkU3R1ZmY6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3RhYmJlZFN0dWZmL2pzL3RhYmJlZHN0dWZmLmpzXCIpLFxuICAgIHRpbWVkQXNzZXNzbWVudDogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvdGltZWQvanMvdGltZWQuanNcIiksXG4gICAgLy8gVE9ETzogc2luY2UgdGhpcyBpc24ndCBpbiBhIGBgZGF0YS1jb21wb25lbnRgYCwgbmVlZCB0byB0cmlnZ2VyIGFuIGltcG9ydCBvZiB0aGlzIGNvZGUgbWFudWFsbHkuXG4gICAgd2Vid29yazogKCkgPT4gaW1wb3J0KFwiLi9ydW5lc3RvbmUvd2Vid29yay9qcy93ZWJ3b3JrLmpzXCIpLFxuICAgIHlvdXR1YmU6ICgpID0+IGltcG9ydChcIi4vcnVuZXN0b25lL3ZpZGVvL2pzL3J1bmVzdG9uZXZpZGVvLmpzXCIpLFxuICAgIGRvZW5ldDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCksIC8vIERvZW5ldCBpcyBsb2FkZWQgc2VwYXJhdGVseVxufTtcblxuY29uc3QgbW9kdWxlX21hcF9jYWNoZSA9IHt9O1xuY29uc3QgUVVFVUVfRkxVU0hfVElNRV9NUyA9IDEwO1xuY29uc3QgcXVldWUgPSBbXTtcbmxldCBxdWV1ZUxhc3RGbHVzaCA9IDA7XG4vKipcbiAqIFF1ZXVlIGltcG9ydHMgdGhhdCBhcmUgcmVxdWVzdGVkIHdpdGhpbiBgUVVFVUVfRkxVU0hfVElNRV9NU2Agb2YgZWFjaCBvdGhlci5cbiAqIEFsbCBzdWNoIGltcG9ydHMgYXJlIGltcG9ydGVkIGF0IG9uY2UsIGFuZCB0aGVuIGEgcHJvbWlzZSBpcyBmaXJlZCBhZnRlciBhbGxcbiAqIHRoZSBpbXBvcnRzIGluIHRoZSBxdWV1ZSB3aW5kb3cgaGF2ZSBjb21wbGV0ZWQuXG4gKi9cbmZ1bmN0aW9uIHF1ZXVlSW1wb3J0KGNvbXBvbmVudF9uYW1lKSB7XG4gICAgbGV0IHJlc29sdmUgPSBudWxsO1xuICAgIGxldCByZWplY3QgPSBudWxsO1xuICAgIGNvbnN0IHJldFByb21pc2UgPSBuZXcgUHJvbWlzZSgociwgcmVqKSA9PiB7XG4gICAgICAgIHJlc29sdmUgPSByO1xuICAgICAgICByZWplY3QgPSByZWo7XG4gICAgfSk7XG4gICAgY29uc3QgaXRlbSA9IHsgY29tcG9uZW50X25hbWUsIHJlc29sdmUsIHJlamVjdCB9O1xuICAgIHF1ZXVlLnB1c2goaXRlbSk7XG4gICAgd2luZG93LnNldFRpbWVvdXQoZmx1c2hRdWV1ZSwgUVVFVUVfRkxVU0hfVElNRV9NUyArIDEpO1xuXG4gICAgcmV0dXJuIHJldFByb21pc2U7XG59XG5hc3luYyBmdW5jdGlvbiBmbHVzaFF1ZXVlKCkge1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoRGF0ZS5ub3coKSAtIHF1ZXVlTGFzdEZsdXNoIDwgUVVFVUVfRkxVU0hfVElNRV9NUykge1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmbHVzaFF1ZXVlLCBRVUVVRV9GTFVTSF9USU1FX01TICsgMSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gSWYgd2UgbWFkZSBpdCBoZXJlLCBpdCBoYXMgYmVlbiBhdCBsZWFzdCBRVUVVRV9GTFVTSF9USU1FX01TIHNpbmNlXG4gICAgLy8gdGhlIGxhc3QgdGltZSB3ZSBmbHVzaGVkIHRoZSBxdWV1ZS4gVGhlcmVmb3JlLCB3ZSBzaG91bGQgc3RhcnQgZmx1c2hpbmcuXG4gICAgLy8gV2UgY29weSBldmVyeXRoaW5nIHdlIGZsdXNoIGFuZCBlbXB0eSB0aGUgYXJyYXkgZmlyc3QuXG4gICAgcXVldWVMYXN0Rmx1c2ggPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHRvRmx1c2ggPSBbLi4ucXVldWVdO1xuICAgIHF1ZXVlLmxlbmd0aCA9IDA7XG4gICAgY29uc29sZS5sb2coXG4gICAgICAgIFwiV2VicGFjayBpcyBzdGFydGluZyB0aGUgbG9hZGluZyBwcm9jZXNzIGZvciB0aGUgZm9sbG93aW5nIFJ1bmVzdG9uZSBtb2R1bGVzXCIsXG4gICAgICAgIHRvRmx1c2gubWFwKChpdGVtKSA9PiBpdGVtLmNvbXBvbmVudF9uYW1lKVxuICAgICk7XG4gICAgY29uc3QgZmx1c2hlZFByb21pc2UgPSB0b0ZsdXNoLm1hcChhc3luYyAoaXRlbSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgbW9kdWxlX21hcFtpdGVtLmNvbXBvbmVudF9uYW1lXSgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgYFJ1bmVzdG9uZSBjb21wb25lbnQgJHtpdGVtLmNvbXBvbmVudF9uYW1lfSBoYXMgYmVlbiBsb2FkZWRgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGl0ZW0ucmVqZWN0KGUpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgZmx1c2hlZCA9IGF3YWl0IFByb21pc2UuYWxsKGZsdXNoZWRQcm9taXNlKTtcbiAgICB0cnkge1xuICAgICAgICBmbHVzaGVkLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG59XG5cbi8vIC4uIF9keW5hbWljIGltcG9ydCBtYWNoaW5lcnk6XG4vL1xuLy8gRHluYW1pYyBpbXBvcnQgbWFjaGluZXJ5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZ1bGZpbGwgYSBwcm9taXNlIHdoZW4gdGhlIFJ1bmVzdG9uZSBwcmUtbG9naW4gY29tcGxldGUgZXZlbnQgb2NjdXJzLlxubGV0IHByZV9sb2dpbl9jb21wbGV0ZV9wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+XG4gICAgJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6cHJlLWxvZ2luLWNvbXBsZXRlXCIsIHJlc29sdmUpXG4pO1xubGV0IGxvYWRlZENvbXBvbmVudHM7XG4vLyBQcm92aWRlIGEgc2ltcGxlIGZ1bmN0aW9uIHRvIGltcG9ydCB0aGUgSlMgZm9yIGFsbCBjb21wb25lbnRzIG9uIHRoZSBwYWdlLlxuZXhwb3J0IGZ1bmN0aW9uIHJ1bmVzdG9uZV9hdXRvX2ltcG9ydCgpIHtcbiAgICAvLyBDcmVhdGUgYSBzZXQgb2YgYGBkYXRhLWNvbXBvbmVudGBgIHZhbHVlcywgdG8gYXZvaWQgZHVwbGljYXRpb24uXG4gICAgY29uc3QgcyA9IG5ldyBTZXQoXG4gICAgICAgIC8vIEFsbCBSdW5lc3RvbmUgY29tcG9uZW50cyBoYXZlIGEgYGBkYXRhLWNvbXBvbmVudGBgIGF0dHJpYnV0ZS5cbiAgICAgICAgJChcIltkYXRhLWNvbXBvbmVudF1cIilcbiAgICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICAgICAgLy8gRXh0cmFjdCB0aGUgdmFsdWUgb2YgdGhlIGRhdGEtY29tcG9uZW50IGF0dHJpYnV0ZS5cbiAgICAgICAgICAgICAgICAoaW5kZXgsIGVsZW1lbnQpID0+ICQoZWxlbWVudCkuYXR0cihcImRhdGEtY29tcG9uZW50XCIpXG4gICAgICAgICAgICAgICAgLy8gU3dpdGNoIGZyb20gYSBqUXVlcnkgb2JqZWN0IGJhY2sgdG8gYW4gYXJyYXksIHBhc3NpbmcgdGhhdCB0byB0aGUgU2V0IGNvbnN0cnVjdG9yLlxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmdldCgpXG4gICAgKTtcbiAgICAvLyB3ZWJ3b3JrIHF1ZXN0aW9ucyBhcmUgbm90IHdyYXBwZWQgaW4gZGl2IHdpdGggYSBkYXRhLWNvbXBvbmVudCBzbyB3ZSBoYXZlIHRvIGNoZWNrIGEgZGlmZmVyZW50IHdheVxuICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndlYndvcmstYnV0dG9uXCIpKSB7XG4gICAgICAgIHMuYWRkKFwid2Vid29ya1wiKTtcbiAgICB9XG5cbiAgICAvLyBMb2FkIEpTIGZvciBlYWNoIG9mIHRoZSBjb21wb25lbnRzIGZvdW5kLlxuICAgIGNvbnN0IGEgPSBbLi4uc10ubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgICBsZXQgejtcbiAgICAgICAgY29uc29sZS5sb2coYExvYWRpbmcgUnVuZXN0b25lIGNvbXBvbmVudDogJHt2YWx1ZX1gKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHogPSAobW9kdWxlX21hcFt2YWx1ZV0gfHwgKCgpID0+IFByb21pc2UucmVzb2x2ZSgpKSkoKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgbG9hZGluZyAke3ZhbHVlfTpgLCBlKTtcbiAgICAgICAgfVxuICAgICAgICB6LmVycm9yID0gKG1zZykgPT4gY29uc29sZS5lcnJvcihgRXJyb3IgaW4gJHt2YWx1ZX06YCwgbXNnKTtcbiAgICAgICAgcmV0dXJuIHo7XG4gICAgfSk7XG5cbiAgICAvLyBTZW5kIHRoZSBSdW5lc3RvbmUgbG9naW4gY29tcGxldGUgZXZlbnQgd2hlbiBhbGwgSlMgaXMgbG9hZGVkIGFuZCB0aGUgcHJlLWxvZ2luIGlzIGFsc28gY29tcGxldGUuXG4gICAgUHJvbWlzZS5hbGwoW3ByZV9sb2dpbl9jb21wbGV0ZV9wcm9taXNlLCAuLi5hXSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5kYXRhc2V0LnJlYWN0SW5Vc2UpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5wcmVfbG9naW5fY29tcGxldGVfcHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcIlJ1bmVzdG9uZSBwcmUtbG9naW4gY29tcGxldGVcIik7XG59KTtcblxuLy8gTG9hZCBjb21wb25lbnQgSlMgd2hlbiB0aGUgZG9jdW1lbnQgaXMgcmVhZHkuXG4kKGRvY3VtZW50KS5yZWFkeShydW5lc3RvbmVfYXV0b19pbXBvcnQpO1xuXG4vLyBQcm92aWRlIGEgZnVuY3Rpb24gdG8gaW1wb3J0IG9uZSBzcGVjaWZpYyBgUnVuZXN0b25lYCBjb21wb25lbnQuXG4vLyB0aGUgaW1wb3J0IGZ1bmN0aW9uIGluc2lkZSBtb2R1bGVfbWFwIGlzIGFzeW5jIC0tIHJ1bmVzdG9uZV9pbXBvcnRcbi8vIHNob3VsZCBiZSBhd2FpdGVkIHdoZW4gbmVjZXNzYXJ5IHRvIGVuc3VyZSB0aGUgaW1wb3J0IGNvbXBsZXRlc1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJ1bmVzdG9uZV9pbXBvcnQoY29tcG9uZW50X25hbWUpIHtcbiAgICBpZiAobW9kdWxlX21hcF9jYWNoZVtjb21wb25lbnRfbmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIG1vZHVsZV9tYXBfY2FjaGVbY29tcG9uZW50X25hbWVdO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgYFJ1bmVzdG9uZSBjb21wb25lbnQgJHtjb21wb25lbnRfbmFtZX0gaXMgYmVpbmcgcXVldWVkIGZvciBpbXBvcnRgXG4gICAgKTtcbiAgICBjb25zdCBwcm9taXNlID0gcXVldWVJbXBvcnQoY29tcG9uZW50X25hbWUpO1xuICAgIG1vZHVsZV9tYXBfY2FjaGVbY29tcG9uZW50X25hbWVdID0gcHJvbWlzZTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcG9wdXBTY3JhdGNoQUMoKSB7XG4gICAgLy8gbG9hZCB0aGUgYWN0aXZlY29kZSBidW5kbGVcbiAgICBhd2FpdCBydW5lc3RvbmVfaW1wb3J0KFwiYWN0aXZlY29kZVwiKTtcbiAgICAvLyBzY3JhdGNoRGl2IHdpbGwgYmUgZGVmaW5lZCBpZiB3ZSBoYXZlIGFscmVhZHkgY3JlYXRlZCBhIHNjcmF0Y2hcbiAgICAvLyBhY3RpdmVjb2RlLiAgSWYgaXRzIG5vdCBkZWZpbmVkIHRoZW4gd2UgbmVlZCB0byBnZXQgaXQgcmVhZHkgdG8gdG9nZ2xlXG4gICAgaWYgKCFlQm9va0NvbmZpZy5zY3JhdGNoRGl2KSB7XG4gICAgICAgIHdpbmRvdy5BQ0ZhY3RvcnkuY3JlYXRlU2NyYXRjaEFjdGl2ZWNvZGUoKTtcbiAgICAgICAgbGV0IGRpdmlkID0gZUJvb2tDb25maWcuc2NyYXRjaERpdjtcbiAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtkaXZpZF0gPSBBQ0ZhY3RvcnkuY3JlYXRlQWN0aXZlQ29kZShcbiAgICAgICAgICAgICQoYCMke2RpdmlkfWApWzBdLFxuICAgICAgICAgICAgZUJvb2tDb25maWcuYWNEZWZhdWx0TGFuZ3VhZ2VcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZGl2aWRdLmVuYWJsZVNhdmVMb2FkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5BQ0ZhY3RvcnkudG9nZ2xlU2NyYXRjaEFjdGl2ZWNvZGUoKTtcbiAgICB9LCAxMDApO1xufVxuXG4vLyBTZXQgdGhlIGRpcmVjdG9yeSBjb250YWluaW5nIHRoaXMgc2NyaXB0IGFzIHRoZSBgcGF0aCA8aHR0cHM6Ly93ZWJwYWNrLmpzLm9yZy9ndWlkZXMvcHVibGljLXBhdGgvI29uLXRoZS1mbHk+YF8gZm9yIGFsbCB3ZWJwYWNrZWQgc2NyaXB0cy5cbmNvbnN0IHNjcmlwdF9zcmMgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyYztcbl9fd2VicGFja19wdWJsaWNfcGF0aF9fID0gc2NyaXB0X3NyYy5zdWJzdHJpbmcoXG4gICAgMCxcbiAgICBzY3JpcHRfc3JjLmxhc3RJbmRleE9mKFwiL1wiKSArIDFcbik7XG5cbnZhciBzcGxpY2UgPSBuZXcgU3BsaWNlV3JhcHBlcigpO1xuXG4vLyBNYW51YWwgZXhwb3J0c1xuLy8gPT09PT09PT09PT09PT1cbi8vIFdlYnBhY2sncyBgYG91dHB1dC5saWJyYXJ5YGAgc2V0dGluZyBkb2Vzbid0IHNlZW0gdG8gd29yayB3aXRoIHRoZSBzcGxpdCBjaHVua3MgcGx1Z2luOyBkbyBhbGwgZXhwb3J0cyBtYW51YWxseSB0aHJvdWdoIHRoZSBgYHdpbmRvd2BgIG9iamVjdCBpbnN0ZWFkLlxuXG5jb25zdCByYyA9IHt9O1xucmMucnVuZXN0b25lX2ltcG9ydCA9IHJ1bmVzdG9uZV9pbXBvcnQ7XG5yYy5ydW5lc3RvbmVfYXV0b19pbXBvcnQgPSBydW5lc3RvbmVfYXV0b19pbXBvcnQ7XG5yYy5nZXRTd2l0Y2ggPSBnZXRTd2l0Y2g7XG5yYy5zd2l0Y2hUaGVtZSA9IHN3aXRjaFRoZW1lO1xucmMucG9wdXBTY3JhdGNoQUMgPSBwb3B1cFNjcmF0Y2hBQztcbnJjLnJlbmRlck9uZUNvbXBvbmVudCA9IHJlbmRlck9uZUNvbXBvbmVudDtcbndpbmRvdy5jb21wb25lbnRNYXAgPSB7fTtcbndpbmRvdy5ydW5lc3RvbmVDb21wb25lbnRzID0gcmM7XG4iLCIvKipcbiAqXG4gKiBVc2VyOiBibWlsbGVyXG4gKiBPcmlnaW5hbDogMjAxMS0wNC0yMFxuICogRGF0ZTogMjAxOS0wNi0xNFxuICogVGltZTogMjowMSBQTVxuICogVGhpcyBjaGFuZ2UgbWFya3MgdGhlIGJlZ2lubmluZyBvZiB2ZXJzaW9uIDQuMCBvZiB0aGUgcnVuZXN0b25lIGNvbXBvbmVudHNcbiAqIExvZ2luL2xvZ291dCBpcyBubyBsb25nZXIgaGFuZGxlZCB0aHJvdWdoIGphdmFzY3JpcHQgYnV0IHJhdGhlciBzZXJ2ZXIgc2lkZS5cbiAqIE1hbnkgb2YgdGhlIGNvbXBvbmVudHMgZGVwZW5kIG9uIHRoZSBydW5lc3RvbmU6bG9naW4gZXZlbnQgc28gd2Ugd2lsbCBrZWVwIHRoYXRcbiAqIGZvciBub3cgdG8ga2VlcCB0aGUgY2h1cm4gZmFpcmx5IG1pbmltYWwuXG4gKi9cblxuLypcblxuIENvcHlyaWdodCAoQykgMjAxMSAgQnJhZCBNaWxsZXIgIGJvbmVsYWtlQGdtYWlsLmNvbVxuXG4gVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cblxuIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuXG4gKi9cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4vcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgbWFya2VkIH0gZnJvbSBcIm1hcmtlZFwiO1xuXG52YXIgcmIgPSBuZXcgUnVuZXN0b25lQmFzZSgpO1xuXG4vL1xuLy8gUGFnZSBkZWNvcmF0aW9uIGZ1bmN0aW9uc1xuLy9cbi8qXG5NYXliZSBzb21ldGhpbmcgbGlrZSB0aGlzIGF0IHRoZSB0b3A6XG5cbkFjdGl2ZSBhc3NpZ25tZW50OiBbQ2ggMTUgcmVhZGluZ10gICAgICBbRXhpdCBhc3NpZ25tZW50IGxpbmtdXG5PbiBwYWdlICgzIG9mIDcpIFtTZWxlY3QgaW5wdXQgc2hvd2luZyBjdXJyZW50IHBhZ2UsIGNhbiBzZWxlY3Qgb3RoZXJzXVxuQmVjb21pbmcgdGhpcyBpZiBub3Qgb24gYSBwYWdlIGluIGFzc2lnbm1lbnRcblxuQWN0aXZlIGFzc2lnbm1lbnQ6IFtDaCAxNSByZWFkaW5nXSAgICAgIFtFeGl0IGFzc2lnbm1lbnQgbGlua11cblRoaXMgcGFnZSBpcyBub3QgcGFydCBvZiB0aGF0IGFzc2lnbm1lbnQuIFNlbGVjdCBhIHBhZ2UgdG8gcmV0dXJuIHRvIGl0OlxuW1NlbGVjdCBpbnB1dF1cbiovXG5mdW5jdGlvbiBhZGRSZWFkaW5nTGlzdCgpIHtcbiAgICBsZXQgYXNzaWdubWVudF9pbmZvX3N0cmluZyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YClcblxuICAgIGlmIChhc3NpZ25tZW50X2luZm9fc3RyaW5nICYmIGVCb29rQ29uZmlnLnJlYWRpbmdzKSB7XG4gICAgICAgIHZhciB0b3AsIGJvdHRvbSwgYWN0aXZlLCBwYWdlX25hbWUsIGV4aXRfbGluaywgZnN0LCBzbmQsIG5ld19wb3MsIHBhdGhfcGFydHMsIG5ld19wb3NfbGluaztcbiAgICAgICAgdmFyIGFzc2lnbm1lbnRfaW5mbyA9IEpTT04ucGFyc2UoYXNzaWdubWVudF9pbmZvX3N0cmluZyk7XG4gICAgICAgIGxldCBhc3NpZ25tZW50X2lkID0gYXNzaWdubWVudF9pbmZvLmlkO1xuICAgICAgICBsZXQgYXNzaWdubWVudF9uYW1lID0gYXNzaWdubWVudF9pbmZvLm5hbWU7XG4gICAgICAgIGxldCByZWFkaW5nX25hbWVzID0gYXNzaWdubWVudF9pbmZvLnJlYWRpbmdOYW1lcztcblxuICAgICAgICBhY3RpdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBhY3RpdmUudGV4dENvbnRlbnQgPSBcIkFjdGl2ZSBhc3NpZ25tZW50OiBcIlxuXG4gICAgICAgIHBhZ2VfbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBwYWdlX25hbWUudGV4dENvbnRlbnQgPSBhc3NpZ25tZW50X25hbWU7XG4gICAgICAgIHBhZ2VfbmFtZS5ocmVmID0gYC9hc3NpZ25tZW50L3N0dWRlbnQvZG9Bc3NpZ25tZW50P2Fzc2lnbm1lbnRfaWQ9JHthc3NpZ25tZW50X2lkfWA7XG5cbiAgICAgICAgYWN0aXZlLmFwcGVuZChwYWdlX25hbWUpO1xuXG4gICAgICAgIGV4aXRfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBleGl0X2xpbmsudGV4dENvbnRlbnQgPSBcIiBFeGl0IEFzc2lnbm1lbnRcIjtcbiAgICAgICAgZXhpdF9saW5rLmhyZWYgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cbiAgICAgICAgZXhpdF9saW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vYWN0aXZlLmFwcGVuZChleGl0X2xpbmspXG5cbiAgICAgICAgbGV0IGN1cl9wYXRoX3BhcnRzID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgbGV0IG5hbWUgPVxuICAgICAgICAgICAgY3VyX3BhdGhfcGFydHNbY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMl0gK1xuICAgICAgICAgICAgXCIvXCIgK1xuICAgICAgICAgICAgY3VyX3BhdGhfcGFydHNbY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vIGlmIGJvZHkgaGFzIHByZXRleHQgY2xhc3MsIHRoZW4gc3RyaXAgdGhlIGxlYWRpbmcgcGF0aCBwYXJ0cyBmcm9tIGVhY2ggb2YgdGhlIHN0cmluZ3MgaW4gZUJvb2tDb25maWcucmVhZGluZ3NcbiAgICAgICAgbGV0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImJvZHlcIilbMF07XG4gICAgICAgIGxldCBwdHhib29rID0gZmFsc2U7XG4gICAgICAgIGxldCBlbmRMb3AgPSAyO1xuICAgICAgICBpZiAoYm9keS5jbGFzc0xpc3QuY29udGFpbnMoXCJwcmV0ZXh0XCIpKSB7XG4gICAgICAgICAgICBwdHhib29rID0gdHJ1ZTtcbiAgICAgICAgICAgIGVCb29rQ29uZmlnLnJlYWRpbmdzID0gZUJvb2tDb25maWcucmVhZGluZ3MubWFwKHIgPT4gci5zcGxpdChcIi9cIikucG9wKCkpO1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUuc3BsaXQoXCIvXCIpLnBvcCgpO1xuICAgICAgICAgICAgZW5kTG9wID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBwb3NpdGlvbiA9IGVCb29rQ29uZmlnLnJlYWRpbmdzLmluZGV4T2YobmFtZSk7XG4gICAgICAgIGxldCBudW1fcmVhZGluZ3MgPSBlQm9va0NvbmZpZy5yZWFkaW5ncy5sZW5ndGg7XG4gICAgICAgIC8vIGdldCBwcmV2IG5hbWVcbiAgICAgICAgaWYgKHBvc2l0aW9uID4gMCkge1xuICAgICAgICAgICAgbmV3X3BvcyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzW3Bvc2l0aW9uIC0gMV07XG4gICAgICAgICAgICBwYXRoX3BhcnRzID0gY3VyX3BhdGhfcGFydHMuc2xpY2UoMCwgY3VyX3BhdGhfcGFydHMubGVuZ3RoIC0gZW5kTG9wKTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMucHVzaChuZXdfcG9zKTtcbiAgICAgICAgICAgIG5ld19wb3NfbGluayA9IHBhdGhfcGFydHMuam9pbihcIi9cIik7XG4gICAgICAgICAgICBmc3QgPSBhY3RpdmUuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgbGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdHh0LnRleHRDb250ZW50ID0gYFBhZ2UgJHtwb3NpdGlvbiArIDF9IG9mICR7bnVtX3JlYWRpbmdzfSwgYDtcbiAgICAgICAgICAgIHZhciBmc3RfbG5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAvL2ZzdF9sbmsuY2xhc3NOYW1lID0gXCJidG4gYnRuLWxnIHJlYWRpbmctbmF2aWdhdGlvbiBwcmV2LXJlYWRpbmdcIjtcbiAgICAgICAgICAgIGZzdF9sbmsuaHJlZiA9IG5ld19wb3NfbGluaztcbiAgICAgICAgICAgIGZzdF9sbmsudGV4dENvbnRlbnQgPSBgQmFjayB0byBwYWdlICR7cG9zaXRpb25cbiAgICAgICAgICAgICAgICB9IG9mICR7bnVtX3JlYWRpbmdzfTogJHtyZWFkaW5nX25hbWVzW3Bvc2l0aW9uIC0gMV19LmA7XG4gICAgICAgICAgICB0eHQuYXBwZW5kKGZzdF9sbmspO1xuICAgICAgICAgICAgZnN0LmFwcGVuZCh0eHQpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAocG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgZnN0ID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IGBQYWdlIDEgb2YgJHtudW1fcmVhZGluZ3N9LmA7XG4gICAgICAgICAgICBmc3QuYXBwZW5kKHR4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyB0aGlzIGlzbid0IGEgcmVhZGluZyBwYWdlIGluIHRoZSBhc3NpZ25tZW50LCBjaGVjayB0byBzZWUgaWYgYW55XG4gICAgICAgICAgICAvLyBhY3Rpdml0aWVzIG9uIHRoaXMgcGFnZSBhcmUgYXNzaWduZWQgdG8gdGhlIGN1cnJlbnQgYXNzaWdubWVudFxuICAgICAgICAgICAgbGV0IGV4ZXJjaXNlT25QYWdlID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgcGFnZUV4ZXJjaXNlcyA9IE9iamVjdC5rZXlzKGNvbXBvbmVudE1hcCk7XG4gICAgICAgICAgICBpZiAocGFnZUV4ZXJjaXNlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHBhZ2VFeGVyY2lzZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICAgICAgICAgICAgICBwYWdlRXhlcmNpc2VzID0gQXJyYXkuZnJvbShwYWdlRXhlcmNpc2VzKS5tYXAoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsLmlkO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBleCBvZiBwYWdlRXhlcmNpc2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFzc2lnbm1lbnRfaW5mby5xdWVzdGlvbnMuaW5jbHVkZXMoZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4ZXJjaXNlT25QYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV3X3BvcyA9IGVCb29rQ29uZmlnLnJlYWRpbmdzWzBdO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cyA9IGN1cl9wYXRoX3BhcnRzLnNsaWNlKDAsIGN1cl9wYXRoX3BhcnRzLmxlbmd0aCAtIGVuZExvcCk7XG4gICAgICAgICAgICBwYXRoX3BhcnRzLnB1c2gobmV3X3Bvcyk7XG4gICAgICAgICAgICBuZXdfcG9zX2xpbmsgPSBwYXRoX3BhcnRzLmpvaW4oXCIvXCIpO1xuICAgICAgICAgICAgZnN0ID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIGlmIChleGVyY2lzZU9uUGFnZSkge1xuICAgICAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IFwiVGhpcyBwYWdlIGhhcyBhY3Rpdml0aWVzIGFzc2lnbmVkIHRvIHRoZSBjdXJyZW50IGFzc2lnbm1lbnQuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IFwiTm90aWNlOiB0aGlzIHBhZ2UgaXMgbm90IHBhcnQgb2YgdGhlIGFzc2lnbm1lbnQuXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0eHQuYXBwZW5kKGV4aXRfbGluayk7XG4gICAgICAgICAgICBmc3QuYXBwZW5kKHR4dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBvc2l0aW9uID09IGVCb29rQ29uZmlnLnJlYWRpbmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgIC8vIG5vIG1vcmUgcmVhZGluZ3NcbiAgICAgICAgICAgIHNuZCA9IGFjdGl2ZTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IGBQYWdlICR7bnVtX3JlYWRpbmdzfSBvZiAke251bV9yZWFkaW5nc306ICR7cmVhZGluZ19uYW1lc1twb3NpdGlvbl19YDtcbiAgICAgICAgICAgIHNuZC5hcHBlbmQodHh0KTtcbiAgICAgICAgfSBlbHNlIGlmIChwb3NpdGlvbiA+PSAwKSB7XG4gICAgICAgICAgICAvLyBnZXQgbmV4dCBuYW1lXG4gICAgICAgICAgICBuZXdfcG9zID0gZUJvb2tDb25maWcucmVhZGluZ3NbcG9zaXRpb24gKyAxXTtcbiAgICAgICAgICAgIHBhdGhfcGFydHMgPSBjdXJfcGF0aF9wYXJ0cy5zbGljZSgwLCBjdXJfcGF0aF9wYXJ0cy5sZW5ndGggLSBlbmRMb3ApO1xuICAgICAgICAgICAgcGF0aF9wYXJ0cy5wdXNoKG5ld19wb3MpO1xuICAgICAgICAgICAgbmV3X3Bvc19saW5rID0gcGF0aF9wYXJ0cy5qb2luKFwiL1wiKTtcbiAgICAgICAgICAgIHNuZCA9IGFjdGl2ZTtcbiAgICAgICAgICAgIHZhciBzbmRfbG5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgICAvL3NuZF9sbmsuY2xhc3NOYW1lID0gXCJidG4gYnRuLWxnIHJlYWRpbmctbmF2aWdhdGlvbiBuZXh0LXJlYWRpbmdcIjtcbiAgICAgICAgICAgIHNuZF9sbmsuaHJlZiA9IG5ld19wb3NfbGluaztcbiAgICAgICAgICAgIHNuZF9sbmsudGV4dENvbnRlbnQgPSBgQ29udGludWUgdG8gcGFnZSAke3Bvc2l0aW9uICsgMlxuICAgICAgICAgICAgICAgIH0gb2YgJHtudW1fcmVhZGluZ3N9OiAke3JlYWRpbmdfbmFtZXNbcG9zaXRpb24gKyAxXX1gO1xuICAgICAgICAgICAgbGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICAgICAgdHh0LmFwcGVuZChzbmRfbG5rKTtcbiAgICAgICAgICAgIHNuZC5hcHBlbmQodHh0KTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc25kID0gYWN0aXZlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCB0eHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgIHR4dC50ZXh0Q29udGVudCA9IFwiTm90aWNlOiB0aGlzIHBhZ2UgaXMgbm90IHBhcnQgb2YgdGhlIGFzc2lnbm1lbnQuIFRvIHJlbW92ZSB0aGlzIHdhcm5pbmcgY2xpY2sgXCI7XG4gICAgICAgICAgICBsZXQgZXhpdF9jbG9uZSA9IGV4aXRfbGluay5jbG9uZU5vZGUodHJ1ZSk7XG5cbiAgICAgICAgICAgIGV4aXRfY2xvbmUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGBjdXJyZW50QXNzaWdubWVudEluZm9fJHtlQm9va0NvbmZpZy5jb3Vyc2V9YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHR4dC5hcHBlbmQoZXhpdF9jbG9uZSk7XG4gICAgICAgICAgICBzbmQuYXBwZW5kKHR4dCk7XG5cblxuICAgICAgICB9XG5cbiAgICAgICAgdG9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdG9wLmNsYXNzTmFtZSA9IFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIlxuICAgICAgICBmc3QuY2xhc3NOYW1lID0gXCJydW5lc3RvbmUgYXNzaWdubWVudC1uYXYgdG9wLWFzc2lnbm1lbnQtbmF2XCJcbiAgICAgICAgLy90b3Auc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ2YXIoLS1jb21wb25lbnRCZ0NvbG9yKVwiXG4gICAgICAgIC8vdG9wLnN0eWxlLmJvcmRlckNvbG9yID0gXCJ2YXIoLS1jb21wb25lbnRCb3JkZXJDb2xvcilcIlxuICAgICAgICAvL3RvcC5zdHlsZS5ib3JkZXJXaWR0aCA9IFwiMXB4XCJcbiAgICAgICAgdG9wLmFwcGVuZChmc3QpO1xuICAgICAgICAvL3RvcC5hcHBlbmQoc25kKTtcblxuICAgICAgICBib3R0b20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBib3R0b20uY2xhc3NOYW1lID0gXCJwdHgtcnVuZXN0b25lLWNvbnRhaW5lclwiXG4gICAgICAgIHNuZC5jbGFzc05hbWUgPSBcInJ1bmVzdG9uZSBhc3NpZ25tZW50LW5hdiBib3R0b20tYXNzaWdubWVudC1uYXZcIlxuICAgICAgICAvL2JvdHRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInZhcigtLWNvbXBvbmVudEJnQ29sb3IpXCJcbiAgICAgICAgLy9ib3R0b20uc3R5bGUuYm9yZGVyQ29sb3IgPSBcInZhcigtLWNvbXBvbmVudEJvcmRlckNvbG9yKVwiXG4gICAgICAgIC8vYm90dG9tLnN0eWxlLmJvcmRlcldpZHRoID0gXCIxcHhcIlxuXG4gICAgICAgIC8vYm90dG9tLmFwcGVuZChhY3RpdmUuY2xvbmVOb2RlKHRydWUpKTtcbiAgICAgICAgLy9ib3R0b20uYXBwZW5kKGZzdC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgICAgICBib3R0b20uYXBwZW5kKHNuZCk7XG5cblxuICAgICAgICAvLyBjaGVjayB0aGUgYm9keSB0YWcgdG8gc2VlIGlmIGl0IGhhcyBhIHByZXRleHQgY2xhc3MgKG5vIGpxdWVyeSlcbiAgICAgICAgaWYgKHB0eGJvb2spIHtcbiAgICAgICAgICAgIC8vYXBwZW5kIHBhcnRzIHRvIHRoZSBoZWFkZXIgYW5kIHByb2dyZXNzIGNvbnRhaW5lclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB0eC1jb250ZW50XCIpO1xuICAgICAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50Lmluc2VydEJlZm9yZSh0b3AsIGNvbnRlbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcHJvZ3Jlc3Njb250YWluZXJcIik7XG4gICAgICAgICAgICBpZiAocGMpIHtcbiAgICAgICAgICAgICAgICBwYy5zdHlsZS5tYXJnaW5Cb3R0b20gPSBcIjIwcHhcIjtcbiAgICAgICAgICAgICAgICBwYy5hcHBlbmRDaGlsZChib3R0b20pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1haW5Db250ZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluLWNvbnRlbnRcIik7XG4gICAgICAgIGlmIChtYWluQ29udGVudCAmJiBzbmQpIHtcbiAgICAgICAgICAgIG1haW5Db250ZW50Lmluc2VydEJlZm9yZSh0b3AsIG1haW5Db250ZW50LmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICBtYWluQ29udGVudC5hcHBlbmRDaGlsZChib3R0b20pO1xuXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRpbWVkUmVmcmVzaCgpIHtcbiAgICB2YXIgdGltZW91dFBlcmlvZCA9IDkwMDAwMDsgLy8gNzUgbWludXRlc1xuICAgIGxldCBpZGxlVGltZW91dElkO1xuXG4gICAgZnVuY3Rpb24gb25JZGxlKCkge1xuICAgICAgICAvLyBBZnRlciB0aW1lb3V0IHBlcmlvZCBzZW5kIHRoZSB1c2VyIGJhY2sgdG8gdGhlIGluZGV4LiAgVGhpcyB3aWxsIGZvcmNlIGEgbG9naW5cbiAgICAgICAgLy8gaWYgbmVlZGVkIHdoZW4gdGhleSB3YW50IHRvIGdvIHRvIGEgcGFydGljdWxhciBwYWdlLiAgVGhpcyBtYXkgbm90IGJlIHBlcmZlY3RcbiAgICAgICAgLy8gYnV0IGl0cyBhbiBlYXN5IHdheSB0byBtYWtlIHN1cmUgbGFwdG9wIHVzZXJzIGFyZSBwcm9wZXJseSBsb2dnZWQgaW4gd2hlbiB0aGV5XG4gICAgICAgIC8vIHRha2UgcXVpenplcyBhbmQgc2F2ZSBzdHVmZi5cbiAgICAgICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5kZXhPZihcImluZGV4Lmh0bWxcIikgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIklkbGUgdGltZXIgLSBcIiArIGxvY2F0aW9uLnBhdGhuYW1lKTtcbiAgICAgICAgICAgIGxvY2F0aW9uLmhyZWYgPVxuICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLmFwcCArXG4gICAgICAgICAgICAgICAgXCIvZGVmYXVsdC91c2VyL2xvZ2luP19uZXh0PVwiICtcbiAgICAgICAgICAgICAgICBsb2NhdGlvbi5wYXRobmFtZSArXG4gICAgICAgICAgICAgICAgbG9jYXRpb24uc2VhcmNoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzZXRJZGxlVGltZXIoKSB7XG4gICAgICAgIGlmIChpZGxlVGltZW91dElkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWRsZVRpbWVvdXRJZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQob25JZGxlLCB0aW1lb3V0UGVyaW9kKTtcbiAgICB9XG5cbiAgICBbXCJtb3VzZW1vdmVcIiwgXCJrZXlkb3duXCIsIFwic2Nyb2xsXCIsIFwiY2xpY2tcIiwgXCJ0b3VjaHN0YXJ0XCIsIFwid2hlZWxcIl0uZm9yRWFjaChcbiAgICAgICAgKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCByZXNldElkbGVUaW1lciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9LFxuICAgICk7XG5cbiAgICByZXNldElkbGVUaW1lcigpO1xufVxuXG5jbGFzcyBQYWdlUHJvZ3Jlc3NCYXIge1xuICAgIGNvbnN0cnVjdG9yKGFjdERpY3QpIHtcbiAgICAgICAgdGhpcy5wb3NzaWJsZSA9IDA7XG4gICAgICAgIHRoaXMudG90YWwgPSAxO1xuICAgICAgICBpZiAoYWN0RGljdCAmJiBcImFzc2lnbm1lbnRfc3BlY1wiIGluIGFjdERpY3QpIHtcbiAgICAgICAgICAgIHRoaXMuYXNzaWdubWVudF9zcGVjID0gYWN0RGljdC5hc3NpZ25tZW50X3NwZWM7XG4gICAgICAgICAgICBkZWxldGUgYWN0RGljdC5hc3NpZ25tZW50X3NwZWM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFjdERpY3QgJiYgT2JqZWN0LmtleXMoYWN0RGljdCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5hY3Rpdml0aWVzID0gYWN0RGljdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBhY3Rpdml0aWVzID0geyBwYWdlOiAwIH07XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnJ1bmVzdG9uZVwiKS5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBhY3Rpdml0aWVzW2UuZmlyc3RFbGVtZW50Q2hpbGQuaWRdID0gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5hY3Rpdml0aWVzID0gYWN0aXZpdGllcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVByb2dyZXNzKCk7XG4gICAgICAgIC8vIEhpZGUgdGhlIHByb2dyZXNzIGJhciBvbiB0aGUgaW5kZXggcGFnZS5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLm1hdGNoKFxuICAgICAgICAgICAgICAgIC8uKlxcLyhpbmRleC5odG1sfHRvY3RyZWUuaHRtbHxFeGVyY2lzZXMuaHRtbHxzZWFyY2guaHRtbCkkL2ksXG4gICAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc2NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgICAgIFwic2Nwcm9ncmVzc2NvbnRhaW5lclwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChzY3Byb2dyZXNzY29udGFpbmVyKSBzY3Byb2dyZXNzY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbmRlclByb2dyZXNzKCk7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUHJvZ3Jlc3MoKSB7XG4gICAgICAgIGZvciAobGV0IGsgaW4gdGhpcy5hY3Rpdml0aWVzKSB7XG4gICAgICAgICAgICBpZiAoayAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wb3NzaWJsZSsrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2aXRpZXNba10gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG90YWwrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJQcm9ncmVzcygpIHtcbiAgICAgICAgbGV0IHZhbHVlID0gMDtcbiAgICAgICAgY29uc3Qgc2Nwcm9ncmVzc3RvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzdG90YWxcIik7XG4gICAgICAgIGlmIChzY3Byb2dyZXNzdG90YWwpIHNjcHJvZ3Jlc3N0b3RhbC50ZXh0Q29udGVudCA9IHRoaXMudG90YWw7XG4gICAgICAgIGNvbnN0IHNjcHJvZ3Jlc3Nwb3NzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzcG9zc1wiKTtcbiAgICAgICAgaWYgKHNjcHJvZ3Jlc3Nwb3NzKSBzY3Byb2dyZXNzcG9zcy50ZXh0Q29udGVudCA9IHRoaXMucG9zc2libGU7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YWx1ZSA9ICgxMDAgKiB0aGlzLnRvdGFsKSAvIHRoaXMucG9zc2libGU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXBsYWNlICNzdWJjaGFwdGVycHJvZ3Jlc3MgZGl2IHdpdGggYSBuYXRpdmUgPHByb2dyZXNzPiBlbGVtZW50IGlmIG5vdCBhbHJlYWR5IGRvbmVcbiAgICAgICAgbGV0IHN1YmNoYXB0ZXJwcm9ncmVzcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ViY2hhcHRlcnByb2dyZXNzXCIpO1xuICAgICAgICBpZiAoc3ViY2hhcHRlcnByb2dyZXNzICYmIHN1YmNoYXB0ZXJwcm9ncmVzcy50YWdOYW1lICE9PSBcIlBST0dSRVNTXCIpIHtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGRpdiB3aXRoIGEgPHByb2dyZXNzPiBlbGVtZW50XG4gICAgICAgICAgICBjb25zdCBwcm9ncmVzc0VsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJvZ3Jlc3NcIik7XG4gICAgICAgICAgICBwcm9ncmVzc0VsZW0uaWQgPSBcInN1YmNoYXB0ZXJwcm9ncmVzc1wiO1xuICAgICAgICAgICAgcHJvZ3Jlc3NFbGVtLm1heCA9IDEwMDtcbiAgICAgICAgICAgIHByb2dyZXNzRWxlbS52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgLy8gQ29weSBvdmVyIGFueSBjbGFzc2VzIGZyb20gdGhlIG9sZCBkaXZcbiAgICAgICAgICAgIHByb2dyZXNzRWxlbS5jbGFzc05hbWUgPSBzdWJjaGFwdGVycHJvZ3Jlc3MuY2xhc3NOYW1lO1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzLnJlcGxhY2VXaXRoKHByb2dyZXNzRWxlbSk7XG4gICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MgPSBwcm9ncmVzc0VsZW07XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViY2hhcHRlcnByb2dyZXNzKSB7XG4gICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MubWF4ID0gMTAwO1xuICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYXNzaWdubWVudF9zcGVjKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBoYXMgY29tcGxldGVkIGFsbCBhY3Rpdml0aWVzLCBzZW5kIHRoZSByZWFkaW5nIHNjb3JlLlxuICAgICAgICAgICAgLy8gVGhpcyBoYW5kbGVzIHRoZSBjYXNlIHdoZXJlIHRoZXJlIGFyZSBubyBhY3Rpdml0aWVzIG9uIHRoZSBwYWdlIG9yXG4gICAgICAgICAgICAvLyAgd2hlcmUgdGhlIHVzZXIgY29tcGxldGVkIGFjdGl2aXRpZXMgb24gdGhlIGFzc2lnbm1lbnQgcGFnZSBhbmQgbm93XG4gICAgICAgICAgICAvLyAgaXMgdmlld2luZyB0aGUgcmVhZGluZyBwYWdlLlxuICAgICAgICAgICAgbGV0IGNvbXBsZXRlQWN0aXZpdGllcyA9IHRoaXMudG90YWw7IC8vIHN1YnRyYWN0IDEgZm9yIHRoZSBwYWdlIHJlYWRpbmcgd2hpY2ggaXMgaW4gdG90YWwgYnV0IG5vdCBhbiBhY3Rpdml0eVxuICAgICAgICAgICAgbGV0IHJlcXVpcmVkQWN0aXZpdGllcyA9XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMuYWN0aXZpdGllc19yZXF1aXJlZCB8fCAxO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXNzaWdubWVudF9zcGVjLmFjdGl2aXRpZXNfcmVxdWlyZWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkID0gdGhpcy5wb3NzaWJsZTsgLy8gaWYgYWN0aXZpdGllc19yZXF1aXJlZCBpcyBudWxsLCB0aGVuIHRoZXJlIGFyZSBub25lIG9uIHRoZSBwYWdlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29tcGxldGVBY3Rpdml0aWVzID49IHJlcXVpcmVkQWN0aXZpdGllcykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZENvbXBsZXRlZFJlYWRpbmdTY29yZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlYWRpbmcgc2NvcmUgc2VudCBmb3IgcGFnZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gd2FpdCBhIHRpY2sgdGhlbiBtYXJrIHRoZSBwYWdlIGNvbXBsZXRlXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgaXMgbmVlZGVkIHRvIGxldCB0aGUgcHJvZ3Jlc3MgYmFyIHVwZGF0ZSBiZWZvcmUgbWFya2luZyBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLnRleHRDb250ZW50LnRvTG93ZXJDYXNlKCkgPT09IFwibWFyayBhcyBjb21wbGV0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgICAgIGNvbnN0IHN1YmNoYXB0ZXJEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1YmNoYXB0ZXJwcm9ncmVzc1wiKTtcbiAgICAgICAgICAgIGlmIChzdWJjaGFwdGVyRGl2KSBzdWJjaGFwdGVyRGl2LmNsYXNzTGlzdC5hZGQoXCJsb2dnZWRvdXRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVQcm9ncmVzcyhkaXZfaWQpIHtcbiAgICAgICAgdGhpcy5hY3Rpdml0aWVzW2Rpdl9pZF0rKztcbiAgICAgICAgLy8gT25seSB1cGRhdGUgdGhlIHByb2dyZXNzIGJhciBvbiB0aGUgZmlyc3QgaW50ZXJhY3Rpb24gd2l0aCBhbiBvYmplY3QuXG4gICAgICAgIGlmICh0aGlzLmFjdGl2aXRpZXNbZGl2X2lkXSA9PT0gMSkge1xuICAgICAgICAgICAgdGhpcy50b3RhbCsrO1xuICAgICAgICAgICAgbGV0IHZhbCA9ICgxMDAgKiB0aGlzLnRvdGFsKSAvIHRoaXMucG9zc2libGU7XG4gICAgICAgICAgICBjb25zdCBzY3Byb2dyZXNzdG90YWwyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzY3Byb2dyZXNzdG90YWxcIik7XG4gICAgICAgICAgICBpZiAoc2Nwcm9ncmVzc3RvdGFsMikgc2Nwcm9ncmVzc3RvdGFsMi50ZXh0Q29udGVudCA9IHRoaXMudG90YWw7XG4gICAgICAgICAgICBjb25zdCBzY3Byb2dyZXNzcG9zczIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjcHJvZ3Jlc3Nwb3NzXCIpO1xuICAgICAgICAgICAgaWYgKHNjcHJvZ3Jlc3Nwb3NzMikgc2Nwcm9ncmVzc3Bvc3MyLnRleHRDb250ZW50ID0gdGhpcy5wb3NzaWJsZTtcbiAgICAgICAgICAgIGxldCBzdWJjaGFwdGVycHJvZ3Jlc3MyID1cbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1YmNoYXB0ZXJwcm9ncmVzc1wiKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzdWJjaGFwdGVycHJvZ3Jlc3MyICYmXG4gICAgICAgICAgICAgICAgc3ViY2hhcHRlcnByb2dyZXNzMi50YWdOYW1lID09PSBcIlBST0dSRVNTXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHN1YmNoYXB0ZXJwcm9ncmVzczIudmFsdWUgPSB2YWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5hc3NpZ25tZW50X3NwZWMgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkICE9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbCA+PSB0aGlzLmFzc2lnbm1lbnRfc3BlYy5hY3Rpdml0aWVzX3JlcXVpcmVkXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVpcmVkIGFjdGl2aXRpZXMgY29tcGxldGVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VuZENvbXBsZXRlZFJlYWRpbmdTY29yZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlYWRpbmcgc2NvcmUgc2VudFwiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB2YWwgPT0gMTAwLjAgJiZcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21wbGV0aW9uQnV0dG9uXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgICAgY2IgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNiLnRleHRDb250ZW50ICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBjYi50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpID09PSBcIm1hcmsgYXMgY29tcGxldGVkXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KSgpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29tcGxldGlvbkJ1dHRvblwiKTtcbiAgICAgICAgICAgICAgICBpZiAoY2IgJiYgdHlwZW9mIGNiLmNsaWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBzZW5kQ29tcGxldGVkUmVhZGluZ1Njb3JlKCkge1xuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBkYXRhID0geyAuLi50aGlzLmFzc2lnbm1lbnRfc3BlYyB9O1xuICAgICAgICBsZXQgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFxuICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2xvZ2dlci91cGRhdGVfcmVhZGluZ19zY29yZWAsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgICAgICB9LFxuICAgICAgICApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYEZhaWxlZCB0byBzZW5kIHJlYWRpbmcgc2NvcmUhICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gLFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBzZW5kaW5nIHJlYWRpbmcgc2NvcmUgJHtlfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgdmFyIHBhZ2VQcm9ncmVzc1RyYWNrZXIgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGA7ICR7ZG9jdW1lbnQuY29va2llfWA7XG4gICAgY29uc3QgcGFydHMgPSB2YWx1ZS5zcGxpdChgOyAke25hbWV9PWApO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHJldHVybiBwYXJ0cy5wb3AoKS5zcGxpdChcIjtcIikuc2hpZnQoKTtcbn1cblxubGV0IHN0dWR5Q2x1ZXNDb252ZXJzYXRpb25JZCA9IC0xO1xuXG5mdW5jdGlvbiBhcHBlbmRTdHVkeUNsdWVzTWVzc2FnZShtZXNzYWdlc0VsLCByb2xlLCB0ZXh0LCBpc0h0bWwgPSBmYWxzZSkge1xuICAgIGNvbnN0IGJ1YmJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYnViYmxlLmNsYXNzTmFtZSA9IGBzdHVkeWNsdWVzLW1lc3NhZ2UgJHtyb2xlfWA7XG4gICAgaWYgKGlzSHRtbCkge1xuICAgICAgICBidWJibGUuaW5uZXJIVE1MID0gdGV4dDtcbiAgICB9IGVsc2Uge1xuICAgICAgICBidWJibGUudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgIH1cbiAgICBtZXNzYWdlc0VsLmFwcGVuZENoaWxkKGJ1YmJsZSk7XG4gICAgbWVzc2FnZXNFbC5zY3JvbGxUb3AgPSBtZXNzYWdlc0VsLnNjcm9sbEhlaWdodDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R1ZHlDbHVlc1dpZGdldCgpIHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkeWNsdWVzLWZhYlwiKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgc3R5bGUudGV4dENvbnRlbnQgPSBgXG4gICAgICAgICNzdHVkeWNsdWVzLWZhYiB7XG4gICAgICAgICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICAgICAgICByaWdodDogMjRweDtcbiAgICAgICAgICAgIGJvdHRvbTogMjRweDtcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTk7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4IDE4cHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMjRweCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gICAgICAgIH1cblxuICAgICAgICAjc3R1ZHljbHVlcy1jaGF0IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICAgICAgICAgIHJpZ2h0OiAyNHB4O1xuICAgICAgICAgICAgYm90dG9tOiA3OHB4O1xuICAgICAgICAgICAgei1pbmRleDogOTk5OTtcbiAgICAgICAgICAgIHdpZHRoOiBtaW4oNDIwcHgsIGNhbGMoMTAwdncgLSAzMnB4KSk7XG4gICAgICAgICAgICBoZWlnaHQ6IG1pbig1MjBweCwgY2FsYygxMDB2aCAtIDEyMHB4KSk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2QxZDVkYjtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDE0cHggMzZweCByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgI3N0dWR5Y2x1ZXMtY2hhdC5vcGVuIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1oZWFkZXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDEycHg7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjlmYWZiO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY2xvc2Uge1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGdhcDogNnB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIGNvbG9yOiAjNGI1NTYzO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXSB7XG4gICAgICAgICAgICBhcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAgICAgd2lkdGg6IDMycHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDE4cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZDFkNWRiO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzO1xuICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1jb2FjaC10b2dnbGUgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdOjphZnRlciB7XG4gICAgICAgICAgICBjb250ZW50OiBcIlwiO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgdG9wOiAycHg7XG4gICAgICAgICAgICBsZWZ0OiAycHg7XG4gICAgICAgICAgICB3aWR0aDogMTRweDtcbiAgICAgICAgICAgIGhlaWdodDogMTRweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycztcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWNvYWNoLXRvZ2dsZSBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl06Y2hlY2tlZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMjU2M2ViO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtY29hY2gtdG9nZ2xlIGlucHV0W3R5cGU9XCJjaGVja2JveFwiXTpjaGVja2VkOjphZnRlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTRweCk7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlcyB7XG4gICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIGdhcDogMTBweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmOGZhZmM7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlIHtcbiAgICAgICAgICAgIG1heC13aWR0aDogODUlO1xuICAgICAgICAgICAgcGFkZGluZzogMTBweCAxMnB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbiAgICAgICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtbWVzc2FnZS51c2VyIHtcbiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2RiZWFmZTtcbiAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICNiZmRiZmU7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1tZXNzYWdlLmFzc2lzdGFudCB7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IGF1dG87XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLW1lc3NhZ2Uuc3R1ZHljbHVlcy1sb2FkaW5nIHtcbiAgICAgICAgICAgIGNvbG9yOiAjNmI3MjgwO1xuICAgICAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtc3Bpbm5lciB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBnYXA6IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXItZG90IHtcbiAgICAgICAgICAgIHdpZHRoOiA2cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDZweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICM2YjcyODA7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjM1O1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBzdHVkeWNsdWVzLWRvdC1wdWxzZSAxcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLXNwaW5uZXItZG90Om50aC1jaGlsZCgyKSB7XG4gICAgICAgICAgICBhbmltYXRpb24tZGVsYXk6IDAuMTVzO1xuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtc3Bpbm5lci1kb3Q6bnRoLWNoaWxkKDMpIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbi1kZWxheTogMC4zcztcbiAgICAgICAgfVxuXG4gICAgICAgIEBrZXlmcmFtZXMgc3R1ZHljbHVlcy1kb3QtcHVsc2Uge1xuICAgICAgICAgICAgMCUsXG4gICAgICAgICAgICA4MCUsXG4gICAgICAgICAgICAxMDAlIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjM1O1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA0MCUge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLnN0dWR5Y2x1ZXMtaW5wdXRiYXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGdhcDogOHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZTVlN2ViO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zdHVkeWNsdWVzLWlucHV0YmFyIGlucHV0IHtcbiAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZDFkNWRiO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDEwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAuc3R1ZHljbHVlcy1pbnB1dGJhciBidXR0b24ge1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDEycHg7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMyNTYzZWI7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICB9XG4gICAgYDtcbiAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgYnV0dG9uLmlkID0gXCJzdHVkeWNsdWVzLWZhYlwiO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU3R1ZHlDbHVlcyBDaGF0XCI7XG5cbiAgICBjb25zdCBjaGF0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjaGF0LmlkID0gXCJzdHVkeWNsdWVzLWNoYXRcIjtcbiAgICBjaGF0LmlubmVySFRNTCA9IGBcbiAgICAgICAgPGRpdiBjbGFzcz1cInN0dWR5Y2x1ZXMtaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3Bhbj5TdHVkeUNsdWVzPC9zcGFuPlxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwic3R1ZHljbHVlcy1jb2FjaC10b2dnbGVcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCJzdHVkeWNsdWVzLWNvYWNoLW1vZGVcIiBjaGVja2VkIC8+XG4gICAgICAgICAgICAgICAgQ29hY2ggTW9kZVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJzdHVkeWNsdWVzLWNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlIGNoYXRcIj7inJU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdHVkeWNsdWVzLW1lc3NhZ2VzXCI+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdHVkeWNsdWVzLWlucHV0YmFyXCI+XG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkFzayBhIHF1ZXN0aW9uIGFib3V0IHRoaXMgY291cnNlLi4uXCIgLz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiPlNlbmQ8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgYDtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNoYXQpO1xuXG4gICAgY29uc3QgY2xvc2VCdG4gPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIuc3R1ZHljbHVlcy1jbG9zZVwiKTtcbiAgICBjb25zdCBtZXNzYWdlc0VsID0gY2hhdC5xdWVyeVNlbGVjdG9yKFwiLnN0dWR5Y2x1ZXMtbWVzc2FnZXNcIik7XG4gICAgY29uc3QgaW5wdXRFbCA9IGNoYXQucXVlcnlTZWxlY3RvcihcIi5zdHVkeWNsdWVzLWlucHV0YmFyIGlucHV0XCIpO1xuICAgIGNvbnN0IHNlbmRCdG4gPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIuc3R1ZHljbHVlcy1pbnB1dGJhciBidXR0b25cIik7XG4gICAgY29uc3QgY29hY2hUb2dnbGUgPSBjaGF0LnF1ZXJ5U2VsZWN0b3IoXCIjc3R1ZHljbHVlcy1jb2FjaC1tb2RlXCIpO1xuXG4gICAgbGV0IGNvYWNoTW9kZSA9IGNvYWNoVG9nZ2xlLmNoZWNrZWQ7XG4gICAgY29hY2hUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIGNvYWNoTW9kZSA9IGNvYWNoVG9nZ2xlLmNoZWNrZWQ7XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b2dnbGVDaGF0ID0gKCkgPT4ge1xuICAgICAgICBjaGF0LmNsYXNzTGlzdC50b2dnbGUoXCJvcGVuXCIpO1xuICAgICAgICBpZiAoY2hhdC5jbGFzc0xpc3QuY29udGFpbnMoXCJvcGVuXCIpKSB7XG4gICAgICAgICAgICBpbnB1dEVsLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgc2VuZE1lc3NhZ2UgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIGxldCBxdWVyeSA9IGlucHV0RWwudmFsdWUudHJpbSgpO1xuICAgICAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlY3Rpb25JbmZvID0gXCJcIjtcbiAgICAgICAgLy8gZmluZCB0aGUgc2VjdGlvbiB0aXRsZSBvbiB0aGUgcGFnZSB0byBpbmNsdWRlIGluIHRoZSBpbml0aWFsIHF1ZXJ5XG4gICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keS5wcmV0ZXh0XCIpKSB7XG4gICAgICAgICAgICBsZXQgc2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NlY3Rpb24uc2VjdGlvbicpO1xuICAgICAgICAgICAgbGV0IHNlY3Rpb25UaXRsZSA9IHNlY3Rpb24ucXVlcnlTZWxlY3Rvcignc3Bhbi50aXRsZScpLmlubmVyVGV4dDtcbiAgICAgICAgICAgIGxldCBzZWN0aW9uTnVtYmVyID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCdzcGFuLmNvZGVudW1iZXInKS5pbm5lclRleHQ7XG4gICAgICAgICAgICBzZWN0aW9uSW5mbyA9IGAke3NlY3Rpb25OdW1iZXJ9ICR7c2VjdGlvblRpdGxlfWA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgc2VjdGlvblNwYW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwic3Bhbi5zZWN0aW9uLW51bWJlclwiKTtcbiAgICAgICAgICAgIGlmIChzZWN0aW9uU3Bhbikge1xuICAgICAgICAgICAgICAgIHNlY3Rpb25JbmZvID0gc2VjdGlvblNwYW4ucGFyZW50RWxlbWVudC5pbm5lclRleHQudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdHVkeUNsdWVzQ29udmVyc2F0aW9uSWQgPT09IC0xKSB7XG4gICAgICAgICAgICBpZiAoc2VjdGlvbkluZm8pIHtcbiAgICAgICAgICAgICAgICBxdWVyeSA9IGBSZWdhcmRpbmcgc2VjdGlvbiBcIiR7c2VjdGlvbkluZm99XCI6ICR7cXVlcnl9YDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJzdHVkeWNsdWVzX3F1ZXJ5XCIsIGFjdDogYHF1ZXJ5OiAke3F1ZXJ5fWAsIGRpdl9pZDogYCR7c2VjdGlvbkluZm99YCB9KTtcbiAgICAgICAgYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UobWVzc2FnZXNFbCwgXCJ1c2VyXCIsIHF1ZXJ5KTsgLy8gdG9kbzogbWFrZSB0aGlzIGNvbmRpdGlvbmFsIG9uIGJlaW5nIGEgYm9vayBwYWdlIGFuZCBvbiB0aGUgYm9vayBiZWluZyBvbmUgb2YgdGhlIHN1cHBvcnRlZCBib29rc1xuICAgICAgICBpbnB1dEVsLnZhbHVlID0gXCJcIjtcbiAgICAgICAgc2VuZEJ0bi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICAgICAgY29uc3QgbG9hZGluZ0J1YmJsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGxvYWRpbmdCdWJibGUuY2xhc3NOYW1lID1cbiAgICAgICAgICAgIFwic3R1ZHljbHVlcy1tZXNzYWdlIGFzc2lzdGFudCBzdHVkeWNsdWVzLWxvYWRpbmdcIjtcbiAgICAgICAgbG9hZGluZ0J1YmJsZS5pbm5lckhUTUwgPVxuICAgICAgICAgICAgJ1RoaW5raW5nIDxzcGFuIGNsYXNzPVwic3R1ZHljbHVlcy1zcGlubmVyXCI+PHNwYW4gY2xhc3M9XCJzdHVkeWNsdWVzLXNwaW5uZXItZG90XCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwic3R1ZHljbHVlcy1zcGlubmVyLWRvdFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cInN0dWR5Y2x1ZXMtc3Bpbm5lci1kb3RcIj48L3NwYW4+PC9zcGFuPic7XG4gICAgICAgIG1lc3NhZ2VzRWwuYXBwZW5kQ2hpbGQobG9hZGluZ0J1YmJsZSk7XG4gICAgICAgIG1lc3NhZ2VzRWwuc2Nyb2xsVG9wID0gbWVzc2FnZXNFbC5zY3JvbGxIZWlnaHQ7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXG4gICAgICAgICAgICAgICAgYC9hc3NpZ25tZW50L3N0dWRlbnQvc3R1ZHljbHVlc19xdWVyeWAsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBBY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnNhdGlvbl9pZDogc3R1ZHlDbHVlc0NvbnZlcnNhdGlvbklkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29hY2hNb2RlLFxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVxdWVzdCBmYWlsZWQgd2l0aCBzdGF0dXMgJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBjb25zdCBkZXRhaWwgPSBwYXlsb2FkPy5kZXRhaWwgfHwge307XG4gICAgICAgICAgICBjb25zdCBzdHVkeWNsdWVzUmVzcG9uc2UgPSBkZXRhaWw/LnJlc3BvbnNlIHx8IHt9O1xuICAgICAgICAgICAgY29uc3QgbGxtUmVzcG9uc2UgPSBzdHVkeWNsdWVzUmVzcG9uc2U/LmxsbV9yZXNwb25zZTtcbiAgICAgICAgICAgIGNvbnN0IHJlZmVyZW5jZXMgPSBzdHVkeWNsdWVzUmVzcG9uc2U/LnJlZmVyZW5jZXMgfHwge307XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGV0YWlsLmNvbnZlcnNhdGlvbl9pZCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHN0dWR5Q2x1ZXNDb252ZXJzYXRpb25JZCA9IGRldGFpbC5jb252ZXJzYXRpb25faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG1hcmtkb3duUmVzcG9uc2UgPSAobGxtUmVzcG9uc2UgfHwgXCJObyByZXNwb25zZSBhdmFpbGFibGUgZnJvbSBTdHVkeUNsdWVzLlwiKS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgIC9cXFsoW15cXF1dKylcXF1cXCgoW14pXSspXFwpL2csXG4gICAgICAgICAgICAgICAgKG1hdGNoLCB0ZXh0LCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gcmVmZXJlbmNlc1trZXldPy5jb250ZW50X3VybDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVybCA/IGBbJHt0ZXh0fV0oJHt1cmx9KWAgOiBtYXRjaDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFJlc3BvbnNlID0gbWFya2VkLnBhcnNlKG1hcmtkb3duUmVzcG9uc2UpO1xuXG4gICAgICAgICAgICBhcHBlbmRTdHVkeUNsdWVzTWVzc2FnZShcbiAgICAgICAgICAgICAgICBtZXNzYWdlc0VsLFxuICAgICAgICAgICAgICAgIFwiYXNzaXN0YW50XCIsXG4gICAgICAgICAgICAgICAgZm9ybWF0dGVkUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgdHJ1ZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgYXBwZW5kU3R1ZHlDbHVlc01lc3NhZ2UoXG4gICAgICAgICAgICAgICAgbWVzc2FnZXNFbCxcbiAgICAgICAgICAgICAgICBcImFzc2lzdGFudFwiLFxuICAgICAgICAgICAgICAgIFwiU29ycnksIFN0dWR5Q2x1ZXMgaXMgdW5hdmFpbGFibGUgcmlnaHQgbm93LiBQbGVhc2UgdHJ5IGFnYWluLlwiLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJTdHVkeUNsdWVzIGNoYXQgZXJyb3I6XCIsIGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBsb2FkaW5nQnViYmxlLnJlbW92ZSgpO1xuICAgICAgICAgICAgc2VuZEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaW5wdXRFbC5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdG9nZ2xlQ2hhdCk7XG4gICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRvZ2dsZUNoYXQpO1xuICAgIHNlbmRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNlbmRNZXNzYWdlKTtcbiAgICBpbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChldnQpID0+IHtcbiAgICAgICAgaWYgKGV2dC5rZXkgPT09IFwiRW50ZXJcIikge1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzZW5kTWVzc2FnZSgpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFNob3dTdHVkeUNsdWVzV2lkZ2V0KCkge1xuICAgIGlmICghKGxvY2F0aW9uLnBhdGhuYW1lLmluY2x1ZGVzKFwiL25zL2Jvb2tzL1wiKSB8fCBsb2NhdGlvbi5wYXRobmFtZS5pbmNsdWRlcyhcImRvQXNzaWdubWVudFwiKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG4gICAgY29uc3QgZW5hYmxlZEJhc2Vjb3Vyc2VzID0gW1wiY3Nhd2Vzb21lMlwiLCBcInB5NGUtaW50XCIsIFwidGhpbmtjc3B5XCIsIFwiaHR0bGFjc1wiLCBcIlBUWFNCXCIsIFwiY3BwZHMyXCJdO1xuICAgIGNvbnN0IGVuYWJsZWRDb3Vyc2VzID0gW1wiU0kyMDEtVzI2LU1XXCIsIFwiU0kyMDEtVzI2LVRUaFwiLCBcIkR1a2VDUzEwMVNQMjZcIixcbiAgICAgICAgXCJtY2QtY3NhLXNjaG9vbG9neVwiLCBcIm1jZC1jc2EtY2FudmFzXCIsIFwiY3Nhd2Vzb21lMi1NT09DXCIsXG4gICAgICAgIFwidGVzdF9weTRlLWludF9hcGlcIiwgXCJiY19jcHBkc19zMjZcIiwgXCJUZXN0LXB5NGUtaW50XCIsXG4gICAgICAgIFwidmlyZ2luaWF0ZWNoX3B5NGUtaW50X3NwcmluZzI2XCIsIFwidW1zaTEwMV9mYWxsMjZcIlxuICAgIF07XG4gICAgY29uc3QgaG9zdCA9IHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZTtcblxuICAgIGlmIChob3N0ID09PSBcImxvY2FsaG9zdFwiKSB7XG4gICAgICAgIHJldHVybiBlbmFibGVkQmFzZWNvdXJzZXMuaW5jbHVkZXMoZUJvb2tDb25maWcuYmFzZWNvdXJzZSk7XG4gICAgfVxuXG4gICAgaWYgKGhvc3QgPT09IFwicnVuZXN0b25lLmFjYWRlbXlcIikge1xuICAgICAgICByZXR1cm4gZW5hYmxlZENvdXJzZXMuaW5jbHVkZXMoZUJvb2tDb25maWcuY291cnNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhhbmRsZVBhZ2VTZXR1cCgpIHtcbiAgICB2YXIgbWVzcztcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyh7XG4gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgICAgICAgIEFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIHRpbWV6b25lb2Zmc2V0OiBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCkgLyA2MCxcbiAgICAgICAgICAgIHRpbWV6b25lOiBJbnRsLkRhdGVUaW1lRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkudGltZVpvbmUsXG4gICAgICAgIH07XG4gICAgICAgIGxldCBSU19pbmZvID0gZ2V0Q29va2llKFwiUlNfaW5mb1wiKTtcbiAgICAgICAgdmFyIHR6X21hdGNoID0gZmFsc2U7XG4gICAgICAgIGlmIChSU19pbmZvKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBjbGVhbmVkID0gUlNfaW5mby5yZXBsYWNlKC9cXFxcMDU0L2csIFwiLFwiKTsgLy8gaGFuZGxlIG9jdGFsIGNvbW1hIGVuY29kaW5nXG4gICAgICAgICAgICAgICAgbGV0IGluZm8gPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChjbGVhbmVkKSk7XG4gICAgICAgICAgICAgICAgaW5mbyA9IEpTT04ucGFyc2UoZGVjb2RlVVJJQ29tcG9uZW50KGluZm8pKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGluZm8udGltZXpvbmUgPT09IGRhdGEudGltZXpvbmUgJiZcbiAgICAgICAgICAgICAgICAgICAgaW5mby50el9vZmZzZXQgPT09IGRhdGEudGltZXpvbmVvZmZzZXRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlRpbWV6b25lIGNvb2tpZSBtYXRjaGVzLCBub3Qgc2VuZGluZyB0aW1lem9uZSB0byBzZXJ2ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdHpfbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkVycm9yIHBhcnNpbmcgUlNfaW5mbyBjb29raWUsIHNlbmRpbmcgdGltZXpvbmUgdG8gc2VydmVyXCIsXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodHpfbWF0Y2ggPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBTZXQgYSBjb29raWUgc28gd2UgZG9uJ3QgaGF2ZSB0byBkbyB0aGlzIGFnYWluIGZvciBhIHdoaWxlLlxuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcbiAgICAgICAgICAgICAgICBgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vbG9nZ2VyL3NldF90el9vZmZzZXRgLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgRmFpbGVkIHRvIHNldCB0aW1lem9uZSEgJHtyZXNwb25zZS5zdGF0dXNUZXh0fWAsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3Igc2V0dGluZyB0aW1lem9uZSAke2V9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coYFRoaXMgcGFnZSBzZXJ2ZWQgYnkgJHtlQm9va0NvbmZpZy5zZXJ2ZWRfYnl9YCk7XG4gICAgaWYgKGVCb29rQ29uZmlnLmlzTG9nZ2VkSW4pIHtcbiAgICAgICAgbWVzcyA9IGB1c2VybmFtZTogJHtlQm9va0NvbmZpZy51c2VybmFtZX1gO1xuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLmlzSW5zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgY29uc3QgaXBEcm9wZG93biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaXBfZHJvcGRvd25fbGlua1wiKTtcbiAgICAgICAgICAgIGlmIChpcERyb3Bkb3duICYmIHR5cGVvZiBpcERyb3Bkb3duLnJlbW92ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgaXBEcm9wZG93bi5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGluc3RQZWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnN0X3BlZXJfbGlua1wiKTtcbiAgICAgICAgICAgIGlmIChpbnN0UGVlciAmJiB0eXBlb2YgaW5zdFBlZXIucmVtb3ZlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICBpbnN0UGVlci5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInJ1bmVzdG9uZTpsb2dpblwiKSk7XG4gICAgICAgIGFkZFJlYWRpbmdMaXN0KCk7XG4gICAgICAgIC8vIE9ubHkgc2hvdyB0aGUgU3R1ZHlDbHVlcyB3aWRnZXQgZm9yIGNlcnRhaW4gYmFzZSBjb3Vyc2VzIGFuZCB3aGVuIHRoZSBwYXRoIGluY2x1ZGVzIFwiL25zL2Jvb2tzL1wiLlxuICAgICAgICAvLyBUaGlzIGlzIGEgdGVtcG9yYXJ5IG1lYXN1cmUgdG8gbGltaXQgdGhlIHdpZGdldCB0byBjb3Vyc2VzIHRoYXQgYXJlIGtub3duIHRvIHdvcmsgd2VsbCB3aXRoIGl0IGFuZCB0byBhdm9pZCBzaG93aW5nIGl0IG9uIG5vbi1ib29rIHBhZ2VzIHdoZXJlIGl0IG1heSBub3QgYmUgYXMgdXNlZnVsLlxuICAgICAgICBpZiAoc2hvdWxkU2hvd1N0dWR5Q2x1ZXNXaWRnZXQoKSkge1xuICAgICAgICAgICAgY3JlYXRlU3R1ZHlDbHVlc1dpZGdldCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEF2b2lkIHRoZSB0aW1lZFJlZnJlc2ggb24gdGhlIGdyYWRpbmcgcGFnZS5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvYWRtaW4vZ3JhZGluZ1wiKSA9PSAtMSAmJlxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvcGVlci9cIikgPT0gLTFcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aW1lZFJlZnJlc2goKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lc3MgPSBcIk5vdCBsb2dnZWQgaW5cIjtcbiAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJydW5lc3RvbmU6bG9nb3V0XCIpKTtcbiAgICAgICAgbGV0IGJ3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJicm93c2luZ193YXJuaW5nXCIpO1xuICAgICAgICBpZiAoYncpIHtcbiAgICAgICAgICAgIGJ3LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPlNhdmluZyBhbmQgTG9nZ2luZyBhcmUgRGlzYWJsZWQ8L3A+XCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZF93YXJuaW5nXCIpO1xuICAgICAgICBpZiAoYXcpIHtcbiAgICAgICAgICAgIGF3LmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgXCI8cCBjbGFzcz0nbmF2YmFyX21lc3NhZ2UnPvCfmqsgTG9nLWluIHRvIFJlbW92ZSA8YSBocmVmPScvcnVuZXN0b25lL2RlZmF1bHQvYWRzJz5BZHMhPC9hPiDwn5qrICZuYnNwOzwvcD5cIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmxvZ2dlZGludXNlclwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBtZXNzO1xuICAgIH0pO1xuXG4gICAgcGFnZVByb2dyZXNzVHJhY2tlciA9IG5ldyBQYWdlUHJvZ3Jlc3NCYXIoZUJvb2tDb25maWcuYWN0aXZpdGllcyk7XG4gICAgbm90aWZ5UnVuZXN0b25lQ29tcG9uZW50cygpO1xufVxuXG5mdW5jdGlvbiBzZXR1cE5hdmJhckxvZ2dlZEluKCkge1xuICAgIGNvbnN0IHByb2ZpbGVMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9maWxlbGlua1wiKTtcbiAgICBpZiAocHJvZmlsZUxpbmspIHByb2ZpbGVMaW5rLnN0eWxlLnJlbW92ZVByb3BlcnR5KFwiZGlzcGxheVwiKTtcbiAgICBjb25zdCBwYXNzd29yZExpbmsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkbGlua1wiKTtcbiAgICBpZiAocGFzc3dvcmRMaW5rKSBwYXNzd29yZExpbmsuc3R5bGUucmVtb3ZlUHJvcGVydHkoXCJkaXNwbGF5XCIpO1xuICAgIGNvbnN0IHJlZ2lzdGVyTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVnaXN0ZXJsaW5rXCIpO1xuICAgIGlmIChyZWdpc3RlckxpbmspIHJlZ2lzdGVyTGluay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImxpLmxvZ2lub3V0XCIpLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgIGVsLmlubmVySFRNTCA9XG4gICAgICAgICAgICAnPGEgaHJlZj1cIi9hZG1pbi9hdXRoL2xvZ291dFwiPkxvZyBPdXQ8L2E+JztcbiAgICB9KTtcbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW5cIiwgc2V0dXBOYXZiYXJMb2dnZWRJbik7XG5cbmZ1bmN0aW9uIHNldHVwTmF2YmFyTG9nZ2VkT3V0KCkge1xuICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNldHVwIG5hdmJhciBmb3IgbG9nZ2VkIG91dFwiKTtcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyZWdpc3RlcmxpbmtcIik7XG4gICAgICAgIGlmIChyZWdpc3RlckxpbmspIHJlZ2lzdGVyTGluay5zdHlsZS5yZW1vdmVQcm9wZXJ0eShcImRpc3BsYXlcIik7XG4gICAgICAgIGNvbnN0IHByb2ZpbGVMaW5rID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9maWxlbGlua1wiKTtcbiAgICAgICAgaWYgKHByb2ZpbGVMaW5rKSBwcm9maWxlTGluay5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkTGluayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFzc3dvcmRsaW5rXCIpO1xuICAgICAgICBpZiAocGFzc3dvcmRMaW5rKSBwYXNzd29yZExpbmsuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjb25zdCBpcERyb3Bkb3duID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpcF9kcm9wZG93bl9saW5rXCIpO1xuICAgICAgICBpZiAoaXBEcm9wZG93bikgaXBEcm9wZG93bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNvbnN0IGluc3RQZWVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnN0X3BlZXJfbGlua1wiKTtcbiAgICAgICAgaWYgKGluc3RQZWVyKSBpbnN0UGVlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaS5sb2dpbm91dFwiKS5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgICAgICAgZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICAnPGEgaHJlZj1cIicgK1xuICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLmFwcCArXG4gICAgICAgICAgICAgICAgJy9kZWZhdWx0L3VzZXIvbG9naW5cIj5Mb2dpbjwvYT4nO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mb290ZXJcIikuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLmlubmVySFRNTCA9IFwidXNlciBub3QgbG9nZ2VkIGluXCI7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9nb3V0XCIsIHNldHVwTmF2YmFyTG9nZ2VkT3V0KTtcblxuZnVuY3Rpb24gbm90aWZ5UnVuZXN0b25lQ29tcG9uZW50cygpIHtcbiAgICAvLyBSdW5lc3RvbmUgY29tcG9uZW50cyB3YWl0IHVudGlsIGxvZ2luIHByb2Nlc3MgaXMgb3ZlciB0byBsb2FkIGNvbXBvbmVudHMgYmVjYXVzZSBvZiBzdG9yYWdlIGlzc3Vlcy4gVGhpcyB0cmlnZ2VycyB0aGUgYGR5bmFtaWMgaW1wb3J0IG1hY2hpbmVyeWAsIHdoaWNoIHRoZW4gc2VuZHMgdGhlIGxvZ2luIGNvbXBsZXRlIHNpZ25hbCB3aGVuIHRoaXMgYW5kIGFsbCBkeW5hbWljIGltcG9ydHMgYXJlIGZpbmlzaGVkLlxuICAgIGNvbnNvbGUubG9nKFwidHJpZ2dlcmluZyBydW5lc3RvbmU6cHJlLWxvZ2luLWNvbXBsZXRlXCIpO1xuICAgIGRvY3VtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicnVuZXN0b25lOnByZS1sb2dpbi1jb21wbGV0ZVwiKSk7XG59XG5cbmZ1bmN0aW9uIHBsYWNlQWRDb3B5KCkge1xuICAgIGlmICh0eXBlb2Ygc2hvd0FkICE9PSBcInVuZGVmaW5lZFwiICYmIHNob3dBZCkge1xuICAgICAgICBsZXQgYWROdW0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKSArIDE7XG4gICAgICAgIGxldCBhZEJsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYGFkY29weV8ke2FkTnVtfWApO1xuICAgICAgICBsZXQgcnNFbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucnVuZXN0b25lXCIpO1xuICAgICAgICBpZiAocnNFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBsZXQgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByc0VsZW1lbnRzLmxlbmd0aCk7XG4gICAgICAgICAgICByc0VsZW1lbnRzW3JhbmRvbUluZGV4XS5hZnRlcihhZEJsb2NrKTtcbiAgICAgICAgICAgIGFkQmxvY2suc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gaW5pdGlhbGl6ZSBzdHVmZlxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgaWYgKGVCb29rQ29uZmlnKSB7XG4gICAgICAgIGhhbmRsZVBhZ2VTZXR1cCgpO1xuICAgICAgICBwbGFjZUFkQ29weSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgZUJvb2tDb25maWcgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgIFwiZUJvb2tDb25maWcgaXMgbm90IGRlZmluZWQuICBUaGlzIHBhZ2UgbXVzdCBub3QgYmUgc2V0IHVwIGZvciBSdW5lc3RvbmVcIixcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuLy8gbWlzYyBzdHVmZlxuLy8gdG9kbzogIFRoaXMgY291bGQgYmUgZnVydGhlciBkaXN0cmlidXRlZCBidXQgbWFraW5nIGEgdmlkZW8uanMgZmlsZSBqdXN0IGZvciBvbmUgZnVuY3Rpb24gc2VlbXMgZHVtYi5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAvLyBhZGQgdGhlIHZpZGVvIHBsYXkgYnV0dG9uIG92ZXJsYXkgaW1hZ2VcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnZpZGVvLXBsYXktb3ZlcmxheVwiKS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9XG4gICAgICAgICAgICBcInVybCgne3twYXRodG8oJ19zdGF0aWMvcGxheV9vdmVybGF5X2ljb24ucG5nJywgMSl9fScpXCI7XG4gICAgfSk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIG5lZWRlZCB0byBhbGxvdyB0aGUgZHJvcGRvd24gc2VhcmNoIGJhciB0byB3b3JrO1xuICAgIC8vIFRoZSBkZWZhdWx0IGJlaGF2aW91ciBpcyB0aGF0IHRoZSBkcm9wZG93biBtZW51IGNsb3NlcyB3aGVuIHNvbWV0aGluZyBpblxuICAgIC8vIGl0IChsaWtlIHRoZSBzZWFyY2ggYmFyKSBpcyBjbGlja2VkXG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJvcGRvd24gaW5wdXQsIC5kcm9wZG93biBsYWJlbFwiKVxuICAgICAgICAuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgLy8gcmUtd3JpdGUgc29tZSB1cmxzXG4gICAgLy8gVGhpcyBpcyB0cmlja2VyIHRoYW4gaXQgbG9va3MgYW5kIHlvdSBoYXZlIHRvIG9iZXkgdGhlIHJ1bGVzIGZvciAjIGFuY2hvcnNcbiAgICAvLyBUaGUgI2FuY2hvcnMgbXVzdCBjb21lIGFmdGVyIHRoZSBxdWVyeSBzdHJpbmcgYXMgdGhlIHNlcnZlciBiYXNpY2FsbHkgaWdub3JlcyBhbnkgcGFydFxuICAgIC8vIG9mIGEgdXJsIHRoYXQgY29tZXMgYWZ0ZXIgIyAtIGxpa2UgYSBjb21tZW50Li4uXG4gICAgaWYgKGxvY2F0aW9uLmhyZWYuaW5jbHVkZXMoXCJtb2RlPWJyb3dzaW5nXCIpKSB7XG4gICAgICAgIGxldCBxdWVyeVN0cmluZyA9IFwiP21vZGU9YnJvd3NpbmdcIjtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImFcIikuZm9yRWFjaCgobGluaykgPT4ge1xuICAgICAgICAgICAgbGV0IGFuY2hvclRleHQgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGxpbmsuaHJlZi5pbmNsdWRlcyhcImJvb2tzL3B1Ymxpc2hlZFwiKSAmJlxuICAgICAgICAgICAgICAgICFsaW5rLmhyZWYuaW5jbHVkZXMoXCI/bW9kZT1icm93c2luZ1wiKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmsuaHJlZi5pbmNsdWRlcyhcIiNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFQb2ludCA9IGxpbmsuaHJlZi5pbmRleE9mKFwiI1wiKTtcbiAgICAgICAgICAgICAgICAgICAgYW5jaG9yVGV4dCA9IGxpbmsuaHJlZi5zdWJzdHJpbmcoYVBvaW50KTtcbiAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmID0gbGluay5ocmVmLnN1YnN0cmluZygwLCBhUG9pbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsaW5rLmhyZWYgPSBsaW5rLmhyZWYuaW5jbHVkZXMoXCI/XCIpID9cbiAgICAgICAgICAgICAgICAgICAgbGluay5ocmVmICsgcXVlcnlTdHJpbmcucmVwbGFjZShcIj9cIiwgXCImXCIpICsgYW5jaG9yVGV4dCA6XG4gICAgICAgICAgICAgICAgICAgIGxpbmsuaHJlZiArIHF1ZXJ5U3RyaW5nICsgYW5jaG9yVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG5cbi8vIFRoZSBCdXN0IE1lbnVcbi8qXG5Db3Vyc2UgSG9tZVxuQXNzaWdubWVudHNcblByb2dyZXNzXG5QZWVyIEluc3RydWN0aW9uIChTdHVkZW50KVxuLS0tLS0tXG5JbnN0cnVjdG9yIERhc2hib2FyZFxuUGVlciBJbnN0cnVjdGlvbiAoSW5zdHJ1Y3RvcilcbkF1dGhvciBJbnRlcmZhY2UgKG9wdGlvbmFsKVxuRWRpdG9yIEludGVyZmFjZSAob3B0aW9uYWwpXG5SZXF1ZXN0IEludm9pY2Vcbi0tLS0tLVxuQ2hhbmdlIENvdXJzZVxuUHJvZmlsZVxuTG9nIE91dFxuKi9cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgY29uc3Qgb2xkRHJvcERvd24gPSB0aGlzLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZHJvcGRvd24tY29udGVudFtkYXRhLWRlcHJlY2F0ZWRdXCIpO1xuICAgIGlmIChvbGREcm9wRG93bilcbiAgICAgICAgb2xkRHJvcERvd24ucmVtb3ZlKCk7XG5cbiAgICBjb25zdCBpdGVtVGVtcGxhdGUgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHR4LXVzZXItZHJvcGRvd24tY29udGVudF9pdGVtLXRlbXBsYXRlXCIpO1xuICAgIGNvbnN0IHNlcFRlbXBsYXRlID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInB0eC11c2VyLWRyb3Bkb3duLWNvbnRlbnRfc2VwYXJhdG9yLXRlbXBsYXRlXCIpO1xuICAgIGNvbnN0IG1lbnVDb250ZW50QXJlYSA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwdHgtdXNlci1kcm9wZG93bl9ycy1jb250ZW50XCIpO1xuXG4gICAgaWYgKCFpdGVtVGVtcGxhdGUgfHwgIXNlcFRlbXBsYXRlIHx8ICFtZW51Q29udGVudEFyZWEpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIk1pc3NpbmcgcmVxdWlyZWQgdGVtcGxhdGUgb3IgY29udGVudCBhcmVhIGZvciB1c2VyIGRyb3Bkb3duXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxpbmsodXJsLCB0aXRsZSwgYXJpYUxhYmVsID0gbnVsbCkge1xuICAgICAgICAvLyBBbGwgd2Ugc2hvdWxkIGFzc3VtZSBhYm91dCB0aGUgaXRlbSB0ZW1wbGF0ZSBpcyB0aGF0IGl0IGhhcyBhbiBhbmNob3IgZWxlbWVudFxuICAgICAgICBjb25zdCBsaW5rID0gaXRlbVRlbXBsYXRlLmNvbnRlbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBjb25zdCBsaW5rQW5jaG9yID0gbGluay5xdWVyeVNlbGVjdG9yKFwiYVwiKTtcbiAgICAgICAgbGlua0FuY2hvci5ocmVmID0gdXJsO1xuICAgICAgICBsaW5rQW5jaG9yLmlubmVyVGV4dCA9IHRpdGxlO1xuICAgICAgICBpZiAoYXJpYUxhYmVsKSB7XG4gICAgICAgICAgICBsaW5rQW5jaG9yLmFyaWFMYWJlbCA9IGFyaWFMYWJlbDtcbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm4gZW50aXJlIGl0ZW0gdGVtcGxhdGUsIG5vdCBqdXN0IGxpbmtcbiAgICAgICAgcmV0dXJuIGxpbms7XG4gICAgfVxuXG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL25zL2NvdXJzZS9pbmRleFwiLCBcIkNvdXJzZSBIb21lXCIpKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvcnVuZXN0b25lL2Fzc2lnbm1lbnRzL2Nob29zZUFzc2lnbm1lbnRcIiwgXCJBc3NpZ25tZW50c1wiKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL2Fzc2lnbm1lbnQvcGVlci9zdHVkZW50XCIsIFwiUGVlciBJbnN0cnVjdGlvbiAoU3R1ZGVudClcIikpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hc3NpZ25tZW50L3N0dWRlbnQvc3R1ZGVudHJlcG9ydFwiLCBcIlByb2dyZXNzXCIpKTtcbiAgICBpZiAoZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChzZXBUZW1wbGF0ZS5jb250ZW50LmNsb25lTm9kZSh0cnVlKSk7XG4gICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hZG1pbi9pbnN0cnVjdG9yL21lbnVcIiwgXCJJbnN0cnVjdG9yIERhc2hib2FyZFwiKSk7XG4gICAgICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hc3NpZ25tZW50L3BlZXIvaW5zdHJ1Y3RvclwiLFxuICAgICAgICAgICAgXCJQZWVyIEluc3RydWN0aW9uIChJbnN0cnVjdG9yKVwiKSk7XG4gICAgICAgIGlmIChlQm9va0NvbmZpZy5pc0F1dGhvcikge1xuICAgICAgICAgICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiaHR0cHM6Ly9hdXRob3IucnVuZXN0b25lLmFjYWRlbXkvYXV0aG9yL1wiLFxuICAgICAgICAgICAgICAgIFwiQXV0aG9yIERhc2hib2FyZFwiKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmlzRWRpdG9yKSB7XG4gICAgICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCJodHRwczovL2F1dGhvci5ydW5lc3RvbmUuYWNhZGVteS9hdXRob3IvXCIsXG4gICAgICAgICAgICAgICAgXCJFZGl0b3IgRGFzaGJvYXJkXCIpKTtcbiAgICAgICAgfVxuICAgICAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYXNzaWdubWVudC9pbnN0cnVjdG9yL2ludm9pY2VfcmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJSZXF1ZXN0IEludm9pY2VcIikpO1xuICAgIH1cbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQoc2VwVGVtcGxhdGUuY29udGVudC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIG1lbnVDb250ZW50QXJlYS5hcHBlbmRDaGlsZChtYWtlTGluayhcIi9hZG1pbi9hdXRoL215X2NvdXJzZXNcIiwgXCJDaGFuZ2UgQ291cnNlXCIpKTtcbiAgICBtZW51Q29udGVudEFyZWEuYXBwZW5kQ2hpbGQobWFrZUxpbmsoXCIvYWRtaW4vYXV0aC9wcm9maWxlXCIsIFwiUHJvZmlsZVwiKSk7XG4gICAgbWVudUNvbnRlbnRBcmVhLmFwcGVuZENoaWxkKG1ha2VMaW5rKFwiL2FkbWluL2F1dGgvbG9nb3V0XCIsIFwiTG9nIE91dFwiKSk7XG59KTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHN0cmluZyBhcHBlYXJzIHRvIGNvbnRhaW4gTGFUZVggbWF0aC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvb2tzTGlrZUxhdGV4TWF0aCh0ZXh0KSB7XG4gICAgaWYgKHR5cGVvZiB0ZXh0ICE9PSBcInN0cmluZ1wiKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBDb21tb24gTGFUZVggbWF0aCBkZWxpbWl0ZXJzXG4gICAgY29uc3QgbWF0aERlbGltaXRlcnMgPSBbXG4gICAgICAgIC9cXCRcXCRbXFxzXFxTXSs/XFwkXFwkLywgLy8gJCQgLi4uICQkXG4gICAgICAgIC9cXCRbXiRcXG5dKz9cXCQvLCAvLyAkIC4uLiAkXG4gICAgICAgIC9cXFxcXFxbW1xcc1xcU10rP1xcXFxcXF0vLCAvLyBcXFsgLi4uIFxcXVxuICAgICAgICAvXFxcXFxcKFtcXHNcXFNdKz9cXFxcXFwpLywgLy8gXFwoIC4uLiBcXClcbiAgICBdO1xuXG4gICAgLy8gQ29tbW9uIG1hdGggY29tbWFuZHMgKGF2b2lkIGdlbmVyaWMgXFx0ZXh0IG9yIFxccmVmLW9ubHkgY2FzZXMpXG4gICAgY29uc3QgbWF0aENvbW1hbmRzID1cbiAgICAgICAgL1xcXFwoZnJhY3xzcXJ0fHN1bXxwcm9kfGludHxsaW18c2lufGNvc3x0YW58bG9nfGxufGFscGhhfGJldGF8Z2FtbWF8cGl8dGhldGF8c2lnbWF8RGVsdGF8Y2RvdHx0aW1lc3xsZXF8Z2VxfG5lcSlcXGIvO1xuXG4gICAgLy8gU3VwZXJzY3JpcHRzL3N1YnNjcmlwdHMgbGlrZSB4XjIgb3IgYV9pXG4gICAgY29uc3Qgc3VwZXJTdWJTY3JpcHQgPSAvW2EtekEtWjAtOV1cXHMqW1xcXl9dXFxzKlxcez8uKz9cXH0/LztcblxuICAgIHJldHVybiAoXG4gICAgICAgIG1hdGhEZWxpbWl0ZXJzLnNvbWUoKHJlKSA9PiByZS50ZXN0KHRleHQpKSB8fFxuICAgICAgICBtYXRoQ29tbWFuZHMudGVzdCh0ZXh0KSB8fFxuICAgICAgICBzdXBlclN1YlNjcmlwdC50ZXN0KHRleHQpXG4gICAgKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBnZXRTd2l0Y2goKSB7XG4gICAgY29uc3QgdG9nZ2xlU3dpdGNoID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZW1lLXN3aXRjaCBpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGhlbWUnKSA/IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0aGVtZScpIDogbnVsbDtcblxuICAgIGlmIChjdXJyZW50VGhlbWUpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsIGN1cnJlbnRUaGVtZSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRUaGVtZSA9PT0gJ2RhcmsnKSB7XG4gICAgICAgICAgICB0b2dnbGVTd2l0Y2guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hUaGVtZSgpIHtcblxuXHR2YXIgY2hlY2tCb3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNoZWNrYm94XCIpO1xuICAgIGlmIChjaGVja0JveC5jaGVja2VkID09IHRydWUpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsICdkYXJrJyk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aGVtZScsICdkYXJrJyk7IC8vYWRkIHRoaXNcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCAnbGlnaHQnKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3RoZW1lJywgJ2xpZ2h0Jyk7IC8vYWRkIHRoaXNcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBydW5lc3RvbmVfaW1wb3J0IH0gZnJvbSBcIi4uLy4uLy4uL3dlYnBhY2suaW5kZXguanNcIjtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlclJ1bmVzdG9uZUNvbXBvbmVudChcbiAgICBjb21wb25lbnRTcmMsXG4gICAgd2hlcmVEaXYsXG4gICAgbW9yZU9wdHNcbikge1xuICAgIC8qKlxuICAgICAqICBUaGUgZWFzeSBwYXJ0IGlzIGFkZGluZyB0aGUgY29tcG9uZW50U3JjIHRvIHRoZSBleGlzdGluZyBkaXYuXG4gICAgICogIFRoZSB0ZWRpb3VzIHBhcnQgaXMgY2FsbGluZyB0aGUgcmlnaHQgZnVuY3Rpb25zIHRvIHR1cm4gdGhlXG4gICAgICogIHNvdXJjZSBpbnRvIHRoZSBhY3R1YWwgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGlmICghY29tcG9uZW50U3JjKSB7XG4gICAgICAgIGpRdWVyeShgIyR7d2hlcmVEaXZ9YCkuaHRtbChcbiAgICAgICAgICAgIGA8cD5Tb3JyeSwgbm8gc291cmNlIGlzIGF2YWlsYWJsZSBmb3IgcHJldmlldy48L3A+YFxuICAgICAgICApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBwYXR0ID0gLy4uXFwvX2ltYWdlcy9nO1xuICAgIGNvbXBvbmVudFNyYyA9IGNvbXBvbmVudFNyYy5yZXBsYWNlKFxuICAgICAgICBwYXR0LFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5hcHB9L2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9L19pbWFnZXNgXG4gICAgKTtcbiAgICBqUXVlcnkoYCMke3doZXJlRGl2fWApLmh0bWwoY29tcG9uZW50U3JjKTtcblxuICAgIGlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwID0ge307XG4gICAgfVxuXG4gICAgbGV0IGNvbXBvbmVudEtpbmQgPSAkKCQoYCMke3doZXJlRGl2fSBbZGF0YS1jb21wb25lbnRdYClbMF0pLmRhdGEoXG4gICAgICAgIFwiY29tcG9uZW50XCJcbiAgICApO1xuICAgIC8vIEltcG9ydCB0aGUgSmF2YVNjcmlwdCBmb3IgdGhpcyBjb21wb25lbnQgYmVmb3JlIHByb2NlZWRpbmcuXG4gICAgYXdhaXQgcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRLaW5kKTtcbiAgICBsZXQgb3B0ID0ge307XG4gICAgb3B0Lm9yaWcgPSBqUXVlcnkoYCMke3doZXJlRGl2fSBbZGF0YS1jb21wb25lbnRdYClbMF07XG4gICAgaWYgKG9wdC5vcmlnKSB7XG4gICAgICAgIG9wdC5sYW5nID0gJChvcHQub3JpZykuZGF0YShcImxhbmdcIik7XG4gICAgICAgIG9wdC51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IHRydWU7XG4gICAgICAgIG9wdC5ncmFkZXJhY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgb3B0LnB5dGhvbjMgPSB0cnVlO1xuICAgICAgICBpZiAodHlwZW9mIG1vcmVPcHRzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gbW9yZU9wdHMpIHtcbiAgICAgICAgICAgICAgICBvcHRba2V5XSA9IG1vcmVPcHRzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGFsZXJ0KFwiRXJyb3I6ICBNaXNzaW5nIHRoZSBjb21wb25lbnQgZmFjdG9yeSFcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgIXdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtjb21wb25lbnRLaW5kXSAmJlxuICAgICAgICAgICAgIWpRdWVyeShgIyR7d2hlcmVEaXZ9YCkuaHRtbCgpXG4gICAgICAgICkge1xuICAgICAgICAgICAgalF1ZXJ5KGAjJHt3aGVyZURpdn1gKS5odG1sKFxuICAgICAgICAgICAgICAgIGA8cD5QcmV2aWV3IG5vdCBhdmFpbGFibGUgZm9yICR7Y29tcG9uZW50S2luZH08L3A+YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCByZXMgPSB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0ob3B0KTtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRLaW5kID09PSBcImFjdGl2ZWNvZGVcIikge1xuICAgICAgICAgICAgICAgIGlmIChtb3JlT3B0cy5tdWx0aUdyYWRlcikge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW1xuICAgICAgICAgICAgICAgICAgICAgICAgYCR7bW9yZU9wdHMuZ3JhZGluZ0NvbnRhaW5lcn0gJHtyZXMuZGl2aWR9YFxuICAgICAgICAgICAgICAgICAgICBdID0gcmVzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbcmVzLmRpdmlkXSA9IHJlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUaW1lZENvbXBvbmVudChjb21wb25lbnRTcmMsIG1vcmVPcHRzKSB7XG4gICAgLyogVGhlIGltcG9ydGFudCBkaXN0aW5jdGlvbiBpcyB0aGF0IHRoZSBjb21wb25lbnQgZG9lcyBub3QgcmVhbGx5IG5lZWQgdG8gYmUgcmVuZGVyZWRcbiAgICBpbnRvIHRoZSBwYWdlLCBpbiBmYWN0LCBkdWUgdG8gdGhlIGFzeW5jIG5hdHVyZSBvZiBnZXR0aW5nIHRoZSBzb3VyY2UgdGhlIGxpc3Qgb2YgcXVlc3Rpb25zXG4gICAgaXMgbWFkZSBhbmQgdGhlIG9yaWdpbmFsIGh0bWwgaXMgcmVwbGFjZWQgYnkgdGhlIGxvb2sgb2YgdGhlIGV4YW0uXG4gICAgKi9cblxuICAgIGxldCBwYXR0ID0gLy4uXFwvX2ltYWdlcy9nO1xuICAgIGNvbXBvbmVudFNyYyA9IGNvbXBvbmVudFNyYy5yZXBsYWNlKFxuICAgICAgICBwYXR0LFxuICAgICAgICBgJHtlQm9va0NvbmZpZy5hcHB9L2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9L19pbWFnZXNgXG4gICAgKTtcblxuICAgIGxldCBjb21wb25lbnRLaW5kID0gJCgkKGNvbXBvbmVudFNyYykuZmluZChcIltkYXRhLWNvbXBvbmVudF1cIilbMF0pLmRhdGEoXG4gICAgICAgIFwiY29tcG9uZW50XCJcbiAgICApO1xuXG4gICAgbGV0IG9yaWdJZCA9ICQoY29tcG9uZW50U3JjKS5maW5kKFwiW2RhdGEtY29tcG9uZW50XVwiKS5maXJzdCgpLmF0dHIoXCJpZFwiKTtcblxuICAgIC8vIERvdWJsZSBjaGVjayAtLSBpZiB0aGUgY29tcG9uZW50IHNvdXJjZSBpcyBub3QgaW4gdGhlIERPTSwgdGhlbiBicmllZmx5IGFkZCBpdFxuICAgIC8vIGFuZCBjYWxsIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICBsZXQgaGRpdjtcbiAgICBpZiAoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9yaWdJZCkpIHtcbiAgICAgICAgaGRpdiA9ICQoXCI8ZGl2Lz5cIiwge1xuICAgICAgICAgICAgY3NzOiB7IGRpc3BsYXk6IFwibm9uZVwiIH0sXG4gICAgICAgIH0pLmFwcGVuZFRvKFwiYm9keVwiKTtcbiAgICAgICAgaGRpdi5odG1sKGNvbXBvbmVudFNyYyk7XG4gICAgfVxuICAgIC8vIGF0IHRoaXMgcG9pbnQgaGRpdiBpcyBhIGpxdWVyeSBvYmplY3RcblxuICAgIGxldCByZXQ7XG4gICAgbGV0IG9wdHMgPSB7XG4gICAgICAgIG9yaWc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9yaWdJZCksXG4gICAgICAgIHRpbWVkOiB0cnVlLFxuICAgIH07XG4gICAgaWYgKHR5cGVvZiBtb3JlT3B0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbW9yZU9wdHMpIHtcbiAgICAgICAgICAgIG9wdHNba2V5XSA9IG1vcmVPcHRzW2tleV07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29tcG9uZW50S2luZCBpbiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkpIHtcbiAgICAgICAgcmV0ID0gd2luZG93LmNvbXBvbmVudF9mYWN0b3J5W2NvbXBvbmVudEtpbmRdKG9wdHMpO1xuICAgIH1cblxuICAgIGxldCByZGljdCA9IHt9O1xuICAgIHJkaWN0LnF1ZXN0aW9uID0gcmV0O1xuICAgIHJldHVybiByZGljdDtcbn1cblxuLy8gRm9yIGludGVncmF0aW9uIHdpdGggdGhlIFJlYWN0IG92ZXJoYXVsdCBvZiBQcmV0ZXh0XG4vLyAxLiBEaXNhYmxlIHRoZSBhdXRvbWF0aWMgaW5zdGFudGlhdGlvbiBhdCB0aGUgZW5kIG9mIGVhY2ggY29tcG9uZW50LmpzXG4vLyAyLiByZWFjdCB3aWxsIHNlYXJjaCBmb3IgYWxsIFwiLnJ1bmVzdG9uZVwiIGFuZCB3aWxsIGNhbGwgdGhpcyBmdW5jdGlvbiBmb3IgZWFjaCBvZiB0aGVtLlxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlbmRlck9uZUNvbXBvbmVudChyc0Rpdikge1xuICAgIC8vIEZpbmQgdGhlIGFjdHVhbCBjb21wb25lbnQgaW5zaWRlIHRoZSBydW5lc3RvbmUgY29tcG9uZW50LlxuICAgIGxldCBjb21wb25lbnQgPSByc0Rpdi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtY29tcG9uZW50XVwiKTtcbiAgICBpZiAoY29tcG9uZW50ID09IG51bGwpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZW5kZXIgd2FzIGNhbGxlZCBmb3IgYSBjb21wb25lbnQsIGJ1dCBub3cgW2RhdGEtY29tcG9uZW50XSBhdHRyaWJ1dGUgaXMgcHJlc2VudC4gVGhpcyBtYXkgbWVhbiB0aGUgY29tcG9uZW50IGhhcyBhbHJlYWR5IGJlZW4gcmVuZGVyZWQuXCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNvbXBvbmVudEtpbmQgPSBjb21wb25lbnQuZGF0YXNldC5jb21wb25lbnQ7XG4gICAgYXdhaXQgcnVuZXN0b25lX2ltcG9ydChjb21wb25lbnRLaW5kKTtcbiAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZGl2aWQgPSBjb21wb25lbnQuaWQ7XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2RpdmlkXSA9IHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeVtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRLaW5kXG4gICAgICAgICAgICBdKHtcbiAgICAgICAgICAgICAgICBvcmlnOiBjb21wb25lbnQsXG4gICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyAke2NvbXBvbmVudEtpbmR9IFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgIERldGFpbHM6ICR7ZXJyfWApO1xuICAgICAgICB9XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9