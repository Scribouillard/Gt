/**
 * Manage a socket.io connection
 *
 * @class GtSocket
 * @constructor
 */

Gt.controller('GtSocket', [], 'GtObject', function(domain, port, options){

	if (!domain)
		return;
	
	this.domain = domain;
	this.port = port;
	var options = options || {reconnectionDelay:0, reconnectionDelayMax:10000, transports: ['websocket', 'polling', 'flashsocket']};
	this.socket = ((typeof io2 != 'undefined') ? io2 : io)( domain + ':' + port, options);
	this.connect('newConnect', function(event){
		var self = this;
		((event == 'connect_error') ? this.socket.io : this.socket).on(event, function(){
			var args = Array.prototype.slice.call(arguments);
			args.splice(0, 0, event);
			self.emit.apply(self, args);
		});
	});

});

/**
 * Send a message
 *
 * @method send
 * @param {All} arg1 The first argument
 * @param {All} arg2... The first argument
 */
GtSocket.prototype.send = function()
{
	this.socket.emit.apply(this.socket, arguments);
};

/**
 * Disconnect the socket
 *
 * @method disconnect
 */
GtSocket.prototype.disconnect = function()
{
	this.socket.disconnect();
};