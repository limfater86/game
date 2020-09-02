
(function() {
    function Sprite(attr) {
        this.pos = {x: attr.pos.x, y: attr.pos.y};
        // this.pos = attr.pos;
        this.size = attr.size;
        this.scale = typeof attr.scale === 'number' ? attr.scale : 1;
        this.speed = typeof attr.speed === 'number' ? attr.speed : 0;
        this.frames = attr.frames;
        this._index = 0;
        this.url = attr.url;
        this.dir = attr.dir || 'horizontal';
        this.once = attr.once;
        this._alpha = attr.alpha;
    }

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },

        get alpha() {
            return this._alpha;
        },

        set alpha(value) {
            this._alpha = value;
        },

        // get pos(){
        //     return {x: this._pos.x, y:this._pos.y};
        // },
        //
        // set pos(value){
        //     this._pos.x = value.x;
        //     this._pos.y = value.y;
        // },

        // set _pos.x(){
        //
        // },
        // set _pos.y(){
        //
        // },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if(this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = this.frames;
            }


            let x = this.pos.x;
            let y = this.pos.y;
            // let x = this.pos[0];
            // let y = this.pos[1];
            let frameX=0, frameY=0;

            if(this.dir == 'vertical') {
                frameY += frame * this.size[1];
            }
            else {
                frameX += frame * this.size[0];
            }
            ctx.drawImage(resources.get(this.url),
                          frameX, frameY,
                          this.size[0], this.size[1],
                          x, y,
                          this.size[0]*this.scale, this.size[1]*this.scale);
        }
    };

    window.Sprite = Sprite;
})();