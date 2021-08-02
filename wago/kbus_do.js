module.exports = function (RED) {
  "use strict";

  function digitalOutput(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    var moduleNum = n.module;
    var channelNum = n.channel;

    this.on("input", function (msg) {
      // channel strings for the object creation
      var moduleStr = "module" + moduleNum;
      var channelStr = "channel" + channelNum;

      if (msg.payload === true || msg.payload === false) {
        var o = {
          payload: {
            state: {
              desired: {
                controller: {
                  modules: {
                    [moduleStr]: {
                      channels: {
                        [channelStr]: {
                          value: msg.payload,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
        node.send(o);
      }
    });
  }
  RED.nodes.registerType("digital output", digitalOutput);
};
