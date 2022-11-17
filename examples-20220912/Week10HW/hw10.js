//Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +    
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    
  'uniform mat4 u_NormalMatrix;\n' +   
  'uniform vec3 u_DiffuseLight;\n' +   
  'uniform vec3 u_LightPosition;\n' + 
  'uniform vec3 u_AmbientLight;\n' +  
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
     
  '  vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  vec4 vertexPosition = u_ModelMatrix * a_Position;\n' +
  '  vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition));\n' +
     
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
     
  '  vec3 diffuse = u_DiffuseLight * a_Color.rgb * nDotL;\n' +
     
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
     
  '  v_Color = vec4(diffuse + ambient, a_Color.a);\n' + 
  '}\n';

//Fragment shader program
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

  //initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  //vertex information
  if (initVertexBuffers(gl) < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  if (!gl.getUniformLocation(gl.program, 'u_MvpMatrix') || !gl.getUniformLocation(gl.program, 'u_NormalMatrix') || !gl.getUniformLocation(gl.program, 'u_DiffuseLight') || !gl.getUniformLocation(gl.program, 'u_LightPosition')|| !gl.getUniformLocation(gl.program, 'u_AmbientLight')) { 
    console.log('Failed to get the storage location');
    return;
  }
  var viewProjMatrix = new Matrix4();
  viewProjMatrix.setPerspective(30.0, canvas.width / canvas.height, 1.0, 100.0);
  viewProjMatrix.lookAt(3.0, 3.0, 7.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  
   gl.uniform3f(gl.getUniformLocation(gl.program, 'u_DiffuseLight'), 1.0, 1.0, 1.0);

   gl.uniform3f(gl.getUniformLocation(gl.program, 'u_LightPosition'), 2.3, 4.0, 3.5);
  
   gl.uniform3f(gl.getUniformLocation(gl.program, 'u_AmbientLight'), 0.2, 0.2, 0.2);
  
   gl.uniform3f(gl.getUniformLocation(gl.program, 'u_LightPosition'), 2.3, 4.0, 3.5);
   
   gl.uniform3f(gl.getUniformLocation(gl.program, 'u_AmbientLight'), 0.2, 0.2, 0.2); 
  
  var currentAngle = [0.0, 0.0]; 
  initEventHandlers(canvas, currentAngle);

  var tick = function() {
    draw(gl, initVertexBuffers(gl), viewProjMatrix, gl.getUniformLocation(gl.program, 'u_MvpMatrix'), currentAngle, new Matrix4(),gl.getUniformLocation(gl.program, 'u_NormalMatrix'), new Matrix4(), new Matrix4(), new Matrix4(), gl.getUniformLocation(gl.program, 'u_ModelMatrix'));
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function initVertexBuffers(gl) {
  if (!gl.createBuffer()) {
    return -1;
  }
  if (!initArrayBuffer(gl, new Float32Array([
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,    
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,    
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,    
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,    
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
    1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     
 ]), 3, gl.FLOAT,'a_Color')) return -1;
  if (!initArrayBuffer(gl, new Float32Array([
    1.0, 1.0,  1.0,   1.0, 1.0, 1.0,   1.0, 1.0, 1.0,  
    1.0, -1.0, 1.0,   1.0,-1.0, 1.0,   1.0, -1.0, 1.0,   
    1.0, 1.0, -1.0,   1.0, 1.0, -1.0,  1.0, 1.0, -1.0,   
    1.0, -1.0,-1.0,   1.0,-1.0, -1.0,  1.0, -1.0, -1.0,   
   -1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,   -1.0, 1.0, 1.0,  
   -1.0, -1.0, 1.0,  -1.0,-1.0, 1.0,   -1.0, -1.0, 1.0,   
   -1.0, 1.0, -1.0,   -1.0, 1.0, -1.0,   -1.0, 1.0, -1.0,   
   -1.0,-1.0, -1.0,   -1.0,-1.0, -1.0,   -1.0,-1.0, -1.0,    
  ]), 3, gl.FLOAT,'a_Normal')) return -1;
  if (!initArrayBuffer(gl, new Float32Array([
    1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, 1.0,   
    1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, 1.0,   
    1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, -1.0,   
    1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, -1.0,   
   -1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, 1.0,   
   -1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, 1.0,   
   -1.0, 0.0, 0.0,   0.0, 1.0, 0.0,   0.0, 0.0, -1.0,   
   -1.0, 0.0, 0.0,   0.0,-1.0, 0.0,   0.0, 0.0, -1.0,   

 ]), 3, gl.FLOAT, 'a_Position')) return -1; 

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([
    0, 1, 2,     
    3, 4, 5,     
    6, 7,8,     
    9,10,11,     
   12,13,14,     
   15,16,17,     
   18,19,20,     
   21,22,23,     
]), gl.STATIC_DRAW);

  return new Uint8Array([
    0, 1, 2,     
    3, 4, 5,     
    6, 7,8,     
    9,10,11,     
   12,13,14,     
   15,16,17,     
   18,19,20,     
   21,22,23,     
]).length;
}

function initEventHandlers(canvas, currentAngle) {
  var dragging = false;       
  var x_lst = -1, y_lst = -1;   

  canvas.onmousedown = function(ev) {   
    var x = ev.clientX, y = ev.clientY;
    if (ev.target.getBoundingClientRect().left <= x && x < ev.target.getBoundingClientRect().right && ev.target.getBoundingClientRect().top <= y && y < ev.target.getBoundingClientRect().bottom) {
      x_lst = x; y_lst = y;
      dragging = true;
    }
  };

  canvas.onmouseup = function(ev) { dragging = false;  };

  canvas.onmousemove = function(ev) { 
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {
      var factor = 100/canvas.height; 
      var dx = factor * (x - x_lst);
      var dy = factor * (y - y_lst);

      currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
      currentAngle[1] = currentAngle[1] + dx;
    }
    x_lst = x, y_lst = y;
  };
}

var g_MvpMatrix = new Matrix4();
var normalMatrix = new Matrix4();
var modelMatrix = new Matrix4();
var mvpMatrix = new Matrix4();

var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

function draw(gl, n, viewProjMatrix, u_MvpMatrix, currentAngle, normalMatrix,u_NormalMatrix, g_MvpMatrix, modelMatrix, mvpMatrix, u_ModelMatrix) {
  modelMatrix.setRotate(currentAngle[0], 1.0, 0.0, 0.0); 
  modelMatrix.rotate(currentAngle[1], 0.0, 1.0, 0.0); 
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  mvpMatrix.set(viewProjMatrix).multiply(modelMatrix);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);   
}

function initArrayBuffer(gl, data, num, type, attribute) {
  // Create buffer
  if (!gl.createBuffer()) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  
  if (gl.getAttribLocation(gl.program, attribute) < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(gl.getAttribLocation(gl.program, attribute), num, type, false, 0, 0);
  gl.enableVertexAttribArray(gl.getAttribLocation(gl.program, attribute));

  return true;
}