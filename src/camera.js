//TODO - check for collisions

/**
 * Visible Class
 * extends Body class.
 */
Visible = function (game, isStatic)
{
	Body.call(this, game, isStatic);
	this.angle = null;
	this.scale = null;
}

Visible.prototype = new Body;

/**
 * Render the visible at the given position
 */
Visible.prototype.render = function(ctx, position)
{
    ctx.save();
	ctx.translate(position.x, position.y);
	if (this.angle) ctx.rotate(-this.angle);
	if (this.scale) ctx.scale(this.scale.x, this.scale.y);
	this._render(ctx);
	ctx.restore();
}

/**
 * Render method. to be implemented by the subclass
 */
Visible.prototype._render = function(ctx)
{
    alert("unimplemented abstract method");
	return;
}



/**
 * Camera Class
 */
Camera = function(game, canvas, world)
{
	Body.call(this, game);
	this.zoom = new Vector2D(1,1);
	this.rot  = 0;
	this.planes  = {};
	this.zorders = [];
	this.visibles = [];
	this.bg = [];
	this.world = world;
	if (canvas) 
	{
		this.canvas = canvas;
		this.dim  = new Vector2D(canvas.width, canvas.height);//TODO maybe not tie this to the canvas size
		this.ctx = canvas.getContext('2d');
		this._canvasBuffer = document.createElement('canvas');
		this._canvasBuffer.width = this.canvas.width;
		this._canvasBuffer.height = this.canvas.height;
		this._canvasBufferContext = this._canvasBuffer.getContext('2d');
		this.createBoundingBox(this.canvas.width, this.canvas.height);
	}
}

Camera.prototype = new Body;

Camera.prototype.getSize = function ()
{
	return new Vector2D(this.canvas.width, this.canvas.height);
}

Camera.prototype.getTopLeft = function ()
{
	return this.pos.subtract(new Vector2D(this.canvas.width/2, this.canvas.height/2));
}

Camera.prototype.getBottomRight = function ()
{
	return this.pos.add(new Vector2D(this.canvas.width/2, this.canvas.height/2));
}

Camera.prototype.add = function(obj, zorder, isBg)
{
	obj.zorder = zorder || 0;
	if (isBg)
	{
		this.bg.push(obj);
		bubbleSort(this.bg, 'zorder');
	}
	else
	{
		this.visibles.push(obj);
		bubbleSort(this.visibles, 'zorder');
	}
}

Camera.prototype.remove = function(obj)
{
	var i = -1;
	for (var index=0; index<this.zorders.length; index++)
	{
		i = this.planes[this.zorders[index]].indexOf(obj);
	}
    if (i!=-1) this.planes[this.zorders[index]].splice(i, 1);
	i = -1;
	i = this.visibles.indexOf(obj);
	if (i!=-1) this.visibles.splice(i, 1);
}

Camera.prototype.follow = function(obj)
{
	this.target = obj || null;
}

Camera.prototype.draw = function(ctx)
{
	this._canvasBufferContext.fillStyle = '#fff';
    this._canvasBufferContext.fillRect(0,0,this.canvas.width,this.canvas.height); //clear buffer
	
	for (var index=0; index<this.bg.length; index++)
	{
		var bg = this.bg[index];
		bg.render(this._canvasBufferContext);
	}
	
	for (var index=0; index<this.visibles.length; index++)
	{
		var visible = this.visibles[index];
		if (!visible.toDraw) continue;
		var vispos = visible.getPosition();
		var offset = vispos.subtract(this.pos.subtract(this.dim.divide(2)));
		visible.render(this._canvasBufferContext, offset);
	}
	
    ctx.drawImage(this._canvasBuffer, 0, 0); //double buffering
}

Camera.prototype.cameraToWorld = function(cameraPos)
{
	var topLeft = this.getTopLeft();
	return topLeft.add(cameraPos);
}

Camera.prototype.canSee = function(visible)
{
	//return boundingBoxCollision(this, visible) ? true : false;
	return boundingBoxCollision(this, visible);
	//if (boundingBoxCollision(this, visible)) return true;
	//return false;
}

Camera.prototype.bindToWorld = function()
{
	this.bindToWorld = true;
}

Camera.prototype.update = function(dt)
{
	this.toDraw = [];
	if (this.target) this.setPosition(this.target.getPosition());
	this.topLeft = this.getPosition().subtract(new Vector2D(this.canvas.width/2, this.canvas.height/2));
	this.size = new Vector2D(this.canvas.width, this.canvas.height);
	
	if (this.bindToWorld)
	{
		var topLeft     = this.getTopLeft();
		var bottomRight = this.getBottomRight();
		var worldSize   = this.world.getSize();
		if (topLeft.x     < 0) this.pos.x = this.canvas.width/2;
		if (topLeft.y     < 0) this.pos.y = this.canvas.height/2;
		if (bottomRight.x > worldSize.x) this.pos.x = worldSize.x - this.canvas.width/2;
		if (bottomRight.y > worldSize.y) this.pos.y = worldSize.y - this.canvas.height/2;
	}

	var limit = this.visibles.length;
	for  ( var i=0; i<limit; i++ )
	{
		/*if (this.canSee(this.visibles[i]))
			this.visibles[i].toDraw = true;
		else
			this.visibles[i].toDraw = false;*/
		this.visibles[i].toDraw = this.canSee ( this.visibles[i] );
	}
	//console.log("camera pos = ", this.pos.x, ",", this.pos.y);
}

//FUNCTIONS ----

function swap(items, firstIndex, secondIndex)
{
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}
	
function bubbleSort(items, member)
{

    var len = items.length, i, j, stop;
	if (items.length <=1) return items;
    for (i=0; i < len; i++)
	{
        for (j=0, stop=len-i-1; j < stop; j++)
		{
            if (items[j][member] > items[j+1][member])
			{
                swap(items, j, j+1);
            }
        }
    }

    return items;
}
