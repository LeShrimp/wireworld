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
    /**  @type {HTMLCanvasElement} */
    this.htmlCanvasElement  = htmlCanvasElement;
    htmlCanvasElement.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });
    /**  @type {CanvasRenderingContext2D} */
    this.ctx                = this.htmlCanvasElement.getContext('2d');
    /** @type {number} */
    this.width              = htmlCanvasElement.width;
    /** @type {number} */
    this.height             = htmlCanvasElement.height;
    /** @type {Wireworld} */
    this.wireworld          = wireworld;
    /** @type {number} */
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


/**
 *
 * @param i
 * @param j
 * @returns {{x: number, y: number, w: (number|*), h: *}}
 */
WireworldCanvas.prototype.getCellRect = function (i, j) {
    return {
        x: i * this.cellWidth,
        y: j * this.cellWidth,
        w: this.cellWidth,
        h: this.cellWidth
    };
}


/**
 *
 * @param i
 * @param j
 * @param state
 */
WireworldCanvas.prototype.drawCell = function (i, j, state) {
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
        default:
            ctx.fillStyle = '#2F1E2E';
            break;
    }
    ctx.rect(rect.x+0.5, rect.y+0.5, rect.w, rect.h);
    ctx.fill();
    ctx.stroke();
};

/**
 *
 * @param event
 * @returns {{i: number, j: number}}
 */
WireworldCanvas.prototype.getPosFromMouseEvent = function (event) {
    var x = event.clientX - this.htmlCanvasElement.getBoundingClientRect().left;
    var y = event.clientY - this.htmlCanvasElement.getBoundingClientRect().top;
    return {
        i: Math.floor(x/this.cellWidth),
        j: Math.floor(y/this.cellWidth)
    };
};
