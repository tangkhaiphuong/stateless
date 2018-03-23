import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { Transition } from './transition';
import { InvocationInfo } from '../reflection/invocation-info';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L85
 */
export declare class StayTransition extends Transition {
    private _guards;
    readonly guards: Iterable<InvocationInfo>;
    /**
     * Creates an instance of StayTransition.
     * @param {State} sourceState
     * @param {TriggerInfo} trigger
     * @param {Iterable<InvocationInfo>} _guards
     * @param {boolean} executeEntryExitActions
     * @memberof StayTransition
     */
    constructor(sourceState: State, trigger: TriggerInfo, _guards: Iterable<InvocationInfo>, executeEntryExitActions: boolean);
}
