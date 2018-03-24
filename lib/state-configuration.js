"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var transitioning_trigger_behaviour_1 = require("./transitioning-trigger-behaviour");
var transition_guard_1 = require("./transition-guard");
var internal_trigger_behaviour_1 = require("./internal-trigger-behaviour");
var dynamic_trigger_behaviour_1 = require("./dynamic-trigger-behaviour");
var ignored_trigger_behaviour_1 = require("./ignored-trigger-behaviour");
var invocation_info_1 = require("./reflection/invocation-info");
var dynamic_transition_info_1 = require("./reflection/dynamic-transition-info");
/**
 * The configuration for a single state value.
 *
 * @export
 * @class StateConfiguration
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateConfiguration.cs
 */
var StateConfiguration = /** @class */ (function () {
    /**
     * Creates an instance of StateConfiguration.
     * @param {StateMachine<TState, TTrigger>} _machine
     * @param {StateRepresentation<TState, TTrigger>} _representation
     * @param {(state: TState) => StateRepresentation<TState, TTrigger>} _lookup
     * @memberof StateConfiguration
     */
    function StateConfiguration(_machine, _representation, _lookup) {
        this._machine = _machine;
        this._representation = _representation;
        this._lookup = _lookup;
    }
    Object.defineProperty(StateConfiguration.prototype, "state", {
        /**
         * The state that is configured with this configuration.
         *
         * @memberof StateConfiguration
         */
        get: function () { return this._representation.underlyingState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateConfiguration.prototype, "machine", {
        /**
         * The machine that is configured with this configuration.
         *
         * @readonly
         * @type {StateMachine<TState, TTrigger>}
         * @memberof StateConfiguration
         */
        get: function () { return this._machine; },
        enumerable: true,
        configurable: true
    });
    /**
     * Accept the specified trigger and transition to the destination state.
     *
     * @param {TTrigger} trigger The accepted trigger.
     * @param {TState} destinationState The state that the trigger will cause a transition to.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.permit = function (trigger, destinationState) {
        this.enforceNotIdentityTransition(destinationState);
        return this.internalPermit(trigger, destinationState);
    };
    /**
     * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
     *
     * @param {TTrigger} trigger
     * @param {((((...args: any[]) => boolean | Promise<boolean>)))} guard
     * @param {((transition: Transition<TState, TTrigger>) => void)} internalAction
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.internalTransitionIf = function (trigger, guard, internalAction) {
        this._representation.addTriggerBehaviour(new internal_trigger_behaviour_1.InternalTriggerBehaviour(trigger, guard));
        this._representation.addInternalAction(trigger, function (t, args) { return internalAction.apply(void 0, __spread([t], args)); });
        return this;
    };
    /**
     * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
     *
     * @param {TTrigger} trigger
     * @param {((transition: Transition<TState, TTrigger>) => void)} entryAction
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.internalTransition = function (trigger, entryAction) {
        return this.internalTransitionIf(trigger, function () { return true; }, entryAction);
    };
    /**
     * Accept the specified trigger and transition to the destination state.
     *
     * @param {TTrigger} The accepted trigger.
     * @param {TState} destinationState The state that the trigger will cause a transition to.
     * @param {(Array<{ guard: ((...args: any[]) => boolean | Promise<boolean>), description?: string | null } | ((...args: any[]) => boolean | Promise<boolean>)> | ((...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
     * @param {(string | null)} [description=null]
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.permitIf = function (trigger, destinationState, guards, description) {
        if (description === void 0) { description = null; }
        this.enforceNotIdentityTransition(destinationState);
        if (guards instanceof Array) {
            return this.internalPermitIf(trigger, destinationState, new (transition_guard_1.TransitionGuard.bind.apply(transition_guard_1.TransitionGuard, __spread([void 0], guards)))());
        }
        else {
            return this.internalPermitIf(trigger, destinationState, new transition_guard_1.TransitionGuard({ guard: guards, description: description }));
        }
    };
    /**
     * Accept the specified trigger, execute exit actions and re-execute entry actions.
     *
     * @description  Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
     * @param {TTrigger} trigger The accepted trigger.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.permitReentry = function (trigger) {
        return this.internalPermit(trigger, this._representation.underlyingState);
    };
    /**
     * Accept the specified trigger, execute exit actions and re-execute entry actions.
     * Reentry behaves as though the configured state transitions to an identical sibling state.
     *
     * @description Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
     * @param {TTrigger} trigger The accepted trigger.
     * @param {(Array<{ guard: ((...args: any[]) => boolean | Promise<boolean>), description?: string | null } | ((...args: any[]) => boolean | Promise<boolean>)> | ((...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
     * @param {(string | null)} [description=null] The reciever.
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.permitReentryIf = function (trigger, guards, description) {
        if (description === void 0) { description = null; }
        if (guards instanceof Array) {
            return this.internalPermitIf(trigger, this._representation.underlyingState, new (transition_guard_1.TransitionGuard.bind.apply(transition_guard_1.TransitionGuard, __spread([void 0], guards)))());
        }
        else {
            return this.internalPermitIf(trigger, this._representation.underlyingState, new transition_guard_1.TransitionGuard({ guard: guards, description: description }));
        }
    };
    /**
     * Ignore the specified trigger when in the configured state.
     *
     * @param {TTrigger} trigger
     * @returns {StateConfiguration<TState, TTrigger>} The trigger to ignore.
     * @memberof StateConfigurationThe receiver.
     */
    StateConfiguration.prototype.ignore = function (trigger) {
        this._representation.addTriggerBehaviour(new ignored_trigger_behaviour_1.IgnoredTriggerBehaviour(trigger, undefined, this.state));
        return this;
    };
    /**
     * Ignore the specified trigger when in the configured state, if the guard returns true.
     *
     * @param {TTrigger} trigger The trigger to ignore.
     * @param {TState} state The state to ignore.
     * @param {(Array<{ guard: ((...args: any[]) => boolean | Promise<boolean>), description?: string | null } | ((...args: any[]) => boolean | Promise<boolean>)> | ((...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be ignored.
     * @param {(string | null)} [description=null] The receiver.
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.ignoreIf = function (trigger, state, guards, description) {
        if (description === void 0) { description = null; }
        if (guards instanceof Array) {
            this._representation.addTriggerBehaviour(new ignored_trigger_behaviour_1.IgnoredTriggerBehaviour(trigger, new (transition_guard_1.TransitionGuard.bind.apply(transition_guard_1.TransitionGuard, __spread([void 0], guards)))(), state));
        }
        else {
            this._representation.addTriggerBehaviour(new ignored_trigger_behaviour_1.IgnoredTriggerBehaviour(trigger, new transition_guard_1.TransitionGuard({ guard: guards, description: description }), state));
        }
        return this;
    };
    /**
     * Specify an action that will execute when activating the configured state.
     *
     * @param {(() => any | Promise<any>)} activateAction Action to execute.
     * @param {(string | null)} [activateActionDescription=null] Action description.
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.onActivate = function (activateAction, activateActionDescription) {
        if (activateActionDescription === void 0) { activateActionDescription = null; }
        this._representation.addActivateAction(activateAction, invocation_info_1.InvocationInfo.create(activateAction, activateActionDescription));
        return this;
    };
    /**
     * Specify an action that will execute when deactivating
     *
     * @param {(() => any | Promise<any>)} deactivateAction Action to execute.
     * @param {(string | null)} [deactivateActionDescription=null] Action description.
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.onDeactivate = function (deactivateAction, deactivateActionDescription) {
        if (deactivateActionDescription === void 0) { deactivateActionDescription = null; }
        this._representation.addDeactivateAction(deactivateAction, invocation_info_1.InvocationInfo.create(deactivateAction, deactivateActionDescription));
        return this;
    };
    /**
     * Specify an action that will execute when transitioning into the configured state.
     *
     * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} entryAction Action to execute.
     * @param {string | null} [entryActionDescription] Action description.
     * @returns {StateConfiguration<TState, TTrigger>} The receiver.
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.onEntry = function (entryAction, entryActionDescription) {
        if (entryActionDescription === void 0) { entryActionDescription = null; }
        this._representation.addEntryAction(undefined, entryAction, invocation_info_1.InvocationInfo.create(entryAction, entryActionDescription));
        return this;
    };
    /**
     * Specify an action that will execute when transitioning into the configured state.
     *
     * @param {TTrigger} trigger The trigger by which the state must be entered in order for the action to execute.
     * @param {(((transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>))} entryAction Action to execute, providing details of the transition.
     * @param {string | null} [entryActionDescription] Action description.
     * @returns {StateConfiguration<TState, TTrigger>} The receiver.
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.onEntryFrom = function (trigger, entryAction, entryActionDescription) {
        if (entryActionDescription === void 0) { entryActionDescription = null; }
        this._representation.addEntryAction(trigger, entryAction, invocation_info_1.InvocationInfo.create(entryAction, entryActionDescription));
        return this;
    };
    /**
     * Specify an action that will execute when transitioning from the configured state.
     *
     * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} exitAction Action to execute.
     * @param {string} [exitActionDescription] Action description.
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.onExit = function (exitAction, exitActionDescription) {
        if (exitActionDescription === void 0) { exitActionDescription = null; }
        this._representation.addExitAction(exitAction, invocation_info_1.InvocationInfo.create(exitAction, exitActionDescription));
        return this;
    };
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
    StateConfiguration.prototype.substateOf = function (superstate) {
        var state = this._representation.underlyingState;
        // Check for accidental identical cyclic configuration
        if (state === superstate) {
            throw new Error("Configuring " + state + " as a substate of " + superstate + " creates an illegal cyclic configuration.");
        }
        // Check for accidental identical nested cyclic configuration
        var superstates = new Set([state]);
        // Build list of super states and check for
        var activeRepresentation = this._lookup(superstate);
        while (!!activeRepresentation.superstate) {
            // Check if superstate is already added to hashset
            if (superstates.has(activeRepresentation.superstate.underlyingState)) {
                throw new Error("Configuring " + state + " as a substate of " + superstate + " creates an illegal nested cyclic configuration.");
            }
            superstates.add(activeRepresentation.superstate.underlyingState);
            activeRepresentation = this._lookup(activeRepresentation.superstate.underlyingState);
        }
        // The check was OK, we can add this
        var superRepresentation = this._lookup(superstate);
        this._representation.superstate = superRepresentation;
        superRepresentation.addSubstate(this._representation);
        return this;
    };
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
    StateConfiguration.prototype.permitDynamic = function (trigger, destinationStateSelector, destinationStateSelectorDescription, possibleDestinationStates) {
        if (destinationStateSelectorDescription === void 0) { destinationStateSelectorDescription = null; }
        if (possibleDestinationStates === void 0) { possibleDestinationStates = null; }
        this._representation.addTriggerBehaviour(new dynamic_trigger_behaviour_1.DynamicTriggerBehaviour(trigger, destinationStateSelector, undefined, // No transition guard
        dynamic_transition_info_1.DynamicTransitionInfo.create(trigger, null, invocation_info_1.InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription), possibleDestinationStates))); // Possible states not defined
        return this;
    };
    /**
     * Accept the specified trigger and transition to the destination state, calculated dynamically by the supplied function.
     *
     * @param {TTrigger} trigger The accepted trigger.
     * @param {((args: any[]) => TState)} destinationStateSelector Function to calculate the state that the trigger will cause  transition to.
     * @param {(Array<{ guard: ((...args: any[]) => boolean | Promise<boolean>), description?: string | null } | ((...args: any[]) => boolean | Promise<boolean>)> | ((...args: any[]) => boolean | Promise<boolean>))} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
     * @param {(string | null)} [description=null]
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    StateConfiguration.prototype.permitDynamicIf = function (trigger, destinationStateSelector, guards, description) {
        if (description === void 0) { description = null; }
        if (guards instanceof Array) {
            return this.internalPermitDynamicIf(trigger, function (args) { return destinationStateSelector(args); }, '', new (transition_guard_1.TransitionGuard.bind.apply(transition_guard_1.TransitionGuard, __spread([void 0], guards)))(), null); // List of possible destination states not specified
        }
        else {
            return this.internalPermitDynamicIf(trigger, function (args) { return destinationStateSelector(args); }, '', // destinationStateSelectorString
            new transition_guard_1.TransitionGuard({ guard: guards, description: description }), null); // List of possible destination states not specified
        }
    };
    StateConfiguration.prototype.enforceNotIdentityTransition = function (destination) {
        if (destination === this._representation.underlyingState) {
            throw new Error("permit() (and permitIf()) require that the destination state is not equal to the source state. To accept a trigger without changing state, use either ignore() or permitReentry().");
        }
    };
    StateConfiguration.prototype.internalPermit = function (trigger, destinationState) {
        this._representation.addTriggerBehaviour(new transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour(trigger, destinationState));
        return this;
    };
    StateConfiguration.prototype.internalPermitIf = function (trigger, destinationState, transitionGuard) {
        this._representation.addTriggerBehaviour(new transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour(trigger, destinationState, transitionGuard));
        return this;
    };
    StateConfiguration.prototype.internalPermitDynamicIf = function (trigger, destinationStateSelector, destinationStateSelectorDescription, transitionGuard, possibleDestinationStates) {
        this._representation.addTriggerBehaviour(new dynamic_trigger_behaviour_1.DynamicTriggerBehaviour(trigger, destinationStateSelector, transitionGuard, dynamic_transition_info_1.DynamicTransitionInfo.create(trigger, transitionGuard.conditions.map(function (x) { return x.methodDescription; }), invocation_info_1.InvocationInfo.create(destinationStateSelector, destinationStateSelectorDescription), possibleDestinationStates)));
        return this;
    };
    return StateConfiguration;
}());
exports.StateConfiguration = StateConfiguration;
