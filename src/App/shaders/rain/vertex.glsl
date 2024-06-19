#include ../includes/worldUv.glsl

uniform float time;
uniform sampler2D perlinTexture;
uniform vec2 resolution;
uniform float dropSize;
uniform float height;
uniform float areaSize;
uniform float speed;

attribute vec3 custom;

varying vec2 groundUv;
varying float offsetY;
varying float cameraHorizontality;
varying float rippleSize;
varying float isFalling;
varying float isRippling;
varying float animRippleProgress;

void main() {
  // vec2 worldUv = getWorldUv(); // Might not work with particles

  groundUv = position.xz / areaSize + 0.5;

  vec4 newPos = vec4(position, 1.0);
  float timingOffset = texture(perlinTexture, groundUv).r * 2.0 * height;

  float speedNoise = texture(perlinTexture, groundUv).r - 0.25;
  float newSpeed = speed + speedNoise;

  float durationFall = 1.0;
  float durationRipple = .6;

  float durationTotal = durationFall + durationRipple;
  float animTotalProgress = mod(time + timingOffset, durationTotal); // [0, 13]

  isRippling = step(durationFall, animTotalProgress);
  isFalling = 1.0 - isRippling;

  // Final position
  float maxHeight = height - 0.1;

  float animFallProgress = animTotalProgress / durationFall;
  offsetY = 
    isFalling * (maxHeight + dropSize) * animFallProgress +
    isRippling * maxHeight;

  newPos.y -= offsetY;


  vec4 modelPosition = modelMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  gl_PointSize = dropSize * resolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  vec3 vPosition = modelPosition.xyz;
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  cameraHorizontality = abs(dot(viewDirection, vec3(0.0, 1.0, 0.0))); // [0, 1]


  float rippleNoise = texture(perlinTexture, groundUv).r * 2.0;

  animRippleProgress = (animTotalProgress - durationFall) / durationRipple;
  rippleSize = 1.25 * (1.0 - 1.0 / (animRippleProgress * 4.0 + 1.0));
  rippleSize *= rippleNoise;
}