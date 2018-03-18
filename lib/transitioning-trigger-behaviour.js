"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trigger_behaviour_1 = require("./trigger-behaviour");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitioningTriggerBehaviour.cs
 */
class TransitioningTriggerBehaviour extends trigger_behaviour_1.TriggerBehaviour {
    /**
     * Creates an instance of TransitioningTriggerBehaviour.
     * @param {TTrigger} _trigger
     * @param {TState} _destination
     * @param {TransitionGuard} _transitionGuard
     * @memberof TransitioningTriggerBehaviour
     */
    constructor(_trigger, _destination, _transitionGuard) {
        super(_trigger, _transitionGuard);
        this._destination = _destination;
    }
    get destination() {
        return this._destination;
    }
    resultsInTransitionFrom(_source, _args) {
        const result = [true, this._destination];
        return Promise.resolve(result);
    }
}
exports.TransitioningTriggerBehaviour = TransitioningTriggerBehaviour;
