Gt.controller('GtList', [], 'GtWidget', function() {

	this.index = 1;
	this.view(1);

});

GtList.ensureIsWidget = function(value)
{
	if (typeof value != 'object')
	{
		var s = value;
		value = new GtWidget();
		value.view(s);
	}
	return value;
};

GtList.getRowByArguments = function()
{
	var row = $('<tr></tr>');
	for (var col in arguments)
	{
		col = arguments[col];
		col = GtList.ensureIsWidget(col);

		row.append('<td></td>');
		col.render(row.find('td:last'));
	}
	return row;
};

GtList.prototype.add = function()
{
	if (this.emptyRow)
		this.remove(this.emptyRow);

	var args = Array.prototype.slice.call(arguments);
	var row = GtList.getRowByArguments.apply(GtList, args);

	var index = this.index;
	this.index++;
	row.attr('data-item-number', index);

	this.getElement().append(row);
	return index;
};

GtList.prototype.edit = function(index, position, value)
{
	value = GtList.ensureIsWidget(value);
	this.findElement('[data-item-number="' + index + '"] td').eq(position).empty();
	value.render(this.findElement('[data-item-number="' + index + '"] td').eq(position));
};

GtList.prototype.remove = function(index)
{
	this.findElement('[data-item-number="' + index + '"]').remove();
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