"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamic_state_info_1 = require("./dynamic-state-info");
/**
 * List of DynamicStateInfo objects, with "add" function for ease of definition
 *
 * @export
 * @class DynamicStateInfos
 * @extends {Array<DynamicStateInfo>}
 */
class DynamicStateInfos extends Array {
    /**
     * Add a DynamicStateInfo with less typing
     *
     * @param {string} destinationState
     * @param {string} criterion
     * @memberof DynamicStateInfos
     */
    add(destinationState, criterion) {
        super.push(new dynamic_state_info_1.DynamicStateInfo(`${destinationState}`, criterion));
    }
}
exports.DynamicStateInfos = DynamicStateInfos;
