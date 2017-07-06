
function DrawSquare(gl, transform){
	PrimitiveMeshes.square.Draw(gl, transform);
}

function DrawCube(gl, transform){
	PrimitiveMeshes.cube.Draw(gl, transform);
}

function CreateCubeMesh(gl, topColor, botColor){
	if(!botColor)
		botColor = topColor;

	var cube = Mesh.Create(Globals.gl);
	cube.SetVertices(Globals.gl, [
		.5, .5, .5,
		-.5, .5, .5,
		-.5, -.5, .5,
		.5, -.5, .5,
		.5, .5, -.5,
		-.5, .5, -.5,
		-.5, -.5, -.5,
		.5, -.5, -.5]);
	cube.SetIndices(Globals.gl, [
		0, 1, 2,    0, 2, 3,
		0, 3, 7,    0, 7, 4,
		0, 4, 5,    0, 5, 1,
		6, 5, 4,    6, 4, 7,
		6, 2, 1,    6, 1, 5,
		6, 7, 3,    6, 3, 2,
		]);
	var add = 1.09;
	cube.SetColors(Globals.gl, [
		topColor[0], topColor[1], topColor[2], topColor[3],
		topColor[0], topColor[1], topColor[2], topColor[3],
		topColor[0] * add, topColor[1] * add, topColor[2] * add, topColor[3],
		topColor[0] * add, topColor[1] * add, topColor[2] * add, topColor[3],
		botColor[0], botColor[1], botColor[2], botColor[3],
		botColor[0], botColor[1], botColor[2], botColor[3],
		botColor[0], botColor[1], botColor[2], botColor[3],
		botColor[0], botColor[1], botColor[2], botColor[3]]);
	cube.colorTint = [1, 1, 1, 1];

	return cube;
}

var PrimitiveMeshes = {
	Init: function(){
		this.square = Mesh.Create(Globals.gl);
		this.square.SetVertices(Globals.gl,[
			.5, .5, 0,
			-.5, .5, 0,
			-.5, -.5, 0,
			.5, -.5, 0]);
		this.square.SetIndices(Globals.gl, [
			0, 1, 2,
			0, 2, 3]);
		this.square.SetColors(Globals.gl, [
			1, .5, .5, 1,
			.5, .5, .5, 1,
			.5, .5, .5, 1,
			.5, .5, 1, 1]);

		this.cube = CreateCubeMesh(Globals.gl, [0, .8, 1, 1], [0, .2, .5, 0]);
	}
};

PrimitiveMeshes.Init();
