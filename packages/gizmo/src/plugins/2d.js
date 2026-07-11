/** @import { Constructor } from '@wimaengine/type' */
import { App, Plugin } from '@wimaengine/app'
import { AppSchedule } from '@wimaengine/core'
import { typeidGeneric } from '@wimaengine/type'
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
