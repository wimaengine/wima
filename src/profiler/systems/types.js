import { World } from '../../ecs/index.js'
import { Field, MapInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import { Profile, Profiler, ProfilerTimer } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerProfilerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Profile, new StructInfo({
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  const profileMapId = typeidGeneric(Map, [String, Profile])

  registry.registerTypeId(profileMapId, new MapInfo(typeid(String), typeid(Profile)))
  registry.register(Profiler, new StructInfo({
    profiles: new Field(profileMapId)
  }))
  registry.register(ProfilerTimer, new StructInfo({

    // TODO: add a shared helper for enum type ids to avoid setTypeId string literals.
    mode: new Field(setTypeId('TimerMode')),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
}
