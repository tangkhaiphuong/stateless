"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_guard_1 = require("./transition-guard");
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
class TriggerBehaviour {
    /**
     * Creates an instance of TriggerBehaviour.
     * @param {TTrigger} _trigger
     * @param {TransitionGuard<TState, TTrigger>} _guard TransitionGuard (null if no guard function)
     * @memberof TriggerBehaviour
     */
    constructor(_trigger, _guard = transition_guard_1.TransitionGuard.empty) {
        this._trigger = _trigger;
        this._guard = _guard;
        // If there is no guard function, _guard is set to TransitionGuard.empty
    }
    get trigger() { return this._trigger; }
    /**
     * Guard is the transition guard for this trigger.  Equal to TransitionGuard.Empty if there is no transition guard
     *
     * @readonly
     * @type {TransitionGuard}
     * @memberof TriggerBehaviour
     */
    get guard() { return this._guard; }
    /**
     * Guards is the list of guard functions for the transition guard for this trigger
     *
     * @readonly
     * @memberof TriggerBehaviour
     */
    get guards() {
        return this._guard.guards;
    }
    /**
     * GuardConditionsMet is true if all of the guard functions return true or if there are no guard functions
     *
     * @readonly
     * @type {boolean}
     * @memberof TriggerBehaviour
     */
    get guardConditionsMet() { return this._guard.guardConditionsMet; }
    /**
     * UnmetGuardConditions is a list of the descriptions of all guard conditionswhose guard function returns false
     *
     * @template string
     * @memberof TriggerBehaviour
     */
    get unmetGuardConditions() { return this._guard.unmetGuardConditions(); }
}
exports.TriggerBehaviour = TriggerBehaviour;

//# sourceMappingURL=trigger-behaviour.js.map
