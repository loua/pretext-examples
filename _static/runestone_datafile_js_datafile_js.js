"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_datafile_js_datafile_js"],{

/***/ 20689:
/*!*********************************************!*\
  !*** ./runestone/datafile/css/datafile.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 33580:
/*!*******************************************!*\
  !*** ./runestone/datafile/js/datafile.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase */ 78673);
/* harmony import */ var _css_datafile_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/datafile.css */ 20689);
/*==========================================
=======     Master datafile.js      ========
============================================
===     This file contains the JS for    ===
===   the Runestone Datafile component.  ===
============================================
===              Created by              ===
===           Isaiah Mayerchak           ===
===                6/8/15                ===
==========================================*/





var dfList = {}; // Dictionary that contains all instances of Datafile objects

class DataFile extends _common_js_runestonebase__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        var orig = opts.orig; // entire <pre> element that will be replaced by new HTML
        this.origElem = orig;
        this.divid = orig.id;
        this.dataEdit = this.parseBooleanAttribute(orig, "data-edit");
        this.isImage = this.parseBooleanAttribute(orig, "data-isimage");
        this.fileName = orig.dataset.filename || null;
        this.displayClass = "block"; // Users can specify the non-edit component to be hidden--default is not hidden
        if (this.parseBooleanAttribute(orig, "data-hidden")) {
            this.displayClass = "none";
        }
        // Users can specify numbers of rows/columns when editing is true
        this.numberOfRows = orig.dataset.rows;
        this.numberOfCols = orig.dataset.cols;

        if (!this.isImage) {
            if (this.dataEdit) {
                this.createTextArea();
            } else {
                this.createPre();
            }
            if (this.fileName) {
                this.containerDiv.dataset.filename = this.fileName;
            }
        }
        // search for a parent div with the class 'datafile_caption' in plain javascript
        let captionDiv = this.containerDiv.parentElement?.querySelector(".datafile_caption");
        if (captionDiv && this.displayClass === "none") {
            // hide the captionDiv if the datafile is hidden
            captionDiv.style.display = "none";
        }
        this.indicate_component_ready();
    }
    /*=====================================
    == Create either <pre> or <textarea> ==
    ==  depending on if editing is true  ==
    ==================================*/
    createPre() {
        this.containerDiv = document.createElement("pre");
        this.containerDiv.id = this.divid;
        this.containerDiv.style.display = this.displayClass;
        this.containerDiv.innerHTML = this.origElem.innerHTML;
        this.origElem.replaceWith(this.containerDiv);
    }
    createTextArea() {
        this.containerDiv = document.createElement("textarea");
        this.containerDiv.id = this.divid;
        if (this.numberOfRows) this.containerDiv.rows = this.numberOfRows;
        if (this.numberOfCols) this.containerDiv.cols = this.numberOfCols;
        this.containerDiv.innerHTML = this.origElem.innerHTML;
        this.containerDiv.classList.add("datafiletextfield");
        this.origElem.replaceWith(this.containerDiv);
    }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/

