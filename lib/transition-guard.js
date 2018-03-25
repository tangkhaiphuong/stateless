"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var guard_condition_1 = require("./guard-condition");
var invocation_info_1 = require("./reflection/invocation-info");
/**
 * Describes a state transition.
 *
 * @export
 * @class Transition
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/TransitionGuard.cs
 */
var TransitionGuard = /** @class */ (function () {
    function TransitionGuard() {
        var guards = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            guards[_i] = arguments[_i];
        }
        this._conditions = [];
        try {
            for (var guards_1 = __values(guards), guards_1_1 = guards_1.next(); !guards_1_1.done; guards_1_1 = guards_1.next()) {
                var item = guards_1_1.value;
                if (item instanceof Function) {
                    this._conditions.push(new guard_condition_1.GuardCondition(item, invocation_info_1.InvocationInfo.create(item, null)));
                }
                else {
                    this._conditions.push(new guard_condition_1.GuardCondition(item.guard, invocation_info_1.InvocationInfo.create(item.guard, item.description || null)));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (guards_1_1 && !guards_1_1.done && (_a = guards_1.return)) _a.call(guards_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var e_1, _a;
    }
    Object.defineProperty(TransitionGuard, "empty", {
        get: function () {
            return new TransitionGuard();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransitionGuard.prototype, "conditions", {
        get: function () { return this._conditions; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransitionGuard.prototype, "guards", {
        /**
         * guards is the list of the guard functions for all guard conditions for this transition
         *
         * @readonly
         * @memberof TransitionGuard
         */
        get: function () {
            return this._conditions.map(function (c) { return c.guard; });
        },
        enumerable: true,
        configurable: true
    });
    /**
     * guardConditionsMet is true if all of the guard functions return true or if there are no guard functions
     *
     * @returns {Promise<boolean>}
     * @memberof TransitionGuard
     */
    TransitionGuard.prototype.guardConditionsMet = function (args) {
        var _this = this;
        var implement = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, item, result, final, e_2_1, e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 6, 7, 8]);
                        _a = __values(this.conditions), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 5];
                        item = _b.value;
                        if (!item.guard) {
                            return [2 /*return*/, false];
                        }
                        result = item.guard.apply(item, args);
                        if (!(result instanceof Promise)) return [3 /*break*/, 3];
                        return [4 /*yield*/, result];
                    case 2:
                        final = _d.sent();
                        if (final === false) {
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        if (result === false) {
                            return [2 /*return*/, false];
                        }
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_2_1 = _d.sent();
                        e_2 = { error: e_2_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_2) throw e_2.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, true];
                }
            });
        }); };
        return implement();
    };
    /**
     *  unmetGuardConditions is a list of the descriptions of all guard conditions whose guard function returns false
     *
     * @returns {(Promise<Array<string | null>>)}
     * @memberof TransitionGuard
     */
    TransitionGuard.prototype.unmetGuardConditions = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var implement;
            return __generator(this, function (_a) {
                implement = function () { return __awaiter(_this, void 0, void 0, function () {
                    var result, _a, _b, item, guard, final, e_3_1, e_3, _c;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                result = [];
                                _d.label = 1;
                            case 1:
                                _d.trys.push([1, 7, 8, 9]);
                                _a = __values(this.conditions), _b = _a.next();
                                _d.label = 2;
                            case 2:
                                if (!!_b.done) return [3 /*break*/, 6];
                                item = _b.value;
                                if (!item.guard) {
                                    return [3 /*break*/, 5];
                                }
                                guard = item.guard.apply(item, args);
                                if (!(guard instanceof Promise)) return [3 /*break*/, 4];
                                return [4 /*yield*/, guard];
                            case 3:
                                final = _d.sent();
                                if (final === false) {
                                    result.push(item.description);
                                }
                                return [3 /*break*/, 5];
                            case 4:
                                if (guard === false) {
                                    result.push(item.description);
                                }
                                _d.label = 5;
                            case 5:
                                _b = _a.next();
                                return [3 /*break*/, 2];
                            case 6: return [3 /*break*/, 9];
                            case 7:
                                e_3_1 = _d.sent();
                                e_3 = { error: e_3_1 };
                                return [3 /*break*/, 9];
                            case 8:
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_3) throw e_3.error; }
                                return [7 /*endfinally*/];
                            case 9: return [2 /*return*/, result];
                        }
                    });
                }); };
                return [2 /*return*/, implement()];
            });
        });
    };
    return TransitionGuard;
}());
exports.TransitionGuard = TransitionGuard;
