import { Entity, World } from '../../ecs/index.js'
import { ArrayInfo, EnumInfo, Field, MapInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import { AnimationClip } from '../assets/index.js'
import { AnimationPlayer, AnimationTarget } from '../components/index.js'
import { AnimationTrack, Playback, PlaybackRepeat } from '../core/index.js'

/**
 * @param {World} world
 */
export function registerAnimationTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const playbackRepeatId = setTypeId('PlaybackRepeat')
  const playbackMapId = typeidGeneric(Map, [Number, Playback])
  const numberArrayId = typeidGeneric(Array, [Number])
  const animationTrackArrayId = typeidGeneric(Array, [AnimationTrack])
  const animationTrackMapId = setTypeId(`Map<String,${animationTrackArrayId}>`)

  registry.registerTypeId(playbackRepeatId, new EnumInfo(PlaybackRepeat))
  registry.registerTypeId(playbackMapId, new MapInfo(typeid(Number), typeid(Playback)))
  registry.registerTypeId(numberArrayId, new ArrayInfo(typeid(Number)))
  registry.registerTypeId(animationTrackArrayId, new ArrayInfo(typeid(AnimationTrack)))
  registry.registerTypeId(animationTrackMapId, new MapInfo(typeid(String), animationTrackArrayId))

  registry.register(AnimationTrack, new StructInfo({
    times: new Field(numberArrayId),
    keyframes: new Field(numberArrayId),
    effector: new Field(typeid(Function))
  }))
  registry.register(AnimationClip, new StructInfo({
    tracks: new Field(animationTrackMapId),
    duration: new Field(typeid(Number))
  }))
  registry.register(Playback, new StructInfo({
    speed: new Field(typeid(Number)),
    duration: new Field(typeid(Number)),
    elapsed: new Field(typeid(Number)),
    repeatMode: new Field(playbackRepeatId),
    paused: new Field(typeid(Boolean))
  }))
  registry.get(Playback)?.setMethod(Playback.copy)
  registry.get(Playback)?.setMethod(Playback.clone)
  registry.register(AnimationPlayer, new StructInfo({
    animations: new Field(playbackMapId),
    current: new Field(typeid(Number), true)
  }))
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.copy)
  registry.get(AnimationPlayer)?.setMethod(AnimationPlayer.clone)
  registry.register(AnimationTarget, new StructInfo({
    player: new Field(typeid(Entity)),
    id: new Field(typeid(String))
  }))
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.copy)
  registry.get(AnimationTarget)?.setMethod(AnimationTarget.clone)
}
