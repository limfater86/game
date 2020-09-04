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
    }
};

let btnShuffle = {
    x: 620,
    y: 530,
    w: 496,
    h: 157,
    scale: 0.3,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/button2.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('ПЕРЕМЕШАТЬ',this.x+75, this.y+32, 18);
    },
    click: function () {
        console.log('pressed Shuffle Button');
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

let boosterBomb = {
    x: 505,
    y: 400,
    w: 437,
    h: 451,
    scale: 0.26,
    count: 0,
    draw: function(){
        ctx.drawImage(resources.get( 'assets/bonus.png',), 0, 0, this.w, this.h, this.x, this.y, this.w*this.scale, this.h*this.scale);
        drawText('Bomb', this.x+57, this.y+50, 18);
        drawText(this.count.toString(), this.x+45, this.y+90, 24);
    },
    click: function () {
        console.log('pressed BoosterBomb Button');
    }
};

let boosterShuffle = {
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
        console.log('pressed BoosterShuffle Button');
    }
};

canvas.addEventListener("mouseup", buttonsHandler,false);


function buttonsHandler(e){
    if(checkCollision(e.offsetX,e.offsetY, btnStart)) {btnStart.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnShuffle)) {btnShuffle.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnAddMoney)) {btnAddMoney.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnAddMoney2)) {btnAddMoney2.click()}
    else if (checkCollision(e.offsetX,e.offsetY, boosterBomb)) {boosterBomb.click()}
    else if (checkCollision(e.offsetX,e.offsetY, boosterShuffle)) {boosterShuffle.click()}

}


// let btnStart = function (button) {
//     let x = 520;
//     let y = 550;
//     let w = 110;
//     let h = 47;
//     let scale = 0.3;
//     this.handleEvent = function(e){
//         if(checkCollision(e.offsetX,e.offsetY, this))
//             alert("Retrying!")
//     };
//     ctx.drawImage(resources.get( 'assets/button.png',), 0, 0, w, h, x, y, w*scale, h*scale);
//     button.addEventListener("mouseup", this, false);
//
// };



function checkCollision(x, y, obj){
    return x >= obj.x && x <= obj.x + obj.w*obj.scale &&
        y >= obj.y && y <= obj.y + obj.h*obj.scale;
}

