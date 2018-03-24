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
 * Used to keep track of the decision point of a dynamic transition
 *
 * @export
 * @class Decision
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Decision.cs
 */
var Decision = /** @class */ (function (_super) {
    __extends(Decision, _super);
    function Decision(_method, num) {
        var _this = _super.call(this, 'Decision' + num) || this;
        _this._method = _method;
        return _this;
    }
    Object.defineProperty(Decision.prototype, "method", {
        get: function () { return this._method; },
        enumerable: true,
        configurable: true
    });
    return Decision;
}(state_1.State));
exports.Decision = Decision;
