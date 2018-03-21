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
class Transition {
    /**
     * Creates an instance of Transition.
     * @param {TState} _source The state transitioned from.
     * @param {TState} _destination The state transitioned to
     * @param {TTrigger} _trigger The trigger that caused the transition.
     * @memberof Transition
     */
    constructor(_source, _destination, _trigger) {
        this._source = _source;
        this._destination = _destination;
        this._trigger = _trigger;
    }
    /**
     * The state transitioned from.
     *
     * @readonly
     * @memberof Transition
     */
    get source() { return this._source; }
    /**
     * The state transitioned to.
     *
     * @readonly
     * @memberof Transition
     */
    get destination() { return this._destination; }
    /**
     * The trigger that caused the transition.
     *
     * @readonly
     * @memberof Transition
     */
    get trigger() { return this._trigger; }
    /**
     * True if the transition is a re-entry, i.e. the identity transition.
     *
     * @readonly
     * @type {boolean}
     * @memberof Transition
     */
    get isReentry() { return this.source === this.destination; }
}
exports.Transition = Transition;

//# sourceMappingURL=transition.js.map
