const mat4 = glMatrix.mat4; // 4 x 4 matrix

const vertexShaderSource = `
	precision mediump float;
	attribute vec2 coordinates;

	void main() {
		gl_Position = vec4(coordinates, 0.0, 1.0);
		gl_PointSize = 10.0;
	}
`;

const fragmentShaderSource = `
	precision mediump float;

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
	var vertices = [
		-0.5, -0.5,
		-0.5, +0.5,
		+0.5, -0.5,
		+0.5, +0.5
	];
	var nVertices = vertices.length / 2;

	// SETUP SHADERS
	var vertexShader = setupShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = setupShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	// SETUP PROGRAM AND ATTACH SHADERS
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	// // UNIFORM LOCATION
	rotationMatrixLocation = gl.getUniformLocation(program, 'uRotationMatrix');

	// SETUP BUFFERS AND SHADER ATTRIBUTES
	// Vertex positions
	const vertexBuffer = gl.createBuffer(); // create empty buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // bind array buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // convert to 32bit array
	var coord = gl.getAttribLocation(program, "coordinates");
	gl.vertexAttribPointer(coord, 2, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(coord);

	gl.drawArrays(gl.POINTS, 0, nVertices);

	// Make canvas clickable
	rect = canvas.getBoundingClientRect();
	canvas.addEventListener('click', (e) => {
		vertices.push(-1+2*(e.clientX-rect.left)/canvas.clientWidth);
		vertices.push(+1-2*(e.clientY-rect.top )/canvas.clientHeight);
		nVertices++;
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // convert to 32bit array
		gl.drawArrays(gl.POINTS, 0, nVertices);
	});
}
