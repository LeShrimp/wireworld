/**
 *
 * Created by maxime on 6/19/14.
 *
 * @requires WireworldCanvas
 */


/**
 * @augments WireworldCanvas
 * @param {CircuitBoard} circuitBoard
 * @param {HTMLCanvasElement} htmlCanvasElement
 * @param {number} cellWidth
 * @constructor
 */
var CircuitBoardCanvas = function (circuitBoard, htmlCanvasElement, cellWidth) {
    WireworldCanvas.call(this, circuitBoard, htmlCanvasElement, cellWidth);

    //Note that due to call of parent constructor, this.circuitBoard and
    //this.wireworld refer to the same object.
    this.circuitBoard = circuitBoard;

    this.highlightedCircuit = null;
};


copyProperties(CircuitBoardCanvas, WireworldCanvas); //Copy statics
copyPrototype(CircuitBoardCanvas, WireworldCanvas);

/**
 *
 * @param circuitBoard
 * @override
 */
CircuitBoardCanvas.prototype.draw = function() {
    this.drawWireworld(0, 0, this.wireworld);

    var circuits = this.circuitBoard.circuits;
    var circuit;
    for (var id in circuits) {
        circuit = circuits[id];
        this.drawWireworld(circuit.i, circuit.j, circuit.blueprint.wireworld, 'black');
    }
    if (inArray(this.highlightedCircuit, circuits)) {
        circuit = this.highlightedCircuit;
        this.drawWireworld(circuit.i, circuit.j, circuit.blueprint.wireworld, 'green');
    }
};

/**
 *
 * @param i
 * @param j
 * @param {Wireworld} wireworld
 * @param {string} [borderColor] If none is given no border is drawn.
 */
CircuitBoardCanvas.prototype.drawWireworld = function (i, j, wireworld, borderColor) {
    for (var k=0; k<wireworld.columns; k++) {
        for (var l=0; l<wireworld.rows; l++) {
            this.drawCell(k+i, l+j, wireworld.cells[k][l]);
        }
    }

    if (typeof borderColor !== 'undefined') {
        var ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = borderColor;
        ctx.save();
        ctx.lineWidth = 3;
        var rectUpperLeft = this.getCellRect(i, j);
        var circuitRect = {
            x: rectUpperLeft.x+0.5,
            y: rectUpperLeft.y+0.5,
            w: this.cellWidth * wireworld.columns,
            h: this.cellWidth * wireworld.rows
        };
        ctx.rect(circuitRect.x, circuitRect.y, circuitRect.w, circuitRect.h);
        ctx.stroke();
        ctx.restore();
    }
};

/**
 *
 * @param i
 * @param j
 * @param state
 * @override
 */
CircuitBoardCanvas.prototype.drawCell = function (i, j, state) {
    var ctx = this.ctx;
    var rect = this.getCellRect(i, j);

    ctx.beginPath();
    ctx.strokeStyle = '#4D344A';
    switch (state) {
        case Wireworld.WW_COPPER:
            ctx.fillStyle = '#F7C11E';
            break;

        case Wireworld.WW_EHEAD:
            ctx.fillStyle = '#17A4E5';
            break;

        case Wireworld.WW_ETAIL:
            ctx.fillStyle = '#EA503A';
            break;

        case Wireworld.WW_BLACK:
            ctx.fillStyle = '#2F1E2E';
            break;

        case CircuitBoard.WW_EMPTY:
        default:
            ctx.fillStyle = '#110012';
            break;
    }
    ctx.rect(rect.x+0.5, rect.y+0.5, rect.w, rect.h);
    ctx.fill();
    ctx.stroke();
};

/**
 * Clone the current canvas, and create a Wireworld Canvas object with
 * wireworld being the print of the circuitboard.
 *
 * @return {WireworldCanvas}
 */
CircuitBoardCanvas.prototype.createPrintCanvas = function (id) {
    if (typeof id === 'undefined') {
        id = 'printedwireworldcanvas';
    }
    var htmlCanvasElement = document.createElement('canvas');
    htmlCanvasElement.width = this.htmlCanvasElement.width;
    htmlCanvasElement.height = this.htmlCanvasElement.height;
    htmlCanvasElement.setAttribute('id', id);

    var wireworld = this.circuitBoard.print();

    return new WireworldCanvas(wireworld, htmlCanvasElement, this.cellWidth);
};
