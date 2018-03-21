import { StateMachine } from '../../src';

enum Trigger {
  Ok = 'Ok',
  Error = 'Error',
  Code301 = 'Code301',
  Code302 = 'Code302',
  Code204 = 'Code204',
  Code304 = 'Code304',
  Code200 = 'Code200',
  Code203 = 'Code203',
  Code401 = 'Code401'
}

export enum State {
  Begin = 'Begin',
  NeedConnection = 'NeedConnection',
  NeedRequest = 'NeedRequest ',
  SendRequest = 'SendRequest',
  NeedAccessAuth = 'NeedAccessAuth',
  NeedBody = 'NeedBody',
  Error = 'Error',
  Redirection = 'Redirection',
  NoData = 'NoData',
  GotData = 'GotData'
}

/**
 * Http request simulation.
 * 
 * @export
 * @class HttpRequest
 * @link https://www.w3.org/Library/User/Architecture/HTTPFeatures.html
 */
export class HttpRequest {

  private _state: State = State.Begin;

  private _machine: StateMachine<State, Trigger> = new StateMachine<State, Trigger>({
    accessor: () => this._state,
    mutator: s => this._state = s
  });

  private _triggers: Array<{ trigger: Trigger, args?: any[] }> = [{ trigger: Trigger.Ok }];

  private _socketFd?: number;
  private _isConnected?: boolean;
  private _statusCode?: number;
  private _payload?: string;
  private _authenication?: string;

  constructor(private readonly _url: string) {

    this._machine.configure(State.Begin)
      .permitIf(Trigger.Ok, State.NeedConnection, () => !this._isConnected)
      // Actions
      .onEntry(this.reset.bind(this))
      // Move next triggers.
      .onDeactivate(() => this._triggers.push({ trigger: Trigger.Ok }))
      .onExit((t) => console.log(`1. ${t.source} --> ${t.destination}`));

    this._machine.configure(State.NeedConnection)
      .permitIf(Trigger.Ok, State.NeedRequest, (): boolean => !!this._socketFd)
      .permitIf(Trigger.Error, State.Error, (): boolean => !this._socketFd)
      // Actions
      .onEntry(this.createSocket.bind(this)) // Creating socket file descriptor.
      // Move next triggers.
      .onDeactivate(() => this._triggers.push({ trigger: Trigger.Ok }))
      .onDeactivate(() => this._triggers.push({ trigger: Trigger.Error }))// Move next.
      .onExit((t) => console.log(`2. ${t.source} --> ${t.destination}`));

    this._machine.configure(State.NeedRequest)
      .permitIf(Trigger.Ok, State.SendRequest, (): boolean => !!this._isConnected)
      .permitIf(Trigger.Error, State.Error, (): boolean => !this._isConnected)
      // Actions
      .onEntry(this.connect.bind(this))// Connecting to server.
      // Move next triggers.
      .onDeactivate(() => this._triggers.push({ trigger: Trigger.Ok }))
      .onDeactivate(() => this._triggers.push({ trigger: Trigger.Error }))
      .onExit((t) => console.log(`3. ${t.source} --> ${t.destination}`));

    this._machine.configure(State.SendRequest)
      .permitIf(Trigger.Error, State.Error, (): boolean => !this._statusCode)
      .permitIf(Trigger.Code401, State.NeedAccessAuth, (): boolean => this._statusCode === 401)
      .permitIf(Trigger.Code301, State.Redirection, (): boolean => this._statusCode === 301)
      .permitIf(Trigger.Code302, State.Redirection, (): boolean => this._statusCode === 302)
      .permitIf(Trigger.Code204, State.NoData, (): boolean => this._statusCode === 204)
      .permitIf(Trigger.Code304, State.NoData, (): boolean => this._statusCode === 304)
      .permitIf(Trigger.Code200, State.NeedBody, (): boolean => this._statusCode === 200)
      .permitIf(Trigger.Code203, State.NeedBody, (): boolean => this._statusCode === 203)
      // Actions
      .onEntry(this.sendRequest.bind(this)) // Sending request.
      // Move next triggers
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code401 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code301 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code302 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code204 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code304 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code200 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Code203 }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Error }))
      .onExit((t) => console.log(`4. ${t.source} --> ${t.destination}`));

    this._machine.configure(State.NeedBody)
      .permitIf(Trigger.Ok, State.GotData, () => !!this._payload)
      .permitIf(Trigger.Error, State.Error, () => !this._payload)
      // Actions
      .onEntry(this.processResponse.bind(this)) // Processing response.
      // Move next triggers.
      .onEntry(() => this._triggers.push({ trigger: Trigger.Ok }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Error }))
      .onExit((t) => console.log(`5. ${t.source} --> ${t.destination}`));

    this._machine.configure(State.NeedAccessAuth)
      .permitIf(Trigger.Ok, State.NeedConnection, () => !!this._authenication)
      .permitIf(Trigger.Error, State.Error, () => !this._authenication)
      // Actions
      .onEntry(this.requestAuthentication.bind(this)) // Request authentication.
      // Move next triggers.
      .onEntry(() => this._triggers.push({ trigger: Trigger.Ok }))
      .onEntry(() => this._triggers.push({ trigger: Trigger.Error }))
      .onExit((t) => console.log(`6. ${t.source} --> ${t.destination}`));
  }

  /**
   * Get current state.
   * 
   * @returns {State} 
   * @memberof HttpRequest
   */
  public get state(): State { return this._state; }

  /**
   * Sending request.
   * 
   * @returns {Promise<void>} 
   * @memberof HttpRequest
   */
  public async send(): Promise<string> {
    await this._machine.activate();
    for (let item = this._triggers.shift();
      !!item;
      item = this._triggers.shift()) {
      if (await this._machine.canFire(item.trigger)) {
        console.log(`Fire: ${item.trigger}`);
        await this._machine.fire(item.trigger, item.args);
      }
    }
    if (this.state === 'Error') {
      throw new Error('Got error');
    } else {
      return this._payload!;
    }
  }

  public toDotGraph(): string {
    // return UmlDotGraph.Format(_machine.GetInfo());
    return 'Method not implemented.';
  }

  private reset(): void {
    console.log(`${this.reset.name}: reset!!!`);
    this._socketFd = undefined;
    this._isConnected = undefined;
    this._statusCode = undefined;
    this._payload = undefined;
    this._authenication = undefined;
  }

  private createSocket(): Promise<void> {

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this._socketFd = Math.floor(Math.random() * 100);
        console.log(`${this.createSocket.name}: socket = ${this._socketFd}`);
        resolve();
      }, 1000);
    });
  }

  private connect(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this._isConnected = true;
        console.log(`${this.createSocket.name}: connected!!!`);
        resolve();
      }, 1000);
    });
  }

  private sendRequest(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this._statusCode = 200;
        console.log(`${this.createSocket.name}: status-code = ${this._statusCode}`);
        resolve();
      }, 1000);
    });
  }

  private processResponse(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this._payload = 'Hello World';
        console.log(`${this.createSocket.name}: payload = ${this._payload}`);
        resolve();
      }, 1000);
    });
  }

  private requestAuthentication(): Promise<void> {
    return new Promise<void>((resolve) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this._authenication = 'Authentication weRfW1HHJPcaH95kHB0Ylvk5uEwixWAJ';
          console.log(`${this.createSocket.name}: authentication-token = ${this._authenication}`);
          resolve();
        }, 1000);
      });
    });
  }
}
