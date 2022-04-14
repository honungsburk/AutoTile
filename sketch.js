const CANVAS_SIZE_X = 1500;
const CANVAS_SIZE_Y = 1000;

let step1;
let step2;

let pass1, pass2, initG;

let img;

// Create a random seed - If you want to use this script to regenerate your image
// simply uncomment and write your seed in the string.
const rand = Math.random().toString().substr(2, 8);
// const rand = "MY_SEED"
const rng = new RNG(rand);

function preload() {
  // note that we are using two instances
  // of the same vertex and fragment shaders
  step1 = loadShader("shaders/shader.vert", "shaders/shader.frag");
  step2 = loadShader("shaders/shader.vert", "shaders/shader.frag");
  img = loadImage("assets/510.png");
}

// helper for writing color to array
function writeColor(image, x, y, red, green, blue, alpha) {
  let index = (x + y * width) * 4;
  image.pixels[index] = red;
  image.pixels[index + 1] = green;
  image.pixels[index + 2] = blue;
  image.pixels[index + 3] = alpha;
}

/**
 * The setup function is run before anything else.
 */
function setup() {
  /**
   * Using SVG leads to smaller image sizes + infinite resolution! Perfect
   * when creating an NFT.
   */
  createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);
  // Since we want a static image we will turn off the looping.
  // noLoop();
  background(0, 0, 0);

  initG = createGraphics(width, height);
  initG.image(img, 0, 0, width, height);
  // image(img, 0, 0, width, height);
  // for (var i = 0; i < width; i++) {
  //   for (var j = 0; j < height; j++) {
  //     initG.set(i, j, color(random(130, 170), random(0, 10), random(10, 40)));
  //   }
  // }
  // initG.updatePixels();
  // initG.noStroke();
  // initG.rectMode(CENTER);
  // initG.fill("#330209");
  // let lines = 10;
  // let lineWidth = (width / lines) * 0.2;
  // let start = width * 0.1 + lineWidth / 2;
  // let end = width * 0.9 - lineWidth / 2;
  // let step = (end - start) / lines;
  // for (let i = 0; i <= lines; i++) {
  //   initG.rect(start + step * i, height / 2, lineWidth, height * 9);
  // }

  // initialize the createGraphics layers
  pass1 = createGraphics(width, height, WEBGL);
  pass2 = createGraphics(width, height, WEBGL);

  // turn off the cg layers stroke
  pass1.noStroke();
  pass2.noStroke();

  // Load the image
  pass2.shader(step2);
  step2.setUniform("resolution", [width, height]);
  step2.setUniform("rand_seed", [random(), random()]);
  step2.setUniform("texture", initG);
  pass2.rect(0, 0, width, height);
}

function draw() {
  pass1.shader(step1);
  step1.setUniform("resolution", [width, height]);
  step1.setUniform("rand_seed", [random(), random()]);
  step1.setUniform("texture", pass2);
  pass1.rect(0, 0, width, height);

  // we need to make sure that we draw the rect inside of pass1

  pass2.shader(step2);
  step2.setUniform("resolution", [width, height]);
  step2.setUniform("rand_seed", [random(), random()]);
  step2.setUniform("texture", pass1);
  pass2.rect(0, 0, width, height);

  image(pass2, 0, 0, width, height);
  // quad(-1, -1, 1, -1, 1, 1, -1, 1);
}

/**
 * Save image to disk.
 */
function save_image() {
  save(rand + ".png");
}
