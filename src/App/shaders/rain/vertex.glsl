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
varying float currentY;

void main() {
  // vec2 worldUv = getWorldUv(); // Might not work with particles

  groundUv = position.xz / areaSize + 0.5;

  float speedNoise = texture(perlinTexture, groundUv).r - 0.25;
  float newSpeed = speed + speedNoise;

  // Final position
  vec4 newPos = vec4(position, 1.0);
  float timingOffset = texture(perlinTexture, groundUv).r * 2.0;
  currentY = mod(time * newSpeed + (timingOffset * height), height + dropSize);
  newPos.y -= currentY;
  vec4 modelPosition = modelMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  gl_PointSize = dropSize * resolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);
}