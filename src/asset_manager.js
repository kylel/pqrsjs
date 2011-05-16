function AssetManager ()
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

AssetManager.prototype.isDone = function()
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
		img.addEventListener("load", function() {
			that._success_count += 1;
			if (that.isDone()) callback();
		});
		img.addEventListener("error", function() {
			that._error_count += 1;
			if (that.isDone()) callback();
		});
		img.src = path;
		this._cache[path] = img;
	}
}