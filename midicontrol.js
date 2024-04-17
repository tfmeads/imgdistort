
class MidiCtrl {
  
    constructor(cc, name, varName, defV){

        this.name = name;
        this.CC = cc;
        this.defaultVal = defV;
        this.val = this.defaultVal;
        this.lastVal = this.defaultVal;
        this.target = this.defaultVal;
        this.ccLo = 0; //low end of CC range
        this.ccHi = 127;//high end of CC range
        this.min = 0; //minimum mapped value
        this.max = 1; //maximum mapped value
        this.varName = varName; //name of variable in shader
        this.lastUpdate = 0;
        this.isBoolean = false; //determines whether CC is On/Off rather than 0-127
        this.active = false; //state of boolean
        this.lerp = true;
        this.lerpAmt = 0.1;
  
        this.midiInput = new MIDIInput();
        // Override onMIDIMessage callback with custom function
        this.midiInput.onMIDIMessage = this.onMIDIMessage.bind(this);   
        
        console.log("Loaded CC" + this.CC + " " + this.name);

      }


       
  

    
      onMIDIMessage(data) {
        var msg = new MIDI_Message(data.data);
      
        if(msg.note != this.CC){
          return;
        }
        else{
          console.log(this.name + " " + msg.velocity);
        }
    
        this.lastUpdate = millis();
      
        var cueMode = getCtrl(CC_CUE);
        
        if(cueMode.active && !this.isBoolean && !SKIP_CUE_CCS.includes(msg.note)){
          sleep(CUE_TIME).then(() => {
            if(millis() - this.lastUpdate > CUE_TIME){
              this.handleCC(msg);
            }
          })
        }
        else{
          this.handleCC(msg);
        }
      
      }

      handleCC(msg){
      
        if(this.isBoolean){
          if(msg.velocity > 0){
            this.active = !this.active;
            console.log(this.name + " " + (this.active ? "On" : "Off"));
          }
        }
        else{
          this.target = map(msg.velocity,this.ccLo,this.ccHi,this.min,this.max);
        }
      }

      updateShader(shader){
        if(this.varName == ''){return;}

        if(this.lerp){
          let val = lerp(this.lastVal, this.target, this.lerpAmt);
          this.lastVal = val;
          this.val = val;
        }
        else{
          this.val = this.target;
        }

        //console.log(this.varName + " => " + this.val);
        shader.setUniform(this.varName,this.val);
      }


  
  }

function getCtrl(cc){
  return ctrls[cc];
}

  // a custom 'sleep' or wait' function, that returns a Promise that resolves only after a timeout
function sleep(millisecondsDuration)
{
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  })
}