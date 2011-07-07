DEBUG=true;
if (DEBUG) debug = function (msg) {console.log(msg);};
else debug = function (msg) {console.log(msg);};

/**
  * class Sprite
  * 
  */
Sprite = function (image)
{
	debug("creating new sprite");
	Primitive.call(this);
	this.img = image || new Image();
	this.data = {sx:0, sy:0,
				 sw:this.img.naturalWidth, sh:this.img.naturalHeight,
			     dw:this.img.naturalWidth, dh:this.img.naturalHeight};
	this.offset = new Vector2D();
}

Sprite.prototype = new Primitive;

/**
 * 
 */
Sprite.prototype.load = function (data)
{
    debug("loading sprite data");
	this.data.sx = data.sx;
	this.data.sy = data.sy;
	this.data.sw = data.sw;
	this.data.sh = data.sh;
	this.data.dw = data.dw;
	this.data.dh = data.dh;
}

/*Sprite.prototype.scale = function (factor)
{
    this._data.dw = this._data.sw * factor.x;
	this._data.dh = this._data.sh * factor.y;
}*/ // TODO: do we use this way or the primitive base class way? both work


/**
 * 
 */
Sprite.prototype.setAnchor = function (offset)
{
	debug("setting anchor to:",this.data.dw/2,",",this.data.dh/2);
	this.offset = offset || new Vector2D(this.data.dw/2, this.data.dh/2);
	this.offset = new Vector2D().subtract(this.offset);   
}


/**
 * 
 */
Sprite.prototype._render = function (ctx)
{
	ctx.drawImage(this.img, 
	              this.data.sx, this.data.sy, 
				  this.data.sw, this.data.sh, 
				  this.offset.x, this.offset.y, 
				  this.data.dw, this.data.dh);
}


//TODO - should we move animation class to its own file?
/**
  * class Animation
  * 
  */
/*Animation = function(x,y,image)
{
	Primitive.call(this,x,y);
	this._img = image;
    this._frames = [];
	this._current_state = 0;
	this._frame_index = 0;
}

Animation.prototype = new Primitive;

Animation.prototype.load = function(frames)
{
    this._frames = frames;
    this._frame_index = 0;
    this._frame_duration = this._frames[0].time;		
}

Animation.prototype.update = function(dt)
{
    this._frame_duration -= dt;
    if (this._frame_duration <= 0)
	{
		this._frame_index++;
		if (this._frame_index >= this._frames.length) this._frame_index = 0;
		this._frame_duration = this._frames[this._frame_index].time;
	}
}

Animation.prototype._render = function (ctx)
{
    var data = this._frames[this._frame_index];
	//if (!this._img.loaded) 
   // {
   //     alert("image not yet loaded");
   //     return;
   // }
    var top_left = {x:-data.dw/2, y:-data.dh/2};
    ctx.translate(top_left.x, top_left.y);
	ctx.drawImage(this._img, 
                  data.sx, data.sy, 
                  data.sw, data.sh, 
                  0, 0, 
                  data.dw, data.dh);
}

create_frame_list = function (image, total, size, dt)
{
	var frames = [];
	var colums = parseInt(image.naturalWidth / size.x);
	var rows = parseInt(image.naturalHeight / size.y);
	var row = 0;
	var col = 0;
	for (var i = 0; i < total; i++)
	{
		if (col >= colums) 
		{
			col=0;
			row++;
		}
		frames.push({sx:col * size.x, sy:row * size.y,
                     sw:size.x, sh:size.y,
                     dw:size.x, dh:size.y,
					 time:dt});
		col++;
	} 
	return frames;
}
*/