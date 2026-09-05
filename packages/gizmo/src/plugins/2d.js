/** @import { Constructor } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { ColorPlugin } from '@wimaengine/color'
import { AppSchedule, CorePlugin } from '@wimaengine/core'
import { MathPlugin } from '@wimaengine/math'
import { ReflectPlugin } from '@wimaengine/reflect'
import { typeidGeneric, typeid } from '@wimaengine/type'
import { WindowPlugin } from '@wimaengine/window'
import { Gizmo2D, GizmoSettings } from '../core'
import { genenerateDrawGizmo2Dsystem, registerGizmo2DTypes } from '../systems'

/**
 * @template T
 */
export class Gizmo2DPlugin extends Plugin {

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
   * @param {Gizmo2DPluginSettings<T>} param0
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
      .setResourceByTypeId(typeidGeneric(Gizmo2D, [label]), new Gizmo2D(label, settings))
      .registerSystem({ schedule: AppSchedule.Startup, system: registerGizmo2DTypes(label) })
      .registerSystem({ schedule: AppSchedule.Update, system: genenerateDrawGizmo2Dsystem(label) })
  }

  requires() {
    return [
      typeid(CorePlugin),
      typeid(ReflectPlugin),
      typeid(ColorPlugin),
      typeid(MathPlugin),
      typeid(WindowPlugin)
    ]
  }

  name() {
    return typeidGeneric(Gizmo2DPlugin, [this.label])
  }
}

/**
 * @template T
 * @typedef Gizmo2DPluginSettings
 * @property {Constructor<T>} label
 * @property {GizmoSettings} [settings]
 */
