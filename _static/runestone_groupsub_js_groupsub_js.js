"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_groupsub_js_groupsub_js"],{

/***/ 24616:
/*!*******************************************!*\
  !*** ./runestone/groupsub/js/groupsub.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _css_groupsub_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/groupsub.css */ 63915);
/* harmony import */ var select2_dist_js_select2_min_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! select2/dist/js/select2.min.js */ 14028);
/* harmony import */ var select2_dist_js_select2_min_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(select2_dist_js_select2_min_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var select2_dist_css_select2_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! select2/dist/css/select2.css */ 46431);
/*==========================================
=======      Master groupsub.js       ========
============================================
===     This file contains the JS for    ===
===     the Runestone reval component.   ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===               06/12/15               ===
==========================================*/







var pageReveal;

// Define Reveal object
class GroupSub extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <div> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        self.group = []
        this.limit = this.origElem.dataset.size_limit;
        this.isPretext = document.body.classList.contains("pretext");
        // Create submit button
        let butt = document.createElement("button");
        butt.type = "button";
        butt.classList.add("btn", "btn-success")
        butt.innerHTML = "Submit Group"
        butt.onclick = this.submitAll.bind(this);
        var container;
        if (this.isPretext) {
            container = opts.orig.querySelector(".groupsub_button");

        } else {
            container = document.getElementById("groupsub_button")
        }

        container.appendChild(butt);


    }

    async initialize() {
        // get the classlist to populate
        if (eBookConfig.useRunestoneServices) {
            // get classlist from admin/course_students
            let request = new Request("/ns/auth/course_students", {
                method: "GET",
                headers: this.jsonHeaders,
            });
            try {
                let response = await fetch(request);
                if (!response.ok) {
                    throw new Error("Failed to get the list of students");
                }
                if (response.redirected) {
                    alert("You must be logged in to use this feature");
                    return;
                }
                let resp = await response.json();
                this.studentList = resp.detail.students;
            } catch (e) {
                if (this.isTimed) {
                    alert(`Error: Failed to get the list of students. The error was ${e}`);
                }
                console.log(`Error: ${e}`);
                this.studentList = {
                    failed: "Failed to load students - logout and back in",
                }
            }

        } else {
            this.studentList = {
                s1: "User 1",
                s2: "User 2",
                s3: "User 3",
                s4: "User 4",
                s5: "User 5",
            }
        }
        var select;
        if (this.isPretext) {
            select = this.origElem.querySelector(".assignment_partner_select");
        } else {
            select = document.getElementById("assignment_group");
        }
        this.picker = select;
        for (let [sid, name] of Object.entries(this.studentList)) {
            let opt = document.createElement("option");
            opt.value = sid;
            opt.innerHTML = this.studentList[sid];
            select.appendChild(opt);
        }
        // Make the select element searchable with multiple selections
        $('.assignment_partner_select').select2({
            placeholder: "Select up to 4 team members",
            allowClear: true,
            maximumSelectionLength: this.limit
        });

    }

    async submitAll() {
        // find all components on the page and submit them for all group members

        let group = []
        for (let student of this.picker.selectedOptions) {
            group.push(student.value);
        }
        // If the leader forgets to add themselves, add them here.
        let username = eBookConfig.username;
        if (username && !group.includes(username)) {
            group.push(username)
        }
        if (group.len > this.limit) {
            alert(`You may not have more than ${this.limit} students in a group`);
            return
        }
        this.logBookEvent({
            event: "group_start",
            act: group.join(","),
            div_id: window.location.pathname,
        });
        var componentList = [];
        if (this.isPretext) {
            let container = this.origElem.closest("section.groupwork");
            for (let id of Object.keys(componentMap)) {
                if (container.querySelector(`#${id}`)) {
                    componentList.push(componentMap[id]);
                }
            }
        } else {
            componentList = window.allComponents;
        }
        for (let student of group) {
            for (let question of componentList) {
                try {
                    console.log(`${student} ${question}`)
                    await question.logCurrentAnswer(student)
                } catch (e) {
                    console.log(`failed to submit ${question} : ${e}`)
                }
            }
        }

        this.logBookEvent({
            event: "group_end",
            act: group.join(","),
            div_id: window.location.pathname,
        });
    }

}


