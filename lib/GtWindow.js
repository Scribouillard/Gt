/*
Gère une fenêtre qui peut contenir un widget
Événements : ['Opened', 'Closed', 'Moved']
*/

Gt.controller('GtWindow', ['GtButton'], 'GtWidget', function(title, body) {

	this.title = title || '';
	this.body = body || '';
	this.created = false;

	this.closeButton = new GtButton('Fermer');
	var self = this;
	this.closeButton.connect('click', function () {
		self.remove();
	});

	this.view(1);

	var self2 = this.getElement();
	this.getElement().on('hidden.bs.modal', function() {
		$(this).data('bs.modal', null);
		self2.remove();
		$('.modal-backdrop').remove();
	});
});

GtWindow.message = function(message, title)
{
	title = title || 'Message';

	var w = new GtWindow(title, message);
	w.show();
	return w;
};

GtWindow.confirm = function(title, message, onConfirm, onCancel)
{
	title = title || 'Question';

	var w = new GtWindow(title, message);
	w.setClosable(false);
	var b1 = new GtButton('Annuler');
	if (onCancel)
		b1.connect('click', onCancel);
	b1.connect('click', function(){w.remove()});
	w.addButton(b1);
	var b2 = new GtButton('Confirmer');
	b2.connect('click', onConfirm);
	b2.connect('click', function(){w.remove()});
	w.addButton(b2);
	w.show();
	return w;
};

GtWindow.question = function(title, message, onConfirm, onCancel)
{
	title = title || 'Question';

	var w = new GtWindow(title, message);
	w.setClosable(false);
	var b1 = new GtButton('Non');
	if (onCancel)
		b1.connect('click', onCancel);
	b1.connect('click', function(){w.remove()});
	w.addButton(b1);
	var b2 = new GtButton('Oui');
	b2.connect('click', onConfirm);
	b2.connect('click', function(){w.remove()});
	w.addButton(b2);
	w.show();
	return w;
};

GtWindow.loadingWindows = [];

GtWindow.loading = function(message, title)
{
	title = title || 'Chargement';

	for (var i in GtWindow.loadingWindows)
		if (GtWindow.loadingWindows[i].title == title && GtWindow.loadingWindows[i].body == message)
			return false;

	var w = new GtWindow(title, message);
	w.setClosable(false);
	w.show();
	GtWindow.loadingWindows.push(w);
	return w;
};

GtWindow.loaded = function(message, title)
{
	for (var i in GtWindow.loadingWindows)
		GtWindow.loadingWindows[i].remove();
};

GtWindow.prototype.addButton = function(button)
{
	this.findElement('.my_other_buttons').append(button.htmlElement);
	this.findElement('.my_other_buttons').css('float', 'left');
};

GtWindow.prototype.setBodyWidget = function(widget)
{
	this.bodyWidget = widget;
	widget.parent = this;
	widget.render(this.findElement('.modal-body'));
};

GtWindow.prototype.getBodyWidget = function()
{
	return this.bodyWidget || this.findElement('.modal-body');
};

GtWindow.prototype.setBody = function(body)
{
	this.findElement('.modal-body').html(body);
};

GtWindow.prototype.setTitleWidget = function(widget)
{
	this.titleWidget = widget;
	widget.parent = this;
	widget.render(this.findElement('.modal-title'));
};

GtWindow.prototype.getTitleWidget = function()
{
	return this.titleWidget;
};

GtWindow.prototype.setClosable = function(closable)
{
	if (!closable)
	{
		this.closeButton.htmlElement.hide();
		this.findElement('.modal-header .close').hide();
		this.getElement().modal();
	}
};

GtWindow.prototype.setTitle = function(title)
{
	this.findElement('.modal-title').html(title);
};

GtWindow.prototype.show = function()
{
	if (!this.created)
	{
		this.created = true;
		this.render();
		if (!GtMobile && $.fn.draggable)
			this.getElement().draggable({handle:".modal-header"});
	}

	if (!GtMobile)
		this.getElement().modal({backdrop: 'static'});
	else
		$.mobile.changePage('[data-GtID="' + this.uniqid + '"]', {role:"dialog"});
};

GtWindow.prototype.hide = function()
{
	this.getElement().modal('hide');
};

GtWindow.prototype.remove = function()
{
	this.getElement().modal('hide').data('bs.modal', null);
};