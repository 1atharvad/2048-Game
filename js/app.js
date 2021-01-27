function createGrid() {
    var grid = [];

    for (var i=0; i<4; i++) {
        var list = []
        for (var j=0; j<4; j++) {
            list[j] = 0;
        }
        grid[i] = list;
    }
    return grid;
}

function updateScore() {
    var scoreTag = document.querySelector(".score h2");
    scoreTag.innerHTML = score;
    updateBestScore();
}

function updateBestScore() {
    var bestScoreTag = document.querySelector(".best-score h2");
    var key = "high-score"

    if (sessionStorage.getItem(key) === null) {
        sessionStorage.setItem(key, 0);
    } else if ((sessionStorage.getItem(key) < score) === true) {
        sessionStorage.setItem(key, score);
    }
    bestScoreTag.innerHTML = sessionStorage.getItem(key);
}

function getSessionStorage() {
    sessionStorage.setItem(key, value);
    Object.keys(sessionStorage).forEach(function(key){
        var value = sessionStorage.getItem(key);
        var table = document.querySelector(".session-storage tbody");
        var inner_table = document.querySelector(".storage-container .inner-table tr");

        if (key !== "IsThisFirstTime_Log_From_LiveServer") {
            inner_table.querySelector("td#key").innerText = key;
            inner_table.querySelector("td#value").innerText = value;
            table.innerHTML += inner_table.outerHTML;
            console.log(inner_table);
        }
    });
}

function arrowBtnPress() {
    document.onkeydown = function(e) {
        moveTiles(e.key);
        updateScore();
        addTile();
    }
}

function getNextPos(position, direction) {
    var nextPos;
    var tileVal;
    switch (direction) {
        case "ArrowLeft":
            for (var i=position[1]-1; i>=0; i--) {
                if (grid[position[0]][i] !== 0) {
                    if (grid[position[0]][position[1]] === grid[position[0]][i]) {
                        tileVal = grid[position[0]][position[1]] * 2;
                        score += tileVal;
                        nextPos = [position[0], i];
                        toggleTile(nextPos, 0);
                    }
                    break;
                }
                tileVal = grid[position[0]][position[1]];
                nextPos = [position[0], i];
            }
            break;
        case "ArrowUp":
            for (var i=position[0]-1; i>=0; i--) {
                if (grid[i][position[1]] !== 0) {
                    if (grid[position[0]][position[1]] === grid[i][position[1]]) {
                        tileVal = grid[position[0]][position[1]] * 2;
                        score += tileVal;
                        nextPos = [i, position[1]];
                        toggleTile(nextPos, 0);
                    }
                    break;
                }
                tileVal = grid[position[0]][position[1]];
                nextPos = [i, position[1]];
            }
            break;
        case "ArrowRight":
            for (var i=position[1]+1; i<grid[position[0]].length; i++) {
                if (grid[position[0]][i] !== 0) {
                    if (grid[position[0]][position[1]] === grid[position[0]][i]) {
                        tileVal = grid[position[0]][position[1]] * 2;
                        score += tileVal;
                        nextPos = [position[0], i];
                        toggleTile(nextPos, 0);
                    }
                    break;
                }
                tileVal = grid[position[0]][position[1]];
                nextPos = [position[0], i];
            }
            break;
        case "ArrowDown":
            for (var i=position[0]+1; i<grid.length; i++) {
                if (grid[i][position[1]] !== 0) {
                    if (grid[position[0]][position[1]] === grid[i][position[1]]) {
                        tileVal = grid[position[0]][position[1]] * 2;
                        score += tileVal;
                        nextPos = [i, position[1]];
                        toggleTile(nextPos, 0);
                    }
                    break;
                }
                tileVal = grid[position[0]][position[1]];
                nextPos = [i, position[1]];
            }
            break;
    }
    return [nextPos, tileVal];
}

function getTiles(emptyTiles=false) {
    var tiles = [];
    var count = 0;
    for (var i=0; i<grid.length; i++) {
        for (var j=0; j<grid[i].length; j++) {
            if (emptyTiles === true) {
                if (grid[i][j] === 0) {
                    tiles[count] = [i, j];
                    count++;
                }
            } else {
                if (grid[i][j] !== 0) {
                    tiles[count] = [i, j];
                    count++;
                }
            }
        }
    }
    return tiles;
}

function toggleTile(position, value) {
    var tile = document.querySelectorAll(".board .row")[position[0]].querySelectorAll(".col")[position[1]];
    
    if (value !== 0) {
        tile.classList.add("tile-" + value);
        grid[position[0]][position[1]] = value;
    } else {
        tile.classList.remove(tile.classList[1]);
        grid[position[0]][position[1]] = 0;
    }
}

function moveTiles(direction) {
    var tiles;
    if (direction === "ArrowRight" || direction === "ArrowDown") {
        tiles = getTiles().reverse();
    } else {
        tiles = getTiles();
    }
    tiles.forEach(function(position) {
        var data = getNextPos(position, direction);
        var nextPos = data[0];
        console.log(nextPos, data[1])
        if (nextPos !== undefined) {
            toggleTile(nextPos, data[1]);
            toggleTile(position, 0);
        }
    });
}

function addTile() {
    var notList = getTiles(true);
    var position = notList[Math.floor((Math.random() * notList.length) + 1) - 1];
    
    if (position !== undefined) {
        toggleTile(position, 2);
    } else {
        console.log("Game Over");
    }
}

var grid = createGrid();
var score = 0;
updateBestScore();
arrowBtnPress();
addTile();
addTile();