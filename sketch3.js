const CANVAS_SIZE_X = 400;
const CANVAS_SIZE_Y = 400;

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
  rectMode(CENTER); //??? can be removed???
  background(0, 0, 0);

  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      set(i, j, color(random(100, 220), random(30, 80), random(20, 40)));
    }
  }
  updatePixels();
  noStroke();
  fill("#850b58");
  rect(height / 2, width / 2, 200, 200);
}

// Roachach??
//
// Variants:
// * shapes
// * layout strategies (Needs symmetry options)
// * collection of shapes
// * Group actions
// * noStroke / Background Stroke / Shadows
// * background / background gradiant
// * same gradiant for all / liear gradient per object / radial gradiant per object
// * generating color schemes
// * Symmetry / Anti Symmetry / Random
// * color picker (gitter/shape/size/location)
// * size (gitter/shape/location)
// * Grain

// Create a random seed - If you want to use this script to regenerate your image
// simply uncomment and write your seed in the string.
const rand = Math.random().toString().substr(2, 8);
// const rand = "MY_SEED"

function draw() {
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      var currentColor = get(i, j);
      if (random(["H", "T"]) == "H") {
        // Toss and check if heads

        var r = random(["T", "R", "B", "L"]); // Pick random neighbor

        if (r == "L")
          // Left neighbor
          set((i - 1 + width) % width, j, currentColor);
        else if (r == "R")
          // Right neighbor
          set((i + 1) % width, j, currentColor);
        else if (r == "B")
          // Bottom neighbor
          set(i, (j + 1) % height, currentColor);
        else if (r == "T") {
          // Top neighbor
          set(i, (j - 1 + height) % height, currentColor);
        }
      }
    }
  }

  updatePixels();
}

/**
 * Save image to disk.
 */
function save_image() {
  save(rand + ".png");
}
