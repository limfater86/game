import {
    requestAnimFrame,
    ctx,
} from './frame';

import {checkCollision} from './input';
import {gameScene} from "./game";
import {drawText, drawButton} from './render';
import './resources';

let background = {
    x: 0, y: 0,
    w: 640, h: 359,
    pic: 'assets/Background.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y);
    }
};

let beginButton = {
    prop: {x: 300, y: 300,
    w: 496, h: 157,
    scale: 0.4,
    pic: 'assets/button2.png',
    text: 'Войти в Игру',
    textOfsetX: 100,
    textOfsetY: 40,
    textSize: 18,},
    draw: function(){drawButton(this.prop)},
    click: function () {
        welcomeScene.remove();
        gameScene.init();
    }
};

let welcomeScene = {
    init: initWelcome,
    remove: removeWelcomeListener,
};

function initWelcome() {
    addWelcomeListener();
    welcome();
}

function removeWelcomeListener() {
    document.removeEventListener("mouseup", welcomeHandler);
}

function addWelcomeListener() {
    document.addEventListener("mouseup", welcomeHandler,false);
}

function welcomeHandler(e){
    if(checkCollision(e.offsetX,e.offsetY, beginButton)) {beginButton.click()}
}

function welcome() {
    renderWelcome();
    requestAnimFrame(welcome);
}

function renderWelcome() {
    background.draw();
    beginButton.draw();
    drawMessage();
}

function drawMessage() {
    drawText('Тестовая Игра с механикой "Blast"',400, 200, 26);
}


export {
    welcomeScene,
}


