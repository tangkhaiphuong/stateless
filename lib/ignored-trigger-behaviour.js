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
var trigger_behaviour_1 = require("./trigger-behaviour");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
var IgnoredTriggerBehaviour = /** @class */ (function (_super) {
    __extends(IgnoredTriggerBehaviour, _super);
    /**
     * Creates an instance of IgnoredTriggerBehaviour.
     * @param {TTrigger} trigger
     * @param {TransitionGuard} guard
     * @param {TState} _destination
     * @memberof IgnoredTriggerBehaviour
     */
    function IgnoredTriggerBehaviour(trigger, guard, _destination) {
        var _this = _super.call(this, trigger, guard) || this;
        _this.trigger = trigger;
        _this._destination = _destination;
        return _this;
    }
    IgnoredTriggerBehaviour.prototype.resultsInTransitionFrom = function (_source, _args) {
        var result = [false, this._destination];
        return Promise.resolve(result);
    };
    return IgnoredTriggerBehaviour;
}(trigger_behaviour_1.TriggerBehaviour));
exports.IgnoredTriggerBehaviour = IgnoredTriggerBehaviour;
