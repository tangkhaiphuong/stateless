import { TransitionInfo } from './transition-info';
import { InvocationInfo } from './invocation-info';
import { DynamicStateInfos } from './dynamic-state-infos';
import { TriggerInfo } from './trigger-info';

/**
 * Describes a transition that can be initiated from a trigger, but whose result is non-deterministic.
 * 
 * @export
 * @class DynamicTransitionInfo
 * @extends {TransitionInfo}
 */
export class DynamicTransitionInfo<TState> extends TransitionInfo {

  public static create<TState, TTrigger>(
    trigger: TTrigger,
    guards: Iterable<InvocationInfo> | null,
    selector: InvocationInfo,
    possibleStates: DynamicStateInfos<TState> | null): DynamicTransitionInfo<TState> {

    const transition = new DynamicTransitionInfo(
      new TriggerInfo(trigger),
      guards || [],
      selector,
      possibleStates);

    return transition;
  }

  /**
   * Creates an instance of DynamicTransitionInfo.
   * @param {InvocationInfo} _destinationStateSelectorDescription 
   * @param {DynamicStateInfos} _possibleDestinationStates 
   * @param {TriggerInfo} _trigger 
   * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions 
   * @memberof DynamicTransitionInfo
   */
  constructor(
    _trigger: TriggerInfo,
    _guardConditionsMethodDescriptions: Iterable<InvocationInfo>,
    private readonly _destinationStateSelectorDescription: InvocationInfo,
    private readonly _possibleDestinationStates: DynamicStateInfos<TState> | null
  ) {
    super(_trigger, _guardConditionsMethodDescriptions);
  }

  public get destinationStateSelectorDescription(): InvocationInfo { return this._destinationStateSelectorDescription; }

  public get possibleDestinationStates(): DynamicStateInfos<TState> | null { return this._possibleDestinationStates; }
}
