/**
 * Human demo for browsers
 *
 * @description Main demo app that exposes all Human functionality
 *
 * @params Optional URL parameters:
 * image=<imagePath:string>: perform detection on specific image and finish
 * worker=<true|false>: use WebWorkers
 * backend=<webgl|wasm|cpu>: use specific TF backend for operations
 * preload=<true|false>: pre-load all configured models
 * warmup=<true|false>: warmup all configured models
 *
 * @example <https://wyse:10031/?backend=wasm&worker=true&image="/assets/sample-me.jpg">
 *
 * @configuration
 * userConfig={}: contains all model configuration used by human
 * drawOptions={}: contains all draw variables used by human.draw
 * ui={}: contains all variables exposed in the UI
 */

// @ts-nocheck // typescript checks disabled as this is pure javascript

import Human from '../dist/human.esm.js'; // equivalent of @vladmandic/human
import Menu from './helpers/menu.js';
import GLBench from './helpers/gl-bench.js';
import webRTC from './helpers/webrtc.js';

let human;

let userConfig = {
  warmup: 'none',
  backend: 'humangl',
  wasmPath: 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@3.7.0/dist/',
  /*
  async: false,
  cacheSensitivity: 0,
  filter: {
    enabled: false,
    flip: false,
  },
  face: { enabled: false,
    detector: { return: true },
    mesh: { enabled: true },
    iris: { enabled: false },
    description: { enabled: false },
    emotion: { enabled: false },
  },
  object: { enabled: false },
  gesture: { enabled: true },
  hand: { enabled: false },
  body: { enabled: false },
  // body: { enabled: true, modelPath: 'posenet.json' },
  segmentation: { enabled: false },
  */
};

const drawOptions = {
  bufferedOutput: true, // makes draw functions interpolate results between each detection for smoother movement
  drawBoxes: true,
  drawGaze: true,
  drawLabels: true,
  drawPolygons: true,
  drawPoints: false,
};

// ui options
const ui = {
  // configurable items
  console: true, // log messages to browser console
  crop: false, // video mode crop to size or leave full frame
  facing: true, // camera facing front or back
  baseBackground: 'rgba(50, 50, 50, 1)', // 'grey'
  columns: 2, // when processing sample images create this many columns
  useWorker: true, // use web workers for processing
  worker: 'index-worker.js',
  maxFPSframes: 10, // keep fps history for how many frames
  modelsPreload: true, // preload human models on startup
  modelsWarmup: false, // warmup human models on startup
  buffered: true, // should output be buffered between frames
  interpolated: true, // should output be interpolated for smoothness between frames
  iconSize: '48px', // ui icon sizes

  // internal variables
  busy: false, // internal camera busy flag
  menuWidth: 0, // internal
  menuHeight: 0, // internal
  camera: {}, // internal, holds details of webcam details
  detectFPS: [], // internal, holds fps values for detection performance
  drawFPS: [], // internal, holds fps values for draw performance
  drawWarmup: false, // debug only, should warmup image processing be displayed on startup
  drawThread: null, // internl, perform draw operations in a separate thread
  detectThread: null, // internl, perform detect operations in a separate thread
  hintsThread: null, // internal, draw random hints
  framesDraw: 0, // internal, statistics on frames drawn
  framesDetect: 0, // internal, statistics on frames detected
  bench: true, // show gl fps benchmark window
  lastFrame: 0, // time of last frame processing
  viewportSet: false, // internal, has custom viewport been set
  background: null, // holds instance of segmentation background image

  // webrtc
  useWebRTC: false, // use webrtc as camera source instead of local webcam
  webRTCServer: 'http://localhost:8002',
  webRTCStream: 'reowhite',

  // sample images
  compare: '../samples/ai-face.jpg', // base image for face compare
  samples: [],
};

const pwa = {
  enabled: true,
  cacheName: 'Human',
  scriptFile: 'index-pwa.js',
  cacheModels: true,
  cacheWASM: true,
  cacheOther: false,
};

// hints
const hints = [
  'for optimal performance disable unused modules',
  'with modern gpu best backend is webgl otherwise select wasm backend',
  'you can process images by dragging and dropping them in browser window',
  'video input can be webcam or any other video source',
  'check out other demos such as face-matching and face-3d',
  'you can edit input image or video on-the-fly using filters',
  'library status messages are logged in browser console',
];

// global variables
const menu = {};
let worker;
let bench;
let lastDetectedResult = {};

