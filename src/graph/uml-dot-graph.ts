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
   * @template TState 
   * @param {StateMachineInfo<TState>} machineInfo State machine information.
   * @param {boolean} [isVisibleCurrentState=false] Visible current state or not.
   * @returns {string} 
   * @memberof UmlDotGraph
   */
  public static format<TState>(
    machineInfo: StateMachineInfo<TState>,
    isVisibleCurrentState: boolean = false): string {
    const graph = new StateGraph(machineInfo);
    return graph.toGraph(new UmlDotGraphStyle(isVisibleCurrentState));
  }
}
