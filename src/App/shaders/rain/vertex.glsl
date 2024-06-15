#include ../includes/worldUv.glsl

uniform float time;
uniform sampler2D perlinTexture;

void main() {
  vec2 worldUv = getWorldUv();

  vec4 newPos = vec4(position, 1.0);
  vec4 modelPosition = modelMatrix * newPos;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}