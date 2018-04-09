import { StateMachine } from '../../src/context/state-machine';
import { UmlDotGraph } from '../../src/graph/uml-dot-graph';
import { StateContext } from '../../src/state-context';
import { State } from './state';
import { Trigger } from './trigget';

/**
 * Http request simulation base on W3c State machine: https://www.w3.org/Library/User/Architecture/HTTPFeatures.html
 * 
 * @export
 * @class HttpRequest
 * @link https://www.w3.org/Library/User/Architecture/HTTPFeatures.html
 */
export class HttpRequest {

  private _state: State = State.Begin;

  public static readonly Machine = new StateMachine<State, Trigger, HttpRequest>();
  public static initialize() {

    this.Machine.configure(State.Begin)
      .permitIf(Trigger.Ok, State.NeedConnection, [
        { guard: (c) => !c._socketFd, description: 'Socket description must empty.' },
        { guard: (c) => !c._isConnected, description: 'Not connect to remote.' }])
      // Actions
      .onEntry(c => c.reset())
      // Logging
      .onExit((c, t) => console.log(`1. ${t.source} --> ${t.destination}`), 'logging');

    this.Machine.configure(State.NeedConnection)
      .permitIf(Trigger.Ok, State.NeedRequest, (httpRequest): boolean => !!httpRequest._socketFd)
      .permitIf(Trigger.Error, State.Error, (httpRequest): boolean => !httpRequest._socketFd)
      // Actions
      .onEntry(c => c.createSocket()) // Creating socket file descriptor.
      // Logging
      .onExit((c, t) => console.log(`2. ${t.source} --> ${t.destination}`), 'logging');

    this.Machine.configure(State.NeedRequest)
      .permitIf(Trigger.Ok, State.SendRequest, (c): boolean => !!c._isConnected)
      .permitIf(Trigger.Error, State.Error, (c): boolean => !c._isConnected)
      // Actions
      .onEntry(c => c.connect())// Connecting to server.
      // Logging
      .onExit((c, t) => console.log(`3. ${t.source} --> ${t.destination}`), 'logging');

    this.Machine.configure(State.SendRequest)
      .permitIf(Trigger.Error, State.Error, (c): boolean => !c._statusCode)
      .permitIf(Trigger.Code401, State.NeedAccessAuth, (c): boolean => c._statusCode === 401)
      .permitIf(Trigger.Code301, State.Redirection, (c): boolean => c._statusCode === 301)
      .permitIf(Trigger.Code302, State.Redirection, (c): boolean => c._statusCode === 302)
      .permitIf(Trigger.Code204, State.NoData, (c): boolean => c._statusCode === 204)
      .permitIf(Trigger.Code304, State.NoData, (c): boolean => c._statusCode === 304)
      .permitIf(Trigger.Code200, State.NeedBody, (c): boolean => c._statusCode === 200)
      .permitIf(Trigger.Code203, State.NeedBody, (c): boolean => c._statusCode === 203)
      // Actions
      .onEntry(c => c.sendRequest()) // Sending request.
      // Logging
      .onExit((c, t) => console.log(`4. ${t.source} --> ${t.destination}`), 'logging');

    this.Machine.configure(State.NeedBody)
      .permitIf(Trigger.Ok, State.GotData, (c) => !!c._payload)
      .permitIf(Trigger.Error, State.Error, (c) => !c._payload)
      // Actions
      .onEntry(c => c.processResponse()) // Processing response.
      // Logging
      .onExit((c, t) => console.log(`5. ${t.source} --> ${t.destination}`), 'logging');

    this.Machine.configure(State.NeedAccessAuth)
      .permitIf(Trigger.Ok, State.NeedConnection, (c) => !!c._authenication)
      .permitIf(Trigger.Error, State.Error, (c) => !c._authenication)
      // Actions
      .onEntry(c => c.reset())
      .onEntry(c => c.requestAuthentication()) // Request authentication.
      // Logging
      .onExit((c, t) => console.log(`6. ${t.source} --> ${t.destination}`), 'logging');
  }

  private _socketFd?: number;
  private _isConnected?: boolean;
  private _statusCode?: number;
  private _payload?: string;
  private _authenication?: string;
  private readonly _machine: StateContext<State, Trigger>;

  constructor(private readonly _url: string) {
    this._machine = HttpRequest.Machine.createStateContext(this, {
      accessor: (c) => c._state,
      mutator: (c, s) => c._state = s
    });
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
HttpRequest.initialize();
