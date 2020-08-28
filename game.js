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
    fallSpeed: 100,
    destroySpeed: 200,
    shuffleNum: 3,
    roundTime: 30
};

let lastTime;
let cellArray = [];
let poolArray = [];
let renderArray = [];
let needActionArray = [];
let gameTime = 0;
let pickedCell;

class cell {
    constructor(pos, index){
        this.isEmpty = true;
        this.pos = pos;
        this.index = index;
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
            pos: [0,0],
            size: [gameOptions.blockWidth, gameOptions.blockHeight],
            speed: 0,
            frames: frame,
            scale: gameOptions.blockScale,
        };
        this.pos = pos;
        this.index = index;
        this.state = state;
        this.type = 'standard';
        this.sprite = new Sprite(spriteAttr)
    }

    action(){
        if (findMatch(this.index)) { markDestroyTiles()};
    }

    changeState(){

    }

}

function markDestroyTiles() {
    poolArray.forEach((item) => {
        cellArray[item.row][item.col].state = 'needDestroy';
    });
    renderArray.push(poolArray);
}

function findMatch(index){
    poolArray = [];
    poolArray = sameColorAreasFinder.scan(index);
    return poolArray.length > 1;
}

let sameColorAreasFinder = {
    // matchedBlocks: [],
    // scannedBlocks: [], //массив проверенных блоков
    // currentScan: [], //последовательность проверки блоков
    scan: function(scanBlock){
        this.matchedBlocks = [];
        this.scannedBlocks = []; //массив проверенных блоков
        this.currentScan = []; //последовательность проверки блоков
        this.currentScan.push(scanBlock);
        this.matchedBlocks.push(scanBlock);
        this.scannedBlocks.push(scanBlock);
            while (this.currentScan.length){
                this.blockScan(this.currentScan[0]);
            }
            return this.matchedBlocks;
    },
    blockScan:function(scanBlock){
        let nearbyBlock = {};
        for (let i = -1; i < 2; i++){
            if (i == 0){
                for (let j = -1; j < 2; j+=2){
                    nearbyBlock = {row: scanBlock.row, col: scanBlock.col + j};
                    this.nearbyBlockCheck(nearbyBlock, scanBlock);
                }
            } else {
                nearbyBlock = {row: scanBlock.row + i, col: scanBlock.col};
                this.nearbyBlockCheck(nearbyBlock, scanBlock);
            }
        }
        this.currentScan.shift();
    },
    nearbyBlockCheck: function (nearBlock, scanBlock){
        let include = this.scannedBlocks.findIndex((item)=> (item.row == nearBlock.row) && (item.col == nearBlock.col));
            if (include === -1){
                if (nearBlock.row >= 0 && nearBlock.row < gameOptions.fieldSize && nearBlock.col >= 0 && nearBlock.col < gameOptions.fieldSize) {
                    if (cellArray[nearBlock.row][nearBlock.col].tile.sprite.frames === cellArray[scanBlock.row][scanBlock.col].tile.sprite.frames){
                        this.matchedBlocks.push(nearBlock);
                        this.currentScan.push(nearBlock);
                    }
                    this.scannedBlocks.push(nearBlock);
                }
            }
    }
};

class superTile extends tile {
    constructor(pos, frame, index){
        super(pos, frame, index);
        this.type = 'super';
    };
    action(){
        makeSuperArray(this.index.row);
    }
}

function makeSuperArray(row){
    let arr = [];
    for (let i = 0; i < gameOptions.fieldSize; i++){
        arr.push({row: row, col: i});
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
    update(timeTick());
    render();
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
        renderArray[i]= [];
        for (let j = 0; j < cellArray[i].length; j++){
            fillCell(cellArray[i][j].pos, i, j);
            renderArray[i][j] = {row: i, col: j};
        }
    }
}

function fillCells(array) {
    array.forEach((item) => {
        fillCell(makePosition(item.row, item.col), item.row, item.col)
    })
}

function fillCell(pos, i, j) {
    cellArray[i][j].tile = createStandardTile(pos, i, j);
    cellArray[i][j].isEmpty = false;
}

function createStandardTile(pos, i,j, state){
    return new tile(pos, randomColor(), {row: i, col: j}, (state || 'base'));
}

function createSuperTile(pos, i,j, state) {
    return new tile(pos, randomColor(), {row: i, col: j}, (state ||'base'));
}

function makePosition(i, j) {
    return [gameOptions.fieldOffcetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth*gameOptions.blockScale/2, gameOptions.fieldOffcetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight*gameOptions.blockScale/2];
}

function randomColor(){
    return Math.floor(Math.random() * Math.floor(gameOptions.blockColors-1));
}

function update(dt) {
    doPickedCellActions();
    updateGameTime(dt);
    updateEntities(dt);
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

function render() {
    if (renderArray.length > 0){
        renderEntities(renderArray);
    }
}

function renderEntities(list) {
    for (let i = 0; i< list.length; i++){
        let index = list[i][0];
        if (checkTileState(index) === 'base'){
            for (let j=0; j<list[i].length; j++){
                let row = list[i][j].row;
                let col = list[i][j].col;
                renderEntity(cellArray[row][col]);
            }
        } else if (checkTileState(index) === 'needDestroy'){

        } else if (checkTileState(index) === 'needMove'){

        }
    };

}

function checkTileState(index){
    return cellArray[index.row][index.col].tile.state;
}

// function renderStaticEntity(entity) {
//     entity.tile.sprite.render(ctx);
// }

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.tile.sprite.render(ctx);
    ctx.restore();
}

function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    gameTime = 0;

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