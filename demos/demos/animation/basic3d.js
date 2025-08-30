import {
  Mesh,
  World,
  Demo,
  Cleanup,
  AnimationClip,
  AnimationTrack,
  AnimationTarget,
  AnimationPlayer,
  PlaybackRepeat,
  EntityCommands,
  MeshAssets,
  BasicMaterialAssets,
  BasicMaterial,
  Meshed,
  HALF_PI,
  PI,
  TAU,
  BasicMaterial3D,
  createTransform3D,
  Orientation3DAnimationEffector,
  Position3DAnimationEffector,
  Scale3DAnimationEffector,
  Quaternion,
  Vector3
} from 'wima'
import { AnimationClipAssets } from '../../../src/animation/resources/aliases.js'
import { addDefaultCamera3D } from '../utils.js'

export default new Demo('animation/basic3d', [init, addDefaultCamera3D])

/**
 * @param {World} world
 */
export function init(world) {
  const commands = world.getResource(EntityCommands)
  const clips = world.getResource(AnimationClipAssets)
  const meshes = world.getResource(MeshAssets)
  const materials = world.getResource(BasicMaterialAssets)

  const rawClip = createClip()
  const clip = clips.add(rawClip)
  const mesh = meshes.add(Mesh.cube(0.5,0.5,0.5))
  const material = materials.add(new BasicMaterial())
  const targetname = '/bone'
  const animationplayer = new AnimationPlayer()

  animationplayer.set(clip, {
    duration: rawClip.duration,
    repeatMode: PlaybackRepeat.Forever
  })
  const player = commands
    .spawn()
    .insert(animationplayer)
    .build()

  commands
    .spawn()
    .insertPrefab([
      ...createTransform3D(1, 1),
      new Meshed(mesh),
      new BasicMaterial3D(material),
      new AnimationTarget(player, targetname),
      new Cleanup()
    ])
    .build()
}

/**
 *@returns {AnimationClip}
 */
function createClip() {
  const clip = new AnimationClip()

  const translate = new AnimationTrack(Position3DAnimationEffector)
  const rotate = new AnimationTrack(Orientation3DAnimationEffector)
  const scale = new AnimationTrack(Scale3DAnimationEffector)

  translate.times = [0, 2, 4, 6, 8]
  rotate.times = [0, 2, 4, 6, 8]
  scale.times = [0, 2, 4, 6, 8]

  translate.keyframes = [
    ...Vector3.set(-1, 1, 0),
    ...Vector3.set(-1, -1, 0),
    ...Vector3.set(1, -1, 0),
    ...Vector3.set(1, 1, 0),
    ...Vector3.set(-1, 1, 0)
  ].map(n => n / 2)
  rotate.keyframes = [
    ...Quaternion.fromEuler(0, 0, TAU),
    ...Quaternion.fromEuler(0, 0, HALF_PI * 3),
    ...Quaternion.fromEuler(0, 0, PI),
    ...Quaternion.fromEuler(0, 0, HALF_PI),
    ...Quaternion.fromEuler(0, 0, 0)
  ]
  scale.keyframes = [
    ...Vector3.set(1, 1, 1),
    ...Vector3.set(2, 2, 2),
    ...Vector3.set(1, 1, 1),
    ...Vector3.set(2, 2, 2),
    ...Vector3.set(1, 1, 1)
  ]

  clip.add('/bone', translate)
  clip.add('/bone', rotate)
  clip.add('/bone', scale)
  clip.calculateDuration()

  return clip
}