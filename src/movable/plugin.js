import {
  Velocity2D,
  Rotation2D,
  Acceleration2D,
  Torque2D,
  Velocity3D,
  Rotation3D,
  Acceleration3D,
  Torque3D
} from './components/index.js'
import { Dimension } from '../utils/index.js'
import { App } from '../app/index.js'

export class MovablePlugin {

  /**
   * @readonly
   * @type {Dimension}
   */
  dimension

  /**
   * @param {MovablePluginOptions} options
   */
  constructor({ dimension } = {}) {
    this.dimension = dimension ?? Dimension.Both
  }

  /**
   * @param {App} app
   */
  register(app) {
    const { dimension } = this

    if (
      dimension === Dimension.Two ||
      dimension === Dimension.Both
    ) {
      app
        .registerType(Velocity2D)
        .registerType(Rotation2D)
        .registerType(Acceleration2D)
        .registerType(Torque2D)
    }
    if (
      dimension === Dimension.Three ||
      dimension === Dimension.Both
    ) {
      app
        .registerType(Velocity3D)
        .registerType(Rotation3D)
        .registerType(Acceleration3D)
        .registerType(Torque3D)
    }
  }
}

/**
 * @typedef MovablePluginOptions
 * @property {Dimension} [dimension]
 */