Gt.controller('GtProgressBar', [], 'GtWidget', function(value, text){

	this.min = 0;
	this.max = 100;

	this.view(1);

	this.setValue(value || 0);
	this.setText(text || '');

});

GtProgressBar.prototype.setMin = function(value)
{
	this.min = value;
};

GtProgressBar.prototype.setMax = function(value)
{
	this.max = value;
};

GtProgressBar.prototype.setValue = function(value)
{
	if (value > this.max)
		value = this.max;
	
	this.value = value;
	this.pourcent = Math.round((this.value - this.min) / (this.max - this.min) * 100);
	this.find('.gt-progress-bar-progress').css('width', this.pourcent + '%');
};

GtProgressBar.prototype.setText = function(text)
{
	this.text = text;
	this.find('.gt-progress-bar-text').html(text);
};