/**
 * Describes a state transition.
 * 
 * @export
 * @class Transition
 * @template TState 
 * @template TTrigger 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Transition.cs
 */
export class Transition<TState, TTrigger> {

  /**
   * Creates an instance of Transition.
   * @param {TState} _source The state transitioned from.
   * @param {TState} _destination The state transitioned to
   * @param {TTrigger} _trigger The trigger that caused the transition.
   * @memberof Transition
   */
  constructor(
    private readonly _source: TState,
    private readonly _destination: TState,
    private readonly _trigger: TTrigger) { }

  /**
   * The state transitioned from.
   * 
   * @readonly
   * @memberof Transition
   */
  public get source() { return this._source; }

  /**
   * The state transitioned to.
   * 
   * @readonly
   * @memberof Transition
   */
  public get destination() { return this._destination; }

  /**
   * The trigger that caused the transition.
   * 
   * @readonly
   * @memberof Transition
   */
  public get trigger() { return this._trigger; }

  /**
   * True if the transition is a re-entry, i.e. the identity transition.
   * 
   * @readonly
   * @type {boolean}
   * @memberof Transition
   */
  public get isReentry(): boolean { return this.source === this.destination; }
}
