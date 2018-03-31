import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { Transition } from './transition';
import { InvocationInfo } from '../reflection/invocation-info';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L45
 */
export class FixedTransition<TState> extends Transition<TState> {

  /**
   * The state where this transition finishes
   * 
   * @readonly
   * @type {State<TState>}
   * @memberof FixedTransition
   */
  public get destinationState(): State<TState> { return this._destinationState; }

  /**
   * Guard functions for this transition (null if none)
   * 
   * @readonly
   * @type {Iterable<InvocationInfo>}
   * @memberof FixedTransition
   */
  public get guards(): Iterable<InvocationInfo> { return this._guards; }

  /**
   * Creates an instance of FixedTransition.
   * @param {State<TState>} sourceState 
   * @param {State<TState>} _destinationState 
   * @param {TriggerInfo} trigger 
   * @param {Iterable<InvocationInfo>} _guards 
   * @memberof FixedTransition
   */
  constructor(
    sourceState: State<TState>,
    private _destinationState: State<TState>,
    trigger: TriggerInfo,
    private _guards: Iterable<InvocationInfo>) {
    super(sourceState, trigger);
  }
}
