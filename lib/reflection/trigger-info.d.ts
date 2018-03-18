/**
 * Represents a trigger in a statemachine.
 *
 * @export
 * @class TriggerInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/TriggerInfo.cs
 */
export declare class TriggerInfo {
    private _underlyingTrigger;
    /**
     * Creates an instance of TriggerInfo.
     * @param {any} _underlyingTrigger
     * @memberof TriggerInfo
     */
    constructor(_underlyingTrigger: any);
    /**
     * The instance or value this trigger represents.
     *
     * @readonly
     * @type {*}
     * @memberof TriggerInfo
     */
    readonly underlyingTrigger: any;
    /**
     * Describes the trigger.
     *
     * @memberof TriggerInfo
     */
    toString(): string;
}
