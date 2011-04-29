/**
  * class InputHandler
  * 
  */

InputHandler = function ()
{
    this.clients = [];
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
InputHandler.prototype.change_key = function ()
{
    for (client in this.clients)
    {
        this.clients[client].change_key(key, state);
    }
}

function start_input_handler(input_handler)
{
    document.onkeydown=function(e){input_handler.change_key((e||window.event).keyCode, 1);}
    document.onkeyup=function(e){input_handler.change_key((e||window.event).keyCode, 0);}
}

