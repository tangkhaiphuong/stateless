export declare type Timing = 'Synchronous' | 'Asynchronous';
/**
 *  Describes a method - either an action (activate, deactivate, etc.) or a transition guard
 *
 * @export
 * @class InvocationInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/InvocationInfo.cs
 */
export declare class InvocationInfo {
    private readonly _methodName;
    private readonly _description;
    private readonly _timing;
    static create(method: ((...args: any[]) => any), description: string | null, timing?: Timing): InvocationInfo;
    /**
     * Creates an instance of InvocationInfo.
     * @param {string} _methodName
     * @param {string} _description
     * @param {Timing} _timing
     * @memberof InvocationInfo
     */
    constructor(_methodName: string, _description: string | null, _timing: Timing);
    /**
     * The name of the invoked method.  If the method is a lambda or delegate, the name will be a compiler-generated
     * name that is often not human-friendly (e.g. "(.ctor)b__2_0" except with angle brackets instead of parentheses)
     *
     * @readonly
     * @memberof InvocationInfo
     */
    readonly methodName: string;
    /**
     * Text returned for compiler - generated functions where the caller has not specified a description.
     *
     * @readonly
     * @static
     * @type {string}
     * @memberof InvocationInfo
     */
    static readonly defaultFunctionDescription: string;
    /**
     * A description of the invoked method.  Returns:
     * 1) The user-specified description, if any
     * 2) else if the method name is compiler-generated, returns DefaultFunctionDescription
     * 3) else the method name
     *
     * @readonly
     * @type {string}
     * @memberof InvocationInfo
     */
    readonly description: string;
    /**
     * Returns true if the method is invoked asynchronously.
     *
     * @readonly
     * @type {boolean}
     * @memberof InvocationInfo
     */
    readonly isAsync: boolean;
}
