"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_webwork_js_webwork_js"],{

/***/ 84680:
/*!*****************************************!*\
  !*** ./runestone/webwork/js/webwork.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);


window.wwList = {}; // Multiple Choice dictionary

class WebWork extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.useRunestoneServices = true;
        this.multipleanswers = false;
        this.divid = opts.orig.id;
        this.correct = null;
        this.optional = false;
        this.answerList = [];
        this.correctList = [];
        this.question = null;
        this.caption = "WebWork";
        this.containerDiv = opts.orig;
        this.answers = {};
        this.percent = 0;
        //this.addCaption("runestone");
        if (this.divid !== "fakeww-ww-rs") {
            this.checkServer("webwork", true);
        }
        window.wwList[this.divid] = this;
    }

    restoreAnswers(data) {
        // Restore answers from storage retrieval done in RunestoneBase
        // sometimes data.answer can be null
        if (!data.answer) {
            data.answer = "";
        }
        // data.answers comes from postgresql as a JSON column type so no need to parse it.

        this.answers = data.answer;
        this.correct = data.correct;
        this.percent = data.percent;
        console.log(
            `about to decorate the status of WW ${this.divid} ${this.correct}`
        );
        this.decorateStatus();
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
        var ex = localStorage.getItem(this.localStorageKey());

        if (ex !== null) {
            let error = false;
            try {
                storedData = JSON.parse(ex);
                // Save the answers so that when the question is activated we can restore.
                this.answers = storedData.answer;
                this.correct = storedData.correct;
                this.percent = storedData.percent;
                // We still decorate the webwork question even if it is not active.
                this.decorateStatus();
            } catch (err) {
                // error while parsing; likely due to bad value stored in storage
                console.log(`Error parsing stored WebWork data for ${this.divid}: ${err.message}`);
                error = true;
            }
            if (error || storedData.timestamp < eBookConfig.termStartDate) {
                localStorage.removeItem(this.localStorageKey());
                return;
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

    // This is called when the runestone_ww_check event is triggered by the webwork problem
    // Note the webwork problem is in an iframe so we rely on this event and the data
    // compiled and passed along with the event to "grade" the answer.
    processCurrentAnswers(data) {
        let correctCount = 0;
        let qCount = 0;
        let actString = "check:";
        this.answerObj = {};
        this.lastAnswerRaw = data;
        this.answerObj.answers = {};
        this.answerObj.mqAnswers = {};
        // data.inputs_
        for (let k of Object.keys(data.rh_result.answers)) {
            qCount += 1;
            if (data.rh_result.answers[k].score == 1) {
                correctCount += 1;
            }
            // mostly grab original_student_ans, but grab student_value for MC exercises
            let student_ans;
            if (
                !("ww_version" in data) ||
                data.ww_version.includes("2.16") ||
                data.ww_version.includes("2.17") ||
                data.ww_version.includes("2.18")
            ) {
                // Mostly grab original_student_ans, but grab student_value for MC exercises
                student_ans = [
                    "Value (parserRadioButtons)",
                    "Value (PopUp)",
                    "Value (CheckboxList)",
                ].includes(data.rh_result.answers[k].type)
                    ? data.rh_result.answers[k].student_value
                    : data.rh_result.answers[k].original_student_ans;
            } else {
                // Literally get the input refs
                // data.inputs_ref[k] will usually be a string, the @value of the answer input field that was submitted
                // However in at least the case of checkboxes, data.inputs_ref[k] will be an array
                // So however this is ultimately stored in the Runestone database should respect ans preserve this as an array, not stringified
                student_ans = data.inputs_ref[k];
            }
            this.answerObj.answers[k] = student_ans;
            let mqKey = `MaThQuIlL_${k}`;
            this.answerObj.mqAnswers[mqKey] = data.inputs_ref[mqKey];
            actString += `actual:${student_ans}:expected:${data.rh_result.answers[k].correct_value}:`;
        }
        let pct = correctCount / qCount;
        // If this.percent is set, then runestonebase will transmit it as part of
        // the logBookEvent API.
        this.percent = pct;
        this.actString =
            actString + `correct:${correctCount}:count:${qCount}:pct:${pct}`;
        if (pct == 1.0) {
            this.correct = true;
        } else {
            this.correct = false;
        }
        let ls = {};
        ls.answer = this.answerObj;
        ls.correct = this.correct;
        ls.percent = this.percent;
        this.setLocalStorage(ls);
        this.decorateStatus();
    }

    async logCurrentAnswer(sid) {
        this.logBookEvent({
            event: "webwork",
            div_id: this.divid, //todo unmangle problemid
            act: this.actString,
            correct: this.correct,
            answer: JSON.stringify(this.answerObj),
        });
    }

    checkCurrentAnswer() {}
}

//
// These are functions that get called in response to webwork generated events.
// submitting the work, or showing an answer.
function logWebWork(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.processCurrentAnswers(data);
            wwObj.logCurrentAnswer();
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`
            );
        }
    }
}

function logShowCorrect(e, data) {
    if (eBookConfig.useRunestoneServices) {
        let wwObj = wwList[data.inputs_ref.problemUUID.replace("-ww-rs", "")];
        if (wwObj) {
            wwObj.logBookEvent({
                event: "webwork",
                div_id: data.inputs_ref.problemUUID,
                act: "show",
            });
        } else {
            console.log(
                `Error: Could not find webwork object ${data.inputs_ref.problemUUID}`
            );
        }
    }
}

async function getScores(sid, wwId) {}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.webwork = function (opts) {
    return new WebWork(opts);
};

$(function () {
    $("body").on("runestone_ww_check", logWebWork);
    $("body").on("runestone_show_correct", logShowCorrect);
});

$(document).on("runestone:login-complete", function () {
    $("[data-component=webwork]").each(function (index) {
        // MC
        var opts = {
            orig: this,
            useRunestoneServices: eBookConfig.useRunestoneServices,
        };
        if ($(this).closest("[data-component=timedAssessment]").length == 0) {
            // If this element exists within a timed component, don't render it here
            window.wwList[this.id] = new WebWork(opts);
        }
    });
});


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX3dlYndvcmtfanNfd2Vid29ya19qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUEwRDs7QUFFMUQsb0JBQW9COztBQUVwQixzQkFBc0IsZ0VBQWE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxZQUFZLEVBQUUsYUFBYTtBQUM3RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsd0NBQXdDO0FBQ3hDLHFFQUFxRSxXQUFXLElBQUksWUFBWTtBQUNoRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsRUFBRTtBQUN2QztBQUNBLG1DQUFtQyxZQUFZLFlBQVksd0NBQXdDO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxhQUFhLFNBQVMsT0FBTyxPQUFPLElBQUk7QUFDM0U7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSx3REFBd0QsNEJBQTRCO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsVUFBVTtBQUNWO0FBQ0Esd0RBQXdELDRCQUE0QjtBQUNwRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS93ZWJ3b3JrL2pzL3dlYndvcmsuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5cbndpbmRvdy53d0xpc3QgPSB7fTsgLy8gTXVsdGlwbGUgQ2hvaWNlIGRpY3Rpb25hcnlcblxuY2xhc3MgV2ViV29yayBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLm11bHRpcGxlYW5zd2VycyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRpdmlkID0gb3B0cy5vcmlnLmlkO1xuICAgICAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYW5zd2VyTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLmNvcnJlY3RMaXN0ID0gW107XG4gICAgICAgIHRoaXMucXVlc3Rpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmNhcHRpb24gPSBcIldlYldvcmtcIjtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBvcHRzLm9yaWc7XG4gICAgICAgIHRoaXMuYW5zd2VycyA9IHt9O1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSAwO1xuICAgICAgICAvL3RoaXMuYWRkQ2FwdGlvbihcInJ1bmVzdG9uZVwiKTtcbiAgICAgICAgaWYgKHRoaXMuZGl2aWQgIT09IFwiZmFrZXd3LXd3LXJzXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJ3ZWJ3b3JrXCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy53d0xpc3RbdGhpcy5kaXZpZF0gPSB0aGlzO1xuICAgIH1cblxuICAgIHJlc3RvcmVBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgLy8gUmVzdG9yZSBhbnN3ZXJzIGZyb20gc3RvcmFnZSByZXRyaWV2YWwgZG9uZSBpbiBSdW5lc3RvbmVCYXNlXG4gICAgICAgIC8vIHNvbWV0aW1lcyBkYXRhLmFuc3dlciBjYW4gYmUgbnVsbFxuICAgICAgICBpZiAoIWRhdGEuYW5zd2VyKSB7XG4gICAgICAgICAgICBkYXRhLmFuc3dlciA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGF0YS5hbnN3ZXJzIGNvbWVzIGZyb20gcG9zdGdyZXNxbCBhcyBhIEpTT04gY29sdW1uIHR5cGUgc28gbm8gbmVlZCB0byBwYXJzZSBpdC5cblxuICAgICAgICB0aGlzLmFuc3dlcnMgPSBkYXRhLmFuc3dlcjtcbiAgICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgICB0aGlzLnBlcmNlbnQgPSBkYXRhLnBlcmNlbnQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgYGFib3V0IHRvIGRlY29yYXRlIHRoZSBzdGF0dXMgb2YgV1cgJHt0aGlzLmRpdmlkfSAke3RoaXMuY29ycmVjdH1gXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICB9XG5cbiAgICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgLy8gUmVwb3B1bGF0ZXMgTUNNQSBxdWVzdGlvbnMgd2l0aCBhIHVzZXIncyBwcmV2aW91cyBhbnN3ZXJzLFxuICAgICAgICAvLyB3aGljaCB3ZXJlIHN0b3JlZCBpbnRvIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgIHZhciBzdG9yZWREYXRhO1xuICAgICAgICB2YXIgYW5zd2VycztcbiAgICAgICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGxlbiA9IGxvY2FsU3RvcmFnZS5sZW5ndGg7XG4gICAgICAgIHZhciBleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuXG4gICAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICAgICAgICAvLyBTYXZlIHRoZSBhbnN3ZXJzIHNvIHRoYXQgd2hlbiB0aGUgcXVlc3Rpb24gaXMgYWN0aXZhdGVkIHdlIGNhbiByZXN0b3JlLlxuICAgICAgICAgICAgICAgIHRoaXMuYW5zd2VycyA9IHN0b3JlZERhdGEuYW5zd2VyO1xuICAgICAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHN0b3JlZERhdGEuY29ycmVjdDtcbiAgICAgICAgICAgICAgICB0aGlzLnBlcmNlbnQgPSBzdG9yZWREYXRhLnBlcmNlbnQ7XG4gICAgICAgICAgICAgICAgLy8gV2Ugc3RpbGwgZGVjb3JhdGUgdGhlIHdlYndvcmsgcXVlc3Rpb24gZXZlbiBpZiBpdCBpcyBub3QgYWN0aXZlLlxuICAgICAgICAgICAgICAgIHRoaXMuZGVjb3JhdGVTdGF0dXMoKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHBhcnNpbmcgc3RvcmVkIFdlYldvcmsgZGF0YSBmb3IgJHt0aGlzLmRpdmlkfTogJHtlcnIubWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZXJyb3IgfHwgc3RvcmVkRGF0YS50aW1lc3RhbXAgPCBlQm9va0NvbmZpZy50ZXJtU3RhcnREYXRlKSB7XG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbFN0b3JhZ2VLZXkoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0TG9jYWxTdG9yYWdlKGRhdGEpIHtcbiAgICAgICAgdmFyIHRpbWVTdGFtcCA9IG5ldyBEYXRlKCk7XG4gICAgICAgIHZhciBzdG9yYWdlT2JqID0ge1xuICAgICAgICAgICAgYW5zd2VyOiBkYXRhLmFuc3dlcixcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wLFxuICAgICAgICAgICAgY29ycmVjdDogZGF0YS5jb3JyZWN0LFxuICAgICAgICB9O1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICAgICAgIHRoaXMubG9jYWxTdG9yYWdlS2V5KCksXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlT2JqKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8vIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIHJ1bmVzdG9uZV93d19jaGVjayBldmVudCBpcyB0cmlnZ2VyZWQgYnkgdGhlIHdlYndvcmsgcHJvYmxlbVxuICAgIC8vIE5vdGUgdGhlIHdlYndvcmsgcHJvYmxlbSBpcyBpbiBhbiBpZnJhbWUgc28gd2UgcmVseSBvbiB0aGlzIGV2ZW50IGFuZCB0aGUgZGF0YVxuICAgIC8vIGNvbXBpbGVkIGFuZCBwYXNzZWQgYWxvbmcgd2l0aCB0aGUgZXZlbnQgdG8gXCJncmFkZVwiIHRoZSBhbnN3ZXIuXG4gICAgcHJvY2Vzc0N1cnJlbnRBbnN3ZXJzKGRhdGEpIHtcbiAgICAgICAgbGV0IGNvcnJlY3RDb3VudCA9IDA7XG4gICAgICAgIGxldCBxQ291bnQgPSAwO1xuICAgICAgICBsZXQgYWN0U3RyaW5nID0gXCJjaGVjazpcIjtcbiAgICAgICAgdGhpcy5hbnN3ZXJPYmogPSB7fTtcbiAgICAgICAgdGhpcy5sYXN0QW5zd2VyUmF3ID0gZGF0YTtcbiAgICAgICAgdGhpcy5hbnN3ZXJPYmouYW5zd2VycyA9IHt9O1xuICAgICAgICB0aGlzLmFuc3dlck9iai5tcUFuc3dlcnMgPSB7fTtcbiAgICAgICAgLy8gZGF0YS5pbnB1dHNfXG4gICAgICAgIGZvciAobGV0IGsgb2YgT2JqZWN0LmtleXMoZGF0YS5yaF9yZXN1bHQuYW5zd2VycykpIHtcbiAgICAgICAgICAgIHFDb3VudCArPSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uc2NvcmUgPT0gMSkge1xuICAgICAgICAgICAgICAgIGNvcnJlY3RDb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbW9zdGx5IGdyYWIgb3JpZ2luYWxfc3R1ZGVudF9hbnMsIGJ1dCBncmFiIHN0dWRlbnRfdmFsdWUgZm9yIE1DIGV4ZXJjaXNlc1xuICAgICAgICAgICAgbGV0IHN0dWRlbnRfYW5zO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICEoXCJ3d192ZXJzaW9uXCIgaW4gZGF0YSkgfHxcbiAgICAgICAgICAgICAgICBkYXRhLnd3X3ZlcnNpb24uaW5jbHVkZXMoXCIyLjE2XCIpIHx8XG4gICAgICAgICAgICAgICAgZGF0YS53d192ZXJzaW9uLmluY2x1ZGVzKFwiMi4xN1wiKSB8fFxuICAgICAgICAgICAgICAgIGRhdGEud3dfdmVyc2lvbi5pbmNsdWRlcyhcIjIuMThcIilcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIE1vc3RseSBncmFiIG9yaWdpbmFsX3N0dWRlbnRfYW5zLCBidXQgZ3JhYiBzdHVkZW50X3ZhbHVlIGZvciBNQyBleGVyY2lzZXNcbiAgICAgICAgICAgICAgICBzdHVkZW50X2FucyA9IFtcbiAgICAgICAgICAgICAgICAgICAgXCJWYWx1ZSAocGFyc2VyUmFkaW9CdXR0b25zKVwiLFxuICAgICAgICAgICAgICAgICAgICBcIlZhbHVlIChQb3BVcClcIixcbiAgICAgICAgICAgICAgICAgICAgXCJWYWx1ZSAoQ2hlY2tib3hMaXN0KVwiLFxuICAgICAgICAgICAgICAgIF0uaW5jbHVkZXMoZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS50eXBlKVxuICAgICAgICAgICAgICAgICAgICA/IGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10uc3R1ZGVudF92YWx1ZVxuICAgICAgICAgICAgICAgICAgICA6IGRhdGEucmhfcmVzdWx0LmFuc3dlcnNba10ub3JpZ2luYWxfc3R1ZGVudF9hbnM7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIExpdGVyYWxseSBnZXQgdGhlIGlucHV0IHJlZnNcbiAgICAgICAgICAgICAgICAvLyBkYXRhLmlucHV0c19yZWZba10gd2lsbCB1c3VhbGx5IGJlIGEgc3RyaW5nLCB0aGUgQHZhbHVlIG9mIHRoZSBhbnN3ZXIgaW5wdXQgZmllbGQgdGhhdCB3YXMgc3VibWl0dGVkXG4gICAgICAgICAgICAgICAgLy8gSG93ZXZlciBpbiBhdCBsZWFzdCB0aGUgY2FzZSBvZiBjaGVja2JveGVzLCBkYXRhLmlucHV0c19yZWZba10gd2lsbCBiZSBhbiBhcnJheVxuICAgICAgICAgICAgICAgIC8vIFNvIGhvd2V2ZXIgdGhpcyBpcyB1bHRpbWF0ZWx5IHN0b3JlZCBpbiB0aGUgUnVuZXN0b25lIGRhdGFiYXNlIHNob3VsZCByZXNwZWN0IGFucyBwcmVzZXJ2ZSB0aGlzIGFzIGFuIGFycmF5LCBub3Qgc3RyaW5naWZpZWRcbiAgICAgICAgICAgICAgICBzdHVkZW50X2FucyA9IGRhdGEuaW5wdXRzX3JlZltrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYW5zd2VyT2JqLmFuc3dlcnNba10gPSBzdHVkZW50X2FucztcbiAgICAgICAgICAgIGxldCBtcUtleSA9IGBNYVRoUXVJbExfJHtrfWA7XG4gICAgICAgICAgICB0aGlzLmFuc3dlck9iai5tcUFuc3dlcnNbbXFLZXldID0gZGF0YS5pbnB1dHNfcmVmW21xS2V5XTtcbiAgICAgICAgICAgIGFjdFN0cmluZyArPSBgYWN0dWFsOiR7c3R1ZGVudF9hbnN9OmV4cGVjdGVkOiR7ZGF0YS5yaF9yZXN1bHQuYW5zd2Vyc1trXS5jb3JyZWN0X3ZhbHVlfTpgO1xuICAgICAgICB9XG4gICAgICAgIGxldCBwY3QgPSBjb3JyZWN0Q291bnQgLyBxQ291bnQ7XG4gICAgICAgIC8vIElmIHRoaXMucGVyY2VudCBpcyBzZXQsIHRoZW4gcnVuZXN0b25lYmFzZSB3aWxsIHRyYW5zbWl0IGl0IGFzIHBhcnQgb2ZcbiAgICAgICAgLy8gdGhlIGxvZ0Jvb2tFdmVudCBBUEkuXG4gICAgICAgIHRoaXMucGVyY2VudCA9IHBjdDtcbiAgICAgICAgdGhpcy5hY3RTdHJpbmcgPVxuICAgICAgICAgICAgYWN0U3RyaW5nICsgYGNvcnJlY3Q6JHtjb3JyZWN0Q291bnR9OmNvdW50OiR7cUNvdW50fTpwY3Q6JHtwY3R9YDtcbiAgICAgICAgaWYgKHBjdCA9PSAxLjApIHtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3QgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbHMgPSB7fTtcbiAgICAgICAgbHMuYW5zd2VyID0gdGhpcy5hbnN3ZXJPYmo7XG4gICAgICAgIGxzLmNvcnJlY3QgPSB0aGlzLmNvcnJlY3Q7XG4gICAgICAgIGxzLnBlcmNlbnQgPSB0aGlzLnBlcmNlbnQ7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKGxzKTtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZVN0YXR1cygpO1xuICAgIH1cblxuICAgIGFzeW5jIGxvZ0N1cnJlbnRBbnN3ZXIoc2lkKSB7XG4gICAgICAgIHRoaXMubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcIndlYndvcmtcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCwgLy90b2RvIHVubWFuZ2xlIHByb2JsZW1pZFxuICAgICAgICAgICAgYWN0OiB0aGlzLmFjdFN0cmluZyxcbiAgICAgICAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkodGhpcy5hbnN3ZXJPYmopLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7fVxufVxuXG4vL1xuLy8gVGhlc2UgYXJlIGZ1bmN0aW9ucyB0aGF0IGdldCBjYWxsZWQgaW4gcmVzcG9uc2UgdG8gd2Vid29yayBnZW5lcmF0ZWQgZXZlbnRzLlxuLy8gc3VibWl0dGluZyB0aGUgd29yaywgb3Igc2hvd2luZyBhbiBhbnN3ZXIuXG5mdW5jdGlvbiBsb2dXZWJXb3JrKGUsIGRhdGEpIHtcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IHd3T2JqID0gd3dMaXN0W2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRC5yZXBsYWNlKFwiLXd3LXJzXCIsIFwiXCIpXTtcbiAgICAgICAgaWYgKHd3T2JqKSB7XG4gICAgICAgICAgICB3d09iai5wcm9jZXNzQ3VycmVudEFuc3dlcnMoZGF0YSk7XG4gICAgICAgICAgICB3d09iai5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgRXJyb3I6IENvdWxkIG5vdCBmaW5kIHdlYndvcmsgb2JqZWN0ICR7ZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlEfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxvZ1Nob3dDb3JyZWN0KGUsIGRhdGEpIHtcbiAgICBpZiAoZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgICAgbGV0IHd3T2JqID0gd3dMaXN0W2RhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRC5yZXBsYWNlKFwiLXd3LXJzXCIsIFwiXCIpXTtcbiAgICAgICAgaWYgKHd3T2JqKSB7XG4gICAgICAgICAgICB3d09iai5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiBcIndlYndvcmtcIixcbiAgICAgICAgICAgICAgICBkaXZfaWQ6IGRhdGEuaW5wdXRzX3JlZi5wcm9ibGVtVVVJRCxcbiAgICAgICAgICAgICAgICBhY3Q6IFwic2hvd1wiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBgRXJyb3I6IENvdWxkIG5vdCBmaW5kIHdlYndvcmsgb2JqZWN0ICR7ZGF0YS5pbnB1dHNfcmVmLnByb2JsZW1VVUlEfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFNjb3JlcyhzaWQsIHd3SWQpIHt9XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS53ZWJ3b3JrID0gZnVuY3Rpb24gKG9wdHMpIHtcbiAgICByZXR1cm4gbmV3IFdlYldvcmsob3B0cyk7XG59O1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiYm9keVwiKS5vbihcInJ1bmVzdG9uZV93d19jaGVja1wiLCBsb2dXZWJXb3JrKTtcbiAgICAkKFwiYm9keVwiKS5vbihcInJ1bmVzdG9uZV9zaG93X2NvcnJlY3RcIiwgbG9nU2hvd0NvcnJlY3QpO1xufSk7XG5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiW2RhdGEtY29tcG9uZW50PXdlYndvcmtdXCIpLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIC8vIE1DXG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgb3JpZzogdGhpcyxcbiAgICAgICAgICAgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzOiBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcyxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKCQodGhpcykuY2xvc2VzdChcIltkYXRhLWNvbXBvbmVudD10aW1lZEFzc2Vzc21lbnRdXCIpLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIGVsZW1lbnQgZXhpc3RzIHdpdGhpbiBhIHRpbWVkIGNvbXBvbmVudCwgZG9uJ3QgcmVuZGVyIGl0IGhlcmVcbiAgICAgICAgICAgIHdpbmRvdy53d0xpc3RbdGhpcy5pZF0gPSBuZXcgV2ViV29yayhvcHRzKTtcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=