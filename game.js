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
    swapSpeed: 200,
    fallSpeed: 200,
    destroySpeed: 3,
    shuffleNum: 3,
    roundTime: 30
};

let lastTime;
let score = 0;
let cellArray = [];
let poolArray = [];
let renderStatus = 'base';
let renderArray = [];
let renderDestroyArray = [];
let renderFallArray = [];
let gameTime = 0;
let pickedCell;

class cell {
    constructor(pos, index){
        this.isEmpty = true;
        this.pos = {x: pos.x, y: pos.y};
        this.index = {row: index.row, col: index.col};
        this.tile = {};
    }
    action(){
        this.tile.action();
    }

}
class tile {
    constructor(pos, frame, index, state){
        let spriteAttr = {
            url: 'assets/blocks.png',
            pos: {x: pos.x, y: pos.y},
            size: [gameOptions.blockWidth, gameOptions.blockHeight],
            speed: 0,
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
        if (findMatch(this.index)) {
            markDestroyTiles(poolArray);
            if (poolArray.length > 6) {
                placeSuperTile(this.index);
                renderDestroyArray.splice(this.index, 1);
                renderArray.push(this.index);
            }
            scoreCount(this);
        }

    }

    get state (){
        return this._state;
    }

    set state(value){
        this._state = value;
    }

}

class superTile extends tile {
    constructor(pos, frame, index, state){
        super(pos, frame, index, state);
        this.type = 'super';
    };
    action(){
        markDestroyTiles(makeSuperArray(this.index));
        scoreCount(this);
        // cellArray[this.index.row][this.index.col].type = 'standard';
    }
}

function placeSuperTile(index) {
    fillCell(makePosition(index.row, index.col), index.row, index.col, 'super');
}

function markDestroyTiles(arr) {
    arr.forEach((item) => {
        renderDestroyArray.push(item);
        deleteFromRenderArray(item);
        cellArray[item.row][item.col].isEmpty = true;
    });
    renderStatus = 'destroy';
}

function findMatch(index){
    poolArray = [];
    poolArray = finder.scan(index);
    return poolArray.length > 1;
}

let finder = new SameColorAreasFinder();

function makeSuperArray(index){
    let arr = [];
    for (let i = 0; i < gameOptions.fieldSize; i++){
        arr.push({row: index.row, col: i});
    }
    return arr;
}

resources.load([
    'assets/Background.png',
    'assets/field.png',
    'assets/button.png',
    'assets/button2.png',
    'assets/background_progress.png',
    'assets/scorepanel.png',
    'assets/bonus.png',
    'assets/money.png',
    'assets/money2.png',
    'assets/pause.png',
    'assets/button_plus.png',
    'assets/blocks.png',
]);
resources.onReady(init);

function init() {
    drawStaticImages();
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    reset();
    lastTime = Date.now();
    drawField();
    startingFillCells();
    main();
}

function drawStaticImages(){
    ctx.drawImage(resources.get('assets/Background.png'), 0, 0);
    ctx.drawImage(resources.get( 'assets/field.png'), 20, 120, 410, 455);
    ctx.drawImage(resources.get( 'assets/background_progress.png'), 30, 0, 622, 78);
    ctx.drawImage(resources.get( 'assets/money.png',), 65, 15, 80, 33);
    ctx.drawImage(resources.get( 'assets/money2.png',), 500, 15, 110, 33);
    ctx.drawImage(resources.get( 'assets/scorepanel.png',), 500, 120, 235, 250);
}

function main() {
    let dt = timeTick();
    update(dt);
    render(dt);
    requestAnimFrame(main);
}

function timeTick() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;
    lastTime = now;
    return dt;
}

function drawField(){
    for (let i = 0; i < gameOptions.fieldSize; i++){
        cellArray[i] = [];
        for (let j = 0; j < gameOptions.fieldSize; j++){
            cellArray[i][j] = new cell(makePosition(i, j), {row: i, col: j});
        }
    }

}

function startingFillCells() {
    for (let i = 0; i < cellArray.length; i++){
        for (let j = 0; j < cellArray[i].length; j++){
            fillCell(cellArray[i][j].pos, i, j);
            renderArray.push({row: i, col: j});
        }
    }
}

function fillCells(array) {
    array.forEach((item) => {
        fillCell(makePosition(item.row, item.col), item.row, item.col)
    })
}

