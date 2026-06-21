"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_mchoice_js_timedmc_js"],{

/***/ 52539:
/*!*******************************************!*\
  !*** ./runestone/mchoice/css/mchoice.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 84270:
/*!*****************************************!*\
  !*** ./runestone/mchoice/js/mchoice.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MultipleChoice)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _css_mchoice_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/mchoice.css */ 52539);
/*==========================================
========      Master mchoice.js     =========
============================================
===  This file contains the JS for the   ===
=== Runestone multiple choice component. ===
============================================
===              Created By              ===
===           Isaiah Mayerchak           ===
===                 and                  ===
===             Kirby Olson              ===
===                6/4/15                ===
==========================================*/


//import "./../styles/runestone-custom-sphinx-bootstrap.css";


// MC constructor
class MultipleChoice extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        opts = opts || {};
        var orig = opts.orig; // entire <ul> element
        this.origElem = orig;
        this.useRunestoneServices = opts.useRunestoneServices;
        this.multipleanswers = false;
        this.divid = orig.id;
        if (this.parseBooleanAttribute(this.origElem, "data-multipleanswers")) {
            this.multipleanswers = true;
        }
        this.children = this.origElem.childNodes;
        this.random = false;
        if (this.parseBooleanAttribute(this.origElem, "data-random")) {
            this.random = true;
        }
        this.correct = null;
        this.didSubmit = false;
        this.answerList = [];
        this.correctList = [];
        this.correctIndexList = [];
        this.feedbackList = [];
        this.question = null;
        this.caption = "Multiple Choice";
        this.findAnswers();
        this.findQuestion();
        this.findFeedbacks();
        this.createCorrectList();
        this.createMCForm();
        this.addCaption("runestone");
        this.checkServer("mChoice", true);
        // https://docs.mathjax.org/en/latest/options/startup/startup.html
        // https://docs.mathjax.org/en/latest/web/configuration.html#startup-action
        // runestoneMathReady is defined in the preamble for all PTX authored books
        this.queueMathJax(this.containerDiv);
        if (typeof Prism !== "undefined") {
            Prism.highlightAllUnder(this.containerDiv);
        }
    }

    /*====================================
    ==== Functions parsing variables  ====
    ====  out of intermediate HTML    ====
    ====================================*/
    findQuestion() {
        // Old HTML format had question inside ul
        // Newer format has a div.exercise-statement that is a part of the ul's parent
        // Check for newer format...
        const exStatement = this.origElem.parentElement.querySelector('.exercise-statement');
        if (exStatement) {
            this.question = exStatement;
        } else {
            //Older format
            var delimiter;
            for (var i = 0; i < this.origElem.childNodes.length; i++) {
                if (this.origElem.childNodes[i].nodeName === "LI") {
                    delimiter = this.origElem.childNodes[i].outerHTML;
                    break;
                }
            }
            var fulltext = this.origElem.innerHTML;
            var temp = fulltext.split(delimiter);
            this.question = temp[0];
        }
    }

    findAnswers() {
        // Creates answer objects and pushes them to answerList
        // format: ID, Correct bool, Content (text)
        var ChildAnswerList = [];
        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.nodeType === Node.ELEMENT_NODE && child.matches("[data-component=answer]")) {
                ChildAnswerList.push(child);
            }
        }
        for (var j = 0; j < ChildAnswerList.length; j++) {
            var answer_id = ChildAnswerList[j].id;
            var is_correct = false;
            if (ChildAnswerList[j].hasAttribute("data-correct")) {
                // If data-correct attribute exists, answer is correct
                is_correct = true;
            }
            var answer_text = ChildAnswerList[j].innerHTML;
            var answer_object = {
                id: answer_id,
                correct: is_correct,
                content: answer_text,
            };
            this.answerList.push(answer_object);
        }
    }

    findFeedbacks() {
        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (child.nodeType === Node.ELEMENT_NODE && child.matches("[data-component=feedback]")) {
                this.feedbackList.push(child.innerHTML);
            }
        }
    }

    createCorrectList() {
        // Creates array that holds the ID"s of correct answers
        // Also populates an array that holds the indeces of correct answers
        for (var i = 0; i < this.answerList.length; i++) {
            if (this.answerList[i].correct) {
                this.correctList.push(this.answerList[i].id);
                this.correctIndexList.push(i);
            }
        }
    }

    /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
    createMCForm() {
        this.renderMCContainer();
        this.renderMCForm(); // renders the form with options and buttons
        this.renderMCfeedbackDiv();
        // replaces intermediate HTML with rendered HTML
        this.origElem.replaceWith(this.containerDiv);
    }

    renderMCContainer() {
        this.containerDiv = document.createElement("div");
        this.questionDiv = document.createElement("div");
        // this.question may be an element or text - need to handle both cases
        if (typeof this.question === "string") {
            this.questionDiv.innerHTML = this.question;
        } else {
            this.questionDiv.appendChild(this.question);
        }
        this.questionDiv.id = this.divid + "_prompt";
        this.questionDiv.className = "exercise-statement";
        this.containerDiv.appendChild(this.questionDiv);
        const origClass = this.origElem.getAttribute("class");
        if (origClass) {
            this.containerDiv.classList.add(...origClass.split(" ").filter(Boolean));
        }
        this.containerDiv.classList.add("mchoice");
        this.containerDiv.id = this.divid;
    }

    renderMCForm() {
        this.optsForm = document.createElement("form");
        this.optsForm.id = this.divid + "_form";
        this.optsForm.method = "get";
        this.optsForm.action = "";
        this.optsForm.onsubmit = function () { return false; };
        // Add fieldset and legend for accessibility
        this.optsFieldSet = document.createElement("fieldset");
        this.optsFieldSet.setAttribute("role", "radiogroup");
        this.optsFieldSet.setAttribute("aria-labelledby", this.divid + "_prompt");
        this.optsForm.appendChild(this.optsFieldSet);
        // generate form options
        this.renderMCFormOpts();
        this.renderMCFormButtons();
        // Append the form to the container
        let legend = document.createElement("legend");
        if (this.multipleanswers) {
            legend.textContent = "Choose all that apply";
        } else {
            legend.textContent = "Choose one";
        }
        this.optsFieldSet.appendChild(legend);
        this.containerDiv.appendChild(this.optsForm);
    }

    renderMCFormOpts() {
        // creates input DOM elements
        this.optionArray = []; // array with an object for each option containing the input and label for that option
        var input_type = "radio";
        if (this.multipleanswers) {
            input_type = "checkbox";
        }
        // this.indexArray is used to index through the answers
        // it is just 0-n normally, but the order is shuffled if the random option is present
        this.indexArray = [];
        for (var i = 0; i < this.answerList.length; i++) {
            this.indexArray.push(i);
        }
        if (this.random) {
            this.randomizeAnswers();
        }
        let self = this;
        let answerFunc = function () {
            self.isAnswered = true;
        };
        for (var j = 0; j < this.answerList.length; j++) {
            var k = this.indexArray[j];
            var optid = this.divid + "_opt_" + k;
            // Create the label for the input
            var label = document.createElement("label");
            label.className = "mchoice-option";
            // If the content begins with a ``<p>``, put the label inside of it. (Sphinx 2.0 puts all content in a ``<p>``, while Sphinx 1.8 doesn't).
            var content = this.answerList[k].content;
            var prefix = "";
            if (content.startsWith("<p>")) {
                prefix = "<p>";
                content = content.slice(3);
            }
            label.innerHTML =
                `${prefix}<input type="${input_type}" name="group1" value="${k}" id="${optid}" class="mchoice-input">` +
                `${String.fromCharCode("A".charCodeAt(0) + j)}. ${content}`;
            // create the object to store in optionArray
            var inputEl = label.querySelector("input");
            var optObj = {
                input: inputEl,
                label: label,
            };
            optObj.input.onclick = answerFunc;

            this.optionArray.push(optObj);
            // add the option to the form
            this.optsFieldSet.appendChild(label);
        }
    }

    renderMCFormButtons() {
        // submit and compare me buttons
        // Create submit button
        this.submitButton = document.createElement("button");
        this.submitButton.textContent = "Check Me";
        this.submitButton.className = "btn btn-success";
        this.submitButton.name = "do answer";
        this.submitButton.type = "button";
        if (this.multipleanswers) {
            this.submitButton.addEventListener(
                "click",
                function () {
                    this.processMCMASubmission(true);
                }.bind(this),
                false
            );
        } else {
            this.submitButton.addEventListener(
                "click",
                function (ev) {
                    ev.preventDefault();
                    this.processMCMFSubmission(true);
                }.bind(this),
                false
            );
        } // end else
        this.optsForm.appendChild(this.submitButton);
        // Create compare button
        if (this.useRunestoneServices && !eBookConfig.peer) {
            this.compareButton = document.createElement("button");
            this.compareButton.className = "btn btn-default";
            this.compareButton.id = this.divid + "_bcomp";
            this.compareButton.disabled = true;
            this.compareButton.name = "compare";
            this.compareButton.textContent = "Compare me";
            this.compareButton.addEventListener(
                "click",
                function () {
                    this.compareAnswers(this.divid);
                }.bind(this),
                false
            );
            this.optsForm.appendChild(this.compareButton);
        }
    }

    renderMCfeedbackDiv() {
        this.feedBackDiv = document.createElement("div");
        this.feedBackDiv.id = this.divid + "_feedback";
        this.feedBackDiv.setAttribute("aria-live", "polite");
        this.feedBackDiv.setAttribute("role", "status");
        this.containerDiv.appendChild(this.feedBackDiv);
    }

    randomizeAnswers() {
        // Makes the ordering of the answer choices random
        var currentIndex = this.indexArray.length,
            temporaryValue,
            randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = this.indexArray[currentIndex];
            this.indexArray[currentIndex] = this.indexArray[randomIndex];
            this.indexArray[randomIndex] = temporaryValue;
            var temporaryFeedback = this.feedbackList[currentIndex];
            this.feedbackList[currentIndex] = this.feedbackList[randomIndex];
            this.feedbackList[randomIndex] = temporaryFeedback;
        }
    }

    /*===================================
    === Checking/loading from storage ===
    ===================================*/
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        var answers = data.answer.split(",");
        for (var a = 0; a < answers.length; a++) {
            var index = answers[a];
            for (var b = 0; b < this.optionArray.length; b++) {
                if (this.optionArray[b].input.value == index) {
                    this.optionArray[b].input.checked = true;
                }
            }
        }
        if (this.multipleanswers) {
            this.processMCMASubmission(false);
        } else {
            this.processMCMFSubmission(false);
        }
    }

    checkLocalStorage() {
        // Repopulates MCMA questions with a user's previous answers,
        // which were stored into local storage.
        var storedData;
        var answers;
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            let error = false;
            if (ex !== null) {
                try {
                    storedData = JSON.parse(ex);
                    answers = storedData.answer.split(",");
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(`Error parsing stored mchoice data for ${this.divid}: ${err.message}`);
                    error = true;
                }
                if (error || storedData.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                for (var a = 0; a < answers.length; a++) {
                    var index = answers[a];
                    for (var b = 0; b < this.optionArray.length; b++) {
                        if (this.optionArray[b].input.value == index) {
                            this.optionArray[b].input.checked = true;
                        }
                    }
                }
                if (this.useRunestoneServices) {
                    this.enableMCComparison();
                    this.getSubmittedOpts(); // to populate givenlog for logging
                    if (this.multipleanswers) {
                        this.logMCMAsubmission();
                    } else {
                        this.logMCMFsubmission();
                    }
                }
            }
        }
    }

    setLocalStorage(data) {
        var timeStamp = new Date();
        var storageObj = {
            answer: data.answer,
            timestamp: timeStamp,
            correct: data.correct,
        };
        localStorage.setItem(
            this.localStorageKey(),
            JSON.stringify(storageObj)
        );
    }

    /*===============================
    === Processing MC Submissions ===
    ===============================*/
    processMCMASubmission(logFlag) {
        // Called when the submit button is clicked
        this.getSubmittedOpts(); // make sure this.givenArray is populated
        this.scoreMCMASubmission();
        this.setLocalStorage({
            correct: this.correct ? "T" : "F",
            answer: this.givenArray.join(","),
        });
        if (logFlag) {
            this.logMCMAsubmission();
        }
        if (!eBookConfig.peer || eBookConfig.isInstructor) {
            this.renderMCMAFeedBack();
            if (this.useRunestoneServices) {
                this.enableMCComparison();
            }
        } else {
            // acknowledge submission
            if (eBookConfig.peer &&
                eBookConfig.peerMode === "async" &&
                typeof studentVoteCount !== "undefined" &&
                studentVoteCount > 1) {
                this.renderMCMAFeedBack();
            } else {
                this.feedBackDiv.innerHTML = "<p>Your answer has been recorded</p>";
                this.feedBackDiv.className = "alert alert-info";
            }
        }
        this.didSubmit = true;
    }

    getSubmittedOpts() {
        var given;
        this.singlefeedback = ""; // Used for MCMF questions
        this.feedbackString = ""; // Used for MCMA questions
        this.givenArray = [];
        this.givenlog = "";
        var buttonObjs = this.optsForm.elements.group1;
        for (var i = 0; i < buttonObjs.length; i++) {
            if (buttonObjs[i].checked) {
                given = buttonObjs[i].value;
                this.givenArray.push(given);
                this.feedbackString += `<li value="${i + 1}">${this.feedbackList[i]
                    }</li>`;
                this.givenlog += given + ",";
                this.singlefeedback = this.feedbackList[i];
            }
        }
        this.givenArray.sort();
    }

    checkCurrentAnswer() {
        this.getSubmittedOpts();
        if (this.givenArray.length === 0) {
            return;
        }
        if (this.multipleanswers) {
            this.scoreMCMASubmission();
        } else {
            this.scoreMCMFSubmission();
        }
    }

    async logCurrentAnswer(sid) {
        if (this.multipleanswers) {
            await this.logMCMAsubmission(sid);
        } else {
            await this.logMCMFsubmission(sid);
        }
    }

    renderFeedback() {
        if (this.multipleanswers) {
            this.renderMCMAFeedBack();
        } else {
            this.renderMCMFFeedback();
        }
        this.queueMathJax(this.feedBackDiv);
    }
    scoreMCMASubmission() {
        this.correctCount = 0;
        var correctIndex = 0;
        var givenIndex = 0;
        while (
            correctIndex < this.correctIndexList.length &&
            givenIndex < this.givenArray.length
        ) {
            if (
                this.givenArray[givenIndex] <
                this.correctIndexList[correctIndex]
            ) {
                givenIndex++;
            } else if (
                this.givenArray[givenIndex] ==
                this.correctIndexList[correctIndex]
            ) {
                this.correctCount++;
                givenIndex++;
                correctIndex++;
            } else {
                correctIndex++;
            }
        }
        var numGiven = this.givenArray.length;
        var numCorrect = this.correctCount;
        var numNeeded = this.correctList.length;
        this.answer = this.givenArray.join(",");
        this.correct = numCorrect === numNeeded && numNeeded === numGiven;
        if (numGiven === numNeeded) {
            this.percent = numCorrect / numNeeded;
        } else {
            this.percent = numCorrect / Math.max(numGiven, numNeeded);
        }
    }

    async logMCMAsubmission(sid) {
        var answer = this.answer || "";
        var correct = this.correct || false;
        var logAnswer =
            "answer:" + answer + ":" + (correct == true ? "correct" : "no");
        let data = {
            event: "mChoice",
            act: logAnswer,
            answer: answer,
            correct: correct,
            div_id: this.divid,
        };
        if (eBookConfig.peer && typeof studentVoteCount !== "undefined") {
            data.act = data.act + `:vote${studentVoteCount}`;
        }
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderMCMAFeedBack() {
        var answerStr = "answers";
        var numGiven = this.givenArray.length;
        if (numGiven === 1) {
            answerStr = "answer";
        }
        var numCorrect = this.correctCount;
        var numNeeded = this.correctList.length;
        var feedbackText = this.feedbackString;
        if (this.correct) {
            this.feedBackDiv.innerHTML = `✔️ <ol type="A">${feedbackText}</ul>`;
            this.feedBackDiv.className = "alert alert-info";
        } else {
            this.feedBackDiv.innerHTML =
                `✖️ You gave ${numGiven} ${answerStr} and got ${numCorrect} correct of ${numNeeded} needed.<ol type="A">${feedbackText}</ul>`;
            this.feedBackDiv.className = "alert alert-danger";
        }
        this.queueMathJax(this.feedBackDiv);
    }

    processMCMFSubmission(logFlag) {
        // Called when the submit button is clicked
        this.getSubmittedOpts(); // make sure this.givenArray is populated
        this.scoreMCMFSubmission();
        this.setLocalStorage({
            correct: this.correct ? "T" : "F",
            answer: this.givenArray.join(","),
        });
        if (logFlag) {
            this.logMCMFsubmission();
        }
        if (!eBookConfig.peer || eBookConfig.isInstructor) {
            this.renderMCMFFeedback();
            if (this.useRunestoneServices) {
                this.enableMCComparison();
            }
        } else {
            if (eBookConfig.peer &&
                eBookConfig.peerMode === "async" &&
                typeof studentVoteCount !== "undefined" &&
                studentVoteCount > 1) {
                this.renderMCMAFeedBack();
            } else {
                this.feedBackDiv.innerHTML = "<p>Your answer has been recorded</p>";
                this.feedBackDiv.className = "alert alert-info";
            }
        }
        this.didSubmit = true;
    }

    scoreMCMFSubmission() {
        this.answer = this.givenArray[0];
        if (this.givenArray[0] == this.correctIndexList[0]) {
            this.correct = true;
            this.percent = 1.0;
        } else if (this.givenArray[0] != null) {
            // if given is null then the question wasn"t answered and should be counted as skipped
            this.correct = false;
            this.percent = 0.0;
        }
    }

    async logMCMFsubmission(sid) {
        // If there's no answer provided (the array is empty), use a blank for the answer.
        var answer = this.givenArray[0] || "";
        var correct =
            this.givenArray[0] == this.correctIndexList[0] ? "T" : "F";
        var logAnswer =
            "answer:" + answer + ":" + (correct == "T" ? "correct" : "no"); // backward compatible
        let data = {
            event: "mChoice",
            act: logAnswer,
            answer: answer,
            correct: correct,
            div_id: this.divid,
        };
        if (eBookConfig.peer && typeof studentVoteCount !== "undefined") {
            data.act = data.act + `:vote${studentVoteCount}`;
        }
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
    }

    renderMCMFFeedback() {
        let correct = this.givenArray[0] == this.correctIndexList[0];
        let feedbackText = this.singlefeedback;

        if (correct) {
            this.feedBackDiv.innerHTML = "✔️ " + feedbackText;
            this.feedBackDiv.className = "alert alert-info"; // use blue for better red/green blue color blindness
        } else {
            if (feedbackText == null) {
                feedbackText = "";
            }
            this.feedBackDiv.innerHTML = "✖️ " + feedbackText;
            this.feedBackDiv.className = "alert alert-danger";
        }
        this.queueMathJax(this.feedBackDiv);
    }
    enableMCComparison() {
        if (eBookConfig.enableCompareMe) {
            this.compareButton.disabled = false;
        }
    }
    instructorMchoiceModal(data) {
        // data.reslist -- student and their answers
        // data.answerDict    -- answers and count
        // data.correct - correct answer
        var res = "<table><tr><th>Student</th><th>Answer(s)</th></tr>";
        for (var i in data) {
            res +=
                "<tr><td>" +
                data[i][0] +
                "</td><td>" +
                data[i][1] +
                "</td></tr>";
        }
        res += "</table>";
        return res;
    }
    compareModal(data, status, whatever) {
        var datadict = data.detail;
        var answers = datadict.answerDict;
        var misc = datadict.misc;
        var kl = Object.keys(answers).sort();
        var body = "<table>";
        body += "<tr><th>Answer</th><th>Percent</th></tr>";
        var theClass = "";
        for (var k in kl) {
            if (kl[k] === misc.correct) {
                theClass = "success";
            } else {
                theClass = "info";
            }
            body +=
                "<tr><td>" + kl[k] + "</td><td class='compare-me-progress'>";
            var pct = answers[kl[k]] + "%";
            body += "<div class='progress'>";
            body +=
                "    <div class='progress-bar progress-bar-" +
                theClass +
                "' style='width:" +
                pct +
                ";'>" +
                pct;
            body += "    </div>";
            body += "</div></td></tr>";
        }
        body += "</table>";
        if (misc.yourpct !== "unavailable") {
            body +=
                "<br /><p>You have " +
                misc.yourpct +
                "% correct for all questions</p>";
        }
        if (datadict.reslist !== undefined) {
            body += this.instructorMchoiceModal(datadict.reslist);
        }
        // Create a simple modal without jQuery/Bootstrap
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(0,0,0,0.5)";
        overlay.style.zIndex = "9999";

        const dialog = document.createElement("div");
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
        closeBtn.setAttribute("aria-label", "Close");
        closeBtn.style.float = "right";
        closeBtn.className = "btn btn-light";
        closeBtn.onclick = function () {
            document.body.removeChild(overlay);
        };
        const title = document.createElement("h4");
        title.className = "modal-title";
        title.textContent = "Distribution of Answers";
        header.appendChild(closeBtn);
        header.appendChild(title);

        const modalBody = document.createElement("div");
        modalBody.innerHTML = body;

        dialog.appendChild(header);
        dialog.appendChild(modalBody);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }
    // _`compareAnswers`
    async compareAnswers() {
        var data = {};
        data.div_id = this.divid;
        data.course_name = eBookConfig.course;
        try {
            const params = new URLSearchParams(data);
            const resp = await fetch(`${eBookConfig.new_server_prefix}/assessment/getaggregateresults?${params.toString()}`);
            const json = await resp.json();
            this.compareModal(json);
        } catch (e) {
            console.error("Error fetching aggregate results:", e);
        }
    }

    disableInteraction() {
        for (var i = 0; i < this.optionArray.length; i++) {
            this.optionArray[i].input.disabled = true;
        }
    }

    enableInteraction() {
        for (var i = 0; i < this.optionArray.length; i++) {
            this.optionArray[i].input.disabled = false;
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document.querySelectorAll("[data-component=multiplechoice]").forEach(function (el, index) {
        // MC
        var opts = {
            orig: el,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if (!el.closest("[data-component=timedAssessment]")) {
            // If this element exists within a timed component, don't render it here
            window.componentMap[el.id] = new MultipleChoice(opts);
        }
    });
});


/***/ }),

