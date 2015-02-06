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

    this._overallStatus = WireworldRules.UNKNOWN;
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
    this._updateRuleStatus(wireworld);
    this._evaluateRules(wireworld);
};

WireworldRules.prototype._updateRuleStatus = function (wireworld) {
    for (var i in this.rules) {
        var rule = this.rules[i];

        if (rule.status != WireworldRules.UNKNOWN)
            continue;

        if (rule.hasOwnProperty("must")) {
            if (wireworld.generation < rule.generation.from) {
                continue;
            } else if (wireworld.generation > rule.generation.to) {
                rule.status = WireworldRules.FAIL;
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
};

/**
 * Evaluate the statuses of the rules (UNKNOWN, SUCCESS, FAIL for each rule) to determine
 * what the overall status is.
 */
WireworldRules.prototype._evaluateRules = function (wireworld) {
    var i;

    //Start assuming that the game is neither won nor lost
    this._overallStatus = WireworldRules.UNKNOWN;

    //No rules? Then neither failure nor success are possible
    if (this.rules.length === 0) {
        return;
    }

    if (wireworld.isDead()) {
        //if the wireworld is dead, i.e. will not change anymore it is sufficient that
        //no rule failed and every "must" rule succeeded for success
        for (i in this.rules) {
            var rule = this.rules[i];
            if (rule.status == WireworldRules.FAIL) {
                return (this._overallStatus = WireworldRules.FAIL);

            } else if (rule.hasOwnProperty("must") && rule.status == WireworldRules.UNKNOWN) {
                if (wireworld.cells[rule.coordinates.i][rule.coordinates.j] != rule.must) {
                    return (this._overallStatus = WireworldRules.FAIL);

                }
            } else if (rule.hasOwnProperty("must_not") && rule.status == WireworldRules.UNKNOWN) {
                if (wireworld.cells[rule.coordinates.i][rule.coordinates.j] == rule.must_not) {
                    return (this._overallStatus = WireworldRules.FAIL);

                }
            }
        }

        return (this._overallStatus = WireworldRules.SUCCESS);

    } else {
        for (i in this.rules) {
            if (this.rules[i].status == WireworldRules.FAIL) {
                return (this._overallStatus = WireworldRules.FAIL);
            }
        }

        //If none of the rule has failed the game maybe won...
        this._overallStatus = WireworldRules.SUCCESS;
        //...unless one of the rules is not yet in success state
        for (i in this.rules) {
            if (this.rules[i].status != WireworldRules.SUCCESS) {
                return (this._overallStatus = WireworldRules.UNKNOWN);
            }
        }
    }
};


/**
 * @return {boolean} returns true if the rules were broken.
 */
WireworldRules.prototype.isFail = function() {
    return this._overallStatus === WireworldRules.FAIL;
};


/**
 * @return {boolean} returns true if no rule can be broken anymore.
 */
WireworldRules.prototype.isSuccess = function() {
    return this._overallStatus === WireworldRules.SUCCESS;
};


/**
 */
WireworldRules.prototype.reset = function() {
    for (var i in this.rules) {
        this.rules[i].status = WireworldRules.UNKNOWN;
    }
};
