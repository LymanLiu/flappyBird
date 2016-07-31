(function () {
    var Background = window.Background = function(args){
        this.ID = args.ID;
        if(this.ID == 0){
            this.pic = args.pic[_.random(0,1)];
        }else if(this.ID == 1){
            this.pic = args.pic[0];
        }
        this.width = this.pic.width;
        this.speed = args.speed;
        this.x = 0;
        this.y = args.y;
        this.acounmt = parseInt( g.winWith / this.width ) + 2;
        g.actorArr.push(this);
    }

    Background.prototype.update = function () {
        this.x -= this.speed / g.fps;
        if(this.x <= -this.width ) this.x = 0;
    }

    Background.prototype.render = function () {

        for(var i = 0; i < this.acounmt; i ++){
            if(this.ID == 0){
                g.ctx.drawImage(this.pic,this.x + this.width * i,this.y, g.winWith, g.winHeight);
            }else{
                g.ctx.drawImage(this.pic,this.x + this.width * i,this.y);

            }
        }
    }

})();