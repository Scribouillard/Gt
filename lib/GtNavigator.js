GtNavigator = new GtObject();
$(document).mousedown(function(e){GtNavigator.emit('mousedown', {x:e.pageX === undefined ? e.originalEvent.layerX : e.pageX,
	y:e.pageY === undefined ? e.originalEvent.layerY : e.pageY})});
$(document).mousemove(function(e){GtNavigator.emit('mousemove', {x:e.pageX === undefined ? e.originalEvent.layerX : e.pageX,
	y:e.pageY === undefined ? e.originalEvent.layerY : e.pageY})});
$(document).mouseup(function(e){GtNavigator.emit('mouseup', {x:e.pageX === undefined ? e.originalEvent.layerX : e.pageX,
	y:e.pageY === undefined ? e.originalEvent.layerY : e.pageY})});

/*
document.body.addEventListener("touchstart", function(e){
	e.preventDefault();
	//GtNavigator.emit('mousedown', {x:e.touches[0].pageX, y:e.touches[0].pageY});
}, false);
*/
/*
document.body.addEventListener("touchend", function(e){
	e.preventDefault();
	GtNavigator.emit('mouseup');
}, false);
document.body.addEventListener("touchmove", function(e){
	e.preventDefault();
	GtNavigator.emit('mousemove', {x:e.touches[0].pageX, y:e.touches[0].pageY});
}, false);
*/

Gt.ready('GtNavigator', 0);