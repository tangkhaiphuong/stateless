"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Information on entry and exit actions
 *
 * @export
 * @class ActionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/ActionInfo.cs
 */
class ActionInfo {
    /**
     * Creates an instance of ActionInfo.
     * @param {InvocationInfo} _method
     * @param {string} _fromTrigger
     * @memberof ActionInfo
     */
    constructor(_method, _fromTrigger = null) {
        this._method = _method;
        this._fromTrigger = _fromTrigger;
    }
    static create(entryAction) {
        return new ActionInfo(entryAction.description, entryAction.trigger && `${entryAction.trigger}`);
    }
    /**
     * The method invoked during the action (entry or exit)
     *
     * @readonly
     * @type {InvocationInfo}
     * @memberof ActionInfo
     */
    get method() { return this._method; }
    /**
     * If non-null, specifies the "from" trigger that must be present for this method to be invoked
     *
     * @readonly
     * @type {string}
     * @memberof ActionInfo
     */
    get fromTrigger() { return this._fromTrigger; }
}
exports.ActionInfo = ActionInfo;
//# sourceMappingURL=action-info.js.map