Gt.controller('Main', ['GtButton', 'GtNavBar', 'GtPageContainer', 'Page1', 'Page2', 'GtWindow'], 'GtWidget', function(){

	//NavBar
	this.navBar = new GtNavBar();
	
	
	var button = new GtButton('<i class="material-icons">menu</i>');
	button.connect('click', function(){this.container.setPage(1)}, this);
	this.navBar.add(button);

	button = new GtButton('SNCF');
	button.connect('click', function(){this.container.setPage(1)}, this);
	this.navBar.add(button);

	button = new GtButton('Page2');
	button.connect('click', function(){this.container.setPage(2)}, this);
	this.navBar.add(button);
/*
	button = new GtButton('Ouvrir une fenêtre');
	button.connect('click', function(){GtWindow.message('Hey !')}, this);
	this.navBar.add(button);
*/

	//Container
	this.container = new GtPageContainer();
	this.page1 = new Page1();
	this.page2 = new Page2();
	this.container.addPage(1, this.page1);
	this.container.addPage(2, this.page2);
	this.container.setPage(1);
});