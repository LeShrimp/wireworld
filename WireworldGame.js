/**
 * Created by maxime on 6/22/14.
 */


/**
 *
 * @constructor
 */
var WireworldGame = function () {
    this.circuitBoxElement = null;
    this.circuitBoardCanvas = null;
    //this.playButton = null;

    this.htmlContainerElement = null;

    this.currentMode = null;
};


WireworldGame.PLACEMENT_MODE = 0;
WireworldGame.SELECTION_MODE = 1;
WireworldGame.EXECUTION_MODE = 1;


WireworldGame.prototype.setMode = function(mode) {
    var that = this;
    var cbcSelectionListener = function (event) {
        var cbc = that.circuitBoardCanvas;
        var cb = cbc.circuitBoard;

        var pos = cbc.getPosFromMouseEvent(event);
        console.log(pos.i + ', ' + pos.j);
        if (cbc.highlightedCircuitId != cb.getCircuitAtPos(pos.i, pos.j)) {
            cbc.highlightedCircuitId = cb.getCircuitAtPos(pos.i, pos.j)
            cbc.draw();
        }
    };

    var cbcPlacementListeners = (function() {
        var cbc = that.circuitBoardCanvas;
        var cb = cbc.circuitBoard;
        var cbox = that.circuitBoxElement;
        var mousePos = {i:0, j:0};
        var placementPos = {i:0, j:0};
        var isLegal = true;

        return {
            onMousemove: function (event) {
                var mousePos = cbc.getPosFromMouseEvent(event);
                var circuit = cbox.getCircuitWireworld(cbox.selectedCircuitId);
                placementPos = {
                    i: mousePos.i-Math.floor(circuit.columns/2),
                    j: mousePos.j-Math.floor(circuit.rows/2)
                };
                cbc.draw();
                isLegal = cb.isPlacementLegal(placementPos.i, placementPos.j, circuit);
                cbc.drawCircuit(placementPos.i, placementPos.j, circuit, true, isLegal);
            },

            onMouseDown: function (event) {
                if (event.button == 0 && isLegal) {
                    cb.placeCircuit(placementPos.i, placementPos.j, cbox.getCircuitWireworld(cbox.selectedCircuitId));
                } else if (event.button == 2) {
                    that.setMode(WireworldGame.SELECTION_MODE);
                }
            }
        };
    })();

    switch (mode) {
        case WireworldGame.PLACEMENT_MODE:
            this.circuitBoardCanvas.htmlCanvasElement.addEventListener('mousemove', cbcPlacementListeners.onMousemove);
            this.circuitBoardCanvas.htmlCanvasElement.addEventListener('mousedown', cbcPlacementListeners.onMouseDown);
            break;

        case WireworldGame.SELECTION_MODE:
            this.circuitBoardCanvas.htmlCanvasElement.removeEventListener('mousemove', cbcPlacementListeners.onMousemove);
            this.circuitBoardCanvas.htmlCanvasElement.removeEventListener('mousedown', cbcPlacementListeners.onMouseDown);
            this.circuitBoardCanvas.htmlCanvasElement.addEventListener('mousemove', cbcSelectionListener);
            break;
    }

    this.currentMode = mode;
};


WireworldGame.prototype.init = function () {
    var cells = [];
    for (var i=0; i<30; i++) {
        cells[i] = [];
        for (var j=0; j<20; j++) {
            var r = Math.floor(Math.random()*80);
            switch (r) {
                case 0:
                case 1:
                case 2:
                case 4:
                case 5:
                    cells[i][j] = CircuitBoard.WW_EMPTY;
                    break;

                case 6:
                case 7:
                    cells[i][j] = 2;
                    break;

                case 8:
                    cells[i][j] = 3;
                    break;

                default:
                    cells[i][j] = CircuitBoard.WW_EMPTY;
                    break;
            }
        }
    }

    var cb = new CircuitBoard(cells);
    var circuit = new Wireworld([[2,2,2],[2,2,2],[2,2,2]]);
    cb.placeCircuit(2,2,circuit);

    var circuit1 =  new Wireworld(transpose([
        [0,0,0,0,0,0],
        [1,1,1,2,1,1],
        [0,1,0,0,0,0],
        [0,1,0,0,0,0]
    ]));
    var circuit2 =  new Wireworld(transpose([
        [0,0,0],
        [1,1,1],
        [0,1,2],
        [0,1,2]
    ]));

    var circuit3 =  new Wireworld(transpose([
        [0,0,0],
        [1,1,1],
        [0,1,2],
        [0,1,2]
    ]));

    var cbox = new CircuitBox();
    cbox.addCircuit(circuit1, 3);
    cbox.addCircuit(circuit2, 6);
    cbox.addCircuit(circuit3, 26);

    var htmlCanvasElement = document.getElementById('circuitboard');
    var cellwidth = htmlCanvasElement.width / cb.columns;
    this.circuitBoardCanvas = new CircuitBoardCanvas(cb, htmlCanvasElement, cellwidth);
    this.circuitBoardCanvas.draw();

    var htmlElement = document.getElementById('circuitbox');
    var selectionChanges = function(circuitId) { that.setMode(WireworldGame.PLACEMENT_MODE); };
    this.circuitBoxElement = new CircuitBoxElement(cbox, htmlElement, cellwidth, selectionChanges);

    var that = this;
    var o = (function() {
        var intervalId;
        var doStep = function() {
            that.circuitBoardCanvas.circuitBoard.doStep();
            that.circuitBoardCanvas.draw();
        }
        return {
            play: function() {
                intervalId = setInterval(doStep, 500);
            },
            pause: function() {
                clearInterval(intervalId);
            }
        }
    })();

    this.playPauseElement = new PlayPauseElement(document.getElementById('playpause'), o.play, o.pause);
};
