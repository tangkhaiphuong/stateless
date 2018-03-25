"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
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
var ignored_transition_info_1 = require("./ignored-transition-info");
var ignored_trigger_behaviour_1 = require("../ignored-trigger-behaviour");
var internal_trigger_behaviour_1 = require("../internal-trigger-behaviour");
var transitioning_trigger_behaviour_1 = require("../transitioning-trigger-behaviour");
var dynamic_trigger_behaviour_1 = require("../dynamic-trigger-behaviour");
var fixed_transition_info_1 = require("./fixed-transition-info");
var action_info_1 = require("./action-info");
/**
 * Describes an internal StateRepresentation through the reflection API.
 *
 * @export
 * @class StateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateInfo.cs
 */
var StateInfo = /** @class */ (function () {
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
    function StateInfo(_underlyingState, _ignoredTriggers, _entryActions, _activateActions, _deactivateActions, _exitActions) {
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
    StateInfo.createStateInfo = function (stateRepresentation) {
        var ignoredTriggers = [];
        try {
            // stateRepresentation.triggerBehaviours maps from TTrigger to ICollection<TriggerBehaviour>
            for (var _a = __values(stateRepresentation.triggerBehaviours), _b = _a.next(); !_b.done; _b = _a.next()) {
                var triggerBehaviours = _b.value;
                try {
                    for (var _c = __values(triggerBehaviours['1']), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var item = _d.value;
                        if (item instanceof ignored_trigger_behaviour_1.IgnoredTriggerBehaviour) {
                            ignoredTriggers.push(ignored_transition_info_1.IgnoredTransitionInfo.create(item));
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return new StateInfo(stateRepresentation.underlyingState, ignoredTriggers, stateRepresentation.entryActions.map(function (e) { return action_info_1.ActionInfo.create(e); }), stateRepresentation.activateActions.map(function (e) { return e.description; }), stateRepresentation.deactivateActions.map(function (e) { return e.description; }), stateRepresentation.exitActions.map(function (e) { return e.description; }));
        var e_2, _f, e_1, _e;
    };
    StateInfo.addRelationships = function (info, stateRepresentation, lookupState) {
        var substates = stateRepresentation.getSubstates().map(function (s) { return lookupState(s.underlyingState) || null; });
        var superstate;
        if (!!stateRepresentation.superstate) {
            superstate = lookupState(stateRepresentation.superstate.underlyingState);
        }
        var fixedTransitions = [];
        var dynamicTransitions = [];
        try {
            for (var _a = __values(stateRepresentation.triggerBehaviours), _b = _a.next(); !_b.done; _b = _a.next()) {
                var triggerBehaviours = _b.value;
                try {
                    // First add all the deterministic transitions
                    for (var _c = __values(triggerBehaviours['1'].filter(function (behaviour) { return (behaviour instanceof transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour); })), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var item = _d.value;
                        var destinationInfo = lookupState(item.destination);
                        if (!destinationInfo) {
                            continue;
                        }
                        fixedTransitions.push(fixed_transition_info_1.FixedTransitionInfo.create(item, destinationInfo));
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                try {
                    // Then add all the internal transitions
                    for (var _f = __values(triggerBehaviours['1'].filter(function (behaviour) { return (behaviour instanceof internal_trigger_behaviour_1.InternalTriggerBehaviour); })), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var item = _g.value;
                        var destinationInfo = lookupState(stateRepresentation.underlyingState);
                        if (!destinationInfo) {
                            continue;
                        }
                        fixedTransitions.push(fixed_transition_info_1.FixedTransitionInfo.create(item, destinationInfo));
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_h = _f.return)) _h.call(_f);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                try {
                    // Then add all the dynamic transitions
                    for (var _j = __values(triggerBehaviours['1'].filter(function (behaviour) { return behaviour instanceof dynamic_trigger_behaviour_1.DynamicTriggerBehaviour; })), _k = _j.next(); !_k.done; _k = _j.next()) {
                        var item = _k.value;
                        dynamicTransitions.push(item.transitionInfo);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_k && !_k.done && (_l = _j.return)) _l.call(_j);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_m = _a.return)) _m.call(_a);
            }
            finally { if (e_6) throw e_6.error; }
        }
        info.addRelationships(superstate || null, substates, fixedTransitions, dynamicTransitions);
        var e_6, _m, e_3, _e, e_4, _h, e_5, _l;
    };
    StateInfo.prototype.addRelationships = function (superstate, substates, transitions, dynamicTransitions) {
        this._superstate = superstate;
        this._substates = substates;
        this._fixedTransitions = transitions;
        this._dynamicTransitions = dynamicTransitions;
    };
    Object.defineProperty(StateInfo.prototype, "underlyingState", {
        /**
         * The instance or value this state represents.
         *
         * @readonly
         * @type {*}
         * @memberof StateInfo
         */
        get: function () { return this._underlyingState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "substates", {
        /**
         * Substates defined for this StateResource.
         *
         * @readonly
         * @type {(Iterable<StateInfo | null>)}
         * @memberof StateInfo
         */
        get: function () { return this._substates; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "superstate", {
        /**
         * Superstate defined, if any, for this StateResource.
         *
         * @readonly
         * @type {StateInfo}
         * @memberof StateInfo
         */
        get: function () { return this._superstate; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "entryActions", {
        /**
         * Actions that are defined to be executed on state-entry.
         *
         * @readonly
         * @type {Iterable<ActionInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._entryActions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "activateActions", {
        /**
         * Actions that are defined to be executed on activation.
         *
         * @readonly
         * @type {Iterable<InvocationInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._activateActions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "deactivateActions", {
        /**
         * Actions that are defined to be executed on deactivation.
         *
         * @readonly
         * @type {Iterable<InvocationInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._deactivateActions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "exitActions", {
        /**
         * Actions that are defined to be exectuted on state-exit.
         *
         * @readonly
         * @type {Iterable<InvocationInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._exitActions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "transitions", {
        /**
         * Transitions defined for this state.
         *
         * @readonly
         * @type {Iterable<TransitionInfo>}
         * @memberof StateInfo
         */
        get: function () { return __spread((this._fixedTransitions || []), (this._dynamicTransitions || [])); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "fixedTransitions", {
        /**
         * Transitions defined for this state.
         *
         * @readonly
         * @type {Iterable<FixedTransitionInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._fixedTransitions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "dynamicTransitions", {
        /**
         * Dynamic Transitions defined for this state internally.
         *
         * @readonly
         * @type {Iterable<DynamicTransitionInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._dynamicTransitions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateInfo.prototype, "ignoredTriggers", {
        /**
         * Triggers ignored for this state.
         *
         * @readonly
         * @type {Iterable<IgnoredTransitionInfo>}
         * @memberof StateInfo
         */
        get: function () { return this._ignoredTriggers; },
        enumerable: true,
        configurable: true
    });
    /**
     * Passes through to the value's ToString.
     *
     * @returns {string}
     * @memberof StateInfo
     */
    StateInfo.prototype.toString = function () {
        return !!this._underlyingState ? "" + this._underlyingState : '<null2>';
    };
    return StateInfo;
}());
exports.StateInfo = StateInfo;
