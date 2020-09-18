import {ctx} from "./frame";
import {flags} from "./game";
import {getRawCellData, getCell} from "./data";
import {progressbar, staticImages} from "./interface";
import {boosters, btnAddMoney2, btnStart, btnAddMoney, btnShuffle,} from "./buttons";

function render() {
    renderInterface();
    if (flags.gameIsStarted) renderCells();
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

export {drawText, render}

