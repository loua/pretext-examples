"use strict";
(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_matching_js_matching_js"],{

/***/ 2036:
/*!**********************************************!*\
  !*** ./runestone/matching/css/matching.less ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 11390:
/*!************************************************!*\
  !*** ./runestone/matching/js/xmlconversion.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   xmlToJson: () => (/* binding */ xmlToJson)
/* harmony export */ });
function xmlToJson(xmlString) {
  // 1) Parse the XML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/html');
  const err = doc.querySelector('parsererror');
  if (err) {
    throw new Error('XML parse error: ' + err.textContent);
  }

  // 2) Helper to extract [ { id, label }, … ] from <premise> or <response>
  function itemsFrom(tagName) {
    return Array.from(doc.querySelectorAll(tagName))
      .map(el => {
        const idEl = el.querySelector('id');
        const labelEl = el.querySelector('label');
        return {
          id: idEl ? idEl.textContent.trim() : '',
          // innerHTML preserves any markup inside the label
          label: labelEl ? labelEl.innerHTML.trim() : ''
        };
      });
  }

  // 3) Helper to build [ [p, r], [p, r], … ]
  function correctAnswersFrom() {
    return Array.from(doc.querySelectorAll('edge'))
      .map(edgeEl => {
        const labs = Array.from(edgeEl.querySelectorAll('label'));
        // take first two <label> children as the pair
        return labs.slice(0, 2).map(l => l.textContent.trim());
      });
  }

  function getStatement() {
    const statementEl = doc.querySelector('statement');
    if (statementEl) {
      return statementEl.innerHTML.trim();
    }
    return '';
  }

  function getFeedback() {
    const feedbackEl = doc.querySelector('feedback');
    if (feedbackEl) {
      return feedbackEl.innerHTML.trim();
    }
    return '';
  }

  // 4) Return in { left, right, correctAnswers } shape
  return {
    statement: getStatement(),
    feedback: getFeedback(),
    left: itemsFrom('premise'),
    right: itemsFrom('response'),
    correctAnswers: correctAnswersFrom()
  };
}


/***/ }),

/***/ 17352:
/*!*******************************************!*\
  !*** ./runestone/matching/js/matching.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MatchingProblem: () => (/* binding */ MatchingProblem)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 78673);
/* harmony import */ var _css_matching_less__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css/matching.less */ 2036);
/* harmony import */ var _xmlconversion_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./xmlconversion.js */ 11390);



