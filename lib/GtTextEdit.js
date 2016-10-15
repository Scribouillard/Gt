Gt.controller('GtTextEdit', [], 'GtWidget', function(multiline, text, placeholder) {
	
	this.text = text || '';
	this.placeholder = placeholder || '';
	this.multiline = multiline;

	if (multiline)
		this.view(this.theme.multiline);
	else
		this.view(this.theme.singleline);

	this.connectToJSEvent('mousedown', 'input');
	this.connectToJSEvent('focus', 'focus');
	this.connectToJSEvent('blur', 'blur');
	this.connectToJSEvent('input', 'input');
	this.connectToJSEvent('keydown', function(e){
		this.emit('keydown', e.which, e);
	});
	this.connectToJSEvent('keypress', function (e) {
		this.emit('keypress', e.which, e);
		if (e.which == 13 && (!this.multiline || !e.shiftKey))
		{
			this.emit('enterPressed');
			e.preventDefault();
		}

	});
	this.connectToJSEvent('keyup', function (e) {
		this.emit('keyup', e.which);
		//if (e.which == 13)
		//	this.emit('enterPressed');
	});
});

GtTextEdit.prototype.setText = function(text)
{
	this.getElement().val(text);
};

GtTextEdit.prototype.getText = function()
{
	return this.getElement().val();
};

GtTextEdit.prototype.empty = function()
{
	this.setText('');
};

GtTextEdit.prototype.setPlaceholder = function(value)
{
	this.getElement().attr('placeholder', value);
};