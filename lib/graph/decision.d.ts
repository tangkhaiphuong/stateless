import { State } from './state';
import { InvocationInfo } from '../reflection/invocation-info';
/**
 * Used to keep track of the decision point of a dynamic transition
 *
 * @export
 * @class Decision
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Decision.cs
 */
export declare class Decision extends State {
    private _method;
    readonly method: InvocationInfo;
    constructor(_method: InvocationInfo, num: number);
}
