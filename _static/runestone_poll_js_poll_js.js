"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_poll_js_poll_js"],{

/***/ 11168:
/*!***********************************!*\
  !*** ./runestone/poll/js/poll.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Poll)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _css_poll_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/poll.css */ 96835);
/*
__author__ = Kirby Olson
__date__ = 6/12/2015  */






class Poll extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; //entire <p> element
        this.origElem = orig;
        this.divid = orig.id;
        this.children = this.origElem.childNodes;
        this.optionList = [];
        this.optsArray = [];
        this.comment = false;
        if (this.origElem.hasAttribute("data-comment")) {
            this.comment = true;
        }
        this.resultsViewer = this.origElem.getAttribute("data-results");
        this.getQuestionText();
        this.getOptionText(); //populates optionList
        this.renderPoll(); //generates HTML
        // Checks localStorage to see if this poll has already been completed by this user.
        this.checkPollStorage();
        this.caption = "Poll";
        this.addCaption("runestone");
    }
    getQuestionText() {
        //finds the text inside the parent tag, but before the first <li> tag and sets it as the question
        var _this = this;
        var firstAnswer;
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName == "LI") {
                firstAnswer = _this.children[i];
                break;
            }
        }
        var delimiter = firstAnswer.outerHTML;
        var fulltext = this.origElem.innerHTML;
        var temp = fulltext.split(delimiter);
        this.question = temp[0];
    }
    getOptionText() {
        //Gets the text from each <li> tag and places it in this.optionList
        var _this = this;
        for (var i = 0; i < this.children.length; i++) {
            if (_this.children[i].tagName == "LI") {
                _this.optionList.push(_this.children[i].innerHTML);
            }
        }
    }
    renderPoll() {
        //generates the HTML that the user interacts with
        var _this = this;
        this.containerDiv = document.createElement("div");
        this.pollForm = document.createElement("form");
        this.resultsDiv = document.createElement("div");
        this.resultsDiv.classList.add("poll-results");
        this.containerDiv.id = this.divid;
        const origClass = this.origElem.getAttribute("class");
        if (origClass) {
            this.containerDiv.classList.add(...origClass.split(" ").filter(Boolean));
        }
        this.pollForm.innerHTML = `<div class="exercise-statement">${this.question}</div>`;
        this.pollForm.id = this.divid + "_form";
        this.pollForm.method = "get";
        this.pollForm.action = "";
        this.pollForm.onsubmit = function () { return false; };
        this.pollFieldset = document.createElement("fieldset");
        this.pollForm.appendChild(this.pollFieldset);
        for (var i = 0; i < this.optionList.length; i++) {
            let label = document.createElement("label");
            label.classList.add("poll-option");
            label.innerHTML += this.optionList[i]; // text content
            var radio = document.createElement("input");
            var tmpid = _this.divid + "_opt_" + i;
            radio.id = tmpid;
            radio.name = this.divid + "_group1";
            radio.type = "radio";
            radio.value = i;
            radio.classList.add("poll-choice-input");
            radio.addEventListener("click", this.submitPoll.bind(this));
            label.prepend(radio);
            this.pollFieldset.appendChild(label);
            this.optsArray.push(radio);
        }

        if (this.comment) {
            this.renderTextField();
        }
        this.resultsDiv.id = this.divid + "_results";
        this.containerDiv.appendChild(this.pollForm);
        this.containerDiv.appendChild(this.resultsDiv);
        this.origElem.replaceWith(this.containerDiv);
        this.queueMathJax(this.containerDiv);
    }
    renderTextField() {
        this.textfield = document.createElement("input");
        this.textfield.type = "text";
        this.textfield.classList.add("form-control");
        this.textfield.style.width = "300px";
        this.textfield.name = this.divid + "_comment";
        this.textfield.placeholder = "Any comments?";
        this.pollForm.appendChild(this.textfield);
        this.pollForm.appendChild(document.createElement("br"));
    }
    async submitPoll() {
        //checks the poll, sets localstorage and submits to the server
        var poll_val = null;
        for (var i = 0; i < this.optsArray.length; i++) {
            if (this.optsArray[i].checked) {
                poll_val = this.optsArray[i].value;
                break;
            }
        }
        if (poll_val === null) return;
        var comment_val = "";
        if (this.comment) {
            comment_val = this.textfield.value;
        }
        var act = "";
        if (comment_val !== "") {
            act = poll_val + ":" + comment_val;
        } else {
            act = poll_val;
        }
        var eventInfo = { event: "poll", act: act, div_id: this.divid };
        // log the response to the database
        this.logBookEvent(eventInfo); // in bookfuncs.js
        // log the fact that the user has answered the poll to local storage
        let onlineResponse = "Thanks, your response has been recorded";
        let offlineResponse = "Thanks, your answers are not recorded";
        let onlineUpdate = "Only Your last reponse is recorded";
        let offlineUpdate = "Thanks, your answers are not recorded";
        localStorage.setItem(this.divid, "true");
        if (!document.getElementById(`${this.divid}_sent`)) {
            const span = document.createElement("span");
            span.id = `${this.divid}_sent`;
            span.innerHTML = `<strong>${eBookConfig.useRunestoneServices ? onlineResponse : offlineResponse}</strong>`;
            this.pollForm.appendChild(span);
        } else {
            const sentEl = document.getElementById(`${this.divid}_sent`);
            sentEl.innerHTML = `<strong>${eBookConfig.useRunestoneServices ? onlineUpdate : offlineUpdate}</strong>`;
        }
        // show the results of the poll
        if (this.resultsViewer === "all") {
            var data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            try {
                const params = new URLSearchParams(data);
                const resp = await fetch(`${eBookConfig.new_server_prefix}/assessment/getpollresults?${params.toString()}`);
                const json = await resp.json();
                this.showPollResults(json);
            } catch (e) {
                this.indicate_component_ready();
            }
        }
    }
    showPollResults(results) {
        //displays the results returned by the server
        results = results.detail;
        var total = results["total"];
        var optCounts = results["opt_counts"];
        var div_id = results["div_id"];
        var my_vote = results["my_vote"];
        // restore current users vote
        if (my_vote > -1) {
            this.optsArray[my_vote].checked = true;
        }
        // show results summary if appropriate
        if (
            (this.resultsViewer === "all" &&
                localStorage.getItem(this.divid) === "true") ||
            eBookConfig.isInstructor
        ) {
            this.resultsDiv.innerHTML = `<b>Results:</b> ${total} responses <br><br>`;
            var list = document.createElement("div");
            list.classList.add("results-container");
            for (var i = 0; i < this.optionList.length; i++) {
                var count;
                var percent;
                if (optCounts[i] > 0) {
                    count = optCounts[i];
                    percent = (count / total) * 100;
                } else {
                    count = 0;
                    percent = 0;
                }
                var text = count + " (" + Math.round(10 * percent) / 10 + "%)"; // round percent to 10ths
                let progressCounterEl = document.createElement("div");
                progressCounterEl.className = "progresscounter";
                progressCounterEl.innerText = `${i + 1}. `;
                let progressBarEl = document.createElement("div");
                let progressBarHTML = "";
                if (percent > 10) {
                    progressBarHTML =
                        "<div class='progress'>" +
                        "<div class='progress-bar progress-bar-success'" +
                        `style="width: ${percent}%; min-width: 2em;">` +
                        "<span class='poll-text'>" +
                        text +
                        "</span></div></div>";
                } else {
                    progressBarHTML =
                        "<div class='progress'>" +
                        "<div class='progress-bar progress-bar-success'" +
                        `style="width: ${percent}%; min-width: 2em;"></div>` +
                        "<span class='poll-text' style='margin: 0 0 0 10px;'>" +
                        text +
                        "</span></div>";
                }
                progressBarEl.innerHTML = progressBarHTML;
                list.appendChild(progressCounterEl);
                list.appendChild(progressBarEl);
            }
            this.resultsDiv.appendChild(list);
        }
        this.indicate_component_ready();
    }
    disableOptions() { }
    async checkPollStorage() {
        //checks the localstorage to see if the poll has been completed already
        var _this = this;
        var len = localStorage.length;
        if (len > 0) {
            //If the poll has already been completed, show the results
            var data = {};
            data.div_id = this.divid;
            data.course = eBookConfig.course;
            try {
                const params = new URLSearchParams(data);
                const resp = await fetch(`${eBookConfig.new_server_prefix}/assessment/getpollresults?${params.toString()}`);
                const json = await resp.json();
                this.showPollResults(json);
            } catch (e) {
                this.indicate_component_ready();
            }
        } else {
            this.indicate_component_ready();
        }
    }
}

