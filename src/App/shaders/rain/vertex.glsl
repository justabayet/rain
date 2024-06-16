#include ../includes/worldUv.glsl

uniform float time;
uniform sampler2D perlinTexture;
uniform vec2 resolution;

void main() {
  // vec2 worldUv = getWorldUv(); // Might not work with particles

  // Final position
  vec4 newPos = vec4(position, 1.0);
  vec4 modelPosition = modelMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  // Point size
  gl_PointSize = 0.3 * resolution.y;
  gl_PointSize *= (1.0 / - viewPosition.z);
}