import {gameOptions, drawField, flags, shuffleField, gameScene} from "./game";
import {gameOverScene} from "./gameOver";
import {drawText, drawButton} from "./render";
import {getTile} from "./data";
import {isTileInField} from "./finder";
import {roundTimer} from "./interface";

let btnStart = {
    prop: {
        x: 470, y: 530,
        w: 367, h: 157,
        scale: 0.3,
        pic: 'assets/button.png',
        text: 'СТАРТ',
        textOfsetX: 55,
        textOfsetY: 32,
        textSize: 20,},
    draw: function () {drawButton(this.prop)},
    click: function () {
        if (!flags.gameIsStarted){
            flags.gameIsStarted = true;
            console.log('pressed Start Button');
            drawField();
            roundTimer.start(gameOptions.roundTime);
            boosters.bomb.count = gameOptions.boosterBombCount;
            boosters.shuffle.count = gameOptions.boosterShuffleCount;
        }

    }
};

let btnShuffle = {
    prop: {x: 620, y: 530,
        w: 496, h: 157,
        scale: 0.3,
        count: 0,
        pic: 'assets/button2.png',
        text: 'ПЕРЕМЕШАТЬ',
        textOfsetX: 75,
        textOfsetY: 32,
        textSize: 18,},
    draw: function () {drawButton(this.prop)},
    click: function () {
        if (!flags.isMoveAvailable){
            shuffleField();
            flags.isMoveAvailable = false;
            flags.checkMove = true;
            this.count++;
        }
        if (this.count > gameOptions.shuffleNum){
            gameScene.remove();
            gameOverScene.init('Нет доступных ходов! Вы проиграли!');
        }

    }
};

let btnAddMoney = {
    prop: {x: 65, y: 15,
        w: 122, h: 126,
        scale: 0.26,
        pic: 'assets/button_plus.png',
        text: '0',
        textOfsetX: 47,
        textOfsetY: 22,
        textSize: 18,},
    draw: function () {drawButton(this.prop)},
    click: function () {
        console.log('pressed AddMoney Button');
    }
};

let btnAddMoney2 = {
    prop: {x: 500, y: 15,
        w: 122, h: 126,
        scale: 0.26,
        pic: 'assets/button_plus.png',
        text: '0',
        textOfsetX: 65,
        textOfsetY: 22,
        textSize: 18,},
    draw: function () {drawButton(this.prop)},
    click: function () {
        console.log('pressed AddMoney2 Button');
    }
};

let boosters = {
    bomb: {},
    shuffle: {},
    x: 620, y: 390,
    textSize: 24,
    draw: function () {
        drawText('БОНУСЫ', this.x, this.y, this.textSize);
        this.bomb.draw();
        this.shuffle.draw();
    }
};

boosters.bomb = {
    prop: {x: 505, y: 400,
        w: 437, h: 451,
        scale: 0.26,
        pic: 'assets/bonus.png',
        text: 'Bomb',
        textOfsetX: 57,
        textOfsetY: 50,
        textSize: 18,},
    count: 0,
    enable: false,
    draw: function(){
        drawButton(this.prop);
        drawText(this.count.toString(), this.prop.x+45, this.prop.y+90, 24);
    },
    click: function () {
        if (this.count > 0){
            this.enable ? this.enable = false : this.enable = true;
            console.log(`Нажата кнопка boosterBomb boosterActive = ${this.enable}`);
        }
    },
    blast: function (index){
        if (this.count > 0){
            this.count--;
            this.enable = false;
            return this.makeBlastArr(index);
        }

    },

    makeBlastArr: function (index) {
        let arr = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (isTileInField({row: index.row + i, col: index.col + j})) {
                    arr.push(getTile(index.row + i, index.col + j));
                }
            }
        }
        return arr;
    }

};

boosters.shuffle = {
    prop: {x: 620, y: 400,
        w: 437, h: 451,
        scale: 0.26,
        pic: 'assets/bonus.png',
        text: 'Shuffle',
        textOfsetX: 57,
        textOfsetY: 50,
        textSize: 18,},
    count: 0,
    draw: function(){
        drawButton(this.prop);
        drawText(this.count.toString(), this.prop.x+45, this.prop.y+90, 24);
    },
    click: function () {
        if (this.count > 0){
            shuffleField();
            flags.isMoveAvailable = false;
            flags.checkMove = true;
            this.count--;
        }
    }
};

export {
    btnShuffle,
    btnAddMoney,
    btnStart,
    btnAddMoney2,
    boosters
}
