Gt.controller('GtList', [], 'GtWidget', function() {

	this.index = 1;
	this.setStyle('classic');
	this.length = 0;

});

GtList.prototype.getRowByArguments = function()
{
	var row = $(this.getTheme(this.getStyle() + '_tr'));
	for (var col in arguments)
	{
		col = arguments[col];
		col = GtWidget.getAsWidget(col);

		if (row.length)
			row.append(this.getTheme(this.getStyle() + '_td'));
		else
			row = $(this.getTheme(this.getStyle() + '_td'));

		col.render(row.find('.gt-list-element:last').addBack('.gt-list-element:last'));
	}
	return row;
};

GtList.prototype.add = function()
{
	this.length++;
	if (this.emptyRow)
		this.remove(this.emptyRow);

	if (arguments.length == 1 && typeof arguments[0] == 'object')
		return this.private_addElementWithView(arguments[0]);

	var args = Array.prototype.slice.call(arguments);
	var row = GtList.prototype.getRowByArguments.apply(this, args);

	var index = this.index;
	this.index++;
	row.attr('data-item-number', index);

	this.find('.gt-list').append(row);
	return index;
};

GtList.prototype.isValidIndex = function(index)
{
	return !!this.find('[data-item-number="' + index + '"]').length;
};

GtList.prototype.getElement = function(index, column)
{
	if (index == undefined)
		return GtWidget.prototype.getElement.call(this);

	if (!this.isValidIndex(index))
		return;

	if (column == undefined)
		return this.findElement('[data-item-number="' + index + '"]');
	else
		return this.findElement('[data-item-number="' + index + '"] .gt-list-element').eq(column).children().first();
};

GtList.prototype.edit = function(index, position, value)
{
	value = GtWidget.getAsWidget(value);
	this.findElement('[data-item-number="' + index + '"] .gt-list-element').eq(position).empty();
	value.render(this.findElement('[data-item-number="' + index + '"] .gt-list-element').eq(position));
};

GtList.prototype.remove = function(index)
{
	this.length--;
	this.findElement('[data-item-number="' + index + '"]').remove();
};

GtList.prototype.clear = function(index)
{
	this.index = 1;
	this.length = 0;
	this.find('.gt-list').empty();
};

GtList.prototype.setEmpty = function()
{
	var args = Array.prototype.slice.call(arguments);
	this.emptyRow = this.add.apply(this, args);
};

GtList.prototype.getIndexByValue = function(position, value)
{
	this.findElement('tr').each(function(){
		if ($(this).find('td').eq(position).html() == value)
			return $(this).parent().attr('data-item-number');
	});
	return -1;
};


//Element template system

GtList.prototype.setElementView = function(view)
{
	this.elementView = view;
};

GtList.prototype.private_addElementWithView = function(o)
{
	var self = this;

	var w = new GtWidget();

	for (var key in o)
	{
		w[key] = o[key];
		(function(key){
			w['set' + key.charAt(0).toUpperCase() + key.slice(1)] = function(a){
				w[key] = a;
				w.view(self.elementView);
			};
		})(key);
	}

	w.remove = function(){
		self.remove(w.index);
	};

	w.view(this.elementView);



	var index = this.index;
	this.index++;
	w.getElement().attr('data-item-number', index);

	w.render(this.find('.gt-list'));


	w.connectToJSEvent('click', 'click');

	w.index = index;
	return w;
};