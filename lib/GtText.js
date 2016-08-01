Gt.controller('GtText', [], 'GtWidget', function(text) {

	this.text = text;
	this.view(1);
	this.connectToJSEvent('click', 'click');

});