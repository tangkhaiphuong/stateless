"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var stay_transition_1 = require("./stay-transition");
var fixed_transition_1 = require("./fixed-transition");
var dynamic_transition_1 = require("./dynamic-transition");
/**
 * Style definition for StateGraph.
 * Provides formatting of individual items in a state graph.
 *
 * @export
 * @abstract
 * @class GraphStyle
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/IGraphStyle.cs
 */
var GraphStyle = /** @class */ (function () {
    function GraphStyle() {
    }
    /**
     * Returns the formatted text for all the transitions found in the state graph.
     * This form, which can be overridden, determines the type of each transition and passes the appropriate
     * parameters to the virtual formatOneTransition() function.
     *
     * @param {Iterable<Transition>} transitions List of all transitions in the state graph
     * @returns {Iterable<string>} Description of all transitions, in the desired format
     * @memberof GraphStyle
     */
    GraphStyle.prototype.formatAllTransitions = function (transitions) {
        var iterableDescription, transitions_1, transitions_1_1, transit, line, e_1_1, e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    iterableDescription = function (guards) {
                        var guards_1, guards_1_1, item, e_2_1, e_2, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 5, 6, 7]);
                                    guards_1 = __values(guards), guards_1_1 = guards_1.next();
                                    _b.label = 1;
                                case 1:
                                    if (!!guards_1_1.done) return [3 /*break*/, 4];
                                    item = guards_1_1.value;
                                    return [4 /*yield*/, item.description];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    guards_1_1 = guards_1.next();
                                    return [3 /*break*/, 1];
                                case 4: return [3 /*break*/, 7];
                                case 5:
                                    e_2_1 = _b.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 7];
                                case 6:
                                    try {
                                        if (guards_1_1 && !guards_1_1.done && (_a = guards_1.return)) _a.call(guards_1);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                    return [7 /*endfinally*/];
                                case 7: return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 8]);
                    transitions_1 = __values(transitions), transitions_1_1 = transitions_1.next();
                    _b.label = 2;
                case 2:
                    if (!!transitions_1_1.done) return [3 /*break*/, 5];
                    transit = transitions_1_1.value;
                    line = void 0;
                    if (transit instanceof stay_transition_1.StayTransition) {
                        if (!transit.executeEntryExitActions) {
                            line = this.formatOneTransition(transit.sourceState.nodeName, "" + transit.trigger.underlyingTrigger, null, transit.sourceState.nodeName, iterableDescription(transit.guards));
                        }
                        else if (transit.sourceState.entryActions.length === 0) {
                            line = this.formatOneTransition(transit.sourceState.nodeName, "" + transit.trigger.underlyingTrigger, null, transit.sourceState.nodeName, iterableDescription(transit.guards));
                        }
                        else {
                            // There are entry functions into the state, so call out that this transition
                            // does invoke them (since normally a transition back into the same state doesn't)
                            line = this.formatOneTransition(transit.sourceState.nodeName, "" + transit.trigger.underlyingTrigger, transit.sourceState.entryActions, transit.sourceState.nodeName, iterableDescription(transit.guards));
                        }
                    }
                    else {
                        if (transit instanceof fixed_transition_1.FixedTransition) {
                            line = this.formatOneTransition(transit.sourceState.nodeName, "" + transit.trigger.underlyingTrigger, transit.destinationEntryActions.map(function (x) { return x.method.description; }), transit.destinationState.nodeName, iterableDescription(transit.guards));
                        }
                        else {
                            if (transit instanceof dynamic_transition_1.DynamicTransition) {
                                line = this.formatOneTransition(transit.sourceState.nodeName, "" + transit.trigger.underlyingTrigger, transit.destinationEntryActions.map(function (x) { return x.method.description; }), transit.destinationState.nodeName, [transit.criterion]);
                            }
                            else {
                                throw new Error('Unexpected transition type');
                            }
                        }
                    }
                    if (!!!line) return [3 /*break*/, 4];
                    return [4 /*yield*/, line];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    transitions_1_1 = transitions_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (transitions_1_1 && !transitions_1_1.done && (_a = transitions_1.return)) _a.call(transitions_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    };
    /**
     * Returns the formatted text for a single transition.  Only required if the default version of
     * formatAllTransitions() is used.
     *
     * @param {string} _source NodeName Node name of the source state node
     * @param {string} _trigger Name of the trigger
     * @param {Iterable<string>} _actions List of entry and exit actions (if any)
     * @param {string} _destinationNodeName
     * @param {Iterable<string>} _guards List of guards (if any)
     * @returns {string}
     * @memberof GraphStyle
     */
    GraphStyle.prototype.formatOneTransition = function (_sourceNodeName, _trigger, _actions, _destinationNodeName, _guards) {
        throw new Error('If you use GraphStyle.formatAllTransitions() you must implement an override of formatOneTransition()');
    };
    return GraphStyle;
}());
exports.GraphStyle = GraphStyle;
