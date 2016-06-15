Gt.controller('GtTabBar', [], 'GtWidget', function(container) {

	this.currentIndex = 0;
	this.elements = [];
	this.texts = [];
	this.buttons = [];
	this.container = container;
	this.index = 1;

	this.view(1);

});

GtTabBar.prototype.add = function(text, element, select)
{
	var index = this.index;
	this.index++;

	var self = this;
	var button = new GtButton(text);
	button.setStyle('tabBar');
	button.connect('click', function(){
		self.setCurrent(element);
	});
	button.render(this.findElement('.gt-tabbar-container'));

	this.texts[index] = text;
	this.elements[index] = element;
	this.buttons[index] = button;

	if (!this.currentIndex || select)
		this.setCurrent(element);
};

GtTabBar.prototype.setCurrent = function(index)
{
	//if (!Number.isInteger(index))
	//	index = this.elements.indexOf(index);

	this.emit('change', index, this.texts[index], this.elements[index]);

	this.findElement('li').removeClass('active');
	this.buttons[index].getElement().addClass('active');
	this.container.setPage(index);

	this.currentIndex = index;
};