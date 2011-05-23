Tile = function(pos, width, height, src_index)
{
	this.pos     = pos;
	this._width  = width;
	this._height = height;
	this.src_index = src_index;
}

TileEngine = function(image_panel, tile_size, dimensions)
{
	this._image_panel       = image_panel;
	this._tile_size         = tile_size;
	this._dim               = dimensions;

	//this.generateSources();
}

TileEngine.prototype.generateSources = function()
{
	var sources = [];
	var total = this._dim.x * this._dim.y;
	var colums = parseInt(this._image_panel.naturalWidth / this._tile_size.x);
	var rows = parseInt(this._image_panel.naturalHeight /  this._tile_size.y);
	var row = 0;
	var col = 0;
	for (var i = 0; i < total; i++)
	{
		if (col >= colums) 
		{
			col=0;
			row++;
			if (row >= rows) break;
		}
		
		var src_x = col * this._tile_size.x;
		var src_y = row * this._tile_size.y;
		
		var source_canvas = document.createElement('canvas');
		var source_ctx    = source_canvas.getContext('2d');
		source_canvas.setAttribute('width', this._tile_size.x);
		source_canvas.setAttribute('height', this._tile_size.y);
		source_ctx.drawImage(this._image_panel, src_x, src_y, this._tile_size.x, this._tile_size.y, 0, 0, this._tile_size.x, this._tile_size.y);
		sources.push(source_canvas);
		
		col++;
	}
	

	this._sources = sources;
}

TileEngine.prototype.loadMap = function(map)
{
	this._map = map;
	this._tiles = [];
	var row = 0;
	var col = 0;
	var pos    = new Vector2D(0,0);

	for (var i=0; i<this._map.length; i++)
	{
		row = parseInt(i / this._dim.x);
		col = parseInt(i % this._dim.x);
		pos = new Vector2D(this._tile_size.x * col, this._tile_size.y * row);
		this._tiles.push(new Tile(pos, this._tile_size.x, this._tile_size.y, this._map[i]));
	}
}

TileEngine.prototype.setViewPort = function(position, dimensions)
{
	if (this._viewport)
	{	
		if (this._viewport.pos.x == position.x &&
			this._viewport.pos.y == position.y &&
			this._viewport.dim.x == dimensions.x && 
			this._viewport.dim.y == dimensions.y) return;
	}
	this._viewport = {pos:position, dim:dimensions};
	var cols = parseInt(dimensions.x / this._tile_size.x) + 1;
	var rows = parseInt(dimensions.y / this._tile_size.y) + 1;
	var start_col = parseInt(position.x / this._tile_size.x);
	var start_row = parseInt(position.y / this._tile_size.y);
	start_row = Math.max(start_row,0);
	start_col = Math.max(start_col,0);
	var viewport_canvas = document.createElement('canvas');
	var viewport_ctx    = viewport_canvas.getContext('2d');
	viewport_canvas.setAttribute('width', this._tile_size.x * cols);
	viewport_canvas.setAttribute('height', this._tile_size.y * rows);
	var row = 0;
	var col = 0;
	for (var i=0; i<rows*cols; i++)
	{
		row = parseInt(i / cols) + start_row;
		col = parseInt(i % cols) + start_col;
		if (row >= this._dim.y) continue;
		if (col >= this._dim.x) continue;
		var index = row * this._dim.x + col;
		viewport_ctx.drawImage(this._sources[this._tiles[index].src_index],
							   parseInt(i % cols) * this._tile_size.x,
							   parseInt(i / cols) * this._tile_size.y);
	}
	this._visible = viewport_canvas;
		
	this._sx = position.x % this._tile_size.x;
	this._sy = position.y % this._tile_size.y;
	this._sw = dimensions.x;
	this._sh = dimensions.y;
	this._vw = dimensions.x;
	this._vh = dimensions.y;
}

TileEngine.prototype.render = function(ctx)
{
	ctx.drawImage(this._visible, this._sx, this._sy, this._sw, this._sh, 0, 0, this._vw, this._vh);
}

