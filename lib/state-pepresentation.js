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
const transition_1 = require("./transition");
const internal_action_behaviour_1 = require("./internal-action-behaviour");
const trigger_behaviour_result_1 = require("./trigger-behaviour-result");
const entry_action_behaviour_1 = require("./entry-action-behaviour");
const exit_action_behaviour_1 = require("./exit-action-behaviour");
const deactivate_action_behaviour_1 = require("./deactivate-action-behaviour");
const activate_action_behaviour_1 = require("./activate-action-behaviour");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateRepresentation.cs
 *
 * @export
 * @class StateRepresentation
 * @template TState
 * @template TTrigger
 */
class StateRepresentation {
    constructor(_state) {
        this._state = _state;
        this._triggerBehaviours = new Map();
        this._entryActions = [];
        this._exitActions = [];
        this._activateActions = [];
        this._deactivateActions = [];
        this._internalActions = [];
        this._active = false;
        this._superstate = null;
        this._substates = [];
    }
    getSubstates() {
        return this._substates;
    }
    get triggerBehaviours() {
        return this._triggerBehaviours;
    }
    get entryActions() {
        return this._entryActions;
    }
    get exitActions() {
        return this._exitActions;
    }
    get activateActions() {
        return this._activateActions;
    }
    get deactivateActions() {
        return this._deactivateActions;
    }
    canHandle(trigger) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.tryFindHandler(trigger);
            return result;
        });
    }
    get underlyingState() { return this._state; }
    addSubstate(substate) {
        this._substates.push(substate);
    }
    get superstate() { return this._superstate; }
    set superstate(value) { this._superstate = value; }
    addTriggerBehaviour(triggerBehaviour) {
        let allowed = this._triggerBehaviours.get(triggerBehaviour.trigger);
        if (!allowed) {
            allowed = [];
            this._triggerBehaviours.set(triggerBehaviour.trigger, allowed);
        }
        allowed.push(triggerBehaviour);
    }
    addInternalAction(trigger, action) {
        this._internalActions.push(new internal_action_behaviour_1.InternalActionBehaviour((t, args) => {
            if (t.trigger === trigger) {
                action(t, args);
            }
        }));
    }
    activate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this._superstate) {
                this._superstate.activate();
            }
            if (this._active) {
                return;
            }
            yield this.executeActivationActions();
            this._active = true;
        });
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._active) {
                return;
            }
            yield this.executeDeactivationActions();
            this._active = false;
            if (!!this._superstate) {
                this._superstate.deactivate();
            }
        });
    }
    tryFindHandler(trigger) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result, handler] = yield this.tryFindLocalHandler(trigger);
            if (result) {
                return [result, handler];
            }
            if (this.superstate !== null) {
                return yield this.superstate.tryFindHandler(trigger);
            }
            return [false, undefined];
        });
    }
    tryFindLocalHandler(trigger) {
        return __awaiter(this, void 0, void 0, function* () {
            const handler = this._triggerBehaviours.get(trigger);
            if (!handler) {
                return [false, undefined];
            }
            // Guard functions executed
            const actual = [];
            for (const item of handler) {
                const condition = yield item.unmetGuardConditions;
                actual.push(new trigger_behaviour_result_1.TriggerBehaviourResult(item, condition));
            }
            const handlerResult = this.tryFindLocalHandlerResult(trigger, actual, r => r.unmetGuardConditions.length === 0)
                || this.tryFindLocalHandlerResult(trigger, actual, r => r.unmetGuardConditions.length > 0);
            if (!!handlerResult) {
                return [handlerResult.unmetGuardConditions.length === 0, handlerResult];
            }
            else {
                return [false, handlerResult];
            }
        });
    }
    tryFindLocalHandlerResult(trigger, results, filter) {
        let actual;
        for (const item of results) {
            if (!!actual) {
                throw new Error(`Multiple permitted exit transitions are configured from state '${trigger}' for trigger '${this._state}'. Guard clauses must be mutually exclusive.`);
            }
            if (filter(item)) {
                actual = item;
            }
        }
        return actual;
    }
    addActivateAction(action, activateActionDescription = null) {
        this._activateActions.push(new activate_action_behaviour_1.ActivateActionBehaviour(this._state, action, activateActionDescription));
    }
    addDeactivateAction(action, deactivateActionDescription = null) {
        this._deactivateActions.push(new deactivate_action_behaviour_1.DeactivateActionBehaviour(this._state, action, deactivateActionDescription));
    }
    addEntryAction(trigger, action, entryActionDescription) {
        this._entryActions.push(new entry_action_behaviour_1.EntryActionBehaviour(action, entryActionDescription, trigger));
    }
    addExitAction(action, exitActionDescription = null) {
        this._exitActions.push(new exit_action_behaviour_1.ExitActionBehaviour(action, exitActionDescription));
    }
    internalAction(transition, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const possibleActions = [];
            // Look for actions in superstate(s) recursivly until we hit the topmost superstate, or we actually find some trigger handlers.
            let aStateRep = this;
            while (aStateRep !== null) {
                const [result] = yield aStateRep.tryFindLocalHandler(transition.trigger);
                if (result) {
                    // Trigger handler(s) found in this state
                    for (const item of aStateRep._internalActions) {
                        possibleActions.push(item);
                    }
                    break;
                }
                // Try to look for trigger handlers in superstate (if it exists)
                aStateRep = aStateRep._superstate;
            }
            // Execute internal transition event handler
            for (const action of possibleActions) {
                yield action.execute(transition, args);
            }
        });
    }
    enter(transition, entryArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (transition.isReentry) {
                yield this.executeEntryActions(transition, entryArgs);
                yield this.executeActivationActions();
            }
            else if (!this.includes(transition.source)) {
                if (!!this._superstate) {
                    yield this._superstate.enter(transition, entryArgs);
                }
                this.executeEntryActions(transition, entryArgs);
                this.executeActivationActions();
            }
        });
    }
    exit(transition) {
        return __awaiter(this, void 0, void 0, function* () {
            if (transition.isReentry) {
                yield this.executeDeactivationActions();
                yield this.executeExitActions(transition);
            }
            else if (!this.includes(transition.destination)) {
                yield this.executeDeactivationActions();
                yield this.executeExitActions(transition);
                if (!!this._superstate) {
                    transition = new transition_1.Transition(this._superstate.underlyingState, transition.destination, transition.trigger);
                    return yield this._superstate.exit(transition);
                }
            }
            return transition;
        });
    }
    executeDeactivationActions() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const action of this._deactivateActions) {
                yield action.execute();
            }
        });
    }
    executeEntryActions(transition, entryArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const action of this._entryActions) {
                yield action.execute(transition, entryArgs);
            }
        });
    }
    executeExitActions(transition) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const action of this._exitActions) {
                yield action.execute(transition);
            }
        });
    }
    executeActivationActions() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const action of this._activateActions) {
                yield action.execute();
            }
        });
    }
    includes(state) {
        if (this._state === state) {
            return true;
        }
        for (const item of this._substates) {
            if (item.includes(state)) {
                return true;
            }
        }
        return false;
    }
    isIncludedIn(state) {
        return this._state === state || (!!this._superstate && this._superstate.isIncludedIn(state));
    }
    get permittedTriggers() {
        const implement = () => __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (const item of this._triggerBehaviours) {
                let flag = false;
                for (const subItem of item['1']) {
                    if ((yield subItem.unmetGuardConditions).length === 0) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    result.push(item['0']);
                }
            }
            if (!!this.superstate) {
                for (const item of yield this.superstate.permittedTriggers) {
                    result.push(item);
                }
            }
            return result;
        });
        return implement();
    }
}
exports.StateRepresentation = StateRepresentation;

//# sourceMappingURL=state-pepresentation.js.map
