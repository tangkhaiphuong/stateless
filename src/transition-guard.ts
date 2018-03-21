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
export class TransitionGuard {

  private readonly _conditions: GuardCondition[] = [];

  public static get empty(): TransitionGuard {
    return new TransitionGuard();
  }

  constructor(...guards: Array<{ guard: (() => boolean | Promise<boolean>), description: string }>) {
    for (const item of guards) {
      this._conditions.push(
        new GuardCondition(item.guard, InvocationInfo.create(item.guard, item.description)));
    }
  }

  public get conditions(): GuardCondition[] { return this._conditions; }

  /**
   * guards is the list of the guard functions for all guard conditions for this transition
   * 
   * @readonly
   * @memberof TransitionGuard
   */
  public get guards(): Array<(() => boolean | Promise<boolean>) | null> {
    return this._conditions.map(c => c.guard);
  }

  /**
   * guardConditionsMet is true if all of the guard functions return true or if there are no guard functions
   * 
   * @returns {Promise<boolean>} 
   * @memberof TransitionGuard
   */
  public get guardConditionsMet(): Promise<boolean> {
    const implement = async (): Promise<boolean> => {
      for (const item of this.conditions) {
        if (!item.guard) { return false; }
        const result = item.guard();
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
   *  unmetGuardConditions is a list of the descriptions of all guard conditions whose guard function returns false
   * 
   * @returns {(Promise<Array<string | null>>)} 
   * @memberof TransitionGuard
   */
  public async unmetGuardConditions(): Promise<string[]> {
    const implement = async (): Promise<string[]> => {

      const result: string[] = [];
      for (const item of this.conditions) {
        if (!item.guard) { continue; }
        const guard = item.guard();
        if (guard instanceof Promise) {
          const final = await guard;
          if (final === false) {
            result.push(item.description);
          }
        } else if (guard === false) {
          result.push(item.description);
        }
      }
      return result;
    };
    return implement();
  }
}