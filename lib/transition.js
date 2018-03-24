"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Describes a state transition.
 *
 * @export
 * @class Transition
 * @template TState
 * @template TTrigger
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Transition.cs
 */
var Transition = /** @class */ (function () {
    /**
     * Creates an instance of Transition.
     * @param {TState} _source The state transitioned from.
     * @param {TState} _destination The state transitioned to
     * @param {TTrigger} _trigger The trigger that caused the transition.
     * @memberof Transition
     */
    function Transition(_source, _destination, _trigger) {
        this._source = _source;
        this._destination = _destination;
        this._trigger = _trigger;
    }
    Object.defineProperty(Transition.prototype, "source", {
        /**
         * The state transitioned from.
         *
         * @readonly
         * @memberof Transition
         */
        get: function () { return this._source; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "destination", {
        /**
         * The state transitioned to.
         *
         * @readonly
         * @memberof Transition
         */
        get: function () { return this._destination; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "trigger", {
        /**
         * The trigger that caused the transition.
         *
         * @readonly
         * @memberof Transition
         */
        get: function () { return this._trigger; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Transition.prototype, "isReentry", {
        /**
         * True if the transition is a re-entry, i.e. the identity transition.
         *
         * @readonly
         * @type {boolean}
         * @memberof Transition
         */
        get: function () { return this.source === this.destination; },
        enumerable: true,
        configurable: true
    });
    return Transition;
}());
exports.Transition = Transition;
