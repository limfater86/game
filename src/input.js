import {btnShuffle, btnAddMoney, btnStart, btnAddMoney2, boosters } from "./buttons";
import {blockSelect} from "./game";


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
    return x >= obj.prop.x && x <= obj.prop.x + obj.prop.w*obj.prop.scale &&
        y >= obj.prop.y && y <= obj.prop.y + obj.prop.h*obj.prop.scale;
}

export {checkCollision, inputHandler};