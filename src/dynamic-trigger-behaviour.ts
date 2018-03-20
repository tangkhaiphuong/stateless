import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
import { DynamicTransitionInfo } from './reflection/dynamic-transition-info';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/DynamicTriggerBehaviour.cs
 */
export class DynamicTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger>  {

  constructor(
    trigger: TTrigger,
    private readonly _destination: ((args: any[]) => TState | Promise<TState>),
    transitionGuard: TransitionGuard | undefined,
    private readonly _transitionInfo: DynamicTransitionInfo, ) {
    super(trigger, transitionGuard);
  }

  public async resultsInTransitionFrom(_source: TState, args: any[]): Promise<[boolean, TState]> {
    const result = this._destination(args);
    if (result instanceof Promise) {
      return [true, await result];
    } else {
      return [true, result];
    }
  }

  public get transitionInfo(): DynamicTransitionInfo { return this._transitionInfo; }
}
