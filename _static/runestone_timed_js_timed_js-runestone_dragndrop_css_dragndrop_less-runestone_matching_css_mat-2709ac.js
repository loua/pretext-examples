"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_timed_js_timed_js-runestone_dragndrop_css_dragndrop_less-runestone_matching_css_mat-2709ac"],{

/***/ 4968:
/*!*************************************!*\
  !*** ./runestone/timed/js/timed.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timed)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _fitb_js_timedfitb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../fitb/js/timedfitb.js */ 1103);
/* harmony import */ var _mchoice_js_timedmc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../mchoice/js/timedmc.js */ 86001);
/* harmony import */ var _shortanswer_js_timed_shortanswer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shortanswer/js/timed_shortanswer.js */ 68950);
/* harmony import */ var _activecode_js_acfactory_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../activecode/js/acfactory.js */ 49917);
/* harmony import */ var _clickableArea_js_timedclickable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../clickableArea/js/timedclickable */ 44892);
/* harmony import */ var _dragndrop_js_timeddnd_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../dragndrop/js/timeddnd.js */ 17558);
/* harmony import */ var _parsons_js_timedparsons_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../parsons/js/timedparsons.js */ 23405);
/* harmony import */ var _matching_js_timed_matching_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../matching/js/timed_matching.js */ 89296);
/* harmony import */ var _selectquestion_js_selectone__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../selectquestion/js/selectone */ 10662);
/* harmony import */ var _css_timed_less__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../css/timed.less */ 57724);
/*==========================================
========      Master timed.js     =========
============================================
===     This file contains the JS for    ===
===     the Runestone timed component.   ===
============================================
===              Created By              ===
===             Kirby Olson              ===
===               6/11/15                ===
==========================================*/














