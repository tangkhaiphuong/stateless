import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { ActionInfo } from '../reflection/action-info';
/**
 * Used to keep track of transitions between states
 *
 * @export
 * @class Transition
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs
 */
export declare abstract class BaseTransition {
    private _sourceState;
    private _trigger;
    protected _executeEntryExitActions: boolean;
    /**
     * The trigger that causes this transition
     *
     * @readonly
     * @type {TriggerInfo}
     * @memberof Transition
     */
    readonly trigger: TriggerInfo;
    /**
     * List of actions to be performed by the destination state (the one being entered)
     *
     * @readonly
     * @type {ActionInfoơ}
     * @memberof Transition
     */
    destinationEntryActions: ActionInfo[];
    /**
     * Should the entry and exit actions be executed when this transition takes place
     *
     * @readonly
     * @type {boolean}
     * @memberof Transition
     */
    readonly executeEntryExitActions: boolean;
    /**
     * The state where this transition starts
     *
     * @readonly
     * @type {State}
     * @memberof Transition
     */
    readonly sourceState: State;
    /**
     * Creates an instance of Transition.
     * @param {State} _sourceState
     * @param {TriggerInfo} _trigger
     * @memberof Transition
     */
    constructor(_sourceState: State, _trigger: TriggerInfo);
}
