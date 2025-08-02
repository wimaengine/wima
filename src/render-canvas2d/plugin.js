import { App, Plugin } from '../app/index.js'
import { TextureCache, BasicMaterial } from '../render-core/index.js'
import { renderBasicMaterial } from './core/index.js'
import { Canvas2DMaterialPlugin } from './plugins/index.js'

export class Canvas2DRendererPlugin extends Plugin{

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setResource(new TextureCache())
      .registerPlugin(new Canvas2DMaterialPlugin({
        material:BasicMaterial,
        update:renderBasicMaterial
      }))
  }
}
