let exampleShader;

let backgroundImage;


const CC_VELOCITY = 41;
var velocity = .1;
const CC_ACCEL = 42;
var acceleration = 3;
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
var CUE_CC = false; //when true, wait until CC value stops changing to change actual value
var last_cc = [];
var SKIP_CUE_CCS = [CC_CUE]; //holds CCs we don't want to be affected by Cueing


function preload() {
  // load in the shader
  exampleShader = loadShader('example.vert', 'example.frag');
  // load in the image
  backgroundImage = loadImage('dog.jpeg');

  backgroundImage = loadImage('wormgirlcropped.jpg');
}

function onMIDIMessage(data) {
  msg = new MIDI_Message(data.data);

  last_cc[msg.note] = millis();

  if(CUE_CC && !SKIP_CUE_CCS.includes(msg.note)){
    sleep(CUE_TIME).then(function(){
      if(millis() - last_cc[msg.note] > CUE_TIME){
        handleCC(msg);
      }
    })
  }
  else{
    handleCC(msg);
  }

}

function handleCC(msg){

  switch(msg.note){
    case CC_VELOCITY:
      velocity =n = map(msg.velocity,0,127,.1,5);

      console.log("Velocity " + velocity);
      break;
    case CC_ACCEL:
      acceleration = map(msg.velocity,0,127,.1,4);
      console.log("acceleration " + acceleration);
      break;
    case CC_FADE:
      fade =  map(msg.velocity,0,127,0,2);
      console.log("FADE " + msg.velocity);
      break;
    case CC_SIZE_A:
      size_a = map(msg.velocity,0,127,0,3);
      console.log("size_a " + size_a);
      break;
    case CC_SIZE_B:
      size_b = map(msg.velocity,0,127,18,162);
      console.log("size_b " + size_b);
      break;
    case CC_X1:
      X1 = map(msg.velocity,0,127,X1_MIN,X1_MAX);
      console.log("x1 " + msg.velocity);
      break;
    case CC_X2:
      X2 = map(msg.velocity,0,127,.1,1);
      console.log("x2 " + msg.velocity);
      break;
    case CC_CUE:
      if(msg.velocity > 0){
        CUE_CC = !CUE_CC;
        console.log("Cue " + (CUE_CC ? "On" : "Off"));
      }
      break;

    case CC_EVIL:
      if(msg.velocity > 0){
        evilMode = !evilMode;
        console.log("Evil " + (evilMode ? "On" : "Off"));
      }
      break;



    default:
      console.log(msg.note + " " + msg.velocity);
  }
}


function setup(){ 
  var canvas = createCanvas(windowWidth + 500, windowHeight + 100, WEBGL);
  canvas.position(-500,0);


  midiInput = new MIDIInput();
  // Override onMIDIMessage callback with custom function
  midiInput.onMIDIMessage = onMIDIMessage;

  shader(exampleShader);
  
  exampleShader.setUniform("background", backgroundImage);
  exampleShader.setUniform("iResolution",[windowWidth,windowHeight]);
}

function draw() {
  exampleShader.setUniform("millis", millis());
  exampleShader.setUniform("clrInterval",size_b);
  exampleShader.setUniform("raySize",size_a);
  exampleShader.setUniform("accel",acceleration);
  exampleShader.setUniform("velocity",velocity);
  exampleShader.setUniform("divisions",X1);
  exampleShader.setUniform("scale",X2);
  exampleShader.setUniform("fade",fade);
  exampleShader.setUniform("evilMode",evilMode ? 1 : -1);



  // Run shader
  rect(-width/2, -height/2, width);
}


// a custom 'sleep' or wait' function, that returns a Promise that resolves only after a timeout
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}