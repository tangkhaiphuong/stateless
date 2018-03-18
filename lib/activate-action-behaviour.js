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
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/ActivateActionBehaviour.cs
 */
class ActivateActionBehaviour {
    /**
     * Creates an instance of ActivateActionBehaviour.
     * @param {TState} _state
     * @param {(() => void | Promise<void>)} _action
     * @param {InvocationInfo} _description
     * @memberof ActivateActionBehaviour
     */
    constructor(_state, _action, _description) {
        this._state = _state;
        this._action = _action;
        this._description = _description;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this._action();
            if (result instanceof Promise) {
                yield result;
            }
        });
    }
    get description() { return this._description; }
    get state() { return this._state; }
}
exports.ActivateActionBehaviour = ActivateActionBehaviour;
