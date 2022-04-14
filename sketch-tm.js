const CANVAS_SIZE_X = 1200;
const CANVAS_SIZE_Y = 1200;
//this variable will hold our shader object
let simpleShader;

function preload() {
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  simpleShader = loadShader("shaders/basic.vert", "shaders/basic.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y, WEBGL);
  noStroke();
}

function draw() {
  // shader() sets the active shader with our shader
  shader(simpleShader);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}
