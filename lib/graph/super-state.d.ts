import { State } from './state';
import { StateInfo } from '../reflection/state-info';
/**
 * Used to keep track of a state that has substates
 *
 * @export
 * @class SuperState
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/SuperState.cs
 */
export declare class SuperState extends State {
    private _subStates;
    /**
     * List of states that are a substate of this state
     *
     * @readonly
     * @type {State[]}
     * @memberof SuperState
     */
    readonly subStates: State[];
    /**
     * Creates an instance of SuperState.
     * @param {StateInfo} stateInfo
     * @memberof SuperState
     */
    constructor(stateInfo: StateInfo);
}
