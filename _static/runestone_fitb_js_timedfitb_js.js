"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_timedfitb_js"],{

/***/ 1103:
/*!****************************************!*\
  !*** ./runestone/fitb/js/timedfitb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedFITB)
/* harmony export */ });
/* harmony import */ var _fitb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fitb.js */ 54088);

class TimedFITB extends _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.inputDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }
    hideButtons() {
        if (this.submitButton) this.submitButton.style.display = "none";
        if (this.compareButton) this.compareButton.style.display = "none";
    }
    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        timeIcon.src = "../_static/clock.png";
        timeIcon.style.width = "15px";
        timeIcon.style.height = "15px";
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        if (component) {
            if (component.firstChild) {
                component.insertBefore(timeIconDiv, component.firstChild);
            } else {
                component.appendChild(timeIconDiv);
            }
        }
    }
    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.blankArray.length; i++) {
            this.blankArray[i].classList.remove("input-validation-error");
        }
        this.feedBackDiv.style.display = "none";
    }

    reinitializeListeners() {
        this.setupBlanks();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.fillintheblank = function (opts) {
    if (opts.timed) {
        return new TimedFITB(opts);
    }
    return new _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 30612:
/*!**********************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.pt-br.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_no_answer: "Nenhuma resposta dada.",
        msg_fitb_check_me: "Verificar",
        msg_fitb_compare_me: "Comparar"
    },
});


/***/ }),

/***/ 30923:
/*!************************************************!*\
  !*** ./runestone/fitb/js/libs/aleaPRNG-1.1.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   aleaPRNG: () => (/* binding */ aleaPRNG)
/* harmony export */ });
/*////////////////////////////////////////////////////////////////
aleaPRNG 1.1
//////////////////////////////////////////////////////////////////
https://github.com/macmcmeans/aleaPRNG/blob/master/aleaPRNG-1.1.js
//////////////////////////////////////////////////////////////////
Original work copyright © 2010 Johannes Baagøe, under MIT license
This is a derivative work copyright (c) 2017-2020, W. Mac" McMeans, under BSD license.
Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
////////////////////////////////////////////////////////////////*/
function aleaPRNG() {
    return( function( args ) {
        "use strict";

        const version = 'aleaPRNG 1.1.0';

        var s0
            , s1
            , s2
            , c
            , uinta = new Uint32Array( 3 )
            , initialArgs
            , mashver = ''
        ;

        /* private: initializes generator with specified seed */
        function _initState( _internalSeed ) {
            var mash = Mash();

            // internal state of generator
            s0 = mash( ' ' );
            s1 = mash( ' ' );
            s2 = mash( ' ' );

            c = 1;

            for( var i = 0; i < _internalSeed.length; i++ ) {
                s0 -= mash( _internalSeed[ i ] );
                if( s0 < 0 ) { s0 += 1; }

                s1 -= mash( _internalSeed[ i ] );
                if( s1 < 0 ) { s1 += 1; }

                s2 -= mash( _internalSeed[ i ] );
                if( s2 < 0 ) { s2 += 1; }
            }

            mashver = mash.version;

            mash = null;
        };

        /* private: dependent string hash function */
        function Mash() {
            var n = 4022871197; // 0xefc8249d

            var mash = function( data ) {
                data = data.toString();

                // cache the length
                for( var i = 0, l = data.length; i < l; i++ ) {
                    n += data.charCodeAt( i );

                    var h = 0.02519603282416938 * n;

                    n  = h >>> 0;
                    h -= n;
                    h *= n;
                    n  = h >>> 0;
                    h -= n;
                    n += h * 4294967296; // 0x100000000      2^32
                }
                return ( n >>> 0 ) * 2.3283064365386963e-10; // 2^-32
            };

            mash.version = 'Mash 0.9';
            return mash;
        };


        /* private: check if number is integer */
        function _isInteger( _int ) {
            return parseInt( _int, 10 ) === _int;
        };

        /* public: return a 32-bit fraction in the range [0, 1]
        This is the main function returned when aleaPRNG is instantiated
        */
        var random = function() {
            var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32

            s0 = s1;
            s1 = s2;

            return s2 = t - ( c = t | 0 );
        };

        /* public: return a 53-bit fraction in the range [0, 1] */
        random.fract53 = function() {
            return random() + ( random() * 0x200000  | 0 ) * 1.1102230246251565e-16; // 2^-53
        };

        /* public: return an unsigned integer in the range [0, 2^32] */
        random.int32 = function() {
            return random() * 0x100000000; // 2^32
        };

        /* public: advance the generator the specified amount of cycles */
        random.cycle = function( _run ) {
            _run = typeof _run === 'undefined' ? 1 : +_run;
            if( _run < 1 ) { _run = 1; }
            for( var i = 0; i < _run; i++ ) { random(); }
        };

        /* public: return inclusive range */
        random.range = function() {
            var loBound
                , hiBound
            ;

            if( arguments.length === 1 ) {
                loBound = 0;
                hiBound = arguments[ 0 ];

            } else {
                loBound = arguments[ 0 ];
                hiBound = arguments[ 1 ];
            }

            if( arguments[ 0 ] > arguments[ 1 ] ) {
                loBound = arguments[ 1 ];
                hiBound = arguments[ 0 ];
            }

            // return integer
            if( _isInteger( loBound ) && _isInteger( hiBound ) ) {
                return Math.floor( random() * ( hiBound - loBound + 1 ) ) + loBound;

            // return float
            } else {
                return random() * ( hiBound - loBound ) + loBound;
            }
        };

        /* public: initialize generator with the seed values used upon instantiation */
        random.restart = function() {
            _initState( initialArgs );
        };

        /* public: seeding function */
        random.seed = function() {
            _initState( Array.prototype.slice.call( arguments ) );
        };

        /* public: show the version of the RNG */
        random.version = function() {
            return version;
        };

        /* public: show the version of the RNG and the Mash string hasher */
        random.versions = function() {
            return version + ', ' + mashver;
        };

        // when no seed is specified, create a random one from Windows Crypto (Monte Carlo application)
        if( args.length === 0 ) {
             window.crypto.getRandomValues( uinta );
             args = [ uinta[ 0 ], uinta[ 1 ], uinta[ 2 ] ];
        };

        // store the seed used when the RNG was instantiated, if any
        initialArgs = args;

        // initialize the RNG
        _initState( args );

        return random;

    })( Array.prototype.slice.call( arguments ) );
};

/***/ }),

/***/ 39604:
/*!*******************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.en.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_no_answer: "No answer provided.",
        msg_fitb_check_me: "Check me",
        msg_fitb_compare_me: "Compare me",
        msg_fitb_randomize: "Randomize",
    },
});


/***/ }),

/***/ 44695:
/*!*************************************!*\
  !*** ./runestone/fitb/css/fitb.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 54088:
/*!***********************************!*\
  !*** ./runestone/fitb/js/fitb.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FITBList: () => (/* binding */ FITBList),
/* harmony export */   "default": () => (/* binding */ FITB)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fitb-utils.js */ 84548);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fitb-i18n.en.js */ 39604);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./fitb-i18n.pt-br.js */ 30612);
/* harmony import */ var _fitb_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./fitb-i18n.sr-Cyrl.js */ 61529);
/* harmony import */ var _css_fitb_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../css/fitb.css */ 44695);
// ***********************************************
// |docname| -- fill-in-the-blank client-side code
// ***********************************************
// This file contains the JS for the Runestone fillintheblank component. It was created By Isaiah Mayerchak and Kirby Olson, 6/4/15 then revised by Brad Miller, 2/7/20.
//
// Data storage notes
// ==================
//
// Initial problem restore
// -----------------------
// In the constructor, this code (the client) restores the problem by calling ``checkServer``. To do so, either the server sends or local storage has:
//
// -    seed (used only for dynamic problems)
// -    answer
// -    displayFeed (server-side grading only; otherwise, this is generated locally by client code)
// -    correct (SSG)
// -    isCorrectArray (SSG)
// -    problemHtml (SSG with dynamic problems only)
//
// If any of the answers are correct, then the client shows feedback. This is implemented in restoreAnswers_.
//
// Grading
// -------
// When the user presses the "Check me" button, the logCurrentAnswer_ function:
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   problemHtml
//
//      Note that there's no point in saving displayFeed, correct, or isCorrectArray, since these values applied to the previous answer, not the new answer just submitted.
//
// -    Sends the following to the server; stop after this for client-side grading:
//
//      -   seed (ignored for server-side grading)
//      -   answer
//      -   correct (ignored for SSG)
//      -   percent (ignored for SSG)
//
// -    Receives the following from the server:
//
//      -   timestamp
//      -   displayFeed
//      -   correct
//      -   isCorrectArray
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   displayFeed (SSG only)
//      -   correct (SSG only)
//      -   isCorrectArray (SSG only)
//      -   problemHtml
//
// Randomize
// ---------
// When the user presses the "Randomize" button (which is only available for dynamic problems), the randomize_ function:
//
// -    For the client-side case, sets the seed to a new, random value. For the server-side case, requests a new seed and problemHtml from the server.
// -    Sets the answer to an array of empty strings.
// -    Saves the usual local data.











// Object containing all instances of FITB that aren't a child of a timed assessment.
var FITBList = {};

