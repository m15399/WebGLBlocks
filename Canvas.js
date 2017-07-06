
function onresize(e){
	Canvas.Resize();
}

var Canvas = {
	Init: function(){
		this.canvas = document.getElementsByTagName('canvas')[0];
		var gl = this.canvas.getContext('webgl');

		this.gl = gl;
		if(!this.gl){
			alert('Couldn\'t load WebGL!');
		}

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.enable(gl.BLEND);

		var eye = vec3.fromValues(0, 0, -1);
		var center = vec3.fromValues(0, 0, 0);
		var up = vec3.fromValues(.1, 1, 0);
		this.LookAt(eye, center, up);

		this.Resize(Globals.width, Globals.height);

		Globals.gl = this.gl;

		window.addEventListener('resize', onresize);
	},

	Resize: function(){
		var w = window.innerWidth;
		var h = window.innerHeight;

		Globals.width = this.canvas.width = w;
		Globals.height = this.canvas.height = h;

		var persp = mat4.create();
		mat4.perspective(persp, 30 * Math.PI/180, w / h, .1, 10000);
		Globals.perspectiveMatrix = persp;

		var viewPersp = mat4.create();
		mat4.multiply(viewPersp, persp, Globals.viewMatrix);
		Globals.viewPerspectiveMatrix = viewPersp;

		var gl = this.gl;
		gl.viewport(0, 0, w, h);
	},

	LookAt: function(eye, center, up){
		var view = mat4.create();
		mat4.lookAt(view, eye, center, up);
		Globals.viewMatrix = view;

		if(Globals.perspectiveMatrix != null){
			var viewPersp = mat4.create();
			mat4.multiply(viewPersp, Globals.perspectiveMatrix, view);
			Globals.viewPerspectiveMatrix = viewPersp;
		}
	},

	Draw: function(){
		var gl = this.gl;
		gl.clearColor(.0, .25, .45, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}
};

Canvas.Init();
