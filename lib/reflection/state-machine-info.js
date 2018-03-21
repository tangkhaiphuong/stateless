"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An info object which exposes the states, transitions, and actions of this machine.
 *
 * @export
 * @class StateMachineInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateMachineInfo.cs
 */
class StateMachineInfo {
    /**
     * Creates an instance of StateMachineInfo.
     * @param {Iterable<StateInfo>} _states
     * @param {string} _stateType
     * @param {string} _triggerType
     * @memberof StateMachineInfo
     */
    constructor(_states, _stateType, _triggerType) {
        this._states = _states;
        this._stateType = _stateType;
        this._triggerType = _triggerType;
    }
    /**
     * Exposes the states, transitions, and actions of this machine.
     *
     * @readonly
     * @type {Iterable<StateInfo>}
     * @memberof StateMachineInfo
     */
    get states() { return this._states; }
    /**
     * The type of the underlying state.
     *
     * @readonly
     * @type {string}
     * @memberof StateMachineInfo
     */
    get stateType() { return this._stateType; }
    /**
     * The type of the underlying trigger.
     *
     * @readonly
     * @type {string}
     * @memberof StateMachineInfo
     */
    get triggerType() { return this._triggerType; }
}
exports.StateMachineInfo = StateMachineInfo;
//# sourceMappingURL=state-machine-info.js.map