// This script will connect to the Connection Machine or the Connection Machine Emulator.
// It's an implementation of conoways game of life.
// http://www.teco.edu/wp-content/uploads/2014/10/teco_led_matrix_protocol.pdf


// TODO: evtl fürs disconnect??
//var macAddress;
var buffer;
var matrix;
var connectBtn;
//because don't divide by 0
var maxFPS = 1;
// Start listening for the deviceready-Event.
function initialize() {
    document.addEventListener('deviceready', onDeviceReady, false);    
}

// Event received. We may now use PhoneGap APIs.
function onDeviceReady() {
    initMartix();
    connectBtn = document.getElementById("connect_cm");
	bluetoothSerial.list(listSuccess, listFailure);
}

// Gets called when list of bonded devices was received. It gets all
// paired devices of the phone and make a list for the user.
function listSuccess(pairedDevices) {
    var cmSelect = document.getElementById("cm_select");
    for (var i = 0; i < pairedDevices.length; i++) {
        var option = document.createElement("option");
        option.text = pairedDevices[i].name;
        option.value = pairedDevices[i].id;
        cmSelect.add(option);
    }
}

// tries to connect to the cm after the user clicked the connect button.
function connectToCM(btn) {
    connectBtn.disabled = true;
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
    connectBtn.innerHTML = "connect";
}

// Called when connection to device is established and initiate handshake.
function connectSuccess() {
    connectBtn.innerHTML = "initiate handshake";
	// Write handshake.
	handshake();
}

// Called when connection to device has failed.
function connectFailure() {
    alert("could not connect to selected connection machine. Check the steps above!");
    document.getElementById("connect_cm").disabled = false;
    connectBtn.innerHTML = "connect";
}

// This function will try to initiate the handshake as described in
// http://www.teco.edu/wp-content/uploads/2014/10/teco_led_matrix_protocol.pdf
function handshake() {
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
	bluetoothSerial.write(matrix.buffer, sendHandshakeSuccess, sendHandshakeFailure);
}

// Called when bluetooth send (handshake) fails.
function sendHandshakeFailure() {
    alert("Handshake write failed. Try Again!");
    
    connectBtn.innerHTML = "connect";
}

// Called when bluetooth send (handshake) was successful.
function sendHandshakeSuccess() {
    connectBtn.innerHTML = "handshake was successful";
	// Wait 1-2 seconds for handshake response, then read it.
	setTimeout(function() { bluetoothSerial.read(handshakeReadSuccess, handshakeReadFailure)}, 2000);
}

// Called when reading of handshake response fails.
function handshakeReadFailure() {
    alert("Handshake read failed. Try Again!");
    document.getElementById("connect_cm").disabled = false;
    connectBtn.innerHTML = "connect";
}

// Called when reading of handshake response was successful.
function handshakeReadSuccess(resp) {
    connectBtn.innerHTML = "connection established";
    maxFPS = resp.charCodeAt(1);
    changePage("indexPage", "golMainPage");
    initCanvasas();
}

// Hides the oldPage and shows the newPage.
function changePage(oldPage, newPage) {
    document.getElementById(oldPage).style.display = "none";
    document.getElementById(newPage).style.display = "block";
}

// initiate empty cm matrix.
function initMartix() {
    buffer = new ArrayBuffer(576);
    matrix = new Uint8Array(buffer);
    for (var i = 0; i < 24; i++) {
        for (var j = 0; j < 24; j++) {
            matrix[i * 24 + j] = 0;
        }
    }
}

//sends single cell to the cm.
function sendData(x, y, value) {    
    matrix[x * 24 + y] = value;
    bluetoothSerial.write(matrix.buffer, sendSuccess, sendFailure);
}

//sends whole game state (matrix) to the cm.
function sendGameState(gameState) {
    for (var i = 0; i < 24; i++) {
        for (var j = 0; j < 24; j++) {
            matrix[i * 24 + j] = gameState[i][j];
        }
    }
    bluetoothSerial.write(matrix.buffer, sendSuccess, sendFailure);
}

// Called when sending of frame to CM was successful.
function sendSuccess() {
	console.log('Received Events: ' + 'sendSuccess');
}

// Called when sending of frame to CM fails.
function sendFailure() {
	console.log('Received Events: ' + 'sendFailure');
}



