import { InvocationInfo } from './invocation-info';
import { EntryActionBehaviour } from '../entry-action-behaviour';

/**
 * Information on entry and exit actions
 * 
 * @export
 * @class ActionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/ActionInfo.cs
 */
export class ActionInfo {

  public static create<TState, TTrigger>(entryAction: EntryActionBehaviour<TState, TTrigger>): ActionInfo {
    return new ActionInfo(entryAction.description, entryAction.trigger && `${entryAction.trigger}`);
  }

  /**
   * Creates an instance of ActionInfo.
   * @param {InvocationInfo} _method 
   * @param {string} _fromTrigger 
   * @memberof ActionInfo
   */
  constructor(
    private readonly _method: InvocationInfo,
    private readonly _fromTrigger?: string) {
  }

  /**
   * The method invoked during the action (entry or exit)
   * 
   * @readonly
   * @type {InvocationInfo}
   * @memberof ActionInfo
   */
  public get method(): InvocationInfo { return this._method; }

  /**
   * If non-null, specifies the "from" trigger that must be present for this method to be invoked
   * 
   * @readonly
   * @type {string}
   * @memberof ActionInfo
   */
  public get fromTrigger(): string { return this._fromTrigger; }
}
