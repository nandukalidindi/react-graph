import React from 'react';
import './Regraph.css';

class Regraph extends React.Component {
	constructor(props) {
		super();

		this.jsplumbInstance = null;

		this.state = {
			connectionGraph: {
				"1": ["2", "3"],
				"2": ["4", "5"],
				"3": ["6", "7"]
			}
		};
	}

	componentWillMount() {
		var jsPlumb = require('jsplumb');
	}

	componentWillReceiveProps(nextProps) {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentDidMount() {
		var visitedNodes = [(Object.keys(this.state.connectionGraph || {})[0])];

		this.jsplumbInstance = jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 1,
        stroke: "#567567",
        outlineStroke: "black",
        outlineWidth: 1
      },
      Connector: ["Flowchart", {stub: 6.0, alwaysRespectStubs: true}],
      Endpoint: ["Dot", { radius: 0.1 }],
      EndpointStyle: { fill: "#567567" }
    });

		Object.keys(this.state.connectionGraph || {}).forEach(function(key) {
      this.state.connectionGraph[key].forEach(function(value) {
        this.jsplumbInstance.connect({
          source: "graph_" + (key).toString(),
          target: "graph_" + (value).toString(),
          anchors: ["Bottom", "Top"],
          paintStyle: { stroke: 'lightblue', strokeWidth: 2 },
          endpointStyle: { fill: 'lightblue', outlineStroke: 'lightblue', outlineWidth: 0 },
          overlays:[
              [
                "Arrow" ,
                {
                  width: 10, length: 5, location:1, fill: 'lightblue',
                  id: key + value
                }
              ]
          ]
        });
      }.bind(this));
      visitedNodes.push(key);
    }.bind(this));
	}

	componentWillUnmount() {
    this.jsplumbInstance.deleteEveryEndpoint();
  }

	removeGraphCycles(connectionGraph, root) {
    var nonCyclicGraph = {};
    var visitedNodes = [root];
    Object.keys(connectionGraph).forEach(function(root) {
      connectionGraph[root].forEach(function(child) {
        if(visitedNodes.indexOf(child.slide) === -1) {
          nonCyclicGraph[root] = (nonCyclicGraph[root] || []);
          nonCyclicGraph[root].push(child);
        }
        visitedNodes.push(child);
      });
    });
    return nonCyclicGraph;
  }

	buildRecursiveDecks(connectionGraph, root, visitedNodes) {
    visitedNodes = visitedNodes || [];
    if(connectionGraph[root] === undefined) {
      return (
        <div style={{marginLeft: "10px", marginRight: "10px"}} key={root}>
					<div
						id={"graph_" + root.toString()}
						style={{width: "80px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "red", marginBottom: "15px"}}
					>
          	{root}
					</div>
        </div>
      );
    }

    var deck = [];
    var parsableKeys = connectionGraph[root].filter(function(childSlide) {
      return visitedNodes.indexOf(childSlide) === -1;
    });

    parsableKeys.forEach(function(childSlide) {
      visitedNodes.push(childSlide);
    });

    parsableKeys.forEach(function(childSlide) {
      deck.push(this.buildRecursiveDecks(connectionGraph, childSlide, visitedNodes));
    }.bind(this));

    var childJSX = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          {deck}
        </div>
      </div>
    );

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} key={root}>
        <div style={{marginLeft: "10px", marginRight: "10px"}}>
					<div
						id={"graph_" + root.toString()}
						style={{width: "80px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "red", marginBottom: "15px"}}
					>
          	{root}
					</div>
        </div>
        {childJSX}
      </div>
    );
  }

  buildAcyclicGraph(connectionGraph, root) {
    var acyclicGraph = this.removeGraphCycles(connectionGraph, root);
    return connectionGraph ? this.buildRecursiveDecks(acyclicGraph, root) : null;
  }

	render() {
		return (
			<div style={{display: "flex"}}>
        <div>
          {this.buildAcyclicGraph(this.state.connectionGraph, (Object.keys(this.state.connectionGraph)[0]))}
        </div>
      </div>
		)
	}
}

Regraph.propTypes = {

}

export default Regraph;
