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
  
  handleEvents(canvas, gl, a_Position);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  pointsDraw(gl, a_Position);
  
}
function pointsDraw(gl, a_Position) {
  var stepAtTime = 0.01;
  var xs = []
  var ys = []
  var array = []
  var xys = []
  
  t = 0;
  
  coordPoints.forEach(point => {
    array.push(point[0]); 
    array.push(point[1]);

  });
  
  pointsArray = array;
  gl.clear(gl.COLOR_BUFFER_BIT);
  current_points = coordPoints[0]
  current_index = 0
  for (i=0;i<=(coordPoints.length/4)+1;i++){
    current_index = i*3;
    console.log(current_index)
    while (t <= 1) {
      x = (-1 * t ** 3 + 3 * t ** 2 - 3 * t + 1) * current_points[0] + (3 * t ** 3 - 6 * t ** 2 + 3 * t) * coordPoints[current_index + 1][0] +
       (-3 * t ** 3 + 3 * t ** 2) * coordPoints[current_index + 2][0] + t ** 3 * coordPoints[current_index + 3][0];
      y = (-1 * t ** 3 + 3 * t ** 2 - 3 * t + 1) * current_points[1] + (3 * t ** 3 - 6 * t ** 2 + 3 * t) * coordPoints[current_index + 1][1] + 
      (-3 * t ** 3 + 3 * t ** 2) * coordPoints[current_index + 2][1] + t ** 3 * coordPoints[current_index + 3][1];
      xs.push(x), ys.push(y), xys.push(x), xys.push(y)
      t += stepAtTime
    }
    t = 0
    current_points = coordPoints[current_index + 3]
  }
  lines = [];
  for (var i = 0; i < coordPoints.length; i += 1) {
    lines.push(coordPoints[i][0])
    lines.push(coordPoints[i][1])
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  //change color of line strip to green
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1);
  gl.drawArrays(gl.LINE_STRIP, 0, lines.length / 2);

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(xys), gl.STATIC_DRAW);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  // the code is change color of line to green
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

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lines), gl.STATIC_DRAW);
  
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(a_Position);

  //change color of point to red
  var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1);
  gl.drawArrays(gl.POINTS, 0, lines.length / 2);

}

var coordPoints = [
  [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
  [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
  [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
]
var pointsArray = [];

function handleEvents(canvas, gl, a_Position) {
  var drag = false;
  var xlst = -1, ylst = -1;
  var index = 0;
  canvas.onmousedown = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    if (ev.target.getBoundingClientRect().left <= x && x < ev.target.getBoundingClientRect().right && ev.target.getBoundingClientRect().top <= y && y < ev.target.getBoundingClientRect().bottom) {
      xlst = x; ylst = y;
      for (var i=0; i < [
        [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
        [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
        [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
      ].length; i++) {
        if (([
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][0] - 0.05 <= ((xlst - 200) / 200) && ((xlst - 200) / 200) <= [
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][0] + 0.05) && ([
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][1] - 0.05 <= (-1*(ylst - 200) / 200) && (-1*(ylst - 200) / 200) <= [
          [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
          [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
          [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
        ][i][1] + 0.05)) {
          index = i;
        }
      };
      drag = true;
    }
  };

  coordPoints = [
    [-0.5, -0.4], [-0.85, -0.15], [-0.82, 0.42], [-0.7, 0.42], [-0.58, 0.42], [-0.45, 0.15],
    [-0.35, 0.05], [-0.27, 0.02], [-0.1, -0.2], [0, -0.2], [0.12, -0.2], [0.3, -0.21], [0.35, 0.05],
    [0.41, 0.33], [0.6, 0.31], [0.72, 0.3], [0.83, 0.27], [0.87, -0.2], [0.55, -0.5]
  ]
  canvas.onmouseup = function (ev) { drag = false; };
  canvas.onmousemove = function (ev) {
    var x = ev.clientX, y = ev.clientY;
    if (drag) {

      coordinates = coordPoints[index]
      coordPoints[index] = [(x - 200) / 200, -1 * (y - 200) / 200];
      coordPoints[index] = [(x - 200) / 200, -1 * (y - 200) / 200];

      
      if ((index) % 3 == 0 && index != 0 && index != coordPoints.length-1 ){
        coordPoints[index + 1][0] += [[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][0]
        coordPoints[index + 1][1] += [[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][1]

        coordPoints[index - 1][0] += [[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][0]
        coordPoints[index - 1][1] += [[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][1]
        console.log('joint', coordPoints.length)
      }
      
      if ((index + 1) % 3 == 0 && index != 0 && index != coordPoints.length-2 && index != coordPoints.length-1) {
        coordPoints[index + 2][0] += -[[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][0]
        coordPoints[index + 2][1] += -[[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][1]

        console.log('before')
      }
      if ((index - 1) % 3 == 0 && index != 0 && index != 1 && index != coordPoints.length-1) {

        coordPoints[index - 2][0] += -[[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][0]
        coordPoints[index - 2][1] += -[[(x - 200) / 200, -1 * (y - 200) / 200][0] - coordinates[0], [(x - 200) / 200, -1 * (y - 200) / 200][1] - coordinates[1]][1]

        console.log('after')
      }
      pointsDraw(gl, a_Position);
      
    }
    xlst = x, ylst = y;
  };
}

