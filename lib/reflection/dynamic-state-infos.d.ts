import { DynamicStateInfo } from './dynamic-state-info';
/**
 * List of DynamicStateInfo objects, with "add" function for ease of definition
 *
 * @export
 * @class DynamicStateInfos
 * @extends {Array<DynamicStateInfo>}
 */
export declare class DynamicStateInfos extends Array<DynamicStateInfo> {
    /**
     * Add a DynamicStateInfo with less typing
     *
     * @param {string} destinationState
     * @param {string} criterion
     * @memberof DynamicStateInfos
     */
    add<TState>(destinationState: TState | string, criterion: string): void;
}
