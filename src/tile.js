import {blastTiles, gameOptions, finder, checkOnSuper, makeSuperArray, makePosition,} from "./game";


class Tile {
    constructor(pos, frame, index, state){
        let spriteAttr = {
            url: 'assets/blocks.png',
            pos: makePosition(index.row-1, index.col),
            size: [gameOptions.blockWidth, gameOptions.blockHeight],
            frames: frame,
            scale: gameOptions.blockScale,
            alpha: 1
        };
        this.pos = {x: pos.x, y: pos.y};
        this.index = {row: index.row, col: index.col};
        this._state = state;
        this.type = 'standard';
        this.sprite = new Sprite(spriteAttr)
    }

    action(cell){
        let arr = finder.scan(this.index);
        if (arr.length >= gameOptions.minAreaSize) {
            blastTiles(arr);
            checkOnSuper(cell, arr);
        }
    }

    draw (){
        if (this._state === 'fallComplete'){
            this.sprite.render();
        } else if ((this._state === 'destroy') || (this._state === 'destroyComplete')){
            this.sprite.renderDestroy();
            if (this.sprite.alpha === 0 && this._state === 'destroy') this._state = 'destroyComplete';
        } else if (this._state === 'fall'){
            this.sprite.renderFall(this);
            if (this.sprite.pos.y == this.pos.y) this.state = 'fallComplete';
        }

    }

    set state(newState){
        this._state = newState;
    }

    get state(){
        return this._state;
    }

}

class SuperTile extends Tile {
    constructor(pos, frame, index, state){
        super(pos, frame, index, state);
        this.type = 'super';
        this.sprite.pos = {x: pos.x, y: pos.y};
    };
    action(){
        let arr = makeSuperArray(this.index);
        blastTiles(arr);
    }
}

export {Tile, SuperTile}