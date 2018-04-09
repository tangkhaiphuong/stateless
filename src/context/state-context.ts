import * as _ from '../state-context';
import { Transition } from '../transition';
import { UnhandledTriggerAction } from '../unhandled-trigger-action';
import { OnTransitionedEvent } from '../on-transitioned-event';
import { StateRepresentation } from './state-pepresentation';
import { StateMachineInfo } from '../reflection/state-machine-info';
import { TransitioningTriggerBehaviour } from '../transitioning-trigger-behaviour';
import { StateInfo } from '../reflection/state-info';

/**
 * Models behaviour as transitions between a finite set of states.
 *
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateMachine.cs
 */
export class StateContext<TState, TTrigger, TContext> extends _.StateContext<TState, TTrigger> {

  private readonly _stateAccessor: (context: TContext) => TState;
  private readonly _stateMutator: (context: TContext, state: TState) => any;
  private _unhandledTriggerAction: UnhandledTriggerAction<TState, TTrigger>;
  private readonly _onTransitionedEvent: OnTransitionedEvent<TState, TTrigger>;
  private readonly _eventQueue: Array<{ trigger: TTrigger; args: any[]; }> = [];

  private _firing: boolean = false;
  private readonly _active: { value: boolean } = { value: false };

  constructor(
    private readonly _stateConfiguration: Map<TState, StateRepresentation<TState, TTrigger, TContext>>,
    private readonly _getRepresentation: (state: TState) => StateRepresentation<TState, TTrigger, TContext>,
    private readonly context: TContext,
    initialState: TState | { accessor: (context: TContext) => TState; mutator: (context: TContext, state: TState) => any; }) {
    super();
    const checkObject = initialState as any;
    if (!!checkObject.accessor || !!checkObject.mutator) {
      this._stateAccessor = checkObject.accessor;
      this._stateMutator = checkObject.mutator;
    } else {
      const stateReference = { state: initialState as TState };
      this._stateAccessor = function (_: TContext): TState { return stateReference.state; };
      this._stateMutator = function (_: TContext, state: TState) { stateReference.state = state; };
    }
    this._unhandledTriggerAction = new UnhandledTriggerAction(this.defaultUnhandledTriggerAction.bind(this));
    this._onTransitionedEvent = new OnTransitionedEvent();
  }

  /**
   * The current state.
   * 
   * @memberof StateMachine
   */
  public set state(state: TState) {
    this._stateMutator(this.context, state);
  }

  /**
   * The initial state
   * 
   * @type {TState}
   * @memberof StateMachine
   */
  public get state(): TState {
    return this._stateAccessor(this.context);
  }

  private defaultUnhandledTriggerAction(state: TState, trigger: TTrigger, unmetGuardConditions: string[]) {

    if (!unmetGuardConditions || unmetGuardConditions.length === 0) {
      throw new Error(`Trigger '${trigger}' is valid for transition from state '${state}' but a guard conditions are not met. Guard descriptions: '${unmetGuardConditions}'.`);
    }

    throw new Error(`No valid leaving transitions are permitted from state '${trigger}' for trigger '${state}'. Consider ignoring the trigger.`);
  }

  /**
   * The currently-permissible trigger values.
   * 
   * @readonly
   * @type {Promise<TTrigger[]>}
   * @memberof StateMachine
   */
  public get permittedTriggers(): Promise<TTrigger[]> {
    return this.getPermittedTriggers();
  }

  /**
   * The currently-permissible trigger values.
   * 
   * @param {...any[]} args 
   * @returns {Promise<TTrigger[]>} 
   * @memberof StateMachine
   */
  public getPermittedTriggers(...args: any[]): Promise<TTrigger[]> {
    return this.currentRepresentation.getPermittedTriggers(this.context, args);
  }

  /**
   * Get current presentation.
   * 
   * @readonly
   * @type {StateRepresentation<TState, TTrigger>}
   * @memberof StateMachine
   */
  private get currentRepresentation(): StateRepresentation<TState, TTrigger, TContext> {
    return this._getRepresentation(this.state);
  }

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
  public async fire(trigger: TTrigger, ...args: any[]): Promise<void> {
    return this.internalFire(trigger, args);
  }

  /**
   * Activates current state. Actions associated with activating the currrent state
   * will be invoked. The activation is idempotent and subsequent activation of the same current state
   * will not lead to re-execution of activation callbacks.
   * 
   * @returns {Promise<void>} 
   * @memberof StateMachine
   */
  public async activate(): Promise<void> {
    const representativeState = this._getRepresentation(this.state);
    await representativeState.activate(this.context, this._active);
  }

