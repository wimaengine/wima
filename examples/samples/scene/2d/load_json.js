import {
  App,
  AppSchedule,
  AssetServer,
  BasicMaterial,
  BasicMaterialAssets,
  Canvas2DRendererPlugin,
  Color,
  createTransform2D,
  DefaultPlugin,
  DOMWindowPlugin,
  EntityCommands,
  FPSDebugger,
  Mesh,
  MeshAssets,
  Scene,
  SceneInstance,
  World
} from 'wima'
import { HackPlugin, setupViewport } from '../../utils.js'

// NOTE: This is here because scenes dont support resources nor assets.
// Also asset dependencies need to be supported too in order to load
// the external dependencies from the server/disk.
// when that lands, this example should support them natively.
// TODO: Move this to use internal scene assets when the above land
class SceneAssetHandles {

  /** @type {import('wima').Handle<Mesh> | undefined} */
  meshHandle

  /** @type {import('wima').Handle<BasicMaterial> | undefined} */
  materialHandle
}

const app = new App()

app
  .registerSystem({ schedule: AppSchedule.Startup, system: init })
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function init(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)
  const server = world.getResource(AssetServer)
  const handles = new SceneAssetHandles()

  handles.meshHandle = meshes.add(Mesh.circle2D(0.18, 14))
  handles.materialHandle = materials.add(new BasicMaterial({
    color: new Color(0.95, 0.8, 0.2)
  }))
  world.setResource(handles)

  const sceneHandle = server.load(Scene, '/scene/basic.json')

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new SceneInstance(sceneHandle)
    ])
    .build()
}
