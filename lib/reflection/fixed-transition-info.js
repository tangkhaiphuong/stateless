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
var transition_info_1 = require("./transition-info");
var trigger_info_1 = require("./trigger-info");
/**
 * Describes a transition that can be initiated from a trigger.
 *
 * @export
 * @class FixedTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/FixedTransitionInfo.cs
 */
var FixedTransitionInfo = /** @class */ (function (_super) {
    __extends(FixedTransitionInfo, _super);
    /**
     * Creates an instance of FixedTransitionInfo.
     * @param {StateInfo} _destinationState
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof FixedTransitionInfo
     */
    function FixedTransitionInfo(_trigger, _guardConditionsMethodDescriptions, _destinationState) {
        var _this = _super.call(this, _trigger, _guardConditionsMethodDescriptions) || this;
        _this._destinationState = _destinationState;
        return _this;
    }
    FixedTransitionInfo.create = function (behaviour, destinationStateInfo) {
        var transition = new FixedTransitionInfo(new trigger_info_1.TriggerInfo(behaviour.trigger), !behaviour.guard ? [] : behaviour.guard.conditions.map(function (c) { return c.methodDescription; }), destinationStateInfo);
        return transition;
    };
    Object.defineProperty(FixedTransitionInfo.prototype, "destinationState", {
        /**
         * The state that will be transitioned into on activation.
         *
         * @readonly
         * @type {StateInfo}
         * @memberof FixedTransitionInfo
         */
        get: function () { return this._destinationState; },
        enumerable: true,
        configurable: true
    });
    return FixedTransitionInfo;
}(transition_info_1.TransitionInfo));
exports.FixedTransitionInfo = FixedTransitionInfo;
