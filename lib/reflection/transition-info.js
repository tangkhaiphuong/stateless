"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Presentation transition information.
 *
 * @export
 * @abstract
 * @class TransitionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TransitionInfo.cs
 */
class TransitionInfo {
    /**
     * Creates an instance of TransitionInfo.
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof TransitionInfo
     */
    constructor(_trigger, _guardConditionsMethodDescriptions) {
        this._trigger = _trigger;
        this._guardConditionsMethodDescriptions = _guardConditionsMethodDescriptions;
    }
    /**
     * The trigger whose firing resulted in this transition.
     *
     * @readonly
     * @type {TriggerInfo}
     * @memberof TransitionInfo
     */
    get trigger() {
        return this._trigger;
    }
    /**
     *  Method descriptions of the guard conditions.
     * Returns a non-null but empty list if there are no guard conditions
     *
     * @type {InvocationInfo}
     * @memberof TransitionInfo
     */
    get guardConditionsMethodDescriptions() {
        return this._guardConditionsMethodDescriptions;
    }
}
exports.TransitionInfo = TransitionInfo;
