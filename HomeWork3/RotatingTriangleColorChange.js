// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  //declaring uniform fragcolor to take color from javascript
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


// Rotation angle (degrees/second)
var ANGLE_STEP = 45.0;

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

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Current rotation angle
  var currentAngle = 90.0;
  // Model matrix
  var modelMatrix = new Matrix4();

  // Start drawing
  var tick = function () {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array([
    0, 0.5, -0.5, -0.5, 0.5, -0.5
  ]);
  var n = 3;   // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {

   // varies from 0 to 6
  radius = 6*currentAngle / 360;
  // varies from 0 to 1
  fac = 1 - (radius - Math.floor(radius)); 
  r = [
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
    [0.9, 0.0, 0.0], 
    [0.6, 0.6, 0.0],
    [0.0, 0.8, 0.0],
    [0.0, 0.6, 0.6],
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
  ][Math.floor(radius)][0] * fac + [
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
    [0.9, 0.0, 0.0], 
    [0.6, 0.6, 0.0],
    [0.0, 0.8, 0.0],
    [0.0, 0.6, 0.6],
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
  ][Math.floor(radius) + 1][0] * (1 - fac)
  g =[
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
    [0.9, 0.0, 0.0], 
    [0.6, 0.6, 0.0],
    [0.0, 0.8, 0.0],
    [0.0, 0.6, 0.6],
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
  ][Math.floor(radius)][1] * fac + [
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
    [0.9, 0.0, 0.0], 
    [0.6, 0.6, 0.0],
    [0.0, 0.8, 0.0],
    [0.0, 0.6, 0.6],
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
  ][Math.floor(radius) + 1][1] * (1 - fac)
  b =[
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
    [0.9, 0.0, 0.0], 
    [0.6, 0.6, 0.0],
    [0.0, 0.8, 0.0],
    [0.0, 0.6, 0.6],
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
  ][Math.floor(radius)][2] * fac + [
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
    [0.9, 0.0, 0.0], 
    [0.6, 0.6, 0.0],
    [0.0, 0.8, 0.0],
    [0.0, 0.6, 0.6],
    [0.0, 0.0, 1.0], 
    [0.6, 0.0, 0.6], 
  ][Math.floor(radius) + 1][2] * (1 - fac)

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, r, g, b, 1);


  // Set the rotation matrix
  modelMatrix.setRotate(currentAngle, 0, 0, 1); // Rotation angle, rotation axis (0, 0, 1)

  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}
