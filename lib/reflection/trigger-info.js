"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents a trigger in a statemachine.
 *
 * @export
 * @class TriggerInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TriggerInfo.cs
 */
class TriggerInfo {
    /**
     * Creates an instance of TriggerInfo.
     * @param {any} _underlyingTrigger
     * @memberof TriggerInfo
     */
    constructor(_underlyingTrigger) {
        this._underlyingTrigger = _underlyingTrigger;
    }
    /**
     * The instance or value this trigger represents.
     *
     * @readonly
     * @type {*}
     * @memberof TriggerInfo
     */
    get underlyingTrigger() { return this._underlyingTrigger; }
    /**
     * Describes the trigger.
     *
     * @memberof TriggerInfo
     */
    toString() {
        return this._underlyingTrigger || '<null>';
    }
}
exports.TriggerInfo = TriggerInfo;
//# sourceMappingURL=trigger-info.js.map