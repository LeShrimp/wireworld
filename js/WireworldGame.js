/**
 * Created by maxime on 6/22/14.
 * @requires WireworldLevelData.js
 */

/**
 *
 * @constructor
 */
var WireworldGame = function () {
    var that = this;

    this.blueprintBoxElement = null;
    this.circuitBoardCanvas = null;
    this.playStopElement = null;

    this.printedWireworldCanvas = null;

    this.currentMode = null;
    this.wireworldRules = null;

    this._intervalId  = null;

    //Define the actionlisteners for the different modes.

    //In placement mode the player has selected a circuit and can place it with a left click
    this.cbcPlacementListeners = (function() {
        var placementPos = {i:0, j:0};
        var isLegal = true;

        return {
            onMouseMove: function (event) {
                var cbc = that.circuitBoardCanvas;
                var cb = cbc.circuitBoard;
                var bbe = that.blueprintBoxElement;
                var mousePos = cbc.getPosFromMouseEvent(event);
                var newPlacementPos = {
                    i: mousePos.i-Math.floor(bbe.selectedBlueprint.wireworld.columns/2),
                    j: mousePos.j-Math.floor(bbe.selectedBlueprint.wireworld.rows/2)
                };
                if (newPlacementPos.i != placementPos.i || newPlacementPos.j != placementPos.j) {
                    placementPos = newPlacementPos;
                    cbc.draw();
                }
                isLegal = cb.isPlacementLegal(
                    placementPos.i,
                    placementPos.j,
                    bbe.selectedBlueprint,
                    bbe.selectedBlueprint.wireworld
                );
                cbc.drawWireworld(
                    placementPos.i,
                    placementPos.j,
                    bbe.selectedBlueprint.wireworld,
                    isLegal ? 'green' : 'red'
                );
            },

            onMouseDown: function (event) {
                var cbc = that.circuitBoardCanvas;
                var cb = cbc.circuitBoard;
                var bbe = that.blueprintBoxElement;
                if (event.button === 0 && isLegal) {
                    if (bbe.decCount(bbe.selectedBlueprint)) {
                        cb.placeCircuit(placementPos.i, placementPos.j, bbe.selectedBlueprint);
                    }
                    if (bbe.selectedBlueprint.count === 0) {
                        that.setMode(WireworldGame.SELECTION_MODE);
                    }
                } else if (event.button == 2) {
                    that.setMode(WireworldGame.SELECTION_MODE);
                }
            }
        };
    })();

    //In Selection mode the player can select placed circuits
    this.cbcSelectionListeners = (function()
    {
        return {
            onMouseMove: function (event) {
                var bbe = that.blueprintBoxElement;
                var cbc = that.circuitBoardCanvas;
                var cb = cbc.circuitBoard;

                var pos = cbc.getPosFromMouseEvent(event);
                if (cbc.highlightedCircuit != cb.getCircuitAtPos(pos.i, pos.j)) {
                    cbc.highlightedCircuit = cb.getCircuitAtPos(pos.i, pos.j);
                    cbc.draw();
                }
                console.log(pos.i + ', ' + pos.j + '\n');
            },

            onMouseDown: function (event) {
                var bbe = that.blueprintBoxElement;
                var cbc = that.circuitBoardCanvas;
                var cb = cbc.circuitBoard;

                var pos = cbc.getPosFromMouseEvent(event);
                var circuit = cb.getCircuitAtPos(pos.i, pos.j);
                if (circuit !== null) {
                    cb.removeCircuit(circuit);
                    bbe.incCount(circuit.blueprint);

                    if (event.button === 0) {
                        bbe.selectBlueprint(circuit.blueprint);
                        that.cbcPlacementListeners.onMouseMove(event); //TODO: Think of better solution
                    } else {
                        that.cbcSelectionListeners.onMouseMove(event); //TODO: see above
                    }
                }
            }
        };
    })();

    //In simulation mode we have to simulate the printed wireworld step by step
    this.SimulationListeners = (function() {
        var simulationStep = function() {
            that.printedWireworldCanvas.wireworld.doStep();
            that.wireworldRules.update(that.printedWireworldCanvas.wireworld);
            that.printedWireworldCanvas.draw();

            if (that.wireworldRules.isSuccess()) {
                setTimeout(that.onWin, 1000);
                that.wireworldRules.reset();
                that.playStopElement.onStop();
                that.setMode(WireworldGame.SELECTION_MODE);
            }
            if (that.wireworldRules.isFail()) {
                setTimeout(that.onFail, 1000);
                that.wireworldRules.reset();
                that.playStopElement.onStop();
                that.setMode(WireworldGame.SELECTION_MODE);
            }

            console.log(that.printedWireworldCanvas.wireworld.generation);
        };

        return {
            onSimulationStart : function() {
                var cbHtmlEl = that.circuitBoardCanvas.htmlCanvasElement;
                that.printedWireworldCanvas = that.circuitBoardCanvas.createPrintCanvas('printedwireworld');
                cbHtmlEl.parentNode.replaceChild(that.printedWireworldCanvas.htmlCanvasElement, cbHtmlEl);
                that.printedWireworldCanvas.draw();
                that._intervalId = setInterval(simulationStep, 200);
            },
            onSimulationStop : function () {
                if (that._intervalId !== null) {
                    clearInterval(that._intervalId);
                    that._intervalId = null;
                    var pwcHtmlEl = that.printedWireworldCanvas.htmlCanvasElement;
                    pwcHtmlEl.parentNode.replaceChild(that.circuitBoardCanvas.htmlCanvasElement, pwcHtmlEl);
                }

                that.printedWireworldCanvas = null;
            }
        };
    })();

    this.bbeSelectionChange = function(blueprint) {
        if (blueprint.count) {
            that.setMode(WireworldGame.PLACEMENT_MODE);
        } else {
            that.setMode(WireworldGame.SELECTION_MODE);
        }
    };
};


