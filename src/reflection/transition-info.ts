import { TriggerInfo } from './trigger-info';
import { InvocationInfo } from './invocation-info';

/**
 * Presentation transition information.
 * 
 * @export
 * @abstract
 * @class TransitionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TransitionInfo.cs
 */
export class TransitionInfo {

  /**
   * Creates an instance of TransitionInfo.
   * @param {TriggerInfo} _trigger 
   * @param {Iterable<InvocationInfo>} _guardConditionsMethodDescriptions 
   * @memberof TransitionInfo
   */
  constructor(
    private readonly _trigger: TriggerInfo,
    private readonly _guardConditionsMethodDescriptions: Iterable<InvocationInfo>
  ) {
  }

  /**
   * The trigger whose firing resulted in this transition.
   * 
   * @readonly
   * @type {TriggerInfo}
   * @memberof TransitionInfo
   */
  public get trigger(): TriggerInfo {
    return this._trigger;
  }

  /**
   *  Method descriptions of the guard conditions.
   * Returns a non-null but empty list if there are no guard conditions
   * 
   * @type {InvocationInfo}
   * @memberof TransitionInfo
   */
  public get guardConditionsMethodDescriptions(): Iterable<InvocationInfo> {
    return this._guardConditionsMethodDescriptions;
  }
}
