import React from 'react';

class Regraph extends React.Component {
	constructor(props) {
		super();
		
		this.jsplumbInstance = null;

		this.state = {
			connectionGraph: {
				1: ["2", "3"],
				2: ["4", "5"],
				3: ["6", "7"]
			}
		};
	}

	componentWillMount() {
		var jsPlumb = require('jsplumb');
	}

	render() {
		return (
			<div>
				HELLO
			</div>
		)
	}
}

Regraph.propTypes = {

}

export default Regraph;
