"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Defines dynamic state information.
 *
 * @export
 * @class DynamicStateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/DynamicTransitionInfo.cs
 */
class DynamicStateInfo {
    /**
     * Creates an instance of DynamicStateInfo.
     * @param {string} _destinationState
     * @param {string} _criterion
     * @memberof DynamicStateInfo
     */
    constructor(_destinationState, _criterion) {
        this._destinationState = _destinationState;
        this._criterion = _criterion;
    }
    /**
     * The name of the destination state.
     *
     * @readonly
     * @type {string}
     * @memberof DynamicStateInfo
     */
    get destinationState() { return this._destinationState; }
    /**
     * The reason this destination state was chosen
     *
     * @readonly
     * @type {string}
     * @memberof DynamicStateInfo
     */
    get criterion() { return this._criterion; }
}
exports.DynamicStateInfo = DynamicStateInfo;
//# sourceMappingURL=dynamic-state-info.js.map