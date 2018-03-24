import { StateMachine } from '../../src';
import { UmlDotGraph } from '../../src/graph/uml-dot-graph';

enum Trigger {
  CallDialed = 'CallDialed',
  CallConnected = 'CallConnected',
  LeftMessage = 'LeftMessage',
  PlacedOnHold = 'PlacedOnHold',
  TakenOffHold = 'TakenOffHold',
  PhoneHurledAgainstWall = 'PhoneHurledAgainstWall',
  MuteMicrophone = 'MuteMicrophone',
  UnmuteMicrophone = 'UnmuteMicrophone',
  SetVolume = 'SetVolume'
}

enum State {
  OffHook = 'OffHook',
  Ringing = 'Ringing',
  Connected = 'Connected ',
  OnHold = 'OnHold',
  PhoneDestroyed = 'PhoneDestroyed'
}

export class PhoneCall {

  private _state: State = State.OffHook;
  private _machine: StateMachine<State, Trigger>;
  private _caller: string;
  private _callee: string | undefined;

  constructor(caller: string) {
    this._caller = caller;
    this._machine = new StateMachine<State, Trigger>({
      accessor: () => this._state,
      mutator: s => this._state = s
    });

    this._machine.configure(State.OffHook)
      .permit(Trigger.CallDialed, State.Ringing);

    this._machine.configure(State.Ringing)
      .onEntryFrom(Trigger.CallDialed, (_, callee: string) => this.onDialed(callee), 'Caller number to call')
      .permit(Trigger.CallConnected, State.Connected);

    this._machine.configure(State.Connected)
      .onEntry(this.startCallTimer.bind(this))
      .onExit(this.stopCallTimer.bind(this))
      .internalTransition(Trigger.MuteMicrophone, t => this.onMute())
      .internalTransition(Trigger.UnmuteMicrophone, t => this.onUnmute())
      .internalTransition(Trigger.SetVolume, (t, volume) => this.onSetVolume(volume))
      .permit(Trigger.LeftMessage, State.OffHook)
      .permit(Trigger.PlacedOnHold, State.OnHold);

    this._machine.configure(State.OnHold)
      .substateOf(State.Connected)
      .permit(Trigger.TakenOffHold, State.Connected)
      .permit(Trigger.PhoneHurledAgainstWall, State.PhoneDestroyed);
  }

  private onSetVolume(volume: number) {
    console.log('Volume set to ' + volume + '!');
  }

  private onUnmute() {
    console.log('Microphone unmuted!');
  }

  private onMute() {
    console.log('Microphone muted!');
  }

  private onDialed(callee: string) {
    this._callee = callee;
    console.log(`[Phone Call] placed for : [${this._callee}]`);
  }

  private startCallTimer() {
    console.log(`[Timer:] Call started at ${new Date()}`, );
  }

  private stopCallTimer() {
    console.log(`[Timer:] Call ended at ${new Date()}`);
  }

  public async mute(): Promise<void> {
    await this._machine.fire(Trigger.MuteMicrophone);
  }

  public async unmute(): Promise<void> {
    await this._machine.fire(Trigger.UnmuteMicrophone);
  }

  public async setVolume(volume: number): Promise<void> {
    await this._machine.fire(Trigger.SetVolume, volume);
  }

  public async print() {
    console.log(`[${this._caller}] placed call and [Status:] ${await this._machine.toString()}`);
  }

  public async dialed(callee: string): Promise<void> {
    await this._machine.fire(Trigger.CallDialed, callee);
  }

  public async connected(): Promise<void> {
    await this._machine.fire(Trigger.CallConnected);
  }

  public async hold(): Promise<void> {
    await this._machine.fire(Trigger.PlacedOnHold);
  }

  public async resume(): Promise<void> {
    await this._machine.fire(Trigger.TakenOffHold);
  }

  public toDotGraph(): string {
    return UmlDotGraph.format(this._machine.getInfo('State', 'Trigger'));
  }
}