// helper function: translates json to human readable string
function str(...msg) {
  if (!Array.isArray(msg)) return msg;
  let line = '';
  for (const entry of msg) {
    if (typeof entry === 'object') line += JSON.stringify(entry).replace(/{|}|"|\[|\]/g, '').replace(/,/g, ', ');
    else line += entry;
  }
  return line;
}

// helper function: wrapper around console output
function log(...msg) {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  if (ui.console) console.log(ts, ...msg);
}

function status(msg) {
  const div = document.getElementById('status');
  if (div && msg && msg.length > 0) {
    log('status', msg);
    document.getElementById('play').style.display = 'none';
    document.getElementById('loader').style.display = 'block';
    div.innerText = msg;
  } else {
    const video = document.getElementById('video');
    document.getElementById('play').style.display = (video.srcObject !== null) && !video.paused ? 'none' : 'block';
    document.getElementById('loader').style.display = 'none';
    div.innerText = '';
  }
}

const compare = { enabled: false, original: null };
async function calcSimmilariry(result) {
  document.getElementById('compare-container').style.display = compare.enabled ? 'block' : 'none';
  if (!compare.enabled) return;
  if (!result || !result.face || !result.face[0].embedding) return;
  if (!(result.face.length > 0) || (result.face[0].embedding.length <= 64)) return;
  if (!compare.original) {
    compare.original = result;
    log('setting face compare baseline:', result.face[0]);
    if (result.face[0].tensor) {
      const enhanced = human.enhance(result.face[0]);
      if (enhanced) {
        const c = document.getElementById('orig');
        const squeeze = enhanced.squeeze();
        const norm = squeeze.div(255);
        human.tf.browser.toPixels(norm, c);
        enhanced.dispose();
        squeeze.dispose();
        norm.dispose();
      }
    } else {
      document.getElementById('compare-canvas').getContext('2d').drawImage(compare.original.canvas, 0, 0, 200, 200);
    }
  }
  const similarity = human.similarity(compare.original.face[0].embedding, result.face[0].embedding);
  document.getElementById('similarity').innerText = `similarity: ${Math.trunc(1000 * similarity) / 10}%`;
}

// draws processed results and starts processing of a next frame
let lastDraw = performance.now();
async function drawResults(input) {
  const result = lastDetectedResult;
  const canvas = document.getElementById('canvas');

  // update draw fps data
  ui.drawFPS.push(1000 / (performance.now() - lastDraw));
  if (ui.drawFPS.length > ui.maxFPSframes) ui.drawFPS.shift();
  lastDraw = performance.now();

  // draw fps chart
  await menu.process.updateChart('FPS', ui.detectFPS);

  if (userConfig.segmentation.enabled && ui.buffered) { // refresh segmentation if using buffered output
    result.canvas = await human.segmentation(input, ui.background, userConfig);
  } else if (!result.canvas || ui.buffered) { // refresh with input if using buffered output or if missing canvas
    const image = await human.image(input);
    result.canvas = image.canvas;
    human.tf.dispose(image.tensor);
  }

  // draw image from video
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = ui.baseBackground;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (result.canvas) {
    if (result.canvas.width !== canvas.width) canvas.width = result.canvas.width;
    if (result.canvas.height !== canvas.height) canvas.height = result.canvas.height;
    ctx.drawImage(result.canvas, 0, 0, result.canvas.width, result.canvas.height, 0, 0, result.canvas.width, result.canvas.height);
  } else {
    ctx.drawImage(input, 0, 0, input.width, input.height, 0, 0, canvas.width, canvas.height);
  }

  // draw all results using interpolated results
  if (ui.interpolated) {
    const interpolated = human.next(result);
    human.draw.all(canvas, interpolated, drawOptions);
  } else {
    human.draw.all(canvas, result, drawOptions);
  }
  /* alternatively use individual functions
  human.draw.face(canvas, result.face);
  human.draw.body(canvas, result.body);
  human.draw.hand(canvas, result.hand);
  human.draw.object(canvas, result.object);
  human.draw.gesture(canvas, result.gesture);
  */
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const person = result.persons; // explicitly invoke person getter
  await calcSimmilariry(result);

  // update log
  const engine = human.tf.engine();
  const gpu = engine.backendInstance ? `gpu: ${(engine.backendInstance.numBytesInGPU ? engine.backendInstance.numBytesInGPU : 0).toLocaleString()} bytes` : '';
  const memory = `system: ${engine.state.numBytes.toLocaleString()} bytes ${gpu} | tensors: ${engine.state.numTensors.toLocaleString()}`;
  const processing = result.canvas ? `processing: ${result.canvas.width} x ${result.canvas.height}` : '';
  const avgDetect = ui.detectFPS.length > 0 ? Math.trunc(10 * ui.detectFPS.reduce((a, b) => a + b, 0) / ui.detectFPS.length) / 10 : 0;
  const avgDraw = ui.drawFPS.length > 0 ? Math.trunc(10 * ui.drawFPS.reduce((a, b) => a + b, 0) / ui.drawFPS.length) / 10 : 0;
  const warning = (ui.detectFPS.length > 5) && (avgDetect < 2) ? '<font color="lightcoral">warning: your performance is low: try switching to higher performance backend, lowering resolution or disabling some models</font>' : '';
  const fps = avgDetect > 0 ? `FPS process:${avgDetect} refresh:${avgDraw}` : '';
  document.getElementById('log').innerHTML = `
    video: ${ui.camera.name} | facing: ${ui.camera.facing} | screen: ${window.innerWidth} x ${window.innerHeight} camera: ${ui.camera.width} x ${ui.camera.height} ${processing}<br>
    backend: ${human.tf.getBackend()} | ${memory}<br>
    performance: ${str(lastDetectedResult.performance)}ms ${fps}<br>
    ${warning}<br>
  `;
  ui.framesDraw++;
  ui.lastFrame = performance.now();
  // if buffered, immediate loop but limit frame rate although it's going to run slower as JS is singlethreaded
  if (ui.buffered) {
    ui.drawThread = requestAnimationFrame(() => drawResults(input));
  } else {
    if (ui.drawThread) {
      log('stopping buffered refresh');
      cancelAnimationFrame(ui.drawThread);
    }
  }
}

// setup webcam
let initialCameraAccess = true;
async function setupCamera() {
  if (ui.busy) return null;
  ui.busy = true;
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const output = document.getElementById('log');
  if (ui.useWebRTC) {
    status('setting up webrtc connection');
    try {
      video.onloadeddata = () => ui.camera = { name: ui.webRTCStream, width: video.videoWidth, height: video.videoHeight, facing: 'default' };
      await webRTC(ui.webRTCServer, ui.webRTCStream, video);
    } catch (err) {
      log(err);
    } finally {
      status();
    }
    return '';
  }
  const live = video.srcObject ? ((video.srcObject.getVideoTracks()[0].readyState === 'live') && (video.readyState > 2) && (!video.paused)) : false;
  let msg = '';
  status('META ROBOTICS');
  // setup webcam. note that navigator.mediaDevices requires that page is accessed via https
  if (!navigator.mediaDevices) {
    msg = 'camera access not supported';
    output.innerText += `\n${msg}`;
    log(msg);
    status(msg);
    ui.busy = false;
    return msg;
  }
  let stream;
  const constraints = {
    audio: false,
    video: {
      facingMode: ui.facing ? 'user' : 'environment',
      resizeMode: ui.crop ? 'crop-and-scale' : 'none',
      width: { ideal: document.body.clientWidth },
      // height: { ideal: document.body.clientHeight }, // not set as we're using aspectRation to get height instead
      aspectRatio: document.body.clientWidth / document.body.clientHeight,
      // deviceId: 'xxxx' // if you have multiple webcams, specify one to use explicitly
    },
  };
  // enumerate devices for diag purposes
  if (initialCameraAccess) {
    navigator.mediaDevices.enumerateDevices().then((devices) => log('enumerated devices:', devices));
    log('camera constraints', constraints);
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') msg = 'camera permission denied';
    else if (err.name === 'SourceUnavailableError') msg = 'camera not available';
    else msg = `camera error: ${err.message || err}`;
    output.innerText += `\n${msg}`;
    status(msg);
    log('camera error:', err);
    ui.busy = false;
    return msg;
  }
  const tracks = stream.getVideoTracks();
  if (tracks && tracks.length >= 1) {
    if (initialCameraAccess) log('enumerated viable tracks:', tracks);
  } else {
    ui.busy = false;
    return 'no camera track';
  }
  const track = stream.getVideoTracks()[0];
  const settings = track.getSettings();
  if (initialCameraAccess) log('selected video source:', track, settings); // log('selected camera:', track.label, 'id:', settings.deviceId);
  ui.camera = { name: track.label.toLowerCase(), width: video.videoWidth, height: video.videoHeight, facing: settings.facingMode === 'user' ? 'front' : 'back' };
  initialCameraAccess = false;
  const promise = !stream || new Promise((resolve) => {
    video.onloadeddata = () => {
      if (settings.width > settings.height) canvas.style.width = '100vw';
      else canvas.style.height = '100vh';
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ui.menuWidth.input.setAttribute('value', video.videoWidth);
      ui.menuHeight.input.setAttribute('value', video.videoHeight);
      if (live) video.play();
      // eslint-disable-next-line no-use-before-define
      if (live && !ui.detectThread) runHumanDetect(video, canvas);
      ui.busy = false;
      resolve();
    };
  });
  // attach input to video element
  if (stream) {
    video.srcObject = stream;
    return promise;
  }
  ui.busy = false;
  return 'camera stream empty';
}

function initPerfMonitor() {
  if (!bench) {
    const gl = null;
    // cosnt gl = human.tf.engine().backend.gpgpu.gl;
    // if (!gl) log('bench cannot get tensorflow webgl context');
    bench = new GLBench(gl, {
      trackGPU: false, // this is really slow
      chartHz: 20,
      chartLen: 20,
    });
    bench.begin();
  }
}

// wrapper for worker.postmessage that creates worker if one does not exist
function webWorker(input, image, canvas, timestamp) {
  if (!worker) {
    // create new webworker and add event handler only once
    log('creating worker thread');
    // load Human using IIFE script as Chome Mobile does not support Modules as Workers
    // worker = new Worker(ui.worker, { type: 'module' });
    worker = new Worker(ui.worker);
    // after receiving message from webworker, parse&draw results and send new frame for processing
    worker.addEventListener('message', (msg) => {
      if (msg.data.result.performance && msg.data.result.performance.total) ui.detectFPS.push(1000 / msg.data.result.performance.total);
      if (ui.detectFPS.length > ui.maxFPSframes) ui.detectFPS.shift();
      if (ui.bench) {
        if (!bench) initPerfMonitor();
        bench.nextFrame(timestamp);
      }
      if (document.getElementById('gl-bench')) document.getElementById('gl-bench').style.display = ui.bench ? 'block' : 'none';
      lastDetectedResult = msg.data.result;

      if (msg.data.image) {
        lastDetectedResult.canvas = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(msg.data.width, msg.data.height) : document.createElement('canvas');
        lastDetectedResult.canvas.width = msg.data.width;
        lastDetectedResult.canvas.height = msg.data.height;
        const ctx = lastDetectedResult.canvas.getContext('2d');
        const imageData = new ImageData(new Uint8ClampedArray(msg.data.image), msg.data.width, msg.data.height);
        ctx.putImageData(imageData, 0, 0);
      }

      ui.framesDetect++;
      if (!ui.drawThread) {
        status();
        drawResults(input);
      }
      const videoLive = (input.readyState > 2) && (!input.paused);
      const cameraLive = input.srcObject && (input.srcObject.getVideoTracks()[0].readyState === 'live') && !input.paused;
      const live = videoLive || cameraLive;
      if (live) {
        // eslint-disable-next-line no-use-before-define
        ui.detectThread = requestAnimationFrame((now) => runHumanDetect(input, canvas, now));
      }
    });
  }
  // pass image data as arraybuffer to worker by reference to avoid copy
  worker.postMessage({ image: image.data.buffer, width: canvas.width, height: canvas.height, userConfig }, [image.data.buffer]);
}

// main processing function when input is webcam, can use direct invocation or web worker
function runHumanDetect(input, canvas, timestamp) {
  // if live video
  const videoLive = (input.readyState > 2) && (!input.paused);
  const cameraLive = input.srcObject && (input.srcObject.getVideoTracks()[0].readyState === 'live');
  const live = videoLive || cameraLive;
  if (!live) {
    // stop ui refresh
    // if (ui.drawThread) cancelAnimationFrame(ui.drawThread);
    if (ui.detectThread) cancelAnimationFrame(ui.detectThread);
    // if we want to continue and camera not ready, retry in 0.5sec, else just give up
    if (input.paused) log('video paused');
    else if (cameraLive && (input.readyState <= 2)) setTimeout(() => runHumanDetect(input, canvas), 500);
    else log(`video not ready: track state: ${input.srcObject ? input.srcObject.getVideoTracks()[0].readyState : 'unknown'} stream state: ${input.readyState}`);
    log('frame statistics: process:', ui.framesDetect, 'refresh:', ui.framesDraw);
    log('memory', human.tf.engine().memory());
    return;
  }
  if (ui.hintsThread) clearInterval(ui.hintsThread);
  if (ui.useWorker) {
    // get image data from video as we cannot send html objects to webworker
    const offscreen = (typeof OffscreenCanvas !== 'undefined') ? new OffscreenCanvas(canvas.width, canvas.height) : document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const ctx = offscreen.getContext('2d');
    ctx.drawImage(input, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // perform detection in worker
    webWorker(input, data, canvas, timestamp);
  } else {
    human.detect(input, userConfig).then((result) => {
      status();
      if (result.performance && result.performance.total) ui.detectFPS.push(1000 / result.performance.total);
      if (ui.detectFPS.length > ui.maxFPSframes) ui.detectFPS.shift();
      if (ui.bench) {
        if (!bench) initPerfMonitor();
        bench.nextFrame(timestamp);
      }
      if (document.getElementById('gl-bench')) document.getElementById('gl-bench').style.display = ui.bench ? 'block' : 'none';
      if (result.error) {
        log(result.error);
        document.getElementById('log').innerText += `\nHuman error: ${result.error}`;
      } else {
        lastDetectedResult = result;
        if (!ui.drawThread) drawResults(input);
        ui.framesDetect++;
        ui.detectThread = requestAnimationFrame((now) => runHumanDetect(input, canvas, now));
      }
    });
  }
}

// main processing function when input is image, can use direct invocation or web worker
async function processImage(input, title) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onerror = async () => status('image loading error');
    image.onload = async () => {
      if (ui.hintsThread) clearInterval(ui.hintsThread);
      ui.interpolated = false; // stop interpolating results if input is image
      ui.buffered = false; // stop buffering result if input is image
      status(`processing image: ${title}`);
      const canvas = document.getElementById('canvas');
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;
      canvas.width = userConfig.filter.width && userConfig.filter.width > 0 ? userConfig.filter.width : image.naturalWidth;
      canvas.height = userConfig.filter.height && userConfig.filter.height > 0 ? userConfig.filter.height : image.naturalHeight;
      const origCacheSensitiry = userConfig.cacheSensitivity;
      userConfig.cacheSensitivity = 0;
      const result = await human.detect(image, userConfig);
      userConfig.cacheSensitivity = origCacheSensitiry;
      lastDetectedResult = result;
      await drawResults(image);
      const thumb = document.createElement('canvas');
      thumb.className = 'thumbnail';
      thumb.width = ui.columns > 1 ? window.innerWidth / (ui.columns + 0.1) : window.innerWidth - 14;
      thumb.height = thumb.width * canvas.height / canvas.width;
      if (result.face && result.face.length > 0) {
        thumb.title = result.face.map((a, i) => `#${i} face: ${Math.trunc(100 * a.faceScore)}% box: ${Math.trunc(100 * a.boxScore)}% age: ${Math.trunc(a.age)} gender: ${Math.trunc(100 * a.genderScore)}% ${a.gender}`).join(' | ');
      } else {
        thumb.title = 'no face detected';
      }
      thumb.addEventListener('click', (evt) => {
        const stdWidth = ui.columns > 1 ? window.innerWidth / (ui.columns + 0.1) : window.innerWidth - 14;
        // zoom in/out on click
        if (evt.target.style.width === `${stdWidth}px`) {
          evt.target.style.width = '';
          evt.target.style.height = `${document.getElementById('log').offsetTop - document.getElementById('media').offsetTop}px`;
        } else {
          evt.target.style.width = `${stdWidth}px`;
          evt.target.style.height = '';
        }
        // copy to clipboard on click
        if (typeof ClipboardItem !== 'undefined' && navigator.clipboard) {
          evt.target.toBlob((blob) => {
            // eslint-disable-next-line no-undef
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            log('copied image to clipboard');
          });
        }
      });
      const ctx = thumb.getContext('2d');
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, thumb.width, thumb.height);
      const prev = document.getElementsByClassName('thumbnail');
      if (prev && prev.length > 0) document.getElementById('samples-container').insertBefore(thumb, prev[0]);
      else document.getElementById('samples-container').appendChild(thumb);

      // finish up
      status();
      document.getElementById('play').style.display = 'none';
      document.getElementById('loader').style.display = 'none';
      if (ui.detectThread) cancelAnimationFrame(ui.detectThread);
      if (ui.drawThread) cancelAnimationFrame(ui.drawThread);
      log('processed image:', title);
      resolve(true);
    };
    image.src = input;
  });
}

