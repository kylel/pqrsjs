/**
  * class InputHandler
  * 
  */

InputHandler = function (canvas)
{
    this.clients = [];
	this._mouse = {x:0,y:0};
	this._canvas = canvas;
    start_input_handler(this);
}


/**
 * 
 */
InputHandler.prototype.register = function (client)
{
    this.clients.push(client);
}


/**
 * 
 */
InputHandler.prototype._change_key = function (key, state)
{
    for (client in this.clients)
    {
        this.clients[client].change_key(key, state);
    }
}

/**
 * 
 */
InputHandler.prototype._mouse_move = function (x,y)
{
	this._mouse.x = x;
	this._mouse.y = y;
}

/**
 * 
 */
InputHandler.prototype.get_mouse_position = function ()
{
	return {x:this._mouse.x,
	        y:this._mouse.y};
}

/**
 * 
 */
InputHandler.prototype.get_mouse_position_canvas = function ()
{
	return {x:this._mouse.x-this._canvas.offsetLeft,
	        y:this._mouse.y-this._canvas.offsetTop};
}

function start_input_handler(input_handler)
{
    document.onkeydown=function(e){input_handler._change_key((e||window.event).keyCode, 1);}
    document.onkeyup=function(e){input_handler._change_key((e||window.event).keyCode, 0);}
	
	document.addEventListener("mousemove", function(e) {input_handler._mouse_move((e||window.event).clientX, (e||window.event).clientY);} ,false);
}

