# node-red-contrib-h801

![H801](https://raw.githubusercontent.com/originallyus/node-red-contrib-h801/master/h801.jpg "H801")

![Screenshot](https://raw.githubusercontent.com/originallyus/node-red-contrib-h801/master/screenshot.png "Screenshot")

This is a NodeRed node for controlling H801 RGBW LED Controller without modification to H801 firmware.


Developed by the super cool folks at [Originally US](http://originally.us) - a mobile app development company from Singapore

## Installation

Install directly from your NodeRED's Setting Pallete

or

Change your working directory to your node red installation. Usually it's in ~/.node-red.

    $ npm install node-red-contrib-h801
    


## FAQ

##### Do I need custom firmware for my H801 controller?
No. The only requirement is H801 must be reachable from your NodeRED via broadcast UDP traffic.

##### How do I find the MAC Address for my H801 controller?
You may use **Fing** app on iOS/Android to look it up in your network. It should be branded as 'Espressif' and usually starts with "18:FE...". [see screenshot](https://raw.githubusercontent.com/originallyus/node-red-contrib-h801/master/screenshot_fing.jpg)

##### I have some suggestions, how do I get in touch?
Please drop us an [email](mailto:hello@originally.us), or create an issue in our [Github](https://github.com/originallyus/node-red-contrib-h801/issues)

##### How do I control my other (non-smart) devices at home with NodeRED?
Check out [RMPlugin app](https://play.google.com/store/apps/details?id=us.originally.tasker&hl=en) developed by us. Here's an [intro video](https://www.youtube.com/watch?v=QUKYKhK57sc) for the hardware.

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/675K2XU83RpTxWJP4HRjD8mC/originallyus/node-red-contrib-h801'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/675K2XU83RpTxWJP4HRjD8mC/originallyus/node-red-contrib-h801.svg' />
</a>