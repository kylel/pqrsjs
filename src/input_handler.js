/**
  * class InputHandler
  * 
  */

InputHandler = function (canvas)
{
    this.key_clients = [];
	this.mouse_clients = [];
	this._mouse = {x:0,y:0};
	this._canvas = canvas;
    start_input_handler(this);
}


/**
 * 
 */
InputHandler.prototype.register = function (client)
{
    if (client.change_key) this.key_clients.push(client);
	if (client.click) this.mouse_clients.push(client);
}


/**
 * 
 */
InputHandler.prototype._change_key = function (key, state)
{
    for (client in this.key_clients)
    {
        this.key_clients[client].change_key(key, state);
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

/**
 * 
 */
InputHandler.prototype._mouse_click = function (x,y,state)
{
    this._mouse.x = x;
	this._mouse.y = y;
	for (client in this.mouse_clients)
    {
        this.mouse_clients[client].click(x,y,state);
    }
}

function start_input_handler(input_handler)
{
    document.onkeydown=function(e){input_handler._change_key((e||window.event).keyCode, 1);}
    document.onkeyup=function(e){input_handler._change_key((e||window.event).keyCode, 0);}
	
	document.onmousemove = function(e) {input_handler._mouse_move ((e||window.event).clientX, (e||window.event).clientY);};
	document.onmousedown = function(e) {input_handler._mouse_click((e||window.event).clientX, (e||window.event).clientY, 1);};
	document.onmouseup   = function(e) {input_handler._mouse_click((e||window.event).clientX, (e||window.event).clientY, 0);};
	
	/*document.addEventListener("mousemove", function(e) {input_handler._mouse_move ((e||window.event).clientX, (e||window.event).clientY);} ,false);
	document.addEventListener("mousedown",     function(e) {input_handler._mouse_click((e||window.event).clientX, (e||window.event).clientY, 1);} ,false);
	document.addEventListener("mouseup",     function(e) {input_handler._mouse_click((e||window.event).clientX, (e||window.event).clientY, 0);} ,false);*/
}

