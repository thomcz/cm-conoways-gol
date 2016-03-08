//the new game state
var newGameState;

//if a cell lives the led in the cm should be on
var living = 255;
//if a cell is dead the led in the cm should be off
var dead = 0;

var interval;
//the speed on which the app is sending new game states to the cm
var golSpeed = 1000 / maxFPS;

//iterates over the actual game state (matrix) and follow the gol rules.
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
    setGolCanvas();
}

// initiate the newGameState matrix with dead cells.
function initTempStateMatrix() {
    newGameState = [];
    for (var x = 0; x < 24; x++) {
        newGameState[x] = [];
        for (var y = 0; y < 24; y++) {
            newGameState[x][y] = dead;
        }
    }
}

//starts the gol.
function startGame() {
    initTempStateMatrix();
    stopGame;
    interval = setInterval(gameStep, golSpeed);
}

//stops the gol at the current state.
function stopGame() {
    clearInterval(interval);
}

//TODO
function clearGame() {
    stopGame();
    initTempStateMatrix();
    sendGameState(newGameState);
}

//sets the speed the app is sending data (game states) to cm.
function setGolSpeed(value) {
    golSpeed = value;
    stopGame();
    interval = setInterval(gameStep, golSpeed);
}

//if a dead cell has exact 3 living neighbours she will come back to live.
function resurection(x, y) {
    if (countLivingNeighbours(x, y) == 3) {
        newGameState[x][y] = living;
    }
}

//if a living cell has 0,1,4 or more living neighbours she will die.
//if she has exact 2 or 3 living neighbours nothing will happen.
function dieMaybe(x, y) {
    var neighbours = countLivingNeighbours(x, y);
    if (neighbours <= 1 || neighbours >= 4) {
        newGameState[x][y] = dead;
    } else if (neighbours == 2 || neighbours == 3) {
        newGameState[x][y] = living;
    }
}

//counting the living neigbours of a cell with position (x,y).
function countLivingNeighbours(x, y) {
    var neighbours = 0;
    
    for (var i = -1; i <= 1; i++) {
        for (var j = -1; j <= 1; j++) {
            //if it's the cell itself
            if (i == 0 && j == 0) { continue; }
            var newX = x + i;
            var newY = y + j;
            //are we still in place?
            if (newX < 0 || newY < 0 || newX > 24 || newY > 24) { continue; }
            if (matrix[newX * 24 + newY] == living) {
                neighbours++;
            }
        }
    }

    return neighbours;
}