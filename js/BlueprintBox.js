/**
 * Created by maxime on 6/21/14.
 *
 * @requires Wireworld.js
 */

/**
 * @param {Wireworld} wireworld
 * @param {number} count
 * @param {number} blueprintId
 * @constructor
 */
var Blueprint = function (wireworld, count, tip, blueprintId) {
    this.wireworld = wireworld;
    this.count = count;
    this.tip = tip;
    this.id = blueprintId;
};

/**
 * @constructor
 */
var BlueprintBox = function() {
    this.blueprints = {};
};


/**
 * The model of the Blueprint box for selecting blueprints. The selected
 * blueprint can be used to place a circuit.
 *
 * @param {Wireworld} wireworld
 * @param {number} amount
 * @return {number} Id for the added circuit
 */
BlueprintBox.prototype.addBlueprint = (function() {
    var id = 0;
    return function (wireworld, count, tip) {
        id++;
        this.blueprints[id] = new Blueprint(wireworld, count, tip, id);
        return id;
    };
})();


/**
 * Increases the amount of circuits that can be made from
 * this blueprint.
 *
 * @param blueprint
 */
BlueprintBox.prototype.incCount = function (blueprint) {
    blueprint.count++;
};


/**
 * Decreases the amount of the circuits that can be made
 * from this blueprint.
 *
 * @param blueprint
 * @returns {boolean} false if amount was already 0, true otherwise.
 */
BlueprintBox.prototype.decCount = function (blueprint) {

    if (!blueprint.count)
        return false;

    blueprint.count--;
    return true;
};


