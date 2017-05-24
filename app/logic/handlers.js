let subscribe = (events, store) => {

	events.inputChanged.stream
		.subscribe(e => store.actions.changeInput(e.value, e));

	events.inputChanged.stream
		.debounceTime(500)
		.subscribe(e => store.actions.updateInputInfo(e));

};

export default subscribe;
