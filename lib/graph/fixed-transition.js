"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_1 = require("./transition");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L45
 */
class FixedTransition extends transition_1.Transition {
    /**
     * Creates an instance of FixedTransition.
     * @param {State} sourceState
     * @param {State} _destinationState
     * @param {TriggerInfo} trigger
     * @param {Iterable<InvocationInfo>} _guards
     * @memberof FixedTransition
     */
    constructor(sourceState, _destinationState, trigger, _guards) {
        super(sourceState, trigger);
        this._destinationState = _destinationState;
        this._guards = _guards;
    }
    /**
     * The state where this transition finishes
     *
     * @readonly
     * @type {State}
     * @memberof FixedTransition
     */
    get destinationState() { return this._destinationState; }
    /**
     * Guard functions for this transition (null if none)
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof FixedTransition
     */
    get guards() { return this._guards; }
}
exports.FixedTransition = FixedTransition;
//# sourceMappingURL=fixed-transition.js.map