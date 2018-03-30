/**
 * Assets implement from: https://medium.com/@m3lles/stateless-a-lightweight-workflow-library-alternative-for-net-b739389bb049
 * 
 * @export
 * @class Asset
 * @link: https://github.com/trashvin/Tutorial_UsingStateless/blob/master/AssetWorkflow/Person.cs
 */
export class Person {
  constructor(
    private _personId: number,
    private _personName: string,
    private _emailAddress: string) {
  }

  public get personId(): number { return this._personId; }
  public set personId(value: number) { this._personId = value; }

  public get personName(): string { return this._personName; }
  public set personName(value: string) { this._personName = value; }

  public get emailAddress(): string { return this._emailAddress; }
  public set emailAddress(value: string) { this._emailAddress = value; }
}
