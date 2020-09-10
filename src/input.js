
(function() {
    document.addEventListener("mouseup", inputHandler,false);
})();

function inputHandler(e){
    blockSelect(e.offsetX, e.offsetY);
    if(checkCollision(e.offsetX,e.offsetY, btnStart)) {btnStart.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnShuffle)) {btnShuffle.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnAddMoney)) {btnAddMoney.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnAddMoney2)) {btnAddMoney2.click()}
    else if (checkCollision(e.offsetX,e.offsetY, boosters.bomb)) {boosters.bomb.click()}
    else if (checkCollision(e.offsetX,e.offsetY, boosters.shuffle)) {boosters.shuffle.click()}

}

function checkCollision(x, y, obj){
    return x >= obj.x && x <= obj.x + obj.w*obj.scale &&
        y >= obj.y && y <= obj.y + obj.h*obj.scale;
}