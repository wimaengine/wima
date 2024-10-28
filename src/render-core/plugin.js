import { App } from '../app/index.js'
import { Image } from '../asset/index.js'
import { Camera, MaterialHandle, MeshHandle } from './components/index.js'
import { Material, Mesh } from './assets/index.js'
import { ImageParser } from './resources/index.js'

export class RenderCorePlugin {

  /**
   * @param {App} app 
   */
  register(app) {
    app
      .registerAsset(Image)
      .registerAssetParser(Image, new ImageParser())
      .registerAsset(Mesh, (id) => new MeshHandle(id))
      .registerAsset(Material, (id) => new MaterialHandle(id))
      .registerType(MeshHandle)
      .registerType(MaterialHandle)
      .registerType(Camera)
  }
}