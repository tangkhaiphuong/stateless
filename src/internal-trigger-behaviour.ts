import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export class InternalTriggerBehaviour<TState, TTrigger, TContext = undefined> extends TriggerBehaviour<TState, TTrigger, TContext>  {

  /**
   * Creates an instance of InternalTriggerBehaviour.
   * @param {TTrigger} trigger 
   * @param {(((...args: any[]) => boolean | Promise<boolean>) | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>))} guard 
   * @param {(string | null)} [description=null] 
   * @memberof InternalTriggerBehaviour
   */
  constructor(trigger: TTrigger, guard: ((...args: any[]) => boolean | Promise<boolean>) | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>), description: string | null = null) {
    super(trigger, new TransitionGuard<TContext>({ guard: guard, description: description || 'Internal Transition' }));
  }

  public resultsInTransitionFrom(source: TState, _args: any[], _context?: TContext): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [false, source];
    return Promise.resolve(result);
  }
}
