/**
 * @link: https://github.com/dotnet-state-machine/stateless/issues/241
 */

export class State {

  constructor(protected readonly _name: string) {
  }

  public get name(): string {
    return this._name;
  }

  public onEntry(): void {
    console.log(`Entering state ${this.name}`);
  }

  public onExit(): void {
    console.log(`Exiting state ${this.name}`);
  }

  public toString() { return this._name; }

}
