# Inputs

- In **Browser** environments, actual browser provides functionality of decoding inputs (e.g. JPG image or MP4 video)
- In **NodeJS** environments, decoding must be performed manually

<br>

## Valid Inputs in Browser Environments

`Human` allows input to be in many different formats and will perform automatic processing of inputs to interally required format

```ts
type Input = Tensor | AnyCanvas | AnyImage | AnyVideo | ImageObjects | ExternalCanvas;
type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;
type AnyImage = HTMLImageElement | typeof Image
type AnyVideo = HTMLMediaElement | HTMLVideoElement
type ImageObjects = ImageData | ImageBitmap
type ExternalCanvas = typeof env.Canvas | typeof globalThis.Canvas;
```

<br>

## Examples of Input processing in NodeJS

### 1. Using decode functionality from `tfjs-node`:

All primary functionality of `Human` is available, but `human.draw` methods cannot be used as `canvas` implementation is not present

```js
const tf = require('@tensorflow/tfjs-node');
const buffer = fs.readFileSync(inputFile); // read file content into a binary buffer
const tensor = human.tf.node.decodeImage(buffer); // decode jpg/png data to raw pixels
const result = await human.detect(tensor); // perform processing
human.tf.dispose(tensor); // dispose input data, required when working with tensors
```

*Note:* For all processing, correct input tensor **shape** `[1, height, width, 3]` and **dtype** `float32`
- 1 means batch number and is a fixed value
- 3 means number of channels so 3 is used for RGB format  

However `Human` will automatically convert input tensor to a correct shape
- if batch number is omitted
- if input image is 4-channels such as in **RGBA** images with alpha channel
- if input tensor is in different data type such as `int32`


### 2. Using Canvas functionality from `node-canvas`

By instructing `Human` to use 3rd party module for `canvas` operations  
This method allows `Human` to use `human.draw.*` methods in **NodeJS**

```js
const canvas = require('canvas');
globalThis.Canvas = canvas.Canvas; // patch global namespace with canvas library
globalThis.ImageData = canvas.ImageData; // patch global namespace with canvas library
// human.env.Canvas = canvas.Canvas; // alternatively monkey-patch human to use external canvas library
// human.env.ImageData = canvas.ImageData; // alternatively monkey-patch human to use external canvas library
const inputImage = await canvas.loadImage(inputFile); // load image using canvas library
const inputCanvas = new canvas.Canvas(inputImage.width, inputImage.height); // create canvas
const ctx = inputCanvas.getContext('2d');
ctx.drawImage(inputImage, 0, 0); // draw input image onto canvas
const result = await human.detect(inputCanvas);
```

### 3. Using Canvas functionality from `node-canvas`

Using `node-canvas` to load and decode input files only

```js
const canvas = require('canvas');
const img = await canvas.loadImage(inputFile); // read and decode image file
const canvas = canvas.createCanvas(img.width, img.height); // create canvas element
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, img.width, img.height); // draw loaded image onto canvas
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // read pixel data from canvas
const tensor = human.tf.tensor(imageData.data); // create tensor from pixel data
const result = await human.detect(tensor); // perform processing
human.tf.dispose(tensor); // dispose input data, required when working with tensors
```
