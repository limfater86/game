import './sprite'
import {boosters, btnShuffle} from "./buttons";
import './resources'
// import Cell from "./cell";
// import {Tile, SuperTile} from "./tile";
import {render} from "./render";
import {getCell, getTile, getRawCellData, getSprite} from "./data";
import {isTileInField, SameColorAreasFinder} from "./finder";
import {
    // timeTick,
    requestAnimFrame,
} from './frame';
import {inputHandler} from "./input";
import {score, roundTimer} from "./interface";
import {gameOverScene} from "./gameOver";

let gameOptions = {
    fieldSize: 7,
    minAreaSize: 2,
    blockColors: 5,
    blockHeight: 192,
    blockWidth: 170,
    blockScale: 0.3,
    fieldOffsetY: 117,
    fieldOffsetX: 20,
    fallSpeed: 500,
    destroySpeed: 4,
    shuffleNum: 3,
    boosterBombCount: 5,
    boosterShuffleCount: 5,
    roundTime: 60,
    roundScore: 2000
};

let dt = 0, lastTime = 0;
let poolArray = [];
let move = [];
let pickedCell;
let flags = {gameIsStarted: false, isMoveAvailable: false, canPick: false, checkMove: false, blastFlag: false, cellIsPicked: false};
let gameScene = {
    init: initGame,
    remove: reset,
};
let finder = new SameColorAreasFinder();

class Tile {
    constructor(pos, frame, index, state){
        let spriteAttr = {
            url: 'assets/blocks.png',
            pos: {x: pos.x, y: pos.y},
            size: [gameOptions.blockWidth, gameOptions.blockHeight],
            frames: frame,
            scale: gameOptions.blockScale,
            alpha: 1
        };
        this.pos = {x: pos.x, y: pos.y};
        this.index = {row: index.row, col: index.col};
        this._state = state;
        this.type = 'standard';
        this.sprite = new Sprite(spriteAttr)
    }

    action(cell){
        poolArray = finder.scan(this.index);
        if (poolArray.length >= gameOptions.minAreaSize) {
            blastTiles(poolArray);
            if (checkOnSuper(cell, poolArray)) deleteFromArr(this, poolArray);
        }
    }

    draw (){
        if ((this._state === 'base') || (this._state === 'fallComplete')){
            this.sprite.render();
        } else if ((this._state === 'destroy') || (this._state === 'destroyComplete')){
            this.sprite.renderDestroy();
        } else if (this._state === 'fall'){
            this.sprite.renderFall(this);
        }

    }

    // update(){
    // if (this._state === 'base'){
    //
    // } else
    // if (this._state === 'destroy'){
    //     if (this.sprite.alpha == 0) this.state = 'destroyComplete';
    // } else if (this._state === 'destroyComplete'){
    //     getCell(this.index.row, this.index.col).isEmpty = true;
    // } else if (this._state === 'fall'){
    //     if (this.sprite.pos.y == this.pos.y) this.state = 'fallComplete';
    // }
    // }

    set state(newState){
        this._state = newState;
    }

    get state(){
        return this._state;
    }

}

class SuperTile extends Tile {
    constructor(pos, frame, index, state){
        super(pos, frame, index, state);
        this.type = 'super';
    };
    action(){
        poolArray = makeSuperArray(this.index);
        blastTiles(poolArray);
    }
}

class Cell {
    constructor(pos, index){
        this.isEmpty = true;
        this.pos = {x: pos.x, y: pos.y};
        this.index = {row: index.row, col: index.col};
        this.tile = {};
    }
    action(){
        if (boosters.bomb.enable){
            poolArray = boosters.bomb.blast(this.index);
            blastTiles(poolArray);
        } else this.tile.action(this);
    }

    draw (){
        if (!this.isEmpty) this.tile.draw();
    }

}

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

function deleteFromArr(tile, arr) {
    let index = arr.findIndex((itemScan)=> (tile.index.row == itemScan.index.row) && (tile.index.col == itemScan.index.col));
    if (index !== -1){
        arr.splice(index, 1);
    }
}

function checkOnSuper(cell, arr) {
    if (arr.length > 6) {
        placeSuperTile(cell);
        return true;
    }
}

function blastTiles(arr) {
    flags.canPick = false;
    flags.blastFlag = true;
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
    return new Tile({x: cell.pos.x, y: cell.pos.y}, randomColor(), {row: cell.index.row, col: cell.index.col}, 'base');
}

