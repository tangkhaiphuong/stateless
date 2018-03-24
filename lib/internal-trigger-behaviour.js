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
var transition_guard_1 = require("./transition-guard");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
var InternalTriggerBehaviour = /** @class */ (function (_super) {
    __extends(InternalTriggerBehaviour, _super);
    function InternalTriggerBehaviour(trigger, guard) {
        return _super.call(this, trigger, new transition_guard_1.TransitionGuard({ guard: guard, description: 'Internal Transition' })) || this;
    }
    InternalTriggerBehaviour.prototype.resultsInTransitionFrom = function (source, _args) {
        var result = [false, source];
        return Promise.resolve(result);
    };
    return InternalTriggerBehaviour;
}(trigger_behaviour_1.TriggerBehaviour));
exports.InternalTriggerBehaviour = InternalTriggerBehaviour;