class MatchingProblem extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts)
        let container = opts.orig;
        this.containerDiv = opts.orig;
        const script = container.querySelector('script');
        if (script) {
            let boxData;
            try {
                // the script is called xml but may also contain some html for the statement.
                if (script.type == 'text/xml') {
                    const xml = script.textContent;
                    boxData = (0,_xmlconversion_js__WEBPACK_IMPORTED_MODULE_2__.xmlToJson)(xml);
                } else {
                    boxData = JSON.parse(script.textContent);
                }
                this.boxData = boxData;
            } catch (err) {
                console.error("Failed to parse boxData JSON:", err);
            }
        }

        this.divid = container.id;
        this.boxesRenderedPromise = new Promise((resolve) => {
            this.boxesRenderedResolve = resolve;
        });
        this.workspace = this.createWorkspace(container);
        try {
            this.statement = this.createStatement(container);
        } catch (error) {
            console.error("Error setting statement:", error);
        }   
        this.connList = this.createConnList(container);
        this.ariaLive = this.createAriaLive(container);
        this.controlDiv = this.createControlDiv(container);
        this.createHelpModal();

        this.connections = [];
        this.allBoxes = [];
        this.selectedBox = null;
        this.startBox = null;
        this.tempLine = null;
        this.useRunestoneServices = eBookConfig.useRunestoneServices;
        this.graderactive = opts.graderactive || false;
        this.init();
        // ensure that boxes are rendered before checking server
        // if boxes are not rendered then we may have dangling lines
        // that are not connected to any boxes
        this.boxesRenderedPromise.then(() => {
            this.checkServer("matching", true);
        });
    }

    init() {
        this.shuffle(this.boxData.left);
        this.shuffle(this.boxData.right);

        this.renderBoxes();
        this.attachEvents();

        this.queueMathJax(this.containerDiv);
    }

    // required elements for a Runestone component

    checkCurrentAnswer() {
        const correctAnswers = this.boxData.correctAnswers;
        const actual = this.connections.map(conn => [
            conn.fromBox.dataset.id,
            conn.toBox.dataset.id
        ]);

        const correctMatches = correctAnswers.filter(expected =>
            actual.some(given => given[0] === expected[0] && given[1] === expected[1])
        );

        const incorrectConnections = actual.filter(given =>
            !correctAnswers.some(expected => expected[0] === given[0] && expected[1] === given[1])
        );

        this.correctCount = correctMatches.length;
        this.incorrectCount = incorrectConnections.length;
        this.missingCount = correctAnswers.length - this.correctCount;
        this.denominator = this.correctCount + this.incorrectCount + this.missingCount;
        this.scorePercent = this.denominator === 0 ? 0 : Math.max(0, Math.min(100, Math.round((this.correctCount / this.denominator) * 100)));

    }

    async logCurrentAnswer() {
        let eventData = {
            score: this.scorePercent,
            percent: this.scorePercent/100.0,
            correctCount: this.correctCount,
            incorrectCount: this.incorrectCount,
            missingCount: this.missingCount,
            connections: this.connections.map(conn => ({
                from: conn.fromBox.dataset.id,
                to: conn.toBox.dataset.id
            }))
        }
        eventData.event = "matching";
        eventData.div_id = this.divid;
        eventData.act = `score:${eventData.score} connections:${JSON.stringify(eventData.connections)}`;
        eventData.correct = eventData.score === 100;
        eventData.answer = JSON.stringify({ connections: eventData.connections });

        await this.logBookEvent(eventData);

    }

    renderFeedback() {
        this.connections.forEach(conn => {
            const idPair = [conn.fromBox.dataset.id, conn.toBox.dataset.id];
            const isCorrect = this.boxData.correctAnswers.some(expected =>
                expected[0] === idPair[0] && expected[1] === idPair[1]
            );
            conn.line.classList.remove("correct", "incorrect");
            conn.line.classList.add(isCorrect ? "correct" : "incorrect");
        });

        this.connList.innerHTML = `<strong>Score: ${this.scorePercent}%</strong><br>`;
        this.connList.innerHTML += `<br>Correct: ${this.correctCount}`;
        this.connList.innerHTML += `<br>Incorrect: ${this.incorrectCount}`;
        this.connList.innerHTML += `<br>Missing: ${this.missingCount}`;
        if (this.scorePercent !== 100) {
            this.connList.innerHTML += `<div class="match_feedback exercise-content"><strong>Feedback:</strong> ${this.boxData.feedback}</div>`;
        }
        this.queueMathJax(this.connList)
    }

    createStatement(container) {
        const statement = document.createElement('div');
        statement.className = 'statement';
        statement.classList.add('match_question');
        statement.classList.add('exercise-statement');
        statement.innerHTML = this.boxData.statement;
        container.insertBefore(statement, container.firstChild);
        return statement;
    }


    restoreAnswers(data) {
        // Recreate lines
        if (data) {
            this.connections = data.answer.connections.map(conn => ({
                fromBox: this.allBoxes.find(box => box.dataset.id === conn.from),
                toBox: this.allBoxes.find(box => box.dataset.id === conn.to)
            }));
            this.updateConnectionModel();
            this.correct = data.correct;
        }
        this.connections.forEach(conn => {
            const from = this.getRightBoxCenter(conn.fromBox);
            const to = this.getLeftBoxCenter(conn.toBox);
            const line = this.createLineElement(from.x, from.y, to.x, to.y);
            line.fromBox = conn.fromBox;
            line.toBox = conn.toBox;
            this.svg.appendChild(line);
            conn.line = line;
        });

    }
    checkLocalStorage() {
        if (this.graderactive) {
            return;
        }
        const data = localStorage.getItem(this.divid);
        if (data) {
            const parsedData = JSON.parse(data);
            if (parsedData.timestamp && parsedData.timestamp < eBookConfig.termStartDate) {
                localStorage.removeItem(this.divid);
                return;
            }
            this.connections = parsedData.connections.map(conn => ({
                fromBox: this.allBoxes.find(box => box.dataset.id === conn.from),
                toBox: this.allBoxes.find(box => box.dataset.id === conn.to)
            }));
            this.updateConnectionModel();
            this.correctCount = parsedData.correctCount;
            this.incorrectCount = parsedData.incorrectCount;
            this.missingCount = parsedData.missingCount;
            this.scorePercent = parsedData.score;
            this.restoreAnswers();
            this.renderFeedback();
        }
    }
    setLocalStorage() {
        const timeStamp = new Date();
        const data = {
            connections: this.connections.map(conn => ({
                from: conn.fromBox.dataset.id,
                to: conn.toBox.dataset.id
            })),
            score: this.scorePercent,
            correctCount: this.correctCount,
            incorrectCount: this.incorrectCount,
            missingCount: this.missingCount,
            timestamp: timeStamp
        };
        localStorage.setItem(this.divid, JSON.stringify(data));
    }

    disableInteraction() { }

    createWorkspace(container) {
        const workspace = document.createElement('div');
        workspace.className = 'matching-workspace';

        const leftColumn = document.createElement('div');
        leftColumn.className = 'left-column';
        this.leftColumn = leftColumn;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add('connector-svg');
        this.svg = svg;

        const rightColumn = document.createElement('div');
        rightColumn.className = 'right-column';
        this.rightColumn = rightColumn;
        workspace.appendChild(leftColumn);
        workspace.appendChild(svg);
        workspace.appendChild(rightColumn);

        container.insertBefore(workspace, container.firstChild);
        return workspace;
    }

    createConnList(container) {
        const connList = document.createElement('div');
        connList.className = 'conn-list';
        connList.innerHTML = "<strong>Connections:</strong><br>";
        container.appendChild(connList);
        return connList;
    }

    createAriaLive(container) {
        const ariaLive = document.createElement('div');
        ariaLive.className = 'aria-live';
        ariaLive.setAttribute('aria-live', 'polite');
        ariaLive.setAttribute('aria-atomic', 'true');
        container.appendChild(ariaLive);
        return ariaLive;
    }

    createControlDiv(container) {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'control-div';
        const gradeBtn = document.createElement('button');
        gradeBtn.className = 'grade-button';
        gradeBtn.textContent = 'Check Me';
        gradeBtn.classList.add('btn', 'btn-success');
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-button';
        resetBtn.textContent = 'Reset';
        resetBtn.classList.add('btn', 'btn-default');
        // add Help button
        const helpBtn = document.createElement('button');
        helpBtn.className = 'help-button';
        helpBtn.textContent = '?';                     // changed from 'Help'
        helpBtn.setAttribute('aria-label', 'Help');    // accessible label
        controlDiv.appendChild(gradeBtn);
        controlDiv.appendChild(resetBtn);
        controlDiv.appendChild(helpBtn);
        container.appendChild(controlDiv);

        // events
        gradeBtn.addEventListener('click', () => this.gradeConnections());
        resetBtn.addEventListener('click', () => this.resetConnections());
        helpBtn.addEventListener('click', () => this.showHelp());
        this.gradeBtn = gradeBtn;
        this.resetBtn = resetBtn;
        this.helpBtn = helpBtn;
        return controlDiv;
    }

    createHelpModal() {
        this.helpModal = document.createElement('div');
        this.helpModal.className = 'help-modal';
        const text = `<p>Click and drag between boxes to create connections.</p>
        <p>Use the tab key to navigate to a box and press Enter to select the box.  Then tab to the connecting box and press Enter to create a connection between the two selected boxes.</p>
        <p>Click on a connection line to remove it. You can also use the tab key to select lines.  Press the delete key to remove a selected line.</p>
        <p>Click the "Check Me" button to check your connections, and save your work.</p>
        <p>Click the "Reset" button to clear all connections.</p>`

        this.helpModal.innerHTML = `
          <div class="help-modal-content">
            <button class="help-close">&times;</button>
            <div class="help-text">${text}</div>
          </div>`;
        this.containerDiv.appendChild(this.helpModal);
        this.helpModal.querySelector('.help-close')
            .addEventListener('click', () => this.hideHelp());
    }

    showHelp() {
        this.helpModal.style.display = 'flex';
    }

    hideHelp() {
        this.helpModal.style.display = 'none';
    }

    // Utility functions
    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    renderBoxes() {
        this.boxData.left.forEach(({ id, label }) => {
            const box = this.createBox(id, label, "drag");
            this.leftColumn.appendChild(box);
            this.allBoxes.push(box);
        });

        this.boxData.right.forEach(({ id, label }) => {
            const box = this.createBox(id, label, "drop");
            this.rightColumn.appendChild(box);
            this.allBoxes.push(box);
        });

        const imgs = Array.from(this.workspace.querySelectorAll('img'));
        if (imgs.length === 0) {
            this.boxesRenderedResolve();
        }
        // Wait for all images to load before resolving the promise
        const imgPromises = imgs.map(img => {
            if (typeof img.decode === 'function') {
                return img.decode();
            }
            if (img.complete && img.naturalWidth !== 0) {
                return Promise.resolve();
            }
            return new Promise((resolve) => {
                img.addEventListener('load', () => resolve());
                img.addEventListener('error', () => resolve());
            });
        });

        Promise.all(imgPromises).then(() => {
            this.boxesRenderedResolve();
        });
    }

    createBox(id, label, role) {
        const div = document.createElement('div');
        div.className = 'box';
        div.dataset.id = id;
        div.dataset.role = role;
        div.innerHTML = label;
        div.tabIndex = 0;
        div.setAttribute('role', 'button');
        div.setAttribute('aria-label', `${role === "drag" ? "Draggable" : "Droppable"}: ${label}`);
        return div;
    }

    getCenter(el) {
        const elRect = el.getBoundingClientRect();
        const containerRect = this.workspace.getBoundingClientRect();
        return {
            x: elRect.left - containerRect.left + elRect.width / 2,
            y: elRect.top - containerRect.top + elRect.height / 2
        };
    }

    getRightBoxCenter(el) {
        const elRect = el.getBoundingClientRect();
        const containerRect = this.workspace.getBoundingClientRect();
        return {
            x: elRect.left - containerRect.left + elRect.width,
            y: elRect.top - containerRect.top + elRect.height / 2
        };
    }
    getLeftBoxCenter(el) {
        const elRect = el.getBoundingClientRect();
        const containerRect = this.workspace.getBoundingClientRect();
        return {
            x: elRect.left - containerRect.left,
            y: elRect.top - containerRect.top + elRect.height / 2
        };
    }

    createLineElement(x1, y1, x2, y2) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("class", "line");
        line.setAttribute("tabindex", "0"); // Make the line focusable
        line.setAttribute("focusable", "true"); // Make the line focusable
        line.setAttribute("role", "button"); // Add ARIA role for accessibility
        line.setAttribute("aria-label", "Connection line. Press Delete to remove."); // Add ARIA label


        line.addEventListener("click", () => {
            this.removeLine(line);
        });

        line.addEventListener("keydown", (e) => {
            if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                this.removeLine(line);
            }
        });

        return line;
    }

    removeLine(line) {
        this.svg.removeChild(line);
        const index = this.connections.findIndex(conn =>
            (conn.fromBox === line.fromBox && conn.toBox === line.toBox) ||
            (conn.fromBox === line.toBox && conn.toBox === line.fromBox)
        );
        if (index !== -1) this.connections.splice(index, 1);
        this.updateConnectionModel();
    }

    isConnected(a, b) {
        return this.connections.some(conn =>
            (conn.fromBox === a && conn.toBox === b) ||
            (conn.fromBox === b && conn.toBox === a)
        );
    }

    createPermanentLine(fromBox, toBox) {
        const fromRole = fromBox.dataset.role;
        const toRole = toBox.dataset.role;

        if (fromRole === toRole) {
            alert("You can only connect a draggable to a droppable.");
            return;
        }

        // we should always store connections as drag to drop
        // even if the user connects drop to drag
        if (fromBox.dataset.role === "drop") {
            [fromBox, toBox] = [toBox, fromBox];
        }
        if (this.isConnected(fromBox, toBox)) return;

        const from = this.getRightBoxCenter(fromBox);
        const to = this.getLeftBoxCenter(toBox);
        const line = this.createLineElement(from.x, from.y, to.x, to.y);

        line.fromBox = fromBox;
        line.toBox = toBox;

        this.svg.appendChild(line);
        this.connections.push({ fromBox, toBox, line });
        this.updateConnectionModel();
        this.isAnswered = true;

        if (this.ariaLive) {
            this.ariaLive.textContent = `Connected ${fromBox.textContent} to ${toBox.textContent}`;
        }
    }

    updateConnectionModel() {
        this.connList.innerHTML = "<strong>Connections:</strong><br>";
        this.connections.forEach(conn => {
            const fromLabel = conn.fromBox.textContent;
            let toLabel = conn.toBox.textContent;
            if (!toLabel) {
                toLabel = conn.toBox.querySelector("img").alt // innerHTML preserves everything inside <label>…</label>       
            }
            const line = document.createElement('div');
            line.className = 'conn-entry';
            line.textContent = `${fromLabel} → ${toLabel}`;
            this.connList.appendChild(line);
        });
    }

    /*
    * This method grades the connections made by the user.
    * It checks the current answer against the correct answers,
    * renders feedback, and logs the current answer.
    * It also updates the local storage with the current state.
    * It is called when the user clicks the "Grade" button.
    */
    gradeConnections() {
        this.checkCurrentAnswer();
        this.renderFeedback();
        this.logCurrentAnswer();
        this.setLocalStorage();
    }

    resetConnections() {
        this.connections.forEach(conn => {
            if (conn.line && conn.line.parentNode === this.svg) {
                this.svg.removeChild(conn.line);
            }
        });
        this.connections.length = 0;
        this.updateConnectionModel();
        if (this.ariaLive) this.ariaLive.textContent = "All connections have been cleared.";
        this.logBookEvent( {
            event: "matching_reset",
            div_id: this.divid,
            act: "reset all connections",
        });
    }

    attachEvents() {
        this.allBoxes.forEach(box => {
            box.addEventListener("pointerdown", e => {
                if (e.ctrlKey || e.metaKey || true) {
                    e.preventDefault();
                    this.startBox = box;
                    const from = this.getRightBoxCenter(this.startBox);
                    this.tempLine = this.createLineElement(from.x, from.y, from.x, from.y);
                    this.tempLine.setAttribute("stroke", "gray");
                    this.tempLine.setAttribute("stroke-dasharray", "4");
                    this.svg.appendChild(this.tempLine);

                    document.addEventListener("pointermove", this.updateTempLine);
                    document.addEventListener("pointerup", this.finishConnection);
                }
            });

            box.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    if (!this.selectedBox) {
                        this.selectedBox = box;
                        box.classList.add("selected");
                    } else {
                        if (box !== this.selectedBox) this.createPermanentLine(this.selectedBox, box);
                        this.selectedBox.classList.remove("selected");
                        this.selectedBox = null;
                        const currentIndex = this.allBoxes.indexOf(box);
                        const next = this.allBoxes[currentIndex + 1];
                        if (next) next.focus();
                        else this.allBoxes[0].focus();
                    }
                }
            });

            box.addEventListener("mouseenter", () => {
                this.connections.forEach(conn => {
                    if (conn.fromBox === box || conn.toBox === box) {
                        conn.line.classList.add("highlighted");
                        conn.line.classList.remove("faded");
                    } else {
                        conn.line.classList.add("faded");
                        conn.line.classList.remove("highlighted");
                    }
                });
            });

            box.addEventListener("mouseleave", () => {
                this.connections.forEach(conn => {
                    conn.line.classList.remove("highlighted", "faded");
                });
            });
        });


        window.addEventListener("resize", () => {
            this.connections.forEach(conn => {
                const from = this.getRightBoxCenter(conn.fromBox);
                const to = this.getLeftBoxCenter(conn.toBox);
                conn.line.setAttribute("x1", from.x);
                conn.line.setAttribute("y1", from.y);
                conn.line.setAttribute("x2", to.x);
                conn.line.setAttribute("y2", to.y);
            });
        });
    }

    updateTempLine = (e) => {
        e.preventDefault();
        if (!this.startBox || !this.tempLine) return;
        const from = this.getRightBoxCenter(this.startBox);
        this.tempLine.setAttribute("x1", from.x);
        this.tempLine.setAttribute("y1", from.y);
        const containerRect = this.workspace.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;

        this.tempLine.setAttribute("x2", x);
        this.tempLine.setAttribute("y2", y);
    };

    finishConnection = (e) => {
        e.preventDefault();
        if (this.tempLine) {
            this.svg.removeChild(this.tempLine);
            this.tempLine = null;
        }

        // the target element is the element under the pointer
        // when the pointer is released
        // this is not the same as e.target which may be the box or it may be the svg 
        // or it may be the line, so we do it this way instead of checking to see if the box contains
        // e.target.  const endBox = this.allBoxes.find(box => box.contains(e.target) && box !== this.startBox);
        const pointX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const pointY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
        const targetElement = document.elementFromPoint(pointX, pointY);

        const endBox = this.allBoxes.find(box =>
            box.contains(targetElement) && box !== this.startBox
        );

        if (this.startBox && endBox) this.createPermanentLine(this.startBox, endBox);
        // 
        console.log(`connected ${this.startBox.dataset.id ? this.startBox.dataset.id : "null"} to ${endBox.dataset.id ? endBox.dataset.id : "null"}`);
        this.logBookEvent( {
            event: "matching_connection",
            div_id: this.divid,
            act: `connected ${this.startBox.dataset.id ? this.startBox.dataset.id : "null"} to ${endBox.dataset.id ? endBox.dataset.id : "null"}`,
        });
        this.startBox = null;
        document.removeEventListener("pointermove", this.updateTempLine);
        document.removeEventListener("pointerup", this.finishConnection);
    }
}




