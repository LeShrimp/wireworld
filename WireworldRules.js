/** Created by Maxime 7/2/14
 *
 * Sample Wireworld rule
 * WW_BLACK    = 0;
 * WW_COPPER   = 1;
 * WW_EHEAD    = 2;
 * WW_ETAIL    = 3;
 *
 * The following specifies a rule where the cell at (3,4) must be in state
 * WW_EHEAD at some point between generation >=5 and <=10.
 * Additionally (rules are connected via AND) cell (10, 4) must NOT be in WW_COPPER
 * state in generation 10.
 *
 * {
 *     "rules": [
 *         {
 *             "coordinates": {"i": 3, "j": 4},
 *             "generation": {"from": 5, "to": 10},
 *             "must": 2
 *         },
 *         {
 *             "coordinates": {"i": 10, "j": 4},
 *             "generation": {"from": 10, "to": 10},
 *             "must_not": 1
 *         }
 *     ]
 * }
 */

/**
 * @param {Array} rule A json WireworldRule as for example in WireworldRule.json
 */
var WireworldRules = function(rules) {
    for (var i in rules) {
        rules[i].status = WireworldRules.UNKNOWN;
    }
    this.rules = rules;
};

WireworldRules.UNKNOWN  = 0;
WireworldRules.SUCCESS  = 1;
WireworldRules.FAIL     = 2;


/**
 * Call after each generation.
 *
 * @param {Wireworld} wireworld
 */
WireworldRules.prototype.update = function (wireworld) {
    for (i in this.rules) {
        var rule = this.rules[i];

        if (rule.status != WireworldRules.UNKNOWN)
            continue;

        if (rule.hasOwnProperty("must")) {
            if (wireworld.generation < rule.generation.from || wireworld.generation > rule.generation.to) {
                continue;
            } else if (wireworld.cells[rule.coordinates.i][rule.coordinates.j] == rule.must) {
                rule.status = WireworldRules.SUCCESS;
            }
        }

        if (rule.hasOwnProperty("must_not")) {
            if (wireworld.generation < rule.generation.from) {
                continue;
            } else if (wireworld.generation > rule.generation.to) {
                rule.status = WireworldRules.SUCCESS;
            } else if (wireworld.cells[rule.coordinates.i][rule.coordinates.j] == rule.must_not) {
                rule.status = WireworldRules.FAIL;
            }
        }
    }
}


/**
 * @return {boolean} returns true if the rules were broken.
 */
WireworldRules.prototype.isFail = function() {
    for (var i in this.rules) {
        if (this.rules[i].status == WireworldRules.FAIL) {
            return true;
        }
    }
    return false;
}


/**
 * @return {boolean} returns true if no rule can be broken anymore.
 */
WireworldRules.prototype.isSuccess = function() {
    for (var i in this.rules) {
        if (this.rules[i].status != WireworldRules.SUCCESS) {
            return false;
        }
    }
    return true;
}

