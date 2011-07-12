/**
  * class Primitive
  * 
  */
Primitive = function ()
{
	this._scale = {x:1,y:1};
}

Primitive.prototype.render = function(ctx, position)
{
    ctx.save();
	ctx.translate(position.x, position.y);
	if (this.angle) ctx.rotate(-this.angle);
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
	this._scale.x *= factor.x;
	this._scale.y *= factor.y;
}

Primitive.prototype.rotate = function(angle)
{
    if (this.angle) this.angle += angle;
	else this.angle = angle;
}

/**
  * class Rectangle
  * 
  */
Rectangle = function (h,w,color,empty)
{
    Primitive.call(this);
	this.h = h;
    this.w = w;
    this.color = color;
    this._draw = draw_rectangle;
    if (empty) this._draw = trace_rectangle;
	this.topLeft = {x:-this.w/2,y:-this.h/2};
}

Rectangle.prototype = new Primitive;

/**
 * Draw the rectangle
 */
Rectangle.prototype._render = function (ctx)
{
	this._draw(ctx, this.topLeft.x, this.topLeft.y, this.h, this.w, this.color);
}

/**
  * class Circle
  * 
  */
Circle = function (r,color,empty)
{
    Primitive.call(this);
    this.r = r;
    this.color = color;
    this._draw = draw_circle;
    if (empty) this._draw = trace_circle;
}

Circle.prototype = new Primitive;

/**
 * Scale the circle. Overwrites the primitive base class method because scaling a circle
 * by x AND y values will make it an oval.0115550000
 */
Circle.prototype.scale = function(factor)
{
	//TODO - check if the factor is scalar?
	this.scale = {x:factor,y:factor};
}

/**
 * Draw the circle
 */
Circle.prototype._render = function (ctx)
{
	this._draw(ctx, 0, 0, this.r, this.color);
}

/**
  * class Line
  * 
  */
/*Line = function (a,b,color)
{
    this._y_length = b.y-a.y;
	this._x_length = b.x-a.x;
	this.a = a;
	this.b = b;
	
	Primitive.call(this,a.x+this._x_length/2,a.y+this._y_length/2);
	
    this._color = color;
    this._draw = draw_line;
}
*/
//Line.prototype = new Primitive;

/**
 * Draw the line
 */
/*Line.prototype._render = function (ctx)
{
	var a = {x : -this._x_length/2,
	         y : -this._y_length/2};
	var b = {x : this._x_length/2,
	         y : this._y_length/2};
	this._draw(ctx, a, b, this._color);
}
*/
/**
 * Change the line data
 */
/*
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
*/

//Functions-----------------------------------------------------|



/**
 * Draw a circle
 */
function draw_circle(ctx, x, y, r, color)
{
	//console.log("ctx -- ", ctx);
	//console.log("x -- ", x);
	//console.log("y -- ", y);
	//console.log("r -- ", r);
	//console.log("color -- ", color);
	
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