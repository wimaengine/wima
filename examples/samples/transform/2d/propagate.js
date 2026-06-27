import {
  World,
  VirtualClock,
  BasicMaterial,
  createBasicMesh2D,
  EntityCommands,
  Mesh,
  Parent,
  Query,
  Children,
  Orientation2D,
  BasicMaterialAssets,
  MeshAssets,
  without,
  has,
  PI,
  QUARTER_PI,
  Rotary,
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
  .registerSystem({ schedule: AppSchedule.Startup, system: addMeshes })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera2D })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewport })
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function addMeshes(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.circle2D(0.1))
  const material = materials.add(new BasicMaterial())

  const parent = commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh2D(mesh, material)])
    .build()

  const child = commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh2D(mesh, material, 0.4, 0, 0, 0.5, 0.5),
      new Parent(parent)])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh2D(mesh, material, 0.4, 0, 0, 0.5, 0.5),
      new Parent(child)
    ])
    .build()

}

/**
 * @param {World} world
 */
function update(world) {
  const parent = new Query(world, [Orientation2D], [has(Children), without(Parent)]).single()
  const child = new Query(world, [Orientation2D], [has(Children), has(Parent)]).single()
  const grandChild = new Query(world, [Orientation2D], [has(Parent), without(Children)]).single()
  const delta = world.getResource(VirtualClock).getDelta()

  if (!parent || !child || !grandChild) return

  parent[0].multiply(Rotary.fromAngle(QUARTER_PI * delta))
  child[0].multiply(Rotary.fromAngle(QUARTER_PI * delta))
  grandChild[0].multiply(Rotary.fromAngle(PI * delta))
}