$(document).on("runestone:login-complete", async function () {
    let gs = document.querySelectorAll("[data-component=groupsub]");
    if (gs.length > 1) {
        alert("Only one Group Submit is allowed per page")
        return;
    }
    let gsElement = gs[0];
    try {
        var pageReveal = new GroupSub({ orig: gsElement });
        await pageReveal.initialize();
    } catch (err) {
        console.log(`Error rendering GroupSub ${gsElement.id}`);
        console.log(`Details ${err}`);
    }
});



/***/ }),

/***/ 63915:
/*!*********************************************!*\
  !*** ./runestone/groupsub/css/groupsub.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2dyb3Vwc3ViX2pzX2dyb3Vwc3ViX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHMEQ7QUFDN0I7QUFDVztBQUNGOztBQUV0Qzs7QUFFQTtBQUNBLHVCQUF1QixnRUFBYTtBQUNwQztBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxzRkFBc0YsRUFBRTtBQUN4RjtBQUNBLHNDQUFzQyxFQUFFO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsWUFBWTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsR0FBRztBQUNuRDtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxTQUFTLEVBQUUsU0FBUztBQUN2RDtBQUNBLGtCQUFrQjtBQUNsQixvREFBb0QsVUFBVSxJQUFJLEVBQUU7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGlCQUFpQjtBQUN6RDtBQUNBLE1BQU07QUFDTixnREFBZ0QsYUFBYTtBQUM3RCwrQkFBK0IsSUFBSTtBQUNuQztBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7QUMvS0QiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2dyb3Vwc3ViL2pzL2dyb3Vwc3ViLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZ3JvdXBzdWIvY3NzL2dyb3Vwc3ViLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09PT09PSAgICAgIE1hc3RlciBncm91cHN1Yi5qcyAgICAgICA9PT09PT09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBKUyBmb3IgICAgPT09XG49PT0gICAgIHRoZSBSdW5lc3RvbmUgcmV2YWwgY29tcG9uZW50LiAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PSAgICAgICAgICAgICAgQ3JlYXRlZCBieSAgICAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgIElzYWlhaCBNYXllcmNoYWsgICAgICAgICAgID09PVxuPT09ICAgICAgICAgICAgICAgMDYvMTIvMTUgICAgICAgICAgICAgICA9PT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlXCI7XG5pbXBvcnQgXCIuLi9jc3MvZ3JvdXBzdWIuY3NzXCI7XG5pbXBvcnQgXCJzZWxlY3QyL2Rpc3QvanMvc2VsZWN0Mi5taW4uanNcIjtcbmltcG9ydCBcInNlbGVjdDIvZGlzdC9jc3Mvc2VsZWN0Mi5jc3NcIjtcblxudmFyIHBhZ2VSZXZlYWw7XG5cbi8vIERlZmluZSBSZXZlYWwgb2JqZWN0XG5jbGFzcyBHcm91cFN1YiBleHRlbmRzIFJ1bmVzdG9uZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPGRpdj4gZWxlbWVudCB0aGF0IHdpbGwgYmUgcmVwbGFjZWQgYnkgbmV3IEhUTUxcbiAgICAgICAgdGhpcy5vcmlnRWxlbSA9IG9yaWc7XG4gICAgICAgIHRoaXMuZGl2aWQgPSBvcmlnLmlkO1xuICAgICAgICBzZWxmLmdyb3VwID0gW11cbiAgICAgICAgdGhpcy5saW1pdCA9IHRoaXMub3JpZ0VsZW0uZGF0YXNldC5zaXplX2xpbWl0O1xuICAgICAgICB0aGlzLmlzUHJldGV4dCA9IGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKFwicHJldGV4dFwiKTtcbiAgICAgICAgLy8gQ3JlYXRlIHN1Ym1pdCBidXR0b25cbiAgICAgICAgbGV0IGJ1dHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICAgICAgICBidXR0LnR5cGUgPSBcImJ1dHRvblwiO1xuICAgICAgICBidXR0LmNsYXNzTGlzdC5hZGQoXCJidG5cIiwgXCJidG4tc3VjY2Vzc1wiKVxuICAgICAgICBidXR0LmlubmVySFRNTCA9IFwiU3VibWl0IEdyb3VwXCJcbiAgICAgICAgYnV0dC5vbmNsaWNrID0gdGhpcy5zdWJtaXRBbGwuYmluZCh0aGlzKTtcbiAgICAgICAgdmFyIGNvbnRhaW5lcjtcbiAgICAgICAgaWYgKHRoaXMuaXNQcmV0ZXh0KSB7XG4gICAgICAgICAgICBjb250YWluZXIgPSBvcHRzLm9yaWcucXVlcnlTZWxlY3RvcihcIi5ncm91cHN1Yl9idXR0b25cIik7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzdWJfYnV0dG9uXCIpXG4gICAgICAgIH1cblxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dCk7XG5cblxuICAgIH1cblxuICAgIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgICAgIC8vIGdldCB0aGUgY2xhc3NsaXN0IHRvIHBvcHVsYXRlXG4gICAgICAgIGlmIChlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcykge1xuICAgICAgICAgICAgLy8gZ2V0IGNsYXNzbGlzdCBmcm9tIGFkbWluL2NvdXJzZV9zdHVkZW50c1xuICAgICAgICAgICAgbGV0IHJlcXVlc3QgPSBuZXcgUmVxdWVzdChcIi9ucy9hdXRoL2NvdXJzZV9zdHVkZW50c1wiLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHRoaXMuanNvbkhlYWRlcnMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2gocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJGYWlsZWQgdG8gZ2V0IHRoZSBsaXN0IG9mIHN0dWRlbnRzXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2UucmVkaXJlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcIllvdSBtdXN0IGJlIGxvZ2dlZCBpbiB0byB1c2UgdGhpcyBmZWF0dXJlXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCByZXNwID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuc3R1ZGVudExpc3QgPSByZXNwLmRldGFpbC5zdHVkZW50cztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1RpbWVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGBFcnJvcjogRmFpbGVkIHRvIGdldCB0aGUgbGlzdCBvZiBzdHVkZW50cy4gVGhlIGVycm9yIHdhcyAke2V9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBFcnJvcjogJHtlfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuc3R1ZGVudExpc3QgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZhaWxlZDogXCJGYWlsZWQgdG8gbG9hZCBzdHVkZW50cyAtIGxvZ291dCBhbmQgYmFjayBpblwiLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdHVkZW50TGlzdCA9IHtcbiAgICAgICAgICAgICAgICBzMTogXCJVc2VyIDFcIixcbiAgICAgICAgICAgICAgICBzMjogXCJVc2VyIDJcIixcbiAgICAgICAgICAgICAgICBzMzogXCJVc2VyIDNcIixcbiAgICAgICAgICAgICAgICBzNDogXCJVc2VyIDRcIixcbiAgICAgICAgICAgICAgICBzNTogXCJVc2VyIDVcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgc2VsZWN0O1xuICAgICAgICBpZiAodGhpcy5pc1ByZXRleHQpIHtcbiAgICAgICAgICAgIHNlbGVjdCA9IHRoaXMub3JpZ0VsZW0ucXVlcnlTZWxlY3RvcihcIi5hc3NpZ25tZW50X3BhcnRuZXJfc2VsZWN0XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhc3NpZ25tZW50X2dyb3VwXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGlja2VyID0gc2VsZWN0O1xuICAgICAgICBmb3IgKGxldCBbc2lkLCBuYW1lXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnN0dWRlbnRMaXN0KSkge1xuICAgICAgICAgICAgbGV0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgICAgICAgICBvcHQudmFsdWUgPSBzaWQ7XG4gICAgICAgICAgICBvcHQuaW5uZXJIVE1MID0gdGhpcy5zdHVkZW50TGlzdFtzaWRdO1xuICAgICAgICAgICAgc2VsZWN0LmFwcGVuZENoaWxkKG9wdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTWFrZSB0aGUgc2VsZWN0IGVsZW1lbnQgc2VhcmNoYWJsZSB3aXRoIG11bHRpcGxlIHNlbGVjdGlvbnNcbiAgICAgICAgJCgnLmFzc2lnbm1lbnRfcGFydG5lcl9zZWxlY3QnKS5zZWxlY3QyKHtcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBcIlNlbGVjdCB1cCB0byA0IHRlYW0gbWVtYmVyc1wiLFxuICAgICAgICAgICAgYWxsb3dDbGVhcjogdHJ1ZSxcbiAgICAgICAgICAgIG1heGltdW1TZWxlY3Rpb25MZW5ndGg6IHRoaXMubGltaXRcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBhc3luYyBzdWJtaXRBbGwoKSB7XG4gICAgICAgIC8vIGZpbmQgYWxsIGNvbXBvbmVudHMgb24gdGhlIHBhZ2UgYW5kIHN1Ym1pdCB0aGVtIGZvciBhbGwgZ3JvdXAgbWVtYmVyc1xuXG4gICAgICAgIGxldCBncm91cCA9IFtdXG4gICAgICAgIGZvciAobGV0IHN0dWRlbnQgb2YgdGhpcy5waWNrZXIuc2VsZWN0ZWRPcHRpb25zKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKHN0dWRlbnQudmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZSBsZWFkZXIgZm9yZ2V0cyB0byBhZGQgdGhlbXNlbHZlcywgYWRkIHRoZW0gaGVyZS5cbiAgICAgICAgbGV0IHVzZXJuYW1lID0gZUJvb2tDb25maWcudXNlcm5hbWU7XG4gICAgICAgIGlmICh1c2VybmFtZSAmJiAhZ3JvdXAuaW5jbHVkZXModXNlcm5hbWUpKSB7XG4gICAgICAgICAgICBncm91cC5wdXNoKHVzZXJuYW1lKVxuICAgICAgICB9XG4gICAgICAgIGlmIChncm91cC5sZW4gPiB0aGlzLmxpbWl0KSB7XG4gICAgICAgICAgICBhbGVydChgWW91IG1heSBub3QgaGF2ZSBtb3JlIHRoYW4gJHt0aGlzLmxpbWl0fSBzdHVkZW50cyBpbiBhIGdyb3VwYCk7XG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCh7XG4gICAgICAgICAgICBldmVudDogXCJncm91cF9zdGFydFwiLFxuICAgICAgICAgICAgYWN0OiBncm91cC5qb2luKFwiLFwiKSxcbiAgICAgICAgICAgIGRpdl9pZDogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGNvbXBvbmVudExpc3QgPSBbXTtcbiAgICAgICAgaWYgKHRoaXMuaXNQcmV0ZXh0KSB7XG4gICAgICAgICAgICBsZXQgY29udGFpbmVyID0gdGhpcy5vcmlnRWxlbS5jbG9zZXN0KFwic2VjdGlvbi5ncm91cHdvcmtcIik7XG4gICAgICAgICAgICBmb3IgKGxldCBpZCBvZiBPYmplY3Qua2V5cyhjb21wb25lbnRNYXApKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGAjJHtpZH1gKSkge1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRMaXN0LnB1c2goY29tcG9uZW50TWFwW2lkXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcG9uZW50TGlzdCA9IHdpbmRvdy5hbGxDb21wb25lbnRzO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHN0dWRlbnQgb2YgZ3JvdXApIHtcbiAgICAgICAgICAgIGZvciAobGV0IHF1ZXN0aW9uIG9mIGNvbXBvbmVudExpc3QpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtzdHVkZW50fSAke3F1ZXN0aW9ufWApXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHF1ZXN0aW9uLmxvZ0N1cnJlbnRBbnN3ZXIoc3R1ZGVudClcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBmYWlsZWQgdG8gc3VibWl0ICR7cXVlc3Rpb259IDogJHtlfWApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sb2dCb29rRXZlbnQoe1xuICAgICAgICAgICAgZXZlbnQ6IFwiZ3JvdXBfZW5kXCIsXG4gICAgICAgICAgICBhY3Q6IGdyb3VwLmpvaW4oXCIsXCIpLFxuICAgICAgICAgICAgZGl2X2lkOiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5cbiQoZG9jdW1lbnQpLm9uKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgZ3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29tcG9uZW50PWdyb3Vwc3ViXVwiKTtcbiAgICBpZiAoZ3MubGVuZ3RoID4gMSkge1xuICAgICAgICBhbGVydChcIk9ubHkgb25lIEdyb3VwIFN1Ym1pdCBpcyBhbGxvd2VkIHBlciBwYWdlXCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGdzRWxlbWVudCA9IGdzWzBdO1xuICAgIHRyeSB7XG4gICAgICAgIHZhciBwYWdlUmV2ZWFsID0gbmV3IEdyb3VwU3ViKHsgb3JpZzogZ3NFbGVtZW50IH0pO1xuICAgICAgICBhd2FpdCBwYWdlUmV2ZWFsLmluaXRpYWxpemUoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBHcm91cFN1YiAke2dzRWxlbWVudC5pZH1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYERldGFpbHMgJHtlcnJ9YCk7XG4gICAgfVxufSk7XG5cbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==