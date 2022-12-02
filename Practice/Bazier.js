let u_FragColor;
let ControlPoint = [...Array(20)].map(x=>new Float32Array(2).fill(0));
let mouse_down, first_mouse_down, mouse_control_key, save_x, save_y, save_i = -1;
// Vertex shader program

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';
 
// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
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
 
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // white
  // gl.clearColor(0.0, 0.0, 0.0, 1.0);  // black
  
  // set up blending
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ZERO);
 
  // Clear <canvas>
  initControlPoints();
  display(gl, 1);

  // Register the event handlers
  canvas.onmousemove = function(ev) {   // Mouse is pressed
    var dx, dy, x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (mouse_down && rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
		if (first_mouse_down) {
	 		dx = x - save_x;
			dy = y - save_y;
			first_mouse_down = 0;
			}
		else {
			dx = ev.movementX;
			dy = ev.movementY;
			}
		dx /= canvas.width/2;
		dy /= canvas.height/2;
		move_control_point(save_i, dx, dy);
		}
	else
		save_i = -1;
	}
  canvas.onmouseup = function(ev) { // mouse is released
  	 mouse_down = 0;
	 }

  canvas.onmousedown = function(ev) {   // Mouse is pressed
    var x = ev.clientX, y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      // If Clicked position is inside the <canvas>, update the selected surface
      let pixels = new Uint8Array(4); // Array for storing the pixel value
		let x_in_canvas = x - rect.left, y_in_canvas = rect.bottom - y;
		display(gl, 0);
  		gl.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		save_x = x;
		save_y = y;
		mouse_control_key = ev.ctrlKey;
		let i = Math.floor(pixels[3]/2 - 102);
		if (i < 19) {
	 		mouse_down = 1;
	 		first_mouse_down = 1;
			save_i = i;
			console.log("control point", i, "selected at position", x, y, "RGBA",
				pixels[0], pixels[1], pixels[2], pixels[3]);
			}
		display(gl, 1);
		}
    }

  var tick = function() {   // Start drawing
    display(gl, 1);
    requestAnimationFrame(tick, canvas);
  };
  tick();
}

function move_control_point(i, dx, dy) {
	ControlPoint[i][0] += dx;
	ControlPoint[i][1] -= dy; // minus because canvas y increases downwards
	if (mouse_control_key)
		return;
	if (i % 3 == 0) { // move two adjacent control points in the same direction
		if (i > 0 && i < 18) {
			ControlPoint[i-1][0] += dx;
			ControlPoint[i-1][1] -= dy;
			ControlPoint[i+1][0] += dx;
			ControlPoint[i+1][1] -= dy;
			}
		}
	else if (i % 3 == 1 && i > 1) {
	  	ControlPoint[i-2][0] -= dx;  // move control point 2 on previous segment in opposite direction
	  	ControlPoint[i-2][1] += dy;
		}
	else if (i % 3 == 2 && i < 17) {
	  	ControlPoint[i+2][0] -= dx;  // move control point 1 on next segment in opposite direction
	  	ControlPoint[i+2][1] += dy;
		}
   }

function initControlPoints() {
	let i;
	for (i = 0; i < 20; ++i) {
		ControlPoint[i][0] = -.95 + .1*i;
		if ((i+1)%6 < 3)
			ControlPoint[i][1] = 0;
		else
			ControlPoint[i][1] = .1;
		}
	}

function display(gl, kind) {
	let i;
   gl.clear(gl.COLOR_BUFFER_BIT);
	for (i = 0; i < 6; ++i)
		segment(gl, ControlPoint[3*i], ControlPoint[3*i+1], ControlPoint[3*i+2], ControlPoint[3*i+3]);
	for (i = 0; i < 19; ++i)
		drawControlPoint(gl, i, kind);
	}