async function processVideo(input, title) {
  status(`processing video: ${title}`);
  const video = document.createElement('video');
  const canvas = document.getElementById('canvas');
  video.id = 'video-file';
  video.controls = true;
  video.loop = true;
  // video.onerror = async () => status(`video loading error: ${video.error.message}`);
  video.addEventListener('error', () => status(`video loading error: ${video.error.message}`));
  video.addEventListener('canplay', async () => {
    for (const m of Object.values(menu)) m.hide();
    document.getElementById('samples-container').style.display = 'none';
    document.getElementById('play').style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('btnStartText').innerHTML = 'pause video';
    await video.play();
    if (!ui.detectThread) runHumanDetect(video, canvas);
  });
  video.src = input;
}

// just initialize everything and call main function
async function detectVideo() {
  document.getElementById('samples-container').style.display = 'none';
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  canvas.style.display = 'block';
  cancelAnimationFrame(ui.detectThread);
  if ((video.srcObject !== null) && !video.paused) {
    document.getElementById('btnStartText').innerHTML = 'start video';
    status('paused');
    await video.pause();
    // if (ui.drawThread) cancelAnimationFrame(ui.drawThread);
  } else {
    const cameraError = await setupCamera();
    if (!cameraError) {
      status('INITIATING DETECTION...');
      for (const m of Object.values(menu)) m.hide();
      document.getElementById('btnStartText').innerHTML = 'pause video';
      await video.play();
      runHumanDetect(video, canvas);
    } else {
      status(cameraError);
    }
  }
}

