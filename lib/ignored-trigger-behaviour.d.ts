import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export declare class IgnoredTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger> {
    readonly trigger: TTrigger;
    private readonly _destination;
    /**
     * Creates an instance of IgnoredTriggerBehaviour.
     * @param {TTrigger} trigger
     * @param {TransitionGuard} guard
     * @param {TState} _destination
     * @memberof IgnoredTriggerBehaviour
     */
    constructor(trigger: TTrigger, guard: TransitionGuard, _destination: TState);
    resultsInTransitionFrom(_source: TState, _args: any[]): Promise<[boolean, TState]>;
}
