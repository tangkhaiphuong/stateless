import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitioningTriggerBehaviour.cs
 */
export class TransitioningTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger> {

  /**
   * Creates an instance of TransitioningTriggerBehaviour.
   * @param {TTrigger} _trigger 
   * @param {TState} _destination 
   * @param {(TransitionGuard | null)} [_transitionGuard=null] 
   * @memberof TransitioningTriggerBehaviour
   */
  constructor(_trigger: TTrigger, private readonly _destination: TState, _transitionGuard: TransitionGuard | null = null) {
    super(_trigger, _transitionGuard);
  }

  public get destination(): TState {
    return this._destination;
  }

  public resultsInTransitionFrom(_source: TState, _args: any[]): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [true, this._destination];
    return Promise.resolve(result);
  }
}
