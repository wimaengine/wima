import {
  BasicMaterial,
  Mesh,
  World,
  Cleanup,
  EntityCommands,
  createMovable2D,
  Rotation2D,
  Meshed,
  BasicMaterial2D,
  PI,
  Query,
  BasicMaterialAssets,
  MeshAssets,
  AppSchedule,
  Canvas2DRendererPlugin,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  App
} from 'wima'
import { addDefaultCamera2D, HackPlugin, setupViewport } from '../../utils.js'

const app = new App()
app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerPlugin(new Canvas2DRendererPlugin())
  .registerSystem(AppSchedule.Startup, addmesh)
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, update)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerDebugger(new FPSDebugger())
  .run()
/**
 * @param {World} world
 */
function addmesh(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(50, 50))
  const material = materials.add(new BasicMaterial())

  commands
    .spawn()
    .insertPrefab([
      ...createMovable2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Cleanup()
    ])
    .insert(new Rotation2D(PI))
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const query = new Query(world, [Rotation2D, Meshed])

  query.each(([rotation]) => {
    rotation.value = PI
  })
}
