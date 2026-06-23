"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_dragndrop_js_timeddnd_js"],{

/***/ 2053:
/*!**********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.sr-Cyrl.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "sr-Cyrl": {
        msg_dragndrop_correct_answer: "Тачан одговор!",
        msg_dragndrop_incorrect_answer:
            "Нетачно. Добили сте $1 тачних и $2 нетачних од $3. Остало вам је $4 празнина.",
        msg_dragndrop_place_more:
            "Молимо вас да поставите све картице пре провере одговора. Остало вам је још $1 за постављање.",
        msg_dragndrop_check_me: "Провери",
        msg_dragndrop_reset: "Поништи",
    },
});


/***/ }),

/***/ 17558:
/*!********************************************!*\
  !*** ./runestone/dragndrop/js/timeddnd.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedDragNDrop)
/* harmony export */ });
/* harmony import */ var _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dragndrop.js */ 23332);




class TimedDragNDrop extends _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.finishSettingUp();
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
    }
    hideButtons() {
        $(this.submitButton).hide();
    }
    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        $(timeIcon).attr({
            src: "../_static/clock.png",
            style: "width:15px;height:15px",
        });
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        $(component).prepend(timeIconDiv);
    }
    checkCorrectTimed() {
        // Returns if the question was correct.    Used for timed assessment grading.
        if (this.unansweredNum === this.dragPairArray.length) {
            this.correct = null;
        }
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
        $(this.feedBackDiv).hide();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory["dragndrop"] = function (opts) {
    if (opts.timed) {
        return new TimedDragNDrop(opts);
    }
    return new _dragndrop_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 23332:
/*!*********************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragNDrop)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);
/* harmony import */ var _css_dragndrop_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/dragndrop.less */ 76512);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dragndrop-i18n.en.js */ 32552);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dragndrop-i18n.pt-br.js */ 81264);
/* harmony import */ var _dragndrop_i18n_sr_Cyrl_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dragndrop-i18n.sr-Cyrl.js */ 2053);
/*==========================================
=======     Master dragndrop.js     ========
============================================
===     This file contains the JS for    ===
=== the Runestone Drag n drop component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/6/15                ===
===              Brad MIller             ===
===                2/7/19                ===
===               12/30/24               ===
==========================================*/

/*
 * Some terminology:
 * - draggable: the element that is being dragged
 * - dropzone: the element that is being dropped on
 * - premise: the element that is being dragged
 * - response: the element that is being dropped on
 * - category: each premis and response have a category.  Several premises can have the same category
 * and be dropped onto the same response.  If a premise has no response its category will not be in
 * the list of categories.
 *
 * Key variables:
 * - dragArray: an array of draggable elements
 * - dropArray: an array of dropzone elements
 * - categories: an array of all categories
 */








//import "./DragDropTouch.js";

// The student must have at least this many gradeable tries before misplaced
// blocks are colored red.
const MIN_TRIES_FOR_COLOR = 3;

