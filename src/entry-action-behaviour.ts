import { Transition } from './transition';
import { InvocationInfo } from './reflection/invocation-info';

/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 * 
 * @export
 * @class EntryActionBehaviour
 * @template TState 
 * @template TTrigger 
 * @template TContext 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/EntryActionBehaviour.cs
 */
export class EntryActionBehaviour<TState, TTrigger, TContext = undefined> {

  /**
   * Creates an instance of EntryActionBehaviour.
   * @param {(((transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>))} _action 
   * @param {InvocationInfo} _desscription 
   * @param {(TTrigger | null)} [_trigger=null] 
   * @memberof EntryActionBehaviour
   */
  constructor(
    private readonly _action: ((transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>),
    private readonly _desscription: InvocationInfo,
    private readonly _trigger: TTrigger | null = null) { }

  public async execute(transition: Transition<TState, TTrigger>, args: any[], context?: TContext): Promise<void> {
    if (!!this._trigger) {
      if (transition.trigger !== this._trigger) { return; }
    }
    const action = this._action as any;
    const result = !!context ? action.apply(action, [context, transition].concat(args)) : action.apply(action, [transition].concat(args));
    if (result instanceof Promise) {
      await result;
    }
  }

  public get trigger(): TTrigger | null { return this._trigger; }

  public get description(): InvocationInfo { return this._desscription; }
}
