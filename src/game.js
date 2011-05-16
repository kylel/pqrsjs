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
  * class Game
  * 
  */
Game = function (canvas)
{
    this._visibles = [];
    this._actives = [];
	this._timer = new Timer();
	
	if (canvas) 
	{
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this._canvasBuffer = document.createElement('canvas');
		this._canvasBuffer.width = this.canvas.width;
		this._canvasBuffer.height = this.canvas.height;
		this._canvasBufferContext = this._canvasBuffer.getContext('2d');
	}
	this._paused = false;
}

Game.prototype.update = function (dt)
{
    if (this.preUpdate) this.preUpdate(dt);
	for (var index in this._actives)
    {
        this._actives[index].update(dt);
    }
}

Game.prototype.draw = function ()
{
    this._canvasBufferContext.fillStyle = '#fff';
    this._canvasBufferContext.fillRect(0,0,this.canvas.width,this.canvas.height); //clear buffer
    for (var index in this._visibles)
    {
        this._visibles[index].render(this._canvasBufferContext);
    }
    this.ctx.drawImage(this._canvasBuffer, 0, 0); //double buffering
}

Game.prototype.pause = function ()
{
    this._paused = true;
}

Game.prototype.resume = function ()
{
    this._paused = false;
}

Game.prototype.add = function (game_obj)
{
    if (game_obj.render) this._visibles.push(game_obj);
	if (game_obj.update) this._actives.push(game_obj);
}

Game.prototype.remove = function (game_obj)
{
    var i = -1;
	if (game_obj.render)
	{
		i = this._visibles.indexOf(game_obj);
        if (i!=-1) this._visibles.splice(i, 1);
	}
	
	if (game_obj.update)
    {
        i = this._actives.indexOf(game_obj);
        if (i!=-1) this._actives.splice(i, 1);
    }
}

Game.prototype.loop = function ()
{
    this._dt = this._timer.tick();
	if (!this._paused)
	{
		this.update(this._dt);
		this.draw();
	}
}

Game.prototype.start = function ()
{
	var that = this;
	(function gameLoop() {
		that.loop();
		requestAnimFrame(gameLoop, that.canvas);
	})();
}