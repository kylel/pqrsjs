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