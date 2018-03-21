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
const guard_condition_1 = require("./guard-condition");
const invocation_info_1 = require("./reflection/invocation-info");
/**
 * Describes a state transition.
 *
 * @export
 * @class Transition
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitionGuard.cs
 */
class TransitionGuard {
    constructor(...guards) {
        this._conditions = [];
        for (const item of guards) {
            this._conditions.push(new guard_condition_1.GuardCondition(item.guard, invocation_info_1.InvocationInfo.create(item.guard, item.description || null)));
        }
    }
    static get empty() {
        return new TransitionGuard();
    }
    get conditions() { return this._conditions; }
    /**
     * guards is the list of the guard functions for all guard conditions for this transition
     *
     * @readonly
     * @memberof TransitionGuard
     */
    get guards() {
        return this._conditions.map(c => c.guard);
    }
    /**
     * guardConditionsMet is true if all of the guard functions return true or if there are no guard functions
     *
     * @returns {Promise<boolean>}
     * @memberof TransitionGuard
     */
    get guardConditionsMet() {
        const implement = () => __awaiter(this, void 0, void 0, function* () {
            for (const item of this.conditions) {
                if (!item.guard) {
                    return false;
                }
                const result = item.guard();
                if (result instanceof Promise) {
                    const final = yield result;
                    if (final === false) {
                        return false;
                    }
                }
                else if (result === false) {
                    return false;
                }
            }
            return true;
        });
        return implement();
    }
    /**
     *  unmetGuardConditions is a list of the descriptions of all guard conditions whose guard function returns false
     *
     * @returns {(Promise<Array<string | null>>)}
     * @memberof TransitionGuard
     */
    unmetGuardConditions() {
        return __awaiter(this, void 0, void 0, function* () {
            const implement = () => __awaiter(this, void 0, void 0, function* () {
                const result = [];
                for (const item of this.conditions) {
                    if (!item.guard) {
                        continue;
                    }
                    const guard = item.guard();
                    if (guard instanceof Promise) {
                        const final = yield guard;
                        if (final === false) {
                            result.push(item.description);
                        }
                    }
                    else if (guard === false) {
                        result.push(item.description);
                    }
                }
                return result;
            });
            return implement();
        });
    }
}
exports.TransitionGuard = TransitionGuard;

//# sourceMappingURL=transition-guard.js.map
