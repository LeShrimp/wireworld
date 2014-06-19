/**
 * Created by maxime on 6/11/14.
 */

/**
 *
 * @param wireworld
 * @param width
 * @param height
 * @param id
 * @constructor
 */
var WireworldCanvas = function (wireworld, width, height, id) {
    this.htmlCanvasElement  = document.createElement('canvas');
    this.htmlCanvasElement.setAttribute('width', width);
    this.htmlCanvasElement.setAttribute('height', height);
    if (typeof id !== 'undefined') {
        this.htmlCanvasElement.setAttribute('id', id);
    }

    this.ctx                = this.htmlCanvasElement.getContext('2d');
    this.wireworld          = wireworld;
    this.width              = width;
    this.height             = height;
    this.cellWidth          = width/wireworld.columns;
    this.cellHeight         = height/wireworld.rows;
}

/**
 * Draws an instance of wireworld to the given Canvas.
 *
 * @param {Wireworld} wireworld
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
        y: j * this.cellHeight,
        w: this.cellWidth,
        h: this.cellHeight
    };
}


WireworldCanvas.prototype.drawCell = function (i, j, state) {
    var rect = this.getCellRect(i, j);
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    switch (state) {
        case WireworldCircuitBoard.WW_COPPER:
            this.ctx.fillStyle = '#FF9900';
            break;

        case WireworldCircuitBoard.WW_EHEAD:
            this.ctx.fillStyle = '#000099';
            break;

        case WireworldCircuitBoard.WW_ETAIL:
            this.ctx.fillStyle = '#0099FF';
            break;

        case WireworldCircuitBoard.WW_BLACK:
        default:
            this.ctx.fillStyle = '#4C4747';
            break;
    }
    this.ctx.rect(rect.x+0.5, rect.y+0.5, rect.w, rect.h);
    this.ctx.fill();
    this.ctx.stroke();
}
