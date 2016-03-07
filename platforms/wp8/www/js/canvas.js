﻿var size;
var canvas;
var ctx;
var w;
var h;
var state;

function createGolField() {
    // block size`
    canvas = document.getElementById("gol-canvas");
    ctx = canvas.getContext("2d");

    size = ~~((window.innerWidth - (window.innerWidth * 0.15))  / 24);
    ctx.canvas.width = size * 24;
    ctx.canvas.height = size * 24;
    // how many cells fit on the canvas
    w = 24;
    h = 24;
    // create empty state array
    state = [];
    for (var i = 0; i < h; i++) {
        state[i] = [];
    }
    canvas.addEventListener("click", click);
    drawBox();
}

// quick fill function to save repeating myself later
function fill(s, gx, gy) {
    ctx.fillStyle = s;
    ctx.fillRect(gx * size + 1, gy * size + 1, size - 2, size - 2);
}

function setGolCanvas() {
    for (var x = 0; x < 24; x++) {
        for (var y = 0; y < 24; y++) {
            state[y][x] = newGameState[y][x] == living;
            if (state[y][x]) {
                fill("black", x, y);
            } else {
                fill("white", x, y);
            }
        }
    }
}

function click(e) {
    // get mouse click position
    var mx = e.offsetX;
    var my = e.offsetY;
    // calculate grid square numbers
    var gx = ~~(mx / size);
    var gy = ~~(my / size);

    // make sure we're in bounds
    if (gx < 0 || gx >= w || gy < 0 || gy >= h) {
        return;
    }
    if (state[gy][gx]) {
        state[gy][gx] = false;
        fill("white", gx, gy);
        sendData(gy, gx, dead);
    } else {
        state[gy][gx] = true;
        fill("black", gx, gy);
        sendData(gy, gx, living);
    }
}

function drawBox() {
    ctx.beginPath();
    //ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    for (var i = 0; i <= 24; i++) {
        ctx.beginPath();
        //draw columns
        drawLine(0, i * size, ctx.canvas.width, i * size);
        //draw rows
        drawLine(i * size, 0, i * size, ctx.canvas.width);
        ctx.stroke();
    }
    ctx.closePath();
}
function drawLine(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
}
