Gt.controller('GtContextMenu', ['GtNavigator'], 'GtList', function(){

	this.setStyle('contextMenu');
	this.render();

	var self = this;
	GtNavigator.connect('mousedown', function(p, w){
		if (!self.isVisible() || w != 1 || self.isInMe(p))
			return;

		self.emit('close');
		self.hide();
	});
	this.getElement().on("mouseup", ".gt-list-element", function() {
		self.hide();
		setTimeout(function(){self.emit('close')}, 20);//horrible ???
	});

});

GtContextMenu.prototype.linkToWidget = function(widget)
{
	var element = GtWidget.getAsElement(widget);

	var self = this;
	element.contextmenu(function(e){

		self.clickPosition = {x:e.pageX, y:e.pageY};
		if (self.isVisible())
			self.emit('close');
		self.emit('open', self.clickPosition);
		self.css({
			display: "block",
			left: e.pageX,
			top: e.pageY
		});
		//return false;

	});
};

GtContextMenu.prototype.getClickPosition = function()
{
	return this.clickPosition;
};