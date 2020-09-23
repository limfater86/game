import {
    requestAnimFrame,
    ctx,
} from './frame';

import {checkCollision} from './input';
import {gameScene} from "./game";
import {drawText} from './render';
import './resources';

let background = {
    x: 0, y: 0,
    w: 640, h: 359,
    scale: 1.25,
    pic: 'assets/Background.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y);
    }
};

let beginButton = {
    x: 300, y: 300,
    w: 496, h: 157,
    scale: 0.4,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button2.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('Войти в Игру',this.x+100, this.y+40, 18);
    },
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


