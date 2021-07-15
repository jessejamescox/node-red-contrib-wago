module.exports = function(RED) {
    "use strict";

    function tempInput(n) {
       RED.nodes.createNode(this,n);
       //var context = this.context();
       var node = this;
       var module_num = n.module;
       var channel_num = n.channel;
       var signal_type = n.signal_type;  
       var outValue;     

       function toFixed( num, precision ) {
        return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
        }

        this.on('input', function(msg) {
            var outputMsg = {};
            var actual_module_num = msg.payload.payload.module;
            var actual_channel_num = msg.payload.payload.channel;
            var raw_input = msg.payload.payload.value;


            if ((actual_channel_num == channel_num) && (actual_module_num == module_num)) {
                if (signasignal_typeType == "Celsius")    {
                    outValue = toFixed((raw_input / 10), 2);
                }
                if (signal_type == "Farenheit")  {
                    outValue = toFixed((raw_input / 10 * (9/5) + 32), 2);              
                }    
                outputMsg.payload = parseFloat(outValue);       
                node.send(outputMsg);
            }
        });
    }
    RED.nodes.registerType("Temperature Input",tempInput);
};