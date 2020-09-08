// class data {
//     constructor(data){
//         this._data = data;
//     }
//
//     get tile (){
//         return this._data.tile;
//     }
//     set tile(value){
//         this._data.tile = value;
//     }
//     get sprite(){
//         return this._data.tile.sprite;
//     }
//     set sprite(value){
//         this._data.tile.sprite = value;
//     }
// }

// class data {
//     constructor(data){
//         this._data = data;
//     }
//     getRawCellData() {
//         return this._data;
//     }
//
//     getCell(row, col) {
//         return getRawCellData()[row][col];
//     }
//     getTile(row, col) {
//         return getRawCellData()[row][col].tile;
//     }
//     getSprite(row, col) {
//         return getRawCellData()[row][col].tile.sprite;
//     }
// }
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