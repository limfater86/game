import {
    getTile,
} from "./data";

import {gameOptions} from "./game";

function SameColorAreasFinder () {
    let matchedBlocks = [];
    let scannedBlocks = [];
    let currentScan = [];
    this.scan = function(scanBlock){
        init(scanBlock);
        doScan();
        return matchedBlocks;
    };

    this.findMove = function () {
        let fullScan = createScanOrder();
        while (fullScan.length > 0){
            init(fullScan[0]);
            doScan();
            if (matchedBlocks.length > gameOptions.minAreaSize) return matchedBlocks;
            deleteFromScan();
            fullScan.shift();
        }
        return -1;
    };

    function createScanOrder() {
        let arr = [];
        for (let i = 0; i < gameOptions.fieldSize; i++) {
            for (let j = 0; j < gameOptions.fieldSize; j++){
                arr.push({row: i, col: j});
            }
        }
        return arr;
    }

    function deleteFromScan() {
        matchedBlocks.forEach((tile) => {
            let index = currentScan.findIndex((itemScan)=> (tile.index.row == itemScan.row) && (tile.index.col == itemScan.col));
            if (index !== -1){
                currentScan.splice(index, 1);
            }
        });
    }

    function init(scanBlock) {
        matchedBlocks = [];
        scannedBlocks = [];
        currentScan = [];
        currentScan.push(scanBlock);
        matchedBlocks.push(getTile(scanBlock.row, scanBlock.col));
        scannedBlocks.push(scanBlock);
    }
    function doScan() {
        while (currentScan.length){
            tileScan(currentScan[0]);
            currentScan.shift();
        }
    }
    function tileScan (scanTile){
        let row = 0, col = 0;
        for (let i = -1; i < 2; i++){
            for (let j = -1; j < 2; j++){
                if ( Math.abs(i) != Math.abs(j) ){
                    row = scanTile.row + i;
                    col = scanTile.col + j;
                    if (isTileInField({row: row, col: col})) {
                        nearbyBlockCheck(getTile(row, col), getTile(scanTile.row, scanTile.col));
                    }
                }
            }
        }

    }

    function nearbyBlockCheck (nearTile, scanTile){
        let include = scannedBlocks.findIndex((item)=> (item.row == nearTile.index.row) && (item.col == nearTile.index.col));
        if (include === -1){
            if (nearTile.sprite.frames === scanTile.sprite.frames){
                matchedBlocks.push(nearTile);
                currentScan.push(nearTile.index);
            }
            scannedBlocks.push(nearTile.index);
        }
    }
}

function isTileInField(index){
    return !(index.row < 0 || index.row >= gameOptions.fieldSize || index.col < 0 || index.col >= gameOptions.fieldSize);
}

export {isTileInField, SameColorAreasFinder}