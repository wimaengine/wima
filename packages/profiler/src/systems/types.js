import { World } from '@wimaengine/ecs'
import { Field, MapInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Profile, Profiler, ProfilerTimer } from '../resources'

/**
 * @param {World} world
 */
export function registerProfilerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Profile, new StructInfo({
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.get(Profile)?.setMethod(Profile.serialize)
  registry.get(Profile)?.setMethod(Profile.deserialize)
  const profileMapId = typeidGeneric(Map, [String, Profile])

  registry.registerTypeId(profileMapId, new MapInfo(typeid(String), typeid(Profile)))
  registry.register(Profiler, new StructInfo({
    profiles: new Field(profileMapId)
  }))
  registry.get(Profiler)?.setMethod(Profiler.serialize)
  registry.get(Profiler)?.setMethod(Profiler.deserialize)
  registry.register(ProfilerTimer, new StructInfo({

    // TODO: add a shared helper for enum type ids to avoid setTypeId string literals.
    mode: new Field(setTypeId('TimerMode')),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
  registry.get(ProfilerTimer)?.setMethod(ProfilerTimer.serialize)
  registry.get(ProfilerTimer)?.setMethod(ProfilerTimer.deserialize)
}
