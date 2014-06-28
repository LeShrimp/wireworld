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
CircuitBoardCanvas.prototype.draw = (function() {
    var buffer = null;

    return function () {
        if (buffer != null) {
            this.ctx.putImageData(buffer, 0, 0); //For some reason this gets really slow in firefox
        } else {
            for (var i=0; i<this.wireworld.columns; i++) {
                for (var j=0; j<this.wireworld.rows; j++) {
                    this.drawCell(i, j, this.wireworld.cells[i][j]);
                }
            }
            buffer = this.ctx.getImageData(0, 0, this.width, this.height);
        }
        var circuits = this.circuitBoard.circuits;
        for (var id in circuits) {
            this.drawCircuit(circuits[id].i, circuits[id].j, circuits[id].wireworld, this.highlightedCircuitId == id);
        }
    }
})();

/**
 *
 * @param i
 * @param j
 * @param wireworld
 * @param isHighlighted
 */
CircuitBoardCanvas.prototype.drawCircuit = function (i, j, wireworld, isHighlighted, isLegal) {
    if (typeof isLegal === 'undefined') {
        isLegal = true;
    }

    for (var k=0; k<wireworld.columns; k++) {
        for (var l=0; l<wireworld.rows; l++) {
            this.drawCell(k+i, l+j, wireworld.cells[k][l]);
        }
    }
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.strokeStyle = isHighlighted && isLegal ? 'green' : 'brown';
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
    if (!isLegal) {
        ctx.moveTo(circuitRect.x, circuitRect.y);
        ctx.lineTo(circuitRect.x + circuitRect.w, circuitRect.y + circuitRect.h);
        ctx.moveTo(circuitRect.x, circuitRect.y + circuitRect.h);
        ctx.lineTo(circuitRect.x + circuitRect.w, circuitRect.y);
    }
    ctx.stroke();
    ctx.restore();
};



