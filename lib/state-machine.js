"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var unhandled_trigger_action_1 = require("./unhandled-trigger-action");
var on_transitioned_event_1 = require("./on-transitioned-event");
var state_configuration_1 = require("./state-configuration");
var state_pepresentation_1 = require("./state-pepresentation");
var state_machine_info_1 = require("./reflection/state-machine-info");
var transition_1 = require("./transition");
var state_info_1 = require("./reflection/state-info");
var transitioning_trigger_behaviour_1 = require("./transitioning-trigger-behaviour");
var _1 = require(".");
/**
 * Models behaviour as transitions between a finite set of states.
 *
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateMachine.cs
 */
var StateMachine = /** @class */ (function () {
    /**
     * Creates an instance of StateMachine.
     * @param {(TState | { stateAccessor: () => TState; stateMutator: (state: TState) => void; })} initialState
     * @memberof StateMachine
     */
    function StateMachine(initialState) {
        this._stateConfiguration = new Map();
        this._eventQueue = [];
        this._firing = false;
        var checkObject = initialState;
        if (!!checkObject.accessor || !!checkObject.mutator) {
            this._stateAccessor = checkObject.accessor;
            this._stateMutator = checkObject.mutator;
        }
        else {
            var stateReference_1 = { state: initialState };
            this._stateAccessor = function () { return stateReference_1.state; };
            this._stateMutator = function (state) { stateReference_1.state = state; };
        }
        this._unhandledTriggerAction = new unhandled_trigger_action_1.UnhandledTriggerAction(this.defaultUnhandledTriggerAction.bind(this));
        this._onTransitionedEvent = new on_transitioned_event_1.OnTransitionedEvent();
    }
    Object.defineProperty(StateMachine.prototype, "state", {
        /**
         * The initial state
         *
         * @type {TState}
         * @memberof StateMachine
         */
        get: function () {
            return this._stateAccessor();
        },
        /**
         * The current state.
         *
         * @memberof StateMachine
         */
        set: function (state) {
            this._stateMutator(state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateMachine.prototype, "permittedTriggers", {
        /**
         * The currently-permissible trigger values.
         *
         * @readonly
         * @type {Promise<TTrigger[]>}
         * @memberof StateMachine
         */
        get: function () {
            return this.getPermittedTriggers();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The currently-permissible trigger values.
     *
     * @param {...any[]} args
     * @returns {Promise<TTrigger[]>}
     * @memberof StateMachine
     */
    StateMachine.prototype.getPermittedTriggers = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.currentRepresentation.getPermittedTriggers(args);
    };
    Object.defineProperty(StateMachine.prototype, "currentRepresentation", {
        /**
         * Get current presentation.
         *
         * @readonly
         * @type {StateRepresentation<TState, TTrigger>}
         * @memberof StateMachine
         */
        get: function () {
            return this.getRepresentation(this.state);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Provides an info object which exposes the states, transitions, and actions of this machine.
     *
     * @param {string} stateType
     * @param {string} triggerType
     * @returns {StateMachineInfo}
     * @memberof StateMachine
     */
    StateMachine.prototype.getInfo = function (stateType, triggerType) {
        if (stateType === void 0) { stateType = 'State'; }
        if (triggerType === void 0) { triggerType = 'Trigger'; }
        var representations = new Map(this._stateConfiguration);
        var except = new Set(representations.keys());
        var destinations = new Set();
        try {
            for (var _a = __values(this._stateConfiguration), _b = _a.next(); !_b.done; _b = _a.next()) {
                var kvp = _b.value;
                try {
                    for (var _c = __values(kvp['1'].triggerBehaviours.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var behaviours = _d.value;
                        try {
                            for (var behaviours_1 = __values(behaviours), behaviours_1_1 = behaviours_1.next(); !behaviours_1_1.done; behaviours_1_1 = behaviours_1.next()) {
                                var item = behaviours_1_1.value;
                                if (item instanceof transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour) {
                                    destinations.add(item.destination);
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (behaviours_1_1 && !behaviours_1_1.done && (_e = behaviours_1.return)) _e.call(behaviours_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var reachable = [];
        try {
            for (var destinations_1 = __values(destinations), destinations_1_1 = destinations_1.next(); !destinations_1_1.done; destinations_1_1 = destinations_1.next()) {
                var underlying = destinations_1_1.value;
                if (except.has(underlying)) {
                    continue;
                }
                reachable.push(new state_pepresentation_1.StateRepresentation(underlying));
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (destinations_1_1 && !destinations_1_1.done && (_h = destinations_1.return)) _h.call(destinations_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var reachable_1 = __values(reachable), reachable_1_1 = reachable_1.next(); !reachable_1_1.done; reachable_1_1 = reachable_1.next()) {
                var representation = reachable_1_1.value;
                representations.set(representation.underlyingState, representation);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (reachable_1_1 && !reachable_1_1.done && (_j = reachable_1.return)) _j.call(reachable_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        var info = new Map();
        try {
            for (var representations_1 = __values(representations), representations_1_1 = representations_1.next(); !representations_1_1.done; representations_1_1 = representations_1.next()) {
                var item = representations_1_1.value;
                info.set(item[0], state_info_1.StateInfo.createStateInfo(item[1]));
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (representations_1_1 && !representations_1_1.done && (_k = representations_1.return)) _k.call(representations_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            for (var info_1 = __values(info), info_1_1 = info_1.next(); !info_1_1.done; info_1_1 = info_1.next()) {
                var state = info_1_1.value;
                var stateRepresentation = representations.get(state[0]);
                if (!stateRepresentation) {
                    continue;
                }
                state_info_1.StateInfo.addRelationships(state[1], stateRepresentation, function (k) {
                    var result = info.get(k);
                    if (!result) {
                        throw new Error('Cannot lookup state');
                    }
                    return result;
                });
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (info_1_1 && !info_1_1.done && (_l = info_1.return)) _l.call(info_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return new state_machine_info_1.StateMachineInfo(__spread((info.values() || [])), stateType, triggerType);
        var e_3, _g, e_2, _f, e_1, _e, e_4, _h, e_5, _j, e_6, _k, e_7, _l;
    };
    StateMachine.prototype.getRepresentation = function (state) {
        var result = this._stateConfiguration.get(state);
        if (!result) {
            result = new state_pepresentation_1.StateRepresentation(state);
            this._stateConfiguration.set(state, result);
        }
        return result;
    };
    /**
     * Begin configuration of the entry/exit actions and allowed transitions
     * when the state machine is in a particular state.
     *
     * @param {TState} state The state to configure.
     * @returns {StateConfiguration<TState, TTrigger>} >A configuration object through which the state can be configured.
     * @memberof StateMachine
     */
    StateMachine.prototype.configure = function (state) {
        return new state_configuration_1.StateConfiguration(this, this.getRepresentation(state), this.getRepresentation.bind(this));
    };
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
    StateMachine.prototype.fire = function (trigger) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.internalFire(trigger, args)];
            });
        });
    };
    /**
     * Activates current state. Actions associated with activating the currrent state
     * will be invoked. The activation is idempotent and subsequent activation of the same current state
     * will not lead to re-execution of activation callbacks.
     *
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    StateMachine.prototype.activate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var representativeState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        representativeState = this.getRepresentation(this.state);
                        return [4 /*yield*/, representativeState.activate()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Deactivates current state. Actions associated with deactivating the currrent state
     * will be invoked. The deactivation is idempotent and subsequent deactivation of the same current state
     * will not lead to re-execution of deactivation callbacks.
     *
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    StateMachine.prototype.deactivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var representativeState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        representativeState = this.getRepresentation(this.state);
                        return [4 /*yield*/, representativeState.deactivate()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
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
    StateMachine.prototype.internalFire = function (trigger, args) {
        return __awaiter(this, void 0, void 0, function () {
            var queuedEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this._firing) {
                            this._eventQueue.push({ trigger: trigger, args: args });
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 8, 9]);
                        this._firing = true;
                        return [4 /*yield*/, this.internalFireOne(trigger, args)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!(this._eventQueue.length !== 0)) return [3 /*break*/, 7];
                        queuedEvent = this._eventQueue.shift();
                        if (!!!queuedEvent) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.internalFireOne(queuedEvent.trigger, queuedEvent.args)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        this._firing = false;
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    StateMachine.prototype.internalFireOne = function (trigger, args) {
        return __awaiter(this, void 0, void 0, function () {
            var source, representativeState, _a, result, handler, _b, result2, destination, transition, newRepresentation, transition;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        source = this.state;
                        representativeState = this.getRepresentation(source);
                        return [4 /*yield*/, representativeState.tryFindHandler(trigger, args)];
                    case 1:
                        _a = __read.apply(void 0, [_c.sent(), 2]), result = _a[0], handler = _a[1];
                        if (!(!result || !handler)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._unhandledTriggerAction.execute(representativeState.underlyingState, trigger, !!handler ? handler.unmetGuardConditions : [])];
                    case 2:
                        _c.sent();
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, handler.handler.resultsInTransitionFrom(source, args)];
                    case 4:
                        _b = __read.apply(void 0, [_c.sent(), 2]), result2 = _b[0], destination = _b[1];
                        if (!result2) return [3 /*break*/, 7];
                        transition = new transition_1.Transition(source, destination, trigger);
                        return [4 /*yield*/, representativeState.exit(transition)];
                    case 5:
                        transition = _c.sent();
                        this.state = transition.destination;
                        newRepresentation = this.getRepresentation(transition.destination);
                        this._onTransitionedEvent.invoke(transition);
                        return [4 /*yield*/, newRepresentation.enter(transition, args)];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 7:
                        transition = new transition_1.Transition(source, destination, trigger);
                        return [4 /*yield*/, this.currentRepresentation.internalAction(transition, args)];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Override the default behaviour of throwing an exception when an unhandled trigger
     *
     * @param {((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>)} unhandledTriggerAction >An action to call when an unhandled trigger is fired.
     * @memberof StateMachine
     */
    StateMachine.prototype.onUnhandledTrigger = function (unhandledTriggerAction) {
        this._unhandledTriggerAction = new unhandled_trigger_action_1.UnhandledTriggerAction(unhandledTriggerAction);
    };
    /**
     * Determine if the state machine is in the supplied state.
     *
     * @param {TState} state
     * @returns {boolean} True if the current state is equal to, or a substate of, the supplied state.
     * @memberof StateMachine
     */
    StateMachine.prototype.isInState = function (state) {
        return this.currentRepresentation.isIncludedIn(state);
    };
    /**
     * Returns true if <paramref name="trigger"/> can be fired in the current state.
     *
     * @param {TTrigger} trigger Trigger to test.
     * @returns {boolean} True if the trigger can be fired, false otherwise.
     * @memberof StateMachine
     */
    StateMachine.prototype.canFire = function (trigger) {
        return this.currentRepresentation.canHandle(trigger);
    };
    /**
     *  A human-readable representation of the state machine.
     *
     * @returns {string} A description of the current state and permitted triggers.
     * @memberof StateMachine
     */
    StateMachine.prototype.toString = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = "StateMachine { state = " + this.state + ", permittedTriggers = { ";
                        return [4 /*yield*/, this.permittedTriggers];
                    case 1: return [2 /*return*/, _a + (_b.sent()).join(', ') + " }}"];
                }
            });
        });
    };
    /**
     * Export state machine to dot graph.
     *
     * @returns {string} The dot graph.
     * @memberof StateMachine
     */
    StateMachine.prototype.toDotGraph = function () {
        return _1.UmlDotGraph.format(this.getInfo());
    };
    StateMachine.prototype.defaultUnhandledTriggerAction = function (state, trigger, unmetGuardConditions) {
        var source = state;
        this.getRepresentation(source);
        if (!unmetGuardConditions || unmetGuardConditions.length === 0) {
            throw new Error("Trigger '" + trigger + "' is valid for transition from state '" + state + "' but a guard conditions are not met. Guard descriptions: '" + unmetGuardConditions + "'.");
        }
        throw new Error("No valid leaving transitions are permitted from state '" + trigger + "' for trigger '" + state + "'. Consider ignoring the trigger.");
    };
    /**
     * Registers a callback that will be invoked every time the statemachine transitions from one state into another.
     *
     * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} onTransitionAction The action to execute, accepting the details
     * @memberof StateMachine
     */
    StateMachine.prototype.onTransitioned = function (onTransitionAction) {
        this._onTransitionedEvent.register(onTransitionAction);
    };
    return StateMachine;
}());
exports.StateMachine = StateMachine;
