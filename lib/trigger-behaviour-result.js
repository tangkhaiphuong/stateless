"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviourResult.cs
 */
var TriggerBehaviourResult = /** @class */ (function () {
    function TriggerBehaviourResult(_handler, _unmetGuardConditions) {
        this._handler = _handler;
        this._unmetGuardConditions = _unmetGuardConditions;
    }
    Object.defineProperty(TriggerBehaviourResult.prototype, "handler", {
        get: function () { return this._handler; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TriggerBehaviourResult.prototype, "unmetGuardConditions", {
        get: function () { return this._unmetGuardConditions; },
        enumerable: true,
        configurable: true
    });
    return TriggerBehaviourResult;
}());
exports.TriggerBehaviourResult = TriggerBehaviourResult;
