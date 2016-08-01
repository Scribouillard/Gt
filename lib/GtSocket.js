Gt.controller('GtSocket', [], 'GtObject', function(domain, port){

	if (!domain)
		return;
	
	this.domain = domain;
	this.port = port;
	this.socket = io('http://' + domain + ':' + port, {reconnectionDelay:0, reconnectionDelayMax:10000, transports: ['websocket', 'polling', 'flashsocket']});
	this.connect('newConnect', function(event){
		var self = this;
		((event == 'connect_error') ? this.socket.io : this.socket).on(event, function(){
			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 0, event);
			self.emit.apply(self, args);
		});
	});

});

GtSocket.prototype.send = function()
{
	this.socket.emit.apply(this.socket, arguments);
};

GtSocket.prototype.disconnect = function()
{
	this.socket.disconnect();
};