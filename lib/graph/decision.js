"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
/**
 * Used to keep track of the decision point of a dynamic transition
 *
 * @export
 * @class Decision
 * @extends {State}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Graph/Decision.cs
 */
class Decision extends state_1.State {
    constructor(_method, num) {
        super('Decision' + num);
        this._method = _method;
    }
    get method() { return this._method; }
}
exports.Decision = Decision;
//# sourceMappingURL=decision.js.map