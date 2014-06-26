/**
 * Created by maxime on 6/11/14.
 */

/**
 *
 * @param {Wireworld} wireworld
 * @param {HTMLCanvasElement} htmlCanvasElement
 * @param {number} cellWidth
 * @constructor
 */
var WireworldCanvas = function (wireworld, htmlCanvasElement, cellWidth) {
    this.htmlCanvasElement  = htmlCanvasElement;
    this.ctx                = this.htmlCanvasElement.getContext('2d');
    this.width              = htmlCanvasElement.width;
    this.height             = htmlCanvasElement.height;
    this.wireworld          = wireworld;
    this.cellWidth          = cellWidth;
}

/**
 *
 * @param width
 * @param height
 * @param id
 * @returns {HTMLElement}
 */
WireworldCanvas.createCanvasElement = function(width, height, id) {
    var e = document.createElement('canvas');
    e.setAttribute('width', width);
    e.setAttribute('height', height);
    e.id = id;

    return e;
}

/**
 * Draws an instance of wireworld to the given Canvas.
 */
WireworldCanvas.prototype.draw = function () {
    for (var i=0; i<this.wireworld.columns; i++) {
        for (var j=0; j<this.wireworld.rows; j++) {
            this.drawCell(i, j, this.wireworld.cells[i][j]);
        }
    }
}


WireworldCanvas.prototype.getCellRect = function (i, j) {
    return {
        x: i * this.cellWidth,
        y: j * this.cellWidth,
        w: this.cellWidth,
        h: this.cellWidth
    };
}


WireworldCanvas.prototype.drawCell = function (i, j, state) {
    var rect = this.getCellRect(i, j);
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    switch (state) {
        case CircuitBoard.WW_COPPER:
            this.ctx.fillStyle = '#FF9900';
            break;

        case CircuitBoard.WW_EHEAD:
            this.ctx.fillStyle = '#000099';
            break;

        case CircuitBoard.WW_ETAIL:
            this.ctx.fillStyle = '#0099FF';
            break;

        case CircuitBoard.WW_BLACK:
        default:
            this.ctx.fillStyle = '#4C4747';
            break;
    }
    this.ctx.rect(rect.x+0.5, rect.y+0.5, rect.w, rect.h);
    this.ctx.fill();
    this.ctx.stroke();
}
