import { TransitionInfo } from './transition-info';
import { StateInfo } from './state-info';
import { TriggerInfo } from './trigger-info';
import { TriggerBehaviour } from '../trigger-behaviour';
import { InvocationInfo } from './invocation-info';
/**
 * Describes a transition that can be initiated from a trigger.
 *
 * @export
 * @class FixedTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/FixedTransitionInfo.cs
 */
export declare class FixedTransitionInfo extends TransitionInfo {
    private readonly _destinationState;
    static create<TState, TTrigger>(behaviour: TriggerBehaviour<TState, TTrigger>, destinationStateInfo: StateInfo): FixedTransitionInfo;
    /**
     * Creates an instance of FixedTransitionInfo.
     * @param {StateInfo} _destinationState
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof FixedTransitionInfo
     */
    constructor(_trigger: TriggerInfo, _guardConditionsMethodDescriptions: Iterable<InvocationInfo>, _destinationState: StateInfo);
    /**
     * The state that will be transitioned into on activation.
     *
     * @readonly
     * @type {StateInfo}
     * @memberof FixedTransitionInfo
     */
    readonly destinationState: StateInfo;
}
