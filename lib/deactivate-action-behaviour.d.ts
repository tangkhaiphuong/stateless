import { InvocationInfo } from './reflection/invocation-info';
/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/DeactivateActionBehaviour.cs
 */
export declare class DeactivateActionBehaviour<TState> {
    private readonly _state;
    private readonly _action;
    private readonly _description;
    constructor(_state: TState, _action: () => any | Promise<any>, _description: InvocationInfo | null);
    execute(): Promise<void>;
    readonly description: InvocationInfo | null;
    readonly state: TState;
}
