/**
 * Main Gt class, manages event system
 *
 * @class GtObject
 * @constructor
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
	var returnValue = undefined;

    for (var i in this.connections)
    {
        if (this.connections[i].event == args[0])
			returnValue = returnValue || this.connections[i].callback.apply(this, args.slice(1));
    }
	return returnValue;
};




/*
Objet de base
Événements : ['Loaded']
*/
function Gt(){};
Gt.prototype = new GtObject();
Gt.object = new Gt();
Gt.loadedScripts = ['GtObject', 'GtCanvasElement'];//pour Canvas : vraiment parce que j'ai la flemme de faire une plus grosse modif dans la lib
Gt.readyScripts = ['GtObject', 'GtCanvasElement'];//pour Canvas : vraiment parce que j'ai la flemme de faire une plus grosse modif dans la lib
Gt.readyCallbacks = [];
Gt.resources = {};
Gt.debug = false;
Gt.cache = true;
Gt.enableLogs = false;
Gt.currentProductionVersion = null;
Gt.touchEvents = false;
Gt.theme = '';
GtMobile = null;
/*
Gt.config = function(o)
{
	o.cache = o.cache || true;
	o.debug = o.debug || false;
	o.log = o.log || true;


};
*/
Gt.developmentMode = function(withDebug)
{
	//Gt.config({cache:false, log:true, debug:!!widthDebug});
	Gt.enableLogs = true;
	Gt.cache = false;
	Gt.debug = !!withDebug;
};

Gt.productionMode = function(n)
{
	Gt.currentProductionVersion = n || 1;
};

Gt.directories = {};

Gt.addDirectory = function(key, value)
{
	Gt.directories[key] = value;
};

Gt.require = function(trueDependencies, callback)
{
	var dependencies = trueDependencies.slice();
	for (var i in dependencies)
		if (dependencies[i].charAt(0) == '$')
			dependencies[i] = dependencies[i].slice(dependencies[i].lastIndexOf('$') + 1);

	for (i = dependencies.length - 1; i >= 0; i--)
	{
		if (Gt.readyScripts.indexOf(dependencies[i]) != -1)
		{
			dependencies.splice(i, 1);
			trueDependencies.splice(i, 1);
		}
	}
	
	if (dependencies.length == 0)
		return callback();
		
    Gt.readyCallbacks.push({dependencies:dependencies.slice(), callback:callback});
    
	for (i = dependencies.length - 1; i >= 0; i--)
	{
		if (Gt.loadedScripts.indexOf(dependencies[i]) != -1)
		{
			dependencies.splice(i, 1);
			trueDependencies.splice(i, 1);
		}
	}
	
    Gt.private_load(trueDependencies);
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
	if (Gt.debug)
		Gt.log(module + ' loaded (' + type + ')');

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

	if (Gt.debug)
		Gt.coloredLog(module + ' loaded!', 'red');
    	Gt.log(module + ' loaded!');
    
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

	if (Gt.debug)
    	Gt.log('Reste ' + Gt.readyCallbacks.length + ' chargement(s)', Gt.readyCallbacks);

	if (!Gt.readyCallbacks.length)
		Gt.stylisedLog('Chargement terminé !', 'color:black; font-weight:bold;');
    
    for (var i in toCall)
        toCall[i]();
};

Gt.private_load = function(modules)
{
	for (var i in modules)
	{
	    Gt.loadedScripts.push(modules[i]);

		var directory = null;
		if (modules[i].charAt(0) == '$')
		{
			directory = modules[i].slice(1, modules[i].lastIndexOf('$'));
			modules[i] = modules[i].slice(modules[i].lastIndexOf('$') + 1);
		}
	    
	    var path;
	    
	    if (modules[i].indexOf(':') != -1)
	    {
	        var type = modules[i].substr(0, modules[i].indexOf(':'));
	        var name = modules[i].substr(modules[i].indexOf(':') + 1);
	        
	        if (type == 'view')
	        {
				Gt.coloredLog('Loading of ' + name + ' view', 'green');
				path = (directory ? Gt.directories[directory] : GtObject.myDirectory) + 'views/' + name + '.html';
	        }
			else if (type == 'theme')
			{
				Gt.coloredLog('Loading of ' + name + ' theme', 'teal');
				path = GtObject.libDirectory + 'themes/' + name + '.json';
			}
			else if (type == 'local-theme')
			{
				Gt.coloredLog('Loading of ' + name + ' theme', 'teal');
				path = GtObject.myDirectory + 'themes/' + name + '.json';
			}
			else if (type == 'theme')
			{
				Gt.coloredLog('Loading of ' + name + ' theme', 'teal');
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
	            Gt.coloredLog('Loading of ' + modules[i] + ' lib', 'gray');
	            path = GtObject.libDirectory + 'lib/' + modules[i] + '.js';
	        }
			else
			{
				path = (directory ? Gt.directories[directory] : GtObject.myDirectory) + 'controllers/' + modules[i] + '.js';
				Gt.coloredLog('Loading of ' + modules[i] + ' controller', 'blue');
			}
			    
			Gt.loadScriptFile(path, $.proxy(function(resource){
				Gt.ready(this.name, 1);
			}, {name:modules[i]}));
	    }
	}
};

Gt.log = function()
{
	if (!Gt.enableLogs)
		return;

	var args = Array.prototype.slice.call(arguments);
	args.unshift('Gt :');
    console.log.apply(console, args);
};

