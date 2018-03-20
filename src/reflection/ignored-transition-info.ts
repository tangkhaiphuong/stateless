import { TransitionInfo } from './transition-info';
import { IgnoredTriggerBehaviour } from '../ignored-trigger-behaviour';
import { TriggerInfo } from './trigger-info';

/**
 * Describes a trigger that is "ignored" (stays in the same state)
 * 
 * @export
 * @class IgnoredTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/IgnoredTransitionInfo.cs
 */
export class IgnoredTransitionInfo extends TransitionInfo {

  public static create<TState, TTrigger>(behaviour: IgnoredTriggerBehaviour<TState, TTrigger>): IgnoredTransitionInfo {
    const transition = new IgnoredTransitionInfo(
      new TriggerInfo(behaviour.trigger),
      !behaviour.guard ? [] : behaviour.guard.conditions.map(c => c.methodDescription)
    );
    return transition;
  }
}
