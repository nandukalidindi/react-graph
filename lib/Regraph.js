'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('./Regraph.css');

var Regraph = (function (_React$Component) {
  _inherits(Regraph, _React$Component);

  function Regraph(props) {
    _classCallCheck(this, Regraph);

    _get(Object.getPrototypeOf(Regraph.prototype), 'constructor', this).call(this);

    this.jsplumbInstance = null;

    this.state = {
      connectionGraph: {
        "1": ["2", "3"],
        "2": ["4", "5"],
        "3": ["6", "7"]
      }
    };
  }

  _createClass(Regraph, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var jsPlumb = require('jsplumb');
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var visitedNodes = [Object.keys(this.state.connectionGraph || {})[0]];

      this.jsplumbInstance = jsPlumb.getInstance({
        PaintStyle: {
          strokeWidth: 1,
          stroke: "#567567",
          outlineStroke: "black",
          outlineWidth: 1
        },
        Connector: ["Flowchart", { stub: 6.0, alwaysRespectStubs: true }],
        Endpoint: ["Dot", { radius: 0.1 }],
        EndpointStyle: { fill: "#567567" }
      });

      Object.keys(this.state.connectionGraph || {}).forEach((function (key) {
        this.state.connectionGraph[key].forEach((function (value) {
          this.jsplumbInstance.connect({
            source: "graph_" + key.toString(),
            target: "graph_" + value.toString(),
            anchors: ["Bottom", "Top"],
            paintStyle: { stroke: 'lightblue', strokeWidth: 2 },
            endpointStyle: { fill: 'lightblue', outlineStroke: 'lightblue', outlineWidth: 0 },
            overlays: [["Arrow", {
              width: 10, length: 5, location: 1, fill: 'lightblue',
              id: key + value
            }]]
          });
        }).bind(this));
        visitedNodes.push(key);
      }).bind(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.jsplumbInstance.deleteEveryEndpoint();
    }
  }, {
    key: 'removeGraphCycles',
    value: function removeGraphCycles(connectionGraph, root) {
      var nonCyclicGraph = {};
      var visitedNodes = [root];
      Object.keys(connectionGraph).forEach(function (root) {
        connectionGraph[root].forEach(function (child) {
          if (visitedNodes.indexOf(child.slide) === -1) {
            nonCyclicGraph[root] = nonCyclicGraph[root] || [];
            nonCyclicGraph[root].push(child);
          }
          visitedNodes.push(child);
        });
      });
      return nonCyclicGraph;
    }
  }, {
    key: 'buildRecursiveDecks',
    value: function buildRecursiveDecks(connectionGraph, root, visitedNodes) {
      visitedNodes = visitedNodes || [];
      if (connectionGraph[root] === undefined) {
        return _react2['default'].createElement(
          'div',
          { style: { marginLeft: "10px", marginRight: "10px" }, key: root },
          _react2['default'].createElement(
            'div',
            {
              id: "graph_" + root.toString(),
              style: { width: "80px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "red", marginBottom: "15px" }
            },
            root
          )
        );
      }

      var deck = [];
      var parsableKeys = connectionGraph[root].filter(function (childSlide) {
        return visitedNodes.indexOf(childSlide) === -1;
      });

      parsableKeys.forEach(function (childSlide) {
        visitedNodes.push(childSlide);
      });

      parsableKeys.forEach((function (childSlide) {
        deck.push(this.buildRecursiveDecks(connectionGraph, childSlide, visitedNodes));
      }).bind(this));

      var childJSX = _react2['default'].createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
        _react2['default'].createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-around' } },
          deck
        )
      );

      return _react2['default'].createElement(
        'div',
        { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' }, key: root },
        _react2['default'].createElement(
          'div',
          { style: { marginLeft: "10px", marginRight: "10px" } },
          _react2['default'].createElement(
            'div',
            {
              id: "graph_" + root.toString(),
              style: { width: "80px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "red", marginBottom: "15px" }
            },
            root
          )
        ),
        childJSX
      );
    }
  }, {
    key: 'buildAcyclicGraph',
    value: function buildAcyclicGraph(connectionGraph, root) {
      var acyclicGraph = this.removeGraphCycles(connectionGraph, root);
      return connectionGraph ? this.buildRecursiveDecks(acyclicGraph, root) : null;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2['default'].createElement(
        'div',
        { style: { display: "flex" } },
        _react2['default'].createElement(
          'div',
          null,
          this.buildAcyclicGraph(this.state.connectionGraph, Object.keys(this.state.connectionGraph)[0])
        )
      );
    }
  }]);

  return Regraph;
})(_react2['default'].Component);

Regraph.propTypes = {};

exports['default'] = Regraph;
module.exports = exports['default'];