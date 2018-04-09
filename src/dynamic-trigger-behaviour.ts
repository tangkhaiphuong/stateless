import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
import { DynamicTransitionInfo } from './reflection/dynamic-transition-info';

/**
 * 
 * 
 * @export
 * @class DynamicTriggerBehaviour
 * @extends {TriggerBehaviour<TState, TTrigger>}
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/DynamicTriggerBehaviour.cs
 */
export class DynamicTriggerBehaviour<TState, TTrigger, TContext = undefined> extends TriggerBehaviour<TState, TTrigger, TContext>  {

  /**
   * Creates an instance of DynamicTriggerBehaviour.
   * @param {TTrigger} trigger 
   * @param {(((args: any[]) => TState | Promise<TState>) | ((context: TContext, args: any[]) => TState | Promise<TState>))} _destination 
   * @param {(TransitionGuard | null)} transitionGuard 
   * @param {DynamicTransitionInfo<TState>} _transitionInfo 
   * @memberof DynamicTriggerBehaviour
   */
  constructor(
    trigger: TTrigger,
    private readonly _destination: ((args: any[]) => TState | Promise<TState>) | ((context: TContext, args: any[]) => TState | Promise<TState>),
    transitionGuard: TransitionGuard<TContext> | null,
    private readonly _transitionInfo: DynamicTransitionInfo<TState>) {
    super(trigger, transitionGuard);
  }

  public async resultsInTransitionFrom(_source: TState, args: any[], context?: TContext): Promise<[boolean, TState]> {
    const destination = this._destination as any;
    const result = !!context ? destination(context, args) : destination(args);
    if (result instanceof Promise) {
      return [true, await result];
    } else {
      return [true, result];
    }
  }

  public get transitionInfo(): DynamicTransitionInfo<TState> { return this._transitionInfo; }
}
