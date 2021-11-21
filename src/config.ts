/* eslint-disable indent */
/* eslint-disable no-multi-spaces */

/** Generic config type inherited by all module types */
export interface GenericConfig {
  /** is module enabled? */
  enabled: boolean,
  /** path to model json file */
  modelPath: string,
  /** how many max frames to go without re-running model if cached results are acceptable */
  skipFrames: number,
  /** how many max miliseconds to go without re-running model if cached results are acceptable */
  skipTime: number,
}

/** Dectector part of face configuration */
export interface FaceDetectorConfig extends GenericConfig {
  /** is face rotation correction performed after detecting face? */
  rotation: boolean,
  /** maximum number of detected faces */
  maxDetected: number,
  /** minimum confidence for a detected face before results are discarded */
  minConfidence: number,
  /** minimum overlap between two detected faces before one is discarded */
  iouThreshold: number,
  /** factor used to expand detected face before further analysis
   * - default: 1.6
   * - for high-quality inputs can be reduced to increase precision
   * - for video inputs or low-quality inputs can be increased to allow for more flexible tracking
   */
  cropFactor: number,
  /** should child models perform on masked image of a face */
  mask: boolean,
  /** should face detection return face tensor to be used in some other extenrnal model? */
  return: boolean,
}

/** Mesh part of face configuration */
export interface FaceMeshConfig extends GenericConfig {}

/** Iris part of face configuration */
export interface FaceIrisConfig extends GenericConfig {}

/** Description or face embedding part of face configuration
 * - also used by age and gender detection
 */
export interface FaceDescriptionConfig extends GenericConfig {
  /** minimum confidence for a detected face before results are discarded */
  minConfidence: number,
}

/** Emotion part of face configuration */
export interface FaceEmotionConfig extends GenericConfig {
  /** minimum confidence for a detected face before results are discarded */
  minConfidence: number,
}

/** Anti-spoofing part of face configuration */
export interface FaceAntiSpoofConfig extends GenericConfig {}

/** Liveness part of face configuration */
export interface FaceLivenessConfig extends GenericConfig {}

/** Configures all face-specific options: face detection, mesh analysis, age, gender, emotion detection and face description */
export interface FaceConfig extends GenericConfig {
  detector: Partial<FaceDetectorConfig>,
  mesh: Partial<FaceMeshConfig>,
  iris: Partial<FaceIrisConfig>,
  description: Partial<FaceDescriptionConfig>,
  emotion: Partial<FaceEmotionConfig>,
  antispoof: Partial<FaceAntiSpoofConfig>,
  liveness: Partial<FaceLivenessConfig>,
}

/** Configures all body detection specific options */
export interface BodyConfig extends GenericConfig {
  /** maximum numboer of detected bodies */
  maxDetected: number,
  /** minimum confidence for a detected body before results are discarded */
  minConfidence: number,
  /** detector used for body model before actual analysis */
  detector?: {
    /** path to optional body detector model json file */
    modelPath: string
  },
}

/** Configures all hand detection specific options */
export interface HandConfig extends GenericConfig {
  /** should hand rotation correction be performed after hand detection? */
  rotation: boolean,
  /** minimum confidence for a detected hand before results are discarded */
  minConfidence: number,
  /** minimum overlap between two detected hands before one is discarded */
  iouThreshold: number,
  /** maximum number of detected hands */
  maxDetected: number,
  /** should hand landmarks be detected or just return detected hand box */
  landmarks: boolean,
  detector: {
    /** path to hand detector model json */
    modelPath?: string,
  },
  skeleton: {
    /** path to hand skeleton model json */
    modelPath?: string,
  },
}

/** Configures all object detection specific options */
export interface ObjectConfig extends GenericConfig {
  /** minimum confidence for a detected objects before results are discarded */
  minConfidence: number,
  /** minimum overlap between two detected objects before one is discarded */
  iouThreshold: number,
  /** maximum number of detected objects */
  maxDetected: number,
}

