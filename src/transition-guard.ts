import { GuardCondition } from './guard-condition';
import { InvocationInfo } from './reflection/invocation-info';

/**
 * Describes a state transition.
 *
 * @export
 * @class Transition
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitionGuard.cs
 */
export class TransitionGuard<TContext = undefined> {

  private readonly _conditions: Array<GuardCondition<TContext>> = [];

  public static empty<TContext>(): TransitionGuard<TContext> {
    return new TransitionGuard<TContext>();
  }

  constructor(...guards: Array<{ guard: ((...args: any[]) => boolean | Promise<boolean>) | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>), description?: string | null } | ((...args: any[]) => boolean | Promise<boolean>) | ((context: TContext, ...args: any[]) => boolean | Promise<boolean>)>) {
    for (const item of guards) {
      if (item instanceof Function) {
        this._conditions.push(new GuardCondition(item, InvocationInfo.create(item, null)));
      } else {
        this._conditions.push(new GuardCondition(item.guard, InvocationInfo.create(item.guard, item.description || null)));
      }
    }
  }

  public get conditions(): Array<GuardCondition<TContext>> { return this._conditions; }

  /**
   * guards is the list of the guard functions for all guard conditions for this transition
   * 
   * @readonly
   * @memberof TransitionGuard
   */
  public get guards(): Array<((...args: any[]) => boolean | Promise<boolean>) | null> {
    return this._conditions.map(c => c.guard);
  }

  /**
   * guardConditionsMet is true if all of the guard functions return true or if there are no guard functions
   * 
   * @param {any[]} args 
   * @param {TContext} [context] 
   * @returns {Promise<boolean>} 
   * @memberof TransitionGuard
   */
  public guardConditionsMet(args: any[], context?: TContext): Promise<boolean> {
    const implement = async (): Promise<boolean> => {
      for (const item of this.conditions) {
        if (!item.guard) { return false; }
        const guard = item.guard as any;
        const result = !!context ? guard.apply(item, [context].concat(args)) : guard.apply(item, args);
        if (result instanceof Promise) {
          const final = await result;
          if (final === false) {
            return false;
          }
        } else if (result === false) {
          return false;
        }
      }
      return true;
    };
    return implement();
  }

  /**
   * unmetGuardConditions is a list of the descriptions of all guard conditions whose guard function returns false
   * 
   * @param {any[]} args 
   * @param {TContext} [context] 
   * @returns {Promise<string[]>} 
   * @memberof TransitionGuard
   */
  public async unmetGuardConditions(args: any[], context?: TContext): Promise<string[]> {
    const implement = async (): Promise<string[]> => {

      const results: string[] = [];
      for (const item of this.conditions) {
        if (!item.guard) { continue; }
        const guard = item.guard as any;
        const result = !!context ? guard.apply(guard, [context].concat(args)) : guard.apply(guard, args);
        if (result instanceof Promise) {
          const final = await result;
          if (final === false) {
            results.push(item.description);
          }
        } else if (result === false) {
          results.push(item.description);
        }
      }
      return results;
    };
    return implement();
  }
}
