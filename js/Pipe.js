(function(){
    var Pipe = window.Pipe = function(args){
        this.pic = args.pic;
        this.speed = g.landspeed;
        this.x = g.winWith;
        this.scoreLock = true;
        this.width = this.pic[0].width;
        this.height = _.random(150,(g.winHeight - g.imageJosn.land.height) - g.winHeight * 0.37);
        this.randomNUmber = _.random(140,155);
        this.y_up = g.winHeight - g.imageJosn.land.height - this.height;
        this.y_down = (g.winHeight - g.imageJosn.land.height) - this.height - this.randomNUmber;
        g.actorArr.push(this);
    }

    Pipe.prototype.update = function () {
        this.x -= this.speed / g.fps;
        if(this.x <= -g.winWith){
            _.without(g.actorArr,this);
        }

        if(g.bird.x - 10 >= this.x && g.bird.x - g.bird.width + 10 <= (this.x + this.width)){
            if( g.bird.y + 10 - g.bird.height  > this.y_down && g.bird.y - 10 < this.y_up){
                this.scoreLock = true;
            }else {
                g.stop = true;
            }
        }
        if(g.bird.x - g.bird.width + 10 > this.x + this.width && this.scoreLock){
            g.score1 ++;
            g.pointMusic.load();
            g.pointMusic.play();
            if(g.score1 > 9){
                g.score1 = 0;
                g.score2 ++;
            }
            this.scoreLock = false;
        }
    }

    Pipe.prototype.render = function () {
        g.ctx.drawImage(this.pic[0],0,0,this.width,this.height,this.x,this.y_up,this.width,this.height);
        g.ctx.drawImage(this.pic[1],0,this.pic[1].height - this.y_down,this.width,this.y_down,this.x,0,this.width,this.y_down);

    }

})();