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
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/UnhandledTriggerAction.cs
 */
class UnhandledTriggerAction {
    constructor(_action) {
        this._action = _action;
    }
    execute(state, trigger, unmetGuards) {
        return __awaiter(this, void 0, void 0, function* () {
            const reuslt = this._action(state, trigger, unmetGuards);
            if (reuslt instanceof Promise) {
                yield reuslt;
            }
        });
    }
}
exports.UnhandledTriggerAction = UnhandledTriggerAction;
