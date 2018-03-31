import { State } from './state';
import { SuperState } from './super-state';
import { Transition } from './transition';
import { StayTransition } from './stay-transition';
import { FixedTransition } from './fixed-transition';
import { DynamicTransition } from './dynamic-transition';
import { InvocationInfo } from '../reflection/invocation-info';

/**
 * Style definition for StateGraph.
 * Provides formatting of individual items in a state graph.
 * 
 * @export
 * @abstract
 * @class GraphStyle
 * @template TState 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/IGraphStyle.cs
 */
export abstract class GraphStyle<TState> {

  /**
   * Get the text that must be present at the top of a state graph file.
   * For example, for DOT files the prefix text would be
   * digraph {
   * 
   * @abstract
   * @returns {string} Prefix text
   * @memberof GraphStyle
   */
  public abstract getPrefix(): string;

  /**
   * Returns the formatted text for a single state.
   * For example, for DOT files this would be the description of a single node:
   * nodename [label="statename"];
   * Usually the information on exit and entry actions would also be included here.
   * 
   * @abstract
   * @param {State<TState>} state The state to generate text for
   * @returns {string} Description of the state in the desired format
   * @memberof GraphStyle
   */
  public abstract formatOneState(state: State<TState>): string;

  /**
   * Returns the formatted text for a single superstate and its substates.
   * For example, for DOT files this would be a subgraph containing nodes for all the substates.
   * 
   * @abstract
   * @param {SuperState<TState>} stateInfo The superstate to generate text for
   * @returns {string} Description of the superstate, and all its substates, in the desired format
   * @memberof GraphStyle
   */
  public abstract formatOneCluster(stateInfo: SuperState<TState>): string;

  /**
   * Returns the formatted text for a single decision node.
   * A decision node is created each time there is a permitDynamic() transition.  There will be a transition
   * from the state that has the dynamic transition to the decision node, and transitions from the decision
   * node to each of the destination nodes.  If the caller did not specify the possible destination states,
   * there will be no transitions leaving the decision node.
   * 
   * @abstract
   * @param {string} nodeName Name of the node
   * @param {string} label Label for the node
   * @returns {string} 
   * @memberof GraphStyle
   */
  public abstract formatOneDecisionNode(nodeName: string, label: string): string;

  /**
   * Returns the formatted text for all the transitions found in the state graph.
   * This form, which can be overridden, determines the type of each transition and passes the appropriate
   * parameters to the virtual formatOneTransition() function.
   * 
   * @param {Iterable<Transition<TState>>} transitions List of all transitions in the state graph
   * @returns {Iterable<string>} Description of all transitions, in the desired format
   * @memberof GraphStyle
   */
  public * formatAllTransitions(transitions: Iterable<Transition<TState>>): Iterable<string> {

    const iterableDescription = function* (guards: Iterable<InvocationInfo>): Iterable<string> {
      for (const item of guards) {
        yield item.description;
      }
    };

    for (const transit of transitions) {
      let line: string;
      if (transit instanceof StayTransition) {

        if (!transit.executeEntryExitActions) {
          line = this.formatOneTransition(transit.sourceState.nodeName, `${transit.trigger.underlyingTrigger}`,
            null, transit.sourceState.nodeName, iterableDescription(transit.guards));
        } else if (transit.sourceState.entryActions.length === 0) {
          line = this.formatOneTransition(transit.sourceState.nodeName, `${transit.trigger.underlyingTrigger}`,
            null, transit.sourceState.nodeName, iterableDescription(transit.guards));
        } else {
          // There are entry functions into the state, so call out that this transition
          // does invoke them (since normally a transition back into the same state doesn't)
          line = this.formatOneTransition(transit.sourceState.nodeName, `${transit.trigger.underlyingTrigger}`,
            transit.sourceState.entryActions, transit.sourceState.nodeName, iterableDescription(transit.guards));
        }
      } else {
        if (transit instanceof FixedTransition) {
          line = this.formatOneTransition(transit.sourceState.nodeName, `${transit.trigger.underlyingTrigger}`,
            transit.destinationEntryActions.map(x => x.method.description),
            transit.destinationState.nodeName, iterableDescription(transit.guards));
        } else {
          if (transit instanceof DynamicTransition) {
            line = this.formatOneTransition(transit.sourceState.nodeName, `${transit.trigger.underlyingTrigger}`,
              transit.destinationEntryActions.map(x => x.method.description),
              transit.destinationState.nodeName, [transit.criterion]);
          } else {
            throw new Error('Unexpected transition type');
          }
        }
      }
      if (!!line) {
        yield line;
      }
    }
  }

  /**
   * Returns the formatted text for a single transition.  Only required if the default version of
   * formatAllTransitions() is used.
   * 
   * @param {string} _source NodeName Node name of the source state node
   * @param {string} _trigger Name of the trigger
   * @param {Iterable<string>} _actions List of entry and exit actions (if any)
   * @param {string} _destinationNodeName 
   * @param {Iterable<string>} _guards List of guards (if any)
   * @returns {string} 
   * @memberof GraphStyle
   */
  public formatOneTransition(_sourceNodeName: string, _trigger: string, _actions: Iterable<string> | null, _destinationNodeName: string, _guards: Iterable<string>): string {
    throw new Error('If you use GraphStyle.formatAllTransitions() you must implement an override of formatOneTransition()');
  }

}