WireworldGame.PLACEMENT_MODE = 0;
WireworldGame.SELECTION_MODE = 1;
WireworldGame.EXECUTION_MODE = 2;


WireworldGame.prototype.setMode = function(mode) {
    var cbcEl = this.circuitBoardCanvas.htmlCanvasElement;

    switch (mode) {
        case WireworldGame.PLACEMENT_MODE:
            this.SimulationListeners.onSimulationStop();
            this.blueprintBoxElement.onSelectionChange(this.bbeSelectionChange);
            cbcEl.removeEventListener('mousemove', this.cbcSelectionListeners.onMouseMove);
            cbcEl.removeEventListener('mousedown', this.cbcSelectionListeners.onMouseDown);
            cbcEl.addEventListener('mousemove', this.cbcPlacementListeners.onMouseMove);
            cbcEl.addEventListener('mousedown', this.cbcPlacementListeners.onMouseDown);
            break;

        case WireworldGame.SELECTION_MODE:
            this.SimulationListeners.onSimulationStop();
            this.blueprintBoxElement.onSelectionChange(this.bbeSelectionChange);
            cbcEl.removeEventListener('mousemove', this.cbcPlacementListeners.onMouseMove);
            cbcEl.removeEventListener('mousedown', this.cbcPlacementListeners.onMouseDown);
            cbcEl.addEventListener('mousemove', this.cbcSelectionListeners.onMouseMove);
            cbcEl.addEventListener('mousedown', this.cbcSelectionListeners.onMouseDown);
            break;

        case WireworldGame.EXECUTION_MODE:
            this.blueprintBoxElement.onSelectionChange(function() {});
            cbcEl.removeEventListener('mousemove', this.cbcSelectionListeners.onMouseMove);
            cbcEl.removeEventListener('mousedown', this.cbcSelectionListeners.onMouseDown);
            cbcEl.removeEventListener('mousemove', this.cbcPlacementListeners.onMouseMove);
            cbcEl.removeEventListener('mousedown', this.cbcPlacementListeners.onMouseDown);
            this.SimulationListeners.onSimulationStart();
            break;
    }

    this.currentMode = mode;
    this.circuitBoardCanvas.draw();
};

WireworldGame.prototype.loadLevel = function (levelName, onWin, onFail) {
    this.onWin = onWin;
    this.onFail = onFail;
    //load leveldata
    var level = WireworldLevelData.getLevel(levelName);

    //Set rules
    this.wireworldRules = new WireworldRules(level.rules);

    //Setup CircuitBoard
    var cbEl = getClearedElementById('circuitboard');
    var cb = new CircuitBoard(transpose(level.cells));
    var cellwidth = cbEl.width / cb.columns;
    this.circuitBoardCanvas = new CircuitBoardCanvas(cb, cbEl, cellwidth);
    this.circuitBoardCanvas.draw();

    //Setup Blueprintbox
    var cbox = new BlueprintBox();
    for (var i in level.blueprints) {
        var wireworld = new Wireworld(transpose(level.blueprints[i].cells));
        cbox.addBlueprint(wireworld, level.blueprints[i].count, ''+i);
    }
    var cboxEl = getClearedElementById('blueprintbox');
    this.blueprintBoxElement = new BlueprintBoxElement(cbox, cboxEl, cellwidth);

    //Setup Play/Stop Button
    var that = this;
    var psEl = getClearedElementById('playstop');
    var playStopListeners = {
        onPlay: function() {
            that.setMode(WireworldGame.EXECUTION_MODE);
            this.setText('Stop');
        },
        onStop: function() {
            that.setMode(WireworldGame.SELECTION_MODE);
            this.setText('Play');
        }
    };
    this.playStopElement = new PlayStopElement(
        psEl,
        playStopListeners.onPlay,
        playStopListeners.onStop
    );

    //Set message
    var mbEl = getClearedElementById('messagebox');
    var pEl = document.createElement('p');
    pEl.appendChild(document.createTextNode(level.message));
    mbEl.appendChild(pEl);

    //Start game
    this.setMode(WireworldGame.SELECTION_MODE);
};
