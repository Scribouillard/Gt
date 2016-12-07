/*
Gère un élément HTML
*/

Gt.controller('GtWidget', [], 'GtObject', function(name, htmlOptions){

	//if (!Gt.theme)
	//	Gt.setTheme('bootstrap');

	this.widgetName = name;

	//Provisoire ???
	if (Gt.theme)
	{
		this.theme = Gt.theme['GtWidget'];
		if (name && name in Gt.theme)
			this.theme = Gt.theme[name];
	}
	
	this.class = (htmlOptions) ? htmlOptions.htmlClass || '' : '';
	this.id = (htmlOptions) ? htmlOptions.htmlId || '' : '';
	this.title = (htmlOptions) ? htmlOptions.htmlTitle || '' : '';
	
	this.objectData = {};
	
	this.storedWidth = 0;
	this.storedHeight = 0;
	
	this.htmlElement = $();

	this.parent = null;
	this.children = [];
});

GtWidget.prototype.connectToJSEvent = function(JSEvent, GtEvent, prevent)
{
	/*
	if (Object.prototype.toString.call(GtEvent) == '[object String]')
		this.htmlElement.on(JSEvent, {o:this}, function(e){if(prevent){e.preventDefault(); /*e.stopPropagation()*FIN} e.data.o.emit(GtEvent)});
	else
		this.htmlElement.on(JSEvent, {o:this}, function(e){if(prevent){e.preventDefault(); /*e.stopPropagation()*FIN} GtEvent.call(e.data.o, e)});
	*/
	//A REMETTRE LA PREMIERE SOLUTION AVEC REBIND LORS DU CHANGEMENT DE THEME SI LA LIB MARCHE MOUAHAHAHAH
	if (Object.prototype.toString.call(GtEvent) == '[object String]')
		$(document).on(JSEvent, "[data-GtID='" + this.uniqid + "']", {o:this}, function(e){if(prevent){e.preventDefault()} e.data.o.emit(GtEvent)});
	else
		$(document).on(JSEvent, "[data-GtID='" + this.uniqid + "']", {o:this}, function(e){if(prevent){e.preventDefault()} GtEvent.call(e.data.o, e)});
};

GtWidget.prototype.view = function(s)
{
	s = s || '';

	if (!s)
		if (this.theme && this.theme.template)
			s = this.theme.template;
		//else
		//	return console.log('No template find');

	if (s === parseInt(s, 10))
		if (this.theme && this.theme[s])//faut il laissezr this.theme ?
			s = this.theme[s];
		else
			return Gt.log('No template with this number');

	if (s.indexOf('<') != 0 || s.lastIndexOf('>') != s.length - 1)
		s = '<div>' + s + '</div>';

	var toChange = {};

	/* POURQUOI CE TRUC ETAIT COMMENTE ????? */
	s = s.replace(/\{\{(.+?)\}\}/gi, $.proxy(function(match, variable){
		return eval('if (typeof this.' + variable + ' != "undefined")this.' + variable);
	}, this));

	
	s = s.replace(/\(\((.+?)\)\)/gi, $.proxy(function(match, variable){
		var id = GtObject.uniqid();
		toChange[id] = $('<span>' + eval('if (typeof this.objectData.' + variable + ' != "undefined") this.objectData.' + variable) + '</span>');
		this.objectData[variable] = toChange[id];

		return '<div id="' + id + '"></div>';
	}, this));

	//[[@salut]][[/salut]]
	s = s.replace(/\[\[\@([a-z]+?)\]\]([\s\S]+?)\[\[\/([a-z]+?)\]\]/gi, $.proxy(function(match, variable, contents){
		var id = GtObject.uniqid();
		if (!eval('if (typeof this.' + variable + ' != "undefined")this.' + variable))
		{
			alert("Demande d'accès à un widget inexistant : " + variable);
			return '';
		}

		eval('var myObject = this.' + variable + '; var myElement = myObject.find(".gt-contents"); if (myElement.length) myElement.html(contents); else {myObject.view(contents);}');

		return '';
	}, this));

	s = s.replace(/\[\[([a-z]+?)\:([\s\S]+?)\:\]\]/gi, $.proxy(function(match, variable, contents){
		var id = GtObject.uniqid();
		if (!eval('if (typeof this.' + variable + ' != "undefined")this.' + variable))
		{
			alert("Demande d'accès à un widget inexistant : " + variable);
			return '';
		}

		eval('var myObject = this.' + variable + '; var myElement = myObject.findElement(".gt-contents"); if (myElement.length) myElement.html(contents); else myVar.append(contents)');
		toChange[id] = eval('this.' + variable);

		return '<div id="' + id + '"></div>';
	}, this));
	
	s = s.replace(/\[\[([a-z0-9\.]+?)\]\]/gi, $.proxy(function(match, variable){
		var id = GtObject.uniqid();
		if (!eval('if (typeof this.' + variable + ' != "undefined")this.' + variable))
		{
			alert("Demande d'accès à un widget inexistant : " + variable);
			return '';
		}

		toChange[id] = eval('this.' + variable);
		
		return '<div id="' + id + '"></div>';
	}, this));

	//s = Mustache.render(s, this);

	//if (this.htmlElement.empty())
	//	this.htmlElement.detach();
	if (this.htmlElement.length)
	{
		var a = $(s);
		this.htmlElement.replaceWith(a);
		this.htmlElement = a;
	}
	else
		this.htmlElement = $(s);

	this.htmlElement.data('GtObject', this);
	this.htmlElement.data('GtID', this.uniqid);
	this.htmlElement.attr('data-GtID', this.uniqid);
	
	for (var i in toChange)
	{
		if ('htmlElement' in toChange[i])
		{
			toChange[i].setParent(this);
			this.htmlElement.find('#' + i).addBack('#' + i).replaceWith(toChange[i].htmlElement);
			if (this.isInDom())
				this.emitRecursiveDomEvents();
		}
		else
		{
			this.htmlElement.find('#' + i).addBack('#' + i).replaceWith(toChange[i]);
		}
	}
};

