import { World } from '../../ecs/index.js'
import { EnumInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { RAFTimer } from '../resources/index.js'
import { TimerMode } from '../../time/index.js'

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
