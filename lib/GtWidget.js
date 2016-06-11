/*
Gère un élément HTML
*/

Gt.controller('GtWidget', ['theme:bootstrap'], 'GtObject', function(name, htmlOptions){

	if (!GtWidget.theme)
		GtWidget.setTheme('bootstrap');

	//Provisoire ???
	if (name && name in GtWidget.theme)
		this.theme = GtWidget.theme[name];
	
	this.class = (htmlOptions) ? htmlOptions.htmlClass || '' : '';
	this.id = (htmlOptions) ? htmlOptions.htmlId || '' : '';
	this.title = (htmlOptions) ? htmlOptions.htmlTitle || '' : '';
	
	this.objectData = {};
	
	this.storedWidth = 0;
	this.storedHeight = 0;
	
	this.htmlElement = $();
});

GtWidget.theme = '';

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

	if (Number.isInteger(s))
		if (this.theme[s])
			s = this.theme[s];
		else
			return console.log('No template with this number');

	if (s.indexOf('<') != 0)
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
	
	s = s.replace(/\[\[(.+?)\]\]/gi, $.proxy(function(match, variable){
		var id = GtObject.uniqid();
		if (!eval('if (typeof this.' + variable + ' != "undefined")this.' + variable))
		{
			alert("Demande d'accès à un widget inexistant : " + variable);
			return '';
		}

		toChange[id] = eval('this.' + variable);
		
		return '<div id="' + id + '"></div>';
	}, this));

	s = Mustache.render(s, this);

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
			toChange[i].parent = this;
			this.htmlElement.find('#' + i).replaceWith(toChange[i].htmlElement);
		}
		else
		{
			this.htmlElement.find('#' + i).replaceWith(toChange[i]);
		}
	}
};

GtWidget.prototype.setStyle = function(style)
{
	if (this.theme[style])
		this.view(this.theme[style]);
};

GtWidget.setTheme = function(name)
{
	GtWidget.theme = Gt.get('theme:' + name);
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

GtWidget.prototype.render = function(parent, parentGt)
{
	if (parentGt)
		this.parent = parentGt;

	parent = parent || $('body');
    this.htmlElement = this.htmlElement.appendTo(parent);
};

GtWidget.prototype.fromHTML = function(html)
{
	this.htmlElement = $(html);
	this.htmlElement.data('GtObject', this);
};

GtWidget.prototype.setElement = function(element)
{
	this.htmlElement = element;
};

GtWidget.prototype.getElement = function()
{
	return this.htmlElement;
};

GtWidget.prototype.findElement = function(a)
{
	if (this.getElement().is(a))
		return this.getElement();
	return this.getElement().find(a);
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