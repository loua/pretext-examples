(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_dragndrop_js_timeddnd_js"],{

/***/ 17558:
/*!********************************************!*\
  !*** ./runestone/dragndrop/js/timeddnd.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DragNDrop)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _css_dragndrop_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/dragndrop.less */ 76512);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dragndrop-i18n.en.js */ 32552);
/* harmony import */ var _dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_dragndrop_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dragndrop-i18n.pt-br.js */ 81264);
/* harmony import */ var _dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_dragndrop_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__);
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
        this.submitButton.textContent = $.i18n("msg_dragndrop_check_me");
        this.submitButton.setAttribute("class", "btn btn-success drag-button");
        this.submitButton.setAttribute("name", "do answer");
        this.submitButton.setAttribute("type", "button");
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            this.renderFeedback();
            this.logCurrentAnswer();
        }.bind(this);
        this.resetButton = document.createElement("button"); // Check me button
        this.resetButton.textContent = $.i18n("msg_dragndrop_reset");
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
            this.draggableDiv.appendChild(premise);
        }
        this.answerState = {};
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
        this.dragNum = this.premiseArray.length;

        for (let response of this.dropZoneDiv.childNodes) {
            // ignore drop zone children that aren't premises
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp
            )) {
                if (premise.dataset.category == response.dataset.category) {
                    this.correctNum++;
                } else {
                    this.incorrectNum++;
                }
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
    renderFeedback() {
        for (let response of this.dropZoneDiv.childNodes) {
            // iterate over all the premises in the response
            for (let premise of Array.from(response.childNodes).filter(
                this.ivp
            )) {
                // if the premise is not in the correct category, add the class
                if (
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
        if (!this.feedBackDiv) {
            this.createFeedbackDiv();
        }
        this.feedBackDiv.style.visibility = "visible";
        if (this.correct) {
            var msgCorrect = $.i18n("msg_dragndrop_correct_answer");
            setTimeout(() => {
                this.feedBackDiv.innerHTML = msgCorrect;
            }, 10);
            this.feedBackDiv.className = "alert alert-info draggable-feedback exercise-content";

        } else {
            var msgIncorrect = $.i18n(
                $.i18n("msg_dragndrop_incorrect_answer"),
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
/***/ (() => {

$.i18n().load({
    en: {
        msg_dragndrop_correct_answer: "You are correct!",
        msg_dragndrop_incorrect_answer:
            "Incorrect. Of the cards you have sorted you placed $1 correctly and $2 incorrectly. You have $4 left to place.",
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

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 81264:
/*!********************************************************!*\
  !*** ./runestone/dragndrop/js/dragndrop-i18n.pt-br.js ***!
  \********************************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_dragndrop_correct_answer: "Correto!",
        msg_dragndrop_incorrect_answer:
            "Incorreto. Você teve $1 correto(s) e $2 incorreto(s) de $3. Você deixou $4 em branco.",
        msg_dragndrop_check_me: "Verificar",
        msg_dragndrop_reset: "Resetar",
    },
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RyYWduZHJvcF9qc190aW1lZGRuZF9qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFhOztBQUUwQjs7QUFFeEIsNkJBQTZCLHFEQUFTO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxREFBUztBQUN4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTs7QUFFZ0Q7QUFDOUI7QUFDQztBQUNHO0FBQ25DOztBQUVlLHdCQUF3QixtRUFBYTtBQUNwRDtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsZUFBZTtBQUMxRCwwQ0FBMEMsZUFBZTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxNQUFNO0FBQ3RDLHFCQUFxQjtBQUNyQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCw2REFBNkQ7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSxtREFBbUQsU0FBUztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxNQUFNLEtBQUssYUFBYTtBQUN4RCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwyREFBMkQ7O0FBRTNEO0FBQ0E7O0FBRUEsMkNBQTJDLGdCQUFnQjtBQUMzRCwwQ0FBMEMsZ0JBQWdCO0FBQzFEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCwrQkFBK0IsY0FBYztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLG1DQUFtQztBQUNsRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLGFBQWEsU0FBUyxjQUFjO0FBQ3RHLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCLDRDQUE0QztBQUM1QywyRUFBMkUsV0FBVyxJQUFJLElBQUk7QUFDOUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCLDhCQUE4QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQ0FBbUMsT0FBTztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSx5REFBeUQsV0FBVyxJQUFJLElBQUk7QUFDNUU7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7Ozs7O0FDOXlCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7O0FDUkQ7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZHJhZ25kcm9wL2pzL2RyYWduZHJvcC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RyYWduZHJvcC9qcy9kcmFnbmRyb3AtaTE4bi5lbi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2RyYWduZHJvcC9jc3MvZHJhZ25kcm9wLmxlc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kcmFnbmRyb3AvanMvZHJhZ25kcm9wLWkxOG4ucHQtYnIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBEcmFnTkRyb3AgZnJvbSBcIi4vZHJhZ25kcm9wLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRHJhZ05Ecm9wIGV4dGVuZHMgRHJhZ05Ecm9wIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdC4gICAgVXNlZCBmb3IgdGltZWQgYXNzZXNzbWVudCBncmFkaW5nLlxuICAgICAgICBpZiAodGhpcy51bmFuc3dlcmVkTnVtID09PSB0aGlzLmRyYWdQYWlyQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiVFwiO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJGXCI7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgJCh0aGlzLmZlZWRCYWNrRGl2KS5oaWRlKCk7XG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5W1wiZHJhZ25kcm9wXCJdID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkRHJhZ05Ecm9wKG9wdHMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IERyYWdORHJvcChvcHRzKTtcbn07XG4iLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgTWFzdGVyIGRyYWduZHJvcC5qcyAgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09IHRoZSBSdW5lc3RvbmUgRHJhZyBuIGRyb3AgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA3LzYvMTUgICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgIEJyYWQgTUlsbGVyICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDIvNy8xOSAgICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDEyLzMwLzI0ICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG4vKlxuICogU29tZSB0ZXJtaW5vbG9neTpcbiAqIC0gZHJhZ2dhYmxlOiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGRyYWdnZWRcbiAqIC0gZHJvcHpvbmU6IHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgZHJvcHBlZCBvblxuICogLSBwcmVtaXNlOiB0aGUgZWxlbWVudCB0aGF0IGlzIGJlaW5nIGRyYWdnZWRcbiAqIC0gcmVzcG9uc2U6IHRoZSBlbGVtZW50IHRoYXQgaXMgYmVpbmcgZHJvcHBlZCBvblxuICogLSBjYXRlZ29yeTogZWFjaCBwcmVtaXMgYW5kIHJlc3BvbnNlIGhhdmUgYSBjYXRlZ29yeS4gIFNldmVyYWwgcHJlbWlzZXMgY2FuIGhhdmUgdGhlIHNhbWUgY2F0ZWdvcnlcbiAqIGFuZCBiZSBkcm9wcGVkIG9udG8gdGhlIHNhbWUgcmVzcG9uc2UuICBJZiBhIHByZW1pc2UgaGFzIG5vIHJlc3BvbnNlIGl0cyBjYXRlZ29yeSB3aWxsIG5vdCBiZSBpblxuICogdGhlIGxpc3Qgb2YgY2F0ZWdvcmllcy5cbiAqXG4gKiBLZXkgdmFyaWFibGVzOlxuICogLSBkcmFnQXJyYXk6IGFuIGFycmF5IG9mIGRyYWdnYWJsZSBlbGVtZW50c1xuICogLSBkcm9wQXJyYXk6IGFuIGFycmF5IG9mIGRyb3B6b25lIGVsZW1lbnRzXG4gKiAtIGNhdGVnb3JpZXM6IGFuIGFycmF5IG9mIGFsbCBjYXRlZ29yaWVzXG4gKi9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9kcmFnbmRyb3AubGVzc1wiO1xuaW1wb3J0IFwiLi9kcmFnbmRyb3AtaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9kcmFnbmRyb3AtaTE4bi5wdC1ici5qc1wiO1xuLy9pbXBvcnQgXCIuL0RyYWdEcm9wVG91Y2guanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhZ05Ecm9wIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8dWw+IGVsZW1lbnQgdGhhdCB3aWxsIGJlIHJlcGxhY2VkIGJ5IG5ldyBIVE1MXG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IG9wdHMudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIHRoaXMucmFuZG9tID0gdHJ1ZTtcbiAgICAgICAgLy9jaGVjayBpZiB0aGUgb3JpZ2luYWwgZWxlbWVudCBoYXMgYSBkYXRhLXJhbmRvbSBhdHRyaWJ1dGUgc2V0IHRvIHRoZSB2YWx1ZSBcIm5vXCJcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uZGF0YXNldC5yYW5kb20gPT09IFwibm9cIikge1xuICAgICAgICAgICAgdGhpcy5yYW5kb20gPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZlZWRiYWNrID0gXCJcIjtcbiAgICAgICAgdGhpcy5xdWVzdGlvbiA9IFwiXCI7XG4gICAgICAgIHRoaXMucG9wdWxhdGUoKTsgLy8gUG9wdWxhdGVzIHRoaXMucmVzcG9uc2VBcnJheSwgdGhpcy5wcmVtaXNlQXJyYXksIHRoaXMuZmVlZGJhY2sgYW5kIHRoaXMucXVlc3Rpb25cbiAgICAgICAgdGhpcy5jcmVhdGVOZXdFbGVtZW50cygpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIkRyYWctTi1Ecm9wXCI7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IFVwZGF0ZSB2YXJpYWJsZXMgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcG9wdWxhdGUoKSB7XG4gICAgICAgIHRoaXMucmVzcG9uc2VBcnJheSA9IFtdO1xuICAgICAgICB0aGlzLnByZW1pc2VBcnJheSA9IFtdO1xuICAgICAgICBsZXQgaW52aXNpYmxlRXJyb3JEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBpbnZpc2libGVFcnJvckRpdi5jbGFzc0xpc3QuYWRkKFwicHR4LXJ1bmVzdG9uZS1jb250YWluZXJcIik7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW52aXNpYmxlRXJyb3JEaXYpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlBvcHVsYXRpbmcgRHJhZ05Ecm9wIHdpdGggcHJlbWlzZXMgYW5kIHJlc3BvbnNlc1wiKTtcbiAgICAgICAgdGhpcy5jYXJkcyA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgIFwiW2RhdGEtc3ViY29tcG9uZW50PSdkcmFnZ2FibGUnXVwiXG4gICAgICAgICk7XG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5jYXJkcykge1xuICAgICAgICAgICAgbGV0IHJlcGxhY2VTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5pbm5lckhUTUwgPSBlbGVtZW50LmlubmVySFRNTDtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLmlkID0gZWxlbWVudC5pZDtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcInRydWVcIik7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5jbGFzc0xpc3QuYWRkKFwiZHJhZ2dhYmxlLWRyYWdcIik7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5jbGFzc0xpc3QuYWRkKFwicHJlbWlzZVwiKTtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLnRhYkluZGV4ID0gMDtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLnNldEF0dHJpYnV0ZSgncm9sZScsICdidXR0b24nKTtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLmRhdGFzZXQuY2F0ZWdvcnkgPSB0aGlzLmdldENhdGVnb3J5KGVsZW1lbnQpO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uZGF0YXNldC5wYXJlbnRfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkucHVzaChyZXBsYWNlU3Bhbik7XG4gICAgICAgICAgICB0aGlzLnNldERyYWdMaXN0ZW5lcnMocmVwbGFjZVNwYW4pO1xuICAgICAgICAgICAgLy8gbm93IGNyZWF0ZSBhbiBlcnJvciBtZXNzYWdlIGZvciB3aGVuIHRoZSBwcmVtaXNlIGlzIGRyb3BwZWQgaW4gdGhlIHdyb25nIHBsYWNlXG4gICAgICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZS5jbGFzc0xpc3QuYWRkKFwidmgtZG5kLWVycm9yXCIpO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLmlubmVySFRNTCA9IFwiSW5jb3JyZWN0IGRyb3Agem9uZSBmb3IgXCIgKyByZXBsYWNlU3Bhbi5pbm5lckhUTUw7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2Uuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImFsZXJ0XCIpO1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlLmlkID0gcmVwbGFjZVNwYW4uaWQgKyBcIl9lcnJvclwiO1xuICAgICAgICAgICAgaW52aXNpYmxlRXJyb3JEaXYuYXBwZW5kQ2hpbGQoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcbiAgICAgICAgICAgIC8vIFNodWZmbGUgdGhlIHByZW1pc2VBcnJheSBpZiByYW5kb20gaXMgdHJ1ZVxuICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkgPSBzaHVmZmxlQXJyYXkodGhpcy5wcmVtaXNlQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5vcmlnRWxlbS5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgXCJbZGF0YS1zdWJjb21wb25lbnQ9J2Ryb3B6b25lJ11cIlxuICAgICAgICApKSB7XG4gICAgICAgICAgICBsZXQgcmVwbGFjZVNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLmlubmVySFRNTCA9IGVsZW1lbnQuaW5uZXJIVE1MO1xuICAgICAgICAgICAgcmVwbGFjZVNwYW4uaWQgPSBlbGVtZW50XG4gICAgICAgICAgICAgICAgLmdldEF0dHJpYnV0ZShcImZvclwiKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKFwiZHJhZ1wiLCBcImRyb3BcIik7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgIFwiZHJhZ2dhYmxlLWRyb3BcIixcbiAgICAgICAgICAgICAgICBcImRyb3AtbGFiZWxcIixcbiAgICAgICAgICAgICAgICBcInJlc3BvbnNlXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi50YWJJbmRleCA9IDA7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAnYnV0dG9uJyk7XG4gICAgICAgICAgICByZXBsYWNlU3Bhbi5kYXRhc2V0LmNhdGVnb3J5ID0gdGhpcy5nZXRDYXRlZ29yeShlbGVtZW50KTtcbiAgICAgICAgICAgIHJlcGxhY2VTcGFuLmRhdGFzZXQucGFyZW50X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgICAgIHRoaXMucmVzcG9uc2VBcnJheS5wdXNoKHJlcGxhY2VTcGFuKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RHJvcExpc3RlbmVycyhyZXBsYWNlU3Bhbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGhpcy5vcmlnRWxlbS5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgXCJbZGF0YS1zdWJjb21wb25lbnQ9J3F1ZXN0aW9uJ11cIlxuICAgICAgICApLmlubmVySFRNTDtcbiAgICAgICAgbGV0IGZlZWRiYWNrID0gdGhpcy5vcmlnRWxlbS5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgXCJbZGF0YS1zdWJjb21wb25lbnQ9J2ZlZWRiYWNrJ11cIlxuICAgICAgICApO1xuICAgICAgICBpZiAoZmVlZGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZGJhY2sgPSBmZWVkYmFjay5pbm5lckhUTUw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRDYXRlZ29yeShlbGVtKSB7XG4gICAgICAgIGlmIChlbGVtLmRhdGFzZXQuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtLmRhdGFzZXQuY2F0ZWdvcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiBubyBjYXRlZ29yeSB0aGVuIHVzZSB0aGUgZm9yIGF0dHJpYnV0ZSBvciB0aGUgaWRcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUoXCJmb3JcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbS5nZXRBdHRyaWJ1dGUoXCJmb3JcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtLmlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09IENyZWF0ZSBuZXcgSFRNTCBlbGVtZW50cyBhbmQgcmVwbGFjZSA9PVxuICAgID09ICAgICAgb3JpZ2luYWwgZWxlbWVudCB3aXRoIHRoZW0gICAgICA9PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGNyZWF0ZU5ld0VsZW1lbnRzKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcImRyYWdnYWJsZS1jb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuc3RhdGVtZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5zdGF0ZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImNhcmRzb3J0LXN0YXRlbWVudFwiKTtcbiAgICAgICAgdGhpcy5zdGF0ZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImV4ZXJjaXNlLXN0YXRlbWVudFwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVtZW50RGl2LmlubmVySFRNTCA9IHRoaXMucXVlc3Rpb247XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igc2V0dGluZyBzdGF0ZW1lbnREaXYgaW5uZXJIVE1MOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zdGF0ZW1lbnREaXYpO1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIEhvbGRzIHRoZSBkcmFnZ2FibGVzL2Ryb3B6b25lcywgcHJldmVudHMgZmVlZGJhY2sgZnJvbSBibGVlZGluZyBpblxuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmRyYWdEcm9wV3JhcERpdik7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuY2xhc3NMaXN0LmFkZChcInJzZHJhZ2dhYmxlXCIsIFwiZHJhZ3pvbmVcIik7XG4gICAgICAgIHRoaXMuYWRkRHJhZ0Rpdkxpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmRyb3Bab25lRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5jbGFzc0xpc3QuYWRkKFwicnNkcmFnZ2FibGVcIik7XG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LmFwcGVuZENoaWxkKHRoaXMuZHJhZ2dhYmxlRGl2KTtcbiAgICAgICAgdGhpcy5kcmFnRHJvcFdyYXBEaXYuYXBwZW5kQ2hpbGQodGhpcy5kcm9wWm9uZURpdik7XG4gICAgICAgIHRoaXMuY3JlYXRlQnV0dG9ucygpO1xuICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwiZHJhZ05kcm9wXCIsIHRydWUpO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucHJhY3RpY2VfbW9kZSkge1xuICAgICAgICAgICAgdGhpcy5maW5pc2hTZXR0aW5nVXAoKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5pdnAgPSB0aGlzLmlzVmFsaWRQcmVtaXNlLmJpbmQodGhpcyk7XG4gICAgICAgIHNlbGYucXVldWVNYXRoSmF4KHNlbGYuY29udGFpbmVyRGl2KTtcbiAgICB9XG5cbiAgICBmaW5pc2hTZXR0aW5nVXAoKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kUmVwbGFjZW1lbnRTcGFucygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUZlZWRiYWNrRGl2KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVwbGFjaW5nIG9yaWdFbGVtIHdpdGggY29udGFpbmVyRGl2XCIpO1xuICAgICAgICB0aGlzLm9yaWdFbGVtLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHRoaXMuY29udGFpbmVyRGl2LCB0aGlzLm9yaWdFbGVtKTtcbiAgICAgICAgaWYgKCF0aGlzLmhhc1N0b3JlZERyb3B6b25lcykge1xuICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQgPSB0aGlzLmRyYWdnYWJsZURpdi5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAvLyBFbnN1cmUgTWF0aEpheCBoYXMgY29tcGxldGVkIGJlZm9yZSBhZGp1c3RpbmcgdGhlIHpvbmUgd2lkdGhzXG4gICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmNvbnRhaW5lckRpdikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGp1c3REcmFnRHJvcFdpZHRocygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgaWYgKHRoaXMuZHJvcFpvbmVEaXYub2Zmc2V0SGVpZ2h0ID4gdGhpcy5taW5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5vZmZzZXRIZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0Ryb3BXcmFwRGl2LnN0eWxlLm1pbkhlaWdodCA9XG4gICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5zdHlsZS53aWR0aCA9IGAke3RoaXMuZHJhZ3dpZHRofSVgO1xuICAgICAgICB0aGlzLmRyb3Bab25lRGl2LnN0eWxlLndpZHRoID0gYCR7dGhpcy5kcm9wd2lkdGh9JWA7XG4gICAgfVxuICAgIGFkZERyYWdEaXZMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ292ZXJcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJvcFwiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnYWJsZURpdi5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuY2xhc3NMaXN0LnJlbW92ZShcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBldi5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdnYWJsZUlEXCIpO1xuICAgICAgICAgICAgICAgIHZhciBkcmFnZ2VkU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMuZHJhZ2dhYmxlRGl2LmNvbnRhaW5zKGRyYWdnZWRTcGFuKSAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zdHJhbmdlckRhbmdlcihkcmFnZ2VkU3BhbilcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGVsZW1lbnQgaXNuJ3QgYWxyZWFkeSB0aGVyZS0tcHJldmVudHMgZXJyb3Mgdy9hcHBlbmRpbmcgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYXBwZW5kQ2hpbGQoZHJhZ2dlZFNwYW4pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkanVzdERyYWdEcm9wV2lkdGhzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0ID0gdGhpcy5kcmFnZ2FibGVEaXYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zdHlsZS5taW5IZWlnaHQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wLWRyb3BcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdDogYCR7ZGF0YX0gLT4gZHJhZ3pvbmVgLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ2xlYXZlXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kcmFnZ2FibGVEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwicG9zc2libGVEcm9wXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuY2xhc3NMaXN0LnJlbW92ZShcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cbiAgICBjcmVhdGVCdXR0b25zKCkge1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmNsYXNzTGlzdC5hZGQoXCJkbmQtYnV0dG9uLWNvbnRhaW5lclwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpOyAvLyBDaGVjayBtZSBidXR0b25cbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZHJhZ25kcm9wX2NoZWNrX21lXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ0biBidG4tc3VjY2VzcyBkcmFnLWJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKFwibmFtZVwiLCBcImRvIGFuc3dlclwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlckZlZWRiYWNrKCk7XG4gICAgICAgICAgICB0aGlzLmxvZ0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTsgLy8gQ2hlY2sgbWUgYnV0dG9uXG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZHJhZ25kcm9wX3Jlc2V0XCIpO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnNldEF0dHJpYnV0ZShcbiAgICAgICAgICAgIFwiY2xhc3NcIixcbiAgICAgICAgICAgIFwiYnRuIGJ0bi1kZWZhdWx0IGRyYWctYnV0dG9uIGRyYWctcmVzZXRcIlxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJkbyBhbnN3ZXJcIik7XG4gICAgICAgIHRoaXMucmVzZXRCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXREcmFnZ2FibGVzKCk7XG4gICAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5idXR0b25EaXYuYXBwZW5kQ2hpbGQodGhpcy5zdWJtaXRCdXR0b24pO1xuICAgICAgICB0aGlzLmJ1dHRvbkRpdi5hcHBlbmRDaGlsZCh0aGlzLnJlc2V0QnV0dG9uKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5idXR0b25EaXYpO1xuICAgIH1cbiAgICBhcHBlbmRSZXBsYWNlbWVudFNwYW5zKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmFuc3dlclN0YXRlID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuYW5zd2VyU3RhdGUpLmxlbmd0aCA9PT0gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSB7fTtcbiAgICAgICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5wcmVtaXNlQXJyYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGVsZW1lbnQgb2YgdGhpcy5yZXNwb25zZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBwbGFjZWRQcmVtaXNlcyA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgcmVzcG9uc2Ugb2YgdGhpcy5yZXNwb25zZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5hcHBlbmRDaGlsZChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYW5zd2VyU3RhdGVbcmVzcG9uc2UuaWRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgdGhpcy5hbnN3ZXJTdGF0ZVtyZXNwb25zZS5pZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlZFByZW1pc2VzLnB1c2gocHJlbWlzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZm91bmRQcmVtaXNlID0gdGhpcy5maW5kUHJlbWlzZShwcmVtaXNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3VuZFByZW1pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZS5hcHBlbmRDaGlsZChmb3VuZFByZW1pc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBQcmVtaXNlIHdpdGggSUQgJHtwcmVtaXNlfSBub3QgZm91bmQgaW4gcHJlbWlzZUFycmF5YFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYWNlZFByZW1pc2VzLmluZGV4T2YocHJlbWlzZS5pZCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYXBwZW5kQ2hpbGQocHJlbWlzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZFByZW1pc2UoaWQpIHtcbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiB0aGlzLnByZW1pc2VBcnJheSkge1xuICAgICAgICAgICAgaWYgKHByZW1pc2UuaWQgPT0gaWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvdW50U2F2ZWRQcmVtaXNlcygpIHtcbiAgICAgICAgLy8gQ291bnQgaG93IG1hbnkgcHJlbWlzZXMgYXJlIHNhdmVkIGluIHRoZSBhbnN3ZXJTdGF0ZVxuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBsZXQgbmFtZXMgPSB7fTtcbiAgICAgICAgZm9yIChsZXQgcmVzcG9uc2Ugb2YgdGhpcy5hbnN3ZXJTdGF0ZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbmFtZXNbcHJlbWlzZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lc1twcmVtaXNlXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50O1xuICAgIH1cblxuICAgIHNldERyYWdMaXN0ZW5lcnMoZGdTcGFuKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBldi5kYXRhVHJhbnNmZXIuc2V0RGF0YShcImRyYWdnYWJsZUlEXCIsIGV2LnRhcmdldC5pZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZ1NwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRnU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcm9wXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBldi5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcImRyYWdnYWJsZUlEXCIpO1xuICAgICAgICAgICAgICAgIHZhciBkcmFnZ2VkU3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRhdGEpO1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dlZFNwYW4gIT0gZXYudGFyZ2V0ICYmXG4gICAgICAgICAgICAgICAgICAgICF0aGlzLnN0cmFuZ2VyRGFuZ2VyKGRyYWdnZWRTcGFuKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgZWxlbWVudCBpc24ndCBhbHJlYWR5IHRoZXJlLS1wcmV2ZW50cyBlcnJvcnMgdy9hcHBlbmRpbmcgY2hpbGRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2FibGVEaXYuYXBwZW5kQ2hpbGQoZHJhZ2dlZFNwYW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEFkZCBrZXlib2FyZCBuYXZpZ2F0aW9uIGZvciBzZWxlY3RpbmcgcHJlbWlzZXNcbiAgICAgICAgZGdTcGFuLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgaWYgKGV2LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2LmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGlmICghc2VsZi5zZWxlY3RlZFByZW1pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByZW1pc2UgPSBkZ1NwYW47XG4gICAgICAgICAgICAgICAgICAgIGRnU3Bhbi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByZW1pc2UuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJlbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXREcm9wTGlzdGVuZXJzKGRwU3Bhbikge1xuICAgICAgICBkcFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiZHJhZ292ZXJcIixcbiAgICAgICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhcInBvc3NpYmxlRHJvcFwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChldi50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZHJhZ2dhYmxlLWRyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2xlYXZlXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgc2VsZi5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoIWV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBldi50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZShcInBvc3NpYmxlRHJvcFwiKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRwU3Bhbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJkcm9wXCIsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJwb3NzaWJsZURyb3BcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgZXYudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoXCJwb3NzaWJsZURyb3BcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gZXYuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJkcmFnZ2FibGVJRFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgZHJhZ2dlZFNwYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChkYXRhKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIGV2LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoXCJkcmFnZ2FibGUtZHJvcFwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5zdHJhbmdlckRhbmdlcihkcmFnZ2VkU3BhbikgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMucHJlbWlzZUFycmF5LmluY2x1ZGVzKGV2LnRhcmdldCkgLy8gZG9uJ3QgZHJvcCBvbiBhbm90aGVyIHByZW1pc2UhXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBlbGVtZW50IGlzbid0IGFscmVhZHkgdGhlcmUtLXByZXZlbnRzIGVycm9ycyB3L2FwcGVuZGluZyBjaGlsZFxuICAgICAgICAgICAgICAgICAgICBldi50YXJnZXQuYXBwZW5kQ2hpbGQoZHJhZ2dlZFNwYW4pO1xuICAgICAgICAgICAgICAgICAgICAvLyBsb2cgYSBkcm9wIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcC1kcm9wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Q6IGAke2RhdGF9IC0+ICR7ZXYudGFyZ2V0LmlkfWAsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmNvbnRhaW5lckRpdikudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEFkZCBrZXlib2FyZCBuYXZpZ2F0aW9uIGZvciBkcm9wcGluZyBwcmVtaXNlc1xuICAgICAgICBkcFNwYW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBpZiAoKGV2LmtleSA9PT0gXCJFbnRlclwiIHx8IGV2LmtleSA9PT0gXCIgXCIpICYmIHNlbGYuc2VsZWN0ZWRQcmVtaXNlKSB7XG4gICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICFzZWxmLnN0cmFuZ2VyRGFuZ2VyKHNlbGYuc2VsZWN0ZWRQcmVtaXNlKSAmJlxuICAgICAgICAgICAgICAgICAgICAhc2VsZi5wcmVtaXNlQXJyYXkuaW5jbHVkZXMoZHBTcGFuKSAvLyBkb24ndCBkcm9wIG9uIGFub3RoZXIgcHJlbWlzZSFcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgZHBTcGFuLmFwcGVuZENoaWxkKHNlbGYuc2VsZWN0ZWRQcmVtaXNlKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZFByZW1pc2UuY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkUHJlbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucXVldWVNYXRoSmF4KHNlbGYuY29udGFpbmVyRGl2KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWRqdXN0RHJhZ0Ryb3BXaWR0aHMoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGp1c3REcmFnRHJvcFdpZHRocygpIHtcbiAgICAgICAgLy8gVGVtcG9yYXJpbHkgbWluaW1pemUgdGhlIGRyYWd6b25lIHdpZHRoIHRvIHRoZSBjb250ZW50XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LnN0eWxlLndpZHRoID0gXCJmaXQtY29udGVudFwiO1xuXG4gICAgICAgIGNvbnN0IGRyYWd6b25lV2lkdGggPSB0aGlzLmRyYWdnYWJsZURpdi5vZmZzZXRXaWR0aDtcbiAgICAgICAgY29uc3QgdG90YWxXaWR0aCA9IHRoaXMuZHJhZ0Ryb3BXcmFwRGl2Lm9mZnNldFdpZHRoO1xuXG4gICAgICAgIGxldCBkcmFnem9uZVBlcmNlbnQgPSBNYXRoLmNlaWwoKGRyYWd6b25lV2lkdGggLyB0b3RhbFdpZHRoKSAqIDEwMCk7XG4gICAgICAgIGRyYWd6b25lUGVyY2VudCA9IE1hdGgubWF4KDI4LCBNYXRoLm1pbihkcmFnem9uZVBlcmNlbnQsIDQ4KSk7XG4gICAgICAgIGNvbnN0IGRyb3B6b25lUGVyY2VudCA9IDEwMCAtIGRyYWd6b25lUGVyY2VudCAtIDQ7IC8vIDQgYWNjb3VudHMgZm9yIHpvbmUgcGFkZGluZ1xuXG4gICAgICAgIHRoaXMuZHJhZ3dpZHRoID0gZHJhZ3pvbmVQZXJjZW50O1xuICAgICAgICB0aGlzLmRyb3B3aWR0aCA9IGRyb3B6b25lUGVyY2VudDtcblxuICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5zdHlsZS53aWR0aCA9IGAke2RyYWd6b25lUGVyY2VudH0lYDtcbiAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5zdHlsZS53aWR0aCA9IGAke2Ryb3B6b25lUGVyY2VudH0lYDtcbiAgICB9XG5cbiAgICBjcmVhdGVGZWVkYmFja0RpdigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmZlZWRCYWNrRGl2KSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NMaXN0LmFkZChcImV4ZXJjaXNlLWNvbnRlbnRcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LnNldEF0dHJpYnV0ZShcImFyaWEtbGl2ZVwiLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuZmVlZEJhY2tEaXYpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PSBBdXhpbGlhcnkgZnVuY3Rpb25zID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIC8qIGxlYXZpbmcgdGhlIG5hbWUgYXMgaXMsIGJlY2F1c2UgaXQgcmVtaW5kcyBtZSBvZiBJc2FpYWghICovXG4gICAgc3RyYW5nZXJEYW5nZXIodGVzdFNwYW4pIHtcbiAgICAgICAgLy8gUmV0dXJucyB0cnVlIGlmIHRoZSB0ZXN0IHNwYW4gZG9lc24ndCBiZWxvbmcgdG8gdGhpcyBpbnN0YW5jZSBvZiBEcmFnTkRyb3BcbiAgICAgICAgaWYgKHRlc3RTcGFuLmRhdGFzZXQucGFyZW50X2lkICE9IHRoaXMuZGl2aWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gUmVzZXQgYnV0dG9uIGZ1bmN0aW9uYWxpdHkgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHJlc2V0RHJhZ2dhYmxlcygpIHtcbiAgICAgICAgdGhpcy5kcm9wWm9uZURpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLnJlc3BvbnNlQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgIHRoaXMuZHJvcFpvbmVEaXYuYXBwZW5kQ2hpbGQocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlRGl2LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIC8vIFNodWZmbGUgdGhlIHByZW1pc2VBcnJheSBpZiByYW5kb20gaXMgdHJ1ZVxuICAgICAgICBpZiAodGhpcy5yYW5kb20pIHtcbiAgICAgICAgICAgIHRoaXMucHJlbWlzZUFycmF5ID0gc2h1ZmZsZUFycmF5KHRoaXMucHJlbWlzZUFycmF5KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBwcmVtaXNlIG9mIHRoaXMucHJlbWlzZUFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnYWJsZURpdi5hcHBlbmRDaGlsZChwcmVtaXNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuc3dlclN0YXRlID0ge307XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB0aGlzLmFkanVzdERyYWdEcm9wV2lkdGhzKCk7XG4gICAgICAgIHRoaXMubWluaGVpZ2h0ID0gdGhpcy5kcmFnZ2FibGVEaXYub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB0aGlzLmRyYWdEcm9wV3JhcERpdi5zdHlsZS5taW5IZWlnaHQgPVxuICAgICAgICAgICAgdGhpcy5taW5oZWlnaHQudG9TdHJpbmcoKSArIFwicHhcIjtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wLXJlc2V0XCIsXG4gICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICBhY3Q6IFwicmVzZXRcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHsgY29ycmVjdDogXCJGXCIgfSk7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gRXZhbHVhdGlvbiBhbmQgZmVlZGJhY2sgPT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGdldEFsbENhdGVnb3JpZXMoKSB7XG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmRyb3Bab25lRGl2LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcy5wdXNoKHJlc3BvbnNlLmRhdGFzZXQuY2F0ZWdvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhdGVnb3JpZXM7XG4gICAgfVxuXG4gICAgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBsZXQgY2F0ZWdvcmllcyA9IHRoaXMuZ2V0QWxsQ2F0ZWdvcmllcygpO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICB0aGlzLnVuYW5zd2VyZWROdW0gPSAwO1xuICAgICAgICB0aGlzLmluY29ycmVjdE51bSA9IDA7XG4gICAgICAgIHRoaXMuY29ycmVjdE51bSA9IDA7XG4gICAgICAgIHRoaXMuZHJhZ051bSA9IHRoaXMucHJlbWlzZUFycmF5Lmxlbmd0aDtcblxuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmRyb3Bab25lRGl2LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZSBkcm9wIHpvbmUgY2hpbGRyZW4gdGhhdCBhcmVuJ3QgcHJlbWlzZXNcbiAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgQXJyYXkuZnJvbShyZXNwb25zZS5jaGlsZE5vZGVzKS5maWx0ZXIoXG4gICAgICAgICAgICAgICAgdGhpcy5pdnBcbiAgICAgICAgICAgICkpIHtcbiAgICAgICAgICAgICAgICBpZiAocHJlbWlzZS5kYXRhc2V0LmNhdGVnb3J5ID09IHJlc3BvbnNlLmRhdGFzZXQuY2F0ZWdvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TnVtKys7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3ROdW0rKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiBBcnJheS5mcm9tKHRoaXMuZHJhZ2dhYmxlRGl2LmNoaWxkTm9kZXMpLmZpbHRlcihcbiAgICAgICAgICAgIChub2RlKSA9PiBub2RlLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERVxuICAgICAgICApKSB7XG4gICAgICAgICAgICBpZiAoY2F0ZWdvcmllcy5pbmRleE9mKHByZW1pc2UuZGF0YXNldC5jYXRlZ29yeSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3ROdW0rKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmFuc3dlcmVkTnVtKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZXJjZW50ID0gdGhpcy5jb3JyZWN0TnVtIC8gdGhpcy5wcmVtaXNlQXJyYXkubGVuZ3RoO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLnBlcmNlbnQsIHRoaXMuaW5jb3JyZWN0TnVtLCB0aGlzLnVuYW5zd2VyZWROdW0pO1xuICAgICAgICBpZiAodGhpcy5wZXJjZW50IDwgMS4wKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7IGNvcnJlY3Q6IHRoaXMuY29ycmVjdCA/IFwiVFwiIDogXCJGXCIgfSk7XG4gICAgfVxuXG4gICAgaXNDb3JyZWN0RHJvcChyZXNwb25zZSkge1xuICAgICAgICAvLyBSZXR1cm5zIHRydWUgaWYgYWxsIHByZW1pc2VzIGluIHRoZSByZXNwb25zZSBhcmUgaW4gdGhlIGNvcnJlY3QgY2F0ZWdvcnlcbiAgICAgICAgLy8gYW5kIGFsbCBwcmVtaXNlcyBpbiB0aGUgY2F0ZWdvcnkgYXJlIGluIHRoZSByZXNwb25zZVxuICAgICAgICAvLyB1c2VkIGJ5IHJlbmRlckZlZWRiYWNrXG4gICAgICAgIGxldCBjb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgbGV0IGNvcnJlY3RQbGFjZW1lbnRzID0gMDtcbiAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiBBcnJheS5mcm9tKHJlc3BvbnNlLmNoaWxkTm9kZXMpLmZpbHRlcih0aGlzLml2cCkpIHtcbiAgICAgICAgICAgIGlmIChwcmVtaXNlLmRhdGFzZXQuY2F0ZWdvcnkgIT0gcmVzcG9uc2UuZGF0YXNldC5jYXRlZ29yeSkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdFBsYWNlbWVudHMrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgY2F0Q291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBwcmVtaXMgb2YgdGhpcy5wcmVtaXNlQXJyYXkpIHtcbiAgICAgICAgICAgIGlmIChwcmVtaXMuZGF0YXNldC5jYXRlZ29yeSA9PSByZXNwb25zZS5kYXRhc2V0LmNhdGVnb3J5KSB7XG4gICAgICAgICAgICAgICAgY2F0Q291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29ycmVjdCAmJiBjb3JyZWN0UGxhY2VtZW50cyA9PSBjYXRDb3VudDtcbiAgICB9XG5cbiAgICBpc1ZhbGlkUHJlbWlzZShwcmVtaXNlKSB7XG4gICAgICAgIGlmICh0aGlzLnByZW1pc2VBcnJheS5pbmNsdWRlcyhwcmVtaXNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJTdGF0ZSk7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwiZHJhZ05kcm9wXCIsXG4gICAgICAgICAgICBhY3Q6IGFuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgbWluX2hlaWdodDogTWF0aC5yb3VuZCh0aGlzLm1pbmhlaWdodCksXG4gICAgICAgICAgICBkcmFnX3dpZHRoOiB0aGlzLmRyYWd3aWR0aCxcbiAgICAgICAgICAgIGRyb3Bfd2lkdGg6IHRoaXMuZHJvcHdpZHRoLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0LFxuICAgICAgICAgICAgY29ycmVjdE51bTogdGhpcy5jb3JyZWN0TnVtLFxuICAgICAgICAgICAgZHJhZ051bTogdGhpcy5kcmFnTnVtLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgfVxuICAgIHJlbmRlckZlZWRiYWNrKCkge1xuICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmRyb3Bab25lRGl2LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgIC8vIGl0ZXJhdGUgb3ZlciBhbGwgdGhlIHByZW1pc2VzIGluIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgZm9yIChsZXQgcHJlbWlzZSBvZiBBcnJheS5mcm9tKHJlc3BvbnNlLmNoaWxkTm9kZXMpLmZpbHRlcihcbiAgICAgICAgICAgICAgICB0aGlzLml2cFxuICAgICAgICAgICAgKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmVtaXNlIGlzIG5vdCBpbiB0aGUgY29ycmVjdCBjYXRlZ29yeSwgYWRkIHRoZSBjbGFzc1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5kYXRhc2V0LmNhdGVnb3J5ICE9IHJlc3BvbnNlLmRhdGFzZXQuY2F0ZWdvcnlcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5jbGFzc0xpc3QuYWRkKFwiZHJvcC1pbmNvcnJlY3RcIik7XG4gICAgICAgICAgICAgICAgICAgIHByZW1pc2Uuc2V0QXR0cmlidXRlKFwiYXJpYS1pbnZhbGlkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyaWEtZXJyb3JtZXNzYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLmlkICsgXCJfZXJyb3JcIlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZW1pc2UuaWQgKyBcIl9lcnJvclwiXG4gICAgICAgICAgICAgICAgICAgICkuY2xhc3NMaXN0LnJlbW92ZShcInZoLWRuZC1lcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLmNsYXNzTGlzdC5yZW1vdmUoXCJkcm9wLWluY29ycmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWludmFsaWRcIiwgXCJmYWxzZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgcHJlbWlzZS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWVycm9ybWVzc2FnZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmZlZWRCYWNrRGl2KSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUZlZWRiYWNrRGl2KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIHZhciBtc2dDb3JyZWN0ID0gJC5pMThuKFwibXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlclwiKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gbXNnQ29ycmVjdDtcbiAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvIGRyYWdnYWJsZS1mZWVkYmFjayBleGVyY2lzZS1jb250ZW50XCI7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtc2dJbmNvcnJlY3QgPSAkLmkxOG4oXG4gICAgICAgICAgICAgICAgJC5pMThuKFwibXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyXCIpLFxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdE51bSxcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdE51bSxcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdOdW0sXG4gICAgICAgICAgICAgICAgdGhpcy51bmFuc3dlcmVkTnVtXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgLy8gdGhpcy5mZWVkYmFjayBjb21lcyBmcm9tIHRoZSBhdXRob3IgKGEgaGludCBtYXliZSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJwYXJhXCI+JHttc2dJbmNvcnJlY3R9PC9kaXY+ICR7dGhpcy5mZWVkYmFja31gO1xuICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPVxuICAgICAgICAgICAgICAgIFwiYWxlcnQgYWxlcnQtZGFuZ2VyIGRyYWdnYWJsZS1mZWVkYmFjayBleGVyY2lzZS1jb250ZW50XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvcmVzdG9yaW5nIGZyb20gc3RvcmFnZSA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgcmVzdG9yZUFuc3dlcnMoZGF0YSkge1xuICAgICAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2VcbiAgICAgICAgdGhpcy5oYXNTdG9yZWREcm9wem9uZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLm1pbmhlaWdodCA9IGRhdGEubWluX2hlaWdodDtcbiAgICAgICAgdGhpcy5kcmFnd2lkdGggPSBkYXRhLmRyYWdfd2lkdGg7XG4gICAgICAgIHRoaXMuZHJvcHdpZHRoID0gZGF0YS5kcm9wX3dpZHRoO1xuICAgICAgICB0aGlzLmFuc3dlclN0YXRlID0gSlNPTi5wYXJzZShkYXRhLmFuc3dlcik7XG4gICAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgdGhpcy5maW5pc2hTZXR0aW5nVXAoKTtcbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdG9yZWRPYmo7XG4gICAgICAgIHRoaXMuaGFzU3RvcmVkRHJvcHpvbmVzID0gZmFsc2U7XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgdmFyIGV4ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhc1N0b3JlZERyb3B6b25lcyA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmVkT2JqID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWluaGVpZ2h0ID0gc3RvcmVkT2JqLm1pbl9oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ3dpZHRoID0gc3RvcmVkT2JqLmRyYWdfd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJvcHdpZHRoID0gc3RvcmVkT2JqLmRyb3Bfd2lkdGg7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBwYXJzaW5nIHN0b3JlZCBEcmFnTkRyb3AgZGF0YSBmb3IgJHt0aGlzLmRpdmlkfTogJHtlcnJ9YCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JlZE9iai50aW1lc3RhbXAgPCBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhc1N0b3JlZERyb3B6b25lcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaFNldHRpbmdVcCgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VyU3RhdGUgPSBzdG9yZWRPYmouYW5zd2VyO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlIGFuc3dlciBpbiBkYXRhYmFzZVxuICAgICAgICAgICAgICAgICAgICBsZXQgYW5zd2VyID0gSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcImRyYWdOZHJvcFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0OiBhbnN3ZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbl9oZWlnaHQ6IE1hdGgucm91bmQodGhpcy5taW5oZWlnaHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHJhZ193aWR0aDogdGhpcy5kcmFnd2lkdGgsXG4gICAgICAgICAgICAgICAgICAgICAgICBkcm9wX3dpZHRoOiB0aGlzLmRyb3B3aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcnJlY3Q6IHN0b3JlZE9iai5jb3JyZWN0LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maW5pc2hTZXR0aW5nVXAoKTtcbiAgICB9XG5cbiAgICBzZXRMb2NhbFN0b3JhZ2UoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5hbnN3ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gSWYgd2UgZGlkbid0IGxvYWQgZnJvbSB0aGUgc2VydmVyLCB3ZSBtdXN0IGdlbmVyYXRlIHRoZSBkYXRhXG4gICAgICAgICAgICB0aGlzLmFuc3dlclN0YXRlID0ge307XG4gICAgICAgICAgICBmb3IgKGxldCByZXNwb25zZSBvZiB0aGlzLmRyb3Bab25lRGl2LmNoaWxkTm9kZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuc3dlclN0YXRlW3Jlc3BvbnNlLmlkXSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHByZW1pc2Ugb2YgcmVzcG9uc2UuY2hpbGROb2Rlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVtaXNlLm5vZGVUeXBlICE9PSBOb2RlLlRFWFRfTk9ERSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXkuaW5jbHVkZXMocHJlbWlzZSlcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlclN0YXRlW3Jlc3BvbnNlLmlkXS5wdXNoKHByZW1pc2UuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB2YXIgY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IHRoaXMuYW5zd2VyU3RhdGUsXG4gICAgICAgICAgICBtaW5faGVpZ2h0OiB0aGlzLm1pbmhlaWdodCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgICAgIGRyYWdfd2lkdGg6IHRoaXMuZHJhZ3dpZHRoLFxuICAgICAgICAgICAgZHJvcF93aWR0aDogdGhpcy5kcm9wd2lkdGgsXG4gICAgICAgIH07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgdGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSxcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmopXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlc2V0QnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByZW1pc2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgLy8gTm8gbW9yZSBkcmFnZ2luZ1xuICAgICAgICAgICAgdGhpcy5wcmVtaXNlQXJyYXlbaV0uZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnByZW1pc2VBcnJheVtpXS5zdHlsZS5jdXJzb3IgPSBcImluaXRpYWxcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2h1ZmZsZUFycmF5KGFycmF5KSB7XG4gICAgZm9yIChsZXQgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgLy8gR2VuZXJhdGUgYSByYW5kb20gaW5kZXggYmV0d2VlbiAwIGFuZCBpXG4gICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgLy8gU3dhcCBlbGVtZW50cyBhdCBpbmRpY2VzIGkgYW5kIGpcbiAgICAgICAgW2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT0gRmluZCB0aGUgY3VzdG9tIEhUTUwgdGFncyBhbmQgPT1cbj09ICAgZXhlY3V0ZSBvdXIgY29kZSBvbiB0aGVtICAgID09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PWRyYWduZHJvcF1cIik7XG4gICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBjb25zdCBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogZWxlbWVudCxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCFlbGVtZW50LmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wb25lbnRNYXBbZWxlbWVudC5pZF0gPSBuZXcgRHJhZ05Ecm9wKG9wdHMpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXG4gICAgICAgICAgICAgICAgICAgIGBFcnJvciByZW5kZXJpbmcgRHJhZ05Ecm9wIFByb2JsZW0gJHtlbGVtZW50LmlkfTogJHtlcnJ9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuIiwiJC5pMThuKCkubG9hZCh7XG4gICAgZW46IHtcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jb3JyZWN0X2Fuc3dlcjogXCJZb3UgYXJlIGNvcnJlY3QhXCIsXG4gICAgICAgIG1zZ19kcmFnbmRyb3BfaW5jb3JyZWN0X2Fuc3dlcjpcbiAgICAgICAgICAgIFwiSW5jb3JyZWN0LiBPZiB0aGUgY2FyZHMgeW91IGhhdmUgc29ydGVkIHlvdSBwbGFjZWQgJDEgY29ycmVjdGx5IGFuZCAkMiBpbmNvcnJlY3RseS4gWW91IGhhdmUgJDQgbGVmdCB0byBwbGFjZS5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jaGVja19tZTogXCJDaGVjayBtZVwiLFxuICAgICAgICBtc2dfZHJhZ25kcm9wX3Jlc2V0OiBcIlJlc2V0XCIsXG4gICAgfSxcbn0pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiJC5pMThuKCkubG9hZCh7XG4gICAgXCJwdC1iclwiOiB7XG4gICAgICAgIG1zZ19kcmFnbmRyb3BfY29ycmVjdF9hbnN3ZXI6IFwiQ29ycmV0byFcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9pbmNvcnJlY3RfYW5zd2VyOlxuICAgICAgICAgICAgXCJJbmNvcnJldG8uIFZvY8OqIHRldmUgJDEgY29ycmV0byhzKSBlICQyIGluY29ycmV0byhzKSBkZSAkMy4gVm9jw6ogZGVpeG91ICQ0IGVtIGJyYW5jby5cIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9jaGVja19tZTogXCJWZXJpZmljYXJcIixcbiAgICAgICAgbXNnX2RyYWduZHJvcF9yZXNldDogXCJSZXNldGFyXCIsXG4gICAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9