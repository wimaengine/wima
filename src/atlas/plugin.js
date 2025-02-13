import { RectAtlas } from './assets/index.js';
export class TextureAtlasPlugin {
  register(app) {
    App
      .registerAsset(RectAtlas)
  }
}