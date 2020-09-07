
(function() {
    document.addEventListener("mouseup", inputHandler,false);

    // var pressedKeys = {};
    //
    // function setKey(event, status) {
    //     var code = event.keyCode;
    //     var key;
    //
    //     switch(code) {
    //     case 32:
    //         key = 'SPACE'; break;
    //     case 37:
    //         key = 'LEFT'; break;
    //     case 38:
    //         key = 'UP'; break;
    //     case 39:
    //         key = 'RIGHT'; break;
    //     case 40:
    //         key = 'DOWN'; break;
    //     default:
    //         // Convert ASCII codes to letters
    //         key = String.fromCharCode(code);
    //     }
    //
    //     pressedKeys[key] = status;
    // }

    // document.addEventListener('keydown', function(e) {
    //     setKey(e, true);
    // });
    //
    // document.addEventListener('keyup', function(e) {
    //     setKey(e, false);
    // });
    //
    // window.addEventListener('blur', function() {
    //     pressedKeys = {};
    // });
    

    // window.input = {
    //     isDown: function(key) {
    //         return pressedKeys[key.toUpperCase()];
    //     }
    // };
})();

function inputHandler(e){
    blockSelect(e.offsetX, e.offsetY);
    if(checkCollision(e.offsetX,e.offsetY, btnStart)) {btnStart.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnShuffle)) {btnShuffle.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnAddMoney)) {btnAddMoney.click()}
    else if (checkCollision(e.offsetX,e.offsetY, btnAddMoney2)) {btnAddMoney2.click()}
    else if (checkCollision(e.offsetX,e.offsetY, boosterBomb)) {boosterBomb.click()}
    else if (checkCollision(e.offsetX,e.offsetY, boosterShuffle)) {boosterShuffle.click()}

}