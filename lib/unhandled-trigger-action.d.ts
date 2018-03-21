/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/UnhandledTriggerAction.cs
 */
export declare class UnhandledTriggerAction<TState, TTrigger> {
    private readonly _action;
    constructor(_action: ((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>));
    execute(state: TState, trigger: TTrigger, unmetGuards: string[]): Promise<void>;
}
