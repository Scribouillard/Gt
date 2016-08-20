Gt.controller('GtCanvas', 'GtWidget', function(){

	this.elements = [];
	this.backgroudColor = 'white';

	this.view(1);
	this.getElement().data('object', this);

	this.context = this.getElement().get(0).getContext('2d');
	$(window).resize($.proxy(this.updateSize, this));

	this.uniqid2 = GtObject.uniqid();

	this.connectToJSEvent('mousedown', function(e){
		this.emit('mousedown', {x:e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX,
			y:e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY})}, true);

	this.connectToJSEvent('mouseup', function(e){
		this.emit('mouseup', {x:e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX,
			y:e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY})}, true);

	this.connectToJSEvent('mousemove', function(e){
		this.emit('mousemove', {x:e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX,
			y:e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY})}, true);

	var self = this;
	this.getElement().get(0).addEventListener("touchstart", function(e){
		e.preventDefault();
		self.emit('mousedown', {x:e.touches[0].pageX, y:e.touches[0].pageY});
	}, false);
	this.getElement().get(0).addEventListener("touchmove", function(e){
		e.preventDefault();
		GtNavigator.emit('mousemove', {x:e.touches[0].pageX, y:e.touches[0].pageY});
	}, false);
	this.getElement().get(0).addEventListener("touchend", function(e){
		e.preventDefault();
		GtNavigator.emit('mouseup');
	}, false);

	this.getElement().mousedown(function(){$(this).focus()});//Pour la gestion du keydown

	this.connectToJSEvent('keydown', function(e){
		this.emit('keydown', e.keyCode)}, true);

});

GtCanvas.initialize = function(id)
{
	$('[data-GtID="' + id + '"]').data('object').updateSize();
};

GtCanvas.prototype.updateSize = function()
{
	this.storedWidth = this.width();
	this.storedHeight = this.height();
	this.context.canvas.width = this.storedWidth;
	this.context.canvas.height = this.storedHeight;
	this.draw();
};

GtCanvas.prototype.setBackgroundColor = function(color)
{
	this.backgroudColor = color;
};

GtCanvas.prototype.add = function(element, layer)
{
	layer = layer || 5;

	element.layer = layer;

	if (!this.elements[layer])
		this.elements[layer] = [];

	this.elements[layer].push(element);
};

GtCanvas.prototype.remove = function(element)
{
	var index = this.elements[element.layer].indexOf(element);

	if (index != -1)
		this.elements[element.layer].splice(index, 1);
};

GtCanvas.prototype.draw = function()
{
	this.context.fillStyle = this.backgroudColor;
	this.context.fillRect(0, 0, this.width(), this.height());//a mettre true true

	for (var i in this.elements)
		for (var j in this.elements[i])
			this.elements[i][j].draw();
};


Gt.controller('GtCanvasElement', 'GtObject');

GtCanvasElement.prototype.draw = function()
{

};