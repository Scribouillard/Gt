Gt.controller("GtCanvas",["GtNavigator"],"GtWidget",function(){this.elements=[],this.backgroudColor="white",this.view(1),this.getElement().data("object",this),this.context=this.getElement().get(0).getContext("2d"),$(window).resize($.proxy(this.updateSize,this));var a=this;this.uniqid2=GtObject.uniqid(),this.connectToJSEvent("mousedown",function(a){this.emit("mousedown",{x:void 0===a.offsetX?a.originalEvent.layerX:a.offsetX,y:void 0===a.offsetY?a.originalEvent.layerY:a.offsetY},a.which,a)},!0),this.connectToJSEvent("mouseup",function(a){this.emit("mouseup",{x:void 0===a.offsetX?a.originalEvent.layerX:a.offsetX,y:void 0===a.offsetY?a.originalEvent.layerY:a.offsetY},a.which,a)},!0),this.connectToJSEvent("mousemove",function(a){this.emit("mousemove",{x:void 0===a.offsetX?a.originalEvent.layerX:a.offsetX,y:void 0===a.offsetY?a.originalEvent.layerY:a.offsetY},a.which,a)},!0),this.connectToJSEvent("contextmenu",function(a){this.emit("contextmenu",{x:void 0===a.offsetX?a.originalEvent.layerX:a.offsetX,y:void 0===a.offsetY?a.originalEvent.layerY:a.offsetY})},!0),GtNavigator.connect("mousemove",function(b,c,d){a.isVisible()&&(b=a.documentToWidgetPosition(b),a.emit("globalmousemove",b,c,d))}),GtNavigator.connect("mouseup",function(b,c,d){a.isVisible()&&(b=a.documentToWidgetPosition(b),a.emit("globalmouseup",b,c,d))}),$(document).on("touchstart","[data-GtID='"+this.uniqid+"']",function(b){b.preventDefault(),b=b.originalEvent;var c=b.touches[0].pageX-a.getElement().offset().left+$(window).scrollLeft(),d=b.touches[0].pageY-a.getElement().offset().top+$(window).scrollTop();a.emit("mousedown",{x:c,y:d},1),a.emit("touchstart",{x:c,y:d},b)}),$(document).on("touchmove","[data-GtID='"+this.uniqid+"']",function(b){b.preventDefault(),b=b.originalEvent;var c=b.touches[0].pageX-a.getElement().offset().left+$(window).scrollLeft(),d=b.touches[0].pageY-a.getElement().offset().top+$(window).scrollTop();a.lastTouchPosition={x:c,y:d},a.emit("mousemove",{x:c,y:d},1),a.emit("globalmousemove",{x:c,y:d},1),a.emit("touchmove",{x:c,y:d},b)}),$(document).on("touchend","[data-GtID='"+this.uniqid+"']",function(b){b.preventDefault(),b=b.originalEvent,a.emit("mouseup",a.lastTouchPosition,1),a.emit("globalmouseup",a.lastTouchPosition,1),a.emit("touchend",a.lastTouchPosition,b)}),this.getElement().mousedown(function(){$(this).focus()}),this.connectToJSEvent("keydown",function(a){this.emit("keydown",a.keyCode,a)},!0),this.connect("addedInDom",function(){GtCanvas.initialize(a.uniqid)})}),GtCanvas.initialize=function(a){$('[data-GtID="'+a+'"]').data("object").updateSize(!0)},GtCanvas.prototype.updateSize=function(a){this.storedWidth=this.width(),this.storedHeight=this.height(),this.context.canvas.width=this.storedWidth,this.context.canvas.height=this.storedHeight,a&&this.emit("resize",this.storedWidth,this.storedHeight),this.draw()},GtCanvas.prototype.setBackgroundColor=function(a){this.backgroudColor=a},GtCanvas.prototype.add=function(a,b){b=b||5,a.layer=b,this.elements[b]||(this.elements[b]=[]),this.elements[b].push(a)},GtCanvas.prototype.insert=function(a,b,c){c=c||5,a.layer=c,this.elements[c]||(this.elements[c]=[]),this.elements[c].splice(b,0,a)},GtCanvas.prototype.remove=function(a){var b=this.elements[a.layer].indexOf(a);b!=-1&&this.elements[a.layer].splice(b,1)},GtCanvas.prototype.draw=function(){this.context.fillStyle=this.backgroudColor,this.context.fillRect(0,0,this.width(),this.height()),this.draw_before&&this.draw_before();for(var a in this.elements)for(var b in this.elements[a])this.elements[a][b].draw(this.context);this.draw_after&&this.draw_after()},Gt.controller("GtCanvasElement","GtObject"),GtCanvasElement.prototype.draw=function(){};