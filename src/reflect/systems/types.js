import { World } from '../../ecs/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import {
  ArrayInfo,
  EnumInfo,
  Field,
  FunctionInfo,
  MapInfo,
  OpaqueInfo,
  SetInfo,
  StructInfo,
  TupleInfo,
  TypeInfo
} from '../core/index.js'
import { MethodEntry, TypeEntry, TypeRegistry } from '../resources/index.js'

/**
 * @param {World} world
 */
export function registerReflectTypes(world) {
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

  registry.register(TypeInfo, new OpaqueInfo())
  registry.register(Field, new StructInfo({
    type: new Field(typeIdId),
    optional: new Field(typeid(Boolean))
  }))
  registry.register(OpaqueInfo, new StructInfo({}))
  registry.register(StructInfo, new StructInfo({
    names: new Field(mapStringNumberId),
    fields: new Field(fieldArrayId)
  }))
  registry.register(EnumInfo, new StructInfo({
    variants: new Field(mapStringNumberId)
  }))
  registry.register(FunctionInfo, new StructInfo({
    parameterTypes: new Field(typeIdArrayId),
    returnType: new Field(typeIdId)
  }))
  registry.register(ArrayInfo, new StructInfo({
    elementType: new Field(typeIdId)
  }))
  registry.register(SetInfo, new StructInfo({
    elementType: new Field(typeIdId)
  }))
  registry.register(MapInfo, new StructInfo({
    keyType: new Field(typeIdId),
    valueType: new Field(typeIdId)
  }))
  registry.register(TupleInfo, new StructInfo({
    elementTypes: new Field(typeIdArrayId)
  }))
  registry.register(MethodEntry, new StructInfo({
    method: new Field(typeid(Function))
  }))
  registry.register(TypeEntry, new StructInfo({
    info: new Field(typeid(TypeInfo)),
  }))
  registry.register(TypeRegistry, new StructInfo({
    inner: new Field(typeEntryMapId)
  }))
}
