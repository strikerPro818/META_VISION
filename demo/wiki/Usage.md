# Usage

`Human` library does not require special initialization  
All configuration is done in a single JSON object and all model weights are dynamically loaded upon their first usage  
(and only then, `Human` will not load weights that it doesn't need according to configuration).

[**Full API Specification**](https://vladmandic.github.io/human/typedoc/classes/Human.html)

<br>

## Detect

There is only *ONE* method you need:

```js
  const human = new Human(config?)         // create instance of human
  const result = await human.detect(input) // run detection
```

or if you want to use promises

```js
  human.detect(input, config?).then((result) => {
    // your code
  })
```

- [**Valid Inputs**](https://github.com/vladmandic/human/wiki/Inputs)
- [**Configuration Details**](https://github.com/vladmandic/human/wiki/Config)

If no other methods are called, `Human` will
1. select best detected engine
2. use default configuration
3. load required models
4. perform warmup operations
5. preprocess input
6. perform detection

<br>

## Results Caching and Smoothing

- By default, `Human` uses frame change detection for results caching  
- For on-screen display best results, it is recommended to use results smoothing 

For details, see <https://github.com/vladmandic/human/wiki/Caching

## Demos

`Human` library comes with number of **browser-based** and **nodejs-based** demo apps in `/demo` folder  
For details, see <https://github.com/vladmandic/human/wiki/Demos>

<br>

## Human Properties

`Human` library exposes several dynamically generated properties:

```js
human.version       // string containing version of human library
human.config        // access to current configuration object
                    // normally set during call to constructor or as parameter to detect()
human.result        // access to last known result object, normally returned via call to detect()
human.performance   // access to current performance counters
human.state         // <string> describing current operation in progress
                    // progresses through: 'config', 'check', 'backend', 'load', 'run:<model>', 'idle'
human.models        // dynamically maintained list of loaded models
human.env           // detected platform capabilities
human.events        // container for events dispateched by human
Human.defaults      // static property of Human class that contains default configuration
```

<br>

## Human Methods

### General

General purpose methods exposed by `Human`

```js
human.load(config?)         // explicitly call load method that loads configured models
human.image(input, config?) // runs image processing without detection and returns canvas and tensor
human.warmup(config?)       // warms up human library for faster initial execution after loading
human.next(result?)         // returns time variant smoothened/interpolated result based on last known result
```

### Utility 

Utility methods exposed by `Human` that can be used in advanced cases but are typically not needed

```js
human.init()                  // explict backend initialization
human.validate(config?)       // validate configuration values
human.reset()                 // reset current configuration to default values
human.now()                   // returns platform-independent timestamp, used for performance measurements
human.profile(input, config?) // runs detection with profiling enabled and returns information on top-20 kernels
human.compare(input1, input2) // runs pixel-compare on two different inputs and returns score
                              // internally used to detect frame-changes and cache validations
```

### TensorFlow

`Human` internally uses `TensorFlow/JS` for all ML processing  
Access to interal instance of `tfjs` used by `human` is possible via:

```js
human.tf                      // instance of tfjs used by human, can be embedded or externally loaded
```
### Face Recognition

Additional functions used for face recognition:  
For details, see [embedding documentation](https://github.com/vladmandic/human/wiki/Embedding)

```js
human.similarity(descriptor1, descriptor2) // runs similarity calculation between two provided embedding vectors
                                           // vectors for source and target must be previously detected using
                                           // face.description module
human.match(descriptor, descriptors)       // finds best match for current face in a provided list of faces
human.distance(descriptor1, descriptor2)   // checks algorithmic distance between two descriptors
                                           // opposite of `similarity`
human.enhance(face)                        // returns enhanced tensor of a previously detected face
                                           // that can be used for visualizations
```

### Input Segmentation and Backgroun Removal or Replacement

`Human` library can attempt to detect outlines of people in provided input and either remove background from input
or replace it with a user-provided background image

For details on parameters and return values see [API Documentation](https://vladmandic.github.io/human/typedoc/classes/Human.html#segmentation)

```js
  const input = document.getElementById('my-canvas);
  const background = document.getElementById('my-background);
  human.segmentation(input, background);
```

### Draw Functions

Additional helper functions inside `human.draw`:

```js
  human.draw.all(canvas, result)             // interpolates results for smoother operations
                                             // and triggers each individual draw operation
  human.draw.person(canvas, result)          // triggers unified person analysis and draws bounding box
  human.draw.canvas(inCanvas, outCanvas)     // simply copies one canvas to another,  
                                             // can be used to draw results.canvas to user canvas on page
  human.draw.face(canvas, results.face)      // draw face detection results to canvas
  human.draw.body(canvas, results.body)      // draw body detection results to canvas
  human.draw.hand(canvas, result.hand)       // draw hand detection results to canvas
  human.draw.object(canvas, result.object)   // draw object detection results to canvas
  human.draw.gesture(canvas, result.gesture) // draw detected gesture results to canvas
```

Style of drawing is configurable via `human.draw.options` object:

```js
  color: 'rgba(173, 216, 230, 0.3)',    // 'lightblue' with light alpha channel
  labelColor: 'rgba(173, 216, 230, 1)', // 'lightblue' with dark alpha channel
  shadowColor: 'black',                 // draw shadows underneath labels, set to blank to disable
  font: 'small-caps 16px "Segoe UI"',   // font used for labels
  lineHeight: 20,                       // spacing between lines for multi-line labels
  lineWidth: 6,                         // line width of drawn polygons
  drawPoints: true,                     // draw detected points in all objects
  pointSize: 2,                         // size of points
  drawLabels: true,                     // draw labels with detection results
  drawBoxes: true,                      // draw boxes around detected faces
  roundRect: 8,                         // should boxes have round corners and rounding value
  drawGestures: true,                   // should draw gestures in top-left part of the canvas
  drawGaze: true,                       // should draw gaze arrows
  drawPolygons: true,                   // draw polygons such as body and face mesh
  fillPolygons: false,                  // fill polygons in face mesh
  useDepth: true,                       // use z-axis value when available to determine color shade
  useCurves: false,                     // draw polygons and boxes using smooth curves instead of lines
```

<br>
