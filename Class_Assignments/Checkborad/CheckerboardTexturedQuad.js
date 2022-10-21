// TexturedQuad.js (c) 2012 matsuda and kanda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

let texture_size = 256;
let texture_image = new Uint8Array(texture_size*texture_size*3);
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  
  CreateCheckerboard();

  // Set texture
  if (!initAndLoadTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
	 }

  // Specify the color for clearing <canvas>
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
  }

function CreateCheckerboard() {
	let i, j, k, l = texture_size/8, index;

	// initialize to black
	for (k = 0; k < 3*texture_size*texture_size; ++k)
		texture_image[k] = 0;
	for (k = 0; k < texture_size*texture_size; ++k) {
		i = Math.floor(k / texture_size);
		j = k - texture_size*i;
		if ( (Math.floor(i/l) + Math.floor(j/l) )%2 == 0) {
			index = 3*(i*texture_size + j);
			texture_image[index] = 255;
			}
		}
	}

function initVertexBuffers(gl) {
  var delta = .5/texture_size;
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
	 
    // -0.5,  0.5,    .25, .75,
    // -0.5, -0.5,    .25, .25,
    //  0.5,  0.5,   .625, .75,
    //  0.5, -0.5,   .625, .25,
	 
    // Vertex coordinates, texture coordinate
    -0.5,  0.5,   -0.5, 1.5,
    -0.5, -0.5,   -0.5, -0.5,
     0.5,  0.5,   1.5, 1.5,
     0.5, -0.5,   1.5, -0.5,
  ]);
  var n = 4; // The number of vertices

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

  return n;
}

function initAndLoadTextures(gl, n) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);


  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);


  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, texture_size, texture_size, 0,
  	 gl.RGB, gl.UNSIGNED_BYTE, texture_image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  return true;
}
