import { DynamicStateInfo } from './dynamic-state-info';

/**
 * List of DynamicStateInfo objects, with "add" function for ease of definition
 * 
 * @export
 * @class DynamicStateInfos
 * @extends {Array<DynamicStateInfo>}
 */
export class DynamicStateInfos<TState> extends Array<DynamicStateInfo<TState>> {

  /**
   * Add a DynamicStateInfo with less typing
   * 
   * @param {TState} destinationState 
   * @param {string} criterion 
   * @returns {*} 
   * @memberof DynamicStateInfos
   */
  public add(destinationState: TState, criterion: string): any {
    super.push(new DynamicStateInfo<TState>(destinationState, criterion));
  }
}
