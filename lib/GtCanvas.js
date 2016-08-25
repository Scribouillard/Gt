Gt.controller('GtCanvas', ['GtNavigator'], 'GtWidget', function(){

	this.elements = [];
	this.backgroudColor = 'white';

	this.view(1);
	this.getElement().data('object', this);

	this.context = this.getElement().get(0).getContext('2d');
	$(window).resize($.proxy(this.updateSize, this));
	var self = this;

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

	GtNavigator.connect('mousemove', function(position){
		position = {x:position.x - self.getElement().offset().left, y:position.y - self.getElement().offset().top};
		self.emit('globalmousemove', position);
	});

	GtNavigator.connect('mouseup', function(position){
		position = {x:position.x - self.getElement().offset().left, y:position.y - self.getElement().offset().top};
		self.emit('globalmouseup', position);
	});

	this.getElement().get(0).addEventListener("touchstart", function(e){
		e.preventDefault();
		self.emit('mousedown', {x:e.touches[0].pageX - self.getElement().offset().left, y:e.touches[0].pageY - self.getElement().offset().top});
	}, false);
	this.getElement().get(0).addEventListener("touchmove", function(e){
		e.preventDefault();
		// - $(window).scrollTop();
		self.lastTouchPosition = {x:e.touches[0].pageX - self.getElement().offset().left, y:e.touches[0].pageY - self.getElement().offset().top};
		self.emit('mousemove', {x:e.touches[0].pageX - self.getElement().offset().left, y:e.touches[0].pageY - self.getElement().offset().top});
		self.emit('globalmousemove', {x:e.touches[0].pageX - self.getElement().offset().left, y:e.touches[0].pageY - self.getElement().offset().top});
	}, false);
	this.getElement().get(0).addEventListener("touchend", function(e){
		e.preventDefault();
		self.emit('mouseup', self.lastTouchPosition);
		self.emit('globalmouseup', self.lastTouchPosition);
	}, false);

	this.getElement().mousedown(function(){$(this).focus()});//Pour la gestion du keydown

	this.connectToJSEvent('keydown', function(e){
		this.emit('keydown', e.keyCode)}, true);


	this.connect('addedInDom', function(){
		GtCanvas.initialize(self.uniqid);
	});
});

GtCanvas.initialize = function(id)
{
	$('[data-GtID="' + id + '"]').data('object').updateSize(true);
};

GtCanvas.prototype.updateSize = function(fireEvent)
{
	this.storedWidth = this.width();
	this.storedHeight = this.height();
	this.context.canvas.width = this.storedWidth;
	this.context.canvas.height = this.storedHeight;
	if (fireEvent)
		this.emit('resize', this.storedWidth, this.storedHeight);
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

	if (this.draw_before)
		this.draw_before();

	for (var i in this.elements)
		for (var j in this.elements[i])
			this.elements[i][j].draw();

	if (this.draw_after)
		this.draw_after();
};


Gt.controller('GtCanvasElement', 'GtObject');

GtCanvasElement.prototype.draw = function()
{

};