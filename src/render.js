function render(dt) {
    renderInterface();
    renderDestroyTiles(dt);
    renderFallTiles(dt);
    renderStaticTiles();
}

function drawStaticImages(){
    ctx.drawImage(resources.get('assets/Background.png'), 0, 0);
    ctx.drawImage(resources.get( 'assets/field.png'), 20, 120, 410, 455);
    ctx.drawImage(resources.get( 'assets/background_progress.png'), 30, 0, 622, 78);
    ctx.drawImage(resources.get( 'assets/money.png',), 65, 15, 80, 33);
    ctx.drawImage(resources.get( 'assets/money2.png',), 500, 15, 110, 33);
    ctx.drawImage(resources.get( 'assets/scorepanel.png',), 500, 120, 235, 250);
}

function renderInterface() {
    drawStaticImages();
    score.draw();
    drawProgressbar();
    drawButtons();
    drawBonus();
    // time
    // bonus
    //buttons
}

function drawBonus() {
    drawText('БОНУСЫ', 620, 390, 24);
    boosterBomb.draw();
    boosterShuffle.draw();
}

function drawButtons() {
    btnStart.draw();
    btnShuffle.draw();
    btnAddMoney.draw();
    btnAddMoney2.draw();
}

function drawProgressbar() {
    const MAX_WIDTH = 273;
    const FULL_WIDTH = 1258;
    let progress = MAX_WIDTH * score.value/gameOptions.roundScore;
    let width = FULL_WIDTH * score.value/gameOptions.roundScore;
    progress > MAX_WIDTH ? progress = MAX_WIDTH : progress;
    width > FULL_WIDTH ? width = FULL_WIDTH : width;
    ctx.drawImage(resources.get( 'assets/progress.png',), 0, 0, width, 86, 181, 26, progress, 18);
}

// function drawScore() {
//     drawText(score.toString(), 616, 340, 40);
// }

function drawText(text, x, y, size) {
    ctx.font = `${size}px Marvin`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function renderDestroyTiles(dt) {
    if (renderStatus === 'destroy'){
        let transparency = calcTransparency(dt);
        ctx.globalAlpha = transparency;
        renderEntities(renderDestroyArray);
        ctx.globalAlpha = 1;
        setSpriteTransparency(transparency);
        if (transparency <= 0) {
            transparency = 1;
            setSpriteTransparency(transparency);
            renderDestroyArray = [];
            renderStatus = 'destroyComplete';
        }
    }

}

function calcTransparency(dt) {
    let result = getSpriteAlpha(renderDestroyArray[0]);
    result -= dt * gameOptions.destroySpeed;
    return result > 0 ? result : 0;
}

function getSpriteAlpha(index) {
    return cellArray[index.row][index.col].tile.sprite.alpha;
}

function setSpriteTransparency(alpha) {
    renderDestroyArray.forEach(item => {
        cellArray[item.row][item.col].tile.sprite.alpha = alpha;
    })
}

function renderFallTiles(dt) {
    // if (renderFallArray.length > 0){
    if (renderStatus === 'fall') {
        let onPos = 0;
        renderFallArray.forEach(item => {
            // let spritePos = cellArray[item.row][item.col].tile.sprite.pos;
            // spritePos.y = dt*gameOptions.fallSpeed;
            // let tilePos = cellArray[item.row][item.col].tile.pos;
            // if (spritePos.y > tilePos.y) spritePos.y = tilePos.y;
            // cellArray[item.row][item.col].tile.sprite.pos = spritePos;
            let dy = cellArray[item.row][item.col].tile.sprite.pos.y + dt * gameOptions.fallSpeed;
            if (dy > cellArray[item.row][item.col].tile.pos.y) {
                dy = cellArray[item.row][item.col].tile.pos.y;
                onPos++;
            }
            cellArray[item.row][item.col].tile.sprite.pos.y = dy;

            // let dy = cellArray[item.row][item.col].tile.sprite.pos[1] + dt*gameOptions.fallSpeed;
            // if (dy > cellArray[item.row][item.col].tile.pos[1]) dy = cellArray[item.row][item.col].tile.pos[1];
            // cellArray[item.row][item.col].tile.sprite.pos[1] = dy;
            // ctx.save();
            // ctx.translate(dx, dy);
            renderEntity(cellArray[item.row][item.col]);
            // ctx.restore();

        });
        if (onPos === renderFallArray.length){
            renderStatus = 'fallComplete';
            renderFallArray = [];
        }
    }
    // }
}

function renderStaticTiles() {
    // let current = renderArray.slice();
    // if(renderDestroyArray.length >0){
    //     renderDestroyArray.forEach((item) => {
    //         deleteFromRenderArray(item);
    //         // let index = renderArray.findIndex((itemCurrent) => (itemDestroy.row == itemCurrent.row) && (itemDestroy.col == itemCurrent.col));
    //         // if (index !== -1) renderArray.splice(index, 1);
    //     })
    // }
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