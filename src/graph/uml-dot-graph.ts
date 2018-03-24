import { StateMachineInfo } from '../reflection/state-machine-info';
import { UmlDotGraphStyle } from './uml-dot-graph-style';
import { StateGraph } from './state-graph';

/**
 * Class to generate a DOT grah in UML format
 * 
 * @export
 * @class UmlDotGraph
 */
export class UmlDotGraph {

  /**
   * Generate a UML DOT graph from the state machine info
   * 
   * @static
   * @param {StateMachineInfo} machineInfo 
   * @returns {string} 
   * @memberof UmlDotGraph
   */
  public static format(machineInfo: StateMachineInfo, ): string {
    const graph = new StateGraph(machineInfo);
    return graph.toGraph(new UmlDotGraphStyle());
  }
}
