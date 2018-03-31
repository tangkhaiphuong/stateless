/**
 * Defines dynamic state information.
 * 
 * @export
 * @class DynamicStateInfo
 * @template TState 
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/DynamicTransitionInfo.cs
 */
export class DynamicStateInfo<TState> {

  /**
   * Creates an instance of DynamicStateInfo.
   * @param { TState} _destinationState 
   * @param {string} _criterion 
   * @memberof DynamicStateInfo
   */
  constructor(
    private readonly _destinationState: TState,
    private readonly _criterion: string) {
  }

  /**
   * The name of the destination state.
   * 
   * @readonly
   * @type {string}
   * @memberof DynamicStateInfo
   */
  public get destinationState(): TState { return this._destinationState; }

  /**
   * The reason this destination state was chosen
   * 
   * @readonly
   * @type {string}
   * @memberof DynamicStateInfo
   */
  public get criterion(): string { return this._criterion; }
}
