"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trigger_behaviour_1 = require("./trigger-behaviour");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
class IgnoredTriggerBehaviour extends trigger_behaviour_1.TriggerBehaviour {
    /**
     * Creates an instance of IgnoredTriggerBehaviour.
     * @param {TTrigger} trigger
     * @param {TransitionGuard} guard
     * @param {TState} _destination
     * @memberof IgnoredTriggerBehaviour
     */
    constructor(trigger, guard, _destination) {
        super(trigger, guard);
        this.trigger = trigger;
        this._destination = _destination;
    }
    resultsInTransitionFrom(_source, _args) {
        const result = [false, this._destination];
        return Promise.resolve(result);
    }
}
exports.IgnoredTriggerBehaviour = IgnoredTriggerBehaviour;
