/**
 * Human demo for browsers
 *
 * @description Demo app that enables all Human modules and runs them in separate worker threads
 *
 */
// @ts-nocheck // typescript checks disabled as this is pure javascript

import Human from '../../dist/human.esm.js'; // equivalent of @vladmandic/human
import GLBench from '../helpers/gl-bench.js';

const workerJS = './worker.js';

const config = {
  main: { // processes input and runs gesture analysis
    warmup: 'none',
    backend: 'humangl',
    modelBasePath: '../../models/',
    async: false,
    filter: { enabled: true },
    face: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: true },
    hand: { enabled: false },
    body: { enabled: false },
    segmentation: { enabled: false },
  },
  face: { // runs all face models
    warmup: 'none',
    backend: 'humangl',
    modelBasePath: '../../models/',
    async: false,
    filter: { enabled: false },
    face: { enabled: true },
    object: { enabled: false },
    gesture: { enabled: false },
    hand: { enabled: false },
    body: { enabled: false },
    segmentation: { enabled: false },
  },
  body: { // runs body model
    warmup: 'none',
    backend: 'humangl',
    modelBasePath: '../../models/',
    async: false,
    filter: { enabled: false },
    face: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: false },
    hand: { enabled: false },
    body: { enabled: true },
    segmentation: { enabled: false },
  },
  hand: { // runs hands model
    warmup: 'none',
    backend: 'humangl',
    modelBasePath: '../../models/',
    async: false,
    filter: { enabled: false },
    face: { enabled: false },
    object: { enabled: false },
    gesture: { enabled: false },
    hand: { enabled: true },
    body: { enabled: false },
    segmentation: { enabled: false },
  },
  object: { // runs object model
    warmup: 'none',
    backend: 'humangl',
    modelBasePath: '../../models/',
    async: false,
    filter: { enabled: false },
    face: { enabled: false },
    object: { enabled: true },
    gesture: { enabled: false },
    hand: { enabled: false },
    body: { enabled: false },
    segmentation: { enabled: false },
  },
};

let human;
let canvas;
let video;
let bench;

const busy = {
  face: false,
  hand: false,
  body: false,
  object: false,
};

const workers = {
  face: null,
  body: null,
  hand: null,
  object: null,
};

const time = {
  main: 0,
  draw: 0,
  face: '[warmup]',
  body: '[warmup]',
  hand: '[warmup]',
  object: '[warmup]',
};

const start = {
  main: 0,
  draw: 0,
  face: 0,
  body: 0,
  hand: 0,
  object: 0,
};

const result = { // initialize empty result object which will be partially filled with results from each thread
  performance: {},
  hand: [],
  body: [],
  face: [],
  object: [],
};

function log(...msg) {
  const dt = new Date();
  const ts = `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}.${dt.getMilliseconds().toString().padStart(3, '0')}`;
  // eslint-disable-next-line no-console
  console.log(ts, ...msg);
}

async function drawResults() {
  start.draw = performance.now();
  const interpolated = human.next(result);
  await human.draw.all(canvas, interpolated);
  time.draw = Math.round(1 + performance.now() - start.draw);
  const fps = Math.round(10 * 1000 / time.main) / 10;
  const draw = Math.round(10 * 1000 / time.draw) / 10;
  document.getElementById('log').innerText = `Human: version ${human.version} | Performance: Main ${time.main}ms Face: ${time.face}ms Body: ${time.body}ms Hand: ${time.hand}ms Object ${time.object}ms | FPS: ${fps} / ${draw}`;
  requestAnimationFrame(drawResults);
}

async function receiveMessage(msg) {
  result[msg.data.type] = msg.data.result;
  busy[msg.data.type] = false;
  time[msg.data.type] = Math.round(performance.now() - start[msg.data.type]);
}

async function runDetection() {
  start.main = performance.now();
  if (!bench) {
    bench = new GLBench(null, { trackGPU: false, chartHz: 20, chartLen: 20 });
    bench.begin();
  }
  const ctx = canvas.getContext('2d');
  // const image = await human.image(video);
  // ctx.drawImage(image.canvas, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  if (!busy.face) {
    busy.face = true;
    start.face = performance.now();
    workers.face.postMessage({ image: imageData.data.buffer, width: canvas.width, height: canvas.height, config: config.face, type: 'face' }, [imageData.data.buffer.slice(0)]);
  }
  if (!busy.body) {
    busy.body = true;
    start.body = performance.now();
    workers.body.postMessage({ image: imageData.data.buffer, width: canvas.width, height: canvas.height, config: config.body, type: 'body' }, [imageData.data.buffer.slice(0)]);
  }
  if (!busy.hand) {
    busy.hand = true;
    start.hand = performance.now();
    workers.hand.postMessage({ image: imageData.data.buffer, width: canvas.width, height: canvas.height, config: config.hand, type: 'hand' }, [imageData.data.buffer.slice(0)]);
  }
  if (!busy.object) {
    busy.object = true;
    start.object = performance.now();
    workers.object.postMessage({ image: imageData.data.buffer, width: canvas.width, height: canvas.height, config: config.object, type: 'object' }, [imageData.data.buffer.slice(0)]);
  }

  time.main = Math.round(performance.now() - start.main);

  bench.nextFrame();
  requestAnimationFrame(runDetection);
}

async function setupCamera() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  const output = document.getElementById('log');
  let stream;
  const constraints = {
    audio: false,
    video: {
      facingMode: 'user',
      resizeMode: 'crop-and-scale',
      width: { ideal: document.body.clientWidth },
      // height: { ideal: document.body.clientHeight }, // not set as we're using aspectRation to get height instead
      aspectRatio: document.body.clientWidth / document.body.clientHeight,
    },
  };
  // enumerate devices for diag purposes
  navigator.mediaDevices.enumerateDevices().then((devices) => log('enumerated devices:', devices));
  log('camera constraints', constraints);
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    output.innerText += `\n${err.name}: ${err.message}`;
    status(err.name);
    log('camera error:', err);
  }
  const tracks = stream.getVideoTracks();
  log('enumerated viable tracks:', tracks);
  const track = stream.getVideoTracks()[0];
  const settings = track.getSettings();
  log('selected video source:', track, settings);
  const promise = !stream || new Promise((resolve) => {
    video.onloadeddata = () => {
      if (settings.width > settings.height) canvas.style.width = '100vw';
      else canvas.style.height = '100vh';
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.play();
      resolve();
    };
  });
  // attach input to video element
  if (stream) video.srcObject = stream;
  return promise;
}

async function startWorkers() {
  if (!workers.face) workers.face = new Worker(workerJS);
  if (!workers.body) workers.body = new Worker(workerJS);
  if (!workers.hand) workers.hand = new Worker(workerJS);
  if (!workers.object) workers.object = new Worker(workerJS);
  workers.face.onmessage = receiveMessage;
  workers.body.onmessage = receiveMessage;
  workers.hand.onmessage = receiveMessage;
  workers.object.onmessage = receiveMessage;
}

async function main() {
  window.addEventListener('unhandledrejection', (evt) => {
    // eslint-disable-next-line no-console
    console.error(evt.reason || evt);
    document.getElementById('log').innerHTML = evt.reason.message || evt.reason || evt;
    status('exception error');
    evt.preventDefault();
  });

  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    status('workers are not supported');
    return;
  }

  human = new Human(config.main);
  document.getElementById('log').innerText = `Human: version ${human.version}`;

  await startWorkers();
  await setupCamera();
  runDetection();
  drawResults();
}

window.onload = main;
