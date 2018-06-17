import { StateRepresentation } from './state-pepresentation';
import { StateMachine } from './state-machine';
import { TransitioningTriggerBehaviour } from '../transitioning-trigger-behaviour';
import { TransitionGuard } from '../transition-guard';
import { Transition } from '../transition';
import { InternalTriggerBehaviour } from '../internal-trigger-behaviour';
import { DynamicTriggerBehaviour } from '../dynamic-trigger-behaviour';
import { IgnoredTriggerBehaviour } from '../ignored-trigger-behaviour';
import { ReentryTriggerBehaviour } from '../reentry-trigger-behaviour';
import { InvocationInfo } from '../reflection/invocation-info';
import { DynamicTransitionInfo } from '../reflection/dynamic-transition-info';
import { DynamicStateInfos } from '../reflection/dynamic-state-infos';

/**
 * The configuration for a single state value.
 * 
 * @export
 * @class StateConfiguration
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateConfiguration.cs
 */
export class StateConfiguration<TState, TTrigger, TContext> {

  /**
   * Creates an instance of StateConfiguration.
   * @param {StateMachine<TState, TTrigger, TContext>} _machine 
   * @param {StateRepresentation<TState, TTrigger, TContext>} _representation 
   * @param {(state: TState) => StateRepresentation<TState, TTrigger, TContext>} _lookup 
   * @memberof StateConfiguration
   */
  constructor(
    private readonly _machine: StateMachine<TState, TTrigger, TContext>,
    private readonly _representation: StateRepresentation<TState, TTrigger, TContext>,
    private readonly _lookup: (state: TState) => StateRepresentation<TState, TTrigger, TContext>) {
  }

  /**
   * The state that is configured with this configuration.
   * 
   * @memberof StateConfiguration
   */
  public get state(): TState { return this._representation.underlyingState; }

  /**
   * The machine that is configured with this configuration.
   * 
   * @readonly
   * @type {StateMachine<TState, TTrigger, TContext>}
   * @memberof StateConfiguration
   */
  public get machine(): StateMachine<TState, TTrigger, TContext> { return this._machine; }

  /**
   * Accept the specified trigger and transition to the destination state.
   * 
   * @param {TTrigger} trigger The accepted trigger.
   * @param {TState} destinationState The state that the trigger will cause a transition to.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The reciever.
   * @memberof StateConfiguration
   */
  public permit(trigger: TTrigger, destinationState: TState): StateConfiguration<TState, TTrigger, TContext> {
    this.enforceNotIdentityTransition(destinationState);
    return this.internalPermit(trigger, destinationState);
  }

