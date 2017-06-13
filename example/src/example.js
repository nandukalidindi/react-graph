var React = require('react');
var ReactDOM = require('react-dom');
var Regraph = require('react-graph');

var App = React.createClass({
	render () {
		return (
			<div>
				<Regraph />
			</div>
		);
	}
});

ReactDOM.render(<App />, document.getElementById('app'));
