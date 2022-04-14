const CANVAS_SIZE_X = 800;
const CANVAS_SIZE_Y = 800;

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
  noLoop();
  rectMode(CENTER); //??? can be removed???
  background(0, 0, 0);
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
  //   noStroke();
  // stroke(22, 36, 54);
  // strokeWeight(8);
  // fillLinearGradient(
  //   CANVAS_SIZE_X * 0.8,
  //   CANVAS_SIZE_X * 0.3,
  //   CANVAS_SIZE_Y * 0.3,
  //   CANVAS_SIZE_Y * 0.7,
  //   "#00d4ff",
  //   "#f6f2b1"
  // );
  // //   strokeLinearGradient(100, 100, 1100, 1100, "#020024", "#f6f2b1");
  // for (let i = 0; i < 100; i++) {
  //   // randomShadow();
  //   const extraX = randomGaussian(CANVAS_SIZE_X * 0.05, CANVAS_SIZE_X * 0.05);
  //   const extraY = randomGaussian(CANVAS_SIZE_Y * 0.05, CANVAS_SIZE_Y * 0.05);
  //   randomCircle(
  //     CANVAS_SIZE_X * 0.1 - extraX,
  //     CANVAS_SIZE_X * 0.9 + extraX,
  //     CANVAS_SIZE_Y * 0.1 - extraY,
  //     CANVAS_SIZE_Y * 0.9 + extraY,
  //     CANVAS_SIZE_Y * 0.1,
  //     CANVAS_SIZE_Y * 0.1
  //   );
  // }

  // const g = grain(
  //   CANVAS_SIZE_X,
  //   CANVAS_SIZE_Y,
  //   random(0.2, 1),
  //   "rgb(22, 36, 54)",
  //   random(4)
  // );
  // blendMode(DARKEST);
  // image(g, 0, 0);
  //   for (let y = 0; y < height; y++) {
  //     for (let x = 0; x < width; x++) {
  //       const noiseVal = noise(x / width, y / height);
  //       //   stroke(noiseVal * 100);
  //       //   point(x, y);
  //     }
  //   }
  const rng = new RNG(rand);

  const painting = {
    kind: "fill",
    fill: { type: "basic", color: "#ffffff" },
    child: {
      kind: "stroke",
      stroke: { type: "none" },
      child: translateNode(
        50,
        50,
        gridNode(10, 1000, 10, 1000, () =>
          squareNode(0, 0, rng.gaussian_general(100, 50))
        )
      ),
    },
  };
  console.log(painting);

  const res = scaleNode(
    0.8,
    transformWithMetadata((tree, meta) => {
      if (tree.kind === "shape") {
        return fillBasicNode((255 * meta.x) / CANVAS_SIZE_X, tree);
      }
    }, transformNodes(applyOnShapes(jitterShifft(rng, 0, 50)), painting))
  );

  console.log(res);

  roachach(res);
}

function applyOnShapes(fn) {
  return (child) => {
    if (child.kind === "shape") {
      return fn(child);
    } else {
      return undefined;
    }
  };
}

function transformWithMetadata(fn, tree, metadata = { x: 0, y: 0 }) {
  let new_metadata = { ...metadata };
  if (tree.kind === "shape") {
    const [shape_x, shape_y] = getPosFromShape(tree.shape);
    new_metadata.x += shape_x;
    new_metadata.y += shape_y;
  } else if (tree.kind === "matrix") {
    new_metadata.x += tree.matrix.e;
    new_metadata.y += tree.matrix.f;
  }
  const new_tree = fn(tree, new_metadata);
  if (new_tree) {
    return new_tree;
  } else if (tree.kind === "group") {
    tree.children = tree.children.map((child) => {
      const new_child = transformWithMetadata(fn, child, new_metadata);
      if (new_child === undefined) {
        return child;
      } else {
        return new_child;
      }
    });
  } else if (tree.kind !== "shape") {
    tree.child = transformWithMetadata(fn, tree.child, new_metadata);
  }

  return tree;
}

function transformNodes(fn, tree) {
  const new_tree = fn(tree);
  if (new_tree !== undefined) {
    return new_tree;
  } else if (tree.kind === "group") {
    tree.children = tree.children.map((child) => {
      const new_child = transformNodes(fn, child);
      if (new_child === undefined) {
        return child;
      } else {
        return new_child;
      }
    });
  } else if (tree.kind !== "shape") {
    tree.child = transformNodes(fn, tree.child);
  }

  return tree;
}

function jitterShifft(rng, mean, std) {
  return (child) => {
    const x = rng.gaussian_general(mean, std);
    const y = rng.gaussian_general(mean, std);
    return translateNode(x, y, child);
  };
}

function gridNode(nbrX, width, nbrY, height, childBuilder) {
  return rowNode(width, nbrX, () => columnNode(height, nbrY, childBuilder));
}

function rowNode(width, nbr, childBuilder) {
  const step = width / nbr;
  const row = [];
  for (let i = 0; i < nbr; i++) {
    row.push(translateNode(i * step, 0, childBuilder()));
  }
  return {
    kind: "group",
    children: row,
  };
}

