/**
 * Created by maxime on 6/11/14.
 */

var WireworldCanvas = function (width, height) {
    this.htmlCanvasElement  = document.createElement('canvas');
    this.htmlCanvasElement.setAttribute('width', width);
    this.htmlCanvasElement.setAttribute('height', height);

    this.ctx                = htmlCanvasElement.getContext('2d');
    this.width              = width;
    this.height             = height;
}

/**
 * Draws an instance of wireworld to the given Canvas.
 *
 * @param {Wireworld} wireworld
 */
WireworldCanvas.prototype.drawWireworld = function (wireworld) {
    for (var i=0; i<wireworld.columns; i++) {
        for (var j=0; j<wireworld.rows; j++) {
            this.drawCell(i, j, wireworld.cells[i][j]);
        }
    }
}


WireworldCanvas.prototype.drawCircuitBoard = function (circuitBoard) {
    for (var i=0; i<circuitBoard.columns; i++) {
        for (var j=0; j<circuitBoard.rows; j++) {
            this.drawCell(i, j, this.cells[i][j]);
        }
    }
}


WireworldCanvas.prototype.getCellRect = function (i, j) {
    var cellWidth = this.width/this.columns;
    var cellHeight = this.height/this.rows;
    cellWidth = cellHeight = Math.min(cellWidth, cellHeight);
    return {
        x: i * cellWidth,
        y: j * cellHeight,
        w: cellWidth,
        h: cellHeight
    };
}


WireworldCanvas.prototype.drawCell = function (i, j, state) {
    var rect = this.getCellRect(i, j);
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    switch (state) {
        case WW_COPPER:
            this.ctx.fillStyle = '#FF9900';
            break;

        case WW_EHEAD:
            this.ctx.fillStyle = '#000099';
            break;

        case WW_ETAIL:
            this.ctx.fillStyle = '#0099FF';
            break;

        case WW_EMPTY:
            this.ctx.fillStyle = '#4C4747';
            break;
    }
    this.ctx.rect(rect.x+0.5, rect.y+0.5, rect.w, rect.h);
    this.ctx.fill();
    this.ctx.stroke();
}
