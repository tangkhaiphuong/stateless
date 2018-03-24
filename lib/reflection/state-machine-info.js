"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An info object which exposes the states, transitions, and actions of this machine.
 *
 * @export
 * @class StateMachineInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateMachineInfo.cs
 */
var StateMachineInfo = /** @class */ (function () {
    /**
     * Creates an instance of StateMachineInfo.
     * @param {Iterable<StateInfo>} _states
     * @param {string} _stateType
     * @param {string} _triggerType
     * @memberof StateMachineInfo
     */
    function StateMachineInfo(_states, _stateType, _triggerType) {
        this._states = _states;
        this._stateType = _stateType;
        this._triggerType = _triggerType;
    }
    Object.defineProperty(StateMachineInfo.prototype, "states", {
        /**
         * Exposes the states, transitions, and actions of this machine.
         *
         * @readonly
         * @type {Iterable<StateInfo>}
         * @memberof StateMachineInfo
         */
        get: function () { return this._states; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachineInfo.prototype, "stateType", {
        /**
         * The type of the underlying state.
         *
         * @readonly
         * @type {string}
         * @memberof StateMachineInfo
         */
        get: function () { return this._stateType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachineInfo.prototype, "triggerType", {
        /**
         * The type of the underlying trigger.
         *
         * @readonly
         * @type {string}
         * @memberof StateMachineInfo
         */
        get: function () { return this._triggerType; },
        enumerable: true,
        configurable: true
    });
    return StateMachineInfo;
}());
exports.StateMachineInfo = StateMachineInfo;
