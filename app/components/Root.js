import React from 'react'
import TextBox from './TextBox'
import Info from './Info.jsx'

class Root extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return React.createElement(
				'div',
				null,
				React.createElement(TextBox, this.props),
				React.createElement(Info, this.props)
				);
	}
}

export default Root;
