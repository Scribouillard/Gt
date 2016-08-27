Gt.controller('GtButton', [], 'GtWidget', function(text){

	this.buttons = [];
	this.panel = "";

	this.text = text || '';

	if (this.text.substr(0, 3) == 'fa-')
		this.text = '<span class="fa ' + this.text + '"></span>';

	this.panelFrom = 'right';

	this.view(1);

	this.connectToJSEvent('click', 'click', true);
	
});

GtButton.prototype.setText = function(text)
{
	if (text.substr(0, 3) == 'fa-')
		text = '<span class="fa ' + text + '"></span>';

	if (!this.buttons.length)
		this.getElement().html(text);
	else
		this.find('.gt-main-button').html(text +  ' <span class="caret"></span>');
};

GtButton.prototype.getText = function()
{
	return this.getElement().html();
};

GtButton.prototype.addButton = function(html)
{
	var button = new GtButton(html);
	button.view(3);

	if (!this.buttons.length)
		this.view(2);
	
	button.render(this.findElement('.gt-buttonList'), this);

	this.buttons.push(button);
	return button;
};

GtButton.prototype.showPanelFrom = function(position)
{
	var possibilities = ['left', 'right'];
	if (possibilities.indexOf(position) >= 0)
	{
		this.panelFrom = position;
	}
};

GtButton.prototype.setPanel = function(element)
{
	if (this.getElement().parent().hasClass(".dropdownPanel"))
		return;

	element.parent = this;

	this.getElement().wrap('<div class="dropdownPanel"></div>');
	this.setElement(this.getElement().closest('.dropdownPanel'));
	this.getElement().append('<div class="panelBox"></div>');
	//this.panel = element.getElement();
	element.render(this.findElement('.panelBox'), this);
	//this.findElement('.panelBox').append(this.panel);
	this.connect('click', $.proxy(function(e){
		//this.emit('hidePanel');// Closing other panels
		if (this.findElement('.panelBox').is(':hidden'))
		{
			this.emit("panelShow", e);

			var panelBox = this.findElement('.panelBox');
			panelBox.removeClass('panelLeft panelRight');
			panelBox.addClass('panel' + this.panelFrom);
			panelBox.stop().show();
		}
		else
		{
			this.emit("panelHide");
			this.findElement('.panelBox').stop().hide();
		}
	}, this));

	this.connect('hidePanel', $.proxy(function(){
		this.closePanel();
	}, this));
};

GtButton.prototype.closePanel = function()
{
	//console.log("Receiving hide pannel");
	if (this.getElement().hasClass('dropdownPanel'))
	{
		this.getElement().parent().find('.panelBox').stop().hide();
	}
};






















/*
Gt.require(["GtWidget"], function(){
	
	GtButton = function(text, htmlOptions)
	{
		this.buttons = [];
		this.panel = "";

		GtWidget.call(this, 'GtButton', htmlOptions);

		this.text = text || '';

		if (this.text.substr(0, 3) == 'fa-')
			this.text = '<span class="fa ' + this.text + '"></span>';
		else if (this.text.substr(0, 8) == 'ui-icon-')
		{
			this.class = 'ui-nodisc-icon ui-btn-b ui-btn ui-btn-icon-notext ui-corner-all ' + this.text;
			this.text = '';
		}

		this.panelFrom = 'right';

		this.view(this.theme.html);

		this.connectToJSEvent('click', 'click', true);
	};
	
	GtButton.prototype = new GtWidget();

	
	GtButton.prototype.setText = function(text)
	{
		if (!this.buttons.length)
			this.getElement().html(text);
		else
			this.findElement('#' + this.id).html(text);
	};
	
	GtButton.prototype.getText = function()
	{
		return this.getElement().html();
	};
	
	GtButton.prototype.addButton = function(html)
	{
		if (!this.buttons.length)
		{
			this.getElement().wrap('<div class="dropdown" style="display:inline-block;"></div>');
			this.getElement().after('<ul class="dropdown-menu" aria-labelledby="' + this.id + '"></ul>');
			this.getElement().append(' <span class="caret"></span>');
			this.getElement().attr('data-toggle', 'dropdown');
			this.getElement().addClass('dropdown-toggle');
			this.setElement(this.getElement().parent());
		}
		this.findElement('ul').append('<li></li>');
		
		var button = new GtButton(html);
		button.getElement().removeClass('btn');
		button.getElement().removeClass('btn-primary')
		button.render(this.findElement('ul li:last'));
		
		this.buttons.push(button);
		return button;
	};
	
	GtButton.prototype.setAction = function(id, html)
	{
		
	};
	
	GtButton.prototype.removeAction = function(id)
	{
		
	};
	
	GtButton.prototype.showPanelFrom = function(position)
	{
		var possibilities = ['left', 'right'];
		if (possibilities.indexOf(position) >= 0)
		{
			this.panelFrom = position;	
		}
	};
	
	GtButton.prototype.setPanel = function(element)
	{
		if (this.getElement().parent().hasClass(".dropdownPanel"))
			return;
			
		element.parent = this;
		
		this.getElement().wrap('<div class="dropdownPanel"></div>');
		this.setElement(this.getElement().closest('.dropdownPanel'));
		this.getElement().append('<div class="panelBox"></div>');
		this.panel = element.getElement();
		this.findElement('.panelBox').append(this.panel);
		this.connect('click', $.proxy(function(){
			//this.emit('hidePanel');// Closing other panels
			if (this.findElement('.panelBox').is(':hidden'))
			{
				this.emit("panelShow");
				
				var panelBox = this.findElement('.panelBox');
				panelBox.removeClass('panelLeft panelRight');
				panelBox.addClass('panel' + this.panelFrom);
				panelBox.stop().show();
			}
			else
			{
				this.emit("panelHide");
				this.findElement('.panelBox').stop().hide();
			}
		}, this));
		
		this.connect('hidePanel', $.proxy(function(){
			this.closePanel();
		}, this));
	};
	
	GtButton.prototype.closePanel = function()
	{
		//console.log("Receiving hide pannel");
		if (this.getElement().hasClass('dropdownPanel'))
		{
			this.getElement().parent().find('.panelBox').stop().hide();
		}
	};

	Gt.ready('GtButton');
});*/