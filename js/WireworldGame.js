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

    //These will be set in loadLevel, which is also the function which starts the game
    this.blueprintBoxElement = null;
    this.circuitBoardCanvas = null;
    this.playStopElement = null;

    this.printedWireworldCanvas = null;

    this.currentMode = null;
    this.wireworldRules = null;

    this.msBetweenSteps = null;

    //Define the actionlisteners for the different modes and elements.

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
            var wwc = that.printedWireworldCanvas;
            var ww = wwc.wireworld;
            var rules = that.wireworldRules;

            ww.doStep();
            rules.update(ww);

            wwc.draw();

            if (rules.isSuccess()) {
                that.playStopElement.onStop();
                rules.reset();
                that.onWin();
            } else if (rules.isFail()) {
                that.playStopElement.onStop();
                rules.reset();
                that.onFail();
            } else {
                console.log('Generation: ' + ww.generation);
            }
        };

        var intervalId = null;
        return {
            onSimulationStart : function() {
                var cbHtmlEl = that.circuitBoardCanvas.htmlCanvasElement;
                that.printedWireworldCanvas = that.circuitBoardCanvas.createPrintCanvas('printedwireworld');
                cbHtmlEl.parentNode.replaceChild(that.printedWireworldCanvas.htmlCanvasElement, cbHtmlEl);
                that.printedWireworldCanvas.draw();
                intervalId = setInterval(simulationStep, that.msBetweenSteps);
            },
            onSimulationStop : function () {
                if (intervalId !== null) {
                    clearInterval(intervalId);
                    intervalId = null;
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

    this.playStopListeners = {
        onPlay: function() {
            that.setMode(WireworldGame.EXECUTION_MODE);
            this.setText('Stop');
        },
        onStop: function() {
            that.setMode(WireworldGame.SELECTION_MODE);
            this.setText('Play');
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

    //Set time between automaton steps
    this.msBetweenSteps = Math.ceil(6000/this.circuitBoardCanvas.wireworld.columns);

    //Setup Blueprintbox
    var cbox = new BlueprintBox();
    for (var i in level.blueprints) {
        var cells = level.blueprints[i].cells;
        var count = level.blueprints[i].count;
        var tip   = defaultsTo(level.blueprints[i].tip, '');

        cbox.addBlueprint(
            new Wireworld(transpose(cells)),
            count,
            tip
        );
    }
    var cboxEl = getClearedElementById('blueprintbox');
    this.blueprintBoxElement = new BlueprintBoxElement(cbox, cboxEl, cellwidth);

    //Setup Play/Stop Button
    var that = this;
    var psEl = getClearedElementById('playstop');
    this.playStopElement = new PlayStopElement(
        psEl,
        this.playStopListeners.onPlay,
        this.playStopListeners.onStop
    );

    //Set message
    var mbEl = getClearedElementById('messagebox');
    var pEl = document.createElement('p');
    pEl.innerHTML = level.message;
    mbEl.appendChild(pEl);

    //Start game
    this.setMode(WireworldGame.SELECTION_MODE);
};

