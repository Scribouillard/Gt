Gt.controller('GtNavBar', [], 'GtWidget', function(){

	this.view(1);

});

GtNavBar.prototype.add = function(element, alignment, position)
{
	//position = position || -1;
	alignment = alignment || 'left';

	element.setStyle('navBar');
	element.render(this.findElement('.gt-navbar-' + alignment), this);

	/*
	if (!this.getElement().children().eq(position).length)
		element.getElement().prependTo(this.getElement());
	else
		element.getElement().insertAfter(this.getElement().children().eq(position));
	*/
};

GtNavBar.prototype.setAlign = function(align)
{
	this.getElement().css('text-align', align);
};