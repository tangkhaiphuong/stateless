import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { Transition } from './transition';
import { InvocationInfo } from '../reflection/invocation-info';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L45
 */
export declare class FixedTransition extends Transition {
    private _destinationState;
    private _guards;
    /**
     * The state where this transition finishes
     *
     * @readonly
     * @type {State}
     * @memberof FixedTransition
     */
    readonly destinationState: State;
    /**
     * Guard functions for this transition (null if none)
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof FixedTransition
     */
    readonly guards: Iterable<InvocationInfo>;
    /**
     * Creates an instance of FixedTransition.
     * @param {State} sourceState
     * @param {State} _destinationState
     * @param {TriggerInfo} trigger
     * @param {Iterable<InvocationInfo>} _guards
     * @memberof FixedTransition
     */
    constructor(sourceState: State, _destinationState: State, trigger: TriggerInfo, _guards: Iterable<InvocationInfo>);
}