// just initialize everything and call main function
async function detectSampleImages() {
  document.getElementById('play').style.display = 'none';
  document.getElementById('canvas').style.display = 'none';
  document.getElementById('samples-container').style.display = 'block';
  log('running detection of sample images');
  status('processing images');
  document.getElementById('samples-container').innerHTML = '';
  for (const m of Object.values(menu)) m.hide();
  for (const image of ui.samples) await processImage(image, image);
}

function setupMenu() {
  const x = [`${document.getElementById('btnDisplay').offsetLeft}px`, `${document.getElementById('btnImage').offsetLeft}px`, `${document.getElementById('btnProcess').offsetLeft}px`, `${document.getElementById('btnModel').offsetLeft}px`];

  const top = `${document.getElementById('menubar').clientHeight}px`;

  menu.display = new Menu(document.body, '', { top, left: x[0] });
  menu.display.addBool('perf monitor', ui, 'bench', (val) => ui.bench = val);
  menu.display.addBool('buffer output', ui, 'buffered', (val) => ui.buffered = val);
  menu.display.addBool('crop & scale', ui, 'crop', (val) => {
    ui.crop = val;
    setupCamera();
  });
  menu.display.addBool('camera facing', ui, 'facing', (val) => {
    ui.facing = val;
    setupCamera();
  });
  menu.display.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.display.addBool('use depth', human.draw.options, 'useDepth');
  menu.display.addBool('use curves', human.draw.options, 'useCurves');
  menu.display.addBool('print labels', human.draw.options, 'drawLabels');
  menu.display.addBool('draw points', human.draw.options, 'drawPoints');
  menu.display.addBool('draw boxes', human.draw.options, 'drawBoxes');
  menu.display.addBool('draw polygons', human.draw.options, 'drawPolygons');
  menu.display.addBool('fill polygons', human.draw.options, 'fillPolygons');

  menu.image = new Menu(document.body, '', { top, left: x[1] });
  menu.image.addBool('enabled', userConfig.filter, 'enabled', (val) => userConfig.filter.enabled = val);
  ui.menuWidth = menu.image.addRange('image width', userConfig.filter, 'width', 0, 3840, 10, (val) => userConfig.filter.width = parseInt(val));
  ui.menuHeight = menu.image.addRange('image height', userConfig.filter, 'height', 0, 2160, 10, (val) => userConfig.filter.height = parseInt(val));
  menu.image.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.image.addRange('brightness', userConfig.filter, 'brightness', -1.0, 1.0, 0.05, (val) => userConfig.filter.brightness = parseFloat(val));
  menu.image.addRange('contrast', userConfig.filter, 'contrast', -1.0, 1.0, 0.05, (val) => userConfig.filter.contrast = parseFloat(val));
  menu.image.addRange('sharpness', userConfig.filter, 'sharpness', 0, 1.0, 0.05, (val) => userConfig.filter.sharpness = parseFloat(val));
  menu.image.addRange('blur', userConfig.filter, 'blur', 0, 20, 1, (val) => userConfig.filter.blur = parseInt(val));
  menu.image.addRange('saturation', userConfig.filter, 'saturation', -1.0, 1.0, 0.05, (val) => userConfig.filter.saturation = parseFloat(val));
  menu.image.addRange('hue', userConfig.filter, 'hue', 0, 360, 5, (val) => userConfig.filter.hue = parseInt(val));
  menu.image.addRange('pixelate', userConfig.filter, 'pixelate', 0, 32, 1, (val) => userConfig.filter.pixelate = parseInt(val));
  menu.image.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.image.addBool('negative', userConfig.filter, 'negative', (val) => userConfig.filter.negative = val);
  menu.image.addBool('sepia', userConfig.filter, 'sepia', (val) => userConfig.filter.sepia = val);
  menu.image.addBool('vintage', userConfig.filter, 'vintage', (val) => userConfig.filter.vintage = val);
  menu.image.addBool('kodachrome', userConfig.filter, 'kodachrome', (val) => userConfig.filter.kodachrome = val);
  menu.image.addBool('technicolor', userConfig.filter, 'technicolor', (val) => userConfig.filter.technicolor = val);
  menu.image.addBool('polaroid', userConfig.filter, 'polaroid', (val) => userConfig.filter.polaroid = val);
  menu.image.addHTML('<input type="file" id="file-input" class="input-file"></input> &nbsp input');
  menu.image.addHTML('<input type="file" id="file-background" class="input-file"></input> &nbsp background');

  menu.process = new Menu(document.body, '', { top, left: x[2] });
  menu.process.addList('backend', ['cpu', 'webgl', 'wasm', 'humangl'], userConfig.backend, (val) => userConfig.backend = val);
  menu.process.addBool('async operations', userConfig, 'async', (val) => userConfig.async = val);
  menu.process.addBool('use web worker', ui, 'useWorker');
  menu.process.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.process.addLabel('model parameters');
  menu.process.addRange('max objects', userConfig.face.detector, 'maxDetected', 1, 50, 1, (val) => {
    userConfig.face.detector.maxDetected = parseInt(val);
    userConfig.body.maxDetected = parseInt(val);
    userConfig.hand.maxDetected = parseInt(val);
  });
  menu.process.addRange('skip frames', userConfig.face.detector, 'skipFrames', 0, 50, 1, (val) => {
    userConfig.face.detector.skipFrames = parseInt(val);
    userConfig.face.emotion.skipFrames = parseInt(val);
    userConfig.hand.skipFrames = parseInt(val);
  });
  menu.process.addRange('min confidence', userConfig.face.detector, 'minConfidence', 0.0, 1.0, 0.05, (val) => {
    userConfig.face.detector.minConfidence = parseFloat(val);
    userConfig.face.emotion.minConfidence = parseFloat(val);
    userConfig.hand.minConfidence = parseFloat(val);
  });
  menu.process.addRange('overlap', userConfig.face.detector, 'iouThreshold', 0.1, 1.0, 0.05, (val) => {
    userConfig.face.detector.iouThreshold = parseFloat(val);
    userConfig.hand.iouThreshold = parseFloat(val);
  });
  menu.process.addBool('rotation detection', userConfig.face.detector, 'rotation', (val) => {
    userConfig.face.detector.rotation = val;
    userConfig.hand.rotation = val;
  });
  menu.process.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  // menu.process.addButton('process sample images', 'process images', () => detectSampleImages());
  // menu.process.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.process.addChart('FPS', 'FPS');

  menu.models = new Menu(document.body, '', { top, left: x[3] });
  menu.models.addBool('face detect', userConfig.face, 'enabled', (val) => userConfig.face.enabled = val);
  menu.models.addBool('face mesh', userConfig.face.mesh, 'enabled', (val) => userConfig.face.mesh.enabled = val);
  menu.models.addBool('face iris', userConfig.face.iris, 'enabled', (val) => userConfig.face.iris.enabled = val);
  menu.models.addBool('face description', userConfig.face.description, 'enabled', (val) => userConfig.face.description.enabled = val);
  menu.models.addBool('face emotion', userConfig.face.emotion, 'enabled', (val) => userConfig.face.emotion.enabled = val);
  menu.models.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.models.addBool('body pose', userConfig.body, 'enabled', (val) => userConfig.body.enabled = val);
  menu.models.addBool('hand pose', userConfig.hand, 'enabled', (val) => userConfig.hand.enabled = val);
  menu.models.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.models.addBool('gestures', userConfig.gesture, 'enabled', (val) => userConfig.gesture.enabled = val);
  menu.models.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.models.addBool('body segmentation', userConfig.segmentation, 'enabled', (val) => userConfig.segmentation.enabled = val);
  menu.models.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.models.addBool('object detection', userConfig.object, 'enabled', (val) => userConfig.object.enabled = val);
  menu.models.addHTML('<hr style="border-style: inset; border-color: dimgray">');
  menu.models.addBool('face compare', compare, 'enabled', (val) => {
    compare.enabled = val;
    compare.original = null;
  });

  document.getElementById('btnDisplay').addEventListener('click', (evt) => menu.display.toggle(evt));
  document.getElementById('btnImage').addEventListener('click', (evt) => menu.image.toggle(evt));
  document.getElementById('btnProcess').addEventListener('click', (evt) => menu.process.toggle(evt));
  document.getElementById('btnModel').addEventListener('click', (evt) => menu.models.toggle(evt));
  document.getElementById('btnStart').addEventListener('click', () => detectVideo());
  document.getElementById('play').addEventListener('click', () => detectVideo());
}

