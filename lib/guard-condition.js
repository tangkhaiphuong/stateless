"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/GuardCondition.cs
 */
class GuardCondition {
    constructor(_guard, _methodDescription) {
        this._guard = _guard;
        this._methodDescription = _methodDescription;
    }
    get guard() { return this._guard; }
    /**
     *  Return the description of the guard method: the caller-defined description if one
     *  was provided, else the name of the method itself
     *
     * @readonly
     * @type {string}
     * @memberof GuardCondition
     */
    get description() { return this._methodDescription.description; }
    // 
    /**
     * Return a more complete description of the guard method
     *
     * @readonly
     * @type {InvocationInfo}
     * @memberof GuardCondition
     */
    get methodDescription() { return this._methodDescription; }
}
exports.GuardCondition = GuardCondition;
//# sourceMappingURL=guard-condition.js.map