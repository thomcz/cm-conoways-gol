# Conoways Game of Life for the connection machine

This is an implementation of [Conoways Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) for the [connection machine](https://en.wikipedia.org/wiki/Connection_Machine). 
You can run it on the connection machine at the [KIT](https://www.teco.kit.edu/cm/dev/) or on the [emulator](https://www.teco.kit.edu/cm/dev/#topic_5).

##Installation
Copy the project to a new directory.  
This code requires [cordova-cli](https://github.com/apache/cordova-cli), which require [node.js](http://nodejs.org)

    $ npm install cordova -g

Adding platforms generates the native projects. Run the following commands in the projects folder.

    $ cordova platform add android
    $ cordova platform add wp8

Install the Bluetooth Serial [plugin](https://github.com/don/BluetoothSerial) with cordova

    $ cordova plugin add cordova-plugin-bluetooth-serial

Now you can open the project in Visual Studio or Android Studio and run it on your phone.

NOTE: Don't edit the HTML or JS in the generated projects. Edit the source in ~/cm-conoways-gol/www and rebuild it.

    $ cordova platform update android
    $ cordova platform update wp8
