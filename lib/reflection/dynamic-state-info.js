"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines dynamic state information.
 *
 * @export
 * @class DynamicStateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/DynamicTransitionInfo.cs
 */
var DynamicStateInfo = /** @class */ (function () {
    /**
     * Creates an instance of DynamicStateInfo.
     * @param {string} _destinationState
     * @param {string} _criterion
     * @memberof DynamicStateInfo
     */
    function DynamicStateInfo(_destinationState, _criterion) {
        this._destinationState = _destinationState;
        this._criterion = _criterion;
    }
    Object.defineProperty(DynamicStateInfo.prototype, "destinationState", {
        /**
         * The name of the destination state.
         *
         * @readonly
         * @type {string}
         * @memberof DynamicStateInfo
         */
        get: function () { return this._destinationState; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicStateInfo.prototype, "criterion", {
        /**
         * The reason this destination state was chosen
         *
         * @readonly
         * @type {string}
         * @memberof DynamicStateInfo
         */
        get: function () { return this._criterion; },
        enumerable: true,
        configurable: true
    });
    return DynamicStateInfo;
}());
exports.DynamicStateInfo = DynamicStateInfo;
