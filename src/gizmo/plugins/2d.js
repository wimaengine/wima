/** @import { Constructor } from '../../reflect/index.js' */
import { App, AppSchedule, Plugin } from '../../app/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Gizmo2D, GizmoSettings } from '../core/index.js'
import { genenerateDrawGizmo2Dsystem } from '../systems/index.js'

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
      .getWorld()
      .setResourceByTypeId(typeidGeneric(Gizmo2D, [label]), new Gizmo2D(label, settings))
    app
      .registerSystem(AppSchedule.Update, genenerateDrawGizmo2Dsystem(label))
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