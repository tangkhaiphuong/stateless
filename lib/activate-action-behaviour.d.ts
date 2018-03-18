import { InvocationInfo } from './reflection/invocation-info';
/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/ActivateActionBehaviour.cs
 */
export declare class ActivateActionBehaviour<TState> {
    private readonly _state;
    private _action;
    private readonly _description;
    /**
     * Creates an instance of ActivateActionBehaviour.
     * @param {TState} _state
     * @param {(() => void | Promise<void>)} _action
     * @param {InvocationInfo} _description
     * @memberof ActivateActionBehaviour
     */
    constructor(_state: TState, _action: () => void | Promise<void>, _description: InvocationInfo | null);
    execute(): Promise<void>;
    readonly description: InvocationInfo | null;
    readonly state: TState;
}
