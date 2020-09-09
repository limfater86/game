function render() {
    renderInterface();
    if (gameIsStarted) renderCells();
    // if (renderStatus === 'destroy') renderDestroyTiles(dt);
    // else if (renderStatus === 'fall') renderFallTiles(dt);
    // renderStaticTiles();
}

function renderCells() {
    for (let i = 0; i < getRawCellData().length; i++) {
        for (let j = 0; j < getRawCellData()[i].length; j++) {
            getCell(i, j).draw();
        }
    }
}

function renderInterface() {
    staticImages.draw();
    boosters.draw();
    progressbar.draw();
    drawButtons();
}


function drawButtons() {
    btnStart.draw();
    btnShuffle.draw();
    btnAddMoney.draw();
    btnAddMoney2.draw();
}

function drawText(text, x, y, size) {
    ctx.font = `${size}px Marvin`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

// function renderDestroyTiles(dt) {
//     let transparency = calcTransparency(dt);
//     ctx.globalAlpha = transparency;
//     renderEntities(renderDestroyArray);
//     ctx.globalAlpha = 1;
//     setSpriteTransparency(transparency);
//     if (transparency <= 0) {
//         transparency = 1;
//         setSpriteTransparency(transparency);
//         renderDestroyArray = [];
//         renderStatus = 'destroyComplete';
//     }
// }

// function calcTransparency(dt) {
//     let result = getSpriteAlpha(renderDestroyArray[0]);
//     result -= dt * gameOptions.destroySpeed;
//     return result > 0 ? result : 0;
// }

// function getSpriteAlpha(index) {
//     return getSprite(index.row, index.col).alpha;
// }
//
// function setSpriteTransparency(alpha) {
//     renderDestroyArray.forEach(item => {
//         getSprite(item.row, item.col).alpha = alpha;
//     })
// }

// function renderFallTiles(dt) {
//     let onPos = 0;
//     renderFallArray.forEach(item => {
//         let dy = getSprite(item.row, item.col).pos.y + dt * gameOptions.fallSpeed;
//         if (dy > getTile(item.row, item.col).pos.y) {
//             dy = getTile(item.row, item.col).pos.y;
//             onPos++;
//         }
//         getSprite(item.row, item.col).pos.y = dy;
//         renderEntity(getSprite(item.row, item.col));
//     });
//     if (onPos === renderFallArray.length){
//         renderStatus = 'fallComplete';
//         renderFallArray = [];
//     }
// }

// function renderStaticTiles() {
//     renderEntities(renderArray);
// }
//
// function renderEntities(list) {
//     for (let i = 0; i< list.length; i++){
//         let row = list[i].row;
//         let col = list[i].col;
//         renderEntity(getSprite(row, col));
//     }
// }
//
// function renderEntity(entity) {
//     entity.render(ctx);
// }

function renderClear() {
    // renderArray = [];
    // renderDestroyArray = [];
    // renderFallArray = [];
    renderStatus = 'base';
}
