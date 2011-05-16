/**
  * class Bullet
  * 
  */

Bullet = function (pos, vel)
{
	this._pos = pos;
	this._vel = vel;
	this._visible = new Circle(this._pos.x,this._pos.y,5,'#00f');
}

Bullet.prototype.update = function(dt)
{
	this._pos = this._pos.add(this._vel.multiply(dt));
	this._visible.setPosition(this._pos);
}

Bullet.prototype.render = function(ctx)
{
	this._visible.render(ctx);
}

/**
  * class Gun
  * 
  */

Gun = function (name, player, clip_size, vel)
{
	this._player = player;
	this._pos = this._player._pos; //TODO - player get pos?
	// TODO this._visible = new Line(new Vector2D(this._player._pos.x, this._player._pos.y), new Vector2D());
	this.name = name;
	this._weapon = null;
	this._ammo = 0;
	this.clip_size = clip_size;
	this._bullet_vel = 10;
	this._bullets = [];
}

Gun.prototype.fire = function(target)
{
	if (this._ammo == 0) return;
	this._ammo = this._ammo - 1;
	//create a bullet
	var direction = (target.subtract(this._pos)).unit();
	
	var bullet = new Bullet(this._pos, direction.multiply(this._bullet_vel));
	
	this._player._game.add(bullet);
	
	this._bullets.push(bullet);
}

Gun.prototype.load = function(ammo)
{
	var rounds = ammo || this.clip_size;
	var empties = this.clip_size - this._ammo;
	if (rounds>=empties)
	{
		this._ammo = this.clip_size;
		return empties;
	}
	if (rounds<empties)
	{
		this._ammo += rounds;
		return rounds;
	}
}

Gun.prototype.update = function(dt)
{
	this._pos = this.player._pos;
	for (bullet in this._bullets) this._bullets[bullet].update(dt);
}

Gun.prototype.render = function(ctx)
{
	for (bullet in this._bullets) this._bullets[bullet].render(ctx);
}

/**
  * class TdsGame
  * 
  */

Player = function (pos,game)
{
	this._game = game;
	this._pos = pos;
	this._visible = new Circle(pos.x,pos.y,10,'#f00');
	this._weapon = new Gun("launcher", this, 10, 10);
	this._weapon.load(10);
	//this._weapon = null;
	this._vel = new Vector2D();
	this._target = new Vector2D();
	//this._acc = new Vector2D(); // TODO - add acceleration!!!
	
	//this._weapons = [new Gun("launcher", this, 5, 10)]; // TODO - implement weapons!!!
	//this._current_weapon = "launcher";
	
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
	
	if (this._mouse_state)
	{
		/*if (!this._bullet)
		{
			var mouse_pos = new Vector2D(x,y);
			this._bullet = new Circle(this._pos.x,this._pos.y,5,'#00f');
			this._bullet.vel = (mouse_pos.subtract(this._pos)).unit();//this._pos.subtract(mouse_pos);
			this._game.add(this._bullet);
		}*/
		var mouse_pos = new Vector2D(this._target.x,this._target.y);
		this._weapon.fire(mouse_pos);
	}
	
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

Player.prototype.changeKey = function(key, state)
{
	this._keys[this._keymap[key]] = state;
}

Player.prototype.click = function(x, y, state)
{
	this._mouse_state = state;
	this._target = new Vector2D(x,y);
}

/**
  * class TdsGame
  * 
  */

TdsGame = function (canvas, ih)
{
    Game.call(this, canvas);
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
	this._input_handler.start();
}

TdsGame.prototype = new Game;

TdsGame.prototype.preUpdate = function (dt)
{
	var pointer = this._input_handler.getMousePositionCanvas();
	var pointa = {x:this.player._pos.x,y:this.player._pos.y};
	var pointb = this._input_handler.getMousePositionCanvas();
	
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

