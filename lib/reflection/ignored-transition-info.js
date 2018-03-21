"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transition_info_1 = require("./transition-info");
const trigger_info_1 = require("./trigger-info");
/**
 * Describes a trigger that is "ignored" (stays in the same state)
 *
 * @export
 * @class IgnoredTransitionInfo
 * @extends {TransitionInfo}
 * @link https://github.com/dotnet-state-machine/stateless/blob/dev/src/Stateless/Reflection/IgnoredTransitionInfo.cs
 */
class IgnoredTransitionInfo extends transition_info_1.TransitionInfo {
    static create(behaviour) {
        const transition = new IgnoredTransitionInfo(new trigger_info_1.TriggerInfo(behaviour.trigger), !behaviour.guard ? [] : behaviour.guard.conditions.map(c => c.methodDescription));
        return transition;
    }
}
exports.IgnoredTransitionInfo = IgnoredTransitionInfo;
//# sourceMappingURL=ignored-transition-info.js.map