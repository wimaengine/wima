import { AnimationClip } from './assets/index.js';

export class AnimationPlugin {
  register(app) {
    app
      .registerAsset(AnimationClip)
  }
}