async function resize() {
  window.onresize = null;
  // best setting for mobile, ignored for desktop
  // can set dynamic value such as Math.min(1, Math.round(100 * window.innerWidth / 960) / 100);
  const viewportScale = 0.7;
  if (!ui.viewportSet) {
    const viewport = document.querySelector('meta[name=viewport]');
    viewport.setAttribute('content', `width=device-width, shrink-to-fit=yes, minimum-scale=0.2, maximum-scale=2.0, user-scalable=yes, initial-scale=${viewportScale}`);
    ui.viewportSet = true;
  }
  const x = [`${document.getElementById('btnDisplay').offsetLeft}px`, `${document.getElementById('btnImage').offsetLeft}px`, `${document.getElementById('btnProcess').offsetLeft}px`, `${document.getElementById('btnModel').offsetLeft}px`];

  const top = `${document.getElementById('menubar').clientHeight - 3}px`;

  menu.display.menu.style.top = top;
  menu.image.menu.style.top = top;
  menu.process.menu.style.top = top;
  menu.models.menu.style.top = top;
  menu.display.menu.style.left = x[0];
  menu.image.menu.style.left = x[1];
  menu.process.menu.style.left = x[2];
  menu.models.menu.style.left = x[3];

  const fontSize = Math.trunc(10 * (1 - viewportScale)) + 14;
  document.documentElement.style.fontSize = `${fontSize}px`;
  human.draw.options.font = `small-caps ${fontSize}px "Segoe UI"`;
  human.draw.options.lineHeight = fontSize + 2;

  await setupCamera();
  window.onresize = resize;
}

