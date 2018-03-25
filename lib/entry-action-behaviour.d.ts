import { Transition } from './transition';
import { InvocationInfo } from './reflection/invocation-info';
/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/EntryActionBehaviour.cs
 */
export declare class EntryActionBehaviour<TState, TTrigger> {
    private readonly _action;
    private readonly _desscription;
    private readonly _trigger;
    /**
     * Creates an instance of EntryActionBehaviour.
     * @param {(((transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>))} _action
     * @param {InvocationInfo} _desscription
     * @param {TTrigger} [_trigger]
     * @memberof EntryActionBehaviour
     */
    constructor(_action: ((transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>), _desscription: InvocationInfo, _trigger?: TTrigger | undefined);
    execute(transition: Transition<TState, TTrigger>, args: any[]): Promise<void>;
    readonly trigger: TTrigger | undefined;
    readonly description: InvocationInfo;
}
