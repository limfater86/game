let staticImages = {
    background: {},
    field: {},
    background_progress: {},
    money: {},
    money2: {},
    scorePanel: {},

    draw: function () {
        this.background.draw();
        this.field.draw();
        this.background_progress.draw();
        this.money.draw();
        this.money2.draw();
        this.scorePanel.draw();
    }
};

staticImages.background = {
    x: 0, y: 0,
    pic: 'assets/Background.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y);
    }
};

staticImages.field = {
    x: 20, y: 120,
    w: 1635, h: 1819,
    scale: 0.25,
    pic: 'assets/field.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y, this.w * this.scale, this.h * this.scale);
    }
};

staticImages.background_progress = {
    x: 30, y: 0,
    w: 2827, h: 348,
    scale: 0.22,
    pic: 'assets/background_progress.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y, this.w * this.scale, this.h * this.scale);
    }
};

staticImages.money = {
    x: 65, y: 15,
    w: 397, h: 163,
    scale: 0.2,
    pic: 'assets/money.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y, this.w * this.scale, this.h * this.scale);
    }
};

staticImages.money2 = {
    x: 500, y: 15,
    w: 529, h: 163,
    scale: 0.2,
    pic: 'assets/money2.png',

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y, this.w * this.scale, this.h * this.scale);
    }
};

staticImages.scorePanel = {
    x: 500, y: 120,
    w: 1118, h: 1188,
    scale: 0.21,
    pic: 'assets/scorepanel.png',
    gameScore: {},
    timer: {},

    draw: function () {
        ctx.drawImage(resources.get(this.pic), this.x, this.y, this.w * this.scale, this.h * this.scale);
        this.gameScore.draw();
        this.timer.draw();
    }
};

let progressbar = {
    x: 181, y: 26,
    w: 0, h: 86,
    scale: 0.2,
    MAX_WIDTH: 273,
    FULL_WIDTH: 1258,
    progress: 0,
    pic: 'assets/progress.png',

    calc: function (){
        this.progress = this.MAX_WIDTH * score.value/gameOptions.roundScore;
        this.w = this.FULL_WIDTH * score.value/gameOptions.roundScore;
        this.progress > this.MAX_WIDTH ? this.progress = this.MAX_WIDTH : this.progress;
        this.width > this.FULL_WIDTH ? this.width = this.FULL_WIDTH : this.width;
    },
    draw: function (){
        this.calc();
        ctx.drawImage(resources.get(this.pic,), 0, 0, this.w, this.h, this.x, this.y, this.progress, this.h * this.scale);
    }

};

staticImages.scorePanel.gameScore = score;
staticImages.scorePanel.timer = roundTimer;