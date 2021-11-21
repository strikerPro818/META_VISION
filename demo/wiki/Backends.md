# Backends

For use in **Browsers**, `Human` library includes pre-bundled `CPU`, `WASM` and `WebGL` backends  
as well as optimized `HumanGL` backend,  there is no need to load them externally  

For use in **NodeJS**, `Human` library supports `tfjs-node` and `tfjs-node-gpu` implementations of `tensorflow` backend  
which have to be loaded before `Human` library  

Experimental support is added for `WebGPU` backend in **Browsers** and `WASM` backend in **NodeJS**

<br>

## Backend Performance Compare

*This is not real-world expected performance, this is worst-case with optimizations disabled to highlight differences between each backend*

| Backend | Environment | Execution | Variation | Warmup | Average | Note |
| --- | --- | --- | --- | --- | --- | --- |
| CPU | NodeJS | CPU | - | 78,750 ms | 75,000 ms | Reference only |
| CPU | Browser | CPU | - | 92,250 ms | 91,000 ms | Reference only |
| Tensorflow | NodeJS | CPU | - | 2,635 ms | 2,110 ms | Recommended |
| Tensorflow | NodeJS | GPU | - | 4,650 ms | 1,810 ms | Advanced level |
| WASM | NodeJS | CPU | SIMD | 3,730 ms | 3,500 ms | Experimental |
| WASM | Browser | CPU | | 25,630 ms | 21,200 ms |
| WASM | Browser | CPU | SIMD | 4,325 ms| 3,670 ms | Recommended when running without GPU |
| WebGL | Browser | GPU | | 22,050 ms | 1,590 ms |
| HumanGL | Browser | GPU | | 6,170 ms | 1,600 ms | Recommended when running with GPU |
| WebGPU | Browser | GPU | GLSL | 21,350 ms | 1,150 ms | Experimental |
| WebGPU | Browser | GPU | WGSL | N/A | N/A | Not available |
| TFLite | Browser | CPU | | N/A | N/A | Not available |
| TFLite | Browser | CPU | SIMD | N/A | N/A | Not available |


### Notes

- **`Human`** configuration: All models enabled
- **`Human`** configuration: Results caching, interpolation and frame change detection disabled
- **CPU** backend is running interpreted JS code and is included for reference only
- **HumanGL** backend is the optimized version of `WebGL` backend for faster warmup
- **WebAssembly SIMD** is enabled by default in *Chome 93* or higher, otherwise it has to be manually enabled
- **WebGPU GLSL** implementation is experimental and is only available in Chrome Canary
- **WebGPU WGSL** implementation will be added in future versions
- **TFLite** support will be added in future versions

### Recommendations

- For **Browser**, if you have a **GPU**, recommended backend is `HumanGL`  
  which reduces warmup time compared to `WebGL` while maintaining fast execution time
- For **Browser**, if you don't have a **GPU**, recommended backend is `WASM`  
  For optimal WASM performance, SIMD support should be enabled in browser  
- For **NodeJS**, recommended backend is `tfjs-node`  
  Note that while `tfjs-node-gpu` achieves slightly higher performance than `tfjs-node`, it's usage is limited to specific nVidia CUDA enabled environments and does not achieve much higher performance since bottlneck is upload&download of textures from GPU, not execution itself

<br><hr><br>

## Tensorflow Backend

When used in `NodeJS`, load either `tfjs-node` or `tfjs-node-gpu` modules before loading `Human` library  
and set Human `config.backend` to `tensorflow`  

If using `tfjs-node-gpu` module and there is no available GPU acceleratrion, backend will print warning messages  
during execution and will fall back to CPU execution model instead  

GPU acceleration in NodeJS is currently supported for nVidia GPU cards  

For requirements and how to unable GPU acceleration using `tfjs-node-gpu` in  
native **Linux**, **Windows** or **Windows WSL2** environments,  
see appropriate docs on [nVidia CUDA](https://developer.nvidia.com/cuda-toolkit)

<br>

## WebGL Backend

WebGL backend usage is fastest on systems with modern GPU  
although startup speed is a bit slower

### HumanGL Backend

`Human` library includes custom version of `WebGL` backend with specific optimizations  
to enable enhanced workflows and set specific WebGL options to increase warmup speed  
and overal performance of the WebGL backend  

*`HumanGL` is a default backend for Browser implementations*

<br>

## CPU Backend

CPU backend usage is not recommended for performance reasons  
as TensorFlow implementation in JavaScript is by far the slowest

<br>

## WASM Backend

WASM backend has good resuts under specific conditions:

- Enable WASM SIMD support in your browser  
  (CPU parallel processing instructions)
- Reduce size of input image (e.g. webcam)  
  as WASM does not have optimized image extraction methods

<br>

### Loading WASM Files

WASM backend requires access to `wasm` files which are part of `@tensorflow/tfjs-backend-wasm` package and included in  
`node_modules/@tensorflow/tfjs-backend-wasm/dist/*.wasm` (different WASM file is loaded depending on detected capabilities)  

Also, to be able to load WASM files your web server, web server has to set appropriate HTTP headers:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Or configure `Human` load WASM files directly from a CDN:

```json
wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.9.0/dist/'
```

Note that version of WASM binaries **must** match version of TFJS used by `Human` library

<br>

### How to enable WASM SIMD support

**WebAssembly SIMD** is enabled by default in *Chome 93* or higher, otherwise it has to be manually enabled

Chrome:

- Navigate to <chrome://flags>
- `WebAssembly SIMD support` set to Enabled

Edge:

- Navigate to <chrome://flags>
- `WebAssembly SIMD support` set to Enabled

Firefox:

- Navigate to <about:config>
- `javascript.options.wasm_simd` set to True

<br>

## WebGPU Backend

In the long-term, `WebGPU` backend will superseed existing `WebGL` backend - it's intention is to support same workflows and features while having lower overhead while communicating with GPU  

Currently, WebGPU support is only present in Canary version of [Google Chrome](https://www.google.com/chrome/canary/)  
And must be explicitly enabled via `--enable-unsafe-gpu` flag  

Due to it's experimental nature `WebGPU` module is not bundled with `Human` and instead it has to be manually loaded  
After `WebGPU` has been loaded, simply set Human `config.backend` to `WebGPU` and it will perform additional checks and initializations as needed  

Note that `@tensorflow/tfjs-backend-webgpu` is currently in alpha phase of development and released packages are often too old  
Instead, it is recommended to build `@tensorflow/tfjs-backend-webgpu` from sources directly from `main` branch  

<br>

## Known Issues

See <TODO.md>

<br>
