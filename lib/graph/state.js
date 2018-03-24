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
Object.defineProperty(exports, "__esModule", { value: true });
var state_info_1 = require("../reflection/state-info");
/**
 * Used to keep track of a state that has substates
 *
 * @export
 * @class State
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/State.cs
 */
var State = /** @class */ (function () {
    /**
     * Creates an instance of State.
     * @param {(StateInfo | string)} stateInfoOrNodeName
     * @memberof State
     */
    function State(stateInfoOrNodeName) {
        this._superState = null;
        this._leaving = [];
        this._arriving = [];
        this._entryActions = [];
        this._exitActions = [];
        if (stateInfoOrNodeName instanceof state_info_1.StateInfo) {
            this._nodeName = "" + stateInfoOrNodeName.underlyingState;
            this._stateName = "" + stateInfoOrNodeName.underlyingState;
            try {
                // Only include entry actions that aren't specific to a trigger
                for (var _a = __values(stateInfoOrNodeName.entryActions), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var entryAction = _b.value;
                    if (!entryAction.fromTrigger) {
                        if (!!entryAction.method) {
                            this._entryActions.push(entryAction.method.description);
                        }
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
                for (var _d = __values(stateInfoOrNodeName.exitActions), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var exitAction = _e.value;
                    if (!!exitAction) {
                        this._exitActions.push(exitAction.description);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_f = _d.return)) _f.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        else {
            this._nodeName = stateInfoOrNodeName;
            this._stateName = null;
        }
        var e_1, _c, e_2, _f;
    }
    Object.defineProperty(State.prototype, "superState", {
        /**
         * The superstate of this state (null if none)
         *
         * @type {(SuperState | null)}
         * @memberof State
         */
        get: function () { return this._superState; },
        /**
         * The superstate of this state (null if none)
         *
         * @memberof State
         */
        set: function (value) { this._superState = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "leaving", {
        /**
         * List of all transitions that leave this state (never null)
         *
         * @readonly
         * @type {Transition[]}
         * @memberof State
         */
        get: function () { return this._leaving; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "arriving", {
        /**
         * List of all transitions that enter this state (never null)
         *
         * @readonly
         * @type {Transition[]}
         * @memberof State
         */
        get: function () { return this._arriving; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "nodeName", {
        /**
         * Unique name of this object
         *
         * @readonly
         * @type {string}
         * @memberof State
         */
        get: function () { return this._nodeName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "stateName", {
        /**
         * Name of the state represented by this object
         *
         * @readonly
         * @type {string}
         * @memberof State
         */
        get: function () { return this._stateName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "entryActions", {
        /**
         * Actions that are executed when you enter this state from any trigger
         *
         * @readonly
         * @type {string[]}
         * @memberof State
         */
        get: function () { return this._entryActions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(State.prototype, "exitActions", {
        /**
         * Actions that are executed when you exit this state
         *
         * @readonly
         * @type {string[]}
         * @memberof State
         */
        get: function () { return this._exitActions; },
        enumerable: true,
        configurable: true
    });
    return State;
}());
exports.State = State;
