import { InvocationInfo } from './reflection/invocation-info';
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/GuardCondition.cs
 */
export declare class GuardCondition {
    private readonly _guard;
    private readonly _methodDescription;
    constructor(_guard: ((args: any[]) => boolean | Promise<boolean>), _methodDescription: InvocationInfo);
    readonly guard: ((args: any[]) => boolean | Promise<boolean>);
    /**
     *  Return the description of the guard method: the caller-defined description if one
     *  was provided, else the name of the method itself
     *
     * @readonly
     * @type {string}
     * @memberof GuardCondition
     */
    readonly description: string;
    /**
     * Return a more complete description of the guard method
     *
     * @readonly
     * @type {InvocationInfo}
     * @memberof GuardCondition
     */
    readonly methodDescription: InvocationInfo;
}