async function drawWarmup(res) {
  const canvas = document.getElementById('canvas');
  canvas.width = res.canvas.width;
  canvas.height = res.canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(res.canvas, 0, 0, res.canvas.width, res.canvas.height, 0, 0, canvas.width, canvas.height);
  await human.draw.all(canvas, res, drawOptions);
}

async function processDataURL(f, action) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (action === 'process') {
        if (e.target.result.startsWith('data:image')) await processImage(e.target.result, f.name);
        if (e.target.result.startsWith('data:video')) await processVideo(e.target.result, f.name);
        document.getElementById('canvas').style.display = 'none';
      }
      if (action === 'background') {
        const image = new Image();
        image.onerror = async () => status('image loading error');
        image.onload = async () => {
          ui.background = image;
          if (document.getElementById('canvas').style.display === 'block') { // replace canvas used for video
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            const overlaid = await human.segmentation(canvas, ui.background, userConfig);
            if (overlaid) ctx.drawImage(overlaid, 0, 0);
          } else {
            const canvases = document.getElementById('samples-container').children; // replace loaded images
            for (const canvas of canvases) {
              const ctx = canvas.getContext('2d');
              const overlaid = await human.segmentation(canvas, ui.background, userConfig);
              if (overlaid) ctx.drawImage(overlaid, 0, 0);
            }
          }
        };
        image.src = e.target.result;
      }
      resolve(true);
    };
    reader.readAsDataURL(f);
  });
}

