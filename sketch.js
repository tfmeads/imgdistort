let distortShader;

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
const CC_RESTART = 24;
var lastRestart = 0;
const CC_CUE = 14;
const CUE_TIME = 333;
var CUE_MODE = false; //when true, wait until CC value stops changing to change actual value
var SKIP_CUE_CCS = [CC_CUE]; //holds CCs we don't want to be affected by Cueing

var ctrls = [];
var imgs = 
[
  {
    'file' : 'dog.jpeg',
    'x' : 0,
    'y' : 0
  },
  {
    'file' : 'eyetapestry.jpeg',
    'x' : 0,
    'y' : 555
  },
  {
    'file' : 'wormgirlcropped.jpg',
    'x' : 500,
    'y' : 100
  },
  {
    'file' : 'clown.jpg',
    'x' : 0,
    'y' : 0
  },
  {
    'file' : 'sunsetsky.jpg',
    'x' : 0,
    'y' : 0
  },
];
var img = imgs[0];

function preload() {
  // load in the shader
  distortShader = loadShader('basic.vert', 'distort.frag');

  // load in the image
  backgroundImage = loadImage(img.file);
}

function setup(){ 
  var canvas = createCanvas(windowWidth + img.x, windowHeight + img.y, WEBGL);
  canvas.position(-img.x,0);

  //temp MIDI controls
  var ctrl = new MidiCtrl(CC_ACCEL,'Acceleration','accel',3.3);
  ctrl.min = .1;
  ctrl.max = 20;

  ctrls[ctrl.CC] = ctrl;
  var ctrl = new MidiCtrl(CC_VELOCITY,'Velocity','velocity',.1);
  ctrl.lerp = false;
  ctrl.min = .1;
  ctrl.max = 5;

  ctrls[ctrl.CC] = ctrl;
  var ctrl = new MidiCtrl(CC_FADE,'Fade','fade',0);
  ctrl.min = 0;
  ctrl.max = 2;
  this.lerpAmt = .9;


  ctrls[ctrl.CC] = ctrl;
  var ctrl = new MidiCtrl(CC_SIZE_A,'Ray Size','raySize',0);
  ctrl.min = 0;
  ctrl.max = 3;

  ctrls[ctrl.CC] = ctrl;
  var ctrl = new MidiCtrl(CC_SIZE_B,'Ray Interval','clrInterval',77);
  ctrl.min = 18;
  ctrl.max = 162;

  ctrls[ctrl.CC] = ctrl;
  var ctrl = new MidiCtrl(CC_X1,'Divisions','divisions',1.2);
  ctrl.min = 1.2;
  ctrl.max = 12;

  ctrls[ctrl.CC] = ctrl;
  var ctrl = new MidiCtrl(CC_X2,'Scale','scale',1);
  ctrl.min = .1;
  ctrl.max = 1;

  ctrls[ctrl.CC] = ctrl;

  var cue = new MidiCtrl(CC_CUE,'CUE','',0);
  cue.isBoolean = true;
  ctrls[cue.CC] = cue;

  var cue = new MidiCtrl(CC_RESTART,'RESTART','',0);
  cue.isBoolean = true;
  ctrls[cue.CC] = cue;

  //TODO LOAD CONTROLS FROM JSON

  shader(distortShader);
  
  distortShader.setUniform("background", backgroundImage);
  distortShader.setUniform("iResolution",[windowWidth,windowHeight]);
}

function draw() {  
  ctrl = getCtrl(CC_RESTART);
  if(ctrl.active){
    lastRestart = millis();
    ctrl.active = false;
  }

  distortShader.setUniform("millis", millis() - lastRestart);

  ctrls.forEach((element) => element.updateShader(distortShader));

  // Run shader
  rect(-width/2, -height/2, width);
}


