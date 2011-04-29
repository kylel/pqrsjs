/**
  * class Primitive
  * 
  */

Primitive = function (x,y)
{
    this._x = x;
    this._y = y;
}

Primitive.prototype.render = function(ctx)
{
    ctx.save();
	ctx.translate(this._x, this._y);
	if (this._angle) ctx.rotate(-this._angle);
	if (this._scale) ctx.scale(this._scale.x, this._scale.y);
	this._render(ctx);
	ctx.restore();
}

Primitive.prototype._render = function(ctx)
{
    return;
}

Primitive.prototype.scale = function(factor)
{
	this._scale = {x:factor.x,y:factor.y};
}

Primitive.prototype.rotate = function(angle)
{
    if (this._angle) this._angle += angle;
	else this._angle = angle;
}

Primitive.prototype.move = function(vector)
{
    this._x += vector.x;
	this._y += vector.y
}



/**
  * class Rectangle
  * 
  */

Rectangle = function (x,y,h,w,color,empty)
{
    Primitive.call(this,x,y);
    this._h = h;
    this._w = w;
    this._color = color;
    this._draw = draw_rectangle;
    if (empty) this._draw = trace_rectangle;
}

Rectangle.prototype = new Primitive;

/**
 * Draw the rectangle
 */
Rectangle.prototype._render = function (ctx)
{
    var top_left = {x:-this._w/2,y:-this._h/2};
	this._draw(ctx, top_left.x, top_left.y, this._h, this._w, this._color);
}

/**
  * class Circle
  * 
  */

Circle = function (x,y,r,color,empty)
{
    Primitive.call(this,x,y);
    this._r = r;
    this._color = color;
    this._draw = draw_circle;
    if (empty) this._draw = trace_circle;
}

Circle.prototype = new Primitive;

/**
 * Draw the circle
 */
Circle.prototype._render = function (ctx)
{
	this._draw(ctx, 0, 0, this._r, this._color);
}


/**
 * Draw a circle
 */
function draw_circle(ctx, x, y, r, color)
{
	ctx.fillStyle = color; 
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.fill();
}

/**
 * Trace the outline of a circle
 */
function trace_circle(ctx, x, y, r, color)
{
	ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.strokeStyle = color;
    ctx.stroke();
}

/**
 * Draw a rectangle
 */
function draw_rectangle(ctx, x, y, h, w, color)
{
	ctx.fillStyle= color;
	ctx.fillRect(x,y,w,h);
}

/**
 * Trace the outline of a rectangle
 */
function trace_rectangle(ctx, x, y, h, w, color)
{
	ctx.beginPath();
	ctx.moveTo(x, y);
    ctx.lineTo(x+w, y);
    ctx.lineTo(x+w, y+h);
    ctx.lineTo(x, y+h);
    ctx.closePath();//lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.stroke();
}