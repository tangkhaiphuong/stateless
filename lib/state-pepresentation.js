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
Object.defineProperty(exports, "__esModule", { value: true });
var transition_1 = require("./transition");
var internal_action_behaviour_1 = require("./internal-action-behaviour");
var trigger_behaviour_result_1 = require("./trigger-behaviour-result");
var entry_action_behaviour_1 = require("./entry-action-behaviour");
var exit_action_behaviour_1 = require("./exit-action-behaviour");
var deactivate_action_behaviour_1 = require("./deactivate-action-behaviour");
var activate_action_behaviour_1 = require("./activate-action-behaviour");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateRepresentation.cs
 *
 * @export
 * @class StateRepresentation
 * @template TState
 * @template TTrigger
 */
var StateRepresentation = /** @class */ (function () {
    function StateRepresentation(_state) {
        this._state = _state;
        this._triggerBehaviours = new Map();
        this._entryActions = [];
        this._exitActions = [];
        this._activateActions = [];
        this._deactivateActions = [];
        this._internalActions = [];
        this._active = false;
        this._superstate = null;
        this._substates = [];
    }
    StateRepresentation.prototype.getSubstates = function () {
        return this._substates;
    };
    Object.defineProperty(StateRepresentation.prototype, "triggerBehaviours", {
        get: function () {
            return this._triggerBehaviours;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateRepresentation.prototype, "entryActions", {
        get: function () {
            return this._entryActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateRepresentation.prototype, "exitActions", {
        get: function () {
            return this._exitActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateRepresentation.prototype, "activateActions", {
        get: function () {
            return this._activateActions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateRepresentation.prototype, "deactivateActions", {
        get: function () {
            return this._deactivateActions;
        },
        enumerable: true,
        configurable: true
    });
    StateRepresentation.prototype.canHandle = function (trigger) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.tryFindHandler(trigger, args)];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 1]), result = _a[0];
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Object.defineProperty(StateRepresentation.prototype, "underlyingState", {
        get: function () { return this._state; },
        enumerable: true,
        configurable: true
    });
    StateRepresentation.prototype.addSubstate = function (substate) {
        this._substates.push(substate);
    };
    Object.defineProperty(StateRepresentation.prototype, "superstate", {
        get: function () { return this._superstate; },
        set: function (value) { this._superstate = value; },
        enumerable: true,
        configurable: true
    });
    StateRepresentation.prototype.addTriggerBehaviour = function (triggerBehaviour) {
        var allowed = this._triggerBehaviours.get(triggerBehaviour.trigger);
        if (!allowed) {
            allowed = [];
            this._triggerBehaviours.set(triggerBehaviour.trigger, allowed);
        }
        allowed.push(triggerBehaviour);
    };
    StateRepresentation.prototype.addInternalAction = function (trigger, action) {
        this._internalActions.push(new internal_action_behaviour_1.InternalActionBehaviour(function (t, args) {
            if (t.trigger === trigger) {
                action(t, args);
            }
        }));
    };
    StateRepresentation.prototype.activate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!!this._superstate) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._superstate.activate()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this._active) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.executeActivationActions()];
                    case 3:
                        _a.sent();
                        this._active = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.deactivate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._active) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.executeDeactivationActions()];
                    case 1:
                        _a.sent();
                        this._active = false;
                        if (!!!this._superstate) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._superstate.deactivate()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.tryFindHandler = function (trigger, args) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, result, handler;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.tryFindLocalHandler(trigger, args)];
                    case 1:
                        _a = __read.apply(void 0, [_b.sent(), 2]), result = _a[0], handler = _a[1];
                        if (result) {
                            return [2 /*return*/, [result, handler]];
                        }
                        if (!(this.superstate !== null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.superstate.tryFindHandler(trigger, args)];
                    case 2: return [2 /*return*/, _b.sent()];
                    case 3: return [2 /*return*/, [false, undefined]];
                }
            });
        });
    };
    StateRepresentation.prototype.tryFindLocalHandler = function (trigger, args) {
        return __awaiter(this, void 0, void 0, function () {
            var handler, actual, handler_1, handler_1_1, item, condition, e_1_1, handlerResult, e_1, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        handler = this._triggerBehaviours.get(trigger);
                        if (!handler) {
                            return [2 /*return*/, [false, undefined]];
                        }
                        actual = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        handler_1 = __values(handler), handler_1_1 = handler_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!handler_1_1.done) return [3 /*break*/, 5];
                        item = handler_1_1.value;
                        return [4 /*yield*/, item.unmetGuardConditions(args)];
                    case 3:
                        condition = _b.sent();
                        actual.push(new trigger_behaviour_result_1.TriggerBehaviourResult(item, condition));
                        _b.label = 4;
                    case 4:
                        handler_1_1 = handler_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (handler_1_1 && !handler_1_1.done && (_a = handler_1.return)) _a.call(handler_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8:
                        handlerResult = this.tryFindLocalHandlerResult(trigger, actual, function (r) { return r.unmetGuardConditions.length === 0; })
                            || this.tryFindLocalHandlerResult(trigger, actual, function (r) { return r.unmetGuardConditions.length > 0; });
                        if (!!handlerResult) {
                            return [2 /*return*/, [handlerResult.unmetGuardConditions.length === 0, handlerResult]];
                        }
                        else {
                            return [2 /*return*/, [false, handlerResult]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.tryFindLocalHandlerResult = function (trigger, results, filter) {
        var actual;
        try {
            for (var results_1 = __values(results), results_1_1 = results_1.next(); !results_1_1.done; results_1_1 = results_1.next()) {
                var item = results_1_1.value;
                if (!!actual) {
                    throw new Error("Multiple permitted exit transitions are configured from state '" + trigger + "' for trigger '" + this._state + "'. Guard clauses must be mutually exclusive.");
                }
                if (filter(item)) {
                    actual = item;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (results_1_1 && !results_1_1.done && (_a = results_1.return)) _a.call(results_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return actual;
        var e_2, _a;
    };
    StateRepresentation.prototype.addActivateAction = function (action, activateActionDescription) {
        this._activateActions.push(new activate_action_behaviour_1.ActivateActionBehaviour(this._state, action, activateActionDescription));
    };
    StateRepresentation.prototype.addDeactivateAction = function (action, deactivateActionDescription) {
        this._deactivateActions.push(new deactivate_action_behaviour_1.DeactivateActionBehaviour(this._state, action, deactivateActionDescription));
    };
    StateRepresentation.prototype.addEntryAction = function (trigger, action, entryActionDescription) {
        this._entryActions.push(new entry_action_behaviour_1.EntryActionBehaviour(action, entryActionDescription, trigger));
    };
    StateRepresentation.prototype.addExitAction = function (action, exitActionDescription) {
        this._exitActions.push(new exit_action_behaviour_1.ExitActionBehaviour(action, exitActionDescription));
    };
    StateRepresentation.prototype.internalAction = function (transition, args) {
        return __awaiter(this, void 0, void 0, function () {
            var possibleActions, aStateRep, _a, result, _b, _c, item, possibleActions_1, possibleActions_1_1, action, e_3_1, e_4, _d, e_3, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        possibleActions = [];
                        aStateRep = this;
                        _f.label = 1;
                    case 1:
                        if (!(aStateRep !== null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, aStateRep.tryFindLocalHandler(transition.trigger, args)];
                    case 2:
                        _a = __read.apply(void 0, [_f.sent(), 1]), result = _a[0];
                        if (result) {
                            try {
                                // Trigger handler(s) found in this state
                                for (_b = __values(aStateRep._internalActions), _c = _b.next(); !_c.done; _c = _b.next()) {
                                    item = _c.value;
                                    possibleActions.push(item);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            return [3 /*break*/, 3];
                        }
                        // Try to look for trigger handlers in superstate (if it exists)
                        aStateRep = aStateRep._superstate;
                        return [3 /*break*/, 1];
                    case 3:
                        _f.trys.push([3, 8, 9, 10]);
                        possibleActions_1 = __values(possibleActions), possibleActions_1_1 = possibleActions_1.next();
                        _f.label = 4;
                    case 4:
                        if (!!possibleActions_1_1.done) return [3 /*break*/, 7];
                        action = possibleActions_1_1.value;
                        return [4 /*yield*/, action.execute(transition, args)];
                    case 5:
                        _f.sent();
                        _f.label = 6;
                    case 6:
                        possibleActions_1_1 = possibleActions_1.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_3_1 = _f.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (possibleActions_1_1 && !possibleActions_1_1.done && (_e = possibleActions_1.return)) _e.call(possibleActions_1);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.enter = function (transition, entryArgs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!transition.isReentry) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.executeEntryActions(transition, entryArgs)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.executeActivationActions()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 3:
                        if (!!this.includes(transition.source)) return [3 /*break*/, 8];
                        if (!!!this._superstate) return [3 /*break*/, 5];
                        return [4 /*yield*/, this._superstate.enter(transition, entryArgs)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.executeEntryActions(transition, entryArgs)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.executeActivationActions()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.exit = function (transition) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!transition.isReentry) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.executeDeactivationActions()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.executeExitActions(transition)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 3:
                        if (!!this.includes(transition.destination)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.executeDeactivationActions()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.executeExitActions(transition)];
                    case 5:
                        _a.sent();
                        if (!!!this._superstate) return [3 /*break*/, 7];
                        transition = new transition_1.Transition(this._superstate.underlyingState, transition.destination, transition.trigger);
                        return [4 /*yield*/, this._superstate.exit(transition)];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [2 /*return*/, transition];
                }
            });
        });
    };
    StateRepresentation.prototype.executeDeactivationActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, action, e_5_1, e_5, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(this._deactivateActions), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        action = _b.value;
                        return [4 /*yield*/, action.execute()];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_5_1 = _d.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.executeEntryActions = function (transition, entryArgs) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, action, e_6_1, e_6, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(this._entryActions), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        action = _b.value;
                        return [4 /*yield*/, action.execute(transition, entryArgs)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_6_1 = _d.sent();
                        e_6 = { error: e_6_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_6) throw e_6.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.executeExitActions = function (transition) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, action, e_7_1, e_7, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(this._exitActions), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        action = _b.value;
                        return [4 /*yield*/, action.execute(transition)];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_7_1 = _d.sent();
                        e_7 = { error: e_7_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_7) throw e_7.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.executeActivationActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, action, e_8_1, e_8, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(this._activateActions), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        action = _b.value;
                        return [4 /*yield*/, action.execute()];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_8_1 = _d.sent();
                        e_8 = { error: e_8_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_8) throw e_8.error; }
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    StateRepresentation.prototype.includes = function (state) {
        if (this._state === state) {
            return true;
        }
        try {
            for (var _a = __values(this._substates), _b = _a.next(); !_b.done; _b = _a.next()) {
                var item = _b.value;
                if (item.includes(state)) {
                    return true;
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_9) throw e_9.error; }
        }
        return false;
        var e_9, _c;
    };
    StateRepresentation.prototype.isIncludedIn = function (state) {
        return this._state === state || (!!this._superstate && this._superstate.isIncludedIn(state));
    };
    Object.defineProperty(StateRepresentation.prototype, "permittedTriggers", {
        get: function () {
            return this.getPermittedTriggers([]);
        },
        enumerable: true,
        configurable: true
    });
    StateRepresentation.prototype.getPermittedTriggers = function (args) {
        var _this = this;
        var implement = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, _a, _b, item, flag, _c, _d, subItem, e_10_1, e_11_1, _e, _f, item, e_12_1, e_11, _g, e_10, _h, e_12, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        result = [];
                        _k.label = 1;
                    case 1:
                        _k.trys.push([1, 13, 14, 15]);
                        _a = __values(this._triggerBehaviours), _b = _a.next();
                        _k.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 12];
                        item = _b.value;
                        flag = false;
                        _k.label = 3;
                    case 3:
                        _k.trys.push([3, 8, 9, 10]);
                        _c = __values(item['1']), _d = _c.next();
                        _k.label = 4;
                    case 4:
                        if (!!_d.done) return [3 /*break*/, 7];
                        subItem = _d.value;
                        return [4 /*yield*/, subItem.unmetGuardConditions(args)];
                    case 5:
                        if ((_k.sent()).length === 0) {
                            flag = true;
                            return [3 /*break*/, 7];
                        }
                        _k.label = 6;
                    case 6:
                        _d = _c.next();
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 10];
                    case 8:
                        e_10_1 = _k.sent();
                        e_10 = { error: e_10_1 };
                        return [3 /*break*/, 10];
                    case 9:
                        try {
                            if (_d && !_d.done && (_h = _c.return)) _h.call(_c);
                        }
                        finally { if (e_10) throw e_10.error; }
                        return [7 /*endfinally*/];
                    case 10:
                        if (flag) {
                            result.push(item['0']);
                        }
                        _k.label = 11;
                    case 11:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 12: return [3 /*break*/, 15];
                    case 13:
                        e_11_1 = _k.sent();
                        e_11 = { error: e_11_1 };
                        return [3 /*break*/, 15];
                    case 14:
                        try {
                            if (_b && !_b.done && (_g = _a.return)) _g.call(_a);
                        }
                        finally { if (e_11) throw e_11.error; }
                        return [7 /*endfinally*/];
                    case 15:
                        if (!!!this.superstate) return [3 /*break*/, 23];
                        _k.label = 16;
                    case 16:
                        _k.trys.push([16, 21, 22, 23]);
                        return [4 /*yield*/, this.superstate.getPermittedTriggers(args)];
                    case 17:
                        _e = __values.apply(void 0, [_k.sent()]), _f = _e.next();
                        _k.label = 18;
                    case 18:
                        if (!!_f.done) return [3 /*break*/, 20];
                        item = _f.value;
                        result.push(item);
                        _k.label = 19;
                    case 19:
                        _f = _e.next();
                        return [3 /*break*/, 18];
                    case 20: return [3 /*break*/, 23];
                    case 21:
                        e_12_1 = _k.sent();
                        e_12 = { error: e_12_1 };
                        return [3 /*break*/, 23];
                    case 22:
                        try {
                            if (_f && !_f.done && (_j = _e.return)) _j.call(_e);
                        }
                        finally { if (e_12) throw e_12.error; }
                        return [7 /*endfinally*/];
                    case 23: return [2 /*return*/, result];
                }
            });
        }); };
        return implement();
    };
    return StateRepresentation;
}());
exports.StateRepresentation = StateRepresentation;
