/**
 * Anti-spoofing model implementation
 */

import { log, join, now } from '../util/util';
import type { Config } from '../config';
import type { GraphModel, Tensor } from '../tfjs/types';
import * as tf from '../../dist/tfjs.esm.js';
import { env } from '../util/env';

let model: GraphModel | null;
const cached: Array<number> = [];
let skipped = Number.MAX_SAFE_INTEGER;
let lastCount = 0;
let lastTime = 0;

export async function load(config: Config): Promise<GraphModel> {
  if (env.initial) model = null;
  if (!model) {
    model = await tf.loadGraphModel(join(config.modelBasePath, config.face.antispoof?.modelPath || '')) as unknown as GraphModel;
    if (!model || !model['modelUrl']) log('load model failed:', config.face.antispoof?.modelPath);
    else if (config.debug) log('load model:', model['modelUrl']);
  } else if (config.debug) log('cached model:', model['modelUrl']);
  return model;
}

export async function predict(image: Tensor, config: Config, idx: number, count: number): Promise<number> {
  if (!model) return 0;
  const skipTime = (config.face.antispoof?.skipTime || 0) > (now() - lastTime);
  const skipFrame = skipped < (config.face.antispoof?.skipFrames || 0);
  if (config.skipAllowed && skipTime && skipFrame && (lastCount === count) && cached[idx]) {
    skipped++;
    return cached[idx];
  }
  skipped = 0;
  return new Promise(async (resolve) => {
    const resize = tf.image.resizeBilinear(image, [model?.inputs[0].shape ? model.inputs[0].shape[2] : 0, model?.inputs[0].shape ? model.inputs[0].shape[1] : 0], false);
    const res = model?.execute(resize) as Tensor;
    const num = (await res.data())[0];
    cached[idx] = Math.round(100 * num) / 100;
    lastCount = count;
    lastTime = now();
    tf.dispose([resize, res]);
    resolve(cached[idx]);
  });
}
