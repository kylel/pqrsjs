Background = function (img, world, camera)
{
	Sprite.call(this, img);
	this.world = world;
	this.camera = camera;
	this.isBg = true;
	if (img)
	{
		var imgSize = new Vector2D(img.naturalWidth, img.naturalHeight);
		var camSize = camera.getSize();
		this.worldSize = world.getSize();
		this._scale = this.worldSize.divide(imgSize);
		//this.createBoundingBox(worldSize.x, worldSize.y);
	}
}

Background.prototype = new Sprite;

Background.prototype.update = function (dt)//TODO - refactor
{
	this.toDraw = true;
	var pos = this.camera.getTopLeft();
	this.dst = new Vector2D();
	var size = this.camera.getSize();
	this.src = pos.divide(this._scale);	
	if (pos.x<0)
	{
		this.dst.x = pos.x*-1;
		this.src.x = 0;
	}
	if (pos.y<0)
	{
		this.dst.y = pos.y*-1;
		this.src.y = 0;
	}
	size = size.subtract(this.dst);
	this.srcSize = size.divide(this._scale);
	this.srcSize.x = Math.min(this.srcSize.x, this.img.naturalWidth  - this.src.x);
	this.srcSize.y = Math.min(this.srcSize.y, this.img.naturalHeight - this.src.y);
	this.dstSize = this.srcSize.multiply(this._scale);
	if (this.src.x > this.img.naturalWidth ||
	    this.src.y > this.img.naturalHeight)
	{
		this.toDraw = false;
	}
	console.log("bg src = ", this.src.x, ",", this.src.y);
	console.log("bg srcSize = ", this.srcSize.x, ",", this.srcSize.y);
	console.log("bg dst = ", this.dst.x, ",", this.dst.y);
	console.log("bg dstSize = ", this.dstSize.x, ",", this.dstSize.y);
}

Background.prototype.render = function (ctx, position)
{
	if (!this.toDraw) return;
	ctx.drawImage(this.img, 
	              this.src.x, this.src.y, 
				  this.srcSize.x, this.srcSize.y, 
				  this.dst.x, this.dst.y, 
				  this.dstSize.x, this.dstSize.y);
}

/*Background.prototype.getBoundingBox = function ()
{
	return this.world.getBoundingBox();
}

Background.prototype.getBoundingCircle = function ()
{
	return new BoundingCircle(this.camera.pos, 0);
}

Background.prototype.onBoxCollision = function ()
{
}

Background.prototype.onCircleCollision = function ()
{
}*/