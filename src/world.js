console.log("entering world.js");

/**
 * Body Class
 */
Body = function (game, isStatic)
{
	this.pos = new Vector2D();
	this.vel = new Vector2D();
	this.acc = null;
	this.isStatic = isStatic || false;
	this.bb_dim = new Vector2D();
	this.bb_r   = 0;
	this.lastPos = this.pos;
	this.lastVel = this.vel;
	this.bcCallback = null;
	this.bbCallback = null;
	GameObject.call(this, game);
}

Body.prototype = new GameObject;

/**
 * Creates a bounding box for this body.
 * can be used to detect collisions with other bodies.
 */
Body.prototype.registerCallback = function (type, cb)
{
	if (!type)
	{
		this.bcCallback = null;
		this.bbCallback = null;
	}
	else if (type == "circle_collision")
		this.bcCallback = cb || null;
	else if (type == "box_collision")
		this.bbCallback = cb || null;
	else if (type == "world_exit")
		this.weCallback = cb || null;
}

/**
 * Creates a bounding box for this body.
 * can be used to detect collisions with other bodies.
 */
Body.prototype.createBoundingBox = function (w,h)
{
	this.bb_dim = new Vector2D(w,h);
}

/**
 * Returns the current bounding box for this body.
 * Can be used to detect collisions with other bodies.
 * If a bounding box has not been set up a zero size
 * box, centered at the body position, will be returned.
 */
Body.prototype.getBoundingBox = function ()
{
	var left   = this.pos.x - (this.bb_dim.x/2 || 0);
	var right  = this.pos.x + (this.bb_dim.x/2 || 0);
	var top    = this.pos.y - (this.bb_dim.y/2 || 0);
	var bottom = this.pos.y + (this.bb_dim.y/2 || 0);
	
	return new BoundingBox(left,right,top,bottom);
}

/**
 * Creates a bounding circle for this body.
 * can be used to detect collisions with other bodies.
 */
Body.prototype.createBoundingCircle = function (radius)
{
	this.bc_r = radius;
}

/**
 * Returns the current bounding circle for this body.
 * Can be used to detect collisions with other bodies.
 * If a bounding box has not been set up a zero size
 * circle, centered at the body position, will be returned.
 */
Body.prototype.getBoundingCircle = function ()
{
	return new BoundingCircle(this.pos, this.bc_r);
}

/**
 * Updates the body's position based on its velocity and
 * acceleration, and the amount of time past since the last update
 */
Body.prototype.step = function(dt)
{
	if (this.isStatic) return;
	this.lastPos = this.pos;
	this.lastVel = this.vel;
	if (this.acc) this.vel = this.vel.add(this.acc.multiply(dt));
	if (this.maxvel)
	{
		if (this.maxvel.compare(this.vel) > 0) this.vel = this.maxvel;
	}
	this.pos = this.pos.add(this.vel.multiply(dt));
}

/**
 * Moves the body back in time by a specific time delta.
 * The current velocity and acceleration are used.
 * if no dt is given then the body reverts back to its
 * position and velocity before the last update.
 */
Body.prototype.stepBack = function(dt)
{
	if (dt)
	{
		this.pos = this.pos.subtract(this.vel.multiply(dt));
		if (this.acc) this.vel = this.vel.subtract(this.acc.multiply(dt));
	}
	else
	{
		this.undoUpdate();
	}
}

/**
 * Undoes the previous update.
 */
Body.prototype.undoStep = function()
{
	this.pos = this.lastPos;
	this.vel = this.lastVel;
}

/**
 * Called when the body collides with another.
 */
Body.prototype.onBoxCollision = function(body)
{
	if (this.bbCallback) this.bbCallback(body);
	return;
}

/**
 * Called when the body exits the world.
 */
Body.prototype.onWorldExit = function()
{
	if (this.weCallback) this.weCallback();
	return;
}

/**
 * Called when the body collides with another.
 */
Body.prototype.onCircleCollision = function(body)
{
	if (this.bcCallback) this.bcCallback(body);
	return;
}

