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
export declare class DynamicTransitionInfo extends TransitionInfo {
    private readonly _destinationStateSelectorDescription;
    private readonly _possibleDestinationStates;
    static create<TTrigger>(trigger: TTrigger, guards: Iterable<InvocationInfo> | null, selector: InvocationInfo, possibleStates: DynamicStateInfos | null): DynamicTransitionInfo;
    /**
     * Creates an instance of DynamicTransitionInfo.
     * @param {InvocationInfo} _destinationStateSelectorDescription
     * @param {DynamicStateInfos} _possibleDestinationStates
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof DynamicTransitionInfo
     */
    constructor(_trigger: TriggerInfo, _guardConditionsMethodDescriptions: Iterable<InvocationInfo>, _destinationStateSelectorDescription: InvocationInfo, _possibleDestinationStates: DynamicStateInfos | null);
    readonly destinationStateSelectorDescription: InvocationInfo;
    readonly possibleDestinationStates: DynamicStateInfos | null;
}
