import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { Transition } from './transition';
import { InvocationInfo } from '../reflection/invocation-info';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L45
 */
export class FixedTransition extends Transition {

  /**
   * The state where this transition finishes
   * 
   * @readonly
   * @type {State}
   * @memberof FixedTransition
   */
  public get destinationState(): State { return this._destinationState; }

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
   * @param {State} sourceState 
   * @param {State} _destinationState 
   * @param {TriggerInfo} trigger 
   * @param {Iterable<InvocationInfo>} _guards 
   * @memberof FixedTransition
   */
  constructor(
    sourceState: State,
    private _destinationState: State,
    trigger: TriggerInfo,
    private _guards: Iterable<InvocationInfo>) {
    super(sourceState, trigger);
  }
}
