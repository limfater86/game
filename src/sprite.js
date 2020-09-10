
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
            ctx.drawImage(resources.get(this.url),
                this.frames * this.size[0], 0,
                this.size[0], this.size[1],
                this.pos.x, this.pos.y,
                this.size[0]*this.scale, this.size[1]*this.scale);
        },

        renderDestroy: function () {
            this.alpha -= dt * gameOptions.destroySpeed;
            if (this.alpha <= 0) this.alpha = 0;
            ctx.globalAlpha = this.alpha;
            this.render();
            ctx.globalAlpha = 1;
        },

        renderFall: function (tile) {
            this.pos.y += dt * gameOptions.fallSpeed;
            if(this.pos.y > tile.pos.y) this.pos.y = tile.pos.y;
            this.render();
        },


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