import { GuardCondition } from './guard-condition';
/**
 * Describes a state transition.
 *
 * @export
 * @class Transition
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitionGuard.cs
 */
export declare class TransitionGuard {
    private readonly _conditions;
    static readonly empty: TransitionGuard;
    constructor(...guards: Array<{
        guard: (() => boolean | Promise<boolean>);
        description: string;
    }>);
    readonly conditions: GuardCondition[];
    /**
     * guards is the list of the guard functions for all guard conditions for this transition
     *
     * @readonly
     * @memberof TransitionGuard
     */
    readonly guards: Array<(() => boolean | Promise<boolean>) | null>;
    /**
     * guardConditionsMet is true if all of the guard functions return true or if there are no guard functions
     *
     * @returns {Promise<boolean>}
     * @memberof TransitionGuard
     */
    readonly guardConditionsMet: Promise<boolean>;
    /**
     *  unmetGuardConditions is a list of the descriptions of all guard conditions whose guard function returns false
     *
     * @returns {(Promise<Array<string | null>>)}
     * @memberof TransitionGuard
     */
    unmetGuardConditions(): Promise<string[]>;
}
