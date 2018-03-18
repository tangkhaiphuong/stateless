import { StateRepresentation } from './state-pepresentation';
import { StateMachine } from './state-machine';
import { TransitioningTriggerBehaviour } from './transitioning-trigger-behaviour';
import { TransitionGuard } from './transition-guard';
import { Transition } from './transition';
import { InternalTriggerBehaviour } from './internal-trigger-behaviour';
import { DynamicTriggerBehaviour } from './dynamic-trigger-behaviour';
import { IgnoredTriggerBehaviour } from './ignored-trigger-behaviour';
import { InvocationInfo } from './reflection/invocation-info';
import { DynamicTransitionInfo } from './reflection/dynamic-transition-info';
import { DynamicStateInfos } from './reflection/dynamic-state-infos';

/**
 * The configuration for a single state value.
 * 
 * @export
 * @class StateConfiguration
 * @template TState 
 * @template TTrigger 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateConfiguration.cs
 */
export class StateConfiguration<TState, TTrigger> {

  constructor(
    private readonly _machine: StateMachine<TState, TTrigger>,
    private readonly _representation: StateRepresentation<TState, TTrigger>,
    private readonly _lookup: (state: TState) => StateRepresentation<TState, TTrigger>) {
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
   * @type {StateMachine<TState, TTrigger>}
   * @memberof StateConfiguration
   */
  public get machine(): StateMachine<TState, TTrigger> { return this._machine; }

  /**
   * Accept the specified trigger and transition to the destination state.
   * 
   * @param {TTrigger} trigger The accepted trigger.
   * @param {TState} destinationState The state that the trigger will cause a transition to.
   * @returns {StateConfiguration<TState, TTrigger>} The reciever.
   * @memberof StateConfiguration
   */
  public permit(trigger: TTrigger, destinationState: TState): StateConfiguration<TState, TTrigger> {
    this.enforceNotIdentityTransition(destinationState);
    return this.internalPermit(trigger, destinationState);
  }

  /**
   * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
   * 
   * @param {TTrigger} trigger 
   * @param {((transition: Transition<TState, TTrigger>) => void)} entryAction 
   * @returns {StateConfiguration<TState, TTrigger>} 
   * @memberof StateConfiguration
   */
  public internalTransition(
    trigger: TTrigger,
    entryAction: ((transition: Transition<TState, TTrigger>, ...args: any[]) => void)): StateConfiguration<TState, TTrigger> {
    return this.internalTransitionIf(trigger, () => true, entryAction);
  }

  /**
   * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
   * 
   * @param {TTrigger} trigger 
   * @param {(((() => boolean | Promise<boolean>)))} guard 
   * @param {((transition: Transition<TState, TTrigger>) => void)} internalAction 
   * @returns {StateConfiguration<TState, TTrigger>} 
   * @memberof StateConfiguration
   */
  public internalTransitionIf(
    trigger: TTrigger,
    guard: ((() => boolean | Promise<boolean>)),
    internalAction: ((transition: Transition<TState, TTrigger>, ...args: any[]) => void)): StateConfiguration<TState, TTrigger> {
    this._representation.addTriggerBehaviour(new InternalTriggerBehaviour<TState, TTrigger>(trigger, guard));
    this._representation.addInternalAction(trigger, (t, args) => internalAction(t, ...args));
    return this;
  }

  /**
   * Accept the specified trigger and transition to the destination state.
   * 
   * @param {TTrigger} trigger The accepted trigger.
   * @param {TState} destinationState The state that the trigger will cause a transition to.
   * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
   * @returns {StateConfiguration<TState, TTrigger>} The reciever.
   * @memberof StateConfiguration
   */
  public permitIf(
    trigger: TTrigger,
    destinationState: TState,
    ...guards: Array<{ guard: (() => boolean | Promise<boolean>), description: string }>): StateConfiguration<TState, TTrigger> {
    this.enforceNotIdentityTransition(destinationState);

    return this.internalPermitIf(
      trigger,
      destinationState,
      new TransitionGuard(...guards));
  }

  /**
   * Accept the specified trigger, execute exit actions and re-execute entry actions.
   * 
   * @description  Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
   * @param {TTrigger} trigger The accepted trigger.
   * @returns {StateConfiguration<TState, TTrigger>} The reciever.
   * @memberof StateConfiguration
   */
  public permitReentry(trigger: TTrigger): StateConfiguration<TState, TTrigger> {
    return this.internalPermit(trigger, this._representation.underlyingState);
  }

  /**
   * Accept the specified trigger, execute exit actions and re-execute entry actions.
   * Reentry behaves as though the configured state transitions to an identical sibling state.
   * 
   * @description Applies to the current state only. Will not re-execute superstate actions, or
   * cause actions to execute transitioning between super- and sub-states.
   * @param {TTrigger} trigger The accepted trigger.
   * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
   * @returns {StateConfiguration<TState, TTrigger>} The reciever.
   * @memberof StateConfiguration
   */
  public permitReentryIf(
    trigger: TTrigger,
    ...guards: Array<{ guard: (() => boolean | Promise<boolean>), description: string }>): StateConfiguration<TState, TTrigger> {
    return this.internalPermitIf(
      trigger,
      this._representation.underlyingState,
      new TransitionGuard(...guards));
  }

  /**
   * Ignore the specified trigger when in the configured state, if the guard returns true.
   * 
   * @param {TTrigger} trigger The trigger to ignore.
   * @param {TState} state The state to ignore.
   * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be ignored.
   * @returns {StateConfiguration<TState, TTrigger>} The receiver.
   * @memberof StateConfiguration
   */
  public ignoreIf(
    trigger: TTrigger,
    state: TState,
    ...guards: Array<{ guard: (() => boolean | Promise<boolean>), description: string }>): StateConfiguration<TState, TTrigger> {
    this._representation.addTriggerBehaviour(
      new IgnoredTriggerBehaviour<TState, TTrigger>(
        trigger,
        new TransitionGuard(...guards),
        state));
    return this;
  }

  /// <summary>
  /// Specify an action that will execute when activating
  /// the configured state.
  /// </summary>
  /// <param name="activateAction">Action to execute.</param>
  /// <param name="activateActionDescription">Action description.</param>
  /// <returns>The receiver.</returns>
  public onActivate(
    activateAction: () => void | Promise<void>,
    activateActionDescription: string | null = null): StateConfiguration<TState, TTrigger> {
    this._representation.addActivateAction(activateAction,
      InvocationInfo.create(activateAction, activateActionDescription));
    return this;
  }

  /// <summary>
  /// Specify an action that will execute when deactivating
  /// the configured state.
  /// </summary>
  /// <param name="deactivateAction">Action to execute.</param>
  /// <param name="deactivateActionDescription">Action description.</param>
  /// <returns>The receiver.</returns>
  public onDeactivate(
    deactivateAction: () => void | Promise<void>,
    deactivateActionDescription: string | null = null): StateConfiguration<TState, TTrigger> {
    this._representation.addDeactivateAction(deactivateAction,
      InvocationInfo.create(deactivateAction, deactivateActionDescription));
    return this;
  }

  /**
   * Specify an action that will execute when transitioning into the configured state.
   * 
   * @param {(((transition?: Transition<TState, TTrigger>) => void | Promise<void>))} entryAction Action to execute.
   * @param {InvocationInfo} [entryActionDescription] Action description.
   * @returns {StateConfiguration<TState, TTrigger>} The receiver.
   * @memberof StateConfiguration
   */
  public onEntry(
    entryAction: ((transition?: Transition<TState, TTrigger>) => void | Promise<void>),
    entryActionDescription: InvocationInfo): StateConfiguration<TState, TTrigger> {
    this._representation.addEntryAction(undefined, entryAction, entryActionDescription);
    return this;
  }

  /**
   * Specify an action that will execute when transitioning into the configured state.
   * 
   * @param {TTrigger} trigger The trigger by which the state must be entered in order for the action to execute.
   * @param {(((transition?: Transition<TState, TTrigger>, ...args: any[]) => void | Promise<void>))} entryAction Action to execute, providing details of the transition.
   * @param {InvocationInfo} [entryActionDescription] Action description.
   * @returns {StateConfiguration<TState, TTrigger>} The receiver.
   * @memberof StateConfiguration
   */
  public onEntryFrom(
    trigger: TTrigger,
    entryAction: ((transition?: Transition<TState, TTrigger>, ...args: any[]) => void | Promise<void>),
    entryActionDescription: InvocationInfo
  ): StateConfiguration<TState, TTrigger> {
    this._representation.addEntryAction(trigger, entryAction, entryActionDescription);
    return this;
  }

  /**
   * Specify an action that will execute when transitioning from the configured state.
   * 
   * @param {(((transition?: Transition<TState, TTrigger>) => void | Promise<void>))} exitAction Action to execute.
   * @param {string} [exitActionDescription] Action description.
   * @returns {StateConfiguration<TState, TTrigger>} 
   * @memberof StateConfiguration
   */
  public onExit(
    exitAction: ((transition?: Transition<TState, TTrigger>) => void | Promise<void>),
    exitActionDescription: string | null = null): StateConfiguration<TState, TTrigger> {
    this._representation.addExitAction(exitAction,
      InvocationInfo.create(exitAction, exitActionDescription));
    return this;
  }

  /**
   * Sets the superstate that the configured state is a substate of.
   * @description Substates inherit the allowed transitions of their superstate.
   * entry actions for the superstate are executed.
   * Likewise when leaving from the substate to outside the supserstate,
   * exit actions for the superstate will execute.
   * @param {TState} superstate The superstate.
   * @returns {StateConfiguration<TState, TTrigger>} The receiver.
   * @memberof StateConfiguration
   */
  public substateOf(superstate: TState): StateConfiguration<TState, TTrigger> {

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
   * @param {((args: any[]) => TState)} destinationStateSelector Function to calculate the state that the trigger will cause a transition to.
   * @param {(string | null)} [destinationStateSelectorDescription=null]  Optional description of the function to calculate the state .
   * @param {(DynamicStateInfos | null)} [possibleDestinationStates=null] >Optional array of possible destination states (used by output formatters)
   * @returns {StateConfiguration<TState, TTrigger>} The reciever.
   * @memberof StateConfiguration
   */
  public permitDynamic(
    trigger: TTrigger,
    destinationStateSelector: ((args: any[]) => TState),
    destinationStateSelectorDescription: string | null = null,
    possibleDestinationStates: DynamicStateInfos | null = null
  ): StateConfiguration<TState, TTrigger> {
    this._representation.addTriggerBehaviour(
      new DynamicTriggerBehaviour<TState, TTrigger>(
        trigger, destinationStateSelector,
        undefined,       // No transition guard
        DynamicTransitionInfo.create(trigger, null,
          InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription),
          possibleDestinationStates
        )));// Possible states not defined
    return this;
  }

  /**
   *  Accept the specified trigger and transition to the destination state, calculated dynamically by the supplied function.
   * 
   * @param {TTrigger} trigger The accepted trigger.
   * @param {((args: any[]) => TState)} destinationStateSelector Function to calculate the state that the trigger will cause a transition to.
   * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
   * @returns {StateConfiguration<TState, TTrigger>} The reciever.
   * @memberof StateConfiguration
   */
  public permitDynamicIf(trigger: TTrigger, destinationStateSelector: ((args: any[]) => TState), ...guards: Array<{ guard: (() => boolean | Promise<boolean>), description: string }>): StateConfiguration<TState, TTrigger> {
    return this.internalPermitDynamicIf(
      trigger,
      args => destinationStateSelector(args),
      '', // destinationStateSelectorString
      new TransitionGuard(...guards),
      null);      // List of possible destination states not specified
  }

  private enforceNotIdentityTransition(destination: TState): void {
    if (destination === this._representation.underlyingState) {
      throw new Error(`permit() (and permitIf()) require that the destination state is not equal to the source state. To accept a trigger without changing state, use either ignore() or permitReentry().`);
    }
  }

  private internalPermit(trigger: TTrigger, destinationState: TState): StateConfiguration<TState, TTrigger> {
    this._representation.addTriggerBehaviour(new TransitioningTriggerBehaviour<TState, TTrigger>(trigger, destinationState));
    return this;
  }

  private internalPermitIf(trigger: TTrigger, destinationState: TState, transitionGuard: TransitionGuard): StateConfiguration<TState, TTrigger> {
    this._representation.addTriggerBehaviour(new TransitioningTriggerBehaviour(trigger, destinationState, transitionGuard));
    return this;
  }

  private internalPermitDynamicIf(
    trigger: TTrigger,
    destinationStateSelector: ((args: any[]) => TState),
    destinationStateSelectorDescription: string,
    transitionGuard: TransitionGuard,
    possibleDestinationStates: DynamicStateInfos | null
  ): StateConfiguration<TState, TTrigger> {

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

}
