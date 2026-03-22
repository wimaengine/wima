import { World } from '../../ecs/index.js'
import { Field, StructInfo, EnumInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { Timer } from '../components/index.js'
import { Clock } from '../clock.js'
import { VirtualClock } from '../resource/index.js'
import { TimerMode } from '../components/timer.js'

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
  registry.register(Clock, new StructInfo({
    elapsed: new Field(typeid(Number)),
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
  registry.register(VirtualClock, new StructInfo({
    elapsed: new Field(typeid(Number)),
    lastTick: new Field(typeid(Number)),
    delta: new Field(typeid(Number))
  }))
}
