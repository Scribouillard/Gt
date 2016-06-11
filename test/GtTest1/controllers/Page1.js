Gt.controller('Page1', ['GtButton', 'GtNavBar', 'GtTextEdit', 'GtForm'], 'GtWidget', function(){

	//Form
	this.form = new GtForm('Je suis un formulaire');
	this.form.connect('response', this.formResponse, this);

	this.form.add(new GtTextEdit(false, '', 'Ceci est un champ'), 'title'/*, "Title"*/);

	var t = new GtTextEdit(false, '', 'Ceci est un champ');
	//t.setStyle('password');
	this.form.add(t, 'password'/*, "Password"*/);

	//this.form.add(new GtTextEdit(true), 'text'/*, "Text"*/);

	this.button = new GtButton('OK !!!!!');
	this.form.add(this.button, ''/*, "Ceci est un bouton"*/);
	this.button.connect('click', function(){this.form.submit('actions.php')}, this);

});

Page1.prototype.formResponse = function(data)
{
	alert(data);
};