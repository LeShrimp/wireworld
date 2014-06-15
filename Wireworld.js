/**
 *
 * Created by maxime on 6/15/14.
 */

WW_EMPTY    = 0;
WW_COPPER   = 1;
WW_EHEAD    = 2;
WW_ETAIL    = 3;

function Wireworld(cells) {
    if (!isArray(cells) || !isArray(cells[0]))
    {
        throw 'Wireworld object must be initialized with 2-dimensional array.';
    }

    this.cells  = cells;
    this.columns  = cells.length;
    this.rows = cells[0].length;

    for (var i=0; i<this.columns; i++)
    {
        if (cells[i].length != this.rows)
        {
            throw 'Wireworld object must be initialized with rectangular 2-dimensional array.';
        }
    }
}


Wireworld.prototype.doStep = function () {
    var newCells = {};

    for (var i=0; i<this.cells.length; i++) {
        for (var j=0; j<this.cells[i].length; j++) {
            var newCell = null;

            switch (this.cells[i][j])
            {
                case WW_COPPER:
                    for (var di=-1; di<=1; di++) {
                        for (var dj=-1; dj<=1; dj++) {
                            if (i+di>=0 && i+di<this.columns
                                && j+dj>=0 && j+dj<this.rows
                                && this.cells[i+di][j+dj] == WW_EHEAD)
                            {
                                newCell = WW_EHEAD;
                            }
                        }
                    }
                    break;

                case WW_EHEAD:
                    newCell = WW_ETAIL;
                    break;

                case WW_ETAIL:
                    newCell = WW_COPPER;
                    break;

                case WW_EMPTY:
                default:
                    break;
            }

            if (newCell != null) {
                if (!(i in newCells)) {
                    newCells[i] = {};
                }
                newCells[i][j] = newCell;
            }
        }
    }

    for (var i in newCells) {
        for (var j in newCells[i]) {
            this.cells[i][j] = newCells[i][j];
        }
    }
}


Wireworld.prototype.drawTo = function (wwCanvas) {
    if (wwCanvas.columns != this.columns || wwCanvas.rows != this.rows) {
        throw 'Incompatible WireworldCanvas object.';
    }
    wwCanvas.cells = this.cells;
    wwCanvas.display();
}