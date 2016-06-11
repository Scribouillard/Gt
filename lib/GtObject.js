/*
Classe dont hérite toute classe qui gère des événements
*/

function GtObject()
{
    this.connections = [];
    this.uniqid = GtObject.uniqid();
}

GtObject.uniqIdCounter = 0;
GtObject.uniqid = function()
{
    GtObject.uniqIdCounter++;
    return 'GtObject_' + GtObject.uniqIdCounter;
};

/*
GtObject.prototype.addEvent = function(event)
{
    var events;
    
    if (Object.prototype.toString.call(event) === '[object Array]') //Ajout par un array
        events = event;
    else
        events = Array.prototype.slice.call(arguments); //Ajout par une liste d'arguments
    
    this.events.concat(events);
};
*/

GtObject.prototype.connect = function(event, callback, thisObject)
{
	if (!thisObject)
    	this.connections.push({event:event, callback:callback});
    else
    	this.connections.push({event:event, callback:$.proxy(callback, thisObject)});

	if (event != 'newConnect')
		this.emit('newConnect', event);
    	
    return this;
};

GtObject.prototype.emit = function()
{
	var args = Array.prototype.slice.call(arguments);
	
    for (var i in this.connections)
    {
        if (this.connections[i].event == args[0])
            this.connections[i].callback.apply(this, args.slice(1));
    }
};




/*
Objet de base
Événements : ['Loaded']
*/
function Gt(){};
Gt.prototype = new GtObject();
Gt.object = new Gt();
Gt.loadedScripts = ['GtObject'];
Gt.readyScripts = ['GtObject'];
Gt.readyCallbacks = [];
Gt.resources = {};
GtMobile = null;

Gt.require = function(dependencies, callback)
{
	for (var i = dependencies.length - 1; i >= 0; i--)
	{
		if (Gt.readyScripts.indexOf(dependencies[i]) != -1)
		    dependencies.splice(i, 1);
	}
	
	if (dependencies.length == 0)
		return callback();
		
    Gt.readyCallbacks.push({dependencies:dependencies.slice(), callback:callback});
    
	for (i = dependencies.length - 1; i >= 0; i--)
	{
		if (Gt.loadedScripts.indexOf(dependencies[i]) != -1)
		    dependencies.splice(i, 1);
	}
	
    Gt.private_load(dependencies);
};

Gt.get = function(resource)
{
    if (resource in Gt.resources)
        return Gt.resources[resource];
    
    alert("Demande d'accès à une ressource non chargée : " + resource);
    return '';
};

Gt.ready = function(module, type)//type : 0(constructor) ; 1(loading) ; 2(all)
{
	if (type == 0)
		Gt.readyScripts.push(module + '@0');
	else if (type == 1)
		Gt.readyScripts.push(module + '@1');

	if (type == 2 || (Gt.readyScripts.indexOf(module + '@0') != -1 && Gt.readyScripts.indexOf(module + '@1') != -1))
		Gt.readyScripts.push(module);
	else
		return;


    //if (Gt.readyScripts.indexOf(correctedModule) == -1)//ça arrive jamais non ? si ça arrive c'est bizarre...
    //    Gt.readyScripts.push(correctedModule);
        
    //Gt.log(module + ' loaded!');
    
    var toCall = [];
    for (var i = Gt.readyCallbacks.length - 1; i >= 0; i--)
    {
        var ok = true;
        for (var j in Gt.readyCallbacks[i].dependencies)
        {
            if (Gt.readyScripts.indexOf(Gt.readyCallbacks[i].dependencies[j]) == -1)
            {
                ok = false;
                break;
            }
        }
        if (ok)
        {
            toCall.push(Gt.readyCallbacks[i].callback);
            Gt.readyCallbacks.splice(i, 1);
        }
    }
    
    //Gt.log('Reste ' + Gt.readyCallbacks.length + ' chargement(s)', Gt.readyCallbacks);
	if (!Gt.readyCallbacks.length)
		console.log('%cChargement terminé !', 'color:black; font-weight:bold;');
    
    for (var i in toCall)
        toCall[i]();
};

