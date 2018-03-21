import { StateInfo } from './state-info';
/**
 * An info object which exposes the states, transitions, and actions of this machine.
 *
 * @export
 * @class StateMachineInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateMachineInfo.cs
 */
export declare class StateMachineInfo {
    private readonly _states;
    private readonly _stateType;
    private readonly _triggerType;
    /**
     * Creates an instance of StateMachineInfo.
     * @param {Iterable<StateInfo>} _states
     * @param {string} _stateType
     * @param {string} _triggerType
     * @memberof StateMachineInfo
     */
    constructor(_states: Iterable<StateInfo>, _stateType: string, _triggerType: string);
    /**
     * Exposes the states, transitions, and actions of this machine.
     *
     * @readonly
     * @type {Iterable<StateInfo>}
     * @memberof StateMachineInfo
     */
    readonly states: Iterable<StateInfo>;
    /**
     * The type of the underlying state.
     *
     * @readonly
     * @type {string}
     * @memberof StateMachineInfo
     */
    readonly stateType: string;
    /**
     * The type of the underlying trigger.
     *
     * @readonly
     * @type {string}
     * @memberof StateMachineInfo
     */
    readonly triggerType: string;
}
