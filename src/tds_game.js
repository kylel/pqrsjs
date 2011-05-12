/**
  * class TdsGame
  * 
  */

Player = function (pos,game)
{
	this._game = game;
	this._pos = pos;
	this._visible = new Circle(pos.x,pos.y,10,'#f00');
	this._weapon = null;
	this._vel = new Vector2D();
	//this._acc = new Vector2D(); // TODO - add acceleration!!!
	
	//this._weapons = []; // TODO - implement weapons!!!
	//this._current_weapon = "Rocket Launcher";
	
	this._keymap = {87 : 'up',
	                65 : 'left',
			  	    83 : 'down',
			 	    68 : 'right'};
	
	this._keys = {up:0,left:0,down:0,right:0};
	this._mouse_state= 0;
}

Player.prototype.update = function (dt)
{
	this._vel.y = this._keys.down  - this._keys.up;
	this._vel.x = this._keys.right - this._keys.left;
		
	this._pos = this._pos.add(this._vel.multiply(dt));
		
	this._visible._x = this._pos.x;
	this._visible._y = this._pos.y;
	
	if (this._bullet)
	{
		this._bullet.move(this._bullet.vel);
		if (this._bullet._x > this._game.canvas.width ||
		    this._bullet._x < 0 ||
			this._bullet._y > this._game.canvas.height ||
			this._bullet._y < 0) 
		{
			this._game.remove(this._bullet);
			delete this._bullet;
			this._bullet = null;
		}
	}
}

Player.prototype.render = function (ctx)
{
	this._visible.render(ctx);
}

Player.prototype.change_key = function(key, state)
{
	this._keys[this._keymap[key]] = state;
}

Player.prototype.click = function(x, y, state)
{
	this._mouse_state = state;
	if (this._mouse_state)
	{
		if (!this._bullet)
		{
			var mouse_pos = new Vector2D(x,y);
			this._bullet = new Circle(this._pos.x,this._pos.y,5,'#00f');
			this._bullet.vel = (mouse_pos.subtract(this._pos)).unit();//this._pos.subtract(mouse_pos);
			this._game.add(this._bullet);
		}
	}
}

/**
  * class TdsGame
  * 
  */

TdsGame = function (canvas, interval, ih)
{
    Game.call(this, canvas, interval);
	this._input_handler = ih;
	
	var centre = {x : this.canvas.width/2,
				  y : this.canvas.height/2};
	
	var another_point = {x : centre.x + 50,
						 y : centre.y + 50};
	
	this.player = new Player(new Vector2D(centre.x,centre.y), this);
	
	this._input_handler.register(this.player);
	this.line = new Line(centre,another_point)

	this.add(this.line);
	this.add(this.player);
	
}

TdsGame.prototype = new Game;

TdsGame.prototype.pre_update = function (dt)
{
	var pointer = this._input_handler.get_mouse_position_canvas();
	var pointa = {x:this.player._pos.x,y:this.player._pos.y};
	var pointb = this._input_handler.get_mouse_position_canvas();
	
	var diff = point_diff(pointa,pointb);
	
	/*if (this.player.mouse)
	{
		if (!this.bullet)
		{
			this.bullet = new Circle(pointa.x,pointa.y,5,'#00f');
			this.bullet.vel = vector_by_scalar(unit_vector(diff),10);
			this.add(this.bullet);
			//this.player.mouse = 0;
		}
	}
	
	if (this.bullet)
	{
		this.bullet.move(this.bullet.vel);
		if (this.bullet._x > this.canvas.width ||
		    this.bullet._x < 0 ||
			this.bullet._y > this.canvas.height ||
			this.bullet._y < 0) 
		{
			this.remove(this.bullet);
			delete this.bullet;
			this.bullet = null;
		}
	}*/
	
	var angle_to_mouse = Math.atan2(diff.y,diff.x);
	
	this.line.change(pointa,pointb);
	

}

