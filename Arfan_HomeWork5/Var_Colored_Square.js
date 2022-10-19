//vertex shader
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'const vec2 texSize = vec2(2, 2);\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
    'gl_FragColor = texture2D(u_Sampler, (v_TexCoord * (texSize - 1.0) + 0.5) / texSize);\n'+
  '}\n';

function main() {
  var canvas = document.getElementById('webgl');


  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  if (!initTextures(gl, n)) {
    console.log('Failed to intialize the texture.');
    return;
  }


function initVertexBuffers(gl) {
  var n = 4;   
  if (!gl.createBuffer()) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,  new Float32Array([
    -0.5, -0.5, 0, 0,
     0.5, -0.5, 1, 0,
     0.5,  0.5, 1, 1,
    -0.5,  0.5, 0, 1,
    
  ]), gl.STATIC_DRAW);
  
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, (new Float32Array([
    -0.5, -0.5, 0, 0,
     0.5, -0.5, 1, 0,
     0.5,  0.5, 1, 1,
    -0.5,  0.5, 0, 1,
    
  ]).BYTES_PER_ELEMENT) * 4, 0);
  gl.enableVertexAttribArray(a_Position);

  if (gl.getAttribLocation(gl.program, 'a_TexCoord') < 0) {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }

  gl.vertexAttribPointer(gl.getAttribLocation(gl.program, 'a_TexCoord'), 2, gl.FLOAT, false, (new Float32Array([
    -0.5, -0.5, 0, 0,
     0.5, -0.5, 1, 0,
     0.5,  0.5, 1, 1,
    -0.5,  0.5, 0, 1,
    
  ]).BYTES_PER_ELEMENT) * 4, (new Float32Array([
    -0.5, -0.5, 0, 0,
     0.5, -0.5, 1, 0,
     0.5,  0.5, 1, 1,
    -0.5,  0.5, 0, 1,
    
  ]).BYTES_PER_ELEMENT) * 2);
  gl.enableVertexAttribArray(gl.getAttribLocation(gl.program, 'a_TexCoord')); 

  return n;
}


function initTextures(gl, n) {
  var txtr = gl.createTexture();
  if (!txtr) {
    console.log('Failed to create the texture object');
    return false;
  }

  var smplr = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!smplr) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }
  
  loadTexture(gl, n, txtr, smplr); };

  return true;
}

function loadTexture(gl, n, txtr, smplr) {
  
  
  gl.bindTexture(gl.TEXTURE_2D, txtr);

  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);   

  gl.texImage2D(gl.TEXTURE_2D,0, gl.RGB,  2,2,0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(
    [
        255,  0, 0,
        255,255,255,
        0,255,0,
        0,0,255]));

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.uniform1i(smplr, 0);
  
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}
