import { Transition } from './transition';
import { SuperState } from './super-state';
import { StateInfo } from '../reflection/state-info';

/**
 * Used to keep track of a state that has substates
 * 
 * @export
 * @class State
 * @template TState 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/State.cs
 */
export class State<TState> {

  private _isActive: boolean = false;
  private _stateName: string | null;
  private _nodeName: string;
  private _superState: SuperState<TState> | null = null;
  private _leaving: Array<Transition<TState>> = [];
  private _arriving: Array<Transition<TState>> = [];
  private _entryActions: string[] = [];
  private _exitActions: string[] = [];

  /**
   * The superstate of this state (null if none)
   * 
   * @type {(SuperState<TState> | null)}
   * @memberof State
   */
  public get superState(): SuperState<TState> | null { return this._superState; }

  /**
   * The superstate of this state (null if none)
   * 
   * @memberof State
   */
  public set superState(value: SuperState<TState> | null) { this._superState = value; }

  /**
   * List of all transitions that leave this state (never null)
   * 
   * @readonly
   * @type {Array<Transition<TState>>}
   * @memberof State
   */
  public get leaving(): Array<Transition<TState>> { return this._leaving; }

  /**
   * List of all transitions that enter this state (never null)
   * 
   * @readonly
   * @type {Array<Transition<TState>>}
   * @memberof State
   */
  public get arriving(): Array<Transition<TState>> { return this._arriving; }

  /**
   * Unique name of this object
   * 
   * @readonly
   * @type {string}
   * @memberof State
   */
  public get nodeName(): string { return this._nodeName; }

  /**
   * Name of the state represented by this object
   * 
   * @readonly
   * @type {string}
   * @memberof State
   */
  public get stateName(): string | null { return this._stateName; }

  /**
   * Actions that are executed when you enter this state from any trigger
   * 
   * @readonly
   * @type {string[]}
   * @memberof State
   */
  public get entryActions(): string[] { return this._entryActions; }

  /**
   * Actions that are executed when you exit this state
   * 
   * @readonly
   * @type {string[]}
   * @memberof State
   */
  public get exitActions(): string[] { return this._exitActions; }

  /**
   * Checking this state is active.
   * 
   * @readonly
   * @memberof State
   */
  public get isActive() { return this._isActive; }

  /**
   * Creates an instance of State.
   * @param {(StateInfo<TState> | string)} stateInfoOrNodeName 
   * @memberof State
   */
  constructor(stateInfoOrNodeName: StateInfo<TState> | string) {
    if (stateInfoOrNodeName instanceof StateInfo) {
      this._nodeName = `${stateInfoOrNodeName.underlyingState}`;
      this._stateName = `${stateInfoOrNodeName.underlyingState}`;
      this._isActive = stateInfoOrNodeName.isActive;
      // Only include entry actions that aren't specific to a trigger
      for (const entryAction of stateInfoOrNodeName.entryActions) {
        if (!entryAction.fromTrigger) {
          if (!!entryAction.method) {
            this._entryActions.push(entryAction.method.description);
          }
        }
      }

      for (const exitAction of stateInfoOrNodeName.exitActions) {
        if (!!exitAction) {
          this._exitActions.push(exitAction.description);
        }
      }
    } else {
      this._nodeName = stateInfoOrNodeName;
      this._stateName = null;
    }
  }
}
