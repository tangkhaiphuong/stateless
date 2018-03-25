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
    static create(method: ((...args: any[]) => any), description: string | null): InvocationInfo;
    /**
     * Creates an instance of InvocationInfo.
     * @param {string} _methodName
     * @param {(string | null)} _description
     * @memberof InvocationInfo
     */
    constructor(_methodName: string, _description: string | null);
    /**
     * The name of the invoked method.  If the method is a lambda or delegate, the name will be a compiler-generated
     * name that is often not human-friendly (e.g. "(.ctor)b__2_0" except with angle brackets instead of parentheses)
     *
     * @readonly
     * @memberof InvocationInfo
     */
    readonly methodName: string;
    /**
     * A description of the invoked method.  Returns:
     * 1) The user-specified description, if any
     * 2) else if the method name is compiler-generated, returns defaultFunctionDescription
     * 3) else the method name
     *
     * @readonly
     * @type {string}
     * @memberof InvocationInfo
     */
    readonly description: string;
}
