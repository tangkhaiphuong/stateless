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

  constructor(private readonly _action: ((transition: Transition<TState, TTrigger>, args: any[]) => void | Promise<void>)) { }

  public async execute(transition: Transition<TState, TTrigger>, args: any[]): Promise<void> {
    const reuslt = this._action(transition, args);
    if (reuslt instanceof Promise) {
      await reuslt;
    }
  }
}
