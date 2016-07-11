 "use strict";

var createClient = require('../lib/client');

module.exports = function(RED) {
	function flic(n) {
		RED.nodes.createNode(this,n);
		this.host   = n.host;
		this.port   = n.port;
		this.topic  = n.topic;
		this.flic   = createClient(this.host, this.port);

		var node = this;

		node.status({fill:"green",shape:"dot",text:"connected"});

		function onClick(evt){
			var msg = {
				topic: this.topic||'flic' + '/' + evt.deviceId,
				payload: evt
			}
			node.send(msg);
		}

		this.flic.on('online', function(){
			node.status({fill:"green",shape:"dot",text:"connected"});
		});

		this.flic.on('offline', function(){
			node.status({fill:"red",shape:"dot",text:"disconnected"});
		});

		this.flic.on('click', onClick);

		this.flic.on('error', function (err) {});

		this.on('close', function(){
			node.flic.removeListener('click', onClick);
			node.flic.close();
		});
	}
	RED.nodes.registerType('flic', flic);
};
