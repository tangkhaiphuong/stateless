import { TransitionInfo } from './transition-info';
import { IgnoredTriggerBehaviour } from '../ignored-trigger-behaviour';
/**
 * Describes a trigger that is "ignored" (stays in the same state)
 *
 * @export
 * @class IgnoredTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/IgnoredTransitionInfo.cs
 */
export declare class IgnoredTransitionInfo extends TransitionInfo {
    static create<TState, TTrigger>(behaviour: IgnoredTriggerBehaviour<TState, TTrigger>): IgnoredTransitionInfo;
}
