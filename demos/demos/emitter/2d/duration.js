import {
  Mesh,
  World,
  Demo,
  EntityCommands,
  Cleanup,
  Emitter,
  createEmitter2D,
  Position2D,
  TimerMode,
  Range,
  MeshAssets,
  BasicMaterialAssets,
  Meshed,
  BasicMaterial2D,
  BasicMaterial,
  Acceleration2D,
  createMovable2D,
  GlobalTransform2D,
  Orientation2D,
  Rotation2D,
  Scale2D,
  Torque2D,
  Velocity2D,
  Entity,
  rand,
  HALF_PI,
  Timer
} from 'wima'
import { addDefaultCamera2D } from '../../utils.js'

export default new Demo('emitter2d/duration', [init, addDefaultCamera2D])

/**
 * @param {World} world
 */
function init(world) {
  const commands = world.getResource(EntityCommands)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const mesh = meshes.add(Mesh.quad2D(50, 50))
  const material = materials.add(new BasicMaterial())

  /**
   *@returns {[Position2D, Orientation2D, Scale2D, GlobalTransform2D, Velocity2D, Rotation2D, Acceleration2D, Torque2D, Meshed, BasicMaterial2D, Cleanup]}
   */
  function particle() {
    return [
      ...createMovable2D(),
      new Meshed(mesh),
      new BasicMaterial2D(material),
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
        new Velocity2D(0, 100),
        new Rotation2D(rand(-HALF_PI, HALF_PI))
      ])
      .build()
  }

  const number = 10
  const width = 50
  const padding = 30
  const offset = -((width + padding) * number) / 2

  for (let i = 0; i < number; i++) {
    commands
      .spawn()
      .insertPrefab([
        ...createEmitter2D(),
        new Emitter({
          prefab: particle,
          patch,
          lifetime: new Range(2, 4)
        }),

        // Sets the duration after which the emitter emits particles and how often.
        new Timer({ duration: 0.2 * i, mode: TimerMode.Repeat }),
        new Cleanup()
      ])
      .insert(new Position2D(offset + i * (width + padding), -200))
      .build()
  }
}