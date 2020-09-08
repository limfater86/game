function render(dt) {
    renderInterface();
    if (renderStatus === 'destroy') renderDestroyTiles(dt);
    else if (renderStatus === 'fall') renderFallTiles(dt);
    renderStaticTiles();
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

function renderDestroyTiles(dt) {
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
    let onPos = 0;
    renderFallArray.forEach(item => {
        let dy = cellArray[item.row][item.col].tile.sprite.pos.y + dt * gameOptions.fallSpeed;
        if (dy > cellArray[item.row][item.col].tile.pos.y) {
            dy = cellArray[item.row][item.col].tile.pos.y;
            onPos++;
        }
        cellArray[item.row][item.col].tile.sprite.pos.y = dy;
        renderEntity(cellArray[item.row][item.col].tile.sprite);

    });
    if (onPos === renderFallArray.length){
        renderStatus = 'fallComplete';
        renderFallArray = [];
    }
}

function renderStaticTiles() {
    renderEntities(renderArray);
}

function renderEntities(list) {
    for (let i = 0; i< list.length; i++){
        let row = list[i].row;
        let col = list[i].col;
        renderEntity(cellArray[row][col].tile.sprite);
    }
}

function renderEntity(entity) {
    entity.render(ctx);
}

function renderClear() {
    cellArray = [];
    renderArray = [];
    renderDestroyArray = [];
    renderFallArray = [];
    renderStatus = 'base';
}
