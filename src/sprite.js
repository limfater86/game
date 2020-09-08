
(function() {
    function Sprite(attr) {
        this.pos = {x: attr.pos.x, y: attr.pos.y};
        this.size = attr.size;
        this.scale = typeof attr.scale === 'number' ? attr.scale : 1;
        this.frames = attr.frames;
        this.url = attr.url;
        this.dir = attr.dir || 'horizontal';
        this.once = attr.once;
        this._alpha = attr.alpha;
    }

    Sprite.prototype = {

        get alpha() {
            return this._alpha;
        },

        set alpha(value) {
            this._alpha = value;
        },

        render: function(ctx) {
            var frame;
            frame = this.frames;

            let x = this.pos.x;
            let y = this.pos.y;
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