/** Configures all body segmentation module
 * removes background from input containing person
 * if segmentation is enabled it will run as preprocessing task before any other model
 * alternatively leave it disabled and use it on-demand using human.segmentation method which can
 * remove background or replace it with user-provided background
*/
export interface SegmentationConfig extends GenericConfig {
  /** blur segmentation output by <number> pixels for more realistic image */
  blur: number,
}

/** Run input through image filters before inference
 * - available only in Browser environments
 * - image filters run with near-zero latency as they are executed on the GPU using WebGL
*/
export interface FilterConfig {
  /** are image filters enabled? */
  enabled: boolean,
  /** perform image histogram equalization
   * - equalization is performed on input as a whole and detected face before its passed for further analysis
  */
  equalization: boolean,
  /** resize input width
  * - if both width and height are set to 0, there is no resizing
  * - if just one is set, second one is scaled automatically
  * - if both are set, values are used as-is
  */
  width: number,
  /** resize input height
  * - if both width and height are set to 0, there is no resizing
  * - if just one is set, second one is scaled automatically
  * - if both are set, values are used as-is
  */
  height: number,
  /** return processed canvas imagedata in result */
  return: boolean,
  /** flip input as mirror image */
  flip: boolean,
  /** range: -1 (darken) to 1 (lighten) */
  brightness: number,
  /** range: -1 (reduce contrast) to 1 (increase contrast) */
  contrast: number,
  /** range: 0 (no sharpening) to 1 (maximum sharpening) */
  sharpness: number,
  /** range: 0 (no blur) to N (blur radius in pixels) */
  blur: number
  /** range: -1 (reduce saturation) to 1 (increase saturation) */
  saturation: number,
  /** range: 0 (no change) to 360 (hue rotation in degrees) */
  hue: number,
  /** image negative */
  negative: boolean,
  /** image sepia colors */
  sepia: boolean,
  /** image vintage colors */
  vintage: boolean,
  /** image kodachrome colors */
  kodachrome: boolean,
  /** image technicolor colors */
  technicolor: boolean,
  /** image polaroid camera effect */
  polaroid: boolean,
  /** range: 0 (no pixelate) to N (number of pixels to pixelate) */
  pixelate: number,
}

/** Controlls gesture detection */
export interface GestureConfig {
  /** is gesture detection enabled? */
  enabled: boolean,
}
/** Possible TensorFlow backends */
export type BackendType = ['cpu', 'wasm', 'webgl', 'humangl', 'tensorflow', 'webgpu'];

/** Possible values for `human.warmup` */
export type WarmupType = ['' | 'none' | 'face' | 'full' | 'body'];

/**
 * Configuration interface definition for **Human** library
 * Contains all configurable parameters
 * Defaults: [config](https://github.com/vladmandic/human/blob/main/src/config.ts#L262)
 */
export interface Config {
  /** Backend used for TFJS operations
   * valid build-in backends are:
   * - Browser: `cpu`, `wasm`, `webgl`, `humangl`, `webgpu`
   * - NodeJS: `cpu`, `wasm`, `tensorflow`
   * default: `humangl` for browser and `tensorflow` for nodejs
  */
  backend: '' | 'cpu' | 'wasm' | 'webgl' | 'humangl' | 'tensorflow' | 'webgpu',

  /** Path to *.wasm files if backend is set to `wasm`
   *
   * default: auto-detects to link to CDN `jsdelivr` when running in browser
  */
  wasmPath: string,

  /** Print debug statements to console
   *
   * default: `true`
  */
  debug: boolean,

  /** Perform model loading and inference concurrently or sequentially
   *
   * default: `true`
  */
  async: boolean,

  /** What to use for `human.warmup()`
   * - warmup pre-initializes all models for faster inference but can take significant time on startup
   * - used by `webgl`, `humangl` and `webgpu` backends
   *
   * default: `full`
  */
  warmup: '' | 'none' | 'face' | 'full' | 'body',
  // warmup: string;

  /** Base model path (typically starting with file://, http:// or https://) for all models
   * - individual modelPath values are relative to this path
   *
   * default: `../models/` for browsers and `file://models/` for nodejs
  */
  modelBasePath: string,

