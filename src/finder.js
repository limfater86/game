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
        let fullScan = [];
        let arr;
        for (let i = 0; i < gameOptions.fieldSize; i++) {
            for (let j = 0; j < gameOptions.fieldSize; j++){
                fullScan.push({row: i, col: j});
            }
        }
        while (fullScan.length > 0){
            arr = finder.scan(fullScan[0]);
            if (arr.length > gameOptions.minAreaSize){
                return arr;
            }
            arr.forEach((itemMatch) => {
                let index = fullScan.findIndex((itemScan)=> (itemMatch.row == itemScan.row) && (itemMatch.col == itemScan.col));
                if (index !== -1){
                    fullScan.splice(index, 1);
                }
            });
        }
        return arr;
    };

    function init(scanBlock) {
        matchedBlocks = [];
        scannedBlocks = [];
        currentScan = [];
        currentScan.push(scanBlock);
        matchedBlocks.push(scanBlock);
        scannedBlocks.push(scanBlock);
    }
    function doScan() {
        while (currentScan.length){
            blockScan(currentScan[0]);
            currentScan.shift();
        }
    }
    function blockScan (scanBlock){
        let nearbyBlock = {};
        for (let i = -1; i < 2; i++){
            if (i == 0){
                for (let j = -1; j < 2; j+=2){
                    nearbyBlock = {row: scanBlock.row, col: scanBlock.col + j};
                    nearbyBlockCheck(nearbyBlock, scanBlock);
                }
            } else {
                nearbyBlock = {row: scanBlock.row + i, col: scanBlock.col};
                nearbyBlockCheck(nearbyBlock, scanBlock);
            }
        }
    }
    function nearbyBlockCheck (nearBlock, scanBlock){
        let include = scannedBlocks.findIndex((item)=> (item.row == nearBlock.row) && (item.col == nearBlock.col));
        if (include === -1){
            if (nearBlock.row >= 0 && nearBlock.row < gameOptions.fieldSize && nearBlock.col >= 0 && nearBlock.col < gameOptions.fieldSize) {
                if (getSprite(nearBlock.row, nearBlock.col).frames === getSprite(scanBlock.row, scanBlock.col).frames){
                    matchedBlocks.push(nearBlock);
                    currentScan.push(nearBlock);
                }
                scannedBlocks.push(nearBlock);
            }
        }
    }
}