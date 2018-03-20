"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ignored_transition_info_1 = require("./ignored-transition-info");
const ignored_trigger_behaviour_1 = require("../ignored-trigger-behaviour");
const internal_trigger_behaviour_1 = require("../internal-trigger-behaviour");
const transitioning_trigger_behaviour_1 = require("../transitioning-trigger-behaviour");
const dynamic_trigger_behaviour_1 = require("../dynamic-trigger-behaviour");
const fixed_transition_info_1 = require("./fixed-transition-info");
const action_info_1 = require("./action-info");
/**
 * Describes an internal StateRepresentation through the reflection API.
 *
 * @export
 * @class StateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateInfo.cs
 */
class StateInfo {
    /**
     * Creates an instance of StateInfo.
     * @param {*} _underlyingState
     * @param {Iterable<IgnoredTransitionInfo>} _ignoredTriggers
     * @param {Iterable<ActionInfo>} _entryActions
     * @param {Iterable<InvocationInfo>} _activateActions
     * @param {Iterable<InvocationInfo>} _deactivateActions
     * @param {Iterable<InvocationInfo>} _exitActions
     * @memberof StateInfo
     */
    constructor(_underlyingState, _ignoredTriggers, _entryActions, _activateActions, _deactivateActions, _exitActions) {
        this._underlyingState = _underlyingState;
        this._ignoredTriggers = _ignoredTriggers;
        this._entryActions = _entryActions;
        this._activateActions = _activateActions;
        this._deactivateActions = _deactivateActions;
        this._exitActions = _exitActions;
        this._dynamicTransitions = [];
        this._fixedTransitions = [];
        this._superstate = null;
        this._substates = [];
    }
    static createStateInfo(stateRepresentation) {
        const ignoredTriggers = [];
        // stateRepresentation.triggerBehaviours maps from TTrigger to ICollection<TriggerBehaviour>
        for (const triggerBehaviours of stateRepresentation.triggerBehaviours) {
            for (const item of triggerBehaviours['1']) {
                if (item instanceof ignored_trigger_behaviour_1.IgnoredTriggerBehaviour) {
                    ignoredTriggers.push(ignored_transition_info_1.IgnoredTransitionInfo.create(item));
                }
            }
        }
        return new StateInfo(stateRepresentation.underlyingState, ignoredTriggers, stateRepresentation.entryActions.map(e => action_info_1.ActionInfo.create(e)), stateRepresentation.activateActions.map(e => e.description), stateRepresentation.deactivateActions.map(e => e.description), stateRepresentation.exitActions.map(e => e.description));
    }
    static addRelationships(info, stateRepresentation, lookupState) {
        const substates = stateRepresentation.getSubstates().map(s => lookupState(s.underlyingState) || null);
        let superstate;
        if (!!stateRepresentation.superstate) {
            superstate = lookupState(stateRepresentation.superstate.underlyingState);
        }
        const fixedTransitions = [];
        const dynamicTransitions = [];
        for (const triggerBehaviours of stateRepresentation.triggerBehaviours) {
            // First add all the deterministic transitions
            for (const item of triggerBehaviours['1'].filter(behaviour => (behaviour instanceof transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour))) {
                const destinationInfo = lookupState(item.destination);
                if (!destinationInfo) {
                    continue;
                }
                fixedTransitions.push(fixed_transition_info_1.FixedTransitionInfo.create(item, destinationInfo));
            }
            // Then add all the internal transitions
            for (const item of triggerBehaviours['1'].filter(behaviour => (behaviour instanceof internal_trigger_behaviour_1.InternalTriggerBehaviour))) {
                const destinationInfo = lookupState(stateRepresentation.underlyingState);
                if (!destinationInfo) {
                    continue;
                }
                fixedTransitions.push(fixed_transition_info_1.FixedTransitionInfo.create(item, destinationInfo));
            }
            // Then add all the dynamic transitions
            for (const item of triggerBehaviours['1'].filter(behaviour => behaviour instanceof dynamic_trigger_behaviour_1.DynamicTriggerBehaviour)) {
                dynamicTransitions.push(item.transitionInfo);
            }
        }
        info.addRelationships(superstate || null, substates, fixedTransitions, dynamicTransitions);
    }
    addRelationships(superstate, substates, transitions, dynamicTransitions) {
        this._superstate = superstate;
        this._substates = substates;
        this._fixedTransitions = transitions;
        this._dynamicTransitions = dynamicTransitions;
    }
    /**
     * The instance or value this state represents.
     *
     * @readonly
     * @type {*}
     * @memberof StateInfo
     */
    get underlyingState() { return this._underlyingState; }
    /**
     * Substates defined for this StateResource.
     *
     * @readonly
     * @type {(Iterable<StateInfo | null>)}
     * @memberof StateInfo
     */
    get substates() { return this._substates; }
    /**
     * Superstate defined, if any, for this StateResource.
     *
     * @readonly
     * @type {StateInfo}
     * @memberof StateInfo
     */
    get superstate() { return this._superstate; }
    /**
     * Actions that are defined to be executed on state-entry.
     *
     * @readonly
     * @type {Iterable<ActionInfo>}
     * @memberof StateInfo
     */
    get entryActions() { return this._entryActions; }
    /**
     * Actions that are defined to be executed on activation.
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof StateInfo
     */
    get activateActions() { return this._activateActions; }
    /**
     * Actions that are defined to be executed on deactivation.
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof StateInfo
     */
    get deactivateActions() { return this._deactivateActions; }
    /**
     * Actions that are defined to be exectuted on state-exit.
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof StateInfo
     */
    get exitActions() { return this._exitActions; }
    /**
     * Transitions defined for this state.
     *
     * @readonly
     * @type {Iterable<TransitionInfo>}
     * @memberof StateInfo
     */
    get transitions() { return [...this._fixedTransitions, ...this._dynamicTransitions]; }
    /**
     * Transitions defined for this state.
     *
     * @readonly
     * @type {Iterable<FixedTransitionInfo>}
     * @memberof StateInfo
     */
    get fixedTransitions() { return this._fixedTransitions; }
    /**
     * Dynamic Transitions defined for this state internally.
     *
     * @readonly
     * @type {Iterable<DynamicTransitionInfo>}
     * @memberof StateInfo
     */
    get dynamicTransitions() { return this._dynamicTransitions; }
    /**
     * Triggers ignored for this state.
     *
     * @readonly
     * @type {Iterable<IgnoredTransitionInfo>}
     * @memberof StateInfo
     */
    get ignoredTriggers() { return this._ignoredTriggers; }
    /**
     * Passes through to the value's ToString.
     *
     * @returns {string}
     * @memberof StateInfo
     */
    toString() {
        return !!this._underlyingState ? `${this._underlyingState}` : '<null>';
    }
}
exports.StateInfo = StateInfo;
//# sourceMappingURL=state-info.js.map