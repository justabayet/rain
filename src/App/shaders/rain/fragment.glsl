uniform vec3 rainColor;
uniform float dropWidth;
uniform float opacity;
uniform float height;

varying vec2 groundUv;
varying float currentY;

void main() {
    vec2 uv = gl_PointCoord;
    if(uv.x > 0.5 + dropWidth / 2.0 || uv.x < 0.5 - dropWidth / 2.0)
        discard;
    if(currentY < 1.0 || currentY > height)
        discard;
    gl_FragColor = vec4(rainColor, opacity);
    // gl_FragColor = vec4(uv, 1.0, .7);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}