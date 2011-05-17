/**
  * class InputHandler
  * 
  */
InputHandler = function (canvas)
{
    this._key_clients = [];
	this._mouse_clients = [];
	this._mouse = {x:0,y:0};
	this._canvas = canvas;
    //start_input_handler(this);
}

InputHandler.prototype.register = function (client)
{
    if (client.changeKey) this._key_clients.push(client);
	if (client.click) this._mouse_clients.push(client);
}

InputHandler.prototype._changeKey = function (key, state)
{
	for (var client in this._key_clients)
    {
        this._key_clients[client].changeKey(key, state);
    }
}

InputHandler.prototype._mouseMove = function (x,y)
{
	this._mouse.x = x;
	this._mouse.y = y;
}

InputHandler.prototype.getMousePosition = function ()
{
	return {x:this._mouse.x,
	        y:this._mouse.y};
}

InputHandler.prototype.getMousePositionCanvas = function ()
{
	return {x:this._mouse.x-this._canvas.offsetLeft,
	        y:this._mouse.y-this._canvas.offsetTop};
}

InputHandler.prototype._mouseClick = function (x,y,state)
{
    this._mouse.x = x;
	this._mouse.y = y;
	for (var client in this._mouse_clients)
    {
        this._mouse_clients[client].click(x,y,state);
    }
}

InputHandler.prototype.start = function ()
{
    var that = this;
	document.onkeydown   = function(e) {that._changeKey((e||window.event).keyCode, 1);};
    document.onkeyup     = function(e) {that._changeKey((e||window.event).keyCode, 0);};
	document.onmousemove = function(e) {that._mouseMove ((e||window.event).clientX, (e||window.event).clientY);};
	document.onmousedown = function(e) {that._mouseClick((e||window.event).clientX, (e||window.event).clientY, 1);};
	document.onmouseup   = function(e) {that._mouseClick((e||window.event).clientX, (e||window.event).clientY, 0);};
	
	/*document.addEventListener("mousemove", function(e) {that._mouse_move ((e||window.event).clientX, (e||window.event).clientY);} ,false);
	document.addEventListener("mousedown",     function(e) {that._mouse_click((e||window.event).clientX, (e||window.event).clientY, 1);} ,false);
	document.addEventListener("mouseup",     function(e) {that._mouse_click((e||window.event).clientX, (e||window.event).clientY, 0);} ,false);*/
}

