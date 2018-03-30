import { StateMachine } from '../../src';

enum MemberTriggers {
  Suspend = 'Suspend',
  Terminate = 'Terminate',
  Reactivate = 'Reactivate'
}

export enum MembershipState {
  Inactive,
  Active,
  Terminated
}

/**
 * Member class definition.
 * 
 * @export
 * @class Member
 * @link: https://github.com/dotnet-state-machine/stateless/blob/dev/example/JsonExample/Member.cs
 */
export class Member {

  private readonly _stateMachine: StateMachine<MembershipState, MemberTriggers>;

  constructor(private _name: string, state: MembershipState = MembershipState.Active) {
    this._stateMachine = new StateMachine<MembershipState, MemberTriggers>(state);

    this._stateMachine.configure(MembershipState.Active)
      .permit(MemberTriggers.Suspend, MembershipState.Inactive)
      .permit(MemberTriggers.Terminate, MembershipState.Terminated);

    this._stateMachine.configure(MembershipState.Inactive)
      .permit(MemberTriggers.Reactivate, MembershipState.Active)
      .permit(MemberTriggers.Terminate, MembershipState.Terminated);

    this._stateMachine.configure(MembershipState.Terminated)
      .permit(MemberTriggers.Reactivate, MembershipState.Active);
  }

  public get state(): MembershipState { return this._stateMachine.state; }

  public get name(): string { return this._name; }

  public async terminate(): Promise<void> {
    await this._stateMachine.fire(MemberTriggers.Terminate);
  }

  public async suspend(): Promise<void> {
    await this._stateMachine.fire(MemberTriggers.Suspend);
  }

  public async reactivate(): Promise<void> {
    await this._stateMachine.fire(MemberTriggers.Reactivate);
  }

  public toJson(): string { return JSON.stringify({ state: this.state, name: this.name }); }

  public static fromJson(jsonString: string): Member {
    const { state, name } = JSON.parse(jsonString) as { state: MembershipState, name: string };
    return new Member(name, state);
  }

  public equals(anotherMember: Member): boolean {
    return ((this.state === anotherMember.state) && (this.name === anotherMember.name));
  }

}