Gt.private_load = function(modules)
{
	for (var i in modules)
	{
	    Gt.loadedScripts.push(modules[i]);
	    
	    var path;
	    
	    if (modules[i].indexOf(':') != -1)
	    {
	        var type = modules[i].substr(0, modules[i].indexOf(':'));
	        var name = modules[i].substr(modules[i].indexOf(':') + 1);
	        
	        if (type == 'view')
	        {
	            console.log('%cLoading of ' + name + ' view', 'color:green;');
	            path = GtObject.myDirectory + 'views/' + name + '.html';
	        }
			else if (type == 'theme')
			{
				console.log('%cLoading of ' + name + ' theme', 'color:teal;');
				path = GtObject.libDirectory + 'themes/' + name + '.json';
			}
	        else
	        {
	            Gt.log('Loading of ' + name + ' resource');
	            path = GtObject.myDirectory + name;
	        }
	        
	        Gt.loadResourceFile(path, $.proxy(function(resource){
				//if (type == "theme")
				//	console.log(xml2json(resource));
	            Gt.resources[this.name] = resource;
	            Gt.ready(this.name, 2);//vraiment horrible le this.name
	        }, {name:modules[i], type:type}));
	    }
	    else
	    {
	        if (modules[i].substr(0, 2) == 'Gt')
	        {
	            console.log('%cLoading of ' + modules[i] + ' lib', 'color:gray;');
	            path = GtObject.libDirectory + 'lib/';
	        }
			else
			{
				console.log('%cLoading of ' + modules[i] + ' controller', 'color:blue;');
			    path = GtObject.myDirectory + 'controllers/';
			}
			    
			Gt.loadScriptFile(path + modules[i] + '.js', $.proxy(function(resource){
				Gt.ready(this.name, 1);
			}, {name:modules[i]}));
	    }
	}
};

Gt.log = function()
{
	var args = Array.prototype.slice.call(arguments);
	args.splice(0, 0, 'Gt : ');
    console.log.apply(console, args);
};

Gt.loadResourceFile = function(url, callback)
{
    $.get(url, callback);
};

Gt.loadScriptFile = function(url, callback)
{
      var head = document.getElementsByTagName("head")[0];
      var script = document.createElement("script");
      script.src = url;

      // Handle Script loading
      {
         var done = false;

         // Attach handlers for all browsers
         script.onload = script.onreadystatechange = function(){
            if ( !done && (!this.readyState ||
                  this.readyState == "loaded" || this.readyState == "complete") ) {
               done = true;
               if (callback)
                  callback(url);

               // Handle memory leak in IE
               script.onload = script.onreadystatechange = null;
            }
         };
      }

      head.appendChild(script);

      // We handle everything using the script element injection
      return undefined;
};

Gt.controller = function(name, dependencies, objectType, constructor)
{
	var isGt = false;
	if (name.substr(0, 2) == 'Gt')
		isGt = true;

	dependencies.push(objectType);
	if (!isGt && objectType == 'GtWidget')
		dependencies.push('view:' + name);

	eval(name + ' = {}');
	eval(name + '.prototype = {}');

	Gt.require(dependencies, function(){


		theConstructor = function()
		{
			eval(objectType + '.call(this, "' + name + '")');//name que pour Gt normalement
			constructor.apply(this, arguments);
			if (!isGt && objectType == 'GtWidget')
				this.view(Gt.get('view:' + name));
		};

		eval('myCurrentObject = ' + name);
		eval(name + ' = theConstructor');
		eval(name + '.prototype = new ' + objectType);
		eval('for (var a in myCurrentObject){if (a == "prototype")continue; ' + name + '[a] = myCurrentObject[a]}');
		eval('for (var a in myCurrentObject.prototype){' + name + '.prototype[a] = myCurrentObject.prototype[a]}');
		Gt.ready(name, 0);
	});
};

GtObject.libDirectory = document.getElementsByTagName('script')[ document.getElementsByTagName('script').length - 1].src;
GtObject.libDirectory = GtObject.libDirectory.substr(0, GtObject.libDirectory.indexOf('Gt/lib/') + 3);
GtObject.myDirectory = '';

console.log('GtObject lib loaded!');