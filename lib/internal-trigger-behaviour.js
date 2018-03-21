"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const trigger_behaviour_1 = require("./trigger-behaviour");
const transition_guard_1 = require("./transition-guard");
/**
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/InternalTriggerBehaviour.cs
 */
class InternalTriggerBehaviour extends trigger_behaviour_1.TriggerBehaviour {
    constructor(trigger, guard) {
        super(trigger, new transition_guard_1.TransitionGuard({ guard: guard, description: 'Internal Transition' }));
    }
    resultsInTransitionFrom(source, _args) {
        const result = [false, source];
        return Promise.resolve(result);
    }
}
exports.InternalTriggerBehaviour = InternalTriggerBehaviour;

//# sourceMappingURL=internal-trigger-behaviour.js.map
