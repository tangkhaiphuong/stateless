import { TriggerBehaviour } from './trigger-behaviour';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export declare class InternalTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger> {
    constructor(trigger: TTrigger, guard: ((args: any[]) => boolean | Promise<boolean>));
    resultsInTransitionFrom(source: TState, _args: any[]): Promise<[boolean, TState]>;
}
