/**
 *
 * Created by maxime on 6/21/14.
 */


/**
 *
 * @param {BlueprintBox} blueprintBox
 * @param {HTMLElement} htmlElement
 * @param {number} cellWidth
 * @param {function} onSelectionChange A function getting called with the id of the newly selected circuit.
 * @constructor
 */
var BlueprintBoxElement = function (blueprintBox, htmlElement, cellWidth) {
    this.htmlElement        = htmlElement;
    this.blueprintBox         = blueprintBox;
    this.cellWidth          = cellWidth;
    this._onSelectionChangeListener = function (){};
    this.selectedBlueprint    = null;

    this._populate();
}


/**
 *
 * @private
 */
BlueprintBoxElement.prototype._populate = function () {
    var that = this;
    var blueprints = this.blueprintBox.blueprints;

    for (var id in blueprints) {
        var blueprint = blueprints[id];
        //Create Canvas element
        var width = blueprint.wireworld.columns * this.cellWidth;
        var height = blueprint.wireworld.rows * this.cellWidth;
        var htmlCanvasElement = WireworldCanvas.createCanvasElement(width, height, blueprint.id);
        var wwc = new WireworldCanvas(blueprint.wireworld, htmlCanvasElement, this.cellWidth);
        wwc.draw();
        wwc.htmlCanvasElement.addEventListener('click',
            (function(blueprint) {
                return function(event) {
                    console.log(that.htmlElement.getAttribute('id')
                        + ' was clicked. Id = \'' + blueprint.id + '\'');
                    that.selectBlueprint(blueprint);
                }
            })(blueprint)
        );

        //Create label
        var label = document.createElement('p');
        label.appendChild(document.createTextNode(''+blueprint.count));

        //Append stuff
        var container = document.createElement('div');
        container.appendChild(wwc.htmlCanvasElement);
        container.appendChild(label);
        this.htmlElement.appendChild(container);
    }
};

/**
 *
 * @param {Blueprint} blueprint
 */
BlueprintBoxElement.prototype.selectBlueprint = function (blueprint) {
    this.selectedBlueprint = blueprint;
    this._onSelectionChangeListener(blueprint);
};

/**
 *
 * @param {Blueprint} blueprint
 * @returns {boolean}
 */
BlueprintBoxElement.prototype.decCount = function (blueprint) {
    if (!blueprint.count) {
        return false;
    }
    document.getElementById(blueprint.id).nextSibling.innerHTML = --blueprint.count;
    return true;
};

/**
 *
 * @param {Blueprint} blueprint
 * @returns {*}
 */
BlueprintBoxElement.prototype.incCount = function (blueprint) {
    document.getElementById(blueprint.id).nextSibling.innerHTML = ++blueprint.count;
    return true;
};

BlueprintBoxElement.prototype.onSelectionChange = function (onSelectionChangeListener) {
    this._onSelectionChangeListener = onSelectionChangeListener;
}
