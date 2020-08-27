
(function() {
    function Sprite(attr) {
        this.pos = attr.pos;
        this.size = attr.size;
        this.scale = typeof attr.scale === 'number' ? attr.scale : 1;
        this.speed = typeof attr.speed === 'number' ? attr.speed : 0;
        this.frames = attr.frames;
        this._index = 0;
        this.url = attr.url;
        this.dir = attr.dir || 'horizontal';
        this.once = attr.once;
    };

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
        },

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
                frame = this.frames[0];
            }


            let x = this.pos[0];
            let y = this.pos[1];

            if(this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }
            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0]*this.scale, this.size[1]*this.scale);
        }
    };

    window.Sprite = Sprite;
})();