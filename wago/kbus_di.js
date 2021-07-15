module.exports = function(RED) {
    "use strict";

    function digitalInput(n) {
       RED.nodes.createNode(this,n);
       var node = this;
       var moduleNum = n.module
       var channelNum = n.channel
       //var bitSize = parseInt(n.outputs);
       //var bitOffset = n.offset;

        this.on('input', function(msg) {
            var actualModuleNum = msg.payload.payload.module;
            var actualChannelNum = msg.payload.payload.channel;
            var rawInput = msg.payload.payload.value;

            if ((actualChannelNum == channelNum) && (actualModuleNum == moduleNum)) {
              var outputMsg = {};
              outputMsg.payload = rawInput;
              node.send(outputMsg);
          }
        });
    }
    RED.nodes.registerType("digital input",digitalInput);
};