// Timed constructor
class Timed extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig;
        this.origElem = orig; // the entire element of this timed assessment and all of its children
        this.divid = orig.id;
        this.children = this.origElem.childNodes;
        this.visited = [];
        this.timeLimit = 0;
        this.limitedTime = false;
        if (!isNaN($(this.origElem).data("time"))) {
            this.timeLimit = parseInt($(this.origElem).data("time"), 10) * 60; // time in seconds to complete the exam
            this.startingTime = this.timeLimit;
            this.limitedTime = true;
        }
        this.showFeedback = true;
        if (this.origElem.hasAttribute("data-no-feedback")) {
            this.showFeedback = false;
        }
        // check for attribute data-show-feedback = yes
        if (this.origElem.hasAttribute("data-show-feedback")) {
            if (this.origElem.getAttribute("data-show-feedback") === "yes") {
                this.showFeedback = true;
            } else {
                this.showFeedback = false;
            }
        }
        this.showResults = false;
        if (this.origElem.hasAttribute("data-result")) {
            this.showResults = false;
        }
        this.random = false;
        if (this.origElem.hasAttribute("data-random")) {
            this.random = true;
        }
        this.showTimer = true;
        if (this.origElem.hasAttribute("data-no-timer")) {
            this.showTimer = false;
        }
        if (this.origElem.hasAttribute("data-timer")) {
            if (
                this.origElem.getAttribute("data-timer") === "yes"
            ) {
                this.showTimer = true;
            } else {
                this.showTimer = false;
            }
        }
        this.fullwidth = false;
        if (this.origElem.hasAttribute("data-fullwidth")) {
            this.fullwidth = true;
        }
        this.nopause = false;
        if (this.origElem.hasAttribute("data-no-pause")) {
            this.nopause = true;
        }
        if (this.origElem.hasAttribute("data-pause")) {
            if (this.origElem.getAttribute("data-pause") === "yes") {
                this.nopause = false;
            } else {
                this.nopause = true;
            }
        }
        eBookConfig.enableScratchAC = false;
        this.running = 0;
        this.paused = 0;
        this.done = 0;
        this.taken = 0;
        this.score = 0;
        this.incorrect = 0;
        this.correctStr = "";
        this.incorrectStr = "";
        this.skippedStr = "";
        this.skipped = 0;
        this.currentQuestionIndex = 0; // Which question is currently displaying on the page
        this.renderedQuestionArray = []; // list of all problems
        this.getNewChildren();
        // One small step to eliminate students from doing view source
        // this won't stop anyone with determination but may prevent casual peeking
        if (!eBookConfig.enableDebug) {
            document.body.oncontextmenu = function () {
                return false;
            };
        }
        this.checkAssessmentStatus().then(
            function () {
                this.renderTimedAssess();
            }.bind(this)
        );
    }

    getNewChildren() {
        this.newChildren = [];
        let runestoneChildren = this.origElem.querySelectorAll(".runestone");
        for (var i = 0; i < runestoneChildren.length; i++) {
            this.newChildren.push(runestoneChildren[i]);
        }
    }

    async checkAssessmentStatus() {
        // Has the user taken this exam?  Inquiring minds want to know
        // If a user has not taken this exam then we want to make sure
        // that if a question has been seen by the student before we do
        // not populate previous answers.
        let sendInfo = {
            div_id: this.divid,
            course_name: eBookConfig.course,
        };
        console.log(sendInfo);
        if (eBookConfig.useRunestoneServices) {
            let request = new Request(
                `${eBookConfig.new_server_prefix}/assessment/tookTimedAssessment`,
                {
                    method: "POST",
                    headers: this.jsonHeaders,
                    body: JSON.stringify(sendInfo),
                }
            );
            let response = await fetch(request);
            let data = await response.json();
            data = data.detail;
            this.taken = data.tookAssessment;
            this.assessmentTaken = this.taken;
            if (!this.taken) {
                localStorage.clear();
            }
            console.log("done with check status");
            return response;
        } else {
            this.taken = false;
            this.assessmentTaken = false;
            return Promise.resolve();
        }
    }

    /*===============================
    === Generating new Timed HTML ===
    ===============================*/
    async renderTimedAssess() {
        console.log("rendering timed ");
        // create renderedQuestionArray returns a promise
        //
        this.createRenderedQuestionArray();
        if (this.random) {
            this.randomizeRQA();
        }
        this.renderContainer();
        this.renderTimer();
        await this.renderControlButtons();
        // If we decide to disable cut/copy/paste, uncomment the line below        
        // this.disableCutCopyPaste();
        this.containerDiv.appendChild(this.timedDiv); // This can't be appended in renderContainer because then it renders above the timer and control buttons.
        if (this.renderedQuestionArray.length > 1) this.renderNavControls();
        this.renderSubmitButton();
        this.renderFeedbackContainer();
        this.useRunestoneServices = eBookConfig.useRunestoneServices;
        // Replace intermediate HTML with rendered HTML
        $(this.origElem).replaceWith(this.containerDiv);
        // check if already taken and if so show results
        this.styleExamElements(); // rename to renderPossibleResults
        this.checkServer("timedExam", true);
    }

    disableCutCopyPaste() {
        document.addEventListener("cut", function (e) {
            e.preventDefault();
        });
        document.addEventListener("copy", function (e) {
            e.preventDefault();
        });
        document.addEventListener("paste", function (e) {
            e.preventDefault();
        });
    }

    renderContainer() {
        this.containerDiv = document.createElement("div"); // container for the entire Timed Component
        if (this.fullwidth) {
            // allow the container to fill the width - barb
            $(this.containerDiv).attr({
                style: "max-width:none",
            });
        }
        this.containerDiv.classList.add("runestone-sphinx");
        this.containerDiv.id = this.divid;
        this.timedDiv = document.createElement("div"); // div that will hold the questions for the timed assessment
        this.navDiv = document.createElement("div"); // For navigation control
        $(this.navDiv).attr({
            style: "text-align:center",
        });
        this.flagDiv = document.createElement("div"); // div that will hold the "Flag Question" button
        $(this.flagDiv).attr({
            style: "text-align: center",
        });
        this.switchContainer = document.createElement("div");
        this.switchContainer.classList.add("switchcontainer");
        this.switchDiv = document.createElement("div"); // is replaced by the questions
        this.timedDiv.appendChild(this.navDiv);
        this.timedDiv.appendChild(this.flagDiv); // add flagDiv to timedDiv, which holds components for navigation and questions for timed assessment
        this.timedDiv.appendChild(this.switchContainer);
        this.switchContainer.appendChild(this.switchDiv);
        $(this.timedDiv).attr({
            id: "timed_Test",
            style: "display:none",
        });
    }

    renderTimer() {
        this.wrapperDiv = document.createElement("div");
        this.timerContainer = document.createElement("P");
        this.wrapperDiv.id = this.divid + "-startWrapper";
        this.timerContainer.id = this.divid + "-output";
        this.wrapperDiv.appendChild(this.timerContainer);
        this.showTime();
    }

    renderControlButtons() {
        this.controlDiv = document.createElement("div");
        $(this.controlDiv).attr({
            id: "controls",
            style: "text-align: center",
        });
        this.startBtn = document.createElement("button");
        this.pauseBtn = document.createElement("button");
        $(this.startBtn).attr({
            class: "btn btn-success",
            id: "start",
            tabindex: "0",
            role: "button",
        });
        this.startBtn.textContent = "Start";
        this.startBtn.addEventListener(
            "click",
            async function () {
                $(this.finishButton).hide(); // hide the finish button for now
                $(this.flagButton).show();
                let mess = document.createElement("p");
                mess.innerHTML =
                    "<strong>Warning: You will not be able to continue the exam if you close this tab, close the window, or navigate away from this page!</strong>  Make sure you click the Finish Exam button when you are done to submit your work!";
                this.controlDiv.appendChild(mess);
                mess.classList.add("examwarning");
                await this.renderTimedQuestion();
                this.startAssessment();
            }.bind(this),
            false
        );
        $(this.pauseBtn).attr({
            class: "btn btn-default",
            id: "pause",
            disabled: "true",
            tabindex: "0",
            role: "button",
        });
        this.pauseBtn.textContent = "Pause";
        this.pauseBtn.addEventListener(
            "click",
            function () {
                this.pauseAssessment();
            }.bind(this),
            false
        );
        if (!this.taken) {
            this.controlDiv.appendChild(this.startBtn);
        }
        if (!this.nopause) {
            this.controlDiv.appendChild(this.pauseBtn);
        }
        this.containerDiv.appendChild(this.wrapperDiv);
        this.containerDiv.appendChild(this.controlDiv);
    }

    renderNavControls() {
        // making "Prev" button
        this.pagNavList = document.createElement("ul");
        $(this.pagNavList).addClass("pagination");
        this.leftContainer = document.createElement("li");
        this.leftNavButton = document.createElement("button");
        this.leftNavButton.innerHTML = "&#8249; Prev";
        $(this.leftNavButton).attr("aria-label", "Previous");
        $(this.leftNavButton).attr("tabindex", "0");
        $(this.leftNavButton).attr("role", "button");
        $(this.rightNavButton).attr("id", "prev");
        $(this.leftNavButton).css("cursor", "pointer");
        this.leftContainer.appendChild(this.leftNavButton);
        this.pagNavList.appendChild(this.leftContainer);
        // making "Flag Question" button
        this.flaggingPlace = document.createElement("ul");
        $(this.flaggingPlace).addClass("pagination");
        this.flagContainer = document.createElement("li");
        this.flagButton = document.createElement("button");
        $(this.flagButton).addClass("flagBtn");
        this.flagButton.innerHTML = "Flag Question"; // name on button
        $(this.flagButton).attr("aria-labelledby", "Flag");
        $(this.flagButton).attr("tabindex", "5");
        $(this.flagButton).attr("role", "button");
        $(this.flagButton).attr("id", "flag");
        $(this.flagButton).css("cursor", "pointer");
        this.flagContainer.appendChild(this.flagButton); // adding button to container
        this.flaggingPlace.appendChild(this.flagContainer); // adding container to flaggingPlace
        // making "Next" button
        this.rightContainer = document.createElement("li");
        this.rightNavButton = document.createElement("button");
        $(this.rightNavButton).attr("aria-label", "Next");
        $(this.rightNavButton).attr("tabindex", "0");
        $(this.rightNavButton).attr("role", "button");
        $(this.rightNavButton).attr("id", "next");
        this.rightNavButton.innerHTML = "Next &#8250;";
        $(this.rightNavButton).css("cursor", "pointer");
        this.rightContainer.appendChild(this.rightNavButton);
        this.pagNavList.appendChild(this.rightContainer);
        this.ensureButtonSafety();
        this.navDiv.appendChild(this.pagNavList);
        this.flagDiv.appendChild(this.flaggingPlace); // adds flaggingPlace to the flagDiv
        this.break = document.createElement("br");
        this.navDiv.appendChild(this.break);
        // render the question number jump buttons
        this.qNumList = document.createElement("ul");
        $(this.qNumList).attr("id", "pageNums");
        this.qNumWrapperList = document.createElement("ul");
        $(this.qNumWrapperList).addClass("pagination");
        var tmpLi, tmpA;
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            tmpLi = document.createElement("li");
            tmpA = document.createElement("a");
            tmpA.innerHTML = i + 1;
            $(tmpA).css("cursor", "pointer");
            if (i === 0) {
                $(tmpLi).addClass("active");
            }
            tmpLi.appendChild(tmpA);
            this.qNumWrapperList.appendChild(tmpLi);
        }
        this.qNumList.appendChild(this.qNumWrapperList);
        this.navDiv.appendChild(this.qNumList);
        this.navBtnListeners();
        this.flagBtnListener(); // listens for click on flag button
        $(this.flagButton).hide();
    }

    // when moving off of a question in an active exam:
    // 1. show that the question has been seen, or mark it broken if it is in error.
    // 2. check and log the current answer
    async navigateAway() {
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].state ==
            "broken_exam"
        ) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("broken");
        }
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].state ==
            "exam_ended"
        ) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("toolate");
        }
        if (
            this.renderedQuestionArray[this.currentQuestionIndex].question
                .isAnswered
        ) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("answered");
            await this.renderedQuestionArray[
                this.currentQuestionIndex
            ].question.checkCurrentAnswer();
            if (!this.done) {
                await this.renderedQuestionArray[
                    this.currentQuestionIndex
                ].question.logCurrentAnswer();
            }
        }
    }
    async handleNextPrev(event) {
        if (!this.taken) {
            await this.navigateAway();
        }
        var target = $(event.target).text();
        if (target.match(/Next/)) {
            // checks given text to match "Next"
            if ($(this.rightContainer).hasClass("disabled")) {
                return;
            }
            this.currentQuestionIndex++;
        } else if (target.match(/Prev/)) {
            // checks given text to match "Prev"
            if ($(this.leftContainer).hasClass("disabled")) {
                return;
            }
            this.currentQuestionIndex--;
        }
        await this.renderTimedQuestion();
        this.ensureButtonSafety();
        for (var i = 0; i < this.qNumList.childNodes.length; i++) {
            for (
                var j = 0;
                j < this.qNumList.childNodes[i].childNodes.length;
                j++
            ) {
                $(this.qNumList.childNodes[i].childNodes[j]).removeClass(
                    "active"
                );
            }
        }
        $(
            "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
        ).addClass("active");
        if (
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).hasClass("flagcolor")
        ) {
            // checking for class
            this.flagButton.innerHTML = "Unflag Question"; // changes text on button
        } else {
            this.flagButton.innerHTML = "Flag Question"; // changes text on button
        }
    }

    async handleFlag(event) {
        // called when flag button is clicked
        var target = $(event.target).text();
        if (target.match(/Flag Question/)) {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).addClass("flagcolor"); // class will change color of question block
            this.flagButton.innerHTML = "Unflag Question";
        } else {
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
            ).removeClass("flagcolor"); // will restore current color of question block
            this.flagButton.innerHTML = "Flag Question"; // also sets name back
        }
    }

    async handleNumberedNav(event) {
        if (!this.taken) {
            await this.navigateAway();
        }
        for (var i = 0; i < this.qNumList.childNodes.length; i++) {
            for (
                var j = 0;
                j < this.qNumList.childNodes[i].childNodes.length;
                j++
            ) {
                $(this.qNumList.childNodes[i].childNodes[j]).removeClass(
                    "active"
                );
            }
        }

        var target = $(event.target).text();
        let oldIndex = this.currentQuestionIndex;
        this.currentQuestionIndex = parseInt(target) - 1;
        if (this.currentQuestionIndex > this.renderedQuestionArray.length) {
            console.log(`Error: bad index for ${target}`);
            this.currentQuestionIndex = oldIndex;
        }
        $(
            "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")"
        ).addClass("active");
        if (
            $(
                "ul#pageNums > ul > li:eq(" + this.currentQuestionIndex + ")" // checking for flagcolor class
            ).hasClass("flagcolor")
        ) {
            this.flagButton.innerHTML = "Unflag Question";
        } else {
            this.flagButton.innerHTML = "Flag Question";
        }
        await this.renderTimedQuestion();
        this.ensureButtonSafety();
    }

    // set up events for navigation
    navBtnListeners() {
        // Next and Prev Listener
        this.pagNavList.addEventListener(
            "click",
            this.handleNextPrev.bind(this),
            false
        );

        // Numbered Listener
        this.qNumList.addEventListener(
            "click",
            this.handleNumberedNav.bind(this),
            false
        );
    }

    // set up event for flag
    flagBtnListener() {
        this.flaggingPlace.addEventListener(
            "click",
            this.handleFlag.bind(this), // calls this to take action
            false
        );
    }

    renderSubmitButton() {
        this.buttonContainer = document.createElement("div");
        $(this.buttonContainer).attr({
            style: "text-align:center",
        });
        this.finishButton = document.createElement("button");
        $(this.finishButton).attr({
            id: "finish",
            class: "btn btn-primary",
        });
        this.finishButton.textContent = "Finish Exam";
        this.finishButton.addEventListener(
            "click",
            async function () {
                let skipped =
                    this.renderedQuestionArray.filter((x) => !x.question.isAnswered).length;
                let skipstr = skipped > 0 ? `You have skipped ${skipped} question(s).` : "";
                if (
                    window.confirm(
                        `${skipstr} Clicking OK means you are ready to submit your answers and are finished with this assessment.`
                    )
                ) {
                    await this.finishAssessment();
                    $(this.flagButton).hide();
                }
            }.bind(this),
            false
        );
        this.controlDiv.appendChild(this.finishButton);
        $(this.finishButton).hide();
        this.timedDiv.appendChild(this.buttonContainer);
    }
    ensureButtonSafety() {
        if (this.currentQuestionIndex === 0) {
            if (this.renderedQuestionArray.length != 1) {
                $(this.rightContainer).removeClass("disabled");
            }
            $(this.leftContainer).addClass("disabled");
        }
        if (
            this.currentQuestionIndex >=
            this.renderedQuestionArray.length - 1
        ) {
            if (this.renderedQuestionArray.length != 1) {
                $(this.leftContainer).removeClass("disabled");
            }
            $(this.rightContainer).addClass("disabled");
        }
        if (
            this.currentQuestionIndex > 0 &&
            this.currentQuestionIndex < this.renderedQuestionArray.length - 1
        ) {
            $(this.rightContainer).removeClass("disabled");
            $(this.leftContainer).removeClass("disabled");
        }
    }
    renderFeedbackContainer() {
        this.scoreDiv = document.createElement("P");
        if (this.taken) {
            this.scoreDiv.innerHTML = "<h2>You have already taken this exam</h2>";
            this.scoreDiv.style.display = "block";
        } else {
            this.scoreDiv.id = this.divid + "results";
            this.scoreDiv.style.display = "none";
        }
        this.containerDiv.appendChild(this.scoreDiv);
    }

    createRenderedQuestionArray() {
        // this finds all the assess questions in this timed assessment
        // We need to make a list of all the questions up front so we can set up navigation
        // but we do not want to render the questions until the student has navigated
        // Also adds them to this.renderedQuestionArray

        // todo:  This needs to be updated to account for the runestone div wrapper.

        // To accommodate the selectquestion type -- which is async! we need to wrap
        // all of this in a promise, so that we don't continue to render the timed
        // exam until all of the questions have been realized.
        var opts;
        for (var i = 0; i < this.newChildren.length; i++) {
            var tmpChild = this.newChildren[i];
            opts = {
                state: "prepared",
                orig: tmpChild,
                question: {},
                useRunestoneServices: eBookConfig.useRunestoneServices,
                timed: true,
                assessmentTaken: this.taken,
                timedWrapper: this.divid,
                initAttempts: 0,
            };
            if ($(tmpChild).children("[data-component]").length > 0) {
                tmpChild = $(tmpChild).children("[data-component]")[0];
                opts.orig = tmpChild;
            }
            if ($(tmpChild).is("[data-component]")) {
                this.renderedQuestionArray.push(opts);
            }
        }
    }

    randomizeRQA() {
        var currentIndex = this.renderedQuestionArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.renderedQuestionArray[currentIndex];
            this.renderedQuestionArray[currentIndex] =
                this.renderedQuestionArray[randomIndex];
            this.renderedQuestionArray[randomIndex] = temporaryValue;
        }
    }

    async renderTimedQuestion() {
        if (this.currentQuestionIndex >= this.renderedQuestionArray.length) {
            // sometimes the user clicks in the event area for the qNumList
            // But misses a number in that case the text is the concatenation
            // of all the numbers in the list!
            return;
        }
        // check the renderedQuestionArray to see if it has been rendered.
        let opts = this.renderedQuestionArray[this.currentQuestionIndex];
        let currentQuestion;
        if (
            opts.state === "prepared" ||
            opts.state === "forreview" ||
            (opts.state === "broken_exam" && opts.initAttempts < 3)
        ) {
            let tmpChild = opts.orig;
            if ($(tmpChild).is("[data-component=selectquestion]")) {
                if (this.done && opts.state == "prepared") {
                    this.renderedQuestionArray[
                        this.currentQuestionIndex
                    ].state = "exam_ended";
                } else {
                    // SelectOne is async and will replace itself in this array with
                    // the actual selected question
                    opts.rqa = this.renderedQuestionArray;
                    let newq = new _selectquestion_js_selectone__WEBPACK_IMPORTED_MODULE_9__["default"](opts);
                    this.renderedQuestionArray[this.currentQuestionIndex] = {
                        question: newq,
                    };
                    try {
                        await newq.initialize();
                        if (opts.state == "broken_exam") {
                            // remove the broken class from this question if we get here.
                            $(
                                `ul#pageNums > ul > li:eq(${this.currentQuestionIndex})`
                            ).removeClass("broken");
                        }
                    } catch (e) {
                        opts.state = "broken_exam";
                        this.renderedQuestionArray[this.currentQuestionIndex] =
                            opts;
                        console.log(
                            `Error initializing question: Details ${e}`
                        );
                    }
                }
            } else if ($(tmpChild).is("[data-component]")) {
                let componentKind = $(tmpChild).data("component");
                this.renderedQuestionArray[this.currentQuestionIndex] = {
                    question: window.component_factory[componentKind](opts),
                    state: opts.state,
                };
            }
        } else if (opts.state === "broken_exam") {
            return;
        }

        currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        if (opts.state === "forreview") {
            await currentQuestion.component_ready_promise;
            await currentQuestion.checkCurrentAnswer();
            currentQuestion.renderFeedback();
            currentQuestion.disableInteraction();
        }

        if (!this.visited.includes(this.currentQuestionIndex)) {
            this.visited.push(this.currentQuestionIndex);
            if (
                this.visited.length === this.renderedQuestionArray.length &&
                !this.done
            ) {
                $(this.finishButton).show();
            }
        }

        if (currentQuestion.containerDiv) {
            if (
                currentQuestion.containerDiv.classList.contains("runestone") ==
                false
            ) {
                currentQuestion.containerDiv.classList.add("runestone");
            }
            $(this.switchDiv).replaceWith(currentQuestion.containerDiv);
            this.switchDiv = currentQuestion.containerDiv;
        }

        // If the timed component has listeners, those might need to be reinitialized
        // This flag will only be set in the elements that need it--it will be undefined in the others and thus evaluate to false
        if (currentQuestion.needsReinitialization) {
            currentQuestion.reinitializeListeners(this.taken);
        }
    }

    /*=================================
    === Timer and control Functions ===
    =================================*/
    handlePrevAssessment() {
        $(this.startBtn).hide();
        $(this.pauseBtn).attr("disabled", true);
        $(this.finishButton).attr("disabled", true);
        this.running = 0;
        this.done = 1;
        // showFeedback sand showResults should both be true before we show the
        // questions and their state of correctness.
        if (this.showResults && this.showFeedback) {
            $(this.timedDiv).show();
            this.restoreAnsweredQuestions(); // do not log these results
        } else {
            $(this.pauseBtn).hide();
            $(this.timerContainer).hide();
        }
    }
    startAssessment() {
        if (!this.taken) {
            $("#relations-next").hide(); // hide the next page button for now
            $("#relations-prev").hide(); // hide the previous button for now
            $(this.startBtn).hide();
            $(this.pauseBtn).attr("disabled", false);
            if (this.running === 0 && this.paused === 0) {
                this.running = 1;
                this.lastTime = Date.now();
                $(this.timedDiv).show();
                this.increment();
                this.logBookEvent({
                    event: "timedExam",
                    act: "start",
                    div_id: this.divid,
                });
                var timeStamp = new Date();
                var storageObj = {
                    answer: [0, 0, this.renderedQuestionArray.length, 0],
                    timestamp: timeStamp,
                };
                localStorage.setItem(
                    this.localStorageKey(),
                    JSON.stringify(storageObj)
                );
            }
            $(window).on(
                "beforeunload",
                function (event) {
                    // this actual value gets ignored by newer browsers
                    if (this.done) {
                        return;
                    }
                    event.preventDefault();
                    event.returnValue =
                        "Are you sure you want to leave?  Your work will be lost! And you will need your instructor to reset the exam!";
                    return "Are you sure you want to leave?  Your work will be lost!";
                }.bind(this)
            );
            window.addEventListener(
                "pagehide",
                async function (event) {
                    if (!this.done) {
                        await this.finishAssessment();
                        console.log("Exam exited by leaving page");
                    }
                }.bind(this)
            );
        } else {
            this.handlePrevAssessment();
        }
    }
    pauseAssessment() {
        if (this.done === 0) {
            if (this.running === 1) {
                this.logBookEvent({
                    event: "timedExam",
                    act: "pause",
                    div_id: this.divid,
                });
                this.running = 0;
                this.paused = 1;
                this.pauseBtn.innerHTML = "Resume";
                $(this.timedDiv).hide();
            } else {
                this.logBookEvent({
                    event: "timedExam",
                    act: "resume",
                    div_id: this.divid,
                });
                this.running = 1;
                this.paused = 0;
                this.increment();
                this.pauseBtn.innerHTML = "Pause";
                $(this.timedDiv).show();
            }
        }
    }

    showTime() {
        if (this.showTimer) {
            var mins = Math.floor(this.timeLimit / 60);
            var secs = Math.floor(this.timeLimit) % 60;
            var minsString = mins;
            var secsString = secs;
            if (mins < 10) {
                minsString = "0" + mins;
            }
            if (secs < 10) {
                secsString = "0" + secs;
            }
            var beginning = "Time Remaining    ";
            if (!this.limitedTime) {
                beginning = "Time Taken    ";
            }
            var timeString = beginning + minsString + ":" + secsString;
            if (this.done || this.taken) {
                var minutes = Math.floor(this.timeTaken / 60);
                var seconds = Math.floor(this.timeTaken % 60);
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                timeString = "Time taken: " + minutes + ":" + seconds;
            }
            this.timerContainer.innerHTML = timeString;
            var timeTips = document.getElementsByClassName("timeTip");
            for (var i = 0; i <= timeTips.length - 1; i++) {
                timeTips[i].title = timeString;
            }
        } else {
            $(this.timerContainer).hide();
        }
    }

    increment() {
        // if running (not paused) and not taken
        if (this.running === 1 && !this.taken) {
            setTimeout(
                function () {
                    // When a browser loses focus, setTimeout may not be called on the
                    // schedule expected.  Browsers are free to save power by lengthening
                    // the interval to some longer time.  So we cannot just subtract 1
                    // from the timeLimit we need to measure the elapsed time from the last
                    // call to the current call and subtract that number of seconds.
                    let currentTime = Date.now();
                    if (this.limitedTime) {
                        // If there's a time limit, count down to 0
                        this.timeLimit =
                            this.timeLimit -
                            Math.floor((currentTime - this.lastTime) / 1000);
                    } else {
                        // Else count up to keep track of how long it took to complete
                        this.timeLimit =
                            this.timeLimit +
                            Math.floor((currentTime - this.lastTime) / 1000);
                    }
                    this.lastTime = currentTime;
                    localStorage.setItem(
                        eBookConfig.email + ":" + this.divid + "-time",
                        this.timeLimit
                    );
                    this.showTime();
                    if (this.timeLimit > 0) {
                        this.increment();
                        // ran out of time
                    } else {
                        $(this.startBtn).attr({
                            disabled: "true",
                        });
                        $(this.finishButton).attr({
                            disabled: "true",
                        });
                        this.running = 0;
                        this.done = 1;
                        if (!this.taken) {
                            this.taken = true;
                            // embed the message in the page -- an alert actually prevents
                            // the answers from being submitted and if a student closes their
                            // laptop then the answers will not be submitted ever!  Even when they
                            // reopen the laptop their session cookie is likely invalid.
                            let mess = document.createElement("h1");
                            mess.innerHTML =
                                "Sorry but you ran out of time. Your answers are being submitted";
                            this.controlDiv.appendChild(mess);
                            this.finishAssessment();
                        }
                    }
                }.bind(this),
                1000
            );
        }
    }

    styleExamElements() {
        // Checks if this exam has been taken before
        $(this.timerContainer).css({
            width: "50%",
            margin: "0 auto",
            "background-color": "#DFF0D8",
            "text-align": "center",
            border: "2px solid #DFF0D8",
            "border-radius": "25px",
        });
        $(this.scoreDiv).css({
            width: "50%",
            margin: "0 auto",
            "background-color": "#DFF0D8",
            "text-align": "center",
            border: "2px solid #DFF0D8",
            "border-radius": "25px",
        });
        $(".tooltipTime").css({
            margin: "0",
            padding: "0",
            "background-color": "black",
            color: "white",
        });
    }

    async finishAssessment() {
        $("#relations-next").show(); // show the next page button for now
        $("#relations-prev").show(); // show the previous button for now
        if (!this.showFeedback) {
            // bje - changed from showResults
            $(this.timedDiv).hide();
            $(this.pauseBtn).hide();
            $(this.timerContainer).hide();
        }
        this.findTimeTaken();
        this.running = 0;
        this.done = 1;
        this.taken = 1;
        await this.finalizeProblems();
        this.checkScore();
        this.displayScore();
        this.storeScore();
        this.logScore();
        $(this.pauseBtn).attr("disabled", true);
        this.finishButton.disabled = true;
        $(window).off("beforeunload");
        // turn off the pagehide listener
        let assignment_id = this.divid;
        setTimeout(function () {
            jQuery.ajax({
                url: eBookConfig.app + "/assignments/student_autograde",
                type: "POST",
                dataType: "JSON",
                data: {
                    assignment_id: assignment_id,
                    is_timed: true,
                },
                success: function (retdata) {
                    if (retdata.success == false) {
                        console.log(retdata.message);
                    } else {
                        console.log("Autograder completed");
                    }
                },
            });
        }, 2000);
    }

    // finalizeProblems
    // ----------------
    async finalizeProblems() {
        // Because we have submitted each question as we navigate we only need to
        // send the final version of the question the student is on when they press the
        // finish exam button.

        var currentQuestion =
            this.renderedQuestionArray[this.currentQuestionIndex].question;
        await currentQuestion.checkCurrentAnswer();
        await currentQuestion.logCurrentAnswer();
        currentQuestion.renderFeedback();
        currentQuestion.disableInteraction();

        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            let currentQuestion = this.renderedQuestionArray[i];
            // set the state to forreview so we know that feedback may be appropriate
            if (currentQuestion.state !== "broken_exam") {
                currentQuestion.state = "forreview";
                currentQuestion.question.disableInteraction();
            }
        }

        if (!this.showFeedback) {
            this.hideTimedFeedback();
        }
    }

    // restoreAnsweredQuestions
    // ------------------------
    restoreAnsweredQuestions() {
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var currentQuestion = this.renderedQuestionArray[i];
            if (currentQuestion.state === "prepared") {
                currentQuestion.state = "forreview";
            }
        }
    }

    // hideTimedFeedback
    // -----------------
    hideTimedFeedback() {
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var currentQuestion = this.renderedQuestionArray[i].question;
            currentQuestion.hideFeedback();
        }
    }

    // checkScore
    // ----------
    // This is a simple all or nothing score of one point per question for
    // that includes our best guess if a question was skipped.
    checkScore() {
        this.correctStr = "";
        this.skippedStr = "";
        this.incorrectStr = "";
        // Gets the score of each problem
        for (var i = 0; i < this.renderedQuestionArray.length; i++) {
            var correct =
                this.renderedQuestionArray[i].question.checkCorrectTimed();
            if (correct == "T") {
                this.score++;
                this.correctStr = this.correctStr + (i + 1) + ", ";
            } else if (correct == "F") {
                this.incorrect++;
                this.incorrectStr = this.incorrectStr + (i + 1) + ", ";
            } else if (correct === null || correct === "I") {
                this.skipped++;
                this.skippedStr = this.skippedStr + (i + 1) + ", ";
            } else {
                // ignored question; just do nothing
            }
        }
        // remove extra comma and space at end if any
        if (this.correctStr.length > 0)
            this.correctStr = this.correctStr.substring(
                0,
                this.correctStr.length - 2
            );
        else this.correctStr = "None";
        if (this.skippedStr.length > 0)
            this.skippedStr = this.skippedStr.substring(
                0,
                this.skippedStr.length - 2
            );
        else this.skippedStr = "None";
        if (this.incorrectStr.length > 0)
            this.incorrectStr = this.incorrectStr.substring(
                0,
                this.incorrectStr.length - 2
            );
        else this.incorrectStr = "None";
    }
    findTimeTaken() {
        if (this.limitedTime) {
            this.timeTaken = this.startingTime - this.timeLimit;
        } else {
            this.timeTaken = this.timeLimit;
        }
    }
    storeScore() {
        var storage_arr = [];
        storage_arr.push(
            this.score,
            this.correctStr,
            this.incorrect,
            this.incorrectStr,
            this.skipped,
            this.skippedStr,
            this.timeTaken
        );
        var timeStamp = new Date();
        var storageObj = JSON.stringify({
            answer: storage_arr,
            timestamp: timeStamp,
        });
        localStorage.setItem(this.localStorageKey(), storageObj);
    }
    // _`timed exam endpoint parameters`
    //----------------------------------
    logScore() {
        this.logBookEvent({
            event: "timedExam",
            act: "finish",
            div_id: this.divid,
            correct: this.score,
            incorrect: this.incorrect,
            skipped: this.skipped,
            time_taken: this.timeTaken,
        });
    }
    shouldUseServer(data) {
        // We override the RunestoneBase version because there is no "correct" attribute, and there are 2 possible localStorage schemas
        // --we also want to default to local storage because it contains more information specifically which questions are correct, incorrect, and skipped.
        var storageDate;
        if (localStorage.length === 0) return true;
        var storageObj = localStorage.getItem(this.localStorageKey());
        if (storageObj === null) return true;
        try {
            var storedData = JSON.parse(storageObj).answer;
            if (storedData.length == 4) {
                if (
                    data.correct == storedData[0] &&
                    data.incorrect == storedData[1] &&
                    data.skipped == storedData[2] &&
                    data.timeTaken == storedData[3]
                )
                    return true;
            } else if (storedData.length == 7) {
                if (
                    data.correct == storedData[0] &&
                    data.incorrect == storedData[2] &&
                    data.skipped == storedData[4] &&
                    data.timeTaken == storedData[6]
                ) {
                    return false; // In this case, because local storage has more info, we want to use that if it's consistent
                }
            }
            storageDate = new Date(JSON.parse(storageObj[1]).timestamp);
        } catch (err) {
            // error while parsing; likely due to bad value stored in storage
            console.log(err.message);
            localStorage.removeItem(this.localStorageKey());
            return true;
        }
        var serverDate = new Date(data.timestamp);
        if (serverDate < storageDate) {
            this.logScore();
            return false;
        }
        return true;
    }

    checkLocalStorage() {
        var len = localStorage.length;
        if (len > 0) {
            if (localStorage.getItem(this.localStorageKey()) !== null) {
                this.taken = 1;
                this.restoreAnswers("");
            } else {
                this.taken = 0;
            }
        } else {
            this.taken = 0;
        }
    }
    async restoreAnswers(data) {
        this.taken = 1;
        var tmpArr;
        if (data === "") {
            let error = false;
            let storageObj;
            try {
                storageObj = JSON.parse(
                    localStorage.getItem(this.localStorageKey())
                );
                tmpArr = storageObj.answer;
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(`Error parsing stored Timed data for ${this.divid}: ${err.message}`);
                error = true;
            }
            if (error || storageObj.timestamp < eBookConfig.termStartDate) {
                localStorage.removeItem(this.localStorageKey());
                this.taken = 0;
                return;
            }
        } else {
            // Parse results from the database
            tmpArr = [
                parseInt(data.correct),
                parseInt(data.incorrect),
                parseInt(data.skipped),
                parseInt(data.time_taken),
                data.reset,
            ];
            this.setLocalStorage(tmpArr);
        }
        if (tmpArr.length == 1) {
            // Exam was previously reset
            this.reset = true;
            this.taken = 0;
            return;
        }
        if (tmpArr.length == 4) {
            // Accidental Reload OR Database Entry
            this.score = tmpArr[0];
            this.incorrect = tmpArr[1];
            this.skipped = tmpArr[2];
            this.timeTaken = tmpArr[3];
        } else if (tmpArr.length == 5) {
            this.score = tmpArr[0];
            this.incorrect = tmpArr[1];
            this.skipped = tmpArr[2];
            this.timeTaken = tmpArr[3];
        } else if (tmpArr.length == 7) {
            // Loaded Completed Exam
            this.score = tmpArr[0];
            this.correctStr = tmpArr[1];
            this.incorrect = tmpArr[2];
            this.incorrectStr = tmpArr[3];
            this.skipped = tmpArr[4];
            this.skippedStr = tmpArr[5];
            this.timeTaken = tmpArr[6];
        } else {
            // Set localStorage in case of "accidental" reload
            this.score = 0;
            this.incorrect = 0;
            this.skipped = this.renderedQuestionArray.length;
            this.timeTaken = 0;
        }
        if (this.taken) {
            if (this.skipped === this.renderedQuestionArray.length) {
                this.showFeedback = false;
            }
            this.handlePrevAssessment();
        }
        await this.renderTimedQuestion();
        this.displayScore();
        this.showTime();
    }
    setLocalStorage(parsedData) {
        var timeStamp = new Date();
        var storageObj = {
            answer: parsedData,
            timestamp: timeStamp,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }
    displayScore() {
        if (this.showResults) {
            var scoreString = "";
            var numQuestions;
            var percentCorrect;
            // if we have some information
            if (
                this.correctStr.length > 0 ||
                this.incorrectStr.length > 0 ||
                this.skippedStr.length > 0
            ) {
                scoreString = `Num Correct: ${this.score}. Questions: ${this.correctStr}<br>Num Wrong: ${this.incorrect}. Questions: ${this.incorrectStr}<br>Num Skipped: ${this.skipped}. Questions: ${this.skippedStr}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString +=
                    "Percent Correct: " + percentCorrect.toFixed(2) + "%";
                $(this.scoreDiv).html(scoreString);
                this.scoreDiv.style.display = "block";
            } else {
                scoreString = `Num Correct: ${this.score}<br>Num Wrong: ${this.incorrect}<br>Num Skipped: ${this.skipped}<br>`;
                numQuestions = this.score + this.incorrect + this.skipped;
                percentCorrect = (this.score / numQuestions) * 100;
                scoreString +=
                    "Percent Correct: " + percentCorrect.toFixed(2) + "%";
                $(this.scoreDiv).html(scoreString);
                this.scoreDiv.style.display = "block";
            }
            this.highlightNumberedList();
        } else {
            $(this.scoreDiv).html(
                "Thank you for taking the exam.  Your answers have been recorded."
            );
            this.scoreDiv.style.display = "block";
        }
    }
    highlightNumberedList() {
        var correctCount = this.correctStr;
        var incorrectCount = this.incorrectStr;
        var skippedCount = this.skippedStr;
        correctCount = correctCount.replace(/ /g, "").split(",");
        incorrectCount = incorrectCount.replace(/ /g, "").split(",");
        skippedCount = skippedCount.replace(/ /g, "").split(",");
        $(function () {
            var numberedBtns = $("ul#pageNums > ul > li");
            if (numberedBtns.hasClass("answered")) {
                numberedBtns.removeClass("answered");
            }
            for (var i = 0; i < correctCount.length; i++) {
                var test = parseInt(correctCount[i]) - 1;
                numberedBtns
                    .eq(parseInt(correctCount[i]) - 1)
                    .addClass("correctCount");
            }
            for (var j = 0; j < incorrectCount.length; j++) {
                numberedBtns
                    .eq(parseInt(incorrectCount[j]) - 1)
                    .addClass("incorrectCount");
            }
            for (var k = 0; k < skippedCount.length; k++) {
                numberedBtns
                    .eq(parseInt(skippedCount[k]) - 1)
                    .addClass("skippedCount");
            }
        });
    }
}

/*=======================================================
=== Function that calls the constructors on page load ===
=======================================================*/
$(document).on("runestone:login-complete", function () {
    $("[data-component=timedAssessment]").each(function (index) {
        window.componentMap[this.id] = new Timed({
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        });
    });
});


/***/ }),

/***/ 57724:
/*!****************************************!*\
  !*** ./runestone/timed/css/timed.less ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 89296:
/*!*************************************************!*\
  !*** ./runestone/matching/js/timed_matching.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedMatching)
/* harmony export */ });
/* harmony import */ var _matching_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./matching.js */ 17352);


class TimedMatching extends _matching_js__WEBPACK_IMPORTED_MODULE_0__.MatchingProblem {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.containerDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }

    hideButtons() {
        this.gradeBtn.style.display = "none";
        this.helpBtn.style.display = "none";
    }

    renderTimedIcon(component) {
        // renders the clock icon on timed components. The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        timeIcon.src = "../_static/clock.png";
        timeIcon.style.width = "15px";
        timeIcon.style.height = "15px";

        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        component.prepend(timeIconDiv);
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
        this.connList.style.display = "none";
    }

    reinitializeListeners() {
        // maybe need to reinitialize the listeners
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.matching = function (opts) {
    if (opts.timed) {
        return new TimedMatching(opts);
    }
    return new _matching_js__WEBPACK_IMPORTED_MODULE_0__.MatchingProblem(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3RpbWVkX2pzX3RpbWVkX2pzLXJ1bmVzdG9uZV9kcmFnbmRyb3BfY3NzX2RyYWduZHJvcF9sZXNzLXJ1bmVzdG9uZV9tYXRjaGluZ19jc3NfbWF0LTI3MDlhYy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUVnRDtBQUNWO0FBQ0Q7QUFDdUI7QUFDaEI7QUFDYztBQUNYO0FBQ0E7QUFDSTtBQUNOO0FBQy9COztBQUUzQjtBQUNlLG9CQUFvQixtRUFBYTtBQUNoRDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0VBQStFO0FBQy9FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsOEJBQThCO0FBQ3REO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Ysb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCx3Q0FBd0M7QUFDeEMsbUVBQW1FLFdBQVcsSUFBSSxZQUFZO0FBQzlGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxXQUFXLGVBQWUsZ0JBQWdCLGlCQUFpQixlQUFlLGVBQWUsa0JBQWtCLG1CQUFtQixhQUFhLGVBQWUsZ0JBQWdCO0FBQ3hOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCw4Q0FBOEMsV0FBVyxpQkFBaUIsZUFBZSxtQkFBbUIsYUFBYTtBQUN6SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0Qix5QkFBeUI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwyQkFBMkI7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIseUJBQXlCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsQ0FBQzs7Ozs7Ozs7Ozs7O0FDMTBDRDs7Ozs7Ozs7Ozs7Ozs7OztBQ0E4Qzs7QUFFL0IsNEJBQTRCLHlEQUFlO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHlEQUFlO0FBQzlCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS90aW1lZC9qcy90aW1lZC5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3RpbWVkL2Nzcy90aW1lZC5sZXNzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWF0Y2hpbmcvanMvdGltZWRfbWF0Y2hpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT09ICAgICAgTWFzdGVyIHRpbWVkLmpzICAgICA9PT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09ICAgICB0aGUgUnVuZXN0b25lIHRpbWVkIGNvbXBvbmVudC4gICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgQnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgIEtpcmJ5IE9sc29uICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgIDYvMTEvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IFRpbWVkRklUQiBmcm9tIFwiLi4vLi4vZml0Yi9qcy90aW1lZGZpdGIuanNcIjtcbmltcG9ydCBUaW1lZE1DIGZyb20gXCIuLi8uLi9tY2hvaWNlL2pzL3RpbWVkbWMuanNcIjtcbmltcG9ydCBUaW1lZFNob3J0QW5zd2VyIGZyb20gXCIuLi8uLi9zaG9ydGFuc3dlci9qcy90aW1lZF9zaG9ydGFuc3dlci5qc1wiO1xuaW1wb3J0IEFDRmFjdG9yeSBmcm9tIFwiLi4vLi4vYWN0aXZlY29kZS9qcy9hY2ZhY3RvcnkuanNcIjtcbmltcG9ydCBUaW1lZENsaWNrYWJsZUFyZWEgZnJvbSBcIi4uLy4uL2NsaWNrYWJsZUFyZWEvanMvdGltZWRjbGlja2FibGVcIjtcbmltcG9ydCBUaW1lZERyYWdORHJvcCBmcm9tIFwiLi4vLi4vZHJhZ25kcm9wL2pzL3RpbWVkZG5kLmpzXCI7XG5pbXBvcnQgVGltZWRQYXJzb25zIGZyb20gXCIuLi8uLi9wYXJzb25zL2pzL3RpbWVkcGFyc29ucy5qc1wiO1xuaW1wb3J0IFRpbWVkTWF0Y2hpbmcgZnJvbSBcIi4uLy4uL21hdGNoaW5nL2pzL3RpbWVkX21hdGNoaW5nLmpzXCI7XG5pbXBvcnQgU2VsZWN0T25lIGZyb20gXCIuLi8uLi9zZWxlY3RxdWVzdGlvbi9qcy9zZWxlY3RvbmVcIjtcbmltcG9ydCBcIi4uL2Nzcy90aW1lZC5sZXNzXCI7XG5cbi8vIFRpbWVkIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZCBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnO1xuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZzsgLy8gdGhlIGVudGlyZSBlbGVtZW50IG9mIHRoaXMgdGltZWQgYXNzZXNzbWVudCBhbmQgYWxsIG9mIGl0cyBjaGlsZHJlblxuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlcztcbiAgICAgICAgdGhpcy52aXNpdGVkID0gW107XG4gICAgICAgIHRoaXMudGltZUxpbWl0ID0gMDtcbiAgICAgICAgdGhpcy5saW1pdGVkVGltZSA9IGZhbHNlO1xuICAgICAgICBpZiAoIWlzTmFOKCQodGhpcy5vcmlnRWxlbSkuZGF0YShcInRpbWVcIikpKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVMaW1pdCA9IHBhcnNlSW50KCQodGhpcy5vcmlnRWxlbSkuZGF0YShcInRpbWVcIiksIDEwKSAqIDYwOyAvLyB0aW1lIGluIHNlY29uZHMgdG8gY29tcGxldGUgdGhlIGV4YW1cbiAgICAgICAgICAgIHRoaXMuc3RhcnRpbmdUaW1lID0gdGhpcy50aW1lTGltaXQ7XG4gICAgICAgICAgICB0aGlzLmxpbWl0ZWRUaW1lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNob3dGZWVkYmFjayA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtbm8tZmVlZGJhY2tcIikpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd0ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgZm9yIGF0dHJpYnV0ZSBkYXRhLXNob3ctZmVlZGJhY2sgPSB5ZXNcbiAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1zaG93LWZlZWRiYWNrXCIpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNob3ctZmVlZGJhY2tcIikgPT09IFwieWVzXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dGZWVkYmFjayA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0ZlZWRiYWNrID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLXJlc3VsdFwiKSkge1xuICAgICAgICAgICAgdGhpcy5zaG93UmVzdWx0cyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmFuZG9tID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtcmFuZG9tXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaG93VGltZXIgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLXRpbWVyXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dUaW1lciA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtdGltZXJcIikpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtdGltZXJcIikgPT09IFwieWVzXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1RpbWVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93VGltZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZ1bGx3aWR0aCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWZ1bGx3aWR0aFwiKSkge1xuICAgICAgICAgICAgdGhpcy5mdWxsd2lkdGggPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm9wYXVzZSA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLW5vLXBhdXNlXCIpKSB7XG4gICAgICAgICAgICB0aGlzLm5vcGF1c2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmhhc0F0dHJpYnV0ZShcImRhdGEtcGF1c2VcIikpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImRhdGEtcGF1c2VcIikgPT09IFwieWVzXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5vcGF1c2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub3BhdXNlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlQm9va0NvbmZpZy5lbmFibGVTY3JhdGNoQUMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSAwO1xuICAgICAgICB0aGlzLmRvbmUgPSAwO1xuICAgICAgICB0aGlzLnRha2VuID0gMDtcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gMDtcbiAgICAgICAgdGhpcy5jb3JyZWN0U3RyID0gXCJcIjtcbiAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIgPSBcIlwiO1xuICAgICAgICB0aGlzLnNraXBwZWRTdHIgPSBcIlwiO1xuICAgICAgICB0aGlzLnNraXBwZWQgPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gMDsgLy8gV2hpY2ggcXVlc3Rpb24gaXMgY3VycmVudGx5IGRpc3BsYXlpbmcgb24gdGhlIHBhZ2VcbiAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkgPSBbXTsgLy8gbGlzdCBvZiBhbGwgcHJvYmxlbXNcbiAgICAgICAgdGhpcy5nZXROZXdDaGlsZHJlbigpO1xuICAgICAgICAvLyBPbmUgc21hbGwgc3RlcCB0byBlbGltaW5hdGUgc3R1ZGVudHMgZnJvbSBkb2luZyB2aWV3IHNvdXJjZVxuICAgICAgICAvLyB0aGlzIHdvbid0IHN0b3AgYW55b25lIHdpdGggZGV0ZXJtaW5hdGlvbiBidXQgbWF5IHByZXZlbnQgY2FzdWFsIHBlZWtpbmdcbiAgICAgICAgaWYgKCFlQm9va0NvbmZpZy5lbmFibGVEZWJ1Zykge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5vbmNvbnRleHRtZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja0Fzc2Vzc21lbnRTdGF0dXMoKS50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZWRBc3Nlc3MoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldE5ld0NoaWxkcmVuKCkge1xuICAgICAgICB0aGlzLm5ld0NoaWxkcmVuID0gW107XG4gICAgICAgIGxldCBydW5lc3RvbmVDaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvckFsbChcIi5ydW5lc3RvbmVcIik7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVuZXN0b25lQ2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubmV3Q2hpbGRyZW4ucHVzaChydW5lc3RvbmVDaGlsZHJlbltpXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBjaGVja0Fzc2Vzc21lbnRTdGF0dXMoKSB7XG4gICAgICAgIC8vIEhhcyB0aGUgdXNlciB0YWtlbiB0aGlzIGV4YW0/ICBJbnF1aXJpbmcgbWluZHMgd2FudCB0byBrbm93XG4gICAgICAgIC8vIElmIGEgdXNlciBoYXMgbm90IHRha2VuIHRoaXMgZXhhbSB0aGVuIHdlIHdhbnQgdG8gbWFrZSBzdXJlXG4gICAgICAgIC8vIHRoYXQgaWYgYSBxdWVzdGlvbiBoYXMgYmVlbiBzZWVuIGJ5IHRoZSBzdHVkZW50IGJlZm9yZSB3ZSBkb1xuICAgICAgICAvLyBub3QgcG9wdWxhdGUgcHJldmlvdXMgYW5zd2Vycy5cbiAgICAgICAgbGV0IHNlbmRJbmZvID0ge1xuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgY291cnNlX25hbWU6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc29sZS5sb2coc2VuZEluZm8pO1xuICAgICAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXG4gICAgICAgICAgICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvdG9va1RpbWVkQXNzZXNzbWVudGAsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzZW5kSW5mbyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgICAgICBkYXRhID0gZGF0YS5kZXRhaWw7XG4gICAgICAgICAgICB0aGlzLnRha2VuID0gZGF0YS50b29rQXNzZXNzbWVudDtcbiAgICAgICAgICAgIHRoaXMuYXNzZXNzbWVudFRha2VuID0gdGhpcy50YWtlbjtcbiAgICAgICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJkb25lIHdpdGggY2hlY2sgc3RhdHVzXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5hc3Nlc3NtZW50VGFrZW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBHZW5lcmF0aW5nIG5ldyBUaW1lZCBIVE1MID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGFzeW5jIHJlbmRlclRpbWVkQXNzZXNzKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlbmRlcmluZyB0aW1lZCBcIik7XG4gICAgICAgIC8vIGNyZWF0ZSByZW5kZXJlZFF1ZXN0aW9uQXJyYXkgcmV0dXJucyBhIHByb21pc2VcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5jcmVhdGVSZW5kZXJlZFF1ZXN0aW9uQXJyYXkoKTtcbiAgICAgICAgaWYgKHRoaXMucmFuZG9tKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbWl6ZVJRQSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyQ29udGFpbmVyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZXIoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJDb250cm9sQnV0dG9ucygpO1xuICAgICAgICAvLyBJZiB3ZSBkZWNpZGUgdG8gZGlzYWJsZSBjdXQvY29weS9wYXN0ZSwgdW5jb21tZW50IHRoZSBsaW5lIGJlbG93ICAgICAgICBcbiAgICAgICAgLy8gdGhpcy5kaXNhYmxlQ3V0Q29weVBhc3RlKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMudGltZWREaXYpOyAvLyBUaGlzIGNhbid0IGJlIGFwcGVuZGVkIGluIHJlbmRlckNvbnRhaW5lciBiZWNhdXNlIHRoZW4gaXQgcmVuZGVycyBhYm92ZSB0aGUgdGltZXIgYW5kIGNvbnRyb2wgYnV0dG9ucy5cbiAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCA+IDEpIHRoaXMucmVuZGVyTmF2Q29udHJvbHMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJTdWJtaXRCdXR0b24oKTtcbiAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFja0NvbnRhaW5lcigpO1xuICAgICAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIC8vIFJlcGxhY2UgaW50ZXJtZWRpYXRlIEhUTUwgd2l0aCByZW5kZXJlZCBIVE1MXG4gICAgICAgICQodGhpcy5vcmlnRWxlbSkucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICAvLyBjaGVjayBpZiBhbHJlYWR5IHRha2VuIGFuZCBpZiBzbyBzaG93IHJlc3VsdHNcbiAgICAgICAgdGhpcy5zdHlsZUV4YW1FbGVtZW50cygpOyAvLyByZW5hbWUgdG8gcmVuZGVyUG9zc2libGVSZXN1bHRzXG4gICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJ0aW1lZEV4YW1cIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZGlzYWJsZUN1dENvcHlQYXN0ZSgpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImN1dFwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNvcHlcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZW5kZXJDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gY29udGFpbmVyIGZvciB0aGUgZW50aXJlIFRpbWVkIENvbXBvbmVudFxuICAgICAgICBpZiAodGhpcy5mdWxsd2lkdGgpIHtcbiAgICAgICAgICAgIC8vIGFsbG93IHRoZSBjb250YWluZXIgdG8gZmlsbCB0aGUgd2lkdGggLSBiYXJiXG4gICAgICAgICAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hdHRyKHtcbiAgICAgICAgICAgICAgICBzdHlsZTogXCJtYXgtd2lkdGg6bm9uZVwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZS1zcGhpbnhcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy50aW1lZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIGRpdiB0aGF0IHdpbGwgaG9sZCB0aGUgcXVlc3Rpb25zIGZvciB0aGUgdGltZWQgYXNzZXNzbWVudFxuICAgICAgICB0aGlzLm5hdkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIEZvciBuYXZpZ2F0aW9uIGNvbnRyb2xcbiAgICAgICAgJCh0aGlzLm5hdkRpdikuYXR0cih7XG4gICAgICAgICAgICBzdHlsZTogXCJ0ZXh0LWFsaWduOmNlbnRlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5mbGFnRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gZGl2IHRoYXQgd2lsbCBob2xkIHRoZSBcIkZsYWcgUXVlc3Rpb25cIiBidXR0b25cbiAgICAgICAgJCh0aGlzLmZsYWdEaXYpLmF0dHIoe1xuICAgICAgICAgICAgc3R5bGU6IFwidGV4dC1hbGlnbjogY2VudGVyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN3aXRjaENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJzd2l0Y2hjb250YWluZXJcIik7XG4gICAgICAgIHRoaXMuc3dpdGNoRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTsgLy8gaXMgcmVwbGFjZWQgYnkgdGhlIHF1ZXN0aW9uc1xuICAgICAgICB0aGlzLnRpbWVkRGl2LmFwcGVuZENoaWxkKHRoaXMubmF2RGl2KTtcbiAgICAgICAgdGhpcy50aW1lZERpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdEaXYpOyAvLyBhZGQgZmxhZ0RpdiB0byB0aW1lZERpdiwgd2hpY2ggaG9sZHMgY29tcG9uZW50cyBmb3IgbmF2aWdhdGlvbiBhbmQgcXVlc3Rpb25zIGZvciB0aW1lZCBhc3Nlc3NtZW50XG4gICAgICAgIHRoaXMudGltZWREaXYuYXBwZW5kQ2hpbGQodGhpcy5zd2l0Y2hDb250YWluZXIpO1xuICAgICAgICB0aGlzLnN3aXRjaENvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnN3aXRjaERpdik7XG4gICAgICAgICQodGhpcy50aW1lZERpdikuYXR0cih7XG4gICAgICAgICAgICBpZDogXCJ0aW1lZF9UZXN0XCIsXG4gICAgICAgICAgICBzdHlsZTogXCJkaXNwbGF5Om5vbmVcIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZXIoKSB7XG4gICAgICAgIHRoaXMud3JhcHBlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMudGltZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdGhpcy53cmFwcGVyRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiLXN0YXJ0V3JhcHBlclwiO1xuICAgICAgICB0aGlzLnRpbWVyQ29udGFpbmVyLmlkID0gdGhpcy5kaXZpZCArIFwiLW91dHB1dFwiO1xuICAgICAgICB0aGlzLndyYXBwZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy50aW1lckNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuc2hvd1RpbWUoKTtcbiAgICB9XG5cbiAgICByZW5kZXJDb250cm9sQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgJCh0aGlzLmNvbnRyb2xEaXYpLmF0dHIoe1xuICAgICAgICAgICAgaWQ6IFwiY29udHJvbHNcIixcbiAgICAgICAgICAgIHN0eWxlOiBcInRleHQtYWxpZ246IGNlbnRlclwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zdGFydEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMucGF1c2VCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuc3RhcnRCdG4pLmF0dHIoe1xuICAgICAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1zdWNjZXNzXCIsXG4gICAgICAgICAgICBpZDogXCJzdGFydFwiLFxuICAgICAgICAgICAgdGFiaW5kZXg6IFwiMFwiLFxuICAgICAgICAgICAgcm9sZTogXCJidXR0b25cIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlN0YXJ0XCI7XG4gICAgICAgIHRoaXMuc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5oaWRlKCk7IC8vIGhpZGUgdGhlIGZpbmlzaCBidXR0b24gZm9yIG5vd1xuICAgICAgICAgICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgbGV0IG1lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgICAgICAgICBtZXNzLmlubmVySFRNTCA9XG4gICAgICAgICAgICAgICAgICAgIFwiPHN0cm9uZz5XYXJuaW5nOiBZb3Ugd2lsbCBub3QgYmUgYWJsZSB0byBjb250aW51ZSB0aGUgZXhhbSBpZiB5b3UgY2xvc2UgdGhpcyB0YWIsIGNsb3NlIHRoZSB3aW5kb3csIG9yIG5hdmlnYXRlIGF3YXkgZnJvbSB0aGlzIHBhZ2UhPC9zdHJvbmc+ICBNYWtlIHN1cmUgeW91IGNsaWNrIHRoZSBGaW5pc2ggRXhhbSBidXR0b24gd2hlbiB5b3UgYXJlIGRvbmUgdG8gc3VibWl0IHlvdXIgd29yayFcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQobWVzcyk7XG4gICAgICAgICAgICAgICAgbWVzcy5jbGFzc0xpc3QuYWRkKFwiZXhhbXdhcm5pbmdcIik7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZW5kZXJUaW1lZFF1ZXN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgICQodGhpcy5wYXVzZUJ0bikuYXR0cih7XG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLWRlZmF1bHRcIixcbiAgICAgICAgICAgIGlkOiBcInBhdXNlXCIsXG4gICAgICAgICAgICBkaXNhYmxlZDogXCJ0cnVlXCIsXG4gICAgICAgICAgICB0YWJpbmRleDogXCIwXCIsXG4gICAgICAgICAgICByb2xlOiBcImJ1dHRvblwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi50ZXh0Q29udGVudCA9IFwiUGF1c2VcIjtcbiAgICAgICAgdGhpcy5wYXVzZUJ0bi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VBc3Nlc3NtZW50KCk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBpZiAoIXRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbERpdi5hcHBlbmRDaGlsZCh0aGlzLnN0YXJ0QnRuKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMubm9wYXVzZSkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sRGl2LmFwcGVuZENoaWxkKHRoaXMucGF1c2VCdG4pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMud3JhcHBlckRpdik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbERpdik7XG4gICAgfVxuXG4gICAgcmVuZGVyTmF2Q29udHJvbHMoKSB7XG4gICAgICAgIC8vIG1ha2luZyBcIlByZXZcIiBidXR0b25cbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICAkKHRoaXMucGFnTmF2TGlzdCkuYWRkQ2xhc3MoXCJwYWdpbmF0aW9uXCIpO1xuICAgICAgICB0aGlzLmxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMubGVmdE5hdkJ1dHRvbi5pbm5lckhUTUwgPSBcIiYjODI0OTsgUHJldlwiO1xuICAgICAgICAkKHRoaXMubGVmdE5hdkJ1dHRvbikuYXR0cihcImFyaWEtbGFiZWxcIiwgXCJQcmV2aW91c1wiKTtcbiAgICAgICAgJCh0aGlzLmxlZnROYXZCdXR0b24pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgICQodGhpcy5sZWZ0TmF2QnV0dG9uKS5hdHRyKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5hdHRyKFwiaWRcIiwgXCJwcmV2XCIpO1xuICAgICAgICAkKHRoaXMubGVmdE5hdkJ1dHRvbikuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgdGhpcy5sZWZ0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubGVmdE5hdkJ1dHRvbik7XG4gICAgICAgIHRoaXMucGFnTmF2TGlzdC5hcHBlbmRDaGlsZCh0aGlzLmxlZnRDb250YWluZXIpO1xuICAgICAgICAvLyBtYWtpbmcgXCJGbGFnIFF1ZXN0aW9uXCIgYnV0dG9uXG4gICAgICAgIHRoaXMuZmxhZ2dpbmdQbGFjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdnaW5nUGxhY2UpLmFkZENsYXNzKFwicGFnaW5hdGlvblwiKTtcbiAgICAgICAgdGhpcy5mbGFnQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMuZmxhZ0J1dHRvbikuYWRkQ2xhc3MoXCJmbGFnQnRuXCIpO1xuICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIG5hbWUgb24gYnV0dG9uXG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5hdHRyKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIFwiRmxhZ1wiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmF0dHIoXCJ0YWJpbmRleFwiLCBcIjVcIik7XG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5hdHRyKFwicm9sZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmF0dHIoXCJpZFwiLCBcImZsYWdcIik7XG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5jc3MoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICAgICAgICB0aGlzLmZsYWdDb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy5mbGFnQnV0dG9uKTsgLy8gYWRkaW5nIGJ1dHRvbiB0byBjb250YWluZXJcbiAgICAgICAgdGhpcy5mbGFnZ2luZ1BsYWNlLmFwcGVuZENoaWxkKHRoaXMuZmxhZ0NvbnRhaW5lcik7IC8vIGFkZGluZyBjb250YWluZXIgdG8gZmxhZ2dpbmdQbGFjZVxuICAgICAgICAvLyBtYWtpbmcgXCJOZXh0XCIgYnV0dG9uXG4gICAgICAgIHRoaXMucmlnaHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJhcmlhLWxhYmVsXCIsIFwiTmV4dFwiKTtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5hdHRyKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJyb2xlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICAkKHRoaXMucmlnaHROYXZCdXR0b24pLmF0dHIoXCJpZFwiLCBcIm5leHRcIik7XG4gICAgICAgIHRoaXMucmlnaHROYXZCdXR0b24uaW5uZXJIVE1MID0gXCJOZXh0ICYjODI1MDtcIjtcbiAgICAgICAgJCh0aGlzLnJpZ2h0TmF2QnV0dG9uKS5jc3MoXCJjdXJzb3JcIiwgXCJwb2ludGVyXCIpO1xuICAgICAgICB0aGlzLnJpZ2h0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMucmlnaHROYXZCdXR0b24pO1xuICAgICAgICB0aGlzLnBhZ05hdkxpc3QuYXBwZW5kQ2hpbGQodGhpcy5yaWdodENvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuZW5zdXJlQnV0dG9uU2FmZXR5KCk7XG4gICAgICAgIHRoaXMubmF2RGl2LmFwcGVuZENoaWxkKHRoaXMucGFnTmF2TGlzdCk7XG4gICAgICAgIHRoaXMuZmxhZ0Rpdi5hcHBlbmRDaGlsZCh0aGlzLmZsYWdnaW5nUGxhY2UpOyAvLyBhZGRzIGZsYWdnaW5nUGxhY2UgdG8gdGhlIGZsYWdEaXZcbiAgICAgICAgdGhpcy5icmVhayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJiclwiKTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5icmVhayk7XG4gICAgICAgIC8vIHJlbmRlciB0aGUgcXVlc3Rpb24gbnVtYmVyIGp1bXAgYnV0dG9uc1xuICAgICAgICB0aGlzLnFOdW1MaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICAkKHRoaXMucU51bUxpc3QpLmF0dHIoXCJpZFwiLCBcInBhZ2VOdW1zXCIpO1xuICAgICAgICB0aGlzLnFOdW1XcmFwcGVyTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgICAgICAgJCh0aGlzLnFOdW1XcmFwcGVyTGlzdCkuYWRkQ2xhc3MoXCJwYWdpbmF0aW9uXCIpO1xuICAgICAgICB2YXIgdG1wTGksIHRtcEE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRtcExpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgdG1wQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgdG1wQS5pbm5lckhUTUwgPSBpICsgMTtcbiAgICAgICAgICAgICQodG1wQSkuY3NzKFwiY3Vyc29yXCIsIFwicG9pbnRlclwiKTtcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgJCh0bXBMaSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0bXBMaS5hcHBlbmRDaGlsZCh0bXBBKTtcbiAgICAgICAgICAgIHRoaXMucU51bVdyYXBwZXJMaXN0LmFwcGVuZENoaWxkKHRtcExpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnFOdW1MaXN0LmFwcGVuZENoaWxkKHRoaXMucU51bVdyYXBwZXJMaXN0KTtcbiAgICAgICAgdGhpcy5uYXZEaXYuYXBwZW5kQ2hpbGQodGhpcy5xTnVtTGlzdCk7XG4gICAgICAgIHRoaXMubmF2QnRuTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuZmxhZ0J0bkxpc3RlbmVyKCk7IC8vIGxpc3RlbnMgZm9yIGNsaWNrIG9uIGZsYWcgYnV0dG9uXG4gICAgICAgICQodGhpcy5mbGFnQnV0dG9uKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgLy8gd2hlbiBtb3Zpbmcgb2ZmIG9mIGEgcXVlc3Rpb24gaW4gYW4gYWN0aXZlIGV4YW06XG4gICAgLy8gMS4gc2hvdyB0aGF0IHRoZSBxdWVzdGlvbiBoYXMgYmVlbiBzZWVuLCBvciBtYXJrIGl0IGJyb2tlbiBpZiBpdCBpcyBpbiBlcnJvci5cbiAgICAvLyAyLiBjaGVjayBhbmQgbG9nIHRoZSBjdXJyZW50IGFuc3dlclxuICAgIGFzeW5jIG5hdmlnYXRlQXdheSgpIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0uc3RhdGUgPT1cbiAgICAgICAgICAgIFwiYnJva2VuX2V4YW1cIlxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJicm9rZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0uc3RhdGUgPT1cbiAgICAgICAgICAgIFwiZXhhbV9lbmRlZFwiXG4gICAgICAgICkge1xuICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICBcInVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcShcIiArIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKyBcIilcIlxuICAgICAgICAgICAgKS5hZGRDbGFzcyhcInRvb2xhdGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb25cbiAgICAgICAgICAgICAgICAuaXNBbnN3ZXJlZFxuICAgICAgICApIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJhbnN3ZXJlZFwiKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhcbiAgICAgICAgICAgIF0ucXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZG9uZSkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XG4gICAgICAgICAgICAgICAgXS5xdWVzdGlvbi5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXN5bmMgaGFuZGxlTmV4dFByZXYoZXZlbnQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLm5hdmlnYXRlQXdheSgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9OZXh0LykpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrcyBnaXZlbiB0ZXh0IHRvIG1hdGNoIFwiTmV4dFwiXG4gICAgICAgICAgICBpZiAoJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCsrO1xuICAgICAgICB9IGVsc2UgaWYgKHRhcmdldC5tYXRjaCgvUHJldi8pKSB7XG4gICAgICAgICAgICAvLyBjaGVja3MgZ2l2ZW4gdGV4dCB0byBtYXRjaCBcIlByZXZcIlxuICAgICAgICAgICAgaWYgKCQodGhpcy5sZWZ0Q29udGFpbmVyKS5oYXNDbGFzcyhcImRpc2FibGVkXCIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleC0tO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAkKFxuICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICBcInVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcShcIiArIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggKyBcIilcIlxuICAgICAgICAgICAgKS5oYXNDbGFzcyhcImZsYWdjb2xvclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIGNoZWNraW5nIGZvciBjbGFzc1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiVW5mbGFnIFF1ZXN0aW9uXCI7IC8vIGNoYW5nZXMgdGV4dCBvbiBidXR0b25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIkZsYWcgUXVlc3Rpb25cIjsgLy8gY2hhbmdlcyB0ZXh0IG9uIGJ1dHRvblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlRmxhZyhldmVudCkge1xuICAgICAgICAvLyBjYWxsZWQgd2hlbiBmbGFnIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBpZiAodGFyZ2V0Lm1hdGNoKC9GbGFnIFF1ZXN0aW9uLykpIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkuYWRkQ2xhc3MoXCJmbGFnY29sb3JcIik7IC8vIGNsYXNzIHdpbGwgY2hhbmdlIGNvbG9yIG9mIHF1ZXN0aW9uIGJsb2NrXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJVbmZsYWcgUXVlc3Rpb25cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCJcbiAgICAgICAgICAgICkucmVtb3ZlQ2xhc3MoXCJmbGFnY29sb3JcIik7IC8vIHdpbGwgcmVzdG9yZSBjdXJyZW50IGNvbG9yIG9mIHF1ZXN0aW9uIGJsb2NrXG4gICAgICAgICAgICB0aGlzLmZsYWdCdXR0b24uaW5uZXJIVE1MID0gXCJGbGFnIFF1ZXN0aW9uXCI7IC8vIGFsc28gc2V0cyBuYW1lIGJhY2tcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIGhhbmRsZU51bWJlcmVkTmF2KGV2ZW50KSB7XG4gICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5uYXZpZ2F0ZUF3YXkoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChcbiAgICAgICAgICAgICAgICB2YXIgaiA9IDA7XG4gICAgICAgICAgICAgICAgaiA8IHRoaXMucU51bUxpc3QuY2hpbGROb2Rlc1tpXS5jaGlsZE5vZGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBqKytcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICQodGhpcy5xTnVtTGlzdC5jaGlsZE5vZGVzW2ldLmNoaWxkTm9kZXNbal0pLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgICAgICBcImFjdGl2ZVwiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCkudGV4dCgpO1xuICAgICAgICBsZXQgb2xkSW5kZXggPSB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4O1xuICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gcGFyc2VJbnQodGFyZ2V0KSAtIDE7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID4gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3I6IGJhZCBpbmRleCBmb3IgJHt0YXJnZXR9YCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID0gb2xkSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgJChcbiAgICAgICAgICAgIFwidWwjcGFnZU51bXMgPiB1bCA+IGxpOmVxKFwiICsgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCArIFwiKVwiXG4gICAgICAgICkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgICQoXG4gICAgICAgICAgICAgICAgXCJ1bCNwYWdlTnVtcyA+IHVsID4gbGk6ZXEoXCIgKyB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICsgXCIpXCIgLy8gY2hlY2tpbmcgZm9yIGZsYWdjb2xvciBjbGFzc1xuICAgICAgICAgICAgKS5oYXNDbGFzcyhcImZsYWdjb2xvclwiKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuZmxhZ0J1dHRvbi5pbm5lckhUTUwgPSBcIlVuZmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5mbGFnQnV0dG9uLmlubmVySFRNTCA9IFwiRmxhZyBRdWVzdGlvblwiO1xuICAgICAgICB9XG4gICAgICAgIGF3YWl0IHRoaXMucmVuZGVyVGltZWRRdWVzdGlvbigpO1xuICAgICAgICB0aGlzLmVuc3VyZUJ1dHRvblNhZmV0eSgpO1xuICAgIH1cblxuICAgIC8vIHNldCB1cCBldmVudHMgZm9yIG5hdmlnYXRpb25cbiAgICBuYXZCdG5MaXN0ZW5lcnMoKSB7XG4gICAgICAgIC8vIE5leHQgYW5kIFByZXYgTGlzdGVuZXJcbiAgICAgICAgdGhpcy5wYWdOYXZMaXN0LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICB0aGlzLmhhbmRsZU5leHRQcmV2LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIE51bWJlcmVkIExpc3RlbmVyXG4gICAgICAgIHRoaXMucU51bUxpc3QuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTnVtYmVyZWROYXYuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHVwIGV2ZW50IGZvciBmbGFnXG4gICAgZmxhZ0J0bkxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmZsYWdnaW5nUGxhY2UuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlRmxhZy5iaW5kKHRoaXMpLCAvLyBjYWxscyB0aGlzIHRvIHRha2UgYWN0aW9uXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHJlbmRlclN1Ym1pdEJ1dHRvbigpIHtcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAkKHRoaXMuYnV0dG9uQ29udGFpbmVyKS5hdHRyKHtcbiAgICAgICAgICAgIHN0eWxlOiBcInRleHQtYWxpZ246Y2VudGVyXCIsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICQodGhpcy5maW5pc2hCdXR0b24pLmF0dHIoe1xuICAgICAgICAgICAgaWQ6IFwiZmluaXNoXCIsXG4gICAgICAgICAgICBjbGFzczogXCJidG4gYnRuLXByaW1hcnlcIixcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLnRleHRDb250ZW50ID0gXCJGaW5pc2ggRXhhbVwiO1xuICAgICAgICB0aGlzLmZpbmlzaEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGxldCBza2lwcGVkID1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkuZmlsdGVyKCh4KSA9PiAheC5xdWVzdGlvbi5pc0Fuc3dlcmVkKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IHNraXBzdHIgPSBza2lwcGVkID4gMCA/IGBZb3UgaGF2ZSBza2lwcGVkICR7c2tpcHBlZH0gcXVlc3Rpb24ocykuYCA6IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuY29uZmlybShcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke3NraXBzdHJ9IENsaWNraW5nIE9LIG1lYW5zIHlvdSBhcmUgcmVhZHkgdG8gc3VibWl0IHlvdXIgYW5zd2VycyBhbmQgYXJlIGZpbmlzaGVkIHdpdGggdGhpcyBhc3Nlc3NtZW50LmBcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZpbmlzaEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmZsYWdCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLmNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQodGhpcy5maW5pc2hCdXR0b24pO1xuICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5oaWRlKCk7XG4gICAgICAgIHRoaXMudGltZWREaXYuYXBwZW5kQ2hpbGQodGhpcy5idXR0b25Db250YWluZXIpO1xuICAgIH1cbiAgICBlbnN1cmVCdXR0b25TYWZldHkoKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMucmlnaHRDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMubGVmdENvbnRhaW5lcikuYWRkQ2xhc3MoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ID49XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggLSAxXG4gICAgICAgICkge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aCAhPSAxKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzLmxlZnRDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHRoaXMucmlnaHRDb250YWluZXIpLmFkZENsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA+IDAgJiZcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggLSAxXG4gICAgICAgICkge1xuICAgICAgICAgICAgJCh0aGlzLnJpZ2h0Q29udGFpbmVyKS5yZW1vdmVDbGFzcyhcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgJCh0aGlzLmxlZnRDb250YWluZXIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWRcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyRmVlZGJhY2tDb250YWluZXIoKSB7XG4gICAgICAgIHRoaXMuc2NvcmVEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgaWYgKHRoaXMudGFrZW4pIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuaW5uZXJIVE1MID0gXCI8aDI+WW91IGhhdmUgYWxyZWFkeSB0YWtlbiB0aGlzIGV4YW08L2gyPlwiO1xuICAgICAgICAgICAgdGhpcy5zY29yZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zY29yZURpdi5pZCA9IHRoaXMuZGl2aWQgKyBcInJlc3VsdHNcIjtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMuc2NvcmVEaXYpO1xuICAgIH1cblxuICAgIGNyZWF0ZVJlbmRlcmVkUXVlc3Rpb25BcnJheSgpIHtcbiAgICAgICAgLy8gdGhpcyBmaW5kcyBhbGwgdGhlIGFzc2VzcyBxdWVzdGlvbnMgaW4gdGhpcyB0aW1lZCBhc3Nlc3NtZW50XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gbWFrZSBhIGxpc3Qgb2YgYWxsIHRoZSBxdWVzdGlvbnMgdXAgZnJvbnQgc28gd2UgY2FuIHNldCB1cCBuYXZpZ2F0aW9uXG4gICAgICAgIC8vIGJ1dCB3ZSBkbyBub3Qgd2FudCB0byByZW5kZXIgdGhlIHF1ZXN0aW9ucyB1bnRpbCB0aGUgc3R1ZGVudCBoYXMgbmF2aWdhdGVkXG4gICAgICAgIC8vIEFsc28gYWRkcyB0aGVtIHRvIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5XG5cbiAgICAgICAgLy8gdG9kbzogIFRoaXMgbmVlZHMgdG8gYmUgdXBkYXRlZCB0byBhY2NvdW50IGZvciB0aGUgcnVuZXN0b25lIGRpdiB3cmFwcGVyLlxuXG4gICAgICAgIC8vIFRvIGFjY29tbW9kYXRlIHRoZSBzZWxlY3RxdWVzdGlvbiB0eXBlIC0tIHdoaWNoIGlzIGFzeW5jISB3ZSBuZWVkIHRvIHdyYXBcbiAgICAgICAgLy8gYWxsIG9mIHRoaXMgaW4gYSBwcm9taXNlLCBzbyB0aGF0IHdlIGRvbid0IGNvbnRpbnVlIHRvIHJlbmRlciB0aGUgdGltZWRcbiAgICAgICAgLy8gZXhhbSB1bnRpbCBhbGwgb2YgdGhlIHF1ZXN0aW9ucyBoYXZlIGJlZW4gcmVhbGl6ZWQuXG4gICAgICAgIHZhciBvcHRzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubmV3Q2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0bXBDaGlsZCA9IHRoaXMubmV3Q2hpbGRyZW5baV07XG4gICAgICAgICAgICBvcHRzID0ge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBcInByZXBhcmVkXCIsXG4gICAgICAgICAgICAgICAgb3JpZzogdG1wQ2hpbGQsXG4gICAgICAgICAgICAgICAgcXVlc3Rpb246IHt9LFxuICAgICAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgICAgICAgICB0aW1lZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhc3Nlc3NtZW50VGFrZW46IHRoaXMudGFrZW4sXG4gICAgICAgICAgICAgICAgdGltZWRXcmFwcGVyOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIGluaXRBdHRlbXB0czogMCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoJCh0bXBDaGlsZCkuY2hpbGRyZW4oXCJbZGF0YS1jb21wb25lbnRdXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB0bXBDaGlsZCA9ICQodG1wQ2hpbGQpLmNoaWxkcmVuKFwiW2RhdGEtY29tcG9uZW50XVwiKVswXTtcbiAgICAgICAgICAgICAgICBvcHRzLm9yaWcgPSB0bXBDaGlsZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkKHRtcENoaWxkKS5pcyhcIltkYXRhLWNvbXBvbmVudF1cIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5wdXNoKG9wdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmFuZG9taXplUlFBKCkge1xuICAgICAgICB2YXIgY3VycmVudEluZGV4ID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoLFxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUsXG4gICAgICAgICAgICByYW5kb21JbmRleDtcbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGUuLi5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgICAgICByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICBjdXJyZW50SW5kZXggLT0gMTtcbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHRlbXBvcmFyeVZhbHVlID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2N1cnJlbnRJbmRleF0gPVxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3JhbmRvbUluZGV4XSA9IHRlbXBvcmFyeVZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgcmVuZGVyVGltZWRRdWVzdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPj0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzb21ldGltZXMgdGhlIHVzZXIgY2xpY2tzIGluIHRoZSBldmVudCBhcmVhIGZvciB0aGUgcU51bUxpc3RcbiAgICAgICAgICAgIC8vIEJ1dCBtaXNzZXMgYSBudW1iZXIgaW4gdGhhdCBjYXNlIHRoZSB0ZXh0IGlzIHRoZSBjb25jYXRlbmF0aW9uXG4gICAgICAgICAgICAvLyBvZiBhbGwgdGhlIG51bWJlcnMgaW4gdGhlIGxpc3QhXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2hlY2sgdGhlIHJlbmRlcmVkUXVlc3Rpb25BcnJheSB0byBzZWUgaWYgaXQgaGFzIGJlZW4gcmVuZGVyZWQuXG4gICAgICAgIGxldCBvcHRzID0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF07XG4gICAgICAgIGxldCBjdXJyZW50UXVlc3Rpb247XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIG9wdHMuc3RhdGUgPT09IFwicHJlcGFyZWRcIiB8fFxuICAgICAgICAgICAgb3B0cy5zdGF0ZSA9PT0gXCJmb3JyZXZpZXdcIiB8fFxuICAgICAgICAgICAgKG9wdHMuc3RhdGUgPT09IFwiYnJva2VuX2V4YW1cIiAmJiBvcHRzLmluaXRBdHRlbXB0cyA8IDMpXG4gICAgICAgICkge1xuICAgICAgICAgICAgbGV0IHRtcENoaWxkID0gb3B0cy5vcmlnO1xuICAgICAgICAgICAgaWYgKCQodG1wQ2hpbGQpLmlzKFwiW2RhdGEtY29tcG9uZW50PXNlbGVjdHF1ZXN0aW9uXVwiKSkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUgJiYgb3B0cy5zdGF0ZSA9PSBcInByZXBhcmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XG4gICAgICAgICAgICAgICAgICAgIF0uc3RhdGUgPSBcImV4YW1fZW5kZWRcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBTZWxlY3RPbmUgaXMgYXN5bmMgYW5kIHdpbGwgcmVwbGFjZSBpdHNlbGYgaW4gdGhpcyBhcnJheSB3aXRoXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgc2VsZWN0ZWQgcXVlc3Rpb25cbiAgICAgICAgICAgICAgICAgICAgb3B0cy5ycWEgPSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld3EgPSBuZXcgU2VsZWN0T25lKG9wdHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiBuZXdxLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgbmV3cS5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5zdGF0ZSA9PSBcImJyb2tlbl9leGFtXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIGJyb2tlbiBjbGFzcyBmcm9tIHRoaXMgcXVlc3Rpb24gaWYgd2UgZ2V0IGhlcmUuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYHVsI3BhZ2VOdW1zID4gdWwgPiBsaTplcSgke3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXh9KWBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApLnJlbW92ZUNsYXNzKFwiYnJva2VuXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLnN0YXRlID0gXCJicm9rZW5fZXhhbVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHM7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgRXJyb3IgaW5pdGlhbGl6aW5nIHF1ZXN0aW9uOiBEZXRhaWxzICR7ZX1gXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICgkKHRtcENoaWxkKS5pcyhcIltkYXRhLWNvbXBvbmVudF1cIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgY29tcG9uZW50S2luZCA9ICQodG1wQ2hpbGQpLmRhdGEoXCJjb21wb25lbnRcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uOiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnlbY29tcG9uZW50S2luZF0ob3B0cyksXG4gICAgICAgICAgICAgICAgICAgIHN0YXRlOiBvcHRzLnN0YXRlLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAob3B0cy5zdGF0ZSA9PT0gXCJicm9rZW5fZXhhbVwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50UXVlc3Rpb24gPVxuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0ucXVlc3Rpb247XG4gICAgICAgIGlmIChvcHRzLnN0YXRlID09PSBcImZvcnJldmlld1wiKSB7XG4gICAgICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24uY29tcG9uZW50X3JlYWR5X3Byb21pc2U7XG4gICAgICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24ucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5kaXNhYmxlSW50ZXJhY3Rpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy52aXNpdGVkLmluY2x1ZGVzKHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXgpKSB7XG4gICAgICAgICAgICB0aGlzLnZpc2l0ZWQucHVzaCh0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4KTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnZpc2l0ZWQubGVuZ3RoID09PSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGggJiZcbiAgICAgICAgICAgICAgICAhdGhpcy5kb25lXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMuZmluaXNoQnV0dG9uKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uLmNvbnRhaW5lckRpdikge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5jb250YWluZXJEaXYuY2xhc3NMaXN0LmNvbnRhaW5zKFwicnVuZXN0b25lXCIpID09XG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQodGhpcy5zd2l0Y2hEaXYpLnJlcGxhY2VXaXRoKGN1cnJlbnRRdWVzdGlvbi5jb250YWluZXJEaXYpO1xuICAgICAgICAgICAgdGhpcy5zd2l0Y2hEaXYgPSBjdXJyZW50UXVlc3Rpb24uY29udGFpbmVyRGl2O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHRpbWVkIGNvbXBvbmVudCBoYXMgbGlzdGVuZXJzLCB0aG9zZSBtaWdodCBuZWVkIHRvIGJlIHJlaW5pdGlhbGl6ZWRcbiAgICAgICAgLy8gVGhpcyBmbGFnIHdpbGwgb25seSBiZSBzZXQgaW4gdGhlIGVsZW1lbnRzIHRoYXQgbmVlZCBpdC0taXQgd2lsbCBiZSB1bmRlZmluZWQgaW4gdGhlIG90aGVycyBhbmQgdGh1cyBldmFsdWF0ZSB0byBmYWxzZVxuICAgICAgICBpZiAoY3VycmVudFF1ZXN0aW9uLm5lZWRzUmVpbml0aWFsaXphdGlvbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLnJlaW5pdGlhbGl6ZUxpc3RlbmVycyh0aGlzLnRha2VuKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IFRpbWVyIGFuZCBjb250cm9sIEZ1bmN0aW9ucyA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIGhhbmRsZVByZXZBc3Nlc3NtZW50KCkge1xuICAgICAgICAkKHRoaXMuc3RhcnRCdG4pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLnBhdXNlQnRuKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQodGhpcy5maW5pc2hCdXR0b24pLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgdGhpcy5kb25lID0gMTtcbiAgICAgICAgLy8gc2hvd0ZlZWRiYWNrIHNhbmQgc2hvd1Jlc3VsdHMgc2hvdWxkIGJvdGggYmUgdHJ1ZSBiZWZvcmUgd2Ugc2hvdyB0aGVcbiAgICAgICAgLy8gcXVlc3Rpb25zIGFuZCB0aGVpciBzdGF0ZSBvZiBjb3JyZWN0bmVzcy5cbiAgICAgICAgaWYgKHRoaXMuc2hvd1Jlc3VsdHMgJiYgdGhpcy5zaG93RmVlZGJhY2spIHtcbiAgICAgICAgICAgICQodGhpcy50aW1lZERpdikuc2hvdygpO1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VyZWRRdWVzdGlvbnMoKTsgLy8gZG8gbm90IGxvZyB0aGVzZSByZXN1bHRzXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMucGF1c2VCdG4pLmhpZGUoKTtcbiAgICAgICAgICAgICQodGhpcy50aW1lckNvbnRhaW5lcikuaGlkZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXJ0QXNzZXNzbWVudCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLmhpZGUoKTsgLy8gaGlkZSB0aGUgbmV4dCBwYWdlIGJ1dHRvbiBmb3Igbm93XG4gICAgICAgICAgICAkKFwiI3JlbGF0aW9ucy1wcmV2XCIpLmhpZGUoKTsgLy8gaGlkZSB0aGUgcHJldmlvdXMgYnV0dG9uIGZvciBub3dcbiAgICAgICAgICAgICQodGhpcy5zdGFydEJ0bikuaGlkZSgpO1xuICAgICAgICAgICAgJCh0aGlzLnBhdXNlQnRuKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgaWYgKHRoaXMucnVubmluZyA9PT0gMCAmJiB0aGlzLnBhdXNlZCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucnVubmluZyA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICAgICAgJCh0aGlzLnRpbWVkRGl2KS5zaG93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmNyZW1lbnQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcInRpbWVkRXhhbVwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IFwic3RhcnRcIixcbiAgICAgICAgICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHZhciB0aW1lU3RhbXAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICBhbnN3ZXI6IFswLCAwLCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGgsIDBdLFxuICAgICAgICAgICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKHdpbmRvdykub24oXG4gICAgICAgICAgICAgICAgXCJiZWZvcmV1bmxvYWRcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyBhY3R1YWwgdmFsdWUgZ2V0cyBpZ25vcmVkIGJ5IG5ld2VyIGJyb3dzZXJzXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZT8gIFlvdXIgd29yayB3aWxsIGJlIGxvc3QhIEFuZCB5b3Ugd2lsbCBuZWVkIHlvdXIgaW5zdHJ1Y3RvciB0byByZXNldCB0aGUgZXhhbSFcIjtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGxlYXZlPyAgWW91ciB3b3JrIHdpbGwgYmUgbG9zdCFcIjtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcInBhZ2VoaWRlXCIsXG4gICAgICAgICAgICAgICAgYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5kb25lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmZpbmlzaEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXhhbSBleGl0ZWQgYnkgbGVhdmluZyBwYWdlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVQcmV2QXNzZXNzbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHBhdXNlQXNzZXNzbWVudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9uZSA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucnVubmluZyA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IFwidGltZWRFeGFtXCIsXG4gICAgICAgICAgICAgICAgICAgIGFjdDogXCJwYXVzZVwiLFxuICAgICAgICAgICAgICAgICAgICBkaXZfaWQ6IHRoaXMuZGl2aWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLnBhdXNlZCA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZUJ0bi5pbm5lckhUTUwgPSBcIlJlc3VtZVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy50aW1lZERpdikuaGlkZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBcInRpbWVkRXhhbVwiLFxuICAgICAgICAgICAgICAgICAgICBhY3Q6IFwicmVzdW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bm5pbmcgPSAxO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VkID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLmluY3JlbWVudCgpO1xuICAgICAgICAgICAgICAgIHRoaXMucGF1c2VCdG4uaW5uZXJIVE1MID0gXCJQYXVzZVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy50aW1lZERpdikuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvd1RpbWUoKSB7XG4gICAgICAgIGlmICh0aGlzLnNob3dUaW1lcikge1xuICAgICAgICAgICAgdmFyIG1pbnMgPSBNYXRoLmZsb29yKHRoaXMudGltZUxpbWl0IC8gNjApO1xuICAgICAgICAgICAgdmFyIHNlY3MgPSBNYXRoLmZsb29yKHRoaXMudGltZUxpbWl0KSAlIDYwO1xuICAgICAgICAgICAgdmFyIG1pbnNTdHJpbmcgPSBtaW5zO1xuICAgICAgICAgICAgdmFyIHNlY3NTdHJpbmcgPSBzZWNzO1xuICAgICAgICAgICAgaWYgKG1pbnMgPCAxMCkge1xuICAgICAgICAgICAgICAgIG1pbnNTdHJpbmcgPSBcIjBcIiArIG1pbnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VjcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgc2Vjc1N0cmluZyA9IFwiMFwiICsgc2VjcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBiZWdpbm5pbmcgPSBcIlRpbWUgUmVtYWluaW5nICAgIFwiO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbWl0ZWRUaW1lKSB7XG4gICAgICAgICAgICAgICAgYmVnaW5uaW5nID0gXCJUaW1lIFRha2VuICAgIFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHRpbWVTdHJpbmcgPSBiZWdpbm5pbmcgKyBtaW5zU3RyaW5nICsgXCI6XCIgKyBzZWNzU3RyaW5nO1xuICAgICAgICAgICAgaWYgKHRoaXMuZG9uZSB8fCB0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSBNYXRoLmZsb29yKHRoaXMudGltZVRha2VuIC8gNjApO1xuICAgICAgICAgICAgICAgIHZhciBzZWNvbmRzID0gTWF0aC5mbG9vcih0aGlzLnRpbWVUYWtlbiAlIDYwKTtcbiAgICAgICAgICAgICAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSBcIjBcIiArIG1pbnV0ZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyA9IFwiMFwiICsgc2Vjb25kcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IFwiVGltZSB0YWtlbjogXCIgKyBtaW51dGVzICsgXCI6XCIgKyBzZWNvbmRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy50aW1lckNvbnRhaW5lci5pbm5lckhUTUwgPSB0aW1lU3RyaW5nO1xuICAgICAgICAgICAgdmFyIHRpbWVUaXBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRpbWVUaXBcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB0aW1lVGlwcy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aW1lVGlwc1tpXS50aXRsZSA9IHRpbWVTdHJpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKHRoaXMudGltZXJDb250YWluZXIpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluY3JlbWVudCgpIHtcbiAgICAgICAgLy8gaWYgcnVubmluZyAobm90IHBhdXNlZCkgYW5kIG5vdCB0YWtlblxuICAgICAgICBpZiAodGhpcy5ydW5uaW5nID09PSAxICYmICF0aGlzLnRha2VuKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiBhIGJyb3dzZXIgbG9zZXMgZm9jdXMsIHNldFRpbWVvdXQgbWF5IG5vdCBiZSBjYWxsZWQgb24gdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vIHNjaGVkdWxlIGV4cGVjdGVkLiAgQnJvd3NlcnMgYXJlIGZyZWUgdG8gc2F2ZSBwb3dlciBieSBsZW5ndGhlbmluZ1xuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgaW50ZXJ2YWwgdG8gc29tZSBsb25nZXIgdGltZS4gIFNvIHdlIGNhbm5vdCBqdXN0IHN1YnRyYWN0IDFcbiAgICAgICAgICAgICAgICAgICAgLy8gZnJvbSB0aGUgdGltZUxpbWl0IHdlIG5lZWQgdG8gbWVhc3VyZSB0aGUgZWxhcHNlZCB0aW1lIGZyb20gdGhlIGxhc3RcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FsbCB0byB0aGUgY3VycmVudCBjYWxsIGFuZCBzdWJ0cmFjdCB0aGF0IG51bWJlciBvZiBzZWNvbmRzLlxuICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5saW1pdGVkVGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhIHRpbWUgbGltaXQsIGNvdW50IGRvd24gdG8gMFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lTGltaXQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0IC1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKChjdXJyZW50VGltZSAtIHRoaXMubGFzdFRpbWUpIC8gMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBFbHNlIGNvdW50IHVwIHRvIGtlZXAgdHJhY2sgb2YgaG93IGxvbmcgaXQgdG9vayB0byBjb21wbGV0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lTGltaXQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGltZUxpbWl0ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLmZsb29yKChjdXJyZW50VGltZSAtIHRoaXMubGFzdFRpbWUpIC8gMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLmVtYWlsICsgXCI6XCIgKyB0aGlzLmRpdmlkICsgXCItdGltZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lTGltaXRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93VGltZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy50aW1lTGltaXQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmluY3JlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmFuIG91dCBvZiB0aW1lXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMuc3RhcnRCdG4pLmF0dHIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiBcInRydWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmZpbmlzaEJ1dHRvbikuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6IFwidHJ1ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1bm5pbmcgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kb25lID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy50YWtlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFrZW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVtYmVkIHRoZSBtZXNzYWdlIGluIHRoZSBwYWdlIC0tIGFuIGFsZXJ0IGFjdHVhbGx5IHByZXZlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGFuc3dlcnMgZnJvbSBiZWluZyBzdWJtaXR0ZWQgYW5kIGlmIGEgc3R1ZGVudCBjbG9zZXMgdGhlaXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsYXB0b3AgdGhlbiB0aGUgYW5zd2VycyB3aWxsIG5vdCBiZSBzdWJtaXR0ZWQgZXZlciEgIEV2ZW4gd2hlbiB0aGV5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVvcGVuIHRoZSBsYXB0b3AgdGhlaXIgc2Vzc2lvbiBjb29raWUgaXMgbGlrZWx5IGludmFsaWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDFcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzcy5pbm5lckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlNvcnJ5IGJ1dCB5b3UgcmFuIG91dCBvZiB0aW1lLiBZb3VyIGFuc3dlcnMgYXJlIGJlaW5nIHN1Ym1pdHRlZFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udHJvbERpdi5hcHBlbmRDaGlsZChtZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmlzaEFzc2Vzc21lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICAxMDAwXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3R5bGVFeGFtRWxlbWVudHMoKSB7XG4gICAgICAgIC8vIENoZWNrcyBpZiB0aGlzIGV4YW0gaGFzIGJlZW4gdGFrZW4gYmVmb3JlXG4gICAgICAgICQodGhpcy50aW1lckNvbnRhaW5lcikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjUwJVwiLFxuICAgICAgICAgICAgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI0RGRjBEOFwiLFxuICAgICAgICAgICAgXCJ0ZXh0LWFsaWduXCI6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMnB4IHNvbGlkICNERkYwRDhcIixcbiAgICAgICAgICAgIFwiYm9yZGVyLXJhZGl1c1wiOiBcIjI1cHhcIixcbiAgICAgICAgfSk7XG4gICAgICAgICQodGhpcy5zY29yZURpdikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiBcIjUwJVwiLFxuICAgICAgICAgICAgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiI0RGRjBEOFwiLFxuICAgICAgICAgICAgXCJ0ZXh0LWFsaWduXCI6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMnB4IHNvbGlkICNERkYwRDhcIixcbiAgICAgICAgICAgIFwiYm9yZGVyLXJhZGl1c1wiOiBcIjI1cHhcIixcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIudG9vbHRpcFRpbWVcIikuY3NzKHtcbiAgICAgICAgICAgIG1hcmdpbjogXCIwXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjBcIixcbiAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcImJsYWNrXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhc3luYyBmaW5pc2hBc3Nlc3NtZW50KCkge1xuICAgICAgICAkKFwiI3JlbGF0aW9ucy1uZXh0XCIpLnNob3coKTsgLy8gc2hvdyB0aGUgbmV4dCBwYWdlIGJ1dHRvbiBmb3Igbm93XG4gICAgICAgICQoXCIjcmVsYXRpb25zLXByZXZcIikuc2hvdygpOyAvLyBzaG93IHRoZSBwcmV2aW91cyBidXR0b24gZm9yIG5vd1xuICAgICAgICBpZiAoIXRoaXMuc2hvd0ZlZWRiYWNrKSB7XG4gICAgICAgICAgICAvLyBiamUgLSBjaGFuZ2VkIGZyb20gc2hvd1Jlc3VsdHNcbiAgICAgICAgICAgICQodGhpcy50aW1lZERpdikuaGlkZSgpO1xuICAgICAgICAgICAgJCh0aGlzLnBhdXNlQnRuKS5oaWRlKCk7XG4gICAgICAgICAgICAkKHRoaXMudGltZXJDb250YWluZXIpLmhpZGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbmRUaW1lVGFrZW4oKTtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gMDtcbiAgICAgICAgdGhpcy5kb25lID0gMTtcbiAgICAgICAgdGhpcy50YWtlbiA9IDE7XG4gICAgICAgIGF3YWl0IHRoaXMuZmluYWxpemVQcm9ibGVtcygpO1xuICAgICAgICB0aGlzLmNoZWNrU2NvcmUoKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5U2NvcmUoKTtcbiAgICAgICAgdGhpcy5zdG9yZVNjb3JlKCk7XG4gICAgICAgIHRoaXMubG9nU2NvcmUoKTtcbiAgICAgICAgJCh0aGlzLnBhdXNlQnRuKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuZmluaXNoQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgJCh3aW5kb3cpLm9mZihcImJlZm9yZXVubG9hZFwiKTtcbiAgICAgICAgLy8gdHVybiBvZmYgdGhlIHBhZ2VoaWRlIGxpc3RlbmVyXG4gICAgICAgIGxldCBhc3NpZ25tZW50X2lkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBlQm9va0NvbmZpZy5hcHAgKyBcIi9hc3NpZ25tZW50cy9zdHVkZW50X2F1dG9ncmFkZVwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcIkpTT05cIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2lnbm1lbnRfaWQ6IGFzc2lnbm1lbnRfaWQsXG4gICAgICAgICAgICAgICAgICAgIGlzX3RpbWVkOiB0cnVlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJldGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldGRhdGEuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmV0ZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXV0b2dyYWRlciBjb21wbGV0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH1cblxuICAgIC8vIGZpbmFsaXplUHJvYmxlbXNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tXG4gICAgYXN5bmMgZmluYWxpemVQcm9ibGVtcygpIHtcbiAgICAgICAgLy8gQmVjYXVzZSB3ZSBoYXZlIHN1Ym1pdHRlZCBlYWNoIHF1ZXN0aW9uIGFzIHdlIG5hdmlnYXRlIHdlIG9ubHkgbmVlZCB0b1xuICAgICAgICAvLyBzZW5kIHRoZSBmaW5hbCB2ZXJzaW9uIG9mIHRoZSBxdWVzdGlvbiB0aGUgc3R1ZGVudCBpcyBvbiB3aGVuIHRoZXkgcHJlc3MgdGhlXG4gICAgICAgIC8vIGZpbmlzaCBleGFtIGJ1dHRvbi5cblxuICAgICAgICB2YXIgY3VycmVudFF1ZXN0aW9uID1cbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W3RoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXhdLnF1ZXN0aW9uO1xuICAgICAgICBhd2FpdCBjdXJyZW50UXVlc3Rpb24uY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIGF3YWl0IGN1cnJlbnRRdWVzdGlvbi5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIGN1cnJlbnRRdWVzdGlvbi5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICBjdXJyZW50UXVlc3Rpb24uZGlzYWJsZUludGVyYWN0aW9uKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGN1cnJlbnRRdWVzdGlvbiA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5W2ldO1xuICAgICAgICAgICAgLy8gc2V0IHRoZSBzdGF0ZSB0byBmb3JyZXZpZXcgc28gd2Uga25vdyB0aGF0IGZlZWRiYWNrIG1heSBiZSBhcHByb3ByaWF0ZVxuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWVzdGlvbi5zdGF0ZSAhPT0gXCJicm9rZW5fZXhhbVwiKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXN0aW9uLnN0YXRlID0gXCJmb3JyZXZpZXdcIjtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVlc3Rpb24ucXVlc3Rpb24uZGlzYWJsZUludGVyYWN0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuc2hvd0ZlZWRiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGVUaW1lZEZlZWRiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXN0b3JlQW5zd2VyZWRRdWVzdGlvbnNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICByZXN0b3JlQW5zd2VyZWRRdWVzdGlvbnMoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50UXVlc3Rpb24gPSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVlc3Rpb24uc3RhdGUgPT09IFwicHJlcGFyZWRcIikge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5zdGF0ZSA9IFwiZm9ycmV2aWV3XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBoaWRlVGltZWRGZWVkYmFja1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAgaGlkZVRpbWVkRmVlZGJhY2soKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50UXVlc3Rpb24gPSB0aGlzLnJlbmRlcmVkUXVlc3Rpb25BcnJheVtpXS5xdWVzdGlvbjtcbiAgICAgICAgICAgIGN1cnJlbnRRdWVzdGlvbi5oaWRlRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrU2NvcmVcbiAgICAvLyAtLS0tLS0tLS0tXG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsZSBhbGwgb3Igbm90aGluZyBzY29yZSBvZiBvbmUgcG9pbnQgcGVyIHF1ZXN0aW9uIGZvclxuICAgIC8vIHRoYXQgaW5jbHVkZXMgb3VyIGJlc3QgZ3Vlc3MgaWYgYSBxdWVzdGlvbiB3YXMgc2tpcHBlZC5cbiAgICBjaGVja1Njb3JlKCkge1xuICAgICAgICB0aGlzLmNvcnJlY3RTdHIgPSBcIlwiO1xuICAgICAgICB0aGlzLnNraXBwZWRTdHIgPSBcIlwiO1xuICAgICAgICB0aGlzLmluY29ycmVjdFN0ciA9IFwiXCI7XG4gICAgICAgIC8vIEdldHMgdGhlIHNjb3JlIG9mIGVhY2ggcHJvYmxlbVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY29ycmVjdCA9XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXlbaV0ucXVlc3Rpb24uY2hlY2tDb3JyZWN0VGltZWQoKTtcbiAgICAgICAgICAgIGlmIChjb3JyZWN0ID09IFwiVFwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZSsrO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdFN0ciA9IHRoaXMuY29ycmVjdFN0ciArIChpICsgMSkgKyBcIiwgXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvcnJlY3QgPT0gXCJGXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluY29ycmVjdCsrO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gdGhpcy5pbmNvcnJlY3RTdHIgKyAoaSArIDEpICsgXCIsIFwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjb3JyZWN0ID09PSBudWxsIHx8IGNvcnJlY3QgPT09IFwiSVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5za2lwcGVkKys7XG4gICAgICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gdGhpcy5za2lwcGVkU3RyICsgKGkgKyAxKSArIFwiLCBcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlZCBxdWVzdGlvbjsganVzdCBkbyBub3RoaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIGV4dHJhIGNvbW1hIGFuZCBzcGFjZSBhdCBlbmQgaWYgYW55XG4gICAgICAgIGlmICh0aGlzLmNvcnJlY3RTdHIubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdFN0ciA9IHRoaXMuY29ycmVjdFN0ci5zdWJzdHJpbmcoXG4gICAgICAgICAgICAgICAgMCxcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIubGVuZ3RoIC0gMlxuICAgICAgICAgICAgKTtcbiAgICAgICAgZWxzZSB0aGlzLmNvcnJlY3RTdHIgPSBcIk5vbmVcIjtcbiAgICAgICAgaWYgKHRoaXMuc2tpcHBlZFN0ci5sZW5ndGggPiAwKVxuICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gdGhpcy5za2lwcGVkU3RyLnN1YnN0cmluZyhcbiAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgIHRoaXMuc2tpcHBlZFN0ci5sZW5ndGggLSAyXG4gICAgICAgICAgICApO1xuICAgICAgICBlbHNlIHRoaXMuc2tpcHBlZFN0ciA9IFwiTm9uZVwiO1xuICAgICAgICBpZiAodGhpcy5pbmNvcnJlY3RTdHIubGVuZ3RoID4gMClcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gdGhpcy5pbmNvcnJlY3RTdHIuc3Vic3RyaW5nKFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RTdHIubGVuZ3RoIC0gMlxuICAgICAgICAgICAgKTtcbiAgICAgICAgZWxzZSB0aGlzLmluY29ycmVjdFN0ciA9IFwiTm9uZVwiO1xuICAgIH1cbiAgICBmaW5kVGltZVRha2VuKCkge1xuICAgICAgICBpZiAodGhpcy5saW1pdGVkVGltZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0aGlzLnN0YXJ0aW5nVGltZSAtIHRoaXMudGltZUxpbWl0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0aGlzLnRpbWVMaW1pdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdG9yZVNjb3JlKCkge1xuICAgICAgICB2YXIgc3RvcmFnZV9hcnIgPSBbXTtcbiAgICAgICAgc3RvcmFnZV9hcnIucHVzaChcbiAgICAgICAgICAgIHRoaXMuc2NvcmUsXG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIsXG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCxcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyLFxuICAgICAgICAgICAgdGhpcy5za2lwcGVkLFxuICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyLFxuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW5cbiAgICAgICAgKTtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgYW5zd2VyOiBzdG9yYWdlX2FycixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICB9KTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSwgc3RvcmFnZU9iaik7XG4gICAgfVxuICAgIC8vIF9gdGltZWQgZXhhbSBlbmRwb2ludCBwYXJhbWV0ZXJzYFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIGxvZ1Njb3JlKCkge1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJ0aW1lZEV4YW1cIixcbiAgICAgICAgICAgIGFjdDogXCJmaW5pc2hcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuc2NvcmUsXG4gICAgICAgICAgICBpbmNvcnJlY3Q6IHRoaXMuaW5jb3JyZWN0LFxuICAgICAgICAgICAgc2tpcHBlZDogdGhpcy5za2lwcGVkLFxuICAgICAgICAgICAgdGltZV90YWtlbjogdGhpcy50aW1lVGFrZW4sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG91bGRVc2VTZXJ2ZXIoZGF0YSkge1xuICAgICAgICAvLyBXZSBvdmVycmlkZSB0aGUgUnVuZXN0b25lQmFzZSB2ZXJzaW9uIGJlY2F1c2UgdGhlcmUgaXMgbm8gXCJjb3JyZWN0XCIgYXR0cmlidXRlLCBhbmQgdGhlcmUgYXJlIDIgcG9zc2libGUgbG9jYWxTdG9yYWdlIHNjaGVtYXNcbiAgICAgICAgLy8gLS13ZSBhbHNvIHdhbnQgdG8gZGVmYXVsdCB0byBsb2NhbCBzdG9yYWdlIGJlY2F1c2UgaXQgY29udGFpbnMgbW9yZSBpbmZvcm1hdGlvbiBzcGVjaWZpY2FsbHkgd2hpY2ggcXVlc3Rpb25zIGFyZSBjb3JyZWN0LCBpbmNvcnJlY3QsIGFuZCBza2lwcGVkLlxuICAgICAgICB2YXIgc3RvcmFnZURhdGU7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgaWYgKHN0b3JhZ2VPYmogPT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKHN0b3JhZ2VPYmopLmFuc3dlcjtcbiAgICAgICAgICAgIGlmIChzdG9yZWREYXRhLmxlbmd0aCA9PSA0KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvcnJlY3QgPT0gc3RvcmVkRGF0YVswXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLmluY29ycmVjdCA9PSBzdG9yZWREYXRhWzFdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2tpcHBlZCA9PSBzdG9yZWREYXRhWzJdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudGltZVRha2VuID09IHN0b3JlZERhdGFbM11cbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yZWREYXRhLmxlbmd0aCA9PSA3KSB7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICBkYXRhLmNvcnJlY3QgPT0gc3RvcmVkRGF0YVswXSAmJlxuICAgICAgICAgICAgICAgICAgICBkYXRhLmluY29ycmVjdCA9PSBzdG9yZWREYXRhWzJdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc2tpcHBlZCA9PSBzdG9yZWREYXRhWzRdICYmXG4gICAgICAgICAgICAgICAgICAgIGRhdGEudGltZVRha2VuID09IHN0b3JlZERhdGFbNl1cbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBJbiB0aGlzIGNhc2UsIGJlY2F1c2UgbG9jYWwgc3RvcmFnZSBoYXMgbW9yZSBpbmZvLCB3ZSB3YW50IHRvIHVzZSB0aGF0IGlmIGl0J3MgY29uc2lzdGVudFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0b3JhZ2VEYXRlID0gbmV3IERhdGUoSlNPTi5wYXJzZShzdG9yYWdlT2JqWzFdKS50aW1lc3RhbXApO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIubWVzc2FnZSk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzZXJ2ZXJEYXRlID0gbmV3IERhdGUoZGF0YS50aW1lc3RhbXApO1xuICAgICAgICBpZiAoc2VydmVyRGF0ZSA8IHN0b3JhZ2VEYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ1Njb3JlKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlbiA9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycyhcIlwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRha2VuID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIHRoaXMudGFrZW4gPSAxO1xuICAgICAgICB2YXIgdG1wQXJyO1xuICAgICAgICBpZiAoZGF0YSA9PT0gXCJcIikge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgc3RvcmFnZU9iajtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3RvcmFnZU9iaiA9IEpTT04ucGFyc2UoXG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB0bXBBcnIgPSBzdG9yYWdlT2JqLmFuc3dlcjtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHBhcnNpbmcgc3RvcmVkIFRpbWVkIGRhdGEgZm9yICR7dGhpcy5kaXZpZH06ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JhZ2VPYmoudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgIHRoaXMudGFrZW4gPSAwO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFBhcnNlIHJlc3VsdHMgZnJvbSB0aGUgZGF0YWJhc2VcbiAgICAgICAgICAgIHRtcEFyciA9IFtcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLmNvcnJlY3QpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGRhdGEuaW5jb3JyZWN0KSxcbiAgICAgICAgICAgICAgICBwYXJzZUludChkYXRhLnNraXBwZWQpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KGRhdGEudGltZV90YWtlbiksXG4gICAgICAgICAgICAgICAgZGF0YS5yZXNldCxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh0bXBBcnIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0bXBBcnIubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIC8vIEV4YW0gd2FzIHByZXZpb3VzbHkgcmVzZXRcbiAgICAgICAgICAgIHRoaXMucmVzZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy50YWtlbiA9IDA7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRtcEFyci5sZW5ndGggPT0gNCkge1xuICAgICAgICAgICAgLy8gQWNjaWRlbnRhbCBSZWxvYWQgT1IgRGF0YWJhc2UgRW50cnlcbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsxXTtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gdG1wQXJyWzNdO1xuICAgICAgICB9IGVsc2UgaWYgKHRtcEFyci5sZW5ndGggPT0gNSkge1xuICAgICAgICAgICAgdGhpcy5zY29yZSA9IHRtcEFyclswXTtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gdG1wQXJyWzFdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkID0gdG1wQXJyWzJdO1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0bXBBcnJbM107XG4gICAgICAgIH0gZWxzZSBpZiAodG1wQXJyLmxlbmd0aCA9PSA3KSB7XG4gICAgICAgICAgICAvLyBMb2FkZWQgQ29tcGxldGVkIEV4YW1cbiAgICAgICAgICAgIHRoaXMuc2NvcmUgPSB0bXBBcnJbMF07XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIgPSB0bXBBcnJbMV07XG4gICAgICAgICAgICB0aGlzLmluY29ycmVjdCA9IHRtcEFyclsyXTtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyID0gdG1wQXJyWzNdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkID0gdG1wQXJyWzRdO1xuICAgICAgICAgICAgdGhpcy5za2lwcGVkU3RyID0gdG1wQXJyWzVdO1xuICAgICAgICAgICAgdGhpcy50aW1lVGFrZW4gPSB0bXBBcnJbNl07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTZXQgbG9jYWxTdG9yYWdlIGluIGNhc2Ugb2YgXCJhY2NpZGVudGFsXCIgcmVsb2FkXG4gICAgICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0ID0gMDtcbiAgICAgICAgICAgIHRoaXMuc2tpcHBlZCA9IHRoaXMucmVuZGVyZWRRdWVzdGlvbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMudGltZVRha2VuID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50YWtlbikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2tpcHBlZCA9PT0gdGhpcy5yZW5kZXJlZFF1ZXN0aW9uQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93RmVlZGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUHJldkFzc2Vzc21lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLnJlbmRlclRpbWVkUXVlc3Rpb24oKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5U2NvcmUoKTtcbiAgICAgICAgdGhpcy5zaG93VGltZSgpO1xuICAgIH1cbiAgICBzZXRMb2NhbFN0b3JhZ2UocGFyc2VkRGF0YSkge1xuICAgICAgICB2YXIgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgdmFyIHN0b3JhZ2VPYmogPSB7XG4gICAgICAgICAgICBhbnN3ZXI6IHBhcnNlZERhdGEsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IHRpbWVTdGFtcCxcbiAgICAgICAgfTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICB0aGlzLmxvY2FsU3RvcmFnZUtleSgpLFxuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoc3RvcmFnZU9iailcbiAgICAgICAgKTtcbiAgICB9XG4gICAgZGlzcGxheVNjb3JlKCkge1xuICAgICAgICBpZiAodGhpcy5zaG93UmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIHNjb3JlU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIHZhciBudW1RdWVzdGlvbnM7XG4gICAgICAgICAgICB2YXIgcGVyY2VudENvcnJlY3Q7XG4gICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIHNvbWUgaW5mb3JtYXRpb25cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RTdHIubGVuZ3RoID4gMCB8fFxuICAgICAgICAgICAgICAgIHRoaXMuaW5jb3JyZWN0U3RyLmxlbmd0aCA+IDAgfHxcbiAgICAgICAgICAgICAgICB0aGlzLnNraXBwZWRTdHIubGVuZ3RoID4gMFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgPSBgTnVtIENvcnJlY3Q6ICR7dGhpcy5zY29yZX0uIFF1ZXN0aW9uczogJHt0aGlzLmNvcnJlY3RTdHJ9PGJyPk51bSBXcm9uZzogJHt0aGlzLmluY29ycmVjdH0uIFF1ZXN0aW9uczogJHt0aGlzLmluY29ycmVjdFN0cn08YnI+TnVtIFNraXBwZWQ6ICR7dGhpcy5za2lwcGVkfS4gUXVlc3Rpb25zOiAke3RoaXMuc2tpcHBlZFN0cn08YnI+YDtcbiAgICAgICAgICAgICAgICBudW1RdWVzdGlvbnMgPSB0aGlzLnNjb3JlICsgdGhpcy5pbmNvcnJlY3QgKyB0aGlzLnNraXBwZWQ7XG4gICAgICAgICAgICAgICAgcGVyY2VudENvcnJlY3QgPSAodGhpcy5zY29yZSAvIG51bVF1ZXN0aW9ucykgKiAxMDA7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgKz1cbiAgICAgICAgICAgICAgICAgICAgXCJQZXJjZW50IENvcnJlY3Q6IFwiICsgcGVyY2VudENvcnJlY3QudG9GaXhlZCgyKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChzY29yZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzY29yZVN0cmluZyA9IGBOdW0gQ29ycmVjdDogJHt0aGlzLnNjb3JlfTxicj5OdW0gV3Jvbmc6ICR7dGhpcy5pbmNvcnJlY3R9PGJyPk51bSBTa2lwcGVkOiAke3RoaXMuc2tpcHBlZH08YnI+YDtcbiAgICAgICAgICAgICAgICBudW1RdWVzdGlvbnMgPSB0aGlzLnNjb3JlICsgdGhpcy5pbmNvcnJlY3QgKyB0aGlzLnNraXBwZWQ7XG4gICAgICAgICAgICAgICAgcGVyY2VudENvcnJlY3QgPSAodGhpcy5zY29yZSAvIG51bVF1ZXN0aW9ucykgKiAxMDA7XG4gICAgICAgICAgICAgICAgc2NvcmVTdHJpbmcgKz1cbiAgICAgICAgICAgICAgICAgICAgXCJQZXJjZW50IENvcnJlY3Q6IFwiICsgcGVyY2VudENvcnJlY3QudG9GaXhlZCgyKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChzY29yZVN0cmluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zY29yZURpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHROdW1iZXJlZExpc3QoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQodGhpcy5zY29yZURpdikuaHRtbChcbiAgICAgICAgICAgICAgICBcIlRoYW5rIHlvdSBmb3IgdGFraW5nIHRoZSBleGFtLiAgWW91ciBhbnN3ZXJzIGhhdmUgYmVlbiByZWNvcmRlZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWdobGlnaHROdW1iZXJlZExpc3QoKSB7XG4gICAgICAgIHZhciBjb3JyZWN0Q291bnQgPSB0aGlzLmNvcnJlY3RTdHI7XG4gICAgICAgIHZhciBpbmNvcnJlY3RDb3VudCA9IHRoaXMuaW5jb3JyZWN0U3RyO1xuICAgICAgICB2YXIgc2tpcHBlZENvdW50ID0gdGhpcy5za2lwcGVkU3RyO1xuICAgICAgICBjb3JyZWN0Q291bnQgPSBjb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIGluY29ycmVjdENvdW50ID0gaW5jb3JyZWN0Q291bnQucmVwbGFjZSgvIC9nLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgIHNraXBwZWRDb3VudCA9IHNraXBwZWRDb3VudC5yZXBsYWNlKC8gL2csIFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgJChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbnVtYmVyZWRCdG5zID0gJChcInVsI3BhZ2VOdW1zID4gdWwgPiBsaVwiKTtcbiAgICAgICAgICAgIGlmIChudW1iZXJlZEJ0bnMuaGFzQ2xhc3MoXCJhbnN3ZXJlZFwiKSkge1xuICAgICAgICAgICAgICAgIG51bWJlcmVkQnRucy5yZW1vdmVDbGFzcyhcImFuc3dlcmVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3JyZWN0Q291bnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHBhcnNlSW50KGNvcnJlY3RDb3VudFtpXSkgLSAxO1xuICAgICAgICAgICAgICAgIG51bWJlcmVkQnRuc1xuICAgICAgICAgICAgICAgICAgICAuZXEocGFyc2VJbnQoY29ycmVjdENvdW50W2ldKSAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImNvcnJlY3RDb3VudFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaW5jb3JyZWN0Q291bnQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBudW1iZXJlZEJ0bnNcbiAgICAgICAgICAgICAgICAgICAgLmVxKHBhcnNlSW50KGluY29ycmVjdENvdW50W2pdKSAtIDEpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhcImluY29ycmVjdENvdW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBza2lwcGVkQ291bnQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICBudW1iZXJlZEJ0bnNcbiAgICAgICAgICAgICAgICAgICAgLmVxKHBhcnNlSW50KHNraXBwZWRDb3VudFtrXSkgLSAxKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoXCJza2lwcGVkQ291bnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gRnVuY3Rpb24gdGhhdCBjYWxscyB0aGUgY29uc3RydWN0b3JzIG9uIHBhZ2UgbG9hZCA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuJChkb2N1bWVudCkub24oXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICQoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW3RoaXMuaWRdID0gbmV3IFRpbWVkKHtcbiAgICAgICAgICAgIG9yaWc6IHRoaXMsXG4gICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJpbXBvcnQge01hdGNoaW5nUHJvYmxlbX0gZnJvbSBcIi4vbWF0Y2hpbmcuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRNYXRjaGluZyBleHRlbmRzIE1hdGNoaW5nUHJvYmxlbSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBoaWRlQnV0dG9ucygpIHtcbiAgICAgICAgdGhpcy5ncmFkZUJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHRoaXMuaGVscEJ0bi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuXG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgY29tcG9uZW50LnByZXBlbmQodGltZUljb25EaXYpO1xuICAgIH1cblxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgdGhpcy5jb25uTGlzdC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuXG4gICAgcmVpbml0aWFsaXplTGlzdGVuZXJzKCkge1xuICAgICAgICAvLyBtYXliZSBuZWVkIHRvIHJlaW5pdGlhbGl6ZSB0aGUgbGlzdGVuZXJzXG4gICAgfVxufVxuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5Lm1hdGNoaW5nID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkTWF0Y2hpbmcob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTWF0Y2hpbmdQcm9ibGVtKG9wdHMpO1xufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==