/**
 *
 * Created by maxime on 6/21/14.
 */


/**
 *
 * @param {CircuitBox} circuitBox
 * @param {HTMLElement} htmlElement
 * @param {number} cellWidth
 * @constructor
 */
var CircuitBoxElement = function (circuitBox, htmlElement, cellWidth) {
    this.htmlElement        = htmlElement;
    this.circuitBox         = circuitBox;
    this.cellWidth          = cellWidth;
    this.selectedCircuit    = null;
    this._selChangeCallback = null;

    this._populate();
}


CircuitBoxElement.prototype._populate = function () {
    var that = this;
    var circuits = this.circuitBox.circuits;

    for (var id in circuits) {
        var circuit = circuits[id];
        //Create Canvas element
        var width = circuit.wireworld.columns * this.cellWidth;
        var height = circuit.wireworld.rows * this.cellWidth;
        var htmlCanvasElement = WireworldCanvas.createCanvasElement(width, height, id)
        var wwc = new WireworldCanvas(circuit.wireworld, htmlCanvasElement, this.cellWidth);
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
        label.appendChild(document.createTextNode(''+circuit.count));

        //Append stuff
        var container = document.createElement('div');
        container.appendChild(wwc.htmlCanvasElement);
        container.appendChild(label);
        this.htmlElement.appendChild(container);
    }
};


CircuitBoxElement.prototype.onSelectionChanged = function (callback) {
    this._selChangeCallback = callback;
};


CircuitBoxElement.prototype.selectCircuit = function (circuitId) {
    this.selectedCircuit = this.circuitBox.circuits[circuitId].wireworld;
    if (this._selChangeCallback != null) {
        this._selChangeCallback(circuitId);
    }
};
