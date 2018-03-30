import { Transition } from './transition';
import { InvocationInfo } from './reflection/invocation-info';

/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 * 
 * @export
 * @class UnhandledTriggerAction
 * @template TState 
 * @template TTrigger 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/EntryActionBehaviour.cs
 */
export class EntryActionBehaviour<TState, TTrigger> {

  /**
   * Creates an instance of EntryActionBehaviour.
   * @param {(((transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>))} _action 
   * @param {InvocationInfo} _desscription 
   * @param {TTrigger} [_trigger] 
   * @memberof EntryActionBehaviour
   */
  constructor(
    private readonly _action: ((transition: Transition<TState, TTrigger>, ...args: any[]) => any | Promise<any>),
    private readonly _desscription: InvocationInfo,
    private readonly _trigger: TTrigger | null = null) { }

  public async execute(transition: Transition<TState, TTrigger>, args: any[]): Promise<void> {
    if (!!this._trigger) {
      if (transition.trigger !== this._trigger) { return; }
    }
    const result = this._action.apply(this._action, [transition].concat(args));
    if (result instanceof Promise) {
      await result;
    }
  }

  public get trigger(): TTrigger | null { return this._trigger; }

  public get description(): InvocationInfo { return this._desscription; }
}
