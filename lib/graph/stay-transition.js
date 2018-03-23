"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_1 = require("./transition");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L85
 */
class StayTransition extends transition_1.Transition {
    /**
     * Creates an instance of StayTransition.
     * @param {State} sourceState
     * @param {TriggerInfo} trigger
     * @param {Iterable<InvocationInfo>} _guards
     * @param {boolean} executeEntryExitActions
     * @memberof StayTransition
     */
    constructor(sourceState, trigger, _guards, executeEntryExitActions) {
        super(sourceState, trigger);
        this._guards = _guards;
        this._executeEntryExitActions = executeEntryExitActions;
    }
    get guards() { return this._guards; }
}
exports.StayTransition = StayTransition;
//# sourceMappingURL=stay-transition.js.map