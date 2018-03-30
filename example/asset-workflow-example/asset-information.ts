import { Person } from './person';

/**
 * Assets implement from: https://medium.com/@m3lles/stateless-a-lightweight-workflow-library-alternative-for-net-b739389bb049
 * 
 * @export
 * @class Asset
 * @link: https://github.com/trashvin/Tutorial_UsingStateless/blob/master/AssetWorkflow/AssetInformation.cs
 */
export class AssetInformation {

  constructor(
    private _assetId: number,
    private _assetName: string = '',
    private _owner: Person | null = null) {
  }

  public get assetId(): number { return this._assetId; }
  public set assetId(value: number) { this._assetId = value; }

  public get assetName(): string { return this._assetName; }
  public set assetName(value: string) { this._assetName = value; }

  public get owner(): Person | null { return this._owner; }
  public set owner(value: Person | null) { this._owner = value; }

}
