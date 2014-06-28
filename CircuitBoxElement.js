/**
 *
 * Created by maxime on 6/21/14.
 */


/**
 *
 * @param {CircuitBox} circuitBox
 * @param {HTMLElement} htmlElement
 * @param {number} cellWidth
 * @param {function} onSelectionChanged A function getting called with the id of the newly selected circuit.
 * @constructor
 */
var CircuitBoxElement = function (circuitBox, htmlElement, cellWidth, onSelectionChanged) {
    this.htmlElement        = htmlElement;
    this.circuitBox         = circuitBox;
    this.cellWidth          = cellWidth;
    this.onSelectionChanged = onSelectionChanged;
    this.selectedCircuitId    = null;

    this._populate();
}


/**
 *
 * @private
 */
CircuitBoxElement.prototype._populate = function () {
    var that = this;
    var circuits = this.circuitBox.circuits;

    for (var id in circuits) {
        var circuit = this.getCircuitWireworld(id);
        //Create Canvas element
        var width = circuit.columns * this.cellWidth;
        var height = circuit.rows * this.cellWidth;
        var htmlCanvasElement = WireworldCanvas.createCanvasElement(width, height, id);
        var wwc = new WireworldCanvas(circuit, htmlCanvasElement, this.cellWidth);
        wwc.draw();
        wwc.htmlCanvasElement.addEventListener('click',
            (function(id) {
                return function(event) {
                    console.log(that.htmlElement.getAttribute('id')
                        + ' was clicked. Id = \'' + id + '\'');
                    that.selectCircuit(id);
                }
            })(id)
        );

        //Create label
        var label = document.createElement('p');
        label.appendChild(document.createTextNode(''+this.getCount(id)));

        //Append stuff
        var container = document.createElement('div');
        container.appendChild(wwc.htmlCanvasElement);
        container.appendChild(label);
        this.htmlElement.appendChild(container);
    }
};

/**
 *
 * @param circuitId
 */
CircuitBoxElement.prototype.selectCircuit = function (circuitId) {
    this.selectedCircuitId = circuitId;
    this.onSelectionChanged(circuitId);
};

/**
 *
 * @param circuitId
 * @returns {boolean}
 */
CircuitBoxElement.prototype.decCount = function (circuitId) {
    var result = this.circuitBox.decCount(circuitId);
    document.getElementById(circuitId).nextSibling.innerHTML = this.getCount(circuitId);
    return result;
};

/**
 *
 * @param circuitId
 * @returns {*}
 */
CircuitBoxElement.prototype.incCount = function (circuitId) {
    var result = this.circuitBox.incCount(circuitId);
    document.getElementById(circuitId).nextSibling.innerHTML = this.getCount(circuitId);
    return result;
};

/**
 *
 * @param circuitId
 * @returns {*}
 */
CircuitBoxElement.prototype.getCount = function (circuitId) {
    return this.circuitBox.circuits[circuitId].count;
}

/**
 * Returns wireworld object corresponding to circuitId.
 * @param circuitId
 */
CircuitBoxElement.prototype.getCircuitWireworld = function (circuitId) {
    return this.circuitBox.circuits[circuitId].wireworld;
}
