"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_info_1 = require("./transition-info");
const trigger_info_1 = require("./trigger-info");
/**
 * Describes a transition that can be initiated from a trigger.
 *
 * @export
 * @class FixedTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/FixedTransitionInfo.cs
 */
class FixedTransitionInfo extends transition_info_1.TransitionInfo {
    /**
     * Creates an instance of FixedTransitionInfo.
     * @param {StateInfo} _destinationState
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof FixedTransitionInfo
     */
    constructor(_trigger, _guardConditionsMethodDescriptions, _destinationState) {
        super(_trigger, _guardConditionsMethodDescriptions);
        this._destinationState = _destinationState;
    }
    static create(behaviour, destinationStateInfo) {
        const transition = new FixedTransitionInfo(new trigger_info_1.TriggerInfo(behaviour.trigger), !behaviour.guard ? [] : behaviour.guard.conditions.map(c => c.methodDescription), destinationStateInfo);
        return transition;
    }
    /**
     * The state that will be transitioned into on activation.
     *
     * @readonly
     * @type {StateInfo}
     * @memberof FixedTransitionInfo
     */
    get destinationState() { return this._destinationState; }
}
exports.FixedTransitionInfo = FixedTransitionInfo;
//# sourceMappingURL=fixed-transition-info.js.map