import { DynamicStateInfo } from './dynamic-state-info';

/**
 * List of DynamicStateInfo objects, with "add" function for ease of definition
 * 
 * @export
 * @class DynamicStateInfos
 * @extends {Array<DynamicStateInfo>}
 */
export class DynamicStateInfos extends Array<DynamicStateInfo> {

  /**
   * Add a DynamicStateInfo with less typing
   * 
   * @param {string} destinationState 
   * @param {string} criterion 
   * @memberof DynamicStateInfos
   */
  public add<TState>(destinationState: TState | string, criterion: string): void {
    super.push(new DynamicStateInfo(`${destinationState}`, criterion));
  }
}
