import './sprite'
import {boosters, btnShuffle} from "./buttons";
import './resources'
import {render} from "./render";
import {getCell, getTile, getRawCellData, getSprite} from "./data";
import {isTileInField, SameColorAreasFinder} from "./finder";
import {requestAnimFrame,} from './frame';
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
let move = 0;
let flags = {gameIsStarted: false, isMoveAvailable: false, checkMove: false, blastFlag: false, fallComplete: false, };
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
    if (!checkWin()) requestAnimFrame(game);
}

function checkOnSuper(cell, arr) {
    if (arr.length > 6) {
        placeSuperTile(cell);
        return true;
    }
}

function blastTiles(arr) {
    flags.fallComplete = false;
    flags.isMoveAvailable ? flags.checkMove = checkMoveCorrupt(arr) : flags.checkMove = true;
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
        if (flags.checkMove && flags.fallComplete) findMove();
        else if ( move === 0 && flags.fallComplete ) flags.checkMove = true;
        updateCells();
    }
}

function updateCells() {
    let count = 0;
    for (let i = getRawCellData().length - 1; i >= 0; i--) {
        for (let j = getRawCellData()[i].length - 1; j >= 0; j--) {
            if(getTile(i, j).state === 'fallComplete') count++;
            getCell(i, j).update();
        }
    }
    if (count == gameOptions.fieldSize*gameOptions.fieldSize) flags.fallComplete = true;
}

function checkWin() {
    if(score.value >= gameOptions.roundScore){
        let scr = score.value;
        gameScene.remove();
        gameOverScene.init(`Поздравляем! Вы выиграли! Ваш счет: ${scr}`);
        return true;
    }
    return false;
}

function findMove() {
    move = finder.findMove();
    if (move !== -1){
        flags.isMoveAvailable = true;
        move.sort(compareCols);
    }
    flags.checkMove = false;
}

function checkMoveCorrupt(arr) {
    let minCol, maxCol;
    minCol = move[0].index.col;
    maxCol = move[move.length-1].index.col;
    let result = arr.filter(item => item.index.col >= minCol && item.index.col <= maxCol);
    if (result.length > 0){
        result.forEach((item) => {
            for (let i = 0; i < move.length; i++){
                if (move[i].index.col == item.index.col){
                    if (item.index.row >= move[i].index.row ) {
                        return true;
                    }
                }
            }
        });
    }
    return false;
}

function compareCols(a, b) {
    if (a.index.col > b.index.col) return 1;
    if (a.index.col == b.index.col) return 0;
    if (a.index.col < b.index.col) return -1;
}

function reset() {
    clearData();
    clearFlags();
    roundTimer.stop();
    removeGameListener();
}

function clearFlags() {
    flags.checkMove = false;
    flags.gameIsStarted = false;
    flags.fallComplete = false;
    flags.isMoveAvailable = false;
}

function clearData() {
    score.value = 0;
    boosters.shuffle.count = 0;
    btnShuffle.count = 0;
    boosters.bomb.count = 0;
    move = 0;
    let c =  getRawCellData();
    c = [];
}

function blockSelect(x, y) {
    let index = coordToIndex(x, y);
    if (isTileInField(index)){
        getCell(index.row, index.col).action();
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
    blockSelect,
    blastTiles,
    checkOnSuper,
    makeSuperArray,
    fillCell,
    makePosition,
};