  /**
   * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
   * 
   * @param {TTrigger} trigger 
   * @param {((context: TContext, ...args: any[]) => boolean | Promise<boolean>)} guard 
   * @param {((context: TContext, transition: Transition<TState, TTrigger, TContext>, ...args: any[]) => any | Promise<any>)} internalAction 
   * @param {(string | null)} [guardDescription=null] A description of the guard condition
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */
  public internalTransitionIf(
    trigger: TTrigger,
    guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>,
    internalAction: (context: TContext, transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>,
    guardDescription: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addTriggerBehaviour(new InternalTriggerBehaviour<TState, TTrigger, TContext>(trigger, guard, (c, t, args) => internalAction(c, t, args), guardDescription));
    return this;
  }

  /**
   * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
   * 
   * @param {TTrigger} trigger 
   * @param {((context: TContext, transition: Transition<TState, TTrigger, TContext>, ...args: any[]) => any | Promise<any>)} entryAction 
   * @param {(string | null)} [description=null] 
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */

  public internalTransition(
    trigger: TTrigger,
    entryAction: (context: TContext, transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>,
    description: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    return this.internalTransitionIf(trigger, () => true, entryAction, description);
  }

  /**
   * Accept the specified trigger and transition to the destination state.
   * 
   * @param {TTrigger} The accepted trigger.
   * @param {TState} destinationState The state that the trigger will cause a transition to.
   * @param {(Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
   * @param {(string | null)} [description=null] 
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */
  public permitIf(
    trigger: TTrigger,
    destinationState: TState,
    guards: Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>),
    description: string | null = null)
    : StateConfiguration<TState, TTrigger, TContext> {
    this.enforceNotIdentityTransition(destinationState);

    if (guards instanceof Array) {
      return this.internalPermitIf(
        trigger,
        destinationState,
        new TransitionGuard(...guards));
    } else {
      return this.internalPermitIf(
        trigger,
        destinationState,
        new TransitionGuard({ guard: guards, description: description }));
    }
  }

  /**
   * Accept the specified trigger, execute exit actions and re-execute entry actions.
   * 
   * @description  Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
   * @param {TTrigger} trigger The accepted trigger.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The reciever.
   * @memberof StateConfiguration
   */
  public permitReentry(trigger: TTrigger): StateConfiguration<TState, TTrigger, TContext> {
    return this.internalPermitReentryIf(trigger, this._representation.underlyingState, null);
  }

  /**
   * Accept the specified trigger, execute exit actions and re-execute entry actions.
   * Reentry behaves as though the configured state transitions to an identical sibling state.
   * 
   * @description Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
   * @param {TTrigger} trigger The accepted trigger.
   * @param {(Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
   * @param {(string | null)} [description=null] The reciever.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */
  public permitReentryIf(
    trigger: TTrigger,
    guards: Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>),
    description: string | null = null)
    : StateConfiguration<TState, TTrigger, TContext> {
    if (guards instanceof Array) {
      return this.internalPermitReentryIf(
        trigger,
        this._representation.underlyingState,
        new TransitionGuard(...guards));
    } else {
      return this.internalPermitReentryIf(
        trigger,
        this._representation.underlyingState,
        new TransitionGuard({ guard: guards, description: description }));
    }
  }

