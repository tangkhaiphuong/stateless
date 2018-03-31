import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { Transition } from './transition';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L65
 */
export class DynamicTransition<TState> extends Transition<TState> {

  /**
   * The state where this transition finishes
   * 
   * @readonly
   * @type {State}
   * @memberof DynamicTransition
   */
  public get destinationState(): State<TState> { return this._destinationState; }

  /**
   * When is this transition followed
   * 
   * @readonly
   * @type {string}
   * @memberof DynamicTransition
   */
  public get criterion(): string { return this._criterion; }

  /**
   * Creates an instance of DynamicTransition.
   * @param {State<TState>} sourceState 
   * @param {State<TState>} _destinationState 
   * @param {TriggerInfo} trigger 
   * @param {string} _criterion 
   * @memberof DynamicTransition
   */
  constructor(
    sourceState: State<TState>,
    private _destinationState: State<TState>,
    trigger: TriggerInfo,
    private _criterion: string) {
    super(sourceState, trigger);
  }
}
