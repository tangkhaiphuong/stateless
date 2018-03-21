import { TriggerBehaviour } from './trigger-behaviour';
import { Transition } from './transition';
import { InternalActionBehaviour } from './internal-action-behaviour';
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
export class StateRepresentation<TState, TTrigger> {

  private readonly _triggerBehaviours: Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger>>> = new Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger>>>();

  private readonly _entryActions: Array<EntryActionBehaviour<TState, TTrigger>> = [];

  private readonly _exitActions: Array<ExitActionBehaviour<TState, TTrigger>> = [];

  private readonly _activateActions: Array<ActivateActionBehaviour<TState>> = [];

  private readonly _deactivateActions: Array<DeactivateActionBehaviour<TState>> = [];

  private readonly _internalActions: Array<InternalActionBehaviour<TState, TTrigger>> = [];

  private _active: boolean = false;

  private _superstate: StateRepresentation<TState, TTrigger> | null = null;

  private readonly _substates: Array<StateRepresentation<TState, TTrigger>> = [];

  constructor(private readonly _state: TState) {
  }

  public getSubstates(): Array<StateRepresentation<TState, TTrigger>> {
    return this._substates;
  }

  public get triggerBehaviours(): Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger>>> {
    return this._triggerBehaviours;
  }

  public get entryActions(): Array<EntryActionBehaviour<TState, TTrigger>> {
    return this._entryActions;
  }

  public get exitActions(): Array<ExitActionBehaviour<TState, TTrigger>> {
    return this._exitActions;
  }

  public get activateActions(): Array<ActivateActionBehaviour<TState>> {
    return this._activateActions;
  }

  public get deactivateActions(): Array<DeactivateActionBehaviour<TState>> {
    return this._deactivateActions;
  }

  public async canHandle(trigger: TTrigger): Promise<boolean> {
    const [result] = await this.tryFindHandler(trigger);
    return result;
  }

  public get underlyingState(): TState { return this._state; }

  public addSubstate(substate: StateRepresentation<TState, TTrigger>): void {
    this._substates.push(substate);
  }

  public get superstate(): StateRepresentation<TState, TTrigger> | null { return this._superstate; }

  public set superstate(value: StateRepresentation<TState, TTrigger> | null) { this._superstate = value; }

  public addTriggerBehaviour(triggerBehaviour: TriggerBehaviour<TState, TTrigger>): void {
    let allowed = this._triggerBehaviours.get(triggerBehaviour.trigger);
    if (!allowed) {
      allowed = [];
      this._triggerBehaviours.set(triggerBehaviour.trigger, allowed);
    }
    allowed.push(triggerBehaviour);
  }

  public addInternalAction(trigger: TTrigger, action: ((transition: Transition<TState, TTrigger>, args: any[]) => void)): void {
    this._internalActions.push(new InternalActionBehaviour((t, args) => {
      if (t.trigger === trigger) {
        action(t, args);
      }
    }));
  }

  public async activate(): Promise<void> {
    if (!!this._superstate) {
      this._superstate.activate();
    }

    if (this._active) { return; }

    await this.executeActivationActions();
    this._active = true;
  }

  public async deactivate(): Promise<void> {
    if (!this._active) {
      return;
    }

    await this.executeDeactivationActions();
    this._active = false;

    if (!!this._superstate) {
      this._superstate.deactivate();
    }
  }

  public async tryFindHandler(trigger: TTrigger)
    : Promise<[boolean, TriggerBehaviourResult<TState, TTrigger> | undefined]> {
    const [result, handler] = await this.tryFindLocalHandler(trigger);
    if (result) { return [result, handler]; }

    if (this.superstate !== null) {
      return await this.superstate.tryFindHandler(trigger);
    }

    return [false, undefined];
  }

  private async tryFindLocalHandler(trigger: TTrigger, )
    : Promise<[boolean, TriggerBehaviourResult<TState, TTrigger> | undefined]> {

    const handler = this._triggerBehaviours.get(trigger);

    if (!handler) { return [false, undefined]; }

    // Guard functions executed
    const actual: Array<TriggerBehaviourResult<TState, TTrigger>> = [];
    for (const item of handler) {
      const condition = await item.unmetGuardConditions;
      actual.push(new TriggerBehaviourResult(item, condition));
    }

    const handlerResult = this.tryFindLocalHandlerResult(trigger, actual, r => r.unmetGuardConditions.length === 0)
      || this.tryFindLocalHandlerResult(trigger, actual, r => r.unmetGuardConditions.length > 0);

    if (!!handlerResult) {
      return [handlerResult.unmetGuardConditions.length === 0, handlerResult];
    } else {
      return [false, handlerResult];
    }
  }

