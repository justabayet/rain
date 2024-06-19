uniform vec3 rainColor;
uniform float dropWidth;
uniform float opacity;
uniform float opacityRipple;
uniform float height;
uniform float rippleThickness;

varying vec2 groundUv;
varying float offsetY;
varying float cameraHorizontality;
varying float rippleSize;
varying float isFalling;
varying float isRippling;
varying float animRippleProgress;

void main() {
    vec2 uv = gl_PointCoord;

    if(isFalling == 1.0) {
        if(uv.x > 0.5 + dropWidth / 2.0 || uv.x < 0.5 - dropWidth / 2.0)
            discard;

        float fragY = offsetY + (1.0 - uv.y);
        if(fragY < 1.0 || fragY > height)
            discard;

        if(uv.y < cameraHorizontality && uv.y > 0.2)
            discard;

    } else {
        vec2 coord = uv - 0.5;
        
        coord.y *= 1.0 / cameraHorizontality;

        coord *= 1.0 / rippleSize;

        float distanceToCenter = length(coord - vec2(0.0));

        if(distanceToCenter > 0.5 || distanceToCenter < 0.5 - rippleThickness)
            discard;
    }

    float newOpacity = 
        isRippling * opacityRipple * (1.0 - animRippleProgress) +
        isFalling * opacity;

    gl_FragColor = vec4(rainColor, newOpacity);
    // gl_FragColor = vec4(uv, 1.0, .7);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}