  /**
   * Ignore the specified trigger when in the configured state.
   * 
   * @param {TTrigger} trigger 
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The trigger to ignore.
   * @memberof StateConfigurationThe receiver.
   */
  public ignore(trigger: TTrigger): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addTriggerBehaviour(new IgnoredTriggerBehaviour<TState, TTrigger, TContext>(this.state, trigger));
    return this;
  }

  /**
   * Ignore the specified trigger when in the configured state, if the guard returns true.
   * 
   * @param {TTrigger} trigger The trigger to ignore.
   * @param {TState} state The state to ignore.
   * @param {(Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be ignored.
   * @param {(string | null)} [description=null] Description.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The receiver.
   * @memberof StateConfiguration
   */
  public ignoreIf(
    trigger: TTrigger,
    state: TState,
    guards: Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>),
    description: string | null = null)
    : StateConfiguration<TState, TTrigger, TContext> {

    if (guards instanceof Array) {
      this._representation.addTriggerBehaviour(
        new IgnoredTriggerBehaviour<TState, TTrigger, TContext>(
          state,
          trigger,
          new TransitionGuard(...guards)));
    } else {
      this._representation.addTriggerBehaviour(
        new IgnoredTriggerBehaviour<TState, TTrigger, TContext>(
          state,
          trigger,
          new TransitionGuard({ guard: guards, description: description })));
    }
    return this;
  }

  /**
   * Specify an action that will execute when activating the configured state.
   * 
   * @param {((context: TContext) => any | Promise<any>)} activateAction Action to execute.
   * @param {(string | null)} [activateActionDescription=null] Action description.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */
  public onActivate(
    activateAction: (context: TContext) => any | Promise<any>,
    activateActionDescription: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addActivateAction(activateAction,
      InvocationInfo.create(activateAction, activateActionDescription));
    return this;
  }

  /**
   * Specify an action that will execute when deactivating
   * 
   * @param {((context: TContext) => any | Promise<any>)} deactivateAction Action to execute.
   * @param {(string | null)} [deactivateActionDescription=null] Action description.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */
  public onDeactivate(
    deactivateAction: (context: TContext) => any | Promise<any>,
    deactivateActionDescription: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addDeactivateAction(deactivateAction,
      InvocationInfo.create(deactivateAction, deactivateActionDescription));
    return this;
  }

  /**
   * Specify an action that will execute when transitioning into the configured state.
   * 
   * @param {((context: TContext, transition: Transition<TState, TTrigger, TContext>) => any | Promise<any>)} entryAction Action to execute.
   * @param {(string | null)} [entryActionDescription=null] Action description.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The receiver.
   * @memberof StateConfiguration
   */
  public onEntry(
    entryAction: (context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>,
    entryActionDescription: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addEntryAction(null, entryAction, InvocationInfo.create(entryAction, entryActionDescription));
    return this;
  }

  /**
   * Specify an action that will execute when transitioning into the configured state.
   * 
   * @param {TTrigger} trigger The trigger by which the state must be entered in order for the action to execute.
   * @param {((context: TContext, transition: Transition<TState, TTrigger, TContext>, ...args: any[]) => any | Promise<any>)} entryAction Action to execute, providing details of the transition.
   * @param {string | null} [entryActionDescription] Action description.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The receiver.
   * @memberof StateConfiguration
   */
  public onEntryFrom(
    trigger: TTrigger,
    entryAction: (context: TContext, transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>,
    entryActionDescription: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addEntryAction(trigger, entryAction, InvocationInfo.create(entryAction, entryActionDescription));
    return this;
  }

  /**
   * Specify an action that will execute when transitioning from the configured state.
   * 
   * @param {((context: TContext, transition: Transition<TState, TTrigger, TContext>) => any | Promise<any>)} exitAction Action to execute.
   * @param {string} [exitActionDescription] Action description.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} 
   * @memberof StateConfiguration
   */
  public onExit(
    exitAction: (context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>,
    exitActionDescription: string | null = null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addExitAction(exitAction, InvocationInfo.create(exitAction, exitActionDescription));
    return this;
  }

  /**
   * Sets the superstate that the configured state is a substate of.
   * @description Substates inherit the allowed transitions of their superstate.
   * entry actions for the superstate are executed.
   * Likewise when leaving from the substate to outside the supserstate,
   * exit actions for the superstate will execute.
   * @param {TState} superstate The superstate.
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The receiver.
   * @memberof StateConfiguration
   */
  public substateOf(superstate: TState): StateConfiguration<TState, TTrigger, TContext> {

    const state = this._representation.underlyingState;

    // Check for accidental identical cyclic configuration
    if (state === superstate) {
      throw new Error(`Configuring ${state} as a substate of ${superstate} creates an illegal cyclic configuration.`);
    }

    // Check for accidental identical nested cyclic configuration
    const superstates = new Set<TState>([state]);

    // Build list of super states and check for
    let activeRepresentation = this._lookup(superstate);
    while (!!activeRepresentation.superstate) {
      // Check if superstate is already added to hashset
      if (superstates.has(activeRepresentation.superstate.underlyingState)) {
        throw new Error(`Configuring ${state} as a substate of ${superstate} creates an illegal nested cyclic configuration.`);
      }

      superstates.add(activeRepresentation.superstate.underlyingState);
      activeRepresentation = this._lookup(activeRepresentation.superstate.underlyingState);
    }

    // The check was OK, we can add this
    const superRepresentation = this._lookup(superstate);
    this._representation.superstate = superRepresentation;
    superRepresentation.addSubstate(this._representation);
    return this;
  }

  /**
   * Accept the specified trigger and transition to the destination state, calculated dynamically by the supplied function.
   * 
   * @param {TTrigger} trigger 
   * @param {(context: TContext, args: any[]) => TState} destinationStateSelector Function to calculate the state that the trigger will cause a transition to.
   * @param {(string | null)} [destinationStateSelectorDescription=null]  Optional description of the function to calculate the state .
   * @param {(DynamicStateInfos | null)} [possibleDestinationStates=null] >Optional array of possible destination states (used by output formatters)
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The reciever.
   * @memberof StateConfiguration
   */
  public permitDynamic(
    trigger: TTrigger,
    destinationStateSelector: (context: TContext, args: any[]) => TState,
    destinationStateSelectorDescription: string | null = null,
    possibleDestinationStates: DynamicStateInfos<TState> | null = null
  ): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addTriggerBehaviour(
      new DynamicTriggerBehaviour<TState, TTrigger, TContext>(
        trigger, destinationStateSelector,
        null,       // No transition guard
        DynamicTransitionInfo.create(trigger, null,
          InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription),
          possibleDestinationStates
        )));// Possible states not defined
    return this;
  }

  /**
   * Accept the specified trigger and transition to the destination state, calculated dynamically by the supplied function.
   * 
   * @param {TTrigger} trigger The accepted trigger.
   * @param {(context: TContext, args: any[]) => TState} destinationStateSelector Function to calculate the state that the trigger will cause  transition to.
   * @param {(Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
   * @param {(string | null)} [description=null] 
   * @returns {StateConfiguration<TState, TTrigger, TContext>} The reciever.
   * @memberof StateConfiguration
   */
  public permitDynamicIf(
    trigger: TTrigger,
    destinationStateSelector: (context: TContext, args: any[]) => TState,
    guards: Array<{ guard: (context: TContext, ...args: any[]) => boolean | Promise<boolean>, description?: string | null } | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)> | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>),
    description: string | null = null)
    : StateConfiguration<TState, TTrigger, TContext> {

    if (guards instanceof Array) {
      return this.internalPermitDynamicIf(
        trigger,
        (c, args) => destinationStateSelector(c, args),
        '', // destinationStateSelectorString
        new TransitionGuard<TContext>(...guards),
        null);      // List of possible destination states not specified
    } else {
      return this.internalPermitDynamicIf(
        trigger,
        (c, args) => destinationStateSelector(c, args),
        '', // destinationStateSelectorString
        new TransitionGuard<TContext>({ guard: guards, description: description }),
        null);      // List of possible destination states not specified
    }
  }

  private enforceNotIdentityTransition(destination: TState): any {
    if (destination === this._representation.underlyingState) {
      throw new Error(`permit() (and permitIf()) require that the destination state is not equal to the source state. To accept a trigger without changing state, use either ignore() or permitReentry().`);
    }
  }

  private internalPermit(trigger: TTrigger, destinationState: TState): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addTriggerBehaviour(new TransitioningTriggerBehaviour<TState, TTrigger, TContext>(trigger, destinationState));
    return this;
  }

  private internalPermitIf(trigger: TTrigger, destinationState: TState, transitionGuard: TransitionGuard<TContext>): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addTriggerBehaviour(new TransitioningTriggerBehaviour<TState, TTrigger, TContext>(trigger, destinationState, transitionGuard));
    return this;
  }

  private internalPermitReentryIf(trigger: TTrigger, destinationState: TState, transitionGuard: TransitionGuard<TContext> | null): StateConfiguration<TState, TTrigger, TContext> {
    this._representation.addTriggerBehaviour(new ReentryTriggerBehaviour<TState, TTrigger, TContext>(trigger, destinationState, transitionGuard));
    return this;
  }

  private internalPermitDynamicIf(
    trigger: TTrigger,
    destinationStateSelector: (context: TContext, args: any[]) => TState,
    destinationStateSelectorDescription: string,
    transitionGuard: TransitionGuard<TContext>,
    possibleDestinationStates: DynamicStateInfos<TState> | null
  ): StateConfiguration<TState, TTrigger, TContext> {

    this._representation.addTriggerBehaviour(new DynamicTriggerBehaviour(trigger,
      destinationStateSelector,
      transitionGuard,
      DynamicTransitionInfo.create(trigger,
        transitionGuard.conditions.map(x => x.methodDescription),
        InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription),
        possibleDestinationStates)
    ));
    return this;
  }

  /**
   * Adds internal transition to this state. When entering the current state the state machine will look for an initial transition, and enter the target state.
   *
   * @param {TState} targetState The target initial state
   * @returns {StateConfiguration<TState, TTrigger>} A stateConfiguration object
   * @memberof StateConfiguration
   */
  public initialTransition(targetState: TState): StateConfiguration<TState, TTrigger, TContext> {
    if (this._representation.hasInitialTransition) {
      throw new Error(`This state has already been configured with an inital transition (${this._representation.initialTransitionTarget}).`);
    }
    if (targetState === this.state) {
      throw new Error('Setting the current state as the target destination state is not allowed.');
    }

    this._representation.setInitialTransition(targetState);
    return this;
  }
}
