import {
  Demo,
  World,
  VirtualClock,
  BasicMaterial,
  BasicMaterial3D,
  Cleanup,
  createTransform3D,
  EntityCommands,
  Mesh,
  Meshed,
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
import { addDefaultCamera3D, HackPlugin, setupViewport, setupViewportWebgl } from '../../utils.js'

const app = new App()

app
  .registerPlugin(new HackPlugin())
  .registerPlugin(new WebglRendererPlugin())
  .registerPlugin(new DefaultPlugin())
  .registerPlugin(new DOMWindowPlugin())
  .registerDebugger(new FPSDebugger())
  .registerSystem(AppSchedule.Startup, spawnMeshes)
  .registerSystem(AppSchedule.Startup, addDefaultCamera3D)
  .registerSystem(AppSchedule.Update, setupViewportWebgl)
  .registerSystem(AppSchedule.Update, update)
  .run()

/**
 * @param {World} world
 */
function spawnMeshes(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.circle3D(0.2))
  const material = materials.add(new BasicMaterial())

  const parent = commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup()
    ])
    .build()

  const child = commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(1, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Parent(parent),
      new Cleanup()
    ])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(0.5, 0, 0, 0, 0, 0, 0.5, 0.5, 0.5),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup(),
      new Parent(child)
    ])
    .build()

}

// TODO: Revisit when transform propagation lands.
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
