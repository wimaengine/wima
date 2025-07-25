import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin } from '../asset/index.js'
import { BasicMaterial2D, BasicMaterial3D, Camera, MaterialHandle, Meshed, MeshHandle } from './components/index.js'
import { Material, Mesh, Shader, Image, BasicMaterial } from './assets/index.js'
import { ImageParser } from './resources/index.js'
import { Material2DPlugin, Material3DPlugin } from './plugins/index.js'
import {
  ImageAdded,
  ImageDropped,
  ImageModified,
  ShaderAdded,
  ShaderDropped,
  ShaderModified,
  BasicMaterialAdded,
  BasicMaterialDropped,
  BasicMaterialModified,
  MeshAdded,
  MeshDropped,
  MeshModified
} from './events/index.js'

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
        asset: Image,
        events: {
          added: ImageAdded,
          modified: ImageModified,
          dropped: ImageDropped
        }
      }))
      .registerPlugin(new AssetParserPlugin({
        asset: Image,
        parser: new ImageParser()
      }))
      .registerPlugin(new AssetPlugin({
        asset: Mesh,
        events: {
          added: MeshAdded,
          modified: MeshModified,
          dropped: MeshDropped
        },
        handleprovider: (id) => new MeshHandle(id)
      }))
      .registerPlugin(new AssetPlugin({
        asset: Shader,
        events: {
          added: ShaderAdded,
          modified: ShaderModified,
          dropped: ShaderDropped
        }
      }))
      .registerPlugin(new AssetPlugin({
        asset: Material,
        handleprovider: (id) => new MaterialHandle(id)
      }))
      .registerPlugin(new AssetPlugin({
        asset: BasicMaterial,
        events: {
          added: BasicMaterialAdded,
          modified: BasicMaterialModified,
          dropped: BasicMaterialDropped
        }
      }))
      .registerPlugin(new Material2DPlugin({
        asset: BasicMaterial,
        component: BasicMaterial2D
      }))
      .registerPlugin(new Material3DPlugin({
        asset: BasicMaterial,
        component: BasicMaterial3D
      }))
  }
}