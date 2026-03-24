/** @import { Constructor } from '../../type/index.js' */

import { ArrayInfo, EnumInfo, Field, StructInfo } from '../../reflect/core/index.js'
import { TypeRegistry } from '../../reflect/resources/index.js'
import { setTypeId, typeid, typeidGeneric } from '../../type/index.js'
import { Color } from '../../color/index.js'
import { Vector2, Vector3 } from '../../math/index.js'
import { Gizmo2D, Gizmo3D, GizmoBuffer } from '../core/index.js'
import { GizmoLineCap, GizmoLineJoin, GizmoLineStyle, GizmoSettings } from '../core/settings.js'

/**
 * @template T
 * @param {Constructor<T>} label
 * @returns {import('../../ecs/index.js').SystemFunc}
 */
export function registerGizmo2DTypes(label) {
  return function registerGizmo2DTypes(world) {
    const registry = world.getResource(TypeRegistry)

    const vector2ArrayId = typeidGeneric(Array, [Vector2])
    const colorArrayId = typeidGeneric(Array, [Color])
    const gizmoBuffer2DId = typeidGeneric(GizmoBuffer, [Vector2])
    const gizmoLineCapId = setTypeId('GizmoLineCap')
    const gizmoLineJoinId = setTypeId('GizmoLineJoin')
    const gizmoLineStyleId = setTypeId('GizmoLineStyle')

    registry.registerTypeId(vector2ArrayId, new ArrayInfo(typeid(Vector2)))
    registry.registerTypeId(colorArrayId, new ArrayInfo(typeid(Color)))
    registry.registerTypeId(gizmoLineCapId, new EnumInfo(GizmoLineCap))
    registry.registerTypeId(gizmoLineJoinId, new EnumInfo(GizmoLineJoin))
    registry.registerTypeId(gizmoLineStyleId, new EnumInfo(GizmoLineStyle))

    registry.registerTypeId(gizmoBuffer2DId, new StructInfo({
      positions: new Field(vector2ArrayId),
      colors: new Field(colorArrayId),
      stripPositions: new Field(vector2ArrayId),
      stripColors: new Field(colorArrayId)
    }))
    registry.register(GizmoSettings, new StructInfo({
      lineWidth: new Field(typeid(Number)),
      lineCap: new Field(gizmoLineCapId),
      lineJoin: new Field(gizmoLineJoinId),
      lineStyle: new Field(gizmoLineStyleId),
      lineDashOffset: new Field(typeid(Number))
    }))

    registry.registerTypeId(typeidGeneric(Gizmo2D, [label]), new StructInfo({
      type: new Field(typeid(Function)),
      buffer: new Field(gizmoBuffer2DId),
      settings: new Field(typeid(GizmoSettings))
    }))
  }
}

/**
 * @template T
 * @param {Constructor<T>} label
 * @returns {import('../../ecs/index.js').SystemFunc}
 */
export function registerGizmo3DTypes(label) {
  return function registerGizmo3DTypes(world) {
    const registry = world.getResource(TypeRegistry)

    const vector3ArrayId = typeidGeneric(Array, [Vector3])
    const colorArrayId = typeidGeneric(Array, [Color])
    const gizmoBuffer3DId = typeidGeneric(GizmoBuffer, [Vector3])
    const gizmoLineCapId = setTypeId('GizmoLineCap')
    const gizmoLineJoinId = setTypeId('GizmoLineJoin')
    const gizmoLineStyleId = setTypeId('GizmoLineStyle')

    registry.registerTypeId(vector3ArrayId, new ArrayInfo(typeid(Vector3)))
    registry.registerTypeId(colorArrayId, new ArrayInfo(typeid(Color)))
    registry.registerTypeId(gizmoLineCapId, new EnumInfo(GizmoLineCap))
    registry.registerTypeId(gizmoLineJoinId, new EnumInfo(GizmoLineJoin))
    registry.registerTypeId(gizmoLineStyleId, new EnumInfo(GizmoLineStyle))

    registry.registerTypeId(gizmoBuffer3DId, new StructInfo({
      positions: new Field(vector3ArrayId),
      colors: new Field(colorArrayId),
      stripPositions: new Field(vector3ArrayId),
      stripColors: new Field(colorArrayId)
    }))
    registry.register(GizmoSettings, new StructInfo({
      lineWidth: new Field(typeid(Number)),
      lineCap: new Field(gizmoLineCapId),
      lineJoin: new Field(gizmoLineJoinId),
      lineStyle: new Field(gizmoLineStyleId),
      lineDashOffset: new Field(typeid(Number))
    }))

    registry.registerTypeId(typeidGeneric(Gizmo3D, [label]), new StructInfo({
      type: new Field(typeid(Function)),
      buffer: new Field(gizmoBuffer3DId),
      settings: new Field(typeid(GizmoSettings))
    }))
  }
}
