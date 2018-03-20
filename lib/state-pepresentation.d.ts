import { TriggerBehaviour } from './trigger-behaviour';
import { Transition } from './transition';
import { TriggerBehaviourResult } from './trigger-behaviour-result';
import { EntryActionBehaviour } from './entry-action-behaviour';
import { ExitActionBehaviour } from './exit-action-behaviour';
import { DeactivateActionBehaviour } from './deactivate-action-behaviour';
import { ActivateActionBehaviour } from './activate-action-behaviour';
import { InvocationInfo } from './reflection/invocation-info';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateRepresentation.cs
 *
 * @export
 * @class StateRepresentation
 * @template TState
 * @template TTrigger
 */
export declare class StateRepresentation<TState, TTrigger> {
    private readonly _state;
    private readonly _triggerBehaviours;
    private readonly _entryActions;
    private readonly _exitActions;
    private readonly _activateActions;
    private readonly _deactivateActions;
    private readonly _internalActions;
    private _active;
    private _superstate;
    private readonly _substates;
    constructor(_state: TState);
    getSubstates(): Array<StateRepresentation<TState, TTrigger>>;
    readonly triggerBehaviours: Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger>>>;
    readonly entryActions: Array<EntryActionBehaviour<TState, TTrigger>>;
    readonly exitActions: Array<ExitActionBehaviour<TState, TTrigger>>;
    readonly activateActions: Array<ActivateActionBehaviour<TState>>;
    readonly deactivateActions: Array<DeactivateActionBehaviour<TState>>;
    canHandle(trigger: TTrigger): Promise<boolean>;
    readonly underlyingState: TState;
    addSubstate(substate: StateRepresentation<TState, TTrigger>): void;
    superstate: StateRepresentation<TState, TTrigger> | null;
    addTriggerBehaviour(triggerBehaviour: TriggerBehaviour<TState, TTrigger>): void;
    addInternalAction(trigger: TTrigger, action: ((transition: Transition<TState, TTrigger>, args: any[]) => void)): void;
    activate(): Promise<void>;
    deactivate(): Promise<void>;
    tryFindHandler(trigger: TTrigger): Promise<[boolean, TriggerBehaviourResult<TState, TTrigger> | undefined]>;
    private tryFindLocalHandler(trigger);
    private tryFindLocalHandlerResult(trigger, results, filter);
    addActivateAction(action: () => void | Promise<void>, activateActionDescription?: InvocationInfo | null): void;
    addDeactivateAction(action: () => void | Promise<void>, deactivateActionDescription?: InvocationInfo | null): void;
    addEntryAction(trigger: TTrigger | undefined, action: ((transition?: Transition<TState, TTrigger>, ...args: any[]) => void | Promise<void>), entryActionDescription: InvocationInfo): void;
    addExitAction(action: ((transition: Transition<TState, TTrigger>) => void | Promise<void>), exitActionDescription?: InvocationInfo | null): any;
    internalAction(transition: Transition<TState, TTrigger>, args: any[]): Promise<void>;
    enter(transition: Transition<TState, TTrigger>, entryArgs: any[]): Promise<void>;
    exit(transition: Transition<TState, TTrigger>): Promise<Transition<TState, TTrigger>>;
    private executeDeactivationActions();
    private executeEntryActions(transition, entryArgs);
    private executeExitActions(transition);
    private executeActivationActions();
    includes(state: TState): boolean;
    isIncludedIn(state: TState): boolean;
    readonly permittedTriggers: Promise<Iterable<TTrigger>>;
}