function fillCell(pos, i, j, type = 'standard') {
    if (type === 'standard') cellArray[i][j].tile = createStandardTile(pos, i, j);
    else cellArray[i][j].tile = createSuperTile(pos, i, j);
    cellArray[i][j].isEmpty = false;
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

function update(dt) {
    doPickedCellActions();
    if (renderStatus === 'destroyComplete'){
        renderStatus = 'fall';
        makeTilesFall();
    } else if (renderStatus === 'fallComplete'){
        refillField();
        refillRenderArray();
        renderStatus = 'base';
    }
    // updateGameTime(dt);
    // updateEntities(dt);
}

function refillField(){
    for (let j = 0; j < gameOptions.fieldSize; j++){
        let emptyBlocks = holesInCol(j);
        if(emptyBlocks > 0){
            for (let i = 0; i < emptyBlocks; i++){
                fillCell(cellArray[i][j].pos, i, j);
                // cellArray[i][j].tile.sprite.frames = randomColor();
                // cellArray[i][j].isEmpty = false;
                // this.gameArray[i][j].blockSprite.x = gameOptions.fieldOffcetX + gameOptions.blockWidth * gameOptions.blockScale * j + gameOptions.blockWidth / 2;
                // this.gameArray[i][j].blockSprite.y = gameOptions.fieldOffcetY + gameOptions.blockHeight * gameOptions.blockScale / 2 - (emptyBlocks - i) * gameOptions.blockHeight * gameOptions.blockScale;
            }
        }
    }
}
function holesInCol(col){
    let result = 0;
    for (let i = 0; i < gameOptions.fieldSize; i++){
        if(cellArray[i][col].isEmpty) result++;
    }
    return result;
}

function refillRenderArray() {
    renderArray = [];
    for (let i = 0; i < cellArray.length; i++){
        for (let j = 0; j < cellArray[i].length; j++){
            renderArray.push({row: i, col: j});
        }
    }
}

function makeTilesFall() {
    for (let i = gameOptions.fieldSize - 2; i >= 0; i--){
        for (let j = 0; j < gameOptions.fieldSize; j++){
            if (!cellArray[i][j].isEmpty){
                let holes = holesBelow(i, j);
                if (holes > 0){
                    let item = {row: i, col: j};
                    deleteFromRenderArray(item);
                    item = {row: i+holes, col: j};
                    renderFallArray.push(item);
                    deleteFromRenderArray(item);
                    cellArray[i][j].isEmpty = true;
                    cellArray[i+holes][j].isEmpty = false;
                    cellArray[i+holes][j].tile = cellArray[i][j].tile;
                    cellArray[i+holes][j].tile.pos.y = cellArray[i+holes][j].pos.y;
                    cellArray[i+holes][j].tile.index.row = cellArray[i+holes][j].index.row;
                    // cellArray[i+holes][j].tile.sprite.frames = cellArray[i][j].tile.sprite.frames;
                    // cellArray[i+holes][j].tile.sprite.pos.y = cellArray[i][j].tile.sprite.pos.y;
                    // cellArray[i+holes][j].tile.type = cellArray[i][j].tile.type;
                    // cellArray[i+holes][j].tile.pos = cellArray[i+holes][j].pos;
                    // cellArray[i+holes][j].tile.index.row = cellArray[i+holes][j].index.row;
                    // cellArray[i+holes][j].tile.index.col = cellArray[i+holes][j].index.col;
                }
            }
        }
    }
}

function deleteFromRenderArray(item) {
    let index = renderArray.findIndex(itemRender => (item.row == itemRender.row)&&(item.col == itemRender.col));
    if (index !== -1) renderArray.splice(index, 1);
}

function holesBelow(row, col) {
    let result = 0;
    for (let i = row+1; i < gameOptions.fieldSize; i++) {
        if (cellArray[i][col].isEmpty) result++;
    }
    return result;
}

function doPickedCellActions() {
    if (pickedCell){
        cellArray[pickedCell.row][pickedCell.col].action();
        pickedCell = 0;
    }
}

function updateGameTime(dt){
    gameTime += dt;
}

function updateEntities(dt) {


}

function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    gameTime = 0;
    score = 0;
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

function scoreCount(tile){
    let tiles = poolArray.length;
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
    score += scoreAdd;
    if (tile.type === 'super') score += 20;
    // if(pickedBlock.isSuper) this.score += 20;
    // this.scoreText.setText(this.score);
    // if (this.score.toString().length == 2) this.scoreText.x = 590;
    // else if (this.score.toString().length == 3) this.scoreText.x = 582;
    // else if (this.score.toString().length == 4) this.scoreText.x = 572;
    // else this.scoreText.x = 602;
    // this.progressBarMask.x += this.progressBarMask.displayWidth / (this.scoreTarget / scoreAdd);
    // if (this.score >= this.scoreTarget){
    //     alert(`Поздравляем! Вы победили! Ваш Счет ${this.score}`);
    //     this.gameOver();
    // }
}