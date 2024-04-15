let exampleShader;

let backgroundImage;

function preload() {
  // load in the shader
  exampleShader = loadShader('example.vert', 'example.frag');
  // load in the image
  backgroundImage = loadImage('dog.jpeg');

  backgroundImage = loadImage('wormgirlcropped.jpg');
}

function setup(){ 
  var canvas = createCanvas(windowWidth + 500, windowHeight + 100, WEBGL);
  canvas.position(-500,0);
  shader(exampleShader);
  
  exampleShader.setUniform("background", backgroundImage);
  exampleShader.setUniform("iResolution",[windowWidth,windowHeight]);
}

function draw() {
  exampleShader.setUniform("millis", millis());
  // Run shader
  rect(-width/2, -height/2, width);
}