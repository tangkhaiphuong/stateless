import { ActivateActionBehaviour } from '../activate-action-behaviour';
import { DeactivateActionBehaviour } from '../deactivate-action-behaviour';
import { EntryActionBehaviour } from '../entry-action-behaviour';
import { ExitActionBehaviour } from '../exit-action-behaviour';
import { InternalTriggerBehaviour } from '../internal-trigger-behaviour';
import { InvocationInfo } from '../reflection/invocation-info';
import { Transition } from '../transition';
import { TriggerBehaviour } from '../trigger-behaviour';
import { TriggerBehaviourResult } from '../trigger-behaviour-result';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/StateRepresentation.cs
 * 
 * @export
 * @class StateRepresentation
 * @template TState 
 * @template TTrigger 
 */
export class StateRepresentation<TState, TTrigger, TContext>  {

  private readonly _triggerBehaviours: Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger, TContext>>> = new Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger, TContext>>>();

  private readonly _entryActions: Array<EntryActionBehaviour<TState, TTrigger, TContext>> = [];

  private readonly _exitActions: Array<ExitActionBehaviour<TState, TTrigger, TContext>> = [];

  private readonly _activateActions: Array<ActivateActionBehaviour<TState, TContext>> = [];

  private readonly _deactivateActions: Array<DeactivateActionBehaviour<TState, TContext>> = [];

  private _superstate: StateRepresentation<TState, TTrigger, TContext> | null = null;

  private readonly _substates: Array<StateRepresentation<TState, TTrigger, TContext>> = [];

  public _hasInitialTransition: boolean = false;

  constructor(private readonly _state: TState, private _initialTransitionTarget: TState = _state) {
  }

  public get hasInitialTransition(): boolean {
    return this._hasInitialTransition;
  }

  public get initialTransitionTarget(): TState {
    return this._initialTransitionTarget;
  }

  public getSubstates(): Array<StateRepresentation<TState, TTrigger, TContext>> {
    return this._substates;
  }

  public get triggerBehaviours(): Map<TTrigger, Array<TriggerBehaviour<TState, TTrigger, TContext>>> {
    return this._triggerBehaviours;
  }

  public get entryActions(): Array<EntryActionBehaviour<TState, TTrigger, TContext>> {
    return this._entryActions;
  }

  public get exitActions(): Array<ExitActionBehaviour<TState, TTrigger, TContext>> {
    return this._exitActions;
  }

  public get activateActions(): Array<ActivateActionBehaviour<TState, TContext>> {
    return this._activateActions;
  }

  public get deactivateActions(): Array<DeactivateActionBehaviour<TState, TContext>> {
    return this._deactivateActions;
  }

  public async canHandle(context: TContext, trigger: TTrigger, ...args: any[]): Promise<boolean> {
    const [result] = await this.tryFindHandler(context, trigger, args);
    return result;
  }

  public get underlyingState(): TState { return this._state; }

  public addSubstate(substate: StateRepresentation<TState, TTrigger, TContext>): any {
    this._substates.push(substate);
  }

  public get superstate(): StateRepresentation<TState, TTrigger, TContext> | null { return this._superstate; }

  public set superstate(value: StateRepresentation<TState, TTrigger, TContext> | null) { this._superstate = value; }

  public addTriggerBehaviour(triggerBehaviour: TriggerBehaviour<TState, TTrigger, TContext>): any {
    let allowed = this._triggerBehaviours.get(triggerBehaviour.trigger);
    if (!allowed) {
      allowed = [];
      this._triggerBehaviours.set(triggerBehaviour.trigger, allowed);
    }
    allowed.push(triggerBehaviour);
  }

  public async activate(context: TContext, active: { value: boolean }): Promise<void> {
    if (!!this.superstate) {
      await this.superstate.activate(context, active);
    }

    if (active.value) { return; }

    await this.executeActivationActions(context);
    active.value = true;
  }

  public async deactivate(context: TContext, active: { value: boolean }): Promise<void> {
    if (!active.value) {
      return;
    }

    await this.executeDeactivationActions(context);
    active.value = false;

    if (!!this.superstate) {
      await this.superstate.deactivate(context, active);
    }
  }

  public async tryFindHandler(context: TContext, trigger: TTrigger, args: any[])
    : Promise<[boolean, TriggerBehaviourResult<TState, TTrigger, TContext> | undefined]> {
    const [result, handler] = await this.tryFindLocalHandler(context, trigger, args);
    if (result) { return [result, handler]; }

    if (this.superstate !== null) {
      return await this.superstate.tryFindHandler(context, trigger, args);
    }

    return [false, undefined];
  }

