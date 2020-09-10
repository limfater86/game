var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

let gameOptions = {
    fieldSize: 7,
    minAreaSize: 2,
    blockColors: 5,
    blockHeight: 192,
    blockWidth: 170,
    blockScale: 0.3,
    fieldOffcetY: 117,
    fieldOffcetX: 20,
    fallSpeed: 150,
    destroySpeed: 3,
    shuffleNum: 3,
    boosterBombCount: 5,
    boosterShuffleCount: 5,
    roundTime: 60,
    roundScore: 2000
};

let lastTime;
let poolArray = [];
let renderStatus = 'base';
let renderArray = [];
let renderDestroyArray = [];
let renderFallArray = [];
let move = [];
let dt = 0;
let canPick = false;
let checkMove = false;
let pickedCell;
let isMoveAvailable = false;
let gameIsStarted = false;

resources.load([
    'assets/Background.png',
    'assets/field.png',
    'assets/button.png',
    'assets/button2.png',
    'assets/background_progress.png',
    'assets/progress.png',
    'assets/scorepanel.png',
    'assets/bonus.png',
    'assets/money.png',
    'assets/money2.png',
    'assets/pause.png',
    'assets/button_plus.png',
    'assets/blocks.png',
    'assets/button.png',
    'assets/button_plus.png',

]);
resources.onReady(init);

class cell {
    constructor(pos, index){
        this.isEmpty = true;
        this.pos = {x: pos.x, y: pos.y};
        this.index = {row: index.row, col: index.col};
        this.tile = {};
    }
    action(){
        if (canPick) boosters.bomb.enable ? blastTiles(boosters.bomb.blast(this.index)) : this.tile.action();
    }

    draw (){
        if (!this.isEmpty) this.tile.draw();
    }

}
class tile {
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

    action(){
        poolArray = finder.scan(this.index);
        if (poolArray.length >= gameOptions.minAreaSize) {
            blastTiles(poolArray);
            checkOnSuper(this.index, poolArray);
        }
    }

    draw (){
        if (this._state === 'base'){
            this.sprite.render();
        } else if (this._state === 'destroy'){
            this.sprite.renderDestroy();
            if (this.sprite.alpha == 0) this.state = 'destroyComplete';
        } else if (this._state === 'destroyComplete'){
            getCell(this.index.row, this.index.col).isEmpty = true;
        } else if (this._state === 'fall'){
            this.sprite.renderFall(this);
            if (this.sprite.pos.y == this.pos.y) this.state = 'fallComplete';
        }

    }

    set state(newState){
        this._state = newState;
    }

    get state(){
        return this._state;
    }

}

class superTile extends tile {
    constructor(pos, frame, index, state){
        super(pos, frame, index, state);
        this.type = 'super';
    };
    action(){
        blastTiles(makeSuperArray(this.index));
    }
}

function checkOnSuper(index, arr) {
    if (arr.length > 6) {
        placeSuperTile(index);
        // renderDestroyArray.splice(index, 1);
        // renderArray.push(index);
    }
}

function blastTiles(arr) {
    canPick = false;
    markDestroyTiles(arr);
    score.calc(arr);
}

function placeSuperTile(index) {
    fillCell(makePosition(index.row, index.col), index.row, index.col, 'super');
}

function markDestroyTiles(arr) {
    arr.forEach((item) => {
        // renderDestroyArray.push(item);
        // deleteFromRenderArray(item);
        // getCell(item.row, item.col).isEmpty = true;
        getTile(item.row, item.col).state = 'destroy';
    });
    // renderStatus = 'destroy';
}

let finder = new SameColorAreasFinder();

function makeSuperArray(index){
    let arr = [];
    for (let i = 0; i < gameOptions.fieldSize; i++){
        arr.push({row: index.row, col: i});
    }
    return arr;
}

function init() {
    lastTime = Date.now();
    main();
}

function main() {
    setDT(timeTick());
    update();
    render();
    requestAnimFrame(main);
}

function setDT (value){
    dt = value;
}

function timeTick() {
    let now = Date.now();
    let result = (now - lastTime) / 1000.0;
    lastTime = now;
    return result;
}

function drawField(){
    for (let i = 0; i < gameOptions.fieldSize; i++){
        getRawCellData()[i] = [];
        for (let j = 0; j < gameOptions.fieldSize; j++){
            getRawCellData()[i][j] = new cell(makePosition(i, j), {row: i, col: j});
        }
    }
}

