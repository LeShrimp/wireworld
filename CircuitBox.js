/**
 * Created by maxime on 6/21/14.
 *
 * @requires Wireworld.js
 */

/**
 *
 * @constructor
 */
var CircuitBox = function() {
    this.circuits = {};
};

/**
 *
 * @param {Wireworld} wireworld
 * @param {number} amount
 * @return {number} Id for the added circuit
 */
CircuitBox.prototype.addCircuit = (function() {
    var id = 0;
    return function (wireworld, count) {
        id++;
        this.circuits[id] = {
            wireworld: wireworld,
            count: count
        }
        return id;
    }
})();


/**
 * Increases the amount available in the toolbox.
 * @param circuitId
 */
CircuitBox.prototype.incCount = function (circuitId) {
    this.circuits[circuitId].count++;
};


/**
 * Decreases the amount of that circuit.
 * @param circuitId
 * @returns {boolean} false if amount was already 0, true otherwise.
 */
CircuitBox.prototype.decCount = function (circuitId) {
    var circuit = this.circuits[circuitId];

    if (!circuit.count)
        return false;

    circuit.count--;
    return true;
}


