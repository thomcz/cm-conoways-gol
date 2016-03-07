var actuallGameState;
var newGameState;

var living = 255;
var dead = 0;

var interval;

var golSpeed = 1000 / maxFPS;
var gameStep = function () {
    for (var x = 0; x < 24; x++) {
        for (var y = 0; y < 24; y++) {
            if (matrix[x * 24 + y] == living) {
                dieMaybe(x, y);
            } else {
                resurection(x, y);
            }
        }
    }
    sendGameState(newGameState);
}
function startGame() {
    initTempStateMatrix();
    interval = setInterval(gameStep, golSpeed);
}

function initTempStateMatrix() {
    newGameState = [];
    for (var x = 0; x < 24; x++) {
        newGameState[x] = [];
        for (var y = 0; y < 24; y++) {
            newGameState[x][y] = dead;
        }
    }
}
function stopGame() {
    clearInterval(interval);
    setGolCanvas();
}

//TODO
function clearGame() {
    stopGame();
    initTempStateMatrix();
    sendGameState(newGameState);
}

function setGolSpeed(value) {
    golSpeed = value;
    stopGame();
    interval = setInterval(gameStep, golSpeed);
}

function resurection(x, y) {
    if (countLivingNeighbours(x, y) == 3) {
        newGameState[x][y] = living;
    }
}

function dieMaybe(x, y) {
    var neighbours = countLivingNeighbours(x, y);
    if (neighbours <= 1 || neighbours >= 4) {
        newGameState[x][y] = dead;
    } else if (neighbours == 2 || neighbours == 3) {
        newGameState[x][y] = living;
    }
}

function countLivingNeighbours(x, y) {
    var neighbours = 0;
    
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            //alert("(" + x + "," + y + ")");
            if (i == 0 && j == 0) { continue; }
            var newX = x + i;
            var newY = y + j;
            //alert("(" + x + "," + y + ")-> (" + newX + "," + newY + ")");
            if (newX < 0 || newY < 0 || newX > 24 || newY > 24) { continue; }
            if (matrix[newX * 24 + newY] == living) {
                neighbours++;
            }
        }
    }
    //alert("(" + x + "," + y + "): " + neighbours);
    return neighbours;
}

function printMatrix(matrix) {
    var msg = "";
    for (var x = 0; x < 24; x++) {
        for (var y = 0; y < 24; y++) {
            msg += matrix[x][y] + "|";
        }
        msg += "\n";
    }
    alert(msg);
}