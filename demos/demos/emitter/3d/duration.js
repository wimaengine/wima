import {
  Mesh,
  World,
  Demo,
  EntityCommands,
  Cleanup,
  Emitter,
  TimerMode,
  Range,
  MeshAssets,
  BasicMaterialAssets,
  Meshed,
  BasicMaterial,
  createEmitter3D,
  Position3D,
  Acceleration3D,
  BasicMaterial3D,
  createMovable3D,
  Entity,
  GlobalTransform3D,
  Orientation3D,
  Rotation3D,
  Scale3D,
  Torque3D,
  Velocity3D,
  rand,
  Timer
} from 'wima'
import { addDefaultCamera3D } from '../../utils.js'

export default new Demo('emitter3d/duration', [init, addDefaultCamera3D])

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const number = 10
  const width = 0.2
  const padding = 0.2
  const mesh = meshes.add(Mesh.cube(width, width, width))
  const material = materials.add(new BasicMaterial())
  const offset = -((width + padding) * number) / 2

  /**
   *@returns {[Position3D, Orientation3D, Scale3D, GlobalTransform3D, Velocity3D, Rotation3D, Acceleration3D, Torque3D, Meshed, BasicMaterial3D, Cleanup]}
   */
  function particle() {
    return [
      ...createMovable3D(),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new Cleanup()
    ]
  }

  /**
   * @param {EntityCommands} commands 
   * @param {Entity} entity 
   */
  function patch(commands, entity) {
    commands
      .entity(entity)
      .insertPrefab([
        new Velocity3D(0, 1),
        new Rotation3D(rand(-5, 5), rand(-5, 5), rand(-5, 5))
      ])
      .build()
  }

  for (let i = 0; i < number; i++) {
    commands
      .spawn()
      .insertPrefab([
        ...createEmitter3D(),
        new Emitter({
          prefab: particle,
          patch,
          lifetime: new Range(2, 4)
        }),

        // Sets the duration after which the emitter emits particles and how often.
        new Timer({ duration: 0.2 * i, mode: TimerMode.Repeat }),
        new Cleanup()
      ])
      .insert(new Position3D(offset + i * (width + padding)))
      .build()
  }
}