class DragNDrop extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <ul> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.random = true;
        //check if the original element has a data-random attribute set to the value "no"
        if (this.origElem.dataset.random === "no") {
            this.random = false;
        }
        this.feedback = "";
        this.question = "";
        // Number of times the student has submitted a gradeable attempt (one
        // where they have placed enough blocks). Misplaced blocks are only
        // colored red once this reaches MIN_TRIES_FOR_COLOR.
        this.tries = 0;
        this.populate(); // Populates this.responseArray, this.premiseArray, this.feedback and this.question
        this.createNewElements();
        this.caption = "Drag-N-Drop";
        this.addCaption("runestone");
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }

    /*======================
    === Update variables ===
    ======================*/
    populate() {
        this.responseArray = [];
        this.premiseArray = [];
        let invisibleErrorDiv = document.createElement("div");
        invisibleErrorDiv.classList.add("ptx-runestone-container");
        document.body.appendChild(invisibleErrorDiv);
        console.log("Populating DragNDrop with premises and responses");
        this.cards = this.origElem.querySelectorAll(
            "[data-subcomponent='draggable']"
        );
        for (let element of this.cards) {
            let replaceSpan = document.createElement("span");
            replaceSpan.innerHTML = element.innerHTML;
            replaceSpan.id = element.id;
            replaceSpan.setAttribute("draggable", "true");
            replaceSpan.classList.add("draggable-drag");
            replaceSpan.classList.add("premise");
            replaceSpan.tabIndex = 0;
            replaceSpan.setAttribute('role', 'button');
            replaceSpan.dataset.category = this.getCategory(element);
            replaceSpan.dataset.parent_id = this.divid;
            this.premiseArray.push(replaceSpan);
            this.setDragListeners(replaceSpan);
            // now create an error message for when the premise is dropped in the wrong place
            let errorMessage = document.createElement("div");
            errorMessage.classList.add("vh-dnd-error");
            errorMessage.innerHTML = "Incorrect drop zone for " + replaceSpan.innerHTML;
            errorMessage.setAttribute("role", "alert");
            errorMessage.id = replaceSpan.id + "_error";
            invisibleErrorDiv.appendChild(errorMessage);
        }
        if (this.random) {
            // Shuffle the premiseArray if random is true
            this.premiseArray = shuffleArray(this.premiseArray);
        }
        for (let element of this.origElem.querySelectorAll(
            "[data-subcomponent='dropzone']"
        )) {
            let replaceSpan = document.createElement("span");
            replaceSpan.innerHTML = element.innerHTML;
            replaceSpan.id = element
                .getAttribute("for")
                .replace("drag", "drop");
            replaceSpan.classList.add(
                "draggable-drop",
                "drop-label",
                "response"
            );
            replaceSpan.tabIndex = 0;
            replaceSpan.setAttribute('role', 'button');
            replaceSpan.dataset.category = this.getCategory(element);
            replaceSpan.dataset.parent_id = this.divid;
            this.responseArray.push(replaceSpan);
            this.setDropListeners(replaceSpan);
        }

        this.question = this.origElem.querySelector(
            "[data-subcomponent='question']"
        ).innerHTML;
        let feedback = this.origElem.querySelector(
            "[data-subcomponent='feedback']"
        );
        if (feedback) {
            this.feedback = feedback.innerHTML;
        }
    }

    getCategory(elem) {
        if (elem.dataset.category) {
            return elem.dataset.category;
        } else {
            // if no category then use the for attribute or the id
            // this is for backwards compatibility
            if (elem.hasAttribute("for")) {
                return elem.getAttribute("for");
            } else {
                return elem.id;
            }
        }
    }
    /*========================================
    == Create new HTML elements and replace ==
    ==      original element with them      ==
    ========================================*/
    createNewElements() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        this.containerDiv.classList.add("draggable-container");
        this.statementDiv = document.createElement("div");
        this.statementDiv.classList.add("cardsort-statement");
        this.statementDiv.classList.add("exercise-statement");
        try {
            this.statementDiv.innerHTML = this.question;
        } catch (error) {
            console.error("Error setting statementDiv innerHTML:", error);
        }
        this.containerDiv.appendChild(this.statementDiv);
        this.dragDropWrapDiv = document.createElement("div"); // Holds the draggables/dropzones, prevents feedback from bleeding in
        this.dragDropWrapDiv.style.display = "block";
        this.containerDiv.appendChild(this.dragDropWrapDiv);
        this.draggableDiv = document.createElement("div");
        this.draggableDiv.classList.add("rsdraggable", "dragzone");
        this.addDragDivListeners();
        this.dropZoneDiv = document.createElement("div");
        this.dropZoneDiv.classList.add("rsdraggable");
        this.dragDropWrapDiv.appendChild(this.draggableDiv);
        this.dragDropWrapDiv.appendChild(this.dropZoneDiv);
        this.createButtons();
        this.checkServer("dragNdrop", true);
        if (eBookConfig.practice_mode) {
            this.finishSettingUp();
        }
        self = this;
        this.ivp = this.isValidPremise.bind(this);
        self.queueMathJax(self.containerDiv);
    }

    finishSettingUp() {
        this.appendReplacementSpans();
        this.createFeedbackDiv();
        console.log("Replacing origElem with containerDiv");
        this.origElem.parentNode.replaceChild(this.containerDiv, this.origElem);
        if (!this.hasStoredDropzones) {
            this.minheight = this.draggableDiv.offsetHeight;
            // Ensure MathJax has completed before adjusting the zone widths
            this.queueMathJax(this.containerDiv).then(() => {
                this.adjustDragDropWidths();
            });
        }
        this.draggableDiv.style.minHeight = this.minheight.toString() + "px";
        if (this.dropZoneDiv.offsetHeight > this.minheight) {
            this.dragDropWrapDiv.style.minHeight =
                this.dropZoneDiv.offsetHeight.toString() + "px";
        } else {
            this.dragDropWrapDiv.style.minHeight =
                this.minheight.toString() + "px";
        }
        this.draggableDiv.style.width = `${this.dragwidth}%`;
        this.dropZoneDiv.style.width = `${this.dropwidth}%`;
    }
    addDragDivListeners() {
        let self = this;
        this.draggableDiv.addEventListener(
            "dragover",
            function (ev) {
                ev.preventDefault();
                if (this.draggableDiv.classList.contains("possibleDrop")) {
                    return;
                }
                this.draggableDiv.classList.add("possibleDrop");
            }.bind(this)
        );
        this.draggableDiv.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if (this.draggableDiv.classList.contains("possibleDrop")) {
                    this.draggableDiv.classList.remove("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    !this.draggableDiv.contains(draggedSpan) &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents erros w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                    this.adjustDragDropWidths();
                    this.minheight = this.draggableDiv.offsetHeight;
                    this.dragDropWrapDiv.style.minHeight =
                        this.minheight.toString() + "px";
                    this.logBookEvent({
                        event: "dragNdrop-drop",
                        div_id: this.divid,
                        act: `${data} -> dragzone`,
                    });
                }
            }.bind(this)
        );
        this.draggableDiv.addEventListener(
            "dragleave",
            function (e) {
                if (!this.draggableDiv.classList.contains("possibleDrop")) {
                    return;
                }
                this.draggableDiv.classList.remove("possibleDrop");
            }.bind(this)
        );
    }
    createButtons() {
        this.buttonDiv = document.createElement("div");
        this.buttonDiv.classList.add("dnd-button-container");
        this.submitButton = document.createElement("button"); // Check me button
        this.submitButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_check_me");
        this.submitButton.setAttribute("class", "btn btn-success drag-button");
        this.submitButton.setAttribute("name", "do answer");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            // Only count this as a try once the student has placed enough
            // blocks to be graded.
            if (this.enoughPlaced) {
                this.tries++;
            }
            this.renderFeedback();
            this.logCurrentAnswer();
        }.bind(this);
        this.resetButton = document.createElement("button"); // Check me button
        this.resetButton.textContent = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_reset");
        this.resetButton.setAttribute(
            "class",
            "btn btn-default drag-button drag-reset"
        );
        this.resetButton.setAttribute("name", "do answer");
        this.resetButton.onclick = function () {
            this.resetDraggables();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);
        this.buttonDiv.appendChild(this.resetButton);
        this.containerDiv.appendChild(this.buttonDiv);
    }
    appendReplacementSpans() {
        if (
            this.answerState === undefined ||
            Object.keys(this.answerState).length === 0
        ) {
            this.answerState = {};
            for (let element of this.premiseArray) {
                this.draggableDiv.appendChild(element);
            }
            for (let element of this.responseArray) {
                this.dropZoneDiv.appendChild(element);
            }
        } else {
            let placedPremises = [];
            for (let response of this.responseArray) {
                this.dropZoneDiv.appendChild(response);
                if (this.answerState[response.id]) {
                    for (let premise of this.answerState[response.id]) {
                        placedPremises.push(premise);
                        let foundPremise = this.findPremise(premise);
                        if (foundPremise) {
                            response.appendChild(foundPremise);
                        } else {
                            console.warn(
                                `Premise with ID ${premise} not found in premiseArray`
                            );
                        }
                    }
                }
            }
            for (let premise of this.premiseArray) {
                if (placedPremises.indexOf(premise.id) == -1) {
                    this.draggableDiv.appendChild(premise);
                }
            }
        }
    }

    findPremise(id) {
        for (let premise of this.premiseArray) {
            if (premise.id == id) {
                return premise;
            }
        }
    }

    countSavedPremises() {
        // Count how many premises are saved in the answerState
        let count = 0;
        let names = {};
        for (let response of this.answerState) {
            if (response.length > 0) {
                for (let premise of response) {
                    if (!names[premise]) {
                        count++;
                        names[premise] = true;
                    }
                }
            }
        }
        return count;
    }

    setDragListeners(dgSpan) {
        let self = this;
        dgSpan.addEventListener("dragstart", function (ev) {
            ev.dataTransfer.setData("draggableID", ev.target.id);
        });
        dgSpan.addEventListener("dragover", function (ev) {
            ev.preventDefault();
        });
        dgSpan.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    draggedSpan != ev.target &&
                    !this.strangerDanger(draggedSpan)
                ) {
                    // Make sure element isn't already there--prevents errors w/appending child
                    this.draggableDiv.appendChild(draggedSpan);
                }
            }.bind(this)
        );

        // Add keyboard navigation for selecting premises
        dgSpan.addEventListener("keydown", function (ev) {
            if (ev.key === "Enter" || ev.key === " ") {
                ev.preventDefault();
                if (!self.selectedPremise) {
                    self.selectedPremise = dgSpan;
                    dgSpan.classList.add("selected");
                } else {
                    self.selectedPremise.classList.remove("selected");
                    self.selectedPremise = null;
                }
            }
        });
    }

    setDropListeners(dpSpan) {
        dpSpan.addEventListener(
            "dragover",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if (ev.target.classList.contains("possibleDrop")) {
                    return;
                }
                if (ev.target.classList.contains("draggable-drop")) {
                    ev.target.classList.add("possibleDrop");
                }
            }.bind(this)
        );
        dpSpan.addEventListener("dragleave", function (ev) {
            self.isAnswered = true;
            ev.preventDefault();
            if (!ev.target.classList.contains("possibleDrop")) {
                return;
            }
            ev.target.classList.remove("possibleDrop");
        });
        dpSpan.addEventListener(
            "drop",
            function (ev) {
                self.isAnswered = true;
                ev.preventDefault();
                if (ev.target.classList.contains("possibleDrop")) {
                    ev.target.classList.remove("possibleDrop");
                }
                var data = ev.dataTransfer.getData("draggableID");
                var draggedSpan = document.getElementById(data);
                if (
                    ev.target.classList.contains("draggable-drop") &&
                    !this.strangerDanger(draggedSpan) &&
                    !this.premiseArray.includes(ev.target) // don't drop on another premise!
                ) {
                    // Make sure element isn't already there--prevents errors w/appending child
                    ev.target.appendChild(draggedSpan);
                    // log a drop event
                    this.logBookEvent({
                        event: "dragNdrop-drop",
                        div_id: this.divid,
                        act: `${data} -> ${ev.target.id}`,
                    });
                }
                this.queueMathJax(this.containerDiv).then(() => {
                    this.adjustDragDropWidths();
                });
            }.bind(this)
        );

        // Add keyboard navigation for dropping premises
        dpSpan.addEventListener("keydown", function (ev) {
            if ((ev.key === "Enter" || ev.key === " ") && self.selectedPremise) {
                ev.preventDefault();
                if (
                    !self.strangerDanger(self.selectedPremise) &&
                    !self.premiseArray.includes(dpSpan) // don't drop on another premise!
                ) {
                    dpSpan.appendChild(self.selectedPremise);
                    self.selectedPremise.classList.remove("selected");
                    self.selectedPremise = null;
                    self.queueMathJax(self.containerDiv).then(() => {
                        self.adjustDragDropWidths();
                    });
                }
            }
        });
    }

    adjustDragDropWidths() {
        // Temporarily minimize the dragzone width to the content
        this.draggableDiv.style.width = "fit-content";

        const dragzoneWidth = this.draggableDiv.offsetWidth;
        const totalWidth = this.dragDropWrapDiv.offsetWidth;

        let dragzonePercent = Math.ceil((dragzoneWidth / totalWidth) * 100);
        dragzonePercent = Math.max(28, Math.min(dragzonePercent, 48));
        const dropzonePercent = 100 - dragzonePercent - 4; // 4 accounts for zone padding

        this.dragwidth = dragzonePercent;
        this.dropwidth = dropzonePercent;

        this.draggableDiv.style.width = `${dragzonePercent}%`;
        this.dropZoneDiv.style.width = `${dropzonePercent}%`;
    }

    createFeedbackDiv() {
        if (!this.feedBackDiv) {
            this.feedBackDiv = document.createElement("div");
            this.feedBackDiv.id = this.divid + "_feedback";
            this.feedBackDiv.classList.add("exercise-content");
            this.feedBackDiv.setAttribute("aria-live", "polite");
            this.feedBackDiv.setAttribute("role", "status");
            this.containerDiv.appendChild(this.feedBackDiv);
        }
    }
    /*=======================
    == Auxiliary functions ==
    =======================*/
    /* leaving the name as is, because it reminds me of Isaiah! */
    strangerDanger(testSpan) {
        // Returns true if the test span doesn't belong to this instance of DragNDrop
        if (testSpan.dataset.parent_id != this.divid) {
            return true;
        } else {
            return false;
        }
    }
    /*==============================
    == Reset button functionality ==
    ==============================*/
    resetDraggables() {
        this.dropZoneDiv.innerHTML = "";
        for (let response of this.responseArray) {
            response.classList.remove("drop-incorrect");
            this.dropZoneDiv.appendChild(response);
        }
        this.draggableDiv.innerHTML = "";
        // Shuffle the premiseArray if random is true
        if (this.random) {
            this.premiseArray = shuffleArray(this.premiseArray);
        }
        for (let premise of this.premiseArray) {
            // Clear any incorrect highlighting left over from a previous check
            premise.classList.remove("drop-incorrect");
            premise.setAttribute("aria-invalid", "false");
            premise.removeAttribute("aria-errormessage");
            this.draggableDiv.appendChild(premise);
        }
        this.answerState = {};
        // Start the "3 tries before red" cycle over after a reset
        this.tries = 0;
        this.feedBackDiv.style.display = "none";
        this.adjustDragDropWidths();
        this.minheight = this.draggableDiv.offsetHeight;
        this.dragDropWrapDiv.style.minHeight =
            this.minheight.toString() + "px";
        this.feedBackDiv.style.visibility = "hidden";
        this.logBookEvent({
            event: "dragNdrop-reset",
            div_id: this.divid,
            act: "reset",
        });
        this.setLocalStorage({ correct: "F" });
    }
    /*===========================
    == Evaluation and feedback ==
    ===========================*/
    getAllCategories() {
        this.categories = [];
        for (let response of this.dropZoneDiv.childNodes) {
            this.categories.push(response.dataset.category);
        }
        return this.categories;
    }

    checkCurrentAnswer() {
        let categories = this.getAllCategories();
        this.correct = true;
        this.unansweredNum = 0;
        this.incorrectNum = 0;
        this.correctNum = 0;
        this.placedNum = 0;
        this.dragNum = this.premiseArray.length;
        // Distractors are premises whose category does not match any dropzone,
        // i.e. blocks that are not meant to be placed.
        let distractorNum = 0;

        for (let response of this.dropZoneDiv.childNodes) {
            // ignore drop zone children that aren't premises
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp
            )) {
                this.placedNum++;
                if (premise.dataset.category == response.dataset.category) {
                    this.correctNum++;
                } else {
                    this.incorrectNum++;
                }
            }
        }
        for (let premise of this.premiseArray) {
            if (categories.indexOf(premise.dataset.category) == -1) {
                distractorNum++;
            }
        }
        for (let premise of Array.from(this.draggableDiv.childNodes).filter(
            (node) => node.nodeType !== Node.TEXT_NODE
        )) {
            if (categories.indexOf(premise.dataset.category) == -1) {
                this.correctNum++;
            } else {
                this.unansweredNum++;
            }
        }
        // The student must attempt to place every block that belongs in a
        // dropzone (total premises minus the distractors) before we give any
        // correctness feedback.
        this.requiredPlacements = this.premiseArray.length - distractorNum;
        this.enoughPlaced = this.placedNum >= this.requiredPlacements;
        this.percent = this.correctNum / this.premiseArray.length;
        console.log(this.percent, this.incorrectNum, this.unansweredNum);
        if (this.percent < 1.0) {
            this.correct = false;
        }
        this.setLocalStorage({ correct: this.correct ? "T" : "F" });
    }

    isCorrectDrop(response) {
        // Returns true if all premises in the response are in the correct category
        // and all premises in the category are in the response
        // used by renderFeedback
        let correct = true;
        let correctPlacements = 0;
        for (let premise of Array.from(response.childNodes).filter(this.ivp)) {
            if (premise.dataset.category != response.dataset.category) {
                correct = false;
            } else {
                correctPlacements++;
            }
        }
        let catCount = 0;
        for (let premis of this.premiseArray) {
            if (premis.dataset.category == response.dataset.category) {
                catCount++;
            }
        }
        return correct && correctPlacements == catCount;
    }

    isValidPremise(premise) {
        if (this.premiseArray.includes(premise)) {
            return true;
        } else {
            return false;
        }
    }

    async logCurrentAnswer(sid) {
        let answer = JSON.stringify(this.answerState);
        let data = {
            event: "dragNdrop",
            act: answer,
            answer: answer,
            min_height: Math.round(this.minheight),
            drag_width: this.dragwidth,
            drop_width: this.dropwidth,
            div_id: this.divid,
            correct: this.correct,
            correctNum: this.correctNum,
            dragNum: this.dragNum,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }
    clearIncorrectHighlights() {
        // Remove the red "drop-incorrect" highlighting and related a11y
        // attributes from every placed premise.
        for (let response of this.dropZoneDiv.childNodes) {
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp
            )) {
                premise.classList.remove("drop-incorrect");
                premise.setAttribute("aria-invalid", "false");
                premise.removeAttribute("aria-errormessage");
            }
        }
    }
    renderFeedback() {
        if (!this.feedBackDiv) {
            this.createFeedbackDiv();
        }
        // The reset button hides the feedback area with display:none, so make
        // sure it is shown again whenever we render feedback.
        this.feedBackDiv.style.display = "";
        this.feedBackDiv.style.visibility = "visible";

        // Requirement 1: don't give any correctness feedback until the student
        // has attempted to place all the blocks that belong in a dropzone.
        if (!this.enoughPlaced) {
            this.clearIncorrectHighlights();
            let remaining = this.requiredPlacements - this.placedNum;
            var msgPlaceMore = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_place_more", remaining);
            setTimeout(() => {
                this.feedBackDiv.innerHTML = `<div class="para">${msgPlaceMore}</div>`;
            }, 10);
            this.feedBackDiv.className =
                "alert alert-warning draggable-feedback exercise-content";
            this.queueMathJax(this.feedBackDiv);
            return;
        }

        // Requirement 2: only color the misplaced blocks red once the student
        // has had at least MIN_TRIES_FOR_COLOR gradeable tries.
        let showColors = this.tries >= MIN_TRIES_FOR_COLOR;
        for (let response of this.dropZoneDiv.childNodes) {
            // iterate over all the premises in the response
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp
            )) {
                // if the premise is not in the correct category, add the class
                if (
                    showColors &&
                    premise.dataset.category != response.dataset.category
                ) {
                    premise.classList.add("drop-incorrect");
                    premise.setAttribute("aria-invalid", "true");
                    premise.setAttribute(
                        "aria-errormessage",
                        premise.id + "_error"
                    );
                    document.getElementById(
                        premise.id + "_error"
                    ).classList.remove("vh-dnd-error");
                } else {
                    premise.classList.remove("drop-incorrect");
                    premise.setAttribute("aria-invalid", "false");
                    premise.removeAttribute("aria-errormessage");
                }
            }
        }
        if (this.correct) {
            var msgCorrect = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)("msg_dragndrop_correct_answer");
            setTimeout(() => {
                this.feedBackDiv.innerHTML = msgCorrect;
            }, 10);
            this.feedBackDiv.className = "alert alert-info draggable-feedback exercise-content";

        } else {
            var msgIncorrect = (0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_1__.t)(
                "msg_dragndrop_incorrect_answer",
                this.correctNum,
                this.incorrectNum,
                this.dragNum,
                this.unansweredNum
            );
            // this.feedback comes from the author (a hint maybe)
            setTimeout(() => {
                this.feedBackDiv.innerHTML = `<div class="para">${msgIncorrect}</div> ${this.feedback}`;
            }, 10);
            this.feedBackDiv.className =
                "alert alert-danger draggable-feedback exercise-content";
        }
        this.queueMathJax(this.feedBackDiv);
    }
    /*===================================
    === Checking/restoring from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        this.hasStoredDropzones = true;
        this.minheight = data.min_height;
        this.dragwidth = data.drag_width;
        this.dropwidth = data.drop_width;
        this.answerState = JSON.parse(data.answer);
        this.correct = data.correct;
        this.finishSettingUp();
    }

    checkLocalStorage() {
        if (this.graderactive) {
            this.finishSettingUp();
            return;
        }
        var storedObj;
        this.hasStoredDropzones = false;
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                this.hasStoredDropzones = true;
                let error = false;
                try {
                    storedObj = JSON.parse(ex);
                    this.minheight = storedObj.min_height;
                    this.dragwidth = storedObj.drag_width;
                    this.dropwidth = storedObj.drop_width;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(`Error parsing stored DragNDrop data for ${this.divid}: ${err}`);
                    error = true;
                }
                if (error || storedObj.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    this.hasStoredDropzones = false;
                    this.finishSettingUp();
                    return;
                }
                localStorage.removeItem(this.localStorageKey());
                this.answerState = storedObj.answer;
                if (this.useRunestoneServices) {
                    // store answer in database
                    let answer = JSON.stringify(this.answerState);
                    this.logBookEvent({
                        event: "dragNdrop",
                        act: answer,
                        answer: answer,
                        min_height: Math.round(this.minheight),
                        drag_width: this.dragwidth,
                        drop_width: this.dropwidth,
                        div_id: this.divid,
                        correct: storedObj.correct,
                    });
                }
            }
        }
        this.finishSettingUp();
    }

    setLocalStorage(data) {
        if (data.answer === undefined) {
            // If we didn't load from the server, we must generate the data
            this.answerState = {};
            for (let response of this.dropZoneDiv.childNodes) {
                this.answerState[response.id] = [];
                for (let premise of response.childNodes) {
                    if (
                        premise.nodeType !== Node.TEXT_NODE &&
                        this.premiseArray.includes(premise)
                    ) {
                        this.answerState[response.id].push(premise.id);
                    }
                }
            }
        }
        var timeStamp = new Date();
        var correct = data.correct;
        var storageObj = {
            answer: this.answerState,
            min_height: this.minheight,
            timestamp: timeStamp,
            correct: correct,
            drag_width: this.dragwidth,
            drop_width: this.dropwidth,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }

    disableInteraction() {
        this.resetButton.style.display = "none";
        for (var i = 0; i < this.premiseArray.length; i++) {
            // No more dragging
            this.premiseArray[i].draggable = false;
            this.premiseArray[i].style.cursor = "initial";
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    const elements = document.querySelectorAll("[data-component=dragndrop]");
    elements.forEach((element) => {
        const opts = {
            orig: element,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if (!element.closest("[data-component=timedAssessment]")) {
            // If this element exists within a timed component, don't render it here
            try {
                window.componentMap[element.id] = new DragNDrop(opts);
            } catch (err) {
                console.log(
                    `Error rendering DragNDrop Problem ${element.id}: ${err}`
                );
            }
        }
    });
});


/***/ }),

