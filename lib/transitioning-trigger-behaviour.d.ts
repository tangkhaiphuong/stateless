import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitioningTriggerBehaviour.cs
 */
export declare class TransitioningTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger> {
    private readonly _destination;
    /**
     * Creates an instance of TransitioningTriggerBehaviour.
     * @param {TTrigger} _trigger
     * @param {TState} _destination
     * @param {(TransitionGuard | null)} [_transitionGuard=null]
     * @memberof TransitioningTriggerBehaviour
     */
    constructor(_trigger: TTrigger, _destination: TState, _transitionGuard?: TransitionGuard | null);
    readonly destination: TState;
    resultsInTransitionFrom(_source: TState, _args: any[]): Promise<[boolean, TState]>;
}
