"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
/**
 * Used to keep track of a state that has substates
 *
 * @export
 * @class SuperState
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/SuperState.cs
 */
var SuperState = /** @class */ (function (_super) {
    __extends(SuperState, _super);
    /**
     * Creates an instance of SuperState.
     * @param {StateInfo} stateInfo
     * @memberof SuperState
     */
    function SuperState(stateInfo) {
        var _this = _super.call(this, stateInfo) || this;
        _this._subStates = [];
        return _this;
    }
    Object.defineProperty(SuperState.prototype, "subStates", {
        /**
         * List of states that are a substate of this state
         *
         * @readonly
         * @type {State[]}
         * @memberof SuperState
         */
        get: function () { return this._subStates; },
        enumerable: true,
        configurable: true
    });
    return SuperState;
}(state_1.State));
exports.SuperState = SuperState;
