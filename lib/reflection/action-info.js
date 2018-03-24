"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Information on entry and exit actions
 *
 * @export
 * @class ActionInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/ActionInfo.cs
 */
var ActionInfo = /** @class */ (function () {
    /**
     * Creates an instance of ActionInfo.
     * @param {InvocationInfo} _method
     * @param {string} _fromTrigger
     * @memberof ActionInfo
     */
    function ActionInfo(_method, _fromTrigger) {
        if (_fromTrigger === void 0) { _fromTrigger = null; }
        this._method = _method;
        this._fromTrigger = _fromTrigger;
    }
    ActionInfo.create = function (entryAction) {
        return new ActionInfo(entryAction.description, entryAction.trigger && "" + entryAction.trigger);
    };
    Object.defineProperty(ActionInfo.prototype, "method", {
        /**
         * The method invoked during the action (entry or exit)
         *
         * @readonly
         * @type {InvocationInfo}
         * @memberof ActionInfo
         */
        get: function () { return this._method; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActionInfo.prototype, "fromTrigger", {
        /**
         * If non-null, specifies the "from" trigger that must be present for this method to be invoked
         *
         * @readonly
         * @type {string}
         * @memberof ActionInfo
         */
        get: function () { return this._fromTrigger; },
        enumerable: true,
        configurable: true
    });
    return ActionInfo;
}());
exports.ActionInfo = ActionInfo;
