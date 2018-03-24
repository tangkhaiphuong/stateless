"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a trigger in a statemachine.
 *
 * @export
 * @class TriggerInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TriggerInfo.cs
 */
var TriggerInfo = /** @class */ (function () {
    /**
     * Creates an instance of TriggerInfo.
     * @param {any} _underlyingTrigger
     * @memberof TriggerInfo
     */
    function TriggerInfo(_underlyingTrigger) {
        this._underlyingTrigger = _underlyingTrigger;
    }
    Object.defineProperty(TriggerInfo.prototype, "underlyingTrigger", {
        /**
         * The instance or value this trigger represents.
         *
         * @readonly
         * @type {*}
         * @memberof TriggerInfo
         */
        get: function () { return this._underlyingTrigger; },
        enumerable: true,
        configurable: true
    });
    /**
     * Describes the trigger.
     *
     * @memberof TriggerInfo
     */
    TriggerInfo.prototype.toString = function () {
        return this._underlyingTrigger || '<null2>';
    };
    return TriggerInfo;
}());
exports.TriggerInfo = TriggerInfo;
