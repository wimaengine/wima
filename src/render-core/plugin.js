import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin } from '../asset/index.js'
import { BasicMaterial2D, Camera, MaterialHandle, Meshed, MeshHandle } from './components/index.js'
import { Material, Mesh, Shader, Image, BasicMaterial } from './assets/index.js'
import { ImageParser } from './resources/index.js'
import { Material2DPlugin } from './plugins/index.js'

export class RenderCorePlugin extends Plugin {

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
      .registerPlugin(new AssetPlugin({
        asset:BasicMaterial
      }))
      .registerPlugin(new Material2DPlugin({
        asset: BasicMaterial,
        component: BasicMaterial2D
      }))
  }
}