"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_info_1 = require("../reflection/state-info");
/**
 * Used to keep track of a state that has substates
 *
 * @export
 * @class State
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/State.cs
 */
class State {
    /**
     * Creates an instance of State.
     * @param {(StateInfo | string)} stateInfoOrNodeName
     * @memberof State
     */
    constructor(stateInfoOrNodeName) {
        this._superState = null;
        this._leaving = [];
        this._arriving = [];
        this._entryActions = [];
        this._exitActions = [];
        if (stateInfoOrNodeName instanceof state_info_1.StateInfo) {
            this._nodeName = `${stateInfoOrNodeName.underlyingState}`;
            this._stateName = `${stateInfoOrNodeName.underlyingState}`;
            // Only include entry actions that aren't specific to a trigger
            for (const entryAction of stateInfoOrNodeName.entryActions) {
                if (!entryAction.fromTrigger) {
                    if (!!entryAction.method) {
                        this._entryActions.push(entryAction.method.description);
                    }
                }
            }
            for (const exitAction of stateInfoOrNodeName.exitActions) {
                if (!!exitAction) {
                    this._exitActions.push(exitAction.description);
                }
            }
        }
        else {
            this._nodeName = stateInfoOrNodeName;
            this._stateName = null;
        }
    }
    /**
     * The superstate of this state (null if none)
     *
     * @type {(SuperState | null)}
     * @memberof State
     */
    get superState() { return this._superState; }
    /**
     * The superstate of this state (null if none)
     *
     * @memberof State
     */
    set superState(value) { this._superState = value; }
    /**
     * List of all transitions that leave this state (never null)
     *
     * @readonly
     * @type {Transition[]}
     * @memberof State
     */
    get leaving() { return this._leaving; }
    /**
     * List of all transitions that enter this state (never null)
     *
     * @readonly
     * @type {Transition[]}
     * @memberof State
     */
    get arriving() { return this._arriving; }
    /**
     * Unique name of this object
     *
     * @readonly
     * @type {string}
     * @memberof State
     */
    get nodeName() { return this._nodeName; }
    /**
     * Name of the state represented by this object
     *
     * @readonly
     * @type {string}
     * @memberof State
     */
    get stateName() { return this._stateName; }
    /**
     * Actions that are executed when you enter this state from any trigger
     *
     * @readonly
     * @type {string[]}
     * @memberof State
     */
    get entryActions() { return this._entryActions; }
    /**
     * Actions that are executed when you exit this state
     *
     * @readonly
     * @type {string[]}
     * @memberof State
     */
    get exitActions() { return this._exitActions; }
}
exports.State = State;
//# sourceMappingURL=state.js.map