  private tryFindLocalHandlerResult(
    trigger: TTrigger,
    results: Iterable<TriggerBehaviourResult<TState, TTrigger>>,
    filter: ((result: TriggerBehaviourResult<TState, TTrigger>) => boolean)): TriggerBehaviourResult<TState, TTrigger> | undefined {

    let actual: TriggerBehaviourResult<TState, TTrigger> | undefined;

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

  public addActivateAction(action: () => void | Promise<void>, activateActionDescription: InvocationInfo | null = null) {
    this._activateActions.push(new ActivateActionBehaviour(this._state, action, activateActionDescription));
  }

  public addDeactivateAction(action: () => void | Promise<void>, deactivateActionDescription: InvocationInfo | null = null) {
    this._deactivateActions.push(new DeactivateActionBehaviour(this._state, action, deactivateActionDescription));
  }

  public addEntryAction(trigger: TTrigger | undefined, action: ((transition?: Transition<TState, TTrigger>, ...args: any[]) => void | Promise<void>), entryActionDescription: InvocationInfo) {
    this._entryActions.push(new EntryActionBehaviour<TState, TTrigger>(action, entryActionDescription, trigger));
  }

  public addExitAction(action: ((transition: Transition<TState, TTrigger>) => void | Promise<void>), exitActionDescription: InvocationInfo | null = null): any {
    this._exitActions.push(new ExitActionBehaviour(action, exitActionDescription));
  }

  public async internalAction(transition: Transition<TState, TTrigger>, args: any[]): Promise<void> {
    const possibleActions: Array<InternalActionBehaviour<TState, TTrigger>> = [];

    // Look for actions in superstate(s) recursivly until we hit the topmost superstate, or we actually find some trigger handlers.
    let aStateRep: StateRepresentation<TState, TTrigger> | null = this;
    while (aStateRep !== null) {
      const [result] = await aStateRep.tryFindLocalHandler(transition.trigger);
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
      await action.execute(transition, args);
    }
  }

  public async enter(transition: Transition<TState, TTrigger>, entryArgs: any[]): Promise<void> {
    if (transition.isReentry) {
      await this.executeEntryActions(transition, entryArgs);
      await this.executeActivationActions();
    } else if (!this.includes(transition.source)) {
      if (!!this._superstate) {
        await this._superstate.enter(transition, entryArgs);
      }
      this.executeEntryActions(transition, entryArgs);
      this.executeActivationActions();
    }
  }

  public async exit(transition: Transition<TState, TTrigger>): Promise<Transition<TState, TTrigger>> {
    if (transition.isReentry) {
      await this.executeDeactivationActions();
      await this.executeExitActions(transition);
    } else if (!this.includes(transition.destination)) {
      await this.executeDeactivationActions();
      await this.executeExitActions(transition);

      if (!!this._superstate) {
        transition = new Transition(this._superstate.underlyingState, transition.destination, transition.trigger);
        return await this._superstate.exit(transition);
      }
    }
    return transition;
  }

  private async executeDeactivationActions(): Promise<void> {
    for (const action of this._deactivateActions) {
      await action.execute();
    }
  }

  private async executeEntryActions(transition: Transition<TState, TTrigger>, entryArgs: any[]): Promise<void> {
    for (const action of this._entryActions) {
      await action.execute(transition, entryArgs);
    }
  }

  private async executeExitActions(transition: Transition<TState, TTrigger>): Promise<void> {
    for (const action of this._exitActions) {
      await action.execute(transition);
    }
  }

  private async executeActivationActions(): Promise<void> {
    for (const action of this._activateActions) {
      await action.execute();
    }
  }

  public includes(state: TState): boolean {
    if (this._state === state) { return true; }
    for (const item of this._substates) {
      if (item.includes(state)) {
        return true;
      }
    }
    return false;
  }

  public isIncludedIn(state: TState): boolean {
    return this._state === state || (!!this._superstate && this._superstate.isIncludedIn(state));
  }

  public get permittedTriggers(): Promise<Iterable<TTrigger>> {
    const implement = async () => {
      const result: TTrigger[] = [];
      for (const item of this._triggerBehaviours) {
        let flag = false;
        for (const subItem of item['1']) {
          if ((await subItem.unmetGuardConditions).length === 0) {
            flag = true;
            break;
          }
        }
        if (flag) {
          result.push(item['0']);
        }
      }

      if (!!this.superstate) {
        for (const item of await this.superstate.permittedTriggers) {
          result.push(item);
        }
      }

      return result;
    };
    return implement();
  }

}
