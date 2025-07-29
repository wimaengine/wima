import {
  Demo,
  World,
  Affine2,
  Vector2,
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
  GlobalTransform2D,
  Children,
  Rotary,
  PI,
  Position2D,
  Orientation2D,
  Scale2D
} from 'wima'
import { addDefaultCamera2D, BasicMaterialAssets, MeshAssets } from '../../utils.js'

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

  const mesh = meshes.add('scale', Mesh.circle2D(50))
  const material = materials.add('scale', new BasicMaterial())

  const parent = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Root(),
      new Cleanup()
    ])
    .build()

  const child = commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(200),
      new Meshed(mesh),
      new BasicMaterial2D(material),
      new Parent(parent),
      new Cleanup()
    ])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createTransform2D(),
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
  const root = new Query(world, [Position2D,Orientation2D,Scale2D, Children, Root]).single()
  const parents = new Query(world, [Position2D,Orientation2D,Scale2D, Children])
  const children = new Query(world, [Position2D,Orientation2D,Scale2D, Parent])
  const elapsed = world.getResource(VirtualClock).getElapsed()

  const parentTransform = Affine2.compose(
    new Vector2(0, 0),
    Rotary.fromAngle(elapsed * 0.5),
    Vector2.splat(1)
  )
  const childTransform = Affine2.compose(
    new Vector2(200, 0),
    Rotary.fromAngle(elapsed * 0.5),
    Vector2.splat(0.5)
  )

  const grandChildTransform = Affine2.compose(
    new Vector2(200, 0),
    Rotary.identity(),
    Vector2.splat(0.5)
  )
  const childFinalTransform = Affine2.multiply(parentTransform, childTransform)
  const grandChildFinalTransform = Affine2.multiply(childFinalTransform, grandChildTransform)

  if (!root) return
  const [parPosition,parOrientation,parScale] = root
  const [finparPosition,finparOrientation,finparScale] = parentTransform.decompose()
  parPosition.copy(finparPosition)
  parOrientation.value = Rotary.toAngle(finparOrientation)
  parScale.copy(finparScale)

  const child = parents.get(root[3].list[0])

  if (!child) return
  const [childPosition,childOrientation,childScale] = child
  const [finChildPosition,finChildOrientation,finChildScale] = childFinalTransform.decompose()
  childPosition.copy(finChildPosition)
  childOrientation.value = Rotary.toAngle(finChildOrientation)
  childScale.copy(finChildScale)

  const grandChild = children.get(child[3].list[0])

  if (!grandChild) return
  const [grChildPosition,grChildOrientation,grChildScale] = grandChild
  const [fingrChildPosition,fingrChildOrientation,fingrChildScale] = grandChildFinalTransform.decompose()
  grChildPosition.copy(fingrChildPosition)
  grChildOrientation.value = Rotary.toAngle(fingrChildOrientation)
  grChildScale.copy(fingrChildScale)
}

class Root { }