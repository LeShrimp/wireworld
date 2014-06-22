/**
 *
 * Created by maxime on 6/21/14.
 */


var CircuitBoxElement = function (circuitBox, width, height, htmlId) {
    this.htmlElement  = document.createElement('div');
    this.htmlElement.style.width = width+'px';
    this.htmlElement.style.height = height+'px';
    if (typeof htmlId !== 'undefined') {
        this.htmlElement.setAttribute('id', htmlId);
    }

    this.circuitBox         = circuitBox;
    this.width              = width;
    this.height             = height;
    this.selectedCircuit    = null;
    this._selChangeCallback = null;

    this._populate();
}


CircuitBoxElement.prototype._populate = function () {
    var that = this;
    var circuits = this.circuitBox.circuits;

    var maxColumns = 0;
    for (var id in circuits) {
        maxColumns = Math.max(maxColumns, circuits[id].wireworld.columns);
    }
    var cellWidth = Math.floor((this.width - 20)/maxColumns);

    for (var id in circuits) {
        var circuit = circuits[id];
        //Create Canvas element
        var width = circuit.wireworld.columns * cellWidth;
        var height = circuit.wireworld.rows * cellWidth;
        var wwc = new WireworldCanvas(circuit.wireworld, width, height, id);
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
