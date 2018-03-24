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
 * Describes a transition that can be initiated from a trigger, but whose result is non-deterministic.
 *
 * @export
 * @class DynamicTransitionInfo
 * @extends {TransitionInfo}
 */
var DynamicTransitionInfo = /** @class */ (function (_super) {
    __extends(DynamicTransitionInfo, _super);
    /**
     * Creates an instance of DynamicTransitionInfo.
     * @param {InvocationInfo} _destinationStateSelectorDescription
     * @param {DynamicStateInfos} _possibleDestinationStates
     * @param {TriggerInfo} _trigger
     * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions
     * @memberof DynamicTransitionInfo
     */
    function DynamicTransitionInfo(_trigger, _guardConditionsMethodDescriptions, _destinationStateSelectorDescription, _possibleDestinationStates) {
        var _this = _super.call(this, _trigger, _guardConditionsMethodDescriptions) || this;
        _this._destinationStateSelectorDescription = _destinationStateSelectorDescription;
        _this._possibleDestinationStates = _possibleDestinationStates;
        return _this;
    }
    DynamicTransitionInfo.create = function (trigger, guards, selector, possibleStates) {
        var transition = new DynamicTransitionInfo(new trigger_info_1.TriggerInfo(trigger), guards || [], selector, possibleStates);
        return transition;
    };
    Object.defineProperty(DynamicTransitionInfo.prototype, "destinationStateSelectorDescription", {
        get: function () { return this._destinationStateSelectorDescription; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicTransitionInfo.prototype, "possibleDestinationStates", {
        get: function () { return this._possibleDestinationStates; },
        enumerable: true,
        configurable: true
    });
    return DynamicTransitionInfo;
}(transition_info_1.TransitionInfo));
exports.DynamicTransitionInfo = DynamicTransitionInfo;
