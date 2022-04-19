const CANVAS_SIZE_X = 6000 / 6;
const CANVAS_SIZE_Y = 4000 / 6;

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
  background(0, 0, 0);

  initG = createGraphics(width, height);
  initG.image(img, 0, 0, width, height);

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
  image(pass2, 0, 0, width, height);
}

const ITERATIONS = 2400
const FLIPEVERY = 500
let horizontal = true

let i = 1;
function draw() {

  if(i <= ITERATIONS){
    itr()
    if(i % (FLIPEVERY / 2) === 0){
      console.log(i % (FLIPEVERY / 2))
      if(horizontal){
        flipHorizontal(pass2, this)
      } else {
        flipVertical(pass2, this)
      }
      horizontal = !horizontal

      //Loads the image
      initG.image(this, 0, 0, width, height);
      pass2.shader(step2);
      step2.setUniform("resolution", [width, height]);
      step2.setUniform("rand_seed", [random(), random()]);
      step2.setUniform("texture", initG);
      pass2.rect(0, 0, width, height);
    }
    itr()
    image(pass2, 0, 0, width, height);
  }

  i++
}



const wHalf = CANVAS_SIZE_X/2
const hHalf =  CANVAS_SIZE_Y/2

function itr(){
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
}

function flipVertical(from, to){
  to.copy(from, 0, 0, wHalf, hHalf, wHalf, 0, wHalf, hHalf)
  to.copy(from, -wHalf, 0, wHalf, hHalf, 0, 0, wHalf, hHalf)
  to.copy(from, 0, -hHalf, wHalf, hHalf, wHalf, hHalf, wHalf, hHalf)
  to.copy(from, -wHalf, -hHalf, wHalf, hHalf, 0, hHalf, wHalf, hHalf)
}
function flipHorizontal(from, to){
  to.copy(from, 0, 0, wHalf, hHalf, 0, hHalf, wHalf, hHalf)
  to.copy(from, -wHalf, 0, wHalf, hHalf, wHalf, hHalf, wHalf, hHalf)
  to.copy(from, 0, -hHalf, wHalf, hHalf, 0, 0, wHalf, hHalf)
  to.copy(from, -wHalf, -hHalf, wHalf, hHalf, wHalf, 0, wHalf, hHalf)
}

/**
 * Save image to disk.
 */
function save_image() {
  save(rand + ".png");
}
