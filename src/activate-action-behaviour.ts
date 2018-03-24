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
export class ActivateActionBehaviour<TState> {

  /**
   * Creates an instance of ActivateActionBehaviour.
   * @param {TState} _state 
   * @param {(() => any | Promise<any>)} _action 
   * @param {InvocationInfo} _description 
   * @memberof ActivateActionBehaviour
   */
  constructor(
    private readonly _state: TState, private _action: () => any | Promise<any>,
    private readonly _description: InvocationInfo) {

  }

  public async execute(): Promise<void> {
    const result = this._action();
    if (result instanceof Promise) {
      await result;
    }
  }

  public get description(): InvocationInfo { return this._description; }

  public get state(): TState { return this._state; }
}
