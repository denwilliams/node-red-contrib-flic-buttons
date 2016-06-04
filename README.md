##node-red-contrib-flic-buttons-hci

A Node-RED node to interact with the [flic.io][1] BLE buttons.

This node requires the [fliclib-linux-hci][2] daemon (installed on a Raspberry Pi or similar)
to handle the low level communication with the buttons.

Buttons need to be paired before you can use this node at the moment.
See [fliclib-linux-hci][2] for more info on this.

The node takes 2 config parameters

 - Host - this is the host running the flic.io daemon process, defaults to localhost
 - Port - the port for the daemon process, defaults to 5551

If Node-RED is installed on the same host there is no configuration.

The node emits a `msg.payload` that looks like this
```
{ "deviceId": "00:ee:dd:77:77:33", "clickType": "ButtonSingleClick", "wasQueued": false, "timeDiff": 0 }
```

msg.topic is set to `flic/` with the deviceId of the button appended to the end

[1]: https://flic.io/?r=985093
[2]: https://github.com/50ButtonsEach/fliclib-linux-hci
