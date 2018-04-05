/**
 * @link: https://github.com/dotnet-state-machine/stateless/issues/241
 */

import { State } from './state';
import { StateMachine, Transition } from '../../src';

export enum Trigger { Fork = 'Fork', A = 'A', B = 'B', End = 'End' }
export enum SubState { Initial = 'Initial', Done = 'Done' }

export class ForkState extends State {

  private readonly _subStateMachineOne: StateMachine<SubState, Trigger>;
  private readonly _subStateMachineTwo: StateMachine<SubState, Trigger>;

   constructor(name: string) {
    super(name);

    this._subStateMachineOne = new StateMachine<SubState, Trigger>(SubState.Initial);
    this._subStateMachineOne.configure(SubState.Initial)
      .permit(Trigger.A, SubState.Done);

    this._subStateMachineTwo = new StateMachine<SubState, Trigger>(SubState.Initial);
    this._subStateMachineTwo.configure(SubState.Initial)
      .permit(Trigger.B, SubState.Done);

    // Ignore unhandled triggers
    this._subStateMachineOne.onUnhandledTrigger((s, t) => { });
    this._subStateMachineTwo.onUnhandledTrigger((s, t) => { });

    this._subStateMachineOne.onTransitioned(this.displayProgressOne.bind(this));
    this._subStateMachineTwo.onTransitioned(this.displayProgressTwo.bind(this));
  }

  private displayProgressOne(obj: Transition<SubState, Trigger>): void {
    console.log(`Internal state machine ONE transitioned from ${obj.source} to ${obj.destination}`);
  }

  private displayProgressTwo(obj: Transition<SubState, Trigger>): void {
    console.log(`Internal state machine TWO transitioned from ${obj.source} to ${obj.destination}`);
  }

  public get name(): string {
    return `${super.name}: ${this._subStateMachineOne.state} + ${this._subStateMachineTwo.state}`;
  }

  public async fire(trigger: Trigger): Promise<any> {
    console.log(`ForkState firing internally trigger ${trigger}`);
    await this._subStateMachineOne.fire(trigger);
    await this._subStateMachineTwo.fire(trigger);
  }

  public endGuard(): boolean {
    return (this._subStateMachineOne.state === SubState.Done && this._subStateMachineTwo.state === SubState.Done);
  }
}
