import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export declare class IgnoredTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger> {
    private readonly _destination;
    /**
     * Creates an instance of IgnoredTriggerBehaviour.
     * @param {TState} _destination
     * @param {TTrigger} trigger
     * @param {(TransitionGuard | null)} [guard=null]
     * @memberof IgnoredTriggerBehaviour
     */
    constructor(_destination: TState, trigger: TTrigger, guard?: TransitionGuard | null);
    resultsInTransitionFrom(_source: TState, _args: any[]): Promise<[boolean, TState]>;
}
