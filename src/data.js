let _cellArray = [];

function getRawCellData() {
    return _cellArray;
}

function getCell(row, col) {
    return getRawCellData()[row][col];
}
function getTile(row, col) {
    return getRawCellData()[row][col].tile;
}
function getSprite(row, col) {
    return getRawCellData()[row][col].tile.sprite;
}

export {
    getTile,
    getCell,
    getRawCellData,
    getSprite
}