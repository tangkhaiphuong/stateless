"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
/**
 * Used to keep track of a state that has substates
 *
 * @export
 * @class SuperState
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/SuperState.cs
 */
class SuperState extends state_1.State {
    /**
     * Creates an instance of SuperState.
     * @param {StateInfo} stateInfo
     * @memberof SuperState
     */
    constructor(stateInfo) {
        super(stateInfo);
        this._subStates = [];
    }
    /**
     * List of states that are a substate of this state
     *
     * @readonly
     * @type {State[]}
     * @memberof SuperState
     */
    get subStates() { return this._subStates; }
}
exports.SuperState = SuperState;
//# sourceMappingURL=super-state.js.map