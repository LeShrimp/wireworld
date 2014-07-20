/**
 * Created by maxime on 6/21/14.
 *
 * @requires Wireworld.js
 */

/**
 *
 * @param {Wireworld} wireworld
 * @param {number} count
 * @param {number} blueprintId
 * @constructor
 */
var Blueprint = function (wireworld, count, blueprintId) {
    this.wireworld = wireworld;
    this.count = count;
    this.id = blueprintId;
};

/**
 *
 * @constructor
 */
var BlueprintBox = function() {
    this.blueprints = {};
};


/**
 *
 * @param {Wireworld} wireworld
 * @param {number} amount
 * @return {number} Id for the added circuit
 */
BlueprintBox.prototype.addBlueprint = (function() {
    var id = 0;
    return function (wireworld, count) {
        id++;
        this.blueprints[id] = new Blueprint(wireworld, count, id);
        return id;
    }
})();


/**
 * Increases the amount available in the toolbox.
 * @param blueprint
 */
BlueprintBox.prototype.incCount = function (blueprint) {
    blueprint.count++;
};


/**
 * Decreases the amount of that circuit.
 * @param blueprint
 * @returns {boolean} false if amount was already 0, true otherwise.
 */
BlueprintBox.prototype.decCount = function (blueprint) {

    if (!blueprint.count)
        return false;

    blueprint.count--;
    return true;
}


