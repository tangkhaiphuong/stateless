import { Transition } from './transition';

/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 * 
 * @export
 * @class InternalActionBehaviour
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalActionBehaviour.cs
 */
export class InternalActionBehaviour<TState, TTrigger, TContext = undefined> {

  constructor(private readonly _action: ((transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>) |
    ((context: TContext, transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>)) { }

  public async execute(transition: Transition<TState, TTrigger>, args: any[], context?: TContext): Promise<void> {
    const action = this._action as any;
    const result = !!context ? action(context, transition, args) : action(transition, args);
    if (result instanceof Promise) {
      await result;
    }
  }
}
