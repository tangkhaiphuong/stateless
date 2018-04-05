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
export class InternalActionBehaviour<TState, TTrigger> {

  constructor(private readonly _action: (transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>) { }

  public async execute(transition: Transition<TState, TTrigger>, args: any[]): Promise<void> {
    const result = this._action(transition, args);
    if (result instanceof Promise) {
      await result;
    }
  }
}
