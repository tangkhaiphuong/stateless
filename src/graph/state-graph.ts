import { StateMachineInfo } from '../reflection/state-machine-info';
import { GraphStyle } from './graph-style';
import { State } from './state';
import { BaseTransition } from './base-transition';
import { Decision } from './decision';
import { SuperState } from './super-state';
import { StateInfo } from '../reflection/state-info';
import { StayTransition } from './stay-transition';
import { FixedTransition } from './fixed-transition';
import { DynamicTransition } from './dynamic-transition';

/**
 * This class is used to generate a symbolic representation of the
 * graph structure, in preparation for feeding it to a diagram generator 
 * 
 * @export
 * @class StateGraph
 */
export class StateGraph {

  private _state: Map<string, State> = new Map<string, State>();
  private _transition: BaseTransition[] = [];
  private _decisions: Decision[] = [];

  /**
   * List of all states in the graph, indexed by the string representation of the underlying State object.
   * 
   * @readonly
   * @type {Map<string, State>}
   * @memberof StateGraph
   */
  public get states(): Map<string, State> { return this._state; }

  /**
   * List of all transitions in the graph
   * 
   * @readonly
   * @type {BaseTransition[]}
   * @memberof StateGraph
   */
  public get transitions(): BaseTransition[] { return this._transition; }

  /**
   * List of all decision nodes in the graph.  A decision node is generated each time there
   * is a PermitDynamic() transition.
   * 
   * @readonly
   * @type {Decision[]}
   * @memberof StateGraph
   */
  public get decisions(): Decision[] { return this._decisions; }

  /**
   * Creates an instance of StateGraph.
   * @param {StateMachineInfo} machineInfo 
   * @memberof StateGraph
   */
  constructor(machineInfo: StateMachineInfo) {
    // Start with top-level superstates
    this.addSuperstates(machineInfo);

    // // Now add any states that aren't part of a tree
    this.addSingleStates(machineInfo);

    // // Now grab transitions
    this.addTransitions(machineInfo);

    // // Handle "OnEntryFrom"
    this.processOnEntryFrom(machineInfo);
  }

  /**
   * Convert the graph into a string representation, using the specified style.
   * 
   * @param {GraphStyle} style 
   * @returns {string} 
   * @memberof StateGraph
   */
  public toGraph(style: GraphStyle): string {

    let dirgraphText = style.getPrefix();

    // Start with the clusters
    for (const state of this.states.values()) {
      if (state instanceof SuperState) {
        dirgraphText += style.formatOneCluster(state);
      }
    }

    // Next process all non-cluster states
    for (const state of this.states.values()) {
      if ((state instanceof SuperState) || (state instanceof Decision) || (!!state.superState)) {
        continue;
      }
      dirgraphText += style.formatOneState(state);
    }

    // Finally, add decision nodes
    for (const dec of this.decisions) {
      dirgraphText += style.formatOneDecisionNode(dec.nodeName, dec.method.description);
    }

    // now build behaviours
    const transits = style.formatAllTransitions(this.transitions);
    for (const transit of transits) {
      dirgraphText += '\n' + transit;
    }

    dirgraphText += '\n}';

    return dirgraphText;
  }

  /**
   * Process all entry actions that have a "FromTrigger" (meaning they are
   * only executed when the state is entered because the specified trigger
   * was fired).
   * 
   * @private
   * @param {StateMachineInfo} machineInfo 
   * @memberof StateGraph
   */
  private processOnEntryFrom(machineInfo: StateMachineInfo): void {
    for (const stateInfo of machineInfo.states) {
      const state = this.states.get(stateInfo.underlyingState);
      if (!state) {
        throw new Error('Canot get underlying state');
      }
      for (const entryAction of stateInfo.entryActions) {
        if (!!entryAction.fromTrigger) {
          // This 'state' has an 'entryAction' that only fires when it gets the trigger 'entryAction.FromTrigger'
          // Does it have any incoming transitions that specify that trigger?
          for (const transit of state.arriving) {
            if ((transit.executeEntryExitActions)
              && (transit.trigger.underlyingTrigger === entryAction.fromTrigger)) {
              transit.destinationEntryActions.push(entryAction);
            }
          }
        }
      }
    }
  }

