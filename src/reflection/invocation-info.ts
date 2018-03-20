export type Timing = 'Synchronous' | 'Asynchronous';

/**
 *  Describes a method - either an action (activate, deactivate, etc.) or a transition guard
 * 
 * @export
 * @class InvocationInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/InvocationInfo.cs
 */
export class InvocationInfo {

  public static create(method: ((...args: any[]) => any), description: string | null, timing: Timing = 'Synchronous'): InvocationInfo {
    return new InvocationInfo(method.name, description, timing);
  }

  /**
   * Creates an instance of InvocationInfo.
   * @param {string} _methodName 
   * @param {string} _description 
   * @param {Timing} _timing 
   * @memberof InvocationInfo
   */
  constructor(
    private readonly _methodName: string,
    private readonly _description: string | null,
    private readonly _timing: Timing) {      // description can be null if user didn't specify a description
  }

  /**
   * The name of the invoked method.  If the method is a lambda or delegate, the name will be a compiler-generated
   * name that is often not human-friendly (e.g. "(.ctor)b__2_0" except with angle brackets instead of parentheses)
   * 
   * @readonly
   * @memberof InvocationInfo
   */
  public get methodName() { return this._methodName; }

  /**
   * Text returned for compiler - generated functions where the caller has not specified a description.
   * 
   * @readonly
   * @static
   * @type {string}
   * @memberof InvocationInfo
   */
  public static get defaultFunctionDescription(): string { return 'Function'; }

  /**
   * A description of the invoked method.  Returns:
   * 1) The user-specified description, if any
   * 2) else if the method name is compiler-generated, returns DefaultFunctionDescription
   * 3) else the method name
   * 
   * @readonly
   * @type {string}
   * @memberof InvocationInfo
   */
  public get description(): string {
    if (!!this._description) {
      return this._description;
    }
    if (/<|>\`/.test(this._methodName)) {
      return InvocationInfo.defaultFunctionDescription;
    }
    return this.methodName || '<null>';
  }

  /**
   * Returns true if the method is invoked asynchronously.
   * 
   * @readonly
   * @type {boolean}
   * @memberof InvocationInfo
   */
  public get isAsync(): boolean {
    return this._timing === 'Asynchronous';
  }
}
