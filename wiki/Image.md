# Input Processing

`Human` includes optional input pre-processing via `config.filter` configuration:
- using `Canvas` features
- using `WebGL` accelerated filters
- using `TFJS` accelerated enhancements

## Basic

If both width and height are set to 0, there is no resizing  
If just one is set, second one is scaled automatically  
If both are set, values are used as-is  

- `width`: resize input height
- `height`: resize input width  

Flip input as mirror image
  
- `flip`: boolean

## Filters

Global filters enabled/disabled is controlled via `config.filter.enabled`  
Individual filters that can be set are:

- `brightness`: -1 (darken) to 1 (lighten)
- `contrast`: -1 (reduce contrast) to 1 (increase contrast)
- `sharpness`: 0 (no sharpening) to 1 (maximum sharpening)
- `blur`: 0 (no blur) to N (blur radius in pixels)
- `saturation`: 1 (reduce saturation) to 1 (increase saturation)
- `hue`: 0 (no change) to 360 (hue rotation in degrees)
- `negative`: boolean
- `sepia`: boolean
- `vintage`: boolean
- `kodachrome`: boolean
- `technicolor`: boolean
- `polaroid`: boolean
- `pixelate`: 0 (no pixelate) to N (number of pixels to pixelate)

## Enhancements

If set, any input will be processed via histogram equalization to maximize color dynamic range to full spectrum

- `equalization`: boolean