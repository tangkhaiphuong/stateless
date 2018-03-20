"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_info_1 = require("./transition-info");
const trigger_info_1 = require("./trigger-info");
/**
 * Describes a transition that can be initiated from a trigger, but whose result is non-deterministic.
 *
 * @export
 * @class DynamicTransitionInfo
 * @extends {TransitionInfo}
 */
class DynamicTransitionInfo extends transition_info_1.TransitionInfo {
    /**
     * Creates an instance of DynamicTransitionInfo.
     * @param {InvocationInfo} _destinationStateSelectorDescription
     * @param {DynamicStateInfos} _possibleDestinationStates
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof DynamicTransitionInfo
     */
    constructor(_trigger, _guardConditionsMethodDescriptions, _destinationStateSelectorDescription, _possibleDestinationStates) {
        super(_trigger, _guardConditionsMethodDescriptions);
        this._destinationStateSelectorDescription = _destinationStateSelectorDescription;
        this._possibleDestinationStates = _possibleDestinationStates;
    }
    static create(trigger, guards, selector, possibleStates) {
        const transition = new DynamicTransitionInfo(new trigger_info_1.TriggerInfo(trigger), guards || [], selector, possibleStates);
        return transition;
    }
    get destinationStateSelectorDescription() { return this._destinationStateSelectorDescription; }
    get possibleDestinationStates() { return this._possibleDestinationStates; }
}
exports.DynamicTransitionInfo = DynamicTransitionInfo;
//# sourceMappingURL=dynamic-transition-info.js.map