function startingFillCells() {
    for (let i = 0; i < getRawCellData().length; i++){
        for (let j = 0; j < getRawCellData()[i].length; j++){
            fillCell(getCell(i, j).pos, i, j);
            // renderArray.push({row: i, col: j});
        }
    }
}

// function fillCells(array) {
//     array.forEach((item) => {
//         fillCell(makePosition(item.row, item.col), item.row, item.col)
//     })
// }

function fillCell(pos, i, j, type = 'standard') {
    if (type === 'standard') getCell(i, j).tile = createStandardTile(pos, i, j);
    else getCell(i, j).tile = createSuperTile(pos, i, j);
    getCell(i, j).isEmpty = false;
}

function createStandardTile(pos, i,j, state){
    return new tile(pos, randomColor(), {row: i, col: j}, (state || 'base'));
}

function createSuperTile(pos, i,j, state) {
    return new superTile(pos, gameOptions.blockColors, {row: i, col: j}, (state ||'base'));
}

function makePosition(i, j) {
    return {x: gameOptions.fieldOffcetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth*gameOptions.blockScale/2, y: gameOptions.fieldOffcetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight*gameOptions.blockScale/2};
}

function randomColor(){
    return Math.floor(Math.random() * Math.floor(gameOptions.blockColors-1));
}

function update() {
    if (gameIsStarted){
        doPickedCellActions();
        doCheckMove();
        checkState();
        changeState();
    }
}

function checkState() {
    let fallCount = 0, fallCompleteCount = 0, destroyCount = 0, destroyCompleteCount = 0;
    for (let i = 0; i < gameOptions.fieldSize; i++){
        for (let j = 0; j < gameOptions.fieldSize; j++){
            if (getTile(i, j).state === 'fallComplete') {
                fallCompleteCount++;
                getTile(i, j).state = 'base';
            }
            if (getTile(i, j).state === 'fall') fallCount++;
            if (getTile(i, j).state === 'destroyComplete') destroyCompleteCount++;
            if (getTile(i, j).state === 'destroy') destroyCount++;
        }
    }
    // console.log(`destroy=${destroyCount}, destroyComplete=${destroyCompleteCount}, fall=${fallCount}, fallComplete=${fallCompleteCount}`);
    if (destroyCount > 0) {renderStatus = 'destroy';}
    else if (destroyCompleteCount > 0) {if (renderStatus !== 'fallComplete') renderStatus = 'destroyComplete';}
    else if (fallCount > 0) {renderStatus = 'fall';}
    else if (fallCompleteCount > 0) {renderStatus = 'fallComplete';}
    // console.log(renderStatus);
}

function changeState() {
    if (renderStatus === 'destroyComplete'){
        doFall();
    } else if (renderStatus === 'fallComplete'){
        doRefill();
    }
    if(score.value >= gameOptions.roundScore){
        gameOver(`Поздравляем! Вы выиграли! Ваш счет: ${score.value}`);
    }
}

function doFall() {
    // renderStatus = 'fall';
    makeTilesFall();
}

function doRefill() {
    refillField();
    // refillRenderArray();
    renderStatus = 'base';
    canPick = true;
    checkMove = true;
}

function gameOver(message) {
    reset();
    alert(message);
}

function doCheckMove() {
    if(checkMove){
        canPick = false;
        isMoveAvailable = finder.findMove();
        // move.length > 2 ? isMoveAvailable = true: isMoveAvailable = false;
        canPick = true;
        checkMove = false;
    }
}

