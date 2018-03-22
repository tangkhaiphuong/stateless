"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const unhandled_trigger_action_1 = require("./unhandled-trigger-action");
const on_transitioned_event_1 = require("./on-transitioned-event");
const state_configuration_1 = require("./state-configuration");
const state_pepresentation_1 = require("./state-pepresentation");
const state_machine_info_1 = require("./reflection/state-machine-info");
const transition_1 = require("./transition");
const state_info_1 = require("./reflection/state-info");
const transitioning_trigger_behaviour_1 = require("./transitioning-trigger-behaviour");
/**
 * Models behaviour as transitions between a finite set of states.
 *
 * @export
 * @class StateMachine
 * @template TState The type used to represent the states.
 * @template TTrigger The type used to represent the triggers that cause state transitions.
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateMachine.cs
 */
class StateMachine {
    /**
     * Creates an instance of StateMachine.
     * @param {(TState | { stateAccessor: () => TState; stateMutator: (state: TState) => void; })} initialState
     * @memberof StateMachine
     */
    constructor(initialState) {
        this._stateConfiguration = new Map();
        this._eventQueue = [];
        this._firing = false;
        const checkObject = initialState;
        if (!!checkObject.accessor || !!checkObject.mutator) {
            this._stateAccessor = checkObject.accessor;
            this._stateMutator = checkObject.mutator;
        }
        else {
            const stateReference = { state: initialState };
            this._stateAccessor = function () { return stateReference.state; };
            this._stateMutator = function (state) { stateReference.state = state; };
        }
        this._unhandledTriggerAction = new unhandled_trigger_action_1.UnhandledTriggerAction(this.defaultUnhandledTriggerAction.bind(this));
        this._onTransitionedEvent = new on_transitioned_event_1.OnTransitionedEvent();
    }
    /**
     * The current state.
     *
     * @memberof StateMachine
     */
    set state(state) {
        this._stateMutator(state);
    }
    /**
     * The initial state
     *
     * @type {TState}
     * @memberof StateMachine
     */
    get state() {
        return this._stateAccessor();
    }
    /**
     * The currently-permissible trigger values.
     *
     * @readonly
     * @type {Promise<TTrigger[]>}
     * @memberof StateMachine
     */
    get permittedTriggers() {
        return this.getPermittedTriggers();
    }
    /// <summary>
    /// The currently-permissible trigger values.
    /// </summary>
    getPermittedTriggers(...args) {
        return this.currentRepresentation.getPermittedTriggers(args);
    }
    /**
     * Get current presentation.
     *
     * @readonly
     * @type {StateRepresentation<TState, TTrigger>}
     * @memberof StateMachine
     */
    get currentRepresentation() {
        return this.getRepresentation(this.state);
    }
    /**
     * Provides an info object which exposes the states, transitions, and actions of this machine.
     *
     * @param {string} stateType
     * @param {string} triggerType
     * @returns {StateMachineInfo}
     * @memberof StateMachine
     */
    getInfo(stateType, triggerType) {
        const representations = new Map(this._stateConfiguration);
        const distinct = new Set();
        for (const kvp of this._stateConfiguration) {
            for (const b of kvp['1'].triggerBehaviours) {
                if (b instanceof transitioning_trigger_behaviour_1.TransitioningTriggerBehaviour) {
                    const destination = b.destination;
                    let flag = true;
                    for (const except of representations.keys()) {
                        if (except === destination) {
                            flag = false;
                        }
                    }
                    if (flag === false) {
                        continue;
                    }
                    distinct.add(destination);
                }
            }
        }
        const reachable = [];
        for (const underlying of distinct) {
            reachable.push(new state_pepresentation_1.StateRepresentation(underlying));
        }
        for (const representation of reachable) {
            representations.set(representation.underlyingState, representation);
        }
        const info = new Map();
        for (const item of representations) {
            info.set(item['0'], state_info_1.StateInfo.createStateInfo(item['1']));
        }
        for (const state of info) {
            const stateRepresentation = representations.get(state['0']);
            if (!stateRepresentation) {
                continue;
            }
            state_info_1.StateInfo.addRelationships(state['1'], stateRepresentation, (k) => info.get(k));
        }
        return new state_machine_info_1.StateMachineInfo(info.values(), stateType, triggerType);
    }
    getRepresentation(state) {
        let result = this._stateConfiguration.get(state);
        if (!result) {
            result = new state_pepresentation_1.StateRepresentation(state);
            this._stateConfiguration.set(state, result);
        }
        return result;
    }
    /**
     * Begin configuration of the entry/exit actions and allowed transitions
     * when the state machine is in a particular state.
     *
     * @param {TState} state The state to configure.
     * @returns {StateConfiguration<TState, TTrigger>} >A configuration object through which the state can be configured.
     * @memberof StateMachine
     */
    configure(state) {
        return new state_configuration_1.StateConfiguration(this, this.getRepresentation(state), this.getRepresentation.bind(this));
    }
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
    fire(trigger, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internalFire(trigger, args);
        });
    }
    /**
     * Activates current state. Actions associated with activating the currrent state
     * will be invoked. The activation is idempotent and subsequent activation of the same current state
     * will not lead to re-execution of activation callbacks.
     *
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            const representativeState = this.getRepresentation(this.state);
            yield representativeState.activate();
        });
    }
    /**
     * Deactivates current state. Actions associated with deactivating the currrent state
     * will be invoked. The deactivation is idempotent and subsequent deactivation of the same current state
     * will not lead to re-execution of deactivation callbacks.
     *
     * @returns {Promise<void>}
     * @memberof StateMachine
     */
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            const representativeState = this.getRepresentation(this.state);
            yield representativeState.deactivate();
        });
    }
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
    internalFire(trigger, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._firing) {
                this._eventQueue.push({ trigger, args });
                return;
            }
            try {
                this._firing = true;
                yield this.internalFireOne(trigger, args);
                while (this._eventQueue.length !== 0) {
                    const queuedEvent = this._eventQueue.shift();
                    if (!!queuedEvent) {
                        yield this.internalFireOne(queuedEvent.trigger, ...queuedEvent.args);
                    }
                    else {
                        break;
                    }
                }
            }
            finally {
                this._firing = false;
            }
        });
    }
    internalFireOne(trigger, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = this.state;
            const representativeState = this.getRepresentation(source);
            const [result, handler] = yield representativeState.tryFindHandler(trigger);
            if (!result || !handler) {
                yield this._unhandledTriggerAction.execute(representativeState.underlyingState, trigger, !!handler ? handler.unmetGuardConditions : []);
                return;
            }
            const [result2, destination] = yield handler.handler.resultsInTransitionFrom(source, args);
            if (result2) {
                let transition = new transition_1.Transition(source, destination, trigger);
                transition = yield representativeState.exit(transition);
                this.state = transition.destination;
                const newRepresentation = this.getRepresentation(transition.destination);
                this._onTransitionedEvent.invoke(transition);
                yield newRepresentation.enter(transition, args);
            }
            else {
                const transition = new transition_1.Transition(source, destination, trigger);
                yield this.currentRepresentation.internalAction(transition, args);
            }
        });
    }
    /**
     * Override the default behaviour of throwing an exception when an unhandled trigger
     *
     * @param {((state: TState, trigger: TTrigger, unmetGuards: string[]) => any | Promise<any>)} unhandledTriggerAction >An action to call when an unhandled trigger is fired.
     * @memberof StateMachine
     */
    onUnhandledTrigger(unhandledTriggerAction) {
        this._unhandledTriggerAction = new unhandled_trigger_action_1.UnhandledTriggerAction(unhandledTriggerAction);
    }
    /**
     * Determine if the state machine is in the supplied state.
     *
     * @param {TState} state
     * @returns {boolean} True if the current state is equal to, or a substate of, the supplied state.
     * @memberof StateMachine
     */
    isInState(state) {
        return this.currentRepresentation.isIncludedIn(state);
    }
    /**
     * Returns true if <paramref name="trigger"/> can be fired in the current state.
     *
     * @param {TTrigger} trigger Trigger to test.
     * @returns {boolean} True if the trigger can be fired, false otherwise.
     * @memberof StateMachine
     */
    canFire(trigger) {
        return this.currentRepresentation.canHandle(trigger);
    }
    /**
     * string
     *
     * @returns {string} A description of the current state and permitted triggers.
     * @memberof StateMachine
     */
    toString() {
        return __awaiter(this, void 0, void 0, function* () {
            return `StateMachine { state = ${this.state}, permittedTriggers = { ${[...yield this.permittedTriggers].join(', ')} }}`;
        });
    }
    defaultUnhandledTriggerAction(state, trigger, unmetGuardConditions) {
        const source = state;
        this.getRepresentation(source);
        if (!unmetGuardConditions || unmetGuardConditions.length === 0) {
            throw new Error(`Trigger '${trigger}' is valid for transition from state '${state}' but a guard conditions are not met. Guard descriptions: '${unmetGuardConditions}'.`);
        }
        throw new Error(`No valid leaving transitions are permitted from state '${trigger}' for trigger '${state}'. Consider ignoring the trigger.`);
    }
    /**
     * Registers a callback that will be invoked every time the statemachine transitions from one state into another.
     *
     * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} onTransitionAction The action to execute, accepting the details
     * @memberof StateMachine
     */
    onTransitioned(onTransitionAction) {
        this._onTransitionedEvent.register(onTransitionAction);
    }
}
exports.StateMachine = StateMachine;
//# sourceMappingURL=state-machine.js.map