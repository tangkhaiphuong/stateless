import { TriggerBehaviour } from './trigger-behaviour';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviourResult.cs
 */
export class TriggerBehaviourResult<TState, TTrigger> {

  constructor(
    private readonly _handler: TriggerBehaviour<TState, TTrigger>,
    private readonly _unmetGuardConditions: string[]) { }

  public get handler(): TriggerBehaviour<TState, TTrigger> { return this._handler; }

  public get unmetGuardConditions(): string[] { return this._unmetGuardConditions; }
}
