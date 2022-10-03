const mat4 = glMatrix.mat4; // 4 x 4 matrix

const vertexShaderSource = `
	precision mediump float;
	attribute vec2 coordinates;
	attribute vec3 aColor;

	uniform mat4 uRotationMatrix;

	varying lowp vec3 vColor;

	void main() {
		gl_Position = uRotationMatrix * vec4(coordinates, 0.0, 1.0);
		vColor = aColor;
	}
`;

const fragmentShaderSource = `
	precision mediump float;

	varying lowp vec3 vColor;

	void main() {
		gl_FragColor = vec4(vColor, 1.0);
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
		1.0, 1.0, 1.0, // white
		1.0, 0.0, 0.0, // red
		0.0, 1.0, 0.0, // green
		0.0, 0.0, 1.0, // blue
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

	// Vertex colors
	const colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	var colorAttribLocation = gl.getAttribLocation(program, "aColor");
	gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);
	gl.enableVertexAttribArray(colorAttribLocation);


	// DRAW TRIANGLE
	// const rotationMatrix = mat4.create();
	// dt = 0.1;
	// mat4.rotate(rotationMatrix, rotationMatrix, dt, [0,0,1]);
	// mat4.rotate(rotationMatrix, rotationMatrix, dt, [0,0,1]);
	// gl.uniformMatrix4fv(rotationMatrixLocation, gl.FALSE, rotationMatrix);
	// gl.drawArrays(gl.TRIANGLE_STRIP, 0, nVertices);

	const rotationMatrix = mat4.create();
	const velocity = Math.PI / 3; // angular velocity in rad/s

	var then = 0;
	function render(now) {
		const dt = now - then;
		then = now;

		mat4.rotate(rotationMatrix, rotationMatrix, dt/1000 * velocity, [0,0,1]);
		gl.uniformMatrix4fv(rotationMatrixLocation, gl.FALSE, rotationMatrix);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, nVertices);
	
		requestAnimationFrame(render);
	}

	requestAnimationFrame(render);
}
