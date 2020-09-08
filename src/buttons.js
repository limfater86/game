let btnStart = {
    x: 470,
    y: 530,
    w: 367,
    h: 157,
    scale: 0.3,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('СТАРТ',this.x+55, this.y+32, 20);
    },
    click: function () {
        console.log('pressed Start Button');
        canPick = true;
        drawField();
        startingFillCells();
        roundTimer.start(gameOptions.roundTime);
        boosters.bomb.count = 5;
        boosters.shuffle.count = 5;
        checkMove = true;
    }
};

let btnShuffle = {
    x: 620,
    y: 530,
    w: 496,
    h: 157,
    scale: 0.3,
    count: 0,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button2.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('ПЕРЕМЕШАТЬ',this.x+75, this.y+32, 18);
    },
    click: function () {
        if (!isMoveAvailable){
            shuffleField();
            this.count++;
        }
        if (this.count > 4){
            reset();
            alert('Нет доступных ходов! Вы проиграли!');
        }

    }
};

let btnAddMoney = {
    x: 65,
    y: 15,
    w: 122,
    h: 126,
    scale: 0.26,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button_plus.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('0',this.x+47, this.y+22, 18);
    },
    click: function () {
        console.log('pressed AddMoney Button');
    }
};

let btnAddMoney2 = {
    x: 500,
    y: 15,
    w: 122,
    h: 126,
    scale: 0.26,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button_plus.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('0',this.x+65, this.y+22, 18);
    },
    click: function () {
        console.log('pressed AddMoney Button');
    }
};

let boosters = {
    bomb: {},
    shuffle: {},
    x: 620,
    y: 390,
    textSize: 24,
    draw: function () {
        drawText('БОНУСЫ', this.x, this.y, this.textSize);
        this.bomb.draw();
        this.shuffle.draw();
    }
};

boosters.bomb = {
    x: 505,
    y: 400,
    w: 437,
    h: 451,
    scale: 0.26,
    count: 0,
    enable: false,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/bonus.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('Bomb', this.x+57, this.y+50, 18);
        drawText(this.count.toString(), this.x+45, this.y+90, 24);
    },
    click: function () {
        if (this.count > 0){
            this.enable ? this.enable = false : this.enable = true;
            console.log(`Нажата кнопка boosterBomb boosterActive = ${this.enable}`);
        }
    },
    blast: function (index){
        if (this.count > 0){
            let arr = [];
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (index.row+i >= 0 && index.row+i < gameOptions.fieldSize && index.col+j >= 0 && index.col+j < gameOptions.fieldSize) {
                        arr.push({row: index.row + i, col: index.col + j});
                    }
                }
            }
            this.count--;
            this.enable = false;
            return arr;
        }

    }
};

boosters.shuffle = {
    x: 620,
    y: 400,
    w: 437,
    h: 451,
    scale: 0.26,
    count: 0,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/bonus.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('Shuffle', this.x+57, this.y+50, 18);
        drawText(this.count.toString(), this.x+45, this.y+90, 24);
    },
    click: function () {
        if (this.count > 0){
            shuffleField();
            this.count--;
        }
    }
};

function checkCollision(x, y, obj){
    return x >= obj.x && x <= obj.x + obj.w*obj.scale &&
        y >= obj.y && y <= obj.y + obj.h*obj.scale;
}
