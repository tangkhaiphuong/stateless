import { TriggerBehaviour } from './trigger-behaviour';

/**
 * 
 * 
 * @export
 * @class TriggerBehaviourResult
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviourResult.cs
 */
export class TriggerBehaviourResult<TState, TTrigger, TContext = undefined> {

  constructor(
    private readonly _handler: TriggerBehaviour<TState, TTrigger, TContext>,
    private readonly _unmetGuardConditions: string[]) { }

  public get handler(): TriggerBehaviour<TState, TTrigger, TContext> { return this._handler; }

  public get unmetGuardConditions(): string[] { return this._unmetGuardConditions; }
}
