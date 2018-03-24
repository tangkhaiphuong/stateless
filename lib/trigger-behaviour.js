"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transition_guard_1 = require("./transition-guard");
/**
 * Define trigger behaviour.
 *
 * @export
 * @abstract
 * @class TriggerBehaviour
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviour.cs
 */
var TriggerBehaviour = /** @class */ (function () {
    /**
     * Creates an instance of TriggerBehaviour.
     * @param {TTrigger} _trigger
     * @param {TransitionGuard<TState, TTrigger>} _guard TransitionGuard (null if no guard function)
     * @memberof TriggerBehaviour
     */
    function TriggerBehaviour(_trigger, _guard) {
        if (_guard === void 0) { _guard = transition_guard_1.TransitionGuard.empty; }
        this._trigger = _trigger;
        this._guard = _guard;
        // If there is no guard function, _guard is set to TransitionGuard.empty
    }
    Object.defineProperty(TriggerBehaviour.prototype, "trigger", {
        get: function () { return this._trigger; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriggerBehaviour.prototype, "guard", {
        /**
         * Guard is the transition guard for this trigger.  Equal to TransitionGuard.Empty if there is no transition guard
         *
         * @readonly
         * @type {TransitionGuard}
         * @memberof TriggerBehaviour
         */
        get: function () { return this._guard; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriggerBehaviour.prototype, "guards", {
        /**
         * Guards is the list of guard functions for the transition guard for this trigger
         *
         * @readonly
         * @memberof TriggerBehaviour
         */
        get: function () {
            return this._guard.guards;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * GuardConditionsMet is true if all of the guard functions return true or if there are no guard functions
     *
     * @readonly
     * @type {boolean}
     * @memberof TriggerBehaviour
     */
    TriggerBehaviour.prototype.guardConditionsMet = function (args) { return this._guard.guardConditionsMet(args); };
    /**
     * UnmetGuardConditions is a list of the descriptions of all guard conditionswhose guard function returns false
     *
     * @template string
     * @memberof TriggerBehaviour
     */
    TriggerBehaviour.prototype.unmetGuardConditions = function (args) { return this._guard.unmetGuardConditions(args); };
    return TriggerBehaviour;
}());
exports.TriggerBehaviour = TriggerBehaviour;
