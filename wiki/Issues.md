# Common Issues

## 1. Using Human with additional version of TFJS

When using `Human` library version with `TFJS` bundled and you try to load another copy of `TFJS` explicitly, you will see warnings in the console/inspector output

Additionally, if those two versions of `TFJS` as incompatible, it will result in runtime issues

Typically error message is:

```log
Platform browser has already been set. Overwriting the platform with [object Object].
cpu backend was already registered. Reusing existing backend factory.
The kernel '_FusedMatMul' for backend 'cpu' is already registered
The kernel 'Abs' for backend 'cpu' is already registered
...
```

Solution:

- Since `Human` already pre-packages `TFJS`, you do not need to import `TFJS` explicitly
- If you want to explicitly import `TFJS` into your project,  
  you should use `-nobundle` version of `Human` library that does not pre-package `TFJS`

## 2. Using Human with custom bundler

If you're using `Human` library with a custom bundler, bundler may not be able  
to recognize  target platform and automatically exclude unnecessary dependencies  

This happens when using server-side-bundling to create a client-side package, for example inside `NextJS`.

Typically error message is:

```log
Error: Module not found: Can't resolve 'fs'
```

Solution: Configure custom bundler to mark specific dependencies as external  

Example:

- ESBuild configuration:

```json
{ external: ['fs', 'buffer', 'util', 'os'] }
```

- WebPack configuration:

```json
externals: {
  'fs': 'commonjs2 fs',
  'buffer': 'commonjs2 buffer',
  'util': 'commonjs2 util',
  'os': 'os fs'
}
```
