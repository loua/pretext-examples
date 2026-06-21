"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_shortanswer_js_timed_shortanswer_js"],{

/***/ 32508:
/*!*************************************************!*\
  !*** ./runestone/shortanswer/js/shortanswer.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShortAnswer)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/js/bookfuncs.js */ 83057);
/* harmony import */ var _css_shortanswer_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../css/shortanswer.css */ 96815);
/*==========================================
=======    Master shortanswer.js    ========
============================================
===     This file contains the JS for    ===
=== the Runestone shortanswer component. ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                7/2/15                ===
===              Brad Miller             ===
===                2019                  ===
==========================================*/





class ShortAnswer extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        if (opts) {
            var orig = opts.orig; // entire <p> element that will be replaced by new HTML
            this.useRunestoneServices =
                opts.useRunestoneServices || eBookConfig.useRunestoneServices;
            this.origElem = orig;
            this.divid = orig.id;
            this.question = this.origElem.innerHTML;
            this.optional = false;
            this.attachURL = opts.attachURL;
            if (this.origElem.hasAttribute("data-optional")) {
                this.optional = true;
            }
            if (this.origElem.hasAttribute("data-attachment")) {
                this.attachment = true;
            }
            this.placeholder =
                this.origElem.getAttribute("data-placeholder") ||
                "Write your answer here";
            this.renderHTML();
            this.caption = "shortanswer";
            this.addCaption("runestone");
            this.checkServer("shortanswer", true);
            if (typeof Prism !== "undefined") {
                Prism.highlightAllUnder(this.containerDiv);
            }
            if (this.attachment) {
                this.getAttachmentName();
            }
        }
    }

    renderHTML() {
        this.containerDiv = document.createElement("div");
        this.containerDiv.id = this.divid;
        this.containerDiv.classList.add(...(this.origElem.getAttribute("class") || "").split(" ").filter(Boolean));
        this.newForm = document.createElement("form");
        this.newForm.id = this.divid + "_journal";
        this.newForm.name = this.newForm.id;
        this.newForm.action = "";
        this.containerDiv.appendChild(this.newForm);
        this.fieldSet = document.createElement("fieldset");
        this.newForm.appendChild(this.fieldSet);
        this.firstLegendDiv = document.createElement("div");
        // move contents to new div, keeping any event listeners
        while (this.origElem.firstChild) {
            this.firstLegendDiv.appendChild(this.origElem.firstChild);
        }
        this.firstLegendDiv.classList.add("journal-question");
        this.firstLegendDiv.classList.add("exercise-statement");
        this.fieldSet.appendChild(this.firstLegendDiv);
        this.jInputDiv = document.createElement("div");
        this.jInputDiv.id = this.divid + "_journal_input";
        this.fieldSet.appendChild(this.jInputDiv);
        this.jOptionsDiv = document.createElement("div");
        this.jOptionsDiv.classList.add("journal-options");
        this.jInputDiv.appendChild(this.jOptionsDiv);
        this.jTextArea = document.createElement("textarea");
        this.jTextArea.id = this.divid + "_solution";
        this.jTextArea.setAttribute("aria-label", "textarea");
        this.jTextArea.placeholder = this.placeholder;
        this.jTextArea.style.display = "inline";
        this.jTextArea.style.width = "530px";
        this.jTextArea.classList.add("form-control");
        this.jTextArea.rows = 4;
        this.jTextArea.cols = 50;
        this.jOptionsDiv.appendChild(this.jTextArea);

        // fires when we loose focus on the textarea after making a change
        // mark it as answered for peer/timed purposes
        this.jTextArea.onchange = function () {
            this.isAnswered = true;
        }.bind(this);

        // the answer has not been saved yet. Update as soon as user types in
        // the box, not just when they loose focus.
        this.jTextArea.addEventListener("keydown", () => {
            if (this.isTimed) {
                // no need for danger status... nothing for user to do here
                this.feedbackDiv.innerHTML = "Your answer is automatically saved.";
            } else {
                this.feedbackDiv.innerHTML = "Your answer has not been saved yet!";
                this.feedbackDiv.classList.remove("alert-success");
                this.feedbackDiv.classList.add("alert", "alert-danger");
            }
        });

        this.jTextArea.addEventListener("input", () => {
            this.jTextArea.style.height = "auto";
            this.jTextArea.style.height = `${this.jTextArea.scrollHeight}px`;
            this.renderMath(this.jTextArea.value);
        });
        this.buttonDiv = document.createElement("div");
        this.fieldSet.appendChild(this.buttonDiv);
        this.submitButton = document.createElement("button");
        this.submitButton.classList.add("btn", "btn-success");
        this.submitButton.type = "button";
        this.submitButton.textContent = "Save";
        this.submitButton.onclick = function () {
            this.checkCurrentAnswer();
            this.logCurrentAnswer();
            this.renderFeedback();
        }.bind(this);
        this.buttonDiv.appendChild(this.submitButton);

        this.otherOptionsDiv = document.createElement("div");
        this.otherOptionsDiv.style.paddingLeft = "20px";
        this.otherOptionsDiv.classList.add("journal-options");
        this.fieldSet.appendChild(this.otherOptionsDiv);
        // add a feedback div to give user feedback
        this.feedbackDiv = document.createElement("div");
        this.feedbackDiv.style.width = "530px";
        this.feedbackDiv.style.fontStyle = "italic";
        this.feedbackDiv.id = this.divid + "_feedback";
        this.feedbackDiv.classList.add("shortanswer__feedback");
        this.feedbackDiv.style.display = "none";
        this.fieldSet.appendChild(this.feedbackDiv);
        if (this.attachment) {
            let attachDiv = document.createElement("div")
            this.attachDiv = attachDiv;
            if (this.graderactive) {
                // If in grading mode make a button to create a popup with the image
                let viewButton = document.createElement("button")
                viewButton.type = "button"
                viewButton.innerHTML = "View Attachment"
                viewButton.onclick = this.viewFile.bind(this);
                attachDiv.appendChild(viewButton);
            } else {
                // Otherwise make a button for the student to select a file to upload.
                this.fileUpload = document.createElement("input")
                this.fileUpload.type = "file";
                this.fileUpload.id = `${this.divid}_fileme`;
                attachDiv.appendChild(this.fileUpload);
            }
            this.containerDiv.appendChild(attachDiv);
        }
        this.origElem.replaceWith(this.containerDiv);
        // This is a stopgap measure for when MathJax is not loaded at all.  There is another
        // more difficult case that when MathJax is loaded asynchronously we will get here
        // before MathJax is loaded.  In that case we will need to implement something
        // like `the solution described here <https://stackoverflow.com/questions/3014018/how-to-detect-when-mathjax-is-fully-loaded>`_
        if (typeof MathJax !== "undefined") {
            this.queueMathJax(this.containerDiv);
        }
    }

    renderMath(value) {
        if ((0,_common_js_bookfuncs_js__WEBPACK_IMPORTED_MODULE_1__.looksLikeLatexMath)(value)) {
            if (!this.renderedAnswer) {
                this.rederedAnswerDiv = document.createElement("div");
                this.rederedAnswerDiv.classList.add("shortanswer__rendered-answer-div");
                this.fieldSet.appendChild(this.rederedAnswerDiv);

                this.renderedAnswerLabel = document.createElement("label");
                this.renderedAnswerLabel.innerHTML = "Rendered Answer:";
                this.renderedAnswerLabel.id = this.divid + "_rendered_answer_label";
                this.renderedAnswerLabel.classList.add("shortanswer__rendered-answer-label");
                this.rederedAnswerDiv.appendChild(this.renderedAnswerLabel);

                this.renderedAnswer = document.createElement("div");
                this.renderedAnswer.classList.add("shortanswer__rendered-answer");
                this.renderedAnswer.classList.add("latexoutput");
                this.renderedAnswer.setAttribute('aria-labelledby', this.renderedAnswerLabel.id);
                this.renderedAnswer.setAttribute('aria-live', "polite");
                this.rederedAnswerDiv.appendChild(this.renderedAnswer);
            }
            value = value.replace(/\$\$(.*?)\$\$/g, "\\[ $1 \\]");
            value = value.replace(/\$(.*?)\$/g, "\\( $1 \\)");
            value = value.replace(/\n/g, "<br/>");
            this.renderedAnswer.innerHTML = value;

            this.rederedAnswerDiv.style.display = "block";
            this.queueMathJax(this.renderedAnswer);

        } else {
            if (this.renderedAnswer) {
                this.rederedAnswerDiv.style.display = "none";
            }
        }
    }

    async checkCurrentAnswer() {
        let value = document.getElementById(this.divid + "_solution").value;
        this.renderMath(value);
        this.setLocalStorage({
            answer: value,
            timestamp: new Date(),
        });
    }

    async logCurrentAnswer(sid) {
        let value = document.getElementById(this.divid + "_solution").value;
        this.renderMath(value);
        this.setLocalStorage({
            answer: value,
            timestamp: new Date(),
        });
        let data = {
            event: "shortanswer",
            act: value,
            answer: value,
            div_id: this.divid,
        };
        if (typeof sid !== "undefined") {
            data.sid = sid;
        }
        await this.logBookEvent(data);
        if (this.attachment) {
            await this.uploadFile();
        }
    }

    renderFeedback() {
        this.feedbackDiv.innerHTML = "Your answer has been saved.";
        this.feedbackDiv.classList.remove("alert-danger");
        this.feedbackDiv.classList.add("alert", "alert-success");
        this.feedbackDiv.style.display = "block";
    }
    setLocalStorage(data) {
        if (!this.graderactive) {
            let key = this.localStorageKey();
            localStorage.setItem(key, JSON.stringify(data));
        }
    }
    checkLocalStorage() {
        // Repopulates the short answer text
        // which was stored into local storage.
        var answer = "";
        if (this.graderactive) {
            return;
        }
        var len = localStorage.length;
        if (len > 0) {
            var ex = localStorage.getItem(this.localStorageKey());
            if (ex !== null) {
                let error = false;
                try {
                    var storedData = JSON.parse(ex);
                    answer = storedData.answer;
                } catch (err) {
                    // error while parsing; likely due to bad value stored in storage
                    console.log(`Error parsing stored shortanswer data for ${this.divid}: ${err.message}`);
                    error = true;
                }
                if (error || storedData.timestamp < eBookConfig.termStartDate) {
                    localStorage.removeItem(this.localStorageKey());
                    return;
                }
                let solution = document.getElementById(this.divid + "_solution");
                if (solution) {
                    solution.value = answer;
                }
                this.renderMath(answer);
            }
        }
    }
    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        this.answer = data.answer;
        this.jTextArea.value = this.answer;
        this.renderMath(this.answer);

        let p = document.createElement("p");
        p.classList.add("shortanswer__timestamp");
        this.jInputDiv.appendChild(p);
        var tsString = "";
        if (data.timestamp) {
            tsString = new Date(data.timestamp).toLocaleString();
        } else {
            tsString = "";
        }
        p.textContent = tsString;
        this.jTextArea.style.height = "auto";
        this.jTextArea.style.height = `${this.jTextArea.scrollHeight}px`;

        if (data.last_answer) {
            this.current_answer = "ontime";
            let toggle_answer_button = document.createElement("button");
            toggle_answer_button.type = "button";
            toggle_answer_button.textContent = "Show Late Answer";
            toggle_answer_button.classList.add("btn", "btn-warning");
            toggle_answer_button.style.marginLeft = "5px";

            toggle_answer_button.addEventListener(
                "click",
                function () {
                    var display_timestamp, button_text;
                    if (this.current_answer === "ontime") {
                        this.jTextArea.value = data.last_answer;
                        this.answer = data.last_answer;
                        display_timestamp = new Date(
                            data.last_timestamp
                        ).toLocaleString();
                        button_text = "Show on-Time Answer";
                        this.current_answer = "late";
                    } else {
                        this.jTextArea.value = data.answer;
                        this.answer = data.answer;
                        display_timestamp = tsString;
                        button_text = "Show Late Answer";
                        this.current_answer = "ontime";
                    }
                    this.renderMath(this.answer);
                    p.textContent = `Submitted: ${display_timestamp}`;
                    toggle_answer_button.textContent = button_text;
                }.bind(this)
            );

            this.buttonDiv.appendChild(toggle_answer_button);
        }
        let feedbackStr = "";
        if (typeof data.score !== "undefined") {
            feedbackStr = `Score: ${data.score}`;
        }
        if (data.comment) {
            feedbackStr += ` -- ${data.comment}`;
        }
        if (feedbackStr !== "") {
            this.feedbackDiv.innerHTML = feedbackStr;
            this.feedbackDiv.style.display = "block";
            this.feedbackDiv.classList.add("alert", "alert-success");
        }
    }

    disableInteraction() {
        this.jTextArea.disabled = true;
    }

    async getAttachmentName() {
        // Get the attachment name from the /ns/assessment/has_attachment endpoint
        let requestUrl = `/ns/assessment/has_attachment/${this.divid}`;
        if (this.sid) {
            requestUrl += `?sid=${this.sid}`;
        }
        const response = await fetch(requestUrl);
        if (!response.ok) {
            console.error("Error fetching attachment name:", response.statusText);
            return null;
        }
        const obj = await response.json();
        if (obj.detail.hasAttachment) {
            // Return the S3 key for the attachment
            let filename = obj.detail.hasAttachment;
            // filename is everthing after the last slash
            filename = filename.substring(filename.lastIndexOf("/") + 1);
            let fmess = document.createElement("span");
            fmess.innerHTML = `Attachment: ${filename}`;
            this.attachDiv.appendChild(fmess);
        }
    }

    async uploadFile() {
        const files = this.fileUpload.files
        // get the suffix from the file name
        const fileName = files[0].name;
        const suffix = fileName.split('.').pop();
        // if the suffix is not in the list of allowed suffixes, return
        if (!['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(suffix)) {
            alert("File type not allowed. Please upload a jpg, jpeg, png, gif, or pdf file.");
            return;
        }
        // if the file size is greater than 5MB, return
        if (files[0].size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB limit. Please upload a smaller file.");
            return;
        }
        const data = new FormData()
        if (this.fileUpload.files.length > 0) {
            data.append('file', files[0])
            fetch(`/ns/logger/upload/${this.divid}`, {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(error => {
                    console.error(error)
                })
        }
    }

    viewFile() {
        // Get the URL from the S3 API -- saved when we display in grader mode
        if (this.attachURL) {
            //window.open(this.attachURL, "_blank");
            //<embed src="example.pdf" type="application/pdf" width="100%" height="600px" />
            //switch to 
            const image_window = window.open("", "_blank")
            if (this.attachURL.indexOf('.pdf?') !== -1) {
                const embed = image_window.document.createElement("object");
                embed.setAttribute("data", this.attachURL);
                embed.setAttribute("type", "application/pdf");
                embed.setAttribute("width", "800px");
                embed.setAttribute("height", "1040px");
                image_window.document.body.appendChild(embed);
                let alt = image_window.document.createElement("a");
                alt.setAttribute("href", this.attachURL);
                alt.innerText = "Download PDF";
                embed.appendChild(alt);
            }
            else {
                const img = image_window.document.createElement("img");
                img.setAttribute("src", this.attachURL);
                img.setAttribute("style", "width:100%; height:auto;");
                image_window.document.body.appendChild(img);
            }
        } else {
            alert("No attachment for this student.")
        }
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
document.addEventListener("runestone:login-complete", function () {
    document.querySelectorAll("[data-component=shortanswer]").forEach(function (el) {
        // If this element exists within a timed component, don't render it here
        if (!el.closest("[data-component=timedAssessment]")) {
            try {
                window.componentMap[el.id] = new ShortAnswer({
                    orig: el,
                    useRunestoneServices: eBookConfig.useRunestoneServices,
                });
            } catch (err) {
                console.log(`Error rendering ShortAnswer Problem ${el.id}
                Details: ${err}`);
            }
        }
    });
});


/***/ }),

/***/ 68950:
/*!*******************************************************!*\
  !*** ./runestone/shortanswer/js/timed_shortanswer.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedShortAnswer)
/* harmony export */ });
/* harmony import */ var _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shortanswer.js */ 32508);


