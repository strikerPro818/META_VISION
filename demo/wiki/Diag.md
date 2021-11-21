# Diagnostics

## Get human version
```js
console.log(human.version);
```
```
2.2.0
```

## Enable console debug output
```js
const human = new Human({ debug: true })
```

## Get current configuration
```js
console.log(human.config)
```
```js
{
  backend: 'tensorflow',
  modelBasePath: 'file://models/',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.9.0/dist/',
  debug: true,
  ...
}
```

## Get current environment details
```js
console.log(human.env)
```
```json
{
  "browser": true,
  "node": false,
  "worker": false,
  "platform": "Windows NT 10.0; Win64; x64",
  "agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/95.0.4629.0 Safari/537.36 Edg/95.0.1011.0",
  "backends": ["cpu","webgl","wasm"],
  "tfjs": {"version":"3.9.0"},
  "wasm": {"supported":true,"simd":true,"multithread":true},
  "webgl": {"supported":true,"version":"WebGL 2.0 (OpenGL ES 3.0 Chromium)","renderer":"WebKit WebGL"},
  "webgpu": {"supported":true,"adapter":"Default"},
  "kernels": [...]
}
```

## Get list of all models
```js
  const models = Object.keys(human.models).map((model) => ({ name: model, loaded: (human.models[model] !== null) }));
  console.log(models);
```
```js
[
  { name: 'face', loaded: true },
  { name: 'posenet', loaded: false },
  { name: 'blazepose', loaded: false },
  { name: 'efficientpose', loaded: false },
  { name: 'movenet', loaded: true },
  { name: 'handpose', loaded: true },
  { name: 'age', loaded: false },
  { name: 'gender', loaded: false },
  { name: 'emotion', loaded: true },
  { name: 'embedding', loaded: false },
  { name: 'nanodet', loaded: false },
  { name: 'centernet', loaded: false },
  { name: 'faceres', loaded: true },
  { name: 'segmentation', loaded: false },
]
```

## Get memory usage information
```js
  console.log(human.tf.engine().memory()));
```

```js
{
  numTensors: 1053, numDataBuffers: 1053, numBytes: 42736024
}
```

## Get current TensorFlow flags
```js
  console.log(human.tf.ENV.flags);
```
```js
{
  DEBUG: false, PROD: true, CPU_HANDOFF_SIZE_THRESHOLD: 128
}
```

## Get performance information

```js
  const result = await human.detect(input);
  console.log(result.performance);
```
```js
  {
    backend: 1, load: 283, image: 1, frames: 1, cached: 0, changed: 1, total: 947, draw: 0,
    face: 390, emotion: 15, embedding: 97, body: 97, hand: 142, object: 312, gesture: 0
  }
```

## All possible fatal errors

```text
Error(`modelpath error: expecting json file: ${path}`);
Error('input error: type is not recognized');
Error('input error: cannot create tensor');
Error('input error: cannot determine dimension');
Error('input error: attempted to use tensor but it is disposed');
Error('input error: attempted to use tensor without a shape');
Error(`input error: attempted to use tensor with unrecognized shape: ${input['shape']}`);
Error('canvas error: attempted to run in web worker but OffscreenCanvas is not supported');
Error('canvas error: attempted to run in browser but DOM is not defined');
Error('canvas error: attempted to use canvas in nodejs without canvas support installed');
Error('canvas error: cannot create output');
Error('backend error: attempting to use wasm backend but wasm path is not set');
Error('backend error: webgl context lost');
```