  private async tryFindLocalHandler(context: TContext, trigger: TTrigger, args: any[])
    : Promise<[boolean, TriggerBehaviourResult<TState, TTrigger, TContext> | undefined]> {

    // Get list of candidate trigger handlers
    const handler = this._triggerBehaviours.get(trigger);

    if (!handler) { return [false, undefined]; }

    // Remove those that have unmet guard conditions
    // Guard functions are executed here
    const actual: Array<TriggerBehaviourResult<TState, TTrigger, TContext>> = [];
    for (const item of handler) {
      const condition = await item.unmetGuardConditions(args, context);
      if (condition.length === 0) {
        actual.push(new TriggerBehaviourResult(item, condition));
      }
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
    results: Iterable<TriggerBehaviourResult<TState, TTrigger, TContext>>,
    filter: (result: TriggerBehaviourResult<TState, TTrigger, TContext>) => boolean): TriggerBehaviourResult<TState, TTrigger, TContext> | undefined {

    let actual: TriggerBehaviourResult<TState, TTrigger, TContext> | undefined;

    for (const item of results) {
      if (!!actual) {
        throw new Error(`Multiple permitted exit transitions are configured from state '${this._state}' for trigger '${trigger}'. Guard clauses must be mutually exclusive.`);
      }
      if (filter(item)) {
        actual = item;
      }
    }
    return actual;
  }

  public addActivateAction(action: (context: TContext) => any | Promise<any>, activateActionDescription: InvocationInfo) {
    this._activateActions.push(new ActivateActionBehaviour(this._state, action, activateActionDescription));
  }

  public addDeactivateAction(
    action: (context: TContext) => any | Promise<any>,
    deactivateActionDescription: InvocationInfo) {
    this._deactivateActions.push(new DeactivateActionBehaviour(this._state, action, deactivateActionDescription));
  }

  public addEntryAction(
    trigger: TTrigger | null,
    action: (context: TContext, transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>,
    entryActionDescription: InvocationInfo) {
    this._entryActions.push(new EntryActionBehaviour<TState, TTrigger, TContext>(action, entryActionDescription, trigger));
  }

  public addExitAction(
    action: (context: TContext, transition: Transition<TState, TTrigger>) => any | Promise<any>,
    exitActionDescription: InvocationInfo): any {
    this._exitActions.push(new ExitActionBehaviour<TState, TTrigger, TContext>(action, exitActionDescription));
  }

  public async internalAction(context: TContext, transition: Transition<TState, TTrigger>, args: any[]): Promise<void> {

    let internalTransition: InternalTriggerBehaviour<TState, TTrigger, TContext> | undefined;

    // Look for actions in superstate(s) recursivly until we hit the topmost superstate, or we actually find some trigger handlers.
    let aStateRep: StateRepresentation<TState, TTrigger, TContext> | null = this;
    while (aStateRep !== null) {
      const [result, handler] = await aStateRep.tryFindLocalHandler(context, transition.trigger, args);
      if (result && handler) {
        internalTransition = handler.handler as InternalTriggerBehaviour<TState, TTrigger, TContext>;
        break;
      }
      // Try to look for trigger handlers in superstate (if it exists)
      aStateRep = aStateRep._superstate;
    }

    // Execute internal transition event handler
    if (!internalTransition) {
      throw new Error('The configuration is incorrect, no action assigned to this internal transition.');
    }
    internalTransition.execute(transition, args);
  }

  public async enter(context: TContext, transition: Transition<TState, TTrigger>, entryArgs: any[]): Promise<void> {
    if (transition.isReentry) {
      await this.executeEntryActions(context, transition, entryArgs);
      await this.executeActivationActions(context);
    } else if (!this.includes(transition.source)) {
      if (!!this._superstate) {
        await this._superstate.enter(context, transition, entryArgs);
      }
      await this.executeEntryActions(context, transition, entryArgs);
      await this.executeActivationActions(context);
    }
  }

  public async exit(context: TContext, transition: Transition<TState, TTrigger>): Promise<Transition<TState, TTrigger>> {
    if (transition.isReentry) {
      await this.executeDeactivationActions(context);
      await this.executeExitActions(context, transition);
    } else if (!this.includes(transition.destination)) {
      await this.executeDeactivationActions(context);
      await this.executeExitActions(context, transition);

      if (!!this.superstate) {
        // Check if destination is within the state list
        if (this.isIncludedIn(transition.destination)) {
          // Destination state is within the list, exit first superstate only if it is NOT the the first
          if (this.superstate.underlyingState !== transition.destination) {
            return await this.superstate.exit(context, transition);
          }
        } else {
          // Exit the superstate as well
          return await this.superstate.exit(context, transition);
        }
      }
    }
    return transition;
  }

  public async executeDeactivationActions(context: TContext): Promise<void> {
    for (const action of this._deactivateActions) {
      await action.execute(context);
    }
  }

  private async executeEntryActions(context: TContext, transition: Transition<TState, TTrigger>, entryArgs: any[]): Promise<void> {
    for (const action of this._entryActions) {
      await action.execute(transition, entryArgs, context);
    }
  }

  private async executeExitActions(context: TContext, transition: Transition<TState, TTrigger>): Promise<void> {
    for (const action of this._exitActions) {
      await action.execute(transition, context);
    }
  }

  private async executeActivationActions(context: TContext): Promise<void> {
    for (const action of this._activateActions) {
      await action.execute(context);
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

  public permittedTriggers(context: TContext): Promise<TTrigger[]> {
    return this.getPermittedTriggers(context, []);
  }

  public getPermittedTriggers(context: TContext, args: any[]): Promise<TTrigger[]> {
    const implement = async () => {
      const result: TTrigger[] = [];
      for (const item of this._triggerBehaviours) {
        let flag = false;
        for (const subItem of item['1']) {
          if ((await subItem.unmetGuardConditions(args, context)).length === 0) {
            flag = true;
            break;
          }
        }
        if (flag) {
          result.push(item['0']);
        }
      }

      if (!!this.superstate) {
        for (const item of await this.superstate.getPermittedTriggers(context, args)) {
          result.push(item);
        }
      }

      return result;
    };
    return implement();
  }

  public setInitialTransition(state: TState): void {
    this._initialTransitionTarget = state;
    this._hasInitialTransition = true;
  }
}
