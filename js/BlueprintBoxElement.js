/**
 *
 * Created by maxime on 6/21/14.
 */


/**
 *
 * @param {BlueprintBox} blueprintBox
 * @param {HTMLElement} htmlElement
 * @param {number} cellWidth
 * @constructor
 */
var BlueprintBoxElement = function (blueprintBox, htmlElement, cellWidth) {
    this.htmlElement        = htmlElement;
    this.blueprintBox       = blueprintBox;
    this.cellWidth          = cellWidth;

    this.wireworldCanvases  = {};
    this._onSelectionChangeListener = function (){};
    this.selectedBlueprint  = null;

    this._populate();
};


BlueprintBoxElement.prototype._createOnBlueprintClickListener = function (blueprint) {
    var that = this;

    return function(event) {
        that.selectBlueprint(blueprint);
    };
};

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

        this.wireworldCanvases[id] = wwc;
        wwc.draw();
        wwc.htmlCanvasElement.addEventListener('click', this._createOnBlueprintClickListener(blueprint));

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
    var wwce = this.wireworldCanvases[blueprint.id].htmlCanvasElement;

    for (var id in this.wireworldCanvases) {
        this.wireworldCanvases[id].htmlCanvasElement.style.borderWidth = '0px';
    }
    wwce.style.borderColor = '#4D344A';
    wwce.style.borderWidth = '2px';
    wwce.style.borderStyle = 'solid';

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
};
