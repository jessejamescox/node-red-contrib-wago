// MIT License

// Copyright (c) 2021 Jesse Cox - WAGO Corp.

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = function (RED) {
  "use strict";

  // main function constructor, registered in trailing method
  function scale(n) {
    RED.nodes.createNode(this, n);

    // **** this function does not require context, ****
    // ****if it did, we would declare it here      ****
    //var context = this.context();

    // the values inherieted from the html
    this.iMin = parseFloat(n.inputMin);
    this.iMax = parseFloat(n.inputMax);
    this.oMin = parseFloat(n.outputMin);
    this.oMax = parseFloat(n.outputMax);
    this.prec = parseInt(n.precision);

    // main node object
    var node = this;

    function scaler(x, i_min, i_max, o_min, o_max)  {
        let scaled_val = ((x - i_min) / (i_max - i_min)) 
        * (o_max - o_min) + o_min;
        return scaled_val;
    }

    // sets the decimal precision of output
    function toFixed(num, precision) {
      return (+(
        Math.round(+(num + "e" + precision)) +
        "e" +
        -precision
      )).toFixed(precision);
    }

    // function called when input is recieved
    this.on("input", function (msg) {
      // check the incoming payload to make sure its a number
      if (!isNaN(msg.payload)) {
        // process the incoming signal
        let rawInput = parseFloat(msg.payload);

        // create the output object
        let outputMsg = {};

        // now we do the work
        let scalerHold = scaler(rawInput, this.iMin, this.iMax, this.oMin, this.oMax);

        // map this hold to the output
        outputMsg.payload = parseFloat(toFixed(scalerHold, this.prec));

        // set a status - all good
        let statusString =
          "in: " + msg.payload + " out: " + outputMsg.payload;
        this.status({ fill: "green", shape: "ring", text: statusString });

        // send it!!
        node.send(outputMsg);
      } else {
        // log the error (could be log, warn, trace, debug)
        this.error("Oh no, the incoming payload is not a number");

        // set the status to error
        this.status({ fill: "red", shape: "ring", text: "payload: NaN" });
      }
    });
  }
  RED.nodes.registerType("scale", scale);
};
