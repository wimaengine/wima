import {
  World,
  VirtualClock,
  BasicMaterial,
  BasicMaterial2D,
  createTransform2D,
  EntityCommands,
  Mesh,
  Meshed,
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
  .registerSystem(AppSchedule.Startup, addMeshes)
  .registerSystem(AppSchedule.Startup, addDefaultCamera2D)
  .registerSystem(AppSchedule.Update, update)
  .registerSystem(AppSchedule.Update, setupViewport)
  .registerDebugger(new FPSDebugger())
  .run()

/**
 * @param {World} world
 */
function addMeshes(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.circle2D(0.1))
  const material = materials.add(new BasicMaterial())

  const parent = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material)])
    .build()

  const child = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(0.4, 0, 0, 0.5, 0.5),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Parent(parent)])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(0.4, 0, 0, 0.5, 0.5),
      new Meshed(mesh),
      new BasicMaterial2D(material), ,
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
