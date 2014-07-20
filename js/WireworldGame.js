/**
 * Created by maxime on 6/22/14.
 * @requires WireworldLevelData.js
 */


/**
 *
 * @constructor
 */
var WireworldGame = function () {
    this.blueprintBoxElement = null;
    this.circuitBoardCanvas = null;
    this.playStopElement = null;

    this.printedWireworldCanvas = null;

    this.currentMode = null;
    this.wireworldRules = null;

    this._intervalId  = null;
};


WireworldGame.PLACEMENT_MODE = 0;
WireworldGame.SELECTION_MODE = 1;
WireworldGame.EXECUTION_MODE = 2;


WireworldGame.prototype.setMode = (function() {
    var cbcPlacementListeners = null;
    var cbcSelectionListeners = null;

    return function(mode) {
        var that = this;
        if (cbcPlacementListeners == null) {
            cbcPlacementListeners = (function() {
                var cbc = that.circuitBoardCanvas;
                var cb = cbc.circuitBoard;
                var bbe = that.blueprintBoxElement;
                var placementPos = {i:0, j:0};
                var isLegal = true;

                return {
                    onMouseMove: function (event) {
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
                        if (event.button == 0 && isLegal) {
                            if (bbe.decCount(bbe.selectedBlueprint)) {
                                cb.placeCircuit(placementPos.i, placementPos.j, bbe.selectedBlueprint);
                            }
                            if (bbe.selectedBlueprint.count == 0) {
                                that.setMode(WireworldGame.SELECTION_MODE);
                            }
                        } else if (event.button == 2) {
                            that.setMode(WireworldGame.SELECTION_MODE);
                        }
                    }
                };
            })();
        }
        if (cbcSelectionListeners == null) {
            cbcSelectionListeners = (function()
            {
                var bbe = that.blueprintBoxElement;
                var cbc = that.circuitBoardCanvas;
                var cb = cbc.circuitBoard;

                return {
                    onMouseMove: function (event) {
                        var pos = cbc.getPosFromMouseEvent(event);
                        if (cbc.highlightedCircuit != cb.getCircuitAtPos(pos.i, pos.j)) {
                            cbc.highlightedCircuit = cb.getCircuitAtPos(pos.i, pos.j);
                            cbc.draw();
                        }
                        console.log(pos.i + ', ' + pos.j + '\n');
                    },

                    onMouseDown: function (event) {
                        var pos = cbc.getPosFromMouseEvent(event);
                        var circuit = cb.getCircuitAtPos(pos.i, pos.j);
                        if (circuit != null) {
                            cb.removeCircuit(circuit);
                            bbe.incCount(circuit.blueprint);

                            if (event.button == 0) {
                                bbe.selectBlueprint(circuit.blueprint);
                                cbcPlacementListeners.onMouseMove(event); //TODO: Think of better solution
                            } else {
                                cbcSelectionListeners.onMouseMove(event); //TODO: see above
                            }
                        }
                    }
                }
            })();
        }

        var SimulationListeners = (function() {
            var simulationStep = function() {
                    that.printedWireworldCanvas.wireworld.doStep();
                    that.wireworldRules.update(that.printedWireworldCanvas.wireworld);
                    that.printedWireworldCanvas.draw();

                    if (that.wireworldRules.isSuccess()) {
                        alert("Success!");
                        that.wireworldRules.reset();
                        that.playStopElement.onStop();
                        that.setMode(WireworldGame.SELECTION_MODE);
                    }
                    if (that.wireworldRules.isFail()) {
                        alert("Fail!");
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
                    if (that._intervalId != null) {
                        clearInterval(that._intervalId);
                        that._intervalId = null;
                        var pwcHtmlEl = that.printedWireworldCanvas.htmlCanvasElement;
                        pwcHtmlEl.parentNode.replaceChild(that.circuitBoardCanvas.htmlCanvasElement, pwcHtmlEl);
                    }

                    that.printedWireworldCanvas = null;
                }
            }
        })();

        var bbeSelectionChange = function(blueprint) {
            if (blueprint.count) {
                that.setMode(WireworldGame.PLACEMENT_MODE);
            } else {
                that.setMode(WireworldGame.SELECTION_MODE);
            }
        };

        var cbcEl = this.circuitBoardCanvas.htmlCanvasElement;
        switch (mode) {
            case WireworldGame.PLACEMENT_MODE:
                SimulationListeners.onSimulationStop();
                that.blueprintBoxElement.onSelectionChange(bbeSelectionChange);
                cbcEl.removeEventListener('mousemove', cbcSelectionListeners.onMouseMove);
                cbcEl.removeEventListener('mousedown', cbcSelectionListeners.onMouseDown);
                cbcEl.addEventListener('mousemove', cbcPlacementListeners.onMouseMove);
                cbcEl.addEventListener('mousedown', cbcPlacementListeners.onMouseDown);
                break;

            case WireworldGame.SELECTION_MODE:
                SimulationListeners.onSimulationStop();
                that.blueprintBoxElement.onSelectionChange(bbeSelectionChange);
                cbcEl.removeEventListener('mousemove', cbcPlacementListeners.onMouseMove);
                cbcEl.removeEventListener('mousedown', cbcPlacementListeners.onMouseDown);
                cbcEl.addEventListener('mousemove', cbcSelectionListeners.onMouseMove);
                cbcEl.addEventListener('mousedown', cbcSelectionListeners.onMouseDown);
                break;

            case WireworldGame.EXECUTION_MODE:
                that.blueprintBoxElement.onSelectionChange(function() {});
                cbcEl.removeEventListener('mousemove', cbcSelectionListeners.onMouseMove);
                cbcEl.removeEventListener('mousedown', cbcSelectionListeners.onMouseDown);
                cbcEl.removeEventListener('mousemove', cbcPlacementListeners.onMouseMove);
                cbcEl.removeEventListener('mousedown', cbcPlacementListeners.onMouseDown);
                SimulationListeners.onSimulationStart();
                break;
        }

        this.currentMode = mode;
        this.circuitBoardCanvas.draw();
    };
})();


WireworldGame.prototype.loadLevel = function (levelName) {
    //load leveldata
    var level = WireworldLevelData.getLevel(levelName);

    //Set rules
    this.wireworldRules = new WireworldRules(level.rules);

    //Setup CircuitBoard
    var cb = new CircuitBoard(transpose(level.cells));
    var circuitBoardCanvasElement = document.getElementById('circuitboard');
    var cellwidth = circuitBoardCanvasElement.width / cb.columns;
    this.circuitBoardCanvas = new CircuitBoardCanvas(cb, circuitBoardCanvasElement, cellwidth);
    this.circuitBoardCanvas.draw();

    //Setup Blueprintbox
    var cbox = new BlueprintBox();
    for (var i in level.blueprints) {
        var wireworld = new Wireworld(transpose(level.blueprints[i].cells));
        cbox.addBlueprint(wireworld, level.blueprints[i].count, ''+i);
    }
    var htmlElement = document.getElementById('blueprintbox');
    this.blueprintBoxElement = new BlueprintBoxElement(cbox, htmlElement, cellwidth);

    //Setup Play/Stop Button
    var that = this;
    var playStopNode = document.getElementById('playstop');
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
        playStopNode,
        playStopListeners.onPlay,
        playStopListeners.onStop
    );

    //Set message
    var messageBoxElement = document.getElementById('messagebox');
    pEl = document.createElement('p');
    pEl.appendChild(document.createTextNode(level.message));
    messageBoxElement.appendChild(pEl);

    //Start game
    this.setMode(WireworldGame.SELECTION_MODE);
};