class TimedShortAnswer extends _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.containerDiv);
        this.isTimed = true;
        this.hideButtons();
    }
    hideButtons() {
        if (this.submitButton) {
            this.submitButton.style.display = "none";
        }
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

        // If firstChild is null, insertBefore acts like appendChild
        component.insertBefore(timeIconDiv, component.firstChild);
    }
    checkCorrectTimed() {
        return "I"; // we ignore this in the grading
    }
    hideFeedback() {
        if (this.feedbackDiv) {
            this.feedbackDiv.style.display = "none";
        }
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.shortanswer = function (opts) {
    if (opts.timed) {
        return new TimedShortAnswer(opts);
    }
    return new _shortanswer_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 96815:
/*!***************************************************!*\
  !*** ./runestone/shortanswer/css/shortanswer.css ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3Nob3J0YW5zd2VyX2pzX3RpbWVkX3Nob3J0YW5zd2VyX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEO0FBQ0s7QUFDaEM7O0FBRW5CLDBCQUEwQixtRUFBYTtBQUN0RDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0EsNkNBQTZDLDRCQUE0QjtBQUN6RTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsV0FBVztBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVksMkVBQWtCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEIsNENBQTRDO0FBQzVDLDZFQUE2RSxXQUFXLElBQUksWUFBWTtBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5Qyw0QkFBNEI7O0FBRXJFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxrQkFBa0I7QUFDcEU7QUFDQSxpQkFBaUI7QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsV0FBVztBQUMvQztBQUNBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwREFBMEQsV0FBVztBQUNyRTtBQUNBLGtDQUFrQyxTQUFTO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFNBQVM7QUFDdEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxXQUFXO0FBQ2xEO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxZQUFZO0FBQ25FO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLGNBQWM7QUFDZCxtRUFBbUU7QUFDbkUsMkJBQTJCLElBQUk7QUFDL0I7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDeGMwQzs7QUFFNUIsK0JBQStCLHVEQUFXO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSx1REFBVztBQUMxQjs7Ozs7Ozs7Ozs7O0FDbERBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9zaG9ydGFuc3dlci9qcy9zaG9ydGFuc3dlci5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL3Nob3J0YW5zd2VyL2pzL3RpbWVkX3Nob3J0YW5zd2VyLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvc2hvcnRhbnN3ZXIvY3NzL3Nob3J0YW5zd2VyLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICBNYXN0ZXIgc2hvcnRhbnN3ZXIuanMgICAgPT09PT09PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yICAgID09PVxuPT09IHRoZSBSdW5lc3RvbmUgc2hvcnRhbnN3ZXIgY29tcG9uZW50LiA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PT0gICAgICAgICAgICAgIENyZWF0ZWQgYnkgICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICBJc2FpYWggTWF5ZXJjaGFrICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgICAgICA3LzIvMTUgICAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgIEJyYWQgTWlsbGVyICAgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgIDIwMTkgICAgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbmltcG9ydCBSdW5lc3RvbmVCYXNlIGZyb20gXCIuLi8uLi9jb21tb24vanMvcnVuZXN0b25lYmFzZS5qc1wiO1xuaW1wb3J0IHsgbG9va3NMaWtlTGF0ZXhNYXRoIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ib29rZnVuY3MuanNcIjtcbmltcG9ydCBcIi4vLi4vY3NzL3Nob3J0YW5zd2VyLmNzc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaG9ydEFuc3dlciBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIGlmIChvcHRzKSB7XG4gICAgICAgICAgICB2YXIgb3JpZyA9IG9wdHMub3JpZzsgLy8gZW50aXJlIDxwPiBlbGVtZW50IHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieSBuZXcgSFRNTFxuICAgICAgICAgICAgdGhpcy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA9XG4gICAgICAgICAgICAgICAgb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcyB8fCBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGhpcy5vcmlnRWxlbS5pbm5lckhUTUw7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbmFsID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaFVSTCA9IG9wdHMuYXR0YWNoVVJMO1xuICAgICAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1vcHRpb25hbFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9uYWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub3JpZ0VsZW0uaGFzQXR0cmlidXRlKFwiZGF0YS1hdHRhY2htZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hdHRhY2htZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGxhY2Vob2xkZXIgPVxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiZGF0YS1wbGFjZWhvbGRlclwiKSB8fFxuICAgICAgICAgICAgICAgIFwiV3JpdGUgeW91ciBhbnN3ZXIgaGVyZVwiO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJIVE1MKCk7XG4gICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBcInNob3J0YW5zd2VyXCI7XG4gICAgICAgICAgICB0aGlzLmFkZENhcHRpb24oXCJydW5lc3RvbmVcIik7XG4gICAgICAgICAgICB0aGlzLmNoZWNrU2VydmVyKFwic2hvcnRhbnN3ZXJcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIFByaXNtICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgUHJpc20uaGlnaGxpZ2h0QWxsVW5kZXIodGhpcy5jb250YWluZXJEaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXR0YWNobWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZ2V0QXR0YWNobWVudE5hbWUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlckhUTUwoKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKC4uLih0aGlzLm9yaWdFbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICB0aGlzLm5ld0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcbiAgICAgICAgdGhpcy5uZXdGb3JtLmlkID0gdGhpcy5kaXZpZCArIFwiX2pvdXJuYWxcIjtcbiAgICAgICAgdGhpcy5uZXdGb3JtLm5hbWUgPSB0aGlzLm5ld0Zvcm0uaWQ7XG4gICAgICAgIHRoaXMubmV3Rm9ybS5hY3Rpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLm5ld0Zvcm0pO1xuICAgICAgICB0aGlzLmZpZWxkU2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICB0aGlzLm5ld0Zvcm0uYXBwZW5kQ2hpbGQodGhpcy5maWVsZFNldCk7XG4gICAgICAgIHRoaXMuZmlyc3RMZWdlbmREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAvLyBtb3ZlIGNvbnRlbnRzIHRvIG5ldyBkaXYsIGtlZXBpbmcgYW55IGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICB3aGlsZSAodGhpcy5vcmlnRWxlbS5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0TGVnZW5kRGl2LmFwcGVuZENoaWxkKHRoaXMub3JpZ0VsZW0uZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maXJzdExlZ2VuZERpdi5jbGFzc0xpc3QuYWRkKFwiam91cm5hbC1xdWVzdGlvblwiKTtcbiAgICAgICAgdGhpcy5maXJzdExlZ2VuZERpdi5jbGFzc0xpc3QuYWRkKFwiZXhlcmNpc2Utc3RhdGVtZW50XCIpO1xuICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKHRoaXMuZmlyc3RMZWdlbmREaXYpO1xuICAgICAgICB0aGlzLmpJbnB1dERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMuaklucHV0RGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2pvdXJuYWxfaW5wdXRcIjtcbiAgICAgICAgdGhpcy5maWVsZFNldC5hcHBlbmRDaGlsZCh0aGlzLmpJbnB1dERpdik7XG4gICAgICAgIHRoaXMuak9wdGlvbnNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmpPcHRpb25zRGl2LmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsLW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMuaklucHV0RGl2LmFwcGVuZENoaWxkKHRoaXMuak9wdGlvbnNEaXYpO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuaWQgPSB0aGlzLmRpdmlkICsgXCJfc29sdXRpb25cIjtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuc2V0QXR0cmlidXRlKFwiYXJpYS1sYWJlbFwiLCBcInRleHRhcmVhXCIpO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5wbGFjZWhvbGRlciA9IHRoaXMucGxhY2Vob2xkZXI7XG4gICAgICAgIHRoaXMualRleHRBcmVhLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5zdHlsZS53aWR0aCA9IFwiNTMwcHhcIjtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuY2xhc3NMaXN0LmFkZChcImZvcm0tY29udHJvbFwiKTtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEucm93cyA9IDQ7XG4gICAgICAgIHRoaXMualRleHRBcmVhLmNvbHMgPSA1MDtcbiAgICAgICAgdGhpcy5qT3B0aW9uc0Rpdi5hcHBlbmRDaGlsZCh0aGlzLmpUZXh0QXJlYSk7XG5cbiAgICAgICAgLy8gZmlyZXMgd2hlbiB3ZSBsb29zZSBmb2N1cyBvbiB0aGUgdGV4dGFyZWEgYWZ0ZXIgbWFraW5nIGEgY2hhbmdlXG4gICAgICAgIC8vIG1hcmsgaXQgYXMgYW5zd2VyZWQgZm9yIHBlZXIvdGltZWQgcHVycG9zZXNcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEub25jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgLy8gdGhlIGFuc3dlciBoYXMgbm90IGJlZW4gc2F2ZWQgeWV0LiBVcGRhdGUgYXMgc29vbiBhcyB1c2VyIHR5cGVzIGluXG4gICAgICAgIC8vIHRoZSBib3gsIG5vdCBqdXN0IHdoZW4gdGhleSBsb29zZSBmb2N1cy5cbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUaW1lZCkge1xuICAgICAgICAgICAgICAgIC8vIG5vIG5lZWQgZm9yIGRhbmdlciBzdGF0dXMuLi4gbm90aGluZyBmb3IgdXNlciB0byBkbyBoZXJlXG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5pbm5lckhUTUwgPSBcIllvdXIgYW5zd2VyIGlzIGF1dG9tYXRpY2FsbHkgc2F2ZWQuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID0gXCJZb3VyIGFuc3dlciBoYXMgbm90IGJlZW4gc2F2ZWQgeWV0IVwiO1xuICAgICAgICAgICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuY2xhc3NMaXN0LnJlbW92ZShcImFsZXJ0LXN1Y2Nlc3NcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5jbGFzc0xpc3QuYWRkKFwiYWxlcnRcIiwgXCJhbGVydC1kYW5nZXJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMualRleHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS5zdHlsZS5oZWlnaHQgPSBcImF1dG9cIjtcbiAgICAgICAgICAgIHRoaXMualRleHRBcmVhLnN0eWxlLmhlaWdodCA9IGAke3RoaXMualRleHRBcmVhLnNjcm9sbEhlaWdodH1weGA7XG4gICAgICAgICAgICB0aGlzLnJlbmRlck1hdGgodGhpcy5qVGV4dEFyZWEudmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5idXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uRGl2KTtcbiAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiYnRuXCIsIFwiYnRuLXN1Y2Nlc3NcIik7XG4gICAgICAgIHRoaXMuc3VibWl0QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi50ZXh0Q29udGVudCA9IFwiU2F2ZVwiO1xuICAgICAgICB0aGlzLnN1Ym1pdEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgICAgIHRoaXMubG9nQ3VycmVudEFuc3dlcigpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB9LmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRoaXMuc3VibWl0QnV0dG9uKTtcblxuICAgICAgICB0aGlzLm90aGVyT3B0aW9uc0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMub3RoZXJPcHRpb25zRGl2LnN0eWxlLnBhZGRpbmdMZWZ0ID0gXCIyMHB4XCI7XG4gICAgICAgIHRoaXMub3RoZXJPcHRpb25zRGl2LmNsYXNzTGlzdC5hZGQoXCJqb3VybmFsLW9wdGlvbnNcIik7XG4gICAgICAgIHRoaXMuZmllbGRTZXQuYXBwZW5kQ2hpbGQodGhpcy5vdGhlck9wdGlvbnNEaXYpO1xuICAgICAgICAvLyBhZGQgYSBmZWVkYmFjayBkaXYgdG8gZ2l2ZSB1c2VyIGZlZWRiYWNrXG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LnN0eWxlLndpZHRoID0gXCI1MzBweFwiO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LnN0eWxlLmZvbnRTdHlsZSA9IFwiaXRhbGljXCI7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaWQgPSB0aGlzLmRpdmlkICsgXCJfZmVlZGJhY2tcIjtcbiAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5jbGFzc0xpc3QuYWRkKFwic2hvcnRhbnN3ZXJfX2ZlZWRiYWNrXCIpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgdGhpcy5maWVsZFNldC5hcHBlbmRDaGlsZCh0aGlzLmZlZWRiYWNrRGl2KTtcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNobWVudCkge1xuICAgICAgICAgICAgbGV0IGF0dGFjaERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoRGl2ID0gYXR0YWNoRGl2O1xuICAgICAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgaW4gZ3JhZGluZyBtb2RlIG1ha2UgYSBidXR0b24gdG8gY3JlYXRlIGEgcG9wdXAgd2l0aCB0aGUgaW1hZ2VcbiAgICAgICAgICAgICAgICBsZXQgdmlld0J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcbiAgICAgICAgICAgICAgICB2aWV3QnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgdmlld0J1dHRvbi5pbm5lckhUTUwgPSBcIlZpZXcgQXR0YWNobWVudFwiXG4gICAgICAgICAgICAgICAgdmlld0J1dHRvbi5vbmNsaWNrID0gdGhpcy52aWV3RmlsZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIGF0dGFjaERpdi5hcHBlbmRDaGlsZCh2aWV3QnV0dG9uKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIG1ha2UgYSBidXR0b24gZm9yIHRoZSBzdHVkZW50IHRvIHNlbGVjdCBhIGZpbGUgdG8gdXBsb2FkLlxuICAgICAgICAgICAgICAgIHRoaXMuZmlsZVVwbG9hZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKVxuICAgICAgICAgICAgICAgIHRoaXMuZmlsZVVwbG9hZC50eXBlID0gXCJmaWxlXCI7XG4gICAgICAgICAgICAgICAgdGhpcy5maWxlVXBsb2FkLmlkID0gYCR7dGhpcy5kaXZpZH1fZmlsZW1lYDtcbiAgICAgICAgICAgICAgICBhdHRhY2hEaXYuYXBwZW5kQ2hpbGQodGhpcy5maWxlVXBsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGF0dGFjaERpdik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIC8vIFRoaXMgaXMgYSBzdG9wZ2FwIG1lYXN1cmUgZm9yIHdoZW4gTWF0aEpheCBpcyBub3QgbG9hZGVkIGF0IGFsbC4gIFRoZXJlIGlzIGFub3RoZXJcbiAgICAgICAgLy8gbW9yZSBkaWZmaWN1bHQgY2FzZSB0aGF0IHdoZW4gTWF0aEpheCBpcyBsb2FkZWQgYXN5bmNocm9ub3VzbHkgd2Ugd2lsbCBnZXQgaGVyZVxuICAgICAgICAvLyBiZWZvcmUgTWF0aEpheCBpcyBsb2FkZWQuICBJbiB0aGF0IGNhc2Ugd2Ugd2lsbCBuZWVkIHRvIGltcGxlbWVudCBzb21ldGhpbmdcbiAgICAgICAgLy8gbGlrZSBgdGhlIHNvbHV0aW9uIGRlc2NyaWJlZCBoZXJlIDxodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zMDE0MDE4L2hvdy10by1kZXRlY3Qtd2hlbi1tYXRoamF4LWlzLWZ1bGx5LWxvYWRlZD5gX1xuICAgICAgICBpZiAodHlwZW9mIE1hdGhKYXggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbmRlck1hdGgodmFsdWUpIHtcbiAgICAgICAgaWYgKGxvb2tzTGlrZUxhdGV4TWF0aCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5yZW5kZXJlZEFuc3dlcikge1xuICAgICAgICAgICAgICAgIHRoaXMucmVkZXJlZEFuc3dlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWRlcmVkQW5zd2VyRGl2LmNsYXNzTGlzdC5hZGQoXCJzaG9ydGFuc3dlcl9fcmVuZGVyZWQtYW5zd2VyLWRpdlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmZpZWxkU2V0LmFwcGVuZENoaWxkKHRoaXMucmVkZXJlZEFuc3dlckRpdik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEFuc3dlckxhYmVsLmlubmVySFRNTCA9IFwiUmVuZGVyZWQgQW5zd2VyOlwiO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXJMYWJlbC5pZCA9IHRoaXMuZGl2aWQgKyBcIl9yZW5kZXJlZF9hbnN3ZXJfbGFiZWxcIjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyTGFiZWwuY2xhc3NMaXN0LmFkZChcInNob3J0YW5zd2VyX19yZW5kZXJlZC1hbnN3ZXItbGFiZWxcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWRlcmVkQW5zd2VyRGl2LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZWRBbnN3ZXJMYWJlbCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkQW5zd2VyLmNsYXNzTGlzdC5hZGQoXCJzaG9ydGFuc3dlcl9fcmVuZGVyZWQtYW5zd2VyXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXIuY2xhc3NMaXN0LmFkZChcImxhdGV4b3V0cHV0XCIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsbGVkYnknLCB0aGlzLnJlbmRlcmVkQW5zd2VyTGFiZWwuaWQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRBbnN3ZXIuc2V0QXR0cmlidXRlKCdhcmlhLWxpdmUnLCBcInBvbGl0ZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZGVyZWRBbnN3ZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlZEFuc3dlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcJFxcJCguKj8pXFwkXFwkL2csIFwiXFxcXFsgJDEgXFxcXF1cIik7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcJCguKj8pXFwkL2csIFwiXFxcXCggJDEgXFxcXClcIik7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcbi9nLCBcIjxici8+XCIpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEFuc3dlci5pbm5lckhUTUwgPSB2YWx1ZTtcblxuICAgICAgICAgICAgdGhpcy5yZWRlcmVkQW5zd2VyRGl2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLnJlbmRlcmVkQW5zd2VyKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMucmVuZGVyZWRBbnN3ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlZGVyZWRBbnN3ZXJEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgY2hlY2tDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdmlkICsgXCJfc29sdXRpb25cIikudmFsdWU7XG4gICAgICAgIHRoaXMucmVuZGVyTWF0aCh2YWx1ZSk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgICAgICAgIGFuc3dlcjogdmFsdWUsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2aWQgKyBcIl9zb2x1dGlvblwiKS52YWx1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHZhbHVlKTtcbiAgICAgICAgdGhpcy5zZXRMb2NhbFN0b3JhZ2Uoe1xuICAgICAgICAgICAgYW5zd2VyOiB2YWx1ZSxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBkYXRhID0ge1xuICAgICAgICAgICAgZXZlbnQ6IFwic2hvcnRhbnN3ZXJcIixcbiAgICAgICAgICAgIGFjdDogdmFsdWUsXG4gICAgICAgICAgICBhbnN3ZXI6IHZhbHVlLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICB9O1xuICAgICAgICBpZiAodHlwZW9mIHNpZCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgZGF0YS5zaWQgPSBzaWQ7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgICAgIGlmICh0aGlzLmF0dGFjaG1lbnQpIHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMudXBsb2FkRmlsZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuaW5uZXJIVE1MID0gXCJZb3VyIGFuc3dlciBoYXMgYmVlbiBzYXZlZC5cIjtcbiAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5jbGFzc0xpc3QucmVtb3ZlKFwiYWxlcnQtZGFuZ2VyXCIpO1xuICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmNsYXNzTGlzdC5hZGQoXCJhbGVydFwiLCBcImFsZXJ0LXN1Y2Nlc3NcIik7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gUmVwb3B1bGF0ZXMgdGhlIHNob3J0IGFuc3dlciB0ZXh0XG4gICAgICAgIC8vIHdoaWNoIHdhcyBzdG9yZWQgaW50byBsb2NhbCBzdG9yYWdlLlxuICAgICAgICB2YXIgYW5zd2VyID0gXCJcIjtcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdG9yZWREYXRhID0gSlNPTi5wYXJzZShleCk7XG4gICAgICAgICAgICAgICAgICAgIGFuc3dlciA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciB3aGlsZSBwYXJzaW5nOyBsaWtlbHkgZHVlIHRvIGJhZCB2YWx1ZSBzdG9yZWQgaW4gc3RvcmFnZVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcGFyc2luZyBzdG9yZWQgc2hvcnRhbnN3ZXIgZGF0YSBmb3IgJHt0aGlzLmRpdmlkfTogJHtlcnIubWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgfHwgc3RvcmVkRGF0YS50aW1lc3RhbXAgPCBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBzb2x1dGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2aWQgKyBcIl9zb2x1dGlvblwiKTtcbiAgICAgICAgICAgICAgICBpZiAoc29sdXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc29sdXRpb24udmFsdWUgPSBhbnN3ZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyTWF0aChhbnN3ZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIC8vIHNvbWV0aW1lcyBkYXRhLmFuc3dlciBjYW4gYmUgbnVsbFxuICAgICAgICBpZiAoIWRhdGEuYW5zd2VyKSB7XG4gICAgICAgICAgICBkYXRhLmFuc3dlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hbnN3ZXIgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEudmFsdWUgPSB0aGlzLmFuc3dlcjtcbiAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHRoaXMuYW5zd2VyKTtcblxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBwLmNsYXNzTGlzdC5hZGQoXCJzaG9ydGFuc3dlcl9fdGltZXN0YW1wXCIpO1xuICAgICAgICB0aGlzLmpJbnB1dERpdi5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgdmFyIHRzU3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGRhdGEudGltZXN0YW1wKSB7XG4gICAgICAgICAgICB0c1N0cmluZyA9IG5ldyBEYXRlKGRhdGEudGltZXN0YW1wKS50b0xvY2FsZVN0cmluZygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHNTdHJpbmcgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIHAudGV4dENvbnRlbnQgPSB0c1N0cmluZztcbiAgICAgICAgdGhpcy5qVGV4dEFyZWEuc3R5bGUuaGVpZ2h0ID0gXCJhdXRvXCI7XG4gICAgICAgIHRoaXMualRleHRBcmVhLnN0eWxlLmhlaWdodCA9IGAke3RoaXMualRleHRBcmVhLnNjcm9sbEhlaWdodH1weGA7XG5cbiAgICAgICAgaWYgKGRhdGEubGFzdF9hbnN3ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudF9hbnN3ZXIgPSBcIm9udGltZVwiO1xuICAgICAgICAgICAgbGV0IHRvZ2dsZV9hbnN3ZXJfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICAgICAgdG9nZ2xlX2Fuc3dlcl9idXR0b24udGV4dENvbnRlbnQgPSBcIlNob3cgTGF0ZSBBbnN3ZXJcIjtcbiAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4td2FybmluZ1wiKTtcbiAgICAgICAgICAgIHRvZ2dsZV9hbnN3ZXJfYnV0dG9uLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjVweFwiO1xuXG4gICAgICAgICAgICB0b2dnbGVfYW5zd2VyX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXNwbGF5X3RpbWVzdGFtcCwgYnV0dG9uX3RleHQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRfYW5zd2VyID09PSBcIm9udGltZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS52YWx1ZSA9IGRhdGEubGFzdF9hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFuc3dlciA9IGRhdGEubGFzdF9hbnN3ZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5X3RpbWVzdGFtcCA9IG5ldyBEYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEubGFzdF90aW1lc3RhbXBcbiAgICAgICAgICAgICAgICAgICAgICAgICkudG9Mb2NhbGVTdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvbl90ZXh0ID0gXCJTaG93IG9uLVRpbWUgQW5zd2VyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRfYW5zd2VyID0gXCJsYXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmpUZXh0QXJlYS52YWx1ZSA9IGRhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbnN3ZXIgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfdGltZXN0YW1wID0gdHNTdHJpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25fdGV4dCA9IFwiU2hvdyBMYXRlIEFuc3dlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X2Fuc3dlciA9IFwib250aW1lXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJNYXRoKHRoaXMuYW5zd2VyKTtcbiAgICAgICAgICAgICAgICAgICAgcC50ZXh0Q29udGVudCA9IGBTdWJtaXR0ZWQ6ICR7ZGlzcGxheV90aW1lc3RhbXB9YDtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlX2Fuc3dlcl9idXR0b24udGV4dENvbnRlbnQgPSBidXR0b25fdGV4dDtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcylcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHRoaXMuYnV0dG9uRGl2LmFwcGVuZENoaWxkKHRvZ2dsZV9hbnN3ZXJfYnV0dG9uKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZmVlZGJhY2tTdHIgPSBcIlwiO1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEuc2NvcmUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIGZlZWRiYWNrU3RyID0gYFNjb3JlOiAke2RhdGEuc2NvcmV9YDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5jb21tZW50KSB7XG4gICAgICAgICAgICBmZWVkYmFja1N0ciArPSBgIC0tICR7ZGF0YS5jb21tZW50fWA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZlZWRiYWNrU3RyICE9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LmlubmVySFRNTCA9IGZlZWRiYWNrU3RyO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgdGhpcy5mZWVkYmFja0Rpdi5jbGFzc0xpc3QuYWRkKFwiYWxlcnRcIiwgXCJhbGVydC1zdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZUludGVyYWN0aW9uKCkge1xuICAgICAgICB0aGlzLmpUZXh0QXJlYS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QXR0YWNobWVudE5hbWUoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgYXR0YWNobWVudCBuYW1lIGZyb20gdGhlIC9ucy9hc3Nlc3NtZW50L2hhc19hdHRhY2htZW50IGVuZHBvaW50XG4gICAgICAgIGxldCByZXF1ZXN0VXJsID0gYC9ucy9hc3Nlc3NtZW50L2hhc19hdHRhY2htZW50LyR7dGhpcy5kaXZpZH1gO1xuICAgICAgICBpZiAodGhpcy5zaWQpIHtcbiAgICAgICAgICAgIHJlcXVlc3RVcmwgKz0gYD9zaWQ9JHt0aGlzLnNpZH1gO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdFVybCk7XG4gICAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBmZXRjaGluZyBhdHRhY2htZW50IG5hbWU6XCIsIHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgb2JqID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAob2JqLmRldGFpbC5oYXNBdHRhY2htZW50KSB7XG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIFMzIGtleSBmb3IgdGhlIGF0dGFjaG1lbnRcbiAgICAgICAgICAgIGxldCBmaWxlbmFtZSA9IG9iai5kZXRhaWwuaGFzQXR0YWNobWVudDtcbiAgICAgICAgICAgIC8vIGZpbGVuYW1lIGlzIGV2ZXJ0aGluZyBhZnRlciB0aGUgbGFzdCBzbGFzaFxuICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5zdWJzdHJpbmcoZmlsZW5hbWUubGFzdEluZGV4T2YoXCIvXCIpICsgMSk7XG4gICAgICAgICAgICBsZXQgZm1lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIGZtZXNzLmlubmVySFRNTCA9IGBBdHRhY2htZW50OiAke2ZpbGVuYW1lfWA7XG4gICAgICAgICAgICB0aGlzLmF0dGFjaERpdi5hcHBlbmRDaGlsZChmbWVzcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhc3luYyB1cGxvYWRGaWxlKCkge1xuICAgICAgICBjb25zdCBmaWxlcyA9IHRoaXMuZmlsZVVwbG9hZC5maWxlc1xuICAgICAgICAvLyBnZXQgdGhlIHN1ZmZpeCBmcm9tIHRoZSBmaWxlIG5hbWVcbiAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlc1swXS5uYW1lO1xuICAgICAgICBjb25zdCBzdWZmaXggPSBmaWxlTmFtZS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICAvLyBpZiB0aGUgc3VmZml4IGlzIG5vdCBpbiB0aGUgbGlzdCBvZiBhbGxvd2VkIHN1ZmZpeGVzLCByZXR1cm5cbiAgICAgICAgaWYgKCFbJ2pwZycsICdqcGVnJywgJ3BuZycsICdnaWYnLCAncGRmJ10uaW5jbHVkZXMoc3VmZml4KSkge1xuICAgICAgICAgICAgYWxlcnQoXCJGaWxlIHR5cGUgbm90IGFsbG93ZWQuIFBsZWFzZSB1cGxvYWQgYSBqcGcsIGpwZWcsIHBuZywgZ2lmLCBvciBwZGYgZmlsZS5cIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgdGhlIGZpbGUgc2l6ZSBpcyBncmVhdGVyIHRoYW4gNU1CLCByZXR1cm5cbiAgICAgICAgaWYgKGZpbGVzWzBdLnNpemUgPiA1ICogMTAyNCAqIDEwMjQpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiRmlsZSBzaXplIGV4Y2VlZHMgNU1CIGxpbWl0LiBQbGVhc2UgdXBsb2FkIGEgc21hbGxlciBmaWxlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgICAgaWYgKHRoaXMuZmlsZVVwbG9hZC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkYXRhLmFwcGVuZCgnZmlsZScsIGZpbGVzWzBdKVxuICAgICAgICAgICAgZmV0Y2goYC9ucy9sb2dnZXIvdXBsb2FkLyR7dGhpcy5kaXZpZH1gLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgYm9keTogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2aWV3RmlsZSgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBVUkwgZnJvbSB0aGUgUzMgQVBJIC0tIHNhdmVkIHdoZW4gd2UgZGlzcGxheSBpbiBncmFkZXIgbW9kZVxuICAgICAgICBpZiAodGhpcy5hdHRhY2hVUkwpIHtcbiAgICAgICAgICAgIC8vd2luZG93Lm9wZW4odGhpcy5hdHRhY2hVUkwsIFwiX2JsYW5rXCIpO1xuICAgICAgICAgICAgLy88ZW1iZWQgc3JjPVwiZXhhbXBsZS5wZGZcIiB0eXBlPVwiYXBwbGljYXRpb24vcGRmXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiNjAwcHhcIiAvPlxuICAgICAgICAgICAgLy9zd2l0Y2ggdG8gXG4gICAgICAgICAgICBjb25zdCBpbWFnZV93aW5kb3cgPSB3aW5kb3cub3BlbihcIlwiLCBcIl9ibGFua1wiKVxuICAgICAgICAgICAgaWYgKHRoaXMuYXR0YWNoVVJMLmluZGV4T2YoJy5wZGY/JykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW1iZWQgPSBpbWFnZV93aW5kb3cuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIm9iamVjdFwiKTtcbiAgICAgICAgICAgICAgICBlbWJlZC5zZXRBdHRyaWJ1dGUoXCJkYXRhXCIsIHRoaXMuYXR0YWNoVVJMKTtcbiAgICAgICAgICAgICAgICBlbWJlZC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYXBwbGljYXRpb24vcGRmXCIpO1xuICAgICAgICAgICAgICAgIGVtYmVkLnNldEF0dHJpYnV0ZShcIndpZHRoXCIsIFwiODAwcHhcIik7XG4gICAgICAgICAgICAgICAgZW1iZWQuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIFwiMTA0MHB4XCIpO1xuICAgICAgICAgICAgICAgIGltYWdlX3dpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVtYmVkKTtcbiAgICAgICAgICAgICAgICBsZXQgYWx0ID0gaW1hZ2Vfd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGFsdC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIHRoaXMuYXR0YWNoVVJMKTtcbiAgICAgICAgICAgICAgICBhbHQuaW5uZXJUZXh0ID0gXCJEb3dubG9hZCBQREZcIjtcbiAgICAgICAgICAgICAgICBlbWJlZC5hcHBlbmRDaGlsZChhbHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gaW1hZ2Vfd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XG4gICAgICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcInNyY1wiLCB0aGlzLmF0dGFjaFVSTCk7XG4gICAgICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIFwid2lkdGg6MTAwJTsgaGVpZ2h0OmF1dG87XCIpO1xuICAgICAgICAgICAgICAgIGltYWdlX3dpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGVydChcIk5vIGF0dGFjaG1lbnQgZm9yIHRoaXMgc3R1ZGVudC5cIilcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9c2hvcnRhbnN3ZXJdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgICBpZiAoIWVsLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IG5ldyBTaG9ydEFuc3dlcih7XG4gICAgICAgICAgICAgICAgICAgIG9yaWc6IGVsLFxuICAgICAgICAgICAgICAgICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIFNob3J0QW5zd2VyIFByb2JsZW0gJHtlbC5pZH1cbiAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iLCJpbXBvcnQgU2hvcnRBbnN3ZXIgZnJvbSBcIi4vc2hvcnRhbnN3ZXIuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZWRTaG9ydEFuc3dlciBleHRlbmRzIFNob3J0QW5zd2VyIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgICAgIHN1cGVyKG9wdHMpO1xuICAgICAgICB0aGlzLnJlbmRlclRpbWVkSWNvbih0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgICAgIHRoaXMuaXNUaW1lZCA9IHRydWU7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbnMoKTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgIGlmICh0aGlzLnN1Ym1pdEJ1dHRvbikge1xuICAgICAgICAgICAgdGhpcy5zdWJtaXRCdXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlclRpbWVkSWNvbihjb21wb25lbnQpIHtcbiAgICAgICAgLy8gcmVuZGVycyB0aGUgY2xvY2sgaWNvbiBvbiB0aW1lZCBjb21wb25lbnRzLiAgICBUaGUgY29tcG9uZW50IHBhcmFtZXRlclxuICAgICAgICAvLyBpcyB0aGUgZWxlbWVudCB0aGF0IHRoZSBpY29uIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICAgICAgdmFyIHRpbWVJY29uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIHRpbWVJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcblxuICAgICAgICB0aW1lSWNvbi5zcmMgPSBcIi4uL19zdGF0aWMvY2xvY2sucG5nXCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLndpZHRoID0gXCIxNXB4XCI7XG4gICAgICAgIHRpbWVJY29uLnN0eWxlLmhlaWdodCA9IFwiMTVweFwiO1xuXG4gICAgICAgIHRpbWVJY29uRGl2LmNsYXNzTmFtZSA9IFwidGltZVRpcFwiO1xuICAgICAgICB0aW1lSWNvbkRpdi50aXRsZSA9IFwiXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LmFwcGVuZENoaWxkKHRpbWVJY29uKTtcblxuICAgICAgICAvLyBJZiBmaXJzdENoaWxkIGlzIG51bGwsIGluc2VydEJlZm9yZSBhY3RzIGxpa2UgYXBwZW5kQ2hpbGRcbiAgICAgICAgY29tcG9uZW50Lmluc2VydEJlZm9yZSh0aW1lSWNvbkRpdiwgY29tcG9uZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBjaGVja0NvcnJlY3RUaW1lZCgpIHtcbiAgICAgICAgcmV0dXJuIFwiSVwiOyAvLyB3ZSBpZ25vcmUgdGhpcyBpbiB0aGUgZ3JhZGluZ1xuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIGlmICh0aGlzLmZlZWRiYWNrRGl2KSB7XG4gICAgICAgICAgICB0aGlzLmZlZWRiYWNrRGl2LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cblxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LnNob3J0YW5zd2VyID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICBpZiAob3B0cy50aW1lZCkge1xuICAgICAgICByZXR1cm4gbmV3IFRpbWVkU2hvcnRBbnN3ZXIob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2hvcnRBbnN3ZXIob3B0cyk7XG59O1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9