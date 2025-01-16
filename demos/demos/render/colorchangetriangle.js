import {
  Assets,
  WebglBasicMaterial,
  Demo,
  Material,
  Mesh,
  Orientation3D,
  Position3D,
  Color,
  Scale3D,
  GlobalTransform3D,
  World,
  Cleanup
} from 'chaosstudio'
import { addCamera3D } from './utils.js'

/**
 * @param {World} world
 */
function addmesh(world) {
  world.setResourceByName('changecolor', new Color(0.003, 0.006, 0.012))

  /** @type {Assets<Mesh>} */
  const meshes = world.getResource('assets<mesh>')

  /** @type {Assets<Material>} */
  const materials = world.getResource('assets<material>')
  const commands = world.getResource('entitycommands')

  const mesh = Mesh.triangle3D()
  const material = new WebglBasicMaterial({
    color: new Color(1, 0, 0)
  })

  commands
    .spawn()
    .insertPrefab([
      new Position3D(),
      new Orientation3D(),
      new Scale3D(),
      new GlobalTransform3D(),
      meshes.add('changeColor', mesh),
      materials.add('changeColor', material),
      new Cleanup()
    ])
    .build()
}

/**
 * @param {World} world
 */
function changeColor(world) {

  /** @type {Assets<Material>} */
  const materials = world.getResource('assets<material>')

  /** @type {Color}*/
  const color = world.getResource('changecolor')
  const material = materials.get('changeColor')
  
  if (
    material.color.r <= 0 ||
    material.color.r + color.r > 1
  ) {
    color.r = -color.r
  }
  if (
    material.color.g <= 0 ||
    material.color.g + color.g > 1
  ) {
    color.g = -color.g
  }
  if (
    material.color.b <= 0 ||
    material.color.b + color.b > 1
  ) {
    color.b = -color.b
  }

  material.color.add(color)
}
export const changecolortriangle = new Demo('color changing triangle', [addmesh, addCamera3D], [changeColor])