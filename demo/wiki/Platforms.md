# Platform Support

## Browser

### Desktop

- **Chrome**: *Supported*
  - Minimum version Chrome 60 from 2017
  - WASM: For performance reasons it is recommended to enable `WebAssembly SIMD support` in `chrome://flags`
- **Firefox**: *Supported*
  - Minimum version Firefox 55 from 2017
  - WebGL: Lower performance due to Firefox handing of WebGL memory garbage collection
  - WASM: For performance reasons it is recommended to enable `javascript.options.wasm.simd` in `about:config`
  - WASM: Async operations are not supported (running multiple detections or models in parallel) Due to missing threaded WASM support in Firefox
  - Web Workers: Not supported due to Firefox missing implementation for `OffscreenCanvas`
- **Safari**: *Limited support*
  - Minimum version Safari 10.3
  - User reported as working but with limited testing
  - WebGL: Safari supports only `WebGL1` but that is transparent to users
- Other **Chromium** based browsers: *Supported*
  - Edge is included in testing and supported with same notes as Chrome
  - Other Chromium browsers are presumed as working
- **IE 11** or older: *Not supported*
  - Human requires ES2018 support in browsers

### Mobile

- **Chrome**: *Supported*
- **Firefox**: *Supported*
- **Safari**: *Limited support*
  - User reported as working but with limited testing
- Other **Chromium** based browsers: *Supported*
  - Edge is included in testing and supported with same notes as Chrome
- **IE 11** or older: *Not supported*
  - Human requires ES2018 support in browsers

## NodeJS

- Minimum version 14.0
