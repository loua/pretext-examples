(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_timedfitb_js"],{

/***/ 1103:
/*!****************************************!*\
  !*** ./runestone/fitb/js/timedfitb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/***/ (() => {

$.i18n().load({
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

"use strict";
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
/***/ (() => {

$.i18n().load({
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

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 54088:
/*!***********************************!*\
  !*** ./runestone/fitb/js/fitb.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FITBList: () => (/* binding */ FITBList),
/* harmony export */   "default": () => (/* binding */ FITB)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fitb-utils.js */ 84548);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fitb-i18n.en.js */ 39604);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fitb-i18n.pt-br.js */ 30612);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _css_fitb_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/fitb.css */ 44695);
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
        this.submitButton.textContent = $.i18n("msg_fitb_check_me");
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
            this.compareButton.textContent = $.i18n("msg_fitb_compare_me");
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
            this.randomizeButton.textContent = $.i18n("msg_fitb_randomize");
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
            [html_nodes, this.dyn_vars_eval] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicContent)(
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
            ] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkAnswersCore)(...pca);
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
                df = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicFeedback)(
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

/***/ 84548:
/*!*****************************************!*\
  !*** ./runestone/fitb/js/fitb-utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
            // TODO: was $.i18n("msg_no_answer").
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy90aW1lZGZpdGIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5wdC1ici5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvbGlicy9hbGVhUFJORy0xLjEuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvY3NzL2ZpdGIuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLXV0aWxzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBGSVRCIGZyb20gXCIuL2ZpdGIuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRklUQiBleHRlbmRzIEZJVEIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuaW5wdXREaXYpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgIGlmICh0aGlzLnN1Ym1pdEJ1dHRvbikgdGhpcy5zdWJtaXRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBpZiAodGhpcy5jb21wYXJlQnV0dG9uKSB0aGlzLmNvbXBhcmVCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIHRpbWVJY29uLnNyYyA9IFwiLi4vX3N0YXRpYy9jbG9jay5wbmdcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUud2lkdGggPSBcIjE1cHhcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUuaGVpZ2h0ID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Lmluc2VydEJlZm9yZSh0aW1lSWNvbkRpdiwgY29tcG9uZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYXBwZW5kQ2hpbGQodGltZUljb25EaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uY2xhc3NMaXN0LnJlbW92ZShcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LmZpbGxpbnRoZWJsYW5rID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRklUQihvcHRzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGSVRCKG9wdHMpO1xufTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5lbmh1bWEgcmVzcG9zdGEgZGFkYS5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyYXJcIlxuICAgIH0sXG59KTtcbiIsIi8qLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuYWxlYVBSTkcgMS4xXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbmh0dHBzOi8vZ2l0aHViLmNvbS9tYWNtY21lYW5zL2FsZWFQUk5HL2Jsb2IvbWFzdGVyL2FsZWFQUk5HLTEuMS5qc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5PcmlnaW5hbCB3b3JrIGNvcHlyaWdodCDCqSAyMDEwIEpvaGFubmVzIEJhYWfDuGUsIHVuZGVyIE1JVCBsaWNlbnNlXG5UaGlzIGlzIGEgZGVyaXZhdGl2ZSB3b3JrIGNvcHlyaWdodCAoYykgMjAxNy0yMDIwLCBXLiBNYWNcIiBNY01lYW5zLCB1bmRlciBCU0QgbGljZW5zZS5cblJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dCBtb2RpZmljYXRpb24sIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcbjEuIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lci5cbjIuIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGUgZG9jdW1lbnRhdGlvbiBhbmQvb3Igb3RoZXIgbWF0ZXJpYWxzIHByb3ZpZGVkIHdpdGggdGhlIGRpc3RyaWJ1dGlvbi5cbjMuIE5laXRoZXIgdGhlIG5hbWUgb2YgdGhlIGNvcHlyaWdodCBob2xkZXIgbm9yIHRoZSBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0cyBkZXJpdmVkIGZyb20gdGhpcyBzb2Z0d2FyZSB3aXRob3V0IHNwZWNpZmljIHByaW9yIHdyaXR0ZW4gcGVybWlzc2lvbi5cblRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORCBBTlkgRVhQUkVTUyBPUiBJTVBMSUVEIFdBUlJBTlRJRVMsIElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBUSEUgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSBBTkQgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQVJFIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBDT1BZUklHSFQgSE9MREVSIE9SIENPTlRSSUJVVE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyAoSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFBST0NVUkVNRU5UIE9GIFNVQlNUSVRVVEUgR09PRFMgT1IgU0VSVklDRVM7IExPU1MgT0YgVVNFLCBEQVRBLCBPUiBQUk9GSVRTOyBPUiBCVVNJTkVTUyBJTlRFUlJVUFRJT04pIEhPV0VWRVIgQ0FVU0VEIEFORCBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVCAoSU5DTFVESU5HIE5FR0xJR0VOQ0UgT1IgT1RIRVJXSVNFKSBBUklTSU5HIElOIEFOWSBXQVkgT1VUIE9GIFRIRSBVU0UgT0YgVEhJUyBTT0ZUV0FSRSwgRVZFTiBJRiBBRFZJU0VEIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8qL1xuZXhwb3J0IGZ1bmN0aW9uIGFsZWFQUk5HKCkge1xuICAgIHJldHVybiggZnVuY3Rpb24oIGFyZ3MgKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSAnYWxlYVBSTkcgMS4xLjAnO1xuXG4gICAgICAgIHZhciBzMFxuICAgICAgICAgICAgLCBzMVxuICAgICAgICAgICAgLCBzMlxuICAgICAgICAgICAgLCBjXG4gICAgICAgICAgICAsIHVpbnRhID0gbmV3IFVpbnQzMkFycmF5KCAzIClcbiAgICAgICAgICAgICwgaW5pdGlhbEFyZ3NcbiAgICAgICAgICAgICwgbWFzaHZlciA9ICcnXG4gICAgICAgIDtcblxuICAgICAgICAvKiBwcml2YXRlOiBpbml0aWFsaXplcyBnZW5lcmF0b3Igd2l0aCBzcGVjaWZpZWQgc2VlZCAqL1xuICAgICAgICBmdW5jdGlvbiBfaW5pdFN0YXRlKCBfaW50ZXJuYWxTZWVkICkge1xuICAgICAgICAgICAgdmFyIG1hc2ggPSBNYXNoKCk7XG5cbiAgICAgICAgICAgIC8vIGludGVybmFsIHN0YXRlIG9mIGdlbmVyYXRvclxuICAgICAgICAgICAgczAgPSBtYXNoKCAnICcgKTtcbiAgICAgICAgICAgIHMxID0gbWFzaCggJyAnICk7XG4gICAgICAgICAgICBzMiA9IG1hc2goICcgJyApO1xuXG4gICAgICAgICAgICBjID0gMTtcblxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfaW50ZXJuYWxTZWVkLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIHMwIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMCA8IDAgKSB7IHMwICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMxIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMSA8IDAgKSB7IHMxICs9IDE7IH1cblxuICAgICAgICAgICAgICAgIHMyIC09IG1hc2goIF9pbnRlcm5hbFNlZWRbIGkgXSApO1xuICAgICAgICAgICAgICAgIGlmKCBzMiA8IDAgKSB7IHMyICs9IDE7IH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWFzaHZlciA9IG1hc2gudmVyc2lvbjtcblxuICAgICAgICAgICAgbWFzaCA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHJpdmF0ZTogZGVwZW5kZW50IHN0cmluZyBoYXNoIGZ1bmN0aW9uICovXG4gICAgICAgIGZ1bmN0aW9uIE1hc2goKSB7XG4gICAgICAgICAgICB2YXIgbiA9IDQwMjI4NzExOTc7IC8vIDB4ZWZjODI0OWRcblxuICAgICAgICAgICAgdmFyIG1hc2ggPSBmdW5jdGlvbiggZGF0YSApIHtcbiAgICAgICAgICAgICAgICBkYXRhID0gZGF0YS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgLy8gY2FjaGUgdGhlIGxlbmd0aFxuICAgICAgICAgICAgICAgIGZvciggdmFyIGkgPSAwLCBsID0gZGF0YS5sZW5ndGg7IGkgPCBsOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIG4gKz0gZGF0YS5jaGFyQ29kZUF0KCBpICk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGggPSAwLjAyNTE5NjAzMjgyNDE2OTM4ICogbjtcblxuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgaCAqPSBuO1xuICAgICAgICAgICAgICAgICAgICBuICA9IGggPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgIGggLT0gbjtcbiAgICAgICAgICAgICAgICAgICAgbiArPSBoICogNDI5NDk2NzI5NjsgLy8gMHgxMDAwMDAwMDAgICAgICAyXjMyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAoIG4gPj4+IDAgKSAqIDIuMzI4MzA2NDM2NTM4Njk2M2UtMTA7IC8vIDJeLTMyXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtYXNoLnZlcnNpb24gPSAnTWFzaCAwLjknO1xuICAgICAgICAgICAgcmV0dXJuIG1hc2g7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvKiBwcml2YXRlOiBjaGVjayBpZiBudW1iZXIgaXMgaW50ZWdlciAqL1xuICAgICAgICBmdW5jdGlvbiBfaXNJbnRlZ2VyKCBfaW50ICkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KCBfaW50LCAxMCApID09PSBfaW50O1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogcmV0dXJuIGEgMzItYml0IGZyYWN0aW9uIGluIHRoZSByYW5nZSBbMCwgMV1cbiAgICAgICAgVGhpcyBpcyB0aGUgbWFpbiBmdW5jdGlvbiByZXR1cm5lZCB3aGVuIGFsZWFQUk5HIGlzIGluc3RhbnRpYXRlZFxuICAgICAgICAqL1xuICAgICAgICB2YXIgcmFuZG9tID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdCA9IDIwOTE2MzkgKiBzMCArIGMgKiAyLjMyODMwNjQzNjUzODY5NjNlLTEwOyAvLyAyXi0zMlxuXG4gICAgICAgICAgICBzMCA9IHMxO1xuICAgICAgICAgICAgczEgPSBzMjtcblxuICAgICAgICAgICAgcmV0dXJuIHMyID0gdCAtICggYyA9IHQgfCAwICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYSA1My1iaXQgZnJhY3Rpb24gaW4gdGhlIHJhbmdlIFswLCAxXSAqL1xuICAgICAgICByYW5kb20uZnJhY3Q1MyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICsgKCByYW5kb20oKSAqIDB4MjAwMDAwICB8IDAgKSAqIDEuMTEwMjIzMDI0NjI1MTU2NWUtMTY7IC8vIDJeLTUzXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gYW4gdW5zaWduZWQgaW50ZWdlciBpbiB0aGUgcmFuZ2UgWzAsIDJeMzJdICovXG4gICAgICAgIHJhbmRvbS5pbnQzMiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogMHgxMDAwMDAwMDA7IC8vIDJeMzJcbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGFkdmFuY2UgdGhlIGdlbmVyYXRvciB0aGUgc3BlY2lmaWVkIGFtb3VudCBvZiBjeWNsZXMgKi9cbiAgICAgICAgcmFuZG9tLmN5Y2xlID0gZnVuY3Rpb24oIF9ydW4gKSB7XG4gICAgICAgICAgICBfcnVuID0gdHlwZW9mIF9ydW4gPT09ICd1bmRlZmluZWQnID8gMSA6ICtfcnVuO1xuICAgICAgICAgICAgaWYoIF9ydW4gPCAxICkgeyBfcnVuID0gMTsgfVxuICAgICAgICAgICAgZm9yKCB2YXIgaSA9IDA7IGkgPCBfcnVuOyBpKysgKSB7IHJhbmRvbSgpOyB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiByZXR1cm4gaW5jbHVzaXZlIHJhbmdlICovXG4gICAgICAgIHJhbmRvbS5yYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGxvQm91bmRcbiAgICAgICAgICAgICAgICAsIGhpQm91bmRcbiAgICAgICAgICAgIDtcblxuICAgICAgICAgICAgaWYoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgbG9Cb3VuZCA9IDA7XG4gICAgICAgICAgICAgICAgaGlCb3VuZCA9IGFyZ3VtZW50c1sgMCBdO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAxIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKCBhcmd1bWVudHNbIDAgXSA+IGFyZ3VtZW50c1sgMSBdICkge1xuICAgICAgICAgICAgICAgIGxvQm91bmQgPSBhcmd1bWVudHNbIDEgXTtcbiAgICAgICAgICAgICAgICBoaUJvdW5kID0gYXJndW1lbnRzWyAwIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHJldHVybiBpbnRlZ2VyXG4gICAgICAgICAgICBpZiggX2lzSW50ZWdlciggbG9Cb3VuZCApICYmIF9pc0ludGVnZXIoIGhpQm91bmQgKSApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vciggcmFuZG9tKCkgKiAoIGhpQm91bmQgLSBsb0JvdW5kICsgMSApICkgKyBsb0JvdW5kO1xuXG4gICAgICAgICAgICAvLyByZXR1cm4gZmxvYXRcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhbmRvbSgpICogKCBoaUJvdW5kIC0gbG9Cb3VuZCApICsgbG9Cb3VuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKiBwdWJsaWM6IGluaXRpYWxpemUgZ2VuZXJhdG9yIHdpdGggdGhlIHNlZWQgdmFsdWVzIHVzZWQgdXBvbiBpbnN0YW50aWF0aW9uICovXG4gICAgICAgIHJhbmRvbS5yZXN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfaW5pdFN0YXRlKCBpbml0aWFsQXJncyApO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2VlZGluZyBmdW5jdGlvbiAqL1xuICAgICAgICByYW5kb20uc2VlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgX2luaXRTdGF0ZSggQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoIGFyZ3VtZW50cyApICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogcHVibGljOiBzaG93IHRoZSB2ZXJzaW9uIG9mIHRoZSBSTkcgKi9cbiAgICAgICAgcmFuZG9tLnZlcnNpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB2ZXJzaW9uO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qIHB1YmxpYzogc2hvdyB0aGUgdmVyc2lvbiBvZiB0aGUgUk5HIGFuZCB0aGUgTWFzaCBzdHJpbmcgaGFzaGVyICovXG4gICAgICAgIHJhbmRvbS52ZXJzaW9ucyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZlcnNpb24gKyAnLCAnICsgbWFzaHZlcjtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyB3aGVuIG5vIHNlZWQgaXMgc3BlY2lmaWVkLCBjcmVhdGUgYSByYW5kb20gb25lIGZyb20gV2luZG93cyBDcnlwdG8gKE1vbnRlIENhcmxvIGFwcGxpY2F0aW9uKVxuICAgICAgICBpZiggYXJncy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgd2luZG93LmNyeXB0by5nZXRSYW5kb21WYWx1ZXMoIHVpbnRhICk7XG4gICAgICAgICAgICAgYXJncyA9IFsgdWludGFbIDAgXSwgdWludGFbIDEgXSwgdWludGFbIDIgXSBdO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIHN0b3JlIHRoZSBzZWVkIHVzZWQgd2hlbiB0aGUgUk5HIHdhcyBpbnN0YW50aWF0ZWQsIGlmIGFueVxuICAgICAgICBpbml0aWFsQXJncyA9IGFyZ3M7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgUk5HXG4gICAgICAgIF9pbml0U3RhdGUoIGFyZ3MgKTtcblxuICAgICAgICByZXR1cm4gcmFuZG9tO1xuXG4gICAgfSkoIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBhcmd1bWVudHMgKSApO1xufTsiLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX3JhbmRvbWl6ZTogXCJSYW5kb21pemVcIixcbiAgICB9LFxufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gfGRvY25hbWV8IC0tIGZpbGwtaW4tdGhlLWJsYW5rIGNsaWVudC1zaWRlIGNvZGVcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgUnVuZXN0b25lIGZpbGxpbnRoZWJsYW5rIGNvbXBvbmVudC4gSXQgd2FzIGNyZWF0ZWQgQnkgSXNhaWFoIE1heWVyY2hhayBhbmQgS2lyYnkgT2xzb24sIDYvNC8xNSB0aGVuIHJldmlzZWQgYnkgQnJhZCBNaWxsZXIsIDIvNy8yMC5cbi8vXG4vLyBEYXRhIHN0b3JhZ2Ugbm90ZXNcbi8vID09PT09PT09PT09PT09PT09PVxuLy9cbi8vIEluaXRpYWwgcHJvYmxlbSByZXN0b3JlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW4gdGhlIGNvbnN0cnVjdG9yLCB0aGlzIGNvZGUgKHRoZSBjbGllbnQpIHJlc3RvcmVzIHRoZSBwcm9ibGVtIGJ5IGNhbGxpbmcgYGBjaGVja1NlcnZlcmBgLiBUbyBkbyBzbywgZWl0aGVyIHRoZSBzZXJ2ZXIgc2VuZHMgb3IgbG9jYWwgc3RvcmFnZSBoYXM6XG4vL1xuLy8gLSAgICBzZWVkICh1c2VkIG9ubHkgZm9yIGR5bmFtaWMgcHJvYmxlbXMpXG4vLyAtICAgIGFuc3dlclxuLy8gLSAgICBkaXNwbGF5RmVlZCAoc2VydmVyLXNpZGUgZ3JhZGluZyBvbmx5OyBvdGhlcndpc2UsIHRoaXMgaXMgZ2VuZXJhdGVkIGxvY2FsbHkgYnkgY2xpZW50IGNvZGUpXG4vLyAtICAgIGNvcnJlY3QgKFNTRylcbi8vIC0gICAgaXNDb3JyZWN0QXJyYXkgKFNTRylcbi8vIC0gICAgcHJvYmxlbUh0bWwgKFNTRyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMgb25seSlcbi8vXG4vLyBJZiBhbnkgb2YgdGhlIGFuc3dlcnMgYXJlIGNvcnJlY3QsIHRoZW4gdGhlIGNsaWVudCBzaG93cyBmZWVkYmFjay4gVGhpcyBpcyBpbXBsZW1lbnRlZCBpbiByZXN0b3JlQW5zd2Vyc18uXG4vL1xuLy8gR3JhZGluZ1xuLy8gLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIkNoZWNrIG1lXCIgYnV0dG9uLCB0aGUgbG9nQ3VycmVudEFuc3dlcl8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gICAgICBOb3RlIHRoYXQgdGhlcmUncyBubyBwb2ludCBpbiBzYXZpbmcgZGlzcGxheUZlZWQsIGNvcnJlY3QsIG9yIGlzQ29ycmVjdEFycmF5LCBzaW5jZSB0aGVzZSB2YWx1ZXMgYXBwbGllZCB0byB0aGUgcHJldmlvdXMgYW5zd2VyLCBub3QgdGhlIG5ldyBhbnN3ZXIganVzdCBzdWJtaXR0ZWQuXG4vL1xuLy8gLSAgICBTZW5kcyB0aGUgZm9sbG93aW5nIHRvIHRoZSBzZXJ2ZXI7IHN0b3AgYWZ0ZXIgdGhpcyBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZzpcbi8vXG4vLyAgICAgIC0gICBzZWVkIChpZ25vcmVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nKVxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICBjb3JyZWN0IChpZ25vcmVkIGZvciBTU0cpXG4vLyAgICAgIC0gICBwZXJjZW50IChpZ25vcmVkIGZvciBTU0cpXG4vL1xuLy8gLSAgICBSZWNlaXZlcyB0aGUgZm9sbG93aW5nIGZyb20gdGhlIHNlcnZlcjpcbi8vXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkXG4vLyAgICAgIC0gICBjb3JyZWN0XG4vLyAgICAgIC0gICBpc0NvcnJlY3RBcnJheVxuLy9cbi8vIC0gICAgU2F2ZXMgdGhlIGZvbGxvd2luZyB0byBsb2NhbCBzdG9yYWdlOlxuLy9cbi8vICAgICAgLSAgIHNlZWRcbi8vICAgICAgLSAgIGFuc3dlclxuLy8gICAgICAtICAgdGltZXN0YW1wXG4vLyAgICAgIC0gICBkaXNwbGF5RmVlZCAoU1NHIG9ubHkpXG4vLyAgICAgIC0gICBjb3JyZWN0IChTU0cgb25seSlcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5IChTU0cgb25seSlcbi8vICAgICAgLSAgIHByb2JsZW1IdG1sXG4vL1xuLy8gUmFuZG9taXplXG4vLyAtLS0tLS0tLS1cbi8vIFdoZW4gdGhlIHVzZXIgcHJlc3NlcyB0aGUgXCJSYW5kb21pemVcIiBidXR0b24gKHdoaWNoIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBkeW5hbWljIHByb2JsZW1zKSwgdGhlIHJhbmRvbWl6ZV8gZnVuY3Rpb246XG4vL1xuLy8gLSAgICBGb3IgdGhlIGNsaWVudC1zaWRlIGNhc2UsIHNldHMgdGhlIHNlZWQgdG8gYSBuZXcsIHJhbmRvbSB2YWx1ZS4gRm9yIHRoZSBzZXJ2ZXItc2lkZSBjYXNlLCByZXF1ZXN0cyBhIG5ldyBzZWVkIGFuZCBwcm9ibGVtSHRtbCBmcm9tIHRoZSBzZXJ2ZXIuXG4vLyAtICAgIFNldHMgdGhlIGFuc3dlciB0byBhbiBhcnJheSBvZiBlbXB0eSBzdHJpbmdzLlxuLy8gLSAgICBTYXZlcyB0aGUgdXN1YWwgbG9jYWwgZGF0YS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHtcbiAgICByZW5kZXJEeW5hbWljQ29udGVudCxcbiAgICBjaGVja0Fuc3dlcnNDb3JlLFxuICAgIHJlbmRlckR5bmFtaWNGZWVkYmFjayxcbn0gZnJvbSBcIi4vZml0Yi11dGlscy5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4uZW4uanNcIjtcbmltcG9ydCBcIi4vZml0Yi1pMThuLnB0LWJyLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvZml0Yi5jc3NcIjtcblxuLy8gT2JqZWN0IGNvbnRhaW5pbmcgYWxsIGluc3RhbmNlcyBvZiBGSVRCIHRoYXQgYXJlbid0IGEgY2hpbGQgb2YgYSB0aW1lZCBhc3Nlc3NtZW50LlxuZXhwb3J0IHZhciBGSVRCTGlzdCA9IHt9O1xuXG4vLyBGSVRCIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGSVRCIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cD4gZWxlbWVudFxuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICAvLyBTZWUgY29tbWVudHMgaW4gZml0Yi5weSBmb3IgdGhlIGZvcm1hdCBvZiBgYGZlZWRiYWNrQXJyYXlgYCAod2hpY2ggaXMgaWRlbnRpY2FsIGluIGJvdGggZmlsZXMpLlxuICAgICAgICAvL1xuICAgICAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF9fLiBJZiB0aGlzIHRhZyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5vIGZlZWRiYWNrIGlzIGF2YWlsYWJsZTsgc2VydmVyLXNpZGUgZ3JhZGluZyB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gQSBkZXN0cnVjdHVyaW5nIGFzc2lnbm1lbnQgd291bGQgYmUgcGVyZmVjdCwgYnV0IHRoZXkgZG9uJ3Qgd29yayB3aXRoIGBgdGhpcy5ibGFoYGAgYW5kIGBgd2l0aGBgIHN0YXRlbWVudHMgYXJlbid0IHN1cHBvcnRlZCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgY29uc3QganNvbl9lbGVtZW50ID0gdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLm9yaWdFbGVtKTtcbiAgICAgICAgY29uc3QgZGljdF8gPSBKU09OLnBhcnNlKGpzb25fZWxlbWVudC50ZXh0Q29udGVudCk7XG4gICAgICAgIGpzb25fZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIG9sZGVyIHZlcnNpb25zIHRoYXQgaGF2ZSByYXcgaHRtbCBjb250ZW50LlxuICAgICAgICBpZiAoZGljdF8ucHJvYmxlbUh0bWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gaWYgZGljdF8ucHJvYmxlbUh0bWwgc3RhcnRzIHdpdGggJmx0OyB0aGVuIHVuZXNjYXBlIGl0IHRoaXMgaGFwcGVucyBmb3IgcHJldmlld3NcbiAgICAgICAgICAgIC8vIHdoZW4gdGhlIHByb2JsZW0gY29tZXMgZnJvbSB0aGUgREJcbiAgICAgICAgICAgIGlmIChkaWN0Xy5wcm9ibGVtSHRtbC5zdGFydHNXaXRoKFwiJmx0O1wiKSkge1xuICAgICAgICAgICAgICAgIGRpY3RfLnByb2JsZW1IdG1sID0gZGljdF8ucHJvYmxlbUh0bWwucmVwbGFjZSgvJmx0Oy9nLCBcIjxcIikucmVwbGFjZSgvJmd0Oy9nLCBcIj5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICBkaWN0Xy5wcm9ibGVtSHRtbCA9IGRpY3RfLnByb2JsZW1IdG1sLnJlcGxhY2UoL3NyYz1cImV4dGVybmFsL2csXG4gICAgICAgICAgICAgICAgICAgICdzcmM9XCInICsgYC9ucy9ib29rcy9wdWJsaXNoZWQvJHtlQm9va0NvbmZpZy5iYXNlY291cnNlfWAgKyAnL2V4dGVybmFsJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIHRoaXMuZHluX3ZhcnMgPSBkaWN0Xy5keW5fdmFycztcbiAgICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyA9IGRpY3RfLmJsYW5rTmFtZXM7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQXJyYXkgPSBkaWN0Xy5mZWVkYmFja0FycmF5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtSHRtbCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0FycmF5ID0gZGljdF87XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNyZWF0ZUZJVEJFbGVtZW50KCk7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJGaWxsIGluIHRoZSBCbGFua1wiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG5cbiAgICAgICAgLy8gRGVmaW5lIGEgcHJvbWlzZSB3aGljaCBpbXBvcnRzIGFueSBsaWJyYXJpZXMgbmVlZGVkIGJ5IGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgIHRoaXMuZHluX2ltcG9ydHMgPSB7fTtcbiAgICAgICAgbGV0IGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICBpZiAoZGljdF8uZHluX2ltcG9ydHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gQ29sbGVjdCBhbGwgaW1wb3J0IHByb21pc2VzLlxuICAgICAgICAgICAgbGV0IGltcG9ydF9wcm9taXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpbXBvcnRfIG9mIGRpY3RfLmR5bl9pbXBvcnRzKSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChpbXBvcnRfKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciBpbXBvcnRzIGtub3duIGF0IHdlYnBhY2sgYnVpbGQsIGJyaW5nIHRoZXNlIGluLlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiQlRNXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRfcHJvbWlzZXMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnQoXCJidG0tZXhwcmVzc2lvbnMvc3JjL0JUTV9yb290LmpzXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIC8vIEFsbG93IGZvciBsb2NhbCBpbXBvcnRzLCB1c3VhbGx5IGZyb20gcHJvYmxlbXMgZGVmaW5lZCBvdXRzaWRlIHRoZSBSdW5lc3RvbmUgQ29tcG9uZW50cy5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydF9wcm9taXNlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydCgvKiB3ZWJwYWNrSWdub3JlOiB0cnVlICovIGltcG9ydF8pXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb21iaW5lIHRoZSByZXN1bHRpbmcgbW9kdWxlIG5hbWVzcGFjZSBvYmplY3RzIHdoZW4gdGhlc2UgcHJvbWlzZXMgcmVzb2x2ZS5cbiAgICAgICAgICAgIGltcG9ydHNfcHJvbWlzZSA9IFByb21pc2UuYWxsKGltcG9ydF9wcm9taXNlcylcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgKG1vZHVsZV9uYW1lc3BhY2VfYXJyKSA9PlxuICAgICAgICAgICAgICAgICAgICAodGhpcy5keW5faW1wb3J0cyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICAgICAgICAgICAgICB7fSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm1vZHVsZV9uYW1lc3BhY2VfYXJyXG4gICAgICAgICAgICAgICAgICAgICkpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGBGYWlsZWQgZHluYW1pYyBpbXBvcnQ6ICR7ZXJyfS5gO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzb2x2ZSB0aGVzZSBwcm9taXNlcy5cbiAgICAgICAgaW1wb3J0c19wcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcImZpbGxiXCIsIGZhbHNlKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBPbmUgb3B0aW9uIGZvciBhIGR5bmFtaWMgcHJvYmxlbSBpcyB0byBwcm9kdWNlIGEgc3RhdGljIHByb2JsZW0gYnkgcHJvdmlkaW5nIGEgZml4ZWQgc2VlZCB2YWx1ZS4gVGhpcyBpcyB0eXBpY2FsbHkgdXNlZCB3aGVuIHRoZSBnb2FsIGlzIHRvIHJlbmRlciB0aGUgcHJvYmxlbSBhcyBhbiBpbWFnZSBmb3IgaW5jbHVzaW9uIGluIHN0YXRpYyBjb250ZW50IChhIFBERiwgZXRjLikuIFRvIHN1cHBvcnQgdGhpcywgY29uc2lkZXIgdGhlIGZvbGxvd2luZyBjYXNlczpcbiAgICAgICAgICAgICAgICAvL1xuICAgICAgICAgICAgICAgIC8vLyBDYXNlICBIYXMgc3RhdGljIHNlZWQ/ICBJcyBhIGNsaWVudC1zaWRlLCBkeW5hbWljIHByb2JsZW0/ICBIYXMgbG9jYWwgc2VlZD8gIFJlc3VsdFxuICAgICAgICAgICAgICAgIC8vLyAwICAgICBObyAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBYICAgICAgICAgICAgICAgIE5vIGFjdGlvbiBuZWVkZWQuXG4gICAgICAgICAgICAgICAgLy8vIDEgICAgIE5vICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgdGhpcy5yYW5kb21pemUoKS5cbiAgICAgICAgICAgICAgICAvLy8gMiAgICAgTm8gICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWWVzICAgICAgICAgICAgICBObyBhY3Rpb24gbmVlZGVkIC0tIHByb2JsZW0gYWxyZWFkeSByZXN0b3JlZCBmcm9tIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgICAgICAgICAgLy8vIDMgICAgIFllcyAgICAgICAgICAgICAgIE5vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFggICAgICAgICAgICAgICAgV2FybmluZzogc2VlZCBpZ25vcmVkLlxuICAgICAgICAgICAgICAgIC8vLyA0ICAgICBZZXMgICAgICAgICAgICAgICBZZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBObyAgICAgICAgICAgICAgIEFzc2lnbiBzZWVkOyB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCkuXG4gICAgICAgICAgICAgICAgLy8vIDUgICAgIFllcyAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFllcyAgICAgICAgICAgICAgSWYgc2VlZHMgZGlmZmVyLCBpc3N1ZSB3YXJuaW5nLiBObyBhZGRpdGlvbmFsIGFjdGlvbiBuZWVkZWQgLS0gcHJvYmxlbSBhbHJlYWR5IHJlc3RvcmVkIGZyb20gbG9jYWwgc3RvcmFnZS5cblxuICAgICAgICAgICAgICAgIGNvbnN0IGhhc19zdGF0aWNfc2VlZCA9IGRpY3RfLnN0YXRpY19zZWVkICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNfY2xpZW50X2R5bmFtaWMgPSB0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIjtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNfbG9jYWxfc2VlZCA9IHRoaXMuc2VlZCAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FzZSAxXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNfc3RhdGljX3NlZWQgJiYgaXNfY2xpZW50X2R5bmFtaWMgJiYgIWhhc19sb2NhbF9zZWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhc2UgM1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGhhc19zdGF0aWNfc2VlZCAmJiAhaXNfY2xpZW50X2R5bmFtaWMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV2FybmluZzogdGhlIHByb3ZpZGVkIHN0YXRpYyBzZWVkIHdhcyBpZ25vcmVkLCBiZWNhdXNlIGl0IG9ubHkgYWZmZWN0cyBjbGllbnQtc2lkZSwgZHluYW1pYyBwcm9ibGVtcy5cIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDRcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaGFzX3N0YXRpY19zZWVkICYmXG4gICAgICAgICAgICAgICAgICAgIGlzX2NsaWVudF9keW5hbWljICYmXG4gICAgICAgICAgICAgICAgICAgICFoYXNfbG9jYWxfc2VlZFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlZWQgPSBkaWN0Xy5zdGF0aWNfc2VlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBDYXNlIDVcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICAgICAgaGFzX3N0YXRpY19zZWVkICYmXG4gICAgICAgICAgICAgICAgICAgIGlzX2NsaWVudF9keW5hbWljICYmXG4gICAgICAgICAgICAgICAgICAgIGhhc19sb2NhbF9zZWVkICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VlZCAhPT0gZGljdF8uc3RhdGljX3NlZWRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiV2FybmluZzogdGhlIHByb3ZpZGVkIHN0YXRpYyBzZWVkIHdhcyBvdmVycmlkZGVuIGJ5IHRoZSBzZWVkIGZvdW5kIGluIGxvY2FsIHN0b3JhZ2UuXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQ2FzZXMgMCBhbmQgMlxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBObyBhY3Rpb24gbmVlZGVkLlxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgIH1cblxuICAgIC8vIEZpbmQgdGhlIHNjcmlwdCB0YWcgY29udGFpbmluZyBKU09OIGluIGEgZ2l2ZW4gcm9vdCBET00gbm9kZS5cbiAgICBzY3JpcHRTZWxlY3Rvcihyb290X25vZGUpIHtcbiAgICAgICAgcmV0dXJuIHJvb3Rfbm9kZS5xdWVyeVNlbGVjdG9yKGBzY3JpcHRbdHlwZT1cImFwcGxpY2F0aW9uL2pzb25cIl1gKTtcbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09ICAgRnVuY3Rpb25zIGdlbmVyYXRpbmcgZmluYWwgSFRNTCAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVGSVRCRWxlbWVudCgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJGSVRCSW5wdXQoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGSVRCQnV0dG9ucygpO1xuICAgICAgICB0aGlzLnJlbmRlckZJVEJGZWVkYmFja0RpdigpO1xuICAgICAgICAvLyByZXBsYWNlcyB0aGUgaW50ZXJtZWRpYXRlIEhUTUwgZm9yIHRoaXMgY29tcG9uZW50IHdpdGggdGhlIHJlbmRlcmVkIEhUTUwgb2YgdGhpcyBjb21wb25lbnRcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIHJlbmRlckZJVEJJbnB1dCgpIHtcbiAgICAgICAgLy8gVGhlIHRleHQgW2lucHV0XSBlbGVtZW50cyBhcmUgY3JlYXRlZCBieSB0aGUgdGVtcGxhdGUuXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAvLyBDcmVhdGUgYW5vdGhlciBjb250YWluZXIgd2hpY2ggc3RvcmVzIHRoZSBwcm9ibGVtIGRlc2NyaXB0aW9uLlxuICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5jbGFzc0xpc3QuYWRkKFwiZXhlcmNpc2Utc3RhdGVtZW50XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgICAgLy8gQ29weSB0aGUgb3JpZ2luYWwgZWxlbWVudHMgdG8gdGhlIGNvbnRhaW5lciBob2xkaW5nIHdoYXQgdGhlIHVzZXIgd2lsbCBzZWUgKGNsaWVudC1zaWRlIGdyYWRpbmcgb25seSkuXG4gICAgICAgIGlmICh0aGlzLnByb2JsZW1IdG1sKSB7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgICAgICAgICAvLyBTYXZlIG9yaWdpbmFsIEhUTUwgKHdpdGggdGVtcGxhdGVzKSB1c2VkIGluIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2Lm9yaWdJbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyRklUQkJ1dHRvbnMoKSB7XG4gICAgICAgIC8vIFwic3VibWl0XCIgYnV0dG9uXG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jaGVja19tZVwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLXN1Y2Nlc3NcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ubmFtZSA9IFwiZG8gYW5zd2VyXCI7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG5cbiAgICAgICAgLy8gXCJjb21wYXJlIG1lXCIgYnV0dG9uXG4gICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIGJ0bi1kZWZhdWx0XCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uaWQgPSB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24ubmFtZSA9IFwiY29tcGFyZVwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY29tcGFyZV9tZVwiKTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyZUZJVEJBbnN3ZXJzKCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jb21wYXJlQnV0dG9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJhbmRvbWl6ZSBidXR0b24gZm9yIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICAgIGlmICh0aGlzLmR5bl92YXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tZGVmYXVsdFwiO1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24uaWQgPSB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIjtcbiAgICAgICAgICAgIHRoaXMucmFuZG9taXplQnV0dG9uLm5hbWUgPSBcInJhbmRvbWl6ZVwiO1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9yYW5kb21pemVcIik7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmFuZG9taXplKCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5yYW5kb21pemVCdXR0b24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7XG4gICAgfVxuICAgIHJlbmRlckZJVEJGZWVkYmFja0RpdigpIHtcbiAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImFsZXJ0XCIpO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTGlzdC5hZGQoXCJmaXRiLWZlZWRiYWNrXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG5cbiAgICBjbGVhckZlZWRiYWNrRGl2KCkge1xuICAgICAgICAvLyBTZXR0aW5nIHRoZSBgYG91dGVySFRNTGBgIHJlbW92ZXMgdGhpcyBmcm9tIHRoZSBET00uIFVzZSBhbiBhbHRlcm5hdGl2ZSBwcm9jZXNzIC0tIHJlbW92ZSB0aGUgY2xhc3MgKHdoaWNoIG1ha2VzIGl0IHJlZC9ncmVlbiBiYXNlZCBvbiBncmFkaW5nKSBhbmQgY29udGVudC5cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiXCI7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG4gICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoKSB7XG4gICAgICAgIC8vIGBgdGhpcy5keW5fdmFyc2BgIGNhbiBiZSB0cnVlOyBpZiBzbywgZG9uJ3QgcmVuZGVyIGl0LCBzaW5jZSB0aGUgc2VydmVyIGRvZXMgYWxsIHRoZSByZW5kZXJpbmcuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbGV0IGh0bWxfbm9kZXM7XG4gICAgICAgICAgICBbaHRtbF9ub2RlcywgdGhpcy5keW5fdmFyc19ldmFsXSA9IHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgICAgICAgICAgICAgIHRoaXMuc2VlZCxcbiAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzLFxuICAgICAgICAgICAgICAgIHRoaXMuZHluX2ltcG9ydHMsXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LnJlcGxhY2VDaGlsZHJlbiguLi5odG1sX25vZGVzKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwuYWZ0ZXJDb250ZW50UmVuZGVyKHRoaXMuZHluX3ZhcnNfZXZhbCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgaW4gcHJvYmxlbSAke3RoaXMuZGl2aWR9IGludm9raW5nIGFmdGVyQ29udGVudFJlbmRlcmBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0dXBCbGFua3MoKSB7XG4gICAgICAgIC8vIEZpbmQgYW5kIGZvcm1hdCB0aGUgYmxhbmtzLiBJZiBhIGR5bmFtaWMgcHJvYmxlbSBqdXN0IGNoYW5nZWQgdGhlIEhUTUwsIHRoaXMgd2lsbCBmaW5kIHRoZSBuZXdseS1jcmVhdGVkIGJsYW5rcy5cbiAgICAgICAgLy8gV0FSTklORyAtIHRoaXMgYXNzdW1lcyB0aGF0IGFsbCB0ZXh0L251bWJlciBpbnB1dHMgaW4gdGhlIGRlc2NyaXB0aW9uRGl2IGFyZSB0aGUgYmxhbmtzLlxuICAgICAgICAvLyBJZGVhbGx5LCB0aGVyZSBzaG91bGQgYmUgc29tZSB1bmlxdWUgYXR0cmlidXRlIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VsZWN0IHRoZSBibGFua3MuXG4gICAgICAgIGNvbnN0IGJhID0gdGhpcy5kZXNjcmlwdGlvbkRpdi5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwidGV4dFwiXSxpbnB1dFt0eXBlPVwibnVtYmVyXCJdJyk7XG4gICAgICAgIGJhLmZvckVhY2goKGVsKSA9PiB7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcImlucHV0IGFyZWFcIik7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmJsYW5rQXJyYXkgPSBBcnJheS5mcm9tKGJhKTtcbiAgICAgICAgZm9yIChsZXQgYmxhbmsgb2YgdGhpcy5ibGFua0FycmF5KSB7XG4gICAgICAgICAgICBibGFuay5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsIHRoaXMucmVjb3JkQW5zd2VyZWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGlzIHRlbGxzIHRpbWVkIHF1ZXN0aW9ucyB0aGF0IHRoZSBmaXRiIGJsYW5rcyByZWNlaXZlZCBzb21lIGludGVyYWN0aW9uLlxuICAgIHJlY29yZEFuc3dlcmVkKCkge1xuICAgICAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvbG9hZGluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSB0aGUgc2VlZCBmaXJzdCwgc2luY2UgdGhlIGR5bmFtaWMgcmVuZGVyIGNsZWFycyBhbGwgdGhlIGJsYW5rcy5cbiAgICAgICAgdGhpcy5zZWVkID0gZGF0YS5zZWVkO1xuICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuXG4gICAgICAgIHZhciBhcnI7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZS5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFRoZSBuZXdlciBmb3JtYXQgZW5jb2RlcyBkYXRhIGFzIGEgSlNPTiBvYmplY3QuXG4gICAgICAgICAgICBhcnIgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgICAgICAgIC8vIFRoZSByZXN1bHQgc2hvdWxkIGJlIGFuIGFycmF5LiBJZiBub3QsIHRyeSBjb21tYSBwYXJzaW5nIGluc3RlYWQuXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIFRoZSBvbGQgZm9ybWF0IGRpZG4ndC5cbiAgICAgICAgICAgIGFyciA9IChkYXRhLmFuc3dlciB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhhc0Fuc3dlciA9IGZhbHNlO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ibGFua0FycmF5W2ldLnZhbHVlID0gYXJyW2ldIHx8IFwiXCI7XG4gICAgICAgICAgICBpZiAoYXJyW2ldKSB7XG4gICAgICAgICAgICAgICAgaGFzQW5zd2VyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJcyB0aGlzIGNsaWVudC1zaWRlIGdyYWRpbmcsIG9yIHNlcnZlci1zaWRlIGdyYWRpbmc/XG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIEZvciBjbGllbnQtc2lkZSBncmFkaW5nLCByZS1nZW5lcmF0ZSBmZWVkYmFjayBpZiB0aGVyZSdzIGFuIGFuc3dlci5cbiAgICAgICAgICAgIGlmIChoYXNBbnN3ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm9yIHNlcnZlci1zaWRlIGdyYWRpbmcsIHVzZSB0aGUgcHJvdmlkZWQgZmVlZGJhY2sgZnJvbSB0aGUgc2VydmVyIG9yIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gZGF0YS5kaXNwbGF5RmVlZDtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBkYXRhLmlzQ29ycmVjdEFycmF5O1xuICAgICAgICAgICAgLy8gT25seSByZW5kZXIgaWYgYWxsIHRoZSBkYXRhIGlzIHByZXNlbnQ7IGxvY2FsIHN0b3JhZ2UgbWlnaHQgaGF2ZSBvbGQgZGF0YSBtaXNzaW5nIHNvbWUgb2YgdGhlc2UgaXRlbXMuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuZGlzcGxheUZlZWQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgdGhpcy5jb3JyZWN0ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHRoaXMuaXNDb3JyZWN0QXJyYXkgIT09IFwidW5kZWZpbmVkXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBkeW5hbWljIHByb2JsZW1zLCBzaG93IHRoZSByZW5kZXJlZCBwcm9ibGVtIHRleHQuXG4gICAgICAgICAgICB0aGlzLnByb2JsZW1IdG1sID0gZGF0YS5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW1IdG1sKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwgPSB0aGlzLnByb2JsZW1IdG1sO1xuICAgICAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICAvLyBMb2FkcyBwcmV2aW91cyBhbnN3ZXJzIGZyb20gbG9jYWwgc3RvcmFnZSBpZiB0aGV5IGV4aXN0XG4gICAgICAgIHZhciBzdG9yZWREYXRhO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgaWYgKGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkRGF0YSA9IEpTT04ucGFyc2UoZXgpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcGFyc2luZyBzdG9yZWQgRklUQiBkYXRhIGZvciAke3RoaXMuZGl2aWR9OiAke2Vyci5tZXNzYWdlfWApO1xuICAgICAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnJvciB8fCBzdG9yZWREYXRhLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhzdG9yZWREYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIC8vIFN0YXJ0IG9mIHRoZSBldmFsdWF0aW9uIGNoYWluXG4gICAgICAgIHRoaXMuaXNDb3JyZWN0QXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCA9IFtdO1xuICAgICAgICBjb25zdCBwY2EgPSB0aGlzLnByZXBhcmVDaGVja0Fuc3dlcnMoKTtcblxuICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLmVuYWJsZUNvbXBhcmVNZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlQ29tcGFyZUJ1dHRvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR3JhZGUgbG9jYWxseSBpZiB3ZSBjYW4ndCBhc2sgdGhlIHNlcnZlciB0byBncmFkZS5cbiAgICAgICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIC8vIEFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgICAgICAgICAgICAvLyB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgICAgIC8vIEFuIGFycmF5IG9mIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbiAgICAgICAgICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgICAgICAgICAgICAgIHRoaXMucGVyY2VudCxcbiAgICAgICAgICAgIF0gPSBjaGVja0Fuc3dlcnNDb3JlKC4uLnBjYSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIElucHV0czpcbiAgICAvL1xuICAgIC8vIC0gU3RyaW5ncyBlbnRlcmVkIGJ5IHRoZSBzdHVkZW50IGluIGBgdGhpcy5ibGFua0FycmF5W2ldLnZhbHVlYGAuXG4gICAgLy8gLSBGZWVkYmFjayBpbiBgYHRoaXMuZmVlZGJhY2tBcnJheWBgLlxuICAgIHByZXBhcmVDaGVja0Fuc3dlcnMoKSB7XG4gICAgICAgIHRoaXMuZ2l2ZW5fYXJyID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIucHVzaCh0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUpO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdGhpcy5ibGFua05hbWVzLFxuICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIsXG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrQXJyYXksXG4gICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWwsXG4gICAgICAgIF07XG4gICAgfVxuXG4gICAgLy8gX2ByYW5kb21pemVgOiBUaGlzIGhhbmRsZXMgYSBjbGljayB0byB0aGUgXCJSYW5kb21pemVcIiBidXR0b24uXG4gICAgYXN5bmMgcmFuZG9taXplKCkge1xuICAgICAgICAvLyBVc2UgdGhlIGNsaWVudC1zaWRlIGNhc2Ugb3IgdGhlIHNlcnZlci1zaWRlIGNhc2U/XG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGNsaWVudC1zaWRlIGNhc2UuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5zZWVkID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMiAqKiAzMik7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckR5bmFtaWNDb250ZW50KCk7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmRlc2NyaXB0aW9uRGl2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHNlcnZlci1zaWRlIGNhc2UuIFNlbmQgYSByZXF1ZXN0IHRvIHRoZSBgcmVzdWx0cyA8Z2V0QXNzZXNzUmVzdWx0cz5gIGVuZHBvaW50IHdpdGggYGBuZXdfc2VlZGBgIHNldCB0byBUcnVlLlxuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFwiL2Fzc2Vzc21lbnQvcmVzdWx0c1wiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgY291cnNlOiBlQm9va0NvbmZpZy5jb3Vyc2UsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImZpbGxiXCIsXG4gICAgICAgICAgICAgICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgICAgICAgICAgICAgIG5ld19zZWVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoYEhUVFAgZXJyb3IgZ2V0dGluZyByZXN1bHRzOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGRhdGEuZGV0YWlsO1xuICAgICAgICAgICAgdGhpcy5zZWVkID0gcmVzLnNlZWQ7XG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHJlcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdoZW4gZ2V0dGluZyBhIG5ldyBzZWVkLCBjbGVhciBhbGwgdGhlIG9sZCBhbnN3ZXJzIGFuZCBmZWVkYmFjay5cbiAgICAgICAgdGhpcy5naXZlbl9hcnIgPSBBcnJheSh0aGlzLmJsYW5rQXJyYXkubGVuKS5maWxsKFwiXCIpO1xuICAgICAgICB0aGlzLmJsYW5rQXJyYXkuZm9yRWFjaCgoZWwpID0+IChlbC52YWx1ZSA9IFwiXCIpKTtcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrRGl2KCk7XG4gICAgICAgIHRoaXMuc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpO1xuICAgIH1cblxuICAgIC8vIFNhdmUgdGhlIGFuc3dlcnMgYW5kIGFzc29jaWF0ZWQgZGF0YSBsb2NhbGx5OyBkb24ndCBzYXZlIGZlZWRiYWNrIHByb3ZpZGVkIGJ5IHRoZSBzZXJ2ZXIgZm9yIHRoaXMgYW5zd2VyLiBJdCBhc3N1bWVzIHRoYXQgYGB0aGlzLmdpdmVuX2FycmBgIGNvbnRhaW5zIHRoZSBjdXJyZW50IGFuc3dlcnMuXG4gICAgc2F2ZUFuc3dlcnNMb2NhbGx5T25seSgpIHtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgLy8gVGhlIHNlZWQgaXMgdXNlZCBmb3IgY2xpZW50LXNpZGUgb3BlcmF0aW9uLCBidXQgZG9lc24ndCBtYXR0ZXIgZm9yIHNlcnZlci1zaWRlLlxuICAgICAgICAgICAgc2VlZDogdGhpcy5zZWVkLFxuICAgICAgICAgICAgYW5zd2VyOiBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2FyciksXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgICAgICAvLyBUaGlzIGlzIG9ubHkgbmVlZGVkIGZvciBzZXJ2ZXItc2lkZSBncmFkaW5nIHdpdGggZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgICAgICAgIHByb2JsZW1IdG1sOiB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gX2Bsb2dDdXJyZW50QW5zd2VyYDogU2F2ZSB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgcHJvYmxlbSB0byBsb2NhbCBzdG9yYWdlIGFuZCB0aGUgc2VydmVyOyBkaXNwbGF5IHNlcnZlciBmZWVkYmFjay5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpO1xuICAgICAgICBsZXQgZmVlZGJhY2sgPSB0cnVlO1xuICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgbG9jYWxseS5cbiAgICAgICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gICAgICAgIC8vIFNhdmUgdGhlIGFuc3dlciB0byB0aGUgc2VydmVyLlxuICAgICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGFjdDogYW5zd2VyIHx8IFwiXCIsXG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIHBlcmNlbnQ6IHRoaXMucGVyY2VudCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuc2lkID0gc2lkO1xuICAgICAgICAgICAgZmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzZXJ2ZXJfZGF0YSA9IGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGRhdGEpO1xuICAgICAgICBpZiAoIWZlZWRiYWNrKSByZXR1cm47XG4gICAgICAgIC8vIE5vbi1zZXJ2ZXIgc2lkZSBncmFkZWQgcHJvYmxlbXMgYXJlIGRvbmUgYXQgdGhpcyBwb2ludDsgbGlrZXdpc2UsIHN0b3AgaGVyZSBpZiB0aGUgc2VydmVyIGRpZG4ndCByZXNwb25kLlxuICAgICAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5IHx8ICFzZXJ2ZXJfZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gT24gc3VjY2VzcywgdXBkYXRlIHRoZSBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIncyBncmFkZS5cbiAgICAgICAgY29uc3QgcmVzID0gc2VydmVyX2RhdGEuZGV0YWlsO1xuICAgICAgICB0aGlzLnRpbWVzdGFtcCA9IHJlcy50aW1lc3RhbXA7XG4gICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSByZXMuZGlzcGxheUZlZWQ7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IHJlcy5jb3JyZWN0O1xuICAgICAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gcmVzLmlzQ29ycmVjdEFycmF5O1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXAsXG4gICAgICAgICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgICAgICAgICBkaXNwbGF5RmVlZDogdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5OiB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICByZXR1cm4gc2VydmVyX2RhdGE7XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gRXZhbHVhdGlvbiBvZiBhbnN3ZXIgYW5kID09PVxuICAgID09PSAgICAgZGlzcGxheSBmZWVkYmFjayAgICAgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm8gZml0Yi1mZWVkYmFja1wiO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbal0uY2xhc3NMaXN0LnJlbW92ZShcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0NvcnJlY3RBcnJheVtqXSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbal0uY2xhc3NMaXN0LmFkZChcImlucHV0LXZhbGlkYXRpb24tZXJyb3JcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ibGFua0FycmF5W2pdLmNsYXNzTGlzdC5yZW1vdmUoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1kYW5nZXIgZml0Yi1mZWVkYmFja1wiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmZWVkYmFja19odG1sID0gXCI8dWw+XCI7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kaXNwbGF5RmVlZC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRmID0gdGhpcy5kaXNwbGF5RmVlZFtpXTtcbiAgICAgICAgICAgIGxldCBmbSA9ICh0aGlzLmlzQ29ycmVjdEFycmF5W2ldID09PSB0cnVlKSA/ICfinJTvuI8nIDogJ+Kclu+4jyc7XG4gICAgICAgICAgICAvLyBSZW5kZXIgYW55IGR5bmFtaWMgZmVlZGJhY2sgaW4gdGhlIHByb3ZpZGVkIGZlZWRiYWNrLCBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZyBvZiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgZGYgPSByZW5kZXJEeW5hbWljRmVlZGJhY2soXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naXZlbl9hcnIsXG4gICAgICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgICAgIGRmLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmR5bl92YXJzX2V2YWxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIHJldHVybmVkIE5vZGVMaXN0IGludG8gYSBzdHJpbmcgb2YgSFRNTC5cbiAgICAgICAgICAgICAgICBkZiA9IChkZj8uWzBdICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgID8gZGZbMF0ucGFyZW50RWxlbWVudC5pbm5lckhUTUxcbiAgICAgICAgICAgICAgICAgICAgOiBcIk5vIGZlZWRiYWNrIHByb3ZpZGVkXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmZWVkYmFja19odG1sICs9IGA8bGk+JHtmbX0gJHtkZn08L2xpPmA7XG4gICAgICAgIH1cbiAgICAgICAgZmVlZGJhY2tfaHRtbCArPSBcIjwvdWw+XCI7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdCBpZiBpdCdzIGp1c3Qgb25lIGVsZW1lbnQuXG4gICAgICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBmZWVkYmFja19odG1sID0gZmVlZGJhY2tfaHRtbC5zbGljZShcbiAgICAgICAgICAgICAgICBcIjx1bD48bGk+XCIubGVuZ3RoLFxuICAgICAgICAgICAgICAgIC1cIjwvbGk+PC91bD5cIi5sZW5ndGhcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBmZWVkYmFja19odG1sO1xuICAgICAgICBpZiAodHlwZW9mIE1hdGhKYXggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEZ1bmN0aW9ucyBmb3IgY29tcGFyZSBidXR0b24gPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgZW5hYmxlQ29tcGFyZUJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIF9gY29tcGFyZUZJVEJBbnN3ZXJzYFxuICAgIGFzeW5jIGNvbXBhcmVGSVRCQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZGF0YSk7XG4gICAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2goYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0dG9wMTBBbnN3ZXJzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVGSVRCKGpzb24pO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgdG9wIGFuc3dlcnM6XCIsIGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbXBhcmVGSVRCKGRhdGEsIHN0YXR1cywgd2hhdGV2ZXIpIHtcbiAgICAgICAgdmFyIGFuc3dlcnMgPSBkYXRhLmRldGFpbC5yZXM7XG4gICAgICAgIHZhciBtaXNjID0gZGF0YS5kZXRhaWwubWlzY2RhdGE7XG4gICAgICAgIHZhciBib2R5ID0gXCI8dGFibGU+XCI7XG4gICAgICAgIGJvZHkgKz0gXCI8dHI+PHRoPkFuc3dlcjwvdGg+PHRoPkNvdW50PC90aD48L3RyPlwiO1xuICAgICAgICBmb3IgKHZhciByb3cgaW4gYW5zd2Vycykge1xuICAgICAgICAgICAgYm9keSArPVxuICAgICAgICAgICAgICAgIFwiPHRyPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgYW5zd2Vyc1tyb3ddLmFuc3dlciArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgYW5zd2Vyc1tyb3ddLmNvdW50ICtcbiAgICAgICAgICAgICAgICBcIiB0aW1lczwvdGQ+PC90cj5cIjtcbiAgICAgICAgfVxuICAgICAgICBib2R5ICs9IFwiPC90YWJsZT5cIjtcbiAgICAgICAgdmFyIGh0bWwgPVxuICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdtb2RhbCBmYWRlJz5cIiArXG4gICAgICAgICAgICBcIiAgICA8ZGl2IGNsYXNzPSdtb2RhbC1kaWFsb2cgY29tcGFyZS1tb2RhbCc+XCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWNvbnRlbnQnPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtaGVhZGVyJz5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9J2J1dHRvbicgY2xhc3M9J2Nsb3NlJyBhcmlhLWhpZGRlbj0ndHJ1ZSc+JnRpbWVzOzwvYnV0dG9uPlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgIDxoNCBjbGFzcz0nbW9kYWwtdGl0bGUnPlRvcCBBbnN3ZXJzPC9oND5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPGRpdiBjbGFzcz0nbW9kYWwtYm9keSc+XCIgK1xuICAgICAgICAgICAgYm9keSArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDwvZGl2PlwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIiAgICA8L2Rpdj5cIiArXG4gICAgICAgICAgICBcIjwvZGl2PlwiO1xuICAgICAgICAvLyBTaW1wbGUgbW9kYWwgd2l0aG91dCBCb290c3RyYXAvalF1ZXJ5XG4gICAgICAgIGNvbnN0IG92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBvdmVybGF5LnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgICBvdmVybGF5LnN0eWxlLmluc2V0ID0gXCIwXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuYmFja2dyb3VuZCA9IFwicmdiYSgwLDAsMCwwLjUpXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuekluZGV4ID0gXCI5OTk5XCI7XG5cbiAgICAgICAgY29uc3QgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGlhbG9nLmNsYXNzTmFtZSA9IFwiY29tcGFyZS1tb2RhbFwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUubWF4V2lkdGggPSBcIjcyMHB4XCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5tYXJnaW4gPSBcIjEwdmggYXV0b1wiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2ZmZlwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCI2cHhcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLmJveFNoYWRvdyA9IFwiMCAycHggMTJweCByZ2JhKDAsMCwwLDAuMylcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLnBhZGRpbmcgPSBcIjE2cHhcIjtcblxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGNsb3NlQnRuLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICBjbG9zZUJ0bi50ZXh0Q29udGVudCA9IFwiw5dcIjtcbiAgICAgICAgY2xvc2VCdG4uc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICBjbG9zZUJ0bi5zdHlsZS5mbG9hdCA9IFwicmlnaHRcIjtcbiAgICAgICAgY2xvc2VCdG4uY2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCI7XG4gICAgICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG92ZXJsYXkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJtb2RhbC10aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiVG9wIEFuc3dlcnNcIjtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGNsb3NlQnRuKTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgICAgICBjb25zdCBtb2RhbEJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBtb2RhbEJvZHkuaW5uZXJIVE1MID0gYm9keTtcblxuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKG1vZGFsQm9keSk7XG4gICAgICAgIG92ZXJsYXkuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmJsYW5rQXJyYXlbaV0uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnRcbiAgICAgICAgLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9ZmlsbGludGhlYmxhbmtdXCIpXG4gICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgICAgIG9yaWc6IGVsLFxuICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoIWVsLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIEZJVEJMaXN0W2VsLmlkXSA9IG5ldyBGSVRCKG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IEZJVEJMaXN0W2VsLmlkXTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5hc3NlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBFcnJvciByZW5kZXJpbmcgRmlsbCBpbiB0aGUgQmxhbmsgUHJvYmxlbSAke2VsLmlkfVxuICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59KTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBncmFkaW5nLXJlbGF0ZWQgdXRpbGl0aWVzIGZvciBGSVRCIHF1ZXN0aW9uc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgY29kZSBydW5zIGJvdGggb24gdGhlIHNlcnZlciAoZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpIGFuZCBvbiB0aGUgY2xpZW50LiBJdCdzIHBsYWNlZCBoZXJlIGFzIGEgc2V0IG9mIGZ1bmN0aW9ucyBzcGVjaWZpY2FsbHkgZm9yIHRoaXMgcHVycG9zZS5cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7IGFsZWFQUk5HIH0gZnJvbSBcIi4vbGlicy9hbGVhUFJORy0xLjEuanNcIjtcblxuLy8gSW5jbHVkZXNcbi8vID09PT09PT09XG4vLyBOb25lLlxuLy9cbi8vXG4vLyBHbG9iYWxzXG4vLyA9PT09PT09XG5mdW5jdGlvbiByZW5kZXJfaHRtbChodG1sX2luLCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gQ2hhbmdlIHRoZSByZXBsYWNlbWVudCB0b2tlbnMgaW4gdGhlIEhUTUwgaW50byB0YWdzLCBzbyB3ZSBjYW4gcmVwbGFjZSB0aGVtIHVzaW5nIFhNTC4gVGhlIGhvcnJpYmxlIHJlZ2V4IGlzOlxuICAgIC8vXG4gICAgLy8gTG9vayBmb3IgdGhlIGNoYXJhY3RlcnMgYGBbJT1gYCAodGhlIG9wZW5pbmcgZGVsaW1pdGVyKVxuICAgIC8vLyBcXFslPVxuICAgIC8vIEZvbGxvd2VkIGJ5IGFueSBhbW91bnQgb2Ygd2hpdGVzcGFjZS5cbiAgICAvLy8gXFxzKlxuICAgIC8vIFN0YXJ0IGEgZ3JvdXAgdGhhdCB3aWxsIGNhcHR1cmUgdGhlIGNvbnRlbnRzIChleGNsdWRpbmcgd2hpdGVzcGFjZSkgb2YgdGhlIHRva2Vucy4gRm9yIGV4YW1wbGUsIGdpdmVuIGBgWyU9IGZvbygpICVdYGAsIHRoZSBjb250ZW50cyBpcyBgYGZvbygpYGAuXG4gICAgLy8vIChcbiAgICAvLyBEb24ndCBjYXB0dXJlIHRoZSBjb250ZW50cyBvZiB0aGlzIGdyb3VwLCBzaW5jZSBpdCdzIG9ubHkgYSBzaW5nbGUgY2hhcmFjdGVyLiBNYXRjaCBhbnkgY2hhcmFjdGVyLi4uXG4gICAgLy8vIChcbiAgICAvLy8gPzouXG4gICAgLy8vIC4uLnRoYXQgZG9lc24ndCBlbmQgd2l0aCBgYCVdYGAgKHRoZSBjbG9zaW5nIGRlbGltaXRlcikuXG4gICAgLy8vICg/ISVdKVxuICAgIC8vLyApXG4gICAgLy8gTWF0Y2ggdGhpcyAoYW55dGhpbmcgYnV0IHRoZSBjbG9zaW5nIGRlbGltaXRlcikgYXMgbXVjaCBhcyB3ZSBjYW4uXG4gICAgLy8vICopXG4gICAgLy8gTmV4dCwgbG9vayBmb3IgYW55IHdoaXRlc3BhY2UuXG4gICAgLy8vIFxccypcbiAgICAvLyBGaW5hbGx5LCBsb29rIGZvciB0aGUgY2xvc2luZyBkZWxpbWl0ZXIgYGAlXWBgLlxuICAgIC8vLyAlXFxdXG4gICAgY29uc3QgaHRtbF9yZXBsYWNlZCA9IGh0bWxfaW4ucmVwbGFjZUFsbChcbiAgICAgICAgL1xcWyU9XFxzKigoPzouKD8hJV0pKSopXFxzKiVcXF0vZyxcbiAgICAgICAgLy8gUmVwbGFjZSBpdCB3aXRoIGEgYDxzY3JpcHQtZXZhbD5gIHRhZy4gUXVvdGUgdGhlIHN0cmluZywgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGVzY2FwZSBhbnkgZG91YmxlIHF1b3RlcywgdXNpbmcgSlNPTi5cbiAgICAgICAgKG1hdGNoLCBncm91cDEpID0+XG4gICAgICAgICAgICBgPHNjcmlwdC1ldmFsIGV4cHI9JHtKU09OLnN0cmluZ2lmeShncm91cDEpfT48L3NjcmlwdC1ldmFsPmBcbiAgICApO1xuICAgIC8vIEdpdmVuIEhUTUwsIHR1cm4gaXQgaW50byBhIERPTS4gV2FsayB0aGUgYGA8c2NyaXB0LWV2YWw+YGAgdGFncywgcGVyZm9ybWluZyB0aGUgcmVxdWVzdGVkIGV2YWx1YXRpb24gb24gdGhlbS5cbiAgICAvL1xuICAgIC8vIFNlZSBgRE9NUGFyc2VyIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRE9NUGFyc2VyPmBfLlxuICAgIGNvbnN0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAvLyBTZWUgYERPTVBhcnNlci5wYXJzZUZyb21TdHJpbmcoKSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0RPTVBhcnNlci9wYXJzZUZyb21TdHJpbmc+YF8uXG4gICAgY29uc3QgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyhodG1sX3JlcGxhY2VkLCBcInRleHQvaHRtbFwiKTtcbiAgICBjb25zdCBzY3JpcHRfZXZhbF90YWdzID0gZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0LWV2YWxcIik7XG4gICAgd2hpbGUgKHNjcmlwdF9ldmFsX3RhZ3MubGVuZ3RoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgZmlyc3QgdGFnLiBJdCB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGUgY29sbGVjdGlvbiBhZnRlciBpdCdzIHJlcGxhY2VkIHdpdGggaXRzIHZhbHVlLlxuICAgICAgICBjb25zdCBzY3JpcHRfZXZhbF90YWcgPSBzY3JpcHRfZXZhbF90YWdzWzBdO1xuICAgICAgICAvLyBTZWUgaWYgdGhpcyBgYDxzY3JpcHQtZXZhbD5gYCB0YWcgaGFzIGFzIGBgQGV4cHJgYCBhdHRyaWJ1dGUuXG4gICAgICAgIGNvbnN0IGV4cHIgPSBzY3JpcHRfZXZhbF90YWcuZ2V0QXR0cmlidXRlKFwiZXhwclwiKTtcbiAgICAgICAgLy8gSWYgc28sIGV2YWx1YXRlIGl0LlxuICAgICAgICBpZiAoZXhwcikge1xuICAgICAgICAgICAgY29uc3QgZXZhbF9yZXN1bHQgPSB3aW5kb3cuRnVuY3Rpb24oXG4gICAgICAgICAgICAgICAgXCJ2XCIsXG4gICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2V4cHJ9O2BcbiAgICAgICAgICAgICkoZHluX3ZhcnNfZXZhbCwgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSk7XG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB0YWcgd2l0aCB0aGUgcmVzdWx0aW5nIHZhbHVlLlxuICAgICAgICAgICAgc2NyaXB0X2V2YWxfdGFnLnJlcGxhY2VXaXRoKGV2YWxfcmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgYm9keSBjb250ZW50cy4gTm90ZSB0aGF0IHRoZSBgYERPTVBhcnNlcmBgIGNvbnN0cnVjdHMgYW4gZW50aXJlIGRvY3VtZW50LCBub3QganVzdCB0aGUgZG9jdW1lbnQgZnJhZ21lbnQgd2UgcGFzc2VkIGl0LiBUaGVyZWZvcmUsIGV4dHJhY3QgdGhlIGRlc2lyZWQgZnJhZ21lbnQgYW5kIHJldHVybiB0aGF0LiBOb3RlIHRoYXQgd2UgbmVlZCB0byB1c2UgYGNoaWxkTm9kZXMgPGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlL2NoaWxkTm9kZXM+YF8sIHdoaWNoIGluY2x1ZGVzIG5vbi1lbGVtZW50IGNoaWxkcmVuIGxpa2UgdGV4dCBhbmQgY29tbWVudHM7IHVzaW5nIGBgY2hpbGRyZW5gYCBvbWl0cyB0aGVzZSBub24tZWxlbWVudCBjaGlsZHJlbi5cbiAgICByZXR1cm4gZG9jLmJvZHkuY2hpbGROb2Rlcztcbn1cblxuLy8gRnVuY3Rpb25zXG4vLyA9PT09PT09PT1cbi8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNDb250ZW50KFxuICAgIHNlZWQsXG4gICAgZHluX3ZhcnMsXG4gICAgZHluX2ltcG9ydHMsXG4gICAgaHRtbF9pbixcbiAgICBkaXZpZCxcbiAgICBwcmVwYXJlQ2hlY2tBbnN3ZXJzXG4pIHtcbiAgICAvLyBJbml0aWFsaXplIFJORyB3aXRoIGBgc2VlZGBgLlxuICAgIGNvbnN0IHJhbmQgPSBhbGVhUFJORyhzZWVkKTtcblxuICAgIC8vIFNlZSBgUkFORF9GVU5DIDxSQU5EX0ZVTkM+YF8sIHdoaWNoIHJlZmVycyB0byBgYHJhbmRgYCBhYm92ZS5cbiAgICBjb25zdCBkeW5fdmFyc19ldmFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICBcInZcIixcbiAgICAgICAgXCJyYW5kXCIsXG4gICAgICAgIC4uLk9iamVjdC5rZXlzKGR5bl9pbXBvcnRzKSxcbiAgICAgICAgYFwidXNlIHN0cmljdFwiO1xcbiR7ZHluX3ZhcnN9O1xcbnJldHVybiB2O2BcbiAgICApKFxuICAgICAgICAvLyBXZSB3YW50IHYuZGl2aWQgPSBkaXZpZCBhbmQgdi5wcmVwYXJlQ2hlY2tBbnN3ZXJzID0gcHJlcGFyZUNoZWNrQW5zd2Vycy4gSW4gY29udHJhc3QsIHRoZSBrZXkvdmFsdWVzIHBhaXJzIG9mIGR5bl9pbXBvcnRzIHNob3VsZCBiZSBkaXJlY3RseSBhc3NpZ25lZCB0byB2LCBoZW5jZSB0aGUgT2JqZWN0LmFzc2lnbi5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih7IGRpdmlkLCBwcmVwYXJlQ2hlY2tBbnN3ZXJzfSwgZHluX2ltcG9ydHMpLFxuICAgICAgICByYW5kLFxuICAgICAgICAvLyBJbiBhZGRpdGlvbiB0byBwcm92aWRpbmcgdGhpcyBpbiB2LCBtYWtlIGl0IGF2YWlsYWJsZSBpbiB0aGUgZnVuY3Rpb24gYXMgd2VsbCwgc2luY2UgbW9zdCBwcm9ibGVtIGF1dGhvcnMgd2lsbCB3cml0ZSBgYGZvbyA9IG5ldyBCVE0oKWBgIChmb3IgZXhhbXBsZSwgYXNzdW1pbmcgQlRNIGlzIGluIGR5bl9pbXBvcnRzKSBpbnN0ZWFkIG9mIGBgZm9vID0gbmV3IHYuQlRNKClgYCAod2hpY2ggaXMgdW51c3VhbCBzeW50YXgpLlxuICAgICAgICAuLi5PYmplY3QudmFsdWVzKGR5bl9pbXBvcnRzKSk7XG5cbiAgICBsZXQgaHRtbF9vdXQ7XG4gICAgaWYgKHR5cGVvZiBkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDb250ZW50UmVuZGVyKGR5bl92YXJzX2V2YWwpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLFxuICAgICAgICAgICAgICAgIGBFcnJvciBpbiBwcm9ibGVtICR7ZGl2aWR9IGludm9raW5nIGJlZm9yZUNvbnRlbnRSZW5kZXJgXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGh0bWxfb3V0ID0gcmVuZGVyX2h0bWwoaHRtbF9pbiwgZHluX3ZhcnNfZXZhbCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBgRXJyb3IgcmVuZGVyaW5nIHByb2JsZW0gJHtkaXZpZH0gdGV4dC5gKTtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIC8vIHRoZSBhZnRlckNvbnRlbnRSZW5kZXIgZXZlbnQgd2lsbCBiZSBjYWxsZWQgYnkgdGhlIGNhbGxlciBvZiB0aGlzIGZ1bmN0aW9uIChhZnRlciBpdCB1cGRhdGVkIHRoZSBIVE1MIGJhc2VkIG9uIHRoZSBjb250ZW50cyBvZiBodG1sX291dCkuXG4gICAgcmV0dXJuIFtodG1sX291dCwgZHluX3ZhcnNfZXZhbF07XG59XG5cbi8vIEdpdmVuIHN0dWRlbnQgYW5zd2VycywgZ3JhZGUgdGhlbSBhbmQgcHJvdmlkZSBmZWVkYmFjay5cbi8vXG4vLyBPdXRwdXRzOlxuLy9cbi8vIC0gICAgYGBkaXNwbGF5RmVlZGBgIGlzIGFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4vLyAtICAgIGBgaXNDb3JyZWN0QXJyYXlgYCBpcyBhbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4vLyAtICAgIGBgY29ycmVjdGBgIGlzIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBwZXJjZW50YGAgaXMgdGhlIHBlcmNlbnRhZ2Ugb2YgY29ycmVjdCBhbnN3ZXJzIChmcm9tIDAgdG8gMSwgbm90IDAgdG8gMTAwKS5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0Fuc3dlcnNDb3JlKFxuICAgIC8vIF9gYmxhbmtOYW1lc0RpY3RgOiBBbiBkaWN0IG9mIHtibGFua19uYW1lLCBibGFua19pbmRleH0gc3BlY2lmeWluZyB0aGUgbmFtZSBmb3IgZWFjaCBuYW1lZCBibGFuay5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBfYGdpdmVuX2FycmA6IEFuIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyBzdHVkZW50LXByb3ZpZGVkIGFuc3dlcnMgZm9yIGVhY2ggYmxhbmsuXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIEEgMi1EIGFycmF5IG9mIHN0cmluZ3MgZ2l2aW5nIGZlZWRiYWNrIGZvciBlYWNoIGJsYW5rLlxuICAgIGZlZWRiYWNrQXJyYXksXG4gICAgLy8gX2BkeW5fdmFyc19ldmFsYDogQSBkaWN0IHByb2R1Y2VkIGJ5IGV2YWx1YXRpbmcgdGhlIEphdmFTY3JpcHQgZm9yIGEgZHluYW1pYyBleGVyY2lzZS5cbiAgICBkeW5fdmFyc19ldmFsXG4pIHtcbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzID09PSBcImZ1bmN0aW9uXCJcbiAgICApIHtcbiAgICAgICAgY29uc3QgW25hbWVkQmxhbmtWYWx1ZXMsIGdpdmVuX2Fycl9jb252ZXJ0ZWRdID0gcGFyc2VBbnN3ZXJzKFxuICAgICAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGR2ZV9ibGFua3MgPSBPYmplY3QuYXNzaWduKHt9LCBkeW5fdmFyc19ldmFsLCBuYW1lZEJsYW5rVmFsdWVzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzKGR2ZV9ibGFua3MsIGdpdmVuX2Fycl9jb252ZXJ0ZWQpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuYXNzZXJ0KGZhbHNlLCBcIkVycm9yIGNhbGxpbmcgYmVmb3JlQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gS2VlcCB0cmFjayBpZiBhbGwgYW5zd2VycyBhcmUgY29ycmVjdCBvciBub3QuXG4gICAgbGV0IGNvcnJlY3QgPSB0cnVlO1xuICAgIGNvbnN0IGlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgY29uc3QgZGlzcGxheUZlZWQgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdpdmVuX2Fyci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBnaXZlbiA9IGdpdmVuX2FycltpXTtcbiAgICAgICAgLy8gSWYgdGhpcyBibGFuayBpcyBlbXB0eSwgcHJvdmlkZSBubyBmZWVkYmFjayBmb3IgaXQuXG4gICAgICAgIGlmIChnaXZlbiA9PT0gXCJcIikge1xuICAgICAgICAgICAgaXNDb3JyZWN0QXJyYXkucHVzaChudWxsKTtcbiAgICAgICAgICAgIC8vIFRPRE86IHdhcyAkLmkxOG4oXCJtc2dfbm9fYW5zd2VyXCIpLlxuICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChcIk5vIGFuc3dlciBwcm92aWRlZC5cIik7XG4gICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBMb29rIHRocm91Z2ggYWxsIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLiBUaGUgbGFzdCBlbGVtZW50IGluIHRoZSBhcnJheSBhbHdheXMgbWF0Y2hlcy4gSWYgbm8gZmVlZGJhY2sgZm9yIHRoaXMgYmxhbmsgZXhpc3RzLCB1c2UgYW4gZW1wdHkgbGlzdC5cbiAgICAgICAgICAgIGNvbnN0IGZibCA9IGZlZWRiYWNrQXJyYXlbaV0gfHwgW107XG4gICAgICAgICAgICBsZXQgajtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBmYmwubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAvLyBUaGUgbGFzdCBpdGVtIG9mIGZlZWRiYWNrIGFsd2F5cyBtYXRjaGVzLlxuICAgICAgICAgICAgICAgIGlmIChqID09PSBmYmwubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSByZWdleHAuLi5cbiAgICAgICAgICAgICAgICBpZiAoXCJyZWdleFwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXR0ID0gUmVnRXhwKFxuICAgICAgICAgICAgICAgICAgICAgICAgZmJsW2pdW1wicmVnZXhcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleEZsYWdzXCJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXR0LnRlc3QoZ2l2ZW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIm51bWJlclwiIGluIGZibFtqXSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBbbWluLCBtYXhdID0gZmJsW2pdW1wibnVtYmVyXCJdO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSBnaXZlbiBzdHJpbmcgdG8gYSBudW1iZXIuIFdoaWxlIHRoZXJlIGFyZSBgbG90cyBvZiB3YXlzIDxodHRwczovL2NvZGVyd2FsbC5jb20vcC81dGxobXcvY29udmVydGluZy1zdHJpbmdzLXRvLW51bWJlci1pbi1qYXZhc2NyaXB0LXBpdGZhbGxzPmBfIHRvIGRvIHRoaXM7IHRoaXMgdmVyc2lvbiBzdXBwb3J0cyBvdGhlciBiYXNlcyAoaGV4L2JpbmFyeS9vY3RhbCkgYXMgd2VsbCBhcyBmbG9hdHMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9ICtnaXZlbjtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA+PSBtaW4gJiYgYWN0dWFsIDw9IG1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBkeW5hbWljIHNvbHV0aW9uLCB0aGV5IHNob3VsZCBwcm92aWRlIGEgdGVzdGluZyBmdW5jdGlvblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZHluX3ZhcnNfZXZhbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VBbnN3ZXJzKGJsYW5rTmFtZXNEaWN0LCBnaXZlbl9hcnIsIGR5bl92YXJzX2V2YWwpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSB3YXMgYSBwYXJzZSBlcnJvciwgdGhlbiBpdCBzdHVkZW50J3MgYW5zd2VyIGlzIGluY29ycmVjdC5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0gaW5zdGFuY2VvZiBUeXBlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZ2l2ZW5fYXJyX2NvbnZlcnRlZFtpXS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvdW50IHRoaXMgYXMgd3JvbmcgYnkgbWFraW5nIGogIT0gMCAtLSBzZWUgdGhlIGNvZGUgdGhhdCBydW5zIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBleGVjdXRpbmcgdGhlIGJyZWFrLlxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBmdW5jdGlvbiB0byB3cmFwIHRoZSBleHByZXNzaW9uIHRvIGV2YWx1YXRlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vRnVuY3Rpb24uXG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIGFuc3dlciwgYXJyYXkgb2YgYWxsIGFuc3dlcnMsIHRoZW4gYWxsIGVudHJpZXMgaW4gYGB0aGlzLmR5bl92YXJzX2V2YWxgYCBkaWN0IGFzIGZ1bmN0aW9uIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzX2VxdWFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zX2FycmF5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC5rZXlzKG5hbWVkQmxhbmtWYWx1ZXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2BcbiAgICAgICAgICAgICAgICAgICAgKShcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LnZhbHVlcyhkeW5fdmFyc19ldmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMobmFtZWRCbGFua1ZhbHVlcylcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc3R1ZGVudCdzIGFuc3dlciBpcyBlcXVhbCB0byB0aGlzIGl0ZW0sIHRoZW4gYXBwZW5kIHRoaXMgaXRlbSdzIGZlZWRiYWNrLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGlzX2VxdWFsID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaXNfZXF1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYmxbal1bXCJmZWVkYmFja1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBOT1QgYSBkeW5hbWljIHNvbHV0aW9uLCBidXQgZ2l2ZW4gYSB0ZXN0aW5nIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcInNvbHV0aW9uX2NvZGVcIiBpbiBmYmxbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdG8gd3JhcCB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL0Z1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBhbnN3ZXIsIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGVuIGFsbCBlbnRyaWVzIGluIGBgdGhpcy5keW5fdmFyc19ldmFsYGAgZGljdCBhcyBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc19lcXVhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc19hcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYFwidXNlIHN0cmljdDtcIlxcbnJldHVybiAke2ZibFtqXVtcInNvbHV0aW9uX2NvZGVcIl19O2BcbiAgICAgICAgICAgICAgICAgICAgKShnaXZlbiwgZ2l2ZW5fYXJyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc3R1ZGVudCdzIGFuc3dlciBpcyBlcXVhbCB0byB0aGlzIGl0ZW0sIHRoZW4gYXBwZW5kIHRoaXMgaXRlbSdzIGZlZWRiYWNrLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNfZXF1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIGlzX2VxdWFsID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gaXNfZXF1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmYmxbal1bXCJmZWVkYmFja1wiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5kZWZpbmVkIG1ldGhvZCBvZiB0ZXN0aW5nLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcIm51bWJlclwiIGluIGZibFtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgYW5zd2VyIGlzIGNvcnJlY3QgaWYgaXQgbWF0Y2hlZCB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkuIEEgc3BlY2lhbCBjYXNlOiBpZiBvbmx5IG9uZSBhbnN3ZXIgaXMgcHJvdmlkZWQsIGNvdW50IGl0IHdyb25nOyB0aGlzIGlzIGEgbWlzZm9ybWVkIHByb2JsZW0uXG4gICAgICAgICAgICBjb25zdCBpc19jb3JyZWN0ID0gaiA9PT0gMCAmJiBmYmwubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2goaXNfY29ycmVjdCk7XG4gICAgICAgICAgICBpZiAoIWlzX2NvcnJlY3QpIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAgIGR5bl92YXJzX2V2YWwgJiZcbiAgICAgICAgdHlwZW9mIGR5bl92YXJzX2V2YWwuYWZ0ZXJDaGVja0Fuc3dlcnMgPT09IFwiZnVuY3Rpb25cIlxuICAgICkge1xuICAgICAgICBjb25zdCBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF0gPSBwYXJzZUFuc3dlcnMoXG4gICAgICAgICAgICBibGFua05hbWVzRGljdCxcbiAgICAgICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgXCJFcnJvciBjYWxsaW5nIGFmdGVyQ2hlY2tBbnN3ZXJzXCIpO1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcGVyY2VudCA9XG4gICAgICAgIGlzQ29ycmVjdEFycmF5LmZpbHRlcihCb29sZWFuKS5sZW5ndGggLyBpc0NvcnJlY3RBcnJheS5sZW5ndGg7XG4gICAgcmV0dXJuIFtkaXNwbGF5RmVlZCwgY29ycmVjdCwgaXNDb3JyZWN0QXJyYXksIHBlcmNlbnRdO1xufVxuXG4vLyBVc2UgdGhlIHByb3ZpZGVkIHBhcnNlcnMgdG8gY29udmVydCBhIHN0dWRlbnQncyBhbnN3ZXJzIChhcyBzdHJpbmdzKSB0byB0aGUgdHlwZSBwcm9kdWNlZCBieSB0aGUgcGFyc2VyIGZvciBlYWNoIGJsYW5rLlxuZnVuY3Rpb24gcGFyc2VBbnN3ZXJzKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFNlZSBgZHluX3ZhcnNfZXZhbGAuXG4gICAgZHluX3ZhcnNfZXZhbFxuKSB7XG4gICAgLy8gUHJvdmlkZSBhIGRpY3Qgb2Yge2JsYW5rX25hbWUsIGNvbnZlcnRlcl9hbnN3ZXJfdmFsdWV9LlxuICAgIGNvbnN0IG5hbWVkQmxhbmtWYWx1ZXMgPSBnZXROYW1lZEJsYW5rVmFsdWVzKFxuICAgICAgICBnaXZlbl9hcnIsXG4gICAgICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgKTtcbiAgICAvLyBJbnZlcnQgYmxhbmtOYW1lZERpY3Q6IGNvbXB1dGUgYW4gYXJyYXkgb2YgW2JsYW5rXzBfbmFtZSwgLi4uXS4gTm90ZSB0aGF0IHRoZSBhcnJheSBtYXkgYmUgc3BhcnNlOiBpdCBvbmx5IGNvbnRhaW5zIHZhbHVlcyBmb3IgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9uYW1lcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGJsYW5rTmFtZXNEaWN0KSkge1xuICAgICAgICBnaXZlbl9hcnJfbmFtZXNbdl0gPSBrO1xuICAgIH1cbiAgICAvLyBDb21wdXRlIGFuIGFycmF5IG9mIFtjb252ZXJ0ZWRfYmxhbmtfMF92YWwsIC4uLl0uIE5vdGUgdGhhdCB0aGlzIHJlLWNvbnZlcnRzIGFsbCB0aGUgdmFsdWVzLCByYXRoZXIgdGhhbiAocG9zc2libHkgZGVlcCkgY29weWluZyB0aGUgdmFsdWVzIGZyb20gYWxyZWFkeS1jb252ZXJ0ZWQgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9jb252ZXJ0ZWQgPSBnaXZlbl9hcnIubWFwKCh2YWx1ZSwgaW5kZXgpID0+XG4gICAgICAgIHR5cGVfY29udmVydChnaXZlbl9hcnJfbmFtZXNbaW5kZXhdLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpXG4gICAgKTtcblxuICAgIHJldHVybiBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF07XG59XG5cbi8vIFJlbmRlciB0aGUgZmVlZGJhY2sgZm9yIGEgZHluYW1pYyBwcm9ibGVtLlxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckR5bmFtaWNGZWVkYmFjayhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBUaGUgaW5kZXggb2YgdGhpcyBibGFuayBpbiBnaXZlbl9hcnJfLlxuICAgIGluZGV4LFxuICAgIC8vIFRoZSBmZWVkYmFjayBmb3IgdGhpcyBibGFuaywgY29udGFpbmluZyBhIHRlbXBsYXRlIHRvIGJlIHJlbmRlcmVkLlxuICAgIGRpc3BsYXlGZWVkX2ksXG4gICAgLy8gU2VlIGR5bl92YXJzX2V2YWxfLlxuICAgIGR5bl92YXJzX2V2YWxcbikge1xuICAgIC8vIFVzZSB0aGUgYW5zd2VyLCBhbiBhcnJheSBvZiBhbGwgYW5zd2VycywgdGhlIHZhbHVlIG9mIGFsbCBuYW1lZCBibGFua3MsIGFuZCBhbGwgc29sdXRpb24gdmFyaWFibGVzIGZvciB0aGUgdGVtcGxhdGUuXG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IGdldE5hbWVkQmxhbmtWYWx1ZXMoXG4gICAgICAgIGdpdmVuX2FycixcbiAgICAgICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgICAgIGR5bl92YXJzX2V2YWxcbiAgICApO1xuICAgIGNvbnN0IHNvbF92YXJzX3BsdXMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgICBhbnM6IGdpdmVuX2FycltpbmRleF0sXG4gICAgICAgICAgICBhbnNfYXJyYXk6IGdpdmVuX2FycixcbiAgICAgICAgfSxcbiAgICAgICAgZHluX3ZhcnNfZXZhbCxcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1xuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgICAgZGlzcGxheUZlZWRfaSA9IHJlbmRlcl9odG1sKGRpc3BsYXlGZWVkX2ksIHNvbF92YXJzX3BsdXMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmFzc2VydChmYWxzZSwgYEVycm9yIGV2YWx1YXRpbmcgZmVlZGJhY2sgaW5kZXggJHtpbmRleH0uYCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlzcGxheUZlZWRfaTtcbn1cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cbi8vIEZvciBlYWNoIG5hbWVkIGJsYW5rLCBnZXQgdGhlIHZhbHVlIGZvciB0aGUgYmxhbms6IHRoZSB2YWx1ZSBvZiBlYWNoIGBgYmxhbmtOYW1lYGAgZ2l2ZXMgdGhlIGluZGV4IG9mIHRoZSBibGFuayBmb3IgdGhhdCBuYW1lLlxuZnVuY3Rpb24gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IHt9O1xuICAgIGZvciAoY29uc3QgW2JsYW5rX25hbWUsIGJsYW5rX2luZGV4XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1tibGFua19uYW1lXSA9IHR5cGVfY29udmVydChcbiAgICAgICAgICAgIGJsYW5rX25hbWUsXG4gICAgICAgICAgICBnaXZlbl9hcnJbYmxhbmtfaW5kZXhdLFxuICAgICAgICAgICAgYmxhbmtfaW5kZXgsXG4gICAgICAgICAgICBkeW5fdmFyc19ldmFsXG4gICAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lZEJsYW5rVmFsdWVzO1xufVxuXG4vLyBDb252ZXJ0IGEgdmFsdWUgZ2l2ZW4gaXRzIHR5cGUuXG5mdW5jdGlvbiB0eXBlX2NvbnZlcnQobmFtZSwgdmFsdWUsIGluZGV4LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgLy8gVGhlIGNvbnZlcnRlciBjYW4gYmUgZGVmaW5lZCBieSBpbmRleCwgbmFtZSwgb3IgYnkgYSBzaW5nbGUgdmFsdWUgKHdoaWNoIGFwcGxpZXMgdG8gYWxsIGJsYW5rcykuIElmIG5vdCBwcm92aWRlZCwganVzdCBwYXNzIHRoZSBkYXRhIHRocm91Z2guXG4gICAgY29uc3QgdHlwZXMgPSBkeW5fdmFyc19ldmFsLnR5cGVzIHx8IHBhc3NfdGhyb3VnaDtcbiAgICBjb25zdCBjb252ZXJ0ZXIgPSB0eXBlc1tuYW1lXSB8fCB0eXBlc1tpbmRleF0gfHwgdHlwZXM7XG4gICAgLy8gRVM1IGhhY2s6IGl0IGRvZXNuJ3Qgc3VwcG9ydCBiaW5hcnkgdmFsdWVzLCBhbmQganMycHkgZG9lc24ndCBhbGxvdyBtZSB0byBvdmVycmlkZSB0aGUgYGBOdW1iZXJgYCBjbGFzcy4gU28sIGRlZmluZSB0aGUgd29ya2Fyb3VuZCBjbGFzcyBgYE51bWJlcl9gYCBhbmQgdXNlIGl0IGlmIGF2YWlsYWJsZS5cbiAgICBpZiAoY29udmVydGVyID09PSBOdW1iZXIgJiYgdHlwZW9mIE51bWJlcl8gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgY29udmVydGVyID0gTnVtYmVyXztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gdGhlIGNvbnZlcnRlZCB0eXBlLiBJZiB0aGUgY29udmVydGVyIHJhaXNlcyBhIFR5cGVFcnJvciwgcmV0dXJuIHRoYXQ7IGl0IHdpbGwgYmUgZGlzcGxheWVkIHRvIHRoZSB1c2VyLCBzaW5jZSB3ZSBhc3N1bWUgdHlwZSBlcnJvcnMgYXJlIGEgd2F5IGZvciB0aGUgcGFyc2VyIHRvIGV4cGxhaW4gdG8gdGhlIHVzZXIgd2h5IHRoZSBwYXJzZSBmYWlsZWQuIEZvciBhbGwgb3RoZXIgZXJyb3JzLCByZS10aHJvdyBpdCBzaW5jZSBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAgICB0cnkge1xuICAgICAgICByZXR1cm4gY29udmVydGVyKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFR5cGVFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGVycjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLy8gQSBwYXNzLXRocm91Z2ggXCJjb252ZXJ0ZXJcIi5cbmZ1bmN0aW9uIHBhc3NfdGhyb3VnaCh2YWwpIHtcbiAgICByZXR1cm4gdmFsO1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9