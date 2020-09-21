import {
    requestAnimFrame,
    ctx,
} from './frame';

import {checkCollision} from './input';
import {drawText} from './render';
import './resources';
import {gameScene} from "./game";
import {welcomeScene} from "./welcome";

let message = '';

let background = {
    x: 0, y: 0,
    w: 640, h: 359,
    scale: 1.25,
    pic: 'assets/Background.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y);
    }
};

let againButton = {
    x: 200, y: 300,
    w: 496, h: 157,
    scale: 0.4,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button2.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('Начать заново',this.x+100, this.y+40, 16);
    },
    click: function () {
        gameOverScene.remove();
        gameScene.init();
    }
};

let exitButton = {
    x: 400, y: 300,
    w: 496, h: 157,
    scale: 0.4,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('Выйти',this.x+70, this.y+40, 18);
    },
    click: function () {
        gameOverScene.remove();
        welcomeScene.init();
    }
};

let gameOverScene = {
    init: init,
    remove: removeListener,
};

function init(msg) {
    message = msg;
    addListener();
    gameOver();
}

function removeListener() {
    document.removeEventListener("mouseup", Handler);
}

function addListener() {
    document.addEventListener("mouseup", Handler,false);
}

function Handler(e){
    if(checkCollision(e.offsetX,e.offsetY, exitButton)) {exitButton.click()}
    else if (checkCollision(e.offsetX,e.offsetY, againButton)) {againButton.click()}
}

function gameOver() {
    render();
    requestAnimFrame(gameOver);
}

function render() {
    background.draw();
    exitButton.draw();
    againButton.draw();
    drawMessage();
}

function drawMessage() {
    drawText(message,400, 200, 26);
}


export {
    gameOverScene,
}