# Caching, Interpolation & Smoothing Functions

<br>

## Caching

By default `Human` runs extensive caching to avoid re-running every model on each attempt  

**Caching logic:**

### Check if caching is allowed

Check if input changed above threshold (e.g. different image or scene change in video) by  
measuring relative pixel difference between last known input and current input averaged by input resolution

If difference is higher than `config.cacheSensitivity` (expressed in range 0..1) then cache is reset  
Setting `config.cacheSensitivity=80` disables caching  

Caching can be monitored via `human.performance`:
- `totalFrames`: total number of processed frames
- `cachedFrames`: number of frames considered for caching

### Per-module results caching

Each module implements its logic that interprets values of `config.<module>`:
- `skipFrames`: maximum number of frames before cache is invalidated
- `skipTime`: maximum time (in ms) before cache is invalidated

Values are interpreted as **or**, meaning whichever threshold is reached first  
Note that per-module caching logic is only active if input is considered sufficiently similar  

**Single-stage Modules Caching**: 

- Includes: **Body, Emotion, Description, Object, AntiSpoof**
- Module will return last known good value for a specific object  
  For example, there is no need to re-run *age/gender* analysis on video input on each frame  
  since it probably did not change if input itself is sufficiently similar

**Two-stage Modules Caching**: 

- Includes: **Face, Hand**
- Module will run analysis on the last known position of the object but will skip detecting new objects  
  For example, when face detector detects faces in the input it will cache their locations  
  On next run, it will run analysis on the last known location of faces only and update cached location  
  This allows module to "follow" face as input changes, but will fail if face moved too much so its outside of expected area - then it will be re-detected next time detection runs

<br>

## Interpolation

Even if detection runs at highest possible speed, results can appear non-smooth, especially on models that look at larger areas such as body part in body detection (e.g. area of a shoulder is not just a point, so point that represents a shoulder can "jump" within the area)  

To help smoothen results, its recommended to run interpolation that takes last detected results as input and adjusts them with previous well known results

For example:

```js
const result = await human.detect();
const interpolated = await human.next(result);
```

<br>

## Smoothing

Interpolation function is time-based meaning it will interpolate results depending on their age and can be used as many times as needed - so it is very useful to achieve smooth video output

For example, instead of running detection and immediately drawing results, it is recommended to separate detection and screen refreshes in separate loops:

```js
const human = new Human(); // create instance of Human
let result = {};

async function detectVideo() {
  const inputVideo = document.getElementById('video-id');
  result = await human.detect(inputVideo); // run detection
  requestAnimationFrame(detectVideo); // run detect loop
}

async function drawVideo() {
  const outputCanvas = document.getElementById('canvas-id');
  const interpolated = human.next(result); // calculate next interpolated frame from last known result
  human.draw.all(outputCanvas, interpolated); // draw the frame
  requestAnimationFrame(drawVideo); // run draw loop
}

detectVideo(); // start detection loop
drawVideo(); // start draw loop
```

This is especially useful when combined with concept of web workers as detection can run in a dedicated web worker while main loop processes last known results returned by the worker  

Taking the same concept further, each module can run in a separate worker while main thread aggregates results, runs inerpolation and and uses them as needed (for demo see, `/demo/multithread`)
