/**
 *
 * Created by maxime on 6/19/14.
 *
 * @requires WireworldCanvas
 */


/**
 * @augments WireworldCanvas
 * @param circuitBoard
 * @param width
 * @param height
 * @param id
 * @constructor
 */
var CircuitBoardCanvas = function (circuitBoard, width, height, id) {
    var that = this;
    WireworldCanvas.call(this, circuitBoard, width, height, id);

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
        this.drawCircuit(circuits[id], this.highlightedCircuitId == id);
    }
}


CircuitBoardCanvas.prototype.drawCircuit = function (circuit, isHighlighted) {
    for (var i=0; i<circuit.wireworld.columns; i++) {
        for (var j=0; j<circuit.wireworld.rows; j++) {
            this.drawCell(i+circuit.i, j+circuit.j, circuit.wireworld.cells[i][j]);
        }
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = isHighlighted ? 'green' : 'brown';
    var oldLineWidth = this.ctx.lineWidth;
    this.ctx.lineWidth = 3;
    var rectUpperLeft = this.getCellRect(circuit.i, circuit.j);
    this.ctx.rect(
        rectUpperLeft.x+0.5,
        rectUpperLeft.y+0.5,
        this.cellWidth * circuit.wireworld.columns,
        this.cellHeight * circuit.wireworld.rows
    );
    this.ctx.stroke();
    this.ctx.lineWidth = oldLineWidth;
}


CircuitBoardCanvas.prototype.getPos = function (x, y) {
    return {
        i: Math.floor(x/this.cellWidth),
        j: Math.floor(y/this.cellHeight)
    };
}

