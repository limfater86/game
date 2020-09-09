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
            if (matchedBlocks.length > gameOptions.minAreaSize) return true;
            deleteFromScan();
            fullScan.shift();
        }
        return false;
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
        matchedBlocks.forEach((itemMatch) => {
            let index = currentScan.findIndex((itemScan)=> (itemMatch.row == itemScan.row) && (itemMatch.col == itemScan.col));
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