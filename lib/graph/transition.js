"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used to keep track of transitions between states
 *
 * @export
 * @class Transition
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs
 */
var Transition = /** @class */ (function () {
    /**
     * Creates an instance of Transition.
     * @param {State} _sourceState
     * @param {TriggerInfo} _trigger
     * @memberof Transition
     */
    function Transition(_sourceState, _trigger) {
        this._sourceState = _sourceState;
        this._trigger = _trigger;
        this._executeEntryExitActions = true;
        /**
         * List of actions to be performed by the destination state (the one being entered)
         *
         * @readonly
         * @type {ActionInfoơ}
         * @memberof Transition
         */
        this.destinationEntryActions = [];
    }
    Object.defineProperty(Transition.prototype, "trigger", {
        /**
         * The trigger that causes this transition
         *
         * @readonly
         * @type {TriggerInfo}
         * @memberof Transition
         */
        get: function () { return this._trigger; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "executeEntryExitActions", {
        /**
         * Should the entry and exit actions be executed when this transition takes place
         *
         * @readonly
         * @type {boolean}
         * @memberof Transition
         */
        get: function () { return this._executeEntryExitActions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "sourceState", {
        /**
         * The state where this transition starts
         *
         * @readonly
         * @type {State}
         * @memberof Transition
         */
        get: function () { return this._sourceState; },
        enumerable: true,
        configurable: true
    });
    return Transition;
}());
exports.Transition = Transition;
