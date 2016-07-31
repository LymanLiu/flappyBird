(function(){
    var Bird = window.Bird = function (ID) {
        this.ID = ID;
        this.picArr = [
            [g.imageJosn.bird0_0,g.imageJosn.bird0_1,g.imageJosn.bird0_2],
            [g.imageJosn.bird1_0,g.imageJosn.bird1_1,g.imageJosn.bird1_2],
            [g.imageJosn.bird2_0,g.imageJosn.bird2_1,g.imageJosn.bird2_2]
        ];
        this.type = _.random(0,2);
        this.i = 0;
        this.width = this.picArr[0][0].width;
        this.height = this.picArr[0][0].height;
        this.x = 100;
        this.y = (g.winHeight - g.imageJosn.land.height) / 2;
        this.v = 0;
        this.a = 0.3;
        this.angle = 0;
        this.hasEnergy = false;
        this.upFram = 6;
        g.actorArr.push(this);
    }

    Bird.prototype.update = function () {

        this.v += this.a;
        if(!this.hasEnergy){
            this.y += this.v - 0.5 * this.a;
            this.angle = this.v / 20;
            this.i = 0;
        }else{
            this.y -= this.upFram - (this.v - 0.5 * this.a);
            this.angle = - this.v / 20;
            if(this.upFram < (this.v - 0.5 * this.a)){
                this.hasEnergy = false;
                this.v = 0;
            }
            if(g.Frame % 3 == 0) this.i ++;
            if(this.i > 2) this.i = 0;

        }

        if(this.y <= 50){
            this.y = 50;
        }

        if(this.ID == 0){
            if(g.Frame % 8 == 0) this.i ++;
            if(this.i > 2) this.i = 0;
            this.x = g.winWith / 2 + 24;
            this.y = (g.winHeight - g.imageJosn.land.height) / 2 + 50;
            this.angle = 0;
        }
    }

    Bird.prototype.render = function () {
        g.ctx.save();
        g.ctx.translate(this.x - 24, this.y - 24);
        g.ctx.rotate(this.angle);
        g.ctx.drawImage(this.picArr[this.type][this.i], - 24, - 24);
        g.ctx.restore();
    }

    Bird.prototype.getEnergy = function () {
        this.hasEnergy = true;
        this.v = 0;
    }
})();