function refillField(){
    for (let j = 0; j < gameOptions.fieldSize; j++){
        let emptyBlocks = holesInCol(j);
        if(emptyBlocks > 0){
            for (let i = 0; i < emptyBlocks; i++){
                fillCell(getCell(i, j).pos, i, j);
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

// function refillRenderArray() {
//     renderArray = [];
//     for (let i = 0; i < getRawCellData().length; i++){
//         for (let j = 0; j < getRawCellData()[i].length; j++){
//             renderArray.push({row: i, col: j});
//         }
//     }
// }

function makeTilesFall() {
    for (let i = gameOptions.fieldSize - 2; i >= 0; i--){
        for (let j = 0; j < gameOptions.fieldSize; j++){
            if (!getCell(i, j).isEmpty){
                let holes = holesBelow(i, j);
                if (holes > 0){
                    renderStatus = 'fall';
                    let item = {row: i, col: j};
                    // deleteFromRenderArray(item);
                    item = {row: i+holes, col: j};
                    // renderFallArray.push(item);
                    // deleteFromRenderArray(item);
                    getCell(i, j).isEmpty = true;
                    getCell(i+holes, j).isEmpty = false;
                    getCell(i+holes, j).tile = getCell(i,j).tile;
                    getTile(i+holes, j).state = 'fall';
                    getTile(i+holes, j).pos.y = getCell((i+holes), j).pos.y;
                    getTile(i+holes, j).index.row = getCell((i+holes), j).index.row;
                }
            }
        }
    }
    if (renderStatus === 'destroyComplete') renderStatus = 'fallComplete';
}

// function deleteFromRenderArray(item) {
//     let index = renderArray.findIndex(itemRender => (item.row == itemRender.row)&&(item.col == itemRender.col));
//     if (index !== -1) renderArray.splice(index, 1);
// }

function holesBelow(row, col) {
    let result = 0;
    for (let i = row+1; i < gameOptions.fieldSize; i++) {
        if (getCell(i, col).isEmpty) result++;
    }
    return result;
}

function doPickedCellActions() {
    if (pickedCell){
        getCell(pickedCell.row, pickedCell.col).action();
        pickedCell = 0;
    }
}

function reset() {
    // document.getElementById('game-over').style.display = 'none';
    // document.getElementById('game-over-overlay').style.display = 'none';
    clearData();
    clearFlags();
    roundTimer.stop();
    renderClear();
}

function clearFlags() {
    canPick = false;
    checkMove = false;
    gameIsStarted = false;
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
    let check = blockCheck(coordToIndex(x, y));
    if (check === -1) {
        pickedCell = 0;
    } else {
        pickedCell = check;
    }

}
function coordToIndex(x, y) {
    let row = Math.floor((y - gameOptions.fieldOffcetY - gameOptions.blockHeight * gameOptions.blockScale/2) / (gameOptions.blockHeight * gameOptions.blockScale));
    let col = Math.floor((x - gameOptions.fieldOffcetX - gameOptions.blockWidth * gameOptions.blockScale/2) / (gameOptions.blockWidth * gameOptions.blockScale));
    return {row, col}
}
function blockCheck(index){
    if(index.row < 0 || index.row >= gameOptions.fieldSize || index.col < 0 || index.col >= gameOptions.fieldSize){
        return -1;
    }
    return {row: index.row, col: index.col};
}

function shuffleField(){
    for (let i = 0; i < gameOptions.fieldSize; i++) {
        for (let j = 0; j < gameOptions.fieldSize; j++) {
            getSprite(i, j).frames = randomColor();
        }
    }
}

let score = {
    value: 0,
    x: 616,
    y: 340,
    size: 40,

    calc: function (arr) {
        let tiles = arr.length;
        let scoreAdd = 0;
        switch (tiles){
            case 2:
                scoreAdd = tiles * 10;
                break;
            case 3:
                scoreAdd = tiles * 10 + 10;
                break;
            case 4:
                scoreAdd = tiles * 10 + 20;
                break;
            case 5:
                scoreAdd = tiles * 10 + 30;
                break;
            case 6:
                scoreAdd = tiles * 10 + 40;
                break;
            default:
                scoreAdd = tiles * 10 + 50;
                break;
        }
        this.value += scoreAdd;
    },
    draw: function () {
        drawText(this.value.toString(), this.x, this.y, this.size);
    }
};

let roundTimer = {
    x: 617,
    y: 237,
    size: 54,
    time: 0,
    timerId: 0,
    interval: 1000,
    start: function(time){
        this.time = time;
        this.timerId = setInterval(this.handler, roundTimer.interval);
    },
    handler: function () {
        if (roundTimer.time > 0){
            roundTimer.time--;
        } else {
            gameOver(`Время вышло! Вы проиграли! Ваш счет: ${score.value}`);
        }

    },
    draw: function () {
        drawText(this.time.toString(), this.x, this.y, this.size);
    },
    stop: function () {
        clearInterval(this.timerId);
        this.time = 0;
    }
};