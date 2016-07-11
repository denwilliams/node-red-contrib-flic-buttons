var fliclib = require("./fliclib");
var EventEmitter = require('events').EventEmitter;

function createClient(host, port) {
  var FlicClient = fliclib.FlicClient;
  var FlicConnectionChannel = fliclib.FlicConnectionChannel;
  var FlicScanner = fliclib.FlicScanner;

  var client = new FlicClient((host || "localhost"), (port || 5551));
  var online = false;
  var e = new EventEmitter();
  e.close = function () {
    client.close();
  };

  function listenToButton(bdAddr) {
  	var cc = new FlicConnectionChannel(bdAddr);
  	client.addConnectionChannel(cc);
    cc.on("buttonSingleOrDoubleClickOrHold", function(clickType, wasQueued, timeDiff) {
  		// console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
      e.emit('click', {deviceId: bdAddr, clickType: clickType, wasQueued: wasQueued, timeDiff: timeDiff});
  	});
  	cc.on("buttonUpOrDown", function(clickType, wasQueued, timeDiff) {
  		// console.log(bdAddr + " " + clickType + " " + (wasQueued ? "wasQueued" : "notQueued") + " " + timeDiff + " seconds ago");
  	});
  	cc.on("connectionStatusChanged", function(connectionStatus, disconnectReason) {
  		// console.log(bdAddr + " " + connectionStatus + (connectionStatus == "Disconnected" ? " " + disconnectReason : ""));
  	});
  }

  client.once("ready", function() {
  	client.getInfo(function(info) {
  		info.bdAddrOfVerifiedButtons.forEach(function(bdAddr) {
  			listenToButton(bdAddr);
  		});
  	});
  });

  client.on("ready", function() {
  	// console.log("Connected to daemon!");
    if (online) return;
    online = true;
    e.emit('online');
  });

  client.on("bluetoothControllerStateChange", function(state) {
  	// console.log("Bluetooth controller state change: " + state);
  });

  client.on("newVerifiedButton", function(bdAddr) {
  	// console.log("A new button was added: " + bdAddr);
  	listenToButton(bdAddr);
  });

  client.on("error", function(error) {
  	// console.log("Daemon connection error: " + error);
    e.emit('error', error);
  });

  client.on("close", function(hadError) {
    if (!online) return;
    online = false;
  	// console.log("Connection to daemon is now closed");
    e.emit('offline');
  });

  return e;
}

module.exports = createClient;