async function runSegmentation() {
  document.getElementById('file-background').onchange = async (evt) => {
    userConfig.segmentation.enabled = true;
    evt.preventDefault();
    if (evt.target.files.length < 2) ui.columns = 1;
    for (const f of evt.target.files) await processDataURL(f, 'background');
  };
}

async function dragAndDrop() {
  document.body.addEventListener('dragenter', (evt) => evt.preventDefault());
  document.body.addEventListener('dragleave', (evt) => evt.preventDefault());
  document.body.addEventListener('dragover', (evt) => evt.preventDefault());
  document.body.addEventListener('drop', async (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
    if (evt.dataTransfer.files.length < 2) ui.columns = 1;
    for (const f of evt.dataTransfer.files) await processDataURL(f, 'process');
  });
  document.getElementById('file-input').onchange = async (evt) => {
    evt.preventDefault();
    if (evt.target.files.length < 2) ui.columns = 1;
    for (const f of evt.target.files) await processDataURL(f, 'process');
  };
}

async function drawHints() {
  const hint = document.getElementById('hint');
  ui.hintsThread = setInterval(() => {
    const rnd = Math.trunc(Math.random() * hints.length);
    hint.innerText = 'hint: ' + hints[rnd];
    hint.style.opacity = 1;
    setTimeout(() => {
      hint.style.opacity = 0;
    }, 4500);
  }, 5000);
}

