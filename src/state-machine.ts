import { UnhandledTriggerAction } from './unhandled-trigger-action';
import { OnTransitionedEvent } from './on-transitioned-event';
import { StateConfiguration } from './state-configuration';
import { StateRepresentation } from './state-pepresentation';
import { StateMachineInfo } from './reflection/state-machine-info';
import { Transition } from './transition';
import { StateInfo } from './reflection/state-info';
import { TransitioningTriggerBehaviour } from './transitioning-trigger-behaviour';

/**
 * Models behaviour as transitions between a finite set of states.
 * 
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateMachine.cs
 */
export class StateMachine<TState, TTrigger> {

  private readonly _stateConfiguration: Map<TState, StateRepresentation<TState, TTrigger>> = new Map<TState, StateRepresentation<TState, TTrigger>>();
  private readonly _stateAccessor: () => TState;
  private readonly _stateMutator: (state: TState) => void;
  private _unhandledTriggerAction: UnhandledTriggerAction<TState, TTrigger>;
  private readonly _onTransitionedEvent: OnTransitionedEvent<TState, TTrigger>;
  private readonly _eventQueue: Array<{ trigger: TTrigger; args: any[]; }> = [];

  private _firing: boolean = false;

  /**
   * Creates an instance of StateMachine.
   * @param {(TState | { stateAccessor: () => TState; stateMutator: (state: TState) => void; })} initialState 
   * @memberof StateMachine
   */
  constructor(initialState: TState | { accessor: () => TState; mutator: (state: TState) => void; }) {
    const checkObject = initialState as any;
    if (!!checkObject.accessor || !!checkObject.mutator) {
      this._stateAccessor = checkObject.accessor;
      this._stateMutator = checkObject.mutator;
    } else {
      const stateReference = { state: initialState as TState };
      this._stateAccessor = function (): TState { return stateReference.state; };
      this._stateMutator = function (state: TState) { stateReference.state = state; };
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
    this._stateMutator(state);
  }

  /**
   * The initial state
   * 
   * @type {TState}
   * @memberof StateMachine
   */
  public get state(): TState {
    return this._stateAccessor();
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
    return this.currentRepresentation.getPermittedTriggers(args);
  }

  /**
   * Get current presentation.
   * 
   * @readonly
   * @type {StateRepresentation<TState, TTrigger>}
   * @memberof StateMachine
   */
  public get currentRepresentation(): StateRepresentation<TState, TTrigger> {
    return this.getRepresentation(this.state);
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

    const representations = new Map<TState, StateRepresentation<TState, TTrigger>>(this._stateConfiguration);

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
    const reachable: Array<StateRepresentation<TState, TTrigger>> = [];
    for (const underlying of destinations) {
      if (except.has(underlying)) {
        continue;
      }
      reachable.push(new StateRepresentation<TState, TTrigger>(underlying));
    }

    for (const representation of reachable) {
      representations.set(representation.underlyingState, representation);
    }

    const state = this.state;
    const info = new Map<TState, StateInfo<TState>>();
    for (const item of representations) {
      info.set(item[0], StateInfo.createStateInfo<TState, TTrigger>(item[1], state === item[1].underlyingState));
    }

    for (const state of info) {
      const stateRepresentation = representations.get(state[0]);
      if (!stateRepresentation) { continue; }
      StateInfo.addRelationships(state[1], stateRepresentation, (k: TState) => {
        const result = info.get(k);
        if (!result) { throw new Error('Cannot lookup state'); }
        return result;
      });
    }

    return new StateMachineInfo([...(info.values() || [])], stateType, triggerType);
  }

  private getRepresentation(state: TState): StateRepresentation<TState, TTrigger> {
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
  public configure(state: TState): StateConfiguration<TState, TTrigger> {
    return new StateConfiguration(this, this.getRepresentation(state), this.getRepresentation.bind(this));
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
    const representativeState = this.getRepresentation(this.state);
    await representativeState.activate();
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
    const representativeState = this.getRepresentation(this.state);
    await representativeState.deactivate();
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
    const representativeState = this.getRepresentation(source);

    const [result, handler] = await representativeState.tryFindHandler(trigger, args);
    if (!result || !handler) {
      await this._unhandledTriggerAction.execute(representativeState.underlyingState, trigger, !!handler ? handler.unmetGuardConditions : []);
      return;
    }

    const [result2, destination] = await handler.handler.resultsInTransitionFrom(source, args);
    if (result2) {

      let transition = new Transition<TState, TTrigger>(source, destination, trigger);

      transition = await representativeState.exit(transition);

      this.state = transition.destination;
      const newRepresentation = this.getRepresentation(transition.destination);
      this._onTransitionedEvent.invoke(transition);

      await newRepresentation.enter(transition, args);

    } else {

      const transition = new Transition<TState, TTrigger>(source, destination, trigger);

      await this.currentRepresentation.internalAction(transition, args);
    }
  }

  /**
   * Override the default behaviour of throwing an exception when an unhandled trigger
   * 
   * @param {((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>)} unhandledTriggerAction >An action to call when an unhandled trigger is fired.
   * @memberof StateMachine
   */
  public onUnhandledTrigger(unhandledTriggerAction: (state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>): void {
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
    return this.currentRepresentation.canHandle(trigger);
  }

  /**
   *  A human-readable representation of the state machine.
   * 
   * @returns {string} A description of the current state and permitted triggers.
   * @memberof StateMachine
   */
  public async toString(): Promise<string> {
    return `StateMachine { state = ${this.state}, permittedTriggers = { ${(await this.permittedTriggers).join(', ')} }}`;
  }

  private defaultUnhandledTriggerAction(state: TState, trigger: TTrigger, unmetGuardConditions: string[]) {
    const source = state;
    this.getRepresentation(source);

    if (!unmetGuardConditions || unmetGuardConditions.length === 0) {
      throw new Error(`Trigger '${trigger}' is valid for transition from state '${state}' but a guard conditions are not met. Guard descriptions: '${unmetGuardConditions}'.`);
    }

    throw new Error(`No valid leaving transitions are permitted from state '${trigger}' for trigger '${state}'. Consider ignoring the trigger.`);
  }

  /**
   * Registers a callback that will be invoked every time the statemachine transitions from one state into another.
   * 
   * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} onTransitionAction The action to execute, accepting the details
   * @memberof StateMachine
   */
  public onTransitioned(onTransitionAction: ((transition: Transition<TState, TTrigger>) => any | Promise<any>)): void {
    this._onTransitionedEvent.register(onTransitionAction);
  }

}
