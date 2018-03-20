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
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/EntryActionBehaviour.cs
 */
class EntryActionBehaviour {
    /**
     * Creates an instance of EntryActionBehaviour.
     * @param {(((transition: Transition<TState, TTrigger>, args: any[]) => void | Promise<void>))} _action
     * @param {InvocationInfo} _desscription
     * @param {TTrigger} [_trigger]
     * @memberof EntryActionBehaviour
     */
    constructor(_action, _desscription, _trigger) {
        this._action = _action;
        this._desscription = _desscription;
        this._trigger = _trigger;
    }
    execute(transition, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!this._trigger) {
                if (transition.trigger !== this._trigger) {
                    return;
                }
            }
            const result = this._action(transition, args);
            if (result instanceof Promise) {
                yield result;
            }
        });
    }
    get trigger() { return this._trigger; }
    get description() { return this._desscription; }
}
exports.EntryActionBehaviour = EntryActionBehaviour;

//# sourceMappingURL=entry-action-behaviour.js.map
