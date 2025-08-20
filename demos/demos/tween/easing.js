import {
  Vector2,
  Position2DTween,
  Mesh,
  Easing,
  TweenRepeat,
  TweenFlip,
  createTransform2D,
  World,
  Demo,
  Cleanup,
  EntityCommands,
  Assets,
  typeidGeneric,
  BasicMaterial,
  Meshed,
  BasicMaterial2D
} from 'wima'
import { addDefaultCamera2D } from '../utils.js'

export default new Demo(
  'easing',
  [init, addDefaultCamera2D]
)

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)

  /** @type {Assets<Mesh>}*/
  const meshes = world.getResourceByTypeId(typeidGeneric(Assets, [Mesh]))

  /** @type {Assets<BasicMaterial>}*/
  const basicMaterials = world.getResourceByTypeId(typeidGeneric(Assets, [BasicMaterial]))

  const material = basicMaterials.add(new BasicMaterial())
  const mesh = meshes.add(Mesh.quad2D(50, 50))

  const width = 1000
  const height = 600
  const offset = -width
  const stride = 100
  const easings = Object.keys(Easing)

  for (let i = 0; i < easings.length; i++) {
    const easeName = easings[i]
    const x = offset + i * stride
    const y = -height / 2

    commands
      .spawn()
      .insertPrefab([
        ...createTransform2D(x, y + 50),
        new Meshed(mesh),
        new BasicMaterial2D(material),
        new Position2DTween(
          new Vector2(x, y + 50),
          new Vector2(x, 0 - 100),
          4,
          true,
          true,

          // @ts-ignore
          Easing[easeName]
        ),
        new TweenRepeat(),
        new TweenFlip(),
        new Cleanup()
      ])
      .build()
  }
}