// Register the component with Runestone 
document.addEventListener("runestone:login-complete", () => {
    document.querySelectorAll('[data-component="matching"]').forEach(container => {
        if (!container.closest("[data-component=timedAssessment]")) {
            let opts = { orig: container }
            window.componentMap[container.id] = new MatchingProblem(opts);
        }
    });
});

// Add component factory initialization
if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}

window.component_factory.matching = function (opts) {
    return new MatchingProblem(opts);
};

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX21hdGNoaW5nX2pzX21hdGNoaW5nX2pzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FDQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEIsV0FBVztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsOEJBQThCO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pENkQ7QUFDL0I7QUFDaUI7QUFDeEMsOEJBQThCLG1FQUFhO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsNERBQVM7QUFDdkMsa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FB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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWlDLDhEQUE4RCxLQUFLLCtDQUErQztBQUNuSjtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsOERBQThELEtBQUssK0NBQStDO0FBQ2hKLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRSIsInNvdXJjZXMiOlsid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWF0Y2hpbmcvY3NzL21hdGNoaW5nLmxlc3MiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9tYXRjaGluZy9qcy94bWxjb252ZXJzaW9uLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvbWF0Y2hpbmcvanMvbWF0Y2hpbmcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiZXhwb3J0IGZ1bmN0aW9uIHhtbFRvSnNvbih4bWxTdHJpbmcpIHtcbiAgLy8gMSkgUGFyc2UgdGhlIFhNTCBzdHJpbmdcbiAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICBjb25zdCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHhtbFN0cmluZywgJ3RleHQvaHRtbCcpO1xuICBjb25zdCBlcnIgPSBkb2MucXVlcnlTZWxlY3RvcigncGFyc2VyZXJyb3InKTtcbiAgaWYgKGVycikge1xuICAgIHRocm93IG5ldyBFcnJvcignWE1MIHBhcnNlIGVycm9yOiAnICsgZXJyLnRleHRDb250ZW50KTtcbiAgfVxuXG4gIC8vIDIpIEhlbHBlciB0byBleHRyYWN0IFsgeyBpZCwgbGFiZWwgfSwg4oCmIF0gZnJvbSA8cHJlbWlzZT4gb3IgPHJlc3BvbnNlPlxuICBmdW5jdGlvbiBpdGVtc0Zyb20odGFnTmFtZSkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKGRvYy5xdWVyeVNlbGVjdG9yQWxsKHRhZ05hbWUpKVxuICAgICAgLm1hcChlbCA9PiB7XG4gICAgICAgIGNvbnN0IGlkRWwgPSBlbC5xdWVyeVNlbGVjdG9yKCdpZCcpO1xuICAgICAgICBjb25zdCBsYWJlbEVsID0gZWwucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogaWRFbCA/IGlkRWwudGV4dENvbnRlbnQudHJpbSgpIDogJycsXG4gICAgICAgICAgLy8gaW5uZXJIVE1MIHByZXNlcnZlcyBhbnkgbWFya3VwIGluc2lkZSB0aGUgbGFiZWxcbiAgICAgICAgICBsYWJlbDogbGFiZWxFbCA/IGxhYmVsRWwuaW5uZXJIVE1MLnRyaW0oKSA6ICcnXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vIDMpIEhlbHBlciB0byBidWlsZCBbIFtwLCByXSwgW3AsIHJdLCDigKYgXVxuICBmdW5jdGlvbiBjb3JyZWN0QW5zd2Vyc0Zyb20oKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZG9jLnF1ZXJ5U2VsZWN0b3JBbGwoJ2VkZ2UnKSlcbiAgICAgIC5tYXAoZWRnZUVsID0+IHtcbiAgICAgICAgY29uc3QgbGFicyA9IEFycmF5LmZyb20oZWRnZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2xhYmVsJykpO1xuICAgICAgICAvLyB0YWtlIGZpcnN0IHR3byA8bGFiZWw+IGNoaWxkcmVuIGFzIHRoZSBwYWlyXG4gICAgICAgIHJldHVybiBsYWJzLnNsaWNlKDAsIDIpLm1hcChsID0+IGwudGV4dENvbnRlbnQudHJpbSgpKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U3RhdGVtZW50KCkge1xuICAgIGNvbnN0IHN0YXRlbWVudEVsID0gZG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0YXRlbWVudCcpO1xuICAgIGlmIChzdGF0ZW1lbnRFbCkge1xuICAgICAgcmV0dXJuIHN0YXRlbWVudEVsLmlubmVySFRNTC50cmltKCk7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZlZWRiYWNrKCkge1xuICAgIGNvbnN0IGZlZWRiYWNrRWwgPSBkb2MucXVlcnlTZWxlY3RvcignZmVlZGJhY2snKTtcbiAgICBpZiAoZmVlZGJhY2tFbCkge1xuICAgICAgcmV0dXJuIGZlZWRiYWNrRWwuaW5uZXJIVE1MLnRyaW0oKTtcbiAgICB9XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLy8gNCkgUmV0dXJuIGluIHsgbGVmdCwgcmlnaHQsIGNvcnJlY3RBbnN3ZXJzIH0gc2hhcGVcbiAgcmV0dXJuIHtcbiAgICBzdGF0ZW1lbnQ6IGdldFN0YXRlbWVudCgpLFxuICAgIGZlZWRiYWNrOiBnZXRGZWVkYmFjaygpLFxuICAgIGxlZnQ6IGl0ZW1zRnJvbSgncHJlbWlzZScpLFxuICAgIHJpZ2h0OiBpdGVtc0Zyb20oJ3Jlc3BvbnNlJyksXG4gICAgY29ycmVjdEFuc3dlcnM6IGNvcnJlY3RBbnN3ZXJzRnJvbSgpXG4gIH07XG59XG4iLCJpbXBvcnQgUnVuZXN0b25lQmFzZSBmcm9tIFwiLi4vLi4vY29tbW9uL2pzL3J1bmVzdG9uZWJhc2UuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9tYXRjaGluZy5sZXNzXCI7XG5pbXBvcnQgeyB4bWxUb0pzb24gfSBmcm9tIFwiLi94bWxjb252ZXJzaW9uLmpzXCI7XG5leHBvcnQgY2xhc3MgTWF0Y2hpbmdQcm9ibGVtIGV4dGVuZHMgUnVuZXN0b25lQmFzZSB7XG4gICAgY29uc3RydWN0b3Iob3B0cykge1xuICAgICAgICBzdXBlcihvcHRzKVxuICAgICAgICBsZXQgY29udGFpbmVyID0gb3B0cy5vcmlnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdiA9IG9wdHMub3JpZztcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NjcmlwdCcpO1xuICAgICAgICBpZiAoc2NyaXB0KSB7XG4gICAgICAgICAgICBsZXQgYm94RGF0YTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gdGhlIHNjcmlwdCBpcyBjYWxsZWQgeG1sIGJ1dCBtYXkgYWxzbyBjb250YWluIHNvbWUgaHRtbCBmb3IgdGhlIHN0YXRlbWVudC5cbiAgICAgICAgICAgICAgICBpZiAoc2NyaXB0LnR5cGUgPT0gJ3RleHQveG1sJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4bWwgPSBzY3JpcHQudGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGJveERhdGEgPSB4bWxUb0pzb24oeG1sKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBib3hEYXRhID0gSlNPTi5wYXJzZShzY3JpcHQudGV4dENvbnRlbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmJveERhdGEgPSBib3hEYXRhO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBwYXJzZSBib3hEYXRhIEpTT046XCIsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpdmlkID0gY29udGFpbmVyLmlkO1xuICAgICAgICB0aGlzLmJveGVzUmVuZGVyZWRQcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm94ZXNSZW5kZXJlZFJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB0aGlzLmNyZWF0ZVdvcmtzcGFjZShjb250YWluZXIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5zdGF0ZW1lbnQgPSB0aGlzLmNyZWF0ZVN0YXRlbWVudChjb250YWluZXIpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNldHRpbmcgc3RhdGVtZW50OlwiLCBlcnJvcik7XG4gICAgICAgIH0gICBcbiAgICAgICAgdGhpcy5jb25uTGlzdCA9IHRoaXMuY3JlYXRlQ29ubkxpc3QoY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5hcmlhTGl2ZSA9IHRoaXMuY3JlYXRlQXJpYUxpdmUoY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5jb250cm9sRGl2ID0gdGhpcy5jcmVhdGVDb250cm9sRGl2KGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuY3JlYXRlSGVscE1vZGFsKCk7XG5cbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucyA9IFtdO1xuICAgICAgICB0aGlzLmFsbEJveGVzID0gW107XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRCb3ggPSBudWxsO1xuICAgICAgICB0aGlzLnN0YXJ0Qm94ID0gbnVsbDtcbiAgICAgICAgdGhpcy50ZW1wTGluZSA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMgPSBlQm9va0NvbmZpZy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICAgICAgdGhpcy5ncmFkZXJhY3RpdmUgPSBvcHRzLmdyYWRlcmFjdGl2ZSB8fCBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIC8vIGVuc3VyZSB0aGF0IGJveGVzIGFyZSByZW5kZXJlZCBiZWZvcmUgY2hlY2tpbmcgc2VydmVyXG4gICAgICAgIC8vIGlmIGJveGVzIGFyZSBub3QgcmVuZGVyZWQgdGhlbiB3ZSBtYXkgaGF2ZSBkYW5nbGluZyBsaW5lc1xuICAgICAgICAvLyB0aGF0IGFyZSBub3QgY29ubmVjdGVkIHRvIGFueSBib3hlc1xuICAgICAgICB0aGlzLmJveGVzUmVuZGVyZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGVja1NlcnZlcihcIm1hdGNoaW5nXCIsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLnNodWZmbGUodGhpcy5ib3hEYXRhLmxlZnQpO1xuICAgICAgICB0aGlzLnNodWZmbGUodGhpcy5ib3hEYXRhLnJpZ2h0KTtcblxuICAgICAgICB0aGlzLnJlbmRlckJveGVzKCk7XG4gICAgICAgIHRoaXMuYXR0YWNoRXZlbnRzKCk7XG5cbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5jb250YWluZXJEaXYpO1xuICAgIH1cblxuICAgIC8vIHJlcXVpcmVkIGVsZW1lbnRzIGZvciBhIFJ1bmVzdG9uZSBjb21wb25lbnRcblxuICAgIGNoZWNrQ3VycmVudEFuc3dlcigpIHtcbiAgICAgICAgY29uc3QgY29ycmVjdEFuc3dlcnMgPSB0aGlzLmJveERhdGEuY29ycmVjdEFuc3dlcnM7XG4gICAgICAgIGNvbnN0IGFjdHVhbCA9IHRoaXMuY29ubmVjdGlvbnMubWFwKGNvbm4gPT4gW1xuICAgICAgICAgICAgY29ubi5mcm9tQm94LmRhdGFzZXQuaWQsXG4gICAgICAgICAgICBjb25uLnRvQm94LmRhdGFzZXQuaWRcbiAgICAgICAgXSk7XG5cbiAgICAgICAgY29uc3QgY29ycmVjdE1hdGNoZXMgPSBjb3JyZWN0QW5zd2Vycy5maWx0ZXIoZXhwZWN0ZWQgPT5cbiAgICAgICAgICAgIGFjdHVhbC5zb21lKGdpdmVuID0+IGdpdmVuWzBdID09PSBleHBlY3RlZFswXSAmJiBnaXZlblsxXSA9PT0gZXhwZWN0ZWRbMV0pXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaW5jb3JyZWN0Q29ubmVjdGlvbnMgPSBhY3R1YWwuZmlsdGVyKGdpdmVuID0+XG4gICAgICAgICAgICAhY29ycmVjdEFuc3dlcnMuc29tZShleHBlY3RlZCA9PiBleHBlY3RlZFswXSA9PT0gZ2l2ZW5bMF0gJiYgZXhwZWN0ZWRbMV0gPT09IGdpdmVuWzFdKVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMuY29ycmVjdENvdW50ID0gY29ycmVjdE1hdGNoZXMubGVuZ3RoO1xuICAgICAgICB0aGlzLmluY29ycmVjdENvdW50ID0gaW5jb3JyZWN0Q29ubmVjdGlvbnMubGVuZ3RoO1xuICAgICAgICB0aGlzLm1pc3NpbmdDb3VudCA9IGNvcnJlY3RBbnN3ZXJzLmxlbmd0aCAtIHRoaXMuY29ycmVjdENvdW50O1xuICAgICAgICB0aGlzLmRlbm9taW5hdG9yID0gdGhpcy5jb3JyZWN0Q291bnQgKyB0aGlzLmluY29ycmVjdENvdW50ICsgdGhpcy5taXNzaW5nQ291bnQ7XG4gICAgICAgIHRoaXMuc2NvcmVQZXJjZW50ID0gdGhpcy5kZW5vbWluYXRvciA9PT0gMCA/IDAgOiBNYXRoLm1heCgwLCBNYXRoLm1pbigxMDAsIE1hdGgucm91bmQoKHRoaXMuY29ycmVjdENvdW50IC8gdGhpcy5kZW5vbWluYXRvcikgKiAxMDApKSk7XG5cbiAgICB9XG5cbiAgICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKCkge1xuICAgICAgICBsZXQgZXZlbnREYXRhID0ge1xuICAgICAgICAgICAgc2NvcmU6IHRoaXMuc2NvcmVQZXJjZW50LFxuICAgICAgICAgICAgcGVyY2VudDogdGhpcy5zY29yZVBlcmNlbnQvMTAwLjAsXG4gICAgICAgICAgICBjb3JyZWN0Q291bnQ6IHRoaXMuY29ycmVjdENvdW50LFxuICAgICAgICAgICAgaW5jb3JyZWN0Q291bnQ6IHRoaXMuaW5jb3JyZWN0Q291bnQsXG4gICAgICAgICAgICBtaXNzaW5nQ291bnQ6IHRoaXMubWlzc2luZ0NvdW50LFxuICAgICAgICAgICAgY29ubmVjdGlvbnM6IHRoaXMuY29ubmVjdGlvbnMubWFwKGNvbm4gPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tOiBjb25uLmZyb21Cb3guZGF0YXNldC5pZCxcbiAgICAgICAgICAgICAgICB0bzogY29ubi50b0JveC5kYXRhc2V0LmlkXG4gICAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgICBldmVudERhdGEuZXZlbnQgPSBcIm1hdGNoaW5nXCI7XG4gICAgICAgIGV2ZW50RGF0YS5kaXZfaWQgPSB0aGlzLmRpdmlkO1xuICAgICAgICBldmVudERhdGEuYWN0ID0gYHNjb3JlOiR7ZXZlbnREYXRhLnNjb3JlfSBjb25uZWN0aW9uczoke0pTT04uc3RyaW5naWZ5KGV2ZW50RGF0YS5jb25uZWN0aW9ucyl9YDtcbiAgICAgICAgZXZlbnREYXRhLmNvcnJlY3QgPSBldmVudERhdGEuc2NvcmUgPT09IDEwMDtcbiAgICAgICAgZXZlbnREYXRhLmFuc3dlciA9IEpTT04uc3RyaW5naWZ5KHsgY29ubmVjdGlvbnM6IGV2ZW50RGF0YS5jb25uZWN0aW9ucyB9KTtcblxuICAgICAgICBhd2FpdCB0aGlzLmxvZ0Jvb2tFdmVudChldmVudERhdGEpO1xuXG4gICAgfVxuXG4gICAgcmVuZGVyRmVlZGJhY2soKSB7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaChjb25uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlkUGFpciA9IFtjb25uLmZyb21Cb3guZGF0YXNldC5pZCwgY29ubi50b0JveC5kYXRhc2V0LmlkXTtcbiAgICAgICAgICAgIGNvbnN0IGlzQ29ycmVjdCA9IHRoaXMuYm94RGF0YS5jb3JyZWN0QW5zd2Vycy5zb21lKGV4cGVjdGVkID0+XG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRbMF0gPT09IGlkUGFpclswXSAmJiBleHBlY3RlZFsxXSA9PT0gaWRQYWlyWzFdXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY29ubi5saW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJjb3JyZWN0XCIsIFwiaW5jb3JyZWN0XCIpO1xuICAgICAgICAgICAgY29ubi5saW5lLmNsYXNzTGlzdC5hZGQoaXNDb3JyZWN0ID8gXCJjb3JyZWN0XCIgOiBcImluY29ycmVjdFwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5jb25uTGlzdC5pbm5lckhUTUwgPSBgPHN0cm9uZz5TY29yZTogJHt0aGlzLnNjb3JlUGVyY2VudH0lPC9zdHJvbmc+PGJyPmA7XG4gICAgICAgIHRoaXMuY29ubkxpc3QuaW5uZXJIVE1MICs9IGA8YnI+Q29ycmVjdDogJHt0aGlzLmNvcnJlY3RDb3VudH1gO1xuICAgICAgICB0aGlzLmNvbm5MaXN0LmlubmVySFRNTCArPSBgPGJyPkluY29ycmVjdDogJHt0aGlzLmluY29ycmVjdENvdW50fWA7XG4gICAgICAgIHRoaXMuY29ubkxpc3QuaW5uZXJIVE1MICs9IGA8YnI+TWlzc2luZzogJHt0aGlzLm1pc3NpbmdDb3VudH1gO1xuICAgICAgICBpZiAodGhpcy5zY29yZVBlcmNlbnQgIT09IDEwMCkge1xuICAgICAgICAgICAgdGhpcy5jb25uTGlzdC5pbm5lckhUTUwgKz0gYDxkaXYgY2xhc3M9XCJtYXRjaF9mZWVkYmFjayBleGVyY2lzZS1jb250ZW50XCI+PHN0cm9uZz5GZWVkYmFjazo8L3N0cm9uZz4gJHt0aGlzLmJveERhdGEuZmVlZGJhY2t9PC9kaXY+YDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXVlTWF0aEpheCh0aGlzLmNvbm5MaXN0KVxuICAgIH1cblxuICAgIGNyZWF0ZVN0YXRlbWVudChjb250YWluZXIpIHtcbiAgICAgICAgY29uc3Qgc3RhdGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHN0YXRlbWVudC5jbGFzc05hbWUgPSAnc3RhdGVtZW50JztcbiAgICAgICAgc3RhdGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdGNoX3F1ZXN0aW9uJyk7XG4gICAgICAgIHN0YXRlbWVudC5jbGFzc0xpc3QuYWRkKCdleGVyY2lzZS1zdGF0ZW1lbnQnKTtcbiAgICAgICAgc3RhdGVtZW50LmlubmVySFRNTCA9IHRoaXMuYm94RGF0YS5zdGF0ZW1lbnQ7XG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoc3RhdGVtZW50LCBjb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIHJldHVybiBzdGF0ZW1lbnQ7XG4gICAgfVxuXG5cbiAgICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgICAgIC8vIFJlY3JlYXRlIGxpbmVzXG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zID0gZGF0YS5hbnN3ZXIuY29ubmVjdGlvbnMubWFwKGNvbm4gPT4gKHtcbiAgICAgICAgICAgICAgICBmcm9tQm94OiB0aGlzLmFsbEJveGVzLmZpbmQoYm94ID0+IGJveC5kYXRhc2V0LmlkID09PSBjb25uLmZyb20pLFxuICAgICAgICAgICAgICAgIHRvQm94OiB0aGlzLmFsbEJveGVzLmZpbmQoYm94ID0+IGJveC5kYXRhc2V0LmlkID09PSBjb25uLnRvKVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb25uZWN0aW9uTW9kZWwoKTtcbiAgICAgICAgICAgIHRoaXMuY29ycmVjdCA9IGRhdGEuY29ycmVjdDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmZvckVhY2goY29ubiA9PiB7XG4gICAgICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRSaWdodEJveENlbnRlcihjb25uLmZyb21Cb3gpO1xuICAgICAgICAgICAgY29uc3QgdG8gPSB0aGlzLmdldExlZnRCb3hDZW50ZXIoY29ubi50b0JveCk7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gdGhpcy5jcmVhdGVMaW5lRWxlbWVudChmcm9tLngsIGZyb20ueSwgdG8ueCwgdG8ueSk7XG4gICAgICAgICAgICBsaW5lLmZyb21Cb3ggPSBjb25uLmZyb21Cb3g7XG4gICAgICAgICAgICBsaW5lLnRvQm94ID0gY29ubi50b0JveDtcbiAgICAgICAgICAgIHRoaXMuc3ZnLmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgICAgICAgY29ubi5saW5lID0gbGluZTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG4gICAgY2hlY2tMb2NhbFN0b3JhZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLmdyYWRlcmFjdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGRhdGEgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmRpdmlkKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgICAgaWYgKHBhcnNlZERhdGEudGltZXN0YW1wICYmIHBhcnNlZERhdGEudGltZXN0YW1wIDwgZUJvb2tDb25maWcudGVybVN0YXJ0RGF0ZSkge1xuICAgICAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMuZGl2aWQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMgPSBwYXJzZWREYXRhLmNvbm5lY3Rpb25zLm1hcChjb25uID0+ICh7XG4gICAgICAgICAgICAgICAgZnJvbUJveDogdGhpcy5hbGxCb3hlcy5maW5kKGJveCA9PiBib3guZGF0YXNldC5pZCA9PT0gY29ubi5mcm9tKSxcbiAgICAgICAgICAgICAgICB0b0JveDogdGhpcy5hbGxCb3hlcy5maW5kKGJveCA9PiBib3guZGF0YXNldC5pZCA9PT0gY29ubi50bylcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ29ubmVjdGlvbk1vZGVsKCk7XG4gICAgICAgICAgICB0aGlzLmNvcnJlY3RDb3VudCA9IHBhcnNlZERhdGEuY29ycmVjdENvdW50O1xuICAgICAgICAgICAgdGhpcy5pbmNvcnJlY3RDb3VudCA9IHBhcnNlZERhdGEuaW5jb3JyZWN0Q291bnQ7XG4gICAgICAgICAgICB0aGlzLm1pc3NpbmdDb3VudCA9IHBhcnNlZERhdGEubWlzc2luZ0NvdW50O1xuICAgICAgICAgICAgdGhpcy5zY29yZVBlcmNlbnQgPSBwYXJzZWREYXRhLnNjb3JlO1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlQW5zd2VycygpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGZWVkYmFjaygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldExvY2FsU3RvcmFnZSgpIHtcbiAgICAgICAgY29uc3QgdGltZVN0YW1wID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zOiB0aGlzLmNvbm5lY3Rpb25zLm1hcChjb25uID0+ICh7XG4gICAgICAgICAgICAgICAgZnJvbTogY29ubi5mcm9tQm94LmRhdGFzZXQuaWQsXG4gICAgICAgICAgICAgICAgdG86IGNvbm4udG9Cb3guZGF0YXNldC5pZFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc2NvcmU6IHRoaXMuc2NvcmVQZXJjZW50LFxuICAgICAgICAgICAgY29ycmVjdENvdW50OiB0aGlzLmNvcnJlY3RDb3VudCxcbiAgICAgICAgICAgIGluY29ycmVjdENvdW50OiB0aGlzLmluY29ycmVjdENvdW50LFxuICAgICAgICAgICAgbWlzc2luZ0NvdW50OiB0aGlzLm1pc3NpbmdDb3VudCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZVN0YW1wXG4gICAgICAgIH07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRoaXMuZGl2aWQsIEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7IH1cblxuICAgIGNyZWF0ZVdvcmtzcGFjZShjb250YWluZXIpIHtcbiAgICAgICAgY29uc3Qgd29ya3NwYWNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHdvcmtzcGFjZS5jbGFzc05hbWUgPSAnbWF0Y2hpbmctd29ya3NwYWNlJztcblxuICAgICAgICBjb25zdCBsZWZ0Q29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxlZnRDb2x1bW4uY2xhc3NOYW1lID0gJ2xlZnQtY29sdW1uJztcbiAgICAgICAgdGhpcy5sZWZ0Q29sdW1uID0gbGVmdENvbHVtbjtcbiAgICAgICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJzdmdcIik7XG4gICAgICAgIHN2Zy5jbGFzc0xpc3QuYWRkKCdjb25uZWN0b3Itc3ZnJyk7XG4gICAgICAgIHRoaXMuc3ZnID0gc3ZnO1xuXG4gICAgICAgIGNvbnN0IHJpZ2h0Q29sdW1uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHJpZ2h0Q29sdW1uLmNsYXNzTmFtZSA9ICdyaWdodC1jb2x1bW4nO1xuICAgICAgICB0aGlzLnJpZ2h0Q29sdW1uID0gcmlnaHRDb2x1bW47XG4gICAgICAgIHdvcmtzcGFjZS5hcHBlbmRDaGlsZChsZWZ0Q29sdW1uKTtcbiAgICAgICAgd29ya3NwYWNlLmFwcGVuZENoaWxkKHN2Zyk7XG4gICAgICAgIHdvcmtzcGFjZS5hcHBlbmRDaGlsZChyaWdodENvbHVtbik7XG5cbiAgICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZSh3b3Jrc3BhY2UsIGNvbnRhaW5lci5maXJzdENoaWxkKTtcbiAgICAgICAgcmV0dXJuIHdvcmtzcGFjZTtcbiAgICB9XG5cbiAgICBjcmVhdGVDb25uTGlzdChjb250YWluZXIpIHtcbiAgICAgICAgY29uc3QgY29ubkxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29ubkxpc3QuY2xhc3NOYW1lID0gJ2Nvbm4tbGlzdCc7XG4gICAgICAgIGNvbm5MaXN0LmlubmVySFRNTCA9IFwiPHN0cm9uZz5Db25uZWN0aW9uczo8L3N0cm9uZz48YnI+XCI7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb25uTGlzdCk7XG4gICAgICAgIHJldHVybiBjb25uTGlzdDtcbiAgICB9XG5cbiAgICBjcmVhdGVBcmlhTGl2ZShjb250YWluZXIpIHtcbiAgICAgICAgY29uc3QgYXJpYUxpdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgYXJpYUxpdmUuY2xhc3NOYW1lID0gJ2FyaWEtbGl2ZSc7XG4gICAgICAgIGFyaWFMaXZlLnNldEF0dHJpYnV0ZSgnYXJpYS1saXZlJywgJ3BvbGl0ZScpO1xuICAgICAgICBhcmlhTGl2ZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtYXRvbWljJywgJ3RydWUnKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGFyaWFMaXZlKTtcbiAgICAgICAgcmV0dXJuIGFyaWFMaXZlO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbnRyb2xEaXYoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udHJvbERpdi5jbGFzc05hbWUgPSAnY29udHJvbC1kaXYnO1xuICAgICAgICBjb25zdCBncmFkZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBncmFkZUJ0bi5jbGFzc05hbWUgPSAnZ3JhZGUtYnV0dG9uJztcbiAgICAgICAgZ3JhZGVCdG4udGV4dENvbnRlbnQgPSAnQ2hlY2sgTWUnO1xuICAgICAgICBncmFkZUJ0bi5jbGFzc0xpc3QuYWRkKCdidG4nLCAnYnRuLXN1Y2Nlc3MnKTtcbiAgICAgICAgY29uc3QgcmVzZXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgcmVzZXRCdG4uY2xhc3NOYW1lID0gJ3Jlc2V0LWJ1dHRvbic7XG4gICAgICAgIHJlc2V0QnRuLnRleHRDb250ZW50ID0gJ1Jlc2V0JztcbiAgICAgICAgcmVzZXRCdG4uY2xhc3NMaXN0LmFkZCgnYnRuJywgJ2J0bi1kZWZhdWx0Jyk7XG4gICAgICAgIC8vIGFkZCBIZWxwIGJ1dHRvblxuICAgICAgICBjb25zdCBoZWxwQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGhlbHBCdG4uY2xhc3NOYW1lID0gJ2hlbHAtYnV0dG9uJztcbiAgICAgICAgaGVscEJ0bi50ZXh0Q29udGVudCA9ICc/JzsgICAgICAgICAgICAgICAgICAgICAvLyBjaGFuZ2VkIGZyb20gJ0hlbHAnXG4gICAgICAgIGhlbHBCdG4uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ0hlbHAnKTsgICAgLy8gYWNjZXNzaWJsZSBsYWJlbFxuICAgICAgICBjb250cm9sRGl2LmFwcGVuZENoaWxkKGdyYWRlQnRuKTtcbiAgICAgICAgY29udHJvbERpdi5hcHBlbmRDaGlsZChyZXNldEJ0bik7XG4gICAgICAgIGNvbnRyb2xEaXYuYXBwZW5kQ2hpbGQoaGVscEJ0bik7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9sRGl2KTtcblxuICAgICAgICAvLyBldmVudHNcbiAgICAgICAgZ3JhZGVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmdyYWRlQ29ubmVjdGlvbnMoKSk7XG4gICAgICAgIHJlc2V0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5yZXNldENvbm5lY3Rpb25zKCkpO1xuICAgICAgICBoZWxwQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5zaG93SGVscCgpKTtcbiAgICAgICAgdGhpcy5ncmFkZUJ0biA9IGdyYWRlQnRuO1xuICAgICAgICB0aGlzLnJlc2V0QnRuID0gcmVzZXRCdG47XG4gICAgICAgIHRoaXMuaGVscEJ0biA9IGhlbHBCdG47XG4gICAgICAgIHJldHVybiBjb250cm9sRGl2O1xuICAgIH1cblxuICAgIGNyZWF0ZUhlbHBNb2RhbCgpIHtcbiAgICAgICAgdGhpcy5oZWxwTW9kYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5oZWxwTW9kYWwuY2xhc3NOYW1lID0gJ2hlbHAtbW9kYWwnO1xuICAgICAgICBjb25zdCB0ZXh0ID0gYDxwPkNsaWNrIGFuZCBkcmFnIGJldHdlZW4gYm94ZXMgdG8gY3JlYXRlIGNvbm5lY3Rpb25zLjwvcD5cbiAgICAgICAgPHA+VXNlIHRoZSB0YWIga2V5IHRvIG5hdmlnYXRlIHRvIGEgYm94IGFuZCBwcmVzcyBFbnRlciB0byBzZWxlY3QgdGhlIGJveC4gIFRoZW4gdGFiIHRvIHRoZSBjb25uZWN0aW5nIGJveCBhbmQgcHJlc3MgRW50ZXIgdG8gY3JlYXRlIGEgY29ubmVjdGlvbiBiZXR3ZWVuIHRoZSB0d28gc2VsZWN0ZWQgYm94ZXMuPC9wPlxuICAgICAgICA8cD5DbGljayBvbiBhIGNvbm5lY3Rpb24gbGluZSB0byByZW1vdmUgaXQuIFlvdSBjYW4gYWxzbyB1c2UgdGhlIHRhYiBrZXkgdG8gc2VsZWN0IGxpbmVzLiAgUHJlc3MgdGhlIGRlbGV0ZSBrZXkgdG8gcmVtb3ZlIGEgc2VsZWN0ZWQgbGluZS48L3A+XG4gICAgICAgIDxwPkNsaWNrIHRoZSBcIkNoZWNrIE1lXCIgYnV0dG9uIHRvIGNoZWNrIHlvdXIgY29ubmVjdGlvbnMsIGFuZCBzYXZlIHlvdXIgd29yay48L3A+XG4gICAgICAgIDxwPkNsaWNrIHRoZSBcIlJlc2V0XCIgYnV0dG9uIHRvIGNsZWFyIGFsbCBjb25uZWN0aW9ucy48L3A+YFxuXG4gICAgICAgIHRoaXMuaGVscE1vZGFsLmlubmVySFRNTCA9IGBcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVscC1tb2RhbC1jb250ZW50XCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiaGVscC1jbG9zZVwiPiZ0aW1lczs8L2J1dHRvbj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZWxwLXRleHRcIj4ke3RleHR9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5oZWxwTW9kYWwpO1xuICAgICAgICB0aGlzLmhlbHBNb2RhbC5xdWVyeVNlbGVjdG9yKCcuaGVscC1jbG9zZScpXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmhpZGVIZWxwKCkpO1xuICAgIH1cblxuICAgIHNob3dIZWxwKCkge1xuICAgICAgICB0aGlzLmhlbHBNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIH1cblxuICAgIGhpZGVIZWxwKCkge1xuICAgICAgICB0aGlzLmhlbHBNb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIC8vIFV0aWxpdHkgZnVuY3Rpb25zXG4gICAgc2h1ZmZsZShhcnJheSkge1xuICAgICAgICBmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgY29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICAgICAgW2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuXG4gICAgcmVuZGVyQm94ZXMoKSB7XG4gICAgICAgIHRoaXMuYm94RGF0YS5sZWZ0LmZvckVhY2goKHsgaWQsIGxhYmVsIH0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJveCA9IHRoaXMuY3JlYXRlQm94KGlkLCBsYWJlbCwgXCJkcmFnXCIpO1xuICAgICAgICAgICAgdGhpcy5sZWZ0Q29sdW1uLmFwcGVuZENoaWxkKGJveCk7XG4gICAgICAgICAgICB0aGlzLmFsbEJveGVzLnB1c2goYm94KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5ib3hEYXRhLnJpZ2h0LmZvckVhY2goKHsgaWQsIGxhYmVsIH0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJveCA9IHRoaXMuY3JlYXRlQm94KGlkLCBsYWJlbCwgXCJkcm9wXCIpO1xuICAgICAgICAgICAgdGhpcy5yaWdodENvbHVtbi5hcHBlbmRDaGlsZChib3gpO1xuICAgICAgICAgICAgdGhpcy5hbGxCb3hlcy5wdXNoKGJveCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGltZ3MgPSBBcnJheS5mcm9tKHRoaXMud29ya3NwYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpKTtcbiAgICAgICAgaWYgKGltZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmJveGVzUmVuZGVyZWRSZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2FpdCBmb3IgYWxsIGltYWdlcyB0byBsb2FkIGJlZm9yZSByZXNvbHZpbmcgdGhlIHByb21pc2VcbiAgICAgICAgY29uc3QgaW1nUHJvbWlzZXMgPSBpbWdzLm1hcChpbWcgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpbWcuZGVjb2RlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGltZy5kZWNvZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbWcuY29tcGxldGUgJiYgaW1nLm5hdHVyYWxXaWR0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIFByb21pc2UuYWxsKGltZ1Byb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYm94ZXNSZW5kZXJlZFJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3JlYXRlQm94KGlkLCBsYWJlbCwgcm9sZSkge1xuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9ICdib3gnO1xuICAgICAgICBkaXYuZGF0YXNldC5pZCA9IGlkO1xuICAgICAgICBkaXYuZGF0YXNldC5yb2xlID0gcm9sZTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IGxhYmVsO1xuICAgICAgICBkaXYudGFiSW5kZXggPSAwO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ2J1dHRvbicpO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYCR7cm9sZSA9PT0gXCJkcmFnXCIgPyBcIkRyYWdnYWJsZVwiIDogXCJEcm9wcGFibGVcIn06ICR7bGFiZWx9YCk7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfVxuXG4gICAgZ2V0Q2VudGVyKGVsKSB7XG4gICAgICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy53b3Jrc3BhY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlbFJlY3QubGVmdCAtIGNvbnRhaW5lclJlY3QubGVmdCArIGVsUmVjdC53aWR0aCAvIDIsXG4gICAgICAgICAgICB5OiBlbFJlY3QudG9wIC0gY29udGFpbmVyUmVjdC50b3AgKyBlbFJlY3QuaGVpZ2h0IC8gMlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGdldFJpZ2h0Qm94Q2VudGVyKGVsKSB7XG4gICAgICAgIGNvbnN0IGVsUmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy53b3Jrc3BhY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBlbFJlY3QubGVmdCAtIGNvbnRhaW5lclJlY3QubGVmdCArIGVsUmVjdC53aWR0aCxcbiAgICAgICAgICAgIHk6IGVsUmVjdC50b3AgLSBjb250YWluZXJSZWN0LnRvcCArIGVsUmVjdC5oZWlnaHQgLyAyXG4gICAgICAgIH07XG4gICAgfVxuICAgIGdldExlZnRCb3hDZW50ZXIoZWwpIHtcbiAgICAgICAgY29uc3QgZWxSZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lclJlY3QgPSB0aGlzLndvcmtzcGFjZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IGVsUmVjdC5sZWZ0IC0gY29udGFpbmVyUmVjdC5sZWZ0LFxuICAgICAgICAgICAgeTogZWxSZWN0LnRvcCAtIGNvbnRhaW5lclJlY3QudG9wICsgZWxSZWN0LmhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjcmVhdGVMaW5lRWxlbWVudCh4MSwgeTEsIHgyLCB5Mikge1xuICAgICAgICBjb25zdCBsaW5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJsaW5lXCIpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcIngxXCIsIHgxKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCB5MSk7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgeDIpO1xuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHkyKTtcbiAgICAgICAgbGluZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpbmVcIik7XG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpOyAvLyBNYWtlIHRoZSBsaW5lIGZvY3VzYWJsZVxuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcImZvY3VzYWJsZVwiLCBcInRydWVcIik7IC8vIE1ha2UgdGhlIGxpbmUgZm9jdXNhYmxlXG4gICAgICAgIGxpbmUuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcImJ1dHRvblwiKTsgLy8gQWRkIEFSSUEgcm9sZSBmb3IgYWNjZXNzaWJpbGl0eVxuICAgICAgICBsaW5lLnNldEF0dHJpYnV0ZShcImFyaWEtbGFiZWxcIiwgXCJDb25uZWN0aW9uIGxpbmUuIFByZXNzIERlbGV0ZSB0byByZW1vdmUuXCIpOyAvLyBBZGQgQVJJQSBsYWJlbFxuXG5cbiAgICAgICAgbGluZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVMaW5lKGxpbmUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBsaW5lLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiRGVsZXRlXCIgfHwgZS5rZXkgPT09IFwiQmFja3NwYWNlXCIpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaW5lKGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbGluZTtcbiAgICB9XG5cbiAgICByZW1vdmVMaW5lKGxpbmUpIHtcbiAgICAgICAgdGhpcy5zdmcucmVtb3ZlQ2hpbGQobGluZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb25uZWN0aW9ucy5maW5kSW5kZXgoY29ubiA9PlxuICAgICAgICAgICAgKGNvbm4uZnJvbUJveCA9PT0gbGluZS5mcm9tQm94ICYmIGNvbm4udG9Cb3ggPT09IGxpbmUudG9Cb3gpIHx8XG4gICAgICAgICAgICAoY29ubi5mcm9tQm94ID09PSBsaW5lLnRvQm94ICYmIGNvbm4udG9Cb3ggPT09IGxpbmUuZnJvbUJveClcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgdGhpcy5jb25uZWN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbm5lY3Rpb25Nb2RlbCgpO1xuICAgIH1cblxuICAgIGlzQ29ubmVjdGVkKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbnMuc29tZShjb25uID0+XG4gICAgICAgICAgICAoY29ubi5mcm9tQm94ID09PSBhICYmIGNvbm4udG9Cb3ggPT09IGIpIHx8XG4gICAgICAgICAgICAoY29ubi5mcm9tQm94ID09PSBiICYmIGNvbm4udG9Cb3ggPT09IGEpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgY3JlYXRlUGVybWFuZW50TGluZShmcm9tQm94LCB0b0JveCkge1xuICAgICAgICBjb25zdCBmcm9tUm9sZSA9IGZyb21Cb3guZGF0YXNldC5yb2xlO1xuICAgICAgICBjb25zdCB0b1JvbGUgPSB0b0JveC5kYXRhc2V0LnJvbGU7XG5cbiAgICAgICAgaWYgKGZyb21Sb2xlID09PSB0b1JvbGUpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwiWW91IGNhbiBvbmx5IGNvbm5lY3QgYSBkcmFnZ2FibGUgdG8gYSBkcm9wcGFibGUuXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugc2hvdWxkIGFsd2F5cyBzdG9yZSBjb25uZWN0aW9ucyBhcyBkcmFnIHRvIGRyb3BcbiAgICAgICAgLy8gZXZlbiBpZiB0aGUgdXNlciBjb25uZWN0cyBkcm9wIHRvIGRyYWdcbiAgICAgICAgaWYgKGZyb21Cb3guZGF0YXNldC5yb2xlID09PSBcImRyb3BcIikge1xuICAgICAgICAgICAgW2Zyb21Cb3gsIHRvQm94XSA9IFt0b0JveCwgZnJvbUJveF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQoZnJvbUJveCwgdG9Cb3gpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZ2V0UmlnaHRCb3hDZW50ZXIoZnJvbUJveCk7XG4gICAgICAgIGNvbnN0IHRvID0gdGhpcy5nZXRMZWZ0Qm94Q2VudGVyKHRvQm94KTtcbiAgICAgICAgY29uc3QgbGluZSA9IHRoaXMuY3JlYXRlTGluZUVsZW1lbnQoZnJvbS54LCBmcm9tLnksIHRvLngsIHRvLnkpO1xuXG4gICAgICAgIGxpbmUuZnJvbUJveCA9IGZyb21Cb3g7XG4gICAgICAgIGxpbmUudG9Cb3ggPSB0b0JveDtcblxuICAgICAgICB0aGlzLnN2Zy5hcHBlbmRDaGlsZChsaW5lKTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5wdXNoKHsgZnJvbUJveCwgdG9Cb3gsIGxpbmUgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlQ29ubmVjdGlvbk1vZGVsKCk7XG4gICAgICAgIHRoaXMuaXNBbnN3ZXJlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHRoaXMuYXJpYUxpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuYXJpYUxpdmUudGV4dENvbnRlbnQgPSBgQ29ubmVjdGVkICR7ZnJvbUJveC50ZXh0Q29udGVudH0gdG8gJHt0b0JveC50ZXh0Q29udGVudH1gO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQ29ubmVjdGlvbk1vZGVsKCkge1xuICAgICAgICB0aGlzLmNvbm5MaXN0LmlubmVySFRNTCA9IFwiPHN0cm9uZz5Db25uZWN0aW9uczo8L3N0cm9uZz48YnI+XCI7XG4gICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaChjb25uID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZyb21MYWJlbCA9IGNvbm4uZnJvbUJveC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGxldCB0b0xhYmVsID0gY29ubi50b0JveC50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGlmICghdG9MYWJlbCkge1xuICAgICAgICAgICAgICAgIHRvTGFiZWwgPSBjb25uLnRvQm94LnF1ZXJ5U2VsZWN0b3IoXCJpbWdcIikuYWx0IC8vIGlubmVySFRNTCBwcmVzZXJ2ZXMgZXZlcnl0aGluZyBpbnNpZGUgPGxhYmVsPuKApjwvbGFiZWw+ICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgbGluZS5jbGFzc05hbWUgPSAnY29ubi1lbnRyeSc7XG4gICAgICAgICAgICBsaW5lLnRleHRDb250ZW50ID0gYCR7ZnJvbUxhYmVsfSDihpIgJHt0b0xhYmVsfWA7XG4gICAgICAgICAgICB0aGlzLmNvbm5MaXN0LmFwcGVuZENoaWxkKGxpbmUpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKlxuICAgICogVGhpcyBtZXRob2QgZ3JhZGVzIHRoZSBjb25uZWN0aW9ucyBtYWRlIGJ5IHRoZSB1c2VyLlxuICAgICogSXQgY2hlY2tzIHRoZSBjdXJyZW50IGFuc3dlciBhZ2FpbnN0IHRoZSBjb3JyZWN0IGFuc3dlcnMsXG4gICAgKiByZW5kZXJzIGZlZWRiYWNrLCBhbmQgbG9ncyB0aGUgY3VycmVudCBhbnN3ZXIuXG4gICAgKiBJdCBhbHNvIHVwZGF0ZXMgdGhlIGxvY2FsIHN0b3JhZ2Ugd2l0aCB0aGUgY3VycmVudCBzdGF0ZS5cbiAgICAqIEl0IGlzIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgXCJHcmFkZVwiIGJ1dHRvbi5cbiAgICAqL1xuICAgIGdyYWRlQ29ubmVjdGlvbnMoKSB7XG4gICAgICAgIHRoaXMuY2hlY2tDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgICAgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKCk7XG4gICAgfVxuXG4gICAgcmVzZXRDb25uZWN0aW9ucygpIHtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5mb3JFYWNoKGNvbm4gPT4ge1xuICAgICAgICAgICAgaWYgKGNvbm4ubGluZSAmJiBjb25uLmxpbmUucGFyZW50Tm9kZSA9PT0gdGhpcy5zdmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN2Zy5yZW1vdmVDaGlsZChjb25uLmxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5sZW5ndGggPSAwO1xuICAgICAgICB0aGlzLnVwZGF0ZUNvbm5lY3Rpb25Nb2RlbCgpO1xuICAgICAgICBpZiAodGhpcy5hcmlhTGl2ZSkgdGhpcy5hcmlhTGl2ZS50ZXh0Q29udGVudCA9IFwiQWxsIGNvbm5lY3Rpb25zIGhhdmUgYmVlbiBjbGVhcmVkLlwiO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCgge1xuICAgICAgICAgICAgZXZlbnQ6IFwibWF0Y2hpbmdfcmVzZXRcIixcbiAgICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICAgIGFjdDogXCJyZXNldCBhbGwgY29ubmVjdGlvbnNcIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXR0YWNoRXZlbnRzKCkge1xuICAgICAgICB0aGlzLmFsbEJveGVzLmZvckVhY2goYm94ID0+IHtcbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRCb3ggPSBib3g7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmdldFJpZ2h0Qm94Q2VudGVyKHRoaXMuc3RhcnRCb3gpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbXBMaW5lID0gdGhpcy5jcmVhdGVMaW5lRWxlbWVudChmcm9tLngsIGZyb20ueSwgZnJvbS54LCBmcm9tLnkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlbXBMaW5lLnNldEF0dHJpYnV0ZShcInN0cm9rZVwiLCBcImdyYXlcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVtcExpbmUuc2V0QXR0cmlidXRlKFwic3Ryb2tlLWRhc2hhcnJheVwiLCBcIjRcIik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3ZnLmFwcGVuZENoaWxkKHRoaXMudGVtcExpbmUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVybW92ZVwiLCB0aGlzLnVwZGF0ZVRlbXBMaW5lKTtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJ1cFwiLCB0aGlzLmZpbmlzaENvbm5lY3Rpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVudGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRCb3gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb3ggPSBib3g7XG4gICAgICAgICAgICAgICAgICAgICAgICBib3guY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJveCAhPT0gdGhpcy5zZWxlY3RlZEJveCkgdGhpcy5jcmVhdGVQZXJtYW5lbnRMaW5lKHRoaXMuc2VsZWN0ZWRCb3gsIGJveCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQm94LmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRCb3ggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gdGhpcy5hbGxCb3hlcy5pbmRleE9mKGJveCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0ID0gdGhpcy5hbGxCb3hlc1tjdXJyZW50SW5kZXggKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0KSBuZXh0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHRoaXMuYWxsQm94ZXNbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBib3guYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZW50ZXJcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbnMuZm9yRWFjaChjb25uID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbm4uZnJvbUJveCA9PT0gYm94IHx8IGNvbm4udG9Cb3ggPT09IGJveCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29ubi5saW5lLmNsYXNzTGlzdC5hZGQoXCJoaWdobGlnaHRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbm4ubGluZS5jbGFzc0xpc3QucmVtb3ZlKFwiZmFkZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uLmxpbmUuY2xhc3NMaXN0LmFkZChcImZhZGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29ubi5saW5lLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWdobGlnaHRlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGJveC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VsZWF2ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9ucy5mb3JFYWNoKGNvbm4gPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25uLmxpbmUuY2xhc3NMaXN0LnJlbW92ZShcImhpZ2hsaWdodGVkXCIsIFwiZmFkZWRcIik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25zLmZvckVhY2goY29ubiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZ2V0UmlnaHRCb3hDZW50ZXIoY29ubi5mcm9tQm94KTtcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IHRoaXMuZ2V0TGVmdEJveENlbnRlcihjb25uLnRvQm94KTtcbiAgICAgICAgICAgICAgICBjb25uLmxpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgZnJvbS54KTtcbiAgICAgICAgICAgICAgICBjb25uLmxpbmUuc2V0QXR0cmlidXRlKFwieTFcIiwgZnJvbS55KTtcbiAgICAgICAgICAgICAgICBjb25uLmxpbmUuc2V0QXR0cmlidXRlKFwieDJcIiwgdG8ueCk7XG4gICAgICAgICAgICAgICAgY29ubi5saW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHRvLnkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVwZGF0ZVRlbXBMaW5lID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAoIXRoaXMuc3RhcnRCb3ggfHwgIXRoaXMudGVtcExpbmUpIHJldHVybjtcbiAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMuZ2V0UmlnaHRCb3hDZW50ZXIodGhpcy5zdGFydEJveCk7XG4gICAgICAgIHRoaXMudGVtcExpbmUuc2V0QXR0cmlidXRlKFwieDFcIiwgZnJvbS54KTtcbiAgICAgICAgdGhpcy50ZW1wTGluZS5zZXRBdHRyaWJ1dGUoXCJ5MVwiLCBmcm9tLnkpO1xuICAgICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gdGhpcy53b3Jrc3BhY2UuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHggPSBlLmNsaWVudFggLSBjb250YWluZXJSZWN0LmxlZnQ7XG4gICAgICAgIGNvbnN0IHkgPSBlLmNsaWVudFkgLSBjb250YWluZXJSZWN0LnRvcDtcblxuICAgICAgICB0aGlzLnRlbXBMaW5lLnNldEF0dHJpYnV0ZShcIngyXCIsIHgpO1xuICAgICAgICB0aGlzLnRlbXBMaW5lLnNldEF0dHJpYnV0ZShcInkyXCIsIHkpO1xuICAgIH07XG5cbiAgICBmaW5pc2hDb25uZWN0aW9uID0gKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBpZiAodGhpcy50ZW1wTGluZSkge1xuICAgICAgICAgICAgdGhpcy5zdmcucmVtb3ZlQ2hpbGQodGhpcy50ZW1wTGluZSk7XG4gICAgICAgICAgICB0aGlzLnRlbXBMaW5lID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRoZSB0YXJnZXQgZWxlbWVudCBpcyB0aGUgZWxlbWVudCB1bmRlciB0aGUgcG9pbnRlclxuICAgICAgICAvLyB3aGVuIHRoZSBwb2ludGVyIGlzIHJlbGVhc2VkXG4gICAgICAgIC8vIHRoaXMgaXMgbm90IHRoZSBzYW1lIGFzIGUudGFyZ2V0IHdoaWNoIG1heSBiZSB0aGUgYm94IG9yIGl0IG1heSBiZSB0aGUgc3ZnIFxuICAgICAgICAvLyBvciBpdCBtYXkgYmUgdGhlIGxpbmUsIHNvIHdlIGRvIGl0IHRoaXMgd2F5IGluc3RlYWQgb2YgY2hlY2tpbmcgdG8gc2VlIGlmIHRoZSBib3ggY29udGFpbnNcbiAgICAgICAgLy8gZS50YXJnZXQuICBjb25zdCBlbmRCb3ggPSB0aGlzLmFsbEJveGVzLmZpbmQoYm94ID0+IGJveC5jb250YWlucyhlLnRhcmdldCkgJiYgYm94ICE9PSB0aGlzLnN0YXJ0Qm94KTtcbiAgICAgICAgY29uc3QgcG9pbnRYID0gZS5jbGllbnRYIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCk7XG4gICAgICAgIGNvbnN0IHBvaW50WSA9IGUuY2xpZW50WSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgICBjb25zdCB0YXJnZXRFbGVtZW50ID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludChwb2ludFgsIHBvaW50WSk7XG5cbiAgICAgICAgY29uc3QgZW5kQm94ID0gdGhpcy5hbGxCb3hlcy5maW5kKGJveCA9PlxuICAgICAgICAgICAgYm94LmNvbnRhaW5zKHRhcmdldEVsZW1lbnQpICYmIGJveCAhPT0gdGhpcy5zdGFydEJveFxuICAgICAgICApO1xuXG4gICAgICAgIGlmICh0aGlzLnN0YXJ0Qm94ICYmIGVuZEJveCkgdGhpcy5jcmVhdGVQZXJtYW5lbnRMaW5lKHRoaXMuc3RhcnRCb3gsIGVuZEJveCk7XG4gICAgICAgIC8vIFxuICAgICAgICBjb25zb2xlLmxvZyhgY29ubmVjdGVkICR7dGhpcy5zdGFydEJveC5kYXRhc2V0LmlkID8gdGhpcy5zdGFydEJveC5kYXRhc2V0LmlkIDogXCJudWxsXCJ9IHRvICR7ZW5kQm94LmRhdGFzZXQuaWQgPyBlbmRCb3guZGF0YXNldC5pZCA6IFwibnVsbFwifWApO1xuICAgICAgICB0aGlzLmxvZ0Jvb2tFdmVudCgge1xuICAgICAgICAgICAgZXZlbnQ6IFwibWF0Y2hpbmdfY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgZGl2X2lkOiB0aGlzLmRpdmlkLFxuICAgICAgICAgICAgYWN0OiBgY29ubmVjdGVkICR7dGhpcy5zdGFydEJveC5kYXRhc2V0LmlkID8gdGhpcy5zdGFydEJveC5kYXRhc2V0LmlkIDogXCJudWxsXCJ9IHRvICR7ZW5kQm94LmRhdGFzZXQuaWQgPyBlbmRCb3guZGF0YXNldC5pZCA6IFwibnVsbFwifWAsXG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnN0YXJ0Qm94ID0gbnVsbDtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJtb3ZlXCIsIHRoaXMudXBkYXRlVGVtcExpbmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcnVwXCIsIHRoaXMuZmluaXNoQ29ubmVjdGlvbik7XG4gICAgfVxufVxuXG5cblxuXG4vLyBSZWdpc3RlciB0aGUgY29tcG9uZW50IHdpdGggUnVuZXN0b25lIFxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInJ1bmVzdG9uZTpsb2dpbi1jb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50PVwibWF0Y2hpbmdcIl0nKS5mb3JFYWNoKGNvbnRhaW5lciA9PiB7XG4gICAgICAgIGlmICghY29udGFpbmVyLmNsb3Nlc3QoXCJbZGF0YS1jb21wb25lbnQ9dGltZWRBc3Nlc3NtZW50XVwiKSkge1xuICAgICAgICAgICAgbGV0IG9wdHMgPSB7IG9yaWc6IGNvbnRhaW5lciB9XG4gICAgICAgICAgICB3aW5kb3cuY29tcG9uZW50TWFwW2NvbnRhaW5lci5pZF0gPSBuZXcgTWF0Y2hpbmdQcm9ibGVtKG9wdHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuLy8gQWRkIGNvbXBvbmVudCBmYWN0b3J5IGluaXRpYWxpemF0aW9uXG5pZiAodHlwZW9mIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHdpbmRvdy5jb21wb25lbnRfZmFjdG9yeSA9IHt9O1xufVxuXG53aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkubWF0Y2hpbmcgPSBmdW5jdGlvbiAob3B0cykge1xuICAgIHJldHVybiBuZXcgTWF0Y2hpbmdQcm9ibGVtKG9wdHMpO1xufTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=