function drawControlPoint(gl, i, kind) {
	let d = .015, black = 0;
   let vertices= new Float32Array(2*4);
	let x = ControlPoint[i][0];
	let y = ControlPoint[i][1];
	vertices[0] = x - d; vertices[1] = y - d;
	vertices[2] = x - d; vertices[3] = y + d;
	vertices[4] = x + d; vertices[5] = y + d;
	vertices[6] = x + d; vertices[7] = y - d;
 
  // Create a buffer object
  var vertex= gl.createBuffer();  
  if (!vertex) {
    console.log('Failed to create the buffer object');
    return false;
  }
 
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
 
  var FSIZE = vertices.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  if (u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 2, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object
 
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // decide which points should be black
  if (i == save_i)
  	 black = 1;
  if (!mouse_control_key) {
	 if (save_i % 3 == 0) { // move two adjacent control points in the same direction
		if (save_i > 0 && save_i < 18) {
			if (i == save_i - 1 || i == save_i + 1)
				black = 1;
			}
		}
	 else if (save_i % 3 == 1 && save_i > 1) {
		if (i == save_i - 2)
			black = 1;
		}
	 else if (save_i % 3 == 2 && save_i < 17) {
		if (i == save_i + 2)
			black = 1
		}
    }
  if (kind == 0)
    gl.uniform4f(u_FragColor, 0, 0, 1., 0.8 + (2*i+1)/255.); 
  else if (black)
    gl.uniform4f(u_FragColor, 0., 0., 0., 1.);
  else
    gl.uniform4f(u_FragColor, 1., 0., 0., 1.);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function segment(gl, p0, p1, p2, p3) {
  // Draw the red control point polygon
  let n = control_polygon(gl, p0, p1, p2, p3);
  if (n < 0) {
    console.log('Failed to set the vertex information for control polygon');
    return;
  }
  gl.uniform4f(u_FragColor, 1., 0., 0., 1.);
  gl.drawArrays(gl.LINE_STRIP, 0, n);
 
  // Draw the green Bezier curve
  n = bezier(gl, p0, p1, p2, p3, 20);
  if (n < 0) {
    console.log('Failed to set the vertex information for bezier curve');
    return;
  }
  gl.uniform4f(u_FragColor, .0, 1., 0., 1.);
  gl.drawArrays(gl.LINE_STRIP, 0, n);
}
 
function bezier(gl, p0, p1, p2, p3, n) {
  var vertices= new Float32Array(2*(n + 1));
  let MBez = [
  		[-1, 3, -3, 1],
		[ 3, -6, 3, 0],
		[-3,  3, 0, 0],
		[ 1,  0, 0, 0]];
	let i, j, t, weight = new Float32Array(4);
	for (i = 0; i <= n; ++i) {
		t = i/n;
		for(j = 0; j < 4; ++j)
			weight[j] = MBez[j][3] + t*(MBez[j][2] + t*(MBez[j][1] + t*MBez[j][0]));
		for (j = 0; j < 2; ++j)
			vertices[2*i + j] = weight[0]*p0[j] + weight[1]*p1[j] + weight[2]*p2[j] + weight[3]*p3[j];
		}
 
  // Create a buffer object
  var vertex= gl.createBuffer();  
  if (!vertex) {
    console.log('Failed to create the buffer object');
    return false;
  }
 
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
 
  var FSIZE = vertices.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  if (u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 2, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object
 
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
  return n + 1;
}
 
function control_polygon(gl, p0, p1, p2, p3) {
  var vertices= new Float32Array(2*4);
  vertices[0] = p0[0];
  vertices[1] = p0[1];
  vertices[2] = p1[0];
  vertices[3] = p1[1];
  vertices[4] = p2[0];
  vertices[5] = p2[1];
  vertices[6] = p3[0];
  vertices[7] = p3[1];
 
  // Create a buffer object
  var vertex= gl.createBuffer();  
  if (!vertex) {
    console.log('Failed to create the buffer object');
    return false;
  }
 
  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertex);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
 
  var FSIZE = vertices.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  if (u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 2, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object
 
  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
  return 4;
}
 
