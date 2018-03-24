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
var state_1 = require("./state");
var decision_1 = require("./decision");
var super_state_1 = require("./super-state");
var stay_transition_1 = require("./stay-transition");
var fixed_transition_1 = require("./fixed-transition");
var dynamic_transition_1 = require("./dynamic-transition");
/**
 * This class is used to generate a symbolic representation of the
 * graph structure, in preparation for feeding it to a diagram generator
 *
 * @export
 * @class StateGraph
 */
var StateGraph = /** @class */ (function () {
    /**
     * Creates an instance of StateGraph.
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    function StateGraph(machineInfo) {
        this._state = new Map();
        this._transition = [];
        this._decisions = [];
        // Start with top-level superstates
        this.addSuperstates(machineInfo);
        // // Now add any states that aren't part of a tree
        this.addSingleStates(machineInfo);
        // // Now grab transitions
        this.addTransitions(machineInfo);
        // // Handle "OnEntryFrom"
        this.processOnEntryFrom(machineInfo);
    }
    Object.defineProperty(StateGraph.prototype, "states", {
        /**
         * List of all states in the graph, indexed by the string representation of the underlying State object.
         *
         * @readonly
         * @type {Map<string, State>}
         * @memberof StateGraph
         */
        get: function () { return this._state; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateGraph.prototype, "transitions", {
        /**
         * List of all transitions in the graph
         *
         * @readonly
         * @type {BaseTransition[]}
         * @memberof StateGraph
         */
        get: function () { return this._transition; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateGraph.prototype, "decisions", {
        /**
         * List of all decision nodes in the graph.  A decision node is generated each time there
         * is a PermitDynamic() transition.
         *
         * @readonly
         * @type {Decision[]}
         * @memberof StateGraph
         */
        get: function () { return this._decisions; },
        enumerable: true,
        configurable: true
    });
    /**
     * Convert the graph into a string representation, using the specified style.
     *
     * @param {GraphStyle} style
     * @returns {string}
     * @memberof StateGraph
     */
    StateGraph.prototype.toGraph = function (style) {
        var dirgraphText = style.getPrefix();
        try {
            // Start with the clusters
            for (var _a = __values(this.states.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var state = _b.value;
                if (state instanceof super_state_1.SuperState) {
                    dirgraphText += style.formatOneCluster(state);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // Next process all non-cluster states
            for (var _d = __values(this.states.values()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var state = _e.value;
                if ((state instanceof super_state_1.SuperState) || (state instanceof decision_1.Decision) || (!!state.superState)) {
                    continue;
                }
                dirgraphText += style.formatOneState(state);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            // Finally, add decision nodes
            for (var _g = __values(this.decisions), _h = _g.next(); !_h.done; _h = _g.next()) {
                var dec = _h.value;
                dirgraphText += style.formatOneDecisionNode(dec.nodeName, dec.method.description);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_j = _g.return)) _j.call(_g);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // now build behaviours
        var transits = style.formatAllTransitions(this.transitions);
        try {
            for (var transits_1 = __values(transits), transits_1_1 = transits_1.next(); !transits_1_1.done; transits_1_1 = transits_1.next()) {
                var transit = transits_1_1.value;
                dirgraphText += '\n' + transit;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (transits_1_1 && !transits_1_1.done && (_k = transits_1.return)) _k.call(transits_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        dirgraphText += '\n}';
        return dirgraphText;
        var e_1, _c, e_2, _f, e_3, _j, e_4, _k;
    };
    /**
     * Process all entry actions that have a "FromTrigger" (meaning they are
     * only executed when the state is entered because the specified trigger
     * was fired).
     *
     * @private
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    StateGraph.prototype.processOnEntryFrom = function (machineInfo) {
        try {
            for (var _a = __values(machineInfo.states), _b = _a.next(); !_b.done; _b = _a.next()) {
                var stateInfo = _b.value;
                var state = this.states.get(stateInfo.underlyingState);
                if (!state) {
                    throw new Error('Canot get underlying state');
                }
                try {
                    for (var _c = __values(stateInfo.entryActions), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var entryAction = _d.value;
                        if (!!entryAction.fromTrigger) {
                            try {
                                // This 'state' has an 'entryAction' that only fires when it gets the trigger 'entryAction.FromTrigger'
                                // Does it have any incoming transitions that specify that trigger?
                                for (var _e = __values(state.arriving), _f = _e.next(); !_f.done; _f = _e.next()) {
                                    var transit = _f.value;
                                    if ((transit.executeEntryExitActions)
                                        && (transit.trigger.underlyingTrigger === entryAction.fromTrigger)) {
                                        transit.destinationEntryActions.push(entryAction);
                                    }
                                }
                            }
                            catch (e_5_1) { e_5 = { error: e_5_1 }; }
                            finally {
                                try {
                                    if (_f && !_f.done && (_g = _e.return)) _g.call(_e);
                                }
                                finally { if (e_5) throw e_5.error; }
                            }
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_j = _a.return)) _j.call(_a);
            }
            finally { if (e_7) throw e_7.error; }
        }
        var e_7, _j, e_6, _h, e_5, _g;
    };
    /**
     * Add all transitions to the graph
     *
     * @private
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    StateGraph.prototype.addTransitions = function (machineInfo) {
        try {
            for (var _a = __values(machineInfo.states), _b = _a.next(); !_b.done; _b = _a.next()) {
                var stateInfo = _b.value;
                var fromState = this.states.get(stateInfo.underlyingState);
                try {
                    for (var _c = __values(stateInfo.fixedTransitions), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var fix = _d.value;
                        var toState = this.states.get(fix.destinationState.underlyingState);
                        if (fromState === toState) {
                            var stay = new stay_transition_1.StayTransition(fromState, fix.trigger, fix.guardConditionsMethodDescriptions, true);
                            this.transitions.push(stay);
                            fromState.leaving.push(stay);
                            fromState.arriving.push(stay);
                        }
                        else {
                            var trans = new fixed_transition_1.FixedTransition(fromState, toState, fix.trigger, fix.guardConditionsMethodDescriptions);
                            this.transitions.push(trans);
                            fromState.leaving.push(trans);
                            toState.arriving.push(trans);
                        }
                    }
                }
                catch (e_8_1) { e_8 = { error: e_8_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                    }
                    finally { if (e_8) throw e_8.error; }
                }
                try {
                    for (var _f = __values(stateInfo.dynamicTransitions), _g = _f.next(); !_g.done; _g = _f.next()) {
                        var dyno = _g.value;
                        var decide = new decision_1.Decision(dyno.destinationStateSelectorDescription, this.decisions.length + 1);
                        this.decisions.push(decide);
                        var trans = new fixed_transition_1.FixedTransition(fromState, decide, dyno.trigger, dyno.guardConditionsMethodDescriptions);
                        this.transitions.push(trans);
                        fromState.leaving.push(trans);
                        decide.arriving.push(trans);
                        if (!!dyno.possibleDestinationStates) {
                            try {
                                for (var _h = __values(dyno.possibleDestinationStates), _j = _h.next(); !_j.done; _j = _h.next()) {
                                    var dynamicStateInfo = _j.value;
                                    var toState = this.states.get(dynamicStateInfo.destinationState);
                                    if (!!toState) {
                                        var dtrans = new dynamic_transition_1.DynamicTransition(decide, toState, dyno.trigger, dynamicStateInfo.criterion);
                                        this.transitions.push(dtrans);
                                        decide.leaving.push(dtrans);
                                        toState.arriving.push(dtrans);
                                    }
                                }
                            }
                            catch (e_9_1) { e_9 = { error: e_9_1 }; }
                            finally {
                                try {
                                    if (_j && !_j.done && (_k = _h.return)) _k.call(_h);
                                }
                                finally { if (e_9) throw e_9.error; }
                            }
                        }
                    }
                }
                catch (e_10_1) { e_10 = { error: e_10_1 }; }
                finally {
                    try {
                        if (_g && !_g.done && (_l = _f.return)) _l.call(_f);
                    }
                    finally { if (e_10) throw e_10.error; }
                }
                try {
                    for (var _m = __values(stateInfo.ignoredTriggers), _o = _m.next(); !_o.done; _o = _m.next()) {
                        var igno = _o.value;
                        var stay = new stay_transition_1.StayTransition(fromState, igno.trigger, igno.guardConditionsMethodDescriptions, false);
                        this.transitions.push(stay);
                        fromState.leaving.push(stay);
                        fromState.arriving.push(stay);
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (_o && !_o.done && (_p = _m.return)) _p.call(_m);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_q = _a.return)) _q.call(_a);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var e_12, _q, e_8, _e, e_10, _l, e_9, _k, e_11, _p;
    };
    /**
     * Add states to the graph that are neither superstates, nor substates of a superstate.
     *
     * @private
     * @param {StateMachineInfo} machineInfo
     * @memberof StateGraph
     */
    StateGraph.prototype.addSingleStates = function (machineInfo) {
        try {
            for (var _a = __values(machineInfo.states), _b = _a.next(); !_b.done; _b = _a.next()) {
                var stateInfo = _b.value;
                if (!this.states.has(stateInfo.underlyingState)) {
                    this.states.set(stateInfo.underlyingState, new state_1.State(stateInfo));
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_13) throw e_13.error; }
        }
        var e_13, _c;
    };
    /**
     * Add superstates to the graph (states that have substates)
     *
     * @private
     * @memberof StateGraph
     */
    StateGraph.prototype.addSuperstates = function (machineInfo) {
        try {
            for (var _a = __values(machineInfo.states), _b = _a.next(); !_b.done; _b = _a.next()) {
                var stateInfo = _b.value;
                if (__spread(stateInfo.substates).length > 0 && !stateInfo.superstate) {
                    var state = new super_state_1.SuperState(stateInfo);
                    this.states.set(stateInfo.underlyingState, state);
                    this.addSubstates(state, stateInfo.substates);
                }
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_14) throw e_14.error; }
        }
        var e_14, _c;
    };
    StateGraph.prototype.addSubstates = function (superState, substates) {
        try {
            for (var substates_1 = __values(substates), substates_1_1 = substates_1.next(); !substates_1_1.done; substates_1_1 = substates_1.next()) {
                var subState = substates_1_1.value;
                if (this.states.has(subState.underlyingState)) {
                    // This shouldn't happen
                }
                else if (__spread(subState.substates).length > 0) {
                    var sub = new super_state_1.SuperState(subState);
                    this.states.set(subState.underlyingState, sub);
                    superState.subStates.push(sub);
                    sub.superState = superState;
                    this.addSubstates(sub, subState.substates);
                }
                else {
                    var sub = new state_1.State(subState);
                    this.states.set(subState.underlyingState, sub);
                    superState.subStates.push(sub);
                    sub.superState = superState;
                }
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (substates_1_1 && !substates_1_1.done && (_a = substates_1.return)) _a.call(substates_1);
            }
            finally { if (e_15) throw e_15.error; }
        }
        var e_15, _a;
    };
    return StateGraph;
}());
exports.StateGraph = StateGraph;
