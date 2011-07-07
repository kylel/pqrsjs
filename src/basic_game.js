console.log("entering basic_game.js");

window.requestAnimFrame = (function(){
	return 	window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function (callback, element){
				window.setTimeout(callback, 1000/60);
			};
})();

/**
  * class GameObject
  * 
  */
GameObject = function (game)
{
	this.toRemove = false;
	this.game = game;
	//if (this.game) this.game.add(this);
}

GameObject.prototype.draw = function (ctx)
{
	alert("unimplemented abstract method");
}

GameObject.prototype.update = function (dt)
{
	alert("unimplemented abstract method");
}

GameObject.prototype.loadContent = function ()
{
	alert("unimplemented abstract method");
}

/**
  * class BasicGame
  * 
  */
BasicGame = function (canvas)
{
    this.gameObjects = [];
	this._timer = new Timer();
	
	if (canvas) 
	{
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}
	this.paused = false;
}

BasicGame.prototype.update = function (dt)
{
    var toRemove = [];
	for (var index in this.gameObjects)
    {
        this.gameObjects[index].update(dt);
		if (this.gameObjects[index].toRemove) toRemove.push(this.gameObjects[index]);
    }
	for (var index in toRemove)
    {
        this.remove(toRemove[index]);
    }
}

BasicGame.prototype.loadContent = function ()
{
	for (var index in this.gameObjects)
    {
        this.gameObjects[index].loadContent();
    }
}

BasicGame.prototype.loadContent = function ()
{
	for (var index in this.gameObjects)
    {
        this.gameObjects[index].loadContent(dt);
    }
}

BasicGame.prototype.draw = function ()
{
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height); //clear buffer
    for (var index=0; index < this.gameObjects.length; index++)
    {
        if (this.gameObjects[index].draw) this.gameObjects[index].draw(this.ctx);
    }
}

BasicGame.prototype.pause = function ()
{
    this.paused = true;
}

BasicGame.prototype.resume = function ()
{
    this.paused = false;
}

BasicGame.prototype.add = function (obj)
{
	this.gameObjects.push(obj);
}

BasicGame.prototype.remove = function (obj)
{
    var i = -1;
	i = this.gameObjects.indexOf(obj);
    if (i!=-1) this.gameObjects.splice(i, 1);
}

BasicGame.prototype.loop = function ()
{
    this._dt = this._timer.tick();
	if (!this.paused)
	{
		this.update(this._dt);
		this.draw();
	}
}

BasicGame.prototype.start = function ()
{
	var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.canvas);
	})();
}