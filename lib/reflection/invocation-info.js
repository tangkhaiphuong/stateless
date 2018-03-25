"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  Describes a method - either an action (activate, deactivate, etc.) or a transition guard
 *
 * @export
 * @class InvocationInfo
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/InvocationInfo.cs
 */
var InvocationInfo = /** @class */ (function () {
    /**
     * Creates an instance of InvocationInfo.
     * @param {string} _methodName
     * @param {(string | null)} _description
     * @memberof InvocationInfo
     */
    function InvocationInfo(_methodName, _description) {
        this._methodName = _methodName;
        this._description = _description;
        // description can be null if user didn't specify a description
    }
    InvocationInfo.create = function (method, description) {
        var nameParts = method.name.split(' ');
        var methodName = nameParts[nameParts.length - 1] || method.toString();
        return new InvocationInfo(methodName === 'function () { [native code] }' ? '[Function]' : methodName, description);
    };
    Object.defineProperty(InvocationInfo.prototype, "methodName", {
        /**
         * The name of the invoked method.  If the method is a lambda or delegate, the name will be a compiler-generated
         * name that is often not human-friendly (e.g. "(.ctor)b__2_0" except with angle brackets instead of parentheses)
         *
         * @readonly
         * @memberof InvocationInfo
         */
        get: function () { return this._methodName; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationInfo.prototype, "description", {
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
        get: function () {
            if (!!this._description) {
                return this._description;
            }
            return this.methodName || '<null>';
        },
        enumerable: true,
        configurable: true
    });
    return InvocationInfo;
}());
exports.InvocationInfo = InvocationInfo;
