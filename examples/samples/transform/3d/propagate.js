import {
  World,
  VirtualClock,
  BasicMaterial,
  createBasicMesh3D,
  EntityCommands,
  Mesh,
  Quaternion,
  Parent,
  Query,
  Children,
  Orientation3D,
  BasicMaterialAssets,
  MeshAssets,
  has,
  QUARTER_PI,
  without,
  App,
  AppSchedule,
  DefaultPlugin,
  DOMWindowPlugin,
  FPSDebugger,
  WebglRendererPlugin
} from 'wima'
import { addDefaultCamera3D, HackPlugin, setupViewportWebgl } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem({ schedule: AppSchedule.Startup, system: spawnMeshes })
  .registerSystem({ schedule: AppSchedule.Startup, system: addDefaultCamera3D })
  .registerSystem({ schedule: AppSchedule.Update, system: setupViewportWebgl })
  .registerSystem({ schedule: AppSchedule.Update, system: update })
  .run()

/**
 * @param {World} world
 */
function spawnMeshes(world) {
  const commands = new EntityCommands(world)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.circle3D(0.2))
  const material = materials.add(new BasicMaterial())

  const parent = commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(mesh, material)])
    .build()

  const child = commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(mesh, material, 1, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5),
      new Parent(parent)])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createBasicMesh3D(mesh, material, 0.5, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5),
      new Parent(child)
    ])
    .build()

}

/**
 * @param {World} world
 */
function update(world) {
  const parent = new Query(world, [Orientation3D], [has(Children), without(Parent)]).single()
  const child = new Query(world, [Orientation3D], [has(Children), has(Parent)]).single()
  const grandChild = new Query(world, [Orientation3D], [has(Parent), without(Children)]).single()
  const delta = world.getResource(VirtualClock).getDelta()

  if (!parent || !child || !grandChild) return

  parent[0].multiply(Quaternion.fromEuler(0, 0, QUARTER_PI * delta))
  child[0].multiply(Quaternion.fromEuler(0, 0, QUARTER_PI * delta))
  grandChild[0].multiply(Quaternion.fromEuler(0, 0, QUARTER_PI * delta))
}
