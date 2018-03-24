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
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L45
 */
var FixedTransition = /** @class */ (function (_super) {
    __extends(FixedTransition, _super);
    /**
     * Creates an instance of FixedTransition.
     * @param {State} sourceState
     * @param {State} _destinationState
     * @param {TriggerInfo} trigger
     * @param {Iterable<InvocationInfo>} _guards
     * @memberof FixedTransition
     */
    function FixedTransition(sourceState, _destinationState, trigger, _guards) {
        var _this = _super.call(this, sourceState, trigger) || this;
        _this._destinationState = _destinationState;
        _this._guards = _guards;
        return _this;
    }
    Object.defineProperty(FixedTransition.prototype, "destinationState", {
        /**
         * The state where this transition finishes
         *
         * @readonly
         * @type {State}
         * @memberof FixedTransition
         */
        get: function () { return this._destinationState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FixedTransition.prototype, "guards", {
        /**
         * Guard functions for this transition (null if none)
         *
         * @readonly
         * @type {Iterable<InvocationInfo>}
         * @memberof FixedTransition
         */
        get: function () { return this._guards; },
        enumerable: true,
        configurable: true
    });
    return FixedTransition;
}(base_transition_1.BaseTransition));
exports.FixedTransition = FixedTransition;
