/**
 * Represents a trigger in a statemachine.
 * 
 * @export
 * @class TriggerInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TriggerInfo.cs
 */
export class TriggerInfo {
  /**
   * Creates an instance of TriggerInfo.
   * @param {any} _underlyingTrigger 
   * @memberof TriggerInfo
   */
  constructor(private _underlyingTrigger: any) {
  }

  /**
   * The instance or value this trigger represents.
   * 
   * @readonly
   * @type {*}
   * @memberof TriggerInfo
   */
  public get underlyingTrigger(): any { return this._underlyingTrigger; }

  /**
   * Describes the trigger.
   * 
   * @memberof TriggerInfo
   */
  public toString(): string {
    return this._underlyingTrigger || '<null>';
  }
}
