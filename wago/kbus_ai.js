module.exports = function (RED) {
    "use strict";

    function analogInput(n) {
        RED.nodes.createNode(this, n);
        //var context = this.context();
        var node = this;
        var moduleNum = n.module;
        var channelNum = n.channel;
        var sensorType = n.sensorType;
        var resolution = n.resolution;
        var low = n.low;
        var high = n.high;
        var prec = n.precision;
        var selectedProcess = n.selectedProcess;

        // scales number
        function scale(x, i_lo, i_hi, o_lo, o_hi) {
            var multiplier = (o_hi - o_lo) / (i_hi - i_lo);
            var scaledVal = multiplier * limit(i_lo, x, i_hi) + o_lo;
            return scaledVal;
        }
        function limit(i_lo, x, i_hi) {
            var last = 0;
            if (x < i_lo) {
                return i_lo;
            } else {
                if (x > i_hi) {
                    return i_hi;
                } else {
                    return x;
                }
            }
        }
        function toFixed(num, precision) {
            var thisHold = (+(
                Math.round(+(num + "e" + precision)) +
                "e" +
                -precision
            )).toFixed(precision);
            return parseFloat(thisHold);
        }

        this.on("input", function (msg) {
            var rawMinInput = 0;
            var rawMaxInput = 0;
            var outputMsg = {};
            var actualSensorValue;
            var val_10vdc = 0;
            var val_int16 = 0;

            var moduleStr = "module" + moduleNum;
            var channelStr = "channel" + channelNum;

            if (msg.payload.state.reported.controller.modules.hasOwnProperty(moduleStr)) {
                if (msg.payload.state.reported.controller.modules[moduleStr].channels.hasOwnProperty(channelStr)) {

                    // copy in the channel value
                    var rawInput = msg.payload.state.reported.controller.modules[moduleStr].channels[channelStr].value;

                    switch (resolution) {
                        case "12_Bit":
                            rawMaxInput = 32767;
                            break;
                        case "13_Bit":
                            rawMaxInput = 32767;
                            break;
                        case "13_Bit_signed":
                            rawMinInput = -32767;
                            rawMaxInput = 32767;
                            break;
                        case "14_Bit":
                            rawMaxInput = 32767;
                            break;
                        case "15_Bit":
                            rawMaxInput = 32767;
                            break;
                        case "15_Bit_signed":
                            rawMinInput = -32767;
                            rawMaxInput = 32767;
                            break;
                        case "16_Bit":
                            rawMaxInput = 65535;
                            break;
                    }
                    switch (sensorType) {
                        case "0-20mA":
                            actualSensorValue = scale(
                                rawInput,
                                rawMinInput,
                                rawMaxInput,
                                0,
                                20
                            );
                            break;
                        case "4-20mA":
                            actualSensorValue = scale(
                                rawInput,
                                rawMinInput,
                                rawMaxInput,
                                4,
                                20
                            );
                            break;
                        case "0-10VDC":
                            actualSensorValue = scale(
                                mrawInput,
                                rawMinInput,
                                rawMaxInput,
                                0,
                                10
                            );
                            break;
                        case "+/-10VDC": // meeds work
                            if (msg.payload <= 32767) {
                                val_10vdc = scale(rawInput, 0, rawMaxInput, 0, 10);
                                actualSensorValue = val_10vdc;
                                val_int16 = rawInput;
                            } else {
                                val_10vdc = mrawInput << 1;
                                val_10vdc = val_10vdc >> 1;
                                val_10vdc = val_10vdc * -1;
                                val_int16 = val_10vdc + 32767;
                                //val_10vdc = scale(val_10vdc, rawMinInput, rawMaxInput, -10, 0);
                                val_10vdc = scale(val_int16, rawMinInput, 0, -10, 0) + 10;
                                actualSensorValue = val_10vdc;
                            }
                            break;
                        case "0-30VDC":
                            actualSensorValue = scale(
                                rawInput,
                                rawMinInput,
                                rawMaxInput,
                                0,
                                30
                            );
                            break;
                    }
                    // operation based on processSelected
                    var statusText = '';
                    switch (selectedProcess) {
                        case "Raw":
                            if (sensorType == "+/-10VDC") {
                                val_int16 = val_int16; // assigned above
                            } else {
                                val_int16 = rawInput;
                            }
                            statusText = 'Raw Value';
                            outputMsg.payload = val_int16;
                            break;
                        case "SensorVal":
                            outputMsg.payload = toFixed(actualSensorValue, prec);
                            statusText = "Sensor Value";
                            break;
                        case "Scaled":
                            if (sensorType == "+/-10VDC") {
                                var scaledHold = scale(val_10vdc + 10, 0, 20, low, high);
                            } else {
                                var scaledHold = scale(
                                    rawInput,
                                    rawMinInput,
                                    rawMaxInput,
                                    low,
                                    high
                                );
                            }
                            outputMsg.payload = toFixed(scaledHold, prec);
                            statusText = "Scaled Value";
                            break;
                    }
                    node.status({fill: "green", shape: "ring", text: statusText + ' : ' + outputMsg.payload });
                    node.send(outputMsg);
                }
            }
        });
    }
    RED.nodes.registerType("analog input", analogInput);
};
