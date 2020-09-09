
(function() {
    function Sprite(attr) {
        this.pos = {x: attr.pos.x, y: attr.pos.y};
        this.size = attr.size;
        this.scale = typeof attr.scale === 'number' ? attr.scale : 1;
        this.frames = attr.frames;
        this.url = attr.url;
        this.alpha = attr.alpha;
    }

    Sprite.prototype = {
        render: function () {
            let frameX = this.frames * this.size[0], frameY = 0;
            let x = this.pos.x;
            let y = this.pos.y;
            ctx.drawImage(resources.get(this.url),
                          frameX, frameY,
                          this.size[0], this.size[1],
                          x, y,
                          this.size[0]*this.scale, this.size[1]*this.scale);
        },

        renderDestroy: function (tile) {
            this.calcTransparency();
            ctx.globalAlpha = this.alpha;
            this.render();
            ctx.globalAlpha = 1;
            if (this.alpha == 0) {
                tile.state = 'destroyComplete';
            }
        },

        renderFall: function (tile) {
            let dy = this.pos.y + dt * gameOptions.fallSpeed;
            if(dy > tile.pos.y){
                this.pos.y = tile.pos.y;
                tile.state = 'fallComplete';
            } else this.pos.y = dy;
            this.render();
        },

        calcTransparency: function() {
            this.alpha -= dt * gameOptions.destroySpeed;
            if(this.alpha < 0) this.alpha = 0;
    }

        // get alpha() {
        //     return this._alpha;
        // },
        //
        // set alpha(value) {
        //     this._alpha = value;
        // },

        // render: function(ctx) {
        //     var frame;
        //     frame = this.frames;
        //
        //     let x = this.pos.x;
        //     let y = this.pos.y;
        //     let frameX=0, frameY=0;
        //
        //     if(this.dir == 'vertical') {
        //         frameY += frame * this.size[1];
        //     }
        //     else {
        //         frameX += frame * this.size[0];
        //     }
        //     ctx.drawImage(resources.get(this.url),
        //                   frameX, frameY,
        //                   this.size[0], this.size[1],
        //                   x, y,
        //                   this.size[0]*this.scale, this.size[1]*this.scale);
        // }
    };

    window.Sprite = Sprite;
})();