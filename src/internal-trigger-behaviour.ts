import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export class InternalTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger>  {

  constructor(trigger: TTrigger, guard: ((args: any[]) => boolean | Promise<boolean>)) {
    super(trigger, new TransitionGuard({ guard: guard, description: 'Internal Transition' }));
  }

  public resultsInTransitionFrom(source: TState, _args: any[]): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [false, source];
    return Promise.resolve(result);
  }
}
