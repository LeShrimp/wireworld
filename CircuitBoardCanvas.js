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

    this.highlightedCircuitId = null;
};


copyProperties(CircuitBoardCanvas, WireworldCanvas); //Copy statics
copyPrototype(CircuitBoardCanvas, WireworldCanvas);

/**
 *
 * @param circuitBoard
 * @override
 */
CircuitBoardCanvas.prototype.draw = function () {
    for (var i=0; i<this.circuitBoard.columns; i++) {
        for (var j=0; j<this.circuitBoard.rows; j++) {
            this.drawCell(i, j, this.circuitBoard.cells[i][j]);
        }
    }
    var circuits = this.circuitBoard.circuits;
    for (var id in circuits) {
        this.drawCircuit(circuits[id].i, circuits[id].j, circuits[id].wireworld, this.highlightedCircuitId == id);
    }
}


CircuitBoardCanvas.prototype.drawCircuit = function (i, j, wireworld, isHighlighted) {
    for (var k=0; k<wireworld.columns; k++) {
        for (var l=0; l<wireworld.rows; l++) {
            this.drawCell(k+i, l+j, wireworld.cells[k][l]);
        }
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = isHighlighted ? 'green' : 'brown';
    var oldLineWidth = this.ctx.lineWidth;
    this.ctx.lineWidth = 3;
    var rectUpperLeft = this.getCellRect(i, j);
    this.ctx.rect(
        rectUpperLeft.x+0.5,
        rectUpperLeft.y+0.5,
        this.cellWidth * wireworld.columns,
        this.cellWidth * wireworld.rows
    );
    this.ctx.stroke();
    this.ctx.lineWidth = oldLineWidth;
}


//TODO: Move this to WireworldCanvas
CircuitBoardCanvas.prototype.getPosFromMouseEvent = function (event) {
    var x = event.clientX - this.htmlCanvasElement.getBoundingClientRect().left;
    var y = event.clientY - this.htmlCanvasElement.getBoundingClientRect().top;
    return {
        i: Math.floor(x/this.cellWidth),
        j: Math.floor(y/this.cellWidth)
    };
}

