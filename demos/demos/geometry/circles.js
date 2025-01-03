import {
  Mesh,
  Position2DTween,
  TweenRepeat,
  TweenFlip,
  CanvasMeshedMaterial,
  createTransform2D,
  World,
  Color,
  Demo,
  Query,
  EntityCommands,
  Vector2,
  warn,
  Cleanup
} from 'chaosstudio'
import { ShapeContainer } from "./utils.js"

export const circlesIntersect = new Demo('circle-circle intersection', [init], [update])

const radius = 50
const resolution = 32

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource('entitycommands')
  const meshes = world.getResource('assets<mesh>')
  const materials = world.getResource('assets<material>')

  const mesh = meshes.add('material', Mesh.circle2D(radius, resolution))
  const material = materials.add('basic', new CanvasMeshedMaterial({
    fill: new Color(0,0,0,0)
  }))

  const start1 = new Vector2(100,100)
  const start2 = new Vector2(300,100)
  const end1 = new Vector2(190,100)
  const end2 = new Vector2(210,100)
  const duration = 2
  
  commands
    .spawn()
    .insertPrefab(createTransform2D(start1.x,start1.y))
    .insert(mesh)
    .insert(material)
    .insert(new Position2DTween(start1, end1, duration))
    .insert(new TweenRepeat())
    .insert(new TweenFlip())
    .insert(new ShapeContainer())
    .insert(new Cleanup())
    .build()

  commands
    .spawn()
    .insertPrefab(createTransform2D(start2.x,start2.y))
    .insert(mesh)
    .insert(material)
    .insert(new Position2DTween(start2, end2, duration))
    .insert(new TweenRepeat())
    .insert(new TweenFlip())
    .insert(new ShapeContainer())
    .insert(new Cleanup())
    .build()
}

/**
 * @param {World} world
 */
function update(world) {
  const query = new Query(world, ['position2d', 'shapecontainer'])
  console.log(query.count())
}