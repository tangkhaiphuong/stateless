"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_1 = require("./transition");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L65
 */
class DynamicTransition extends transition_1.Transition {
    /**
     * Creates an instance of DynamicTransition.
     * @param {State} sourceState
     * @param {State} _destinationState
     * @param {TriggerInfo} trigger
     * @param {string} _criterion
     * @memberof DynamicTransition
     */
    constructor(sourceState, _destinationState, trigger, _criterion) {
        super(sourceState, trigger);
        this._destinationState = _destinationState;
        this._criterion = _criterion;
    }
    /**
     * The state where this transition finishes
     *
     * @readonly
     * @type {State}
     * @memberof DynamicTransition
     */
    get destinationState() { return this._destinationState; }
    /**
     * When is this transition followed
     *
     * @readonly
     * @type {string}
     * @memberof DynamicTransition
     */
    get criterion() { return this._criterion; }
}
exports.DynamicTransition = DynamicTransition;
//# sourceMappingURL=dynamic-transition.js.map