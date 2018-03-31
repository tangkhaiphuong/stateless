import { State } from './state';
import { StateInfo } from '../reflection/state-info';

/**
 * Used to keep track of a state that has substates
 * 
 * @export
 * @class SuperState
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/SuperState.cs
 */
export class SuperState<TState> extends State<TState> {

  private _subStates: Array<State<TState>> = [];

  /**
   * List of states that are a substate of this state
   * 
   * @readonly
   * @type {Array<State<TState>>}
   * @memberof SuperState
   */
  public get subStates(): Array<State<TState>> { return this._subStates; }

  /**
   * Creates an instance of SuperState.
   * @param {StateInfo} stateInfo 
   * @memberof SuperState
   */
  constructor(stateInfo: StateInfo<TState>) {
    super(stateInfo);
  }
}
