'use strict';

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
    fallSpeed: 120,
    destroySpeed: 3,
    shuffleNum: 3,
    roundTime: 30
};

let lastTime;
let cellArray = [];
let poolArray = [];
let renderStatus = 'base';
let renderArray = [];
let renderBaseArray = [];
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

    // get pos(){
    //     return {x: this._pos.x, y:this._pos.y};
    // }
    //
    // set pos(value){
    //     this._pos.x = value.x;
    //     this._pos.y = value.y;
    // }

}
class tile {
    constructor(pos, frame, index, state){
        let spriteAttr = {
            url: 'assets/blocks.png',
            // pos: pos,
            pos: {x: pos.x, y: pos.y},
            size: [gameOptions.blockWidth, gameOptions.blockHeight],
            speed: 0,
            frames: frame,
            scale: gameOptions.blockScale,
            alpha: 1
        };
        this.pos = {x: pos.x, y: pos.y};
        // this.pos = pos;
        this.index = {row: index.row, col: index.col};
        this._state = state;
        this.type = 'standard';
        this.sprite = new Sprite(spriteAttr)
    }

    action(){
        if (findMatch(this.index)) { markDestroyTiles() }
    }

    get state (){
        return this._state;
    }

    set state(value){
        this._state = value;
    }

    // get pos(){
    //     return {x: this._pos.x, y:this._pos.y};
    // }
    //
    // set pos(value){
    //     this._pos.x = value.x;
    //     this._pos.y = value.y;
    // }

}

function markDestroyTiles() {
    poolArray.forEach((item) => {
        // cellArray[item.row][item.col].tile.state = 'needDestroy';
        renderDestroyArray.push(item);
    });
    // console.log(renderDestroyArray);
}

function findMatch(index){
    poolArray = [];
    poolArray = sameColorAreasFinder.scan(index);
    return poolArray.length > 1;
}

let sameColorAreasFinder = {
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
    return {x: gameOptions.fieldOffcetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth*gameOptions.blockScale/2, y: gameOptions.fieldOffcetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight*gameOptions.blockScale/2};
}

function randomColor(){
    return Math.floor(Math.random() * Math.floor(gameOptions.blockColors-1));
}

function update(dt) {
    doPickedCellActions();
    if (renderStatus === 'destroyComplete'){
        poolArray.forEach(item => {
           // cellArray[item.row][item.col].tile = {} ;
           cellArray[item.row][item.col].isEmpty = true;
        });
        renderStatus = 'fall';
        makeTilesFall();
    }
    // updateGameTime(dt);
    // updateEntities(dt);
}

