import { StateRepresentation } from '../state-pepresentation';
import { IgnoredTransitionInfo } from './ignored-transition-info';
import { InvocationInfo } from './invocation-info';
import { FixedTransitionInfo } from './fixed-transition-info';
import { DynamicTransitionInfo } from './dynamic-transition-info';
import { ActionInfo } from './action-info';
import { TransitionInfo } from './transition-info';
/**
 * Describes an internal StateRepresentation through the reflection API.
 *
 * @export
 * @class StateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/StateInfo.cs
 */
export declare class StateInfo {
    private readonly _underlyingState;
    private readonly _ignoredTriggers;
    private readonly _entryActions;
    private readonly _activateActions;
    private readonly _deactivateActions;
    private readonly _exitActions;
    private _dynamicTransitions;
    private _fixedTransitions;
    private _superstate;
    private _substates;
    static createStateInfo<TState, TTrigger>(stateRepresentation: StateRepresentation<TState, TTrigger>): StateInfo;
    /**
     * Creates an instance of StateInfo.
     * @param {*} _underlyingState
     * @param {Iterable<IgnoredTransitionInfo>} _ignoredTriggers
     * @param {Iterable<ActionInfo>} _entryActions
     * @param {Iterable<InvocationInfo>} _activateActions
     * @param {Iterable<InvocationInfo>} _deactivateActions
     * @param {Iterable<InvocationInfo>} _exitActions
     * @memberof StateInfo
     */
    constructor(_underlyingState: any, _ignoredTriggers: Iterable<IgnoredTransitionInfo>, _entryActions: Iterable<ActionInfo>, _activateActions: Iterable<InvocationInfo>, _deactivateActions: Iterable<InvocationInfo>, _exitActions: Iterable<InvocationInfo>);
    static addRelationships<TState, TTrigger>(info: StateInfo, stateRepresentation: StateRepresentation<TState, TTrigger>, lookupState: (state: TState) => StateInfo): void;
    private addRelationships(superstate, substates, transitions, dynamicTransitions);
    /**
     * The instance or value this state represents.
     *
     * @readonly
     * @type {*}
     * @memberof StateInfo
     */
    readonly underlyingState: any;
    /**
     * Substates defined for this StateResource.
     *
     * @readonly
     * @type {(Iterable<StateInfo | null>)}
     * @memberof StateInfo
     */
    readonly substates: Iterable<StateInfo>;
    /**
     * Superstate defined, if any, for this StateResource.
     *
     * @readonly
     * @type {StateInfo}
     * @memberof StateInfo
     */
    readonly superstate: StateInfo | null;
    /**
     * Actions that are defined to be executed on state-entry.
     *
     * @readonly
     * @type {Iterable<ActionInfo>}
     * @memberof StateInfo
     */
    readonly entryActions: Iterable<ActionInfo>;
    /**
     * Actions that are defined to be executed on activation.
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof StateInfo
     */
    readonly activateActions: Iterable<InvocationInfo>;
    /**
     * Actions that are defined to be executed on deactivation.
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof StateInfo
     */
    readonly deactivateActions: Iterable<InvocationInfo>;
    /**
     * Actions that are defined to be exectuted on state-exit.
     *
     * @readonly
     * @type {Iterable<InvocationInfo>}
     * @memberof StateInfo
     */
    readonly exitActions: Iterable<InvocationInfo>;
    /**
     * Transitions defined for this state.
     *
     * @readonly
     * @type {Iterable<TransitionInfo>}
     * @memberof StateInfo
     */
    readonly transitions: Iterable<TransitionInfo>;
    /**
     * Transitions defined for this state.
     *
     * @readonly
     * @type {Iterable<FixedTransitionInfo>}
     * @memberof StateInfo
     */
    readonly fixedTransitions: Iterable<FixedTransitionInfo>;
    /**
     * Dynamic Transitions defined for this state internally.
     *
     * @readonly
     * @type {Iterable<DynamicTransitionInfo>}
     * @memberof StateInfo
     */
    readonly dynamicTransitions: Iterable<DynamicTransitionInfo>;
    /**
     * Triggers ignored for this state.
     *
     * @readonly
     * @type {Iterable<IgnoredTransitionInfo>}
     * @memberof StateInfo
     */
    readonly ignoredTriggers: Iterable<IgnoredTransitionInfo>;
    /**
     * Passes through to the value's ToString.
     *
     * @returns {string}
     * @memberof StateInfo
     */
    toString(): string;
}
