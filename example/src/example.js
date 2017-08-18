import React from 'react';
import ReactDOM from 'react-dom';
import Regraph from '../../src/Regraph.js';


class App extends React.Component {
	render() {
		return (
			<div>
				<Regraph />
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
