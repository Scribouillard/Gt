GtNavigator = new GtObject();
$(document).mousedown(function(e){GtNavigator.emit('mousedown', {x:e.pageX === undefined ? e.originalEvent.layerX : e.pageX,
	y:e.pageY === undefined ? e.originalEvent.layerY : e.pageY})});
$(document).mousemove(function(e){GtNavigator.emit('mousemove', {x:e.pageX === undefined ? e.originalEvent.layerX : e.pageX,
	y:e.pageY === undefined ? e.originalEvent.layerY : e.pageY})});
$(document).mouseup(function(e){GtNavigator.emit('mouseup', {x:e.pageX === undefined ? e.originalEvent.layerX : e.pageX,
	y:e.pageY === undefined ? e.originalEvent.layerY : e.pageY})});

Gt.ready('GtNavigator', 0);