/***/ 32552:
/*!*****************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.en.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    en: {
        msg_dragndrop_correct_answer: "You are correct!",
        msg_dragndrop_incorrect_answer:
            "Incorrect. Of the cards you have sorted you placed $1 correctly and $2 incorrectly. You have $4 left to place.",
        msg_dragndrop_place_more:
            "Please place all of the cards before checking your answer. You have $1 left to place.",
        msg_dragndrop_check_me: "Check me",
        msg_dragndrop_reset: "Reset",
    },
});


/***/ }),

/***/ 76512:
/*!************************************************!*\
  !*** ./runestone/dragndrop/css/dragndrop.less ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 81264:
/*!********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.pt-br.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/rsi18n.js */ 54250);


(0,_common_js_rsi18n_js__WEBPACK_IMPORTED_MODULE_0__.load)({
    "pt-br": {
        msg_dragndrop_correct_answer: "Correto!",
        msg_dragndrop_incorrect_answer:
            "Incorreto. Você teve $1 correto(s) e $2 incorreto(s) de $3. Você deixou $4 em branco.",
        msg_dragndrop_place_more:
            "Por favor, posicione todos os cartões antes de verificar sua resposta. Você ainda tem $1 para posicionar.",
        msg_dragndrop_check_me: "Verificar",
        msg_dragndrop_reset: "Resetar",
    },
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RyYWduZHJvcF9qc190aW1lZGRuZF9qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFpRDs7QUFFakQsMERBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaWTs7QUFFMEI7O0FBRXhCLDZCQUE2QixxREFBUztBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscURBQVM7QUFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFDZjtBQUNmO0FBQ0M7QUFDRztBQUNFO0FBQ3JDOztBQUVBO0FBQ0E7QUFDQTs7QUFFZSx3QkFBd0IsbUVBQWE7QUFDcEQ7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsZUFBZTtBQUMxRCwwQ0FBMEMsZUFBZTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN0M0JnRDs7QUFFakQsMERBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7OztBQ1pEOzs7Ozs7Ozs7Ozs7O0FDQWlEOztBQUVqRCwwREFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL2RyYWduZHJvcC1pMThuLnNyLUN5cmwuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvdGltZWRkbmQuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL2RyYWduZHJvcC1pMThuLmVuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2Nzcy9kcmFnbmRyb3AubGVzcz9iODVjIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL2RyYWduZHJvcC1pMThuLnB0LWJyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBcInNyLUN5cmxcIjoge1xuICAgICAgICBtc2dfZHJhZ25kcm9wX2NvcnJlY3RfYW5zd2VyOiBcItCi0LDRh9Cw0L0g0L7QtNCz0L7QstC+0YAhXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlcjpcbiAgICAgICAgICAgIFwi0J3QtdGC0LDRh9C90L4uINCU0L7QsdC40LvQuCDRgdGC0LUgJDEg0YLQsNGH0L3QuNGFINC4ICQyINC90LXRgtCw0YfQvdC40YUg0L7QtCAkMy4g0J7RgdGC0LDQu9C+INCy0LDQvCDRmNC1ICQ0INC/0YDQsNC30L3QuNC90LAuXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcGxhY2VfbW9yZTpcbiAgICAgICAgICAgIFwi0JzQvtC70LjQvNC+INCy0LDRgSDQtNCwINC/0L7RgdGC0LDQstC40YLQtSDRgdCy0LUg0LrQsNGA0YLQuNGG0LUg0L/RgNC1INC/0YDQvtCy0LXRgNC1INC+0LTQs9C+0LLQvtGA0LAuINCe0YHRgtCw0LvQviDQstCw0Lwg0ZjQtSDRmNC+0YggJDEg0LfQsCDQv9C+0YHRgtCw0LLRmdCw0ZrQtS5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jaGVja19tZTogXCLQn9GA0L7QstC10YDQuFwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX3Jlc2V0OiBcItCf0L7QvdC40YjRgtC4XCIsXG4gICAgfSxcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBEcmFnTkRyb3AgZnJvbSBcIi4vZHJhZ25kcm9wLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRHJhZ05Ecm9wIGV4dGVuZHMgRHJhZ05Ecm9wIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdC4gICAgVXNlZCBmb3IgdGltZWQgYXNzZXNzbWVudCBncmFkaW5nLlxuICAgICAgICBpZiAodGhpcy51bmFuc3dlcmVkTnVtID09PSB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5oaWRlKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wiZHJhZ25kcm9wXCJdID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRHJhZ05Ecm9wKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERyYWdORHJvcChvcHRzKTtcbn07XG4iLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgTWFzdGVyIGRyYWduZHJvcC5qcyAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09IHRoZSBSdW5lc3RvbmUgRHJhZyBuIGRyb3AgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA3LzYvMTUgICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgIEJyYWQgTUlsbGVyICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDIvNy8xOSAgICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDEyLzMwLzI0ICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKlxuICogU29tZSB0ZXJtaW5vbG9neTpcbiAqIC0gZHJhZ2dhYmxlOiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGRyYWdnZWRcbiAqIC0gZHJvcHpvbmU6IHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgZHJvcHBlZCBvblxuICogLSBwcmVtaXNlOiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGRyYWdnZWRcbiAqIC0gcmVzcG9uc2U6IHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgZHJvcHBlZCBvblxuICogLSBjYXRlZ29yeTogZWFjaCBwcmVtaXMgYW5kIHJlc3BvbnNlIGhhdmUgYSBjYXRlZ29yeS4gIFNldmVyYWwgcHJlbWlzZXMgY2FuIGhhdmUgdGhlIHNhbWUgY2F0ZWdvcnlcbiAqIGFuZCBiZSBkcm9wcGVkIG9udG8gdGhlIHNhbWUgcmVzcG9uc2UuICBJZiBhIHByZW1pc2UgaGFzIG5vIHJlc3BvbnNlIGl0cyBjYXRlZ29yeSB3aWxsIG5vdCBiZSBpblxuICogdGhlIGxpc3Qgb2YgY2F0ZWdvcmllcy5cbiAqXG4gKiBLZXkgdmFyaWFibGVzOlxuICogLSBkcmFnQXJyYXk6IGFuIGFycmF5IG9mIGRyYWdnYWJsZSBlbGVtZW50c1xuICogLSBkcm9wQXJyYXk6IGFuIGFycmF5IG9mIGRyb3B6b25lIGVsZW1lbnRzXG4gKiAtIGNhdGVnb3JpZXM6IGFuIGFycmF5IG9mIGFsbCBjYXRlZ29yaWVzXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCB7IHQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuaW1wb3J0IFwiLi4vY3NzL2RyYWduZHJvcC5sZXNzXCI7XG5pbXBvcnQgXCIuL2RyYWduZHJvcC1pMThuLmVuLmpzXCI7XG5pbXBvcnQgXCIuL2RyYWduZHJvcC1pMThuLnB0LWJyLmpzXCI7XG5pbXBvcnQgXCIuL2RyYWduZHJvcC1pMThuLnNyLUN5cmwuanNcIjtcbi8vaW1wb3J0IFwiLi9EcmFnRHJvcFRvdWNoLmpzXCI7XG5cbi8vIFRoZSBzdHVkZW50IG11c3QgaGF2ZSBhdCBsZWFzdCB0aGlzIG1hbnkgZ3JhZGVhYmxlIHRyaWVzIGJlZm9yZSBtaXNwbGFjZWRcbi8vIGJsb2NrcyBhcmUgY29sb3JlZCByZWQuXG5jb25zdCBNSU5fVFJJRVNfRk9SX0NPTE9SID0gMztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhZ05Ecm9wIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8dWw+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IG9wdHMudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIHRoaXMucmFuZG9tID0gdHJ1ZTtcbiAgICAgICAgLy9jaGVjayBpZiB0aGUgb3JpZ2luYWwgZWxlbWVudCBoYXMgYSBkYXRhLXJhbmRvbSBhdHRyaWJ1dGUgc2V0IHRvIHRoZSB2YWx1ZSBcIm5vXCJcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uZGF0YXNldC5yYW5kb20gPT09IFwibm9cIikge1xuICAgICAgICAgICAgdGhpcy5yYW5kb20gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRiYWNrID0gXCJcIjtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFwiXCI7XG4gICAgICAgIC8vIE51bWJlciBvZiB0aW1lcyB0aGUgc3R1ZGVudCBoYXMgc3VibWl0dGVkIGEgZ3JhZGVhYmxlIGF0dGVtcHQgKG9uZVxuICAgICAgICAvLyB3aGVyZSB0aGV5IGhhdmUgcGxhY2VkIGVub3VnaCBibG9ja3MpLiBNaXNwbGFjZWQgYmxvY2tzIGFyZSBvbmx5XG4gICAgICAgIC8vIGNvbG9yZWQgcmVkIG9uY2UgdGhpcyByZWFjaGVzIE1JTl9UUklFU19GT1JfQ09MT1IuXG4gICAgICAgIHRoaXMudHJpZXMgPSAwO1xuICAgICAgICB0aGlzLnBvcHVsYXRlKCk7IC8vIFBvcHVsYXRlcyB0aGlzLnJlc3BvbnNlQXJyYXksIHRoaXMucHJlbWlzZUFycmF5LCB0aGlzLmZlZWRiYWNrIGFuZCB0aGlzLnF1ZXN0aW9uXG4gICAgICAgIHRoaXMuY3JlYXRlTmV3RWxlbWVudHMoKTtcbiAgICAgICAgdGhpcy5jYXB0aW9uID0gXCJEcmFnLU4tRHJvcFwiO1xuICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgIGlmICh0eXBlb2YgUHJpc20gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIFByaXNtLmhpZ2hsaWdodEFsbFVuZGVyKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBVcGRhdGUgdmFyaWFibGVzID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHBvcHVsYXRlKCkge1xuICAgICAgICB0aGlzLnJlc3BvbnNlQXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IGludmlzaWJsZUVycm9yRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgaW52aXNpYmxlRXJyb3JEaXYuY2xhc3NMaXN0LmFkZChcInB0eC1ydW5lc3RvbmUtY29udGFpbmVyXCIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGludmlzaWJsZUVycm9yRGl2KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJQb3B1bGF0aW5nIERyYWdORHJvcCB3aXRoIHByZW1pc2VzIGFuZCByZXNwb25zZXNcIik7XG4gICAgICAgIHRoaXMuY2FyZHMgPSB0aGlzLm9yaWdFbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICBcIltkYXRhLXN1YmNvbXBvbmVudD0nZHJhZ2dhYmxlJ11cIlxuICAgICAgICApO1xuICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMuY2FyZHMpIHtcbiAgICAgICAgICAgIGxldCByZXBsYWNlU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lckhUTUw7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5pZCA9IGVsZW1lbnQuaWQ7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5zZXRBdHRyaWJ1dGUoXCJkcmFnZ2FibGVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uY2xhc3NMaXN0LmFkZChcImRyYWdnYWJsZS1kcmFnXCIpO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uY2xhc3NMaXN0LmFkZChcInByZW1pc2VcIik7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi50YWJJbmRleCA9IDA7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5kYXRhc2V0LmNhdGVnb3J5ID0gdGhpcy5nZXRDYXRlZ29yeShlbGVtZW50KTtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLmRhdGFzZXQucGFyZW50X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgICAgIHRoaXMucHJlbWlzZUFycmF5LnB1c2gocmVwbGFjZVNwYW4pO1xuICAgICAgICAgICAgdGhpcy5zZXREcmFnTGlzdGVuZXJzKHJlcGxhY2VTcGFuKTtcbiAgICAgICAgICAgIC8vIG5vdyBjcmVhdGUgYW4gZXJyb3IgbWVzc2FnZSBmb3Igd2hlbiB0aGUgcHJlbWlzZSBpcyBkcm9wcGVkIGluIHRoZSB3cm9uZyBwbGFjZVxuICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2UuY2xhc3NMaXN0LmFkZChcInZoLWRuZC1lcnJvclwiKTtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZS5pbm5lckhUTUwgPSBcIkluY29ycmVjdCBkcm9wIHpvbmUgZm9yIFwiICsgcmVwbGFjZVNwYW4uaW5uZXJIVE1MO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLnNldEF0dHJpYnV0ZShcInJvbGVcIiwgXCJhbGVydFwiKTtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZS5pZCA9IHJlcGxhY2VTcGFuLmlkICsgXCJfZXJyb3JcIjtcbiAgICAgICAgICAgIGludmlzaWJsZUVycm9yRGl2LmFwcGVuZENoaWxkKGVycm9yTWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XG4gICAgICAgICAgICAvLyBTaHVmZmxlIHRoZSBwcmVtaXNlQXJyYXkgaWYgcmFuZG9tIGlzIHRydWVcbiAgICAgICAgICAgIHRoaXMucHJlbWlzZUFycmF5ID0gc2h1ZmZsZUFycmF5KHRoaXMucHJlbWlzZUFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBlbGVtZW50IG9mIHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIFwiW2RhdGEtc3ViY29tcG9uZW50PSdkcm9wem9uZSddXCJcbiAgICAgICAgKSkge1xuICAgICAgICAgICAgbGV0IHJlcGxhY2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLmlkID0gZWxlbWVudFxuICAgICAgICAgICAgICAgIC5nZXRBdHRyaWJ1dGUoXCJmb3JcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcImRyYWdcIiwgXCJkcm9wXCIpO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uY2xhc3NMaXN0LmFkZChcbiAgICAgICAgICAgICAgICBcImRyYWdnYWJsZS1kcm9wXCIsXG4gICAgICAgICAgICAgICAgXCJkcm9wLWxhYmVsXCIsXG4gICAgICAgICAgICAgICAgXCJyZXNwb25zZVwiXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4udGFiSW5kZXggPSAwO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uZGF0YXNldC5jYXRlZ29yeSA9IHRoaXMuZ2V0Q2F0ZWdvcnkoZWxlbWVudCk7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5kYXRhc2V0LnBhcmVudF9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICB0aGlzLnJlc3BvbnNlQXJyYXkucHVzaChyZXBsYWNlU3Bhbik7XG4gICAgICAgICAgICB0aGlzLnNldERyb3BMaXN0ZW5lcnMocmVwbGFjZVNwYW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiW2RhdGEtc3ViY29tcG9uZW50PSdxdWVzdGlvbiddXCJcbiAgICAgICAgKS5pbm5lckhUTUw7XG4gICAgICAgIGxldCBmZWVkYmFjayA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIFwiW2RhdGEtc3ViY29tcG9uZW50PSdmZWVkYmFjayddXCJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGZlZWRiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrID0gZmVlZGJhY2suaW5uZXJIVE1MO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0Q2F0ZWdvcnkoZWxlbSkge1xuICAgICAgICBpZiAoZWxlbS5kYXRhc2V0LmNhdGVnb3J5KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbS5kYXRhc2V0LmNhdGVnb3J5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgbm8gY2F0ZWdvcnkgdGhlbiB1c2UgdGhlIGZvciBhdHRyaWJ1dGUgb3IgdGhlIGlkXG4gICAgICAgICAgICAvLyB0aGlzIGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICAgICAgICAgICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKFwiZm9yXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW0uZ2V0QXR0cmlidXRlKFwiZm9yXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbS5pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBDcmVhdGUgbmV3IEhUTUwgZWxlbWVudHMgYW5kIHJlcGxhY2UgPT1cbiAgICA9PSAgICAgIG9yaWdpbmFsIGVsZW1lbnQgd2l0aCB0aGVtICAgICAgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVOZXdFbGVtZW50cygpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJkcmFnZ2FibGUtY29udGFpbmVyXCIpO1xuICAgICAgICB0aGlzLnN0YXRlbWVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc3RhdGVtZW50RGl2LmNsYXNzTGlzdC5hZGQoXCJjYXJkc29ydC1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRoaXMuc3RhdGVtZW50RGl2LmNsYXNzTGlzdC5hZGQoXCJleGVyY2lzZS1zdGF0ZW1lbnRcIik7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlbWVudERpdi5pbm5lckhUTUwgPSB0aGlzLnF1ZXN0aW9uO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNldHRpbmcgc3RhdGVtZW50RGl2IGlubmVySFRNTDpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc3RhdGVtZW50RGl2KTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpOyAvLyBIb2xkcyB0aGUgZHJhZ2dhYmxlcy9kcm9wem9uZXMsIHByZXZlbnRzIGZlZWRiYWNrIGZyb20gYmxlZWRpbmcgaW5cbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kcmFnRHJvcFdyYXBEaXYpO1xuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5hZGQoXCJyc2RyYWdnYWJsZVwiLCBcImRyYWd6b25lXCIpO1xuICAgICAgICB0aGlzLmFkZERyYWdEaXZMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5kcm9wWm9uZURpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZHJvcFpvbmVEaXYuY2xhc3NMaXN0LmFkZChcInJzZHJhZ2dhYmxlXCIpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5hcHBlbmRDaGlsZCh0aGlzLmRyYWdnYWJsZURpdik7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LmFwcGVuZENoaWxkKHRoaXMuZHJvcFpvbmVEaXYpO1xuICAgICAgICB0aGlzLmNyZWF0ZUJ1dHRvbnMoKTtcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcImRyYWdOZHJvcFwiLCB0cnVlKTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnByYWN0aWNlX21vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoU2V0dGluZ1VwKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuaXZwID0gdGhpcy5pc1ZhbGlkUHJlbWlzZS5iaW5kKHRoaXMpO1xuICAgICAgICBzZWxmLnF1ZXVlTWF0aEpheChzZWxmLmNvbnRhaW5lckRpdik7XG4gICAgfVxuXG4gICAgZmluaXNoU2V0dGluZ1VwKCkge1xuICAgICAgICB0aGlzLmFwcGVuZFJlcGxhY2VtZW50U3BhbnMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVGZWVkYmFja0RpdigpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlcGxhY2luZyBvcmlnRWxlbSB3aXRoIGNvbnRhaW5lckRpdlwiKTtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh0aGlzLmNvbnRhaW5lckRpdiwgdGhpcy5vcmlnRWxlbSk7XG4gICAgICAgIGlmICghdGhpcy5oYXNTdG9yZWREcm9wem9uZXMpIHtcbiAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0ID0gdGhpcy5kcmFnZ2FibGVEaXYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgLy8gRW5zdXJlIE1hdGhKYXggaGFzIGNvbXBsZXRlZCBiZWZvcmUgYWRqdXN0aW5nIHRoZSB6b25lIHdpZHRoc1xuICAgICAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIGlmICh0aGlzLmRyb3Bab25lRGl2Lm9mZnNldEhlaWdodCA+IHRoaXMubWluaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zdHlsZS5taW5IZWlnaHQgPVxuICAgICAgICAgICAgICAgIHRoaXMuZHJvcFpvbmVEaXYub2Zmc2V0SGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zdHlsZS5taW5IZWlnaHQgPVxuICAgICAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuc3R5bGUud2lkdGggPSBgJHt0aGlzLmRyYWd3aWR0aH0lYDtcbiAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5zdHlsZS53aWR0aCA9IGAke3RoaXMuZHJvcHdpZHRofSVgO1xuICAgIH1cbiAgICBhZGREcmFnRGl2TGlzdGVuZXJzKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyYWdvdmVyXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZURpdi5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5jbGFzc0xpc3QuYWRkKFwicG9zc2libGVEcm9wXCIpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2FibGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJkcmFnZ2FibGVJRFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhZ2dlZFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLmRyYWdnYWJsZURpdi5jb250YWlucyhkcmFnZ2VkU3BhbikgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuc3RyYW5nZXJEYW5nZXIoZHJhZ2dlZFNwYW4pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBlbGVtZW50IGlzbid0IGFscmVhZHkgdGhlcmUtLXByZXZlbnRzIGVycm9zIHcvYXBwZW5kaW5nIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKGRyYWdnZWRTcGFuKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGp1c3REcmFnRHJvcFdpZHRocygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1pbmhlaWdodCA9IHRoaXMuZHJhZ2dhYmxlRGl2Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuc3R5bGUubWluSGVpZ2h0ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0LnRvU3RyaW5nKCkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcC1kcm9wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Q6IGAke2RhdGF9IC0+IGRyYWd6b25lYCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyYWdsZWF2ZVwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICB9XG4gICAgY3JlYXRlQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5idXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdi5jbGFzc0xpc3QuYWRkKFwiZG5kLWJ1dHRvbi1jb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTsgLy8gQ2hlY2sgbWUgYnV0dG9uXG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19kcmFnbmRyb3BfY2hlY2tfbWVcIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnRuIGJ0bi1zdWNjZXNzIGRyYWctYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJuYW1lXCIsIFwiZG8gYW5zd2VyXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIC8vIE9ubHkgY291bnQgdGhpcyBhcyBhIHRyeSBvbmNlIHRoZSBzdHVkZW50IGhhcyBwbGFjZWQgZW5vdWdoXG4gICAgICAgICAgICAvLyBibG9ja3MgdG8gYmUgZ3JhZGVkLlxuICAgICAgICAgICAgaWYgKHRoaXMuZW5vdWdoUGxhY2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmllcysrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICAgICAgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7IC8vIENoZWNrIG1lIGJ1dHRvblxuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnRleHRDb250ZW50ID0gdChcIm1zZ19kcmFnbmRyb3BfcmVzZXRcIik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgXCJjbGFzc1wiLFxuICAgICAgICAgICAgXCJidG4gYnRuLWRlZmF1bHQgZHJhZy1idXR0b24gZHJhZy1yZXNldFwiXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImRvIGFuc3dlclwiKTtcbiAgICAgICAgdGhpcy5yZXNldEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5yZXNldERyYWdnYWJsZXMoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnN1Ym1pdEJ1dHRvbik7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRoaXMucmVzZXRCdXR0b24pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmJ1dHRvbkRpdik7XG4gICAgfVxuICAgIGFwcGVuZFJlcGxhY2VtZW50U3BhbnMoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5hbnN3ZXJTdGF0ZSkubGVuZ3RoID09PSAwXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5hbnN3ZXJTdGF0ZSA9IHt9O1xuICAgICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgZWxlbWVudCBvZiB0aGlzLnJlc3BvbnNlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bab25lRGl2LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHBsYWNlZFByZW1pc2VzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLnJlc3BvbnNlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3Bab25lRGl2LmFwcGVuZENoaWxkKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hbnN3ZXJTdGF0ZVtyZXNwb25zZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiB0aGlzLmFuc3dlclN0YXRlW3Jlc3BvbnNlLmlkXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2VkUHJlbWlzZXMucHVzaChwcmVtaXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmb3VuZFByZW1pc2UgPSB0aGlzLmZpbmRQcmVtaXNlKHByZW1pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kUHJlbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLmFwcGVuZENoaWxkKGZvdW5kUHJlbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFByZW1pc2Ugd2l0aCBJRCAke3ByZW1pc2V9IG5vdCBmb3VuZCBpbiBwcmVtaXNlQXJyYXlgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgdGhpcy5wcmVtaXNlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAocGxhY2VkUHJlbWlzZXMuaW5kZXhPZihwcmVtaXNlLmlkKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChwcmVtaXNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kUHJlbWlzZShpZCkge1xuICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAocHJlbWlzZS5pZCA9PSBpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVtaXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY291bnRTYXZlZFByZW1pc2VzKCkge1xuICAgICAgICAvLyBDb3VudCBob3cgbWFueSBwcmVtaXNlcyBhcmUgc2F2ZWQgaW4gdGhlIGFuc3dlclN0YXRlXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGxldCBuYW1lcyA9IHt9O1xuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmFuc3dlclN0YXRlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuYW1lc1twcmVtaXNlXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWVzW3ByZW1pc2VdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY291bnQ7XG4gICAgfVxuXG4gICAgc2V0RHJhZ0xpc3RlbmVycyhkZ1NwYW4pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGV2LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiZHJhZ2dhYmxlSURcIiwgZXYudGFyZ2V0LmlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRnU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ292ZXJcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiZHJhZ2dhYmxlSURcIik7XG4gICAgICAgICAgICAgICAgdmFyIGRyYWdnZWRTcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBkcmFnZ2VkU3BhbiAhPSBldi50YXJnZXQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuc3RyYW5nZXJEYW5nZXIoZHJhZ2dlZFNwYW4pXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBlbGVtZW50IGlzbid0IGFscmVhZHkgdGhlcmUtLXByZXZlbnRzIGVycm9ycyB3L2FwcGVuZGluZyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQWRkIGtleWJvYXJkIG5hdmlnYXRpb24gZm9yIHNlbGVjdGluZyBwcmVtaXNlc1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoZXYua2V5ID09PSBcIkVudGVyXCIgfHwgZXYua2V5ID09PSBcIiBcIikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFzZWxmLnNlbGVjdGVkUHJlbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJlbWlzZSA9IGRnU3BhbjtcbiAgICAgICAgICAgICAgICAgICAgZGdTcGFuLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJlbWlzZS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcmVtaXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldERyb3BMaXN0ZW5lcnMoZHBTcGFuKSB7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcmFnb3ZlclwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcmFnZ2FibGUtZHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQuY2xhc3NMaXN0LmFkZChcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgZHBTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmICghZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKFwicG9zc2libGVEcm9wXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZHBTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImRyb3BcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBldi5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdnYWJsZUlEXCIpO1xuICAgICAgICAgICAgICAgIHZhciBkcmFnZ2VkU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcImRyYWdnYWJsZS1kcm9wXCIpICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnN0cmFuZ2VyRGFuZ2VyKGRyYWdnZWRTcGFuKSAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5wcmVtaXNlQXJyYXkuaW5jbHVkZXMoZXYudGFyZ2V0KSAvLyBkb24ndCBkcm9wIG9uIGFub3RoZXIgcHJlbWlzZSFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGVsZW1lbnQgaXNuJ3QgYWxyZWFkeSB0aGVyZS0tcHJldmVudHMgZXJyb3JzIHcvYXBwZW5kaW5nIGNoaWxkXG4gICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC5hcHBlbmRDaGlsZChkcmFnZ2VkU3Bhbik7XG4gICAgICAgICAgICAgICAgICAgIC8vIGxvZyBhIGRyb3AgZXZlbnRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wLWRyb3BcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdDogYCR7ZGF0YX0gLT4gJHtldi50YXJnZXQuaWR9YCxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGp1c3REcmFnRHJvcFdpZHRocygpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQWRkIGtleWJvYXJkIG5hdmlnYXRpb24gZm9yIGRyb3BwaW5nIHByZW1pc2VzXG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGlmICgoZXYua2V5ID09PSBcIkVudGVyXCIgfHwgZXYua2V5ID09PSBcIiBcIikgJiYgc2VsZi5zZWxlY3RlZFByZW1pc2UpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgIXNlbGYuc3RyYW5nZXJEYW5nZXIoc2VsZi5zZWxlY3RlZFByZW1pc2UpICYmXG4gICAgICAgICAgICAgICAgICAgICFzZWxmLnByZW1pc2VBcnJheS5pbmNsdWRlcyhkcFNwYW4pIC8vIGRvbid0IGRyb3Agb24gYW5vdGhlciBwcmVtaXNlIVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBkcFNwYW4uYXBwZW5kQ2hpbGQoc2VsZi5zZWxlY3RlZFByZW1pc2UpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJlbWlzZS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRQcmVtaXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5xdWV1ZU1hdGhKYXgoc2VsZi5jb250YWluZXJEaXYpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGp1c3REcmFnRHJvcFdpZHRocygpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFkanVzdERyYWdEcm9wV2lkdGhzKCkge1xuICAgICAgICAvLyBUZW1wb3JhcmlseSBtaW5pbWl6ZSB0aGUgZHJhZ3pvbmUgd2lkdGggdG8gdGhlIGNvbnRlbnRcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuc3R5bGUud2lkdGggPSBcImZpdC1jb250ZW50XCI7XG5cbiAgICAgICAgY29uc3QgZHJhZ3pvbmVXaWR0aCA9IHRoaXMuZHJhZ2dhYmxlRGl2Lm9mZnNldFdpZHRoO1xuICAgICAgICBjb25zdCB0b3RhbFdpZHRoID0gdGhpcy5kcmFnRHJvcFdyYXBEaXYub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgbGV0IGRyYWd6b25lUGVyY2VudCA9IE1hdGguY2VpbCgoZHJhZ3pvbmVXaWR0aCAvIHRvdGFsV2lkdGgpICogMTAwKTtcbiAgICAgICAgZHJhZ3pvbmVQZXJjZW50ID0gTWF0aC5tYXgoMjgsIE1hdGgubWluKGRyYWd6b25lUGVyY2VudCwgNDgpKTtcbiAgICAgICAgY29uc3QgZHJvcHpvbmVQZXJjZW50ID0gMTAwIC0gZHJhZ3pvbmVQZXJjZW50IC0gNDsgLy8gNCBhY2NvdW50cyBmb3Igem9uZSBwYWRkaW5nXG5cbiAgICAgICAgdGhpcy5kcmFnd2lkdGggPSBkcmFnem9uZVBlcmNlbnQ7XG4gICAgICAgIHRoaXMuZHJvcHdpZHRoID0gZHJvcHpvbmVQZXJjZW50O1xuXG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LnN0eWxlLndpZHRoID0gYCR7ZHJhZ3pvbmVQZXJjZW50fSVgO1xuICAgICAgICB0aGlzLmRyb3Bab25lRGl2LnN0eWxlLndpZHRoID0gYCR7ZHJvcHpvbmVQZXJjZW50fSVgO1xuICAgIH1cblxuICAgIGNyZWF0ZUZlZWRiYWNrRGl2KCkge1xuICAgICAgICBpZiAoIXRoaXMuZmVlZEJhY2tEaXYpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mZWVkYmFja1wiO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc0xpc3QuYWRkKFwiZXhlcmNpc2UtY29udGVudFwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwiYXJpYS1saXZlXCIsIFwicG9saXRlXCIpO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwic3RhdHVzXCIpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IEF1eGlsaWFyeSBmdW5jdGlvbnMgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgLyogbGVhdmluZyB0aGUgbmFtZSBhcyBpcywgYmVjYXVzZSBpdCByZW1pbmRzIG1lIG9mIElzYWlhaCEgKi9cbiAgICBzdHJhbmdlckRhbmdlcih0ZXN0U3Bhbikge1xuICAgICAgICAvLyBSZXR1cm5zIHRydWUgaWYgdGhlIHRlc3Qgc3BhbiBkb2Vzbid0IGJlbG9uZyB0byB0aGlzIGluc3RhbmNlIG9mIERyYWdORHJvcFxuICAgICAgICBpZiAodGVzdFNwYW4uZGF0YXNldC5wYXJlbnRfaWQgIT0gdGhpcy5kaXZpZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBSZXNldCBidXR0b24gZnVuY3Rpb25hbGl0eSA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzZXREcmFnZ2FibGVzKCkge1xuICAgICAgICB0aGlzLmRyb3Bab25lRGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIGZvciAobGV0IHJlc3BvbnNlIG9mIHRoaXMucmVzcG9uc2VBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UuY2xhc3NMaXN0LnJlbW92ZShcImRyb3AtaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5hcHBlbmRDaGlsZChyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgLy8gU2h1ZmZsZSB0aGUgcHJlbWlzZUFycmF5IGlmIHJhbmRvbSBpcyB0cnVlXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbSkge1xuICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkgPSBzaHVmZmxlQXJyYXkodGhpcy5wcmVtaXNlQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgdGhpcy5wcmVtaXNlQXJyYXkpIHtcbiAgICAgICAgICAgIC8vIENsZWFyIGFueSBpbmNvcnJlY3QgaGlnaGxpZ2h0aW5nIGxlZnQgb3ZlciBmcm9tIGEgcHJldmlvdXMgY2hlY2tcbiAgICAgICAgICAgIHByZW1pc2UuY2xhc3NMaXN0LnJlbW92ZShcImRyb3AtaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgcHJlbWlzZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWludmFsaWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgIHByZW1pc2UucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1lcnJvcm1lc3NhZ2VcIik7XG4gICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChwcmVtaXNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuc3dlclN0YXRlID0ge307XG4gICAgICAgIC8vIFN0YXJ0IHRoZSBcIjMgdHJpZXMgYmVmb3JlIHJlZFwiIGN5Y2xlIG92ZXIgYWZ0ZXIgYSByZXNldFxuICAgICAgICB0aGlzLnRyaWVzID0gMDtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKTtcbiAgICAgICAgdGhpcy5taW5oZWlnaHQgPSB0aGlzLmRyYWdnYWJsZURpdi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9XG4gICAgICAgICAgICB0aGlzLm1pbmhlaWdodC50b1N0cmluZygpICsgXCJweFwiO1xuICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJkcmFnTmRyb3AtcmVzZXRcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGFjdDogXCJyZXNldFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2UoeyBjb3JyZWN0OiBcIkZcIiB9KTtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBFdmFsdWF0aW9uIGFuZCBmZWVkYmFjayA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgZ2V0QWxsQ2F0ZWdvcmllcygpIHtcbiAgICAgICAgdGhpcy5jYXRlZ29yaWVzID0gW107XG4gICAgICAgIGZvciAobGV0IHJlc3BvbnNlIG9mIHRoaXMuZHJvcFpvbmVEaXYuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgdGhpcy5jYXRlZ29yaWVzLnB1c2gocmVzcG9uc2UuZGF0YXNldC5jYXRlZ29yeSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2F0ZWdvcmllcztcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgICAgIGxldCBjYXRlZ29yaWVzID0gdGhpcy5nZXRBbGxDYXRlZ29yaWVzKCk7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIHRoaXMudW5hbnN3ZXJlZE51bSA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtID0gMDtcbiAgICAgICAgdGhpcy5jb3JyZWN0TnVtID0gMDtcbiAgICAgICAgdGhpcy5wbGFjZWROdW0gPSAwO1xuICAgICAgICB0aGlzLmRyYWdOdW0gPSB0aGlzLnByZW1pc2VBcnJheS5sZW5ndGg7XG4gICAgICAgIC8vIERpc3RyYWN0b3JzIGFyZSBwcmVtaXNlcyB3aG9zZSBjYXRlZ29yeSBkb2VzIG5vdCBtYXRjaCBhbnkgZHJvcHpvbmUsXG4gICAgICAgIC8vIGkuZS4gYmxvY2tzIHRoYXQgYXJlIG5vdCBtZWFudCB0byBiZSBwbGFjZWQuXG4gICAgICAgIGxldCBkaXN0cmFjdG9yTnVtID0gMDtcblxuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmRyb3Bab25lRGl2LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBkcm9wIHpvbmUgY2hpbGRyZW4gdGhhdCBhcmVuJ3QgcHJlbWlzZXNcbiAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgQXJyYXkuZnJvbShyZXNwb25zZS5jaGlsZE5vZGVzKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5pdnBcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlZE51bSsrO1xuICAgICAgICAgICAgICAgIGlmIChwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnkgPT0gcmVzcG9uc2UuZGF0YXNldC5jYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0rKztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdE51bSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcmllcy5pbmRleE9mKHByZW1pc2UuZGF0YXNldC5jYXRlZ29yeSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBkaXN0cmFjdG9yTnVtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiBBcnJheS5mcm9tKHRoaXMuZHJhZ2dhYmxlRGl2LmNoaWxkTm9kZXMpLmZpbHRlcihcbiAgICAgICAgICAgIChub2RlKSA9PiBub2RlLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERVxuICAgICAgICApKSB7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcmllcy5pbmRleE9mKHByZW1pc2UuZGF0YXNldC5jYXRlZ29yeSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0rKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmFuc3dlcmVkTnVtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhlIHN0dWRlbnQgbXVzdCBhdHRlbXB0IHRvIHBsYWNlIGV2ZXJ5IGJsb2NrIHRoYXQgYmVsb25ncyBpbiBhXG4gICAgICAgIC8vIGRyb3B6b25lICh0b3RhbCBwcmVtaXNlcyBtaW51cyB0aGUgZGlzdHJhY3RvcnMpIGJlZm9yZSB3ZSBnaXZlIGFueVxuICAgICAgICAvLyBjb3JyZWN0bmVzcyBmZWVkYmFjay5cbiAgICAgICAgdGhpcy5yZXF1aXJlZFBsYWNlbWVudHMgPSB0aGlzLnByZW1pc2VBcnJheS5sZW5ndGggLSBkaXN0cmFjdG9yTnVtO1xuICAgICAgICB0aGlzLmVub3VnaFBsYWNlZCA9IHRoaXMucGxhY2VkTnVtID49IHRoaXMucmVxdWlyZWRQbGFjZW1lbnRzO1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSB0aGlzLmNvcnJlY3ROdW0gLyB0aGlzLnByZW1pc2VBcnJheS5sZW5ndGg7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucGVyY2VudCwgdGhpcy5pbmNvcnJlY3ROdW0sIHRoaXMudW5hbnN3ZXJlZE51bSk7XG4gICAgICAgIGlmICh0aGlzLnBlcmNlbnQgPCAxLjApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHsgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIiB9KTtcbiAgICB9XG5cbiAgICBpc0NvcnJlY3REcm9wKHJlc3BvbnNlKSB7XG4gICAgICAgIC8vIFJldHVybnMgdHJ1ZSBpZiBhbGwgcHJlbWlzZXMgaW4gdGhlIHJlc3BvbnNlIGFyZSBpbiB0aGUgY29ycmVjdCBjYXRlZ29yeVxuICAgICAgICAvLyBhbmQgYWxsIHByZW1pc2VzIGluIHRoZSBjYXRlZ29yeSBhcmUgaW4gdGhlIHJlc3BvbnNlXG4gICAgICAgIC8vIHVzZWQgYnkgcmVuZGVyRmVlZGJhY2tcbiAgICAgICAgbGV0IGNvcnJlY3QgPSB0cnVlO1xuICAgICAgICBsZXQgY29ycmVjdFBsYWNlbWVudHMgPSAwO1xuICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIEFycmF5LmZyb20ocmVzcG9uc2UuY2hpbGROb2RlcykuZmlsdGVyKHRoaXMuaXZwKSkge1xuICAgICAgICAgICAgaWYgKHByZW1pc2UuZGF0YXNldC5jYXRlZ29yeSAhPSByZXNwb25zZS5kYXRhc2V0LmNhdGVnb3J5KSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb3JyZWN0UGxhY2VtZW50cysrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBjYXRDb3VudCA9IDA7XG4gICAgICAgIGZvciAobGV0IHByZW1pcyBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKHByZW1pcy5kYXRhc2V0LmNhdGVnb3J5ID09IHJlc3BvbnNlLmRhdGFzZXQuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICBjYXRDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3JyZWN0ICYmIGNvcnJlY3RQbGFjZW1lbnRzID09IGNhdENvdW50O1xuICAgIH1cblxuICAgIGlzVmFsaWRQcmVtaXNlKHByZW1pc2UpIHtcbiAgICAgICAgaWYgKHRoaXMucHJlbWlzZUFycmF5LmluY2x1ZGVzKHByZW1pc2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmFuc3dlclN0YXRlKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJkcmFnTmRyb3BcIixcbiAgICAgICAgICAgIGFjdDogYW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBtaW5faGVpZ2h0OiBNYXRoLnJvdW5kKHRoaXMubWluaGVpZ2h0KSxcbiAgICAgICAgICAgIGRyYWdfd2lkdGg6IHRoaXMuZHJhZ3dpZHRoLFxuICAgICAgICAgICAgZHJvcF93aWR0aDogdGhpcy5kcm9wd2lkdGgsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QsXG4gICAgICAgICAgICBjb3JyZWN0TnVtOiB0aGlzLmNvcnJlY3ROdW0sXG4gICAgICAgICAgICBkcmFnTnVtOiB0aGlzLmRyYWdOdW0sXG4gICAgICAgIH07XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG4gICAgY2xlYXJJbmNvcnJlY3RIaWdobGlnaHRzKCkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIHJlZCBcImRyb3AtaW5jb3JyZWN0XCIgaGlnaGxpZ2h0aW5nIGFuZCByZWxhdGVkIGExMXlcbiAgICAgICAgLy8gYXR0cmlidXRlcyBmcm9tIGV2ZXJ5IHBsYWNlZCBwcmVtaXNlLlxuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmRyb3Bab25lRGl2LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgQXJyYXkuZnJvbShyZXNwb25zZS5jaGlsZE5vZGVzKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5pdnBcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICBwcmVtaXNlLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgICAgICBwcmVtaXNlLnNldEF0dHJpYnV0ZShcImFyaWEtaW52YWxpZFwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgICAgIHByZW1pc2UucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1lcnJvcm1lc3NhZ2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIGlmICghdGhpcy5mZWVkQmFja0Rpdikge1xuICAgICAgICAgICAgdGhpcy5jcmVhdGVGZWVkYmFja0RpdigpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSByZXNldCBidXR0b24gaGlkZXMgdGhlIGZlZWRiYWNrIGFyZWEgd2l0aCBkaXNwbGF5Om5vbmUsIHNvIG1ha2VcbiAgICAgICAgLy8gc3VyZSBpdCBpcyBzaG93biBhZ2FpbiB3aGVuZXZlciB3ZSByZW5kZXIgZmVlZGJhY2suXG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuXG4gICAgICAgIC8vIFJlcXVpcmVtZW50IDE6IGRvbid0IGdpdmUgYW55IGNvcnJlY3RuZXNzIGZlZWRiYWNrIHVudGlsIHRoZSBzdHVkZW50XG4gICAgICAgIC8vIGhhcyBhdHRlbXB0ZWQgdG8gcGxhY2UgYWxsIHRoZSBibG9ja3MgdGhhdCBiZWxvbmcgaW4gYSBkcm9wem9uZS5cbiAgICAgICAgaWYgKCF0aGlzLmVub3VnaFBsYWNlZCkge1xuICAgICAgICAgICAgdGhpcy5jbGVhckluY29ycmVjdEhpZ2hsaWdodHMoKTtcbiAgICAgICAgICAgIGxldCByZW1haW5pbmcgPSB0aGlzLnJlcXVpcmVkUGxhY2VtZW50cyAtIHRoaXMucGxhY2VkTnVtO1xuICAgICAgICAgICAgdmFyIG1zZ1BsYWNlTW9yZSA9IHQoXCJtc2dfZHJhZ25kcm9wX3BsYWNlX21vcmVcIiwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJwYXJhXCI+JHttc2dQbGFjZU1vcmV9PC9kaXY+YDtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID1cbiAgICAgICAgICAgICAgICBcImFsZXJ0IGFsZXJ0LXdhcm5pbmcgZHJhZ2dhYmxlLWZlZWRiYWNrIGV4ZXJjaXNlLWNvbnRlbnRcIjtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVxdWlyZW1lbnQgMjogb25seSBjb2xvciB0aGUgbWlzcGxhY2VkIGJsb2NrcyByZWQgb25jZSB0aGUgc3R1ZGVudFxuICAgICAgICAvLyBoYXMgaGFkIGF0IGxlYXN0IE1JTl9UUklFU19GT1JfQ09MT1IgZ3JhZGVhYmxlIHRyaWVzLlxuICAgICAgICBsZXQgc2hvd0NvbG9ycyA9IHRoaXMudHJpZXMgPj0gTUlOX1RSSUVTX0ZPUl9DT0xPUjtcbiAgICAgICAgZm9yIChsZXQgcmVzcG9uc2Ugb2YgdGhpcy5kcm9wWm9uZURpdi5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgYWxsIHRoZSBwcmVtaXNlcyBpbiB0aGUgcmVzcG9uc2VcbiAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgQXJyYXkuZnJvbShyZXNwb25zZS5jaGlsZE5vZGVzKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5pdnBcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgcHJlbWlzZSBpcyBub3QgaW4gdGhlIGNvcnJlY3QgY2F0ZWdvcnksIGFkZCB0aGUgY2xhc3NcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHNob3dDb2xvcnMgJiZcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5kYXRhc2V0LmNhdGVnb3J5ICE9IHJlc3BvbnNlLmRhdGFzZXQuY2F0ZWdvcnlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5jbGFzc0xpc3QuYWRkKFwiZHJvcC1pbmNvcnJlY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIHByZW1pc2Uuc2V0QXR0cmlidXRlKFwiYXJpYS1pbnZhbGlkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyaWEtZXJyb3JtZXNzYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLmlkICsgXCJfZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZW1pc2UuaWQgKyBcIl9lcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICkuY2xhc3NMaXN0LnJlbW92ZShcInZoLWRuZC1lcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWludmFsaWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWVycm9ybWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgdmFyIG1zZ0NvcnJlY3QgPSB0KFwibXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlclwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gbXNnQ29ycmVjdDtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvIGRyYWdnYWJsZS1mZWVkYmFjayBleGVyY2lzZS1jb250ZW50XCI7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtc2dJbmNvcnJlY3QgPSB0KFxuICAgICAgICAgICAgICAgIFwibXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyXCIsXG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TnVtLFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0TnVtLFxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ051bSxcbiAgICAgICAgICAgICAgICB0aGlzLnVuYW5zd2VyZWROdW1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvLyB0aGlzLmZlZWRiYWNrIGNvbWVzIGZyb20gdGhlIGF1dGhvciAoYSBoaW50IG1heWJlKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBgPGRpdiBjbGFzcz1cInBhcmFcIj4ke21zZ0luY29ycmVjdH08L2Rpdj4gJHt0aGlzLmZlZWRiYWNrfWA7XG4gICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9XG4gICAgICAgICAgICAgICAgXCJhbGVydCBhbGVydC1kYW5nZXIgZHJhZ2dhYmxlLWZlZWRiYWNrIGV4ZXJjaXNlLWNvbnRlbnRcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBDaGVja2luZy9yZXN0b3JpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZVxuICAgICAgICB0aGlzLmhhc1N0b3JlZERyb3B6b25lcyA9IHRydWU7XG4gICAgICAgIHRoaXMubWluaGVpZ2h0ID0gZGF0YS5taW5faGVpZ2h0O1xuICAgICAgICB0aGlzLmRyYWd3aWR0aCA9IGRhdGEuZHJhZ193aWR0aDtcbiAgICAgICAgdGhpcy5kcm9wd2lkdGggPSBkYXRhLmRyb3Bfd2lkdGg7XG4gICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuZmluaXNoU2V0dGluZ1VwKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0b3JlZE9iajtcbiAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSBmYWxzZTtcbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWRPYmogPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQgPSBzdG9yZWRPYmoubWluX2hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnd2lkdGggPSBzdG9yZWRPYmouZHJhZ193aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcm9wd2lkdGggPSBzdG9yZWRPYmouZHJvcF93aWR0aDtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3Igd2hpbGUgcGFyc2luZzsgbGlrZWx5IGR1ZSB0byBiYWQgdmFsdWUgc3RvcmVkIGluIHN0b3JhZ2VcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHBhcnNpbmcgc3RvcmVkIERyYWdORHJvcCBkYXRhIGZvciAke3RoaXMuZGl2aWR9OiAke2Vycn1gKTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgfHwgc3RvcmVkT2JqLnRpbWVzdGFtcCA8IGVCb29rQ29uZmlnLnRlcm1TdGFydERhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmluaXNoU2V0dGluZ1VwKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXJTdGF0ZSA9IHN0b3JlZE9iai5hbnN3ZXI7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgYW5zd2VyIGluIGRhdGFiYXNlXG4gICAgICAgICAgICAgICAgICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmFuc3dlclN0YXRlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Q6IGFuc3dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWluX2hlaWdodDogTWF0aC5yb3VuZCh0aGlzLm1pbmhlaWdodCksXG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnX3dpZHRoOiB0aGlzLmRyYWd3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3Bfd2lkdGg6IHRoaXMuZHJvcHdpZHRoLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29ycmVjdDogc3RvcmVkT2JqLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgIH1cblxuICAgIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLmFuc3dlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBkaWRuJ3QgbG9hZCBmcm9tIHRoZSBzZXJ2ZXIsIHdlIG11c3QgZ2VuZXJhdGUgdGhlIGRhdGFcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IHJlc3BvbnNlIG9mIHRoaXMuZHJvcFpvbmVEaXYuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGVbcmVzcG9uc2UuaWRdID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiByZXNwb25zZS5jaGlsZE5vZGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZW1pc2Uubm9kZVR5cGUgIT09IE5vZGUuVEVYVF9OT0RFICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnByZW1pc2VBcnJheS5pbmNsdWRlcyhwcmVtaXNlKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGVbcmVzcG9uc2UuaWRdLnB1c2gocHJlbWlzZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBjb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB2YXIgc3RvcmFnZU9iaiA9IHtcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5hbnN3ZXJTdGF0ZSxcbiAgICAgICAgICAgIG1pbl9oZWlnaHQ6IHRoaXMubWluaGVpZ2h0LFxuICAgICAgICAgICAgdGltZXN0YW1wOiB0aW1lU3RhbXAsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZHJhZ193aWR0aDogdGhpcy5kcmFnd2lkdGgsXG4gICAgICAgICAgICBkcm9wX3dpZHRoOiB0aGlzLmRyb3B3aWR0aCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJlbWlzZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAvLyBObyBtb3JlIGRyYWdnaW5nXG4gICAgICAgICAgICB0aGlzLnByZW1pc2VBcnJheVtpXS5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucHJlbWlzZUFycmF5W2ldLnN0eWxlLmN1cnNvciA9IFwiaW5pdGlhbFwiO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcbiAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBpbmRleCBiZXR3ZWVuIDAgYW5kIGlcbiAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAvLyBTd2FwIGVsZW1lbnRzIGF0IGluZGljZXMgaSBhbmQgalxuICAgICAgICBbYXJyYXlbaV0sIGFycmF5W2pdXSA9IFthcnJheVtqXSwgYXJyYXlbaV1dO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBlbGVtZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9ZHJhZ25kcm9wXVwiKTtcbiAgICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB7XG4gICAgICAgICAgICBvcmlnOiBlbGVtZW50LFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWVsZW1lbnQuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmNvbXBvbmVudE1hcFtlbGVtZW50LmlkXSA9IG5ldyBEcmFnTkRyb3Aob3B0cyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgYEVycm9yIHJlbmRlcmluZyBEcmFnTkRyb3AgUHJvYmxlbSAke2VsZW1lbnQuaWR9OiAke2Vycn1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9yc2kxOG4uanNcIjtcblxubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlcjogXCJZb3UgYXJlIGNvcnJlY3QhXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlcjpcbiAgICAgICAgICAgIFwiSW5jb3JyZWN0LiBPZiB0aGUgY2FyZHMgeW91IGhhdmUgc29ydGVkIHlvdSBwbGFjZWQgJDEgY29ycmVjdGx5IGFuZCAkMiBpbmNvcnJlY3RseS4gWW91IGhhdmUgJDQgbGVmdCB0byBwbGFjZS5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9wbGFjZV9tb3JlOlxuICAgICAgICAgICAgXCJQbGVhc2UgcGxhY2UgYWxsIG9mIHRoZSBjYXJkcyBiZWZvcmUgY2hlY2tpbmcgeW91ciBhbnN3ZXIuIFlvdSBoYXZlICQxIGxlZnQgdG8gcGxhY2UuXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9yZXNldDogXCJSZXNldFwiLFxuICAgIH0sXG59KTtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsImltcG9ydCB7IGxvYWQgfSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3JzaTE4bi5qc1wiO1xuXG5sb2FkKHtcbiAgICBcInB0LWJyXCI6IHtcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlcjogXCJDb3JyZXRvIVwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX2luY29ycmVjdF9hbnN3ZXI6XG4gICAgICAgICAgICBcIkluY29ycmV0by4gVm9jw6ogdGV2ZSAkMSBjb3JyZXRvKHMpIGUgJDIgaW5jb3JyZXRvKHMpIGRlICQzLiBWb2PDqiBkZWl4b3UgJDQgZW0gYnJhbmNvLlwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX3BsYWNlX21vcmU6XG4gICAgICAgICAgICBcIlBvciBmYXZvciwgcG9zaWNpb25lIHRvZG9zIG9zIGNhcnTDtWVzIGFudGVzIGRlIHZlcmlmaWNhciBzdWEgcmVzcG9zdGEuIFZvY8OqIGFpbmRhIHRlbSAkMSBwYXJhIHBvc2ljaW9uYXIuXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfcmVzZXQ6IFwiUmVzZXRhclwiLFxuICAgIH0sXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==