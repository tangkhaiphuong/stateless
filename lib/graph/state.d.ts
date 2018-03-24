import { BaseTransition } from './base-transition';
import { SuperState } from './super-state';
import { StateInfo } from '../reflection/state-info';
/**
 * Used to keep track of a state that has substates
 *
 * @export
 * @class State
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/State.cs
 */
export declare class State {
    private _stateName;
    private _nodeName;
    private _superState;
    private _leaving;
    private _arriving;
    private _entryActions;
    private _exitActions;
    /**
     * The superstate of this state (null if none)
     *
     * @type {(SuperState | null)}
     * @memberof State
     */
    /**
     * The superstate of this state (null if none)
     *
     * @memberof State
     */
    superState: SuperState | null;
    /**
     * List of all transitions that leave this state (never null)
     *
     * @readonly
     * @type {BaseTransition[]}
     * @memberof State
     */
    readonly leaving: BaseTransition[];
    /**
     * List of all transitions that enter this state (never null)
     *
     * @readonly
     * @type {BaseTransition[]}
     * @memberof State
     */
    readonly arriving: BaseTransition[];
    /**
     * Unique name of this object
     *
     * @readonly
     * @type {string}
     * @memberof State
     */
    readonly nodeName: string;
    /**
     * Name of the state represented by this object
     *
     * @readonly
     * @type {string}
     * @memberof State
     */
    readonly stateName: string | null;
    /**
     * Actions that are executed when you enter this state from any trigger
     *
     * @readonly
     * @type {string[]}
     * @memberof State
     */
    readonly entryActions: string[];
    /**
     * Actions that are executed when you exit this state
     *
     * @readonly
     * @type {string[]}
     * @memberof State
     */
    readonly exitActions: string[];
    /**
     * Creates an instance of State.
     * @param {(StateInfo | string)} stateInfoOrNodeName
     * @memberof State
     */
    constructor(stateInfoOrNodeName: StateInfo | string);
}
