

var Shader = {};
Shader.currentShader = null;
Shader.default = null;

Shader.Create = function(gl, name){
	var o = Object.create(Shader);
	o.program = o.CreateShaderProgram(gl, name);
	return o;
};

Shader.Bind = function(gl){	
	gl.useProgram(this.program);

	Shader.currentShader = this;
};

Shader.CreateShaderProgram = function(gl, name){
	var vertexSrc = document.getElementById(name + '-vert').text;
	var fragmentSrc = document.getElementById(name + '-frag').text;

	var vertex = this.CreateShader(gl, gl.VERTEX_SHADER, vertexSrc);
	var fragment = this.CreateShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

	var program = this.CreateProgram(gl, vertex, fragment);

	return program;
};

Shader.CreateShader = function(gl, type, source){
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	} else {
		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;		
	}
};

Shader.CreateProgram = function(gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	} else {
		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);			
		return null;
	}
};

Shader.default = Shader.Create(Globals.gl, 'shader');
