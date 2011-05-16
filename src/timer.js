Timer = function()
{
	this._gamTime = 0;
	this._maxStep = 0.05;
	this._wallLastTimestamp = 0;
}

Timer.prototype.tick = function()
{
	var wallCurrent = Date.now();
	var wallDelta = (wallCurrent - this._wallLastTimestamp) / 1000;
	
	var gameDelta = Math.min(wallDelta, this._maxStep);
	this._gameTime += gameDelta;
	return gameDelta;
}