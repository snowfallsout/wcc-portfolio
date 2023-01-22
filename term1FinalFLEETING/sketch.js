//*FLEETING (Body Interaction)*
//*MADE BY XUEYI HUANG(Snow)*

//*REFERENCED:
/* Example 1.11 page 59
   Array of movers accelerating towards the mouse 
   From "The Natur of Code" by Daniel Shiffman, 2012
   www.natureofcode.com */
/* ml5 Example
   PoseNet example using p5.js */
/* Noise Effects 
   dailycoding - 20221126 / graphic
   by E.C.H (Eiichi Ishii)
   https://openprocessing.org/sketch/1753295 */

//*PRESS "SPACE" TO REDRAW*
//*HANDS CROSSED TO RESET THE PARTICULAR*
//*PRESS "S" TO SAVE PICTURE*

//*READY FOR CAMERA*
let video;
let poseNet;
let pose;
let skeleton;
let num = 1;

//*CHANGE COLOR HERE*
const palette = ["#0000007F","#000000A8","#000000BF","#FFFFFF89","#FFFFFF3D","#DB462891","#25454E91",
];
//*movers FOR NOSE*
let movers = [];
let numMovers = 0;
//*moversB FOR LEFTHAND*
let moversB = [];
let numMoversB = 12;
//*moversB FOR RIGHTHAND*
let moversC = [];
let numMoversC = 12;

function setup() {
  createCanvas(640, 480);
  bamboo = createGraphics(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  angleMode(DEGREES);
  background(220, 220, 217);

  for (let i = 0; i < numMovers; i++) {
    movers[i] = new Mover();
  }
  for (let i = 0; i < numMoversB; i++) {
    moversB[i] = new Mover();
  }
  for (let i = 0; i < numMoversC; i++) {
    moversC[i] = new Mover();
  }
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  //image(video, 0, 0, video.width, video.height);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    push();
    drawNoise();
    pop();

    push();
    strokeWeight(random(7));
    noStroke();
    fill(random(palette));
    ellipse(random(width), random(height), random(5), random(5));
    pop();

    //drawKeypoints();
    //drawSkeleton();
    blendMode(OVERLAY);
    for (let i = 0; i < numMovers; i++) {
      movers[i].update(pose.nose.x, pose.nose.y);
      // movers[i].update(pose.leftWrist.x,pose.leftWrist.y);
      //movers[i].update(pose.rightWrist.x,pose.rightWrist.y);
      movers[i].display();
      movers[i].checkEdges();
    }
    for (let i = 0; i < numMoversB; i++) {
      moversB[i].update(pose.leftWrist.x, pose.leftWrist.y);
      moversB[i].display();
      moversB[i].checkEdges();
    }
    for (let i = 0; i < numMoversC; i++) {
      moversC[i].update(pose.rightWrist.x, pose.rightWrist.y);
      moversC[i].display();
      moversC[i].checkEdges();
    }
    let handL = pose.leftWrist;
    let handR = pose.rightWrist;
    let d2 = dist(handL.x, handL.y, handR.x, handR.y);

    push();
    blendMode(BLEND);
    if (d2 < d * 2) {
      drawClear();
    }
  }
  if (frameCount % 10 == 0) drawFog(); // only draw the fog evey 16 frames
  pop();
}
//*DRAW KEYPOINTS DEBUG*
function drawKeypoints() {
  for (let i = 0; i < pose.keypoints.length; i++) {
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    noStroke();
    fill(198, 73, 18);
    if (random(1) < 0.999) {
      ellipse(x, y, random(6), random(6));
    } else {
      ellipse(x, y, random(10), random(20, 70));
    }
  }
}
//*DRAW SKELETON DEBUG*
function drawSkeleton() {
  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];
    strokeWeight(2);
    stroke(255);
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }
}
//*SLOWLY CLEAR*
function drawFog() {
  push();
  fill(220, 220, 217, 15);
  noStroke();
  rect(0, 0, width, height);
  pop();
}
//*TOTALLY CLEAR*
function drawClear() {
  push();
  fill(220, 220, 217);
  noStroke();
  rect(0, 0, width, height);
  pop();
}
//*CREATE PARTICULAR*
class Mover {
  constructor() {
    this.acceleration = createVector();
    this.velocity = createVector(0, 0);
    this.pos = createVector(random(width), random(height));
    this.topSpeed = 4;
    this.size = random(1, 35);
    let c1 = palette;
    this.color = random(c1);
  }

  update(_x, _y) {
    let pPos, dir;
    this.xPos = _x;
    this.yPos = _y;
    if (pose) {
      pPos = createVector(this.xPos, this.yPos);
      let eyeR = pose.rightEye;
      let eyeL = pose.leftEye;
      let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
      let handL = pose.leftWrist;
      let handR = pose.rightWrist;
      let d2 = dist(handL.x, handL.y, handR.x, handR.y);

      if (d2 < d * 2) {
        this.pos = createVector(random(width), random(height));
      }
    } else {
      //mouse = createVector(mouseX, mouseY);
      pPos = createVector(random(width), random(height));
    }
    dir = p5.Vector.sub(pPos, this.pos);
    dir.normalize();
    dir.mult(0.1);
    this.acceleration = dir;

    this.velocity.add(this.acceleration);
    this.velocity.limit(this.topSpeed);
    this.pos.add(this.velocity);
  }

  display(_col) {
    noStroke();
    fill(this.color);
    let tang = abs(tan(frameCount));
    let rad = map(tang, 0, 4, 2, this.size, true);
    ellipse(this.pos.x, this.pos.y, rad);

    push();
    strokeWeight(0.9);
    stroke(5, 20);
    line(this.pos.x, this.pos.y, this.xPos, this.yPos);
    pop();
  }

  checkEdges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    } else if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    } else if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }
}
//*CREATE PAPER NOISE*
function drawNoise() {
  for (let h = 0; h < num; h++) {
    stroke(random([0, 255]), 50);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let i = 0; i < num; i++) {
      let posx = random(width);
      let posy = random(width);
      curveVertex(posx, posy);

      let r = random(width / 20, width / 5);
      let sw = int(random(2, 20));
      for (let j = 0; j < 100; j++) {
        let sq = sqrt(random(1));
        let angle = random(360);
        let v;
        if (int(random(sw)) == 0) {
          v = random(2, 4);
        } else {
          v = 1;
        }
        curveVertex(
          posx + sq * r * v * cos(angle),
          posy + sq * r * v * sin(angle)
        );
      }
    }
    endShape();
  }
  //noLoop();
}

function keyPressed() {
  if (key == "space") {
    redraw();
  }
  // If you hit the s key, save an image
  if (key == "s") {
    save("myPhoto.png");
  }
}
