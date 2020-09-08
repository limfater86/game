function render(dt) {
    renderInterface();
    if (renderStatus === 'destroy') renderDestroyTiles(dt);
    else if (renderStatus === 'fall') renderFallTiles(dt);
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
    roundTimer.draw();
}

function drawBonus() {
    boosters.draw();
    boosters.bomb.draw();
    boosters.shuffle.draw();
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
