(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_parsons_js_timedparsons_js"],{

/***/ 8354:
/*!*****************************************!*\
  !*** ./runestone/parsons/js/parsons.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Parsons)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsons-i18n.en.js */ 75794);
/* harmony import */ var _parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_parsons_i18n_en_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./parsons-i18n.pt-br.js */ 56906);
/* harmony import */ var _parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_parsons_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _prettify_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./prettify.js */ 78811);
/* harmony import */ var _prettify_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_prettify_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _css_parsons_less__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/parsons.less */ 91032);
/* harmony import */ var _css_prettify_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../css/prettify.css */ 95762);
/* harmony import */ var _lineGrader__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lineGrader */ 40771);
/* harmony import */ var _dagGrader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dagGrader */ 49647);
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./parsonsLine */ 33760);
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./parsonsBlock */ 44065);
/* harmony import */ var _placeholderBlock_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./placeholderBlock.js */ 67216);
/* harmony import */ var _placeholderLine_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./placeholderLine.js */ 39147);
/* harmony import */ var _settledBlock_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./settledBlock.js */ 25888);
/* =====================================================================
==== Parsons Runestone Directive Javascript ============================
======== Renders a Parsons problem based on the HTML created by the
======== parsons.py script and the RST file.
==== CONTRIBUTORS ======================================================
======== Isaiah Mayerchak
======== Jeff Rick
======== Barbara Ericson
======== Cole Bowers
==== Adapted form the original JS Parsons by ===========================
======== Ville Karavirta
======== Petri Ihantola
======== Juha Helminen
======== Mike Hewner
===================================================================== */
/* =====================================================================
==== LineBasedGrader Object ============================================
======== Used for grading a Parsons problem.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
===================================================================== */












// CodeTailor-related imports Updated 10/26/2025




/* =====================================================================
==== Parsons Object ====================================================
======== The model and view of a Parsons problem based on what is
======== specified in the HTML, which is based on what is specified
======== in the RST file
==== PROPERTIES ========================================================
======== options: options largely specified from the HTML
======== grader: a LineGrader for grading the problem
======== lines: an array of all ParsonsLine as specified in the problem
======== solution: an array of ParsonsLine in the solution
======== blocks: the current blocks
======== sourceArea: the element that contains the source blocks
======== answerArea: the element that contains the answer blocks
===================================================================== */

/* =====================================================================
==== INITIALIZATION ====================================================
=====================================================================  */

class Parsons extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <pre> element that will be replaced by new HTML
        this.containerDiv = orig;
        this.origElem = $(orig).find("pre.parsonsblocks")[0];
        // Find the question text and store it in .question
        this.question = $(orig).find(`.parsons_question`)[0];
        this.useRunestoneServices = opts.useRunestoneServices;
        this.divid = opts.orig.id;
        // Set the storageId (key for storing data)
        var storageId = super.localStorageKey();
        this.storageId = storageId;
        this.children = this.origElem.childNodes; // this contains all of the child elements of the entire tag...
        this.contentArray = [];
        Parsons.counter++; //    Unique identifier
        this.counterId = "parsons-" + Parsons.counter;

        // for (var i = 0; i < this.children.length; i++) {
        //     if ($(this.children[i]).is("[data-question]")) {
        //         this.question = this.children[i];
        //         break;
        //     }
        // }
        this.initializeOptions();
        this.grader =
            this.options.grader === "dag"
                ? new _dagGrader__WEBPACK_IMPORTED_MODULE_7__["default"](this)
                : new _lineGrader__WEBPACK_IMPORTED_MODULE_6__["default"](this);
        this.grader.showfeedback = this.showfeedback;
        var fulltext = $(this.origElem).html();
        this.blockIndex = 0;
        this.checkCount = 0;
        this.numDistinct = 0;
        this.hasSolved = false;
        this.initializeLines(fulltext.trim());
        this.initializeView();
        this.caption = "Parsons";
        this.addCaption("runestone");
        // Check the server for an answer to complete things
        this.checkServer("parsons", true);
        this.runnableDiv = null;
    }
    // Based on the data-fields in the original HTML, initialize options
    initializeOptions() {
        var options = {
            pixelsPerIndent: 30,
        };
        // add maxdist and order if present
        var maxdist = $(this.origElem).data("maxdist");
        var order = $(this.origElem).data("order");
        var noindent = $(this.origElem).data("noindent");
        var adaptive = $(this.origElem).data("adaptive");
        var numbered = $(this.origElem).data("numbered");
        var grader = $(this.origElem).data("grader");
        // CodeTailor: proactively set the puzzle as scaffolding puzzle to differentiate with other puzzle practice formats
        var scaffolding = $(this.origElem).data("scaffolding");
        options["numbered"] = numbered;
        options["grader"] = grader;
        options["scaffolding"] = scaffolding;
        if (maxdist !== undefined) {
            options["maxdist"] = maxdist;
        }
        if (order !== undefined) {
            // convert order string to array of numbers
            order = order.match(/\d+/g);
            for (var i = 0; i < order.length; i++) {
                order[i] = parseInt(order[i]);
            }
            options["order"] = order;
        }
        if (noindent == undefined) {
            noindent = false;
        }
        options["noindent"] = noindent;
        this.noindent = noindent;
        if (adaptive == undefined) {
            adaptive = false;
        } else if (adaptive) {
            this.initializeAdaptive();
        }
        options["adaptive"] = adaptive;
        // add locale and language
        var locale = eBookConfig.locale;
        if (locale == undefined) {
            locale = "en";
        }
        options["locale"] = locale;
        var language = $(this.origElem).data("language");
        if (language == undefined) {
            language = eBookConfig.language;
            if (language == undefined) {
                language = "python";
            }
        }
        options["language"] = language;
        var prettifyLanguage = {
            python: "prettyprint lang-py",
            java: "prettyprint lang-java",
            javascript: "prettyprint lang-js",
            html: "prettyprint lang-html",
            c: "prettyprint lang-c",
            "c++": "prettyprint lang-cpp",
            cpp: "prettyprint lang-cpp",
            ruby: "prettyprint lang-rb",
        }[language];
        if (prettifyLanguage == undefined) {
            prettifyLanguage = "";
        }
        options["prettifyLanguage"] = prettifyLanguage;
        //runnable if the parent has a parsons-runnable attr
        options["runnable"] = $(this.origElem).data("runnable");
        // Parse block explanations if present
        var explanationsRaw = $(this.origElem).attr("data-explanations");
        if (explanationsRaw) {
            try {
                this.blockExplanations = JSON.parse(explanationsRaw);
            } catch (e) {
                this.blockExplanations = {};
            }
        } else {
            this.blockExplanations = {};
        }
        this.options = options;
    }
    // Based on what is specified in the original HTML, create the HTML view
    initializeView() {
        this.outerDiv = document.createElement("div");
        $(this.outerDiv).addClass("parsons");
        this.outerDiv.id = this.counterId;
        // parsons-text exists in source, make sure it has exercise-statement class
        let parsonsTextDiv = this.containerDiv.querySelector(".parsons-text");
        if (parsonsTextDiv && !parsonsTextDiv.classList.contains("exercise-statement"))
            parsonsTextDiv.classList.add("exercise-statement");
        this.keyboardTip = document.createElement("div");
        $(this.keyboardTip).attr("role", "tooltip");
        this.keyboardTip.id = this.counterId + "-tip";
        this.keyboardTip.innerHTML = $.i18n("msg_parson_arrow_navigate");
        this.outerDiv.appendChild(this.keyboardTip);
        $(this.keyboardTip).hide();
        this.sortContainerDiv = document.createElement("div");
        $(this.sortContainerDiv).addClass("sortable-code-container");
        $(this.sortContainerDiv).attr(
            "aria-describedby",
            this.counterId + "-tip"
        );
        this.outerDiv.appendChild(this.sortContainerDiv);
        this.sourceRegionDiv = document.createElement("div");
        this.sourceRegionDiv.id = this.counterId + "-sourceRegion";
        $(this.sourceRegionDiv).addClass("sortable-code");
        this.sourceLabel = document.createElement("div");
        $(this.sourceLabel).attr("role", "tooltip");
        this.sourceLabel.id = this.counterId + "-sourceTip";
        this.sourceLabel.innerHTML = $.i18n("msg_parson_drag_from_here");
        this.sourceRegionDiv.appendChild(this.sourceLabel);
        this.sortContainerDiv.appendChild(this.sourceRegionDiv);
        this.sourceArea = document.createElement("div");
        this.sourceArea.id = this.counterId + "-source";
        $(this.sourceArea).addClass("source");
        $(this.sourceArea).attr(
            "aria-describedby",
            this.counterId + "-sourceTip"
        );
        this.sourceRegionDiv.appendChild(this.sourceArea);
        this.answerRegionDiv = document.createElement("div");
        this.answerRegionDiv.id = this.counterId + "-answerRegion";
        $(this.answerRegionDiv).addClass("sortable-code");
        this.answerLabel = document.createElement("div");
        $(this.answerLabel).attr("role", "tooltip");
        this.answerLabel.id = this.counterId + "-answerTip";
        this.answerLabel.innerHTML = $.i18n("msg_parson_drag_to_here");
        this.answerRegionDiv.appendChild(this.answerLabel);
        this.sortContainerDiv.appendChild(this.answerRegionDiv);
        this.answerArea = document.createElement("div");
        this.answerArea.id = this.counterId + "-answer";
        $(this.answerArea).attr(
            "aria-describedby",
            this.counterId + "-answerTip"
        );
        this.answerRegionDiv.appendChild(this.answerArea);
        this.parsonsControlDiv = document.createElement("div");
        $(this.parsonsControlDiv).addClass("parsons-controls");
        this.outerDiv.appendChild(this.parsonsControlDiv);
        var that = this;
        this.checkButton = document.createElement("button");
        $(this.checkButton).attr("class", "btn btn-success");
        this.checkButton.textContent = $.i18n("msg_parson_check_me");
        this.checkButton.id = this.counterId + "-check";
        this.parsonsControlDiv.appendChild(this.checkButton);
        this.checkButton.type = "button";
        this.checkButton.addEventListener("click", function (event) {
            event.preventDefault();
            that.checkCurrentAnswer();
            that.logCurrentAnswer();
            that.renderFeedback();
        });
        this.resetButton = document.createElement("button");
        $(this.resetButton).attr("class", "btn btn-default");
        this.resetButton.textContent = $.i18n("msg_parson_reset");
        this.resetButton.id = this.counterId + "-reset";
        this.resetButton.type = "button";
        this.parsonsControlDiv.appendChild(this.resetButton);
        this.resetButton.addEventListener("click", function (event) {
            event.preventDefault();
            that.clearFeedback();
            $(that.checkButton).prop("disabled", false);
            that.resetView();
            that.checkCount = 0;
            that.logMove("reset");
            that.setLocalStorage();
        });
        if (this.options.adaptive) {
            this.helpButton = document.createElement("button");
            $(this.helpButton).attr("class", "btn btn-primary");
            this.helpButton.textContent = $.i18n("msg_parson_help");
            this.helpButton.id = this.counterId + "-help";
            this.helpButton.disabled = false; // bje
            this.parsonsControlDiv.appendChild(this.helpButton);
            this.helpButton.addEventListener("click", function (event) {
                event.preventDefault();
                that.helpMe();
            });
        }
        this.messageDiv = document.createElement("div");
        this.messageDiv.id = this.counterId + "-message";
        this.messageDiv.setAttribute("aria-live", "polite");
        this.messageDiv.setAttribute("role", "status");
        this.parsonsControlDiv.appendChild(this.messageDiv);
        this.messageDiv.style.visibility = "hidden";
        $(this.origElem).replaceWith(this.outerDiv);
        $(this.outerDiv).closest(".sqcontainer").css("max-width", "none");
        if (this.outerDiv) {
            if ($(this.question).html().match(/^\s+$/)) {
                $(this.question).remove();
            } else {
                $(this.outerDiv).prepend(this.question);
            }
        }
    }
    // Initialize lines and solution properties
    // CodeTailor: a big change is in this function - included #settled blocks and placeholder blocks
    initializeLines(text) {
        this.lines = [];
        // Create the initial blocks
        var textBlocks = text.split("---");
        if (textBlocks.length === 1) {
            // If there are no ---, then every line is its own block
            textBlocks = text.split("\n");
        }
        var solution = [];
        var indents = [];
        // CodeTailor: Parsons puzzle wise, the biggest change is in this section
        if (this.options.scaffolding === true) {
            var placeholderNeeded = false;
            // if there is a placeholder needed to be created at the end
            for (var i = 0; i < textBlocks.length; i++) {
                var textBlock = textBlocks[i];
                // Figure out options based on the #option
                // Remove the options from the code
                // only options are #paired or #distractor
                var options = {};
                var distractIndex;
                var distractHelptext = "";
                var tagIndex;
                var tag;
                var dependsIndex;
                var depends = [];
                if (textBlock.includes("#paired:")) {
                    distractIndex = textBlock.indexOf("#paired:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 8, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 7);
                } else if (textBlock.includes("#distractor:")) {
                    distractIndex = textBlock.indexOf("#distractor:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 12, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 11);
                } else if (textBlock.includes("#settled")) {
                    var settledIndex = textBlock.indexOf("#settled");
                    distractHelptext = textBlock
                        .substring(settledIndex + 8, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, settledIndex + 8);
                } else if (textBlock.includes("#tag:")) {
                    textBlock = textBlock.replace(/#tag:.*;.*;/, (s) =>
                        s.replace(/\s+/g, "")
                    ); // remove whitespace in tag and depends list
                    tagIndex = textBlock.indexOf("#tag:");
                    tag = textBlock.substring(
                        tagIndex + 5,
                        textBlock.indexOf(";", tagIndex + 5)
                    );
                    if (tag == "") tag = "block-" + i;
                    dependsIndex = textBlock.indexOf(";depends:");
                    let dependsString = textBlock.substring(
                        dependsIndex + 9,
                        textBlock.indexOf(";", dependsIndex + 9)
                    );
                    depends =
                        dependsString.length > 0 ? dependsString.split(",") : [];
                }
                if (textBlock.includes('class="displaymath')) {
                    options["displaymath"] = true;
                } else {
                    options["displaymath"] = false;
                }

                textBlock = textBlock.replace(
                    /#(paired|distractor|settled|tag:.*;.*;)/,
                    function (mystring, arg1) {
                        options[arg1] = true;
                        return "";
                    }
                );

                // if block is #settled - create a placeholder line (PH) before the lines,
                //          if it is not the first block, and the previous block is not settled
                // If lines are: settled, line 1, line 2, line 3, settled, line 4:
                // Create settled, line 1, line 2, line 3, PH1, settled, line 4, PH2
                // If lines are: line 1, settled, settled, line 2, line 3, line 4, settled:
                // Create line 1, PH1, settled, settled, line 2, line 3, line 4, PH2, settled
                if (options["settled"] && i > 0 && lines.length > 0 && !lines[lines.length - 1].isSettled) {
                    var placeholderLine = new _placeholderLine_js__WEBPACK_IMPORTED_MODULE_11__["default"](this);
                    lines.push(placeholderLine);
                    placeholderLine.distractor = true;
                    placeholderLine.paired = false;
                    placeholderLine.distractHelptext = "";
                    placeholderLine.groupWithNext = false;
                    placeholderLine.indent = 0;
                }
    
                if (options["settled"]) {
                    placeholderNeeded = true;
                }
    
                // Create lines
                var lines = [];
                if (!options["displaymath"]) {
                    var split = textBlock.split("\n");
                } else {
                    var split = [textBlock];
                }
                for (var j = 0; j < split.length; j++) {
                    var code = split[j];
                    // discard blank rows
                    if (!/^\s*$/.test(code)) {
                        var line = new _parsonsLine__WEBPACK_IMPORTED_MODULE_8__["default"](
                            this,
                            code,
                            options["displaymath"]
                        );
                        lines.push(line);
                        if (options["paired"]) {
                            line.distractor = true;
                            line.paired = true;
                            line.distractHelptext = distractHelptext;
                        } else if (options["distractor"]) {
                            line.distractor = true;
                            line.paired = false;
                            line.distractHelptext = distractHelptext;
                        } else if (options["settled"]) {
                            // settled lines: fixed solution lines
                            line.distractor = false;
                            line.paired = false;
                            line.isSettled = true;
                            solution.push(line);
                        } else {
                            line.distractor = false;
                            line.paired = false;
                            if (this.options.grader === "dag") {
                                line.tag = tag;
                                line.depends = depends;
                            } 
                            solution.push(line);
                        }
                        if ($.inArray(line.indent, indents) == -1) {
                            indents.push(line.indent);
                        }
                    }
                }
                if (lines.length > 0) {
                    // Add groupWithNext
                    for (j = 0; j < lines.length - 1; j++) {
                        lines[j].groupWithNext = true;
                    }
                    lines[lines.length - 1].groupWithNext = false;
                }
            }
            if (placeholderNeeded && !lines[lines.length - 1].isSettled) {
                // if there is a settled line before the ending lines
                var placeholderLine = new _placeholderLine_js__WEBPACK_IMPORTED_MODULE_11__["default"](this);
                lines.push(placeholderLine);
                placeholderLine.distractor = true;
                placeholderLine.paired = false;
                placeholderLine.distractHelptext = "";
                placeholderLine.groupWithNext = false;
            }
            // CodeTailor: Normalize the indents for java - sometimes java indent directly uses 8 spaces for method indent
            if (this.options.language === "java") {
                let classLineIndent = null;
                let methodLineIndent = null;
    
                for (let i = 0; i < this.lines.length; i++) {
                    const lineText = this.lines[i].text;

                    if (classLineIndent === null && (lineText.includes("public class") || lineText.startsWith("import"))) {
                        classLineIndent = this.lines[i].indent;
                    }
                    
                    if (methodLineIndent === null && lineText.includes("public static")) {
                        methodLineIndent = this.lines[i].indent;
                    }
                    
                    // Break early once both are found
                    if (classLineIndent !== null && methodLineIndent !== null) {
                        break;
                    }
                }
    
                // Detected Java 8-space indent — will shift levels down by one.
                if (classLineIndent === 0 && methodLineIndent === 8) {
                    indents = indents.sort(function (a, b) {
                        return a - b;
                    });
    
                    for (let i = 0; i < this.lines.length; i++) {
                        let line = this.lines[i];
                        let originalIndent = line.indent;
                        let normalizedLevel = indents.indexOf(originalIndent);
                        if (normalizedLevel > 0) {
                            normalizedLevel -= 1;
                        }
                        line.indent = normalizedLevel;
                    } 
                } else {
                    indents = indents.sort(function (a, b) {
                        return a - b;
                    });
                    for (let i = 0; i < this.lines.length; i++) {
                        let line = this.lines[i];
                        line.indent = indents.indexOf(line.indent);
                    }
                }
            } else {
                // Python - Original behavior
                indents = indents.sort(function (a, b) {
                    return a - b;
                });
                for (let i = 0; i < this.lines.length; i++) {
                    let line = this.lines[i];
                    line.indent = indents.indexOf(line.indent);
                }
            }
            this.solution = solution;
        
        } else {
            // Normal Parsons puzzle initialization
            for (var i = 0; i < textBlocks.length; i++) {
                var textBlock = textBlocks[i];
                // Figure out options based on the #option
                // Remove the options from the code
                // only options are #paired or #distractor
                var options = {};
                var distractIndex;
                var distractHelptext = "";
                var tagIndex;
                var tag;
                var dependsIndex;
                var depends = [];
                if (textBlock.includes("#paired:")) {
                    distractIndex = textBlock.indexOf("#paired:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 8, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 7);
                } else if (textBlock.includes("#distractor:")) {
                    distractIndex = textBlock.indexOf("#distractor:");
                    distractHelptext = textBlock
                        .substring(distractIndex + 12, textBlock.length)
                        .trim();
                    textBlock = textBlock.substring(0, distractIndex + 11);
                } else if (textBlock.includes("#tag:")) {
                    textBlock = textBlock.replace(/#tag:.*;.*;/, (s) =>
                        s.replace(/\s+/g, "")
                    ); // remove whitespace in tag and depends list
                    tagIndex = textBlock.indexOf("#tag:");
                    tag = textBlock.substring(
                        tagIndex + 5,
                        textBlock.indexOf(";", tagIndex + 5)
                    );
                    if (tag == "") tag = "block-" + i;
                    dependsIndex = textBlock.indexOf(";depends:");
                    let dependsString = textBlock.substring(
                        dependsIndex + 9,
                        textBlock.indexOf(";", dependsIndex + 9)
                    );
                    depends =
                        dependsString.length > 0 ? dependsString.split(",") : [];
                }
                if (textBlock.includes('class="displaymath')) {
                    options["displaymath"] = true;
                } else {
                    options["displaymath"] = false;
                }
                textBlock = textBlock.replace(
                    /\s*#(paired|distractor|tag:.*;.*;)\s*/g,
                    function (mystring, arg1) {
                        options[arg1] = true;
                        return "";
                    }
                );
                // Create lines
                var lines = [];
                if (!options["displaymath"]) {
                    var split = textBlock.split("\n");
                } else {
                    var split = [textBlock];
                }

                for (var j = 0; j < split.length; j++) {
                    var code = split[j];
                    let isBlank = /^\s*$/.test(code);
                    // discard up to one blank leading or trailing line
                    if (isBlank && (j == 0 || j == split.length - 1)) {
                        continue;
                    }
                    var line = new _parsonsLine__WEBPACK_IMPORTED_MODULE_8__["default"](
                        this,
                        code,
                        options["displaymath"]
                    );
                    lines.push(line);
                    if (options["paired"]) {
                        line.distractor = true;
                        line.paired = true;
                        line.distractHelptext = distractHelptext;
                    } else if (options["distractor"]) {
                        line.distractor = true;
                        line.paired = false;
                        line.distractHelptext = distractHelptext;
                    } else {
                        line.distractor = false;
                        line.paired = false;
                        if (this.options.grader === "dag") {
                            line.tag = tag;
                            line.depends = depends;
                        }
                        solution.push(line);
                    }
                    if ($.inArray(line.indent, indents) == -1) {
                        indents.push(line.indent);
                    }
                }
                if (lines.length > 0) {
                    // Add groupWithNext
                    for (j = 0; j < lines.length - 1; j++) {
                        lines[j].groupWithNext = true;
                    }
                    lines[lines.length - 1].groupWithNext = false;
                }
            }
            // Normalize the indents
            indents = indents.sort(function (a, b) {
                return a - b;
            });
            for (i = 0; i < this.lines.length; i++) {
                line = this.lines[i];
                line.indent = indents.indexOf(line.indent);
            }
            this.solution = solution;
        }
    }
    // Based on the blocks, create the source and answer areas
    async initializeAreas(sourceBlocks, answerBlocks, options) {
        // Create blocks property as the sum of the two
        var blocks = [];
        var i, block;
        for (i = 0; i < sourceBlocks.length; i++) {
            block = sourceBlocks[i];
            blocks.push(block);
            this.sourceArea.appendChild(block.view);
        }
        for (i = 0; i < answerBlocks.length; i++) {
            block = answerBlocks[i];
            blocks.push(block);
            this.answerArea.appendChild(block.view);
        }
        this.blocks = blocks;
        // If present, disable some blocks
        var disabled = options.disabled;
        if (disabled !== undefined) {
            for (i = 0; i < blocks.length; i++) {
                block = blocks[i];
                if (disabled.includes(block.lines[0].index)) {
                    $(block.view).addClass("disabled");
                }
            }
        }
        // Determine how much indent should be possible in the answer area
        var indent = 0;
        if (!this.noindent) {
            if (this.options.language == "natural") {
                indent = this.solutionIndent();
            } else {
                indent = Math.max(0, this.solutionIndent());
            }
        }
        this.indent = indent;
        // For rendering, place in an onscreen position
        var isHidden = this.outerDiv.offsetParent == null;
        var replaceElement;
        if (isHidden) {
            replaceElement = document.createElement("div");
            replaceElement.classList.add("runestone-sphinx");
            $(this.outerDiv).replaceWith(replaceElement);
            // add runestone-sphinx class so the css rules for parsons will apply
            $(this.outerDiv).addClass("runestone-sphinx");
            document.body.appendChild(this.outerDiv);
        }

        // only do prettify if prism is not loaded
        if (this.options.prettifyLanguage !== "" && typeof Prism === "undefined") {
            prettyPrint();
        }

        const lang = this.options["language"];
        if (lang && typeof Prism !== "undefined") {
            const codeEls = this.containerDiv.querySelectorAll("code");
            for (const el of codeEls) {
                el.classList.add(`language-${lang}`);
            }
            Prism.highlightAllUnder(this.containerDiv);
        }

        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].initializeWidth();
        }

        // Set the source width to its max value.  This allows the blocks to be created
        // at their "natural" size. As long as that is smaller than the max.
        // This allows us to use sensible functions to determine the correct heights
        // and widths for the drag and drop areas.
        // Like most of the sizing, this is a bit of a hack.
        const availableWidth = this.outerDiv.offsetWidth;
        const answerIndentSpace = this.options.pixelsPerIndent * this.indent;
        const marginFudge = 80;  // margins, padding, etc...
        let maxSourceAreaWidth = (availableWidth - answerIndentSpace - marginFudge) / 2;
        if (this.options.numbered != undefined) {
            maxSourceAreaWidth -= 25;
        }
        this.sourceArea.style.width = maxSourceAreaWidth + "px"; // likely reduced later

        // Layout the areas
        var areaWidth, areaHeight;
        // Establish the width and height of the droppable areas
        var item;
        areaHeight = 20;
        var height_add = 0;
        if (this.options.numbered != undefined) {
            height_add = 1;
        }

        // Use two explicit passes — first measure all widths (with MathJax awaited per block for math),
        // then apply the final areaWidth to all blocks and measure heights.
        areaWidth = 0;
        const isMath = this.options.language == "natural" ||
                       this.options.language == "math";

        // Pass 1: render math if needed.
        // Typeset all blocks in a single MathJax call instead of one per block,
        // which eliminates the N-fold serial overhead of the previous approach.
        if (isMath) {
            const blockElements = blocks.map(b => $(b.view)[0]);
            if (typeof runestoneMathReady !== "undefined") {
                await runestoneMathReady.then(
                    async () => await MathJax.typesetPromise(blockElements)
                );
            } else {
                if (typeof MathJax.startup !== "undefined") {
                    await MathJax.typesetPromise(blockElements);
                }
            }
        }

        // Pass 2: measure natural width of each block (now fully rendered)
        for (i = 0; i < blocks.length; i++) {
            areaWidth = Math.max(areaWidth, $(blocks[i].view).outerWidth(true));
        }

        // Pass 3: apply uniform final width to all blocks, then measure heights
        for (i = 0; i < blocks.length; i++) {
            let item = $(blocks[i].view);
            item.width(areaWidth - 22);
            var addition = 3.8;
            let outerH = item.outerHeight(true);
            if (outerH != 38) {
                addition = (3.1 * (outerH - 38)) / 21;
            }
            areaHeight += outerH + height_add * addition;
        }

        // sometimes we have a problem with hidden elements not getting the right height
        // just make sure that we have a reasonable height. There must be a better way to
        // do this.
        if (this.isTimed && areaHeight < blocks.length * 38) {
            areaHeight = blocks.length * 50;
        }
        this.areaWidth = areaWidth;
        if (this.options.numbered != undefined) {
            this.areaWidth += 25;
            //areaHeight += (blocks.length);
        }
        // + 40 to areaHeight to provide some additional buffer in case any text overflow still happens - Vincent Qiu (September 2020)
        if (indent > 0 && indent <= 4) {
            $(this.answerArea).addClass("answer" + indent);
        } else {
            $(this.answerArea).addClass("answer");
        }
        // Initialize paired distractor decoration
        var bins = [];
        var bin = [];
        for (i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.block() == undefined) {
                if (bin.length > 0) {
                    bins.push(bin);
                    bin = [];
                }
            } else {
                bin.push(line);
                if (!line.groupWithNext) {
                    bins.push(bin);
                    bin = [];
                }
            }
        }
        var pairedBins = [];
        var lineNumbers = [];
        var pairedDivs = [];
        var j;
        if (this.pairDistractors || !this.options.adaptive) {
            for (i = bins.length - 1; i > -1; i--) {
                bin = bins[i];
                if (bin[0].paired) {
                    // Add all in bin to line numbers
                    for (j = bin.length - 1; j > -1; j--) {
                        lineNumbers.unshift(bin[j].index);
                    }
                } else {
                    if (lineNumbers.length > 0) {
                        // Add all in bin to line numbers
                        for (j = bin.length - 1; j > -1; j--) {
                            lineNumbers.unshift(bin[j].index);
                        }
                        pairedBins.unshift(lineNumbers);
                        lineNumbers = [];
                    }
                }
            }
            for (i = 0; i < pairedBins.length; i++) {
                var pairedDiv = document.createElement("div");
                $(pairedDiv).addClass("paired");
                $(pairedDiv).html(
                    "<span id= 'st' style = 'vertical-align: middle; font-weight: bold'>or{</span>"
                );
                pairedDivs.push(pairedDiv);
                this.sourceArea.appendChild(pairedDiv);
            }
        } else {
            pairedBins = [];
        }
        // This does not seem to be necessary - so set multiplier to 0.
        areaHeight += pairedBins.length * 0; // the paired bins take up extra space which can
        // cause the blocks to spill out.  This
        // corrects that by adding a little extra
        this.areaHeight = areaHeight;
        $(this.sourceArea).css({
            width: this.areaWidth + 2,
            height: this.areaHeight,
        });
        $(this.answerArea).css({
            width: this.options.pixelsPerIndent * indent + this.areaWidth + 2,
            height: this.areaHeight,
        });

        this.pairedBins = pairedBins;
        this.pairedDivs = pairedDivs;
        if (this.options.numbered != undefined) {
            this.addBlockLabels(sourceBlocks.concat(answerBlocks));
        }
        // Update the view
        this.state = undefined; // needs to be here for loading from storage
        this.updateView();
        // Put back into the offscreen position
        if (isHidden) {
            $(replaceElement).replaceWith(this.outerDiv);
        }
    }
    // Make blocks interactive (both drag-and-drop and keyboard)
    initializeInteractivity() {
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].initializeInteractivity();
        }
        this.initializeTabIndex();
        if (
            this.options.language == "natural" ||
            this.options.language == "math"
        ) {
            if (typeof MathJax.startup !== "undefined") {
                // initializeAreas already typeset all blocks in a single batch call,
                // so no further MathJax work is needed here. Promise.resolve().then()
                // defers the re-layout by one microtask tick, giving the browser time
                // to reflow the newly rendered math before outerHeight() is measured.
                Promise.resolve().then(() => {
                    // Recalculate areaWidth and areaHeight from all blocks (source + answer)
                    // now that MathJax has rendered to final dimensions.
                    var newAreaWidth = 0;
                    var newAreaHeight = 20;
                    var height_add = this.options.numbered != undefined ? 1 : 0;
                    var sourceBlocks = this.sourceBlocks();
                    var answerBlocks = this.answerBlocks();
                    var allBlocks = sourceBlocks.concat(answerBlocks);

                    // First pass: find max natural width across all blocks
                    for (var i = 0; i < allBlocks.length; i++) {
                        var blockView = $(allBlocks[i].view);
                        blockView.css("width", "");   // release fixed width to get natural width
                        newAreaWidth = Math.max(newAreaWidth, blockView.outerWidth(true));
                    }
                    if (this.options.numbered != undefined) {
                        newAreaWidth += 25;
                    }
                    var baseWidth = newAreaWidth - 22;
                    var answerWidth = newAreaWidth + this.indent * this.options.pixelsPerIndent - 22;

                    // Second pass: apply correct width and accumulate height
                    for (var i = 0; i < allBlocks.length; i++) {
                        var blockView = $(allBlocks[i].view);
                        blockView.css("width", baseWidth);
                        var outerH = blockView.outerHeight(true);
                        var addition = 3.8;
                        if (outerH != 38) {
                            addition = (3.1 * (outerH - 38)) / 21;
                        }
                        newAreaHeight += outerH + height_add * addition;
                    }

                    this.areaWidth = newAreaWidth;
                    this.areaHeight = newAreaHeight;

                    // Resize source and answer areas
                    $(this.sourceArea).css({
                        width: newAreaWidth + 2,
                        height: newAreaHeight,
                    });
                    $(this.answerArea).css({
                        width: this.options.pixelsPerIndent * this.indent + newAreaWidth + 2,
                        height: newAreaHeight,
                    });

                    // Reposition source blocks
                    var positionTop = 0;
                    for (var i = 0; i < sourceBlocks.length; i++) {
                        $(sourceBlocks[i].view).css({
                            left: 0,
                            top: positionTop,
                            width: baseWidth,
                            "z-index": 2,
                        });
                        positionTop += $(sourceBlocks[i].view).outerHeight(true);
                    }

                    // Reposition paired distractor brackets
                    for (var i = 0; i < this.pairedBins.length; i++) {
                        var bin = this.pairedBins[i];
                        var matching = [];
                        for (var j = 0; j < sourceBlocks.length; j++) {
                            if (sourceBlocks[j].matchesBin(bin)) {
                                matching.push(sourceBlocks[j]);
                            }
                        }
                        var div = this.pairedDivs[i];
                        if (matching.length == 0) {
                            $(div).hide();
                        } else {
                            $(div).show();
                            var height = -5;
                            height += parseInt($(matching[matching.length - 1].view).css("top"));
                            height -= parseInt($(matching[0].view).css("top"));
                            height += $(matching[matching.length - 1].view).outerHeight(true);
                            $(div).css({
                                left: -6,
                                top: $(matching[0].view).css("top"),
                                width: baseWidth + 34,
                                height: height,
                                "z-index": 1,
                                "text-indent": -30,
                                "padding-top": (height - 70) / 2,
                                overflow: "visible",
                                "font-size": 43,
                                "vertical-align": "middle",
                                color: "#7e7ee7",
                            });
                            $(div).html(
                                "<span id='st' style='vertical-align: middle; font-weight: bold; font-size: 15px'>or</span>{"
                            );
                        }
                    }

                    // Reposition answer blocks
                    positionTop = 0;
                    for (var i = 0; i < answerBlocks.length; i++) {
                        var block = answerBlocks[i];
                        var indent = block.indent * this.options.pixelsPerIndent;
                        $(block.view).css({
                            left: indent,
                            top: positionTop,
                            width: answerWidth - indent,
                            "z-index": 2,
                        });
                        positionTop += $(block.view).outerHeight(true);
                    }
                });            
            }
        }
    }
    // Make one block be keyboard accessible
    initializeTabIndex() {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block.enabled()) {
                block.makeTabIndex();
                return this;
            }
        }
    }
    /* =====================================================================
    ==== SERVER COMMUNICATION ==============================================
    ===================================================================== */
    // Return the argument that is newer based on the timestamp
    newerData(dataA, dataB) {
        var dateA = dataA.timestamp;
        var dateB = dataB.timestamp;
        if (dateA == undefined) {
            return dataB;
        }
        if (dateB == undefined) {
            return dataA;
        }
        dateA = this.dateFromTimestamp(dateA);
        dateB = this.dateFromTimestamp(dateB);
        if (dateA > dateB) {
            return dataA;
        } else {
            return dataB;
        }
    }
    // Based on the data, load
    async loadData(data) {
        // guard against any failure to load/adapt problem
        try {
            if (this.options.scaffolding === true) {
                var sourceHash = data.source;
                if (sourceHash == undefined) {
                    // maintain backwards compatibility
                    sourceHash = data.trash;
                }
                var answerHash = data.answer;
                var adaptiveHash = data.adaptive;
                var options;
                if (adaptiveHash == undefined) {
                    options = {};
                } else {
                    options = this.optionsFromHash(adaptiveHash);
                }
                if (options.noindent !== undefined) {
                    this.noindent = true;
                }
                if (options.checkCount !== undefined) {
                    this.checkCount = options.checkCount;
                }
                if (options.hasSolved !== undefined) {
                    this.hasSolved = options.hasSolved;
                }
                await this.initializeAreas(this.blocksFromSource(), this.settledBlocksFromSource(), options);
            } else {
                var sourceHash = data.source;
                if (sourceHash == undefined) {
                    // maintain backwards compatibility
                    sourceHash = data.trash;
                }
                var answerHash = data.answer;
                var adaptiveHash = data.adaptive;
                var options;
                if (adaptiveHash == undefined) {
                    options = {};
                } else {
                    options = this.optionsFromHash(adaptiveHash);
                }
                if (options.noindent !== undefined) {
                    this.noindent = true;
                }
                if (options.checkCount !== undefined) {
                    this.checkCount = options.checkCount;
                }
                if (options.hasSolved !== undefined) {
                    this.hasSolved = options.hasSolved;
                }
                if (
                    sourceHash == undefined ||
                    answerHash == undefined ||
                    answerHash.length == 1
                ) {
                    await this.initializeAreas(this.blocksFromSource(), [], options);
                } else {
                    this.initializeAreas(
                        this.blocksFromHash(sourceHash),
                        this.blocksFromHash(answerHash),
                        options
                    );
                    this.grade = this.grader.grade();
                    if (this.grade == "correct") {
                        this.correct = true;
                    } else if (this.answerLines().length == 0) {
                        this.correct = null;
                    } else {
                        this.correct = false;
                    }
                }
            }
        } catch(err) {
            // if anything goes wrong, just initialize based on problem source
            await this.initializeAreas(this.blocksFromSource(), [], options);
            console.log(`Error restoring answer for student ${data.sid} in ${data.div_id}. Defaulting to original state.`)
        }
        // Start the interface
        if (this.needsReinitialization !== true) {
            this.initializeInteractivity();
            // This is a bit of a hack to get the blocks to be in the right place
            // when the page loads.  It is needed because the blocks are not
            // visible when the page loads, so the size is off.  This forces
            // a realignment.
            if (this.isTimed && !this.assessmentTaken) {
                this.resetView();
            }
        }
    }
    // Return what is stored in local storage
    localData() {
        var data = localStorage.getItem(this.storageId);
        if (data !== null) {
            if (data.charAt(0) == "{") {
                data = JSON.parse(data);
            } else {
                data = {};
            }
        } else {
            data = {};
        }
        return data;
    }
    // RunestoneBase: Sent when the server has data
    restoreAnswers(serverData) {
        this.loadData(serverData);
    }
    // RunestoneBase: Load what is in local storage
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        const localData = this.localData();
        if (localData.timestamp && localData.timestamp < eBookConfig.termStartDate) {
            localStorage.removeItem(this.storageId);
            localData= {};
        }
        this.loadData(localData);
    }
    // RunestoneBase: Set the state of the problem in local storage
    setLocalStorage(data) {
        var toStore;
        if (data == undefined) {
            toStore = {
                source: this.sourceHash(),
                answer: this.answerHash(),
                timestamp: new Date(),
            };
            var adaptiveHash = this.adaptiveHash();
            if (adaptiveHash.length > 0) {
                toStore.adaptive = adaptiveHash;
            }
        } else {
            toStore = data;
        }
        localStorage.setItem(this.storageId, JSON.stringify(toStore));
    }

    async updatePlaceholders() {
        setTimeout(() => {
            var answerBlocks = this.answerBlocks();
            var i, hasNormalBlock;
            var placeholder;
            // hide placeholder
            for (i = 0; i < answerBlocks.length; ++i) {
                // checking on placeholders
                if (answerBlocks[i].isPlaceholder) {
                    placeholder = answerBlocks[i];
                    hasNormalBlock = false;
                    if (i > 0 && !answerBlocks[i - 1].isSettled && !answerBlocks[i - 1].isPlaceholder) {
                        hasNormalBlock = true;
                    }
                    if (i < answerBlocks.length - 1 && !answerBlocks[i + 1].isSettled && !answerBlocks[i + 1].isPlaceholder) {
                        hasNormalBlock = true;
                    }
                
                    if (hasNormalBlock) {
                        // if a placeholder has a normal block before or after, hide it;
                        if (!$(placeholder.view).hasClass('hide')) {
                            $(placeholder.view).addClass("hide");
                            for (var j = 0; j < answerBlocks.length - 1 - i; j++) {
                                placeholder.moveDown();
                            }
                        }
                    }
     
                }
            }
        }, 5);

        setTimeout(() => {
            var answerBlocks = this.answerBlocks();
            var contentLength = 0;
            while (contentLength < answerBlocks.length && !$(answerBlocks[contentLength].view).hasClass('hide')) {
                contentLength++;
            }
            // show placeholder when needed
            var prevIsSettled = true;
            if (this.firstBlockSettled) {
                prevIsSettled = false;
            }
            var settledCount = 0;
            var i;
            for (i = 0; i < contentLength; ++i) {
                // locate two consecutive settled blocks
                if (answerBlocks[i].isSettled && prevIsSettled) {
                    break;
                }
                if (answerBlocks[i].isSettled) {
                    prevIsSettled = true;
                    settledCount++;
                } else {
                    prevIsSettled = false;
                }
            }
            var placeholder;
            if (
                (i < contentLength) || 
                (answerBlocks[contentLength - 1] && answerBlocks[contentLength - 1].isSettled && !this.lastBlockSettled)
            ) {
                // looking for the placeholder block that should be after "settledCount" number of settled blocks;
                var placeholderIndex;
                for (placeholderIndex = answerBlocks.length - 1; placeholderIndex >= contentLength; placeholderIndex--) {
                    if (answerBlocks[placeholderIndex].afterSettledBlockCount == settledCount) {
                        placeholder = answerBlocks[placeholderIndex];
                        break;
                    }
                }
                if (answerBlocks[placeholderIndex].afterSettledBlockCount != settledCount) {
                    console.log("error moving up; no placeholder found");
                    return;
                }
                if ($(placeholder.view).hasClass('hide')) {
                    $(placeholder.view).removeClass("hide");
                    // should be moved right before the block answerBlocks[i]
                    for (var j = 0; j < placeholderIndex - i; j++) {
                        placeholder.moveUp();
                    }
                }
            }
        }, 10);
    }


    /* =====================================================================
    ==== LOGGING ===========================================================
    ===================================================================== */
    // Log the interaction with the problem to the server:
    //   start: the user started interacting with this problem
    //   move: the user moved a block to a new position
    //   reset: the reset button was pressed
    //   removeDistractor: "Help Me" removed a distractor
    //   removeIndentation: "Help Me" removed indentation
    //   combineBlocks: "Help Me" combined blocks
    logMove(activity) {
        var event = {
            event: "parsonsMove",
            div_id: this.divid,
            storageid: super.localStorageKey(),
        };
        var act = activity + "|" + this.sourceHash() + "|" + this.answerHash();
        var adaptiveHash = this.adaptiveHash();
        if (adaptiveHash !== "") {
            act = act + "|" + adaptiveHash;
        }
        event.act = act;
        this.logBookEvent(event);
    }
    // Log the answer to the problem
    //   correct: The answer given matches the solution
    //   incorrect*: The answer is wrong for various reasons
    async logCurrentAnswer(sid) {
        var event = {
            event: "parsons",
            div_id: this.divid,
        };
        var answerHash = this.answerHash();
        event.answer = answerHash;
        var sourceHash = this.sourceHash();
        event.source = sourceHash;
        var act = sourceHash + "|" + answerHash;
        var adaptiveHash = this.adaptiveHash();
        if (adaptiveHash !== "") {
            event.adaptive = adaptiveHash;
            act = act + "|" + adaptiveHash;
        }
        if (this.grade == "correct") {
            act = "correct|" + act;
            event.correct = "T";
        } else {
            act = "incorrect|" + act;
            event.correct = "F";
        }
        event.act = act;

        if (typeof sid !== "undefined") {
            event.sid = sid;
        }

        await this.logBookEvent(event);
    }
    /* =====================================================================
    ==== ACCESSING =========================================================
    ===================================================================== */
    // Answer the hash of the adaptive state
    adaptiveHash() {
        if (!this.options.adaptive) {
            return "";
        }
        var hash = [];
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (!block.enabled()) {
                hash.push("d" + block.lines[0].index);
            }
        }
        if (this.noindent !== this.options.noindent) {
            hash.push("i");
        }
        hash.push("c" + this.checkCount);
        if (this.hasSolved) {
            hash.push("s");
        }
        return hash.join("-");
    }
    // Create options for creating blocks based on a hash
    optionsFromHash(hash) {
        var split;
        if (hash === "-" || hash === "" || hash === null) {
            split = [];
        } else {
            split = hash.split("-");
        }
        var options = {};
        var disabled = [];
        for (var i = 0; i < split.length; i++) {
            var key = split[i];
            if (key[0] == "i") {
                options.noindent = true;
            } else if (key[0] == "d") {
                disabled.push(parseInt(key.slice(1)));
            } else if (key[0] == "s") {
                options.hasSolved = true;
            } else if (key[0] == "c") {
                options.checkCount = parseInt(key.slice(1));
            }
        }
        if (disabled.length > 0) {
            options.disabled = disabled;
        }
        return options;
    }
    // Answer the hash of the answer area
    answerHash() {
        var hash = [];
        var blocks = this.answerBlocks();
        for (var i = 0; i < blocks.length; i++) {
            hash.push(blocks[i].hash());
        }
        if (hash.length === 0) {
            return "-";
        } else {
            return hash.join("-");
        }
    }
    // Answer the hash of the source area
    sourceHash() {
        var hash = [];
        var blocks = this.sourceBlocks();
        for (var i = 0; i < blocks.length; i++) {
            hash.push(blocks[i].hash());
        }
        if (hash.length === 0) {
            return "-";
        } else {
            return hash.join("-");
        }
    }
    // Inter-problem adaptive changes
    // Based on the recentAttempts, remove distractors, add indent, combine blocks
    adaptBlocks(input) {
        var blocks = [];
        var distractors = [];
        var block;
        for (var i = 0; i < input.length; i++) {
            block = input[i];
            if (block.isDistractor()) {
                distractors.push(block);
            } else {
                blocks.push(block);
            }
        }
        this.recentAttempts = localStorage.getItem(
            this.adaptiveId + "recentAttempts"
        );
        if (this.recentAttempts == undefined || this.recentAttempts == "NaN") {
            this.recentAttempts = 3;
        }
        var lastestAttemptCount = this.recentAttempts;
        var nBlocks = blocks.length;
        var nBlocksToCombine = 0;
        var nDistractors = distractors.length;
        var nToRemove = 0;
        this.pairDistractors = true;
        var giveIndentation = false;
        if (lastestAttemptCount < 2) {
            // 1 Try
            this.pairDistractors = false;
            this.limitDistractors = false;
        } else if (lastestAttemptCount < 4) {
            // 2-3 Tries
            // Do nothing they are doing normal
            this.pairDistractors = true;
        } else if (lastestAttemptCount < 6) {
            // 4-5 Tries
            // pair distractors
            this.pairDistractors = true;
        } else if (lastestAttemptCount < 8) {
            // 6-7 Tries
            // Remove 50% of distractors
            nToRemove = 0.5 * nDistractors;
            this.pairDistractors = true;
        } else {
            // 8+ Tries
            // Remove all of distractors
            nToRemove = nDistractors;
            this.pairDistractors = true;
        }
        /*
        else if(lastestAttemptCount < 12) { //10-11
            // Remove all distractors and give indentation
            nToRemove = nDistractors;
            giveIndentation = true;
            this.pairDistractors = true;
        } else if(lastestAttemptCount < 14) { // 12-13 Tries
            // Remove all of distractors
            // give indentation
            // reduce problem to 3/4 size
            giveIndentation = true;
            nToRemove = nDistractors;
            nBlocksToCombine = .25 * nBlocks;
            this.pairDistractors = true;
        } else { // >= 14 Tries
            // Remove all of distractors
            // give indentation
            // reduce problem to 1/2 size
            giveIndentation = true;
            nToRemove = nDistractors;
            nBlocksToCombine = .5 * nBlocks;
            this.pairDistractors = true;
        }
        */
        nBlocksToCombine = Math.min(nBlocksToCombine, nBlocks - 3);
        // Never combine so where there are less than three blocks left
        // Remove distractors
        distractors = this.shuffled(distractors);
        distractors = distractors.slice(0, nToRemove);
        var output = [];
        for (i = 0; i < input.length; i++) {
            block = input[i];
            if (!block.isDistractor()) {
                output.push(block);
            } else if ($.inArray(block, distractors) == -1) {
                output.push(block);
            }
        }
        //var output = input;
        if (giveIndentation) {
            for (let i = 0; i < output.length; i++) {
                output[i].addIndent();
            }
            this.indent = 0;
            this.noindent = true;
        }
        // combine blocks
        var solution = [];
        for (i = 0; i < this.lines.length; i++) {
            for (var j = 0; j < output.length; j++) {
                if (output[j].lines[0].index == i) {
                    solution.push(output[j]);
                }
            }
        }
        for (let i = 0; i < nBlocksToCombine; i++) {
            // combine one set of blocks
            var best = -10;
            var combineIndex = -10;
            for (j = 0; j < solution.length - 1; j++) {
                block = solution[j];
                var next = solution[j + 1];
                var rating = 10 - block.lines.length - next.lines.length;
                var blockIndent = block.minimumLineIndent();
                var nextIndent = next.minimumLineIndent();
                if (blockIndent == nextIndent) {
                    rating += 2;
                } else if (blockIndent > nextIndent) {
                    rating -= 1;
                }
                if (
                    block.lines[block.lines.length - 1].indent ==
                    next.lines[0].indent
                ) {
                    rating += 1;
                }
                if (rating >= best) {
                    best = rating;
                    combineIndex = j;
                }
            }
            block = solution[combineIndex];
            next = solution[combineIndex + 1];
            for (j = 0; j < next.lines.length; j++) {
                block.addLine(next.lines[j]);
            }
            var newSolution = [];
            for (j = 0; j < solution.length; j++) {
                if (j !== combineIndex + 1) {
                    newSolution.push(solution[j]);
                }
            }
            var solution = newSolution;
        }
        // reorder
        var combinedOutput = [];
        for (i = 0; i < output.length; i++) {
            for (j = 0; j < solution.length; j++) {
                if (output[i].lines[0].index == solution[j].lines[0].index) {
                    combinedOutput.push(solution[j]);
                }
            }
        }
        return combinedOutput;
    }
    // Return an array of code blocks based on what is specified in the problem
    blocksFromSource() {
        var unorderedBlocks = [];
        var originalBlocks = [];
        var blocks = [];
        var lines = [];
        var block, line, i;
        for (i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            // CodeTailor: do not include place holder or settled solution lines in source blocks
            if (line.isPlaceholderLine || line.isSettled) {
                continue;
            }
            lines.push(line);
            if (!line.groupWithNext) {
                unorderedBlocks.push(new _parsonsBlock__WEBPACK_IMPORTED_MODULE_9__["default"](this, lines));
                lines = [];
            }
        }
        originalBlocks = unorderedBlocks;
        // Trim the distractors
        var removedBlocks = [];
        if (this.options.maxdist !== undefined) {
            var maxdist = this.options.maxdist;
            var distractors = [];
            for (i = 0; i < unorderedBlocks.length; i++) {
                block = unorderedBlocks[i];
                if (block.lines[0].distractor) {
                    distractors.push(block);
                }
            }
            if (maxdist < distractors.length) {
                distractors = this.shuffled(distractors);
                distractors = distractors.slice(0, maxdist);
                for (i = 0; i < unorderedBlocks.length; i++) {
                    block = unorderedBlocks[i];
                    if (block.lines[0].distractor) {
                        if ($.inArray(block, distractors) > -1) {
                            blocks.push(block);
                        } else {
                            removedBlocks.push(i);
                        }
                    } else {
                        blocks.push(block);
                    }
                }
                unorderedBlocks = blocks;
                blocks = [];
            }
        }

        // This is necessary, set the pairDistractors value before blocks get shuffled - William Li (August 2020)
        if (this.recentAttempts < 2) {
            // 1 Try
            this.pairDistractors = false;
        } else {
            this.pairDistractors = true;
        }

        if (this.options.order === undefined) {
            // Shuffle, respecting paired distractors
            var chunks = [],
                chunk = [];
            for (i = 0; i < unorderedBlocks.length; i++) {
                block = unorderedBlocks[i];
                if (block.lines[0].paired && this.pairDistractors) {
                    // William Li (August 2020)
                    chunk.push(block);
                } else {
                    chunk = [];
                    chunk.push(block);
                    chunks.push(chunk);
                }
            }
            chunks = this.shuffled(chunks);
            for (i = 0; i < chunks.length; i++) {
                chunk = chunks[i];
                if (chunk.length > 1) {
                    // shuffle paired distractors
                    chunk = this.shuffled(chunk);
                    for (j = 0; j < chunk.length; j++) {
                        blocks.push(chunk[j]);
                    }
                } else {
                    blocks.push(chunk[0]);
                }
            }
        } else {
            // Order according to order specified
            for (i = 0; i < this.options.order.length; i++) {
                block = originalBlocks[this.options.order[i]];
                if (
                    block !== undefined &&
                    $.inArray(this.options.order[i], removedBlocks) < 0
                ) {
                    blocks.push(block);
                }
            }
        }
        this.pairDistractors = true;
        if (this.options.adaptive) {
            this.limitDistractors = true;
            blocks = this.adaptBlocks(blocks);
            if (!this.limitDistractors) {
                for (i = 0; i < removedBlocks.length; i++) {
                    var index =
                        this.options.order == undefined
                            ? Math.random(0, blocks.length)
                            : $.inArray(removedBlocks[i], this.options.order);
                    blocks.splice(index, 0, originalBlocks[removedBlocks[i]]);
                }
            }
        }
        if (this.pairDistractors && this.options.order != undefined) {
            //move pairs together
            //Go through array looking for ditractor and its pair
            for (i = 1; i < originalBlocks.length; i++) {
                if (
                    originalBlocks[i].lines[0].paired &&
                    $.inArray(originalBlocks[i], blocks) >= 0
                ) {
                    var j = i;
                    while ($.inArray(originalBlocks[j - 1], blocks) < 0) {
                        // find the paired distractor or solution block it will be next to
                        j--;
                    }
                    var indexTo = $.inArray(originalBlocks[j - 1], blocks);
                    var indexFrom = $.inArray(originalBlocks[i], blocks);
                    blocks.splice(indexFrom, 1);
                    blocks.splice(indexTo, 0, originalBlocks[i]);
                }
            }
        }
        return blocks;
    }
    // Return a codeblock that corresponds to the hash
    blockFromHash(hash) {
        var split = hash.split("_");
        var lines = [];
        for (var i = 0; i < split.length - 1; i++) {
            lines.push(this.lines[split[i]]);
        }
        var block = new _parsonsBlock__WEBPACK_IMPORTED_MODULE_9__["default"](this, lines);
        if (this.noindent) {
            block.indent = 0;
        } else {
            block.indent = Number(split[split.length - 1]);
        }
        return block;
    }
    // Return an array of codeblocks that corresponds to the hash
    blocksFromHash(hash) {
        var split;
        if (hash === "-" || hash === "" || hash === null) {
            split = [];
        } else {
            split = hash.split("-");
        }
        var blocks = [];
        for (var i = 0; i < split.length; i++) {
            blocks.push(this.blockFromHash(split[i]));
        }
        if (this.options.adaptive) {
            return this.adaptBlocks(blocks);
        } else {
            return blocks;
        }
    }

    // CodeTailor: Return a list of blocks with placeholders that should be provided in the answer area.
    settledBlocksFromSource() {
        var blocks = [];
        var lines = [];
        var answerBlocksCount = 0;
        var line, i;
        var settledBlocksBeforeCount = 0;
        var prevSettledBlock = undefined;
        var prevPlaceholderSize = 0;

        for (i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            lines.push(line);
            if (!line.groupWithNext) {
                if (line.isPlaceholderLine) {
                    // found a placeholder line. a placeholder line has at least one normal block before it.
                    // also a placeholder line always has "groupWithNext" false.
                    blocks.push(new _placeholderBlock_js__WEBPACK_IMPORTED_MODULE_10__["default"](this, lines, answerBlocksCount, settledBlocksBeforeCount));
                    // update the number of blocks missing for the settled block above
                    if (prevSettledBlock) {
                        prevSettledBlock.setBlocksAfter(answerBlocksCount);
                    }
                    // save the current number of answer blocks to update the tooltip for the settled block below
                    prevPlaceholderSize = answerBlocksCount;
                    // reset answer block count
                    answerBlocksCount = 0;
                    lines = [];
                } else if (line.isSettled) {
                    if (blocks.length == 0) {
                        this.firstBlockSettled = true;
                    }
                    var set = new _settledBlock_js__WEBPACK_IMPORTED_MODULE_12__["default"](this, lines);
                    if (!this.noindent) {
                        set.indent = lines[0].indent;
                    }
                    console.log("settled block set", set);
                    blocks.push(set);
                    if (prevPlaceholderSize > 0) {
                        set.setBlocksBefore(prevPlaceholderSize);
                    }
                    prevSettledBlock = set;
                    settledBlocksBeforeCount++;
                    answerBlocksCount = 0;
                    lines = [];
                } else {
                    if (!lines[0].distractor) {
                        answerBlocksCount++;
                    }
                    lines = [];
                }
            }
        }
        if (blocks.length > 0 && blocks[blocks.length - 1].isSettled) {
            this.lastBlockSettled = true;
        }
        console.log('settledblocksfromsource', blocks)
        return blocks;
    }

    // Return a block object by the full id including id prefix
    getBlockById(id) {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block.view.id == id) {
                return block;
            }
        }
        return undefined;
    }
    // Return array of codeblocks that are the solution
    solutionBlocks() {
        var solutionBlocks = [];
        var solutionLines = [];
        for (var i = 0; i < this.lines.length; i++) {
            if (!this.lines[i].distractor) {
                solutionLines.push(this.lines[i]);
            }
        }
        var block = solutionLines[0].block();
        solutionBlocks.push(block);
        for (let i = 1; i < solutionLines.length; i++) {
            var nextBlock = solutionLines[i].block();
            if (block !== nextBlock) {
                block = nextBlock;
                solutionBlocks.push(block);
            }
        }
        return solutionBlocks;
    }
    // Return array of codeblocks based on what is in the source field
    sourceBlocks() {
        var sourceBlocks = [];
        var children = this.sourceArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if ($(child).hasClass("block")) {
                sourceBlocks.push(this.getBlockById(child.id));
            }
        }
        return sourceBlocks;
    }
    // Return array of enabled codeblocks based on what is in the source field
    enabledSourceBlocks() {
        var all = this.sourceBlocks();
        var enabled = [];
        for (var i = 0; i < all.length; i++) {
            var block = all[i];
            if (block.enabled()) {
                enabled.push(block);
            }
        }
        return enabled;
    }
    // Return array of codeblocks based on what is in the answer field
    answerBlocks() {
        var answerBlocks = [];
        var children = this.answerArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            var block = this.getBlockById(children[i].id);
            if (block !== undefined) {
                answerBlocks.push(block);
            }
        }
        return answerBlocks;
    }
    // Return array of enabled codeblocks based on what is in the answer field
    enabledAnswerBlocks() {
        var all = this.answerBlocks();
        var enabled = [];
        for (var i = 0; i < all.length; i++) {
            var block = all[i];
            if (block.enabled()) {
                enabled.push(block);
            }
        }
        return enabled;
    }
    // Return array of codelines based on what is in the answer field
    answerLines() {
        var answerLines = [];
        var blocks = this.answerBlocks();
        for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            if (!block.isPlaceholder) {
                // CodeTailor: adding non placeholder block
                for (var j = 0; j < block.lines.length; j++) {
                    answerLines.push(block.lines[j]);
                }
            }
        }
        return answerLines;
    }
    // Go up the hierarchy until you get to a block; return that block element
    getBlockFor(element) {
        var check = element;
        while (!check.classList.contains("block")) {
            check = check.parentElement;
        }
        return check;
    }
    // Return the maximum indent for the solution
    solutionIndent() {
        var indent = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            indent = Math.max(indent, block.solutionIndent());
        }
        return indent;
    }
    /* =====================================================================
    ==== ACTION ============================================================
    ===================================================================== */
    // The "Check Me" button was pressed.
    checkCurrentAnswer() {
        if (!this.hasSolved) {
            this.checkCount++;
            this.clearFeedback();
            if (this.adaptiveId == undefined) {
                this.adaptiveId = this.storageId;
            }
            // TODO - rendering feedback is buried in the grader.grade method.
            // to disable feedback set this.grader.showfeedback boolean
            this.grader.showfeedback = false;
            this.grade = this.grader.grade();
            if (this.grade == "correct") {
                this.hasSolved = true;
                this.correct = true;
                $(this.checkButton).prop("disabled", true);
                // CodeTailor: make the Copy Answer button visible when the puzzle is solved
                if (this.hasSolved && this.options.scaffolding) {
                    const copyBtn = document.querySelector(`#copy-answer-button-${this.divid}`); // copy-answer-button-${puzzleScaffoldingDivid}
                    if (copyBtn) {
                        copyBtn.classList.remove('copy-button-hide');
                    }
                }
                localStorage.setItem(this.adaptiveId + "Solved", true);
                this.recentAttempts = this.checkCount;
                localStorage.setItem(
                    this.adaptiveId + "recentAttempts",
                    this.recentAttempts
                );
            }
            localStorage.setItem(
                this.adaptiveId + this.divid + "Count",
                this.checkCount
            );
            this.setLocalStorage();
            // if not solved and not too short then check if should provide help
            if (!this.hasSolved && this.grade !== "incorrectTooShort") {
                if (this.canHelp) {
                    // only count the attempt if the answer is different (to prevent gaming)
                    var answerHash = this.answerHash();
                    if (this.lastAnswerHash !== answerHash) {
                        this.numDistinct++;
                        this.lastAnswerHash = answerHash;
                    }
                    // if time to offer help
                    if (this.numDistinct == 3 && !this.gotHelp) {
                        alert($.i18n("msg_parson_help_info"));
                    } // end if
                } // end if can help
            } // end if not solved
        } // end outer if not solved

        // if now or previous was correct, display runnable
        if (this.hasSolved && this.options.runnable) {
            if (!this.runnableDiv)
                this.generateRunableVersion();
            else //reveal "reset" runnable
                this.runnableDiv.style.display = null;
        }
    }

    // Conver the parsons-runnable into an activecode and display it
    generateRunableVersion() {
        this.runnableDiv = document.getElementById(this.divid + "-runnable");
        this.runnableDiv.style.display = null;

        let parsonsText = '';
        for (let b of this.answerBlocks()) {
            for (let l of b.lines) {
                parsonsText += '    '.repeat(l.indent) + l.text + '\n';
            }
        }
        parsonsText = parsonsText.slice(0, -1); // remove last newline

        const textEl = this.runnableDiv.querySelector('textarea');
        textEl.innerHTML = textEl.innerHTML.replace('==PARSONSCODE==', parsonsText);

        // data-component="parsons-runnable" marks it as waiting to be turned into an activecode
        const activeCodeToBe = this.runnableDiv.querySelector('[data-component="parsons-runnable"]');
        activeCodeToBe.dataset.component = 'activecode';

        window.runestoneComponents.renderOneComponent(this.runnableDiv);
    }

    renderFeedback() {
        this.grader.showfeedback = true;
        this.grade = this.grader.graderState;
        var feedbackArea;
        var answerArea = $(this.answerArea);

        if (this.showfeedback === true) {
            feedbackArea = $(this.messageDiv);
        } else {
            feedbackArea = $("#doesnotexist");
        }

        if (this.grade === "correct") {
            answerArea.addClass("correct");
            this.messageDiv.style.visibility = "visible";
            feedbackArea.attr("class", "alert alert-info");
            let message = this.checkCount > 1
                ? $.i18n("msg_parson_correct", this.checkCount)
                : $.i18n("msg_parson_correct_first_try");
            if (this.options.runnable)
                message += " " + $.i18n("msg_parson_correct_runnable");
            setTimeout(() => {
                feedbackArea.html(message);
            }, 10);
            // Show block explanations after solving
            this.showBlockExplanations();
        }

        if (this.grade === "incorrectTooShort") {
            // too little code
            answerArea.addClass("incorrect");
            this.messageDiv.style.visibility = "visible";
            feedbackArea.attr("class", "alert alert-danger");
            setTimeout(() => {
                feedbackArea.html($.i18n("msg_parson_too_short"));
            }, 10);
        }

        if (this.grade === "incorrectIndent") {
            var incorrectBlocks = [];
            for (let i = 0; i < this.grader.indentLeft.length; i++) {
                block = this.grader.indentLeft[i].block();
                if (incorrectBlocks.indexOf(block) == -1) {
                    incorrectBlocks.push(block);
                    $(block.view).addClass("indentLeft");
                }
            }
            for (let i = 0; i < this.grader.indentRight.length; i++) {
                block = this.grader.indentRight[i].block();
                if (incorrectBlocks.indexOf(block) == -1) {
                    incorrectBlocks.push(block);
                    $(block.view).addClass("indentRight");
                }
            }
            this.messageDiv.style.visibility = "visible";
            feedbackArea.attr("class", "alert alert-danger");
            setTimeout(() => {
                if (incorrectBlocks.length == 1) {
                    feedbackArea.html($.i18n("msg_parson_wrong_indent"));
                } else {
                    feedbackArea.html($.i18n("msg_parson_wrong_indents"));
                }
            }, 10);
        }

        if (this.grade === "incorrectMoveBlocks") {
            var answerBlocks = this.answerBlocks();
            var inSolution = [];
            var inSolutionIndexes = [];
            var notInSolution = [];
            for (let i = 0; i < answerBlocks.length; i++) {
                var block = answerBlocks[i];
                var index = this.solution.indexOf(block.lines[0]);
                if (index == -1) {
                    notInSolution.push(block);
                } else {
                    inSolution.push(block);
                    inSolutionIndexes.push(index);
                }
            }
            var lisIndexes = this.grader.inverseLISIndices(
                inSolutionIndexes,
                inSolution
            );
            for (let i = 0; i < lisIndexes.length; i++) {
                notInSolution.push(inSolution[lisIndexes[i]]);
            }
            answerArea.addClass("incorrect");
            this.messageDiv.style.visibility = "visible";
            feedbackArea.attr("class", "alert alert-danger");
            if (this.showfeedback === true) {
                for (let i = 0; i < notInSolution.length; i++) {
                    $(notInSolution[i].view).addClass("incorrectPosition");
                }
            }
            setTimeout(() => {
                feedbackArea.html($.i18n("msg_parson_wrong_order"));
            }, 10);
        }
    }

    // Show explanations for blocks after the student solves the exercise
    // Uses the same tooltip mechanism as distractor help text (hover to see)
    showBlockExplanations() {
        if (!this.blockExplanations || Object.keys(this.blockExplanations).length === 0) {
            return;
        }
        this.hideBlockExplanations(); // clear any previous
        var answerBlocks = this.answerBlocks();
        for (var i = 0; i < answerBlocks.length; i++) {
            var block = answerBlocks[i];
            var blockIndex = block.lines[0].index;
            // The explanation map keys are block indices as they appear in the original source
            // Try matching by the block's first line index in the original order
            var explanation = this.blockExplanations[String(blockIndex)];
            if (!explanation) {
                // Also try by position in the answer area
                explanation = this.blockExplanations[String(i)];
            }
            if (explanation) {
                // Use the same tooltip approach as distractors:
                // set data-toggle="tooltip" and title attribute for hover display
                block.view.setAttribute("data-toggle", "tooltip");
                block.view.setAttribute("title", explanation);
                $(block.view).addClass("has-explanation");
            }
        }
    }

    // Remove all block explanations (tooltip attributes)
    hideBlockExplanations() {
        var blocks = $(this.answerArea).find(".has-explanation");
        blocks.each(function () {
            this.removeAttribute("data-toggle");
            this.removeAttribute("title");
            this.removeAttribute("data-original-title");
        });
        blocks.removeClass("has-explanation");
    }

    /* =====================================================================
    ==== ADAPTIVE ==========================================================
    ===================================================================== */
    // Initialize this problem as adaptive
    //    helpCount = number of checks before help is given (negative)
    //    canHelp = boolean as to whether help can be provided
    //    checkCount = how many times it has been checked before correct
    //    userRating = 0..100 how good the person is at solving problems
    initializeAdaptive() {
        this.adaptiveId = super.localStorageKey();
        this.canHelp = true;
        //this.helpCount = -3; // Number of checks before help is offered
        this.checkCount = 0;
        this.numDistinct = 0; // number of distinct solution attempts (different from previous)
        this.gotHelp = false;
        // Initialize the userRating
        var storageProblem = localStorage.getItem(this.adaptiveId + "Problem");
        if (storageProblem == this.divid) {
            // Already in this problem
            this.checkCount = localStorage.getItem(
                this.adaptiveId + this.divid + "Count"
            );
            if (this.checkCount == undefined) {
                this.checkCount = 0;
            }
            return this;
        }
        var count = localStorage.getItem(
            this.adaptiveId + this.divid + "Count"
        );
        if (count == undefined || count == "NaN") {
            count = 0;
        }
        this.checkCount = count;
        this.recentAttempts = localStorage.getItem(
            this.adaptiveId + "recentAttempts"
        );
        if (this.recentAttempts == undefined || this.recentAttempts == "NaN") {
            this.recentAttempts = 3;
        }
        localStorage.setItem(
            this.adaptiveId + "recentAttempts",
            this.recentAttempts
        );
        localStorage.setItem(this.adaptiveId + "Problem", this.divid);
        localStorage.setItem(
            this.adaptiveId + this.divid + "Count",
            this.checkCount
        );
        localStorage.setItem(this.adaptiveId + "Solved", false);
    }
    // Return a boolean of whether the user must deal with indentation
    usesIndentation() {
        if (this.noindent || this.solutionIndent() == 0) {
            // was $(this.answerArea).hasClass("answer") - bje changed
            return false;
        } else {
            return true;
        }
    }
    // Find a distractor to remove to make the problem easier
    //  * try first in the answer area
    //  * if not, try the source area
    //  * if not, return undefined
    distractorToRemove() {
        var blocks = this.enabledAnswerBlocks();
        var block;
        for (let i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.isDistractor()) {
                return block;
            }
        }
        blocks = this.enabledSourceBlocks();
        for (let i = 0; i < blocks.length; i++) {
            block = blocks[i];
            if (block.isDistractor()) {
                return block;
            }
        }
        return undefined;
    }
    // Return the number of blocks that exist
    numberOfBlocks(fIncludeDistractors = true) {
        var numberOfBlocks = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            if (
                this.blocks[i].enabled() &&
                (fIncludeDistractors || !this.blocks[i].isDistractor())
            ) {
                numberOfBlocks += 1;
            }
        }
        return numberOfBlocks;
    }
    // Remove this distractors to make the problem easier
    removeDistractor(block) {
        // Alert the user to what is happening
        var feedbackArea = $(this.messageDiv);
        this.messageDiv.style.visibility = "visible";
        feedbackArea.attr("class", "alert alert-info");
        setTimeout(() => {
            feedbackArea.html($.i18n("msg_parson_not_solution"));
        }, 10);
        // Stop ability to select
        if (block.lines[0].distractHelptext) {
            block.view.setAttribute("data-toggle", "tooltip");
            block.view.setAttribute("title", block.lines[0].distractHelptext);
        }
        block.disable();
        // If in answer area, move to source area
        if (!block.inSourceArea()) {
            var sourceRect = this.sourceArea.getBoundingClientRect();
            var startX = block.pageXCenter() - 1;
            var startY = block.pageYCenter();
            var endX =
                sourceRect.left + window.pageXOffset + sourceRect.width / 2;
            var endY =
                sourceRect.top +
                window.pageYOffset +
                block.view.getBoundingClientRect().height / 2;
            var slideUnderBlock = block.slideUnderBlock();
            if (slideUnderBlock !== undefined) {
                endY +=
                    slideUnderBlock.view.getBoundingClientRect().height + 20;
                endY += parseInt($(slideUnderBlock.view).css("top"));
            }
            var that = this;
            $(block.view).css({
                "border-color": "#000",
                "background-color": "#fff",
            });
            $(block.view).animate(
                {
                    opacity: 1.0,
                },
                {
                    duration:
                        Math.sqrt(
                            Math.pow(endY - startY, 2) +
                            Math.pow(endX - startX, 2)
                        ) *
                        4 +
                        500,
                    start: function () {
                        that.moving = block;
                        that.movingX = startX;
                        that.movingY = startY;
                        that.updateView();
                    },
                    progress: function (a, p, c) {
                        that.movingX = startX * (1 - p) + endX * p;
                        that.movingY = startY * (1 - p) + endY * p;
                        that.updateView();
                    },
                    complete: function () {
                        delete that.moving;
                        delete that.movingX;
                        delete that.movingY;
                        that.updateView();
                        $(block.view).animate(
                            {
                                opacity: 0.3,
                                "border-color": "#d3d3d3",
                                "background-color": "#efefef",
                            },
                            {
                                duration: 1000,
                                complete: function () {
                                    $(block.view).css({
                                        opacity: "",
                                        "border-color": "",
                                        "background-color": "",
                                    });
                                    $(block.view).addClass("disabled");
                                },
                            }
                        );
                    },
                }
            );
        } else {
            $(block.view).css({
                "border-color": "#000",
                "background-color": "#fff",
            });
            $(block.view).animate(
                {
                    opacity: 0.3,
                    "border-color": "#d3d3d3",
                    "background-color": "#efefef",
                },
                {
                    duration: 2000,
                    complete: function () {
                        $(block.view).css({
                            "border-color": "",
                            "background-color": "",
                        });
                    },
                }
            );
        }
    }
    // Give the user the indentation
    removeIndentation() {
        // Alert the user to what is happening
        var feedbackArea = $(this.messageDiv);
        this.messageDiv.style.visibility = "visible";
        feedbackArea.attr("class", "alert alert-info");
        setTimeout(() => {
            feedbackArea.html($.i18n("msg_parson_provided_indent"));
        }, 10);
        // Move and resize blocks
        var blockWidth = 200;
        for (var i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            var expandedWidth =
                line.width + line.indent * this.options.pixelsPerIndent + 30;
            blockWidth = Math.max(blockWidth, expandedWidth);
        }
        if (this.options.numbered != undefined) {
            blockWidth += 25;
        }
        this.areaWidth = blockWidth + 22;
        var block, indent;
        var sourceBlocks = this.sourceBlocks();
        for (let i = 0; i < sourceBlocks.length; i++) {
            block = sourceBlocks[i];
            indent = block.solutionIndent();
            if (indent == 0) {
                $(block.view).animate(
                    {
                        width: blockWidth,
                    },
                    {
                        duration: 1000,
                    }
                );
            } else {
                $(block.view).animate(
                    {
                        width:
                            blockWidth - indent * this.options.pixelsPerIndent,
                        "padding-left":
                            indent * this.options.pixelsPerIndent + 10,
                    },
                    {
                        duration: 1000,
                    }
                );
            }
        }
        for (let i = 0; i < this.pairedDivs.length; i++) {
            $(this.pairedDivs[i]).animate(
                {
                    width: blockWidth + 34,
                },
                {
                    duration: 1000,
                }
            );
        }
        var answerBlocks = this.answerBlocks();
        for (let i = 0; i < answerBlocks.length; i++) {
            block = answerBlocks[i];
            indent = block.solutionIndent();
            if (indent == 0) {
                $(block.view).animate(
                    {
                        left: 0,
                        width: blockWidth,
                    },
                    {
                        duration: 1000,
                    }
                );
            } else {
                $(block.view).animate(
                    {
                        left: 0,
                        width:
                            blockWidth - indent * this.options.pixelsPerIndent,
                        "padding-left":
                            indent * this.options.pixelsPerIndent + 10,
                    },
                    {
                        duration: 1000,
                    }
                );
            }
        }
        // Resize answer and source area
        $(this.answerArea).removeClass("answer1 answer2 answer3 answer4");
        $(this.answerArea).addClass("answer");
        this.indent = 0;
        this.noindent = true;
        $(this.sourceArea).animate(
            {
                width: this.areaWidth + 2,
            },
            {
                duration: 1000,
            }
        );
        $(this.answerArea).animate(
            {
                width: this.areaWidth + 2,
            },
            {
                duration: 1000,
            }
        );
        // Change the model (with view)
        $(this.answerArea).animate(
            {
                opacity: 1.0,
            },
            {
                duration: 1100,
                complete: function () {
                    $(this.answerArea).css({
                        opacity: "",
                    });
                    // Update the model
                    for (let i = 0; i < sourceBlocks.length; i++) {
                        sourceBlocks[i].addIndent();
                    }
                    for (let i = 0; i < answerBlocks.length; i++) {
                        answerBlocks[i].addIndent();
                    }
                },
            }
        );
    }

    // first check if any solution blocks are in the source still (left side) and not
    // in the answer
    getSolutionBlockInSource() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var sourceBlocks = this.sourceBlocks();
        var solBlock = null;
        var currBlock = null;

        // loop through sourceBlocks and return a block if it is not in the solution
        for (var i = 0; i < sourceBlocks.length; i++) {
            // get the current block from the source
            currBlock = sourceBlocks[i];

            // if currBlock is in the solution and isn't the first block and isn't in the answer
            if (
                solutionBlocks.indexOf(currBlock) > 0 &&
                answerBlocks.indexOf(currBlock) < 0
            ) {
                return currBlock;
            }
        }
        // didn't find any block in the source that is in the solution
        return null;
    }

    // Find a block2 that is furthest from block1 in the answer
    // don't use the very first block in the solution as block2
    getFurthestBlock() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var maxDist = 0;
        var dist = 0;
        var maxBlock = null;
        var currBlock = null;
        var indexSol = 0;
        var prevBlock = null;
        var indexPrev = 0;

        // loop through the blocks in the answer
        for (var i = 0; i < answerBlocks.length; i++) {
            currBlock = answerBlocks[i];
            indexSol = solutionBlocks.indexOf(currBlock);
            if (indexSol > 0) {
                prevBlock = solutionBlocks[indexSol - 1];
                indexPrev = answerBlocks.indexOf(prevBlock);
                //alert("my index " + i + " index prev " + indexPrev);

                // calculate the distance in the answer
                dist = Math.abs(i - indexPrev);
                if (dist > maxDist) {
                    maxDist = dist;
                    maxBlock = currBlock;
                }
            }
        }
        return maxBlock;
    }

    // Combine blocks together
    combineBlocks() {
        var solutionBlocks = this.solutionBlocks();
        var answerBlocks = this.answerBlocks();
        var sourceBlocks = this.sourceBlocks();

        // Alert the user to what is happening
        var feedbackArea = $(this.messageDiv);
        this.messageDiv.style.visibility = "visible";
        feedbackArea.attr("class", "alert alert-info");
        setTimeout(() => {
            feedbackArea.html($.i18n("msg_parson_combined_blocks"));
        }, 10);
        var block1 = null;
        var block2 = null;

        // get a solution block that is still in source (not answer), if any
        block2 = this.getSolutionBlockInSource();

        // if none in source get block that is furthest from block1
        if (block2 == null) {
            block2 = this.getFurthestBlock();
        }

        // get block1 (above block2) in solution
        var index = solutionBlocks.indexOf(block2);
        block1 = solutionBlocks[index - 1];

        // get index of each in answer
        var index1 = answerBlocks.indexOf(block1);
        var index2 = answerBlocks.indexOf(block2);
        var move = false;

        // if both in answer set move based on if directly above each other
        if (index1 >= 0 && index2 >= 0) {
            move = index1 + 1 !== index2;

            // else if both in source set move again based on if above each other
        } else if (index1 < 0 && index2 < 0) {
            index1 = sourceBlocks.indexOf(block1);
            index2 = sourceBlocks.indexOf(block2);
            move = index1 + 1 !== index2;

            // one in source and one in answer so must move
        } else {
            move = true;
            if (index1 < 0) {
                index1 = sourceBlocks.indexOf(block1);
            }
            if (index2 < 0) {
                index2 = sourceBlocks.indexOf(block2);
            }
        }

        var subtract = index2 < index1; // is block2 higher

        if (move) {
            // Move the block
            var startX = block2.pageXCenter() - 1;
            var startY = block2.pageYCenter();
            var endX = block1.pageXCenter() - 1;
            var endY =
                block1.pageYCenter() +
                block1.view.getBoundingClientRect().height / 2 +
                5;
            if (subtract) {
                endY -= block2.view.getBoundingClientRect().height / 2;
            } else {
                endY += block2.view.getBoundingClientRect().height / 2;
            }
            var that = this;
            $(block2.view).animate(
                {
                    opacity: 1,
                },
                {
                    duration: 1000, // 1 seccond
                    start: function () {
                        $(block1.view).css({
                            "border-color": "#000",
                            "background-color": "#fff",
                        });
                        $(block2.view).css({
                            "border-color": "#000",
                            "background-color": "#fff",
                        });
                        block2.lines[0].index += 1000;
                        that.moving = block2;
                        that.movingX = startX;
                        that.movingY = startY;
                        that.updateView();
                    },
                    progress: function (a, p, c) {
                        that.movingX = startX * (1 - p) + endX * p;
                        that.movingY = startY * (1 - p) + endY * p;
                        that.updateView();
                    },
                    complete: function () {
                        delete that.moving;
                        delete that.movingX;
                        delete that.movingY;
                        that.updateView();
                        block2.lines[0].index -= 1000;
                        block1.consumeBlock(block2);
                        $(block1.view).animate(
                            {
                                "border-color": "#d3d3d3",
                                "background-color": "#efefef",
                            },
                            {
                                duration: 1000,
                                complete: function () {
                                    $(block1.view).css({
                                        "border-color": "",
                                        "background-color": "",
                                    });
                                },
                            }
                        );
                    },
                }
            );
        } else {
            $(block2.view).animate(
                {
                    opacity: 1,
                },
                {
                    duration: 1000,
                    start: function () {
                        $(block1.view).css({
                            "border-color": "#000",
                            "background-color": "#fff",
                        });
                        $(block2.view).css({
                            "border-color": "#000",
                            "background-color": "#fff",
                        });
                    },
                    complete: function () {
                        block1.consumeBlock(block2);
                        $(block1.view).animate(
                            {
                                "border-color": "#d3d3d3",
                                "background-color": "#efefef",
                            },
                            {
                                duration: 1000,
                                complete: function () {
                                    $(block1.view).css({
                                        "border-color": "",
                                        "background-color": "",
                                    });
                                },
                            }
                        );
                    },
                }
            );
        }
    }
    // Adapt the problem to be easier
    //  * remove a distractor until none are present
    //  * combine blocks until 3 are left
    makeEasier() {
        var distractorToRemove = this.distractorToRemove();
        if (
            distractorToRemove !== undefined &&
            !distractorToRemove.inSourceArea()
        ) {
            alert($.i18n("msg_parson_remove_incorrect"));
            this.removeDistractor(distractorToRemove);
            this.logMove("removedDistractor-" + distractorToRemove.hash());
        } else {
            var numberOfBlocks = this.numberOfBlocks(false);
            if (numberOfBlocks > 3) {
                alert($.i18n("msg_parson_will_combine"));
                this.combineBlocks();
                this.logMove("combinedBlocks");
            } else {
                /*else if(this.numberOfBlocks(true) > 3 && distractorToRemove !==  undefined) {
                           alert("Will remove an incorrect code block from source area");
                           this.removeDistractor(distractorToRemove);
                           this.logMove("removedDistractor-" + distractorToRemove.hash());
                       } */
                alert($.i18n("msg_parson_three_blocks_left"));
                this.canHelp = false;
            }
            //if (numberOfBlocks < 5) {
            //	this.canHelp = false;
            //	this.helpButton.disabled = true;
            //}
        }
    }
    // The "Help Me" button was pressed and the problem should be simplified
    helpMe() {
        this.clearFeedback();
        //this.helpCount = -1; // amount to allow for multiple helps in a row
        //if (this.helpCount < 0) {
        //	this.helpCount = Math.max(this.helpCount, -1); // min 1 attempt before more help
        //this.helpButton.disabled = true;
        //}
        // if less than 3 attempts
        if (this.numDistinct < 3) {
            alert($.i18n("msg_parson_atleast_three_attempts"));
        }
        // otherwise give help
        else {
            this.gotHelp = true;
            this.makeEasier();
        }
    }
    /* =====================================================================
    ==== UTILITY ===========================================================
    ===================================================================== */
    // Return a date from a timestamp (either mySQL or JS format)
    dateFromTimestamp(timestamp) {
        var date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            var t = timestamp.split(/[- :]/);
            date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
        }
        return date;
    }
    // A function for returning a shuffled version of an array
    shuffled(array) {
        var currentIndex = array.length;
        var returnArray = array.slice();
        var temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = returnArray[currentIndex];
            returnArray[currentIndex] = returnArray[randomIndex];
            returnArray[randomIndex] = temporaryValue;
        }
        return returnArray;
    }
    /* =====================================================================
    ==== KEYBOARD INTERACTION ==============================================
    ===================================================================== */
    // When the user has entered the Parsons problem via keyboard mode
    enterKeyboardMode() {
        $(this.keyboardTip).show();
        $(this.sourceLabel).hide();
        $(this.answerLabel).hide();
        this.clearFeedback();
    }
    // When the user leaves the Parsons problem via keyboard mode
    exitKeyboardMode() {
        $(this.keyboardTip).hide();
        $(this.sourceLabel).show();
        $(this.answerLabel).show();
    }
    /* =====================================================================
    ==== VIEW ==============================================================
    ===================================================================== */
    // Clear any feedback from the answer area
    clearFeedback() {
        $(this.answerArea).removeClass("incorrect correct");
        var children = this.answerArea.childNodes;
        for (var i = 0; i < children.length; i++) {
            $(children[i]).removeClass(
                "correctPosition incorrectPosition indentLeft indentRight"
            );
        }
        this.messageDiv.style.visibility = "hidden";
        this.hideBlockExplanations();
    }
    // Disable the interface
    async disableInteraction() {
        // Disable blocks
        await this.checkServerComplete;
        console.log("disabling blocks");
        if (this.blocks !== undefined) {
            for (var i = 0; i < this.blocks.length; i++) {
                var block = this.blocks[i];
                block.disable();
            }
        }
        // Hide buttons
        $(this.checkButton).hide();
        $(this.resetButton).hide();
    }
    // Based on the moving element, etc., establish the moving state
    //   rest: not moving
    //   source: moving inside source area
    //   answer: moving inside answer area
    //   moving: moving outside areas
    movingState() {
        if (this.moving == undefined) {
            return "rest";
        }
        var x = this.movingX - window.pageXOffset;
        var y = this.movingY - window.pageYOffset;
        // Check if in answer area
        var bounds = this.answerArea.getBoundingClientRect();
        if (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        ) {
            return "answer";
        }
        // Check if in source area
        bounds = this.sourceArea.getBoundingClientRect();
        if (
            x >= bounds.left &&
            x <= bounds.right &&
            y >= bounds.top &&
            y <= bounds.bottom
        ) {
            return "source";
        }
        return "moving";
    }
    // Update the Parsons view
    // This gets called when dragging a block
    updateView() {
        // Based on the new and the old state, figure out what to update
        var state = this.state;
        var newState = this.movingState();
        var updateSource = true;
        var updateAnswer = true;
        var updateMoving = newState == "moving";
        if (state == newState) {
            if (newState == "rest") {
                updateSource = false;
                updateAnswer = false;
            } else if (newState == "source") {
                updateAnswer = false;
            } else if (newState == "answer") {
                updateSource = false;
            } else if (newState == "moving") {
                updateAnswer = false;
                updateSource = false;
            }
        }
        var movingHeight;
        if (this.moving !== undefined) {
            // Must get height here as detached items don't have height
            movingHeight = $(this.moving.view).outerHeight(true);
            $(this.moving.view).detach();
        }
        var positionTop, width;
        var baseWidth = this.areaWidth - 22;
        // Update the Source Area
        if (updateSource) {
            positionTop = 0;
            var blocks = this.sourceBlocks();
            if (newState == "source") {
                var hasInserted = false;
                var movingBin = this.moving.pairedBin();
                var binForBlock = [];
                for (i = 0; i < blocks.length; i++) {
                    binForBlock.push(blocks[i].pairedBin());
                }
                if (!binForBlock.includes(movingBin)) {
                    movingBin = -1;
                }
                var insertPositions = [];
                if (binForBlock.length == 0) {
                    insertPositions.push(0);
                } else {
                    if (movingBin == -1) {
                        insertPositions.push(0);
                    } else if (binForBlock[0] == movingBin) {
                        insertPositions.push(0);
                    }
                    for (i = 1; i < blocks.length; i++) {
                        if (binForBlock[i - 1] == movingBin) {
                            insertPositions.push(i);
                        } else if (binForBlock[i] == movingBin) {
                            insertPositions.push(i);
                        } else if (
                            movingBin == -1 &&
                            binForBlock[i - 1] != binForBlock[i]
                        ) {
                            insertPositions.push(i);
                        }
                    }
                    if (movingBin == -1) {
                        insertPositions.push(binForBlock.length);
                    } else if (
                        binForBlock[binForBlock.length - 1] == movingBin
                    ) {
                        insertPositions.push(binForBlock.length);
                    }
                }
                var x =
                    this.movingX -
                    this.sourceArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    baseWidth / 2 -
                    11;
                var y =
                    this.movingY -
                    this.sourceArea.getBoundingClientRect().top -
                    window.pageYOffset;
                for (i = 0; i < blocks.length; i++) {
                    var item = blocks[i];
                    var j;
                    if (!hasInserted && insertPositions.includes(i)) {
                        var testHeight = $(item.view).outerHeight(true);
                        for (j = i + 1; j < blocks.length; j++) {
                            if (insertPositions.includes(j)) {
                                break;
                            }
                            testHeight += $(blocks[j].view).outerHeight(true);
                        }
                        if (
                            y - positionTop < movingHeight + testHeight / 2 ||
                            i == insertPositions[insertPositions.length - 1]
                        ) {
                            hasInserted = true;
                            this.sourceArea.insertBefore(
                                this.moving.view,
                                item.view
                            );
                            $(this.moving.view).css({
                                left: x,
                                top: y - movingHeight / 2,
                                width: baseWidth,
                                "z-index": 3,
                            });
                            positionTop = positionTop + movingHeight;
                        }
                    }
                    $(item.view).css({
                        left: 0,
                        top: positionTop,
                        width: baseWidth,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(item.view).outerHeight(true);
                }
                if (!hasInserted) {
                    $(this.moving.view).appendTo(
                        "#" + this.counterId + "-source"
                    );
                    $(this.moving.view).css({
                        left: x,
                        top: y - $(this.moving.view).outerHeight(true) / 2,
                        width: baseWidth,
                        "z-index": 3,
                    });
                }
            } else {
                for (var i = 0; i < blocks.length; i++) {
                    item = blocks[i];
                    $(item.view).css({
                        left: 0,
                        top: positionTop,
                        width: baseWidth,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(item.view).outerHeight(true);
                }
            }
            // Update the Paired Distractor Indicators
            for (i = 0; i < this.pairedBins.length; i++) {
                var bin = this.pairedBins[i];
                var matching = [];
                for (j = 0; j < blocks.length; j++) {
                    block = blocks[j];
                    if (block.matchesBin(bin)) {
                        matching.push(block);
                    }
                }
                var div = this.pairedDivs[i];
                if (matching.length == 0) {
                    $(div).hide();
                } else {
                    $(div).show();
                    var height = -5;
                    height += parseInt(
                        $(matching[matching.length - 1].view).css("top")
                    );
                    height -= parseInt($(matching[0].view).css("top"));
                    height += $(matching[matching.length - 1].view).outerHeight(
                        true
                    );
                    $(div).css({
                        left: -6,
                        top: $(matching[0].view).css("top"),
                        width: baseWidth + 34,
                        height: height,
                        "z-index": 1,
                        "text-indent": -30,
                        "padding-top": (height - 70) / 2,
                        overflow: "visible",
                        "font-size": 43,
                        "vertical-align": "middle",
                        color: "#7e7ee7",
                    });
                    $(div).html(
                        "<span id= 'st' style = 'vertical-align: middle; font-weight: bold; font-size: 15px'>or</span>{"
                    );
                }
                if (matching.length == 1) {
                    $(div).html("");
                }
            }
        }
        // Update the Answer Area
        if (updateAnswer) {
            var block, indent;
            positionTop = 0;
            width =
                this.areaWidth +
                this.indent * this.options.pixelsPerIndent -
                22;
            var blocks = this.answerBlocks();
            if (newState == "answer") {
                var hasInserted = false;
                var x =
                    this.movingX -
                    this.answerArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    baseWidth / 2 -
                    11;
                var movingIndent = Math.round(x / this.options.pixelsPerIndent);
                if (movingIndent < 0) {
                    movingIndent = 0;
                } else if (movingIndent > this.indent) {
                    movingIndent = this.indent;
                } else {
                    x = movingIndent * this.options.pixelsPerIndent;
                }
                var y =
                    this.movingY -
                    this.answerArea.getBoundingClientRect().top -
                    window.pageYOffset;
                this.moving.indent = movingIndent;
                for (i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    if (!hasInserted) {
                        if (
                            y - positionTop <
                            (movingHeight + $(block.view).outerHeight(true)) / 2
                        ) {
                            hasInserted = true;
                            this.answerArea.insertBefore(
                                this.moving.view,
                                block.view
                            );
                            $(this.moving.view).css({
                                left: x,
                                top: y - movingHeight / 2,
                                width: baseWidth,
                                "z-index": 3,
                            });
                            positionTop = positionTop + movingHeight;
                        }
                    }
                    indent = block.indent * this.options.pixelsPerIndent;
                    $(block.view).css({
                        left: indent,
                        top: positionTop,
                        width: width - indent,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(block.view).outerHeight(true);
                }
                if (!hasInserted) {
                    $(this.moving.view).appendTo(
                        "#" + this.counterId + "-answer"
                    );
                    $(this.moving.view).css({
                        left: x,
                        top: y - $(this.moving.view).outerHeight(true) / 2,
                        width: baseWidth,
                        "z-index": 3,
                    });
                }
            } else {
                for (let i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    indent = block.indent * this.options.pixelsPerIndent;
                    $(block.view).css({
                        left: indent,
                        top: positionTop,
                        width: width - indent,
                        "z-index": 2,
                    });
                    positionTop = positionTop + $(block.view).outerHeight(true);
                }
            }
        }
        // Update the Moving Area
        if (updateMoving) {
            // Add it to the lowest place in the source area
            movingBin = this.moving.pairedBin();
            if (movingBin == -1) {
                $(this.moving.view).appendTo("#" + this.counterId + "-source");
            } else {
                var before;
                blocks = this.sourceBlocks;
                for (i = 0; i < blocks.length; i++) {
                    block = blocks[i];
                    if (block.pairedBin() == movingBin) {
                        before = i + 1;
                    }
                }
                if (before == undefined || before == blocks.length) {
                    $(this.moving.view).appendTo(
                        "#" + this.counterId + "-source"
                    );
                } else {
                    this.sourceArea.insertBefore(
                        this.moving.view,
                        blocks[before].view
                    );
                }
            }
            // Place in the middle of the mouse cursor
            $(this.moving.view).css({
                left:
                    this.movingX -
                    this.sourceArea.getBoundingClientRect().left -
                    window.pageXOffset -
                    $(this.moving.view).outerWidth(true) / 2,
                top:
                    this.movingY -
                    this.sourceArea.getBoundingClientRect().top -
                    window.pageYOffset -
                    movingHeight / 2,
                width: baseWidth,
                "z-index": 3,
            });
        }
        state = newState;
        this.state = state;
    }
    addBlockLabels(blocks) {
        var bin = -1;
        var binCount = 0;
        var binChildren = 0;
        var blocksNotInBins = 0;
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].pairedBin() == -1) {
                blocksNotInBins++;
            }
        }
        for (let i = 0; i < blocks.length; i++) {
            var currentBin = blocks[i].pairedBin();
            if (currentBin == -1 || currentBin != bin) {
                bin = currentBin;
                binChildren = 0;
                binCount++;
            }
            var label =
                "" +
                binCount +
                (currentBin != -1
                    ? String.fromCharCode(97 + binChildren)
                    : " ");
            if (
                binCount < 10 &&
                blocksNotInBins + this.pairedBins.length >= 10
            ) {
                label += " ";
            }
            blocks[i].addLabel(label, 0);
            binChildren++;
        }
        if (blocksNotInBins + this.pairedBins.length >= 10) {
            this.areaWidth += 5;
            $(this.sourceArea).css({
                width: $(this.sourceArea).width() + 5,
            });
            $(this.answerArea).css({
                width: $(this.answerArea).width() + 5,
            });
        }
    }
    // Put all the blocks back into the source area, reshuffling as necessary
    resetView() {
        // Clear everything
        this.clearFeedback();
        // CodeTailor: Hide the Copy Answer Button again
        if (this.options.scaffolding === true) {
            const copyBtn = document.querySelector(`#copy-answer-button-${this.divid}`); // copy-answer-button-${puzzleScaffoldingDivid}
            if (copyBtn) {
                copyBtn.classList.add('copy-button-hide');
            }
        }
        var scrollTop = document.body.scrollTop;
        var block;
        for (let i = 0; i < this.blocks.length; i++) {
            block = this.blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                var children = $(block.lines[j].view).find(".block-label");
                for (var c = 0; c < children.length; c++) {
                    children[c].remove();
                }
            }
            block.destroy();
            $(this.blocks[i].view).detach();
        }
        delete this.blocks;
        this.blockIndex = 0;
        if (this.pairedDivs) {
            for (let i = 0; i < this.pairedDivs.length; i++) {
                $(this.pairedDivs[i]).detach();
            }
        }
        $(this.sourceArea).attr("style", "");
        $(this.answerArea).removeClass();
        $(this.answerArea).attr("style", "");
        this.noindent = this.options.noindent;
        // Reinitialize
        if (this.hasSolved) {
            this.checkCount = 0;
            this.numDistinct = 0;
            this.hasSolved = false;
            if (this.options.adaptive) {
                this.canHelp = true;
            }
            //this.helpCount = -3; // enable after 3 failed attempts
            //this.helpButton.disabled = true;
            localStorage.setItem(this.adaptiveId + "Problem", this.divid);
            localStorage.setItem(
                this.adaptiveId + this.divid + "Count",
                this.checkCount
            );
            localStorage.setItem(this.adaptiveId + "Solved", false);
        }
        if (this.options.scaffolding === true) {
            // CodeTailor: initialize the pre-placed Parsons blocks including the settled blocks, if any.
            this.initializeAreas(this.blocksFromSource(), this.settledBlocksFromSource(), {});
        } else {
            this.initializeAreas(this.blocksFromSource(), [], {});
        }
        this.initializeInteractivity();
        document.body.scrollTop = scrollTop;
        if (this.runnableDiv) {
            // hide the rendered runnable - will get reused as is if rerevealed
            this.runnableDiv.style.display = 'none';
        }
    }
}

Parsons.counter = 0;

$(document).on("runestone:login-complete", function () {
    $("[data-component=parsons]").each(function (index) {
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            try {
                window.componentMap[this.id] = new Parsons({
                    orig: this,
                    useRunestoneServices: eBookConfig.useRunestoneServices,
                });
            } catch (err) {
                console.log(`Error rendering Parsons Problem ${this.id}
                             Details: ${err}`);
                console.log(err.stack);
            }
        }
    });
});


/***/ }),

/***/ 23405:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/timedparsons.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedParsons)
/* harmony export */ });
/* harmony import */ var _parsons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsons */ 8354);


class TimedParsons extends _parsons__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        // todo -- make this configurable
        if (opts.timedfeedback) {
            this.showfeedback = true;
        } else {
            this.showfeedback = false;
        }
        this.grader.showfeedback = this.showfeedback;
        this.hideFeedback();
        $(this.checkButton).hide();
        $(this.helpButton).hide();
        $(this.resetButton).hide();
    }
    checkCorrectTimed() {
        return this.correct ? "T" : "F";
    }
    hideFeedback() {
        $(this.messageDiv).hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["parsons"] = function (opts) {
    if (opts.timed) {
        return new TimedParsons(opts);
    }
    return new _parsons__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 25888:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/settledBlock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettledBlock)
/* harmony export */ });
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsonsBlock */ 44065);


class SettledBlock extends _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(problem, lines) {
        // problem: Parsons instance
        // lines: lines inside the block
        super(problem, lines);

        this.isSettled = true;
        //update its indent to follow the indentation of the lines inside

        // add a css class
        $(this.view).addClass("settled-block");
        $(this.view).addClass("disabled");

        let tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add("settled-tooltip");
        $(this.view).append(tooltipSpan);
        $(this.view).find('.settled-tooltip').text('OK');
    }

    setBlocksBefore(num) {
        this.blocksBefore = num;
        var beforePlural = num > 1 ? 's' : '';
        if (this.blocksAfter) {
            var afterPlural = this.blocksAfter > 1 ? 's' : '';
            $(this.view).find('.settled-tooltip').html(`${num} block${beforePlural} ⬆️️), ${this.blocksAfter} block${afterPlural} ⬇️`)
        } else {
            $(this.view).find('.settled-tooltip').html(`${num} block${beforePlural} ⬆️️`)
        }
    }

    setBlocksAfter(num) {
        this.blocksAfter = num;
        var afterPlural = num > 1 ? 's' : '';
        if (this.blocksBefore) {
            var beforePlural = this.blocksBefore > 1 ? 's' : '';
            $(this.view).find('.settled-tooltip').html(`${this.blocksBefore} block${beforePlural} ⬆️, ${num} block${afterPlural} ⬇️`)
        } else {
            $(this.view).find('.settled-tooltip').html(`${num} block${afterPlural} ️️⬇️`)
        }
    }
}

/***/ }),

/***/ 33760:
/*!*********************************************!*\
  !*** ./runestone/parsons/js/parsonsLine.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParsonsLine)
/* harmony export */ });
/* =====================================================================
==== ParsonsLine Object ================================================
======== The model and view of a line of code.
======== Based on what is specified in the problem.
======== ParsonBlock objects have one or more of these.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
======== index: the index of the line in the problem
======== text: the text of the code line
======== indent: the indent level
======== view: an element for viewing this object
======== distractor: whether it is a distractor
======== paired: whether it is a paired distractor
======== groupWithNext: whether it is grouped with the following line
======== width: the pixel width when rendered
============ in the initial grouping
===================================================================== */
// Initialize from codestring

class ParsonsLine {
    constructor(problem, codestring, displaymath) {
        this.problem = problem;
        this.index = problem.lines.length;
        // removes trailing whitespace
        var trimmed = codestring.replace(/\s*$/, "");
        // CodeTailor: Actions are required only if the puzzle well be served as scaffolding puzzle in CodeTailor
        // So here we use problem.options.scaffolding to determine if the puzzle is a scaffolding puzzle
        if (this.problem.options.scaffolding === true) {
            function hasTopLevelClass(lines) {
                return lines.some(({ text }) => text.trimStart().toLowerCase().startsWith("class ")   // now check for “class ” at position 0
                );
            }
            if (this.problem.noindent) {
                this.text = trimmed;
            } else {
                // remove any leading whitespace
                this.text = trimmed.replace(/^\s*/, "");
            }
            
            if (this.problem.options.language == "java") {
                this.text = this.text.replace(/\t/g, "    "); 
                if (this.text.toLowerCase().startsWith("public class")) {
                    this.indent = 0;  // Set indent to 0 for class start
                } else {
                    this.indent = trimmed.length - this.text.length;  // Calculate normal indentation
                }
            } else {
                const allLines = this.problem.lines;
                // put indentation of import line as 0
                if (this.text.toLowerCase().startsWith("import")) {
                    this.indent = 0;  
                }

                // Check if the line is a class definition - if so, then do not set up indentation of def line as 0    
                if (hasTopLevelClass(allLines)) {
                    if (this.text.toLowerCase().startsWith("class")) {
                        this.indent = 0;  // Set indent to 0 for class start
                    } else {
                        this.indent = trimmed.length - this.text.length;  // Calculate normal indentation
                    }
                } else {
                    // Check if the line is a function definition - if so, then set up indentation of def line as 0
                    if (this.text.toLowerCase().startsWith("def")) {
                        this.indent = 0;  // Set indent to 0 for def start
                    } else {
                        this.indent = trimmed.length - this.text.length;  // Calculate normal indentation
                    }
                }
            }
        } else {
            this.text = trimmed.replace(/^\s*/, "");
            this.indent = trimmed.length - this.text.length;
        }
       // Create the View
        var view;
        // TODO: this does not work with display math... Perhaps with pretext we should have html as a language and do nothing?
        
        if (problem.options.language == "natural" || problem.options.language == "math") {
            if (! displaymath) {
                view = document.createElement("p");
            } else {
                view = document.createElement("div");
            }
        } else {
            view = document.createElement("code");
            $(view).addClass(problem.options.prettifyLanguage);
        }
        view.id = problem.counterId + "-line-" + this.index;
        view.innerHTML += this.text;
        this.view = view;
        problem.lines.push(this);
    }
    // Initialize what width the line would naturally have (without indent)
    initializeWidth() {
        // this.width does not appear to be used anywhere later
        // since changing the value of this.width appears to have no effect. - Vincent Qiu (September 2020)
        this.width =
            $(this.view).outerWidth(true) -
            this.problem.options.pixelsPerIndent * this.indent;

        // Pass this information on to be used in class Parsons function initializeAreas
        // to manually determine appropriate widths - Vincent Qiu (September 2020)
        this.view.fontSize = window
            .getComputedStyle(this.view, null)
            .getPropertyValue("font-size");
        this.view.pixelsPerIndent = this.problem.options.pixelsPerIndent;
        this.view.indent = this.indent;

        // Figure out which typeface will be rendered by comparing text widths to browser default - Vincent Qiu (September 2020)
        var tempCanvas = document.createElement("canvas");
        var tempCanvasCtx = tempCanvas.getContext("2d");
        var possibleFonts = window
            .getComputedStyle(this.view, null)
            .getPropertyValue("font-family")
            .split(", ");
        var fillerText = "abcdefghijklmnopqrstuvwxyz0123456789,./!@#$%^&*-+";
        tempCanvasCtx.font = this.view.fontSize + " serif";
        var serifWidth = tempCanvasCtx.measureText(fillerText).width;
        for (let i = 0; i < possibleFonts.length; i++) {
            if (possibleFonts[i].includes('"')) {
                possibleFonts[i] = possibleFonts[i].replaceAll('"', "");
            }
            if (possibleFonts[i].includes("'")) {
                possibleFonts[i] = possibleFonts[i].replaceAll("'", "");
            }
            tempCanvasCtx.font = this.view.fontSize + " " + possibleFonts[i];
            if (tempCanvasCtx.measureText(fillerText).width !== serifWidth) {
                this.view.fontFamily = possibleFonts[i];
                break;
            }
        }
    }
    // Answer the block that this line is currently in
    block() {
        for (let i = 0; i < this.problem.blocks.length; i++) {
            var block = this.problem.blocks[i];
            for (var j = 0; j < block.lines.length; j++) {
                if (block.lines[j] === this) {
                    return block;
                }
            }
        }
        return undefined;
    }
    // Answer the indent based on the view
    viewIndent() {
        if (this.problem.noindent) {
            return this.indent;
        } else {
            var block = this.block();
            return this.indent - block.solutionIndent() + block.indent;
        }
    }
}

/***/ }),

/***/ 39147:
/*!*************************************************!*\
  !*** ./runestone/parsons/js/placeholderLine.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlaceholderLine)
/* harmony export */ });
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsonsLine */ 33760);


class PlaceholderLine extends _parsonsLine__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(problem) {
        super(problem, "placeholder", false);
        this.isPlaceholderLine = true;
    }
}

/***/ }),

/***/ 40771:
/*!********************************************!*\
  !*** ./runestone/parsons/js/lineGrader.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LineBasedGrader)
/* harmony export */ });
class LineBasedGrader {
    constructor(problem) {
        this.problem = problem;
    }
    // Use a LIS (Longest Increasing Subsequence) algorithm to return the indexes
    // that are not part of that subsequence.
    inverseLISIndices(arr) {
        // Get all subsequences
        var allSubsequences = [];
        for (var i = 0; i < arr.length; i++) {
            var subsequenceForCurrent = [arr[i]],
                current = arr[i],
                lastElementAdded = -1;
            for (var j = i; j < arr.length; j++) {
                var subsequent = arr[j];
                if (subsequent > current && lastElementAdded < subsequent) {
                    subsequenceForCurrent.push(subsequent);
                    lastElementAdded = subsequent;
                }
            }
            allSubsequences.push(subsequenceForCurrent);
        }
        // Figure out the longest one
        var longestSubsequenceLength = -1;
        var longestSubsequence;
        for (let i in allSubsequences) {
            var subs = allSubsequences[i];
            if (subs.length > longestSubsequenceLength) {
                longestSubsequenceLength = subs.length;
                longestSubsequence = subs;
            }
        }
        // Create the inverse indexes
        var indexes = [];
        var lIndex = 0;
        for (let i = 0; i < arr.length; i++) {
            if (lIndex > longestSubsequence.length) {
                indexes.push(i);
            } else {
                if (arr[i] == longestSubsequence[lIndex]) {
                    lIndex += 1;
                } else {
                    indexes.push(i);
                }
            }
        }
        return indexes;
    }
    // grade that element, returning the state
    grade() {
        var problem = this.problem;
        problem.clearFeedback();
        this.correctLines = 0;
        this.percentLines = 0;
        this.incorrectIndents = 0;
        var solutionLines = problem.solution;
        var answerLines = problem.answerLines();
        var i;
        var state;
        this.percentLines =
            Math.min(answerLines.length, solutionLines.length) /
            Math.max(answerLines.length, solutionLines.length);
        if (answerLines.length < solutionLines.length) {
            state = "incorrectTooShort";
            this.correctLength = false;
        } else if (answerLines.length == solutionLines.length) {
            this.correctLength = true;
        } else {
            state = "incorrectMoveBlocks";
            this.correctLength = false;
        }

        // Determine whether the code **that is there** is in the correct order
        // If there is too much or too little code this only matters for
        // calculating a percentage score.
        let isCorrectOrder = this.checkCorrectOrdering(solutionLines, answerLines)

        // Determine whether blocks are indented correctly
        let isCorrectIndents = this.checkCorrectIndentation(solutionLines, answerLines);

        if (
            isCorrectIndents &&
            isCorrectOrder &&
            this.correctLength
        ) {
            // Perfect
            state = "correct";
        } else if (this.correctLength && isCorrectOrder) {
            state = "incorrectIndent";
        } else if (!isCorrectOrder && state != "incorrectTooShort") {
            state = "incorrectMoveBlocks";
        }
        this.calculatePercent();
        this.graderState = state;

        return state;
    }

    checkCorrectIndentation(solutionLines, answerLines) {
        if(!this.problem.usesIndentation())
            return true;

        this.indentLeft = [];
        this.indentRight = [];
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            if (answerLines[i].viewIndent() < solutionLines[i].indent) {
                this.indentRight.push(answerLines[i]);
            } else if (answerLines[i].viewIndent() > solutionLines[i].indent) {
                this.indentLeft.push(answerLines[i]);
            }
        }
        this.incorrectIndents =
            this.indentLeft.length + this.indentRight.length;

        return this.incorrectIndents == 0;
    }

    checkCorrectOrdering(solutionLines, answerLines) {
        let isCorrectOrder = true;
        this.correctLines = 0;
        this.solutionLength = solutionLines.length;
        let loopLimit = Math.min(solutionLines.length, answerLines.length);
        for (let i = 0; i < loopLimit; i++) {
            if (answerLines[i].text !== solutionLines[i].text) {
                isCorrectOrder = false;
            } else {
                this.correctLines += 1;
            }
        }
        return isCorrectOrder
    }

    calculatePercent() {
        let numLines = this.percentLines * 0.2;
        let lines = this.problem.answerLines().length;
        let numCorrectBlocks = (this.correctLines / lines) * 0.4;
        let numCorrectIndents =
            ((this.correctLines - this.incorrectIndents) / lines) * 0.4;

        let score = numLines + numCorrectBlocks + numCorrectIndents;
        score = Math.max(score, 0);
        this.problem.percent = score;
    }
}


/***/ }),

/***/ 44065:
/*!**********************************************!*\
  !*** ./runestone/parsons/js/parsonsBlock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParsonsBlock)
/* harmony export */ });
/* harmony import */ var _hammer_min_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hammer.min.js */ 88210);
/* harmony import */ var _hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hammer_min_js__WEBPACK_IMPORTED_MODULE_0__);
/* =====================================================================
==== ParsonsBlock Object ===============================================
======== The model and view of a code block.
==== PROPERTIES ========================================================
======== problem: the Parsons problem
======== lines: an array of ParsonsLine in this block
======== indent: indent based on movement
======== view: an element for viewing this object
======== labels: [label, line] the labels numbering the block and the lines they go on
======== hammer: the controller based on hammer.js
===================================================================== */



// Initialize based on the problem and the lines
class ParsonsBlock {
    constructor(problem, lines) {
        this.problem = problem;
        this.lines = lines;
        this.indent = 0;
        this.labels = [];
        // Create view, adding view of lines and updating indent
        var view = document.createElement("div");
        view.id = problem.counterId + "-block-" + problem.blockIndex;
        problem.blockIndex += 1;
        $(view).addClass("block");
        var sharedIndent = lines[0].indent;
        for (let i = 1; i < lines.length; i++) {
            sharedIndent = Math.min(sharedIndent, lines[i].indent);
        }
        var lineDiv = document.createElement("div");
        $(lineDiv).addClass("lines");
        $(view).append(lineDiv);
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineIndent;
            if (problem.noindent) {
                lineIndent = line.indent;
            } else {
                lineIndent = line.indent - sharedIndent;
            }
            $(line.view).removeClass("indent1 indent2 indent3 indent4 indent5 indent6");
            if (
                this.problem.options.language != "natural" &&
                this.problem.options.language != "math"
            ) {
                if (lineIndent > 0) {
                    $(line.view).addClass("indent" + lineIndent);
                }
            }
            lineDiv.appendChild(line.view);
        }
        var labelDiv = document.createElement("div");
        $(labelDiv).addClass("labels");
        if (this.problem.options.numbered == "left") {
            $(lineDiv).addClass("border_left");
            $(view).prepend(labelDiv);
            $(view).css({
                "justify-content": "flex-start",
            });
        } else if (this.problem.options.numbered == "right") {
            $(labelDiv).addClass("border_left");
            $(labelDiv).css({
                float: "right",
            });
            $(view).css({
                "justify-content": "space-between",
            });
            $(view).append(labelDiv);
        }
        this.view = view;
        // is not placeholder by default
        this.isPlaceholder = false;
    }
    // Add a line (from another block) to this block
    addLine(line) {
        $(line.view).removeClass("indent1 indent2 indent3 indent4 indent5 indent6");
        if (this.problem.noindent) {
            if (line.indent > 0) {
                $(line.view).addClass("indent" + line.indent);
            }
        } else {
            var lines = this.lines;
            var sharedIndent = lines[0].indent;
            for (let i = 1; i < lines.length; i++) {
                sharedIndent = Math.min(sharedIndent, lines[i].indent);
            }
            if (sharedIndent < line.indent) {
                $(line.view).addClass("indent" + (line.indent - sharedIndent));
            } else if (sharedIndent > line.indent) {
                for (let i = 0; i < lines.length; i++) {
                    $(lines[i].view).removeClass(
                        "indent1 indent2 indent3 indent4 indent5 indent6"
                    );
                    // todo: if language is natural or math then don't do this
                    if (
                        this.problem.options.language !== "natural" &&
                        this.problem.options.language !== "math"
                    ) {
                        $(lines[i].view).addClass(
                            "indent" + (lines[i].indent - line.indent)
                        );
                    }
                }
            }
        }
        this.lines.push(line);
        $(this.view).children(".lines")[0].appendChild(line.view);
    }
    // Add the contents of that block to myself and then delete that block
    consumeBlock(block) {
        for (let i = 0; i < block.lines.length; i++) {
            this.addLine(block.lines[i]);
        }
        if ($(block.view).attr("tabindex") == "0") {
            this.makeTabIndex();
        }
        $(block.view).detach();
        var newBlocks = [];
        for (let i = 0; i < this.problem.blocks.length; i++) {
            if (this.problem.blocks[i] !== block) {
                newBlocks.push(this.problem.blocks[i]);
            }
        }
        for (let i = 0; i < block.labels.length; i++) {
            this.addLabel(
                block.labels[i][0],
                this.lines.length - block.lines.length + block.labels[i][1]
            );
        }
        this.problem.blocks = newBlocks;
        this.problem.state = undefined;
        this.problem.updateView();
    }
    // Update the model and view when block is converted to contain indent
    addIndent() {
        // Update the lines model / view
        for (let i = 0; i < this.lines.length; i++) {
            var line = this.lines[i];
            if (line.indent > 0) {
                $(line.view).removeClass("indent1 indent2 indent3 indent4 indent5 indent6");
                $(line.view).addClass("indent" + line.indent);
            }
        }
        // Update the block model / view
        this.indent = 0;
        $(this.view).css({
            "padding-left": "",
            width: this.problem.areaWidth - 22,
        });
    }
    // Add a label to block and update its view
    addLabel(label, line) {
        var div = document.createElement("div");
        $(div).addClass("block-label");
        if (this.problem.options.numbered == "right") {
            $(div).addClass("right-label");
        }
        if (this.problem.options.numbered == "left") {
            $(div).addClass("left-label");
        }
        $(div).append(document.createTextNode(label));
        $(this.view).children(".labels")[0].append(div);
        if (this.labels.length != 0) {
            $(div).css(
                "margin-top",
                (line - this.labels[this.labels.length - 1][1] - 1) *
                    this.lines[line].view.offsetHeight
            );
        }
        this.labels.push([label, line]);
    }
    // Initialize Interactivity
    initializeInteractivity() {
        if ($(this.view).hasClass("disabled")) {
            return this;
        }
        $(this.view).attr("tabindex", "-1");
        this.hammer = new (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().Manager)(this.view, {
            recognizers: [
                [
                    (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().Pan),
                    {
                        direction: (_hammer_min_js__WEBPACK_IMPORTED_MODULE_0___default().DIRECTION_ALL),
                        threshold: 0,
                        pointers: 1,
                    },
                ],
            ],
        });
        var that = this;
        this.hammer.on("panstart", function (event) {
            that.panStart(event);
        });
        this.hammer.on("panend", function (event) {
            that.panEnd(event);
        });
        this.hammer.on("panmove", function (event) {
            that.panMove(event);
        });
    }
    // Return a boolean as to whether this block is able to be selected
    enabled() {
        return $(this.view).attr("tabindex") !== undefined;
    }
    // Return a boolean as to whether this block is a distractor
    isDistractor() {
        return this.lines[0].distractor;
    }
    // Return a boolean as to whether this block is in the source area
    inSourceArea() {
        var children = this.problem.sourceArea.childNodes;
        for (let i = 0; i < children.length; i++) {
            var item = children[i];
            if (item.id == this.view.id) {
                return true;
            }
        }
        return false;
    }
    // Return the page X position of the center of the view
    pageXCenter() {
        var boundingRect = this.view.getBoundingClientRect();
        var pageXCenter =
            window.pageXOffset + boundingRect.left + boundingRect.width / 2;
        return pageXCenter;
    }
    // Return the page Y position of the center of the view
    pageYCenter() {
        var boundingRect = this.view.getBoundingClientRect();
        var pageYCenter =
            window.pageYOffset + boundingRect.top + boundingRect.height / 2;
        return pageYCenter;
    }
    // Of all the line indents, return the minimum value
    minimumLineIndent() {
        var minimumLineIndent = this.lines[0].indent;
        for (let i = 1; i < this.lines.length; i++) {
            minimumLineIndent = Math.min(
                this.lines[i].indent,
                minimumLineIndent
            );
        }
        return minimumLineIndent;
    }
    // Return the last block in the source area that matches the paired bin it is in
    slideUnderBlock() {
        var sourceBlocks = this.problem.sourceBlocks();
        if (sourceBlocks.length == 0) {
            return undefined;
        }
        var pairedBin = this.pairedBin();
        if (pairedBin == -1) {
            return sourceBlocks[sourceBlocks.length - 1];
        }
        for (let i = sourceBlocks.length - 1; i >= 0; i--) {
            var block = sourceBlocks[i];
            if (block.pairedBin() == pairedBin) {
                return block;
            }
        }
        return sourceBlocks[sourceBlocks.length - 1];
    }
    // Return which paired bin it is in (-1) if not
    pairedBin() {
        var pairedBins = this.problem.pairedBins;
        for (var i = 0; i < pairedBins.length; i++) {
            if (this.matchesBin(pairedBins[i])) {
                return i;
            }
        }
        return -1;
    }
    // Return true if all lines are in that bin
    matchesBin(bin) {
        for (var i = 0; i < this.lines.length; i++) {
            var test = this.lines[i].index;
            if (bin.indexOf(test) == -1) {
                return false;
            }
        }
        return true;
    }
    // Return a list of indexes where this block could be inserted before
    validSourceIndexes() {
        var blocks = this.problem.sourceBlocks();
        var indexes = [];
        var pairedBin = this.pairedBin();
        var i, lastBin;
        if (pairedBin >= 0) {
            for (i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                if (block.view.id !== this.view.id) {
                    var blockBin = block.pairedBin();
                    if (blockBin == pairedBin) {
                        indexes.push(i);
                    } else if (lastBin == pairedBin) {
                        indexes.push(i);
                    }
                    lastBin = blockBin;
                }
            }
            if (lastBin == pairedBin) {
                indexes.push(blocks.length);
            }
            if (indexes.length > 0) {
                return indexes;
            }
        }
        for (i = 0; i < blocks.length; i++) {
            let block = blocks[i];
            if (block.view.id !== this.view.id) {
                let blockBin = block.pairedBin();
                if (blockBin !== lastBin) {
                    indexes.push(i);
                } else if (blockBin == -1) {
                    indexes.push(i);
                }
                lastBin = blockBin;
            }
        }
        indexes.push(blocks.length);
        return indexes;
    }
    // A measure of how far the middle of this block is vertically positioned
    verticalOffset() {
        var verticalOffset;
        if (this.inSourceArea()) {
            verticalOffset =
                this.problem.sourceArea.getBoundingClientRect().top;
        } else {
            verticalOffset =
                this.problem.answerArea.getBoundingClientRect().top;
        }
        verticalOffset =
            this.view.getBoundingClientRect().top +
            this.view.getBoundingClientRect().bottom -
            verticalOffset * 2;
        return verticalOffset;
    }
    // This block just gained textual focus
    newFocus() {
        if (this.problem.textFocus == undefined) {
            this.problem.enterKeyboardMode();
            this.problem.textFocus = this;
            this.problem.textMove = false;
            $(this.view).addClass("down");
        } else if (this.problem.textFocus == this) {
            if (this.problem.textMove) {
                $(this.view).addClass("up");
            } else {
                $(this.view).addClass("down");
            }
        } else {
            // already in keyboard mode
            this.problem.textFocus = this;
            this.problem.textMove = false;
            $(this.view).addClass("down");
        }
        this.problem.textMoving = false;
    }
    // This block just lost textual focus
    releaseFocus() {
        $(this.view).removeClass("down up");
        if (this.problem.textFocus == this) {
            if (!this.problem.textMoving) {
                // exit out of problem but stay way into problem
                this.problem.textFocus = undefined;
                if (this.problem.textMove) {
                    this.problem.logMove("kmove");
                    this.problem.textMove = false;
                    // CodeTailor: update placeholders
                    this.problem.updatePlaceholders();
                }
                this.problem.exitKeyboardMode();
            }
        } else {
            // become selectable, but not active
            $(this.view).attr("tabindex", "-1");
            $(this.view).unbind("focus");
            $(this.view).unbind("blur");
            $(this.view).unbind("keydown");
        }
    }
    // Make this block into the keyboard entry point
    makeTabIndex() {
        $(this.view).attr("tabindex", "0");
        var that = this;
        $(this.view).focus(function () {
            that.newFocus();
        });
        $(this.view).blur(function () {
            that.releaseFocus();
        });
        $(this.view).keydown(function (event) {
            that.keyDown(event);
        });
    }
    // Called to disable interaction for the future
    disable() {
        if (this.hammer !== undefined) {
            this.hammer.set({ enable: false });
        }
        if ($(this.view).attr("tabindex") == "0") {
            this.releaseFocus();
            $(this.view).removeAttr("tabindex");
            this.problem.initializeTabIndex();
        } else {
            $(this.view).removeAttr("tabindex");
        }
    }
    // Enable functionality after reset button has been pressed
    resetView() {
        if (this.hammer !== undefined) {
            this.hammer.set({ enable: true });
        }
        if (!$(this.view)[0].hasAttribute("tabindex")) {
            $(this.view).attr("tabindex", "-1");
        }
        $(this.view).css({ opacity: "" });
    }
    // Called to destroy interaction for the future
    destroy() {
        if (this.hammer !== undefined) {
            this.hammer.destroy();
            delete this.hammer;
        }
        if ($(this.view).attr("tabindex") == "0") {
            this.releaseFocus();
        }
        $(this.view).removeAttr("tabindex");
    }
    // Called when a block is picked up
    panStart(event) {
        this.problem.clearFeedback();
        if (this.problem.started == undefined) {
            // log the first time that something gets moved
            this.problem.started = true;
            this.problem.logMove("start");
        }
        if (this.problem.textFocus !== undefined) {
            // stop text focus when dragging
            this.problem.textFocus.releaseFocus();
        }
        this.problem.moving = this;
        // Update the view
        this.problem.movingX = event.srcEvent.pageX;
        this.problem.movingY = event.srcEvent.pageY;
        this.problem.updateView();
    }
    // Called when a block is dropped
    panEnd(event) {
        this.problem.isAnswered = true;
        delete this.problem.moving;
        delete this.problem.movingX;
        delete this.problem.movingY;
        this.problem.updateView();
        this.problem.logMove("move");
        this.problem.updatePlaceholders();
    }
    // Called when a block is moved
    panMove(event) {
        // Update the view
        this.problem.movingX = event.srcEvent.pageX;
        this.problem.movingY = event.srcEvent.pageY;
        this.problem.updateView();
    }
    // Handle a keypress event when in focus
    keyDown(event) {
        if (this.problem.started == undefined) {
            // log the first time that something gets moved
            this.problem.started = true;
            this.problem.logMove("kstart");
        }
        switch (event.keyCode) {
            case 37: // left
                if (this.problem.textMove) {
                    this.moveLeft();
                } else {
                    this.selectLeft();
                }
                break;
            case 38: // up
                if (this.problem.textMove) {
                    this.moveUp();
                } else {
                    this.selectUp();
                }
                event.preventDefault();
                break;
            case 39: // right
                if (this.problem.textMove) {
                    this.moveRight();
                } else {
                    this.selectRight();
                }
                event.preventDefault();
                break;
            case 40: // down
                if (this.problem.textMove) {
                    this.moveDown();
                } else {
                    this.selectDown();
                }
                event.preventDefault();
                break;
            case 32: // space
                this.toggleMove();
                event.preventDefault();
                break;
            case 13: // enter
                this.toggleMove();
                event.preventDefault();
                break;
        }
    }
    // Move block left
    moveLeft() {
        var index, block;
        if (!this.inSourceArea()) {
            if (this.indent == 0) {
                // move to source area
                var blocks = this.problem.sourceBlocks();
                var offset = this.verticalOffset();
                var validSourceIndexes = this.validSourceIndexes();
                for (var i = 0; i < validSourceIndexes.length; i++) {
                    index = validSourceIndexes[i];
                    if (index == blocks.length) {
                        this.problem.textMoving = true;
                        this.problem.sourceArea.appendChild(this.view);
                        $(this.view).focus();
                        this.problem.state = undefined;
                        this.problem.updateView();
                        return this;
                    } else {
                        block = blocks[index];
                        if (block.verticalOffset() >= offset) {
                            break;
                        }
                    }
                }
                this.problem.textMoving = true;
                this.problem.sourceArea.insertBefore(this.view, block.view);
                $(this.view).focus();
            } else {
                // reduce indent
                this.indent = this.indent - 1;
            }
            this.problem.state = undefined;
            this.problem.updateView();
        }
    }
    // Move block up
    moveUp() {
        if (this.inSourceArea()) {
            let blocks = this.problem.sourceBlocks();
            var offset = this.verticalOffset();
            var validSourceIndexes = this.validSourceIndexes();
            for (let i = 0; i < validSourceIndexes.length; i++) {
                var index =
                    validSourceIndexes[validSourceIndexes.length - 1 - i];
                if (index < blocks.length) {
                    var block = blocks[index];
                    if (block.verticalOffset() < offset) {
                        this.problem.textMoving = true;
                        this.problem.sourceArea.insertBefore(
                            this.view,
                            block.view
                        );
                        $(this.view).focus();
                        this.problem.state = undefined;
                        this.problem.updateView();
                        return this;
                    }
                }
            }
        } else {
            let blocks = this.problem.answerBlocks();
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    if (i == 0) {
                        return this;
                    }
                    this.problem.textMoving = true;
                    this.problem.answerArea.insertBefore(
                        this.view,
                        blocks[i - 1].view
                    );
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                }
            }
        }
    }
    // Move block right
    moveRight() {
        if (this.inSourceArea()) {
            // move to answer area
            this.indent = 0;
            var offset = this.verticalOffset();
            var answerBlocks = this.problem.answerBlocks();
            for (var i = 0; i < answerBlocks.length; i++) {
                var item = answerBlocks[i];
                var itemOffset = item.verticalOffset();
                if (itemOffset >= offset) {
                    this.problem.textMoving = true;
                    this.problem.answerArea.insertBefore(this.view, item.view);
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                }
            }
            this.problem.textMoving = true;
            this.problem.answerArea.appendChild(this.view);
            $(this.view).focus();
            this.problem.state = undefined;
            this.problem.updateView();
        } else {
            // in answer area: increase the indent
            if (this.indent !== this.problem.indent) {
                this.indent = this.indent + 1;
                this.problem.state = undefined;
                this.problem.updateView();
            }
        }
    }
    // Move block down
    moveDown() {
        if (this.inSourceArea()) {
            let blocks = this.problem.sourceBlocks();
            var validSourceIndexes = this.validSourceIndexes();
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    var myIndex = i;
                }
            }
            for (let i = 0; i < validSourceIndexes.length; i++) {
                var index = validSourceIndexes[i];
                if (index == blocks.length) {
                    this.problem.textMoving = true;
                    this.problem.sourceArea.appendChild(this.view);
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                } else if (index - myIndex > 1) {
                    this.problem.textMoving = true;
                    this.problem.sourceArea.insertBefore(
                        this.view,
                        blocks[index].view
                    );
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                    return this;
                }
            }
        } else {
            let blocks = this.problem.answerBlocks();
            for (var i = 0; i < blocks.length; i++) {
                if (blocks[i].view.id == this.view.id) {
                    if (i == blocks.length - 1) {
                        return this;
                    } else if (i == blocks.length - 2) {
                        this.problem.textMoving = true;
                        this.problem.answerArea.appendChild(this.view);
                    } else {
                        this.problem.textMoving = true;
                        this.problem.answerArea.insertBefore(
                            this.view,
                            blocks[i + 2].view
                        );
                    }
                    $(this.view).focus();
                    this.problem.state = undefined;
                    this.problem.updateView();
                }
            }
        }
    }
    // Move selection left
    selectLeft() {
        if (!this.inSourceArea()) {
            var offset = this.verticalOffset();
            var sourceBlocks = this.problem.enabledSourceBlocks();
            if (sourceBlocks.length == 0) {
                return this;
            }
            var chooseNext = sourceBlocks[0];
            var chooseOffset = chooseNext.verticalOffset() - offset;
            for (var i = 1; i < sourceBlocks.length; i++) {
                var item = sourceBlocks[i];
                var itemOffset = item.verticalOffset() - offset;
                if (Math.abs(itemOffset) < Math.abs(chooseOffset)) {
                    chooseNext = item;
                    chooseOffset = itemOffset;
                }
            }
            this.problem.textFocus = chooseNext;
            chooseNext.makeTabIndex();
            $(chooseNext.view).focus();
        }
    }
    // Move selection up
    selectUp() {
        var chooseNext = false;
        var blocks;
        if (this.inSourceArea()) {
            blocks = this.problem.enabledSourceBlocks();
        } else {
            blocks = this.problem.enabledAnswerBlocks();
        }
        for (var i = blocks.length - 1; i >= 0; i--) {
            var item = blocks[i];
            if (chooseNext) {
                this.problem.textFocus = item;
                item.makeTabIndex();
                $(item.view).focus();
                return this;
            } else {
                if (item.view.id == this.view.id) {
                    chooseNext = true;
                }
            }
        }
    }
    // Move selection right
    selectRight() {
        if (this.inSourceArea()) {
            var offset = this.verticalOffset();
            var blocks = this.problem.enabledAnswerBlocks();
            if (blocks.length == 0) {
                return this;
            }
            var chooseNext = blocks[0];
            var chooseOffset = chooseNext.verticalOffset() - offset;
            for (var i = 1; i < blocks.length; i++) {
                var item = blocks[i];
                var itemOffset = item.verticalOffset() - offset;
                if (Math.abs(itemOffset) < Math.abs(chooseOffset)) {
                    chooseNext = item;
                    chooseOffset = itemOffset;
                }
            }
            this.problem.textFocus = chooseNext;
            chooseNext.makeTabIndex();
            $(chooseNext.view).focus();
        }
    }
    // Move selection down
    selectDown() {
        var chooseNext = false;
        var blocks;
        if (this.inSourceArea()) {
            blocks = this.problem.enabledSourceBlocks();
        } else {
            blocks = this.problem.enabledAnswerBlocks();
        }
        for (var i = 0; i < blocks.length; i++) {
            var item = blocks[i];
            if (chooseNext) {
                this.problem.textFocus = item;
                item.makeTabIndex();
                $(item.view).focus();
                return this;
            } else {
                if (item.view.id == this.view.id) {
                    chooseNext = true;
                }
            }
        }
    }
    // Toggle whether to move this block
    toggleMove() {
        if (this.problem.textMove) {
            $(this.view).removeClass("up");
            $(this.view).addClass("down");
            this.problem.textMove = false;
            this.problem.logMove("kmove");
            if (!this.isPlaceholder) {

                this.problem.updatePlaceholders();

            }
        } else {
            $(this.view).removeClass("down");
            $(this.view).addClass("up");
            this.problem.textMove = true;
        }
    }
    // Answer a string that represents this codeblock for saving
    hash() {
        var hash = "";
        for (var i = 0; i < this.lines.length; i++) {
            hash += this.lines[i].index + "_";
        }
        hash += this.indent;
        return hash;
    }
    // Answer what the indent should be for the solution
    solutionIndent() {
        var sharedIndent = this.lines[0].indent;
        for (var i = 1; i < this.lines.length; i++) {
            sharedIndent = Math.min(sharedIndent, this.lines[i].indent);
        }
        return sharedIndent;
    }
}

/***/ }),

/***/ 49647:
/*!*******************************************!*\
  !*** ./runestone/parsons/js/dagGrader.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DAGGrader)
/* harmony export */ });
/* harmony import */ var _lineGrader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lineGrader */ 40771);
/* harmony import */ var _dagHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dagHelpers */ 79863);



function graphToNX(answerLines) {
  var graph = new _dagHelpers__WEBPACK_IMPORTED_MODULE_1__.DiGraph();
  for (let line1 of answerLines) {
    graph.addNode(line1.tag);
    for (let line2tag of line1.depends) {
      // the depends graph lists the *incoming* edges of a node
      graph.addEdge(line2tag, line1.tag);
    }
  }
  return graph;
}

function isVertexCover(graph, vertexCover) {
  for (let edge of graph.edges()) {
    if (!(vertexCover.has(edge[0]) || vertexCover.has(edge[1]))) {
      return false;
    }
  }
  return true;
}

// Find all subsets of the set using the correspondence of subsets of
// a set to binary string whose length are the size of the set
function allSubsets(arr) {
  let subsets = {};
  for (let i = 0; i <= arr.length; i++) {
    subsets[i] = [];
  }
  for (let i = 0; i < Math.pow(2, arr.length); i++) {
    let bin = i.toString(2);
    while (bin.length < arr.length) {
      bin = "0" + bin;
    }
    let subset = new Set();
    for (let j = 0; j < bin.length; j++) {
      if (bin[j] == "1") {
        subset.add(arr[j]);
      }
    }
    subsets[subset.size].push(subset);
  }
  return subsets;
}

class DAGGrader extends _lineGrader__WEBPACK_IMPORTED_MODULE_0__["default"] {
  inverseLISIndices(arr, inSolution) {
    // For more details and a proof of the correctness of the algorithm, see the paper: https://arxiv.org/abs/2204.04196

    var solution = this.problem.solution;
    var answerLines = inSolution.map((block) => block.lines[0]); // assume NOT adaptive for DAG grading (for now)

    let graph = graphToNX(solution);

    let seen = new Set();
    let problematicSubgraph = new _dagHelpers__WEBPACK_IMPORTED_MODULE_1__.DiGraph();
    for (let line1 of answerLines) {
      for (let line2 of seen) {
        let problematic = (0,_dagHelpers__WEBPACK_IMPORTED_MODULE_1__.hasPath)(graph, {
          source: line1.tag,
          target: line2.tag,
        });
        if (problematic) {
          problematicSubgraph.addEdge(line1.tag, line2.tag);
        }
      }

      seen.add(line1);
    }

    let mvc = null;
    let subsets = allSubsets(problematicSubgraph.nodes());
    for (let i = 0; i <= problematicSubgraph.numberOfNodes(); i++) {
      for (let subset of subsets[i]) {
        if (isVertexCover(problematicSubgraph, subset)) {
          mvc = subset;
          break;
        }
      }
      if (mvc != null) {
        break;
      }
    }

    let indices = [...mvc].map((tag) => {
      for (let i = 0; i < answerLines.length; i++) {
        if (answerLines[i].tag === tag) return i;
      }
    });
    return indices;
  }

  checkCorrectIndentation() {
      if(!this.problem.usesIndentation())
          return true;

      this.indentLeft = [];
      this.indentRight = [];
      // For dag problems, only check the indentation of each block in the problem
      for (const block of this.problem.blocks) {
          // Skip distractor blocks
          if (block.isDistractor())
              continue;

          const curIndent = block.indent;
          const expectedIndent = block.solutionIndent();
          // If missmatch, add first line of block to the correct indent list for
          // UI updating
          if (curIndent < expectedIndent)
              this.indentRight.push(block.lines[0]);
          else if (curIndent > expectedIndent)
              this.indentLeft.push(block.lines[0]);
      }
      
      this.incorrectIndents =
          this.indentLeft.length + this.indentRight.length;

      return this.incorrectIndents == 0;
  }

  checkCorrectOrdering(solutionLines, answerLines) {
    if (!(0,_dagHelpers__WEBPACK_IMPORTED_MODULE_1__.isDirectedAcyclicGraph)(graphToNX(solutionLines))) {
      throw "Dependency between blocks does not form a Directed Acyclic Graph; Problem unsolvable.";
    }

    let seen = new Set();
    let isCorrectOrder = true;
    this.correctLines = 0;
    this.solutionLength = solutionLines.length;
    let loopLimit = Math.min(solutionLines.length, answerLines.length);
    for (let i = 0; i < loopLimit; i++) {
      let line = answerLines[i];
      if (line.distractor) {
        isCorrectOrder = false;
      } else {
        for (let j = 0; j < line.depends.length; j++) {
          if (!seen.has(line.depends[j])) {
            isCorrectOrder = false;
          }
        }
      }
      if (isCorrectOrder) {
        this.correctLines += 1;
      }
      seen.add(line.tag);
    }
    return isCorrectOrder;
  }
}


/***/ }),

/***/ 56906:
/*!****************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.pt-br.js ***!
  \****************************************************/
/***/ (() => {

$.i18n().load({
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

/***/ 67216:
/*!**************************************************!*\
  !*** ./runestone/parsons/js/placeholderBlock.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PlaceholderBlock)
/* harmony export */ });
/* harmony import */ var _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parsonsBlock */ 44065);
/* harmony import */ var _parsonsLine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parsonsLine */ 33760);



class PlaceholderBlock extends _parsonsBlock__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(problem, placeholderLines, placeholderSize, afterSettledBlockCount) {
        // problem: Parsons instance
        // size: how many blocks it is holding

        // have to have at least one parsonslines, otherwise will be error in ParsonsBlock.
        super(problem, placeholderLines);
        this.placeholderLines = placeholderLines;
        this.afterSettledBlockCount = afterSettledBlockCount;

        // create a normal parsons block, but use css to control visibility of normal content
        $(this.view).addClass("placeholder-block");
        $(this.view).addClass("disabled");
        
        // create a new div displaying how many blocks are missing
        this.placeholderSize = placeholderSize;
        var content = document.createElement('div');
        $(content).addClass("placeholder-text");
        if (placeholderSize > 1) {
            content.innerText = `${placeholderSize} blocks are missing here`;
        } else {
            content.innerText = `${placeholderSize} block is missing here`;
        }
        $(this.view).append(content);

        this.isPlaceholder = true;
    }
}

/***/ }),

/***/ 75794:
/*!*************************************************!*\
  !*** ./runestone/parsons/js/parsons-i18n.en.js ***!
  \*************************************************/
/***/ (() => {

$.i18n().load({
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


/***/ }),

/***/ 78811:
/*!******************************************!*\
  !*** ./runestone/parsons/js/prettify.js ***!
  \******************************************/
/***/ (() => {

// TODO - How much of this is needed? Lots of overlap with what syntax highlighting
// via pretext theme does...

function H() {
    var x =
        navigator &&
        navigator.userAgent &&
        /\bMSIE 6\./.test(navigator.userAgent);
    H = function() {
        return x;
    };
    return x;
}
(function() {
    function x(b) {
        b = b.split(/ /g);
        var a = {};
        for (var c = b.length; --c >= 0; ) {
            var d = b[c];
            if (d) a[d] = null;
        }
        return a;
    }
    var y = "break continue do else for if return while ",
        U =
            y +
            "auto case char const default double enum extern float goto int long register short signed sizeof static struct switch typedef union unsigned void volatile ",
        D =
            U +
            "catch class delete false import new operator private protected public this throw true try ",
        I =
            D +
            "alignof align_union asm axiom bool concept concept_map const_cast constexpr decltype dynamic_cast explicit export friend inline late_check mutable namespace nullptr reinterpret_cast static_assert static_cast template typeid typename typeof using virtual wchar_t where ",
        J =
            D +
            "boolean byte extends final finally implements import instanceof null native package strictfp super synchronized throws transient ",
        V =
            J +
            "as base by checked decimal delegate descending event fixed foreach from group implicit in interface internal into is lock object out override orderby params readonly ref sbyte sealed stackalloc string select uint ulong unchecked unsafe ushort var ",
        K =
            D +
            "debugger eval export function get null set undefined var with Infinity NaN ",
        L =
            "caller delete die do dump elsif eval exit foreach for goto if import last local my next no our print package redo require sub undef unless until use wantarray while BEGIN END ",
        M =
            y +
            "and as assert class def del elif except exec finally from global import in is lambda nonlocal not or pass print raise try with yield False True None ",
        N =
            y +
            "alias and begin case class def defined elsif end ensure false in module next nil not or redo rescue retry self super then true undef unless until when yield BEGIN END ",
        O = y + "case done elif esac eval fi function in local set then until ",
        W = I + V + K + L + M + N + O;
    function X(b) {
        return (b >= "a" && b <= "z") || (b >= "A" && b <= "Z");
    }
    function u(b, a, c, d) {
        b.unshift(c, d || 0);
        try {
            a.splice.apply(a, b);
        } finally {
            b.splice(0, 2);
        }
    }
    var Y = (function() {
            var b = [
                    "!",
                    "!=",
                    "!==",
                    "#",
                    "%",
                    "%=",
                    "&",
                    "&&",
                    "&&=",
                    "&=",
                    "(",
                    "*",
                    "*=",
                    "+=",
                    ",",
                    "-=",
                    "->",
                    "/",
                    "/=",
                    ":",
                    "::",
                    ";",
                    "<",
                    "<<",
                    "<<=",
                    "<=",
                    "=",
                    "==",
                    "===",
                    ">",
                    ">=",
                    ">>",
                    ">>=",
                    ">>>",
                    ">>>=",
                    "?",
                    "@",
                    "[",
                    "^",
                    "^=",
                    "^^",
                    "^^=",
                    "{",
                    "|",
                    "|=",
                    "||",
                    "||=",
                    "~",
                    "break",
                    "case",
                    "continue",
                    "delete",
                    "do",
                    "else",
                    "finally",
                    "instanceof",
                    "return",
                    "throw",
                    "try",
                    "typeof"
                ],
                a =
                    "(?:(?:(?:^|[^0-9.])\\.{1,3})|(?:(?:^|[^\\+])\\+)|(?:(?:^|[^\\-])-)";
            for (var c = 0; c < b.length; ++c) {
                var d = b[c];
                a += X(d.charAt(0))
                    ? "|\\b" + d
                    : "|" + d.replace(/([^=<>:&])/g, "\\$1");
            }
            a += "|^)\\s*$";
            return new RegExp(a);
        })(),
        P = /&/g,
        Q = /</g,
        R = />/g,
        Z = /\"/g;
    function $(b) {
        return b
            .replace(P, "&amp;")
            .replace(Q, "&lt;")
            .replace(R, "&gt;")
            .replace(Z, "&quot;");
    }
    function E(b) {
        return b
            .replace(P, "&amp;")
            .replace(Q, "&lt;")
            .replace(R, "&gt;");
    }
    var aa = /&lt;/g,
        ba = /&gt;/g,
        ca = /&apos;/g,
        da = /&quot;/g,
        ea = /&amp;/g,
        fa = /&nbsp;/g;
    function ga(b) {
        var a = b.indexOf("&");
        if (a < 0) return b;
        for (--a; (a = b.indexOf("&#", a + 1)) >= 0; ) {
            var c = b.indexOf(";", a);
            if (c >= 0) {
                var d = b.substring(a + 3, c),
                    g = 10;
                if (d && d.charAt(0) === "x") {
                    d = d.substring(1);
                    g = 16;
                }
                var e = parseInt(d, g);
                if (!isNaN(e))
                    b =
                        b.substring(0, a) +
                        String.fromCharCode(e) +
                        b.substring(c + 1);
            }
        }
        return b
            .replace(aa, "<")
            .replace(ba, ">")
            .replace(ca, "'")
            .replace(da, '"')
            .replace(ea, "&")
            .replace(fa, " ");
    }
    function S(b) {
        return "XMP" === b.tagName;
    }
    function z(b, a) {
        switch (b.nodeType) {
            case 1:
                var c = b.tagName.toLowerCase();
                a.push("<", c);
                for (var d = 0; d < b.attributes.length; ++d) {
                    var g = b.attributes[d];
                    if (!g.specified) continue;
                    a.push(" ");
                    z(g, a);
                }
                a.push(">");
                for (var e = b.firstChild; e; e = e.nextSibling) z(e, a);
                if (b.firstChild || !/^(?:br|link|img)$/.test(c))
                    a.push("</", c, ">");
                break;
            case 2:
                a.push(b.name.toLowerCase(), '="', $(b.value), '"');
                break;
            case 3:
            case 4:
                a.push(E(b.nodeValue));
                break;
        }
    }
    var F = null;
    function ha(b) {
        if (null === F) {
            var a = document.createElement("PRE");
            a.appendChild(
                document.createTextNode(
                    '<!DOCTYPE foo PUBLIC "foo bar">\n<foo />'
                )
            );
            F = !/</.test(a.innerHTML);
        }
        if (F) {
            var c = b.innerHTML;
            if (S(b)) c = E(c);
            return c;
        }
        var d = [];
        for (var g = b.firstChild; g; g = g.nextSibling) z(g, d);
        return d.join("");
    }
    function ia(b) {
        var a = 0;
        return function(c) {
            var d = null,
                g = 0;
            for (var e = 0, h = c.length; e < h; ++e) {
                var f = c.charAt(e);
                switch (f) {
                    case "\t":
                        if (!d) d = [];
                        d.push(c.substring(g, e));
                        var i = b - (a % b);
                        a += i;
                        for (; i >= 0; i -= "                ".length)
                            d.push("                ".substring(0, i));
                        g = e + 1;
                        break;
                    case "\n":
                        a = 0;
                        break;
                    default:
                        ++a;
                }
            }
            if (!d) return c;
            d.push(c.substring(g));
            return d.join("");
        };
    }
    var ja = /(?:[^<]+|<!--[\s\S]*?--\>|<!\[CDATA\[([\s\S]*?)\]\]>|<\/?[a-zA-Z][^>]*>|<)/g,
        ka = /^<!--/,
        la = /^<\[CDATA\[/,
        ma = /^<br\b/i;
    function na(b) {
        var a = b.match(ja),
            c = [],
            d = 0,
            g = [];
        if (a)
            for (var e = 0, h = a.length; e < h; ++e) {
                var f = a[e];
                if (f.length > 1 && f.charAt(0) === "<") {
                    if (ka.test(f)) continue;
                    if (la.test(f)) {
                        c.push(f.substring(9, f.length - 3));
                        d += f.length - 12;
                    } else if (ma.test(f)) {
                        c.push("\n");
                        ++d;
                    } else g.push(d, f);
                } else {
                    var i = ga(f);
                    c.push(i);
                    d += i.length;
                }
            }
        return {
            source: c.join(""),
            tags: g
        };
    }
    function v(b, a) {
        var c = {};
        (function() {
            var g = b.concat(a);
            for (var e = g.length; --e >= 0; ) {
                var h = g[e],
                    f = h[3];
                if (f) for (var i = f.length; --i >= 0; ) c[f.charAt(i)] = h;
            }
        })();
        var d = a.length;
        return function(g, e) {
            e = e || 0;
            var h = [e, "pln"],
                f = "",
                i = 0,
                j = g;
            while (j.length) {
                var o,
                    m = null,
                    k,
                    l = c[j.charAt(0)];
                if (l) {
                    k = j.match(l[1]);
                    m = k[0];
                    o = l[0];
                } else {
                    for (var n = 0; n < d; ++n) {
                        l = a[n];
                        var p = l[2];
                        if (p && !p.test(f)) continue;
                        k = j.match(l[1]);
                        if (k) {
                            m = k[0];
                            o = l[0];
                            break;
                        }
                    }
                    if (!m) {
                        o = "pln";
                        m = j.substring(0, 1);
                    }
                }
                h.push(e + i, o);
                i += m.length;
                j = j.substring(m.length);
                if (o !== "com" && /\S/.test(m)) f = m;
            }
            return h;
        };
    }
    var oa = v(
        [],
        [
            ["pln", /^[^<]+/, null],
            ["dec", /^<!\w[^>]*(?:>|$)/, null],
            ["com", /^<!--[\s\S]*?(?:--\>|$)/, null],
            ["src", /^<\?[\s\S]*?(?:\?>|$)/, null],
            ["src", /^<%[\s\S]*?(?:%>|$)/, null],
            ["src", /^<(script|style|xmp)\b[^>]*>[\s\S]*?<\/\1\b[^>]*>/i, null],
            ["tag", /^<\/?\w[^<>]*>/, null]
        ]
    );
    function pa(b) {
        var a = oa(b);
        for (var c = 0; c < a.length; c += 2)
            if (a[c + 1] === "src") {
                var d, g;
                d = a[c];
                g = c + 2 < a.length ? a[c + 2] : b.length;
                var e = b.substring(d, g),
                    h = e.match(/^(<[^>]*>)([\s\S]*)(<\/[^>]*>)$/);
                if (h)
                    a.splice(
                        c,
                        2,
                        d,
                        "tag",
                        d + h[1].length,
                        "src",
                        d + h[1].length + (h[2] || "").length,
                        "tag"
                    );
            }
        return a;
    }
    var qa = v(
        [
            ["atv", /^\'[^\']*(?:\'|$)/, null, "'"],
            ["atv", /^\"[^\"]*(?:\"|$)/, null, '"'],
            ["pun", /^[<>\/=]+/, null, "<>/="]
        ],
        [
            ["tag", /^[\w:\-]+/, /^</],
            ["atv", /^[\w\-]+/, /^=/],
            ["atn", /^[\w:\-]+/, null],
            ["pln", /^\s+/, null, " \t\r\n"]
        ]
    );
    function ra(b, a) {
        for (var c = 0; c < a.length; c += 2) {
            var d = a[c + 1];
            if (d === "tag") {
                var g, e;
                g = a[c];
                e = c + 2 < a.length ? a[c + 2] : b.length;
                var h = b.substring(g, e),
                    f = qa(h, g);
                u(f, a, c, 2);
                c += f.length - 2;
            }
        }
        return a;
    }
    function r(b) {
        var a = [],
            c = [];
        if (b.tripleQuotedStrings)
            a.push([
                "str",
                /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,
                null,
                "'\""
            ]);
        else if (b.multiLineStrings)
            a.push([
                "str",
                /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,
                null,
                "'\"`"
            ]);
        else
            a.push([
                "str",
                /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,
                null,
                "\"'"
            ]);
        c.push(["pln", /^(?:[^\'\"\`\/\#]+)/, null, " \r\n"]);
        if (b.hashComments) a.push(["com", /^#[^\r\n]*/, null, "#"]);
        if (b.cStyleComments) c.push(["com", /^\/\/[^\r\n]*/, null]);
        if (b.regexLiterals)
            c.push([
                "str",
                /^\/(?:[^\\\*\/\[]|\\[\s\S]|\[(?:[^\]\\]|\\.)*(?:\]|$))+(?:\/|$)/,
                Y
            ]);
        if (b.cStyleComments) c.push(["com", /^\/\*[\s\S]*?(?:\*\/|$)/, null]);
        var d = x(b.keywords);
        b = null;
        var g = v(a, c),
            e = v(
                [],
                [
                    ["pln", /^\s+/, null, " \r\n"],
                    ["pln", /^[a-z_$@][a-z_$@0-9]*/i, null],
                    ["lit", /^0x[a-f0-9]+[a-z]/i, null],
                    [
                        "lit",
                        /^(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?[a-z]*/i,
                        null,
                        "123456789"
                    ],
                    ["pun", /^[^\s\w\.$@]+/, null]
                ]
            );
        function h(f, i) {
            for (var j = 0; j < i.length; j += 2) {
                var o = i[j + 1];
                if (o === "pln") {
                    var m, k, l, n;
                    m = i[j];
                    k = j + 2 < i.length ? i[j + 2] : f.length;
                    l = f.substring(m, k);
                    n = e(l, m);
                    for (var p = 0, t = n.length; p < t; p += 2) {
                        var w = n[p + 1];
                        if (w === "pln") {
                            var A = n[p],
                                B = p + 2 < t ? n[p + 2] : l.length,
                                s = f.substring(A, B);
                            if (s === ".") n[p + 1] = "pun";
                            else if (s in d) n[p + 1] = "kwd";
                            else if (/^@?[A-Z][A-Z$]*[a-z][A-Za-z$]*$/.test(s))
                                n[p + 1] = s.charAt(0) === "@" ? "lit" : "typ";
                        }
                    }
                    u(n, i, j, 2);
                    j += n.length - 2;
                }
            }
            return i;
        }
        return function(f) {
            var i = g(f);
            i = h(f, i);
            return i;
        };
    }
    var G = r({
        keywords: W,
        hashComments: true,
        cStyleComments: true,
        multiLineStrings: true,
        regexLiterals: true
    });
    function sa(b, a) {
        for (var c = 0; c < a.length; c += 2) {
            var d = a[c + 1];
            if (d === "src") {
                var g, e;
                g = a[c];
                e = c + 2 < a.length ? a[c + 2] : b.length;
                var h = G(b.substring(g, e));
                for (var f = 0, i = h.length; f < i; f += 2) h[f] += g;
                u(h, a, c, 2);
                c += h.length - 2;
            }
        }
        return a;
    }
    function ta(b, a) {
        var c = false;
        for (var d = 0; d < a.length; d += 2) {
            var g = a[d + 1],
                e,
                h;
            if (g === "atn") {
                e = a[d];
                h = d + 2 < a.length ? a[d + 2] : b.length;
                c = /^on|^style$/i.test(b.substring(e, h));
            } else if (g === "atv") {
                if (c) {
                    e = a[d];
                    h = d + 2 < a.length ? a[d + 2] : b.length;
                    var f = b.substring(e, h),
                        i = f.length,
                        j =
                            i >= 2 &&
                            /^[\"\']/.test(f) &&
                            f.charAt(0) === f.charAt(i - 1),
                        o,
                        m,
                        k;
                    if (j) {
                        m = e + 1;
                        k = h - 1;
                        o = f;
                    } else {
                        m = e + 1;
                        k = h - 1;
                        o = f.substring(1, f.length - 1);
                    }
                    var l = G(o);
                    for (var n = 0, p = l.length; n < p; n += 2) l[n] += m;
                    if (j) {
                        l.push(k, "atv");
                        u(l, a, d + 2, 0);
                    } else u(l, a, d, 2);
                }
                c = false;
            }
        }
        return a;
    }
    function ua(b) {
        var a = pa(b);
        a = ra(b, a);
        a = sa(b, a);
        a = ta(b, a);
        return a;
    }
    function va(b, a, c) {
        var d = [],
            g = 0,
            e = null,
            h = null,
            f = 0,
            i = 0,
            j = ia(8);
        function o(k) {
            if (k > g) {
                if (e && e !== h) {
                    d.push("</span>");
                    e = null;
                }
                if (!e && h) {
                    e = h;
                    d.push('<span class="', e, '">');
                }
                var l = E(j(b.substring(g, k)))
                    .replace(/(\r\n?|\n| ) /g, "$1&nbsp;")
                    .replace(/\r\n?|\n/g, "<br />");
                d.push(l);
                g = k;
            }
        }
        while (true) {
            var m;
            m = f < a.length ? (i < c.length ? a[f] <= c[i] : true) : false;
            if (m) {
                o(a[f]);
                if (e) {
                    d.push("</span>");
                    e = null;
                }
                d.push(a[f + 1]);
                f += 2;
            } else if (i < c.length) {
                o(c[i]);
                h = c[i + 1];
                i += 2;
            } else break;
        }
        o(b.length);
        if (e) d.push("</span>");
        return d.join("");
    }
    var C = {};
    function q(b, a) {
        for (var c = a.length; --c >= 0; ) {
            var d = a[c];
            if (!C.hasOwnProperty(d)) C[d] = b;
            else if ("console" in window)
                console.log("cannot override language handler %s", d);
        }
    }
    q(G, ["default-code"]);
    q(ua, ["default-markup", "html", "htm", "xhtml", "xml", "xsl"]);
    q(
        r({
            keywords: I,
            hashComments: true,
            cStyleComments: true
        }),
        ["c", "cc", "cpp", "cs", "cxx", "cyc"]
    );
    q(
        r({
            keywords: J,
            cStyleComments: true
        }),
        ["java"]
    );
    q(
        r({
            keywords: O,
            hashComments: true,
            multiLineStrings: true
        }),
        ["bsh", "csh", "sh"]
    );
    q(
        r({
            keywords: M,
            hashComments: true,
            multiLineStrings: true,
            tripleQuotedStrings: true
        }),
        ["cv", "py"]
    );
    q(
        r({
            keywords: L,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }),
        ["perl", "pl", "pm"]
    );
    q(
        r({
            keywords: N,
            hashComments: true,
            multiLineStrings: true,
            regexLiterals: true
        }),
        ["rb"]
    );
    q(
        r({
            keywords: K,
            cStyleComments: true,
            regexLiterals: true
        }),
        ["js"]
    );
    function T(b, a) {
        try {
            var c = na(b),
                d = c.source,
                g = c.tags;
            if (!C.hasOwnProperty(a))
                a = /^\s*</.test(d) ? "default-markup" : "default-code";
            var e = C[a].call({}, d);
            return va(d, g, e);
        } catch (h) {
            if ("console" in window) {
                console.log(h);
                console.trace();
            }
            return b;
        }
    }
    function wa(b) {
        var a = H(),
            c = [
                document.getElementsByTagName("pre"),
                document.getElementsByTagName("code"),
                document.getElementsByTagName("li"),
                document.getElementsByTagName("xmp")
            ],
            d = [];
        for (var g = 0; g < c.length; ++g)
            for (var e = 0; e < c[g].length; ++e) d.push(c[g][e]);
        c = null;
        var h = 0;
        function f() {
            var i = new Date().getTime() + 250;
            for (; h < d.length && new Date().getTime() < i; h++) {
                var j = d[h];
                if (j.className && j.className.indexOf("prettyprint") >= 0) {
                    var o = j.className.match(/\blang-(\w+)\b/);
                    if (o) o = o[1];
                    var m = false;
                    for (var k = j.parentNode; k; k = k.parentNode)
                        if (
                            (k.tagName === "pre" ||
                                k.tagName === "code" ||
                                k.tagName === "xmp") &&
                            k.className &&
                            k.className.indexOf("prettyprint") >= 0
                        ) {
                            m = true;
                            break;
                        }
                    if (!m) {
                        var l = ha(j);
                        l = l.replace(/(?:\r\n?|\n)$/, "");
                        var n = T(l, o);
                        if (!S(j)) j.innerHTML = n;
                        else {
                            var p = document.createElement("PRE");
                            for (var t = 0; t < j.attributes.length; ++t) {
                                var w = j.attributes[t];
                                if (w.specified)
                                    p.setAttribute(w.name, w.value);
                            }
                            p.innerHTML = n;
                            j.parentNode.replaceChild(p, j);
                            p = j;
                        }
                        if (a && j.tagName === "PRE") {
                            var A = j.getElementsByTagName("br");
                            for (var B = A.length; --B >= 0; ) {
                                var s = A[B];
                                s.parentNode.replaceChild(
                                    document.createTextNode("\r\n"),
                                    s
                                );
                            }
                        }
                    }
                }
            }
            if (h < d.length) setTimeout(f, 250);
            else if (b) b();
        }
        f();
    }
    window.PR_normalizedHtml = z;
    window.prettyPrintOne = T;
    window.prettyPrint = wa;
    window.PR = {
        createSimpleLexer: v,
        registerLangHandler: q,
        sourceDecorator: r,
        PR_ATTRIB_NAME: "atn",
        PR_ATTRIB_VALUE: "atv",
        PR_COMMENT: "com",
        PR_DECLARATION: "dec",
        PR_KEYWORD: "kwd",
        PR_LITERAL: "lit",
        PR_PLAIN: "pln",
        PR_PUNCTUATION: "pun",
        PR_SOURCE: "src",
        PR_STRING: "str",
        PR_TAG: "tag",
        PR_TYPE: "typ"
    };
})();


/***/ }),

/***/ 79863:
/*!********************************************!*\
  !*** ./runestone/parsons/js/dagHelpers.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DiGraph: () => (/* binding */ DiGraph),
/* harmony export */   hasPath: () => (/* binding */ hasPath),
/* harmony export */   isDirectedAcyclicGraph: () => (/* binding */ isDirectedAcyclicGraph)
/* harmony export */ });

/**
 * This file adapted from JSNetworkX: https://github.com/fkling/JSNetworkX
 * Copyright (C) 2012 Felix Kling <felix.kling@gmx.net>
 * JSNetworkX is distributed with the BSD license
 */

function hasPath(G, { source, target }) {
  try {
    bidirectionalShortestPath(G, source, target);
  } catch (error) {
    if (error instanceof JSNetworkXNoPath) {
      return false;
    }
    throw error;
  }
  return true;
}

function nodesAreEqual(a, b) {
  return a === b || (typeof a === "object" && a.toString() === b.toString());
}

function bidirectionalShortestPath(G, source, target) {
  // call helper to do the real work
  var [pred, succ, w] = bidirectionalPredSucc(G, source, target);

  // build path from pred+w+succ
  var path = [];
  // from source to w
  while (w != null) {
    path.push(w);
    w = pred.get(w);
  }
  w = succ.get(path[0]);
  path.reverse();
  // from w to target
  while (w != null) {
    path.push(w);
    w = succ.get(w);
  }
  return path;
}

function bidirectionalPredSucc(G, source, target) {
  // does BFS from both source and target and meets in the middle
  if (nodesAreEqual(source, target)) {
    return [new Map([[source, null]]), new Map([[target, null]]), source];
  }

  // handle either directed or undirected
  var gpred, gsucc;
  gpred = G.predecessorsIter.bind(G);
  gsucc = G.successorsIter.bind(G);

  // predecesssor and successors in search
  var pred = new Map([[source, null]]);
  var succ = new Map([[target, null]]);
  //
  // initialize fringes, start with forward
  var forwardFringe = [source];
  var reverseFringe = [target];
  var thisLevel;

  /*jshint newcap:false*/
  while (forwardFringe.length > 0 && reverseFringe.length > 0) {
    if (forwardFringe.length <= reverseFringe.length) {
      thisLevel = forwardFringe;
      forwardFringe = [];
      for (let v of thisLevel) {
        for (let w of gsucc(v)) {
          if (!pred.has(w)) {
            forwardFringe.push(w);
            pred.set(w, v);
          }
          if (succ.has(w)) {
            return [pred, succ, w]; // found path
          }
        }
      }
    } else {
      thisLevel = reverseFringe;
      reverseFringe = [];
      for (let v of thisLevel) {
        for (let w of gpred(v)) {
          if (!succ.has(w)) {
            reverseFringe.push(w);
            succ.set(w, v);
          }
          if (pred.has(w)) {
            return [pred, succ, w]; // found path
          }
        }
      }
    }
  }
  throw new JSNetworkXNoPath(
    "No path between " + source.toString() + " and " + target.toString() + "."
  );
}

function topologicalSort(G, optNbunch) {
  // nonrecursive version
  var seen = new Set();
  var orderExplored = []; // provide order and
  // fast search without more general priorityDictionary
  var explored = new Set();

  if (optNbunch == null) {
    optNbunch = G.nodesIter();
  }

  for (let v of optNbunch) {
    // process all vertices in G
    if (explored.has(v)) {
      return; // continue
    }

    var fringe = [v]; // nodes yet to look at
    while (fringe.length > 0) {
      var w = fringe[fringe.length - 1]; // depth first search
      if (explored.has(w)) {
        // already looked down this branch
        fringe.pop();
        continue;
      }
      seen.add(w); // mark as seen
      // Check successors for cycles for new nodes
      var newNodes = [];
      /*eslint-disable no-loop-func*/
      G.get(w).forEach(function (_, n) {
        if (!explored.has(n)) {
          if (seen.has(n)) {
            // CYCLE !!
            throw new JSNetworkXUnfeasible("Graph contains a cycle.");
          }
          newNodes.push(n);
        }
      });
      /*eslint-enable no-loop-func*/
      if (newNodes.length > 0) {
        // add new nodes to fringe
        fringe.push.apply(fringe, newNodes);
      } else {
        explored.add(w);
        orderExplored.unshift(w);
      }
    }
  }

  return orderExplored;
}

function isDirectedAcyclicGraph(G) {
  try {
    topologicalSort(G);
    return true;
  } catch (ex) {
    if (ex instanceof JSNetworkXUnfeasible) {
      return false;
    }
    throw ex;
  }
}

class DiGraph {
  constructor() {
    this.graph = {}; // dictionary for graph attributes
    this.node = new Map(); // dictionary for node attributes
    // We store two adjacency lists:
    // the predecessors of node n are stored in the dict self.pred
    // the successors of node n are stored in the dict self.succ=self.adj
    this.adj = new Map(); // empty adjacency dictionary
    this.pred = new Map(); // predecessor
    this.succ = this.adj; // successor

    this.edge = this.adj;
  }

  addNode(n) {
    if (!this.succ.has(n)) {
      this.succ.set(n, new Map());
      this.pred.set(n, new Map());
      this.node.set(n);
    }
  }

  addEdge(u, v) {
    // add nodes
    if (!this.succ.has(u)) {
      this.succ.set(u, new Map());
      this.pred.set(u, new Map());
      this.node.set(u, {});
    }

    if (!this.succ.has(v)) {
      this.succ.set(v, new Map());
      this.pred.set(v, new Map());
      this.node.set(v, {});
    }

    // add the edge
    var datadict = this.adj.get(u).get(v) || {};
    this.succ.get(u).set(v, datadict);
    this.pred.get(v).set(u, datadict);
  }

  nodes(optData = false) {
    return Array.from(optData ? this.node.entries() : this.node.keys());
  }

  edges(optNbunch, optData = false) {
    return Array.from(this.edgesIter(optNbunch, optData));
  }

  nodesIter(optData = false) {
    if (optData) {
      return toIterator(this.node);
    }
    return this.node.keys();
  }

  get(n) {
    var value = this.adj.get(n);
    if (typeof value === "undefined") {
      throw new KeyError("Graph does not contain node " + n + ".");
    }
    return value;
  }

  numberOfNodes() {
    return this.node.size;
  }

  *nbunchIter(optNbunch) {
    if (optNbunch == null) {
      // include all nodes
      /*jshint expr:true*/
      yield* this.adj.keys();
    } else if (this.hasNode(optNbunch)) {
      // if nbunch is a single node
      yield optNbunch;
    } else {
      // if nbunch is a sequence of nodes
      var adj = this.adj;

      try {
        for (var n of toIterator(optNbunch)) {
          if (adj.has(n)) {
            yield n;
          }
        }
      } catch (ex) {
        if (ex instanceof TypeError) {
          throw new JSNetworkXError(
            "nbunch is not a node or a sequence of nodes"
          );
        }
      }
    }
  }

  *edgesIter(optNbunch, optData = false) {
    // handle calls with opt_data being the only argument
    if (isBoolean(optNbunch)) {
      optData = optNbunch;
      optNbunch = undefined;
    }

    var nodesNbrs;

    if (optNbunch === undefined) {
      nodesNbrs = this.adj;
    } else {
      nodesNbrs = mapIterator(this.nbunchIter(optNbunch), (n) =>
        tuple2(n, this.adj.get(n))
      );
    }

    for (var nodeNbrs of nodesNbrs) {
      for (var nbrData of nodeNbrs[1]) {
        var result = [nodeNbrs[0], nbrData[0]];
        if (optData) {
          result[2] = nbrData[1];
        }
        yield result;
      }
    }
  }

  reverse(optCopy = true) {
    var H;
    if (optCopy) {
      H = new this.constructor(null, {
        name: "Reverse of (" + this.name + ")",
      });
      H.addNodesFrom(this);
      H.addEdgesFrom(
        mapIterator(this.edgesIter(null, true), (edge) =>
          tuple3c(edge[1], edge[0], deepcopy(edge[2]), edge)
        )
      );
      H.graph = deepcopy(this.graph);
      H.node = deepcopy(this.node);
    } else {
      var thisPred = this.pred;
      var thisSucc = this.succ;

      this.succ = thisPred;
      this.pred = thisSucc;
      this.adj = this.succ;
      H = this;
    }
    return H;
  }

  successorsIter(n) {
    var nbrs = this.succ.get(n);
    if (nbrs !== undefined) {
      return nbrs.keys();
    }
    throw new JSNetworkXError(
      sprintf('The node "%j" is not in the digraph.', n)
    );
  }

  predecessorsIter(n) {
    var nbrs = this.pred.get(n);
    if (nbrs !== undefined) {
      return nbrs.keys();
    }
    throw new JSNetworkXError(
      sprintf('The node "%j" is not in the digraph.', n)
    );
  }

  successors(n) {
    return Array.from(this.successorsIter(n));
  }

  predecessors(n) {
    return Array.from(this.predecessorsIter(n));
  }
}

class JSNetworkXException {
  constructor(message) {
    this.name = "JSNetworkXException";
    this.message = message;
  }
}

class JSNetworkXAlgorithmError extends JSNetworkXException {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXAlgorithmError";
  }
}

class JSNetworkXError extends JSNetworkXException {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXError";
  }
}

class JSNetworkXUnfeasible extends JSNetworkXAlgorithmError {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXUnfeasible";
  }
}

class JSNetworkXNoPath extends JSNetworkXUnfeasible {
  constructor(message) {
    super(message);
    this.name = "JSNetworkXNoPath";
  }
}

// function from LoDash, needed by functions from JSNetworkX
function isObjectLike(value) {
  return !!value && typeof value == "object";
}

// function from LoDash, needed by functions from JSNetworkX
function isBoolean(value) {
  var boolTag = "[object Boolean]";
  return (
    value === true ||
    value === false ||
    (isObjectLike(value) && Object.prototype.toString.call(value) == boolTag)
  );
}


/***/ }),

/***/ 88210:
/*!********************************************!*\
  !*** ./runestone/parsons/js/hammer.min.js ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.8",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha, true?!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){return ha}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):0}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map

/***/ }),

/***/ 91032:
/*!********************************************!*\
  !*** ./runestone/parsons/css/parsons.less ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 95762:
/*!********************************************!*\
  !*** ./runestone/parsons/css/prettify.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3BhcnNvbnNfanNfdGltZWRwYXJzb25zX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRWdEO0FBQy9CO0FBQ0c7QUFDVjtBQUNNO0FBQ0E7QUFDYztBQUNQO0FBQ0k7QUFDRTtBQUMxQztBQUNxRDtBQUNGO0FBQ047O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVlLHNCQUFzQixtRUFBYTtBQUNsRDtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRDtBQUNsRDtBQUNBLDJCQUEyQjtBQUMzQjs7QUFFQSwyQkFBMkIsMEJBQTBCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isa0RBQVM7QUFDL0Isc0JBQXNCLG1EQUFlO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGtCQUFrQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsd0JBQXdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZUFBZTtBQUN2QztBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGVBQWU7QUFDdkM7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFcUM7O0FBRXJDO0FBQ2U7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGtCQUFrQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsNEJBQTRCLGtCQUFrQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtB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QUEsa0dBQUMsQ0FBQyxDQUFvRSxDQUFDO0FBQzFrb0Isc0M7Ozs7Ozs7Ozs7OztBQ05BOzs7Ozs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcGFyc29ucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvdGltZWRwYXJzb25zLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9zZXR0bGVkQmxvY2suanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnNMaW5lLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wbGFjZWhvbGRlckxpbmUuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2xpbmVHcmFkZXIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnNCbG9jay5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvZGFnR3JhZGVyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcGFyc29ucy9qcy9wYXJzb25zLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BsYWNlaG9sZGVyQmxvY2suanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL3BhcnNvbnMtaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3BhcnNvbnMvanMvcHJldHRpZnkuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2RhZ0hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2pzL2hhbW1lci5taW4uanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2Nzcy9wYXJzb25zLmxlc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9wYXJzb25zL2Nzcy9wcmV0dGlmeS5jc3MiXSwic291cmNlc0NvbnRlbnQiOlsiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnMgUnVuZXN0b25lIERpcmVjdGl2ZSBKYXZhc2NyaXB0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFJlbmRlcnMgYSBQYXJzb25zIHByb2JsZW0gYmFzZWQgb24gdGhlIEhUTUwgY3JlYXRlZCBieSB0aGVcbj09PT09PT09IHBhcnNvbnMucHkgc2NyaXB0IGFuZCB0aGUgUlNUIGZpbGUuXG49PT09IENPTlRSSUJVVE9SUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IElzYWlhaCBNYXllcmNoYWtcbj09PT09PT09IEplZmYgUmlja1xuPT09PT09PT0gQmFyYmFyYSBFcmljc29uXG49PT09PT09PSBDb2xlIEJvd2Vyc1xuPT09PSBBZGFwdGVkIGZvcm0gdGhlIG9yaWdpbmFsIEpTIFBhcnNvbnMgYnkgPT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBWaWxsZSBLYXJhdmlydGFcbj09PT09PT09IFBldHJpIEloYW50b2xhXG49PT09PT09PSBKdWhhIEhlbG1pbmVuXG49PT09PT09PSBNaWtlIEhld25lclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gTGluZUJhc2VkR3JhZGVyIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVXNlZCBmb3IgZ3JhZGluZyBhIFBhcnNvbnMgcHJvYmxlbS5cbj09PT0gUFJPUEVSVElFUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gcHJvYmxlbTogdGhlIFBhcnNvbnMgcHJvYmxlbVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgXCIuL3BhcnNvbnMtaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9wYXJzb25zLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4vcHJldHRpZnkuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9wYXJzb25zLmxlc3NcIjtcbmltcG9ydCBcIi4uL2Nzcy9wcmV0dGlmeS5jc3NcIjtcbmltcG9ydCBMaW5lQmFzZWRHcmFkZXIgZnJvbSBcIi4vbGluZUdyYWRlclwiO1xuaW1wb3J0IERBR0dyYWRlciBmcm9tIFwiLi9kYWdHcmFkZXJcIjtcbmltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuaW1wb3J0IFBhcnNvbnNCbG9jayBmcm9tIFwiLi9wYXJzb25zQmxvY2tcIjtcbi8vIENvZGVUYWlsb3ItcmVsYXRlZCBpbXBvcnRzIFVwZGF0ZWQgMTAvMjYvMjAyNVxuaW1wb3J0IFBsYWNlaG9sZGVyQmxvY2sgZnJvbSBcIi4vcGxhY2Vob2xkZXJCbG9jay5qc1wiO1xuaW1wb3J0IFBsYWNlaG9sZGVyTGluZSBmcm9tIFwiLi9wbGFjZWhvbGRlckxpbmUuanNcIjtcbmltcG9ydCBTZXR0bGVkQmxvY2sgZnJvbSBcIi4vc2V0dGxlZEJsb2NrLmpzXCI7XG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBQYXJzb25zIE9iamVjdCA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PSBUaGUgbW9kZWwgYW5kIHZpZXcgb2YgYSBQYXJzb25zIHByb2JsZW0gYmFzZWQgb24gd2hhdCBpc1xuPT09PT09PT0gc3BlY2lmaWVkIGluIHRoZSBIVE1MLCB3aGljaCBpcyBiYXNlZCBvbiB3aGF0IGlzIHNwZWNpZmllZFxuPT09PT09PT0gaW4gdGhlIFJTVCBmaWxlXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IG9wdGlvbnM6IG9wdGlvbnMgbGFyZ2VseSBzcGVjaWZpZWQgZnJvbSB0aGUgSFRNTFxuPT09PT09PT0gZ3JhZGVyOiBhIExpbmVHcmFkZXIgZm9yIGdyYWRpbmcgdGhlIHByb2JsZW1cbj09PT09PT09IGxpbmVzOiBhbiBhcnJheSBvZiBhbGwgUGFyc29uc0xpbmUgYXMgc3BlY2lmaWVkIGluIHRoZSBwcm9ibGVtXG49PT09PT09PSBzb2x1dGlvbjogYW4gYXJyYXkgb2YgUGFyc29uc0xpbmUgaW4gdGhlIHNvbHV0aW9uXG49PT09PT09PSBibG9ja3M6IHRoZSBjdXJyZW50IGJsb2Nrc1xuPT09PT09PT0gc291cmNlQXJlYTogdGhlIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgc291cmNlIGJsb2Nrc1xuPT09PT09PT0gYW5zd2VyQXJlYTogdGhlIGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGUgYW5zd2VyIGJsb2Nrc1xuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PSBJTklUSUFMSVpBVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnMgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwcmU+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gb3JpZztcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9ICQob3JpZykuZmluZChcInByZS5wYXJzb25zYmxvY2tzXCIpWzBdO1xuICAgICAgICAvLyBGaW5kIHRoZSBxdWVzdGlvbiB0ZXh0IGFuZCBzdG9yZSBpdCBpbiAucXVlc3Rpb25cbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9ICQob3JpZykuZmluZChgLnBhcnNvbnNfcXVlc3Rpb25gKVswXTtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IG9wdHMudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcHRzLm9yaWcuaWQ7XG4gICAgICAgIC8vIFNldCB0aGUgc3RvcmFnZUlkIChrZXkgZm9yIHN0b3JpbmcgZGF0YSlcbiAgICAgICAgdmFyIHN0b3JhZ2VJZCA9IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICB0aGlzLnN0b3JhZ2VJZCA9IHN0b3JhZ2VJZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlczsgLy8gdGhpcyBjb250YWlucyBhbGwgb2YgdGhlIGNoaWxkIGVsZW1lbnRzIG9mIHRoZSBlbnRpcmUgdGFnLi4uXG4gICAgICAgIHRoaXMuY29udGVudEFycmF5ID0gW107XG4gICAgICAgIFBhcnNvbnMuY291bnRlcisrOyAvLyAgICBVbmlxdWUgaWRlbnRpZmllclxuICAgICAgICB0aGlzLmNvdW50ZXJJZCA9IFwicGFyc29ucy1cIiArIFBhcnNvbnMuY291bnRlcjtcblxuICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gICAgIGlmICgkKHRoaXMuY2hpbGRyZW5baV0pLmlzKFwiW2RhdGEtcXVlc3Rpb25dXCIpKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgIC8vICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5pbml0aWFsaXplT3B0aW9ucygpO1xuICAgICAgICB0aGlzLmdyYWRlciA9XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMuZ3JhZGVyID09PSBcImRhZ1wiXG4gICAgICAgICAgICAgICAgPyBuZXcgREFHR3JhZGVyKHRoaXMpXG4gICAgICAgICAgICAgICAgOiBuZXcgTGluZUJhc2VkR3JhZGVyKHRoaXMpO1xuICAgICAgICB0aGlzLmdyYWRlci5zaG93ZmVlZGJhY2sgPSB0aGlzLnNob3dmZWVkYmFjaztcbiAgICAgICAgdmFyIGZ1bGx0ZXh0ID0gJCh0aGlzLm9yaWdFbGVtKS5odG1sKCk7XG4gICAgICAgIHRoaXMuYmxvY2tJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IDA7XG4gICAgICAgIHRoaXMubnVtRGlzdGluY3QgPSAwO1xuICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVMaW5lcyhmdWxsdGV4dC50cmltKCkpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVWaWV3KCk7XG4gICAgICAgIHRoaXMuY2FwdGlvbiA9IFwiUGFyc29uc1wiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIC8vIENoZWNrIHRoZSBzZXJ2ZXIgZm9yIGFuIGFuc3dlciB0byBjb21wbGV0ZSB0aGluZ3NcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcInBhcnNvbnNcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMucnVubmFibGVEaXYgPSBudWxsO1xuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgZGF0YS1maWVsZHMgaW4gdGhlIG9yaWdpbmFsIEhUTUwsIGluaXRpYWxpemUgb3B0aW9uc1xuICAgIGluaXRpYWxpemVPcHRpb25zKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHBpeGVsc1BlckluZGVudDogMzAsXG4gICAgICAgIH07XG4gICAgICAgIC8vIGFkZCBtYXhkaXN0IGFuZCBvcmRlciBpZiBwcmVzZW50XG4gICAgICAgIHZhciBtYXhkaXN0ID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwibWF4ZGlzdFwiKTtcbiAgICAgICAgdmFyIG9yZGVyID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwib3JkZXJcIik7XG4gICAgICAgIHZhciBub2luZGVudCA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcIm5vaW5kZW50XCIpO1xuICAgICAgICB2YXIgYWRhcHRpdmUgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJhZGFwdGl2ZVwiKTtcbiAgICAgICAgdmFyIG51bWJlcmVkID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwibnVtYmVyZWRcIik7XG4gICAgICAgIHZhciBncmFkZXIgPSAkKHRoaXMub3JpZ0VsZW0pLmRhdGEoXCJncmFkZXJcIik7XG4gICAgICAgIC8vIENvZGVUYWlsb3I6IHByb2FjdGl2ZWx5IHNldCB0aGUgcHV6emxlIGFzIHNjYWZmb2xkaW5nIHB1enpsZSB0byBkaWZmZXJlbnRpYXRlIHdpdGggb3RoZXIgcHV6emxlIHByYWN0aWNlIGZvcm1hdHNcbiAgICAgICAgdmFyIHNjYWZmb2xkaW5nID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwic2NhZmZvbGRpbmdcIik7XG4gICAgICAgIG9wdGlvbnNbXCJudW1iZXJlZFwiXSA9IG51bWJlcmVkO1xuICAgICAgICBvcHRpb25zW1wiZ3JhZGVyXCJdID0gZ3JhZGVyO1xuICAgICAgICBvcHRpb25zW1wic2NhZmZvbGRpbmdcIl0gPSBzY2FmZm9sZGluZztcbiAgICAgICAgaWYgKG1heGRpc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgb3B0aW9uc1tcIm1heGRpc3RcIl0gPSBtYXhkaXN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcmRlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBjb252ZXJ0IG9yZGVyIHN0cmluZyB0byBhcnJheSBvZiBudW1iZXJzXG4gICAgICAgICAgICBvcmRlciA9IG9yZGVyLm1hdGNoKC9cXGQrL2cpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcmRlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG9yZGVyW2ldID0gcGFyc2VJbnQob3JkZXJbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0aW9uc1tcIm9yZGVyXCJdID0gb3JkZXI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vaW5kZW50ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbm9pbmRlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibm9pbmRlbnRcIl0gPSBub2luZGVudDtcbiAgICAgICAgdGhpcy5ub2luZGVudCA9IG5vaW5kZW50O1xuICAgICAgICBpZiAoYWRhcHRpdmUgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBhZGFwdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGFkYXB0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBZGFwdGl2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJhZGFwdGl2ZVwiXSA9IGFkYXB0aXZlO1xuICAgICAgICAvLyBhZGQgbG9jYWxlIGFuZCBsYW5ndWFnZVxuICAgICAgICB2YXIgbG9jYWxlID0gZUJvb2tDb25maWcubG9jYWxlO1xuICAgICAgICBpZiAobG9jYWxlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbXCJsb2NhbGVcIl0gPSBsb2NhbGU7XG4gICAgICAgIHZhciBsYW5ndWFnZSA9ICQodGhpcy5vcmlnRWxlbSkuZGF0YShcImxhbmd1YWdlXCIpO1xuICAgICAgICBpZiAobGFuZ3VhZ2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsYW5ndWFnZSA9IGVCb29rQ29uZmlnLmxhbmd1YWdlO1xuICAgICAgICAgICAgaWYgKGxhbmd1YWdlID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gXCJweXRob25cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wibGFuZ3VhZ2VcIl0gPSBsYW5ndWFnZTtcbiAgICAgICAgdmFyIHByZXR0aWZ5TGFuZ3VhZ2UgPSB7XG4gICAgICAgICAgICBweXRob246IFwicHJldHR5cHJpbnQgbGFuZy1weVwiLFxuICAgICAgICAgICAgamF2YTogXCJwcmV0dHlwcmludCBsYW5nLWphdmFcIixcbiAgICAgICAgICAgIGphdmFzY3JpcHQ6IFwicHJldHR5cHJpbnQgbGFuZy1qc1wiLFxuICAgICAgICAgICAgaHRtbDogXCJwcmV0dHlwcmludCBsYW5nLWh0bWxcIixcbiAgICAgICAgICAgIGM6IFwicHJldHR5cHJpbnQgbGFuZy1jXCIsXG4gICAgICAgICAgICBcImMrK1wiOiBcInByZXR0eXByaW50IGxhbmctY3BwXCIsXG4gICAgICAgICAgICBjcHA6IFwicHJldHR5cHJpbnQgbGFuZy1jcHBcIixcbiAgICAgICAgICAgIHJ1Ynk6IFwicHJldHR5cHJpbnQgbGFuZy1yYlwiLFxuICAgICAgICB9W2xhbmd1YWdlXTtcbiAgICAgICAgaWYgKHByZXR0aWZ5TGFuZ3VhZ2UgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwcmV0dGlmeUxhbmd1YWdlID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zW1wicHJldHRpZnlMYW5ndWFnZVwiXSA9IHByZXR0aWZ5TGFuZ3VhZ2U7XG4gICAgICAgIC8vcnVubmFibGUgaWYgdGhlIHBhcmVudCBoYXMgYSBwYXJzb25zLXJ1bm5hYmxlIGF0dHJcbiAgICAgICAgb3B0aW9uc1tcInJ1bm5hYmxlXCJdID0gJCh0aGlzLm9yaWdFbGVtKS5kYXRhKFwicnVubmFibGVcIik7XG4gICAgICAgIC8vIFBhcnNlIGJsb2NrIGV4cGxhbmF0aW9ucyBpZiBwcmVzZW50XG4gICAgICAgIHZhciBleHBsYW5hdGlvbnNSYXcgPSAkKHRoaXMub3JpZ0VsZW0pLmF0dHIoXCJkYXRhLWV4cGxhbmF0aW9uc1wiKTtcbiAgICAgICAgaWYgKGV4cGxhbmF0aW9uc1Jhdykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrRXhwbGFuYXRpb25zID0gSlNPTi5wYXJzZShleHBsYW5hdGlvbnNSYXcpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tFeHBsYW5hdGlvbnMgPSB7fTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYmxvY2tFeHBsYW5hdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB3aGF0IGlzIHNwZWNpZmllZCBpbiB0aGUgb3JpZ2luYWwgSFRNTCwgY3JlYXRlIHRoZSBIVE1MIHZpZXdcbiAgICBpbml0aWFsaXplVmlldygpIHtcbiAgICAgICAgdGhpcy5vdXRlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQodGhpcy5vdXRlckRpdikuYWRkQ2xhc3MoXCJwYXJzb25zXCIpO1xuICAgICAgICB0aGlzLm91dGVyRGl2LmlkID0gdGhpcy5jb3VudGVySWQ7XG4gICAgICAgIC8vIHBhcnNvbnMtdGV4dCBleGlzdHMgaW4gc291cmNlLCBtYWtlIHN1cmUgaXQgaGFzIGV4ZXJjaXNlLXN0YXRlbWVudCBjbGFzc1xuICAgICAgICBsZXQgcGFyc29uc1RleHREaXYgPSB0aGlzLmNvbnRhaW5lckRpdi5xdWVyeVNlbGVjdG9yKFwiLnBhcnNvbnMtdGV4dFwiKTtcbiAgICAgICAgaWYgKHBhcnNvbnNUZXh0RGl2ICYmICFwYXJzb25zVGV4dERpdi5jbGFzc0xpc3QuY29udGFpbnMoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIikpXG4gICAgICAgICAgICBwYXJzb25zVGV4dERpdi5jbGFzc0xpc3QuYWRkKFwiZXhlcmNpc2Utc3RhdGVtZW50XCIpO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmtleWJvYXJkVGlwKS5hdHRyKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRUaXAuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXRpcFwiO1xuICAgICAgICB0aGlzLmtleWJvYXJkVGlwLmlubmVySFRNTCA9ICQuaTE4bihcIm1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGVcIik7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5rZXlib2FyZFRpcCk7XG4gICAgICAgICQodGhpcy5rZXlib2FyZFRpcCkuaGlkZSgpO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuc29ydENvbnRhaW5lckRpdikuYWRkQ2xhc3MoXCJzb3J0YWJsZS1jb2RlLWNvbnRhaW5lclwiKTtcbiAgICAgICAgJCh0aGlzLnNvcnRDb250YWluZXJEaXYpLmF0dHIoXG4gICAgICAgICAgICBcImFyaWEtZGVzY3JpYmVkYnlcIixcbiAgICAgICAgICAgIHRoaXMuY291bnRlcklkICsgXCItdGlwXCJcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5vdXRlckRpdi5hcHBlbmRDaGlsZCh0aGlzLnNvcnRDb250YWluZXJEaXYpO1xuICAgICAgICB0aGlzLnNvdXJjZVJlZ2lvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2LmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VSZWdpb25cIjtcbiAgICAgICAgJCh0aGlzLnNvdXJjZVJlZ2lvbkRpdikuYWRkQ2xhc3MoXCJzb3J0YWJsZS1jb2RlXCIpO1xuICAgICAgICB0aGlzLnNvdXJjZUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLnNvdXJjZUxhYmVsKS5hdHRyKFwicm9sZVwiLCBcInRvb2x0aXBcIik7XG4gICAgICAgIHRoaXMuc291cmNlTGFiZWwuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVRpcFwiO1xuICAgICAgICB0aGlzLnNvdXJjZUxhYmVsLmlubmVySFRNTCA9ICQuaTE4bihcIm1zZ19wYXJzb25fZHJhZ19mcm9tX2hlcmVcIik7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc291cmNlTGFiZWwpO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zb3VyY2VSZWdpb25EaXYpO1xuICAgICAgICB0aGlzLnNvdXJjZUFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnNvdXJjZUFyZWEuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVwiO1xuICAgICAgICAkKHRoaXMuc291cmNlQXJlYSkuYWRkQ2xhc3MoXCJzb3VyY2VcIik7XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5hdHRyKFxuICAgICAgICAgICAgXCJhcmlhLWRlc2NyaWJlZGJ5XCIsXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXJJZCArIFwiLXNvdXJjZVRpcFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc291cmNlUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc291cmNlQXJlYSk7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJSZWdpb25EaXYuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWFuc3dlclJlZ2lvblwiO1xuICAgICAgICAkKHRoaXMuYW5zd2VyUmVnaW9uRGl2KS5hZGRDbGFzcyhcInNvcnRhYmxlLWNvZGVcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyTGFiZWwpLmF0dHIoXCJyb2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMYWJlbC5pZCA9IHRoaXMuY291bnRlcklkICsgXCItYW5zd2VyVGlwXCI7XG4gICAgICAgIHRoaXMuYW5zd2VyTGFiZWwuaW5uZXJIVE1MID0gJC5pMThuKFwibXNnX3BhcnNvbl9kcmFnX3RvX2hlcmVcIik7XG4gICAgICAgIHRoaXMuYW5zd2VyUmVnaW9uRGl2LmFwcGVuZENoaWxkKHRoaXMuYW5zd2VyTGFiZWwpO1xuICAgICAgICB0aGlzLnNvcnRDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5hbnN3ZXJSZWdpb25EaXYpO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmFuc3dlckFyZWEuaWQgPSB0aGlzLmNvdW50ZXJJZCArIFwiLWFuc3dlclwiO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYXR0cihcbiAgICAgICAgICAgIFwiYXJpYS1kZXNjcmliZWRieVwiLFxuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJUaXBcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLmFuc3dlclJlZ2lvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLmFuc3dlckFyZWEpO1xuICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLnBhcnNvbnNDb250cm9sRGl2KS5hZGRDbGFzcyhcInBhcnNvbnMtY29udHJvbHNcIik7XG4gICAgICAgIHRoaXMub3V0ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5wYXJzb25zQ29udHJvbERpdik7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5jaGVja0J1dHRvbikuYXR0cihcImNsYXNzXCIsIFwiYnRuIGJ0bi1zdWNjZXNzXCIpO1xuICAgICAgICB0aGlzLmNoZWNrQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX3BhcnNvbl9jaGVja19tZVwiKTtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItY2hlY2tcIjtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLmNoZWNrQnV0dG9uKTtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5jaGVja0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoYXQubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhhdC5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5yZXNldEJ1dHRvbikuYXR0cihcImNsYXNzXCIsIFwiYnRuIGJ0bi1kZWZhdWx0XCIpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX3BhcnNvbl9yZXNldFwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItcmVzZXRcIjtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi50eXBlID0gXCJidXR0b25cIjtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgICAgICAkKHRoYXQuY2hlY2tCdXR0b24pLnByb3AoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICAgICB0aGF0LnJlc2V0VmlldygpO1xuICAgICAgICAgICAgdGhhdC5jaGVja0NvdW50ID0gMDtcbiAgICAgICAgICAgIHRoYXQubG9nTW92ZShcInJlc2V0XCIpO1xuICAgICAgICAgICAgdGhhdC5zZXRMb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuaGVscEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICAkKHRoaXMuaGVscEJ1dHRvbikuYXR0cihcImNsYXNzXCIsIFwiYnRuIGJ0bi1wcmltYXJ5XCIpO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX3BhcnNvbl9oZWxwXCIpO1xuICAgICAgICAgICAgdGhpcy5oZWxwQnV0dG9uLmlkID0gdGhpcy5jb3VudGVySWQgKyBcIi1oZWxwXCI7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTsgLy8gYmplXG4gICAgICAgICAgICB0aGlzLnBhcnNvbnNDb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMuaGVscEJ1dHRvbik7XG4gICAgICAgICAgICB0aGlzLmhlbHBCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhhdC5oZWxwTWUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubWVzc2FnZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5pZCA9IHRoaXMuY291bnRlcklkICsgXCItbWVzc2FnZVwiO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgdGhpcy5wYXJzb25zQ29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLm1lc3NhZ2VEaXYpO1xuICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5vdXRlckRpdik7XG4gICAgICAgICQodGhpcy5vdXRlckRpdikuY2xvc2VzdChcIi5zcWNvbnRhaW5lclwiKS5jc3MoXCJtYXgtd2lkdGhcIiwgXCJub25lXCIpO1xuICAgICAgICBpZiAodGhpcy5vdXRlckRpdikge1xuICAgICAgICAgICAgaWYgKCQodGhpcy5xdWVzdGlvbikuaHRtbCgpLm1hdGNoKC9eXFxzKyQvKSkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xdWVzdGlvbikucmVtb3ZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQodGhpcy5vdXRlckRpdikucHJlcGVuZCh0aGlzLnF1ZXN0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIGxpbmVzIGFuZCBzb2x1dGlvbiBwcm9wZXJ0aWVzXG4gICAgLy8gQ29kZVRhaWxvcjogYSBiaWcgY2hhbmdlIGlzIGluIHRoaXMgZnVuY3Rpb24gLSBpbmNsdWRlZCAjc2V0dGxlZCBibG9ja3MgYW5kIHBsYWNlaG9sZGVyIGJsb2Nrc1xuICAgIGluaXRpYWxpemVMaW5lcyh0ZXh0KSB7XG4gICAgICAgIHRoaXMubGluZXMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBpbml0aWFsIGJsb2Nrc1xuICAgICAgICB2YXIgdGV4dEJsb2NrcyA9IHRleHQuc3BsaXQoXCItLS1cIik7XG4gICAgICAgIGlmICh0ZXh0QmxvY2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG5vIC0tLSwgdGhlbiBldmVyeSBsaW5lIGlzIGl0cyBvd24gYmxvY2tcbiAgICAgICAgICAgIHRleHRCbG9ja3MgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzb2x1dGlvbiA9IFtdO1xuICAgICAgICB2YXIgaW5kZW50cyA9IFtdO1xuICAgICAgICAvLyBDb2RlVGFpbG9yOiBQYXJzb25zIHB1enpsZSB3aXNlLCB0aGUgYmlnZ2VzdCBjaGFuZ2UgaXMgaW4gdGhpcyBzZWN0aW9uXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlck5lZWRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgYSBwbGFjZWhvbGRlciBuZWVkZWQgdG8gYmUgY3JlYXRlZCBhdCB0aGUgZW5kXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dEJsb2NrID0gdGV4dEJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAvLyBGaWd1cmUgb3V0IG9wdGlvbnMgYmFzZWQgb24gdGhlICNvcHRpb25cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIG9wdGlvbnMgZnJvbSB0aGUgY29kZVxuICAgICAgICAgICAgICAgIC8vIG9ubHkgb3B0aW9ucyBhcmUgI3BhaXJlZCBvciAjZGlzdHJhY3RvclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zID0ge307XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyYWN0SW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RyYWN0SGVscHRleHQgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHZhciB0YWdJbmRleDtcbiAgICAgICAgICAgICAgICB2YXIgdGFnO1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRzSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIGRlcGVuZHMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI3BhaXJlZDpcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3BhaXJlZDpcIik7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SGVscHRleHQgPSB0ZXh0QmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoZGlzdHJhY3RJbmRleCArIDgsIHRleHRCbG9jay5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKDAsIGRpc3RyYWN0SW5kZXggKyA3KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNkaXN0cmFjdG9yOlwiKSkge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEluZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjZGlzdHJhY3RvcjpcIik7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SGVscHRleHQgPSB0ZXh0QmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoZGlzdHJhY3RJbmRleCArIDEyLCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnN1YnN0cmluZygwLCBkaXN0cmFjdEluZGV4ICsgMTEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dEJsb2NrLmluY2x1ZGVzKFwiI3NldHRsZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldHRsZWRJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3NldHRsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SGVscHRleHQgPSB0ZXh0QmxvY2tcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zdWJzdHJpbmcoc2V0dGxlZEluZGV4ICsgOCwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgc2V0dGxlZEluZGV4ICsgOCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjdGFnOlwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2sgPSB0ZXh0QmxvY2sucmVwbGFjZSgvI3RhZzouKjsuKjsvLCAocykgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHMucmVwbGFjZSgvXFxzKy9nLCBcIlwiKVxuICAgICAgICAgICAgICAgICAgICApOyAvLyByZW1vdmUgd2hpdGVzcGFjZSBpbiB0YWcgYW5kIGRlcGVuZHMgbGlzdFxuICAgICAgICAgICAgICAgICAgICB0YWdJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI3RhZzpcIik7XG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdJbmRleCArIDUsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0QmxvY2suaW5kZXhPZihcIjtcIiwgdGFnSW5kZXggKyA1KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFnID09IFwiXCIpIHRhZyA9IFwiYmxvY2stXCIgKyBpO1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRzSW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIjtkZXBlbmRzOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGVuZHNTdHJpbmcgPSB0ZXh0QmxvY2suc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kc0luZGV4ICsgOSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRCbG9jay5pbmRleE9mKFwiO1wiLCBkZXBlbmRzSW5kZXggKyA5KVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBkZXBlbmRzID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlcGVuZHNTdHJpbmcubGVuZ3RoID4gMCA/IGRlcGVuZHNTdHJpbmcuc3BsaXQoXCIsXCIpIDogW107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoJ2NsYXNzPVwiZGlzcGxheW1hdGgnKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0gPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAvIyhwYWlyZWR8ZGlzdHJhY3RvcnxzZXR0bGVkfHRhZzouKjsuKjspLyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKG15c3RyaW5nLCBhcmcxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zW2FyZzFdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGJsb2NrIGlzICNzZXR0bGVkIC0gY3JlYXRlIGEgcGxhY2Vob2xkZXIgbGluZSAoUEgpIGJlZm9yZSB0aGUgbGluZXMsXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgaWYgaXQgaXMgbm90IHRoZSBmaXJzdCBibG9jaywgYW5kIHRoZSBwcmV2aW91cyBibG9jayBpcyBub3Qgc2V0dGxlZFxuICAgICAgICAgICAgICAgIC8vIElmIGxpbmVzIGFyZTogc2V0dGxlZCwgbGluZSAxLCBsaW5lIDIsIGxpbmUgMywgc2V0dGxlZCwgbGluZSA0OlxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBzZXR0bGVkLCBsaW5lIDEsIGxpbmUgMiwgbGluZSAzLCBQSDEsIHNldHRsZWQsIGxpbmUgNCwgUEgyXG4gICAgICAgICAgICAgICAgLy8gSWYgbGluZXMgYXJlOiBsaW5lIDEsIHNldHRsZWQsIHNldHRsZWQsIGxpbmUgMiwgbGluZSAzLCBsaW5lIDQsIHNldHRsZWQ6XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGxpbmUgMSwgUEgxLCBzZXR0bGVkLCBzZXR0bGVkLCBsaW5lIDIsIGxpbmUgMywgbGluZSA0LCBQSDIsIHNldHRsZWRcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInNldHRsZWRcIl0gJiYgaSA+IDAgJiYgbGluZXMubGVuZ3RoID4gMCAmJiAhbGluZXNbbGluZXMubGVuZ3RoIC0gMV0uaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlckxpbmUgPSBuZXcgUGxhY2Vob2xkZXJMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcy5wdXNoKHBsYWNlaG9sZGVyTGluZSk7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5ncm91cFdpdGhOZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5pbmRlbnQgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInNldHRsZWRcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJOZWVkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgbGluZXNcbiAgICAgICAgICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3BsaXQgPSB0ZXh0QmxvY2suc3BsaXQoXCJcXG5cIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gW3RleHRCbG9ja107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3BsaXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBzcGxpdFtqXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBibGFuayByb3dzXG4gICAgICAgICAgICAgICAgICAgIGlmICghL15cXHMqJC8udGVzdChjb2RlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpbmUgPSBuZXcgUGFyc29uc0xpbmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9uc1tcInBhaXJlZFwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnNbXCJkaXN0cmFjdG9yXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuZGlzdHJhY3RIZWxwdGV4dCA9IGRpc3RyYWN0SGVscHRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnNbXCJzZXR0bGVkXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0dGxlZCBsaW5lczogZml4ZWQgc29sdXRpb24gbGluZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuaXNTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb2x1dGlvbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZ3JhZGVyID09PSBcImRhZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUudGFnID0gdGFnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRlcGVuZHMgPSBkZXBlbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkobGluZS5pbmRlbnQsIGluZGVudHMpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50cy5wdXNoKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZ3JvdXBXaXRoTmV4dFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbGluZXMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5ncm91cFdpdGhOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5ncm91cFdpdGhOZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBsYWNlaG9sZGVyTmVlZGVkICYmICFsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5pc1NldHRsZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBhIHNldHRsZWQgbGluZSBiZWZvcmUgdGhlIGVuZGluZyBsaW5lc1xuICAgICAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlckxpbmUgPSBuZXcgUGxhY2Vob2xkZXJMaW5lKHRoaXMpO1xuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gocGxhY2Vob2xkZXJMaW5lKTtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZGlzdHJhY3RvciA9IHRydWU7XG4gICAgICAgICAgICAgICAgcGxhY2Vob2xkZXJMaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyTGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlckxpbmUuZ3JvdXBXaXRoTmV4dCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ29kZVRhaWxvcjogTm9ybWFsaXplIHRoZSBpbmRlbnRzIGZvciBqYXZhIC0gc29tZXRpbWVzIGphdmEgaW5kZW50IGRpcmVjdGx5IHVzZXMgOCBzcGFjZXMgZm9yIG1ldGhvZCBpbmRlbnRcbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT09IFwiamF2YVwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNsYXNzTGluZUluZGVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgbGV0IG1ldGhvZExpbmVJbmRlbnQgPSBudWxsO1xuICAgIFxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBsaW5lVGV4dCA9IHRoaXMubGluZXNbaV0udGV4dDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3NMaW5lSW5kZW50ID09PSBudWxsICYmIChsaW5lVGV4dC5pbmNsdWRlcyhcInB1YmxpYyBjbGFzc1wiKSB8fCBsaW5lVGV4dC5zdGFydHNXaXRoKFwiaW1wb3J0XCIpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaW5lSW5kZW50ID0gdGhpcy5saW5lc1tpXS5pbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRob2RMaW5lSW5kZW50ID09PSBudWxsICYmIGxpbmVUZXh0LmluY2x1ZGVzKFwicHVibGljIHN0YXRpY1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kTGluZUluZGVudCA9IHRoaXMubGluZXNbaV0uaW5kZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBCcmVhayBlYXJseSBvbmNlIGJvdGggYXJlIGZvdW5kXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGFzc0xpbmVJbmRlbnQgIT09IG51bGwgJiYgbWV0aG9kTGluZUluZGVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICAgICAgLy8gRGV0ZWN0ZWQgSmF2YSA4LXNwYWNlIGluZGVudCDigJQgd2lsbCBzaGlmdCBsZXZlbHMgZG93biBieSBvbmUuXG4gICAgICAgICAgICAgICAgaWYgKGNsYXNzTGluZUluZGVudCA9PT0gMCAmJiBtZXRob2RMaW5lSW5kZW50ID09PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGVudHMgPSBpbmRlbnRzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG9yaWdpbmFsSW5kZW50ID0gbGluZS5pbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9ybWFsaXplZExldmVsID0gaW5kZW50cy5pbmRleE9mKG9yaWdpbmFsSW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkTGV2ZWwgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZExldmVsIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmluZGVudCA9IG5vcm1hbGl6ZWRMZXZlbDtcbiAgICAgICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpbmRlbnRzID0gaW5kZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuaW5kZW50ID0gaW5kZW50cy5pbmRleE9mKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gUHl0aG9uIC0gT3JpZ2luYWwgYmVoYXZpb3JcbiAgICAgICAgICAgICAgICBpbmRlbnRzID0gaW5kZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBsaW5lLmluZGVudCA9IGluZGVudHMuaW5kZXhPZihsaW5lLmluZGVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zb2x1dGlvbiA9IHNvbHV0aW9uO1xuICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE5vcm1hbCBQYXJzb25zIHB1enpsZSBpbml0aWFsaXphdGlvblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0QmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRleHRCbG9jayA9IHRleHRCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgLy8gRmlndXJlIG91dCBvcHRpb25zIGJhc2VkIG9uIHRoZSAjb3B0aW9uXG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSBvcHRpb25zIGZyb20gdGhlIGNvZGVcbiAgICAgICAgICAgICAgICAvLyBvbmx5IG9wdGlvbnMgYXJlICNwYWlyZWQgb3IgI2Rpc3RyYWN0b3JcbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmFjdEluZGV4O1xuICAgICAgICAgICAgICAgIHZhciBkaXN0cmFjdEhlbHB0ZXh0ID0gXCJcIjtcbiAgICAgICAgICAgICAgICB2YXIgdGFnSW5kZXg7XG4gICAgICAgICAgICAgICAgdmFyIHRhZztcbiAgICAgICAgICAgICAgICB2YXIgZGVwZW5kc0luZGV4O1xuICAgICAgICAgICAgICAgIHZhciBkZXBlbmRzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiNwYWlyZWQ6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RyYWN0SW5kZXggPSB0ZXh0QmxvY2suaW5kZXhPZihcIiNwYWlyZWQ6XCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyA4LCB0ZXh0QmxvY2subGVuZ3RoKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRyaW0oKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrID0gdGV4dEJsb2NrLnN1YnN0cmluZygwLCBkaXN0cmFjdEluZGV4ICsgNyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXh0QmxvY2suaW5jbHVkZXMoXCIjZGlzdHJhY3RvcjpcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdHJhY3RJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiI2Rpc3RyYWN0b3I6XCIpO1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdEhlbHB0ZXh0ID0gdGV4dEJsb2NrXG4gICAgICAgICAgICAgICAgICAgICAgICAuc3Vic3RyaW5nKGRpc3RyYWN0SW5kZXggKyAxMiwgdGV4dEJsb2NrLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5zdWJzdHJpbmcoMCwgZGlzdHJhY3RJbmRleCArIDExKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRCbG9jay5pbmNsdWRlcyhcIiN0YWc6XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKC8jdGFnOi4qOy4qOy8sIChzKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgcy5yZXBsYWNlKC9cXHMrL2csIFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICk7IC8vIHJlbW92ZSB3aGl0ZXNwYWNlIGluIHRhZyBhbmQgZGVwZW5kcyBsaXN0XG4gICAgICAgICAgICAgICAgICAgIHRhZ0luZGV4ID0gdGV4dEJsb2NrLmluZGV4T2YoXCIjdGFnOlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gdGV4dEJsb2NrLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ0luZGV4ICsgNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRCbG9jay5pbmRleE9mKFwiO1wiLCB0YWdJbmRleCArIDUpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWcgPT0gXCJcIikgdGFnID0gXCJibG9jay1cIiArIGk7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHNJbmRleCA9IHRleHRCbG9jay5pbmRleE9mKFwiO2RlcGVuZHM6XCIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGVwZW5kc1N0cmluZyA9IHRleHRCbG9jay5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRzSW5kZXggKyA5LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEJsb2NrLmluZGV4T2YoXCI7XCIsIGRlcGVuZHNJbmRleCArIDkpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGRlcGVuZHMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVwZW5kc1N0cmluZy5sZW5ndGggPiAwID8gZGVwZW5kc1N0cmluZy5zcGxpdChcIixcIikgOiBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRleHRCbG9jay5pbmNsdWRlcygnY2xhc3M9XCJkaXNwbGF5bWF0aCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbXCJkaXNwbGF5bWF0aFwiXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRleHRCbG9jayA9IHRleHRCbG9jay5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAvXFxzKiMocGFpcmVkfGRpc3RyYWN0b3J8dGFnOi4qOy4qOylcXHMqL2csXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChteXN0cmluZywgYXJnMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1thcmcxXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGxpbmVzXG4gICAgICAgICAgICAgICAgdmFyIGxpbmVzID0gW107XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zW1wiZGlzcGxheW1hdGhcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbGl0ID0gdGV4dEJsb2NrLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGxpdCA9IFt0ZXh0QmxvY2tdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3BsaXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGUgPSBzcGxpdFtqXTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzQmxhbmsgPSAvXlxccyokLy50ZXN0KGNvZGUpO1xuICAgICAgICAgICAgICAgICAgICAvLyBkaXNjYXJkIHVwIHRvIG9uZSBibGFuayBsZWFkaW5nIG9yIHRyYWlsaW5nIGxpbmVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQmxhbmsgJiYgKGogPT0gMCB8fCBqID09IHNwbGl0Lmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgbGluZSA9IG5ldyBQYXJzb25zTGluZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc1tcImRpc3BsYXltYXRoXCJdXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zW1wicGFpcmVkXCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0b3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5wYWlyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdEhlbHB0ZXh0ID0gZGlzdHJhY3RIZWxwdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zW1wiZGlzdHJhY3RvclwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucGFpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRpc3RyYWN0SGVscHRleHQgPSBkaXN0cmFjdEhlbHB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5kaXN0cmFjdG9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnBhaXJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ncmFkZXIgPT09IFwiZGFnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnRhZyA9IHRhZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmRlcGVuZHMgPSBkZXBlbmRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChsaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KGxpbmUuaW5kZW50LCBpbmRlbnRzKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50cy5wdXNoKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZ3JvdXBXaXRoTmV4dFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbGluZXMubGVuZ3RoIC0gMTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tqXS5ncm91cFdpdGhOZXh0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5ncm91cFdpdGhOZXh0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHRoZSBpbmRlbnRzXG4gICAgICAgICAgICBpbmRlbnRzID0gaW5kZW50cy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxpbmUgPSB0aGlzLmxpbmVzW2ldO1xuICAgICAgICAgICAgICAgIGxpbmUuaW5kZW50ID0gaW5kZW50cy5pbmRleE9mKGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc29sdXRpb24gPSBzb2x1dGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgYmxvY2tzLCBjcmVhdGUgdGhlIHNvdXJjZSBhbmQgYW5zd2VyIGFyZWFzXG4gICAgYXN5bmMgaW5pdGlhbGl6ZUFyZWFzKHNvdXJjZUJsb2NrcywgYW5zd2VyQmxvY2tzLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBibG9ja3MgcHJvcGVydHkgYXMgdGhlIHN1bSBvZiB0aGUgdHdvXG4gICAgICAgIHZhciBibG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIGksIGJsb2NrO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgc291cmNlQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5hcHBlbmRDaGlsZChibG9jay52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5hcHBlbmRDaGlsZChibG9jay52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJsb2NrcyA9IGJsb2NrcztcbiAgICAgICAgLy8gSWYgcHJlc2VudCwgZGlzYWJsZSBzb21lIGJsb2Nrc1xuICAgICAgICB2YXIgZGlzYWJsZWQgPSBvcHRpb25zLmRpc2FibGVkO1xuICAgICAgICBpZiAoZGlzYWJsZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChkaXNhYmxlZC5pbmNsdWRlcyhibG9jay5saW5lc1swXS5pbmRleCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBEZXRlcm1pbmUgaG93IG11Y2ggaW5kZW50IHNob3VsZCBiZSBwb3NzaWJsZSBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAgICAgdmFyIGluZGVudCA9IDA7XG4gICAgICAgIGlmICghdGhpcy5ub2luZGVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIikge1xuICAgICAgICAgICAgICAgIGluZGVudCA9IHRoaXMuc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5kZW50ID0gTWF0aC5tYXgoMCwgdGhpcy5zb2x1dGlvbkluZGVudCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGVudCA9IGluZGVudDtcbiAgICAgICAgLy8gRm9yIHJlbmRlcmluZywgcGxhY2UgaW4gYW4gb25zY3JlZW4gcG9zaXRpb25cbiAgICAgICAgdmFyIGlzSGlkZGVuID0gdGhpcy5vdXRlckRpdi5vZmZzZXRQYXJlbnQgPT0gbnVsbDtcbiAgICAgICAgdmFyIHJlcGxhY2VFbGVtZW50O1xuICAgICAgICBpZiAoaXNIaWRkZW4pIHtcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHJlcGxhY2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmUtc3BoaW54XCIpO1xuICAgICAgICAgICAgJCh0aGlzLm91dGVyRGl2KS5yZXBsYWNlV2l0aChyZXBsYWNlRWxlbWVudCk7XG4gICAgICAgICAgICAvLyBhZGQgcnVuZXN0b25lLXNwaGlueCBjbGFzcyBzbyB0aGUgY3NzIHJ1bGVzIGZvciBwYXJzb25zIHdpbGwgYXBwbHlcbiAgICAgICAgICAgICQodGhpcy5vdXRlckRpdikuYWRkQ2xhc3MoXCJydW5lc3RvbmUtc3BoaW54XCIpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG9ubHkgZG8gcHJldHRpZnkgaWYgcHJpc20gaXMgbm90IGxvYWRlZFxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnByZXR0aWZ5TGFuZ3VhZ2UgIT09IFwiXCIgJiYgdHlwZW9mIFByaXNtID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBwcmV0dHlQcmludCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGFuZyA9IHRoaXMub3B0aW9uc1tcImxhbmd1YWdlXCJdO1xuICAgICAgICBpZiAobGFuZyAmJiB0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvZGVFbHMgPSB0aGlzLmNvbnRhaW5lckRpdi5xdWVyeVNlbGVjdG9yQWxsKFwiY29kZVwiKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZWwgb2YgY29kZUVscykge1xuICAgICAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoYGxhbmd1YWdlLSR7bGFuZ31gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5saW5lc1tpXS5pbml0aWFsaXplV2lkdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCB0aGUgc291cmNlIHdpZHRoIHRvIGl0cyBtYXggdmFsdWUuICBUaGlzIGFsbG93cyB0aGUgYmxvY2tzIHRvIGJlIGNyZWF0ZWRcbiAgICAgICAgLy8gYXQgdGhlaXIgXCJuYXR1cmFsXCIgc2l6ZS4gQXMgbG9uZyBhcyB0aGF0IGlzIHNtYWxsZXIgdGhhbiB0aGUgbWF4LlxuICAgICAgICAvLyBUaGlzIGFsbG93cyB1cyB0byB1c2Ugc2Vuc2libGUgZnVuY3Rpb25zIHRvIGRldGVybWluZSB0aGUgY29ycmVjdCBoZWlnaHRzXG4gICAgICAgIC8vIGFuZCB3aWR0aHMgZm9yIHRoZSBkcmFnIGFuZCBkcm9wIGFyZWFzLlxuICAgICAgICAvLyBMaWtlIG1vc3Qgb2YgdGhlIHNpemluZywgdGhpcyBpcyBhIGJpdCBvZiBhIGhhY2suXG4gICAgICAgIGNvbnN0IGF2YWlsYWJsZVdpZHRoID0gdGhpcy5vdXRlckRpdi5vZmZzZXRXaWR0aDtcbiAgICAgICAgY29uc3QgYW5zd2VySW5kZW50U3BhY2UgPSB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICogdGhpcy5pbmRlbnQ7XG4gICAgICAgIGNvbnN0IG1hcmdpbkZ1ZGdlID0gODA7ICAvLyBtYXJnaW5zLCBwYWRkaW5nLCBldGMuLi5cbiAgICAgICAgbGV0IG1heFNvdXJjZUFyZWFXaWR0aCA9IChhdmFpbGFibGVXaWR0aCAtIGFuc3dlckluZGVudFNwYWNlIC0gbWFyZ2luRnVkZ2UpIC8gMjtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIG1heFNvdXJjZUFyZWFXaWR0aCAtPSAyNTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNvdXJjZUFyZWEuc3R5bGUud2lkdGggPSBtYXhTb3VyY2VBcmVhV2lkdGggKyBcInB4XCI7IC8vIGxpa2VseSByZWR1Y2VkIGxhdGVyXG5cbiAgICAgICAgLy8gTGF5b3V0IHRoZSBhcmVhc1xuICAgICAgICB2YXIgYXJlYVdpZHRoLCBhcmVhSGVpZ2h0O1xuICAgICAgICAvLyBFc3RhYmxpc2ggdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGRyb3BwYWJsZSBhcmVhc1xuICAgICAgICB2YXIgaXRlbTtcbiAgICAgICAgYXJlYUhlaWdodCA9IDIwO1xuICAgICAgICB2YXIgaGVpZ2h0X2FkZCA9IDA7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBoZWlnaHRfYWRkID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVzZSB0d28gZXhwbGljaXQgcGFzc2VzIOKAlCBmaXJzdCBtZWFzdXJlIGFsbCB3aWR0aHMgKHdpdGggTWF0aEpheCBhd2FpdGVkIHBlciBibG9jayBmb3IgbWF0aCksXG4gICAgICAgIC8vIHRoZW4gYXBwbHkgdGhlIGZpbmFsIGFyZWFXaWR0aCB0byBhbGwgYmxvY2tzIGFuZCBtZWFzdXJlIGhlaWdodHMuXG4gICAgICAgIGFyZWFXaWR0aCA9IDA7XG4gICAgICAgIGNvbnN0IGlzTWF0aCA9IHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm5hdHVyYWxcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJtYXRoXCI7XG5cbiAgICAgICAgLy8gUGFzcyAxOiByZW5kZXIgbWF0aCBpZiBuZWVkZWQuXG4gICAgICAgIC8vIFR5cGVzZXQgYWxsIGJsb2NrcyBpbiBhIHNpbmdsZSBNYXRoSmF4IGNhbGwgaW5zdGVhZCBvZiBvbmUgcGVyIGJsb2NrLFxuICAgICAgICAvLyB3aGljaCBlbGltaW5hdGVzIHRoZSBOLWZvbGQgc2VyaWFsIG92ZXJoZWFkIG9mIHRoZSBwcmV2aW91cyBhcHByb2FjaC5cbiAgICAgICAgaWYgKGlzTWF0aCkge1xuICAgICAgICAgICAgY29uc3QgYmxvY2tFbGVtZW50cyA9IGJsb2Nrcy5tYXAoYiA9PiAkKGIudmlldylbMF0pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBydW5lc3RvbmVNYXRoUmVhZHkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBydW5lc3RvbmVNYXRoUmVhZHkudGhlbihcbiAgICAgICAgICAgICAgICAgICAgYXN5bmMgKCkgPT4gYXdhaXQgTWF0aEpheC50eXBlc2V0UHJvbWlzZShibG9ja0VsZW1lbnRzKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgTWF0aEpheC5zdGFydHVwICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IE1hdGhKYXgudHlwZXNldFByb21pc2UoYmxvY2tFbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFzcyAyOiBtZWFzdXJlIG5hdHVyYWwgd2lkdGggb2YgZWFjaCBibG9jayAobm93IGZ1bGx5IHJlbmRlcmVkKVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmVhV2lkdGggPSBNYXRoLm1heChhcmVhV2lkdGgsICQoYmxvY2tzW2ldLnZpZXcpLm91dGVyV2lkdGgodHJ1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUGFzcyAzOiBhcHBseSB1bmlmb3JtIGZpbmFsIHdpZHRoIHRvIGFsbCBibG9ja3MsIHRoZW4gbWVhc3VyZSBoZWlnaHRzXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gJChibG9ja3NbaV0udmlldyk7XG4gICAgICAgICAgICBpdGVtLndpZHRoKGFyZWFXaWR0aCAtIDIyKTtcbiAgICAgICAgICAgIHZhciBhZGRpdGlvbiA9IDMuODtcbiAgICAgICAgICAgIGxldCBvdXRlckggPSBpdGVtLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgaWYgKG91dGVySCAhPSAzOCkge1xuICAgICAgICAgICAgICAgIGFkZGl0aW9uID0gKDMuMSAqIChvdXRlckggLSAzOCkpIC8gMjE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhcmVhSGVpZ2h0ICs9IG91dGVySCArIGhlaWdodF9hZGQgKiBhZGRpdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNvbWV0aW1lcyB3ZSBoYXZlIGEgcHJvYmxlbSB3aXRoIGhpZGRlbiBlbGVtZW50cyBub3QgZ2V0dGluZyB0aGUgcmlnaHQgaGVpZ2h0XG4gICAgICAgIC8vIGp1c3QgbWFrZSBzdXJlIHRoYXQgd2UgaGF2ZSBhIHJlYXNvbmFibGUgaGVpZ2h0LiBUaGVyZSBtdXN0IGJlIGEgYmV0dGVyIHdheSB0b1xuICAgICAgICAvLyBkbyB0aGlzLlxuICAgICAgICBpZiAodGhpcy5pc1RpbWVkICYmIGFyZWFIZWlnaHQgPCBibG9ja3MubGVuZ3RoICogMzgpIHtcbiAgICAgICAgICAgIGFyZWFIZWlnaHQgPSBibG9ja3MubGVuZ3RoICogNTA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcmVhV2lkdGggPSBhcmVhV2lkdGg7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFyZWFXaWR0aCArPSAyNTtcbiAgICAgICAgICAgIC8vYXJlYUhlaWdodCArPSAoYmxvY2tzLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gKyA0MCB0byBhcmVhSGVpZ2h0IHRvIHByb3ZpZGUgc29tZSBhZGRpdGlvbmFsIGJ1ZmZlciBpbiBjYXNlIGFueSB0ZXh0IG92ZXJmbG93IHN0aWxsIGhhcHBlbnMgLSBWaW5jZW50IFFpdSAoU2VwdGVtYmVyIDIwMjApXG4gICAgICAgIGlmIChpbmRlbnQgPiAwICYmIGluZGVudCA8PSA0KSB7XG4gICAgICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYWRkQ2xhc3MoXCJhbnN3ZXJcIiArIGluZGVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYWRkQ2xhc3MoXCJhbnN3ZXJcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBwYWlyZWQgZGlzdHJhY3RvciBkZWNvcmF0aW9uXG4gICAgICAgIHZhciBiaW5zID0gW107XG4gICAgICAgIHZhciBiaW4gPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChsaW5lLmJsb2NrKCkgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJpbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbnMucHVzaChiaW4pO1xuICAgICAgICAgICAgICAgICAgICBiaW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJpbi5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgICAgIGlmICghbGluZS5ncm91cFdpdGhOZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGJpbnMucHVzaChiaW4pO1xuICAgICAgICAgICAgICAgICAgICBiaW4gPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBhaXJlZEJpbnMgPSBbXTtcbiAgICAgICAgdmFyIGxpbmVOdW1iZXJzID0gW107XG4gICAgICAgIHZhciBwYWlyZWREaXZzID0gW107XG4gICAgICAgIHZhciBqO1xuICAgICAgICBpZiAodGhpcy5wYWlyRGlzdHJhY3RvcnMgfHwgIXRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgZm9yIChpID0gYmlucy5sZW5ndGggLSAxOyBpID4gLTE7IGktLSkge1xuICAgICAgICAgICAgICAgIGJpbiA9IGJpbnNbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJpblswXS5wYWlyZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFsbCBpbiBiaW4gdG8gbGluZSBudW1iZXJzXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IGJpbi5sZW5ndGggLSAxOyBqID4gLTE7IGotLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnMudW5zaGlmdChiaW5bal0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmVOdW1iZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBhbGwgaW4gYmluIHRvIGxpbmUgbnVtYmVyc1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gYmluLmxlbmd0aCAtIDE7IGogPiAtMTsgai0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnMudW5zaGlmdChiaW5bal0uaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFpcmVkQmlucy51bnNoaWZ0KGxpbmVOdW1iZXJzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcGFpcmVkQmlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBwYWlyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICQocGFpcmVkRGl2KS5hZGRDbGFzcyhcInBhaXJlZFwiKTtcbiAgICAgICAgICAgICAgICAkKHBhaXJlZERpdikuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBpZD0gJ3N0JyBzdHlsZSA9ICd2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBmb250LXdlaWdodDogYm9sZCc+b3J7PC9zcGFuPlwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBwYWlyZWREaXZzLnB1c2gocGFpcmVkRGl2KTtcbiAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQocGFpcmVkRGl2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhaXJlZEJpbnMgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIGRvZXMgbm90IHNlZW0gdG8gYmUgbmVjZXNzYXJ5IC0gc28gc2V0IG11bHRpcGxpZXIgdG8gMC5cbiAgICAgICAgYXJlYUhlaWdodCArPSBwYWlyZWRCaW5zLmxlbmd0aCAqIDA7IC8vIHRoZSBwYWlyZWQgYmlucyB0YWtlIHVwIGV4dHJhIHNwYWNlIHdoaWNoIGNhblxuICAgICAgICAvLyBjYXVzZSB0aGUgYmxvY2tzIHRvIHNwaWxsIG91dC4gIFRoaXNcbiAgICAgICAgLy8gY29ycmVjdHMgdGhhdCBieSBhZGRpbmcgYSBsaXR0bGUgZXh0cmFcbiAgICAgICAgdGhpcy5hcmVhSGVpZ2h0ID0gYXJlYUhlaWdodDtcbiAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmFyZWFIZWlnaHQsXG4gICAgICAgIH0pO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICogaW5kZW50ICsgdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmFyZWFIZWlnaHQsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucGFpcmVkQmlucyA9IHBhaXJlZEJpbnM7XG4gICAgICAgIHRoaXMucGFpcmVkRGl2cyA9IHBhaXJlZERpdnM7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEJsb2NrTGFiZWxzKHNvdXJjZUJsb2Nrcy5jb25jYXQoYW5zd2VyQmxvY2tzKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXBkYXRlIHRoZSB2aWV3XG4gICAgICAgIHRoaXMuc3RhdGUgPSB1bmRlZmluZWQ7IC8vIG5lZWRzIHRvIGJlIGhlcmUgZm9yIGxvYWRpbmcgZnJvbSBzdG9yYWdlXG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xuICAgICAgICAvLyBQdXQgYmFjayBpbnRvIHRoZSBvZmZzY3JlZW4gcG9zaXRpb25cbiAgICAgICAgaWYgKGlzSGlkZGVuKSB7XG4gICAgICAgICAgICAkKHJlcGxhY2VFbGVtZW50KS5yZXBsYWNlV2l0aCh0aGlzLm91dGVyRGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNYWtlIGJsb2NrcyBpbnRlcmFjdGl2ZSAoYm90aCBkcmFnLWFuZC1kcm9wIGFuZCBrZXlib2FyZClcbiAgICBpbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5ibG9ja3NbaV0uaW5pdGlhbGl6ZUludGVyYWN0aXZpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVUYWJJbmRleCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubGFuZ3VhZ2UgPT0gXCJuYXR1cmFsXCIgfHxcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIlxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgTWF0aEpheC5zdGFydHVwICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5pdGlhbGl6ZUFyZWFzIGFscmVhZHkgdHlwZXNldCBhbGwgYmxvY2tzIGluIGEgc2luZ2xlIGJhdGNoIGNhbGwsXG4gICAgICAgICAgICAgICAgLy8gc28gbm8gZnVydGhlciBNYXRoSmF4IHdvcmsgaXMgbmVlZGVkIGhlcmUuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKVxuICAgICAgICAgICAgICAgIC8vIGRlZmVycyB0aGUgcmUtbGF5b3V0IGJ5IG9uZSBtaWNyb3Rhc2sgdGljaywgZ2l2aW5nIHRoZSBicm93c2VyIHRpbWVcbiAgICAgICAgICAgICAgICAvLyB0byByZWZsb3cgdGhlIG5ld2x5IHJlbmRlcmVkIG1hdGggYmVmb3JlIG91dGVySGVpZ2h0KCkgaXMgbWVhc3VyZWQuXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIGFyZWFXaWR0aCBhbmQgYXJlYUhlaWdodCBmcm9tIGFsbCBibG9ja3MgKHNvdXJjZSArIGFuc3dlcilcbiAgICAgICAgICAgICAgICAgICAgLy8gbm93IHRoYXQgTWF0aEpheCBoYXMgcmVuZGVyZWQgdG8gZmluYWwgZGltZW5zaW9ucy5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0FyZWFXaWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdBcmVhSGVpZ2h0ID0gMjA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHRfYWRkID0gdGhpcy5vcHRpb25zLm51bWJlcmVkICE9IHVuZGVmaW5lZCA/IDEgOiAwO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhbGxCbG9ja3MgPSBzb3VyY2VCbG9ja3MuY29uY2F0KGFuc3dlckJsb2Nrcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRmlyc3QgcGFzczogZmluZCBtYXggbmF0dXJhbCB3aWR0aCBhY3Jvc3MgYWxsIGJsb2Nrc1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2NrVmlldyA9ICQoYWxsQmxvY2tzW2ldLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tWaWV3LmNzcyhcIndpZHRoXCIsIFwiXCIpOyAgIC8vIHJlbGVhc2UgZml4ZWQgd2lkdGggdG8gZ2V0IG5hdHVyYWwgd2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0FyZWFXaWR0aCA9IE1hdGgubWF4KG5ld0FyZWFXaWR0aCwgYmxvY2tWaWV3Lm91dGVyV2lkdGgodHJ1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubnVtYmVyZWQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBcmVhV2lkdGggKz0gMjU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIGJhc2VXaWR0aCA9IG5ld0FyZWFXaWR0aCAtIDIyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VyV2lkdGggPSBuZXdBcmVhV2lkdGggKyB0aGlzLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgLSAyMjtcblxuICAgICAgICAgICAgICAgICAgICAvLyBTZWNvbmQgcGFzczogYXBwbHkgY29ycmVjdCB3aWR0aCBhbmQgYWNjdW11bGF0ZSBoZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibG9ja1ZpZXcgPSAkKGFsbEJsb2Nrc1tpXS52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrVmlldy5jc3MoXCJ3aWR0aFwiLCBiYXNlV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG91dGVySCA9IGJsb2NrVmlldy5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRpdGlvbiA9IDMuODtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdXRlckggIT0gMzgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRpdGlvbiA9ICgzLjEgKiAob3V0ZXJIIC0gMzgpKSAvIDIxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QXJlYUhlaWdodCArPSBvdXRlckggKyBoZWlnaHRfYWRkICogYWRkaXRpb247XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFyZWFXaWR0aCA9IG5ld0FyZWFXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcmVhSGVpZ2h0ID0gbmV3QXJlYUhlaWdodDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZXNpemUgc291cmNlIGFuZCBhbnN3ZXIgYXJlYXNcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnNvdXJjZUFyZWEpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogbmV3QXJlYVdpZHRoICsgMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogbmV3QXJlYUhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiB0aGlzLmluZGVudCArIG5ld0FyZWFXaWR0aCArIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IG5ld0FyZWFIZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlcG9zaXRpb24gc291cmNlIGJsb2Nrc1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25Ub3AgPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChzb3VyY2VCbG9ja3NbaV0udmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgKz0gJChzb3VyY2VCbG9ja3NbaV0udmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBSZXBvc2l0aW9uIHBhaXJlZCBkaXN0cmFjdG9yIGJyYWNrZXRzXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWlyZWRCaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYmluID0gdGhpcy5wYWlyZWRCaW5zW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hdGNoaW5nID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VCbG9ja3Nbal0ubWF0Y2hlc0JpbihiaW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoaW5nLnB1c2goc291cmNlQmxvY2tzW2pdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGl2ID0gdGhpcy5wYWlyZWREaXZzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkaXYpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChkaXYpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGVpZ2h0ID0gLTU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHBhcnNlSW50KCQobWF0Y2hpbmdbbWF0Y2hpbmcubGVuZ3RoIC0gMV0udmlldykuY3NzKFwidG9wXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQgLT0gcGFyc2VJbnQoJChtYXRjaGluZ1swXS52aWV3KS5jc3MoXCJ0b3BcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodCArPSAkKG1hdGNoaW5nW21hdGNoaW5nLmxlbmd0aCAtIDFdLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoZGl2KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAkKG1hdGNoaW5nWzBdLnZpZXcpLmNzcyhcInRvcFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCArIDM0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dC1pbmRlbnRcIjogLTMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmctdG9wXCI6IChoZWlnaHQgLSA3MCkgLyAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJ2aXNpYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IDQzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInZlcnRpY2FsLWFsaWduXCI6IFwibWlkZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiM3ZTdlZTdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKGRpdikuaHRtbChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCI8c3BhbiBpZD0nc3QnIHN0eWxlPSd2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOyBmb250LXdlaWdodDogYm9sZDsgZm9udC1zaXplOiAxNXB4Jz5vcjwvc3Bhbj57XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmVwb3NpdGlvbiBhbnN3ZXIgYmxvY2tzXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRlbnQgPSBibG9jay5pbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHBvc2l0aW9uVG9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBhbnN3ZXJXaWR0aCAtIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgKz0gJChibG9jay52aWV3KS5vdXRlckhlaWdodCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1ha2Ugb25lIGJsb2NrIGJlIGtleWJvYXJkIGFjY2Vzc2libGVcbiAgICBpbml0aWFsaXplVGFiSW5kZXgoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGJsb2NrLm1ha2VUYWJJbmRleCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gU0VSVkVSIENPTU1VTklDQVRJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFJldHVybiB0aGUgYXJndW1lbnQgdGhhdCBpcyBuZXdlciBiYXNlZCBvbiB0aGUgdGltZXN0YW1wXG4gICAgbmV3ZXJEYXRhKGRhdGFBLCBkYXRhQikge1xuICAgICAgICB2YXIgZGF0ZUEgPSBkYXRhQS50aW1lc3RhbXA7XG4gICAgICAgIHZhciBkYXRlQiA9IGRhdGFCLnRpbWVzdGFtcDtcbiAgICAgICAgaWYgKGRhdGVBID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFCO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlQiA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhQTtcbiAgICAgICAgfVxuICAgICAgICBkYXRlQSA9IHRoaXMuZGF0ZUZyb21UaW1lc3RhbXAoZGF0ZUEpO1xuICAgICAgICBkYXRlQiA9IHRoaXMuZGF0ZUZyb21UaW1lc3RhbXAoZGF0ZUIpO1xuICAgICAgICBpZiAoZGF0ZUEgPiBkYXRlQikge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFBO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFCO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEJhc2VkIG9uIHRoZSBkYXRhLCBsb2FkXG4gICAgYXN5bmMgbG9hZERhdGEoZGF0YSkge1xuICAgICAgICAvLyBndWFyZCBhZ2FpbnN0IGFueSBmYWlsdXJlIHRvIGxvYWQvYWRhcHQgcHJvYmxlbVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zY2FmZm9sZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VIYXNoID0gZGF0YS5zb3VyY2U7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1haW50YWluIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUhhc2ggPSBkYXRhLnRyYXNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VySGFzaCA9IGRhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSBkYXRhLmFkYXB0aXZlO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgICAgICAgIGlmIChhZGFwdGl2ZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zRnJvbUhhc2goYWRhcHRpdmVIYXNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubm9pbmRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2hlY2tDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IG9wdGlvbnMuY2hlY2tDb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGFzU29sdmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBvcHRpb25zLmhhc1NvbHZlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplQXJlYXModGhpcy5ibG9ja3NGcm9tU291cmNlKCksIHRoaXMuc2V0dGxlZEJsb2Nrc0Zyb21Tb3VyY2UoKSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VIYXNoID0gZGF0YS5zb3VyY2U7XG4gICAgICAgICAgICAgICAgaWYgKHNvdXJjZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1haW50YWluIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZUhhc2ggPSBkYXRhLnRyYXNoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgYW5zd2VySGFzaCA9IGRhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSBkYXRhLmFkYXB0aXZlO1xuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zO1xuICAgICAgICAgICAgICAgIGlmIChhZGFwdGl2ZUhhc2ggPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zRnJvbUhhc2goYWRhcHRpdmVIYXNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubm9pbmRlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5vaW5kZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuY2hlY2tDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IG9wdGlvbnMuY2hlY2tDb3VudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGFzU29sdmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYXNTb2x2ZWQgPSBvcHRpb25zLmhhc1NvbHZlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VIYXNoID09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJIYXNoID09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJIYXNoLmxlbmd0aCA9PSAxXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZUFyZWFzKHRoaXMuYmxvY2tzRnJvbVNvdXJjZSgpLCBbXSwgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQXJlYXMoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc0Zyb21IYXNoKHNvdXJjZUhhc2gpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ibG9ja3NGcm9tSGFzaChhbnN3ZXJIYXNoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFkZSA9IHRoaXMuZ3JhZGVyLmdyYWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyYWRlID09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYW5zd2VyTGluZXMoKS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoKGVycikge1xuICAgICAgICAgICAgLy8gaWYgYW55dGhpbmcgZ29lcyB3cm9uZywganVzdCBpbml0aWFsaXplIGJhc2VkIG9uIHByb2JsZW0gc291cmNlXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgW10sIG9wdGlvbnMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlc3RvcmluZyBhbnN3ZXIgZm9yIHN0dWRlbnQgJHtkYXRhLnNpZH0gaW4gJHtkYXRhLmRpdl9pZH0uIERlZmF1bHRpbmcgdG8gb3JpZ2luYWwgc3RhdGUuYClcbiAgICAgICAgfVxuICAgICAgICAvLyBTdGFydCB0aGUgaW50ZXJmYWNlXG4gICAgICAgIGlmICh0aGlzLm5lZWRzUmVpbml0aWFsaXphdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpO1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIGJpdCBvZiBhIGhhY2sgdG8gZ2V0IHRoZSBibG9ja3MgdG8gYmUgaW4gdGhlIHJpZ2h0IHBsYWNlXG4gICAgICAgICAgICAvLyB3aGVuIHRoZSBwYWdlIGxvYWRzLiAgSXQgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGJsb2NrcyBhcmUgbm90XG4gICAgICAgICAgICAvLyB2aXNpYmxlIHdoZW4gdGhlIHBhZ2UgbG9hZHMsIHNvIHRoZSBzaXplIGlzIG9mZi4gIFRoaXMgZm9yY2VzXG4gICAgICAgICAgICAvLyBhIHJlYWxpZ25tZW50LlxuICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCAmJiAhdGhpcy5hc3Nlc3NtZW50VGFrZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0VmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFJldHVybiB3aGF0IGlzIHN0b3JlZCBpbiBsb2NhbCBzdG9yYWdlXG4gICAgbG9jYWxEYXRhKCkge1xuICAgICAgICB2YXIgZGF0YSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuc3RvcmFnZUlkKTtcbiAgICAgICAgaWYgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLmNoYXJBdCgwKSA9PSBcIntcIikge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICAgIC8vIFJ1bmVzdG9uZUJhc2U6IFNlbnQgd2hlbiB0aGUgc2VydmVyIGhhcyBkYXRhXG4gICAgcmVzdG9yZUFuc3dlcnMoc2VydmVyRGF0YSkge1xuICAgICAgICB0aGlzLmxvYWREYXRhKHNlcnZlckRhdGEpO1xuICAgIH1cbiAgICAvLyBSdW5lc3RvbmVCYXNlOiBMb2FkIHdoYXQgaXMgaW4gbG9jYWwgc3RvcmFnZVxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBsb2NhbERhdGEgPSB0aGlzLmxvY2FsRGF0YSgpO1xuICAgICAgICBpZiAobG9jYWxEYXRhLnRpbWVzdGFtcCAmJiBsb2NhbERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5zdG9yYWdlSWQpO1xuICAgICAgICAgICAgbG9jYWxEYXRhPSB7fTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvYWREYXRhKGxvY2FsRGF0YSk7XG4gICAgfVxuICAgIC8vIFJ1bmVzdG9uZUJhc2U6IFNldCB0aGUgc3RhdGUgb2YgdGhlIHByb2JsZW0gaW4gbG9jYWwgc3RvcmFnZVxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIHZhciB0b1N0b3JlO1xuICAgICAgICBpZiAoZGF0YSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRvU3RvcmUgPSB7XG4gICAgICAgICAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZUhhc2goKSxcbiAgICAgICAgICAgICAgICBhbnN3ZXI6IHRoaXMuYW5zd2VySGFzaCgpLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgYWRhcHRpdmVIYXNoID0gdGhpcy5hZGFwdGl2ZUhhc2goKTtcbiAgICAgICAgICAgIGlmIChhZGFwdGl2ZUhhc2gubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHRvU3RvcmUuYWRhcHRpdmUgPSBhZGFwdGl2ZUhhc2g7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b1N0b3JlID0gZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLnN0b3JhZ2VJZCwgSlNPTi5zdHJpbmdpZnkodG9TdG9yZSkpO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZVBsYWNlaG9sZGVycygpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciBpLCBoYXNOb3JtYWxCbG9jaztcbiAgICAgICAgICAgIHZhciBwbGFjZWhvbGRlcjtcbiAgICAgICAgICAgIC8vIGhpZGUgcGxhY2Vob2xkZXJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVja2luZyBvbiBwbGFjZWhvbGRlcnNcbiAgICAgICAgICAgICAgICBpZiAoYW5zd2VyQmxvY2tzW2ldLmlzUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGhhc05vcm1hbEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gMCAmJiAhYW5zd2VyQmxvY2tzW2kgLSAxXS5pc1NldHRsZWQgJiYgIWFuc3dlckJsb2Nrc1tpIC0gMV0uaXNQbGFjZWhvbGRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzTm9ybWFsQmxvY2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aCAtIDEgJiYgIWFuc3dlckJsb2Nrc1tpICsgMV0uaXNTZXR0bGVkICYmICFhbnN3ZXJCbG9ja3NbaSArIDFdLmlzUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhc05vcm1hbEJsb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzTm9ybWFsQmxvY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgcGxhY2Vob2xkZXIgaGFzIGEgbm9ybWFsIGJsb2NrIGJlZm9yZSBvciBhZnRlciwgaGlkZSBpdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJChwbGFjZWhvbGRlci52aWV3KS5oYXNDbGFzcygnaGlkZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChwbGFjZWhvbGRlci52aWV3KS5hZGRDbGFzcyhcImhpZGVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhbnN3ZXJCbG9ja3MubGVuZ3RoIC0gMSAtIGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5tb3ZlRG93bigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIDUpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICB2YXIgY29udGVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY29udGVudExlbmd0aCA8IGFuc3dlckJsb2Nrcy5sZW5ndGggJiYgISQoYW5zd2VyQmxvY2tzW2NvbnRlbnRMZW5ndGhdLnZpZXcpLmhhc0NsYXNzKCdoaWRlJykpIHtcbiAgICAgICAgICAgICAgICBjb250ZW50TGVuZ3RoKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBzaG93IHBsYWNlaG9sZGVyIHdoZW4gbmVlZGVkXG4gICAgICAgICAgICB2YXIgcHJldklzU2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAodGhpcy5maXJzdEJsb2NrU2V0dGxlZCkge1xuICAgICAgICAgICAgICAgIHByZXZJc1NldHRsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzZXR0bGVkQ291bnQgPSAwO1xuICAgICAgICAgICAgdmFyIGk7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY29udGVudExlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgLy8gbG9jYXRlIHR3byBjb25zZWN1dGl2ZSBzZXR0bGVkIGJsb2Nrc1xuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJCbG9ja3NbaV0uaXNTZXR0bGVkICYmIHByZXZJc1NldHRsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJCbG9ja3NbaV0uaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHByZXZJc1NldHRsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBzZXR0bGVkQ291bnQrKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmV2SXNTZXR0bGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHBsYWNlaG9sZGVyO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIChpIDwgY29udGVudExlbmd0aCkgfHwgXG4gICAgICAgICAgICAgICAgKGFuc3dlckJsb2Nrc1tjb250ZW50TGVuZ3RoIC0gMV0gJiYgYW5zd2VyQmxvY2tzW2NvbnRlbnRMZW5ndGggLSAxXS5pc1NldHRsZWQgJiYgIXRoaXMubGFzdEJsb2NrU2V0dGxlZClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIGxvb2tpbmcgZm9yIHRoZSBwbGFjZWhvbGRlciBibG9jayB0aGF0IHNob3VsZCBiZSBhZnRlciBcInNldHRsZWRDb3VudFwiIG51bWJlciBvZiBzZXR0bGVkIGJsb2NrcztcbiAgICAgICAgICAgICAgICB2YXIgcGxhY2Vob2xkZXJJbmRleDtcbiAgICAgICAgICAgICAgICBmb3IgKHBsYWNlaG9sZGVySW5kZXggPSBhbnN3ZXJCbG9ja3MubGVuZ3RoIC0gMTsgcGxhY2Vob2xkZXJJbmRleCA+PSBjb250ZW50TGVuZ3RoOyBwbGFjZWhvbGRlckluZGV4LS0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlckJsb2Nrc1twbGFjZWhvbGRlckluZGV4XS5hZnRlclNldHRsZWRCbG9ja0NvdW50ID09IHNldHRsZWRDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXIgPSBhbnN3ZXJCbG9ja3NbcGxhY2Vob2xkZXJJbmRleF07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYW5zd2VyQmxvY2tzW3BsYWNlaG9sZGVySW5kZXhdLmFmdGVyU2V0dGxlZEJsb2NrQ291bnQgIT0gc2V0dGxlZENvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZXJyb3IgbW92aW5nIHVwOyBubyBwbGFjZWhvbGRlciBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJChwbGFjZWhvbGRlci52aWV3KS5oYXNDbGFzcygnaGlkZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICQocGxhY2Vob2xkZXIudmlldykucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgYmUgbW92ZWQgcmlnaHQgYmVmb3JlIHRoZSBibG9jayBhbnN3ZXJCbG9ja3NbaV1cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwbGFjZWhvbGRlckluZGV4IC0gaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlci5tb3ZlVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTApO1xuICAgIH1cblxuXG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBMT0dHSU5HID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gTG9nIHRoZSBpbnRlcmFjdGlvbiB3aXRoIHRoZSBwcm9ibGVtIHRvIHRoZSBzZXJ2ZXI6XG4gICAgLy8gICBzdGFydDogdGhlIHVzZXIgc3RhcnRlZCBpbnRlcmFjdGluZyB3aXRoIHRoaXMgcHJvYmxlbVxuICAgIC8vICAgbW92ZTogdGhlIHVzZXIgbW92ZWQgYSBibG9jayB0byBhIG5ldyBwb3NpdGlvblxuICAgIC8vICAgcmVzZXQ6IHRoZSByZXNldCBidXR0b24gd2FzIHByZXNzZWRcbiAgICAvLyAgIHJlbW92ZURpc3RyYWN0b3I6IFwiSGVscCBNZVwiIHJlbW92ZWQgYSBkaXN0cmFjdG9yXG4gICAgLy8gICByZW1vdmVJbmRlbnRhdGlvbjogXCJIZWxwIE1lXCIgcmVtb3ZlZCBpbmRlbnRhdGlvblxuICAgIC8vICAgY29tYmluZUJsb2NrczogXCJIZWxwIE1lXCIgY29tYmluZWQgYmxvY2tzXG4gICAgbG9nTW92ZShhY3Rpdml0eSkge1xuICAgICAgICB2YXIgZXZlbnQgPSB7XG4gICAgICAgICAgICBldmVudDogXCJwYXJzb25zTW92ZVwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgc3RvcmFnZWlkOiBzdXBlci5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFjdCA9IGFjdGl2aXR5ICsgXCJ8XCIgKyB0aGlzLnNvdXJjZUhhc2goKSArIFwifFwiICsgdGhpcy5hbnN3ZXJIYXNoKCk7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICBpZiAoYWRhcHRpdmVIYXNoICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBhY3QgPSBhY3QgKyBcInxcIiArIGFkYXB0aXZlSGFzaDtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5hY3QgPSBhY3Q7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgLy8gTG9nIHRoZSBhbnN3ZXIgdG8gdGhlIHByb2JsZW1cbiAgICAvLyAgIGNvcnJlY3Q6IFRoZSBhbnN3ZXIgZ2l2ZW4gbWF0Y2hlcyB0aGUgc29sdXRpb25cbiAgICAvLyAgIGluY29ycmVjdCo6IFRoZSBhbnN3ZXIgaXMgd3JvbmcgZm9yIHZhcmlvdXMgcmVhc29uc1xuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIHZhciBldmVudCA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcInBhcnNvbnNcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGFuc3dlckhhc2ggPSB0aGlzLmFuc3dlckhhc2goKTtcbiAgICAgICAgZXZlbnQuYW5zd2VyID0gYW5zd2VySGFzaDtcbiAgICAgICAgdmFyIHNvdXJjZUhhc2ggPSB0aGlzLnNvdXJjZUhhc2goKTtcbiAgICAgICAgZXZlbnQuc291cmNlID0gc291cmNlSGFzaDtcbiAgICAgICAgdmFyIGFjdCA9IHNvdXJjZUhhc2ggKyBcInxcIiArIGFuc3dlckhhc2g7XG4gICAgICAgIHZhciBhZGFwdGl2ZUhhc2ggPSB0aGlzLmFkYXB0aXZlSGFzaCgpO1xuICAgICAgICBpZiAoYWRhcHRpdmVIYXNoICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBldmVudC5hZGFwdGl2ZSA9IGFkYXB0aXZlSGFzaDtcbiAgICAgICAgICAgIGFjdCA9IGFjdCArIFwifFwiICsgYWRhcHRpdmVIYXNoO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09IFwiY29ycmVjdFwiKSB7XG4gICAgICAgICAgICBhY3QgPSBcImNvcnJlY3R8XCIgKyBhY3Q7XG4gICAgICAgICAgICBldmVudC5jb3JyZWN0ID0gXCJUXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3QgPSBcImluY29ycmVjdHxcIiArIGFjdDtcbiAgICAgICAgICAgIGV2ZW50LmNvcnJlY3QgPSBcIkZcIjtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5hY3QgPSBhY3Q7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzaWQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGV2ZW50LnNpZCA9IHNpZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHRoaXMubG9nQm9va0V2ZW50KGV2ZW50KTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBBQ0NFU1NJTkcgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBhZGFwdGl2ZSBzdGF0ZVxuICAgIGFkYXB0aXZlSGFzaCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYWRhcHRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgaWYgKCFibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBoYXNoLnB1c2goXCJkXCIgKyBibG9jay5saW5lc1swXS5pbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubm9pbmRlbnQgIT09IHRoaXMub3B0aW9ucy5ub2luZGVudCkge1xuICAgICAgICAgICAgaGFzaC5wdXNoKFwiaVwiKTtcbiAgICAgICAgfVxuICAgICAgICBoYXNoLnB1c2goXCJjXCIgKyB0aGlzLmNoZWNrQ291bnQpO1xuICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQpIHtcbiAgICAgICAgICAgIGhhc2gucHVzaChcInNcIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBvcHRpb25zIGZvciBjcmVhdGluZyBibG9ja3MgYmFzZWQgb24gYSBoYXNoXG4gICAgb3B0aW9uc0Zyb21IYXNoKGhhc2gpIHtcbiAgICAgICAgdmFyIHNwbGl0O1xuICAgICAgICBpZiAoaGFzaCA9PT0gXCItXCIgfHwgaGFzaCA9PT0gXCJcIiB8fCBoYXNoID09PSBudWxsKSB7XG4gICAgICAgICAgICBzcGxpdCA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BsaXQgPSBoYXNoLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgICAgICB2YXIgZGlzYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGtleSA9IHNwbGl0W2ldO1xuICAgICAgICAgICAgaWYgKGtleVswXSA9PSBcImlcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJkXCIpIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZC5wdXNoKHBhcnNlSW50KGtleS5zbGljZSgxKSkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlbMF0gPT0gXCJzXCIpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmhhc1NvbHZlZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGtleVswXSA9PSBcImNcIikge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuY2hlY2tDb3VudCA9IHBhcnNlSW50KGtleS5zbGljZSgxKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRpc2FibGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBhbnN3ZXIgYXJlYVxuICAgIGFuc3dlckhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaC5wdXNoKGJsb2Nrc1tpXS5oYXNoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiLVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBoYXNoIG9mIHRoZSBzb3VyY2UgYXJlYVxuICAgIHNvdXJjZUhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gW107XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaGFzaC5wdXNoKGJsb2Nrc1tpXS5oYXNoKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChoYXNoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiLVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhhc2guam9pbihcIi1cIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gSW50ZXItcHJvYmxlbSBhZGFwdGl2ZSBjaGFuZ2VzXG4gICAgLy8gQmFzZWQgb24gdGhlIHJlY2VudEF0dGVtcHRzLCByZW1vdmUgZGlzdHJhY3RvcnMsIGFkZCBpbmRlbnQsIGNvbWJpbmUgYmxvY2tzXG4gICAgYWRhcHRCbG9ja3MoaW5wdXQpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgZGlzdHJhY3RvcnMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGlucHV0W2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmlzRGlzdHJhY3RvcigpKSB7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMucHVzaChibG9jayk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyBcInJlY2VudEF0dGVtcHRzXCJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVjZW50QXR0ZW1wdHMgPT0gXCJOYU5cIikge1xuICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0cyA9IDM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxhc3Rlc3RBdHRlbXB0Q291bnQgPSB0aGlzLnJlY2VudEF0dGVtcHRzO1xuICAgICAgICB2YXIgbkJsb2NrcyA9IGJsb2Nrcy5sZW5ndGg7XG4gICAgICAgIHZhciBuQmxvY2tzVG9Db21iaW5lID0gMDtcbiAgICAgICAgdmFyIG5EaXN0cmFjdG9ycyA9IGRpc3RyYWN0b3JzLmxlbmd0aDtcbiAgICAgICAgdmFyIG5Ub1JlbW92ZSA9IDA7XG4gICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgdmFyIGdpdmVJbmRlbnRhdGlvbiA9IGZhbHNlO1xuICAgICAgICBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDIpIHtcbiAgICAgICAgICAgIC8vIDEgVHJ5XG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5saW1pdERpc3RyYWN0b3JzID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDQpIHtcbiAgICAgICAgICAgIC8vIDItMyBUcmllc1xuICAgICAgICAgICAgLy8gRG8gbm90aGluZyB0aGV5IGFyZSBkb2luZyBub3JtYWxcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChsYXN0ZXN0QXR0ZW1wdENvdW50IDwgNikge1xuICAgICAgICAgICAgLy8gNC01IFRyaWVzXG4gICAgICAgICAgICAvLyBwYWlyIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICB0aGlzLnBhaXJEaXN0cmFjdG9ycyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAobGFzdGVzdEF0dGVtcHRDb3VudCA8IDgpIHtcbiAgICAgICAgICAgIC8vIDYtNyBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIDUwJSBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgblRvUmVtb3ZlID0gMC41ICogbkRpc3RyYWN0b3JzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gOCsgVHJpZXNcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgb2YgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICBlbHNlIGlmKGxhc3Rlc3RBdHRlbXB0Q291bnQgPCAxMikgeyAvLzEwLTExXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGRpc3RyYWN0b3JzIGFuZCBnaXZlIGluZGVudGF0aW9uXG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBnaXZlSW5kZW50YXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYobGFzdGVzdEF0dGVtcHRDb3VudCA8IDE0KSB7IC8vIDEyLTEzIFRyaWVzXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIG9mIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICAvLyBnaXZlIGluZGVudGF0aW9uXG4gICAgICAgICAgICAvLyByZWR1Y2UgcHJvYmxlbSB0byAzLzQgc2l6ZVxuICAgICAgICAgICAgZ2l2ZUluZGVudGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIG5Ub1JlbW92ZSA9IG5EaXN0cmFjdG9ycztcbiAgICAgICAgICAgIG5CbG9ja3NUb0NvbWJpbmUgPSAuMjUgKiBuQmxvY2tzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgeyAvLyA+PSAxNCBUcmllc1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBvZiBkaXN0cmFjdG9yc1xuICAgICAgICAgICAgLy8gZ2l2ZSBpbmRlbnRhdGlvblxuICAgICAgICAgICAgLy8gcmVkdWNlIHByb2JsZW0gdG8gMS8yIHNpemVcbiAgICAgICAgICAgIGdpdmVJbmRlbnRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICBuVG9SZW1vdmUgPSBuRGlzdHJhY3RvcnM7XG4gICAgICAgICAgICBuQmxvY2tzVG9Db21iaW5lID0gLjUgKiBuQmxvY2tzO1xuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIG5CbG9ja3NUb0NvbWJpbmUgPSBNYXRoLm1pbihuQmxvY2tzVG9Db21iaW5lLCBuQmxvY2tzIC0gMyk7XG4gICAgICAgIC8vIE5ldmVyIGNvbWJpbmUgc28gd2hlcmUgdGhlcmUgYXJlIGxlc3MgdGhhbiB0aHJlZSBibG9ja3MgbGVmdFxuICAgICAgICAvLyBSZW1vdmUgZGlzdHJhY3RvcnNcbiAgICAgICAgZGlzdHJhY3RvcnMgPSB0aGlzLnNodWZmbGVkKGRpc3RyYWN0b3JzKTtcbiAgICAgICAgZGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5zbGljZSgwLCBuVG9SZW1vdmUpO1xuICAgICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBpbnB1dFtpXTtcbiAgICAgICAgICAgIGlmICghYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChibG9jayk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCQuaW5BcnJheShibG9jaywgZGlzdHJhY3RvcnMpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vdmFyIG91dHB1dCA9IGlucHV0O1xuICAgICAgICBpZiAoZ2l2ZUluZGVudGF0aW9uKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG91dHB1dFtpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHRoaXMubm9pbmRlbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbWJpbmUgYmxvY2tzXG4gICAgICAgIHZhciBzb2x1dGlvbiA9IFtdO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBvdXRwdXQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAob3V0cHV0W2pdLmxpbmVzWzBdLmluZGV4ID09IGkpIHtcbiAgICAgICAgICAgICAgICAgICAgc29sdXRpb24ucHVzaChvdXRwdXRbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5CbG9ja3NUb0NvbWJpbmU7IGkrKykge1xuICAgICAgICAgICAgLy8gY29tYmluZSBvbmUgc2V0IG9mIGJsb2Nrc1xuICAgICAgICAgICAgdmFyIGJlc3QgPSAtMTA7XG4gICAgICAgICAgICB2YXIgY29tYmluZUluZGV4ID0gLTEwO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aCAtIDE7IGorKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gc29sdXRpb25bal07XG4gICAgICAgICAgICAgICAgdmFyIG5leHQgPSBzb2x1dGlvbltqICsgMV07XG4gICAgICAgICAgICAgICAgdmFyIHJhdGluZyA9IDEwIC0gYmxvY2subGluZXMubGVuZ3RoIC0gbmV4dC5saW5lcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrSW5kZW50ID0gYmxvY2subWluaW11bUxpbmVJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dEluZGVudCA9IG5leHQubWluaW11bUxpbmVJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tJbmRlbnQgPT0gbmV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmcgKz0gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJsb2NrSW5kZW50ID4gbmV4dEluZGVudCkge1xuICAgICAgICAgICAgICAgICAgICByYXRpbmcgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBibG9jay5saW5lc1tibG9jay5saW5lcy5sZW5ndGggLSAxXS5pbmRlbnQgPT1cbiAgICAgICAgICAgICAgICAgICAgbmV4dC5saW5lc1swXS5pbmRlbnRcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmF0aW5nICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyYXRpbmcgPj0gYmVzdCkge1xuICAgICAgICAgICAgICAgICAgICBiZXN0ID0gcmF0aW5nO1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lSW5kZXggPSBqO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsb2NrID0gc29sdXRpb25bY29tYmluZUluZGV4XTtcbiAgICAgICAgICAgIG5leHQgPSBzb2x1dGlvbltjb21iaW5lSW5kZXggKyAxXTtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBuZXh0LmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2suYWRkTGluZShuZXh0LmxpbmVzW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBuZXdTb2x1dGlvbiA9IFtdO1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGogIT09IGNvbWJpbmVJbmRleCArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3U29sdXRpb24ucHVzaChzb2x1dGlvbltqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHNvbHV0aW9uID0gbmV3U29sdXRpb247XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVvcmRlclxuICAgICAgICB2YXIgY29tYmluZWRPdXRwdXQgPSBbXTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IG91dHB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHNvbHV0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG91dHB1dFtpXS5saW5lc1swXS5pbmRleCA9PSBzb2x1dGlvbltqXS5saW5lc1swXS5pbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBjb21iaW5lZE91dHB1dC5wdXNoKHNvbHV0aW9uW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3V0cHV0O1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYW4gYXJyYXkgb2YgY29kZSBibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW1cbiAgICBibG9ja3NGcm9tU291cmNlKCkge1xuICAgICAgICB2YXIgdW5vcmRlcmVkQmxvY2tzID0gW107XG4gICAgICAgIHZhciBvcmlnaW5hbEJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2tzID0gW107XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICB2YXIgYmxvY2ssIGxpbmUsIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIC8vIENvZGVUYWlsb3I6IGRvIG5vdCBpbmNsdWRlIHBsYWNlIGhvbGRlciBvciBzZXR0bGVkIHNvbHV0aW9uIGxpbmVzIGluIHNvdXJjZSBibG9ja3NcbiAgICAgICAgICAgIGlmIChsaW5lLmlzUGxhY2Vob2xkZXJMaW5lIHx8IGxpbmUuaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaW5lcy5wdXNoKGxpbmUpO1xuICAgICAgICAgICAgaWYgKCFsaW5lLmdyb3VwV2l0aE5leHQpIHtcbiAgICAgICAgICAgICAgICB1bm9yZGVyZWRCbG9ja3MucHVzaChuZXcgUGFyc29uc0Jsb2NrKHRoaXMsIGxpbmVzKSk7XG4gICAgICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBvcmlnaW5hbEJsb2NrcyA9IHVub3JkZXJlZEJsb2NrcztcbiAgICAgICAgLy8gVHJpbSB0aGUgZGlzdHJhY3RvcnNcbiAgICAgICAgdmFyIHJlbW92ZWRCbG9ja3MgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5tYXhkaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBtYXhkaXN0ID0gdGhpcy5vcHRpb25zLm1heGRpc3Q7XG4gICAgICAgICAgICB2YXIgZGlzdHJhY3RvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB1bm9yZGVyZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHVub3JkZXJlZEJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICBkaXN0cmFjdG9ycy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWF4ZGlzdCA8IGRpc3RyYWN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRpc3RyYWN0b3JzID0gdGhpcy5zaHVmZmxlZChkaXN0cmFjdG9ycyk7XG4gICAgICAgICAgICAgICAgZGlzdHJhY3RvcnMgPSBkaXN0cmFjdG9ycy5zbGljZSgwLCBtYXhkaXN0KTtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdW5vcmRlcmVkQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2subGluZXNbMF0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShibG9jaywgZGlzdHJhY3RvcnMpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZWRCbG9ja3MucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrcy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1bm9yZGVyZWRCbG9ja3MgPSBibG9ja3M7XG4gICAgICAgICAgICAgICAgYmxvY2tzID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSwgc2V0IHRoZSBwYWlyRGlzdHJhY3RvcnMgdmFsdWUgYmVmb3JlIGJsb2NrcyBnZXQgc2h1ZmZsZWQgLSBXaWxsaWFtIExpIChBdWd1c3QgMjAyMClcbiAgICAgICAgaWYgKHRoaXMucmVjZW50QXR0ZW1wdHMgPCAyKSB7XG4gICAgICAgICAgICAvLyAxIFRyeVxuICAgICAgICAgICAgdGhpcy5wYWlyRGlzdHJhY3RvcnMgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMub3JkZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gU2h1ZmZsZSwgcmVzcGVjdGluZyBwYWlyZWQgZGlzdHJhY3RvcnNcbiAgICAgICAgICAgIHZhciBjaHVua3MgPSBbXSxcbiAgICAgICAgICAgICAgICBjaHVuayA9IFtdO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHVub3JkZXJlZEJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gdW5vcmRlcmVkQmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChibG9jay5saW5lc1swXS5wYWlyZWQgJiYgdGhpcy5wYWlyRGlzdHJhY3RvcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2lsbGlhbSBMaSAoQXVndXN0IDIwMjApXG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gW107XG4gICAgICAgICAgICAgICAgICAgIGNodW5rLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2h1bmtzID0gdGhpcy5zaHVmZmxlZChjaHVua3MpO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGNodW5rcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNodW5rID0gY2h1bmtzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChjaHVuay5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHNodWZmbGUgcGFpcmVkIGRpc3RyYWN0b3JzXG4gICAgICAgICAgICAgICAgICAgIGNodW5rID0gdGhpcy5zaHVmZmxlZChjaHVuayk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjaHVuay5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY2h1bmtbal0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2goY2h1bmtbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE9yZGVyIGFjY29yZGluZyB0byBvcmRlciBzcGVjaWZpZWRcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLm9wdGlvbnMub3JkZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IG9yaWdpbmFsQmxvY2tzW3RoaXMub3B0aW9ucy5vcmRlcltpXV07XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBibG9jayAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICAgICAgICAgICQuaW5BcnJheSh0aGlzLm9wdGlvbnMub3JkZXJbaV0sIHJlbW92ZWRCbG9ja3MpIDwgMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFpckRpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5saW1pdERpc3RyYWN0b3JzID0gdHJ1ZTtcbiAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuYWRhcHRCbG9ja3MoYmxvY2tzKTtcbiAgICAgICAgICAgIGlmICghdGhpcy5saW1pdERpc3RyYWN0b3JzKSB7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHJlbW92ZWRCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5vcmRlciA9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IE1hdGgucmFuZG9tKDAsIGJsb2Nrcy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAkLmluQXJyYXkocmVtb3ZlZEJsb2Nrc1tpXSwgdGhpcy5vcHRpb25zLm9yZGVyKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleCwgMCwgb3JpZ2luYWxCbG9ja3NbcmVtb3ZlZEJsb2Nrc1tpXV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYWlyRGlzdHJhY3RvcnMgJiYgdGhpcy5vcHRpb25zLm9yZGVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy9tb3ZlIHBhaXJzIHRvZ2V0aGVyXG4gICAgICAgICAgICAvL0dvIHRocm91Z2ggYXJyYXkgbG9va2luZyBmb3IgZGl0cmFjdG9yIGFuZCBpdHMgcGFpclxuICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IG9yaWdpbmFsQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEJsb2Nrc1tpXS5saW5lc1swXS5wYWlyZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgJC5pbkFycmF5KG9yaWdpbmFsQmxvY2tzW2ldLCBibG9ja3MpID49IDBcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGogPSBpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoJC5pbkFycmF5KG9yaWdpbmFsQmxvY2tzW2ogLSAxXSwgYmxvY2tzKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmQgdGhlIHBhaXJlZCBkaXN0cmFjdG9yIG9yIHNvbHV0aW9uIGJsb2NrIGl0IHdpbGwgYmUgbmV4dCB0b1xuICAgICAgICAgICAgICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleFRvID0gJC5pbkFycmF5KG9yaWdpbmFsQmxvY2tzW2ogLSAxXSwgYmxvY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4RnJvbSA9ICQuaW5BcnJheShvcmlnaW5hbEJsb2Nrc1tpXSwgYmxvY2tzKTtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnNwbGljZShpbmRleEZyb20sIDEpO1xuICAgICAgICAgICAgICAgICAgICBibG9ja3Muc3BsaWNlKGluZGV4VG8sIDAsIG9yaWdpbmFsQmxvY2tzW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgY29kZWJsb2NrIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGhhc2hcbiAgICBibG9ja0Zyb21IYXNoKGhhc2gpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gaGFzaC5zcGxpdChcIl9cIik7XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgbGluZXMucHVzaCh0aGlzLmxpbmVzW3NwbGl0W2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrID0gbmV3IFBhcnNvbnNCbG9jayh0aGlzLCBsaW5lcyk7XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBibG9jay5pbmRlbnQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2suaW5kZW50ID0gTnVtYmVyKHNwbGl0W3NwbGl0Lmxlbmd0aCAtIDFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgfVxuICAgIC8vIFJldHVybiBhbiBhcnJheSBvZiBjb2RlYmxvY2tzIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGhhc2hcbiAgICBibG9ja3NGcm9tSGFzaChoYXNoKSB7XG4gICAgICAgIHZhciBzcGxpdDtcbiAgICAgICAgaWYgKGhhc2ggPT09IFwiLVwiIHx8IGhhc2ggPT09IFwiXCIgfHwgaGFzaCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgc3BsaXQgPSBbXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNwbGl0ID0gaGFzaC5zcGxpdChcIi1cIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNwbGl0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9ja3MucHVzaCh0aGlzLmJsb2NrRnJvbUhhc2goc3BsaXRbaV0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmFkYXB0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5hZGFwdEJsb2NrcyhibG9ja3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvZGVUYWlsb3I6IFJldHVybiBhIGxpc3Qgb2YgYmxvY2tzIHdpdGggcGxhY2Vob2xkZXJzIHRoYXQgc2hvdWxkIGJlIHByb3ZpZGVkIGluIHRoZSBhbnN3ZXIgYXJlYS5cbiAgICBzZXR0bGVkQmxvY2tzRnJvbVNvdXJjZSgpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgbGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2Nrc0NvdW50ID0gMDtcbiAgICAgICAgdmFyIGxpbmUsIGk7XG4gICAgICAgIHZhciBzZXR0bGVkQmxvY2tzQmVmb3JlQ291bnQgPSAwO1xuICAgICAgICB2YXIgcHJldlNldHRsZWRCbG9jayA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIHByZXZQbGFjZWhvbGRlclNpemUgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICAgICBpZiAoIWxpbmUuZ3JvdXBXaXRoTmV4dCkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmlzUGxhY2Vob2xkZXJMaW5lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZvdW5kIGEgcGxhY2Vob2xkZXIgbGluZS4gYSBwbGFjZWhvbGRlciBsaW5lIGhhcyBhdCBsZWFzdCBvbmUgbm9ybWFsIGJsb2NrIGJlZm9yZSBpdC5cbiAgICAgICAgICAgICAgICAgICAgLy8gYWxzbyBhIHBsYWNlaG9sZGVyIGxpbmUgYWx3YXlzIGhhcyBcImdyb3VwV2l0aE5leHRcIiBmYWxzZS5cbiAgICAgICAgICAgICAgICAgICAgYmxvY2tzLnB1c2gobmV3IFBsYWNlaG9sZGVyQmxvY2sodGhpcywgbGluZXMsIGFuc3dlckJsb2Nrc0NvdW50LCBzZXR0bGVkQmxvY2tzQmVmb3JlQ291bnQpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBudW1iZXIgb2YgYmxvY2tzIG1pc3NpbmcgZm9yIHRoZSBzZXR0bGVkIGJsb2NrIGFib3ZlXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2U2V0dGxlZEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcmV2U2V0dGxlZEJsb2NrLnNldEJsb2Nrc0FmdGVyKGFuc3dlckJsb2Nrc0NvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHRoZSBjdXJyZW50IG51bWJlciBvZiBhbnN3ZXIgYmxvY2tzIHRvIHVwZGF0ZSB0aGUgdG9vbHRpcCBmb3IgdGhlIHNldHRsZWQgYmxvY2sgYmVsb3dcbiAgICAgICAgICAgICAgICAgICAgcHJldlBsYWNlaG9sZGVyU2l6ZSA9IGFuc3dlckJsb2Nrc0NvdW50O1xuICAgICAgICAgICAgICAgICAgICAvLyByZXNldCBhbnN3ZXIgYmxvY2sgY291bnRcbiAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzQ291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IFtdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGluZS5pc1NldHRsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maXJzdEJsb2NrU2V0dGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNldCA9IG5ldyBTZXR0bGVkQmxvY2sodGhpcywgbGluZXMpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubm9pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldC5pbmRlbnQgPSBsaW5lc1swXS5pbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzZXR0bGVkIGJsb2NrIHNldFwiLCBzZXQpO1xuICAgICAgICAgICAgICAgICAgICBibG9ja3MucHVzaChzZXQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocHJldlBsYWNlaG9sZGVyU2l6ZSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldC5zZXRCbG9ja3NCZWZvcmUocHJldlBsYWNlaG9sZGVyU2l6ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcHJldlNldHRsZWRCbG9jayA9IHNldDtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGxlZEJsb2Nrc0JlZm9yZUNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc0NvdW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWxpbmVzWzBdLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlckJsb2Nrc0NvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJsb2Nrcy5sZW5ndGggPiAwICYmIGJsb2Nrc1tibG9ja3MubGVuZ3RoIC0gMV0uaXNTZXR0bGVkKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RCbG9ja1NldHRsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZXR0bGVkYmxvY2tzZnJvbXNvdXJjZScsIGJsb2NrcylcbiAgICAgICAgcmV0dXJuIGJsb2NrcztcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBibG9jayBvYmplY3QgYnkgdGhlIGZ1bGwgaWQgaW5jbHVkaW5nIGlkIHByZWZpeFxuICAgIGdldEJsb2NrQnlJZChpZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay52aWV3LmlkID09IGlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIHRoYXQgYXJlIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uQmxvY2tzKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSBbXTtcbiAgICAgICAgdmFyIHNvbHV0aW9uTGluZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGluZXNbaV0uZGlzdHJhY3Rvcikge1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uTGluZXMucHVzaCh0aGlzLmxpbmVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgYmxvY2sgPSBzb2x1dGlvbkxpbmVzWzBdLmJsb2NrKCk7XG4gICAgICAgIHNvbHV0aW9uQmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHNvbHV0aW9uTGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuZXh0QmxvY2sgPSBzb2x1dGlvbkxpbmVzW2ldLmJsb2NrKCk7XG4gICAgICAgICAgICBpZiAoYmxvY2sgIT09IG5leHRCbG9jaykge1xuICAgICAgICAgICAgICAgIGJsb2NrID0gbmV4dEJsb2NrO1xuICAgICAgICAgICAgICAgIHNvbHV0aW9uQmxvY2tzLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb2x1dGlvbkJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGNvZGVibG9ja3MgYmFzZWQgb24gd2hhdCBpcyBpbiB0aGUgc291cmNlIGZpZWxkXG4gICAgc291cmNlQmxvY2tzKCkge1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gW107XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuc291cmNlQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgICAgIGlmICgkKGNoaWxkKS5oYXNDbGFzcyhcImJsb2NrXCIpKSB7XG4gICAgICAgICAgICAgICAgc291cmNlQmxvY2tzLnB1c2godGhpcy5nZXRCbG9ja0J5SWQoY2hpbGQuaWQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgZW5hYmxlZCBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIHNvdXJjZSBmaWVsZFxuICAgIGVuYWJsZWRTb3VyY2VCbG9ja3MoKSB7XG4gICAgICAgIHZhciBhbGwgPSB0aGlzLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICB2YXIgZW5hYmxlZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gYWxsW2ldO1xuICAgICAgICAgICAgaWYgKGJsb2NrLmVuYWJsZWQoKSkge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVuYWJsZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhcnJheSBvZiBjb2RlYmxvY2tzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIGFuc3dlciBmaWVsZFxuICAgIGFuc3dlckJsb2NrcygpIHtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IFtdO1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmFuc3dlckFyZWEuY2hpbGROb2RlcztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGJsb2NrID0gdGhpcy5nZXRCbG9ja0J5SWQoY2hpbGRyZW5baV0uaWQpO1xuICAgICAgICAgICAgaWYgKGJsb2NrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBhbnN3ZXJCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlckJsb2NrcztcbiAgICB9XG4gICAgLy8gUmV0dXJuIGFycmF5IG9mIGVuYWJsZWQgY29kZWJsb2NrcyBiYXNlZCBvbiB3aGF0IGlzIGluIHRoZSBhbnN3ZXIgZmllbGRcbiAgICBlbmFibGVkQW5zd2VyQmxvY2tzKCkge1xuICAgICAgICB2YXIgYWxsID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIGVuYWJsZWQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IGFsbFtpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5lbmFibGVkKCkpIHtcbiAgICAgICAgICAgICAgICBlbmFibGVkLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmFibGVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYXJyYXkgb2YgY29kZWxpbmVzIGJhc2VkIG9uIHdoYXQgaXMgaW4gdGhlIGFuc3dlciBmaWVsZFxuICAgIGFuc3dlckxpbmVzKCkge1xuICAgICAgICB2YXIgYW5zd2VyTGluZXMgPSBbXTtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoIWJsb2NrLmlzUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiBhZGRpbmcgbm9uIHBsYWNlaG9sZGVyIGJsb2NrXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBibG9jay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXJMaW5lcy5wdXNoKGJsb2NrLmxpbmVzW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuc3dlckxpbmVzO1xuICAgIH1cbiAgICAvLyBHbyB1cCB0aGUgaGllcmFyY2h5IHVudGlsIHlvdSBnZXQgdG8gYSBibG9jazsgcmV0dXJuIHRoYXQgYmxvY2sgZWxlbWVudFxuICAgIGdldEJsb2NrRm9yKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrID0gZWxlbWVudDtcbiAgICAgICAgd2hpbGUgKCFjaGVjay5jbGFzc0xpc3QuY29udGFpbnMoXCJibG9ja1wiKSkge1xuICAgICAgICAgICAgY2hlY2sgPSBjaGVjay5wYXJlbnRFbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGVjaztcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBtYXhpbXVtIGluZGVudCBmb3IgdGhlIHNvbHV0aW9uXG4gICAgc29sdXRpb25JbmRlbnQoKSB7XG4gICAgICAgIHZhciBpbmRlbnQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGVudCA9IE1hdGgubWF4KGluZGVudCwgYmxvY2suc29sdXRpb25JbmRlbnQoKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGVudDtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBBQ1RJT04gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gVGhlIFwiQ2hlY2sgTWVcIiBidXR0b24gd2FzIHByZXNzZWQuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBpZiAoIXRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQrKztcbiAgICAgICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRhcHRpdmVJZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgPSB0aGlzLnN0b3JhZ2VJZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRPRE8gLSByZW5kZXJpbmcgZmVlZGJhY2sgaXMgYnVyaWVkIGluIHRoZSBncmFkZXIuZ3JhZGUgbWV0aG9kLlxuICAgICAgICAgICAgLy8gdG8gZGlzYWJsZSBmZWVkYmFjayBzZXQgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrIGJvb2xlYW5cbiAgICAgICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5ncmFkZSA9IHRoaXMuZ3JhZGVyLmdyYWRlKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5ncmFkZSA9PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU29sdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgICAgICQodGhpcy5jaGVja0J1dHRvbikucHJvcChcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vIENvZGVUYWlsb3I6IG1ha2UgdGhlIENvcHkgQW5zd2VyIGJ1dHRvbiB2aXNpYmxlIHdoZW4gdGhlIHB1enpsZSBpcyBzb2x2ZWRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5oYXNTb2x2ZWQgJiYgdGhpcy5vcHRpb25zLnNjYWZmb2xkaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY29weS1hbnN3ZXItYnV0dG9uLSR7dGhpcy5kaXZpZH1gKTsgLy8gY29weS1hbnN3ZXItYnV0dG9uLSR7cHV6emxlU2NhZmZvbGRpbmdEaXZpZH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvcHlCdG4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlCdG4uY2xhc3NMaXN0LnJlbW92ZSgnY29weS1idXR0b24taGlkZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuYWRhcHRpdmVJZCArIFwiU29sdmVkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSB0aGlzLmNoZWNrQ291bnQ7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNlbnRBdHRlbXB0c1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgICAgICB0aGlzLmFkYXB0aXZlSWQgKyB0aGlzLmRpdmlkICsgXCJDb3VudFwiLFxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgICAgICAgICAvLyBpZiBub3Qgc29sdmVkIGFuZCBub3QgdG9vIHNob3J0IHRoZW4gY2hlY2sgaWYgc2hvdWxkIHByb3ZpZGUgaGVscFxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1NvbHZlZCAmJiB0aGlzLmdyYWRlICE9PSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jYW5IZWxwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG9ubHkgY291bnQgdGhlIGF0dGVtcHQgaWYgdGhlIGFuc3dlciBpcyBkaWZmZXJlbnQgKHRvIHByZXZlbnQgZ2FtaW5nKVxuICAgICAgICAgICAgICAgICAgICB2YXIgYW5zd2VySGFzaCA9IHRoaXMuYW5zd2VySGFzaCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0QW5zd2VySGFzaCAhPT0gYW5zd2VySGFzaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5udW1EaXN0aW5jdCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0QW5zd2VySGFzaCA9IGFuc3dlckhhc2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGltZSB0byBvZmZlciBoZWxwXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm51bURpc3RpbmN0ID09IDMgJiYgIXRoaXMuZ290SGVscCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJC5pMThuKFwibXNnX3BhcnNvbl9oZWxwX2luZm9cIikpO1xuICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZlxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIGNhbiBoZWxwXG4gICAgICAgICAgICB9IC8vIGVuZCBpZiBub3Qgc29sdmVkXG4gICAgICAgIH0gLy8gZW5kIG91dGVyIGlmIG5vdCBzb2x2ZWRcblxuICAgICAgICAvLyBpZiBub3cgb3IgcHJldmlvdXMgd2FzIGNvcnJlY3QsIGRpc3BsYXkgcnVubmFibGVcbiAgICAgICAgaWYgKHRoaXMuaGFzU29sdmVkICYmIHRoaXMub3B0aW9ucy5ydW5uYWJsZSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJ1bm5hYmxlRGl2KVxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVSdW5hYmxlVmVyc2lvbigpO1xuICAgICAgICAgICAgZWxzZSAvL3JldmVhbCBcInJlc2V0XCIgcnVubmFibGVcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bm5hYmxlRGl2LnN0eWxlLmRpc3BsYXkgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ29udmVyIHRoZSBwYXJzb25zLXJ1bm5hYmxlIGludG8gYW4gYWN0aXZlY29kZSBhbmQgZGlzcGxheSBpdFxuICAgIGdlbmVyYXRlUnVuYWJsZVZlcnNpb24oKSB7XG4gICAgICAgIHRoaXMucnVubmFibGVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdmlkICsgXCItcnVubmFibGVcIik7XG4gICAgICAgIHRoaXMucnVubmFibGVEaXYuc3R5bGUuZGlzcGxheSA9IG51bGw7XG5cbiAgICAgICAgbGV0IHBhcnNvbnNUZXh0ID0gJyc7XG4gICAgICAgIGZvciAobGV0IGIgb2YgdGhpcy5hbnN3ZXJCbG9ja3MoKSkge1xuICAgICAgICAgICAgZm9yIChsZXQgbCBvZiBiLmxpbmVzKSB7XG4gICAgICAgICAgICAgICAgcGFyc29uc1RleHQgKz0gJyAgICAnLnJlcGVhdChsLmluZGVudCkgKyBsLnRleHQgKyAnXFxuJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwYXJzb25zVGV4dCA9IHBhcnNvbnNUZXh0LnNsaWNlKDAsIC0xKTsgLy8gcmVtb3ZlIGxhc3QgbmV3bGluZVxuXG4gICAgICAgIGNvbnN0IHRleHRFbCA9IHRoaXMucnVubmFibGVEaXYucXVlcnlTZWxlY3RvcigndGV4dGFyZWEnKTtcbiAgICAgICAgdGV4dEVsLmlubmVySFRNTCA9IHRleHRFbC5pbm5lckhUTUwucmVwbGFjZSgnPT1QQVJTT05TQ09ERT09JywgcGFyc29uc1RleHQpO1xuXG4gICAgICAgIC8vIGRhdGEtY29tcG9uZW50PVwicGFyc29ucy1ydW5uYWJsZVwiIG1hcmtzIGl0IGFzIHdhaXRpbmcgdG8gYmUgdHVybmVkIGludG8gYW4gYWN0aXZlY29kZVxuICAgICAgICBjb25zdCBhY3RpdmVDb2RlVG9CZSA9IHRoaXMucnVubmFibGVEaXYucXVlcnlTZWxlY3RvcignW2RhdGEtY29tcG9uZW50PVwicGFyc29ucy1ydW5uYWJsZVwiXScpO1xuICAgICAgICBhY3RpdmVDb2RlVG9CZS5kYXRhc2V0LmNvbXBvbmVudCA9ICdhY3RpdmVjb2RlJztcblxuICAgICAgICB3aW5kb3cucnVuZXN0b25lQ29tcG9uZW50cy5yZW5kZXJPbmVDb21wb25lbnQodGhpcy5ydW5uYWJsZURpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuZ3JhZGVyLnNob3dmZWVkYmFjayA9IHRydWU7XG4gICAgICAgIHRoaXMuZ3JhZGUgPSB0aGlzLmdyYWRlci5ncmFkZXJTdGF0ZTtcbiAgICAgICAgdmFyIGZlZWRiYWNrQXJlYTtcbiAgICAgICAgdmFyIGFuc3dlckFyZWEgPSAkKHRoaXMuYW5zd2VyQXJlYSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2hvd2ZlZWRiYWNrID09PSB0cnVlKSB7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEgPSAkKHRoaXMubWVzc2FnZURpdik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmZWVkYmFja0FyZWEgPSAkKFwiI2RvZXNub3RleGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmdyYWRlID09PSBcImNvcnJlY3RcIikge1xuICAgICAgICAgICAgYW5zd2VyQXJlYS5hZGRDbGFzcyhcImNvcnJlY3RcIik7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9IHRoaXMuY2hlY2tDb3VudCA+IDFcbiAgICAgICAgICAgICAgICA/ICQuaTE4bihcIm1zZ19wYXJzb25fY29ycmVjdFwiLCB0aGlzLmNoZWNrQ291bnQpXG4gICAgICAgICAgICAgICAgOiAkLmkxOG4oXCJtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5XCIpO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ydW5uYWJsZSlcbiAgICAgICAgICAgICAgICBtZXNzYWdlICs9IFwiIFwiICsgJC5pMThuKFwibXNnX3BhcnNvbl9jb3JyZWN0X3J1bm5hYmxlXCIpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwobWVzc2FnZSk7XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAvLyBTaG93IGJsb2NrIGV4cGxhbmF0aW9ucyBhZnRlciBzb2x2aW5nXG4gICAgICAgICAgICB0aGlzLnNob3dCbG9ja0V4cGxhbmF0aW9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiaW5jb3JyZWN0VG9vU2hvcnRcIikge1xuICAgICAgICAgICAgLy8gdG9vIGxpdHRsZSBjb2RlXG4gICAgICAgICAgICBhbnN3ZXJBcmVhLmFkZENsYXNzKFwiaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1kYW5nZXJcIik7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX3Rvb19zaG9ydFwiKSk7XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ncmFkZSA9PT0gXCJpbmNvcnJlY3RJbmRlbnRcIikge1xuICAgICAgICAgICAgdmFyIGluY29ycmVjdEJsb2NrcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdyYWRlci5pbmRlbnRMZWZ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYmxvY2sgPSB0aGlzLmdyYWRlci5pbmRlbnRMZWZ0W2ldLmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmNvcnJlY3RCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRMZWZ0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ncmFkZXIuaW5kZW50UmlnaHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBibG9jayA9IHRoaXMuZ3JhZGVyLmluZGVudFJpZ2h0W2ldLmJsb2NrKCk7XG4gICAgICAgICAgICAgICAgaWYgKGluY29ycmVjdEJsb2Nrcy5pbmRleE9mKGJsb2NrKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbmNvcnJlY3RCbG9ja3MucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRSaWdodFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpbmNvcnJlY3RCbG9ja3MubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl93cm9uZ19pbmRlbnRcIikpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fd3JvbmdfaW5kZW50c1wiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZ3JhZGUgPT09IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiKSB7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciBpblNvbHV0aW9uID0gW107XG4gICAgICAgICAgICB2YXIgaW5Tb2x1dGlvbkluZGV4ZXMgPSBbXTtcbiAgICAgICAgICAgIHZhciBub3RJblNvbHV0aW9uID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnNvbHV0aW9uLmluZGV4T2YoYmxvY2subGluZXNbMF0pO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBub3RJblNvbHV0aW9uLnB1c2goYmxvY2spO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluU29sdXRpb24ucHVzaChibG9jayk7XG4gICAgICAgICAgICAgICAgICAgIGluU29sdXRpb25JbmRleGVzLnB1c2goaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBsaXNJbmRleGVzID0gdGhpcy5ncmFkZXIuaW52ZXJzZUxJU0luZGljZXMoXG4gICAgICAgICAgICAgICAgaW5Tb2x1dGlvbkluZGV4ZXMsXG4gICAgICAgICAgICAgICAgaW5Tb2x1dGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG5vdEluU29sdXRpb24ucHVzaChpblNvbHV0aW9uW2xpc0luZGV4ZXNbaV1dKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFuc3dlckFyZWEuYWRkQ2xhc3MoXCJpbmNvcnJlY3RcIik7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3dmZWVkYmFjayA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm90SW5Tb2x1dGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAkKG5vdEluU29sdXRpb25baV0udmlldykuYWRkQ2xhc3MoXCJpbmNvcnJlY3RQb3NpdGlvblwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBmZWVkYmFja0FyZWEuaHRtbCgkLmkxOG4oXCJtc2dfcGFyc29uX3dyb25nX29yZGVyXCIpKTtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNob3cgZXhwbGFuYXRpb25zIGZvciBibG9ja3MgYWZ0ZXIgdGhlIHN0dWRlbnQgc29sdmVzIHRoZSBleGVyY2lzZVxuICAgIC8vIFVzZXMgdGhlIHNhbWUgdG9vbHRpcCBtZWNoYW5pc20gYXMgZGlzdHJhY3RvciBoZWxwIHRleHQgKGhvdmVyIHRvIHNlZSlcbiAgICBzaG93QmxvY2tFeHBsYW5hdGlvbnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5ibG9ja0V4cGxhbmF0aW9ucyB8fCBPYmplY3Qua2V5cyh0aGlzLmJsb2NrRXhwbGFuYXRpb25zKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhpZGVCbG9ja0V4cGxhbmF0aW9ucygpOyAvLyBjbGVhciBhbnkgcHJldmlvdXNcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYW5zd2VyQmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBhbnN3ZXJCbG9ja3NbaV07XG4gICAgICAgICAgICB2YXIgYmxvY2tJbmRleCA9IGJsb2NrLmxpbmVzWzBdLmluZGV4O1xuICAgICAgICAgICAgLy8gVGhlIGV4cGxhbmF0aW9uIG1hcCBrZXlzIGFyZSBibG9jayBpbmRpY2VzIGFzIHRoZXkgYXBwZWFyIGluIHRoZSBvcmlnaW5hbCBzb3VyY2VcbiAgICAgICAgICAgIC8vIFRyeSBtYXRjaGluZyBieSB0aGUgYmxvY2sncyBmaXJzdCBsaW5lIGluZGV4IGluIHRoZSBvcmlnaW5hbCBvcmRlclxuICAgICAgICAgICAgdmFyIGV4cGxhbmF0aW9uID0gdGhpcy5ibG9ja0V4cGxhbmF0aW9uc1tTdHJpbmcoYmxvY2tJbmRleCldO1xuICAgICAgICAgICAgaWYgKCFleHBsYW5hdGlvbikge1xuICAgICAgICAgICAgICAgIC8vIEFsc28gdHJ5IGJ5IHBvc2l0aW9uIGluIHRoZSBhbnN3ZXIgYXJlYVxuICAgICAgICAgICAgICAgIGV4cGxhbmF0aW9uID0gdGhpcy5ibG9ja0V4cGxhbmF0aW9uc1tTdHJpbmcoaSldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGV4cGxhbmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSBzYW1lIHRvb2x0aXAgYXBwcm9hY2ggYXMgZGlzdHJhY3RvcnM6XG4gICAgICAgICAgICAgICAgLy8gc2V0IGRhdGEtdG9nZ2xlPVwidG9vbHRpcFwiIGFuZCB0aXRsZSBhdHRyaWJ1dGUgZm9yIGhvdmVyIGRpc3BsYXlcbiAgICAgICAgICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcImRhdGEtdG9nZ2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcInRpdGxlXCIsIGV4cGxhbmF0aW9uKTtcbiAgICAgICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFkZENsYXNzKFwiaGFzLWV4cGxhbmF0aW9uXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFsbCBibG9jayBleHBsYW5hdGlvbnMgKHRvb2x0aXAgYXR0cmlidXRlcylcbiAgICBoaWRlQmxvY2tFeHBsYW5hdGlvbnMoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSAkKHRoaXMuYW5zd2VyQXJlYSkuZmluZChcIi5oYXMtZXhwbGFuYXRpb25cIik7XG4gICAgICAgIGJsb2Nrcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS10b2dnbGVcIik7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZShcInRpdGxlXCIpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyaWJ1dGUoXCJkYXRhLW9yaWdpbmFsLXRpdGxlXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgYmxvY2tzLnJlbW92ZUNsYXNzKFwiaGFzLWV4cGxhbmF0aW9uXCIpO1xuICAgIH1cblxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gQURBUFRJVkUgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIEluaXRpYWxpemUgdGhpcyBwcm9ibGVtIGFzIGFkYXB0aXZlXG4gICAgLy8gICAgaGVscENvdW50ID0gbnVtYmVyIG9mIGNoZWNrcyBiZWZvcmUgaGVscCBpcyBnaXZlbiAobmVnYXRpdmUpXG4gICAgLy8gICAgY2FuSGVscCA9IGJvb2xlYW4gYXMgdG8gd2hldGhlciBoZWxwIGNhbiBiZSBwcm92aWRlZFxuICAgIC8vICAgIGNoZWNrQ291bnQgPSBob3cgbWFueSB0aW1lcyBpdCBoYXMgYmVlbiBjaGVja2VkIGJlZm9yZSBjb3JyZWN0XG4gICAgLy8gICAgdXNlclJhdGluZyA9IDAuLjEwMCBob3cgZ29vZCB0aGUgcGVyc29uIGlzIGF0IHNvbHZpbmcgcHJvYmxlbXNcbiAgICBpbml0aWFsaXplQWRhcHRpdmUoKSB7XG4gICAgICAgIHRoaXMuYWRhcHRpdmVJZCA9IHN1cGVyLmxvY2FsU3RvcmFnZUtleSgpO1xuICAgICAgICB0aGlzLmNhbkhlbHAgPSB0cnVlO1xuICAgICAgICAvL3RoaXMuaGVscENvdW50ID0gLTM7IC8vIE51bWJlciBvZiBjaGVja3MgYmVmb3JlIGhlbHAgaXMgb2ZmZXJlZFxuICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICB0aGlzLm51bURpc3RpbmN0ID0gMDsgLy8gbnVtYmVyIG9mIGRpc3RpbmN0IHNvbHV0aW9uIGF0dGVtcHRzIChkaWZmZXJlbnQgZnJvbSBwcmV2aW91cylcbiAgICAgICAgdGhpcy5nb3RIZWxwID0gZmFsc2U7XG4gICAgICAgIC8vIEluaXRpYWxpemUgdGhlIHVzZXJSYXRpbmdcbiAgICAgICAgdmFyIHN0b3JhZ2VQcm9ibGVtID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIpO1xuICAgICAgICBpZiAoc3RvcmFnZVByb2JsZW0gPT0gdGhpcy5kaXZpZCkge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBpbiB0aGlzIHByb2JsZW1cbiAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFxuICAgICAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAodGhpcy5jaGVja0NvdW50ID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb3VudCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgY291bnQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGNvdW50ID09IHVuZGVmaW5lZCB8fCBjb3VudCA9PSBcIk5hTlwiKSB7XG4gICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0NvdW50ID0gY291bnQ7XG4gICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIlxuICAgICAgICApO1xuICAgICAgICBpZiAodGhpcy5yZWNlbnRBdHRlbXB0cyA9PSB1bmRlZmluZWQgfHwgdGhpcy5yZWNlbnRBdHRlbXB0cyA9PSBcIk5hTlwiKSB7XG4gICAgICAgICAgICB0aGlzLnJlY2VudEF0dGVtcHRzID0gMztcbiAgICAgICAgfVxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIFwicmVjZW50QXR0ZW1wdHNcIixcbiAgICAgICAgICAgIHRoaXMucmVjZW50QXR0ZW1wdHNcbiAgICAgICAgKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIsIHRoaXMuZGl2aWQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMuYWRhcHRpdmVJZCArIHRoaXMuZGl2aWQgKyBcIkNvdW50XCIsXG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnRcbiAgICAgICAgKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJTb2x2ZWRcIiwgZmFsc2UpO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gYSBib29sZWFuIG9mIHdoZXRoZXIgdGhlIHVzZXIgbXVzdCBkZWFsIHdpdGggaW5kZW50YXRpb25cbiAgICB1c2VzSW5kZW50YXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLm5vaW5kZW50IHx8IHRoaXMuc29sdXRpb25JbmRlbnQoKSA9PSAwKSB7XG4gICAgICAgICAgICAvLyB3YXMgJCh0aGlzLmFuc3dlckFyZWEpLmhhc0NsYXNzKFwiYW5zd2VyXCIpIC0gYmplIGNoYW5nZWRcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEZpbmQgYSBkaXN0cmFjdG9yIHRvIHJlbW92ZSB0byBtYWtlIHRoZSBwcm9ibGVtIGVhc2llclxuICAgIC8vICAqIHRyeSBmaXJzdCBpbiB0aGUgYW5zd2VyIGFyZWFcbiAgICAvLyAgKiBpZiBub3QsIHRyeSB0aGUgc291cmNlIGFyZWFcbiAgICAvLyAgKiBpZiBub3QsIHJldHVybiB1bmRlZmluZWRcbiAgICBkaXN0cmFjdG9yVG9SZW1vdmUoKSB7XG4gICAgICAgIHZhciBibG9ja3MgPSB0aGlzLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIGJsb2NrO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2suaXNEaXN0cmFjdG9yKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2tzID0gdGhpcy5lbmFibGVkU291cmNlQmxvY2tzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBibG9jayA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChibG9jay5pc0Rpc3RyYWN0b3IoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIG51bWJlciBvZiBibG9ja3MgdGhhdCBleGlzdFxuICAgIG51bWJlck9mQmxvY2tzKGZJbmNsdWRlRGlzdHJhY3RvcnMgPSB0cnVlKSB7XG4gICAgICAgIHZhciBudW1iZXJPZkJsb2NrcyA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2Nrc1tpXS5lbmFibGVkKCkgJiZcbiAgICAgICAgICAgICAgICAoZkluY2x1ZGVEaXN0cmFjdG9ycyB8fCAhdGhpcy5ibG9ja3NbaV0uaXNEaXN0cmFjdG9yKCkpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBudW1iZXJPZkJsb2NrcyArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudW1iZXJPZkJsb2NrcztcbiAgICB9XG4gICAgLy8gUmVtb3ZlIHRoaXMgZGlzdHJhY3RvcnMgdG8gbWFrZSB0aGUgcHJvYmxlbSBlYXNpZXJcbiAgICByZW1vdmVEaXN0cmFjdG9yKGJsb2NrKSB7XG4gICAgICAgIC8vIEFsZXJ0IHRoZSB1c2VyIHRvIHdoYXQgaXMgaGFwcGVuaW5nXG4gICAgICAgIHZhciBmZWVkYmFja0FyZWEgPSAkKHRoaXMubWVzc2FnZURpdik7XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fbm90X3NvbHV0aW9uXCIpKTtcbiAgICAgICAgfSwgMTApO1xuICAgICAgICAvLyBTdG9wIGFiaWxpdHkgdG8gc2VsZWN0XG4gICAgICAgIGlmIChibG9jay5saW5lc1swXS5kaXN0cmFjdEhlbHB0ZXh0KSB7XG4gICAgICAgICAgICBibG9jay52aWV3LnNldEF0dHJpYnV0ZShcImRhdGEtdG9nZ2xlXCIsIFwidG9vbHRpcFwiKTtcbiAgICAgICAgICAgIGJsb2NrLnZpZXcuc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgYmxvY2subGluZXNbMF0uZGlzdHJhY3RIZWxwdGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgYmxvY2suZGlzYWJsZSgpO1xuICAgICAgICAvLyBJZiBpbiBhbnN3ZXIgYXJlYSwgbW92ZSB0byBzb3VyY2UgYXJlYVxuICAgICAgICBpZiAoIWJsb2NrLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlUmVjdCA9IHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHZhciBzdGFydFggPSBibG9jay5wYWdlWENlbnRlcigpIC0gMTtcbiAgICAgICAgICAgIHZhciBzdGFydFkgPSBibG9jay5wYWdlWUNlbnRlcigpO1xuICAgICAgICAgICAgdmFyIGVuZFggPVxuICAgICAgICAgICAgICAgIHNvdXJjZVJlY3QubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCArIHNvdXJjZVJlY3Qud2lkdGggLyAyO1xuICAgICAgICAgICAgdmFyIGVuZFkgPVxuICAgICAgICAgICAgICAgIHNvdXJjZVJlY3QudG9wICtcbiAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQgK1xuICAgICAgICAgICAgICAgIGJsb2NrLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIHZhciBzbGlkZVVuZGVyQmxvY2sgPSBibG9jay5zbGlkZVVuZGVyQmxvY2soKTtcbiAgICAgICAgICAgIGlmIChzbGlkZVVuZGVyQmxvY2sgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGVuZFkgKz1cbiAgICAgICAgICAgICAgICAgICAgc2xpZGVVbmRlckJsb2NrLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgMjA7XG4gICAgICAgICAgICAgICAgZW5kWSArPSBwYXJzZUludCgkKHNsaWRlVW5kZXJCbG9jay52aWV3KS5jc3MoXCJ0b3BcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgJChibG9jay52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiIzAwMFwiLFxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMS4wLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjpcbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGguc3FydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLnBvdyhlbmRZIC0gc3RhcnRZLCAyKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5wb3coZW5kWCAtIHN0YXJ0WCwgMilcbiAgICAgICAgICAgICAgICAgICAgICAgICkgKlxuICAgICAgICAgICAgICAgICAgICAgICAgNCArXG4gICAgICAgICAgICAgICAgICAgICAgICA1MDAsXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZyA9IGJsb2NrO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdYID0gc3RhcnRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdZID0gc3RhcnRZO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzOiBmdW5jdGlvbiAoYSwgcCwgYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdYID0gc3RhcnRYICogKDEgLSBwKSArIGVuZFggKiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmdZID0gc3RhcnRZICogKDEgLSBwKSArIGVuZFkgKiBwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3Zpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3ZpbmdYO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoYXQubW92aW5nWTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQudXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC4zLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjMDAwXCIsXG4gICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKGJsb2NrLnZpZXcpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjMsXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMDAwLFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEdpdmUgdGhlIHVzZXIgdGhlIGluZGVudGF0aW9uXG4gICAgcmVtb3ZlSW5kZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEFsZXJ0IHRoZSB1c2VyIHRvIHdoYXQgaXMgaGFwcGVuaW5nXG4gICAgICAgIHZhciBmZWVkYmFja0FyZWEgPSAkKHRoaXMubWVzc2FnZURpdik7XG4gICAgICAgIHRoaXMubWVzc2FnZURpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIGZlZWRiYWNrQXJlYS5hdHRyKFwiY2xhc3NcIiwgXCJhbGVydCBhbGVydC1pbmZvXCIpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGZlZWRiYWNrQXJlYS5odG1sKCQuaTE4bihcIm1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50XCIpKTtcbiAgICAgICAgfSwgMTApO1xuICAgICAgICAvLyBNb3ZlIGFuZCByZXNpemUgYmxvY2tzXG4gICAgICAgIHZhciBibG9ja1dpZHRoID0gMjAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIHZhciBleHBhbmRlZFdpZHRoID1cbiAgICAgICAgICAgICAgICBsaW5lLndpZHRoICsgbGluZS5pbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICsgMzA7XG4gICAgICAgICAgICBibG9ja1dpZHRoID0gTWF0aC5tYXgoYmxvY2tXaWR0aCwgZXhwYW5kZWRXaWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5udW1iZXJlZCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJsb2NrV2lkdGggKz0gMjU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hcmVhV2lkdGggPSBibG9ja1dpZHRoICsgMjI7XG4gICAgICAgIHZhciBibG9jaywgaW5kZW50O1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5hbmltYXRlKFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja1dpZHRoIC0gaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGFkZGluZy1sZWZ0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCArIDEwLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnBhaXJlZERpdnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICQodGhpcy5wYWlyZWREaXZzW2ldKS5hbmltYXRlKFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJsb2NrV2lkdGggKyAzNCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gYW5zd2VyQmxvY2tzW2ldO1xuICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suc29sdXRpb25JbmRlbnQoKTtcbiAgICAgICAgICAgIGlmIChpbmRlbnQgPT0gMCkge1xuICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBibG9ja1dpZHRoLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrV2lkdGggLSBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nLWxlZnRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50ICsgMTAsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBSZXNpemUgYW5zd2VyIGFuZCBzb3VyY2UgYXJlYVxuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkucmVtb3ZlQ2xhc3MoXCJhbnN3ZXIxIGFuc3dlcjIgYW5zd2VyMyBhbnN3ZXI0XCIpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYWRkQ2xhc3MoXCJhbnN3ZXJcIik7XG4gICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgdGhpcy5ub2luZGVudCA9IHRydWU7XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5hbmltYXRlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLmFyZWFXaWR0aCArIDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYW5pbWF0ZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5hcmVhV2lkdGggKyAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgLy8gQ2hhbmdlIHRoZSBtb2RlbCAod2l0aCB2aWV3KVxuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYW5pbWF0ZShcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLjAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMTAwLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbW9kZWxcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUJsb2Nrc1tpXS5hZGRJbmRlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzW2ldLmFkZEluZGVudCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBmaXJzdCBjaGVjayBpZiBhbnkgc29sdXRpb24gYmxvY2tzIGFyZSBpbiB0aGUgc291cmNlIHN0aWxsIChsZWZ0IHNpZGUpIGFuZCBub3RcbiAgICAvLyBpbiB0aGUgYW5zd2VyXG4gICAgZ2V0U29sdXRpb25CbG9ja0luU291cmNlKCkge1xuICAgICAgICB2YXIgc29sdXRpb25CbG9ja3MgPSB0aGlzLnNvbHV0aW9uQmxvY2tzKCk7XG4gICAgICAgIHZhciBhbnN3ZXJCbG9ja3MgPSB0aGlzLmFuc3dlckJsb2NrcygpO1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgdmFyIHNvbEJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGN1cnJCbG9jayA9IG51bGw7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHNvdXJjZUJsb2NrcyBhbmQgcmV0dXJuIGEgYmxvY2sgaWYgaXQgaXMgbm90IGluIHRoZSBzb2x1dGlvblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBjdXJyZW50IGJsb2NrIGZyb20gdGhlIHNvdXJjZVxuICAgICAgICAgICAgY3VyckJsb2NrID0gc291cmNlQmxvY2tzW2ldO1xuXG4gICAgICAgICAgICAvLyBpZiBjdXJyQmxvY2sgaXMgaW4gdGhlIHNvbHV0aW9uIGFuZCBpc24ndCB0aGUgZmlyc3QgYmxvY2sgYW5kIGlzbid0IGluIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBzb2x1dGlvbkJsb2Nrcy5pbmRleE9mKGN1cnJCbG9jaykgPiAwICYmXG4gICAgICAgICAgICAgICAgYW5zd2VyQmxvY2tzLmluZGV4T2YoY3VyckJsb2NrKSA8IDBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyQmxvY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGlkbid0IGZpbmQgYW55IGJsb2NrIGluIHRoZSBzb3VyY2UgdGhhdCBpcyBpbiB0aGUgc29sdXRpb25cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gRmluZCBhIGJsb2NrMiB0aGF0IGlzIGZ1cnRoZXN0IGZyb20gYmxvY2sxIGluIHRoZSBhbnN3ZXJcbiAgICAvLyBkb24ndCB1c2UgdGhlIHZlcnkgZmlyc3QgYmxvY2sgaW4gdGhlIHNvbHV0aW9uIGFzIGJsb2NrMlxuICAgIGdldEZ1cnRoZXN0QmxvY2soKSB7XG4gICAgICAgIHZhciBzb2x1dGlvbkJsb2NrcyA9IHRoaXMuc29sdXRpb25CbG9ja3MoKTtcbiAgICAgICAgdmFyIGFuc3dlckJsb2NrcyA9IHRoaXMuYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgIHZhciBtYXhEaXN0ID0gMDtcbiAgICAgICAgdmFyIGRpc3QgPSAwO1xuICAgICAgICB2YXIgbWF4QmxvY2sgPSBudWxsO1xuICAgICAgICB2YXIgY3VyckJsb2NrID0gbnVsbDtcbiAgICAgICAgdmFyIGluZGV4U29sID0gMDtcbiAgICAgICAgdmFyIHByZXZCbG9jayA9IG51bGw7XG4gICAgICAgIHZhciBpbmRleFByZXYgPSAwO1xuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYmxvY2tzIGluIHRoZSBhbnN3ZXJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGN1cnJCbG9jayA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGluZGV4U29sID0gc29sdXRpb25CbG9ja3MuaW5kZXhPZihjdXJyQmxvY2spO1xuICAgICAgICAgICAgaWYgKGluZGV4U29sID4gMCkge1xuICAgICAgICAgICAgICAgIHByZXZCbG9jayA9IHNvbHV0aW9uQmxvY2tzW2luZGV4U29sIC0gMV07XG4gICAgICAgICAgICAgICAgaW5kZXhQcmV2ID0gYW5zd2VyQmxvY2tzLmluZGV4T2YocHJldkJsb2NrKTtcbiAgICAgICAgICAgICAgICAvL2FsZXJ0KFwibXkgaW5kZXggXCIgKyBpICsgXCIgaW5kZXggcHJldiBcIiArIGluZGV4UHJldik7XG5cbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIGRpc3RhbmNlIGluIHRoZSBhbnN3ZXJcbiAgICAgICAgICAgICAgICBkaXN0ID0gTWF0aC5hYnMoaSAtIGluZGV4UHJldik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPiBtYXhEaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG1heERpc3QgPSBkaXN0O1xuICAgICAgICAgICAgICAgICAgICBtYXhCbG9jayA9IGN1cnJCbG9jaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1heEJsb2NrO1xuICAgIH1cblxuICAgIC8vIENvbWJpbmUgYmxvY2tzIHRvZ2V0aGVyXG4gICAgY29tYmluZUJsb2NrcygpIHtcbiAgICAgICAgdmFyIHNvbHV0aW9uQmxvY2tzID0gdGhpcy5zb2x1dGlvbkJsb2NrcygpO1xuICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgdmFyIHNvdXJjZUJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzKCk7XG5cbiAgICAgICAgLy8gQWxlcnQgdGhlIHVzZXIgdG8gd2hhdCBpcyBoYXBwZW5pbmdcbiAgICAgICAgdmFyIGZlZWRiYWNrQXJlYSA9ICQodGhpcy5tZXNzYWdlRGl2KTtcbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcbiAgICAgICAgZmVlZGJhY2tBcmVhLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZmVlZGJhY2tBcmVhLmh0bWwoJC5pMThuKFwibXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3NcIikpO1xuICAgICAgICB9LCAxMCk7XG4gICAgICAgIHZhciBibG9jazEgPSBudWxsO1xuICAgICAgICB2YXIgYmxvY2syID0gbnVsbDtcblxuICAgICAgICAvLyBnZXQgYSBzb2x1dGlvbiBibG9jayB0aGF0IGlzIHN0aWxsIGluIHNvdXJjZSAobm90IGFuc3dlciksIGlmIGFueVxuICAgICAgICBibG9jazIgPSB0aGlzLmdldFNvbHV0aW9uQmxvY2tJblNvdXJjZSgpO1xuXG4gICAgICAgIC8vIGlmIG5vbmUgaW4gc291cmNlIGdldCBibG9jayB0aGF0IGlzIGZ1cnRoZXN0IGZyb20gYmxvY2sxXG4gICAgICAgIGlmIChibG9jazIgPT0gbnVsbCkge1xuICAgICAgICAgICAgYmxvY2syID0gdGhpcy5nZXRGdXJ0aGVzdEJsb2NrKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgYmxvY2sxIChhYm92ZSBibG9jazIpIGluIHNvbHV0aW9uXG4gICAgICAgIHZhciBpbmRleCA9IHNvbHV0aW9uQmxvY2tzLmluZGV4T2YoYmxvY2syKTtcbiAgICAgICAgYmxvY2sxID0gc29sdXRpb25CbG9ja3NbaW5kZXggLSAxXTtcblxuICAgICAgICAvLyBnZXQgaW5kZXggb2YgZWFjaCBpbiBhbnN3ZXJcbiAgICAgICAgdmFyIGluZGV4MSA9IGFuc3dlckJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgIHZhciBpbmRleDIgPSBhbnN3ZXJCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICB2YXIgbW92ZSA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGlmIGJvdGggaW4gYW5zd2VyIHNldCBtb3ZlIGJhc2VkIG9uIGlmIGRpcmVjdGx5IGFib3ZlIGVhY2ggb3RoZXJcbiAgICAgICAgaWYgKGluZGV4MSA+PSAwICYmIGluZGV4MiA+PSAwKSB7XG4gICAgICAgICAgICBtb3ZlID0gaW5kZXgxICsgMSAhPT0gaW5kZXgyO1xuXG4gICAgICAgICAgICAvLyBlbHNlIGlmIGJvdGggaW4gc291cmNlIHNldCBtb3ZlIGFnYWluIGJhc2VkIG9uIGlmIGFib3ZlIGVhY2ggb3RoZXJcbiAgICAgICAgfSBlbHNlIGlmIChpbmRleDEgPCAwICYmIGluZGV4MiA8IDApIHtcbiAgICAgICAgICAgIGluZGV4MSA9IHNvdXJjZUJsb2Nrcy5pbmRleE9mKGJsb2NrMSk7XG4gICAgICAgICAgICBpbmRleDIgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICAgICAgbW92ZSA9IGluZGV4MSArIDEgIT09IGluZGV4MjtcblxuICAgICAgICAgICAgLy8gb25lIGluIHNvdXJjZSBhbmQgb25lIGluIGFuc3dlciBzbyBtdXN0IG1vdmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1vdmUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGluZGV4MSA8IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleDEgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluZGV4MiA8IDApIHtcbiAgICAgICAgICAgICAgICBpbmRleDIgPSBzb3VyY2VCbG9ja3MuaW5kZXhPZihibG9jazIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHN1YnRyYWN0ID0gaW5kZXgyIDwgaW5kZXgxOyAvLyBpcyBibG9jazIgaGlnaGVyXG5cbiAgICAgICAgaWYgKG1vdmUpIHtcbiAgICAgICAgICAgIC8vIE1vdmUgdGhlIGJsb2NrXG4gICAgICAgICAgICB2YXIgc3RhcnRYID0gYmxvY2syLnBhZ2VYQ2VudGVyKCkgLSAxO1xuICAgICAgICAgICAgdmFyIHN0YXJ0WSA9IGJsb2NrMi5wYWdlWUNlbnRlcigpO1xuICAgICAgICAgICAgdmFyIGVuZFggPSBibG9jazEucGFnZVhDZW50ZXIoKSAtIDE7XG4gICAgICAgICAgICB2YXIgZW5kWSA9XG4gICAgICAgICAgICAgICAgYmxvY2sxLnBhZ2VZQ2VudGVyKCkgK1xuICAgICAgICAgICAgICAgIGJsb2NrMS52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDIgK1xuICAgICAgICAgICAgICAgIDU7XG4gICAgICAgICAgICBpZiAoc3VidHJhY3QpIHtcbiAgICAgICAgICAgICAgICBlbmRZIC09IGJsb2NrMi52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvIDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZFkgKz0gYmxvY2syLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICQoYmxvY2syLnZpZXcpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCwgLy8gMSBzZWNjb25kXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2NrMS52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiIzAwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jazIudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiMwMDBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZmZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMi5saW5lc1swXS5pbmRleCArPSAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5tb3ZpbmcgPSBibG9jazI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFg7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1kgPSBzdGFydFk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uIChhLCBwLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1ggPSBzdGFydFggKiAoMSAtIHApICsgZW5kWCAqIHA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0Lm1vdmluZ1kgPSBzdGFydFkgKiAoMSAtIHApICsgZW5kWSAqIHA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGF0Lm1vdmluZ1g7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhhdC5tb3ZpbmdZO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBibG9jazIubGluZXNbMF0uaW5kZXggLT0gMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrMS5jb25zdW1lQmxvY2soYmxvY2syKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIiNkM2QzZDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2VmZWZlZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoYmxvY2syLnZpZXcpLmFuaW1hdGUoXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoYmxvY2sxLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogXCIjMDAwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI2ZmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKGJsb2NrMi52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiIzAwMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sxLmNvbnN1bWVCbG9jayhibG9jazIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jazEudmlldykuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6IFwiI2QzZDNkM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjZWZlZmVmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChibG9jazEudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFkYXB0IHRoZSBwcm9ibGVtIHRvIGJlIGVhc2llclxuICAgIC8vICAqIHJlbW92ZSBhIGRpc3RyYWN0b3IgdW50aWwgbm9uZSBhcmUgcHJlc2VudFxuICAgIC8vICAqIGNvbWJpbmUgYmxvY2tzIHVudGlsIDMgYXJlIGxlZnRcbiAgICBtYWtlRWFzaWVyKCkge1xuICAgICAgICB2YXIgZGlzdHJhY3RvclRvUmVtb3ZlID0gdGhpcy5kaXN0cmFjdG9yVG9SZW1vdmUoKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgZGlzdHJhY3RvclRvUmVtb3ZlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgICFkaXN0cmFjdG9yVG9SZW1vdmUuaW5Tb3VyY2VBcmVhKClcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBhbGVydCgkLmkxOG4oXCJtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3RcIikpO1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVEaXN0cmFjdG9yKGRpc3RyYWN0b3JUb1JlbW92ZSk7XG4gICAgICAgICAgICB0aGlzLmxvZ01vdmUoXCJyZW1vdmVkRGlzdHJhY3Rvci1cIiArIGRpc3RyYWN0b3JUb1JlbW92ZS5oYXNoKCkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG51bWJlck9mQmxvY2tzID0gdGhpcy5udW1iZXJPZkJsb2NrcyhmYWxzZSk7XG4gICAgICAgICAgICBpZiAobnVtYmVyT2ZCbG9ja3MgPiAzKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJC5pMThuKFwibXNnX3BhcnNvbl93aWxsX2NvbWJpbmVcIikpO1xuICAgICAgICAgICAgICAgIHRoaXMuY29tYmluZUJsb2NrcygpO1xuICAgICAgICAgICAgICAgIHRoaXMubG9nTW92ZShcImNvbWJpbmVkQmxvY2tzXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvKmVsc2UgaWYodGhpcy5udW1iZXJPZkJsb2Nrcyh0cnVlKSA+IDMgJiYgZGlzdHJhY3RvclRvUmVtb3ZlICE9PSAgdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIldpbGwgcmVtb3ZlIGFuIGluY29ycmVjdCBjb2RlIGJsb2NrIGZyb20gc291cmNlIGFyZWFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZURpc3RyYWN0b3IoZGlzdHJhY3RvclRvUmVtb3ZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubG9nTW92ZShcInJlbW92ZWREaXN0cmFjdG9yLVwiICsgZGlzdHJhY3RvclRvUmVtb3ZlLmhhc2goKSk7XG4gICAgICAgICAgICAgICAgICAgICAgIH0gKi9cbiAgICAgICAgICAgICAgICBhbGVydCgkLmkxOG4oXCJtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0XCIpKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbkhlbHAgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vaWYgKG51bWJlck9mQmxvY2tzIDwgNSkge1xuICAgICAgICAgICAgLy9cdHRoaXMuY2FuSGVscCA9IGZhbHNlO1xuICAgICAgICAgICAgLy9cdHRoaXMuaGVscEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAvL31cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGUgXCJIZWxwIE1lXCIgYnV0dG9uIHdhcyBwcmVzc2VkIGFuZCB0aGUgcHJvYmxlbSBzaG91bGQgYmUgc2ltcGxpZmllZFxuICAgIGhlbHBNZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIC8vdGhpcy5oZWxwQ291bnQgPSAtMTsgLy8gYW1vdW50IHRvIGFsbG93IGZvciBtdWx0aXBsZSBoZWxwcyBpbiBhIHJvd1xuICAgICAgICAvL2lmICh0aGlzLmhlbHBDb3VudCA8IDApIHtcbiAgICAgICAgLy9cdHRoaXMuaGVscENvdW50ID0gTWF0aC5tYXgodGhpcy5oZWxwQ291bnQsIC0xKTsgLy8gbWluIDEgYXR0ZW1wdCBiZWZvcmUgbW9yZSBoZWxwXG4gICAgICAgIC8vdGhpcy5oZWxwQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgLy99XG4gICAgICAgIC8vIGlmIGxlc3MgdGhhbiAzIGF0dGVtcHRzXG4gICAgICAgIGlmICh0aGlzLm51bURpc3RpbmN0IDwgMykge1xuICAgICAgICAgICAgYWxlcnQoJC5pMThuKFwibXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzXCIpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBvdGhlcndpc2UgZ2l2ZSBoZWxwXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nb3RIZWxwID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubWFrZUVhc2llcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT0gVVRJTElUWSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuICAgIC8vIFJldHVybiBhIGRhdGUgZnJvbSBhIHRpbWVzdGFtcCAoZWl0aGVyIG15U1FMIG9yIEpTIGZvcm1hdClcbiAgICBkYXRlRnJvbVRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lc3RhbXApO1xuICAgICAgICBpZiAoaXNOYU4oZGF0ZS5nZXRUaW1lKCkpKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHRpbWVzdGFtcC5zcGxpdCgvWy0gOl0vKTtcbiAgICAgICAgICAgIGRhdGUgPSBuZXcgRGF0ZSh0WzBdLCB0WzFdIC0gMSwgdFsyXSwgdFszXSwgdFs0XSwgdFs1XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIC8vIEEgZnVuY3Rpb24gZm9yIHJldHVybmluZyBhIHNodWZmbGVkIHZlcnNpb24gb2YgYW4gYXJyYXlcbiAgICBzaHVmZmxlZChhcnJheSkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICB2YXIgcmV0dXJuQXJyYXkgPSBhcnJheS5zbGljZSgpO1xuICAgICAgICB2YXIgdGVtcG9yYXJ5VmFsdWUsIHJhbmRvbUluZGV4O1xuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoMCAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSByZXR1cm5BcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuQXJyYXlbY3VycmVudEluZGV4XSA9IHJldHVybkFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHJldHVybkFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXR1cm5BcnJheTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBLRVlCT0FSRCBJTlRFUkFDVElPTiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gV2hlbiB0aGUgdXNlciBoYXMgZW50ZXJlZCB0aGUgUGFyc29ucyBwcm9ibGVtIHZpYSBrZXlib2FyZCBtb2RlXG4gICAgZW50ZXJLZXlib2FyZE1vZGUoKSB7XG4gICAgICAgICQodGhpcy5rZXlib2FyZFRpcCkuc2hvdygpO1xuICAgICAgICAkKHRoaXMuc291cmNlTGFiZWwpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmFuc3dlckxhYmVsKS5oaWRlKCk7XG4gICAgICAgIHRoaXMuY2xlYXJGZWVkYmFjaygpO1xuICAgIH1cbiAgICAvLyBXaGVuIHRoZSB1c2VyIGxlYXZlcyB0aGUgUGFyc29ucyBwcm9ibGVtIHZpYSBrZXlib2FyZCBtb2RlXG4gICAgZXhpdEtleWJvYXJkTW9kZSgpIHtcbiAgICAgICAgJCh0aGlzLmtleWJvYXJkVGlwKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5zb3VyY2VMYWJlbCkuc2hvdygpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyTGFiZWwpLnNob3coKTtcbiAgICB9XG4gICAgLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSBWSUVXID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG4gICAgLy8gQ2xlYXIgYW55IGZlZWRiYWNrIGZyb20gdGhlIGFuc3dlciBhcmVhXG4gICAgY2xlYXJGZWVkYmFjaygpIHtcbiAgICAgICAgJCh0aGlzLmFuc3dlckFyZWEpLnJlbW92ZUNsYXNzKFwiaW5jb3JyZWN0IGNvcnJlY3RcIik7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuYW5zd2VyQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKGNoaWxkcmVuW2ldKS5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgICBcImNvcnJlY3RQb3NpdGlvbiBpbmNvcnJlY3RQb3NpdGlvbiBpbmRlbnRMZWZ0IGluZGVudFJpZ2h0XCJcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZXNzYWdlRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB0aGlzLmhpZGVCbG9ja0V4cGxhbmF0aW9ucygpO1xuICAgIH1cbiAgICAvLyBEaXNhYmxlIHRoZSBpbnRlcmZhY2VcbiAgICBhc3luYyBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIC8vIERpc2FibGUgYmxvY2tzXG4gICAgICAgIGF3YWl0IHRoaXMuY2hlY2tTZXJ2ZXJDb21wbGV0ZTtcbiAgICAgICAgY29uc29sZS5sb2coXCJkaXNhYmxpbmcgYmxvY2tzXCIpO1xuICAgICAgICBpZiAodGhpcy5ibG9ja3MgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMuYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIGJsb2NrLmRpc2FibGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBIaWRlIGJ1dHRvbnNcbiAgICAgICAgJCh0aGlzLmNoZWNrQnV0dG9uKS5oaWRlKCk7XG4gICAgICAgICQodGhpcy5yZXNldEJ1dHRvbikuaGlkZSgpO1xuICAgIH1cbiAgICAvLyBCYXNlZCBvbiB0aGUgbW92aW5nIGVsZW1lbnQsIGV0Yy4sIGVzdGFibGlzaCB0aGUgbW92aW5nIHN0YXRlXG4gICAgLy8gICByZXN0OiBub3QgbW92aW5nXG4gICAgLy8gICBzb3VyY2U6IG1vdmluZyBpbnNpZGUgc291cmNlIGFyZWFcbiAgICAvLyAgIGFuc3dlcjogbW92aW5nIGluc2lkZSBhbnN3ZXIgYXJlYVxuICAgIC8vICAgbW92aW5nOiBtb3Zpbmcgb3V0c2lkZSBhcmVhc1xuICAgIG1vdmluZ1N0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5tb3ZpbmcgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZXN0XCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHggPSB0aGlzLm1vdmluZ1ggLSB3aW5kb3cucGFnZVhPZmZzZXQ7XG4gICAgICAgIHZhciB5ID0gdGhpcy5tb3ZpbmdZIC0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICAvLyBDaGVjayBpZiBpbiBhbnN3ZXIgYXJlYVxuICAgICAgICB2YXIgYm91bmRzID0gdGhpcy5hbnN3ZXJBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB4ID49IGJvdW5kcy5sZWZ0ICYmXG4gICAgICAgICAgICB4IDw9IGJvdW5kcy5yaWdodCAmJlxuICAgICAgICAgICAgeSA+PSBib3VuZHMudG9wICYmXG4gICAgICAgICAgICB5IDw9IGJvdW5kcy5ib3R0b21cbiAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJhbnN3ZXJcIjtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiBpbiBzb3VyY2UgYXJlYVxuICAgICAgICBib3VuZHMgPSB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHggPj0gYm91bmRzLmxlZnQgJiZcbiAgICAgICAgICAgIHggPD0gYm91bmRzLnJpZ2h0ICYmXG4gICAgICAgICAgICB5ID49IGJvdW5kcy50b3AgJiZcbiAgICAgICAgICAgIHkgPD0gYm91bmRzLmJvdHRvbVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBcInNvdXJjZVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIm1vdmluZ1wiO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgdGhlIFBhcnNvbnMgdmlld1xuICAgIC8vIFRoaXMgZ2V0cyBjYWxsZWQgd2hlbiBkcmFnZ2luZyBhIGJsb2NrXG4gICAgdXBkYXRlVmlldygpIHtcbiAgICAgICAgLy8gQmFzZWQgb24gdGhlIG5ldyBhbmQgdGhlIG9sZCBzdGF0ZSwgZmlndXJlIG91dCB3aGF0IHRvIHVwZGF0ZVxuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgICAgICB2YXIgbmV3U3RhdGUgPSB0aGlzLm1vdmluZ1N0YXRlKCk7XG4gICAgICAgIHZhciB1cGRhdGVTb3VyY2UgPSB0cnVlO1xuICAgICAgICB2YXIgdXBkYXRlQW5zd2VyID0gdHJ1ZTtcbiAgICAgICAgdmFyIHVwZGF0ZU1vdmluZyA9IG5ld1N0YXRlID09IFwibW92aW5nXCI7XG4gICAgICAgIGlmIChzdGF0ZSA9PSBuZXdTdGF0ZSkge1xuICAgICAgICAgICAgaWYgKG5ld1N0YXRlID09IFwicmVzdFwiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlU291cmNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5zd2VyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld1N0YXRlID09IFwic291cmNlXCIpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVBbnN3ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3U3RhdGUgPT0gXCJhbnN3ZXJcIikge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdTdGF0ZSA9PSBcIm1vdmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlQW5zd2VyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdXBkYXRlU291cmNlID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1vdmluZ0hlaWdodDtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIE11c3QgZ2V0IGhlaWdodCBoZXJlIGFzIGRldGFjaGVkIGl0ZW1zIGRvbid0IGhhdmUgaGVpZ2h0XG4gICAgICAgICAgICBtb3ZpbmdIZWlnaHQgPSAkKHRoaXMubW92aW5nLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcG9zaXRpb25Ub3AsIHdpZHRoO1xuICAgICAgICB2YXIgYmFzZVdpZHRoID0gdGhpcy5hcmVhV2lkdGggLSAyMjtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSBTb3VyY2UgQXJlYVxuICAgICAgICBpZiAodXBkYXRlU291cmNlKSB7XG4gICAgICAgICAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcInNvdXJjZVwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0luc2VydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIG1vdmluZ0JpbiA9IHRoaXMubW92aW5nLnBhaXJlZEJpbigpO1xuICAgICAgICAgICAgICAgIHZhciBiaW5Gb3JCbG9jayA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2sucHVzaChibG9ja3NbaV0ucGFpcmVkQmluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWJpbkZvckJsb2NrLmluY2x1ZGVzKG1vdmluZ0JpbikpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nQmluID0gLTE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRQb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZiAoYmluRm9yQmxvY2subGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vdmluZ0JpbiA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYmluRm9yQmxvY2tbMF0gPT0gbW92aW5nQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaCgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYmluRm9yQmxvY2tbaSAtIDFdID09IG1vdmluZ0Jpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFBvc2l0aW9ucy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiaW5Gb3JCbG9ja1tpXSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW92aW5nQmluID09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2tbaSAtIDFdICE9IGJpbkZvckJsb2NrW2ldXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAobW92aW5nQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNlcnRQb3NpdGlvbnMucHVzaChiaW5Gb3JCbG9jay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgYmluRm9yQmxvY2tbYmluRm9yQmxvY2subGVuZ3RoIC0gMV0gPT0gbW92aW5nQmluXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0UG9zaXRpb25zLnB1c2goYmluRm9yQmxvY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeCA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWCAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc291cmNlQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VYT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgYmFzZVdpZHRoIC8gMiAtXG4gICAgICAgICAgICAgICAgICAgIDExO1xuICAgICAgICAgICAgICAgIHZhciB5ID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmdZIC1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgajtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNJbnNlcnRlZCAmJiBpbnNlcnRQb3NpdGlvbnMuaW5jbHVkZXMoaSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0ZXN0SGVpZ2h0ID0gJChpdGVtLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChqID0gaSArIDE7IGogPCBibG9ja3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5zZXJ0UG9zaXRpb25zLmluY2x1ZGVzKGopKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXN0SGVpZ2h0ICs9ICQoYmxvY2tzW2pdLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHkgLSBwb3NpdGlvblRvcCA8IG1vdmluZ0hlaWdodCArIHRlc3RIZWlnaHQgLyAyIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9PSBpbnNlcnRQb3NpdGlvbnNbaW5zZXJ0UG9zaXRpb25zLmxlbmd0aCAtIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJbnNlcnRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogeSAtIG1vdmluZ0hlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChpdGVtLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGl0ZW0udmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5hcHBlbmRUbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI1wiICsgdGhpcy5jb3VudGVySWQgKyBcIi1zb3VyY2VcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB5IC0gJCh0aGlzLm1vdmluZy52aWV3KS5vdXRlckhlaWdodCh0cnVlKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgJChpdGVtLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGl0ZW0udmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBQYWlyZWQgRGlzdHJhY3RvciBJbmRpY2F0b3JzXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5wYWlyZWRCaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJpbiA9IHRoaXMucGFpcmVkQmluc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2hpbmcgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYmxvY2tzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrID0gYmxvY2tzW2pdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmxvY2subWF0Y2hlc0JpbihiaW4pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRjaGluZy5wdXNoKGJsb2NrKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZGl2ID0gdGhpcy5wYWlyZWREaXZzW2ldO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGluZy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKGRpdikuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoZGl2KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoZWlnaHQgPSAtNTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9IHBhcnNlSW50KFxuICAgICAgICAgICAgICAgICAgICAgICAgJChtYXRjaGluZ1ttYXRjaGluZy5sZW5ndGggLSAxXS52aWV3KS5jc3MoXCJ0b3BcIilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0IC09IHBhcnNlSW50KCQobWF0Y2hpbmdbMF0udmlldykuY3NzKFwidG9wXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0ICs9ICQobWF0Y2hpbmdbbWF0Y2hpbmcubGVuZ3RoIC0gMV0udmlldykub3V0ZXJIZWlnaHQoXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICQoZGl2KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6ICQobWF0Y2hpbmdbMF0udmlldykuY3NzKFwidG9wXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IGJhc2VXaWR0aCArIDM0LFxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dC1pbmRlbnRcIjogLTMwLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nLXRvcFwiOiAoaGVpZ2h0IC0gNzApIC8gMixcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcInZpc2libGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZm9udC1zaXplXCI6IDQzLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ2ZXJ0aWNhbC1hbGlnblwiOiBcIm1pZGRsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzdlN2VlN1wiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJChkaXYpLmh0bWwoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxzcGFuIGlkPSAnc3QnIHN0eWxlID0gJ3ZlcnRpY2FsLWFsaWduOiBtaWRkbGU7IGZvbnQtd2VpZ2h0OiBib2xkOyBmb250LXNpemU6IDE1cHgnPm9yPC9zcGFuPntcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hpbmcubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJChkaXYpLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgQW5zd2VyIEFyZWFcbiAgICAgICAgaWYgKHVwZGF0ZUFuc3dlcikge1xuICAgICAgICAgICAgdmFyIGJsb2NrLCBpbmRlbnQ7XG4gICAgICAgICAgICBwb3NpdGlvblRvcCA9IDA7XG4gICAgICAgICAgICB3aWR0aCA9XG4gICAgICAgICAgICAgICAgdGhpcy5hcmVhV2lkdGggK1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCAtXG4gICAgICAgICAgICAgICAgMjI7XG4gICAgICAgICAgICB2YXIgYmxvY2tzID0gdGhpcy5hbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgICAgIGlmIChuZXdTdGF0ZSA9PSBcImFuc3dlclwiKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhhc0luc2VydGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIHggPVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgIGJhc2VXaWR0aCAvIDIgLVxuICAgICAgICAgICAgICAgICAgICAxMTtcbiAgICAgICAgICAgICAgICB2YXIgbW92aW5nSW5kZW50ID0gTWF0aC5yb3VuZCh4IC8gdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudCk7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmluZ0luZGVudCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSW5kZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1vdmluZ0luZGVudCA+IHRoaXMuaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmluZ0luZGVudCA9IHRoaXMuaW5kZW50O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHggPSBtb3ZpbmdJbmRlbnQgKiB0aGlzLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgeSA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92aW5nWSAtXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLVxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcuaW5kZW50ID0gbW92aW5nSW5kZW50O1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5IC0gcG9zaXRpb25Ub3AgPFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtb3ZpbmdIZWlnaHQgKyAkKGJsb2NrLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpKSAvIDJcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0luc2VydGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jay52aWV3XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogeSAtIG1vdmluZ0hlaWdodCAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBiYXNlV2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyBtb3ZpbmdIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaW5kZW50ID0gYmxvY2suaW5kZW50ICogdGhpcy5vcHRpb25zLnBpeGVsc1BlckluZGVudDtcbiAgICAgICAgICAgICAgICAgICAgJChibG9jay52aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogaW5kZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiBwb3NpdGlvblRvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCAtIGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAyLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25Ub3AgPSBwb3NpdGlvblRvcCArICQoYmxvY2sudmlldykub3V0ZXJIZWlnaHQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghaGFzSW5zZXJ0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5hcHBlbmRUbyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiI1wiICsgdGhpcy5jb3VudGVySWQgKyBcIi1hbnN3ZXJcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMubW92aW5nLnZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiB4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiB5IC0gJCh0aGlzLm1vdmluZy52aWV3KS5vdXRlckhlaWdodCh0cnVlKSAvIDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ6LWluZGV4XCI6IDMsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGluZGVudCA9IGJsb2NrLmluZGVudCAqIHRoaXMub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQ7XG4gICAgICAgICAgICAgICAgICAgICQoYmxvY2sudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IGluZGVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogcG9zaXRpb25Ub3AsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGggLSBpbmRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInotaW5kZXhcIjogMixcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG9wID0gcG9zaXRpb25Ub3AgKyAkKGJsb2NrLnZpZXcpLm91dGVySGVpZ2h0KHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIE1vdmluZyBBcmVhXG4gICAgICAgIGlmICh1cGRhdGVNb3ZpbmcpIHtcbiAgICAgICAgICAgIC8vIEFkZCBpdCB0byB0aGUgbG93ZXN0IHBsYWNlIGluIHRoZSBzb3VyY2UgYXJlYVxuICAgICAgICAgICAgbW92aW5nQmluID0gdGhpcy5tb3ZpbmcucGFpcmVkQmluKCk7XG4gICAgICAgICAgICBpZiAobW92aW5nQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLm1vdmluZy52aWV3KS5hcHBlbmRUbyhcIiNcIiArIHRoaXMuY291bnRlcklkICsgXCItc291cmNlXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVmb3JlO1xuICAgICAgICAgICAgICAgIGJsb2NrcyA9IHRoaXMuc291cmNlQmxvY2tzO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay5wYWlyZWRCaW4oKSA9PSBtb3ZpbmdCaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZSA9IGkgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChiZWZvcmUgPT0gdW5kZWZpbmVkIHx8IGJlZm9yZSA9PSBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuYXBwZW5kVG8oXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiNcIiArIHRoaXMuY291bnRlcklkICsgXCItc291cmNlXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZpbmcudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tiZWZvcmVdLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBQbGFjZSBpbiB0aGUgbWlkZGxlIG9mIHRoZSBtb3VzZSBjdXJzb3JcbiAgICAgICAgICAgICQodGhpcy5tb3ZpbmcudmlldykuY3NzKHtcbiAgICAgICAgICAgICAgICBsZWZ0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1ggLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wYWdlWE9mZnNldCAtXG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5tb3Zpbmcudmlldykub3V0ZXJXaWR0aCh0cnVlKSAvIDIsXG4gICAgICAgICAgICAgICAgdG9wOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmluZ1kgLVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZUFyZWEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC1cbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0IC1cbiAgICAgICAgICAgICAgICAgICAgbW92aW5nSGVpZ2h0IC8gMixcbiAgICAgICAgICAgICAgICB3aWR0aDogYmFzZVdpZHRoLFxuICAgICAgICAgICAgICAgIFwiei1pbmRleFwiOiAzLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICBhZGRCbG9ja0xhYmVscyhibG9ja3MpIHtcbiAgICAgICAgdmFyIGJpbiA9IC0xO1xuICAgICAgICB2YXIgYmluQ291bnQgPSAwO1xuICAgICAgICB2YXIgYmluQ2hpbGRyZW4gPSAwO1xuICAgICAgICB2YXIgYmxvY2tzTm90SW5CaW5zID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChibG9ja3NbaV0ucGFpcmVkQmluKCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBibG9ja3NOb3RJbkJpbnMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRCaW4gPSBibG9ja3NbaV0ucGFpcmVkQmluKCk7XG4gICAgICAgICAgICBpZiAoY3VycmVudEJpbiA9PSAtMSB8fCBjdXJyZW50QmluICE9IGJpbikge1xuICAgICAgICAgICAgICAgIGJpbiA9IGN1cnJlbnRCaW47XG4gICAgICAgICAgICAgICAgYmluQ2hpbGRyZW4gPSAwO1xuICAgICAgICAgICAgICAgIGJpbkNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbGFiZWwgPVxuICAgICAgICAgICAgICAgIFwiXCIgK1xuICAgICAgICAgICAgICAgIGJpbkNvdW50ICtcbiAgICAgICAgICAgICAgICAoY3VycmVudEJpbiAhPSAtMVxuICAgICAgICAgICAgICAgICAgICA/IFN0cmluZy5mcm9tQ2hhckNvZGUoOTcgKyBiaW5DaGlsZHJlbilcbiAgICAgICAgICAgICAgICAgICAgOiBcIiBcIik7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgYmluQ291bnQgPCAxMCAmJlxuICAgICAgICAgICAgICAgIGJsb2Nrc05vdEluQmlucyArIHRoaXMucGFpcmVkQmlucy5sZW5ndGggPj0gMTBcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGxhYmVsICs9IFwiIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2tzW2ldLmFkZExhYmVsKGxhYmVsLCAwKTtcbiAgICAgICAgICAgIGJpbkNoaWxkcmVuKys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJsb2Nrc05vdEluQmlucyArIHRoaXMucGFpcmVkQmlucy5sZW5ndGggPj0gMTApIHtcbiAgICAgICAgICAgIHRoaXMuYXJlYVdpZHRoICs9IDU7XG4gICAgICAgICAgICAkKHRoaXMuc291cmNlQXJlYSkuY3NzKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJCh0aGlzLnNvdXJjZUFyZWEpLndpZHRoKCkgKyA1LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuY3NzKHtcbiAgICAgICAgICAgICAgICB3aWR0aDogJCh0aGlzLmFuc3dlckFyZWEpLndpZHRoKCkgKyA1LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUHV0IGFsbCB0aGUgYmxvY2tzIGJhY2sgaW50byB0aGUgc291cmNlIGFyZWEsIHJlc2h1ZmZsaW5nIGFzIG5lY2Vzc2FyeVxuICAgIHJlc2V0VmlldygpIHtcbiAgICAgICAgLy8gQ2xlYXIgZXZlcnl0aGluZ1xuICAgICAgICB0aGlzLmNsZWFyRmVlZGJhY2soKTtcbiAgICAgICAgLy8gQ29kZVRhaWxvcjogSGlkZSB0aGUgQ29weSBBbnN3ZXIgQnV0dG9uIGFnYWluXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvcHlCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjY29weS1hbnN3ZXItYnV0dG9uLSR7dGhpcy5kaXZpZH1gKTsgLy8gY29weS1hbnN3ZXItYnV0dG9uLSR7cHV6emxlU2NhZmZvbGRpbmdEaXZpZH1cbiAgICAgICAgICAgIGlmIChjb3B5QnRuKSB7XG4gICAgICAgICAgICAgICAgY29weUJ0bi5jbGFzc0xpc3QuYWRkKCdjb3B5LWJ1dHRvbi1oaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNjcm9sbFRvcCA9IGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgICB2YXIgYmxvY2s7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGJsb2NrID0gdGhpcy5ibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gJChibG9jay5saW5lc1tqXS52aWV3KS5maW5kKFwiLmJsb2NrLWxhYmVsXCIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgY2hpbGRyZW4ubGVuZ3RoOyBjKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5bY10ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmxvY2suZGVzdHJveSgpO1xuICAgICAgICAgICAgJCh0aGlzLmJsb2Nrc1tpXS52aWV3KS5kZXRhY2goKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgdGhpcy5ibG9ja3M7XG4gICAgICAgIHRoaXMuYmxvY2tJbmRleCA9IDA7XG4gICAgICAgIGlmICh0aGlzLnBhaXJlZERpdnMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wYWlyZWREaXZzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnBhaXJlZERpdnNbaV0pLmRldGFjaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICQodGhpcy5zb3VyY2VBcmVhKS5hdHRyKFwic3R5bGVcIiwgXCJcIik7XG4gICAgICAgICQodGhpcy5hbnN3ZXJBcmVhKS5yZW1vdmVDbGFzcygpO1xuICAgICAgICAkKHRoaXMuYW5zd2VyQXJlYSkuYXR0cihcInN0eWxlXCIsIFwiXCIpO1xuICAgICAgICB0aGlzLm5vaW5kZW50ID0gdGhpcy5vcHRpb25zLm5vaW5kZW50O1xuICAgICAgICAvLyBSZWluaXRpYWxpemVcbiAgICAgICAgaWYgKHRoaXMuaGFzU29sdmVkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ291bnQgPSAwO1xuICAgICAgICAgICAgdGhpcy5udW1EaXN0aW5jdCA9IDA7XG4gICAgICAgICAgICB0aGlzLmhhc1NvbHZlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5hZGFwdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuSGVscCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL3RoaXMuaGVscENvdW50ID0gLTM7IC8vIGVuYWJsZSBhZnRlciAzIGZhaWxlZCBhdHRlbXB0c1xuICAgICAgICAgICAgLy90aGlzLmhlbHBCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5hZGFwdGl2ZUlkICsgXCJQcm9ibGVtXCIsIHRoaXMuZGl2aWQpO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgdGhpcy5hZGFwdGl2ZUlkICsgdGhpcy5kaXZpZCArIFwiQ291bnRcIixcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ291bnRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0aGlzLmFkYXB0aXZlSWQgKyBcIlNvbHZlZFwiLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zY2FmZm9sZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gQ29kZVRhaWxvcjogaW5pdGlhbGl6ZSB0aGUgcHJlLXBsYWNlZCBQYXJzb25zIGJsb2NrcyBpbmNsdWRpbmcgdGhlIHNldHRsZWQgYmxvY2tzLCBpZiBhbnkuXG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgdGhpcy5zZXR0bGVkQmxvY2tzRnJvbVNvdXJjZSgpLCB7fSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVBcmVhcyh0aGlzLmJsb2Nrc0Zyb21Tb3VyY2UoKSwgW10sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluaXRpYWxpemVJbnRlcmFjdGl2aXR5KCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICBpZiAodGhpcy5ydW5uYWJsZURpdikge1xuICAgICAgICAgICAgLy8gaGlkZSB0aGUgcmVuZGVyZWQgcnVubmFibGUgLSB3aWxsIGdldCByZXVzZWQgYXMgaXMgaWYgcmVyZXZlYWxlZFxuICAgICAgICAgICAgdGhpcy5ydW5uYWJsZURpdi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5QYXJzb25zLmNvdW50ZXIgPSAwO1xuXG4kKGRvY3VtZW50KS5vbihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgJChcIltkYXRhLWNvbXBvbmVudD1wYXJzb25zXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFt0aGlzLmlkXSA9IG5ldyBQYXJzb25zKHtcbiAgICAgICAgICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBQYXJzb25zIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcbiIsImltcG9ydCBQYXJzb25zIGZyb20gXCIuL3BhcnNvbnNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRQYXJzb25zIGV4dGVuZHMgUGFyc29ucyB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgLy8gdG9kbyAtLSBtYWtlIHRoaXMgY29uZmlndXJhYmxlXG4gICAgICAgIGlmIChvcHRzLnRpbWVkZmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd2ZlZWRiYWNrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd2ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ncmFkZXIuc2hvd2ZlZWRiYWNrID0gdGhpcy5zaG93ZmVlZGJhY2s7XG4gICAgICAgIHRoaXMuaGlkZUZlZWRiYWNrKCk7XG4gICAgICAgICQodGhpcy5jaGVja0J1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMuaGVscEJ1dHRvbikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMucmVzZXRCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiO1xuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgICQodGhpcy5tZXNzYWdlRGl2KS5oaWRlKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wicGFyc29uc1wiXSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZFBhcnNvbnMob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgUGFyc29ucyhvcHRzKTtcbn07XG4iLCJpbXBvcnQgUGFyc29uc0Jsb2NrIGZyb20gXCIuL3BhcnNvbnNCbG9ja1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXR0bGVkQmxvY2sgZXh0ZW5kcyBQYXJzb25zQmxvY2sge1xuICAgIGNvbnN0cnVjdG9yKHByb2JsZW0sIGxpbmVzKSB7XG4gICAgICAgIC8vIHByb2JsZW06IFBhcnNvbnMgaW5zdGFuY2VcbiAgICAgICAgLy8gbGluZXM6IGxpbmVzIGluc2lkZSB0aGUgYmxvY2tcbiAgICAgICAgc3VwZXIocHJvYmxlbSwgbGluZXMpO1xuXG4gICAgICAgIHRoaXMuaXNTZXR0bGVkID0gdHJ1ZTtcbiAgICAgICAgLy91cGRhdGUgaXRzIGluZGVudCB0byBmb2xsb3cgdGhlIGluZGVudGF0aW9uIG9mIHRoZSBsaW5lcyBpbnNpZGVcblxuICAgICAgICAvLyBhZGQgYSBjc3MgY2xhc3NcbiAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwic2V0dGxlZC1ibG9ja1wiKTtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG5cbiAgICAgICAgbGV0IHRvb2x0aXBTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICB0b29sdGlwU3Bhbi5jbGFzc0xpc3QuYWRkKFwic2V0dGxlZC10b29sdGlwXCIpO1xuICAgICAgICAkKHRoaXMudmlldykuYXBwZW5kKHRvb2x0aXBTcGFuKTtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmZpbmQoJy5zZXR0bGVkLXRvb2x0aXAnKS50ZXh0KCdPSycpO1xuICAgIH1cblxuICAgIHNldEJsb2Nrc0JlZm9yZShudW0pIHtcbiAgICAgICAgdGhpcy5ibG9ja3NCZWZvcmUgPSBudW07XG4gICAgICAgIHZhciBiZWZvcmVQbHVyYWwgPSBudW0gPiAxID8gJ3MnIDogJyc7XG4gICAgICAgIGlmICh0aGlzLmJsb2Nrc0FmdGVyKSB7XG4gICAgICAgICAgICB2YXIgYWZ0ZXJQbHVyYWwgPSB0aGlzLmJsb2Nrc0FmdGVyID4gMSA/ICdzJyA6ICcnO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZpbmQoJy5zZXR0bGVkLXRvb2x0aXAnKS5odG1sKGAke251bX0gYmxvY2ske2JlZm9yZVBsdXJhbH0g4qyG77iP77iPKSwgJHt0aGlzLmJsb2Nrc0FmdGVyfSBibG9jayR7YWZ0ZXJQbHVyYWx9IOKsh++4j2ApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuZmluZCgnLnNldHRsZWQtdG9vbHRpcCcpLmh0bWwoYCR7bnVtfSBibG9jayR7YmVmb3JlUGx1cmFsfSDirIbvuI/vuI9gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0QmxvY2tzQWZ0ZXIobnVtKSB7XG4gICAgICAgIHRoaXMuYmxvY2tzQWZ0ZXIgPSBudW07XG4gICAgICAgIHZhciBhZnRlclBsdXJhbCA9IG51bSA+IDEgPyAncycgOiAnJztcbiAgICAgICAgaWYgKHRoaXMuYmxvY2tzQmVmb3JlKSB7XG4gICAgICAgICAgICB2YXIgYmVmb3JlUGx1cmFsID0gdGhpcy5ibG9ja3NCZWZvcmUgPiAxID8gJ3MnIDogJyc7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuZmluZCgnLnNldHRsZWQtdG9vbHRpcCcpLmh0bWwoYCR7dGhpcy5ibG9ja3NCZWZvcmV9IGJsb2NrJHtiZWZvcmVQbHVyYWx9IOKshu+4jywgJHtudW19IGJsb2NrJHthZnRlclBsdXJhbH0g4qyH77iPYClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5maW5kKCcuc2V0dGxlZC10b29sdGlwJykuaHRtbChgJHtudW19IGJsb2NrJHthZnRlclBsdXJhbH0g77iP77iP4qyH77iPYClcbiAgICAgICAgfVxuICAgIH1cbn0iLCIvKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT0gUGFyc29uc0xpbmUgT2JqZWN0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gVGhlIG1vZGVsIGFuZCB2aWV3IG9mIGEgbGluZSBvZiBjb2RlLlxuPT09PT09PT0gQmFzZWQgb24gd2hhdCBpcyBzcGVjaWZpZWQgaW4gdGhlIHByb2JsZW0uXG49PT09PT09PSBQYXJzb25CbG9jayBvYmplY3RzIGhhdmUgb25lIG9yIG1vcmUgb2YgdGhlc2UuXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09IGluZGV4OiB0aGUgaW5kZXggb2YgdGhlIGxpbmUgaW4gdGhlIHByb2JsZW1cbj09PT09PT09IHRleHQ6IHRoZSB0ZXh0IG9mIHRoZSBjb2RlIGxpbmVcbj09PT09PT09IGluZGVudDogdGhlIGluZGVudCBsZXZlbFxuPT09PT09PT0gdmlldzogYW4gZWxlbWVudCBmb3Igdmlld2luZyB0aGlzIG9iamVjdFxuPT09PT09PT0gZGlzdHJhY3Rvcjogd2hldGhlciBpdCBpcyBhIGRpc3RyYWN0b3Jcbj09PT09PT09IHBhaXJlZDogd2hldGhlciBpdCBpcyBhIHBhaXJlZCBkaXN0cmFjdG9yXG49PT09PT09PSBncm91cFdpdGhOZXh0OiB3aGV0aGVyIGl0IGlzIGdyb3VwZWQgd2l0aCB0aGUgZm9sbG93aW5nIGxpbmVcbj09PT09PT09IHdpZHRoOiB0aGUgcGl4ZWwgd2lkdGggd2hlbiByZW5kZXJlZFxuPT09PT09PT09PT09IGluIHRoZSBpbml0aWFsIGdyb3VwaW5nXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cbi8vIEluaXRpYWxpemUgZnJvbSBjb2Rlc3RyaW5nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNvbnNMaW5lIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtLCBjb2Rlc3RyaW5nLCBkaXNwbGF5bWF0aCkge1xuICAgICAgICB0aGlzLnByb2JsZW0gPSBwcm9ibGVtO1xuICAgICAgICB0aGlzLmluZGV4ID0gcHJvYmxlbS5saW5lcy5sZW5ndGg7XG4gICAgICAgIC8vIHJlbW92ZXMgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICAgICAgICB2YXIgdHJpbW1lZCA9IGNvZGVzdHJpbmcucmVwbGFjZSgvXFxzKiQvLCBcIlwiKTtcbiAgICAgICAgLy8gQ29kZVRhaWxvcjogQWN0aW9ucyBhcmUgcmVxdWlyZWQgb25seSBpZiB0aGUgcHV6emxlIHdlbGwgYmUgc2VydmVkIGFzIHNjYWZmb2xkaW5nIHB1enpsZSBpbiBDb2RlVGFpbG9yXG4gICAgICAgIC8vIFNvIGhlcmUgd2UgdXNlIHByb2JsZW0ub3B0aW9ucy5zY2FmZm9sZGluZyB0byBkZXRlcm1pbmUgaWYgdGhlIHB1enpsZSBpcyBhIHNjYWZmb2xkaW5nIHB1enpsZVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMuc2NhZmZvbGRpbmcgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGhhc1RvcExldmVsQ2xhc3MobGluZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZXMuc29tZSgoeyB0ZXh0IH0pID0+IHRleHQudHJpbVN0YXJ0KCkudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiY2xhc3MgXCIpICAgLy8gbm93IGNoZWNrIGZvciDigJxjbGFzcyDigJ0gYXQgcG9zaXRpb24gMFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHJpbW1lZDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGFueSBsZWFkaW5nIHdoaXRlc3BhY2VcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSB0cmltbWVkLnJlcGxhY2UoL15cXHMqLywgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSA9PSBcImphdmFcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5yZXBsYWNlKC9cXHQvZywgXCIgICAgXCIpOyBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcInB1YmxpYyBjbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGVudCA9IDA7ICAvLyBTZXQgaW5kZW50IHRvIDAgZm9yIGNsYXNzIHN0YXJ0XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0cmltbWVkLmxlbmd0aCAtIHRoaXMudGV4dC5sZW5ndGg7ICAvLyBDYWxjdWxhdGUgbm9ybWFsIGluZGVudGF0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbGxMaW5lcyA9IHRoaXMucHJvYmxlbS5saW5lcztcbiAgICAgICAgICAgICAgICAvLyBwdXQgaW5kZW50YXRpb24gb2YgaW1wb3J0IGxpbmUgYXMgMFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKFwiaW1wb3J0XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDsgIFxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBsaW5lIGlzIGEgY2xhc3MgZGVmaW5pdGlvbiAtIGlmIHNvLCB0aGVuIGRvIG5vdCBzZXQgdXAgaW5kZW50YXRpb24gb2YgZGVmIGxpbmUgYXMgMCAgICBcbiAgICAgICAgICAgICAgICBpZiAoaGFzVG9wTGV2ZWxDbGFzcyhhbGxMaW5lcykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dC50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoXCJjbGFzc1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwOyAgLy8gU2V0IGluZGVudCB0byAwIGZvciBjbGFzcyBzdGFydFxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0cmltbWVkLmxlbmd0aCAtIHRoaXMudGV4dC5sZW5ndGg7ICAvLyBDYWxjdWxhdGUgbm9ybWFsIGluZGVudGF0aW9uXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgbGluZSBpcyBhIGZ1bmN0aW9uIGRlZmluaXRpb24gLSBpZiBzbywgdGhlbiBzZXQgdXAgaW5kZW50YXRpb24gb2YgZGVmIGxpbmUgYXMgMFxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0LnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aChcImRlZlwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSAwOyAgLy8gU2V0IGluZGVudCB0byAwIGZvciBkZWYgc3RhcnRcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gdHJpbW1lZC5sZW5ndGggLSB0aGlzLnRleHQubGVuZ3RoOyAgLy8gQ2FsY3VsYXRlIG5vcm1hbCBpbmRlbnRhdGlvblxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdHJpbW1lZC5yZXBsYWNlKC9eXFxzKi8sIFwiXCIpO1xuICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0cmltbWVkLmxlbmd0aCAtIHRoaXMudGV4dC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAvLyBDcmVhdGUgdGhlIFZpZXdcbiAgICAgICAgdmFyIHZpZXc7XG4gICAgICAgIC8vIFRPRE86IHRoaXMgZG9lcyBub3Qgd29yayB3aXRoIGRpc3BsYXkgbWF0aC4uLiBQZXJoYXBzIHdpdGggcHJldGV4dCB3ZSBzaG91bGQgaGF2ZSBodG1sIGFzIGEgbGFuZ3VhZ2UgYW5kIGRvIG5vdGhpbmc/XG4gICAgICAgIFxuICAgICAgICBpZiAocHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlID09IFwibmF0dXJhbFwiIHx8IHByb2JsZW0ub3B0aW9ucy5sYW5ndWFnZSA9PSBcIm1hdGhcIikge1xuICAgICAgICAgICAgaWYgKCEgZGlzcGxheW1hdGgpIHtcbiAgICAgICAgICAgICAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIpO1xuICAgICAgICAgICAgJCh2aWV3KS5hZGRDbGFzcyhwcm9ibGVtLm9wdGlvbnMucHJldHRpZnlMYW5ndWFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmlldy5pZCA9IHByb2JsZW0uY291bnRlcklkICsgXCItbGluZS1cIiArIHRoaXMuaW5kZXg7XG4gICAgICAgIHZpZXcuaW5uZXJIVE1MICs9IHRoaXMudGV4dDtcbiAgICAgICAgdGhpcy52aWV3ID0gdmlldztcbiAgICAgICAgcHJvYmxlbS5saW5lcy5wdXNoKHRoaXMpO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIHdoYXQgd2lkdGggdGhlIGxpbmUgd291bGQgbmF0dXJhbGx5IGhhdmUgKHdpdGhvdXQgaW5kZW50KVxuICAgIGluaXRpYWxpemVXaWR0aCgpIHtcbiAgICAgICAgLy8gdGhpcy53aWR0aCBkb2VzIG5vdCBhcHBlYXIgdG8gYmUgdXNlZCBhbnl3aGVyZSBsYXRlclxuICAgICAgICAvLyBzaW5jZSBjaGFuZ2luZyB0aGUgdmFsdWUgb2YgdGhpcy53aWR0aCBhcHBlYXJzIHRvIGhhdmUgbm8gZWZmZWN0LiAtIFZpbmNlbnQgUWl1IChTZXB0ZW1iZXIgMjAyMClcbiAgICAgICAgdGhpcy53aWR0aCA9XG4gICAgICAgICAgICAkKHRoaXMudmlldykub3V0ZXJXaWR0aCh0cnVlKSAtXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ub3B0aW9ucy5waXhlbHNQZXJJbmRlbnQgKiB0aGlzLmluZGVudDtcblxuICAgICAgICAvLyBQYXNzIHRoaXMgaW5mb3JtYXRpb24gb24gdG8gYmUgdXNlZCBpbiBjbGFzcyBQYXJzb25zIGZ1bmN0aW9uIGluaXRpYWxpemVBcmVhc1xuICAgICAgICAvLyB0byBtYW51YWxseSBkZXRlcm1pbmUgYXBwcm9wcmlhdGUgd2lkdGhzIC0gVmluY2VudCBRaXUgKFNlcHRlbWJlciAyMDIwKVxuICAgICAgICB0aGlzLnZpZXcuZm9udFNpemUgPSB3aW5kb3dcbiAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMudmlldywgbnVsbClcbiAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1zaXplXCIpO1xuICAgICAgICB0aGlzLnZpZXcucGl4ZWxzUGVySW5kZW50ID0gdGhpcy5wcm9ibGVtLm9wdGlvbnMucGl4ZWxzUGVySW5kZW50O1xuICAgICAgICB0aGlzLnZpZXcuaW5kZW50ID0gdGhpcy5pbmRlbnQ7XG5cbiAgICAgICAgLy8gRmlndXJlIG91dCB3aGljaCB0eXBlZmFjZSB3aWxsIGJlIHJlbmRlcmVkIGJ5IGNvbXBhcmluZyB0ZXh0IHdpZHRocyB0byBicm93c2VyIGRlZmF1bHQgLSBWaW5jZW50IFFpdSAoU2VwdGVtYmVyIDIwMjApXG4gICAgICAgIHZhciB0ZW1wQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgICAgdmFyIHRlbXBDYW52YXNDdHggPSB0ZW1wQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgdmFyIHBvc3NpYmxlRm9udHMgPSB3aW5kb3dcbiAgICAgICAgICAgIC5nZXRDb21wdXRlZFN0eWxlKHRoaXMudmlldywgbnVsbClcbiAgICAgICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKFwiZm9udC1mYW1pbHlcIilcbiAgICAgICAgICAgIC5zcGxpdChcIiwgXCIpO1xuICAgICAgICB2YXIgZmlsbGVyVGV4dCA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5LC4vIUAjJCVeJiotK1wiO1xuICAgICAgICB0ZW1wQ2FudmFzQ3R4LmZvbnQgPSB0aGlzLnZpZXcuZm9udFNpemUgKyBcIiBzZXJpZlwiO1xuICAgICAgICB2YXIgc2VyaWZXaWR0aCA9IHRlbXBDYW52YXNDdHgubWVhc3VyZVRleHQoZmlsbGVyVGV4dCkud2lkdGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zc2libGVGb250cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHBvc3NpYmxlRm9udHNbaV0uaW5jbHVkZXMoJ1wiJykpIHtcbiAgICAgICAgICAgICAgICBwb3NzaWJsZUZvbnRzW2ldID0gcG9zc2libGVGb250c1tpXS5yZXBsYWNlQWxsKCdcIicsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBvc3NpYmxlRm9udHNbaV0uaW5jbHVkZXMoXCInXCIpKSB7XG4gICAgICAgICAgICAgICAgcG9zc2libGVGb250c1tpXSA9IHBvc3NpYmxlRm9udHNbaV0ucmVwbGFjZUFsbChcIidcIiwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0ZW1wQ2FudmFzQ3R4LmZvbnQgPSB0aGlzLnZpZXcuZm9udFNpemUgKyBcIiBcIiArIHBvc3NpYmxlRm9udHNbaV07XG4gICAgICAgICAgICBpZiAodGVtcENhbnZhc0N0eC5tZWFzdXJlVGV4dChmaWxsZXJUZXh0KS53aWR0aCAhPT0gc2VyaWZXaWR0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMudmlldy5mb250RmFtaWx5ID0gcG9zc2libGVGb250c1tpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBbnN3ZXIgdGhlIGJsb2NrIHRoYXQgdGhpcyBsaW5lIGlzIGN1cnJlbnRseSBpblxuICAgIGJsb2NrKCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucHJvYmxlbS5ibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBibG9jayA9IHRoaXMucHJvYmxlbS5ibG9ja3NbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGJsb2NrLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLmxpbmVzW2pdID09PSB0aGlzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBibG9jaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gQW5zd2VyIHRoZSBpbmRlbnQgYmFzZWQgb24gdGhlIHZpZXdcbiAgICB2aWV3SW5kZW50KCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRlbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSB0aGlzLmJsb2NrKCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbmRlbnQgLSBibG9jay5zb2x1dGlvbkluZGVudCgpICsgYmxvY2suaW5kZW50O1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFjZWhvbGRlckxpbmUgZXh0ZW5kcyBQYXJzb25zTGluZSB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbSkge1xuICAgICAgICBzdXBlcihwcm9ibGVtLCBcInBsYWNlaG9sZGVyXCIsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5pc1BsYWNlaG9sZGVyTGluZSA9IHRydWU7XG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVCYXNlZEdyYWRlciB7XG4gICAgY29uc3RydWN0b3IocHJvYmxlbSkge1xuICAgICAgICB0aGlzLnByb2JsZW0gPSBwcm9ibGVtO1xuICAgIH1cbiAgICAvLyBVc2UgYSBMSVMgKExvbmdlc3QgSW5jcmVhc2luZyBTdWJzZXF1ZW5jZSkgYWxnb3JpdGhtIHRvIHJldHVybiB0aGUgaW5kZXhlc1xuICAgIC8vIHRoYXQgYXJlIG5vdCBwYXJ0IG9mIHRoYXQgc3Vic2VxdWVuY2UuXG4gICAgaW52ZXJzZUxJU0luZGljZXMoYXJyKSB7XG4gICAgICAgIC8vIEdldCBhbGwgc3Vic2VxdWVuY2VzXG4gICAgICAgIHZhciBhbGxTdWJzZXF1ZW5jZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBzdWJzZXF1ZW5jZUZvckN1cnJlbnQgPSBbYXJyW2ldXSxcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gYXJyW2ldLFxuICAgICAgICAgICAgICAgIGxhc3RFbGVtZW50QWRkZWQgPSAtMTtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSBpOyBqIDwgYXJyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHN1YnNlcXVlbnQgPSBhcnJbal07XG4gICAgICAgICAgICAgICAgaWYgKHN1YnNlcXVlbnQgPiBjdXJyZW50ICYmIGxhc3RFbGVtZW50QWRkZWQgPCBzdWJzZXF1ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNlcXVlbmNlRm9yQ3VycmVudC5wdXNoKHN1YnNlcXVlbnQpO1xuICAgICAgICAgICAgICAgICAgICBsYXN0RWxlbWVudEFkZGVkID0gc3Vic2VxdWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhbGxTdWJzZXF1ZW5jZXMucHVzaChzdWJzZXF1ZW5jZUZvckN1cnJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZpZ3VyZSBvdXQgdGhlIGxvbmdlc3Qgb25lXG4gICAgICAgIHZhciBsb25nZXN0U3Vic2VxdWVuY2VMZW5ndGggPSAtMTtcbiAgICAgICAgdmFyIGxvbmdlc3RTdWJzZXF1ZW5jZTtcbiAgICAgICAgZm9yIChsZXQgaSBpbiBhbGxTdWJzZXF1ZW5jZXMpIHtcbiAgICAgICAgICAgIHZhciBzdWJzID0gYWxsU3Vic2VxdWVuY2VzW2ldO1xuICAgICAgICAgICAgaWYgKHN1YnMubGVuZ3RoID4gbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbG9uZ2VzdFN1YnNlcXVlbmNlTGVuZ3RoID0gc3Vicy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbG9uZ2VzdFN1YnNlcXVlbmNlID0gc3VicztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgdGhlIGludmVyc2UgaW5kZXhlc1xuICAgICAgICB2YXIgaW5kZXhlcyA9IFtdO1xuICAgICAgICB2YXIgbEluZGV4ID0gMDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChsSW5kZXggPiBsb25nZXN0U3Vic2VxdWVuY2UubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoYXJyW2ldID09IGxvbmdlc3RTdWJzZXF1ZW5jZVtsSW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgICAgIGxJbmRleCArPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxuICAgIC8vIGdyYWRlIHRoYXQgZWxlbWVudCwgcmV0dXJuaW5nIHRoZSBzdGF0ZVxuICAgIGdyYWRlKCkge1xuICAgICAgICB2YXIgcHJvYmxlbSA9IHRoaXMucHJvYmxlbTtcbiAgICAgICAgcHJvYmxlbS5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzID0gMDtcbiAgICAgICAgdGhpcy5wZXJjZW50TGluZXMgPSAwO1xuICAgICAgICB0aGlzLmluY29ycmVjdEluZGVudHMgPSAwO1xuICAgICAgICB2YXIgc29sdXRpb25MaW5lcyA9IHByb2JsZW0uc29sdXRpb247XG4gICAgICAgIHZhciBhbnN3ZXJMaW5lcyA9IHByb2JsZW0uYW5zd2VyTGluZXMoKTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBzdGF0ZTtcbiAgICAgICAgdGhpcy5wZXJjZW50TGluZXMgPVxuICAgICAgICAgICAgTWF0aC5taW4oYW5zd2VyTGluZXMubGVuZ3RoLCBzb2x1dGlvbkxpbmVzLmxlbmd0aCkgL1xuICAgICAgICAgICAgTWF0aC5tYXgoYW5zd2VyTGluZXMubGVuZ3RoLCBzb2x1dGlvbkxpbmVzLmxlbmd0aCk7XG4gICAgICAgIGlmIChhbnN3ZXJMaW5lcy5sZW5ndGggPCBzb2x1dGlvbkxpbmVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdFRvb1Nob3J0XCI7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGggPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChhbnN3ZXJMaW5lcy5sZW5ndGggPT0gc29sdXRpb25MaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdExlbmd0aCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IFwiaW5jb3JyZWN0TW92ZUJsb2Nrc1wiO1xuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGVuZ3RoID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciB0aGUgY29kZSAqKnRoYXQgaXMgdGhlcmUqKiBpcyBpbiB0aGUgY29ycmVjdCBvcmRlclxuICAgICAgICAvLyBJZiB0aGVyZSBpcyB0b28gbXVjaCBvciB0b28gbGl0dGxlIGNvZGUgdGhpcyBvbmx5IG1hdHRlcnMgZm9yXG4gICAgICAgIC8vIGNhbGN1bGF0aW5nIGEgcGVyY2VudGFnZSBzY29yZS5cbiAgICAgICAgbGV0IGlzQ29ycmVjdE9yZGVyID0gdGhpcy5jaGVja0NvcnJlY3RPcmRlcmluZyhzb2x1dGlvbkxpbmVzLCBhbnN3ZXJMaW5lcylcblxuICAgICAgICAvLyBEZXRlcm1pbmUgd2hldGhlciBibG9ja3MgYXJlIGluZGVudGVkIGNvcnJlY3RseVxuICAgICAgICBsZXQgaXNDb3JyZWN0SW5kZW50cyA9IHRoaXMuY2hlY2tDb3JyZWN0SW5kZW50YXRpb24oc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpO1xuXG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIGlzQ29ycmVjdEluZGVudHMgJiZcbiAgICAgICAgICAgIGlzQ29ycmVjdE9yZGVyICYmXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RMZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBQZXJmZWN0XG4gICAgICAgICAgICBzdGF0ZSA9IFwiY29ycmVjdFwiO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY29ycmVjdExlbmd0aCAmJiBpc0NvcnJlY3RPcmRlcikge1xuICAgICAgICAgICAgc3RhdGUgPSBcImluY29ycmVjdEluZGVudFwiO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0NvcnJlY3RPcmRlciAmJiBzdGF0ZSAhPSBcImluY29ycmVjdFRvb1Nob3J0XCIpIHtcbiAgICAgICAgICAgIHN0YXRlID0gXCJpbmNvcnJlY3RNb3ZlQmxvY2tzXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVQZXJjZW50KCk7XG4gICAgICAgIHRoaXMuZ3JhZGVyU3RhdGUgPSBzdGF0ZTtcblxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuXG4gICAgY2hlY2tDb3JyZWN0SW5kZW50YXRpb24oc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpIHtcbiAgICAgICAgaWYoIXRoaXMucHJvYmxlbS51c2VzSW5kZW50YXRpb24oKSlcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgICAgIHRoaXMuaW5kZW50TGVmdCA9IFtdO1xuICAgICAgICB0aGlzLmluZGVudFJpZ2h0ID0gW107XG4gICAgICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuc3dlckxpbmVzW2ldLnZpZXdJbmRlbnQoKSA8IHNvbHV0aW9uTGluZXNbaV0uaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnRSaWdodC5wdXNoKGFuc3dlckxpbmVzW2ldKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYW5zd2VyTGluZXNbaV0udmlld0luZGVudCgpID4gc29sdXRpb25MaW5lc1tpXS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluZGVudExlZnQucHVzaChhbnN3ZXJMaW5lc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID1cbiAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5sZW5ndGggKyB0aGlzLmluZGVudFJpZ2h0Lmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gdGhpcy5pbmNvcnJlY3RJbmRlbnRzID09IDA7XG4gICAgfVxuXG4gICAgY2hlY2tDb3JyZWN0T3JkZXJpbmcoc29sdXRpb25MaW5lcywgYW5zd2VyTGluZXMpIHtcbiAgICAgICAgbGV0IGlzQ29ycmVjdE9yZGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgICAgICB0aGlzLnNvbHV0aW9uTGVuZ3RoID0gc29sdXRpb25MaW5lcy5sZW5ndGg7XG4gICAgICAgIGxldCBsb29wTGltaXQgPSBNYXRoLm1pbihzb2x1dGlvbkxpbmVzLmxlbmd0aCwgYW5zd2VyTGluZXMubGVuZ3RoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuc3dlckxpbmVzW2ldLnRleHQgIT09IHNvbHV0aW9uTGluZXNbaV0udGV4dCkge1xuICAgICAgICAgICAgICAgIGlzQ29ycmVjdE9yZGVyID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdExpbmVzICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGlzQ29ycmVjdE9yZGVyXG4gICAgfVxuXG4gICAgY2FsY3VsYXRlUGVyY2VudCgpIHtcbiAgICAgICAgbGV0IG51bUxpbmVzID0gdGhpcy5wZXJjZW50TGluZXMgKiAwLjI7XG4gICAgICAgIGxldCBsaW5lcyA9IHRoaXMucHJvYmxlbS5hbnN3ZXJMaW5lcygpLmxlbmd0aDtcbiAgICAgICAgbGV0IG51bUNvcnJlY3RCbG9ja3MgPSAodGhpcy5jb3JyZWN0TGluZXMgLyBsaW5lcykgKiAwLjQ7XG4gICAgICAgIGxldCBudW1Db3JyZWN0SW5kZW50cyA9XG4gICAgICAgICAgICAoKHRoaXMuY29ycmVjdExpbmVzIC0gdGhpcy5pbmNvcnJlY3RJbmRlbnRzKSAvIGxpbmVzKSAqIDAuNDtcblxuICAgICAgICBsZXQgc2NvcmUgPSBudW1MaW5lcyArIG51bUNvcnJlY3RCbG9ja3MgKyBudW1Db3JyZWN0SW5kZW50cztcbiAgICAgICAgc2NvcmUgPSBNYXRoLm1heChzY29yZSwgMCk7XG4gICAgICAgIHRoaXMucHJvYmxlbS5wZXJjZW50ID0gc2NvcmU7XG4gICAgfVxufVxuIiwiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT09IFBhcnNvbnNCbG9jayBPYmplY3QgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IFRoZSBtb2RlbCBhbmQgdmlldyBvZiBhIGNvZGUgYmxvY2suXG49PT09IFBST1BFUlRJRVMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09IHByb2JsZW06IHRoZSBQYXJzb25zIHByb2JsZW1cbj09PT09PT09IGxpbmVzOiBhbiBhcnJheSBvZiBQYXJzb25zTGluZSBpbiB0aGlzIGJsb2NrXG49PT09PT09PSBpbmRlbnQ6IGluZGVudCBiYXNlZCBvbiBtb3ZlbWVudFxuPT09PT09PT0gdmlldzogYW4gZWxlbWVudCBmb3Igdmlld2luZyB0aGlzIG9iamVjdFxuPT09PT09PT0gbGFiZWxzOiBbbGFiZWwsIGxpbmVdIHRoZSBsYWJlbHMgbnVtYmVyaW5nIHRoZSBibG9jayBhbmQgdGhlIGxpbmVzIHRoZXkgZ28gb25cbj09PT09PT09IGhhbW1lcjogdGhlIGNvbnRyb2xsZXIgYmFzZWQgb24gaGFtbWVyLmpzXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuaW1wb3J0IEhhbW1lciBmcm9tIFwiLi9oYW1tZXIubWluLmpzXCI7XG5cbi8vIEluaXRpYWxpemUgYmFzZWQgb24gdGhlIHByb2JsZW0gYW5kIHRoZSBsaW5lc1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFyc29uc0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtLCBsaW5lcykge1xuICAgICAgICB0aGlzLnByb2JsZW0gPSBwcm9ibGVtO1xuICAgICAgICB0aGlzLmxpbmVzID0gbGluZXM7XG4gICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgdGhpcy5sYWJlbHMgPSBbXTtcbiAgICAgICAgLy8gQ3JlYXRlIHZpZXcsIGFkZGluZyB2aWV3IG9mIGxpbmVzIGFuZCB1cGRhdGluZyBpbmRlbnRcbiAgICAgICAgdmFyIHZpZXcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2aWV3LmlkID0gcHJvYmxlbS5jb3VudGVySWQgKyBcIi1ibG9jay1cIiArIHByb2JsZW0uYmxvY2tJbmRleDtcbiAgICAgICAgcHJvYmxlbS5ibG9ja0luZGV4ICs9IDE7XG4gICAgICAgICQodmlldykuYWRkQ2xhc3MoXCJibG9ja1wiKTtcbiAgICAgICAgdmFyIHNoYXJlZEluZGVudCA9IGxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2hhcmVkSW5kZW50ID0gTWF0aC5taW4oc2hhcmVkSW5kZW50LCBsaW5lc1tpXS5pbmRlbnQpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsaW5lRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJChsaW5lRGl2KS5hZGRDbGFzcyhcImxpbmVzXCIpO1xuICAgICAgICAkKHZpZXcpLmFwcGVuZChsaW5lRGl2KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGxpbmUgPSBsaW5lc1tpXTtcbiAgICAgICAgICAgIHZhciBsaW5lSW5kZW50O1xuICAgICAgICAgICAgaWYgKHByb2JsZW0ubm9pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICBsaW5lSW5kZW50ID0gbGluZS5pbmRlbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxpbmVJbmRlbnQgPSBsaW5lLmluZGVudCAtIHNoYXJlZEluZGVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQobGluZS52aWV3KS5yZW1vdmVDbGFzcyhcImluZGVudDEgaW5kZW50MiBpbmRlbnQzIGluZGVudDQgaW5kZW50NSBpbmRlbnQ2XCIpO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlICE9IFwibmF0dXJhbFwiICYmXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgIT0gXCJtYXRoXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lSW5kZW50ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKGxpbmUudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRcIiArIGxpbmVJbmRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbmVEaXYuYXBwZW5kQ2hpbGQobGluZS52aWV3KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGFiZWxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKGxhYmVsRGl2KS5hZGRDbGFzcyhcImxhYmVsc1wiKTtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS5vcHRpb25zLm51bWJlcmVkID09IFwibGVmdFwiKSB7XG4gICAgICAgICAgICAkKGxpbmVEaXYpLmFkZENsYXNzKFwiYm9yZGVyX2xlZnRcIik7XG4gICAgICAgICAgICAkKHZpZXcpLnByZXBlbmQobGFiZWxEaXYpO1xuICAgICAgICAgICAgJCh2aWV3KS5jc3Moe1xuICAgICAgICAgICAgICAgIFwianVzdGlmeS1jb250ZW50XCI6IFwiZmxleC1zdGFydFwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAkKGxhYmVsRGl2KS5hZGRDbGFzcyhcImJvcmRlcl9sZWZ0XCIpO1xuICAgICAgICAgICAgJChsYWJlbERpdikuY3NzKHtcbiAgICAgICAgICAgICAgICBmbG9hdDogXCJyaWdodFwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKHZpZXcpLmNzcyh7XG4gICAgICAgICAgICAgICAgXCJqdXN0aWZ5LWNvbnRlbnRcIjogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQodmlldykuYXBwZW5kKGxhYmVsRGl2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgICAgICAvLyBpcyBub3QgcGxhY2Vob2xkZXIgYnkgZGVmYXVsdFxuICAgICAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgLy8gQWRkIGEgbGluZSAoZnJvbSBhbm90aGVyIGJsb2NrKSB0byB0aGlzIGJsb2NrXG4gICAgYWRkTGluZShsaW5lKSB7XG4gICAgICAgICQobGluZS52aWV3KS5yZW1vdmVDbGFzcyhcImluZGVudDEgaW5kZW50MiBpbmRlbnQzIGluZGVudDQgaW5kZW50NSBpbmRlbnQ2XCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm5vaW5kZW50KSB7XG4gICAgICAgICAgICBpZiAobGluZS5pbmRlbnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgJChsaW5lLnZpZXcpLmFkZENsYXNzKFwiaW5kZW50XCIgKyBsaW5lLmluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSB0aGlzLmxpbmVzO1xuICAgICAgICAgICAgdmFyIHNoYXJlZEluZGVudCA9IGxpbmVzWzBdLmluZGVudDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBzaGFyZWRJbmRlbnQgPSBNYXRoLm1pbihzaGFyZWRJbmRlbnQsIGxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2hhcmVkSW5kZW50IDwgbGluZS5pbmRlbnQpIHtcbiAgICAgICAgICAgICAgICAkKGxpbmUudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRcIiArIChsaW5lLmluZGVudCAtIHNoYXJlZEluZGVudCkpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFyZWRJbmRlbnQgPiBsaW5lLmluZGVudCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChsaW5lc1tpXS52aWV3KS5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW5kZW50MSBpbmRlbnQyIGluZGVudDMgaW5kZW50NCBpbmRlbnQ1IGluZGVudDZcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAvLyB0b2RvOiBpZiBsYW5ndWFnZSBpcyBuYXR1cmFsIG9yIG1hdGggdGhlbiBkb24ndCBkbyB0aGlzXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5vcHRpb25zLmxhbmd1YWdlICE9PSBcIm5hdHVyYWxcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLm9wdGlvbnMubGFuZ3VhZ2UgIT09IFwibWF0aFwiXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJChsaW5lc1tpXS52aWV3KS5hZGRDbGFzcyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImluZGVudFwiICsgKGxpbmVzW2ldLmluZGVudCAtIGxpbmUuaW5kZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpbmVzLnB1c2gobGluZSk7XG4gICAgICAgICQodGhpcy52aWV3KS5jaGlsZHJlbihcIi5saW5lc1wiKVswXS5hcHBlbmRDaGlsZChsaW5lLnZpZXcpO1xuICAgIH1cbiAgICAvLyBBZGQgdGhlIGNvbnRlbnRzIG9mIHRoYXQgYmxvY2sgdG8gbXlzZWxmIGFuZCB0aGVuIGRlbGV0ZSB0aGF0IGJsb2NrXG4gICAgY29uc3VtZUJsb2NrKGJsb2NrKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2subGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuYWRkTGluZShibG9jay5saW5lc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCQoYmxvY2sudmlldykuYXR0cihcInRhYmluZGV4XCIpID09IFwiMFwiKSB7XG4gICAgICAgICAgICB0aGlzLm1ha2VUYWJJbmRleCgpO1xuICAgICAgICB9XG4gICAgICAgICQoYmxvY2sudmlldykuZGV0YWNoKCk7XG4gICAgICAgIHZhciBuZXdCbG9ja3MgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnByb2JsZW0uYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLmJsb2Nrc1tpXSAhPT0gYmxvY2spIHtcbiAgICAgICAgICAgICAgICBuZXdCbG9ja3MucHVzaCh0aGlzLnByb2JsZW0uYmxvY2tzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrLmxhYmVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5hZGRMYWJlbChcbiAgICAgICAgICAgICAgICBibG9jay5sYWJlbHNbaV1bMF0sXG4gICAgICAgICAgICAgICAgdGhpcy5saW5lcy5sZW5ndGggLSBibG9jay5saW5lcy5sZW5ndGggKyBibG9jay5sYWJlbHNbaV1bMV1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9ibGVtLmJsb2NrcyA9IG5ld0Jsb2NrcztcbiAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgIH1cbiAgICAvLyBVcGRhdGUgdGhlIG1vZGVsIGFuZCB2aWV3IHdoZW4gYmxvY2sgaXMgY29udmVydGVkIHRvIGNvbnRhaW4gaW5kZW50XG4gICAgYWRkSW5kZW50KCkge1xuICAgICAgICAvLyBVcGRhdGUgdGhlIGxpbmVzIG1vZGVsIC8gdmlld1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsaW5lID0gdGhpcy5saW5lc1tpXTtcbiAgICAgICAgICAgIGlmIChsaW5lLmluZGVudCA+IDApIHtcbiAgICAgICAgICAgICAgICAkKGxpbmUudmlldykucmVtb3ZlQ2xhc3MoXCJpbmRlbnQxIGluZGVudDIgaW5kZW50MyBpbmRlbnQ0IGluZGVudDUgaW5kZW50NlwiKTtcbiAgICAgICAgICAgICAgICAkKGxpbmUudmlldykuYWRkQ2xhc3MoXCJpbmRlbnRcIiArIGxpbmUuaW5kZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBVcGRhdGUgdGhlIGJsb2NrIG1vZGVsIC8gdmlld1xuICAgICAgICB0aGlzLmluZGVudCA9IDA7XG4gICAgICAgICQodGhpcy52aWV3KS5jc3Moe1xuICAgICAgICAgICAgXCJwYWRkaW5nLWxlZnRcIjogXCJcIixcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnByb2JsZW0uYXJlYVdpZHRoIC0gMjIsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvLyBBZGQgYSBsYWJlbCB0byBibG9jayBhbmQgdXBkYXRlIGl0cyB2aWV3XG4gICAgYWRkTGFiZWwobGFiZWwsIGxpbmUpIHtcbiAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICQoZGl2KS5hZGRDbGFzcyhcImJsb2NrLWxhYmVsXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJyaWdodFwiKSB7XG4gICAgICAgICAgICAkKGRpdikuYWRkQ2xhc3MoXCJyaWdodC1sYWJlbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLm9wdGlvbnMubnVtYmVyZWQgPT0gXCJsZWZ0XCIpIHtcbiAgICAgICAgICAgICQoZGl2KS5hZGRDbGFzcyhcImxlZnQtbGFiZWxcIik7XG4gICAgICAgIH1cbiAgICAgICAgJChkaXYpLmFwcGVuZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsYWJlbCkpO1xuICAgICAgICAkKHRoaXMudmlldykuY2hpbGRyZW4oXCIubGFiZWxzXCIpWzBdLmFwcGVuZChkaXYpO1xuICAgICAgICBpZiAodGhpcy5sYWJlbHMubGVuZ3RoICE9IDApIHtcbiAgICAgICAgICAgICQoZGl2KS5jc3MoXG4gICAgICAgICAgICAgICAgXCJtYXJnaW4tdG9wXCIsXG4gICAgICAgICAgICAgICAgKGxpbmUgLSB0aGlzLmxhYmVsc1t0aGlzLmxhYmVscy5sZW5ndGggLSAxXVsxXSAtIDEpICpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5lc1tsaW5lXS52aWV3Lm9mZnNldEhlaWdodFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhYmVscy5wdXNoKFtsYWJlbCwgbGluZV0pO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIEludGVyYWN0aXZpdHlcbiAgICBpbml0aWFsaXplSW50ZXJhY3Rpdml0eSgpIHtcbiAgICAgICAgaWYgKCQodGhpcy52aWV3KS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgIHRoaXMuaGFtbWVyID0gbmV3IEhhbW1lci5NYW5hZ2VyKHRoaXMudmlldywge1xuICAgICAgICAgICAgcmVjb2duaXplcnM6IFtcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgIEhhbW1lci5QYW4sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogSGFtbWVyLkRJUkVDVElPTl9BTEwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJlc2hvbGQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy5oYW1tZXIub24oXCJwYW5zdGFydFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHRoYXQucGFuU3RhcnQoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5oYW1tZXIub24oXCJwYW5lbmRcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LnBhbkVuZChldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmhhbW1lci5vbihcInBhbm1vdmVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LnBhbk1vdmUoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYm9vbGVhbiBhcyB0byB3aGV0aGVyIHRoaXMgYmxvY2sgaXMgYWJsZSB0byBiZSBzZWxlY3RlZFxuICAgIGVuYWJsZWQoKSB7XG4gICAgICAgIHJldHVybiAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIpICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGJvb2xlYW4gYXMgdG8gd2hldGhlciB0aGlzIGJsb2NrIGlzIGEgZGlzdHJhY3RvclxuICAgIGlzRGlzdHJhY3RvcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGluZXNbMF0uZGlzdHJhY3RvcjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIGEgYm9vbGVhbiBhcyB0byB3aGV0aGVyIHRoaXMgYmxvY2sgaXMgaW4gdGhlIHNvdXJjZSBhcmVhXG4gICAgaW5Tb3VyY2VBcmVhKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5jaGlsZE5vZGVzO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdGhlIHBhZ2UgWCBwb3NpdGlvbiBvZiB0aGUgY2VudGVyIG9mIHRoZSB2aWV3XG4gICAgcGFnZVhDZW50ZXIoKSB7XG4gICAgICAgIHZhciBib3VuZGluZ1JlY3QgPSB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBwYWdlWENlbnRlciA9XG4gICAgICAgICAgICB3aW5kb3cucGFnZVhPZmZzZXQgKyBib3VuZGluZ1JlY3QubGVmdCArIGJvdW5kaW5nUmVjdC53aWR0aCAvIDI7XG4gICAgICAgIHJldHVybiBwYWdlWENlbnRlcjtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHRoZSBwYWdlIFkgcG9zaXRpb24gb2YgdGhlIGNlbnRlciBvZiB0aGUgdmlld1xuICAgIHBhZ2VZQ2VudGVyKCkge1xuICAgICAgICB2YXIgYm91bmRpbmdSZWN0ID0gdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgcGFnZVlDZW50ZXIgPVxuICAgICAgICAgICAgd2luZG93LnBhZ2VZT2Zmc2V0ICsgYm91bmRpbmdSZWN0LnRvcCArIGJvdW5kaW5nUmVjdC5oZWlnaHQgLyAyO1xuICAgICAgICByZXR1cm4gcGFnZVlDZW50ZXI7XG4gICAgfVxuICAgIC8vIE9mIGFsbCB0aGUgbGluZSBpbmRlbnRzLCByZXR1cm4gdGhlIG1pbmltdW0gdmFsdWVcbiAgICBtaW5pbXVtTGluZUluZGVudCgpIHtcbiAgICAgICAgdmFyIG1pbmltdW1MaW5lSW5kZW50ID0gdGhpcy5saW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbWluaW11bUxpbmVJbmRlbnQgPSBNYXRoLm1pbihcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmVzW2ldLmluZGVudCxcbiAgICAgICAgICAgICAgICBtaW5pbXVtTGluZUluZGVudFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluaW11bUxpbmVJbmRlbnQ7XG4gICAgfVxuICAgIC8vIFJldHVybiB0aGUgbGFzdCBibG9jayBpbiB0aGUgc291cmNlIGFyZWEgdGhhdCBtYXRjaGVzIHRoZSBwYWlyZWQgYmluIGl0IGlzIGluXG4gICAgc2xpZGVVbmRlckJsb2NrKCkge1xuICAgICAgICB2YXIgc291cmNlQmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICBpZiAoc291cmNlQmxvY2tzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYWlyZWRCaW4gPSB0aGlzLnBhaXJlZEJpbigpO1xuICAgICAgICBpZiAocGFpcmVkQmluID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlQmxvY2tzW3NvdXJjZUJsb2Nrcy5sZW5ndGggLSAxXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc291cmNlQmxvY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgYmxvY2sgPSBzb3VyY2VCbG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2sucGFpcmVkQmluKCkgPT0gcGFpcmVkQmluKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VyY2VCbG9ja3Nbc291cmNlQmxvY2tzLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gd2hpY2ggcGFpcmVkIGJpbiBpdCBpcyBpbiAoLTEpIGlmIG5vdFxuICAgIHBhaXJlZEJpbigpIHtcbiAgICAgICAgdmFyIHBhaXJlZEJpbnMgPSB0aGlzLnByb2JsZW0ucGFpcmVkQmlucztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWlyZWRCaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXRjaGVzQmluKHBhaXJlZEJpbnNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiBhbGwgbGluZXMgYXJlIGluIHRoYXQgYmluXG4gICAgbWF0Y2hlc0JpbihiaW4pIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgdGVzdCA9IHRoaXMubGluZXNbaV0uaW5kZXg7XG4gICAgICAgICAgICBpZiAoYmluLmluZGV4T2YodGVzdCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIFJldHVybiBhIGxpc3Qgb2YgaW5kZXhlcyB3aGVyZSB0aGlzIGJsb2NrIGNvdWxkIGJlIGluc2VydGVkIGJlZm9yZVxuICAgIHZhbGlkU291cmNlSW5kZXhlcygpIHtcbiAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgdmFyIGluZGV4ZXMgPSBbXTtcbiAgICAgICAgdmFyIHBhaXJlZEJpbiA9IHRoaXMucGFpcmVkQmluKCk7XG4gICAgICAgIHZhciBpLCBsYXN0QmluO1xuICAgICAgICBpZiAocGFpcmVkQmluID49IDApIHtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZpZXcuaWQgIT09IHRoaXMudmlldy5pZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmxvY2tCaW4gPSBibG9jay5wYWlyZWRCaW4oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrQmluID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxhc3RCaW4gPT0gcGFpcmVkQmluKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGFzdEJpbiA9IGJsb2NrQmluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsYXN0QmluID09IHBhaXJlZEJpbikge1xuICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChibG9ja3MubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXhlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYmxvY2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2sgPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoYmxvY2sudmlldy5pZCAhPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJsb2NrQmluID0gYmxvY2sucGFpcmVkQmluKCk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2NrQmluICE9PSBsYXN0QmluKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJsb2NrQmluID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGFzdEJpbiA9IGJsb2NrQmluO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluZGV4ZXMucHVzaChibG9ja3MubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGluZGV4ZXM7XG4gICAgfVxuICAgIC8vIEEgbWVhc3VyZSBvZiBob3cgZmFyIHRoZSBtaWRkbGUgb2YgdGhpcyBibG9jayBpcyB2ZXJ0aWNhbGx5IHBvc2l0aW9uZWRcbiAgICB2ZXJ0aWNhbE9mZnNldCgpIHtcbiAgICAgICAgdmFyIHZlcnRpY2FsT2Zmc2V0O1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmVydGljYWxPZmZzZXQgPVxuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ID1cbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgIH1cbiAgICAgICAgdmVydGljYWxPZmZzZXQgPVxuICAgICAgICAgICAgdGhpcy52aWV3LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArXG4gICAgICAgICAgICB0aGlzLnZpZXcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tIC1cbiAgICAgICAgICAgIHZlcnRpY2FsT2Zmc2V0ICogMjtcbiAgICAgICAgcmV0dXJuIHZlcnRpY2FsT2Zmc2V0O1xuICAgIH1cbiAgICAvLyBUaGlzIGJsb2NrIGp1c3QgZ2FpbmVkIHRleHR1YWwgZm9jdXNcbiAgICBuZXdGb2N1cygpIHtcbiAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uZW50ZXJLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZlID0gZmFsc2U7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuYWRkQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPT0gdGhpcykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcInVwXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuYWRkQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYWxyZWFkeSBpbiBrZXlib2FyZCBtb2RlXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzID0gdGhpcztcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwiZG93blwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IGZhbHNlO1xuICAgIH1cbiAgICAvLyBUaGlzIGJsb2NrIGp1c3QgbG9zdCB0ZXh0dWFsIGZvY3VzXG4gICAgcmVsZWFzZUZvY3VzKCkge1xuICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQ2xhc3MoXCJkb3duIHVwXCIpO1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMucHJvYmxlbS50ZXh0TW92aW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gZXhpdCBvdXQgb2YgcHJvYmxlbSBidXQgc3RheSB3YXkgaW50byBwcm9ibGVtXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia21vdmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0TW92ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb2RlVGFpbG9yOiB1cGRhdGUgcGxhY2Vob2xkZXJzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmV4aXRLZXlib2FyZE1vZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJlY29tZSBzZWxlY3RhYmxlLCBidXQgbm90IGFjdGl2ZVxuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiLCBcIi0xXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLnVuYmluZChcImZvY3VzXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLnVuYmluZChcImJsdXJcIik7XG4gICAgICAgICAgICAkKHRoaXMudmlldykudW5iaW5kKFwia2V5ZG93blwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBNYWtlIHRoaXMgYmxvY2sgaW50byB0aGUga2V5Ym9hcmQgZW50cnkgcG9pbnRcbiAgICBtYWtlVGFiSW5kZXgoKSB7XG4gICAgICAgICQodGhpcy52aWV3KS5hdHRyKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgICQodGhpcy52aWV3KS5mb2N1cyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0Lm5ld0ZvY3VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKHRoaXMudmlldykuYmx1cihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGF0LnJlbGVhc2VGb2N1cygpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCh0aGlzLnZpZXcpLmtleWRvd24oZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB0aGF0LmtleURvd24oZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHRvIGRpc2FibGUgaW50ZXJhY3Rpb24gZm9yIHRoZSBmdXR1cmVcbiAgICBkaXNhYmxlKCkge1xuICAgICAgICBpZiAodGhpcy5oYW1tZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oYW1tZXIuc2V0KHsgZW5hYmxlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiKSA9PSBcIjBcIikge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5yZW1vdmVBdHRyKFwidGFiaW5kZXhcIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uaW5pdGlhbGl6ZVRhYkluZGV4KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQXR0cihcInRhYmluZGV4XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEVuYWJsZSBmdW5jdGlvbmFsaXR5IGFmdGVyIHJlc2V0IGJ1dHRvbiBoYXMgYmVlbiBwcmVzc2VkXG4gICAgcmVzZXRWaWV3KCkge1xuICAgICAgICBpZiAodGhpcy5oYW1tZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5oYW1tZXIuc2V0KHsgZW5hYmxlOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghJCh0aGlzLnZpZXcpWzBdLmhhc0F0dHJpYnV0ZShcInRhYmluZGV4XCIpKSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykuYXR0cihcInRhYmluZGV4XCIsIFwiLTFcIik7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnZpZXcpLmNzcyh7IG9wYWNpdHk6IFwiXCIgfSk7XG4gICAgfVxuICAgIC8vIENhbGxlZCB0byBkZXN0cm95IGludGVyYWN0aW9uIGZvciB0aGUgZnV0dXJlXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFtbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuaGFtbWVyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmhhbW1lcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJCh0aGlzLnZpZXcpLmF0dHIoXCJ0YWJpbmRleFwiKSA9PSBcIjBcIikge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlRm9jdXMoKTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQXR0cihcInRhYmluZGV4XCIpO1xuICAgIH1cbiAgICAvLyBDYWxsZWQgd2hlbiBhIGJsb2NrIGlzIHBpY2tlZCB1cFxuICAgIHBhblN0YXJ0KGV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJvYmxlbS5jbGVhckZlZWRiYWNrKCk7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0uc3RhcnRlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGxvZyB0aGUgZmlyc3QgdGltZSB0aGF0IHNvbWV0aGluZyBnZXRzIG1vdmVkXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ubG9nTW92ZShcInN0YXJ0XCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dEZvY3VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIHN0b3AgdGV4dCBmb2N1cyB3aGVuIGRyYWdnaW5nXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dEZvY3VzLnJlbGVhc2VGb2N1cygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmcgPSB0aGlzO1xuICAgICAgICAvLyBVcGRhdGUgdGhlIHZpZXdcbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZ1ggPSBldmVudC5zcmNFdmVudC5wYWdlWDtcbiAgICAgICAgdGhpcy5wcm9ibGVtLm1vdmluZ1kgPSBldmVudC5zcmNFdmVudC5wYWdlWTtcbiAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHdoZW4gYSBibG9jayBpcyBkcm9wcGVkXG4gICAgcGFuRW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJvYmxlbS5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgZGVsZXRlIHRoaXMucHJvYmxlbS5tb3Zpbmc7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb2JsZW0ubW92aW5nWDtcbiAgICAgICAgZGVsZXRlIHRoaXMucHJvYmxlbS5tb3ZpbmdZO1xuICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICB0aGlzLnByb2JsZW0ubG9nTW92ZShcIm1vdmVcIik7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVQbGFjZWhvbGRlcnMoKTtcbiAgICB9XG4gICAgLy8gQ2FsbGVkIHdoZW4gYSBibG9jayBpcyBtb3ZlZFxuICAgIHBhbk1vdmUoZXZlbnQpIHtcbiAgICAgICAgLy8gVXBkYXRlIHRoZSB2aWV3XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdYID0gZXZlbnQuc3JjRXZlbnQucGFnZVg7XG4gICAgICAgIHRoaXMucHJvYmxlbS5tb3ZpbmdZID0gZXZlbnQuc3JjRXZlbnQucGFnZVk7XG4gICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgfVxuICAgIC8vIEhhbmRsZSBhIGtleXByZXNzIGV2ZW50IHdoZW4gaW4gZm9jdXNcbiAgICBrZXlEb3duKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnByb2JsZW0uc3RhcnRlZCA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIGxvZyB0aGUgZmlyc3QgdGltZSB0aGF0IHNvbWV0aGluZyBnZXRzIG1vdmVkXG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0ubG9nTW92ZShcImtzdGFydFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW92ZUxlZnQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdExlZnQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM4OiAvLyB1cFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlVXAoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFVwKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb2JsZW0udGV4dE1vdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdFJpZ2h0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvYmxlbS50ZXh0TW92ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmVEb3duKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3REb3duKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDMyOiAvLyBzcGFjZVxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTW92ZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEzOiAvLyBlbnRlclxuICAgICAgICAgICAgICAgIHRoaXMudG9nZ2xlTW92ZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayBsZWZ0XG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIHZhciBpbmRleCwgYmxvY2s7XG4gICAgICAgIGlmICghdGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZW50ID09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBtb3ZlIHRvIHNvdXJjZSBhcmVhXG4gICAgICAgICAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgICAgIHZhciB2YWxpZFNvdXJjZUluZGV4ZXMgPSB0aGlzLnZhbGlkU291cmNlSW5kZXhlcygpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gdmFsaWRTb3VyY2VJbmRleGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnNvdXJjZUFyZWEuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2sgPSBibG9ja3NbaW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsb2NrLnZlcnRpY2FsT2Zmc2V0KCkgPj0gb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZSh0aGlzLnZpZXcsIGJsb2NrLnZpZXcpO1xuICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByZWR1Y2UgaW5kZW50XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRlbnQgPSB0aGlzLmluZGVudCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgYmxvY2sgdXBcbiAgICBtb3ZlVXAoKSB7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLnNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciB2YWxpZFNvdXJjZUluZGV4ZXMgPSB0aGlzLnZhbGlkU291cmNlSW5kZXhlcygpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWxpZFNvdXJjZUluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPVxuICAgICAgICAgICAgICAgICAgICB2YWxpZFNvdXJjZUluZGV4ZXNbdmFsaWRTb3VyY2VJbmRleGVzLmxlbmd0aCAtIDEgLSBpXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPCBibG9ja3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBibG9jayA9IGJsb2Nrc1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChibG9jay52ZXJ0aWNhbE9mZnNldCgpIDwgb2Zmc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc291cmNlQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBibG9ja3MgPSB0aGlzLnByb2JsZW0uYW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChibG9ja3NbaV0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUoXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbaSAtIDFdLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBibG9jayByaWdodFxuICAgIG1vdmVSaWdodCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5Tb3VyY2VBcmVhKCkpIHtcbiAgICAgICAgICAgIC8vIG1vdmUgdG8gYW5zd2VyIGFyZWFcbiAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gMDtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnZlcnRpY2FsT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgYW5zd2VyQmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbnN3ZXJCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGFuc3dlckJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgICAgICBpZiAoaXRlbU9mZnNldCA+PSBvZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5pbnNlcnRCZWZvcmUodGhpcy52aWV3LCBpdGVtLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW4gYW5zd2VyIGFyZWE6IGluY3JlYXNlIHRoZSBpbmRlbnRcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGVudCAhPT0gdGhpcy5wcm9ibGVtLmluZGVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZW50ID0gdGhpcy5pbmRlbnQgKyAxO1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgYmxvY2sgZG93blxuICAgIG1vdmVEb3duKCkge1xuICAgICAgICBpZiAodGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgbGV0IGJsb2NrcyA9IHRoaXMucHJvYmxlbS5zb3VyY2VCbG9ja3MoKTtcbiAgICAgICAgICAgIHZhciB2YWxpZFNvdXJjZUluZGV4ZXMgPSB0aGlzLnZhbGlkU291cmNlSW5kZXhlcygpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBteUluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbGlkU291cmNlSW5kZXhlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHZhbGlkU291cmNlSW5kZXhlc1tpXTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT0gYmxvY2tzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmFwcGVuZENoaWxkKHRoaXMudmlldyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy52aWV3KS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uc3RhdGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS51cGRhdGVWaWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggLSBteUluZGV4ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zb3VyY2VBcmVhLmluc2VydEJlZm9yZShcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2Nrc1tpbmRleF0udmlld1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMudmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnN0YXRlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udXBkYXRlVmlldygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmFuc3dlckJsb2NrcygpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzW2ldLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IGJsb2Nrcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpID09IGJsb2Nrcy5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2JsZW0uYW5zd2VyQXJlYS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLmFuc3dlckFyZWEuaW5zZXJ0QmVmb3JlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9ja3NbaSArIDJdLnZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS5zdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVZpZXcoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gbGVmdFxuICAgIHNlbGVjdExlZnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5pblNvdXJjZUFyZWEoKSkge1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMudmVydGljYWxPZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2VCbG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICAgICAgaWYgKHNvdXJjZUJsb2Nrcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGNob29zZU5leHQgPSBzb3VyY2VCbG9ja3NbMF07XG4gICAgICAgICAgICB2YXIgY2hvb3NlT2Zmc2V0ID0gY2hvb3NlTmV4dC52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBzb3VyY2VCbG9ja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHNvdXJjZUJsb2Nrc1tpXTtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbU9mZnNldCA9IGl0ZW0udmVydGljYWxPZmZzZXQoKSAtIG9mZnNldDtcbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoaXRlbU9mZnNldCkgPCBNYXRoLmFicyhjaG9vc2VPZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSBpdGVtO1xuICAgICAgICAgICAgICAgICAgICBjaG9vc2VPZmZzZXQgPSBpdGVtT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSBjaG9vc2VOZXh0O1xuICAgICAgICAgICAgY2hvb3NlTmV4dC5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgICAgICQoY2hvb3NlTmV4dC52aWV3KS5mb2N1cygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIHVwXG4gICAgc2VsZWN0VXAoKSB7XG4gICAgICAgIHZhciBjaG9vc2VOZXh0ID0gZmFsc2U7XG4gICAgICAgIHZhciBibG9ja3M7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gYmxvY2tzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGJsb2Nrc1tpXTtcbiAgICAgICAgICAgIGlmIChjaG9vc2VOZXh0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaXRlbS5tYWtlVGFiSW5kZXgoKTtcbiAgICAgICAgICAgICAgICAkKGl0ZW0udmlldykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlldy5pZCA9PSB0aGlzLnZpZXcuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8vIE1vdmUgc2VsZWN0aW9uIHJpZ2h0XG4gICAgc2VsZWN0UmlnaHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gdGhpcy52ZXJ0aWNhbE9mZnNldCgpO1xuICAgICAgICAgICAgdmFyIGJsb2NrcyA9IHRoaXMucHJvYmxlbS5lbmFibGVkQW5zd2VyQmxvY2tzKCk7XG4gICAgICAgICAgICBpZiAoYmxvY2tzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgY2hvb3NlTmV4dCA9IGJsb2Nrc1swXTtcbiAgICAgICAgICAgIHZhciBjaG9vc2VPZmZzZXQgPSBjaG9vc2VOZXh0LnZlcnRpY2FsT2Zmc2V0KCkgLSBvZmZzZXQ7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYmxvY2tzW2ldO1xuICAgICAgICAgICAgICAgIHZhciBpdGVtT2Zmc2V0ID0gaXRlbS52ZXJ0aWNhbE9mZnNldCgpIC0gb2Zmc2V0O1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhpdGVtT2Zmc2V0KSA8IE1hdGguYWJzKGNob29zZU9mZnNldCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlTmV4dCA9IGl0ZW07XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU9mZnNldCA9IGl0ZW1PZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnRleHRGb2N1cyA9IGNob29zZU5leHQ7XG4gICAgICAgICAgICBjaG9vc2VOZXh0Lm1ha2VUYWJJbmRleCgpO1xuICAgICAgICAgICAgJChjaG9vc2VOZXh0LnZpZXcpLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gTW92ZSBzZWxlY3Rpb24gZG93blxuICAgIHNlbGVjdERvd24oKSB7XG4gICAgICAgIHZhciBjaG9vc2VOZXh0ID0gZmFsc2U7XG4gICAgICAgIHZhciBibG9ja3M7XG4gICAgICAgIGlmICh0aGlzLmluU291cmNlQXJlYSgpKSB7XG4gICAgICAgICAgICBibG9ja3MgPSB0aGlzLnByb2JsZW0uZW5hYmxlZFNvdXJjZUJsb2NrcygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvY2tzID0gdGhpcy5wcm9ibGVtLmVuYWJsZWRBbnN3ZXJCbG9ja3MoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBibG9ja3NbaV07XG4gICAgICAgICAgICBpZiAoY2hvb3NlTmV4dCkge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvYmxlbS50ZXh0Rm9jdXMgPSBpdGVtO1xuICAgICAgICAgICAgICAgIGl0ZW0ubWFrZVRhYkluZGV4KCk7XG4gICAgICAgICAgICAgICAgJChpdGVtLnZpZXcpLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXcuaWQgPT0gdGhpcy52aWV3LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNob29zZU5leHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBUb2dnbGUgd2hldGhlciB0byBtb3ZlIHRoaXMgYmxvY2tcbiAgICB0b2dnbGVNb3ZlKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9ibGVtLnRleHRNb3ZlKSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQ2xhc3MoXCJ1cFwiKTtcbiAgICAgICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcImRvd25cIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHJvYmxlbS5sb2dNb3ZlKFwia21vdmVcIik7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQbGFjZWhvbGRlcikge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9ibGVtLnVwZGF0ZVBsYWNlaG9sZGVycygpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMudmlldykucmVtb3ZlQ2xhc3MoXCJkb3duXCIpO1xuICAgICAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwidXBcIik7XG4gICAgICAgICAgICB0aGlzLnByb2JsZW0udGV4dE1vdmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEFuc3dlciBhIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhpcyBjb2RlYmxvY2sgZm9yIHNhdmluZ1xuICAgIGhhc2goKSB7XG4gICAgICAgIHZhciBoYXNoID0gXCJcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBoYXNoICs9IHRoaXMubGluZXNbaV0uaW5kZXggKyBcIl9cIjtcbiAgICAgICAgfVxuICAgICAgICBoYXNoICs9IHRoaXMuaW5kZW50O1xuICAgICAgICByZXR1cm4gaGFzaDtcbiAgICB9XG4gICAgLy8gQW5zd2VyIHdoYXQgdGhlIGluZGVudCBzaG91bGQgYmUgZm9yIHRoZSBzb2x1dGlvblxuICAgIHNvbHV0aW9uSW5kZW50KCkge1xuICAgICAgICB2YXIgc2hhcmVkSW5kZW50ID0gdGhpcy5saW5lc1swXS5pbmRlbnQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgdGhpcy5saW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc2hhcmVkSW5kZW50ID0gTWF0aC5taW4oc2hhcmVkSW5kZW50LCB0aGlzLmxpbmVzW2ldLmluZGVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNoYXJlZEluZGVudDtcbiAgICB9XG59IiwiaW1wb3J0IExpbmVCYXNlZEdyYWRlciBmcm9tIFwiLi9saW5lR3JhZGVyXCI7XG5pbXBvcnQgeyBEaUdyYXBoLCBoYXNQYXRoLCBpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoIH0gZnJvbSBcIi4vZGFnSGVscGVyc1wiO1xuXG5mdW5jdGlvbiBncmFwaFRvTlgoYW5zd2VyTGluZXMpIHtcbiAgdmFyIGdyYXBoID0gbmV3IERpR3JhcGgoKTtcbiAgZm9yIChsZXQgbGluZTEgb2YgYW5zd2VyTGluZXMpIHtcbiAgICBncmFwaC5hZGROb2RlKGxpbmUxLnRhZyk7XG4gICAgZm9yIChsZXQgbGluZTJ0YWcgb2YgbGluZTEuZGVwZW5kcykge1xuICAgICAgLy8gdGhlIGRlcGVuZHMgZ3JhcGggbGlzdHMgdGhlICppbmNvbWluZyogZWRnZXMgb2YgYSBub2RlXG4gICAgICBncmFwaC5hZGRFZGdlKGxpbmUydGFnLCBsaW5lMS50YWcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZ3JhcGg7XG59XG5cbmZ1bmN0aW9uIGlzVmVydGV4Q292ZXIoZ3JhcGgsIHZlcnRleENvdmVyKSB7XG4gIGZvciAobGV0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMoKSkge1xuICAgIGlmICghKHZlcnRleENvdmVyLmhhcyhlZGdlWzBdKSB8fCB2ZXJ0ZXhDb3Zlci5oYXMoZWRnZVsxXSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBGaW5kIGFsbCBzdWJzZXRzIG9mIHRoZSBzZXQgdXNpbmcgdGhlIGNvcnJlc3BvbmRlbmNlIG9mIHN1YnNldHMgb2Zcbi8vIGEgc2V0IHRvIGJpbmFyeSBzdHJpbmcgd2hvc2UgbGVuZ3RoIGFyZSB0aGUgc2l6ZSBvZiB0aGUgc2V0XG5mdW5jdGlvbiBhbGxTdWJzZXRzKGFycikge1xuICBsZXQgc3Vic2V0cyA9IHt9O1xuICBmb3IgKGxldCBpID0gMDsgaSA8PSBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJzZXRzW2ldID0gW107XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLnBvdygyLCBhcnIubGVuZ3RoKTsgaSsrKSB7XG4gICAgbGV0IGJpbiA9IGkudG9TdHJpbmcoMik7XG4gICAgd2hpbGUgKGJpbi5sZW5ndGggPCBhcnIubGVuZ3RoKSB7XG4gICAgICBiaW4gPSBcIjBcIiArIGJpbjtcbiAgICB9XG4gICAgbGV0IHN1YnNldCA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJpbi5sZW5ndGg7IGorKykge1xuICAgICAgaWYgKGJpbltqXSA9PSBcIjFcIikge1xuICAgICAgICBzdWJzZXQuYWRkKGFycltqXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1YnNldHNbc3Vic2V0LnNpemVdLnB1c2goc3Vic2V0KTtcbiAgfVxuICByZXR1cm4gc3Vic2V0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREFHR3JhZGVyIGV4dGVuZHMgTGluZUJhc2VkR3JhZGVyIHtcbiAgaW52ZXJzZUxJU0luZGljZXMoYXJyLCBpblNvbHV0aW9uKSB7XG4gICAgLy8gRm9yIG1vcmUgZGV0YWlscyBhbmQgYSBwcm9vZiBvZiB0aGUgY29ycmVjdG5lc3Mgb2YgdGhlIGFsZ29yaXRobSwgc2VlIHRoZSBwYXBlcjogaHR0cHM6Ly9hcnhpdi5vcmcvYWJzLzIyMDQuMDQxOTZcblxuICAgIHZhciBzb2x1dGlvbiA9IHRoaXMucHJvYmxlbS5zb2x1dGlvbjtcbiAgICB2YXIgYW5zd2VyTGluZXMgPSBpblNvbHV0aW9uLm1hcCgoYmxvY2spID0+IGJsb2NrLmxpbmVzWzBdKTsgLy8gYXNzdW1lIE5PVCBhZGFwdGl2ZSBmb3IgREFHIGdyYWRpbmcgKGZvciBub3cpXG5cbiAgICBsZXQgZ3JhcGggPSBncmFwaFRvTlgoc29sdXRpb24pO1xuXG4gICAgbGV0IHNlZW4gPSBuZXcgU2V0KCk7XG4gICAgbGV0IHByb2JsZW1hdGljU3ViZ3JhcGggPSBuZXcgRGlHcmFwaCgpO1xuICAgIGZvciAobGV0IGxpbmUxIG9mIGFuc3dlckxpbmVzKSB7XG4gICAgICBmb3IgKGxldCBsaW5lMiBvZiBzZWVuKSB7XG4gICAgICAgIGxldCBwcm9ibGVtYXRpYyA9IGhhc1BhdGgoZ3JhcGgsIHtcbiAgICAgICAgICBzb3VyY2U6IGxpbmUxLnRhZyxcbiAgICAgICAgICB0YXJnZXQ6IGxpbmUyLnRhZyxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwcm9ibGVtYXRpYykge1xuICAgICAgICAgIHByb2JsZW1hdGljU3ViZ3JhcGguYWRkRWRnZShsaW5lMS50YWcsIGxpbmUyLnRhZyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2Vlbi5hZGQobGluZTEpO1xuICAgIH1cblxuICAgIGxldCBtdmMgPSBudWxsO1xuICAgIGxldCBzdWJzZXRzID0gYWxsU3Vic2V0cyhwcm9ibGVtYXRpY1N1YmdyYXBoLm5vZGVzKCkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHByb2JsZW1hdGljU3ViZ3JhcGgubnVtYmVyT2ZOb2RlcygpOyBpKyspIHtcbiAgICAgIGZvciAobGV0IHN1YnNldCBvZiBzdWJzZXRzW2ldKSB7XG4gICAgICAgIGlmIChpc1ZlcnRleENvdmVyKHByb2JsZW1hdGljU3ViZ3JhcGgsIHN1YnNldCkpIHtcbiAgICAgICAgICBtdmMgPSBzdWJzZXQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtdmMgIT0gbnVsbCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgaW5kaWNlcyA9IFsuLi5tdmNdLm1hcCgodGFnKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFuc3dlckxpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbnN3ZXJMaW5lc1tpXS50YWcgPT09IHRhZykgcmV0dXJuIGk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGluZGljZXM7XG4gIH1cblxuICBjaGVja0NvcnJlY3RJbmRlbnRhdGlvbigpIHtcbiAgICAgIGlmKCF0aGlzLnByb2JsZW0udXNlc0luZGVudGF0aW9uKCkpXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICAgIHRoaXMuaW5kZW50TGVmdCA9IFtdO1xuICAgICAgdGhpcy5pbmRlbnRSaWdodCA9IFtdO1xuICAgICAgLy8gRm9yIGRhZyBwcm9ibGVtcywgb25seSBjaGVjayB0aGUgaW5kZW50YXRpb24gb2YgZWFjaCBibG9jayBpbiB0aGUgcHJvYmxlbVxuICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLnByb2JsZW0uYmxvY2tzKSB7XG4gICAgICAgICAgLy8gU2tpcCBkaXN0cmFjdG9yIGJsb2Nrc1xuICAgICAgICAgIGlmIChibG9jay5pc0Rpc3RyYWN0b3IoKSlcbiAgICAgICAgICAgICAgY29udGludWU7XG5cbiAgICAgICAgICBjb25zdCBjdXJJbmRlbnQgPSBibG9jay5pbmRlbnQ7XG4gICAgICAgICAgY29uc3QgZXhwZWN0ZWRJbmRlbnQgPSBibG9jay5zb2x1dGlvbkluZGVudCgpO1xuICAgICAgICAgIC8vIElmIG1pc3NtYXRjaCwgYWRkIGZpcnN0IGxpbmUgb2YgYmxvY2sgdG8gdGhlIGNvcnJlY3QgaW5kZW50IGxpc3QgZm9yXG4gICAgICAgICAgLy8gVUkgdXBkYXRpbmdcbiAgICAgICAgICBpZiAoY3VySW5kZW50IDwgZXhwZWN0ZWRJbmRlbnQpXG4gICAgICAgICAgICAgIHRoaXMuaW5kZW50UmlnaHQucHVzaChibG9jay5saW5lc1swXSk7XG4gICAgICAgICAgZWxzZSBpZiAoY3VySW5kZW50ID4gZXhwZWN0ZWRJbmRlbnQpXG4gICAgICAgICAgICAgIHRoaXMuaW5kZW50TGVmdC5wdXNoKGJsb2NrLmxpbmVzWzBdKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5pbmNvcnJlY3RJbmRlbnRzID1cbiAgICAgICAgICB0aGlzLmluZGVudExlZnQubGVuZ3RoICsgdGhpcy5pbmRlbnRSaWdodC5sZW5ndGg7XG5cbiAgICAgIHJldHVybiB0aGlzLmluY29ycmVjdEluZGVudHMgPT0gMDtcbiAgfVxuXG4gIGNoZWNrQ29ycmVjdE9yZGVyaW5nKHNvbHV0aW9uTGluZXMsIGFuc3dlckxpbmVzKSB7XG4gICAgaWYgKCFpc0RpcmVjdGVkQWN5Y2xpY0dyYXBoKGdyYXBoVG9OWChzb2x1dGlvbkxpbmVzKSkpIHtcbiAgICAgIHRocm93IFwiRGVwZW5kZW5jeSBiZXR3ZWVuIGJsb2NrcyBkb2VzIG5vdCBmb3JtIGEgRGlyZWN0ZWQgQWN5Y2xpYyBHcmFwaDsgUHJvYmxlbSB1bnNvbHZhYmxlLlwiO1xuICAgIH1cblxuICAgIGxldCBzZWVuID0gbmV3IFNldCgpO1xuICAgIGxldCBpc0NvcnJlY3RPcmRlciA9IHRydWU7XG4gICAgdGhpcy5jb3JyZWN0TGluZXMgPSAwO1xuICAgIHRoaXMuc29sdXRpb25MZW5ndGggPSBzb2x1dGlvbkxpbmVzLmxlbmd0aDtcbiAgICBsZXQgbG9vcExpbWl0ID0gTWF0aC5taW4oc29sdXRpb25MaW5lcy5sZW5ndGgsIGFuc3dlckxpbmVzLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb29wTGltaXQ7IGkrKykge1xuICAgICAgbGV0IGxpbmUgPSBhbnN3ZXJMaW5lc1tpXTtcbiAgICAgIGlmIChsaW5lLmRpc3RyYWN0b3IpIHtcbiAgICAgICAgaXNDb3JyZWN0T3JkZXIgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbGluZS5kZXBlbmRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgaWYgKCFzZWVuLmhhcyhsaW5lLmRlcGVuZHNbal0pKSB7XG4gICAgICAgICAgICBpc0NvcnJlY3RPcmRlciA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzQ29ycmVjdE9yZGVyKSB7XG4gICAgICAgIHRoaXMuY29ycmVjdExpbmVzICs9IDE7XG4gICAgICB9XG4gICAgICBzZWVuLmFkZChsaW5lLnRhZyk7XG4gICAgfVxuICAgIHJldHVybiBpc0NvcnJlY3RPcmRlcjtcbiAgfVxufVxuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19wYXJzb25fY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRhclwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHA6XCJBanVkYVwiLFxuICAgICAgICBtc2dfcGFyc29uX3Rvb19zaG9ydDogXCJTZXUgcHJvZ3JhbWEgw6kgbXVpdG8gY3VydG8uIEFkaWNpb25lIG1haXMgYmxvY29zLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2RyYWdfZnJvbV9oZXJlOiBcIkFycmFzdGUgZGFxdWlcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiTGFyZ3VlIG9zIGJsb2NvcyBhcXVpXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9maXJzdF90cnk6XG4gICAgICAgICAgICBcIlBlcmZlaXRvISBWb2PDqiBsZXZvdSBhcGVuYXMgdW1hIHRlbnRhdGl2YSBwYXJhIHJlc29sdmVyLiBCb20gdHJhYmFsaG8hXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdDpcbiAgICAgICAgICAgIFwiUGVyZmVpdG8hIFZvY8OqIGxldm91ICQxIHRlbnRhdGl2YXMgcGFyYSByZXNvbHZlci4gQ2xpcXVlIGVtIFJlc2V0YXIgcGFyYSB0ZW50YXIgcmVzb2x2ZXIgZW0gdW1hIHRlbnRhdGl2YS5cIiAsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50OlxuICAgICAgICAgICAgXCJFc3RlIGJsb2NvIG7Do28gZXN0w6EgaW5kZW50YWRvIGNvcnJldGFtZW50ZS4gSW5kZW50ZSBtYWlzIGFycmFzdGFuZG8tbyBwYXJhIGEgZGlyZWl0YSBvdSByZWR1emEgYSBpbmRlbnRhw6fDo28gYXJyYXN0YW5kbyBwYXJhIGEgZXNxdWVyZGEuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50czpcbiAgICAgICAgICAgIFwiRXN0ZXMgYmxvY29zIG7Do28gZXN0w6NvIGluZGVudGFkb3MgY29ycmV0YW1lbnRlLiBQYXJhIGluZGVudGFyIG1haXMsIGFycmFzdGUgbyBibG9jbyBwYXJhIGEgZGlyZWl0YS4gUGFyYSByZWR1emlyIGEgaW5kZW50YcOnw6NvLCBhcnJhc3RlIHBhcmEgYSBlc3F1ZXJkYS5cIixcbiAgICAgICAgbXNnX3BhcnNvbl93cm9uZ19vcmRlcjpcbiAgICAgICAgICAgIFwiQmxvY29zIGRlc3RhY2Fkb3Mgbm8gc2V1IHByb2dyYW1hIGVzdMOjbyBlcnJhZG9zIG91IGVzdMOjbyBuYSBvcmRlbSBlcnJhZGEuIElzc28gcG9kZSBzZXIgcmVzb2x2aWRvIG1vdmVuZG8sIGV4Y2x1aW5kbyBvdSBzdWJzdGl0dWluZG8gb3MgYmxvY29zIGRlc3RhY2Fkb3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGU6XG4gICAgICAgICAgICBcIlVzZSBhcyB0ZWNsYXMgZGUgc2V0YXMgcGFyYSBuYXZlZ2FyLiBFc3Bhw6dvIHBhcmEgc2VsZWNpb25hci8gZGVzbWFyY2FyIGJsb2NvcyBwYXJhIG1vdmVyLlwiLFxuICAgICAgICBtc2dfcGFyc29uX2hlbHBfaW5mbzpcbiAgICAgICAgICAgIFwiQ2xpcXVlIG5vIGJvdMOjbyBBanVkYSBzZSB2b2PDqiBxdWlzZXIgZmFjaWxpdGFyIG8gcHJvYmxlbWFcIixcbiAgICAgICAgbXNnX3BhcnNvbl9ub3Rfc29sdXRpb246XG4gICAgICAgICAgICBcIkZvaSBkZXNhYmlsaXRhZG8gdW0gYmxvY28gZGUgY8OzZGlnbyBkZXNuZWNlc3PDoXJpbyAocXVlIG7Do28gZmF6IHBhcnRlIGRhIHNvbHXDp8OjbykuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50OlwiRm9pIGZvcm5lY2lkYSBhIGluZGVudGHDp8Ojby5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3M6XCJEb2lzIGJsb2NvcyBkZSBjw7NkaWdvcyBmb3JhbSBjb21iaW5hZG9zIGVtIHVtLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3Q6XG4gICAgICAgICAgICBcIlNlcsOhIHJlbW92aWRvIHVtIGJsb2NvIGRlIGPDs2RpZ28gaW5jb3JyZXRvIGRhIMOhcmVhIGRlIHJlc3Bvc3RhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd2lsbF9jb21iaW5lOlwiU2Vyw6NvIGNvbWJpbmFkb3MgZG9pcyBibG9jb3NcIixcbiAgICAgICAgbXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzOlxuICAgICAgICAgICAgXCJWb2PDqiBkZXZlIHRlbnRhciBwZWxvIG1lbm9zIHRyw6pzIHZlemVzIGFudGVzIGRlIHBlZGlyIGFqdWRhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fdGhyZWVfYmxvY2tzX2xlZnQ6XG4gICAgICAgICAgICBcIlJlc3RhbSBhcGVuYXMgMyBibG9jb3MgY29ycmV0b3MuIFZvY8OqIGRldmUgY29sb2PDoS1sb3MgZW0gb3JkZW1cIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX3Byb3ZpZGVfaW5kZW50OiBcIlNlcsOhIGZvcm5lY2lkYSBhIGluZGVudGHDp8Ojb1wiXG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IFBhcnNvbnNCbG9jayBmcm9tIFwiLi9wYXJzb25zQmxvY2tcIjtcbmltcG9ydCBQYXJzb25zTGluZSBmcm9tIFwiLi9wYXJzb25zTGluZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFjZWhvbGRlckJsb2NrIGV4dGVuZHMgUGFyc29uc0Jsb2NrIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9ibGVtLCBwbGFjZWhvbGRlckxpbmVzLCBwbGFjZWhvbGRlclNpemUsIGFmdGVyU2V0dGxlZEJsb2NrQ291bnQpIHtcbiAgICAgICAgLy8gcHJvYmxlbTogUGFyc29ucyBpbnN0YW5jZVxuICAgICAgICAvLyBzaXplOiBob3cgbWFueSBibG9ja3MgaXQgaXMgaG9sZGluZ1xuXG4gICAgICAgIC8vIGhhdmUgdG8gaGF2ZSBhdCBsZWFzdCBvbmUgcGFyc29uc2xpbmVzLCBvdGhlcndpc2Ugd2lsbCBiZSBlcnJvciBpbiBQYXJzb25zQmxvY2suXG4gICAgICAgIHN1cGVyKHByb2JsZW0sIHBsYWNlaG9sZGVyTGluZXMpO1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyTGluZXMgPSBwbGFjZWhvbGRlckxpbmVzO1xuICAgICAgICB0aGlzLmFmdGVyU2V0dGxlZEJsb2NrQ291bnQgPSBhZnRlclNldHRsZWRCbG9ja0NvdW50O1xuXG4gICAgICAgIC8vIGNyZWF0ZSBhIG5vcm1hbCBwYXJzb25zIGJsb2NrLCBidXQgdXNlIGNzcyB0byBjb250cm9sIHZpc2liaWxpdHkgb2Ygbm9ybWFsIGNvbnRlbnRcbiAgICAgICAgJCh0aGlzLnZpZXcpLmFkZENsYXNzKFwicGxhY2Vob2xkZXItYmxvY2tcIik7XG4gICAgICAgICQodGhpcy52aWV3KS5hZGRDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gY3JlYXRlIGEgbmV3IGRpdiBkaXNwbGF5aW5nIGhvdyBtYW55IGJsb2NrcyBhcmUgbWlzc2luZ1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyU2l6ZSA9IHBsYWNlaG9sZGVyU2l6ZTtcbiAgICAgICAgdmFyIGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgJChjb250ZW50KS5hZGRDbGFzcyhcInBsYWNlaG9sZGVyLXRleHRcIik7XG4gICAgICAgIGlmIChwbGFjZWhvbGRlclNpemUgPiAxKSB7XG4gICAgICAgICAgICBjb250ZW50LmlubmVyVGV4dCA9IGAke3BsYWNlaG9sZGVyU2l6ZX0gYmxvY2tzIGFyZSBtaXNzaW5nIGhlcmVgO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGVudC5pbm5lclRleHQgPSBgJHtwbGFjZWhvbGRlclNpemV9IGJsb2NrIGlzIG1pc3NpbmcgaGVyZWA7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzLnZpZXcpLmFwcGVuZChjb250ZW50KTtcblxuICAgICAgICB0aGlzLmlzUGxhY2Vob2xkZXIgPSB0cnVlO1xuICAgIH1cbn0iLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfcGFyc29uX2NoZWNrX21lOiBcIkNoZWNrXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcmVzZXQ6IFwiUmVzZXRcIixcbiAgICAgICAgbXNnX3BhcnNvbl9oZWxwOiBcIkhlbHAgbWVcIixcbiAgICAgICAgbXNnX3BhcnNvbl90b29fc2hvcnQ6IFwiWW91ciBhbnN3ZXIgaXMgdG9vIHNob3J0LiBBZGQgbW9yZSBibG9ja3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fZHJhZ19mcm9tX2hlcmU6IFwiRHJhZyBmcm9tIGhlcmVcIixcbiAgICAgICAgbXNnX3BhcnNvbl9kcmFnX3RvX2hlcmU6IFwiRHJvcCBibG9ja3MgaGVyZVwiLFxuICAgICAgICBtc2dfcGFyc29uX2NvcnJlY3RfZmlyc3RfdHJ5OlxuICAgICAgICAgICAgXCJQZXJmZWN0ISAgSXQgdG9vayB5b3Ugb25seSBvbmUgdHJ5IHRvIHNvbHZlIHRoaXMuICBHcmVhdCBqb2IhXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdDpcbiAgICAgICAgICAgIFwiUGVyZmVjdCEgIEl0IHRvb2sgeW91ICQxIHRyaWVzIHRvIHNvbHZlIHRoaXMuICBDbGljayBSZXNldCB0byB0cnkgdG8gc29sdmUgaXQgaW4gb25lIGF0dGVtcHQuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fY29ycmVjdF9ydW5uYWJsZTpcbiAgICAgICAgICAgIFwiQ2xpY2sgUnVuIGJlbG93IHRvIHRlc3Qgb3V0IHlvdXIgc29sdXRpb24uXCIsXG4gICAgICAgIG1zZ19wYXJzb25fd3JvbmdfaW5kZW50OlxuICAgICAgICAgICAgXCJUaGlzIGJsb2NrIGlzIG5vdCBpbmRlbnRlZCBjb3JyZWN0bHkuIEVpdGhlciBpbmRlbnQgaXQgbW9yZSBieSBkcmFnZ2luZyBpdCByaWdodCBvciByZWR1Y2UgdGhlIGluZGVudGlvbiBieSBkcmFnZ2luZyBpdCBsZWZ0LlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX2luZGVudHM6XG4gICAgICAgICAgICBcIlRoZXNlIGJsb2NrcyBhcmUgbm90IGluZGVudGVkIGNvcnJlY3RseS4gVG8gaW5kZW50IGEgYmxvY2sgbW9yZSwgZHJhZyBpdCB0byB0aGUgcmlnaHQuIFRvIHJlZHVjZSB0aGUgaW5kZW50aW9uLCBkcmFnIGl0IHRvIHRoZSBsZWZ0LlwiLFxuICAgICAgICBtc2dfcGFyc29uX3dyb25nX29yZGVyOlxuICAgICAgICAgICAgXCJIaWdobGlnaHRlZCBibG9ja3MgaW4geW91ciBhbnN3ZXIgYXJlIHdyb25nIG9yIGFyZSBpbiB0aGUgd3Jvbmcgb3JkZXIuIFRoaXMgY2FuIGJlIGZpeGVkIGJ5IG1vdmluZywgcmVtb3ZpbmcsIG9yIHJlcGxhY2luZyBoaWdobGlnaHRlZCBibG9ja3MuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fYXJyb3dfbmF2aWdhdGU6XG4gICAgICAgICAgICBcIkFycm93IGtleXMgdG8gbmF2aWdhdGUuIFNwYWNlIHRvIHNlbGVjdCAvIGRlc2VsZWN0IGJsb2NrIHRvIG1vdmUuXCIsXG4gICAgICAgIG1zZ19wYXJzb25faGVscF9pbmZvOlxuICAgICAgICAgICAgXCJDbGljayBvbiB0aGUgSGVscCBNZSBidXR0b24gaWYgeW91IHdhbnQgdG8gbWFrZSB0aGUgcHJvYmxlbSBlYXNpZXJcIixcbiAgICAgICAgbXNnX3BhcnNvbl9ub3Rfc29sdXRpb246XG4gICAgICAgICAgICBcIkRpc2FibGVkIGFuIHVubmVlZGVkIGNvZGUgYmxvY2sgKG9uZSB0aGF0IGlzIG5vdCBwYXJ0IG9mIHRoZSBzb2x1dGlvbikuXCIsXG4gICAgICAgIG1zZ19wYXJzb25fcHJvdmlkZWRfaW5kZW50OiBcIlByb3ZpZGVkIHRoZSBpbmRlbnRhdGlvbi5cIixcbiAgICAgICAgbXNnX3BhcnNvbl9jb21iaW5lZF9ibG9ja3M6IFwiQ29tYmluZWQgdHdvIGNvZGUgYmxvY2tzIGludG8gb25lLlwiLFxuICAgICAgICBtc2dfcGFyc29uX3JlbW92ZV9pbmNvcnJlY3Q6XG4gICAgICAgICAgICBcIldpbGwgcmVtb3ZlIGFuIGluY29ycmVjdCBjb2RlIGJsb2NrIGZyb20gYW5zd2VyIGFyZWFcIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX2NvbWJpbmU6IFwiV2lsbCBjb21iaW5lIHR3byBibG9ja3NcIixcbiAgICAgICAgbXNnX3BhcnNvbl9hdGxlYXN0X3RocmVlX2F0dGVtcHRzOlxuICAgICAgICAgICAgXCJZb3UgbXVzdCBtYWtlIGF0IGxlYXN0IHRocmVlIGRpc3RpbmN0IGZ1bGwgYXR0ZW1wdHMgYXQgYSBzb2x1dGlvbiBiZWZvcmUgeW91IGNhbiBnZXQgaGVscFwiLFxuICAgICAgICBtc2dfcGFyc29uX3RocmVlX2Jsb2Nrc19sZWZ0OlxuICAgICAgICAgICAgXCJUaGVyZSBhcmUgb25seSAzIGNvcnJlY3QgYmxvY2tzIGxlZnQuICBZb3Ugc2hvdWxkIGJlIGFibGUgdG8gcHV0IHRoZW0gaW4gb3JkZXJcIixcbiAgICAgICAgbXNnX3BhcnNvbl93aWxsX3Byb3ZpZGVfaW5kZW50OiBcIldpbGwgcHJvdmlkZSBpbmRlbnRhdGlvblwiLFxuICAgIH0sXG59KTtcbiIsIi8vIFRPRE8gLSBIb3cgbXVjaCBvZiB0aGlzIGlzIG5lZWRlZD8gTG90cyBvZiBvdmVybGFwIHdpdGggd2hhdCBzeW50YXggaGlnaGxpZ2h0aW5nXG4vLyB2aWEgcHJldGV4dCB0aGVtZSBkb2VzLi4uXG5cbmZ1bmN0aW9uIEgoKSB7XG4gICAgdmFyIHggPVxuICAgICAgICBuYXZpZ2F0b3IgJiZcbiAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudCAmJlxuICAgICAgICAvXFxiTVNJRSA2XFwuLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIEggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfTtcbiAgICByZXR1cm4geDtcbn1cbihmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB4KGIpIHtcbiAgICAgICAgYiA9IGIuc3BsaXQoLyAvZyk7XG4gICAgICAgIHZhciBhID0ge307XG4gICAgICAgIGZvciAodmFyIGMgPSBiLmxlbmd0aDsgLS1jID49IDA7ICkge1xuICAgICAgICAgICAgdmFyIGQgPSBiW2NdO1xuICAgICAgICAgICAgaWYgKGQpIGFbZF0gPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgeSA9IFwiYnJlYWsgY29udGludWUgZG8gZWxzZSBmb3IgaWYgcmV0dXJuIHdoaWxlIFwiLFxuICAgICAgICBVID1cbiAgICAgICAgICAgIHkgK1xuICAgICAgICAgICAgXCJhdXRvIGNhc2UgY2hhciBjb25zdCBkZWZhdWx0IGRvdWJsZSBlbnVtIGV4dGVybiBmbG9hdCBnb3RvIGludCBsb25nIHJlZ2lzdGVyIHNob3J0IHNpZ25lZCBzaXplb2Ygc3RhdGljIHN0cnVjdCBzd2l0Y2ggdHlwZWRlZiB1bmlvbiB1bnNpZ25lZCB2b2lkIHZvbGF0aWxlIFwiLFxuICAgICAgICBEID1cbiAgICAgICAgICAgIFUgK1xuICAgICAgICAgICAgXCJjYXRjaCBjbGFzcyBkZWxldGUgZmFsc2UgaW1wb3J0IG5ldyBvcGVyYXRvciBwcml2YXRlIHByb3RlY3RlZCBwdWJsaWMgdGhpcyB0aHJvdyB0cnVlIHRyeSBcIixcbiAgICAgICAgSSA9XG4gICAgICAgICAgICBEICtcbiAgICAgICAgICAgIFwiYWxpZ25vZiBhbGlnbl91bmlvbiBhc20gYXhpb20gYm9vbCBjb25jZXB0IGNvbmNlcHRfbWFwIGNvbnN0X2Nhc3QgY29uc3RleHByIGRlY2x0eXBlIGR5bmFtaWNfY2FzdCBleHBsaWNpdCBleHBvcnQgZnJpZW5kIGlubGluZSBsYXRlX2NoZWNrIG11dGFibGUgbmFtZXNwYWNlIG51bGxwdHIgcmVpbnRlcnByZXRfY2FzdCBzdGF0aWNfYXNzZXJ0IHN0YXRpY19jYXN0IHRlbXBsYXRlIHR5cGVpZCB0eXBlbmFtZSB0eXBlb2YgdXNpbmcgdmlydHVhbCB3Y2hhcl90IHdoZXJlIFwiLFxuICAgICAgICBKID1cbiAgICAgICAgICAgIEQgK1xuICAgICAgICAgICAgXCJib29sZWFuIGJ5dGUgZXh0ZW5kcyBmaW5hbCBmaW5hbGx5IGltcGxlbWVudHMgaW1wb3J0IGluc3RhbmNlb2YgbnVsbCBuYXRpdmUgcGFja2FnZSBzdHJpY3RmcCBzdXBlciBzeW5jaHJvbml6ZWQgdGhyb3dzIHRyYW5zaWVudCBcIixcbiAgICAgICAgViA9XG4gICAgICAgICAgICBKICtcbiAgICAgICAgICAgIFwiYXMgYmFzZSBieSBjaGVja2VkIGRlY2ltYWwgZGVsZWdhdGUgZGVzY2VuZGluZyBldmVudCBmaXhlZCBmb3JlYWNoIGZyb20gZ3JvdXAgaW1wbGljaXQgaW4gaW50ZXJmYWNlIGludGVybmFsIGludG8gaXMgbG9jayBvYmplY3Qgb3V0IG92ZXJyaWRlIG9yZGVyYnkgcGFyYW1zIHJlYWRvbmx5IHJlZiBzYnl0ZSBzZWFsZWQgc3RhY2thbGxvYyBzdHJpbmcgc2VsZWN0IHVpbnQgdWxvbmcgdW5jaGVja2VkIHVuc2FmZSB1c2hvcnQgdmFyIFwiLFxuICAgICAgICBLID1cbiAgICAgICAgICAgIEQgK1xuICAgICAgICAgICAgXCJkZWJ1Z2dlciBldmFsIGV4cG9ydCBmdW5jdGlvbiBnZXQgbnVsbCBzZXQgdW5kZWZpbmVkIHZhciB3aXRoIEluZmluaXR5IE5hTiBcIixcbiAgICAgICAgTCA9XG4gICAgICAgICAgICBcImNhbGxlciBkZWxldGUgZGllIGRvIGR1bXAgZWxzaWYgZXZhbCBleGl0IGZvcmVhY2ggZm9yIGdvdG8gaWYgaW1wb3J0IGxhc3QgbG9jYWwgbXkgbmV4dCBubyBvdXIgcHJpbnQgcGFja2FnZSByZWRvIHJlcXVpcmUgc3ViIHVuZGVmIHVubGVzcyB1bnRpbCB1c2Ugd2FudGFycmF5IHdoaWxlIEJFR0lOIEVORCBcIixcbiAgICAgICAgTSA9XG4gICAgICAgICAgICB5ICtcbiAgICAgICAgICAgIFwiYW5kIGFzIGFzc2VydCBjbGFzcyBkZWYgZGVsIGVsaWYgZXhjZXB0IGV4ZWMgZmluYWxseSBmcm9tIGdsb2JhbCBpbXBvcnQgaW4gaXMgbGFtYmRhIG5vbmxvY2FsIG5vdCBvciBwYXNzIHByaW50IHJhaXNlIHRyeSB3aXRoIHlpZWxkIEZhbHNlIFRydWUgTm9uZSBcIixcbiAgICAgICAgTiA9XG4gICAgICAgICAgICB5ICtcbiAgICAgICAgICAgIFwiYWxpYXMgYW5kIGJlZ2luIGNhc2UgY2xhc3MgZGVmIGRlZmluZWQgZWxzaWYgZW5kIGVuc3VyZSBmYWxzZSBpbiBtb2R1bGUgbmV4dCBuaWwgbm90IG9yIHJlZG8gcmVzY3VlIHJldHJ5IHNlbGYgc3VwZXIgdGhlbiB0cnVlIHVuZGVmIHVubGVzcyB1bnRpbCB3aGVuIHlpZWxkIEJFR0lOIEVORCBcIixcbiAgICAgICAgTyA9IHkgKyBcImNhc2UgZG9uZSBlbGlmIGVzYWMgZXZhbCBmaSBmdW5jdGlvbiBpbiBsb2NhbCBzZXQgdGhlbiB1bnRpbCBcIixcbiAgICAgICAgVyA9IEkgKyBWICsgSyArIEwgKyBNICsgTiArIE87XG4gICAgZnVuY3Rpb24gWChiKSB7XG4gICAgICAgIHJldHVybiAoYiA+PSBcImFcIiAmJiBiIDw9IFwielwiKSB8fCAoYiA+PSBcIkFcIiAmJiBiIDw9IFwiWlwiKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdShiLCBhLCBjLCBkKSB7XG4gICAgICAgIGIudW5zaGlmdChjLCBkIHx8IDApO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYS5zcGxpY2UuYXBwbHkoYSwgYik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBiLnNwbGljZSgwLCAyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgWSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBiID0gW1xuICAgICAgICAgICAgICAgICAgICBcIiFcIixcbiAgICAgICAgICAgICAgICAgICAgXCIhPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiE9PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIiNcIixcbiAgICAgICAgICAgICAgICAgICAgXCIlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiJT1cIixcbiAgICAgICAgICAgICAgICAgICAgXCImXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiJiZcIixcbiAgICAgICAgICAgICAgICAgICAgXCImJj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCImPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIihcIixcbiAgICAgICAgICAgICAgICAgICAgXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiKj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCIrPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIixcIixcbiAgICAgICAgICAgICAgICAgICAgXCItPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIi0+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiL1wiLFxuICAgICAgICAgICAgICAgICAgICBcIi89XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiOlwiLFxuICAgICAgICAgICAgICAgICAgICBcIjo6XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiO1wiLFxuICAgICAgICAgICAgICAgICAgICBcIjxcIixcbiAgICAgICAgICAgICAgICAgICAgXCI8PFwiLFxuICAgICAgICAgICAgICAgICAgICBcIjw8PVwiLFxuICAgICAgICAgICAgICAgICAgICBcIjw9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPVwiLFxuICAgICAgICAgICAgICAgICAgICBcIj09XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPT09XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPlwiLFxuICAgICAgICAgICAgICAgICAgICBcIj49XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiPj5cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+Pj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+Pj5cIixcbiAgICAgICAgICAgICAgICAgICAgXCI+Pj49XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiP1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJbXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiXlwiLFxuICAgICAgICAgICAgICAgICAgICBcIl49XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiXl5cIixcbiAgICAgICAgICAgICAgICAgICAgXCJeXj1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ7XCIsXG4gICAgICAgICAgICAgICAgICAgIFwifFwiLFxuICAgICAgICAgICAgICAgICAgICBcInw9XCIsXG4gICAgICAgICAgICAgICAgICAgIFwifHxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ8fD1cIixcbiAgICAgICAgICAgICAgICAgICAgXCJ+XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYnJlYWtcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjYXNlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY29udGludWVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkZWxldGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJkb1wiLFxuICAgICAgICAgICAgICAgICAgICBcImVsc2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJmaW5hbGx5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VvZlwiLFxuICAgICAgICAgICAgICAgICAgICBcInJldHVyblwiLFxuICAgICAgICAgICAgICAgICAgICBcInRocm93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHJ5XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZW9mXCJcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIGEgPVxuICAgICAgICAgICAgICAgICAgICBcIig/Oig/Oig/Ol58W14wLTkuXSlcXFxcLnsxLDN9KXwoPzooPzpefFteXFxcXCtdKVxcXFwrKXwoPzooPzpefFteXFxcXC1dKS0pXCI7XG4gICAgICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGIubGVuZ3RoOyArK2MpIHtcbiAgICAgICAgICAgICAgICB2YXIgZCA9IGJbY107XG4gICAgICAgICAgICAgICAgYSArPSBYKGQuY2hhckF0KDApKVxuICAgICAgICAgICAgICAgICAgICA/IFwifFxcXFxiXCIgKyBkXG4gICAgICAgICAgICAgICAgICAgIDogXCJ8XCIgKyBkLnJlcGxhY2UoLyhbXj08PjomXSkvZywgXCJcXFxcJDFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhICs9IFwifF4pXFxcXHMqJFwiO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYSk7XG4gICAgICAgIH0pKCksXG4gICAgICAgIFAgPSAvJi9nLFxuICAgICAgICBRID0gLzwvZyxcbiAgICAgICAgUiA9IC8+L2csXG4gICAgICAgIFogPSAvXFxcIi9nO1xuICAgIGZ1bmN0aW9uICQoYikge1xuICAgICAgICByZXR1cm4gYlxuICAgICAgICAgICAgLnJlcGxhY2UoUCwgXCImYW1wO1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoUSwgXCImbHQ7XCIpXG4gICAgICAgICAgICAucmVwbGFjZShSLCBcIiZndDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFosIFwiJnF1b3Q7XCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBFKGIpIHtcbiAgICAgICAgcmV0dXJuIGJcbiAgICAgICAgICAgIC5yZXBsYWNlKFAsIFwiJmFtcDtcIilcbiAgICAgICAgICAgIC5yZXBsYWNlKFEsIFwiJmx0O1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoUiwgXCImZ3Q7XCIpO1xuICAgIH1cbiAgICB2YXIgYWEgPSAvJmx0Oy9nLFxuICAgICAgICBiYSA9IC8mZ3Q7L2csXG4gICAgICAgIGNhID0gLyZhcG9zOy9nLFxuICAgICAgICBkYSA9IC8mcXVvdDsvZyxcbiAgICAgICAgZWEgPSAvJmFtcDsvZyxcbiAgICAgICAgZmEgPSAvJm5ic3A7L2c7XG4gICAgZnVuY3Rpb24gZ2EoYikge1xuICAgICAgICB2YXIgYSA9IGIuaW5kZXhPZihcIiZcIik7XG4gICAgICAgIGlmIChhIDwgMCkgcmV0dXJuIGI7XG4gICAgICAgIGZvciAoLS1hOyAoYSA9IGIuaW5kZXhPZihcIiYjXCIsIGEgKyAxKSkgPj0gMDsgKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGIuaW5kZXhPZihcIjtcIiwgYSk7XG4gICAgICAgICAgICBpZiAoYyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGQgPSBiLnN1YnN0cmluZyhhICsgMywgYyksXG4gICAgICAgICAgICAgICAgICAgIGcgPSAxMDtcbiAgICAgICAgICAgICAgICBpZiAoZCAmJiBkLmNoYXJBdCgwKSA9PT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZCA9IGQuc3Vic3RyaW5nKDEpO1xuICAgICAgICAgICAgICAgICAgICBnID0gMTY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBlID0gcGFyc2VJbnQoZCwgZyk7XG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihlKSlcbiAgICAgICAgICAgICAgICAgICAgYiA9XG4gICAgICAgICAgICAgICAgICAgICAgICBiLnN1YnN0cmluZygwLCBhKSArXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKGUpICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGIuc3Vic3RyaW5nKGMgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYlxuICAgICAgICAgICAgLnJlcGxhY2UoYWEsIFwiPFwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoYmEsIFwiPlwiKVxuICAgICAgICAgICAgLnJlcGxhY2UoY2EsIFwiJ1wiKVxuICAgICAgICAgICAgLnJlcGxhY2UoZGEsICdcIicpXG4gICAgICAgICAgICAucmVwbGFjZShlYSwgXCImXCIpXG4gICAgICAgICAgICAucmVwbGFjZShmYSwgXCIgXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBTKGIpIHtcbiAgICAgICAgcmV0dXJuIFwiWE1QXCIgPT09IGIudGFnTmFtZTtcbiAgICB9XG4gICAgZnVuY3Rpb24geihiLCBhKSB7XG4gICAgICAgIHN3aXRjaCAoYi5ub2RlVHlwZSkge1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIHZhciBjID0gYi50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgYS5wdXNoKFwiPFwiLCBjKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBkID0gMDsgZCA8IGIuYXR0cmlidXRlcy5sZW5ndGg7ICsrZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZyA9IGIuYXR0cmlidXRlc1tkXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFnLnNwZWNpZmllZCkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGEucHVzaChcIiBcIik7XG4gICAgICAgICAgICAgICAgICAgIHooZywgYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGEucHVzaChcIj5cIik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgZSA9IGIuZmlyc3RDaGlsZDsgZTsgZSA9IGUubmV4dFNpYmxpbmcpIHooZSwgYSk7XG4gICAgICAgICAgICAgICAgaWYgKGIuZmlyc3RDaGlsZCB8fCAhL14oPzpicnxsaW5rfGltZykkLy50ZXN0KGMpKVxuICAgICAgICAgICAgICAgICAgICBhLnB1c2goXCI8L1wiLCBjLCBcIj5cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgYS5wdXNoKGIubmFtZS50b0xvd2VyQ2FzZSgpLCAnPVwiJywgJChiLnZhbHVlKSwgJ1wiJyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgYS5wdXNoKEUoYi5ub2RlVmFsdWUpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgRiA9IG51bGw7XG4gICAgZnVuY3Rpb24gaGEoYikge1xuICAgICAgICBpZiAobnVsbCA9PT0gRikge1xuICAgICAgICAgICAgdmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFJFXCIpO1xuICAgICAgICAgICAgYS5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcbiAgICAgICAgICAgICAgICAgICAgJzwhRE9DVFlQRSBmb28gUFVCTElDIFwiZm9vIGJhclwiPlxcbjxmb28gLz4nXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIEYgPSAhLzwvLnRlc3QoYS5pbm5lckhUTUwpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChGKSB7XG4gICAgICAgICAgICB2YXIgYyA9IGIuaW5uZXJIVE1MO1xuICAgICAgICAgICAgaWYgKFMoYikpIGMgPSBFKGMpO1xuICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGQgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgZyA9IGIuZmlyc3RDaGlsZDsgZzsgZyA9IGcubmV4dFNpYmxpbmcpIHooZywgZCk7XG4gICAgICAgIHJldHVybiBkLmpvaW4oXCJcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlhKGIpIHtcbiAgICAgICAgdmFyIGEgPSAwO1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgdmFyIGQgPSBudWxsLFxuICAgICAgICAgICAgICAgIGcgPSAwO1xuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDAsIGggPSBjLmxlbmd0aDsgZSA8IGg7ICsrZSkge1xuICAgICAgICAgICAgICAgIHZhciBmID0gYy5jaGFyQXQoZSk7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChmKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZCkgZCA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgZC5wdXNoKGMuc3Vic3RyaW5nKGcsIGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gYiAtIChhICUgYik7XG4gICAgICAgICAgICAgICAgICAgICAgICBhICs9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKDsgaSA+PSAwOyBpIC09IFwiICAgICAgICAgICAgICAgIFwiLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnB1c2goXCIgICAgICAgICAgICAgICAgXCIuc3Vic3RyaW5nKDAsIGkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcgPSBlICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgKythO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghZCkgcmV0dXJuIGM7XG4gICAgICAgICAgICBkLnB1c2goYy5zdWJzdHJpbmcoZykpO1xuICAgICAgICAgICAgcmV0dXJuIGQuam9pbihcIlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIGphID0gLyg/OltePF0rfDwhLS1bXFxzXFxTXSo/LS1cXD58PCFcXFtDREFUQVxcWyhbXFxzXFxTXSo/KVxcXVxcXT58PFxcLz9bYS16QS1aXVtePl0qPnw8KS9nLFxuICAgICAgICBrYSA9IC9ePCEtLS8sXG4gICAgICAgIGxhID0gL148XFxbQ0RBVEFcXFsvLFxuICAgICAgICBtYSA9IC9ePGJyXFxiL2k7XG4gICAgZnVuY3Rpb24gbmEoYikge1xuICAgICAgICB2YXIgYSA9IGIubWF0Y2goamEpLFxuICAgICAgICAgICAgYyA9IFtdLFxuICAgICAgICAgICAgZCA9IDAsXG4gICAgICAgICAgICBnID0gW107XG4gICAgICAgIGlmIChhKVxuICAgICAgICAgICAgZm9yICh2YXIgZSA9IDAsIGggPSBhLmxlbmd0aDsgZSA8IGg7ICsrZSkge1xuICAgICAgICAgICAgICAgIHZhciBmID0gYVtlXTtcbiAgICAgICAgICAgICAgICBpZiAoZi5sZW5ndGggPiAxICYmIGYuY2hhckF0KDApID09PSBcIjxcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoa2EudGVzdChmKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsYS50ZXN0KGYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjLnB1c2goZi5zdWJzdHJpbmcoOSwgZi5sZW5ndGggLSAzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkICs9IGYubGVuZ3RoIC0gMTI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWEudGVzdChmKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5wdXNoKFwiXFxuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgKytkO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgZy5wdXNoKGQsIGYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gZ2EoZik7XG4gICAgICAgICAgICAgICAgICAgIGMucHVzaChpKTtcbiAgICAgICAgICAgICAgICAgICAgZCArPSBpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzb3VyY2U6IGMuam9pbihcIlwiKSxcbiAgICAgICAgICAgIHRhZ3M6IGdcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdihiLCBhKSB7XG4gICAgICAgIHZhciBjID0ge307XG4gICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBnID0gYi5jb25jYXQoYSk7XG4gICAgICAgICAgICBmb3IgKHZhciBlID0gZy5sZW5ndGg7IC0tZSA+PSAwOyApIHtcbiAgICAgICAgICAgICAgICB2YXIgaCA9IGdbZV0sXG4gICAgICAgICAgICAgICAgICAgIGYgPSBoWzNdO1xuICAgICAgICAgICAgICAgIGlmIChmKSBmb3IgKHZhciBpID0gZi5sZW5ndGg7IC0taSA+PSAwOyApIGNbZi5jaGFyQXQoaSldID0gaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcbiAgICAgICAgdmFyIGQgPSBhLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGcsIGUpIHtcbiAgICAgICAgICAgIGUgPSBlIHx8IDA7XG4gICAgICAgICAgICB2YXIgaCA9IFtlLCBcInBsblwiXSxcbiAgICAgICAgICAgICAgICBmID0gXCJcIixcbiAgICAgICAgICAgICAgICBpID0gMCxcbiAgICAgICAgICAgICAgICBqID0gZztcbiAgICAgICAgICAgIHdoaWxlIChqLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBvLFxuICAgICAgICAgICAgICAgICAgICBtID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgayxcbiAgICAgICAgICAgICAgICAgICAgbCA9IGNbai5jaGFyQXQoMCldO1xuICAgICAgICAgICAgICAgIGlmIChsKSB7XG4gICAgICAgICAgICAgICAgICAgIGsgPSBqLm1hdGNoKGxbMV0pO1xuICAgICAgICAgICAgICAgICAgICBtID0ga1swXTtcbiAgICAgICAgICAgICAgICAgICAgbyA9IGxbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbiA9IDA7IG4gPCBkOyArK24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwgPSBhW25dO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHAgPSBsWzJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHAgJiYgIXAudGVzdChmKSkgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gai5tYXRjaChsWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGtbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbyA9IGxbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvID0gXCJwbG5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBqLnN1YnN0cmluZygwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBoLnB1c2goZSArIGksIG8pO1xuICAgICAgICAgICAgICAgIGkgKz0gbS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgaiA9IGouc3Vic3RyaW5nKG0ubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBpZiAobyAhPT0gXCJjb21cIiAmJiAvXFxTLy50ZXN0KG0pKSBmID0gbTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBoO1xuICAgICAgICB9O1xuICAgIH1cbiAgICB2YXIgb2EgPSB2KFxuICAgICAgICBbXSxcbiAgICAgICAgW1xuICAgICAgICAgICAgW1wicGxuXCIsIC9eW148XSsvLCBudWxsXSxcbiAgICAgICAgICAgIFtcImRlY1wiLCAvXjwhXFx3W14+XSooPzo+fCQpLywgbnVsbF0sXG4gICAgICAgICAgICBbXCJjb21cIiwgL148IS0tW1xcc1xcU10qPyg/Oi0tXFw+fCQpLywgbnVsbF0sXG4gICAgICAgICAgICBbXCJzcmNcIiwgL148XFw/W1xcc1xcU10qPyg/OlxcPz58JCkvLCBudWxsXSxcbiAgICAgICAgICAgIFtcInNyY1wiLCAvXjwlW1xcc1xcU10qPyg/OiU+fCQpLywgbnVsbF0sXG4gICAgICAgICAgICBbXCJzcmNcIiwgL148KHNjcmlwdHxzdHlsZXx4bXApXFxiW14+XSo+W1xcc1xcU10qPzxcXC9cXDFcXGJbXj5dKj4vaSwgbnVsbF0sXG4gICAgICAgICAgICBbXCJ0YWdcIiwgL148XFwvP1xcd1tePD5dKj4vLCBudWxsXVxuICAgICAgICBdXG4gICAgKTtcbiAgICBmdW5jdGlvbiBwYShiKSB7XG4gICAgICAgIHZhciBhID0gb2EoYik7XG4gICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgYS5sZW5ndGg7IGMgKz0gMilcbiAgICAgICAgICAgIGlmIChhW2MgKyAxXSA9PT0gXCJzcmNcIikge1xuICAgICAgICAgICAgICAgIHZhciBkLCBnO1xuICAgICAgICAgICAgICAgIGQgPSBhW2NdO1xuICAgICAgICAgICAgICAgIGcgPSBjICsgMiA8IGEubGVuZ3RoID8gYVtjICsgMl0gOiBiLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgZSA9IGIuc3Vic3RyaW5nKGQsIGcpLFxuICAgICAgICAgICAgICAgICAgICBoID0gZS5tYXRjaCgvXig8W14+XSo+KShbXFxzXFxTXSopKDxcXC9bXj5dKj4pJC8pO1xuICAgICAgICAgICAgICAgIGlmIChoKVxuICAgICAgICAgICAgICAgICAgICBhLnNwbGljZShcbiAgICAgICAgICAgICAgICAgICAgICAgIGMsXG4gICAgICAgICAgICAgICAgICAgICAgICAyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGFnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkICsgaFsxXS5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNyY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZCArIGhbMV0ubGVuZ3RoICsgKGhbMl0gfHwgXCJcIikubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0YWdcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgdmFyIHFhID0gdihcbiAgICAgICAgW1xuICAgICAgICAgICAgW1wiYXR2XCIsIC9eXFwnW15cXCddKig/OlxcJ3wkKS8sIG51bGwsIFwiJ1wiXSxcbiAgICAgICAgICAgIFtcImF0dlwiLCAvXlxcXCJbXlxcXCJdKig/OlxcXCJ8JCkvLCBudWxsLCAnXCInXSxcbiAgICAgICAgICAgIFtcInB1blwiLCAvXls8PlxcLz1dKy8sIG51bGwsIFwiPD4vPVwiXVxuICAgICAgICBdLFxuICAgICAgICBbXG4gICAgICAgICAgICBbXCJ0YWdcIiwgL15bXFx3OlxcLV0rLywgL148L10sXG4gICAgICAgICAgICBbXCJhdHZcIiwgL15bXFx3XFwtXSsvLCAvXj0vXSxcbiAgICAgICAgICAgIFtcImF0blwiLCAvXltcXHc6XFwtXSsvLCBudWxsXSxcbiAgICAgICAgICAgIFtcInBsblwiLCAvXlxccysvLCBudWxsLCBcIiBcXHRcXHJcXG5cIl1cbiAgICAgICAgXVxuICAgICk7XG4gICAgZnVuY3Rpb24gcmEoYiwgYSkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGEubGVuZ3RoOyBjICs9IDIpIHtcbiAgICAgICAgICAgIHZhciBkID0gYVtjICsgMV07XG4gICAgICAgICAgICBpZiAoZCA9PT0gXCJ0YWdcIikge1xuICAgICAgICAgICAgICAgIHZhciBnLCBlO1xuICAgICAgICAgICAgICAgIGcgPSBhW2NdO1xuICAgICAgICAgICAgICAgIGUgPSBjICsgMiA8IGEubGVuZ3RoID8gYVtjICsgMl0gOiBiLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgaCA9IGIuc3Vic3RyaW5nKGcsIGUpLFxuICAgICAgICAgICAgICAgICAgICBmID0gcWEoaCwgZyk7XG4gICAgICAgICAgICAgICAgdShmLCBhLCBjLCAyKTtcbiAgICAgICAgICAgICAgICBjICs9IGYubGVuZ3RoIC0gMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcihiKSB7XG4gICAgICAgIHZhciBhID0gW10sXG4gICAgICAgICAgICBjID0gW107XG4gICAgICAgIGlmIChiLnRyaXBsZVF1b3RlZFN0cmluZ3MpXG4gICAgICAgICAgICBhLnB1c2goW1xuICAgICAgICAgICAgICAgIFwic3RyXCIsXG4gICAgICAgICAgICAgICAgL14oPzpcXCdcXCdcXCcoPzpbXlxcJ1xcXFxdfFxcXFxbXFxzXFxTXXxcXCd7MSwyfSg/PVteXFwnXSkpKig/OlxcJ1xcJ1xcJ3wkKXxcXFwiXFxcIlxcXCIoPzpbXlxcXCJcXFxcXXxcXFxcW1xcc1xcU118XFxcInsxLDJ9KD89W15cXFwiXSkpKig/OlxcXCJcXFwiXFxcInwkKXxcXCcoPzpbXlxcXFxcXCddfFxcXFxbXFxzXFxTXSkqKD86XFwnfCQpfFxcXCIoPzpbXlxcXFxcXFwiXXxcXFxcW1xcc1xcU10pKig/OlxcXCJ8JCkpLyxcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIFwiJ1xcXCJcIlxuICAgICAgICAgICAgXSk7XG4gICAgICAgIGVsc2UgaWYgKGIubXVsdGlMaW5lU3RyaW5ncylcbiAgICAgICAgICAgIGEucHVzaChbXG4gICAgICAgICAgICAgICAgXCJzdHJcIixcbiAgICAgICAgICAgICAgICAvXig/OlxcJyg/OlteXFxcXFxcJ118XFxcXFtcXHNcXFNdKSooPzpcXCd8JCl8XFxcIig/OlteXFxcXFxcXCJdfFxcXFxbXFxzXFxTXSkqKD86XFxcInwkKXxcXGAoPzpbXlxcXFxcXGBdfFxcXFxbXFxzXFxTXSkqKD86XFxgfCQpKS8sXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBcIidcXFwiYFwiXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYS5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInN0clwiLFxuICAgICAgICAgICAgICAgIC9eKD86XFwnKD86W15cXFxcXFwnXFxyXFxuXXxcXFxcLikqKD86XFwnfCQpfFxcXCIoPzpbXlxcXFxcXFwiXFxyXFxuXXxcXFxcLikqKD86XFxcInwkKSkvLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgXCJcXFwiJ1wiXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgYy5wdXNoKFtcInBsblwiLCAvXig/OlteXFwnXFxcIlxcYFxcL1xcI10rKS8sIG51bGwsIFwiIFxcclxcblwiXSk7XG4gICAgICAgIGlmIChiLmhhc2hDb21tZW50cykgYS5wdXNoKFtcImNvbVwiLCAvXiNbXlxcclxcbl0qLywgbnVsbCwgXCIjXCJdKTtcbiAgICAgICAgaWYgKGIuY1N0eWxlQ29tbWVudHMpIGMucHVzaChbXCJjb21cIiwgL15cXC9cXC9bXlxcclxcbl0qLywgbnVsbF0pO1xuICAgICAgICBpZiAoYi5yZWdleExpdGVyYWxzKVxuICAgICAgICAgICAgYy5wdXNoKFtcbiAgICAgICAgICAgICAgICBcInN0clwiLFxuICAgICAgICAgICAgICAgIC9eXFwvKD86W15cXFxcXFwqXFwvXFxbXXxcXFxcW1xcc1xcU118XFxbKD86W15cXF1cXFxcXXxcXFxcLikqKD86XFxdfCQpKSsoPzpcXC98JCkvLFxuICAgICAgICAgICAgICAgIFlcbiAgICAgICAgICAgIF0pO1xuICAgICAgICBpZiAoYi5jU3R5bGVDb21tZW50cykgYy5wdXNoKFtcImNvbVwiLCAvXlxcL1xcKltcXHNcXFNdKj8oPzpcXCpcXC98JCkvLCBudWxsXSk7XG4gICAgICAgIHZhciBkID0geChiLmtleXdvcmRzKTtcbiAgICAgICAgYiA9IG51bGw7XG4gICAgICAgIHZhciBnID0gdihhLCBjKSxcbiAgICAgICAgICAgIGUgPSB2KFxuICAgICAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgW1wicGxuXCIsIC9eXFxzKy8sIG51bGwsIFwiIFxcclxcblwiXSxcbiAgICAgICAgICAgICAgICAgICAgW1wicGxuXCIsIC9eW2Etel8kQF1bYS16XyRAMC05XSovaSwgbnVsbF0sXG4gICAgICAgICAgICAgICAgICAgIFtcImxpdFwiLCAvXjB4W2EtZjAtOV0rW2Etel0vaSwgbnVsbF0sXG4gICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibGl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAvXig/OlxcZCg/Ol9cXGQrKSpcXGQqKD86XFwuXFxkKik/fFxcLlxcZCspKD86ZVsrXFwtXT9cXGQrKT9bYS16XSovaSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjEyMzQ1Njc4OVwiXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIFtcInB1blwiLCAvXlteXFxzXFx3XFwuJEBdKy8sIG51bGxdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgZnVuY3Rpb24gaChmLCBpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGkubGVuZ3RoOyBqICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbyA9IGlbaiArIDFdO1xuICAgICAgICAgICAgICAgIGlmIChvID09PSBcInBsblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtLCBrLCBsLCBuO1xuICAgICAgICAgICAgICAgICAgICBtID0gaVtqXTtcbiAgICAgICAgICAgICAgICAgICAgayA9IGogKyAyIDwgaS5sZW5ndGggPyBpW2ogKyAyXSA6IGYubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBsID0gZi5zdWJzdHJpbmcobSwgayk7XG4gICAgICAgICAgICAgICAgICAgIG4gPSBlKGwsIG0pO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwID0gMCwgdCA9IG4ubGVuZ3RoOyBwIDwgdDsgcCArPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdyA9IG5bcCArIDFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHcgPT09IFwicGxuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgQSA9IG5bcF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEIgPSBwICsgMiA8IHQgPyBuW3AgKyAyXSA6IGwubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzID0gZi5zdWJzdHJpbmcoQSwgQik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMgPT09IFwiLlwiKSBuW3AgKyAxXSA9IFwicHVuXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocyBpbiBkKSBuW3AgKyAxXSA9IFwia3dkXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoL15AP1tBLVpdW0EtWiRdKlthLXpdW0EtWmEteiRdKiQvLnRlc3QocykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5bcCArIDFdID0gcy5jaGFyQXQoMCkgPT09IFwiQFwiID8gXCJsaXRcIiA6IFwidHlwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdShuLCBpLCBqLCAyKTtcbiAgICAgICAgICAgICAgICAgICAgaiArPSBuLmxlbmd0aCAtIDI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIHZhciBpID0gZyhmKTtcbiAgICAgICAgICAgIGkgPSBoKGYsIGkpO1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciBHID0gcih7XG4gICAgICAgIGtleXdvcmRzOiBXLFxuICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgIGNTdHlsZUNvbW1lbnRzOiB0cnVlLFxuICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlLFxuICAgICAgICByZWdleExpdGVyYWxzOiB0cnVlXG4gICAgfSk7XG4gICAgZnVuY3Rpb24gc2EoYiwgYSkge1xuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IGEubGVuZ3RoOyBjICs9IDIpIHtcbiAgICAgICAgICAgIHZhciBkID0gYVtjICsgMV07XG4gICAgICAgICAgICBpZiAoZCA9PT0gXCJzcmNcIikge1xuICAgICAgICAgICAgICAgIHZhciBnLCBlO1xuICAgICAgICAgICAgICAgIGcgPSBhW2NdO1xuICAgICAgICAgICAgICAgIGUgPSBjICsgMiA8IGEubGVuZ3RoID8gYVtjICsgMl0gOiBiLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgaCA9IEcoYi5zdWJzdHJpbmcoZywgZSkpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGYgPSAwLCBpID0gaC5sZW5ndGg7IGYgPCBpOyBmICs9IDIpIGhbZl0gKz0gZztcbiAgICAgICAgICAgICAgICB1KGgsIGEsIGMsIDIpO1xuICAgICAgICAgICAgICAgIGMgKz0gaC5sZW5ndGggLSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0YShiLCBhKSB7XG4gICAgICAgIHZhciBjID0gZmFsc2U7XG4gICAgICAgIGZvciAodmFyIGQgPSAwOyBkIDwgYS5sZW5ndGg7IGQgKz0gMikge1xuICAgICAgICAgICAgdmFyIGcgPSBhW2QgKyAxXSxcbiAgICAgICAgICAgICAgICBlLFxuICAgICAgICAgICAgICAgIGg7XG4gICAgICAgICAgICBpZiAoZyA9PT0gXCJhdG5cIikge1xuICAgICAgICAgICAgICAgIGUgPSBhW2RdO1xuICAgICAgICAgICAgICAgIGggPSBkICsgMiA8IGEubGVuZ3RoID8gYVtkICsgMl0gOiBiLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjID0gL15vbnxec3R5bGUkL2kudGVzdChiLnN1YnN0cmluZyhlLCBoKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGcgPT09IFwiYXR2XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoYykge1xuICAgICAgICAgICAgICAgICAgICBlID0gYVtkXTtcbiAgICAgICAgICAgICAgICAgICAgaCA9IGQgKyAyIDwgYS5sZW5ndGggPyBhW2QgKyAyXSA6IGIubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZiA9IGIuc3Vic3RyaW5nKGUsIGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGYubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaiA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA+PSAyICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgL15bXFxcIlxcJ10vLnRlc3QoZikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmLmNoYXJBdCgwKSA9PT0gZi5jaGFyQXQoaSAtIDEpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG0sXG4gICAgICAgICAgICAgICAgICAgICAgICBrO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbSA9IGUgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgayA9IGggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgbyA9IGY7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtID0gZSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBrID0gaCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBvID0gZi5zdWJzdHJpbmcoMSwgZi5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgbCA9IEcobyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIG4gPSAwLCBwID0gbC5sZW5ndGg7IG4gPCBwOyBuICs9IDIpIGxbbl0gKz0gbTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGwucHVzaChrLCBcImF0dlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHUobCwgYSwgZCArIDIsIDApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgdShsLCBhLCBkLCAyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBmdW5jdGlvbiB1YShiKSB7XG4gICAgICAgIHZhciBhID0gcGEoYik7XG4gICAgICAgIGEgPSByYShiLCBhKTtcbiAgICAgICAgYSA9IHNhKGIsIGEpO1xuICAgICAgICBhID0gdGEoYiwgYSk7XG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICBmdW5jdGlvbiB2YShiLCBhLCBjKSB7XG4gICAgICAgIHZhciBkID0gW10sXG4gICAgICAgICAgICBnID0gMCxcbiAgICAgICAgICAgIGUgPSBudWxsLFxuICAgICAgICAgICAgaCA9IG51bGwsXG4gICAgICAgICAgICBmID0gMCxcbiAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgaiA9IGlhKDgpO1xuICAgICAgICBmdW5jdGlvbiBvKGspIHtcbiAgICAgICAgICAgIGlmIChrID4gZykge1xuICAgICAgICAgICAgICAgIGlmIChlICYmIGUgIT09IGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZC5wdXNoKFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZSAmJiBoKSB7XG4gICAgICAgICAgICAgICAgICAgIGUgPSBoO1xuICAgICAgICAgICAgICAgICAgICBkLnB1c2goJzxzcGFuIGNsYXNzPVwiJywgZSwgJ1wiPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgbCA9IEUoaihiLnN1YnN0cmluZyhnLCBrKSkpXG4gICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXFxyXFxuP3xcXG58ICkgL2csIFwiJDEmbmJzcDtcIilcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcclxcbj98XFxuL2csIFwiPGJyIC8+XCIpO1xuICAgICAgICAgICAgICAgIGQucHVzaChsKTtcbiAgICAgICAgICAgICAgICBnID0gaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIG07XG4gICAgICAgICAgICBtID0gZiA8IGEubGVuZ3RoID8gKGkgPCBjLmxlbmd0aCA/IGFbZl0gPD0gY1tpXSA6IHRydWUpIDogZmFsc2U7XG4gICAgICAgICAgICBpZiAobSkge1xuICAgICAgICAgICAgICAgIG8oYVtmXSk7XG4gICAgICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZC5wdXNoKFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGQucHVzaChhW2YgKyAxXSk7XG4gICAgICAgICAgICAgICAgZiArPSAyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpIDwgYy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBvKGNbaV0pO1xuICAgICAgICAgICAgICAgIGggPSBjW2kgKyAxXTtcbiAgICAgICAgICAgICAgICBpICs9IDI7XG4gICAgICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbyhiLmxlbmd0aCk7XG4gICAgICAgIGlmIChlKSBkLnB1c2goXCI8L3NwYW4+XCIpO1xuICAgICAgICByZXR1cm4gZC5qb2luKFwiXCIpO1xuICAgIH1cbiAgICB2YXIgQyA9IHt9O1xuICAgIGZ1bmN0aW9uIHEoYiwgYSkge1xuICAgICAgICBmb3IgKHZhciBjID0gYS5sZW5ndGg7IC0tYyA+PSAwOyApIHtcbiAgICAgICAgICAgIHZhciBkID0gYVtjXTtcbiAgICAgICAgICAgIGlmICghQy5oYXNPd25Qcm9wZXJ0eShkKSkgQ1tkXSA9IGI7XG4gICAgICAgICAgICBlbHNlIGlmIChcImNvbnNvbGVcIiBpbiB3aW5kb3cpXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjYW5ub3Qgb3ZlcnJpZGUgbGFuZ3VhZ2UgaGFuZGxlciAlc1wiLCBkKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxKEcsIFtcImRlZmF1bHQtY29kZVwiXSk7XG4gICAgcSh1YSwgW1wiZGVmYXVsdC1tYXJrdXBcIiwgXCJodG1sXCIsIFwiaHRtXCIsIFwieGh0bWxcIiwgXCJ4bWxcIiwgXCJ4c2xcIl0pO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IEksXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICBjU3R5bGVDb21tZW50czogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wiY1wiLCBcImNjXCIsIFwiY3BwXCIsIFwiY3NcIiwgXCJjeHhcIiwgXCJjeWNcIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IEosXG4gICAgICAgICAgICBjU3R5bGVDb21tZW50czogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wiamF2YVwiXVxuICAgICk7XG4gICAgcShcbiAgICAgICAgcih7XG4gICAgICAgICAgICBrZXl3b3JkczogTyxcbiAgICAgICAgICAgIGhhc2hDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIG11bHRpTGluZVN0cmluZ3M6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcImJzaFwiLCBcImNzaFwiLCBcInNoXCJdXG4gICAgKTtcbiAgICBxKFxuICAgICAgICByKHtcbiAgICAgICAgICAgIGtleXdvcmRzOiBNLFxuICAgICAgICAgICAgaGFzaENvbW1lbnRzOiB0cnVlLFxuICAgICAgICAgICAgbXVsdGlMaW5lU3RyaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIHRyaXBsZVF1b3RlZFN0cmluZ3M6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcImN2XCIsIFwicHlcIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IEwsXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlLFxuICAgICAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wicGVybFwiLCBcInBsXCIsIFwicG1cIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IE4sXG4gICAgICAgICAgICBoYXNoQ29tbWVudHM6IHRydWUsXG4gICAgICAgICAgICBtdWx0aUxpbmVTdHJpbmdzOiB0cnVlLFxuICAgICAgICAgICAgcmVnZXhMaXRlcmFsczogdHJ1ZVxuICAgICAgICB9KSxcbiAgICAgICAgW1wicmJcIl1cbiAgICApO1xuICAgIHEoXG4gICAgICAgIHIoe1xuICAgICAgICAgICAga2V5d29yZHM6IEssXG4gICAgICAgICAgICBjU3R5bGVDb21tZW50czogdHJ1ZSxcbiAgICAgICAgICAgIHJlZ2V4TGl0ZXJhbHM6IHRydWVcbiAgICAgICAgfSksXG4gICAgICAgIFtcImpzXCJdXG4gICAgKTtcbiAgICBmdW5jdGlvbiBUKGIsIGEpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciBjID0gbmEoYiksXG4gICAgICAgICAgICAgICAgZCA9IGMuc291cmNlLFxuICAgICAgICAgICAgICAgIGcgPSBjLnRhZ3M7XG4gICAgICAgICAgICBpZiAoIUMuaGFzT3duUHJvcGVydHkoYSkpXG4gICAgICAgICAgICAgICAgYSA9IC9eXFxzKjwvLnRlc3QoZCkgPyBcImRlZmF1bHQtbWFya3VwXCIgOiBcImRlZmF1bHQtY29kZVwiO1xuICAgICAgICAgICAgdmFyIGUgPSBDW2FdLmNhbGwoe30sIGQpO1xuICAgICAgICAgICAgcmV0dXJuIHZhKGQsIGcsIGUpO1xuICAgICAgICB9IGNhdGNoIChoKSB7XG4gICAgICAgICAgICBpZiAoXCJjb25zb2xlXCIgaW4gd2luZG93KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gd2EoYikge1xuICAgICAgICB2YXIgYSA9IEgoKSxcbiAgICAgICAgICAgIGMgPSBbXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJwcmVcIiksXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjb2RlXCIpLFxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwibGlcIiksXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ4bXBcIilcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBkID0gW107XG4gICAgICAgIGZvciAodmFyIGcgPSAwOyBnIDwgYy5sZW5ndGg7ICsrZylcbiAgICAgICAgICAgIGZvciAodmFyIGUgPSAwOyBlIDwgY1tnXS5sZW5ndGg7ICsrZSkgZC5wdXNoKGNbZ11bZV0pO1xuICAgICAgICBjID0gbnVsbDtcbiAgICAgICAgdmFyIGggPSAwO1xuICAgICAgICBmdW5jdGlvbiBmKCkge1xuICAgICAgICAgICAgdmFyIGkgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSArIDI1MDtcbiAgICAgICAgICAgIGZvciAoOyBoIDwgZC5sZW5ndGggJiYgbmV3IERhdGUoKS5nZXRUaW1lKCkgPCBpOyBoKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgaiA9IGRbaF07XG4gICAgICAgICAgICAgICAgaWYgKGouY2xhc3NOYW1lICYmIGouY2xhc3NOYW1lLmluZGV4T2YoXCJwcmV0dHlwcmludFwiKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvID0gai5jbGFzc05hbWUubWF0Y2goL1xcYmxhbmctKFxcdyspXFxiLyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvKSBvID0gb1sxXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IGoucGFyZW50Tm9kZTsgazsgayA9IGsucGFyZW50Tm9kZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoay50YWdOYW1lID09PSBcInByZVwiIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsudGFnTmFtZSA9PT0gXCJjb2RlXCIgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgay50YWdOYW1lID09PSBcInhtcFwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGsuY2xhc3NOYW1lICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgay5jbGFzc05hbWUuaW5kZXhPZihcInByZXR0eXByaW50XCIpID49IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsID0gaGEoaik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsID0gbC5yZXBsYWNlKC8oPzpcXHJcXG4/fFxcbikkLywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbiA9IFQobCwgbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIVMoaikpIGouaW5uZXJIVE1MID0gbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBSRVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB0ID0gMDsgdCA8IGouYXR0cmlidXRlcy5sZW5ndGg7ICsrdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdyA9IGouYXR0cmlidXRlc1t0XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHcuc3BlY2lmaWVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5zZXRBdHRyaWJ1dGUody5uYW1lLCB3LnZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcC5pbm5lckhUTUwgPSBuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGoucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocCwgaik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcCA9IGo7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYSAmJiBqLnRhZ05hbWUgPT09IFwiUFJFXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgQSA9IGouZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJiclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBCID0gQS5sZW5ndGg7IC0tQiA+PSAwOyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHMgPSBBW0JdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcXHJcXG5cIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGggPCBkLmxlbmd0aCkgc2V0VGltZW91dChmLCAyNTApO1xuICAgICAgICAgICAgZWxzZSBpZiAoYikgYigpO1xuICAgICAgICB9XG4gICAgICAgIGYoKTtcbiAgICB9XG4gICAgd2luZG93LlBSX25vcm1hbGl6ZWRIdG1sID0gejtcbiAgICB3aW5kb3cucHJldHR5UHJpbnRPbmUgPSBUO1xuICAgIHdpbmRvdy5wcmV0dHlQcmludCA9IHdhO1xuICAgIHdpbmRvdy5QUiA9IHtcbiAgICAgICAgY3JlYXRlU2ltcGxlTGV4ZXI6IHYsXG4gICAgICAgIHJlZ2lzdGVyTGFuZ0hhbmRsZXI6IHEsXG4gICAgICAgIHNvdXJjZURlY29yYXRvcjogcixcbiAgICAgICAgUFJfQVRUUklCX05BTUU6IFwiYXRuXCIsXG4gICAgICAgIFBSX0FUVFJJQl9WQUxVRTogXCJhdHZcIixcbiAgICAgICAgUFJfQ09NTUVOVDogXCJjb21cIixcbiAgICAgICAgUFJfREVDTEFSQVRJT046IFwiZGVjXCIsXG4gICAgICAgIFBSX0tFWVdPUkQ6IFwia3dkXCIsXG4gICAgICAgIFBSX0xJVEVSQUw6IFwibGl0XCIsXG4gICAgICAgIFBSX1BMQUlOOiBcInBsblwiLFxuICAgICAgICBQUl9QVU5DVFVBVElPTjogXCJwdW5cIixcbiAgICAgICAgUFJfU09VUkNFOiBcInNyY1wiLFxuICAgICAgICBQUl9TVFJJTkc6IFwic3RyXCIsXG4gICAgICAgIFBSX1RBRzogXCJ0YWdcIixcbiAgICAgICAgUFJfVFlQRTogXCJ0eXBcIlxuICAgIH07XG59KSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIFRoaXMgZmlsZSBhZGFwdGVkIGZyb20gSlNOZXR3b3JrWDogaHR0cHM6Ly9naXRodWIuY29tL2ZrbGluZy9KU05ldHdvcmtYXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTIgRmVsaXggS2xpbmcgPGZlbGl4LmtsaW5nQGdteC5uZXQ+XG4gKiBKU05ldHdvcmtYIGlzIGRpc3RyaWJ1dGVkIHdpdGggdGhlIEJTRCBsaWNlbnNlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1BhdGgoRywgeyBzb3VyY2UsIHRhcmdldCB9KSB7XG4gIHRyeSB7XG4gICAgYmlkaXJlY3Rpb25hbFNob3J0ZXN0UGF0aChHLCBzb3VyY2UsIHRhcmdldCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgSlNOZXR3b3JrWE5vUGF0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gbm9kZXNBcmVFcXVhbChhLCBiKSB7XG4gIHJldHVybiBhID09PSBiIHx8ICh0eXBlb2YgYSA9PT0gXCJvYmplY3RcIiAmJiBhLnRvU3RyaW5nKCkgPT09IGIudG9TdHJpbmcoKSk7XG59XG5cbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxTaG9ydGVzdFBhdGgoRywgc291cmNlLCB0YXJnZXQpIHtcbiAgLy8gY2FsbCBoZWxwZXIgdG8gZG8gdGhlIHJlYWwgd29ya1xuICB2YXIgW3ByZWQsIHN1Y2MsIHddID0gYmlkaXJlY3Rpb25hbFByZWRTdWNjKEcsIHNvdXJjZSwgdGFyZ2V0KTtcblxuICAvLyBidWlsZCBwYXRoIGZyb20gcHJlZCt3K3N1Y2NcbiAgdmFyIHBhdGggPSBbXTtcbiAgLy8gZnJvbSBzb3VyY2UgdG8gd1xuICB3aGlsZSAodyAhPSBudWxsKSB7XG4gICAgcGF0aC5wdXNoKHcpO1xuICAgIHcgPSBwcmVkLmdldCh3KTtcbiAgfVxuICB3ID0gc3VjYy5nZXQocGF0aFswXSk7XG4gIHBhdGgucmV2ZXJzZSgpO1xuICAvLyBmcm9tIHcgdG8gdGFyZ2V0XG4gIHdoaWxlICh3ICE9IG51bGwpIHtcbiAgICBwYXRoLnB1c2godyk7XG4gICAgdyA9IHN1Y2MuZ2V0KHcpO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuXG5mdW5jdGlvbiBiaWRpcmVjdGlvbmFsUHJlZFN1Y2MoRywgc291cmNlLCB0YXJnZXQpIHtcbiAgLy8gZG9lcyBCRlMgZnJvbSBib3RoIHNvdXJjZSBhbmQgdGFyZ2V0IGFuZCBtZWV0cyBpbiB0aGUgbWlkZGxlXG4gIGlmIChub2Rlc0FyZUVxdWFsKHNvdXJjZSwgdGFyZ2V0KSkge1xuICAgIHJldHVybiBbbmV3IE1hcChbW3NvdXJjZSwgbnVsbF1dKSwgbmV3IE1hcChbW3RhcmdldCwgbnVsbF1dKSwgc291cmNlXTtcbiAgfVxuXG4gIC8vIGhhbmRsZSBlaXRoZXIgZGlyZWN0ZWQgb3IgdW5kaXJlY3RlZFxuICB2YXIgZ3ByZWQsIGdzdWNjO1xuICBncHJlZCA9IEcucHJlZGVjZXNzb3JzSXRlci5iaW5kKEcpO1xuICBnc3VjYyA9IEcuc3VjY2Vzc29yc0l0ZXIuYmluZChHKTtcblxuICAvLyBwcmVkZWNlc3Nzb3IgYW5kIHN1Y2Nlc3NvcnMgaW4gc2VhcmNoXG4gIHZhciBwcmVkID0gbmV3IE1hcChbW3NvdXJjZSwgbnVsbF1dKTtcbiAgdmFyIHN1Y2MgPSBuZXcgTWFwKFtbdGFyZ2V0LCBudWxsXV0pO1xuICAvL1xuICAvLyBpbml0aWFsaXplIGZyaW5nZXMsIHN0YXJ0IHdpdGggZm9yd2FyZFxuICB2YXIgZm9yd2FyZEZyaW5nZSA9IFtzb3VyY2VdO1xuICB2YXIgcmV2ZXJzZUZyaW5nZSA9IFt0YXJnZXRdO1xuICB2YXIgdGhpc0xldmVsO1xuXG4gIC8qanNoaW50IG5ld2NhcDpmYWxzZSovXG4gIHdoaWxlIChmb3J3YXJkRnJpbmdlLmxlbmd0aCA+IDAgJiYgcmV2ZXJzZUZyaW5nZS5sZW5ndGggPiAwKSB7XG4gICAgaWYgKGZvcndhcmRGcmluZ2UubGVuZ3RoIDw9IHJldmVyc2VGcmluZ2UubGVuZ3RoKSB7XG4gICAgICB0aGlzTGV2ZWwgPSBmb3J3YXJkRnJpbmdlO1xuICAgICAgZm9yd2FyZEZyaW5nZSA9IFtdO1xuICAgICAgZm9yIChsZXQgdiBvZiB0aGlzTGV2ZWwpIHtcbiAgICAgICAgZm9yIChsZXQgdyBvZiBnc3VjYyh2KSkge1xuICAgICAgICAgIGlmICghcHJlZC5oYXModykpIHtcbiAgICAgICAgICAgIGZvcndhcmRGcmluZ2UucHVzaCh3KTtcbiAgICAgICAgICAgIHByZWQuc2V0KHcsIHYpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3VjYy5oYXModykpIHtcbiAgICAgICAgICAgIHJldHVybiBbcHJlZCwgc3VjYywgd107IC8vIGZvdW5kIHBhdGhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc0xldmVsID0gcmV2ZXJzZUZyaW5nZTtcbiAgICAgIHJldmVyc2VGcmluZ2UgPSBbXTtcbiAgICAgIGZvciAobGV0IHYgb2YgdGhpc0xldmVsKSB7XG4gICAgICAgIGZvciAobGV0IHcgb2YgZ3ByZWQodikpIHtcbiAgICAgICAgICBpZiAoIXN1Y2MuaGFzKHcpKSB7XG4gICAgICAgICAgICByZXZlcnNlRnJpbmdlLnB1c2godyk7XG4gICAgICAgICAgICBzdWNjLnNldCh3LCB2KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByZWQuaGFzKHcpKSB7XG4gICAgICAgICAgICByZXR1cm4gW3ByZWQsIHN1Y2MsIHddOyAvLyBmb3VuZCBwYXRoXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBKU05ldHdvcmtYTm9QYXRoKFxuICAgIFwiTm8gcGF0aCBiZXR3ZWVuIFwiICsgc291cmNlLnRvU3RyaW5nKCkgKyBcIiBhbmQgXCIgKyB0YXJnZXQudG9TdHJpbmcoKSArIFwiLlwiXG4gICk7XG59XG5cbmZ1bmN0aW9uIHRvcG9sb2dpY2FsU29ydChHLCBvcHROYnVuY2gpIHtcbiAgLy8gbm9ucmVjdXJzaXZlIHZlcnNpb25cbiAgdmFyIHNlZW4gPSBuZXcgU2V0KCk7XG4gIHZhciBvcmRlckV4cGxvcmVkID0gW107IC8vIHByb3ZpZGUgb3JkZXIgYW5kXG4gIC8vIGZhc3Qgc2VhcmNoIHdpdGhvdXQgbW9yZSBnZW5lcmFsIHByaW9yaXR5RGljdGlvbmFyeVxuICB2YXIgZXhwbG9yZWQgPSBuZXcgU2V0KCk7XG5cbiAgaWYgKG9wdE5idW5jaCA9PSBudWxsKSB7XG4gICAgb3B0TmJ1bmNoID0gRy5ub2Rlc0l0ZXIoKTtcbiAgfVxuXG4gIGZvciAobGV0IHYgb2Ygb3B0TmJ1bmNoKSB7XG4gICAgLy8gcHJvY2VzcyBhbGwgdmVydGljZXMgaW4gR1xuICAgIGlmIChleHBsb3JlZC5oYXModikpIHtcbiAgICAgIHJldHVybjsgLy8gY29udGludWVcbiAgICB9XG5cbiAgICB2YXIgZnJpbmdlID0gW3ZdOyAvLyBub2RlcyB5ZXQgdG8gbG9vayBhdFxuICAgIHdoaWxlIChmcmluZ2UubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHcgPSBmcmluZ2VbZnJpbmdlLmxlbmd0aCAtIDFdOyAvLyBkZXB0aCBmaXJzdCBzZWFyY2hcbiAgICAgIGlmIChleHBsb3JlZC5oYXModykpIHtcbiAgICAgICAgLy8gYWxyZWFkeSBsb29rZWQgZG93biB0aGlzIGJyYW5jaFxuICAgICAgICBmcmluZ2UucG9wKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgc2Vlbi5hZGQodyk7IC8vIG1hcmsgYXMgc2VlblxuICAgICAgLy8gQ2hlY2sgc3VjY2Vzc29ycyBmb3IgY3ljbGVzIGZvciBuZXcgbm9kZXNcbiAgICAgIHZhciBuZXdOb2RlcyA9IFtdO1xuICAgICAgLyplc2xpbnQtZGlzYWJsZSBuby1sb29wLWZ1bmMqL1xuICAgICAgRy5nZXQodykuZm9yRWFjaChmdW5jdGlvbiAoXywgbikge1xuICAgICAgICBpZiAoIWV4cGxvcmVkLmhhcyhuKSkge1xuICAgICAgICAgIGlmIChzZWVuLmhhcyhuKSkge1xuICAgICAgICAgICAgLy8gQ1lDTEUgISFcbiAgICAgICAgICAgIHRocm93IG5ldyBKU05ldHdvcmtYVW5mZWFzaWJsZShcIkdyYXBoIGNvbnRhaW5zIGEgY3ljbGUuXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBuZXdOb2Rlcy5wdXNoKG4pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8qZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMqL1xuICAgICAgaWYgKG5ld05vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gYWRkIG5ldyBub2RlcyB0byBmcmluZ2VcbiAgICAgICAgZnJpbmdlLnB1c2guYXBwbHkoZnJpbmdlLCBuZXdOb2Rlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHBsb3JlZC5hZGQodyk7XG4gICAgICAgIG9yZGVyRXhwbG9yZWQudW5zaGlmdCh3KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3JkZXJFeHBsb3JlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGlyZWN0ZWRBY3ljbGljR3JhcGgoRykge1xuICB0cnkge1xuICAgIHRvcG9sb2dpY2FsU29ydChHKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBpZiAoZXggaW5zdGFuY2VvZiBKU05ldHdvcmtYVW5mZWFzaWJsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aHJvdyBleDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRGlHcmFwaCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ3JhcGggPSB7fTsgLy8gZGljdGlvbmFyeSBmb3IgZ3JhcGggYXR0cmlidXRlc1xuICAgIHRoaXMubm9kZSA9IG5ldyBNYXAoKTsgLy8gZGljdGlvbmFyeSBmb3Igbm9kZSBhdHRyaWJ1dGVzXG4gICAgLy8gV2Ugc3RvcmUgdHdvIGFkamFjZW5jeSBsaXN0czpcbiAgICAvLyB0aGUgcHJlZGVjZXNzb3JzIG9mIG5vZGUgbiBhcmUgc3RvcmVkIGluIHRoZSBkaWN0IHNlbGYucHJlZFxuICAgIC8vIHRoZSBzdWNjZXNzb3JzIG9mIG5vZGUgbiBhcmUgc3RvcmVkIGluIHRoZSBkaWN0IHNlbGYuc3VjYz1zZWxmLmFkalxuICAgIHRoaXMuYWRqID0gbmV3IE1hcCgpOyAvLyBlbXB0eSBhZGphY2VuY3kgZGljdGlvbmFyeVxuICAgIHRoaXMucHJlZCA9IG5ldyBNYXAoKTsgLy8gcHJlZGVjZXNzb3JcbiAgICB0aGlzLnN1Y2MgPSB0aGlzLmFkajsgLy8gc3VjY2Vzc29yXG5cbiAgICB0aGlzLmVkZ2UgPSB0aGlzLmFkajtcbiAgfVxuXG4gIGFkZE5vZGUobikge1xuICAgIGlmICghdGhpcy5zdWNjLmhhcyhuKSkge1xuICAgICAgdGhpcy5zdWNjLnNldChuLCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5wcmVkLnNldChuLCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5ub2RlLnNldChuKTtcbiAgICB9XG4gIH1cblxuICBhZGRFZGdlKHUsIHYpIHtcbiAgICAvLyBhZGQgbm9kZXNcbiAgICBpZiAoIXRoaXMuc3VjYy5oYXModSkpIHtcbiAgICAgIHRoaXMuc3VjYy5zZXQodSwgbmV3IE1hcCgpKTtcbiAgICAgIHRoaXMucHJlZC5zZXQodSwgbmV3IE1hcCgpKTtcbiAgICAgIHRoaXMubm9kZS5zZXQodSwge30pO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5zdWNjLmhhcyh2KSkge1xuICAgICAgdGhpcy5zdWNjLnNldCh2LCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5wcmVkLnNldCh2LCBuZXcgTWFwKCkpO1xuICAgICAgdGhpcy5ub2RlLnNldCh2LCB7fSk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoZSBlZGdlXG4gICAgdmFyIGRhdGFkaWN0ID0gdGhpcy5hZGouZ2V0KHUpLmdldCh2KSB8fCB7fTtcbiAgICB0aGlzLnN1Y2MuZ2V0KHUpLnNldCh2LCBkYXRhZGljdCk7XG4gICAgdGhpcy5wcmVkLmdldCh2KS5zZXQodSwgZGF0YWRpY3QpO1xuICB9XG5cbiAgbm9kZXMob3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ob3B0RGF0YSA/IHRoaXMubm9kZS5lbnRyaWVzKCkgOiB0aGlzLm5vZGUua2V5cygpKTtcbiAgfVxuXG4gIGVkZ2VzKG9wdE5idW5jaCwgb3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5lZGdlc0l0ZXIob3B0TmJ1bmNoLCBvcHREYXRhKSk7XG4gIH1cblxuICBub2Rlc0l0ZXIob3B0RGF0YSA9IGZhbHNlKSB7XG4gICAgaWYgKG9wdERhdGEpIHtcbiAgICAgIHJldHVybiB0b0l0ZXJhdG9yKHRoaXMubm9kZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5vZGUua2V5cygpO1xuICB9XG5cbiAgZ2V0KG4pIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmFkai5nZXQobik7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IEtleUVycm9yKFwiR3JhcGggZG9lcyBub3QgY29udGFpbiBub2RlIFwiICsgbiArIFwiLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgbnVtYmVyT2ZOb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy5ub2RlLnNpemU7XG4gIH1cblxuICAqbmJ1bmNoSXRlcihvcHROYnVuY2gpIHtcbiAgICBpZiAob3B0TmJ1bmNoID09IG51bGwpIHtcbiAgICAgIC8vIGluY2x1ZGUgYWxsIG5vZGVzXG4gICAgICAvKmpzaGludCBleHByOnRydWUqL1xuICAgICAgeWllbGQqIHRoaXMuYWRqLmtleXMoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzTm9kZShvcHROYnVuY2gpKSB7XG4gICAgICAvLyBpZiBuYnVuY2ggaXMgYSBzaW5nbGUgbm9kZVxuICAgICAgeWllbGQgb3B0TmJ1bmNoO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpZiBuYnVuY2ggaXMgYSBzZXF1ZW5jZSBvZiBub2Rlc1xuICAgICAgdmFyIGFkaiA9IHRoaXMuYWRqO1xuXG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKHZhciBuIG9mIHRvSXRlcmF0b3Iob3B0TmJ1bmNoKSkge1xuICAgICAgICAgIGlmIChhZGouaGFzKG4pKSB7XG4gICAgICAgICAgICB5aWVsZCBuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgaWYgKGV4IGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgICAgICAgIFwibmJ1bmNoIGlzIG5vdCBhIG5vZGUgb3IgYSBzZXF1ZW5jZSBvZiBub2Rlc1wiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gICplZGdlc0l0ZXIob3B0TmJ1bmNoLCBvcHREYXRhID0gZmFsc2UpIHtcbiAgICAvLyBoYW5kbGUgY2FsbHMgd2l0aCBvcHRfZGF0YSBiZWluZyB0aGUgb25seSBhcmd1bWVudFxuICAgIGlmIChpc0Jvb2xlYW4ob3B0TmJ1bmNoKSkge1xuICAgICAgb3B0RGF0YSA9IG9wdE5idW5jaDtcbiAgICAgIG9wdE5idW5jaCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgbm9kZXNOYnJzO1xuXG4gICAgaWYgKG9wdE5idW5jaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBub2Rlc05icnMgPSB0aGlzLmFkajtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZXNOYnJzID0gbWFwSXRlcmF0b3IodGhpcy5uYnVuY2hJdGVyKG9wdE5idW5jaCksIChuKSA9PlxuICAgICAgICB0dXBsZTIobiwgdGhpcy5hZGouZ2V0KG4pKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBub2RlTmJycyBvZiBub2Rlc05icnMpIHtcbiAgICAgIGZvciAodmFyIG5ickRhdGEgb2Ygbm9kZU5icnNbMV0pIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtub2RlTmJyc1swXSwgbmJyRGF0YVswXV07XG4gICAgICAgIGlmIChvcHREYXRhKSB7XG4gICAgICAgICAgcmVzdWx0WzJdID0gbmJyRGF0YVsxXTtcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV2ZXJzZShvcHRDb3B5ID0gdHJ1ZSkge1xuICAgIHZhciBIO1xuICAgIGlmIChvcHRDb3B5KSB7XG4gICAgICBIID0gbmV3IHRoaXMuY29uc3RydWN0b3IobnVsbCwge1xuICAgICAgICBuYW1lOiBcIlJldmVyc2Ugb2YgKFwiICsgdGhpcy5uYW1lICsgXCIpXCIsXG4gICAgICB9KTtcbiAgICAgIEguYWRkTm9kZXNGcm9tKHRoaXMpO1xuICAgICAgSC5hZGRFZGdlc0Zyb20oXG4gICAgICAgIG1hcEl0ZXJhdG9yKHRoaXMuZWRnZXNJdGVyKG51bGwsIHRydWUpLCAoZWRnZSkgPT5cbiAgICAgICAgICB0dXBsZTNjKGVkZ2VbMV0sIGVkZ2VbMF0sIGRlZXBjb3B5KGVkZ2VbMl0pLCBlZGdlKVxuICAgICAgICApXG4gICAgICApO1xuICAgICAgSC5ncmFwaCA9IGRlZXBjb3B5KHRoaXMuZ3JhcGgpO1xuICAgICAgSC5ub2RlID0gZGVlcGNvcHkodGhpcy5ub2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRoaXNQcmVkID0gdGhpcy5wcmVkO1xuICAgICAgdmFyIHRoaXNTdWNjID0gdGhpcy5zdWNjO1xuXG4gICAgICB0aGlzLnN1Y2MgPSB0aGlzUHJlZDtcbiAgICAgIHRoaXMucHJlZCA9IHRoaXNTdWNjO1xuICAgICAgdGhpcy5hZGogPSB0aGlzLnN1Y2M7XG4gICAgICBIID0gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEg7XG4gIH1cblxuICBzdWNjZXNzb3JzSXRlcihuKSB7XG4gICAgdmFyIG5icnMgPSB0aGlzLnN1Y2MuZ2V0KG4pO1xuICAgIGlmIChuYnJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBuYnJzLmtleXMoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgIHNwcmludGYoJ1RoZSBub2RlIFwiJWpcIiBpcyBub3QgaW4gdGhlIGRpZ3JhcGguJywgbilcbiAgICApO1xuICB9XG5cbiAgcHJlZGVjZXNzb3JzSXRlcihuKSB7XG4gICAgdmFyIG5icnMgPSB0aGlzLnByZWQuZ2V0KG4pO1xuICAgIGlmIChuYnJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBuYnJzLmtleXMoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEpTTmV0d29ya1hFcnJvcihcbiAgICAgIHNwcmludGYoJ1RoZSBub2RlIFwiJWpcIiBpcyBub3QgaW4gdGhlIGRpZ3JhcGguJywgbilcbiAgICApO1xuICB9XG5cbiAgc3VjY2Vzc29ycyhuKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdWNjZXNzb3JzSXRlcihuKSk7XG4gIH1cblxuICBwcmVkZWNlc3NvcnMobikge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucHJlZGVjZXNzb3JzSXRlcihuKSk7XG4gIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWEV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hFeGNlcHRpb25cIjtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hBbGdvcml0aG1FcnJvciBleHRlbmRzIEpTTmV0d29ya1hFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYQWxnb3JpdGhtRXJyb3JcIjtcbiAgfVxufVxuXG5jbGFzcyBKU05ldHdvcmtYRXJyb3IgZXh0ZW5kcyBKU05ldHdvcmtYRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIHRoaXMubmFtZSA9IFwiSlNOZXR3b3JrWEVycm9yXCI7XG4gIH1cbn1cblxuY2xhc3MgSlNOZXR3b3JrWFVuZmVhc2libGUgZXh0ZW5kcyBKU05ldHdvcmtYQWxnb3JpdGhtRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgdGhpcy5uYW1lID0gXCJKU05ldHdvcmtYVW5mZWFzaWJsZVwiO1xuICB9XG59XG5cbmNsYXNzIEpTTmV0d29ya1hOb1BhdGggZXh0ZW5kcyBKU05ldHdvcmtYVW5mZWFzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICB0aGlzLm5hbWUgPSBcIkpTTmV0d29ya1hOb1BhdGhcIjtcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiBmcm9tIExvRGFzaCwgbmVlZGVkIGJ5IGZ1bmN0aW9ucyBmcm9tIEpTTmV0d29ya1hcbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gXCJvYmplY3RcIjtcbn1cblxuLy8gZnVuY3Rpb24gZnJvbSBMb0Rhc2gsIG5lZWRlZCBieSBmdW5jdGlvbnMgZnJvbSBKU05ldHdvcmtYXG5mdW5jdGlvbiBpc0Jvb2xlYW4odmFsdWUpIHtcbiAgdmFyIGJvb2xUYWcgPSBcIltvYmplY3QgQm9vbGVhbl1cIjtcbiAgcmV0dXJuIChcbiAgICB2YWx1ZSA9PT0gdHJ1ZSB8fFxuICAgIHZhbHVlID09PSBmYWxzZSB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYm9vbFRhZylcbiAgKTtcbn1cbiIsIi8qISBIYW1tZXIuSlMgLSB2Mi4wLjggLSAyMDE2LTA0LTIzXG4gKiBodHRwOi8vaGFtbWVyanMuZ2l0aHViLmlvL1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNiBKb3JpayBUYW5nZWxkZXI7XG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgKi9cbiFmdW5jdGlvbihhLGIsYyxkKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBlKGEsYixjKXtyZXR1cm4gc2V0VGltZW91dChqKGEsYyksYil9ZnVuY3Rpb24gZihhLGIsYyl7cmV0dXJuIEFycmF5LmlzQXJyYXkoYSk/KGcoYSxjW2JdLGMpLCEwKTohMX1mdW5jdGlvbiBnKGEsYixjKXt2YXIgZTtpZihhKWlmKGEuZm9yRWFjaClhLmZvckVhY2goYixjKTtlbHNlIGlmKGEubGVuZ3RoIT09ZClmb3IoZT0wO2U8YS5sZW5ndGg7KWIuY2FsbChjLGFbZV0sZSxhKSxlKys7ZWxzZSBmb3IoZSBpbiBhKWEuaGFzT3duUHJvcGVydHkoZSkmJmIuY2FsbChjLGFbZV0sZSxhKX1mdW5jdGlvbiBoKGIsYyxkKXt2YXIgZT1cIkRFUFJFQ0FURUQgTUVUSE9EOiBcIitjK1wiXFxuXCIrZCtcIiBBVCBcXG5cIjtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYz1uZXcgRXJyb3IoXCJnZXQtc3RhY2stdHJhY2VcIiksZD1jJiZjLnN0YWNrP2Muc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLFwiXCIpLnJlcGxhY2UoL15cXHMrYXRcXHMrL2dtLFwiXCIpLnJlcGxhY2UoL15PYmplY3QuPGFub255bW91cz5cXHMqXFwoL2dtLFwie2Fub255bW91c30oKUBcIik6XCJVbmtub3duIFN0YWNrIFRyYWNlXCIsZj1hLmNvbnNvbGUmJihhLmNvbnNvbGUud2Fybnx8YS5jb25zb2xlLmxvZyk7cmV0dXJuIGYmJmYuY2FsbChhLmNvbnNvbGUsZSxkKSxiLmFwcGx5KHRoaXMsYXJndW1lbnRzKX19ZnVuY3Rpb24gaShhLGIsYyl7dmFyIGQsZT1iLnByb3RvdHlwZTtkPWEucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSksZC5jb25zdHJ1Y3Rvcj1hLGQuX3N1cGVyPWUsYyYmbGEoZCxjKX1mdW5jdGlvbiBqKGEsYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkoYixhcmd1bWVudHMpfX1mdW5jdGlvbiBrKGEsYil7cmV0dXJuIHR5cGVvZiBhPT1vYT9hLmFwcGx5KGI/YlswXXx8ZDpkLGIpOmF9ZnVuY3Rpb24gbChhLGIpe3JldHVybiBhPT09ZD9iOmF9ZnVuY3Rpb24gbShhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EuYWRkRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbihhLGIsYyl7ZyhxKGIpLGZ1bmN0aW9uKGIpe2EucmVtb3ZlRXZlbnRMaXN0ZW5lcihiLGMsITEpfSl9ZnVuY3Rpb24gbyhhLGIpe2Zvcig7YTspe2lmKGE9PWIpcmV0dXJuITA7YT1hLnBhcmVudE5vZGV9cmV0dXJuITF9ZnVuY3Rpb24gcChhLGIpe3JldHVybiBhLmluZGV4T2YoYik+LTF9ZnVuY3Rpb24gcShhKXtyZXR1cm4gYS50cmltKCkuc3BsaXQoL1xccysvZyl9ZnVuY3Rpb24gcihhLGIsYyl7aWYoYS5pbmRleE9mJiYhYylyZXR1cm4gYS5pbmRleE9mKGIpO2Zvcih2YXIgZD0wO2Q8YS5sZW5ndGg7KXtpZihjJiZhW2RdW2NdPT1ifHwhYyYmYVtkXT09PWIpcmV0dXJuIGQ7ZCsrfXJldHVybi0xfWZ1bmN0aW9uIHMoYSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGEsMCl9ZnVuY3Rpb24gdChhLGIsYyl7Zm9yKHZhciBkPVtdLGU9W10sZj0wO2Y8YS5sZW5ndGg7KXt2YXIgZz1iP2FbZl1bYl06YVtmXTtyKGUsZyk8MCYmZC5wdXNoKGFbZl0pLGVbZl09ZyxmKyt9cmV0dXJuIGMmJihkPWI/ZC5zb3J0KGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGFbYl0+Y1tiXX0pOmQuc29ydCgpKSxkfWZ1bmN0aW9uIHUoYSxiKXtmb3IodmFyIGMsZSxmPWJbMF0udG9VcHBlckNhc2UoKStiLnNsaWNlKDEpLGc9MDtnPG1hLmxlbmd0aDspe2lmKGM9bWFbZ10sZT1jP2MrZjpiLGUgaW4gYSlyZXR1cm4gZTtnKyt9cmV0dXJuIGR9ZnVuY3Rpb24gdigpe3JldHVybiB1YSsrfWZ1bmN0aW9uIHcoYil7dmFyIGM9Yi5vd25lckRvY3VtZW50fHxiO3JldHVybiBjLmRlZmF1bHRWaWV3fHxjLnBhcmVudFdpbmRvd3x8YX1mdW5jdGlvbiB4KGEsYil7dmFyIGM9dGhpczt0aGlzLm1hbmFnZXI9YSx0aGlzLmNhbGxiYWNrPWIsdGhpcy5lbGVtZW50PWEuZWxlbWVudCx0aGlzLnRhcmdldD1hLm9wdGlvbnMuaW5wdXRUYXJnZXQsdGhpcy5kb21IYW5kbGVyPWZ1bmN0aW9uKGIpe2soYS5vcHRpb25zLmVuYWJsZSxbYV0pJiZjLmhhbmRsZXIoYil9LHRoaXMuaW5pdCgpfWZ1bmN0aW9uIHkoYSl7dmFyIGIsYz1hLm9wdGlvbnMuaW5wdXRDbGFzcztyZXR1cm4gbmV3KGI9Yz9jOnhhP006eWE/UDp3YT9SOkwpKGEseil9ZnVuY3Rpb24geihhLGIsYyl7dmFyIGQ9Yy5wb2ludGVycy5sZW5ndGgsZT1jLmNoYW5nZWRQb2ludGVycy5sZW5ndGgsZj1iJkVhJiZkLWU9PT0wLGc9YiYoR2F8SGEpJiZkLWU9PT0wO2MuaXNGaXJzdD0hIWYsYy5pc0ZpbmFsPSEhZyxmJiYoYS5zZXNzaW9uPXt9KSxjLmV2ZW50VHlwZT1iLEEoYSxjKSxhLmVtaXQoXCJoYW1tZXIuaW5wdXRcIixjKSxhLnJlY29nbml6ZShjKSxhLnNlc3Npb24ucHJldklucHV0PWN9ZnVuY3Rpb24gQShhLGIpe3ZhciBjPWEuc2Vzc2lvbixkPWIucG9pbnRlcnMsZT1kLmxlbmd0aDtjLmZpcnN0SW5wdXR8fChjLmZpcnN0SW5wdXQ9RChiKSksZT4xJiYhYy5maXJzdE11bHRpcGxlP2MuZmlyc3RNdWx0aXBsZT1EKGIpOjE9PT1lJiYoYy5maXJzdE11bHRpcGxlPSExKTt2YXIgZj1jLmZpcnN0SW5wdXQsZz1jLmZpcnN0TXVsdGlwbGUsaD1nP2cuY2VudGVyOmYuY2VudGVyLGk9Yi5jZW50ZXI9RShkKTtiLnRpbWVTdGFtcD1yYSgpLGIuZGVsdGFUaW1lPWIudGltZVN0YW1wLWYudGltZVN0YW1wLGIuYW5nbGU9SShoLGkpLGIuZGlzdGFuY2U9SChoLGkpLEIoYyxiKSxiLm9mZnNldERpcmVjdGlvbj1HKGIuZGVsdGFYLGIuZGVsdGFZKTt2YXIgaj1GKGIuZGVsdGFUaW1lLGIuZGVsdGFYLGIuZGVsdGFZKTtiLm92ZXJhbGxWZWxvY2l0eVg9ai54LGIub3ZlcmFsbFZlbG9jaXR5WT1qLnksYi5vdmVyYWxsVmVsb2NpdHk9cWEoai54KT5xYShqLnkpP2oueDpqLnksYi5zY2FsZT1nP0soZy5wb2ludGVycyxkKToxLGIucm90YXRpb249Zz9KKGcucG9pbnRlcnMsZCk6MCxiLm1heFBvaW50ZXJzPWMucHJldklucHV0P2IucG9pbnRlcnMubGVuZ3RoPmMucHJldklucHV0Lm1heFBvaW50ZXJzP2IucG9pbnRlcnMubGVuZ3RoOmMucHJldklucHV0Lm1heFBvaW50ZXJzOmIucG9pbnRlcnMubGVuZ3RoLEMoYyxiKTt2YXIgaz1hLmVsZW1lbnQ7byhiLnNyY0V2ZW50LnRhcmdldCxrKSYmKGs9Yi5zcmNFdmVudC50YXJnZXQpLGIudGFyZ2V0PWt9ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWIuY2VudGVyLGQ9YS5vZmZzZXREZWx0YXx8e30sZT1hLnByZXZEZWx0YXx8e30sZj1hLnByZXZJbnB1dHx8e307Yi5ldmVudFR5cGUhPT1FYSYmZi5ldmVudFR5cGUhPT1HYXx8KGU9YS5wcmV2RGVsdGE9e3g6Zi5kZWx0YVh8fDAseTpmLmRlbHRhWXx8MH0sZD1hLm9mZnNldERlbHRhPXt4OmMueCx5OmMueX0pLGIuZGVsdGFYPWUueCsoYy54LWQueCksYi5kZWx0YVk9ZS55KyhjLnktZC55KX1mdW5jdGlvbiBDKGEsYil7dmFyIGMsZSxmLGcsaD1hLmxhc3RJbnRlcnZhbHx8YixpPWIudGltZVN0YW1wLWgudGltZVN0YW1wO2lmKGIuZXZlbnRUeXBlIT1IYSYmKGk+RGF8fGgudmVsb2NpdHk9PT1kKSl7dmFyIGo9Yi5kZWx0YVgtaC5kZWx0YVgsaz1iLmRlbHRhWS1oLmRlbHRhWSxsPUYoaSxqLGspO2U9bC54LGY9bC55LGM9cWEobC54KT5xYShsLnkpP2wueDpsLnksZz1HKGosayksYS5sYXN0SW50ZXJ2YWw9Yn1lbHNlIGM9aC52ZWxvY2l0eSxlPWgudmVsb2NpdHlYLGY9aC52ZWxvY2l0eVksZz1oLmRpcmVjdGlvbjtiLnZlbG9jaXR5PWMsYi52ZWxvY2l0eVg9ZSxiLnZlbG9jaXR5WT1mLGIuZGlyZWN0aW9uPWd9ZnVuY3Rpb24gRChhKXtmb3IodmFyIGI9W10sYz0wO2M8YS5wb2ludGVycy5sZW5ndGg7KWJbY109e2NsaWVudFg6cGEoYS5wb2ludGVyc1tjXS5jbGllbnRYKSxjbGllbnRZOnBhKGEucG9pbnRlcnNbY10uY2xpZW50WSl9LGMrKztyZXR1cm57dGltZVN0YW1wOnJhKCkscG9pbnRlcnM6YixjZW50ZXI6RShiKSxkZWx0YVg6YS5kZWx0YVgsZGVsdGFZOmEuZGVsdGFZfX1mdW5jdGlvbiBFKGEpe3ZhciBiPWEubGVuZ3RoO2lmKDE9PT1iKXJldHVybnt4OnBhKGFbMF0uY2xpZW50WCkseTpwYShhWzBdLmNsaWVudFkpfTtmb3IodmFyIGM9MCxkPTAsZT0wO2I+ZTspYys9YVtlXS5jbGllbnRYLGQrPWFbZV0uY2xpZW50WSxlKys7cmV0dXJue3g6cGEoYy9iKSx5OnBhKGQvYil9fWZ1bmN0aW9uIEYoYSxiLGMpe3JldHVybnt4OmIvYXx8MCx5OmMvYXx8MH19ZnVuY3Rpb24gRyhhLGIpe3JldHVybiBhPT09Yj9JYTpxYShhKT49cWEoYik/MD5hP0phOkthOjA+Yj9MYTpNYX1mdW5jdGlvbiBIKGEsYixjKXtjfHwoYz1RYSk7dmFyIGQ9YltjWzBdXS1hW2NbMF1dLGU9YltjWzFdXS1hW2NbMV1dO3JldHVybiBNYXRoLnNxcnQoZCpkK2UqZSl9ZnVuY3Rpb24gSShhLGIsYyl7Y3x8KGM9UWEpO3ZhciBkPWJbY1swXV0tYVtjWzBdXSxlPWJbY1sxXV0tYVtjWzFdXTtyZXR1cm4gMTgwKk1hdGguYXRhbjIoZSxkKS9NYXRoLlBJfWZ1bmN0aW9uIEooYSxiKXtyZXR1cm4gSShiWzFdLGJbMF0sUmEpK0koYVsxXSxhWzBdLFJhKX1mdW5jdGlvbiBLKGEsYil7cmV0dXJuIEgoYlswXSxiWzFdLFJhKS9IKGFbMF0sYVsxXSxSYSl9ZnVuY3Rpb24gTCgpe3RoaXMuZXZFbD1UYSx0aGlzLmV2V2luPVVhLHRoaXMucHJlc3NlZD0hMSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBNKCl7dGhpcy5ldkVsPVhhLHRoaXMuZXZXaW49WWEseC5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcy5zdG9yZT10aGlzLm1hbmFnZXIuc2Vzc2lvbi5wb2ludGVyRXZlbnRzPVtdfWZ1bmN0aW9uIE4oKXt0aGlzLmV2VGFyZ2V0PSRhLHRoaXMuZXZXaW49X2EsdGhpcy5zdGFydGVkPSExLHguYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIE8oYSxiKXt2YXIgYz1zKGEudG91Y2hlcyksZD1zKGEuY2hhbmdlZFRvdWNoZXMpO3JldHVybiBiJihHYXxIYSkmJihjPXQoYy5jb25jYXQoZCksXCJpZGVudGlmaWVyXCIsITApKSxbYyxkXX1mdW5jdGlvbiBQKCl7dGhpcy5ldlRhcmdldD1iYix0aGlzLnRhcmdldElkcz17fSx4LmFwcGx5KHRoaXMsYXJndW1lbnRzKX1mdW5jdGlvbiBRKGEsYil7dmFyIGM9cyhhLnRvdWNoZXMpLGQ9dGhpcy50YXJnZXRJZHM7aWYoYiYoRWF8RmEpJiYxPT09Yy5sZW5ndGgpcmV0dXJuIGRbY1swXS5pZGVudGlmaWVyXT0hMCxbYyxjXTt2YXIgZSxmLGc9cyhhLmNoYW5nZWRUb3VjaGVzKSxoPVtdLGk9dGhpcy50YXJnZXQ7aWYoZj1jLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gbyhhLnRhcmdldCxpKX0pLGI9PT1FYSlmb3IoZT0wO2U8Zi5sZW5ndGg7KWRbZltlXS5pZGVudGlmaWVyXT0hMCxlKys7Zm9yKGU9MDtlPGcubGVuZ3RoOylkW2dbZV0uaWRlbnRpZmllcl0mJmgucHVzaChnW2VdKSxiJihHYXxIYSkmJmRlbGV0ZSBkW2dbZV0uaWRlbnRpZmllcl0sZSsrO3JldHVybiBoLmxlbmd0aD9bdChmLmNvbmNhdChoKSxcImlkZW50aWZpZXJcIiwhMCksaF06dm9pZCAwfWZ1bmN0aW9uIFIoKXt4LmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgYT1qKHRoaXMuaGFuZGxlcix0aGlzKTt0aGlzLnRvdWNoPW5ldyBQKHRoaXMubWFuYWdlcixhKSx0aGlzLm1vdXNlPW5ldyBMKHRoaXMubWFuYWdlcixhKSx0aGlzLnByaW1hcnlUb3VjaD1udWxsLHRoaXMubGFzdFRvdWNoZXM9W119ZnVuY3Rpb24gUyhhLGIpe2EmRWE/KHRoaXMucHJpbWFyeVRvdWNoPWIuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXIsVC5jYWxsKHRoaXMsYikpOmEmKEdhfEhhKSYmVC5jYWxsKHRoaXMsYil9ZnVuY3Rpb24gVChhKXt2YXIgYj1hLmNoYW5nZWRQb2ludGVyc1swXTtpZihiLmlkZW50aWZpZXI9PT10aGlzLnByaW1hcnlUb3VjaCl7dmFyIGM9e3g6Yi5jbGllbnRYLHk6Yi5jbGllbnRZfTt0aGlzLmxhc3RUb3VjaGVzLnB1c2goYyk7dmFyIGQ9dGhpcy5sYXN0VG91Y2hlcyxlPWZ1bmN0aW9uKCl7dmFyIGE9ZC5pbmRleE9mKGMpO2E+LTEmJmQuc3BsaWNlKGEsMSl9O3NldFRpbWVvdXQoZSxjYil9fWZ1bmN0aW9uIFUoYSl7Zm9yKHZhciBiPWEuc3JjRXZlbnQuY2xpZW50WCxjPWEuc3JjRXZlbnQuY2xpZW50WSxkPTA7ZDx0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDtkKyspe3ZhciBlPXRoaXMubGFzdFRvdWNoZXNbZF0sZj1NYXRoLmFicyhiLWUueCksZz1NYXRoLmFicyhjLWUueSk7aWYoZGI+PWYmJmRiPj1nKXJldHVybiEwfXJldHVybiExfWZ1bmN0aW9uIFYoYSxiKXt0aGlzLm1hbmFnZXI9YSx0aGlzLnNldChiKX1mdW5jdGlvbiBXKGEpe2lmKHAoYSxqYikpcmV0dXJuIGpiO3ZhciBiPXAoYSxrYiksYz1wKGEsbGIpO3JldHVybiBiJiZjP2piOmJ8fGM/Yj9rYjpsYjpwKGEsaWIpP2liOmhifWZ1bmN0aW9uIFgoKXtpZighZmIpcmV0dXJuITE7dmFyIGI9e30sYz1hLkNTUyYmYS5DU1Muc3VwcG9ydHM7cmV0dXJuW1wiYXV0b1wiLFwibWFuaXB1bGF0aW9uXCIsXCJwYW4teVwiLFwicGFuLXhcIixcInBhbi14IHBhbi15XCIsXCJub25lXCJdLmZvckVhY2goZnVuY3Rpb24oZCl7YltkXT1jP2EuQ1NTLnN1cHBvcnRzKFwidG91Y2gtYWN0aW9uXCIsZCk6ITB9KSxifWZ1bmN0aW9uIFkoYSl7dGhpcy5vcHRpb25zPWxhKHt9LHRoaXMuZGVmYXVsdHMsYXx8e30pLHRoaXMuaWQ9digpLHRoaXMubWFuYWdlcj1udWxsLHRoaXMub3B0aW9ucy5lbmFibGU9bCh0aGlzLm9wdGlvbnMuZW5hYmxlLCEwKSx0aGlzLnN0YXRlPW5iLHRoaXMuc2ltdWx0YW5lb3VzPXt9LHRoaXMucmVxdWlyZUZhaWw9W119ZnVuY3Rpb24gWihhKXtyZXR1cm4gYSZzYj9cImNhbmNlbFwiOmEmcWI/XCJlbmRcIjphJnBiP1wibW92ZVwiOmEmb2I/XCJzdGFydFwiOlwiXCJ9ZnVuY3Rpb24gJChhKXtyZXR1cm4gYT09TWE/XCJkb3duXCI6YT09TGE/XCJ1cFwiOmE9PUphP1wibGVmdFwiOmE9PUthP1wicmlnaHRcIjpcIlwifWZ1bmN0aW9uIF8oYSxiKXt2YXIgYz1iLm1hbmFnZXI7cmV0dXJuIGM/Yy5nZXQoYSk6YX1mdW5jdGlvbiBhYSgpe1kuYXBwbHkodGhpcyxhcmd1bWVudHMpfWZ1bmN0aW9uIGJhKCl7YWEuYXBwbHkodGhpcyxhcmd1bWVudHMpLHRoaXMucFg9bnVsbCx0aGlzLnBZPW51bGx9ZnVuY3Rpb24gY2EoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZGEoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGx9ZnVuY3Rpb24gZWEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZmEoKXthYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9ZnVuY3Rpb24gZ2EoKXtZLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzLnBUaW1lPSExLHRoaXMucENlbnRlcj0hMSx0aGlzLl90aW1lcj1udWxsLHRoaXMuX2lucHV0PW51bGwsdGhpcy5jb3VudD0wfWZ1bmN0aW9uIGhhKGEsYil7cmV0dXJuIGI9Ynx8e30sYi5yZWNvZ25pemVycz1sKGIucmVjb2duaXplcnMsaGEuZGVmYXVsdHMucHJlc2V0KSxuZXcgaWEoYSxiKX1mdW5jdGlvbiBpYShhLGIpe3RoaXMub3B0aW9ucz1sYSh7fSxoYS5kZWZhdWx0cyxifHx7fSksdGhpcy5vcHRpb25zLmlucHV0VGFyZ2V0PXRoaXMub3B0aW9ucy5pbnB1dFRhcmdldHx8YSx0aGlzLmhhbmRsZXJzPXt9LHRoaXMuc2Vzc2lvbj17fSx0aGlzLnJlY29nbml6ZXJzPVtdLHRoaXMub2xkQ3NzUHJvcHM9e30sdGhpcy5lbGVtZW50PWEsdGhpcy5pbnB1dD15KHRoaXMpLHRoaXMudG91Y2hBY3Rpb249bmV3IFYodGhpcyx0aGlzLm9wdGlvbnMudG91Y2hBY3Rpb24pLGphKHRoaXMsITApLGcodGhpcy5vcHRpb25zLnJlY29nbml6ZXJzLGZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuYWRkKG5ldyBhWzBdKGFbMV0pKTthWzJdJiZiLnJlY29nbml6ZVdpdGgoYVsyXSksYVszXSYmYi5yZXF1aXJlRmFpbHVyZShhWzNdKX0sdGhpcyl9ZnVuY3Rpb24gamEoYSxiKXt2YXIgYz1hLmVsZW1lbnQ7aWYoYy5zdHlsZSl7dmFyIGQ7ZyhhLm9wdGlvbnMuY3NzUHJvcHMsZnVuY3Rpb24oZSxmKXtkPXUoYy5zdHlsZSxmKSxiPyhhLm9sZENzc1Byb3BzW2RdPWMuc3R5bGVbZF0sYy5zdHlsZVtkXT1lKTpjLnN0eWxlW2RdPWEub2xkQ3NzUHJvcHNbZF18fFwiXCJ9KSxifHwoYS5vbGRDc3NQcm9wcz17fSl9fWZ1bmN0aW9uIGthKGEsYyl7dmFyIGQ9Yi5jcmVhdGVFdmVudChcIkV2ZW50XCIpO2QuaW5pdEV2ZW50KGEsITAsITApLGQuZ2VzdHVyZT1jLGMudGFyZ2V0LmRpc3BhdGNoRXZlbnQoZCl9dmFyIGxhLG1hPVtcIlwiLFwid2Via2l0XCIsXCJNb3pcIixcIk1TXCIsXCJtc1wiLFwib1wiXSxuYT1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksb2E9XCJmdW5jdGlvblwiLHBhPU1hdGgucm91bmQscWE9TWF0aC5hYnMscmE9RGF0ZS5ub3c7bGE9XCJmdW5jdGlvblwiIT10eXBlb2YgT2JqZWN0LmFzc2lnbj9mdW5jdGlvbihhKXtpZihhPT09ZHx8bnVsbD09PWEpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdFwiKTtmb3IodmFyIGI9T2JqZWN0KGEpLGM9MTtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKXt2YXIgZT1hcmd1bWVudHNbY107aWYoZSE9PWQmJm51bGwhPT1lKWZvcih2YXIgZiBpbiBlKWUuaGFzT3duUHJvcGVydHkoZikmJihiW2ZdPWVbZl0pfXJldHVybiBifTpPYmplY3QuYXNzaWduO3ZhciBzYT1oKGZ1bmN0aW9uKGEsYixjKXtmb3IodmFyIGU9T2JqZWN0LmtleXMoYiksZj0wO2Y8ZS5sZW5ndGg7KSghY3x8YyYmYVtlW2ZdXT09PWQpJiYoYVtlW2ZdXT1iW2VbZl1dKSxmKys7cmV0dXJuIGF9LFwiZXh0ZW5kXCIsXCJVc2UgYGFzc2lnbmAuXCIpLHRhPWgoZnVuY3Rpb24oYSxiKXtyZXR1cm4gc2EoYSxiLCEwKX0sXCJtZXJnZVwiLFwiVXNlIGBhc3NpZ25gLlwiKSx1YT0xLHZhPS9tb2JpbGV8dGFibGV0fGlwKGFkfGhvbmV8b2QpfGFuZHJvaWQvaSx3YT1cIm9udG91Y2hzdGFydFwiaW4gYSx4YT11KGEsXCJQb2ludGVyRXZlbnRcIikhPT1kLHlhPXdhJiZ2YS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLHphPVwidG91Y2hcIixBYT1cInBlblwiLEJhPVwibW91c2VcIixDYT1cImtpbmVjdFwiLERhPTI1LEVhPTEsRmE9MixHYT00LEhhPTgsSWE9MSxKYT0yLEthPTQsTGE9OCxNYT0xNixOYT1KYXxLYSxPYT1MYXxNYSxQYT1OYXxPYSxRYT1bXCJ4XCIsXCJ5XCJdLFJhPVtcImNsaWVudFhcIixcImNsaWVudFlcIl07eC5wcm90b3R5cGU9e2hhbmRsZXI6ZnVuY3Rpb24oKXt9LGluaXQ6ZnVuY3Rpb24oKXt0aGlzLmV2RWwmJm0odGhpcy5lbGVtZW50LHRoaXMuZXZFbCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZUYXJnZXQmJm0odGhpcy50YXJnZXQsdGhpcy5ldlRhcmdldCx0aGlzLmRvbUhhbmRsZXIpLHRoaXMuZXZXaW4mJm0odyh0aGlzLmVsZW1lbnQpLHRoaXMuZXZXaW4sdGhpcy5kb21IYW5kbGVyKX0sZGVzdHJveTpmdW5jdGlvbigpe3RoaXMuZXZFbCYmbih0aGlzLmVsZW1lbnQsdGhpcy5ldkVsLHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldlRhcmdldCYmbih0aGlzLnRhcmdldCx0aGlzLmV2VGFyZ2V0LHRoaXMuZG9tSGFuZGxlciksdGhpcy5ldldpbiYmbih3KHRoaXMuZWxlbWVudCksdGhpcy5ldldpbix0aGlzLmRvbUhhbmRsZXIpfX07dmFyIFNhPXttb3VzZWRvd246RWEsbW91c2Vtb3ZlOkZhLG1vdXNldXA6R2F9LFRhPVwibW91c2Vkb3duXCIsVWE9XCJtb3VzZW1vdmUgbW91c2V1cFwiO2koTCx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVNhW2EudHlwZV07YiZFYSYmMD09PWEuYnV0dG9uJiYodGhpcy5wcmVzc2VkPSEwKSxiJkZhJiYxIT09YS53aGljaCYmKGI9R2EpLHRoaXMucHJlc3NlZCYmKGImR2EmJih0aGlzLnByZXNzZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOlthXSxjaGFuZ2VkUG9pbnRlcnM6W2FdLHBvaW50ZXJUeXBlOkJhLHNyY0V2ZW50OmF9KSl9fSk7dmFyIFZhPXtwb2ludGVyZG93bjpFYSxwb2ludGVybW92ZTpGYSxwb2ludGVydXA6R2EscG9pbnRlcmNhbmNlbDpIYSxwb2ludGVyb3V0OkhhfSxXYT17Mjp6YSwzOkFhLDQ6QmEsNTpDYX0sWGE9XCJwb2ludGVyZG93blwiLFlhPVwicG9pbnRlcm1vdmUgcG9pbnRlcnVwIHBvaW50ZXJjYW5jZWxcIjthLk1TUG9pbnRlckV2ZW50JiYhYS5Qb2ludGVyRXZlbnQmJihYYT1cIk1TUG9pbnRlckRvd25cIixZYT1cIk1TUG9pbnRlck1vdmUgTVNQb2ludGVyVXAgTVNQb2ludGVyQ2FuY2VsXCIpLGkoTSx4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPXRoaXMuc3RvcmUsYz0hMSxkPWEudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoXCJtc1wiLFwiXCIpLGU9VmFbZF0sZj1XYVthLnBvaW50ZXJUeXBlXXx8YS5wb2ludGVyVHlwZSxnPWY9PXphLGg9cihiLGEucG9pbnRlcklkLFwicG9pbnRlcklkXCIpO2UmRWEmJigwPT09YS5idXR0b258fGcpPzA+aCYmKGIucHVzaChhKSxoPWIubGVuZ3RoLTEpOmUmKEdhfEhhKSYmKGM9ITApLDA+aHx8KGJbaF09YSx0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlcixlLHtwb2ludGVyczpiLGNoYW5nZWRQb2ludGVyczpbYV0scG9pbnRlclR5cGU6ZixzcmNFdmVudDphfSksYyYmYi5zcGxpY2UoaCwxKSl9fSk7dmFyIFphPXt0b3VjaHN0YXJ0OkVhLHRvdWNobW92ZTpGYSx0b3VjaGVuZDpHYSx0b3VjaGNhbmNlbDpIYX0sJGE9XCJ0b3VjaHN0YXJ0XCIsX2E9XCJ0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbFwiO2koTix4LHtoYW5kbGVyOmZ1bmN0aW9uKGEpe3ZhciBiPVphW2EudHlwZV07aWYoYj09PUVhJiYodGhpcy5zdGFydGVkPSEwKSx0aGlzLnN0YXJ0ZWQpe3ZhciBjPU8uY2FsbCh0aGlzLGEsYik7YiYoR2F8SGEpJiZjWzBdLmxlbmd0aC1jWzFdLmxlbmd0aD09PTAmJih0aGlzLnN0YXJ0ZWQ9ITEpLHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLGIse3BvaW50ZXJzOmNbMF0sY2hhbmdlZFBvaW50ZXJzOmNbMV0scG9pbnRlclR5cGU6emEsc3JjRXZlbnQ6YX0pfX19KTt2YXIgYWI9e3RvdWNoc3RhcnQ6RWEsdG91Y2htb3ZlOkZhLHRvdWNoZW5kOkdhLHRvdWNoY2FuY2VsOkhhfSxiYj1cInRvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsXCI7aShQLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSl7dmFyIGI9YWJbYS50eXBlXSxjPVEuY2FsbCh0aGlzLGEsYik7YyYmdGhpcy5jYWxsYmFjayh0aGlzLm1hbmFnZXIsYix7cG9pbnRlcnM6Y1swXSxjaGFuZ2VkUG9pbnRlcnM6Y1sxXSxwb2ludGVyVHlwZTp6YSxzcmNFdmVudDphfSl9fSk7dmFyIGNiPTI1MDAsZGI9MjU7aShSLHgse2hhbmRsZXI6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPWMucG9pbnRlclR5cGU9PXphLGU9Yy5wb2ludGVyVHlwZT09QmE7aWYoIShlJiZjLnNvdXJjZUNhcGFiaWxpdGllcyYmYy5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykpe2lmKGQpUy5jYWxsKHRoaXMsYixjKTtlbHNlIGlmKGUmJlUuY2FsbCh0aGlzLGMpKXJldHVybjt0aGlzLmNhbGxiYWNrKGEsYixjKX19LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLnRvdWNoLmRlc3Ryb3koKSx0aGlzLm1vdXNlLmRlc3Ryb3koKX19KTt2YXIgZWI9dShuYS5zdHlsZSxcInRvdWNoQWN0aW9uXCIpLGZiPWViIT09ZCxnYj1cImNvbXB1dGVcIixoYj1cImF1dG9cIixpYj1cIm1hbmlwdWxhdGlvblwiLGpiPVwibm9uZVwiLGtiPVwicGFuLXhcIixsYj1cInBhbi15XCIsbWI9WCgpO1YucHJvdG90eXBlPXtzZXQ6ZnVuY3Rpb24oYSl7YT09Z2ImJihhPXRoaXMuY29tcHV0ZSgpKSxmYiYmdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUmJm1iW2FdJiYodGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGVbZWJdPWEpLHRoaXMuYWN0aW9ucz1hLnRvTG93ZXJDYXNlKCkudHJpbSgpfSx1cGRhdGU6ZnVuY3Rpb24oKXt0aGlzLnNldCh0aGlzLm1hbmFnZXIub3B0aW9ucy50b3VjaEFjdGlvbil9LGNvbXB1dGU6ZnVuY3Rpb24oKXt2YXIgYT1bXTtyZXR1cm4gZyh0aGlzLm1hbmFnZXIucmVjb2duaXplcnMsZnVuY3Rpb24oYil7ayhiLm9wdGlvbnMuZW5hYmxlLFtiXSkmJihhPWEuY29uY2F0KGIuZ2V0VG91Y2hBY3Rpb24oKSkpfSksVyhhLmpvaW4oXCIgXCIpKX0scHJldmVudERlZmF1bHRzOmZ1bmN0aW9uKGEpe3ZhciBiPWEuc3JjRXZlbnQsYz1hLm9mZnNldERpcmVjdGlvbjtpZih0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpcmV0dXJuIHZvaWQgYi5wcmV2ZW50RGVmYXVsdCgpO3ZhciBkPXRoaXMuYWN0aW9ucyxlPXAoZCxqYikmJiFtYltqYl0sZj1wKGQsbGIpJiYhbWJbbGJdLGc9cChkLGtiKSYmIW1iW2tiXTtpZihlKXt2YXIgaD0xPT09YS5wb2ludGVycy5sZW5ndGgsaT1hLmRpc3RhbmNlPDIsaj1hLmRlbHRhVGltZTwyNTA7aWYoaCYmaSYmailyZXR1cm59cmV0dXJuIGcmJmY/dm9pZCAwOmV8fGYmJmMmTmF8fGcmJmMmT2E/dGhpcy5wcmV2ZW50U3JjKGIpOnZvaWQgMH0scHJldmVudFNyYzpmdW5jdGlvbihhKXt0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQ9ITAsYS5wcmV2ZW50RGVmYXVsdCgpfX07dmFyIG5iPTEsb2I9MixwYj00LHFiPTgscmI9cWIsc2I9MTYsdGI9MzI7WS5wcm90b3R5cGU9e2RlZmF1bHRzOnt9LHNldDpmdW5jdGlvbihhKXtyZXR1cm4gbGEodGhpcy5vcHRpb25zLGEpLHRoaXMubWFuYWdlciYmdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpLHRoaXN9LHJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVjb2duaXplV2l0aFwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMuc2ltdWx0YW5lb3VzO3JldHVybiBhPV8oYSx0aGlzKSxiW2EuaWRdfHwoYlthLmlkXT1hLGEucmVjb2duaXplV2l0aCh0aGlzKSksdGhpc30sZHJvcFJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSxcImRyb3BSZWNvZ25pemVXaXRoXCIsdGhpcyk/dGhpczooYT1fKGEsdGhpcyksZGVsZXRlIHRoaXMuc2ltdWx0YW5lb3VzW2EuaWRdLHRoaXMpfSxyZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJyZXF1aXJlRmFpbHVyZVwiLHRoaXMpKXJldHVybiB0aGlzO3ZhciBiPXRoaXMucmVxdWlyZUZhaWw7cmV0dXJuIGE9XyhhLHRoaXMpLC0xPT09cihiLGEpJiYoYi5wdXNoKGEpLGEucmVxdWlyZUZhaWx1cmUodGhpcykpLHRoaXN9LGRyb3BSZXF1aXJlRmFpbHVyZTpmdW5jdGlvbihhKXtpZihmKGEsXCJkcm9wUmVxdWlyZUZhaWx1cmVcIix0aGlzKSlyZXR1cm4gdGhpczthPV8oYSx0aGlzKTt2YXIgYj1yKHRoaXMucmVxdWlyZUZhaWwsYSk7cmV0dXJuIGI+LTEmJnRoaXMucmVxdWlyZUZhaWwuc3BsaWNlKGIsMSksdGhpc30saGFzUmVxdWlyZUZhaWx1cmVzOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVxdWlyZUZhaWwubGVuZ3RoPjB9LGNhblJlY29nbml6ZVdpdGg6ZnVuY3Rpb24oYSl7cmV0dXJuISF0aGlzLnNpbXVsdGFuZW91c1thLmlkXX0sZW1pdDpmdW5jdGlvbihhKXtmdW5jdGlvbiBiKGIpe2MubWFuYWdlci5lbWl0KGIsYSl9dmFyIGM9dGhpcyxkPXRoaXMuc3RhdGU7cWI+ZCYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSksYihjLm9wdGlvbnMuZXZlbnQpLGEuYWRkaXRpb25hbEV2ZW50JiZiKGEuYWRkaXRpb25hbEV2ZW50KSxkPj1xYiYmYihjLm9wdGlvbnMuZXZlbnQrWihkKSl9LHRyeUVtaXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMuY2FuRW1pdCgpP3RoaXMuZW1pdChhKTp2b2lkKHRoaXMuc3RhdGU9dGIpfSxjYW5FbWl0OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTx0aGlzLnJlcXVpcmVGYWlsLmxlbmd0aDspe2lmKCEodGhpcy5yZXF1aXJlRmFpbFthXS5zdGF0ZSYodGJ8bmIpKSlyZXR1cm4hMTthKyt9cmV0dXJuITB9LHJlY29nbml6ZTpmdW5jdGlvbihhKXt2YXIgYj1sYSh7fSxhKTtyZXR1cm4gayh0aGlzLm9wdGlvbnMuZW5hYmxlLFt0aGlzLGJdKT8odGhpcy5zdGF0ZSYocmJ8c2J8dGIpJiYodGhpcy5zdGF0ZT1uYiksdGhpcy5zdGF0ZT10aGlzLnByb2Nlc3MoYiksdm9pZCh0aGlzLnN0YXRlJihvYnxwYnxxYnxzYikmJnRoaXMudHJ5RW1pdChiKSkpOih0aGlzLnJlc2V0KCksdm9pZCh0aGlzLnN0YXRlPXRiKSl9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7fSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe30scmVzZXQ6ZnVuY3Rpb24oKXt9fSxpKGFhLFkse2RlZmF1bHRzOntwb2ludGVyczoxfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMucG9pbnRlcnM7cmV0dXJuIDA9PT1ifHxhLnBvaW50ZXJzLmxlbmd0aD09PWJ9LHByb2Nlc3M6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zdGF0ZSxjPWEuZXZlbnRUeXBlLGQ9YiYob2J8cGIpLGU9dGhpcy5hdHRyVGVzdChhKTtyZXR1cm4gZCYmKGMmSGF8fCFlKT9ifHNiOmR8fGU/YyZHYT9ifHFiOmImb2I/YnxwYjpvYjp0Yn19KSxpKGJhLGFhLHtkZWZhdWx0czp7ZXZlbnQ6XCJwYW5cIix0aHJlc2hvbGQ6MTAscG9pbnRlcnM6MSxkaXJlY3Rpb246UGF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5vcHRpb25zLmRpcmVjdGlvbixiPVtdO3JldHVybiBhJk5hJiZiLnB1c2gobGIpLGEmT2EmJmIucHVzaChrYiksYn0sZGlyZWN0aW9uVGVzdDpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz0hMCxkPWEuZGlzdGFuY2UsZT1hLmRpcmVjdGlvbixmPWEuZGVsdGFYLGc9YS5kZWx0YVk7cmV0dXJuIGUmYi5kaXJlY3Rpb258fChiLmRpcmVjdGlvbiZOYT8oZT0wPT09Zj9JYTowPmY/SmE6S2EsYz1mIT10aGlzLnBYLGQ9TWF0aC5hYnMoYS5kZWx0YVgpKTooZT0wPT09Zz9JYTowPmc/TGE6TWEsYz1nIT10aGlzLnBZLGQ9TWF0aC5hYnMoYS5kZWx0YVkpKSksYS5kaXJlY3Rpb249ZSxjJiZkPmIudGhyZXNob2xkJiZlJmIuZGlyZWN0aW9ufSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gYWEucHJvdG90eXBlLmF0dHJUZXN0LmNhbGwodGhpcyxhKSYmKHRoaXMuc3RhdGUmb2J8fCEodGhpcy5zdGF0ZSZvYikmJnRoaXMuZGlyZWN0aW9uVGVzdChhKSl9LGVtaXQ6ZnVuY3Rpb24oYSl7dGhpcy5wWD1hLmRlbHRhWCx0aGlzLnBZPWEuZGVsdGFZO3ZhciBiPSQoYS5kaXJlY3Rpb24pO2ImJihhLmFkZGl0aW9uYWxFdmVudD10aGlzLm9wdGlvbnMuZXZlbnQrYiksdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShjYSxhYSx7ZGVmYXVsdHM6e2V2ZW50OlwicGluY2hcIix0aHJlc2hvbGQ6MCxwb2ludGVyczoyfSxnZXRUb3VjaEFjdGlvbjpmdW5jdGlvbigpe3JldHVybltqYl19LGF0dHJUZXN0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJihNYXRoLmFicyhhLnNjYWxlLTEpPnRoaXMub3B0aW9ucy50aHJlc2hvbGR8fHRoaXMuc3RhdGUmb2IpfSxlbWl0OmZ1bmN0aW9uKGEpe2lmKDEhPT1hLnNjYWxlKXt2YXIgYj1hLnNjYWxlPDE/XCJpblwiOlwib3V0XCI7YS5hZGRpdGlvbmFsRXZlbnQ9dGhpcy5vcHRpb25zLmV2ZW50K2J9dGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsYSl9fSksaShkYSxZLHtkZWZhdWx0czp7ZXZlbnQ6XCJwcmVzc1wiLHBvaW50ZXJzOjEsdGltZToyNTEsdGhyZXNob2xkOjl9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2hiXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU+Yi50aW1lO2lmKHRoaXMuX2lucHV0PWEsIWR8fCFjfHxhLmV2ZW50VHlwZSYoR2F8SGEpJiYhZil0aGlzLnJlc2V0KCk7ZWxzZSBpZihhLmV2ZW50VHlwZSZFYSl0aGlzLnJlc2V0KCksdGhpcy5fdGltZXI9ZShmdW5jdGlvbigpe3RoaXMuc3RhdGU9cmIsdGhpcy50cnlFbWl0KCl9LGIudGltZSx0aGlzKTtlbHNlIGlmKGEuZXZlbnRUeXBlJkdhKXJldHVybiByYjtyZXR1cm4gdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbihhKXt0aGlzLnN0YXRlPT09cmImJihhJiZhLmV2ZW50VHlwZSZHYT90aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQrXCJ1cFwiLGEpOih0aGlzLl9pbnB1dC50aW1lU3RhbXA9cmEoKSx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKSl9fSksaShlYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwicm90YXRlXCIsdGhyZXNob2xkOjAscG9pbnRlcnM6Mn0sZ2V0VG91Y2hBY3Rpb246ZnVuY3Rpb24oKXtyZXR1cm5bamJdfSxhdHRyVGVzdDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy5fc3VwZXIuYXR0clRlc3QuY2FsbCh0aGlzLGEpJiYoTWF0aC5hYnMoYS5yb3RhdGlvbik+dGhpcy5vcHRpb25zLnRocmVzaG9sZHx8dGhpcy5zdGF0ZSZvYil9fSksaShmYSxhYSx7ZGVmYXVsdHM6e2V2ZW50Olwic3dpcGVcIix0aHJlc2hvbGQ6MTAsdmVsb2NpdHk6LjMsZGlyZWN0aW9uOk5hfE9hLHBvaW50ZXJzOjF9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuIGJhLnByb3RvdHlwZS5nZXRUb3VjaEFjdGlvbi5jYWxsKHRoaXMpfSxhdHRyVGVzdDpmdW5jdGlvbihhKXt2YXIgYixjPXRoaXMub3B0aW9ucy5kaXJlY3Rpb247cmV0dXJuIGMmKE5hfE9hKT9iPWEub3ZlcmFsbFZlbG9jaXR5OmMmTmE/Yj1hLm92ZXJhbGxWZWxvY2l0eVg6YyZPYSYmKGI9YS5vdmVyYWxsVmVsb2NpdHlZKSx0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsYSkmJmMmYS5vZmZzZXREaXJlY3Rpb24mJmEuZGlzdGFuY2U+dGhpcy5vcHRpb25zLnRocmVzaG9sZCYmYS5tYXhQb2ludGVycz09dGhpcy5vcHRpb25zLnBvaW50ZXJzJiZxYShiKT50aGlzLm9wdGlvbnMudmVsb2NpdHkmJmEuZXZlbnRUeXBlJkdhfSxlbWl0OmZ1bmN0aW9uKGEpe3ZhciBiPSQoYS5vZmZzZXREaXJlY3Rpb24pO2ImJnRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCtiLGEpLHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCxhKX19KSxpKGdhLFkse2RlZmF1bHRzOntldmVudDpcInRhcFwiLHBvaW50ZXJzOjEsdGFwczoxLGludGVydmFsOjMwMCx0aW1lOjI1MCx0aHJlc2hvbGQ6OSxwb3NUaHJlc2hvbGQ6MTB9LGdldFRvdWNoQWN0aW9uOmZ1bmN0aW9uKCl7cmV0dXJuW2liXX0scHJvY2VzczpmdW5jdGlvbihhKXt2YXIgYj10aGlzLm9wdGlvbnMsYz1hLnBvaW50ZXJzLmxlbmd0aD09PWIucG9pbnRlcnMsZD1hLmRpc3RhbmNlPGIudGhyZXNob2xkLGY9YS5kZWx0YVRpbWU8Yi50aW1lO2lmKHRoaXMucmVzZXQoKSxhLmV2ZW50VHlwZSZFYSYmMD09PXRoaXMuY291bnQpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTtpZihkJiZmJiZjKXtpZihhLmV2ZW50VHlwZSE9R2EpcmV0dXJuIHRoaXMuZmFpbFRpbWVvdXQoKTt2YXIgZz10aGlzLnBUaW1lP2EudGltZVN0YW1wLXRoaXMucFRpbWU8Yi5pbnRlcnZhbDohMCxoPSF0aGlzLnBDZW50ZXJ8fEgodGhpcy5wQ2VudGVyLGEuY2VudGVyKTxiLnBvc1RocmVzaG9sZDt0aGlzLnBUaW1lPWEudGltZVN0YW1wLHRoaXMucENlbnRlcj1hLmNlbnRlcixoJiZnP3RoaXMuY291bnQrPTE6dGhpcy5jb3VudD0xLHRoaXMuX2lucHV0PWE7dmFyIGk9dGhpcy5jb3VudCViLnRhcHM7aWYoMD09PWkpcmV0dXJuIHRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCk/KHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXJiLHRoaXMudHJ5RW1pdCgpfSxiLmludGVydmFsLHRoaXMpLG9iKTpyYn1yZXR1cm4gdGJ9LGZhaWxUaW1lb3V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3RpbWVyPWUoZnVuY3Rpb24oKXt0aGlzLnN0YXRlPXRifSx0aGlzLm9wdGlvbnMuaW50ZXJ2YWwsdGhpcyksdGJ9LHJlc2V0OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKX0sZW1pdDpmdW5jdGlvbigpe3RoaXMuc3RhdGU9PXJiJiYodGhpcy5faW5wdXQudGFwQ291bnQ9dGhpcy5jb3VudCx0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQsdGhpcy5faW5wdXQpKX19KSxoYS5WRVJTSU9OPVwiMi4wLjhcIixoYS5kZWZhdWx0cz17ZG9tRXZlbnRzOiExLHRvdWNoQWN0aW9uOmdiLGVuYWJsZTohMCxpbnB1dFRhcmdldDpudWxsLGlucHV0Q2xhc3M6bnVsbCxwcmVzZXQ6W1tlYSx7ZW5hYmxlOiExfV0sW2NhLHtlbmFibGU6ITF9LFtcInJvdGF0ZVwiXV0sW2ZhLHtkaXJlY3Rpb246TmF9XSxbYmEse2RpcmVjdGlvbjpOYX0sW1wic3dpcGVcIl1dLFtnYV0sW2dhLHtldmVudDpcImRvdWJsZXRhcFwiLHRhcHM6Mn0sW1widGFwXCJdXSxbZGFdXSxjc3NQcm9wczp7dXNlclNlbGVjdDpcIm5vbmVcIix0b3VjaFNlbGVjdDpcIm5vbmVcIix0b3VjaENhbGxvdXQ6XCJub25lXCIsY29udGVudFpvb21pbmc6XCJub25lXCIsdXNlckRyYWc6XCJub25lXCIsdGFwSGlnaGxpZ2h0Q29sb3I6XCJyZ2JhKDAsMCwwLDApXCJ9fTt2YXIgdWI9MSx2Yj0yO2lhLnByb3RvdHlwZT17c2V0OmZ1bmN0aW9uKGEpe3JldHVybiBsYSh0aGlzLm9wdGlvbnMsYSksYS50b3VjaEFjdGlvbiYmdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhLmlucHV0VGFyZ2V0JiYodGhpcy5pbnB1dC5kZXN0cm95KCksdGhpcy5pbnB1dC50YXJnZXQ9YS5pbnB1dFRhcmdldCx0aGlzLmlucHV0LmluaXQoKSksdGhpc30sc3RvcDpmdW5jdGlvbihhKXt0aGlzLnNlc3Npb24uc3RvcHBlZD1hP3ZiOnVifSxyZWNvZ25pemU6ZnVuY3Rpb24oYSl7dmFyIGI9dGhpcy5zZXNzaW9uO2lmKCFiLnN0b3BwZWQpe3RoaXMudG91Y2hBY3Rpb24ucHJldmVudERlZmF1bHRzKGEpO3ZhciBjLGQ9dGhpcy5yZWNvZ25pemVycyxlPWIuY3VyUmVjb2duaXplcjsoIWV8fGUmJmUuc3RhdGUmcmIpJiYoZT1iLmN1clJlY29nbml6ZXI9bnVsbCk7Zm9yKHZhciBmPTA7ZjxkLmxlbmd0aDspYz1kW2ZdLGIuc3RvcHBlZD09PXZifHxlJiZjIT1lJiYhYy5jYW5SZWNvZ25pemVXaXRoKGUpP2MucmVzZXQoKTpjLnJlY29nbml6ZShhKSwhZSYmYy5zdGF0ZSYob2J8cGJ8cWIpJiYoZT1iLmN1clJlY29nbml6ZXI9YyksZisrfX0sZ2V0OmZ1bmN0aW9uKGEpe2lmKGEgaW5zdGFuY2VvZiBZKXJldHVybiBhO2Zvcih2YXIgYj10aGlzLnJlY29nbml6ZXJzLGM9MDtjPGIubGVuZ3RoO2MrKylpZihiW2NdLm9wdGlvbnMuZXZlbnQ9PWEpcmV0dXJuIGJbY107cmV0dXJuIG51bGx9LGFkZDpmdW5jdGlvbihhKXtpZihmKGEsXCJhZGRcIix0aGlzKSlyZXR1cm4gdGhpczt2YXIgYj10aGlzLmdldChhLm9wdGlvbnMuZXZlbnQpO3JldHVybiBiJiZ0aGlzLnJlbW92ZShiKSx0aGlzLnJlY29nbml6ZXJzLnB1c2goYSksYS5tYW5hZ2VyPXRoaXMsdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKSxhfSxyZW1vdmU6ZnVuY3Rpb24oYSl7aWYoZihhLFwicmVtb3ZlXCIsdGhpcykpcmV0dXJuIHRoaXM7aWYoYT10aGlzLmdldChhKSl7dmFyIGI9dGhpcy5yZWNvZ25pemVycyxjPXIoYixhKTstMSE9PWMmJihiLnNwbGljZShjLDEpLHRoaXMudG91Y2hBY3Rpb24udXBkYXRlKCkpfXJldHVybiB0aGlzfSxvbjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kJiZiIT09ZCl7dmFyIGM9dGhpcy5oYW5kbGVycztyZXR1cm4gZyhxKGEpLGZ1bmN0aW9uKGEpe2NbYV09Y1thXXx8W10sY1thXS5wdXNoKGIpfSksdGhpc319LG9mZjpmdW5jdGlvbihhLGIpe2lmKGEhPT1kKXt2YXIgYz10aGlzLmhhbmRsZXJzO3JldHVybiBnKHEoYSksZnVuY3Rpb24oYSl7Yj9jW2FdJiZjW2FdLnNwbGljZShyKGNbYV0sYiksMSk6ZGVsZXRlIGNbYV19KSx0aGlzfX0sZW1pdDpmdW5jdGlvbihhLGIpe3RoaXMub3B0aW9ucy5kb21FdmVudHMmJmthKGEsYik7dmFyIGM9dGhpcy5oYW5kbGVyc1thXSYmdGhpcy5oYW5kbGVyc1thXS5zbGljZSgpO2lmKGMmJmMubGVuZ3RoKXtiLnR5cGU9YSxiLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7Yi5zcmNFdmVudC5wcmV2ZW50RGVmYXVsdCgpfTtmb3IodmFyIGQ9MDtkPGMubGVuZ3RoOyljW2RdKGIpLGQrK319LGRlc3Ryb3k6ZnVuY3Rpb24oKXt0aGlzLmVsZW1lbnQmJmphKHRoaXMsITEpLHRoaXMuaGFuZGxlcnM9e30sdGhpcy5zZXNzaW9uPXt9LHRoaXMuaW5wdXQuZGVzdHJveSgpLHRoaXMuZWxlbWVudD1udWxsfX0sbGEoaGEse0lOUFVUX1NUQVJUOkVhLElOUFVUX01PVkU6RmEsSU5QVVRfRU5EOkdhLElOUFVUX0NBTkNFTDpIYSxTVEFURV9QT1NTSUJMRTpuYixTVEFURV9CRUdBTjpvYixTVEFURV9DSEFOR0VEOnBiLFNUQVRFX0VOREVEOnFiLFNUQVRFX1JFQ09HTklaRUQ6cmIsU1RBVEVfQ0FOQ0VMTEVEOnNiLFNUQVRFX0ZBSUxFRDp0YixESVJFQ1RJT05fTk9ORTpJYSxESVJFQ1RJT05fTEVGVDpKYSxESVJFQ1RJT05fUklHSFQ6S2EsRElSRUNUSU9OX1VQOkxhLERJUkVDVElPTl9ET1dOOk1hLERJUkVDVElPTl9IT1JJWk9OVEFMOk5hLERJUkVDVElPTl9WRVJUSUNBTDpPYSxESVJFQ1RJT05fQUxMOlBhLE1hbmFnZXI6aWEsSW5wdXQ6eCxUb3VjaEFjdGlvbjpWLFRvdWNoSW5wdXQ6UCxNb3VzZUlucHV0OkwsUG9pbnRlckV2ZW50SW5wdXQ6TSxUb3VjaE1vdXNlSW5wdXQ6UixTaW5nbGVUb3VjaElucHV0Ok4sUmVjb2duaXplcjpZLEF0dHJSZWNvZ25pemVyOmFhLFRhcDpnYSxQYW46YmEsU3dpcGU6ZmEsUGluY2g6Y2EsUm90YXRlOmVhLFByZXNzOmRhLG9uOm0sb2ZmOm4sZWFjaDpnLG1lcmdlOnRhLGV4dGVuZDpzYSxhc3NpZ246bGEsaW5oZXJpdDppLGJpbmRGbjpqLHByZWZpeGVkOnV9KTt2YXIgd2I9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGE/YTpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnt9O3diLkhhbW1lcj1oYSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQ/ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGhhfSk6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9aGE6YVtjXT1oYX0od2luZG93LGRvY3VtZW50LFwiSGFtbWVyXCIpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aGFtbWVyLm1pbi5qcy5tYXAiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=