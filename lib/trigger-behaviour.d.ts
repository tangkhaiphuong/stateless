import { TransitionGuard } from './transition-guard';
/**
 * Define trigger behaviour.
 *
 * @export
 * @abstract
 * @class TriggerBehaviour
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviour.cs
 */
export declare abstract class TriggerBehaviour<TState, TTrigger> {
    private readonly _trigger;
    private readonly _guard;
    /**
     * Creates an instance of TriggerBehaviour.
     * @param {TTrigger} _trigger
     * @param {TransitionGuard<TState, TTrigger>} _guard TransitionGuard (null if no guard function)
     * @memberof TriggerBehaviour
     */
    constructor(_trigger: TTrigger, _guard?: TransitionGuard);
    readonly trigger: TTrigger;
    /**
     * Guard is the transition guard for this trigger.  Equal to TransitionGuard.Empty if there is no transition guard
     *
     * @readonly
     * @type {TransitionGuard}
     * @memberof TriggerBehaviour
     */
    readonly guard: TransitionGuard;
    /**
     * Guards is the list of guard functions for the transition guard for this trigger
     *
     * @readonly
     * @memberof TriggerBehaviour
     */
    readonly guards: Array<(() => boolean | Promise<boolean>) | null>;
    /**
     * GuardConditionsMet is true if all of the guard functions return true or if there are no guard functions
     *
     * @readonly
     * @type {boolean}
     * @memberof TriggerBehaviour
     */
    readonly guardConditionsMet: Promise<boolean>;
    /**
     * UnmetGuardConditions is a list of the descriptions of all guard conditionswhose guard function returns false
     *
     * @template string
     * @memberof TriggerBehaviour
     */
    readonly unmetGuardConditions: Promise<string[]>;
    abstract resultsInTransitionFrom(source: TState, args: any[]): Promise<[boolean, TState]>;
}
