import { StateConfiguration } from './state-configuration';
import { StateRepresentation } from './state-pepresentation';
import { StateMachineInfo } from './reflection/state-machine-info';
/**
 * Models behaviour as transitions between a finite set of states.
 *
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateMachine.cs
 */
export declare class StateMachine<TState, TTrigger> {
    private readonly _stateConfiguration;
    private readonly _stateAccessor;
    private readonly _stateMutator;
    private readonly _unhandledTriggerAction;
    private readonly _onTransitionedEvent;
    private readonly _eventQueue;
    private _firing;
    /**
     * Creates an instance of StateMachine.
     * @param {(TState | { stateAccessor: () => TState; stateMutator: (state: TState) => void; })} initialState
     * @memberof StateMachine
     */
    constructor(initialState: TState | {
        accessor: () => TState;
        mutator: (state: TState) => void;
    });
    /**
     * The initial state
     *
     * @type {TState}
     * @memberof StateMachine
     */
    /**
     * The current state.
     *
     * @memberof StateMachine
     */
    state: TState;
    /**
     * The currently-permissible trigger values.
     *
     * @readonly
     * @type {Promise<Iterable<TTrigger>>}
     * @memberof StateMachine
     */
    readonly permittedTriggers: Promise<Iterable<TTrigger>>;
    readonly currentRepresentation: StateRepresentation<TState, TTrigger>;
    /**
     * Provides an info object which exposes the states, transitions, and actions of this machine.
     *
     * @param {string} stateType
     * @param {string} triggerType
     * @returns {StateMachineInfo}
     * @memberof StateMachine
     */
    getInfo(stateType: string, triggerType: string): StateMachineInfo;
    private defaultUnhandledTriggerAction(state, trigger, unmetGuardConditions);
    private getRepresentation(state);
    /**
     * Begin configuration of the entry/exit actions and allowed transitions
     * when the state machine is in a particular state.
     *
     * @param {TState} state The state to configure.
     * @returns {StateConfiguration<TState, TTrigger>} >A configuration object through which the state can be configured.
     * @memberof StateMachine
     */
    configure(state: TState): StateConfiguration<TState, TTrigger>;
    /**
     * Transition from the current state via the specified trigger.
     * The target state is determined by the configuration of the current state.
     * Actions associated with leaving the current state and entering the new one
     * will be invoked.
     *
     * @param {TTrigger} trigger The trigger to fire.
     * @returns {Promise<void>}
     * @memberof StateMachine
     * @throws The current state does not allow the trigger to be fired.
     */
    fire(trigger: TTrigger, ...args: any[]): Promise<void>;
    /**
     * Activates current state. Actions associated with activating the currrent state
     * will be invoked. The activation is idempotent and subsequent activation of the same current state
     * will not lead to re-execution of activation callbacks.
     *
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    activate(): Promise<void>;
    /**
     * Deactivates current state. Actions associated with deactivating the currrent state
     * will be invoked. The deactivation is idempotent and subsequent deactivation of the same current state
     * will not lead to re-execution of deactivation callbacks.
     *
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    Deactivate(): Promise<void>;
    /**
     *  Queue events and then fire in order.
     * If only one event is queued, this behaves identically to the non-queued version.
     *
     * @private
     * @param {TTrigger} trigger The trigger.
     * @param {...any[]} args A variable-length parameters list containing arguments.
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    private internalFire(trigger, ...args);
    /**
     * Determine if the state machine is in the supplied state.
     *
     * @param {TState} state
     * @returns {boolean} True if the current state is equal to, or a substate of, the supplied state.
     * @memberof StateMachine
     */
    isInState(state: TState): boolean;
    /**
     * Returns true if <paramref name="trigger"/> can be fired in the current state.
     *
     * @param {TTrigger} trigger Trigger to test.
     * @returns {boolean} True if the trigger can be fired, false otherwise.
     * @memberof StateMachine
     */
    canFire(trigger: TTrigger): Promise<boolean>;
    private internalFireOne(trigger, ...args);
    /**
     * string
     *
     * @returns {string} A description of the current state and permitted triggers.
     * @memberof StateMachine
     */
    toString(): Promise<string>;
}
