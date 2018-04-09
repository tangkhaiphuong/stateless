import { Transition } from './transition';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/OnTransitionedEvent.cs
 */
export class OnTransitionedEvent<TState, TTrigger, TContext = undefined> {

  private readonly _onTransitioned: Array<((transition: Transition<TState, TTrigger>) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>)> = [];

  public async invoke(transition: Transition<TState, TTrigger>, context?: TContext): Promise<void> {
    for (const item of this._onTransitioned) {
      const action = item as any;
      const result = !!context ? action(context, transition) : action(transition);
      if (result instanceof Promise) {
        await result;
      }
    }
  }

  public register(action: ((transition: Transition<TState, TTrigger>) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>)) {
    this._onTransitioned.push(action);
  }
}
