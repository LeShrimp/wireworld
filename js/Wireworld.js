/**
 *
 * Created by maxime on 6/15/14.
 *
 * @requires utils.js
 */

/**
 *
 * @param cells
 * @constructor
 */
function Wireworld(cells) {
    if (!isRectArray(cells))
    {
        throw 'Wireworld object must be initialized with rectangular 2-dimensional array.';
    }

    this.cells  = cells;
    this.columns  = cells.length;
    this.rows = cells[0].length;

    this.generation = 0;
}


Wireworld.WW_BLACK    = 0;
Wireworld.WW_COPPER   = 1;
Wireworld.WW_EHEAD    = 2;
Wireworld.WW_ETAIL    = 3;


/**
 * Does one step of evolution. Every state except WW_COPPER, WW_EHEAD, WW_ETAIL
 * are considered to be black.
 */
Wireworld.prototype.doStep = function () {
    var i, j;
    var newCells = {};

    for (i=0; i<this.cells.length; i++) {
        for (j=0; j<this.cells[i].length; j++) {
            var newCell = null;

            switch (this.cells[i][j])
            {
                case Wireworld.WW_COPPER:
                    var countEHeads = 0;
                    for (var di=-1; di<=1; di++) {
                        for (var dj=-1; dj<=1; dj++) {
                            if (this.cells[(i+di+this.columns)%this.columns][(j+dj+this.rows)%this.rows] == Wireworld.WW_EHEAD)
                            {
                                countEHeads++;
                            }
                        }
                    }
                    if (countEHeads == 1 || countEHeads == 2) {
                        newCell = Wireworld.WW_EHEAD;
                    }
                    break;

                case Wireworld.WW_EHEAD:
                    newCell = Wireworld.WW_ETAIL;
                    break;

                case Wireworld.WW_ETAIL:
                    newCell = Wireworld.WW_COPPER;
                    break;

                case Wireworld.WW_BLACK:
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

    for (i in newCells) {
        for (j in newCells[i]) {
            this.cells[i][j] = newCells[i][j];
        }
    }

    this.generation++;
}

