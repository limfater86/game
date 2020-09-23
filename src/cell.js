import {boosters} from "./buttons";
import {blastTiles, fillCell} from "./game";
import {isTileInField} from "./finder";
import {getCell, getTile} from "./data";

export default class Cell {
    constructor(pos, index){
        this.isEmpty = true;
        this.pos = {x: pos.x, y: pos.y};
        this.index = {row: index.row, col: index.col};
        this.tile = {};
    }
    action(){
        if (boosters.bomb.enable){
            let arr = boosters.bomb.blast(this.index);
            blastTiles(arr);
        } else this.tile.action(this);
    }

    draw (){
        if (!this.isEmpty) this.tile.draw();
    }

    update (){
        if (this.isEmpty){
            if (isTileInField({row: this.index.row-1, col: this.index.col})){
                if ((!getCell(this.index.row-1, this.index.col).isEmpty) && (getTile(this.index.row-1, this.index.col).state === 'fallComplete' || getTile(this.index.row-1, this.index.col).state === 'base' || getTile(this.index.row-1, this.index.col).state === 'destroyComplete')){
                    this.makeTileFall();
                }
            } else {
                fillCell(getCell(this.index.row, this.index.col));
            }
        } else if (this.tile.state === 'destroyComplete') this.isEmpty = true;
    }

    makeTileFall(){
        getCell(this.index.row, this.index.col).tile = getCell(this.index.row-1, this.index.col).tile;
        getCell(this.index.row-1, this.index.col).isEmpty = true;
        getCell(this.index.row, this.index.col).isEmpty = false;
        getTile(this.index.row, this.index.col).state = 'fall';
        getTile(this.index.row, this.index.col).pos.y = getCell(this.index.row, this.index.col).pos.y;
        getTile(this.index.row, this.index.col).index.row = getCell(this.index.row, this.index.col).index.row;
    }

}