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
const trigger_behaviour_1 = require("./trigger-behaviour");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/DynamicTriggerBehaviour.cs
 */
class DynamicTriggerBehaviour extends trigger_behaviour_1.TriggerBehaviour {
    constructor(trigger, _destination, transitionGuard, _transitionInfo) {
        super(trigger, transitionGuard);
        this._destination = _destination;
        this._transitionInfo = _transitionInfo;
    }
    resultsInTransitionFrom(_source, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this._destination(args);
            if (result instanceof Promise) {
                return [true, yield result];
            }
            else {
                return [true, result];
            }
        });
    }
    get transitionInfo() { return this._transitionInfo; }
}
exports.DynamicTriggerBehaviour = DynamicTriggerBehaviour;
