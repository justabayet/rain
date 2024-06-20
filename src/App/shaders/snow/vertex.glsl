#include ../includes/worldUv.glsl
#include ../includes/remap.glsl

uniform float time;
uniform sampler2D perlinTexture;
uniform vec2 resolution;
uniform float dropSize;
uniform float height;
uniform float areaSize;
uniform float speed;

attribute float randomOffset;

varying vec2 groundUv;
varying float offsetY;
varying float isFalling;
varying float isFading;
varying float animFadeProgress;
varying float animFallProgress;

void main() {
  groundUv = position.xz / areaSize + 0.5;

  vec4 newPos = vec4(position, 1.0);

  float speedNoise = texture(perlinTexture, groundUv).r - 0.25;
  float newSpeed = speed + speedNoise * 2.0 * speed;

  float durationFall = 1.0 / newSpeed;
  float durationFade = 10.0;

  float durationTotal = durationFall + durationFade;
  float timingOffset = randomOffset * durationTotal;
  float animTotalProgress = mod(time + timingOffset, durationTotal);

  isFading = step(durationFall, animTotalProgress);
  isFalling = 1.0 - isFading;

  // Final position
  float maxHeight = height - 0.1 + dropSize * 0.5;

  animFallProgress = clamp(animTotalProgress / durationFall, 0.0, 1.0);
  offsetY = 
    isFalling * maxHeight * animFallProgress +
    isFading * maxHeight;

  newPos.y -= offsetY;

  float oscillationFactor = 1.0;
  vec2 oscillationNoise = vec2(
    texture(perlinTexture, vec2((time + timingOffset) / 20.0, 0.1)).r - 0.25,
    texture(perlinTexture, vec2((time + timingOffset) / 20.0, 0.2)).r - 0.25
  );
  float heightFactor = ((maxHeight - offsetY) / maxHeight);
  oscillationNoise *= heightFactor * oscillationFactor;

  newPos.xz += oscillationNoise;

  vec4 modelPosition = modelMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  gl_PointSize = dropSize * resolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);

  animFadeProgress = isFading * (animTotalProgress - durationFall) / durationFade;
}