// FITB constructor
class FITB extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <p> element
        this.useRunestoneServices = opts.useRunestoneServices;
        this.origElem = orig;
        this.divid = orig.id;
        this.correct = null;
        // See comments in fitb.py for the format of ``feedbackArray`` (which is identical in both files).
        //
        // Find the script tag containing JSON and parse it. See `SO <https://stackoverflow.com/questions/9320427/best-practice-for-embedding-arbitrary-json-in-the-dom>`__. If this tag doesn't exist, then no feedback is available; server-side grading will be performed.
        //
        // A destructuring assignment would be perfect, but they don't work with ``this.blah`` and ``with`` statements aren't supported in strict mode.
        const json_element = this.scriptSelector(this.origElem);
        const dict_ = JSON.parse(json_element.textContent);
        json_element.remove();
        // Check for older versions that have raw html content.
        if (dict_.problemHtml !== undefined) {
            // if dict_.problemHtml starts with &lt; then unescape it this happens for previews
            // when the problem comes from the DB
            if (dict_.problemHtml.startsWith("&lt;")) {
                dict_.problemHtml = dict_.problemHtml.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            }
            if (eBookConfig.useRunestoneServices) {
                dict_.problemHtml = dict_.problemHtml.replace(/src="external/g,
                    'src="' + `/ns/books/published/${eBookConfig.basecourse}` + '/external');
            }

            this.problemHtml = dict_.problemHtml;
            this.dyn_vars = dict_.dyn_vars;
            this.blankNames = dict_.blankNames;
            this.feedbackArray = dict_.feedbackArray;
        } else {
            this.problemHtml = this.origElem.innerHTML;
            this.feedbackArray = dict_;
        }

        this.createFITBElement();
        this.setupBlanks();
        this.caption = "Fill in the Blank";
        this.addCaption("runestone");

        // Define a promise which imports any libraries needed by dynamic problems.
        this.dyn_imports = {};
        let imports_promise = Promise.resolve();
        if (dict_.dyn_imports !== undefined) {
            // Collect all import promises.
            let import_promises = [];
            for (const import_ of dict_.dyn_imports) {
                switch (import_) {
                    // For imports known at webpack build, bring these in.
                    case "BTM":
                        import_promises.push(
                            __webpack_require__.e(/*! import() */ "vendors-node_modules_btm-expressions_src_BTM_root_js").then(__webpack_require__.bind(__webpack_require__, /*! btm-expressions/src/BTM_root.js */ 30571))
                        );
                        break;
                    // Allow for local imports, usually from problems defined outside the Runestone Components.
                    default:
                        import_promises.push(
                            import(/* webpackIgnore: true */ import_)
                        );
                        break;
                }
            }

            // Combine the resulting module namespace objects when these promises resolve.
            imports_promise = Promise.all(import_promises)
                .then(
                    (module_namespace_arr) =>
                    (this.dyn_imports = Object.assign(
                        {},
                        ...module_namespace_arr
                    ))
                )
                .catch((err) => {
                    throw `Failed dynamic import: ${err}.`;
                });
        }

        // Resolve these promises.
        imports_promise.then(() => {
            this.checkServer("fillb", false).then(() => {
                // One option for a dynamic problem is to produce a static problem by providing a fixed seed value. This is typically used when the goal is to render the problem as an image for inclusion in static content (a PDF, etc.). To support this, consider the following cases:
                //
                /// Case  Has static seed?  Is a client-side, dynamic problem?  Has local seed?  Result
                /// 0     No                No                                  X                No action needed.
                /// 1     No                Yes                                 No               this.randomize().
                /// 2     No                Yes                                 Yes              No action needed -- problem already restored from local storage.
                /// 3     Yes               No                                  X                Warning: seed ignored.
                /// 4     Yes               Yes                                 No               Assign seed; this.renderDynamicContent().
                /// 5     Yes               Yes                                 Yes              If seeds differ, issue warning. No additional action needed -- problem already restored from local storage.

                const has_static_seed = dict_.static_seed !== undefined;
                const is_client_dynamic = typeof this.dyn_vars === "string";
                const has_local_seed = this.seed !== undefined;

                // Case 1
                if (!has_static_seed && is_client_dynamic && !has_local_seed) {
                    this.randomize();
                }
                // Case 3
                else if (has_static_seed && !is_client_dynamic) {
                    console.assert(
                        false,
                        "Warning: the provided static seed was ignored, because it only affects client-side, dynamic problems."
                    );
                }
                // Case 4
                else if (
                    has_static_seed &&
                    is_client_dynamic &&
                    !has_local_seed
                ) {
                    this.seed = dict_.static_seed;
                    this.renderDynamicContent();
                }
                // Case 5
                else if (
                    has_static_seed &&
                    is_client_dynamic &&
                    has_local_seed &&
                    this.seed !== dict_.static_seed
                ) {
                    console.assert(
                        false,
                        "Warning: the provided static seed was overridden by the seed found in local storage."
                    );
                }
                // Cases 0 and 2
                else {
                    // No action needed.
                }

                if (typeof Prism !== "undefined") {
                    Prism.highlightAllUnder(this.containerDiv);
                }

                this.indicate_component_ready();
            });
        });
        this.queueMathJax(this.descriptionDiv);
    }

    // Find the script tag containing JSON in a given root DOM node.
    scriptSelector(root_node) {
        return root_node.querySelector(`script[type="application/json"]`);
    }

    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    createFITBElement() {
        this.renderFITBInput();
        this.renderFITBButtons();
        this.renderFITBFeedbackDiv();
        // replaces the intermediate HTML for this component with the rendered HTML of this component
        this.origElem.replaceWith(this.containerDiv);
    }
    renderFITBInput() {
        // The text [input] elements are created by the template.
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        // Create another container which stores the problem description.
        this.descriptionDiv = document.createElement("div");
        this.descriptionDiv.classList.add("exercise-statement");
        this.containerDiv.appendChild(this.descriptionDiv);
        // Copy the original elements to the container holding what the user will see (client-side grading only).
        if (this.problemHtml) {
            this.descriptionDiv.innerHTML = this.problemHtml;
            // Save original HTML (with templates) used in dynamic problems.
            this.descriptionDiv.origInnerHTML = this.problemHtml;
        }
    }

    renderFITBButtons() {
        // "submit" button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_check_me");
        this.submitButton.className = "btn btn-success";
        this.submitButton.name = "do answer";
        this.submitButton.type = "button";
        this.submitButton.addEventListener(
            "click",
            async function () {
                this.checkCurrentAnswer();
                await this.logCurrentAnswer();
            }.bind(this),
            false
        );
        this.containerDiv.appendChild(this.submitButton);

        // "compare me" button
        if (this.useRunestoneServices) {
            this.compareButton = document.createElement("button");
            this.compareButton.className = "btn btn-default";
            this.compareButton.id = this.origElem.id + "_bcomp";
            this.compareButton.disabled = true;
            this.compareButton.name = "compare";
            this.compareButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_compare_me");
            this.compareButton.addEventListener(
                "click",
                function () {
                    this.compareFITBAnswers();
                }.bind(this),
                false
            );
            this.containerDiv.appendChild(this.compareButton);
        }

        // Randomize button for dynamic problems.
        if (this.dyn_vars) {
            this.randomizeButton = document.createElement("button");
            this.randomizeButton.className = "btn btn-default";
            this.randomizeButton.id = this.origElem.id + "_bcomp";
            this.randomizeButton.name = "randomize";
            this.randomizeButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_fitb_randomize");
            this.randomizeButton.addEventListener(
                "click",
                function () {
                    this.randomize();
                }.bind(this),
                false
            );
            this.containerDiv.appendChild(this.randomizeButton);
        }

        this.containerDiv.appendChild(document.createElement("div"));
    }
    renderFITBFeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        this.feedBackDiv.id = this.divid + "_feedback";
        this.feedBackDiv.setAttribute("aria-live", "polite");
        this.feedBackDiv.setAttribute("role", "alert");
        this.feedBackDiv.classList.add("fitb-feedback");
        this.containerDiv.appendChild(this.feedBackDiv);
    }

    clearFeedbackDiv() {
        // Setting the ``outerHTML`` removes this from the DOM. Use an alternative process -- remove the class (which makes it red/green based on grading) and content.
        this.feedBackDiv.innerHTML = "";
        this.feedBackDiv.className = "";
    }

    // Update the problem's description based on dynamically-generated content.
    renderDynamicContent() {
        // ``this.dyn_vars`` can be true; if so, don't render it, since the server does all the rendering.
        if (typeof this.dyn_vars === "string") {
            let html_nodes;
            [html_nodes, this.dyn_vars_eval] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__.renderDynamicContent)(
                this.seed,
                this.dyn_vars,
                this.dyn_imports,
                this.descriptionDiv.origInnerHTML,
                this.divid,
                this.prepareCheckAnswers.bind(this)
            );
            this.descriptionDiv.replaceChildren(...html_nodes);

            if (typeof this.dyn_vars_eval.afterContentRender === "function") {
                try {
                    this.dyn_vars_eval.afterContentRender(this.dyn_vars_eval);
                } catch (err) {
                    console.assert(
                        false,
                        `Error in problem ${this.divid} invoking afterContentRender`
                    );
                    throw err;
                }
            }

            this.setupBlanks();
        }
    }

    setupBlanks() {
        // Find and format the blanks. If a dynamic problem just changed the HTML, this will find the newly-created blanks.
        // WARNING - this assumes that all text/number inputs in the descriptionDiv are the blanks.
        // Ideally, there should be some unique attribute that can be used to select the blanks.
        const ba = this.descriptionDiv.querySelectorAll('input[type="text"],input[type="number"]');
        ba.forEach((el) => {
            el.className = "form form-control selectwidthauto";
            el.setAttribute("aria-label", "input area");
        });
        this.blankArray = Array.from(ba);
        for (let blank of this.blankArray) {
            blank.addEventListener("change", this.recordAnswered.bind(this));
        }
    }

    // This tells timed questions that the fitb blanks received some interaction.
    recordAnswered() {
        this.isAnswered = true;
    }

    /*===================================
    === Checking/loading from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore the seed first, since the dynamic render clears all the blanks.
        this.seed = data.seed;
        this.renderDynamicContent();
        this.queueMathJax(this.descriptionDiv);

        var arr;
        // Restore answers from storage retrieval done in RunestoneBase.
        try {
            // The newer format encodes data as a JSON object.
            arr = JSON.parse(data.answer);
            // The result should be an array. If not, try comma parsing instead.
            if (!Array.isArray(arr)) {
                throw new Error();
            }
        } catch (err) {
            // The old format didn't.
            arr = (data.answer || "").split(",");
        }
        let hasAnswer = false;
        for (var i = 0; i < this.blankArray.length; i++) {
            this.blankArray[i].value = arr[i] || "";
            if (arr[i]) {
                hasAnswer = true;
            }
        }
        // Is this client-side grading, or server-side grading?
        if (this.feedbackArray) {
            // For client-side grading, re-generate feedback if there's an answer.
            if (hasAnswer) {
                this.checkCurrentAnswer();
            }
        } else {
            // For server-side grading, use the provided feedback from the server or local storage.
            this.displayFeed = data.displayFeed;
            this.correct = data.correct;
            this.isCorrectArray = data.isCorrectArray;
            // Only render if all the data is present; local storage might have old data missing some of these items.
            if (
                typeof this.displayFeed !== "undefined" &&
                typeof this.correct !== "undefined" &&
                typeof this.isCorrectArray !== "undefined"
            ) {
                this.renderFeedback();
            }
            // For server-side dynamic problems, show the rendered problem text.
            this.problemHtml = data.problemHtml;
            if (this.problemHtml) {
                this.descriptionDiv.innerHTML = this.problemHtml;
                this.queueMathJax(this.descriptionDiv);
                this.setupBlanks();
            }
        }
    }

    checkLocalStorage() {
        // Loads previous answers from local storage if they exist
        var storedData;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                let error = false;
                try {
                    storedData = JSON.parse(ex);
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(`Error parsing stored FITB data for ${this.divid}: ${err.message}`);
                    error = true;
                }
                if (error || storedData.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                this.restoreAnswers(storedData);
            }
        }
    }

    setLocalStorage(data) {
        let key = this.localStorageKey();
        localStorage.setItem(key, JSON.stringify(data));
    }

    checkCurrentAnswer() {
        // Start of the evaluation chain
        this.isCorrectArray = [];
        this.displayFeed = [];
        const pca = this.prepareCheckAnswers();

        if (this.useRunestoneServices) {
            if (eBookConfig.enableCompareMe) {
                this.enableCompareButton();
            }
        }

        // Grade locally if we can't ask the server to grade.
        if (this.feedbackArray) {
            [
                // An array of HTML feedback.
                this.displayFeed,
                // true, false, or null (the question wasn't answered).
                this.correct,
                // An array of true, false, or null (the question wasn't answered).
                this.isCorrectArray,
                this.percent,
            ] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__.checkAnswersCore)(...pca);
            if (!this.isTimed) {
                this.renderFeedback();
            }
        }
    }

    // Inputs:
    //
    // - Strings entered by the student in ``this.blankArray[i].value``.
    // - Feedback in ``this.feedbackArray``.
    prepareCheckAnswers() {
        this.given_arr = [];
        for (var i = 0; i < this.blankArray.length; i++)
            this.given_arr.push(this.blankArray[i].value);
        return [
            this.blankNames,
            this.given_arr,
            this.feedbackArray,
            this.dyn_vars_eval,
        ];
    }

    // _`randomize`: This handles a click to the "Randomize" button.
    async randomize() {
        // Use the client-side case or the server-side case?
        if (this.feedbackArray) {
            // This is the client-side case.
            //
            this.seed = Math.floor(Math.random() * 2 ** 32);
            this.renderDynamicContent();
            this.queueMathJax(this.descriptionDiv);
        } else {
            // This is the server-side case. Send a request to the `results <getAssessResults>` endpoint with ``new_seed`` set to True.
            const request = new Request("/assessment/results", {
                method: "POST",
                body: JSON.stringify({
                    div_id: this.divid,
                    course: eBookConfig.course,
                    event: "fillb",
                    sid: this.sid,
                    new_seed: true,
                }),
                headers: this.jsonHeaders,
            });
            const response = await fetch(request);
            if (!response.ok) {
                alert(`HTTP error getting results: ${response.statusText}`);
                return;
            }
            const data = await response.json();
            const res = data.detail;
            this.seed = res.seed;
            this.descriptionDiv.innerHTML = res.problemHtml;
            this.queueMathJax(this.descriptionDiv);
            this.setupBlanks();
        }
        // When getting a new seed, clear all the old answers and feedback.
        this.given_arr = Array(this.blankArray.len).fill("");
        this.blankArray.forEach((el) => (el.value = ""));
        this.clearFeedbackDiv();
        this.saveAnswersLocallyOnly();
    }

    // Save the answers and associated data locally; don't save feedback provided by the server for this answer. It assumes that ``this.given_arr`` contains the current answers.
    saveAnswersLocallyOnly() {
        this.setLocalStorage({
            // The seed is used for client-side operation, but doesn't matter for server-side.
            seed: this.seed,
            answer: JSON.stringify(this.given_arr),
            timestamp: new Date(),
            // This is only needed for server-side grading with dynamic problems.
            problemHtml: this.descriptionDiv.innerHTML,
        });
    }

    // _`logCurrentAnswer`: Save the current state of the problem to local storage and the server; display server feedback.
    async logCurrentAnswer(sid) {
        let answer = JSON.stringify(this.given_arr);
        let feedback = true;
        // Save the answer locally.
        this.saveAnswersLocallyOnly();
        // Save the answer to the server.
        const data = {
            event: "fillb",
            div_id: this.divid,
            act: answer || "",
            seed: this.seed,
            answer: answer || "",
            correct: this.correct ? "T" : "F",
            percent: this.percent,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
            feedback = false;
        }
        const server_data = await this.logBookEvent(data);
        if (!feedback) return;
        // Non-server side graded problems are done at this point; likewise, stop here if the server didn't respond.
        if (this.feedbackArray || !server_data) {
            return data;
        }
        // This is the server-side case. On success, update the feedback from the server's grade.
        const res = server_data.detail;
        this.timestamp = res.timestamp;
        this.displayFeed = res.displayFeed;
        this.correct = res.correct;
        this.isCorrectArray = res.isCorrectArray;
        this.setLocalStorage({
            seed: this.seed,
            answer: answer,
            timestamp: this.timestamp,
            problemHtml: this.descriptionDiv.innerHTML,
            displayFeed: this.displayFeed,
            correct: this.correct,
            isCorrectArray: this.isCorrectArray,
        });
        this.renderFeedback();
        return server_data;
    }

    /*==============================
    === Evaluation of answer and ===
    ===     display feedback     ===
    ==============================*/
    renderFeedback() {
        if (this.correct) {
            this.feedBackDiv.className = "alert alert-info fitb-feedback";
            for (let j = 0; j < this.blankArray.length; j++) {
                this.blankArray[j].classList.remove("input-validation-error");
            }
        } else {
            if (this.displayFeed === null) {
                this.displayFeed = "";
            }
            for (let j = 0; j < this.blankArray.length; j++) {
                if (this.isCorrectArray[j] !== true) {
                    this.blankArray[j].classList.add("input-validation-error");
                } else {
                    this.blankArray[j].classList.remove("input-validation-error");
                }
            }
            this.feedBackDiv.className = "alert alert-danger fitb-feedback";
        }
        var feedback_html = "<ul>";
        for (var i = 0; i < this.displayFeed.length; i++) {
            let df = this.displayFeed[i];
            let fm = (this.isCorrectArray[i] === true) ? '✔️' : '✖️';
            // Render any dynamic feedback in the provided feedback, for client-side grading of dynamic problems.
            if (typeof this.dyn_vars === "string") {
                df = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_2__.renderDynamicFeedback)(
                    this.blankNames,
                    this.given_arr,
                    i,
                    df,
                    this.dyn_vars_eval
                );
                // Convert the returned NodeList into a string of HTML.
                df = (df?.[0] !== undefined)
                    ? df[0].parentElement.innerHTML
                    : "No feedback provided";
            }
            feedback_html += `<li>${fm} ${df}</li>`;
        }
        feedback_html += "</ul>";
        // Remove the list if it's just one element.
        if (this.displayFeed.length == 1) {
            feedback_html = feedback_html.slice(
                "<ul><li>".length,
                -"</li></ul>".length
            );
        }
        this.feedBackDiv.innerHTML = feedback_html;
        if (typeof MathJax !== "undefined") {
            this.queueMathJax(this.feedBackDiv);
        }
    }

    /*==================================
    === Functions for compare button ===
    ==================================*/
    enableCompareButton() {
        this.compareButton.disabled = false;
    }
    // _`compareFITBAnswers`
    async compareFITBAnswers() {
        var data = {};
        data.div_id = this.divid;
        data.course = eBookConfig.course;
        try {
            const params = new URLSearchParams(data);
            const resp = await fetch(`${eBookConfig.new_server_prefix}/assessment/gettop10Answers?${params.toString()}`);
            const json = await resp.json();
            this.compareFITB(json);
        } catch (e) {
            console.error("Error fetching top answers:", e);
        }
    }
    compareFITB(data, status, whatever) {
        var answers = data.detail.res;
        var misc = data.detail.miscdata;
        var body = "<table>";
        body += "<tr><th>Answer</th><th>Count</th></tr>";
        for (var row in answers) {
            body +=
                "<tr><td>" +
                answers[row].answer +
                "</td><td>" +
                answers[row].count +
                " times</td></tr>";
        }
        body += "</table>";
        var html =
            "<div class='modal fade'>" +
            "    <div class='modal-dialog compare-modal'>" +
            "        <div class='modal-content'>" +
            "            <div class='modal-header'>" +
            "                <button type='button' class='close' aria-hidden='true'>&times;</button>" +
            "                <h4 class='modal-title'>Top Answers</h4>" +
            "            </div>" +
            "            <div class='modal-body'>" +
            body +
            "            </div>" +
            "        </div>" +
            "    </div>" +
            "</div>";
        // Simple modal without Bootstrap/jQuery
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.5)";
        overlay.style.zIndex = "9999";

        const dialog = document.createElement("div");
        dialog.className = "compare-modal";
        dialog.style.maxWidth = "720px";
        dialog.style.margin = "10vh auto";
        dialog.style.background = "#fff";
        dialog.style.borderRadius = "6px";
        dialog.style.boxShadow = "0 2px 12px rgba(0,0,0,0.3)";
        dialog.style.padding = "16px";

        const header = document.createElement("div");
        const closeBtn = document.createElement("button");
        closeBtn.type = "button";
        closeBtn.textContent = "×";
        closeBtn.setAttribute("aria-hidden", "true");
        closeBtn.style.float = "right";
        closeBtn.className = "btn btn-light";
        closeBtn.onclick = function () {
            document.body.removeChild(overlay);
        };
        const title = document.createElement("h4");
        title.className = "modal-title";
        title.textContent = "Top Answers";
        header.appendChild(closeBtn);
        header.appendChild(title);

        const modalBody = document.createElement("div");
        modalBody.innerHTML = body;

        dialog.appendChild(header);
        dialog.appendChild(modalBody);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    disableInteraction() {
        for (var i = 0; i < this.blankArray.length; i++) {
            this.blankArray[i].disabled = true;
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document
        .querySelectorAll("[data-component=fillintheblank]")
        .forEach(function (el, index) {
            var opts = {
                orig: el,
                useRunestoneServices: eBookConfig.useRunestoneServices,
            };
            if (!el.closest("[data-component=timedAssessment]")) {
                // If this element exists within a timed component, don't render it here
                try {
                    FITBList[el.id] = new FITB(opts);
                    window.componentMap[el.id] = FITBList[el.id];
                } catch (err) {
                    console.assert(
                        false,
                        `Error rendering Fill in the Blank Problem ${el.id}
                     Details: ${err}`
                    );
                }
            }
        });
});


/***/ }),

/***/ 61529:
/*!************************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.sr-Cyrl.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_no_answer: "Неодговорено.",
        msg_fitb_check_me: "Провери",
        msg_fitb_compare_me: "Упореди",
    },
});


/***/ }),

/***/ 84548:
/*!*****************************************!*\
  !*** ./runestone/fitb/js/fitb-utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkAnswersCore: () => (/* binding */ checkAnswersCore),
/* harmony export */   renderDynamicContent: () => (/* binding */ renderDynamicContent),
/* harmony export */   renderDynamicFeedback: () => (/* binding */ renderDynamicFeedback)
/* harmony export */ });
/* harmony import */ var _libs_aleaPRNG_1_1_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libs/aleaPRNG-1.1.js */ 30923);
// ********************************************************
// |docname| - grading-related utilities for FITB questions
// ********************************************************
// This code runs both on the server (for server-side grading) and on the client. It's placed here as a set of functions specifically for this purpose.





