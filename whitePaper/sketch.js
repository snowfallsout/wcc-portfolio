// Fractal Tree Drawing
// 20221126 Xueyi Huang
// Reference:https://thecodingtrain.com/challenges/14-fractal-trees-recursive
//https://editor.p5js.org/joemcalister/sketches/6v-N3urTT
// https://editor.p5js.org/codingtrain/sketches/xTjmYXU3q

let angle = 0;

function setup() {
  createCanvas(620, 620);
  background(255);
}

function draw() {
  if (frameCount % 400 == 0) drawBackground(); // only clear the canvas
  drawTree();
  let a = frameCount % 400;
  //Change the angle to create different shape
  //angle = map(a, 0, 300, PI / 4, 0, true);
  //Also you can use mouseX to draw
  angle = map(mouseX,0,width,PI/4, -PI/4);
  length = map(a, 0, 300, 10, height / 3.2, true);

  stroke(0, 15);
  fill(0, 5);
  strokeWeight(1);
  translate(width * 0.5, height);
  branch(length);
}

// Background over the entire window
function drawBackground() {
  push();
  fill(255);
  noStroke();
  rect(0, 0, width, height);
  pop();
}
//Draw many trees on the background
function drawTree() {
  //Length of backgroud trees
  let bLen = random(20, 200);
  //let bAng = -PI * 0.5;
  push();
  translate(random(width), height);
  stroke(0, 10);
  fill(0, 5);
  branch(bLen); 
  pop();
}
//Draw a Fractal Tree
function branch(len) {
  strokeWeight(sqrt(len) * 0.5);

  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 5) {
    push();
    rotate(angle);
    branch(len * 0.67);
    pop();
    push();
    rotate(-angle);
    branch(len * 0.67);
    pop();
  } else {
  }
}
// Press s to save image
function keyPressed() {
  // If you hit the s key, save an image
  if (key == "s") {
    save("mySketch.png");
  }
}
