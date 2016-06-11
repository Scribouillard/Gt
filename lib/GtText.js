Gt.controller('GtText', [], 'GtWidget', function(text) {

	this.text = text;
	this.view('base');
	this.connectToJSEvent('click', 'click');

});