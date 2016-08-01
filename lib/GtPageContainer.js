Gt.controller('GtPageContainer', [], 'GtWidget', function(type) {

	this.type = type || GtPageContainer.type.Remove;
	this.view(1);
	this.pages = {};

});

GtPageContainer.type = {Remove:0, Hide:1};

GtPageContainer.prototype.addPage = function(name, page)
{
	if (this.type == GtPageContainer.type.Hide)
	{
		page.render(this.getElement());
		if (this.currentPage != page)
			page.getElement().hide();
	}
	this.pages[name] = page;
};

GtPageContainer.prototype.setPage = function(name)
{
	var page = this.pages[name];

	if (this.type == GtPageContainer.type.Remove)
	{
		this.view();
		page.render(this.getElement(), this);
	}
	else
	{
		//if (this.inTransition)
		//	this.inTransition.run(this.currentPage);

		this.getElement().children().hide();
		page.getElement().show();
	}

	this.currentPage = page;
};

GtPageContainer.prototype.removePage = function(name)
{
	var page = this.pages[name];
	page.getElement().remove();
	this.pages[name] = null;
};

GtPageContainer.prototype.setInTransition = function(t)
{
	this.inTransition = t;
};

GtPageContainer.prototype.setOutTransition = function(t)
{
	this.outTransition = t;
};

GtPageContainer.prototype.setTransitions = function(t1, t2)
{
	this.setInTransition(t1);
	this.setOutTransition(t2);
};