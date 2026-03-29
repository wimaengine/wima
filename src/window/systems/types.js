import { World } from '../../ecs/index.js'
import { EnumInfo, Field, MapInfo, OpaqueInfo, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid } from '../../type/index.js'
import { MainWindow, Window } from '../components/index.js'
import { WindowRequest } from '../core/index.js'
import { Windows } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerWindowTypes(world) {
  const registry = world.getResource(TypeRegistry)

  const windowRequestId = setTypeId('WindowRequest')
  const htmlCanvasId = setTypeId('HTMLCanvasElement')
  const entityWindowMapId = setTypeId(`Map<Number,${htmlCanvasId}>`)

  registry.registerTypeId(windowRequestId, new EnumInfo(WindowRequest))
  registry.registerTypeId(htmlCanvasId, new OpaqueInfo())
  registry.registerTypeId(entityWindowMapId, new MapInfo(typeid(Number), htmlCanvasId))

  registry.register(Window, new StructInfo({
    width: new Field(typeid(Number)),
    height: new Field(typeid(Number)),
    selector: new Field(typeid(String), true)
  }))
  registry.get(Window)?.setMethod(Window.copy)
  registry.get(Window)?.setMethod(Window.clone)
  registry.register(MainWindow, new StructInfo({}))
  registry.get(MainWindow)?.setMethod(MainWindow.copy)
  registry.get(MainWindow)?.setMethod(MainWindow.clone)
  registry.register(Windows, new StructInfo({
    entities: new Field(entityWindowMapId)
  }))
}
