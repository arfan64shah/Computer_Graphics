//Vertex shader
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_PointSize = 10.0;\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

//Fragment shader
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // 
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
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
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  initEventHandlers(canvas, gl, a_Position);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  drawDots(gl, a_Position);
  
}
function drawDots(gl, a_Position) {
  var new_array = []
  var xs = []
  var ys = []
  var xys = []
  var step = 0.01;
  t = 0;
  
  q_points.forEach(point => {
    new_array.push(point[0]); 
    new_array.push(point[1]);

  });
  
  g_points = new_array;
  gl.clear(gl.COLOR_BUFFER_BIT);
  current_points = q_points[0]
  current_index = 0
  for (i=0;i<=(q_points.length/4)+1;i++){
    current_index = i*3;
    console.log(current_index)
    while (t <= 1) {
      x = (-1 * t ** 3 + 3 * t ** 2 - 3 * t + 1) * current_points[0] + (3 * t ** 3 - 6 * t ** 2 + 3 * t) * q_points[current_index + 1][0] + (-3 * t ** 3 + 3 * t ** 2) * q_points[current_index + 2][0] + t ** 3 * q_points[current_index + 3][0];
      y = (-1 * t ** 3 + 3 * t ** 2 - 3 * t + 1) * current_points[1] + (3 * t ** 3 - 6 * t ** 2 + 3 * t) * q_points[current_index + 1][1] + (-3 * t ** 3 + 3 * t ** 2) * q_points[current_index + 2][1] + t ** 3 * q_points[current_index + 3][1];
      xs.push(x)
      ys.push(y)
      xys.push(x)
      xys.push(y)
      t += step
    }
    t = 0
    current_points = q_points[current_index + 3]
  }
  q_lines = [];
  for (var i = 0; i < q_points.length; i += 1) {
    q_lines.push(q_points[i][0])
    q_lines.push(q_points[i][1])
  }

  var n = xys.length/2;
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1);
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(q_lines), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1);
  gl.drawArrays(gl.LINE_STRIP, 0, q_lines.length / 2);

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(xys), gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1);
  gl.drawArrays(gl.LINE_STRIP, 0, n);


  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(q_lines), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1);
  gl.drawArrays(gl.POINTS, 0, q_lines.length / 2);

}

var q_points = [
  [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
  [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
  [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
]
var g_points = [];

function initEventHandlers(canvas, gl, a_Position) {
  var dragging = false;
  var lastX = -1, lastY = -1;
  var index = 0;
  canvas.onmousedown = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      lastX = x; lastY = y;
      mouseCoordX = (lastX - 200) / 200;
      mouseCoordY = -1*(lastY - 200) / 200;
      for (var i=0; i < [
        [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
        [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
        [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
      ].length; i++) {
        if (([
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][0] - 0.05 <= mouseCoordX && mouseCoordX <= [
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][0] + 0.05) && ([
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][1] - 0.05 <= mouseCoordY && mouseCoordY <= [
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][1] + 0.05)) {
          index = i;
        }
      };
      dragging = true;
    }
  };

  q_points = [
    [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
    [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
    [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
  ]
  canvas.onmouseup = function (ev) { dragging = false; };
  canvas.onmousemove = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    if (dragging) {

      prev_coords = q_points[index]
      new_coords = [(x - 200) / 200, -1 * (y - 200) / 200]
      changed_coords = [new_coords[0] - prev_coords[0], new_coords[1] - prev_coords[1]]

      q_points[index] = [(x - 200) / 200, -1 * (y - 200) / 200];
      q_points[index] = [(x - 200) / 200, -1 * (y - 200) / 200];

      
      if ((index) % 3 == 0 && index != 0 && index != q_points.length-1 ){
        q_points[index + 1][0] += changed_coords[0]
        q_points[index + 1][1] += changed_coords[1]

        q_points[index - 1][0] += changed_coords[0]
        q_points[index - 1][1] += changed_coords[1]
        console.log('joint', q_points.length)
      }
      
      if ((index + 1) % 3 == 0 && index != 0 && index != q_points.length-2 && index != q_points.length-1) {
        q_points[index + 2][0] += -changed_coords[0]
        q_points[index + 2][1] += -changed_coords[1]

        console.log('before')
      }
      if ((index - 1) % 3 == 0 && index != 0 && index != 1 && index != q_points.length-1) {

        q_points[index - 2][0] += -changed_coords[0]
        q_points[index - 2][1] += -changed_coords[1]

        console.log('after')
      }
      drawDots(gl, a_Position);
      
    }
    lastX = x, lastY = y;
  };
}

