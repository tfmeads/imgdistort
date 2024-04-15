precision mediump float;

varying vec2 pos;

uniform sampler2D background;
uniform vec2 iResolution;
uniform float millis;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  
  vec2 newPos = pos;
  float waitTime = 5555.;
  float time = millis > waitTime ? smoothstep(0.,waitTime,mod(millis - waitTime,waitTime)) : 0.;
  vec2 uv = (gl_FragCoord.xy * 2. - iResolution.xy) / iResolution.y;

  // flip y axis
  newPos.y = 1. - newPos.y;

  vec2 warp = (sin(newPos * 33.)/7.) * 1.2 * (atan(mod(millis/3333.,inversesqrt( newPos.y * 2. *mix(min(pos.x ,pos.y),max(pos.x,pos.y),uv.y)))) / uv.x * uv.y );

  // warp position
  newPos = newPos - warp;

  newPos = fract(newPos);
  
  
  // read colour from image
  vec4 col = texture2D(background, newPos);
  vec4 col2 =  texture2D(background, 1. - newPos + 5. * warp + sin(time / uv.y * uv.x) / 5. * 1. - uv.y * 10.);

  
  gl_FragColor = mix(col,col2, -.3 + .05 * tan(millis/ 11111. /  uv.y * uv.x));
}
