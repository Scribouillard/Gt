Gt.controller('GtBar', 'GtWidget', function(){
	
	this.view(1);

	this.getElement().on('click', '.gt-button', {o:this}, function(e){e.data.o.emit('click', $(this).data('GtObject'))});
	
});

GtBar.prototype.add = function(element, position)
{
	position = position || -1;

	element.setParent(this);

	if (!this.getElement().children().eq(position).length)
		element.getElement().prependTo(this.getElement());
	else
		element.getElement().insertAfter(this.getElement().children().eq(position));

	if (element.isInDom())
		element.emitRecursiveDomEvents();
};

GtBar.prototype.remove = function(element)
{
	element.getElement().remove();
};

GtBar.prototype.setAlign = function(align)
{
	this.getElement().css('text-align', align);
};