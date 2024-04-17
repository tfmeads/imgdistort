let exampleShader;

let backgroundImage;


const CC_VELOCITY = 41;
var velocity = .1;
const CC_ACCEL = 42;
var acceleration = 3;
var lastAcc = acceleration;
const CC_FADE = 61;
var fade = 0;
const CC_SIZE_A = 51;
var size_a =  0;
const CC_SIZE_B = 52;
var size_b = 77;
const CC_X1 = 43;
var X1 = 1.2;
const X1_MIN = 1.2;
const X1_MAX = 12;
const CC_X2 = 44;
var X2 = 1;
const CC_EVIL = 24;
var evilMode = false;
const CC_CUE = 14;
const CUE_TIME = 333;
var CUE_MODE = false; //when true, wait until CC value stops changing to change actual value
var SKIP_CUE_CCS = [CC_CUE]; //holds CCs we don't want to be affected by Cueing

var ctrls = [];

function preload() {
  // load in the shader
  exampleShader = loadShader('basic.vert', 'distort.frag');

  // load in the image

  //backgroundImage = loadImage('dog.jpeg');
  backgroundImage = loadImage('wormgirlcropped.jpg');
}



function setup(){ 
  var canvas = createCanvas(windowWidth + 500, windowHeight + 100, WEBGL);
  canvas.position(-500,0);

  //temp MIDI controls
  var acc = new MidiCtrl(CC_ACCEL,'Acceleration','accel',3.3);
  acc.min = .1;
  acc.max = 20;

  ctrls[acc.CC] = acc;
  var acc = new MidiCtrl(CC_VELOCITY,'Velocity','velocity',.1);
  acc.min = .1;
  acc.max = 5;

  ctrls[acc.CC] = acc;
  var acc = new MidiCtrl(CC_FADE,'Fade','fade',0);
  acc.min = 0;
  acc.max = 2;

  ctrls[acc.CC] = acc;
  var acc = new MidiCtrl(CC_SIZE_A,'Ray Size','raySize',0);
  acc.min = 0;
  acc.max = 3;

  ctrls[acc.CC] = acc;
  var acc = new MidiCtrl(CC_SIZE_B,'Ray Interval','clrInterval',77);
  acc.min = 18;
  acc.max = 162;

  ctrls[acc.CC] = acc;
  var acc = new MidiCtrl(CC_X1,'Divisions','divisions',1.2);
  acc.min = 1.2;
  acc.max = 12;

  ctrls[acc.CC] = acc;
  var acc = new MidiCtrl(CC_X2,'Scale','scale',1);
  acc.min = .1;
  acc.max = 1;

  ctrls[acc.CC] = acc;

  var cue = new MidiCtrl(CC_CUE,'CUE','',0);
  cue.isBoolean = true;
  ctrls[cue.CC] = cue;

  //TODO LOAD CONTROLS FROM JSON

  shader(exampleShader);
  
  exampleShader.setUniform("background", backgroundImage);
  exampleShader.setUniform("iResolution",[windowWidth,windowHeight]);
}

function draw() {
  exampleShader.setUniform("millis", millis() % 30000);
  // exampleShader.setUniform("clrInterval",size_b);
  // exampleShader.setUniform("raySize",size_a);

  ctrls.forEach((element) => element.updateShader(exampleShader));



  // let ctrl = getCtrl(CC_ACCEL);

  // exampleShader.setUniform(ctrl.varName,ctrl.val);


  // exampleShader.setUniform("velocity",velocity);
  // exampleShader.setUniform("divisions",X1);
  // exampleShader.setUniform("scale",X2);
  // exampleShader.setUniform("fade",fade);


  // Run shader
  rect(-width/2, -height/2, width);
}


