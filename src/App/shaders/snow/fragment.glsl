#include ../includes/remap.glsl

uniform float time;
uniform vec3 snowInnerColor;
uniform vec3 snowOuterColor;
uniform float opacity;
uniform sampler2D perlinTexture;

varying float offsetY;
varying float animFadeProgress;
varying float animFallProgress;

void main() {
    vec2 uv = gl_PointCoord;

    float distanceToCenter = length(uv - vec2(0.5));

    float sizeOffset = texture(perlinTexture, uv + (offsetY + time) / 15.0).r * 2.0;
    if(distanceToCenter > 0.5 - 0.2 * sizeOffset)
        discard;

    float radialFactor = remapReciprocal(1.0 - distanceToCenter * 2.0, 1.0);
    vec3 color = mix(snowOuterColor, snowInnerColor, radialFactor);

    float groundOpacity = 1.0 - pow(animFadeProgress, 2.0);

    float stepAppearance = 0.1;
    float isAppearing = 1.0 - step(stepAppearance, animFallProgress);
    float cloudOpacity = 1.0 - isAppearing * (1.0 - (animFallProgress / stepAppearance));

    // 0.0 1.0 1.0
    // 0.0 0.1 ...
    gl_FragColor = vec4(color, opacity * groundOpacity * cloudOpacity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}