/** @import { World } from '@wimaengine/ecs' */
import { EntityHandle } from '@wimaengine/ecs'
import { ArrayInfo, Field, MapInfo, MethodEntry, OpaqueInfo, StructInfo, TypeEntry, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'

/**
 * @param {World} world
 */
export function registerCoreTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(EntityHandle, new StructInfo({
    index: new Field(typeid(Number)),
    generation: new Field(typeid(Number))
  }))
  registry.get(EntityHandle)?.setMethod(EntityHandle.serialize)
  registry.get(EntityHandle)?.setMethod(EntityHandle.deserialize)
}

/**
 * @param {World} world
 */
export function registerPrimitiveTypes(world) {
  const registry = world.getResource(TypeRegistry)

  registry.register(String, new OpaqueInfo())
  registry.register(Number, new OpaqueInfo())
  registry.register(Boolean, new OpaqueInfo())
  registry.register(Function, new OpaqueInfo())
  registry.register(Object, new OpaqueInfo())
  registry.register(ArrayBuffer, new OpaqueInfo())
  registry.register(Int8Array, new OpaqueInfo())
  registry.register(Uint8Array, new OpaqueInfo())
  registry.register(Uint8ClampedArray, new OpaqueInfo())
  registry.register(Int16Array, new OpaqueInfo())
  registry.register(Uint16Array, new OpaqueInfo())
  registry.register(Int32Array, new OpaqueInfo())
  registry.register(Uint32Array, new OpaqueInfo())
  registry.register(Float32Array, new OpaqueInfo())
  registry.register(Float64Array, new OpaqueInfo())
  registry.register(BigInt64Array, new OpaqueInfo())
  registry.register(BigUint64Array, new OpaqueInfo())
  registry.registerTypeId(setTypeId('BigInt'), new OpaqueInfo())

  const typeIdId = setTypeId('TypeId')

  registry.registerTypeId(typeIdId, new OpaqueInfo())

  const mapStringNumberId = typeidGeneric(Map, [String, Number])
  const typeIdArrayId = setTypeId('Array<TypeId>')
  const fieldArrayId = typeidGeneric(Array, [Field])
  const typeEntryMapId = setTypeId('Map<TypeId,TypeEntry>')
  const methodEntryMapId = setTypeId(`Map<TypeId,${MethodEntry.name}>`)

  registry.registerTypeId(mapStringNumberId, new MapInfo(typeid(String), typeid(Number)))
  registry.registerTypeId(typeIdArrayId, new ArrayInfo(typeIdId))
  registry.registerTypeId(fieldArrayId, new ArrayInfo(typeid(Field)))
  registry.registerTypeId(typeEntryMapId, new MapInfo(typeIdId, typeid(TypeEntry)))
  registry.registerTypeId(methodEntryMapId, new MapInfo(typeIdId, typeid(MethodEntry)))

  registry.register(TypeRegistry, new OpaqueInfo())
}
