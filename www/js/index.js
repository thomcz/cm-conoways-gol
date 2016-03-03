// UUIDs for the button service and characteristic
var BUTTON_SERVICE_UUID = "FFE0";
var BUTTON_CHARACTERISTIC_UUID = "FFE1";

// Start listening for deviceready event.
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
	// For this plugin, we'd have to use the CLI or PhoneGap Build
	// (https://github.com/katzer/cordova-plugin-background-mode)
	// window.plugin.backgroundMode.enable();
}

// Check if BLE is enabled and available, then start BLE scan.
function scanAndConnect() {
	ble.isEnabled(bleEnabled, bleDisabled);
}

function bleDisabled() {
	alert("Please enable Bluetooth first.");
}

// BLE is enabled, start scan for 5 seconds.
function bleEnabled() {
	ble.scan([], 5, function(device) {
		// Check if the device is named "SensorTag" and connect if it is.
		if (device.name === "SensorTag") {
			ble.connect(device.id, connectSuccess, connectFailure);
		}
	}, function() {
		console.log("Scan failed.");
	});
}

// Start notification for button characteristic of button service.
function connectSuccess(peripheral) {
	console.log(JSON.stringify(peripheral));
	ble.startNotification(peripheral.id, BUTTON_SERVICE_UUID, BUTTON_CHARACTERISTIC_UUID, notification, notificationFailure);
}

// Connection failed.
function connectFailure(peripheral) {
	alert("Failed to connect.");
}

// Got notification. This means a button was pressed or released.
function notification(buffer) {
	var byteArray = new Uint8Array(buffer);
	if (byteArray[0] == 1) {
		// Vibrate (2 minutes)
		navigator.vibrate(1000 * 60 * 2);
		
		// Or vibrate with custom pattern.
		// navigator.vibrate([500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500]);
	} else if (byteArray[0] == 2) {
		// Stop vibration.
		navigator.vibrate(0);
	}
	console.log("Button pressed: " + byteArray[0]);
	
}

// Notification failed.
function notificationFailure() {
	alert("Notification request failed");
}