Gt.coloredLog = function(log, color)
{
	if (!Gt.enableLogs)
		return;

	console.log('%cGt : ' + log, 'color:' + color + ';');
};

Gt.stylisedLog = function(log, style)
{
	if (!Gt.enableLogs)
		return;

	console.log('%cGt : ' + log, style);
};

Gt.private_addAnticacheFlag = function(a, flag)
{
	flag = flag || Math.round(Math.random() * 100000000);

	if (a.indexOf('?') != -1)
		return a + '&' + flag;

	return a + '?' + flag;
};

Gt.loadResourceFile = function(url, callback)
{
	if (!Gt.cache)
		url = Gt.private_addAnticacheFlag(url);
	if (Gt.currentProductionVersion !== null)
		url = Gt.private_addAnticacheFlag(url, Gt.currentProductionVersion);

    $.get(url, callback);
};

Gt.loadCSSFile = function(url)
{
	if (Array.isArray(url))
	{
		for (var i in url)
			Gt.loadCSSFile(url[i]);
		return;
	}

	if (!Gt.cache)
		url = Gt.private_addAnticacheFlag(url);
	if (Gt.currentProductionVersion !== null)
		url = Gt.private_addAnticacheFlag(url, Gt.currentProductionVersion);

	var head = document.getElementsByTagName("head")[0];
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", url);
	head.appendChild(link);
};

Gt.loadScriptFile = function(url, callback)
{
	if (Array.isArray(url))
	{
		var loadingTotal = url.length;
		var loadingCount = 0;
		for (var i in url)
			Gt.loadScriptFile(url[i], function(){
				loadingCount++;
				if (loadingCount == loadingTotal)
					if (callback) callback();
			});
		return;
	}

	if (!Gt.cache)
		url = Gt.private_addAnticacheFlag(url);
	if (Gt.currentProductionVersion !== null)
		url = Gt.private_addAnticacheFlag(url, Gt.currentProductionVersion);

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

Gt.controller = function(name)//, dependencies, objectType, constructor, readyCallback
{
	var dependencies = [];
	var objectType = '';
	var constructor = null;
	var readyCallback = null;
	var autoView = true;
	var namePath = name;
	if (name.indexOf('/') != -1)
		name = name.substr(name.lastIndexOf('/') + 1);

	for (var i in arguments)
		if (typeof arguments[i] == 'string' && i != 0)
			objectType = arguments[i];
		else if (typeof arguments[i] == 'object')
			dependencies = arguments[i];
		else if (typeof arguments[i] == 'function' && !constructor)
			constructor = arguments[i];
		else if (typeof arguments[i] == 'function' && constructor)
			readyCallback = arguments[i];
		else if (typeof arguments[i] == 'boolean')
			autoView = arguments[i];

	var isGt = false;
	if (name.substr(0, 2) == 'Gt')
		isGt = true;

	if (objectType)
	{
		dependencies.push(objectType);

		if (objectType.indexOf('/') != -1)
			objectType = objectType.substr(objectType.lastIndexOf('/') + 1);
	}


	if (!isGt && objectType == 'GtWidget' && autoView)
		dependencies.push('view:' + name);

	eval(name + ' = {}');
	eval(name + '.prototype = {}');
	eval(name + '.objectType = "' + objectType + '"');

	if (Gt.debug)
		Gt.log(name + ' start require', dependencies);

	Gt.require(dependencies, function(){

		theConstructor = function()
		{
			if (objectType && objectType == 'GtWidget')
				eval(objectType + '.call(this, "' + name + '")');//name que pour Gt normalement
			else if (objectType)// && objectType == 'GtObject'
				eval(objectType + '.call(this)');

			this.objectName = name;

			if (constructor)
				constructor.apply(this, arguments);

			if (!isGt && objectType == 'GtWidget' && autoView)
				this.view(Gt.get('view:' + name));
		};
		eval('myCurrentObject = ' + name);
		eval(name + ' = theConstructor');
		if (objectType)
			{eval(name + '.prototype = new ' + objectType); if (objectType == 'GtCanvas') Gt.log(name + '.prototype = new ' + objectType)}
		eval('for (var a in myCurrentObject){if (a == "prototype")continue; ' + name + '[a] = myCurrentObject[a]}');
		eval('for (var a in myCurrentObject.prototype){' + name + '.prototype[a] = myCurrentObject.prototype[a]}');
		Gt.ready(namePath, 0);
		if (readyCallback)
			readyCallback.apply(this);

	});
};

Gt.setRemoteTheme = function(name)
{
	Gt.theme = Gt.get('theme:' + name);
};

Gt.setLocalTheme = function(name)
{
	Gt.theme = Gt.get('local-theme:' + name);
};

GtObject.prototype.init = function()
{
	var args = Array.prototype.slice.call(arguments);
	var objectType = eval(this.objectName + '.objectType');
	eval(objectType + '.apply(this, args)');
};

GtObject.libDirectory = document.getElementsByTagName('script')[ document.getElementsByTagName('script').length - 1].src;
GtObject.libDirectory = GtObject.libDirectory.substr(0, GtObject.libDirectory.indexOf('Gt/lib/') + 3);
GtObject.myDirectory = '/';

Gt.log('GtObject lib loaded!');