
var Transform = {};

Transform.Create = function(){
	var o = Object.create(Transform);
	o.position = vec3.create();
	o.modelMatrix = mat4.create();
	return o;
};

Transform.SetPosition = function(position){
	this.position = position;
	this.UpdateModelMatrix();
};

Transform.UpdateModelMatrix = function(){
	mat4.fromTranslation(this.modelMatrix, this.position);
};

Transform.Uniform = function(gl, loc){
	var mvp = mat4.create();
	mat4.multiply(mvp, Globals.viewPerspectiveMatrix, this.modelMatrix);
	gl.uniformMatrix4fv(loc, false, mvp);
};
