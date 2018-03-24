import { StateMachine } from '../../src';
import { UmlDotGraph } from '../../src/graph/uml-dot-graph';

const enum Trigger {
  Ok = 'OK',
  Error = 'ERROR/FAULT',
  Code301 = '301',
  Code302 = '302',
  Code204 = '204',
  Code304 = '304',
  Code200 = '200',
  Code203 = '203',
  Code401 = '401'
}

export const enum State {
  Begin = 'BEGIN',
  NeedConnection = 'NEED CONNECTION',
  NeedRequest = 'NEED REQUEST ',
  SendRequest = 'SEND REQUEST',
  NeedAccessAuth = 'NEED ACCESS AUTH',
  NeedBody = 'NEED BODY',
  Error = 'ERROR',
  Redirection = 'REDIRECTION',
  NoData = 'NO DATA',
  GotData = 'GOT DATA'
}

/**
 * Http request simulation base on W3c State machine: https://www.w3.org/Library/User/Architecture/HTTPFeatures.html
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

  private _socketFd?: number;
  private _isConnected?: boolean;
  private _statusCode?: number;
  private _payload?: string;
  private _authenication?: string;

  constructor(private readonly _url: string) {

    this._machine.configure(State.Begin)
      .permitIf(Trigger.Ok, State.NeedConnection, [
        { guard: () => !this._socketFd, description: 'Socket description must empty.' },
        { guard: () => !this._isConnected, description: 'Not connect to remote.' }])
      // Actions
      .onEntry(this.reset.bind(this))
      // Logging
      .onExit((t) => console.log(`1. ${t.source} --> ${t.destination}`), 'logging');

    this._machine.configure(State.NeedConnection)
      .permitIf(Trigger.Ok, State.NeedRequest, (): boolean => !!this._socketFd)
      .permitIf(Trigger.Error, State.Error, (): boolean => !this._socketFd)
      // Actions
      .onEntry(this.createSocket.bind(this)) // Creating socket file descriptor.
      // Logging
      .onExit((t) => console.log(`2. ${t.source} --> ${t.destination}`), 'logging');

    this._machine.configure(State.NeedRequest)
      .permitIf(Trigger.Ok, State.SendRequest, (): boolean => !!this._isConnected)
      .permitIf(Trigger.Error, State.Error, (): boolean => !this._isConnected)
      // Actions
      .onEntry(this.connect.bind(this))// Connecting to server.
      // Logging
      .onExit((t) => console.log(`3. ${t.source} --> ${t.destination}`), 'logging');

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
      // Logging
      .onExit((t) => console.log(`4. ${t.source} --> ${t.destination}`), 'logging');

    this._machine.configure(State.NeedBody)
      .permitIf(Trigger.Ok, State.GotData, () => !!this._payload)
      .permitIf(Trigger.Error, State.Error, () => !this._payload)
      // Actions
      .onEntry(this.processResponse.bind(this)) // Processing response.
      // Logging
      .onExit((t) => console.log(`5. ${t.source} --> ${t.destination}`), 'logging');

    this._machine.configure(State.NeedAccessAuth)
      .permitIf(Trigger.Ok, State.NeedConnection, () => !!this._authenication)
      .permitIf(Trigger.Error, State.Error, () => !this._authenication)
      // Actions
      .onEntry(this.reset.bind(this))
      .onEntry(this.requestAuthentication.bind(this)) // Request authentication.
      // Logging
      .onExit((t) => console.log(`6. ${t.source} --> ${t.destination}`), 'logging');
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

    do {
      const triggers = await this._machine.permittedTriggers;
      if (triggers.length === 0) { break; }
      for (const item of triggers) {
        await this._machine.fire(item);
      }
    } while (true);

    if (this.state === State.Error) {
      throw new Error('Got error');
    } else {
      return this._payload!;
    }
  }

  public toDotGraph(): string {
    return UmlDotGraph.format(this._machine.getInfo());
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
        console.log(`${this.connect.name}: connected!!!`);
        resolve();
      }, 1000);
    });
  }

  private sendRequest(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!!this._authenication) {
          this._statusCode = 200;
        } else {
          this._statusCode = 401;
        }
        console.log(`${this.sendRequest.name}: status-code = ${this._statusCode}`);
        resolve();
      }, 1000);
    });
  }

  private processResponse(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this._payload = 'Hello World';
        console.log(`${this.processResponse.name}: payload = ${this._payload}`);
        resolve();
      }, 1000);
    });
  }

  private requestAuthentication(): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this._authenication = 'Authentication weRfW1HHJPcaH95kHB0Ylvk5uEwixWAJ';
        console.log(`${this.requestAuthentication.name}: authentication-token = ${this._authenication}`);
        resolve();
      }, 1000);
    });
  }
}
