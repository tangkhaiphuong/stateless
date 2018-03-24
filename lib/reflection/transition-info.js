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
var TransitionInfo = /** @class */ (function () {
    /**
     * Creates an instance of TransitionInfo.
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof TransitionInfo
     */
    function TransitionInfo(_trigger, _guardConditionsMethodDescriptions) {
        this._trigger = _trigger;
        this._guardConditionsMethodDescriptions = _guardConditionsMethodDescriptions;
    }
    Object.defineProperty(TransitionInfo.prototype, "trigger", {
        /**
         * The trigger whose firing resulted in this transition.
         *
         * @readonly
         * @type {TriggerInfo}
         * @memberof TransitionInfo
         */
        get: function () {
            return this._trigger;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransitionInfo.prototype, "guardConditionsMethodDescriptions", {
        /**
         *  Method descriptions of the guard conditions.
         * Returns a non-null but empty list if there are no guard conditions
         *
         * @type {InvocationInfo}
         * @memberof TransitionInfo
         */
        get: function () {
            return this._guardConditionsMethodDescriptions;
        },
        enumerable: true,
        configurable: true
    });
    return TransitionInfo;
}());
exports.TransitionInfo = TransitionInfo;
