AssetManager = function()
{
	this._success_count = 0;
	this._error_count = 0;
	this._cache = {};
	this._download_queue = [];
}

AssetManager.prototype.queueDownload = function(path)
{
	this._download_queue.push(path);
}

AssetManager.prototype._isDone = function()
{
	return (this._download_queue.length == this._success_count + this._error_count);
}

AssetManager.prototype.downloadAll = function(callback)
{
	for (var i=0; i<this._download_queue.length; i++)
	{
		var path = this._download_queue[i];
		var img = new Image();
		var that = this;
		/*img.addEventListener("load", function() {
			that._success_count += 1;
			if (that._isDone()) callback();
		});
		img.addEventListener("error", function() {
			that._error_count += 1;
			if (that._isDone()) callback();
		});*/
		img.onload = function() { /*add event listener not working for firefox*///TODO - is it really
		
			that._success_count += 1;
			if (that._isDone()) callback();
		};
		img.onerror = function() {
			that._error_count += 1;
			if (that._isDone()) callback();
		};
		this._cache[path] = img;
		img.src = path;
	}
}

AssetManager.prototype.getAsset = function(path)
{
	return this._cache[path];
}