// Includes
// ========
// None.
//
//
// Globals
// =======
function render_html(html_in, dyn_vars_eval) {
    // Change the replacement tokens in the HTML into tags, so we can replace them using XML. The horrible regex is:
    //
    // Look for the characters ``[%=`` (the opening delimiter)
    /// \[%=
    // Followed by any amount of whitespace.
    /// \s*
    // Start a group that will capture the contents (excluding whitespace) of the tokens. For example, given ``[%= foo() %]``, the contents is ``foo()``.
    /// (
    // Don't capture the contents of this group, since it's only a single character. Match any character...
    /// (
    /// ?:.
    /// ...that doesn't end with ``%]`` (the closing delimiter).
    /// (?!%])
    /// )
    // Match this (anything but the closing delimiter) as much as we can.
    /// *)
    // Next, look for any whitespace.
    /// \s*
    // Finally, look for the closing delimiter ``%]``.
    /// %\]
    const html_replaced = html_in.replaceAll(
        /\[%=\s*((?:.(?!%]))*)\s*%\]/g,
        // Replace it with a `<script-eval>` tag. Quote the string, which will automatically escape any double quotes, using JSON.
        (match, group1) =>
            `<script-eval expr=${JSON.stringify(group1)}></script-eval>`
    );
    // Given HTML, turn it into a DOM. Walk the ``<script-eval>`` tags, performing the requested evaluation on them.
    //
    // See `DOMParser <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser>`_.
    const parser = new DOMParser();
    // See `DOMParser.parseFromString() <https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString>`_.
    const doc = parser.parseFromString(html_replaced, "text/html");
    const script_eval_tags = doc.getElementsByTagName("script-eval");
    while (script_eval_tags.length) {
        // Get the first tag. It will be removed from the collection after it's replaced with its value.
        const script_eval_tag = script_eval_tags[0];
        // See if this ``<script-eval>`` tag has as ``@expr`` attribute.
        const expr = script_eval_tag.getAttribute("expr");
        // If so, evaluate it.
        if (expr) {
            const eval_result = window.Function(
                "v",
                ...Object.keys(dyn_vars_eval),
                `"use strict;"\nreturn ${expr};`
            )(dyn_vars_eval, ...Object.values(dyn_vars_eval));
            // Replace the tag with the resulting value.
            script_eval_tag.replaceWith(eval_result);
        }
    }

    // Return the body contents. Note that the ``DOMParser`` constructs an entire document, not just the document fragment we passed it. Therefore, extract the desired fragment and return that. Note that we need to use `childNodes <https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes>`_, which includes non-element children like text and comments; using ``children`` omits these non-element children.
    return doc.body.childNodes;
}

// Functions
// =========
// Update the problem's description based on dynamically-generated content.
function renderDynamicContent(
    seed,
    dyn_vars,
    dyn_imports,
    html_in,
    divid,
    prepareCheckAnswers
) {
    // Initialize RNG with ``seed``.
    const rand = (0,_libs_aleaPRNG_1_1_js__WEBPACK_IMPORTED_MODULE_0__.aleaPRNG)(seed);

    // See `RAND_FUNC <RAND_FUNC>`_, which refers to ``rand`` above.
    const dyn_vars_eval = window.Function(
        "v",
        "rand",
        ...Object.keys(dyn_imports),
        `"use strict";\n${dyn_vars};\nreturn v;`
    )(
        // We want v.divid = divid and v.prepareCheckAnswers = prepareCheckAnswers. In contrast, the key/values pairs of dyn_imports should be directly assigned to v, hence the Object.assign.
        Object.assign({ divid, prepareCheckAnswers}, dyn_imports),
        rand,
        // In addition to providing this in v, make it available in the function as well, since most problem authors will write ``foo = new BTM()`` (for example, assuming BTM is in dyn_imports) instead of ``foo = new v.BTM()`` (which is unusual syntax).
        ...Object.values(dyn_imports));

    let html_out;
    if (typeof dyn_vars_eval.beforeContentRender === "function") {
        try {
            dyn_vars_eval.beforeContentRender(dyn_vars_eval);
        } catch (err) {
            console.assert(false,
                `Error in problem ${divid} invoking beforeContentRender`
            );
            throw err;
        }
    }
    try {
        html_out = render_html(html_in, dyn_vars_eval);
    } catch (err) {
        console.assert(false, `Error rendering problem ${divid} text.`);
        throw err;
    }

    // the afterContentRender event will be called by the caller of this function (after it updated the HTML based on the contents of html_out).
    return [html_out, dyn_vars_eval];
}

// Given student answers, grade them and provide feedback.
//
// Outputs:
//
// -    ``displayFeed`` is an array of HTML feedback.
// -    ``isCorrectArray`` is an array of true, false, or null (the question wasn't answered).
// -    ``correct`` is true, false, or null (the question wasn't answered).
// -    ``percent`` is the percentage of correct answers (from 0 to 1, not 0 to 100).
function checkAnswersCore(
    // _`blankNamesDict`: An dict of {blank_name, blank_index} specifying the name for each named blank.
    blankNamesDict,
    // _`given_arr`: An array of strings containing student-provided answers for each blank.
    given_arr,
    // A 2-D array of strings giving feedback for each blank.
    feedbackArray,
    // _`dyn_vars_eval`: A dict produced by evaluating the JavaScript for a dynamic exercise.
    dyn_vars_eval
) {
    if (
        dyn_vars_eval &&
        typeof dyn_vars_eval.beforeCheckAnswers === "function"
    ) {
        const [namedBlankValues, given_arr_converted] = parseAnswers(
            blankNamesDict,
            given_arr,
            dyn_vars_eval
        );
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.beforeCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.assert(false, "Error calling beforeCheckAnswers");
            throw err;
        }
    }

    // Keep track if all answers are correct or not.
    let correct = true;
    const isCorrectArray = [];
    const displayFeed = [];
    for (let i = 0; i < given_arr.length; i++) {
        const given = given_arr[i];
        // If this blank is empty, provide no feedback for it.
        if (given === "") {
            isCorrectArray.push(null);
            // TODO: should be localized, e.g. t("msg_no_answer").
            displayFeed.push("No answer provided.");
            correct = false;
        } else {
            // Look through all feedback for this blank. The last element in the array always matches. If no feedback for this blank exists, use an empty list.
            const fbl = feedbackArray[i] || [];
            let j;
            for (j = 0; j < fbl.length; j++) {
                // The last item of feedback always matches.
                if (j === fbl.length - 1) {
                    displayFeed.push(fbl[j]["feedback"]);
                    break;
                }
                // If this is a regexp...
                if ("regex" in fbl[j]) {
                    const patt = RegExp(
                        fbl[j]["regex"],
                        fbl[j]["regexFlags"]
                    );
                    if (patt.test(given)) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                } else if ("number" in fbl[j]) {
                    // This is a number.
                    const [min, max] = fbl[j]["number"];
                    // Convert the given string to a number. While there are `lots of ways <https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls>`_ to do this; this version supports other bases (hex/binary/octal) as well as floats.
                    const actual = +given;
                    if (actual >= min && actual <= max) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                // If this is a dynamic solution, they should provide a testing function
                } else if (dyn_vars_eval) {
                    const [namedBlankValues, given_arr_converted] =
                        parseAnswers(blankNamesDict, given_arr, dyn_vars_eval);
                    // If there was a parse error, then it student's answer is incorrect.
                    if (given_arr_converted[i] instanceof TypeError) {
                        displayFeed.push(given_arr_converted[i].message);
                        // Count this as wrong by making j != 0 -- see the code that runs immediately after the executing the break.
                        j = 1;
                        break;
                    }
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        ...Object.keys(dyn_vars_eval),
                        ...Object.keys(namedBlankValues),
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`
                    )(
                        given_arr_converted[i],
                        given_arr_converted,
                        ...Object.values(dyn_vars_eval),
                        ...Object.values(namedBlankValues)
                    );
                    // If student's answer is equal to this item, then append this item's feedback.
                    if (is_equal) {
                        displayFeed.push(
                            typeof is_equal === "string"
                                ? is_equal
                                : fbl[j]["feedback"]
                        );
                        break;
                    }
                // If this is NOT a dynamic solution, but given a testing function
                } else if ("solution_code" in fbl[j]) {
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`
                    )(given, given_arr);
                    // If student's answer is equal to this item, then append this item's feedback.
                    if (is_equal) {
                        displayFeed.push(
                            typeof is_equal === "string"
                                ? is_equal
                                : fbl[j]["feedback"]
                        );
                        break;
                    }
                } else {
                    // Undefined method of testing.
                    console.assert("number" in fbl[j]);
                }
            }

            // The answer is correct if it matched the first element in the array. A special case: if only one answer is provided, count it wrong; this is a misformed problem.
            const is_correct = j === 0 && fbl.length > 1;
            isCorrectArray.push(is_correct);
            if (!is_correct) {
                correct = false;
            }
        }
    }

    if (
        dyn_vars_eval &&
        typeof dyn_vars_eval.afterCheckAnswers === "function"
    ) {
        const [namedBlankValues, given_arr_converted] = parseAnswers(
            blankNamesDict,
            given_arr,
            dyn_vars_eval
        );
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.afterCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.assert(false, "Error calling afterCheckAnswers");
            throw err;
        }
    }

    const percent =
        isCorrectArray.filter(Boolean).length / isCorrectArray.length;
    return [displayFeed, correct, isCorrectArray, percent];
}

// Use the provided parsers to convert a student's answers (as strings) to the type produced by the parser for each blank.
function parseAnswers(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // See `dyn_vars_eval`.
    dyn_vars_eval
) {
    // Provide a dict of {blank_name, converter_answer_value}.
    const namedBlankValues = getNamedBlankValues(
        given_arr,
        blankNamesDict,
        dyn_vars_eval
    );
    // Invert blankNamedDict: compute an array of [blank_0_name, ...]. Note that the array may be sparse: it only contains values for named blanks.
    const given_arr_names = [];
    for (const [k, v] of Object.entries(blankNamesDict)) {
        given_arr_names[v] = k;
    }
    // Compute an array of [converted_blank_0_val, ...]. Note that this re-converts all the values, rather than (possibly deep) copying the values from already-converted named blanks.
    const given_arr_converted = given_arr.map((value, index) =>
        type_convert(given_arr_names[index], value, index, dyn_vars_eval)
    );

    return [namedBlankValues, given_arr_converted];
}

// Render the feedback for a dynamic problem.
function renderDynamicFeedback(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // The index of this blank in given_arr_.
    index,
    // The feedback for this blank, containing a template to be rendered.
    displayFeed_i,
    // See dyn_vars_eval_.
    dyn_vars_eval
) {
    // Use the answer, an array of all answers, the value of all named blanks, and all solution variables for the template.
    const namedBlankValues = getNamedBlankValues(
        given_arr,
        blankNamesDict,
        dyn_vars_eval
    );
    const sol_vars_plus = Object.assign(
        {
            ans: given_arr[index],
            ans_array: given_arr,
        },
        dyn_vars_eval,
        namedBlankValues
    );
    try {
        displayFeed_i = render_html(displayFeed_i, sol_vars_plus);
    } catch (err) {
        console.assert(false, `Error evaluating feedback index ${index}.`);
        throw err;
    }

    return displayFeed_i;
}

// Utilities
// ---------
// For each named blank, get the value for the blank: the value of each ``blankName`` gives the index of the blank for that name.
function getNamedBlankValues(given_arr, blankNamesDict, dyn_vars_eval) {
    const namedBlankValues = {};
    for (const [blank_name, blank_index] of Object.entries(blankNamesDict)) {
        namedBlankValues[blank_name] = type_convert(
            blank_name,
            given_arr[blank_index],
            blank_index,
            dyn_vars_eval
        );
    }
    return namedBlankValues;
}

// Convert a value given its type.
function type_convert(name, value, index, dyn_vars_eval) {
    // The converter can be defined by index, name, or by a single value (which applies to all blanks). If not provided, just pass the data through.
    const types = dyn_vars_eval.types || pass_through;
    const converter = types[name] || types[index] || types;
    // ES5 hack: it doesn't support binary values, and js2py doesn't allow me to override the ``Number`` class. So, define the workaround class ``Number_`` and use it if available.
    if (converter === Number && typeof Number_ !== "undefined") {
        converter = Number_;
    }

    // Return the converted type. If the converter raises a TypeError, return that; it will be displayed to the user, since we assume type errors are a way for the parser to explain to the user why the parse failed. For all other errors, re-throw it since something went wrong.
    try {
        return converter(value);
    } catch (err) {
        if (err instanceof TypeError) {
            return err;
        } else {
            throw err;
        }
    }
}

