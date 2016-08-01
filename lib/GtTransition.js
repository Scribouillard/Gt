Gt.controller('GtTransition', [], 'GtObject', function(properties, duration) {

	this.properties = properties || {};
	this.duration = duration || 400;

});

GtTransition.prototype.run = function(widget)
{
	widget = (('connectToJSEvent' in widget) ? widget.getElement() : widget);
	widget.animate(this.properties, this.duration, $.proxy(function(){this.emit('complete', widget)}, this));
};

GtTransition.sequence = function(transition1, widget1, transition2, widget2)
{
	var args = Array.prototype.slice.call(arguments);
	for (var i = 0; i < args.length - 2; i += 2)
	{
		(function(i) {
			args[i].connect('complete', function(){
				args[i + 2].run(args[i + 3]);
			});
		})(i);
	}
	transition1.run(widget1);
};

GtTransition.fadeIn = function(d)
{
	var t = new GtTransition({opacity:1}, d || 400);
	return t;
};

GtTransition.fadeOut = function(d)
{
	var t = new GtTransition({opacity:0}, d || 400);
	t.connect('complete', function(div){
		//div.hide();
	});
	return t;
};