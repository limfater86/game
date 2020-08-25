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
let tileArray = [];
let gameTime = 0;
let pickedBlock;

class tile {
    constructor(pos, frame){
        let spriteAttr = {
            url: 'assets/blocks.png',
            pos: [0, 0],
            size: [gameOptions.blockWidth, gameOptions.blockHeight],
            speed: 0,
            frames: [frame],
            scale: gameOptions.blockScale,
        };
        this.pos = pos;
        this.sprite = new Sprite(spriteAttr)

    }

    action(){

    }

}

class superTile extends tile {

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

function init() {
    drawStaticImages();
    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    reset();
    lastTime = Date.now();
    drawField();
    main();
}

function drawField(){
    for (let i = 0; i < gameOptions.fieldSize; i++){
        tileArray[i] = [];
        for (let j = 0; j < gameOptions.fieldSize; j++){
            tileArray[i][j] = new tile(makePosition(i, j), randomColor());
        }
    }
}

function makePosition(i, j) {
    return [gameOptions.fieldOffcetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth*gameOptions.blockScale/2, gameOptions.fieldOffcetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight*gameOptions.blockScale/2];
}

function randomColor(){
    return Math.floor(Math.random() * Math.floor(gameOptions.blockColors-1));
}

function update(dt) {
    gameTime += dt;
    updateEntities(dt);
}

function updateEntities(dt) {


}

function render() {
    renderEntities(tileArray);

}

function renderEntities(list) {
    for (let i=0; i<list.length; i++) {
        for (let j=0; j<list[i].length; j++){
            renderEntity(list[i][j]);
        }

    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    gameTime = 0;

}