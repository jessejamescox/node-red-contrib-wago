module.exports = function (RED) {
  "use strict";

  function toFixed(num, precision) {
    return (+(Math.round(+(num + "e" + precision)) + "e" + -precision)).toFixed(precision);
  }

  function tempInput(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    var moduleNum = n.module;
    var channelNum = n.channel;
    var sigType = n.signal_type;

    var node = this;

    this.on("input", function (msg) {
      var o = {};
      var outValue = 0;

      var moduleStr = "module" + moduleNum;
      var channelStr = "channel" + channelNum;

      if (msg.payload.state.reported.controller.modules.hasOwnProperty(moduleStr)) {
        if (msg.payload.state.reported.controller.modules[moduleStr].channels.hasOwnProperty(channelStr)) {

          var rawInput = msg.payload.state.reported.controller.modules[moduleStr].channels[channelStr].value;


          if (sigType == "Celsius") {
            outValue = (rawInput / 10);
          }
          if (sigType == "Farenheit") {
            outValue = parseFloat(toFixed(((rawInput / 10) * (9 / 5) + 32), 2));
          }
          node.status({fill: "green", shape: "ring", text: sigType + ' : ' + outValue});
          o.payload = outValue;
          node.send(o);
        }
      }
    });
  }
  RED.nodes.registerType("temperature sensor", tempInput);
};
