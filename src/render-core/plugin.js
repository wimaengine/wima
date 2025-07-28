import { App, Plugin } from '../app/index.js'
import { AssetParserPlugin, AssetPlugin, Assets } from '../asset/index.js'
import { BasicMaterial2D, BasicMaterial3D, Camera, MaterialHandle, Meshed, MeshHandle } from './components/index.js'
import { Material, Mesh, Shader, Image, BasicMaterial } from './assets/index.js'
import { BasicMaterialAssets, ImageAssets, ImageParser, MeshAssets } from './resources/index.js'
import { Material2DPlugin, Material3DPlugin } from './plugins/index.js'
import { typeidGeneric } from '../reflect/index.js'

export class RenderCorePlugin extends Plugin {

  /**
   * @param {App} app 
   */
  register(app) {
    const world = app.getWorld()

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
      .registerPlugin(new Material3DPlugin({
        asset: BasicMaterial,
        component: BasicMaterial3D
      }))

    world.setResourceAlias(typeidGeneric(Assets, [Image]), ImageAssets)
    world.setResourceAlias(typeidGeneric(Assets, [Mesh]), MeshAssets)
    world.setResourceAlias(typeidGeneric(Assets, [BasicMaterial]), BasicMaterialAssets)

  }
}