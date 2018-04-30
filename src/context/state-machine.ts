import { StateConfiguration } from './state-configuration';
import { StateRepresentation } from './state-pepresentation';
import { StateMachineInfo } from '../reflection/state-machine-info';
import { StateInfo } from '../reflection/state-info';
import { TransitioningTriggerBehaviour } from '../transitioning-trigger-behaviour';
import { StateContext } from './state-context';
import { FiringMode } from '../firing-mode';

/**
 * Models behaviour as transitions between a finite set of states.
 * 
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateMachine.cs
 */
export class StateMachine<TState, TTrigger, TContext> {

  private readonly _stateConfiguration: Map<TState, StateRepresentation<TState, TTrigger, TContext>> = new Map<TState, StateRepresentation<TState, TTrigger, TContext>>();

  /**
   * Provides an info object which exposes the states, transitions, and actions of this machine.
   * 
   * @param {string} stateType 
   * @param {string} triggerType 
   * @returns {StateMachineInfo<TState>} 
   * @memberof StateMachine
   */
  public getInfo(
    stateType: string = 'State',
    triggerType: string = 'Trigger'): StateMachineInfo<TState> {

    const representations = new Map<TState, StateRepresentation<TState, TTrigger, TContext>>(this._stateConfiguration);

    const except: Set<TState> = new Set<TState>(representations.keys());

    const destinations: Set<TState> = new Set<TState>();

    for (const kvp of this._stateConfiguration) {
      for (const behaviours of kvp['1'].triggerBehaviours.values()) {
        for (const item of behaviours) {
          if (item instanceof TransitioningTriggerBehaviour) {
            destinations.add(item.destination);
          }
        }
      }
    }
    const reachable: Array<StateRepresentation<TState, TTrigger, TContext>> = [];
    for (const underlying of destinations) {
      if (except.has(underlying)) {
        continue;
      }
      reachable.push(new StateRepresentation<TState, TTrigger, TContext>(underlying));
    }

    for (const representation of reachable) {
      representations.set(representation.underlyingState, representation);
    }

    const info = new Map<TState, StateInfo<TState>>();
    for (const item of representations) {
      info.set(item[0], StateInfo.createStateInfo<TState, TTrigger>(item[1] as any));
    }

    for (const state of info) {
      const stateRepresentation = representations.get(state[0]);
      if (!stateRepresentation) { continue; }
      StateInfo.addRelationships(state[1], stateRepresentation as any, (k: TState) => {
        const result = info.get(k);
        if (!result) { throw new Error('Cannot lookup state'); }
        return result;
      });
    }

    return new StateMachineInfo([...(info.values() || [])], stateType, triggerType);
  }

  private getRepresentation(state: TState): StateRepresentation<TState, TTrigger, TContext> {
    let result = this._stateConfiguration.get(state);
    if (!result) {
      result = new StateRepresentation(state);
      this._stateConfiguration.set(state, result);
    }
    return result;
  }

  /**
   * Begin configuration of the entry/exit actions and allowed transitions
   * when the state machine is in a particular state.
   * 
   * @param {TState} state The state to configure.
   * @returns {StateConfiguration<TState, TTrigger>} >A configuration object through which the state can be configured.
   * @memberof StateMachine
   */
  public configure(state: TState): StateConfiguration<TState, TTrigger, TContext> {
    return new StateConfiguration(this, this.getRepresentation(state), this.getRepresentation.bind(this));
  }

  /**
   * Create state context.
   * 
   * @param {TContext} context 
   * @param {(TState | { accessor: (context: TContext) => TState; mutator: (context: TContext, state: TState) => any; })} initialState 
   * @returns {StateContext<TState, TTrigger, TContext>} 
   * @memberof StateMachine
   */
  public createStateContext(
    context: TContext,
    initialState: TState | { accessor: (context: TContext) => TState; mutator: (context: TContext, state: TState) => any; },
    firingMode: FiringMode = FiringMode.Queued
  ): StateContext<TState, TTrigger, TContext> {
    return new StateContext(this._stateConfiguration, this.getRepresentation.bind(this), context, initialState, firingMode);
  }
}
