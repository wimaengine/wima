import { App, Plugin } from '@wimaengine/app'
import { AssetImporterPlugin, AssetPlugin, Assets } from '@wimaengine/asset'
import { AppSchedule, CoreSystems } from '@wimaengine/core'
import { ComponentHooks } from '@wimaengine/ecs'
import { typeidGeneric } from '@wimaengine/type'
import { Mesh, Shader, Image, BasicMaterial } from './assets'
import {
  BasicMaterialInstance,
  Meshed,
  removeMeshedHandle
} from './components'
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
} from './events'
import { MaterialInstancePlugin } from './plugins'
import { BasicMaterialAssets, ImageAssets, ImageImporter, MeshAssets } from './resources'
import { registerRenderCoreTypes } from './systems'

export class RenderCorePlugin extends Plugin {

  /**
   * @param {App} app
   */
  register(app) {
    app
      .setComponentHooks(Meshed, new ComponentHooks(
        null,
        removeMeshedHandle
      ))
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
      .setResourceAlias(typeidGeneric(Assets, [Image]), ImageAssets)
      .setResourceAlias(typeidGeneric(Assets, [Mesh]), MeshAssets)
      .setResourceAlias(typeidGeneric(Assets, [BasicMaterial]), BasicMaterialAssets)
  }
}
