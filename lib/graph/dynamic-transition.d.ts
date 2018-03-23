import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { Transition } from './transition';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs#L65
 */
export declare class DynamicTransition extends Transition {
    private _destinationState;
    private _criterion;
    /**
     * The state where this transition finishes
     *
     * @readonly
     * @type {State}
     * @memberof DynamicTransition
     */
    readonly destinationState: State;
    /**
     * When is this transition followed
     *
     * @readonly
     * @type {string}
     * @memberof DynamicTransition
     */
    readonly criterion: string;
    /**
     * Creates an instance of DynamicTransition.
     * @param {State} sourceState
     * @param {State} _destinationState
     * @param {TriggerInfo} trigger
     * @param {string} _criterion
     * @memberof DynamicTransition
     */
    constructor(sourceState: State, _destinationState: State, trigger: TriggerInfo, _criterion: string);
}
