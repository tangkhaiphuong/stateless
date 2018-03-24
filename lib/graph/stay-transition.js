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
var base_transition_1 = require("./base-transition");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L85
 */
var StayTransition = /** @class */ (function (_super) {
    __extends(StayTransition, _super);
    /**
     * Creates an instance of StayTransition.
     * @param {State} sourceState
     * @param {TriggerInfo} trigger
     * @param {Iterable<InvocationInfo>} _guards
     * @param {boolean} executeEntryExitActions
     * @memberof StayTransition
     */
    function StayTransition(sourceState, trigger, _guards, executeEntryExitActions) {
        var _this = _super.call(this, sourceState, trigger) || this;
        _this._guards = _guards;
        _this._executeEntryExitActions = executeEntryExitActions;
        return _this;
    }
    Object.defineProperty(StayTransition.prototype, "guards", {
        get: function () { return this._guards; },
        enumerable: true,
        configurable: true
    });
    return StayTransition;
}(base_transition_1.BaseTransition));
exports.StayTransition = StayTransition;
