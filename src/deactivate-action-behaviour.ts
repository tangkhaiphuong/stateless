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
export class DeactivateActionBehaviour<TState> {
  constructor(
    private readonly _state: TState,
    private readonly _action: () => void | Promise<void>,
    private readonly _description: InvocationInfo | null) { }

  public async execute(): Promise<void> {
    const result = this._action();
    if (result instanceof Promise) {
      await result;
    }
  }

  public get description(): InvocationInfo | null { return this._description; }

  public get state(): TState { return this._state; }
}
