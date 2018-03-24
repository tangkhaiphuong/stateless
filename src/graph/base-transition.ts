import { TriggerInfo } from '../reflection/trigger-info';
import { State } from './state';
import { ActionInfo } from '../reflection/action-info';

/**
 * Used to keep track of transitions between states
 * 
 * @export
 * @class Transition
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Transition.cs
 */
export abstract class BaseTransition {

  protected _executeEntryExitActions: boolean = true;

  /**
   * The trigger that causes this transition
   * 
   * @readonly
   * @type {TriggerInfo}
   * @memberof Transition
   */
  public get trigger(): TriggerInfo { return this._trigger; }

  /**
   * List of actions to be performed by the destination state (the one being entered)
   * 
   * @readonly
   * @type {ActionInfoơ}
   * @memberof Transition
   */
  public destinationEntryActions: ActionInfo[] = [];

  /**
   * Should the entry and exit actions be executed when this transition takes place
   * 
   * @readonly
   * @type {boolean}
   * @memberof Transition
   */
  public get executeEntryExitActions(): boolean { return this._executeEntryExitActions; }

  /**
   * The state where this transition starts
   * 
   * @readonly
   * @type {State}
   * @memberof Transition
   */
  public get sourceState(): State { return this._sourceState; }

  /**
   * Creates an instance of Transition.
   * @param {State} _sourceState 
   * @param {TriggerInfo} _trigger 
   * @memberof Transition
   */
  constructor(
    private _sourceState: State,
    private _trigger: TriggerInfo) {
  }
}
