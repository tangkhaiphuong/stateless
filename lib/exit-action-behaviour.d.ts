import { Transition } from './transition';
import { InvocationInfo } from './reflection/invocation-info';
/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/ExitActionBehavior.cs
 */
export declare class ExitActionBehaviour<TState, TTrigger> {
    private readonly _action;
    private readonly _description;
    /**
     * Creates an instance of ExitActionBehaviour.
     * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} _action
     * @param {InvocationInfo} _description
     * @memberof ExitActionBehaviour
     */
    constructor(_action: ((transition: Transition<TState, TTrigger>) => any | Promise<any>), _description: InvocationInfo | null);
    execute(transition: Transition<TState, TTrigger>): Promise<void>;
    readonly description: InvocationInfo | null;
}
