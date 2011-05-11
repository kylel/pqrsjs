

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
	
	this.circ = new Circle(centre.x,centre.y,20,'#0f0');
	this.player = new Circle(centre.x,centre.y,20,'#f00');
	
	var keymap = {87 : 'up',
	              65 : 'left',
				  83 : 'down',
				  68 : 'right'};
	
	this.player.keys = {up:0,left:0,down:0,right:0};
	this.player.mouse = 0;
	
	this.player.change_key = function(key, state)
	{
		//alert(key);
		//alert(state);
		this.keys[keymap[key]] = state;
	}

	this.player.click = function(x, y, state)
	{
		//alert(key);
		//if (this.bullet) return;
		//alert(state);
		//this.keys[keymap[key]] = state;
		this.mouse = state;
	}
	
	this._input_handler.register(this.player);
	this.line = new Line(centre,another_point)
	this.add(this.circ);
	this.add(this.line);
	this.add(this.player);
	
}

TdsGame.prototype = new Game;

TdsGame.prototype.pre_update = function (dt)
{
	//this.line.rotate(0.1);
	var pointer = this._input_handler.get_mouse_position_canvas();
	this.circ._x = pointer.x;
	this.circ._y = pointer.y;
	var step = 0;
	var vel = {x:step,
	           y:step};
	vel.y -= this.player.keys.up;
	vel.y += this.player.keys.down;
	vel.x -= this.player.keys.left;
	vel.x += this.player.keys.right;
	
	this.player.move(vel);
	
	var pointa = {x:this.player._x,y:this.player._y};
	var pointb = this._input_handler.get_mouse_position_canvas();
	
	var diff = point_diff(pointa,pointb);
	
	if (this.player.mouse)
	{
		if (!this.bullet)
		{
			this.bullet = new Circle(pointa.x,pointa.y,5,'#ff0');
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
	}
	
	var angle_to_mouse = Math.atan2(diff.y,diff.x);
	
	this.line.change(pointa,pointb);
	

}

