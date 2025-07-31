import {
  Demo,
  World,
  Affine3,
  Vector3,
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
  Scale3D,
  Position3D,
  Orientation3D,
  BasicMaterialAssets,
  MeshAssets
} from 'wima'
import { addDefaultCamera3D } from '../../utils.js'

export default new Demo(
  'transform3d/propagate',
  [addDefaultCamera3D, addMeshes],
  [update]
)

/**
 * @param {World} world
 */
function addMeshes(world) {
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
      new Root(),
      new Cleanup()
    ])
    .build()
  
  const child = commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Parent(parent),
      new Cleanup()
    ])
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(),
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
  const root = new Query(world, [Position3D, Orientation3D, Scale3D, Children, Root]).single()
  const parents = new Query(world, [Position3D, Orientation3D, Scale3D, Children])
  const children = new Query(world, [Position3D, Orientation3D, Scale3D, Parent])
  const elapsed = world.getResource(VirtualClock).getElapsed()

  const parentTransform = Affine3.compose(
    new Vector3(0, 0),
    Quaternion.rotateZ(elapsed * 0.5),
    Vector3.splat(1)
  )
  const childTransform = Affine3.compose(
    new Vector3(1, 0),
    Quaternion.rotateZ(elapsed * 0.5),
    Vector3.splat(0.5)
  )

  const grandChildTransform = Affine3.compose(
    new Vector3(0.5, 0),
    Quaternion.identity(),
    Vector3.splat(0.5)
  )
  const childFinalTransform = Affine3.multiply(parentTransform, childTransform)
  const grandChildFinalTransform = Affine3.multiply(childFinalTransform, grandChildTransform)

  if (!root) return

  const [parPosition, parOrientation, parScale] = root
  const [finparPosition, finparOrientation, finparScale] = parentTransform.decompose()

  parPosition.copy(finparPosition)
  parOrientation.copy(finparOrientation)
  parScale.copy(finparScale)

  const child = parents.get(root[3].list[0])

  if (!child) return

  const [childPosition, childOrientation, childScale] = child
  const [finChildPosition, finChildOrientation, finChildScale] = childFinalTransform.decompose()

  childPosition.copy(finChildPosition)
  childOrientation.copy(finChildOrientation)
  childScale.copy(finChildScale)

  const grandChild = children.get(child[3].list[0])

  if (!grandChild) return

  const [grChildPosition, grChildOrientation, grChildScale] = grandChild
  const [fingrChildPosition, fingrChildOrientation, fingrChildScale] = grandChildFinalTransform.decompose()

  grChildPosition.copy(fingrChildPosition)
  grChildOrientation.copy(fingrChildOrientation)
  grChildScale.copy(fingrChildScale)
}

class Root {}