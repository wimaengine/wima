import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin } from '../asset/index.js'
import { Camera, MaterialHandle, MeshHandle, Meshed } from './components/index.js'
import { Material, Mesh, Shader, Image } from './assets/index.js'
import { ImageParser } from './resources/index.js'

export class RenderCorePlugin extends Plugin{

  /**
   * @param {App} app 
   */
  register(app) {
    app
      .registerType(MeshHandle)
      .registerType(MaterialHandle)
      .registerType(Meshed)
      .registerType(Camera)
      .registerPlugin(new AssetPlugin({
        asset: Image
      }))
      .registerPlugin(new AssetParserPlugin({
        asset: Image,
        parser: new ImageParser()
      }))
      .registerPlugin(new AssetPlugin({
        asset: Mesh,
        handleprovider: (id) => new MeshHandle(id)
      }))
      .registerPlugin(new AssetPlugin({
        asset: Shader
      }))
      .registerPlugin(new AssetPlugin({
        asset: Material,
        handleprovider: (id) => new MaterialHandle(id)
      }))
  }
}