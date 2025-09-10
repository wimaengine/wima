import {
  Demo,
  World,
  VirtualClock,
  BasicMaterial,
  BasicMaterial2D,
  Cleanup,
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
  QUARTER_PI
} from 'wima'
import { addDefaultCamera2D } from '../../utils.js'

export default new Demo(
  'transform2d/propagate',
  [addDefaultCamera2D, addMeshes],
  [update]
)

/**
 * @param {World} world
 */
function addMeshes(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.circle2D(50))
  const material = materials.add(new BasicMaterial())

  const parent = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Cleanup()
    ])
    .build()

  const child = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(200, 0, 0, 0.5, 0.5),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Parent(parent),
      new Cleanup()
    ])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(200, 0, 0, 0.5, 0.5),
      new Meshed(mesh),
      new BasicMaterial2D(material),
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
  const parent = new Query(world, [Orientation2D], [has(Children), without(Parent)]).single()
  const child = new Query(world, [Orientation2D], [has(Children), has(Parent)]).single()
  const grandChild = new Query(world, [Orientation2D], [has(Parent), without(Children)]).single()
  const delta = world.getResource(VirtualClock).getDelta()

  if(!parent || !child || !grandChild) return

  parent[0].value += QUARTER_PI * delta
  child[0].value += QUARTER_PI * delta
  grandChild[0].value += PI * delta
}