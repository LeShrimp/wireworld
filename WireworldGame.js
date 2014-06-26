/**
 * Created by maxime on 6/22/14.
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

    var cbcPlacementListener = function (event) {
        var cbc = that.circuitBoardCanvas;
        var cb = cbc.circuitBoard;

        //TODO: Here I stopped
    };

    switch (mode) {
        case WireworldGame.PLACEMENT_MODE:
            this.circuitBoardCanvas.htmlCanvasElement.addEventListener('mousemove', cbcPlacementListener);
            break;

        case WireworldGame.SELECTION_MODE:
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
                    cells[i][j] = 1;
                    break;

                case 6:
                case 7:
                    cells[i][j] = 2;
                    break;

                case 8:
                    cells[i][j] = 3;
                    break;

                default:
                    cells[i][j] = 0;
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
    this.circuitBoxElement = new CircuitBoxElement(cbox, htmlElement, cellwidth);

};
