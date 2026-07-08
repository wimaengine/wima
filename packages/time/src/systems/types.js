import { World } from '@wimaengine/ecs'
import { Field, StructInfo, EnumInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { Clock } from '../clock'
import { Timer, TimerMode } from '../components'
import { VirtualClock } from '../resource'

/**
 * @param {World} world
 */
export function registerTimeTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const timerModeId = setTypeId('TimerMode')

  registry.registerTypeId(timerModeId, new EnumInfo(TimerMode))

  registry.register(Timer, new StructInfo({
    mode: new Field(timerModeId),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
  registry.get(Timer)?.setMethod(Timer.copy)
  registry.get(Timer)?.setMethod(Timer.clone)
  registry.get(Timer)?.setMethod(Timer.serialize)
  registry.get(Timer)?.setMethod(Timer.deserialize)
  registry.register(Clock, new StructInfo({
    elapsed: new Field(typeid(Number)),
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.get(Clock)?.setMethod(Clock.serialize)
  registry.get(Clock)?.setMethod(Clock.deserialize)
  registry.register(VirtualClock, new StructInfo({
    elapsed: new Field(typeid(Number)),
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.get(VirtualClock)?.setMethod(VirtualClock.serialize)
  registry.get(VirtualClock)?.setMethod(VirtualClock.deserialize)
}
