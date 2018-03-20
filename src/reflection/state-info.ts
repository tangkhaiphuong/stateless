import { StateRepresentation } from '../state-pepresentation';
import { IgnoredTransitionInfo } from './ignored-transition-info';
import { IgnoredTriggerBehaviour } from '../ignored-trigger-behaviour';
import { InvocationInfo } from './invocation-info';
import { ActionInfo } from './action-info';

/**
 * Describes an internal StateRepresentation through the reflection API.
 * 
 * @export
 * @class StateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateInfo.cs
 */
export class StateInfo {

  public static createStateInfo<TState, TTrigger>(stateRepresentation: StateRepresentation<TState, TTrigger>): StateInfo {

    const ignoredTriggers: IgnoredTransitionInfo[] = [];

    // stateRepresentation.triggerBehaviours maps from TTrigger to ICollection<TriggerBehaviour>
    for (const triggerBehaviours of stateRepresentation.triggerBehaviours) {
      for (const item of triggerBehaviours['1']) {
        if (item instanceof IgnoredTriggerBehaviour) {
          ignoredTriggers.push(IgnoredTransitionInfo.create(item));
        }
      }
    }

    return new StateInfo(stateRepresentation.underlyingState, 
      ignoredTriggers,
      stateRepresentation.entryActions.map(e => ActionInfo.create(e)),
      stateRepresentation.activateActions.map(e => e.description),
      stateRepresentation.deactivateActions.map(e => e.description),
      stateRepresentation.exitActions.map(e => e.description));
  }

  /**
   * Creates an instance of StateInfo.
   * @param {*} _underlyingState 
   * @param {Iterable<IgnoredTransitionInfo>} _ignoredTriggers 
   * @param {Iterable<ActionInfo>} _entryActions 
   * @param {Iterable<InvocationInfo>} _activateActions 
   * @param {Iterable<InvocationInfo>} _deactivateActions 
   * @param {Iterable<InvocationInfo>} _exitActions 
   * @memberof StateInfo
   */
  constructor(
    private readonly _underlyingState: any,
    private readonly _ignoredTriggers: Iterable<IgnoredTransitionInfo>,
    private readonly _entryActions: Iterable<ActionInfo>,
    private readonly _activateActions: Iterable<InvocationInfo>,
    private readonly _deactivateActions: Iterable<InvocationInfo>,
    private readonly _exitActions: Iterable<InvocationInfo>) {
  }

}
