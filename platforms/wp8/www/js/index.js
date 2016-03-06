// This script will connect to the Connection Machine or the Connection Machine Emulator.
// It's an implementation of conoways game of life.
// http://www.teco.edu/wp-content/uploads/2014/10/teco_led_matrix_protocol.pdf


// TODO: evtl f�rs disconnect??
//var macAddress;
var buffer;
var matrix;
// Start listening for the deviceready-Event.
function initialize() {
	document.addEventListener('deviceready', onDeviceReady, false);
}

// Event received. We may now use PhoneGap APIs.
function onDeviceReady() {
    initMartix();
	bluetoothSerial.list(listSuccess, listFailure);
}

// Gets called when list of bonded devices was received.
function listSuccess(pairedDevices) {
    var cmSelect = document.getElementById("cm_select");
    for (var i = 0; i < pairedDevices.length; i++) {
        var option = document.createElement("option");
        option.text = pairedDevices[i].name;
        option.value = pairedDevices[i].id;
        cmSelect.add(option);
    }
}
function connectToCM(btn) {
    document.getElementById("connect_cm").disabled = true;
    var cmSelect = document.getElementById("cm_select");
    var options = cmSelect.options;
    var selectedIndex = cmSelect.selectedIndex;
    if (selectedIndex >= 0) {
        var macAddress = options[selectedIndex].value;
        bluetoothSerial.connect(macAddress, connectSuccess, connectFailure);
    }    
}

// Called when listing of bonded devices fails.
function listFailure() {	
	alert("Couldn't list paired devices. Check if your bluetooth is on");
	///console.log('Listing bonded devices failed.');
}

// Called when connection to device is established.
function connectSuccess() {
	alert("conn succ");
	
	// Write handshake.
	handshake();
}

// Called when connection to device has failed.
function connectFailure() {
    alert("could not connect to selected connection machine. Check the steps above!");
    document.getElementById("connect_cm").disabled = false;
}

// This function will try to initiate the handshake as described in
// http://www.teco.edu/wp-content/uploads/2014/10/teco_led_matrix_protocol.pdf
function handshake() {
	alert("handshake");
	var version = 1;
	var xSize = 24;
	var ySize = 24;
	var colorMode = 0;
	var appName = "PhoneGap BT Example App";
	var nameLength = appName.length;
	var packetSize = 5 + nameLength;
	
	var buffer = new ArrayBuffer(packetSize);
	var matrix = new Uint8Array(buffer);

	// Fill send buffer with version, size, color mode and name length.
	matrix[0] = version;
	matrix[1] = xSize;
	matrix[2] = ySize;
	matrix[3] = colorMode;
	matrix[4] = nameLength;
	
	// Add name to send buffer.
	for (var i = 0; i < nameLength; i++) {
		matrix[i + 5] = appName.charCodeAt(i);
	}
	
	// Send and initiate handshake.
	console.log("Sending: " + matrix);
	bluetoothSerial.write(matrix.buffer, sendHandshakeSuccess, sendHandshakeFailure);
}

// Called when bluetooth send (handshake) fails.
function sendHandshakeFailure() {
    alert("Handshake write failed. Try Again!");
    document.getElementById("connect_cm").disabled = false;
}

// Called when bluetooth send (handshake) was successful.
function sendHandshakeSuccess() {
	//alert("hand succ");
	// Wait 1-2 seconds for handshake response, then read it.
	setTimeout(function() { bluetoothSerial.read(handshakeReadSuccess, handshakeReadFailure)}, 2000);
}

// Called when reading of handshake response fails.
function handshakeReadFailure() {
    alert("Handshake read failed. Try Again!");
}

// Called when reading of handshake response was successful.
function handshakeReadSuccess(resp) {
	alert("hand read succ");
    //location.assign("menu.html");
	document.getElementById("indexPage").style.display = "none";
	document.getElementById("canvasPage").style.display = "block";
	createGolField();
}

function initMartix() {
    buffer = new ArrayBuffer(576);
    matrix = new Uint8Array(buffer);
    for (var i = 0; i < 24; i++) {
        for (var j = 0; j < 24; j++) {
            matrix[i * 24 + j] = 0;
        }
    }
}
function sendData(x, y, value) {
    matrix[x * 24 + y] = value;
    bluetoothSerial.write(matrix.buffer, sendSuccess, sendFailure);
}

// Called when sending of frame to CM was successful.
function sendSuccess() {
	//alert("write succ");
	console.log('Received Events: ' + 'sendSuccess');
}

// Called when sending of frame to CM fails.
function sendFailure() {
	//alert("write fail");
	console.log('Received Events: ' + 'sendFailure');
}



