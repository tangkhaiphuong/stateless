"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transitioning_trigger_behaviour_1 = require("./transitioning-trigger-behaviour");
const transition_guard_1 = require("./transition-guard");
const internal_trigger_behaviour_1 = require("./internal-trigger-behaviour");
const dynamic_trigger_behaviour_1 = require("./dynamic-trigger-behaviour");
const ignored_trigger_behaviour_1 = require("./ignored-trigger-behaviour");
const invocation_info_1 = require("./reflection/invocation-info");
const dynamic_transition_info_1 = require("./reflection/dynamic-transition-info");
/**
 * The configuration for a single state value.
 *
 * @export
 * @class StateConfiguration
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateConfiguration.cs
 */
class StateConfiguration {
    constructor(_machine, _representation, _lookup) {
        this._machine = _machine;
        this._representation = _representation;
        this._lookup = _lookup;
    }
    /**
     * The state that is configured with this configuration.
     *
     * @memberof StateConfiguration
     */
    get state() { return this._representation.underlyingState; }
    /**
     * The machine that is configured with this configuration.
     *
     * @readonly
     * @type {StateMachine<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    get machine() { return this._machine; }
    /**
     * Accept the specified trigger and transition to the destination state.
     *
     * @param {TTrigger} trigger The accepted trigger.
     * @param {TState} destinationState The state that the trigger will cause a transition to.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permit(trigger, destinationState) {
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
    internalTransition(trigger, entryAction) {
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
    internalTransitionIf(trigger, guard, internalAction) {
        this._representation.addTriggerBehaviour(new internal_trigger_behaviour_1.InternalTriggerBehaviour(trigger, guard));
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
    permitIf(trigger, destinationState, ...guards) {
        this.enforceNotIdentityTransition(destinationState);
        return this.internalPermitIf(trigger, destinationState, new transition_guard_1.TransitionGuard(...guards));
    }
    /**
     * Accept the specified trigger, execute exit actions and re-execute entry actions.
     *
     * @description  Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
     * @param {TTrigger} trigger The accepted trigger.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permitReentry(trigger) {
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
    permitReentryIf(trigger, ...guards) {
        return this.internalPermitIf(trigger, this._representation.underlyingState, new transition_guard_1.TransitionGuard(...guards));
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
    ignoreIf(trigger, state, ...guards) {
        this._representation.addTriggerBehaviour(new ignored_trigger_behaviour_1.IgnoredTriggerBehaviour(trigger, new transition_guard_1.TransitionGuard(...guards), state));
        return this;
    }
    /// <summary>
    /// Specify an action that will execute when activating
    /// the configured state.
    /// </summary>
    /// <param name="activateAction">Action to execute.</param>
    /// <param name="activateActionDescription">Action description.</param>
    /// <returns>The receiver.</returns>
    onActivate(activateAction, activateActionDescription = null) {
        this._representation.addActivateAction(activateAction, invocation_info_1.InvocationInfo.create(activateAction, activateActionDescription));
        return this;
    }
    /// <summary>
    /// Specify an action that will execute when deactivating
    /// the configured state.
    /// </summary>
    /// <param name="deactivateAction">Action to execute.</param>
    /// <param name="deactivateActionDescription">Action description.</param>
    /// <returns>The receiver.</returns>
    onDeactivate(deactivateAction, deactivateActionDescription = null) {
        this._representation.addDeactivateAction(deactivateAction, invocation_info_1.InvocationInfo.create(deactivateAction, deactivateActionDescription));
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
    onEntry(entryAction, entryActionDescription) {
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
    onEntryFrom(trigger, entryAction, entryActionDescription) {
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
    onExit(exitAction, exitActionDescription = null) {
        this._representation.addExitAction(exitAction, invocation_info_1.InvocationInfo.create(exitAction, exitActionDescription));
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
    substateOf(superstate) {
        const state = this._representation.underlyingState;
        // Check for accidental identical cyclic configuration
        if (state === superstate) {
            throw new Error(`Configuring ${state} as a substate of ${superstate} creates an illegal cyclic configuration.`);
        }
        // Check for accidental identical nested cyclic configuration
        const superstates = new Set([state]);
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
    permitDynamic(trigger, destinationStateSelector, destinationStateSelectorDescription = null, possibleDestinationStates = null) {
        this._representation.addTriggerBehaviour(new dynamic_trigger_behaviour_1.DynamicTriggerBehaviour(trigger, destinationStateSelector, undefined, // No transition guard
        dynamic_transition_info_1.DynamicTransitionInfo.create(trigger, null, invocation_info_1.InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription), possibleDestinationStates))); // Possible states not defined
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
    permitDynamicIf(trigger, destinationStateSelector, ...guards) {
        return this.internalPermitDynamicIf(trigger, args => destinationStateSelector(args), '', // destinationStateSelectorString
        new transition_guard_1.TransitionGuard(...guards), null); // List of possible destination states not specified
    }
    enforceNotIdentityTransition(destination) {
        if (destination === this._representation.underlyingState) {
            throw new Error(`permit() (and permitIf()) require that the destination state is not equal to the source state. To accept a trigger without changing state, use either ignore() or permitReentry().`);
        }
    }
    internalPermit(trigger, destinationState) {
        this._representation.addTriggerBehaviour(new transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour(trigger, destinationState));
        return this;
    }
    internalPermitIf(trigger, destinationState, transitionGuard) {
        this._representation.addTriggerBehaviour(new transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour(trigger, destinationState, transitionGuard));
        return this;
    }
    internalPermitDynamicIf(trigger, destinationStateSelector, destinationStateSelectorDescription, transitionGuard, possibleDestinationStates) {
        this._representation.addTriggerBehaviour(new dynamic_trigger_behaviour_1.DynamicTriggerBehaviour(trigger, destinationStateSelector, transitionGuard, dynamic_transition_info_1.DynamicTransitionInfo.create(trigger, transitionGuard.conditions.map(x => x.methodDescription), invocation_info_1.InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription), possibleDestinationStates)));
        return this;
    }
}
exports.StateConfiguration = StateConfiguration;

//# sourceMappingURL=state-configuration.js.map
