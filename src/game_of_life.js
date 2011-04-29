

/**
  * class GameOfLife
  * 
  */

GameOfLife = function (canvas, interval)
{
    Game.call(this, canvas, interval);
	this._world = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	
	for (var i = 0; i < this._world.data.length; i += 4)
	{
		this._world.data[i+3] = 255;
	}
		
    this.rows = canvas.height;
    this.cols = canvas.width;
	var random_life_count=Math.floor(Math.random()*this.rows*this.cols);
	for (var i=0; i<random_life_count; i++)
	{
		var random_pixel = Math.floor(Math.random()*this.rows*this.cols);
		this._world.data[random_pixel*4] = 255;
	}	
	
	//this._world.data[219*4] = 255;
	//this._world.data[220*4] = 255;
	//this._world.data[221*4] = 255;
	//this._world.data[221*4 - this.cols*4] = 255;
	//this._world.data[220*4 - this.cols*2*4] = 255;

	this.ctx.putImageData(this._world, 0, 0);
	
    this.offsets   = [-this.cols-1, -this.cols, -this.cols+1, 
	                  -1, +1,
					  +this.cols-1, +this.cols, +this.cols+1];
    this.offsets_r = [+2*this.cols-1, -this.cols, -this.cols+1, 
                      -1, +1,
                      +this.cols-1, +this.cols, -2*this.cols+1];
	this.offsets_l = [-this.cols-1, -this.cols, -this.cols+1, 
                      -1, +1,
                      +this.cols-1, +this.cols, +this.cols+1];
	var game = this;
	canvas.addEventListener("click", function(e) 
	{
	   var x = e.clientX-canvas.offsetLeft;
	   var y = e.clientY-canvas.offsetTop;
	   game._world.data[y*game.cols*4 + x*4] = 255;
	   game.ctx.putImageData(game._world, 0, 0);
    }, false);
}

GameOfLife.prototype = new Game;

GameOfLife.prototype.update = function ()
{
    var imgd = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var current = imgd.data;
	var next = this._world.data;

    for (var i = 0, n = next.length; i < n; i += 4)  
	{
		var count = count_around_me(this,i,current);
		
//Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if (current[i] == 255 && count < 2) 
		  next[i] = 0;
//Any live cell with two or three live neighbours lives on to the next generation.
        //if (current[i] == 255 && (count == 2 || count == 3) next[i] = 255;
//Any live cell with more than three live neighbours dies, as if by overcrowding.
        if (current[i] == 255 && count > 3) 
		  next[i] = 0;
//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		if (current[i] == 0 && count == 3) 
		  next[i] = 255;
    }
	
	this.ctx.putImageData(this._world, 0, 0);
}

GameOfLife.prototype.draw = function ()
{
    return;
}

function create_world(game)
{
    var world = []
	var rows = game.canvas.height;
	var cols = game.canvas.width;
	for (var row=0;row<rows;row++)
	{
		world.push([]);
		for (var col=0;col<cols;col++)
		{
			world[row].push(false);
		}
	}
	game._world = world;
}

function count_around_me(game,pix_index,pix_array)
{
	var count = 0;
	var test_index = 0;
	offsets = game.offsets;
	
	if ((test_index % (game.cols*4)) == game.cols-1) offsets = game.offsets_r;
	if ((test_index % (game.cols*4)) == 0) offsets = game.offsets_l;
	
	for (var i=0;i<game.offsets.length;i++)
	{
		test_index = pix_index + game.offsets[i] * 4;
		      
		if (test_index >= pix_array.length) 
		  test_index = test_index - pix_array.length;
		if (test_index < 0) 
		  test_index = test_index + pix_array.length;
		if (pix_array[test_index] == 255) 
		  count+=1;
	}
	return count;
}
