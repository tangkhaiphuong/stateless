import { Transition } from './transition';
/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalActionBehaviour.cs
 */
export declare class InternalActionBehaviour<TState, TTrigger> {
    private readonly _action;
    constructor(_action: ((transition: Transition<TState, TTrigger>, args: any[]) => void | Promise<void>));
    execute(transition: Transition<TState, TTrigger>, args: any[]): Promise<void>;
}
