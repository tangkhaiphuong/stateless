import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export class IgnoredTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger>  {

  /**
   * Creates an instance of IgnoredTriggerBehaviour.
   * @param {TTrigger} trigger 
   * @param {TransitionGuard} guard 
   * @param {TState} _destination 
   * @memberof IgnoredTriggerBehaviour
   */
  constructor(readonly trigger: TTrigger, guard: TransitionGuard, private readonly _destination: TState) {
    super(trigger, guard);
  }

  public resultsInTransitionFrom(_source: TState, _args: any[]): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [false, this._destination];
    return Promise.resolve(result);
  }
}
