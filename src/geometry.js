/**
 * Vector2D Class
 */
Vector2D = function (x,y)
{
	this.x = x||0;
    this.y = y||0;
}

/**
 * Return the magnitude of the vector
 */
Vector2D.prototype.magnitude = function()
{
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

/**
 * Return the angle (in radians, counter clockwise from +ve x axis) of the vector
 */
Vector2D.prototype.angle = function()
{
	return Math.atan2(this.y,this.x);
}

/**
 * Return a new vector which is the product of this vector and either
 * another vector or a scalar
 */
Vector2D.prototype.multiply = function(multiplicant)
{
	var result = new Vector2D();
	if (multiplicant.x != null && multiplicant.y != null)
	{
		result.x = this.x * multiplicant.x;
		result.y = this.y * multiplicant.y;
	}
	else /*TODO: maybe check here that multiplicant is a single number*/
	{
		result.x = this.x * multiplicant;
		result.y = this.y * multiplicant;
	}
	return result;
}

/**
 * Returns a new vector which is the quotient of this vector and either
 * another vector or a scalar
 */
Vector2D.prototype.divide = function(divisor)
{
	var result = new Vector2D();
	if (divisor.x != null&& divisor.y != null)
	{
		result.x = this.x / divisor.x;
		result.y = this.y / divisor.y;
	}
	else /*TODO: maybe check here that divisor is a single number*/
	{
		result.x = this.x / divisor;
		result.y = this.y / divisor;
	}
	return result;
}

/**
 * Returns a new vector which is the sum of this vector and either
 * another vector or a scalar
 */
Vector2D.prototype.add = function(adder)
{
	var result = new Vector2D();
	if (adder.x != null && adder.y != null)
	{
		result.x = this.x + adder.x;
		result.y = this.y + adder.y;
	}
	else /*TODO: maybe check here that adder is a single number*/
	{
		result.x = this.x + adder;
		result.y = this.y + adder;
	}
	return result;
}

/**
 * Returns a new vector which is the difference of this vector and either
 * another vector or a scalar
 */
Vector2D.prototype.subtract = function(subtractor)
{
	var result = new Vector2D();
	if (subtractor.x != null && subtractor.y != null)
	{
		result.x = this.x - subtractor.x;
		result.y = this.y - subtractor.y;
	}
	else /*TODO: maybe check here that subtractor is a single number*/
	{
		result.x = this.x - subtractor;
		result.y = this.y - subtractor;
	}
	return result;
}

/**
 * Returns a unit vector for this vector
 */
Vector2D.prototype.unit = function()
{
	var result = new Vector2D();
	var mag = this.magnitude();
	result.x = this.x / mag;
	result.y = this.y / mag;
	return result;
}

/**
 * Compares the current vector to another. Returns -1 if it is less than, - if equal to
 * and 1 if greater than the other vector.
 */
Vector2D.prototype.compare = function(vector2)
{
	var mag1 = this.magnitude();
	var mag2 = vector2.magnitude();
	if (mag1 <  mag2) return -1;
	if (mag1 == mag2) return  0;
	if (mag1 >  mag2) return  1;
}

/**
 * BoundingBox Class
 */
BoundingBox = function(left, right, top, bottom)
{
	this.left   = left   || 0;
	this.right  = right  || 0;
	this.top    = top    || 0;
	this.bottom = bottom || 0;
}

/**
 * BoundingCircle Class
 */
BoundingCircle = function(centre, radius)
{
	this.centre = centre || new Vector2D();
	this.r      = radius || 0;
}


//FUNCTIONS------------------------------------------------------------------------------------------------



/**
 * Find the distance between two points
 */
function get_distance(point1, point2)
{
	return Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));
}

function get_distance_4(x1,y1,x2,y2) //TODO: put this in a class for better organisation
{
    return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
}

function bounding_box_collision(body1, body2)
{
    var top = Math.max(body1.top(), body2.top());
    var bottom = Math.min(body1.bottom(), body2.bottom());
    var left = Math.max(body1.left(), body2.left());
    var right = Math.min(body1.right(), body2.right());

    if (top > bottom || left > right) return null;
    var depth = {};
    depth.y = bottom - top;
    depth.x = right - left;
    return depth;
}

function bounding_circle_collision(body1, body2)
{
    centre1 = body1.centre();
    centre2 = body2.centre();
    var dist = get_distance_4(centre1.x, centre1.y, centre2.x, centre2.y);
    var reach = body1.raius() + body2.radius();

    if (dist > reach) return null;
    return reach-dist;
}

function point_diff(a,b)
{
	var diff = {};
	diff.x = b.x-a.x;
	diff.y = b.y-a.y;
	return diff;
}

function magnitude(vector)
{
	return Math.sqrt(vector.x*vector.x + vector.y*vector.y);
}

function unit_vector(vector)
{
	var mag = magnitude(vector);
	var unit = {};
	unit.x = vector.x/mag;
	unit.y = vector.y/mag;
	return unit;
}

function vector_by_scalar(vector, scalar)
{
	var vec = {};
	vec.x = vector.x*scalar;
	vec.y = vector.y*scalar;
	return vec;
}