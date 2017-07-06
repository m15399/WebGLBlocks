
var Mesh = {};

Mesh.Create = function(gl){
	var o = Object.create(Mesh);
	o.vertices = Globals.gl.createBuffer();
	o.indices = Globals.gl.createBuffer();
	o.colors = Globals.gl.createBuffer();
	o.numVertices = 0;
	o.SetShader(gl, Shader.default);

	o.colorTint = [1, 1, 1, 1];

	return o;
};

Mesh.SetShader = function(gl, shader){
	this.shader = shader;
	this.positionAttribute = gl.getAttribLocation(shader.program, 'a_position');
	this.colorAttribute = gl.getAttribLocation(shader.program, 'a_color');
	this.colorUniform = gl.getUniformLocation(shader.program, 'colorTint');
	this.mvpUniform = gl.getUniformLocation(shader.program, 'mvp');
};

Mesh.SetVertices = function(gl, vertices){
	this.numVertices = vertices.length;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
};

Mesh.SetIndices = function(gl, indices){
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

	this.count = indices.length;
};

Mesh.SetColors = function(gl, colors){
	if(!colors){
		colors = [];
		var l = this.numVertices / 3 * 4;
		for(var i = 0; i < l; i++){
			if(i % 4 == 3)
				colors[i] = 1;
			else
				colors[i] = Math.random(); 
		}
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
};

Mesh.Draw = function(gl, transform){

	this.shader.Bind(gl);

	var size = 3;
	var type = gl.FLOAT;
	var normalize = false;
	var stride = 0;
	var offset = 0;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertices);
	gl.enableVertexAttribArray(this.positionAttribute);
	gl.enableVertexAttribArray(this.colorAttribute);

	size = 3;
	gl.vertexAttribPointer(this.positionAttribute, size, type, normalize, stride, offset);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
	gl.enableVertexAttribArray(this.positionAttribute);
	gl.enableVertexAttribArray(this.colorAttribute);

	var size = 4;
	gl.vertexAttribPointer(this.colorAttribute, size, type, normalize, stride, offset);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

	var ct = this.colorTint;
	gl.uniform4f(this.colorUniform, ct[0], ct[1], ct[2], ct[3]);
	// gl.uniform4f(this.colorUniform, 1, 1, 1, 1);

	transform.Uniform(gl, this.mvpUniform);

	gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);

	// NOTE: apparently it's important to disable at some point if multiple shaders
};