/**
 * Set the position of the body.
 * Velocity and acceleration are maintained.
 */
Body.prototype.setPosition = function(pos)
{
	this.pos = pos || new Vector2D();
}

/**
 * Get the position of the body.
 */
Body.prototype.getPosition = function()
{
	return new Vector2D(this.pos.x, this.pos.y);
}

/**
 * Set the velocity of the body.
 * position and acceleration are maintained.
 */
Body.prototype.setVelocity = function(vel)
{
	this.vel = vel || new Vector2D();
}

/**
 * Set the max velocity of the body.
 * position and acceleration are maintained.
 */
Body.prototype.setMaxVelocity = function(vel)
{
	this.maxvel = maxvel || null;
}

/**
 * Set the acceleration of the body.
 * position and velocity are maintained.
 */
Body.prototype.setAcc = function(acc)
{
	this.vel = vel || null;
}



/**
 * World Class -- lol
 */
World = function(size)
{
	this.size = size || new Vector2D(2000,2000);//TODO: how do we handle a non size?
	this.bodies = [];
	this.bb = new BoundingBox(0,this.size.x,0,this.size.y);
}

World.prototype.getSize = function ()
{
	return new Vector2D(this.size.x, this.size.y);
}

/**
 * Update the world.
 * All bodies contained in the world are updated
 * according to the given time delta.
 */
World.prototype.update = function(dt)
{
	for (var index in this.bodies)
    {
        var body = this.bodies[index];
		body.step(dt);
		if (!boundingBoxCollision(this, body))
		{
			//body exited world!
			//alert("body exited world!");
			body.onWorldExit();
		}
    }
	this._checkCollisions(dt);
}

/**
 * Draw the world.
 * does nothing.
 */
World.prototype.draw = function(ctx)
{
	return;
}

/**
 * Check for collisions in the world.
 */
World.prototype._checkCollisions = function(dt)
{
	for (var i1 in this.bodies)
    {
        var body1 = this.bodies[i1];
		for (i2 in this.bodies)
		{
			if (i1==i2) continue;
			var body2 = this.bodies[i2];
			
			if (boundingBoxCollision(body1,body2))
				body1.onBoxCollision(body2);
			if (boundingCircleCollision(body1,body2))
				body1.onCircleCollision(body2);
		}
    }
}

/**
 * Moves all world bodies back in time by a specific time delta.
 * if no dt is given then the world reverts back to its
 * previous state.
 */
World.prototype.stepBack = function(dt)
{
	for (var index in this.bodies)
    {
        if (dt) this.bodies[index].stepBack(dt);
		else this.bodies[index].undoStep(dt);
    }
}

/**
 * Returns a bounding box for the World
 */
World.prototype.getBoundingBox = function ()
{
	return this.bb;
}

/**
 * Add a a body to the World
 */
World.prototype.add = function(body)
{
	this.bodies.push(body);
}

/**
 * Remove a body from the World
 */
World.prototype.remove = function(body)
{
	var i = -1;
	i = this.bodies.indexOf(body);
    if (i!=-1) this.bodies.splice(i, 1);
}


//FUNCTIONS --------------
function boundingBoxCollision(body1, body2)
{
    var box1 = body1.getBoundingBox();
	var box2 = body2.getBoundingBox();
	
	var top    = Math.max(box1.top,    box2.top);
    var bottom = Math.min(box1.bottom, box2.bottom);
    var left   = Math.max(box1.left,   box2.left);
    var right  = Math.min(box1.right,  box2.right);

    if (top > bottom || left > right) return null;
    var depth = new Vector2D(right - left, bottom - top);
    return depth;
}

function boundingCircleCollision(body1, body2)
{
    var circ1 = body1.getBoundingCircle();
	var circ2 = body2.getBoundingCircle();
	var dist  = (circ2.centre.subtract(circ1.centre)).magnitude();
	var reach = circ1.r + circ2.r;
	
	if (dist > reach) return null;
    return reach-dist;
}