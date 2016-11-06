/**
 * A bar widget
 *
 * @class GtBar
 * @constructor
 */
Gt.controller('GtBar', 'GtWidget', function(){

	this.elements = [];
	this.view(1);

	var self = this;
	//We have to verify the presence of element cause of panel button (we have to not trigger on panel button click)
	$(document).on(Gt.touchEvents ? 'touchstart' : 'click', "[data-GtID='" + this.uniqid + "'] .gt-button", function(e){
		var element = self.private_getElementByUniqid($(this).data('gtid'));
		if (element)
			self.emit('click', element)
	});

	//$(document).on(Gt.touchEvents ? 'touchstart' : 'click', "[data-GtID='" + this.uniqid + "'] .gt-button", {o:this}, function(e){console.log($(this).data('gtid'), e.data.o.elements); if ($(this).data('gtid') && e.data.o.elements[$(this).data('gtid')]) e.data.o.emit('click', e.data.o.elements[$(this).data('gtid')]/*$(this).data('GtObject')*/)});
	
});

/**
 * Add a widget to the bar
 *
 * @method add
 * @param {GtWidget} element The widget
 * @param {Integer} position (optional) Position in the bar
 */
GtBar.prototype.add = function(element, position)
{
    if (position == undefined)
	    position = -1;

	element.setParent(this);

	if (position == -1 || !this.getElement().children().eq(position).length)
		element.getElement().appendTo(this.getElement());
	else
        element.getElement().insertBefore(this.getElement().children().eq(position));

	this.elements.push(element);

	if (element.isInDom())
		element.emitRecursiveDomEvents();
};

/**
 * Remove a widget
 *
 * @method remove
 * @param {GtWidget} element The widget
 */
GtBar.prototype.remove = function(element)
{
	element.getElement().remove();
};

GtBar.prototype.setAlign = function(align)
{
	this.getElement().css('text-align', align);
};

GtBar.prototype.private_getElementByUniqid = function(uniqid, list)
{
	if (list == undefined)
		list = this.elements;

	for (var i in list)
	{
		if (!list[i])
			continue;

		if (list[i].uniqid == uniqid)
			return list[i];

		if (list[i].buttons)
		{
			var a = this.private_getElementByUniqid(uniqid, list[i].buttons);
			if (a)
				return a;
		}
	}

	return null;
};