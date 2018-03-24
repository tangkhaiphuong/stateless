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
var dynamic_state_info_1 = require("./dynamic-state-info");
/**
 * List of DynamicStateInfo objects, with "add" function for ease of definition
 *
 * @export
 * @class DynamicStateInfos
 * @extends {Array<DynamicStateInfo>}
 */
var DynamicStateInfos = /** @class */ (function (_super) {
    __extends(DynamicStateInfos, _super);
    function DynamicStateInfos() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Add a DynamicStateInfo with less typing
     *
     * @param {string} destinationState
     * @param {string} criterion
     * @memberof DynamicStateInfos
     */
    DynamicStateInfos.prototype.add = function (destinationState, criterion) {
        _super.prototype.push.call(this, new dynamic_state_info_1.DynamicStateInfo("" + destinationState, criterion));
    };
    return DynamicStateInfos;
}(Array));
exports.DynamicStateInfos = DynamicStateInfos;
