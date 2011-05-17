/**
  * class Bullet
  * 
  */

Bullet = function (game, pos, vel)
{
	this._game = game;
	this._pos = pos;
	this._vel = vel;
	this._visible = new Circle(this._pos.x,this._pos.y,5,'#00f');
}

Bullet.prototype.update = function(dt)
{
	this._pos = this._pos.add(this._vel.multiply(dt));
	this._visible.setPosition(this._pos);
	if (this._pos._x > this._game.canvas.width ||
	    this._pos._x < 0 ||
		this._pos._y > this._game.canvas.height ||
		this._pos._y < 0) 
	{
		this.to_remove = true;
	}
}

Bullet.prototype.render = function(ctx)
{
	this._visible.render(ctx);
}

/**
  * class Gun
  * 
  */

Gun = function (game, name, player, clip_size, vel)
{
	this._game = game;
	this._player = player;
	this._pos = this._player._pos; //TODO - player get pos?
	// TODO this._visible = new Line(new Vector2D(this._player._pos.x, this._player._pos.y), new Vector2D());
	this.name = name;
	this._weapon = null;
	this._ammo = 0;
	this.clip_size = clip_size;
	this._bullet_vel = vel;
	//this._bullets = [];
	this._visible = new Line(this._pos,this._pos, '#f0f');
	this._game.add(this);
	this._rate = 2;//bullets per second
	this._time_since_last_bullet = 0;
}

Gun.prototype.fire = function(target)
{
	if (this._ammo == 0) return;
	if (this._time_since_last_bullet < 1/this._rate) return;
	this._ammo = this._ammo - 1;
	//create a bullet
	var direction = (target.subtract(this._pos)).unit();
	
	var bullet = new Bullet(this._game, this._pos, direction.multiply(this._bullet_vel));
	
	this._game.add(bullet);
	this._time_since_last_bullet = 0;
	
	//this._bullets.push(bullet);
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
	this._pos = this._player._pos;
	this._target = this._game._input_handler.getMousePositionCanvas();
	this._target = new Vector2D(this._target.x, this._target.y);
	this._target = this._target.subtract(this._pos);
	
	this._target = this._target.unit().multiply(10);
	this._visible.change(this._pos, this._target);
	//for (bullet in this._bullets) this._bullets[bullet].update(dt);
	this._time_since_last_bullet += dt;
}

Gun.prototype.render = function(ctx)
{
	this._visible.change(this._pos, this._pos.add(this._target));
	this._visible.render(ctx);
	//for (bullet in this._bullets) this._bullets[bullet].render(ctx);
}

/**
  * class TdsGame
  * 
  */

Player = function (pos,game)
{
	this._game = game;
	this._pos = pos;
	this._game.add(this);

	//new Circle(pos.x,pos.y,10,'#f00');
	this._weapon = new Gun(game, "launcher", this, 10, 500);
	//this._game.add(this._weapon);
	this._weapon.load(10);

	this._vel = new Vector2D();
	this._target = new Vector2D();
	//this._acc = new Vector2D(); // TODO - add acceleration!!!
	
	this._keymap = {87 : 'up',
	                65 : 'left',
			  	    83 : 'down',
			 	    68 : 'right',
					82 : 'reload'};
	
	this._keys = {up:0,left:0,down:0,right:0};
	this._mouse_state= 0;
	this._step = .5;
	this._time = 0;
	this._body = new Circle(pos.x,pos.y,10,'#f00');
}

Player.prototype.update = function (dt)
{
	if (this._keys.reload)
	{
		this._weapon.load(10);
		this._keys.reload = 0;
	}
	//if (this._pos != this._weapon._pos) alert("wtf");
	this._vel.y = this._keys.down  - this._keys.up;
	this._vel.x = this._keys.right - this._keys.left;
	this._vel = this._vel.multiply(80);
			
	this._pos = this._pos.add(this._vel.multiply(dt));
	//this._target = this._game._input_handler.getMousePositionCanvas();
	//var diff = (new Vector2D(this._target.x, this._target.y)).subtract(this._pos);
	var direction = this._vel.unit();
	
	if (this._vel.magnitude() > 0) this._feet.angle = Math.atan2(direction.x,direction.y);
		
	this._feet.setPosition (this._pos);
	this._time += dt;

	if (this._time >= this._step && this._vel.magnitude() > 0)
	{
		this._feet.scale(new Vector2D(1,-1));
		this._time = 0;
	}
	
	if (this._mouse_state)
	{
		var mouse_pos = this._game._input_handler.getMousePositionCanvas();
		mouse_pos = new Vector2D(mouse_pos.x,mouse_pos.y);
		this._weapon.fire(mouse_pos);
	}
	
	this._body.setPosition(this._pos);
}

Player.prototype.render = function (ctx)
{
	this._feet.render(ctx);
	this._body.render(ctx);
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

Player.prototype.loadContent = function()
{
	this._feet = new Sprite(this._pos.x,this._pos.y,this._game.asset_manager.getAsset("res/feet.png"));
}



/**
  * class TdsGame
  * 
  */

TdsGame = function (canvas, ih)
{
    Game.call(this, canvas);
	this._input_handler = ih;
	this.asset_manager = new AssetManager();
	this.asset_manager.queueDownload("res/feet.png");
	
	var centre = {x : this.canvas.width/2,
				  y : this.canvas.height/2};
	
	var another_point = {x : centre.x + 50,
						 y : centre.y + 50};
	
	this.player = new Player(new Vector2D(centre.x,centre.y), this);
	
	this._input_handler.register(this.player);
	//this.add(this.player);
	this._input_handler.start();
	this._start = this.start;
	this.ready = function()
	{
		that.player.loadContent();
		that._start.call(that);
	}
	var that = this;
	this.start = function ()
	{
		that.asset_manager.downloadAll(that.ready);
	}
}

TdsGame.prototype = new Game;

TdsGame.prototype.preUpdate = function (dt)
{
}

