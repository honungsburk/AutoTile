// Set a linear gradient for the stroke
function strokeLinearGradient(x1, y1, x2, y2, col1, col2) {
  drawingContext.strokeStyle = linearGradient(x1, y1, x2, y2, col1, col2);
}

// Set a radial gradient for the stroke
function strokeRadialGradient(x, y, rStart, rStop, col1, col2) {
  drawingContext.strokeStyle = radialGradient(x, y, rStart, rStop, col1, col2);
}

// Set a linear gradient for the fill
function fillLinearGradient(x1, y1, x2, y2, col1, col2) {
  drawingContext.fillStyle = linearGradient(x1, y1, x2, y2, col1, col2);
}

// Set a radial gradient for the fill
function fillRadialGradient(x, y, rStart, rStop, col1, col2) {
  drawingContext.fillStyle = radialGradient(x, y, rStart, rStop, col1, col2);
}

// Create a linear gradient
function linearGradient(x1, y1, x2, y2, col1, col2) {
  let grad = drawingContext.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, col1);
  grad.addColorStop(1, col2);
  return grad;
}

// Create a radial gradient
function radialGradient(x, y, rStart, rStop, col1, col2) {
  let grad = drawingContext.createRadialGradient(x, y, rStart, x, y, rStop);
  grad.addColorStop(0, col1);
  grad.addColorStop(1, col2);
  return grad;
  drawingContext.fillStyle = grad;
}

// Set a shadow effect
function shadow(x, y, blur, col) {
  drawingContext.shadowOffsetX = x;
  drawingContext.shadowOffsetY = y;
  drawingContext.shadowBlur = blur;
  drawingContext.shadowColor = col;
}

// Cancel the shadow effect
function noShadow() {
  drawingContext.shadowOffsetX = null;
  drawingContext.shadowOffsetY = null;
  drawingContext.shadowBlur = null;
  drawingContext.shadowColor = null;
}
