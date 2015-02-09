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
        htmlCanvasElement.setAttribute("title", blueprint.tip);
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

    wwce.style.borderColor = '#4D344A';
    wwce.style.borderWidth = '2px';
    wwce.style.borderStyle = 'solid';

    this.deselectBlueprint();
    this.selectedBlueprint = blueprint;
    this.updateCounterElement(this.selectedBlueprint);

    this._onSelectionChangeListener(blueprint);
};

BlueprintBoxElement.prototype.deselectBlueprint = function () {
    var blueprint = this.selectedBlueprint;
    if (blueprint !== null) {
        this.wireworldCanvases[blueprint.id].htmlCanvasElement.style.borderWidth = '0px';
        this.selectedBlueprint = null;
        this.updateCounterElement(blueprint); //It is important to first set selectedBlueprint to null!
    }
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
    blueprint.count--;
    this.updateCounterElement(blueprint);
    return true;
};

/**
 *
 * @param {Blueprint} blueprint
 * @returns {*}
 */
BlueprintBoxElement.prototype.incCount = function (blueprint) {
    blueprint.count++;
    this.updateCounterElement(blueprint);
    return true;
};

/**
 * Update the indicator under the blueprint to indicate how many blueprints are left.
 * Subtract 1 if the current blueprint is selected.
 *
 * @param {Blueprint} blueprint
 */
BlueprintBoxElement.prototype.updateCounterElement = function (blueprint) {
    var newCount = this.selectedBlueprint === blueprint ? blueprint.count - 1 : blueprint.count;
    document.getElementById(blueprint.id).nextSibling.innerHTML = newCount;
};

BlueprintBoxElement.prototype.onSelectionChange = function (onSelectionChangeListener) {
    this._onSelectionChangeListener = onSelectionChangeListener;
};
