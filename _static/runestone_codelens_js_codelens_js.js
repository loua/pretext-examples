"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_codelens_js_codelens_js"],{

/***/ 76412:
/*!*******************************************!*\
  !*** ./runestone/codelens/js/codelens.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pytutor-embed.bundle.js */ 60764);
/* harmony import */ var _pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_pytutor_embed_bundle_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_pytutor_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../css/pytutor.css */ 93473);
/**
 * Created by bmiller on 5/10/15.
 */

/*
 Since I don't want to modify the codelens code I'll attach the logging functionality this way.
 This actually seems like a better way to do it maybe across the board to separate logging
 from the real funcionality.  It would also allow a better way of turning off/on logging..
 As long as Philip doesn't go and change the id values for the buttons and slider this will
 continue to work.... In the best of all worlds we might add a function to the visualizer to
 return the buttons, but I'm having a hard time thinking of any other use for that besides mine.
 */





function attachLoggers(codelens, divid) {
    let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    codelens.domRoot.find("#jmpFirstInstr").click(function () {
        rb.logBookEvent({ event: "codelens", act: "first", div_id: divid });
    });
    codelens.domRoot.find("#jmpLastInstr").click(function () {
        rb.logBookEvent({ event: "codelens", act: "last", div_id: divid });
    });
    codelens.domRoot.find("#jmpStepBack").click(function () {
        rb.logBookEvent({ event: "codelens", act: "back", div_id: divid });
    });
    codelens.domRoot.find("#jmpStepFwd").click(function () {
        rb.logBookEvent({ event: "codelens", act: "fwd", div_id: divid });
    });
    codelens.domRoot.find("#executionSlider").bind("slide", function (evt, ui) {
        rb.logBookEvent({ event: "codelens", act: "slide", div_id: divid });
    });
    // TODO: The component isn't quite fully initialized, but it also doesn't inherit from RunestoneBase. This is a convenient place to mark it ready for now, but it should be moved forward in time during a rewrite.
    rb.containerDiv = document.getElementById(divid);
    rb.indicate_component_ready();
}

function styleButtons(divid) {
    var myVis = $("#" + divid);
    $(myVis).find("#jmpFirstInstr").addClass("btn btn-default");
    $(myVis).find("#jmpStepBack").addClass("btn btn-danger");
    $(myVis).find("#jmpStepFwd").addClass("btn btn-success");
    $(myVis).find("#jmpLastInstr").addClass("btn btn-default");
}

if (typeof allVsualizers === "undefined") {
    window.allVisualizers = [];
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.codelens = function (opts) {
    // opts is an object that will contain a key referencing the orignal dom element
    // often it will also have a key for  useRunestoneServices
    let el = opts.orig;
    let vel = el.querySelector(".pytutorVisualizer");
    let divid = vel.id;
    let lang = JSON.parse(vel.dataset.params).lang;
    // addVisualizerToPage comes from pytutor-embed
    // allTraceData is created by a series of script tags that when loaded create this
    // as a global object containing trace information.
    try {
        let startInstr = allTraceData[divid].startingInstruction || 0;
        let vis = addVisualizerToPage(allTraceData[divid], divid, {
            startingInstruction: startInstr,
            editCodeBaseURL: null,
            hideCode: false,
            lang: lang,
        });
        attachLoggers(vis, divid);
        styleButtons(divid);
        window.allVisualizers.push(vis);
    } catch (err) {
        console.log(`Error rendering CodeLens Problem ${divid}`);
        console.log(err);
    }

    window.addEventListener("codelens:answer", function (evt) {
        let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
        rb.logBookEvent({
            event: "codelens",
            div_id: evt.detail.divid,
            act: 'answer',
            answer: evt.detail.answer,
            correct: evt.detail.correct,
            percent: evt.detail.percent || 0,
        });
        console.log(evt);
    });
};

// After all of the libraries are loaded...
$(document).on("runestone:login-complete", function () {
    if (typeof allTraceData !== "undefined") {
        for (let divid in allTraceData) {
            let cl = document.getElementById(divid);
            if (cl === null) {
                console.log(`Could not find element with id ${divid}`);
                return;
            }
            let lang = $(cl).data("params").lang;
            try {
                if (divid in window.allTraceData) {
                    let startInstr = allTraceData[divid].startingInstruction || 0;
                    var vis = addVisualizerToPage(allTraceData[divid], divid, {
                        startingInstruction: startInstr,
                        editCodeBaseURL: null,
                        hideCode: false,
                        lang: lang,
                    });
                } else {
                    alert(
                        `${divid} is missing trace data.  This is probably a build error. Please report it on github.`
                    );
                }
                attachLoggers(vis, divid);
                styleButtons(divid);
                window.allVisualizers.push(vis);
            } catch (err) {
                console.log(`Error rendering CodeLens Problem ${divid}`);
                console.log(err);
            }
        }
        window.addEventListener("codelens:answer", function (evt) {
            let rb = new _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
            rb.logBookEvent({
                event: "codelens",
                div_id: evt.detail.divid,
                act: 'answer',
                answer: evt.detail.answer,
                correct: evt.detail.correct,
                percent: evt.detail.percent || 0,
            });
            console.log(evt);
        });
    }
});


/***/ }),

