uniform vec3 rainColor;

void main() {
    gl_FragColor = vec4(rainColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}