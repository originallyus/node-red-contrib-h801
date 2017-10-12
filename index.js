module.exports = function(RED) 
{
    //variables placed here are shared by all nodes

    //NodeRED node constructor
    function NodeRedH801(config) 
    {
        RED.nodes.createNode(this, config);
        var thisNode = this;

        validateConfig(thisNode, config);

        thisNode.on('input', function(msg) {
            implementation(thisNode, config, msg);
            thisNode.send(msg);
        });
    }

    //NodeRED registration
    RED.nodes.registerType("h801", NodeRedH801, {
      
    });


    // -----------------------------------------------------------------------------------------------
    // Implementation
    // -----------------------------------------------------------------------------------------------

    function validateConfig(thisNode, config) {
        //Node parameters
        var mac = "";
        if (config.mac && config.mac.length > 10)
            mac = config.mac;
        var broadcastAddress = "255.255.255.255";
        if (config.broadcast && config.broadcast.length > 10)
            broadcastAddress = config.broadcast;

        //Validate MAC Address
        if (mac.trim().length < 17) {
            thisNode.status({fill:"red", shape:"ring", text:"invalid MAC address length"});
            return false;
        }
        var macParts = mac.split(":");
        if (macParts.length < 6) {
            thisNode.status({fill:"red", shape:"ring", text:"invalid MAC address format"});
            return false;
        }

        return true;
    }

    function implementation(thisNode, config, msg) {

        var isValid = validateConfig(thisNode, config);
        if (!isValid)
            return false;

        //Split MAC Address parts
        var mac = config.mac;
        if (msg.mac && msg.mac.length > 10 && msg.mac.split(":") >= 6)
            mac = msg.mac;
        var macParts = mac.split(":");
        var mac5 = parseInt(macParts[5], 16);
        var mac4 = parseInt(macParts[4], 16);
        var mac3 = parseInt(macParts[3], 16);

        //Broadcast address (optional)
        var broadcastAddress = "255.255.255.255";
        if (config.broadcast && config.broadcast.length > 10)
            broadcastAddress = config.broadcast;
        if (msg.broadcast && msg.broadcast.length > 10 && msg.broadcast.split(".") >= 4)
            broadcastAddress = msg.broadcast;

        //Repeat parameter
        var repeat = 3;
        if (config.repeat)
            repeat = config.repeat;
        if (msg.repeat)
            repeat = msg.repeat;
        if (repeat < 1)
            repeat = 1;

        //Color parameters
        var red = 0;
        if (config.r)       red = config.r;
        if (msg.r)          red = msg.r;
        var green = 0;
        if (config.g)       green = config.b;
        if (msg.g)          green = msg.g;
        var blue = 0;
        if (config.b)       blue = config.b;
        if (msg.b)          blue = msg.b;
        var w1 = 0;
        if (config.w1)      w1 = config.w1;
        if (msg.w1)         w1 = msg.w1;
        var w2 = 0;
        if (config.w2)      w2 = config.w2;
        if (msg.w2)         w2 = msg.w2;
        var colorMsg = "" + red + "," + green + "," + blue + "," + w1 + "," + w2;

        //Buffer data
        var bufferMsg = [
                            0xfb,  //mode
                            0xeb,
                            red,   //red
                            green, //green
                            blue,  //blue
                            w1,    //w1
                            w2,    //w2
                            mac5,  //mac address, last 3 numbers only
                            mac4,
                            mac3,
                            0x00,  //ending
                        ];
        var bufferMessage = new Buffer(bufferMsg);

        //Create UDP socket
        const PORT = 30977;
        var dgram = require('dgram');
        var client = dgram.createSocket('udp4');
        client.on('listening', function(){
            client.setBroadcast(true);
        });

        //Clean up procedure before re-deploy
        thisNode.on('close', function(removed, done) {
            if (client === null)
                return;
            client.close(function(){
                done();
            });
        });

        //Send multiple times
        for (i = 0; i < repeat; i++) 
        { 
            client.send(bufferMessage, 0, bufferMessage.length, PORT, broadcastAddress, function(err, bytes) {
                if (err) {
                    console.error(err);
                    thisNode.status({fill:"red", shape:"dot", text:"failed (" + err + ")"});
                }
                else {
                    thisNode.status({fill:"green", shape:"dot", text:"sent " + colorMsg});
                }

                //Clean up in the last iteration
                if (i >= repeat - 1 && client !== null) {
                    client.close();
                    client = null;
                }
            });
        }
    }
}