GtWidget.prototype.getTheme = function(a)
{
	return this.theme[a] || '';
};

GtWidget.prototype.setStyle = function(style)
{
	this.style = style;
	if (this.theme[style])
		this.view(this.theme[style]);
};

GtWidget.prototype.getStyle = function()
{
	return this.style;
};

GtWidget.prototype.scrollInPourcent = function(p)
{
	//this.getHTMLElement().scrollTop = this.getHTMLElement().scrollHeight / 100 * p;

	this.getHTMLElement().scrollTop = (this.getHTMLElement().scrollHeight - this.getElement().outerHeight()) / 100 * p
};

GtWidget.prototype.scrollToBottom = function()
{
	//this.scrollInPourcent(100);//Bug sometime!
	this.getHTMLElement().scrollTop = this.getHTMLElement().scrollHeight;
};

GtWidget.prototype.hasScrollBar = function()
{
	return this.getHTMLElement().scrollHeight != this.getElement().outerHeight();
};

GtWidget.prototype.getScrollInPourcent = function()
{
	return this.getElement().scrollTop() / (this.getHTMLElement().scrollHeight - this.getElement().outerHeight()) * 100;
};

GtWidget.prototype.hasScrollBar = function()
{
	return this.getHTMLElement().scrollHeight != this.getElement().outerHeight();
};

GtWidget.prototype.getScrollInPourcent = function()
{
	return this.getElement().scrollTop() / (this.getHTMLElement().scrollHeight - this.getElement().outerHeight()) * 100;
};

//Fonction jQuery
GtWidget.prototype.setId = function(id)
{
	this.getElement().attr('id', id);
};

GtWidget.prototype.addClass = function(a)
{
	this.getElement().addClass(a);
};

GtWidget.prototype.removeClass = function(a)
{
	this.getElement().removeClass(a);
};

GtWidget.prototype.hasClass = function(a)
{
	return this.getElement().hasClass(a);
};

GtWidget.prototype.setTooltip = function(title, content)
{
	this.getElement().attr('data-toggle', 'tooltip');
	if (content)
		this.getElement().attr('data-content', content);
	this.getElement().attr('title', title);
};

GtWidget.prototype.isVisible = function()
{
	return this.getElement().is(":visible");
};

GtWidget.prototype.show = function()
{
	this.getElement().show();
};

GtWidget.prototype.hide = function()
{
	this.getElement().hide();
};