async function pwaRegister() {
  if (!pwa.enabled) return;
  if ('serviceWorker' in navigator) {
    try {
      let found;
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        log('pwa found:', reg.scope);
        if (reg.scope.startsWith(location.origin)) found = reg;
      }
      if (!found) {
        const reg = await navigator.serviceWorker.register(pwa.scriptFile, { scope: location.pathname });
        found = reg;
        log('pwa registered:', reg.scope);
      }
    } catch (err) {
      if (err.name === 'SecurityError') log('pwa: ssl certificate is untrusted');
      else log('pwa error:', err);
    }
    if (navigator.serviceWorker.controller) {
      // update pwa configuration as it doesn't have access to it
      navigator.serviceWorker.controller.postMessage({ key: 'cacheModels', val: pwa.cacheModels });
      navigator.serviceWorker.controller.postMessage({ key: 'cacheWASM', val: pwa.cacheWASM });
      navigator.serviceWorker.controller.postMessage({ key: 'cacheOther', val: pwa.cacheOther });

      log('pwa ctive:', navigator.serviceWorker.controller.scriptURL);
      const cache = await caches.open(pwa.cacheName);
      if (cache) {
        const content = await cache.matchAll();
        log('pwa cache:', content.length, 'files');
      }
    }
  } else {
    log('pwa inactive');
  }
}

async function main() {
  window.addEventListener('unhandledrejection', (evt) => {
    // eslint-disable-next-line no-console
    console.error(evt.reason || evt);
    document.getElementById('log').innerHTML = evt.reason.message || evt.reason || evt;
    status('exception error');
    evt.preventDefault();
  });

  log('demo starting ...');

  document.documentElement.style.setProperty('--icon-size', ui.iconSize);

  drawHints();

  // sanity check for webworker compatibility
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    ui.useWorker = false;
    log('workers are disabled due to missing browser functionality');
  }

  // register PWA ServiceWorker
  await pwaRegister();

  // parse url search params
  const params = new URLSearchParams(location.search);
  log('url options:', params.toString());
  if (params.has('worker')) {
    ui.useWorker = JSON.parse(params.get('worker'));
    log('overriding worker:', ui.useWorker);
  }
  if (params.has('backend')) {
    userConfig.backend = params.get('backend');
    log('overriding backend:', userConfig.backend);
  }
  if (params.has('preload')) {
    ui.modelsPreload = JSON.parse(params.get('preload'));
    log('overriding preload:', ui.modelsPreload);
  }
  if (params.has('warmup')) {
    ui.modelsWarmup = JSON.parse(params.get('warmup'));
    log('overriding warmup:', ui.modelsWarmup);
  }

  // create instance of human
  human = new Human(userConfig);
  userConfig = { ...human.config, ...userConfig };
  if (typeof tf !== 'undefined') {
    // eslint-disable-next-line no-undef
    log('TensorFlow external version:', tf.version);
    // eslint-disable-next-line no-undef
    human.tf = tf; // use externally loaded version of tfjs
  }

  // setup main menu
  await setupMenu();
  await resize();
  document.getElementById('log').innerText = `META VISION:  ${human.version}`;

  // preload models
  if (ui.modelsPreload && !ui.useWorker) {
    status('loading');
    await human.load(userConfig); // this is not required, just pre-loads all models
    const loaded = Object.keys(human.models).filter((a) => human.models[a]);
    log('demo loaded models:', loaded);
  }

  // warmup models
  if (ui.modelsWarmup && !ui.useWorker) {
    status('initializing');
    if (!userConfig.warmup || userConfig.warmup === 'none') userConfig.warmup = 'full';
    const res = await human.warmup(userConfig); // this is not required, just pre-warms all models for faster initial inference
    if (res && res.canvas && ui.drawWarmup) await drawWarmup(res);
  }

  // ready
  status('META VISION+');
  document.getElementById('loader').style.display = 'none';
  document.getElementById('play').style.display = 'block';
  for (const m of Object.values(menu)) m.hide();

  // init drag & drop
  await dragAndDrop();

  // init segmentation
  await runSegmentation();

  if (params.has('image')) {
    try {
      const image = JSON.parse(params.get('image'));
      log('overriding image:', image);
      ui.samples = [image];
      ui.columns = 1;
    } catch {
      status('cannot parse input image');
      log('cannot parse input image', params.get('image'));
      ui.samples = [];
    }
    if (ui.samples.length > 0) await detectSampleImages();
  }

  if (params.has('images')) {
    log('overriding images list:', JSON.parse(params.get('images')));
    await detectSampleImages();
  }
}

window.onload = main;
