# Build Process

If you want to modify the library and perform a full rebuild:  

*clone repository, install dependencies, check for errors and run full rebuild from which creates bundles from `/src` into `/dist`:*

```shell
git clone https://github.com/vladmandic/human
cd human
npm install # installs all project dependencies
npm run lint
npm run build
```

This will rebuild library itself (all variations) as well as demo  

Build process is written as JavaScript module `@vladmandic/build`  
which uses `build.json` as configuration file which can be modified to change any build parameters  

Build creates a custom `tfjs` bundle to optimize size and avoid unnecessary polyfills  

Production build runs following operations:

1. Compile TypeScript
2. Create dist minified bundles
3. Run Linter
4. Create TypeDoc API specification
5. Compile TS type definitions
6. Create TS type definitions rollup

Dev build runs following operations:

1. Start HTTP/HTTPS web server
2. Compile TypeScript
3. Create dist non-minified bundles
4. Run in file watch mode

<br>

## Build

Production build is started by running `npm run build`

```js
2021-11-17 15:23:35 INFO:  Application: { name: '@vladmandic/human', version: '2.5.2' }
2021-11-17 15:23:35 INFO:  Environment: { profile: 'production', config: '.build.json', package: 'package.json', tsconfig: true, eslintrc: true, git: true }
2021-11-17 15:23:35 INFO:  Toolchain: { build: '0.6.4', esbuild: '0.13.14', typescript: '4.5.2', typedoc: '0.22.9', eslint: '8.2.0' }
2021-11-17 15:23:35 INFO:  Build: { profile: 'production', steps: [ 'clean', 'compile', 'typings', 'typedoc', 'lint', 'changelog' ] }
2021-11-17 15:23:35 STATE: Clean: { locations: [ 'dist/*', 'types/lib/*', 'typedoc/*' ] }
2021-11-17 15:23:35 STATE: Compile: { name: 'tfjs/nodejs/cpu', format: 'cjs', platform: 'node', input: 'tfjs/tf-node.ts', output: 'dist/tfjs.esm.js', files: 1, inputBytes: 102, outputBytes: 1275 }
2021-11-17 15:23:35 STATE: Compile: { name: 'human/nodejs/cpu', format: 'cjs', platform: 'node', input: 'src/human.ts', output: 'dist/human.node.js', files: 62, inputBytes: 546408, outputBytes: 462801 }
2021-11-17 15:23:35 STATE: Compile: { name: 'tfjs/nodejs/gpu', format: 'cjs', platform: 'node', input: 'tfjs/tf-node-gpu.ts', output: 'dist/tfjs.esm.js', files: 1, inputBytes: 110, outputBytes: 1283 }
2021-11-17 15:23:36 STATE: Compile: { name: 'human/nodejs/gpu', format: 'cjs', platform: 'node', input: 'src/human.ts', output: 'dist/human.node-gpu.js', files: 62, inputBytes: 546416, outputBytes: 462805 }
2021-11-17 15:23:36 STATE: Compile: { name: 'tfjs/nodejs/wasm', format: 'cjs', platform: 'node', input: 'tfjs/tf-node-wasm.ts', output: 'dist/tfjs.esm.js', files: 1, inputBytes: 149, outputBytes: 1350 }
2021-11-17 15:23:36 STATE: Compile: { name: 'human/nodejs/wasm', format: 'cjs', platform: 'node', input: 'src/human.ts', output: 'dist/human.node-wasm.js', files: 62, inputBytes: 546483, outputBytes: 462877 }
2021-11-17 15:23:36 STATE: Compile: { name: 'tfjs/browser/version', format: 'esm', platform: 'browser', input: 'tfjs/tf-version.ts', output: 'dist/tfjs.version.js', files: 1, inputBytes: 1063, outputBytes: 1652 }
2021-11-17 15:23:36 STATE: Compile: { name: 'tfjs/browser/esm/nobundle', format: 'esm', platform: 'browser', input: 'tfjs/tf-browser.ts', output: 'dist/tfjs.esm.js', files: 2, inputBytes: 2326, outputBytes: 912 }
2021-11-17 15:23:36 STATE: Compile: { name: 'human/browser/esm/nobundle', format: 'esm', platform: 'browser', input: 'src/human.ts', output: 'dist/human.esm-nobundle.js', files: 62, inputBytes: 546045, outputBytes: 464932 }
2021-11-17 15:23:36 STATE: Compile: { name: 'tfjs/browser/esm/custom', format: 'esm', platform: 'browser', input: 'tfjs/tf-custom.ts', output: 'dist/tfjs.esm.js', files: 1, inputBytes: 307, outputBytes: 2500732 }
2021-11-17 15:23:37 STATE: Compile: { name: 'human/browser/iife/bundle', format: 'iife', platform: 'browser', input: 'src/human.ts', output: 'dist/human.js', files: 62, inputBytes: 3045865, outputBytes: 1625623 }
2021-11-17 15:23:37 STATE: Compile: { name: 'human/browser/esm/bundle', format: 'esm', platform: 'browser', input: 'src/human.ts', output: 'dist/human.esm.js', files: 62, inputBytes: 3045865, outputBytes: 2971092 }
2021-11-17 15:23:58 STATE: Typings: { input: 'src/human.ts', output: 'types/lib', files: 108 }
2021-11-17 15:24:06 STATE: TypeDoc: { input: 'src/human.ts', output: 'typedoc', objects: 52, generated: true }
2021-11-17 15:24:06 STATE: Compile: { name: 'demo/typescript', format: 'esm', platform: 'browser', input: 'demo/typescript/index.ts', output: 'demo/typescript/index.js', files: 1, inputBytes: 5811, outputBytes: 3821 }
2021-11-17 15:24:06 STATE: Compile: { name: 'demo/faceid', format: 'esm', platform: 'browser', input: 'demo/faceid/index.ts', output: 'demo/faceid/index.js', files: 2, inputBytes: 15166, outputBytes: 11786 }
2021-11-17 15:24:49 STATE: Lint: { locations: [ '*.json', 'src/**/*.ts', 'test/**/*.js', 'demo/**/*.js' ], files: 93, errors: 0, warnings: 0 }
2021-11-17 15:24:49 STATE: ChangeLog: { repository: 'https://github.com/vladmandic/human', branch: 'main', output: 'CHANGELOG.md' }
2021-11-17 15:24:49 STATE: Copy: { input: 'tfjs/tfjs.esm.d.ts' }
2021-11-17 15:31:14 STATE: API-Extractor: { succeeeded: true, errors: 0, warnings: 179 }
2021-11-17 15:24:51 STATE: Copy: { input: 'types/human.d.ts' }
2021-11-17 15:24:51 INFO:  Human Build complete...
```

<br>

## Dependencies

Only project depdendency is [@tensorflow/tfjs](https://github.com/tensorflow/tfjs)  
Development dependencies are:

- [esbuild](https://github.com/evanw/esbuild) used to compile TS sources and generate dist bundles
- [eslint](https://github.com/eslint) used for code linting
- [typescript](https://www.typescriptlang.org/) used to generate typings
- [typedoc](https://typedoc.org/) used to generate API specifications

Development build is started by running `npm run dev`

