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

	var args = Array.prototype.slice.call(arguments);
	var row = GtList.prototype.getRowByArguments.apply(this, args);

	var index = this.index;
	this.index++;
	row.attr('data-item-number', index);

	this.find('.gt-list').append(row);
	return index;
};

GtList.prototype.getElement = function(index, column)
{
	if (index == undefined)
		return GtWidget.prototype.getElement.call(this);

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