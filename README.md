<h1 style="font-weight:normal">
  &nbsp;node-red-contrib-wago&nbsp;
  <a href="kbus-daemon gif"><img src=images/kbus-daemon.gif></a>
</h1>

An open source MQTT driver for WAGO PFC controllers backplane.
<br>

Features
========
* Nodes connect directly to MQTT broker either onboard the controller or externally
* Status and error messages are caught by the kbus reader
* Integrated scaling for analog input signals and process scaling for analog outputs
* Supoprt all WAGO "simple" modules, analog and digital
* Entirely event driven I/O bus minimizes network stress
* Very low CPU resource usage

Get started
===========
You must install the driver on your controller.  The installer can be found here [kbus-daemon installer](https://github.com/jessejamescox/kbus-daemon-installer), take care to update the kbus-daemon.conf file on the controller as this determines the broker and behavior of the kbus-daemon.

Requirements
============
* WAGO PFC with firmware >= 18

License
=======
node-red-contrib-wago is under the MIT license. See the [LICENSE](https://github.com/sourcerer-io/sourcerer-app/blob/develop/LICENSE.md) for more information.

Links
=====
* [Jesse Cox YouTube](https://www.youtube.com/channel/UCXEwdiyGgzVDJD48f7rWOAw)
* [Jesse Cox LinkedIn](https://www.linkedin.com/in/jesse-cox-90535110/)
