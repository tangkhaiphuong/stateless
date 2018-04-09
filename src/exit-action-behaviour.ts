import { Transition } from './transition';
import { InvocationInfo } from './reflection/invocation-info';

/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 * 
 * @export
 * @class ExitActionBehaviour
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/ExitActionBehavior.cs
 */
export class ExitActionBehaviour<TState, TTrigger, TContext = undefined> {

  /**
   * Creates an instance of ExitActionBehaviour.
   * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>))} _action 
   * @param {InvocationInfo} _description 
   * @memberof ExitActionBehaviour
   */
  constructor(
    private readonly _action: ((transition: Transition<TState, TTrigger>) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>),
    private readonly _description: InvocationInfo) { }

  public async execute(transition: Transition<TState, TTrigger>, context?: TContext): Promise<void> {
    const action = this._action as any;
    const result = !!context ? action(context, transition) : action(transition);
    if (result instanceof Promise) {
      await result;
    }
  }

  public get description(): InvocationInfo { return this._description; }
}