// Do not render poll data until login-complete event so we know instructor status
document.addEventListener("runestone:login-complete", function () {
    document.querySelectorAll("[data-component=poll]").forEach(function (el, index) {
        try {
            window.componentMap[el.id] = new Poll({ orig: el });
        } catch (err) {
            console.log(`Error rendering Poll Problem ${el.id}
                         Details: ${err}`);
            console.log(err.stack);
        }
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.poll = function (opts) {
    return new Poll(opts);
};


/***/ }),

/***/ 96835:
/*!*************************************!*\
  !*** ./runestone/poll/css/poll.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQzFRQSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcG9sbC9qcy9wb2xsLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvcG9sbC9jc3MvcG9sbC5jc3MiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbl9fYXV0aG9yX18gPSBLaXJieSBPbHNvblxuX19kYXRlX18gPSA2LzEyLzIwMTUgICovXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQgXCIuLi9jc3MvcG9sbC5jc3NcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2xsIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vZW50aXJlIDxwPiBlbGVtZW50XG4gICAgICAgIHRoaXMub3JpZ0VsZW0gPSBvcmlnO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICAgICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMub3JpZ0VsZW0uY2hpbGROb2RlcztcbiAgICAgICAgdGhpcy5vcHRpb25MaXN0ID0gW107XG4gICAgICAgIHRoaXMub3B0c0FycmF5ID0gW107XG4gICAgICAgIHRoaXMuY29tbWVudCA9IGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5vcmlnRWxlbS5oYXNBdHRyaWJ1dGUoXCJkYXRhLWNvbW1lbnRcIikpIHtcbiAgICAgICAgICAgIHRoaXMuY29tbWVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZXN1bHRzVmlld2VyID0gdGhpcy5vcmlnRWxlbS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXJlc3VsdHNcIik7XG4gICAgICAgIHRoaXMuZ2V0UXVlc3Rpb25UZXh0KCk7XG4gICAgICAgIHRoaXMuZ2V0T3B0aW9uVGV4dCgpOyAvL3BvcHVsYXRlcyBvcHRpb25MaXN0XG4gICAgICAgIHRoaXMucmVuZGVyUG9sbCgpOyAvL2dlbmVyYXRlcyBIVE1MXG4gICAgICAgIC8vIENoZWNrcyBsb2NhbFN0b3JhZ2UgdG8gc2VlIGlmIHRoaXMgcG9sbCBoYXMgYWxyZWFkeSBiZWVuIGNvbXBsZXRlZCBieSB0aGlzIHVzZXIuXG4gICAgICAgIHRoaXMuY2hlY2tQb2xsU3RvcmFnZSgpO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIlBvbGxcIjtcbiAgICAgICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgIH1cbiAgICBnZXRRdWVzdGlvblRleHQoKSB7XG4gICAgICAgIC8vZmluZHMgdGhlIHRleHQgaW5zaWRlIHRoZSBwYXJlbnQgdGFnLCBidXQgYmVmb3JlIHRoZSBmaXJzdCA8bGk+IHRhZyBhbmQgc2V0cyBpdCBhcyB0aGUgcXVlc3Rpb25cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGZpcnN0QW5zd2VyO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2ldLnRhZ05hbWUgPT0gXCJMSVwiKSB7XG4gICAgICAgICAgICAgICAgZmlyc3RBbnN3ZXIgPSBfdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZGVsaW1pdGVyID0gZmlyc3RBbnN3ZXIub3V0ZXJIVE1MO1xuICAgICAgICB2YXIgZnVsbHRleHQgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgdmFyIHRlbXAgPSBmdWxsdGV4dC5zcGxpdChkZWxpbWl0ZXIpO1xuICAgICAgICB0aGlzLnF1ZXN0aW9uID0gdGVtcFswXTtcbiAgICB9XG4gICAgZ2V0T3B0aW9uVGV4dCgpIHtcbiAgICAgICAgLy9HZXRzIHRoZSB0ZXh0IGZyb20gZWFjaCA8bGk+IHRhZyBhbmQgcGxhY2VzIGl0IGluIHRoaXMub3B0aW9uTGlzdFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jaGlsZHJlbltpXS50YWdOYW1lID09IFwiTElcIikge1xuICAgICAgICAgICAgICAgIF90aGlzLm9wdGlvbkxpc3QucHVzaChfdGhpcy5jaGlsZHJlbltpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlclBvbGwoKSB7XG4gICAgICAgIC8vZ2VuZXJhdGVzIHRoZSBIVE1MIHRoYXQgdGhlIHVzZXIgaW50ZXJhY3RzIHdpdGhcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnBvbGxGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gICAgICAgIHRoaXMucmVzdWx0c0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRoaXMucmVzdWx0c0Rpdi5jbGFzc0xpc3QuYWRkKFwicG9sbC1yZXN1bHRzXCIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgIGNvbnN0IG9yaWdDbGFzcyA9IHRoaXMub3JpZ0VsZW0uZ2V0QXR0cmlidXRlKFwiY2xhc3NcIik7XG4gICAgICAgIGlmIChvcmlnQ2xhc3MpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmNsYXNzTGlzdC5hZGQoLi4ub3JpZ0NsYXNzLnNwbGl0KFwiIFwiKS5maWx0ZXIoQm9vbGVhbikpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9sbEZvcm0uaW5uZXJIVE1MID0gYDxkaXYgY2xhc3M9XCJleGVyY2lzZS1zdGF0ZW1lbnRcIj4ke3RoaXMucXVlc3Rpb259PC9kaXY+YDtcbiAgICAgICAgdGhpcy5wb2xsRm9ybS5pZCA9IHRoaXMuZGl2aWQgKyBcIl9mb3JtXCI7XG4gICAgICAgIHRoaXMucG9sbEZvcm0ubWV0aG9kID0gXCJnZXRcIjtcbiAgICAgICAgdGhpcy5wb2xsRm9ybS5hY3Rpb24gPSBcIlwiO1xuICAgICAgICB0aGlzLnBvbGxGb3JtLm9uc3VibWl0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZmFsc2U7IH07XG4gICAgICAgIHRoaXMucG9sbEZpZWxkc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZpZWxkc2V0XCIpO1xuICAgICAgICB0aGlzLnBvbGxGb3JtLmFwcGVuZENoaWxkKHRoaXMucG9sbEZpZWxkc2V0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiKTtcbiAgICAgICAgICAgIGxhYmVsLmNsYXNzTGlzdC5hZGQoXCJwb2xsLW9wdGlvblwiKTtcbiAgICAgICAgICAgIGxhYmVsLmlubmVySFRNTCArPSB0aGlzLm9wdGlvbkxpc3RbaV07IC8vIHRleHQgY29udGVudFxuICAgICAgICAgICAgdmFyIHJhZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICAgICAgdmFyIHRtcGlkID0gX3RoaXMuZGl2aWQgKyBcIl9vcHRfXCIgKyBpO1xuICAgICAgICAgICAgcmFkaW8uaWQgPSB0bXBpZDtcbiAgICAgICAgICAgIHJhZGlvLm5hbWUgPSB0aGlzLmRpdmlkICsgXCJfZ3JvdXAxXCI7XG4gICAgICAgICAgICByYWRpby50eXBlID0gXCJyYWRpb1wiO1xuICAgICAgICAgICAgcmFkaW8udmFsdWUgPSBpO1xuICAgICAgICAgICAgcmFkaW8uY2xhc3NMaXN0LmFkZChcInBvbGwtY2hvaWNlLWlucHV0XCIpO1xuICAgICAgICAgICAgcmFkaW8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuc3VibWl0UG9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIGxhYmVsLnByZXBlbmQocmFkaW8pO1xuICAgICAgICAgICAgdGhpcy5wb2xsRmllbGRzZXQuYXBwZW5kQ2hpbGQobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5vcHRzQXJyYXkucHVzaChyYWRpbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRleHRGaWVsZCgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzdWx0c0Rpdi5pZCA9IHRoaXMuZGl2aWQgKyBcIl9yZXN1bHRzXCI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKHRoaXMucG9sbEZvcm0pO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLnJlc3VsdHNEaXYpO1xuICAgICAgICB0aGlzLm9yaWdFbGVtLnJlcGxhY2VXaXRoKHRoaXMuY29udGFpbmVyRGl2KTtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbiAgICByZW5kZXJUZXh0RmllbGQoKSB7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICB0aGlzLnRleHRmaWVsZC50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLmNsYXNzTGlzdC5hZGQoXCJmb3JtLWNvbnRyb2xcIik7XG4gICAgICAgIHRoaXMudGV4dGZpZWxkLnN0eWxlLndpZHRoID0gXCIzMDBweFwiO1xuICAgICAgICB0aGlzLnRleHRmaWVsZC5uYW1lID0gdGhpcy5kaXZpZCArIFwiX2NvbW1lbnRcIjtcbiAgICAgICAgdGhpcy50ZXh0ZmllbGQucGxhY2Vob2xkZXIgPSBcIkFueSBjb21tZW50cz9cIjtcbiAgICAgICAgdGhpcy5wb2xsRm9ybS5hcHBlbmRDaGlsZCh0aGlzLnRleHRmaWVsZCk7XG4gICAgICAgIHRoaXMucG9sbEZvcm0uYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICB9XG4gICAgYXN5bmMgc3VibWl0UG9sbCgpIHtcbiAgICAgICAgLy9jaGVja3MgdGhlIHBvbGwsIHNldHMgbG9jYWxzdG9yYWdlIGFuZCBzdWJtaXRzIHRvIHRoZSBzZXJ2ZXJcbiAgICAgICAgdmFyIHBvbGxfdmFsID0gbnVsbDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdHNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0c0FycmF5W2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgICAgICBwb2xsX3ZhbCA9IHRoaXMub3B0c0FycmF5W2ldLnZhbHVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwb2xsX3ZhbCA9PT0gbnVsbCkgcmV0dXJuO1xuICAgICAgICB2YXIgY29tbWVudF92YWwgPSBcIlwiO1xuICAgICAgICBpZiAodGhpcy5jb21tZW50KSB7XG4gICAgICAgICAgICBjb21tZW50X3ZhbCA9IHRoaXMudGV4dGZpZWxkLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhY3QgPSBcIlwiO1xuICAgICAgICBpZiAoY29tbWVudF92YWwgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGFjdCA9IHBvbGxfdmFsICsgXCI6XCIgKyBjb21tZW50X3ZhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdCA9IHBvbGxfdmFsO1xuICAgICAgICB9XG4gICAgICAgIHZhciBldmVudEluZm8gPSB7IGV2ZW50OiBcInBvbGxcIiwgYWN0OiBhY3QsIGRpdl9pZDogdGhpcy5kaXZpZCB9O1xuICAgICAgICAvLyBsb2cgdGhlIHJlc3BvbnNlIHRvIHRoZSBkYXRhYmFzZVxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudChldmVudEluZm8pOyAvLyBpbiBib29rZnVuY3MuanNcbiAgICAgICAgLy8gbG9nIHRoZSBmYWN0IHRoYXQgdGhlIHVzZXIgaGFzIGFuc3dlcmVkIHRoZSBwb2xsIHRvIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgbGV0IG9ubGluZVJlc3BvbnNlID0gXCJUaGFua3MsIHlvdXIgcmVzcG9uc2UgaGFzIGJlZW4gcmVjb3JkZWRcIjtcbiAgICAgICAgbGV0IG9mZmxpbmVSZXNwb25zZSA9IFwiVGhhbmtzLCB5b3VyIGFuc3dlcnMgYXJlIG5vdCByZWNvcmRlZFwiO1xuICAgICAgICBsZXQgb25saW5lVXBkYXRlID0gXCJPbmx5IFlvdXIgbGFzdCByZXBvbnNlIGlzIHJlY29yZGVkXCI7XG4gICAgICAgIGxldCBvZmZsaW5lVXBkYXRlID0gXCJUaGFua3MsIHlvdXIgYW5zd2VycyBhcmUgbm90IHJlY29yZGVkXCI7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGl2aWQsIFwidHJ1ZVwiKTtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgJHt0aGlzLmRpdmlkfV9zZW50YCkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIHNwYW4uaWQgPSBgJHt0aGlzLmRpdmlkfV9zZW50YDtcbiAgICAgICAgICAgIHNwYW4uaW5uZXJIVE1MID0gYDxzdHJvbmc+JHtlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyA/IG9ubGluZVJlc3BvbnNlIDogb2ZmbGluZVJlc3BvbnNlfTwvc3Ryb25nPmA7XG4gICAgICAgICAgICB0aGlzLnBvbGxGb3JtLmFwcGVuZENoaWxkKHNwYW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc2VudEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYCR7dGhpcy5kaXZpZH1fc2VudGApO1xuICAgICAgICAgICAgc2VudEVsLmlubmVySFRNTCA9IGA8c3Ryb25nPiR7ZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMgPyBvbmxpbmVVcGRhdGUgOiBvZmZsaW5lVXBkYXRlfTwvc3Ryb25nPmA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2hvdyB0aGUgcmVzdWx0cyBvZiB0aGUgcG9sbFxuICAgICAgICBpZiAodGhpcy5yZXN1bHRzVmlld2VyID09PSBcImFsbFwiKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICAgICAgZGF0YS5jb3Vyc2UgPSBlQm9va0NvbmZpZy5jb3Vyc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZGF0YSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IGZldGNoKGAke2VCb29rQ29uZmlnLm5ld19zZXJ2ZXJfcHJlZml4fS9hc3Nlc3NtZW50L2dldHBvbGxyZXN1bHRzPyR7cGFyYW1zLnRvU3RyaW5nKCl9YCk7XG4gICAgICAgICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlc3AuanNvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvd1BvbGxSZXN1bHRzKGpzb24pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd1BvbGxSZXN1bHRzKHJlc3VsdHMpIHtcbiAgICAgICAgLy9kaXNwbGF5cyB0aGUgcmVzdWx0cyByZXR1cm5lZCBieSB0aGUgc2VydmVyXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmRldGFpbDtcbiAgICAgICAgdmFyIHRvdGFsID0gcmVzdWx0c1tcInRvdGFsXCJdO1xuICAgICAgICB2YXIgb3B0Q291bnRzID0gcmVzdWx0c1tcIm9wdF9jb3VudHNcIl07XG4gICAgICAgIHZhciBkaXZfaWQgPSByZXN1bHRzW1wiZGl2X2lkXCJdO1xuICAgICAgICB2YXIgbXlfdm90ZSA9IHJlc3VsdHNbXCJteV92b3RlXCJdO1xuICAgICAgICAvLyByZXN0b3JlIGN1cnJlbnQgdXNlcnMgdm90ZVxuICAgICAgICBpZiAobXlfdm90ZSA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLm9wdHNBcnJheVtteV92b3RlXS5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaG93IHJlc3VsdHMgc3VtbWFyeSBpZiBhcHByb3ByaWF0ZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgICAodGhpcy5yZXN1bHRzVmlld2VyID09PSBcImFsbFwiICYmXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5kaXZpZCkgPT09IFwidHJ1ZVwiKSB8fFxuICAgICAgICAgICAgZUJvb2tDb25maWcuaXNJbnN0cnVjdG9yXG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHRzRGl2LmlubmVySFRNTCA9IGA8Yj5SZXN1bHRzOjwvYj4gJHt0b3RhbH0gcmVzcG9uc2VzIDxicj48YnI+YDtcbiAgICAgICAgICAgIHZhciBsaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGxpc3QuY2xhc3NMaXN0LmFkZChcInJlc3VsdHMtY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9wdGlvbkxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY291bnQ7XG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgaWYgKG9wdENvdW50c1tpXSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSBvcHRDb3VudHNbaV07XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAoY291bnQgLyB0b3RhbCkgKiAxMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSBjb3VudCArIFwiIChcIiArIE1hdGgucm91bmQoMTAgKiBwZXJjZW50KSAvIDEwICsgXCIlKVwiOyAvLyByb3VuZCBwZXJjZW50IHRvIDEwdGhzXG4gICAgICAgICAgICAgICAgbGV0IHByb2dyZXNzQ291bnRlckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0NvdW50ZXJFbC5jbGFzc05hbWUgPSBcInByb2dyZXNzY291bnRlclwiO1xuICAgICAgICAgICAgICAgIHByb2dyZXNzQ291bnRlckVsLmlubmVyVGV4dCA9IGAke2kgKyAxfS4gYDtcbiAgICAgICAgICAgICAgICBsZXQgcHJvZ3Jlc3NCYXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICAgICAgbGV0IHByb2dyZXNzQmFySFRNTCA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0JhckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcyc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3MnXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYHN0eWxlPVwid2lkdGg6ICR7cGVyY2VudH0lOyBtaW4td2lkdGg6IDJlbTtcIj5gICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gY2xhc3M9J3BvbGwtdGV4dCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dCArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjwvc3Bhbj48L2Rpdj48L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzc0JhckhUTUwgPVxuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcyc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3MnXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYHN0eWxlPVwid2lkdGg6ICR7cGVyY2VudH0lOyBtaW4td2lkdGg6IDJlbTtcIj48L2Rpdj5gICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPHNwYW4gY2xhc3M9J3BvbGwtdGV4dCcgc3R5bGU9J21hcmdpbjogMCAwIDAgMTBweDsnPlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCI8L3NwYW4+PC9kaXY+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyRWwuaW5uZXJIVE1MID0gcHJvZ3Jlc3NCYXJIVE1MO1xuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NDb3VudGVyRWwpO1xuICAgICAgICAgICAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NCYXJFbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlc3VsdHNEaXYuYXBwZW5kQ2hpbGQobGlzdCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG4gICAgZGlzYWJsZU9wdGlvbnMoKSB7IH1cbiAgICBhc3luYyBjaGVja1BvbGxTdG9yYWdlKCkge1xuICAgICAgICAvL2NoZWNrcyB0aGUgbG9jYWxzdG9yYWdlIHRvIHNlZSBpZiB0aGUgcG9sbCBoYXMgYmVlbiBjb21wbGV0ZWQgYWxyZWFkeVxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgbGVuID0gbG9jYWxTdG9yYWdlLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA+IDApIHtcbiAgICAgICAgICAgIC8vSWYgdGhlIHBvbGwgaGFzIGFscmVhZHkgYmVlbiBjb21wbGV0ZWQsIHNob3cgdGhlIHJlc3VsdHNcbiAgICAgICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLmRpdl9pZCA9IHRoaXMuZGl2aWQ7XG4gICAgICAgICAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhkYXRhKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgZmV0Y2goYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0cG9sbHJlc3VsdHM/JHtwYXJhbXMudG9TdHJpbmcoKX1gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzcC5qc29uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaG93UG9sbFJlc3VsdHMoanNvbik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdGVfY29tcG9uZW50X3JlYWR5KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIERvIG5vdCByZW5kZXIgcG9sbCBkYXRhIHVudGlsIGxvZ2luLWNvbXBsZXRlIGV2ZW50IHNvIHdlIGtub3cgaW5zdHJ1Y3RvciBzdGF0dXNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJydW5lc3RvbmU6bG9naW4tY29tcGxldGVcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1jb21wb25lbnQ9cG9sbF1cIikuZm9yRWFjaChmdW5jdGlvbiAoZWwsIGluZGV4KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2VsLmlkXSA9IG5ldyBQb2xsKHsgb3JpZzogZWwgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBQb2xsIFByb2JsZW0gJHtlbC5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICBEZXRhaWxzOiAke2Vycn1gKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxud2luZG93LmNvbXBvbmVudF9mYWN0b3J5LnBvbGwgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgUG9sbChvcHRzKTtcbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=