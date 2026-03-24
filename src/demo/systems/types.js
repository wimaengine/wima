import { World } from '../../ecs/index.js'
import { Field, MapInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { typeid } from '../../type/index.js'
import { Cleanup } from '../components/index.js'
import { Demo } from '../core/index.js'
import { CurrentDemo, DemoList } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerDemoTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(Cleanup, new StructInfo({}))
  registry.register(DemoList, new MapInfo(typeid(String), typeid(Demo)))
  registry.register(CurrentDemo, new StructInfo({
    name: new Field(typeid(String))
  }))
}
