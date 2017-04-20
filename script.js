// Redux
var initStore = function() {
	// events
	var INPUT_CHANGED = 'INPUT_CHANGED';
	var INPUT_LENGTH_CHANGED = 'INPUT_LENGTH_CHANGED';

	// initial state
	var initialInputValue = 'test';

	var state = {
		input: {
			value: initialInputValue,
			length: initialInputValue.length
		},
		info: {
			inputLength: initialInputValue.length
		}
	};

	// reducer
	var reducer = function(state, action) {
		switch (action.type) {
		case INPUT_CHANGED:
			return {
				input: {
					value: action.value,
					length: action.value.length
				},
				info: state.info
			};
		case INPUT_LENGTH_CHANGED:
			return {
				input: state.input,
				info: {
					inputLength: action.length
				}
			};
		default:
			return state;
		}
	};

	// store
	var reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
	var store = Redux.createStore(reducer, state, reduxDevTools);

	return {
		getState: store.getState,
		subscribe: function(callback) {
			return store.subscribe(function() {
				callback(store.getState())
			});
		},
		events: {
			inputChanged: function(value) {
				store.dispatch({
					type: INPUT_CHANGED,
					value: value
				});
			},
			inputLengthChanged: function(length) {
				store.dispatch({
					type: INPUT_LENGTH_CHANGED,
					length: length
				});
			}
		}
	};
}

// RxJS
var initLogic = function(store) {
	var inputChangeStream = new Rx.Subject();

	inputChangeStream.subscribe(
		function (value) {
			store.events.inputChanged(value);
		});

	inputChangeStream
		.debounce(500)
		.subscribe(function (value) {
			store.events.inputLengthChanged(value.length);
		});

	return {
		changeInput: function(value) {
			inputChangeStream.onNext(value);
		}
	};
};

// React

class TextBox extends React.Component {
	constructor(props) {
		super(props);
		this.handleInputChange = this.handleInputChange.bind(this);

		var storeState = props.store.getState();

		this.state = {
			value: storeState.input.value,
			valueLength: storeState.input.length
		};
	}

	componentDidMount() {
		var self = this;

		this.props.store.subscribe(function(storeState) {
			self.setState({
				value: storeState.input.value,
				valueLength: storeState.input.length
			});
		});
	}

	componentWillUnmount() {
	}

	handleInputChange(event) {
		commands.changeInput(event.target.value);
	}

	render() {
		return React.createElement(
				'div',
				null,
				React.createElement(
					'input',
					{
						type: 'text',
						value: this.state.value,
						onChange: this.handleInputChange
					},
					null),
				React.createElement(
					'div',
					null,
					'Length: ' + this.state.valueLength)
			);
	}
}

class Info extends React.Component {
	constructor(props) {
		super(props);

		var storeState = props.store.getState();

		this.state = {
			inputLength: storeState.info.inputLength
		};
	}

	componentDidMount() {
		var self = this;

		this.props.store.subscribe(function(storeState) {
			self.setState({
				inputLength: storeState.info.inputLength
			});
		});
	}

	componentWillUnmount() {
	}

	render() {
		return React.createElement(
				'div',
				null,
				'Input length: ' + this.state.inputLength
			);
	}
}

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

// Start
var store = initStore();
var commands = initLogic(store);

ReactDOM.render(
	React.createElement(
		Root,
		{
			store: store,
			commands: commands
		}),
	document.getElementById('root'));
