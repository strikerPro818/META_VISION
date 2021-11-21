# Configuration

`Human` configuration is a simple object that can be passed as a constructor and overriden during any `human.detect()` call  

- [**Configuration Interface Specification**](https://vladmandic.github.io/human/typedoc/interfaces/Config.html)
- [**Configuration Interface Definition**](https://github.com/vladmandic/human/blob/main/src/config.ts#L183)
- [**Default configuration values**](https://github.com/vladmandic/human/blob/main/src/config.ts#L253)

<br>

Overview of `Config` object type:

```ts
interface Config {
  backend: string                   // backend engine to be used for processing
  wasmPath: string,                 // root download path for wasm binaries
  debug: boolean,                   // verbose messages to console
  async: boolean,                   // use asynchronous processing within human
  warmup: string,                   // optional warmup of backend engine
  modelBasePath: string,            // root download path for all models
  cacheSensitivity: number;         // threshold for result cache validation
  skipAllowed: boolean;             // *internal* set after cache validation check
  filter: FilterConfig,             // controls input pre-processing
  face: FaceConfig,                 // controls face detection and all modules that rely on detected face
  body: BodyConfig,                 // controls body pose detection
  hand: HandConfig,                 // contros hand and finger detection
  object: ObjectConfig,             // controls object detection
  gesture: GestureConfig;           // controls gesture analysis
  segmentation: SegmentationConfig, // controls body segmentation
}
```

<br>

Most of configuration options are exposed in the `demo` application UI:  

<br>

![Menus](https://github.com/vladmandic/human/raw/main/assets/screenshot-menu.png)  

<br>

Configurtion object is large, but typically you only need to modify few values:  

- `enabled`: Choose which models to use
- `baseModelPath`: Update as needed to reflect your application's relative path

for example,

```js
const myConfig = {
  baseModelPath: `https://cdn.jsdelivr.net/npm/@vladmandic/human@2.3.5/dist/human.esm.min.js`,
  segmentation: { enabled: true },
}
const human = new Human(myConfig);
const result = await human.detect(input);
```