function makeTilesFall() {
    poolArray = [];
    for (let i = gameOptions.fieldSize - 2; i >= 0; i--){
        for (let j = 0; j < gameOptions.fieldSize; j++){
            if (!cellArray[i][j].isEmpty){
                let holes = holesBelow(i, j);
                if (holes > 0){
                    poolArray.push({row: i, col: j});
                    renderFallArray.push({row: i+holes, col: j});
                    cellArray[i][j].isEmpty = true;
                    cellArray[i+holes][j].isEmpty = false;
                    cellArray[i+holes][j].tile.sprite.frames = cellArray[i][j].tile.sprite.frames;
                    cellArray[i+holes][j].tile.sprite.pos.y = cellArray[i][j].tile.sprite.pos.y;
                    cellArray[i+holes][j].tile.type = cellArray[i][j].tile.type;
                    // cellArray[i+holes][j].tile.pos = cellArray[i+holes][j].pos;
                    // cellArray[i+holes][j].tile.index.row = cellArray[i+holes][j].index.row;
                    // cellArray[i+holes][j].tile.index.col = cellArray[i+holes][j].index.col;
                }
            }
        }
    }
    renderFallArray.forEach(itemFall => {
        let index = renderArray.findIndex(itemCurrent => (itemFall.row == itemCurrent.row)&&(itemFall.col == itemCurrent.col));
        if (index !== -1) renderArray.splice(index, 1);
    });
    poolArray.forEach(itemPool => {
        let index = renderArray.findIndex(itemCurrent => (itemPool.row == itemCurrent.row)&&(itemPool.col == itemCurrent.col));
        if (index !== -1) renderArray.splice(index, 1);
    });
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

function render(dt) {
    renderInterface();
    renderDestroyTiles(dt);
    renderFallTiles(dt);
    renderStaticTiles();
}

function renderInterface() {
    drawStaticImages();
    // score
    // progressbar
    // time
    // bonus
    //buttons
}

function renderDestroyTiles(dt) {
    if (renderDestroyArray.length > 0){
        renderStatus = 'destroy';
        let alpha = getSpriteAlpha(renderDestroyArray[0]);
        // alert(`alpha = ${alpha}, dt = ${dt}`);
        alpha -= dt * gameOptions.destroySpeed;
        alpha > 0 ? ctx.globalAlpha = alpha : ctx.globalAlpha = 0;
        renderEntities(renderDestroyArray);
        ctx.globalAlpha = 1;
        setSpriteAlpha(alpha, renderDestroyArray);
        if (alpha <= 0) {
            renderDestroyArray = [];
            renderStatus = 'destroyComplete';
        }
    }

}

function getSpriteAlpha(index) {
    return cellArray[index.row][index.col].tile.sprite.alpha;
}

function setSpriteAlpha(alpha, list) {
    list.forEach(item => {
        cellArray[item.row][item.col].tile.sprite.alpha = alpha;
    })
}

function renderFallTiles(dt) {
    if (renderFallArray.length > 0){
        renderFallArray.forEach(item =>{
            // let spritePos = cellArray[item.row][item.col].tile.sprite.pos;
            // spritePos.y = dt*gameOptions.fallSpeed;
            // let tilePos = cellArray[item.row][item.col].tile.pos;
            // if (spritePos.y > tilePos.y) spritePos.y = tilePos.y;
            // cellArray[item.row][item.col].tile.sprite.pos = spritePos;
            let dy = cellArray[item.row][item.col].tile.sprite.pos.y + dt*gameOptions.fallSpeed;
            if (dy > cellArray[item.row][item.col].tile.pos.y) dy = cellArray[item.row][item.col].tile.pos.y;
            cellArray[item.row][item.col].tile.sprite.pos.y = dy;
            // let dy = cellArray[item.row][item.col].tile.sprite.pos[1] + dt*gameOptions.fallSpeed;
            // if (dy > cellArray[item.row][item.col].tile.pos[1]) dy = cellArray[item.row][item.col].tile.pos[1];
            // cellArray[item.row][item.col].tile.sprite.pos[1] = dy;
            // ctx.save();
            // ctx.translate(dx, dy);
            renderEntity(cellArray[item.row][item.col]);
            // ctx.restore();
            renderStatus = 'basic';
        });
    }
}

function renderStaticTiles() {
    // let current = renderArray.slice();
    if(renderDestroyArray.length >0){
        renderDestroyArray.forEach((itemDestroy) => {
            let index = renderArray.findIndex((itemCurrent) => (itemDestroy.row == itemCurrent.row) && (itemDestroy.col == itemCurrent.col));
            if (index !== -1) renderArray.splice(index, 1);
        })
    }
    // console.log(current);
    renderEntities(renderArray);
}

// function renderBase() {
//     if (renderBaseArray.length > 0){
//         renderBaseEntities(renderBaseArray);
//         renderBaseArray = [];
//     }
// }
//
// function renderBaseEntities(list) {
//     for (let i = 0; i< list.length; i++){
//         let row = list[i].row;
//         let col = list[i].col;
//         renderBaseEntity(cellArray[row][col]);
//     }
// }
//
// function renderBaseEntity(entity) {
//     entity.tile.sprite.render(ctx);
// }
//
// function renderDestroy() {
//     if (renderDestroyArray.length > 0){
//         renderDestroyEntities(renderDestroyArray);
//         renderDestroyArray = [];
//         console.log('renderDestroy complete')
//     }
// }
// function renderDestroyEntities(list) {
//     for (let i = 0; i< list.length; i++){
//         let row = list[i].row;
//         let col = list[i].col;
//         renderDestroyEntity(cellArray[row][col]);
//     }
// }
// function renderDestroyEntity(entity) {
//     console.log('renderDestroy');
//     ctx.save();
//     ctx.translate(-300, 0);
//     entity.tile.sprite.render(ctx);
//     ctx.restore();
//     ctx.globalAlpha = 0.5;
//     entity.tile.sprite.render(ctx);
// }
// function renderMove() {
//     if (renderMoveArray.length > 0){
//         renderEntities(renderMoveArray);
//     }
// }
//
function renderEntities(list) {
    for (let i = 0; i< list.length; i++){
        let row = list[i].row;
        let col = list[i].col;
        renderEntity(cellArray[row][col]);
    }
}

// function checkTileState(index){
//     return cellArray[index.row][index.col].tile.state;
// }

function renderEntity(entity) {
    entity.tile.sprite.render(ctx);
}

// function renderEntity(entity) {
//     ctx.save();
//     ctx.translate(entity.pos[0], entity.pos[1]);
//     entity.tile.sprite.render(ctx);
//     ctx.restore();
// }

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