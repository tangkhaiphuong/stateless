import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export class InternalTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger>  {

  /**
   * Creates an instance of InternalTriggerBehaviour.
   * @param {TTrigger} trigger 
   * @param {((...args: any[]) => boolean | Promise<boolean>)} guard 
   * @param {(string | null)} [description=null] 
   * @memberof InternalTriggerBehaviour
   */
  constructor(trigger: TTrigger, guard: (...args: any[]) => boolean | Promise<boolean>, description: string | null = null) {
    super(trigger, new TransitionGuard({ guard: guard, description: description || 'Internal Transition' }));
  }

  public resultsInTransitionFrom(source: TState, _args: any[]): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [false, source];
    return Promise.resolve(result);
  }
}
