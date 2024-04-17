precision mediump float;

varying vec2 pos;

uniform sampler2D background;
uniform vec2 iResolution;
uniform float millis;
uniform float raySize;
uniform float clrInterval;
uniform float evilMode;
uniform float accel;
uniform float velocity;
uniform float divisions;
uniform float scale;
uniform float fade;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  
  vec2 newPos = pos;

  vec2 uv = (gl_FragCoord.xy * 2. - iResolution.xy) / iResolution.y;

  // flip y axis
  newPos.y = 1. - newPos.y;

  // warp position
  vec2 cosWarp = (cos(newPos * 33. * scale)/7. * scale) * divisions * (atan(mod(millis/5555. * accel,inversesqrt( newPos.y * 2. * mix(min(pos.x ,pos.y),max(pos.x,pos.y),uv.y)))) / uv.x * uv.y );
  vec2 tanWarp = (tan(newPos * 33. * scale)/7. * scale) * divisions * (atan(mod(millis/5555. * accel,inversesqrt( newPos.y * 2. * mix(min(pos.x ,pos.y),max(pos.x,pos.y),uv.y)))) / uv.x * - uv.y );

  vec2 warp = mix(cosWarp,tanWarp,fade);
  newPos = newPos - warp;

  newPos = fract(newPos);
  
  
  // read colour from image
  vec4 col = texture2D(background, newPos);
  vec4 col2 =  texture2D(background, 1. - newPos + 5. * warp + sin(millis / uv.y * uv.x) / 5. * 1. - uv.y * 10.);

  float clrTime = mod(millis/ 111. * velocity,clrInterval) - clrInterval / 2.;
  

  gl_FragColor = mix(col,col2, -.3 + raySize * mod(abs(tan(clrTime /  -uv.y * uv.x)),111.));
  
  
  //gl_FragColor = mix(col,col2, -.3 + raySize * tan(mod(millis/ 1111.,11.) /  uv.y * uv.x));
}


