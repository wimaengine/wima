/** @import { Constructor } from '../../reflect/index.js' */
import { App, AppSchedule, Plugin } from '../../app/index.js'
import { typeidGeneric } from '../../reflect/index.js'
import { Gizmo3D, GizmoSettings } from '../core/index.js'
import { genenerateDrawGizmo3Dsystem } from '../systems/index.js'

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
      .getWorld()
      .setResourceByTypeId(typeidGeneric(Gizmo3D, [label]), new Gizmo3D(label, settings))
    app
      .registerSystem(AppSchedule.Update, genenerateDrawGizmo3Dsystem(label))
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