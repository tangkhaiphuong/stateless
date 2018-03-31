import { StateInfo } from './state-info';

/**
 * An info object which exposes the states, transitions, and actions of this machine.
 * 
 * @export
 * @class StateMachineInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateMachineInfo.cs
 */
export class StateMachineInfo<TState> {

  /**
   * Creates an instance of StateMachineInfo.
   * @param {Iterable<StateInfo<TState>>} _states 
   * @param {string} _stateType 
   * @param {string} _triggerType 
   * @memberof StateMachineInfo
   */
  constructor(
    private readonly _states: Iterable<StateInfo<TState>>,
    private readonly _stateType: string,
    private readonly _triggerType: string) {
  }

  /**
   * Exposes the states, transitions, and actions of this machine.
   * 
   * @readonly
   * @type {Iterable<StateInfo<TState>>}
   * @memberof StateMachineInfo
   */
  public get states(): Iterable<StateInfo<TState>> { return this._states; }

  /**
   * The type of the underlying state.
   * 
   * @readonly
   * @type {string}
   * @memberof StateMachineInfo
   */
  public get stateType(): string { return this._stateType; }

  /**
   * The type of the underlying trigger.
   * 
   * @readonly
   * @type {string}
   * @memberof StateMachineInfo
   */
  public get triggerType(): string { return this._triggerType; }
}
