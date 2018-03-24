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
var transition_1 = require("./transition");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L65
 */
var DynamicTransition = /** @class */ (function (_super) {
    __extends(DynamicTransition, _super);
    /**
     * Creates an instance of DynamicTransition.
     * @param {State} sourceState
     * @param {State} _destinationState
     * @param {TriggerInfo} trigger
     * @param {string} _criterion
     * @memberof DynamicTransition
     */
    function DynamicTransition(sourceState, _destinationState, trigger, _criterion) {
        var _this = _super.call(this, sourceState, trigger) || this;
        _this._destinationState = _destinationState;
        _this._criterion = _criterion;
        return _this;
    }
    Object.defineProperty(DynamicTransition.prototype, "destinationState", {
        /**
         * The state where this transition finishes
         *
         * @readonly
         * @type {State}
         * @memberof DynamicTransition
         */
        get: function () { return this._destinationState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicTransition.prototype, "criterion", {
        /**
         * When is this transition followed
         *
         * @readonly
         * @type {string}
         * @memberof DynamicTransition
         */
        get: function () { return this._criterion; },
        enumerable: true,
        configurable: true
    });
    return DynamicTransition;
}(transition_1.Transition));
exports.DynamicTransition = DynamicTransition;
