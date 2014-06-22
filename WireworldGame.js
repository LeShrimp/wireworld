/**
 * Created by maxime on 6/22/14.
 */


var WireworldGame = function () {
    this.circuitBoxElement = null;
    this.circuitBoardCanvas = null;
    //this.playButton = null;

    this.htmlContainerElement = null;

    this.currentMode = null;
    this.setMode(WireworldGame.SELECTION_MODE);
};


WireworldGame.PLACEMENT_MODE = 0;
WireworldGame.SELECTION_MODE = 1;
WireworldGame.EXECUTION_MODE = 1;


WireworldGame.prototype.generateDomElements = function (circuitBoard, circuitBox, message) {
    var that = this;

    //Setting up the circuit box
    this.circuitBoxElement = new CircuitBoxElement(circuitBox, 200, 400, 'circuitbox');
    this.circuitBoxElement.onSelectionChanged(function (circuitId) {
        that.setMode(WireworldGame.PLACEMENT_MODE);
    });

    //Setting up the circuit board
    this.circuitBoardCanvas = new CircuitBoardCanvas(circuitBoard, 600, 400, 'circuitboard');
    this.circuitBoardCanvas.draw();
    this.circuitBoardCanvas.htmlCanvasElement.addEventListener('click', function (event) {
        if (event.button == 2) {
            that.setMode(WireworldGame.SELECTION_MODE);
        }
    });

    this.htmlContainerElement = document.createElement('div');
    this.htmlContainerElement.style.width = (600 + 200) + 'px';
    this.htmlContainerElement.style.height = 400 + 'px';
    this.htmlContainerElement.className += ' wireworld';
    this.htmlContainerElement.appendChild(this.circuitBoardCanvas.htmlCanvasElement);
    this.htmlContainerElement.appendChild(this.circuitBoxElement.htmlElement);
};


WireworldGame.prototype.setMode = function(mode) {
    var that = this;
    var cbcSelectionListener = function (event) {
        var cbc = that.circuitBoardCanvas;
        var cbce = cbc.htmlCanvasElement;
        var cb = cbc.circuitBoard;

        var x = event.clientX - cbce.getBoundingClientRect().left;
        var y = event.clientY - cbce.getBoundingClientRect().top;
        var pos = cbc.getPos(x, y);
        console.log(pos.i + ', ' +pos.j)
        if (cbc.highlightedCircuitId != cb.getCircuitAtPos(pos.i, pos.j)) {
            cbc.highlightedCircuitId = cb.getCircuitAtPos(pos.i, pos.j)
            cbc.draw();
        }
    };

    switch (mode) {
        case WireworldGame.PLACEMENT_MODE:
            this.circuitBoardCanvas.htmlCanvasElement.addEventListener('mousemove', function(event) {

            });
            break;

        case WireworldGame.SELECTION_MODE:
            this.circuitBoardCanvas.htmlCanvasElement.addEventListener('mousemove', cbcSelectionListener);
            break;
    }
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

    this.generateDomElements(cb, cbox, 'The first level.');
};
