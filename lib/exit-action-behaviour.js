"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Since I implement both sync/async with Promise so we don't need implement Sync/Async for this case.
 *
 * @export
 * @class UnhandledTriggerAction
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/ExitActionBehavior.cs
 */
class ExitActionBehaviour {
    /**
     * Creates an instance of ExitActionBehaviour.
     * @param {(((transition: Transition<TState, TTrigger>) => any | Promise<any>))} _action
     * @param {InvocationInfo} _description
     * @memberof ExitActionBehaviour
     */
    constructor(_action, _description) {
        this._action = _action;
        this._description = _description;
    }
    execute(transition) {
        return __awaiter(this, void 0, void 0, function* () {
            const reuslt = this._action(transition);
            if (reuslt instanceof Promise) {
                yield reuslt;
            }
        });
    }
    get description() { return this._description; }
}
exports.ExitActionBehaviour = ExitActionBehaviour;
//# sourceMappingURL=exit-action-behaviour.js.map