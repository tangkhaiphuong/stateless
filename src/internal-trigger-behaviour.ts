import { TriggerBehaviour } from './trigger-behaviour';
import { TransitionGuard } from './transition-guard';
import { Transition } from './transition';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
export class InternalTriggerBehaviour<TState, TTrigger, TContext = undefined> extends TriggerBehaviour<TState, TTrigger, TContext>  {

  /**
   * Creates an instance of InternalTriggerBehaviour.
   * @param {TTrigger} trigger 
   * @param {(((...args: any[]) => boolean | Promise<boolean>) | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>))} guard 
   * @param {(string | null)} [guardDescription=null] 
   * @memberof InternalTriggerBehaviour
   */
  constructor(
    trigger: TTrigger,
    guard: ((...args: any[]) => boolean | Promise<boolean>) | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>),
    private readonly _internalAction: (((transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>)),
    guardDescription: string | null = null) {
    super(trigger, new TransitionGuard<TContext>({ guard: guard, description: guardDescription }));
  }

  public get internalAction(): (((transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>) | ((context: TContext, transition: Transition<TState, TTrigger>, args: any[]) => any | Promise<any>)) {
    return this._internalAction;
  }

  public resultsInTransitionFrom(source: TState, _args: any[], _context?: TContext): Promise<[boolean, TState]> {
    const result: [boolean, TState] = [false, source];
    return Promise.resolve(result);
  }

  public async execute(transition: Transition<TState, TTrigger>, args: any[], context?: TContext): Promise<void> {
    const action = this._internalAction as any;
    const result = !!context ? action(context, transition, args) : action(transition, args);
    if (result instanceof Promise) {
      await result;
    }
  }
}
