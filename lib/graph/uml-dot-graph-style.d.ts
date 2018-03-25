import { GraphStyle } from './graph-style';
import { SuperState } from './super-state';
import { State } from './state';
/**
 * Generate DOT graphs in basic UML style
 *
 * @class UmlDotGraphStyle
 */
export declare class UmlDotGraphStyle extends GraphStyle {
    getPrefix(): string;
    formatOneCluster(stateInfo: SuperState): string;
    /**Generate the text for a single state
     *
     *
     * @param {State} state The state to generate text for
     * @returns {string}
     * @memberof UmlDotGraphStyle
     */
    formatOneState(state: State): string;
    /**
     * Generate text for a single transition
     *
     * @param {string} sourceNodeName
     * @param {string} trigger
     * @param {Iterable<string>} actions
     * @param {string} destinationNodeName
     * @param {Iterable<string>} guards
     * @returns {string}
     * @memberof UmlDotGraphStyle
     */
    formatOneTransition(sourceNodeName: string, trigger: string, actions: Iterable<string> | null, destinationNodeName: string, guards: Iterable<string>): string;
    /**
     * Generate the text for a single decision node
     *
     * @param {string} nodeName Name of the node
     * @param {string} label Label for the node
     * @returns {string}
     * @memberof UmlDotGraphStyle
     */
    formatOneDecisionNode(nodeName: string, label: string): string;
    formatOneLine(fromNodeName: string, toNodeName: string, label: string): string;
}
