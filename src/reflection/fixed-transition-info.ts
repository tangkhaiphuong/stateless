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
 * @template TState 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/FixedTransitionInfo.cs
 */
export class FixedTransitionInfo<TState> extends TransitionInfo {

  public static create<TState, TTrigger>(
    behaviour: TriggerBehaviour<TState, TTrigger>,
    destinationStateInfo: StateInfo<TState>): FixedTransitionInfo<TState> {

    const transition = new FixedTransitionInfo(
      new TriggerInfo(behaviour.trigger),
      !behaviour.guard ? [] : behaviour.guard.conditions.map(c => c.methodDescription),
      destinationStateInfo
    );
    return transition;
  }

  /**
   * Creates an instance of FixedTransitionInfo.
   * @param {TriggerInfo} _trigger 
   * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions 
   * @param {StateInfo<TState>} _destinationState 
   * @memberof FixedTransitionInfo
   */
  constructor(
    _trigger: TriggerInfo,
    _guardConditionsMethodDescriptions: Iterable<InvocationInfo>,
    private readonly _destinationState: StateInfo<TState>
  ) { super(_trigger, _guardConditionsMethodDescriptions); }

  /**
   * The state that will be transitioned into on activation.
   * 
   * @readonly
   * @type {StateInfo<TState>}
   * @memberof FixedTransitionInfo
   */
  public get destinationState(): StateInfo<TState> { return this._destinationState; }
}
