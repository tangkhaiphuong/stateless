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
 * Describes a trigger that is "ignored" (stays in the same state)
 *
 * @export
 * @class IgnoredTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/IgnoredTransitionInfo.cs
 */
var IgnoredTransitionInfo = /** @class */ (function (_super) {
    __extends(IgnoredTransitionInfo, _super);
    function IgnoredTransitionInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IgnoredTransitionInfo.create = function (behaviour) {
        var transition = new IgnoredTransitionInfo(new trigger_info_1.TriggerInfo(behaviour.trigger), !behaviour.guard ? [] : behaviour.guard.conditions.map(function (c) { return c.methodDescription; }));
        return transition;
    };
    return IgnoredTransitionInfo;
}(transition_info_1.TransitionInfo));
exports.IgnoredTransitionInfo = IgnoredTransitionInfo;
