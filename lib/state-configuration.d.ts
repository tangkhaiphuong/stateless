import { StateRepresentation } from './state-pepresentation';
import { StateMachine } from './state-machine';
import { Transition } from './transition';
import { InvocationInfo } from './reflection/invocation-info';
import { DynamicStateInfos } from './reflection/dynamic-state-infos';
/**
 * The configuration for a single state value.
 *
 * @export
 * @class StateConfiguration
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateConfiguration.cs
 */
export declare class StateConfiguration<TState, TTrigger> {
    private readonly _machine;
    private readonly _representation;
    private readonly _lookup;
    constructor(_machine: StateMachine<TState, TTrigger>, _representation: StateRepresentation<TState, TTrigger>, _lookup: (state: TState) => StateRepresentation<TState, TTrigger>);
    /**
     * The state that is configured with this configuration.
     *
     * @memberof StateConfiguration
     */
    readonly state: TState;
    /**
     * The machine that is configured with this configuration.
     *
     * @readonly
     * @type {StateMachine<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    readonly machine: StateMachine<TState, TTrigger>;
    /**
     * Accept the specified trigger and transition to the destination state.
     *
     * @param {TTrigger} trigger The accepted trigger.
     * @param {TState} destinationState The state that the trigger will cause a transition to.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permit(trigger: TTrigger, destinationState: TState): StateConfiguration<TState, TTrigger>;
    /**
     * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
     *
     * @param {TTrigger} trigger
     * @param {((transition: Transition<TState, TTrigger>) => void)} entryAction
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    internalTransition(trigger: TTrigger, entryAction: ((transition: Transition<TState, TTrigger>, ...args: any[]) => void)): StateConfiguration<TState, TTrigger>;
    /**
     * Add an internal transition to the state machine. An internal action does not cause the Exit and Entry actions to be triggered, and does not change the state of the state machine
     *
     * @param {TTrigger} trigger
     * @param {(((() => boolean | Promise<boolean>)))} guard
     * @param {((transition: Transition<TState, TTrigger>) => void)} internalAction
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    internalTransitionIf(trigger: TTrigger, guard: ((() => boolean | Promise<boolean>)), internalAction: ((transition: Transition<TState, TTrigger>, ...args: any[]) => void)): StateConfiguration<TState, TTrigger>;
    /**
     * Accept the specified trigger and transition to the destination state.
     *
     * @param {TTrigger} trigger The accepted trigger.
     * @param {TState} destinationState The state that the trigger will cause a transition to.
     * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permitIf(trigger: TTrigger, destinationState: TState, ...guards: Array<{
        guard: (() => boolean | Promise<boolean>);
        description: string;
    }>): StateConfiguration<TState, TTrigger>;
    /**
     * Accept the specified trigger, execute exit actions and re-execute entry actions.
     *
     * @description  Applies to the current state only. Will not re-execute superstate actions, or cause actions to execute transitioning between super- and sub-states.
     * @param {TTrigger} trigger The accepted trigger.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permitReentry(trigger: TTrigger): StateConfiguration<TState, TTrigger>;
    /**
     * Accept the specified trigger, execute exit actions and re-execute entry actions.
     * Reentry behaves as though the configured state transitions to an identical sibling state.
     *
     * @description Applies to the current state only. Will not re-execute superstate actions, or
     * cause actions to execute transitioning between super- and sub-states.
     * @param {TTrigger} trigger The accepted trigger.
     * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permitReentryIf(trigger: TTrigger, ...guards: Array<{
        guard: (() => boolean | Promise<boolean>);
        description: string;
    }>): StateConfiguration<TState, TTrigger>;
    /**
     * Ignore the specified trigger when in the configured state, if the guard returns true.
     *
     * @param {TTrigger} trigger The trigger to ignore.
     * @param {TState} state The state to ignore.
     * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be ignored.
     * @returns {StateConfiguration<TState, TTrigger>} The receiver.
     * @memberof StateConfiguration
     */
    ignoreIf(trigger: TTrigger, state: TState, ...guards: Array<{
        guard: (() => boolean | Promise<boolean>);
        description: string;
    }>): StateConfiguration<TState, TTrigger>;
    onActivate(activateAction: () => any | Promise<any>, activateActionDescription?: string | null): StateConfiguration<TState, TTrigger>;
    onDeactivate(deactivateAction: () => any | Promise<any>, deactivateActionDescription?: string | null): StateConfiguration<TState, TTrigger>;
    /**
     * Specify an action that will execute when transitioning into the configured state.
     *
     * @param {(((transition?: Transition<TState, TTrigger>) => any | Promise<any>))} entryAction Action to execute.
     * @param {InvocationInfo} [entryActionDescription] Action description.
     * @returns {StateConfiguration<TState, TTrigger>} The receiver.
     * @memberof StateConfiguration
     */
    onEntry(entryAction: ((transition?: Transition<TState, TTrigger>) => any | Promise<any>), entryActionDescription: InvocationInfo): StateConfiguration<TState, TTrigger>;
    /**
     * Specify an action that will execute when transitioning into the configured state.
     *
     * @param {TTrigger} trigger The trigger by which the state must be entered in order for the action to execute.
     * @param {(((transition?: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>))} entryAction Action to execute, providing details of the transition.
     * @param {InvocationInfo} [entryActionDescription] Action description.
     * @returns {StateConfiguration<TState, TTrigger>} The receiver.
     * @memberof StateConfiguration
     */
    onEntryFrom(trigger: TTrigger, entryAction: ((transition?: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>), entryActionDescription: InvocationInfo): StateConfiguration<TState, TTrigger>;
    /**
     * Specify an action that will execute when transitioning from the configured state.
     *
     * @param {(((transition?: Transition<TState, TTrigger>) => any | Promise<any>))} exitAction Action to execute.
     * @param {string} [exitActionDescription] Action description.
     * @returns {StateConfiguration<TState, TTrigger>}
     * @memberof StateConfiguration
     */
    onExit(exitAction: ((transition?: Transition<TState, TTrigger>) => any | Promise<any>), exitActionDescription?: string | null): StateConfiguration<TState, TTrigger>;
    /**
     * Sets the superstate that the configured state is a substate of.
     * @description Substates inherit the allowed transitions of their superstate.
     * entry actions for the superstate are executed.
     * Likewise when leaving from the substate to outside the supserstate,
     * exit actions for the superstate will execute.
     * @param {TState} superstate The superstate.
     * @returns {StateConfiguration<TState, TTrigger>} The receiver.
     * @memberof StateConfiguration
     */
    substateOf(superstate: TState): StateConfiguration<TState, TTrigger>;
    /**
     * Accept the specified trigger and transition to the destination state, calculated dynamically by the supplied function.
     *
     * @param {TTrigger} trigger
     * @param {((args: any[]) => TState)} destinationStateSelector Function to calculate the state that the trigger will cause a transition to.
     * @param {(string | null)} [destinationStateSelectorDescription=null]  Optional description of the function to calculate the state .
     * @param {(DynamicStateInfos | null)} [possibleDestinationStates=null] >Optional array of possible destination states (used by output formatters)
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permitDynamic(trigger: TTrigger, destinationStateSelector: ((args: any[]) => TState), destinationStateSelectorDescription?: string | null, possibleDestinationStates?: DynamicStateInfos | null): StateConfiguration<TState, TTrigger>;
    /**
     *  Accept the specified trigger and transition to the destination state, calculated dynamically by the supplied function.
     *
     * @param {TTrigger} trigger The accepted trigger.
     * @param {((args: any[]) => TState)} destinationStateSelector Function to calculate the state that the trigger will cause a transition to.
     * @param {(...Array<{ guard: (() => boolean | Promise<boolean>), description: string }>)} guards Functions and their descriptions that must return true in order for the trigger to be accepted.
     * @returns {StateConfiguration<TState, TTrigger>} The reciever.
     * @memberof StateConfiguration
     */
    permitDynamicIf(trigger: TTrigger, destinationStateSelector: ((args: any[]) => TState), ...guards: Array<{
        guard: (() => boolean | Promise<boolean>);
        description: string;
    }>): StateConfiguration<TState, TTrigger>;
    private enforceNotIdentityTransition(destination);
    private internalPermit(trigger, destinationState);
    private internalPermitIf(trigger, destinationState, transitionGuard);
    private internalPermitDynamicIf(trigger, destinationStateSelector, destinationStateSelectorDescription, transitionGuard, possibleDestinationStates);
}