  /**
   * Add all transitions to the graph
   * 
   * @private
   * @param {StateMachineInfo} machineInfo 
   * @memberof StateGraph
   */
  private addTransitions(machineInfo: StateMachineInfo): void {
    for (const stateInfo of machineInfo.states) {
      const fromState = this.states.get(stateInfo.underlyingState);
      for (const fix of stateInfo.fixedTransitions) {
        const toState = this.states.get(fix.destinationState.underlyingState);
        if (fromState === toState) {
          const stay = new StayTransition(fromState!, fix.trigger, fix.guardConditionsMethodDescriptions, true);
          this.transitions.push(stay);
          fromState!.leaving.push(stay);
          fromState!.arriving.push(stay);
        } else {
          const trans = new FixedTransition(fromState!, toState!, fix.trigger, fix.guardConditionsMethodDescriptions);
          this.transitions.push(trans);
          fromState!.leaving.push(trans);
          toState!.arriving.push(trans);
        }
      }
      for (const dyno of stateInfo.dynamicTransitions) {
        const decide = new Decision(dyno.destinationStateSelectorDescription, this.decisions.length + 1);
        this.decisions.push(decide);
        const trans = new FixedTransition(fromState!, decide, dyno.trigger,
          dyno.guardConditionsMethodDescriptions);
        this.transitions.push(trans);
        fromState!.leaving.push(trans);
        decide.arriving.push(trans);
        if (!!dyno.possibleDestinationStates) {
          for (const dynamicStateInfo of dyno.possibleDestinationStates) {
            const toState = this.states.get(dynamicStateInfo.destinationState);
            if (!!toState) {
              const dtrans = new DynamicTransition(decide, toState, dyno.trigger, dynamicStateInfo.criterion);
              this.transitions.push(dtrans);
              decide.leaving.push(dtrans);
              toState.arriving.push(dtrans);
            }
          }
        }
      }
      for (const igno of stateInfo.ignoredTriggers) {
        const stay = new StayTransition(fromState!, igno.trigger, igno.guardConditionsMethodDescriptions, false);
        this.transitions.push(stay);
        fromState!.leaving.push(stay);
        fromState!.arriving.push(stay);
      }
    }
  }

  /**
   * Add states to the graph that are neither superstates, nor substates of a superstate.
   * 
   * @private
   * @param {StateMachineInfo} machineInfo 
   * @memberof StateGraph
   */
  private addSingleStates(machineInfo: StateMachineInfo): void {
    for (const stateInfo of machineInfo.states) {
      if (!this.states.has(stateInfo.underlyingState)) {
        this.states.set(stateInfo.underlyingState, new State(stateInfo));
      }
    }
  }

  /**
   * Add superstates to the graph (states that have substates)
   * 
   * @private
   * @memberof StateGraph
   */
  private addSuperstates(machineInfo: StateMachineInfo): void {
    for (const stateInfo of machineInfo.states) {
      if ([...stateInfo.substates].length > 0 && !stateInfo.superstate) {
        const state = new SuperState(stateInfo);
        this.states.set(stateInfo.underlyingState, state);
        this.addSubstates(state, stateInfo.substates);
      }
    }
  }

  private addSubstates(superState: SuperState, substates: Iterable<StateInfo>): void {
    for (const subState of substates) {
      if (this.states.has(subState.underlyingState)) {
        // This shouldn't happen
      } else if ([...subState.substates].length > 0) {
        const sub = new SuperState(subState);
        this.states.set(subState.underlyingState, sub);
        superState.subStates.push(sub);
        sub.superState = superState;
        this.addSubstates(sub, subState.substates);
      } else {
        const sub = new State(subState);
        this.states.set(subState.underlyingState, sub);
        superState.subStates.push(sub);
        sub.superState = superState;
      }
    }
  }
}