GtWidget.prototype.css = function()
{
	var args = Array.prototype.slice.call(arguments);
	return this.getElement().css.apply(this.getElement(), args);
};

GtWidget.prototype.detach = function()
{
	return this.getElement().detach();
};

GtWidget.prototype.remove = function()
{
	return this.getElement().remove();
};

GtWidget.prototype.documentToWidgetPosition = function(position)
{
	return  {x:position.x - this.getElement().offset().left, y:position.y - this.getElement().offset().top};
};

GtWidget.prototype.getAbsoluteRect = function()
{
	var rectFreeze = this.getHTMLElement().getBoundingClientRect();
	var rect = {left:rectFreeze.left, top:rectFreeze.top, right:rectFreeze.right, bottom:rectFreeze.bottom};
	rect.left += window.scrollX;
	rect.top += window.scrollY;
	rect.right += window.scrollX;
	rect.bottom += window.scrollY;
	return rect;
};

GtWidget.prototype.getFixedRect = function()
{
	var rectFreeze = this.getHTMLElement().getBoundingClientRect();
	var rect = {left:rectFreeze.left, top:rectFreeze.top, right:rectFreeze.right, bottom:rectFreeze.bottom};
	return rect;
};

GtWidget.prototype.isInMe = function(position)
{
	return 	position.x >= this.getElement().offset().left &&
			position.y >= this.getElement().offset().top &&
			position.x <= this.getElement().offset().left + this.getElement().width() &&
			position.y <= this.getElement().offset().top + this.getElement().height();
};

GtWidget.prototype.setData = function(name, value)
{
	if (!this.htmlElement.length)
		this.objectData[name] = value;
	else
		this.objectData[name].html(value);
};

GtWidget.prototype.getData = function(name)
{
	if (!this.htmlElement.length)
		return this.objectData[name];
		
	return this.objectData[name].html();
};

GtWidget.prototype.setParent = function(parent)
{
	this.parent = parent;
	parent.children.push(this);
};

GtWidget.prototype.rendered = function()
{
	return !!this.m_rendered;
};

GtWidget.prototype.render = function(parent, parentGt)
{
	this.m_rendered = true;

	if (parentGt)
		this.setParent(parentGt);

	parent = parent || $('body');
    this.htmlElement = this.htmlElement.appendTo((parent.connectToJSEvent) ? parent.getElement() : parent);

	if (this.isInDom())
		this.emitRecursiveDomEvents();
};

GtWidget.prototype.isInDom = function()
{
	return document.body.contains(this.getElement()[0]);
};

GtWidget.prototype.focus = function()
{
	this.getElement().focus();
};

GtWidget.prototype.emitRecursiveDomEvents = function()
{
	this.emit('addedInDom');
	for (var i in this.children)
		this.children[i].emitRecursiveDomEvents();

};

GtWidget.prototype.fromHTML = function(html)
{
	this.htmlElement = $(html);
	this.htmlElement.data('GtObject', this);
};

GtWidget.fromElement = function(a)
{
	var w = new GtWidget();
	w.htmlElement = a;
	return w;
};

GtWidget.prototype.setElement = function(element)
{
	this.htmlElement = element;
};

GtWidget.prototype.getElement = function()
{
	return this.htmlElement;
};

GtWidget.prototype.getHTMLElement = function()
{
	return this.getElement().get(0);
};

GtWidget.prototype.findElement = function(a)
{
	return this.getElement().find(a).addBack(a);
};

GtWidget.prototype.find = function(a)
{
	return this.getElement().find(a).addBack(a);
};

GtWidget.prototype.width = function(useStoredValue)
{
	if (!useStoredValue || !this.storedWidth)
		this.storedWidth = this.htmlElement.width();
	
	return this.storedWidth;
};

GtWidget.prototype.height = function(useStoredValue)
{
	if (!useStoredValue || !this.storedHeight)
		this.storedHeight = this.htmlElement.height();
	
	return this.storedHeight;
};

GtWidget.getAsElement = function(a)
{
	return a.getElement() || a;
};

GtWidget.getAsWidget = function(a)
{
	if (typeof a != 'object')
	{
		var s = a;
		a = new GtWidget();
		a.view(s);
	}
	return a;
};