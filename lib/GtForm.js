Gt.controller('GtForm', [], 'GtWidget', function(title) {

	this.title = title || '';
	this.method = 'POST';
	this.view(1);
	this.connectToJSEvent('submit', this.private_submitted, true);

});

GtForm.prototype.add = function(element, name, label)
{
	if (name)
		element.getElement().attr('name', name);
	
	var w = new GtWidget();
	w.view((label) ? this.theme.label : this.theme.element);
	if (label)
	{
		w.findElement('label').html(label);
		w.findElement('label').attr('for', element.uniqid);
		element.getElement().attr('id', element.uniqid);
	}
	element.render(w.findElement('.gt-label-input'), this);
	w.render(this.findElement('.gt-form-container'));
};

GtForm.prototype.addHidden = function(name, value)
{
	this.getElement().append('<input type="hidden" value="' + value + '" name="' + name + '"');
};

GtForm.prototype.submit = function(target, method)
{
	if (method)
		this.method = method;
	if (target)
		this.target = target;

	this.getElement().submit();
};

GtForm.prototype.private_submitted = function()
{
	var data = {};

	this.findElement('input').each(function(){
		data[$(this).attr('name')] = $(this).val();
	});
	this.findElement('textarea').each(function(){
		data[$(this).attr('name')] = $(this).html();
	});
	this.findElement('select').each(function(){
		data[$(this).attr('name')] = $(this).val();
	});

	var self = this;
	$.ajax({
		type: this.method,
		url: this.target,
		data: data,
		success: function(a){self.emit('response', a)},
		error: function(){if (GtWindow) GtWindow.message("Impossible de valider le formulaire actuellement.", 'Erreur')}
	});
};