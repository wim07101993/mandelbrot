#include <flutter/runtime_effect.glsl>

uniform vec2 resolution;
uniform vec2 centerCoordinate;
uniform float zoom;

out vec4 fragColor;

#define PI 3.1415926535897932384626433832795
#define MAX_ITERATIONS 100
#define ComplexNumber vec2

vec4 iterationsToColor(int iterations) {
    const vec4 color0 = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    const vec4 color1 = vec4(0.0f, 0.2f, 0.5f, 1.0f);
    const vec4 color2 = vec4(1.0f, 0.8f, 0.0f, 1.0f);
    const vec4 color3 = vec4(1.0f, 0.0f, 0.4f, 1.0f);
    const vec4 colorRanges = vec4(0.1f, 0.2f, 0.4f, 1.0f);

    if (iterations == MAX_ITERATIONS)
    {
        return vec4(0.0f, 0.0f, 0.0f, 1.0f);
    }

    float iterationFraction = float(iterations) / float(MAX_ITERATIONS);

    float fraction = 0.0f;
    if (iterationFraction < colorRanges[1])
    {
        fraction = (iterationFraction - colorRanges[0]) / (colorRanges[1] - colorRanges[0]);
        return mix(color0, color1, fraction);
    }
    else if (iterationFraction < colorRanges[2])
    {
        fraction = (iterationFraction - colorRanges[1]) / (colorRanges[2] - colorRanges[1]);
        return mix(color1, color2, fraction);
    }
    else
    {
        fraction = (iterationFraction - colorRanges[2]) / (colorRanges[3] - colorRanges[2]);
        return mix(color2, color3, fraction);
    }
}

// Calculates the square of a complex number according to the formula:
//   z^2 = x^2 - y^2 + 2xyi
// or in vector representation
//   z^2 = (x^2 - y^2, 2xy)
vec2 square(ComplexNumber z) {
    return ComplexNumber(z.x * z.x - z.y * z.y, 2 * z.x * z.y);
}

// Calculates the value of a single point in the Mandelbrot set
int calculateMandelbrotIterations(ComplexNumber c) {
    ComplexNumber z = ComplexNumber(0.0f, 0.0f);
    for (int i = 0; i < MAX_ITERATIONS; i++) {
        z = square(z) + c;

        // the length function calculates the modulus of a vactor
        if (length(z) > 2) {
            return i;
        }
    }

    return MAX_ITERATIONS;
}

vec2 getMandelbrotCoordinate() {
    vec2 fragCoord = FlutterFragCoord();

    float aspectRatio = resolution.x / resolution.y;
    // for this shader we keep the range of the set as a square of with limits
    //   - imaginary: -1.25 -> 1.25
    //   - reel: -2 -> 0.5
    const float mandelbrotRange = 2.5;
    // center y of the mandlebrot set is at 0 (it is symmetric around the imaginary axis)
    // center x of the mandlebrot set is at -0.75 (range is -2 -> 0.5 => -2 + (2+5)/2)
    const vec2 mandelbrotOffset = vec2(-2.0 + (2.5)/2, 0);

    // ensure the set fits within the image frame
    float scale;
    if (aspectRatio < 1) {
        scale = resolution.x / mandelbrotRange;
    } else {
        scale = resolution.y / mandelbrotRange;
    }

    //ensure the set is located at the center of the image frame
    vec2 imageCenter = resolution / 2 / scale;
    vec2 offset = mandelbrotOffset - imageCenter;

    return (fragCoord / scale + offset) * zoom;
}

void main(void) {
    vec2 c = getMandelbrotCoordinate();

    int iterations = calculateMandelbrotIterations(c);
    fragColor = iterationsToColor(iterations);
//        fragColor = vec4(0.318, 0.373, 1.000, 1.000);
}
