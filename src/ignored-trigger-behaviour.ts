import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export class IgnoredTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger>  {

  /**
   * Creates an instance of IgnoredTriggerBehaviour.
   * @param {TState} _destination 
   * @param {TTrigger} trigger 
   * @param {(TransitionGuard | null)} [guard=null] 
   * @memberof IgnoredTriggerBehaviour
   */
  constructor(
    private readonly _destination: TState,
    trigger: TTrigger,
    guard: TransitionGuard | null = null) {
    super(trigger, guard);
  }

  public resultsInTransitionFrom(_source: TState, _args: any[]): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [false, this._destination];
    return Promise.resolve(result);
  }
}
