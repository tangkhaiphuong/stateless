"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var graph_style_1 = require("./graph-style");
function htmlEntities(unsafe) {
    return unsafe.replace(/[<>&'"\$\{\}]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '{': return '\\{';
            case '}': return '\\}';
            case '$': return '\\$';
            case '"': return '&quot;';
        }
        return c;
    });
}
/**
 * Generate DOT graphs in basic UML style
 *
 * @class UmlDotGraphStyle
 */
var UmlDotGraphStyle = /** @class */ (function (_super) {
    __extends(UmlDotGraphStyle, _super);
    function UmlDotGraphStyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /// <summary>Get the text that starts a new graph</summary>
    /// <returns></returns>
    UmlDotGraphStyle.prototype.getPrefix = function () {
        return 'digraph {\n'
            + 'compound=true;\n'
            + 'node [shape=Mrecord]\n'
            + 'rankdir="LR"\n';
    };
    UmlDotGraphStyle.prototype.formatOneCluster = function (stateInfo) {
        var stateRepresentationString = '';
        var label = stateInfo.stateName;
        if ((stateInfo.entryActions.length > 0) || (stateInfo.exitActions.length > 0)) {
            label += '\\n----------';
            label += stateInfo.entryActions.map(function (act) { return '\\nentry / ' + htmlEntities(act); }).join('');
            label += stateInfo.exitActions.map(function (act) { return '\\nexit / ' + htmlEntities(act); }).join('');
        }
        stateRepresentationString = '\n'
            + ("subgraph cluster" + stateInfo.nodeName) + '\n'
            + '\t{' + '\n'
            + ("\tlabel = \"" + label + "\"") + '\n';
        try {
            for (var _a = __values(stateInfo.subStates), _b = _a.next(); !_b.done; _b = _a.next()) {
                var subState = _b.value;
                stateRepresentationString += this.formatOneState(subState);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        stateRepresentationString += '}\n';
        return stateRepresentationString;
        var e_1, _c;
    };
    /**Generate the text for a single state
     *
     *
     * @param {State} state The state to generate text for
     * @returns {string}
     * @memberof UmlDotGraphStyle
     */
    UmlDotGraphStyle.prototype.formatOneState = function (state) {
        if ((state.entryActions.length === 0) && (state.exitActions.length === 0)) {
            return "\"" + state.stateName + "\"" + ' [label="' + state.stateName + '"];\n';
        }
        var f = "\"" + state.stateName + "\"" + ' [label="' + state.stateName + '|';
        var es = [];
        es = es.concat(state.entryActions.map(function (act) { return 'entry / ' + htmlEntities(act); }));
        es = es.concat(state.exitActions.map(function (act) { return 'exit / ' + htmlEntities(act); }));
        f += es.join('\\n');
        f += '"];\n';
        return f;
    };
    /**
     * Generate text for a single transition
     *
     * @param {string} sourceNodeName
     * @param {string} trigger
     * @param {Iterable<string>} actions
     * @param {string} destinationNodeName
     * @param {Iterable<string>} guards
     * @returns {string}
     * @memberof UmlDotGraphStyle
     */
    UmlDotGraphStyle.prototype.formatOneTransition = function (sourceNodeName, trigger, actions, destinationNodeName, guards) {
        var label = trigger || '';
        var tempActions = __spread(actions);
        if (actions && __spread(actions).length > 0) {
            label += ' / ' + tempActions.join(', ');
        }
        try {
            for (var guards_1 = __values(guards), guards_1_1 = guards_1.next(); !guards_1_1.done; guards_1_1 = guards_1.next()) {
                var info = guards_1_1.value;
                if (label.length > 0) {
                    label += ' ';
                }
                label += '[' + info + ']';
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (guards_1_1 && !guards_1_1.done && (_a = guards_1.return)) _a.call(guards_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return this.formatOneLine(sourceNodeName, destinationNodeName, label);
        var e_2, _a;
    };
    /**
     * Generate the text for a single decision node
     *
     * @param {string} nodeName Name of the node
     * @param {string} label Label for the node
     * @returns {string}
     * @memberof UmlDotGraphStyle
     */
    UmlDotGraphStyle.prototype.formatOneDecisionNode = function (nodeName, label) {
        return nodeName + ' [shape = "diamond", label = "' + label + '"];\n';
    };
    UmlDotGraphStyle.prototype.formatOneLine = function (fromNodeName, toNodeName, label) {
        return "\"" + fromNodeName + "\"" + ' -> ' + ("\"" + toNodeName + "\"") + ' ' + '[style="solid", label="' + label + '"];';
    };
    return UmlDotGraphStyle;
}(graph_style_1.GraphStyle));
exports.UmlDotGraphStyle = UmlDotGraphStyle;
