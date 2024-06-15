vec2 getWorldUv() {
  vec4 newPos = vec4(position, 1.0);
  vec4 worldPos = modelMatrix * newPos;
  vec2 worldUv = worldPos.xz;

  return worldUv;
}