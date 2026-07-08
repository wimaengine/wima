import { World } from '@wimaengine/ecs'
import { EnumInfo, Field, MapInfo, OpaqueInfo, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid } from '@wimaengine/type'
import { WindowRequest } from '../commands'
import { MainWindow, Window } from '../components'
import { Windows } from '../resources'

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
  registry.get(Window)?.setMethod(Window.serialize)
  registry.get(Window)?.setMethod(Window.deserialize)
  registry.register(MainWindow, new StructInfo({}))
  registry.get(MainWindow)?.setMethod(MainWindow.copy)
  registry.get(MainWindow)?.setMethod(MainWindow.clone)
  registry.get(MainWindow)?.setMethod(MainWindow.serialize)
  registry.get(MainWindow)?.setMethod(MainWindow.deserialize)
  registry.register(Windows, new StructInfo({
    entities: new Field(entityWindowMapId)
  }))
}
