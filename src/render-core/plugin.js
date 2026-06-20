import { App, Plugin } from '../app/index.js'
import { AppSchedule, CoreSystems } from '../core/index.js'
import { AssetImporterPlugin, AssetPlugin, Assets } from '../asset/index.js'
import { ComponentHooks } from '../ecs/index.js'
import {
  BasicMaterialInstance,
  Camera,
  Meshed,
  removeMeshedHandle
} from './components/index.js'
import { Mesh, Shader, Image, BasicMaterial } from './assets/index.js'
import { BasicMaterialAssets, ImageAssets, ImageImporter, MeshAssets } from './resources/index.js'
import { MaterialInstancePlugin } from './plugins/index.js'
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
import { typeidGeneric } from '../type/index.js'
import { registerRenderCoreTypes } from './systems/index.js'

export class RenderCorePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    const world = app.getWorld()

    app
      .registerType(Meshed)
      .setComponentHooks(Meshed, new ComponentHooks(
        null,
        removeMeshedHandle
      ))
      .registerType(Camera)
      .registerSystem({ schedule: AppSchedule.Startup, systemGroup: CoreSystems.Start, system: registerRenderCoreTypes })
      .registerPlugin(new AssetPlugin({
        asset: Image,
        events: {
          added: ImageAdded,
          modified: ImageModified,
          dropped: ImageDropped
        }
      }))
      .registerPlugin(new AssetImporterPlugin({
        asset: Image,
        importer: new ImageImporter()
      }))
      .registerPlugin(new AssetPlugin({
        asset: Mesh,
        events: {
          added: MeshAdded,
          modified: MeshModified,
          dropped: MeshDropped
        }
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
        asset: BasicMaterial,
        events: {
          added: BasicMaterialAdded,
          modified: BasicMaterialModified,
          dropped: BasicMaterialDropped
        }
      }))
      .registerPlugin(new MaterialInstancePlugin({
        asset: BasicMaterial,
        component: BasicMaterialInstance
      }))
    world.setResourceAlias(typeidGeneric(Assets, [Image]), ImageAssets)
    world.setResourceAlias(typeidGeneric(Assets, [Mesh]), MeshAssets)
    world.setResourceAlias(typeidGeneric(Assets, [BasicMaterial]), BasicMaterialAssets)

  }
}
