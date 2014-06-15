/**
 * Created by maxime on 6/11/14.
 */

var WireworldCanvas = function (htmlCanvasElement, columns, rows) {
    //Information for HOW to draw
    this.ctx                = htmlCanvasElement.getContext('2d');
    this.width              = htmlCanvasElement.width;
    this.height             = htmlCanvasElement.height;

    //Information for WHAT to draw
    this.columns            = columns;
    this.rows               = rows;
    this.cells              = null;
}

WireworldCanvas.prototype.display = function () {
    if (!isRectArray(this.cells, this.columns, this.rows)) {
        return false;
    }

    for (var i=0; i<this.columns; i++) {
        for (var j=0; j<this.rows; j++) {
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
