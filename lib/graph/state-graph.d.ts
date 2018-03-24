import { StateMachineInfo } from '../reflection/state-machine-info';
import { GraphStyle } from './graph-style';
import { State } from './state';
import { BaseTransition } from './base-transition';
import { Decision } from './decision';
/**
 * This class is used to generate a symbolic representation of the
 * graph structure, in preparation for feeding it to a diagram generator
 *
 * @export
 * @class StateGraph
 */
export declare class StateGraph {
    private _state;
    private _transition;
    private _decisions;
    /**
     * List of all states in the graph, indexed by the string representation of the underlying State object.
     *
     * @readonly
     * @type {Map<string, State>}
     * @memberof StateGraph
     */
    readonly states: Map<string, State>;
    /**
     * List of all transitions in the graph
     *
     * @readonly
     * @type {BaseTransition[]}
     * @memberof StateGraph
     */
    readonly transitions: BaseTransition[];
    /**
     * List of all decision nodes in the graph.  A decision node is generated each time there
     * is a PermitDynamic() transition.
     *
     * @readonly
     * @type {Decision[]}
     * @memberof StateGraph
     */
    readonly decisions: Decision[];
    /**
     * Creates an instance of StateGraph.
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    constructor(machineInfo: StateMachineInfo);
    /**
     * Convert the graph into a string representation, using the specified style.
     *
     * @param {GraphStyle} style
     * @returns {string}
     * @memberof StateGraph
     */
    toGraph(style: GraphStyle): string;
    /**
     * Process all entry actions that have a "FromTrigger" (meaning they are
     * only executed when the state is entered because the specified trigger
     * was fired).
     *
     * @private
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    private processOnEntryFrom(machineInfo);
    /**
     * Add all transitions to the graph
     *
     * @private
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    private addTransitions(machineInfo);
    /**
     * Add states to the graph that are neither superstates, nor substates of a superstate.
     *
     * @private
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    private addSingleStates(machineInfo);
    /**
     * Add superstates to the graph (states that have substates)
     *
     * @private
     * @memberof StateGraph
     */
    private addSuperstates(machineInfo);
    private addSubstates(superState, substates);
}
