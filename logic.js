const gameBoard = (function () {
    let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    console.log("Board created: ", board);

    function placeMarker(player, location, event) {
        mark = player.marker
        event.innerHTML = `${mark}`;
        const row = Math.floor(location / 3);
        const col = location % 3;
        event.removeEventListener("click", gameFlow);

        board[row][col] = mark;
    }

    function checkForTie() {
        if (board.every(row => row.every(cell => cell !== null))) {
            tie = true;
            restartButton.innerHTML = "Tie Game!";
        }
    }

    function checkForWin() {
        const checkLine = (line, type, i) => {
            const [a, b, c] = line;
            if (a === b && b === c) {
                if (a === player1.marker) {
                    player1.updateScore();
                    p1Score.innerHTML = player1.displayScore();
                    p1Score.classList.add("score");
                    win = true;
                    gameButtons.forEach(btn => btn.removeEventListener("click", gameFlow));
                    highlightWinning(type, i);
                } else if (a === player2.marker) {
                    player2.updateScore();
                    p2Score.innerHTML = player2.displayScore();
                    p2Score.classList.add("score");
                    win = true;
                    gameButtons.forEach(btn => btn.removeEventListener("click", gameFlow));
                    highlightWinning(type, i);
                }
            }
        }

        // Check columns and rows
        for (let i = 0; i < 3; i++) {
            checkLine([board[i][0], board[i][1], board[i][2]], "row", i); // Check rows
            checkLine([board[0][i], board[1][i], board[2][i]], "col", i); // Check columns
        }

        // Check diagonals
        checkLine([board[0][0], board[1][1], board[2][2]], "diag1");
        checkLine([board[0][2], board[1][1], board[2][0]], "diag2");
    }

    function clearBoard() {
        if (win == true || tie == true) {
            if (p1Score.innerHTML == 3 || p2Score.innerHTML == 3) {
                restartButton.innerHTML = "Clear";
                p1Score.innerHTML = 0;
                p2Score.innerHTML = 0;
                board = [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ];
                selection.style.visibility = "visible";
            }
            else {
                board = [
                    [null, null, null],
                    [null, null, null],
                    [null, null, null]
                ];
                restartButton.innerHTML = "Clear";
            }
            currentPlayer = player1;
            gameButtons.forEach(btn => btn.addEventListener("click", gameFlow));
            gameButtons.forEach(btn => btn.innerHTML = "");
            gameButtons.forEach(btn => btn.classList.remove("winning"));
        }
        else {
            p1Score.innerHTML = 0;
            p2Score.innerHTML = 0;
            currentPlayer = player1;
            board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
            gameButtons.forEach(btn => btn.addEventListener("click", gameFlow));
            gameButtons.forEach(btn => btn.innerHTML = "");
        }
        p1Score.classList.remove("score");
        p2Score.classList.remove("score");
    }


    return { placeMarker, checkForTie, checkForWin, clearBoard }
}());

// factory function to create players given a marker
function createPlayer(mark) {
    createPlayer.count = (createPlayer.count || 0) + 1;
    const name = `Player ${createPlayer.count}`;
    const marker = mark;
    let score = 0;

    const updateScore = () => score++;
    const displayScore = () => score;

    return { name, marker, updateScore, displayScore };
}

// function to create both players in a game after the initial click
function createPlayers() {
    player1 = createPlayer(`${this.innerHTML}`);
    let mk = (player1.marker === "X") ? "O" : "X";
    player2 = createPlayer(mk);
    currentPlayer = player1;

    selection.style.visibility = "hidden";
}

function gameFlow() {
    loc = this.dataset.indexNumber;
    gameBoard.placeMarker(currentPlayer, loc, this);

    if (!gameBoard.checkForWin()) {
        gameBoard.checkForTie();
    }
    currentPlayer = (currentPlayer === player1) ? player2 : player1;

    if (p1Score.innerHTML == 3 || p2Score.innerHTML == 3) {
        restartButton.innerHTML = "Restart!";
    }
}

function coordtoIndex(row, col) {
    return row * 3 + col;
}

function highlightWinning(type, i) {
    const indexes = [];

    switch (type) {
        case "row":
            for (let j = 0; j < 3; j++) {
                indexes.push(coordtoIndex(i, j));
            }
            break;
        case "col":
            for (let j = 0; j < 3; j++) {
                indexes.push(coordtoIndex(j, i));
            }
            break;
        case "diag1":
            for (let j = 0; j < 3; j++) {
                indexes.push(coordtoIndex(j, j));
            }
            break;
        case "diag2":
            for (let j = 0; j < 3; j++) {
                indexes.push(coordtoIndex(j, 2 - j));
            }
            break;
        default:
            break;
    }

    indexes.forEach(index => {
        let selectedDiv = document.querySelector(`.board div[data-index-number="${index}"]`);
        selectedDiv.classList.add("winning");
    });
}


let player1, player2, win, tie
const p1Score = document.querySelector(".p1s");
const p2Score = document.querySelector(".p2s");

const selection = document.querySelector(".selection");

const gameButtons = document.querySelectorAll(".board div");
gameButtons.forEach(btn => btn.addEventListener("click", gameFlow));

const markerSelection = document.querySelectorAll(".markers div");
markerSelection.forEach(mk => mk.addEventListener("click", createPlayers));

const restartButton = document.querySelector(".restart_button");
restartButton.addEventListener("click", gameBoard.clearBoard);