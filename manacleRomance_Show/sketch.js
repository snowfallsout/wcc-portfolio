//*TRY TO CLICK CANVAS～*
//*PRESS "SPACE" TO REDRAW*
//*PRESS "S" TO SAVE PICTURE*
//*MADE BY XUEYI HUANG(Snow)*
//*BACKGROUND PARTICULAR*
let particles=[];
let num = 200;
let noiseScale=0.01;
//*CIRCLE ON THE SURFACE*
let bubble1;
let bubble2;
let bubble3;

let b=0;

function setup() {
  createCanvas(700, 700);
  //*BACKGROUND COLOR*
  background(95,88,75);
  for(let i=0;i<num;i++){
    particles.push(createVector(random(width),random(height)));
  }
  let c1=color(38,38,39);
  let c2=color(66,74,94);
  let c3=color(197,81,0);
  bubble1 = new Bubble(width/2, height/2, 9,c1);
  bubble2 = new Bubble(width-100, height-100, 6,c2);
  bubble3 = new Bubble(width-400, height-400, 3,c3);
}

function draw() {
  
  for(let i=0;i<num;i++){
    let p=particles[i];
    stroke(245,230,200);
    // noFill();
    fill(245,230,200);
    strokeWeight(0.1);
    point(p.x,p.y);
    
    let n=noise(p.x*noiseScale,p.y*noiseScale);
    let a=TAU*n;
    p.x+=sin(a);
    p.y+=cos(a);
   
    if(!onScreen(p)){
      p.x=random(width);
      p.y=random(height);
    }
  }
 //*CIRCLES*
    let xoff=0;
  
 beginShape();
  for(let i=0;i<800;i+=50){
    let a=0;
    let j=noise(xoff,i)*height;
    let r=noise(i,j)*70;
    stroke(245,230,200,10);
    fill(245,230,200,10);
    ellipse(j,i,r*sin(b));
    noFill();
    stroke(245,230,200,255);
    point(j*sin(b),i);  
    a+=0.02;
  }
  endShape();
  xoff+=0.02;
      b+=0.1;
  
   bubble1.move();
   bubble1.show();
   bubble2.move();
   bubble2.show();
   bubble3.move();
   bubble3.show();
  
}
//*CIRCLE BRUSH*
class Bubble {
  constructor(x, y, r,c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }

  move() {
    this.x = this.x +  random(-8, 8);
    this.y = this.y + random(-8, 8);
     if(this.x>width||this.x<0||this.y>height||this.y<0){
      this.x=random(width);
      this.y=random(height);
    }
  }

  show() {
    noStroke();
    fill(this.c);
    ellipse(this.x, this.y, this.r * 2);
    stroke(245,230,200,100);
    line(this.x,0,this.x, this.y)
  }
}

function mouseReleased(){
  noiseSeed(millis());
}

function onScreen(v){
  return v.x>=0&&v.x<=width&&v.y>=0&&v.y<=height;
}
function onScreenB(x,y){
  return x>=0&&x<=width&&y>=0&&y<=height;
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
