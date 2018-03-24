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
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitioningTriggerBehaviour.cs
 */
var TransitioningTriggerBehaviour = /** @class */ (function (_super) {
    __extends(TransitioningTriggerBehaviour, _super);
    /**
     * Creates an instance of TransitioningTriggerBehaviour.
     * @param {TTrigger} _trigger
     * @param {TState} _destination
     * @param {TransitionGuard} _transitionGuard
     * @memberof TransitioningTriggerBehaviour
     */
    function TransitioningTriggerBehaviour(_trigger, _destination, _transitionGuard) {
        var _this = _super.call(this, _trigger, _transitionGuard) || this;
        _this._destination = _destination;
        return _this;
    }
    Object.defineProperty(TransitioningTriggerBehaviour.prototype, "destination", {
        get: function () {
            return this._destination;
        },
        enumerable: true,
        configurable: true
    });
    TransitioningTriggerBehaviour.prototype.resultsInTransitionFrom = function (_source, _args) {
        var result = [true, this._destination];
        return Promise.resolve(result);
    };
    return TransitioningTriggerBehaviour;
}(trigger_behaviour_1.TriggerBehaviour));
exports.TransitioningTriggerBehaviour = TransitioningTriggerBehaviour;
