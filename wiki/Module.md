# Custom Modules

## Overview

Each module is fully self enclosed:

- Defined in a separate folder under `/src/`
- Performs `load` and `predict` functions
- Uses global configuration object
- Runs prediction on global input image
- Merges results into global results object

<br>

## Define module

Define module that implements `load` and `predict` async methods:

```js
export async function load(config: Config | any) { ... }
```

- loads specific model using `modelPath` configuration
- returns `tf.GraphModel`

```js
export async function predict(image: Tensor, config: Config, idx: number, count: number) { ... }
```

- input image is already preprocessed and passed to predict method as tensor
- takes input tensor and resizes and normalizes it as needed
- optionally implements `skipFrames` for caching of results
- optionally uses `idx` and `count` params to map cached objects to current objects
- uses any other optional configuration params
- returns result object

<br>

## Enable Module

in `human.ts`:

- define model placeholder (`module.load()` stores model here) in the main constructor

in `config.ts`:

- define configuration types
- set configuration defaul values

in `result.ts`:

- define results type

in `models.ts`:

- enable model loading sync and async by calling `module.load()`

<br>

## Execute Module

if model works on full image, execute from `human.ts`
if model works on face image, execute from `face.ts`

- add results placeholder
- implement calls to `module.predict()` for sync and async
- merge results object

## Examples

- For simple module that works on pre-detected face tensor,  
  follow existing module defintion is `emotion/emotion.ts`  
- For simple module that works on a full image tensor,  
  follow existing module definition in `object/centernet.ts`
