/**
  * class Agame
  * 
  */
Agame = function (canvas, world, camera, inputHandler)
{
    this.camera = camera;
	this.world = world;
	this.canvas = canvas;
	BasicGame.call(this, canvas);
	if (this.world)
	{
		this.add(this.world);
		this.add(this.camera);
		this.inputHandler = inputHandler;
	}
	this.assetManger = new AssetManager();
}

Agame.prototype = new BasicGame;

Agame.prototype.add = function (obj)
{
	if (obj.render) this.camera.add(obj, obj.zOrder || 0, obj.isBg);
	if (obj.step) this.world.add(obj);
	BasicGame.prototype.add.call(this, obj);
}

Agame.prototype.remove = function (obj)
{
	this.camera.remove(obj);
	this.world.remove(obj);
	BasicGame.prototype.remove.call(this, obj);
}