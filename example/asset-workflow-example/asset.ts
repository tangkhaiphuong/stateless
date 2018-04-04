import { StateMachine } from '../../src';
import { AssetInformation } from './asset-information';
import { Person } from './person';
import { UmlDotGraph } from '../../src/graph/uml-dot-graph';

export enum State {
  New = 'New',
  Available = 'Available',
  Allocated = 'Allocated',
  UnderMaintenance = 'UnderMaintenance',
  Unavailable = 'Unavailable',
  Decommissioned = 'Decommissioned'
}
export enum Trigger {
  Tested = 'Tested',
  Assigned = 'Assigned',
  Released = 'Released',
  RequestRepair = 'RequestRepair',
  RequestUpdate = 'RequestUpdate',
  Transferred = 'Transferred',
  Repaired = 'Repaired',
  Lost = 'Lost',
  Discarded = 'Discarded',
  Found = 'Found'
}

/**
 * Assets implement from: https://medium.com/@m3lles/stateless-a-lightweight-workflow-library-alternative-for-net-b739389bb049
 * 
 * @export
 * @class Asset
 * @link: https://github.com/trashvin/Tutorial_UsingStateless/blob/master/AssetWorkflow/Asset.cs
 */
export class Asset {
  protected _state: State = State.New;
  protected readonly _machine: StateMachine<State, Trigger>;
  protected _previousState: State | null = null;
  protected _isSuccesful: boolean = false;
  protected _assetData: AssetInformation;
  protected _ownerData: Person | null = null;

  public get ownerData(): Person | null { return this._ownerData; }
  public set ownerData(value: Person | null) { this._ownerData = value; }

  public get assetData(): AssetInformation { return this._assetData; }
  public set assetData(value: AssetInformation) { this._assetData = value; }

  public get assetState(): State { return this._state; }
  public set assetState(value: State) {
    this._previousState = this._state;
    this._state = value;
    console.log('------------------------');
    console.log(`Asset No : ${this.assetData.assetId}`);
    console.log(`Previous asset state : ${this._previousState}`);
    console.log(`New asset state : ${this._state}`);
  }

  constructor(data: AssetInformation) {

    this._machine = new StateMachine<State, Trigger>({
      accessor: () => this.assetState,
      mutator: (value) => this.assetState = value
    });

    this._machine.configure(State.New)
      .permit(Trigger.Tested, State.Available)
      .onEntry(this.onEntry.bind(this))
      .onActivate(this.onActivate.bind(this))
      .permit(Trigger.Lost, State.Unavailable)
      .onDeactivate(this.onDeactivate.bind(this))
      .onExit(this.onExit.bind(this));

    this._machine.configure(State.Available)
      .onEntry(this.onEntry.bind(this))
      .onActivate(this.onActivate.bind(this))
      .permit(Trigger.Assigned, State.Allocated)
      .permit(Trigger.Lost, State.Unavailable)
      .onExit(this.onExit.bind(this))
      .onEntryFrom(Trigger.Found, this.processFound.bind(this))
      .onEntryFrom(Trigger.Released, this.pocessDecommission.bind(this))
      .onDeactivate(this.onDeactivate.bind(this));

    this._machine.configure(State.Allocated)
      .onEntry(this.onEntry.bind(this))
      .onEntryFrom(Trigger.Assigned, (_, owner) => this.setOwner(owner))
      .onEntryFrom(Trigger.Transferred, (_, owner) => this.setOwner(owner))
      .onActivate(this.onActivate.bind(this))
      .onExit(this.onExit.bind(this))
      .onDeactivate(this.onDeactivate.bind(this))
      .permitReentry(Trigger.Transferred)
      .permit(Trigger.Released, State.Available)
      .permit(Trigger.RequestRepair, State.UnderMaintenance)
      .permit(Trigger.RequestUpdate, State.UnderMaintenance)
      .permit(Trigger.Lost, State.Unavailable);

    this._machine.configure(State.UnderMaintenance)
      .onEntry(this.onEntry.bind(this))
      .onActivate(this.onActivate.bind(this))
      .onExit(this.onExit.bind(this))
      .onDeactivate(this.onDeactivate.bind(this))
      .permit(Trigger.Repaired, State.Allocated)
      .permit(Trigger.Lost, State.Unavailable)
      .permit(Trigger.Discarded, State.Decommissioned);

    this._machine.configure(State.Unavailable)
      .onEntry(this.onEntry.bind(this))
      .onActivate(this.onActivate.bind(this))
      .onExit(this.onExit.bind(this))
      .onDeactivate(this.onDeactivate.bind(this))
      .permitIf(Trigger.Found, State.Available, () => this._previousState !== State.New)
      .permitIf(Trigger.Found, State.New, () => this._previousState === State.New);

    this._machine.configure(State.Decommissioned)
      .onEntry(this.pocessDecommission.bind(this))
      .onActivate(this.onActivate.bind(this))
      .onExit(this.onExit.bind(this))
      .onDeactivate(this.onDeactivate.bind(this));

    this._assetData = data;
  }

  private setOwner(owner: Person): void {
    this.assetData.owner = owner;
  }

  private pocessDecommission(): void {
    console.log('Clearing owner date...');
    this.assetData.owner = null;
    this.onEntry();
  }

  private processFound(): void {
    if (this.assetData.owner !== null) {
      console.log('Clearing the owner data...');
      this.assetData.owner = null;
    }
  }

  private onEntry(): void {
    console.log(`Entering ${this._state} ...`);
  }

  private onActivate(): void {
    console.log(`Activating ${this._state} ...`);
  }

  private onDeactivate(): void {
    console.log(`Deactivating ${this._state} ...`);
  }

  private onExit(): void {
    console.log(`Exiting ${this._state} ...`);
  }

  public async fire(trigger: Trigger): Promise<any> {
    this._isSuccesful = false;
    try {
      await this._machine.fire(trigger);
      this._isSuccesful = true;
    } catch  {
      console.log('Error during state transition.');
      this._isSuccesful = false;
    }
  }

  public async finishedTesting(): Promise<any> {
    await this.fire(Trigger.Tested);
  }

  public async assign(owner: Person): Promise<any> {
    this._isSuccesful = false;
    try {
      await this._machine.fire(Trigger.Assigned, owner);
      this._isSuccesful = true;
    } catch        {
      console.log('Error during state transition.');
      this._isSuccesful = false;
    }
  }

  public async release(): Promise<any> {
    await this.fire(Trigger.Released);
  }

  public async repaired(): Promise<any> {
    await this.fire(Trigger.Repaired);
  }

  public async requestRepair(): Promise<any> {
    await this.fire(Trigger.RequestRepair);
  }

  public async requestUpdate(): Promise<any> {
    await this.fire(Trigger.RequestUpdate);
  }

  public async transfer(owner: Person): Promise<any> {
    this._isSuccesful = false;
    try {
      await this._machine.fire(Trigger.Transferred, owner);
      this._isSuccesful = true;
    } catch {
      console.log('Error during state transition.');
      this._isSuccesful = false;
    }
  }

  public async lost(): Promise<any> {
    await this.fire(Trigger.Lost);
  }

  public async found(): Promise<any> {
    await this.fire(Trigger.Found);
  }

  public async discard(): Promise<any> {
    await this.fire(Trigger.Discarded);
  }

  public getDOTGraph(): string {
    return UmlDotGraph.format(this._machine.getInfo(), true);
  }

  public get isSuccessful(): boolean {
    return this._isSuccesful;
  }
}
