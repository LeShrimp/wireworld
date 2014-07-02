/**
 * Created by maxime on 6/22/14.
 */


/**
 *
 * @constructor
 */
var WireworldGame = function () {
    this.blueprintBoxElement = null;
    this.circuitBoardCanvas = null;
    //this.playButton = null;

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
                        var blueprint = bbe.selectedBlueprint;
                        var wireworld = bbe.selectedBlueprint.wireworld;
                        placementPos = {
                            i: mousePos.i-Math.floor(wireworld.columns/2),
                            j: mousePos.j-Math.floor(wireworld.rows/2)
                        };
                        cbc.draw();
                        isLegal = cb.isPlacementLegal(placementPos.i, placementPos.j, blueprint);
                        cbc.drawWireworld(placementPos.i, placementPos.j, wireworld, isLegal ? 'green' : 'red');
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
            var generation;

            var simulationStep = function() {
                    that.printedWireworldCanvas.wireworld.doStep();
                    that.wireworldRules.update(that.printedWireworldCanvas.wireworld);
                    that.printedWireworldCanvas.draw();

                    if (that.wireworldRules.isSuccess()) {
                        alert("Success!");
                        that.setMode(WireworldGame.SELECTION_MODE);
                    }
                    if (that.wireworldRules.isFail()) {
                        alert("Fail!");
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

        var selectionChange = function(blueprint) {
            if (blueprint.count) {
                that.setMode(WireworldGame.PLACEMENT_MODE);
            } else {
                that.setMode(WireworldGame.SELECTION_MODE);
            }
        };

        var cbHtmlEl = this.circuitBoardCanvas.htmlCanvasElement;
        switch (mode) {
            case WireworldGame.PLACEMENT_MODE:
                SimulationListeners.onSimulationStop();
                that.blueprintBoxElement.onSelectionChange(selectionChange);
                cbHtmlEl.removeEventListener('mousemove', cbcSelectionListeners.onMouseMove);
                cbHtmlEl.removeEventListener('mousedown', cbcSelectionListeners.onMouseDown);
                cbHtmlEl.addEventListener('mousemove', cbcPlacementListeners.onMouseMove);
                cbHtmlEl.addEventListener('mousedown', cbcPlacementListeners.onMouseDown);
                break;

            case WireworldGame.SELECTION_MODE:
                SimulationListeners.onSimulationStop();
                that.blueprintBoxElement.onSelectionChange(selectionChange);
                cbHtmlEl.removeEventListener('mousemove', cbcPlacementListeners.onMouseMove);
                cbHtmlEl.removeEventListener('mousedown', cbcPlacementListeners.onMouseDown);
                cbHtmlEl.addEventListener('mousemove', cbcSelectionListeners.onMouseMove);
                cbHtmlEl.addEventListener('mousedown', cbcSelectionListeners.onMouseDown);
                break;

            case WireworldGame.EXECUTION_MODE:
                that.blueprintBoxElement.onSelectionChange(function() {});
                cbHtmlEl.removeEventListener('mousemove', cbcSelectionListeners.onMouseMove);
                cbHtmlEl.removeEventListener('mousedown', cbcSelectionListeners.onMouseDown);
                cbHtmlEl.removeEventListener('mousemove', cbcPlacementListeners.onMouseMove);
                cbHtmlEl.removeEventListener('mousedown', cbcPlacementListeners.onMouseDown);
                SimulationListeners.onSimulationStart();
                break;
        }

        this.currentMode = mode;
        this.circuitBoardCanvas.draw();
    };
})();


WireworldGame.prototype.loadLevel = function() {};


WireworldGame.prototype.init = function () {
    var cells = transpose([
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,4,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]);

    this.wireworldRules = new WireworldRules([
        {
            "coordinates" : {"i" : 20, "j" : 14},
            "generation" : {"from":0, "to":25},
            "must_not" : Wireworld.WW_EHEAD
    }, {
            "coordinates" : {"i" : 20, "j" : 2},
            "generation" : {"from":0, "to":25},
            "must" : Wireworld.WW_EHEAD
    }]);

    var cb = new CircuitBoard(cells);

    var circuit1 =  new Wireworld(transpose([
        [1]
    ]));
    var circuit2 =  new Wireworld(transpose([
        [0,0,0],
        [1,1,1],
        [0,2,0],
        [0,1,0]
    ]));

    var circuit3 =  new Wireworld(transpose([
        [0,1,0],
        [1,1,1],
        [0,1,0],
        [0,1,0]
    ]));

    var cbox = new BlueprintBox();
    cbox.addBlueprint(circuit1, 99);
    cbox.addBlueprint(circuit2, 6);
    cbox.addBlueprint(circuit3, 26);

    var circuitBoardCanvasElement = document.getElementById('circuitboard');
    var cellwidth = circuitBoardCanvasElement.width / cb.columns;
    this.circuitBoardCanvas = new CircuitBoardCanvas(cb, circuitBoardCanvasElement, cellwidth);
    this.circuitBoardCanvas.draw();

    var htmlElement = document.getElementById('blueprintbox');
    this.blueprintBoxElement = new BlueprintBoxElement(cbox, htmlElement, cellwidth);

    var that = this;
    var o = (function() {
        return {
            play: function() {
                that.setMode(WireworldGame.EXECUTION_MODE);
            },
            pause: function() {
                that.setMode(WireworldGame.SELECTION_MODE);
            }
        }
    })();

    this.playPauseElement = new PlayPauseElement(document.getElementById('playpause'), o.play, o.pause);

    this.setMode(WireworldGame.SELECTION_MODE);
};
