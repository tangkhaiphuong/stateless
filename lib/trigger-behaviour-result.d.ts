import { TriggerBehaviour } from './trigger-behaviour';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviourResult.cs
 */
export declare class TriggerBehaviourResult<TState, TTrigger> {
    private readonly _handler;
    private readonly _unmetGuardConditions;
    constructor(_handler: TriggerBehaviour<TState, TTrigger>, _unmetGuardConditions: string[]);
    readonly handler: TriggerBehaviour<TState, TTrigger>;
    readonly unmetGuardConditions: string[];
}
