Gt.controller("GtContextMenu",["GtNavigator"],"GtList",function(){this.setStyle("contextMenu"),this.render();var a=this;GtNavigator.connect("mousedown",function(b,c){a.isVisible()&&1==c&&!a.isInMe(b)&&(a.emit("close"),a.hide())}),this.getElement().on("mouseup",".gt-list-element",function(){a.hide(),setTimeout(function(){a.emit("close")},20)})}),GtContextMenu.prototype.linkToWidget=function(a){var b=GtWidget.getAsElement(a),c=this;b.contextmenu(function(a){c.clickPosition={x:a.pageX,y:a.pageY},c.isVisible()&&c.emit("close"),c.emit("open",c.clickPosition),c.css({display:"block",left:a.pageX,top:a.pageY})})},GtContextMenu.prototype.getClickPosition=function(){return this.clickPosition};