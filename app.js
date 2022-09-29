
const vertexShaderSource = `
	precision mediump float;
	attribute vec2 coordinates;

	void main() {
		gl_Position = vec4(coordinates, 0.0, 1.0);
	}
`;

const fragmentShaderSource = `
	precision mediump float;

	varying lowp vec4 color;

	void main() {
		gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		
	}
`;


// SETUP AND COMPILE SHADER
function setupShader(gl, type, source) {
	var shader = gl.createShader(type); // create shader
	gl.shaderSource(shader, source); // assign source code
	gl.compileShader(shader); // compile

	// Catch compilation error
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error("An error occurred compiling the shader: " + gl.getShaderInfoLog(shader));
		gl.deleteShader;
		return null;
	}
	
	return shader;
}

function main() {

	var canvas = document.getElementById('mycanvas');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL');
		return;
	}

	// Define triangle vertices
	const vertices = [
		-0.5, -0.5,
		-0.5, +0.5,
		+0.5, -0.5,
		+0.5, +0.5
	];
	const nVertices = vertices.length / 2;

	// Define colors (one for each vertex of the square)
	const colors = [
		1.0, 1.0, 1.0, 1.0, // white
		1.0, 0.0, 0.0, 1.0, // red
		0.0, 1.0, 0.0, 1.0, // green
		0.0, 0.0, 1.0, 1.0, // blue
	];

	// SETUP SHADERS
	var vertexShader = setupShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = setupShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	// SETUP PROGRAM AND ATTACH SHADERS
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	// SETUP BUFFERS
	const vertexBuffer = gl.createBuffer(); // create empty buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // bind array buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // convert to 32bit array

	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	// SETUP SHADER ATTRIBUTES
	var coord = gl.getAttribLocation(program, "coordinates");
	gl.vertexAttribPointer(coord, 2, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(coord);

	// DRAW TRIANGLE
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, nVertices);
}
