import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { RAFTimer } from '../resources'
import { TimerMode } from '@wimaengine/time'

/**
 * @param {World} world
 */
export function registerFpsDebuggerTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const timerModeId = setTypeId('TimerMode')

  registry.registerTypeId(timerModeId, new EnumInfo(TimerMode))

  registry.register(RAFTimer, new StructInfo({
    mode: new Field(timerModeId),
    duration: new Field(typeid(Number)),
    speed: new Field(typeid(Number)),
    paused: new Field(typeid(Boolean))
  }))
}
