"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Used to keep track of transitions between states
 *
 * @export
 * @class Transition
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs
 */
class Transition {
    /**
     * Creates an instance of Transition.
     * @param {State} _sourceState
     * @param {TriggerInfo} _trigger
     * @memberof Transition
     */
    constructor(_sourceState, _trigger) {
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
    /**
     * The trigger that causes this transition
     *
     * @readonly
     * @type {TriggerInfo}
     * @memberof Transition
     */
    get trigger() { return this._trigger; }
    /**
     * Should the entry and exit actions be executed when this transition takes place
     *
     * @readonly
     * @type {boolean}
     * @memberof Transition
     */
    get executeEntryExitActions() { return this._executeEntryExitActions; }
    /**
     * The state where this transition starts
     *
     * @readonly
     * @type {State}
     * @memberof Transition
     */
    get sourceState() { return this._sourceState; }
}
exports.Transition = Transition;
//# sourceMappingURL=transition.js.map