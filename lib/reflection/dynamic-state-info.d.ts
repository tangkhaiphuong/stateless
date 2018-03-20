/**
 * Defines dynamic state information.
 *
 * @export
 * @class DynamicStateInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/DynamicTransitionInfo.cs
 */
export declare class DynamicStateInfo {
    private readonly _destinationState;
    private readonly _criterion;
    /**
     * Creates an instance of DynamicStateInfo.
     * @param {string} _destinationState
     * @param {string} _criterion
     * @memberof DynamicStateInfo
     */
    constructor(_destinationState: string, _criterion: string);
    /**
     * The name of the destination state.
     *
     * @readonly
     * @type {string}
     * @memberof DynamicStateInfo
     */
    readonly destinationState: string;
    /**
     * The reason this destination state was chosen
     *
     * @readonly
     * @type {string}
     * @memberof DynamicStateInfo
     */
    readonly criterion: string;
}
