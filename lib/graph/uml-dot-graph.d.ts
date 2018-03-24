import { StateMachineInfo } from '../reflection/state-machine-info';
/**
 * Class to generate a DOT grah in UML format
 *
 * @export
 * @class UmlDotGraph
 */
export declare class UmlDotGraph {
    /**
     * Generate a UML DOT graph from the state machine info
     *
     * @static
     * @param {StateMachineInfo} machineInfo
     * @returns {string}
     * @memberof UmlDotGraph
     */
    static format(machineInfo: StateMachineInfo): string;
}
