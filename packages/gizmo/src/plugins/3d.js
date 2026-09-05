/** @import { Constructor } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { ColorPlugin } from '@wimaengine/color'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { Gizmo3D, GizmoSettings } from '../core'
import { genenerateDrawGizmo3Dsystem, registerGizmo3DTypes } from '../systems'

/**
 * @template T
 */
export class Gizmo3DPlugin extends Plugin {

  /**
   * @readonly
   * @type {Constructor<T>}
   */
  label

  /**
   * @readonly
   * @type {GizmoSettings}
   */
  settings

  /**
   * @param {Gizmo3DPluginSettings<T>} param0
   */
  constructor({
    label,
    settings = new GizmoSettings()
  }) {
    super()
    this.label = label
    this.settings = settings
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { label, settings } = this

    app
      .setResourceByTypeId(typeidGeneric(Gizmo3D, [label]), new Gizmo3D(label, settings))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGizmo3DTypes(label) })
      .registerSystem({ schedule: AppSchedule.Update, system: genenerateDrawGizmo3Dsystem(label) })
  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(ColorPlugin),
      typeid(MathPlugin)
    ]
  }

  name() {
    return typeidGeneric(Gizmo3DPlugin, [this.label])
  }
}

/**
 * @template T
 * @typedef Gizmo3DPluginSettings
 * @property {Constructor<T>} label
 * @property {GizmoSettings} [settings]
 */
