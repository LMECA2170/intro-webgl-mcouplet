function main() {

	var canvas = document.getElementById('mycanvas');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL');
		return;
	} else {
		console.log('It works :-)');
	}
}