// A pass-through "converter".
function pass_through(val) {
    return val;
}


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9GQUFvRjtBQUNwRjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvdGltZWRmaXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2xpYnMvYWxlYVBSTkctMS4xLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uZW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2Nzcy9maXRiLmNzcz85ZWJkIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4uc3ItQ3lybC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi11dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRklUQiBmcm9tIFwiLi9maXRiLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZEZJVEIgZXh0ZW5kcyBGSVRCIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmlucHV0RGl2KTtcbiAgICAgICAgdGhpcy5oaWRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiA9IHRydWU7XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJtaXRCdXR0b24pIHRoaXMuc3VibWl0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuY29tcGFyZUJ1dHRvbikgdGhpcy5jb21wYXJlQnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5jbGFzc05hbWUgPSBcInRpbWVUaXBcIjtcbiAgICAgICAgdGltZUljb25EaXYudGl0bGUgPSBcIlwiO1xuICAgICAgICB0aW1lSWNvbkRpdi5hcHBlbmRDaGlsZCh0aW1lSWNvbik7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5pbnNlcnRCZWZvcmUodGltZUljb25EaXYsIGNvbXBvbmVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50LmFwcGVuZENoaWxkKHRpbWVJY29uRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgLy8gUmV0dXJucyBpZiB0aGUgcXVlc3Rpb24gd2FzIGNvcnJlY3QsIGluY29ycmVjdCwgb3Igc2tpcHBlZCAocmV0dXJuIG51bGwgaW4gdGhlIGxhc3QgY2FzZSlcbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaGlkZUZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ibGFua0FycmF5W2ldLmNsYXNzTGlzdC5yZW1vdmUoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5maWxsaW50aGVibGFuayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZEZJVEIob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRklUQihvcHRzKTtcbn07XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwiTmVuaHVtYSByZXNwb3N0YSBkYWRhLlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJhclwiXG4gICAgfSxcbn0pO1xuIiwiLyovLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5hbGVhUFJORyAxLjFcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuaHR0cHM6Ly9naXRodWIuY29tL21hY21jbWVhbnMvYWxlYVBSTkcvYmxvYi9tYXN0ZXIvYWxlYVBSTkctMS4xLmpzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbk9yaWdpbmFsIHdvcmsgY29weXJpZ2h0IMKpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZSwgdW5kZXIgTUlUIGxpY2Vuc2VcblRoaXMgaXMgYSBkZXJpdmF0aXZlIHdvcmsgY29weXJpZ2h0IChjKSAyMDE3LTIwMjAsIFcuIE1hY1wiIE1jTWVhbnMsIHVuZGVyIEJTRCBsaWNlbnNlLlxuUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgYXJlIHBlcm1pdHRlZCBwcm92aWRlZCB0aGF0IHRoZSBmb2xsb3dpbmcgY29uZGl0aW9ucyBhcmUgbWV0OlxuMS4gUmVkaXN0cmlidXRpb25zIG9mIHNvdXJjZSBjb2RlIG11c3QgcmV0YWluIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuMi4gUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyIGluIHRoZSBkb2N1bWVudGF0aW9uIGFuZC9vciBvdGhlciBtYXRlcmlhbHMgcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxuMy4gTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgY29weXJpZ2h0IGhvbGRlciBub3IgdGhlIG5hbWVzIG9mIGl0cyBjb250cmlidXRvcnMgbWF5IGJlIHVzZWQgdG8gZW5kb3JzZSBvciBwcm9tb3RlIHByb2R1Y3RzIGRlcml2ZWQgZnJvbSB0aGlzIHNvZnR3YXJlIHdpdGhvdXQgc3BlY2lmaWMgcHJpb3Igd3JpdHRlbiBwZXJtaXNzaW9uLlxuVEhJUyBTT0ZUV0FSRSBJUyBQUk9WSURFRCBCWSBUSEUgQ09QWVJJR0hUIEhPTERFUlMgQU5EIENPTlRSSUJVVE9SUyBcIkFTIElTXCIgQU5EIEFOWSBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIENPUFlSSUdIVCBIT0xERVIgT1IgQ09OVFJJQlVUT1JTIEJFIExJQUJMRSBGT1IgQU5ZIERJUkVDVCwgSU5ESVJFQ1QsIElOQ0lERU5UQUwsIFNQRUNJQUwsIEVYRU1QTEFSWSwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIChJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgUFJPQ1VSRU1FTlQgT0YgU1VCU1RJVFVURSBHT09EUyBPUiBTRVJWSUNFUzsgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkcgTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLyovXG5leHBvcnQgZnVuY3Rpb24gYWxlYVBSTkcoKSB7XG4gICAgcmV0dXJuKCBmdW5jdGlvbiggYXJncyApIHtcbiAgICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAgICAgY29uc3QgdmVyc2lvbiA9ICdhbGVhUFJORyAxLjEuMCc7XG5cbiAgICAgICAgdmFyIHMwXG4gICAgICAgICAgICAsIHMxXG4gICAgICAgICAgICAsIHMyXG4gICAgICAgICAgICAsIGNcbiAgICAgICAgICAgICwgdWludGEgPSBuZXcgVWludDMyQXJyYXkoIDMgKVxuICAgICAgICAgICAgLCBpbml0aWFsQXJnc1xuICAgICAgICAgICAgLCBtYXNodmVyID0gJydcbiAgICAgICAgO1xuXG4gICAgICAgIC8qIHByaXZhdGU6IGluaXRpYWxpemVzIGdlbmVyYXRvciB3aXRoIHNwZWNpZmllZCBzZWVkICovXG4gICAgICAgIGZ1bmN0aW9uIF9pbml0U3RhdGUoIF9pbnRlcm5hbFNlZWQgKSB7XG4gICAgICAgICAgICB2YXIgbWFzaCA9IE1hc2goKTtcblxuICAgICAgICAgICAgLy8gaW50ZXJuYWwgc3RhdGUgb2YgZ2VuZXJhdG9yXG4gICAgICAgICAgICBzMCA9IG1hc2goICcgJyApO1xuICAgICAgICAgICAgczEgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMyID0gbWFzaCggJyAnICk7XG5cbiAgICAgICAgICAgIGMgPSAxO1xuXG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9pbnRlcm5hbFNlZWQubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgczAgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMwIDwgMCApIHsgczAgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczEgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMxIDwgMCApIHsgczEgKz0gMTsgfVxuXG4gICAgICAgICAgICAgICAgczIgLT0gbWFzaCggX2ludGVybmFsU2VlZFsgaSBdICk7XG4gICAgICAgICAgICAgICAgaWYoIHMyIDwgMCApIHsgczIgKz0gMTsgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXNodmVyID0gbWFzaC52ZXJzaW9uO1xuXG4gICAgICAgICAgICBtYXNoID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwcml2YXRlOiBkZXBlbmRlbnQgc3RyaW5nIGhhc2ggZnVuY3Rpb24gKi9cbiAgICAgICAgZnVuY3Rpb24gTWFzaCgpIHtcbiAgICAgICAgICAgIHZhciBuID0gNDAyMjg3MTE5NzsgLy8gMHhlZmM4MjQ5ZFxuXG4gICAgICAgICAgICB2YXIgbWFzaCA9IGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgbGVuZ3RoXG4gICAgICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDAsIGwgPSBkYXRhLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBkYXRhLmNoYXJDb2RlQXQoIGkgKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgaCA9IDAuMDI1MTk2MDMyODI0MTY5MzggKiBuO1xuXG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBoICo9IG47XG4gICAgICAgICAgICAgICAgICAgIG4gID0gaCA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgaCAtPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICs9IGggKiA0Mjk0OTY3Mjk2OyAvLyAweDEwMDAwMDAwMCAgICAgIDJeMzJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuICggbiA+Pj4gMCApICogMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLy8gMl4tMzJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1hc2gudmVyc2lvbiA9ICdNYXNoIDAuOSc7XG4gICAgICAgICAgICByZXR1cm4gbWFzaDtcbiAgICAgICAgfTtcblxuXG4gICAgICAgIC8qIHByaXZhdGU6IGNoZWNrIGlmIG51bWJlciBpcyBpbnRlZ2VyICovXG4gICAgICAgIGZ1bmN0aW9uIF9pc0ludGVnZXIoIF9pbnQgKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoIF9pbnQsIDEwICkgPT09IF9pbnQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSAzMi1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXVxuICAgICAgICBUaGlzIGlzIHRoZSBtYWluIGZ1bmN0aW9uIHJldHVybmVkIHdoZW4gYWxlYVBSTkcgaXMgaW5zdGFudGlhdGVkXG4gICAgICAgICovXG4gICAgICAgIHZhciByYW5kb20gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciB0ID0gMjA5MTYzOSAqIHMwICsgYyAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG5cbiAgICAgICAgICAgIHMwID0gczE7XG4gICAgICAgICAgICBzMSA9IHMyO1xuXG4gICAgICAgICAgICByZXR1cm4gczIgPSB0IC0gKCBjID0gdCB8IDAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhIDUzLWJpdCBmcmFjdGlvbiBpbiB0aGUgcmFuZ2UgWzAsIDFdICovXG4gICAgICAgIHJhbmRvbS5mcmFjdDUzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKyAoIHJhbmRvbSgpICogMHgyMDAwMDAgIHwgMCApICogMS4xMTAyMjMwMjQ2MjUxNTY1ZS0xNjsgLy8gMl4tNTNcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBhbiB1bnNpZ25lZCBpbnRlZ2VyIGluIHRoZSByYW5nZSBbMCwgMl4zMl0gKi9cbiAgICAgICAgcmFuZG9tLmludDMyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAweDEwMDAwMDAwMDsgLy8gMl4zMlxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogYWR2YW5jZSB0aGUgZ2VuZXJhdG9yIHRoZSBzcGVjaWZpZWQgYW1vdW50IG9mIGN5Y2xlcyAqL1xuICAgICAgICByYW5kb20uY3ljbGUgPSBmdW5jdGlvbiggX3J1biApIHtcbiAgICAgICAgICAgIF9ydW4gPSB0eXBlb2YgX3J1biA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK19ydW47XG4gICAgICAgICAgICBpZiggX3J1biA8IDEgKSB7IF9ydW4gPSAxOyB9XG4gICAgICAgICAgICBmb3IoIHZhciBpID0gMDsgaSA8IF9ydW47IGkrKyApIHsgcmFuZG9tKCk7IH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHJldHVybiBpbmNsdXNpdmUgcmFuZ2UgKi9cbiAgICAgICAgcmFuZG9tLnJhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbG9Cb3VuZFxuICAgICAgICAgICAgICAgICwgaGlCb3VuZFxuICAgICAgICAgICAgO1xuXG4gICAgICAgICAgICBpZiggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBsb0JvdW5kID0gMDtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50c1sgMCBdID4gYXJndW1lbnRzWyAxIF0gKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IGFyZ3VtZW50c1sgMSBdO1xuICAgICAgICAgICAgICAgIGhpQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gcmV0dXJuIGludGVnZXJcbiAgICAgICAgICAgIGlmKCBfaXNJbnRlZ2VyKCBsb0JvdW5kICkgJiYgX2lzSW50ZWdlciggaGlCb3VuZCApICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKCByYW5kb20oKSAqICggaGlCb3VuZCAtIGxvQm91bmQgKyAxICkgKSArIGxvQm91bmQ7XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBmbG9hdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICkgKyBsb0JvdW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogaW5pdGlhbGl6ZSBnZW5lcmF0b3Igd2l0aCB0aGUgc2VlZCB2YWx1ZXMgdXNlZCB1cG9uIGluc3RhbnRpYXRpb24gKi9cbiAgICAgICAgcmFuZG9tLnJlc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF9pbml0U3RhdGUoIGluaXRpYWxBcmdzICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzZWVkaW5nIGZ1bmN0aW9uICovXG4gICAgICAgIHJhbmRvbS5zZWVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCggYXJndW1lbnRzICkgKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IHNob3cgdGhlIHZlcnNpb24gb2YgdGhlIFJORyAqL1xuICAgICAgICByYW5kb20udmVyc2lvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb247XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgYW5kIHRoZSBNYXNoIHN0cmluZyBoYXNoZXIgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdmVyc2lvbiArICcsICcgKyBtYXNodmVyO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHdoZW4gbm8gc2VlZCBpcyBzcGVjaWZpZWQsIGNyZWF0ZSBhIHJhbmRvbSBvbmUgZnJvbSBXaW5kb3dzIENyeXB0byAoTW9udGUgQ2FybG8gYXBwbGljYXRpb24pXG4gICAgICAgIGlmKCBhcmdzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgICB3aW5kb3cuY3J5cHRvLmdldFJhbmRvbVZhbHVlcyggdWludGEgKTtcbiAgICAgICAgICAgICBhcmdzID0gWyB1aW50YVsgMCBdLCB1aW50YVsgMSBdLCB1aW50YVsgMiBdIF07XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gc3RvcmUgdGhlIHNlZWQgdXNlZCB3aGVuIHRoZSBSTkcgd2FzIGluc3RhbnRpYXRlZCwgaWYgYW55XG4gICAgICAgIGluaXRpYWxBcmdzID0gYXJncztcblxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBSTkdcbiAgICAgICAgX2luaXRTdGF0ZSggYXJncyApO1xuXG4gICAgICAgIHJldHVybiByYW5kb207XG5cbiAgICB9KSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG59OyIsImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX3JhbmRvbWl6ZTogXCJSYW5kb21pemVcIixcbiAgICB9LFxufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0tIGZpbGwtaW4tdGhlLWJsYW5rIGNsaWVudC1zaWRlIGNvZGVcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgUnVuZXN0b25lIGZpbGxpbnRoZWJsYW5rIGNvbXBvbmVudC4gSXQgd2FzIGNyZWF0ZWQgQnkgSXNhaWFoIE1heWVyY2hhayBhbmQgS2lyYnkgT2xzb24sIDYvNC8xNSB0aGVuIHJldmlzZWQgYnkgQnJhZCBNaWxsZXIsIDIvNy8yMC5cbi8vXG4vLyBEYXRhIHN0b3JhZ2Ugbm90ZXNcbi8vID09PT09PT09PT09PT09PT09PVxuLy9cbi8vIEluaXRpYWwgcHJvYmxlbSByZXN0b3JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW4gdGhlIGNvbnN0cnVjdG9yLCB0aGlzIGNvZGUgKHRoZSBjbGllbnQpIHJlc3RvcmVzIHRoZSBwcm9ibGVtIGJ5IGNhbGxpbmcgYGBjaGVja1NlcnZlcmBgLiBUbyBkbyBzbywgZWl0aGVyIHRoZSBzZXJ2ZXIgc2VuZHMgb3IgbG9jYWwgc3RvcmFnZSBoYXM6XG4vL1xuLy8gLSAgICBzZWVkICh1c2VkIG9ubHkgZm9yIGR5bmFtaWMgcHJvYmxlbXMpXG4vLyAtICAgIGFuc3dlclxuLy8gLSAgICBkaXNwbGF5RmVlZCAoc2VydmVyLXNpZGUgZ3JhZGluZyBvbmx5OyBvdGhlcndpc2UsIHRoaXMgaXMgZ2VuZXJhdGVkIGxvY2FsbHkgYnkgY2xpZW50IGNvZGUpXG4vLyAtICAgIGNvcnJlY3QgKFNTRylcbi8vIC0gICAgaXNDb3JyZWN0QXJyYXkgKFNTRylcbi8vIC0gICAgcHJvYmxlbUh0bWwgKFNTRyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMgb25seSlcbi8vXG4vLyBJZiBhbnkgb2YgdGhlIGFuc3dlcnMgYXJlIGNvcnJlY3QsIHRoZW4gdGhlIGNsaWVudCBzaG93cyBmZWVkYmFjay4gVGhpcyBpcyBpbXBsZW1lbnRlZCBpbiByZXN0b3JlQW5zd2Vyc18uXG4vL1xuLy8gR3JhZGluZ1xuLy8gLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIkNoZWNrIG1lXCIgYnV0dG9uLCB0aGUgbG9nQ3VycmVudEFuc3dlcl8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gICAgICBOb3RlIHRoYXQgdGhlcmUncyBubyBwb2ludCBpbiBzYXZpbmcgZGlzcGxheUZlZWQsIGNvcnJlY3QsIG9yIGlzQ29ycmVjdEFycmF5LCBzaW5jZSB0aGVzZSB2YWx1ZXMgYXBwbGllZCB0byB0aGUgcHJldmlvdXMgYW5zd2VyLCBub3QgdGhlIG5ldyBhbnN3ZXIganVzdCBzdWJtaXR0ZWQuXG4vL1xuLy8gLSAgICBTZW5kcyB0aGUgZm9sbG93aW5nIHRvIHRoZSBzZXJ2ZXI7IHN0b3AgYWZ0ZXIgdGhpcyBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZzpcbi8vXG4vLyAgICAgIC0gICBzZWVkIChpZ25vcmVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nKVxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICBjb3JyZWN0IChpZ25vcmVkIGZvciBTU0cpXG4vLyAgICAgIC0gICBwZXJjZW50IChpZ25vcmVkIGZvciBTU0cpXG4vL1xuLy8gLSAgICBSZWNlaXZlcyB0aGUgZm9sbG93aW5nIGZyb20gdGhlIHNlcnZlcjpcbi8vXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkXG4vLyAgICAgIC0gICBjb3JyZWN0XG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheVxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBjb3JyZWN0IChTU0cgb25seSlcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5IChTU0cgb25seSlcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gUmFuZG9taXplXG4vLyAtLS0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJSYW5kb21pemVcIiBidXR0b24gKHdoaWNoIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBkeW5hbWljIHByb2JsZW1zKSwgdGhlIHJhbmRvbWl6ZV8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBGb3IgdGhlIGNsaWVudC1zaWRlIGNhc2UsIHNldHMgdGhlIHNlZWQgdG8gYSBuZXcsIHJhbmRvbSB2YWx1ZS4gRm9yIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLCByZXF1ZXN0cyBhIG5ldyBzZWVkIGFuZCBwcm9ibGVtSHRtbCBmcm9tIHRoZSBzZXJ2ZXIuXG4vLyAtICAgIFNldHMgdGhlIGFuc3dlciB0byBhbiBhcnJheSBvZiBlbXB0eSBzdHJpbmdzLlxuLy8gLSAgICBTYXZlcyB0aGUgdXN1YWwgbG9jYWwgZGF0YS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgdCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5pbXBvcnQge1xuICAgIHJlbmRlckR5bmFtaWNDb250ZW50LFxuICAgIGNoZWNrQW5zd2Vyc0NvcmUsXG4gICAgcmVuZGVyRHluYW1pY0ZlZWRiYWNrLFxufSBmcm9tIFwiLi9maXRiLXV0aWxzLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLnNyLUN5cmwuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBPYmplY3QgY29udGFpbmluZyBhbGwgaW5zdGFuY2VzIG9mIEZJVEIgdGhhdCBhcmVuJ3QgYSBjaGlsZCBvZiBhIHRpbWVkIGFzc2Vzc21lbnQuXG5leHBvcnQgdmFyIEZJVEJMaXN0ID0ge307XG5cbi8vIEZJVEIgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZJVEIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwPiBlbGVtZW50XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBvcHRzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIC8vIFNlZSBjb21tZW50cyBpbiBmaXRiLnB5IGZvciB0aGUgZm9ybWF0IG9mIGBgZmVlZGJhY2tBcnJheWBgICh3aGljaCBpcyBpZGVudGljYWwgaW4gYm90aCBmaWxlcykuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGFuZCBwYXJzZSBpdC4gU2VlIGBTTyA8aHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTMyMDQyNy9iZXN0LXByYWN0aWNlLWZvci1lbWJlZGRpbmctYXJiaXRyYXJ5LWpzb24taW4tdGhlLWRvbT5gX18uIElmIHRoaXMgdGFnIGRvZXNuJ3QgZXhpc3QsIHRoZW4gbm8gZmVlZGJhY2sgaXMgYXZhaWxhYmxlOyBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpbGwgYmUgcGVyZm9ybWVkLlxuICAgICAgICAvL1xuICAgICAgICAvLyBBIGRlc3RydWN0dXJpbmcgYXNzaWdubWVudCB3b3VsZCBiZSBwZXJmZWN0LCBidXQgdGhleSBkb24ndCB3b3JrIHdpdGggYGB0aGlzLmJsYWhgYCBhbmQgYGB3aXRoYGAgc3RhdGVtZW50cyBhcmVuJ3Qgc3VwcG9ydGVkIGluIHN0cmljdCBtb2RlLlxuICAgICAgICBjb25zdCBqc29uX2VsZW1lbnQgPSB0aGlzLnNjcmlwdFNlbGVjdG9yKHRoaXMub3JpZ0VsZW0pO1xuICAgICAgICBjb25zdCBkaWN0XyA9IEpTT04ucGFyc2UoanNvbl9lbGVtZW50LnRleHRDb250ZW50KTtcbiAgICAgICAganNvbl9lbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICAvLyBDaGVjayBmb3Igb2xkZXIgdmVyc2lvbnMgdGhhdCBoYXZlIHJhdyBodG1sIGNvbnRlbnQuXG4gICAgICAgIGlmIChkaWN0Xy5wcm9ibGVtSHRtbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBpZiBkaWN0Xy5wcm9ibGVtSHRtbCBzdGFydHMgd2l0aCAmbHQ7IHRoZW4gdW5lc2NhcGUgaXQgdGhpcyBoYXBwZW5zIGZvciBwcmV2aWV3c1xuICAgICAgICAgICAgLy8gd2hlbiB0aGUgcHJvYmxlbSBjb21lcyBmcm9tIHRoZSBEQlxuICAgICAgICAgICAgaWYgKGRpY3RfLnByb2JsZW1IdG1sLnN0YXJ0c1dpdGgoXCImbHQ7XCIpKSB7XG4gICAgICAgICAgICAgICAgZGljdF8ucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbC5yZXBsYWNlKC8mbHQ7L2csIFwiPFwiKS5yZXBsYWNlKC8mZ3Q7L2csIFwiPlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIGRpY3RfLnByb2JsZW1IdG1sID0gZGljdF8ucHJvYmxlbUh0bWwucmVwbGFjZSgvc3JjPVwiZXh0ZXJuYWwvZyxcbiAgICAgICAgICAgICAgICAgICAgJ3NyYz1cIicgKyBgL25zL2Jvb2tzL3B1Ymxpc2hlZC8ke2VCb29rQ29uZmlnLmJhc2Vjb3Vyc2V9YCArICcvZXh0ZXJuYWwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IGRpY3RfLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgdGhpcy5keW5fdmFycyA9IGRpY3RfLmR5bl92YXJzO1xuICAgICAgICAgICAgdGhpcy5ibGFua05hbWVzID0gZGljdF8uYmxhbmtOYW1lcztcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSA9IGRpY3RfLmZlZWRiYWNrQXJyYXk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW1IdG1sID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQXJyYXkgPSBkaWN0XztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlRklUQkVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcblxuICAgICAgICAvLyBEZWZpbmUgYSBwcm9taXNlIHdoaWNoIGltcG9ydHMgYW55IGxpYnJhcmllcyBuZWVkZWQgYnkgZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgdGhpcy5keW5faW1wb3J0cyA9IHt9O1xuICAgICAgICBsZXQgaW1wb3J0c19wcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgIGlmIChkaWN0Xy5keW5faW1wb3J0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBDb2xsZWN0IGFsbCBpbXBvcnQgcHJvbWlzZXMuXG4gICAgICAgICAgICBsZXQgaW1wb3J0X3Byb21pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGltcG9ydF8gb2YgZGljdF8uZHluX2ltcG9ydHMpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGltcG9ydF8pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGltcG9ydHMga25vd24gYXQgd2VicGFjayBidWlsZCwgYnJpbmcgdGhlc2UgaW4uXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJCVE1cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydF9wcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydChcImJ0bS1leHByZXNzaW9ucy9zcmMvQlRNX3Jvb3QuanNcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgLy8gQWxsb3cgZm9yIGxvY2FsIGltcG9ydHMsIHVzdWFsbHkgZnJvbSBwcm9ibGVtcyBkZWZpbmVkIG91dHNpZGUgdGhlIFJ1bmVzdG9uZSBDb21wb25lbnRzLlxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0X3Byb21pc2VzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0KC8qIHdlYnBhY2tJZ25vcmU6IHRydWUgKi8gaW1wb3J0XylcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbWJpbmUgdGhlIHJlc3VsdGluZyBtb2R1bGUgbmFtZXNwYWNlIG9iamVjdHMgd2hlbiB0aGVzZSBwcm9taXNlcyByZXNvbHZlLlxuICAgICAgICAgICAgaW1wb3J0c19wcm9taXNlID0gUHJvbWlzZS5hbGwoaW1wb3J0X3Byb21pc2VzKVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAobW9kdWxlX25hbWVzcGFjZV9hcnIpID0+XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmR5bl9pbXBvcnRzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICAgICAgICAgICAgICAgIHt9LFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4ubW9kdWxlX25hbWVzcGFjZV9hcnJcbiAgICAgICAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgYEZhaWxlZCBkeW5hbWljIGltcG9ydDogJHtlcnJ9LmA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXNvbHZlIHRoZXNlIHByb21pc2VzLlxuICAgICAgICBpbXBvcnRzX3Byb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZmlsbGJcIiwgZmFsc2UpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIE9uZSBvcHRpb24gZm9yIGEgZHluYW1pYyBwcm9ibGVtIGlzIHRvIHByb2R1Y2UgYSBzdGF0aWMgcHJvYmxlbSBieSBwcm92aWRpbmcgYSBmaXhlZCBzZWVkIHZhbHVlLiBUaGlzIGlzIHR5cGljYWxseSB1c2VkIHdoZW4gdGhlIGdvYWwgaXMgdG8gcmVuZGVyIHRoZSBwcm9ibGVtIGFzIGFuIGltYWdlIGZvciBpbmNsdXNpb24gaW4gc3RhdGljIGNvbnRlbnQgKGEgUERGLCBldGMuKS4gVG8gc3VwcG9ydCB0aGlzLCBjb25zaWRlciB0aGUgZm9sbG93aW5nIGNhc2VzOlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8vIENhc2UgIEhhcyBzdGF0aWMgc2VlZD8gIElzIGEgY2xpZW50LXNpZGUsIGR5bmFtaWMgcHJvYmxlbT8gIEhhcyBsb2NhbCBzZWVkPyAgUmVzdWx0XG4gICAgICAgICAgICAgICAgLy8vIDAgICAgIE5vICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgTm8gYWN0aW9uIG5lZWRlZC5cbiAgICAgICAgICAgICAgICAvLy8gMSAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpLlxuICAgICAgICAgICAgICAgIC8vLyAyICAgICBObyAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgICAgICAvLy8gMyAgICAgWWVzICAgICAgICAgICAgICAgTm8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWCAgICAgICAgICAgICAgICBXYXJuaW5nOiBzZWVkIGlnbm9yZWQuXG4gICAgICAgICAgICAgICAgLy8vIDQgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgQXNzaWduIHNlZWQ7IHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKS5cbiAgICAgICAgICAgICAgICAvLy8gNSAgICAgWWVzICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBJZiBzZWVkcyBkaWZmZXIsIGlzc3VlIHdhcm5pbmcuIE5vIGFkZGl0aW9uYWwgYWN0aW9uIG5lZWRlZCAtLSBwcm9ibGVtIGFscmVhZHkgcmVzdG9yZWQgZnJvbSBsb2NhbCBzdG9yYWdlLlxuXG4gICAgICAgICAgICAgICAgY29uc3QgaGFzX3N0YXRpY19zZWVkID0gZGljdF8uc3RhdGljX3NlZWQgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zdCBpc19jbGllbnRfZHluYW1pYyA9IHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc19sb2NhbF9zZWVkID0gdGhpcy5zZWVkICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDFcbiAgICAgICAgICAgICAgICBpZiAoIWhhc19zdGF0aWNfc2VlZCAmJiBpc19jbGllbnRfZHluYW1pYyAmJiAhaGFzX2xvY2FsX3NlZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZSAzXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoaGFzX3N0YXRpY19zZWVkICYmICFpc19jbGllbnRfZHluYW1pYykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIGlnbm9yZWQsIGJlY2F1c2UgaXQgb25seSBhZmZlY3RzIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW1zLlwiXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2UgNFxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBoYXNfc3RhdGljX3NlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNfY2xpZW50X2R5bmFtaWMgJiZcbiAgICAgICAgICAgICAgICAgICAgIWhhc19sb2NhbF9zZWVkXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2UgNVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICBoYXNfc3RhdGljX3NlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgaXNfY2xpZW50X2R5bmFtaWMgJiZcbiAgICAgICAgICAgICAgICAgICAgaGFzX2xvY2FsX3NlZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWVkICE9PSBkaWN0Xy5zdGF0aWNfc2VlZFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJXYXJuaW5nOiB0aGUgcHJvdmlkZWQgc3RhdGljIHNlZWQgd2FzIG92ZXJyaWRkZW4gYnkgdGhlIHNlZWQgZm91bmQgaW4gbG9jYWwgc3RvcmFnZS5cIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlcyAwIGFuZCAyXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBQcmlzbS5oaWdobGlnaHRBbGxVbmRlcih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgfVxuXG4gICAgLy8gRmluZCB0aGUgc2NyaXB0IHRhZyBjb250YWluaW5nIEpTT04gaW4gYSBnaXZlbiByb290IERPTSBub2RlLlxuICAgIHNjcmlwdFNlbGVjdG9yKHJvb3Rfbm9kZSkge1xuICAgICAgICByZXR1cm4gcm9vdF9ub2RlLnF1ZXJ5U2VsZWN0b3IoYHNjcmlwdFt0eXBlPVwiYXBwbGljYXRpb24vanNvblwiXWApO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gICBGdW5jdGlvbnMgZ2VuZXJhdGluZyBmaW5hbCBIVE1MICAgPT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZUZJVEJFbGVtZW50KCkge1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJJbnB1dCgpO1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJCdXR0b25zKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRklUQkZlZWRiYWNrRGl2KCk7XG4gICAgICAgIC8vIHJlcGxhY2VzIHRoZSBpbnRlcm1lZGlhdGUgSFRNTCBmb3IgdGhpcyBjb21wb25lbnQgd2l0aCB0aGUgcmVuZGVyZWQgSFRNTCBvZiB0aGlzIGNvbXBvbmVudFxuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG4gICAgcmVuZGVyRklUQklucHV0KCkge1xuICAgICAgICAvLyBUaGUgdGV4dCBbaW5wdXRdIGVsZW1lbnRzIGFyZSBjcmVhdGVkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIC8vIENyZWF0ZSBhbm90aGVyIGNvbnRhaW5lciB3aGljaCBzdG9yZXMgdGhlIHByb2JsZW0gZGVzY3JpcHRpb24uXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAvLyBDb3B5IHRoZSBvcmlnaW5hbCBlbGVtZW50cyB0byB0aGUgY29udGFpbmVyIGhvbGRpbmcgd2hhdCB0aGUgdXNlciB3aWxsIHNlZSAoY2xpZW50LXNpZGUgZ3JhZGluZyBvbmx5KS5cbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIC8vIFNhdmUgb3JpZ2luYWwgSFRNTCAod2l0aCB0ZW1wbGF0ZXMpIHVzZWQgaW4gZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGSVRCQnV0dG9ucygpIHtcbiAgICAgICAgLy8gXCJzdWJtaXRcIiBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9IHQoXCJtc2dfZml0Yl9jaGVja19tZVwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXN1Y2Nlc3NcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ubmFtZSA9IFwiZG8gYW5zd2VyXCI7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG5cbiAgICAgICAgLy8gXCJjb21wYXJlIG1lXCIgYnV0dG9uXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1kZWZhdWx0XCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uaWQgPSB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24ubmFtZSA9IFwiY29tcGFyZVwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19maXRiX2NvbXBhcmVfbWVcIik7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBhcmVGSVRCQW5zd2VycygpO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuY29tcGFyZUJ1dHRvbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSYW5kb21pemUgYnV0dG9uIGZvciBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICBpZiAodGhpcy5keW5fdmFycykge1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLWRlZmF1bHRcIjtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmlkID0gdGhpcy5vcmlnRWxlbS5pZCArIFwiX2Jjb21wXCI7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5uYW1lID0gXCJyYW5kb21pemVcIjtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19maXRiX3JhbmRvbWl6ZVwiKTtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJhbmRvbWl6ZUJ1dHRvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtcbiAgICB9XG4gICAgcmVuZGVyRklUQkZlZWRiYWNrRGl2KCkge1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGl2ZVwiLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwiYWxlcnRcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NMaXN0LmFkZChcImZpdGItZmVlZGJhY2tcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgIH1cblxuICAgIGNsZWFyRmVlZGJhY2tEaXYoKSB7XG4gICAgICAgIC8vIFNldHRpbmcgdGhlIGBgb3V0ZXJIVE1MYGAgcmVtb3ZlcyB0aGlzIGZyb20gdGhlIERPTS4gVXNlIGFuIGFsdGVybmF0aXZlIHByb2Nlc3MgLS0gcmVtb3ZlIHRoZSBjbGFzcyAod2hpY2ggbWFrZXMgaXQgcmVkL2dyZWVuIGJhc2VkIG9uIGdyYWRpbmcpIGFuZCBjb250ZW50LlxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJcIjtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgdGhlIHByb2JsZW0ncyBkZXNjcmlwdGlvbiBiYXNlZCBvbiBkeW5hbWljYWxseS1nZW5lcmF0ZWQgY29udGVudC5cbiAgICByZW5kZXJEeW5hbWljQ29udGVudCgpIHtcbiAgICAgICAgLy8gYGB0aGlzLmR5bl92YXJzYGAgY2FuIGJlIHRydWU7IGlmIHNvLCBkb24ndCByZW5kZXIgaXQsIHNpbmNlIHRoZSBzZXJ2ZXIgZG9lcyBhbGwgdGhlIHJlbmRlcmluZy5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBsZXQgaHRtbF9ub2RlcztcbiAgICAgICAgICAgIFtodG1sX25vZGVzLCB0aGlzLmR5bl92YXJzX2V2YWxdID0gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgICAgICAgICAgICAgdGhpcy5zZWVkLFxuICAgICAgICAgICAgICAgIHRoaXMuZHluX3ZhcnMsXG4gICAgICAgICAgICAgICAgdGhpcy5keW5faW1wb3J0cyxcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2Lm9yaWdJbm5lckhUTUwsXG4gICAgICAgICAgICAgICAgdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVDaGVja0Fuc3dlcnMuYmluZCh0aGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYucmVwbGFjZUNoaWxkcmVuKC4uLmh0bWxfbm9kZXMpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuZHluX3ZhcnNfZXZhbC5hZnRlckNvbnRlbnRSZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbC5hZnRlckNvbnRlbnRSZW5kZXIodGhpcy5keW5fdmFyc19ldmFsKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvciBpbiBwcm9ibGVtICR7dGhpcy5kaXZpZH0gaW52b2tpbmcgYWZ0ZXJDb250ZW50UmVuZGVyYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXR1cEJsYW5rcygpIHtcbiAgICAgICAgLy8gRmluZCBhbmQgZm9ybWF0IHRoZSBibGFua3MuIElmIGEgZHluYW1pYyBwcm9ibGVtIGp1c3QgY2hhbmdlZCB0aGUgSFRNTCwgdGhpcyB3aWxsIGZpbmQgdGhlIG5ld2x5LWNyZWF0ZWQgYmxhbmtzLlxuICAgICAgICAvLyBXQVJOSU5HIC0gdGhpcyBhc3N1bWVzIHRoYXQgYWxsIHRleHQvbnVtYmVyIGlucHV0cyBpbiB0aGUgZGVzY3JpcHRpb25EaXYgYXJlIHRoZSBibGFua3MuXG4gICAgICAgIC8vIElkZWFsbHksIHRoZXJlIHNob3VsZCBiZSBzb21lIHVuaXF1ZSBhdHRyaWJ1dGUgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWxlY3QgdGhlIGJsYW5rcy5cbiAgICAgICAgY29uc3QgYmEgPSB0aGlzLmRlc2NyaXB0aW9uRGl2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdLGlucHV0W3R5cGU9XCJudW1iZXJcIl0nKTtcbiAgICAgICAgYmEuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IFwiZm9ybSBmb3JtLWNvbnRyb2wgc2VsZWN0d2lkdGhhdXRvXCI7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxhYmVsXCIsIFwiaW5wdXQgYXJlYVwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYmxhbmtBcnJheSA9IEFycmF5LmZyb20oYmEpO1xuICAgICAgICBmb3IgKGxldCBibGFuayBvZiB0aGlzLmJsYW5rQXJyYXkpIHtcbiAgICAgICAgICAgIGJsYW5rLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgdGhpcy5yZWNvcmRBbnN3ZXJlZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRoaXMgdGVsbHMgdGltZWQgcXVlc3Rpb25zIHRoYXQgdGhlIGZpdGIgYmxhbmtzIHJlY2VpdmVkIHNvbWUgaW50ZXJhY3Rpb24uXG4gICAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9sb2FkaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIHRoZSBzZWVkIGZpcnN0LCBzaW5jZSB0aGUgZHluYW1pYyByZW5kZXIgY2xlYXJzIGFsbCB0aGUgYmxhbmtzLlxuICAgICAgICB0aGlzLnNlZWQgPSBkYXRhLnNlZWQ7XG4gICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG5cbiAgICAgICAgdmFyIGFycjtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlLlxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gVGhlIG5ld2VyIGZvcm1hdCBlbmNvZGVzIGRhdGEgYXMgYSBKU09OIG9iamVjdC5cbiAgICAgICAgICAgIGFyciA9IEpTT04ucGFyc2UoZGF0YS5hbnN3ZXIpO1xuICAgICAgICAgICAgLy8gVGhlIHJlc3VsdCBzaG91bGQgYmUgYW4gYXJyYXkuIElmIG5vdCwgdHJ5IGNvbW1hIHBhcnNpbmcgaW5zdGVhZC5cbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gVGhlIG9sZCBmb3JtYXQgZGlkbid0LlxuICAgICAgICAgICAgYXJyID0gKGRhdGEuYW5zd2VyIHx8IFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaGFzQW5zd2VyID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUgPSBhcnJbaV0gfHwgXCJcIjtcbiAgICAgICAgICAgIGlmIChhcnJbaV0pIHtcbiAgICAgICAgICAgICAgICBoYXNBbnN3ZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElzIHRoaXMgY2xpZW50LXNpZGUgZ3JhZGluZywgb3Igc2VydmVyLXNpZGUgZ3JhZGluZz9cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gRm9yIGNsaWVudC1zaWRlIGdyYWRpbmcsIHJlLWdlbmVyYXRlIGZlZWRiYWNrIGlmIHRoZXJlJ3MgYW4gYW5zd2VyLlxuICAgICAgICAgICAgaWYgKGhhc0Fuc3dlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZ3JhZGluZywgdXNlIHRoZSBwcm92aWRlZCBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIgb3IgbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBkYXRhLmRpc3BsYXlGZWVkO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IGRhdGEuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAgICAgICAvLyBPbmx5IHJlbmRlciBpZiBhbGwgdGhlIGRhdGEgaXMgcHJlc2VudDsgbG9jYWwgc3RvcmFnZSBtaWdodCBoYXZlIG9sZCBkYXRhIG1pc3Npbmcgc29tZSBvZiB0aGVzZSBpdGVtcy5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5kaXNwbGF5RmVlZCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiB0aGlzLmNvcnJlY3QgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5pc0NvcnJlY3RBcnJheSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRm9yIHNlcnZlci1zaWRlIGR5bmFtaWMgcHJvYmxlbXMsIHNob3cgdGhlIHJlbmRlcmVkIHByb2JsZW0gdGV4dC5cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkYXRhLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIC8vIExvYWRzIHByZXZpb3VzIGFuc3dlcnMgZnJvbSBsb2NhbCBzdG9yYWdlIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBwYXJzaW5nIHN0b3JlZCBGSVRCIGRhdGEgZm9yICR7dGhpcy5kaXZpZH06ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JlZERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gW107XG4gICAgICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcuZW5hYmxlQ29tcGFyZU1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHcmFkZSBsb2NhbGx5IGlmIHdlIGNhbid0IGFzayB0aGUgc2VydmVyIHRvIGdyYWRlLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgLy8gQW4gYXJyYXkgb2YgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgICAgICAgICAgdGhpcy5wZXJjZW50LFxuICAgICAgICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5wdXRzOlxuICAgIC8vXG4gICAgLy8gLSBTdHJpbmdzIGVudGVyZWQgYnkgdGhlIHN0dWRlbnQgaW4gYGB0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWVgYC5cbiAgICAvLyAtIEZlZWRiYWNrIGluIGBgdGhpcy5mZWVkYmFja0FycmF5YGAuXG4gICAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2Fyci5wdXNoKHRoaXMuYmxhbmtBcnJheVtpXS52YWx1ZSk7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzLmJsYW5rTmFtZXMsXG4gICAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tBcnJheSxcbiAgICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgXTtcbiAgICB9XG5cbiAgICAvLyBfYHJhbmRvbWl6ZWA6IFRoaXMgaGFuZGxlcyBhIGNsaWNrIHRvIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbi5cbiAgICBhc3luYyByYW5kb21pemUoKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50LXNpZGUgY2FzZSBvciB0aGUgc2VydmVyLXNpZGUgY2FzZT9cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gU2VuZCBhIHJlcXVlc3QgdG8gdGhlIGByZXN1bHRzIDxnZXRBc3Nlc3NSZXN1bHRzPmAgZW5kcG9pbnQgd2l0aCBgYG5ld19zZWVkYGAgc2V0IHRvIFRydWUuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgICAgICAgICAgICAgICAgc2lkOiB0aGlzLnNpZCxcbiAgICAgICAgICAgICAgICAgICAgbmV3X3NlZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5qc29uSGVhZGVycyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgICAgICBhbGVydChgSFRUUCBlcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgY29uc3QgcmVzID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICB0aGlzLnNlZWQgPSByZXMuc2VlZDtcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gcmVzLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2hlbiBnZXR0aW5nIGEgbmV3IHNlZWQsIGNsZWFyIGFsbCB0aGUgb2xkIGFuc3dlcnMgYW5kIGZlZWRiYWNrLlxuICAgICAgICB0aGlzLmdpdmVuX2FyciA9IEFycmF5KHRoaXMuYmxhbmtBcnJheS5sZW4pLmZpbGwoXCJcIik7XG4gICAgICAgIHRoaXMuYmxhbmtBcnJheS5mb3JFYWNoKChlbCkgPT4gKGVsLnZhbHVlID0gXCJcIikpO1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2tEaXYoKTtcbiAgICAgICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gICAgfVxuXG4gICAgLy8gU2F2ZSB0aGUgYW5zd2VycyBhbmQgYXNzb2NpYXRlZCBkYXRhIGxvY2FsbHk7IGRvbid0IHNhdmUgZmVlZGJhY2sgcHJvdmlkZWQgYnkgdGhlIHNlcnZlciBmb3IgdGhpcyBhbnN3ZXIuIEl0IGFzc3VtZXMgdGhhdCBgYHRoaXMuZ2l2ZW5fYXJyYGAgY29udGFpbnMgdGhlIGN1cnJlbnQgYW5zd2Vycy5cbiAgICBzYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCkge1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICAvLyBUaGUgc2VlZCBpcyB1c2VkIGZvciBjbGllbnQtc2lkZSBvcGVyYXRpb24sIGJ1dCBkb2Vzbid0IG1hdHRlciBmb3Igc2VydmVyLXNpZGUuXG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2l2ZW5fYXJyKSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgb25seSBuZWVkZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcgd2l0aCBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgcHJvYmxlbUh0bWw6IHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBfYGxvZ0N1cnJlbnRBbnN3ZXJgOiBTYXZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9ibGVtIHRvIGxvY2FsIHN0b3JhZ2UgYW5kIHRoZSBzZXJ2ZXI7IGRpc3BsYXkgc2VydmVyIGZlZWRiYWNrLlxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2Fycik7XG4gICAgICAgIGxldCBmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIC8vIFNhdmUgdGhlIGFuc3dlciBsb2NhbGx5LlxuICAgICAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICAgICAgLy8gU2F2ZSB0aGUgYW5zd2VyIHRvIHRoZSBzZXJ2ZXIuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBhbnN3ZXIgfHwgXCJcIixcbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyIHx8IFwiXCIsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgICAgICAgcGVyY2VudDogdGhpcy5wZXJjZW50LFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgICAgICBmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHNlcnZlcl9kYXRhID0gYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgICAgIGlmICghZmVlZGJhY2spIHJldHVybjtcbiAgICAgICAgLy8gTm9uLXNlcnZlciBzaWRlIGdyYWRlZCBwcm9ibGVtcyBhcmUgZG9uZSBhdCB0aGlzIHBvaW50OyBsaWtld2lzZSwgc3RvcCBoZXJlIGlmIHRoZSBzZXJ2ZXIgZGlkbid0IHJlc3BvbmQuXG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkgfHwgIXNlcnZlcl9kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLiBPbiBzdWNjZXNzLCB1cGRhdGUgdGhlIGZlZWRiYWNrIGZyb20gdGhlIHNlcnZlcidzIGdyYWRlLlxuICAgICAgICBjb25zdCByZXMgPSBzZXJ2ZXJfZGF0YS5kZXRhaWw7XG4gICAgICAgIHRoaXMudGltZXN0YW1wID0gcmVzLnRpbWVzdGFtcDtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IHJlcy5kaXNwbGF5RmVlZDtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gcmVzLmNvcnJlY3Q7XG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSByZXMuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aGlzLnRpbWVzdGFtcCxcbiAgICAgICAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICAgICAgICAgIGRpc3BsYXlGZWVkOiB0aGlzLmRpc3BsYXlGZWVkLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXk6IHRoaXMuaXNDb3JyZWN0QXJyYXksXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgIHJldHVybiBzZXJ2ZXJfZGF0YTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBFdmFsdWF0aW9uIG9mIGFuc3dlciBhbmQgPT09XG4gICAgPT09ICAgICBkaXNwbGF5IGZlZWRiYWNrICAgICA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mbyBmaXRiLWZlZWRiYWNrXCI7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtqXS5jbGFzc0xpc3QucmVtb3ZlKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdEFycmF5W2pdICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtqXS5jbGFzc0xpc3QuYWRkKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbal0uY2xhc3NMaXN0LnJlbW92ZShcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWRhbmdlciBmaXRiLWZlZWRiYWNrXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGZlZWRiYWNrX2h0bWwgPSBcIjx1bD5cIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGYgPSB0aGlzLmRpc3BsYXlGZWVkW2ldO1xuICAgICAgICAgICAgbGV0IGZtID0gKHRoaXMuaXNDb3JyZWN0QXJyYXlbaV0gPT09IHRydWUpID8gJ+KclO+4jycgOiAn4pyW77iPJztcbiAgICAgICAgICAgIC8vIFJlbmRlciBhbnkgZHluYW1pYyBmZWVkYmFjayBpbiB0aGUgcHJvdmlkZWQgZmVlZGJhY2ssIGZvciBjbGllbnQtc2lkZSBncmFkaW5nIG9mIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMuZHluX3ZhcnMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBkZiA9IHJlbmRlckR5bmFtaWNGZWVkYmFjayhcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua05hbWVzLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICAgICAgICAgICAgaSxcbiAgICAgICAgICAgICAgICAgICAgZGYsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgcmV0dXJuZWQgTm9kZUxpc3QgaW50byBhIHN0cmluZyBvZiBIVE1MLlxuICAgICAgICAgICAgICAgIGRmID0gKGRmPy5bMF0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgPyBkZlswXS5wYXJlbnRFbGVtZW50LmlubmVySFRNTFxuICAgICAgICAgICAgICAgICAgICA6IFwiTm8gZmVlZGJhY2sgcHJvdmlkZWRcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZlZWRiYWNrX2h0bWwgKz0gYDxsaT4ke2ZtfSAke2RmfTwvbGk+YDtcbiAgICAgICAgfVxuICAgICAgICBmZWVkYmFja19odG1sICs9IFwiPC91bD5cIjtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBsaXN0IGlmIGl0J3MganVzdCBvbmUgZWxlbWVudC5cbiAgICAgICAgaWYgKHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrX2h0bWwgPSBmZWVkYmFja19odG1sLnNsaWNlKFxuICAgICAgICAgICAgICAgIFwiPHVsPjxsaT5cIi5sZW5ndGgsXG4gICAgICAgICAgICAgICAgLVwiPC9saT48L3VsPlwiLmxlbmd0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IGZlZWRiYWNrX2h0bWw7XG4gICAgICAgIGlmICh0eXBlb2YgTWF0aEpheCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gRnVuY3Rpb25zIGZvciBjb21wYXJlIGJ1dHRvbiA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBlbmFibGVDb21wYXJlQnV0dG9uKCkge1xuICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gX2Bjb21wYXJlRklUQkFuc3dlcnNgXG4gICAgYXN5bmMgY29tcGFyZUZJVEJBbnN3ZXJzKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIGRhdGEuY291cnNlID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhkYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBmZXRjaChgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXR0b3AxMEFuc3dlcnM/JHtwYXJhbXMudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXNwLmpzb24oKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUZJVEIoanNvbik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyB0b3AgYW5zd2VyczpcIiwgZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGFyZUZJVEIoZGF0YSwgc3RhdHVzLCB3aGF0ZXZlcikge1xuICAgICAgICB2YXIgYW5zd2VycyA9IGRhdGEuZGV0YWlsLnJlcztcbiAgICAgICAgdmFyIG1pc2MgPSBkYXRhLmRldGFpbC5taXNjZGF0YTtcbiAgICAgICAgdmFyIGJvZHkgPSBcIjx0YWJsZT5cIjtcbiAgICAgICAgYm9keSArPSBcIjx0cj48dGg+QW5zd2VyPC90aD48dGg+Q291bnQ8L3RoPjwvdHI+XCI7XG4gICAgICAgIGZvciAodmFyIHJvdyBpbiBhbnN3ZXJzKSB7XG4gICAgICAgICAgICBib2R5ICs9XG4gICAgICAgICAgICAgICAgXCI8dHI+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzW3Jvd10uYW5zd2VyICtcbiAgICAgICAgICAgICAgICBcIjwvdGQ+PHRkPlwiICtcbiAgICAgICAgICAgICAgICBhbnN3ZXJzW3Jvd10uY291bnQgK1xuICAgICAgICAgICAgICAgIFwiIHRpbWVzPC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgICAgICB2YXIgaHRtbCA9XG4gICAgICAgICAgICBcIjxkaXYgY2xhc3M9J21vZGFsIGZhZGUnPlwiICtcbiAgICAgICAgICAgIFwiICAgIDxkaXYgY2xhc3M9J21vZGFsLWRpYWxvZyBjb21wYXJlLW1vZGFsJz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtY29udGVudCc+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1oZWFkZXInPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT0nYnV0dG9uJyBjbGFzcz0nY2xvc2UnIGFyaWEtaGlkZGVuPSd0cnVlJz4mdGltZXM7PC9idXR0b24+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPGg0IGNsYXNzPSdtb2RhbC10aXRsZSc+VG9wIEFuc3dlcnM8L2g0PlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1ib2R5Jz5cIiArXG4gICAgICAgICAgICBib2R5ICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiPC9kaXY+XCI7XG4gICAgICAgIC8vIFNpbXBsZSBtb2RhbCB3aXRob3V0IEJvb3RzdHJhcC9qUXVlcnlcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuaW5zZXQgPSBcIjBcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZ2JhKDAsMCwwLDAuNSlcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS56SW5kZXggPSBcIjk5OTlcIjtcblxuICAgICAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaWFsb2cuY2xhc3NOYW1lID0gXCJjb21wYXJlLW1vZGFsXCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5tYXhXaWR0aCA9IFwiNzIwcHhcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLm1hcmdpbiA9IFwiMTB2aCBhdXRvXCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjZmZmXCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5ib3JkZXJSYWRpdXMgPSBcIjZweFwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYm94U2hhZG93ID0gXCIwIDJweCAxMnB4IHJnYmEoMCwwLDAsMC4zKVwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUucGFkZGluZyA9IFwiMTZweFwiO1xuXG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnN0IGNsb3NlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgY2xvc2VCdG4udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIGNsb3NlQnRuLnRleHRDb250ZW50ID0gXCLDl1wiO1xuICAgICAgICBjbG9zZUJ0bi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgIGNsb3NlQnRuLnN0eWxlLmZsb2F0ID0gXCJyaWdodFwiO1xuICAgICAgICBjbG9zZUJ0bi5jbGFzc05hbWUgPSBcImJ0biBidG4tbGlnaHRcIjtcbiAgICAgICAgY2xvc2VCdG4ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQob3ZlcmxheSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcIm1vZGFsLXRpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJUb3AgQW5zd2Vyc1wiO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQoY2xvc2VCdG4pO1xuICAgICAgICBoZWFkZXIuYXBwZW5kQ2hpbGQodGl0bGUpO1xuXG4gICAgICAgIGNvbnN0IG1vZGFsQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG1vZGFsQm9keS5pbm5lckhUTUwgPSBib2R5O1xuXG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobW9kYWxCb2R5KTtcbiAgICAgICAgb3ZlcmxheS5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG92ZXJsYXkpO1xuICAgIH1cblxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYmxhbmtBcnJheVtpXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudFxuICAgICAgICAucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudD1maWxsaW50aGVibGFua11cIilcbiAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICAgICAgb3JpZzogZWwsXG4gICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICghZWwuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgRklUQkxpc3RbZWwuaWRdID0gbmV3IEZJVEIob3B0cyk7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWwuaWRdID0gRklUQkxpc3RbZWwuaWRdO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYEVycm9yIHJlbmRlcmluZyBGaWxsIGluIHRoZSBCbGFuayBQcm9ibGVtICR7ZWwuaWR9XG4gICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgbG9hZCB9IGZyb20gXCIuLi8uLi9jb21tb24vanMvcnNpMThuLmpzXCI7XG5cbmxvYWQoe1xuICAgIFwic3ItQ3lybFwiOiB7XG4gICAgICAgIG1zZ19ub19hbnN3ZXI6IFwi0J3QtdC+0LTQs9C+0LLQvtGA0LXQvdC+LlwiLFxuICAgICAgICBtc2dfZml0Yl9jaGVja19tZTogXCLQn9GA0L7QstC10YDQuFwiLFxuICAgICAgICBtc2dfZml0Yl9jb21wYXJlX21lOiBcItCj0L/QvtGA0LXQtNC4XCIsXG4gICAgfSxcbn0pO1xuIiwiLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIHxkb2NuYW1lfCAtIGdyYWRpbmctcmVsYXRlZCB1dGlsaXRpZXMgZm9yIEZJVEIgcXVlc3Rpb25zXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhpcyBjb2RlIHJ1bnMgYm90aCBvbiB0aGUgc2VydmVyIChmb3Igc2VydmVyLXNpZGUgZ3JhZGluZykgYW5kIG9uIHRoZSBjbGllbnQuIEl0J3MgcGxhY2VkIGhlcmUgYXMgYSBzZXQgb2YgZnVuY3Rpb25zIHNwZWNpZmljYWxseSBmb3IgdGhpcyBwdXJwb3NlLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IHsgYWxlYVBSTkcgfSBmcm9tIFwiLi9saWJzL2FsZWFQUk5HLTEuMS5qc1wiO1xuXG4vLyBJbmNsdWRlc1xuLy8gPT09PT09PT1cbi8vIE5vbmUuXG4vL1xuLy9cbi8vIEdsb2JhbHNcbi8vID09PT09PT1cbmZ1bmN0aW9uIHJlbmRlcl9odG1sKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBDaGFuZ2UgdGhlIHJlcGxhY2VtZW50IHRva2VucyBpbiB0aGUgSFRNTCBpbnRvIHRhZ3MsIHNvIHdlIGNhbiByZXBsYWNlIHRoZW0gdXNpbmcgWE1MLiBUaGUgaG9ycmlibGUgcmVnZXggaXM6XG4gICAgLy9cbiAgICAvLyBMb29rIGZvciB0aGUgY2hhcmFjdGVycyBgYFslPWBgICh0aGUgb3BlbmluZyBkZWxpbWl0ZXIpXG4gICAgLy8vIFxcWyU9XG4gICAgLy8gRm9sbG93ZWQgYnkgYW55IGFtb3VudCBvZiB3aGl0ZXNwYWNlLlxuICAgIC8vLyBcXHMqXG4gICAgLy8gU3RhcnQgYSBncm91cCB0aGF0IHdpbGwgY2FwdHVyZSB0aGUgY29udGVudHMgKGV4Y2x1ZGluZyB3aGl0ZXNwYWNlKSBvZiB0aGUgdG9rZW5zLiBGb3IgZXhhbXBsZSwgZ2l2ZW4gYGBbJT0gZm9vKCkgJV1gYCwgdGhlIGNvbnRlbnRzIGlzIGBgZm9vKClgYC5cbiAgICAvLy8gKFxuICAgIC8vIERvbid0IGNhcHR1cmUgdGhlIGNvbnRlbnRzIG9mIHRoaXMgZ3JvdXAsIHNpbmNlIGl0J3Mgb25seSBhIHNpbmdsZSBjaGFyYWN0ZXIuIE1hdGNoIGFueSBjaGFyYWN0ZXIuLi5cbiAgICAvLy8gKFxuICAgIC8vLyA/Oi5cbiAgICAvLy8gLi4udGhhdCBkb2Vzbid0IGVuZCB3aXRoIGBgJV1gYCAodGhlIGNsb3NpbmcgZGVsaW1pdGVyKS5cbiAgICAvLy8gKD8hJV0pXG4gICAgLy8vIClcbiAgICAvLyBNYXRjaCB0aGlzIChhbnl0aGluZyBidXQgdGhlIGNsb3NpbmcgZGVsaW1pdGVyKSBhcyBtdWNoIGFzIHdlIGNhbi5cbiAgICAvLy8gKilcbiAgICAvLyBOZXh0LCBsb29rIGZvciBhbnkgd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIEZpbmFsbHksIGxvb2sgZm9yIHRoZSBjbG9zaW5nIGRlbGltaXRlciBgYCVdYGAuXG4gICAgLy8vICVcXF1cbiAgICBjb25zdCBodG1sX3JlcGxhY2VkID0gaHRtbF9pbi5yZXBsYWNlQWxsKFxuICAgICAgICAvXFxbJT1cXHMqKCg/Oi4oPyElXSkpKilcXHMqJVxcXS9nLFxuICAgICAgICAvLyBSZXBsYWNlIGl0IHdpdGggYSBgPHNjcmlwdC1ldmFsPmAgdGFnLiBRdW90ZSB0aGUgc3RyaW5nLCB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLCB1c2luZyBKU09OLlxuICAgICAgICAobWF0Y2gsIGdyb3VwMSkgPT5cbiAgICAgICAgICAgIGA8c2NyaXB0LWV2YWwgZXhwcj0ke0pTT04uc3RyaW5naWZ5KGdyb3VwMSl9Pjwvc2NyaXB0LWV2YWw+YFxuICAgICk7XG4gICAgLy8gR2l2ZW4gSFRNTCwgdHVybiBpdCBpbnRvIGEgRE9NLiBXYWxrIHRoZSBgYDxzY3JpcHQtZXZhbD5gYCB0YWdzLCBwZXJmb3JtaW5nIHRoZSByZXF1ZXN0ZWQgZXZhbHVhdGlvbiBvbiB0aGVtLlxuICAgIC8vXG4gICAgLy8gU2VlIGBET01QYXJzZXIgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01QYXJzZXI+YF8uXG4gICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyLnBhcnNlRnJvbVN0cmluZygpIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyL3BhcnNlRnJvbVN0cmluZz5gXy5cbiAgICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKGh0bWxfcmVwbGFjZWQsIFwidGV4dC9odG1sXCIpO1xuICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZ3MgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHQtZXZhbFwiKTtcbiAgICB3aGlsZSAoc2NyaXB0X2V2YWxfdGFncy5sZW5ndGgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBmaXJzdCB0YWcuIEl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBjb2xsZWN0aW9uIGFmdGVyIGl0J3MgcmVwbGFjZWQgd2l0aCBpdHMgdmFsdWUuXG4gICAgICAgIGNvbnN0IHNjcmlwdF9ldmFsX3RhZyA9IHNjcmlwdF9ldmFsX3RhZ3NbMF07XG4gICAgICAgIC8vIFNlZSBpZiB0aGlzIGBgPHNjcmlwdC1ldmFsPmBgIHRhZyBoYXMgYXMgYGBAZXhwcmBgIGF0dHJpYnV0ZS5cbiAgICAgICAgY29uc3QgZXhwciA9IHNjcmlwdF9ldmFsX3RhZy5nZXRBdHRyaWJ1dGUoXCJleHByXCIpO1xuICAgICAgICAvLyBJZiBzbywgZXZhbHVhdGUgaXQuXG4gICAgICAgIGlmIChleHByKSB7XG4gICAgICAgICAgICBjb25zdCBldmFsX3Jlc3VsdCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICBcInZcIixcbiAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICBgXCJ1c2Ugc3RyaWN0O1wiXFxucmV0dXJuICR7ZXhwcn07YFxuICAgICAgICAgICAgKShkeW5fdmFyc19ldmFsLCAuLi5PYmplY3QudmFsdWVzKGR5bl92YXJzX2V2YWwpKTtcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHRhZyB3aXRoIHRoZSByZXN1bHRpbmcgdmFsdWUuXG4gICAgICAgICAgICBzY3JpcHRfZXZhbF90YWcucmVwbGFjZVdpdGgoZXZhbF9yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBib2R5IGNvbnRlbnRzLiBOb3RlIHRoYXQgdGhlIGBgRE9NUGFyc2VyYGAgY29uc3RydWN0cyBhbiBlbnRpcmUgZG9jdW1lbnQsIG5vdCBqdXN0IHRoZSBkb2N1bWVudCBmcmFnbWVudCB3ZSBwYXNzZWQgaXQuIFRoZXJlZm9yZSwgZXh0cmFjdCB0aGUgZGVzaXJlZCBmcmFnbWVudCBhbmQgcmV0dXJuIHRoYXQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIHVzZSBgY2hpbGROb2RlcyA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvY2hpbGROb2Rlcz5gXywgd2hpY2ggaW5jbHVkZXMgbm9uLWVsZW1lbnQgY2hpbGRyZW4gbGlrZSB0ZXh0IGFuZCBjb21tZW50czsgdXNpbmcgYGBjaGlsZHJlbmBgIG9taXRzIHRoZXNlIG5vbi1lbGVtZW50IGNoaWxkcmVuLlxuICAgIHJldHVybiBkb2MuYm9keS5jaGlsZE5vZGVzO1xufVxuXG4vLyBGdW5jdGlvbnNcbi8vID09PT09PT09PVxuLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgc2VlZCxcbiAgICBkeW5fdmFycyxcbiAgICBkeW5faW1wb3J0cyxcbiAgICBodG1sX2luLFxuICAgIGRpdmlkLFxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnNcbikge1xuICAgIC8vIEluaXRpYWxpemUgUk5HIHdpdGggYGBzZWVkYGAuXG4gICAgY29uc3QgcmFuZCA9IGFsZWFQUk5HKHNlZWQpO1xuXG4gICAgLy8gU2VlIGBSQU5EX0ZVTkMgPFJBTkRfRlVOQz5gXywgd2hpY2ggcmVmZXJzIHRvIGBgcmFuZGBgIGFib3ZlLlxuICAgIGNvbnN0IGR5bl92YXJzX2V2YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgIFwidlwiLFxuICAgICAgICBcInJhbmRcIixcbiAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX2ltcG9ydHMpLFxuICAgICAgICBgXCJ1c2Ugc3RyaWN0XCI7XFxuJHtkeW5fdmFyc307XFxucmV0dXJuIHY7YFxuICAgICkoXG4gICAgICAgIC8vIFdlIHdhbnQgdi5kaXZpZCA9IGRpdmlkIGFuZCB2LnByZXBhcmVDaGVja0Fuc3dlcnMgPSBwcmVwYXJlQ2hlY2tBbnN3ZXJzLiBJbiBjb250cmFzdCwgdGhlIGtleS92YWx1ZXMgcGFpcnMgb2YgZHluX2ltcG9ydHMgc2hvdWxkIGJlIGRpcmVjdGx5IGFzc2lnbmVkIHRvIHYsIGhlbmNlIHRoZSBPYmplY3QuYXNzaWduLlxuICAgICAgICBPYmplY3QuYXNzaWduKHsgZGl2aWQsIHByZXBhcmVDaGVja0Fuc3dlcnN9LCBkeW5faW1wb3J0cyksXG4gICAgICAgIHJhbmQsXG4gICAgICAgIC8vIEluIGFkZGl0aW9uIHRvIHByb3ZpZGluZyB0aGlzIGluIHYsIG1ha2UgaXQgYXZhaWxhYmxlIGluIHRoZSBmdW5jdGlvbiBhcyB3ZWxsLCBzaW5jZSBtb3N0IHByb2JsZW0gYXV0aG9ycyB3aWxsIHdyaXRlIGBgZm9vID0gbmV3IEJUTSgpYGAgKGZvciBleGFtcGxlLCBhc3N1bWluZyBCVE0gaXMgaW4gZHluX2ltcG9ydHMpIGluc3RlYWQgb2YgYGBmb28gPSBuZXcgdi5CVE0oKWBgICh3aGljaCBpcyB1bnVzdWFsIHN5bnRheCkuXG4gICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX2ltcG9ydHMpKTtcblxuICAgIGxldCBodG1sX291dDtcbiAgICBpZiAodHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIoZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsXG4gICAgICAgICAgICAgICAgYEVycm9yIGluIHByb2JsZW0gJHtkaXZpZH0gaW52b2tpbmcgYmVmb3JlQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaHRtbF9vdXQgPSByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciByZW5kZXJpbmcgcHJvYmxlbSAke2RpdmlkfSB0ZXh0LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgLy8gdGhlIGFmdGVyQ29udGVudFJlbmRlciBldmVudCB3aWxsIGJlIGNhbGxlZCBieSB0aGUgY2FsbGVyIG9mIHRoaXMgZnVuY3Rpb24gKGFmdGVyIGl0IHVwZGF0ZWQgdGhlIEhUTUwgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGh0bWxfb3V0KS5cbiAgICByZXR1cm4gW2h0bWxfb3V0LCBkeW5fdmFyc19ldmFsXTtcbn1cblxuLy8gR2l2ZW4gc3R1ZGVudCBhbnN3ZXJzLCBncmFkZSB0aGVtIGFuZCBwcm92aWRlIGZlZWRiYWNrLlxuLy9cbi8vIE91dHB1dHM6XG4vL1xuLy8gLSAgICBgYGRpc3BsYXlGZWVkYGAgaXMgYW4gYXJyYXkgb2YgSFRNTCBmZWVkYmFjay5cbi8vIC0gICAgYGBpc0NvcnJlY3RBcnJheWBgIGlzIGFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBjb3JyZWN0YGAgaXMgdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuLy8gLSAgICBgYHBlcmNlbnRgYCBpcyB0aGUgcGVyY2VudGFnZSBvZiBjb3JyZWN0IGFuc3dlcnMgKGZyb20gMCB0byAxLCBub3QgMCB0byAxMDApLlxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQW5zd2Vyc0NvcmUoXG4gICAgLy8gX2BibGFua05hbWVzRGljdGA6IEFuIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGJsYW5rX2luZGV4fSBzcGVjaWZ5aW5nIHRoZSBuYW1lIGZvciBlYWNoIG5hbWVkIGJsYW5rLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIF9gZ2l2ZW5fYXJyYDogQW4gYXJyYXkgb2Ygc3RyaW5ncyBjb250YWluaW5nIHN0dWRlbnQtcHJvdmlkZWQgYW5zd2VycyBmb3IgZWFjaCBibGFuay5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gQSAyLUQgYXJyYXkgb2Ygc3RyaW5ncyBnaXZpbmcgZmVlZGJhY2sgZm9yIGVhY2ggYmxhbmsuXG4gICAgZmVlZGJhY2tBcnJheSxcbiAgICAvLyBfYGR5bl92YXJzX2V2YWxgOiBBIGRpY3QgcHJvZHVjZWQgYnkgZXZhbHVhdGluZyB0aGUgSmF2YVNjcmlwdCBmb3IgYSBkeW5hbWljIGV4ZXJjaXNlLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIGlmIChcbiAgICAgICAgZHluX3ZhcnNfZXZhbCAmJlxuICAgICAgICB0eXBlb2YgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBiZWZvcmVDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBLZWVwIHRyYWNrIGlmIGFsbCBhbnN3ZXJzIGFyZSBjb3JyZWN0IG9yIG5vdC5cbiAgICBsZXQgY29ycmVjdCA9IHRydWU7XG4gICAgY29uc3QgaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICBjb25zdCBkaXNwbGF5RmVlZCA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ2l2ZW5fYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGdpdmVuID0gZ2l2ZW5fYXJyW2ldO1xuICAgICAgICAvLyBJZiB0aGlzIGJsYW5rIGlzIGVtcHR5LCBwcm92aWRlIG5vIGZlZWRiYWNrIGZvciBpdC5cbiAgICAgICAgaWYgKGdpdmVuID09PSBcIlwiKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKG51bGwpO1xuICAgICAgICAgICAgLy8gVE9ETzogc2hvdWxkIGJlIGxvY2FsaXplZCwgZS5nLiB0KFwibXNnX25vX2Fuc3dlclwiKS5cbiAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXCJObyBhbnN3ZXIgcHJvdmlkZWQuXCIpO1xuICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTG9vayB0aHJvdWdoIGFsbCBmZWVkYmFjayBmb3IgdGhpcyBibGFuay4gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkgYWx3YXlzIG1hdGNoZXMuIElmIG5vIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rIGV4aXN0cywgdXNlIGFuIGVtcHR5IGxpc3QuXG4gICAgICAgICAgICBjb25zdCBmYmwgPSBmZWVkYmFja0FycmF5W2ldIHx8IFtdO1xuICAgICAgICAgICAgbGV0IGo7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmJsLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGxhc3QgaXRlbSBvZiBmZWVkYmFjayBhbHdheXMgbWF0Y2hlcy5cbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gZmJsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgcmVnZXhwLi4uXG4gICAgICAgICAgICAgICAgaWYgKFwicmVnZXhcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGF0dCA9IFJlZ0V4cChcbiAgICAgICAgICAgICAgICAgICAgICAgIGZibFtqXVtcInJlZ2V4XCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmJsW2pdW1wicmVnZXhGbGFnc1wiXVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGF0dC50ZXN0KGdpdmVuKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJudW1iZXJcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhpcyBpcyBhIG51bWJlci5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW21pbiwgbWF4XSA9IGZibFtqXVtcIm51bWJlclwiXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udmVydCB0aGUgZ2l2ZW4gc3RyaW5nIHRvIGEgbnVtYmVyLiBXaGlsZSB0aGVyZSBhcmUgYGxvdHMgb2Ygd2F5cyA8aHR0cHM6Ly9jb2RlcndhbGwuY29tL3AvNXRsaG13L2NvbnZlcnRpbmctc3RyaW5ncy10by1udW1iZXItaW4tamF2YXNjcmlwdC1waXRmYWxscz5gXyB0byBkbyB0aGlzOyB0aGlzIHZlcnNpb24gc3VwcG9ydHMgb3RoZXIgYmFzZXMgKGhleC9iaW5hcnkvb2N0YWwpIGFzIHdlbGwgYXMgZmxvYXRzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWwgPSArZ2l2ZW47XG4gICAgICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPj0gbWluICYmIGFjdHVhbCA8PSBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgZHluYW1pYyBzb2x1dGlvbiwgdGhleSBzaG91bGQgcHJvdmlkZSBhIHRlc3RpbmcgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGR5bl92YXJzX2V2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlQW5zd2VycyhibGFua05hbWVzRGljdCwgZ2l2ZW5fYXJyLCBkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGEgcGFyc2UgZXJyb3IsIHRoZW4gaXQgc3R1ZGVudCdzIGFuc3dlciBpcyBpbmNvcnJlY3QuXG4gICAgICAgICAgICAgICAgICAgIGlmIChnaXZlbl9hcnJfY29udmVydGVkW2ldIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0ubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCB0aGlzIGFzIHdyb25nIGJ5IG1ha2luZyBqICE9IDAgLS0gc2VlIHRoZSBjb2RlIHRoYXQgcnVucyBpbW1lZGlhdGVseSBhZnRlciB0aGUgZXhlY3V0aW5nIHRoZSBicmVhay5cbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdG8gd3JhcCB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL0Z1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBhbnN3ZXIsIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGVuIGFsbCBlbnRyaWVzIGluIGBgdGhpcy5keW5fdmFyc19ldmFsYGAgZGljdCBhcyBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc19lcXVhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc19hcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhuYW1lZEJsYW5rVmFsdWVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtmYmxbal1bXCJzb2x1dGlvbl9jb2RlXCJdfTtgXG4gICAgICAgICAgICAgICAgICAgICkoXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fYXJyX2NvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3QudmFsdWVzKG5hbWVkQmxhbmtWYWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpc19lcXVhbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlzX2VxdWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmJsW2pdW1wiZmVlZGJhY2tcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgTk9UIGEgZHluYW1pYyBzb2x1dGlvbiwgYnV0IGdpdmVuIGEgdGVzdGluZyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJzb2x1dGlvbl9jb2RlXCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIGZ1bmN0aW9uIHRvIHdyYXAgdGhlIGV4cHJlc3Npb24gdG8gZXZhbHVhdGUuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9GdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgLy8gUGFzcyB0aGUgYW5zd2VyLCBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlbiBhbGwgZW50cmllcyBpbiBgYHRoaXMuZHluX3ZhcnNfZXZhbGBgIGRpY3QgYXMgZnVuY3Rpb24gcGFyYW1ldGVycy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNfZXF1YWwgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNfYXJyYXlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtmYmxbal1bXCJzb2x1dGlvbl9jb2RlXCJdfTtgXG4gICAgICAgICAgICAgICAgICAgICkoZ2l2ZW4sIGdpdmVuX2Fycik7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBpc19lcXVhbCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGlzX2VxdWFsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmJsW2pdW1wiZmVlZGJhY2tcIl1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVuZGVmaW5lZCBtZXRob2Qgb2YgdGVzdGluZy5cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXCJudW1iZXJcIiBpbiBmYmxbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFuc3dlciBpcyBjb3JyZWN0IGlmIGl0IG1hdGNoZWQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGFycmF5LiBBIHNwZWNpYWwgY2FzZTogaWYgb25seSBvbmUgYW5zd2VyIGlzIHByb3ZpZGVkLCBjb3VudCBpdCB3cm9uZzsgdGhpcyBpcyBhIG1pc2Zvcm1lZCBwcm9ibGVtLlxuICAgICAgICAgICAgY29uc3QgaXNfY29ycmVjdCA9IGogPT09IDAgJiYgZmJsLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKGlzX2NvcnJlY3QpO1xuICAgICAgICAgICAgaWYgKCFpc19jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgICBkeW5fdmFyc19ldmFsICYmXG4gICAgICAgIHR5cGVvZiBkeW5fdmFyc19ldmFsLmFmdGVyQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIFwiRXJyb3IgY2FsbGluZyBhZnRlckNoZWNrQW5zd2Vyc1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHBlcmNlbnQgPVxuICAgICAgICBpc0NvcnJlY3RBcnJheS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoIC8gaXNDb3JyZWN0QXJyYXkubGVuZ3RoO1xuICAgIHJldHVybiBbZGlzcGxheUZlZWQsIGNvcnJlY3QsIGlzQ29ycmVjdEFycmF5LCBwZXJjZW50XTtcbn1cblxuLy8gVXNlIHRoZSBwcm92aWRlZCBwYXJzZXJzIHRvIGNvbnZlcnQgYSBzdHVkZW50J3MgYW5zd2VycyAoYXMgc3RyaW5ncykgdG8gdGhlIHR5cGUgcHJvZHVjZWQgYnkgdGhlIHBhcnNlciBmb3IgZWFjaCBibGFuay5cbmZ1bmN0aW9uIHBhcnNlQW5zd2VycyhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBTZWUgYGR5bl92YXJzX2V2YWxgLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIC8vIFByb3ZpZGUgYSBkaWN0IG9mIHtibGFua19uYW1lLCBjb252ZXJ0ZXJfYW5zd2VyX3ZhbHVlfS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhcbiAgICAgICAgZ2l2ZW5fYXJyLFxuICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICk7XG4gICAgLy8gSW52ZXJ0IGJsYW5rTmFtZWREaWN0OiBjb21wdXRlIGFuIGFycmF5IG9mIFtibGFua18wX25hbWUsIC4uLl0uIE5vdGUgdGhhdCB0aGUgYXJyYXkgbWF5IGJlIHNwYXJzZTogaXQgb25seSBjb250YWlucyB2YWx1ZXMgZm9yIG5hbWVkIGJsYW5rcy5cbiAgICBjb25zdCBnaXZlbl9hcnJfbmFtZXMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgZ2l2ZW5fYXJyX25hbWVzW3ZdID0gaztcbiAgICB9XG4gICAgLy8gQ29tcHV0ZSBhbiBhcnJheSBvZiBbY29udmVydGVkX2JsYW5rXzBfdmFsLCAuLi5dLiBOb3RlIHRoYXQgdGhpcyByZS1jb252ZXJ0cyBhbGwgdGhlIHZhbHVlcywgcmF0aGVyIHRoYW4gKHBvc3NpYmx5IGRlZXApIGNvcHlpbmcgdGhlIHZhbHVlcyBmcm9tIGFscmVhZHktY29udmVydGVkIG5hbWVkIGJsYW5rcy5cbiAgICBjb25zdCBnaXZlbl9hcnJfY29udmVydGVkID0gZ2l2ZW5fYXJyLm1hcCgodmFsdWUsIGluZGV4KSA9PlxuICAgICAgICB0eXBlX2NvbnZlcnQoZ2l2ZW5fYXJyX25hbWVzW2luZGV4XSwgdmFsdWUsIGluZGV4LCBkeW5fdmFyc19ldmFsKVxuICAgICk7XG5cbiAgICByZXR1cm4gW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdO1xufVxuXG4vLyBSZW5kZXIgdGhlIGZlZWRiYWNrIGZvciBhIGR5bmFtaWMgcHJvYmxlbS5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgLy8gU2VlIGJsYW5rTmFtZXNEaWN0Xy5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBTZWUgZ2l2ZW5fYXJyXy5cbiAgICBnaXZlbl9hcnIsXG4gICAgLy8gVGhlIGluZGV4IG9mIHRoaXMgYmxhbmsgaW4gZ2l2ZW5fYXJyXy5cbiAgICBpbmRleCxcbiAgICAvLyBUaGUgZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmssIGNvbnRhaW5pbmcgYSB0ZW1wbGF0ZSB0byBiZSByZW5kZXJlZC5cbiAgICBkaXNwbGF5RmVlZF9pLFxuICAgIC8vIFNlZSBkeW5fdmFyc19ldmFsXy5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICAvLyBVc2UgdGhlIGFuc3dlciwgYW4gYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZSB2YWx1ZSBvZiBhbGwgbmFtZWQgYmxhbmtzLCBhbmQgYWxsIHNvbHV0aW9uIHZhcmlhYmxlcyBmb3IgdGhlIHRlbXBsYXRlLlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgKTtcbiAgICBjb25zdCBzb2xfdmFyc19wbHVzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAge1xuICAgICAgICAgICAgYW5zOiBnaXZlbl9hcnJbaW5kZXhdLFxuICAgICAgICAgICAgYW5zX2FycmF5OiBnaXZlbl9hcnIsXG4gICAgICAgIH0sXG4gICAgICAgIGR5bl92YXJzX2V2YWwsXG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNcbiAgICApO1xuICAgIHRyeSB7XG4gICAgICAgIGRpc3BsYXlGZWVkX2kgPSByZW5kZXJfaHRtbChkaXNwbGF5RmVlZF9pLCBzb2xfdmFyc19wbHVzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5hc3NlcnQoZmFsc2UsIGBFcnJvciBldmFsdWF0aW5nIGZlZWRiYWNrIGluZGV4ICR7aW5kZXh9LmApO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlGZWVkX2k7XG59XG5cbi8vIFV0aWxpdGllc1xuLy8gLS0tLS0tLS0tXG4vLyBGb3IgZWFjaCBuYW1lZCBibGFuaywgZ2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGJsYW5rOiB0aGUgdmFsdWUgb2YgZWFjaCBgYGJsYW5rTmFtZWBgIGdpdmVzIHRoZSBpbmRleCBvZiB0aGUgYmxhbmsgZm9yIHRoYXQgbmFtZS5cbmZ1bmN0aW9uIGdldE5hbWVkQmxhbmtWYWx1ZXMoZ2l2ZW5fYXJyLCBibGFua05hbWVzRGljdCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSB7fTtcbiAgICBmb3IgKGNvbnN0IFtibGFua19uYW1lLCBibGFua19pbmRleF0gb2YgT2JqZWN0LmVudHJpZXMoYmxhbmtOYW1lc0RpY3QpKSB7XG4gICAgICAgIG5hbWVkQmxhbmtWYWx1ZXNbYmxhbmtfbmFtZV0gPSB0eXBlX2NvbnZlcnQoXG4gICAgICAgICAgICBibGFua19uYW1lLFxuICAgICAgICAgICAgZ2l2ZW5fYXJyW2JsYW5rX2luZGV4XSxcbiAgICAgICAgICAgIGJsYW5rX2luZGV4LFxuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZWRCbGFua1ZhbHVlcztcbn1cblxuLy8gQ29udmVydCBhIHZhbHVlIGdpdmVuIGl0cyB0eXBlLlxuZnVuY3Rpb24gdHlwZV9jb252ZXJ0KG5hbWUsIHZhbHVlLCBpbmRleCwgZHluX3ZhcnNfZXZhbCkge1xuICAgIC8vIFRoZSBjb252ZXJ0ZXIgY2FuIGJlIGRlZmluZWQgYnkgaW5kZXgsIG5hbWUsIG9yIGJ5IGEgc2luZ2xlIHZhbHVlICh3aGljaCBhcHBsaWVzIHRvIGFsbCBibGFua3MpLiBJZiBub3QgcHJvdmlkZWQsIGp1c3QgcGFzcyB0aGUgZGF0YSB0aHJvdWdoLlxuICAgIGNvbnN0IHR5cGVzID0gZHluX3ZhcnNfZXZhbC50eXBlcyB8fCBwYXNzX3Rocm91Z2g7XG4gICAgY29uc3QgY29udmVydGVyID0gdHlwZXNbbmFtZV0gfHwgdHlwZXNbaW5kZXhdIHx8IHR5cGVzO1xuICAgIC8vIEVTNSBoYWNrOiBpdCBkb2Vzbid0IHN1cHBvcnQgYmluYXJ5IHZhbHVlcywgYW5kIGpzMnB5IGRvZXNuJ3QgYWxsb3cgbWUgdG8gb3ZlcnJpZGUgdGhlIGBgTnVtYmVyYGAgY2xhc3MuIFNvLCBkZWZpbmUgdGhlIHdvcmthcm91bmQgY2xhc3MgYGBOdW1iZXJfYGAgYW5kIHVzZSBpdCBpZiBhdmFpbGFibGUuXG4gICAgaWYgKGNvbnZlcnRlciA9PT0gTnVtYmVyICYmIHR5cGVvZiBOdW1iZXJfICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGNvbnZlcnRlciA9IE51bWJlcl87XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIHRoZSBjb252ZXJ0ZWQgdHlwZS4gSWYgdGhlIGNvbnZlcnRlciByYWlzZXMgYSBUeXBlRXJyb3IsIHJldHVybiB0aGF0OyBpdCB3aWxsIGJlIGRpc3BsYXllZCB0byB0aGUgdXNlciwgc2luY2Ugd2UgYXNzdW1lIHR5cGUgZXJyb3JzIGFyZSBhIHdheSBmb3IgdGhlIHBhcnNlciB0byBleHBsYWluIHRvIHRoZSB1c2VyIHdoeSB0aGUgcGFyc2UgZmFpbGVkLiBGb3IgYWxsIG90aGVyIGVycm9ycywgcmUtdGhyb3cgaXQgc2luY2Ugc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBlcnI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEEgcGFzcy10aHJvdWdoIFwiY29udmVydGVyXCIuXG5mdW5jdGlvbiBwYXNzX3Rocm91Z2godmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==