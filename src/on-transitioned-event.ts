import { Transition } from './transition';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/OnTransitionedEvent.cs
 */
export class OnTransitionedEvent<TState, TTrigger> {

  private readonly _onTransitioned: Array<(transition: Transition<TState, TTrigger>) => any | Promise<any>> = [];

  public async invoke(transition: Transition<TState, TTrigger>): Promise<void> {
    for (const item of this._onTransitioned) {
      const result = item(transition);
      if (result instanceof Promise) {
        await result;
      }
    }
  }

  public register(action: (transition: Transition<TState, TTrigger>) => any | Promise<any>) {
    this._onTransitioned.push(action);
  }
}
