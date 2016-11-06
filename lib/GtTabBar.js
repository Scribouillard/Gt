Gt.controller('GtTabBar', ['GtPageContainer'], 'GtBar', function() {

	var self = this;
	this.currentIndex = 0;
	this.myElements = [];
	this.texts = [];
	this.buttons = [];
	this.indexs = [];

	this.container = new GtPageContainer(GtPageContainer.type.Hide);
	this.index = 1;
	this.count = 0;

	$(window).resize(function(){
		self.emit('update');
	});

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
	this.myElements[index] = element;
	this.buttons[index] = button;
	this.indexs.push(index);
	if (element)
		this.container.addPage(index, element);

	if (!this.currentIndex || select)
		this.setCurrent(index);

	this.emit('update');

	return button;
};

GtTabBar.prototype.getButton = function(element)
{
	var index = this.myElements.indexOf(element);
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
	var index = this.myElements.indexOf(element);
	if (index == -1)
		return;

	this.count--;
	
	GtBar.prototype.remove.call(this, this.buttons[index]);
	this.container.removePage(index);
	this.texts[index] = null;
	this.myElements[index] = null;
	this.buttons[index] = null;
	this.indexs.splice(this.indexs.indexOf(index), 1);
	this.emit('update');
};

GtTabBar.prototype.clear = function()
{
	for (var i in this.myElements)
		if (this.myElements[i])
			this.remove(this.myElements[i]);

};

GtTabBar.prototype.getCurrentWidget = function()
{
	return this.myElements[this.currentIndex];
};

GtTabBar.prototype.setCurrent = function(index)
{
	if (index !== parseInt(index, 10))
		index = this.myElements.indexOf(index);

	if (this.emit('change', index, this.texts[index], this.myElements[index]) === false)
		return;

	this.getElement().children().removeClass('active');
	this.buttons[index].getElement().addClass('active');
	if (this.myElements[index])
		this.container.setPage(index);

	this.currentIndex = index;
};

GtTabBar.prototype.setFirst = function()
{
	if (this.indexs.length)
		this.setCurrent(this.indexs[0]);
};

GtTabBar.prototype.setLast = function()
{
	if (this.indexs.length)
		this.setCurrent(this.indexs[this.indexs.length - 1]);
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