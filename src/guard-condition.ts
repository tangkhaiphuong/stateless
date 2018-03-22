import { InvocationInfo } from './reflection/invocation-info';

/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/GuardCondition.cs
 */
export class GuardCondition {

  constructor(
    private readonly _guard: ((args: any[]) => boolean | Promise<boolean>),
    private readonly _methodDescription: InvocationInfo) {
  }

  public get guard(): ((args: any[]) => boolean | Promise<boolean>) { return this._guard; }

  /**
   *  Return the description of the guard method: the caller-defined description if one
   *  was provided, else the name of the method itself
   * 
   * @readonly
   * @type {string}
   * @memberof GuardCondition
   */
  public get description(): string { return this._methodDescription.description; }

  // 
  /**
   * Return a more complete description of the guard method
   * 
   * @readonly
   * @type {InvocationInfo}
   * @memberof GuardCondition
   */
  public get methodDescription(): InvocationInfo { return this._methodDescription; }
}
