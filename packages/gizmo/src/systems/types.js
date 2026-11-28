/** @import { Constructor } from '@wimaengine/type' */
/** @import {SystemFunc} from '@wimaengine/ecs' */

import { Color } from '@wimaengine/color'
import { Affine2, Vector2, Vector3 } from '@wimaengine/math'
import { ArrayInfo, EnumInfo, Field, StructInfo, TypeRegistry } from '@wimaengine/reflect'
import { setTypeId, typeid, typeidGeneric } from '@wimaengine/type'
import { Gizmo2D, Gizmo3D, GizmoBuffer, GizmoLineCap, GizmoLineJoin, GizmoLineStyle, GizmoSettings, GizmoTextAlign } from '../core'

/**
 * Creates the Startup system that registers reflection metadata for 2D gizmos.
 * The `label` constructor is part of the generic {@linkcode Gizmo2D} type ID, so
 * use the same label when constructing or retrieving the corresponding
 * {@linkcode Gizmo2D} resource. The exported function is a factory; the returned
 * function is the system that receives a world and uses its {@linkcode TypeRegistry}.
 *
 * The returned system registers `Array<Vector2>` and `Array<Color>` with
 * {@linkcode ArrayInfo}, then registers the exact enum IDs `GizmoLineCap`,
 * `GizmoLineJoin`, and `GizmoLineStyle` (created with `setTypeId`) with
 * {@linkcode EnumInfo}. It registers `GizmoBuffer<Vector2>` with fields
 * `positions: Array<Vector2>`, `colors: Array<Color>`,
 * `polylinePositions: Array<Vector2>`, `polylineColors: Array<Color>`,
 * `fillPositions: Array<Vector2>`, `fillColors: Array<Color>`, text arrays,
 * text affine arrays, text color arrays, and text alignment arrays. It
 * registers {@linkcode GizmoSettings} with numeric `lineWidth` and
 * `lineDashOffset` fields plus enum-typed `lineCap`, `lineJoin`, and
 * `lineStyle` fields. Finally, it registers the generic ID produced by
 * `typeidGeneric(Gizmo2D, [label])` with `type: Function`,
 * `buffer: GizmoBuffer<Vector2>`, and `settings: GizmoSettings` fields.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { registerGizmo2DTypes } from '@wimaengine/gizmo'
 *
 * class DebugGizmo {}
 * app.registerSystem({
 *   schedule: AppSchedule.Startup,
 *   system: registerGizmo2DTypes(DebugGizmo)
 * })
 * // The plugin normally registers this Startup system for its configured label.
 * ```
 *
 * @template T
 * @param {Constructor<T>} label - Constructor used as the generic `Gizmo2D`
 * type label. It must match the label used by the gizmo plugin or resource
 * lookup.
 * @returns {SystemFunc} A system that registers the 2D gizmo type IDs and
 * {@linkcode StructInfo} metadata in the world's {@linkcode TypeRegistry}.
 */
