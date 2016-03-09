//size of a cell in the canvas if the canvas should show 24 columns and rows 
var size_24;
//size of a cell in the canvas if the canvas should show 12 columns and rows 
var size_12;
//context of the canvas the user can set fields.
var ctx;
//count of rows and columns of the quadratic field.
var length = 24;
//the fill state of the cells of all canvases.
var state;
//the actual selected canvas.
var actualCanvas;
//array of all 4 canvases that represent one part of the cm.
var mainCanvasas;

// intitiate canvases.
function initCanvasas() {
    //put all canvases in an array
    mainCanvasas = [];
    mainCanvasas.push(document.getElementById("gol-canvas-tl"));
    mainCanvasas.push(document.getElementById("gol-canvas-tr"));
    mainCanvasas.push(document.getElementById("gol-canvas-bl"));
    mainCanvasas.push(document.getElementById("gol-canvas-br"));

    //resize them to fit into the screen
    size_24 = ~~((window.innerWidth - (window.innerWidth * 0.15)) / length);
    for (var i = 0; i < mainCanvasas.length; i++) {
        var ctx = mainCanvasas[i].getContext("2d");
        ctx.canvas.width = size_24 * (length / 2);
        ctx.canvas.height = size_24 * (length / 2);

        mainCanvasas[i].addEventListener("click", selectCanvas);
    }
    intitGolField();
}

// initiate the canvas the user can interact an set single cells.
function intitGolField() {
    var canvas = document.getElementById("gol-canvas");
    ctx = canvas.getContext("2d");

    //set the size of the canvas to fit into the screen.
    size_12 = ~~((window.innerWidth - (window.innerWidth * 0.15)) / (length / 2));

    ctx.canvas.width = size_12 * (length / 2);
    ctx.canvas.height = size_12 * (length / 2);

    // create empty state array
    initStateArray();
    
    canvas.addEventListener("click", click);
    drawBox();
}

function createRandomGame() {
    for (var x = 0; x < state.length; x++) {
        for (var y = 0; y < state.length; y++) {
            var rand = Math.round(Math.random());
            state[x][y] = rand == 1;
            newGameState[x][y] = rand * living;
        }
    }
    fillMainCanvases();
    sendGameState(newGameState);
}

function initStateArray() {
    state = [];
    for (var i = 0; i < length; i++) {
        state[i] = [];
    }
}

// returns to the gol main page.
function returnToMainPage() {
    changePage("canvasPage", "golMainPage");
    fillMainCanvases();
}

// shows actual state of the game on the 4 canvases.
function fillMainCanvases() {
    for (var i = 0; i < 4; i++) {
        var canvas = mainCanvasas[i];
        fillCanvas(canvas, canvas.getContext("2d"), size_24);
    }
}

// fill the cells of a canvas.
function fillCanvas(canvas, context, size) {
    for (var x = 0; x < (length / 2); x++) {
        for (var y = 0; y < (length / 2); y++) {
            var offsetX = parseInt(canvas.getAttribute("data-offsetx"));
            var offsetY = parseInt(canvas.getAttribute("data-offsety"));
            if (state[y + offsetY][x + offsetX]) {
                fill(context, size, "black", x, y);
            } else {
                fill(context, size, "white", x, y);
            }
        }
    }
}

// after clicking on a canvas it gets bigger and allows the user to set cells.
function selectCanvas(e) {
    stopGame();
    changePage("golMainPage", "canvasPage");
    actualCanvas = e.target;
    fillCanvas(actualCanvas, ctx, size_12);
}

// fill function that fills a given cell (x,y) with a given color.
function fill(context, size, color, x, y) {
    context.fillStyle = color;
    context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
}

//draw the actual game state on the main canvases
function setGolCanvas() {
    for (var x = 0; x < length; x++) {
        for (var y = 0; y < length; y++) {
            state[y][x] = newGameState[y][x] == living;            
        }
    }
    fillMainCanvases();
}

// fills the clicked cell.
function click(e) {
    // get mouse click position
    var mx = e.offsetX;
    var my = e.offsetY;
    // calculate cell numbers
    var x = ~~(mx / size_12);
    var y = ~~(my / size_12);

    // make sure we're in bounds
    if (x < 0 || x >= length || y < 0 || y >= length) {
        return;
    }

    //get offset of the actual canvas we are working on.
    var offsetX = parseInt(actualCanvas.getAttribute("data-offsetx"));
    var offsetY = parseInt(actualCanvas.getAttribute("data-offsety"));

    var context = e.target.getContext("2d");
    //fill or unfill the cell 
    if (state[y + offsetY][x + offsetX]) {
        state[y + offsetY][x + offsetX] = false;
        fill(context, size_12, "white", x, y);
        sendData(y + offsetY, x + offsetX, dead);
    } else {
        state[y + offsetY][x + offsetX] = true;
        fill(context, size_12, "black", x, y);
        sendData(y + offsetY, x + offsetX, living);
    }
}

// draw grid on the canvas the user interact with.
function drawBox() {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    for (var i = 0; i <= (length / 2); i++) {
        ctx.beginPath();
        //draw columns
        drawLine(0, i * size_12, ctx.canvas.width, i * size_12);
        //draw rows
        drawLine(i * size_12, 0, i * size_12, ctx.canvas.width);
        ctx.stroke();
    }
    ctx.closePath();
}

// draw a line from (x1,y1) to (x2, y2).
function drawLine(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
}
