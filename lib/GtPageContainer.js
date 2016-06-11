Gt.controller('GtPageContainer', [], 'GtWidget', function() {

	this.view();
	this.pages = {};

});

GtPageContainer.prototype.addPage = function(name, page)
{
	this.pages[name] = page;
};

GtPageContainer.prototype.setPage = function(name)
{
	var page = this.pages[name];
	this.currentPage = page;

	this.view();
	page.render(this.getElement(), this);
};