export function registerGizmo2DTypes(label) {
  return function registerGizmo2DTypes(world) {
    const registry = world.getResource(TypeRegistry)

    const vector2ArrayId = typeidGeneric(Array, [Vector2])
    const colorArrayId = typeidGeneric(Array, [Color])
    const stringArrayId = typeidGeneric(Array, [String])
    const affine2ArrayId = typeidGeneric(Array, [Affine2])
    const numberArrayId = typeidGeneric(Array, [Number])
    const gizmoBuffer2DId = typeidGeneric(GizmoBuffer, [Vector2])
    const gizmoLineCapId = setTypeId('GizmoLineCap')
    const gizmoLineJoinId = setTypeId('GizmoLineJoin')
    const gizmoLineStyleId = setTypeId('GizmoLineStyle')
    const gizmoTextAlignId = setTypeId('GizmoTextAlign')

    registry.registerTypeId(vector2ArrayId, new ArrayInfo(typeid(Vector2)))
    registry.registerTypeId(colorArrayId, new ArrayInfo(typeid(Color)))
    registry.registerTypeId(stringArrayId, new ArrayInfo(typeid(String)))
    registry.registerTypeId(affine2ArrayId, new ArrayInfo(typeid(Affine2)))
    registry.registerTypeId(numberArrayId, new ArrayInfo(typeid(Number)))
    registry.registerTypeId(gizmoLineCapId, new EnumInfo(GizmoLineCap))
    registry.registerTypeId(gizmoLineJoinId, new EnumInfo(GizmoLineJoin))
    registry.registerTypeId(gizmoLineStyleId, new EnumInfo(GizmoLineStyle))
    registry.registerTypeId(gizmoTextAlignId, new EnumInfo(GizmoTextAlign))

    registry.registerTypeId(gizmoBuffer2DId, new StructInfo({
      positions: new Field(vector2ArrayId),
      colors: new Field(colorArrayId),
      polylinePositions: new Field(vector2ArrayId),
      polylineColors: new Field(colorArrayId),
      fillPositions: new Field(vector2ArrayId),
      fillColors: new Field(colorArrayId),
      texts: new Field(stringArrayId),
      textAffines: new Field(affine2ArrayId),
      textColors: new Field(colorArrayId),
      textAlignments: new Field(numberArrayId),
      textSizes: new Field(numberArrayId),
      fillTexts: new Field(stringArrayId),
      fillTextAffines: new Field(affine2ArrayId),
      fillTextColors: new Field(colorArrayId),
      fillTextAlignments: new Field(numberArrayId),
      fillTextSizes: new Field(numberArrayId)
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
 * Creates the Startup system that registers reflection metadata for 3D gizmos.
 * The `label` constructor is part of the generic {@linkcode Gizmo3D} type ID, so
 * use the same label when constructing or retrieving the corresponding
 * {@linkcode Gizmo3D} resource. The exported function is a factory; the returned
 * function is the system that receives a world and uses its {@linkcode TypeRegistry}.
 *
 * The returned system registers `Array<Vector3>` and `Array<Color>` with
 * {@linkcode ArrayInfo}, then registers the exact enum IDs `GizmoLineCap`,
 * `GizmoLineJoin`, and `GizmoLineStyle` (created with `setTypeId`) with
 * {@linkcode EnumInfo}. It registers `GizmoBuffer<Vector3>` with fields
 * `positions: Array<Vector3>`, `colors: Array<Color>`,
 * `polylinePositions: Array<Vector3>`, `polylineColors: Array<Color>`,
 * `fillPositions: Array<Vector3>`, `fillColors: Array<Color>`, text arrays,
 * text affine arrays, text color arrays, and text alignment arrays. It
 * registers {@linkcode GizmoSettings} with numeric `lineWidth` and
 * `lineDashOffset` fields plus enum-typed `lineCap`, `lineJoin`, and
 * `lineStyle` fields. Finally, it registers the generic ID produced by
 * `typeidGeneric(Gizmo3D, [label])` with `type: Function`,
 * `buffer: GizmoBuffer<Vector3>`, and `settings: GizmoSettings` fields.
 *
 * @example
 * ```js
 * import { AppSchedule } from '@wimaengine/core'
 * import { registerGizmo3DTypes } from '@wimaengine/gizmo'
 *
 * class DebugGizmo {}
 * app.registerSystem({
 *   schedule: AppSchedule.Startup,
 *   system: registerGizmo3DTypes(DebugGizmo)
 * })
 * // The plugin normally registers this Startup system for its configured label.
 * ```
 *
 * @template T
 * @param {Constructor<T>} label - Constructor used as the generic `Gizmo3D`
 * type label. It must match the label used by the gizmo plugin or resource
 * lookup.
 * @returns {SystemFunc} A system that registers the 3D gizmo type IDs and
 * {@linkcode StructInfo} metadata in the world's {@linkcode TypeRegistry}.
 */
export function registerGizmo3DTypes(label) {
  return function registerGizmo3DTypes(world) {
    const registry = world.getResource(TypeRegistry)

    const vector3ArrayId = typeidGeneric(Array, [Vector3])
    const colorArrayId = typeidGeneric(Array, [Color])
    const stringArrayId = typeidGeneric(Array, [String])
    const affine2ArrayId = typeidGeneric(Array, [Affine2])
    const numberArrayId = typeidGeneric(Array, [Number])
    const gizmoBuffer3DId = typeidGeneric(GizmoBuffer, [Vector3])
    const gizmoLineCapId = setTypeId('GizmoLineCap')
    const gizmoLineJoinId = setTypeId('GizmoLineJoin')
    const gizmoLineStyleId = setTypeId('GizmoLineStyle')
    const gizmoTextAlignId = setTypeId('GizmoTextAlign')

    registry.registerTypeId(vector3ArrayId, new ArrayInfo(typeid(Vector3)))
    registry.registerTypeId(colorArrayId, new ArrayInfo(typeid(Color)))
    registry.registerTypeId(stringArrayId, new ArrayInfo(typeid(String)))
    registry.registerTypeId(affine2ArrayId, new ArrayInfo(typeid(Affine2)))
    registry.registerTypeId(numberArrayId, new ArrayInfo(typeid(Number)))
    registry.registerTypeId(gizmoLineCapId, new EnumInfo(GizmoLineCap))
    registry.registerTypeId(gizmoLineJoinId, new EnumInfo(GizmoLineJoin))
    registry.registerTypeId(gizmoLineStyleId, new EnumInfo(GizmoLineStyle))
    registry.registerTypeId(gizmoTextAlignId, new EnumInfo(GizmoTextAlign))

    registry.registerTypeId(gizmoBuffer3DId, new StructInfo({
      positions: new Field(vector3ArrayId),
      colors: new Field(colorArrayId),
      polylinePositions: new Field(vector3ArrayId),
      polylineColors: new Field(colorArrayId),
      fillPositions: new Field(vector3ArrayId),
      fillColors: new Field(colorArrayId),
      texts: new Field(stringArrayId),
      textAffines: new Field(affine2ArrayId),
      textColors: new Field(colorArrayId),
      textAlignments: new Field(numberArrayId),
      textSizes: new Field(numberArrayId),
      fillTexts: new Field(stringArrayId),
      fillTextAffines: new Field(affine2ArrayId),
      fillTextColors: new Field(colorArrayId),
      fillTextAlignments: new Field(numberArrayId),
      fillTextSizes: new Field(numberArrayId)
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
