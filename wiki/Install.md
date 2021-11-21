# Installation

<br>

**Important**

*The packaged version of `Human` includes `TensorFlow/JS (TFJS) 3.6.1` library which can be accessed via `human.tf`*  

*You should NOT manually load another instance of `tfjs` unless you're using specific `.nobudle` edition of `Human,  
but if you do, be aware of possible version conflicts*  

<br>

## Quick Start

Simply load `Human` (*IIFE version*) directly from a cloud CDN in your HTML file:  
(pick one: `jsdelirv`, `unpkg` or `cdnjs`)

```html
<script src="https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.js"></script>
<script src="https://unpkg.dev/@vladmandic/human/dist/human.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/human/1.4.1/human.js"></script>
```

<br>

There are multiple ways to use `Human` library, pick one that suits you:

## Included

- `dist/human.js`: IIFE format bundle with TFJS for Browsers
- `dist/human.esm.js`: ESM format bundle with TFJS for Browsers
- `dist/human.esm-nobundle.js`: ESM format bundle without TFJS for Browsers, must be run through bundler to resolve dependencies
- `dist/human.node.js`: CommonJS format for NodeJS, optimized for usage with `tfjs-node`
- `dist/human.node-gpu.js`: CommonJS format for NodeJS, optimized for usage with `tfjs-node-gpu`

All versions include `sourcemap` *(.map)*  

Defaults:

```json
  {
    "main": "dist/human.node.js",
    "module": "dist/human.esm.js",
    "browser": "dist/human.esm.js",
  }
```

<br>

## 1. [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) script

*Simplest way for usage within Browser*

Simply download `dist/human.js`, include it in your `HTML` file & it's ready to use.

```html
  <script src="dist/human.js"><script>
```

IIFE script auto-registers global namespace `Human` within global `Window` object  
Which you can use to create instance of `human` library:

```js
  const human = new Human();
```

This way you can also use `Human` library within embbedded `<script>` tag within your `html` page for all-in-one approach  

<br>

## 2. [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) module

*Recommended for usage within `Browser`*  

### **2.1 Using Script Module**

You could use same syntax within your main `JS` file if it's imported with `<script type="module">`  

```html
  <script src="./index.js" type="module">
```

and then in your `index.js`

```js
  import Human from 'dist/human.esm.js'; // for direct import must use path to module, not package name
  const human = new Human();
```

### **2.2 With Bundler**

If you're using bundler *(such as rollup, webpack, parcel, browserify, esbuild)*  to package your client application,  
you can import ESM version of `Human` library which supports full tree shaking  

Install with:

```shell
  npm install @vladmandic/human
```

```js
  import Human from '@vladmandic/human'; // points to @vladmandic/human/dist/human.esm.js
                                         // you can also force-load specific version
                                         // for example: `@vladmandic/human/dist/human.esm-nobundle.js`
  const human = new Human();
```

Or if you prefer to package your version of `tfjs`, you can use `nobundle` version

Install with:

```shell
  npm install @vladmandic/human @tensorflow/tfjs
```

```js
  import tf from '@tensorflow/tfjs'
  import Human from '@vladmandic/human/dist/human.esm-nobundle.js'; // same functionality as default import, but without tfjs bundled
  const human = new Human();
```

*Note: When using a named import in a TypeScript project, it is advisable to instruct TypeScript where to look for type definitions using explict path to types*

```js
/// <reference path='./node_modules/@vladmandic/human/src/human.d.ts' />
```

<br>

## 3. [NPM](https://www.npmjs.com/) module

*Recommended for `NodeJS` projects that will execute in the backend*  

`Human` library for NodeJS does not include TFJS due to platform-specific binary dependencies - you need to install and include `tfjs-node` or `tfjs-node-gpu` in your project so it can register an optimized backend before loading `Human`  
Entry point are bundles in CommonJS format `dist/human.node.js` and `dist/human.node-gpu.js`  

Install with:

```shell
  npm install @vladmandic/human @tensorflow/tfjs-node
```

And then use with:

```js
  const tf = require('@tensorflow/tfjs-node'); // can also use '@tensorflow/tfjs-node-gpu' if you have environment with CUDA extensions
  const Human = require('@vladmandic/human').default; // points to @vladmandic/human/dist/human.node.js
  const human = new Human();
```

Or for CUDA accelerated NodeJS backend:

```shell
  npm install @vladmandic/human @tensorflow/tfjs-node-gpu
```

And then use with:

```js
  const tf = require('@tensorflow/tfjs-node-gpu'); // can also use '@tensorflow/tfjs-node-gpu' if you have environment with CUDA extensions
  const Human = require('@vladmandic/human/dist/human.node-gpu.js').default; // points to @vladmandic/human/dist/human.node.js
  const human = new Human();
```

Since NodeJS projects load `weights` from local filesystem instead of using `http` calls, you must modify default configuration to include correct paths with `file://` prefix  

For example:

```js
const config = {
  body: { enabled: true, modelPath: 'file://models.json' },
}
```

<br>

## Weights

Pretrained model weights are includes in `./models`  
Default configuration uses relative paths to you entry script pointing to `../models`  
If your application resides in a different folder, modify `modelPath` property in configuration of each module  

<hr>
