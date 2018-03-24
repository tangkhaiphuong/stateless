import { InvocationInfo } from './invocation-info';
import { EntryActionBehaviour } from '../entry-action-behaviour';
/**
 * Information on entry and exit actions
 *
 * @export
 * @class ActionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/ActionInfo.cs
 */
export declare class ActionInfo {
    private readonly _method;
    private readonly _fromTrigger;
    static create<TState, TTrigger>(entryAction: EntryActionBehaviour<TState, TTrigger>): ActionInfo;
    /**
     * Creates an instance of ActionInfo.
     * @param {InvocationInfo} _method
     * @param {string} _fromTrigger
     * @memberof ActionInfo
     */
    constructor(_method: InvocationInfo, _fromTrigger?: string | null);
    /**
     * The method invoked during the action (entry or exit)
     *
     * @readonly
     * @type {InvocationInfo}
     * @memberof ActionInfo
     */
    readonly method: InvocationInfo;
    /**
     * If non-null, specifies the "from" trigger that must be present for this method to be invoked
     *
     * @readonly
     * @type {string}
     * @memberof ActionInfo
     */
    readonly fromTrigger: string | null;
}
