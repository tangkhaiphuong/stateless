"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/GuardCondition.cs
 */
var GuardCondition = /** @class */ (function () {
    function GuardCondition(_guard, _methodDescription) {
        this._guard = _guard;
        this._methodDescription = _methodDescription;
    }
    Object.defineProperty(GuardCondition.prototype, "guard", {
        get: function () { return this._guard; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuardCondition.prototype, "description", {
        /**
         *  Return the description of the guard method: the caller-defined description if one
         *  was provided, else the name of the method itself
         *
         * @readonly
         * @type {string}
         * @memberof GuardCondition
         */
        get: function () { return this._methodDescription.description; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GuardCondition.prototype, "methodDescription", {
        // 
        /**
         * Return a more complete description of the guard method
         *
         * @readonly
         * @type {InvocationInfo}
         * @memberof GuardCondition
         */
        get: function () { return this._methodDescription; },
        enumerable: true,
        configurable: true
    });
    return GuardCondition;
}());
exports.GuardCondition = GuardCondition;
