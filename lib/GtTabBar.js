Gt.controller('GtTabBar', ['GtPageContainer'], 'GtBar', function() {

	this.currentIndex = 0;
	this.elements = [];
	this.texts = [];
	this.buttons = [];

	this.container = new GtPageContainer(GtPageContainer.type.Hide);
	this.index = 1;
	this.count = 0;

	//this.view(1);

});

GtTabBar.prototype.add = function(text, element, select, position)
{
	this.count++;
	var index = this.index;
	this.index++;

	var self = this;
	var button = new GtButton(text);
	button.setStyle('tabBar');
	if (element)//si pas d'élément, c'est un bouton qui n'active pas d'élément (il faut traiter le onclick sur le retour)
	{
		button.connect('click', function(){
			self.setCurrent(index);
		});
	}
	GtBar.prototype.add.call(this, button, position);

	this.texts[index] = text;
	this.elements[index] = element;
	this.buttons[index] = button;
	if (element)
		this.container.addPage(index, element);

	if (!this.currentIndex || select)
		this.setCurrent(index);

	return button;
};

GtTabBar.prototype.getButton = function(element)
{
	var index = this.elements.indexOf(element);
	return this.buttons[index];
};

GtTabBar.prototype.setText = function(element, text)
{
	this.getButton(element).setText(text);
};

GtTabBar.prototype.getText = function(element)
{
	return this.getButton(element).getText();
};

GtTabBar.prototype.remove = function(element)
{
	var index = this.elements.indexOf(element);
	GtBar.prototype.remove.call(this, this.buttons[index]);
	this.container.removePage(index);
	this.texts[index] = null;
	this.elements[index] = null;
	this.buttons[index] = null;
};

GtTabBar.prototype.setCurrent = function(index)
{
	if (index !== parseInt(index, 10))
		index = this.elements.indexOf(index);

	this.getElement().children().removeClass('active');
	this.buttons[index].getElement().addClass('active');
	if (this.elements[index])
		this.container.setPage(index);
	
	this.emit('change', index, this.texts[index], this.elements[index]);

	this.currentIndex = index;
};



/*
Gt.controller('GtTabBar', ['GtPageContainer'], 'GtWidget', function(container) {

	this.currentIndex = 0;
	this.elements = [];
	this.texts = [];
	this.buttons = [];
	this.container = container | new GtPageContainer();
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
	if (!Number.isInteger(index))
		index = this.elements.indexOf(index);

	this.emit('change', index, this.texts[index], this.elements[index]);

	this.findElement('li').removeClass('active');
	this.buttons[index].getElement().addClass('active');
	this.container.setPage(index);

	this.currentIndex = index;
};
*/