function columnNode(height, nbr, childBuilder) {
  const step = height / nbr;
  const column = [];
  for (let i = 0; i < nbr; i++) {
    column.push(translateNode(0, i * step, childBuilder()));
  }
  return {
    kind: "group",
    children: column,
  };
}

function translateNode(x, y, child) {
  return matrixNode(1, 0, 0, 1, x, y, child);
}

function scaleNode(s, child) {
  return matrixNode(s, 0, 0, s, 0, 0, child);
}

function rotateNode(angle, child) {
  const cos_a = cos(angle);
  const sin_a = sin(angle);
  return matrixNode(cos_a, sin_a, -sin_a, cos_a, 0, 0, child);
}

function sheerXNode(angle, child) {
  const shear_factor = 1 / tan(PI / 2 - angle);
  return matrixNode(1, 0, shear_factor, 1, 0, 0, child);
}

function sheerYNode(angle, child) {
  const shear_factor = 1 / tan(PI / 2 - angle);
  return matrixNode(1, shear_factor, 0, 1, 0, 0, child);
}

function matrixNode(a, b, c, d, e, f, child) {
  return {
    kind: "matrix",
    matrix: { a: a, b: b, c: c, d: d, e: e, f: f },
    child: child,
  };
}

function roachach(layer) {
  push();
  switch (layer.kind) {
    case "fill":
      applyFill(layer.fill);
      roachach(layer.child);
      break;
    case "stroke":
      applyStroke(layer.stroke);
      roachach(layer.child);
      break;
    case "group":
      for (let child of layer.children) {
        roachach(child);
      }
      break;
    case "matrix":
      applyMatrix(
        layer.matrix.a,
        layer.matrix.b,
        layer.matrix.c,
        layer.matrix.d,
        layer.matrix.e,
        layer.matrix.f
      );
      roachach(layer.child);
      break;
    case "shape":
      applyShape(layer.shape);
      break;
  }
  pop();
}

function applyStroke(strokeData) {
  switch (strokeData.type) {
    case "none":
      noStroke();
  }
}

function noFillNode(child) {
  return {
    kind: "fill",
    fill: {
      type: "none",
    },
    child: child,
  };
}

function fillBasicNode(color, child) {
  return {
    kind: "fill",
    fill: {
      type: "basic",
      color: color,
    },
    child: child,
  };
}

function applyFill(fillData) {
  switch (fillData.type) {
    case "none":
      noFill();
      break;
    case "basic":
      fill(fillData.color);
      break;
  }
}

function squareNode(x, y, width, tl, tr, br, bl) {
  return rectNode(x, y, width, width, tl, tr, br, bl);
}

function rectNode(x, y, w, h, tl, tr, br, bl) {
  return {
    kind: "shape",
    shape: {
      type: "rect",
      x: x,
      y: y,
      w: w,
      h: h,
      tl: tl,
      tr: tr,
      br: br,
      bl: bl,
    },
  };
}

function getPosFromShape(shape) {
  if (shape.type === "triangle") {
    return [shape.x1, shape.y1];
  } else {
    return [shape.x, shape.y];
  }
}

function applyShape(formData) {
  switch (formData.type) {
    case "circle":
      circle(formData.x, formData.y, formData.d);
      break;
    case "ellipse":
      ellipse(formData.x, formData.y, formData.w, formData.h);
      break;
    case "rect":
      rect(
        formData.x,
        formData.y,
        formData.w,
        formData.h,
        formData.tl,
        formData.tr,
        formData.br,
        formData.bl
      );
      break;
    case "arc":
      arc(
        formData.x,
        formData.y,
        formData.w,
        formData.h,
        formData.start,
        formData.stop,
        formData.mode
      );
      break;
    case "triangle":
      triangle(
        formData.x1,
        formData.y1,
        formData.x2,
        formData.y2,
        formData.x3,
        formData.y3
      );
      break;
  }
}

function randomShadow() {
  const v = random(0, 3);
  if (v <= 1) {
    shadow(2, 2, 4, "#000000");
  } else if (v <= 2) {
    shadow(4, 4, 6, "#000000");
  } else if (v <= 3) {
    shadow(8, 8, 8, "#000000");
  }
}

function randomCircle(from_x, to_x, from_y, to_y, mean_r, standard_deviation) {
  const r = randomGaussian(mean_r, standard_deviation);
  const x = random(from_x + r, to_x - r);
  const y = random(from_y + r, to_y - r);
  circle(x, y, r);
}

function grain(width, height, density, color, stroke) {
  const gfx = createGraphics(width, height);
  const ammount = width * height * density;
  for (let times = 0; times < ammount; times += 1) {
    const x = random(gfx.width);
    const y = random(gfx.height);
    strokeWeight(stroke);
    gfx.strokeWeight(stroke);
    gfx.stroke(color);
    gfx.point(x, y);
  }
  return gfx;
}

/**
 * Save image to disk.
 */
function save_image() {
  save(rand + ".png");
}
