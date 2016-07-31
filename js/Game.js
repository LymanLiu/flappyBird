(function(){
    var Game = window.Game = function(args){
        //music
        this.flyMusic = document.getElementById("flyMusic");
        this.dieMusic = document.getElementById("dieMusic");
        this.pointMusic = document.getElementById("pointMusic");
        this.bgMusic = document.getElementById("bgMusic");

        this.canvas = document.getElementById(args.canvasId);
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.winWith = this.canvas.width;
        this.winHeight = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");
        this.Frame = 0;
        this._fps = 60;
        this.fps = 60;
        this.landspeed = 80;
        this._timestamp;
        this.timer;
        this.xhr;
        this.stop = false;
        this.readyLock = false;
        this.readyLock1 = true;
        this.readyLock2 = false;
        this.imageJosn = {};
        this.imageNumber = 0;
        this.actorArr = [];

        this.score1 = 7;
        this.score2 = 0;

        this.readyStart();
    }

    Game.prototype.readyStart = function () {
        var self = this;
        this.xhr = new XMLHttpRequest();
        this.xhr.onreadystatechange = function () {
            if(self.xhr.readyState == 4){

                var resultArr = eval("(" + self.xhr.responseText + ")").result;
                _.each(resultArr,function(result){
                    self.imageJosn[result.name] = new Image();
                    self.imageJosn[result.name].src = result.src;
                    self.imageJosn[result.name].onload = function () {
                        self.imageNumber ++;
                        self.ctx.clearRect(0,0,self.winWith,self.winHeight);
                        self.ctx.fillText("正在加载。。。" + self.imageNumber + "/" + resultArr.length,50,100);
                        if(self.imageNumber == resultArr.length){
                            self.readyGo();
                        }
                    }
                });
            }
        }
        this.xhr.open("get","json/init.json",true);
        this.xhr.send(null);
    }

    Game.prototype.init = function(){
        this.bg = new Background({"pic" : [this.imageJosn.bg_day,this.imageJosn.bg_night],"y" : 0, "speed" : 20,"ID" : 0});
        this.land = new Background({"pic" : [this.imageJosn.land],"y" : this.winHeight - this.imageJosn.land.height, "speed" : this.landspeed,"ID" : 1});
        new Pipe({"pic" : [this.imageJosn.pipe_up,this.imageJosn.pipe_down]});
        this.bird = new Bird(1);

        var self = this;
        this.canvas.addEventListener("touchstart", function () {
            if(self.stop) {
                self.stop = false;
                self.readyLock2 = true;
                self.readyLock = false;
                self.readyGo();
            };
            self.bird.getEnergy();
            self.flyMusic.play(); 
        },false)

        this.scoreArr = [this.imageJosn.font_048,this.imageJosn.font_049,this.imageJosn.font_050,
                         this.imageJosn.font_051,this.imageJosn.font_052,this.imageJosn.font_053,
                         this.imageJosn.font_054,this.imageJosn.font_055,this.imageJosn.font_056,
                         this.imageJosn.font_057,this.imageJosn.font_058,this.imageJosn.font_059
                    ]

    }

    Game.prototype.mainloop = function () {
        this.ctx.clearRect(0,0,this.winWith, this.winHeight);

        _.each(this.actorArr, function (actor) {
            actor.update();
            actor.render();
        });

        this.ctx.fillStyle = "rgba(255,255,255,1)";
        this.Frame ++;
        //this.ctx.fillText("帧编号 " + this.Frame,10,20);
        if(Date.parse(new Date()) == this._timestamp){
            this._fps ++;
        }else{
            this.fps = this._fps;
            this._fps = 0;
            this._timestamp = Date.parse(new Date());

        }

        if(this.Frame < 60) this.fps = 60;
        //this.ctx.fillText("帧率 " + this.fps, 10 , 40);
        //this.ctx.fillText("分数 " + this.score, 10 , 60);

        this.ctx.drawImage(this.scoreArr[this.score1],60,60);
        if(this.score2 > 0){
            this.ctx.drawImage(this.scoreArr[this.score2],30,60);
        }

        if(this.Frame % 240 == 0){
            new Pipe({"pic" : [this.imageJosn.pipe_up,this.imageJosn.pipe_down]});
        }

        var self = this;

        this.timer = window.requestAnimationFrame(function () {
            self.mainloop();
        });

        if(this.bird.y >= this.land.y) this.stop = true;
        if(this.stop){
            this.dieMusic.load();
            this.dieMusic.play();
            this.pointMusic.pause();
            this.GameOver();
        };

    }

    Game.prototype.onepageloop = function () {
        this.ctx.clearRect(0,0,this.winWith, this.winHeight);

        _.each(this.actorArr, function (actor) {
            actor.update();
            actor.render();
        });

        if(this.readyLock1){
            this.ctx.drawImage(this.imageJosn.title,this.winWith / 2 - 89, 100);
            this.ctx.drawImage(this.imageJosn.button_play,this.winWith / 2 - 58, this.bird.y + 100);
        }else if(this.readyLock2){
            this.ctx.drawImage(this.imageJosn.font_048,this.winWith / 2 - 12,80);
            this.ctx.drawImage(this.imageJosn.text_ready,this.winWith / 2 - 98, 150);
            this.ctx.drawImage(this.imageJosn.tutorial,this.winWith / 2 - 58, this.bird.y + 100);
        }

        this.Frame ++;
        if(Date.parse(new Date()) == this._timestamp){
            this._fps ++;
        }else{
            this.fps = this._fps;
            this._fps = 0;
            this._timestamp = Date.parse(new Date());

        }

        if(this.Frame < 60) this.fps = 60;

        var self = this;

        this.onepageTimer = window.requestAnimationFrame(function () {
            self.onepageloop();
        });

        if(this.readyLock) window.cancelAnimationFrame(this.onepageTimer);

    }

    Game.prototype.readyGo = function(){
        this.bg = new Background({"pic" : [this.imageJosn.bg_day,this.imageJosn.bg_night],"y" : 0, "speed" : 20,"ID" : 0});
        this.land = new Background({"pic" : [this.imageJosn.land],"y" : this.winHeight - this.imageJosn.land.height, "speed" : this.landspeed,"ID" : 1});
        this.bird = new Bird(0);

        this.bgMusic.play();

        var self = this;
        this.canvas.addEventListener("touchstart", function(){

            if(self.readyLock1) {
                self.readyLock1 = false;
                self.readyLock2 = true;
            }else if(self.readyLock2){
                self.readyLock2 = false;
                self.readyLock = true;
                self.bgMusic.pause();
                self.restStart();
            }
        },false);
        this.onepageloop();
    }

    Game.prototype.start = function () {
        this.mainloop();
    }

    Game.prototype.restStart = function () {
        this.actorArr = [];
        this.score1 = 0;
        this.score2 = 0;
        this.Frame = 0;
        this.init();
        this.start();
    }

    Game.prototype.GameOver = function () {
        window.cancelAnimationFrame(this.timer);
        this.ctx.fillStyle = "rgba(255,255,255,0.5)";
        this.ctx.fillRect(0,0,this.winWith,this.winHeight);
        this.ctx.drawImage(this.imageJosn.text_game_over,this.winWith / 2 - 102, this.winHeight / 2 - 150 );
        this.ctx.drawImage(this.imageJosn.button_play,this.winWith / 2 - 58, this.winHeight / 2 - 50 );

    }
})();