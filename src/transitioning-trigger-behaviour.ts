import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitioningTriggerBehaviour.cs
 * 
 * @export
 * @class TransitioningTriggerBehaviour
 * @extends {TriggerBehaviour<TState, TTrigger, TContext>}
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 */
export class TransitioningTriggerBehaviour<TState, TTrigger, TContext = undefined> extends TriggerBehaviour<TState, TTrigger, TContext> {

  /**
   * Creates an instance of TransitioningTriggerBehaviour.
   * @param {TTrigger} trigger 
   * @param {TState} _destination 
   * @param {(TransitionGuard<TContext> | null)} [_transitionGuard=null] 
   * @memberof TransitioningTriggerBehaviour
   */
  constructor(
    trigger: TTrigger,
    private readonly _destination: TState, _transitionGuard: TransitionGuard<TContext> | null = null) {
    super(trigger, _transitionGuard);
  }

  public get destination(): TState {
    return this._destination;
  }

  public resultsInTransitionFrom(_source: TState, _args: any[], _context?: TContext): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [true, this._destination];
    return Promise.resolve(result);
  }
}
