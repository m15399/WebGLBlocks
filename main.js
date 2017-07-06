

/*

TODO

draw multiple without doing extra calls

send top and bot color to shader

*/

function onmousemove(e){
	Input.onmousemove(e);
}

var Input = {

	mousePosition: [],

	Init: function(){
		Canvas.canvas.onmousemove = onmousemove;
	},

	onmousemove: function(e){
		this.mousePosition = [e.layerX / Globals.width, e.layerY / Globals.height];
	},


};

Input.Init();

var zzz = 35;

var Camera = {

	position: vec3.fromValues(-zzz, -zzz, zzz),
	target: vec3.fromValues(0, 0, -5),
	up: vec3.fromValues(0, 0, 1),

	x: 32,
	y: 32,

	Init: function(){

	},

	Update: function(){

		var d = Math.sin(currTime / 10) / 50;
		this.x += d;
		this.y += d;

		var ox = this.x;
		var oy = this.y;

		this.position = vec3.fromValues(-zzz + ox, -zzz + oy, zzz);
		this.target = vec3.fromValues(ox, oy, -5);
	},

	Draw: function(){
		Canvas.LookAt(this.position, this.target, this.up);
	},

	Zoom: function(dist){
		this.position = vec3.fromValues(dist, dist, dist);
	}

};

Camera.Init();

var Grid = {
	
	width: 2,
	height: 2,

	mapWidth: 128,
	mapHeight: 128,

	viewOffsetX: 64,
	viewOffsetY: 64,

	seeds: [],
	heights: [],

	Init: function(w, h){
		this.width = w;
		this.height = h;

		for(var i = 0; i < this.mapWidth * this.mapHeight; i++){
			this.heights[i] = Math.random() * .6; 
			this.seeds[i] = Math.random(); 
		}
	},

	ToIndex: function(x, y){
		if(x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight)
			return null;
		return Math.round(y) * this.mapWidth + Math.round(x);
	},

	CenterOn: function(x, y){
		this.viewOffsetX = x;
		this.viewOffsetY = y;
	},

	MoveCenterTowards: function(x, y){
		var fac = .01;
		this.viewOffsetX = Lerp(this.viewOffsetX, x, fac);
		this.viewOffsetY = Lerp(this.viewOffsetY, y, fac);
	},

	Update: function(dt){
		for(var i = 0; i < this.heights.length; i++){
			this.heights[i] = Math.sin(currTime * this.seeds[i] + this.seeds[i] * 0) * .4;
		}

		this.CenterOn(Camera.x, Camera.y);
	},

	Draw: function(gl){
		var transform = Transform.Create();
		var w = this.width;
		var h = this.height;

		var falloffSpacing = 3.5;

		var cube = PrimitiveMeshes.cube;

		var yo = this.viewOffsetY;
		var xo = this.viewOffsetX;

		var xi1 = Math.floor(xo) - this.width/2;
		var yi1 = Math.floor(yo) - this.height/2;
		var xi2 = xi1 + this.width + 1;
		var yi2 = yi1 + this.height + 1;

		for(var yi = yi1; yi < yi2; yi++){
			for(var xi = xi1; xi < xi2; xi++){
				var x = xi;
				var y = yi;

				var ii = this.ToIndex(xi, yi);
				var z = this.heights[ii];

				var xa = (w/2 - Math.abs(x - xo))/falloffSpacing;
				var ya = (h/2 - Math.abs(y - yo))/falloffSpacing;

				var a = Math.min(xa, ya);
				a = Math.min(a, 1);
				cube.colorTint[3] = a;

				transform.SetPosition(vec3.fromValues(x, y, z));

				cube.Draw(Globals.gl, transform);
			}
		}
	}

};

var GridSize = 32;
Grid.Init(GridSize, GridSize);

var lastTime = Date.now() / 1000;
var currTime = 0;
var fps = 0;

function main(){
	currTime = Date.now() / 1000;
	var dt = currTime - lastTime;
	lastTime = currTime;

	fps = Math.floor(1 / dt);
	// console.log(fps);

	Grid.Update(dt);
	Camera.Update();

	Camera.Draw();
	Canvas.Draw();

	Grid.Draw();

	// var transform = Transform.Create();
	// transform.SetPosition(vec3.fromValues(0, 0, 1));
	// DrawCube(Globals.gl, transform);
	// transform.SetPosition(vec3.fromValues(1, 0, 1));
	// DrawCube(Globals.gl, transform);
	// transform.SetPosition(vec3.fromValues(0, 1, 1));
	// DrawCube(Globals.gl, transform);

	window.requestAnimationFrame(main);
}

main();