/***/ 93473:
/*!********************************************!*\
  !*** ./runestone/codelens/css/pytutor.css ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2NvZGVsZW5zX2pzX2NvZGVsZW5zX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRTZEO0FBQzFCO0FBQ0w7O0FBRTlCO0FBQ0EsaUJBQWlCLG1FQUFhO0FBQzlCO0FBQ0EsMEJBQTBCLGdEQUFnRDtBQUMxRSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsK0NBQStDO0FBQ3pFLEtBQUs7QUFDTDtBQUNBLDBCQUEwQiwrQ0FBK0M7QUFDekUsS0FBSztBQUNMO0FBQ0EsMEJBQTBCLDhDQUE4QztBQUN4RSxLQUFLO0FBQ0w7QUFDQSwwQkFBMEIsZ0RBQWdEO0FBQzFFLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLHdEQUF3RCxNQUFNO0FBQzlEO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsbUVBQWE7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOERBQThELE1BQU07QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixrQkFBa0I7QUFDbEI7QUFDQSwyQkFBMkIsT0FBTztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGdFQUFnRSxNQUFNO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLG1FQUFhO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7O0FDNUlEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9jb2RlbGVucy9qcy9jb2RlbGVucy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2NvZGVsZW5zL2Nzcy9weXR1dG9yLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgYm1pbGxlciBvbiA1LzEwLzE1LlxuICovXG5cbi8qXG4gU2luY2UgSSBkb24ndCB3YW50IHRvIG1vZGlmeSB0aGUgY29kZWxlbnMgY29kZSBJJ2xsIGF0dGFjaCB0aGUgbG9nZ2luZyBmdW5jdGlvbmFsaXR5IHRoaXMgd2F5LlxuIFRoaXMgYWN0dWFsbHkgc2VlbXMgbGlrZSBhIGJldHRlciB3YXkgdG8gZG8gaXQgbWF5YmUgYWNyb3NzIHRoZSBib2FyZCB0byBzZXBhcmF0ZSBsb2dnaW5nXG4gZnJvbSB0aGUgcmVhbCBmdW5jaW9uYWxpdHkuICBJdCB3b3VsZCBhbHNvIGFsbG93IGEgYmV0dGVyIHdheSBvZiB0dXJuaW5nIG9mZi9vbiBsb2dnaW5nLi5cbiBBcyBsb25nIGFzIFBoaWxpcCBkb2Vzbid0IGdvIGFuZCBjaGFuZ2UgdGhlIGlkIHZhbHVlcyBmb3IgdGhlIGJ1dHRvbnMgYW5kIHNsaWRlciB0aGlzIHdpbGxcbiBjb250aW51ZSB0byB3b3JrLi4uLiBJbiB0aGUgYmVzdCBvZiBhbGwgd29ybGRzIHdlIG1pZ2h0IGFkZCBhIGZ1bmN0aW9uIHRvIHRoZSB2aXN1YWxpemVyIHRvXG4gcmV0dXJuIHRoZSBidXR0b25zLCBidXQgSSdtIGhhdmluZyBhIGhhcmQgdGltZSB0aGlua2luZyBvZiBhbnkgb3RoZXIgdXNlIGZvciB0aGF0IGJlc2lkZXMgbWluZS5cbiAqL1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4vcHl0dXRvci1lbWJlZC5idW5kbGUuanNcIjtcbmltcG9ydCBcIi4vLi4vY3NzL3B5dHV0b3IuY3NzXCI7XG5cbmZ1bmN0aW9uIGF0dGFjaExvZ2dlcnMoY29kZWxlbnMsIGRpdmlkKSB7XG4gICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICBjb2RlbGVucy5kb21Sb290LmZpbmQoXCIjam1wRmlyc3RJbnN0clwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJmaXJzdFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBMYXN0SW5zdHJcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwibGFzdFwiLCBkaXZfaWQ6IGRpdmlkIH0pO1xuICAgIH0pO1xuICAgIGNvZGVsZW5zLmRvbVJvb3QuZmluZChcIiNqbXBTdGVwQmFja1wiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJiLmxvZ0Jvb2tFdmVudCh7IGV2ZW50OiBcImNvZGVsZW5zXCIsIGFjdDogXCJiYWNrXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2ptcFN0ZXBGd2RcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICByYi5sb2dCb29rRXZlbnQoeyBldmVudDogXCJjb2RlbGVuc1wiLCBhY3Q6IFwiZndkXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgY29kZWxlbnMuZG9tUm9vdC5maW5kKFwiI2V4ZWN1dGlvblNsaWRlclwiKS5iaW5kKFwic2xpZGVcIiwgZnVuY3Rpb24gKGV2dCwgdWkpIHtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHsgZXZlbnQ6IFwiY29kZWxlbnNcIiwgYWN0OiBcInNsaWRlXCIsIGRpdl9pZDogZGl2aWQgfSk7XG4gICAgfSk7XG4gICAgLy8gVE9ETzogVGhlIGNvbXBvbmVudCBpc24ndCBxdWl0ZSBmdWxseSBpbml0aWFsaXplZCwgYnV0IGl0IGFsc28gZG9lc24ndCBpbmhlcml0IGZyb20gUnVuZXN0b25lQmFzZS4gVGhpcyBpcyBhIGNvbnZlbmllbnQgcGxhY2UgdG8gbWFyayBpdCByZWFkeSBmb3Igbm93LCBidXQgaXQgc2hvdWxkIGJlIG1vdmVkIGZvcndhcmQgaW4gdGltZSBkdXJpbmcgYSByZXdyaXRlLlxuICAgIHJiLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICByYi5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbn1cblxuZnVuY3Rpb24gc3R5bGVCdXR0b25zKGRpdmlkKSB7XG4gICAgdmFyIG15VmlzID0gJChcIiNcIiArIGRpdmlkKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcEZpcnN0SW5zdHJcIikuYWRkQ2xhc3MoXCJidG4gYnRuLWRlZmF1bHRcIik7XG4gICAgJChteVZpcykuZmluZChcIiNqbXBTdGVwQmFja1wiKS5hZGRDbGFzcyhcImJ0biBidG4tZGFuZ2VyXCIpO1xuICAgICQobXlWaXMpLmZpbmQoXCIjam1wU3RlcEZ3ZFwiKS5hZGRDbGFzcyhcImJ0biBidG4tc3VjY2Vzc1wiKTtcbiAgICAkKG15VmlzKS5maW5kKFwiI2ptcExhc3RJbnN0clwiKS5hZGRDbGFzcyhcImJ0biBidG4tZGVmYXVsdFwiKTtcbn1cblxuaWYgKHR5cGVvZiBhbGxWc3VhbGl6ZXJzID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmFsbFZpc3VhbGl6ZXJzID0gW107XG59XG5cbmlmICh0eXBlb2Ygd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgd2luZG93LmNvbXBvbmVudF9mYWN0b3J5ID0ge307XG59XG5cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5jb2RlbGVucyA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgLy8gb3B0cyBpcyBhbiBvYmplY3QgdGhhdCB3aWxsIGNvbnRhaW4gYSBrZXkgcmVmZXJlbmNpbmcgdGhlIG9yaWduYWwgZG9tIGVsZW1lbnRcbiAgICAvLyBvZnRlbiBpdCB3aWxsIGFsc28gaGF2ZSBhIGtleSBmb3IgIHVzZVJ1bmVzdG9uZVNlcnZpY2VzXG4gICAgbGV0IGVsID0gb3B0cy5vcmlnO1xuICAgIGxldCB2ZWwgPSBlbC5xdWVyeVNlbGVjdG9yKFwiLnB5dHV0b3JWaXN1YWxpemVyXCIpO1xuICAgIGxldCBkaXZpZCA9IHZlbC5pZDtcbiAgICBsZXQgbGFuZyA9IEpTT04ucGFyc2UodmVsLmRhdGFzZXQucGFyYW1zKS5sYW5nO1xuICAgIC8vIGFkZFZpc3VhbGl6ZXJUb1BhZ2UgY29tZXMgZnJvbSBweXR1dG9yLWVtYmVkXG4gICAgLy8gYWxsVHJhY2VEYXRhIGlzIGNyZWF0ZWQgYnkgYSBzZXJpZXMgb2Ygc2NyaXB0IHRhZ3MgdGhhdCB3aGVuIGxvYWRlZCBjcmVhdGUgdGhpc1xuICAgIC8vIGFzIGEgZ2xvYmFsIG9iamVjdCBjb250YWluaW5nIHRyYWNlIGluZm9ybWF0aW9uLlxuICAgIHRyeSB7XG4gICAgICAgIGxldCBzdGFydEluc3RyID0gYWxsVHJhY2VEYXRhW2RpdmlkXS5zdGFydGluZ0luc3RydWN0aW9uIHx8IDA7XG4gICAgICAgIGxldCB2aXMgPSBhZGRWaXN1YWxpemVyVG9QYWdlKGFsbFRyYWNlRGF0YVtkaXZpZF0sIGRpdmlkLCB7XG4gICAgICAgICAgICBzdGFydGluZ0luc3RydWN0aW9uOiBzdGFydEluc3RyLFxuICAgICAgICAgICAgZWRpdENvZGVCYXNlVVJMOiBudWxsLFxuICAgICAgICAgICAgaGlkZUNvZGU6IGZhbHNlLFxuICAgICAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgfSk7XG4gICAgICAgIGF0dGFjaExvZ2dlcnModmlzLCBkaXZpZCk7XG4gICAgICAgIHN0eWxlQnV0dG9ucyhkaXZpZCk7XG4gICAgICAgIHdpbmRvdy5hbGxWaXN1YWxpemVycy5wdXNoKHZpcyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciByZW5kZXJpbmcgQ29kZUxlbnMgUHJvYmxlbSAke2RpdmlkfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY29kZWxlbnM6YW5zd2VyXCIsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgbGV0IHJiID0gbmV3IFJ1bmVzdG9uZUJhc2UoKTtcbiAgICAgICAgcmIubG9nQm9va0V2ZW50KHtcbiAgICAgICAgICAgIGV2ZW50OiBcImNvZGVsZW5zXCIsXG4gICAgICAgICAgICBkaXZfaWQ6IGV2dC5kZXRhaWwuZGl2aWQsXG4gICAgICAgICAgICBhY3Q6ICdhbnN3ZXInLFxuICAgICAgICAgICAgYW5zd2VyOiBldnQuZGV0YWlsLmFuc3dlcixcbiAgICAgICAgICAgIGNvcnJlY3Q6IGV2dC5kZXRhaWwuY29ycmVjdCxcbiAgICAgICAgICAgIHBlcmNlbnQ6IGV2dC5kZXRhaWwucGVyY2VudCB8fCAwLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5sb2coZXZ0KTtcbiAgICB9KTtcbn07XG5cbi8vIEFmdGVyIGFsbCBvZiB0aGUgbGlicmFyaWVzIGFyZSBsb2FkZWQuLi5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGFsbFRyYWNlRGF0YSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBmb3IgKGxldCBkaXZpZCBpbiBhbGxUcmFjZURhdGEpIHtcbiAgICAgICAgICAgIGxldCBjbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpdmlkKTtcbiAgICAgICAgICAgIGlmIChjbCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3VsZCBub3QgZmluZCBlbGVtZW50IHdpdGggaWQgJHtkaXZpZH1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbGFuZyA9ICQoY2wpLmRhdGEoXCJwYXJhbXNcIikubGFuZztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGRpdmlkIGluIHdpbmRvdy5hbGxUcmFjZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0YXJ0SW5zdHIgPSBhbGxUcmFjZURhdGFbZGl2aWRdLnN0YXJ0aW5nSW5zdHJ1Y3Rpb24gfHwgMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpcyA9IGFkZFZpc3VhbGl6ZXJUb1BhZ2UoYWxsVHJhY2VEYXRhW2RpdmlkXSwgZGl2aWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0aW5nSW5zdHJ1Y3Rpb246IHN0YXJ0SW5zdHIsXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0Q29kZUJhc2VVUkw6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRlQ29kZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYW5nOiBsYW5nLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke2RpdmlkfSBpcyBtaXNzaW5nIHRyYWNlIGRhdGEuICBUaGlzIGlzIHByb2JhYmx5IGEgYnVpbGQgZXJyb3IuIFBsZWFzZSByZXBvcnQgaXQgb24gZ2l0aHViLmBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXR0YWNoTG9nZ2Vycyh2aXMsIGRpdmlkKTtcbiAgICAgICAgICAgICAgICBzdHlsZUJ1dHRvbnMoZGl2aWQpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hbGxWaXN1YWxpemVycy5wdXNoKHZpcyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIENvZGVMZW5zIFByb2JsZW0gJHtkaXZpZH1gKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY29kZWxlbnM6YW5zd2VyXCIsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgICAgIGxldCByYiA9IG5ldyBSdW5lc3RvbmVCYXNlKCk7XG4gICAgICAgICAgICByYi5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgICAgIGV2ZW50OiBcImNvZGVsZW5zXCIsXG4gICAgICAgICAgICAgICAgZGl2X2lkOiBldnQuZGV0YWlsLmRpdmlkLFxuICAgICAgICAgICAgICAgIGFjdDogJ2Fuc3dlcicsXG4gICAgICAgICAgICAgICAgYW5zd2VyOiBldnQuZGV0YWlsLmFuc3dlcixcbiAgICAgICAgICAgICAgICBjb3JyZWN0OiBldnQuZGV0YWlsLmNvcnJlY3QsXG4gICAgICAgICAgICAgICAgcGVyY2VudDogZXZ0LmRldGFpbC5wZXJjZW50IHx8IDAsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2dCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9