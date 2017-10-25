Timer = function()
{
	var _gameTime = 0;
	var _maxStep = 0.05;
	var _wallLastTimestamp = 0;
	
	this.tick = function () {
		var wallCurrent = Date.now();
		var wallDelta = (wallCurrent - _wallLastTimestamp) / 1000;
	
		var gameDelta = Math.min(wallDelta, _maxStep);
		_gameTime += gameDelta;
		_wallLastTimestamp = wallCurrent;
		return gameDelta;
	};
}

/*
Timer = function()
{
	this._gameTime = 0;
	this._maxStep = 0.05;
	this._wallLastTimestamp = 0;
}

Timer.prototype.tick = function()
{
	var wallCurrent = Date.now();
	var wallDelta = (wallCurrent - this._wallLastTimestamp) / 1000;
	
	var gameDelta = Math.min(wallDelta, this._maxStep);
	this._gameTime += gameDelta;
	this._wallLastTimestamp = wallCurrent;
	return gameDelta;
}
*/