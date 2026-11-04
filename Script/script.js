const username = document.getElementById("username");
const attemptsText = document.getElementById("attempts");
const generateBtn = document.getElementById("generateBtn");
const message = document.getElementById("message");
const game = document.getElementById("game");

const slots = ["coins", "seven", "money", "dice", "gold", "chips"];

const images = [
    "Images/coins.png", "Images/seven.png", "Images/money.png",
    "Images/dice.png", "Images/gold.png", "Images/chips.png"
];

const maxAttempts = 3;
const spinTime = 700;
const columnDelay = 350;
const tickTime = 80;

let attempts = 0;
let gameFinished = false;
let isSpinning = false;
let stoppedColumns = 0;

for (let i = 0; i < 9; i++) {
    let cell = document.createElement("div");
    let img = document.createElement("img");
    img.src = images[0];

    cell.classList.add("cell");
    cell.appendChild(img);
    game.appendChild(cell);
}
const cells = document.querySelectorAll(".cell");
let userName = prompt("Введіть ваше ім'я:");
if (userName === null || userName.trim() === "") {
    userName = "User";
}
username.textContent = userName.trim();

function setCell(cell, slot) {
    let index = slots.indexOf(slot);
    let img = cell.querySelector("img");
    img.src = images[index];
    img.alt = slot;
    cell.dataset.slot = slot;
}

function randomSlot() {
    let index = Math.floor(Math.random() * slots.length);
    return slots[index];
}

function generateColumns() {
    let columns = [];

    for (let col = 0; col < 3; col++) {
        let column = slots.slice();
        for (let i = column.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = column[i];
            column[i] = column[j];
            column[j] = temp;
        }
        columns.push(column.slice(0, 3));
    }
    return columns;
}

let startColumns = generateColumns();

for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 3; row++) {
        setCell(cells[row * 3 + col], startColumns[col][row]);
    }
}

function spinColumn(col, finalSlots, duration) {
    let timer = setInterval(function () {
        for (let row = 0; row < 3; row++) {
            setCell(cells[row * 3 + col], randomSlot());
        }
    }, tickTime);

    for (let row = 0; row < 3; row++) {
        cells[row * 3 + col].classList.add("spinning");
    }

    setTimeout(function () {
        clearInterval(timer);

        for (let row = 0; row < 3; row++) {
            let cell = cells[row * 3 + col];
            setCell(cell, finalSlots[row]);
            cell.classList.remove("spinning");
        }
        stoppedColumns++;
        if (stoppedColumns === 3) {
            finishRound();
        }
    }, duration);
}

function checkWin() {
    let winningRows = [];

    for (let row = 0; row < 3; row++) {
        let first = cells[row * 3].dataset.slot;
        let second = cells[row * 3 + 1].dataset.slot;
        let third = cells[row * 3 + 2].dataset.slot;
        if (first === second && second === third) {
            winningRows.push(row);
        }
    }
    return winningRows;
}

function finishRound() {
    let winningRows = checkWin();
    if (winningRows.length > 0) {
    for (let i = 0; i < winningRows.length; i++) {
        for (let col = 0; col < 3; col++) {
            cells[winningRows[i] * 3 + col].classList.add("win");
        }
    }
    gameFinished = true;
    }else if (attempts === maxAttempts) {
    message.textContent = "Спроби закінчилися!";
    gameFinished = true;
    }
    isSpinning = false;
    generateBtn.disabled = gameFinished;
}

generateBtn.addEventListener("click", function () {
    if (gameFinished || isSpinning) {
        return;
    }
    isSpinning = true;
    stoppedColumns = 0;
    generateBtn.disabled = true;
    generateBtn.classList.add("pulled");
    setTimeout(function () {
        generateBtn.classList.remove("pulled");
    }, 700);
    attempts++;
    attemptsText.textContent = "Спроба " + attempts + " з 3";

    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove("win");
    }
    let columns = generateColumns();
    for (let col = 0; col < 3; col++) {
        spinColumn(col, columns[col], spinTime + col * columnDelay);
    }
});