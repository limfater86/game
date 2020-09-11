function render() {
    renderInterface();
    if (gameIsStarted) renderCells();
}

function renderCells() {
    for (let i = 0; i < getRawCellData().length; i++) {
        for (let j = 0; j < getRawCellData()[i].length; j++) {
            getCell(i, j).draw();
        }
    }
}

function renderInterface() {
    staticImages.draw();
    boosters.draw();
    progressbar.draw();
    drawButtons();
}


function drawButtons() {
    btnStart.draw();
    btnShuffle.draw();
    btnAddMoney.draw();
    btnAddMoney2.draw();
}

function drawText(text, x, y, size) {
    ctx.font = `${size}px Marvin`;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}


// function renderClear() {
//     renderStatus = 'base';
// }
