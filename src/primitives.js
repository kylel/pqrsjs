 /*- TODO: remove contains functions to keep this as a simple
     graphics primitives lib.
*/
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

Primitive.prototype.set_position = function(point)
{
    this._x = point.x;
	this._y = point.y
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
 * Check if a point is inside the rectangle
 */
Rectangle.prototype._contains = function (point)
{
    var bottom = this._y+this._h/2*this._scale.y;
	var top = this._y-this._h/2*this._scale.y;
	var left = this._x-this._w/2*this._scale.x;
	var right = this._x+this._w/2*this._scale.x;
	
	if (point.y < top)    return false;
	if (point.y > bottom) return false;
	if (point.x < left)   return false;
	if (point.x > right)  return false;
	return true;
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
 * Scale the circle. Overwrites the primitive base class method because scaling a circle
 * by x AND y values will make it an oval.
 */
Circle.prototype.scale = function(factor)
{
	//TODO - check if the factor is scalar?
	this._scale = {x:factor,y:factor};
}

/**
 * Draw the circle
 */
Circle.prototype._render = function (ctx)
{
	this._draw(ctx, 0, 0, this._r, this._color);
}

/**
 * Check if a point is inside the Circle
 */
Circle.prototype._contains = function (point)
{
	var centre = {x:this._x,y:this._y};
	var distance = get_distance(centre, point);
	if (distance <= this._r*this._scale.x) return true;
	return false;
}

/**
  * class Line
  * 
  */

Line = function (a,b,color)
{
    this._y_length = b.y-a.y;
	this._x_length = b.x-a.x;
	this.a = a;
	this.b = b;
	
	Primitive.call(this,a.x+this._x_length/2,a.y+this._y_length/2);
	
    this._color = color;
    this._draw = draw_line;
}

Line.prototype = new Primitive;

/**
 * Draw the line
 */
Line.prototype._render = function (ctx)
{
	var a = {x : -this._x_length/2,
	         y : -this._y_length/2};
	var b = {x : this._x_length/2,
	         y : this._y_length/2};
	this._draw(ctx, a, b, this._color);
}

/**
 * Change the line data
 */
Line.prototype.change = function (a,b,color)
{
    new_a = a||this.a;
	new_b = b||this.b;
	new_color = color||this._color;
	
	this._y_length = new_b.y-new_a.y;
	this._x_length = new_b.x-new_a.x;
	this.a = new_a;
	this.b = new_b;
	this._color = color;
	this._x = new_a.x+this._x_length/2;
	this._y = new_a.y+this._y_length/2;
}


//Functions-----------------------------------------------------|



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
 * Draw a line
 */
function draw_line(ctx, a, b, color)
{

	ctx.beginPath();
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
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
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}