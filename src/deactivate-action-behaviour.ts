import { InvocationInfo } from './reflection/invocation-info';

/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 * 
 * @export
 * @class DeactivateActionBehaviour
 * @template TState 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/DeactivateActionBehaviour.cs
 */
export class DeactivateActionBehaviour<TState, TContext = undefined> {
  constructor(
    private readonly _state: TState,
    private readonly _action: (() => any | Promise<any>) | ((context: TContext) => any | Promise<any>),
    private readonly _description: InvocationInfo) { }

  public async execute(context?: TContext): Promise<void> {
    const action = this._action as any;
    const result = !!context ? action(context) : action();
    if (result instanceof Promise) {
      await result;
    }
  }

  public get description(): InvocationInfo { return this._description; }

  public get state(): TState { return this._state; }
}
