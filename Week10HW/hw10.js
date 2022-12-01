// RotateObject.js (c) 2012 matsuda and kanda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +       // Normal
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'uniform vec3 u_DiffuseLight;\n' +   // Diffuse light color
  'uniform vec3 u_LightPosition;\n' + // Diffuse light direction (in the world coordinate, normalized)
  'uniform vec3 u_AmbientLight;\n' +   // Color of an ambient light
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
     // Make the length of the normal 1.0
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +
  '  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
     // The dot product of the light direction and the normal (the orientation of a surface)
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
     // Calculate the color due to diffuse reflection
  '  vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL;\n' +
     // Calculate the color due to ambient reflection
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
     // Add the surface colors due to diffuse reflection and ambient reflection
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

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

  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_DiffuseLight = gl.getUniformLocation(gl.program, 'u_DiffuseLight');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_MvpMatrix || !u_NormalMatrix || !u_DiffuseLight || !u_LightPosition　|| !u_AmbientLight) { 
    console.log('Failed to get the storage location');
    return;
  }
  // Calculate the view projection matrix
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);


  //  // Set the light color (white)
   gl.uniform3f(u_DiffuseLight, 1.0, 1.0, 1.0);
   // Set the light direction (in the world coordinate)
   gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
   // Set the ambient light
   gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

   // Set the light color (white)
  //  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
   // Set the light direction (in the world coordinate)
   gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
   // Set the ambient light
   gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
 

  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals
  var g_MvpMatrix = new Matrix4(); 
  // Register the event handler
  var currentAngle = [0.0, 0.0]; // Current rotation angle ([x-axis, y-axis] degrees)
  initEventHandlers(canvas, currentAngle);



  var tick = function() {   // Start drawing
    draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle, normalMatrix,u_NormalMatrix, g_MvpMatrix, modelMatrix, mvpMatrix, u_ModelMatrix);
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {
 
  var vertices = new Float32Array([
    1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, 1.0,   //  \
    1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, 1.0,   //  /
    1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, -1.0,   //  \   bottom
    1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, -1.0,   //  /   bottom
   -1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, 1.0,   //  /
   -1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, 1.0,   //  \
   -1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, -1.0,   //  /   bottom
   -1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, -1.0,   //  \   bottom

 ]);


   // Colors
  var colors = new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // 
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     //
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     //
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // 
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     //
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,    // 
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     //
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,    // 
 ]);

 
   // Normal
  var normals = new Float32Array([
    1.0, 1.0,  1.0,   1.0, 1.0, 1.0,   1.0, 1.0, 1.0,   //  \
    1.0, -1.0, 1.0,   1.0,-1.0, 1.0,   1.0, -1.0, 1.0,   //  /
    1.0, 1.0, -1.0,   1.0, 1.0, -1.0,  1.0, 1.0, -1.0,   //  \   bottom
    1.0, -1.0,-1.0,   1.0,-1.0, -1.0,  1.0, -1.0, -1.0,   //  /   bottom
   -1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,   //  /
   -1.0, -1.0, 1.0,  -1.0,-1.0, 1.0,   -1.0, -1.0, 1.0,   //  \
   -1.0, 1.0, -1.0,   -1.0, 1.0, -1.0,   -1.0, 1.0, -1.0,   //  /   bottom
   -1.0,-1.0, -1.0,   -1.0,-1.0, -1.0,   -1.0,-1.0, -1.0,    // 
  ]);

    // Indices of the vertices
  var indices = new Uint8Array([
      0, 1, 2,     // \ up
      3, 4, 5,     // / up
      6, 7,8,     //  \ bottom
      9,10,11,     // / bottom
     12,13,14,     // \ up
     15,16,17,     // / up
     18,19,20,     // \ bottom
     21,22,23,     // / bottom
  ]);

  // Create a buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    return -1;
  }

  // Write vertex information to buffer object
  // if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, colors, 3, gl.FLOAT,'a_Color')) return -1;
  if (!initArrayBuffer(gl, normals, 3, gl.FLOAT,'a_Normal')) return -1;
  if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1; // Vertex coordinates


  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initEventHandlers(canvas, currentAngle) {
  var dragging = false;         // Dragging or not
  var lastX = -1, lastY = -1;   // Last position of the mouse

  canvas.onmousedown = function(ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    // Start dragging if a moue is in <canvas>
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      dragging = true;
    }
  };

  canvas.onmouseup = function(ev) { dragging = false;  }; // Mouse is released

  canvas.onmousemove = function(ev) { // Mouse is moved
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100/canvas.height; // The rotation ratio
      var dx = factor * (x - lastX);
      var dy = factor * (y - lastY);
      // Limit x-axis rotation angle to -90 to 90 degrees
      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[1] = currentAngle[1] + dx;
    }
    lastX = x, lastY = y;
  };
}

// Model view projection matrix
function draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle, normalMatrix,u_NormalMatrix, g_MvpMatrix, modelMatrix, mvpMatrix, u_ModelMatrix) {
  // Caliculate The model view projection matrix and pass it to u_MvpMatrix
  // g_MvpMatrix.set(viewProjMatrix);
  // g_MvpMatrix.setTranslate(0, 0, 0); // Translate to the y-axis direction
  modelMatrix.setRotate(currentAngle[0], 1.0, 0.0, 0.0); // Rotation around x-axis
  modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); // Rotation around y-axis
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  mvpMatrix.set(viewProjMatrix).multiply(modelMatrix)
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     // Clear buffers
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   // Draw the cube
}

function initArrayBuffer(gl, data, num, type, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment to a_attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