  /**
   * Deactivates current state. Actions associated with deactivating the currrent state
   * will be invoked. The deactivation is idempotent and subsequent deactivation of the same current state
   * will not lead to re-execution of deactivation callbacks.
   * 
   * @returns {Promise<void>} 
   * @memberof StateMachine
   */
  public async deactivate(): Promise<void> {
    const representativeState = this._getRepresentation(this.state);
    await representativeState.deactivate(this.context, this._active);
  }

  /**
   *  Queue events and then fire in order.
   * If only one event is queued, this behaves identically to the non-queued version.
   * 
   * @private
   * @param {TTrigger} trigger The trigger.
   * @param {...any[]} args A variable-length parameters list containing arguments.
   * @returns {Promise<void>} 
   * @memberof StateMachine
   */
  private async internalFire(trigger: TTrigger, args: any[]): Promise<void> {
    if (this._firing) {
      this._eventQueue.push({ trigger, args });
      return;
    }

    try {
      this._firing = true;

      await this.internalFireOne(trigger, args);

      while (this._eventQueue.length !== 0) {
        const queuedEvent = this._eventQueue.shift();
        if (!!queuedEvent) {
          await this.internalFireOne(queuedEvent.trigger, queuedEvent.args);
        } else { break; }
      }
    }
    finally {
      this._firing = false;
    }
  }

  private async internalFireOne(trigger: TTrigger, args: any[]): Promise<void> {

    const source = this.state;
    const representativeState = this._getRepresentation(source);

    const [result, handler] = await representativeState.tryFindHandler(this.context, trigger, args);
    if (!result || !handler) {
      await this._unhandledTriggerAction.execute(representativeState.underlyingState, trigger, !!handler ? handler.unmetGuardConditions : []);
      return;
    }

    const [result2, destination] = await handler.handler.resultsInTransitionFrom(source, args);
    if (result2) {

      let transition = new Transition<TState, TTrigger>(source, destination, trigger);

      transition = await representativeState.exit(this.context, transition);

      this.state = transition.destination;
      const newRepresentation = this._getRepresentation(transition.destination);
      this._onTransitionedEvent.invoke(transition);

      await newRepresentation.enter(this.context, transition, args);

    } else {

      const transition = new Transition<TState, TTrigger>(source, destination, trigger);

      await this.currentRepresentation.internalAction(this.context, transition, args);
    }
  }

  /**
   * Override the default behaviour of throwing an exception when an unhandled trigger
   * 
   * @param {((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>)} unhandledTriggerAction >An action to call when an unhandled trigger is fired.
   * @memberof StateMachine
   */
  public onUnhandledTrigger(unhandledTriggerAction: (state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>): any {
    this._unhandledTriggerAction = new UnhandledTriggerAction<TState, TTrigger>(unhandledTriggerAction);
  }

  /**
   * Determine if the state machine is in the supplied state.
   * 
   * @param {TState} state 
   * @returns {boolean} True if the current state is equal to, or a substate of, the supplied state.
   * @memberof StateMachine
   */
  public isInState(state: TState): boolean {
    return this.currentRepresentation.isIncludedIn(state);
  }

  /**
   * Returns true if <paramref name="trigger"/> can be fired in the current state.
   * 
   * @param {TTrigger} trigger Trigger to test.
   * @returns {boolean} True if the trigger can be fired, false otherwise.
   * @memberof StateMachine
   */
  public canFire(trigger: TTrigger): Promise<boolean> {
    return this.currentRepresentation.canHandle(this.context, trigger);
  }

  /**
   * Registers a callback that will be invoked every time the statemachine transitions from one state into another.
   * 
   * @param {((transition: Transition<TState, TTrigger>) => any | Promise<any>)} onTransitionAction The action to execute, accepting the details
   * @returns {*} 
   * @memberof StateMachine
   */
  public onTransitioned(onTransitionAction: (transition: Transition<TState, TTrigger>) => any | Promise<any>): any {
    this._onTransitionedEvent.register(onTransitionAction);
  }

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

    const state = this.state;
    const info = new Map<TState, StateInfo<TState>>();
    for (const item of representations) {
      info.set(item[0], StateInfo.createStateInfo<TState, TTrigger>(item[1] as any, state === item[1].underlyingState));
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

    return new StateMachineInfo<TState>([...(info.values() || [])], stateType, triggerType);
  }
}