  /** Cache sensitivity
   * - values 0..1 where 0.01 means reset cache if input changed more than 1%
   * - set to 0 to disable caching
   *
   * default: 0.7
  */
  cacheSensitivity: number;

  /** Perform immediate garbage collection on deallocated tensors instead of caching them */
  deallocate: boolean;

  /** Internal Variable */
  skipAllowed: boolean;

  /** Filter config {@link FilterConfig} */
  filter: Partial<FilterConfig>,

  /** Gesture config {@link GestureConfig} */
  gesture: Partial<GestureConfig>;

  /** Face config {@link FaceConfig} */
  face: Partial<FaceConfig>,

  /** Body config {@link BodyConfig} */
  body: Partial<BodyConfig>,

  /** Hand config {@link HandConfig} */
  hand: Partial<HandConfig>,

  /** Object config {@link ObjectConfig} */
  object: Partial<ObjectConfig>,

  /** Segmentation config {@link SegmentationConfig} */
  segmentation: Partial<SegmentationConfig>,
}

/** - [See all default Config values...](https://github.com/vladmandic/human/blob/main/src/config.ts#L262) */
const config: Config = {
  backend: '',
  modelBasePath: '',
  wasmPath: '',
  debug: true,
  async: true,
  warmup: 'full',
  cacheSensitivity: 0.70,
  skipAllowed: false,
  deallocate: false,
  filter: {
    enabled: true,
    equalization: false,
    width: 0,
    height: 0,
    flip: false,
    return: true,
    brightness: 0,
    contrast: 0,
    sharpness: 0,
    blur: 0,
    saturation: 0,
    hue: 0,
    negative: false,
    sepia: false,
    vintage: false,
    kodachrome: false,
    technicolor: false,
    polaroid: false,
    pixelate: 0,
  },
  gesture: {
    enabled: true,
  },
  face: {
    enabled: true,
    detector: {
      modelPath: 'blazeface.json',
      rotation: true,
      maxDetected: 1,
      skipFrames: 99,
      skipTime: 2500,
      minConfidence: 0.2,
      iouThreshold: 0.1,
      cropFactor: 1.6,
      mask: false,
      return: false,
    },
    mesh: {
      enabled: true,
      modelPath: 'facemesh.json',
    },
    iris: {
      enabled: true,
      modelPath: 'iris.json',
    },
    emotion: {
      enabled: true,
      minConfidence: 0.1,
      skipFrames: 99,
      skipTime: 1500,
      modelPath: 'emotion.json',
    },
    description: {
      enabled: true,
      modelPath: 'faceres.json',
      skipFrames: 99,
      skipTime: 3000,
      minConfidence: 0.1,
    },
    antispoof: {
      enabled: false,
      skipFrames: 99,
      skipTime: 4000,
      modelPath: 'antispoof.json',
    },
    liveness: {
      enabled: false,
      skipFrames: 99,
      skipTime: 4000,
      modelPath: 'liveness.json',
    },
  },
  body: {
    enabled: true,
    modelPath: 'movenet-lightning.json',
    detector: {
      modelPath: '',
    },
    maxDetected: -1,
    minConfidence: 0.3,
    skipFrames: 1,
    skipTime: 200,
  },
  hand: {
    enabled: true,
    rotation: true,
    skipFrames: 99,
    skipTime: 1000,
    minConfidence: 0.50,
    iouThreshold: 0.2,
    maxDetected: -1,
    landmarks: true,
    detector: {
      modelPath: 'handtrack.json',
    },
    skeleton: {
      modelPath: 'handlandmark-full.json',
    },
  },
  object: {
    enabled: false,
    modelPath: 'mb3-centernet.json',
    minConfidence: 0.2,
    iouThreshold: 0.4,
    maxDetected: 10,
    skipFrames: 99,
    skipTime: 2000,
  },
  segmentation: {
    enabled: false,
    modelPath: 'selfie.json',
    blur: 8,
  },
};

export { config as defaults };
