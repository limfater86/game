import './sprite'
import {boosters, btnShuffle} from "./buttons";
import './resources'
import {render} from "./render";
import {getCell, getTile, getRawCellData, getSprite} from "./data";
import {isTileInField, SameColorAreasFinder} from "./finder";
import {
    requestAnimFrame,
} from './frame';
import {inputHandler} from "./input";
import {score, roundTimer} from "./interface";
import {gameOverScene} from "./gameOver";
import Cell from "./cell";
import {Tile, SuperTile} from "./tile";

let gameOptions = {
    fieldSize: 7,
    minAreaSize: 2,
    blockColors: 5,
    blockHeight: 192,
    blockWidth: 170,
    blockScale: 0.3,
    fieldOffsetY: 117,
    fieldOffsetX: 20,
    fallSpeed: 300,
    destroySpeed: 4,
    shuffleNum: 3,
    boosterBombCount: 5,
    boosterShuffleCount: 5,
    roundTime: 60,
    roundScore: 2000
};

let dt = 0, lastTime = 0;
let move = [];
let pickedCell;
let flags = {gameIsStarted: false, isMoveAvailable: false, canPick: false, checkMove: false, blastFlag: false, cellIsPicked: false};
let gameScene = {
    init: initGame,
    remove: reset,
};
let finder = new SameColorAreasFinder();

function timeTick() {
    let now = Date.now();
    dt = (now - lastTime) / 1000;
    lastTime = now;
}

function initGame() {
    addGameListener();
    game();
}

function game() {
    timeTick();
    update();
    render();
    if (!checkWin())requestAnimFrame(game);
}

function checkOnSuper(cell, arr) {
    if (arr.length > 6) {
        placeSuperTile(cell);
        return true;
    }
}

function blastTiles(arr) {
    // flags.canPick = false;
    // flags.blastFlag = true;
    markTiles(arr, 'destroy');
    score.calc(arr);
}

function placeSuperTile(cell) {
    fillCell(cell, 'super');
}

function markTiles(arr, state) {
    arr.forEach((item) => {
        item.state = state;
    });
}

function makeSuperArray(index){
    let arr = [];
    for (let i = 0; i < gameOptions.fieldSize; i++){
        arr.push(getTile(index.row, i));
    }
    return arr;
}

function drawField(){
    for (let i = 0; i < gameOptions.fieldSize; i++){
        getRawCellData()[i] = [];
        for (let j = 0; j < gameOptions.fieldSize; j++){
            getRawCellData()[i][j] = new Cell(makePosition(i, j), {row: i, col: j});
        }
    }
}

function startingFillCells() {
    for (let i = 0; i < getRawCellData().length; i++){
        for (let j = 0; j < getRawCellData()[i].length; j++){
            fillCell(getCell(i, j));
        }
    }
}

function fillCell(cell, type = 'standard') {
    if (type === 'standard') cell.tile = createStandardTile(cell);
    else cell.tile = createSuperTile(cell);
    cell.isEmpty = false;
}

function createStandardTile(cell){
    return new Tile({x: cell.pos.x, y: cell.pos.y}, randomColor(), {row: cell.index.row, col: cell.index.col}, 'fall');
}

function createSuperTile(cell) {
    return new SuperTile({x: cell.pos.x, y: cell.pos.y}, gameOptions.blockColors, {row: cell.index.row, col: cell.index.col}, 'fall');
}

function makePosition(i, j) {
    return {x: gameOptions.fieldOffsetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth*gameOptions.blockScale/2, y: gameOptions.fieldOffsetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight*gameOptions.blockScale/2};
}

function randomColor(){
    return Math.floor(Math.random() * Math.floor(gameOptions.blockColors-1));
}

function update() {
    if (flags.gameIsStarted){
        if (flags.cellIsPicked) doPickedCellActions();
        // if (flags.checkMove) findMove();
        updateCells();
        // tilesStateController();
    }
}

function updateCells() {
    for (let i = getRawCellData().length - 1; i >= 0; i--) {
        for (let j = getRawCellData()[i].length - 1; j >= 0; j--) {
            getCell(i, j).update();
        }
    }
}

function checkWin() {
    if(score.value >= gameOptions.roundScore){
        let scr = score.value;
        gameScene.remove();
        gameOverScene.init(`Поздравляем! Вы выиграли! Ваш счет: ${scr}`);
        return true;
    }
}

// function doRefill() {
//     refillField();
//     flags.canPick = true;
//     flags.checkMove = true;
// }


function findMove() {
    flags.canPick = false;
    flags.isMoveAvailable = finder.findMove();
    flags.canPick = true;
    flags.checkMove = false;
}

function doPickedCellActions() {
    flags.cellIsPicked = false;
    pickedCell.action();
    pickedCell = {};
}

function reset() {
    clearData();
    clearFlags();
    roundTimer.stop();
    removeGameListener();
}

function clearFlags() {
    flags.canPick = false;
    flags.checkMove = false;
    flags.gameIsStarted = false;
}

function clearData() {
    score.value = 0;
    boosters.shuffle.count = 0;
    btnShuffle.count = 0;
    boosters.bomb.count = 0;
    let c =  getRawCellData();
    c = [];
}

function blockSelect(x, y) {
    if (flags.canPick) {
        // let check = isTileInField(coordToIndex(x, y));
        // if (check === -1) {
        let index = coordToIndex(x, y);
        if (!isTileInField(index)) {
            pickedCell = 0;
        } else {
            // pickedCell = check;
            flags.cellIsPicked = true;
            pickedCell = getCell(index.row, index.col);
        }
    }
}
function coordToIndex(x, y) {
    let row = Math.floor((y - gameOptions.fieldOffsetY - gameOptions.blockHeight * gameOptions.blockScale/2) / (gameOptions.blockHeight * gameOptions.blockScale));
    let col = Math.floor((x - gameOptions.fieldOffsetX - gameOptions.blockWidth * gameOptions.blockScale/2) / (gameOptions.blockWidth * gameOptions.blockScale));
    return {row: row, col: col}
}

function shuffleField(){
    for (let i = 0; i < gameOptions.fieldSize; i++) {
        for (let j = 0; j < gameOptions.fieldSize; j++) {
            getSprite(i, j).frames = randomColor();
        }
    }
}

function addGameListener() {
    document.addEventListener("mouseup", inputHandler,false);
}

function removeGameListener() {
    document.removeEventListener("mouseup", inputHandler);
}

export {
    gameScene,
    gameOptions,
    flags,
    dt,
    finder,
    shuffleField,
    drawField,
    startingFillCells,
    blockSelect,
    blastTiles,
    checkOnSuper,
    makeSuperArray,
    fillCell,
    makePosition,
};