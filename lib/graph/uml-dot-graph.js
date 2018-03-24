"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uml_dot_graph_style_1 = require("./uml-dot-graph-style");
var state_graph_1 = require("./state-graph");
/**
 * Class to generate a DOT grah in UML format
 *
 * @export
 * @class UmlDotGraph
 */
var UmlDotGraph = /** @class */ (function () {
    function UmlDotGraph() {
    }
    /**
     * Generate a UML DOT graph from the state machine info
     *
     * @static
     * @param {StateMachineInfo} machineInfo
     * @returns {string}
     * @memberof UmlDotGraph
     */
    UmlDotGraph.format = function (machineInfo) {
        var graph = new state_graph_1.StateGraph(machineInfo);
        return graph.toGraph(new uml_dot_graph_style_1.UmlDotGraphStyle());
    };
    return UmlDotGraph;
}());
exports.UmlDotGraph = UmlDotGraph;
