/**
 * Describes a state transition.
 *
 * @export
 * @class Transition
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Transition.cs
 */
export declare class Transition<TState, TTrigger> {
    private readonly _source;
    private readonly _destination;
    private readonly _trigger;
    /**
     * Creates an instance of Transition.
     * @param {TState} _source The state transitioned from.
     * @param {TState} _destination The state transitioned to
     * @param {TTrigger} _trigger The trigger that caused the transition.
     * @memberof Transition
     */
    constructor(_source: TState, _destination: TState, _trigger: TTrigger);
    /**
     * The state transitioned from.
     *
     * @readonly
     * @memberof Transition
     */
    readonly source: TState;
    /**
     * The state transitioned to.
     *
     * @readonly
     * @memberof Transition
     */
    readonly destination: TState;
    /**
     * The trigger that caused the transition.
     *
     * @readonly
     * @memberof Transition
     */
    readonly trigger: TTrigger;
    /**
     * True if the transition is a re-entry, i.e. the identity transition.
     *
     * @readonly
     * @type {boolean}
     * @memberof Transition
     */
    readonly isReentry: boolean;
}
