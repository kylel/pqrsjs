/**
  * class Sprite
  * 
  */

Sprite = function (x,y,image)
{
    Primitive.call(this,x,y);
	this._img = image;
	this._data = {sx:0, sy:0,
				  sw:image.naturalWidth, sh:image.naturalHeight,
				  dw:image.naturalWidth, dh:image.naturalHeight};
}

Sprite.prototype = new Primitive;

/**
 * 
 */
Sprite.prototype.load = function (data)
{
    this._data.sx = data.sx;
	this._data.sy = data.sy;
	this._data.sw = data.sw;
	this._data.sh = data.sh;
	this._data.dw = data.dw;
	this._data.dh = data.dh;
}

/*Sprite.prototype.scale = function (factor)
{
    this._data.dw = this._data.sw * factor.x;
	this._data.dh = this._data.sh * factor.y;
}*/ // TODO: do we use this way or the primitive base class way? both work


/**
 * 
 */
Sprite.prototype.set_anchor = function ()
{
    alert("NOT YET IMPLEMENTED");
}


/**
 * 
 */
Sprite.prototype._render = function (ctx)
{
	var top_left = {x:-this._data.dw/2, y:-this._data.dh/2};
	ctx.translate(top_left.x, top_left.y);
	ctx.drawImage(this._img, 
	              this._data.sx, this._data.sy, 
				  this._data.sw, this._data.sh, 
				  0, 0, 
				  this._data.dw, this._data.dh);
}


//TODO - should we move animation class to its own file?
/**
  * class Animation
  * 
  */
Animation = function(x,y,image)
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
	/*if (!this._img.loaded) 
    {
        alert("image not yet loaded");
        return;
    }*/
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
