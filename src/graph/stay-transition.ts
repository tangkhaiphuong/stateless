import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { BaseTransition } from './base-transition';
import { InvocationInfo } from '../reflection/invocation-info';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L85
 */
export class StayTransition extends BaseTransition {

  public get guards(): Iterable<InvocationInfo> { return this._guards; }

  /**
   * Creates an instance of StayTransition.
   * @param {State} sourceState 
   * @param {TriggerInfo} trigger 
   * @param {Iterable<InvocationInfo>} _guards 
   * @param {boolean} executeEntryExitActions 
   * @memberof StayTransition
   */
  constructor(
    sourceState: State,
    trigger: TriggerInfo,
    private _guards: Iterable<InvocationInfo>,
    executeEntryExitActions: boolean) {
    super(sourceState, trigger);
    this._executeEntryExitActions = executeEntryExitActions;
  }
}
