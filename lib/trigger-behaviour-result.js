"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviourResult.cs
 */
class TriggerBehaviourResult {
    constructor(_handler, _unmetGuardConditions) {
        this._handler = _handler;
        this._unmetGuardConditions = _unmetGuardConditions;
    }
    get handler() { return this._handler; }
    get unmetGuardConditions() { return this._unmetGuardConditions; }
}
exports.TriggerBehaviourResult = TriggerBehaviourResult;
