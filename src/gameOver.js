import {
    requestAnimFrame,
    ctx,
} from './frame';

import {checkCollision} from './input';
import {drawText, drawButton} from './render';
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
    prop: {x: 200, y: 300,
        w: 496, h: 157,
        scale: 0.4,
        pic: 'assets/button2.png',
        text: 'Начать заново',
        textOfsetX: 100,
        textOfsetY: 40,
        textSize: 16,},
    draw: function(){ drawButton(this.prop)},
    click: function () {
        gameOverScene.remove();
        gameScene.init();
    }
};

let exitButton = {
    prop: {x: 400, y: 300,
    w: 496, h: 157,
    scale: 0.4,
    pic: 'assets/button.png',
    text: 'Выйти',
    textOfsetX: 70,
    textOfsetY: 40,
    textSize: 18,},
    draw: function(){drawButton(this.prop)},
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