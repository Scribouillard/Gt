/**
 * A bar widget
 *
 * @class GtBar
 * @constructor
 */
Gt.controller('GtBar', 'GtWidget', function(){

	this.elements = {};
	this.view(1);

	$(document).on(Gt.touchEvents ? 'touchstart' : 'click', "[data-GtID='" + this.uniqid + "'] .gt-button", {o:this}, function(e){if ($(this).data('gtid') && e.data.o.elements[$(this).data('gtid')]) e.data.o.emit('click', e.data.o.elements[$(this).data('gtid')]/*$(this).data('GtObject')*/)});
	
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

	this.elements[element.uniqid] = element;

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