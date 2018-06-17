import { Transition } from './transition';
import { StateMachineInfo } from './reflection/state-machine-info';

/**
 * Models behaviour as transitions between a finite set of states.
 * 
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 */
export abstract class StateContext<TState, TTrigger, TContext = undefined> {

  /**
   * Provides an info object which exposes the states, transitions, and actions of this machine.
   * 
   * @param {string} stateType 
   * @param {string} triggerType 
   * @returns {StateMachineInfo<TState>} 
   * @memberof StateMachine
   */
  public abstract getInfo(stateType?: string, triggerType?: string): StateMachineInfo<TState>;

  /**
   * The current state.
   * 
   * @memberof StateMachine
   */
  public abstract set state(state: TState);

  /**
   * The initial state
   * 
   * @type {TState}
   * @memberof StateMachine
   */
  public abstract get state(): TState;

  /**
   * The currently-permissible trigger values.
   * 
   * @readonly
   * @type {Promise<TTrigger[]>}
   * @memberof StateMachine
   */
  public abstract get permittedTriggers(): Promise<TTrigger[]>

  /**
   * The currently-permissible trigger values.
   * 
   * @param {...any[]} args 
   * @returns {Promise<TTrigger[]>} 
   * @memberof StateMachine
   */
  public abstract getPermittedTriggers(...args: any[]): Promise<TTrigger[]>;

  /**
   * Transition from the current state via the specified trigger.
   * The target state is determined by the configuration of the current state.
   * Actions associated with leaving the current state and entering the new one
   * will be invoked.
   * 
   * @param {TTrigger} trigger The trigger to fire.
   * @returns {Promise<void>} 
   * @memberof StateMachine
   * @throws The current state does not allow the trigger to be fired.
   */
  public abstract fire(trigger: TTrigger, ...args: any[]): Promise<void>;

  /**
   * Activates current state. Actions associated with activating the currrent state
   * will be invoked. The activation is idempotent and subsequent activation of the same current state
   * will not lead to re-execution of activation callbacks.
   * 
   * @returns {Promise<void>} 
   * @memberof StateMachine
   */
  public abstract activate(): Promise<void>;

  /**
   * Deactivates current state. Actions associated with deactivating the currrent state
   * will be invoked. The deactivation is idempotent and subsequent deactivation of the same current state
   * will not lead to re-execution of deactivation callbacks.
   * 
   * @returns {Promise<void>} 
   * @memberof StateMachine
   */
  public abstract deactivate(): Promise<void>;

  /**
   * Override the default behaviour of throwing an exception when an unhandled trigger
   *
   * @abstract
   * @param {(((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>) |
   *     ((context: TContext, state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>))} unhandledTriggerAction
   * @returns {*}
   * @memberof StateContext
   */
  public abstract onUnhandledTrigger(unhandledTriggerAction:
    ((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>) |
    ((context: TContext, state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>)): any;

  /**
   * Determine if the state machine is in the supplied state.
   * 
   * @param {TState} state 
   * @returns {boolean} True if the current state is equal to, or a substate of, the supplied state.
   * @memberof StateMachine
   */
  public abstract isInState(state: TState): boolean;

  /**
   * Returns true if <paramref name="trigger"/> can be fired in the current state.
   * 
   * @param {TTrigger} trigger Trigger to test.
   * @returns {boolean} True if the trigger can be fired, false otherwise.
   * @memberof StateMachine
   */
  public abstract canFire(trigger: TTrigger): Promise<boolean>;

  /**
   * Registers a callback that will be invoked every time the statemachine transitions from one state into another.
   * 
   * @param {((transition: Transition<TState, TTrigger>) => any | Promise<any>)} onTransitionAction The action to execute, accepting the details
   * @returns {*} 
   * @memberof StateMachine
   */
  public abstract onTransitioned(onTransitionAction: (transition: Transition<TState, TTrigger>) => any | Promise<any>): any;
}