function createSuperTile(cell) {
    return new SuperTile({x: cell.pos.x, y: cell.pos.y}, gameOptions.blockColors, {row: cell.index.row, col: cell.index.col}, 'base');
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
        if (flags.checkMove) findMove();
        tilesStateController();
    }
}

function tilesStateController() {
    if (poolArray.length > 0){
        let state = checkState();
        if (state === 'base' && flags.blastFlag) {
            flags.blastFlag = false;
            markTiles(poolArray, 'destroy');
        }
        else if (state === 'destroy') updateTiles(poolArray);
        else if (state === 'destroyComplete') {
            updateTiles(poolArray);
            if (makeTilesFall() === 0){
                doRefill();
                // markTiles(poolArray, 'fallComplete');
                // console.log(poolArray);
                // console.log(getRawCellData());
            }
        }
        else if (state === 'fall'){
            updateTiles(poolArray);
        }

        else if (state === 'fallComplete'){
            markTiles(poolArray, 'base');
            doRefill();
            poolArray = [];
        }
    }
}

function updateTiles(arr) {

    arr.forEach((tile)=> {
        if (tile.state === 'destroy'){
            if (tile.sprite.alpha == 0) tile.state = 'destroyComplete';
        } else if (tile.state === 'destroyComplete'){
            getCell(tile.index.row, tile.index.col).isEmpty = true;
        } else if (tile.state === 'fall'){
                if (tile.sprite.pos.y == tile.pos.y) tile.state = 'fallComplete';
        }

    });
}

function checkState() {
    let fallCount = 0, fallCompleteCount = 0, destroyCount = 0, destroyCompleteCount = 0;
    poolArray.forEach((tile)=>{
        if (tile.state === 'fallComplete') fallCompleteCount++;
        if (tile.state === 'fall') fallCount++;
        if (tile.state === 'destroyComplete') destroyCompleteCount++;
        if (tile.state === 'destroy') destroyCount++;
    });
    if (destroyCount > 0) return 'destroy';
    else if (destroyCompleteCount > 0) return 'destroyComplete';
    else if (fallCount > 0) return 'fall';
    else if (fallCompleteCount > 0) return 'fallComplete';
    else return 'base';
}

function checkWin() {
    if(score.value >= gameOptions.roundScore){
        let scr = score.value;
        gameScene.remove();
        gameOverScene.init(`Поздравляем! Вы выиграли! Ваш счет: ${scr}`);
        return true;
    }
}

function doRefill() {
    refillField();
    flags.canPick = true;
    flags.checkMove = true;
}

// function gameOver(message) {
//     reset();
//     alert(message);
// }

function findMove() {
    flags.canPick = false;
    flags.isMoveAvailable = finder.findMove();
    flags.canPick = true;
    flags.checkMove = false;
}

function refillField(){
    for (let j = 0; j < gameOptions.fieldSize; j++){
        let emptyBlocks = holesInCol(j);
        if(emptyBlocks > 0){
            for (let i = 0; i < emptyBlocks; i++){
                fillCell(getCell(i, j));
            }
        }
    }
}
function holesInCol(col){
    let result = 0;
    for (let i = 0; i < gameOptions.fieldSize; i++){
        if(getCell(i, col).isEmpty) result++;
    }
    return result;
}

function makeTilesFall() {
    let fall = 0;
    poolArray = [];
    for (let i = gameOptions.fieldSize - 2; i >= 0; i--){
        for (let j = 0; j < gameOptions.fieldSize; j++){
            if (!getCell(i, j).isEmpty){
                let holes = holesBelow(i, j);
                if (holes > 0){
                    fall++;
                    getCell(i+holes, j).tile = getCell(i,j).tile;
                    getCell(i, j).isEmpty = true;
                    getCell(i+holes, j).isEmpty = false;
                    poolArray.push(getTile(i+holes, j));
                    getTile(i+holes, j).state = 'fall';
                    getTile(i+holes, j).pos.y = getCell((i+holes), j).pos.y;
                    getTile(i+holes, j).index.row = getCell((i+holes), j).index.row;
                }
            }
        }
    }
    return fall;
}

function holesBelow(row, col) {
    let result = 0;
    for (let i = row+1; i < gameOptions.fieldSize; i++) {
        if (getCell(i, col).isEmpty) result++;
    }
    return result;
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
    poolArray,
    finder,
    shuffleField,
    drawField,
    startingFillCells,
    blockSelect,
    blastTiles,
    checkOnSuper,
    deleteFromArr,
    makeSuperArray,
};