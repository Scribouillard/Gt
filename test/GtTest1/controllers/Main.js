Gt.controller('Main', ['GtButton', 'GtNavBar', 'GtTabBar', 'GtPageContainer', 'Page1', 'Page2', 'Page3', 'GtWindow'], 'GtWidget', function(){

	//NavBar
	this.navBar = new GtNavBar();
	
	
	var button = new GtButton('<i class="material-icons">menu</i>');
	button.connect('click', function(){this.container.setPage(1)}, this);
	this.navBar.add(button);

	button = new GtButton("Rue Tronchet, Paris");
	button.connect('click', function(){this.container.setPage(1)}, this);
	this.navBar.add(button);
/*
	button = new GtButton('Page2');
	button.connect('click', function(){this.container.setPage(2)}, this);
	this.navBar.add(button);*/
/*
	button = new GtButton('Ouvrir une fenêtre');
	button.connect('click', function(){GtWindow.message('Hey !')}, this);
	this.navBar.add(button);
*/

	//Container
	this.container = new GtPageContainer();
	this.page1 = new Page1();
	this.page2 = new Page2();
	this.page3 = new Page3();
	this.container.addPage(1, this.page1);
	this.container.addPage(2, this.page2);
	this.container.addPage(3, this.page3);
	this.container.setPage(1);

	//Tab
	this.tabBar = new GtTabBar(this.container);
	this.tabBar.add('Historique', 1, true);
	this.tabBar.add('Événements', 2);
	this.tabBar.add('Personnalités', 3);

});