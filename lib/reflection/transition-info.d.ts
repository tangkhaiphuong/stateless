import { TriggerInfo } from './trigger-info';
import { InvocationInfo } from './invocation-info';
/**
 * Presentation transition information.
 *
 * @export
 * @abstract
 * @class TransitionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TransitionInfo.cs
 */
export declare class TransitionInfo {
    private readonly _trigger;
    private readonly _guardConditionsMethodDescriptions;
    /**
     * Creates an instance of TransitionInfo.
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof TransitionInfo
     */
    constructor(_trigger: TriggerInfo, _guardConditionsMethodDescriptions: Iterable<InvocationInfo>);
    /**
     * The trigger whose firing resulted in this transition.
     *
     * @readonly
     * @type {TriggerInfo}
     * @memberof TransitionInfo
     */
    readonly trigger: TriggerInfo;
    /**
     *  Method descriptions of the guard conditions.
     * Returns a non-null but empty list if there are no guard conditions
     *
     * @type {InvocationInfo}
     * @memberof TransitionInfo
     */
    readonly guardConditionsMethodDescriptions: Iterable<InvocationInfo>;
}
