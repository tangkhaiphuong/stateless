import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
import { DynamicTransitionInfo } from './reflection/dynamic-transition-info';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/DynamicTriggerBehaviour.cs
 */
export declare class DynamicTriggerBehaviour<TState, TTrigger> extends TriggerBehaviour<TState, TTrigger> {
    private readonly _destination;
    private readonly _transitionInfo;
    constructor(trigger: TTrigger, _destination: ((args: any[]) => TState | Promise<TState>), transitionGuard: TransitionGuard | null, _transitionInfo: DynamicTransitionInfo);
    resultsInTransitionFrom(_source: TState, args: any[]): Promise<[boolean, TState]>;
    readonly transitionInfo: DynamicTransitionInfo;
}
