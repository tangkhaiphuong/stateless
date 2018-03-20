import { TransitionGuard } from './transition-guard';

/**
 * Define trigger behaviour.
 * 
 * @export
 * @abstract
 * @class TriggerBehaviour
 * @template TState 
 * @template TTrigger 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TriggerBehaviour.cs
 */
export abstract class TriggerBehaviour<TState, TTrigger> {

  /**
   * Creates an instance of TriggerBehaviour.
   * @param {TTrigger} _trigger 
   * @param {TransitionGuard<TState, TTrigger>} _guard TransitionGuard (null if no guard function)
   * @memberof TriggerBehaviour
   */
  constructor(
    private readonly _trigger: TTrigger,
    private readonly _guard: TransitionGuard = TransitionGuard.empty) {
    // If there is no guard function, _guard is set to TransitionGuard.empty
  }

  public get trigger(): TTrigger { return this._trigger; }

  /**
   * Guard is the transition guard for this trigger.  Equal to TransitionGuard.Empty if there is no transition guard
   * 
   * @readonly
   * @type {TransitionGuard}
   * @memberof TriggerBehaviour
   */
  public get guard(): TransitionGuard { return this._guard; }

  /**
   * Guards is the list of guard functions for the transition guard for this trigger
   * 
   * @readonly
   * @memberof TriggerBehaviour
   */
  public get guards(): Array<(() => boolean | Promise<boolean>) | null> {
    return this._guard.guards;
  }

  /**
   * GuardConditionsMet is true if all of the guard functions return true or if there are no guard functions
   * 
   * @readonly
   * @type {boolean}
   * @memberof TriggerBehaviour
   */
  public get guardConditionsMet(): Promise<boolean> { return this._guard.guardConditionsMet; }

  /**
   * UnmetGuardConditions is a list of the descriptions of all guard conditionswhose guard function returns false
   * 
   * @template string 
   * @memberof TriggerBehaviour
   */
  public get unmetGuardConditions(): Promise<string[]> { return this._guard.unmetGuardConditions(); }

  public abstract resultsInTransitionFrom(source: TState, args: any[]): Promise<[boolean, TState]>;
}
