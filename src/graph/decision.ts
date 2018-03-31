import { State } from './state';
import { InvocationInfo } from '../reflection/invocation-info';

/**
 * Used to keep track of the decision point of a dynamic transition
 * 
 * @export
 * @class Decision
 * @extends {State}
 * @template TState
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Decision.cs
 */

export class Decision<TState> extends State<TState> {

  public get method(): InvocationInfo { return this._method; }

  constructor(private _method: InvocationInfo, num: number) {
    super('Decision' + num);
  }
}
