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
    blockHeight: 190,
    blockWidth: 170,
    blockScale: 0.3,
    fieldOffcetY: 52,
    fieldOffcetX: -38,
    swapSpeed: 200,
    fallSpeed: 100,
    destroySpeed: 200,
    shuffleNum: 3,
    roundTime: 30
};

let lastTime;
let background;
let tileArray = [];
let gameTime = 0;

class tile {
    constructor(pos, frame){
        let spriteAttr = {
            url: 'assets/blocks.png',
            pos: [0, 0],
            size: [171, 192],
            speed: 0,
            frames: [frame],
            scale: 0.3,
        };
        this.pos = pos;
        this.sprite = new Sprite(spriteAttr)

    }

    action(){

    }

}

class superTile extends tile {

}

function main() {
    let now = Date.now();
    let dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    background = ctx.drawImage(resources.get('assets/Background.png'), 0, 0);
    background = ctx.drawImage(resources.get( 'assets/field.png'), 20, 120, 410, 455);
    background = ctx.drawImage(resources.get( 'assets/background_progress.png'), 30, 0, 622, 78);
    background = ctx.drawImage(resources.get( 'assets/money.png',), 65, 15, 80, 33);
    background = ctx.drawImage(resources.get( 'assets/money2.png',), 500, 15, 110, 33);
    background = ctx.drawImage(resources.get( 'assets/scorepanel.png',), 500, 120, 235, 250);

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });

    reset();
    lastTime = Date.now();
    drawField();
    main();
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

function drawField(){
    for (let i = 0; i < gameOptions.fieldSize; i++){
        for (let j = 0; j < gameOptions.fieldSize; j++){
            let position = [gameOptions.fieldOffcetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth/2, gameOptions.fieldOffcetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight/2];
            let color = Math.floor(Math.random() * Math.floor(gameOptions.blockColors-1));
            let block = new tile(position, color);
            tileArray.push(block);
            // tileArray[i][j] = {
            //     blockSprite: block
            // }
        }
    }


    // for (let i = 0; i < gameOptions.fieldSize; i++){
    //     tileArray[i] = [];
    //     for (let j = 0; j < gameOptions.fieldSize; j++){
    //         let block = this.add.sprite(gameOptions.fieldOffcetX + gameOptions.blockWidth*gameOptions.blockScale*j + gameOptions.blockWidth/2,
    //             gameOptions.fieldOffcetY + gameOptions.blockHeight*gameOptions.blockScale*i + gameOptions.blockHeight/2, 'blocks').setScale(gameOptions.blockScale);
    //         this.blockGroup.add(block);
    //         let randomColor = Phaser.Math.Between(0, gameOptions.blockColors-1);
    //         block.setFrame(randomColor);
    //         this.gameArray[i][j] = {
    //             blockColor: randomColor,
    //             blockSprite: block,
    //             isEmpty: false
    //             //isSuper: false
    //         }
    //
    //     }
    // }
}

function update(dt) {
    gameTime += dt;
    updateEntities(dt);
}

function updateEntities(dt) {


}

function render() {
        // renderEntity(tileArray[0]);
    renderEntities(tileArray);

}

function renderEntities(list) {
    for (let i=0; i<list.length; i++) {
        // for (let j=0; i<list[i].length; i++){
            renderEntity(list[i]);
        // }

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

};