/***/ 86001:
/*!*****************************************!*\
  !*** ./runestone/mchoice/js/timedmc.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedMC)
/* harmony export */ });
/* harmony import */ var _mchoice_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mchoice.js */ 84270);


class TimedMC extends _mchoice_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.containerDiv.classList.add("runestone");
        this.needsReinitialization = true;
        this.renderTimedIcon(this.MCContainer);
        this.hideButtons(); // Don't show per-question buttons in a timed assessment
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
    hideButtons() {
        //Just hiding the buttons doesn't prevent submitting the form when entering is clicked
        //We need to completely disable the buttons
        if (this.submitButton) {
            this.submitButton.setAttribute("disabled", "true");
            this.submitButton.style.display = "none";
        }
        if (this.compareButton) {
            this.compareButton.style.display = "none";
        }
    }

    // These methods override the methods in the base class. Called from renderFeedback()
    //
    renderMCMAFeedBack() {
        this.feedbackTimedMC();
    }
    renderMCMFFeedback(whatever, whateverr) {
        this.feedbackTimedMC();
    }
    feedbackTimedMC() {
        for (var i = 0; i < this.indexArray.length; i++) {
            var tmpindex = this.indexArray[i];
            this.feedBackEachArray[i].innerHTML =
                String.fromCharCode(65 + i) + ". " + this.feedbackList[i];
            var tmpid = this.answerList[tmpindex].id;
            if (this.correctList.indexOf(tmpid) >= 0) {
                this.feedBackEachArray[i].classList.add(
                    "alert",
                    "alert-success"
                );
            } else {
                this.feedBackEachArray[i].classList.add(
                    "alert",
                    "alert-danger"
                );
            }
        }
    }
    renderMCFormOpts() {
        super.renderMCFormOpts();
        this.feedBackEachArray = [];
        for (var j = 0; j < this.answerList.length; j++) {
            var k = this.indexArray[j];
            var feedBackEach = document.createElement("div");
            feedBackEach.id = this.divid + "_eachFeedback_" + k;
            feedBackEach.classList.add("eachFeedback");
            this.feedBackEachArray.push(feedBackEach);
            this.optsForm.appendChild(feedBackEach);
        }
    }
    checkCorrectTimedMCMA() {
        if (
            this.correctCount === this.correctList.length &&
            this.correctList.length === this.givenArray.length
        ) {
            this.correct = true;
        } else if (this.givenArray.length !== 0) {
            this.correct = false;
        } else {
            // question was skipped
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
    checkCorrectTimedMCMF() {
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
    checkCorrectTimed() {
        if (this.multipleanswers) {
            return this.checkCorrectTimedMCMA();
        } else {
            return this.checkCorrectTimedMCMF();
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.feedBackEachArray.length; i++) {
            this.feedBackEachArray[i].style.display = "none";
        }
    }

    reinitializeListeners() {
        let self = this;
        let answerFunc = function () {
            self.isAnswered = true;
        };
        for (let opt of this.optionArray) {
            opt.input.onclick = answerFunc;
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.multiplechoice = function (opts) {
    if (opts.timed) {
        return new TimedMC(opts);
    } else {
        return new _mchoice_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
    }
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDMXdCeUM7O0FBRTNCLHNCQUFzQixtREFBYztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qiw0QkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsbUNBQW1DO0FBQzNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLG1CQUFtQixtREFBYztBQUNqQztBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tY2hvaWNlL2Nzcy9tY2hvaWNlLmNzcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21jaG9pY2UvanMvbWNob2ljZS5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL21jaG9pY2UvanMvdGltZWRtYy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PT0gICAgICBNYXN0ZXIgbWNob2ljZS5qcyAgICAgPT09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciB0aGUgICA9PT1cbj09PSBSdW5lc3RvbmUgbXVsdGlwbGUgY2hvaWNlIGNvbXBvbmVudC4gPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIEJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgIGFuZCAgICAgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgIEtpcmJ5IE9sc29uICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA2LzQvMTUgICAgICAgICAgICAgICAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbi8vaW1wb3J0IFwiLi8uLi9zdHlsZXMvcnVuZXN0b25lLWN1c3RvbS1zcGhpbngtYm9vdHN0cmFwLmNzc1wiO1xuaW1wb3J0IFwiLi4vY3NzL21jaG9pY2UuY3NzXCI7XG5cbi8vIE1DIGNvbnN0cnVjdG9yXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdWx0aXBsZUNob2ljZSBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDx1bD4gZWxlbWVudFxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9IG9wdHMudXNlUnVuZXN0b25lU2VydmljZXM7XG4gICAgICAgIHRoaXMubXVsdGlwbGVhbnN3ZXJzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICBpZiAodGhpcy5wYXJzZUJvb2xlYW5BdHRyaWJ1dGUodGhpcy5vcmlnRWxlbSwgXCJkYXRhLW11bHRpcGxlYW5zd2Vyc1wiKSkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aXBsZWFuc3dlcnMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSB0aGlzLm9yaWdFbGVtLmNoaWxkTm9kZXM7XG4gICAgICAgIHRoaXMucmFuZG9tID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZSh0aGlzLm9yaWdFbGVtLCBcImRhdGEtcmFuZG9tXCIpKSB7XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5kaWRTdWJtaXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hbnN3ZXJMaXN0ID0gW107XG4gICAgICAgIHRoaXMuY29ycmVjdExpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0ID0gW107XG4gICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIk11bHRpcGxlIENob2ljZVwiO1xuICAgICAgICB0aGlzLmZpbmRBbnN3ZXJzKCk7XG4gICAgICAgIHRoaXMuZmluZFF1ZXN0aW9uKCk7XG4gICAgICAgIHRoaXMuZmluZEZlZWRiYWNrcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZUNvcnJlY3RMaXN0KCk7XG4gICAgICAgIHRoaXMuY3JlYXRlTUNGb3JtKCk7XG4gICAgICAgIHRoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIm1DaG9pY2VcIiwgdHJ1ZSk7XG4gICAgICAgIC8vIGh0dHBzOi8vZG9jcy5tYXRoamF4Lm9yZy9lbi9sYXRlc3Qvb3B0aW9ucy9zdGFydHVwL3N0YXJ0dXAuaHRtbFxuICAgICAgICAvLyBodHRwczovL2RvY3MubWF0aGpheC5vcmcvZW4vbGF0ZXN0L3dlYi9jb25maWd1cmF0aW9uLmh0bWwjc3RhcnR1cC1hY3Rpb25cbiAgICAgICAgLy8gcnVuZXN0b25lTWF0aFJlYWR5IGlzIGRlZmluZWQgaW4gdGhlIHByZWFtYmxlIGZvciBhbGwgUFRYIGF1dGhvcmVkIGJvb2tzXG4gICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgaWYgKHR5cGVvZiBQcmlzbSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09IEZ1bmN0aW9ucyBwYXJzaW5nIHZhcmlhYmxlcyAgPT09PVxuICAgID09PT0gIG91dCBvZiBpbnRlcm1lZGlhdGUgSFRNTCAgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBmaW5kUXVlc3Rpb24oKSB7XG4gICAgICAgIC8vIE9sZCBIVE1MIGZvcm1hdCBoYWQgcXVlc3Rpb24gaW5zaWRlIHVsXG4gICAgICAgIC8vIE5ld2VyIGZvcm1hdCBoYXMgYSBkaXYuZXhlcmNpc2Utc3RhdGVtZW50IHRoYXQgaXMgYSBwYXJ0IG9mIHRoZSB1bCdzIHBhcmVudFxuICAgICAgICAvLyBDaGVjayBmb3IgbmV3ZXIgZm9ybWF0Li4uXG4gICAgICAgIGNvbnN0IGV4U3RhdGVtZW50ID0gdGhpcy5vcmlnRWxlbS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5leGVyY2lzZS1zdGF0ZW1lbnQnKTtcbiAgICAgICAgaWYgKGV4U3RhdGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gZXhTdGF0ZW1lbnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL09sZGVyIGZvcm1hdFxuICAgICAgICAgICAgdmFyIGRlbGltaXRlcjtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vcmlnRWxlbS5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5ub2RlTmFtZSA9PT0gXCJMSVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGltaXRlciA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2Rlc1tpXS5vdXRlckhUTUw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBmdWxsdGV4dCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICAgICAgdmFyIHRlbXAgPSBmdWxsdGV4dC5zcGxpdChkZWxpbWl0ZXIpO1xuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbiA9IHRlbXBbMF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmaW5kQW5zd2VycygpIHtcbiAgICAgICAgLy8gQ3JlYXRlcyBhbnN3ZXIgb2JqZWN0cyBhbmQgcHVzaGVzIHRoZW0gdG8gYW5zd2VyTGlzdFxuICAgICAgICAvLyBmb3JtYXQ6IElELCBDb3JyZWN0IGJvb2wsIENvbnRlbnQgKHRleHQpXG4gICAgICAgIHZhciBDaGlsZEFuc3dlckxpc3QgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICAgICAgICBpZiAoY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGNoaWxkLm1hdGNoZXMoXCJbZGF0YS1jb21wb25lbnQ9YW5zd2VyXVwiKSkge1xuICAgICAgICAgICAgICAgIENoaWxkQW5zd2VyTGlzdC5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IENoaWxkQW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGFuc3dlcl9pZCA9IENoaWxkQW5zd2VyTGlzdFtqXS5pZDtcbiAgICAgICAgICAgIHZhciBpc19jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoQ2hpbGRBbnN3ZXJMaXN0W2pdLmhhc0F0dHJpYnV0ZShcImRhdGEtY29ycmVjdFwiKSkge1xuICAgICAgICAgICAgICAgIC8vIElmIGRhdGEtY29ycmVjdCBhdHRyaWJ1dGUgZXhpc3RzLCBhbnN3ZXIgaXMgY29ycmVjdFxuICAgICAgICAgICAgICAgIGlzX2NvcnJlY3QgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGFuc3dlcl90ZXh0ID0gQ2hpbGRBbnN3ZXJMaXN0W2pdLmlubmVySFRNTDtcbiAgICAgICAgICAgIHZhciBhbnN3ZXJfb2JqZWN0ID0ge1xuICAgICAgICAgICAgICAgIGlkOiBhbnN3ZXJfaWQsXG4gICAgICAgICAgICAgICAgY29ycmVjdDogaXNfY29ycmVjdCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiBhbnN3ZXJfdGV4dCxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmFuc3dlckxpc3QucHVzaChhbnN3ZXJfb2JqZWN0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRGZWVkYmFja3MoKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSAmJiBjaGlsZC5tYXRjaGVzKFwiW2RhdGEtY29tcG9uZW50PWZlZWRiYWNrXVwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tMaXN0LnB1c2goY2hpbGQuaW5uZXJIVE1MKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZUNvcnJlY3RMaXN0KCkge1xuICAgICAgICAvLyBDcmVhdGVzIGFycmF5IHRoYXQgaG9sZHMgdGhlIElEXCJzIG9mIGNvcnJlY3QgYW5zd2Vyc1xuICAgICAgICAvLyBBbHNvIHBvcHVsYXRlcyBhbiBhcnJheSB0aGF0IGhvbGRzIHRoZSBpbmRlY2VzIG9mIGNvcnJlY3QgYW5zd2Vyc1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYW5zd2VyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYW5zd2VyTGlzdFtpXS5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGlzdC5wdXNoKHRoaXMuYW5zd2VyTGlzdFtpXS5pZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3JyZWN0SW5kZXhMaXN0LnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT09ICAgRnVuY3Rpb25zIGdlbmVyYXRpbmcgZmluYWwgSFRNTCAgID09PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICBjcmVhdGVNQ0Zvcm0oKSB7XG4gICAgICAgIHRoaXMucmVuZGVyTUNDb250YWluZXIoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJNQ0Zvcm0oKTsgLy8gcmVuZGVycyB0aGUgZm9ybSB3aXRoIG9wdGlvbnMgYW5kIGJ1dHRvbnNcbiAgICAgICAgdGhpcy5yZW5kZXJNQ2ZlZWRiYWNrRGl2KCk7XG4gICAgICAgIC8vIHJlcGxhY2VzIGludGVybWVkaWF0ZSBIVE1MIHdpdGggcmVuZGVyZWQgSFRNTFxuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ0NvbnRhaW5lcigpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgLy8gdGhpcy5xdWVzdGlvbiBtYXkgYmUgYW4gZWxlbWVudCBvciB0ZXh0IC0gbmVlZCB0byBoYW5kbGUgYm90aCBjYXNlc1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucXVlc3Rpb24gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5xdWVzdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25EaXYuYXBwZW5kQ2hpbGQodGhpcy5xdWVzdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWVzdGlvbkRpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9wcm9tcHRcIjtcbiAgICAgICAgdGhpcy5xdWVzdGlvbkRpdi5jbGFzc05hbWUgPSBcImV4ZXJjaXNlLXN0YXRlbWVudFwiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnF1ZXN0aW9uRGl2KTtcbiAgICAgICAgY29uc3Qgb3JpZ0NsYXNzID0gdGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKTtcbiAgICAgICAgaWYgKG9yaWdDbGFzcykge1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZCguLi5vcmlnQ2xhc3Muc3BsaXQoXCIgXCIpLmZpbHRlcihCb29sZWFuKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZChcIm1jaG9pY2VcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICB9XG5cbiAgICByZW5kZXJNQ0Zvcm0oKSB7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICAgICAgdGhpcy5vcHRzRm9ybS5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mb3JtXCI7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0ubWV0aG9kID0gXCJnZXRcIjtcbiAgICAgICAgdGhpcy5vcHRzRm9ybS5hY3Rpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLm9wdHNGb3JtLm9uc3VibWl0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH07XG4gICAgICAgIC8vIEFkZCBmaWVsZHNldCBhbmQgbGVnZW5kIGZvciBhY2Nlc3NpYmlsaXR5XG4gICAgICAgIHRoaXMub3B0c0ZpZWxkU2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICB0aGlzLm9wdHNGaWVsZFNldC5zZXRBdHRyaWJ1dGUoXCJyb2xlXCIsIFwicmFkaW9ncm91cFwiKTtcbiAgICAgICAgdGhpcy5vcHRzRmllbGRTZXQuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbGxlZGJ5XCIsIHRoaXMuZGl2aWQgKyBcIl9wcm9tcHRcIik7XG4gICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQodGhpcy5vcHRzRmllbGRTZXQpO1xuICAgICAgICAvLyBnZW5lcmF0ZSBmb3JtIG9wdGlvbnNcbiAgICAgICAgdGhpcy5yZW5kZXJNQ0Zvcm1PcHRzKCk7XG4gICAgICAgIHRoaXMucmVuZGVyTUNGb3JtQnV0dG9ucygpO1xuICAgICAgICAvLyBBcHBlbmQgdGhlIGZvcm0gdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICBsZXQgbGVnZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxlZ2VuZFwiKTtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBsZWdlbmQudGV4dENvbnRlbnQgPSBcIkNob29zZSBhbGwgdGhhdCBhcHBseVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGVnZW5kLnRleHRDb250ZW50ID0gXCJDaG9vc2Ugb25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRzRmllbGRTZXQuYXBwZW5kQ2hpbGQobGVnZW5kKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5vcHRzRm9ybSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNGb3JtT3B0cygpIHtcbiAgICAgICAgLy8gY3JlYXRlcyBpbnB1dCBET00gZWxlbWVudHNcbiAgICAgICAgdGhpcy5vcHRpb25BcnJheSA9IFtdOyAvLyBhcnJheSB3aXRoIGFuIG9iamVjdCBmb3IgZWFjaCBvcHRpb24gY29udGFpbmluZyB0aGUgaW5wdXQgYW5kIGxhYmVsIGZvciB0aGF0IG9wdGlvblxuICAgICAgICB2YXIgaW5wdXRfdHlwZSA9IFwicmFkaW9cIjtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBpbnB1dF90eXBlID0gXCJjaGVja2JveFwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMuaW5kZXhBcnJheSBpcyB1c2VkIHRvIGluZGV4IHRocm91Z2ggdGhlIGFuc3dlcnNcbiAgICAgICAgLy8gaXQgaXMganVzdCAwLW4gbm9ybWFsbHksIGJ1dCB0aGUgb3JkZXIgaXMgc2h1ZmZsZWQgaWYgdGhlIHJhbmRvbSBvcHRpb24gaXMgcHJlc2VudFxuICAgICAgICB0aGlzLmluZGV4QXJyYXkgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFuc3dlckxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheS5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJhbmRvbSkge1xuICAgICAgICAgICAgdGhpcy5yYW5kb21pemVBbnN3ZXJzKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5hbnN3ZXJMaXN0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgayA9IHRoaXMuaW5kZXhBcnJheVtqXTtcbiAgICAgICAgICAgIHZhciBvcHRpZCA9IHRoaXMuZGl2aWQgKyBcIl9vcHRfXCIgKyBrO1xuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBsYWJlbCBmb3IgdGhlIGlucHV0XG4gICAgICAgICAgICB2YXIgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSBcIm1jaG9pY2Utb3B0aW9uXCI7XG4gICAgICAgICAgICAvLyBJZiB0aGUgY29udGVudCBiZWdpbnMgd2l0aCBhIGBgPHA+YGAsIHB1dCB0aGUgbGFiZWwgaW5zaWRlIG9mIGl0LiAoU3BoaW54IDIuMCBwdXRzIGFsbCBjb250ZW50IGluIGEgYGA8cD5gYCwgd2hpbGUgU3BoaW54IDEuOCBkb2Vzbid0KS5cbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gdGhpcy5hbnN3ZXJMaXN0W2tdLmNvbnRlbnQ7XG4gICAgICAgICAgICB2YXIgcHJlZml4ID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChjb250ZW50LnN0YXJ0c1dpdGgoXCI8cD5cIikpIHtcbiAgICAgICAgICAgICAgICBwcmVmaXggPSBcIjxwPlwiO1xuICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb250ZW50LnNsaWNlKDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFiZWwuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBgJHtwcmVmaXh9PGlucHV0IHR5cGU9XCIke2lucHV0X3R5cGV9XCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiJHtrfVwiIGlkPVwiJHtvcHRpZH1cIiBjbGFzcz1cIm1jaG9pY2UtaW5wdXRcIj5gICtcbiAgICAgICAgICAgICAgICBgJHtTdHJpbmcuZnJvbUNoYXJDb2RlKFwiQVwiLmNoYXJDb2RlQXQoMCkgKyBqKX0uICR7Y29udGVudH1gO1xuICAgICAgICAgICAgLy8gY3JlYXRlIHRoZSBvYmplY3QgdG8gc3RvcmUgaW4gb3B0aW9uQXJyYXlcbiAgICAgICAgICAgIHZhciBpbnB1dEVsID0gbGFiZWwucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xuICAgICAgICAgICAgdmFyIG9wdE9iaiA9IHtcbiAgICAgICAgICAgICAgICBpbnB1dDogaW5wdXRFbCxcbiAgICAgICAgICAgICAgICBsYWJlbDogbGFiZWwsXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgb3B0T2JqLmlucHV0Lm9uY2xpY2sgPSBhbnN3ZXJGdW5jO1xuXG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5LnB1c2gob3B0T2JqKTtcbiAgICAgICAgICAgIC8vIGFkZCB0aGUgb3B0aW9uIHRvIHRoZSBmb3JtXG4gICAgICAgICAgICB0aGlzLm9wdHNGaWVsZFNldC5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJNQ0Zvcm1CdXR0b25zKCkge1xuICAgICAgICAvLyBzdWJtaXQgYW5kIGNvbXBhcmUgbWUgYnV0dG9uc1xuICAgICAgICAvLyBDcmVhdGUgc3VibWl0IGJ1dHRvblxuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnRleHRDb250ZW50ID0gXCJDaGVjayBNZVwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBidG4tc3VjY2Vzc1wiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5uYW1lID0gXCJkbyBhbnN3ZXJcIjtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24udHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NNQ01BU3VibWlzc2lvbih0cnVlKTtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzTUNNRlN1Ym1pc3Npb24odHJ1ZSk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICB9IC8vIGVuZCBlbHNlXG4gICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQodGhpcy5zdWJtaXRCdXR0b24pO1xuICAgICAgICAvLyBDcmVhdGUgY29tcGFyZSBidXR0b25cbiAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgJiYgIWVCb29rQ29uZmlnLnBlZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24uY2xhc3NOYW1lID0gXCJidG4gYnRuLWRlZmF1bHRcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9iY29tcFwiO1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5uYW1lID0gXCJjb21wYXJlXCI7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVCdXR0b24udGV4dENvbnRlbnQgPSBcIkNvbXBhcmUgbWVcIjtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcGFyZUFuc3dlcnModGhpcy5kaXZpZCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5vcHRzRm9ybS5hcHBlbmRDaGlsZCh0aGlzLmNvbXBhcmVCdXR0b24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyTUNmZWVkYmFja0RpdigpIHtcbiAgICAgICAgdGhpcy5mZWVkQmFja0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5zZXRBdHRyaWJ1dGUoXCJhcmlhLWxpdmVcIiwgXCJwb2xpdGVcIik7XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN0YXR1c1wiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuXG4gICAgcmFuZG9taXplQW5zd2VycygpIHtcbiAgICAgICAgLy8gTWFrZXMgdGhlIG9yZGVyaW5nIG9mIHRoZSBhbnN3ZXIgY2hvaWNlcyByYW5kb21cbiAgICAgICAgdmFyIGN1cnJlbnRJbmRleCA9IHRoaXMuaW5kZXhBcnJheS5sZW5ndGgsXG4gICAgICAgICAgICB0ZW1wb3JhcnlWYWx1ZSxcbiAgICAgICAgICAgIHJhbmRvbUluZGV4O1xuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgICAgICB3aGlsZSAoY3VycmVudEluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnQuLi5cbiAgICAgICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIGN1cnJlbnRJbmRleCAtPSAxO1xuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSB0aGlzLmluZGV4QXJyYXlbY3VycmVudEluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheVtjdXJyZW50SW5kZXhdID0gdGhpcy5pbmRleEFycmF5W3JhbmRvbUluZGV4XTtcbiAgICAgICAgICAgIHRoaXMuaW5kZXhBcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICAgICAgICAgIHZhciB0ZW1wb3JhcnlGZWVkYmFjayA9IHRoaXMuZmVlZGJhY2tMaXN0W2N1cnJlbnRJbmRleF07XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrTGlzdFtjdXJyZW50SW5kZXhdID0gdGhpcy5mZWVkYmFja0xpc3RbcmFuZG9tSW5kZXhdO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0xpc3RbcmFuZG9tSW5kZXhdID0gdGVtcG9yYXJ5RmVlZGJhY2s7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IENoZWNraW5nL2xvYWRpbmcgZnJvbSBzdG9yYWdlID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlc3RvcmUgYW5zd2VycyBmcm9tIHN0b3JhZ2UgcmV0cmlldmFsIGRvbmUgaW4gUnVuZXN0b25lQmFzZVxuICAgICAgICAvLyBzb21ldGltZXMgZGF0YS5hbnN3ZXIgY2FuIGJlIG51bGxcbiAgICAgICAgaWYgKCFkYXRhLmFuc3dlcikge1xuICAgICAgICAgICAgZGF0YS5hbnN3ZXIgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YS5hbnN3ZXIuc3BsaXQoXCIsXCIpO1xuICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGFuc3dlcnMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGFuc3dlcnNbYV07XG4gICAgICAgICAgICBmb3IgKHZhciBiID0gMDsgYiA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBiKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dC52YWx1ZSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2JdLmlucHV0LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZWFuc3dlcnMpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUFTdWJtaXNzaW9uKGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc01DTUZTdWJtaXNzaW9uKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoZWNrTG9jYWxTdG9yYWdlKCkge1xuICAgICAgICAvLyBSZXBvcHVsYXRlcyBNQ01BIHF1ZXN0aW9ucyB3aXRoIGEgdXNlcidzIHByZXZpb3VzIGFuc3dlcnMsXG4gICAgICAgIC8vIHdoaWNoIHdlcmUgc3RvcmVkIGludG8gbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgdmFyIHN0b3JlZERhdGE7XG4gICAgICAgIHZhciBhbnN3ZXJzO1xuICAgICAgICBpZiAodGhpcy5ncmFkZXJhY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoZXggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlcnMgPSBzdG9yZWREYXRhLmFuc3dlci5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBwYXJzaW5nIHN0b3JlZCBtY2hvaWNlIGRhdGEgZm9yICR7dGhpcy5kaXZpZH06ICR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9yIHx8IHN0b3JlZERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBhID0gMDsgYSA8IGFuc3dlcnMubGVuZ3RoOyBhKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gYW5zd2Vyc1thXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgYiA9IDA7IGIgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgYisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25BcnJheVtiXS5pbnB1dC52YWx1ZSA9PSBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uQXJyYXlbYl0uaW5wdXQuY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNQ0NvbXBhcmlzb24oKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7IC8vIHRvIHBvcHVsYXRlIGdpdmVubG9nIGZvciBsb2dnaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlYW5zd2Vycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dNQ01Bc3VibWlzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2dNQ01Gc3VibWlzc2lvbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiBkYXRhLmFuc3dlcixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogZGF0YS5jb3JyZWN0LFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBQcm9jZXNzaW5nIE1DIFN1Ym1pc3Npb25zID09PVxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAgIHByb2Nlc3NNQ01BU3VibWlzc2lvbihsb2dGbGFnKSB7XG4gICAgICAgIC8vIENhbGxlZCB3aGVuIHRoZSBzdWJtaXQgYnV0dG9uIGlzIGNsaWNrZWRcbiAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7IC8vIG1ha2Ugc3VyZSB0aGlzLmdpdmVuQXJyYXkgaXMgcG9wdWxhdGVkXG4gICAgICAgIHRoaXMuc2NvcmVNQ01BU3VibWlzc2lvbigpO1xuICAgICAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICAgICAgICBjb3JyZWN0OiB0aGlzLmNvcnJlY3QgPyBcIlRcIiA6IFwiRlwiLFxuICAgICAgICAgICAgYW5zd2VyOiB0aGlzLmdpdmVuQXJyYXkuam9pbihcIixcIiksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAobG9nRmxhZykge1xuICAgICAgICAgICAgdGhpcy5sb2dNQ01Bc3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghZUJvb2tDb25maWcucGVlciB8fCBlQm9va0NvbmZpZy5pc0luc3RydWN0b3IpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgICAgICBpZiAodGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlTUNDb21wYXJpc29uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBhY2tub3dsZWRnZSBzdWJtaXNzaW9uXG4gICAgICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlciAmJlxuICAgICAgICAgICAgICAgIGVCb29rQ29uZmlnLnBlZXJNb2RlID09PSBcImFzeW5jXCIgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc3R1ZGVudFZvdGVDb3VudCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIHN0dWRlbnRWb3RlQ291bnQgPiAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01BRmVlZEJhY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIjxwPllvdXIgYW5zd2VyIGhhcyBiZWVuIHJlY29yZGVkPC9wPlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1pbmZvXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaWRTdWJtaXQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldFN1Ym1pdHRlZE9wdHMoKSB7XG4gICAgICAgIHZhciBnaXZlbjtcbiAgICAgICAgdGhpcy5zaW5nbGVmZWVkYmFjayA9IFwiXCI7IC8vIFVzZWQgZm9yIE1DTUYgcXVlc3Rpb25zXG4gICAgICAgIHRoaXMuZmVlZGJhY2tTdHJpbmcgPSBcIlwiOyAvLyBVc2VkIGZvciBNQ01BIHF1ZXN0aW9uc1xuICAgICAgICB0aGlzLmdpdmVuQXJyYXkgPSBbXTtcbiAgICAgICAgdGhpcy5naXZlbmxvZyA9IFwiXCI7XG4gICAgICAgIHZhciBidXR0b25PYmpzID0gdGhpcy5vcHRzRm9ybS5lbGVtZW50cy5ncm91cDE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9uT2Jqcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGJ1dHRvbk9ianNbaV0uY2hlY2tlZCkge1xuICAgICAgICAgICAgICAgIGdpdmVuID0gYnV0dG9uT2Jqc1tpXS52YWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVuQXJyYXkucHVzaChnaXZlbik7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja1N0cmluZyArPSBgPGxpIHZhbHVlPVwiJHtpICsgMX1cIj4ke3RoaXMuZmVlZGJhY2tMaXN0W2ldXG4gICAgICAgICAgICAgICAgICAgIH08L2xpPmA7XG4gICAgICAgICAgICAgICAgdGhpcy5naXZlbmxvZyArPSBnaXZlbiArIFwiLFwiO1xuICAgICAgICAgICAgICAgIHRoaXMuc2luZ2xlZmVlZGJhY2sgPSB0aGlzLmZlZWRiYWNrTGlzdFtpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdpdmVuQXJyYXkuc29ydCgpO1xuICAgIH1cblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgdGhpcy5nZXRTdWJtaXR0ZWRPcHRzKCk7XG4gICAgICAgIGlmICh0aGlzLmdpdmVuQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnNjb3JlTUNNQVN1Ym1pc3Npb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2NvcmVNQ01GU3VibWlzc2lvbigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nQ3VycmVudEFuc3dlcihzaWQpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUFzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmxvZ01DTUZzdWJtaXNzaW9uKHNpZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUFGZWVkQmFjaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJNQ01GRmVlZGJhY2soKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG4gICAgc2NvcmVNQ01BU3VibWlzc2lvbigpIHtcbiAgICAgICAgdGhpcy5jb3JyZWN0Q291bnQgPSAwO1xuICAgICAgICB2YXIgY29ycmVjdEluZGV4ID0gMDtcbiAgICAgICAgdmFyIGdpdmVuSW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoXG4gICAgICAgICAgICBjb3JyZWN0SW5kZXggPCB0aGlzLmNvcnJlY3RJbmRleExpc3QubGVuZ3RoICYmXG4gICAgICAgICAgICBnaXZlbkluZGV4IDwgdGhpcy5naXZlbkFycmF5Lmxlbmd0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLmdpdmVuQXJyYXlbZ2l2ZW5JbmRleF0gPFxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdEluZGV4TGlzdFtjb3JyZWN0SW5kZXhdXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBnaXZlbkluZGV4Kys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVtnaXZlbkluZGV4XSA9PVxuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdEluZGV4TGlzdFtjb3JyZWN0SW5kZXhdXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCsrO1xuICAgICAgICAgICAgICAgIGdpdmVuSW5kZXgrKztcbiAgICAgICAgICAgICAgICBjb3JyZWN0SW5kZXgrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdEluZGV4Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG51bUdpdmVuID0gdGhpcy5naXZlbkFycmF5Lmxlbmd0aDtcbiAgICAgICAgdmFyIG51bUNvcnJlY3QgPSB0aGlzLmNvcnJlY3RDb3VudDtcbiAgICAgICAgdmFyIG51bU5lZWRlZCA9IHRoaXMuY29ycmVjdExpc3QubGVuZ3RoO1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheS5qb2luKFwiLFwiKTtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gbnVtQ29ycmVjdCA9PT0gbnVtTmVlZGVkICYmIG51bU5lZWRlZCA9PT0gbnVtR2l2ZW47XG4gICAgICAgIGlmIChudW1HaXZlbiA9PT0gbnVtTmVlZGVkKSB7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBudW1Db3JyZWN0IC8gbnVtTmVlZGVkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wZXJjZW50ID0gbnVtQ29ycmVjdCAvIE1hdGgubWF4KG51bUdpdmVuLCBudW1OZWVkZWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgbG9nTUNNQXN1Ym1pc3Npb24oc2lkKSB7XG4gICAgICAgIHZhciBhbnN3ZXIgPSB0aGlzLmFuc3dlciB8fCBcIlwiO1xuICAgICAgICB2YXIgY29ycmVjdCA9IHRoaXMuY29ycmVjdCB8fCBmYWxzZTtcbiAgICAgICAgdmFyIGxvZ0Fuc3dlciA9XG4gICAgICAgICAgICBcImFuc3dlcjpcIiArIGFuc3dlciArIFwiOlwiICsgKGNvcnJlY3QgPT0gdHJ1ZSA/IFwiY29ycmVjdFwiIDogXCJub1wiKTtcbiAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICBldmVudDogXCJtQ2hvaWNlXCIsXG4gICAgICAgICAgICBhY3Q6IGxvZ0Fuc3dlcixcbiAgICAgICAgICAgIGFuc3dlcjogYW5zd2VyLFxuICAgICAgICAgICAgY29ycmVjdDogY29ycmVjdCxcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLnBlZXIgJiYgdHlwZW9mIHN0dWRlbnRWb3RlQ291bnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGRhdGEuYWN0ID0gZGF0YS5hY3QgKyBgOnZvdGUke3N0dWRlbnRWb3RlQ291bnR9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgfVxuXG4gICAgcmVuZGVyTUNNQUZlZWRCYWNrKCkge1xuICAgICAgICB2YXIgYW5zd2VyU3RyID0gXCJhbnN3ZXJzXCI7XG4gICAgICAgIHZhciBudW1HaXZlbiA9IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGg7XG4gICAgICAgIGlmIChudW1HaXZlbiA9PT0gMSkge1xuICAgICAgICAgICAgYW5zd2VyU3RyID0gXCJhbnN3ZXJcIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbnVtQ29ycmVjdCA9IHRoaXMuY29ycmVjdENvdW50O1xuICAgICAgICB2YXIgbnVtTmVlZGVkID0gdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGg7XG4gICAgICAgIHZhciBmZWVkYmFja1RleHQgPSB0aGlzLmZlZWRiYWNrU3RyaW5nO1xuICAgICAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmlubmVySFRNTCA9IGDinJTvuI8gPG9sIHR5cGU9XCJBXCI+JHtmZWVkYmFja1RleHR9PC91bD5gO1xuICAgICAgICAgICAgdGhpcy5mZWVkQmFja0Rpdi5jbGFzc05hbWUgPSBcImFsZXJ0IGFsZXJ0LWluZm9cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBg4pyW77iPIFlvdSBnYXZlICR7bnVtR2l2ZW59ICR7YW5zd2VyU3RyfSBhbmQgZ290ICR7bnVtQ29ycmVjdH0gY29ycmVjdCBvZiAke251bU5lZWRlZH0gbmVlZGVkLjxvbCB0eXBlPVwiQVwiPiR7ZmVlZGJhY2tUZXh0fTwvdWw+YDtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJhbGVydCBhbGVydC1kYW5nZXJcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgICB9XG5cbiAgICBwcm9jZXNzTUNNRlN1Ym1pc3Npb24obG9nRmxhZykge1xuICAgICAgICAvLyBDYWxsZWQgd2hlbiB0aGUgc3VibWl0IGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgICAgIHRoaXMuZ2V0U3VibWl0dGVkT3B0cygpOyAvLyBtYWtlIHN1cmUgdGhpcy5naXZlbkFycmF5IGlzIHBvcHVsYXRlZFxuICAgICAgICB0aGlzLnNjb3JlTUNNRlN1Ym1pc3Npb24oKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgICAgICAgIGFuc3dlcjogdGhpcy5naXZlbkFycmF5LmpvaW4oXCIsXCIpLFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxvZ0ZsYWcpIHtcbiAgICAgICAgICAgIHRoaXMubG9nTUNNRnN1Ym1pc3Npb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWVCb29rQ29uZmlnLnBlZXIgfHwgZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1DTUZGZWVkYmFjaygpO1xuICAgICAgICAgICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZU1DQ29tcGFyaXNvbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGVCb29rQ29uZmlnLnBlZXIgJiZcbiAgICAgICAgICAgICAgICBlQm9va0NvbmZpZy5wZWVyTW9kZSA9PT0gXCJhc3luY1wiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIHN0dWRlbnRWb3RlQ291bnQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgICAgICAgICBzdHVkZW50Vm90ZUNvdW50ID4gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTUNNQUZlZWRCYWNrKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gXCI8cD5Zb3VyIGFuc3dlciBoYXMgYmVlbiByZWNvcmRlZDwvcD5cIjtcbiAgICAgICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlkU3VibWl0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzY29yZU1DTUZTdWJtaXNzaW9uKCkge1xuICAgICAgICB0aGlzLmFuc3dlciA9IHRoaXMuZ2l2ZW5BcnJheVswXTtcbiAgICAgICAgaWYgKHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0pIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAxLjA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5naXZlbkFycmF5WzBdICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGlmIGdpdmVuIGlzIG51bGwgdGhlbiB0aGUgcXVlc3Rpb24gd2FzblwidCBhbnN3ZXJlZCBhbmQgc2hvdWxkIGJlIGNvdW50ZWQgYXMgc2tpcHBlZFxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSAwLjA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyBsb2dNQ01Gc3VibWlzc2lvbihzaWQpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyBhbnN3ZXIgcHJvdmlkZWQgKHRoZSBhcnJheSBpcyBlbXB0eSksIHVzZSBhIGJsYW5rIGZvciB0aGUgYW5zd2VyLlxuICAgICAgICB2YXIgYW5zd2VyID0gdGhpcy5naXZlbkFycmF5WzBdIHx8IFwiXCI7XG4gICAgICAgIHZhciBjb3JyZWN0ID1cbiAgICAgICAgICAgIHRoaXMuZ2l2ZW5BcnJheVswXSA9PSB0aGlzLmNvcnJlY3RJbmRleExpc3RbMF0gPyBcIlRcIiA6IFwiRlwiO1xuICAgICAgICB2YXIgbG9nQW5zd2VyID1cbiAgICAgICAgICAgIFwiYW5zd2VyOlwiICsgYW5zd2VyICsgXCI6XCIgKyAoY29ycmVjdCA9PSBcIlRcIiA/IFwiY29ycmVjdFwiIDogXCJub1wiKTsgLy8gYmFja3dhcmQgY29tcGF0aWJsZVxuICAgICAgICBsZXQgZGF0YSA9IHtcbiAgICAgICAgICAgIGV2ZW50OiBcIm1DaG9pY2VcIixcbiAgICAgICAgICAgIGFjdDogbG9nQW5zd2VyLFxuICAgICAgICAgICAgYW5zd2VyOiBhbnN3ZXIsXG4gICAgICAgICAgICBjb3JyZWN0OiBjb3JyZWN0LFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZUJvb2tDb25maWcucGVlciAmJiB0eXBlb2Ygc3R1ZGVudFZvdGVDb3VudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5hY3QgPSBkYXRhLmFjdCArIGA6dm90ZSR7c3R1ZGVudFZvdGVDb3VudH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgICAgfVxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChkYXRhKTtcbiAgICB9XG5cbiAgICByZW5kZXJNQ01GRmVlZGJhY2soKSB7XG4gICAgICAgIGxldCBjb3JyZWN0ID0gdGhpcy5naXZlbkFycmF5WzBdID09IHRoaXMuY29ycmVjdEluZGV4TGlzdFswXTtcbiAgICAgICAgbGV0IGZlZWRiYWNrVGV4dCA9IHRoaXMuc2luZ2xlZmVlZGJhY2s7XG5cbiAgICAgICAgaWYgKGNvcnJlY3QpIHtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gXCLinJTvuI8gXCIgKyBmZWVkYmFja1RleHQ7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtaW5mb1wiOyAvLyB1c2UgYmx1ZSBmb3IgYmV0dGVyIHJlZC9ncmVlbiBibHVlIGNvbG9yIGJsaW5kbmVzc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZlZWRiYWNrVGV4dCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmVlZGJhY2tUZXh0ID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuaW5uZXJIVE1MID0gXCLinJbvuI8gXCIgKyBmZWVkYmFja1RleHQ7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRGl2LmNsYXNzTmFtZSA9IFwiYWxlcnQgYWxlcnQtZGFuZ2VyXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5mZWVkQmFja0Rpdik7XG4gICAgfVxuICAgIGVuYWJsZU1DQ29tcGFyaXNvbigpIHtcbiAgICAgICAgaWYgKGVCb29rQ29uZmlnLmVuYWJsZUNvbXBhcmVNZSkge1xuICAgICAgICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaW5zdHJ1Y3Rvck1jaG9pY2VNb2RhbChkYXRhKSB7XG4gICAgICAgIC8vIGRhdGEucmVzbGlzdCAtLSBzdHVkZW50IGFuZCB0aGVpciBhbnN3ZXJzXG4gICAgICAgIC8vIGRhdGEuYW5zd2VyRGljdCAgICAtLSBhbnN3ZXJzIGFuZCBjb3VudFxuICAgICAgICAvLyBkYXRhLmNvcnJlY3QgLSBjb3JyZWN0IGFuc3dlclxuICAgICAgICB2YXIgcmVzID0gXCI8dGFibGU+PHRyPjx0aD5TdHVkZW50PC90aD48dGg+QW5zd2VyKHMpPC90aD48L3RyPlwiO1xuICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHJlcyArPVxuICAgICAgICAgICAgICAgIFwiPHRyPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgZGF0YVtpXVswXSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjx0ZD5cIiArXG4gICAgICAgICAgICAgICAgZGF0YVtpXVsxXSArXG4gICAgICAgICAgICAgICAgXCI8L3RkPjwvdHI+XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmVzICs9IFwiPC90YWJsZT5cIjtcbiAgICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gICAgY29tcGFyZU1vZGFsKGRhdGEsIHN0YXR1cywgd2hhdGV2ZXIpIHtcbiAgICAgICAgdmFyIGRhdGFkaWN0ID0gZGF0YS5kZXRhaWw7XG4gICAgICAgIHZhciBhbnN3ZXJzID0gZGF0YWRpY3QuYW5zd2VyRGljdDtcbiAgICAgICAgdmFyIG1pc2MgPSBkYXRhZGljdC5taXNjO1xuICAgICAgICB2YXIga2wgPSBPYmplY3Qua2V5cyhhbnN3ZXJzKS5zb3J0KCk7XG4gICAgICAgIHZhciBib2R5ID0gXCI8dGFibGU+XCI7XG4gICAgICAgIGJvZHkgKz0gXCI8dHI+PHRoPkFuc3dlcjwvdGg+PHRoPlBlcmNlbnQ8L3RoPjwvdHI+XCI7XG4gICAgICAgIHZhciB0aGVDbGFzcyA9IFwiXCI7XG4gICAgICAgIGZvciAodmFyIGsgaW4ga2wpIHtcbiAgICAgICAgICAgIGlmIChrbFtrXSA9PT0gbWlzYy5jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgPSBcInN1Y2Nlc3NcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhlQ2xhc3MgPSBcImluZm9cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjx0cj48dGQ+XCIgKyBrbFtrXSArIFwiPC90ZD48dGQgY2xhc3M9J2NvbXBhcmUtbWUtcHJvZ3Jlc3MnPlwiO1xuICAgICAgICAgICAgdmFyIHBjdCA9IGFuc3dlcnNba2xba11dICsgXCIlXCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPGRpdiBjbGFzcz0ncHJvZ3Jlc3MnPlwiO1xuICAgICAgICAgICAgYm9keSArPVxuICAgICAgICAgICAgICAgIFwiICAgIDxkaXYgY2xhc3M9J3Byb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItXCIgK1xuICAgICAgICAgICAgICAgIHRoZUNsYXNzICtcbiAgICAgICAgICAgICAgICBcIicgc3R5bGU9J3dpZHRoOlwiICtcbiAgICAgICAgICAgICAgICBwY3QgK1xuICAgICAgICAgICAgICAgIFwiOyc+XCIgK1xuICAgICAgICAgICAgICAgIHBjdDtcbiAgICAgICAgICAgIGJvZHkgKz0gXCIgICAgPC9kaXY+XCI7XG4gICAgICAgICAgICBib2R5ICs9IFwiPC9kaXY+PC90ZD48L3RyPlwiO1xuICAgICAgICB9XG4gICAgICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgICAgICBpZiAobWlzYy55b3VycGN0ICE9PSBcInVuYXZhaWxhYmxlXCIpIHtcbiAgICAgICAgICAgIGJvZHkgKz1cbiAgICAgICAgICAgICAgICBcIjxiciAvPjxwPllvdSBoYXZlIFwiICtcbiAgICAgICAgICAgICAgICBtaXNjLnlvdXJwY3QgK1xuICAgICAgICAgICAgICAgIFwiJSBjb3JyZWN0IGZvciBhbGwgcXVlc3Rpb25zPC9wPlwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhZGljdC5yZXNsaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5pbnN0cnVjdG9yTWNob2ljZU1vZGFsKGRhdGFkaWN0LnJlc2xpc3QpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIHNpbXBsZSBtb2RhbCB3aXRob3V0IGpRdWVyeS9Cb290c3RyYXBcbiAgICAgICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUucG9zaXRpb24gPSBcImZpeGVkXCI7XG4gICAgICAgIG92ZXJsYXkuc3R5bGUuaW5zZXQgPSBcIjBcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZ2JhKDAsMCwwLDAuNSlcIjtcbiAgICAgICAgb3ZlcmxheS5zdHlsZS56SW5kZXggPSBcIjk5OTlcIjtcblxuICAgICAgICBjb25zdCBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaWFsb2cuc3R5bGUubWF4V2lkdGggPSBcIjcyMHB4XCI7XG4gICAgICAgIGRpYWxvZy5zdHlsZS5tYXJnaW4gPSBcIjEwdmggYXV0b1wiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYmFja2dyb3VuZCA9IFwiI2ZmZlwiO1xuICAgICAgICBkaWFsb2cuc3R5bGUuYm9yZGVyUmFkaXVzID0gXCI2cHhcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLmJveFNoYWRvdyA9IFwiMCAycHggMTJweCByZ2JhKDAsMCwwLDAuMylcIjtcbiAgICAgICAgZGlhbG9nLnN0eWxlLnBhZGRpbmcgPSBcIjE2cHhcIjtcblxuICAgICAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb25zdCBjbG9zZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAgIGNsb3NlQnRuLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICBjbG9zZUJ0bi50ZXh0Q29udGVudCA9IFwiw5dcIjtcbiAgICAgICAgY2xvc2VCdG4uc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcIkNsb3NlXCIpO1xuICAgICAgICBjbG9zZUJ0bi5zdHlsZS5mbG9hdCA9IFwicmlnaHRcIjtcbiAgICAgICAgY2xvc2VCdG4uY2xhc3NOYW1lID0gXCJidG4gYnRuLWxpZ2h0XCI7XG4gICAgICAgIGNsb3NlQnRuLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG92ZXJsYXkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJtb2RhbC10aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiRGlzdHJpYnV0aW9uIG9mIEFuc3dlcnNcIjtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKGNsb3NlQnRuKTtcbiAgICAgICAgaGVhZGVyLmFwcGVuZENoaWxkKHRpdGxlKTtcblxuICAgICAgICBjb25zdCBtb2RhbEJvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBtb2RhbEJvZHkuaW5uZXJIVE1MID0gYm9keTtcblxuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoaGVhZGVyKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKG1vZGFsQm9keSk7XG4gICAgICAgIG92ZXJsYXkuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdmVybGF5KTtcbiAgICB9XG4gICAgLy8gX2Bjb21wYXJlQW5zd2Vyc2BcbiAgICBhc3luYyBjb21wYXJlQW5zd2VycygpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBkYXRhLmNvdXJzZV9uYW1lID0gZUJvb2tDb25maWcuY291cnNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhkYXRhKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBmZXRjaChgJHtlQm9va0NvbmZpZy5uZXdfc2VydmVyX3ByZWZpeH0vYXNzZXNzbWVudC9nZXRhZ2dyZWdhdGVyZXN1bHRzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICB0aGlzLmNvbXBhcmVNb2RhbChqc29uKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGFnZ3JlZ2F0ZSByZXN1bHRzOlwiLCBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRpc2FibGVJbnRlcmFjdGlvbigpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbkFycmF5W2ldLmlucHV0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub3B0aW9uQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uQXJyYXlbaV0uaW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9bXVsdGlwbGVjaG9pY2VdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpbmRleCkge1xuICAgICAgICAvLyBNQ1xuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG9yaWc6IGVsLFxuICAgICAgICAgICAgdXNlUnVuZXN0b25lU2VydmljZXM6IGVCb29rQ29uZmlnLnVzZVJ1bmVzdG9uZVNlcnZpY2VzLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoIWVsLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGV4aXN0cyB3aXRoaW4gYSB0aW1lZCBjb21wb25lbnQsIGRvbid0IHJlbmRlciBpdCBoZXJlXG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IG5ldyBNdWx0aXBsZUNob2ljZShvcHRzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJpbXBvcnQgTXVsdGlwbGVDaG9pY2UgZnJvbSBcIi4vbWNob2ljZS5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lZE1DIGV4dGVuZHMgTXVsdGlwbGVDaG9pY2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoXCJydW5lc3RvbmVcIik7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXJUaW1lZEljb24odGhpcy5NQ0NvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTsgLy8gRG9uJ3Qgc2hvdyBwZXItcXVlc3Rpb24gYnV0dG9ucyBpbiBhIHRpbWVkIGFzc2Vzc21lbnRcbiAgICB9XG5cbiAgICByZW5kZXJUaW1lZEljb24oY29tcG9uZW50KSB7XG4gICAgICAgIC8vIHJlbmRlcnMgdGhlIGNsb2NrIGljb24gb24gdGltZWQgY29tcG9uZW50cy4gICAgVGhlIGNvbXBvbmVudCBwYXJhbWV0ZXJcbiAgICAgICAgLy8gaXMgdGhlIGVsZW1lbnQgdGhhdCB0aGUgaWNvbiBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAgICAgIHZhciB0aW1lSWNvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHZhciB0aW1lSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgIHRpbWVJY29uLnNyYyA9IFwiLi4vX3N0YXRpYy9jbG9jay5wbmdcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUud2lkdGggPSBcIjE1cHhcIjtcbiAgICAgICAgdGltZUljb24uc3R5bGUuaGVpZ2h0ID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcbiAgICAgICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgY29tcG9uZW50Lmluc2VydEJlZm9yZSh0aW1lSWNvbkRpdiwgY29tcG9uZW50LmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYXBwZW5kQ2hpbGQodGltZUljb25EaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVCdXR0b25zKCkge1xuICAgICAgICAvL0p1c3QgaGlkaW5nIHRoZSBidXR0b25zIGRvZXNuJ3QgcHJldmVudCBzdWJtaXR0aW5nIHRoZSBmb3JtIHdoZW4gZW50ZXJpbmcgaXMgY2xpY2tlZFxuICAgICAgICAvL1dlIG5lZWQgdG8gY29tcGxldGVseSBkaXNhYmxlIHRoZSBidXR0b25zXG4gICAgICAgIGlmICh0aGlzLnN1Ym1pdEJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbXBhcmVCdXR0b24pIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGVzZSBtZXRob2RzIG92ZXJyaWRlIHRoZSBtZXRob2RzIGluIHRoZSBiYXNlIGNsYXNzLiBDYWxsZWQgZnJvbSByZW5kZXJGZWVkYmFjaygpXG4gICAgLy9cbiAgICByZW5kZXJNQ01BRmVlZEJhY2soKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tUaW1lZE1DKCk7XG4gICAgfVxuICAgIHJlbmRlck1DTUZGZWVkYmFjayh3aGF0ZXZlciwgd2hhdGV2ZXJyKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tUaW1lZE1DKCk7XG4gICAgfVxuICAgIGZlZWRiYWNrVGltZWRNQygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmluZGV4QXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB0bXBpbmRleCA9IHRoaXMuaW5kZXhBcnJheVtpXTtcbiAgICAgICAgICAgIHRoaXMuZmVlZEJhY2tFYWNoQXJyYXlbaV0uaW5uZXJIVE1MID1cbiAgICAgICAgICAgICAgICBTdHJpbmcuZnJvbUNoYXJDb2RlKDY1ICsgaSkgKyBcIi4gXCIgKyB0aGlzLmZlZWRiYWNrTGlzdFtpXTtcbiAgICAgICAgICAgIHZhciB0bXBpZCA9IHRoaXMuYW5zd2VyTGlzdFt0bXBpbmRleF0uaWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5jb3JyZWN0TGlzdC5pbmRleE9mKHRtcGlkKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtc3VjY2Vzc1wiXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheVtpXS5jbGFzc0xpc3QuYWRkKFxuICAgICAgICAgICAgICAgICAgICBcImFsZXJ0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxlcnQtZGFuZ2VyXCJcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlck1DRm9ybU9wdHMoKSB7XG4gICAgICAgIHN1cGVyLnJlbmRlck1DRm9ybU9wdHMoKTtcbiAgICAgICAgdGhpcy5mZWVkQmFja0VhY2hBcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuYW5zd2VyTGlzdC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIGsgPSB0aGlzLmluZGV4QXJyYXlbal07XG4gICAgICAgICAgICB2YXIgZmVlZEJhY2tFYWNoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGZlZWRCYWNrRWFjaC5pZCA9IHRoaXMuZGl2aWQgKyBcIl9lYWNoRmVlZGJhY2tfXCIgKyBrO1xuICAgICAgICAgICAgZmVlZEJhY2tFYWNoLmNsYXNzTGlzdC5hZGQoXCJlYWNoRmVlZGJhY2tcIik7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5LnB1c2goZmVlZEJhY2tFYWNoKTtcbiAgICAgICAgICAgIHRoaXMub3B0c0Zvcm0uYXBwZW5kQ2hpbGQoZmVlZEJhY2tFYWNoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZE1DTUEoKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdENvdW50ID09PSB0aGlzLmNvcnJlY3RMaXN0Lmxlbmd0aCAmJlxuICAgICAgICAgICAgdGhpcy5jb3JyZWN0TGlzdC5sZW5ndGggPT09IHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGhcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2l2ZW5BcnJheS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcXVlc3Rpb24gd2FzIHNraXBwZWRcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLmNvcnJlY3QpIHtcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJUXCI7XG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIkZcIjtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hlY2tDb3JyZWN0VGltZWRNQ01GKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGVhbnN3ZXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGVja0NvcnJlY3RUaW1lZE1DTUEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoZWNrQ29ycmVjdFRpbWVkTUNNRigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGhpZGVGZWVkYmFjaygpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZlZWRCYWNrRWFjaEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRCYWNrRWFjaEFycmF5W2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgYW5zd2VyRnVuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIH07XG4gICAgICAgIGZvciAobGV0IG9wdCBvZiB0aGlzLm9wdGlvbkFycmF5KSB7XG4gICAgICAgICAgICBvcHQuaW5wdXQub25jbGljayA9IGFuc3dlckZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5tdWx0aXBsZWNob2ljZSA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZE1DKG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgTXVsdGlwbGVDaG9pY2Uob3B0cyk7XG4gICAgfVxufTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==