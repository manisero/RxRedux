import * as Rx from 'rx'

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

export default initLogic;