document.addEventListener("runestone:login-complete", function () {
    document.querySelectorAll("[data-component=datafile]").forEach(function (el) {
        try {
            dfList[el.id] = new DataFile({ orig: el });
        } catch (err) {
            console.log(`Error rendering DataFile ${el.id}`);
        }
    });
});

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.datafile = function (opts) {
    return new DataFile(opts);
};


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2RhdGFmaWxlX2pzX2RhdGFmaWxlX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUU2QztBQUM3Qjs7QUFFN0IsaUJBQWlCOztBQUVqQix1QkFBdUIsZ0VBQWE7QUFDcEM7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsVUFBVTtBQUNyRCxVQUFVO0FBQ1Ysb0RBQW9ELE1BQU07QUFDMUQ7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9kYXRhZmlsZS9jc3MvZGF0YWZpbGUuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZGF0YWZpbGUvanMvZGF0YWZpbGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09PT09PT0gICAgIE1hc3RlciBkYXRhZmlsZS5qcyAgICAgID09PT09PT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICBUaGlzIGZpbGUgY29udGFpbnMgdGhlIEpTIGZvciAgICA9PT1cbj09PSAgIHRoZSBSdW5lc3RvbmUgRGF0YWZpbGUgY29tcG9uZW50LiAgPT09XG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuPT09ICAgICAgICAgICAgICBDcmVhdGVkIGJ5ICAgICAgICAgICAgICA9PT1cbj09PSAgICAgICAgICAgSXNhaWFoIE1heWVyY2hhayAgICAgICAgICAgPT09XG49PT0gICAgICAgICAgICAgICAgNi84LzE1ICAgICAgICAgICAgICAgID09PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2VcIjtcbmltcG9ydCBcIi4uL2Nzcy9kYXRhZmlsZS5jc3NcIjtcblxudmFyIGRmTGlzdCA9IHt9OyAvLyBEaWN0aW9uYXJ5IHRoYXQgY29udGFpbnMgYWxsIGluc3RhbmNlcyBvZiBEYXRhZmlsZSBvYmplY3RzXG5cbmNsYXNzIERhdGFGaWxlIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKTtcbiAgICAgICAgdmFyIG9yaWcgPSBvcHRzLm9yaWc7IC8vIGVudGlyZSA8cHJlPiBlbGVtZW50IHRoYXQgd2lsbCBiZSByZXBsYWNlZCBieSBuZXcgSFRNTFxuICAgICAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICAgICAgdGhpcy5kaXZpZCA9IG9yaWcuaWQ7XG4gICAgICAgIHRoaXMuZGF0YUVkaXQgPSB0aGlzLnBhcnNlQm9vbGVhbkF0dHJpYnV0ZShvcmlnLCBcImRhdGEtZWRpdFwiKTtcbiAgICAgICAgdGhpcy5pc0ltYWdlID0gdGhpcy5wYXJzZUJvb2xlYW5BdHRyaWJ1dGUob3JpZywgXCJkYXRhLWlzaW1hZ2VcIik7XG4gICAgICAgIHRoaXMuZmlsZU5hbWUgPSBvcmlnLmRhdGFzZXQuZmlsZW5hbWUgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5kaXNwbGF5Q2xhc3MgPSBcImJsb2NrXCI7IC8vIFVzZXJzIGNhbiBzcGVjaWZ5IHRoZSBub24tZWRpdCBjb21wb25lbnQgdG8gYmUgaGlkZGVuLS1kZWZhdWx0IGlzIG5vdCBoaWRkZW5cbiAgICAgICAgaWYgKHRoaXMucGFyc2VCb29sZWFuQXR0cmlidXRlKG9yaWcsIFwiZGF0YS1oaWRkZW5cIikpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGxheUNsYXNzID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVXNlcnMgY2FuIHNwZWNpZnkgbnVtYmVycyBvZiByb3dzL2NvbHVtbnMgd2hlbiBlZGl0aW5nIGlzIHRydWVcbiAgICAgICAgdGhpcy5udW1iZXJPZlJvd3MgPSBvcmlnLmRhdGFzZXQucm93cztcbiAgICAgICAgdGhpcy5udW1iZXJPZkNvbHMgPSBvcmlnLmRhdGFzZXQuY29scztcblxuICAgICAgICBpZiAoIXRoaXMuaXNJbWFnZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YUVkaXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVRleHRBcmVhKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUHJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5maWxlTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmRhdGFzZXQuZmlsZW5hbWUgPSB0aGlzLmZpbGVOYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHNlYXJjaCBmb3IgYSBwYXJlbnQgZGl2IHdpdGggdGhlIGNsYXNzICdkYXRhZmlsZV9jYXB0aW9uJyBpbiBwbGFpbiBqYXZhc2NyaXB0XG4gICAgICAgIGxldCBjYXB0aW9uRGl2ID0gdGhpcy5jb250YWluZXJEaXYucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcIi5kYXRhZmlsZV9jYXB0aW9uXCIpO1xuICAgICAgICBpZiAoY2FwdGlvbkRpdiAmJiB0aGlzLmRpc3BsYXlDbGFzcyA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIC8vIGhpZGUgdGhlIGNhcHRpb25EaXYgaWYgdGhlIGRhdGFmaWxlIGlzIGhpZGRlblxuICAgICAgICAgICAgY2FwdGlvbkRpdi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9XG4gICAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT0gQ3JlYXRlIGVpdGhlciA8cHJlPiBvciA8dGV4dGFyZWE+ID09XG4gICAgPT0gIGRlcGVuZGluZyBvbiBpZiBlZGl0aW5nIGlzIHRydWUgID09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gICAgY3JlYXRlUHJlKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlkID0gdGhpcy5kaXZpZDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuc3R5bGUuZGlzcGxheSA9IHRoaXMuZGlzcGxheUNsYXNzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5pbm5lckhUTUwgPSB0aGlzLm9yaWdFbGVtLmlubmVySFRNTDtcbiAgICAgICAgdGhpcy5vcmlnRWxlbS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gICAgfVxuICAgIGNyZWF0ZVRleHRBcmVhKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZXh0YXJlYVwiKTtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBpZiAodGhpcy5udW1iZXJPZlJvd3MpIHRoaXMuY29udGFpbmVyRGl2LnJvd3MgPSB0aGlzLm51bWJlck9mUm93cztcbiAgICAgICAgaWYgKHRoaXMubnVtYmVyT2ZDb2xzKSB0aGlzLmNvbnRhaW5lckRpdi5jb2xzID0gdGhpcy5udW1iZXJPZkNvbHM7XG4gICAgICAgIHRoaXMuY29udGFpbmVyRGl2LmlubmVySFRNTCA9IHRoaXMub3JpZ0VsZW0uaW5uZXJIVE1MO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKFwiZGF0YWZpbGV0ZXh0ZmllbGRcIik7XG4gICAgICAgIHRoaXMub3JpZ0VsZW0ucmVwbGFjZVdpdGgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cbn1cblxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbj09IEZpbmQgdGhlIGN1c3RvbSBIVE1MIHRhZ3MgYW5kID09XG49PSAgIGV4ZWN1dGUgb3VyIGNvZGUgb24gdGhlbSAgICA9PVxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWNvbXBvbmVudD1kYXRhZmlsZV1cIikuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRmTGlzdFtlbC5pZF0gPSBuZXcgRGF0YUZpbGUoeyBvcmlnOiBlbCB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgcmVuZGVyaW5nIERhdGFGaWxlICR7ZWwuaWR9YCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkuZGF0YWZpbGUgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgRGF0YUZpbGUob3B0cyk7XG59O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9