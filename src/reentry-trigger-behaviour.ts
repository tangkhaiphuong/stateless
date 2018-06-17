import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/ReentryTriggerBehaviour.cs
 */
export class ReentryTriggerBehaviour<TState, TTrigger, TContext = undefined> extends TriggerBehaviour<TState, TTrigger, TContext>  {

  public get destination(): TState {
    return this._destination;
  }

  /**
   * Creates an instance of ReentryTriggerBehaviour.
   * transitionGuard can be null if there is no guard function on the transition
   * @param {TTrigger} trigger
   * @param {TState} _destination
   * @param {(TransitionGuard<TContext> | null)} transitionGuard
   * @memberof ReentryTriggerBehaviour
   */
  constructor(trigger: TTrigger, readonly _destination: TState, transitionGuard: TransitionGuard<TContext> | null) {
    super(trigger, transitionGuard);
  }

  public async resultsInTransitionFrom(_source: TState, _args: any[], _context?: TContext): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [true, this._destination];
    return Promise.resolve(result);
  }
}
