/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 * 
 * @export
 * @class UnhandledTriggerAction
 * @template TState 
 * @template TTrigger 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/UnhandledTriggerAction.cs
 */
export class UnhandledTriggerAction<TState, TTrigger> {

  constructor(private readonly _action: (state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>) { }

  public async execute(state: TState, trigger: TTrigger, unmetGuards: string[]): Promise<void> {
    const reuslt = this._action(state, trigger, unmetGuards);
    if (reuslt instanceof Promise) {
      await reuslt;
    }
  }
}
